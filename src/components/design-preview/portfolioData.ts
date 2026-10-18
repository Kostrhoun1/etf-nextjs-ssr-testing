// Čistá data 7 modelových portfolií (původně z src/components/portfolio/PortfolioStrategies.tsx).
// Názvy sjednocené s homepage (NAZEV_PORTFOLIA v src/app/page.tsx) a backtestem (revize 18. 10. 2026).
// Pořadí podle podílu akcií (od nejklidnějšího) – homepage si pořadí řadí sama podle rizika, výsledek je stejný.
//
// ZÁMĚRNĚ BEZ „očekávaného výnosu“ a odhadu „max. pokles do −X %“: byly to odhady budoucnosti bez zdroje.
// Karty i detail ukazují HISTORICKÉ zhodnocení a max. pokles z backtestu (src/lib/backtest/predpocet.ts).

export type PortfolioRisk = 'Konzervativní' | 'Umírněné' | 'Agresivní';

// Třídy aktiv (homepage z nich skládá souhrnný proužek – hodnoty neměnit).
export type AssetClass = 'akcie' | 'dluhopisy' | 'nemovitosti' | 'komodity' | 'zlato';
/** Upřesnění dluhopisů – v jednom portfoliu bývají dva druhy a musí jít barevně rozlišit. */
export type DruhDluhopisu = 'dlouhe' | 'stredni' | 'kratke';

export interface PortfolioAllocation {
  /** Zobrazený název položky v legendě, např. „Dlouhodobé dluhopisy". */
  label: string;
  /** Třída aktiva. */
  cls: AssetClass;
  druh?: DruhDluhopisu;
  percentage: number;
  isin: string;
  etfName: string;
}

export interface PortfolioModel {
  id: string;
  slug: string;            // detailová podstránka (existuje)
  name: string;            // plný název (H1, nadpis karty)
  /** Krátký název = stejný jako na homepage (NAZEV_PORTFOLIA). */
  kratkyNazev: string;
  tagline: string;         // 1 věta „pro koho"
  risk: PortfolioRisk;
  /** % v akciích – pro tabulku „pro koho". */
  stocksPct: number;
  horizon: string;         // doporučený horizont
  forWhom: string;         // verdikt do tabulky
  allocations: PortfolioAllocation[];
}

/* Barvy složek – rozlišitelné i pro barvoslepé (paleta Okabe–Ito + jas): akcie tmavé, dluhopisy světle
   modré ve třech jasech, hotovost šedá, zlato/komodity světlá vs tmavá, nemovitosti růžovofialová.
   Dřív: šedé dluhopisy i šedá hotovost (Permanentní), zelené akcie i zelené nemovitosti (Akciové). */
export const BARVY_SLOZEK = {
  akcie: '#0f766e',
  dluhopisyDlouhe: '#0072b2',
  dluhopisyStredni: '#56b4e9',
  hotovost: '#b6c2d1',
  nemovitosti: '#cc79a7',
  zlato: '#e6a700',
  komodity: '#8c510a',
} as const;

export function barvaSlozky(a: Pick<PortfolioAllocation, 'cls' | 'druh'>): string {
  if (a.cls === 'dluhopisy') return a.druh === 'kratke' ? BARVY_SLOZEK.hotovost : a.druh === 'stredni' ? BARVY_SLOZEK.dluhopisyStredni : BARVY_SLOZEK.dluhopisyDlouhe;
  return BARVY_SLOZEK[a.cls];
}

export const NAZEV_TRIDY: Record<AssetClass, string> = {
  akcie: 'Akcie', dluhopisy: 'Dluhopisy', nemovitosti: 'Nemovitosti', komodity: 'Komodity', zlato: 'Zlato',
};
export function nazevSlozky(a: Pick<PortfolioAllocation, 'cls' | 'druh'>): string {
  if (a.cls === 'dluhopisy' && a.druh === 'kratke') return 'Hotovost (krátké dluhopisy)';
  return NAZEV_TRIDY[a.cls];
}

// Zpětná kompatibilita (třída → barva) pro místa, která pracují jen s třídou.
export const ASSET_COLORS: Record<AssetClass, { color: string; label: string }> = {
  akcie: { color: BARVY_SLOZEK.akcie, label: 'Akcie' },
  dluhopisy: { color: BARVY_SLOZEK.dluhopisyDlouhe, label: 'Dluhopisy' },
  nemovitosti: { color: BARVY_SLOZEK.nemovitosti, label: 'Nemovitosti' },
  komodity: { color: BARVY_SLOZEK.komodity, label: 'Komodity' },
  zlato: { color: BARVY_SLOZEK.zlato, label: 'Zlato' },
};

export const portfolioModels: PortfolioModel[] = [
  {
    id: 'permanent',
    slug: 'permanentni-portfolio',
    name: 'Permanentní portfolio',
    kratkyNazev: 'Permanentní',
    tagline: 'Pro investory, kteří chtějí klid a stabilitu v každé fázi ekonomiky.',
    risk: 'Konzervativní',
    stocksPct: 25,
    horizon: 'od 5 let',
    forWhom: 'Chci klid a co nejmenší výkyvy, růst je až druhořadý.',
    allocations: [
      { label: 'Akcie', cls: 'akcie', percentage: 25, isin: 'IE00BK5BQT80', etfName: 'Vanguard FTSE All-World UCITS ETF' },
      { label: 'Dlouhodobé dluhopisy', cls: 'dluhopisy', druh: 'dlouhe', percentage: 25, isin: 'IE00BFM6TC58', etfName: 'iShares USD Treasury Bond 20+yr UCITS ETF (Acc)' },
      { label: 'Hotovost (krátké dluhopisy)', cls: 'dluhopisy', druh: 'kratke', percentage: 25, isin: 'IE00BYXPSP02', etfName: 'iShares USD Treasury Bond 1-3yr UCITS ETF' },
      { label: 'Zlato', cls: 'zlato', percentage: 25, isin: 'IE00B4ND3602', etfName: 'iShares Physical Gold ETC' },
    ],
  },
  {
    id: 'allweather',
    slug: 'ray-dalio-all-weather',
    name: 'All Weather (Ray Dalio)',
    kratkyNazev: 'All Weather',
    tagline: 'Navrženo tak, aby obstálo v každém ekonomickém počasí.',
    risk: 'Konzervativní',
    stocksPct: 30,
    horizon: 'od 5 let',
    forWhom: 'Chci odolnost proti všem scénářům, ne sázku na jediný vývoj.',
    allocations: [
      { label: 'Dlouhodobé dluhopisy', cls: 'dluhopisy', druh: 'dlouhe', percentage: 40, isin: 'IE00BFM6TC58', etfName: 'iShares USD Treasury Bond 20+yr UCITS ETF (Acc)' },
      { label: 'Akcie', cls: 'akcie', percentage: 30, isin: 'IE00BK5BQT80', etfName: 'Vanguard FTSE All-World UCITS ETF' },
      { label: 'Střednědobé dluhopisy', cls: 'dluhopisy', druh: 'stredni', percentage: 15, isin: 'IE00B3VWN518', etfName: 'iShares USD Treasury Bond 7-10yr UCITS ETF (Acc)' },
      { label: 'Komodity', cls: 'komodity', percentage: 7.5, isin: 'IE00BD6FTQ80', etfName: 'Invesco Bloomberg Commodity UCITS ETF (Acc)' },
      { label: 'Zlato', cls: 'zlato', percentage: 7.5, isin: 'IE00B4ND3602', etfName: 'iShares Physical Gold ETC' },
    ],
  },
  {
    id: 'nobel',
    slug: 'nobel-portfolio',
    name: 'Nobelovo portfolio',
    kratkyNazev: 'Nobelovo',
    tagline: 'Vyvážená střední cesta mezi růstem akcií a klidnějšími aktivy.',
    risk: 'Umírněné',
    stocksPct: 55,
    horizon: 'od 7 let',
    forWhom: 'Chci slušný růst, ale ne na úkor úplného klidu.',
    allocations: [
      { label: 'Akcie', cls: 'akcie', percentage: 55, isin: 'IE00BK5BQT80', etfName: 'Vanguard FTSE All-World UCITS ETF' },
      { label: 'Dluhopisy', cls: 'dluhopisy', druh: 'stredni', percentage: 25, isin: 'IE00BDBRDM35', etfName: 'iShares Core Global Aggregate Bond UCITS ETF EUR Hedged (Acc)' },
      { label: 'Nemovitosti', cls: 'nemovitosti', percentage: 20, isin: 'IE00B0M63284', etfName: 'iShares European Property Yield UCITS ETF' },
    ],
  },
  {
    id: '6040',
    slug: 'portfolio-60-40',
    name: 'Portfolio 60/40',
    kratkyNazev: '60/40',
    tagline: 'Klasická vyvážená kombinace 60 % akcií a 40 % dluhopisů.',
    risk: 'Umírněné',
    stocksPct: 60,
    horizon: 'od 7 let',
    forWhom: 'Chci osvědčenou rovnováhu růstu a stability bez vymýšlení.',
    allocations: [
      { label: 'Světové akcie', cls: 'akcie', percentage: 60, isin: 'IE00BK5BQT80', etfName: 'Vanguard FTSE All-World UCITS ETF' },
      { label: 'Dluhopisy', cls: 'dluhopisy', druh: 'stredni', percentage: 40, isin: 'IE00BDBRDM35', etfName: 'iShares Core Global Aggregate Bond UCITS ETF EUR Hedged (Acc)' },
    ],
  },
  {
    id: 'stock',
    slug: 'akciove-portfolio',
    name: 'Akciové portfolio',
    kratkyNazev: 'Akciové',
    tagline: 'Maximální dlouhodobý růst pro investory, kteří unesou velké propady.',
    risk: 'Agresivní',
    stocksPct: 80,
    horizon: 'od 10 let',
    forWhom: 'Mám dlouhý horizont a velký propad mě nevyžene z trhu.',
    allocations: [
      { label: 'Světové akcie', cls: 'akcie', percentage: 80, isin: 'IE00BK5BQT80', etfName: 'Vanguard FTSE All-World UCITS ETF' },
      { label: 'Nemovitosti', cls: 'nemovitosti', percentage: 20, isin: 'IE00B0M63284', etfName: 'iShares European Property Yield UCITS ETF' },
    ],
  },
  {
    id: 'dividend',
    slug: 'dividendove-portfolio',
    name: 'Dividendové portfolio',
    kratkyNazev: 'Dividendové',
    tagline: 'Pro investory, kteří chtějí pravidelný příjem z výplat dividend.',
    risk: 'Agresivní',
    stocksPct: 95,
    horizon: 'od 7 let',
    forWhom: 'Chci pravidelný příjem a kvalitní firmy s tradicí výplat.',
    allocations: [
      { label: 'Dividendové akcie', cls: 'akcie', percentage: 95, isin: 'IE00B9CQXS71', etfName: 'SPDR S&P Global Dividend Aristocrats UCITS ETF' },
      { label: 'Nemovitosti', cls: 'nemovitosti', percentage: 5, isin: 'IE00B1FZS350', etfName: 'iShares Developed Markets Property Yield UCITS ETF' },
    ],
  },
  {
    id: 'jadro-scv',
    slug: 'globalni-jadro-small-cap-value',
    name: 'Svět + malé firmy',
    kratkyNazev: 'Svět + malé firmy',
    tagline: 'Pro pokročilé: daňově optimalizované světové jádro (85 %) a k němu jediný faktor, který přežije náklady — malé hodnotové firmy (15 %).',
    risk: 'Agresivní',
    stocksPct: 100,
    horizon: 'od 12 let',
    forWhom: 'Chci prostý světový základ a k němu jeden faktor navíc — a udržím ho i v letech, kdy zaostává.',
    allocations: [
      { label: 'Jádro — USA (S&P 500)', cls: 'akcie', percentage: 54, isin: 'IE00B3YCGJ38', etfName: 'Invesco S&P 500 UCITS ETF (Acc, syntetický)' },
      { label: 'Jádro — svět mimo USA', cls: 'akcie', percentage: 22, isin: 'IE0006WW1TQ4', etfName: 'Xtrackers MSCI World ex USA UCITS ETF' },
      { label: 'Jádro — rozvíjející se trhy', cls: 'akcie', percentage: 9, isin: 'IE00BKM4GZ66', etfName: 'iShares Core MSCI EM IMI UCITS ETF' },
      { label: 'Malé hodnotové firmy (satelit)', cls: 'akcie', percentage: 15, isin: 'IE0003R87OG3', etfName: 'Avantis Global Small Cap Value UCITS ETF' },
    ],
  },
];

/** Riziko jako 1–3 tečky (stejně jako homepage), bez červeného „poplašného“ štítku. */
export const RIZIKO_TECKY: Record<PortfolioRisk, number> = { 'Konzervativní': 1, 'Umírněné': 2, 'Agresivní': 3 };

/* Odkaz do backtestu: hotový preset, když existuje (id z PRESET_PORTFOLIOS v BacktestWidget.tsx), jinak
   vlastní složení ?slozeni=kod:vaha. Vždy stejné období a počáteční vklad jako předpočet na stránce
   (start 2008-07-01, 100 000 Kč, bez dalších vkladů, roční rebalancování) – čísla v backtestu pak sedí. */
const BACKTEST_PRESET: Record<string, string> = {
  'permanentni-portfolio': 'permanent',
  'ray-dalio-all-weather': 'all-weather',
  'portfolio-60-40': '60-40',
};
export function backtestOdkaz(slug: string): string | null {
  const cfg = PORTFOLIO_BACKTEST[slug];
  if (!cfg) return null;
  const p = new URLSearchParams();
  const preset = BACKTEST_PRESET[slug];
  if (preset) p.set('portfolio', preset);
  else p.set('slozeni', cfg.items.map((i) => `${i.indexCode}:${Math.round(i.weight * 1000) / 10}`).join(','));
  p.set('start', cfg.start);
  p.set('amount', '100000');
  p.set('contrib', 'none');
  p.set('vyvazovani', 'yearly');
  p.set('run', '1');
  return `/backtest?${p.toString().replace(/%3A/g, ':').replace(/%2C/g, ',')}`;
}

/* ---------- Backtest: mapování na indexCode existujícího enginu ----------
   Modelová portfolia napojujeme na reálná denní historická data (tabulka
   index_historical_data, engine src/lib/backtest). Kde nemáme přesný index
   (nemovitostní REIT, dividendový index), použijeme nejbližší proxy a otevřeně
   to přiznáme v `proxyNote`. `start` = nejzazší datum, kde mají VŠECHNY složky
   data (vázáno hlavně ftse_all_world od 2008‑06). */
export interface BacktestItem {
  indexCode: string;
  weight: number; // 0–1
  ter: number;    // desetinně, např. 0.0022
}
export interface BacktestConfig {
  start: string;  // ISO datum začátku (kde mají data všechny složky)
  items: BacktestItem[];
  proxyNote?: string;
}

export const PORTFOLIO_BACKTEST: Record<string, BacktestConfig> = {
  'globalni-jadro-small-cap-value': {
    start: '2008-07-01',
    items: [
      { indexCode: 'sp500', weight: 0.54, ter: 0.0005 },
      { indexCode: 'world_ex_us', weight: 0.22, ter: 0.0015 },
      { indexCode: 'msci_em', weight: 0.09, ter: 0.0018 },
      { indexCode: 'us_small_cap', weight: 0.15, ter: 0.0039 }, // proxy globálního small-cap value
    ],
    proxyNote: 'Small-cap value satelit (Avantis Global Small Cap Value) v backtestu aproximujeme indexem US small cap — zachytí size prémii, ne však value tilt ani globální rozsah, takže jeho historický přínos je spíš PODhodnocený. Slouží k ilustraci rizika a průběhu, ne k přesnému výnosu SCV strategie.',
  },
  'permanentni-portfolio': {
    start: '2008-07-01',
    items: [
      { indexCode: 'ftse_all_world', weight: 0.25, ter: 0.0022 },
      { indexCode: 'us_treasury_20y', weight: 0.25, ter: 0.0007 },
      { indexCode: 'us_treasury_1_3y', weight: 0.25, ter: 0.0007 },
      { indexCode: 'gold', weight: 0.25, ter: 0.0012 },
    ],
  },
  'nobel-portfolio': {
    start: '2008-07-01',
    items: [
      { indexCode: 'ftse_all_world', weight: 0.55, ter: 0.0022 },
      { indexCode: 'us_aggregate_bond', weight: 0.25, ter: 0.0025 },
      { indexCode: 'ftse_europe', weight: 0.20, ter: 0.0040 }, // proxy nemovitostí
    ],
    proxyNote: 'Nemovitostní složku kvůli délce historie aproximujeme evropským akciovým indexem.',
  },
  'akciove-portfolio': {
    start: '2008-07-01',
    items: [
      { indexCode: 'ftse_all_world', weight: 0.80, ter: 0.0022 },
      { indexCode: 'ftse_europe', weight: 0.20, ter: 0.0040 }, // proxy nemovitostí
    ],
    proxyNote: 'Nemovitostní složku kvůli délce historie aproximujeme evropským akciovým indexem.',
  },
  'ray-dalio-all-weather': {
    start: '2008-07-01',
    items: [
      { indexCode: 'us_treasury_20y', weight: 0.40, ter: 0.0007 },
      { indexCode: 'ftse_all_world', weight: 0.30, ter: 0.0022 },
      { indexCode: 'us_treasury_7_10y', weight: 0.15, ter: 0.0007 },
      { indexCode: 'commodities', weight: 0.075, ter: 0.0019 },
      { indexCode: 'gold', weight: 0.075, ter: 0.0012 },
    ],
  },
  'portfolio-60-40': {
    start: '2008-07-01',
    items: [
      { indexCode: 'ftse_all_world', weight: 0.60, ter: 0.0022 },
      { indexCode: 'us_aggregate_bond', weight: 0.40, ter: 0.0025 },
    ],
  },
  'dividendove-portfolio': {
    start: '2008-07-01',
    items: [
      { indexCode: 'ftse_all_world', weight: 0.95, ter: 0.0045 }, // proxy dividendového indexu
      { indexCode: 'ftse_europe', weight: 0.05, ter: 0.0040 },    // proxy nemovitostí
    ],
    proxyNote: 'Dividendovou složku aproximujeme širokým globálním akciovým indexem – slouží k ilustraci rizika a průběhu, ne k přesnému výnosu dividendové strategie.',
  },
};

// Benchmark pro srovnání „portfolio vs čisté akcie".
export const BACKTEST_BENCHMARK: BacktestItem = { indexCode: 'ftse_all_world', weight: 1, ter: 0.0022 };

// Barva pilulky rizika (slate / amber / red – nikdy fialová).
export const RISK_PILL: Record<PortfolioRisk, string> = {
  'Konzervativní': 'bg-slate-100 text-slate-700 border-slate-200',
  'Umírněné': 'bg-amber-50 text-amber-700 border-amber-200',
  'Agresivní': 'bg-red-50 text-red-700 border-red-200',
};
