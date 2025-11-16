import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { Star, BarChart3, ArrowRight, Target, MapPin, Crown, Landmark , DollarSign, Rocket, Zap, Users, Flag, Shield} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// Top 3 doporučené DAX ETF na základě dat z databáze
const TOP_3_DAX_ETFS_TEMPLATE = [
  {
    name: "Xtrackers DAX UCITS ETF 1C",
    ticker: "XDAX",
    isin: "LU0274211480",
    provider: "Xtrackers",
    degiroFree: false,
    reason: "Nejnižší TER pouze 0,09% a vynikající tracking error. Ideální pro nákladově uvědomělé investory hledající expozici na německé blue chip společnosti s dlouhodobým track record.",
  },
  {
    name: "iShares Core DAX UCITS ETF (DE)",
    ticker: "EXS1",
    isin: "DE0005933931",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší DAX ETF s objemem 10+ mld. EUR a nejlepší likviditou na trhu. Nejbezpečnější volba pro větší investice do německých akcií s fyzickou replikací.",
  },
  {
    name: "Amundi Core DAX UCITS ETF Dist",
    ticker: "DAX",
    isin: "LU2611732046",
    provider: "Amundi ETF",
    degiroFree: false,
    reason: "Nejnižší TER pouze 0,08% s distribucí dividend. Nový fond s moderní strukturou a competitive advantage na německém trhu.",
  }
];

// Generate enhanced metadata for DAX ETF comparison page
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // SEO optimalizované datum - updated pouze jednou za měsíc
  const lastModified = new Date(new Date().getMonth(), 1).toISOString();
  const publishedDate = `${currentYear}-01-25`;
  
  const title = `Nejlepší DAX ETF ${currentYear} - XDAX vs EXS1 vs DAX | ETF průvodce.cz`;
  const description = `✅ Srovnání nejlepších DAX ETF ${currentYear}. XDAX, EXS1, DAX - německé akcie, poplatky TER, výnosy. Kompletní analýza DAX 40 indexu k ${currentDate}.`;
  const canonical = 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-dax-etf';
  const ogImage = 'https://www.etfpruvodce.cz/og-dax-etf.jpg';
  
  // Enhanced keywords for better discoverability
  const keywords = [
    `nejlepší DAX ETF ${currentYear}`,
    'XDAX ETF recenze',
    'EXS1 ETF analýza',
    'DAX ETF porovnání',
    'DAX 40 ETF srovnání',
    'německé akcie investice',
    'Xtrackers DAX',
    'iShares Core DAX',
    'Amundi DAX ESG',
    'německý trh diverzifikace',
    'nejlevnější DAX ETF',
    'největší DAX ETF',
    'ETF TER poplatky Německo',
    'developed Germany markets',
    'DAX index tracking'
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
        "name": "DAX ETF",
        "description": "Exchange-traded funds tracking the DAX index covering German stock markets"
      },
      {
        "@type": "FinancialProduct",
        "name": "Xtrackers DAX UCITS ETF",
        "identifier": "LU0274211480"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Core DAX UCITS ETF", 
        "identifier": "DE0005933931"
      }
    ],
    "mentions": [
      {
        "@type": "Organization",
        "name": "Xtrackers",
        "description": "ETF provider by DWS Group"
      },
      {
        "@type": "Organization", 
        "name": "iShares",
        "description": "ETF provider by BlackRock"
      },
      {
        "@type": "Organization",
        "name": "Amundi",
        "description": "Leading European ETF provider" 
      },
      {
        "@type": "Thing",
        "name": "DAX 40",
        "description": "German stock market index covering 40 largest German companies"
      }
    ]
  };
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage", 
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jak jste vybrali TOP 3 nejlepší DAX ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Náš výběr je založen na kombinaci faktorů: nejnižší poplatky TER, velikost fondu, likvidita, tracking error a celková kvalita providera. Data čerpáme z naší databáze a aktualizujeme měsíčně."
        }
      },
      {
        "@type": "Question", 
        "name": "Jaký je rozdíl mezi DAX 30 a DAX 40?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Od září 2021 byl DAX rozšířen z 30 na 40 společností pro lepší reprezentaci německé ekonomiky. Nový DAX 40 zahrnuje více technologických a mid-cap firem, ale stále dominují tradiční německé giganty."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do DAX ETF místo evropských?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DAX ETF nabízí čistou expozici k německé ekonomice, která je motorem Evropy. Německo má unikátní průmyslovou základnu a exportně orientované společnosti, které mohou doplnit širší evropské portfolio."
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
        "name": "Nejlepší DAX ETF",
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
          alt: 'Nejlepší DAX ETF - srovnání XDAX vs EXS1 vs DAX'
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

export default async function NejlepsiDAXETFPage() {
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
      title: "Nejlepší FTSE ETF",
      description: "Britské blue chip ETF na FTSE indexy",
      href: "/nejlepsi-etf/nejlepsi-ftse100-etf",
      category: "Regionální ETF"
    },
    {
      title: "Nejlepší evropské ETF", 
      description: "Kompletní srovnání evropských ETF fondů",
      href: "/nejlepsi-etf/nejlepsi-evropske-etf",
      category: "Regionální ETF"
    },
    {
      title: "Kde koupit DAX ETF",
      description: "Srovnání brokerů pro investice do německých ETF",
      href: "/kde-koupit-etf", 
      category: "Praktické tipy"
    },
    {
      title: "Portfolio strategie s DAX ETF",
      description: "Jak sestavit portfolio s německými ETF",
      href: "/portfolio-strategie",
      category: "Investiční strategie"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-slate-50/30 to-zinc-50/50"></div>
        
        {/* Animated blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-gray-200 to-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-slate-200 to-zinc-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-zinc-200 to-neutral-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-gray-200/50">
                <Flag className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-gray-600 via-slate-600 to-zinc-600 bg-clip-text text-transparent">
                  DAX ETF
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
                Kompletní srovnání nejlepších ETF fondů na DAX index. Analýza poplatků, výnosů a praktické tipy pro investice do německých blue chip společností.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#top3">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
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
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-gray-50/60 backdrop-blur-sm rounded-3xl shadow-2xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/80 to-gray-50/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🇩🇪 DAX Stats</h3>
                  <p className="text-gray-600">Klíčové informace o německém indexu</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                    <div className="text-3xl font-bold text-gray-600 mb-1">40</div>
                    <div className="text-sm text-gray-600">Německých firem</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-slate-50 to-zinc-50 rounded-xl border border-slate-200">
                    <div className="text-3xl font-bold text-slate-600 mb-1">~8%</div>
                    <div className="text-sm text-gray-600">Ročně za 20 let</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-zinc-50 to-neutral-50 rounded-xl border border-zinc-200">
                    <div className="text-3xl font-bold text-zinc-600 mb-1">75%</div>
                    <div className="text-sm text-gray-600">Německý tržní cap</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-neutral-50 to-gray-50 rounded-xl border border-neutral-200">
                    <div className="text-3xl font-bold text-neutral-600 mb-1">12</div>
                    <div className="text-sm text-gray-600">ETF na výběr</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-6 border-t border-gray-200/50">
                  <p className="text-sm text-gray-600 mb-3">Motor evropské ekonomiky</p>
                  <Link href="#pruvodce">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border border-gray-200 text-gray-600 hover:bg-gray-50"
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
              Co je DAX index?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              DAX sleduje 40 největších německých společností jako SAP, Siemens, BMW, Volkswagen a další. 
              Reprezentuje největší evropskou ekonomiku a průmyslovou sílu kontinentu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Crown,
                title: "40 největších firem Německa",
                description: "DAX pokrývá německé giganty napříč sektory - od automobilového průmyslu přes technologie až po finance a chemii.",
                color: "from-gray-500 to-slate-600",
                delay: "0.2s"
              },
              {
                icon: MapPin,
                title: "Exportní ekonomika",
                description: "Německé společnosti jsou globální lídři v automobilovém průmyslu, strojírenství a high-tech výrobě.",
                color: "from-slate-500 to-zinc-600",
                delay: "0.3s"
              },
              {
                icon: Landmark,
                title: "75% německého trhu",
                description: "DAX reprezentuje přibližně 75% celkové tržní kapitalizace německých akcií a je motorem evropské ekonomiky.",
                color: "from-zinc-500 to-neutral-600",
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
        title="🏆 Top 3 nejlepší DAX ETF"
        description="Naše doporučení na základě analýzy všech dostupných DAX ETF"
        etfTemplates={TOP_3_DAX_ETFS_TEMPLATE}
        colorScheme="gray"
      />

      {/* Top 10 Database Sections */}
      <FilteredETFSections 
        sectionId="srovnani"
        sections={[
          {
            title: "💰 TOP 10 DAX ETF podle TER",
            description: "Nejlevnější DAX ETF s nejnižšími ročními poplatky",
            icon: "DollarSign",
            colorScheme: "gray",
            filter: {
              nameKeywords: ["DAX"],
              excludeNameKeywords: ["MDAX", "Leveraged", "2x", "3x", "TecDAX", "DivDAX", "LevDAX", "ShortDAX"],
              excludeLeveraged: true,
              sortBy: "ter_numeric",
              sortOrder: "asc",
              top: 10,
              minFundSize: 100
            }
          },
          {
            title: "🏢 TOP 10 DAX ETF podle velikosti fondu",
            description: "Největší a nejlikvidnější DAX ETF na trhu",
            icon: "Building",
            colorScheme: "slate", 
            filter: {
              nameKeywords: ["DAX"],
              excludeNameKeywords: ["MDAX", "Leveraged", "2x", "3x", "TecDAX", "DivDAX", "LevDAX", "ShortDAX"],
              excludeLeveraged: true,
              sortBy: "fund_size_numeric",
              sortOrder: "desc", 
              top: 10,
              minFundSize: 100
            }
          },
          {
            title: "📈 TOP 10 DAX ETF podle výkonu 1Y",
            description: "Nejlépe performující DAX ETF za poslední rok",
            icon: "TrendingUp",
            colorScheme: "zinc",
            filter: {
              nameKeywords: ["DAX"],
              excludeNameKeywords: ["MDAX", "Leveraged", "2x", "3x", "TecDAX", "DivDAX", "LevDAX", "ShortDAX"],
              excludeLeveraged: true,
              sortBy: "return_1y",
              sortOrder: "desc",
              top: 10,
              minFundSize: 100
            }
          }
        ]}
      />

      {/* Selection Guide */}
      <section id="pruvodce" className="py-20 bg-gradient-to-br from-gray-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-600 to-slate-600 rounded-full mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              💡 Jak vybrat ten správný DAX ETF?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                number: "1",
                title: "Pro začátečníky",
                description: "Vyberte ETF s nejnižšími poplatky a velkou velikostí fondu. Zaměřte se na standardní DAX tracking bez ESG filtrů pro nejlepší replikaci indexu.",
                color: "from-green-400 to-emerald-500",
                bgColor: "from-green-50 to-emerald-50",
                borderColor: "border-green-200"
              },
              {
                number: "2", 
                title: "Pro pokročilé",
                description: "Porovnejte physical vs synthetic replikaci podle vašich preferencí. Sledujte tracking difference a spread podle objemu obchodování.",
                color: "from-blue-400 to-blue-500",
                bgColor: "from-blue-50 to-blue-50",
                borderColor: "border-blue-200"
              },
              {
                number: "3",
                title: "Pro ESG investory", 
                description: "Zvažte ESG-filtrované verze DAX indexu, které vylučují kontroverzní sektory při zachování expozice na německou ekonomiku.",
                color: "from-purple-400 to-purple-500",
                bgColor: "from-purple-50 to-purple-50", 
                borderColor: "border-purple-200"
              },
              {
                number: "4",
                title: "Pro diverzifikaci",
                description: "DAX ETF jsou ideální doplněk k širším evropským nebo globálním ETF. Přidávají specifickou expozici k německému průmyslu.",
                color: "from-orange-400 to-orange-500",
                bgColor: "from-orange-50 to-orange-50",
                borderColor: "border-orange-200"
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
                question: "Jak jste vybrali TOP 3 DAX ETF?",
                answer: "Výběr je založen na kombinaci faktorů: nejnižší poplatky TER, velikost fondu, likvidita, tracking error a celková kvalita providera. Data čerpáme z naší databáze a aktualizujeme měsíčně."
              },
              {
                question: "Co znamenají TOP 10 žebříčky na této stránce?",
                answer: "Žebříčky ukazují nejlepší DAX ETF podle různých kritérií - nejnižší poplatky, největší velikost fondu a nejvyšší výnosy za poslední rok. Data jsou živá z naší databáze."
              },
              {
                question: "Proč se některé DAX ETF neobjevují v seznamech?",
                answer: "Odfiltrováváme malé fondy (pod 100 mil EUR), pákové produkty, tematické a sektorové ETF. Zaměřujeme se pouze na kvalitní ETF sledující široký DAX index."
              },
              {
                question: "Jaký je rozdíl mezi DAX 30 a DAX 40?",
                answer: "Od září 2021 byl DAX rozšířen z 30 na 40 společností pro lepší reprezentaci německé ekonomiky. Nový DAX 40 zahrnuje více technologických a mid-cap firem."
              },
              {
                question: "Který DAX ETF má nejnižší náklady?",
                answer: "Nejnižší TER mají naše TOP 3 doporučení: Amundi Core DAX ETF (LU2611732046) s TER 0,08%, Xtrackers DAX UCITS ETF (LU0274211480) s TER 0,09% a iShares Core DAX ETF (DE0005933931) s TER 0,20%. Kompletní žebříček najdete v sekci 'Top 10 podle nejnižších poplatků'."
              },
              {
                question: "Jsou data na této stránce aktuální?",
                answer: "Ano, všechna data o ETF (TER, velikost fondů, výnosy) se načítají živě z naší databáze a jsou aktualizována denně. Poslední aktualizace článku byla provedena na začátku tohoto měsíce."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-gray-100 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-gray-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <section className="py-20 bg-gradient-to-r from-gray-600 to-slate-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Připraveni investovat do DAX ETF?
          </h2>
          <p className="text-xl text-gray-100 mb-8 leading-relaxed">
            Vyberte si brokera a začněte budovat své německé portfolio ještě dnes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-gray-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
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
              className="border-2 border-white text-white hover:bg-white hover:text-gray-600 px-8 py-4 text-lg font-semibold"
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
        className="bg-gray-50"
      />
    </Layout>
  );
}