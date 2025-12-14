import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, FlagIcon, TrendingUpIcon, BuildingIcon, AwardIcon, GlobeIcon, ShieldIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import ETFTableServer from '@/components/etf/ETFTableServer';
import { getTopETFsForCategory, categoryConfigs, getTotalETFCount } from '@/lib/etf-data';
import type { Metadata } from 'next';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Next.js Metadata API for SSR SEO
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return {
    title: `Nejlepší japonské ETF ${currentYear} - MSCI Japan vs Nikkei 225`,
    description: `✅ Srovnání nejlepších japonských ETF ${currentYear}. MSCI Japan, Nikkei 225 - poplatky TER, výnosy, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'japonské ETF',
      'MSCI Japan ETF',
      'Nikkei 225 ETF',
      `nejlepší japonské ETF ${currentYear}`,
      'japonský akciový trh',
      'ETF Japan',
      'iShares MSCI Japan',
      'Amundi Japan ETF',
      'investice do Japonska',
      'japonské akcie ETF',
      'TOPIX ETF',
      'japonský index ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší japonské ETF ${currentYear} - MSCI Japan vs Nikkei 225`,
      description: `Srovnání nejlepších japonských ETF ${currentYear}. MSCI Japan, Nikkei 225 - poplatky TER, výnosy, velikost fondů.`,
      type: 'article',
      locale: 'cs_CZ',
      siteName: 'ETF Průvodce',
      images: [
        {
          url: '/og-japanese-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší japonské ETF ${currentYear} - průvodce a porovnání`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší japonské ETF ${currentYear} - MSCI Japan vs Nikkei 225`,
      description: `Srovnání nejlepších japonských ETF ${currentYear}. MSCI Japan, Nikkei 225 - poplatky TER, výnosy, velikost fondů.`,
      images: ['/og-japanese-etf.jpg']
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-japonske-etf'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1
      }
    }
  }
}

export default async function NejlepsiJaponskeETF() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-japonske-etf'];
  const [etfs, lastModified, totalCount] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
    getTotalETFCount(),
  ]);

  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Article structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší japonské ETF ${currentYear} - MSCI Japan vs Nikkei 225`,
    "description": `Srovnání nejlepších japonských ETF ${currentYear}. MSCI Japan, Nikkei 225 - poplatky TER, výnosy, velikost fondů.`,
    "image": "https://www.etfpruvodce.cz/og-japanese-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-japonske-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "japonské ETF, MSCI Japan, Nikkei 225, investování, indexové fondy",
    "wordCount": 2500,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Japonské ETF",
        "description": "Exchange-traded funds tracking Japanese stock market indices"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Core MSCI Japan IMI UCITS ETF",
        "identifier": "IE00B4L5YX21"
      },
      {
        "@type": "FinancialProduct", 
        "name": "Amundi Core MSCI Japan UCITS ETF",
        "identifier": "LU1781541252"
      },
      {
        "@type": "FinancialProduct",
        "name": "UBS MSCI Japan Climate Paris Aligned UCITS ETF", 
        "identifier": "IE000JHYO4T6"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "MSCI Japan Index",
        "description": "Stock market index tracking largest Japanese companies"
      },
      {
        "@type": "Thing", 
        "name": "Nikkei 225",
        "description": "Price-weighted stock market index of 225 Japanese companies"
      }
    ]
  };

  // FAQ structured data for better search snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší japonské ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší japonské ETF jsou: iShares Core MSCI Japan IMI UCITS ETF (JPNA, IE00B4L5YX21) s TER 0,12% a velikostí 5,7 mld EUR, Amundi Core MSCI Japan UCITS ETF (AMJP, LU1781541252) s TER 0,12% a velikostí 4,2 mld EUR, a UBS MSCI Japan Climate Paris Aligned UCITS ETF (UBSJ, IE000JHYO4T6) s TER 0,15%."
        }
      },
      {
        "@type": "Question", 
        "name": "Jaký je rozdíl mezi MSCI Japan a Nikkei 225?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MSCI Japan obsahuje přibližně 230 největších japonských společností a pokrývá asi 85% japonského akciového trhu. Nikkei 225 sleduje pouze 225 vybraných společností a je cenově vážený index. MSCI Japan poskytuje širší diverzifikaci."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do japonských ETF?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Japonské ETF nabízejí expozici k třetí největší ekonomice světa s inovativními technologickými společnostmi. Japonsko má stabilní finanční systém, silnou manufakturu a atraktivní valuace oproti americkému a evropskému trhu."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou poplatky za japonské ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TER poplatky u nejlepších japonských ETF jsou velmi konkurenceschopné. iShares Core MSCI Japan IMI ETF (JPNA, IE00B4L5YX21) i Amundi Core MSCI Japan ETF (AMJP, LU1781541252) mají TER pouze 0,12%, zatímco UBS MSCI Japan Climate ETF (UBSJ, IE000JHYO4T6) má TER 0,15%."
        }
      },
      {
        "@type": "Question",
        "name": "Jaká jsou rizika japonských ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hlavní rizika zahrnují měnové riziko při změnách kurzu JPY/EUR, demografické výzvy stárnoucí populace a ekonomickou stagnaci. Závislost na exportu činí japonské společnosti citlivé na globální růst. Naše TOP 3 ETF tato rizika diverzifikují investicí do širokého spektra japonských firem."
        }
      },
      {
        "@type": "Question",
        "name": "Jak vybrat mezi různými japonskými ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Klíčové faktory jsou sledovaný index (MSCI Japan IMI vs standard), velikost fondu a TER poplatky. Pro širokou expozici doporučujeme iShares Core MSCI Japan IMI (JPNA, IE00B4L5YX21) s nejširším pokrytiem 1000+ společností. Pro ESG investing volte UBS MSCI Japan Climate (UBSJ, IE000JHYO4T6)."
        }
      }
    ]
  };

  // Breadcrumb structured data
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
        "name": "Nejlepší japonské ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-japonske-etf"
      }
    ]
  };

  return (
    <Layout>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Modern Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-orange-50/30 to-red-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-red-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-red-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-red-200/50">
                <FlagIcon className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  japonské ETF
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
                Kompletní srovnání nejlepších japonských ETF fondů dostupných pro evropské investory. 
                Analýza MSCI Japan vs Nikkei 225 a praktické tipy pro výběr.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <Link href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <Link href="#srovnani">
                    <BarChart3Icon className="w-5 h-5 mr-2" />
                    Srovnání ETF
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right Content - Market Stats */}
            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                
                {/* Simple Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-3">
                    <TrendingUpIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Japonský trh v číslech
                  </h3>
                  <p className="text-sm text-gray-600">Klíčová fakta o japonských investicích</p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-red-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BuildingIcon className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-gray-500 font-medium">EKONOMIKA</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">3.</div>
                    <div className="text-xs text-gray-600">největší na světě</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3Icon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">HDP</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">4,2B</div>
                    <div className="text-xs text-gray-600">USD ročně</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-red-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <GlobeIcon className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-gray-500 font-medium">MSCI JAPAN</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">230</div>
                    <div className="text-xs text-gray-600">největších firem</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldIcon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">DIVERZIFIKACE</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">20+</div>
                    <div className="text-xs text-gray-600">ETF k dispozici</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section id="uvod" className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-red-100 w-20 h-20 mx-auto mb-8 hover:bg-red-200 transition-colors hover-scale">
              <BuildingIcon className="w-10 h-10 text-red-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co je japonský akciový trh?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Třetí největší akciový trh světa s inovativními technologickými společnostmi a stabilitou
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.2s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BuildingIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-red-800 transition-colors">
                Třetí největší ekonomika
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Japonsko je třetí největší ekonomika světa s HDP přes 4,2 bilionu USD a stabilním finančním systémem.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.3s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ZapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-red-800 transition-colors">
                Technologické inovace
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Japonské společnosti vedou v robotice, elektromobilitě, AI a polovodičových technologiích.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.4s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <AwardIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-red-800 transition-colors">
                Světové korporace
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Domov Toyota, Sony, SoftBank, Nintendo a dalších globálně uznávaných značek.
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
              Top 3 nejlepší japonské ETF
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení na základě analýzy {etfs.length} japonských ETF fondů
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
              Kompletní srovnání japonských ETF fondů
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Top {Math.min(50, etfs.length)} japonských ETF fondů seřazených podle ratingu a velikosti
            </p>
          </div>

          <ETFTableServer etfs={etfs} showRank={true} currency="EUR" maxRows={50} />

          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-2">
              <Link href="/srovnani-etf">
                Zobrazit všech {totalCount.toLocaleString('cs-CZ')} ETF fondů
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nejčastější otázky
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Odpovědi na časté dotazy ohledně japonských ETF
            </p>
          </div>

          <div className="space-y-8">
            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">Jaké jsou nejlepší japonské ETF v roce 2025?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší japonské ETF jsou: <strong>iShares Core MSCI Japan IMI UCITS ETF</strong> (JPNA, IE00B4L5YX21) 
                s TER 0,12% a velikostí 5,7 mld EUR, <strong>Amundi Core MSCI Japan UCITS ETF</strong> (AMJP, LU1781541252) 
                s TER 0,12% a velikostí 4,2 mld EUR, a <strong>UBS MSCI Japan Climate Paris Aligned UCITS ETF</strong> 
                (UBSJ, IE000JHYO4T6) s TER 0,15% a velikostí 4,2 mld EUR.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">Jaký je rozdíl mezi MSCI Japan a Nikkei 225?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>MSCI Japan</strong> obsahuje přibližně 230 největších japonských společností a pokrývá asi 85% 
                japonského akciového trhu. <strong>Nikkei 225</strong> sleduje pouze 225 vybraných společností a je 
                cenově vážený index. MSCI Japan poskytuje širší diverzifikaci a je častěji používán v ETF.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">Proč investovat do japonských ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Japonské ETF nabízejí expozici k <strong>třetí největší ekonomice světa</strong> s inovativními 
                technologickými společnostmi. Japonsko má stabilní finanční systém, silnou manufakturu a zajímavé 
                valuace. ETF poskytují diverzifikovaný přístup k japonskému trhu s nízkými poplatky.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">Jaké jsou poplatky za japonské ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>TER poplatky</strong> u nejlepších japonských ETF jsou velmi konkurenceschopné. 
                <strong>iShares Core MSCI Japan IMI ETF</strong> (JPNA, IE00B4L5YX21) i <strong>Amundi Core MSCI Japan ETF</strong> (AMJP, LU1781541252) 
                mají TER pouze 0,12%, zatímco <strong>UBS MSCI Japan Climate ETF</strong> (UBSJ, IE000JHYO4T6) má TER 0,15%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">Jaká jsou rizika japonských ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Hlavní rizika zahrnují <strong>měnové riziko</strong> při změnách kurzu JPY/EUR, 
                <strong>demografické výzvy</strong> stárnoucí populace a <strong>ekonomickou stagnaci</strong>. 
                <strong>Závislost na exportu</strong> činí japonské společnosti citlivé na globální růst. 
                Naše TOP 3 ETF tato rizika diverzifikují investicí do širokého spektra japonských firem.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">Jak vybrat mezi různými japonskými ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Klíčové faktory jsou <strong>sledovaný index</strong> (MSCI Japan IMI vs standard), <strong>velikost fondu</strong> a <strong>TER poplatky</strong>. 
                Pro širokou expozici doporučujeme <strong>iShares Core MSCI Japan IMI</strong> (JPNA, IE00B4L5YX21) 
                s nejširším pokrytiem 1000+ společností. Pro ESG investing volte <strong>UBS MSCI Japan Climate</strong> (UBSJ, IE000JHYO4T6).
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Linking Component */}
      <InternalLinking 
        currentPage="japonske-etf"
        relatedLinks={[
          {
            title: "Nejlepší S&P 500 ETF",
            href: "/nejlepsi-etf/nejlepsi-sp500-etf",
            description: "Kompletní průvodce americkými S&P 500 ETF"
          },
          {
            title: "Nejlepší evropské ETF", 
            href: "/nejlepsi-etf/nejlepsi-evropske-etf",
            description: "Srovnání nejlepších evropských ETF fondů"
          },
          {
            title: "Srovnání ETF",
            href: "/srovnani-etf", 
            description: "Porovnejte si ETF podle různých kritérií"
          }
        ]}
      />
    </Layout>
  );
}