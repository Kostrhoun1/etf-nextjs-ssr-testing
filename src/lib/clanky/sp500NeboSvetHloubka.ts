/**
 * „S&P 500, nebo celý svět?“ – HLOUBKOVÝ rozbor (17. 10. 2026, na přání majitele „mnohem větší detail“).
 *
 * Stejný engine jako backtest (runBacktest, denní řady, Kč přes referenční kurzy ECB). Řady:
 *   sp500        = SPY (S&P 500, od 1993)
 *   ftse_all_world = VT (celý svět, FTSE Global All Cap, od 6/2008)
 *   world_ex_us  = VGTSX (svět mimo USA, od 1996) – pro dlouhou historii před 2008
 *
 * Co se tu počítá (vše z denních hodnot, ne z měsíčních):
 *   - výnosy po obdobích končících posledním dnem dat (1/3/5/10/15 let) v Kč i v USD,
 *   - podíl kurzu koruny (rozdíl výnosu v Kč a v USD),
 *   - krize jedna po druhé: hloubka propadu od vrcholu, dno, doba návratu na vrchol,
 *   - klouzavá okna (start každý měsíc): v kolika vyhrál S&P 500, medián a rozpětí rozdílu,
 *   - roční kolísavost a korelace z MĚSÍČNÍCH výnosů (kolo 7: kolísavost stejnou funkcí jako backtest – calculateSummary;
 *     dřív σ denních log-výnosů × √252 = 21,1 % u S&P 500 v Kč, backtest a zbytek webu 14,2 %),
 *   - „od 2008“ = od 1. 7. 2008 jako engine (první den řady 2. 7. 2008) – dřív od 30. 6. 2008 (14,7 % vs. 14,5 % ročně).
 * Ověření: viz hlavička stránky a scripts/overeni-sp500-svet-hloubka.mjs.
 */
import { cache } from 'react';
import { runBacktest } from '@/lib/backtest/engine';
import { resampleMonthEnd, calculateSummary } from '@/lib/backtest/calculations';
import type { TimeSeriesPoint } from '@/lib/backtest/types';
import { supabase } from '@/lib/supabase';
import { prirazeniFondu, type FondProPrirazeni } from '@/lib/backtest/fondNaIndex';

type Mena = 'CZK' | 'USD';

async function rada(kod: string, od: string, mena: Mena): Promise<TimeSeriesPoint[]> {
  const r = await runBacktest({
    portfolio: [{ isin: kod, name: kod, weight: 1, ter: 0, indexCode: kod }],
    startDate: new Date(od), endDate: new Date(), initialAmount: 1, rebalancingStrategy: 'yearly', currency: mena,
  });
  return r.marketNav ?? [];
}

const den = (d: Date) => d.toISOString().slice(0, 10);
/** Hodnota k poslednímu dni ≤ datum (řada je seřazená). */
function hodnotaK(r: TimeSeriesPoint[], datum: string): TimeSeriesPoint | null {
  let lo = 0, hi = r.length - 1, best = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (den(r[m].date) <= datum) { best = m; lo = m + 1; } else hi = m - 1; }
  return best < 0 ? null : r[best];
}
const roku = (a: Date, b: Date) => (b.getTime() - a.getTime()) / (365.25 * 864e5);
const cagr = (a: TimeSeriesPoint, b: TimeSeriesPoint) => Math.pow(b.value / a.value, 1 / roku(a.date, b.date)) - 1;

export interface Obdobi { roky: number; od: string; sp: { czk: number; usd: number }; svet: { czk: number; usd: number } | null }

export interface Krize {
  id: string; nazev: string; popis: string;
  /** Pro každou řadu: hloubka propadu (−0,5 = −50 %), datum vrcholu, dna a návratu (null = dosud ne). */
  rady: { id: string; nazev: string; mena: Mena; hloubka: number; vrchol: string; dno: string; navrat: string | null; mesicuDoNavratu: number | null }[];
}

export interface Okna { roky: number; celkem: number; vyhraSp: number; median: number; p10: number; p90: number; min: number; max: number; od: string;
  /** Rozdíl po měsících startu (pro graf). */
  rada: { start: string; rozdil: number }[] }

export interface Sp500NeboSvetHloubka {
  posledniDen: string;
  obdobi: Obdobi[];
  /** Od 7/2008: výnos v Kč a v USD; kurz = o kolik ročně koruna výsledek změnila ((1+Kč)/(1+USD) − 1). */
  menaOd2008: { sp: { czk: number; usd: number }; svet: { czk: number; usd: number }; kurzRocne: number };
  krize: Krize[];
  /** Nejhlubší propad S&P 500 v Kč od 1/2000 (celá řada, ne jen okno jedné krize) – stejné číslo jako /kolik-vydelaly-etf. */
  maxPropadSpKc: { hloubka: number; vrchol: string; dno: string; navrat: string | null; mesicuDoNavratu: number | null } | null;
  oknaSvet: Okna[];      // S&P 500 vs. celý svět (VT), od 2008
  oknaMimoUsa: Okna[];   // S&P 500 vs. svět mimo USA, od 2000
  kolisavost: { sp: number; svet: number; mimoUsa: number };
  korelace: { spSvet: number; spMimoUsa: number };
  /** Složení dvou typických fondů (justETF přes náš scraper) – jen pokud jsou data čerstvá.
   *  `datum` = holdings_as_of (k jakému dni emitent složení zveřejnil), null = neznáme – NE den stažení (kolo 7). */
  slozeni: { isin: string; ticker: string; ter: number; zeme: [string, number][]; sektory: [string, number][]; datum: string | null }[];
  /** Nejlevnější velké fondy na obě varianty (TER, velikost) – čerstvá data, bez zajištěných tříd. */
  levne: { sp: LevnyFond[]; svet: LevnyFond[] };
}

export interface LevnyFond { isin: string; ticker: string; name: string; ter: number; velikostMld: number; dist: string | null }

async function nactiLevne(vzor: string, indexCode: string): Promise<LevnyFond[]> {
  const od = new Date(Date.now() - 14 * 864e5).toISOString().slice(0, 10);
  const { data, error } = await supabase.from('etf_funds')
    .select('isin,primary_ticker,name,index_name,is_leveraged,currency_risk,ter_numeric,fund_size_numeric,distribution_policy')
    .ilike('name', `%${vzor}%`).gte('scraping_date', od).gte('fund_size_numeric', 500).order('ter_numeric', { ascending: true }).order('fund_size_numeric', { ascending: false }).limit(60);
  if (error || !data) return [];
  return (data as unknown as Record<string, string | number | boolean | null>[])
    .filter((f) => prirazeniFondu(f as unknown as FondProPrirazeni)?.indexCode === indexCode && f.ter_numeric != null)
    .slice(0, 4)
    .map((f) => ({ isin: String(f.isin), ticker: String(f.primary_ticker ?? ''), name: String(f.name), ter: Number(f.ter_numeric) / 100, velikostMld: Number(f.fund_size_numeric) / 1000, dist: f.distribution_policy ? String(f.distribution_policy) : null }));
}

const SLOZENI_ISIN = ['IE00B5BMR087', 'IE00BK5BQT80']; // CSPX/SXR8, VWCE
async function nactiSlozeni() {
  const sl = ['isin', 'primary_ticker', 'ter_numeric', 'scraping_date', 'holdings_as_of', ...[1, 2, 3, 4, 5].flatMap((i) => [`country_${i}_name`, `country_${i}_weight`, `sector_${i}_name`, `sector_${i}_weight`])].join(',');
  const { data, error } = await supabase.from('etf_funds').select(sl).in('isin', SLOZENI_ISIN);
  if (error || !data) return [];
  return (data as unknown as Record<string, string | number | null>[]).flatMap((f) => {
    const stazeno = String(f.scraping_date ?? '').slice(0, 10);
    // Pravidlo č. 1: starší data než 14 dní neukazovat.
    if (!stazeno || Date.now() - new Date(stazeno).getTime() > 14 * 864e5) return [];
    // Datum složení = holdings_as_of (emitent, obvykle konec měsíce 1–2 měsíce zpět), ne den stažení (kolo 7: web psal
    // „Složení fondů k 22. 10. 2026“, zdroj uvádí 31. 8. 2026).
    const datum = /^\d{4}-\d{2}-\d{2}/.test(String(f.holdings_as_of ?? '')) ? String(f.holdings_as_of).slice(0, 10) : null;
    const par = (k: 'country' | 'sector') => [1, 2, 3, 4, 5].flatMap((i) => {
      const n = f[`${k}_${i}_name`], w = Number(f[`${k}_${i}_weight`]);
      return n && Number.isFinite(w) && w > 0 && n !== 'Other' ? [[String(n), w] as [string, number]] : [];
    });
    return [{ isin: String(f.isin), ticker: String(f.primary_ticker ?? ''), ter: Number(f.ter_numeric) / 100, zeme: par('country'), sektory: par('sector'), datum }];
  }).sort((a, b) => SLOZENI_ISIN.indexOf(a.isin) - SLOZENI_ISIN.indexOf(b.isin));
}

/** Největší propad v okně [od, do] + návrat na předchozí vrchol (hledá se až do konce dat). */
function propad(r: TimeSeriesPoint[], od: string, do_: string) {
  let vrchol = -Infinity, vrcholD = '', hloubka = 0, dno = '', vrcholPredDnem = 0, vrcholPredDnemD = '';
  for (const p of r) {
    const d = den(p.date);
    if (d < od) continue;
    if (d > do_) break;
    if (p.value > vrchol) { vrchol = p.value; vrcholD = d; }
    const dd = p.value / vrchol - 1;
    if (dd < hloubka) { hloubka = dd; dno = d; vrcholPredDnem = vrchol; vrcholPredDnemD = vrcholD; }
  }
  if (!dno) return null;
  let navrat: string | null = null;
  for (const p of r) { const d = den(p.date); if (d > dno && p.value >= vrcholPredDnem) { navrat = d; break; } }
  const mesice = navrat ? Math.round(roku(new Date(vrcholPredDnemD), new Date(navrat)) * 12) : null;
  return { hloubka, vrchol: vrcholPredDnemD, dno, navrat, mesicuDoNavratu: mesice };
}

/** Část řady od dne `od` (včetně). */
const odDne = (r: TimeSeriesPoint[], od: string) => r.filter((p) => den(p.date) >= od);

/** Roční kolísavost STEJNOU funkcí jako backtest (calculateSummary: měsíční výnosy z konců měsíců × √(počet/rok)).
 *  ZAMERNA-ROZHODNUTI.md „Riziko se počítá z MĚSÍČNÍCH výnosů“ – denní řady mají ojedinělé vadné ticky. */
function kolisavost(r: TimeSeriesPoint[], od: string) {
  return calculateSummary(odDne(r, od), 0, 0).standardDeviation;
}

/** Začátek „od 2008“ – stejný jako engine v sp500NeboSvet.ts a /kolik-vydelaly-etf (start 1. 7. 2008, první den řady 2. 7.). */
const OD_2008 = '2008-07-01';

function mesicniVynosy(r: TimeSeriesPoint[]) {
  const m = resampleMonthEnd(r);
  const out = new Map<string, number>();
  for (let i = 1; i < m.length; i++) out.set(den(m[i].date).slice(0, 7), m[i].value / m[i - 1].value - 1);
  return out;
}
function korelace(a: Map<string, number>, b: Map<string, number>, od: string) {
  const k = [...a.keys()].filter((x) => x >= od && b.has(x));
  const xa = k.map((x) => a.get(x)!), xb = k.map((x) => b.get(x)!);
  const ma = xa.reduce((s, x) => s + x, 0) / xa.length, mb = xb.reduce((s, x) => s + x, 0) / xb.length;
  let c = 0, va = 0, vb = 0;
  for (let i = 0; i < k.length; i++) { c += (xa[i] - ma) * (xb[i] - mb); va += (xa[i] - ma) ** 2; vb += (xb[i] - mb) ** 2; }
  return c / Math.sqrt(va * vb);
}

/** Klouzavá okna z měsíčních konců: start každý měsíc, délka `roky`. */
function okna(a: TimeSeriesPoint[], b: TimeSeriesPoint[], roky: number): Okna | null {
  const ma = new Map(resampleMonthEnd(a).map((p) => [den(p.date).slice(0, 7), p]));
  const mb = new Map(resampleMonthEnd(b).map((p) => [den(p.date).slice(0, 7), p]));
  const k = [...ma.keys()].filter((x) => mb.has(x)).sort();
  const n = roky * 12, rozdily: number[] = [], rada: Okna['rada'] = [];
  for (let i = 0; i + n < k.length - 1; i++) {   // poslední (rozběhlý) měsíc jako konec okna nebereme
    const a0 = ma.get(k[i])!, a1 = ma.get(k[i + n])!, b0 = mb.get(k[i])!, b1 = mb.get(k[i + n])!;
    rozdily.push(cagr(a0, a1) - cagr(b0, b1));
    rada.push({ start: k[i], rozdil: rozdily.at(-1)! });
  }
  if (!rozdily.length) return null;
  const s = [...rozdily].sort((x, y) => x - y);
  const q = (p: number) => s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))];
  return { roky, celkem: s.length, vyhraSp: rozdily.filter((x) => x > 0).length, median: q(0.5), p10: q(0.1), p90: q(0.9), min: s[0], max: s.at(-1)!, od: k[0], rada };
}

const KRIZE_DEF: { id: string; nazev: string; popis: string; od: string; do: string; svet: boolean }[] = [
  { id: 'dotcom', nazev: 'Splasknutí internetové bubliny', popis: 'Technologické akcie po roce 2000; USA nejvíc.', od: '2000-01-01', do: '2003-12-31', svet: false },
  { id: 'gfc', nazev: 'Finanční krize', popis: 'Hypoteční a bankovní krize 2007–2009.', od: '2007-07-01', do: '2009-12-31', svet: false },
  { id: 'euro', nazev: 'Eurozóna a snížení ratingu USA', popis: 'Dluhová krize v Evropě, léto 2011.', od: '2011-04-01', do: '2012-06-30', svet: true },
  { id: '2015', nazev: 'Čína a ropa', popis: 'Zpomalení Číny, pád ropy 2015–2016.', od: '2015-05-01', do: '2016-06-30', svet: true },
  { id: '2018', nazev: 'Konec roku 2018', popis: 'Zvyšování sazeb a obchodní válka.', od: '2018-09-01', do: '2019-03-31', svet: true },
  { id: 'covid', nazev: 'Covid', popis: 'Nejrychlejší pád v historii, jaro 2020.', od: '2020-01-01', do: '2020-12-31', svet: true },
  { id: '2022', nazev: 'Inflace a sazby 2022', popis: 'Nejrychlejší zvedání sazeb za desítky let.', od: '2022-01-01', do: '2023-06-30', svet: true },
];

async function spocti(): Promise<Sp500NeboSvetHloubka | null> {
  try {
    const [spC, spU, vtC, vtU, exC, exU] = await Promise.all([
      rada('sp500', '1999-12-01', 'CZK'), rada('sp500', '1999-12-01', 'USD'),
      rada('ftse_all_world', '2008-06-26', 'CZK'), rada('ftse_all_world', '2008-06-26', 'USD'),
      rada('world_ex_us', '1999-12-01', 'CZK'), rada('world_ex_us', '1999-12-01', 'USD'),
    ]);
    if ([spC, spU, vtC, vtU, exC, exU].some((r) => r.length < 500)) return null;
    const konec = spC.at(-1)!;
    const posledniDen = den(konec.date);

    const obdobi: Obdobi[] = [1, 3, 5, 10, 15].map((roky) => {
      const od = new Date(konec.date); od.setUTCFullYear(od.getUTCFullYear() - roky);
      const d = den(od);
      const c = (r: TimeSeriesPoint[]) => { const a = hodnotaK(r, d), b = r.at(-1)!; return a && den(r[0].date) <= d ? cagr(a, b) : null; };
      const sv = c(vtC), svU = c(vtU);
      return { roky, od: d, sp: { czk: c(spC)!, usd: c(spU)! }, svet: sv !== null && svU !== null ? { czk: sv, usd: svU } : null };
    });

    // Kolo 7: CAGR stejnou funkcí a od stejného dne jako engine (calculateSummary nad řadou od 1. 7. 2008) – dřív od 30. 6.
    // (S&P 500 v Kč 14,7 % zde vs. 14,5 % v tabulce „Od roku 2008“ na téže stránce).
    const s08 = (r: TimeSeriesPoint[]) => calculateSummary(odDne(r, OD_2008), 0, 0).cagr;
    const spM = { czk: s08(spC), usd: s08(spU) };
    const menaOd2008 = { sp: spM, svet: { czk: s08(vtC), usd: s08(vtU) }, kurzRocne: (1 + spM.czk) / (1 + spM.usd) - 1 };
    // Nejhlubší propad S&P 500 v Kč za celou řadu od 1/2000 (vrchol 9/2000 → dno 3/2009): okno krize 2000–2003 končí
    // dnem 2002/03, ale propad pokračoval do finanční krize (kolo 7: článek psal −61 %, skutečně −72 %).
    const maxPropadSpKc = propad(spC, '2000-01-01', posledniDen);

    const krize: Krize[] = KRIZE_DEF.map((k) => {
      const kand: [string, string, Mena, TimeSeriesPoint[]][] = [
        ['sp', 'S&P 500', 'CZK', spC], ['sp', 'S&P 500', 'USD', spU],
        ...(k.svet ? [['svet', 'Celý svět', 'CZK', vtC], ['svet', 'Celý svět', 'USD', vtU]] as [string, string, Mena, TimeSeriesPoint[]][] : []),
        ['mimousa', 'Svět mimo USA', 'CZK', exC], ['mimousa', 'Svět mimo USA', 'USD', exU],
      ];
      const rady = kand.flatMap(([id, nazev, mena, r]) => { const p = propad(r, k.od, k.do); return p ? [{ id, nazev, mena, ...p }] : []; });
      return { id: k.id, nazev: k.nazev, popis: k.popis, rady };
    });

    const oknaSvet = [1, 3, 5, 10].map((r) => okna(spC, vtC, r)).filter((x): x is Okna => !!x);
    const oknaMimoUsa = [1, 3, 5, 10, 15].map((r) => okna(spC, exC, r)).filter((x): x is Okna => !!x);

    const kolis = { sp: kolisavost(spC, OD_2008), svet: kolisavost(vtC, OD_2008), mimoUsa: kolisavost(exC, OD_2008) };
    const mSp = mesicniVynosy(spC), mVt = mesicniVynosy(vtC), mEx = mesicniVynosy(exC);
    const kor = { spSvet: korelace(mSp, mVt, '2008-08'), spMimoUsa: korelace(mSp, mEx, '2000-02') };

    const [slozeni, levneSp, levneSvet] = await Promise.all([nactiSlozeni(), nactiLevne('S&P 500', 'sp500'), nactiLevne('All-World', 'ftse_all_world')]);
    return { posledniDen, obdobi, menaOd2008, krize, maxPropadSpKc, oknaSvet, oknaMimoUsa, kolisavost: kolis, korelace: kor, slozeni, levne: { sp: levneSp, svet: levneSvet } };
  } catch (e) {
    console.error('[sp500-svet-hloubka] výpočet selhal:', e);
    return null;
  }
}

export const spoctiSp500NeboSvetHloubka = cache(spocti);
