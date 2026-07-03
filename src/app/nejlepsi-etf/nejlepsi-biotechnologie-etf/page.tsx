import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, ActivityIcon, MicroscopeIcon, FlaskIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Top 3 doporučené Biotechnology ETF - editoriální výběr s live daty z databáze
const TOP_3_BIOTECHNOLOGY_ETFS_TEMPLATE = [
  {
    name: "iShares Healthcare Innovation UCITS ETF",
    ticker: "HEAL",
    isin: "IE00BYZK4776",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší healthcare innovation ETF s 807 mil. EUR a TER 0,40%. Globální exposure k inovacím v zdravotnictví a biotechnologiích.",
  },
  {
    name: "iShares Nasdaq US Biotechnology UCITS ETF",
    ticker: "BTEC",
    isin: "IE00BYXG2H39",
    provider: "iShares",
    degiroFree: false,
    reason: "Druhý největší s 488 mil. EUR a TER 0,35%. Zaměření na americké biotechnologické společnosti z NASDAQ Biotechnology Index.",
  },
  {
    name: "Invesco Nasdaq Biotech UCITS ETF",
    ticker: "NBIO",
    isin: "IE00BQ70R696",
    provider: "Invesco",
    degiroFree: false,
    reason: "Specializovaný biotech ETF s 287 mil. EUR a TER 0,40%. Čisté exposure k biotechnologickému sektoru s vysokým růstovým potenciálem.",
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
    title: `Nejlepší biotechnologie ETF ${currentYear} | Srovnání`,
    description: `✅ Srovnání nejlepších biotechnologie ETF ${currentYear}. Biotech, farmaceutika, genomika - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'biotechnologie ETF',
      'biotech ETF',
      `nejlepší biotechnologie ETF ${currentYear}`,
      'farmaceutické ETF',
      'genomika ETF',
      'lékařské ETF',
      'inovace ve zdravotnictví ETF',
      'NASDAQ biotech ETF',
      'pharmaceutical ETF',
      'medical innovation ETF',
      'life sciences ETF',
      'biopharmaceutical ETF',
      'CRISPR ETF',
      'genové terapie ETF',
      'personalizovaná medicína ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší biotechnologie ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších biotechnologie ETF ${currentYear}. Biotech, farmaceutika, genomika - TER, velikost fondů.`,
      type: 'article',
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-biotechnologie-etf',
      siteName: 'ETF průvodce.cz',
      locale: 'cs_CZ',
      images: [
        {
          url: '/og-biotechnology-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší biotechnologie ETF ${currentYear} - biotech`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší biotechnologie ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších biotechnologie ETF ${currentYear}. Biotech, farmaceutika, genomika - TER, velikost fondů.`,
      images: ['/og-biotechnology-etf.jpg']
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-biotechnologie-etf'
    }
  };
}

export default async function NejlepsiBiotechnologyETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-biotechnologie-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší biotechnologie ETF ${currentYear} - biotech a farmaceutika`,
    "description": "Srovnání nejlepších biotechnologie ETF 2026. Biotech, farmaceutika, genomika - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-biotechnology-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-biotechnologie-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "biotechnologie ETF, biotech, farmaceutika, genomika, lékařské inovace",
    "wordCount": 2850,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Biotechnology ETF",
        "description": "Exchange-traded funds focused on biotechnology and pharmaceutical innovation companies"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Healthcare Innovation UCITS ETF",
        "identifier": "IE00BYZK4776"
      },
      {
        "@type": "FinancialProduct", 
        "name": "iShares Nasdaq US Biotechnology UCITS ETF",
        "identifier": "IE00BYXG2H39"
      },
      {
        "@type": "FinancialProduct",
        "name": "Invesco Nasdaq Biotech UCITS ETF", 
        "identifier": "IE00BQ70R696"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Biotechnology Sector",
        "description": "Industry sector focused on using biological processes for medical and agricultural applications"
      },
      {
        "@type": "Thing", 
        "name": "Medical Innovation",
        "description": "Investment strategy focused on companies developing breakthrough medical treatments and technologies"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší biotechnologie ETF v roce 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší biotechnologie ETF jsou: iShares Healthcare Innovation UCITS ETF (IE00BYZK4776) největší healthcare innovation ETF s 807 mil. EUR a TER 0,40%, iShares Nasdaq US Biotechnology UCITS ETF (IE00BYXG2H39) s 488 mil. EUR a TER 0,35%, a Invesco Nasdaq Biotech UCITS ETF (IE00BQ70R696) s 287 mil. EUR a TER 0,40%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou biotechnologie ETF a jaké firmy obsahují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Biotechnologie ETF investují do společností vyvíjejících pokročilé lékařské technologie jako Gilead Sciences, Amgen, Moderna, BioNTech a další biotech firmy. Zaměřují se na genové terapie, imunoterapie, personalizovanou medicínu a průlomové léčebné postupy."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do biotechnologie ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Biotechnologie představují budoucnost medicíny s obrovským inovačním potenciálem. Stárnutí populace zvyšuje poptávku po pokročilých terapiích. Biotechnologie ETF poskytují přístup k sektoru s vysokým růstovým potenciálem, ale i vyšší volatilitou než tradiční healthcare."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou náklady na biotechnologie ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TER (celkové náklady) biotechnologie ETF se pohybují mezi 0,35% až 0,40% ročně. iShares Nasdaq US Biotechnology má nejnižší TER 0,35%, iShares Healthcare Innovation a Invesco Nasdaq Biotech mají TER 0,40%. Specializace na biotech sektor odůvodňuje mírně vyšší poplatky než broad market ETF."
        }
      },
      {
        "@type": "Question",
        "name": "Jsou biotechnologie ETF rizikové investice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Biotechnologie ETF patří mezi vysoce rizikové investice kvůli volatilitě biotech sektoru a závislosti na úspěchu klinických studií. Neúspěch ve fázi III může způsobit propad akcií o 50-80%. Doporučujeme maximálně 5% alokace portfolia a dlouhodobou investiční strategii."
        }
      },
      {
        "@type": "Question",
        "name": "Kde koupit biotechnologie ETF v Česku?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Biotechnologie ETF můžete koupit u českých brokerů jako Degiro, XTB, Trading212 nebo Interactive Brokers. Náš TOP 3 (iShares Healthcare Innovation IE00BYZK4776, iShares Nasdaq US Biotechnology IE00BYXG2H39, Invesco Nasdaq Biotech IE00BQ70R696) jsou dostupné na evropských burzách s rozumnými transakčními poplatky."
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
        "name": "Nejlepší biotechnologie ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-biotechnologie-etf"
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
                <FlaskIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  biotechnologie ETF
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
                Kompletní srovnání nejlepších biotechnologie ETF. 
                Genové terapie, imunoterapie a personalizovaná medicína včetně Moderna, Gilead a Amgen.
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
                    <FlaskIcon className="w-5 h-5 mr-2" />
                    Biotech revoluce
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                    <FlaskIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Biotech sektor v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro biotech investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <FlaskIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ BIOTECH ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">807M</div>
                    <div className="text-xs text-gray-600">iShares Healthcare Innovation</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarIcon className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,35%</div>
                    <div className="text-xs text-gray-600">NASDAQ Biotechnology</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <MicroscopeIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP HOLDING</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">6%</div>
                    <div className="text-xs text-gray-600">Gilead Sciences</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <ActivityIcon className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs text-gray-500 font-medium">MRNA ÚSPĚCH</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">2021</div>
                    <div className="text-xs text-gray-600">COVID vakcíny</div>
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
              <FlaskIcon className="w-10 h-10 text-blue-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou biotechnologie ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na společnosti vyvíjející pokročilé lékařské technologie 
              a průlomové terapie pro budoucnost medicíny
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MicroscopeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-800 transition-colors">Genové terapie</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                CRISPR, CAR-T terapie a genové editace mění způsob léčby rakoviny 
                a genetických onemocnění. Revoluce v personalizované medicíně.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FlaskIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-indigo-800 transition-colors">mRNA technologie</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Úspěch COVID vakcín od Moderna a BioNTech otevřel nové možnosti 
                mRNA terapií pro rakovinu, autoimunitní onemocnění a prevenci.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ActivityIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-purple-800 transition-colors">Vysoký růstový potenciál</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Biotechnologie nabízejí extrémní růstový potenciál při úspěšném 
                vývoji léků, ale i vyšší volatilitu a riziko neúspěchu klinických studií.
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

      <Top10SectionsServer etfs={etfs} currency="CZK" categoryName="biotechnologie" />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Selection Guide */}
          <div id="pruvodce" className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-12 border border-blue-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                💡 Jak vybrat ten správný biotechnologie ETF?
              </h4>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Praktický průvodce výběrem podle vašeho investičního profilu
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  <h5 className="text-lg font-bold text-green-800">Pro začátečníky</h5>
                </div>
                <p className="text-green-700 leading-relaxed">
                  Začněte s široce diverzifikovanými healthcare innovation ETF s nižším rizikem. 
                  Zaměřte se na established fondy s velkým AUM a stabilní poskytovatele.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <h5 className="text-lg font-bold text-blue-800">Pro pokročilé</h5>
                </div>
                <p className="text-blue-700 leading-relaxed">
                  Porovnejte zaměření na pure-play biotech vs. širší healthcare innovation. 
                  Některé ETF se specializují na specifické oblasti jako genomika nebo imunoterapie.
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
                  Pure-play biotechnologie ETF nabízejí nejvyšší růstový potenciál, 
                  ale i extrémní volatilitu. Ideální pro dlouhodobé investory s vysokou tolerancí rizika.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-bold text-sm">4</span>
                  </div>
                  <h5 className="text-lg font-bold text-orange-800">Pro diverzifikaci</h5>
                </div>
                <p className="text-orange-700 leading-relaxed">
                  Biotechnologie by měly tvořit maximálně 5% portfolia kvůli vysoké volatilitě. 
                  Kombinujte s širšími healthcare nebo technologickými ETF.
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
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o biotechnologie ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">
                  Jaké jsou nejlepší biotechnologie ETF v roce 2026?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší biotechnologie ETF jsou: <strong>iShares Healthcare Innovation UCITS ETF</strong> (IE00BYZK4776) 
                největší healthcare innovation ETF s 807 mil. EUR a TER 0,40%, <strong>iShares Nasdaq US Biotechnology UCITS ETF</strong> (IE00BYXG2H39) 
                s 488 mil. EUR a TER 0,35%, a <strong>Invesco Nasdaq Biotech UCITS ETF</strong> 
                (IE00BQ70R696) s 287 mil. EUR a TER 0,40%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">
                  Co jsou biotechnologie ETF a jaké firmy obsahují?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Biotechnologie ETF</strong> investují do společností vyvíjejících pokročilé lékařské technologie 
                jako Gilead Sciences, Amgen, Moderna, BioNTech a další biotech firmy. Zaměřují se na genové terapie, 
                imunoterapie, personalizovanou medicínu a průlomové léčebné postupy.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">
                  Proč investovat do biotechnologie ETF?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Biotechnologie představují budoucnost medicíny</strong> s obrovským inovačním potenciálem. 
                Stárnutí populace zvyšuje poptávku po pokročilých terapiích. Biotechnologie ETF poskytují přístup 
                k sektoru s vysokým růstovým potenciálem, ale i vyšší volatilitou než tradiční healthcare.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">
                  Jaké jsou náklady na biotechnologie ETF?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>TER (celkové náklady) biotechnologie ETF</strong> se pohybují mezi 0,35% až 0,40% ročně. 
                iShares Nasdaq US Biotechnology má nejnižší TER 0,35%, iShares Healthcare Innovation a Invesco Nasdaq Biotech 
                mají TER 0,40%. Specializace na biotech sektor odůvodňuje mírně vyšší poplatky než broad market ETF.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">
                  Jsou biotechnologie ETF rizikové investice?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Biotechnologie ETF patří mezi vysoce rizikové investice</strong> kvůli volatilitě biotech sektoru a závislosti na úspěchu klinických studií. 
                Neúspěch ve fázi III může způsobit propad akcií o 50-80%. Doporučujeme maximálně 5% alokace portfolia 
                a dlouhodobou investiční strategii.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">
                  Kde koupit biotechnologie ETF v Česku?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Biotechnologie ETF můžete koupit</strong> u českých brokerů jako Degiro, XTB, Trading212 nebo Interactive Brokers. 
                Náš TOP 3 (iShares Healthcare Innovation IE00BYZK4776, iShares Nasdaq US Biotechnology IE00BYXG2H39, 
                Invesco Nasdaq Biotech IE00BQ70R696) jsou dostupné na evropských burzách s rozumnými transakčními poplatky.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-blue-100 w-20 h-20 mx-auto mb-8 hover:bg-blue-200 transition-colors hover-scale">
              <ZapIcon className="w-10 h-10 text-blue-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Připraveni investovat do biotechnologií?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Najděte si ideálního brokera a začněte s investováním do nejlepších biotechnologie ETF
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="hover-scale bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold">
                <a href="/kde-koupit-etf">
                  <UsersIcon className="w-5 h-5 mr-2" />
                  Najít brokera pro ETF
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="hover-scale border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
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
            href: "/nejlepsi-etf/nejlepsi-healthcare-etf", 
            title: "Nejlepší healthcare ETF",
            description: "Širší zdravotnický sektor"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-ai-etf",
            title: "Nejlepší AI ETF", 
            description: "AI v medicíně a diagnostice"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-nasdaq-etf",
            title: "Nejlepší NASDAQ ETF",
            description: "Tech a biotech z NASDAQ"
          }
        ]}
      />
    </Layout>
  );
}