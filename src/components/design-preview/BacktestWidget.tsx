'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend,
} from 'recharts';
import {
  Plus, Trash2, AlertTriangle, Zap, TrendingDown, Activity, Coins, Loader2, Info, Pencil, ArrowRight,
  Search, ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import InfoTip from '@/components/design-preview/InfoTip';
import { mer } from '@/lib/mereni';

/**
 * Backtest portfolia – PRESKINOVANÁ verze do design systému.
 * Logika je portnuta 1:1 z původního BacktestCalculator.tsx:
 *   – stejná nabídka indexů (AVAILABLE_INDEXES, data uložená v EUR),
 *   – stejná hotová portfolia (PRESET_PORTFOLIOS),
 *   – výpočet běží přes STEJNÝ API endpoint POST /api/backtest/simulate
 *     (server čte historická data z @/lib/backtest/engine a přepočítává kurzy ECB/ČNB).
 * Měněn je POUZE vizuál (teal/slate, recharts graf) + čeština bez anglicismů.
 * Místo sdíleného CurrencyContextu (vyžaduje provider, který v /design-preview není)
 * používáme lokální přepínač měny – do API se posílá stejně.
 */

import { INDEX_BY_CODE, type IndexDef } from '@/lib/backtest/indexes';
import type { RebalancingStrategy } from '@/lib/backtest/types';
import { STRESS_WINDOWS } from '@/lib/backtest/calculations';
import { VYCHOZI_SCENAR } from '@/lib/backtest/vychoziScenar';
import { kulateKroky, fmtOsa } from '@/lib/osyGrafu';
import { vkladyVCase, zhodnoceniVkladu } from '@/lib/backtest/zhodnoceniVkladu';

type Currency = 'EUR' | 'CZK' | 'USD';
type ContributionFrequency = 'none' | 'monthly' | 'quarterly' | 'yearly';

/* === Nabídka indexů — ODVOZENÁ Z MANIFESTU ===
 *
 * Dřív tu byla druhá natvrdo psaná kopie 26 indexů včetně proxy ETF a TER. Manifest
 * `src/lib/backtest/indexes.ts` přitom o sobě říká, že je jediná pravda — a měl pravdu
 * i fakticky: kopie tvrdila u eur_govt_bond_3_7y „od 2009", zatímco v DB data začínají
 * 2008-01-31. Přesně tenhle typ rozdvojení stál za incidentem 15.7.2026.
 *
 * Držíme tu UŽ JEN SEZNAM KÓDŮ a jejich pořadí. Manifest má `inBacktest: true` u 37 indexů,
 * ale nástroj vědomě nabízí těchto 26 — 11 sektorových indexů sem (zatím) nepatří, proto
 * se nabídka nesmí odvozovat prostým filtrem `inBacktest`.
 * Názvy, proxy ETF, TER i „odkdy" se berou z manifestu.
 */
const BACKTEST_INDEX_CODES: string[] = [
  'sp500',
  'us_total_market',
  'msci_eafe',
  'world_ex_us',
  'ftse_europe',
  'msci_em',
  'ftse_all_world',
  'eur_govt_bond',
  'eur_govt_bond_1_3y',
  'eur_govt_bond_3_7y',
  'eur_govt_bond_15_30y',
  'eur_corp_bond',
  'us_treasury_1_3y',
  'us_treasury_7_10y',
  'us_treasury_20y',
  'us_aggregate_bond',
  'us_corp_bond_ig',
  'us_value',
  'us_growth',
  'us_small_cap',
  'us_dividend',
  'us_min_vol',
  'us_momentum',
  'us_quality',
  'gold',
  'commodities',
];

/** Popisek „odkdy": u spliced řad se uvádí až rok reálného ETF, ne začátek dopočtené historie. */
const sinceLabel = (i: IndexDef) =>
  i.splicedFrom ? `reálné ETF od ${i.splicedFrom.slice(0, 4)}` : `od ${i.since.slice(0, 4)}`;

/* Kde ticker sám nestačí: poctivý popis zdroje dat (revize 18. 10. 2026 – „Celý svět přes
   Vanguard FTSE All-World“ sliboval jiný index, než z jakého data jsou). Data = manifest
   (ticker, since, note); tady je jen lidský popis. */
const ZDROJ_POPIS: Record<string, string> = {
  ftse_all_world: 'americký fond Vanguard Total World (VT), index FTSE Global All Cap – velké i malé firmy. Evropský Vanguard FTSE All-World sleduje podobný, jen užší index FTSE All-World (bez malých firem).',
  sp500: 'americký fond SPDR S&P 500 (SPY).',
};

/** Text do tooltipu u složky: odkud jsou data a odkdy. Technické „(od 1993)“ patří sem, ne do názvu. */
const zdrojDat = (i: IndexDef) => {
  const od = new Date(`${(i.splicedFrom ?? i.since)}T00:00:00Z`).toLocaleDateString('cs-CZ', { month: 'numeric', year: 'numeric', timeZone: 'UTC' });
  const popis = ZDROJ_POPIS[i.code] ?? `fond ${i.ticker}.`;
  return `Data: ${popis} Historie ${sinceLabel(i)} (${od})${i.splicedFrom ? `, starší část je dopočtená` : ''}. Poplatek zdrojového fondu je v datech už započtený.${i.note ? ` ${i.note}` : ''}`;
};

const categoryOf = (i: IndexDef) =>
  i.group === 'bond' ? (i.currency === 'EUR' ? 'Dluhopisy EUR' : 'Dluhopisy USD')
  : i.group === 'factor' ? 'Akcie – faktory'
  : i.group === 'commodity' ? 'Komodity'
  : 'Akcie';

const AVAILABLE_INDEXES = BACKTEST_INDEX_CODES.map((code) => {
  const i = INDEX_BY_CODE[code];
  if (!i) throw new Error(`BacktestWidget: index '${code}' není v manifestu indexes.ts`);
  // Fond k nákupu jen evropský (UCITS) – americký fond Čech nekoupí → raději „—“ (revize 18. 10. 2026).
  const ucits = !!i.proxyEtf && !/^US/.test(i.proxyEtf.isin);
  return {
    indexCode: i.code,
    name: i.name,
    /** Pro výběr v selectu (tam tooltip nejde) – odkdy jsou data. */
    nameSince: `${i.name} (${sinceLabel(i)})`,
    since: i.since,
    zdroj: zdrojDat(i),
    category: categoryOf(i),
    isin: ucits ? i.proxyEtf!.isin : '',
    etfName: ucits ? i.proxyEtf!.name : '',
    ter: ucits ? i.proxyEtf!.ter : 0,
  };
});

/* === Hotová portfolia ===
 * „Celý svět“ znamená ve všech nástrojích totéž: fond Vanguard Total World (VT, index FTSE Global All Cap),
 * data od 6/2008 (stejně jako složka „Celý svět“ a stroj času). Starší aproximace 60 % S&P 500 + 40 % svět
 * mimo USA se jmenuje poctivě „USA + zbytek světa“ (revize 18. 10. 2026: dřív se jí říkalo „Celý svět“).
 * Id 'global-since-2000' zůstává kvůli sdíleným odkazům. */
const PRESET_PORTFOLIOS = [
  { id: 'sp500-100', name: '100% S&P 500', description: '500 největších firem USA v jednom indexu – nejsledovanější akciová sázka na americkou ekonomiku. Nejvyšší dlouhodobý výnos, ale i hluboké propady.', etfs: [{ indexCode: 'sp500', weight: 100 }] },
  { id: 'cely-svet', name: 'Celý svět', description: 'Akcie celého světa v jednom fondu – vyspělé i rozvíjející se trhy, velké i malé firmy (Vanguard Total World, VT). Data od června 2008; delší historii ukáže „USA + zbytek světa“.', etfs: [{ indexCode: 'ftse_all_world', weight: 100 }] },
  { id: 'global-since-2000', name: 'USA + zbytek světa', description: '60 % USA (S&P 500) + 40 % akcie mimo USA (vyspělé i rozvíjející se trhy). Přibližuje akcie celého světa i před rokem 2008, kdy celosvětový fond ještě nebyl – data od roku 2000, projde krizí dot-com i 2008. USA mají ve světovém indexu většinou méně než 60 %.', etfs: [{ indexCode: 'sp500', weight: 60 }, { indexCode: 'world_ex_us', weight: 40 }] },
  // 60/40 = stejné složení jako modelové portfolio 60/40 (portfolioData.ts): dluhopisy přes státní dluhopisy eurozóny v EUR
  // (kolo 5, 18. 10. 2026; dřív americký AGG v USD – v Kč se chová úplně jinak než evropský fond zajištěný do eur).
  { id: '60-40', name: '60/40 portfolio', description: 'Klasika investování: 60 % akcie celého světa, 40 % státní dluhopisy eurozóny (v eurech). Dluhopisy tlumí propady – klidnější jízda za cenu o něco nižšího výnosu.', etfs: [{ indexCode: 'ftse_all_world', weight: 60 }, { indexCode: 'eur_govt_bond', weight: 40 }] },
  {
    id: 'all-weather', name: 'All Weather (Ray Dalio)', description: 'Portfolio slavného investora Raye Dalia: akcie + dlouhé i krátké dluhopisy + zlato a komodity. Cíl není nejvyšší výnos, ale obstát v každé fázi ekonomiky (růst, recese, inflace).',
    etfs: [
      { indexCode: 'ftse_all_world', weight: 30 }, { indexCode: 'us_treasury_20y', weight: 40 },
      { indexCode: 'us_treasury_7_10y', weight: 15 }, { indexCode: 'gold', weight: 7.5 }, { indexCode: 'commodities', weight: 7.5 },
    ],
  },
  {
    id: 'permanent', name: 'Permanentní portfolio', description: 'Portfolio Harryho Browna: po 25 % akcie, dlouhé státní dluhopisy, krátké dluhopisy (hotovost) a zlato. Jednoduché a odolné „za každého počasí".',
    etfs: [
      { indexCode: 'ftse_all_world', weight: 25 }, { indexCode: 'us_treasury_20y', weight: 25 },
      { indexCode: 'us_treasury_1_3y', weight: 25 }, { indexCode: 'gold', weight: 25 },
    ],
  },
  {
    id: 'developed-world', name: 'Rozvinutý svět', description: 'Akcie rozvinutého světa BEZ rozvíjejících se trhů – 60 % USA + 40 % ostatní vyspělé trhy (Evropa, Japonsko, Kanada, Austrálie…). Pro toho, kdo nechce Čínu, Indii a další EM.',
    etfs: [{ indexCode: 'sp500', weight: 60 }, { indexCode: 'msci_eafe', weight: 40 }],
  },
  {
    id: 'buffett-90-10', name: 'Buffettovo 90/10', description: 'Co Warren Buffett odkázal manželce: 90 % S&P 500 + 10 % krátké státní dluhopisy. Sázka na jednoduchost, nízké náklady a dlouhý horizont.',
    etfs: [{ indexCode: 'sp500', weight: 90 }, { indexCode: 'us_treasury_1_3y', weight: 10 }],
  },
];

// Krátké názvy presetů pro kompaktní chipy (jedna scrollovací řádka).
const PRESET_SHORT: Record<string, string> = {
  'sp500-100': 'S&P 500',
  'cely-svet': 'Celý svět',
  'global-since-2000': 'USA + zbytek světa',
  'developed-world': 'Rozvinutý svět',
  '60-40': '60/40',
  'all-weather': 'All Weather',
  'permanent': 'Permanentní',
  'buffett-90-10': 'Buffett 90/10',
};

// Investiční styly (faktory) – rychlý vstup „faktor vs S&P 500". Kliknutí nahraje faktor (100 %),
// přidá S&P 500 do porovnání a spustí. `since` = odkdy má faktor REÁLNÉ ETF (momentum/quality až 2014).
const FACTOR_STYLES: { code: string; label: string; slug: string; since: string }[] = [
  { code: 'us_momentum', label: 'Momentum', slug: 'momentum', since: '2014-01-01' },
  { code: 'us_value', label: 'Value', slug: 'value', since: '2000-06-01' },
  { code: 'us_growth', label: 'Growth', slug: 'growth', since: '2000-06-01' },
  { code: 'us_small_cap', label: 'Small cap', slug: 'small-cap', since: '2000-06-01' },
  { code: 'us_quality', label: 'Quality', slug: 'quality', since: '2014-01-01' },
  { code: 'us_min_vol', label: 'Min. volatilita', slug: 'min-vol', since: '2011-11-01' },
  { code: 'us_dividend', label: 'Dividendové', slug: 'dividend', since: '2006-12-01' },
];

/** Konkrétní fond (VWCE…) místo třídy aktiv: historie z indexu, výpočet přepočtený na TER fondu. */
interface FondInfo { isin: string; ticker: string | null; ter: number; zdroj: string; shoda: 'stejny' | 'blizky'; prepocet: boolean }
interface SelectedETF {
  isin: string; name: string; ter: number; indexCode: string; indexName: string; weight: number;
  fond?: FondInfo;
}
/** Klíč řádku: fond podle ISIN (VWCE i VWRL mají stejný index), třída aktiv podle kódu indexu. */
const idRadku = (e: SelectedETF) => e.fond?.isin ?? e.indexCode;
/** Odpověď /api/backtest/fondy */
type NalezenyFond =
  | { ok: true; isin: string; ticker: string | null; name: string | null; ter: number; indexCode: string; indexName: string; shoda: 'stejny' | 'blizky'; zdroj: string; prepocet: boolean }
  | { ok: false; isin: string; ticker: string | null; name: string | null; duvod: string };
const fondNaRadek = (f: Extract<NalezenyFond, { ok: true }>, weight: number): SelectedETF => ({
  isin: f.isin, name: f.name ?? f.isin, ter: f.ter, indexCode: f.indexCode, indexName: f.indexName, weight,
  fond: { isin: f.isin, ticker: f.ticker, ter: f.ter, zdroj: f.zdroj, shoda: f.shoda, prepocet: f.prepocet !== false },
});

// Sestaví vybrané fondy z hotového portfolia (preset id) – pro applyPreset i pro
// prvotní naplnění widgetu přes prop defaultPreset (embed v článku).
function presetToETFs(presetId: string): SelectedETF[] {
  const preset = PRESET_PORTFOLIOS.find((p) => p.id === presetId);
  if (!preset) return [];
  return preset.etfs.map((item) => {
    const index = AVAILABLE_INDEXES.find((i) => i.indexCode === item.indexCode)!;
    return { isin: index.isin, name: index.etfName, ter: index.ter, indexCode: index.indexCode, indexName: index.name, weight: item.weight };
  });
}

// === Výstupní typ z API – 1:1 z originálu ===
interface DrawdownPeriod {
  startDate: string; troughDate: string; endDate: string | null; depth: number; lengthMonths: number; recovered: boolean;
}
export interface BacktestResult {
  evolution: Array<{ date: string; value: number }>;
  summary: { amountInvested: number; netAssetValue: number; cagr: number; standardDeviation: number; sharpeRatio: number; sortinoRatio: number };
  returns: { annualReturns: Array<{ year: number; return: number }> };
  /** Reálné zhodnocení po české inflaci (ČSÚ). Chybí, když období leží mimo CPI řadu. */
  inflation?: { nominalCAGR: number; realCAGR: number; inflationRate: number };
  risk: {
    maxDrawdown: DrawdownPeriod;
    allDrawdowns?: DrawdownPeriod[];
    valueAtRisk95: number;
  };
  stressPeriods?: Array<{ key: string; name: string; startDate: string; troughDate: string; drop: number; recoveryMonths: number | null }>;
  drawdownSeries?: Array<{ date: string; drawdown: number }>;
  rollingReturns?: Array<{ years: number; average: number; high: number; low: number; count: number; positiveShare: number }>;
}

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: 'CZK', label: 'Kč' }, { code: 'EUR', label: '€' }, { code: 'USD', label: '$' },
];

// Barvy sérií pro porovnání: [0] = vlastní portfolio (teal), [1..] = porovnávaná.
const SERIES_COLORS = ['#0d9488', '#6366f1', '#f59e0b'];

const fmtMoney = (v: number, currency: Currency) =>
  new Intl.NumberFormat('cs-CZ', { style: 'currency', currency, maximumFractionDigits: 0 }).format(v);

const fmtPct = (v: number, digits = 1) =>
  `${v.toLocaleString('cs-CZ', { minimumFractionDigits: digits, maximumFractionDigits: digits })} %`;


/** „16. 10. 2026“ – datum posledního bodu dat (každé číslo má datum). */
const fmtDen = (iso: string) =>
  new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });
/** „1/2005“ – krátký měsíc pro kontextové řádky. */
const fmtMes = (iso: string) => { const d = new Date(iso); return `${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`; };

/* === OSY GRAFŮ (revize 18. 10. 2026) === kulaté kroky (src/lib/osyGrafu.ts), jednotka v nadpisu
   grafu, na ose X jen roky (dřív náhodné měsíce). */
/** Roky na ose X: 1. ledna, krok 1/2/5/10 let podle délky období (max ~6 popisků i na mobilu). */
const rokyOsy = (t0: number, t1: number) => {
  const y0 = new Date(t0).getUTCFullYear(), y1 = new Date(t1).getUTCFullYear();
  const span = y1 - y0;
  const krok = span <= 5 ? 1 : span <= 11 ? 2 : span <= 28 ? 5 : 10;
  const out: number[] = [];
  for (let y = Math.ceil(y0 / krok) * krok; y <= y1; y += krok) {
    const t = Date.UTC(y, 0, 1);
    if (t >= t0 && t <= t1) out.push(t);
  }
  return out;
};
const fmtRok = (t: number) => String(new Date(t).getUTCFullYear());
const jednotka = (c: Currency) => (c === 'CZK' ? 'v Kč' : c === 'EUR' ? 'v eurech' : 'v dolarech');
const OSA_TICK = { fontSize: 11, fill: '#64748b' } as const;

/** Okno krize „1/2022–10/2022“ – z STRESS_WINDOWS (calculations.ts importuje jen typy, do prohlížeče smí). */
const oknoKrize = (key: string) => {
  const w = STRESS_WINDOWS.find((x) => x.key === key);
  return w ? `${fmtMes(w.start)}–${fmtMes(w.end)}` : '';
};

const indexNameByCode = (code: string) =>
  AVAILABLE_INDEXES.find((i) => i.indexCode === code)?.name ?? code;
const zdrojSlozky = (code: string) => AVAILABLE_INDEXES.find((i) => i.indexCode === code)?.zdroj ?? '';

export default function BacktestWidget({ defaultPreset, defaultStart, defaultAmount, defaultContribFreq, initialResult }: {
  defaultPreset?: string; defaultStart?: string; defaultAmount?: number; defaultContribFreq?: ContributionFrequency;
  /** Výsledek výchozího scénáře spočítaný na serveru (result-first: číslo a graf hned po načtení). */
  initialResult?: BacktestResult | null;
} = {}) {
  const [currency, setCurrency] = useState<Currency>('CZK');
  const [selectedETFs, setSelectedETFs] = useState<SelectedETF[]>(() => {
    const seeded = defaultPreset ? presetToETFs(defaultPreset) : [];
    return seeded.length ? seeded : VYCHOZI_SCENAR.portfolio.map((p) => ({
      isin: p.isin, name: p.name, ter: p.ter, indexCode: p.indexCode, indexName: INDEX_BY_CODE[p.indexCode]?.name ?? p.indexCode, weight: p.weight * 100,
    }));
  });
  const [startDate, setStartDate] = useState(defaultStart ?? VYCHOZI_SCENAR.startDate);
  /* Zadal počáteční datum uživatel sám (pole „Počáteční datum“)? Jen pak je posun startu důvod k varování.
     Start z presetu, výchozího scénáře nebo odkazu (FB) se tiše posune na první den dat (revize 18. 10. 2026:
     odkaz z FB hlásil „Zadali jste start 1. 7. 2002…“, ač návštěvník nic nezadával). */
  const [startZadal, setStartZadal] = useState(false);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [initialAmount, setInitialAmount] = useState(defaultAmount ?? VYCHOZI_SCENAR.initialAmount);
  const [contributionAmount, setContributionAmount] = useState(VYCHOZI_SCENAR.contributions.amount);
  const [contributionFrequency, setContributionFrequency] = useState<ContributionFrequency>(defaultContribFreq ?? VYCHOZI_SCENAR.contributions.frequency);
  const [result, setResult] = useState<BacktestResult | null>(initialResult ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultCurrency, setResultCurrency] = useState<Currency>('CZK');
  // Reálný výnos po inflaci je VOLITELNÝ (default vypnuto) – zapíná se v pokročilém nastavení.
  const [showRealReturn, setShowRealReturn] = useState(false);
  // Porovnání: id hotových portfolií, se kterými se vlastní portfolio poměří (max 2).
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [comparison, setComparison] = useState<{ name: string; result: BacktestResult }[] | null>(null);
  // Config-first compact: aktivní hotové portfolio (pro zvýraznění chipu a souhrn),
  // a rozklik editoru složení (default sbaleno – ukazuje jen souhrn vah).
  const [activePreset, setActivePreset] = useState<string | null>(defaultPreset ?? 'sp500-100');
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [editComposition, setEditComposition] = useState(false);
  /* Engine i API rebalancování umí devět strategií, ale widget dosud natvrdo posílal
     'yearly' – volba nešla nikde nastavit. Přitom to, jak často se portfolio vrací
     k cílovým vahám, výsledkem znatelně hýbe. */
  const [rebalancing, setRebalancing] = useState<RebalancingStrategy>('yearly');
  // Pro jaké nastavení výsledek platí. Revize 18. 10. 2026: po kliku na preset zůstal starý výsledek
  // (S&P 500) pod novým složením bez upozornění = věrohodné špatné číslo (pravidlo č. 1).
  const konfig = JSON.stringify([selectedETFs.map((e) => [e.indexCode, e.isin, e.weight, e.fond?.ter ?? null]), startDate, endDate, initialAmount, contributionAmount, contributionFrequency, rebalancing, compareIds]);
  // Serverový výsledek platí pro výchozí nastavení → hned „aktuální“ (konfig prvního renderu).
  const [vysledekPro, setVysledekPro] = useState<string | null>(initialResult ? konfig : null);
  // Popis toho, co výsledek počítal (složení, vklady) – ukazuje se nad velkým číslem.
  const popisNastaveni = () => {
    const casti = selectedETFs.map((e) => `${e.fond ? (e.fond.ticker ?? e.name) : e.indexName} ${e.weight.toLocaleString('cs-CZ')} %`).join(' + ');
    const nazev = !activeStyle && activePreset && activePreset !== 'sp500-100' ? (PRESET_SHORT[activePreset] ?? null) : null;
    const slozeni = nazev && !casti.startsWith(nazev) ? `${nazev}: ${casti}` : casti;
    const cur = CURRENCIES.find((c) => c.code === currency)?.label ?? '';
    const freq = { monthly: 'měsíčně', quarterly: 'čtvrtletně', yearly: 'ročně', none: '' }[contributionFrequency];
    const vklady = `${initialAmount.toLocaleString('cs-CZ')} ${cur}${contributionFrequency !== 'none' && contributionAmount > 0 ? ` + ${contributionAmount.toLocaleString('cs-CZ')} ${cur} ${freq}` : ''}`;
    return { slozeni, vklady, start: startDate, startZadal, kody: selectedETFs.map((e) => e.indexCode), mena: currency, pocatecni: initialAmount, vklad: contributionFrequency !== 'none' ? contributionAmount : 0, frekvence: contributionFrequency };
  };
  const [popisVysledku, setPopisVysledku] = useState<ReturnType<typeof popisNastaveni> | null>(() => (initialResult ? popisNastaveni() : null));
  // Odkaz s nastavením v URL: serverový (výchozí) výsledek schovat, dokud se nespočítá ten z odkazu.
  const [cekamNaUrl, setCekamNaUrl] = useState(false);
  // Porovnání posunulo začátek (porovnávané portfolio má kratší historii) – kdo a odkdy.
  const [zkraceniPorovnanim, setZkraceniPorovnanim] = useState<{ od: string; nazev: string; puvodne: string } | null>(null);

  // Zaokrouhleno na setiny – 7,5 + 7,5 + … v plovoucí čárce nedává přesně 100.
  const totalWeight = Math.round(selectedETFs.reduce((sum, etf) => sum + etf.weight, 0) * 100) / 100;
  const totalWeightText = totalWeight.toLocaleString('cs-CZ', { maximumFractionDigits: 2 });
  /* Nulové vklady = není co počítat → validační hláška místo výsledku (revize kola 4: 0 + 0 ukázalo výsledek). */
  const bezVkladu = !(initialAmount > 0) && !(contributionFrequency !== 'none' && contributionAmount > 0);
  // Vážený roční poplatek portfolia (TER) – kolik ročně stojí držení celého portfolia.
  const weightedTER = selectedETFs.reduce((sum, etf) => sum + (etf.weight / 100) * etf.ter, 0);

  const applyPreset = (presetId: string) => {
    const preset = PRESET_PORTFOLIOS.find((p) => p.id === presetId);
    if (!preset) return;
    const newETFs: SelectedETF[] = preset.etfs.map((item) => {
      const index = AVAILABLE_INDEXES.find((i) => i.indexCode === item.indexCode)!;
      return { isin: index.isin, name: index.etfName, ter: index.ter, indexCode: index.indexCode, indexName: index.name, weight: item.weight };
    });
    setSelectedETFs(newETFs);
    setActivePreset(presetId);
    setActiveStyle(null);
  };

  // Rychlý vstup „faktor vs S&P 500": nahraje faktor (100 %), přidá index do porovnání,
  // nastaví okno od reálného ETF a vypne pravidelné vklady (čistá jednorázová komparace).
  const applyFactor = (code: string) => {
    const style = FACTOR_STYLES.find((s) => s.code === code);
    const index = AVAILABLE_INDEXES.find((i) => i.indexCode === code);
    if (!style || !index) return;
    setSelectedETFs([{ isin: index.isin, name: index.etfName, ter: index.ter, indexCode: index.indexCode, indexName: index.name, weight: 100 }]);
    setActivePreset(null);
    setActiveStyle(code);
    setEditComposition(false);
    setCompareIds(['sp500-100']);
    setStartDate(style.since);
    setContributionFrequency('none');
    setContributionAmount(0);
  };

  const addETF = (indexCode: string) => {
    const index = AVAILABLE_INDEXES.find((i) => i.indexCode === indexCode);
    if (!index) return;
    if (selectedETFs.some((e) => !e.fond && e.indexCode === indexCode)) return;
    setActivePreset(null); // vlastní úprava složení → už to není hotový preset
    setSelectedETFs((prev) => [
      ...prev,
      { isin: index.isin, name: index.etfName, ter: index.ter, indexCode: index.indexCode, indexName: index.name, weight: 0 },
    ]);
  };

  const removeETF = (id: string) => {
    setActivePreset(null);
    setSelectedETFs((prev) => prev.filter((e) => idRadku(e) !== id));
  };

  const setWeight = (id: string, weight: number) => {
    setActivePreset(null);
    setSelectedETFs((prev) => prev.map((e) => (idRadku(e) === id ? { ...e, weight: Math.max(0, Math.min(100, weight)) } : e)));
  };

  // Přidání konkrétního fondu (hledání podle tickeru/názvu). Váha = zbytek do 100 %.
  const addFond = (f: Extract<NalezenyFond, { ok: true }>) => {
    if (selectedETFs.some((e) => e.fond?.isin === f.isin)) return;
    setActivePreset(null);
    setActiveStyle(null);
    setSelectedETFs((prev) => [...prev, fondNaRadek(f, Math.max(0, 100 - prev.reduce((s, e) => s + e.weight, 0)))]);
    setHledani('');
    setNalezene([]);
  };
  const [hledani, setHledani] = useState('');
  const [nalezene, setNalezene] = useState<NalezenyFond[]>([]);
  const [hledam, setHledam] = useState(false);
  useEffect(() => {
    const q = hledani.trim();
    if (q.length < 2) { setNalezene([]); return; }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setHledam(true);
      try {
        const r = await fetch(`/api/backtest/fondy?q=${encodeURIComponent(q)}`, { signal: ctrl.signal }).then((x) => x.json());
        setNalezene(Array.isArray(r.fondy) ? r.fondy : []);
      } catch { /* zrušeno nebo chyba – necháme prázdné */ } finally { setHledam(false); }
    }, 250);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [hledani]);

  // === Výpočet 1:1 z originálu – stejné tělo požadavku, stejný endpoint ===
  const runBacktest = async (overrideCurrency?: Currency) => {
    // Obrana: overrideCurrency smí být jen platná měna. Kdyby se sem dostal
    // např. klikací event (onClick={runBacktest}), padne JSON.stringify na
    // „cyclic structures". Proto raději fallback na aktuální currency.
    const cur: Currency =
      overrideCurrency === 'EUR' || overrideCurrency === 'CZK' || overrideCurrency === 'USD'
        ? overrideCurrency
        : currency;
    if (totalWeight !== 100) {
      setError(`Rozdělení musí být přesně 100\u00a0%. Aktuálně: ${totalWeightText}\u00a0%`);
      setCekamNaUrl(false);
      return;
    }
    if (selectedETFs.length === 0) {
      setError('Vyberte alespoň jeden fond.');
      setCekamNaUrl(false);
      return;
    }
    if (bezVkladu) {
      setCekamNaUrl(false);
      return; // hláška je u polí s vklady a místo výsledku
    }
    // Každý běh má pořadové číslo – výsledek staršího běhu, který doběhne později, se zahodí.
    const beh = ++behRef.current;
    setLoading(true);
    setError(null);
    const konfigBehu = konfig;
    const popisBehu = popisNastaveni();
    try {
      const contributions = contributionFrequency !== 'none' && contributionAmount > 0
        ? { amount: contributionAmount, frequency: contributionFrequency as 'monthly' | 'quarterly' | 'yearly' }
        : undefined;

      // Jeden běh backtestu se stejnými parametry (částky, měna) – jen jiné složení a případně jiný start.
      const simulateOne = async (
        portfolio: { isin: string; name: string; weight: number; ter: number; indexCode: string; feeOverride?: number }[],
        start: string,
      ) => {
        const response = await fetch('/api/backtest/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            portfolio, startDate: start, endDate, initialAmount,
            rebalancingStrategy: rebalancing, currency: cur, contributions,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Backtest se nepodařilo spustit.');
        }
        return response.json() as Promise<BacktestResult>;
      };

      const mainPortfolio = selectedETFs.map((etf) => ({
        isin: etf.isin, name: etf.name, weight: etf.weight / 100, ter: etf.ter, indexCode: etf.indexCode,
        // Konkrétní fond: data zdrojového fondu přepočtená na poplatek vybraného fondu.
        ...(etf.fond?.prepocet ? { feeOverride: etf.fond.ter } : {}),
      }));
      const compPortfolios = compareIds.map((id) => {
        const preset = PRESET_PORTFOLIOS.find((p) => p.id === id)!;
        return preset.etfs.map((item) => {
          const index = AVAILABLE_INDEXES.find((i) => i.indexCode === item.indexCode)!;
          return { isin: index.isin, name: index.etfName, weight: item.weight / 100, ter: index.ter, indexCode: index.indexCode };
        });
      });

      // Vlastní portfolio + porovnávaná hotová portfolia spočítáme naráz (stejné období/vklady/měna).
      const runAll = (start: string) =>
        Promise.all([simulateOne(mainPortfolio, start), ...compPortfolios.map((pf) => simulateOne(pf, start))]);

      let results = await runAll(startDate);
      let zkraceni: { od: string; nazev: string; puvodne: string } | null = null;

      // FÉR SROVNÁNÍ: každé portfolio má jinak dlouhou historii (např. All-World až od 2008-07).
      // Kdyby jedno mělo delší období, mělo by nespravedlivou výhodu. Proto zarovnáme všechna
      // na společný start = nejpozdější první datum a přepočítáme (jako PortfolioVisualizer).
      if (compareIds.length) {
        const firsts = results.map((r) => r.evolution[0]?.date).filter(Boolean).sort() as string[];
        const commonStart = firsts[firsts.length - 1];
        const earliest = firsts[0];
        if (commonStart && earliest &&
            new Date(commonStart).getTime() - new Date(earliest).getTime() > 40 * 864e5) {
          // Které portfolio období zkrátilo (má data nejpozději)? Řekne se to VIDITELNĚ (revize kola 4).
          const nazvy = ['Vaše portfolio', ...compareIds.map((id) => PRESET_PORTFOLIOS.find((p) => p.id === id)!.name)];
          const kdo = results.findIndex((r) => r.evolution[0]?.date === commonStart);
          zkraceni = { od: commonStart, nazev: nazvy[kdo] ?? 'jedno z portfolií', puvodne: results[0].evolution[0]?.date ?? earliest };
          results = await runAll(commonStart);
        }
      }
      if (beh !== behRef.current) return;

      const [mainData, ...compData] = results;
      setZkraceniPorovnanim(zkraceni && zkraceni.puvodne < zkraceni.od ? zkraceni : null);

      setResult(mainData);
      setVysledekPro(konfigBehu);
      setPopisVysledku(popisBehu);
      setResultCurrency(cur);
      setComparison(
        compareIds.length
          ? compareIds.map((id, i) => ({ name: PRESET_PORTFOLIOS.find((p) => p.id === id)!.name, result: compData[i] }))
          : null,
      );
    } catch (err) {
      if (beh === behRef.current) setError(err instanceof Error ? err.message : 'Neznámá chyba.');
    } finally {
      if (beh === behRef.current) { setLoading(false); setCekamNaUrl(false); }
    }
  };

  const behRef = useRef(0);
  // Ref vždy na nejnovější runBacktest (s aktuálním stavem) – auto-run z něj čte,
  // takže neběží se zastaralými hodnotami z předchozího renderu.
  const runBacktestRef = useRef(runBacktest);
  runBacktestRef.current = runBacktest;
  const didAutoRunRef = useRef(false);
  const konfigRef = useRef(konfig); konfigRef.current = konfig;
  const vysledekProRef = useRef(vysledekPro); vysledekProRef.current = vysledekPro;
  const currencyRef = useRef(currency); currencyRef.current = currency;
  const urlRestored = useRef(false);

  // Předvyplnění z URL (pro sdílené odkazy, např. z FB / článků):
  //   /backtest?portfolio=buffett-90-10&start=2002-07-01&amount=1000000&contrib=none&run=1
  // portfolio = id z PRESET_PORTFOLIOS, run=1 rovnou spustí výpočet.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const presetId = p.get('portfolio');
    const hasPreset = !!presetId && PRESET_PORTFOLIOS.some((x) => x.id === presetId);
    if (hasPreset) applyPreset(presetId!);
    // ?styl=momentum → faktor vs S&P 500 (odkaz z FB/článků o faktorech)
    const stylParam = p.get('styl');
    const style = stylParam ? FACTOR_STYLES.find((x) => x.slug === stylParam || x.code === stylParam) : null;
    if (style) applyFactor(style.code);
    const start = p.get('start');
    if (start && /^\d{4}-\d{2}-\d{2}$/.test(start)) setStartDate(start);
    const amount = p.get('amount');
    if (amount && /^\d+$/.test(amount)) setInitialAmount(parseInt(amount, 10));
    const contrib = p.get('contrib');
    if (contrib === 'none') { setContributionFrequency('none'); setContributionAmount(0); }
    else if (contrib && /^\d+$/.test(contrib)) { setContributionAmount(parseInt(contrib, 10)); setContributionFrequency('monthly'); }
    // VLASTNÍ SLOŽENÍ: ?slozeni=sp500:60,eur_govt_bond:40 – bez tohohle šlo sdílet
    // jen hotový preset a vlastnoručně sestavené portfolio zmizelo i s refreshem.
    const slozeni = p.get('slozeni');
    if (!hasPreset && !style && slozeni) {
      const parsed = slozeni.split(',').map((part) => {
        const [code, w] = part.split(':');
        const idx = AVAILABLE_INDEXES.find((i) => i.indexCode === code);
        if (!idx) return null;
        const weight = Number(w);
        if (!Number.isFinite(weight) || weight <= 0) return null;
        return { isin: idx.isin, name: idx.etfName, ter: idx.ter, indexCode: idx.indexCode, indexName: idx.name, weight };
      }).filter(Boolean) as SelectedETF[];
      if (parsed.length) {
        // Složení shodné s hotovým portfoliem (odkaz z modelových portfolií) → ukázat jeho název.
        const klic = (x: { indexCode: string; weight: number }[]) => x.map((e) => `${e.indexCode}:${e.weight}`).sort().join(',');
        const shoda = PRESET_PORTFOLIOS.find((pp) => klic(pp.etfs) === klic(parsed));
        if (shoda) applyPreset(shoda.id);
        else { setSelectedETFs(parsed); setActivePreset(null); setEditComposition(true); }
      }
    }
    // KONKRÉTNÍ FONDY: ?fondy=IE00BK5BQT80:70,IE00B14X4Q57:30 (odkaz z detailu fondu, sdílení).
    // Dohledání je asynchronní → spuštění (run=1) až po načtení fondů.
    const fondyParam = p.get('fondy');
    const fondyPromise = !hasPreset && !style && fondyParam ? (async () => {
      const vahy = new Map(fondyParam.split(',').map((x) => x.split(':')).filter(([i, w]) => /^[A-Z]{2}[A-Z0-9]{10}$/.test(i) && Number(w) > 0).map(([i, w]) => [i, Number(w)] as const));
      if (!vahy.size) return;
      try {
        const r = await fetch(`/api/backtest/fondy?isin=${[...vahy.keys()].join(',')}`).then((x) => x.json());
        const radky = (r.fondy as NalezenyFond[] ?? []).filter((f): f is Extract<NalezenyFond, { ok: true }> => f.ok).map((f) => fondNaRadek(f, vahy.get(f.isin)!));
        if (radky.length) {
          setSelectedETFs((prev) => [...(slozeni ? prev : []), ...radky]);
          setActivePreset(null); setEditComposition(true);
        }
      } catch { /* bez fondů zůstane výchozí složení */ }
    })() : Promise.resolve();
    const end = p.get('do');
    if (end && /^\d{4}-\d{2}-\d{2}$/.test(end)) setEndDate(end);
    const mena = p.get('mena');
    if (mena === 'CZK' || mena === 'EUR' || mena === 'USD') setCurrency(mena);
    const freq = p.get('freq');
    if (freq === 'none' || freq === 'monthly' || freq === 'quarterly' || freq === 'yearly') setContributionFrequency(freq);
    const vyv = p.get('vyvazovani');
    if (vyv) setRebalancing(vyv as RebalancingStrategy);
    const vklad = p.get('vklad');
    if (vklad && /^\d+$/.test(vklad)) setContributionAmount(parseInt(vklad, 10));
    // Je-li v URL jakékoli nastavení, výpočet se spustí sám (dřív jen s run=1 – sdílený odkaz bez
    // run=1 ukázal formulář bez výsledku). Spuštění odložíme na další tick, až se stavy propíšou;
    // ref hlídá jediné spuštění. Výsledek je nahoře, takže se nikam nescrolluje.
    const NASTAVENI_V_URL = ['portfolio', 'styl', 'slozeni', 'fondy', 'start', 'do', 'amount', 'contrib', 'mena', 'freq', 'vyvazovani', 'vklad'];
    if (NASTAVENI_V_URL.some((k) => p.has(k))) {
      setCekamNaUrl(true);
      fondyPromise.then(() => setTimeout(() => {
        if (didAutoRunRef.current) return;
        didAutoRunRef.current = true;
        // Odkaz jen na výchozí scénář (např. ?portfolio=sp500-100) → serverový výsledek platí, nepočítat znovu.
        if (initialResult && konfigRef.current === vysledekProRef.current && currencyRef.current === 'CZK') { setCekamNaUrl(false); return; }
        runBacktestRef.current();
      }, 80));
    }
    urlRestored.current = true;
    // Jen jednou při načtení stránky.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ZÁPIS STAVU DO URL. Dřív se do URL nedostalo nic – nasimulovaný backtest zmizel
     s refreshem a nešel nikomu poslat. Preset se zapisuje jako `portfolio=<id>`
     (odkaz zůstane čitelný), vlastní složení jako `slozeni=kod:vaha,...`.
     replaceState, ať se nezanáší historie při každé změně částky. */
  useEffect(() => {
    if (!urlRestored.current) return;
    const p = new URLSearchParams();
    if (activeStyle) p.set('styl', activeStyle);
    // Výchozí S&P 500 do URL nepíšeme – jinak by refresh bral „nastavení z odkazu“ a zbytečně přepočítával.
    else if (activePreset) { if (activePreset !== (defaultPreset ?? 'sp500-100')) p.set('portfolio', activePreset); }
    else if (selectedETFs.length) {
      const tridy = selectedETFs.filter((e) => !e.fond), fondy = selectedETFs.filter((e) => e.fond);
      if (tridy.length) p.set('slozeni', tridy.map((e) => `${e.indexCode}:${e.weight}`).join(','));
      if (fondy.length) p.set('fondy', fondy.map((e) => `${e.fond!.isin}:${e.weight}`).join(','));
    }
    if (startDate !== '2005-01-01') p.set('start', startDate);
    if (endDate !== new Date().toISOString().split('T')[0]) p.set('do', endDate);
    if (initialAmount !== 100000) p.set('amount', String(initialAmount));
    if (contributionFrequency !== 'monthly') p.set('freq', contributionFrequency);
    if (contributionAmount !== 5000) p.set('vklad', String(contributionAmount));
    if (currency !== 'CZK') p.set('mena', currency);
    if (rebalancing !== 'yearly') p.set('vyvazovani', rebalancing);
    const qs = p.toString();
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}${window.location.hash}` : window.location.pathname + window.location.hash);
  }, [activeStyle, activePreset, selectedETFs, startDate, endDate, initialAmount, contributionFrequency, contributionAmount, currency, rebalancing]);

  const availableToAdd = AVAILABLE_INDEXES.filter((i) => !selectedETFs.some((e) => !e.fond && e.indexCode === i.indexCode));

  // Data pro recharts: hodnota portfolia + vložené prostředky (pro kontext).
  // Denní řada má ~5000+ bodů → obří SVG path, na mobilu se dlouho vykresluje a chvíli
  // je graf prázdný. Podvzorkujeme na ~400 bodů (poslední bod zachováme) – vizuálně
  // identické na šířce grafu, ale path je ~30× menší a kreslí se okamžitě.
  // „Vloženo“ v čase = schody podle vkladů (stejné pravidlo jako engine: vklad na prvním dni nového
  // měsíce/čtvrtletí/roku, ne první den). Dřív vodorovná čára na KONEČNÉ sumě → graf tvrdil, že portfolio
  // bylo léta „pod vloženými penězi“ (test s uživatelem 18. 10. 2026). Nesedí-li součet s výsledkem
  // enginu, čáru nekreslíme (pravidlo č. 1).
  const chartData = useMemo(() => {
    if (!result || !popisVysledku) return [];
    const ev = result.evolution;
    // Vklady podle parametrů, se kterými výsledek POČÍTAL (popisVysledku), ne podle aktuálního formuláře.
    const { kumul, celkem } = vkladyVCase(ev, popisVysledku.pocatecni, popisVysledku.vklad, popisVysledku.frekvence);
    const sedi = Math.abs(celkem - result.summary.amountInvested) < 1;
    const MAX = 400;
    const step = ev.length > MAX ? Math.ceil(ev.length / MAX) : 1;
    const out: { date: string; t: number; value: number; vlozeno?: number }[] = [];
    const bod = (i: number) => ({ date: ev[i].date, t: Date.parse(ev[i].date), value: Math.round(ev[i].value), ...(sedi ? { vlozeno: kumul[i] } : {}) });
    for (let i = 0; i < ev.length; i += step) out.push(bod(i));
    if (out.length && out[out.length - 1].date !== ev[ev.length - 1].date) out.push(bod(ev.length - 1));
    return out;
  }, [result, popisVysledku]);
  /* Roční zhodnocení VAŠICH vkladů (XIRR) – jen když se pravidelně vkládalo. Srovnatelné s kalkulačkou se
     stálým výnosem; CAGR výše je časově vážený výnos portfolia (nezávisí na tom, kdy jste vkládali). */
  const irr = useMemo(() => {
    if (!result || !popisVysledku || !(popisVysledku.vklad > 0)) return null;
    return zhodnoceniVkladu(result.evolution, popisVysledku.pocatecni, popisVysledku.vklad, popisVysledku.frekvence, result.summary.amountInvested);
  }, [result, popisVysledku]);
  const maVlozeno = chartData.length > 0 && chartData[0].vlozeno != null;

  // Neúplné krajní roky (výpočet nezačal v lednu / data nekončí v prosinci) – nesoutěží o nejlepší/nejhorší rok.
  const castecneRoky = useMemo(() => {
    const out = new Set<number>();
    const ev = result?.evolution ?? [];
    if (ev.length < 2) return out;
    const p = new Date(ev[0].date), k = new Date(ev[ev.length - 1].date);
    if (p.getUTCMonth() > 0 || p.getUTCDate() > 7) out.add(p.getUTCFullYear());
    if (!(k.getUTCMonth() === 11 && k.getUTCDate() >= 28)) out.add(k.getUTCFullYear());
    return out;
  }, [result]);

  // Nejlepší/nejhorší CELÝ rok (časově vážené roční výnosy z enginu).
  const advanced = useMemo(() => {
    const ar = (result?.returns.annualReturns ?? []).filter((r) => !castecneRoky.has(r.year));
    if (ar.length === 0 || !result) return null;
    let best = ar[0], worst = ar[0];
    for (const r of ar) {
      if (r.return > best.return) best = r;
      if (r.return < worst.return) worst = r;
    }
    return { best, worst };
  }, [result, castecneRoky]);

  // Největší propady (drawdowny) – API je počítá z time-weighted NAV. Nejhlubší první.
  const topDrawdowns = useMemo(() => {
    const dd = result?.risk.allDrawdowns ?? [];
    return [...dd].sort((a, b) => a.depth - b.depth).slice(0, 5);
  }, [result]);
  /* Dvě RŮZNÉ epizody se mohou na 1 desetinné místo shodovat (70/30 od 2008: −19,93 % v 2021–23 a −19,82 % v 2008).
     Revize kola 4 to četla jako duplicitu → u shody ukážeme setiny. Ověřeno 18. 10. 2026, viz ZAMERNA-ROZHODNUTI.md. */
  const ddDesetin = useMemo(() => {
    const r1 = topDrawdowns.map((d) => (d.depth * 100).toFixed(1));
    return new Set(r1).size < r1.length ? 2 : 1;
  }, [topDrawdowns]);

  // Kontext výsledku: kdy data začínají / končí a zda se start posunul proti zadání.
  const prvni = result?.evolution[0]?.date;
  const posledni = result?.evolution[result.evolution.length - 1]?.date;
  const posunStartu = (() => {
    if (!result || !prvni || !popisVysledku) return null;
    const zadano = Date.parse(`${popisVysledku.start}T00:00:00Z`);
    if (Date.parse(prvni) - zadano < 15 * 864e5) return null;
    // Která složka začíná nejpozději (manifest)? Jinak omezují kurzy (Kč/€ od 1/2000) nebo společné období porovnání.
    const nejpozdejsi = popisVysledku.kody
      .map((c) => INDEX_BY_CODE[c]).filter(Boolean)
      .sort((a, b) => (a.since < b.since ? 1 : -1))[0];
    const duvod = nejpozdejsi && Date.parse(`${nejpozdejsi.since}T00:00:00Z`) > zadano
      ? `${nejpozdejsi.name} má data až od ${fmtDen(nejpozdejsi.since)}`
      : popisVysledku.mena !== 'USD' && zadano < Date.UTC(2000, 0, 1)
        ? 'kurzy koruny a eura máme až od ledna 2000'
        : comparison ? 'porovnání běží na společném období všech portfolií' : 'ne všechny složky mají data od zvoleného dne';
    return { zadano: fmtDen(popisVysledku.start), duvod, zadal: popisVysledku.startZadal };
  })();
  const zastaraly = !!result && vysledekPro !== konfig;
  /* AUTOMATICKÝ PŘEPOČET (revize kola 4): změna vkladu, období, porovnání… → po 0,8 s se spočítá sám, starý výsledek
     je mezitím zašedlý. Neplatné nastavení (součet vah ≠ 100 %, nulové vklady) nepočítá a říká proč. */
  const lzePocitat = totalWeight === 100 && selectedETFs.length > 0 && !bezVkladu;
  // Chyba platí pro nastavení, se kterým vznikla – po změně se zkusí znovu (jinak by auto-přepočet stál).
  const prvniKonfig = useRef(konfig);
  useEffect(() => { if (konfig !== prvniKonfig.current) setError(null); }, [konfig]);
  useEffect(() => {
    if (!urlRestored.current || cekamNaUrl || loading || error || !result || vysledekPro === konfig || !lzePocitat) return;
    const t = setTimeout(() => runBacktestRef.current(), 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [konfig, vysledekPro, lzePocitat, cekamNaUrl, loading, error]);
  // Ovládací prvek období ukazuje SKUTEČNÝ začátek výpočtu (dřív „od 1/2005“, ač výpočet začínal 6/2008).
  // Vlastní zadání uživatele necháváme, jak ho napsal (u něj se posun hlásí varováním).
  const startZobrazeny = !startZadal && !zastaraly && !loading && prvni ? prvni.slice(0, 10) : startDate;
  const osaY = useMemo(() => {
    const max = chartData.reduce((m, d) => Math.max(m, d.value, d.vlozeno ?? 0), 0);
    return kulateKroky(max, 0, 4);
  }, [chartData]);
  const t0 = chartData[0]?.t ?? 0, t1 = chartData[chartData.length - 1]?.t ?? 0;
  const ddData = useMemo(() => (result?.drawdownSeries ?? []).map((p) => ({ t: Date.parse(p.date), dd: +(p.drawdown * 100).toFixed(2) })), [result]);
  const ddOsa = useMemo(() => {
    const min = ddData.reduce((m, d) => Math.min(m, d.dd), 0);
    return kulateKroky(0, min, 3);
  }, [ddData]);
  /* Kolik měsíců bylo portfolio hluboko pod vrcholem – ze STEJNÉ řady jako graf (za měsíc nejhlubší bod
     denních dat, takže dno grafu = max. pokles). Dřív se podíl zaokrouhloval na celá procenta a „max. pokles
     −20,4 %“ stál vedle „víc než 20 % pod vrcholem v 0 % měsíců“ (revize 18. 10. 2026) → počty měsíců. */
  const podVrcholem = useMemo(() => {
    const dd = result?.drawdownSeries ?? [];
    if (dd.length < 12) return null;
    const pocet = (x: number) => dd.filter((p) => p.drawdown < -x).length;
    return { deset: pocet(0.1), dvacet: pocet(0.2), celkem: dd.length };
  }, [result]);
  /* MOBIL: výsledek je nad nastavením, takže po kliku na preset se měnil mimo obrazovku (revize 18. 10. 2026).
     Když karta výsledku není vidět, drží se dole lišta s číslem (jako v kalkulačce) – při výpočtu „Počítám…“,
     u zastaralého výsledku tlačítko „Přepočítat“. */
  const vysledekRef = useRef<HTMLDivElement>(null);
  const [vysledekVidet, setVysledekVidet] = useState(true);
  useEffect(() => {
    const el = vysledekRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([z]) => setVysledekVidet(z.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Nad patičkou se lišta schová (revize kola 4: zakrývala odkazy patičky).
  const [paticka, setPaticka] = useState(false);
  useEffect(() => {
    const el = document.querySelector('footer');
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([z]) => setPaticka(z.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const listaDole = !vysledekVidet && !paticka && !cekamNaUrl && (loading || !!result);
  useEffect(() => {
    // Lišta nesmí zakrýt konec stránky (patičku) – dočasné odsazení těla jen na mobilu.
    if (!listaDole || window.matchMedia('(min-width: 1024px)').matches) return;
    const puvodni = document.body.style.paddingBottom;
    document.body.style.paddingBottom = '64px';
    return () => { document.body.style.paddingBottom = puvodni; };
  }, [listaDole]);
  const nKrizi = result?.stressPeriods?.length ?? 0;
  const gridKrizi = nKrizi >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : nKrizi === 3 ? 'sm:grid-cols-3' : nKrizi === 2 ? 'sm:grid-cols-2' : '';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
        {/* ===== VÝSLEDEK (mobil: první; desktop: vpravo, lepkavý) ===== */}
        <div id="vysledek" ref={vysledekRef} data-sekce="backtest-vysledek" className="lg:order-2 lg:sticky lg:top-[4.5rem] space-y-3 scroll-mt-20">
          {bezVkladu && (
            <div role="alert" className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              <span>Zadejte počáteční nebo pravidelný vklad – s nulovými vklady není co počítat.</span>
            </div>
          )}
          {zastaraly && !cekamNaUrl && !bezVkladu && (
            <div role="status" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600">
              {lzePocitat
                ? <><Loader2 className="w-4 h-4 animate-spin text-teal-700" /> Přepočítávám pro nové nastavení…</>
                : <><AlertTriangle className="w-4 h-4 text-amber-600" /> Výsledek platí pro předchozí nastavení – součet vah musí být 100&nbsp;%.</>}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-red-800">Backtest se nepodařilo spustit</p>
                <p className="text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {(cekamNaUrl || (loading && !result)) ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6" aria-busy="true">
              <p className="flex items-center gap-2 text-sm text-slate-600"><Loader2 className="w-4 h-4 animate-spin text-teal-700" /> Počítám historický vývoj…</p>
              <div className="mt-5 h-4 w-1/2 rounded bg-slate-100 animate-pulse" />
              <div className="mt-2 h-10 w-2/3 rounded bg-slate-100 animate-pulse" />
              <div className="mt-4 h-3 rounded-full bg-slate-100 animate-pulse" />
              <div className="mt-6 h-56 rounded-lg bg-slate-50 animate-pulse" />
            </div>
          ) : result && prvni && posledni ? (() => {
            const invested = result.summary.amountInvested;
            const final = result.summary.netAssetValue;
            const profit = final - invested;
            const gain = profit >= 0;
            const profitPct = invested > 0 ? (profit / invested) * 100 : 0;
            const seg = gain
              ? [{ label: 'Vloženo', v: invested, color: 'bg-slate-300' }, { label: 'Zisk', v: profit, color: 'bg-emerald-500' }]
              : [{ label: 'Zůstalo', v: final, color: 'bg-slate-300' }, { label: 'Ztráta', v: -profit, color: 'bg-red-400' }];
            const total = seg.reduce((s, x) => s + x.v, 0) || 1;
            return (
              <div className={`rounded-xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm transition-opacity ${loading || zastaraly || bezVkladu ? 'opacity-40' : ''}`} aria-hidden={zastaraly || bezVkladu || undefined}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 leading-snug">{popisVysledku?.slozeni}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {popisVysledku?.vklady} · {fmtMes(prvni)} – {fmtDen(posledni)}
                      {posunStartu && !posunStartu.zadal && (
                        <> · <InfoTip label={`Výpočet začíná ${fmtDen(prvni)}, protože ${posunStartu.duvod}.`}>data od {fmtMes(prvni)}</InfoTip></>
                      )}
                    </p>
                  </div>
                  <a href="#nastaveni" className="lg:hidden shrink-0 inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 min-h-[40px] text-sm font-medium text-teal-700">
                    <Pencil className="w-3.5 h-3.5" /> Upravit
                  </a>
                </div>

                {zkraceniPorovnanim && (
                  <p className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 leading-relaxed">
                    <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                    <span><b>Období zkráceno na {fmtMes(zkraceniPorovnanim.od)}</b>, protože {zkraceniPorovnanim.nazev} má data až od {fmtDen(zkraceniPorovnanim.od)}. Bez porovnání by výpočet začínal {fmtMes(zkraceniPorovnanim.puvodne)}.</span>
                  </p>
                )}
                {posunStartu?.zadal && !zkraceniPorovnanim && (
                  <p className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 leading-relaxed">
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600" />
                    <span>Zadali jste start {posunStartu.zadano}, ale {posunStartu.duvod}. <b>Výsledek začíná {fmtDen(prvni)}.</b></span>
                  </p>
                )}

                <p className="mt-4 text-sm text-slate-600">
                  Z vložených <span className="font-semibold text-slate-800 tabular-nums">{fmtMoney(invested, resultCurrency)}</span> by k {fmtDen(posledni)} bylo
                </p>
                <p className="text-4xl md:text-5xl font-bold tracking-tight tabular-nums text-slate-900 mt-1">{fmtMoney(final, resultCurrency)}</p>
                <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  {seg.map((s) => (
                    <div key={s.label} className={s.color} style={{ width: `${(s.v / total) * 100}%` }} />
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-slate-600">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-300" />
                    Vloženo <span className="font-semibold tabular-nums text-slate-800">{fmtMoney(invested, resultCurrency)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-600">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${gain ? 'bg-emerald-500' : 'bg-red-400'}`} />
                    {gain ? 'Zisk' : 'Ztráta'}{' '}
                    <span className={`font-semibold tabular-nums ${gain ? 'text-emerald-700' : 'text-red-600'}`}>
                      {gain ? '+' : ''}{fmtMoney(profit, resultCurrency)} ({gain ? '+' : ''}{fmtPct(profitPct, 0)})
                    </span>
                  </span>
                </div>
                {irr != null && (
                  <p className="mt-2 text-sm text-slate-600">
                    <InfoTip label={`Vnitřní výnosové procento vašich vkladů (XIRR): jaký stálý roční výnos by ze stejných vkladů ve stejných dnech udělal stejnou konečnou částku – srovnatelné s investiční kalkulačkou. Roční zhodnocení portfolia níže (CAGR) je časově vážené: nezávisí na tom, kdy a kolik jste vkládali. Liší se, protože pozdější vklady byly investované kratší dobu a zažily jiné roky než počáteční vklad.`}>
                      Vaše vklady se zhodnocovaly
                    </InfoTip>{' '}
                    <span className={`font-semibold tabular-nums ${irr >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{fmtPct(irr * 100)} ročně</span>
                  </p>
                )}

                {/* Graf vývoje hodnoty */}
                <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-xs font-medium text-slate-700">Hodnota portfolia {jednotka(resultCurrency)}</p>
                  <p className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-teal-600" /> hodnota</span>
                    {maVlozeno && <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3 border-t border-dashed border-slate-500" /> vloženo</span>}
                  </p>
                </div>
                <div className="mt-2 h-60 md:h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="btFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0d9488" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#0d9488" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="t" type="number" domain={[t0, t1]} ticks={rokyOsy(t0, t1)} tickFormatter={fmtRok}
                        tick={OSA_TICK} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                      <YAxis width={56} ticks={osaY} domain={[0, osaY[osaY.length - 1]]} tickFormatter={fmtOsa}
                        tick={OSA_TICK} axisLine={false} tickLine={false} />
                      <Tooltip
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload.length) return null;
                          const p = payload[0].payload as { date: string; value: number; vlozeno?: number };
                          return (
                            <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
                              <div className="font-semibold mb-0.5">
                                {new Date(p.date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="inline-block w-2 h-2 rounded-full bg-teal-400" />
                                Hodnota: <span className="font-medium tabular-nums">{fmtMoney(p.value, resultCurrency)}</span>
                              </div>
                              {p.vlozeno != null && (
                                <div className="mt-0.5 text-slate-300">Vloženo: <span className="tabular-nums">{fmtMoney(p.vlozeno, resultCurrency)}</span></div>
                              )}
                            </div>
                          );
                        }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2} fill="url(#btFill)" isAnimationActive={false} />
                      {maVlozeno && <Area type="stepAfter" dataKey="vlozeno" stroke="#64748b" strokeDasharray="4 4" strokeWidth={1.5} fill="none" isAnimationActive={false} />}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Klíčové ukazatele – tři, ne čtyři: konečná hodnota je velké číslo nahoře */}
                <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 pt-4">
                  <div className="pr-2 sm:pr-3">
                    <p className="text-xs text-slate-500 flex items-center gap-0.5">
                      <span className="sm:hidden">Ročně</span><span className="hidden sm:inline">Roční zhodnocení</span>
                      <InfoTip label="Časově vážený výnos portfolia (CAGR): průměrné roční tempo se složeným úročením, očištěné od toho, kdy a kolik jste vkládali. U portfolia z více složek ho vklady mohou nepatrně ovlivnit, protože se rozdělují podle cílových vah. Nominálně = v korunách, jak je vidíte na účtu."><span className="sr-only">vysvětlení</span></InfoTip>
                    </p>
                    <p className={`mt-0.5 text-lg md:text-xl font-bold tabular-nums ${result.summary.cagr >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{fmtPct(result.summary.cagr * 100)}</p>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">
                      {!showRealReturn ? 'průměrně za rok'
                        : result.inflation ? `${fmtPct(result.inflation.realCAGR * 100)} po inflaci`
                          : resultCurrency !== 'CZK' ? 'po inflaci jen v Kč' : 'inflace až od 1999'}
                    </p>
                  </div>
                  <div className="px-2 sm:px-3">
                    <p className="text-xs text-slate-500 flex items-center gap-0.5">
                      Max. pokles
                      <InfoTip label="Největší propad od vrcholu po dno kdykoli v období – z denních dat časově vážené hodnoty portfolia (vklady ho nemaskují). „Návrat“ = za jak dlouho od dna se hodnota vrátila na předchozí vrchol."><span className="sr-only">vysvětlení</span></InfoTip>
                    </p>
                    <p className="mt-0.5 text-lg md:text-xl font-bold tabular-nums text-red-600">{fmtPct(result.risk.maxDrawdown.depth * 100)}</p>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">dno {fmtMes(result.risk.maxDrawdown.troughDate)} · <span className={result.risk.maxDrawdown.recovered ? 'text-emerald-700' : 'text-amber-700'}>{navratPoPropadu(result.risk.maxDrawdown)}</span></p>
                  </div>
                  <div className="pl-2 sm:pl-3">
                    <p className="text-xs text-slate-500 flex items-center gap-0.5">
                      Kolísavost
                      <InfoTip label="Volatilita – jak silně hodnota kolísá nahoru a dolů (roční směrodatná odchylka z měsíčních výnosů). Vyšší číslo = divočejší jízda."><span className="sr-only">vysvětlení</span></InfoTip>
                    </p>
                    <p className="mt-0.5 text-lg md:text-xl font-bold tabular-nums text-slate-900">{fmtPct(result.summary.standardDeviation * 100)}</p>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">ročně</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                  Historie, ne předpověď. Poplatky fondů jsou v datech, poplatky brokera, spready ani daně ne.
                </p>
              </div>
            );
          })() : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
              Zvolte portfolio a klikněte na <b>Otestovat na historii</b>.
            </div>
          )}
        </div>

        {/* ===== NASTAVENÍ ===== */}
        <div id="nastaveni" data-sekce="backtest-nastaveni" className="lg:order-1 rounded-xl border border-slate-200 bg-white p-4 md:p-5 scroll-mt-20">
          <h2 className="text-base font-semibold text-slate-900 mb-3">Nastavení portfolia</h2>

          {/* Hotová portfolia */}
          <div className="mb-4">
            <p className="text-xs font-medium text-slate-500 mb-2">Hotové portfolio</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-1.5">
              {PRESET_PORTFOLIOS.map((preset) => {
                const on = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={on}
                    data-track={`preset:${preset.id}`}
                    onClick={() => { applyPreset(preset.id); setTimeout(() => runBacktestRef.current(), 90); }}
                    className={`flex h-12 items-center justify-center rounded-lg border px-1.5 text-[13px] font-medium leading-tight text-center transition-colors ${on ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/60'}`}
                  >
                    {PRESET_SHORT[preset.id] ?? preset.name}
                  </button>
                );
              })}
            </div>
            {activePreset && (
              <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">{PRESET_PORTFOLIOS.find((p) => p.id === activePreset)?.description}</p>
            )}
          </div>

          {/* Investiční styly (faktory) – sbalené (revize 18. 10. 2026: 15 tlačítek pod sebou byla stěna) */}
          <details className="group mb-4 rounded-lg border border-slate-200 bg-white" {...(activeStyle ? { open: true } : {})}>
            <summary className="flex items-center justify-between gap-2 px-3 py-2.5 cursor-pointer list-none min-h-[44px] rounded-lg hover:bg-slate-50">
              <span className="text-sm font-medium text-slate-700">Investiční styly (faktory)</span>
              <span className="flex items-center gap-2 text-xs text-slate-500">
                <span className="group-open:hidden">{activeStyle ? FACTOR_STYLES.find((s) => s.code === activeStyle)?.label : 'proti S&P 500'}</span>
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
              </span>
            </summary>
            <div className="px-3 pb-3 pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-2">Value, growth, malé firmy… vždy 100&nbsp;% stylu proti S&amp;P&nbsp;500.</p>
            <div className="flex flex-wrap gap-1.5">
              {FACTOR_STYLES.map((s) => {
                const on = activeStyle === s.code;
                return (
                  <button
                    key={s.code}
                    type="button"
                    aria-pressed={on}
                    data-track={`styl:${s.slug}`}
                    onClick={() => { applyFactor(s.code); setTimeout(() => runBacktestRef.current(), 90); }}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors min-h-[40px] ${on ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/60'}`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
            {activeStyle && (
              <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                Porovnáváte <b>{FACTOR_STYLES.find((s) => s.code === activeStyle)?.label}</b> (100&nbsp;%) se S&amp;P&nbsp;500 – období od vzniku reálného fondu{(activeStyle === 'us_momentum' || activeStyle === 'us_quality') ? ' (2014)' : ''}, bez pravidelných vkladů.
              </p>
            )}
            </div>
          </details>

          {/* Složení – default jen souhrn; editor vah na rozklik (progressive disclosure) */}
          <div className="mb-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-medium text-slate-500">Složení</p>
              <button type="button" onClick={() => setEditComposition((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 min-h-[40px] text-sm font-medium text-teal-700 hover:border-teal-300 hover:bg-teal-50/40 transition-colors">
                {editComposition ? 'Hotovo' : (<><Pencil className="w-3.5 h-3.5" /> Upravit / vlastní</>)}
              </button>
            </div>
            {!editComposition && (
              <div className={`rounded-lg border px-3 py-2.5 text-sm ${totalWeight === 100 ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-amber-300 bg-amber-50 text-amber-800'}`}>
                {selectedETFs.length ? selectedETFs.map((e) => `${e.fond ? (e.fond.ticker ?? e.name) : e.indexName} ${e.weight.toLocaleString('cs-CZ')}\u00a0%`).join('  ·  ') : 'Zatím prázdné – vyberte hotové portfolio nebo přidejte třídy aktiv.'}
                {totalWeight !== 100 && (
                  <button type="button" onClick={() => setEditComposition(true)} className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-amber-800 underline underline-offset-2">
                    Součet vah je {totalWeightText}&nbsp;% – upravit na 100&nbsp;% →
                  </button>
                )}
              </div>
            )}
            {editComposition && (<>
            <div className="flex items-center justify-end mb-2">
              <span className={`text-sm font-semibold tabular-nums ${totalWeight === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>Součet: {totalWeightText}&nbsp;%</span>
            </div>
            <div className="space-y-2">
              {selectedETFs.map((etf) => (
                <div key={idRadku(etf)} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="flex-1 min-w-0">
                    {etf.fond ? (<>
                      <span className="block text-sm font-medium text-slate-900 break-words">{etf.fond.ticker ? `${etf.fond.ticker} · ` : ''}{etf.name}</span>
                      <span className="block text-xs text-slate-500 break-words" title={etf.fond.zdroj}>
                        historie: {etf.fond.zdroj}{etf.fond.shoda === 'blizky' ? ' – podobný index' : ''} · TER {fmtPct(etf.ter * 100, 2)}
                      </span>
                    </>) : (<>
                      <span className="flex items-start gap-1 min-w-0 text-sm font-medium text-slate-900">
                        <span className="break-words leading-snug">{etf.indexName}</span>
                        {zdrojSlozky(etf.indexCode) && (
                          <InfoTip label={zdrojSlozky(etf.indexCode)}><span className="sr-only">Odkud jsou data</span></InfoTip>
                        )}
                      </span>
                      <span className="block text-xs text-slate-500 leading-snug break-words">
                        {etf.name
                          ? <>fond k nákupu: {etf.name} · TER {fmtPct(etf.ter * 100, 2)}</>
                          : <>fond k nákupu: — <span className="text-slate-400">(evropský fond na tento index nemáme)</span></>}
                      </span>
                    </>)}
                  </div>
                  <VahaPole value={etf.weight} onChange={(v) => setWeight(idRadku(etf), v)} label={`Váha ${etf.fond ? (etf.fond.ticker ?? etf.name) : etf.indexName}`} />
                  <button
                    onClick={() => removeETF(idRadku(etf))}
                    aria-label={`Odebrat ${etf.fond ? (etf.fond.ticker ?? etf.name) : etf.indexName}`}
                    className="flex items-center justify-center w-11 h-11 lg:w-10 lg:h-10 shrink-0 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Přidat fond */}
            {availableToAdd.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-teal-50 text-teal-700">
                  <Plus className="w-4 h-4" />
                </span>
                <select
                  value=""
                  aria-label="Přidat další třídu aktiv"
                  onChange={(e) => { if (e.target.value) addETF(e.target.value); }}
                  className="vyber flex-1 min-w-0 w-full h-11 lg:h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
                >
                  <option value="">Přidat další třídu aktiv…</option>
                  {['Akcie', 'Akcie – faktory', 'Dluhopisy EUR', 'Dluhopisy USD', 'Komodity'].map((cat) => (
                    <optgroup key={cat} label={cat}>
                      {availableToAdd.filter((i) => i.category === cat).map((i) => (
                        <option key={i.indexCode} value={i.indexCode}>{i.nameSince}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}

            {/* Přidat konkrétní fond (ticker / název / ISIN) */}
            <div className="mt-2">
              <label htmlFor="bt-fond" className="sr-only">Přidat konkrétní fond</label>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-teal-50 text-teal-700"><Search className="w-4 h-4" /></span>
                <input id="bt-fond" type="search" value={hledani} onChange={(e) => setHledani(e.target.value)} autoComplete="off"
                  placeholder="Konkrétní fond, např. VWCE"
                  className="flex-1 min-w-0 h-11 lg:h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none" />
              </div>
              {hledani.trim().length >= 2 && (
                <ul className="mt-1.5 rounded-lg border border-slate-200 bg-white divide-y divide-slate-100 text-sm" aria-live="polite">
                  {hledam && nalezene.length === 0 && <li className="px-3 py-2.5 text-slate-500">Hledám…</li>}
                  {!hledam && nalezene.length === 0 && <li className="px-3 py-2.5 text-slate-500">Nic jsme nenašli.</li>}
                  {nalezene.map((f) => f.ok ? (
                    <li key={f.isin}>
                      <button type="button" onClick={() => { mer('hledani_vyber', { s: 'backtest', c: f.ticker ?? f.isin }); addFond(f); }} className="w-full text-left px-3 py-2 min-h-[44px] hover:bg-teal-50/60">
                        <span className="block font-medium text-slate-900">{f.ticker ? `${f.ticker} · ` : ''}{f.name}</span>
                        <span className="block text-xs text-slate-500">historie: {f.zdroj} · TER {fmtPct(f.ter * 100, 2)}</span>
                      </button>
                    </li>
                  ) : (
                    <li key={f.isin} className="px-3 py-2 text-slate-400">
                      <span className="block">{f.ticker ? `${f.ticker} · ` : ''}{f.name}</span>
                      <span className="block text-xs">{f.duvod}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selectedETFs.some((e) => e.fond) && (
              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                Konkrétní fondy počítáme z dlouhé historie indexu (z dat uvedeného fondu), přepočtené na poplatek vybraného fondu.
                „Podobný index“ = fond sleduje jiný, ale velmi podobný index. Evropské fondy na americké akcie navíc platí daň
                z dividend (u S&amp;P 500 zhruba 0,2 % ročně), kterou historie amerických fondů neobsahuje.
              </p>
            )}

            {/* Vážený roční poplatek celého portfolia */}
            {selectedETFs.length > 0 && (
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-600 flex items-center gap-1">
                  Průměrný poplatek fondů k nákupu (TER)
                  <InfoTip label="Vážený průměr poplatků (TER) uvedených fondů k nákupu – kolik by ročně stálo držení. Výpočet ho znovu neodečítá: historická data jsou ceny skutečných zdrojových fondů a jejich poplatek už obsahují. U vyhledaného konkrétního fondu výpočet data přepočítá na jeho poplatek.">
                    <span className="sr-only">vysvětlení</span>
                  </InfoTip>
                </span>
                <span className="text-sm font-semibold tabular-nums text-slate-900">{fmtPct(weightedTER * 100, 2)}</span>
              </div>
            )}
            </>)}
          </div>

          {/* ===== ZÁKLADNÍ: částky ===== */}
          <div className="space-y-3 mb-4 pt-4 border-t border-slate-100">
            <div>
              <label htmlFor="bt-initial" className="block text-sm text-slate-600 mb-1">Počáteční vklad</label>
              <div className="relative">
                <input id="bt-initial" type="text" inputMode="numeric" value={initialAmount === 0 ? '' : initialAmount.toLocaleString('cs-CZ')} placeholder="0"
                  onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ''); setInitialAmount(v === '' ? 0 : parseInt(v, 10)); }}
                  className="w-full h-11 lg:h-10 rounded-lg border border-slate-200 bg-white px-3 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">{CURRENCIES.find((c) => c.code === currency)?.label}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="bt-contrib" className="block text-sm text-slate-600 mb-1">Pravidelný vklad</label>
              <div className="relative">
                <input id="bt-contrib" type="text" inputMode="numeric" value={contributionAmount === 0 ? '' : contributionAmount.toLocaleString('cs-CZ')} placeholder="0"
                  onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ''); const n = v === '' ? 0 : parseInt(v, 10); setContributionAmount(n); if (n > 0 && contributionFrequency === 'none') setContributionFrequency('monthly'); }}
                  className="w-full h-11 lg:h-10 rounded-lg border border-slate-200 bg-white px-3 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">{CURRENCIES.find((c) => c.code === currency)?.label}</span>
              </div>
            </div>
            <div>
              <label htmlFor="bt-freq" className="block text-sm text-slate-600 mb-1 flex items-center gap-1">
                Frekvence vkladů
                <InfoTip label="Pravidelné investování stejné částky bez ohledu na cenu (tzv. průměrování nákupní ceny). Rozkládá riziko špatného načasování.">
                  <span className="sr-only">vysvětlení</span>
                </InfoTip>
              </label>
              <select id="bt-freq" value={contributionFrequency} onChange={(e) => { const f = e.target.value as ContributionFrequency; setContributionFrequency(f); if (f === 'none') setContributionAmount(0); }}
                className="vyber w-full h-11 lg:h-10 rounded-lg border border-slate-200 bg-white px-3 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none">
                <option value="none">Bez vkladů</option>
                <option value="monthly">Měsíčně</option>
                <option value="quarterly">Čtvrtletně</option>
                <option value="yearly">Ročně</option>
              </select>
            </div>
            </div>
            {bezVkladu && <p className="text-xs text-amber-700">Zadejte počáteční nebo pravidelný vklad.</p>}
          </div>

          <div className="mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                Porovnat s jiným portfoliem
                <InfoTip label="Poměřte své portfolio až se dvěma hotovými portfolii naráz – na stejném období, se stejnými vklady i měnou. Ukážeme srovnávací tabulku a překryvný graf.">
                  <span className="sr-only">vysvětlení</span>
                </InfoTip>
              </label>
              {compareIds.length > 0 && (
                <div className="space-y-2 mb-2">
                  {compareIds.map((id, i) => {
                    const preset = PRESET_PORTFOLIOS.find((p) => p.id === id);
                    return (
                      <div key={id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SERIES_COLORS[i + 1] }} />
                        <div className="flex-1 min-w-0">
                          <span className="block text-sm font-medium text-slate-900 truncate">{preset?.name}</span>
                          <span className="block text-xs text-slate-500 truncate">{preset?.description}</span>
                        </div>
                        <button
                          onClick={() => setCompareIds((prev) => prev.filter((x) => x !== id))}
                          aria-label={`Odebrat ${preset?.name} z porovnání`}
                          className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {compareIds.length < 2 && (
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-indigo-50 text-indigo-600">
                    <Plus className="w-4 h-4" />
                  </span>
                  <select
                    value=""
                    aria-label="Přidat portfolio k porovnání"
                    onChange={(e) => { if (e.target.value) setCompareIds((prev) => [...prev, e.target.value]); }}
                    className="vyber flex-1 min-w-0 w-full h-11 lg:h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
                  >
                    <option value="">Přidat portfolio k porovnání…</option>
                    {PRESET_PORTFOLIOS.filter((p) => !compareIds.includes(p.id)).map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* ===== POKROČILÉ NASTAVENÍ (rozklik) – období, vyvažování, měna, inflace ===== */}
          <details className="group rounded-lg border border-slate-200 bg-white">
            <summary className="flex items-center justify-between gap-2 px-3 py-2.5 cursor-pointer list-none min-h-[44px] rounded-lg hover:bg-slate-50">
              <span className="text-sm font-medium text-slate-700">Období, měna a další</span>
              <span className="flex items-center gap-2 text-xs text-slate-500">
                <span className="tabular-nums group-open:hidden">od {fmtMes(startZobrazeny)} · {currency}</span>
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
              </span>
            </summary>
            <div className="px-3 pb-4 pt-3 space-y-4 border-t border-slate-200">
              {/* Období */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bt-start" className="block text-sm text-slate-600 mb-1">Počáteční datum</label>
                  <input id="bt-start" type="date" min="1993-01-01" value={startZobrazeny} onChange={(e) => { setStartDate(e.target.value); setStartZadal(true); }}
                    className="block w-full h-11 lg:h-10 rounded-lg border border-slate-200 bg-white px-3 text-slate-900 appearance-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none" />
                  <p className="text-xs text-slate-500 mt-1">Výpočet začne, až mají data všechny složky. V Kč a eurech nejdřív od ledna 2000 (od té doby máme kurzy), v dolarech S&amp;P&nbsp;500 od roku 1993.</p>
                </div>
                <div>
                  <label htmlFor="bt-end" className="block text-sm text-slate-600 mb-1">Koncové datum</label>
                  <input id="bt-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full h-11 lg:h-10 rounded-lg border border-slate-200 bg-white px-3 text-slate-900 appearance-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none" />
                </div>
              </div>

              {/* Vyvažování */}
              <div>
                <label htmlFor="bt-rebal" className="block text-sm text-slate-600 mb-1 flex items-center gap-1">
                  Vyvažování portfolia
                  <InfoTip label="Jak často se portfolio vrací k zadaným vahám. Časté vyvažování drží riziko na uzdě, ale v reálu znamená víc obchodů (poplatky) a u zdaněného účtu i dřívější realizaci zisků – backtest ani jedno nezapočítává. Pásmo 5 % vyvažuje jen tehdy, když se některá složka od cíle odchýlí o víc než 5 procentních bodů.">
                    <span className="sr-only">vysvětlení</span>
                  </InfoTip>
                </label>
                <select id="bt-rebal" value={rebalancing} onChange={(e) => setRebalancing(e.target.value as RebalancingStrategy)}
                  className="vyber w-full sm:w-auto h-11 lg:h-10 rounded-lg border border-slate-200 bg-white px-3 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none">
                  <option value="yearly">Jednou ročně (výchozí)</option>
                  <option value="none">Vůbec (nechat běžet)</option>
                  <option value="monthly">Měsíčně</option>
                  <option value="quarterly">Čtvrtletně</option>
                  <option value="half-yearly">Pololetně</option>
                  <option value="every-2-years">Jednou za 2 roky</option>
                  <option value="every-3-years">Jednou za 3 roky</option>
                  <option value="tolerance-5">Při odchylce nad 5 %</option>
                  <option value="tolerance-10">Při odchylce nad 10 %</option>
                  <option value="tolerance-20">Při odchylce nad 20 %</option>
                </select>
              </div>

              {/* Měna */}
              <div>
                <label className="block text-sm text-slate-600 mb-2 flex items-center gap-1">
                  Měna
                  <InfoTip label="Vklady zadáváte a výsledky čtete v této měně. Každý index se převádí ze své domácí měny (USD/EUR) historickými denními kurzy, takže výnos v Kč zahrnuje i pohyb koruny – např. od roku 2008 vychází Kč a € téměř stejně (kurz koruny k euru je dnes na úrovni léta 2008), zatímco dolarový pohled se liší.">
                    <span className="sr-only">vysvětlení</span>
                  </InfoTip>
                </label>
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
                  {CURRENCIES.map((c) => (
                    <button key={c.code} disabled={loading}
                      onClick={() => { setCurrency(c.code); if (result) runBacktest(c.code); }}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors min-h-[40px] disabled:opacity-60 ${currency === c.code ? 'bg-teal-700 text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                      {c.label} {c.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reálný výnos po inflaci (volitelné) */}
              <div>
                <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showRealReturn}
                    onChange={(e) => setShowRealReturn(e.target.checked)}
                    className="mt-0.5 w-4 h-4 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                  <span>
                    Očistit roční výnos o inflaci (ČSÚ)
                    <span className="block text-xs text-slate-500 mt-0.5">
                      K výnosu doplní i reálné tempo – o kolik si za výsledek reálně víc koupíte. Počítáme v Kč z inflace ČSÚ (data od roku 1999).
                    </span>
                  </span>
                </label>
              </div>

            </div>
          </details>

          {/* Spustit – jen když je co počítat (presety a styly se spouštějí samy; revize 18. 10. 2026). */}
          {(!result || !!error) && (
          <button
            onClick={() => runBacktest()}
            data-track="backtest-spustit"
            disabled={loading || !lzePocitat}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors min-h-[48px]"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Počítám historický vývoj…</> : <><Zap className="w-4 h-4" /> {result ? 'Zkusit znovu' : 'Otestovat na historii'}</>}
          </button>
          )}
          {/* Čtečky obrazovky: oznámit začátek a konec výpočtu (vizuálně to ukazuje tlačítko). */}
          <p aria-live="polite" className="sr-only">{loading ? 'Počítám historický vývoj…' : result ? 'Výsledek backtestu je připravený.' : ''}</p>
          {totalWeight !== 100 && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-amber-700">
              <AlertTriangle className="w-4 h-4 shrink-0" /> Součet vah musí být 100&nbsp;%
            </p>
          )}
        </div>
      </div>

      {/* ===== PODROBNÉ VÝSLEDKY ===== */}
      {result && !cekamNaUrl && (
        <div className={loading || zastaraly || bezVkladu ? 'space-y-8 opacity-40 pointer-events-none transition-opacity' : 'space-y-8'} aria-hidden={zastaraly || bezVkladu || undefined}>
          {/* Srovnání portfolií (když jsou vybrána) */}
          {comparison && (
            <section data-sekce="backtest-porovnani">
              <ComparisonBlock portfolios={[{ name: 'Vaše portfolio', result }, ...comparison]} currency={resultCurrency} />
            </section>
          )}

          {/* ── Kolik to bolelo (riziko) ── */}
          <section data-sekce="backtest-riziko" className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Kolik to bolelo</h2>
              <p className="text-sm text-slate-500 mt-0.5">Jak hluboké byly propady a jak dlouho trval návrat.</p>
            </div>

            {/* Max. pokles (výsledek nahoře) a krize jsou DVĚ různá měření – propojit je, ať −52,8 % vedle −49,7 %
                nevypadá jako rozpor (revize 18. 10. 2026). */}
            {result.risk.maxDrawdown.depth < 0 && (
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-red-100 bg-red-50/50 px-4 py-3">
                <span className="text-sm text-slate-700">Největší propad od vrcholu kdykoli (max. pokles)</span>
                <span className="text-xl font-bold tabular-nums text-red-600">{fmtPct(result.risk.maxDrawdown.depth * 100)}</span>
                <span className="text-xs text-slate-500">
                  vrchol {fmtMes(result.risk.maxDrawdown.startDate)} → dno {fmtMes(result.risk.maxDrawdown.troughDate)} · {navratPoPropadu(result.risk.maxDrawdown)}
                </span>
              </div>
            )}

            {nKrizi > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                  Známé krize
                  <InfoTip label="Propad od vrcholu po dno UVNITŘ pevného okna krize (např. leden–říjen 2022). Max. pokles hledá propad kdykoli – může začít už před oknem krize, a proto bývá hlubší."><span className="sr-only">vysvětlení</span></InfoTip>
                </p>
                <p className="text-xs text-slate-500 mt-0.5 mb-3">Propad jen uvnitř okna každé krize. Ukazujeme krize, které vaše období pokrývá.</p>
                <div className={`grid grid-cols-1 ${gridKrizi} gap-2 sm:gap-3`}>
                  {result.stressPeriods!.map((s) => {
                    const rec = s.recoveryMonths;
                    const y = rec != null ? Math.round(rec / 12) : 0;
                    const recLabel = rec == null
                      ? 'zatím bez návratu'
                      : rec < 1
                        ? 'návrat do měsíce'
                        : rec < 18
                        ? `návrat za ${rec} měs.`
                        : `návrat za ~${y} ${y === 1 ? 'rok' : y < 5 ? 'roky' : 'let'}`;
                    // Obsahuje okno krize dno max. poklesu? Pak ukázat, že celý propad (od dřívějšího vrcholu) byl hlubší.
                    const w = STRESS_WINDOWS.find((x) => x.key === s.key);
                    const md = result.risk.maxDrawdown;
                    const sMax = !!w && md.depth < s.drop - 0.0005 && md.troughDate.slice(0, 10) >= w.start && md.troughDate.slice(0, 10) <= w.end;
                    /* Okno krize obsahuje dno max. poklesu → návrat jedním číslem: zpět na vrchol před celým propadem
                       (revize kola 4: týž propad −52,8 % měl jednou „návrat ~4 roky“, jednou „~3 roky“). */
                    const recText = sMax ? navratPoPropadu(md) : recLabel;
                    const recOk = sMax ? md.recovered : rec != null;
                    return (
                      <div key={s.key} className="flex items-center justify-between gap-3 sm:block rounded-lg border border-slate-200 bg-slate-50/60 p-3 sm:p-3.5">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 leading-snug">{s.name}</p>
                          <p className="text-[11px] text-slate-500">propad v okně krize {oknoKrize(s.key)}</p>
                          {sMax && <p className="text-[11px] text-red-700">celý propad od vrcholu {fmtMes(md.startDate)}: {fmtPct(md.depth * 100)} = max. pokles; návrat na ten vrchol níže</p>}
                          <p className="text-xs text-slate-500 mt-0.5 sm:hidden">
                            dno {fmtMes(s.troughDate)} · <span className={recOk ? 'text-emerald-700' : 'text-amber-700'}>{recText}</span>
                          </p>
                        </div>
                        <p className="shrink-0 sm:mt-1.5 text-xl sm:text-2xl font-bold tabular-nums text-red-600">{fmtPct(s.drop * 100)}</p>
                        <p className="hidden sm:block text-xs text-slate-500 mt-0.5">
                          dno {fmtMes(s.troughDate)} · <span className={recOk ? 'text-emerald-700' : 'text-amber-700'}>{recText}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {ddData.length > 1 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                  O kolik procent pod předchozím vrcholem
                  <InfoTip label="Graf ztráty od předchozího maxima v čase (drawdown) – časově vážená hodnota portfolia, vklady propady nemaskují. Za každý měsíc nejhlubší bod denních dat, proto dno grafu = max. pokles. Nula = nový vrchol."><span className="sr-only">vysvětlení</span></InfoTip>
                </p>
                {podVrcholem && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Víc než 10 % pod vrcholem bylo portfolio v {mesicu(podVrcholem.deset, podVrcholem.celkem)}, víc než 20 % v {mesicu(podVrcholem.dvacet, podVrcholem.celkem)} (počítá se nejhlubší bod měsíce).
                  </p>
                )}
                <div className="mt-3 h-48 md:h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ddData} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="uwFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#dc2626" stopOpacity={0.06} />
                          <stop offset="100%" stopColor="#dc2626" stopOpacity={0.35} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="t" type="number" domain={[ddData[0].t, ddData[ddData.length - 1].t]} ticks={rokyOsy(ddData[0].t, ddData[ddData.length - 1].t)} tickFormatter={fmtRok}
                        tick={OSA_TICK} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                      <YAxis width={52} ticks={ddOsa} domain={[ddOsa[0], 0]} tick={OSA_TICK} axisLine={false} tickLine={false}
                        tickFormatter={(v: number) => `${Math.round(v)}\u00a0%`} />
                      <ReferenceLine y={0} stroke="#cbd5e1" />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload.length) return null;
                          const p = payload[0].payload as { t: number; dd: number };
                          return (
                            <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
                              <div className="font-semibold mb-0.5">
                                {new Date(p.t).toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
                              </div>
                              {p.dd >= -0.05
                                ? <div>Na vrcholu – bez ztráty</div>
                                : <div>Pod vrcholem: <span className="font-medium tabular-nums">{fmtPct(p.dd)}</span></div>}
                            </div>
                          );
                        }}
                      />
                      <Area type="monotone" dataKey="dd" stroke="#dc2626" strokeWidth={1.5} fill="url(#uwFill)" baseValue={0} isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </section>

          {/* ── Jak spolehlivý byl výnos ── */}
          <section data-sekce="backtest-vynosy" className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Jak spolehlivý byl výnos</h2>
              <p className="text-sm text-slate-500 mt-0.5">Jednotlivé roky i delší horizonty – časově vážený výnos portfolia.</p>
            </div>

            {result.returns.annualReturns.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
                <p className="text-sm font-semibold text-slate-900">Roční výnosy</p>
                {(() => {
                  // Krajní roky jsou jen za část roku (engine skládá měsíce, které období pokrývá) – říct to.
                  const castecne: string[] = [];
                  if (prvni && castecneRoky.has(new Date(prvni).getUTCFullYear())) castecne.push(`${new Date(prvni).getUTCFullYear()} od ${fmtDen(prvni)}`);
                  if (posledni && castecneRoky.has(new Date(posledni).getUTCFullYear()) && new Date(posledni).getUTCFullYear() !== new Date(prvni!).getUTCFullYear()) castecne.push(`${new Date(posledni).getUTCFullYear()} do ${fmtDen(posledni)}`);
                  return castecne.length
                    ? <p className="text-xs text-slate-500 mt-0.5 mb-3">Čárkovaně = jen část roku ({castecne.join(', ')}); nesoutěží o nejlepší a nejhorší rok.</p>
                    : <div className="mb-3" />;
                })()}
                <div className="grid grid-cols-4 md:grid-cols-6 gap-1.5 sm:gap-2 pt-2">
                  {result.returns.annualReturns.map((r) => {
                    const pos = r.return >= 0;
                    const isBest = !!advanced && r.year === advanced.best.year;
                    const isWorst = !!advanced && r.year === advanced.worst.year;
                    const cast = castecneRoky.has(r.year);
                    return (
                      <div key={r.year} title={cast ? 'Jen část roku' : undefined} className={`relative rounded-lg border px-1 py-2 sm:p-2.5 text-center ${isBest ? 'border-emerald-400 ring-1 ring-emerald-300' : isWorst ? 'border-red-400 ring-1 ring-red-300' : cast ? 'border-dashed border-slate-300 bg-white' : pos ? 'border-emerald-100 bg-emerald-50/50' : 'border-red-100 bg-red-50/50'}`}>
                        {(isBest || isWorst) && (
                          <span className={`absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-[9px] font-medium leading-none ${isBest ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                            {isBest ? 'nejlepší' : 'nejhorší'}
                          </span>
                        )}
                        <p className="text-xs text-slate-500 tabular-nums">{r.year}</p>
                        <p className={`text-[13px] sm:text-sm font-semibold tabular-nums whitespace-nowrap ${pos ? 'text-emerald-700' : 'text-red-600'}`}>
                          {pos ? '+' : ''}{fmtPct(r.return * 100)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {result.rollingReturns && result.rollingReturns.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                  Záleželo, kdy jste začali?
                  <InfoTip label="Klouzavé výnosy: vezmeme každý možný měsíc začátku v tomto období, podržíme daný počet let a spočítáme roční výnos. Ukáže, jak moc na načasování záleželo."><span className="sr-only">vysvětlení</span></InfoTip>
                </p>
                <p className="text-xs text-slate-500 mt-0.5 mb-3">Roční výnos při vstupu v kterémkoli měsíci období a držení daný počet let.</p>
                <table className="w-full max-w-3xl text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th className="text-left font-medium py-2 pr-2">Držení</th>
                      <th className="text-right font-medium py-2 px-2">Nejhorší</th>
                      <th className="text-right font-medium py-2 px-2">Průměr</th>
                      <th className="hidden sm:table-cell text-right font-medium py-2 px-2">Nejlepší</th>
                      <th className="text-right font-medium py-2 pl-2">V plusu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rollingReturns.map((r) => (
                      <tr key={r.years} className="border-b border-slate-100 last:border-0">
                        <td className="text-slate-600 py-2.5 pr-2 whitespace-nowrap">{r.years} {r.years === 1 ? 'rok' : r.years < 5 ? 'roky' : 'let'}</td>
                        <td className={`text-right py-2.5 px-2 tabular-nums font-semibold whitespace-nowrap ${r.low >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                          {r.low >= 0 ? '+' : ''}{fmtPct(r.low * 100)}
                        </td>
                        <td className="text-right py-2.5 px-2 tabular-nums text-slate-700 whitespace-nowrap">{r.average >= 0 ? '+' : ''}{fmtPct(r.average * 100)}</td>
                        <td className="hidden sm:table-cell text-right py-2.5 px-2 tabular-nums font-semibold text-emerald-700 whitespace-nowrap">+{fmtPct(r.high * 100)}</td>
                        <td className={`text-right py-2.5 pl-2 tabular-nums font-semibold whitespace-nowrap ${r.positiveShare >= 0.999 ? 'text-emerald-700' : 'text-slate-700'}`}>
                          {Math.round(r.positiveShare * 100)} %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                  Čím delší držení, tím užší rozpětí mezi nejhorším a nejlepším výsledkem.
                </p>
              </div>
            )}
          </section>

          {/* ── Pro pokročilé (sbalené): rizikově vážené ukazatele + tabulka propadů ── */}
          {(() => {
            const s = result.summary;
            const dd = Math.abs(result.risk.maxDrawdown.depth);
            const calmar = dd > 0 ? s.cagr / dd : null;
            const fmt2 = (v: number) => v.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            return (
              <details data-sekce="backtest-pokrocile" className="group rounded-xl border border-slate-200 bg-white">
                <summary className="flex items-center justify-between gap-3 px-4 md:px-6 py-4 cursor-pointer list-none min-h-[52px]">
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">Pro pokročilé</span>
                    <span className="block text-xs text-slate-500">Sharpe, Sortino, Calmar, VaR a tabulka největších propadů</span>
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-5 md:px-6 md:pb-6 border-t border-slate-100 pt-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <MetricCard
                      icon={Activity}
                      label={<>Sharpe <InfoTip label="Kolik výnosu jste dostali za každou jednotku kolísání (nad bezrizikovou sazbou 2 %). Vyšší číslo = líp zaplaceno za podstoupené nervy."><span className="sr-only">vysvětlení</span></InfoTip></>}
                      value={fmt2(s.sharpeRatio)} hint="výnos vs. kolísání" tone="neutral"
                    />
                    <MetricCard
                      icon={Activity}
                      label={<>Sortino <InfoTip label="Jako Sharpe, ale trestá jen propady (ty, co bolí), ne výkyvy nahoru. Vyšší = lepší."><span className="sr-only">vysvětlení</span></InfoTip></>}
                      value={fmt2(s.sortinoRatio)} hint="výnos vs. propady" tone="neutral"
                    />
                    <MetricCard
                      icon={Activity}
                      label={<>Calmar <InfoTip label="Roční výnos vůči nejhoršímu propadu. Vyšší = výnos se drží snáz, protože propady byly mělčí."><span className="sr-only">vysvětlení</span></InfoTip></>}
                      value={calmar != null ? fmt2(calmar) : '—'} hint="výnos vs. max. propad" tone="neutral"
                    />
                    <MetricCard
                      icon={TrendingDown}
                      label={<>VaR 95 % <InfoTip label="Value at Risk – zhruba nejhorší rok, který je běžné čekat. Horší nastane jen asi v 1 roce z 20."><span className="sr-only">vysvětlení</span></InfoTip></>}
                      value={fmtPct(result.risk.valueAtRisk95 * 100)} hint="odhad špatného roku" tone="neg"
                    />
                  </div>

                  {topDrawdowns.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-semibold text-slate-900">Největší propady</p>
                      <p className="text-xs text-slate-500 mt-0.5 mb-3">Od vrcholu po dno bez ohledu na kalendář – proto se mohou lišit od „Známých krizí“, které měří jen uvnitř okna krize.</p>
                      <div className="overflow-x-auto">
                        <table className="w-full max-w-3xl text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-xs text-slate-500">
                              <th className="text-right font-medium py-2 pr-2 whitespace-nowrap">Hloubka</th>
                              <th className="text-left font-medium py-2 px-2 whitespace-nowrap">Vrchol</th>
                              <th className="text-left font-medium py-2 px-2 whitespace-nowrap">Dno</th>
                              <th className="text-left font-medium py-2 px-2 whitespace-nowrap">Zpět na vrcholu</th>
                              <th className="hidden sm:table-cell text-right font-medium py-2 pl-2 whitespace-nowrap">Délka</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topDrawdowns.map((d, i) => (
                              <tr key={i} className="border-b border-slate-100 last:border-0">
                                <td className="text-right py-2.5 pr-2 tabular-nums font-semibold text-red-600 whitespace-nowrap">{fmtPct(d.depth * 100, ddDesetin)}</td>
                                <td className="text-slate-600 py-2.5 px-2 whitespace-nowrap tabular-nums">{fmtMes(d.startDate)}</td>
                                <td className="text-slate-600 py-2.5 px-2 whitespace-nowrap tabular-nums">{fmtMes(d.troughDate)}</td>
                                <td className="py-2.5 px-2 whitespace-nowrap tabular-nums">
                                  {d.recovered && d.endDate
                                    ? <span className="text-slate-600">{fmtMes(d.endDate)}</span>
                                    : <span className="text-amber-700">zatím ne</span>}
                                </td>
                                <td className="hidden sm:table-cell text-right py-2.5 pl-2 tabular-nums text-slate-500 whitespace-nowrap">{d.lengthMonths} měs.</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </details>
            );
          })()}

          {/* Navazující otázky – podle toho, co si člověk právě spočítal (dřív z backtestu vedl na
              články za 90 dní 1 proklik; deep dive 17. 10. 2026). Bez čísel – ta jsou v článcích ověřená. */}
          {(() => {
            const karty: { href: string; titulek: string; text: string }[] = [];
            if (contributionFrequency !== 'none' && contributionAmount > 0) karty.push({ href: '/dca-vs-jednorazova', titulek: 'Naráz, nebo postupně?', text: 'Počítáte s pravidelnými vklady. Co říkají data o jednorázové investici proti průměrování.' });
            if (resultCurrency === 'CZK' && selectedETFs.some((e) => !!INDEX_BY_CODE[e.indexCode])) karty.push({ href: '/menove-riziko-etf', titulek: 'Kolik z výsledku dělá kurz koruny?', text: 'Indexy jsou v cizí měně – výnos v Kč zvyšuje i snižuje pohyb kurzu.' });
            if (!karty.length) return null;
            return (
              <div data-sekce="backtest-navazujici" className={`grid gap-3 ${karty.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                {karty.map((k) => (
                  <Link key={k.href} href={k.href} className="group rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 transition-colors">
                    <span className="flex items-center justify-between text-sm font-semibold text-slate-900">{k.titulek}<ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700" /></span>
                    <span className="mt-1 block text-xs text-slate-500 leading-relaxed">{k.text}</span>
                  </Link>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {listaDole && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur shadow-[0_-4px_12px_rgba(15,23,42,0.06)]">
          {loading ? (
            <p className="flex min-h-[40px] items-center gap-2 text-sm text-slate-600"><Loader2 className="w-4 h-4 animate-spin text-teal-700" /> Počítám historický vývoj…</p>
          ) : zastaraly || bezVkladu ? (
            <p className="flex min-h-[40px] items-center gap-2 text-sm text-slate-600">
              {lzePocitat ? <><Loader2 className="w-4 h-4 animate-spin text-teal-700" /> Přepočítávám…</> : bezVkladu ? 'Zadejte počáteční nebo pravidelný vklad' : 'Součet vah musí být 100\u00a0%'}
            </p>
          ) : result ? (
            <button type="button" onClick={() => vysledekRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="flex w-full items-center justify-between gap-3 text-left">
              <span className="min-w-0">
                <span className="block truncate text-xs text-slate-500">{popisVysledku?.slozeni}</span>
                <span className="block text-base font-bold tabular-nums text-slate-900">
                  {fmtMoney(result.summary.netAssetValue, resultCurrency)}
                  {/* XIRR = zhodnocení VAŠICH vkladů; bez pravidelných vkladů je totéž co roční zhodnocení (revize kola 4). */}
                  {(() => {
                    const r = irr ?? (popisVysledku && !(popisVysledku.vklad > 0) ? result.summary.cagr : null);
                    return r == null ? null : <span className={`ml-2 text-xs font-medium ${r >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>zhodnocení vkladů {fmtPct(r * 100)} ročně</span>;
                  })()}
                </span>
              </span>
              <span className="shrink-0 text-sm font-medium text-teal-700">Výsledek ↑</span>
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

/** Váha složky s desetinnou ČÁRKOU („7,5“) – type=number v Chromu ukazoval „7.5“ (revize kola 4). Během psaní drží
    rozepsaný text („7,“), číslo předává až platné; mimo fokus ukazuje české formátování. */
function VahaPole({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [text, setText] = useState<string | null>(null);
  const zobrazeno = text ?? value.toLocaleString('cs-CZ', { maximumFractionDigits: 2 });
  return (
    <div className="relative w-20 sm:w-24 shrink-0">
      <input
        type="text"
        inputMode="decimal"
        aria-label={label}
        value={zobrazeno}
        onFocus={() => setText(value.toLocaleString('cs-CZ', { maximumFractionDigits: 2 }))}
        onBlur={() => setText(null)}
        onChange={(e) => {
          const t = e.target.value.replace(/[^0-9,.]/g, '').replace('.', ',');
          setText(t);
          const n = Number(t.replace(',', '.'));
          if (t !== '' && Number.isFinite(n)) onChange(Math.round(n * 100) / 100);
          else if (t === '') onChange(0);
        }}
        className="w-full h-11 lg:h-10 rounded-lg border border-slate-200 bg-white pl-2 pr-7 text-right text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
      />
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500">%</span>
    </div>
  );
}

/** „45 z 214 měsíců (21 %)“ – malé podíly nezaokrouhlovat na 0 %. */
function mesicu(n: number, z: number) {
  if (n === 0) return 'žádném měsíci';
  const pct = (n / z) * 100;
  const p = pct < 1 ? 'méně než 1 %' : `${Math.round(pct)} %`;
  return `${n} ${n === 1 ? 'měsíci' : 'měsících'} z ${z} (${p})`;
}

/** „zpět za 4 roky“ – od dna propadu zpět na předchozí vrchol. */
function navratPoPropadu(d: { troughDate: string; endDate: string | null; recovered: boolean }) {
  if (!d.recovered || !d.endDate) return 'zatím bez návratu';
  const mes = Math.round((Date.parse(d.endDate) - Date.parse(d.troughDate)) / (30.44 * 864e5));
  if (mes < 1) return 'návrat do měsíce';
  if (mes < 18) return `návrat za ${mes} měs.`;
  const r = Math.round(mes / 12);
  return `návrat za ~${r} ${r === 1 ? 'rok' : r < 5 ? 'roky' : 'let'}`;
}

// Nejlepší/nejhorší CELÝ rok z ročních výnosů (v %) – neúplné krajní roky se nepočítají.
const celeRoky = (r: BacktestResult) => {
  const ev = r.evolution;
  if (ev.length < 2) return r.returns.annualReturns;
  const p = new Date(ev[0].date), k = new Date(ev[ev.length - 1].date);
  const cast = new Set<number>();
  if (p.getUTCMonth() > 0 || p.getUTCDate() > 7) cast.add(p.getUTCFullYear());
  if (!(k.getUTCMonth() === 11 && k.getUTCDate() >= 28)) cast.add(k.getUTCFullYear());
  return r.returns.annualReturns.filter((a) => !cast.has(a.year));
};
const bestYearPct = (r: BacktestResult) => { const a = celeRoky(r); return a.length ? Math.max(...a.map((x) => x.return)) * 100 : NaN; };
const worstYearPct = (r: BacktestResult) => { const a = celeRoky(r); return a.length ? Math.min(...a.map((x) => x.return)) * 100 : NaN; };

function ComparisonBlock({
  portfolios, currency,
}: {
  portfolios: { name: string; result: BacktestResult }[];
  currency: Currency;
}) {
  // Překryvný graf: hodnoty všech portfolií sloučené podle data (osy zarovnané na společné období).
  // Podvzorkujeme na ~400 bodů – jinak jsou to 2–3 denní řady po ~5000 bodech = na mobilu pomalé.
  const chartData = useMemo(() => {
    const byDate = new Map<string, Record<string, number | string>>();
    portfolios.forEach((p, si) => {
      p.result.evolution.forEach((pt) => {
        const row = byDate.get(pt.date) ?? { date: pt.date, t: Date.parse(pt.date) };
        row[`s${si}`] = Math.round(pt.value);
        byDate.set(pt.date, row);
      });
    });
    const all = [...byDate.values()].sort((a, b) => ((a.date as string) < (b.date as string) ? -1 : 1));
    const MAX = 400;
    if (all.length <= MAX) return all;
    const step = Math.ceil(all.length / MAX);
    const out = all.filter((_, i) => i % step === 0);
    if (out[out.length - 1] !== all[all.length - 1]) out.push(all[all.length - 1]);
    return out;
  }, [portfolios]);

  // Řádky tabulky: hodnota + směr „co je lepší" (pro zvýraznění nejlepšího sloupce).
  const rows: { label: React.ReactNode; values: number[]; fmt: (v: number) => string; better: 'high' | 'low' }[] = [
    { label: 'Konečná hodnota', values: portfolios.map((p) => p.result.summary.netAssetValue), fmt: (v) => fmtMoney(v, currency), better: 'high' },
    { label: 'Roční zhodnocení (CAGR)', values: portfolios.map((p) => p.result.summary.cagr * 100), fmt: (v) => fmtPct(v), better: 'high' },
    { label: 'Max. pokles', values: portfolios.map((p) => p.result.risk.maxDrawdown.depth * 100), fmt: (v) => fmtPct(v), better: 'high' },
    { label: 'Kolísavost', values: portfolios.map((p) => p.result.summary.standardDeviation * 100), fmt: (v) => fmtPct(v), better: 'low' },
    { label: 'Sharpe', values: portfolios.map((p) => p.result.summary.sharpeRatio), fmt: (v) => v.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), better: 'high' },
    { label: 'Nejlepší celý rok', values: portfolios.map((p) => bestYearPct(p.result)), fmt: (v) => fmtPct(v), better: 'high' },
    { label: 'Nejhorší celý rok', values: portfolios.map((p) => worstYearPct(p.result)), fmt: (v) => fmtPct(v), better: 'high' },
  ];

  const bestIndex = (values: number[], better: 'high' | 'low') => {
    let idx = 0;
    for (let i = 1; i < values.length; i++) {
      if (better === 'high' ? values[i] > values[idx] : values[i] < values[idx]) idx = i;
    }
    return idx;
  };

  const first = chartData[0]?.date as string | undefined;
  const last = chartData[chartData.length - 1]?.date as string | undefined;
  const ct0 = (chartData[0]?.t as number) ?? 0, ct1 = (chartData[chartData.length - 1]?.t as number) ?? 0;
  const cOsa = kulateKroky(chartData.reduce((m, r) => Math.max(m, ...portfolios.map((_, si) => Number(r[`s${si}`] ?? 0))), 0), 0, 4);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Srovnání portfolií</h2>
        {first && last && (
          <p className="text-xs text-slate-500 mt-0.5">
            Stejné období {fmtMes(first)} – {fmtDen(last)} · stejné vklady · hodnota {jednotka(currency)}. Nejlepší hodnota v každém řádku je zvýrazněná.
          </p>
        )}
      </div>

      {/* Překryvný graf vývoje */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="t" type="number" domain={[ct0, ct1]} ticks={rokyOsy(ct0, ct1)} tickFormatter={fmtRok}
              tick={OSA_TICK} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
            <YAxis width={56} ticks={cOsa} domain={[0, cOsa[cOsa.length - 1]]} tick={OSA_TICK} axisLine={false} tickLine={false}
              tickFormatter={fmtOsa} />
            <Tooltip
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const label = (payload[0].payload as { date: string }).date;
                return (
                  <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
                    <div className="font-semibold mb-1">
                      {new Date(label as string).toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
                    </div>
                    {payload.map((entry, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: entry.color as string }} />
                        {portfolios[Number(String(entry.dataKey).slice(1))]?.name}:{' '}
                        <span className="font-medium tabular-nums">{fmtMoney(entry.value as number, currency)}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            <Legend
              formatter={(value) => <span className="text-xs text-slate-600">{portfolios[Number(String(value).slice(1))]?.name}</span>}
            />
            {portfolios.map((_, si) => (
              <Line key={si} type="monotone" dataKey={`s${si}`} name={`s${si}`}
                stroke={SERIES_COLORS[si] ?? '#64748b'} strokeWidth={2} dot={false} isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Srovnávací tabulka */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left font-medium text-slate-500 py-2 pr-3 whitespace-nowrap">Ukazatel</th>
              {portfolios.map((p, si) => (
                <th key={si} className="text-right font-semibold text-slate-900 py-2 px-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SERIES_COLORS[si] ?? '#64748b' }} />
                    {p.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const bi = bestIndex(row.values, row.better);
              return (
                <tr key={ri} className="border-b border-slate-100 last:border-0">
                  <td className="text-slate-600 py-2.5 pr-3 whitespace-nowrap">{row.label}</td>
                  {row.values.map((v, ci) => (
                    <td key={ci}
                      className={`text-right py-2.5 px-3 tabular-nums whitespace-nowrap ${ci === bi ? 'font-bold text-teal-700 bg-teal-50/60 rounded' : 'text-slate-700'}`}>
                      {Number.isFinite(v) ? row.fmt(v) : "—"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        Vyšší konečná hodnota neznamená automaticky lepší portfolio – všímejte si i max. poklesu a kolísavosti (kolik nervů by vás držení stálo).
        Sharpe poměřuje výnos vůči riziku: čím vyšší, tím lepší poměr.
      </p>
    </div>
  );
}

function MetricCard({
  icon: Icon, label, value, hint, tone,
}: {
  icon: typeof Coins;
  label: React.ReactNode;
  value: string;
  hint: string;
  tone: 'brand' | 'pos' | 'neg' | 'neutral';
}) {
  const valueColor =
    tone === 'pos' ? 'text-emerald-600' : tone === 'neg' ? 'text-red-600' : 'text-slate-900';
  const iconWrap =
    tone === 'brand' ? 'bg-teal-50 text-teal-700'
      : tone === 'pos' ? 'bg-emerald-50 text-emerald-600'
        : tone === 'neg' ? 'bg-red-50 text-red-600'
          : 'bg-slate-100 text-slate-500';
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <span className={`flex items-center justify-center w-9 h-9 rounded-lg mb-3 ${iconWrap}`}>
        <Icon className="w-4 h-4" />
      </span>
      <p className="text-xs text-slate-500 flex items-center gap-1 flex-wrap">{label}</p>
      <p className={`text-xl font-bold tabular-nums mt-0.5 ${valueColor}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{hint}</p>
    </div>
  );
}
