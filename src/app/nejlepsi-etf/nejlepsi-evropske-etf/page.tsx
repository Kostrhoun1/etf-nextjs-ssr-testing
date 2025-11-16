import React from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { Star, BarChart3, Target, MapPin, Crown, Landmark , DollarSign, Rocket, Zap, Users, Flag, Shield} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import type { Metadata } from 'next';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// Top 3 doporučené evropské ETF - editoriální výběr s live daty z databáze
const TOP_3_EUROPEAN_ETFS_TEMPLATE = [
  {
    name: "Amundi Core Stoxx Europe 600 UCITS ETF Acc",
    ticker: "LYP6",
    isin: "LU0908500753",
    provider: "Amundi ETF",
    degiroFree: false,
    reason: "Rekordně nízký TER pouze 0,07% a největší evropský ETF s 13+ mld. EUR. Nejlepší volba pro nákladově uvědomělé investory.",
  },
  {
    name: "iShares Core MSCI Europe UCITS ETF EUR (Acc)", 
    ticker: "SMEA",
    isin: "IE00B4K48X80",
    provider: "iShares",
    degiroFree: false,
    reason: "Druhý největší evropský ETF s 12+ mld. EUR a TER 0,12%. Osvědčená volba s vynikající likviditou.",
  },
  {
    name: "Vanguard FTSE Developed Europe UCITS ETF Distributing",
    ticker: "VERX",
    isin: "IE00B945VV12", 
    provider: "Vanguard",
    degiroFree: false,
    reason: "Vanguard kvalita s TER 0,10% a distribucí dividend. Ideální pro investory preferující pravidelné výplaty.",
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

  const title = `Nejlepší evropské ETF ${currentYear} - LYP6 vs SMEA vs VERX | ETF průvodce.cz`;
  const description = `✅ Srovnání nejlepších evropských ETF ${currentYear}. LYP6, SMEA, VERX - STOXX 600 vs MSCI Europe vs FTSE, poplatky TER, výnosy. Aktuální data k ${currentDate}.`;
  const canonical = 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-evropske-etf';
  const ogImage = 'https://www.etfpruvodce.cz/og-evropske-etf.jpg';
  
  // SEO optimalizované datum - updated pouze jednou za měsíc
  const lastModified = new Date(new Date().getMonth(), 1).toISOString();
  const publishedDate = `${currentYear}-01-22`;
  
  // Enhanced keywords for better discoverability
  const keywords = [
    `nejlepší evropské ETF ${currentYear}`,
    'LYP6 ETF recenze',
    'SMEA ETF analýza',
    'VERX ETF porovnání', 
    'STOXX Europe 600 ETF',
    'MSCI Europe ETF srovnání',
    'FTSE Developed Europe ETF',
    'evropské akcie investice',
    'Amundi Core STOXX',
    'iShares Core MSCI Europe',
    'Vanguard Europe ETF',
    'nejlevnější evropské ETF',
    'největší evropské ETF',
    'ETF TER poplatky Evropa',
    'developed Europe markets',
    'evropská diverzifikace'
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
        "name": "Evropské ETF",
        "description": "Exchange-traded funds tracking European stock market indices"
      },
      {
        "@type": "FinancialProduct",
        "name": "Amundi Core Stoxx Europe 600 UCITS ETF",
        "identifier": "LU0908500753"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Core MSCI Europe UCITS ETF", 
        "identifier": "IE00B4K48X80"
      },
      {
        "@type": "FinancialProduct",
        "name": "Vanguard FTSE Developed Europe UCITS ETF",
        "identifier": "IE00B945VV12"
      }
    ],
    "mentions": [
      {
        "@type": "Organization",
        "name": "Amundi ETF",
        "description": "Leading European ETF provider"
      },
      {
        "@type": "Organization", 
        "name": "iShares",
        "description": "ETF provider by BlackRock"
      },
      {
        "@type": "Organization",
        "name": "Vanguard",
        "description": "Leading low-cost ETF provider" 
      },
      {
        "@type": "Thing",
        "name": "STOXX Europe 600",
        "description": "European stock market index covering 600 companies from 17 countries"
      },
      {
        "@type": "Thing",
        "name": "MSCI Europe", 
        "description": "European stock market index covering large and mid-cap securities across 15 developed European countries"
      }
    ]
  };
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage", 
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi STOXX 600 a MSCI Europe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "STOXX Europe 600 pokrývá 600 společností ze 17 evropských zemí včetně UK. MSCI Europe má ~430 společností z 15 zemí bez UK. STOXX je širší a zahrnuje více small-cap akcií."
        }
      },
      {
        "@type": "Question", 
        "name": "Který evropský ETF má nejnižší poplatky?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Amundi Core STOXX Europe 600 (LYP6) má nejnižší TER pouze 0,07%. Následují Vanguard FTSE Developed Europe s 0,10% a iShares Core MSCI Europe s 0,12%."
        }
      },
      {
        "@type": "Question",
        "name": "Zahrnují evropské ETF britské akcie?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "STOXX Europe 600 zahrnuje britské akcie (~20%). MSCI Europe a FTSE Developed Europe britské akcie nevyžadují kvůli Brexitu. Záleží na konkrétním indexu."
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
        "name": "Nejlepší evropské ETF",
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
          alt: 'Nejlepší evropské ETF - srovnání LYP6 vs SMEA vs VERX'
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

export default async function NejlepsiEvropskeETFPage() {
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
      title: "Nejlepší světové ETF",
      description: "Globální ETF zahrnující i evropské trhy", 
      href: "/nejlepsi-etf/nejlepsi-celosvetove-etf",
      category: "Regionální ETF"
    },
    {
      title: "Nejlepší S&P 500 ETF", 
      description: "Americké blue chip ETF pro porovnání",
      href: "/nejlepsi-etf/nejlepsi-sp500-etf",
      category: "Regionální ETF"
    },
    {
      title: "Kde koupit evropské ETF",
      description: "Srovnání brokerů pro evropské investice",
      href: "/kde-koupit-etf", 
      category: "Praktické tipy"
    },
    {
      title: "Portfolio strategie s evropskými ETF",
      description: "Jak začlenit Evropu do portfolia",
      href: "/portfolio-strategie",
      category: "Investiční strategie"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-blue-50/50"></div>
        
        {/* Animated blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-purple-200/50">
                <Flag className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  evropské ETF
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
                Kompletní srovnání nejlepších evropských ETF fondů. STOXX 600 vs MSCI Europe analýza, poplatky, výnosy a praktické tipy pro investice do Evropy.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#top3">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-semibold"
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
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-purple-50/60 backdrop-blur-sm rounded-3xl shadow-2xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/80 to-purple-50/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🇪🇺 Evropské ETF Stats</h3>
                  <p className="text-gray-600">Klíčové informace o evropských indexech</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-1">600</div>
                    <div className="text-sm text-gray-600">Firem STOXX 600</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">17</div>
                    <div className="text-sm text-gray-600">Evropských zemí</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-1">~8%</div>
                    <div className="text-sm text-gray-600">Ročně za 20 let</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-50 rounded-xl border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-1">20%</div>
                    <div className="text-sm text-gray-600">Podíl Británie</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-6 border-t border-purple-200/50">
                  <p className="text-sm text-gray-600 mb-3">Stabilní vyspělé trhy</p>
                  <Link href="#pruvodce">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border border-purple-200 text-purple-600 hover:bg-purple-50"
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
              Co jsou evropské ETF?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Evropské ETF sledují akciové indexy vyspělých evropských trhů jako STOXX Europe 600, MSCI Europe nebo FTSE Developed Europe. 
              Poskytují expozici k etablovaným evropským společnostem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Crown,
                title: "Vyspělé evropské trhy",
                description: "Evropské ETF pokrývají stabilní vyspělé ekonomiky včetně Německa, Francie, Nizozemska, Švýcarska a dalších evropských zemí.",
                color: "from-purple-500 to-indigo-600",
                delay: "0.2s"
              },
              {
                icon: MapPin,
                title: "Tři hlavní indexy",
                description: "STOXX Europe 600 (600 firem, 17 zemí), MSCI Europe (~430 firem, 15 zemí) a FTSE Developed Europe s různým pokrytiem.",
                color: "from-indigo-500 to-blue-600",
                delay: "0.3s"
              },
              {
                icon: Landmark,
                title: "Stabilní dividendy",
                description: "Evropské společnosti jsou známé pravidelným vyplácením dividend. Mnoho evropských ETF nabízí distribuční varianty.",
                color: "from-blue-500 to-purple-600",
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
        title="🏆 Top 3 nejlepší evropské ETF"
        description="Naše doporučení na základě analýzy všech dostupných evropských ETF"
        etfTemplates={TOP_3_EUROPEAN_ETFS_TEMPLATE}
        colorScheme="purple"
      />

      {/* Top 10 Database Sections */}
      <FilteredETFSections 
        sectionId="srovnani"
        sections={[
          {
            title: "💰 TOP 10 evropských ETF podle TER",
            description: "Nejlevnější evropské ETF s nejnižšími ročními poplatky",
            icon: "DollarSign",
            colorScheme: "purple",
            filter: {
              nameKeywords: ["Europe", "STOXX", "European"],
              excludeNameKeywords: ["Leveraged", "2x", "3x", "Short", "Bear", "Sector", "Value", "Growth", "Quality", "Small Cap", "ESG", "SRI", "Enhanced", "Volatility", "Dividend", "Factor", "Mining", "Gold", "Silver", "Crypto", "Bitcoin", "Blockchain", "Energy", "Water", "Aerospace", "Defence", "Defense", "Climate", "Technology", "Healthcare", "Financials", "Utilities", "Materials", "Consumer", "Industrials", "Bond", "Government", "Semiconductors", "Software", "Banks", "Insurance", "REIT", "Infrastructure", "Biotech", "Pharmaceutical"],
              excludeLeveraged: true,
              sortBy: "ter_numeric",
              sortOrder: "asc",
              top: 10,
              minFundSize: 500
            }
          },
          {
            title: "🏢 TOP 10 evropských ETF podle velikosti fondu",
            description: "Největší a nejlikvidnější evropské ETF na trhu",
            icon: "Building",
            colorScheme: "indigo", 
            filter: {
              nameKeywords: ["Europe", "STOXX", "European"],
              excludeNameKeywords: ["Leveraged", "2x", "3x", "Short", "Bear", "Sector", "Value", "Growth", "Quality", "Small Cap", "ESG", "SRI", "Enhanced", "Volatility", "Dividend", "Factor", "Mining", "Gold", "Silver", "Crypto", "Bitcoin", "Blockchain", "Energy", "Water", "Aerospace", "Defence", "Defense", "Climate", "Technology", "Healthcare", "Financials", "Utilities", "Materials", "Consumer", "Industrials", "Bond", "Government", "Semiconductors", "Software", "Banks", "Insurance", "REIT", "Infrastructure", "Biotech", "Pharmaceutical"],
              excludeLeveraged: true,
              sortBy: "fund_size_numeric",
              sortOrder: "desc", 
              top: 10,
              minFundSize: 500
            }
          },
          {
            title: "📈 TOP 10 evropských ETF podle výkonu 1Y",
            description: "Nejlépe performující evropské ETF za poslední rok",
            icon: "TrendingUp",
            colorScheme: "blue",
            filter: {
              nameKeywords: ["Europe", "STOXX", "European"],
              excludeNameKeywords: ["Leveraged", "2x", "3x", "Short", "Bear", "Sector", "Value", "Growth", "Quality", "Small Cap", "ESG", "SRI", "Enhanced", "Volatility", "Dividend", "Factor", "Mining", "Gold", "Silver", "Crypto", "Bitcoin", "Blockchain", "Energy", "Water", "Aerospace", "Defence", "Defense", "Climate", "Technology", "Healthcare", "Financials", "Utilities", "Materials", "Consumer", "Industrials", "Bond", "Government", "Semiconductors", "Software", "Banks", "Insurance", "REIT", "Infrastructure", "Biotech", "Pharmaceutical"],
              excludeLeveraged: true,
              sortBy: "return_1y",
              sortOrder: "desc",
              top: 10,
              minFundSize: 500
            }
          }
        ]}
      />

      {/* Selection Guide */}
      <section id="pruvodce" className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              💡 Jak vybrat správný evropský ETF?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                number: "1",
                title: "STOXX 600 vs MSCI Europe",
                description: "STOXX Europe 600 = širší pokrytí (600 firem ze 17 zemí včetně UK). MSCI Europe = ~430 firem z 15 zemí bez UK. Pro začátečníky STOXX 600.",
                color: "from-purple-400 to-purple-500",
                bgColor: "from-purple-50 to-purple-50",
                borderColor: "border-purple-200"
              },
              {
                number: "2", 
                title: "Sledujte TER a velikost",
                description: "Ideální TER 0,07-0,20%. Velikost fondu min. 3 mld. EUR. Amundi má nejnižší TER 0,07%, iShares největší velikost fondů.",
                color: "from-indigo-400 to-indigo-500",
                bgColor: "from-indigo-50 to-indigo-50",
                borderColor: "border-indigo-200"
              },
              {
                number: "3",
                title: "Accumulating vs Distributing", 
                description: "ACC = reinvestuje dividendy. DIST = vyplácí dividendy (evropské firmy mají stabilní dividendy). Pro spoření ACC, pro příjem DIST.",
                color: "from-blue-400 to-blue-500",
                bgColor: "from-blue-50 to-blue-50", 
                borderColor: "border-blue-200"
              },
              {
                number: "4",
                title: "Měnové zajištění EUR",
                description: "Standardní evropské ETF jsou v EUR nebo USD. EUR verze eliminují měnové riziko pro české investory. USD verze mají vyšší likviditu.",
                color: "from-purple-400 to-blue-500",
                bgColor: "from-purple-50 to-blue-50",
                borderColor: "border-purple-200"
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
                question: "Jaké jsou nejlepší evropské ETF v roce 2025?",
                answer: "Naše TOP 3 doporučení: Amundi Core Stoxx Europe 600 UCITS ETF (LYP6, LU0908500753) s rekordně nízkým TER 0,07% a velikostí 13+ mld. EUR, iShares Core MSCI Europe UCITS ETF (SMEA, IE00B4K48X80) s 12+ mld. EUR a TER 0,12%, a Vanguard FTSE Developed Europe UCITS ETF (VERX, IE00B945VV12) s TER 0,10% a distribucí dividend."
              },
              {
                question: "Jaký je rozdíl mezi STOXX Europe 600 a MSCI Europe?",
                answer: "STOXX Europe 600 pokrývá 600 společností ze 17 evropských zemí včetně Británie (~20% podíl). MSCI Europe má ~430 společností z 15 zemí bez Británie. STOXX je širší a zahrnuje více small-cap akcií."
              },
              {
                question: "Který evropský ETF má nejnižší poplatky?",
                answer: "Amundi Core STOXX Europe 600 (LYP6, LU0908500753) má nejnižší TER pouze 0,07%. Následuje Vanguard FTSE Developed Europe (VERX, IE00B945VV12) s 0,10% a iShares Core MSCI Europe (SMEA, IE00B4K48X80) s 0,12%. Všechny naše TOP 3 ETF mají velmi kompetitivní poplatky."
              },
              {
                question: "Zahrnují evropské ETF britské akcie?",
                answer: "Záleží na indexu. STOXX Europe 600 zahrnuje britské akcie (~20% podíl). MSCI Europe a FTSE Developed Europe většinou britské akcie nevyžadují kvůli Brexitu. Vždy zkontrolujte složení indexu."
              },
              {
                question: "Jsou evropské ETF vhodné pro české investory?",
                answer: "Ano, evropské ETF jsou ideální pro české investory. Poskytují expozici k vyspělým evropským trhům s měnovou stabilitou a často EUR denominací, což snižuje měnové riziko."
              },
              {
                question: "Jaké jsou historické výnosy evropských ETF?",
                answer: "Evropské akcie dosáhly průměrného ročního výnosu ~8% za posledních 20 let. Konkrétní aktuální výnosy najdete v našem žebříčku 'Top 10 podle výkonu 1Y'."
              },
              {
                question: "Jsou data o evropských ETF aktuální?",
                answer: "Ano, všechna data o evropských ETF se načítají živě z naší databáze a jsou aktualizována denně. Žebříčky TOP 10 podle TER, velikosti a výkonu ukazují nejčerstvější informace."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-purple-50 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-purple-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Připraveni investovat do evropských ETF?
          </h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Vyberte si brokera a začněte budovat své evropské portfolio ještě dnes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
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
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold"
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
        className="bg-purple-50"
      />
    </Layout>
  );
}