import React from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { Star, BarChart3, Target, DollarSign, Rocket, Users, Flag, TrendingUp, Award, Building, Globe, Shield} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import type { Metadata } from 'next';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// Top 3 doporučené ETF pro rok 2025 - výběr na základě databázové analýzy
const TOP_3_ETF_2025_TEMPLATE = [
  {
    name: "iShares Core S&P 500 UCITS ETF USD (Acc)",
    ticker: "CSPX",
    isin: "IE00B5BMR087",
    provider: "iShares",
    degiroFree: true,
    reason: "Nejlepší volba pro rok 2025. Největší ETF s nízkými náklady (0.07% TER) a výbornou likviditou 111B EUR.",
  },
  {
    name: "iShares Core MSCI World UCITS ETF USD (Acc)",
    ticker: "IWDA",
    isin: "IE00B4L5Y983",
    provider: "iShares",
    degiroFree: true,
    reason: "Nejstabilnější globální volba. Největší světový ETF s 103B EUR a širokou diverzifikací napříč vyspělými trhy.",
  },
  {
    name: "Vanguard FTSE All-World UCITS ETF USD (Acc)",
    ticker: "VWCE", 
    isin: "IE00BK5BQT80",
    provider: "Vanguard",
    degiroFree: true,
    reason: "Nejkompletnější diverzifikace. Pokrývá celý svět včetně rozvíjejících se trhů s výborným poměrem cena/výkon.",
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
    title: `Nejlepší ETF ${currentYear} - CSPX vs IWDA vs VWCE`,
    description: `✅ Top 3 nejlepší ETF fondy pro rok ${currentYear}. CSPX, IWDA, VWCE - srovnání poplatků TER, výnosů, velikosti fondů. Aktuální data k ${currentDate}.`,
    keywords: `nejlepší ETF ${currentYear}, CSPX, IWDA, VWCE, ETF fondy, investování, indexové fondy`,
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-etf-2025',
    },
    openGraph: {
      title: `Nejlepší ETF ${currentYear} - Top 3 doporučení pro české investory`,
      description: `Kompletní srovnání nejlepších ETF fondů pro rok ${currentYear}. Analýza CSPX, IWDA, VWCE - poplatky, výnosy, rizika.`,
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-etf-2025',
      siteName: 'ETF průvodce.cz',
      images: [
        {
          url: 'https://www.etfpruvodce.cz/og-best-etf-2025.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší ETF ${currentYear} - srovnání VWCE vs CSPX vs IWDA`,
        },
      ],
      locale: 'cs_CZ',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší ETF ${currentYear} - Top 3 doporučení`,
      description: `Srovnání nejlepších ETF fondů ${currentYear}: CSPX, IWDA, VWCE. Poplatky, výnosy, praktické tipy.`,
      images: ['https://www.etfpruvodce.cz/og-best-etf-2025.jpg'],
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
      'article:published_time': `${currentYear}-01-01T10:00:00.000Z`,
      'article:modified_time': new Date().toISOString(),
      'article:section': 'Investment Guides',
      'article:tag': `nejlepší ETF ${currentYear}, CSPX, IWDA, VWCE, investování`,
      'theme-color': '#3B82F6',
      'msapplication-TileColor': '#3B82F6',
      'format-detection': 'telephone=no',
    },
  };
}

export default async function NejlepsiETF2025() {
  // Get last modified date from database (all ETF updates)
  const lastModified = await getLastModifiedDate();

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
    "headline": `Nejlepší ETF ${currentYear} - Top 3 doporučení pro české investory`,
    "description": `Kompletní srovnání nejlepších ETF fondů pro rok ${currentYear}. CSPX, IWDA, VWCE - poplatky TER, výnosy, velikost fondů.`,
    "image": "https://www.etfpruvodce.cz/og-best-etf-2025.jpg",
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
    "datePublished": `${currentYear}-01-01`,
    "dateModified": lastModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf-2025"
    },
    "articleSection": "Investment Guides",
    "keywords": `nejlepší ETF ${currentYear}, CSPX, IWDA, VWCE, ETF fondy, investování`,
    "wordCount": 2800,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "ETF fondy",
        "description": "Exchange-traded funds pro dlouhodobé investování"
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
        "name": "Vanguard FTSE All-World UCITS ETF",
        "identifier": "IE00BK5BQT80"
      }
    ]
  };

  // FAQ structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Jaké jsou nejlepší ETF fondy pro rok ${currentYear}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Pro rok ${currentYear} doporučujeme CSPX (americký trh), IWDA (vyspělé trhy) a VWCE (globální diverzifikace). Tyto ETF nabízejí optimální poměr nákladů, výkonnosti a rizika.`
        }
      },
      {
        "@type": "Question",
        "name": "Který ETF má nejnižší poplatky TER?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlevnější ETF mají TER poplatky od 0.03%. CSPX nabízí 0.07% TER, IWDA širokou diverzifikaci s TER 0.20%, VWCE poskytuje globální pokrytí s TER 0.22%."
        }
      },
      {
        "@type": "Question",
        "name": "Je lepší investovat do jednoho ETF nebo více ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pro začátečníky doporučujeme jeden ETF jako CSPX nebo IWDA. Pokročilejší investoři mohou kombinovat CSPX s VWCE pro lepší globální diverzifikaci."
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
        "name": `Nejlepší ETF ${currentYear}`,
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-etf-2025"
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
                <Flag className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ETF {currentYear}
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
                Kompletní srovnání nejlepších ETF fondů pro rok {currentYear}. 
                Analýza poplatků, výkonnosti a praktické tipy pro český trh.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
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

            {/* Right Content - Stats Grid */}
            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              {[
                { icon: DollarSign, title: "Nejnižší náklady", value: "0.03% TER", description: "Nejlevnější ETF dostupné v Evropě", color: "green" },
                { icon: Globe, title: "Globální pokrytí", value: "3,800+ firem", description: "Diverzifikace po celém světě", color: "blue" },
                { icon: Shield, title: "Největší fondy", value: "95B+ EUR", description: "Nejvyšší likvidita a stabilita", color: "purple" },
                { icon: TrendingUp, title: "Dlouhodobý růst", value: "9%+ ročně", description: "Historický průměrný výnos", color: "indigo" }
              ].map((item, index) => {
                const Icon = item.icon;
                const colorMap = {
                  green: "from-green-500 to-emerald-500",
                  blue: "from-blue-500 to-cyan-500", 
                  purple: "from-purple-500 to-violet-500",
                  indigo: "from-indigo-500 to-blue-500"
                };
                
                return (
                  <div key={index} className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
                    <div className={`flex items-center justify-center rounded-full bg-gradient-to-r ${colorMap[item.color]} w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                      {item.value}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-center text-sm">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Top 3 Recommendations - Client Component with Live Data */}
      <Top3ETFLiveSection 
        title={`🏆 Top 3 nejlepší ETF ${currentYear}`}
        description={`Naše doporučení nejlepších ETF fondů pro rok ${currentYear} na základě analýzy všech dostupných fondů`}
        etfTemplates={TOP_3_ETF_2025_TEMPLATE}
        colorScheme="blue"
      />

      {/* FilteredETF Sections - Client Component with Database Queries */}
      <FilteredETFSections 
        indexKeywords={["World", "S&P 500", "MSCI World", "All-World", "Global"]}
        excludeKeywords={["Leveraged", "2x", "3x", "Short", "Bear", "China", "Small Cap"]}
      />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Selection Guide */}
          <div id="pruvodce" className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-12 border border-blue-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 w-20 h-20 mx-auto mb-6">
                <Target className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                💡 Jak vybrat nejlepší ETF pro rok {currentYear}?
              </h4>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Praktický průvodce výběrem podle vašeho investičního profilu
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Pro začátečníky",
                  color: "green",
                  recommendations: [
                    "VWCE - vše v jednom ETF",
                    "Pravidelné investování měsíčně",
                    "Držení 10+ let",
                    "Ignorování krátkodobých výkyvů"
                  ]
                },
                {
                  icon: Building,
                  title: "Pro pokročilé",
                  color: "blue", 
                  recommendations: [
                    "Kombinace CSPX + IWDA",
                    "5-10% rozvíjející se trhy",
                    "Rebalancing jednou ročně",
                    "Sledování TER a velikosti"
                  ]
                },
                {
                  icon: Rocket,
                  title: "Pro experty",
                  color: "purple",
                  recommendations: [
                    "Regionální + sektorové ETF",
                    "Taktická alokace aktiv",
                    "Využití momentum efektů",
                    "Optimalizace daní"
                  ]
                }
              ].map((guide, index) => {
                const Icon = guide.icon;
                const colorClasses = {
                  green: "from-green-500 to-emerald-600",
                  blue: "from-blue-500 to-indigo-600",
                  purple: "from-purple-500 to-violet-600"
                };
                
                return (
                  <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${colorClasses[guide.color]} flex items-center justify-center mb-6 mx-auto`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h5 className="text-xl font-bold text-gray-900 text-center mb-6">{guide.title}</h5>
                    <ul className="space-y-3">
                      {guide.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Internal Linking Component */}
      <InternalLinking 
        links={[
          { href: "/nejlepsi-etf/nejlepsi-sp500-etf", text: "Nejlepší S&P 500 ETF", description: "Srovnání amerických indexových fondů" },
          { href: "/nejlepsi-etf/nejlepsi-msci-world-etf", text: "Nejlepší MSCI World ETF", description: "Globální ETF pro vyspělé trhy" },
          { href: "/nejlepsi-etf/nejlevnejsi-etf", text: "Nejlevnější ETF", description: "ETF s nejnižšími poplatky TER" },
          { href: "/nejlepsi-etf/etf-zdarma-degiro", text: "ETF zdarma na Degiro", description: "Bezplatné obchodování ETF" },
          { href: "/srovnani-etf", text: "Srovnání ETF", description: "Interaktivní nástroj pro porovnání" },
          { href: "/kde-koupit-etf", text: "Kde koupit ETF", description: "Přehled brokerů a platforem" }
        ]}
      />
    </Layout>
  );
}