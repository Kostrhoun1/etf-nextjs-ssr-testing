/**
 * Doplňková data pro stránky srovnání dvou fondů (/srovnani/[pair], /srovnani/vwce-vs-cspx), 18. 10. 2026:
 * roční výnosy (graf obou fondů v Kč), největší země a datum dat fondu (scraping_date – pravidlo č. 1:
 * stáří dat se měří scraping_date, ne globálním datem). getComparisonETFData tyto sloupce nenačítá.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { nactiTrhy } from '@/lib/trhy';

export type Mena = 'CZK' | 'EUR' | 'USD';
export type RocniHodnoty = Record<Mena, number | null>;
export interface RokVynosu { rok: number; ytd?: boolean; v: RocniHodnoty }
export interface DoplnekFondu {
  isin: string;
  roky: RokVynosu[];
  zeme: { nazev: string; vaha: number }[];
  scrapingDate: string | null;
  /** Den výnosů fondu (returns_as_of, src/lib/datumVynosu.ts); null u dat před 21. 10. 2026. */
  returnsAsOf: string | null;
  /** Výnos fondu mimo svůj trh (src/lib/trhy.ts) → letošní výnos neověřený, neukazovat. */
  odlehly: boolean;
}

const ROKY = [2021, 2022, 2023, 2024, 2025];
const num = (v: unknown) => (v == null || v === '' || Number.isNaN(Number(v)) ? null : Number(v));

export async function nactiDoplnkyFondu(isins: string[]): Promise<Record<string, DoplnekFondu>> {
  const sloupce = [
    'isin', 'scraping_date', 'returns_as_of', 'return_ytd', 'return_ytd_czk', 'return_ytd_usd',
    ...ROKY.flatMap((r) => [`return_${r}`, `return_${r}_czk`, `return_${r}_usd`]),
    ...[1, 2, 3, 4, 5].flatMap((i) => [`country_${i}_name`, `country_${i}_weight`]),
  ];
  try {
    const [{ data, error }, trhy] = await Promise.all([
      supabaseAdmin.from('etf_funds').select(sloupce.join(', ')).in('isin', isins),
      nactiTrhy(),
    ]);
    if (error || !data) return {};
    const odlehle = new Set((trhy ?? []).flatMap((t) => t.odlehle.map((f) => f.isin)));
    const out: Record<string, DoplnekFondu> = {};
    for (const radek of data as unknown as Record<string, unknown>[]) {
      const isin = String(radek.isin);
      const odlehly = odlehle.has(isin);
      const roky: RokVynosu[] = ROKY.map((rok) => ({
        rok,
        // Bez přepočtu NEukazovat EUR jako Kč/USD (stejně jako detail fondu).
        v: { EUR: num(radek[`return_${rok}`]), CZK: num(radek[`return_${rok}_czk`]), USD: num(radek[`return_${rok}_usd`]) },
      }));
      const letos = new Date().getFullYear();
      if (!odlehly) roky.push({ rok: letos, ytd: true, v: { EUR: num(radek.return_ytd), CZK: num(radek.return_ytd_czk), USD: num(radek.return_ytd_usd) } });
      const zeme = [1, 2, 3, 4, 5]
        .map((i) => ({ nazev: String(radek[`country_${i}_name`] ?? '').trim(), vaha: num(radek[`country_${i}_weight`]) ?? 0 }))
        .filter((z) => z.nazev && z.vaha > 0);
      out[isin] = { isin, roky, zeme, scrapingDate: (radek.scraping_date as string) ?? null, returnsAsOf: (radek.returns_as_of as string) ?? null, odlehly };
    }
    return out;
  } catch {
    return {};
  }
}

/** Ticker, pod kterým fond v Česku nejčastěji koupíte: listing na XETRA (DEGIRO, XTB, Trading 212),
 *  jinak primární ticker. Kolo 3 (18. 10. 2026): stránka „CSPX vs …“ střídala CSPX a SXR8 – teď jednou
 *  vysvětlí, že jde o tentýž fond, a dál drží jedno jméno (to z XETRA). */
export function tickerProCesko(etf: object): string | null {
  const r = etf as Record<string, unknown>;
  for (let i = 1; i <= 10; i++) {
    if (/xetra/i.test(String(r[`exchange_${i}_name`] ?? ''))) {
      const t = r[`exchange_${i}_ticker`];
      if (typeof t === 'string' && t.trim() && t.trim() !== '-') return t.trim();
    }
  }
  const p = r.primary_ticker;
  return typeof p === 'string' && p.trim() && p.trim() !== '-' ? p.trim() : null;
}
