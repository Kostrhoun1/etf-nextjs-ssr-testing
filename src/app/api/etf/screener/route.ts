import { NextResponse } from 'next/server';
import { getScreenerRows } from '@/lib/etf-data';
import { zabalRadky } from '@/lib/screenerFormat';

/* Kompletní kompaktní databáze fondů pro srovnávač (klient si ji dotáhne po
   prvním vykreslení a odemkne filtrování nad celou sadou). Cachováno 24 h na
   CDN (stejná perioda jako revalidace stránek), takže se Supabase nedotazuje
   při každém návštěvníkovi.
   Od 21. 11. 2026 sloupcově (src/lib/screenerFormat.ts): stejná data, ~1,5 MB místo 3,7 MB → 2,4× méně čtení ISR cache. */
export const revalidate = 86400;

export async function GET() {
  const { rows } = await getScreenerRows();
  return NextResponse.json(zabalRadky(rows as unknown as Record<string, unknown>[]), {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
