import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

// Generate sitemap index with multiple sitemaps
// Updated 2025-12-04 - Split into multiple sitemaps for better Google indexing
export async function generateSitemaps() {
  // Return array of sitemap IDs
  // ID 0 = static pages, ID 1+ = ETF pages (batched by 1000)

  // Get total ETF count
  const { count } = await supabaseAdmin
    .from('etf_funds')
    .select('*', { count: 'exact', head: true })

  const etfCount = count || 0
  const etfSitemapCount = Math.ceil(etfCount / 1000) // 1000 ETFs per sitemap

  // Generate sitemap IDs: 0 for pages, 1+ for ETF batches
  const sitemaps = [{ id: 0 }] // Static pages

  for (let i = 1; i <= etfSitemapCount; i++) {
    sitemaps.push({ id: i })
  }

  return sitemaps
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.etfpruvodce.cz'

  // ID 0 = Static pages sitemap
  if (id === 0) {
    return generateStaticPagesSitemap(baseUrl)
  }

  // ID 1+ = ETF pages sitemaps (batched)
  return generateETFSitemap(baseUrl, id)
}

// Static pages sitemap
function generateStaticPagesSitemap(baseUrl: string): MetadataRoute.Sitemap {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const yearStart = new Date(2025, 0, 1)

  const staticPages = [
    // Homepage
    { path: '', lastMod: now, freq: 'daily' as const, priority: 1 },

    // Main sections
    { path: '/co-jsou-etf', lastMod: yearStart, freq: 'monthly' as const, priority: 0.9 },
    { path: '/co-jsou-etf/jak-zacit-investovat', lastMod: yearStart, freq: 'monthly' as const, priority: 0.8 },
    { path: '/kde-koupit-etf', lastMod: monthStart, freq: 'monthly' as const, priority: 0.9 },
    { path: '/srovnani-etf', lastMod: now, freq: 'weekly' as const, priority: 0.95 },
    { path: '/srovnani-brokeru', lastMod: monthStart, freq: 'monthly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf', lastMod: now, freq: 'weekly' as const, priority: 0.95 },
    { path: '/nejlepsi-etf-2025', lastMod: now, freq: 'weekly' as const, priority: 0.95 },
    { path: '/o-nas', lastMod: yearStart, freq: 'monthly' as const, priority: 0.5 },

    // ETF Comparisons (high value pages)
    { path: '/srovnani-etf/vwce-vs-cspx', lastMod: now, freq: 'weekly' as const, priority: 0.95 },
    { path: '/srovnani-etf/iwda-vs-cspx', lastMod: now, freq: 'weekly' as const, priority: 0.95 },
    { path: '/srovnani-etf/vwce-vs-iwda', lastMod: now, freq: 'weekly' as const, priority: 0.95 },
    { path: '/srovnani-etf/cspx-vs-vwra', lastMod: now, freq: 'weekly' as const, priority: 0.95 },
    { path: '/srovnani-etf/cspx-vs-vuaa', lastMod: now, freq: 'weekly' as const, priority: 0.95 },
    { path: '/srovnani-etf/swrd-vs-iwda', lastMod: now, freq: 'weekly' as const, priority: 0.95 },
    { path: '/srovnani-etf/vwce-vs-vwrl', lastMod: now, freq: 'weekly' as const, priority: 0.95 },
    { path: '/srovnani-etf/iwda-vs-vwra', lastMod: now, freq: 'weekly' as const, priority: 0.95 },
    { path: '/srovnani-etf/cspx-vs-eunl', lastMod: now, freq: 'weekly' as const, priority: 0.95 },
    { path: '/srovnani-etf/vwce-vs-eunl', lastMod: now, freq: 'weekly' as const, priority: 0.95 },

    // Portfolio strategies
    { path: '/portfolio-strategie', lastMod: yearStart, freq: 'monthly' as const, priority: 0.8 },
    { path: '/portfolio-strategie/akciove-portfolio', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },
    { path: '/portfolio-strategie/dividendove-portfolio', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },
    { path: '/portfolio-strategie/nobel-portfolio', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },
    { path: '/portfolio-strategie/permanentni-portfolio', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },
    { path: '/portfolio-strategie/ray-dalio-all-weather', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },

    // Calculators
    { path: '/kalkulacky', lastMod: yearStart, freq: 'monthly' as const, priority: 0.8 },
    { path: '/kalkulacky/hypotecni-kalkulacka', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },
    { path: '/kalkulacky/cisty-plat-2025', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },
    { path: '/kalkulacky/uverova-kalkulacka', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },
    { path: '/kalkulacky/investicni-kalkulacka', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },
    { path: '/kalkulacky/monte-carlo-simulator', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },
    { path: '/kalkulacky/fire-kalkulacka', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },
    { path: '/kalkulacky/nouzova-rezerva', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },
    { path: '/kalkulacky/kalkulacka-poplatku-etf', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },
    { path: '/kalkulacky/kurzovy-dopad-etf', lastMod: yearStart, freq: 'monthly' as const, priority: 0.7 },

    // Best ETF categories
    { path: '/nejlepsi-etf/nejlepsi-etf-2025', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlevnejsi-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/etf-zdarma-degiro', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-celosvetove-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-sp500-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-msci-world-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-nasdaq-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-dax-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-stoxx600-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-ftse100-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-americke-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-evropske-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-asijsko-pacificke-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-japonske-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-cinske-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-emerging-markets-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-dividendove-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-nemovitostni-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-dluhopisove-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-komoditni-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-zlate-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-technologicke-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-healthcare-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-financni-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-energeticke-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-spotrebni-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-ai-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-robotika-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-clean-energy-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-cloud-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-biotechnologie-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-kyberbezpecnost-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-defense-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-value-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-growth-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-small-cap-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },
    { path: '/nejlepsi-etf/nejlepsi-esg-etf', lastMod: now, freq: 'weekly' as const, priority: 0.9 },

    // Broker reviews
    { path: '/degiro-recenze', lastMod: monthStart, freq: 'monthly' as const, priority: 0.8 },
    { path: '/xtb-recenze', lastMod: monthStart, freq: 'monthly' as const, priority: 0.8 },
    { path: '/trading212-recenze', lastMod: monthStart, freq: 'monthly' as const, priority: 0.8 },
    { path: '/interactive-brokers-recenze', lastMod: monthStart, freq: 'monthly' as const, priority: 0.8 },
    { path: '/fio-ebroker-recenze', lastMod: monthStart, freq: 'monthly' as const, priority: 0.8 },
    { path: '/portu-recenze', lastMod: monthStart, freq: 'monthly' as const, priority: 0.8 },

    // Infographics
    { path: '/infografiky', lastMod: now, freq: 'weekly' as const, priority: 0.7 },
    { path: '/infografiky/nejlepsi-etf-vykonnost', lastMod: now, freq: 'weekly' as const, priority: 0.7 },
    { path: '/infografiky/nejlevnejsi-etf-ter', lastMod: now, freq: 'weekly' as const, priority: 0.7 },
    { path: '/infografiky/trzni-heatmapa', lastMod: now, freq: 'weekly' as const, priority: 0.7 },
  ]

  return staticPages.map(page => ({
    url: `${baseUrl}${page.path}`,
    lastModified: page.lastMod,
    changeFrequency: page.freq,
    priority: page.priority,
  }))
}

// ETF pages sitemap (batched by 1000)
async function generateETFSitemap(baseUrl: string, batchId: number): Promise<MetadataRoute.Sitemap> {
  const batchSize = 1000
  const offset = (batchId - 1) * batchSize // batchId 1 = offset 0, batchId 2 = offset 1000, etc.

  try {
    const { data: etfs, error } = await supabaseAdmin
      .from('etf_funds')
      .select('isin, updated_at, fund_size_numeric')
      .order('fund_size_numeric', { ascending: false })
      .range(offset, offset + batchSize - 1)

    if (error) {
      console.error(`Error fetching ETFs for sitemap batch ${batchId}:`, error)
      return []
    }

    if (!etfs || etfs.length === 0) {
      return []
    }

    return etfs.map((etf, index) => {
      // Priority based on position in overall ranking
      const globalIndex = offset + index
      let priority = 0.6
      if (globalIndex < 100) priority = 0.9
      else if (globalIndex < 500) priority = 0.8
      else if (globalIndex < 1000) priority = 0.7

      return {
        url: `${baseUrl}/etf/${etf.isin}`,
        lastModified: etf.updated_at ? new Date(etf.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority,
      }
    })
  } catch (error) {
    console.error(`Error generating ETF sitemap batch ${batchId}:`, error)
    return []
  }
}
