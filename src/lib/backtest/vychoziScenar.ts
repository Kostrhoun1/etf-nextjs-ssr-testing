/**
 * Výchozí scénář nástroje /backtest. Sdílí ho widget (výchozí stav formuláře) i stránka, která ho při
 * ISR renderu předpočítá (result-first). Samostatný modul, protože hodnoty z 'use client' souboru
 * server nevidí. Změna tady = změna výchozího stavu widgetu i předpočtu zároveň.
 */
import type { RebalancingStrategy } from './types'

export const VYCHOZI_SCENAR = {
  portfolio: [{ isin: 'IE00B5BMR087', name: 'iShares Core S&P 500', weight: 1, ter: 0.0007, indexCode: 'sp500' }],
  startDate: '2005-01-01',
  initialAmount: 100000,
  rebalancingStrategy: 'yearly' as RebalancingStrategy,
  currency: 'CZK' as 'CZK' | 'EUR' | 'USD',
  contributions: { amount: 5000, frequency: 'monthly' as const },
}
