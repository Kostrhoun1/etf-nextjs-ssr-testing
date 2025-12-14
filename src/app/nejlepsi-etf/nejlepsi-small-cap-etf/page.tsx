import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, GemIcon, LayersIcon, TrendingDownIcon, TrendingUpIcon, BuildingIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Next.js Metadata API for SSR SEO
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const currentDate = new Intl.DateTimeFormat('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return {
    title: `Nejlepší Small Cap ETF ${currentYear} | Srovnání`,
    description: `✅ Srovnání nejlepších Small Cap ETF ${currentYear}. Russell 2000, MSCI World Small Cap, evropské malé společnosti - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'Small Cap ETF',
      'malé společnosti ETF',
      `nejlepší Small Cap ETF ${currentYear}`,
      'Russell 2000 ETF',
      'MSCI World Small Cap',
      'small cap investování',
      'malé firmy ETF',
      'growth potential ETF',
      'evropské small cap',
      'americké small cap',
      'mid cap ETF',
      'diverzifikace ETF',
      'růstové společnosti',
      'small cap výkonnost',
      'volatilita small cap'
    ].join(', '),
    openGraph: {
      title: `Nejlepší Small Cap ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších Small Cap ETF ${currentYear}. Russell 2000, MSCI World Small Cap, evropské malé společnosti - TER, velikost fondů.`,
      type: 'article',
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-small-cap-etf',
      siteName: 'ETF průvodce.cz',
      locale: 'cs_CZ',
      images: [
        {
          url: '/og-small-cap-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší Small Cap ETF ${currentYear} - malé společnosti`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší Small Cap ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších Small Cap ETF ${currentYear}. Russell 2000, MSCI World Small Cap, evropské malé společnosti - TER, velikost fondů.`,
      images: ['/og-small-cap-etf.jpg']
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-small-cap-etf'
    }
  };
}

export default async function NejlepsiSmallCapETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-small-cap-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší Small Cap ETF ${currentYear} - malé společnosti a Russell 2000`,
    "description": "Srovnání nejlepších Small Cap ETF 2025. Russell 2000, MSCI World Small Cap, evropské malé společnosti - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-small-cap-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-small-cap-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "Small Cap ETF, malé společnosti, Russell 2000, MSCI World Small Cap, small cap investování",
    "wordCount": 2700,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Small Cap ETF",
        "description": "Exchange-traded funds focused on small-cap companies with high growth potential"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares MSCI World Small Cap UCITS ETF",
        "identifier": "IE00BF4RFH31"
      },
      {
        "@type": "FinancialProduct", 
        "name": "SPDR Russell 2000 US Small Cap UCITS ETF",
        "identifier": "IE00BJ38QD84"
      },
      {
        "@type": "FinancialProduct",
        "name": "Xtrackers MSCI Europe Small Cap UCITS ETF", 
        "identifier": "LU0322253906"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Russell 2000",
        "description": "Index of 2000 small-cap US companies representing growth potential"
      },
      {
        "@type": "Thing", 
        "name": "Small Cap Investing",
        "description": "Investment strategy focusing on smaller companies with higher growth potential and volatility"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší Small Cap ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší Small Cap ETF jsou: iShares MSCI World Small Cap UCITS ETF (IE00BF4RFH31) největší globální small cap ETF s 5,5 mld. EUR a TER 0,35%, SPDR Russell 2000 US Small Cap UCITS ETF (IE00BJ38QD84) s 3,9 mld. EUR a TER 0,30%, a Xtrackers MSCI Europe Small Cap UCITS ETF (LU0322253906) s 2,6 mld. EUR a TER 0,30%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou Small Cap ETF a jak fungují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Small Cap ETF investují do malých společností s tržní kapitalizací obvykle 300M - 2B USD. Tyto společnosti mají vyšší růstový potenciál než large cap firmy, ale také vyšší volatilitu a riziko. Small cap ETF sledují indexy jako Russell 2000 nebo MSCI World Small Cap a poskytují diverzifikovaný přístup k investování do menších firem."
        }
      },
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi Small Cap a Large Cap ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Small Cap ETF investují do menších společností (300M-2B USD tržní kapitalizace) s vyšším růstovým potenciálem ale větší volatilitou. Large Cap ETF obsahují velké etablované firmy (nad 10B USD) s nižším rizikem ale omezenějším růstovým potenciálem. Small cap historicky překonávají large cap v dlouhém období, ale s vyššími výkyvy."
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
        "name": "Nejlepší Small Cap ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-small-cap-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-yellow-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-amber-100 text-amber-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-amber-200/50">
                <RocketIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Small Cap ETF
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
                Kompletní srovnání nejlepších Small Cap ETF pro investice do malých společností. 
                Russell 2000, MSCI World Small Cap a evropské malé firmy včetně praktických tipů.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <GemIcon className="w-5 h-5 mr-2" />
                    Růstový potenciál
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-3">
                    <GemIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Small Cap investování v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro malé společnosti</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUpIcon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">SMALL CAP PREMIUM</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">+2%</div>
                    <div className="text-xs text-gray-600">ročně vs large cap</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-amber-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <RocketIcon className="w-4 h-4 text-amber-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ SMALL CAP</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">5,5B</div>
                    <div className="text-xs text-gray-600">iShares World Small</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BuildingIcon className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-500 font-medium">TRŽNÍ KAPITALIZACE</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">300M-2B</div>
                    <div className="text-xs text-gray-600">USD typicky</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-amber-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3Icon className="w-4 h-4 text-amber-600" />
                      <span className="text-xs text-gray-500 font-medium">VOLATILITA</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">+5%</div>
                    <div className="text-xs text-gray-600">vyšší než S&P 500</div>
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
            <div className="flex items-center justify-center rounded-full bg-orange-100 w-20 h-20 mx-auto mb-8 hover:bg-orange-200 transition-colors hover-scale">
              <GemIcon className="w-10 h-10 text-orange-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou Small Cap ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na malé společnosti s vysokým růstovým potenciálem 
              a tržní kapitalizací obvykle 300 milionů až 2 miliardy USD
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <RocketIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-amber-800 transition-colors">Vysoký růstový potenciál</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Malé společnosti mají větší prostor pro růst než velké korporace,
                historicky dosahují vyšších výnosů za cenu vyšší volatility.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <LayersIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-amber-800 transition-colors">Diverzifikace portfolia</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Small cap ETF poskytují přístup k tisícům menších firem,
                kterými není možné diverzifikovat jen přes S&P 500 či jiné large cap indexy.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TargetIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-amber-800 transition-colors">Méně efektivní trh</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Malé společnosti jsou méně pokryté analytiky,
                což vytváří příležitosti pro lepší výkonnost aktivních strategií.
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
              Top 3 nejlepší Small Cap ETF
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení na základě analýzy {etfs.length} fondů zaměřených na malé společnosti
            </p>
          </div>

          <Top3ETFServer etfs={etfs} currency="EUR" />
        </div>
      </section>

      {/* Top 10 Database Sections */}
      <Top10SectionsServer etfs={etfs} currency="EUR" categoryName="Small Cap" />

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Často kladené otázky</h2>
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o Small Cap ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">Jaké jsou nejlepší Small Cap ETF v roce 2025?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší Small Cap ETF jsou: <strong>iShares MSCI World Small Cap UCITS ETF</strong> (IE00BF4RFH31) 
                největší globální small cap ETF s 5,5 mld. EUR a TER 0,35%, <strong>SPDR Russell 2000 US Small Cap UCITS ETF</strong> (IE00BJ38QD84) 
                s 3,9 mld. EUR a TER 0,30%, a <strong>Xtrackers MSCI Europe Small Cap UCITS ETF</strong> 
                (LU0322253906) s 2,6 mld. EUR a TER 0,30%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">Co jsou Small Cap ETF a jak fungují?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Small Cap ETF</strong> investují do malých společností s tržní kapitalizací obvykle 300M - 2B USD. 
                Tyto společnosti mají vyšší růstový potenciál než large cap firmy, ale také vyšší volatilitu a riziko. 
                Small cap ETF sledují indexy jako Russell 2000 nebo MSCI World Small Cap a poskytují diverzifikovaný přístup k investování do menších firem.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-orange-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-orange-800">Jaký je rozdíl mezi Small Cap a Large Cap ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Small Cap ETF</strong> investují do menších společností (300M-2B USD tržní kapitalizace) 
                s vyšším růstovým potenciálem ale větší volatilitou. <strong>Large Cap ETF</strong> obsahují velké etablované firmy 
                (nad 10B USD) s nižším rizikem ale omezenějším růstovým potenciálem. Small cap historicky překonávají 
                large cap v dlouhém období, ale s vyššími výkyvy.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Linking */}
      <InternalLinking 
        relatedLinks={[
          {
            href: "/nejlepsi-etf/nejlepsi-sp500-etf", 
            title: "Nejlepší S&P 500 ETF",
            description: "Průvodce americkými large cap fondy"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-growth-etf",
            title: "Nejlepší Growth ETF", 
            description: "Růstové ETF pro long-term investory"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-esg-etf",
            title: "Nejlepší ESG ETF",
            description: "Udržitelné investování s ESG faktory"
          }
        ]}
      />
    </Layout>
  );
}