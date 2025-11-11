import React from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { Star, BarChart3, Target , DollarSign, Rocket, Zap, Users, Flag, TrendingUp, Building, Globe, Shield} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import type { Metadata } from 'next';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// Top 3 doporučené S&P 500 ETF - editoriální výběr s live daty z databáze
const TOP_3_SP500_ETFS_TEMPLATE = [
  {
    name: "iShares Core S&P 500 UCITS ETF USD (Acc)",
    ticker: "CSPX",
    isin: "IE00B5BMR087",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší S&P 500 ETF v Evropě s nejvyšší likviditou. Ideální volba pro začátečníky díky spolehlivosti a velikosti.",
  },
  {
    name: "Invesco S&P 500 UCITS ETF Acc",
    ticker: "SPXP", 
    isin: "IE00B3YCGJ38",
    provider: "Invesco",
    degiroFree: false,
    reason: "Nejnižší TER mezi většími S&P 500 ETF. Perfektní volba pro investory, kteří chtějí minimalizovat náklady.",
  },
  {
    name: "SPDR S&P 500 UCITS ETF (Dist)",
    ticker: "SPY5",
    isin: "IE00B6YX5C33", 
    provider: "SPDR ETF",
    degiroFree: false,
    reason: "Unikátně nízký TER a distribuční polítika. Ideální pro investory preferující pravidelné dividendy.",
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
    title: `Nejlepší S&P 500 ETF ${currentYear} - CSPX vs SPXP vs SPY5 | ETF průvodce.cz`,
    description: `✅ Srovnání nejlepších S&P 500 ETF ${currentYear}. CSPX, SPXP, SPY5 - poplatky TER, výnosy, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: `nejlepší S&P 500 ETF ${currentYear}, CSPX ETF, SPXP ETF, SPY5 ETF, S&P 500 porovnání, americké ETF, indexové fondy USA`,
    openGraph: {
      title: `Nejlepší S&P 500 ETF ${currentYear} - CSPX vs SPXP vs SPY5`,
      description: `Srovnání nejlepších S&P 500 ETF ${currentYear}. CSPX, SPXP, SPY5 - poplatky TER, výnosy, velikost fondů.`,
      url: 'https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-sp500-etf',
      siteName: 'ETF průvodce.cz',
      images: [
        {
          url: 'https://etfpruvodce.cz/og-sp500-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší S&P 500 ETF ${currentYear}`,
        },
      ],
      locale: 'cs_CZ',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší S&P 500 ETF ${currentYear} - CSPX vs SPXP vs SPY5`,
      description: `Srovnání nejlepších S&P 500 ETF ${currentYear}. CSPX, SPXP, SPY5 - poplatky TER, výnosy, velikost fondů.`,
      images: ['https://etfpruvodce.cz/og-sp500-etf.jpg'],
    },
    alternates: {
      canonical: 'https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-sp500-etf',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'article:author': 'ETF průvodce.cz',
      'article:published_time': `${currentYear}-01-15T10:00:00.000Z`,
      'article:modified_time': new Date(new Date().getMonth(), 1).toISOString(),
      'article:section': 'Investment Guides',
      'article:tag': 'S&P 500 ETF, CSPX, SPXP, SPY5, investování',
      'theme-color': '#3B82F6',
      'msapplication-TileColor': '#3B82F6',
      'format-detection': 'telephone=no',
    },
  };
}

export default async function NejlepsiSP500ETF() {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get last modified date from database (based on S&P 500 ETF updates)
  const sp500Isins = ['IE00B5BMR087', 'IE00B3YCGJ38', 'IE00B6YX5C33']; // CSPX, SPXP, SPY5
  const lastModified = await getLastModifiedDate(sp500Isins);

  // Enhanced structured data with FAQs and more products
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší S&P 500 ETF ${currentYear} - CSPX vs SPXP vs SPY5`,
    "description": `Srovnání nejlepších S&P 500 ETF ${currentYear}. CSPX, SPXP, SPY5 - poplatky TER, výnosy, velikost fondů.`,
    "image": "https://etfpruvodce.cz/og-sp500-etf.jpg",
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
    "datePublished": `${currentYear}-01-15`,
    "dateModified": lastModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-sp500-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": `S&P 500 ETF, CSPX, SPXP, SPY5, investování, indexové fondy`,
    "wordCount": 2500,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "S&P 500 ETF",
        "description": "Exchange-traded funds tracking the S&P 500 index"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Core S&P 500 UCITS ETF",
        "identifier": "IE00B5BMR087"
      },
      {
        "@type": "FinancialProduct", 
        "name": "Invesco S&P 500 UCITS ETF Acc",
        "identifier": "IE00B3YCGJ38"
      },
      {
        "@type": "FinancialProduct",
        "name": "SPDR S&P 500 UCITS ETF", 
        "identifier": "IE00B6YX5C33"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "S&P 500 Index",
        "description": "Stock market index tracking 500 largest US companies"
      },
      {
        "@type": "Thing", 
        "name": "TER",
        "description": "Total Expense Ratio - annual fee for ETF management"
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
        "name": "Jak jste vybrali TOP 3 nejlepší S&P 500 ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Naše TOP 3 doporučení vychází z databáze více než 3000 ETF a zohledňuje klíčové faktory: velikost fondu, nízký TER, likviditu, tracking error a celkovou kvalitu. Každý ETF má 5hvězdičkové hodnocení založené na kombinaci těchto metrik."
        }
      },
      {
        "@type": "Question", 
        "name": "Jaký je rozdíl mezi akumulačními a distribučními S&P 500 ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Akumulační ETF (jako CSPX, VUAA) automaticky reinvestují dividendy zpět do fondu, což je ideální pro dlouhodobý růst. Distribuční ETF (VUSA, SPY5) vyplácejí dividendy přímo investorům - vhodné pro ty, kteří chtějí pravidelný příjem."
        }
      },
      {
        "@type": "Question",
        "name": "Který S&P 500 ETF má nejnižší náklady?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejnižší TER obvykle nabízejí specializovaní poskytovatelé ETF, zatímco největší poskytovatelé mají vyšší poplatky, ale nabízejí lepší likviditu. Podívejte se na naš žebříček podle TER pro aktuální srovnání nákladů."
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
        "name": "Nejlepší S&P 500 ETF",
        "item": "https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-sp500-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
                <Flag className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  S&P 500 ETF
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
                Kompletní srovnání nejlepších S&P 500 ETF fondů dostupných pro evropské investory. 
                Analýza poplatků, výkonnosti a praktické tipy pro výběr.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <Link href="#top3">
                    <Star className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <Link href="#srovnani">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Srovnání ETF
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right Content - Subtle Market Stats */}
            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                
                {/* Simple Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    S&P 500 v číslech
                  </h3>
                  <p className="text-sm text-gray-600">Klíčová fakta o indexu</p>
                </div>
                
                {/* Subtle Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">SLOŽENÍ</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">500</div>
                    <div className="text-xs text-gray-600">největších firem</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">VÝNOS</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">~10%</div>
                    <div className="text-xs text-gray-600">ročně historicky</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-gray-500 font-medium">POKRYTÍ</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">80%</div>
                    <div className="text-xs text-gray-600">amerického trhu</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">VÝBĚR</span>
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

      {/* Introduction Section */}
      <section id="uvod" className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-blue-100 w-20 h-20 mx-auto mb-8 hover:bg-blue-200 transition-colors hover-scale">
              <Building className="w-10 h-10 text-blue-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Co je S&P 500 index?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nejsledovanější americký akciový index zahrnující 500 největších veřejně obchodovaných společností
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Building,
                title: "500 největších firem",
                description: "Index obsahuje 500 největších amerických společností podle tržní kapitalizace z NYSE a NASDAQ.",
                color: "blue"
              },
              {
                icon: BarChart3,
                title: "Vážený podle kapitalizace",
                description: "Větší společnosti mají v indexu větší váhu. Apple a Microsoft tvoří přes 13% indexu.",
                color: "indigo"
              },
              {
                icon: TrendingUp,
                title: "Historický výnos ~10%",
                description: "Průměrný roční výnos za posledních 50 let je přibližně 10% včetně reinvestovaných dividend.",
                color: "purple"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              const colorMap = {
                blue: "from-blue-500 to-indigo-600",
                indigo: "from-indigo-500 to-purple-600", 
                purple: "from-purple-500 to-pink-600"
              };
              
              return (
                <div key={index} className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
                  <div className={`flex items-center justify-center rounded-full bg-gradient-to-r ${colorMap[item.color]} w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top 3 Recommendations - Client Component with Live Data */}
      <Top3ETFLiveSection 
        title="🏆 Top 3 nejlepší S&P 500 ETF"
        description="Naše doporučení na základě analýzy všech dostupných S&P 500 ETF"
        etfTemplates={TOP_3_SP500_ETFS_TEMPLATE}
        colorScheme="blue"
      />

      {/* FilteredETF Sections - Client Component with Database Queries */}
      <FilteredETFSections 
        indexKeywords={["S&P 500"]}
        excludeKeywords={["China", "KraneShares", "Sector"]}
      />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Selection Guide */}
          <div id="pruvodce" className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-12 border border-blue-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 w-20 h-20 mx-auto mb-6">
                <Target className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                💡 Jak vybrat ten správný S&P 500 ETF?
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
                  Zaměřte se na velkou velikost fondu a nízký TER. 
                  Tyto základní metriky vám zajistí kvalitní a levný fond s dobrou likviditou.
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
                  Porovnejte tracking error, likviditu a spread na burze. 
                  Tyto pokročilé metriky ovlivní vaše skutečné výnosy.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <h5 className="text-lg font-bold text-purple-800">Pro dlouhodobé investory</h5>
                </div>
                <p className="text-purple-700 leading-relaxed">
                  Akumulační verze (reinvestice dividend) vs distribuční (pravidelná výplata). 
                  Volba ovlivní vaši daňovou optimalizaci.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-bold text-sm">4</span>
                  </div>
                  <h5 className="text-lg font-bold text-orange-800">Pro minimalizaci nákladů</h5>
                </div>
                <p className="text-orange-700 leading-relaxed">
                  Porovnejte TER napříč poskytovateli - někteří nabízejí extrémně nízké poplatky. 
                  Vyberte podle priority: nejnižší poplatky vs. nejvyšší likvidita.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-purple-100 w-20 h-20 mx-auto mb-8 hover:bg-purple-200 transition-colors hover-scale">
              <span className="text-2xl">❓</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Často kladené otázky o S&P 500 ETF
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Odpovědi na nejčastější dotazy o investování do S&P 500 ETF
            </p>
          </div>

          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.2s]">
            <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "Jak jste vybrali TOP 3 nejlepší S&P 500 ETF?",
                answer: "Naše TOP 3 doporučení vychází z databáze více než 3000 ETF a zohledňuje klíčové faktory: velikost fondu, nízký TER, likviditu, tracking error a celkovou kvalitu. Každý ETF má 5hvězdičkové hodnocení založené na kombinaci těchto metrik."
              },
              {
                question: "Co znamenají TOP 10 žebříčky podle TER, velikosti fondu a výkonu?",
                answer: "Naše žebříčky jsou generovány živě z databáze a filtrují pouze legitimní S&P 500 ETF. Automaticky vylučujeme čínské ETF, sektorové ETF a pákové (leveraged) produkty. Data jsou aktualizována pravidelně pro nejpřesnější srovnání."
              },
              {
                question: "Proč se v seznamech neobjevují některé populární ETF?",
                answer: "Naše filtry automaticky vylučují ETF, které nesledují čistě S&P 500 index - například KraneShares China S&P 500 ETF (sleduje čínský index), sektorové ETF jako Consumer Discretionary, nebo pákové ETF s 2x/3x multiplikátorem."
              },
              {
                question: "Jaký je rozdíl mezi akumulačními a distribučními S&P 500 ETF?",
                answer: "Akumulační ETF (jako CSPX, VUAA) automaticky reinvestují dividendy zpět do fondu, což je ideální pro dlouhodobý růst. Distribuční ETF (VUSA, SPY5) vyplácejí dividendy přímo investorům - vhodné pro ty, kteří chtějí pravidelný příjem."
              },
              {
                question: "Který S&P 500 ETF má nejnižší náklady?",
                answer: "Nejnižší TER obvykle nabízejí specializovaní poskytovatelé ETF, zatímco největší poskytovatelé mají vyšší poplatky, ale nabízejí lepší likviditu. Podívejte se na naš žebříček podle TER pro aktuální srovnání nákladů."
              },
              {
                question: "Jsou data v žebříčcích aktuální?",
                answer: "Ano, všechny žebříčky jsou generovány živě z naší databáze při každém načtení stránky. Zahrnují nejnovější data o TER, velikosti fondů, výkonnosti a dalších klíčových metrikách S&P 500 ETF dostupných pro evropské investory."
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-green-100 w-20 h-20 mx-auto mb-8 hover:bg-green-200 transition-colors hover-scale">
              <Zap className="w-10 h-10 text-green-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Připraveni investovat do S&P 500?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Najděte si ideálního brokera a začněte s investováním do nejlepších S&P 500 ETF
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="hover-scale bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold">
                <Link href="/kde-koupit-etf">
                  <Users className="w-5 h-5 mr-2" />
                  Najít brokera pro ETF
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="hover-scale border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
                <Link href="/srovnani-etf">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Srovnat všechny ETF
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Internal Linking */}
        <InternalLinking 
          relatedLinks={[
            {
              title: "Nejlepší NASDAQ ETF",
              href: "/nejlepsi-etf/nejlepsi-nasdaq-etf",
              description: "Srovnání technologických ETF na NASDAQ 100 index"
            },
            {
              title: "Nejlepší světové ETF",
              href: "/nejlepsi-etf/nejlepsi-msci-world-etf", 
              description: "Globální diverzifikace s MSCI World ETF"
            },
            {
              title: "Kde koupit S&P 500 ETF",
              href: "/kde-koupit-etf",
              description: "Srovnání brokerů pro investice do amerických ETF"
            },
            {
              title: "Portfolio strategie s S&P 500",
              href: "/portfolio-strategie",
              description: "Modelová portfolia obsahující S&P 500 ETF"
            }
          ]}
        />
      </div>
    </Layout>
  );
}