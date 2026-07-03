import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, ArrowRightIcon, TargetIcon, TrendingDownIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, GlobeIcon, ShieldIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Generate enhanced metadata for emerging markets ETF comparison page
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // SEO optimalizované datum - updated pouze jednou za měsíc
  const lastModified = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const publishedDate = `${currentYear}-01-18`;
  
  const title = `Nejlepší emerging markets ETF ${currentYear} - EIMI vs C9EM vs HMEF`;
  const description = `✅ Srovnání nejlepších emerging markets ETF ${currentYear}. EIMI, C9EM, HMEF - rozvíjející se trhy, poplatky TER, výnosy. Analýza EM k ${currentDate}.`;
  const canonical = 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-emerging-markets-etf';
  const ogImage = 'https://www.etfpruvodce.cz/og-emerging-markets-etf.jpg';
  
  // Enhanced keywords for better discoverability
  const keywords = [
    `nejlepší emerging markets ETF ${currentYear}`,
    'EIMI ETF recenze',
    'C9EM ETF analýza',
    'HMEF ETF porovnání',
    'MSCI Emerging Markets ETF',
    'emerging markets investice',
    'rozvíjející se trhy ETF',
    'EM ETF srovnání',
    'iShares Core emerging',
    'Amundi emerging markets',
    'HSBC emerging markets',
    'nejlevnější emerging ETF',
    'největší emerging ETF',
    'ETF TER poplatky EM',
    'Čína Indie Korea ETF',
    'Taiwan Brazílie emerging'
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
        "name": "Emerging Markets ETF",
        "description": "Exchange-traded funds tracking stock markets in developing countries and economies"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Core MSCI Emerging Markets IMI UCITS ETF",
        "identifier": "IE00BKM4GZ66"
      },
      {
        "@type": "FinancialProduct",
        "name": "Amundi Core MSCI Emerging Markets Swap UCITS ETF", 
        "identifier": "LU2573966905"
      },
      {
        "@type": "FinancialProduct",
        "name": "HSBC MSCI Emerging Markets UCITS ETF",
        "identifier": "IE00B5SSQT16"
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
        "name": "Amundi ETF",
        "description": "Leading European ETF provider"
      },
      {
        "@type": "Organization",
        "name": "HSBC",
        "description": "Global banking and ETF provider" 
      },
      {
        "@type": "Thing",
        "name": "MSCI Emerging Markets",
        "description": "Stock market index covering 24 emerging market countries"
      },
      {
        "@type": "Thing",
        "name": "Čína", 
        "description": "Largest emerging market representing ~30% of MSCI EM index"
      }
    ]
  };
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage", 
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Které země zahrnují emerging markets ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MSCI Emerging Markets zahrnuje 24 zemí včetně Číny (~30%), Taiwanu, Indie, Korey, Brazílie, Saúdské Arábie a dalších. Největší podíly mají Čína, Taiwan, Indie a Korea."
        }
      },
      {
        "@type": "Question", 
        "name": "Jsou emerging markets ETF rizikovější než světové?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano, emerging markets ETF mají vyšší volatilitu a politické riziko. Dlouhodobě ale mohou dosahovat vyšších výnosů díky rychlejšímu ekonomickému růstu rozvíjejících se zemí."
        }
      },
      {
        "@type": "Question",
        "name": "Jaký podíl emerging markets v portfoliu?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Obvykle 10-20% portfolia. Začátečníci mohou začít s 10%, pokročilí investoři až 20%. Emerging markets doplňují vyspělé trhy pro lepší diverzifikaci."
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
        "name": "Nejlepší emerging markets ETF",
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
          alt: 'Nejlepší emerging markets ETF - srovnání EIMI vs C9EM vs HMEF'
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

export default async function NejlepsiEmergingMarketsETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-emerging-markets-etf'];
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
      title: "Nejlepší světové ETF",
      description: "Kompletní světové ETF zahrnující i emerging markets",
      href: "/nejlepsi-etf/nejlepsi-celosvetove-etf",
      category: "Regionální ETF"
    },
    {
      title: "Nejlepší evropské ETF", 
      description: "Evropské ETF na vyspělé evropské trhy",
      href: "/nejlepsi-etf/nejlepsi-evropske-etf",
      category: "Regionální ETF"
    },
    {
      title: "Kde koupit emerging markets ETF",
      description: "Srovnání brokerů pro investice do EM",
      href: "/kde-koupit-etf", 
      category: "Praktické tipy"
    },
    {
      title: "Portfolio strategie s EM ETF",
      description: "Jak začlenit emerging markets do portfolia",
      href: "/portfolio-strategie",
      category: "Investiční strategie"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50"></div>
        
        {/* Animated blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-emerald-200/50">
                <RocketIcon className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  emerging markets ETF
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
                Kompletní srovnání nejlepších ETF fondů na rozvíjející se trhy. MSCI Emerging Markets analýza, poplatky, výnosy a praktické tipy pro investice do EM.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#top3">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold"
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
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-emerald-50/60 backdrop-blur-sm rounded-3xl shadow-2xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/80 to-emerald-50/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🚀 Emerging Markets Stats</h3>
                  <p className="text-gray-600">Klíčové informace o rozvíjejících se trzích</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">24</div>
                    <div className="text-sm text-gray-600">Zemí EM</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                    <div className="text-3xl font-bold text-teal-600 mb-1">30%</div>
                    <div className="text-sm text-gray-600">Podíl Číny</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
                    <div className="text-3xl font-bold text-cyan-600 mb-1">1400+</div>
                    <div className="text-sm text-gray-600">Akcií v MSCI EM</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-1">~15%</div>
                    <div className="text-sm text-gray-600">Vyšší volatilita</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-6 border-t border-emerald-200/50">
                  <p className="text-sm text-gray-600 mb-3">Rychle rostoucí ekonomiky</p>
                  <Link href="#pruvodce">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
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
              Co jsou emerging markets ETF?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Emerging markets ETF sledují akciové trhy rozvíjejících se ekonomik jako Čína, Indie, Korea, Taiwan, Brazílie. 
              Nabízejí vyšší růstový potenciál s vyšším rizikem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: GlobeIcon,
                title: "24 rozvíjejících se zemí",
                description: "MSCI Emerging Markets pokrývá největší rozvíjející se ekonomiky včetně Číny (30%), Taiwanu, Indie, Korey, Brazílie a Saúdské Arábie.",
                color: "from-emerald-500 to-teal-600",
                delay: "0.2s"
              },
              {
                icon: RocketIcon,
                title: "Rychlejší ekonomický růst",
                description: "Emerging markets rostou rychleji než vyspělé ekonomiky díky industrializaci, urbanizaci a rostoucí střední třídě.",
                color: "from-teal-500 to-cyan-600",
                delay: "0.3s"
              },
              {
                icon: TrendingDownIcon,
                title: "Vyšší riziko i výnos",
                description: "EM ETF mají vyšší volatilitu než vyspělé trhy, ale dlouhodobě mohou dosahovat vyšších výnosů.",
                color: "from-cyan-500 to-blue-600",
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

      {/* Top 3 Recommendations - Server-side rendered with real data */}
      <section id="top3" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🏆 Top 3 nejlepší emerging markets ETF
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení na základě analýzy {etfs.length} dostupných EM ETF
            </p>
          </div>

          <Top3ETFServer etfs={etfs} currency="CZK" />
        </div>
      </section>

      <Top10SectionsServer etfs={etfs} currency="CZK" categoryName="Emerging Markets" />

      {/* Selection Guide */}
      <section id="pruvodce" className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mb-6">
              <TargetIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              💡 Jak vybrat správný emerging markets ETF?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                number: "1",
                title: "Pro začátečníky do EM",
                description: "Začněte s největšími fondy jako EIMI nebo HMEF. Volte broad MSCI Emerging Markets, ne specializované země. Investujte max 10% portfolia do EM.",
                color: "from-emerald-400 to-emerald-500",
                bgColor: "from-emerald-50 to-emerald-50",
                borderColor: "border-emerald-200"
              },
              {
                number: "2", 
                title: "Sledujte TER a velikost",
                description: "TER by měl být pod 0,20%. Minimální velikost fondu 1 mld. EUR pro dobrou likviditu. Amundi má nejnižší TER 0,14%, iShares největší velikost.",
                color: "from-teal-400 to-teal-500",
                bgColor: "from-teal-50 to-teal-50",
                borderColor: "border-teal-200"
              },
              {
                number: "3",
                title: "Geographical exposure", 
                description: "Standardní EM má 30% Čínu. Pro menší čínské riziko volte 'ex-China' varianty. Pro širší pokrytí volte IMI verze s small-cap akciemi.",
                color: "from-cyan-400 to-cyan-500",
                bgColor: "from-cyan-50 to-cyan-50", 
                borderColor: "border-cyan-200"
              },
              {
                number: "4",
                title: "Timing a alokace",
                description: "EM jsou cyklické - koupě při pessimismu, prodej při optimismu. Ideálně 10-20% portfolia. Dollar-cost averaging snižuje volatilitu.",
                color: "from-blue-400 to-blue-500",
                bgColor: "from-blue-50 to-blue-50",
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
                question: "Jaké jsou nejlepší emerging markets ETF pro rok 2026?",
                answer: "Naše TOP 3 doporučení: iShares Core MSCI Emerging Markets IMI ETF (EIMI, IE00BKM4GZ66) největší s 25+ mld. EUR, Amundi Core MSCI Emerging Markets ETF (C9EM, LU2573966905) s nejnižším TER 0,14%, a HSBC MSCI Emerging Markets ETF (HMEF, IE00B5SSQT16) s vynikajícím poměrem TER 0,15% a velikostí 2,4 mld. EUR."
              },
              {
                question: "Které země zahrnují emerging markets ETF?",
                answer: "MSCI Emerging Markets zahrnuje 24 zemí s největšími podíly: Čína (~30%), Taiwan (~15%), Indie (~14%), Korea (~12%), Brazílie (~5%), Saúdská Arábie (~4%) a další. Složení se mění podle růstu ekonomik."
              },
              {
                question: "Jsou emerging markets ETF rizikovější?",
                answer: "Ano, EM ETF mají vyšší volatilitu (15-25% ročně vs 12-18% u vyspělých trhů), politické riziko a měnové riziko. Dlouhodobě ale mohou dosahovat vyšších výnosů díky rychlejšímu ekonomickému růstu."
              },
              {
                question: "Jaký podíl emerging markets v portfoliu?",
                answer: "Začátečníci: 5-10%, pokročilí: 10-20% portfolia. EM doplňují vyspělé trhy pro lepší diverzifikaci. Nikdy nevkládejte více než můžete ztratit kvůli vyšší volatilitě."
              },
              {
                question: "MSCI EM vs FTSE Emerging Markets - jaký rozdíl?",
                answer: "MSCI EM má 1400+ akcií z 24 zemí, FTSE Emerging má 2000+ akcií z 25 zemí včetně Polska. FTSE má mírně širší pokrytí, ale rozdíly jsou minimální. MSCI je populárnější."
              },
              {
                question: "Kdy investovat do emerging markets?",
                answer: "EM jsou cyklické. Nejlepší časy: po krizích při pessimismu, silný dolar už oslabuje, Fed snižuje sazby. Nejhorší: při euforii, posilující dolar, Fed zvyšuje sazby."
              },
              {
                question: "Jsou data o EM ETF aktuální?",
                answer: "Ano, všechna data o emerging markets ETF se načítají živě z naší databáze. Žebříčky TOP 10 podle TER, velikosti a výkonu jsou aktualizovány denně."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-emerald-200 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-emerald-50 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-emerald-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-emerald-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Připraveni investovat do emerging markets ETF?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Vyberte si brokera a začněte budovat své EM portfolio ještě dnes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
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
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg font-semibold"
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
        className="bg-emerald-50"
      />
    </Layout>
  );
}