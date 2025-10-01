import React from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { Star, BarChart3, Target, Smartphone, Cpu , DollarSign, Rocket, Zap, Users, Flag, Building, TrendingUp, Globe} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import type { Metadata } from 'next';

// Top 3 doporučené NASDAQ ETF - editoriální výběr s live daty z databáze
const TOP_3_NASDAQ_ETFS_TEMPLATE = [
  {
    name: "iShares Nasdaq 100 UCITS ETF (Acc)",
    ticker: "CNDX",
    isin: "IE00B53SZB19",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší NASDAQ ETF v Evropě s nejvyšší likviditou. Nejbezpečnější volba pro expozici k americkým technologickým gigantům s dlouholetou historií.",
  },
  {
    name: "Amundi Nasdaq-100 UCITS ETF Acc",
    ticker: "ANX",
    isin: "LU1681038243",
    provider: "Amundi",
    degiroFree: false,
    reason: "Vynikající poměr TER ku kvalitě s efektivní swap replikací. Ideální volba pro nákladově uvědomělé investory preferující přesné sledování indexu.",
  },
  {
    name: "Xtrackers Nasdaq 100 UCITS ETF 1C",
    ticker: "XNAS",
    isin: "IE00BMFKG444",
    provider: "Xtrackers",
    degiroFree: false,
    reason: "Spolehlivá fyzická replikace s transparentním držením akcií. Perfektní pro investory, kteří preferují přímé vlastnictví podkladových aktiv.",
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
    title: `Nejlepší NASDAQ ETF ${currentYear} - CNDX vs ANX vs XNAS | ETF průvodce.cz`,
    description: `✅ Srovnání nejlepších NASDAQ 100 ETF ${currentYear}. CNDX, ANX, XNAS - poplatky TER, výnosy, expozice k Apple, Microsoft, Tesla. Aktuální data k ${currentDate}.`,
    keywords: `nejlepší NASDAQ ETF ${currentYear}, CNDX ETF, ANX ETF, XNAS ETF, NASDAQ 100 porovnání, technologické ETF, americké tech akcie`,
    openGraph: {
      title: `Nejlepší NASDAQ ETF ${currentYear} - CNDX vs ANX vs XNAS`,
      description: `Srovnání nejlepších NASDAQ 100 ETF ${currentYear}. CNDX, ANX, XNAS - poplatky TER, výnosy, expozice k Apple, Microsoft, Tesla.`,
      url: 'https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-nasdaq-etf',
      siteName: 'ETF průvodce.cz',
      images: [
        {
          url: 'https://etfpruvodce.cz/og-nasdaq-etf.jpg',
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
      images: ['https://etfpruvodce.cz/og-nasdaq-etf.jpg'],
    },
    alternates: {
      canonical: 'https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-nasdaq-etf',
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

export default function NejlepsiNASDAQETF() {
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
    "image": "https://etfpruvodce.cz/og-nasdaq-etf.jpg",
    "author": {
      "@type": "Organization",
      "name": "ETF průvodce.cz",
      "url": "https://etfpruvodce.cz"
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
    "dateModified": new Date(new Date().getMonth(), 1).toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-nasdaq-etf"
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
        "name": "Nejlepší NASDAQ ETF",
        "item": "https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-nasdaq-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-blue-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-indigo-200/50">
                <Flag className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  NASDAQ ETF
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Kompletní srovnání nejlepších NASDAQ 100 ETF fondů pro expozici k americkým technologickým gigantům. 
                Analýza Apple, Microsoft, Tesla a dalších.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
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
            
            {/* Right Content - Subtle NASDAQ Stats */}
            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                
                {/* Simple Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-3">
                    <Smartphone className="w-6 h-6 text-indigo-600" />
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
                      <Building className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs text-gray-500 font-medium">SLOŽENÍ</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">100</div>
                    <div className="text-xs text-gray-600">největších tech firem</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-gray-500 font-medium">VÝNOS</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">~13%</div>
                    <div className="text-xs text-gray-600">ročně historicky</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP HOLDINGS</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">15%</div>
                    <div className="text-xs text-gray-600">Apple + Microsoft</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-green-600" />
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
              <Cpu className="w-10 h-10 text-indigo-700" />
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
                icon: Smartphone,
                title: "100 tech gigantů",
                description: "Index obsahuje 100 největších nefinančních společností z burzy NASDAQ, především z technologického sektoru.",
                color: "indigo"
              },
              {
                icon: Cpu,
                title: "Apple, Microsoft, Tesla",
                description: "Největší váhu mají Apple (8%), Microsoft (7%), Amazon, Google, Tesla a NVIDIA. TOP 10 tvoří 50% indexu.",
                color: "purple"
              },
              {
                icon: TrendingUp,
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

      {/* Top 3 Recommendations - Client Component with Live Data */}
      <Top3ETFLiveSection 
        title="🏆 Top 3 nejlepší NASDAQ ETF"
        description="Naše doporučení na základě analýzy všech dostupných NASDAQ 100 ETF"
        etfTemplates={TOP_3_NASDAQ_ETFS_TEMPLATE}
        colorScheme="purple"
      />

      {/* FilteredETF Sections - Client Component with Database Queries */}
      <FilteredETFSections 
        indexKeywords={["NASDAQ"]}
        excludeKeywords={["China", "KraneShares", "Sector", "2x", "3x"]}
      />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Selection Guide */}
          <div id="pruvodce" className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl p-12 border border-indigo-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 w-20 h-20 mx-auto mb-6">
                <Target className="w-10 h-10 text-indigo-600" />
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-green-100 w-20 h-20 mx-auto mb-8 hover:bg-green-200 transition-colors hover-scale">
              <Zap className="w-10 h-10 text-green-700" />
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
                  <Users className="w-5 h-5 mr-2" />
                  Najít brokera pro ETF
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="hover-scale border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 px-8 py-4 text-lg font-semibold">
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