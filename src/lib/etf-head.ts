import { supabaseAdmin } from '@/lib/supabase';

/* „Hlava" katalogu fondů = ty, které smí indexovat i Google (mil. EUR AUM).
   ≥ 2 000 = ~329 největších a nejhledanějších fondů; zbytek (~4 560) má
   googlebot-noindex, ale Bing/Seznam indexují všechno.

   Tento soubor je JEDINÁ PRAVDA pro práh – dřív žil jen v page.tsx a sitemapa
   o něm nevěděla, takže Google měl 329 stránek otevřených, ale nikdy je neviděl
   (11 týdnů, 0 impresí v GSC). Kdo mění práh, mění ho tady. */
export const HEAD_MIN_SIZE = 2000;

export const isHeadFund = (fundSizeNumeric: unknown) =>
  Number(fundSizeNumeric ?? 0) >= HEAD_MIN_SIZE;

/* ISIN hlavy pro sitemapu. Stránkujeme po 1 000 – Supabase víc řádků v jedné
   odpovědi nepošle, a při snížení prahu by se sitemapa jinak tiše odsekla. */
export async function fetchHeadIsins(): Promise<string[]> {
  const PAGE = 1000;
  const isins: string[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select('isin')
      .gte('fund_size_numeric', HEAD_MIN_SIZE)
      .order('fund_size_numeric', { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`sitemap: hlava fondů se nenačetla – ${error.message}`);
    const rows = data ?? [];
    for (const r of rows) if (r.isin) isins.push(String(r.isin));
    if (rows.length < PAGE) return isins;
  }
}
