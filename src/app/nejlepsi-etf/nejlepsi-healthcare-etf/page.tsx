import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, HeartIcon, ActivityIcon, PlusIcon, DollarIcon, RocketIcon, ZapIcon, UsersIcon, TrendingUpIcon, BuildingIcon, ShieldIcon, GlobeIcon, AwardIcon, FlagIcon } from '@/components/ui/icons';
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
    title: `Nejlepší healthcare ETF ${currentYear} | Srovnání`,
    description: `✅ Srovnání nejlepších healthcare ETF ${currentYear}. Zdravotnictví, farmaceutika, biotechnologie - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'healthcare ETF',
      'zdravotnické ETF',
      `nejlepší healthcare ETF ${currentYear}`,
      'farmaceutické ETF',
      'biotechnology ETF',
      'medical ETF',
      'Johnson & Johnson ETF',
      'Pfizer ETF',
      'Roche ETF',
      'healthcare sektor',
      'zdravotnictví ETF',
      'pharma ETF',
      'léky ETF',
      'biotechnologie ETF',
      'zdravotní péče ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší healthcare ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších healthcare ETF ${currentYear}. Zdravotnictví, farmaceutika, biotechnologie - TER, velikost fondů.`,
      type: 'article',
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-healthcare-etf',
      siteName: 'ETF průvodce.cz',
      locale: 'cs_CZ',
      images: [
        {
          url: '/og-healthcare-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší healthcare ETF ${currentYear} - zdravotnictví`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší healthcare ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších healthcare ETF ${currentYear}. Zdravotnictví, farmaceutika, biotechnologie - TER, velikost fondů.`,
      images: ['/og-healthcare-etf.jpg']
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-healthcare-etf'
    }
  };
}

export default async function NejlepsiHealthcareETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-healthcare-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší healthcare ETF ${currentYear} - zdravotnictví a farmaceutika`,
    "description": "Srovnání nejlepších healthcare ETF 2025. Zdravotnictví, farmaceutika, biotechnologie - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-healthcare-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-healthcare-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "healthcare ETF, zdravotnictví, farmaceutika, biotechnologie, medical sektor",
    "wordCount": 2700,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Healthcare ETF",
        "description": "Exchange-traded funds focused on healthcare sector stocks like Johnson & Johnson, Pfizer, Roche"
      },
      {
        "@type": "FinancialProduct",
        "name": "Xtrackers MSCI World Health Care UCITS ETF 1C",
        "identifier": "IE00BM67HK77"
      },
      {
        "@type": "FinancialProduct", 
        "name": "iShares S&P 500 Health Care Sector UCITS ETF (Acc)",
        "identifier": "IE00B43HR379"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares MSCI Europe Health Care Sector UCITS ETF EUR (Acc)", 
        "identifier": "IE00BMW42181"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Healthcare Sector",
        "description": "Industry sector including pharmaceuticals, biotechnology, medical devices and healthcare services"
      },
      {
        "@type": "Thing", 
        "name": "Healthcare Sector Investing",
        "description": "Investment strategy focused on healthcare companies with stable growth and aging population trends"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší healthcare ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší healthcare ETF jsou: Xtrackers MSCI World Health Care UCITS ETF (XDWH, IE00BM67HK77) největší globální healthcare ETF s 2,4 mld. EUR a TER 0,25%, iShares S&P 500 Health Care Sector UCITS ETF (IUHC, IE00B43HR379) s 1,9 mld. EUR a TER 0,15%, a iShares MSCI Europe Health Care Sector UCITS ETF (IEUR, IE00BMW42181) s 1,1 mld. EUR a TER 0,18%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou healthcare ETF a jaké firmy obsahují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Healthcare ETF investují do zdravotnických společností jako Johnson & Johnson, Pfizer, Roche, Novartis, Abbott Laboratories a dalších farmaceutických, biotechnologických a zdravotnických firem. Sledují healthcare sektory různých indexů a poskytují diverzifikovaný přístup k investování do zdravotnictví."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do healthcare ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Healthcare sektor je defensivní s stabilní poptávkou nezávislou na ekonomických cyklech. Stárnutí populace, růst životní úrovně a pokroky v medicíně vytváří dlouhodobé růstové trendy. Healthcare ETF poskytují exposure k tomuto stabilnímu sektoru s růstovým potenciálem."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou poplatky za healthcare ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TER poplatky u top healthcare ETF se pohybují od 0,15% do 0,25% ročně. iShares S&P 500 Health Care Sector ETF (IUHC, IE00B43HR379) má nejnižší TER 0,15%, Xtrackers MSCI World Health Care ETF (XDWH, IE00BM67HK77) má TER 0,25%, a iShares MSCI Europe Health Care ETF (IEUR, IE00BMW42181) má TER 0,18%."
        }
      },
      {
        "@type": "Question",
        "name": "Jaká jsou rizika investování do healthcare ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Regulační riziko je hlavním faktorem - změny v regulaci léků a zdravotní péče mohou ovlivnit ziskovost. Klinické studie mohou selhávat a nové léky nemusí získat schválení. Politické riziko zahrnuje změny v cenách léků a reformy zdravotnictví. Nicméně diversifikované healthcare ETF jako naše TOP 3 tato rizika rozprostírají."
        }
      },
      {
        "@type": "Question",
        "name": "Jak vybrat mezi globálními a regionálními healthcare ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Globální ETF jako Xtrackers MSCI World Health Care (XDWH, IE00BM67HK77) poskytují širokou diverzifikaci napříč USA, Evropou i Asií. Regionální ETF jako iShares S&P 500 Health Care (IUHC, IE00B43HR379) se zaměřují na konkrétní trh s různými charakteristikami. Pro začátečníky je vhodnější globální diverzifikace, pokročilí investoři mohou kombinovat oba přístupy."
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
        "name": "Nejlepší healthcare ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-healthcare-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-teal-50/30 to-emerald-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-green-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-teal-200 to-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-teal-100 text-green-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-green-200/50">
                <HeartIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  healthcare ETF
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
                Kompletní srovnání nejlepších healthcare ETF. 
                Zdravotnictví, farmaceutika a biotechnologie včetně Johnson & Johnson, Pfizer a Roche.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <HeartIcon className="w-5 h-5 mr-2" />
                    Zdravotní trendy
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
                    <HeartIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Healthcare sektor v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro zdravotnické investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <ActivityIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ HEALTH ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">2,4B</div>
                    <div className="text-xs text-gray-600">Xtrackers World Health</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-teal-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarIcon className="w-4 h-4 text-teal-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,15%</div>
                    <div className="text-xs text-gray-600">S&P 500 Health Care</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <PlusIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP HOLDING</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">4%</div>
                    <div className="text-xs text-gray-600">Johnson & Johnson</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-teal-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <UsersIcon className="w-4 h-4 text-teal-600" />
                      <span className="text-xs text-gray-500 font-medium">STÁRNUTÍ POPULACE</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">65+</div>
                    <div className="text-xs text-gray-600">trend růstu</div>
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
            <div className="flex items-center justify-center rounded-full bg-green-100 w-20 h-20 mx-auto mb-8 hover:bg-green-200 transition-colors hover-scale">
              <HeartIcon className="w-10 h-10 text-green-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou healthcare ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na zdravotnické společnosti včetně farmaceutických gigantů, 
              biotechnologických firem a poskytovatelů zdravotní péče
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShieldIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-green-800 transition-colors">Defensivní charakter</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Zdravotnictví má stálou poptávku nezávislou na ekonomických cyklech. 
                Lidé potřebují léky a zdravotní péči za každého počasí.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUpIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-teal-800 transition-colors">Demografické trendy</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Stárnutí populace, růst životní úrovně a pokroky v medicíně 
                vytváří dlouhodobé růstové příležitosti pro healthcare sektor.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ZapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-emerald-800 transition-colors">Inovace a výzkum</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Masivní investice do výzkumu nových léků, terapií a technologií 
                přinášejí průlomové inovace s vysokou přidanou hodnotou.
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
              Top 3 nejlepší healthcare ETF
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení nejlepších healthcare ETF na základě analýzy velikosti fondů a diverzifikace health sektoru
            </p>
          </div>

          <Top3ETFServer etfs={etfs} currency="EUR" />
        </div>
      </section>

      {/* Top 10 Database Sections */}
      <Top10SectionsServer etfs={etfs} currency="EUR" categoryName="Healthcare" />

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Často kladené otázky</h2>
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o healthcare ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jaké jsou nejlepší healthcare ETF v roce 2025?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší healthcare ETF jsou: <strong>Xtrackers MSCI World Health Care UCITS ETF</strong> (XDWH, IE00BM67HK77) 
                největší globální healthcare ETF s 2,4 mld. EUR a TER 0,25%, <strong>iShares S&P 500 Health Care Sector UCITS ETF</strong> (IUHC, IE00B43HR379) 
                s 1,9 mld. EUR a TER 0,15%, a <strong>iShares MSCI Europe Health Care Sector UCITS ETF</strong> 
                (IEUR, IE00BMW42181) s 1,1 mld. EUR a TER 0,18%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Co jsou healthcare ETF a jaké firmy obsahují?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Healthcare ETF</strong> investují do zdravotnických společností jako Johnson & Johnson, Pfizer, Roche, 
                Novartis, Abbott Laboratories a dalších farmaceutických, biotechnologických a zdravotnických firem. 
                Sledují healthcare sektory různých indexů a poskytují diverzifikovaný přístup k investování do zdravotnictví.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Proč investovat do healthcare ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Healthcare sektor</strong> je defensivní s stabilní poptávkou nezávislou na ekonomických cyklech. 
                Stárnutí populace, růst životní úrovně a pokroky v medicíně vytváří dlouhodobé růstové trendy. 
                Healthcare ETF poskytují exposure k tomuto stabilnímu sektoru s růstovým potenciálem.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jaké jsou poplatky za healthcare ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>TER poplatky</strong> u top healthcare ETF se pohybují od 0,15% do 0,25% ročně. 
                <strong>iShares S&P 500 Health Care Sector ETF</strong> (IUHC, IE00B43HR379) má nejnižší TER 0,15%, 
                <strong>Xtrackers MSCI World Health Care ETF</strong> (XDWH, IE00BM67HK77) má TER 0,25%, 
                a <strong>iShares MSCI Europe Health Care ETF</strong> (IEUR, IE00BMW42181) má TER 0,18%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jaká jsou rizika investování do healthcare ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Regulační riziko</strong> je hlavním faktorem - změny v regulaci léků a zdravotní péče mohou ovlivnit ziskovost. 
                <strong>Klinické studie</strong> mohou selhávat a nové léky nemusí získat schválení. 
                <strong>Politické riziko</strong> zahrnuje změny v cenách léků a reformy zdravotnictví. 
                Nicméně diversifikované healthcare ETF jako naše TOP 3 tato rizika rozprostírají.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jak vybrat mezi globálními a regionálními healthcare ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Globální ETF</strong> jako Xtrackers MSCI World Health Care (XDWH, IE00BM67HK77) poskytují širokou diverzifikaci napříč USA, Evropou i Asií. 
                <strong>Regionální ETF</strong> jako iShares S&P 500 Health Care (IUHC, IE00B43HR379) se zaměřují na konkrétní trh s různými charakteristikami. 
                Pro začátečníky je vhodnější globální diverzifikace, pokročilí investoři mohou kombinovat oba přístupy.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Linking */}
      <InternalLinking 
        relatedLinks={[
          {
            href: "/nejlepsi-etf/nejlepsi-biotechnologie-etf", 
            title: "Nejlepší biotechnologie ETF",
            description: "Specializované biotech fondy"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-esg-etf",
            title: "Nejlepší ESG ETF", 
            description: "Udržitelné healthcare investice"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-dividendove-etf",
            title: "Nejlepší dividendové ETF",
            description: "Healthcare s dividendami"
          }
        ]}
      />
    </Layout>
  );
}