/**
 * Equity křivka pro obsahový článek /kolik-vydelaly-etf.
 *
 * Vrací tvar zhodnocení 100 000 Kč ve světovém indexu (FTSE All-World) v čase – NORMALIZOVANÝ
 * na start = 100 000. Bereme z `marketNav` (EUR NAV, start-independentní), takže tvar i propady
 * jsou robustní a nezávisí na FX přepočtu (viz dokumentovaná start-dependence CZK konverze).
 * Body jsou podvzorkované pro čisté SVG. Značky krizí jsou umístěné na reálná minima v daných
 * oknech, popisky zaokrouhlené konzistentně s textem článku.
 *
 * Běží na serveru (stránka je ISR, revalidate 1 den). Při chybě vrací null → graf se nevykreslí,
 * stránka nespadne.
 */
import { runBacktest } from './engine';
import type { BacktestInput } from './types';

export interface EquityTrough {
  x: number;      // 0..1 pozice v čase
  y: number;      // normalizovaná hodnota
  label: string;  // např. "−50 %"
  year: number;
}
export interface EquityCurve {
  points: { x: number; y: number }[]; // x: 0..1, y: normalizovaná hodnota (start 100 000)
  minY: number;
  maxY: number;
  startYear: number;
  endYear: number;
  finalValue: number;
  troughs: EquityTrough[];
}

const WINDOWS: { from: string; to: string; label: string; year: number }[] = [
  { from: '2008-06', to: '2009-12', label: '−50 %', year: 2008 },
  { from: '2020-01', to: '2020-06', label: '−34 %', year: 2020 },
  { from: '2021-11', to: '2022-12', label: '−26 %', year: 2022 },
];

export async function getEquityCurve(): Promise<EquityCurve | null> {
  try {
    const input: BacktestInput = {
      portfolio: [{ isin: 'IE00BK5BQT80', name: 'FTSE All-World', weight: 1, ter: 0.0022, indexCode: 'ftse_all_world' }],
      startDate: new Date('2000-01-01'), // engine ořízne na nejstarší data
      endDate: new Date(),
      initialAmount: 100000,
      rebalancingStrategy: 'yearly',
    };
    const result = await runBacktest(input);
    const series = (result.marketNav && result.marketNav.length ? result.marketNav : result.evolution) || [];
    if (series.length < 24) return null;

    const base = series[0].value;
    if (!base) return null;

    const norm = series.map((p) => ({ date: new Date(p.date), v: (p.value / base) * 100000 }));
    const n = norm.length;
    const t0 = norm[0].date.getTime();
    const t1 = norm[n - 1].date.getTime();
    const span = t1 - t0 || 1;
    const xOf = (d: Date) => (d.getTime() - t0) / span;

    // podvzorkování na ~180 bodů
    const step = Math.max(1, Math.floor(n / 180));
    const sampled = norm.filter((_, i) => i % step === 0 || i === n - 1);
    const points = sampled.map((p) => ({ x: xOf(p.date), y: p.v }));

    const ys = norm.map((p) => p.v);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    // značky krizí – reálné minimum v okně
    const troughs: EquityTrough[] = [];
    for (const w of WINDOWS) {
      const inWin = norm.filter((p) => {
        const ym = `${p.date.getFullYear()}-${String(p.date.getMonth() + 1).padStart(2, '0')}`;
        return ym >= w.from && ym <= w.to;
      });
      if (!inWin.length) continue;
      const low = inWin.reduce((a, b) => (b.v < a.v ? b : a));
      troughs.push({ x: xOf(low.date), y: low.v, label: w.label, year: w.year });
    }

    return {
      points,
      minY,
      maxY,
      startYear: norm[0].date.getFullYear(),
      endYear: norm[n - 1].date.getFullYear(),
      finalValue: norm[n - 1].v,
      troughs,
    };
  } catch {
    return null;
  }
}
