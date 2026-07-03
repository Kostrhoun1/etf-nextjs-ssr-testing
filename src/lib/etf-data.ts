/**
 * Server-side data fetching functions for ETF pages
 * These functions are used for SSG/ISR to pre-render pages with data
 */
import { createClient } from '@supabase/supabase-js';

// Direct Supabase client for build-time data fetching (SSG/ISR).
// Modern publishable key (sb_publishable_...) – nahrazuje starý legacy service_role
// JWT, který Supabase zakázal 2026-04-26 ("Legacy API keys are disabled") a kvůli
// kterému se kategorie/srovnání renderovaly s PRÁZDNÝMI daty (= thin content).
// Publishable klíč má read-only přístup k veřejné tabulce etf_funds, což pro SSG stačí.
const SUPABASE_URL = 'https://nbhwnatadyubiuadfakx.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_IrdFtruv53Z2RbXNRRWCcw_K0TD4_ml';
// Použij env klíč JEN pokud je v novém formátu (sb_secret_/sb_publishable_);
// starý legacy JWT (eyJ...) je od 2026-04-26 zakázaný, proto ho ignorujeme.
const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s+/g, '');
const SUPABASE_READ_KEY = envKey?.startsWith('sb_') ? envKey : SUPABASE_PUBLISHABLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_READ_KEY);

// Types
export interface ETFBasicInfo {
  isin: string;
  name: string;
  fund_provider: string;
  primary_ticker: string | null;
  ter_numeric: number | null;
  fund_size_numeric: number | null;
  rating: number | null;
  return_ytd: number | null;
  return_ytd_czk: number | null;
  return_ytd_usd: number | null;
  return_1y: number | null;
  return_1y_czk: number | null;
  return_1y_usd: number | null;
  return_3y: number | null;
  return_3y_czk: number | null;
  return_3y_usd: number | null;
  return_5y: number | null;
  return_5y_czk: number | null;
  return_5y_usd: number | null;
  category: string | null;
  distribution_policy: string | null;
  replication: string | null;
  fund_domicile: string | null;
}

export interface CategoryConfig {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  filters: {
    category?: string;
    categories?: string[];
    nameContains?: string[];
    indexContains?: string[];
    minFundSize?: number;
    distribution_policy?: string;
    regions?: string[];
    minTer?: number;
  };
  sortBy?: keyof ETFBasicInfo;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

// Common select fields for ETF queries
const ETF_SELECT_FIELDS = `
  isin,
  name,
  fund_provider,
  primary_ticker,
  ter_numeric,
  fund_size_numeric,
  rating,
  return_ytd,
  return_ytd_czk,
  return_ytd_usd,
  return_1y,
  return_1y_czk,
  return_1y_usd,
  return_3y,
  return_3y_czk,
  return_3y_usd,
  return_5y,
  return_5y_czk,
  return_5y_usd,
  category,
  distribution_policy,
  replication,
  fund_domicile
`;

/**
 * Get top ETFs for a specific category page
 * Used by /nejlepsi-etf/* pages
 */
export async function getTopETFsForCategory(config: CategoryConfig): Promise<ETFBasicInfo[]> {
  try {
    let query = supabaseAdmin
      .from('etf_funds')
      .select(ETF_SELECT_FIELDS);

    // Apply category filter (simple eq - works well alone)
    if (config.filters.category) {
      query = query.eq('category', config.filters.category);
    }

    if (config.filters.categories && config.filters.categories.length > 0) {
      query = query.in('category', config.filters.categories);
    }

    // Apply name contains filter (OR logic between terms)
    // This uses ilike for case-insensitive matching
    if (config.filters.nameContains && config.filters.nameContains.length > 0) {
      const nameFilters = config.filters.nameContains.map(term => `name.ilike.%${term}%`).join(',');
      query = query.or(nameFilters);
    }

    // Apply index contains filter
    if (config.filters.indexContains && config.filters.indexContains.length > 0) {
      const indexFilters = config.filters.indexContains.map(term => `index_tracked.ilike.%${term}%`).join(',');
      query = query.or(indexFilters);
    }

    // Apply minimum fund size filter
    if (config.filters.minFundSize) {
      query = query.gte('fund_size_numeric', config.filters.minFundSize);
    }

    // Apply distribution policy filter
    if (config.filters.distribution_policy) {
      query = query.eq('distribution_policy', config.filters.distribution_policy);
    }

    // Apply minimum TER filter (např. žebříček nejlevnějších vyloučí 0% zlaté
    // ETC a crypto staking ETP, které sice mají TER 0, ale nejsou klasické ETF)
    if (config.filters.minTer !== undefined) {
      query = query.gt('ter_numeric', config.filters.minTer);
    }

    // Default: filter out very small funds
    query = query.not('fund_size_numeric', 'is', null);
    query = query.gte('fund_size_numeric', 10);

    // Apply sorting
    const sortBy = config.sortBy || 'fund_size_numeric';
    const sortOrder = config.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Secondary sort by fund size when sorting by rating (to prefer larger funds at same rating)
    // Also exclude ETFs without rating when sorting by rating
    if (sortBy === 'rating') {
      query = query.not('rating', 'is', null);
      query = query.order('fund_size_numeric', { ascending: false });
    }

    // Apply limit
    const limit = config.limit || 50;
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ETFs for ${config.slug}:`, error);
      return [];
    }

    return (data || []) as ETFBasicInfo[];
  } catch (error) {
    console.error(`Error in getTopETFsForCategory for ${config.slug}:`, error);
    return [];
  }
}

/**
 * Get featured ETFs for srovnani-etf page
 * Returns top ETFs by different criteria for initial render
 */
export async function getFeaturedETFs(): Promise<{
  bySize: ETFBasicInfo[];
  byPerformance: ETFBasicInfo[];
  byRating: ETFBasicInfo[];
  lowCost: ETFBasicInfo[];
}> {
  try {
    // Fetch top by fund size
    const bySizePromise = supabaseAdmin
      .from('etf_funds')
      .select(ETF_SELECT_FIELDS)
      .not('fund_size_numeric', 'is', null)
      .gte('fund_size_numeric', 100)
      .order('fund_size_numeric', { ascending: false })
      .limit(20);

    // Fetch top by 1Y performance
    const byPerformancePromise = supabaseAdmin
      .from('etf_funds')
      .select(ETF_SELECT_FIELDS)
      .not('return_1y', 'is', null)
      .not('fund_size_numeric', 'is', null)
      .gte('fund_size_numeric', 50)
      // Vyloučit páková ETP – jinak žebříček "nejvýkonnější" ovládnou produkty
      // s +200 % (násobná expozice), což pro běžného investora není relevantní.
      // Pozn.: vysoké 1Y výnosy nepákových fondů (např. MSCI Korea ~+210 %) jsou
      // REÁLNÉ (korejský chip-supercyklus 2025–2026, ověřeno proti justETF) – NEfiltrovat.
      .not('is_leveraged', 'is', true)
      .order('return_1y', { ascending: false })
      .limit(20);

    // Fetch top rated
    const byRatingPromise = supabaseAdmin
      .from('etf_funds')
      .select(ETF_SELECT_FIELDS)
      .not('rating', 'is', null)
      .gte('rating', 4)
      .not('fund_size_numeric', 'is', null)
      .order('rating', { ascending: false })
      .order('fund_size_numeric', { ascending: false })
      .limit(20);

    // Fetch lowest cost
    const lowCostPromise = supabaseAdmin
      .from('etf_funds')
      .select(ETF_SELECT_FIELDS)
      .not('ter_numeric', 'is', null)
      .not('fund_size_numeric', 'is', null)
      .gte('fund_size_numeric', 100)
      // TER musí být > 0: hodnota 0 mají jen zlaté ETC (Xetra-Gold) a crypto
      // staking ETP (CoinShares) – legitimně 0 %, ale do žebříčku "nejlevnější
      // ETF" nepatří (nejsou to klasické ETF a mají jiné náklady – spread/storage).
      .gt('ter_numeric', 0)
      .lte('ter_numeric', 0.15)
      .order('ter_numeric', { ascending: true })
      .limit(20);

    const [bySizeResult, byPerformanceResult, byRatingResult, lowCostResult] = await Promise.all([
      bySizePromise,
      byPerformancePromise,
      byRatingPromise,
      lowCostPromise,
    ]);

    return {
      bySize: (bySizeResult.data || []) as ETFBasicInfo[],
      byPerformance: (byPerformanceResult.data || []) as ETFBasicInfo[],
      byRating: (byRatingResult.data || []) as ETFBasicInfo[],
      lowCost: (lowCostResult.data || []) as ETFBasicInfo[],
    };
  } catch (error) {
    console.error('Error in getFeaturedETFs:', error);
    return {
      bySize: [],
      byPerformance: [],
      byRating: [],
      lowCost: [],
    };
  }
}

/**
 * Get last modified date from database
 */
export async function getLastModifiedDate(): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return data.updated_at;
  } catch (error) {
    console.error('Error in getLastModifiedDate:', error);
    return null;
  }
}

/**
 * Get total ETF count
 */
export async function getTotalETFCount(): Promise<number> {
  try {
    const { count, error } = await supabaseAdmin
      .from('etf_funds')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting ETF count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getTotalETFCount:', error);
    return 0;
  }
}

/**
 * Korunové výnosy (1R/3R) pro sadu ISINů – pro výpočet výnosu modelových portfolií
 * (vážený průměr výnosů složek). Vrací mapu isin → { return_1y_czk, return_3y_czk }.
 */
export async function getReturnsByIsins(
  isins: string[],
): Promise<Record<string, { return_1y_czk: number | null; return_3y_czk: number | null }>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select('isin, return_1y_czk, return_3y_czk')
      .in('isin', isins);
    if (error || !data) return {};
    const map: Record<string, { return_1y_czk: number | null; return_3y_czk: number | null }> = {};
    for (const row of data as Array<{ isin: string; return_1y_czk: number | null; return_3y_czk: number | null }>) {
      map[row.isin] = {
        return_1y_czk: row.return_1y_czk != null ? Number(row.return_1y_czk) : null,
        return_3y_czk: row.return_3y_czk != null ? Number(row.return_3y_czk) : null,
      };
    }
    return map;
  } catch (e) {
    console.error('Error in getReturnsByIsins:', e);
    return {};
  }
}

/**
 * Metriky pro sadu ISINů – výnos (1R/3R v Kč), kolísavost (1R) a max. pokles (1R).
 * Pro srovnání modelových portfolií se 100% akciovým benchmarkem (S&P 500).
 */
export type IsinMetrics = {
  return_1y_czk: number | null;
  return_3y_czk: number | null;
  volatility_1y: number | null;
  max_drawdown_1y: number | null;
  max_drawdown_all: number | null;
};
export async function getMetricsByIsins(
  isins: string[],
): Promise<Record<string, IsinMetrics>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select('isin, return_1y_czk, return_3y_czk, volatility_1y, max_drawdown_1y, max_drawdown_inception')
      .in('isin', isins);
    if (error || !data) return {};
    const num = (v: unknown) => (v != null ? Number(v) : null);
    const map: Record<string, IsinMetrics> = {};
    for (const row of data as Array<Record<string, unknown>>) {
      map[row.isin as string] = {
        return_1y_czk: num(row.return_1y_czk),
        return_3y_czk: num(row.return_3y_czk),
        volatility_1y: num(row.volatility_1y),
        max_drawdown_1y: num(row.max_drawdown_1y),
        max_drawdown_all: num(row.max_drawdown_inception),
      };
    }
    return map;
  } catch (e) {
    console.error('Error in getMetricsByIsins:', e);
    return {};
  }
}

/**
 * Načte vybrané ETF podle ISINů (zachová pořadí vstupu) – pro kurátorské sekce
 * jako „kterým ETF začít".
 */
export async function getETFsByIsins(isins: string[]): Promise<ETFBasicInfo[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select(ETF_SELECT_FIELDS)
      .in('isin', isins);
    if (error || !data) return [];
    const byIsin = new Map((data as ETFBasicInfo[]).map((e) => [e.isin, e]));
    return isins.map((i) => byIsin.get(i)).filter((e): e is ETFBasicInfo => Boolean(e));
  } catch (e) {
    console.error('Error in getETFsByIsins:', e);
    return [];
  }
}

export interface MarketSnapshotItem {
  label: string;
  slug: string;
  return_1y_czk: number | null;
}

/**
 * Přehled „jak si vedou trhy" – pro klíčové trhy vrací korunový roční výnos
 * největšího fondu v dané kategorii (reálná data, žádné hardcoded číslo).
 */
export async function getMarketSnapshot(): Promise<MarketSnapshotItem[]> {
  const MARKETS: { slug: string; label: string }[] = [
    { slug: 'nejlepsi-celosvetove-etf', label: 'Celý svět' },
    { slug: 'nejlepsi-sp500-etf', label: 'USA (S&P 500)' },
    { slug: 'nejlepsi-evropske-etf', label: 'Evropa' },
    { slug: 'nejlepsi-emerging-markets-etf', label: 'Rozvíjející se' },
    { slug: 'nejlepsi-technologicke-etf', label: 'Technologie' },
    { slug: 'nejlepsi-zlato-etf', label: 'Zlato' },
    { slug: 'nejlepsi-dluhopisove-etf', label: 'Dluhopisy' },
  ];
  const results = await Promise.all(
    MARKETS.map(async (m) => {
      const cfg = categoryConfigs[m.slug];
      if (!cfg) return null;
      try {
        const etfs = await getTopETFsForCategory({ ...cfg, limit: 1 });
        const top = etfs[0];
        const v = top?.return_1y_czk ?? top?.return_1y ?? null;
        return { label: m.label, slug: m.slug, return_1y_czk: v != null ? Number(v) : null };
      } catch {
        return null;
      }
    }),
  );
  return results.filter((x): x is MarketSnapshotItem => x != null);
}

/**
 * Plné metriky ETF pro detailní srovnávací stránky /srovnani-etf/[x-vs-y].
 */
export interface ComparisonETF {
  isin: string;
  name: string;
  fund_provider: string | null;
  primary_ticker: string | null;
  ter_numeric: number | null;
  fund_size_numeric: number | null;
  return_1y: number | null;
  return_3y: number | null;
  return_5y: number | null;
  return_ytd: number | null;
  return_1y_czk: number | null;
  return_3y_czk: number | null;
  return_5y_czk: number | null;
  return_ytd_czk: number | null;
  volatility_1y: number | null;
  max_drawdown_1y: number | null;
  current_dividend_yield_numeric: number | null;
  distribution_policy: string | null;
  replication: string | null;
  index_name: string | null;
  region: string | null;
  fund_currency: string | null;
  fund_domicile: string | null;
  total_holdings: number | null;
  inception_date: string | null;
  is_leveraged: boolean | null;
  category: string | null;
}

const COMPARISON_TICKER_FIELDS = [
  'primary_ticker',
  'exchange_1_ticker', 'exchange_2_ticker', 'exchange_3_ticker', 'exchange_4_ticker', 'exchange_5_ticker',
  'exchange_6_ticker', 'exchange_7_ticker', 'exchange_8_ticker', 'exchange_9_ticker', 'exchange_10_ticker',
] as const;

/**
 * Načte plné metriky pro dvojici ETF podle tickerů (pro obohacený SSR obsah
 * srovnávacích stránek). Vrací etf1/etf2 namapované přesně na zadané tickery.
 */
export async function getComparisonETFData(
  ticker1: string,
  ticker2: string
): Promise<{ etf1: ComparisonETF; etf2: ComparisonETF } | null> {
  try {
    const orConditions = [ticker1, ticker2]
      .map(symbol => COMPARISON_TICKER_FIELDS.map(field => `${field}.eq.${symbol}`).join(','))
      .join(',');

    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select(`
        isin, name, fund_provider, primary_ticker,
        ter_numeric, fund_size_numeric,
        return_1y, return_3y, return_5y, return_ytd,
        return_1y_czk, return_3y_czk, return_5y_czk, return_ytd_czk,
        volatility_1y, max_drawdown_1y,
        current_dividend_yield_numeric,
        distribution_policy, replication, index_name, region,
        fund_currency, fund_domicile, total_holdings, inception_date,
        is_leveraged, category,
        ${COMPARISON_TICKER_FIELDS.join(', ')}
      `)
      .or(orConditions);

    if (error || !data || data.length < 2) {
      return null;
    }

    const matches = (etf: Record<string, unknown>, ticker: string) =>
      COMPARISON_TICKER_FIELDS.some(f => (etf[f] as string)?.toUpperCase() === ticker.toUpperCase());

    const etf1 = data.find(e => matches(e, ticker1)) as ComparisonETF | undefined;
    const etf2 = data.find(e => matches(e, ticker2)) as ComparisonETF | undefined;

    if (!etf1 || !etf2 || etf1.isin === etf2.isin) {
      return null;
    }

    return { etf1, etf2 };
  } catch (error) {
    console.error('Error in getComparisonETFData:', error);
    return null;
  }
}

/**
 * Načte ETF pro detailní porovnání dle ISINů (nový design – stránka „porovnání").
 * Zachovává pořadí vstupu.
 */
export async function getComparisonETFsByIsins(isins: string[]): Promise<ComparisonETF[]> {
  if (!isins.length) return [];
  try {
    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select(`
        isin, name, fund_provider, primary_ticker,
        ter_numeric, fund_size_numeric,
        return_1y, return_3y, return_5y, return_ytd,
        return_1y_czk, return_3y_czk, return_5y_czk, return_ytd_czk,
        volatility_1y, max_drawdown_1y,
        current_dividend_yield_numeric,
        distribution_policy, replication, index_name, region,
        fund_currency, fund_domicile, total_holdings, inception_date
      `)
      .in('isin', isins.slice(0, 4));
    if (error || !data) return [];
    const byIsin = new Map((data as ComparisonETF[]).map((e) => [e.isin, e]));
    return isins.map((i) => byIsin.get(i)).filter((e): e is ComparisonETF => !!e);
  } catch (error) {
    console.error('Error in getComparisonETFsByIsins:', error);
    return [];
  }
}

/** Řádek pro screener (nový design) – pole potřebná pro plné filtrování/řazení/hledání. */
export interface ScreenerETF {
  isin: string;
  name: string;
  fund_provider: string | null;
  primary_ticker: string | null;
  exchange_1_ticker: string | null;
  exchange_2_ticker: string | null;
  exchange_3_ticker: string | null;
  exchange_4_ticker: string | null;
  exchange_5_ticker: string | null;
  ter_numeric: number | null;
  fund_size_numeric: number | null;
  return_ytd: number | null;
  return_1y: number | null;
  return_3y: number | null;
  return_5y: number | null;
  return_1y_czk: number | null;
  return_3y_czk: number | null;
  return_5y_czk: number | null;
  return_ytd_czk: number | null;
  volatility_1y: number | null;
  current_dividend_yield_numeric: number | null;
  distribution_policy: string | null;
  replication: string | null;
  index_name: string | null;
  region: string | null;
  investment_focus: string | null;
  fund_currency: string | null;
  currency_risk: string | null;
  category: string | null;
  is_leveraged: boolean | null;
  rating: number | null;
  inception_date: string | null;
}

const SCREENER_COLUMNS = `
  isin, name, fund_provider, primary_ticker,
  exchange_1_ticker, exchange_2_ticker, exchange_3_ticker, exchange_4_ticker, exchange_5_ticker,
  ter_numeric, fund_size_numeric,
  return_ytd, return_1y, return_3y, return_5y,
  return_1y_czk, return_3y_czk, return_5y_czk, return_ytd_czk,
  volatility_1y, current_dividend_yield_numeric,
  distribution_policy, replication, index_name, region, investment_focus,
  fund_currency, currency_risk, category, is_leveraged, rating, inception_date
`;

/**
 * Seznam ETF pro screener (nový design) – VŠECHNY fondy (dávkově, Supabase vrací
 * max 1000/dotaz) s poli pro plné pokročilé filtrování jako na původním webu:
 * index, region, měna, měnové zajištění, páková, rating, velikost, dividendy…
 */
export async function getScreenerETFData(): Promise<ScreenerETF[]> {
  try {
    // Načítáme ÚPLNĚ VŠECHNY ETF (i fondy bez uvedené velikosti), aby filtry
    // pracovaly nad celou databází. Řadíme podle velikosti sestupně, fondy bez
    // velikosti (NULL) až na konec (nullsFirst: false).
    const PAGE = 1000;
    const all: ScreenerETF[] = [];
    for (let from = 0; from < 20000; from += PAGE) {
      const { data, error } = await supabaseAdmin
        .from('etf_funds')
        .select(SCREENER_COLUMNS)
        .order('fund_size_numeric', { ascending: false, nullsFirst: false })
        .order('isin', { ascending: true })
        .range(from, from + PAGE - 1);
      if (error || !data || data.length === 0) break;
      all.push(...(data as unknown as ScreenerETF[]));
      if (data.length < PAGE) break;
    }
    return all;
  } catch (error) {
    console.error('Error in getScreenerETFData:', error);
    return [];
  }
}

/**
 * Category configurations for all /nejlepsi-etf/* pages
 * This maps each page slug to its filter configuration
 */
export const categoryConfigs: Record<string, CategoryConfig> = {
  'nejlepsi-etf-2026': {
    slug: 'nejlepsi-etf-2026',
    title: 'Nejlepší ETF 2026',
    description: 'Top ETF fondy pro rok 2026 podle výkonnosti a ratingu',
    metaDescription: 'Nejlepší ETF fondy pro rok 2026 - kompletní přehled top hodnocených ETF s nejnižšími poplatky a nejvyšší výkonností.',
    filters: {
      minFundSize: 100,
    },
    sortBy: 'rating',
    sortOrder: 'desc',
    limit: 200,
  },
  'nejlepsi-akciove-etf': {
    slug: 'nejlepsi-akciove-etf',
    title: 'Nejlepší akciové ETF',
    description: 'Top akciové ETF fondy podle výkonnosti',
    metaDescription: 'Nejlepší akciové ETF fondy - srovnání nejvýkonnějších akciových ETF s nízkými poplatky.',
    filters: {
      category: 'Akcie',
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-dividendove-etf': {
    slug: 'nejlepsi-dividendove-etf',
    title: 'Nejlepší dividendové ETF',
    description: 'Top dividendové ETF fondy s pravidelným výnosem',
    metaDescription: 'Nejlepší dividendové ETF fondy - přehled ETF s nejvyššími dividendami a pravidelným výnosem.',
    filters: {
      category: 'Akcie',
      distribution_policy: 'Distributing',
      nameContains: ['Dividend', 'Income', 'High Yield'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-dluhopisove-etf': {
    slug: 'nejlepsi-dluhopisove-etf',
    title: 'Nejlepší dluhopisové ETF',
    description: 'Top dluhopisové ETF fondy pro stabilní výnosy',
    metaDescription: 'Nejlepší dluhopisové ETF fondy - srovnání bondových ETF pro konzervativní investory.',
    filters: {
      category: 'Dluhopisy',
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-komoditni-etf': {
    slug: 'nejlepsi-komoditni-etf',
    title: 'Nejlepší komoditní ETF',
    description: 'Top komoditní ETF fondy (zlato, stříbro, ropa)',
    metaDescription: 'Nejlepší komoditní ETF fondy - přehled ETF na zlato, stříbro, ropu a další komodity.',
    filters: {
      category: 'Komodity',
      minFundSize: 10,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-sp500-etf': {
    slug: 'nejlepsi-sp500-etf',
    title: 'Nejlepší S&P 500 ETF',
    description: 'Top ETF fondy sledující index S&P 500',
    metaDescription: 'Nejlepší S&P 500 ETF fondy - srovnání ETF sledujících americký akciový index S&P 500.',
    filters: {
      category: 'Akcie',
      nameContains: ['S&P 500', 'S&P500', 'SP500'],
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-msci-world-etf': {
    slug: 'nejlepsi-msci-world-etf',
    title: 'Nejlepší MSCI World ETF',
    description: 'Top ETF fondy sledující index MSCI World',
    metaDescription: 'Nejlepší MSCI World ETF fondy - globální diverzifikované ETF pro dlouhodobé investování.',
    filters: {
      category: 'Akcie',
      nameContains: ['MSCI World', 'World'],
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-technologicke-etf': {
    slug: 'nejlepsi-technologicke-etf',
    title: 'Nejlepší technologické ETF',
    description: 'Top technologické ETF fondy (IT, Nasdaq)',
    metaDescription: 'Nejlepší technologické ETF fondy - přehled ETF na IT sektor, Nasdaq a tech společnosti.',
    filters: {
      category: 'Akcie',
      nameContains: ['Technology', 'Tech', 'Nasdaq', 'Information', 'Digital', 'AI', 'Cloud', 'Semiconductor'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-healthcare-etf': {
    slug: 'nejlepsi-healthcare-etf',
    title: 'Nejlepší healthcare ETF',
    description: 'Top zdravotnické ETF fondy',
    metaDescription: 'Nejlepší healthcare ETF fondy - přehled ETF na zdravotnictví a farmaceutický sektor.',
    filters: {
      category: 'Akcie',
      nameContains: ['Health', 'Healthcare', 'Medical', 'Pharma', 'Biotech'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-realitni-etf': {
    slug: 'nejlepsi-realitni-etf',
    title: 'Nejlepší realitní ETF',
    description: 'Top realitní ETF fondy (REITs)',
    metaDescription: 'Nejlepší realitní ETF fondy - přehled REITs ETF pro investice do nemovitostí.',
    filters: {
      category: 'Nemovitosti',
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-emerging-markets-etf': {
    slug: 'nejlepsi-emerging-markets-etf',
    title: 'Nejlepší Emerging Markets ETF',
    description: 'Top ETF fondy na rozvíjející se trhy',
    metaDescription: 'Nejlepší Emerging Markets ETF fondy - přehled ETF na rozvíjející se trhy a ekonomiky.',
    filters: {
      category: 'Akcie',
      nameContains: ['Emerging', 'EM ', 'MSCI EM'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-evropske-etf': {
    slug: 'nejlepsi-evropske-etf',
    title: 'Nejlepší evropské ETF',
    description: 'Top ETF fondy na evropské akcie',
    metaDescription: 'Nejlepší evropské ETF fondy - přehled ETF na evropské akciové trhy.',
    filters: {
      category: 'Akcie',
      nameContains: ['Europe', 'Euro', 'STOXX', 'DAX', 'CAC', 'European'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-bitcoin-etf': {
    slug: 'nejlepsi-bitcoin-etf',
    title: 'Nejlepší Bitcoin ETF',
    description: 'Top Bitcoin a krypto ETF fondy',
    metaDescription: 'Nejlepší Bitcoin ETF fondy - přehled ETF a ETP na Bitcoin a kryptoměny.',
    filters: {
      categories: ['Krypto', 'Komodity'],
      nameContains: ['Bitcoin', 'BTC', 'Crypto', 'Blockchain'],
      minFundSize: 10,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-zlato-etf': {
    slug: 'nejlepsi-zlato-etf',
    title: 'Nejlepší zlato ETF',
    description: 'Top ETF fondy na zlato',
    metaDescription: 'Nejlepší zlato ETF fondy - přehled ETF a ETC na fyzické zlato.',
    filters: {
      category: 'Komodity',
      nameContains: ['Gold', 'Zlato'],
      minFundSize: 10,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-esg-etf': {
    slug: 'nejlepsi-esg-etf',
    title: 'Nejlepší ESG ETF',
    description: 'Top udržitelné a ESG ETF fondy',
    metaDescription: 'Nejlepší ESG ETF fondy - přehled udržitelných ETF s ESG kritérii.',
    filters: {
      nameContains: ['ESG', 'SRI', 'Sustainable', 'Green', 'Clean', 'Climate'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-akumulacni-etf': {
    slug: 'nejlepsi-akumulacni-etf',
    title: 'Nejlepší akumulační ETF',
    description: 'Top akumulační ETF fondy (ACC)',
    metaDescription: 'Nejlepší akumulační ETF fondy - přehled ETF s automatickým reinvestováním dividend.',
    filters: {
      distribution_policy: 'Accumulating',
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-distribucni-etf': {
    slug: 'nejlepsi-distribucni-etf',
    title: 'Nejlepší distribuční ETF',
    description: 'Top distribuční ETF fondy s výplatou dividend',
    metaDescription: 'Nejlepší distribuční ETF fondy - přehled ETF s pravidelnou výplatou dividend.',
    filters: {
      distribution_policy: 'Distributing',
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-globalni-etf': {
    slug: 'nejlepsi-globalni-etf',
    title: 'Nejlepší globální ETF',
    description: 'Top globální diverzifikované ETF fondy',
    metaDescription: 'Nejlepší globální ETF fondy - přehled celosvětově diverzifikovaných ETF.',
    filters: {
      category: 'Akcie',
      nameContains: ['World', 'Global', 'All-World', 'ACWI', 'All Country'],
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-americke-etf': {
    slug: 'nejlepsi-americke-etf',
    title: 'Nejlepší americké ETF',
    description: 'Top ETF fondy na americké akcie',
    metaDescription: 'Nejlepší americké ETF fondy - přehled ETF na US akciový trh.',
    filters: {
      category: 'Akcie',
      nameContains: ['USA', 'US ', 'United States', 'America', 'S&P', 'Nasdaq', 'Dow Jones'],
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-japonske-etf': {
    slug: 'nejlepsi-japonske-etf',
    title: 'Nejlepší japonské ETF',
    description: 'Top ETF fondy na japonské akcie',
    metaDescription: 'Nejlepší japonské ETF fondy - přehled ETF na japonský akciový trh.',
    filters: {
      category: 'Akcie',
      nameContains: ['Japan', 'Nikkei', 'TOPIX'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-cinske-etf': {
    slug: 'nejlepsi-cinske-etf',
    title: 'Nejlepší čínské ETF',
    description: 'Top ETF fondy na čínské akcie',
    metaDescription: 'Nejlepší čínské ETF fondy - přehled ETF na čínský akciový trh.',
    filters: {
      category: 'Akcie',
      nameContains: ['China', 'Chinese', 'CSI', 'Hong Kong', 'Hang Seng'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-indicke-etf': {
    slug: 'nejlepsi-indicke-etf',
    title: 'Nejlepší indické ETF',
    description: 'Top ETF fondy na indické akcie',
    metaDescription: 'Nejlepší indické ETF fondy - přehled ETF na indický akciový trh.',
    filters: {
      category: 'Akcie',
      nameContains: ['India', 'Indian', 'Nifty', 'Sensex'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-small-cap-etf': {
    slug: 'nejlepsi-small-cap-etf',
    title: 'Nejlepší Small Cap ETF',
    description: 'Top ETF fondy na malé společnosti',
    metaDescription: 'Nejlepší Small Cap ETF fondy - přehled ETF na malé a střední společnosti.',
    filters: {
      category: 'Akcie',
      nameContains: ['Small', 'Small Cap', 'SmallCap', 'Russell 2000'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-value-etf': {
    slug: 'nejlepsi-value-etf',
    title: 'Nejlepší Value ETF',
    description: 'Top hodnotové ETF fondy',
    metaDescription: 'Nejlepší Value ETF fondy - přehled hodnotových ETF pro value investory.',
    filters: {
      category: 'Akcie',
      nameContains: ['Value'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-growth-etf': {
    slug: 'nejlepsi-growth-etf',
    title: 'Nejlepší Growth ETF',
    description: 'Top růstové ETF fondy',
    metaDescription: 'Nejlepší Growth ETF fondy - přehled růstových ETF pro growth investory.',
    filters: {
      category: 'Akcie',
      nameContains: ['Growth'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-financni-etf': {
    slug: 'nejlepsi-financni-etf',
    title: 'Nejlepší finanční ETF',
    description: 'Top ETF fondy na finanční sektor',
    metaDescription: 'Nejlepší finanční ETF fondy - přehled ETF na banky a finanční služby.',
    filters: {
      category: 'Akcie',
      nameContains: ['Financial', 'Finance', 'Bank', 'Insurance'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-energeticke-etf': {
    slug: 'nejlepsi-energeticke-etf',
    title: 'Nejlepší energetické ETF',
    description: 'Top ETF fondy na energetický sektor',
    metaDescription: 'Nejlepší energetické ETF fondy - přehled ETF na ropu, plyn a energie.',
    filters: {
      category: 'Akcie',
      nameContains: ['Energy', 'Oil', 'Gas', 'Energie'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-prumyslove-etf': {
    slug: 'nejlepsi-prumyslove-etf',
    title: 'Nejlepší průmyslové ETF',
    description: 'Top ETF fondy na průmyslový sektor',
    metaDescription: 'Nejlepší průmyslové ETF fondy - přehled ETF na průmyslové společnosti.',
    filters: {
      category: 'Akcie',
      nameContains: ['Industrial', 'Industry', 'Manufacturing'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-spotrebitelske-etf': {
    slug: 'nejlepsi-spotrebitelske-etf',
    title: 'Nejlepší spotřebitelské ETF',
    description: 'Top ETF fondy na spotřebitelský sektor',
    metaDescription: 'Nejlepší spotřebitelské ETF fondy - přehled ETF na spotřebitelské zboží.',
    filters: {
      category: 'Akcie',
      nameContains: ['Consumer', 'Retail', 'Discretionary', 'Staples'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-infrastrukturni-etf': {
    slug: 'nejlepsi-infrastrukturni-etf',
    title: 'Nejlepší infrastrukturní ETF',
    description: 'Top ETF fondy na infrastrukturu',
    metaDescription: 'Nejlepší infrastrukturní ETF fondy - přehled ETF na infrastrukturní projekty.',
    filters: {
      category: 'Akcie',
      nameContains: ['Infrastructure', 'Utilities'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-obnovitelne-zdroje-etf': {
    slug: 'nejlepsi-obnovitelne-zdroje-etf',
    title: 'Nejlepší ETF na obnovitelné zdroje',
    description: 'Top ETF fondy na obnovitelné zdroje energie',
    metaDescription: 'Nejlepší ETF na obnovitelné zdroje - přehled ETF na solární, větrnou a čistou energii.',
    filters: {
      nameContains: ['Clean Energy', 'Solar', 'Wind', 'Renewable', 'Green Energy'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-korporatni-dluhopisy-etf': {
    slug: 'nejlepsi-korporatni-dluhopisy-etf',
    title: 'Nejlepší ETF na korporátní dluhopisy',
    description: 'Top ETF fondy na firemní dluhopisy',
    metaDescription: 'Nejlepší ETF na korporátní dluhopisy - přehled ETF na firemní bondy.',
    filters: {
      category: 'Dluhopisy',
      nameContains: ['Corporate', 'Corp'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-vladni-dluhopisy-etf': {
    slug: 'nejlepsi-vladni-dluhopisy-etf',
    title: 'Nejlepší ETF na vládní dluhopisy',
    description: 'Top ETF fondy na státní dluhopisy',
    metaDescription: 'Nejlepší ETF na vládní dluhopisy - přehled ETF na státní bondy.',
    filters: {
      category: 'Dluhopisy',
      nameContains: ['Government', 'Treasury', 'Sovereign', 'Govt'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-high-yield-etf': {
    slug: 'nejlepsi-high-yield-etf',
    title: 'Nejlepší High Yield ETF',
    description: 'Top vysoce výnosové ETF fondy',
    metaDescription: 'Nejlepší High Yield ETF fondy - přehled ETF s vysokým výnosem.',
    filters: {
      nameContains: ['High Yield', 'HY ', 'Junk'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-stribro-etf': {
    slug: 'nejlepsi-stribro-etf',
    title: 'Nejlepší stříbro ETF',
    description: 'Top ETF fondy na stříbro',
    metaDescription: 'Nejlepší stříbro ETF fondy - přehled ETF a ETC na fyzické stříbro.',
    filters: {
      category: 'Komodity',
      nameContains: ['Silver', 'Stříbro'],
      minFundSize: 10,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-ropa-etf': {
    slug: 'nejlepsi-ropa-etf',
    title: 'Nejlepší ropa ETF',
    description: 'Top ETF fondy na ropu',
    metaDescription: 'Nejlepší ropa ETF fondy - přehled ETF a ETC na ropu a ropné produkty.',
    filters: {
      category: 'Komodity',
      nameContains: ['Oil', 'Crude', 'Petroleum', 'WTI', 'Brent'],
      minFundSize: 10,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'etf-zdarma-degiro': {
    slug: 'etf-zdarma-degiro',
    title: 'ETF zdarma na Degiro',
    description: 'Nejlepší ETF z nabídky Degiro bez poplatků',
    metaDescription: 'ETF zdarma na Degiro - přehled nejlepších ETF z bezplatné nabídky Degiro brokera.',
    filters: {
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-ai-etf': {
    slug: 'nejlepsi-ai-etf',
    title: 'Nejlepší AI ETF',
    description: 'Top ETF fondy na umělou inteligenci a big data',
    metaDescription: 'Nejlepší AI ETF fondy - přehled ETF na umělou inteligenci, machine learning a big data.',
    filters: {
      category: 'Akcie',
      nameContains: ['Artificial Intelligence', ' AI ', 'Machine Learning', 'Big Data', 'Robotics', 'Automation'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-asijsko-pacificke-etf': {
    slug: 'nejlepsi-asijsko-pacificke-etf',
    title: 'Nejlepší asijsko-pacifické ETF',
    description: 'Top ETF fondy na asijský a pacifický region',
    metaDescription: 'Nejlepší asijsko-pacifické ETF fondy - přehled ETF na asijské a pacifické trhy.',
    filters: {
      category: 'Akcie',
      nameContains: ['Asia Pacific', 'Asia-Pacific', 'APAC', 'Pacific'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-biotechnologie-etf': {
    slug: 'nejlepsi-biotechnologie-etf',
    title: 'Nejlepší biotechnologie ETF',
    description: 'Top ETF fondy na biotechnologie a genomiku',
    metaDescription: 'Nejlepší biotechnologie ETF fondy - přehled ETF na biotech sektor a genomiku.',
    filters: {
      category: 'Akcie',
      nameContains: ['Biotech', 'Biotechnology', 'Genomics', 'Life Sciences'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-celosvetove-etf': {
    slug: 'nejlepsi-celosvetove-etf',
    title: 'Nejlepší celosvětové ETF',
    description: 'Top globálně diverzifikované ETF fondy',
    metaDescription: 'Nejlepší celosvětové ETF fondy - přehled globálně diverzifikovaných ETF pro dlouhodobé investování.',
    filters: {
      category: 'Akcie',
      nameContains: ['World', 'Global', 'All-World', 'ACWI', 'All Country'],
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-clean-energy-etf': {
    slug: 'nejlepsi-clean-energy-etf',
    title: 'Nejlepší Clean Energy ETF',
    description: 'Top ETF fondy na čistou energii',
    metaDescription: 'Nejlepší Clean Energy ETF fondy - přehled ETF na obnovitelné zdroje a čistou energii.',
    filters: {
      category: 'Akcie',
      nameContains: ['Clean Energy', 'Renewable', 'Solar', 'Wind', 'Green Energy'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-cloud-etf': {
    slug: 'nejlepsi-cloud-etf',
    title: 'Nejlepší cloud ETF',
    description: 'Top ETF fondy na cloud computing',
    metaDescription: 'Nejlepší cloud ETF fondy - přehled ETF na cloud computing a SaaS společnosti.',
    filters: {
      category: 'Akcie',
      nameContains: ['Cloud', 'Computing', 'SaaS', 'Software'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-dax-etf': {
    slug: 'nejlepsi-dax-etf',
    title: 'Nejlepší DAX ETF',
    description: 'Top ETF fondy sledující německý index DAX',
    metaDescription: 'Nejlepší DAX ETF fondy - přehled ETF sledujících německý akciový index DAX.',
    filters: {
      category: 'Akcie',
      nameContains: ['DAX'],
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-defense-etf': {
    slug: 'nejlepsi-defense-etf',
    title: 'Nejlepší obranné ETF',
    description: 'Top ETF fondy na obranný průmysl',
    metaDescription: 'Nejlepší obranné ETF fondy - přehled ETF na zbrojní a obranný průmysl.',
    filters: {
      category: 'Akcie',
      nameContains: ['Defense', 'Defence', 'Aerospace', 'Military'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-ftse100-etf': {
    slug: 'nejlepsi-ftse100-etf',
    title: 'Nejlepší FTSE 100 ETF',
    description: 'Top ETF fondy sledující britský index FTSE 100',
    metaDescription: 'Nejlepší FTSE 100 ETF fondy - přehled ETF sledujících britský akciový index.',
    filters: {
      category: 'Akcie',
      nameContains: ['FTSE 100', 'FTSE100', 'FTSE-100'],
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-kyberbezpecnost-etf': {
    slug: 'nejlepsi-kyberbezpecnost-etf',
    title: 'Nejlepší kyberbezpečnost ETF',
    description: 'Top ETF fondy na kybernetickou bezpečnost',
    metaDescription: 'Nejlepší kyberbezpečnost ETF fondy - přehled ETF na cybersecurity sektor.',
    filters: {
      category: 'Akcie',
      nameContains: ['Cyber', 'Cybersecurity', 'Security', 'Cyber Security'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-nasdaq-etf': {
    slug: 'nejlepsi-nasdaq-etf',
    title: 'Nejlepší NASDAQ ETF',
    description: 'Top ETF fondy sledující index NASDAQ',
    metaDescription: 'Nejlepší NASDAQ ETF fondy - přehled ETF sledujících americký technologický index NASDAQ.',
    filters: {
      category: 'Akcie',
      nameContains: ['Nasdaq', 'NASDAQ', 'Nasdaq-100', 'NDX'],
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-nemovitostni-etf': {
    slug: 'nejlepsi-nemovitostni-etf',
    title: 'Nejlepší nemovitostní ETF',
    description: 'Top nemovitostní ETF fondy (REITs)',
    metaDescription: 'Nejlepší nemovitostní ETF fondy - přehled REITs ETF pro investice do nemovitostí.',
    filters: {
      category: 'Nemovitosti',
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-robotika-etf': {
    slug: 'nejlepsi-robotika-etf',
    title: 'Nejlepší robotika ETF',
    description: 'Top ETF fondy na robotiku a automatizaci',
    metaDescription: 'Nejlepší robotika ETF fondy - přehled ETF na robotiku, automatizaci a průmysl 4.0.',
    filters: {
      category: 'Akcie',
      nameContains: ['Robotics', 'Robot', 'Automation'],
      minFundSize: 50,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-stoxx600-etf': {
    slug: 'nejlepsi-stoxx600-etf',
    title: 'Nejlepší STOXX 600 ETF',
    description: 'Top ETF fondy sledující evropský index STOXX 600',
    metaDescription: 'Nejlepší STOXX 600 ETF fondy - přehled ETF sledujících evropský akciový index.',
    filters: {
      category: 'Akcie',
      nameContains: ['STOXX 600', 'STOXX600', 'Europe 600'],
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlepsi-zlate-etf': {
    slug: 'nejlepsi-zlate-etf',
    title: 'Nejlepší zlaté ETF',
    description: 'Top ETF fondy na zlato',
    metaDescription: 'Nejlepší zlaté ETF fondy - přehled ETF a ETC na fyzické zlato.',
    filters: {
      category: 'Komodity',
      nameContains: ['Gold', 'Zlato'],
      minFundSize: 10,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
  },
  'nejlevnejsi-etf': {
    slug: 'nejlevnejsi-etf',
    title: 'Nejlevnější ETF',
    description: 'ETF fondy s nejnižším TER',
    metaDescription: 'Nejlevnější ETF fondy - přehled ETF s nejnižšími náklady a poplatky (TER).',
    filters: {
      minFundSize: 100,
      minTer: 0,
    },
    sortBy: 'ter_numeric',
    sortOrder: 'asc',
    limit: 50,
  },
};

/**
 * Get all category slugs for generateStaticParams
 */
export function getAllCategorySlugs(): string[] {
  return Object.keys(categoryConfigs);
}
