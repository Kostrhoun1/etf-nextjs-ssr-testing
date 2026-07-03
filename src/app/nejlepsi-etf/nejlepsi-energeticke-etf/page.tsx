import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, StarIcon, BarChart3Icon, TargetIcon, FuelIcon, LeafIcon, SunIcon, DollarIcon, DollarSignIcon, RocketIcon, ZapIcon, UsersIcon, TrendingUpIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
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
    title: `Nejlepší energetické ETF ${currentYear} | Srovnání`,
    description: `✅ Srovnání nejlepších energetických ETF ${currentYear}. Ropa, plyn, čistá energie, utilities - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'energetické ETF',
      'energy ETF',
      `nejlepší energetické ETF ${currentYear}`,
      'oil ETF',
      'gas ETF',
      'clean energy ETF',
      'čistá energie ETF',
      'utilities ETF',
      'Shell ETF',
      'Exxon ETF',
      'TotalEnergies ETF',
      'energetický sektor',
      'obnovitelné zdroje ETF',
      'ropné ETF',
      'sluneční energie ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší energetické ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších energetických ETF ${currentYear}. Ropa, plyn, čistá energie, utilities - TER, velikost fondů.`,
      type: 'article',
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-energeticke-etf',
      siteName: 'ETF průvodce.cz',
      locale: 'cs_CZ',
      images: [
        {
          url: '/og-energy-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší energetické ETF ${currentYear} - energie`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší energetické ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších energetických ETF ${currentYear}. Ropa, plyn, čistá energie, utilities - TER, velikost fondů.`,
      images: ['/og-energy-etf.jpg']
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-energeticke-etf'
    }
  };
}

export default async function NejlepsiEnergetickeETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-energeticke-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší energetické ETF ${currentYear} - ropa, plyn a čistá energie`,
    "description": "Srovnání nejlepších energetických ETF 2026. Ropa, plyn, čistá energie, utilities - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-energy-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-energeticke-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "energetické ETF, ropa, plyn, čistá energie, utilities, energy sektor",
    "wordCount": 2700,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Energy ETF",
        "description": "Exchange-traded funds focused on energy sector stocks including oil, gas and clean energy companies"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Global Clean Energy Transition UCITS ETF USD (Dist)",
        "identifier": "IE00B1XNHC34"
      },
      {
        "@type": "FinancialProduct", 
        "name": "Xtrackers MSCI World Energy UCITS ETF 1C",
        "identifier": "IE00BM67HM91"
      },
      {
        "@type": "FinancialProduct",
        "name": "SPDR MSCI Europe Energy UCITS ETF", 
        "identifier": "IE00BKWQ0F09"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Energy Sector",
        "description": "Industry sector including oil, gas, utilities and renewable energy companies"
      },
      {
        "@type": "Thing", 
        "name": "Clean Energy Transition",
        "description": "Global shift from fossil fuels to renewable energy sources like solar, wind and hydro"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší energetické ETF v roce 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší energetické ETF jsou: iShares Global Clean Energy Transition UCITS ETF (IE00B1XNHC34) největší čistá energie ETF s 2,0 mld. EUR a TER 0,65%, Xtrackers MSCI World Energy UCITS ETF (IE00BM67HM91) s 785 mil. EUR a TER 0,25%, a SPDR MSCI Europe Energy UCITS ETF (IE00BKWQ0F09) s 693 mil. EUR a TER 0,18%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou energetické ETF a jaké firmy obsahují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Energetické ETF investují do energetických společností jako Shell, Exxon Mobil, TotalEnergies, Chevron, ConocoPhillips a dalších ropných, plynárenských a utilities firem. Zahrnují také čistou energii jako sluneční, větrnou a hydroelektrickou energii. Sledují energetické sektory různých indexů."
        }
      },
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi tradičními a clean energy ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tradiční energetické ETF investují do ropných a plynárenských společností jako Shell a Exxon. Clean energy ETF se zaměřují na obnovitelné zdroje energie, sluneční panely, větrné turbíny a energetickou transformaci. Clean energy ETF mají vyšší růstový potenciál, ale také vyšší volatilitu."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou náklady na energetické ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TER (celkové náklady) energetických ETF se pohybují od 0,15% do 0,65% ročně. Nejnižší má SPDR MSCI Europe Energy ETF (IE00BKWQ0F09) s TER 0,18%, Xtrackers MSCI World Energy ETF (IE00BM67HM91) má TER 0,25%, nejvyšší má iShares Global Clean Energy Transition ETF (IE00B1XNHC34) s TER 0,65%."
        }
      },
      {
        "@type": "Question",
        "name": "Jaká jsou rizika energetických ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Energetické ETF mají vysokou volatilitu - volatilita může dosáhnout 25-35% ročně. Hlavní rizika: závislost na cenách ropy a plynu, geopolitické napětí, regulační změny (zejména u čisté energie), cyklické výkyvy ekonomiky. Clean energy ETF jsou ještě volatilnější kvůli technologickým změnám a dotačním politikám."
        }
      },
      {
        "@type": "Question",
        "name": "Kde koupit energetické ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Energetické ETF koupíte u brokerů jako DEGIRO, XTB, Trading212 nebo Interactive Brokers. Naše TOP 3 ETF: iShares Global Clean Energy (IE00B1XNHC34), Xtrackers MSCI World Energy (IE00BM67HM91) a SPDR MSCI Europe Energy (IE00BKWQ0F09) jsou dostupné na všech hlavních evropských burzách."
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
        "name": "Nejlepší energetické ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-energeticke-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-orange-50/30 to-red-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-red-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-yellow-200/50">
                <FuelIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  energetické ETF
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
                Kompletní srovnání nejlepších energetických ETF. 
                Ropa, plyn, čistá energie a utilities včetně Shell, Exxon a obnovitelných zdrojů.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <FuelIcon className="w-5 h-5 mr-2" />
                    Energetické trendy
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-3">
                    <FuelIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Energetický sektor v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro energetické investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-yellow-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <LeafIcon className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-gray-500 font-medium">CLEAN ENERGY ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">2,0B</div>
                    <div className="text-xs text-gray-600">Global Clean Energy</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSignIcon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,15%</div>
                    <div className="text-xs text-gray-600">S&P 500 Utilities</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-yellow-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <SunIcon className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP CLEAN HOLDING</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">3%</div>
                    <div className="text-xs text-gray-600">Tesla podíl</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUpIcon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">VOLATILITA</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">25%</div>
                    <div className="text-xs text-gray-600">vysoká cyklická</div>
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
            <div className="flex items-center justify-center rounded-full bg-yellow-100 w-20 h-20 mx-auto mb-8 hover:bg-yellow-200 transition-colors hover-scale">
              <FuelIcon className="w-10 h-10 text-yellow-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou energetické ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na energetický sektor včetně ropných, plynárenských společností, 
              utilities a nových obnovitelných zdrojů energie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FuelIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-yellow-800 transition-colors">Tradiční energie</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Ropné a plynárenské giganty jako Shell, Exxon Mobil, Chevron a TotalEnergies. 
                Citlivé na ceny komodit a geopolitickou situaci.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <LeafIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-orange-800 transition-colors">Čistá energie</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Obnovitelné zdroje energie - solární, větrná, vodní energie. 
                Vysoký růstový potenciál s podporou klimatických politik.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-yellow-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ZapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-red-800 transition-colors">Cyklický charakter</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Energetický sektor je silně cyklický a volatilní. 
                Ovlivňován cenami ropy, plynu a makroekonomickými faktory.
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
              🏆 Top 3 nejlepší energetické ETF
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení na základě analýzy velikosti fondů a diverzifikace energetického sektoru
            </p>
          </div>

          <Top3ETFServer etfs={etfs.slice(0, 3)} currency="CZK" />
        </div>
      </section>

      <Top10SectionsServer etfs={etfs} currency="CZK" categoryName="energetické" />

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Často kladené otázky</h2>
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o energetických ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">Jaké jsou nejlepší energetické ETF v roce 2026?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší energetické ETF jsou: <strong>iShares Global Clean Energy Transition UCITS ETF</strong> (IE00B1XNHC34) 
                největší čistá energie ETF s 2,0 mld. EUR a TER 0,65%, <strong>Xtrackers MSCI World Energy UCITS ETF</strong> (IE00BM67HM91) 
                s 785 mil. EUR a TER 0,25%, a <strong>SPDR MSCI Europe Energy UCITS ETF</strong> 
                (IE00BKWQ0F09) s 693 mil. EUR a TER 0,18%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">Co jsou energetické ETF a jaké firmy obsahují?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Energetické ETF</strong> investují do energetických společností jako Shell, Exxon Mobil, 
                TotalEnergies, Chevron, ConocoPhillips a dalších ropných, plynárenských a utilities firem. 
                Zahrnují také čistou energii jako sluneční, větrnou a hydroelektrickou energii. Sledují energetické sektory různých indexů.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">Jaký je rozdíl mezi tradičními a clean energy ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Tradiční energetické ETF</strong> investují do ropných a plynárenských společností jako Shell a Exxon. 
                <strong>Clean energy ETF</strong> se zaměřují na obnovitelné zdroje energie, sluneční panely, větrné turbíny 
                a energetickou transformaci. Clean energy ETF mají vyšší růstový potenciál, ale také vyšší volatilitu.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">Jaké jsou náklady na energetické ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>TER (celkové náklady) energetických ETF</strong> se pohybují od 0,15% do 0,65% ročně. Nejnižší má SPDR MSCI Europe Energy ETF (IE00BKWQ0F09) s TER 0,18%, Xtrackers MSCI World Energy ETF (IE00BM67HM91) má TER 0,25%, nejvyšší má iShares Global Clean Energy Transition ETF (IE00B1XNHC34) s TER 0,65%. Počítejte také s transakčními poplatky u brokera.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">Jaká jsou rizika energetických ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Energetické ETF mají vysokou volatilitu</strong> - volatilita může dosáhnout 25-35% ročně. Hlavní rizika: závislost na cenách ropy a plynu, geopolitické napětí, regulační změny (zejména u čisté energie), cyklické výkyvy ekonomiky. Clean energy ETF jsou ještě volatilnější kvůli technologickým změnám a dotačním politikám.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">Kde koupit energetické ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Energetické ETF koupíte u brokerů jako <strong>DEGIRO, XTB, Trading212 nebo Interactive Brokers</strong>. Naše TOP 3 ETF: iShares Global Clean Energy (IE00B1XNHC34), Xtrackers MSCI World Energy (IE00BM67HM91) a SPDR MSCI Europe Energy (IE00BKWQ0F09) jsou dostupné na všech hlavních evropských burzách. Porovnejte si poplatky brokerů před investicí.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Linking */}
      <InternalLinking 
        relatedLinks={[
          {
            href: "/nejlepsi-etf/nejlepsi-clean-energy-etf", 
            title: "Nejlepší Clean Energy ETF",
            description: "Čistá energie a obnovitelné zdroje"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-komoditni-etf",
            title: "Nejlepší komoditní ETF", 
            description: "Ropa, zlato a další komodity"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-dividendove-etf",
            title: "Nejlepší dividendové ETF",
            description: "Energie s vysokými dividendami"
          }
        ]}
      />
    </Layout>
  );
}