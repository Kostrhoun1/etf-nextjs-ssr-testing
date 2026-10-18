/**
 * Rozcestník žebříčků (/zebricky) – živá čísla ke každému žebříčku (18. 10. 2026, revize art directora:
 * „zeď 48 stejných karet bez jediného čísla“).
 *
 * JEDEN dotaz (stránkovaný po 1 000 řádcích) při ISR renderu místo 48 dotazů: načteme všechny fondy,
 * které do žebříčků vůbec můžou (stejné pojistky jako getTopETFsForCategory – čerstvá data, bez páky,
 * s názvem, velikost ≥ 10 mil. €), a filtry kategorií vyhodnotíme tady v JS.
 *
 * `odpovidaKategorii` MUSÍ zrcadlit SQL filtr v getTopETFsForCategory (src/lib/etf-data.ts) – ilike
 * = podřetězec bez ohledu na velikost písmen. Když se rozejdou, rozcestník slíbí jiný počet fondů,
 * než ukáže žebříček → hlídá to denní kontrola (scripts/check-fund-data.mjs, „počet fondů“).
 */
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/lib/supabase-config';
import { categoryConfigs, cerstveOd, type CategoryConfig } from '@/lib/etf-data';
import { platnyTicker } from '@/lib/ticker';

const db = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export interface FondProZebricek {
  isin: string;
  name: string;
  primary_ticker: string | null;
  category: string | null;
  distribution_policy: string | null;
  fund_size_numeric: number | null;
  ter_numeric: number | null;
  return_1y_czk: number | null;
  scraping_date: string | null;
  rating: number | null;
}

const obsahuje = (text: string | null | undefined, term: string) =>
  (text ?? '').toLowerCase().includes(term.toLowerCase());

/** JS zrcadlo SQL filtru kategorie (bez společných pojistek – ty dělá dotaz). */
export function odpovidaKategorii(cfg: CategoryConfig, e: FondProZebricek): boolean {
  const f = cfg.filters;
  if (f.category && e.category !== f.category) return false;
  if (f.categories?.length && !f.categories.includes(e.category ?? '')) return false;
  if (f.nameContains?.length && !f.nameContains.some((t) => obsahuje(e.name, t))) return false;
  if (f.nameExcludes?.some((t) => obsahuje(e.name, t))) return false;
  if (f.minFundSize && !((e.fund_size_numeric ?? -Infinity) >= f.minFundSize)) return false;
  if (f.distribution_policy && e.distribution_policy !== f.distribution_policy) return false;
  if (f.minTer !== undefined && !((e.ter_numeric ?? -Infinity) > f.minTer)) return false;
  if (cfg.sortBy === 'rating' && e.rating == null) return false;
  return true;
}

export interface SouhrnZebricku {
  slug: string;
  pocet: number;
  /** Nejnižší TER > 0 (TER 0 % u akcií/dluhopisů je chyba zdroje; stejně jako „Nejlevnější“ na žebříčku). */
  nejlevnejsi: { isin: string; ticker: string | null; ter: number } | null;
  nejvetsi: { isin: string; ticker: string | null; nazev: string; velikost: number; r1: number | null } | null;
}

const SLOUPCE = 'isin,name,primary_ticker,category,distribution_policy,fund_size_numeric,ter_numeric,return_1y_czk,scraping_date,rating';

export async function nactiFondyProZebricky(): Promise<FondProZebricek[] | null> {
  try {
    const out: FondProZebricek[] = [];
    for (let od = 0; od < 20000; od += 1000) {
      const { data, error } = await db
        .from('etf_funds')
        .select(SLOUPCE)
        .not('fund_size_numeric', 'is', null)
        .gte('fund_size_numeric', 10)
        .not('is_leveraged', 'is', true)
        .not('name', 'is', null)
        .gte('scraping_date', cerstveOd())
        .order('isin')
        .range(od, od + 999);
      if (error) { console.error('nactiFondyProZebricky:', error); return null; }
      out.push(...((data ?? []) as FondProZebricek[]));
      if (!data || data.length < 1000) break;
    }
    return out;
  } catch (e) {
    console.error('nactiFondyProZebricky:', e);
    return null;
  }
}

export function spocitejSouhrn(slug: string, fondy: FondProZebricek[]): SouhrnZebricku | null {
  const cfg = categoryConfigs[slug];
  if (!cfg) return null;
  const v = fondy.filter((e) => odpovidaKategorii(cfg, e));
  const sTer = v.filter((e) => e.ter_numeric != null && Number(e.ter_numeric) > 0)
    .sort((a, b) => Number(a.ter_numeric) - Number(b.ter_numeric) || Number(b.fund_size_numeric) - Number(a.fund_size_numeric));
  const nejvetsi = [...v].sort((a, b) => Number(b.fund_size_numeric) - Number(a.fund_size_numeric))[0];
  return {
    slug,
    pocet: v.length,
    nejlevnejsi: sTer[0] ? { isin: sTer[0].isin, ticker: platnyTicker(sTer[0].primary_ticker), ter: Number(sTer[0].ter_numeric) } : null,
    nejvetsi: nejvetsi ? {
      isin: nejvetsi.isin,
      ticker: platnyTicker(nejvetsi.primary_ticker),
      nazev: nejvetsi.name,
      velikost: Number(nejvetsi.fund_size_numeric),
      r1: nejvetsi.return_1y_czk == null ? null : Number(nejvetsi.return_1y_czk),
    } : null,
  };
}
