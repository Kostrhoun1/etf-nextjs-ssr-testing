import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, HomeIcon, MapPinIcon, FactoryIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, AwardIcon, GlobeIcon, TrendingUpIcon, ShieldIcon, BuildingIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

const TOP_3_REIT_ETFS_TEMPLATE = [
  {
    name: "iShares Developed Markets Property Yield UCITS ETF",
    ticker: "IWDP",
    isin: "IE00B1FZS350",
    provider: "iShares",
    reason: "Největší globální REIT ETF s 882 mil. EUR a vysokou dividendovou výnosností 3,19%. Diverzifikace napříč vyspělými trhy včetně USA, Japonska a Evropy s quarterly dividendami.",
    degiroFree: false,
  },
  {
    name: "HSBC FTSE EPRA NAREIT Developed UCITS ETF USD",
    ticker: "HPROP",
    isin: "IE00B5L01S80", 
    provider: "HSBC ETF",
    reason: "Největší REIT ETF s 1,37 mld. EUR a atraktivním dividendovým výnosem 3,34%. Nízký TER 0,24% a quarterly výplaty dividend pro pravidelný příjem.",
    degiroFree: false,
  },
  {
    name: "SPDR Dow Jones Global Real Estate UCITS ETF",
    ticker: "RWX",
    isin: "IE00B8GF1M35",
    provider: "SPDR", 
    reason: "Globální nemovitostní ETF s 1,76 mld. EUR sledující Dow Jones Global Select Real Estate Securities Index. Dividendový výnos 2,85% s quarterly výplatami.",
    degiroFree: false,
  }
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nejlepší Nemovitostní ETF 2025 | Srovnání a Doporučení',
    description: 'Najděte nejlepší nemovitostní ETF pro rok 2025. Srovnání REIT fondů, dividendové výnosnosti a geografické diverzifikace.',
    keywords: 'nemovitostní ETF, nejlepší REIT ETF 2025, nemovitosti investice, REIT fondy, IWDP ETF, XDER ETF, RWX ETF',
    openGraph: {
      title: 'Nejlepší Nemovitostní ETF 2025 | Srovnání a Doporučení',
      description: 'Kompletní průvodce nejlepšími nemovitostními ETF. Analyzujeme REIT fondy, dividendové výnosy a diverzifikaci.',
      type: 'article',
      url: 'https://etf-srovnani.cz/nejlepsi-etf/nejlepsi-nemovitostni-etf',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Nejlepší Nemovitostní ETF 2025',
      description: 'Srovnání nejlepších nemovitostních ETF pro dividendové příjmy a diverzifikaci portfolia.',
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-nemovitostni-etf',
    },
  };
}


export default async function NejlepsiNemovitostniETFPage() {
  // Get last modified date from database (all ETF updates)
  const lastModified = await getLastModifiedDate();

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší nemovitostní ETF ${currentYear} - REIT fondy a dividendy`,
    "description": "Srovnání nejlepších nemovitostních ETF 2025. REIT fondy, dividendové výnosy, geografická diverzifikace - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-reit-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-nemovitostni-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "nemovitostní ETF, REIT fondy, nemovitosti investice, IWDP, XDER, RWX",
    "wordCount": 2800,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "REIT ETF",
        "description": "Exchange-traded funds focused on real estate investment trusts"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Developed Markets Property Yield UCITS ETF",
        "identifier": "IE00B1FZS350"
      },
      {
        "@type": "FinancialProduct", 
        "name": "HSBC FTSE EPRA NAREIT Developed UCITS ETF USD",
        "identifier": "IE00B5L01S80"
      },
      {
        "@type": "FinancialProduct",
        "name": "SPDR Dow Jones Global Real Estate UCITS ETF", 
        "identifier": "IE00B8GF1M35"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Real Estate Investment",
        "description": "Investment strategy focused on real estate and property companies"
      },
      {
        "@type": "Thing", 
        "name": "REIT Dividends",
        "description": "Investment strategy focused on dividend income from real estate investments"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší nemovitostní ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší nemovitostní ETF jsou: iShares Developed Markets Property Yield UCITS ETF (IWDP, IE00B1FZS350) největší globální REIT ETF s vysokou dividendovou výnosností 3,19%, HSBC FTSE EPRA NAREIT Developed UCITS ETF (HPROP, IE00B5L01S80) s 1,37 mld. EUR a diverzifikovanou expozicí, a SPDR Dow Jones Global Real Estate UCITS ETF (RWX, IE00B8GF1M35) s 1,76 mld. EUR a quarterly dividendami."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou nemovitostní ETF a jak fungují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nemovitostní ETF investují do REIT fondů (Real Estate Investment Trusts) a nemovitostních společností. Poskytují expozici k nemovitostem bez přímého vlastnictví, vysoké dividendové výnosy a diverzifikaci portfolia."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do nemovitostních ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nemovitostní ETF poskytují vysoké dividendové výnosy (3-5%), diverzifikaci portfolia a ochranu před inflací. Jsou ideální pro investory hledající pravidelný příjem a expozici k nemovitostnímu trhu."
        }
      },
      {
        "@type": "Question",
        "name": "Jak často vyplácejí nemovitostní ETF dividendy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Většina nemovitostních ETF vyplácí dividendy čtvrtletně (quarterly). REIT fondy jsou ze zákona povinny vyplatit minimálně 90% zisků jako dividendy, což zajišťuje stabilní příjmy pro investory."
        }
      },
      {
        "@type": "Question",
        "name": "Jsou nemovitostní ETF vhodné pro začátečníky?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano, nemovitostní ETF jsou vhodné pro začátečníky díky jednoduché diverzifikaci a vysokým dividendám. Doporučujeme začít s největšími ETF jako IWDP nebo HPROP pro nejvyšší likviditu a stabilitu."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké riziko mají nemovitostní ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hlavní rizika jsou úrokové riziko (rostoucí úroky snižují atraktivitu REITs), cyklické kolísání nemovitostního trhu a měnové riziko u globálních ETF. Diverzifikace napříč regiony a sektory rizika snižuje."
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
        "name": "Nejlepší nemovitostní ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-nemovitostni-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-gray-50/30 to-green-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-orange-200 to-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-gray-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-green-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-gray-100 text-orange-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-orange-200/50">
                <BuildingIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-orange-600 via-gray-600 to-green-600 bg-clip-text text-transparent">
                  nemovitostní ETF
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
                Kompletní srovnání nejlepších nemovitostních ETF. 
                REIT fondy pro vysoké dividendy a diverzifikaci portfolia.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-orange-600 to-gray-600 hover:from-orange-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <BuildingIcon className="w-5 h-5 mr-2" />
                    Nemovitosti
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-3">
                    <BuildingIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Nemovitostní trh v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro REIT investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BuildingIcon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ REIT ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">3,5B</div>
                    <div className="text-xs text-gray-600">iShares Property Yield</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">DIVIDENDOVÝ VÝNOS</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">4,2%</div>
                    <div className="text-xs text-gray-600">roční dividendy</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <HomeIcon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP SEKTOR</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">25%</div>
                    <div className="text-xs text-gray-600">Residential REITs</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPinIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">GEOGRAFICKY</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">25+</div>
                    <div className="text-xs text-gray-600">zemí</div>
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
            <div className="flex items-center justify-center rounded-full bg-orange-100 w-20 h-20 mx-auto mb-8 hover:bg-orange-200 transition-colors hover-scale">
              <BuildingIcon className="w-10 h-10 text-orange-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou nemovitostní ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na REIT společnosti 
              pro diverzifikovanou expozici k nemovitostnímu trhu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-gray-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <DollarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-orange-800 transition-colors">Vysoké dividendy</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                REIT fondy musí vyplácet minimálně 90% zisků jako dividendy. 
                Poskytují stabilní dividendové výnosy 3-5% ročně.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-gray-500 to-green-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <HomeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-gray-800 transition-colors">Diverzifikace sektorů</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Expozice k residential, commercial, retail, industrial 
                a specialty REITs napříč různými geografickými regiony.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-orange-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUpIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-green-800 transition-colors">Ochrana před inflací</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Nemovitosti historicky rostou s inflací. REIT ETF poskytují 
                ochranu kupní síly a reálné výnosy v dlouhodobém horizontu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top 3 ETF Section */}
      <Top3ETFLiveSection 
        sectionId="top3"
        title="🏆 Top 3 nejlepší nemovitostní ETF"
        subtitle="Naše doporučení na základě analýzy velikosti fondů, dividendových výnosů a geografické diverzifikace"
        etfTemplates={TOP_3_REIT_ETFS_TEMPLATE}
        colorScheme="orange"
      />

      {/* Comprehensive ETF Sections */}
      <FilteredETFSections 
        indexKeywords={["Real Estate", "REIT", "Property", "Immobilien"]}
        excludeKeywords={["Equity", "Stock", "Bond", "Commodity", "Leveraged", "2x", "3x", "Short", "Bear", "China"]}
      />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="pruvodce" className="bg-gradient-to-br from-white to-orange-50 rounded-3xl p-12 border border-orange-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-100 to-gray-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-orange-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                🏠 Jak vybrat ten správný nemovitostní ETF?
              </h4>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Praktický průvodce výběrem nejlepšího nemovitostního ETF podle vaší investiční strategie a preference příjmů
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                  <BuildingIcon className="w-6 h-6 text-orange-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Typy nemovitostí</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Residential (byty), commercial (kanceláře), retail (obchody), industrial (sklady). 
                  Globální ETF kombinují všechny sektory pro diverzifikaci.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                  <DollarIcon className="w-6 h-6 text-green-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Dividendová politika</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  REIT ETF poskytují 3-5% dividendové výnosy. iShares IWDP má 4,2% výnos, 
                  většina vyplácí čtvrtletně nebo měsíčně.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                  <GlobeIcon className="w-6 h-6 text-gray-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Geografická expozice</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  USA dominuje (50-60%), poté Japonsko, Evropa a Austrálie. 
                  Evropské ETF se zaměřují na EU trhy s EUR expozicí.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                  <MapPinIcon className="w-6 h-6 text-orange-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Měnové zajištění</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Většina nemovitostních ETF není EUR hedged. Měnové riziko může ovlivnit 
                  výnosy při silném EUR vůči USD.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                  <TrendingUpIcon className="w-6 h-6 text-green-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Úrokové prostředí</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  REIT jsou citlivé na úrokové změny. Rostoucí úroky snižují atraktivitu 
                  dividendových výnosů REITs.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                  <AwardIcon className="w-6 h-6 text-gray-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Kvalita REITs</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sledujte FFO (Funds From Operations), zadluženost a kvalitu portfolia nemovitostí. 
                  Velké ETF drží etablované REITs.
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
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o nemovitostní ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">
                  Jaké jsou nejlepší nemovitostní ETF v roce 2025?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší nemovitostní ETF jsou: <strong>iShares Developed Markets Property Yield UCITS ETF</strong> (IWDP, IE00B1FZS350) 
                největší globální REIT ETF s vysokou dividendovou výnosností 3,19%, <strong>HSBC FTSE EPRA NAREIT Developed UCITS ETF</strong> (HPROP, IE00B5L01S80) 
                s 1,37 mld. EUR a diverzifikovanou expozicí, a <strong>SPDR Dow Jones Global Real Estate UCITS ETF</strong> 
                (RWX, IE00B8GF1M35) s 1,76 mld. EUR a quarterly dividendami.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">
                  Co jsou nemovitostní ETF a jak fungují?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Nemovitostní ETF</strong> investují do REIT fondů (Real Estate Investment Trusts) a nemovitostních společností. 
                Poskytují expozici k nemovitostem bez přímého vlastnictví, vysoké dividendové výnosy a diverzifikaci portfolia.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">
                  Proč investovat do nemovitostních ETF?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Nemovitostní ETF poskytují vysoké dividendové výnosy</strong> (3-5%), diverzifikaci portfolia a ochranu před inflací. 
                Jsou ideální pro investory hledající pravidelný příjem a expozici k nemovitostnímu trhu.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">
                  Jak často vyplácejí nemovitostní ETF dividendy?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Většina nemovitostních ETF vyplácí dividendy <strong>čtvrtletně (quarterly)</strong>. REIT fondy jsou ze zákona povinny vyplatit minimálně 90% zisků jako dividendy, což zajišťuje stabilní příjmy pro investory.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">
                  Jsou nemovitostní ETF vhodné pro začátečníky?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Ano, nemovitostní ETF jsou vhodné pro začátečníky díky jednoduché diverzifikaci a vysokým dividendám. Doporučujeme začít s největšími ETF jako <strong>IWDP nebo HPROP</strong> pro nejvyšší likviditu a stabilitu.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">
                  Jaké riziko mají nemovitostní ETF?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Hlavní rizika jsou <strong>úrokové riziko</strong> (rostoucí úroky snižují atraktivitu REITs), cyklické kolísání nemovitostního trhu a měnové riziko u globálních ETF. Diverzifikace napříč regiony a sektory rizika snižuje.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-orange-100">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-100 to-gray-100 w-20 h-20 mx-auto mb-6">
                <RocketIcon className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Připraveni diverzifikovat do nemovitostí?
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Nemovitostní ETF poskytují stabilní dividendy a expozici k realitnímu trhu. 
                Objevte nejlepší REIT fondy a rozšiřte své portfolio o nemovitostní sektor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-100">
                <BuildingIcon className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Vysoké dividendy</h4>
                <p className="text-sm text-gray-600">3-5% roční výnosy z REITs</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                <HomeIcon className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Diverzifikace</h4>
                <p className="text-sm text-gray-600">Expozice k nemovitostnímu trhu</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                <TrendingUpIcon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Inflační ochrana</h4>
                <p className="text-sm text-gray-600">Nemovitosti rostou s inflací</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-orange-600 to-gray-600 hover:from-orange-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                <a href="#top3">
                  <StarFilledIcon className="w-5 h-5 mr-2" />
                  Vybrat nemovitostní ETF
                </a>
              </Button>
              <Button asChild variant="outline" className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-3 text-lg font-semibold">
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
            href: "/nejlepsi-etf/nejlepsi-dluhopisove-etf", 
            title: "Nejlepší dluhopisové ETF",
            description: "Státní a korporátní dluhopisy"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-komoditni-etf",
            title: "Nejlepší komoditní ETF", 
            description: "Zlato, ropa a další komodity"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-etf-na-americke-akcie",
            title: "Nejlepší ETF na americké akcie",
            description: "S&P 500 a široký americký trh"
          }
        ]}
      />
    </Layout>
  );
}