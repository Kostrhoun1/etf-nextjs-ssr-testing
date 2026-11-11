import { runBacktest, runBacktestWithForecasts } from '@/lib/backtest/engine'
import {
  resampleMonthEnd,
  calculateStressPeriods,
  calculateDrawdownSeries,
  calculateRollingReturns,
} from '@/lib/backtest/calculations'
import type { BacktestInput, RebalancingStrategy } from '@/lib/backtest/types'
import { MIN_MESICU_RIZIKA } from '@/lib/backtest/calculations'
import { INDEX_BY_CODE } from '@/lib/backtest/indexes'

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

/* Limity: endpoint je veřejný a bez přihlášení. Bez nich šel jedním požadavkem zatížit CPU
   (libovolně dlouhé portfolio, forecastYears=1000 drží v paměti 12 mil. čísel) – na free tieru
   Vercelu přímá cesta k vyčerpání Fluid CPU. Zjištěno 17. 10. 2026. */
const MAX_SLOZEK = 15
const MAX_LET_PROGNOZY = 50
/** Povolená odchylka součtu vah od 1 (= 0,01 procentního bodu, přesnost formuláře backtestu). */
const TOLERANCE_VAH = 1e-4

export type PripravenyPozadavek = { ok: true; body: SimulateRequestBody } | { ok: false; error: string }

/**
 * Validace a normalizace těla požadavku – JEDINÁ cesta pro POST /api/backtest/simulate i pro serverový předpočet
 * stránky /backtest (úkol 3.1, 11. 11. 2026). Dřív byla jen v route.ts; předpočet ji obcházel, takže „stejné vstupy“
 * nemusely znamenat stejné tělo pro engine (např. normalizace vah). Vrací kopii, vstup nemění.
 */
export function pripravPozadavek(raw: SimulateRequestBody): PripravenyPozadavek {
  if (!raw || !Array.isArray(raw.portfolio) || raw.portfolio.length === 0 || raw.portfolio.length > MAX_SLOZEK) {
    return { ok: false, error: `Portfolio musí mít 1 až ${MAX_SLOZEK} složek.` }
  }
  // Jen indexy z manifestu – ať nejde z venku poslat libovolný kód do dotazů nad databází.
  // Poplatek konkrétního fondu: jen rozumné číslo (0–3 % ročně), a jen u indexu se známým poplatkem
  // zdroje (sourceTer) – jinak by se poplatek odečetl dvakrát (pravidlo č. 1).
  const spatnyPoplatek = raw.portfolio.find((item) => item.feeOverride !== undefined && (
    typeof item.feeOverride !== 'number' || !Number.isFinite(item.feeOverride) || item.feeOverride < 0 || item.feeOverride > 0.03 ||
    INDEX_BY_CODE[item.indexCode]?.sourceTer === undefined))
  if (spatnyPoplatek) return { ok: false, error: 'Neplatný poplatek fondu' }
  const neznamy = raw.portfolio.find((item) => !INDEX_BY_CODE[item.indexCode])
  if (neznamy) return { ok: false, error: `Neznámá třída aktiv: ${String(neznamy.indexCode).slice(0, 40)}` }

  if (!raw.startDate || !raw.endDate) return { ok: false, error: 'Chybí počáteční nebo koncové datum.' }

  // Váhy: jen konečná nezáporná čísla. Složky s vahou 0 engine vynechá (výsledek = portfolio bez nich);
  // dřív 0 % shodilo výsledek na null a UI ukázalo „0 Kč, ztráta −100 %“ (revize 19. 10. 2026).
  if (raw.portfolio.some((item) => typeof item.weight !== 'number' || !Number.isFinite(item.weight) || item.weight < 0)) {
    return { ok: false, error: 'Váha složky musí být číslo od 0 do 100 %.' }
  }
  if (!raw.portfolio.some((item) => item.weight > 0)) {
    return { ok: false, error: 'Alespoň jedna složka musí mít nenulovou váhu.' }
  }

  // Součet vah = 100 % (audit 22. 10. 2026, V9). Dřív prošlo cokoli v 99–101 % BEZ normalizace: váha 0,995 tiše
  // „ztratila“ 0,5 % portfolia při každém vyvážení (S&P 500 od 2005: CAGR 10,14 % místo 10,70 %).
  // ROZHODNUTÍ: mimo ±0,01 procentního bodu (TOLERANCE_VAH) → 400; uvnitř se váhy NORMALIZUJÍ na přesně 1
  // (zbytky plovoucí čárky typu 7,5 + 7,5 + … a zaokrouhlení formuláře na setiny procenta). Výsledek pak
  // vždy odpovídá portfoliu, jehož váhy dávají 100 %.
  const totalWeight = raw.portfolio.reduce((sum, item) => sum + item.weight, 0)
  if (Math.abs(totalWeight - 1) > TOLERANCE_VAH) {
    return { ok: false, error: `Váhy složek musí dát dohromady 100 % (teď ${(totalWeight * 100).toLocaleString('cs-CZ', { maximumFractionDigits: 4 })} %).` }
  }
  return {
    ok: true,
    body: {
      ...raw,
      ...(raw.forecastYears != null
        ? { forecastYears: Math.min(Math.max(Math.round(Number(raw.forecastYears) || 10), 1), MAX_LET_PROGNOZY) }
        : {}),
      portfolio: raw.portfolio.map((item) => ({ ...item, weight: item.weight / totalWeight })),
    },
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
