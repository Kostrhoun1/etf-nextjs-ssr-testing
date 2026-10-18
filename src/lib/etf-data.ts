/**
 * Server-side data fetching functions for ETF pages
 * These functions are used for SSG/ISR to pre-render pages with data
 */
import { cache as reactCache } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/lib/supabase-config';
import { classifyRegion, buildRegionOptions } from '@/utils/regionClassification';
import { canonicalIndexLabel, buildIndexOptions, type IndexOptionGroup } from '@/utils/indexNormalization';
import { distKind, type DistKind } from '@/utils/distribution';
import { detectHedging } from '@/utils/hedgingDetection';
import { calculateETFRating } from '@/utils/etfRating';
import type { ETFListItem } from '@/types/etf';

// Direct Supabase client for build-time data fetching (SSG/ISR).
// Jen veřejný klíč – proč, viz src/lib/supabase-config.ts.
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

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
  scraping_date?: string | null;
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
  fund_currency: string | null;
  index_name: string | null;
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
    /** Názvy, které se z výsledku VYŘADÍ (AND, case-insensitive).
     *  Bez toho spadne „MSCI World Semiconductors" do kategorie „Celý svět" jen proto,
     *  že má v názvu „World" – `nameContains` je totiž prostá shoda podřetězce. */
    nameExcludes?: string[];
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
  fund_domicile,
  fund_currency,
  index_name,
  scraping_date
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

    // Vyřazení sektorových/faktorových fondů ze širokých kategorií (AND přes všechny termy).
    if (config.filters.nameExcludes && config.filters.nameExcludes.length > 0) {
      for (const term of config.filters.nameExcludes) {
        query = query.not('name', 'ilike', `%${term}%`);
      }
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

    // Pojistky správnosti (audit dat 17. 10. 2026):
    // - pákové a inverzní produkty do žebříčků nepatří (vyhrávaly „Nejvyšší výnos": WTI 2x +272 %);
    // - fond bez názvu je rozbitý řádek ze scraperu;
    // - fond se zamrzlými daty (scraper ho 14+ dní neaktualizoval) by ukazoval staré výnosy
    //   jako dnešní (VUAA: YTD +5 % místo +18,5 %). Měří se scraping_date, NE updated_at –
    //   ten přepisoval i upsert starých dat.
    query = query.not('is_leveraged', 'is', true);
    query = query.not('name', 'is', null);
    query = query.gte('scraping_date', cerstveOd());

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

/** Sektorové/faktorové/pákové fondy – podle názvu. Mají v DB občas chybně index „S&P 500" /
 *  „MSCI World" (audit 17. 10. 2026), takže je nesmíme brát jako „stejný index". */
export const SPECIFICKY_FOND = /\b(sector|energy|financials?|information technology|technology|health ?care|utilities|industrials?|materials|consumer|communication|real estate|equal weight|value|growth|momentum|quality|min(imum)? vol|dividend|esg|sri|paris|climate|ex[- ]|small ?cap|mid ?cap|leveraged|short|inverse|\dx)\b/i;

export interface PodobnyFond { isin: string; name: string; primary_ticker: string | null; ter_numeric: number | null; fund_size_numeric: number | null; return_1y_czk: number | null }

/**
 * Podobné fondy pro „Kam dál" na detailu: STEJNÝ index (přesná shoda index_name), bez pákových,
 * bez fondů se zamrzlými daty, seřazené podle velikosti. Dřív detail radil napevno „postavte
 * tento fond proti VUAA" i zlatému ETC (deep dive 17. 10. 2026).
 */
export async function getPodobneFondy(indexName: string | null, isin: string, nazev: string): Promise<PodobnyFond[]> {
  if (!indexName || !indexName.trim() || SPECIFICKY_FOND.test(nazev)) return [];
  try {
    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select('isin, name, primary_ticker, ter_numeric, fund_size_numeric, return_1y_czk')
      .eq('index_name', indexName)
      .neq('isin', isin)
      .not('is_leveraged', 'is', true)
      .not('name', 'is', null)
      .gte('scraping_date', cerstveOd())
      .not('fund_size_numeric', 'is', null)
      .order('fund_size_numeric', { ascending: false })
      .limit(8);
    if (error || !data) return [];
    // Bez sektorových „S&P 500 Energy…" s chybně přiřazeným indexem.
    return (data as PodobnyFond[]).filter((f) => !SPECIFICKY_FOND.test(f.name)).slice(0, 4);
  } catch {
    return [];
  }
}

/* ---------- Složení vlajkového fondu (pro infografiku kategorie) ---------- */

export interface CompositionSlice {
  name: string;
  weight: number;
}

export interface FlagshipComposition {
  isin: string;
  name: string;
  totalHoldings: number | null;
  countries: CompositionSlice[];
  sectors: CompositionSlice[];
  holdings: CompositionSlice[];
}

const COMPOSITION_FIELDS = `
  isin, name, total_holdings,
  country_1_name, country_1_weight, country_2_name, country_2_weight,
  country_3_name, country_3_weight, country_4_name, country_4_weight, country_5_name, country_5_weight,
  sector_1_name, sector_1_weight, sector_2_name, sector_2_weight,
  sector_3_name, sector_3_weight, sector_4_name, sector_4_weight, sector_5_name, sector_5_weight,
  holding_1_name, holding_1_weight, holding_2_name, holding_2_weight, holding_3_name, holding_3_weight,
  holding_4_name, holding_4_weight, holding_5_name, holding_5_weight, holding_6_name, holding_6_weight,
  holding_7_name, holding_7_weight, holding_8_name, holding_8_weight, holding_9_name, holding_9_weight,
  holding_10_name, holding_10_weight
`;

/**
 * Vytáhne z řady polí name/weight (číslované 1..n) čisté segmenty:
 * vynechá prázdné názvy a nulové/neplatné váhy. Data v etf_funds jsou
 * „špinavá" – komoditní/zlaté ETC mají prázdné řetězce a váhu „0".
 */
function extractSlices(
  row: Record<string, unknown>,
  prefix: string,
  count: number,
): CompositionSlice[] {
  const out: CompositionSlice[] = [];
  for (let i = 1; i <= count; i++) {
    const rawName = row[`${prefix}_${i}_name`];
    const rawWeight = row[`${prefix}_${i}_weight`];
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    const weight = rawWeight != null ? Number(rawWeight) : NaN;
    if (!name || !Number.isFinite(weight) || weight <= 0) continue;
    out.push({ name, weight });
  }
  return out;
}

/**
 * Načte složení jednoho (vlajkového) fondu pro infografiku kategorie.
 * Vrací země, sektory a top pozice; každou dimenzi zvlášť, ať si šablona
 * vybere tu nejvýstižnější podle typu kategorie a dostupnosti dat.
 */
export async function getFlagshipComposition(isin: string): Promise<FlagshipComposition | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select(COMPOSITION_FIELDS)
      .eq('isin', isin)
      .limit(1)
      .single();
    if (error || !data) return null;
    const row = data as Record<string, unknown>;
    return {
      isin,
      name: (row.name as string) ?? '',
      totalHoldings: row.total_holdings != null ? Number(row.total_holdings) : null,
      countries: extractSlices(row, 'country', 5),
      sectors: extractSlices(row, 'sector', 5),
      holdings: extractSlices(row, 'holding', 10),
    };
  } catch (e) {
    console.error('Error in getFlagshipComposition:', e);
    return null;
  }
}

/**
 * Jeden fond na téma: „nejvýkonnější“ jinak ovládne pět fondů na stejný index (18. 10. 2026:
 * 5× MSCI Korea od různých emitentů) – pro srovnávač to je šum, ne informace. Téma = poslední
 * významné slovo názvu před „UCITS“ (Korea, Taiwan, Semiconductor, Energy…); index_name je
 * v datech nespolehlivý. Pořadí zůstává, bere se první (nejvýkonnější) fond tématu.
 */
const BEZ_VYZNAMU = new Set(['sector', 'sect', 'select', 'capped', 'index', 'etf', 'screened', 'swap', 'singlclass',
  '1c', '1d', 'acc', 'dist', 'usd', 'eur', 'c', 'd', 'ii', 'shares']);
export function temaFondu(name: string | null | undefined): string {
  const pred = (name ?? '').split(/\bUCITS\b/i)[0].replace(/\(.*?\)/g, ' ').toLowerCase();
  const slova = pred.split(/[^a-z0-9&-]+/).filter((w) => w && !BEZ_VYZNAMU.has(w));
  return (slova[slova.length - 1] ?? pred).replace(/s$/, '');
}
export function jedenNaTema<T extends { name?: string | null }>(fondy: T[]): T[] {
  const videno = new Set<string>();
  return fondy.filter((f) => {
    const t = temaFondu(f.name);
    if (videno.has(t)) return false;
    videno.add(t);
    return true;
  });
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
      .gte('scraping_date', cerstveOd())
      .order('fund_size_numeric', { ascending: false })
      .limit(20);

    // Fetch top by 1Y performance – V KORUNÁCH a jen AKCIOVÉ fondy (audit 17. 10. 2026: panel
    // ukazoval výnos v měně fondu a vedly ho komoditní ETC – zemní plyn +194 %, stříbro –
    // hned nad blokem „Kterým ETF začít"; navíc fondy se zamrzlými daty z dubna).
    const byPerformancePromise = supabaseAdmin
      .from('etf_funds')
      .select(ETF_SELECT_FIELDS)
      .eq('category', 'Akcie')
      .not('name', 'is', null)
      .gte('scraping_date', cerstveOd())
      .not('return_1y_czk', 'is', null)
      .not('fund_size_numeric', 'is', null)
      .gte('fund_size_numeric', 50)
      // Vyloučit páková ETP – jinak žebříček "nejvýkonnější" ovládnou produkty
      // s +200 % (násobná expozice), což pro běžného investora není relevantní.
      // Pozn.: vysoké 1Y výnosy nepákových fondů (např. MSCI Korea ~+210 %) jsou
      // REÁLNÉ (korejský chip-supercyklus 2025–2026, ověřeno proti justETF) – NEfiltrovat.
      .not('is_leveraged', 'is', true)
      .order('return_1y_czk', { ascending: false })
      .limit(120); // víc kandidátů → po sloučení podle tématu (jedenNaTema) zbyde dost různých

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
      .gte('scraping_date', cerstveOd())
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
      byPerformance: jedenNaTema((byPerformanceResult.data || []) as ETFBasicInfo[]).slice(0, 20),
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

/* Reálné datum poslední aktualizace dat (MAX scraping_date) – data se počítají denně,
   takže zobrazujeme skutečné čerstvé datum, ne 1. v měsíci (web musí působit up‑to‑date).
   Cacheováno pro celý render (dedup napříč generateMetadata + komponentou). */
const _dataDate = reactCache(async (): Promise<Date | null> => {
  const iso = await getLastModifiedDate();
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
});

/** Vrátí datum posledních dat; když se nepodaří načíst, použije `fallback` (zpravidla dnešek). */
export async function getDataDate(fallback: Date): Promise<Date> {
  return (await _dataDate()) ?? fallback;
}

/**
 * Get last modified date from database
 */
export async function getLastModifiedDate(): Promise<string | null> {
  try {
    // scraping_date = kdy scraper data fondu opravdu stáhl. updated_at to NEní: do 17. 10. 2026
    // ho přepisoval i upsert starých dat z checkpointů (dubnová data hlásila „dnes").
    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select('scraping_date')
      .not('scraping_date', 'is', null)
      .order('scraping_date', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return data.scraping_date;
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
    // Počítá jen fondy, které web opravdu ukazuje (stejná pravidla jako srovnávač): s názvem
    // a s daty mladšími 30 dní. Dřív se počítaly všechny řádky tabulky → titulek srovnávače
    // hlásil 5 146 fondů, zatímco srovnávač jich ukazoval méně (pravidlo č. 1).
    const { count, error } = await supabaseAdmin
      .from('etf_funds')
      .select('*', { count: 'exact', head: true })
      .not('name', 'is', null)
      .neq('name', '')
      .gte('scraping_date', new Date(Date.now() - 30 * 864e5).toISOString());

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
 * Počet fondů do textu a titulků: zaokrouhleno DOLŮ na stovky („5 100+"), aby text zůstal
 * pravdivý a titulek se neměnil každý den. Dřív bylo „4 800+" a „4 300+" napevno v kódu.
 */
export async function getETFCountLabel(): Promise<string> {
  const n = await getTotalETFCount();
  const zaokrouhleno = n > 0 ? Math.floor(n / 100) * 100 : 4800;
  return `${zaokrouhleno.toLocaleString('cs-CZ')}+`;
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
  /** Roční poplatek fondu. Bez něj nešlo u modelových portfolií spočítat, kolik
   *  strategie ročně stojí – přitom je to první otázka, kterou si čtenář položí. */
  ter_numeric: number | null;
  name: string | null;
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
      .select('isin, ter_numeric, name, return_1y_czk, return_3y_czk, volatility_1y, max_drawdown_1y, max_drawdown_inception')
      .in('isin', isins);
    if (error || !data) return {};
    const num = (v: unknown) => (v != null ? Number(v) : null);
    const map: Record<string, IsinMetrics> = {};
    for (const row of data as Array<Record<string, unknown>>) {
      map[row.isin as string] = {
        ter_numeric: num(row.ter_numeric),
        name: (row.name as string) ?? null,
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
        const v = top?.return_1y_czk ?? null; // nikdy EUR místo Kč
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
  return_1y_usd: number | null;
  return_3y_usd: number | null;
  return_5y_usd: number | null;
  return_ytd_usd: number | null;
  volatility_1y: number | null;
  max_drawdown_1y: number | null;
  current_dividend_yield_numeric: number | null;
  distribution_policy: string | null;
  distribution_frequency?: string | null;
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

/** Burzy fondu (pro odpověď „stejný fond, jiný ticker" – kde a v jaké měně se obchoduje). */
const COMPARISON_LISTING_FIELDS = Array.from({ length: 10 }, (_, i) => [`exchange_${i + 1}_name`, `exchange_${i + 1}_currency`]).flat();

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
    // Symbol = ticker NEBO ISIN (lidé hledají i „ie00b5bmr087 vs ie00bfmxxd54" – našeptávač
    // Googlu 17. 10. 2026). Hodnoty jsou už ověřené ([a-z0-9]{1,12}) v middleware i parsePair.
    const jeIsin = (x: string) => /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(x.toUpperCase());
    const orConditions = [ticker1, ticker2]
      .map(symbol => jeIsin(symbol)
        ? `isin.eq.${symbol.toUpperCase()}`
        : COMPARISON_TICKER_FIELDS.map(field => `${field}.eq.${symbol}`).join(','))
      .join(',');

    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select(`
        isin, name, fund_provider, primary_ticker,
        ter_numeric, fund_size_numeric,
        return_1y, return_3y, return_5y, return_ytd,
        return_1y_czk, return_3y_czk, return_5y_czk, return_ytd_czk,
        return_1y_usd, return_3y_usd, return_5y_usd, return_ytd_usd,
        volatility_1y, max_drawdown_1y,
        current_dividend_yield_numeric,
        distribution_policy, distribution_frequency, replication, index_name, region,
        fund_currency, fund_domicile, total_holdings, inception_date,
        is_leveraged, category,
        ${COMPARISON_TICKER_FIELDS.join(', ')},
        ${COMPARISON_LISTING_FIELDS.join(', ')}
      `)
      .or(orConditions);

    if (error || !data || data.length < 1) {
      return null;
    }

    const matches = (etf: Record<string, unknown>, ticker: string) =>
      jeIsin(ticker)
        ? String(etf.isin) === ticker.toUpperCase()
        : COMPARISON_TICKER_FIELDS.some(f => (etf[f] as string)?.toUpperCase() === ticker.toUpperCase());

    // Stejný ticker může mít víc fondů na různých burzách (SPYI = SPDR MSCI ACWI IMI na XETRA,
    // ale i opční S&P 500 fond HANetf na LSE – /srovnani/vwce-vs-spyi ukazoval ten 1milionový,
    // test s uživatelem 18. 10. 2026). Pořadí z DB je náhodné → vybrat: hlavní ticker fondu >
    // ticker na XETRA > ostatní burzy; při shodě větší fond.
    const skore = (etf: Record<string, unknown>, ticker: string) => {
      const t = ticker.toUpperCase();
      if (String(etf.primary_ticker ?? '').toUpperCase() === t) return 3;
      for (let i = 1; i <= 10; i++) {
        if (String(etf[`exchange_${i}_ticker`] ?? '').toUpperCase() === t && /xetra/i.test(String(etf[`exchange_${i}_name`] ?? ''))) return 2;
      }
      return 1;
    };
    const radky = data as unknown as Record<string, unknown>[];
    const nejlepsi = (ticker: string) => radky
      .filter(e => matches(e, ticker))
      .sort((a, b) => skore(b, ticker) - skore(a, ticker) || Number(b.fund_size_numeric ?? 0) - Number(a.fund_size_numeric ?? 0))[0];
    const etf1 = nejlepsi(ticker1) as unknown as ComparisonETF | undefined;
    const etf2 = nejlepsi(ticker2) as unknown as ComparisonETF | undefined;

    // Stejný ISIN (CSPX vs SXR8) se NEodmítá: je to častý dotaz „je to stejný fond?" a stránka
    // na něj odpoví (dřív 404).
    if (!etf1 || !etf2) {
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
    // Načteme VŠECHNA pole (jen ≤4 řádky) – porovnání má ukázat maximum toho,
    // co o fondech víme: top pozice, sektory, země, riziko, všechna období.
    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select('*')
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
  exchange_6_ticker: string | null;
  exchange_7_ticker: string | null;
  exchange_8_ticker: string | null;
  exchange_9_ticker: string | null;
  exchange_10_ticker: string | null;
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
  return_1y_usd: number | null;
  return_3y_usd: number | null;
  return_5y_usd: number | null;
  return_ytd_usd: number | null;
  volatility_1y: number | null;
  current_dividend_yield_numeric: number | null;
  distribution_policy: string | null;
  distribution_frequency: string | null;
  scraping_date: string | null;
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
  fund_domicile: string | null;
}

const SCREENER_COLUMNS = `
  isin, name, fund_provider, primary_ticker,
  exchange_1_ticker, exchange_2_ticker, exchange_3_ticker, exchange_4_ticker, exchange_5_ticker,
  exchange_6_ticker, exchange_7_ticker, exchange_8_ticker, exchange_9_ticker, exchange_10_ticker,
  ter_numeric, fund_size_numeric,
  return_ytd, return_1y, return_3y, return_5y,
  return_1y_czk, return_3y_czk, return_5y_czk, return_ytd_czk,
  return_1y_usd, return_3y_usd, return_5y_usd, return_ytd_usd,
  volatility_1y, current_dividend_yield_numeric,
  distribution_policy, distribution_frequency, replication, index_name, region, investment_focus,
  fund_currency, currency_risk, category, is_leveraged, rating, inception_date, fund_domicile, scraping_date
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

/* ------------------------------------------------------------------------- *
 * Screener v2 – KOMPAKTNÍ + PŘEDPOČÍTANÝ řádek pro rychlé načtení srovnávače.
 *
 * Původně stránka /srovnani vkládala do HTML všech ~4900 fondů se 40 sloupci
 * (6 MB HTML → FCP 4,5 s na mobilu) a klient pak přes všech 4900 řádků pouštěl
 * regexy (region/zajištění/index/rating/fulltext) → TBT 730 ms.
 *
 * Řešení: odvozená pole počítáme JEDNOU na serveru (níže), payload zeštíhlíme
 * (bez 10 duplicitních tickerů a nepoužitých polí) a stránka vloží jen prvních
 * ~50 řádků; zbytek databáze si klient dotáhne z /api/etf/screener (cachované).
 * Filtrování tak zůstává nad CELOU databází, jen se zpřístupní ~1 s po vykreslení.
 * ------------------------------------------------------------------------- */
export interface ScreenerRow {
  isin: string;
  name: string;
  primary_ticker: string | null;
  ter_numeric: number | null;
  fund_size_numeric: number | null;
  fund_currency: string | null;
  is_leveraged: boolean | null;
  category: string | null;
  current_dividend_yield_numeric: number | null;
  // Výnosy: EUR (báze, bez přípony) + CZK + USD, období ytd/1r/3r (5r se v UI nepoužívá).
  return_ytd: number | null; return_ytd_czk: number | null; return_ytd_usd: number | null;
  return_1y: number | null; return_1y_czk: number | null; return_1y_usd: number | null;
  return_3y: number | null; return_3y_czk: number | null; return_3y_usd: number | null;
  return_5y: number | null; return_5y_czk: number | null; return_5y_usd: number | null; // jen pro export CSV
  volatility_1y: number | null;
  fund_provider: string | null;
  // Předpočítaná odvozená pole (dřív se počítala na klientu přes všech ~4900 fondů).
  _region: string | null;
  _hedge: string;   // hedgingType
  _index: string;   // kanonický label indexu
  _rating: number | null;
  _repl: string;    // 'Fyzická' | 'Syntetická' | '—'
  _dist: DistKind;  // typ výplaty – stejná logika jako detail fondu (src/utils/distribution.ts)
  _tickers: string[]; // všechny tickery lowercase (pro relevanci hledání)
  _dom: string | null;   // domicil už počeštěný (je zároveň hodnotou filtru)
  /** Rok vzniku fondu. `inception_date` je v DB anglický TEXT („8 April 2011"), takže
   *  se podle něj nedalo řadit. Parsujeme jednou na serveru a posíláme číslo. */
  _year: number | null;
}

/** Zaokrouhlení pro payload srovnávače (null zůstává null). */
const r1 = (v: number | null | undefined) => (v == null ? null : Math.round(Number(v) * 10) / 10);
const r2 = (v: number | null | undefined) => (v == null ? null : Math.round(Number(v) * 100) / 100);

export interface ScreenerOptions {
  domiciles: string[];
  providers: string[];
  regions: string[];
  indexGroups: IndexOptionGroup[];
  currencies: string[];
  replications: string[];
  categories: string[];
  catCounts: [string, number][]; // serializovatelná náhrada Map
}

/** Popisek replikace – shodně s klientem (ScreenerUI). */
function replLabelSrv(r: string | null): string {
  const s = (r || '').toLowerCase();
  if (s.includes('synth') || s.includes('swap')) return 'Syntetická';
  if (s.includes('physical') || s.includes('full') || s.includes('sampl') || s.includes('optim')) return 'Fyzická';
  return r || '—';
}

/** Počeštěný domicil. Hodnota slouží zároveň jako hodnota filtru, ať se nemusí
 *  překládat na dvou místech. */
const DOM_CS: Record<string, string> = {
  Ireland: 'Irsko', Luxembourg: 'Lucembursko', Germany: 'Německo', France: 'Francie',
  Jersey: 'Jersey', Netherlands: 'Nizozemsko', Switzerland: 'Švýcarsko',
  'United Kingdom': 'Spojené království', Liechtenstein: 'Lichtenštejnsko',
  Bulgaria: 'Bulharsko', Austria: 'Rakousko', Sweden: 'Švédsko', Italy: 'Itálie', Spain: 'Španělsko',
};
function domLabelSrv(d: string | null): string | null {
  if (!d) return null;
  return DOM_CS[d] ?? d;
}

/** Rok vzniku z textového `inception_date` („8 April 2011"). Vrací null, když se
 *  datum nepodaří přečíst – radši prázdno než smyšlený rok. */
function inceptionYear(v: string | null): number | null {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  return y >= 1970 && y <= new Date().getFullYear() + 1 ? y : null;
}

const CATEGORY_ORDER = ['Akcie', 'Dluhopisy', 'Nemovitosti', 'Komodity', 'Krypto'];

/**
 * Načte celý screener JAKO kompaktní předpočítané řádky + volby filtrů + počet.
 * React-cache: v rámci jednoho requestu se Supabase nedotazuje dvakrát
 * (stránka i případný interní odkaz sdílí výsledek). Napříč requesty drží ISR.
 */
export const getScreenerRows = reactCache(async (): Promise<{
  rows: ScreenerRow[];
  options: ScreenerOptions;
  total: number;
}> => {
  // Fondy bez názvu jsou rozbité řádky ze scraperu (12 k 17. 10. 2026) – do srovnávače nepatří.
  // Fondy se zamrzlými daty (scraper je 30+ dní neaktualizoval – typicky už nejsou v nabídce)
  // by ukazovaly staré výnosy jako dnešní; detail fondu zůstává dostupný s varováním.
  const zamrzleOd = Date.now() - 30 * 864e5;
  const raw = (await getScreenerETFData()).filter((e) =>
    e.name && e.name.trim() !== '' && (!e.scraping_date || new Date(e.scraping_date).getTime() >= zamrzleOd));

  const rows: ScreenerRow[] = raw.map((e) => {
    const tickers = [
      e.primary_ticker,
      e.exchange_1_ticker, e.exchange_2_ticker, e.exchange_3_ticker, e.exchange_4_ticker, e.exchange_5_ticker,
      e.exchange_6_ticker, e.exchange_7_ticker, e.exchange_8_ticker, e.exchange_9_ticker, e.exchange_10_ticker,
    ]
      .map((t) => (t ?? '').trim().toLowerCase())
      .filter((t) => t && t !== '-');
    const uniqTickers = [...new Set(tickers)];
    return {
      isin: e.isin,
      name: e.name,
      primary_ticker: e.primary_ticker,
      // TER 0 % je skutečnost jen u zlatých ETC a krypto ETP (poplatek je v ceně/stakingu). U akcií
      // a dluhopisů je to chyba v datech (18. 10. 2026: T. Rowe Price 0,00 % → nahoře řazení podle TER).
      ter_numeric: Number(e.ter_numeric) === 0 && (e.category === 'Akcie' || e.category === 'Dluhopisy') ? null : e.ter_numeric,
      fund_size_numeric: r1(e.fund_size_numeric),
      fund_currency: e.fund_currency,
      is_leveraged: e.is_leveraged,
      category: e.category,
      // Zaokrouhleno na přesnost, jakou srovnávač zobrazuje (dřív 4 desetinná místa → 4,3 MB
      // nezkomprimovaného JSONu, LCP /srovnani na mobilu 6,8 s; audit 17. 10. 2026).
      current_dividend_yield_numeric: r2(e.current_dividend_yield_numeric),
      return_ytd: r1(e.return_ytd), return_ytd_czk: r1(e.return_ytd_czk), return_ytd_usd: r1(e.return_ytd_usd),
      return_1y: r1(e.return_1y), return_1y_czk: r1(e.return_1y_czk), return_1y_usd: r1(e.return_1y_usd),
      return_3y: r1(e.return_3y), return_3y_czk: r1(e.return_3y_czk), return_3y_usd: r1(e.return_3y_usd),
      return_5y: r1(e.return_5y), return_5y_czk: r1(e.return_5y_czk), return_5y_usd: r1(e.return_5y_usd),
      volatility_1y: r1(e.volatility_1y),
      fund_provider: e.fund_provider,
      _dom: domLabelSrv(e.fund_domicile),
      _year: inceptionYear(e.inception_date),
      _region: classifyRegion(e),
      _hedge: detectHedging(e.name, e.currency_risk ?? undefined).hedgingType,
      _index: canonicalIndexLabel(e.index_name),
      _rating: e.rating ?? calculateETFRating(e as unknown as ETFListItem)?.rating ?? null,
      _repl: replLabelSrv(e.replication),
      _dist: distKind(e.distribution_policy, e.distribution_frequency),
      _tickers: uniqTickers,
    };
  });

  // Volby filtrů – z RAW dat (utils čtou původní pole index_name/region).
  const present = [...new Set(raw.map((e) => e.category).filter((c): c is string => !!c && c !== 'Ostatní'))];
  const ordered = CATEGORY_ORDER.filter((c) => present.includes(c));
  const extra = present.filter((c) => !CATEGORY_ORDER.includes(c)).sort((a, b) => a.localeCompare(b));
  const categories = [...ordered, ...extra];

  const catCountsMap = new Map<string, number>();
  for (const e of raw) if (e.category) catCountsMap.set(e.category, (catCountsMap.get(e.category) ?? 0) + 1);

  const replSet = new Set<string>();
  for (const e of raw) { const l = replLabelSrv(e.replication); if (l !== '—') replSet.add(l); }

  const domSet = new Set<string>();
  for (const e of raw) { const l = domLabelSrv(e.fund_domicile); if (l) domSet.add(l); }
  const provSet = new Set<string>();
  for (const e of raw) { const v = (e.fund_provider ?? '').trim(); if (v) provSet.add(v); }

  const options: ScreenerOptions = {
    // Irsko a Lucembursko drží drtivou většinu fondů → nahoru, zbytek abecedně.
    domiciles: [...domSet].sort((a, b) => {
      const rank = (x: string) => (x === 'Irsko' ? 0 : x === 'Lucembursko' ? 1 : 2);
      return rank(a) - rank(b) || a.localeCompare(b, 'cs');
    }),
    providers: [...provSet].sort((a, b) => a.localeCompare(b, 'cs')),
    regions: buildRegionOptions(raw),
    indexGroups: buildIndexOptions(raw).groups,
    currencies: [...new Set(raw.map((e) => e.fund_currency).filter(Boolean))].sort() as string[],
    replications: [...replSet].sort(),
    categories,
    catCounts: [...catCountsMap.entries()],
  };

  return { rows, options, total: rows.length };
});

/**
 * Prvních `n` řádků pro server-render (rychlý FCP + SEO). Předfiltruje podle
 * `index` (kanonický label sledovaného indexu, přijde z ?index= – proklik ze
 * srovnání indexů) i `q` (hledání z hlavičky). Bez obojího vrátí top podle
 * velikosti. Plné filtrování dělá klient nad celou sadou.
 */
export function buildInitialScreenerRows(rows: ScreenerRow[], q: string, n = 50, index?: string): ScreenerRow[] {
  const base = index ? rows.filter((r) => r._index === index) : rows;
  const term = q.trim().toLowerCase();
  if (!term) return base.slice(0, n);
  const relevance = (r: ScreenerRow): number => {
    if (r.isin.toLowerCase() === term || r._tickers.includes(term)) return 4;
    if (r._tickers.some((t) => t.startsWith(term))) return 3;
    const name = r.name.toLowerCase();
    if (name.startsWith(term)) return 2;
    if (name.includes(term)) return 1;
    return 0;
  };
  return base
    .filter((r) => `${r.name} ${r.isin} ${r.fund_provider ?? ''} ${r._tickers.join(' ')}`.toLowerCase().includes(term))
    .sort((a, b) => relevance(b) - relevance(a))
    .slice(0, n);
}

/**
 * Category configurations for all /nejlepsi-etf/* pages
 * This maps each page slug to its filter configuration
 */
/** Sektorové, faktorové a tematické názvy, které NEPATŘÍ do širokých tržních/regionálních
 *  žebříčků („Celý svět", „USA", „Evropa"…). Důvod: `nameContains` je jen shoda podřetězce,
 *  takže bez tohohle se mezi „nejlepší celosvětové ETF" dostaly velké sektorové fondy
 *  (MSCI World Semiconductors, World Health Care) i faktorové (World Value/Momentum/Small Cap).
 *  Změřeno 2026-08: 95 z 346 fondů se slovem „World" bylo tohoto typu.
 *  POZOR: nepoužívat u sektorových kategorií – tam ty fondy naopak patří. */
/** Fond, který scraper neaktualizoval déle, se v žebříčcích neukazuje (viz getTopETFsForCategory). */
export const CERSTVOST_DNI = 14;
export const cerstveOd = () => new Date(Date.now() - CERSTVOST_DNI * 864e5).toISOString();

const BROAD_MARKET_EXCLUDES = [
  'Semiconductor', 'Information Technology', 'Technology', 'Health Care', 'Healthcare',
  'Energy', 'Financial', 'Bank', 'Insurance', 'Industrial', 'Materials', 'Utilities',
  'Consumer', 'Real Estate', 'Communication', 'Biotech', 'Defence', 'Defense',
  'Aerospace', 'Robotics', 'Infrastructure',
  'Momentum', 'Value', 'Quality', 'Growth', 'Minimum Volatility', 'Min Vol',
  'Small Cap', 'SmallCap', 'Mid Cap', 'Dividend', 'Buyback', 'Leveraged',
];

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
      nameExcludes: BROAD_MARKET_EXCLUDES,
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
      nameContains: ['MSCI World'],
      nameExcludes: [...BROAD_MARKET_EXCLUDES, 'ex USA', 'ex-USA', 'ex EMU', 'ex Europe', 'ACWI', 'All-World', 'All World'],
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
      nameContains: ['Technology', 'Tech', 'Nasdaq', 'Information', 'Digital', ' AI ', 'Cloud', 'Semiconductor'],
      nameExcludes: ['Biotech', 'Fintech', 'Medtech', 'Healthtech'],
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
      nameExcludes: [...BROAD_MARKET_EXCLUDES, 'EMU'],
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
      nameExcludes: BROAD_MARKET_EXCLUDES,
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
      nameContains: ['Bitcoin', 'BTC'],
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
  'nejlepsi-americke-etf': {
    slug: 'nejlepsi-americke-etf',
    title: 'Nejlepší americké ETF',
    description: 'Top ETF fondy na americké akcie',
    metaDescription: 'Nejlepší americké ETF fondy - přehled ETF na US akciový trh.',
    filters: {
      category: 'Akcie',
      nameContains: ['USA', 'US ', 'United States', 'America', 'S&P', 'Nasdaq', 'Dow Jones'],
      nameExcludes: [...BROAD_MARKET_EXCLUDES, 'ex USA', 'ex-USA', 'ex US', 'ex-US'],
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
      nameExcludes: [...BROAD_MARKET_EXCLUDES, 'ex Japan', 'ex-Japan'],
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
      nameExcludes: [...BROAD_MARKET_EXCLUDES, 'ex China', 'ex-China', 'ex. China'],
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
      nameExcludes: BROAD_MARKET_EXCLUDES,
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
      nameExcludes: ['Value-Chain', 'Value Chain'],
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
      category: 'Akcie',
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
  'nejlepsi-ai-etf': {
    slug: 'nejlepsi-ai-etf',
    title: 'Nejlepší AI ETF',
    description: 'Top ETF fondy na umělou inteligenci a big data',
    metaDescription: 'Nejlepší AI ETF fondy - přehled ETF na umělou inteligenci, machine learning a big data.',
    filters: {
      category: 'Akcie',
      nameContains: ['Artificial Intelligence', ' AI ', 'Machine Learning', 'Big Data'],
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
      nameExcludes: BROAD_MARKET_EXCLUDES,
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
      nameExcludes: BROAD_MARKET_EXCLUDES,
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 50,
  },
  'nejlepsi-cloud-etf': {
    slug: 'nejlepsi-cloud-etf',
    title: 'Nejlepší cloud ETF',
    description: 'Top ETF fondy na cloud computing',
    metaDescription: 'Nejlepší cloud ETF fondy - přehled ETF na cloud computing a SaaS společnosti.',
    filters: {
      category: 'Akcie',
      nameContains: ['Cloud', 'Computing', 'SaaS', 'Software'],
      nameExcludes: ['Quantum'],
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
      nameExcludes: ['MDAX', 'TecDAX', 'SDAX', 'DivDAX', 'DAXplus'],
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
      nameExcludes: ['Biotech'],
      minFundSize: 100,
    },
    sortBy: 'fund_size_numeric',
    sortOrder: 'desc',
    limit: 30,
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
      nameExcludes: ['Banks', 'Basic Resources', 'Utilities', 'Insurance', 'Health Care', 'Technology', 'Oil & Gas', 'Telecommunications', 'Automobiles', 'Chemicals', 'Construction', 'Financial Services', 'Food & Beverage', 'Industrial Goods', 'Media', 'Personal & Household', 'Real Estate', 'Retail', 'Travel & Leisure', 'Optimised'],
      minFundSize: 100,
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
