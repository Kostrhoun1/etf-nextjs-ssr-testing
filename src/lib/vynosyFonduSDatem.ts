/**
 * Korunové výnosy vybraných fondů I S DATEM, ke kterému platí (pravidlo č. 1: každé číslo má datum).
 * Datum = datumCen(scraping_date) – stejně jako detail fondu. Fond, který scraper 14+ dní neaktualizoval
 * (CERSTVOST_DNI), vrací výnosy null → na webu „—“, ne stará čísla vydávaná za dnešní.
 * Použití: výsledek průvodce /vyber-etf, detail modelového portfolia bez backtestu.
 */
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/lib/supabase-config';
import { datumCen } from '@/lib/datumCen';
import { CERSTVOST_DNI } from '@/lib/etf-data';

const db = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export interface VynosFondu {
  isin: string;
  nazev: string | null;
  ticker: string | null;
  r1: number | null;
  r3: number | null;
  r5: number | null;
  /** YYYY-MM-DD, den, ke kterému ceny platí; null = data chybí nebo jsou zastaralá. */
  datum: string | null;
}

export async function vynosyFonduSDatem(isins: string[]): Promise<Record<string, VynosFondu>> {
  const out: Record<string, VynosFondu> = {};
  try {
    const { data, error } = await db
      .from('etf_funds')
      .select('isin, name, primary_ticker, return_1y_czk, return_3y_czk, return_5y_czk, scraping_date')
      .in('isin', isins);
    if (error || !data) return out;
    const hranice = Date.now() - CERSTVOST_DNI * 864e5;
    for (const r of data as Array<Record<string, unknown>>) {
      const sd = r.scraping_date ? new Date(String(r.scraping_date)) : null;
      const cerstve = !!sd && sd.getTime() >= hranice;
      const num = (v: unknown) => (cerstve && v != null && Number.isFinite(Number(v)) ? Number(v) : null);
      out[String(r.isin)] = {
        isin: String(r.isin),
        nazev: (r.name as string) ?? null,
        ticker: (r.primary_ticker as string) ?? null,
        r1: num(r.return_1y_czk),
        r3: num(r.return_3y_czk),
        r5: num(r.return_5y_czk),
        datum: cerstve && sd ? datumCen(sd).toISOString().slice(0, 10) : null,
      };
    }
  } catch (e) {
    console.error('[vynosyFonduSDatem]', e);
  }
  return out;
}
