/**
 * FAKTOROVÉ ETF – všechna čísla sekce /faktorove-etf živě z backtest enginu (kolo 8, 22. 10. 2026).
 *
 * PROČ: stránky měly čísla natvrdo z 13. 7. 2026 – PŘED opravou dvojího odečtu TER (16. 7. 2026), takže se
 * od živé ročenky na téže stránce lišila přesně o jeden poplatek ročně. Srovnání se S&P 500 navíc nebylo na
 * stejném okně (value „419 tis.“ neodpovídalo žádnému oknu) a tvrzení jako „malé firmy porazily index“ nebo
 * „každý faktor byl aspoň jednou nejlepší“ vyvracela vlastní ročenka. Teď:
 *  - každý faktor i S&P 500 běží na PŘESNĚ stejném okně (stejný první i poslední den, zarovnáno níže),
 *  - všechna tvrzení (kdo porazil index, kolikrát kdo vyhrál, nejlepší/nejhorší rok…) se odvozují z dat,
 *  - poplatek řídí manifest (src/lib/backtest/indexes.ts → sourceTer, data = NAV fondu, nic se neodečítá 2×).
 * Stránky jsou ISR (1 den) → počítá se nejvýš jednou denně na stránku; `cache` sdílí výpočet mezi
 * generateMetadata a stránkou v jednom renderu.
 *
 * NEZÁVISLÉ OVĚŘENÍ (pravidlo č. 1): přepočet z Yahoo adj. close (IWD, IWM, MTUM, USMV, QUAL, VYM, SPY) × kurzy ČNB
 * a z Kenneth R. French Data Library (momentum/quality před 2013) – skript a výsledky v PR popisu kola 8.
 */
import { cache } from 'react';
import { runBacktest } from '@/lib/backtest/engine';
import { calculateRollingReturns, calculateStressPeriods } from '@/lib/backtest/calculations';
import { INDEX_BY_CODE } from '@/lib/backtest/indexes';
import type { BacktestInput, BacktestResult, TimeSeriesPoint } from '@/lib/backtest/types';

export type FaktorSlug = 'value' | 'small-cap' | 'dividendove-akcie' | 'minimalni-volatilita' | 'momentum' | 'quality';

export interface FaktorDef {
  slug: FaktorSlug;
  indexCode: string;
  /** Název do tabulky přehledu. */
  nazev: string;
  /** Krátký název do legendy, ročenky a textů („Value“). */
  kratce: string;
  /** Co faktor drží – jedna věta bez čísel. */
  popis: string;
  /** Americký index, na kterém data běží (pro poctivé „jablka s jablky“). */
  indexDat: string;
}

/** Pořadí = sloupce ročenky i řádky přehledu. Index dat = manifest (indexes.ts), tady jen popisek. */
export const FAKTORY_DEF: FaktorDef[] = [
  { slug: 'value', indexCode: 'us_value', nazev: 'Value (hodnotové akcie)', kratce: 'Value', indexDat: 'Russell 1000 Value',
    popis: 'Levné firmy vůči účetní hodnotě a ziskům. Nejstarší „prémiový“ faktor (Fama–French).' },
  { slug: 'small-cap', indexCode: 'us_small_cap', nazev: 'Small cap (malé firmy)', kratce: 'Small cap', indexDat: 'Russell 2000',
    popis: 'Menší firmy s vyšším růstovým potenciálem – a vyšším rizikem.' },
  { slug: 'dividendove-akcie', indexCode: 'us_dividend', nazev: 'Dividendové akcie', kratce: 'Dividendy', indexDat: 'FTSE High Dividend Yield (USA)',
    popis: 'Firmy s vysokou dividendou. Psychologicky příjemné, matematicky žádná záruka.' },
  { slug: 'minimalni-volatilita', indexCode: 'us_min_vol', nazev: 'Minimální volatilita', kratce: 'Min. volatilita', indexDat: 'MSCI USA Minimum Volatility',
    popis: 'Akcie s nejmenším kolísáním. Slibuje klidnější jízdu za cenu nižšího výnosu.' },
  { slug: 'momentum', indexCode: 'us_momentum', nazev: 'Momentum', kratce: 'Momentum', indexDat: 'MSCI USA Momentum',
    popis: 'Akcie, kterým se dařilo v posledním roce.' },
  { slug: 'quality', indexCode: 'us_quality', nazev: 'Quality (kvalitní firmy)', kratce: 'Quality', indexDat: 'MSCI USA Sector Neutral Quality',
    popis: 'Ziskové firmy s nízkým dluhem a stabilními maržemi.' },
];

export const POCATECNI = 100_000;
export const MESICNI_VKLAD = 5_000;

export interface Bod { datum: string; hodnota: number }
export interface Propad {
  hloubka: number;          // desetinné, záporné
  vrchol: string;           // ISO den vrcholu před propadem
  dno: string;
  navrat: string | null;    // den návratu na vrchol, null = dosud ne
  mesicuOdVrcholu: number;  // vrchol → návrat (nebo → konec dat, když se nevrátil)
}
export interface Krize { key: string; nazev: string; pokles: number; navratMesicu: number | null; sp: { pokles: number; navratMesicu: number | null } | null }
export interface Klouzave { roky: number; prumer: number; nejhorsi: number; nejlepsi: number; podilKladnych: number; pocet: number }
export interface RokVynos { rok: number; f: number; s: number | null; cely: boolean }

export interface FaktorVysledek {
  def: FaktorDef;
  od: string;               // první den okna (ISO) – stejný pro faktor i S&P 500
  do: string;               // poslední den okna (ISO) – stejný pro oba
  roku: number;             // délka okna v letech (desetinně)
  konecna: number; spKonecna: number;
  cagr: number; spCagr: number;
  porazil: boolean;         // faktor skončil výš než S&P 500 na stejném okně
  volatilita: number; spVolatilita: number;
  maxPropad: Propad; spMaxPropad: Propad;
  rocni: RokVynos[];
  nejlepsiRok: { rok: number; vynos: number } | null; // jen celé kalendářní roky
  nejhorsiRok: { rok: number; vynos: number } | null;
  klouzave: Klouzave[];
  krize: Krize[];
  dca: { vlozeno: number; konecna: number; spKonecna: number } | null;
  /** Den, odkdy jsou data z reálného ETF (u řad prodloužených akademickými daty), jinak null. */
  etfOd: string | null;
  graf: { fac: Bod[]; spx: Bod[] };
}

export interface Rocenka {
  odRoku: number; doRoku: number;
  roky: { rok: number; f: Record<FaktorSlug, number>; sp: number }[];
  vyhry: Record<FaktorSlug, number[]>;   // roky, kdy byl faktor nejlepší ze šesti
  prohry: Record<FaktorSlug, number[]>;  // roky, kdy byl nejhorší
  /** Roky, kdy byl kladný jediný faktor. */
  jedinyKladny: { rok: number; slug: FaktorSlug; vynos: number }[];
}

export interface ValueGrowth {
  od: string; do: string;
  value: number; growth: number; sp: number;               // konečné hodnoty ze 100 000 Kč
  growthPropad: number; valuePropad: number;
  /** Vrchol náskoku value před growth (poměr value/growth je nejvýš) a jak velký byl. */
  vrcholNaskoku: { datum: string; naskok: number };
  /** Kdy growth value poprvé znovu dohnal (poměr klesl pod 1 po vrcholu), null = nikdy. */
  growthDohnal: string | null;
  /** Value vs. S&P 500 v kalendářních letech 2010–2019: kolikrát value zaostal. */
  value2010s: { zaostal: number; let: number };
}

export interface FaktoryVysledek {
  faktory: Partial<Record<FaktorSlug, FaktorVysledek>>;
  /** Všech šest faktorů se spočítalo – jen pak smí stránka tvrdit „z šesti faktorů…“. */
  kompletni: boolean;
  rocenka: Rocenka | null;
  valueGrowth: ValueGrowth | null;
  /** Nejstarší a nejnovější „data k“ přes faktory (normálně stejné – americký kalendář). */
  dataOd: string | null; dataDo: string | null;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

async function beh(indexCode: string, od: Date, doDne: Date, vklady = false): Promise<BacktestResult> {
  return runBacktest({
    portfolio: [{ isin: indexCode, name: indexCode, weight: 1, ter: 0, indexCode }],
    startDate: od,
    endDate: doDne,
    initialAmount: POCATECNI,
    rebalancingStrategy: 'yearly',
    currency: 'CZK',
    ...(vklady ? { contributions: { amount: MESICNI_VKLAD, frequency: 'monthly' as const } } : {}),
  } as BacktestInput);
}

/** Poslední bod každého měsíce – pro grafy (~300 bodů místo ~6 600). */
function mesicne(points: TimeSeriesPoint[]): Bod[] {
  const out: Bod[] = [];
  for (let i = 0; i < points.length; i++) {
    const next = points[i + 1];
    if (!next || next.date.getUTCMonth() !== points[i].date.getUTCMonth()) out.push({ datum: iso(points[i].date), hodnota: points[i].value });
  }
  return out;
}

function propad(r: BacktestResult): Propad {
  const m = r.risk.maxDrawdown;
  return {
    hloubka: m.depth,
    vrchol: iso(m.startDate),
    dno: iso(m.troughDate),
    navrat: m.endDate ? iso(m.endDate) : null,
    mesicuOdVrcholu: m.lengthMonths,
  };
}

/**
 * Faktor a S&P 500 na PŘESNĚ stejném okně: start = první den dat faktoru (manifest `since`), konec = poslední
 * den, který mají OBA (když jedna řada má o den víc, přepočítá se do společného konce).
 */
async function spocitejFaktor(def: FaktorDef): Promise<FaktorVysledek | null> {
  const ind = INDEX_BY_CODE[def.indexCode];
  if (!ind) return null;
  const start = new Date(ind.since);
  const dnes = new Date();
  let [fac, spx] = await Promise.all([beh(def.indexCode, start, dnes), beh('sp500', start, dnes)]);
  const prvni = fac.marketNav[0].date;
  if (spx.marketNav[0].date.getTime() !== prvni.getTime()) spx = await beh('sp500', prvni, dnes);
  const konecF = fac.marketNav[fac.marketNav.length - 1].date.getTime();
  const konecS = spx.marketNav[spx.marketNav.length - 1].date.getTime();
  const konec = new Date(Math.min(konecF, konecS));
  if (konecF !== konec.getTime()) fac = await beh(def.indexCode, prvni, konec);
  if (konecS !== konec.getTime()) spx = await beh('sp500', prvni, konec);
  // Kontrola zarovnání – raději žádné číslo než srovnání na různých oknech (pravidlo č. 1).
  if (fac.marketNav[0].date.getTime() !== spx.marketNav[0].date.getTime()
    || fac.marketNav[fac.marketNav.length - 1].date.getTime() !== spx.marketNav[spx.marketNav.length - 1].date.getTime()) {
    console.error(`[faktory] ${def.slug}: okna faktoru a S&P 500 se neshodují`);
    return null;
  }

  const [dcaF, dcaS] = await Promise.all([beh(def.indexCode, prvni, konec, true), beh('sp500', prvni, konec, true)]).catch(() => [null, null]);

  const navF = fac.marketNav, navS = spx.marketNav;
  const rokOd = navF[0].date.getUTCFullYear(), rokDo = navF[navF.length - 1].date.getUTCFullYear();
  const spRok = new Map(spx.returns.annualReturns.map((a) => [a.year, a.return]));
  const rocni: RokVynos[] = fac.returns.annualReturns.map((a) => ({
    rok: a.year, f: a.return, s: spRok.get(a.year) ?? null, cely: a.year > rokOd && a.year < rokDo,
  }));
  const cele = rocni.filter((r) => r.cely);
  const nejlepsi = cele.length ? cele.reduce((a, b) => (b.f > a.f ? b : a)) : null;
  const nejhorsi = cele.length ? cele.reduce((a, b) => (b.f < a.f ? b : a)) : null;

  const krizeS = new Map(calculateStressPeriods(navS).map((k) => [k.key, k]));
  const krize: Krize[] = calculateStressPeriods(navF).map((k) => {
    const s = krizeS.get(k.key);
    return { key: k.key, nazev: k.name, pokles: k.drop, navratMesicu: k.recoveryMonths, sp: s ? { pokles: s.drop, navratMesicu: s.recoveryMonths } : null };
  });

  return {
    def,
    od: iso(navF[0].date),
    do: iso(navF[navF.length - 1].date),
    roku: (navF[navF.length - 1].date.getTime() - navF[0].date.getTime()) / (365.25 * 864e5),
    konecna: navF[navF.length - 1].value,
    spKonecna: navS[navS.length - 1].value,
    cagr: fac.summary.cagr,
    spCagr: spx.summary.cagr,
    porazil: navF[navF.length - 1].value > navS[navS.length - 1].value,
    volatilita: fac.summary.standardDeviation,
    spVolatilita: spx.summary.standardDeviation,
    maxPropad: propad(fac),
    spMaxPropad: propad(spx),
    rocni,
    nejlepsiRok: nejlepsi ? { rok: nejlepsi.rok, vynos: nejlepsi.f } : null,
    nejhorsiRok: nejhorsi ? { rok: nejhorsi.rok, vynos: nejhorsi.f } : null,
    klouzave: calculateRollingReturns(navF).map((k) => ({ roky: k.years, prumer: k.average, nejhorsi: k.low, nejlepsi: k.high, podilKladnych: k.positiveShare, pocet: k.count })),
    krize,
    dca: dcaF && dcaS ? {
      vlozeno: dcaF.summary.amountInvested,
      konecna: dcaF.evolution[dcaF.evolution.length - 1].value,
      spKonecna: dcaS.evolution[dcaS.evolution.length - 1].value,
    } : null,
    etfOd: ind.splicedFrom ?? null,
    graf: { fac: mesicne(navF), spx: mesicne(navS) },
  };
}

/** Ročenka: jen celé kalendářní roky, kdy už VŠECH šest faktorů běží na reálném ETF (ne na prodloužené řadě). */
function sestavRocenku(f: Record<FaktorSlug, FaktorVysledek>): Rocenka | null {
  const slugy = FAKTORY_DEF.map((d) => d.slug);
  const odRoku = Math.max(...FAKTORY_DEF.map((d) => {
    const ind = INDEX_BY_CODE[d.indexCode];
    const etf = ind.splicedFrom ?? ind.since;
    const [y, m, dd] = etf.split('-').map(Number);
    return m === 1 && dd <= 2 ? y : y + 1;
  }));
  const celeRoky = (s: FaktorSlug) => new Set(f[s].rocni.filter((r) => r.cely).map((r) => r.rok));
  const roky: Rocenka['roky'] = [];
  for (let rok = odRoku; ; rok++) {
    if (!slugy.every((s) => celeRoky(s).has(rok))) break;
    const hodnoty = Object.fromEntries(slugy.map((s) => [s, f[s].rocni.find((r) => r.rok === rok)!.f])) as Record<FaktorSlug, number>;
    const sp = f[slugy[0]].rocni.find((r) => r.rok === rok)?.s;
    if (sp == null) break;
    roky.push({ rok, f: hodnoty, sp });
  }
  if (roky.length < 3) return null;
  const vyhry = Object.fromEntries(slugy.map((s) => [s, [] as number[]])) as Record<FaktorSlug, number[]>;
  const prohry = Object.fromEntries(slugy.map((s) => [s, [] as number[]])) as Record<FaktorSlug, number[]>;
  const jedinyKladny: Rocenka['jedinyKladny'] = [];
  for (const r of roky) {
    const serazene = [...slugy].sort((a, b) => r.f[b] - r.f[a]);
    vyhry[serazene[0]].push(r.rok);
    prohry[serazene[serazene.length - 1]].push(r.rok);
    const kladne = slugy.filter((s) => r.f[s] > 0);
    if (kladne.length === 1) jedinyKladny.push({ rok: r.rok, slug: kladne[0], vynos: r.f[kladne[0]] });
  }
  return { odRoku, doRoku: roky[roky.length - 1].rok, roky, vyhry, prohry, jedinyKladny };
}

/** Value vs. growth vs. S&P 500 od startu řad Russell (květen 2000 = vrchol dot-com bubliny). */
async function spocitejValueGrowth(): Promise<ValueGrowth | null> {
  const start = new Date(INDEX_BY_CODE.us_value.since);
  const dnes = new Date();
  const [v0, g0, s0] = await Promise.all([beh('us_value', start, dnes), beh('us_growth', start, dnes), beh('sp500', start, dnes)]);
  const prvni = Math.max(v0.marketNav[0].date.getTime(), g0.marketNav[0].date.getTime(), s0.marketNav[0].date.getTime());
  const konec = Math.min(...[v0, g0, s0].map((r) => r.marketNav[r.marketNav.length - 1].date.getTime()));
  const zarovnej = async (r: BacktestResult, kod: string) =>
    r.marketNav[0].date.getTime() === prvni && r.marketNav[r.marketNav.length - 1].date.getTime() === konec ? r : beh(kod, new Date(prvni), new Date(konec));
  const [v, g, s] = await Promise.all([zarovnej(v0, 'us_value'), zarovnej(g0, 'us_growth'), zarovnej(s0, 'sp500')]);
  const gPodle = new Map(g.marketNav.map((p) => [p.date.getTime(), p.value]));
  let vrchol = { datum: '', pomer: 0 };
  const pomery: { datum: string; pomer: number }[] = [];
  for (const p of v.marketNav) {
    const gv = gPodle.get(p.date.getTime());
    if (gv == null) continue;
    const pomer = p.value / gv;
    pomery.push({ datum: iso(p.date), pomer });
    if (pomer > vrchol.pomer) vrchol = { datum: iso(p.date), pomer };
  }
  const poVrcholu = pomery.filter((x) => x.datum > vrchol.datum);
  const dohnal = poVrcholu.find((x) => x.pomer < 1)?.datum ?? null;
  const sRok = new Map(s.returns.annualReturns.map((a) => [a.year, a.return]));
  const dekada = v.returns.annualReturns.filter((a) => a.year >= 2010 && a.year <= 2019 && sRok.has(a.year));
  return {
    od: iso(v.marketNav[0].date), do: iso(v.marketNav[v.marketNav.length - 1].date),
    value: v.marketNav[v.marketNav.length - 1].value,
    growth: g.marketNav[g.marketNav.length - 1].value,
    sp: s.marketNav[s.marketNav.length - 1].value,
    growthPropad: g.risk.maxDrawdown.depth,
    valuePropad: v.risk.maxDrawdown.depth,
    vrcholNaskoku: { datum: vrchol.datum, naskok: vrchol.pomer - 1 },
    growthDohnal: dohnal,
    value2010s: { zaostal: dekada.filter((a) => a.return < (sRok.get(a.year) ?? 0)).length, let: dekada.length },
  };
}

export const nactiFaktory = cache(async (): Promise<FaktoryVysledek> => {
  const vysledky = await Promise.all(FAKTORY_DEF.map((d) => spocitejFaktor(d).catch((e) => {
    console.error(`[faktory] ${d.slug} selhal:`, e);
    return null;
  })));
  const faktory: Partial<Record<FaktorSlug, FaktorVysledek>> = {};
  vysledky.forEach((v, i) => { if (v) faktory[FAKTORY_DEF[i].slug] = v; });
  const kompletni = FAKTORY_DEF.every((d) => faktory[d.slug]);
  const konce = Object.values(faktory).map((v) => v!.do).sort();
  const valueGrowth = await spocitejValueGrowth().catch((e) => { console.error('[faktory] value/growth selhal:', e); return null; });
  return {
    faktory,
    kompletni,
    rocenka: kompletni ? sestavRocenku(faktory as Record<FaktorSlug, FaktorVysledek>) : null,
    valueGrowth,
    dataOd: konce[0] ?? null,
    dataDo: konce[konce.length - 1] ?? null,
  };
});

/** Faktory, které porazily S&P 500 na stejném okně (v pořadí FAKTORY_DEF). */
export const porazily = (v: FaktoryVysledek) => FAKTORY_DEF.map((d) => v.faktory[d.slug]).filter((f): f is FaktorVysledek => !!f && f.porazil);

/** Pořadí faktoru podle kolísavosti (1 = nejdivočejší). */
export const poradiVolatility = (v: FaktoryVysledek, slug: FaktorSlug) => {
  const serazene = Object.values(v.faktory).map((f) => f!).sort((a, b) => b.volatilita - a.volatilita);
  return serazene.findIndex((f) => f.def.slug === slug) + 1;
};
