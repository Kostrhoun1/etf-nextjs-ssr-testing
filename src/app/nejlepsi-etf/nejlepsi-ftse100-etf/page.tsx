import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, ArrowRightIcon, TargetIcon, MapPinIcon, CrownIcon, LandmarkIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, TrendingUpIcon, BuildingIcon, ShieldIcon, GlobeIcon, AwardIcon, FlagIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Top 3 skutečné FTSE ETF z databáze
const TOP_3_FTSE_ETFS_TEMPLATE = [
  {
    name: "iShares Core FTSE 100 UCITS ETF EUR Hedged (Acc)",
    ticker: "CUKX",
    isin: "IE000HARJEE2",
    provider: "iShares",
    degiroFree: false,
    reason: "Nejnižší TER pouze 0,10% s měnovým zajištěním EUR. Ideální pro české investory hledající expozici na britské blue chip společnosti bez měnového rizika.",
  },
  {
    name: "iShares Core FTSE 100 UCITS ETF GBP (Dist)",
    ticker: "ISF",
    isin: "IE0005042456", 
    provider: "iShares",
    degiroFree: false,
    reason: "Největší a nejlikvidnější FTSE 100 ETF s distribucí dividend v GBP. Výborná volba pro investory preferující pravidelné dividendové výnosy.",
  },
  {
    name: "iShares FTSE 250 UCITS ETF",
    ticker: "MIDD",
    isin: "IE00B00FV128",
    provider: "iShares",
    degiroFree: false,
    reason: "Širší pokrytí britského trhu včetně mid-cap společností. Ideální pro diverzifikaci napříč britskými akcemi různých velikostí.",
  }
];

// Generate enhanced metadata for FTSE ETF comparison page
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // SEO optimalizované datum - updated pouze jednou za měsíc
  const lastModified = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const publishedDate = `${currentYear}-01-20`;
  
  const title = `Nejlepší FTSE ETF ${currentYear} - VUKE vs ISF vs FTAL`;
  const description = `✅ Srovnání nejlepších FTSE ETF ${currentYear}. VUKE, ISF, FTAL - britské akcie, poplatky TER, výnosy. Kompletní analýza FTSE 100 a UK All Share k ${currentDate}.`;
  const canonical = 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-ftse100-etf';
  const ogImage = 'https://www.etfpruvodce.cz/og-ftse-etf.jpg';
  
  // Enhanced keywords for better discoverability
  const keywords = [
    `nejlepší FTSE ETF ${currentYear}`,
    'VUKE ETF recenze',
    'ISF ETF analýza',
    'FTAL ETF porovnání',
    'FTSE 100 ETF srovnání',
    'britské akcie investice',
    'Vanguard FTSE 100',
    'iShares Core FTSE',
    'SPDR UK All Share',
    'UK trhy diverzifikace',
    'nejlevnější britské ETF',
    'největší FTSE ETF',
    'ETF TER poplatky UK',
    'developed UK markets',
    'FTSE indexy tracking'
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
        "name": "FTSE ETF",
        "description": "Exchange-traded funds tracking FTSE indices covering British stock markets"
      },
      {
        "@type": "FinancialProduct",
        "name": "Vanguard FTSE 100 UCITS ETF",
        "identifier": "GB00B810X939"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Core FTSE 100 UCITS ETF", 
        "identifier": "IE00B53L3W79"
      }
    ],
    "mentions": [
      {
        "@type": "Organization",
        "name": "Vanguard",
        "description": "Leading low-cost ETF provider"
      },
      {
        "@type": "Organization", 
        "name": "iShares",
        "description": "ETF provider by BlackRock"
      },
      {
        "@type": "Organization",
        "name": "SPDR",
        "description": "ETF provider by State Street Global Advisors" 
      },
      {
        "@type": "Thing",
        "name": "FTSE 100",
        "description": "UK stock market index covering 100 largest British companies"
      }
    ]
  };
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage", 
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jak jste vybrali TOP 3 nejlepší FTSE ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Náš výběr je založen na kombinaci faktorů: nejnižší poplatky TER, velikost fondu, likvidita, tracking error a celková kvalita providera. Data čerpáme z naší databáze a aktualizujeme měsíčně."
        }
      },
      {
        "@type": "Question", 
        "name": "Jaký je rozdíl mezi FTSE 100 a FTSE All Share?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FTSE 100 pokrývá 100 největších britských společností, zatímco FTSE All Share zahrnuje prakticky celý britský trh včetně mid a small cap akcií. All Share nabízí širší diverzifikaci, ale FTSE 100 má větší likviditu."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do FTSE ETF místo globálních?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FTSE ETF umožňují cílenou expozici k britskému trhu a jeho specifickým sektorům jako je těžba, banky a REIT. Jsou ideální jako doplněk k evropským nebo globálním ETF pro lepší geografickou diverzifikaci."
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
        "name": "Nejlepší FTSE 100 ETF",
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
          alt: 'Nejlepší FTSE ETF - srovnání VUKE vs ISF vs FTAL'
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

export default async function NejlepsiFTSEETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-ftse100-etf'];
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
  
  const relatedLinks = [
    {
      title: "Nejlepší evropské ETF",
      description: "Kompletní srovnání evropských ETF fondů",
      href: "/nejlepsi-etf/nejlepsi-evropske-etf",
      category: "Regionální ETF"
    },
    {
      title: "Nejlepší DAX ETF", 
      description: "Německé blue chip ETF na DAX index",
      href: "/nejlepsi-etf/nejlepsi-dax-etf",
      category: "Regionální ETF"
    },
    {
      title: "Kde koupit FTSE ETF",
      description: "Srovnání brokerů pro investice do britských ETF",
      href: "/kde-koupit-etf", 
      category: "Praktické tipy"
    },
    {
      title: "Portfolio strategie s FTSE ETF",
      description: "Jak sestavit portfolio s britskými ETF",
      href: "/portfolio-strategie",
      category: "Investiční strategie"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-orange-50/30 to-yellow-50/50"></div>
        
        {/* Animated blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-red-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-red-200/50">
                <FlagIcon className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  FTSE ETF
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
                Kompletní srovnání nejlepších ETF fondů na FTSE indexy. Analýza poplatků, výnosů a praktické tipy pro investice do britských akcií.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#top3">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <StarFilledIcon className="w-5 h-5 mr-2" />
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
                    <BarChart3Icon className="w-5 h-5 mr-2" />
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🇬🇧 FTSE Stats</h3>
                  <p className="text-gray-600">Klíčové informace o britských indexech</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                    <div className="text-3xl font-bold text-red-600 mb-1">100</div>
                    <div className="text-sm text-gray-600">Firem FTSE 100</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                    <div className="text-3xl font-bold text-orange-600 mb-1">~6%</div>
                    <div className="text-sm text-gray-600">Ročně za 20 let</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">80%</div>
                    <div className="text-sm text-gray-600">UK tržní cap</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <div className="text-3xl font-bold text-amber-600 mb-1">10</div>
                    <div className="text-sm text-gray-600">ETF na výběr</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-6 border-t border-gray-200/50">
                  <p className="text-sm text-gray-600 mb-3">Největší britské společnosti</p>
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
              Co jsou FTSE indexy?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              FTSE indexy sledují britský akciový trh a zahrnují největší společnosti jako Shell, BP, AstraZeneca, ASML a další. 
              Představují klíčovou část evropské diverzifikace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: CrownIcon,
                title: "100 největších firem UK",
                description: "FTSE 100 pokrývá největší britské společnosti z různých sektorů - od bank přes těžbu až po technologie.",
                color: "from-red-500 to-orange-600",
                delay: "0.2s"
              },
              {
                icon: MapPinIcon,
                title: "Globální britské firmy",
                description: "Mnoho společností v FTSE má globální působnost - Shell, BP, Vodafone, British American Tobacco.",
                color: "from-orange-500 to-yellow-600",
                delay: "0.3s"
              },
              {
                icon: LandmarkIcon,
                title: "80% britského trhu",
                description: "FTSE 100 reprezentuje přibližně 80% celkové tržní kapitalizace britských akcií.",
                color: "from-yellow-500 to-amber-600",
                delay: "0.4s"
              }
            ].map((item, index) => (
              <div key={index} className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: item.delay}}>
                <div className={`flex items-center justify-center rounded-full bg-gradient-to-r ${item.color} w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-red-800 transition-colors">
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
      

      {/* Top 10 Database Sections */}
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
          <Top3ETFServer etfs={etfs} currency="CZK" />
        </div>
      </section>

      {/* Top 10 Database Sections */}
      <Top10SectionsServer etfs={etfs} currency="CZK" categoryName="FTSE 100" />

      {/* Selection Guide */}
      <section id="pruvodce" className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-full mb-6">
              <TargetIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              💡 Jak vybrat ten správný FTSE ETF?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                number: "1",
                title: "Pro začátečníky",
                description: "Začněte s největším FTSE 100 ETF od renomovaného providera. Preferujte akumulační verze s automatickou reinvesticí dividend.",
                color: "from-green-400 to-emerald-500",
                bgColor: "from-green-50 to-emerald-50",
                borderColor: "border-green-200"
              },
              {
                number: "2", 
                title: "Pro pokročilé",
                description: "Porovnejte FTSE 100 vs FTSE All Share podle vašich preferencí. All Share nabízí širší diverzifikaci, ale FTSE 100 má vyšší likviditu.",
                color: "from-blue-400 to-blue-500",
                bgColor: "from-blue-50 to-blue-50",
                borderColor: "border-blue-200"
              },
              {
                number: "3",
                title: "Pro diverzifikaci", 
                description: "FTSE ETF jsou ideální doplněk k evropským nebo americkým ETF. Přidávají expozici k unikátním britským sektorům.",
                color: "from-purple-400 to-purple-500",
                bgColor: "from-purple-50 to-purple-50", 
                borderColor: "border-purple-200"
              },
              {
                number: "4",
                title: "Pro minimalizaci nákladů",
                description: "Vanguard obvykle nabízí nejnižší TER. Porovnejte také tracking error a spread podle objemu vašich investic.",
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
                question: "Jak jste vybrali TOP 3 FTSE ETF?",
                answer: "Výběr je založen na kombinaci faktorů: nejnižší poplatky TER, velikost fondu, likvidita, tracking error a celková kvalita providera. Data čerpáme z naší databáze a aktualizujeme měsíčně."
              },
              {
                question: "Co znamenají TOP 10 žebříčky na této stránce?",
                answer: "Žebříčky ukazují nejlepší FTSE ETF podle různých kritérií - nejnižší poplatky, největší velikost fondu a nejvyšší výnosy za poslední rok. Data jsou živá z naší databáze."
              },
              {
                question: "Proč se některé FTSE ETF neobjevují v seznamech?",
                answer: "Odfiltrováváme malé fondy (pod 100 mil EUR), pákové produkty, tematické a sektorové ETF. Zaměřujeme se pouze na kvalitní široko-britské ETF sledující hlavní FTSE indexy."
              },
              {
                question: "Jaký je rozdíl mezi FTSE 100 a FTSE All Share?",
                answer: "FTSE 100 pokrývá 100 největších britských společností, zatímco FTSE All Share zahrnuje prakticky celý britský trh. All Share nabízí širší diverzifikaci, ale FTSE 100 má větší likviditu."
              },
              {
                question: "Který FTSE ETF má nejnižší náklady?",
                answer: "Podle aktuálních dat má nejnižší TER obvykle Vanguard ETF. Kompletní žebříček najdete v sekci 'Top 10 podle nejnižších poplatků' s živými daty z naší databáze."
              },
              {
                question: "Jsou data na této stránce aktuální?",
                answer: "Ano, všechna data o ETF (TER, velikost fondů, výnosy) se načítají živě z naší databáze a jsou aktualizována denně. Poslední aktualizace článku byla provedena na začátku tohoto měsíce."
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
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Připraveni investovat do FTSE ETF?
          </h2>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            Vyberte si brokera a začněte budovat své britské portfolio ještě dnes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link href="/kde-koupit-etf">
                <ShieldIcon className="w-5 h-5 mr-2" />
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
                <BarChart3Icon className="w-5 h-5 mr-2" />
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