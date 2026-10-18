import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { categoryConfigs } from '@/lib/etf-data';
import { anglickeTermy, navrhniKategorie } from '@/lib/hledaniCz';

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
      .select(`isin, name, fund_provider, fund_size_numeric, rating, ${TICKER_FIELDS.join(', ')}`)
      .or(orFilter)
      .order('fund_size_numeric', { ascending: false, nullsFirst: false })
      .limit(termy.length ? 60 : 30);

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
      // Úzké varianty (sektory, ESG, opční „income“, páka) za široké fondy – „sp 500“ nemá vrátit IT sektor.
      const dividendovy = /divid/.test(term) || termy.some((t) => /dividend/i.test(t));
      const uzka = /(esg|sri|screened|climate|paris|\bpab\b|sector|information tech|premium income|covered call|leveraged|\bshort\b|daily|equal weight)/i.test(name)
        || (!dividendovy && /(high dividend|dividend yield|dividend)/i.test(name)) ? 0.5 : 0;
      if (name.startsWith(term)) return 2 - uzka;
      if (name.includes(term)) return 1 - uzka;
      // České hledání: dřívější term = přesnější („svět“ → All-World před MSCI World).
      const i = termy.findIndex((t) => name.includes(t.toLowerCase()));
      if (i >= 0) return 1 + (termy.length - i) / 100 - uzka;
      return 0;
    };

    const rows = (data ?? []) as unknown as Record<string, unknown>[];
    const ranked = rows
      .map((row) => ({ row, s: score(row) }))
      .sort((a, b) => b.s - a.s || (Number(b.row.fund_size_numeric) || 0) - (Number(a.row.fund_size_numeric) || 0))
      .slice(0, 8)
      .map(({ row }) => ({
        isin: row.isin,
        name: row.name,
        // Ticker: hlavní, jinak z první burzy, kde je (988 fondů nemá hlavní ticker) – nikdy kus ISINu.
        primary_ticker: TICKER_FIELDS.map((f) => (row[f] as string | null)?.trim()).find((t) => t && t !== '-') ?? null,
        fund_provider: row.fund_provider,
        fund_size_numeric: row.fund_size_numeric,
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
