import { runBacktest, runBacktestWithForecasts } from '@/lib/backtest/engine'
import {
  resampleMonthEnd,
  calculateStressPeriods,
  calculateDrawdownSeries,
  calculateRollingReturns,
} from '@/lib/backtest/calculations'
import type { BacktestInput, RebalancingStrategy } from '@/lib/backtest/types'
import { MIN_MESICU_RIZIKA } from '@/lib/backtest/calculations'

/** Mění se s každou opravou metodiky, kterou má denní kontrola rozlišit (nasazeno / ještě ne). */
export const METODIKA_BACKTESTU = '2026-10-22'

export type Currency = 'EUR' | 'CZK' | 'USD'

export interface SimulateRequestBody {
  portfolio: Array<{
    isin: string
    name: string
    weight: number
    ter: number
    indexCode: string
    /** Roční poplatek konkrétního fondu (např. 0.0014 pro VWCE) – engine na něj přepočítá data zdrojového fondu. */
    feeOverride?: number
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

const DEN_MS = 24 * 60 * 60 * 1000
/** Nejdelší běžná burzovní přestávka (Velký pátek – Velikonoční pondělí, Vánoce/Nový rok na Xetře) – 4 dny + rezerva. */
const MAX_NEOBCHODNI_DNY = 5

/**
 * Pokrývá zadané období aspoň jeden celý kalendářní rok? (oprava hranice V8, 23. 10. 2026)
 * PROČ: V8 neanualizuje pod rok podle délky mezi PRVNÍM a POSLEDNÍM bodem dat. U kalendářního roku ale data začínají
 * až prvním obchodním dnem a končí posledním (2024: 2. 1. → 31. 12. = 364 dní = 0,997 roku; 2023: 3. 1. → 29. 12. =
 * 360 dní), takže celý rok vracel roční výnos null. Prahy „≥ 365 dní“ ani „≥ 12 měsíčních výnosů“ to neřeší
 * (2023 má mezi body 360 dní a kalendářní rok má jen 11 měsíčních výnosů konec měsíce → konec měsíce).
 * Proto se rok měří na ZADANÉM období (start/konec uživatele), pokud data krajní dny pokrývají až na neobchodní dny
 * (≤ MAX_NEOBCHODNI_DNY); začínají-li data později nebo končí dřív, platí krajní body dat. Rok = konec ≥ start + 1 rok − 1 den.
 */
export function pokryvaCelyRok(start: Date, konec: Date, rada: Array<{ date: Date }>): boolean {
  if (rada.length < 2 || Number.isNaN(start.getTime()) || Number.isNaN(konec.getTime())) return false
  const prvni = rada[0].date, posledni = rada[rada.length - 1].date
  const od = prvni.getTime() - start.getTime() <= MAX_NEOBCHODNI_DNY * DEN_MS ? start : prvni
  const doKdy = konec.getTime() - posledni.getTime() <= MAX_NEOBCHODNI_DNY * DEN_MS ? konec : posledni
  const zaRok = Date.UTC(od.getUTCFullYear() + 1, od.getUTCMonth(), od.getUTCDate())
  return zaRok <= doKdy.getTime() + DEN_MS
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
    // Složky s vahou 0 se nepočítají (engine je vynechá taky) – výsledek musí být stejný jako bez nich.
    portfolio: body.portfolio.filter((item) => item.weight > 0).map((item) => ({
      isin: item.isin,
      name: item.name,
      weight: item.weight,
      ter: item.ter,
      indexCode: item.indexCode,
      ...(typeof item.feeOverride === 'number' ? { feeOverride: item.feeOverride } : {}),
    })),
    startDate,
    endDate,
    // 0 je platná volba (jen pravidelné vklady); výchozí 10 000 jen když částka chybí úplně.
    initialAmount: Number.isFinite(body.initialAmount) && body.initialAmount >= 0 ? body.initialAmount : 10000,
    rebalancingStrategy: body.rebalancingStrategy || 'yearly',
    contributions: body.contributions,
    currency,
  }

  const result = body.includeMonteCarlo
    ? await runBacktestWithForecasts(input, body.forecastYears || 10)
    : await runBacktest(input)

  const convertedEvolution = result.evolution
  // KRATŠÍ OBDOBÍ (audit 22. 10. 2026, V8): pod rok se výnos NEanualizuje (cagr = null, UI ukáže celkový výnos
  // za období – zásada GIPS), pod 12 měsíčních výnosů se kolísavost/Sharpe/Sortino/VaR neukazují („—“).
  // Raději „—“ než „40,8 % ročně“ a „kolísavost 0,0 %“ ze 7 týdnů.
  const s = result.summary
  const malo = s.mesicnichVynosu < MIN_MESICU_RIZIKA
  const convertedSummary = {
    ...s,
    // Celý rok (např. 1. 1.–31. 12.) je rok, i když první a poslední obchodní den leží uvnitř (V8 hranice, 23. 10. 2026):
    // pak roční výnos = celkový výnos za rok (bez anualizace 360–364 dní). Jinak pod rok null.
    cagr: s.obdobiLet >= 1 ? s.cagr : pokryvaCelyRok(startDate, endDate, result.marketNav ?? []) ? s.celkovyVynos : null,
    standardDeviation: malo ? null : s.standardDeviation,
    sharpeRatio: malo ? null : s.sharpeRatio,
    sortinoRatio: malo ? null : s.sortinoRatio,
  }

  const stressPeriods = calculateStressPeriods(result.marketNav ?? [])
  const drawdownSeries = calculateDrawdownSeries(result.marketNav ?? [])
  const rollingReturns = calculateRollingReturns(result.marketNav ?? [])
  const marketNavMonthly = result.marketNav
    ? resampleMonthEnd(result.marketNav).map((p) => ({ date: p.date.toISOString(), value: p.value }))
    : []

  const { marketNav: _rawMarketNav, ...resultRest } = result
  return {
    ...resultRest,
    /** Verze metodiky výpočtu – denní kontrola (check-fund-data.mjs, audit backtest) podle ní pozná, že je
     *  oprava z auditu 22. 10. 2026 nasazená (před nasazením hlásí rozdíly jen jako varování). */
    metodika: METODIKA_BACKTESTU,
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
