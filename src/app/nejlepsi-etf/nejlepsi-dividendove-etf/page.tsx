import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarIcon, BarChart3Icon, TargetIcon, PercentIcon, CalendarIcon, PiggyBankIcon, DollarSignIcon, RocketIcon, ZapIcon, UsersIcon, AwardIcon, GlobeIcon, TrendingUpIcon, ShieldIcon, BuildingIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFList from '@/components/blog/FilteredETFList';
import type { Metadata } from 'next';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// Top 3 doporučené dividendové ETF - editoriální výběr s live daty z databáze
const TOP_3_DIVIDEND_ETFS_TEMPLATE = [
  {
    name: "Vanguard FTSE All-World High Dividend Yield UCITS ETF",
    ticker: "VHYL",
    isin: "IE00B8GKDB10",
    provider: "Vanguard",
    degiroFree: false,
    reason: "Největší dividendový ETF s expozicí k celosvětovým vysokodividendovým akciím. Nízký TER 0,29% a quarterly výplaty.",
  },
  {
    name: "VanEck Morningstar Developed Markets Dividend Leaders UCITS ETF", 
    ticker: "TDIV",
    isin: "NL0011683594",
    provider: "VanEck",
    degiroFree: false,
    reason: "Zaměřuje se na dividendové lídry z vyspělých trhů s důrazem na kvalitu a udržitelnost dividend.",
  },
  {
    name: "SPDR S&P US Dividend Aristocrats UCITS ETF",
    ticker: "SPYD", 
    isin: "IE00B6YX5D40",
    provider: "SPDR ETF",
    degiroFree: false,
    reason: "Investice do amerických Dividend Aristocrats - společností, které zvyšovaly dividendy minimálně 25 let v řadě.",
  }
];

// Next.js Metadata API for SSR SEO
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return {
    title: `Nejlepší dividendové ETF ${currentYear} | Srovnání`,
    description: `✅ Srovnání nejlepších dividendových ETF ${currentYear}. Dividend Aristocrats, High Yield - dividendové výnosy, TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'dividendové ETF',
      'Dividend Aristocrats ETF',
      'High Dividend Yield ETF',
      `nejlepší dividendové ETF ${currentYear}`,
      'pasivní příjem ETF',
      'dividendový výnos',
      'Vanguard VHYL',
      'SPDR Dividend Aristocrats',
      'VanEck TDIV',
      'investice pro příjem',
      'quarterly dividendy',
      'měsíční dividendy'
    ].join(', '),
    openGraph: {
      title: `Nejlepší dividendové ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších dividendových ETF ${currentYear}. Dividend Aristocrats, High Yield - dividendové výnosy, TER, velikost fondů.`,
      type: 'article',
      locale: 'cs_CZ',
      siteName: 'ETF Průvodce',
      images: [
        {
          url: '/og-dividend-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší dividendové ETF ${currentYear} - průvodce a porovnání`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší dividendové ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších dividendových ETF ${currentYear}. Dividend Aristocrats, High Yield - dividendové výnosy, TER, velikost fondů.`,
      images: ['/og-dividend-etf.jpg']
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-dividendove-etf'
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

export default async function NejlepsiDividendoveETF() {
  // Get last modified date from database (all ETF updates)
  const lastModified = await getLastModifiedDate();

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
    "headline": `Nejlepší dividendové ETF ${currentYear} - Dividend Aristocrats vs High Yield`,
    "description": `Srovnání nejlepších dividendových ETF ${currentYear}. Dividend Aristocrats, High Yield - dividendové výnosy, TER, velikost fondů.`,
    "image": "https://www.etfpruvodce.cz/og-dividend-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-dividendove-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "dividendové ETF, Dividend Aristocrats, High Yield, pasivní příjem, investování",
    "wordCount": 2800,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Dividendové ETF",
        "description": "Exchange-traded funds focused on high dividend yielding stocks"
      },
      {
        "@type": "FinancialProduct",
        "name": "Vanguard FTSE All-World High Dividend Yield UCITS ETF",
        "identifier": "IE00B8GKDB10"
      },
      {
        "@type": "FinancialProduct", 
        "name": "VanEck Morningstar Developed Markets Dividend Leaders UCITS ETF",
        "identifier": "NL0011683594"
      },
      {
        "@type": "FinancialProduct",
        "name": "SPDR S&P US Dividend Aristocrats UCITS ETF", 
        "identifier": "IE00B6YX5D40"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Dividend Aristocrats",
        "description": "Companies that have increased dividends for 25+ consecutive years"
      },
      {
        "@type": "Thing", 
        "name": "Dividend Yield",
        "description": "Annual dividend payment as percentage of current stock price"
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
        "name": "Jaké jsou nejlepší dividendové ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší dividendové ETF jsou: Vanguard FTSE All-World High Dividend Yield UCITS ETF (IE00B8GKDB10) s dividendovým výnosem 3,01% a TER 0,29%, VanEck Morningstar Developed Markets Dividend Leaders UCITS ETF (NL0011683594) s výnosem 3,24%, a SPDR S&P US Dividend Aristocrats UCITS ETF (IE00B6YX5D40) s výnosem 2,20%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou Dividend Aristocrats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dividend Aristocrats jsou společnosti, které zvyšovaly dividendy minimálně 25 let v řadě. Tyto společnosti prokazují stabilní cash flow a dlouhodobý růst. ETF sledující Dividend Aristocrats nabízejí kombinaci růstu dividend a stability výplat."
        }
      },
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi distribučními a akumulačními dividendovými ETF?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Distribuční ETF vyplácejí dividendy přímo na váš účet (quarterly, semi-annually nebo monthly). Akumulační ETF dividendy automaticky reinvestují zpět do fondu, což je daňově výhodnější a využívá složené úročení."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou náklady na dividendové ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TER (celkové náklady) dividendových ETF se pohybují mezi 0,15% až 0,75% ročně. Naše TOP 3 má velmi konkurenční poplatky: Vanguard VHYL (IE00B8GKDB10) má TER 0,29%, VanEck TDIV (NL0011683594) má TER 0,38% a SPDR Dividend Aristocrats (IE00B6YX5D40) má TER 0,35%."
        }
      },
      {
        "@type": "Question",
        "name": "Jaká jsou rizika dividendových ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hlavní rizika dividendových ETF zahrnují: snížení nebo zrušení dividend během recese, koncentraci do zralých sektorů s menším růstovým potenciálem, daňové zatížení dividend v ČR (15% srážková daň) a nižší kapitálové zhodnocení oproti růstovým ETF."
        }
      },
      {
        "@type": "Question",
        "name": "Kde koupit naše doporučené dividendové ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Naše TOP 3 dividendové ETF můžete koupit u většiny českých brokerů. Vanguard VHYL (IE00B8GKDB10), VanEck TDIV (NL0011683594) a SPDR Dividend Aristocrats (IE00B6YX5D40) najdete u Degiro, Interactive Brokers, XTB, Trading212, Portu nebo Fio e-Broker."
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
        "name": "Nejlepší dividendové ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-dividendove-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-green-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-green-200/50">
                <PiggyBankIcon className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                  dividendové ETF
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
                Kompletní srovnání nejlepších dividendových ETF pro pasivní příjem. 
                Dividend Aristocrats vs High Yield včetně dividend výnosů a praktických tipů.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <Link href="#top3">
                    <StarIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <Link href="#dividend-yield">
                    <PercentIcon className="w-5 h-5 mr-2" />
                    Dividendové výnosy
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right Content - Dividend Stats */}
            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                
                {/* Simple Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
                    <PercentIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Dividendy v číslech
                  </h3>
                  <p className="text-sm text-gray-600">Klíčová fakta o dividendových ETF</p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUpIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVYŠŠÍ VÝNOS</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">9,5%</div>
                    <div className="text-xs text-gray-600">Global X SuperDividend</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BuildingIcon className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ FOND</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">5,7B</div>
                    <div className="text-xs text-gray-600">Vanguard VHYL</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">FREKVENCE</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">4x</div>
                    <div className="text-xs text-gray-600">ročně (quarterly)</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <AwardIcon className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-gray-500 font-medium">ARISTOCRATS</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">25+</div>
                    <div className="text-xs text-gray-600">let růstu dividend</div>
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
            <div className="flex items-center justify-center rounded-full bg-green-100 w-20 h-20 mx-auto mb-8 hover:bg-green-200 transition-colors hover-scale">
              <PiggyBankIcon className="w-10 h-10 text-green-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou dividendové ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na společnosti s vysokými a stabilními dividendami pro pasivní příjem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.2s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <PercentIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-green-800 transition-colors">
                Vysoký dividendový výnos
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                ETF vybírají společnosti s nadprůměrnými dividendovými výnosy, často 3-6% ročně pro pravidelný příjem.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.3s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <CalendarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-green-800 transition-colors">
                Pravidelné výplaty
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Dividendy se vyplácejí quarterly (4x ročně), semi-annually (2x ročně) nebo monthly (12x ročně).
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.4s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <AwardIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-green-800 transition-colors">
                Dividend Aristocrats
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Společnosti zvyšující dividendy 25+ let v řadě prokazují stabilitu a růstový potenciál.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Top 3 Recommendations - Client Component with Live Data */}
      <Top3ETFLiveSection 
        title="🏆 Top 3 nejlepší dividendové ETF"
        description="Naše doporučení na základě analýzy dividendových výnosů, velikosti fondů a poplatků"
        etfTemplates={TOP_3_DIVIDEND_ETFS_TEMPLATE}
        colorScheme="green"
      />

      {/* Speciální sekce - Dividendové výnosy */}
      <section id="dividend-yield" className="py-20 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-100 text-green-700 px-6 py-3 rounded-full text-sm font-medium mb-8">
              <PercentIcon className="w-4 h-4 mr-2" />
              Speciální analýza
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              💰 Srovnání podle dividendových výnosů
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Detailní přehled ETF podle dividendového výnosu, velikosti fondu a poplatků
            </p>
          </div>

          {/* Custom dividend sections using FilteredETFSections */}
          <div className="space-y-16">
            
            {/* Highest Dividend Yield */}
            <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl mb-4 shadow-sm">
                  <PercentIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Nejvyšší dividendový výnos
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  ETF s nejvyššími dividendovými výnosy - ideální pro maximální pasivní příjem
                </p>
              </div>
              
              <FilteredETFList 
                filter={{
                  hasDividendYield: true,
                  minDividendYield: 3.0,
                  excludeNameKeywords: ["Leveraged", "2x", "3x", "Short", "Bear", "ex-US", "ex US"],
                  excludeLeveraged: true,
                  top: 15,
                  sortBy: "current_dividend_yield_numeric",
                  sortOrder: "desc",
                  minFundSize: 10
                }}
                showDividendYield={true}
              />
            </div>

            {/* Largest Dividend Funds */}
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl mb-4 shadow-sm">
                  <BuildingIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Největší dividendové fondy
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  ETF seřazené podle velikosti fondu - nejvyšší likvidita a stabilita
                </p>
              </div>
              
              <FilteredETFList 
                filter={{
                  hasDividendYield: true,
                  minDividendYield: 1.0,
                  excludeNameKeywords: ["Leveraged", "2x", "3x", "Short", "Bear", "ex-US", "ex US"],
                  excludeLeveraged: true,
                  top: 15,
                  sortBy: "fund_size_numeric",
                  sortOrder: "desc",
                  minFundSize: 50
                }}
                showDividendYield={true}
              />
            </div>

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
              Odpovědi na časté dotazy ohledně dividendových ETF
            </p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jaké jsou nejlepší dividendové ETF v roce 2025?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší dividendové ETF jsou: <strong>Vanguard FTSE All-World High Dividend Yield UCITS ETF</strong> (IE00B8GKDB10) 
                s dividendovým výnosem 3,01% a TER 0,29%, <strong>VanEck Morningstar Developed Markets Dividend Leaders UCITS ETF</strong> (NL0011683594) 
                s výnosem 3,24% a TER 0,38%, a <strong>SPDR S&P US Dividend Aristocrats UCITS ETF</strong> 
                (IE00B6YX5D40) s výnosem 2,20% a TER 0,35%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Co jsou Dividend Aristocrats?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Dividend Aristocrats</strong> jsou společnosti, které zvyšovaly dividendy minimálně 25 let v řadě. 
                Tyto společnosti prokazují stabilní cash flow, dlouhodobý růst a konzistentní management. ETF sledující 
                Dividend Aristocrats nabízejí kombinaci růstu dividend a stability výplat, i když s nižšími počátečními výnosy.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jaký je rozdíl mezi distribučními a akumulačními dividendovými ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Distribuční ETF</strong> vyplácejí dividendy přímo na váš účet podle frekvence (quarterly, semi-annually nebo monthly). 
                <strong>Akumulační ETF</strong> dividendy automaticky reinvestují zpět do fondu. Akumulační jsou daňově výhodnější 
                v Česku a využívají sílu složeného úročení pro dlouhodobý růst.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jaké jsou náklady na dividendové ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>TER (celkové náklady) dividendových ETF</strong> se pohybují mezi 0,15% až 0,75% ročně. Naše TOP 3 má velmi konkurenční poplatky: 
                Vanguard VHYL (IE00B8GKDB10) má TER 0,29%, VanEck TDIV (NL0011683594) má TER 0,38% a SPDR Dividend Aristocrats (IE00B6YX5D40) má TER 0,35%. 
                Kromě TER počítejte s transakčními poplatky u brokera.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jaká jsou rizika dividendových ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Hlavní rizika dividendových ETF</strong> zahrnují: snížení nebo zrušení dividend během recese, 
                koncentraci do zralých sektorů s menším růstovým potenciálem, daňové zatížení dividend v ČR (15% srážková daň) 
                a nižší kapitálové zhodnocení oproti růstovým ETF. Dividend Aristocrats jako SPDR ETF (IE00B6YX5D40) mají nižší volatilitu dividend.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Kde koupit naše doporučené dividendové ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Naše TOP 3 dividendové ETF můžete koupit u většiny českých brokerů. <strong>Vanguard VHYL</strong> (IE00B8GKDB10), 
                <strong>VanEck TDIV</strong> (NL0011683594) a <strong>SPDR Dividend Aristocrats</strong> (IE00B6YX5D40) 
                najdete u Degiro, Interactive Brokers, XTB, Trading212, Portu nebo Fio e-Broker. Porovnejte si transakční poplatky jednotlivých brokerů.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Linking Component */}
      <InternalLinking 
        currentPage="dividendove-etf"
        relatedLinks={[
          {
            title: "Nejlepší S&P 500 ETF",
            href: "/nejlepsi-etf/nejlepsi-sp500-etf",
            description: "Kompletní průvodce americkými S&P 500 ETF"
          },
          {
            title: "Nejlepší Value ETF", 
            href: "/nejlepsi-etf/nejlepsi-value-etf",
            description: "Srovnání nejlepších value ETF fondů"
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