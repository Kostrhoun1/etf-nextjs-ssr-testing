import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.length < 2) {
      return NextResponse.json({
        results: [],
        message: 'Query must be at least 2 characters long'
      });
    }

    console.log(`🔍 ETF Search: "${query}"`);

    // Search v ISIN, názvu, všech tickerech ze všech burz a provideru
    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select(`
        isin,
        name,
        primary_ticker,
        fund_provider,
        fund_size_numeric,
        rating
      `)
      .or(`isin.ilike.%${query}%,name.ilike.%${query}%,primary_ticker.ilike.%${query}%,exchange_1_ticker.ilike.%${query}%,exchange_2_ticker.ilike.%${query}%,exchange_3_ticker.ilike.%${query}%,exchange_4_ticker.ilike.%${query}%,exchange_5_ticker.ilike.%${query}%,exchange_6_ticker.ilike.%${query}%,exchange_7_ticker.ilike.%${query}%,exchange_8_ticker.ilike.%${query}%,exchange_9_ticker.ilike.%${query}%,exchange_10_ticker.ilike.%${query}%,fund_provider.ilike.%${query}%`)
      .order('fund_size_numeric', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json(
        { error: 'Search failed', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Found ${data?.length || 0} results for "${query}"`);

    return NextResponse.json({
      results: data || [],
      query,
      count: data?.length || 0
    });

  } catch (error) {
    console.error('ETF search error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}