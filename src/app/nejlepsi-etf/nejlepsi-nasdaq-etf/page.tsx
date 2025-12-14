import React from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, SmartphoneIcon, CpuIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, FlagIcon, BuildingIcon, TrendingUpIcon, GlobeIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
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
    title: `Nejlepší NASDAQ ETF ${currentYear} - CNDX vs ANX vs XNAS`,
    description: `✅ Srovnání nejlepších NASDAQ 100 ETF ${currentYear}. CNDX, ANX, XNAS - poplatky TER, výnosy, expozice k Apple, Microsoft, Tesla. Aktuální data k ${currentDate}.`,
    keywords: `nejlepší NASDAQ ETF ${currentYear}, CNDX ETF, ANX ETF, XNAS ETF, NASDAQ 100 porovnání, technologické ETF, americké tech akcie`,
    openGraph: {
      title: `Nejlepší NASDAQ ETF ${currentYear} - CNDX vs ANX vs XNAS`,
      description: `Srovnání nejlepších NASDAQ 100 ETF ${currentYear}. CNDX, ANX, XNAS - poplatky TER, výnosy, expozice k Apple, Microsoft, Tesla.`,
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-nasdaq-etf',
      siteName: 'ETF průvodce.cz',
      images: [
        {
          url: 'https://www.etfpruvodce.cz/og-nasdaq-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší NASDAQ ETF ${currentYear}`,
        },
      ],
      locale: 'cs_CZ',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší NASDAQ ETF ${currentYear} - CNDX vs ANX vs XNAS`,
      description: `Srovnání nejlepších NASDAQ 100 ETF ${currentYear}. CNDX, ANX, XNAS - poplatky TER, výnosy, expozice k Apple, Microsoft, Tesla.`,
      images: ['https://www.etfpruvodce.cz/og-nasdaq-etf.jpg'],
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-nasdaq-etf',
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
      'article:tag': 'NASDAQ ETF, CNDX, ANX, XNAS, technologie',
      'theme-color': '#6366F1',
      'msapplication-TileColor': '#6366F1',
      'format-detection': 'telephone=no',
    },
  };
}

export default async function NejlepsiNASDAQETF() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-nasdaq-etf'];
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
    "headline": `Nejlepší NASDAQ ETF ${currentYear} - CNDX vs ANX vs XNAS`,
    "description": `Srovnání nejlepších NASDAQ 100 ETF ${currentYear}. CNDX, ANX, XNAS - poplatky TER, výnosy, expozice k Apple, Microsoft, Tesla.`,
    "image": "https://www.etfpruvodce.cz/og-nasdaq-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-nasdaq-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": `NASDAQ ETF, CNDX, ANX, XNAS, technologie, investování`,
    "wordCount": 2200,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "NASDAQ ETF",
        "description": "Exchange-traded funds tracking the NASDAQ 100 index"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Nasdaq 100 UCITS ETF",
        "identifier": "IE00B53SZB19"
      },
      {
        "@type": "FinancialProduct", 
        "name": "Amundi Nasdaq-100 UCITS ETF",
        "identifier": "LU1681038243"
      },
      {
        "@type": "FinancialProduct",
        "name": "Xtrackers Nasdaq 100 UCITS ETF", 
        "identifier": "IE00BMFKG444"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "NASDAQ 100 Index",
        "description": "Stock market index of 100 largest non-financial companies listed on NASDAQ"
      },
      {
        "@type": "Organization", 
        "name": "Apple Inc.",
        "description": "Technology company with largest weight in NASDAQ 100"
      },
      {
        "@type": "Organization",
        "name": "Microsoft Corporation", 
        "description": "Technology company with high weight in NASDAQ 100"
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
        "name": "Jaké jsou nejlepší NASDAQ ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší NASDAQ ETF jsou: iShares Nasdaq 100 UCITS ETF (CNDX, IE00B53SZB19) největší s nejvyšší likviditou, Amundi Nasdaq-100 UCITS ETF (ANX, LU1681038243) s efektivní swap replikací a nízkým TER, a Xtrackers Nasdaq 100 UCITS ETF (XNAS, IE00BMFKG444) se spolehlivou fyzickou replikací."
        }
      },
      {
        "@type": "Question", 
        "name": "Jaký je rozdíl mezi fyzickou a swap replikací u NASDAQ ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fyzická replikace (CNDX, XNAS) přímo kupuje akcie NASDAQ 100 společností, swap replikace (ANX) používá derivátové kontrakty. Swap často nabízí nižší TER a přesnější sledování indexu, fyzická replikace je transparentnější."
        }
      },
      {
        "@type": "Question",
        "name": "Které společnosti mají největší váhu v NASDAQ ETF?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Největší váhu v NASDAQ 100 ETF mají technologické giganty: Apple (cca 8%), Microsoft (7%), Amazon, Google, Tesla a NVIDIA. TOP 10 společností tvoří přibližně 50% celého indexu."
        }
      },
      {
        "@type": "Question",
        "name": "Je NASDAQ 100 rizikovější než S&P 500?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano, NASDAQ 100 je více koncentrovaný do tech sektoru, což znamená vyšší volatilitu. Historicky však dosahoval vyšších výnosů. Je vhodný jako doplněk k diverzifikovanějšímu portfoliu."
        }
      },
      {
        "@type": "Question",
        "name": "Vyplácejí NASDAQ ETF dividendy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Většina NASDAQ ETF jsou akumulační (reinvestují dividendy). Tech společnosti obecně vyplácejí nižší dividendy než tradiční sektory, zaměřují se na růst a reinvestice."
        }
      },
      {
        "@type": "Question",
        "name": "Která burza je lepší pro nákup NASDAQ ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "NASDAQ ETF můžete koupit na evropských burzách (Xetra, Borsa Italiana, LSE). Vyberte burzu s nejnižšími poplatky u vašeho brokera a dobrou likviditou daného ETF."
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
        "name": "Nejlepší NASDAQ ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-nasdaq-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-blue-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-indigo-200/50">
                <FlagIcon className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  NASDAQ ETF
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
                Kompletní srovnání nejlepších NASDAQ 100 ETF fondů pro expozici k americkým technologickým gigantům. 
                Analýza Apple, Microsoft, Tesla a dalších.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
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
            
            {/* Right Content - Subtle NASDAQ Stats */}
            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                
                {/* Simple Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-3">
                    <SmartphoneIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    NASDAQ 100 v číslech
                  </h3>
                  <p className="text-sm text-gray-600">Klíčová fakta o technologickém indexu</p>
                </div>
                
                {/* Subtle Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BuildingIcon className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs text-gray-500 font-medium">SLOŽENÍ</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">100</div>
                    <div className="text-xs text-gray-600">největších tech firem</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUpIcon className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-gray-500 font-medium">VÝNOS</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">~13%</div>
                    <div className="text-xs text-gray-600">ročně historicky</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CpuIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP HOLDINGS</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">15%</div>
                    <div className="text-xs text-gray-600">Apple + Microsoft</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <GlobeIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">VÝBĚR</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">15+</div>
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
            <div className="flex items-center justify-center rounded-full bg-indigo-100 w-20 h-20 mx-auto mb-8 hover:bg-indigo-200 transition-colors hover-scale">
              <CpuIcon className="w-10 h-10 text-indigo-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Co je NASDAQ 100 index?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Technologický index zahrnující 100 největších nefinančních společností z burzy NASDAQ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: SmartphoneIcon,
                title: "100 tech gigantů",
                description: "Index obsahuje 100 největších nefinančních společností z burzy NASDAQ, především z technologického sektoru.",
                color: "indigo"
              },
              {
                icon: CpuIcon,
                title: "Apple, Microsoft, Tesla",
                description: "Největší váhu mají Apple (8%), Microsoft (7%), Amazon, Google, Tesla a NVIDIA. TOP 10 tvoří 50% indexu.",
                color: "purple"
              },
              {
                icon: TrendingUpIcon,
                title: "Historický výnos ~13%",
                description: "Průměrný roční výnos za posledních 20 let je přibližně 13%, vyšší než S&P 500 díky tech sektoru.",
                color: "blue"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              const colorMap = {
                indigo: "from-indigo-500 to-purple-600",
                purple: "from-purple-500 to-blue-600", 
                blue: "from-blue-500 to-cyan-600"
              };
              
              return (
                <div key={index} className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
                  <div className={`flex items-center justify-center rounded-full bg-gradient-to-r ${colorMap[item.color]} w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-indigo-800 transition-colors">
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

      {/* Top 3 Recommendations - Server-side rendered with real data */}
      <section id="top3" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top 3 nejlepší NASDAQ ETF
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení nejlepších NASDAQ 100 ETF fondů na základě analýzy {etfs.length} fondů
            </p>
          </div>

          <Top3ETFServer etfs={etfs} currency="EUR" />
        </div>
      </section>

      {/* Top 10 Sections - by TER, AUM, Performance */}
      <Top10SectionsServer etfs={etfs} currency="EUR" categoryName="Nasdaq" />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Selection Guide */}
          <div id="pruvodce" className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl p-12 border border-indigo-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-indigo-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                💡 Jak vybrat ten správný NASDAQ ETF?
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
                  Vyberte největší fond s fyzickou replikací (CNDX). 
                  Získáte nejvyšší likviditu a transparentní držení akcií tech gigantů.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <h5 className="text-lg font-bold text-blue-800">Pro úsporu nákladů</h5>
                </div>
                <p className="text-blue-700 leading-relaxed">
                  Zvolte swap ETF s nejnižším TER (ANX). 
                  Získáte přesnější sledování indexu a nižší roční náklady.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <h5 className="text-lg font-bold text-purple-800">Pro konzervativní investory</h5>
                </div>
                <p className="text-purple-700 leading-relaxed">
                  Fyzická replikace (CNDX, XNAS) znamená přímé vlastnictví akcií. 
                  Vyšší transparentnost, ale obvykle vyšší TER.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-bold text-sm">4</span>
                  </div>
                  <h5 className="text-lg font-bold text-orange-800">Pro tech expozici</h5>
                </div>
                <p className="text-orange-700 leading-relaxed">
                  NASDAQ 100 má vyšší koncentraci v tech sektoru než S&P 500. 
                  Ideální pro investory věřící v dlouhodobý růst technologií.
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
              Často kladené otázky o NASDAQ ETF
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Odpovědi na nejčastější dotazy o investování do NASDAQ 100 ETF
            </p>
          </div>

          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.2s]">
            <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "Jaké jsou nejlepší NASDAQ ETF v roce 2025?",
                answer: "Nejlepší NASDAQ ETF jsou: iShares Nasdaq 100 UCITS ETF (CNDX, IE00B53SZB19) největší s nejvyšší likviditou, Amundi Nasdaq-100 UCITS ETF (ANX, LU1681038243) s efektivní swap replikací a nízkým TER, a Xtrackers Nasdaq 100 UCITS ETF (XNAS, IE00BMFKG444) se spolehlivou fyzickou replikací."
              },
              {
                question: "Jaký je rozdíl mezi fyzickou a swap replikací u NASDAQ ETF?",
                answer: "Fyzická replikace (CNDX, XNAS) přímo kupuje akcie NASDAQ 100 společností, swap replikace (ANX) používá derivátové kontrakty. Swap často nabízí nižší TER a přesnější sledování indexu, fyzická replikace je transparentnější."
              },
              {
                question: "Které společnosti mají největší váhu v NASDAQ ETF?",
                answer: "Největší váhu v NASDAQ 100 ETF mají technologické giganty: Apple (cca 8%), Microsoft (7%), Amazon, Google, Tesla a NVIDIA. TOP 10 společností tvoří přibližně 50% celého indexu."
              },
              {
                question: "Je NASDAQ 100 rizikovější než S&P 500?",
                answer: "Ano, NASDAQ 100 je více koncentrovaný do tech sektoru, což znamená vyšší volatilitu. Historicky však dosahoval vyšších výnosů. Je vhodný jako doplněk k diverzifikovanějšímu portfoliu."
              },
              {
                question: "Vyplácejí NASDAQ ETF dividendy?",
                answer: "Většina NASDAQ ETF jsou akumulační (reinvestují dividendy). Tech společnosti obecně vyplácejí nižší dividendy než tradiční sektory, zaměřují se na růst a reinvestice."
              },
              {
                question: "Která burza je lepší pro nákup NASDAQ ETF?",
                answer: "NASDAQ ETF můžete koupit na evropských burzách (Xetra, Borsa Italiana, LSE). Vyberte burzu s nejnižšími poplatky u vašeho brokera a dobrou likviditou daného ETF."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-indigo-50 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-indigo-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* SECTION 8: NASDAQ 100-Specific Pro Optimization Tips */}
      <section id="pro-tipy" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            ⚡ 5 pokročilých tipů specifických pro NASDAQ 100 ETF
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Tyto strategie fungují specificky pro NASDAQ 100 index a jeho tech-heavy strukturu. Neplatí pro S&P 500, MSCI World ani jiné diversifikované indexy.
          </p>

          <div className="space-y-8">
            {/* Tip 1: Magnificent 7 Extrémní koncentrace */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    ⚠️ Magnificent 7 Extrémní koncentrace (45%+ indexu!)
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    NASDAQ 100 má <strong>NEJVYŠŠÍ koncentraci TOP 7</strong> ze všech hlavních indexů:
                    Apple, Microsoft, Amazon, Nvidia, Tesla, Meta, Alphabet často tvoří <strong>45-50% celého indexu</strong>.
                    To je skoro DVOJNÁSOBEK S&P 500 (~25-30%) a TROJNÁSOBEK MSCI World (~15%).
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-3">📊 Koncentrační riziko v číslech:</p>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <div className="bg-red-50 rounded p-3 border-l-4 border-red-500">
                        <p className="font-bold text-red-800">NASDAQ 100</p>
                        <p className="text-2xl font-bold text-red-900 my-1">45-50%</p>
                        <p className="text-xs text-gray-600">TOP 7 společností</p>
                      </div>
                      <div className="bg-orange-50 rounded p-3 border-l-4 border-orange-500">
                        <p className="font-bold text-orange-800">S&P 500</p>
                        <p className="text-2xl font-bold text-orange-900 my-1">25-30%</p>
                        <p className="text-xs text-gray-600">TOP 7 společností</p>
                      </div>
                      <div className="bg-green-50 rounded p-3 border-l-4 border-green-500">
                        <p className="font-bold text-green-800">MSCI World</p>
                        <p className="text-2xl font-bold text-green-900 my-1">~15%</p>
                        <p className="text-xs text-gray-600">TOP 7 společností</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-l-4 border-red-500 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-2">💡 Rebalanční strategie:</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">🚨</span>
                        <div>
                          <strong>Magnificent 7 {'>'}  50%:</strong> KRITICKÉ! Zvažte přidat Equal-Weight NASDAQ ETF
                          (např. Invesco NASDAQ 100 Equal Weight) nebo S&P 500 pro snížení rizika jedné akcie.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">⚠️</span>
                        <div>
                          <strong>Magnificent 7 = 45-50%:</strong> Normální pro NASDAQ, ale sledujte.
                          Pokud 1-2 z TOP 7 zakolísají, pocítíte to výrazně.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✅</span>
                        <div>
                          <strong>Magnificent 7 {'<'} 40%:</strong> Nižší koncentrace = nižší riziko.
                          Vzácné, ale ideální čas pro větší alokaci do NASDAQ.
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Kde sledovat aktuální váhu:</strong> <a href="https://www.slickcharts.com/nasdaq100" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SlickCharts.com/nasdaq100</a>
                    {' '}(sledování v reálném čase)
                  </p>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: S&P 500 má také Magnificent 7, ale s ~25-30% váhou je riziko poloviční.
                    MSCI World má ještě širší diverzifikaci (~15% TOP 7).
                  </p>
                </div>
              </div>
            </div>

            {/* Tip 2: Prosincový roční rebalance = Velký nárůst volatility */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    📅 Prosincový rebalance = Velký nárůst volatility (1x ročně vs S&P 500 čtvrtletně)
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    NASDAQ 100 se rebalancuje pouze <strong>1x ročně v prosinci</strong> (vs S&P 500 čtvrtletně).
                    To znamená, že všechny změny v indexu (přidání/odstranění společností, úpravy limitů) se dějí najednou
                    → <strong>extrémní volatilita v 3. týdnu prosince</strong>.
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-3">🗓️ Časová osa prosincového rebalance:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-3 border-l-4 border-blue-500 pl-3">
                        <span className="font-bold text-blue-700">1. týden:</span>
                        <p className="text-gray-700">NASDAQ oznámí změny v indexu (které společnosti přibývají/ubývají). Trhy spekulují.</p>
                      </div>
                      <div className="flex items-start gap-3 border-l-4 border-orange-500 pl-3">
                        <span className="font-bold text-orange-700">2.-3. týden:</span>
                        <p className="text-gray-700">
                          <strong>MAXIMÁLNÍ VOLATILITA!</strong> Institucionální investoři nuceni nakupovat/prodávat.
                          Chyba sledování ETF se zvyšuje. Spread se rozšiřuje.
                        </p>
                      </div>
                      <div className="flex items-start gap-3 border-l-4 border-green-500 pl-3">
                        <span className="font-bold text-green-700">4. týden + leden:</span>
                        <p className="text-gray-700">Volatilita klesá, trhy se normalizují. Ideální čas pro nákup.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-l-4 border-purple-500 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-2">💡 Obchodní strategie pro prosincový rebalance:</p>
                    <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                      <li>
                        <strong>NEDĚLEJTE velké nákupy 10.-20. prosince</strong> → spread je široký, volatilita vysoká,
                        můžete koupit o 2-5% dráž než férová hodnota.
                      </li>
                      <li>
                        <strong>Pokud investujete pravidelně (DCA):</strong> Přesuňte prosincovou investici na začátek ledna.
                        Vyhnete se rebalančnímu chaosu.
                      </li>
                      <li>
                        <strong>Příležitostný nákup:</strong> Pokud NASDAQ klesne {'>'} 10% v prosinci kvůli rebalanci,
                        je to často krátkodobá přehnaná reakce → nákupní příležitost (ale riskantní!).
                      </li>
                    </ol>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: S&P 500 rebalancuje čtvrtletně → volatilita je rozložená, nižší dopad na událost.
                    MSCI World má postupný rebalance → téměř žádný skok.
                  </p>
                </div>
              </div>
            </div>

            {/* Tip 3: Chybějící finanční sektor */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🏦 Nula finančních společností = 13% trhu chybí (záměrně)
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    NASDAQ 100 <strong>VYLUČUJE všechny finanční společnosti</strong> (banky, pojišťovny, investiční firmy) z definice.
                    To znamená, že vám chybí ~<strong>13% ze S&P 500</strong>: JPMorgan, Bank of America, Berkshire Hathaway, Visa, Mastercard, atd.
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-3">💼 Co vám chybí bez finančního sektoru:</p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p className="font-bold text-red-800">❌ Nemáte expozici vůči:</p>
                        <ul className="text-gray-700 space-y-1">
                          <li>• JPMorgan Chase (největší US banka)</li>
                          <li>• Berkshire Hathaway (Warren Buffett)</li>
                          <li>• Visa, Mastercard (zpracovatelé plateb)</li>
                          <li>• BlackRock, Goldman Sachs (investiční)</li>
                          <li>• Pojišťovací giganty (Prudential, MetLife)</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="font-bold text-green-800">✅ Máte více tech/spotřebitele:</p>
                        <ul className="text-gray-700 space-y-1">
                          <li>• Vyšší váha v Tech (~50% vs 30%)</li>
                          <li>• Vyšší váha v Consumer Discretionary</li>
                          <li>• Vyšší váha v Healthcare tech</li>
                          <li>• Čistší růstový profil</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-2">💡 Strategie doplnění portfolia:</p>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="bg-blue-50 rounded p-3">
                        <p className="font-bold text-blue-800 mb-1">Varianta A: Čistý NASDAQ (Akceptovat mezeru)</p>
                        <p className="text-xs">100% NASDAQ 100 ETF → Čistá tech/růstová sázka. Ignorujete finanční sektor úmyslně.</p>
                      </div>
                      <div className="bg-green-50 rounded p-3">
                        <p className="font-bold text-green-800 mb-1">Varianta B: 70/30 Rozdělení (Vyvážené)</p>
                        <p className="text-xs">
                          70% NASDAQ 100 + 30% Financial Sector ETF (např. SPDR Financial XLF)
                          → Získáte tech expozici + finanční vyvážení.
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded p-3">
                        <p className="font-bold text-purple-800 mb-1">Varianta C: Přejít na S&P 500 (Celý trh)</p>
                        <p className="text-xs">
                          S&P 500 má tech (~30%) + financials (~13%) + 9 dalších sektorů.
                          Širší diverzifikace, nižší volatilita.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: Absence finančního sektoru je VLASTNOST, ne chyba. NASDAQ chce čistou ne-finanční expozici.
                    Pokud chcete finanční sektor, kombinujte s Financial ETF nebo použijte S&P 500.
                  </p>
                </div>
              </div>
            </div>

            {/* Tip 4: 2x horší poklesy v medvědích trzích */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border-2 border-orange-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    📉 Beta ~1.2-1.3: NASDAQ klesá ~20-30% víc než S&P 500 v medvědích trzích
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    NASDAQ 100 má <strong>beta koeficient ~1.2-1.3</strong> vůči S&P 500.
                    To znamená: když S&P 500 klesne o 10%, NASDAQ typicky klesne o <strong>12-13%</strong>.
                    Ve velkých medvědích trzích je rozdíl ještě větší (růstové akcie jsou zasaženy více).
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-3">📊 Historické poklesy v medvědím trhu:</p>
                    <div className="space-y-2 text-sm">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-red-50 rounded p-3 border-l-4 border-red-500">
                          <p className="font-bold text-red-800">2022 Medvědí trh</p>
                          <p className="text-xs text-gray-600 mb-2">Fed zvyšoval sazby, tech výprodej</p>
                          <div className="space-y-1">
                            <p><span className="font-bold text-red-900">NASDAQ:</span> -33%</p>
                            <p><span className="font-bold text-orange-900">S&P 500:</span> -18%</p>
                            <p className="text-xs font-bold text-red-700">→ NASDAQ o 15 p.b. hůř!</p>
                          </div>
                        </div>
                        <div className="bg-orange-50 rounded p-3 border-l-4 border-orange-500">
                          <p className="font-bold text-orange-800">2000-2002 Dot-com</p>
                          <p className="text-xs text-gray-600 mb-2">Prasknutí tech bubliny</p>
                          <div className="space-y-1">
                            <p><span className="font-bold text-red-900">NASDAQ:</span> -78% (!)</p>
                            <p><span className="font-bold text-orange-900">S&P 500:</span> -49%</p>
                            <p className="text-xs font-bold text-red-700">→ NASDAQ o 29 p.b. hůř!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-l-4 border-orange-500 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-2">💡 Strategie přežití v medvědím trhu:</p>
                    <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                      <li>
                        <strong>Očekávejte -30% poklesy v medvědích trzích</strong> (vs S&P 500 -20%).
                        Nečekejte že NASDAQ klesá míň - tech je vždy zasažen více.
                      </li>
                      <li>
                        <strong>DCA agresivně při poklesech:</strong> Když NASDAQ klesne {'>'} 25%, alokujte extra kapitál.
                        Zotavení je obvykle rychlejší než S&P 500 (2020 COVID: NASDAQ +45% za 6 měsíců).
                      </li>
                      <li>
                        <strong>NEPRODÁVEJTE na dně!</strong> Psychologie NASDAQ investorů: panický prodej při -30% → zmeškat zotavení.
                        Držte nebo kupujte, neprodávejte.
                      </li>
                      <li>
                        <strong>Hedge varianta (pokročilé):</strong> 80% NASDAQ + 20% Bonds/Gold ETF → snížení volatility,
                        ztráta růstového potenciálu (kompromis).
                      </li>
                    </ol>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: Vyšší volatilita = vyšší riziko, ale také vyšší dlouhodobé výnosy.
                    NASDAQ historicky překonává S&P 500 za 10+ let, ale cesta je bolestnější.
                  </p>
                </div>
              </div>
            </div>

            {/* Tip 5: Modified Cap-Weighting Anti-Monopoly Rule */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    5
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    ⚖️ Upravené kapitálové vážení: 24% limit brání Apple/Microsoft monopolu
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    NASDAQ 100 používá <strong>upravené vážení podle tržní kapitalizace</strong> s pravidlem:
                    žádná společnost nemůže mít váhu {'>'} 24% indexu. Pokud Apple/Microsoft překročí 24% při rebalanci,
                    jsou automaticky omezeny a přebytečná váha je přerozdělena.
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-3">📊 Jak funguje 24% limit:</p>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="bg-blue-50 rounded p-3 border-l-4 border-blue-500">
                        <p className="font-bold text-blue-800">Scénář 1: Apple roste na 26% tržní kapitalizace</p>
                        <p className="text-xs mt-1">
                          Při prosincovém rebalanci → Apple je omezen na 24%.
                          Přebytečná 2% jsou distribuována na akcie #2-#100 proporčně.
                        </p>
                      </div>
                      <div className="bg-green-50 rounded p-3 border-l-4 border-green-500">
                        <p className="font-bold text-green-800">Efekt: Anti-monopolní ochrana</p>
                        <p className="text-xs mt-1">
                          Zabraňuje tomu, aby 1 společnost dominovala index (na rozdíl od čistých indexů podle tržní kapitalizace).
                          NASDAQ má vestavěnou diverzifikaci.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-l-4 border-green-500 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-2">💡 Investiční implikace:</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✅</span>
                        <div>
                          <strong>Výhoda:</strong> NASDAQ má vestavěnou diverzifikaci. I když Apple exploduje,
                          váha je omezena → nižší riziko jedné akcie než u čisté tržní kapitalizace.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">⚠️</span>
                        <div>
                          <strong>Nevýhoda:</strong> Pokud chcete MAXIMÁLNÍ expozici vůči růstu Apple/Microsoft,
                          NASDAQ vás limituje. S&P 500 Technology ETF (neomezený) může mít Apple na 35%+.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">💡</span>
                        <div>
                          <strong>Strategie:</strong> Pokud věříte v dlouhodobou dominanci Apple/Microsoft,
                          kombinujte 70% NASDAQ + 30% přímé Apple/Microsoft akcie pro extra expozici.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <p className="text-sm text-gray-800 font-medium mb-2">📚 Srovnání s jinými indexy:</p>
                    <div className="grid md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="font-bold text-gray-800">NASDAQ 100 (Upravený limit):</p>
                        <p className="text-gray-600">Max 24% na akcii → vynucená diverzifikace</p>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">S&P 500 (Čistá tržní kap.):</p>
                        <p className="text-gray-600">Bez limitů → Apple může mít 7-8% celého indexu</p>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Equal-Weight NASDAQ:</p>
                        <p className="text-gray-600">Každá akcie = 1% → maximální diverzifikace, nižší výnosy</p>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Tech Sector ETF:</p>
                        <p className="text-gray-600">Čistý tech, bez limitů → nejvyšší koncentrace jedné akcie</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: 24% limit je unikátní pro NASDAQ 100. Většina indexů (S&P 500, MSCI World) používá čisté vážení podle tržní kapitalizace bez limitů.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-green-100 w-20 h-20 mx-auto mb-8 hover:bg-green-200 transition-colors hover-scale">
              <ZapIcon className="w-10 h-10 text-green-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Připraveni investovat do NASDAQ?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Najděte si ideálního brokera a začněte s investováním do nejlepších NASDAQ ETF
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="hover-scale bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold">
                <Link href="/kde-koupit-etf">
                  <UsersIcon className="w-5 h-5 mr-2" />
                  Najít brokera pro ETF
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="hover-scale border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 px-8 py-4 text-lg font-semibold">
                <Link href="/srovnani-etf">
                  <BarChart3Icon className="w-5 h-5 mr-2" />
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
              title: "Nejlepší S&P 500 ETF",
              href: "/nejlepsi-etf/nejlepsi-sp500-etf",
              description: "Srovnání nejlepších S&P 500 ETF pro širší americkou expozici"
            },
            {
              title: "Nejlepší světové ETF",
              href: "/nejlepsi-etf/nejlepsi-msci-world-etf", 
              description: "Globální diverzifikace s MSCI World ETF"
            },
            {
              title: "Kde koupit NASDAQ ETF",
              href: "/kde-koupit-etf",
              description: "Srovnání brokerů pro investice do technologických ETF"
            },
            {
              title: "Portfolio strategie s NASDAQ",
              href: "/portfolio-strategie",
              description: "Modelová portfolia obsahující NASDAQ ETF"
            }
          ]}
        />
      </div>
    </Layout>
  );
}