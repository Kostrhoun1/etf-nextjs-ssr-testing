/**
 * Backtest Calculations
 *
 * Core mathematical functions for portfolio backtesting.
 * All return values are decimals (e.g., 0.07 for 7%, -0.15 for -15%)
 */

import type {
  TimeSeriesPoint,
  MonthlyReturn,
  AnnualReturn,
  DrawdownPeriod,
  HorizonAnalysis,
  BacktestSummary,
  BacktestReturns,
  BacktestRisk,
  MonteCarloResult,
} from './types'

// ============================================================
// BASIC STATISTICS
// ============================================================

/**
 * Calculate arithmetic mean
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

/**
 * Calculate standard deviation (population)
 */
export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0
  const avg = mean(values)
  const squaredDiffs = values.map((v) => Math.pow(v - avg, 2))
  return Math.sqrt(mean(squaredDiffs))
}

/**
 * Annualize monthly standard deviation
 * σ_annual = σ_monthly × √12
 */
export function annualizeMonthlyStdDev(monthlyStdDev: number): number {
  return monthlyStdDev * Math.sqrt(12)
}

/**
 * Kolik datových kroků připadá na rok.
 *
 * DŮLEŽITÉ: časová řada je DENNÍ (~252 obchodních dní/rok), ne měsíční.
 * Anualizace rizika (σ×√N, μ×N) musí použít skutečnou frekvenci, jinak by
 * denní σ×√12 podhodnotila volatilitu ~4,6× a nafoukla Sharpe. Frekvenci
 * proto odvozujeme z dat (funguje pro denní i měsíční řadu).
 */
// Známé krize (start = přibližný vrchol před propadem, end = konec/dno fáze). Ukazujeme jen ty,
// jejichž START pokrývají data portfolia (jinak bychom propad podhodnotili → skryjeme = poctivé).
export const STRESS_WINDOWS: { key: string; name: string; start: string; end: string }[] = [
  { key: 'dotcom', name: 'Splasknutí dot-com bubliny', start: '2000-03-01', end: '2002-10-31' },
  { key: 'gfc', name: 'Finanční krize 2008', start: '2007-10-01', end: '2009-03-31' },
  { key: 'covid', name: 'Covid krach', start: '2020-02-01', end: '2020-04-30' },
  { key: 'bear2022', name: 'Medvědí trh 2022', start: '2022-01-01', end: '2022-10-31' },
]

export interface StressPeriodResult {
  key: string
  name: string
  startDate: string
  troughDate: string
  drop: number // desetinné, záporné (peak→dno v okně krize)
  recoveryMonths: number | null // od dna zpět na předkrizový vrchol; null = do konce dat se nezotavil
}

/**
 * Pro každou známou krizi spočítá, jak hluboko portfolio v tom okně kleslo (vrchol→dno)
 * a za jak dlouho se od dna vrátilo na předkrizový vrchol.
 * Počítá z DENNÍHO time-weighted NAV (bez vkladů), takže sedí s tabulkou propadů.
 */
export function calculateStressPeriods(
  nav: TimeSeriesPoint[],
  windows = STRESS_WINDOWS
): StressPeriodResult[] {
  if (nav.length < 2) return []
  const dataStart = nav[0].date
  const out: StressPeriodResult[] = []
  for (const w of windows) {
    const wStart = new Date(w.start)
    const wEnd = new Date(w.end)
    if (wStart < dataStart) continue // nemáme předkrizový vrchol → skryjeme
    const inWin = nav.filter((p) => p.date >= wStart && p.date <= wEnd)
    if (inWin.length < 2) continue
    let peak = inWin[0].value
    let drop = 0
    let troughDate = inWin[0].date
    let peakAtTrough = inWin[0].value
    for (const p of inWin) {
      if (p.value > peak) peak = p.value
      else if (peak > 0) {
        const d = p.value / peak - 1
        if (d < drop) {
          drop = d
          troughDate = p.date
          peakAtTrough = peak
        }
      }
    }
    if (drop >= 0) continue
    // Zotavení: první bod PO dnu (v celé řadě), kde se NAV vrátí na předkrizový vrchol.
    let recoveryMonths: number | null = null
    for (const p of nav) {
      if (p.date > troughDate && p.value >= peakAtTrough) {
        recoveryMonths = monthsBetween(troughDate, p.date)
        break
      }
    }
    out.push({ key: w.key, name: w.name, startDate: wStart.toISOString(), troughDate: troughDate.toISOString(), drop, recoveryMonths })
  }
  return out
}

export interface RollingReturnResult {
  years: number
  average: number // anualizovaný, desetinný
  high: number
  low: number
  count: number
  positiveShare: number // podíl oken s kladným výnosem (0–1)
}

/**
 * Rolling (klouzavé) výnosy: pro každé okno délky N let vezme VŠECHNY možné začátky v historii
 * a spočítá anualizovaný výnos → nejhorší / průměr / nejlepší. Ukazuje „záleželo, kdy jsi začal".
 * Z EUR NAV (jako ostatní výnos/riziko) → start-nezávislé a konzistentní s CAGR.
 */
export function calculateRollingReturns(
  nav: TimeSeriesPoint[],
  periodsYears: number[] = [1, 5, 10, 15]
): RollingReturnResult[] {
  const m = resampleMonthEnd(nav)
  const out: RollingReturnResult[] = []
  for (const years of periodsYears) {
    const w = years * 12
    if (m.length <= w) continue
    const rets: number[] = []
    for (let i = 0; i + w < m.length; i++) {
      const a = m[i].value
      const b = m[i + w].value
      if (a > 0) rets.push(Math.pow(b / a, 1 / years) - 1)
    }
    if (rets.length === 0) continue
    const positive = rets.filter((r) => r > 0).length
    out.push({ years, average: mean(rets), high: Math.max(...rets), low: Math.min(...rets), count: rets.length, positiveShare: positive / rets.length })
  }
  return out
}

/**
 * „Underwater" řada – pro každý měsíc, jak hluboko byla hodnota pod dosavadním vrcholem
 * (0 na vrcholech, záporné ve ztrátě). Z EUR NAV (jako ostatní riziko) → start-nezávislé.
 */
export function calculateDrawdownSeries(nav: TimeSeriesPoint[]): { date: string; drawdown: number }[] {
  const monthly = resampleMonthEnd(nav)
  let peak = -Infinity
  return monthly.map((p) => {
    if (p.value > peak) peak = p.value
    return { date: p.date.toISOString(), drawdown: peak > 0 ? p.value / peak - 1 : 0 }
  })
}

/**
 * Převzorkuje časovou řadu na měsíční body (poslední hodnota v každém měsíci = konec měsíce).
 * Denní řada (~252/rok) → ~12/rok. Kompaktní pro přenos i pro rolling/krizové výpočty.
 */
export function resampleMonthEnd(series: TimeSeriesPoint[]): TimeSeriesPoint[] {
  if (series.length === 0) return []
  const byMonth = new Map<string, TimeSeriesPoint>()
  for (const p of series) {
    // Poslední bod daného měsíce přepíše dřívější → zůstane konec měsíce. Řada je chronologická.
    byMonth.set(`${p.date.getFullYear()}-${p.date.getMonth()}`, p)
  }
  return [...byMonth.values()]
}

export function periodsPerYear(evolution: TimeSeriesPoint[]): number {
  if (evolution.length < 2) return 12
  const years = yearsBetween(evolution[0].date, evolution[evolution.length - 1].date)
  if (years <= 0) return 12
  return (evolution.length - 1) / years
}

// ============================================================
// RETURN CALCULATIONS
// ============================================================

/**
 * Calculate Compound Annual Growth Rate (CAGR)
 *
 * CAGR = (finalValue / initialValue)^(1/years) - 1
 */
export function calculateCAGR(
  initialValue: number,
  finalValue: number,
  years: number
): number {
  if (initialValue <= 0 || years <= 0) return 0
  return Math.pow(finalValue / initialValue, 1 / years) - 1
}

/**
 * Calculate monthly returns from time series
 */
export function calculateMonthlyReturns(
  evolution: TimeSeriesPoint[]
): MonthlyReturn[] {
  if (evolution.length < 2) return []

  const returns: MonthlyReturn[] = []

  for (let i = 1; i < evolution.length; i++) {
    const prevValue = evolution[i - 1].value
    const currValue = evolution[i].value
    const date = evolution[i].date

    if (prevValue > 0) {
      returns.push({
        date,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        return: (currValue - prevValue) / prevValue,
      })
    }
  }

  return returns
}

/**
 * Calculate annual returns from monthly returns
 */
export function calculateAnnualReturns(
  monthlyReturns: MonthlyReturn[]
): AnnualReturn[] {
  if (monthlyReturns.length === 0) return []

  // Group by year
  const byYear: Record<number, number[]> = {}

  for (const mr of monthlyReturns) {
    if (!byYear[mr.year]) byYear[mr.year] = []
    byYear[mr.year].push(mr.return)
  }

  // Calculate compound return for each year
  const annualReturns: AnnualReturn[] = []

  for (const [year, returns] of Object.entries(byYear)) {
    // Only include complete years (12 months) or first/last year
    const compoundReturn = returns.reduce((acc, r) => acc * (1 + r), 1) - 1

    annualReturns.push({
      year: parseInt(year),
      return: compoundReturn,
    })
  }

  return annualReturns.sort((a, b) => a.year - b.year)
}

/**
 * Get best N items sorted by return (descending)
 */
export function getBestReturns<T extends { return: number }>(
  items: T[],
  n: number
): T[] {
  return [...items].sort((a, b) => b.return - a.return).slice(0, n)
}

/**
 * Get worst N items sorted by return (ascending)
 */
export function getWorstReturns<T extends { return: number }>(
  items: T[],
  n: number
): T[] {
  return [...items].sort((a, b) => a.return - b.return).slice(0, n)
}

// ============================================================
// RISK CALCULATIONS
// ============================================================

/**
 * Calculate Sharpe Ratio
 *
 * Sharpe = (R_portfolio - R_riskfree) / σ_portfolio
 *
 * Uses annualized values
 */
export function calculateSharpeRatio(
  portfolioReturn: number,
  riskFreeRate: number,
  standardDeviation: number
): number {
  if (standardDeviation === 0) return 0
  return (portfolioReturn - riskFreeRate) / standardDeviation
}

/**
 * Calculate Value at Risk (95%) using variance-covariance method
 *
 * VaR(95%) = μ_annual - 1.65 × σ_annual
 *
 * Where:
 * - μ_annual = mean step return × periodsPerYear
 * - σ_annual = step std dev × √periodsPerYear
 * - 1.65 is the z-score for 95% confidence (one-tailed)
 *
 * periodsPerYear odvozeno z dat (denní řada ~252), ne napevno 12.
 */
export function calculateVaR95(stepReturns: number[], periodsPerYear: number = 12): number {
  if (stepReturns.length === 0) return 0

  const stepMean = mean(stepReturns)
  const stepStd = standardDeviation(stepReturns)

  const annualMean = stepMean * periodsPerYear
  const annualStd = stepStd * Math.sqrt(periodsPerYear)

  return annualMean - 1.65 * annualStd
}

/**
 * Calculate all drawdown periods
 *
 * Drawdown = (current - peak) / peak
 */
export function calculateDrawdowns(
  evolution: TimeSeriesPoint[]
): DrawdownPeriod[] {
  if (evolution.length < 2) return []

  const drawdowns: DrawdownPeriod[] = []
  let peak = evolution[0].value
  let peakDate = evolution[0].date
  let inDrawdown = false
  let currentDrawdown: Partial<DrawdownPeriod> | null = null

  for (let i = 1; i < evolution.length; i++) {
    const point = evolution[i]
    const drawdownDepth = (point.value - peak) / peak

    if (point.value >= peak) {
      // New peak or recovery
      if (inDrawdown && currentDrawdown) {
        // End of drawdown
        currentDrawdown.endDate = point.date
        currentDrawdown.recovered = true
        currentDrawdown.lengthMonths = monthsBetween(
          currentDrawdown.startDate!,
          point.date
        )
        drawdowns.push(currentDrawdown as DrawdownPeriod)
        currentDrawdown = null
        inDrawdown = false
      }
      peak = point.value
      peakDate = point.date
    } else {
      // In drawdown
      if (!inDrawdown) {
        // Start new drawdown
        inDrawdown = true
        currentDrawdown = {
          startDate: peakDate,
          troughDate: point.date,
          endDate: null,
          depth: drawdownDepth,
          lengthMonths: 0,
          recovered: false,
        }
      } else if (currentDrawdown && drawdownDepth < currentDrawdown.depth!) {
        // Deeper trough
        currentDrawdown.troughDate = point.date
        currentDrawdown.depth = drawdownDepth
      }
    }
  }

  // Handle ongoing drawdown
  if (inDrawdown && currentDrawdown) {
    const lastPoint = evolution[evolution.length - 1]
    currentDrawdown.endDate = null
    currentDrawdown.recovered = false
    currentDrawdown.lengthMonths = monthsBetween(
      currentDrawdown.startDate!,
      lastPoint.date
    )
    drawdowns.push(currentDrawdown as DrawdownPeriod)
  }

  return drawdowns
}

/**
 * Get the deepest drawdown (by depth)
 */
export function getDeepestDrawdown(
  drawdowns: DrawdownPeriod[]
): DrawdownPeriod | null {
  if (drawdowns.length === 0) return null
  return drawdowns.reduce((deepest, d) =>
    d.depth < deepest.depth ? d : deepest
  )
}

/**
 * Get the longest drawdown (by duration)
 */
export function getLongestDrawdown(
  drawdowns: DrawdownPeriod[]
): DrawdownPeriod | null {
  if (drawdowns.length === 0) return null
  return drawdowns.reduce((longest, d) =>
    d.lengthMonths > longest.lengthMonths ? d : longest
  )
}

// ============================================================
// INVESTMENT HORIZON ANALYSIS
// ============================================================

/**
 * Calculate probability of positive return for different holding periods
 *
 * For each period length, calculate how many rolling periods had positive returns
 */
export function calculateHorizonAnalysis(
  evolution: TimeSeriesPoint[],
  maxYears: number = 10
): HorizonAnalysis[] {
  const results: HorizonAnalysis[] = []

  for (let years = 1; years <= maxYears; years++) {
    const months = years * 12

    if (evolution.length <= months) {
      // Not enough data
      results.push({
        years,
        periodsWithPositiveReturn: 0,
        totalPeriods: 0,
        percentagePositive: 0,
      })
      continue
    }

    let positiveCount = 0
    let totalPeriods = 0

    // Rolling window
    for (let i = 0; i <= evolution.length - months - 1; i++) {
      const startValue = evolution[i].value
      const endValue = evolution[i + months].value
      const periodReturn = (endValue - startValue) / startValue

      totalPeriods++
      if (periodReturn > 0) positiveCount++
    }

    results.push({
      years,
      periodsWithPositiveReturn: positiveCount,
      totalPeriods,
      percentagePositive: totalPeriods > 0 ? positiveCount / totalPeriods : 0,
    })
  }

  return results
}

// ============================================================
// MONTE CARLO SIMULATION
// ============================================================

/**
 * Generate random number from normal distribution using Box-Muller transform
 */
function randomNormal(mean: number, stdDev: number): number {
  const u1 = Math.random()
  const u2 = Math.random()
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return z0 * stdDev + mean
}

/**
 * Run Monte Carlo simulation
 *
 * Generates multiple future paths based on historical mean and std dev
 */
export function runMonteCarlo(
  initialValue: number,
  monthlyMean: number,
  monthlyStdDev: number,
  forecastMonths: number,
  simulations: number = 600
): MonteCarloResult[] {
  // Run all simulations
  const allPaths: number[][] = []

  for (let sim = 0; sim < simulations; sim++) {
    const path: number[] = [initialValue]

    for (let month = 0; month < forecastMonths; month++) {
      const monthlyReturn = randomNormal(monthlyMean, monthlyStdDev)
      const newValue = path[path.length - 1] * (1 + monthlyReturn)
      path.push(Math.max(0, newValue)) // Prevent negative values
    }

    allPaths.push(path)
  }

  // Calculate percentiles at each time point
  const percentiles = [
    { p: 0.023, label: 'Very bad (-2σ)' },
    { p: 0.159, label: 'Bad (-σ)' },
    { p: 0.5, label: 'Average' },
    { p: 0.841, label: 'Good (σ)' },
    { p: 0.977, label: 'Great (2σ)' },
  ]

  const results: MonteCarloResult[] = []
  const startDate = new Date()

  for (const { p, label } of percentiles) {
    const evolution: TimeSeriesPoint[] = []

    for (let month = 0; month <= forecastMonths; month++) {
      // Get all values at this month
      const valuesAtMonth = allPaths.map((path) => path[month])
      valuesAtMonth.sort((a, b) => a - b)

      // Get percentile value
      const index = Math.floor(p * valuesAtMonth.length)
      const value = valuesAtMonth[Math.min(index, valuesAtMonth.length - 1)]

      const date = new Date(startDate)
      date.setMonth(date.getMonth() + month)

      evolution.push({ date, value })
    }

    results.push({
      percentile: p,
      label,
      evolution,
      finalValue: evolution[evolution.length - 1].value,
    })
  }

  return results
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculate months between two dates
 */
function monthsBetween(start: Date, end: Date): number {
  const years = end.getFullYear() - start.getFullYear()
  const months = end.getMonth() - start.getMonth()
  return years * 12 + months
}

/**
 * Calculate years between two dates (fractional)
 */
export function yearsBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime()
  return ms / (365.25 * 24 * 60 * 60 * 1000)
}

// ============================================================
// AGGREGATE CALCULATIONS
// ============================================================

/**
 * Calculate complete summary metrics
 */
export function calculateSummary(
  marketNav: TimeSeriesPoint[],   // time-weighted NAV bez vkladů (pro výnos/riziko)
  realFinalValue: number,          // reálná konečná hodnota (s vklady) – jen k zobrazení
  totalContributed: number,        // reálně vložené peníze
  riskFreeRate: number = 0.02 // ~2 % = přibližný vážený průměr české bezrizikové sazby (ČNB 2W repo) 2008–2026; výnosy jsou v Kč, proto CZK sazba, ne Euribor
): BacktestSummary {
  if (marketNav.length < 2) {
    return {
      amountInvested: totalContributed,
      netAssetValue: realFinalValue,
      cagr: 0,
      standardDeviation: 0,
      sharpeRatio: 0,
      sortinoRatio: 0,
    }
  }

  const startNav = marketNav[0].value
  const endNav = marketNav[marketNav.length - 1].value
  const years = yearsBetween(marketNav[0].date, marketNav[marketNav.length - 1].date)

  // Riziko (σ, Sharpe, Sortino) počítáme z MĚSÍČNÍCH výnosů (month-end resample), ne z denní
  // řady. Důvod: zdrojová denní data mají ojedinělé vadné ticky na začátku měsíce (splice
  // denního ETF a měsíčního zdroje), které denní σ×√252 nafukovaly (~13 % → 31 % u All-World).
  // Month-end sampling je zahodí (bere poslední den měsíce) a je to i standardní metodika –
  // stejně už počítá drawdown (resampleMonthEnd). CAGR zůstává z krajních bodů denní řady.
  const monthlyReturns = calculateMonthlyReturns(resampleMonthEnd(marketNav))
  const monthlyReturnValues = monthlyReturns.map((r) => r.return)

  const cagr = calculateCAGR(startNav, endNav, years) // time-weighted výnos strategie (bez vkladů)
  const stepStdDev = standardDeviation(monthlyReturnValues)
  // Anualizace podle SKUTEČNÉ frekvence dat (měsíční ~12/rok).
  const ppy = years > 0 ? monthlyReturnValues.length / years : 12
  const annualStdDev = stepStdDev * Math.sqrt(ppy)
  const sharpe = calculateSharpeRatio(cagr, riskFreeRate, annualStdDev)

  // Sortino: jako Sharpe, ale v riziku jen ZÁPORNÉ kroky (downside deviation).
  // Suma čtverců záporných / VŠECHNY kroky (standardní def.), anualizace stejnou frekvencí.
  const downsideSq = monthlyReturnValues.reduce((a, r) => a + (r < 0 ? r * r : 0), 0)
  const downsideStep = monthlyReturnValues.length > 0 ? Math.sqrt(downsideSq / monthlyReturnValues.length) : 0
  const annualDownside = downsideStep * Math.sqrt(ppy)
  const sortino = annualDownside > 0 ? (cagr - riskFreeRate) / annualDownside : 0

  return {
    amountInvested: totalContributed,
    netAssetValue: realFinalValue,
    cagr,
    standardDeviation: annualStdDev,
    sharpeRatio: sharpe,
    sortinoRatio: sortino,
  }
}

/**
 * Calculate complete returns analysis
 */
export function calculateReturnsAnalysis(
  evolution: TimeSeriesPoint[]
): BacktestReturns {
  const monthlyReturns = calculateMonthlyReturns(evolution)
  const annualReturns = calculateAnnualReturns(monthlyReturns)

  const positiveMonths = monthlyReturns.filter((r) => r.return > 0).length
  const positiveYears = annualReturns.filter((r) => r.return > 0).length

  return {
    monthlyReturns,
    annualReturns,
    bestYears: getBestReturns(annualReturns, 3),
    worstYears: getWorstReturns(annualReturns, 3),
    bestMonths: getBestReturns(monthlyReturns, 3),
    worstMonths: getWorstReturns(monthlyReturns, 3),
    positiveMonths,
    totalMonths: monthlyReturns.length,
    positiveYears,
    totalYears: annualReturns.length,
  }
}

/**
 * Calculate complete risk analysis
 */
export function calculateRiskAnalysis(
  evolution: TimeSeriesPoint[]
): BacktestRisk {
  const monthlyReturns = calculateMonthlyReturns(evolution)
  const monthlyReturnValues = monthlyReturns.map((r) => r.return)

  const allDrawdowns = calculateDrawdowns(evolution)
  const deepestDrawdown = getDeepestDrawdown(allDrawdowns)
  const longestDrawdown = getLongestDrawdown(allDrawdowns)

  const defaultDrawdown: DrawdownPeriod = {
    startDate: new Date(),
    troughDate: new Date(),
    endDate: null,
    depth: 0,
    lengthMonths: 0,
    recovered: true,
  }

  return {
    allDrawdowns,
    maxDrawdown: deepestDrawdown || defaultDrawdown,
    deepestDrawdown: deepestDrawdown || defaultDrawdown,
    longestDrawdown: longestDrawdown || defaultDrawdown,
    valueAtRisk95: calculateVaR95(monthlyReturnValues, periodsPerYear(evolution)),
  }
}
