import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, ArrowRightIcon, TargetIcon, MapPinIcon, BriefcaseIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, FlagIcon, GlobeIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Generate enhanced metadata for MSCI World ETF comparison page
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // SEO optimalized dates - modified time only changes monthly to signal fresh content
  const lastModified = new Date(new Date().getMonth(), 1).toISOString();
  const publishedDate = `${currentYear}-01-25`;
  
  const title = `Nejlepší MSCI World ETF ${currentYear} - SWDA vs XDWD vs SPPW`;
  const description = `✅ Srovnání nejlepších MSCI World ETF ${currentYear}. SWDA, XDWD, SPPW - globální diverzifikace 1600+ společností, poplatky TER, výnosy. Aktuální data k ${currentDate}.`;
  const canonical = 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-msci-world-etf';
  const ogImage = 'https://www.etfpruvodce.cz/og-msci-world-etf.jpg';
  
  // Enhanced keywords for better discoverability
  const keywords = [
    `nejlepší MSCI World ETF ${currentYear}`,
    'SWDA ETF recenze',
    'XDWD ETF porovnání', 
    'SPPW ETF analýza',
    'MSCI World srovnání',
    'globální ETF portfolio',
    'světové indexy investice',
    'rozvinuté trhy ETF',
    'iShares Core World',
    'Xtrackers MSCI World',
    'SPDR World ETF',
    'globální diverzifikace',
    'ETF TER poplatky',
    'světová ekonomika ETF',
    'developed markets fondy'
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
        "name": "MSCI World ETF",
        "description": "Exchange-traded funds tracking the MSCI World developed markets index covering 1600+ companies from 23 countries"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Core MSCI World UCITS ETF",
        "identifier": "IE00B4L5Y983"
      },
      {
        "@type": "FinancialProduct",
        "name": "Xtrackers MSCI World UCITS ETF", 
        "identifier": "IE00BJ0KDQ92"
      }
    ],
    "mentions": [
      {
        "@type": "Organization",
        "name": "iShares",
        "description": "Leading ETF provider by BlackRock"
      },
      {
        "@type": "Organization", 
        "name": "Xtrackers",
        "description": "ETF provider by DWS Group"
      },
      {
        "@type": "Organization",
        "name": "SPDR",
        "description": "ETF provider by State Street Global Advisors" 
      }
    ]
  };
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage", 
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší MSCI World ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší MSCI World ETF jsou: iShares Core MSCI World UCITS ETF (SWDA, IE00B4L5Y983) největší a nejlikvidnější s 75+ mld. EUR, Xtrackers MSCI World UCITS ETF (XDWD, IE00BJ0KDQ92) s konkurenceschopným TER 0,19% a 8+ mld. EUR, a SPDR MSCI World UCITS ETF (SPPW, IE00BFY0GT14) s nízkým TER 0,12% a 6+ mld. EUR."
        }
      },
      {
        "@type": "Question", 
        "name": "Jaký je rozdíl mezi MSCI World a S&P 500?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MSCI World pokrývá 23 rozvinutých zemí světa, zatímco S&P 500 pouze USA. MSCI World má širší geografickou diverzifikaci, ale nižší koncentraci technologických gigantů. Je méně volatilní, ale historicky má mírně nižší výnosy."
        }
      },
      {
        "@type": "Question",
        "name": "Který MSCI World ETF má nejnižší náklady?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejnižší TER obvykle nabízejí někteří menší poskytovatelé ETF. Největší poskytovatelé mají vyšší poplatky, ale nabízejí lepší likviditu a delší track record. Podívejte se na naš žebříček podle TER pro aktuální srovnání."
        }
      },
      {
        "@type": "Question",
        "name": "Co znamenají TOP 10 žebříčky podle TER, velikosti fondu a výkonu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Naše žebříčky jsou generovány živě z databáze a filtrují pouze standardní MSCI World ETF. Automaticky vylučujeme tematické ETF (ESG, SRI, Value, Growth), small cap varianty a pákové produkty. Data jsou aktualizována pravidelně."
        }
      },
      {
        "@type": "Question",
        "name": "Proč má MSCI World nižší výnosy než NASDAQ nebo S&P 500?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MSCI World zahrnuje i pomalejší ekonomiky (Evropa, Japonsko) a má nižší váhu technologických akcií. Výměnou za mírně nižší výnosy získáváte lepší geografickou diverzifikaci a snížení závislosti na americkém trhu."
        }
      },
      {
        "@type": "Question",
        "name": "Jsou data v žebříčcích aktuální?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano, všechny žebříčky jsou generovány živě z naší databáze při každém načtení stránky. Zahrnují nejnovější data o TER, velikosti fondů, výkonnosti a dalších klíčových metrikách MSCI World ETF dostupných pro evropské investory."
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
        "name": "Nejlepší MSCI World ETF",
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
          alt: 'Nejlepší MSCI World ETF - srovnání SWDA vs XDWD vs SPPW'
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

export default async function NejlepsiMSCIWorldETF() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-msci-world-etf'];
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

  return (
    <Layout>

      {/* Modern Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-rose-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-rose-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-purple-200/50">
                <FlagIcon className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                  MSCI World ETF
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
                Kompletní srovnání nejlepších MSCI World ETF fondů pro globální diverzifikaci portfolia. 
                Analýza poplatků, výkonnosti a praktické tipy pro výběr.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#top3">
                  <button 
                    className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md"
                  >
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </button>
                </Link>
                <Button asChild size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold">
                  <Link href="#srovnani">
                    <BarChart3Icon className="w-5 h-5 mr-2" />
                    Srovnání všech
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right Content - Market Stats */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-gray-50/60 backdrop-blur-sm rounded-3xl shadow-2xl"></div>
              <div className="relative bg-gradient-to-br from-white/80 to-gray-50/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🌍 MSCI World Stats</h3>
                  <p className="text-gray-600">Klíčové informace o globálním indexu</p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-1">1600</div>
                    <div className="text-sm text-gray-600">Firem z 23 zemí</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
                    <div className="text-3xl font-bold text-pink-600 mb-1">~9%</div>
                    <div className="text-sm text-gray-600">Ročně za 20 let</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-rose-50 to-red-50 rounded-xl border border-rose-200">
                    <div className="text-3xl font-bold text-rose-600 mb-1">85%</div>
                    <div className="text-sm text-gray-600">Globální trh cap</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                    <div className="text-3xl font-bold text-red-600 mb-1">15</div>
                    <div className="text-sm text-gray-600">ETF na výběr</div>
                  </div>
                </div>
                
                <div className="text-center pt-6 border-t border-gray-200/50">
                  <p className="text-sm text-gray-600 mb-3">Developed markets po celém světě</p>
                  <Link href="#pruvodce">
                    <button 
                      className="border border-purple-200 text-purple-600 hover:bg-purple-50 px-4 py-2 text-sm rounded-md transition-colors"
                    >
                      Průvodce výběrem
                    </button>
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
              Co je MSCI World index?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              MSCI World obsahuje přes 1600 firem z 23 rozvinutých zemí světa. 
              Je to nejpopulárnější index pro globální diverzifikaci portfolia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: GlobeIcon,
                title: "1600+ firem z 23 zemí",
                description: "Index pokrývá developed markets včetně USA, Evropy, Japonska, Kanady, Austrálie a dalších vyspělých ekonomik.",
                color: "purple"
              },
              {
                icon: MapPinIcon,
                title: "Globální diverzifikace",
                description: "Rozložení rizika napříč kontinenty a ekonomikami. Žádná závislost na jedné zemi nebo regionu.",
                color: "pink"
              },
              {
                icon: BriefcaseIcon,
                title: "Large & mid cap focus",
                description: "Zaměření na velké a střední společnosti s prokázanou stabilitou a růstovým potenciálem.",
                color: "rose"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              const colorMap = {
                purple: "from-purple-500 to-pink-600",
                pink: "from-pink-500 to-rose-600", 
                rose: "from-rose-500 to-red-600"
              };
              
              return (
                <div key={index} className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
                  <div className={`flex items-center justify-center rounded-full bg-gradient-to-r ${colorMap[item.color]} w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-purple-800 transition-colors">
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
              🏆 Top 3 nejlepší MSCI World ETF
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení na základě analýzy všech dostupných MSCI World ETF
            </p>
          </div>

          <Top3ETFServer etfs={etfs.slice(0, 3)} currency="EUR" />
        </div>
      </section>

      {/* Top 10 Sections - by TER, AUM, Performance */}
      <Top10SectionsServer etfs={etfs} currency="EUR" categoryName="MSCI World" />

      {/* Selection Guide Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Selection Guide */}
          <div id="pruvodce" className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-12 border border-purple-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                💡 Jak vybrat ten správný MSCI World ETF?
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
                  Začněte s největším MSCI World ETF pro zajištění dobré likvidity. 
                  Zaměřte se na nízký TER a track record s minimálně několik let existence.
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
                  Porovnejte physical vs sampling replikaci. Sledujte tracking difference 
                  a geografické rozložení. Zvažte currency hedging podle své měny.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <h5 className="text-lg font-bold text-purple-800">Pro globální investory</h5>
                </div>
                <p className="text-purple-700 leading-relaxed">
                  MSCI World je ideální kostrou portfolia. Kombinujte s emerging markets 
                  nebo tematickými ETF pro rozšíření expozice.
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
                  Porovnejte TER napříč poskytovateli - rozdíly mohou být značné. 
                  Menší poskytovatelé často nabízejí konkurenceschopnější poplatky.
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
              Často kladené otázky o MSCI World ETF
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Odpovědi na nejčastější dotazy o investování do MSCI World ETF
            </p>
          </div>

          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.2s]">
            <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "Jaké jsou nejlepší MSCI World ETF v roce 2025?",
                answer: "Nejlepší MSCI World ETF jsou: iShares Core MSCI World UCITS ETF (SWDA, IE00B4L5Y983) největší a nejlikvidnější s 75+ mld. EUR, Xtrackers MSCI World UCITS ETF (XDWD, IE00BJ0KDQ92) s konkurenceschopným TER 0,19% a 8+ mld. EUR, a SPDR MSCI World UCITS ETF (SPPW, IE00BFY0GT14) s nízkým TER 0,12% a 6+ mld. EUR."
              },
              {
                question: "Co znamenají TOP 10 žebříčky podle TER, velikosti fondu a výkonu?",
                answer: "Naše žebříčky jsou generovány živě z databáze a filtrují pouze standardní MSCI World ETF. Automaticky vylučujeme tematické ETF (ESG, SRI, Value, Growth), small cap varianty a pákové produkty. Data jsou aktualizována pravidelně."
              },
              {
                question: "Jaký je rozdíl mezi MSCI World a S&P 500?",
                answer: "MSCI World pokrývá 23 rozvinutých zemí světa, zatímco S&P 500 pouze USA. MSCI World má širší geografickou diverzifikaci, ale nižší koncentraci technologických gigantů. Je méně volatilní, ale historicky má mírně nižší výnosy."
              },
              {
                question: "Proč má MSCI World nižší výnosy než NASDAQ nebo S&P 500?",
                answer: "MSCI World zahrnuje i pomalejší ekonomiky (Evropa, Japonsko) a má nižší váhu technologických akcií. Výměnou za mírně nižší výnosy získáváte lepší geografickou diverzifikaci a snížení závislosti na americkém trhu."
              },
              {
                question: "Který MSCI World ETF má nejnižší náklady?",
                answer: "Nejnižší TER obvykle nabízejí někteří menší poskytovatelé ETF. Největší poskytovatelé mají vyšší poplatky, ale nabízejí lepší likviditu a delší track record. Podívejte se na naš žebříček podle TER pro aktuální srovnání."
              },
              {
                question: "Jsou data v žebříčcích aktuální?",
                answer: "Ano, všechny žebříčky jsou generovány živě z naší databáze při každém načtení stránky. Zahrnují nejnovější data o TER, velikosti fondů, výkonnosti a dalších klíčových metrikách MSCI World ETF dostupných pro evropské investory."
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
        </div>
      </section>

      {/* SECTION 8: MSCI World-Specific Pro Optimization Tips */}
      <section id="pro-tipy" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            ⚡ 5 pokročilých tipů specifických pro MSCI World ETF
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Tyto strategie fungují specificky pro MSCI World index a jeho globální strukturu. Neplatí pro S&P 500, NASDAQ ani jiné regionální indexy.
          </p>

          <div className="space-y-8">
            {/* Tip 1: Geographic Rebalancing Strategy */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🌍 Sledujte geografický drift USA váhy (cílové pásmo 65-75%)
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    MSCI World je <strong>market-cap weighted</strong> index, což znamená, že váha jednotlivých regionů se mění s performance.
                    USA váha může kolísat od <strong>60% do 75%</strong> v závislosti na relativní performance amerických akcií.
                    Když USA trh outperformuje Evropu a Asii, jeho váha automaticky roste - což může narušit vaši zamýšlenou diverzifikaci.
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border-l-4 border-orange-500 pl-4">
                        <p className="text-sm font-bold text-orange-800 mb-1">⚠️ USA váha {'>'} 72%</p>
                        <p className="text-xs text-gray-700">
                          Příliš vysoká koncentrace USA. Zvažte přidat <strong>MSCI Europe ETF</strong> nebo <strong>MSCI Pacific ETF</strong>
                          pro manuální rebalancing. Alternativně: MSCI ACWI (includes emerging).
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm font-bold text-green-800 mb-1">✅ USA váha 65-70%</p>
                        <p className="text-xs text-gray-700">
                          Vyvážená globální alokace. MSCI World sám o sobě poskytuje dostatečnou diverzifikaci.
                          Není potřeba manuální rebalancing.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-800 font-medium mb-2">💡 Praktická strategie:</p>
                    <p className="text-sm text-gray-700">
                      Každé <strong>čtvrtletí</strong> zkontrolujte aktuální regionální rozložení MSCI World na webu
                      <a href="https://www.msci.com/documents/10199/178e6643-6ae6-47b9-82be-e1fc565ededb" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mx-1">
                        MSCI.com factsheet
                      </a>.
                      Pokud USA {'>'} 72%, alokujte nové investice do regionálních ETF místo broad MSCI World.
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: S&P 500 je 100% USA (geografický drift neexistuje).
                    MSCI ACWI má fixní 10-15% emerging markets pro automatickou diverzifikaci.
                  </p>
                </div>
              </div>
            </div>

            {/* Tip 2: Multi-Currency Natural Hedge */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    💱 Využijte multi-měnovou diverzifikaci (10+ měn vs. 100% USD v S&P 500)
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Na rozdíl od S&P 500 (100% USD exposure), MSCI World obsahuje firmy generující revenue v <strong>10+ měnách</strong>:
                    USD (~70%), EUR (~15%), JPY (~7%), GBP (~4%), CAD (~3%), AUD (~2%), CHF (~2%), a další.
                    Pro českého investora je to <strong>přirozený hedge</strong> proti dlouhodobému oslabení/posílení kterékoliv měny.
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-3">📊 Reálný příklad z historie:</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">2020-2021:</span>
                        <div>
                          <p className="text-gray-700">USD oslabuje z 1.10 na 1.20 EUR. S&P 500 investor ztratil ~9% na currency.</p>
                          <p className="text-gray-700"><strong>MSCI World investor:</strong> EUR složka (+9%), GBP složka (+5%) kompenzovaly USD ztrátu → celková currency ztráta jen ~3%.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-orange-600 font-bold">2022:</span>
                        <div>
                          <p className="text-gray-700">USD posílil z 1.15 na 0.98 EUR (parity). S&P 500 investor získal +17% na currency!</p>
                          <p className="text-gray-700"><strong>MSCI World investor:</strong> EUR složka (-17%), ale diversifikace zmírnila swing → celkový currency gain jen +5%.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-l-4 border-purple-500">
                    <p className="text-sm text-gray-800 font-medium mb-2">💡 Kdy využít:</p>
                    <p className="text-sm text-gray-700">
                      Pokud <strong>nevíte</strong>, kam půjde EUR/USD v příštích 10 letech (nikdo neví!), MSCI World je bezpečnější volba než 100% S&P 500.
                      Pokud máte <strong>silný názor</strong> na USD posílení, S&P 500 může být lepší short-term bet (ale vyšší riziko).
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: Currency hedged ETF (EUR Hedged) eliminují tuto diverzifikaci - vhodné pouze pro krátkodobé taktické pozice.
                  </p>
                </div>
              </div>
            </div>

            {/* Tip 3: Home Bias Audit */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🏠 Home Bias Audit: MSCI World má 0% emerging markets (Česko, Polsko, Indie, Čína)
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    MSCI World obsahuje <strong>pouze developed markets</strong> (23 zemí). Pro českého investora to znamená:
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">❌</span>
                        <div><strong>0% exposure k Česku, Polsku, Maďarsku</strong> (Central Europe = emerging market)</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">❌</span>
                        <div><strong>0% Čína, Indie, Brazílie, Korea</strong> (rychle rostoucí emerging markets)</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✅</span>
                        <div>Evropa je zastoupena jen <strong>15%</strong> (hlavně Německo, Francie, UK, Švýcarsko)</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✅</span>
                        <div>Japonsko ~7%, Austrálie ~2%, Kanada ~3%</div>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-l-4 border-green-500 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-2">💡 Doporučené portfolio split pro úplnou globální diverzifikaci:</p>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-blue-50 rounded p-3">
                        <p className="font-bold text-blue-800 mb-1">🌍 80% MSCI World</p>
                        <p className="text-xs text-gray-600">Core holding - developed markets, stabilní růst</p>
                      </div>
                      <div className="bg-orange-50 rounded p-3">
                        <p className="font-bold text-orange-800 mb-1">🚀 20% MSCI Emerging Markets</p>
                        <p className="text-xs text-gray-600">Satellite - vyšší růstový potenciál, zahrnuje Čínu, Indii, Koreu, Brazílii, Tchaj-wan</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Tento 80/20 split přibližně kopíruje <strong>MSCI ACWI</strong> (All Country World Index), který obsahuje developed + emerging v jednom ETF.
                    </p>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>Alternativa:</strong> Pokud nechcete rebalancovat 2 ETF, použijte rovnou <strong>MSCI ACWI ETF</strong>
                    (např. iShares MSCI ACWI, ticker SSAC) s automatickým ~88% developed + ~12% emerging split.
                  </p>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: S&P 500 má také 0% emerging markets, ale navíc má 0% non-US developed (Evropa, Japonsko).
                    MSCI World je tedy wider než S&P 500, ale užší než MSCI ACWI.
                  </p>
                </div>
              </div>
            </div>

            {/* Tip 4: Valuation-Based Regional Rotation */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border-2 border-orange-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    📊 Valuation-Based Rotation: USA vs. Evropa vs. Japonsko P/E monitoring
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Protože MSCI World obsahuje 3 hlavní regiony (USA ~70%, Evropa ~15%, Japonsko ~7%), můžete využít
                    <strong>regionální valuace divergence</strong> pro taktickou alokaci. Různé regiony mají různé valuační úrovně:
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-3">📈 Typické valuační pásma (P/E ratio):</p>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <div className="bg-blue-50 rounded p-3 border-l-4 border-blue-500">
                        <p className="font-bold text-blue-800">🇺🇸 USA (S&P 500)</p>
                        <p className="text-2xl font-bold text-blue-900 my-1">20-25x</p>
                        <p className="text-xs text-gray-600">Historicky dražší díky tech dominance a growth premium</p>
                      </div>
                      <div className="bg-green-50 rounded p-3 border-l-4 border-green-500">
                        <p className="font-bold text-green-800">🇪🇺 Evropa (STOXX 600)</p>
                        <p className="text-2xl font-bold text-green-900 my-1">12-18x</p>
                        <p className="text-xs text-gray-600">Tradičně levnější, value stock dominance (banky, industrials)</p>
                      </div>
                      <div className="bg-purple-50 rounded p-3 border-l-4 border-purple-500">
                        <p className="font-bold text-purple-800">🇯🇵 Japonsko (TOPIX)</p>
                        <p className="text-2xl font-bold text-purple-900 my-1">14-16x</p>
                        <p className="text-xs text-gray-600">Střed mezi USA a Evropou, občasné value příležitosti</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-l-4 border-orange-500 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-2">💡 Taktická strategie (pro pokročilé):</p>
                    <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                      <li>
                        <strong>USA P/E {'>'} 25x + Evropa P/E {'<'} 15x:</strong> Příležitost k rotaci.
                        Alokujte nové investice do <strong>MSCI Europe ETF</strong> nebo <strong>STOXX 600 ETF</strong> místo MSCI World.
                      </li>
                      <li>
                        <strong>Japonsko P/E {'<'} 14x:</strong> Value opportunity.
                        Zvažte <strong>MSCI Japan ETF</strong> jako satellite (10-15% portfolia).
                      </li>
                      <li>
                        <strong>Všechny regiony expensive:</strong> Držte cash nebo pokračujte v DCA do MSCI World
                        (diversifikace je lepší než market timing).
                      </li>
                    </ol>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <p className="text-sm text-gray-800 font-medium mb-2">🔧 Nástroje pro sledování valuací:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>USA P/E:</strong> <a href="https://www.multpl.com/shiller-pe" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Multpl.com/shiller-pe</a> (Shiller P/E)</li>
                      <li>• <strong>Evropa P/E:</strong> <a href="https://www.starcapital.de/en/research/stock-market-valuation" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">StarCapital.de</a> (STOXX Europe valuations)</li>
                      <li>• <strong>Globální srovnání:</strong> <a href="https://www.yardeni.com/pub/peacockfeval.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Yardeni.com</a> (Global valuations)</li>
                      <li>• <strong>MSCI factsheets:</strong> <a href="https://www.msci.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">MSCI.com</a> (regionální P/E + P/B ratios)</li>
                    </ul>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: Tato strategie vyžaduje aktivní monitoring (quarterly). Pokud preferujete pasivní buy-and-hold, ignorujte valuace a držte 100% MSCI World long-term.
                  </p>
                </div>
              </div>
            </div>

            {/* Tip 5: Physical vs Sampling Replication */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    5
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🔬 Tracking Difference: Physical Replication vs. Sampling (1600 akcií je hodně!)
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    MSCI World obsahuje <strong>1600+ akcií</strong>. Pro ETF providera je nákladné držet všechny akcie fyzicky
                    (transaction costs, rebalancing, custody fees). Proto existují 2 přístupy:
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm font-bold text-green-800 mb-2">✅ Physical Replication (Full)</p>
                        <p className="text-xs text-gray-700 mb-2">
                          ETF drží <strong>všech 1600+ akcií</strong> v přesných váhách jako index.
                        </p>
                        <p className="text-xs text-gray-600">
                          <strong>Výhody:</strong> Nízká tracking error (0.05-0.10% ročně), transparentní holdings
                        </p>
                        <p className="text-xs text-gray-600">
                          <strong>Nevýhody:</strong> Vyšší operational costs (více trades při rebalancingu)
                        </p>
                        <p className="text-xs text-blue-700 font-medium mt-2">
                          Příklad: <strong>iShares Core MSCI World (SWDA)</strong> - full physical replication
                        </p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-4">
                        <p className="text-sm font-bold text-orange-800 mb-2">⚠️ Sampling (Optimized)</p>
                        <p className="text-xs text-gray-700 mb-2">
                          ETF drží jen <strong>400-600 největších akcií</strong> (reprezentativní vzorek).
                        </p>
                        <p className="text-xs text-gray-600">
                          <strong>Výhody:</strong> Nižší operational costs, méně trades
                        </p>
                        <p className="text-xs text-gray-600">
                          <strong>Nevýhody:</strong> Vyšší tracking error (0.15-0.25% ročně), méně transparentní
                        </p>
                        <p className="text-xs text-blue-700 font-medium mt-2">
                          Příklad: Některé menší MSCI World ETF s AUM {'<'} 1 mld EUR
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-l-4 border-indigo-500 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-2">💡 Jak vybrat:</p>
                    <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                      <li>
                        <strong>Pro long-term buy-and-hold (10-20+ let):</strong> Preferujte <strong>physical replication</strong>.
                        Nižší tracking difference = vyšší compound returns long-term.
                      </li>
                      <li>
                        <strong>Kontrola tracking difference:</strong> Najděte ETF factsheet na webu providera
                        (např. <a href="https://www.ishares.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">iShares.com</a>).
                        Hledejte sekci <em>"Performance & Risk"</em> → <em>"Tracking Difference"</em> (cíl: {'<'} 0.10% p.a.).
                      </li>
                      <li>
                        <strong>Red flag:</strong> Pokud ETF má TER 0.20%, ale tracking difference je -0.30%,
                        znamená to špatnou execution (sampling problems nebo hidden costs). Vyhněte se mu.
                      </li>
                    </ol>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <p className="text-sm text-gray-800 font-medium mb-2">🔧 Jak zkontrolovat tracking difference:</p>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><strong>1. Krok:</strong> Najděte ETF factsheet (Google: "[ETF ticker] factsheet")</p>
                      <p><strong>2. Krok:</strong> Hledejte sekci "Performance" nebo "Tracking"</p>
                      <p><strong>3. Krok:</strong> Porovnejte <em>ETF Annual Return</em> vs. <em>Index Annual Return</em></p>
                      <p><strong>4. Krok:</strong> Tracking Difference = ETF Return - Index Return (očekáváno: -0.05% až -0.15%)</p>
                      <p className="text-xs text-gray-500 italic mt-2">
                        💡 Tip: Tracking difference je důležitější než TER! ETF s TER 0.25% a tracking difference -0.10%
                        je lepší než ETF s TER 0.15% a tracking difference -0.30%.
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: S&P 500 ETF mají nižší tracking error (jen 500 akcií = snazší replikace).
                    MSCI World je komplexnější index → tracking quality je kritičtější faktor při výběru ETF.
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
            <div className="flex items-center justify-center rounded-full bg-purple-100 w-20 h-20 mx-auto mb-8 hover:bg-purple-200 transition-colors hover-scale">
              <ZapIcon className="w-10 h-10 text-purple-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Připraveni investovat globálně?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Najděte si ideálního brokera a začněte s investováním do nejlepších MSCI World ETF
            </p>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="hover-scale bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold">
                <Link href="/kde-koupit-etf">
                  <UsersIcon className="w-5 h-5 mr-2" />
                  Najít brokera pro ETF
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="hover-scale border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold">
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
              description: "Srovnání amerických blue chip ETF na S&P 500 index"
            },
            {
              title: "Nejlepší NASDAQ ETF",
              href: "/nejlepsi-etf/nejlepsi-nasdaq-etf", 
              description: "Technologické ETF pro investice do NASDAQ 100"
            },
            {
              title: "Kde koupit MSCI World ETF",
              href: "/kde-koupit-etf",
              description: "Srovnání brokerů pro investice do globálních ETF"
            },
            {
              title: "Portfolio strategie s MSCI World",
              href: "/portfolio-strategie",
              description: "Modelová portfolia obsahující globální ETF"
            }
          ]}
        />
      </div>
    </Layout>
  );
}