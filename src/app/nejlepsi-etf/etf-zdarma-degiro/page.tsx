import React from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { BarChart3Icon, TargetIcon, AlertTriangleIcon, FlagIcon, ShieldIcon, BuildingIcon, DollarSignIcon, GlobeIcon, ZapIcon, UsersIcon, RocketIcon } from '@/components/ui/icons';
import InternalLinking, { ETFGuideRelatedLinks } from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import type { Metadata } from 'next';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Top 3 doporučené DEGIRO zdarma ETF - editoriální výběr s live daty z databáze
const TOP_3_DEGIRO_FREE_ETFS_TEMPLATE = [
  {
    name: "iShares Core S&P 500 UCITS ETF USD (Acc)",
    ticker: "CSPX",
    isin: "IE00B5BMR087",
    provider: "iShares",
    degiroFree: true,
    reason: "Největší S&P 500 ETF v Evropě dostupný zdarma na DEGIRO. Ideální volba pro začátečníky díky kombinaci nulových komisí a spolehlivosti.",
  },
  {
    name: "iShares Core MSCI World UCITS ETF USD (Acc)",
    ticker: "IWDA", 
    isin: "IE00B4L5Y983",
    provider: "iShares",
    degiroFree: true,
    reason: "Nejpopulárnější světový ETF zdarma na DEGIRO. Perfektní volba pro globální diverzifikaci bez komisí.",
  },
  {
    name: "iShares Core MSCI Emerging Markets IMI UCITS ETF",
    ticker: "EMIM",
    isin: "IE00BKM4GZ66", 
    provider: "iShares",
    degiroFree: true,
    reason: "Nejlepší emerging markets ETF dostupný zdarma. Ideální doplněk k vyspělým trhům pro kompletní globální expozici.",
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
    title: `ETF zdarma na DEGIRO ${currentYear} | Srovnání`,
    description: `✅ Kompletní seznam 65+ ETF fondů zdarma na DEGIRO ${currentYear}. CSPX, IWDA, EMIM - nulové komise, poplatky pouze €1 za 2. obchod. Aktuální k ${currentDate}.`,
    keywords: `ETF zdarma DEGIRO ${currentYear}, DEGIRO free ETF, CSPX zdarma, IWDA DEGIRO, komisně bezplatné ETF, DEGIRO poplatky`,
    openGraph: {
      title: `ETF zdarma na DEGIRO ${currentYear} | Srovnání`,
      description: `Kompletní seznam 65+ ETF fondů zdarma na DEGIRO ${currentYear}. CSPX, IWDA, EMIM - nulové komise pro první obchod měsíčně.`,
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/etf-zdarma-degiro',
      siteName: 'ETF průvodce.cz',
      images: [
        {
          url: 'https://www.etfpruvodce.cz/og-degiro-free-etf.jpg',
          width: 1200,
          height: 630,
          alt: `ETF zdarma na DEGIRO ${currentYear}`,
        },
      ],
      locale: 'cs_CZ',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `ETF zdarma na DEGIRO ${currentYear} | Srovnání`,
      description: `Kompletní seznam 65+ ETF fondů zdarma na DEGIRO ${currentYear}. CSPX, IWDA, EMIM - nulové komise pro první obchod měsíčně.`,
      images: ['https://www.etfpruvodce.cz/og-degiro-free-etf.jpg'],
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/etf-zdarma-degiro',
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
      'article:published_time': `${currentYear}-01-30T10:00:00.000Z`,
      'article:modified_time': new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      'article:section': 'Investment Guides',
      'article:tag': 'DEGIRO, ETF zdarma, CSPX, IWDA, investování',
      'theme-color': '#FF6600',
      'msapplication-TileColor': '#FF6600',
      'format-detection': 'telephone=no',
    },
  };
}

// FilteredETF sections configuration for DEGIRO free ETFs
const degiroFreeSections = [
  {
    title: "Nejnižší poplatky",
    description: "ETF seřazené podle nejnižšího TER - kombinace bezplatných komisí a nízkých poplatků",
    icon: "DollarSign", 
    colorScheme: "green" as const,
    filter: {
      degiroFree: true,
      excludeLeveraged: true,
      top: 10,
      sortBy: "ter_numeric",
      sortOrder: "asc",
      minFundSize: 100
    }
  },
  {
    title: "Největší fondy",
    description: "ETF seřazené podle velikosti fondu - nejvyšší likvidita a nejnižší spread",
    icon: "Building",
    colorScheme: "blue" as const,
    filter: {
      degiroFree: true,
      excludeLeveraged: true,
      top: 15,
      sortBy: "fund_size_numeric",
      sortOrder: "desc",
      minFundSize: 100
    }
  },
  {
    title: "Nejlepší 1Y výkonnost",
    description: "Zdarma ETF s nejlepší roční výkonností - kombinace nulových komisí a vysokých výnosů",
    icon: "TrendingUp",
    colorScheme: "purple" as const,
    filter: {
      degiroFree: true,
      excludeLeveraged: true,
      top: 10,
      sortBy: "return_1y",
      sortOrder: "desc",
      minFundSize: 100
    }
  }
];

export default async function DegiroFreeETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['etf-zdarma-degiro'];
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

  // Enhanced structured data with FAQs and more products
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `ETF zdarma na DEGIRO ${currentYear} - Kompletní seznam komisně bezplatných fondů`,
    "description": `Kompletní seznam 65+ ETF fondů zdarma na DEGIRO ${currentYear}. CSPX, IWDA, EMIM - nulové komise pro první obchod měsíčně.`,
    "image": "https://www.etfpruvodce.cz/og-degiro-free-etf.jpg",
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
    "datePublished": `${currentYear}-01-30`,
    "dateModified": lastModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/etf-zdarma-degiro"
    },
    "articleSection": "Investment Guides",
    "keywords": `DEGIRO ETF zdarma, CSPX, IWDA, EMIM, investování, indexové fondy`,
    "wordCount": 2500,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "DEGIRO ETF zdarma",
        "description": "Exchange-traded funds dostupné bez komisí na DEGIRO brokeru"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Core S&P 500 UCITS ETF",
        "identifier": "IE00B5BMR087"
      },
      {
        "@type": "FinancialProduct", 
        "name": "iShares Core MSCI World UCITS ETF",
        "identifier": "IE00B4L5Y983"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Core MSCI Emerging Markets IMI UCITS ETF", 
        "identifier": "IE00BKM4GZ66"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "DEGIRO broker",
        "description": "Nizozemský online broker s komisně bezplatnými ETF"
      },
      {
        "@type": "Thing", 
        "name": "Fair Use Policy",
        "description": "První obchod měsíčně zdarma, další za €1 + spread"
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
        "name": "Jak funguje Fair Use Policy na DEGIRO?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "První obchod s každým ETF každý kalendářní měsíc je zdarma do €1,000 za transakci. Od druhého obchodu se stejným ETF ve stejném měsíci se účtuje administrativní poplatek €1 + spread."
        }
      },
      {
        "@type": "Question", 
        "name": "Kolik ETF fondů je dostupných zdarma na DEGIRO?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DEGIRO nabízí více než 65 ETF fondů v rámci své Fair Use Policy. Zahrnuje nejpopulárnější ETF od iShares, Vanguard, SPDR a dalších poskytovatelů pokrývající všechny hlavní indexy a regiony."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší ETF zdarma na DEGIRO?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejpopulárnější jsou iShares Core S&P 500 (CSPX), iShares Core MSCI World (IWDA) a iShares Core MSCI Emerging Markets (EMIM). Tyto ETF nabízejí širokou diverzifikaci a nízké poplatky v kombinaci s nulovými komisemi."
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
        "name": "ETF zdarma na DEGIRO",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/etf-zdarma-degiro"
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
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-red-50/30 to-yellow-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-red-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-orange-200/50">
                <FlagIcon className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                ETF zdarma na{' '}
                <span className="bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                  DEGIRO
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
                Kompletní seznam 65+ ETF fondů, které můžete obchodovat bez komisí na DEGIRO brokeru. 
                První obchod měsíčně zdarma, další za pouhý €1.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <Link href="#top3">
                    <ShieldIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <Link href="#srovnani">
                    <BarChart3Icon className="w-5 h-5 mr-2" />
                    Kompletní seznam
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right Content - DEGIRO Stats */}
            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                
                {/* Simple Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-3">
                    <ShieldIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    DEGIRO v číslech
                  </h3>
                  <p className="text-sm text-gray-600">Klíčová fakta o brokeru</p>
                </div>
                
                {/* Subtle Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BuildingIcon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">ETF ZDARMA</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">65+</div>
                    <div className="text-xs text-gray-600">komisně bezplatných</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSignIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">POPLATEK</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">€1</div>
                    <div className="text-xs text-gray-600">za 2. obchod měsíčně</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <GlobeIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">POKRYTÍ</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">Globální</div>
                    <div className="text-xs text-gray-600">všechny regiony</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldIcon className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-gray-500 font-medium">OCHRANA</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">€20k</div>
                    <div className="text-xs text-gray-600">investorská ochrana</div>
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
              <ShieldIcon className="w-10 h-10 text-orange-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Jak funguje Fair Use Policy?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              DEGIRO nabízí více než 65 ETF fondů s nulovými komisemi pro první obchod měsíčně
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: DollarSignIcon,
                title: "První obchod zdarma",
                description: "Každý kalendářní měsíc můžete koupit nebo prodat každý ETF jednou zcela zdarma až do €1,000 za transakci.",
                color: "green"
              },
              {
                icon: AlertTriangleIcon,
                title: "Druhý obchod za €1",
                description: "Od druhého obchodu se stejným ETF ve stejném měsíci se účtuje administrativní poplatek €1 + spread.",
                color: "orange"
              },
              {
                icon: TargetIcon,
                title: "Strategie DCA",
                description: "Pro pravidelné investování doporučujeme provádět pouze jeden nákup každého ETF měsíčně, ideálně vždy ke stejnému datu.",
                color: "blue"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              const colorMap = {
                green: "from-green-500 to-emerald-600",
                orange: "from-orange-500 to-red-600", 
                blue: "from-blue-500 to-indigo-600"
              };
              
              return (
                <div key={index} className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
                  <div className={`flex items-center justify-center rounded-full bg-gradient-to-r ${colorMap[item.color as keyof typeof colorMap]} w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-orange-800 transition-colors">
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
      

      {/* FilteredETF Sections - Client Component with Database Queries */}
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
          <Top3ETFServer etfs={etfs} currency="EUR" />
        </div>
      </section>

      <Top10SectionsServer etfs={etfs} currency="EUR" categoryName="DEGIRO" />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Selection Guide */}
          <div id="pruvodce" className="bg-gradient-to-br from-white to-orange-50 rounded-3xl p-12 border border-orange-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-100 to-red-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-orange-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                💡 Jak maximálně využít DEGIRO Fair Use Policy?
              </h4>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Praktické tipy pro investování s nulovými komisemi
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  <h5 className="text-lg font-bold text-green-800">Měsíční DCA strategie</h5>
                </div>
                <p className="text-green-700 leading-relaxed">
                  Investujte pravidelně každý měsíc stejnou částku do vybraných ETF. 
                  Jeden nákup měsíčně = nulové komise po celý rok.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <h5 className="text-lg font-bold text-blue-800">Diversifikace zdarma</h5>
                </div>
                <p className="text-blue-700 leading-relaxed">
                  Kombinujte různé ETF: světové akcie (IWDA), emerging markets (EMIM), 
                  dluhopisy - každý měsíčně jednou bez komisí.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <h5 className="text-lg font-bold text-purple-800">Správné načasování</h5>
                </div>
                <p className="text-purple-700 leading-relaxed">
                  Naplánujte si investice na konkrétní den v měsíci. 
                  Vyhněte se impulzivním nákupům, které by stály €1 extra.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-bold text-sm">4</span>
                  </div>
                  <h5 className="text-lg font-bold text-orange-800">Akumulační vs distribuční</h5>
                </div>
                <p className="text-orange-700 leading-relaxed">
                  Preferujte akumulační ETF (reinvestice dividend) pro automatický růst. 
                  Vyhnete se nuceným prodejům kvoti daním z dividend.
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
            <div className="flex items-center justify-center rounded-full bg-orange-100 w-20 h-20 mx-auto mb-8 hover:bg-orange-200 transition-colors hover-scale">
              <span className="text-2xl">❓</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Často kladené otázky o ETF zdarma na DEGIRO
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Odpovědi na nejčastější dotazy o investování bez komisí
            </p>
          </div>

          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.2s]">
            <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "Jak funguje Fair Use Policy na DEGIRO?",
                answer: "První obchod s každým ETF každý kalendářní měsíc je zdarma do €1,000 za transakci. Od druhého obchodu se stejným ETF ve stejném měsíci se účtuje administrativní poplatek €1 + spread. Tato politika je ideální pro měsíční DCA strategii."
              },
              {
                question: "Kolik ETF fondů je dostupných zdarma na DEGIRO?",
                answer: "DEGIRO nabízí více než 65 ETF fondů v rámci své Fair Use Policy. Zahrnuje nejpopulárnější ETF od iShares, Vanguard, SPDR a dalších poskytovatelů pokrývající všechny hlavní indexy a regiony."
              },
              {
                question: "Jaké jsou nejlepší ETF zdarma na DEGIRO?",
                answer: "Nejpopulárnější jsou iShares Core S&P 500 (CSPX), iShares Core MSCI World (IWDA) a iShares Core MSCI Emerging Markets (EMIM). Tyto ETF nabízejí širokou diverzifikaci a nízké poplatky v kombinaci s nulovými komisemi."
              },
              {
                question: "Platí Fair Use Policy i pro prodeje ETF?",
                answer: "Ano, Fair Use Policy platí jak pro nákupy, tak pro prodeje. První prodej každého ETF měsíčně je zdarma, další prodeje stojí €1 + spread. To je důležité plánovat při rebalancování portfolia."
              },
              {
                question: "Jaký je rozdíl mezi €1 poplatkem a běžnými komisemi?",
                answer: "Běžné komise u jiných brokerů se pohybují od €5-20 za obchod. DEGIRO účtuje pouze €1 za druhý a další obchody, což je významná úspora. Při měsíční DCA strategii platíte nulu komisí."
              },
              {
                question: "Jsou data v našich žebříčcích aktuální?",
                answer: "Ano, všechny žebříčky jsou generovány živě z naší databáze při každém načtení stránky. Zahrnují nejnovější data o TER, velikosti fondů, výkonnosti a DEGIRO free statusu všech ETF dostupných pro evropské investory."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="flex items-center justify-center rounded-full bg-orange-100 w-20 h-20 mx-auto mb-8 hover:bg-orange-200 transition-colors hover-scale">
              <ZapIcon className="w-10 h-10 text-orange-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Připraveni investovat zdarma na DEGIRO?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Otevřete si účet na DEGIRO a začněte s investováním do 65+ ETF bez komisí
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="hover-scale bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold">
                <Link href="/degiro-recenze">
                  <UsersIcon className="w-5 h-5 mr-2" />
                  Přečíst DEGIRO recenzi
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="hover-scale border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold">
                <Link href="/srovnani-brokeru">
                  <BarChart3Icon className="w-5 h-5 mr-2" />
                  Srovnat s jinými brokery
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Internal Linking */}
        <InternalLinking relatedLinks={ETFGuideRelatedLinks} />
      </div>
    </Layout>
  );
}