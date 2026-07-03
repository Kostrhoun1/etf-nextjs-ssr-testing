import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, BotIcon, CpuIcon, CogIcon , DollarIcon, RocketIcon, ZapIcon, UsersIcon, GlobeIcon, AwardIcon, TrendingUpIcon} from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Top 3 doporučené Robotics ETF - editoriální výběr s live daty z databáze
const TOP_3_ROBOTICS_ETFS_TEMPLATE = [
  {
    name: "iShares Automation & Robotics UCITS ETF",
    ticker: "RBOT",
    isin: "IE00BYZK4552",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší robotika ETF s 2,9 mld. EUR a TER 0,40%. Globální exposure k automatizaci, robotice a AI napříč různými sektory.",
  },
  {
    name: "Amundi MSCI Robotics & AI UCITS ETF Acc",
    ticker: "ROAI",
    isin: "LU1861132840",
    provider: "Amundi ETF",
    degiroFree: false,
    reason: "Druhý největší s 997 mil. EUR a TER 0,40%. Kombinuje robotiku s umělou inteligencí pro komplexní technologickou expozici.",
  },
  {
    name: "L&G ROBO Global Robotics and Automation UCITS ETF",
    ticker: "ROBO",
    isin: "IE00BMW3QX54",
    provider: "L&G (LGIM)",
    degiroFree: false,
    reason: "Specializovaný robotika ETF s 624 mil. EUR a TER 0,80%. Čisté zaměření na robotiku a automatizaci s vysokou specializací.",
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
    title: `Nejlepší robotika ETF ${currentYear} - robotics a automatizace`,
    description: `✅ Srovnání nejlepších robotika ETF ${currentYear}. Robotics, automatizace, AI - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'robotika ETF',
      'robotics ETF',
      `nejlepší robotika ETF ${currentYear}`,
      'automatizace ETF',
      'automation ETF',
      'průmyslové roboty ETF',
      'AI robotika ETF',
      'ROBO ETF',
      'technologická automatizace ETF',
      'budoucnost výroby ETF',
      'Industry 4.0 ETF',
      'smart factory ETF',
      'cobots ETF',
      'autonomní systémy ETF',
      'mechatronika ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší robotika ETF ${currentYear} - robotics a automatizace`,
      description: `Srovnání nejlepších robotika ETF ${currentYear}. Robotics, automatizace, AI - TER, velikost fondů.`,
      type: 'article',
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-robotika-etf',
      siteName: 'ETF průvodce.cz',
      locale: 'cs_CZ',
      images: [
        {
          url: '/og-robotics-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší robotika ETF ${currentYear} - robotics`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší robotika ETF ${currentYear} - robotics a automatizace`,
      description: `Srovnání nejlepších robotika ETF ${currentYear}. Robotics, automatizace, AI - TER, velikost fondů.`,
      images: ['/og-robotics-etf.jpg']
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-robotika-etf'
    }
  };
}

export default async function NejlepsiRobotikaETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-robotika-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší robotika ETF ${currentYear} - robotics a automatizace`,
    "description": "Srovnání nejlepších robotika ETF 2026. Robotics, automatizace, AI - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-robotics-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-robotika-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "robotika ETF, robotics, automatizace, AI, průmyslové roboty",
    "wordCount": 2800,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Robotics ETF",
        "description": "Exchange-traded funds focused on robotics and automation technology companies"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Automation & Robotics UCITS ETF",
        "identifier": "IE00BYZK4552"
      },
      {
        "@type": "FinancialProduct", 
        "name": "Amundi MSCI Robotics & AI UCITS ETF Acc",
        "identifier": "LU1861132840"
      },
      {
        "@type": "FinancialProduct",
        "name": "L&G ROBO Global Robotics and Automation UCITS ETF", 
        "identifier": "IE00BMW3QX54"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Robotics Industry",
        "description": "Industry sector focused on developing robotic systems for manufacturing, logistics and services"
      },
      {
        "@type": "Thing", 
        "name": "Industrial Automation",
        "description": "Investment strategy focused on companies developing automated manufacturing and production systems"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší robotika ETF v roce 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší robotika ETF jsou: iShares Automation & Robotics UCITS ETF (RBOT, IE00BYZK4552) největší robotika ETF s 2,9 mld. EUR a TER 0,40%, Amundi MSCI Robotics & AI UCITS ETF (ROAI, LU1861132840) s 997 mil. EUR a TER 0,40%, a L&G ROBO Global Robotics and Automation UCITS ETF (ROBO, IE00BMW3QX54) s 624 mil. EUR a TER 0,80%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou robotika ETF a jaké firmy obsahují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Robotika ETF investují do společností vyvíjejících robotické systémy jako ABB, KUKA, Fanuc, Boston Dynamics a další tech firmy. Zaměřují se na průmyslové roboty, autonomní vozidla, drony, coboty a automatizované výrobní systémy pro Industry 4.0."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do robotika ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Automatizace je klíčovým trendem 21. století řešícím nedostatek pracovníků a zvyšujícím produktivitu. Robotika ETF poskytují exposure k Industry 4.0 revoluci s dlouhodobým růstovým potenciálem napříč výrobou, logistikou i službami."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou největší holdingy v robotika ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Největší holdingy robotika ETF jsou: ABB Ltd (4-5%) švýcarský průmyslový gigant, KUKA AG německý robotika líder, Fanuc Corporation japonský výrobce robotů, Keyence Corporation automatizační senzory, Rockwell Automation americká průmyslová automatizace, a Boston Dynamics (Hyundai) pokročilé robotické systémy."
        }
      },
      {
        "@type": "Question",
        "name": "Jsou robotika ETF vhodné pro začátečníky?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Robotika ETF jsou specializované sektorové ETF s vyšší volatilitou a koncentračním rizikem. Vhodné pro pokročilejší investory s tolerancí k riziku. Začátečníci by měli začít s široce diverzifikovanými ETF a robotiku přidat jako menší část portfolia (5-10%)."
        }
      },
      {
        "@type": "Question",
        "name": "Jaká jsou rizika investování do robotika ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hlavní rizika robotika ETF: koncentrace do tech sektoru, závislost na R&D investicích, konkurence z Asie (zejména Číny), regulační změny v automatizaci, cyklické výkyvy v průmyslu a vysoká korelace s tech akcemi. Diversifikace je klíčová."
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
        "name": "Nejlepší robotika ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-robotika-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-orange-50/30 to-yellow-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-red-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-red-200/50">
                <BotIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  robotika ETF
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
                Kompletní srovnání nejlepších robotika ETF. 
                Průmyslové roboty, automatizace a AI včetně ABB, KUKA a Fanuc.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <BotIcon className="w-5 h-5 mr-2" />
                    Industry 4.0
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-3">
                    <BotIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Robotika sektor v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro robotika investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-red-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BotIcon className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ ROBO ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">2,9B</div>
                    <div className="text-xs text-gray-600">iShares Automation</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarIcon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,40%</div>
                    <div className="text-xs text-gray-600">iShares & Amundi</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-red-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CogIcon className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP HOLDING</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">4%</div>
                    <div className="text-xs text-gray-600">ABB Ltd</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CpuIcon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">INDUSTRY 4.0</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">+15%</div>
                    <div className="text-xs text-gray-600">roční růst</div>
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
            <div className="flex items-center justify-center rounded-full bg-red-100 w-20 h-20 mx-auto mb-8 hover:bg-red-200 transition-colors hover-scale">
              <BotIcon className="w-10 h-10 text-red-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou robotika ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na společnosti vyvíjející robotické systémy 
              a automatizované technologie pro budoucnost výroby
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <CogIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-red-800 transition-colors">Průmyslová automatizace</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Roboty převádějí výrobu, logistiku a služby. Zvyšují produktivitu, 
                snižují náklady a řeší nedostatek kvalifikovaných pracovníků.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-yellow-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BotIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-orange-800 transition-colors">Industry 4.0</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Čtvrtá průmyslová revoluce kombinuje roboty s AI, IoT a machine learning. 
                Smart factories s autonomními systémy a coboty pracující s lidmi.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-red-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ZapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-yellow-800 transition-colors">Megatrend automatizace</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Demografické změny a tlak na efektivitu pohánějí poptávku po robotice. 
                Dlouhodobý růstový trend s podporou vlád a investorů.
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

      <Top10SectionsServer etfs={etfs} currency="CZK" categoryName="robotika" />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="pruvodce" className="bg-gradient-to-br from-white to-red-50 rounded-3xl p-12 border border-red-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-red-100 to-orange-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-red-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                🤖 Jak vybrat ten správný robotika ETF?
              </h4>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Praktický průvodce výběrem nejlepšího robotika ETF podle vaší investiční strategie a rizikového profilu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4">
                  <BotIcon className="w-6 h-6 text-red-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Velikost fondu a likvidita</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Vybírejte ETF s minimálně 500 mil. EUR pro zajištění dobré likvidity. 
                  iShares Automation (2,9 mld.) a Amundi MSCI Robotics (997 mil.) jsou nejbezpečnější volby.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                  <DollarIcon className="w-6 h-6 text-orange-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">TER a náklady</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Robotika ETF mají vyšší TER (0,40-0,80%) kvůli specializaci. 
                  iShares a Amundi nabízejí nejnižší poplatky 0,40%, L&G má 0,80%.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4">
                  <CogIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Specializace vs. diverzifikace</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Čisté robotika ETF (L&G ROBO) vs. širší automatizace (iShares). 
                  Amundi kombinuje robotiku s AI pro komplexnější exposure.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4">
                  <GlobeIcon className="w-6 h-6 text-red-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Geografická diverzifikace</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Všechny robotika ETF jsou globální s vysokým podílem USA (40-60%), 
                  Japonska (15-25%) a Evropy (15-20%). Žádné čínské ETF.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                  <TrendingUpIcon className="w-6 h-6 text-orange-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Výkonnost a volatilita</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Robotika ETF jsou růstové s vyšší volatilitou než broad market. 
                  Vhodné pro dlouhodobé investory s tolerancí k riziku.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4">
                  <AwardIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Kvalita holdingů</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sledujte top holdingy jako ABB, KUKA, Fanuc, Keyence a Boston Dynamics. 
                  Kvalitní robotika firmy s tržní kapitalizací nad 1 mld. USD.
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
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o robotika ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">
                  Jaké jsou nejlepší robotika ETF v roce 2026?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší robotika ETF jsou: <strong>iShares Automation & Robotics UCITS ETF</strong> (RBOT, IE00BYZK4552) 
                největší robotika ETF s 2,9 mld. EUR a TER 0,40%, <strong>Amundi MSCI Robotics & AI UCITS ETF</strong> (ROAI, LU1861132840) 
                s 997 mil. EUR a TER 0,40%, a <strong>L&G ROBO Global Robotics and Automation UCITS ETF</strong> 
                (ROBO, IE00BMW3QX54) s 624 mil. EUR a TER 0,80%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">
                  Co jsou robotika ETF a jaké firmy obsahují?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Robotika ETF</strong> investují do společností vyvíjejících robotické systémy jako ABB, KUKA, 
                Fanuc, Boston Dynamics a další tech firmy. Zaměřují se na průmyslové roboty, autonomní vozidla, drony, 
                coboty a automatizované výrobní systémy pro Industry 4.0.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">
                  Proč investovat do robotika ETF?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Automatizace je klíčovým trendem 21. století</strong> řešícím nedostatek pracovníků a zvyšujícím 
                produktivitu. Robotika ETF poskytují exposure k Industry 4.0 revoluci s dlouhodobým růstovým potenciálem 
                napříč výrobou, logistikou i službami.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">
                  Jaké jsou největší holdingy v robotika ETF?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Největší holdingy robotika ETF</strong> jsou: ABB Ltd (4-5%) švýcarský průmyslový gigant, 
                KUKA AG německý robotika líder, Fanuc Corporation japonský výrobce robotů, Keyence Corporation 
                automatizační senzory, Rockwell Automation americká průmyslová automatizace, a Boston Dynamics 
                (Hyundai) pokročilé robotické systémy.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">
                  Jsou robotika ETF vhodné pro začátečníky?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Robotika ETF jsou specializované sektorové ETF</strong> s vyšší volatilitou a koncentračním rizikem. 
                Vhodné pro pokročilejší investory s tolerancí k riziku. Začátečníci by měli začít s široce diverzifikovanými 
                ETF a robotiku přidat jako menší část portfolia (5-10%).
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">
                  Jaká jsou rizika investování do robotika ETF?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Hlavní rizika robotika ETF:</strong> koncentrace do tech sektoru, závislost na R&D investicích, 
                konkurence z Asie (zejména Číny), regulační změny v automatizaci, cyklické výkyvy v průmyslu 
                a vysoká korelace s tech akcemi. Diversifikace je klíčová.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-red-100">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-red-100 to-orange-100 w-20 h-20 mx-auto mb-6">
                <RocketIcon className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Připraveni investovat do budoucnosti robotiky?
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Automatizace a Industry 4.0 revoluce právě začíná. Objevte nejlepší robotika ETF 
                a staňte se součástí technologické transformace výroby a služeb.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-red-50 rounded-xl border border-red-100">
                <BotIcon className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Průmyslové roboty</h4>
                <p className="text-sm text-gray-600">ABB, KUKA, Fanuc a další robotika giganty</p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-100">
                <CogIcon className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Automatizace</h4>
                <p className="text-sm text-gray-600">Smart factories a autonomní systémy</p>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-xl border border-yellow-100">
                <ZapIcon className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Industry 4.0</h4>
                <p className="text-sm text-gray-600">IoT, AI a coboty nové generace</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                <a href="#top3">
                  <StarFilledIcon className="w-5 h-5 mr-2" />
                  Vybrat robotika ETF
                </a>
              </Button>
              <Button asChild variant="outline" className="border-2 border-red-300 text-red-700 hover:bg-red-50 px-8 py-3 text-lg font-semibold">
                <a href="/srovnani-etf">
                  <BarChart3Icon className="w-5 h-5 mr-2" />
                  Porovnat všechny ETF
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
            href: "/nejlepsi-etf/nejlepsi-ai-etf", 
            title: "Nejlepší AI ETF",
            description: "AI a strojové učení"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-technologicke-etf",
            title: "Nejlepší technologické ETF", 
            description: "Širší tech sektor a inovace"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-growth-etf",
            title: "Nejlepší growth ETF",
            description: "Růstové technologické trendy"
          }
        ]}
      />
    </Layout>
  );
}