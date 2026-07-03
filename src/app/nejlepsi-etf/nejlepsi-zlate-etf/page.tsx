import { Metadata } from 'next'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, CrownIcon, GemIcon, DollarIcon, RocketIcon, TrendingUpIcon, ShieldIcon, GlobeIcon, AwardIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nejlepší Zlaté ETF 2026 | Srovnání a Doporučení',
    description: 'Najděte nejlepší zlaté ETF pro rok 2026. Srovnání fyzicky zajištěných Gold ETF, ochrana před inflací a diverzifikace portfolia.',
    keywords: 'zlaté ETF, nejlepší gold ETF 2026, fyzické zlato, investice do zlata, SGLD ETF, 4GLD ETF, PHGP ETF',
    openGraph: {
      title: 'Nejlepší Zlaté ETF 2026 | Srovnání a Doporučení',
      description: 'Kompletní průvodce nejlepšími zlatými ETF. Analyzujeme fyzicky zajištěné Gold ETF pro ochranu před inflací.',
      type: 'article',
      url: 'https://etf-srovnani.cz/nejlepsi-etf/nejlepsi-zlate-etf',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Nejlepší Zlaté ETF 2026',
      description: 'Srovnání nejlepších zlatých ETF pro ochranu před inflací a krizové portfolio.',
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-zlate-etf',
    },
  };
}


export default async function NejlepsiZlateETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-zlate-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší zlaté ETF ${currentYear} - fyzické zlato a ochrana před inflací`,
    "description": "Srovnání nejlepších zlatých ETF 2026. Fyzicky zajištěné Gold ETF, ochrana před inflací, krize - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-gold-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-zlate-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "zlaté ETF, fyzické zlato, gold ETF, SGLD, 4GLD, PHGP",
    "wordCount": 2800,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Gold ETF",
        "description": "Exchange-traded funds focused on gold and precious metals"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares Physical Gold ETC",
        "identifier": "IE00B4ND3602"
      },
      {
        "@type": "FinancialProduct", 
        "name": "Xtrackers Physical Gold ETC EUR Hedged",
        "identifier": "DE000A1E0HR8"
      },
      {
        "@type": "FinancialProduct",
        "name": "WisdomTree Physical Gold ETC", 
        "identifier": "JE00B1VS3333"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Physical Gold",
        "description": "Investment strategy focused on physically-backed gold investments"
      },
      {
        "@type": "Thing", 
        "name": "Inflation Hedge",
        "description": "Investment strategy using gold as protection against inflation"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší zlaté ETF v roce 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší zlaté ETF jsou: iShares Physical Gold ETC (IE00B4ND3602) největší fyzicky zajištěný zlatý ETF s 15,7 mld. EUR, Xtrackers Physical Gold ETC EUR Hedged (DE000A1E0HR8) s 8,2 mld. EUR a EUR hedgingem, a WisdomTree Physical Gold ETC (JE00B1VS3333) s 7,8 mld. EUR a TER 0,39%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou zlaté ETF a jak fungují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Zlaté ETF jsou fondy investující do fyzického zlata nebo zlatých futures. Fyzicky zajištěné ETF vlastní skutečné zlato uložené v trezorech, zatímco syntetické ETF používají deriváty."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do zlatých ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Zlaté ETF poskytují ochranu před inflací, diverzifikaci portfolia a bezpečné útočiště během krizí. Zlato má historicky negativní korelaci s akciemi a dluhopisy."
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
        "name": "Nejlepší zlaté ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-zlate-etf"
      }
    ]
  };

  return (
    <Layout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-gray-50/30 to-amber-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-yellow-200 to-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-gray-200 to-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-gray-100 text-yellow-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-yellow-200/50">
                <CrownIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-yellow-600 via-gray-600 to-amber-600 bg-clip-text text-transparent">
                  zlaté ETF
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
                Kompletní srovnání nejlepších zlatých ETF. 
                Fyzicky zajištěné Gold ETF pro ochranu před inflací a krizové situace.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-yellow-600 to-gray-600 hover:from-yellow-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <CrownIcon className="w-5 h-5 mr-2" />
                    Zlaté ETF
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-3">
                    <CrownIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Zlatý trh v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro zlaté investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-yellow-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CrownIcon className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ GOLD ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">15,7B</div>
                    <div className="text-xs text-gray-600">iShares Physical Gold</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-amber-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarIcon className="w-4 h-4 text-amber-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,12%</div>
                    <div className="text-xs text-gray-600">nejlevnější gold ETF</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-yellow-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <GemIcon className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-gray-500 font-medium">FYZICKÉ ZLATO</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-xs text-gray-600">backing ratio</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-amber-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldIcon className="w-4 h-4 text-amber-600" />
                      <span className="text-xs text-gray-500 font-medium">KRIZOVÁ OCHRANA</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">20+%</div>
                    <div className="text-xs text-gray-600">růst během krizí</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section id="uvod" className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-yellow-100 w-20 h-20 mx-auto mb-8 hover:bg-yellow-200 transition-colors hover-scale">
              <CrownIcon className="w-10 h-10 text-yellow-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou zlaté ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na fyzické zlato 
              pro ochranu před inflací a krizové situace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-gray-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShieldIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-yellow-800 transition-colors">Bezpečné útočiště</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Zlato je tisíciletí považováno za bezpečné útočiště během krizí. 
                Zachovává hodnotu při ekonomických otřesech a geopolitických napětích.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-gray-500 to-amber-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <GemIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-gray-800 transition-colors">Fyzické zajištění</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Nejlepší zlaté ETF jsou 100% zajištěny fyzickým zlatem uloženým 
                v auditovaných trezorech s plnou transparentností a pojištěním.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUpIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-amber-800 transition-colors">Ochrana před inflací</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Zlato historicky roste s inflací a chrání kupní sílu. 
                Poskytuje reálné výnosy při znehodnocování měny.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top 3 ETF Section - Server-side rendered with real data */}
      <section id="top3" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🏆 Top 3 nejlepší zlaté ETF
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení na základě analýzy {etfs.length} zlatých ETF fondů - velikost, fyzické zajištění a náklady
            </p>
          </div>

          <Top3ETFServer etfs={etfs} currency="CZK" />
        </div>
      </section>

      <Top10SectionsServer etfs={etfs} currency="CZK" categoryName="zlaté" />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="pruvodce" className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-12 border border-yellow-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-100 to-gray-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-yellow-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                👑 Jak vybrat ten správný zlatý ETF?
              </h4>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Praktický průvodce výběrem nejlepšího zlatého ETF podle vaší investiční strategie a preferencí rizika
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4">
                  <CrownIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Fyzické vs syntetické</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Fyzicky zajištěné ETF vlastní skutečné zlato (bezpečnější). 
                  Syntetické ETF používají deriváty (nižší náklady, vyšší riziko protistran).
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mb-4">
                  <DollarIcon className="w-6 h-6 text-amber-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">TER a poplatky</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Zlaté ETF mají TER 0,12-0,65%. iShares SGLD (0,25%) má nejlepší poměr 
                  velikost/náklady. Pozor na skladovací poplatky fyzického zlata.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                  <GemIcon className="w-6 h-6 text-gray-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Úložiště a audit</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Kontrolujte kde je zlato uloženo (LBMA trezoroie v Londýně) 
                  a častost auditů. Transparentnost je klíčová u fyzických ETF.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4">
                  <GlobeIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Měnové zajištění</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Zlato je denominováno v USD. EUR hedged verze (Xtrackers 4GLD) 
                  eliminují měnové riziko pro české investory.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mb-4">
                  <TrendingUpIcon className="w-6 h-6 text-amber-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Likvidita a spready</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Větší zlaté ETF mají užší bid-ask spready a lepší likviditu. 
                  iShares SGLD (15,7 mld.) má nejlepší obchodní podmínky.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                  <AwardIcon className="w-6 h-6 text-gray-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Daňové dopady</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  ETC struktura (Exchange Traded Commodity) má jiné daňové zacházení než ETF. 
                  Konzultujte s daňovým poradcem podle vaší situace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Často kladené otázky</h2>
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o zlaté ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Jaké jsou nejlepší zlaté ETF v roce 2026?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší zlaté ETF jsou: <strong>iShares Physical Gold ETC</strong> (IE00B4ND3602) 
                největší fyzicky zajištěný zlatý ETF s 15,7 mld. EUR, <strong>Xtrackers Physical Gold ETC EUR Hedged</strong> (DE000A1E0HR8) 
                s 8,2 mld. EUR a EUR hedgingem, a <strong>WisdomTree Physical Gold ETC</strong> 
                (JE00B1VS3333) s 7,8 mld. EUR a TER 0,39%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Co jsou zlaté ETF a jak fungují?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Zlaté ETF</strong> jsou fondy investující do fyzického zlata nebo zlatých futures. Fyzicky zajištěné ETF 
                vlastní skutečné zlato uložené v trezorech, zatímco syntetické ETF používají deriváty.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-yellow-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-800">Proč investovat do zlatých ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Zlaté ETF poskytují ochranu před inflací</strong>, diverzifikaci portfolia a bezpečné útočiště během krizí. 
                Zlato má historicky negativní korelaci s akciemi a dluhopisy.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-yellow-100">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-100 to-gray-100 w-20 h-20 mx-auto mb-6">
                <RocketIcon className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Připraveni investovat do král kovů?
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Zlaté ETF poskytují bezpečné útočiště a ochranu před inflací. 
                Objevte nejlepší fyzicky zajištěné Gold ETF a diverzifikujte své portfolio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-yellow-50 rounded-xl border border-yellow-100">
                <CrownIcon className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Fyzické zlato</h4>
                <p className="text-sm text-gray-600">100% zajištěné skutečným zlatem</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                <ShieldIcon className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Krizová ochrana</h4>
                <p className="text-sm text-gray-600">Bezpečné útočiště během nejistoty</p>
              </div>
              <div className="text-center p-6 bg-amber-50 rounded-xl border border-amber-100">
                <GemIcon className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Inflační hedge</h4>
                <p className="text-sm text-gray-600">Ochrana před znehodnocením měny</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-yellow-600 to-gray-600 hover:from-yellow-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                <a href="#top3">
                  <StarFilledIcon className="w-5 h-5 mr-2" />
                  Vybrat zlatý ETF
                </a>
              </Button>
              <Button asChild variant="outline" className="border-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50 px-8 py-3 text-lg font-semibold">
                <a href="/srovnani-etf">
                  <BarChart3Icon className="w-5 h-5 mr-2" />
                  Porovnat všechny ETF
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Linking */}
      <InternalLinking 
        relatedLinks={[
          {
            href: "/nejlepsi-etf/nejlepsi-komoditni-etf", 
            title: "Nejlepší komoditní ETF",
            description: "Diverzifikované komodity a suroviny"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-dluhopisove-etf",
            title: "Nejlepší dluhopisové ETF", 
            description: "Státní a korporátní dluhopisy"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-nemovitostni-etf",
            title: "Nejlepší nemovitostní ETF",
            description: "REIT fondy a nemovitosti"
          }
        ]}
      />
    </Layout>
  );
}