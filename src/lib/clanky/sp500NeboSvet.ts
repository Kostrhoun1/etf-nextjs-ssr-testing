/**
 * Čísla pro článek „S&P 500, nebo celý svět?" (Vlna 7, 17. 10. 2026).
 *
 * Počítá se při ISR renderu stejným enginem jako backtest (runBacktest, CZK, roční vyvažování,
 * data = ETF po poplatcích: SPY, VT, VGTSX). Text článku se z těchto čísel skládá – nic napevno.
 *
 * OVĚŘENO 17. 10. 2026 (pravidlo č. 1):
 * - S&P 500 (SPY) roční výnosy 2011–2024 vs. S&P DJI: ±0,01–0,27 p. b. (poplatek ETF)
 * - celý svět (VT, index FTSE Global All Cap) roční výnosy 2010–2024 vs. publikované výnosy VT: max ±0,1 p. b.
 * - převod do Kč přes kurzy ČNB: ±0,06 %
 * - dekáda 2000–2009 S&P 500 v Kč −7,3 % ročně = S&P TR v USD −0,95 % ročně × USD/CZK −6,5 % ročně
 */
import { cache } from 'react';
import { runBacktest } from '@/lib/backtest/engine';
import { resampleMonthEnd } from '@/lib/backtest/calculations';

type Bod = { date: Date; value: number };

async function nav(slozeni: [string, number][], od: string, doD: Date, mena: 'CZK' | 'USD' = 'CZK') {
  const r = await runBacktest({
    portfolio: slozeni.map(([c, w]) => ({ isin: c, name: c, weight: w, ter: 0, indexCode: c })),
    startDate: new Date(od), endDate: doD, initialAmount: 100000, rebalancingStrategy: 'yearly', currency: mena,
  });
  return r;
}

const cagr = (a: number, b: number, roky: number) => Math.pow(b / a, 1 / roky) - 1;

/** Klouzavá N-letá okna z měsíčních řad: v kolika A překonalo B a rozpětí rozdílu p.a. */
function okna(a: Bod[], b: Bod[], roky: number) {
  const mb = new Map(b.map((p) => [p.date.toISOString().slice(0, 7), p.value]));
  const A = a.filter((p) => mb.has(p.date.toISOString().slice(0, 7)));
  const n = roky * 12;
  let celkem = 0, vyhra = 0, min = Infinity, max = -Infinity;
  for (let i = 0; i + n < A.length; i++) {
    const k0 = A[i].date.toISOString().slice(0, 7), k1 = A[i + n].date.toISOString().slice(0, 7);
    const d = cagr(A[i].value, A[i + n].value, roky) - cagr(mb.get(k0)!, mb.get(k1)!, roky);
    celkem++; if (d > 0) vyhra++; min = Math.min(min, d); max = Math.max(max, d);
  }
  return { celkem, vyhra, min, max };
}

export interface Sp500NeboSvet {
  od2008: { id: string; nazev: string; cagr: number; maxPokles: number; kolisavost: number; konec: number }[];
  usdPropad: { sp500: number; svet: number };
  dekada2000: { sp500: number; mimoUsa: number };
  okna10Svet: ReturnType<typeof okna>;
  okna10MimoUsa: ReturnType<typeof okna>;
  rocne: { rok: number; sp500: number; svet: number }[];
  posledniDen: string;
}

async function spoctiSp500NeboSvetBezCache(): Promise<Sp500NeboSvet | null> {
  try {
    const dnes = new Date();
    const [sp, vt, ex, spUsd, vtUsd, spDek, exDek, spDlouho, exDlouho] = await Promise.all([
      nav([['sp500', 1]], '2008-07-01', dnes),
      nav([['ftse_all_world', 1]], '2008-07-01', dnes),
      nav([['world_ex_us', 1]], '2008-07-01', dnes),
      nav([['sp500', 1]], '2008-07-01', dnes, 'USD'),
      nav([['ftse_all_world', 1]], '2008-07-01', dnes, 'USD'),
      nav([['sp500', 1]], '2000-01-01', new Date('2009-12-31')),
      nav([['world_ex_us', 1]], '2000-01-01', new Date('2009-12-31')),
      nav([['sp500', 1]], '1999-12-01', dnes),
      nav([['world_ex_us', 1]], '1999-12-01', dnes),
    ]);
    const radek = (id: string, nazev: string, r: Awaited<ReturnType<typeof nav>>) => ({
      id, nazev, cagr: r.summary.cagr, maxPokles: r.risk.maxDrawdown.depth, kolisavost: r.summary.standardDeviation, konec: r.summary.netAssetValue,
    });
    const mesicne = (r: Awaited<ReturnType<typeof nav>>) => resampleMonthEnd(r.marketNav ?? []);
    const svetRoky = new Map(vt.returns.annualReturns.map((x) => [x.year, x.return]));
    const posledniRok = dnes.getFullYear() - 1;
    return {
      od2008: [radek('sp500', 'S&P 500 (USA)', sp), radek('svet', 'Celý svět (fond VT)', vt), radek('mimousa', 'Svět mimo USA', ex)],
      usdPropad: { sp500: spUsd.risk.maxDrawdown.depth, svet: vtUsd.risk.maxDrawdown.depth },
      dekada2000: { sp500: spDek.summary.cagr, mimoUsa: exDek.summary.cagr },
      okna10Svet: okna(mesicne(sp), mesicne(vt), 10),
      okna10MimoUsa: okna(mesicne(spDlouho), mesicne(exDlouho), 10),
      rocne: sp.returns.annualReturns
        .filter((x) => x.year >= 2009 && x.year <= posledniRok && svetRoky.has(x.year))
        .map((x) => ({ rok: x.year, sp500: x.return, svet: svetRoky.get(x.year)! })),
      posledniDen: (sp.marketNav?.at(-1)?.date ?? dnes).toISOString().slice(0, 10),
    };
  } catch (e) {
    console.error('[sp500-nebo-svet] výpočet selhal:', e);
    return null;
  }
}

/** V rámci jednoho renderu (generateMetadata + stránka) se počítá jen jednou. */
export const spoctiSp500NeboSvet = cache(spoctiSp500NeboSvetBezCache);
