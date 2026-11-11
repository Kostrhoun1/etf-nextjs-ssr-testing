/**
 * Serverový předpočet backtestu pro stránky, které ukazují PEVNÉ portfolio (modelová portfolia).
 *
 * PROČ: `PortfolioBacktest` dřív při KAŽDÉM zobrazení stránky poslal 2× POST /api/backtest/simulate
 * (portfolio + benchmark, ~3 s CPU každý), přestože se data mění jednou denně (deep dive 17. 10. 2026).
 * Teď se výchozí varianta (Kč) spočítá jednou při ISR renderu stránky stejným jádrem jako API
 * (`simulateAndSerialize`) – čísla jsou tedy totožná – a prohlížeč volá API jen po přepnutí měny.
 */
import { simulateAndSerialize, pripravPozadavek, type Currency } from './simulate'
import { klicPredpoctu, type TeloScenare } from './predpocitaneScenare'
import type { BacktestResult } from '@/components/design-preview/BacktestWidget'

export interface PortfolioVysledek {
  summary: { cagr: number; standardDeviation: number; netAssetValue: number; amountInvested: number }
  returns: { annualReturns: { year: number; return: number }[]; positiveYears: number; totalYears: number }
  risk: { maxDrawdown: { depth: number; lengthMonths: number; recovered: boolean; troughDate: string; startDate: string; endDate: string | null } }
  evolution: { date: string; value: number }[]
  stressPeriods?: { key: string; name: string; drop: number; recoveryMonths: number | null; troughDate: string }[]
  /** Datum kurzu, kterým se přepočetl poslední bod (YYYY-MM-DD). Kontrola dat: má být = konec simulace. */
  kurzyDo?: string
}

export const POCATECNI_VKLAD: Record<Currency, number> = { CZK: 100000, EUR: 4000, USD: 4500 }

/** Jedna položka portfolia (tvar z portfolioData.ts – BacktestItem). */
type Polozka = { indexCode: string; weight: number; ter: number }

/** `konecDne` (ISO den) = volitelný poslední den simulace; bez něj do dneška (data rozhodnou, kde řada končí). */
export async function predpocitejPortfolio(items: Polozka[], start: string, cur: Currency = 'CZK', konecDne?: string): Promise<PortfolioVysledek | null> {
  try {
    const r = await simulateAndSerialize({
      portfolio: items.map((i) => ({ isin: i.indexCode, name: i.indexCode, weight: i.weight, ter: i.ter, indexCode: i.indexCode })),
      startDate: start,
      endDate: konecDne ?? new Date().toISOString().split('T')[0],
      initialAmount: POCATECNI_VKLAD[cur],
      rebalancingStrategy: 'yearly',
      currency: cur,
    }) as unknown as PortfolioVysledek
    // Graf vzorkuje ~160 bodů a klouzavé výnosy berou první bod měsíce → stačí první bod každého
    // měsíce + poslední bod (denní řada by zbytečně nafoukla HTML stránky).
    const mesicni: PortfolioVysledek['evolution'] = []
    let posledni = ''
    for (const p of r.evolution) {
      const k = p.date.slice(0, 7)
      if (k !== posledni) { mesicni.push(p); posledni = k }
    }
    const konec = r.evolution[r.evolution.length - 1]
    if (konec && mesicni[mesicni.length - 1] !== konec) mesicni.push(konec)
    return {
      summary: r.summary,
      returns: { annualReturns: r.returns.annualReturns, positiveYears: r.returns.positiveYears, totalYears: r.returns.totalYears },
      risk: { maxDrawdown: r.risk.maxDrawdown },
      evolution: mesicni,
      stressPeriods: (r as unknown as { stressPeriods?: PortfolioVysledek['stressPeriods'] }).stressPeriods ?? [],
      ...(r.kurzyDo ? { kurzyDo: r.kurzyDo } : {}),
    }
  } catch (e) {
    console.error('[predpocet] backtest portfolia selhal:', e)
    return null
  }
}

/* ===== Stránka /backtest: předpočet výsledku pro widget (úkol 3.1, 11. 11. 2026) ===== */

/**
 * Zkrátí odpověď API na to, co widget /backtest opravdu kreslí (plná odpověď ~450 kB, zkrácená ~40 kB):
 * denní řada → první bod každého měsíce + poslední bod (graf kreslí ~400 bodů; vklady widget rekonstruuje z prvního
 * obchodního dne měsíce/čtvrtletí/roku = právě z těchto bodů, takže „vloženo“ i XIRR vyjdou stejně jako z denní řady),
 * bez měsíčních výnosů, horizontů a Monte Carla, z propadů jen 5 nejhlubších (tabulka víc neukazuje).
 * Hodnoty se NEzaokrouhlují – čísla jsou bit po bitu ta z API (hlídá scripts/backtestPredpocet.test.mjs).
 */
export function zkratProWidget(r: Awaited<ReturnType<typeof simulateAndSerialize>>): BacktestResult {
  const mesicni: { date: string; value: number }[] = []
  let posledni = ''
  for (const p of r.evolution) {
    const k = p.date.slice(0, 7)
    if (k !== posledni) { mesicni.push(p); posledni = k }
  }
  const konec = r.evolution[r.evolution.length - 1]
  if (konec && mesicni[mesicni.length - 1] !== konec) mesicni.push(konec)
  const nejhlubsi = [...r.risk.allDrawdowns].sort((a, b) => a.depth - b.depth).slice(0, 5)
  return {
    evolution: mesicni,
    summary: r.summary,
    returns: { annualReturns: r.returns.annualReturns },
    ...(r.inflation ? { inflation: r.inflation } : {}),
    risk: { maxDrawdown: r.risk.maxDrawdown, allDrawdowns: nejhlubsi, valueAtRisk95: r.risk.valueAtRisk95, podilPodVaR: r.risk.podilPodVaR },
    stressPeriods: r.stressPeriods,
    drawdownSeries: r.drawdownSeries,
    rollingReturns: r.rollingReturns,
  } as BacktestResult
}

/**
 * Předpočet jednoho scénáře STEJNOU cestou jako POST /api/backtest/simulate (pripravPozadavek → simulateAndSerialize).
 * `konecDne` = den renderu (build / denní ISR). Při chybě null → widget zavolá API nebo ukáže formulář
 * (raději nic než špatně).
 */
export async function predpocitejProWidget(telo: TeloScenare, konecDne: string): Promise<{ klic: string; vysledek: BacktestResult; kontrola: string } | null> {
  try {
    const pripraveno = pripravPozadavek({ ...telo, endDate: konecDne })
    if (!pripraveno.ok) throw new Error(pripraveno.error)
    const r = await simulateAndSerialize(pripraveno.body)
    const vysledek = zkratProWidget(r)
    const konec = vysledek.evolution[vysledek.evolution.length - 1]?.date.slice(0, 10) ?? konecDne
    return { klic: klicPredpoctu(telo), vysledek, kontrola: kontrolniUdaj(telo, konec, r.summary.cagr, r.summary.netAssetValue, r.kurzyDo) }
  } catch (e) {
    console.error('[predpocet] backtest pro /backtest selhal:', e)
    return null
  }
}

/**
 * Kontrolní údaj `data-kontrola-backtest` (formát modelových portfolií: odkaz|cagr|konečná hodnota|kurz posledního bodu).
 * Denní kontrola (check-fund-data.mjs, kolo5 A) podle něj zavolá API se stejnými vstupy do téhož dne a porovná konečnou
 * hodnotu i stáří dat předpočtu na produkci (pravidlo č. 1, bod 6). Odkaz je zároveň platný odkaz do backtestu.
 */
function kontrolniUdaj(telo: TeloScenare, konec: string, cagr: number | null, nav: number, kurzyDo?: string): string {
  const q = new URLSearchParams({
    slozeni: telo.portfolio.filter((p) => p.weight > 0).map((p) => `${p.indexCode}:${Math.round(p.weight * 1e6) / 1e4}`).join(','),
    start: telo.startDate,
    amount: String(telo.initialAmount),
    vklad: String(telo.contributions?.amount ?? 0),
    freq: telo.contributions?.frequency ?? 'none',
    do: konec,
  })
  if (telo.rebalancingStrategy !== 'yearly') q.set('vyvazovani', telo.rebalancingStrategy)
  if (telo.currency !== 'CZK') q.set('mena', telo.currency)
  return `/backtest?${q.toString().replace(/%3A/g, ':').replace(/%2C/g, ',')}|${cagr ?? ''}|${nav}|${kurzyDo ?? ''}`
}
