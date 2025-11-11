import React from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { Star, BarChart3, Target, MapPin, Crown, Landmark , DollarSign, Rocket, Zap, Users, Flag, Shield, Award} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import type { Metadata } from 'next';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// Top 3 doporučené americké ETF - editoriální výběr s live daty z databáze
const TOP_3_AMERICAN_ETFS_TEMPLATE = [
  {
    name: "iShares MSCI USA Screened UCITS ETF USD (Acc)",
    ticker: "SUSA",
    isin: "IE00BFNM3G45",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší americký ETF s 11+ mld. EUR a nejnižší TER 0,07%. Pokrývá široký americký trh s vyloučením kontroverzních sektorů.",
  },
  {
    name: "Xtrackers MSCI USA UCITS ETF 1C", 
    ticker: "XMUSA",
    isin: "IE00BJ0KDR00",
    provider: "Xtrackers",
    degiroFree: false,
    reason: "Vynikající TER pouze 0,07% a velikost 9+ mld. EUR. Čistá expozice k americkému trhu bez ESG screeningu.",
  },
  {
    name: "Invesco MSCI USA UCITS ETF",
    ticker: "SPXS",
    isin: "IE00B60SX170", 
    provider: "Invesco",
    degiroFree: false,
    reason: "Nejnižší TER pouze 0,05% mezi velkými americkými ETF a velikost 6+ mld. EUR. Ideální pro nákladově uvědomělé investory.",
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

  const title = `Nejlepší americké ETF ${currentYear} - SUSA vs XMUSA vs SPXS | ETF průvodce.cz`;
  const description = `✅ Srovnání nejlepších amerických ETF ${currentYear}. SUSA, XMUSA, SPXS - MSCI USA index, poplatky TER, výnosy. Aktuální data k ${currentDate}.`;
  const canonical = 'https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-americke-etf';
  const ogImage = 'https://etfpruvodce.cz/og-americke-etf.jpg';
  
  // SEO optimalizované datum - updated pouze jednou za měsíc
  const lastModified = new Date(new Date().getMonth(), 1).toISOString();
  const publishedDate = `${currentYear}-01-25`;
  
  // Enhanced keywords for better discoverability
  const keywords = [
    `nejlepší americké ETF ${currentYear}`,
    'SUSA ETF recenze',
    'XMUSA ETF analýza',
    'SPXS ETF porovnání', 
    'MSCI USA ETF',
    'americké akcie ETF srovnání',
    'USA stock market ETF',
    'americké akcie investice',
    'iShares MSCI USA',
    'Xtrackers MSCI USA',
    'Invesco MSCI USA',
    'nejlevnější americké ETF',
    'největší americké ETF',
    'ETF TER poplatky USA',
    'developed USA markets',
    'americká diverzifikace'
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
        "name": "Americké ETF",
        "description": "Exchange-traded funds tracking American stock market indices"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares MSCI USA Screened UCITS ETF",
        "identifier": "IE00BFNM3G45"
      },
      {
        "@type": "FinancialProduct",
        "name": "Xtrackers MSCI USA UCITS ETF", 
        "identifier": "IE00BJ0KDR00"
      },
      {
        "@type": "FinancialProduct",
        "name": "Invesco MSCI USA UCITS ETF",
        "identifier": "IE00B60SX170"
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
        "name": "Invesco",
        "description": "Global investment management ETF provider" 
      },
      {
        "@type": "Thing",
        "name": "MSCI USA",
        "description": "American stock market index covering large and mid-cap securities in the US market"
      },
      {
        "@type": "Thing",
        "name": "USA Stock Market", 
        "description": "World's largest stock market representing American economy"
      }
    ]
  };
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage", 
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi S&P 500 a MSCI USA ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "S&P 500 obsahuje 500 největších amerických firem. MSCI USA je širší - obsahuje ~630 firem včetně mid-cap akcií. MSCI USA poskytuje lepší pokrytí amerického trhu."
        }
      },
      {
        "@type": "Question", 
        "name": "Který americký ETF má nejnižší poplatky?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Invesco MSCI USA má nejnižší TER pouze 0,05%. Následují iShares MSCI USA Screened a Xtrackers MSCI USA s 0,07%. Všechny jsou výrazně levnější než aktivně řízené fondy."
        }
      },
      {
        "@type": "Question",
        "name": "Jsou americké ETF vhodné pro české investory?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano, americké ETF poskytují expozici k největší světové ekonomice a jsou vhodné jako hlavní složka portfolia. Mají vysokou likviditu a nízké poplatky. Měnové riziko USD/CZK je třeba zvážit."
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
        "name": "Nejlepší americké ETF",
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
          alt: 'Nejlepší americké ETF - srovnání SUSA vs XMUSA vs SPXS'
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

export default async function NejlepsiAmerickeETFPage() {
  // Get last modified date from database (all ETF updates)
  const lastModified = await getLastModifiedDate();

  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const relatedLinks = [
    {
      title: "Nejlepší S&P 500 ETF",
      description: "Specificky zaměřené na S&P 500 index", 
      href: "/nejlepsi-etf/nejlepsi-sp500-etf",
      category: "Indexové ETF"
    },
    {
      title: "Nejlepší světové ETF", 
      description: "Globální ETF zahrnující americké trhy",
      href: "/nejlepsi-etf/nejlepsi-celosvetove-etf",
      category: "Regionální ETF"
    },
    {
      title: "Kde koupit americké ETF",
      description: "Srovnání brokerů pro americké investice",
      href: "/kde-koupit-etf", 
      category: "Praktické tipy"
    },
    {
      title: "Portfolio strategie s americkými ETF",
      description: "Jak začlenit USA do portfolia",
      href: "/portfolio-strategie",
      category: "Investiční strategie"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] bg-gradient-to-br from-red-50 to-blue-50 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-white/30 to-blue-50/50"></div>
        
        {/* Animated blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-red-200 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-red-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-blue-100 text-red-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-red-200/50">
                <Flag className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-red-600 via-red-500 to-blue-600 bg-clip-text text-transparent">
                  americké ETF
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
                Kompletní srovnání nejlepších amerických ETF fondů. MSCI USA analýza, poplatky, výnosy a praktické tipy pro investice do amerického trhu.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#top3">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-red-300 text-red-700 hover:bg-red-50 px-8 py-4 text-lg font-semibold"
                  asChild
                >
                  <Link href="#srovnani">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Srovnání všech
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Stats Box */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-red-50/60 backdrop-blur-sm rounded-3xl shadow-2xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/80 to-red-50/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🇺🇸 Americké ETF Stats</h3>
                  <p className="text-gray-600">Klíčové informace o americkém trhu</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                    <div className="text-3xl font-bold text-red-600 mb-1">630+</div>
                    <div className="text-sm text-gray-600">Firem MSCI USA</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-1">70%</div>
                    <div className="text-sm text-gray-600">Světového trhu</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-red-100 to-blue-100 rounded-xl border border-red-200">
                    <div className="text-3xl font-bold text-red-500 mb-1">~10%</div>
                    <div className="text-sm text-gray-600">Ročně za 30 let</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-blue-100 to-red-100 rounded-xl border border-blue-200">
                    <div className="text-3xl font-bold text-blue-500 mb-1">0,05%</div>
                    <div className="text-sm text-gray-600">Nejnižší TER</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-6 border-t border-red-200/50">
                  <p className="text-sm text-gray-600 mb-3">Největší světová ekonomika</p>
                  <Link href="#pruvodce">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border border-red-200 text-red-600 hover:bg-red-50"
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
              Co jsou americké ETF?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Americké ETF sledují akciové indexy amerického trhu jako MSCI USA nebo Russell indexy. 
              Poskytují expozici k největší světové ekonomice a nejlikvidnějším trhům.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Crown,
                title: "Největší světový trh",
                description: "USA představuje ~70% světové tržní kapitalizace. Americké ETF poskytují expozici k nejlikvidnějším a nejinovativnějším společnostem světa.",
                color: "from-red-500 to-red-600",
                delay: "0.2s"
              },
              {
                icon: MapPin,
                title: "MSCI USA vs S&P 500",
                description: "MSCI USA pokrývá ~630 firem včetně mid-cap. S&P 500 má pouze 500 largest-cap firem. MSCI USA poskytuje širší americké pokrytí.",
                color: "from-blue-500 to-blue-600",
                delay: "0.3s"
              },
              {
                icon: Landmark,
                title: "Technologické giganty",
                description: "Americké ETF obsahují Apple, Microsoft, Amazon, Google, Tesla a další tech giganty, kteří vedou globální inovace a růst.",
                color: "from-red-500 to-blue-600",
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

      {/* Top 3 Recommendations */}
      <Top3ETFLiveSection 
        title="🏆 Top 3 nejlepší americké ETF"
        description="Naše doporučení na základě analýzy všech dostupných amerických ETF"
        etfTemplates={TOP_3_AMERICAN_ETFS_TEMPLATE}
        colorScheme="red"
      />

      {/* Top 10 Database Sections */}
      <FilteredETFSections 
        sectionId="srovnani"
        sections={[
          {
            title: "💰 TOP 10 amerických ETF podle TER",
            description: "Nejlevnější americké ETF s nejnižšími ročními poplatky",
            icon: "DollarSign",
            colorScheme: "red",
            filter: {
              nameKeywords: ["USA", "US ", "America"],
              excludeNameKeywords: ["Leveraged", "2x", "3x", "Short", "Bear", "Sector", "Value", "Growth", "Quality", "Small Cap", "ESG", "SRI", "Enhanced", "Volatility", "Dividend", "Factor", "Mining", "Gold", "Silver", "Crypto", "Bitcoin", "Blockchain", "Energy", "Water", "Aerospace", "Defence", "Defense", "Climate", "Technology", "Healthcare", "Financials", "Utilities", "Materials", "Consumer", "Industrials", "Bond", "Government", "Semiconductors", "Software", "Banks", "Insurance", "REIT", "Infrastructure", "Biotech", "Pharmaceutical"],
              excludeLeveraged: true,
              sortBy: "ter_numeric",
              sortOrder: "asc",
              top: 10,
              minFundSize: 1000
            }
          },
          {
            title: "🏢 TOP 10 amerických ETF podle velikosti fondu",
            description: "Největší a nejlikvidnější americké ETF na trhu",
            icon: "Building",
            colorScheme: "blue", 
            filter: {
              nameKeywords: ["USA", "US ", "America"],
              excludeNameKeywords: ["Leveraged", "2x", "3x", "Short", "Bear", "Sector", "Value", "Growth", "Quality", "Small Cap", "ESG", "SRI", "Enhanced", "Volatility", "Dividend", "Factor", "Mining", "Gold", "Silver", "Crypto", "Bitcoin", "Blockchain", "Energy", "Water", "Aerospace", "Defence", "Defense", "Climate", "Technology", "Healthcare", "Financials", "Utilities", "Materials", "Consumer", "Industrials", "Bond", "Government", "Semiconductors", "Software", "Banks", "Insurance", "REIT", "Infrastructure", "Biotech", "Pharmaceutical"],
              excludeLeveraged: true,
              sortBy: "fund_size_numeric",
              sortOrder: "desc", 
              top: 10,
              minFundSize: 1000
            }
          },
          {
            title: "📈 TOP 10 amerických ETF podle výkonu 1Y",
            description: "Nejlépe performující americké ETF za poslední rok",
            icon: "TrendingUp",
            colorScheme: "red",
            filter: {
              nameKeywords: ["USA", "US ", "America"],
              excludeNameKeywords: ["Leveraged", "2x", "3x", "Short", "Bear", "Sector", "Value", "Growth", "Quality", "Small Cap", "ESG", "SRI", "Enhanced", "Volatility", "Dividend", "Factor", "Mining", "Gold", "Silver", "Crypto", "Bitcoin", "Blockchain", "Energy", "Water", "Aerospace", "Defence", "Defense", "Climate", "Technology", "Healthcare", "Financials", "Utilities", "Materials", "Consumer", "Industrials", "Bond", "Government", "Semiconductors", "Software", "Banks", "Insurance", "REIT", "Infrastructure", "Biotech", "Pharmaceutical"],
              excludeLeveraged: true,
              sortBy: "return_1y",
              sortOrder: "desc",
              top: 10,
              minFundSize: 1000
            }
          }
        ]}
      />

      {/* Selection Guide */}
      <section id="pruvodce" className="py-20 bg-gradient-to-br from-red-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-blue-600 rounded-full mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              💡 Jak vybrat správný americký ETF?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                number: "1",
                title: "MSCI USA vs S&P 500",
                description: "S&P 500 = 500 největších firem. MSCI USA = ~630 firem včetně mid-cap. Pro širší americkou expozici volte MSCI USA, pro blue-chip S&P 500.",
                color: "from-red-400 to-red-500",
                bgColor: "from-red-50 to-red-50",
                borderColor: "border-red-200"
              },
              {
                number: "2", 
                title: "Sledujte TER a velikost",
                description: "Ideální TER 0,05-0,15%. Velikost fondu min. 5 mld. EUR. Invesco má nejnižší TER 0,05%, iShares největší velikost fondů pro americké ETF.",
                color: "from-blue-400 to-blue-500",
                bgColor: "from-blue-50 to-blue-50",
                borderColor: "border-blue-200"
              },
              {
                number: "3",
                title: "Screened vs Standard", 
                description: "Screened verze vylučují kontroverzní sektory (zbraně, tabák). Standard verze obsahují všechny sektory. Pro ESG investory volte Screened.",
                color: "from-red-400 to-blue-500",
                bgColor: "from-red-50 to-blue-50", 
                borderColor: "border-red-200"
              },
              {
                number: "4",
                title: "Měnové riziko USD",
                description: "Americké ETF jsou v USD. Posílení CZK vůči USD snižuje výnosy, oslabení je zvyšuje. Dlouhodobě USD měnové riziko není kritické.",
                color: "from-blue-400 to-red-500",
                bgColor: "from-blue-50 to-red-50",
                borderColor: "border-blue-200"
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
                question: "Jaký je rozdíl mezi S&P 500 a MSCI USA ETF?",
                answer: "S&P 500 obsahuje 500 největších amerických firem (large-cap). MSCI USA je širší - obsahuje ~630 firem včetně mid-cap akcií. MSCI USA poskytuje lepší pokrytí celého amerického trhu."
              },
              {
                question: "Jaké jsou nejlepší americké ETF podle poplatků?",
                answer: "Invesco MSCI USA ETF (SPXS, IE00B60SX170) má nejnižší TER 0,05%. iShares MSCI USA Screened (SUSA, IE00BFNM3G45) a Xtrackers MSCI USA (XMUSA, IE00BJ0KDR00) mají TER 0,07%. Tyto tři ETF nabízejí nejlepší poměr ceny a kvality pro americký trh."
              },
              {
                question: "Jsou americké ETF vhodné pro české investory?",
                answer: "Ano, americké ETF jsou vhodné jako hlavní složka portfolia. USA představuje největší světovou ekonomiku s vysokou likviditou a inovacemi. Měnové riziko USD/CZK je dlouhodobě řiditelné."
              },
              {
                question: "Americké ETF vs světové ETF - co je lepší?",
                answer: "Americké ETF poskytují čistou expozici k USA (~70% světa). Světové ETF jsou diversifikovanější napříč regiony. Pro začátečníky světové ETF, pro pokročilé kombinace amerických + ostatních regionů."
              },
              {
                question: "Jaké jsou historické výnosy amerických ETF?",
                answer: "Americké akcie dosáhly průměrného ročního výnosu ~10% za posledních 30 let. Konkrétní aktuální výnosy najdete v našem žebříčku 'Top 10 podle výkonu 1Y'."
              },
              {
                question: "Jsou data o amerických ETF aktuální?",
                answer: "Ano, všechna data o amerických ETF se načítají živě z naší databáze a jsou aktualizována denně. Žebříčky TOP 10 podle TER, velikosti a výkonu ukazují nejčerstvější informace."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <section className="py-20 bg-gradient-to-r from-red-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Připraveni investovat do amerických ETF?
          </h2>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            Vyberte si brokera a začněte budovat své americké portfolio ještě dnes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link href="/kde-koupit-etf">
                <Shield className="w-5 h-5 mr-2" />
                Najít brokera pro ETF
              </Link>
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link href="/srovnani-etf">
                <BarChart3 className="w-5 h-5 mr-2" />
                Srovnat všechny ETF
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Internal Linking */}
      <InternalLinking 
        relatedLinks={relatedLinks}
        className="bg-red-50"
      />
    </Layout>
  );
}