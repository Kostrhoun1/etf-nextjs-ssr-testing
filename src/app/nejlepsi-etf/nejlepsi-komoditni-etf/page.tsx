import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, CoinsIcon, FuelIcon, FactoryIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, ShieldIcon, GlobeIcon, TrendingUpIcon, AwardIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nejlepší Komoditní ETF 2026 | Srovnání a Doporučení',
    description: 'Najděte nejlepší komoditní ETF pro rok 2026. Srovnání investic do zlata, ropy, zemědělských komodit a diverzifikace.',
    keywords: 'komoditní ETF, nejlepší commodity ETF 2026, zlato ETF, ropa ETF, zemědělské komodity, ICOM ETF, XCOM ETF, GCOM ETF',
    openGraph: {
      title: 'Nejlepší Komoditní ETF 2026 | Srovnání a Doporučení',
      description: 'Kompletní průvodce nejlepšími komoditními ETF. Analyzujeme zlato, ropu, zemědělské komodity a ochranu před inflací.',
      type: 'article',
      url: 'https://etf-srovnani.cz/nejlepsi-etf/nejlepsi-komoditni-etf',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Nejlepší Komoditní ETF 2026',
      description: 'Srovnání nejlepších komoditních ETF pro ochranu před inflací a diverzifikaci portfolia.',
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-komoditni-etf',
    },
  };
}


export default async function NejlepsiKomoditniETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-komoditni-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší komoditní ETF ${currentYear} - zlato, ropa a diverzifikace`,
    "description": "Srovnání nejlepších komoditních ETF 2026. Zlato, ropa, zemědělské komodity, inflační ochrana - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-commodity-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-komoditni-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "komoditní ETF, zlato ETF, ropa ETF, zemědělské komodity, ICOM, XCOM, GCOM",
    "wordCount": 2800,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Commodity ETF",
        "description": "Exchange-traded funds focused on commodities and natural resources"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Diversified Commodity Swap UCITS ETF (Acc)",
        "identifier": "IE00BDQZRK82"
      },
      {
        "@type": "FinancialProduct", 
        "name": "Xtrackers DBLCI Optimum Yield Commodity UCITS ETF 1C",
        "identifier": "LU0292106167"
      },
      {
        "@type": "FinancialProduct",
        "name": "WisdomTree Broad Commodities UCITS ETF USD Acc", 
        "identifier": "IE00B8CRQX21"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Gold Investment",
        "description": "Investment strategy focused on gold and precious metals"
      },
      {
        "@type": "Thing", 
        "name": "Oil Investment",
        "description": "Investment strategy focused on energy commodities"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší komoditní ETF v roce 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší komoditní ETF jsou: iShares Diversified Commodity Swap UCITS ETF (ICOM, IE00BDQZRK82) největší diverzifikovaný commodity ETF s 2,81 mld. EUR, Xtrackers DBLCI Optimum Yield Commodity UCITS ETF (XCOM, LU0292106167) s 1,47 mld. EUR, a WisdomTree Broad Commodities UCITS ETF (GCOM, IE00B8CRQX21) s 1,12 mld. EUR."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou komoditní ETF a jak fungují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Komoditní ETF investují do futures kontraktů na komodity jako zlato, ropa, zemědělské produkty a průmyslové kovy. Poskytují expozici k cenám komodit bez fyzického vlastnictví a ochranu před inflací."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do komoditních ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Komoditní ETF poskytují ochranu před inflací, diverzifikaci portfolia a často negativní korelaci s akciemi. Jsou ideální během období vysoké inflace a ekonomické nejistoty."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou nejlevnější komoditní ETF s nízkými náklady?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlevnější komoditní ETF jsou: iShares Diversified Commodity Swap UCITS ETF (ICOM, IE00BDQZRK82) s TER 0,19%, WisdomTree Broad Commodities UCITS ETF (GCOM, IE00B8CRQX21) s TER 0,49%, a Xtrackers DBLCI Optimum Yield Commodity UCITS ETF (XCOM, LU0292106167) s TER 0,65%."
        }
      },
      {
        "@type": "Question",
        "name": "Který komoditní ETF má největší velikost a likviditu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Největší komoditní ETF je iShares Diversified Commodity Swap UCITS ETF (ICOM, IE00BDQZRK82) s velikostí 2,81 mld. EUR. Poskytuje nejvyšší likviditu, nejužší spready a nejvíce diverzifikovanou expozici k 24 komoditám."
        }
      },
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi swap-based a physically-backed komoditními ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Swap-based ETF jako iShares ICOM (IE00BDQZRK82) nedrží fyzické komodity, ale používají deriváty. Physically-backed ETF vlastní skutečné komodity (např. zlato). Swap-based mají nižší TER ale vyšší protistranu riziko."
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
        "name": "Nejlepší komoditní ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-komoditni-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-gray-50/30 to-orange-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-yellow-200 to-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-gray-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-gray-100 text-yellow-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-yellow-200/50">
                <CoinsIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-yellow-600 via-gray-600 to-orange-600 bg-clip-text text-transparent">
                  komoditní ETF
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
                Kompletní srovnání nejlepších komoditních ETF. 
                Zlato, ropa, zemědělské komodity pro ochranu před inflací a diverzifikaci.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-yellow-600 to-gray-600 hover:from-yellow-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <CoinsIcon className="w-5 h-5 mr-2" />
                    Komodity
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-3">
                    <CoinsIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Komoditní trh v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro commodity investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-yellow-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CoinsIcon className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ COMMODITY ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">2,8B</div>
                    <div className="text-xs text-gray-600">iShares Diversified</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarIcon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">INFLAČNÍ OCHRANA</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">+15%</div>
                    <div className="text-xs text-gray-600">při vysoké inflaci</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-yellow-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <FactoryIcon className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP SEKTOR</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">35%</div>
                    <div className="text-xs text-gray-600">energetické komodity</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <FuelIcon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">DIVERZIFIKACE</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">14+</div>
                    <div className="text-xs text-gray-600">různých komodit</div>
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
              <CoinsIcon className="w-10 h-10 text-yellow-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou komoditní ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na komodity a přírodní zdroje 
              pro ochranu před inflací a diverzifikaci portfolia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-gray-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShieldIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-yellow-800 transition-colors">Ochrana před inflací</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Komodity historicky rostou s inflací a poskytují ochranu kupní síly. 
                Ceny základních surovin rostou při zvýšených nákladech na výrobu.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-gray-500 to-orange-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FuelIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-gray-800 transition-colors">Diverzifikace sektorů</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Energetické (ropa, plyn), zemědělské (obilí, káva), průmyslové kovy (měď, hliník) 
                a drahé kovy (zlato, stříbro) poskytují širokou diverzifikaci.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-yellow-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BarChart3Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-orange-800 transition-colors">Negativní korelace</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Komodity mají často negativní korelaci s akciemi a dluhopisy. 
                Poskytují ochranu během ekonomických krizí a trhových poklesů.
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
              Top 3 nejlepší komoditní ETF {currentYear}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení nejlepších komoditních ETF na základě analýzy {etfs.length} fondů
            </p>
          </div>

          <Top3ETFServer etfs={etfs} currency="CZK" />
        </div>
      </section>

      <Top10SectionsServer etfs={etfs} currency="CZK" categoryName="komoditní" />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="pruvodce" className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-12 border border-yellow-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-100 to-gray-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-yellow-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                🥇 Jak vybrat ten správný komoditní ETF?
              </h4>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Praktický průvodce výběrem nejlepšího komoditního ETF podle vaší investiční strategie a ekonomického cyklu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4">
                  <CoinsIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Typy komodit</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Energetické (ropa 35%), zemědělské (obilí 25%), průmyslové kovy (měď 20%) 
                  a drahé kovy (zlato 20%). Diverzifikované ETF kombinují všechny.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                  <DollarIcon className="w-6 h-6 text-orange-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Struktura a náklady</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Swap-based ETF (nižší TER 0,19-0,65%) vs physically-backed (vyšší náklady). 
                  Pozor na contango efekt u futures kontraktů.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                  <FactoryIcon className="w-6 h-6 text-gray-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Ekonomický cyklus</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Komodity prospívají během pozdní fáze ekonomického růstu a vysoké inflace. 
                  Trpí během recese a deflace.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4">
                  <GlobeIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Měnové riziko</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Komodity jsou denominované v USD. Silný EUR snižuje výnosy z commodity ETF 
                  pro evropské investory.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                  <TrendingUpIcon className="w-6 h-6 text-orange-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Volatilita a timing</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Komoditní ETF jsou vysoce volatilní. Ideální jako malá část portfolia (5-10%) 
                  pro diverzifikaci a inflační ochranu.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                  <AwardIcon className="w-6 h-6 text-gray-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Velikost a likvidita</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Vybírejte ETF s minimálně 1 mld. EUR pro stabilitu. iShares ICOM (2,8 mld.) 
                  má nejvyšší likviditu a nejužší spready.
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
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o komoditní ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Jaké jsou nejlepší komoditní ETF v roce 2026?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší komoditní ETF jsou: <strong>iShares Diversified Commodity Swap UCITS ETF</strong> (ICOM, IE00BDQZRK82) 
                největší diverzifikovaný commodity ETF s 2,81 mld. EUR, <strong>Xtrackers DBLCI Optimum Yield Commodity UCITS ETF</strong> (XCOM, LU0292106167) 
                s 1,47 mld. EUR, a <strong>WisdomTree Broad Commodities UCITS ETF</strong> 
                (GCOM, IE00B8CRQX21) s 1,12 mld. EUR.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Co jsou komoditní ETF a jak fungují?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Komoditní ETF</strong> investují do futures kontraktů na komodity jako zlato, ropa, zemědělské produkty a průmyslové kovy. 
                Poskytují expozici k cenám komodit bez fyzického vlastnictví a ochranu před inflací.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Proč investovat do komoditních ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Komoditní ETF poskytují ochranu před inflací</strong>, diverzifikaci portfolia a často negativní korelaci s akciemi. 
                Jsou ideální během období vysoké inflace a ekonomické nejistoty.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Jaké jsou nejlevnější komoditní ETF s nízkými náklady?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlevnější komoditní ETF jsou: <strong>iShares Diversified Commodity Swap UCITS ETF</strong> (ICOM, IE00BDQZRK82) 
                s TER 0,19%, <strong>WisdomTree Broad Commodities UCITS ETF</strong> (GCOM, IE00B8CRQX21) 
                s TER 0,49%, a <strong>Xtrackers DBLCI Optimum Yield Commodity UCITS ETF</strong> (XCOM, LU0292106167) s TER 0,65%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Který komoditní ETF má největší velikost a likviditu?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Největší komoditní ETF je <strong>iShares Diversified Commodity Swap UCITS ETF</strong> (ICOM, IE00BDQZRK82) 
                s velikostí 2,81 mld. EUR. Poskytuje nejvyšší likviditu, nejužší spready a nejvíce diverzifikovanou expozici k 24 komoditám.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Jaký je rozdíl mezi swap-based a physically-backed komoditními ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Swap-based ETF</strong> jako iShares ICOM (IE00BDQZRK82) nedrží fyzické komodity, ale používají deriváty. 
                <strong>Physically-backed ETF</strong> vlastní skutečné komodity (např. zlato). Swap-based mají nižší TER ale vyšší protistranu riziko.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-yellow-100">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-100 to-gray-100 w-20 h-20 mx-auto mb-6">
                <RocketIcon className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Připraveni ochránit se před inflací?
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Komoditní ETF poskytují ochranu před inflací a diverzifikaci portfolia. 
                Objevte nejlepší commodity fondy a chraňte své úspory před znehodnocením.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-yellow-50 rounded-xl border border-yellow-100">
                <CoinsIcon className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Inflační ochrana</h4>
                <p className="text-sm text-gray-600">Komodity rostou s inflací</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                <FactoryIcon className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Diverzifikace</h4>
                <p className="text-sm text-gray-600">Negativní korelace s akciemi</p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-100">
                <FuelIcon className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Přírodní zdroje</h4>
                <p className="text-sm text-gray-600">Základní suroviny ekonomiky</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-yellow-600 to-gray-600 hover:from-yellow-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                <a href="#top3">
                  <StarFilledIcon className="w-5 h-5 mr-2" />
                  Vybrat komoditní ETF
                </a>
              </Button>
              <Button asChild variant="outline" className="border-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50 px-8 py-3 text-lg font-semibold">
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
            href: "/nejlepsi-etf/nejlepsi-zlate-etf", 
            title: "Nejlepší zlaté ETF",
            description: "Investice do zlata a drahých kovů"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-dluhopisove-etf",
            title: "Nejlepší dluhopisové ETF", 
            description: "Státní a korporátní dluhopisy"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-nemovitostni-etf",
            title: "Nejlepší nemovitostní ETF",
            description: "REIT fondy a nemovitosti"
          }
        ]}
      />
    </Layout>
  );
}