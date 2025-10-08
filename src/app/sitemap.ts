import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://etfpruvodce.cz'
  
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
    '/infografiky'
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

  // Get all ETF ISINs from database with pagination to handle 3600+ ETFs
  let etfPages: MetadataRoute.Sitemap = []
  let dbLastUpdate: Date
  
  try {
    // Get the latest database update date for ETF-related pages
    dbLastUpdate = await getDatabaseLastUpdate()
    console.log('Database last update:', dbLastUpdate)

    let allETFs: any[] = []
    let hasMore = true
    let offset = 0
    const batchSize = 1000

    // Fetch all ETFs in batches
    while (hasMore) {
      const { data, error } = await supabaseAdmin
        .from('etf_funds')
        .select('isin, primary_ticker, updated_at')
        .order('fund_size_numeric', { ascending: false })
        .range(offset, offset + batchSize - 1)

      if (error) {
        console.error('Error fetching ETFs for sitemap:', error)
        break
      }

      if (data && data.length > 0) {
        allETFs = [...allETFs, ...data]
        offset += batchSize
        
        // If we got less than batchSize, we've reached the end
        if (data.length < batchSize) {
          hasMore = false
        }
      } else {
        hasMore = false
      }
    }

    console.log(`Adding ${allETFs.length} ETF pages to sitemap`)
    
    // Add ETF detail pages - use individual ETF update date or database last update
    etfPages = allETFs.map((etf) => ({
      url: `${baseUrl}/etf/${etf.isin}`,
      lastModified: etf.updated_at ? new Date(etf.updated_at) : dbLastUpdate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Add popular ticker detail pages (top 200 ETFs with tickers - full content pages for SEO)
    const tickerPages = allETFs
      .filter(etf => etf.primary_ticker && etf.primary_ticker.trim() !== '' && etf.primary_ticker.trim() !== '-')
      .slice(0, 200) // Limit to top 200 most popular (by fund size)
      .map((etf) => ({
        url: `${baseUrl}/etf/ticker/${etf.primary_ticker}`,
        lastModified: etf.updated_at ? new Date(etf.updated_at) : dbLastUpdate,
        changeFrequency: 'weekly' as const, // More frequent updates for better SEO
        priority: 0.8, // Higher priority for ticker pages (good for SEO)
      }))

    // Add popular ETF comparison URLs using tickers (not ISINs)
    const popularComparisons = [
      // World vs S&P 500 comparisons
      'VWCE,CSPX', 'IWDA,CSPX', 'VWCE,IWDA', 'SWDA,CSPX', 'SWDA,VWCE',
      
      // S&P 500 variants
      'CSPX,VUAA', 'CSPX,SXR8', 'VUAA,SXR8', 'EUNM,CSPX',
      
      // Europe vs World
      'VWCE,EUNL', 'IWDA,EUNL', 'CSPX,EUNL', 'SWDA,EUNL', 'EUNL,VEUR',
      
      // Emerging Markets
      'VWCE,EIMI', 'IWDA,EIMI', 'CSPX,EIMI', 'VFEM,EIMI', 'AEEM,EIMI',
      
      // Technology ETFs
      'CSPX,EQQQ', 'VWCE,EQQQ', 'IWDA,EQQQ', 'EQQQ,IUIT', 'WTCH,EQQQ',
      
      // Bond vs Equity
      'VWCE,VGEA', 'CSPX,VGEA', 'IWDA,VGEA', 'AGGG,VWCE', 'EUNL,VGEA',
      
      // Small Cap vs Large Cap
      'VWCE,IUSN', 'CSPX,IUSN', 'EUNL,IEUS', 'WZUS,CSPX',
      
      // Dividend ETFs
      'VWCE,VHYL', 'CSPX,VHYL', 'IUSV,VWCE', 'EUDV,VWCE',
      
      // Regional comparisons
      'VWCE,AAPJ', 'CSPX,AAPJ', 'EUNL,JPGL', 'VWCE,FLCH',
      
      // ESG vs Traditional
      'VWCE,ESGW', 'CSPX,ESGW', 'EUNL,EUSE', 'IWDA,ESGW'
    ]

    const comparisonPages = popularComparisons.map((comparison, index) => ({
      url: `${baseUrl}/srovnani-etf?compare=${comparison}`,
      lastModified: dbLastUpdate || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8, // High priority for popular comparisons
    }))

    etfPages = [...etfPages, ...tickerPages, ...comparisonPages]
    console.log(`Added ${tickerPages.length} ticker redirect pages to sitemap`)
    console.log(`Added ${comparisonPages.length} popular ETF comparison pages to sitemap`)
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