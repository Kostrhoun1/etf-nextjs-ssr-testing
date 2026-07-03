import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, ArrowRightIcon, TargetIcon, EarthIcon, CompassIcon, MapIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, GlobeIcon, ShieldIcon, BuildingIcon, TrendingUpIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Generate enhanced metadata for world ETF comparison page
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // SEO optimalizované datum - updated pouze jednou za měsíc
  const lastModified = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const publishedDate = `${currentYear}-01-15`;
  
  const title = `Nejlepší světové ETF ${currentYear} - IWDA vs XMWO vs VWCE`;
  const description = `✅ Srovnání nejlepších světových ETF ${currentYear}. IWDA, XMWO, VWCE - MSCI World vs FTSE All-World, poplatky TER, výnosy. Kompletní analýza k ${currentDate}.`;
  const canonical = 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-celosvetove-etf';
  const ogImage = 'https://www.etfpruvodce.cz/og-world-etf.jpg';
  
  // Enhanced keywords for better discoverability
  const keywords = [
    `nejlepší světové ETF ${currentYear}`,
    'IWDA ETF recenze',
    'XMWO ETF analýza',
    'VWCE ETF porovnání',
    'MSCI World ETF srovnání',
    'FTSE All-World ETF',
    'světové akcie investice',
    'globální diverzifikace',
    'iShares Core MSCI World',
    'Xtrackers MSCI World',
    'Vanguard All-World',
    'nejlevnější světové ETF',
    'největší světové ETF',
    'ETF TER poplatky svět',
    'developed markets ETF',
    'emerging markets zahrnuty'
  ].join(', ');

  // Comprehensive structured data schemas
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": ogImage,
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
    "datePublished": publishedDate,
    "dateModified": lastModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonical
    },
    "articleSection": "Investment Guides",
    "keywords": keywords,
    "about": [
      {
        "@type": "Thing",
        "name": "Světové ETF",
        "description": "Exchange-traded funds tracking global stock market indices covering multiple countries and regions"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Core MSCI World UCITS ETF",
        "identifier": "IE00B4L5Y983"
      },
      {
        "@type": "FinancialProduct",
        "name": "Xtrackers MSCI World UCITS ETF", 
        "identifier": "IE00BJ0KDQ92"
      },
      {
        "@type": "FinancialProduct",
        "name": "Vanguard FTSE All-World UCITS ETF",
        "identifier": "IE00BK5BQT80"
      }
    ],
    "mentions": [
      {
        "@type": "Organization",
        "name": "iShares",
        "description": "ETF provider by BlackRock"
      },
      {
        "@type": "Organization", 
        "name": "Xtrackers",
        "description": "ETF provider by DWS Group"
      },
      {
        "@type": "Organization",
        "name": "Vanguard",
        "description": "Leading low-cost ETF provider" 
      },
      {
        "@type": "Thing",
        "name": "MSCI World",
        "description": "Global stock market index covering developed markets worldwide"
      },
      {
        "@type": "Thing",
        "name": "FTSE All-World", 
        "description": "Global stock market index covering both developed and emerging markets"
      }
    ]
  };
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage", 
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi MSCI World a FTSE All-World?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MSCI World pokrývá pouze vyspělé trhy (1600+ akcií), zatímco FTSE All-World zahrnuje i rozvíjející se trhy (3900+ akcií). FTSE All-World je tedy širší a diverzifikovanější, ale může být volatilnější."
        }
      },
      {
        "@type": "Question", 
        "name": "Který světový ETF má nejnižší poplatky?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Xtrackers MSCI World ETF (XMWO, IE00BJ0KDQ92) má nejnižší TER pouze 0,12% mezi našimi TOP 3 doporučeními. iShares Core MSCI World (IWDA, IE00B4L5Y983) má TER 0,20% a Vanguard FTSE All-World (VWCE, IE00BK5BQT80) má TER 0,22%."
        }
      },
      {
        "@type": "Question",
        "name": "Zahrnují světové ETF i americké akcie?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano, americké akcie tvoří 60-70% světových indexů kvůli velikosti amerického trhu. Světové ETF tedy poskytují značnou expozici k USA, ale i k Evropě, Japonsku a dalším trhům."
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
        "name": "ETF průvodce.cz",
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
        "name": "Nejlepší světové ETF",
        "item": canonical
      }
    ]
  };
  
  return {
    title,
    description,
    keywords,
    authors: [{ name: 'ETF průvodce.cz' }],
    creator: 'ETF průvodce.cz',
    publisher: 'ETF průvodce.cz',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    
    // Open Graph
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonical,
      siteName: 'ETF průvodce.cz',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'Nejlepší světové ETF - srovnání IWDA vs XMWO vs VWCE'
        }
      ],
      locale: 'cs_CZ',
      publishedTime: publishedDate,
      modifiedTime: lastModified,
      authors: ['ETF průvodce.cz'],
      section: 'Investment Guides',
      tags: keywords.split(', ')
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      site: '@ETFPruvodce',
      creator: '@ETFPruvodce'
    },
    
    // Additional meta tags
    alternates: {
      canonical
    },
    
    // Structured data
    other: {
      'application/ld+json': JSON.stringify([
        articleSchema,
        faqSchema,
        breadcrumbSchema
      ])
    }
  };
}

export default async function NejlepsiSvetoveETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-celosvetove-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const relatedLinks = [
    {
      title: "Nejlepší S&P 500 ETF",
      description: "Americké blue chip ETF na S&P 500 index",
      href: "/nejlepsi-etf/nejlepsi-sp500-etf",
      category: "Regionální ETF"
    },
    {
      title: "Nejlepší evropské ETF",
      description: "Evropské ETF na STOXX 600 a další indexy",
      href: "/nejlepsi-etf/nejlepsi-evropske-etf",
      category: "Regionální ETF"
    },
    {
      title: "Kde koupit světové ETF",
      description: "Srovnání brokerů pro světové investice",
      href: "/kde-koupit-etf",
      category: "Praktické tipy"
    },
    {
      title: "Portfolio strategie se světovými ETF",
      description: "Jak sestavit globální portfolio",
      href: "/portfolio-strategie",
      category: "Investiční strategie"
    }
  ];

  // Enhanced structured data with actual ETF data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší světové ETF ${currentYear} - IWDA vs XMWO vs VWCE`,
    "description": `Kompletní srovnání nejlepších světových ETF ${currentYear}. MSCI World vs FTSE All-World analýza.`,
    "image": "https://www.etfpruvodce.cz/og-world-etf.jpg",
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
    "datePublished": `${currentYear}-01-15`,
    "dateModified": lastModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-celosvetove-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": `nejlepší světové ETF ${currentYear}, IWDA, XMWO, VWCE, MSCI World`,
    "wordCount": 2800,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Světové ETF",
        "description": "Exchange-traded funds tracking global stock market indices"
      },
      ...(etfs.slice(0, 3).map(etf => ({
        "@type": "FinancialProduct",
        "name": etf.name,
        "identifier": etf.isin
      })))
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi MSCI World a FTSE All-World?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MSCI World pokrývá pouze vyspělé trhy (1600+ akcií), zatímco FTSE All-World zahrnuje i rozvíjející se trhy (3900+ akcií). FTSE All-World je tedy širší a diverzifikovanější."
        }
      },
      {
        "@type": "Question",
        "name": "Který světový ETF má nejnižší poplatky?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${etfs[0]?.name || 'Top světové ETF'} patří mezi nejlevnější s TER ${etfs[0]?.ter_numeric || '0.12'}%.`
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
        "name": "ETF průvodce.cz",
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
        "name": "Nejlepší světové ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-celosvetove-etf"
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
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>
        
        {/* Animated blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
                <GlobeIcon className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  světové ETF
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
                Kompletní srovnání nejlepších světových ETF fondů. MSCI World vs FTSE All-World analýza, poplatky, výnosy a praktické tipy pro globální diverzifikaci.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#top3">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                  asChild
                >
                  <Link href="#srovnani">
                    <BarChart3Icon className="w-5 h-5 mr-2" />
                    Srovnání všech
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Stats Box */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-blue-50/60 backdrop-blur-sm rounded-3xl shadow-2xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/80 to-blue-50/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🌍 Světové ETF Stats</h3>
                  <p className="text-gray-600">Klíčové informace o globálních indexech</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-1">23</div>
                    <div className="text-sm text-gray-600">Vyspělých zemí</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">~10%</div>
                    <div className="text-sm text-gray-600">Ročně za 30 let</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-1">1600+</div>
                    <div className="text-sm text-gray-600">Akcií (MSCI World)</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl border border-pink-200">
                    <div className="text-3xl font-bold text-pink-600 mb-1">60%</div>
                    <div className="text-sm text-gray-600">USA podíl</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-6 border-t border-blue-200/50">
                  <p className="text-sm text-gray-600 mb-3">Maximální diverzifikace</p>
                  <Link href="#pruvodce">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      Průvodce výběrem
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Co jsou světové ETF?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Světové ETF sledují globální akciové indexy pokrývající tisíce společností napříč vyspělými trhy. 
              Poskytují maximální diverzifikaci v jednom fondu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: EarthIcon,
                title: "Globální diverzifikace",
                description: "Světové ETF pokrývají 23 vyspělých zemí včetně USA, Evropy, Japonska, Kanady a Austrálie pro maximální rozložení rizika.",
                color: "from-blue-500 to-indigo-600",
                delay: "0.2s"
              },
              {
                icon: CompassIcon,
                title: "Dva hlavní indexy",
                description: "MSCI World (1600+ akcií, pouze vyspělé trhy) vs FTSE All-World (3900+ akcií, včetně emerging markets).",
                color: "from-indigo-500 to-purple-600",
                delay: "0.3s"
              },
              {
                icon: MapIcon,
                title: "Historicky 10% ročně",
                description: "Světové akcie dosáhly průměrného ročního výnosu ~10% za posledních 30 let při rozumné volatilitě.",
                color: "from-purple-500 to-pink-600",
                delay: "0.4s"
              }
            ].map((item, index) => (
              <div key={index} className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: item.delay}}>
                <div className={`flex items-center justify-center rounded-full bg-gradient-to-r ${item.color} w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-gray-800 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top 3 Recommendations - Server-side rendered with real data */}
      <section id="top3" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🏆 Top 3 nejlepší světové ETF
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení na základě analýzy všech dostupných světových ETF
            </p>
          </div>

          <Top3ETFServer etfs={etfs} currency="CZK" />
        </div>
      </section>

      {/* Top 10 Sections - by TER, AUM, Performance */}
      <Top10SectionsServer etfs={etfs} currency="CZK" categoryName="celosvětové" />

      {/* Selection Guide */}
      <section id="pruvodce" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
              <TargetIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              💡 Jak vybrat ten správný světový ETF?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                number: "1",
                title: "MSCI World vs FTSE All-World",
                description: "MSCI World = pouze vyspělé trhy (1600 akcií). FTSE All-World = vyspělé + emerging markets (3900 akcií). Začátečníci volí MSCI World, pokročilí FTSE All-World.",
                color: "from-blue-400 to-blue-500",
                bgColor: "from-blue-50 to-blue-50",
                borderColor: "border-blue-200"
              },
              {
                number: "2", 
                title: "Sledujte TER a velikost",
                description: "Ideální TER je 0,12-0,22%. Velikost fondu min. 1 mld. EUR pro dobrou likviditu. Xtrackers MSCI World má nejnižší TER 0,12%.",
                color: "from-indigo-400 to-indigo-500",
                bgColor: "from-indigo-50 to-indigo-50",
                borderColor: "border-indigo-200"
              },
              {
                number: "3",
                title: "Accumulating vs Distributing", 
                description: "ACC = reinvestuje dividendy automaticky. DIST = vyplácí dividendy. Pro dlouhodobé spoření volte ACC, pro pravidelný příjem DIST.",
                color: "from-purple-400 to-purple-500",
                bgColor: "from-purple-50 to-purple-50", 
                borderColor: "border-purple-200"
              },
              {
                number: "4",
                title: "Provider a tracking error",
                description: "iShares, Vanguard, Xtrackers jsou top provideři. Sledujte tracking difference - odchylku výnosu ETF od indexu. Ideálně pod 0,2% ročně.",
                color: "from-pink-400 to-pink-500",
                bgColor: "from-pink-50 to-pink-50",
                borderColor: "border-pink-200"
              }
            ].map((item, index) => (
              <div key={index} className={`relative p-8 rounded-2xl bg-gradient-to-br ${item.bgColor} border ${item.borderColor} hover:shadow-lg transition-all duration-300`}>
                <div className={`absolute -top-4 left-8 w-8 h-8 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {item.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 mt-4">
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ❓ Často kladené otázky
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                question: "Jaký je rozdíl mezi MSCI World a FTSE All-World?",
                answer: "MSCI World pokrývá pouze vyspělé trhy (1600+ akcií z 23 zemí), zatímco FTSE All-World zahrnuje i rozvíjející se trhy (3900+ akcií). FTSE All-World je širší, ale může být volatilnější kvůli emerging markets."
              },
              {
                question: "Který světový ETF má nejnižší poplatky?",
                answer: "Xtrackers MSCI World ETF (XMWO, IE00BJ0KDQ92) má nejnižší TER pouze 0,12% mezi našimi TOP 3 doporučeními. iShares Core MSCI World (IWDA, IE00B4L5Y983) má TER 0,20% a Vanguard FTSE All-World (VWCE, IE00BK5BQT80) má TER 0,22%."
              },
              {
                question: "Zahrnují světové ETF americké akcie?",
                answer: "Ano, USA tvoří 60-70% světových indexů kvůli velikosti amerického akciového trhu. Světové ETF tedy poskytují značnou expozici k americkým akciím, ale i k Evropě, Japonsku a dalším trhům."
              },
              {
                question: "Je lepší jeden světový ETF nebo kombinace regionálních?",
                answer: "Pro začátečníky je lepší jeden světový ETF - jednodušší správa a automatické rebalancování. Pokročilí investoři mohou kombinovat regionální ETF pro přesnější kontrolu nad alokací."
              },
              {
                question: "Jaké jsou historické výnosy světových ETF?",
                answer: "Světové akcie dosáhly průměrného ročního výnosu ~10% za posledních 30 let. Konkrétní výnosy najdete v našich žebříčcích 'Top 10 podle výkonu 1Y' s aktuálními daty."
              },
              {
                question: "Jsou data o ETF na této stránce aktuální?",
                answer: "Ano, všechna data (TER, velikost fondů, výnosy) se načítají živě z naší databáze a jsou aktualizována denně. Žebříčky TOP 10 ukazují nejčerstvější informace."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Připraveni investovat do světových ETF?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Vyberte si brokera a začněte budovat své globální portfolio ještě dnes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link href="/kde-koupit-etf">
                <ShieldIcon className="w-5 h-5 mr-2" />
                Najít brokera pro ETF
              </Link>
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link href="/srovnani-etf">
                <BarChart3Icon className="w-5 h-5 mr-2" />
                Srovnat všechny ETF
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Internal Linking */}
      <InternalLinking 
        relatedLinks={relatedLinks}
        className="bg-blue-50"
      />
    </Layout>
  );
}