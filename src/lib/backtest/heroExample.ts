/**
 * Reálný příklad do hera na stránce /backtest.
 *
 * Spočítá jednorázový vklad 100 000 Kč do světových akcií (FTSE All-World) od nejstarších
 * dostupných dat po dnešek – konečnou hodnotu v Kč, CAGR a nejhlubší propad. Běží na serveru,
 * stránka je ISR (revalidate 1 den), takže se to počítá max. 1× denně. Používá STEJNÝ engine
 * i přepočet měny jako /api/backtest/simulate, takže čísla sedí s nástrojem.
 *
 * Při jakékoli chybě vrací null → hero zobrazí statickou variantu (žádný pád stránky).
 */
import { runBacktest, loadExchangeRates, getExchangeRateForDate } from './engine';
import type { BacktestInput } from './types';

export interface HeroExample {
  initialCzk: number;
  finalCzk: number;
  multiple: number;      // kolikrát se vklad zhodnotil
  cagr: number;          // desetinné (0.087 = 8,7 %)
  maxDrawdown: number;   // desetinné, záporné
  startYear: number;     // skutečný rok začátku dat
}

export async function getHeroExample(): Promise<HeroExample | null> {
  try {
    const startDate = new Date('2000-01-01'); // engine si sám ořízne na nejstarší dostupná data
    const endDate = new Date();
    const initialCzk = 100000;

    const rates = await loadExchangeRates(startDate, endDate);
    if (rates.length === 0) return null;

    const startRate = getExchangeRateForDate(rates, startDate);
    const finalRate = getExchangeRateForDate(rates, endDate);
    if (!startRate || !finalRate) return null;

    const initialEur = initialCzk / startRate.eurCzk;

    const input: BacktestInput = {
      portfolio: [{ isin: 'IE00BK5BQT80', name: 'FTSE All-World', weight: 1, ter: 0.0022, indexCode: 'ftse_all_world' }],
      startDate,
      endDate,
      initialAmount: initialEur,
      rebalancingStrategy: 'yearly',
    };

    const result = await runBacktest(input);
    if (!result.evolution.length) return null;

    const finalCzk = result.summary.netAssetValue * finalRate.eurCzk;
    const actualStart = result.evolution[0]?.date;

    return {
      initialCzk,
      finalCzk,
      multiple: finalCzk / initialCzk,
      cagr: result.summary.cagr,
      maxDrawdown: result.risk.maxDrawdown.depth,
      startYear: actualStart ? new Date(actualStart).getFullYear() : new Date(startDate).getFullYear(),
    };
  } catch {
    return null;
  }
}
