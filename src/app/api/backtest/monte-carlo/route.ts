import { NextRequest, NextResponse } from 'next/server'
import { runBacktest } from '@/lib/backtest/engine'
import { runMonteCarlo, mean, standardDeviation } from '@/lib/backtest/calculations'
import type { BacktestInput } from '@/lib/backtest/types'

interface MonteCarloRequestBody {
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
  forecastYears?: number
  simulations?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: MonteCarloRequestBody = await request.json()

    // Validate
    if (!body.portfolio || body.portfolio.length === 0) {
      return NextResponse.json(
        { error: 'Portfolio is required' },
        { status: 400 }
      )
    }

    // Build input for backtest to get historical stats
    const input: BacktestInput = {
      portfolio: body.portfolio,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      initialAmount: body.initialAmount || 10000,
      rebalancingStrategy: 'yearly',
    }

    // Run backtest to get monthly returns
    const backtestResult = await runBacktest(input)
    const monthlyReturns = backtestResult.returns.monthlyReturns.map((r) => r.return)

    // Calculate stats
    const monthlyMean = mean(monthlyReturns)
    const monthlyStdDev = standardDeviation(monthlyReturns)

    // Run Monte Carlo
    const forecastMonths = (body.forecastYears || 10) * 12
    const simulations = Math.min(body.simulations || 600, 1000)

    const mcResults = runMonteCarlo(
      backtestResult.summary.netAssetValue,
      monthlyMean,
      monthlyStdDev,
      forecastMonths,
      simulations
    )

    // Convert to chart-friendly format (percentiles at each month)
    const chartData: Array<{
      month: number
      percentile5: number
      percentile16: number
      percentile50: number
      percentile84: number
      percentile95: number
    }> = []

    // Get the evolution arrays from each percentile result
    const p5 = mcResults.find((r) => r.percentile === 0.023)
    const p16 = mcResults.find((r) => r.percentile === 0.159)
    const p50 = mcResults.find((r) => r.percentile === 0.5)
    const p84 = mcResults.find((r) => r.percentile === 0.841)
    const p95 = mcResults.find((r) => r.percentile === 0.977)

    if (p5 && p16 && p50 && p84 && p95) {
      for (let i = 0; i <= forecastMonths; i++) {
        chartData.push({
          month: i,
          percentile5: p5.evolution[i]?.value || 0,
          percentile16: p16.evolution[i]?.value || 0,
          percentile50: p50.evolution[i]?.value || 0,
          percentile84: p84.evolution[i]?.value || 0,
          percentile95: p95.evolution[i]?.value || 0,
        })
      }
    }

    return NextResponse.json({
      chartData,
      stats: {
        currentValue: backtestResult.summary.netAssetValue,
        monthlyMean,
        monthlyStdDev,
        annualMean: monthlyMean * 12,
        annualStdDev: monthlyStdDev * Math.sqrt(12),
      },
      finalValues: {
        veryBad: p5?.finalValue || 0,
        bad: p16?.finalValue || 0,
        average: p50?.finalValue || 0,
        good: p84?.finalValue || 0,
        great: p95?.finalValue || 0,
      },
    })
  } catch (error) {
    console.error('Monte Carlo error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
