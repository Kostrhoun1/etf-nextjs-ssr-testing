// Čistá data 5 modelových portfolií – přeneseno 1:1 z
// src/components/portfolio/PortfolioStrategies.tsx (pole portfolioStrategies, r.47–119).
// Bez anglicismů (All-Weather → Ray Dalio (pro každé počasí), REITs → nemovitostní fondy, drawdown → max. pokles).

export type PortfolioRisk = 'Konzervativní' | 'Umírněné' | 'Agresivní';

// Třídy aktiv s konzistentní barvou napříč všemi kartami (token DS).
export type AssetClass = 'akcie' | 'dluhopisy' | 'nemovitosti' | 'komodity' | 'zlato';

export interface PortfolioAllocation {
  /** Zobrazený název položky v legendě, např. „Dlouhodobé dluhopisy". */
  label: string;
  /** Třída aktiva pro barvu segmentu. */
  cls: AssetClass;
  percentage: number;
  isin: string;
  etfName: string;
}

export interface PortfolioModel {
  id: string;
  slug: string;            // detailová podstránka (existuje)
  name: string;
  tagline: string;         // 1 věta „pro koho"
  risk: PortfolioRisk;
  /** % v akciích – pro tabulku „pro koho". */
  stocksPct: number;
  horizon: string;         // doporučený horizont
  forWhom: string;         // verdikt do tabulky
  expectedReturn: string;
  maxDrawdown: string;     // dříve „drawdown" → max. pokles
  allocations: PortfolioAllocation[];
}

// Barevné tokeny tříd aktiv (teal/slate/emerald/amber – žádná fialová).
export const ASSET_COLORS: Record<AssetClass, { bar: string; dot: string; label: string }> = {
  akcie:       { bar: 'bg-teal-600',    dot: 'bg-teal-600',    label: 'Akcie' },
  dluhopisy:   { bar: 'bg-slate-400',   dot: 'bg-slate-400',   label: 'Dluhopisy' },
  nemovitosti: { bar: 'bg-emerald-600', dot: 'bg-emerald-600', label: 'Nemovitosti' },
  komodity:    { bar: 'bg-amber-500',   dot: 'bg-amber-500',   label: 'Komodity' },
  zlato:       { bar: 'bg-amber-400',   dot: 'bg-amber-400',   label: 'Zlato' },
};

export const portfolioModels: PortfolioModel[] = [
  {
    id: 'permanent',
    slug: 'permanentni-portfolio',
    name: 'Permanentní portfolio',
    tagline: 'Pro investory, kteří chtějí klid a stabilitu v každé fázi ekonomiky.',
    risk: 'Konzervativní',
    stocksPct: 25,
    horizon: 'od 5 let',
    forWhom: 'Chci klid a co nejmenší výkyvy, růst je až druhořadý.',
    expectedReturn: '≈ 5–6 % ročně',
    maxDrawdown: 'do −20 %',
    allocations: [
      { label: 'Akcie', cls: 'akcie', percentage: 25, isin: 'IE00BK5BQT80', etfName: 'Vanguard FTSE All-World UCITS ETF' },
      { label: 'Dlouhodobé dluhopisy', cls: 'dluhopisy', percentage: 25, isin: 'IE00BFM6TC58', etfName: 'iShares USD Treasury Bond 20+yr UCITS ETF (Acc)' },
      { label: 'Hotovost (krátké dluhopisy)', cls: 'dluhopisy', percentage: 25, isin: 'IE00BYXPSP02', etfName: 'iShares USD Treasury Bond 1-3yr UCITS ETF' },
      { label: 'Zlato', cls: 'zlato', percentage: 25, isin: 'IE00B4ND3602', etfName: 'iShares Physical Gold ETC' },
    ],
  },
  {
    id: 'nobel',
    slug: 'nobel-portfolio',
    name: 'Nobelovo portfolio',
    tagline: 'Vyvážená střední cesta mezi růstem akcií a klidnějšími aktivy.',
    risk: 'Umírněné',
    stocksPct: 55,
    horizon: 'od 7 let',
    forWhom: 'Chci slušný růst, ale ne na úkor úplného klidu.',
    expectedReturn: '≈ 6 % ročně',
    maxDrawdown: 'do −25 %',
    allocations: [
      { label: 'Akcie', cls: 'akcie', percentage: 55, isin: 'IE00BK5BQT80', etfName: 'Vanguard FTSE All-World UCITS ETF' },
      { label: 'Dluhopisy', cls: 'dluhopisy', percentage: 25, isin: 'IE00BDBRDM35', etfName: 'iShares Core Global Aggregate Bond UCITS ETF EUR Hedged (Acc)' },
      { label: 'Nemovitosti', cls: 'nemovitosti', percentage: 20, isin: 'IE00B0M63284', etfName: 'iShares European Property Yield UCITS ETF' },
    ],
  },
  {
    id: 'stock',
    slug: 'akciove-portfolio',
    name: 'Akciové portfolio',
    tagline: 'Maximální dlouhodobý růst pro investory, kteří unesou velké propady.',
    risk: 'Agresivní',
    stocksPct: 80,
    horizon: 'od 10 let',
    forWhom: 'Mám dlouhý horizont a propad −40 % mě nevyžene z trhu.',
    expectedReturn: '≈ 7–8 % ročně',
    maxDrawdown: 'do −40 %',
    allocations: [
      { label: 'Světové akcie', cls: 'akcie', percentage: 80, isin: 'IE00BK5BQT80', etfName: 'Vanguard FTSE All-World UCITS ETF' },
      { label: 'Nemovitosti', cls: 'nemovitosti', percentage: 20, isin: 'IE00B0M63284', etfName: 'iShares European Property Yield UCITS ETF' },
    ],
  },
  {
    id: 'allweather',
    slug: 'ray-dalio-all-weather',
    name: 'Ray Dalio (pro každé počasí)',
    tagline: 'Navrženo tak, aby obstálo v každém ekonomickém počasí.',
    risk: 'Konzervativní',
    stocksPct: 30,
    horizon: 'od 5 let',
    forWhom: 'Chci odolnost proti všem scénářům, ne sázku na jediný vývoj.',
    expectedReturn: '≈ 5–8 % ročně',
    maxDrawdown: 'do −20 %',
    allocations: [
      { label: 'Dlouhodobé dluhopisy', cls: 'dluhopisy', percentage: 40, isin: 'IE00BFM6TC58', etfName: 'iShares USD Treasury Bond 20+yr UCITS ETF (Acc)' },
      { label: 'Akcie', cls: 'akcie', percentage: 30, isin: 'IE00BK5BQT80', etfName: 'Vanguard FTSE All-World UCITS ETF' },
      { label: 'Střednědobé dluhopisy', cls: 'dluhopisy', percentage: 15, isin: 'IE00B3VWN518', etfName: 'iShares USD Treasury Bond 7-10yr UCITS ETF (Acc)' },
      { label: 'Komodity', cls: 'komodity', percentage: 7.5, isin: 'IE00BD6FTQ80', etfName: 'Invesco Bloomberg Commodity UCITS ETF (Acc)' },
      { label: 'Zlato', cls: 'zlato', percentage: 7.5, isin: 'IE00B4ND3602', etfName: 'iShares Physical Gold ETC' },
    ],
  },
  {
    id: '6040',
    slug: 'portfolio-60-40',
    name: 'Portfolio 60/40',
    tagline: 'Klasická vyvážená kombinace 60 % akcií a 40 % dluhopisů.',
    risk: 'Umírněné',
    stocksPct: 60,
    horizon: 'od 7 let',
    forWhom: 'Chci osvědčenou rovnováhu růstu a stability bez vymýšlení.',
    expectedReturn: '≈ 5–6 % ročně',
    maxDrawdown: 'do −25 %',
    allocations: [
      { label: 'Světové akcie', cls: 'akcie', percentage: 60, isin: 'IE00BK5BQT80', etfName: 'Vanguard FTSE All-World UCITS ETF' },
      { label: 'Dluhopisy', cls: 'dluhopisy', percentage: 40, isin: 'IE00BDBRDM35', etfName: 'iShares Core Global Aggregate Bond UCITS ETF EUR Hedged (Acc)' },
    ],
  },
  {
    id: 'dividend',
    slug: 'dividendove-portfolio',
    name: 'Dividendové portfolio',
    tagline: 'Pro investory, kteří chtějí pravidelný příjem z výplat dividend.',
    risk: 'Agresivní',
    stocksPct: 95,
    horizon: 'od 7 let',
    forWhom: 'Chci pravidelný příjem a kvalitní firmy s tradicí výplat.',
    expectedReturn: '≈ 4 % dividendy + růst',
    maxDrawdown: 'do −45 %',
    allocations: [
      { label: 'Dividendové akcie', cls: 'akcie', percentage: 95, isin: 'IE00B9CQXS71', etfName: 'SPDR S&P Global Dividend Aristocrats UCITS ETF' },
      { label: 'Nemovitosti', cls: 'nemovitosti', percentage: 5, isin: 'IE00B1FZS350', etfName: 'iShares Developed Markets Property Yield UCITS ETF' },
    ],
  },
];

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
