import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Star, BarChart3, Target, TrendingDown, Calculator, ChartBar , DollarSign, Rocket, Zap, Users, Building} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import type { Metadata } from 'next';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// Top 3 doporučené Value ETF - editoriální výběr s live daty z databáze
const TOP_3_VALUE_ETFS_TEMPLATE = [
  {
    name: "iShares Edge MSCI World Value Factor UCITS ETF",
    ticker: "IWVL",
    isin: "IE00BP3QZB59",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší globální value factor ETF s 3,4 mld. EUR a TER 0,25%. Systematicky vybírá podhodnocené akcie napříč světem.",
  },
  {
    name: "Xtrackers MSCI World Value UCITS ETF", 
    ticker: "XMWV",
    isin: "IE00BL25JM42",
    provider: "Xtrackers",
    degiroFree: false,
    reason: "Globální value ETF s 2,3 mld. EUR a TER 0,25%. Investuje do světových akcií s nízkými valuačními multiplikátory.",
  },
  {
    name: "iShares Edge MSCI Europe Value Factor UCITS ETF",
    ticker: "IEUV", 
    isin: "IE00BQN1K901",
    provider: "iShares",
    degiroFree: false,
    reason: "Evropské value akcie s 2,0 mld. EUR a TER 0,25%. Zaměření na podhodnocené evropské společnosti s atraktivním P/E.",
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
    title: `Nejlepší Value ETF ${currentYear} - P/E ratio a podhodnocené akcie | ETF průvodce.cz`,
    description: `✅ Srovnání nejlepších Value ETF ${currentYear}. Podhodnocené akcie, nízké P/E ratio, P/B ratio - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'Value ETF',
      'podhodnocené akcie ETF',
      `nejlepší Value ETF ${currentYear}`,
      'nízké P/E ratio ETF',
      'P/B ratio ETF', 
      'value investing ETF',
      'fundamentální analýza ETF',
      'Vanguard VGK',
      'iShares IEUV',
      'Xtrackers XVLU',
      'value factor ETF',
      'contrarian investing',
      'Graham Buffett strategie'
    ].join(', '),
    openGraph: {
      title: `Nejlepší Value ETF ${currentYear} - P/E ratio a podhodnocené akcie`,
      description: `Srovnání nejlepších Value ETF ${currentYear}. Podhodnocené akcie, nízké P/E ratio, P/B ratio - TER, velikost fondů.`,
      type: 'article',
      locale: 'cs_CZ',
      siteName: 'ETF Průvodce',
      images: [
        {
          url: '/og-value-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší Value ETF ${currentYear} - průvodce a porovnání`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší Value ETF ${currentYear} - P/E ratio a podhodnocené akcie`,
      description: `Srovnání nejlepších Value ETF ${currentYear}. Podhodnocené akcie, nízké P/E ratio, P/B ratio - TER, velikost fondů.`,
      images: ['/og-value-etf.jpg']
    },
    alternates: {
      canonical: 'https://etf-pruvodce.cz/nejlepsi-etf/nejlepsi-value-etf'
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

export default async function NejlepsiValueETF() {
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
    "headline": `Nejlepší Value ETF ${currentYear} - P/E ratio a podhodnocené akcie`,
    "description": `Srovnání nejlepších Value ETF ${currentYear}. Podhodnocené akcie, nízké P/E ratio, P/B ratio - TER, velikost fondů.`,
    "image": "https://etfpruvodce.cz/og-value-etf.jpg",
    "author": {
      "@type": "Person",
      "name": "Tomáš Kostrhoun",
      "url": "https://etfpruvodce.cz/o-nas#tomas-kostrhoun"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "ETF průvodce.cz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://etfpruvodce.cz/logo.png"
      }
    },
    "datePublished": "2025-01-15",
    "dateModified": lastModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-value-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "Value ETF, podhodnocené akcie, P/E ratio, P/B ratio, value investing, fundamentální analýza",
    "wordCount": 2600,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Value ETF",
        "description": "Exchange-traded funds focused on undervalued stocks with low price ratios"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Edge MSCI World Value Factor UCITS ETF",
        "identifier": "IE00BP3QZB59"
      },
      {
        "@type": "FinancialProduct", 
        "name": "Xtrackers MSCI World Value UCITS ETF",
        "identifier": "IE00BL25JM42"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Edge MSCI Europe Value Factor UCITS ETF", 
        "identifier": "IE00BQN1K901"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "P/E ratio",
        "description": "Price-to-earnings ratio used to identify undervalued stocks"
      },
      {
        "@type": "Thing", 
        "name": "Value Investing",
        "description": "Investment strategy of buying undervalued securities"
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
        "name": "Jaké jsou nejlepší Value ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší Value ETF jsou: iShares Edge MSCI World Value Factor UCITS ETF (IE00BP3QZB59) s globálním pokrytím a TER 0,25%, Xtrackers MSCI World Value UCITS ETF (IE00BL25JM42) s 2,3 mld. EUR, a iShares Edge MSCI Europe Value Factor UCITS ETF (IE00BQN1K901) specializovaný na evropské value faktory."
        }
      },
      {
        "@type": "Question", 
        "name": "Co je Value investing a jak fungují Value ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Value investing je strategie založená na nákupu podhodnocených akcií s nízkými poměrovými ukazateli jako P/E, P/B nebo P/S ratio. Value ETF automaticky vybírají akcie podle těchto kritérií a nabízejí diverzifikovanou expozici k value segmentu trhu s potenciálem outperformance."
        }
      },
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi Value a Growth ETF?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Value ETF se zaměřují na podhodnocené akcie s nízkými poměry (P/E, P/B) a často vyšší dividendy. Growth ETF investují do rychle rostoucích společností s vysokým potenciálem růstu příjmů, ale obvykle s vyššími oceněními. Value má historicky nižší volatilitu a může outperformovat v určitých tržních cyklech."
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
        "item": "https://etfpruvodce.cz"
      },
      {
        "@type": "ListItem",
        "position": 2, 
        "name": "Nejlepší ETF",
        "item": "https://etfpruvodce.cz/nejlepsi-etf"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Nejlepší Value ETF",
        "item": "https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-value-etf"
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
      <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-red-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-red-200 to-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-orange-200/50">
                <TrendingDown className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Value ETF
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
                Kompletní srovnání nejlepších Value ETF pro investice do podhodnocených akcií. 
                P/E ratio, P/B ratio a fundamentální analýza včetně praktických tipů.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <Link href="#top3">
                    <Star className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <Link href="#srovnani">
                    <Calculator className="w-5 h-5 mr-2" />
                    P/E ratio srovnání
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right Content - Value Stats */}
            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                
                {/* Simple Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mb-3">
                    <Calculator className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Value investing v číslech
                  </h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro podhodnocené akcie</p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-amber-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-amber-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ P/E</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">8,5x</div>
                    <div className="text-xs text-gray-600">Evropské value akcie</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <ChartBar className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">P/B RATIO</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,9x</div>
                    <div className="text-xs text-gray-600">Pod book value</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-amber-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-amber-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ FOND</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">3,4B</div>
                    <div className="text-xs text-gray-600">iShares World Value</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,10%</div>
                    <div className="text-xs text-gray-600">ročně</div>
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
            <div className="flex items-center justify-center rounded-full bg-amber-100 w-20 h-20 mx-auto mb-8 hover:bg-amber-200 transition-colors hover-scale">
              <Calculator className="w-10 h-10 text-amber-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou Value ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na podhodnocené akcie s nízkými poměrovými ukazateli a potenciálem růstu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.2s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-orange-800 transition-colors">
                Nízké poměrové ukazatele
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                ETF vybírají akcie s nízkými P/E, P/B a P/S ratio, které mohou být dočasně podhodnocené trhem.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.3s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ChartBar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-orange-800 transition-colors">
                Fundamentální analýza
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Investice založené na finanční síle společností, cash flow a solidních základech podnikání.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.4s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-amber-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-orange-800 transition-colors">
                Contrarian přístup
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Investice proti trendu do nepopulárních sektorů s potenciálem zotavení a outperformance.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Top 3 Recommendations - Client Component with Live Data */}
      <Top3ETFLiveSection 
        title="🏆 Top 3 nejlepší Value ETF"
        description="Naše doporučení na základě analýzy P/E ratio, P/B ratio a velikosti fondů"
        etfTemplates={TOP_3_VALUE_ETFS_TEMPLATE}
        colorScheme="red"
      />

      {/* Comprehensive ETF Sections */}
      <FilteredETFSections 
        indexKeywords={["Value"]}
        excludeKeywords={["Growth", "Momentum", "Quality", "Leveraged", "2x", "3x", "Short", "Bear", "Dividend", "Income", "Battery", "Small Cap"]}
      />

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nejčastější otázky
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Odpovědi na časté dotazy ohledně Value ETF
            </p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-amber-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-amber-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-amber-800">Jaké jsou nejlepší Value ETF v roce 2025?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-amber-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší Value ETF jsou: <strong>iShares Edge MSCI World Value Factor UCITS ETF</strong> (IE00BP3QZB59) 
                největší globální value ETF s 3,4 mld. EUR a TER 0,25%, <strong>Xtrackers MSCI World Value UCITS ETF</strong> (IE00BL25JM42) 
                s 2,3 mld. EUR a TER 0,25%, a <strong>iShares Edge MSCI Europe Value Factor UCITS ETF</strong> 
                (IE00BQN1K901) specializovaný na evropské value faktory s TER 0,25%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-amber-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-amber-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-amber-800">Co je Value investing a jak fungují Value ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-amber-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Value investing</strong> je strategie založená na nákupu podhodnocených akcií s nízkými poměrovými ukazateli 
                jako P/E, P/B nebo P/S ratio. Value ETF automaticky vybírají akcie podle těchto kritérií pomocí kvantitativních modelů 
                a nabízejí diverzifikovanou expozici k value segmentu trhu s potenciálem outperformance v dlouhodobém horizontu.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-amber-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-amber-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-amber-800">Jaký je rozdíl mezi Value a Growth ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-amber-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Value ETF</strong> se zaměřují na podhodnocené akcie s nízkými poměry (P/E, P/B) a často vyšší dividendy. 
                <strong>Growth ETF</strong> investují do rychle rostoucích společností s vysokým potenciálem růstu příjmů, 
                ale obvykle s vyššími oceněními. Value má historicky nižší volatilitu a může outperformovat v určitých tržních cyklech, 
                zejména při rotaci z růstových do hodnotových akcií.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Linking Component */}
      <InternalLinking 
        currentPage="value-etf"
        relatedLinks={[
          {
            title: "Nejlepší Growth ETF",
            href: "/nejlepsi-etf/nejlepsi-growth-etf",
            description: "Kompletní průvodce růstovými ETF fondy"
          },
          {
            title: "Nejlepší dividendové ETF", 
            href: "/nejlepsi-etf/nejlepsi-dividendove-etf",
            description: "Srovnání nejlepších dividendových ETF"
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