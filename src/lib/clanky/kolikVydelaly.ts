/**
 * Čísla pro článek „Kolik vydělaly ETF a akcie“ (/kolik-vydelaly-etf) – SEO audit 6b, 21. 10. 2026.
 *
 * PROČ: stránka měla ~30 čísel NAPEVNO z doby před opravou kurzové vrstvy (11. 7. 2026): „ze 100 000 Kč čtyřnásobek,
 * 8–9 % ročně, propad −50 %“. Roční výnosy v grafu odpovídaly výnosům VT v DOLARECH (2017 +24 % – v Kč jen ~+6 %),
 * propad −50 % je dolarový (v Kč −32 %) a /sp500-nebo-cely-svet (ověřený) ukazoval pro tentýž fond a období 11,1 % ročně
 * a 684 tis. Kč. Teď se vše počítá při ISR renderu STEJNÝM enginem a se STEJNÝM startem (1. 7. 2008, CZK, kurzy ČNB/ECB,
 * data = ETF po poplatcích) jako ověřený článek S&P 500 vs. svět. Nic napevno.
 *
 * Nezávislé ověření (pravidlo č. 1): ZAMERNA-ROZHODNUTI.md – 100 % VT 26. 6. 2008 → 16. 10. 2026 přepočet mimo kód
 * (Yahoo adj. close × denní kurzy ČNB) 10,82 % ročně; sp500NeboSvet.ts – roční výnosy VT vs. publikované ±0,1 p. b.
 * Kontrola: scripts/check-fund-data.mjs (blok kolo6b seo obsah) – CAGR a konečná hodnota se musí shodovat se
 * /sp500-nebo-cely-svet a roční výnosy v Kč nesmí odpovídat dolarovým.
 */
import { cache } from 'react';
import { runBacktest } from '@/lib/backtest/engine';
import { resampleMonthEnd } from '@/lib/backtest/calculations';
import type { TimeSeriesPoint } from '@/lib/backtest/types';

const START = '2008-07-01';
const VKLAD = 100000;

async function nav(kod: string, od: string, doD: Date, mesicniVklad?: number) {
  return runBacktest({
    portfolio: [{ isin: kod, name: kod, weight: 1, ter: 0, indexCode: kod }],
    // Pravidelné vklady: bez počátečního vkladu (jen 5 000 Kč měsíčně), jinak 100 000 Kč jednorázově.
    startDate: new Date(od), endDate: doD, initialAmount: mesicniVklad ? 0 : VKLAD, rebalancingStrategy: 'yearly', currency: 'CZK',
    ...(mesicniVklad ? { contributions: { amount: mesicniVklad, frequency: 'monthly' as const } } : {}),
  });
}

export interface Okno { roky: number; nejhorsi: number; nejlepsi: number; prumer: number; vPlusu: number; pocet: number }
export interface Propad { od: string; dno: string; navrat: string | null; hloubka: number; mesicuNaVrchol: number | null }

export interface KolikVydelaly {
  posledniDen: string;
  /** Skutečný první den řady (nezávislé ověření 21. 10. 2026: engine začíná 2. 7. 2008, ne 1. 7.). */
  prvniDen: string;
  /** Celý svět (VT) od 1. 7. 2008 v Kč: roční zhodnocení, konečná hodnota 100 000 Kč, nejhlubší pokles. */
  svet: { cagr: number; konec: number; nasobek: number; maxPokles: number; roky: number };
  /** Roční výnosy v Kč (první a poslední rok neúplné). */
  rocne: { rok: number; vynos: number; neuplny: boolean }[];
  okna: Okno[];
  propady: Propad[];
  /** 5 000 Kč měsíčně od 7/2008. */
  dca: { vlozeno: number; hodnota: number };
  regiony: { id: string; nazev: string; cagr: number; konec: number; maxPokles: number }[];
  /** S&P 500 v Kč od ledna 2000 (kurzy koruny v datech máme od roku 2000). */
  sp2000: { cagr: number; konec: number; maxPokles: number; posledniMesicPodVkladem: string | null; mesicuPodVkladem: number };
  /** Graf: měsíční hodnoty 100 000 Kč (VT, Kč). */
  graf: { datum: string; hodnota: number }[];
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const mesic = (d: Date) => d.toISOString().slice(0, 7);

/** Klouzavá okna z měsíčních hodnot (konce měsíců). */
function okna(m: TimeSeriesPoint[], roky: number): Okno | null {
  const n = roky * 12;
  const c: number[] = [];
  for (let i = 0; i + n < m.length; i++) c.push(Math.pow(m[i + n].value / m[i].value, 1 / roky) - 1);
  if (!c.length) return null;
  return {
    roky, nejhorsi: Math.min(...c), nejlepsi: Math.max(...c), prumer: c.reduce((a, b) => a + b, 0) / c.length,
    vPlusu: c.filter((x) => x > 0).length / c.length, pocet: c.length,
  };
}

async function spoctiBezCache(): Promise<KolikVydelaly | null> {
  try {
    const dnes = new Date();
    const [vt, sp, eafe, em, vtDca, sp2000] = await Promise.all([
      nav('ftse_all_world', START, dnes),
      nav('sp500', START, dnes),
      nav('msci_eafe', START, dnes),
      nav('msci_em', START, dnes),
      nav('ftse_all_world', START, dnes, 5000),
      nav('sp500', '2000-01-01', dnes),
    ]);
    const mn = vt.marketNav ?? [];
    if (mn.length < 24) return null;
    const roky = (mn[mn.length - 1].date.getTime() - mn[0].date.getTime()) / (365.25 * 864e5);
    const mesicne = resampleMonthEnd(mn);
    const prvniRok = mn[0].date.getUTCFullYear(), posledniRok = mn[mn.length - 1].date.getUTCFullYear();
    const radek = (id: string, nazev: string, r: Awaited<ReturnType<typeof nav>>) => ({
      id, nazev, cagr: r.summary.cagr, konec: r.summary.netAssetValue, maxPokles: r.risk.maxDrawdown.depth,
    });
    // Doba pod vkladem u S&P 500 od 1/2000: do POSLEDNÍHO měsíce, kdy byla hodnota pod vkladem (definice /jak-dlouho-v-minusu).
    const spM = resampleMonthEnd(sp2000.marketNav ?? []);
    let posledniPod: Date | null = null;
    for (const p of spM) if (p.value < VKLAD) posledniPod = p.date;
    const mesicuPod = posledniPod && spM.length ? (posledniPod.getUTCFullYear() - 2000) * 12 + posledniPod.getUTCMonth() + 1 : 0;
    const propady = (vt.risk.allDrawdowns ?? [])
      .filter((d) => d.depth <= -0.1)
      .sort((a, b) => a.depth - b.depth)
      .slice(0, 6)
      .map((d) => ({
        od: mesic(d.startDate), dno: mesic(d.troughDate), navrat: d.endDate ? mesic(d.endDate) : null,
        hloubka: d.depth, mesicuNaVrchol: d.recovered ? d.lengthMonths : null,
      }));
    return {
      posledniDen: iso(mn[mn.length - 1].date),
      prvniDen: iso(mn[0].date),
      svet: { cagr: vt.summary.cagr, konec: vt.summary.netAssetValue, nasobek: vt.summary.netAssetValue / VKLAD, maxPokles: vt.risk.maxDrawdown.depth, roky },
      rocne: vt.returns.annualReturns.map((x) => ({ rok: x.year, vynos: x.return, neuplny: x.year === prvniRok || x.year === posledniRok })),
      okna: [1, 5, 10, 15].map((r) => okna(mesicne, r)).filter((x): x is Okno => !!x),
      propady,
      dca: { vlozeno: vtDca.summary.amountInvested, hodnota: vtDca.summary.netAssetValue },
      regiony: [
        radek('sp500', 'S&P 500 (USA)', sp),
        radek('svet', 'Celý svět (fond VT)', vt),
        radek('eafe', 'Vyspělé trhy mimo USA (EAFE)', eafe),
        radek('em', 'Rozvíjející se trhy (EM)', em),
      ],
      sp2000: {
        cagr: sp2000.summary.cagr, konec: sp2000.summary.netAssetValue, maxPokles: sp2000.risk.maxDrawdown.depth,
        posledniMesicPodVkladem: posledniPod ? mesic(posledniPod) : null, mesicuPodVkladem: mesicuPod,
      },
      graf: [{ datum: iso(mn[0].date), hodnota: mn[0].value }, ...mesicne.map((p) => ({ datum: iso(p.date), hodnota: p.value }))],
    };
  } catch (e) {
    console.error('[kolik-vydelaly] výpočet selhal:', e);
    return null;
  }
}

/** V rámci jednoho renderu (generateMetadata + stránka) se počítá jen jednou. */
export const spoctiKolikVydelaly = cache(spoctiBezCache);
