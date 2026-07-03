import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, BanknoteIcon, PiggyBankIcon, TrendingDownIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, AwardIcon, GlobeIcon, TrendingUpIcon, ShieldIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nejlepší Dluhopisové ETF 2026 | Srovnání a Doporučení',
    description: 'Najděte nejlepší dluhopisové ETF pro rok 2026. Srovnání státních a korporátních bondů, EUR zajištění, výnosnosti a diverzifikace.',
    keywords: 'dluhopisové ETF, nejlepší bond ETF 2026, státní dluhopisy, korporátní dluhopisy, AGGH ETF, XGLE ETF, VAGF ETF',
    openGraph: {
      title: 'Nejlepší Dluhopisové ETF 2026 | Srovnání a Doporučení',
      description: 'Kompletní průvodce nejlepšími dluhopisovými ETF. Analyzujeme výnosy, rizika a diverzifikaci státních i korporátních dluhopisů.',
      type: 'article',
      url: 'https://etf-srovnani.cz/nejlepsi-etf/nejlepsi-dluhopisove-etf',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Nejlepší Dluhopisové ETF 2026',
      description: 'Srovnání nejlepších dluhopisových ETF pro stabilní příjmy a ochranu kapitálu.',
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-dluhopisove-etf',
    },
  };
}


export default async function NejlepsiDluhopisoveETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-dluhopisove-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší dluhopisové ETF ${currentYear} - státní a korporátní dluhopisy`,
    "description": "Srovnání nejlepších dluhopisových ETF 2026. Státní a korporátní dluhopisy, EUR zajištění, výnosy - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-bond-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-dluhopisove-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "dluhopisové ETF, státní dluhopisy, korporátní dluhopisy, bond ETF, AGGH, XGLE, VAGF",
    "wordCount": 2800,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Bond ETF",
        "description": "Exchange-traded funds focused on government and corporate bonds"
      },
      ...(etfs.slice(0, 3).map(etf => ({
        "@type": "FinancialProduct",
        "name": etf.name,
        "identifier": etf.isin
      })))
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Government Bonds",
        "description": "Investment strategy focused on government-issued debt securities"
      },
      {
        "@type": "Thing", 
        "name": "Corporate Bonds",
        "description": "Investment strategy focused on corporate debt securities"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší dluhopisové ETF v roce 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Nejlepší dluhopisové ETF jsou: ${etfs[0]?.name || 'iShares Core Global Aggregate Bond UCITS ETF EUR Hedged'} (${etfs[0]?.isin || 'IE00BDBRDM35'}), ${etfs[1]?.name || 'Xtrackers Global Government Bond UCITS ETF EUR Hedged'} (${etfs[1]?.isin || 'LU0378818131'}), a ${etfs[2]?.name || 'Vanguard Global Aggregate Bond UCITS ETF EUR Hedged'} (${etfs[2]?.isin || 'IE00BG47KH54'}). Tyto ETF nabízejí optimální poměr nákladů, výkonnosti a rizika.`
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou dluhopisové ETF a jak fungují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dluhopisové ETF investují do státních a korporátních dluhopisů. Poskytují stabilní příjmy z úroků, nižší volatilitu než akcie a diverzifikaci portfolia. EUR zajištěné verze eliminují měnové riziko pro české investory."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do dluhopisových ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dluhopisové ETF poskytují stabilitu, pravidelné příjmy a ochranu kapitálu. Jsou ideální pro konzervativní investory, diverzifikaci portfolia a ochranu před volatilitou akciových trhů."
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
        "name": "Nejlepší dluhopisové ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-dluhopisove-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-gray-50/30 to-green-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-gray-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-green-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-gray-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
                <BanknoteIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-blue-600 via-gray-600 to-green-600 bg-clip-text text-transparent">
                  dluhopisové ETF
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
                Kompletní srovnání nejlepších dluhopisových ETF. 
                Státní a korporátní dluhopisy pro stabilní příjmy a ochranu kapitálu.
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
                    <BanknoteIcon className="w-5 h-5 mr-2" />
                    Dluhopisy
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                    <BanknoteIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Dluhopisový trh v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro bond investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BanknoteIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ BOND ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">25,8B</div>
                    <div className="text-xs text-gray-600">iShares Global Aggregate</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,10%</div>
                    <div className="text-xs text-gray-600">Vanguard Global Aggregate</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">STABILITA</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">AAA</div>
                    <div className="text-xs text-gray-600">rating státních dluhopisů</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <PiggyBankIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">VÝNOSY</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">3-5%</div>
                    <div className="text-xs text-gray-600">roční výnosnost</div>
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
              <BanknoteIcon className="w-10 h-10 text-blue-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou dluhopisové ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na státní a korporátní dluhopisy 
              pro stabilní příjmy a ochranu kapitálu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-gray-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShieldIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-800 transition-colors">Stabilita a bezpečnost</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Dluhopisy poskytují předvídatelné úrokové výnosy a návratnost jistiny. 
                Státní dluhopisy jsou považovány za nejbezpečnější investice.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-gray-500 to-green-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <PiggyBankIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-gray-800 transition-colors">Pravidelné příjmy</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Dluhopisové ETF distribuují úrokové výnosy v pravidelných intervalech. 
                Ideální pro investory hledající stabilní cash flow.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BarChart3Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-green-800 transition-colors">Diverzifikace portfolia</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Dluhopisy jsou negatively korelované s akciemi. Poskytují ochranu 
                během poklesu akciových trhů a snižují celkovou volatilitu.
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
              Top 3 nejlepší dluhopisové ETF
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení na základě analýzy {etfs.length} dluhopisových ETF fondů
            </p>
          </div>

          <Top3ETFServer etfs={etfs} currency="CZK" />
        </div>
      </section>

      <Top10SectionsServer etfs={etfs} currency="CZK" categoryName="dluhopisové" />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="pruvodce" className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-12 border border-blue-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-gray-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                💰 Jak vybrat ten správný dluhopisový ETF?
              </h4>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Praktický průvodce výběrem nejlepšího dluhopisového ETF podle vaší investiční strategie a rizikového profilu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <BanknoteIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Typ dluhopisů</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Státní dluhopisy (nižší riziko) vs korporátní (vyšší výnos). 
                  Global Aggregate kombinuje oba typy pro optimální diverzifikaci.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                  <DollarIcon className="w-6 h-6 text-green-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Měnové zajištění</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  EUR hedged verze eliminují měnové riziko. Vanguard má nejnižší TER 0,10%, 
                  iShares největší likviditu 25,8 mld. EUR.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                  <ShieldIcon className="w-6 h-6 text-gray-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Duration a splatnost</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Dlouhodobé dluhopisy jsou citlivější na úrokové změny. 
                  Kratší duration = nižší volatilita při růstu úroků.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <GlobeIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Geografická diverzifikace</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Globální dluhopisové ETF kombinují USA, Evropu, Japonsko a další vyspělé země. 
                  Snižují riziko koncentrace na jeden region.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                  <TrendingUpIcon className="w-6 h-6 text-green-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Úrokové prostředí</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Rostoucí úroky tlačí ceny dluhopisů dolů. Krátkodobé dluhopisy 
                  jsou méně citlivé než dlouhodobé.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                  <AwardIcon className="w-6 h-6 text-gray-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Kreditní kvalita</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Investment grade dluhopisy (AAA-BBB) vs high yield. 
                  Vyšší rating = nižší riziko selhání emitenta.
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
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o dluhopisové ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Jaké jsou nejlepší dluhopisové ETF v roce 2026?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší dluhopisové ETF jsou: <strong>{etfs[0]?.name || 'iShares Core Global Aggregate Bond UCITS ETF EUR Hedged'}</strong> ({etfs[0]?.isin || 'IE00BDBRDM35'})
                {etfs[0]?.fund_size_numeric ? ` s velikostí ${(etfs[0].fund_size_numeric / 1000).toFixed(1)} mld. EUR` : ''}, <strong>{etfs[1]?.name || 'Xtrackers Global Government Bond UCITS ETF EUR Hedged'}</strong> ({etfs[1]?.isin || 'LU0378818131'})
                {etfs[1]?.ter_numeric ? ` s TER ${etfs[1].ter_numeric.toFixed(2)}%` : ''}, a <strong>{etfs[2]?.name || 'Vanguard Global Aggregate Bond UCITS ETF EUR Hedged'}</strong>
                ({etfs[2]?.isin || 'IE00BG47KH54'}){etfs[2]?.ter_numeric ? ` s TER ${etfs[2].ter_numeric.toFixed(2)}%` : ''}.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Co jsou dluhopisové ETF a jak fungují?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Dluhopisové ETF</strong> investují do státních a korporátních dluhopisů. Poskytují stabilní příjmy z úroků, 
                nižší volatilitu než akcie a diverzifikaci portfolia. EUR zajištěné verze eliminují měnové riziko pro české investory.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Proč investovat do dluhopisových ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Dluhopisové ETF poskytují stabilitu</strong>, pravidelné příjmy a ochranu kapitálu. Jsou ideální pro konzervativní investory, 
                diverzifikaci portfolia a ochranu před volatilitou akciových trhů.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Jaké jsou náklady na dluhopisové ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>TER (celkové náklady) dluhopisových ETF</strong> se pohybují mezi 0,10% až 0,50% ročně. Naše TOP 3 má velmi konkurenční poplatky:
                {etfs[0] && ` ${etfs[0].name} (${etfs[0].isin}) má TER ${etfs[0].ter_numeric?.toFixed(2)}%`},
                {etfs[1] && ` ${etfs[1].name} (${etfs[1].isin}) má TER ${etfs[1].ter_numeric?.toFixed(2)}%`},
                {etfs[2] && ` a ${etfs[2].name} (${etfs[2].isin}) má TER ${etfs[2].ter_numeric?.toFixed(2)}%`}.
                Dluhopisové ETF mají obecně nižší poplatky než akciové.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Jaká jsou rizika dluhopisových ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Hlavní rizika dluhopisových ETF</strong> zahrnují: úrokové riziko (rostoucí úroky snižují ceny dluhopisů), 
                kreditní riziko (možnost nesplacení), inflační riziko (eroze reálné hodnoty) a měnové riziko u nehedgovaných ETF. 
                Naše doporučené EUR hedged ETF eliminují měnové riziko pro české investory.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Kde koupit naše doporučené dluhopisové ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Naše TOP 3 dluhopisové ETF můžete koupit u většiny českých brokerů. <strong>{etfs[0]?.name || 'iShares Global Aggregate'}</strong> ({etfs[0]?.isin || 'IE00BDBRDM35'}),
                <strong>{etfs[1]?.name || 'Xtrackers Government Bond'}</strong> ({etfs[1]?.isin || 'LU0378818131'}) a <strong>{etfs[2]?.name || 'Vanguard Global Aggregate'}</strong> ({etfs[2]?.isin || 'IE00BG47KH54'})
                najdete u Degiro, Interactive Brokers, XTB, Trading212, Portu nebo Fio e-Broker. Porovnejte si transakční poplatky.
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
                Připraveni stabilizovat své portfolio?
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Dluhopisy poskytují stabilitu a pravidelné příjmy v každém portfoliu. 
                Objevte nejlepší dluhopisové ETF a chraňte se před volatilitou trhů.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                <BanknoteIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Stabilní výnosy</h4>
                <p className="text-sm text-gray-600">Předvídatelné úrokové příjmy</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                <ShieldIcon className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Ochrana kapitálu</h4>
                <p className="text-sm text-gray-600">Nižší volatilita než akcie</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                <PiggyBankIcon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Diverzifikace</h4>
                <p className="text-sm text-gray-600">Doplnění akciového portfolia</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-gray-600 hover:from-blue-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                <a href="#top3">
                  <StarFilledIcon className="w-5 h-5 mr-2" />
                  Vybrat dluhopisový ETF
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
            href: "/nejlepsi-etf/nejlepsi-etf-na-americke-akcie", 
            title: "Nejlepší ETF na americké akcie",
            description: "S&P 500 a široký americký trh"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-nemovitostni-etf",
            title: "Nejlepší nemovitostní ETF", 
            description: "REIT fondy pro diverzifikaci"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-komoditni-etf",
            title: "Nejlepší komoditní ETF",
            description: "Zlato, ropa a další komodity"
          }
        ]}
      />
    </Layout>
  );
}