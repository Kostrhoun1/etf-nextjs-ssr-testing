import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { tickerProCesko } from '@/lib/srovnaniRocni';

/* /kde-koupit/fond?isin=… – název a ticker fondu pro „Kde koupit SXR8“ (návštěvník přišel z detailu fondu).
   Jen identita fondu z naší databáze; dostupnost u brokerů NEověřujeme (nemáme ji v datech), takže ji ani
   nevracíme. Stránka /kde-koupit tím zůstává statická (ISR) – parametr čte až prohlížeč. */

const ISIN = /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/;
const BURZY = Array.from({ length: 10 }, (_, i) => [`exchange_${i + 1}_name`, `exchange_${i + 1}_ticker`]).flat();

export async function GET(request: NextRequest) {
  const isin = (request.nextUrl.searchParams.get('isin') ?? '').trim().toUpperCase();
  if (!ISIN.test(isin)) return NextResponse.json({ fond: null }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from('etf_funds')
    .select(['isin', 'name', 'primary_ticker', ...BURZY].join(', '))
    .eq('isin', isin)
    .maybeSingle();
  if (error) return NextResponse.json({ fond: null }, { status: 500 });
  if (!data) return NextResponse.json({ fond: null }, { status: 404 });
  const r = data as unknown as Record<string, unknown>;
  const xetra = Array.from({ length: 10 }, (_, i) => i + 1).some((i) => /xetra/i.test(String(r[`exchange_${i}_name`] ?? ''))
    && typeof r[`exchange_${i}_ticker`] === 'string' && !['', '-'].includes(String(r[`exchange_${i}_ticker`]).trim()));
  return NextResponse.json(
    { fond: { isin, name: String(r.name ?? ''), ticker: tickerProCesko(r), xetra } },
    { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
  );
}
