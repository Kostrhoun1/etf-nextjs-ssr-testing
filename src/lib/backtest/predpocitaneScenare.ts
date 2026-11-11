/**
 * Scénáře backtestu, které stránka /backtest spočítá NA SERVERU (při buildu a pak jednou denně v ISR) a vloží do HTML
 * – úkol 3.1 plánu listopadu 2026: výsledek je vidět hned po otevření a prohlížeč nevolá API (= výpočetní čas
 * na Vercelu). API se volá až po změně vstupů uživatelem.
 *
 * Modul nesmí importovat nic serverového – používá ho i widget v prohlížeči (porovnání klíčů).
 *
 * JAK SE POZNÁ, ŽE PŘEDPOČET PLATÍ: widget sestaví tělo požadavku přesně tak, jak by ho poslal na API, a porovná
 * `klicPredpoctu(telo)` s klíči předpočtů. Shoda = stejné vstupy výpočtu → použije se předpočet; cokoli jiného
 * (jiná váha, start, vklad, měna, poplatek fondu, porovnání, `do=`) → normální volání API. Předpočet tedy nikdy
 * nenahradí výpočet s jinými vstupy (pravidlo č. 1).
 */
import { VYCHOZI_SCENAR } from './vychoziScenar'
import type { RebalancingStrategy } from './types'

export interface TeloScenare {
  portfolio: Array<{ isin: string; name: string; weight: number; ter: number; indexCode: string; feeOverride?: number }>
  startDate: string
  initialAmount: number
  rebalancingStrategy: RebalancingStrategy
  currency: 'CZK' | 'EUR' | 'USD'
  contributions?: { amount: number; frequency: 'monthly' | 'quarterly' | 'yearly' }
}

/**
 * Klíč z toho, co ovlivňuje výpočet. Engine bere poplatek z manifestu (ne `ter`), `isin` a `name` jsou jen popisky →
 * v klíči nejsou. Konec období v klíči není: předpočet platí pro „do dneška“ a widget ho použije jen bez vlastního konce.
 */
export function klicPredpoctu(t: TeloScenare): string {
  return JSON.stringify([
    t.portfolio.filter((p) => p.weight > 0).map((p) => [p.indexCode, p.weight, p.feeOverride ?? null]),
    t.startDate,
    t.initialAmount,
    t.rebalancingStrategy,
    t.currency,
    t.contributions && t.contributions.amount > 0 ? [t.contributions.amount, t.contributions.frequency] : null,
  ])
}

/** Výchozí stav widgetu (100 % S&P 500 od 1/2005, 100 000 Kč + 5 000 Kč měsíčně). */
export const TELO_VYCHOZI: TeloScenare = {
  portfolio: VYCHOZI_SCENAR.portfolio.map((p) => ({ ...p })),
  startDate: VYCHOZI_SCENAR.startDate,
  initialAmount: VYCHOZI_SCENAR.initialAmount,
  rebalancingStrategy: VYCHOZI_SCENAR.rebalancingStrategy,
  currency: VYCHOZI_SCENAR.currency,
  contributions: { ...VYCHOZI_SCENAR.contributions },
}

/**
 * Odkazy z Facebooku / Media (a 301 z /buffettovo-portfolio, next.config.ts). Tělo = co widget pošle po načtení
 * odkazu: `/backtest?portfolio=buffett-90-10&start=2002-07-01&amount=100000&contrib=none&run=1` → preset 90/10
 * (váhy 90/100 a 10/100), bez pravidelných vkladů. Když se odkaz změní a klíč přestane sedět, widget prostě zavolá
 * API (nic se nerozbije, jen se ztratí úspora) – hlídá to test scripts/backtestPredpocet.test.mjs.
 */
export const ODKAZ_BUFFETT = '/backtest?portfolio=buffett-90-10&start=2002-07-01&amount=100000&contrib=none&run=1'
export const TELO_BUFFETT: TeloScenare = {
  portfolio: [
    { isin: 'sp500', name: 'sp500', weight: 0.9, ter: 0, indexCode: 'sp500' },
    { isin: 'us_treasury_1_3y', name: 'us_treasury_1_3y', weight: 0.1, ter: 0, indexCode: 'us_treasury_1_3y' },
  ],
  startDate: '2002-07-01',
  initialAmount: 100000,
  rebalancingStrategy: 'yearly',
  currency: 'CZK',
}

/** Scénáře navíc k výchozímu (ten má vlastní prop `initialResult`, aby se v HTML neopakoval). */
export const SCENARE_Z_ODKAZU: { id: string; odkaz: string; telo: TeloScenare }[] = [
  { id: 'buffett-90-10', odkaz: ODKAZ_BUFFETT, telo: TELO_BUFFETT },
]
