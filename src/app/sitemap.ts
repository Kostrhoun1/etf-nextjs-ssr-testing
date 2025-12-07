import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

const baseUrl = 'https://www.etfpruvodce.cz'

// Static pages - high quality content
const staticPages = [
  { path: '', priority: 1, changeFrequency: 'daily' as const },
  { path: '/co-jsou-etf', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/co-jsou-etf/jak-zacit-investovat', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/kde-koupit-etf', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/srovnani-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  // Static ETF comparison pages
  { path: '/srovnani-etf/vwce-vs-cspx', priority: 0.95, changeFrequency: 'weekly' as const },
  { path: '/srovnani-etf/iwda-vs-cspx', priority: 0.95, changeFrequency: 'weekly' as const },
  { path: '/srovnani-etf/vwce-vs-iwda', priority: 0.95, changeFrequency: 'weekly' as const },
  { path: '/srovnani-etf/cspx-vs-vwra', priority: 0.95, changeFrequency: 'weekly' as const },
  { path: '/srovnani-etf/cspx-vs-vuaa', priority: 0.95, changeFrequency: 'weekly' as const },
  { path: '/srovnani-etf/swrd-vs-iwda', priority: 0.95, changeFrequency: 'weekly' as const },
  { path: '/srovnani-etf/vwce-vs-vwrl', priority: 0.95, changeFrequency: 'weekly' as const },
  { path: '/srovnani-etf/iwda-vs-vwra', priority: 0.95, changeFrequency: 'weekly' as const },
  { path: '/srovnani-etf/cspx-vs-eunl', priority: 0.95, changeFrequency: 'weekly' as const },
  { path: '/srovnani-etf/vwce-vs-eunl', priority: 0.95, changeFrequency: 'weekly' as const },
  { path: '/srovnani-brokeru', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/portfolio-strategie', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/portfolio-strategie/akciove-portfolio', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/portfolio-strategie/dividendove-portfolio', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/portfolio-strategie/nobel-portfolio', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/portfolio-strategie/permanentni-portfolio', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/portfolio-strategie/ray-dalio-all-weather', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/kalkulacky', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/kalkulacky/hypotecni-kalkulacka', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/kalkulacky/cisty-plat-2025', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/kalkulacky/uverova-kalkulacka', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/kalkulacky/investicni-kalkulacka', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/kalkulacky/backtest-portfolia', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/kalkulacky/monte-carlo-simulator', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/kalkulacky/fire-kalkulacka', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/kalkulacky/nouzova-rezerva', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/kalkulacky/kalkulacka-poplatku-etf', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/kalkulacky/kurzovy-dopad-etf', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/kalkulacky/spotrebitelsky-uver', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/nejlepsi-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-etf-2025', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlevnejsi-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/etf-zdarma-degiro', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-celosvetove-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-sp500-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-msci-world-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-nasdaq-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-dax-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-stoxx600-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-ftse100-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-americke-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-evropske-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-asijsko-pacificke-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-japonske-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-cinske-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-emerging-markets-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-dividendove-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-nemovitostni-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-dluhopisove-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-komoditni-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-zlate-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-technologicke-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-healthcare-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-financni-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-energeticke-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-spotrebni-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-ai-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-robotika-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-clean-energy-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-cloud-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-biotechnologie-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-kyberbezpecnost-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-defense-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-value-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-growth-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-small-cap-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf/nejlepsi-esg-etf', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/degiro-recenze', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/xtb-recenze', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/trading212-recenze', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/interactive-brokers-recenze', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/fio-ebroker-recenze', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/portu-recenze', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/infografiky', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/infografiky/nejlepsi-etf-vykonnost', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/infografiky/nejlevnejsi-etf-ter', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/infografiky/trzni-heatmapa', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/nejlepsi-etf-2025', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/o-nas', priority: 0.7, changeFrequency: 'monthly' as const },
]

// Generate multiple sitemaps: 0 = static pages, 1 = ETF details
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }]
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  // Sitemap 0: Static pages (compare as string since Next.js passes string)
  if (String(id) === '0') {
    return staticPages.map(page => ({
      url: `${baseUrl}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  }

  // Sitemap 1: ETF detail pages - fetched from database at build time
  try {
    let allETFs: Array<{ isin: string; updated_at: string | null; fund_size_numeric: number | null }> = []
    let offset = 0
    const batchSize = 1000

    // Fetch all ETFs using pagination
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

    return allETFs.map((etf, index) => {
      const lastmod = etf.updated_at ? new Date(etf.updated_at).toISOString() : now
      // Priority based on fund size ranking
      const priority = index < 100 ? 0.9 : index < 500 ? 0.8 : index < 1000 ? 0.7 : 0.6

      return {
        url: `${baseUrl}/etf/${etf.isin}`,
        lastModified: lastmod,
        changeFrequency: 'weekly' as const,
        priority,
      }
    })
  } catch (error) {
    console.error('Error generating ETF sitemap:', error)
    return []
  }
}
