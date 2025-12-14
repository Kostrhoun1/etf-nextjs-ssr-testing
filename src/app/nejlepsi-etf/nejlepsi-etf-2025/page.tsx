import React from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { StarIcon, BarChart3Icon, TargetIcon, DollarSignIcon, RocketIcon, UsersIcon, FlagIcon, TrendingUpIcon, BuildingIcon, GlobeIcon, ShieldIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import ETFTableServer from '@/components/etf/ETFTableServer';
import { getTopETFsForCategory, categoryConfigs, getTotalETFCount } from '@/lib/etf-data';
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
    title: `Nejlepší ETF ${currentYear} - CSPX vs IWDA vs VWCE`,
    description: `Top 3 nejlepší ETF fondy pro rok ${currentYear}. CSPX, IWDA, VWCE - srovnání poplatků TER, výnosů, velikosti fondů. Aktuální data k ${currentDate}.`,
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
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-etf-2025'];
  const [etfs, lastModified, totalCount] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
    getTotalETFCount(),
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
      ...(etfs.slice(0, 3).map(etf => ({
        "@type": "FinancialProduct",
        "name": etf.name,
        "identifier": etf.isin
      })))
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
          "text": `Pro rok ${currentYear} doporučujeme ${etfs[0]?.name || 'CSPX'}, ${etfs[1]?.name || 'IWDA'} a ${etfs[2]?.name || 'VWCE'}. Tyto ETF nabízejí optimální poměr nákladů, výkonnosti a rizika.`
        }
      },
      {
        "@type": "Question",
        "name": "Který ETF má nejnižší poplatky TER?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlevnější ETF mají TER poplatky od 0.03%. Mezi nejoblíbenější patří CSPX s TER 0.07%, IWDA s TER 0.20% a VWCE s TER 0.22%."
        }
      },
      {
        "@type": "Question",
        "name": "Je lepší investovat do jednoho ETF nebo více ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pro začátečníky doporučujeme jeden globální ETF jako VWCE. Pokročilejší investoři mohou kombinovat regionální ETF pro lepší kontrolu alokace."
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
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
                <FlagIcon className="w-4 h-4 mr-2" />
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
                <span className="text-gray-400">|</span>
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
                Databáze obsahuje {totalCount.toLocaleString('cs-CZ')} ETF fondů.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <Link href="#top3">
                    <StarIcon className="w-5 h-5 mr-2" />
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

            {/* Right Content - Stats Grid */}
            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              {[
                { icon: DollarSignIcon, title: "Nejnižší náklady", value: "0.03% TER", description: "Nejlevnější ETF dostupné v Evropě", color: "green" },
                { icon: GlobeIcon, title: "Globální pokrytí", value: "3,800+ firem", description: "Diverzifikace po celém světě", color: "blue" },
                { icon: ShieldIcon, title: "Největší fondy", value: "95B+ EUR", description: "Nejvyšší likvidita a stabilita", color: "purple" },
                { icon: TrendingUpIcon, title: "Dlouhodobý růst", value: "9%+ ročně", description: "Historický průměrný výnos", color: "indigo" }
              ].map((item, index) => {
                const Icon = item.icon;
                const colorMap = {
                  green: "from-green-500 to-emerald-500",
                  blue: "from-blue-500 to-cyan-500",
                  purple: "from-purple-500 to-violet-500",
                  indigo: "from-indigo-500 to-blue-500"
                };

                return (
                  <div key={index} className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6">
                    <div className={`flex items-center justify-center rounded-full bg-gradient-to-r ${colorMap[item.color as keyof typeof colorMap]} w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform`}>
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

      {/* Top 3 Recommendations - Server-side rendered with real data */}
      <section id="top3" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top 3 nejlepší ETF {currentYear}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení nejlepších ETF fondů pro rok {currentYear} na základě analýzy {etfs.length} fondů
            </p>
          </div>

          <Top3ETFServer etfs={etfs} currency="EUR" />
        </div>
      </section>

      {/* Full ETF Table - Server-side rendered */}
      <section id="srovnani" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kompletní srovnání ETF fondů
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Top {Math.min(50, etfs.length)} ETF fondů seřazených podle ratingu a velikosti
            </p>
          </div>

          <ETFTableServer etfs={etfs} showRank={true} currency="EUR" maxRows={50} />

          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-2">
              <Link href="/srovnani-etf">
                Zobrazit všech {totalCount.toLocaleString('cs-CZ')} ETF fondů
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="pruvodce" className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-12 border border-blue-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Jak vybrat nejlepší ETF pro rok {currentYear}?
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Praktický průvodce výběrem podle vašeho investičního profilu
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  icon: UsersIcon,
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
                  icon: BuildingIcon,
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
                  icon: RocketIcon,
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
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${colorClasses[guide.color as keyof typeof colorClasses]} flex items-center justify-center mb-6 mx-auto`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 text-center mb-6">{guide.title}</h4>
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
          { href: "/nejlepsi-etf/nejlepsi-akumulacni-etf", text: "Nejlepší akumulační ETF", description: "ETF s automatickým reinvestováním" },
          { href: "/nejlepsi-etf/nejlepsi-dividendove-etf", text: "Nejlepší dividendové ETF", description: "ETF s výplatou dividend" },
          { href: "/srovnani-etf", text: "Srovnání ETF", description: "Interaktivní nástroj pro porovnání" },
          { href: "/kde-koupit-etf", text: "Kde koupit ETF", description: "Přehled brokerů a platforem" }
        ]}
      />
    </Layout>
  );
}
