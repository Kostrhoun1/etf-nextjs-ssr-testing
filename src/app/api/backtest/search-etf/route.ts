import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Search ETFs by name or ISIN
 * Returns ETFs that have a known index mapping for backtesting
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')?.toLowerCase() || ''
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)

  if (query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    // Get available index codes from mapping
    const { data: indexMappings } = await supabaseAdmin
      .from('index_mapping')
      .select('index_code, index_name')

    if (!indexMappings) {
      return NextResponse.json({ results: [] })
    }

    const availableIndexCodes = indexMappings.map((m) => m.index_code)
    const indexNameMap = new Map(indexMappings.map((m) => [m.index_code, m.index_name]))

    // Search ETFs that track these indexes
    // We need to match ETF's index_name to our index_mapping
    const { data: etfs, error } = await supabaseAdmin
      .from('etf_funds')
      .select('isin, name, ter_numeric, index_name, fund_size_numeric')
      .or(`name.ilike.%${query}%,isin.ilike.%${query}%`)
      .not('index_name', 'is', null)
      .order('fund_size_numeric', { ascending: false, nullsFirst: false })
      .limit(100)

    if (error) {
      console.error('ETF search error:', error)
      return NextResponse.json({ results: [] })
    }

    // Map ETF index names to our index codes
    const indexNameToCode: Record<string, string> = {
      'MSCI World': 'msci_world',
      'MSCI World Index': 'msci_world',
      'MSCI World (USD)': 'msci_world',
      'S&P 500': 'sp500',
      'S&P 500 Index': 'sp500',
      'S&P 500®': 'sp500',
      'MSCI Emerging Markets': 'msci_em',
      'MSCI Emerging Markets Index': 'msci_em',
      'MSCI EM': 'msci_em',
      'MSCI Europe': 'msci_europe',
      'MSCI Europe Index': 'msci_europe',
      'STOXX Europe 600': 'stoxx600',
      'STOXX® Europe 600': 'stoxx600',
      'EURO STOXX 600': 'stoxx600',
    }

    // Filter and map results
    const results = etfs
      ?.map((etf) => {
        // Try to find matching index code
        let indexCode: string | null = null

        for (const [pattern, code] of Object.entries(indexNameToCode)) {
          if (etf.index_name?.toLowerCase().includes(pattern.toLowerCase())) {
            indexCode = code
            break
          }
        }

        if (!indexCode) return null

        return {
          isin: etf.isin,
          name: etf.name,
          ter: (etf.ter_numeric || 0.2) / 100, // Convert from percentage to decimal
          indexCode,
          indexName: indexNameMap.get(indexCode) || etf.index_name,
          fundSize: etf.fund_size_numeric,
        }
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .slice(0, limit)

    return NextResponse.json({ results })
  } catch (error) {
    console.error('ETF search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
