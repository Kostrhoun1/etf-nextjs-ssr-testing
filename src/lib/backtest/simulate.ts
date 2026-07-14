import { runBacktest, runBacktestWithForecasts } from '@/lib/backtest/engine'
import {
  resampleMonthEnd,
  calculateStressPeriods,
  calculateDrawdownSeries,
  calculateRollingReturns,
} from '@/lib/backtest/calculations'
import type { BacktestInput, RebalancingStrategy } from '@/lib/backtest/types'

export type Currency = 'EUR' | 'CZK' | 'USD'

export interface SimulateRequestBody {
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

/**
 * Spustí backtest a serializuje výsledek do JSON-safe podoby (datumy -> ISO).
 * Sdílené jádro pro POST /api/backtest/simulate i pro serverový předpočet
 * defaultního portfolia na stránce /backtest (result-first, okamžitý paint).
 *
 * Vstup se považuje za VALIDOVANÝ (route si validaci dělá sama). FX řeší engine:
 * každý index se převede ze zdrojové měny do cílové po dnech ještě před složením
 * portfolia, takže částky uživatele se berou přímo v cílové měně.
 */
export async function simulateAndSerialize(body: SimulateRequestBody) {
  const currency = body.currency || 'CZK'
  const startDate = new Date(body.startDate)
  const endDate = new Date(body.endDate)

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

  const result = body.includeMonteCarlo
    ? await runBacktestWithForecasts(input, body.forecastYears || 10)
    : await runBacktest(input)

  const convertedEvolution = result.evolution
  const convertedSummary = result.summary

  const stressPeriods = calculateStressPeriods(result.marketNav ?? [])
  const drawdownSeries = calculateDrawdownSeries(result.marketNav ?? [])
  const rollingReturns = calculateRollingReturns(result.marketNav ?? [])
  const marketNavMonthly = result.marketNav
    ? resampleMonthEnd(result.marketNav).map((p) => ({ date: p.date.toISOString(), value: p.value }))
    : []

  const { marketNav: _rawMarketNav, ...resultRest } = result
  return {
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
    evolution: convertedEvolution.map((p) => ({ date: p.date.toISOString(), value: p.value })),
    returns: {
      ...result.returns,
      monthlyReturns: result.returns.monthlyReturns.map((r) => ({ ...r, date: r.date.toISOString() })),
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
      evolution: mc.evolution.map((p) => ({ date: p.date.toISOString(), value: p.value })),
    })),
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
