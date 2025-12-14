import { Metadata } from 'next'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, CpuIcon, SmartphoneIcon, MonitorIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, TrendingUpIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import ETFTableServer from '@/components/etf/ETFTableServer';
import { getTopETFsForCategory, categoryConfigs, getTotalETFCount } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Next.js Metadata API for SSR SEO
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const currentDate = new Intl.DateTimeFormat('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return {
    title: `Nejlepší technologické ETF ${currentYear} | Srovnání`,
    description: `✅ Srovnání nejlepších technologických ETF ${currentYear}. NASDAQ 100, S&P 500 Tech, Information Technology - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'technologické ETF',
      'tech ETF',
      `nejlepší technologické ETF ${currentYear}`,
      'NASDAQ 100 ETF',
      'S&P 500 Technology ETF',
      'Information Technology ETF',
      'Apple ETF',
      'Microsoft ETF',
      'Google ETF',
      'technologický sektor',
      'IT ETF',
      'software ETF',
      'hardware ETF',
      'FAANG ETF',
      'big tech ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší technologické ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších technologických ETF ${currentYear}. NASDAQ 100, S&P 500 Tech, Information Technology - TER, velikost fondů.`,
      type: 'article',
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-technologicke-etf',
      siteName: 'ETF průvodce.cz',
      locale: 'cs_CZ',
      images: [
        {
          url: '/og-technology-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší technologické ETF ${currentYear} - NASDAQ 100`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší technologické ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších technologických ETF ${currentYear}. NASDAQ 100, S&P 500 Tech, Information Technology - TER, velikost fondů.`,
      images: ['/og-technology-etf.jpg']
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-technologicke-etf'
    }
  };
}

export default async function NejlepsiTechnologickeETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-technologicke-etf'];
  const [etfs, lastModified, totalCount] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
    getTotalETFCount(),
  ]);

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší technologické ETF ${currentYear} - NASDAQ 100 a tech sektory`,
    "description": "Srovnání nejlepších technologických ETF 2025. NASDAQ 100, S&P 500 Tech, Information Technology - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-technology-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-technologicke-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "technologické ETF, NASDAQ 100, S&P 500 Technology, Information Technology, tech sektor",
    "wordCount": 2800,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Technology ETF",
        "description": "Exchange-traded funds focused on technology sector stocks like Apple, Microsoft, Google"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Nasdaq 100 UCITS ETF (Acc)",
        "identifier": "IE00B53SZB19"
      },
      {
        "@type": "FinancialProduct", 
        "name": "iShares S&P 500 Information Technology Sector UCITS ETF USD (Acc)",
        "identifier": "IE00B3WJKG14"
      },
      {
        "@type": "FinancialProduct",
        "name": "Invesco EQQQ Nasdaq-100 UCITS ETF", 
        "identifier": "IE0032077012"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "NASDAQ 100",
        "description": "Index of 100 largest non-financial companies on NASDAQ, dominated by tech giants"
      },
      {
        "@type": "Thing", 
        "name": "Technology Sector Investing",
        "description": "Investment strategy focused on technology companies like Apple, Microsoft, Google, Amazon"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší technologické ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší technologické ETF jsou: iShares Nasdaq 100 UCITS ETF (IE00B53SZB19) největší tech ETF s 17,9 mld. EUR a TER 0,30%, iShares S&P 500 Information Technology Sector UCITS ETF (IE00B3WJKG14) s 12,3 mld. EUR a TER 0,15%, a Invesco EQQQ Nasdaq-100 UCITS ETF (IE0032077012) s 9,4 mld. EUR a TER 0,30%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou technologické ETF a jaké firmy obsahují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Technologické ETF investují do technologických společností jako Apple, Microsoft, Google (Alphabet), Amazon, Tesla, NVIDIA a dalších tech gigantů. Sledují indexy jako NASDAQ 100 nebo S&P 500 Information Technology sektor a poskytují diverzifikovaný přístup k investování do technologického sektoru."
        }
      },
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi NASDAQ 100 ETF a S&P 500 Technology ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "NASDAQ 100 ETF obsahuje 100 největších nebankovních společností na NASDAQ burze (cca 50% technologie, ale i jiné sektory). S&P 500 Technology ETF je čistě zaměřený na technologický sektor S&P 500 indexu. NASDAQ 100 je diversifikovanější, zatímco S&P 500 Tech je čistě technologický."
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
        "name": "Nejlepší technologické ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-technologicke-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
                <CpuIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  technologické ETF
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
                Kompletní srovnání nejlepších technologických ETF. 
                NASDAQ 100, S&P 500 Technology a Information Technology včetně Apple, Microsoft a Google.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <CpuIcon className="w-5 h-5 mr-2" />
                    Tech inovace
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                    <CpuIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Technologický sektor v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro tech investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <MonitorIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ TECH ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">17,9B</div>
                    <div className="text-xs text-gray-600">NASDAQ 100 iShares</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarIcon className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,15%</div>
                    <div className="text-xs text-gray-600">S&P 500 IT sektor</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <SmartphoneIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP HOLDING</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">7%</div>
                    <div className="text-xs text-gray-600">Apple podíl</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUpIcon className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs text-gray-500 font-medium">10Y VÝNOS</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">15%</div>
                    <div className="text-xs text-gray-600">ročně historicky</div>
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
            <div className="flex items-center justify-center rounded-full bg-blue-100 w-20 h-20 mx-auto mb-8 hover:bg-blue-200 transition-colors hover-scale">
              <CpuIcon className="w-10 h-10 text-blue-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou technologické ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na technologické společnosti jako Apple, Microsoft, Google, 
              Amazon a další tech giganty s nejvyšším růstovým potenciálem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MonitorIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-800 transition-colors">FAANG a tech giganty</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Investice do největších technologických společností světa - 
                Apple, Microsoft, Google, Amazon, Meta a dalších lídrů inovací.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <RocketIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-indigo-800 transition-colors">Dlouhodobý růst</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Technologický sektor historicky dosahuje nejvyšších výnosů 
                díky neustálým inovacím, digitalizaci a rostoucí poptávce.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ZapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-purple-800 transition-colors">Budoucnost ekonomiky</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                AI, cloud computing, elektromobilita a další trendy 
                formují budoucnost a technologické ETF vám dají přístup k těmto inovacím.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top 3 ETF Section - Server-side rendered with real data */}
      <section id="top3" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top 3 nejlepší technologické ETF
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení na základě analýzy {etfs.length} technologických ETF fondů
            </p>
          </div>

          <Top3ETFServer etfs={etfs} currency="EUR" />
        </div>
      </section>

      {/* Full ETF Table - Server-side rendered */}
      <section id="srovnani" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kompletní srovnání technologických ETF
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Top {Math.min(50, etfs.length)} technologických ETF seřazených podle ratingu a velikosti
            </p>
          </div>

          <ETFTableServer etfs={etfs} showRank={true} currency="EUR" maxRows={50} />

          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-2">
              <a href="/srovnani-etf">
                Zobrazit všech {totalCount.toLocaleString('cs-CZ')} ETF fondů
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Často kladené otázky</h2>
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o technologických ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Jaké jsou nejlepší technologické ETF v roce 2025?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší technologické ETF jsou: <strong>iShares Nasdaq 100 UCITS ETF</strong> (IE00B53SZB19) 
                největší tech ETF s 17,9 mld. EUR a TER 0,30%, <strong>iShares S&P 500 Information Technology Sector UCITS ETF</strong> (IE00B3WJKG14) 
                s 12,3 mld. EUR a TER 0,15%, a <strong>Invesco EQQQ Nasdaq-100 UCITS ETF</strong> 
                (IE0032077012) s 9,4 mld. EUR a TER 0,30%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Co jsou technologické ETF a jaké firmy obsahují?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Technologické ETF</strong> investují do technologických společností jako Apple, Microsoft, Google (Alphabet), 
                Amazon, Tesla, NVIDIA a dalších tech gigantů. Sledují indexy jako NASDAQ 100 nebo S&P 500 Information Technology 
                sektor a poskytují diverzifikovaný přístup k investování do technologického sektoru.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Jaký je rozdíl mezi NASDAQ 100 ETF a S&P 500 Technology ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>NASDAQ 100 ETF</strong> obsahuje 100 největších nebankovních společností na NASDAQ burze 
                (cca 50% technologie, ale i jiné sektory). <strong>S&P 500 Technology ETF</strong> je čistě zaměřený 
                na technologický sektor S&P 500 indexu. NASDAQ 100 je diversifikovanější, zatímco S&P 500 Tech je čistě technologický.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Linking */}
      <InternalLinking 
        relatedLinks={[
          {
            href: "/nejlepsi-etf/nejlepsi-nasdaq-etf", 
            title: "Nejlepší NASDAQ ETF",
            description: "Specializované NASDAQ 100 fondy"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-ai-etf",
            title: "Nejlepší AI ETF", 
            description: "Umělá inteligence a robotika"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-growth-etf",
            title: "Nejlepší Growth ETF",
            description: "Růstové ETF pro tech investory"
          }
        ]}
      />
    </Layout>
  );
}