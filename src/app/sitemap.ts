import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

const baseUrl = 'https://www.etfpruvodce.cz'

// Static pages - high quality content that should be prioritized by Google
const staticPages = [
  '',
  '/co-jsou-etf',
  '/co-jsou-etf/jak-zacit-investovat',
  '/kde-koupit-etf',
  '/srovnani-etf',
  // Static ETF comparison pages - very high value
  '/srovnani-etf/vwce-vs-cspx',
  '/srovnani-etf/iwda-vs-cspx',
  '/srovnani-etf/vwce-vs-iwda',
  '/srovnani-etf/cspx-vs-vwra',
  '/srovnani-etf/cspx-vs-vuaa',
  '/srovnani-etf/swrd-vs-iwda',
  '/srovnani-etf/vwce-vs-vwrl',
  '/srovnani-etf/iwda-vs-vwra',
  '/srovnani-etf/cspx-vs-eunl',
  '/srovnani-etf/vwce-vs-eunl',
  '/srovnani-brokeru',
  '/portfolio-strategie',
  '/portfolio-strategie/akciove-portfolio',
  '/portfolio-strategie/dividendove-portfolio',
  '/portfolio-strategie/nobel-portfolio',
  '/portfolio-strategie/permanentni-portfolio',
  '/portfolio-strategie/ray-dalio-all-weather',
  '/kalkulacky',
  '/kalkulacky/hypotecni-kalkulacka',
  '/kalkulacky/cisty-plat-2025',
  '/kalkulacky/uverova-kalkulacka',
  '/kalkulacky/investicni-kalkulacka',
  '/kalkulacky/monte-carlo-simulator',
  '/kalkulacky/fire-kalkulacka',
  '/kalkulacky/nouzova-rezerva',
  '/kalkulacky/kalkulacka-poplatku-etf',
  '/kalkulacky/kurzovy-dopad-etf',
  '/nejlepsi-etf',
  '/nejlepsi-etf/nejlepsi-etf-2025',
  '/nejlepsi-etf/nejlevnejsi-etf',
  '/nejlepsi-etf/etf-zdarma-degiro',
  '/nejlepsi-etf/nejlepsi-celosvetove-etf',
  '/nejlepsi-etf/nejlepsi-sp500-etf',
  '/nejlepsi-etf/nejlepsi-msci-world-etf',
  '/nejlepsi-etf/nejlepsi-nasdaq-etf',
  '/nejlepsi-etf/nejlepsi-dax-etf',
  '/nejlepsi-etf/nejlepsi-stoxx600-etf',
  '/nejlepsi-etf/nejlepsi-ftse100-etf',
  '/nejlepsi-etf/nejlepsi-americke-etf',
  '/nejlepsi-etf/nejlepsi-evropske-etf',
  '/nejlepsi-etf/nejlepsi-asijsko-pacificke-etf',
  '/nejlepsi-etf/nejlepsi-japonske-etf',
  '/nejlepsi-etf/nejlepsi-cinske-etf',
  '/nejlepsi-etf/nejlepsi-emerging-markets-etf',
  '/nejlepsi-etf/nejlepsi-dividendove-etf',
  '/nejlepsi-etf/nejlepsi-nemovitostni-etf',
  '/nejlepsi-etf/nejlepsi-dluhopisove-etf',
  '/nejlepsi-etf/nejlepsi-komoditni-etf',
  '/nejlepsi-etf/nejlepsi-zlate-etf',
  '/nejlepsi-etf/nejlepsi-technologicke-etf',
  '/nejlepsi-etf/nejlepsi-healthcare-etf',
  '/nejlepsi-etf/nejlepsi-financni-etf',
  '/nejlepsi-etf/nejlepsi-energeticke-etf',
  '/nejlepsi-etf/nejlepsi-spotrebni-etf',
  '/nejlepsi-etf/nejlepsi-ai-etf',
  '/nejlepsi-etf/nejlepsi-robotika-etf',
  '/nejlepsi-etf/nejlepsi-clean-energy-etf',
  '/nejlepsi-etf/nejlepsi-cloud-etf',
  '/nejlepsi-etf/nejlepsi-biotechnologie-etf',
  '/nejlepsi-etf/nejlepsi-kyberbezpecnost-etf',
  '/nejlepsi-etf/nejlepsi-defense-etf',
  '/nejlepsi-etf/nejlepsi-value-etf',
  '/nejlepsi-etf/nejlepsi-growth-etf',
  '/nejlepsi-etf/nejlepsi-small-cap-etf',
  '/nejlepsi-etf/nejlepsi-esg-etf',
  '/degiro-recenze',
  '/xtb-recenze',
  '/trading212-recenze',
  '/interactive-brokers-recenze',
  '/fio-ebroker-recenze',
  '/portu-recenze',
  '/infografiky',
  '/infografiky/nejlepsi-etf-vykonnost',
  '/infografiky/nejlevnejsi-etf-ter',
  '/infografiky/trzni-heatmapa',
  '/nejlepsi-etf-2025',
  '/o-nas'
]

// Helper functions
const getMonthlyUpdateDate = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

const getDatabaseLastUpdate = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('etf_funds')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data?.updated_at) {
      return new Date()
    }

    return new Date(data.updated_at)
  } catch (error) {
    console.error('Error getting database last update:', error)
    return new Date()
  }
}

// Generate sitemap index with multiple sitemaps
// This creates /sitemap.xml as index pointing to /sitemap/0.xml and /sitemap/1.xml
export async function generateSitemaps() {
  return [
    { id: 0 }, // Static pages sitemap
    { id: 1 }, // ETF funds sitemap
  ]
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const monthlyUpdateDate = getMonthlyUpdateDate()
  const dbLastUpdate = await getDatabaseLastUpdate()

  // Sitemap 0: Static pages (high-quality content)
  if (id === 0) {
    console.log(`Generating sitemap 0: ${staticPages.length} static pages`)

    return staticPages.map((path) => {
      let lastModified: Date
      let changeFrequency: 'daily' | 'weekly' | 'monthly'

      if (path.includes('recenze')) {
        lastModified = monthlyUpdateDate
        changeFrequency = 'monthly'
      } else if (path.includes('/nejlepsi-etf') || path.includes('/srovnani-etf')) {
        lastModified = dbLastUpdate
        changeFrequency = 'weekly'
      } else if (path.includes('/srovnani-brokeru')) {
        lastModified = monthlyUpdateDate
        changeFrequency = 'monthly'
      } else if (path.includes('/kalkulacky')) {
        lastModified = new Date(2025, 0, 1)
        changeFrequency = 'monthly'
      } else if (path === '') {
        lastModified = new Date()
        changeFrequency = 'daily'
      } else {
        lastModified = new Date(2025, 0, 1)
        changeFrequency = 'monthly'
      }

      return {
        url: `${baseUrl}${path}`,
        lastModified,
        changeFrequency,
        priority: path === '' ? 1 :
                 path.includes('/srovnani-etf/') && path.includes('-vs-') ? 0.95 :
                 path.includes('/nejlepsi-etf') || path.includes('/srovnani') ? 0.9 : 0.8,
      }
    })
  }

  // Sitemap 1: All ETF fund pages
  if (id === 1) {
    try {
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

      console.log(`Generating sitemap 1: ${allETFs.length} ETF pages`)

      return allETFs.map((etf, index) => ({
        url: `${baseUrl}/etf/${etf.isin}`,
        lastModified: etf.updated_at ? new Date(etf.updated_at) : dbLastUpdate,
        changeFrequency: 'weekly' as const,
        priority: index < 100 ? 0.9 : index < 500 ? 0.8 : index < 1000 ? 0.7 : 0.6,
      }))
    } catch (error) {
      console.error('Error generating ETF sitemap:', error)
      return []
    }
  }

  return []
}
