/**
 * Serverový předpočet backtestu pro stránky, které ukazují PEVNÉ portfolio (modelová portfolia).
 *
 * PROČ: `PortfolioBacktest` dřív při KAŽDÉM zobrazení stránky poslal 2× POST /api/backtest/simulate
 * (portfolio + benchmark, ~3 s CPU každý), přestože se data mění jednou denně (deep dive 17. 10. 2026).
 * Teď se výchozí varianta (Kč) spočítá jednou při ISR renderu stránky stejným jádrem jako API
 * (`simulateAndSerialize`) – čísla jsou tedy totožná – a prohlížeč volá API jen po přepnutí měny.
 */
import { simulateAndSerialize, type Currency } from './simulate'

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

export async function predpocitejPortfolio(items: Polozka[], start: string, cur: Currency = 'CZK'): Promise<PortfolioVysledek | null> {
  try {
    const r = await simulateAndSerialize({
      portfolio: items.map((i) => ({ isin: i.indexCode, name: i.indexCode, weight: i.weight, ter: i.ter, indexCode: i.indexCode })),
      startDate: start,
      endDate: new Date().toISOString().split('T')[0],
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
