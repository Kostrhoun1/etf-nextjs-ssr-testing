import { NextResponse } from 'next/server';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/lib/supabase-config';

/* Stará adresa /etf/ticker/<TICKER> → 301 na detail /etf/<ISIN>. Dřív v middlewaru, který běžel u každého požadavku
   na /etf/… (zrušen 7. 11. 2026 – 37 % výpočetního času free tieru); teď funkce poběží jen u téhle vzácné adresy. */
export async function GET(request: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  if (/^[A-Za-z0-9.]{1,12}$/.test(ticker)) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/etf_funds?primary_ticker=eq.${encodeURIComponent(ticker.toUpperCase())}&select=isin&limit=1`, {
        headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}` },
      });
      const isin = r.ok ? ((await r.json()) as { isin?: string }[])[0]?.isin : undefined;
      if (isin) return NextResponse.redirect(new URL(`/etf/${isin}`, request.url), 301);
    } catch { /* níže 404 */ }
  }
  return new NextResponse('Not found', { status: 404 });
}
