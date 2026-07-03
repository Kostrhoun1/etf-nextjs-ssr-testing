import React from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, FlagIcon, TrendingUpIcon, BuildingIcon, GlobeIcon, ShieldIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import type { Metadata } from 'next';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR revalidation every 24 hours
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
    title: `Nejlepší S&P 500 ETF ${currentYear} - CSPX vs SPXP vs SPY5`,
    description: `✅ Srovnání nejlepších S&P 500 ETF ${currentYear}. CSPX, SPXP, SPY5 - poplatky TER, výnosy, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: `nejlepší S&P 500 ETF ${currentYear}, CSPX ETF, SPXP ETF, SPY5 ETF, S&P 500 porovnání, americké ETF, indexové fondy USA`,
    openGraph: {
      title: `Nejlepší S&P 500 ETF ${currentYear} - CSPX vs SPXP vs SPY5`,
      description: `Srovnání nejlepších S&P 500 ETF ${currentYear}. CSPX, SPXP, SPY5 - poplatky TER, výnosy, velikost fondů.`,
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-sp500-etf',
      siteName: 'ETF průvodce.cz',
      images: [
        {
          url: 'https://www.etfpruvodce.cz/og-sp500-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší S&P 500 ETF ${currentYear}`,
        },
      ],
      locale: 'cs_CZ',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší S&P 500 ETF ${currentYear} - CSPX vs SPXP vs SPY5`,
      description: `Srovnání nejlepších S&P 500 ETF ${currentYear}. CSPX, SPXP, SPY5 - poplatky TER, výnosy, velikost fondů.`,
      images: ['https://www.etfpruvodce.cz/og-sp500-etf.jpg'],
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-sp500-etf',
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
      'article:modified_time': new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      'article:section': 'Investment Guides',
      'article:tag': 'S&P 500 ETF, CSPX, SPXP, SPY5, investování',
      'theme-color': '#3B82F6',
      'msapplication-TileColor': '#3B82F6',
      'format-detection': 'telephone=no',
    },
  };
}

export default async function NejlepsiSP500ETF() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-sp500-etf'];
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

  // Enhanced structured data with FAQs and more products
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší S&P 500 ETF ${currentYear} - CSPX vs SPXP vs SPY5`,
    "description": `Srovnání nejlepších S&P 500 ETF ${currentYear}. CSPX, SPXP, SPY5 - poplatky TER, výnosy, velikost fondů.`,
    "image": "https://www.etfpruvodce.cz/og-sp500-etf.jpg",
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
    "datePublished": `${currentYear}-01-15`,
    "dateModified": lastModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-sp500-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": `S&P 500 ETF, CSPX, SPXP, SPY5, investování, indexové fondy`,
    "wordCount": 2500,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "S&P 500 ETF",
        "description": "Exchange-traded funds tracking the S&P 500 index"
      },
      ...(etfs.slice(0, 3).map(etf => ({
        "@type": "FinancialProduct",
        "name": etf.name,
        "identifier": etf.isin
      })))
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "S&P 500 Index",
        "description": "Stock market index tracking 500 largest US companies"
      },
      {
        "@type": "Thing", 
        "name": "TER",
        "description": "Total Expense Ratio - annual fee for ETF management"
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
        "name": "Jak jste vybrali TOP 3 nejlepší S&P 500 ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Naše TOP 3 doporučení vychází z databáze více než 3000 ETF a zohledňuje klíčové faktory: velikost fondu, nízký TER, likviditu, tracking error a celkovou kvalitu. Každý ETF má 5hvězdičkové hodnocení založené na kombinaci těchto metrik."
        }
      },
      {
        "@type": "Question", 
        "name": "Jaký je rozdíl mezi akumulačními a distribučními S&P 500 ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Akumulační ETF (jako CSPX, VUAA) automaticky reinvestují dividendy zpět do fondu, což je ideální pro dlouhodobý růst. Distribuční ETF (VUSA, SPY5) vyplácejí dividendy přímo investorům - vhodné pro ty, kteří chtějí pravidelný příjem."
        }
      },
      {
        "@type": "Question",
        "name": "Který S&P 500 ETF má nejnižší náklady?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejnižší TER obvykle nabízejí specializovaní poskytovatelé ETF, zatímco největší poskytovatelé mají vyšší poplatky, ale nabízejí lepší likviditu. Podívejte se na naš žebříček podle TER pro aktuální srovnání nákladů."
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
        "name": "Nejlepší S&P 500 ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-sp500-etf"
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

      {/* Hero Section - Optimized for LCP */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center bg-white text-blue-700 px-5 py-2.5 rounded-full text-sm font-medium shadow-sm border border-blue-100">
                <FlagIcon className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  S&P 500 ETF
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
                Kompletní srovnání nejlepších S&P 500 ETF fondů dostupných pro evropské investory. 
                Analýza poplatků, výkonnosti a praktické tipy pro výběr.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow rounded-xl h-12">
                  <Link href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </Link>
                </Button>
                <Button asChild variant="outline" className="bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 px-8 py-3 text-lg font-semibold rounded-xl h-12 transition-colors">
                  <Link href="#top10">
                    <BarChart3Icon className="w-5 h-5 mr-2" />
                    Top 10 srovnání
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right Content - S&P 500 Stats Card */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-4 shadow-lg">
                    <TrendingUpIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">S&P 500 v číslech</h3>
                  <p className="text-sm text-gray-500 mt-1">Klíčové informace o indexu</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <BuildingIcon className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">500</div>
                    <div className="text-xs text-gray-600 font-medium">největších firem</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <BarChart3Icon className="w-5 h-5 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">~10%</div>
                    <div className="text-xs text-gray-600 font-medium">ročně historicky</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                    <GlobeIcon className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">80%</div>
                    <div className="text-xs text-gray-600 font-medium">amerického trhu</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                    <ShieldIcon className="w-5 h-5 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{etfs.length}+</div>
                    <div className="text-xs text-gray-600 font-medium">ETF k dispozici</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top 3 Recommendations - Server-side rendered with real data */}
      <section id="top3" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top 3 nejlepší S&P 500 ETF {currentYear}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení nejlepších S&P 500 ETF fondů na základě analýzy {etfs.length} fondů
            </p>
          </div>

          <Top3ETFServer etfs={etfs} currency="CZK" />
        </div>
      </section>

      {/* Top 10 Sections - by TER, AUM, Performance */}
      <Top10SectionsServer etfs={etfs} currency="CZK" categoryName="S&P 500" />

      {/* SECTION 0: Co je S&P 500 Index? */}
      <section id="co-je-sp500" className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-white content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              📊 Co je S&P 500 Index?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Než si vyberete konkrétní ETF, pojďme rychle vysvětlit, co vlastně sledují
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200 hover:shadow-2xl transition-all">
              <div className="text-5xl mb-4 text-center">🏢</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">500 největších firem USA</h3>
              <p className="text-gray-700 leading-relaxed">
                S&P 500 je index obsahující <strong>500 největších veřejně obchodovaných amerických společností</strong>.
                Najdete tu Apple, Microsoft, Amazon, Tesla, JPMorgan, Coca-Cola, Walmart a stovky dalších.
                Společnosti jsou <strong>váženy podle tržní kapitalizace</strong> - čím větší firma, tím větší váhu má v indexu.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200 hover:shadow-2xl transition-all">
              <div className="text-5xl mb-4 text-center">🇺🇸</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">~80% amerického trhu</h3>
              <p className="text-gray-700 leading-relaxed">
                Těchto 500 společností představuje přibližně <strong>80% celkové tržní kapitalizace amerického akciového trhu</strong>.
                Když investujete do S&P 500 ETF, získáváte expozici k největší a nejlikvidnější ekonomice světa.
                Index je spravován společností S&P Dow Jones Indices a existuje od roku 1957.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200 hover:shadow-2xl transition-all">
              <div className="text-5xl mb-4 text-center">📈</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Historický výnos ~10% ročně</h3>
              <p className="text-gray-700 leading-relaxed">
                Od svého vzniku v roce 1957 <strong>průměrný roční výnos S&P 500 činil přibližně 10%</strong> včetně reinvestovaných dividend.
                Poslední dekáda (2014-2024) byla výjimečná s průměrem ~13% ročně díky tech boomu.
                Realističtější očekávání do budoucna je 7-10% p.a. nominálně, 4-7% reálně po inflaci.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: Why These TOP 3? - Selection Criteria */}
      <section id="proc-tyto-tri" className="py-16 bg-white content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🎯 Proč právě tyto TOP 3 ETF?
          </h2>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-300">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Z desítek S&P 500 ETF na trhu jsme vybrali CSPX, SPXP a SPY5 podle těchto kritérií:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "💰", title: "Ultra nízký TER", desc: "0,05-0,07% ročně (nejlevnější na trhu)" },
                { icon: "🏰", title: "Obří velikost", desc: "10+ mld. EUR aktiv = nulové riziko uzavření" },
                { icon: "📊", title: "Precizní tracking", desc: "Tracking error pod 0,1% ročně" },
                { icon: "💧", title: "Masivní likvidita", desc: "Denní objem desítky milionů EUR" },
                { icon: "⭐", title: "Top správci", desc: "iShares (BlackRock) a Invesco = nejvyšší důvěryhodnost" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 border border-blue-200">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Is S&P 500 Right For You? */}
      <section id="je-pro-vas" className="py-16 bg-gradient-to-br from-gray-50 to-white content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            🤔 Je S&P 500 ETF správná volba pro vás?
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Perfect For */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-300">
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                <span className="text-3xl">✅</span>
                Ideální pro vás, pokud:
              </h3>
              <ul className="space-y-4">
                {[
                  { title: "Investujete na 10+ let", desc: "Potřebujete čas přečkat krátkodobé poklesy (-30% až -50%)" },
                  { title: "Věříte v USA ekonomiku", desc: "Comfort s 100% expozicí amerického trhu" },
                  { title: "Chcete pasivní strategii", desc: "Buy & hold bez nutnosti výběru jednotlivých akcií" },
                  { title: "Preferujete jednoduchost", desc: "Jediný ETF pokrývající 500 firem" }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">•</span>
                    <div>
                      <span className="font-bold text-gray-900">{item.title}</span>
                      <p className="text-sm text-gray-700">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Ideal For */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-300">
              <h3 className="text-2xl font-bold text-orange-800 mb-6 flex items-center gap-2">
                <span className="text-3xl">⚠️</span>
                Možná nevhodné, pokud:
              </h3>
              <ul className="space-y-4">
                {[
                  { title: "Potřebujete peníze do 5 let", desc: "Krátkodobá volatilita může být extrémní" },
                  { title: "Chcete globální diverzifikaci", desc: "Zvažte MSCI World (23 zemí)", link: "/nejlepsi-etf/nejlepsi-msci-world-etf" },
                  { title: "Hledáte pasivní příjem", desc: "Akumulační ETF nereinvestují dividendy. Zkuste dividendové ETF.", link: "/nejlepsi-etf/nejlepsi-dividendove-etf" },
                  { title: "Máte nízkou rizikovou toleranci", desc: "Zvažte 60/40 portfolio (akcie/dluhopisy)" }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-orange-600 font-bold mt-1">•</span>
                    <div>
                      <span className="font-bold text-gray-900">{item.title}</span>
                      <p className="text-sm text-gray-700">
                        {item.desc}
                        {item.link && (
                          <Link href={item.link} className="text-blue-600 hover:underline ml-1">
                            →
                          </Link>
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Real Cost-Benefit Math */}
      <section id="naklady-vynosy" className="py-16 bg-white content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            💰 Reálné náklady a výnosy (s matematikou)
          </h2>

          {/* TER Impact Table */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Dopad TER na váš výnos za 30 let
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl shadow-lg border border-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-indigo-100">
                    <th className="py-4 px-6 text-left font-bold text-gray-900">TER</th>
                    <th className="py-4 px-6 text-left font-bold text-gray-900">Typ fondu</th>
                    <th className="py-4 px-6 text-left font-bold text-gray-900">100k Kč → 30 let</th>
                    <th className="py-4 px-6 text-left font-bold text-gray-900">Ztráta vs 0,05%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-green-50">
                    <td className="py-4 px-6 font-bold text-green-600">0,05%</td>
                    <td className="py-4 px-6">SPXP (nejlevnější)</td>
                    <td className="py-4 px-6 font-bold">1 684 000 Kč</td>
                    <td className="py-4 px-6 text-gray-500">—</td>
                  </tr>
                  <tr className="hover:bg-blue-50">
                    <td className="py-4 px-6 font-bold text-blue-600">0,07%</td>
                    <td className="py-4 px-6">CSPX, VUAA</td>
                    <td className="py-4 px-6 font-bold">1 671 000 Kč</td>
                    <td className="py-4 px-6 text-orange-600">-13k Kč</td>
                  </tr>
                  <tr className="hover:bg-orange-50">
                    <td className="py-4 px-6 font-bold text-orange-600">0,20%</td>
                    <td className="py-4 px-6">Dražší ETF</td>
                    <td className="py-4 px-6 font-bold">1 615 000 Kč</td>
                    <td className="py-4 px-6 text-orange-600">-69k Kč</td>
                  </tr>
                  <tr className="hover:bg-red-50">
                    <td className="py-4 px-6 font-bold text-red-600">1,50%</td>
                    <td className="py-4 px-6">Aktivní fond</td>
                    <td className="py-4 px-6 font-bold">1 151 000 Kč</td>
                    <td className="py-4 px-6 text-red-600">-533k Kč (!)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-4 italic text-center">
              Výpočet: 10% průměrný roční výnos před poplatky. Rozdíl 0,05% vs 1,50% TER = <strong>půl milionu korun</strong> za 30 let.
            </p>
          </div>

          {/* Inflation-Adjusted Returns */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📉</span>
              Pozor na inflační iluzi!
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-3">Nominální výnosy (co vidíte)</h4>
                <p className="text-gray-700 mb-4">
                  100 000 Kč investovaných před 30 lety při 10% ročním výnosu = <strong>1 745 000 Kč</strong> dnes.
                  Vypadá to skvěle! Nebo ne?
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-3">Reálné výnosy (kupní síla)</h4>
                <p className="text-gray-700 mb-4">
                  Po inflaci ~3% ročně = reálný výnos ~<strong>7% ročně</strong>.
                  100k Kč → <strong>~761 000 Kč reálné kupní síly</strong>. Stále skvělé, ale realističtější.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 mt-6 border-l-4 border-orange-500">
              <p className="text-gray-900 font-medium">
                <strong>Závěr:</strong> Očekávejte <strong>7% reálný výnos dlouhodobě</strong> (po inflaci), ne 10% nominální.
                Pro příštích 30 let může být průměr dokonce nižší (4-7% reálně) kvůli vyšším valuacím dnes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Brutal Honesty About Risks */}
      <section id="brutalni-rizika" className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            ⚠️ Brutální upřímnost: Co může jít špatně
          </h2>
          <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Než investujete, musíte vědět, <strong>jak hluboké a dlouhé mohou být poklesy</strong>
          </p>

          {/* Historical Drawdowns WITH Recovery Times */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                period: "2007-2009 Finanční krize",
                drawdown: "-57%",
                recovery: "5,5 let (březen 2013)",
                example: "1M Kč → 430k Kč. Bolestivé. Spousta investorů prodala ve ztrátě.",
                color: "red"
              },
              {
                period: "2000-2002 Dot-com crash",
                drawdown: "-49%",
                recovery: "7 let (říjen 2007)",
                example: "1M Kč → 510k Kč. Nejdelší čekání na obnovu v historii.",
                color: "orange"
              },
              {
                period: "2020 COVID-19 panic",
                drawdown: "-34%",
                recovery: "5 měsíců (srpen 2020)",
                example: "1M Kč → 660k Kč. Rychlá obnova díky stimulům. Výjimka, ne pravidlo.",
                color: "yellow"
              }
            ].map((crisis, idx) => (
              <div key={idx} className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-${crisis.color}-300`}>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{crisis.period}</h3>
                <p className={`text-4xl font-bold text-${crisis.color}-600 mb-2`}>{crisis.drawdown}</p>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Čas obnovy:</strong> {crisis.recovery}
                </p>
                <p className="text-sm text-gray-600 italic">{crisis.example}</p>
              </div>
            ))}
          </div>

          {/* Currency Risk with CORRECT Math */}
          <div className="bg-white rounded-2xl p-8 mb-8 border-2 border-orange-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="text-3xl">💱</span>
              Měnové riziko USD/CZK (často podceňováno)
            </h3>
            <p className="text-gray-700 mb-4 text-lg">
              S&P 500 je denominován v USD. <strong>Kurz CZK/USD výrazně ovlivní váš výnos v korunách.</strong>
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                <h4 className="font-bold text-green-800 mb-3">Když CZK oslabí (výhoda)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  S&P roste o 10% v USD + CZK oslabí o 10% → váš výnos v CZK ≈ <strong>+21%</strong>
                </p>
                <p className="text-xs text-gray-600 italic">Vzorec: (1,10 × 1,10) - 1 = 0,21 = 21%</p>
              </div>
              <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500">
                <h4 className="font-bold text-red-800 mb-3">Když CZK posílí (nevýhoda)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  S&P roste o 10% v USD, ale CZK posílí o 15% → váš výnos v CZK ≈ <strong>-4,3%</strong>
                </p>
                <p className="text-xs text-gray-600 italic">Vzorec: (1,10 ÷ 1,15) - 1 = -0,043 = -4,3%</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 italic">
              Historicky USD/CZK kolísá ±10-20% ročně. Dlouhodobě se vyhlazuje, ale krátkodobě může bolet.
            </p>
          </div>

          {/* Concentration Risk */}
          <div className="bg-white rounded-2xl p-8 border-2 border-purple-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Koncentrační riziko: Top 10 = 30% indexu
            </h3>
            <p className="text-gray-700 mb-6">
              Přestože S&P 500 obsahuje 500 firem, <strong>top 10 společností tvoří ~30% celého indexu</strong>.
              Pokud Apple, Microsoft, Amazon, Nvidia a další tech giganty selhají, pocítíte to výrazně.
            </p>
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { name: "Apple", weight: "~7%" },
                { name: "Microsoft", weight: "~6,5%" },
                { name: "Amazon", weight: "~3,5%" },
                { name: "Nvidia", weight: "~3%" },
                { name: "Meta", weight: "~2,5%" }
              ].map((stock, idx) => (
                <div key={idx} className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                  <p className="font-bold text-gray-900">{stock.name}</p>
                  <p className="text-2xl font-bold text-purple-600">{stock.weight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Step-by-Step First Purchase */}
      <section id="prvni-nakup" className="py-16 bg-white content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            🚀 Jak nakoupit první S&P 500 ETF akcii (krok za krokem)
          </h2>

          {/* Broker Selection */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Krok 1: Vyberte brokera</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "DEGIRO",
                  pros: ["Nejpopulárnější v ČR", "Nulové poplatky za ETF v nabídce", "Jednoduchá registrace"],
                  cons: ["Minimální nákup = celá akcie (~11 500 Kč pro CSPX)"],
                  link: "/kde-koupit-etf"
                },
                {
                  name: "XTB",
                  pros: ["Zlomkové akcie (investice od ~500 Kč)", "Nulové poplatky do 100k EUR/měsíc", "Česká podpora"],
                  cons: ["Menší výběr ETF než DEGIRO"],
                  link: "/kde-koupit-etf"
                },
                {
                  name: "Interactive Brokers",
                  pros: ["Nejnižší poplatky pro velké portfolio", "Přístup k 150+ burzám", "Profesionální platforma"],
                  cons: ["Složitější UI pro začátečníky"],
                  link: "/kde-koupit-etf"
                }
              ].map((broker, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-300">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{broker.name}</h4>
                  <div className="mb-4">
                    <p className="font-bold text-green-700 mb-2">✅ Výhody:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {broker.pros.map((pro, i) => <li key={i}>• {pro}</li>)}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <p className="font-bold text-orange-700 mb-2">⚠️ Nevýhody:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {broker.cons.map((con, i) => <li key={i}>• {con}</li>)}
                    </ul>
                  </div>
                  <Link href={broker.link} className="text-blue-600 hover:underline text-sm font-medium">
                    Detailní recenze →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Purchase Process */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-300 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Kroky 2-5: První nákup</h3>
            <div className="space-y-6">
              {[
                {
                  num: "2",
                  title: "Registrace a ověření",
                  desc: "Vyplňte registrační formulář u vybraného brokera. Připravte občanku a doklad o příjmu (výplatní páska). Ověření trvá 1-3 dny.",
                  time: "⏱️ 15 minut + 1-3 dny na schválení"
                },
                {
                  num: "3",
                  title: "Vložení peněz",
                  desc: "Bankovní převod na účet brokera (IBAN najdete po přihlášení). Peníze dorazí do 1-2 dnů.",
                  time: "⏱️ 1-2 dny"
                },
                {
                  num: "4",
                  title: "Vyhledání ETF",
                  desc: "Do vyhledávacího pole zadejte ISIN: IE00B5BMR087 (CSPX) nebo IE00B3YCGJ38 (SPXP). Zkontrolujte název a burzu (London Stock Exchange).",
                  time: "⏱️ 2 minuty"
                },
                {
                  num: "5",
                  title: "Potvrzení nákupu",
                  desc: "Zvolte počet akcií (nebo částku u XTB), zkontrolujte spread, klikněte Koupit. Hotovo! První akcie ve vašem portfoliu.",
                  time: "⏱️ 3 minuty"
                }
              ].map((step) => (
                <div key={step.num} className="bg-white rounded-xl p-6 border-l-4 border-purple-500">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-gray-700 mb-2">{step.desc}</p>
                      <p className="text-sm text-purple-700 font-medium">{step.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes to Avoid */}
          <div className="bg-yellow-50 rounded-2xl p-8 border-2 border-yellow-300">
            <h3 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Časté chyby začátečníků (vyvarujte se jim!)
            </h3>
            <ul className="space-y-3">
              {[
                "Koupit špatný ticker (VUSA vs VUAA - distribuce vs akumulace)",
                "Market order místo limit order → zaplatíte vyšší spread",
                "Nákup v malých dávkách → poplatky sežerou výnos",
                "Prodej během paniky (2020 COVID = nejhorší chyba)",
                "Zapomenout na daňovou evidenci → problém za 3 roky"
              ].map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-yellow-700 font-bold mt-1">✗</span>
                  <span className="text-gray-800">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 6: Czech Tax Mastery */}
      <section id="dane-cr" className="py-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-white content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            🧾 České daně: Kompletní průvodce pro ETF investory
          </h2>

          {/* 3-Year Rule */}
          <div className="bg-white rounded-2xl p-8 mb-8 border-2 border-green-300 shadow-lg">
            <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">🎁</span>
              Zlaté pravidlo: 3 roky = 0% daň
            </h3>
            <p className="text-lg text-gray-700 mb-4">
              Podle <strong>§ 4 odst. 1 písm. w) zákona o daních z příjmů</strong>:
              Prodej cenných papírů po <strong>3+ letech držby je osvobozen od daně z kapitálového zisku</strong>.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                <h4 className="font-bold text-green-900 mb-3">✅ Prodej po 3+ letech</h4>
                <p className="text-gray-700 mb-2">Nákup: 1. ledna 2022</p>
                <p className="text-gray-700 mb-2">Nejdřívější prodej bez daně: <strong>2. ledna 2025</strong></p>
                <p className="text-green-700 font-bold">Daň: 0% 🎉</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-500">
                <h4 className="font-bold text-orange-900 mb-3">⚠️ Prodej před 3 lety</h4>
                <p className="text-gray-700 mb-2">Nákup: 1. ledna 2022</p>
                <p className="text-gray-700 mb-2">Prodej: 31. prosince 2024 (2 roky 365 dní)</p>
                <p className="text-orange-700 font-bold">Daň: 15% ze zisku 😢</p>
              </div>
            </div>
          </div>

          {/* FIFO Method */}
          <div className="bg-white rounded-2xl p-8 mb-8 border-2 border-blue-300">
            <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">📅</span>
              FIFO pravidlo: První nakoupené = první prodané
            </h3>
            <p className="text-lg text-gray-700 mb-4">
              V ČR se používá <strong>FIFO (First In, First Out)</strong> metoda.
              Když prodáváte, <strong>automaticky se počítá, že prodáváte nejstarší akcie</strong>.
            </p>
            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
              <h4 className="font-bold text-gray-900 mb-3">Příklad FIFO kalkulace:</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• <strong>15. 1. 2021:</strong> Nákup 10 akcií CSPX po 400 EUR</p>
                <p>• <strong>1. 6. 2022:</strong> Nákup 10 akcií CSPX po 450 EUR</p>
                <p>• <strong>20. 1. 2025:</strong> Prodej 10 akcií CSPX po 550 EUR</p>
                <p className="mt-4 pt-4 border-t-2 border-blue-300">
                  <strong>Výpočet:</strong> Prodáváte nejstarší akcie (z 15. 1. 2021).
                  Od nákupu uplynuly 4+ roky → <strong className="text-green-600">Daň = 0%</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Accumulating vs Distributing */}
          <div className="bg-white rounded-2xl p-8 mb-8 border-2 border-purple-300">
            <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">💸</span>
              Akumulační vs Distribuční ETF (daňový rozdíl)
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
                <h4 className="font-bold text-purple-900 mb-3">Akumulační (CSPX, VUAA)</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Dividendy se <strong>reinvestují automaticky</strong> uvnitř fondu.
                  Nedostanete je na účet → <strong>žádná srážková daň v ČR</strong>.
                </p>
                <p className="text-xs text-gray-600 italic">
                  USA strhne 15% dividendovou daň na úrovni fondu kvůli USA-Irsko smlouvě.
                  Zbytek se reinvestuje. Vy neplatíte nic navíc.
                </p>
                <p className="mt-4 font-bold text-green-700">✅ Daňově efektivnější!</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-500">
                <h4 className="font-bold text-orange-900 mb-3">Distribuční (VUSA, IUSA)</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Dividendy se <strong>vyplácejí na váš účet</strong>.
                  USA strhne 15% → zbytek přijde vám → <strong>musíte přiznat v daňovém přiznání</strong>.
                </p>
                <p className="text-xs text-gray-600 italic">
                  USA daň (15%) si můžete odečíst jako „zahraniční daň" v ř. 63.
                  Obvykle neplatíte dodatečně, ale musíte to uvést v přiznání.
                </p>
                <p className="mt-4 font-bold text-orange-700">⚠️ Administrativní zátěž</p>
              </div>
            </div>
          </div>

          {/* W-8BEN Myth Busted */}
          <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-300">
            <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">🚫</span>
              Mýtus: „Musím vyplnit W-8BEN formulář"
            </h3>
            <p className="text-lg text-gray-700 mb-4">
              <strong>NE.</strong> W-8BEN je formulář pro <strong>US-domiciled ETF</strong> (např. SPY, VOO).
              Pro <strong>irské ETF</strong> (CSPX, VUAA, SPXP) W-8BEN vyplňuje <strong>správce fondu</strong>, ne vy jako investor.
            </p>
            <p className="text-gray-700">
              Irsko má s USA daňovou smlouvu, která automaticky snižuje withholding tax na dividendy z 30% na 15%.
              Jako retail investor v ČR kupující irské ETF <strong>nepotřebujete W-8BEN</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: DCA vs Lump Sum (Vanguard Study) */}
      <section id="dca-lumpsum" className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-white content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            📊 DCA vs Lump Sum: Co ukazuje Vanguard Research?
          </h2>

          {/* Vanguard Study Results */}
          <div className="bg-white rounded-2xl p-8 mb-8 border-2 border-purple-300 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="text-3xl">📈</span>
              Vanguard (2012): Lump sum vyhrává v 66% případů
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Vanguard analyzoval historická data z USA, UK a Austrálie za posledních 90 let.
              Zjištění: <strong>Lump sum investice (vše najednou) dosahuje vyššího výnosu v 66% případů</strong> oproti DCA (rozložení do 12 měsíců).
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                <h4 className="font-bold text-green-800 mb-3">Proč lump sum vyhrává?</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Time in market {'>'}  timing the market</strong></li>
                  <li>• Akciové trhy rostou 70% času (mean reversion)</li>
                  <li>• Každý den čekání = ušlý compound growth</li>
                  <li>• Mathematicky: vyšší průměrný výnos</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-800 mb-3">Kdy DCA dává smysl?</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Psychologická pohoda</strong> (strach z market timingu)</li>
                  <li>• Pravidelný příjem (mzda) → žádný velký kapitál</li>
                  <li>• Extrémní valuace (P/E 30+) → snížení vstupního rizika</li>
                  <li>• Disciplína: Eliminuje prokrastinaci</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hybrid Approach */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Hybrid strategie: Best of both worlds
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Máte 300 000 Kč na investici, ale bojíte se investovat vše najednou?
              Zkuste <strong>50-75% immediate + zbytek DCA</strong> po 3-6 měsíců.
            </p>
            <div className="bg-white rounded-xl p-6 border-l-4 border-indigo-500">
              <h4 className="font-bold text-gray-900 mb-3">Příklad: 300k Kč investice</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Den 1:</strong> Investujte 200k Kč (67%) do CSPX</p>
                <p><strong>Měsíc 2-5:</strong> Zbylých 100k Kč rozložte po 25k Kč měsíčně</p>
                <p className="mt-4 pt-4 border-t border-gray-300">
                  <strong>Výhody:</strong> Většina peněz okamžitě pracuje (compound growth),
                  ale máte rezervu pro průměrování během prvních měsíců (psychological comfort).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: S&P 500-Specific Pro Optimization Tips */}
      <section id="pro-tipy" className="py-16 bg-white content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            ⚡ 5 pokročilých tipů specifických pro S&P 500 ETF
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Tyto strategie fungují specificky pro S&P 500 index a jeho strukturu. Neplatí pro NASDAQ, MSCI World ani jiné indexy.
          </p>

          <div className="space-y-8">
            {/* Tip 1: January Effect */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    📅 Využijte "January Effect" po rebalancování
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    S&P 500 index se <strong>rebalancuje každý kvartál</strong>, ale největší změny přicházejí v prosinci/lednu.
                    Akcie, které jsou odstraněny z indexu, často krátkodobě klesají kvůli panic sellingu institucionálních investorů.
                    Naopak nově přidané akcie rostou díky forced buying (ETF musí nakoupit).
                  </p>
                  <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-800 font-medium mb-2">💡 Praktická strategie:</p>
                    <p className="text-sm text-gray-700">
                      Pokud investujete pravidelně (DCA), nastavte měsíční nákup na <strong>2. půlku ledna</strong> po rebalanci,
                      kdy je trh klidnější a volatilita nižší. Vyhnete se krátkodobým cenové výkyvům v prosinci.
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: Tento efekt je specifický pro S&P 500. NASDAQ 100 má jiný rebalancing kalendář,
                    MSCI World je tržně vážený bez pevných rebalancing dat.
                  </p>
                </div>
              </div>
            </div>

            {/* Tip 2: Magnificent 7 Weight */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🎯 Sledujte váhu "Magnificent 7" před každým nákupem
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    S&P 500 není stejně vážený - <strong>TOP 7 technologických akcií</strong> (Apple, Microsoft, Google, Amazon, Nvidia, Meta, Tesla)
                    tvoří často <strong>25-30% celého indexu</strong>. Tato koncentrace výrazně ovlivňuje rizikový profil.
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border-l-4 border-red-500 pl-4">
                        <p className="text-sm font-bold text-red-800 mb-1">⚠️ Váha TOP 7 {'>'} 30%</p>
                        <p className="text-xs text-gray-700">
                          Zvažte přidat Small-Cap ETF nebo International ETF pro diverzifikaci.
                          Příliš vysoká tech koncentrace = vyšší volatilita.
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm font-bold text-green-800 mb-1">✅ Váha TOP 7 {'<'} 25%</p>
                        <p className="text-xs text-gray-700">
                          S&P 500 je vyváženější, nižší koncentrační riziko.
                          Bezpečnější čas pro větší alokaci do S&P 500.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Kde sledovat aktuální váhu:</strong> <a href="https://www.slickcharts.com/sp500" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SlickCharts.com/sp500</a>
                    {' '}(aktualizováno denně)
                  </p>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: NASDAQ 100 má ještě vyšší tech koncentraci (očekávaná vlastnost),
                    MSCI World má globální diverzifikaci (TOP 10 = jen 15%).
                  </p>
                </div>
              </div>
            </div>

            {/* Tip 3: Sector Rotation */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🔄 Využijte Sector Rotation v medvědích trzích
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    S&P 500 má pevně definovaných <strong>11 sektorů (GICS classification)</strong>.
                    V recesích každý sektor reaguje jinak podle své cyklické citlivosti.
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-sm font-bold text-gray-900 mb-3">Historické průměrné poklesy během recesí:</p>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="text-gray-700">Consumer Discretionary</span>
                        <span className="font-bold text-red-600">-40%</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                        <span className="text-gray-700">Technology</span>
                        <span className="font-bold text-orange-600">-35%</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <span className="text-gray-700">Financials</span>
                        <span className="font-bold text-yellow-700">-30%</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-gray-700">Healthcare</span>
                        <span className="font-bold text-green-600">-15%</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="text-gray-700">Utilities</span>
                        <span className="font-bold text-blue-600">-12%</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-emerald-50 rounded">
                        <span className="text-gray-700">Consumer Staples</span>
                        <span className="font-bold text-emerald-600">-10%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-800 font-medium mb-2">💡 Pokročilá strategie pro medvědí trh:</p>
                    <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                      <li>Když S&P 500 klesne {'>'} 20% (oficiální bear market), neinvestujte vše najednou</li>
                      <li>Rozdělte kapitál na 6 měsíčních dávek (DCA do dna recese)</li>
                      <li>V 2. polovině recese zvažte: 70% broad S&P 500 ETF + 30% Healthcare Sector ETF</li>
                    </ol>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: NASDAQ nemá jasné sektorové rozdělení (dominance tech),
                    MSCI World má jiné geografické/sektorové korelace.
                  </p>
                </div>
              </div>
            </div>

            {/* Tip 4: Core-Satellite Tax Optimization */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border-2 border-orange-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🎯 S&P 500 jako "core" + aktivní satelity pro daňovou optimalizaci
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Pro české daně (15% z kapitálových výnosů, 0% po 3+ letech) je výhodná strategie <strong>80/20 split</strong>:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-xl p-4 border-l-4 border-green-500">
                      <p className="font-bold text-green-800 mb-2">✅ 80% Core: S&P 500 ETF</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Buy & hold na 10-20+ let</li>
                        <li>• Jednorázová daň až při finálním prodeji</li>
                        <li>• Široká diverzifikace = nízké riziko</li>
                        <li>• Compound growth bez drag z daní</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
                      <p className="font-bold text-blue-800 mb-2">🎲 20% Satelity: Aktivní pozice</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Individual stocks nebo thematic ETF</li>
                        <li>• Tax-loss harvesting příležitosti</li>
                        <li>• Vyšší volatilita = vyšší potenciál</li>
                        <li>• Flexibilita pro rebalancing</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-800 font-medium mb-2">📊 Příklad tax-loss harvesting:</p>
                    <p className="text-sm text-gray-700">
                      Rok 2025: V satelitní části prodáte ztrátovou tech akcii s -30% (-10k Kč ztráta).
                      Stejný rok prodáte část S&P 500 ETF se ziskem +15k Kč.
                      Zdanitelný základ: 15k - 10k = 5k Kč → daň 750 Kč místo 2 250 Kč (úspora 1 500 Kč).
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: S&P 500 je ideální "core" díky široké diverzifikaci + dlouhé track record.
                    NASDAQ je příliš volatilní pro core pozici (vhodný pro satelity).
                  </p>
                </div>
              </div>
            </div>

            {/* Tip 5: EUR/USD Correlation */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-300 hover:shadow-xl transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    5
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    💱 Sledujte EUR/USD a USA-EU ekonomickou divergenci
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    S&P 500 a STOXX Europe 600 mají korelaci pouze <strong>0.60-0.65</strong> (ne perfektní).
                    Když evropská ekonomika slábne, ale USA zůstává silná, S&P 500 často vykazuje lepší relativní performance.
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-sm font-bold text-gray-900 mb-3">🎯 Optimální timing pro nákup (pro české investory):</p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                          <p className="text-sm font-bold text-green-800">Euro silné ({'>'} 1.12 USD)</p>
                          <p className="text-xs text-gray-700">
                            CZK obvykle koreluje s EUR → silné euro = levnější USD aktiva.
                            S&P 500 v CZK je relativně výhodný.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                          <p className="text-sm font-bold text-green-800">S&P 500 v korekci (-10% až -20%)</p>
                          <p className="text-xs text-gray-700">
                            Technická příležitost + fundamentální síla US ekonomiky = atraktivní entry point.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                          <p className="text-sm font-bold text-orange-800">Euro slabé ({'<'} 1.05 USD)</p>
                          <p className="text-xs text-gray-700">
                            CZK slábne s eurem → USD aktiva dražší. Zvažte odložit nákup nebo snížit velikost pozice.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 border-l-4 border-indigo-500">
                    <p className="text-sm text-gray-800 font-medium mb-2">🔧 Nástroje pro sledování:</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• EUR/USD kurz: <a href="https://www.cnb.cz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ČNB.cz</a> (denní fixing)</li>
                      <li>• USA-EU growth differential: <a href="https://tradingeconomics.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">TradingEconomics.com</a></li>
                      <li>• Makro analýza: <a href="https://fred.stlouisfed.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">FRED St. Louis Fed</a> (free)</li>
                    </ul>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    ⚠️ Poznámka: Tato strategie nefunguje pro NASDAQ (vyšší globální tech korelace)
                    ani MSCI World (obsahuje Evropu = menší divergence).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: E-E-A-T Footer - Data Sources & Disclaimer */}
      <section id="eeat-footer" className="py-16 bg-gradient-to-br from-gray-50 to-white content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-300 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-4xl">📚</span>
              Zdroje dat, metodologie a disclaimer
            </h2>

            {/* Data Sources */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Finanční data</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">→</span>
                    <span><strong>justETF.com</strong> - ETF databáze, TER, velikost fondů, tracking error, performance data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">→</span>
                    <span><strong>S&P Dow Jones Indices</strong> - Oficiální S&P 500 historická data, složení indexu, drawdown analýzy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">→</span>
                    <span><strong>Česká národní banka (ČNB)</strong> - USD/CZK měnové kurzy pro currency conversion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">→</span>
                    <span><strong>European Central Bank (ECB)</strong> - EUR/USD měnové kurzy</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">📖 Legislativa a výzkum</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">→</span>
                    <span><strong>Zákon č. 586/1992 Sb.</strong> - Zákon o daních z příjmů (§ 4 odst. 1 písm. w) - 3letá osvobození</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">→</span>
                    <span><strong>Vanguard Research (2012)</strong> - "Dollar-cost averaging vs. lump-sum investing: How investors should approach portfolio allocation strategies"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">→</span>
                    <span><strong>USA-Ireland Tax Treaty</strong> - Dividendová srážková daň 15% pro irské ETF</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Update Frequency */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8 border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🔄 Frekvence aktualizací</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700">
                <div>
                  <p className="font-bold text-blue-700 mb-2">ETF ceny & výnosy</p>
                  <p>Automatická aktualizace z databáze při každém načtení stránky</p>
                </div>
                <div>
                  <p className="font-bold text-blue-700 mb-2">TER & velikost fondů</p>
                  <p>Týdenní synchronizace s justETF.com databází</p>
                </div>
                <div>
                  <p className="font-bold text-blue-700 mb-2">Poslední update</p>
                  <p className="font-bold text-gray-900">{new Date(lastModified).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-300">
              <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Právní upozornění (YMYL content)
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                <strong>Tento článek je pouze pro vzdělávací a informační účely.</strong> Nepředstavuje investiční doporučení, nabídku,
                výzvu ani poradenství k nákupu nebo prodeji finančních nástrojů. Investování do ETF s sebou nese riziko ztráty části
                nebo celého investovaného kapitálu.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                <strong>Historická výkonnost nezaručuje budoucí výnosy.</strong> Všechna uvedená data jsou aktuální k datu publikace,
                ale mohou se měnit. Hodnoty TER, velikosti fondů, výnosů a dalších metrik se mohou lišit podle zdroje a data měření.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Před investicí pečlivě zvažte své <strong>finanční cíle, investiční horizont, zkušenosti a rizikovou toleranci</strong>.
                V případě potřeby konzultujte s <strong>nezávislým finančním poradcem nebo daňovým poradcem</strong> specializovaným na kapitálové trhy.
                Autoři nejsou placeni žádným brokerem ani ETF poskytovatelem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-purple-100 w-20 h-20 mx-auto mb-8 hover:bg-purple-200 transition-colors hover-scale">
              <span className="text-2xl">❓</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Často kladené otázky o S&P 500 ETF
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Odpovědi na nejčastější dotazy o investování do S&P 500 ETF
            </p>
          </div>

          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.2s]">
            <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "Jak jste vybrali TOP 3 nejlepší S&P 500 ETF?",
                answer: "Naše TOP 3 doporučení vychází z databáze více než 3000 ETF a zohledňuje klíčové faktory: velikost fondu, nízký TER, likviditu, tracking error a celkovou kvalitu. Každý ETF má 5hvězdičkové hodnocení založené na kombinaci těchto metrik."
              },
              {
                question: "Co znamenají TOP 10 žebříčky podle TER, velikosti fondu a výkonu?",
                answer: "Naše žebříčky jsou generovány živě z databáze a filtrují pouze legitimní S&P 500 ETF. Automaticky vylučujeme čínské ETF, sektorové ETF a pákové (leveraged) produkty. Data jsou aktualizována pravidelně pro nejpřesnější srovnání."
              },
              {
                question: "Proč se v seznamech neobjevují některé populární ETF?",
                answer: "Naše filtry automaticky vylučují ETF, které nesledují čistě S&P 500 index - například KraneShares China S&P 500 ETF (sleduje čínský index), sektorové ETF jako Consumer Discretionary, nebo pákové ETF s 2x/3x multiplikátorem."
              },
              {
                question: "Jaký je rozdíl mezi akumulačními a distribučními S&P 500 ETF?",
                answer: "Akumulační ETF (jako CSPX, VUAA) automaticky reinvestují dividendy zpět do fondu, což je ideální pro dlouhodobý růst. Distribuční ETF (VUSA, SPY5) vyplácejí dividendy přímo investorům - vhodné pro ty, kteří chtějí pravidelný příjem."
              },
              {
                question: "Který S&P 500 ETF má nejnižší náklady?",
                answer: "Nejnižší TER obvykle nabízejí specializovaní poskytovatelé ETF, zatímco největší poskytovatelé mají vyšší poplatky, ale nabízejí lepší likviditu. Podívejte se na naš žebříček podle TER pro aktuální srovnání nákladů."
              },
              {
                question: "Jsou data v žebříčcích aktuální?",
                answer: "Ano, všechny žebříčky jsou generovány živě z naší databáze při každém načtení stránky. Zahrnují nejnovější data o TER, velikosti fondů, výkonnosti a dalších klíčových metrikách S&P 500 ETF dostupných pro evropské investory."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <section className="py-20 content-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-green-100 w-20 h-20 mx-auto mb-8 hover:bg-green-200 transition-colors hover-scale">
              <ZapIcon className="w-10 h-10 text-green-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Připraveni investovat do S&P 500?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Najděte si ideálního brokera a začněte s investováním do nejlepších S&P 500 ETF
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="hover-scale bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold">
                <Link href="/kde-koupit-etf">
                  <UsersIcon className="w-5 h-5 mr-2" />
                  Najít brokera pro ETF
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="hover-scale border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
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
              title: "Nejlepší NASDAQ ETF",
              href: "/nejlepsi-etf/nejlepsi-nasdaq-etf",
              description: "Srovnání technologických ETF na NASDAQ 100 index"
            },
            {
              title: "Nejlepší světové ETF",
              href: "/nejlepsi-etf/nejlepsi-msci-world-etf", 
              description: "Globální diverzifikace s MSCI World ETF"
            },
            {
              title: "Kde koupit S&P 500 ETF",
              href: "/kde-koupit-etf",
              description: "Srovnání brokerů pro investice do amerických ETF"
            },
            {
              title: "Portfolio strategie s S&P 500",
              href: "/portfolio-strategie",
              description: "Modelová portfolia obsahující S&P 500 ETF"
            }
          ]}
        />
      </div>

    </Layout>
  );
}