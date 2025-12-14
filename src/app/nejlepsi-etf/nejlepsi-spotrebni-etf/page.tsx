import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, ShoppingCartIcon, CoffeeIcon, PackageIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, TrendingUpIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Top 3 doporučené Consumer ETF - editoriální výběr s live daty z databáze
const TOP_3_CONSUMER_ETFS_TEMPLATE = [
  {
    name: "Xtrackers MSCI World Consumer Staples UCITS ETF 1C",
    ticker: "XMCS",
    isin: "IE00BM67HN09",
    provider: "Xtrackers",
    degiroFree: false,
    reason: "Největší globální consumer staples ETF s 731 mil. EUR a TER 0,25%. Defensivní exposure k základním spotřebním artiklům.",
  },
  {
    name: "iShares S&P 500 Consumer Discretionary Sector UCITS ETF (Acc)",
    ticker: "IUCD",
    isin: "IE00B4MCHD36",
    provider: "iShares",
    degiroFree: false,
    reason: "Druhý největší consumer discretionary ETF s 645 mil. EUR a TER 0,15%. Americké spotřební discretionary firmy jako Amazon, Tesla, McDonald's.",
  },
  {
    name: "iShares MSCI Europe Consumer Staples Sector UCITS ETF EUR (Acc)",
    ticker: "IECS",
    isin: "IE00BMW42074",
    provider: "iShares",
    degiroFree: false,
    reason: "Evropský consumer staples ETF s 571 mil. EUR a TER 0,18%. Přístup k evropským spotřebním gigantům jako Nestlé, Unilever, ASML.",
  }
];

// Next.js Metadata API for SSR SEO
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const currentDate = new Intl.DateTimeFormat('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return {
    title: `Nejlepší spotřební ETF ${currentYear} | Srovnání`,
    description: `✅ Srovnání nejlepších spotřebních ETF ${currentYear}. Consumer staples, discretionary, retail - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'spotřební ETF',
      'consumer ETF',
      `nejlepší spotřební ETF ${currentYear}`,
      'consumer staples ETF',
      'consumer discretionary ETF',
      'retail ETF',
      'Coca-Cola ETF',
      'P&G ETF',
      'Amazon ETF',
      'spotřební sektor',
      'základní spotřeba ETF',
      'luxusní zboží ETF',
      'fast fashion ETF',
      'food beverage ETF',
      'Nestlé ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší spotřební ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších spotřebních ETF ${currentYear}. Consumer staples, discretionary, retail - TER, velikost fondů.`,
      type: 'article',
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-spotrebni-etf',
      siteName: 'ETF průvodce.cz',
      locale: 'cs_CZ',
      images: [
        {
          url: '/og-consumer-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší spotřební ETF ${currentYear} - spotřeba`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší spotřební ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších spotřebních ETF ${currentYear}. Consumer staples, discretionary, retail - TER, velikost fondů.`,
      images: ['/og-consumer-etf.jpg']
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-spotrebni-etf'
    }
  };
}

export default async function NejlepsiSpotrebniETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-spotrebitelske-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší spotřební ETF ${currentYear} - consumer staples a discretionary`,
    "description": "Srovnání nejlepších spotřebních ETF 2025. Consumer staples, discretionary, retail - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-consumer-etf.jpg",
    "author": {
      "@type": "Person",
      "name": "Tomáš Kostrhoun",
      "url": "https://www.etfpruvodce.cz/o-nas#tomas-kostrhoun"
    },
    "publisher": { 
      "@type": "Organization", 
      "name": "ETF průvodce.cz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.etfpruvodce.cz/logo.png"
      }
    },
    "datePublished": "2025-01-15",
    "dateModified": lastModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-spotrebni-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "spotřební ETF, consumer staples, consumer discretionary, retail, spotřební sektor",
    "wordCount": 2600,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Consumer ETF",
        "description": "Exchange-traded funds focused on consumer sector stocks including staples and discretionary companies"
      },
      {
        "@type": "FinancialProduct",
        "name": "Xtrackers MSCI World Consumer Staples UCITS ETF 1C",
        "identifier": "IE00BM67HN09"
      },
      {
        "@type": "FinancialProduct", 
        "name": "iShares S&P 500 Consumer Discretionary Sector UCITS ETF (Acc)",
        "identifier": "IE00B4MCHD36"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares MSCI Europe Consumer Staples Sector UCITS ETF EUR (Acc)", 
        "identifier": "IE00BMW42074"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Consumer Sector",
        "description": "Industry sector including consumer staples and discretionary companies"
      },
      {
        "@type": "Thing", 
        "name": "Consumer Investing",
        "description": "Investment strategy focused on consumer behavior and spending patterns"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší spotřební ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší spotřební ETF jsou: Xtrackers MSCI World Consumer Staples UCITS ETF (IE00BM67HK77) největší globální consumer staples ETF s 731 mil. EUR a TER 0,25%, iShares S&P 500 Consumer Discretionary Sector UCITS ETF (IE00B3WJKD61) s 645 mil. EUR a TER 0,15%, a iShares MSCI Europe Consumer Staples Sector UCITS ETF (IE00B4K6BW65) s 571 mil. EUR a TER 0,18%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou spotřební ETF a jaké firmy obsahují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Spotřební ETF investují do spotřebních společností jako Coca-Cola, P&G, Nestlé, Unilever, Amazon, Tesla a dalších consumer staples (základní spotřeba) a consumer discretionary (neesenciální spotřeba) firem. Sledují spotřební sektory různých indexů a poskytují diverzifikovaný přístup k investování do spotřeby."
        }
      },
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi Consumer Staples a Consumer Discretionary ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Consumer Staples ETF investují do základní spotřeby (potraviny, nápoje, hygienické produkty) - defensivní sektor s stabilní poptávkou. Consumer Discretionary ETF zahrnují neesenciální spotřebu (luxusní zboží, restaurace, zábava) - cyklický sektor citlivý na ekonomické podmínky."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Domů",
        "item": "https://www.etfpruvodce.cz"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Nejlepší ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf"
      },
      {
        "@type": "ListItem",
        "position": 3, 
        "name": "Nejlepší spotřební ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-spotrebni-etf"
      }
    ]
  };

  return (
    <Layout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-rose-50/30 to-purple-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-rose-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-pink-200/50">
                <ShoppingCartIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
                  spotřební ETF
                </span>
              </h1>

              {/* Author byline - E-E-A-T signal */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Autor: </span>
                <a
                  href="/o-nas"
                  className="text-violet-600 hover:text-violet-700 font-medium hover:underline"
                >
                  Tomáš Kostrhoun
                </a>
                <span className="text-gray-400">•</span>
                <span>
                  Aktualizováno: {new Date(lastModified).toLocaleDateString('cs-CZ', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Kompletní srovnání nejlepších spotřebních ETF. 
                Consumer staples, discretionary a retail včetně Coca-Cola, P&G a Amazon.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    Spotřební trendy
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl mb-3">
                    <ShoppingCartIcon className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Spotřební sektor v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro spotřební investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-pink-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CoffeeIcon className="w-4 h-4 text-pink-600" />
                      <span className="text-xs text-gray-500 font-medium">STAPLES ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">731M</div>
                    <div className="text-xs text-gray-600">World Consumer Staples</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-rose-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarIcon className="w-4 h-4 text-rose-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,12%</div>
                    <div className="text-xs text-gray-600">USA Consumer</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-pink-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <PackageIcon className="w-4 h-4 text-pink-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP HOLDING</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">3%</div>
                    <div className="text-xs text-gray-600">Amazon podíl</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-rose-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <UsersIcon className="w-4 h-4 text-rose-600" />
                      <span className="text-xs text-gray-500 font-medium">DEFENSIVNÍ</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">Staples</div>
                    <div className="text-xs text-gray-600">stabilní poptávka</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section id="uvod" className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-pink-100 w-20 h-20 mx-auto mb-8 hover:bg-pink-200 transition-colors hover-scale">
              <ShoppingCartIcon className="w-10 h-10 text-pink-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou spotřební ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na spotřební sektor rozdělený na základní spotřebu (staples) 
              a neesenciální spotřebu (discretionary) s expozicí ke spotřebitelským trendům
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <CoffeeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-pink-800 transition-colors">Consumer Staples</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Základní spotřeba - potraviny, nápoje, hygienické produkty. 
                Defensivní sektor s stabilní poptávkou nezávislou na ekonomických cyklech.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-purple-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <PackageIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-rose-800 transition-colors">Consumer Discretionary</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Neesenciální spotřeba - luxusní zboží, restaurace, zábava, automobily. 
                Cyklický sektor citlivý na ekonomické podmínky a příjmy spotřebitelů.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUpIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-purple-800 transition-colors">Spotřebitelské trendy</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                E-commerce, udržitelnost, zdravý životní styl a digitální transformace 
                formují budoucnost spotřebního sektoru a jeho investiční příležitosti.
              </p>
            </div>
          </div>
        </div>
      </section>

            {/* Top 3 Recommendations - Server-side rendered with real data */}
      <section id="top3" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top 3 ETF v této kategorii
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení na základě analýzy {etfs.length} ETF fondů
            </p>
          </div>
          <Top3ETFServer etfs={etfs} currency="EUR" />
        </div>
      </section>

      <Top10SectionsServer etfs={etfs} currency="EUR" categoryName="spotřební" />

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Často kladené otázky</h2>
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o spotřebních ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-pink-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-pink-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-pink-800">Jaké jsou nejlepší spotřební ETF v roce 2025?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-pink-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší spotřební ETF jsou: <strong>Xtrackers MSCI World Consumer Staples UCITS ETF</strong> (IE00BM67HK77) 
                největší globální consumer staples ETF s 731 mil. EUR a TER 0,25%, <strong>iShares S&P 500 Consumer Discretionary Sector UCITS ETF</strong> (IE00B3WJKD61) 
                s 645 mil. EUR a TER 0,15%, a <strong>iShares MSCI Europe Consumer Staples Sector UCITS ETF</strong> 
                (IE00B4K6BW65) s 571 mil. EUR a TER 0,18%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-pink-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-pink-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-pink-800">Co jsou spotřební ETF a jaké firmy obsahují?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-pink-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Spotřební ETF</strong> investují do spotřebních společností jako Coca-Cola, P&G, Nestlé, 
                Unilever, Amazon, Tesla a dalších consumer staples (základní spotřeba) a consumer discretionary 
                (neesenciální spotřeba) firem. Sledují spotřební sektory různých indexů a poskytují diverzifikovaný přístup k investování do spotřeby.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-pink-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-pink-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-pink-800">Jaký je rozdíl mezi Consumer Staples a Consumer Discretionary ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-pink-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Consumer Staples ETF</strong> investují do základní spotřeby (potraviny, nápoje, hygienické produkty) - 
                defensivní sektor s stabilní poptávkou. <strong>Consumer Discretionary ETF</strong> zahrnují neesenciální spotřebu 
                (luxusní zboží, restaurace, zábava) - cyklický sektor citlivý na ekonomické podmínky.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Linking */}
      <InternalLinking 
        relatedLinks={[
          {
            href: "/nejlepsi-etf/nejlepsi-dividendove-etf", 
            title: "Nejlepší dividendové ETF",
            description: "Spotřební sektor s dividendami"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-esg-etf",
            title: "Nejlepší ESG ETF", 
            description: "Udržitelná spotřeba"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-value-etf",
            title: "Nejlepší Value ETF",
            description: "Value přístup ke spotřebě"
          }
        ]}
      />
    </Layout>
  );
}