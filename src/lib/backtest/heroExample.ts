/**
 * Reálný příklad do hera na stránce /backtest.
 *
 * Spočítá jednorázový vklad 100 000 Kč do světových akcií (60 % USA + 40 % zbytek světa) od
 * roku 2000 po dnešek – konečnou hodnotu v Kč, CAGR a nejhlubší propad. Kombinace sp500 (data
 * od 1993) + world_ex_us (od 1996) dosáhne až na vrchol dot-com bubliny 2000, takže ukázka
 * zachytí i krach 2000–2002 i finanční krizi 2008. Běží na serveru,
 * stránka je ISR (revalidate 1 den), takže se to počítá max. 1× denně. Používá STEJNÝ engine
 * i přepočet měny jako /api/backtest/simulate, takže čísla sedí s nástrojem.
 *
 * Při jakékoli chybě vrací null → hero zobrazí statickou variantu (žádný pád stránky).
 */
import { runBacktest } from './engine';
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

    const input: BacktestInput = {
      portfolio: [
        { isin: 'IE00B5BMR087', name: 'S&P 500', weight: 0.6, ter: 0.0007, indexCode: 'sp500' },
        { isin: 'US9219097683', name: 'Svět mimo USA', weight: 0.4, ter: 0.0008, indexCode: 'world_ex_us' },
      ],
      startDate,
      endDate,
      initialAmount: initialCzk,
      rebalancingStrategy: 'yearly',
      currency: 'CZK', // engine převádí každý index po dnech, výsledek je rovnou v Kč
    };

    const result = await runBacktest(input);
    if (!result.evolution.length) return null;

    const finalCzk = result.summary.netAssetValue;
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
