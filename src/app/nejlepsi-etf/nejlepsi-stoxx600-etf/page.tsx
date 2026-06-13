import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, ArrowRightIcon, TargetIcon, MapPinIcon, CrownIcon, LandmarkIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, FlagIcon, ShieldIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Top 3 doporučené STOXX 600 ETF na základě dat z databáze
const TOP_3_STOXX600_ETFS_TEMPLATE = [
  {
    name: "Amundi Core Stoxx Europe 600 UCITS ETF Acc",
    ticker: "LYP6",
    isin: "LU0908500753",
    provider: "Amundi",
    degiroFree: false,
    reason: "Rekordně nízký TER pouze 0,07% a spolehlivý tracking. Ideální pro dlouhodobé investory hledající nejnižší náklady při expozici na celý evropský trh.",
  },
  {
    name: "iShares STOXX Europe 600 UCITS ETF (DE)",
    ticker: "EXSA",
    isin: "DE0002635307",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší a nejlikvidnější STOXX 600 ETF s objemem obchodování přes 8 mld. EUR. Nejbezpečnější volba pro větší investice do evropských akcií.",
  },
  {
    name: "Xtrackers STOXX Europe 600 UCITS ETF 1C",
    ticker: "XESC",
    isin: "LU0328475792",
    provider: "Xtrackers",
    degiroFree: false,
    reason: "Konkurenceschopný TER 0,20% a kvalitní physical replikace od DWS. Skvělá alternativa pro diversifikaci providerů s dlouhým track record.",
  }
];

// Generate enhanced metadata for STOXX 600 ETF comparison page
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // SEO optimalizované datum - updated pouze jednou za měsíc
  const lastModified = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const publishedDate = `${currentYear}-01-15`;
  
  const title = `Nejlepší STOXX 600 ETF ${currentYear} - LYP6 vs EXSA vs XESC`;
  const description = `✅ Srovnání nejlepších STOXX 600 ETF ${currentYear}. LYP6, EXSA, XESC - poplatky TER, výnosy, velikost fondů. Kompletní analýza evropských ETF k ${currentDate}.`;
  const canonical = 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-stoxx600-etf';
  const ogImage = 'https://www.etfpruvodce.cz/og-stoxx600-etf.jpg';
  
  // Enhanced keywords for better discoverability
  const keywords = [
    `nejlepší STOXX 600 ETF ${currentYear}`,
    'LYP6 ETF recenze',
    'EXSA ETF analýza',
    'XESC ETF srovnání',
    'STOXX Europe 600 porovnání',
    'evropské ETF fondy',
    'Amundi Core Europe',
    'iShares STOXX Europe',
    'Xtrackers Europe 600',
    'evropské akcie investice',
    'STOXX 600 tracking',
    'nejlevnější evropské ETF',
    'největší evropské ETF',
    'ETF TER poplatky Evropa',
    'developed Europe markets'
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
        "name": "STOXX Europe 600 ETF",
        "description": "Exchange-traded funds tracking the STOXX Europe 600 index covering 600 largest European companies from 17 countries"
      },
      {
        "@type": "FinancialProduct",
        "name": "Amundi Core STOXX Europe 600 UCITS ETF",
        "identifier": "LU0908500753"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares STOXX Europe 600 UCITS ETF", 
        "identifier": "DE0002635307"
      }
    ],
    "mentions": [
      {
        "@type": "Organization",
        "name": "Amundi",
        "description": "Leading European ETF provider"
      },
      {
        "@type": "Organization", 
        "name": "iShares",
        "description": "ETF provider by BlackRock"
      },
      {
        "@type": "Organization",
        "name": "Xtrackers",
        "description": "ETF provider by DWS Group" 
      }
    ]
  };
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage", 
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jak jste vybrali TOP 3 STOXX 600 ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Výběr je založen na kombinaci faktorů: nejnižší poplatky TER, velikost fondu, likvidita, tracking error a celková kvalita providera. Data čerpáme z naší databáze a aktualizujeme měsíčně."
        }
      },
      {
        "@type": "Question", 
        "name": "Který STOXX 600 ETF má nejnižší náklady?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Podle aktuálních dat má nejnižší TER Amundi ETF. Kompletní žebříček najdete v sekci 'Top 10 podle nejnižších poplatků' s živými daty z naší databáze."
        }
      },
      {
        "@type": "Question",
        "name": "Akumulační vs distribuční STOXX 600 ETF?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Akumulační ETF automaticky reinvestují dividendy, což je ideální pro dlouhodobé spoření. Distribuční ETF vyplácejí dividendy v hotovosti, vhodné pro investory hledající pravidelný příjem."
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
        "name": "Nejlepší STOXX 600 ETF",
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
          alt: 'Nejlepší STOXX 600 ETF - srovnání LYP6 vs EXSA vs XESC'
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


export default async function NejlepsiStoxx600ETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-stoxx600-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  
  const relatedLinks = [
    {
      title: "Nejlepší evropské ETF",
      description: "Kompletní srovnání evropských ETF fondů",
      href: "/nejlepsi-etf/nejlepsi-evropske-etf",
      category: "Regionální ETF"
    },
    {
      title: "Nejlepší MSCI World ETF", 
      description: "Globální diverzifikace s MSCI World",
      href: "/nejlepsi-etf/nejlepsi-msci-world-etf",
      category: "Globální ETF"
    },
    {
      title: "Kde koupit ETF",
      description: "Srovnání brokerů pro nákup ETF",
      href: "/kde-koupit-etf", 
      category: "Praktické tipy"
    },
    {
      title: "Portfolio strategie",
      description: "Jak sestavit ETF portfolio",
      href: "/portfolio-strategie",
      category: "Investiční strategie"
    }
  ];

  return (
    <Layout>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-blue-50/50"></div>
        
        {/* Animated blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-purple-200/50">
                <FlagIcon className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  STOXX 600 ETF
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
                Kompletní srovnání nejlepších ETF fondů na STOXX Europe 600 index. Analýza poplatků, výnosů a praktické tipy pro výběr správného fondu.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#top3">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">📊 STOXX 600 Stats</h3>
                  <p className="text-gray-600">Klíčové informace o indexu</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-1">600</div>
                    <div className="text-sm text-gray-600">Evropských firem</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">~7%</div>
                    <div className="text-sm text-gray-600">Ročně za 20 let</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-1">17</div>
                    <div className="text-sm text-gray-600">Evropských zemí</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border border-cyan-200">
                    <div className="text-3xl font-bold text-cyan-600 mb-1">15</div>
                    <div className="text-sm text-gray-600">ETF na výběr</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-6 border-t border-gray-200/50">
                  <p className="text-sm text-gray-600 mb-3">Nejširší evropský index</p>
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
              Co je STOXX Europe 600?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              STOXX Europe 600 je klíčový index pokrývající 600 největších firem z 17 evropských zemí. Reprezentuje přibližně 90% tržní kapitalizace evropských akcií.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: CrownIcon,
                title: "600 největších firem",
                description: "Index pokrývá nejkvalitnější evropské společnosti z různých sektorů a zemí pro maximální diverzifikaci.",
                color: "from-purple-500 to-indigo-600",
                delay: "0.2s"
              },
              {
                icon: MapPinIcon,
                title: "17 evropských zemí",
                description: "Zahrnuje společnosti z Německa, Francie, Švýcarska, Nizozemska, Velké Británie a dalších zemí.",
                color: "from-indigo-500 to-blue-600",
                delay: "0.3s"
              },
              {
                icon: LandmarkIcon,
                title: "90% evropského trhu",
                description: "Reprezentuje naprostou většinu tržní kapitalizace evropských akcií v rozvinutých zemích.",
                color: "from-blue-500 to-cyan-600",
                delay: "0.4s"
              }
            ].map((item, index) => (
              <div key={index} className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: item.delay}}>
                <div className={`flex items-center justify-center rounded-full bg-gradient-to-r ${item.color} w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-purple-800 transition-colors">
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
          <Top3ETFServer etfs={etfs} currency="EUR" />
        </div>
      </section>

      <Top10SectionsServer etfs={etfs} currency="EUR" categoryName="STOXX 600" />

      {/* Selection Guide */}
      <section id="pruvodce" className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-6">
              <TargetIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              💡 Jak vybrat ten správný STOXX 600 ETF?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                number: "1",
                title: "Pro začátečníky",
                description: "Vyberte ETF s nejnižšími poplatky a velkou velikostí fondu. Zaměřte se na akumulační verze pro reinvestici výnosů.",
                color: "from-green-400 to-emerald-500",
                bgColor: "from-green-50 to-emerald-50",
                borderColor: "border-green-200"
              },
              {
                number: "2", 
                title: "Pro pokročilé",
                description: "Porovnejte tracking error, likviditu a daňové aspekty různých jurisdikcí. Zvažte geografické rozložení indexu.",
                color: "from-blue-400 to-blue-500",
                bgColor: "from-blue-50 to-blue-50",
                borderColor: "border-blue-200"
              },
              {
                number: "3",
                title: "Pro dlouhodobé investory", 
                description: "Důraz na stabilitu providera, dlouhý track record a konzistentní sledování indexu. Preferujte akumulační varianty.",
                color: "from-purple-400 to-purple-500",
                bgColor: "from-purple-50 to-purple-50", 
                borderColor: "border-purple-200"
              },
              {
                number: "4",
                title: "Pro minimalizaci nákladů",
                description: "Hledejte ETF s nejnižším TER a sledujte i další náklady jako spread a tracking difference.",
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

          <div className="space-y-6">
            {[
              {
                question: "Jak jste vybrali TOP 3 STOXX 600 ETF?",
                answer: "Výběr je založen na kombinaci faktorů: nejnižší poplatky TER, velikost fondu, likvidita, tracking error a celková kvalita providera. Data čerpáme z naší databáze a aktualizujeme měsíčně."
              },
              {
                question: "Co znamenají TOP 10 žebříčky na této stránce?",
                answer: "Žebříčky ukazují nejlepší STOXX 600 ETF podle různých kritérií - nejnižší poplatky, největší velikost fondu a nejvyšší výnosy za poslední rok. Data jsou živá z naší databáze."
              },
              {
                question: "Proč se některé STOXX 600 ETF neobjevují v seznamech?",
                answer: "Odfiltrováváme malé fondy (pod 100 mil EUR), pákové produkty, tematické a sektorové ETF. Zaměřujeme se pouze na kvalitní široko-evropské ETF sledující celý STOXX 600 index."
              },
              {
                question: "Akumulační vs distribuční STOXX 600 ETF?",
                answer: "Akumulační ETF automaticky reinvestují dividendy, což je ideální pro dlouhodobé spoření. Distribuční ETF vyplácejí dividendy v hotovosti, vhodné pro investory hledající pravidelný příjem."
              },
              {
                question: "Který STOXX 600 ETF má nejnižší náklady?",
                answer: "Podle aktuálních dat má nejnižší TER Amundi ETF. Kompletní žebříček najdete v sekci 'Top 10 podle nejnižších poplatků' s živými daty z naší databáze."
              },
              {
                question: "Jsou data na této stránce aktuální?",
                answer: "Ano, všechna data o ETF (TER, velikost fondů, výnosy) se načítají živě z naší databáze a jsou aktualizována denně. Poslední aktualizace článku byla provedena na začátku tohoto měsíce."
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
            Připraveni investovat do STOXX 600 ETF?
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
                <ShieldIcon className="w-5 h-5 mr-2" />
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