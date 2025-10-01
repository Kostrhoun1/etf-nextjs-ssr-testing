import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Star, BarChart3, Target, Brain, Activity , DollarSign, Rocket, Zap, Users, TrendingUp} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import type { Metadata } from 'next';

// Top 3 doporučené Growth ETF - editoriální výběr s live daty z databáze
const TOP_3_GROWTH_ETFS_TEMPLATE = [
  {
    name: "Amundi Russell 1000 Growth UCITS ETF",
    ticker: "RS1G", 
    isin: "IE0005E8B9S4",
    provider: "Amundi ETF",
    degiroFree: false,
    reason: "Největší pure growth factor ETF s 569 mil. EUR a TER 0,19%. Sleduje Russell 1000 Growth index s high-growth americkými akciemi.",
  },
  {
    name: "iShares Russell 1000 Growth UCITS ETF",
    ticker: "IUSG",
    isin: "IE000NITTFF2",
    provider: "iShares",
    degiroFree: false,
    reason: "Druhý největší Russell Growth ETF s 414 mil. EUR a solidní TER. Zaměření na velké US growth společnosti s vysokým růstovým potenciálem.",
  },
  {
    name: "JPMorgan Active US Growth UCITS ETF",
    ticker: "JGRO", 
    isin: "IE0005CH3U28",
    provider: "JPMorgan",
    degiroFree: false,
    reason: "Aktivně řízený growth ETF s 337 mil. EUR. Profesionální stock picking zaměřený na high-quality growth akcie s dlouhodobým potenciálem.",
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
    title: `Nejlepší Growth ETF ${currentYear} - růstové faktory a growth investing | ETF průvodce.cz`,
    description: `✅ Srovnání nejlepších Growth ETF ${currentYear}. Russell Growth, růstové faktory, growth akcie - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'Growth ETF',
      'růstové akcie ETF',
      `nejlepší Growth ETF ${currentYear}`,
      'NASDAQ ETF QQQ',
      'technologie ETF', 
      'growth investing ETF',
      'momentum factor ETF',
      'Invesco QQQ',
      'iShares IWMO',
      'Xtrackers XMUG',
      'high growth ETF',
      'tech growth ETF',
      'růst tržeb ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší Growth ETF ${currentYear} - růstové faktory a growth investing`,
      description: `Srovnání nejlepších Growth ETF ${currentYear}. Russell Growth, růstové faktory, growth akcie - TER, velikost fondů.`,
      type: 'article',
      locale: 'cs_CZ',
      siteName: 'ETF Průvodce',
      images: [
        {
          url: '/og-growth-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší Growth ETF ${currentYear} - průvodce a porovnání`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší Growth ETF ${currentYear} - růstové faktory a growth investing`,
      description: `Srovnání nejlepších Growth ETF ${currentYear}. Russell Growth, růstové faktory, growth akcie - TER, velikost fondů.`,
      images: ['/og-growth-etf.jpg']
    },
    alternates: {
      canonical: 'https://etf-pruvodce.cz/nejlepsi-etf/nejlepsi-growth-etf'
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

export default function NejlepsiGrowthETF() {
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
    "headline": `Nejlepší Growth ETF ${currentYear} - NASDAQ, tech růstové akcie`,
    "description": `Srovnání nejlepších Growth ETF ${currentYear}. NASDAQ QQQ, růstové akcie, technologie - TER, velikost fondů.`,
    "image": "https://etfpruvodce.cz/og-growth-etf.jpg",
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
    "datePublished": "2025-01-15",
    "dateModified": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-growth-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "Growth ETF, růstové akcie, Russell Growth, growth investing, growth factor",
    "wordCount": 2700,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Growth ETF",
        "description": "Exchange-traded funds focused on high-growth stocks and companies"
      },
      {
        "@type": "FinancialProduct",
        "name": "Amundi Russell 1000 Growth UCITS ETF",
        "identifier": "IE0005E8B9S4"
      },
      {
        "@type": "FinancialProduct", 
        "name": "iShares Russell 1000 Growth UCITS ETF",
        "identifier": "IE000NITTFF2"
      },
      {
        "@type": "FinancialProduct",
        "name": "JPMorgan Active US Growth UCITS ETF", 
        "identifier": "IE0005CH3U28"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Russell 1000 Growth",
        "description": "Index of large-cap US growth stocks with high growth rates"
      },
      {
        "@type": "Thing", 
        "name": "Growth Investing",
        "description": "Investment strategy focusing on companies with above-average growth rates"
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
        "name": "Jaké jsou nejlepší Growth ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší Growth ETF jsou: Amundi Russell 1000 Growth UCITS ETF (RS1G, IE0005E8B9S4) největší pure growth factor ETF s 569 mil. EUR a TER 0,19%, iShares Russell 1000 Growth UCITS ETF (IUSG, IE000NITTFF2) s 414 mil. EUR, a JPMorgan Active US Growth UCITS ETF (JGRO, IE0005CH3U28) aktivně řízený growth ETF s 337 mil. EUR."
        }
      },
      {
        "@type": "Question", 
        "name": "Co je Growth investing a jak fungují Growth ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Growth investing je strategie zaměřená na společnosti s nadprůměrným růstem tržeb, zisku a cash flow. Growth ETF automaticky vybírají akcie s vysokými růstovými metrikami, často z technologického sektoru. Mají vyšší potenciál výnosů, ale i vyšší volatilitu než value nebo dividendové ETF."
        }
      },
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi Growth a Value ETF?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Growth ETF investují do rychle rostoucích společností s vysokými oceněními (P/E, P/B) a reinvestují zisky do růstu. Value ETF se zaměřují na podhodnocené akcie s nízkými poměry a často vyšší dividendy. Growth má historicky vyšší volatilitu, ale i vyšší potenciál výnosů v bull trzích."
        }
      },
      {
        "@type": "Question",
        "name": "Který Growth ETF má nejnižší poplatky?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Amundi Russell 1000 Growth UCITS ETF (RS1G, IE0005E8B9S4) má nejnižší TER pouze 0,19% mezi našimi TOP 3 doporučeními. iShares Russell 1000 Growth (IUSG, IE000NITTFF2) a JPMorgan Active US Growth (JGRO, IE0005CH3U28) mají vyšší poplatky, ale stále konkurenceschopné pro růstové investice."
        }
      },
      {
        "@type": "Question",
        "name": "Jsou Growth ETF vhodné pro začátečníky?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Growth ETF mohou být volatilnější než široké tržní ETF. Pro začátečníky doporučujeme začít s všetržními ETF a Growth ETF používat jako doplněk max 20-30% portfolia. Amundi Russell 1000 Growth (RS1G, IE0005E8B9S4) je dobrý vstupní bod díky diverzifikaci a nízkému TER."
        }
      },
      {
        "@type": "Question",
        "name": "Vyplácejí Growth ETF dividendy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Growth společnosti obvykle nevyplácejí dividendy nebo vyplácejí velmi nízké dividendy, protože reinvestují zisky do růstu. Naše TOP 3 Growth ETF (Amundi Russell Growth - RS1G, iShares Russell Growth - IUSG, JPMorgan Active Growth - JGRO) se zaměřují na kapitálový růst spíše než na dividendové příjmy."
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
        "name": "Nejlepší Growth ETF",
        "item": "https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-growth-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-purple-200/50">
                <Rocket className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Growth ETF
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Kompletní srovnání nejlepších Growth ETF pro investice do rychle rostoucích společností. 
                Russell Growth, growth faktory a fundamentální analýza včetně praktických tipů.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <Link href="#top3">
                    <Star className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <Link href="#srovnani">
                    <Activity className="w-5 h-5 mr-2" />
                    Růstové metriky
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right Content - Growth Stats */}
            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                
                {/* Simple Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                    <Rocket className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Growth investing v číslech
                  </h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro růstové akcie</p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVYŠŠÍ RŮST</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">35%</div>
                    <div className="text-xs text-gray-600">ročně (tech)</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-gray-500 font-medium">RUSSELL GROWTH</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">569M</div>
                    <div className="text-xs text-gray-600">největší growth factor</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">P/E RATIO</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">28x</div>
                    <div className="text-xs text-gray-600">průměr growth</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-gray-500 font-medium">VOLATILITA</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">22%</div>
                    <div className="text-xs text-gray-600">vyšší než market</div>
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
            <div className="flex items-center justify-center rounded-full bg-blue-100 w-20 h-20 mx-auto mb-8 hover:bg-blue-200 transition-colors hover-scale">
              <Rocket className="w-10 h-10 text-blue-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou Growth ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na rychle rostoucí společnosti s vysokým potenciálem růstu tržeb a zisků
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.2s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-purple-800 transition-colors">
                Vysoký růst tržeb
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                ETF vybírají společnosti s nadprůměrným růstem příjmů, často 15-30% ročně, hlavně z tech sektoru.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.3s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-purple-800 transition-colors">
                Inovace a technologie
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Zaměření na inovativní společnosti z oblasti AI, cloudu, biotech a dalších disruptivních odvětví.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.4s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-purple-800 transition-colors">
                Reinvestice zisků
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Společnosti obvykle nevyplácejí dividendy, ale reinvestují zisky do dalšího růstu a expanze.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Top 3 Recommendations - Client Component with Live Data */}
      <Top3ETFLiveSection 
        title="🏆 Top 3 nejlepší Growth ETF"
        description="Naše doporučení na základě analýzy růstových metrik a velikosti fondů"
        etfTemplates={TOP_3_GROWTH_ETFS_TEMPLATE}
        colorScheme="blue"
      />

      {/* Comprehensive ETF Sections */}
      <FilteredETFSections 
        indexKeywords={["Growth"]}
        excludeKeywords={["Value", "Momentum", "Leveraged", "2x", "3x", "Short", "Bear", "Consumer", "NASDAQ", "Technology", "Dividend"]}
      />

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nejčastější otázky
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Odpovědi na časté dotazy ohledně Growth ETF
            </p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Jaké jsou nejlepší Growth ETF v roce 2025?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší Growth ETF jsou: <strong>Amundi Russell 1000 Growth UCITS ETF</strong> (RS1G, IE0005E8B9S4) 
                největší pure growth factor ETF s 569 mil. EUR a TER 0,19%, <strong>iShares Russell 1000 Growth UCITS ETF</strong> (IUSG, IE000NITTFF2) 
                s 414 mil. EUR, a <strong>JPMorgan Active US Growth UCITS ETF</strong> 
                (JGRO, IE0005CH3U28) aktivně řízený growth ETF s 337 mil. EUR.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Co je Growth investing a jak fungují Growth ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Growth investing</strong> je strategie zaměřená na společnosti s nadprůměrným růstem tržeb, zisku a cash flow. 
                Growth ETF automaticky vybírají akcie s vysokými růstovými metrikami pomocí kvantitativních modelů, 
                často z technologického sektoru. Mají vyšší potenciál výnosů, ale i vyšší volatilitu než value nebo dividendové ETF.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Jaký je rozdíl mezi Growth a Value ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Growth ETF</strong> investují do rychle rostoucích společností s vysokými oceněními (P/E, P/B) 
                a reinvestují zisky do růstu namísto dividend. <strong>Value ETF</strong> se zaměřují na podhodnocené akcie 
                s nízkými poměry a často vyšší dividendy. Growth má historicky vyšší volatilitu, ale i vyšší potenciál výnosů 
                v bull trzích, zatímco value může být defensivnější v bear trzích.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Který Growth ETF má nejnižší poplatky?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Amundi Russell 1000 Growth UCITS ETF</strong> (RS1G, IE0005E8B9S4) má nejnižší TER pouze 0,19% mezi našimi TOP 3 doporučeními. 
                iShares Russell 1000 Growth (IUSG, IE000NITTFF2) a JPMorgan Active US Growth (JGRO, IE0005CH3U28) 
                mají vyšší poplatky, ale stále konkurenceschopné pro růstové investice.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Jsou Growth ETF vhodné pro začátečníky?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Growth ETF</strong> mohou být volatilnější než široké tržní ETF. Pro začátečníky doporučujeme začít s všetržními ETF 
                a Growth ETF používat jako doplněk max 20-30% portfolia. <strong>Amundi Russell 1000 Growth</strong> (RS1G, IE0005E8B9S4) 
                je dobrý vstupní bod díky diverzifikaci a nízkému TER.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">Vyplácejí Growth ETF dividendy?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Growth společnosti</strong> obvykle nevyplácejí dividendy nebo vyplácejí velmi nízké dividendy, protože reinvestují zisky do růstu. 
                Naše TOP 3 Growth ETF (Amundi Russell Growth - RS1G, iShares Russell Growth - IUSG, JPMorgan Active Growth - JGRO) 
                se zaměřují na kapitálový růst spíše než na dividendové příjmy.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Linking Component */}
      <InternalLinking 
        currentPage="growth-etf"
        relatedLinks={[
          {
            title: "Nejlepší Value ETF",
            href: "/nejlepsi-etf/nejlepsi-value-etf",
            description: "Kompletní průvodce hodnotovými ETF fondy"
          },
          {
            title: "Nejlepší technologické ETF", 
            href: "/nejlepsi-etf/nejlepsi-technologicke-etf",
            description: "Srovnání nejlepších tech ETF"
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