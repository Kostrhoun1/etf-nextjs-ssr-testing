import { NextRequest, NextResponse } from 'next/server'
import {
  runBacktest,
  runBacktestWithForecasts,
} from '@/lib/backtest/engine'
import { resampleMonthEnd, calculateStressPeriods, calculateDrawdownSeries, calculateRollingReturns } from '@/lib/backtest/calculations'
import type { BacktestInput, PortfolioItem, RebalancingStrategy } from '@/lib/backtest/types'

type Currency = 'EUR' | 'CZK' | 'USD'

interface SimulateRequestBody {
  portfolio: Array<{
    isin: string
    name: string
    weight: number
    ter: number
    indexCode: string
  }>
  startDate: string
  endDate: string
  initialAmount: number
  rebalancingStrategy?: RebalancingStrategy
  includeMonteCarlo?: boolean
  forecastYears?: number
  currency?: Currency
  contributions?: {
    amount: number
    frequency: 'monthly' | 'quarterly' | 'yearly'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SimulateRequestBody = await request.json()

    // Validate required fields
    if (!body.portfolio || body.portfolio.length === 0) {
      return NextResponse.json(
        { error: 'Portfolio is required and must not be empty' },
        { status: 400 }
      )
    }

    if (!body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      )
    }

    // Validate weights sum to 1
    const totalWeight = body.portfolio.reduce((sum, item) => sum + item.weight, 0)
    if (Math.abs(totalWeight - 1) > 0.01) {
      return NextResponse.json(
        { error: `Portfolio weights must sum to 1 (got ${totalWeight})` },
        { status: 400 }
      )
    }

    const currency = body.currency || 'CZK'
    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)

    // FX řeší engine: každý index se převede ze své zdrojové měny (USD/EUR) do cílové
    // měny po dnech JEŠTĚ PŘED složením portfolia. Částky uživatele (vklad, příspěvky)
    // se proto berou přímo v cílové měně a příspěvky se nakupují za kurz daného dne
    // (dřívější přepočet startovním kurzem celé období podhodnocoval/nadhodnocoval DCA).
    const input: BacktestInput = {
      portfolio: body.portfolio.map((item) => ({
        isin: item.isin,
        name: item.name,
        weight: item.weight,
        ter: item.ter,
        indexCode: item.indexCode,
      })),
      startDate,
      endDate,
      initialAmount: body.initialAmount || 10000,
      rebalancingStrategy: body.rebalancingStrategy || 'yearly',
      contributions: body.contributions,
      currency,
    }

    // Run backtest (celý v cílové měně)
    let result
    if (body.includeMonteCarlo) {
      result = await runBacktestWithForecasts(input, body.forecastYears || 10)
    } else {
      result = await runBacktest(input)
    }

    const convertedEvolution = result.evolution
    const convertedSummary = result.summary

    // Krizové testy, propady i rolling returns z marketNav – ten je teď v cílové měně,
    // takže všechno (částky, CAGR, propady) sedí navzájem i s evolution.
    const stressPeriods = calculateStressPeriods(result.marketNav ?? [])
    const drawdownSeries = calculateDrawdownSeries(result.marketNav ?? [])
    const rollingReturns = calculateRollingReturns(result.marketNav ?? [])
    // Měsíční NAV v cílové měně (kompaktní).
    const marketNavMonthly = result.marketNav
      ? resampleMonthEnd(result.marketNav).map((p) => ({ date: p.date.toISOString(), value: p.value }))
      : []

    // Serialize dates for JSON response (syrový denní marketNav do payloadu neposíláme)
    const { marketNav: _rawMarketNav, ...resultRest } = result
    const serializedResult = {
      ...resultRest,
      currency,
      marketNavMonthly,
      stressPeriods,
      drawdownSeries,
      rollingReturns,
      input: {
        ...result.input,
        startDate: result.input.startDate.toISOString(),
        endDate: result.input.endDate.toISOString(),
      },
      summary: convertedSummary,
      evolution: convertedEvolution.map((p) => ({
        date: p.date.toISOString(),
        value: p.value,
      })),
      returns: {
        ...result.returns,
        monthlyReturns: result.returns.monthlyReturns.map((r) => ({
          ...r,
          date: r.date.toISOString(),
        })),
      },
      risk: {
        ...result.risk,
        maxDrawdown: serializeDrawdown(result.risk.maxDrawdown),
        deepestDrawdown: serializeDrawdown(result.risk.deepestDrawdown),
        longestDrawdown: serializeDrawdown(result.risk.longestDrawdown),
        allDrawdowns: result.risk.allDrawdowns.map(serializeDrawdown),
      },
      monteCarlo: result.monteCarlo?.map((mc) => ({
        ...mc,
        evolution: mc.evolution.map((p) => ({
          date: p.date.toISOString(),
          value: p.value,
        })),
      })),
    }

    return NextResponse.json(serializedResult)
  } catch (error) {
    console.error('Backtest error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

function serializeDrawdown(d: {
  startDate: Date
  troughDate: Date
  endDate: Date | null
  depth: number
  lengthMonths: number
  recovered: boolean
}) {
  return {
    ...d,
    startDate: d.startDate.toISOString(),
    troughDate: d.troughDate.toISOString(),
    endDate: d.endDate?.toISOString() || null,
  }
}
