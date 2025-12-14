import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, CloudIcon, ServerIcon, CpuIcon , DollarIcon, RocketIcon, ZapIcon, UsersIcon, GlobeIcon, AwardIcon, TrendingUpIcon} from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// Top 3 doporučené Cloud Computing ETF - editoriální výběr s live daty z databáze
const TOP_3_CLOUD_ETFS_TEMPLATE = [
  {
    name: "iShares Digitalisation UCITS ETF USD (Acc)",
    ticker: "DGTL",
    isin: "IE00BYZK4883",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší digitalizační ETF s 835 mil. EUR a TER 0,40%. Široká expozice k digitální transformaci včetně cloud computingu, e-commerce a fintech.",
  },
  {
    name: "First Trust Cloud Computing UCITS ETF USD Acc",
    ticker: "SKYY",
    isin: "IE00BFD2H405", 
    provider: "First Trust",
    degiroFree: false,
    reason: "Specializovaný cloud computing ETF s 418 mil. EUR a TER 0,60%. Čistě zaměřený na společnosti poskytující cloud služby a infrastrukturu.",
  },
  {
    name: "WisdomTree Cloud Computing UCITS ETF USD Acc",
    ticker: "WCLD",
    isin: "IE00BJGWQN72",
    provider: "WisdomTree", 
    degiroFree: false,
    reason: "Zaměřený na cloud computing s 239 mil. EUR a TER 0,40%. Sleduje Nasdaq CTA Cloud Computing Index s focus na SaaS a cloud platformy.",
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
    title: `Nejlepší cloud ETF ${currentYear} - cloud computing a SaaS`,
    description: `✅ Srovnání nejlepších cloud ETF ${currentYear}. Cloud computing, SaaS, digitalizace - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'cloud ETF',
      'cloud computing ETF',
      `nejlepší cloud ETF ${currentYear}`,
      'digitalizace ETF',
      'SaaS ETF',
      'software ETF',
      'DGTL ETF',
      'SKYY ETF',
      'WCLD ETF',
      'cloud technologie ETF',
      'digitální transformace ETF',
      'Microsoft Azure ETF',
      'Amazon AWS ETF',
      'Google Cloud ETF',
      'cloud infrastruktura ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší cloud ETF ${currentYear} - cloud computing a SaaS`,
      description: `Srovnání nejlepších cloud ETF ${currentYear}. Cloud computing, SaaS, digitalizace - TER, velikost fondů.`,
      type: 'article',
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-cloud-etf',
      siteName: 'ETF průvodce.cz',
      locale: 'cs_CZ',
      images: [
        {
          url: '/og-cloud-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší cloud ETF ${currentYear} - cloud computing`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší cloud ETF ${currentYear} - cloud computing a SaaS`,
      description: `Srovnání nejlepších cloud ETF ${currentYear}. Cloud computing, SaaS, digitalizace - TER, velikost fondů.`,
      images: ['/og-cloud-etf.jpg']
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-cloud-etf'
    }
  };
}

export default async function NejlepsiCloudETFPage() {
  // Get last modified date from database (all ETF updates)
  const lastModified = await getLastModifiedDate();

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší cloud ETF ${currentYear} - cloud computing a SaaS`,
    "description": "Srovnání nejlepších cloud ETF 2025. Cloud computing, SaaS, digitalizace - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-cloud-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-cloud-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "cloud ETF, cloud computing, SaaS, digitalizace, iShares Digitalisation",
    "wordCount": 2800,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Cloud Computing ETF",
        "description": "Exchange-traded funds focused on cloud computing and software-as-a-service companies"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Digitalisation UCITS ETF USD (Acc)",
        "identifier": "IE00BYZK4883"
      },
      {
        "@type": "FinancialProduct", 
        "name": "First Trust Cloud Computing UCITS ETF USD Acc",
        "identifier": "IE00BFD2H405"
      },
      {
        "@type": "FinancialProduct",
        "name": "WisdomTree Cloud Computing UCITS ETF USD Acc", 
        "identifier": "IE00BJGWQN72"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Cloud Computing Industry",
        "description": "Industry sector focused on cloud services, SaaS and digital infrastructure"
      },
      {
        "@type": "Thing", 
        "name": "Digital Transformation",
        "description": "Investment strategy focused on companies enabling digital transformation"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší cloud ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší cloud ETF jsou: iShares Digitalisation UCITS ETF (IE00BYZK4883) největší digitalizační ETF s 835 mil. EUR a TER 0,40%, First Trust Cloud Computing UCITS ETF (IE00BFD2H405) s 418 mil. EUR a TER 0,60%, a WisdomTree Cloud Computing UCITS ETF (IE00BJGWQN72) s 239 mil. EUR a TER 0,40%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou cloud ETF a jaké firmy obsahují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cloud ETF investují do společností poskytujících cloud služby jako Microsoft, Amazon, Google, Salesforce a další SaaS firmy. Zaměřují se na cloud infrastrukturu, software-as-a-service a digitální transformaci."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do cloud ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cloud computing je jeden z nejrychleji rostoucích tech segmentů s růstem 15-20% ročně. Digitální transformace firem a přechod na cloud vytváří dlouhodobý růstový potenciál s opakovanými SaaS příjmy."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou náklady na cloud ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TER cloud ETF se pohybuje od 0,40% do 0,60% ročně. iShares Digitalisation a WisdomTree Cloud mají TER 0,40%, First Trust Cloud Computing má TER 0,60%. Kromě TER počítejte s transakčními poplatky u brokera."
        }
      },
      {
        "@type": "Question",
        "name": "Jaká jsou rizika cloud ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cloud ETF jsou vysoce volatilní a koncentrované do velkých tech firem. Rizika zahrnují regulační tlak na Big Tech, konkurenci, technologické změny a závislost na několika málo platformách. Doporučuje se jako část tech alokace (10-20%)."
        }
      },
      {
        "@type": "Question",
        "name": "Kde koupit cloud ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cloud ETF můžete koupit u všech hlavních brokerů: XTB, Interactive Brokers, Trading 212, Degiro. Naše TOP 3 doporučené ETF - iShares Digitalisation (IE00BYZK4883), First Trust Cloud (IE00BFD2H405) a WisdomTree Cloud (IE00BJGWQN72) - jsou dostupné na všech platformách."
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
        "name": "Nejlepší cloud ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-cloud-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-gray-50/30 to-white-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-gray-200 to-white-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-white-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-gray-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
                <CloudIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-blue-600 via-gray-600 to-slate-600 bg-clip-text text-transparent">
                  cloud ETF
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
                Kompletní srovnání nejlepších cloud computing ETF. 
                Digitalizace, SaaS a cloud infrastruktura včetně Microsoft, Amazon a Google.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-gray-600 hover:from-blue-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <CloudIcon className="w-5 h-5 mr-2" />
                    Cloud computing
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                    <CloudIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Cloud sektor v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro cloud investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CloudIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ CLOUD ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">835M</div>
                    <div className="text-xs text-gray-600">iShares Digitalisation</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarIcon className="w-4 h-4 text-slate-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,40%</div>
                    <div className="text-xs text-gray-600">iShares & WisdomTree</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <ServerIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP HOLDING</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">8%</div>
                    <div className="text-xs text-gray-600">Microsoft</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CpuIcon className="w-4 h-4 text-slate-600" />
                      <span className="text-xs text-gray-500 font-medium">CLOUD RŮST</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">+18%</div>
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
            <div className="flex items-center justify-center rounded-full bg-blue-100 w-20 h-20 mx-auto mb-8 hover:bg-blue-200 transition-colors hover-scale">
              <CloudIcon className="w-10 h-10 text-blue-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou cloud ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na společnosti poskytující cloud služby 
              a technologie pro digitální transformaci budoucnosti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-gray-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ServerIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-800 transition-colors">Cloud infrastruktura</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Cloud platformy jako AWS, Azure a Google Cloud umožňují firmám 
                škálovat bez vlastní infrastruktury - flexibilnější a levnější.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-gray-500 to-slate-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <CloudIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-gray-800 transition-colors">SaaS revoluce</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Software-as-a-Service model s opakovanými příjmy. 
                Firmy jako Salesforce, Adobe a Microsoft transformují software.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-slate-500 to-blue-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ZapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-slate-800 transition-colors">Digitální transformace</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                COVID-19 urychlil přechod na cloud. Firmy musí digitalizovat 
                pro přežití - dlouhodobý růstový trend s podporou managementu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top 3 ETF Section */}
      <Top3ETFLiveSection 
        sectionId="top3"
        title="🏆 Top 3 nejlepší cloud ETF"
        subtitle="Naše doporučení na základě analýzy velikosti fondů a exposure k cloud computing technologiím"
        etfTemplates={TOP_3_CLOUD_ETFS_TEMPLATE}
        colorScheme="gray"
      />

      {/* Comprehensive ETF Sections */}
      <FilteredETFSections 
        indexKeywords={["Cloud Computing", "Software", "Digital", "SaaS", "Digitalisation"]}
        excludeKeywords={["China", "KraneShares", "Leveraged", "2x", "3x", "Short", "Bear", "Bond", "Currency", "Sustainable", "ESG"]}
      />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="pruvodce" className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-12 border border-blue-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-gray-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ☁️ Jak vybrat ten správný cloud ETF?
              </h4>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Praktický průvodce výběrem nejlepšího cloud computing ETF podle vaší investiční strategie a rizikového profilu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <CloudIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Široký vs. čistý cloud</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  iShares Digitalisation (835 mil.) je širší digitalizační ETF, 
                  zatímco First Trust Cloud Computing (418 mil.) je pure-play cloud ETF.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                  <DollarIcon className="w-6 h-6 text-gray-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">TER a náklady</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cloud ETF mají TER 0,40-0,60%. iShares a WisdomTree nabízejí 
                  nejnižší poplatky 0,40%, First Trust má 0,60%.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4">
                  <ServerIcon className="w-6 h-6 text-slate-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Cloud subsektory</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sledujte expozici k IaaS (Amazon AWS), PaaS (Microsoft Azure), 
                  SaaS (Salesforce) a cloud security (Zscaler).
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <GlobeIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Geografická koncentrace</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cloud ETF jsou dominantně americké (70-80%) s velkými tech firmami. 
                  Malá expozice k evropským a asijským cloudům.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                  <TrendingUpIcon className="w-6 h-6 text-gray-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Růstový potenciál</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cloud trh roste 15-20% ročně s opakovanými SaaS příjmy. 
                  Vyšší volatilita než broad market, ale silný long-term trend.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4">
                  <AwardIcon className="w-6 h-6 text-slate-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Kvalita cloud lídrů</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sledujte top holdingy jako Microsoft, Amazon, Google, Salesforce 
                  a Adobe. Dominantní pozice s vysokými switching costs.
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
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o cloud ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">
                  Jaké jsou nejlepší cloud ETF v roce 2025?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší cloud ETF jsou: <strong>iShares Digitalisation UCITS ETF</strong> (IE00BYZK4883) 
                největší digitalizační ETF s 835 mil. EUR a TER 0,40%, <strong>First Trust Cloud Computing UCITS ETF</strong> (IE00BFD2H405) 
                s 418 mil. EUR a TER 0,60%, a <strong>WisdomTree Cloud Computing UCITS ETF</strong> 
                (IE00BJGWQN72) s 239 mil. EUR a TER 0,40%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">
                  Co jsou cloud ETF a jaké firmy obsahují?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Cloud ETF</strong> investují do společností poskytujících cloud služby jako Microsoft, 
                Amazon, Google, Salesforce a další SaaS firmy. Zaměřují se na cloud infrastrukturu, 
                software-as-a-service a digitální transformaci.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">
                  Proč investovat do cloud ETF?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Cloud computing je jeden z nejrychleji rostoucích tech segmentů</strong> s růstem 15-20% ročně. 
                Digitální transformace firem a přechod na cloud vytváří dlouhodobý růstový potenciál 
                s opakovanými SaaS příjmy.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">
                  Jaké jsou náklady na cloud ETF?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>TER cloud ETF</strong> se pohybuje od 0,40% do 0,60% ročně. <strong>iShares Digitalisation</strong> 
                (IE00BYZK4883) a <strong>WisdomTree Cloud</strong> (IE00BJGWQN72) mají TER 0,40%, 
                <strong>First Trust Cloud Computing</strong> (IE00BFD2H405) má TER 0,60%. 
                Kromě TER počítejte s transakčními poplatky u brokera.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">
                  Jaká jsou rizika cloud ETF?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Cloud ETF jsou vysoce volatilní</strong> a koncentrované do velkých tech firem. 
                Rizika zahrnují regulační tlak na Big Tech, konkurenci, technologické změny a závislost 
                na několika málo platformách. Doporučuje se jako část tech alokace (10-20%).
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">
                  Kde koupit cloud ETF?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Cloud ETF můžete koupit u všech hlavních brokerů: <strong>XTB</strong>, <strong>Interactive Brokers</strong>, 
                <strong>Trading 212</strong>, <strong>Degiro</strong>. Naše TOP 3 doporučené ETF - iShares Digitalisation 
                (IE00BYZK4883), First Trust Cloud (IE00BFD2H405) a WisdomTree Cloud (IE00BJGWQN72) - 
                jsou dostupné na všech platformách.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-blue-100">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-gray-100 w-20 h-20 mx-auto mb-6">
                <RocketIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Připraveni investovat do cloud budoucnosti?
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Digitální transformace urychluje a cloud je její základní kámen. 
                Objevte nejlepší cloud ETF a profitujte z přechodu firem do cloudu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                <CloudIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Cloud infrastruktura</h4>
                <p className="text-sm text-gray-600">AWS, Azure, Google Cloud a další</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                <ServerIcon className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">SaaS revoluce</h4>
                <p className="text-sm text-gray-600">Opakované příjmy z software služeb</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                <ZapIcon className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Digitalizace</h4>
                <p className="text-sm text-gray-600">Firmy musí digitalizovat pro přežití</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-gray-600 hover:from-blue-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                <a href="#top3">
                  <StarFilledIcon className="w-5 h-5 mr-2" />
                  Vybrat cloud ETF
                </a>
              </Button>
              <Button asChild variant="outline" className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
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
            description: "Umělá inteligence a strojové učení"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-kyberbezpecnost-etf",
            title: "Nejlepší kyberbezpečnost ETF", 
            description: "Cybersecurity a ochrana dat"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-technologicke-etf",
            title: "Nejlepší technologické ETF",
            description: "Širší tech sektor a inovace"
          }
        ]}
      />
    </Layout>
  );
}