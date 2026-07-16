// Backtest Engine Types

export interface PortfolioItem {
  isin: string
  name: string
  weight: number // 0-1
  ter: number // e.g., 0.002 for 0.2% — jen pro zobrazení (reprezentativní ETF). NEpoužívá se pro výpočet.
  indexCode: string
  /**
   * Pokročilé nastavení: jaký roční poplatek modelovat MÍSTO toho, který je zapečený v datech.
   * Data jsou NAV reálného fondu (poplatek zdroje už v ceně) → engine přepočítá na tento poplatek.
   * undefined = data beze změny (výchozí). 0 = čistý index, co udělal trh. 0.005 = modeluj 0,5 %.
   */
  feeOverride?: number
}

export interface BacktestInput {
  portfolio: PortfolioItem[]
  startDate: Date
  endDate: Date
  initialAmount: number
  rebalancingStrategy?: RebalancingStrategy
  contributions?: ContributionPlan
  /**
   * Cílová měna simulace. Když je zadaná, engine převede KAŽDÝ index z jeho zdrojové
   * měny (viz INDEX_SOURCE_CURRENCY v engine.ts) na tuto měnu po jednotlivých dnech
   * JEŠTĚ PŘED složením portfolia. initialAmount i contributions se pak berou přímo
   * v této měně a všechny metriky (CAGR, volatilita, propady, Sharpe) vycházejí
   * konzistentně v ní. Bez zadání běží simulace v nativních jednotkách dat (bez FX) –
   * vhodné jen pro tvarové/poměrové použití (normalizovaný graf), NE pro částky.
   */
  currency?: 'EUR' | 'CZK' | 'USD'
}

export type RebalancingStrategy =
  | 'none'
  | 'monthly'
  | 'quarterly'
  | 'half-yearly'
  | 'yearly'
  | 'every-2-years'
  | 'every-3-years'
  | 'tolerance-5'
  | 'tolerance-10'
  | 'tolerance-15'
  | 'tolerance-20'

export interface ContributionPlan {
  amount: number
  frequency: 'monthly' | 'quarterly' | 'yearly'
}

export interface TimeSeriesPoint {
  date: Date
  value: number
}

export interface MonthlyReturn {
  date: Date
  year: number
  month: number
  return: number // e.g., 0.05 for 5%
}

export interface AnnualReturn {
  year: number
  return: number
}

export interface DrawdownPeriod {
  startDate: Date
  troughDate: Date
  endDate: Date | null // null if still in drawdown
  depth: number // e.g., -0.308 for -30.8%
  lengthMonths: number
  recovered: boolean
}

export interface HorizonAnalysis {
  years: number
  periodsWithPositiveReturn: number
  totalPeriods: number
  percentagePositive: number
}

export interface BacktestSummary {
  amountInvested: number
  netAssetValue: number
  cagr: number // Compound Annual Growth Rate
  standardDeviation: number // Annualized
  sharpeRatio: number
  sortinoRatio: number // like Sharpe, but only downside deviation
}

export interface BacktestReturns {
  annualReturns: AnnualReturn[]
  monthlyReturns: MonthlyReturn[]
  bestYears: AnnualReturn[]
  worstYears: AnnualReturn[]
  bestMonths: MonthlyReturn[]
  worstMonths: MonthlyReturn[]
  positiveYears: number
  totalYears: number
  positiveMonths: number
  totalMonths: number
}

export interface BacktestRisk {
  maxDrawdown: DrawdownPeriod
  longestDrawdown: DrawdownPeriod
  deepestDrawdown: DrawdownPeriod
  valueAtRisk95: number // e.g., -0.204 for -20.4%
  allDrawdowns: DrawdownPeriod[]
}

export interface BacktestInflation {
  nominalCAGR: number
  realCAGR: number
  inflationRate: number // anualizovaná inflace za období backtestu
  // Deflované řady zatím neposíláme (zdvojily by payload grafu); až je bude
  // potřebovat UI, dopočítej je z `evolution` přes inflationFactor().
  nominalEvolution?: TimeSeriesPoint[]
  realEvolution?: TimeSeriesPoint[]
}

export interface MonteCarloResult {
  percentile: number // e.g., 0.977 for 97.7%
  label: string // e.g., "Great (2σ)"
  evolution: TimeSeriesPoint[]
  finalValue: number
}

export interface RebalancingComparison {
  strategy: RebalancingStrategy
  cagr: number
  differenceFromMax: number
}

export interface BacktestResult {
  // Input echo
  input: BacktestInput

  // Time series
  evolution: TimeSeriesPoint[]

  // Market-only NAV (time-weighted, bez vkladů) – pro rolling returns / krizové testy
  marketNav?: TimeSeriesPoint[]

  // Summary metrics
  summary: BacktestSummary

  // Returns analysis
  returns: BacktestReturns

  // Risk analysis
  risk: BacktestRisk

  // Inflation impact (optional)
  inflation?: BacktestInflation

  // Investment horizon analysis
  horizons: HorizonAnalysis[]

  // Monte Carlo forecasts (optional, computed on demand)
  monteCarlo?: MonteCarloResult[]

  // Rebalancing comparison (optional, computed on demand)
  rebalancingComparison?: RebalancingComparison[]
}

// Index data from database
export interface IndexDataPoint {
  date: Date
  closePrice: number
}

export interface IndexData {
  indexCode: string
  data: IndexDataPoint[]
}
