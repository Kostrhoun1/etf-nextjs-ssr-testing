import { NextResponse } from 'next/server';
import { getScreenerRows } from '@/lib/etf-data';

/* Kompletní kompaktní databáze fondů pro srovnávač (klient si ji dotáhne po
   prvním vykreslení a odemkne filtrování nad celou sadou). Cachováno 24 h na
   CDN (stejná perioda jako revalidace stránek), takže se Supabase nedotazuje
   při každém návštěvníkovi. */
export const revalidate = 86400;

export async function GET() {
  const { rows } = await getScreenerRows();
  return NextResponse.json(rows, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
