// Force static generation at build time
export const dynamic = 'force-static'
export const revalidate = false

const baseUrl = 'https://www.etfpruvodce.cz'

const staticPages = [
  { path: '', priority: 1, changefreq: 'daily' },
  { path: '/co-jsou-etf', priority: 0.9, changefreq: 'monthly' },
  { path: '/co-jsou-etf/jak-zacit-investovat', priority: 0.9, changefreq: 'monthly' },
  { path: '/kde-koupit-etf', priority: 0.9, changefreq: 'monthly' },
  { path: '/srovnani-etf', priority: 0.9, changefreq: 'weekly' },
  // Static ETF comparison pages - very high value
  { path: '/srovnani-etf/vwce-vs-cspx', priority: 0.95, changefreq: 'weekly' },
  { path: '/srovnani-etf/iwda-vs-cspx', priority: 0.95, changefreq: 'weekly' },
  { path: '/srovnani-etf/vwce-vs-iwda', priority: 0.95, changefreq: 'weekly' },
  { path: '/srovnani-etf/cspx-vs-vwra', priority: 0.95, changefreq: 'weekly' },
  { path: '/srovnani-etf/cspx-vs-vuaa', priority: 0.95, changefreq: 'weekly' },
  { path: '/srovnani-etf/swrd-vs-iwda', priority: 0.95, changefreq: 'weekly' },
  { path: '/srovnani-etf/vwce-vs-vwrl', priority: 0.95, changefreq: 'weekly' },
  { path: '/srovnani-etf/iwda-vs-vwra', priority: 0.95, changefreq: 'weekly' },
  { path: '/srovnani-etf/cspx-vs-eunl', priority: 0.95, changefreq: 'weekly' },
  { path: '/srovnani-etf/vwce-vs-eunl', priority: 0.95, changefreq: 'weekly' },
  { path: '/srovnani-brokeru', priority: 0.9, changefreq: 'monthly' },
  { path: '/portfolio-strategie', priority: 0.9, changefreq: 'monthly' },
  { path: '/portfolio-strategie/akciove-portfolio', priority: 0.85, changefreq: 'monthly' },
  { path: '/portfolio-strategie/dividendove-portfolio', priority: 0.85, changefreq: 'monthly' },
  { path: '/portfolio-strategie/nobel-portfolio', priority: 0.85, changefreq: 'monthly' },
  { path: '/portfolio-strategie/permanentni-portfolio', priority: 0.85, changefreq: 'monthly' },
  { path: '/portfolio-strategie/ray-dalio-all-weather', priority: 0.85, changefreq: 'monthly' },
  { path: '/kalkulacky', priority: 0.9, changefreq: 'monthly' },
  { path: '/kalkulacky/hypotecni-kalkulacka', priority: 0.8, changefreq: 'monthly' },
  { path: '/kalkulacky/cisty-plat-2025', priority: 0.8, changefreq: 'monthly' },
  { path: '/kalkulacky/uverova-kalkulacka', priority: 0.8, changefreq: 'monthly' },
  { path: '/kalkulacky/investicni-kalkulacka', priority: 0.8, changefreq: 'monthly' },
  { path: '/kalkulacky/backtest-portfolia', priority: 0.85, changefreq: 'monthly' },
  { path: '/kalkulacky/monte-carlo-simulator', priority: 0.85, changefreq: 'monthly' },
  { path: '/kalkulacky/fire-kalkulacka', priority: 0.8, changefreq: 'monthly' },
  { path: '/kalkulacky/nouzova-rezerva', priority: 0.8, changefreq: 'monthly' },
  { path: '/kalkulacky/kalkulacka-poplatku-etf', priority: 0.8, changefreq: 'monthly' },
  { path: '/kalkulacky/kurzovy-dopad-etf', priority: 0.8, changefreq: 'monthly' },
  { path: '/kalkulacky/spotrebitelsky-uver', priority: 0.8, changefreq: 'monthly' },
  { path: '/nejlepsi-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-etf-2025', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlevnejsi-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/etf-zdarma-degiro', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-celosvetove-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-sp500-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-msci-world-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-nasdaq-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-dax-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-stoxx600-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-ftse100-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-americke-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-evropske-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-asijsko-pacificke-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-japonske-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-cinske-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-emerging-markets-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-dividendove-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-nemovitostni-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-dluhopisove-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-komoditni-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-zlate-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-technologicke-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-healthcare-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-financni-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-energeticke-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-spotrebni-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-ai-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-robotika-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-clean-energy-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-cloud-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-biotechnologie-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-kyberbezpecnost-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-defense-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-value-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-growth-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-small-cap-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/nejlepsi-etf/nejlepsi-esg-etf', priority: 0.9, changefreq: 'weekly' },
  { path: '/degiro-recenze', priority: 0.85, changefreq: 'monthly' },
  { path: '/xtb-recenze', priority: 0.85, changefreq: 'monthly' },
  { path: '/trading212-recenze', priority: 0.85, changefreq: 'monthly' },
  { path: '/interactive-brokers-recenze', priority: 0.85, changefreq: 'monthly' },
  { path: '/fio-ebroker-recenze', priority: 0.85, changefreq: 'monthly' },
  { path: '/portu-recenze', priority: 0.85, changefreq: 'monthly' },
  { path: '/infografiky', priority: 0.8, changefreq: 'weekly' },
  { path: '/infografiky/nejlepsi-etf-vykonnost', priority: 0.8, changefreq: 'weekly' },
  { path: '/infografiky/nejlevnejsi-etf-ter', priority: 0.8, changefreq: 'weekly' },
  { path: '/infografiky/trzni-heatmapa', priority: 0.8, changefreq: 'weekly' },
  { path: '/nejlepsi-etf-2025', priority: 0.9, changefreq: 'weekly' },
  { path: '/o-nas', priority: 0.7, changefreq: 'monthly' },
]

export async function GET() {
  // Use build time as lastmod
  const now = new Date().toISOString()

  const urls = staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
