import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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
    const q = query.trim();
    const like = `%${q}%`;

    // Hledá v ISIN, názvu, poskytovateli a VŠECH tickerech (primární + 10 burz).
    const orFilter = [
      `isin.ilike.${like}`,
      `name.ilike.${like}`,
      `fund_provider.ilike.${like}`,
      ...TICKER_FIELDS.map((f) => `${f}.ilike.${like}`),
    ].join(',');

    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select(`isin, name, fund_provider, fund_size_numeric, rating, ${TICKER_FIELDS.join(', ')}`)
      .or(orFilter)
      .order('fund_size_numeric', { ascending: false, nullsFirst: false })
      .limit(30);

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ error: 'Search failed', details: error.message }, { status: 500 });
    }

    const term = q.toLowerCase();
    // Relevance: přesná shoda ISIN/tickeru nahoru, pak prefix tickeru, pak prefix/část názvu.
    const score = (row: Record<string, unknown>): number => {
      const tickers = TICKER_FIELDS
        .map((f) => (row[f] as string | null)?.trim().toLowerCase())
        .filter((t): t is string => !!t && t !== '-');
      const isin = String(row.isin).toLowerCase();
      const name = String(row.name).toLowerCase();
      if (isin === term || tickers.includes(term)) return 4;
      if (tickers.some((t) => t.startsWith(term))) return 3;
      if (name.startsWith(term)) return 2;
      if (name.includes(term)) return 1;
      return 0;
    };

    const ranked = (data ?? [])
      .map((row) => ({ row, s: score(row as Record<string, unknown>) }))
      .sort((a, b) => b.s - a.s || (Number(b.row.fund_size_numeric) || 0) - (Number(a.row.fund_size_numeric) || 0))
      .slice(0, 8)
      .map(({ row }) => ({
        isin: row.isin,
        name: row.name,
        primary_ticker: row.primary_ticker,
        fund_provider: row.fund_provider,
        fund_size_numeric: row.fund_size_numeric,
        rating: row.rating,
      }));

    return NextResponse.json({ results: ranked, query: q, count: ranked.length });
  } catch (error) {
    console.error('ETF search error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
