import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Star, BarChart3, Target , DollarSign, Rocket, Zap, Users, TrendingUp, Building, Shield, Globe, Award, Flag} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import type { Metadata } from 'next';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// Top 3 doporučené čínské ETF - editoriální výběr s live daty z databáze
const TOP_3_CHINA_ETFS_TEMPLATE = [
  {
    name: "iShares MSCI China UCITS ETF USD (Acc)",
    ticker: "ICHN",
    isin: "IE00BJ5JPG56",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší čínský ETF s expozicí k celému čínskému trhu. Obsahuje H-akcie, red chips a P-chips obchodované v Hong Kongu.",
  },
  {
    name: "Franklin FTSE China UCITS ETF", 
    ticker: "FLCH",
    isin: "IE00BHZRR147",
    provider: "Franklin Templeton",
    degiroFree: false,
    reason: "Nízký TER 0,19% a široká expozice k čínskému trhu přes FTSE China index s více než 700 společnostmi.",
  },
  {
    name: "iShares MSCI China A UCITS ETF",
    ticker: "ICNA", 
    isin: "IE00BQT3WG13",
    provider: "iShares",
    degiroFree: false,
    reason: "Jedinečná expozice k A-akciím obchodovaným přímo na čínských burzách v Šanghaji a Shenzhenu.",
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
    title: `Nejlepší čínské ETF ${currentYear} - MSCI China vs CSI 300`,
    description: `✅ Srovnání nejlepších čínských ETF ${currentYear}. MSCI China, CSI 300, A-akcie - poplatky TER, výnosy, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'čínské ETF',
      'MSCI China ETF',
      'CSI 300 ETF',
      `nejlepší čínské ETF ${currentYear}`,
      'čínský akciový trh',
      'ETF China',
      'iShares MSCI China',
      'Franklin China ETF',
      'investice do Číny',
      'čínské akcie ETF',
      'A-akcie ETF',
      'Hong Kong ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší čínské ETF ${currentYear} - MSCI China vs CSI 300`,
      description: `Srovnání nejlepších čínských ETF ${currentYear}. MSCI China, CSI 300, A-akcie - poplatky TER, výnosy, velikost fondů.`,
      type: 'article',
      locale: 'cs_CZ',
      siteName: 'ETF Průvodce',
      images: [
        {
          url: '/og-chinese-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší čínské ETF ${currentYear} - průvodce a porovnání`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší čínské ETF ${currentYear} - MSCI China vs CSI 300`,
      description: `Srovnání nejlepších čínských ETF ${currentYear}. MSCI China, CSI 300, A-akcie - poplatky TER, výnosy, velikost fondů.`,
      images: ['/og-chinese-etf.jpg']
    },
    alternates: {
      canonical: 'https://etf-pruvodce.cz/nejlepsi-etf/nejlepsi-cinske-etf'
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

export default async function NejlepsiCinskeETF() {
  // Get last modified date from database (all ETF updates)
  const lastModified = await getLastModifiedDate();

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
    "headline": `Nejlepší čínské ETF ${currentYear} - MSCI China vs CSI 300`,
    "description": `Srovnání nejlepších čínských ETF ${currentYear}. MSCI China, CSI 300, A-akcie - poplatky TER, výnosy, velikost fondů.`,
    "image": "https://www.etfpruvodce.cz/og-chinese-etf.jpg",
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
    "datePublished": "2025-01-15",
    "dateModified": lastModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-cinske-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "čínské ETF, MSCI China, CSI 300, investování, indexové fondy",
    "wordCount": 2500,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Čínské ETF",
        "description": "Exchange-traded funds tracking Chinese stock market indices"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares MSCI China UCITS ETF USD (Acc)",
        "identifier": "IE00BJ5JPG56"
      },
      {
        "@type": "FinancialProduct", 
        "name": "Franklin FTSE China UCITS ETF",
        "identifier": "IE00BHZRR147"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares MSCI China A UCITS ETF", 
        "identifier": "IE00BQT3WG13"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "MSCI China Index",
        "description": "Stock market index tracking largest Chinese companies"
      },
      {
        "@type": "Thing", 
        "name": "CSI 300",
        "description": "Stock market index of 300 largest Chinese companies"
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
        "name": "Jaké jsou nejlepší čínské ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší čínské ETF jsou: iShares MSCI China UCITS ETF (IE00BJ5JPG56) s TER 0,28% a velikostí 3,5 mld EUR, Franklin FTSE China UCITS ETF (IE00BHZRR147) s TER 0,19% a velikostí 1,8 mld EUR, a iShares MSCI China A UCITS ETF (IE00BQT3WG13) s TER 0,40%."
        }
      },
      {
        "@type": "Question", 
        "name": "Jaký je rozdíl mezi MSCI China a CSI 300?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MSCI China zahrnuje čínské společnosti obchodované v Hong Kongu (H-akcie, red chips, P-chips) a pokrývá offshore čínský trh. CSI 300 sleduje 300 největších čínských společností obchodovaných přímo na burzách v Šanghaji a Shenzhenu (A-akcie)."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do čínských ETF?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Čínské ETF nabízejí expozici k druhé největší ekonomice světa s rychlým růstem a inovativními technologickými společnostmi. Čína má velký domácí trh, silnou digitální ekonomiku a atraktivní valuace oproti vyspělým trhům."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou náklady na čínské ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TER čínských ETF se pohybuje od 0,19% do 0,65% ročně. Nejnižší TER má Franklin FTSE China ETF (0,19%), iShares MSCI China má TER 0,28% a iShares China A má TER 0,40%. Kromě TER počítejte s transakčními poplatky brokera."
        }
      },
      {
        "@type": "Question",
        "name": "Jaká jsou rizika čínských ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Rizika zahrnují politickou volatilitu, měnové riziko CNY/USD, regulační změny čínské vlády, geopolitické napětí USA-Čína a nižší likviditu než u vyspělých trhů. Doporučuje se čínské ETF jako menší část portfolia (5-10%)."
        }
      },
      {
        "@type": "Question",
        "name": "Kde koupit čínské ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Čínské ETF můžete koupit u všech hlavních brokerů: Degiro (iShares MSCI China IE00BJ5JPG56 zdarma), XTB, Interactive Brokers, Trading 212. Naše TOP 3 doporučené ETF jsou dostupné na všech platformách."
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
        "name": "Nejlepší čínské ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-cinske-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-red-50/30 to-yellow-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-yellow-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-red-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-red-100 text-red-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-red-200/50">
                <Flag className="w-4 h-4 mr-2" />
                Aktuální k {currentDate}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-yellow-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                  čínské ETF
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
                Kompletní srovnání nejlepších čínských ETF fondů dostupných pro evropské investory. 
                Analýza MSCI China vs CSI 300 a praktické tipy pro výběr.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
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
            
            {/* Right Content - Market Stats */}
            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                
                {/* Simple Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-3">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Čínský trh v číslech
                  </h3>
                  <p className="text-sm text-gray-600">Klíčová fakta o čínských investicích</p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-yellow-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-gray-500 font-medium">EKONOMIKA</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">2.</div>
                    <div className="text-xs text-gray-600">největší na světě</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-red-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-gray-500 font-medium">HDP</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">17,7B</div>
                    <div className="text-xs text-gray-600">USD ročně</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-yellow-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-gray-500 font-medium">MSCI CHINA</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">700+</div>
                    <div className="text-xs text-gray-600">čínských firem</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-red-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-gray-500 font-medium">DIVERZIFIKACE</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">15+</div>
                    <div className="text-xs text-gray-600">ETF k dispozici</div>
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
            <div className="flex items-center justify-center rounded-full bg-yellow-100 w-20 h-20 mx-auto mb-8 hover:bg-yellow-200 transition-colors hover-scale">
              <Building className="w-10 h-10 text-red-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co je čínský akciový trh?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Druhá největší ekonomika světa s obrovským domácím trhem a rychle rostoucími technologickými společnostmi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.2s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-red-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-red-800 transition-colors">
                Druhá největší ekonomika
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Čína je druhá největší ekonomika světa s HDP přes 17,7 bilionu USD a rychlým růstem domácího trhu.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.3s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-yellow-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-red-800 transition-colors">
                Digitální revoluce
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Čínské společnosti vedou v e-commerce, fintech, AI a elektromobilitě s obrovským domácím trhem.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{"animationDelay": "0.4s"}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-red-800 transition-colors">
                Globální lídři
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Domov Alibaba, Tencent, BYD, CATL a dalších světově uznávaných technologických gigantů.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Top 3 Recommendations - Client Component with Live Data */}
      <Top3ETFLiveSection 
        title="🏆 Top 3 nejlepší čínské ETF"
        description="Naše doporučení na základě analýzy všech dostupných čínských ETF"
        etfTemplates={TOP_3_CHINA_ETFS_TEMPLATE}
        colorScheme="red"
      />

      {/* FilteredETF Sections - Client Component with Database Queries */}
      <FilteredETFSections 
        indexKeywords={["China"]}
        excludeKeywords={["ex-China", "ex China", "Sector", "KraneShares"]}
      />

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nejčastější otázky
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Odpovědi na časté dotazy ohledně čínských ETF
            </p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Jaké jsou nejlepší čínské ETF v roce 2025?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší čínské ETF jsou: <strong>iShares MSCI China UCITS ETF</strong> (IE00BJ5JPG56) 
                s TER 0,28% a velikostí 3,5 mld EUR, <strong>Franklin FTSE China UCITS ETF</strong> (IE00BHZRR147) 
                s TER 0,19% a velikostí 1,8 mld EUR, a <strong>iShares MSCI China A UCITS ETF</strong> 
                (IE00BQT3WG13) s TER 0,40% a velikostí 1,9 mld EUR.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Jaký je rozdíl mezi MSCI China a CSI 300?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>MSCI China</strong> zahrnuje čínské společnosti obchodované v Hong Kongu (H-akcie, red chips, P-chips) 
                a pokrývá offshore čínský trh. <strong>CSI 300</strong> sleduje 300 největších čínských společností 
                obchodovaných přímo na burzách v Šanghaji a Shenzhenu (A-akcie) a poskytuje expozici k onshore čínskému trhu.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Proč investovat do čínských ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Čínské ETF nabízejí expozici k <strong>druhé největší ekonomice světa</strong> s rychlým růstem 
                a inovativními technologickými společnostmi. Čína má obrovský domácí trh, silnou digitální ekonomiku 
                a zajímavé valuace. ETF poskytují diverzifikovaný přístup k čínskému trhu s rozumnými poplatky.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Jaké jsou náklady na čínské ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>TER čínských ETF</strong> se pohybuje od 0,19% do 0,65% ročně. Nejnižší TER má 
                <strong>Franklin FTSE China ETF</strong> (IE00BHZRR147) s 0,19%, <strong>iShares MSCI China</strong> 
                (IE00BJ5JPG56) má TER 0,28% a <strong>iShares China A</strong> (IE00BQT3WG13) má TER 0,40%. 
                Kromě TER počítejte s transakčními poplatky u brokera.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Jaká jsou rizika čínských ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Rizika čínských ETF</strong> zahrnují politickou volatilitu, měnové riziko CNY/USD, 
                regulační změny čínské vlády, geopolitické napětí USA-Čína a nižší likviditu než u vyspělých trhů. 
                Doporučuje se čínské ETF jako menší část portfolia (5-10%) pro diverzifikaci.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Kde koupit čínské ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Čínské ETF můžete koupit u všech hlavních brokerů: <strong>Degiro</strong> (iShares MSCI China 
                IE00BJ5JPG56 zdarma), <strong>XTB</strong>, <strong>Interactive Brokers</strong>, <strong>Trading 212</strong>. 
                Naše TOP 3 doporučené ETF - iShares MSCI China, Franklin FTSE China a iShares China A - 
                jsou dostupné na všech platformách.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Linking Component */}
      <InternalLinking 
        currentPage="cinske-etf"
        relatedLinks={[
          {
            title: "Nejlepší S&P 500 ETF",
            href: "/nejlepsi-etf/nejlepsi-sp500-etf",
            description: "Kompletní průvodce americkými S&P 500 ETF"
          },
          {
            title: "Nejlepší japonské ETF", 
            href: "/nejlepsi-etf/nejlepsi-japonske-etf",
            description: "Srovnání nejlepších japonských ETF fondů"
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