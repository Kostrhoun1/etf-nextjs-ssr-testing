import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, LeafIcon, SunIcon, WindIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Top 3 doporučené Clean Energy ETF - editoriální výběr s live daty z databáze
const TOP_3_CLEAN_ENERGY_ETFS_TEMPLATE = [
  {
    name: "iShares Global Clean Energy Transition UCITS ETF USD (Dist)",
    ticker: "ICLN",
    isin: "IE00B1XNHC34",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší čistá energie ETF s 2,0 mld. EUR a TER 0,65%. Globální exposure k obnovitelným zdrojům a energetické transformaci.",
  },
  {
    name: "iShares Global Water UCITS ETF",
    ticker: "IH2O",
    isin: "IE00B1TXK627",
    provider: "iShares",
    degiroFree: false,
    reason: "Druhý největší s 1,96 mld. EUR a TER 0,65%. Zaměření na vodní hospodářství a udržitelnou správu vodních zdrojů.",
  },
  {
    name: "L&G Clean Water UCITS ETF",
    ticker: "WTRD",
    isin: "IE00BK5BC891",
    provider: "L&G (LGIM)",
    degiroFree: false,
    reason: "Specializovaný water ETF s 513 mil. EUR a TER 0,49%. Čisté exposure k technologiím čištění a správy vody.",
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
    title: `Nejlepší clean energy ETF ${currentYear} | Srovnání`,
    description: `✅ Srovnání nejlepších clean energy ETF ${currentYear}. Solární, větrná, vodní energie - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'clean energy ETF',
      'čistá energie ETF',
      `nejlepší clean energy ETF ${currentYear}`,
      'obnovitelné zdroje ETF',
      'solární energie ETF',
      'větrná energie ETF',
      'vodní energie ETF',
      'green energy ETF',
      'zelená energie ETF',
      'udržitelná energie ETF',
      'photovoltaika ETF',
      'environmentální ETF',
      'ESG energie ETF',
      'klimatické ETF',
      'renewable energy ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší clean energy ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších clean energy ETF ${currentYear}. Solární, větrná, vodní energie - TER, velikost fondů.`,
      type: 'article',
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-clean-energy-etf',
      siteName: 'ETF průvodce.cz',
      locale: 'cs_CZ',
      images: [
        {
          url: '/og-clean-energy-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší clean energy ETF ${currentYear} - čistá energie`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší clean energy ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších clean energy ETF ${currentYear}. Solární, větrná, vodní energie - TER, velikost fondů.`,
      images: ['/og-clean-energy-etf.jpg']
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-clean-energy-etf'
    }
  };
}

export default async function NejlepsiCleanEnergyETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-clean-energy-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší clean energy ETF ${currentYear} - čistá energie a obnovitelné zdroje`,
    "description": "Srovnání nejlepších clean energy ETF 2026. Solární, větrná, vodní energie - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-clean-energy-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-clean-energy-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "clean energy ETF, čistá energie, obnovitelné zdroje, solární energie, větrná energie",
    "wordCount": 2900,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Clean Energy ETF",
        "description": "Exchange-traded funds focused on renewable energy and clean technology companies"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Global Clean Energy Transition UCITS ETF USD (Dist)",
        "identifier": "IE00B1XNHC34"
      },
      {
        "@type": "FinancialProduct", 
        "name": "iShares Global Water UCITS ETF",
        "identifier": "IE00B1TXK627"
      },
      {
        "@type": "FinancialProduct",
        "name": "L&G Clean Water UCITS ETF", 
        "identifier": "IE00BK5BC891"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Clean Energy Transition",
        "description": "Global shift from fossil fuels to renewable energy sources like solar, wind and hydro"
      },
      {
        "@type": "Thing", 
        "name": "Renewable Energy Investment",
        "description": "Investment strategy focused on companies developing sustainable energy solutions"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší clean energy ETF v roce 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší clean energy ETF jsou: iShares Global Clean Energy Transition UCITS ETF (IE00B1XNHC34) největší čistá energie ETF s 2,0 mld. EUR a TER 0,65%, iShares Global Water UCITS ETF (IE00B1TXK627) s 1,96 mld. EUR a TER 0,65%, a L&G Clean Water UCITS ETF (IE00BK5BC891) s 513 mil. EUR a TER 0,49%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou clean energy ETF a jaké firmy obsahují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Clean energy ETF investují do společností vyvíjejících obnovitelné zdroje energie jako solární panely, větrné turbíny, vodní elektrárny a úložiště energie. Obsahují firmy jako NextEra Energy, Tesla, Vestas Wind Systems a další lídry v zelené energetice."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do clean energy ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Energetická transformace je největší investiční trend 21. století. Vlády investují biliony do Green Dealu a dekarbonizace. Clean energy ETF poskytují exposure k tomuto megatrendu s dlouhodobým růstovým potenciálem při přechodu na udržitelnou energetiku."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou náklady na clean energy ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TER clean energy ETF se pohybuje od 0,49% do 0,65% ročně. Nejnižší poplatky má L&G Clean Water ETF (0,49%), iShares clean energy ETF mají TER 0,65%. Kromě TER počítejte s transakčními poplatky u brokera."
        }
      },
      {
        "@type": "Question",
        "name": "Jaká jsou rizika clean energy ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Clean energy ETF jsou vysoce volatilní a citlivé na vládní politiku, změny dotací a regulací. Rizika zahrnují technologickou obsolescenci, konkurenci z fosilních paliv a ekonomické cykly. Doporučuje se jako menší část portfolia (5-15%)."
        }
      },
      {
        "@type": "Question",
        "name": "Kde koupit clean energy ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Clean energy ETF můžete koupit u všech hlavních brokerů: XTB, Interactive Brokers, Trading 212, Degiro. Naše TOP 3 doporučené ETF - iShares Clean Energy (IE00B1XNHC34), iShares Water (IE00B1TXK627) a L&G Clean Water (IE00BK5BC891) - jsou dostupné na všech platformách."
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
        "name": "Nejlepší clean energy ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-clean-energy-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-teal-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-green-200/50">
                <LeafIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  clean energy ETF
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
                Kompletní srovnání nejlepších clean energy ETF. 
                Solární, větrná a vodní energie včetně NextEra Energy, Tesla a Vestas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <LeafIcon className="w-5 h-5 mr-2" />
                    Green Deal
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
                    <LeafIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Clean energy v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro zelené investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <LeafIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ CLEAN ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">2,0B</div>
                    <div className="text-xs text-gray-600">iShares Clean Energy</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarIcon className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,49%</div>
                    <div className="text-xs text-gray-600">L&G Clean Water</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <SunIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP HOLDING</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">5%</div>
                    <div className="text-xs text-gray-600">NextEra Energy</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <WindIcon className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-gray-500 font-medium">GREEN DEAL EU</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">1T€</div>
                    <div className="text-xs text-gray-600">investice do 2030</div>
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
            <div className="flex items-center justify-center rounded-full bg-green-100 w-20 h-20 mx-auto mb-8 hover:bg-green-200 transition-colors hover-scale">
              <LeafIcon className="w-10 h-10 text-green-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou clean energy ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na společnosti vyvíjející obnovitelné zdroje energie 
              a technologie pro udržitelnou budoucnost
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <SunIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-green-800 transition-colors">Energetická transformace</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Globální přechod od fosilních paliv k obnovitelným zdrojům energie. 
                Největší investiční příležitost 21. století s vládní podporou.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <WindIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-emerald-800 transition-colors">Technologické inovace</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Pokroky v solárních panelech, větrných turbínách a bateriích 
                dramaticky snižují náklady zelené energie pod úroveň uhlí a plynu.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-green-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ZapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-teal-800 transition-colors">ESG mandáty</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Institucionální investoři s ESG mandáty přesouvají biliony dolarů 
                do udržitelných investic, čímž pohánějí růst clean energy sektoru.
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
          <Top3ETFServer etfs={etfs} currency="CZK" />
        </div>
      </section>

      <Top10SectionsServer etfs={etfs} currency="CZK" categoryName="Clean Energy" />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Selection Guide */}
          <div id="pruvodce" className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-12 border border-green-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-green-100 to-emerald-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                💡 Jak vybrat ten správný clean energy ETF?
              </h4>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Praktický průvodce výběrem podle vašeho investičního profilu
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <h5 className="text-lg font-bold text-blue-800">Pro začátečníky</h5>
                </div>
                <p className="text-blue-700 leading-relaxed">
                  Začněte s velkými, diverzifikovanými clean energy ETF s nižším rizikem. 
                  Zaměřte se na stabilní poskytovatele jako iShares a fondy s velikostí nad 1 mld. EUR.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <h5 className="text-lg font-bold text-green-800">Pro pokročilé</h5>
                </div>
                <p className="text-green-700 leading-relaxed">
                  Porovnejte zaměření ETF - některé se specializují na solární energii, 
                  jiné na větrnou energii nebo vodní hospodářství. Zvažte geografické exposure.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <h5 className="text-lg font-bold text-purple-800">Pro rizikové investory</h5>
                </div>
                <p className="text-purple-700 leading-relaxed">
                  Specializované clean energy ETF nabízejí vyšší potenciál růstu, 
                  ale i větší volatilitu. Ideální pro investory s dlouhodobým horizontem.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-bold text-sm">4</span>
                  </div>
                  <h5 className="text-lg font-bold text-orange-800">Pro ESG investory</h5>
                </div>
                <p className="text-orange-700 leading-relaxed">
                  Clean energy ETF jsou přirozeně ESG kompatibilní. 
                  Kombinujte s širšími ESG ETF pro kompletní udržitelné portfolio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Často kladené otázky</h2>
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o clean energy ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jaké jsou nejlepší clean energy ETF v roce 2026?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší clean energy ETF jsou: <strong>iShares Global Clean Energy Transition UCITS ETF</strong> (IE00B1XNHC34) 
                největší čistá energie ETF s 2,0 mld. EUR a TER 0,65%, <strong>iShares Global Water UCITS ETF</strong> (IE00B1TXK627) 
                s 1,96 mld. EUR a TER 0,65%, a <strong>L&G Clean Water UCITS ETF</strong> 
                (IE00BK5BC891) s 513 mil. EUR a TER 0,49%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Co jsou clean energy ETF a jaké firmy obsahují?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Clean energy ETF</strong> investují do společností vyvíjejících obnovitelné zdroje energie 
                jako solární panely, větrné turbíny, vodní elektrárny a úložiště energie. Obsahují firmy jako NextEra Energy, 
                Tesla, Vestas Wind Systems a další lídry v zelené energetice.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Proč investovat do clean energy ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Energetická transformace</strong> je největší investiční trend 21. století. Vlády investují biliony 
                do Green Dealu a dekarbonizace. Clean energy ETF poskytují exposure k tomuto megatrendu s dlouhodobým 
                růstovým potenciálem při přechodu na udržitelnou energetiku.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jaké jsou náklady na clean energy ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>TER clean energy ETF</strong> se pohybuje od 0,49% do 0,65% ročně. Nejnižší poplatky má 
                <strong>L&G Clean Water ETF</strong> (IE00BK5BC891) s 0,49%, <strong>iShares clean energy ETF</strong> 
                (IE00B1XNHC34, IE00B1TXK627) mají TER 0,65%. Kromě TER počítejte s transakčními poplatky u brokera.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jaká jsou rizika clean energy ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Clean energy ETF jsou vysoce volatilní</strong> a citlivé na vládní politiku, změny dotací a regulací. 
                Rizika zahrnují technologickou obsolescenci, konkurenci z fosilních paliv a ekonomické cykly. 
                Doporučuje se jako menší část portfolia (5-15%) pro diverzifikaci.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Kde koupit clean energy ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Clean energy ETF můžete koupit u všech hlavních brokerů: <strong>XTB</strong>, <strong>Interactive Brokers</strong>, 
                <strong>Trading 212</strong>, <strong>Degiro</strong>. Naše TOP 3 doporučené ETF - iShares Clean Energy 
                (IE00B1XNHC34), iShares Water (IE00B1TXK627) a L&G Clean Water (IE00BK5BC891) - jsou dostupné na všech platformách.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-green-100 w-20 h-20 mx-auto mb-8 hover:bg-green-200 transition-colors hover-scale">
              <ZapIcon className="w-10 h-10 text-green-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Připraveni investovat do čisté energie?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Najděte si ideálního brokera a začněte s investováním do nejlepších clean energy ETF
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="hover-scale bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold">
                <a href="/kde-koupit-etf">
                  <UsersIcon className="w-5 h-5 mr-2" />
                  Najít brokera pro ETF
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="hover-scale border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold">
                <a href="/srovnani-etf">
                  <BarChart3Icon className="w-5 h-5 mr-2" />
                  Srovnat všechny ETF
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Linking */}
      <InternalLinking 
        relatedLinks={[
          {
            href: "/nejlepsi-etf/nejlepsi-esg-etf", 
            title: "Nejlepší ESG ETF",
            description: "Udržitelné investice a ESG"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-energeticke-etf",
            title: "Nejlepší energetické ETF", 
            description: "Tradiční energie vs. obnovitelné"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-technologicke-etf",
            title: "Nejlepší technologické ETF",
            description: "Čisté technologie a inovace"
          }
        ]}
      />
    </Layout>
  );
}