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
    expectedReturn: '≈ 4 % ročně',
    maxDrawdown: 'do −15 %',
    allocations: [
      { label: 'Akcie', cls: 'akcie', percentage: 25, isin: 'IE00BK5BQT80', etfName: 'Vanguard FTSE All-World UCITS ETF' },
      { label: 'Dluhopisy', cls: 'dluhopisy', percentage: 25, isin: 'IE00BDBRDM35', etfName: 'iShares Core Global Aggregate Bond UCITS ETF EUR Hedged (Acc)' },
      { label: 'Nemovitosti', cls: 'nemovitosti', percentage: 25, isin: 'IE00B0M63284', etfName: 'iShares European Property Yield UCITS ETF' },
      { label: 'Komodity', cls: 'komodity', percentage: 25, isin: 'IE00BD6FTQ80', etfName: 'Invesco Bloomberg Commodity UCITS ETF (Acc)' },
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

// Barva pilulky rizika (slate / amber / red – nikdy fialová).
export const RISK_PILL: Record<PortfolioRisk, string> = {
  'Konzervativní': 'bg-slate-100 text-slate-700 border-slate-200',
  'Umírněné': 'bg-amber-50 text-amber-700 border-amber-200',
  'Agresivní': 'bg-red-50 text-red-700 border-red-200',
};
