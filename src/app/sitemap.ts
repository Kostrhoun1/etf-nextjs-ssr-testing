import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

// Sitemap updated 2025-11-16 - Canonical URL fix - All URLs now use www variant
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.etfpruvodce.cz'
  
  // Static pages
  const staticPages = [
    '',
    '/co-jsou-etf',
    '/co-jsou-etf/jak-zacit-investovat',
    '/kde-koupit-etf',
    '/srovnani-etf',
    // Static ETF comparison pages
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

  // Helper functions for intelligent lastModified dates
  const getMonthlyUpdateDate = () => {
    const now = new Date()
    // Always the 1st day of current month for broker reviews (monthly updates)
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
        return new Date() // Fallback to current date
      }

      return new Date(data.updated_at)
    } catch (error) {
      console.error('Error getting database last update:', error)
      return new Date()
    }
  }

  // Include ALL ETFs in sitemap - Google needs to know about all pages
  // Large sitemaps (thousands of URLs) are normal and expected

  let etfPages: MetadataRoute.Sitemap = []
  let dbLastUpdate: Date

  try {
    // Get the latest database update date for ETF-related pages
    dbLastUpdate = await getDatabaseLastUpdate()
    console.log('Database last update:', dbLastUpdate)

    // Fetch ALL ETFs using pagination (Supabase has 1000 row limit per request)
    let allETFs: Array<{ isin: string; primary_ticker: string | null; updated_at: string | null; fund_size_numeric: number | null }> = []
    let offset = 0
    const batchSize = 1000

    while (true) {
      const { data, error } = await supabaseAdmin
        .from('etf_funds')
        .select('isin, primary_ticker, updated_at, fund_size_numeric')
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

    if (allETFs.length > 0) {
      console.log(`Adding ${allETFs.length} ETF pages to sitemap`)

      // Add ETF detail pages with priority based on fund size ranking
      etfPages = allETFs.map((etf, index) => ({
        url: `${baseUrl}/etf/${etf.isin}`,
        lastModified: etf.updated_at ? new Date(etf.updated_at) : dbLastUpdate,
        changeFrequency: 'weekly' as const,
        // Top 100 ETFs get highest priority, then gradually decrease
        priority: index < 100 ? 0.9 : index < 500 ? 0.8 : index < 1000 ? 0.7 : 0.6,
      }))
    }

    console.log(`Sitemap contains ${82 + allETFs.length} total URLs`)
  } catch (error) {
    console.error('Error fetching ETF data for sitemap:', error)
  }

  // Combine static and dynamic pages with intelligent dates
  const monthlyUpdateDate = getMonthlyUpdateDate()
  
  const staticSitemapEntries = staticPages.map((path) => {
    let lastModified: Date
    let changeFrequency: 'daily' | 'weekly' | 'monthly'
    
    // Intelligent lastModified dates based on content type
    if (path.includes('recenze')) {
      // Broker reviews: monthly updates (1st of each month)
      lastModified = monthlyUpdateDate
      changeFrequency = 'monthly'
    } else if (path.includes('/nejlepsi-etf') || path.includes('/srovnani-etf')) {
      // ETF-related pages: use database last update
      lastModified = dbLastUpdate || new Date()
      changeFrequency = 'weekly'
    } else if (path.includes('/srovnani-brokeru')) {
      // Broker comparison: monthly updates
      lastModified = monthlyUpdateDate
      changeFrequency = 'monthly'
    } else if (path.includes('/kalkulacky')) {
      // Calculators: less frequent updates
      lastModified = new Date(2025, 0, 1) // January 1, 2025
      changeFrequency = 'monthly'
    } else if (path === '') {
      // Homepage: daily
      lastModified = new Date()
      changeFrequency = 'daily'
    } else {
      // Other pages: quarterly updates
      lastModified = new Date(2025, 0, 1) // January 1, 2025
      changeFrequency = 'monthly'
    }

    return {
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency,
      priority: path === '' ? 1 : 
               path.includes('/srovnani-etf/') && path.includes('-vs-') ? 0.95 : // Static comparisons highest priority
               path.includes('/nejlepsi-etf') || path.includes('/srovnani') ? 0.9 : 0.8,
    }
  }) as MetadataRoute.Sitemap

  console.log(`Monthly update date for broker reviews: ${monthlyUpdateDate}`)
  console.log(`Database last update for ETF pages: ${dbLastUpdate}`)

  return [...staticSitemapEntries, ...etfPages]
}