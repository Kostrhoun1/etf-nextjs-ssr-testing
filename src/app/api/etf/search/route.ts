import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { categoryConfigs } from '@/lib/etf-data';
import { anglickeTermy, navrhniKategorie, skoreHledani } from '@/lib/hledaniCz';

// slug → titulek žebříčku (pro české hledání: „zlato“ → žebříček Nejlepší zlato ETF).
const KATEGORIE: Record<string, string> = Object.fromEntries(Object.entries(categoryConfigs).map(([slug, c]) => [slug, c.title]));

const TICKER_FIELDS = [
  'primary_ticker',
  'exchange_1_ticker', 'exchange_2_ticker', 'exchange_3_ticker', 'exchange_4_ticker', 'exchange_5_ticker',
  'exchange_6_ticker', 'exchange_7_ticker', 'exchange_8_ticker', 'exchange_9_ticker', 'exchange_10_ticker',
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [], message: 'Query must be at least 2 characters long' });
    }
    const q = query.trim().slice(0, 60);
    // Znaky, které by rozbily PostgREST filtr (or=…), z dotazu pryč.
    const bezpecne = q.replace(/[%,()*"\\]/g, ' ').trim();
    const like = `%${bezpecne}%`;
    // České výrazy → anglické části názvů fondů („zlato“ → Gold, „svět“ → All-World/MSCI World/ACWI).
    const termy = anglickeTermy(q);

    // Hledá v ISIN, názvu, poskytovateli a VŠECH tickerech (primární + 10 burz).
    const orFilter = [
      `isin.ilike.${like}`,
      `name.ilike.${like}`,
      `fund_provider.ilike.${like}`,
      ...TICKER_FIELDS.map((f) => `${f}.ilike.${like}`),
      ...termy.map((t) => `name.ilike.%${t.replace(/[%,()*"\\]/g, ' ')}%`),
    ].join(',');
    const kategorie = navrhniKategorie(q, KATEGORIE);

    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select(`isin, name, fund_provider, fund_size_numeric, rating, ter_numeric, return_1y_czk, category, ${TICKER_FIELDS.join(', ')}`)
      .or(orFilter)
      .order('fund_size_numeric', { ascending: false, nullsFirst: false })
      .limit(termy.length ? 60 : 30);

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ error: 'Search failed', details: error.message }, { status: 500 });
    }

    const term = q.toLowerCase();
    // Relevance: sdílená se srovnávačem (src/lib/hledaniCz.ts → skoreHledani).
    const score = (row: Record<string, unknown>): number => skoreHledani(term, termy, {
      isin: String(row.isin),
      name: String(row.name),
      tickers: TICKER_FIELDS.map((f) => (row[f] as string | null)?.trim().toLowerCase()).filter((t): t is string => !!t && t !== '-'),
    });

    const rows = (data ?? []) as unknown as Record<string, unknown>[];
    const skore = rows.map((row) => ({ row, s: score(row) }));
    // Přesná shoda tickeru („CSPX“) → bez fondů, které ticker jen začínají stejně (šum).
    const presna = skore.some((x) => x.s === 4) && /^[a-z0-9]{2,8}$/i.test(q);
    const ranked = skore
      .filter((x) => !presna || x.s !== 3)
      .sort((a, b) => b.s - a.s || (Number(b.row.fund_size_numeric) || 0) - (Number(a.row.fund_size_numeric) || 0))
      .slice(0, 8)
      .map(({ row }) => ({
        isin: row.isin,
        name: row.name,
        // Ticker: hlavní, jinak z první burzy, kde je (988 fondů nemá hlavní ticker) – nikdy kus ISINu.
        // Hledaný ticker z jiné burzy („CSPX“) ukázat tak, jak ho uživatel zná; jinak hlavní/první dostupný.
        primary_ticker: TICKER_FIELDS.map((f) => (row[f] as string | null)?.trim()).find((t) => t && t.toLowerCase() === term)
          ?? TICKER_FIELDS.map((f) => (row[f] as string | null)?.trim()).find((t) => t && t !== '-') ?? null,
        fund_provider: row.fund_provider,
        fund_size_numeric: row.fund_size_numeric,
        // TER 0 u akcií/dluhopisů je chyba zdroje → null (stejně jako srovnávač).
        ter: row.ter_numeric == null || (Number(row.ter_numeric) === 0 && ['Akcie', 'Dluhopisy'].includes(String(row.category))) ? null : Number(row.ter_numeric),
        r1_czk: row.return_1y_czk == null ? null : Number(row.return_1y_czk),
        rating: row.rating,
      }));

    return NextResponse.json({ results: ranked, kategorie, query: q, count: ranked.length });
  } catch (error) {
    console.error('ETF search error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
