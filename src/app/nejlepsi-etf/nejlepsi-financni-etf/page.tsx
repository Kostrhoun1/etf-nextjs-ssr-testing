import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Star, BarChart3, Target, Calculator , DollarSign, Rocket, Zap, Users, CreditCard, Building, Banknote, TrendingUp, Shield} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';

// Top 3 doporučené Financial ETF - editoriální výběr s live daty z databáze
const TOP_3_FINANCIAL_ETFS_TEMPLATE = [
  {
    name: "iShares STOXX Europe 600 Banks UCITS ETF (DE)",
    ticker: "EXS1",
    isin: "DE000A0F5UJ7",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší evropský bankovní ETF s 2,9 mld. EUR a TER 0,47%. Přístup k evropským bankám jako ING, Santander, BNP Paribas.",
  },
  {
    name: "Amundi Euro Stoxx Banks UCITS ETF Acc",
    ticker: "CB7",
    isin: "LU1829219390",
    provider: "Amundi ETF",
    degiroFree: false,
    reason: "Druhý největší s 2,9 mld. EUR a TER 0,30%. Zaměření na eurozonové banky s vysokou likviditou a nízkou concentrací.",
  },
  {
    name: "iShares S&P 500 Financials Sector UCITS ETF (Acc)",
    ticker: "IUFS",
    isin: "IE00B4JNQZ49",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší americký finanční ETF s 2,1 mld. EUR a nejnižší TER 0,15%. Obsahuje JPMorgan, Bank of America, Wells Fargo.",
  }
];

// Next.js Metadata API for SSR SEO
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const currentDate = new Intl.DateTimeFormat('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return {
    title: `Nejlepší finanční ETF ${currentYear} - banky a finanční sektor | ETF průvodce.cz`,
    description: `✅ Srovnání nejlepších finančních ETF ${currentYear}. Banky, pojišťovny, REIT - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'finanční ETF',
      'bankovní ETF',
      `nejlepší finanční ETF ${currentYear}`,
      'financial sector ETF',
      'bank ETF',
      'REIT ETF',
      'pojišťovny ETF',
      'JPMorgan ETF',
      'Bank of America ETF',
      'evropské banky ETF',
      'americké banky ETF',
      'finanční sektor',
      'banking ETF',
      'finance ETF',
      'real estate ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší finanční ETF ${currentYear} - banky a finanční sektor`,
      description: `Srovnání nejlepších finančních ETF ${currentYear}. Banky, pojišťovny, REIT - TER, velikost fondů.`,
      type: 'article',
      url: 'https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-financni-etf',
      siteName: 'ETF průvodce.cz',
      locale: 'cs_CZ',
      images: [
        {
          url: '/og-financial-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší finanční ETF ${currentYear} - banky`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší finanční ETF ${currentYear} - banky a finanční sektor`,
      description: `Srovnání nejlepších finančních ETF ${currentYear}. Banky, pojišťovny, REIT - TER, velikost fondů.`,
      images: ['/og-financial-etf.jpg']
    },
    alternates: {
      canonical: 'https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-financni-etf'
    }
  };
}

export default function NejlepsiFinancniETFPage() {
  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší finanční ETF ${currentYear} - banky a finanční sektor`,
    "description": "Srovnání nejlepších finančních ETF 2025. Banky, pojišťovny, REIT - TER, velikost fondů.",
    "image": "https://etfpruvodce.cz/og-financial-etf.jpg",
    "author": {
      "@type": "Person",
      "name": "Tomáš Kostrhoun",
      "url": "https://etfpruvodce.cz/o-nas#tomas-kostrhoun"
    },
    "publisher": { 
      "@type": "Organization", 
      "name": "ETF průvodce.cz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://etfpruvodce.cz/logo.png"
      }
    },
    "datePublished": "2025-01-15",
    "dateModified": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-financni-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "finanční ETF, banky, financial sector, pojišťovny, REIT, finanční služby",
    "wordCount": 2600,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Financial ETF",
        "description": "Exchange-traded funds focused on financial sector stocks like banks, insurance companies, REITs"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares STOXX Europe 600 Banks UCITS ETF (DE)",
        "identifier": "DE000A0F5UJ7"
      },
      {
        "@type": "FinancialProduct", 
        "name": "Amundi Euro Stoxx Banks UCITS ETF Acc",
        "identifier": "LU1829219390"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares S&P 500 Financials Sector UCITS ETF (Acc)", 
        "identifier": "IE00B4JNQZ49"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Financial Sector",
        "description": "Industry sector including banks, insurance companies, asset management and real estate"
      },
      {
        "@type": "Thing", 
        "name": "Banking Sector Investing",
        "description": "Investment strategy focused on banks and financial institutions with cyclical characteristics"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší finanční ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší finanční ETF jsou: iShares STOXX Europe 600 Banks UCITS ETF (EXS1, DE000A0F5UJ7) největší evropský bankovní ETF s 2,9 mld. EUR a TER 0,47%, Amundi Euro Stoxx Banks UCITS ETF (CB7, LU1829219390) s 2,9 mld. EUR a TER 0,30%, a iShares S&P 500 Financials Sector UCITS ETF (IUFS, IE00B4JNQZ49) s 2,1 mld. EUR a TER 0,15%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou finanční ETF a jaké firmy obsahují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Finanční ETF investují do finančních společností jako JPMorgan Chase, Bank of America, Wells Fargo, ING Group, Santander, BNP Paribas a dalších bank, pojišťoven a finančních služeb. Sledují finanční sektory různých indexů a poskytují diverzifikovaný přístup k investování do finančnictví."
        }
      },
      {
        "@type": "Question",
        "name": "Jsou finanční ETF vhodné pro konzervativní investory?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Finanční sektor je cyklický a citlivý na úrokové sazby a ekonomické cykly. Banky profitují z vyšších úrokových sazeb, ale trpí v recesích kvůli špatným úvěrům. Finanční ETF jsou vhodnější pro investory s tolerancí k volatilitě než pro konzervativní portfolio."
        }
      },
      {
        "@type": "Question",
        "name": "Který finanční ETF má nejnižší poplatky?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "iShares S&P 500 Financials Sector UCITS ETF (IUFS, IE00B4JNQZ49) má nejnižší TER pouze 0,15% mezi našimi TOP 3 doporučeními. Amundi Euro Stoxx Banks (CB7, LU1829219390) má TER 0,30% a iShares STOXX Europe 600 Banks (EXS1, DE000A0F5UJ7) má TER 0,47%."
        }
      },
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi evropskými a americkými finančními ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evropské finanční ETF jako iShares STOXX Europe 600 Banks (EXS1, DE000A0F5UJ7) obsahují banky jako ING, Santander, BNP Paribas. Americké ETF jako iShares S&P 500 Financials (IUFS, IE00B4JNQZ49) obsahují JPMorgan, Bank of America, Wells Fargo. Americké banky jsou obecně větší a technologicky pokročilejší."
        }
      },
      {
        "@type": "Question",
        "name": "Vyplácejí finanční ETF dividendy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano, většina finančních ETF vyplácí pravidelné dividendy. Banky mají tradici vyplácení dividend a naše TOP 3 ETF zahrnují jak distribuční (iShares STOXX Europe 600 Banks - EXS1, iShares S&P 500 Financials - IUFS), tak akumulační varianty (Amundi Euro Stoxx Banks - CB7)."
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
        "item": "https://etfpruvodce.cz"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Nejlepší ETF",
        "item": "https://etfpruvodce.cz/nejlepsi-etf"
      },
      {
        "@type": "ListItem",
        "position": 3, 
        "name": "Nejlepší finanční ETF",
        "item": "https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-financni-etf"
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
      <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-gray-50/30 to-zinc-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-slate-200 to-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-gray-200 to-zinc-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-zinc-200 to-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-slate-200/50">
                <CreditCard className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-600 bg-clip-text text-transparent">
                  finanční ETF
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
                  Aktualizováno: {new Date().toLocaleDateString('cs-CZ', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Kompletní srovnání nejlepších finančních ETF. 
                Banky, pojišťovny a REIT včetně JPMorgan, Bank of America a evropských bank.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <Star className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Bankovní trendy
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-3">
                    <CreditCard className="w-6 h-6 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Finanční sektor v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro finanční investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-slate-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ BANK ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">2,9B</div>
                    <div className="text-xs text-gray-600">Europe 600 Banks</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,15%</div>
                    <div className="text-xs text-gray-600">S&P 500 Financials</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Banknote className="w-4 h-4 text-slate-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP HOLDING</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">5%</div>
                    <div className="text-xs text-gray-600">JPMorgan Chase</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-500 font-medium">ÚROKOVÉ SAZBY</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">4%+</div>
                    <div className="text-xs text-gray-600">pozitivní trend</div>
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
            <div className="flex items-center justify-center rounded-full bg-slate-100 w-20 h-20 mx-auto mb-8 hover:bg-slate-200 transition-colors hover-scale">
              <CreditCard className="w-10 h-10 text-slate-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou finanční ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na finanční sektor včetně bank, pojišťoven, 
              asset managementu a REIT společností s expozicí k úrokovým sazbám
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-slate-500 to-gray-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-slate-800 transition-colors">Citlivost na úroku</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Banky profitují z vyšších úrokových sazeb díky vyšším úrokovým maržím. 
                Rostoucí sazby jsou pozitivní pro finanční sektor.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-gray-500 to-zinc-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-gray-800 transition-colors">Cyklický charakter</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Finanční sektor je silně cyklický - prospívá v růstu ekonomiky, 
                ale trpí v recesích kvůli špatným úvěrům a snížené aktivitě.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-zinc-500 to-slate-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-zinc-800 transition-colors">Dividendové výnosy</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Mnoho bank má tradici vyplácení pravidelných dividend. 
                Finanční ETF tak mohou poskytovat atraktivní dividendové příjmy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top 3 ETF Section */}
      <Top3ETFLiveSection 
        sectionId="top3"
        title="🏆 Top 3 nejlepší finanční ETF"
        subtitle="Naše doporučení na základě analýzy velikosti fondů a diverzifikace finančního sektoru"
        etfTemplates={TOP_3_FINANCIAL_ETFS_TEMPLATE}
        colorScheme="gray"
      />

      {/* Comprehensive ETF Sections */}
      <FilteredETFSections 
        indexKeywords={["Financial", "Finance", "Bank", "REIT", "Real Estate"]}
        excludeKeywords={["China", "KraneShares", "Leveraged", "2x", "3x", "Short", "Bear", "Technology"]}
      />

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Často kladené otázky</h2>
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o finančních ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-slate-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-slate-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-slate-800">Jaké jsou nejlepší finanční ETF v roce 2025?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-slate-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší finanční ETF jsou: <strong>iShares STOXX Europe 600 Banks UCITS ETF</strong> (EXS1, DE000A0F5UJ7) 
                největší evropský bankovní ETF s 2,9 mld. EUR a TER 0,47%, <strong>Amundi Euro Stoxx Banks UCITS ETF</strong> (CB7, LU1829219390) 
                s 2,9 mld. EUR a TER 0,30%, a <strong>iShares S&P 500 Financials Sector UCITS ETF</strong> 
                (IUFS, IE00B4JNQZ49) s 2,1 mld. EUR a TER 0,15%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-slate-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-slate-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-slate-800">Co jsou finanční ETF a jaké firmy obsahují?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-slate-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Finanční ETF</strong> investují do finančních společností jako JPMorgan Chase, Bank of America, 
                Wells Fargo, ING Group, Santander, BNP Paribas a dalších bank, pojišťoven a finančních služeb. 
                Sledují finanční sektory různých indexů a poskytují diverzifikovaný přístup k investování do finančnictví.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-slate-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-slate-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-slate-800">Jsou finanční ETF vhodné pro konzervativní investory?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-slate-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Finanční sektor</strong> je cyklický a citlivý na úrokové sazby a ekonomické cykly. 
                Banky profitují z vyšších úrokových sazeb, ale trpí v recesích kvůli špatným úvěrům. 
                Finanční ETF jsou vhodnější pro investory s tolerancí k volatilitě než pro konzervativní portfolio.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-slate-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-slate-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-slate-800">Který finanční ETF má nejnižší poplatky?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-slate-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>iShares S&P 500 Financials Sector UCITS ETF</strong> (IUFS, IE00B4JNQZ49) má nejnižší TER pouze 0,15% mezi našimi TOP 3 doporučeními. 
                Amundi Euro Stoxx Banks (CB7, LU1829219390) má TER 0,30% a iShares STOXX Europe 600 Banks (EXS1, DE000A0F5UJ7) má TER 0,47%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-slate-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-slate-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-slate-800">Jaký je rozdíl mezi evropskými a americkými finančními ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-slate-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Evropské finanční ETF</strong> jako iShares STOXX Europe 600 Banks (EXS1, DE000A0F5UJ7) obsahují banky jako ING, Santander, BNP Paribas. 
                Americké ETF jako iShares S&P 500 Financials (IUFS, IE00B4JNQZ49) obsahují JPMorgan, Bank of America, Wells Fargo. 
                Americké banky jsou obecně větší a technologicky pokročilejší.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-slate-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-slate-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-slate-800">Vyplácejí finanční ETF dividendy?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-slate-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Ano</strong>, většina finančních ETF vyplácí pravidelné dividendy. Banky mají tradici vyplácení dividend a naše TOP 3 ETF zahrnují 
                jak distribuční (iShares STOXX Europe 600 Banks - EXS1, iShares S&P 500 Financials - IUFS), 
                tak akumulační varianty (Amundi Euro Stoxx Banks - CB7).
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Internal Linking */}
      <InternalLinking 
        relatedLinks={[
          {
            href: "/nejlepsi-etf/nejlepsi-real-estate-etf", 
            title: "Nejlepší REIT ETF",
            description: "Nemovitostní investiční trusty"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-dividendove-etf",
            title: "Nejlepší dividendové ETF", 
            description: "Finanční sektor s dividendami"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-value-etf",
            title: "Nejlepší Value ETF",
            description: "Value přístup k bankám"
          }
        ]}
      />
    </Layout>
  );
}