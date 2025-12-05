import { supabaseAdmin } from '@/lib/supabase'

const baseUrl = 'https://www.etfpruvodce.cz'

export async function GET() {
  try {
    // Fetch ALL ETFs using pagination (Supabase has 1000 row limit per request)
    let allETFs: Array<{ isin: string; updated_at: string | null; fund_size_numeric: number | null }> = []
    let offset = 0
    const batchSize = 1000

    while (true) {
      const { data, error } = await supabaseAdmin
        .from('etf_funds')
        .select('isin, updated_at, fund_size_numeric')
        .order('fund_size_numeric', { ascending: false, nullsFirst: false })
        .range(offset, offset + batchSize - 1)

      if (error) {
        console.error('Error fetching ETFs for sitemap:', error)
        break
      }

      if (!data || data.length === 0) break

      allETFs = allETFs.concat(data)

      if (data.length < batchSize) break
      offset += batchSize
    }

    console.log(`Generating ETF sitemap with ${allETFs.length} ETFs`)

    const defaultDate = new Date().toISOString()

    const urls = allETFs.map((etf, index) => {
      const lastmod = etf.updated_at ? new Date(etf.updated_at).toISOString() : defaultDate
      // Priority based on fund size ranking
      const priority = index < 100 ? 0.9 : index < 500 ? 0.8 : index < 1000 ? 0.7 : 0.6

      return `
  <url>
    <loc>${baseUrl}/etf/${etf.isin}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
    }).join('')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating ETF sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
