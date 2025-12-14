import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarFilledIcon, BarChart3Icon, TargetIcon, LeafIcon, SproutIcon, HeartIcon, CheckCircleIcon , DollarIcon, RocketIcon, ZapIcon, UsersIcon, TrendingUpIcon, GlobeIcon, ShieldIcon} from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// Top 3 doporučené ESG ETF - editoriální výběr s live daty z databáze
const TOP_3_ESG_ETFS_TEMPLATE = [
  {
    name: "iShares MSCI USA ESG Enhanced CTB UCITS ETF",
    ticker: "USAG",
    isin: "IE00BHZPJ890",
    provider: "iShares",
    degiroFree: false,
    reason: "Největší ESG ETF s 11,4 mld. EUR a nejnižší TER 0,07%. Sleduje MSCI USA ESG Enhanced index s Paris-aligned klimatickými cíli.",
  },
  {
    name: "JPMorgan US Research Enhanced Index Equity (ESG) UCITS ETF",
    ticker: "JGRE",
    isin: "IE00BF4G7076",
    provider: "JPMorgan",
    degiroFree: false,
    reason: "Druhý největší ESG ETF s 9,6 mld. EUR a TER 0,20%. Research-enhanced přístup kombinuje ESG faktory s kvantitativní analýzou.",
  },
  {
    name: "Xtrackers MSCI USA ESG UCITS ETF",
    ticker: "XSRD", 
    isin: "IE00BFMNPS42",
    provider: "Xtrackers",
    degiroFree: false,
    reason: "Třetí největší ESG ETF s 7,9 mld. EUR a kompetitivní TER 0,15%. Zaměření na US ESG screened akcie s vyloučením kontroverzních sektorů.",
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
    title: `Nejlepší ESG ETF ${currentYear} | Srovnání`,
    description: `✅ Srovnání nejlepších ESG ETF ${currentYear}. Udržitelné investování, ESG screening, klimatické cíle - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'ESG ETF',
      'udržitelné ETF',
      `nejlepší ESG ETF ${currentYear}`,
      'ESG investování',
      'sustainable investing',
      'SRI ETF',
      'klimatické ETF',
      'Green ETF',
      'ESG screening',
      'udržitelnost',
      'ESG faktory',
      'socially responsible investing',
      'green investing',
      'Paris alignment',
      'carbon transition',
      'Climate ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší ESG ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších ESG ETF ${currentYear}. Udržitelné investování, ESG screening, klimatické cíle - TER, velikost fondů.`,
      type: 'article',
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-esg-etf',
      siteName: 'ETF průvodce.cz',
      locale: 'cs_CZ',
      images: [
        {
          url: '/og-esg-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší ESG ETF ${currentYear} - udržitelné investování`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší ESG ETF ${currentYear} | Srovnání`,
      description: `Srovnání nejlepších ESG ETF ${currentYear}. Udržitelné investování, ESG screening, klimatické cíle - TER, velikost fondů.`,
      images: ['/og-esg-etf.jpg']
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-esg-etf'
    }
  };
}

export default async function NejlepsiESGETFPage() {
  // Get last modified date from database (all ETF updates)
  const lastModified = await getLastModifiedDate();

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší ESG ETF ${currentYear} - udržitelné investování a ESG faktory`,
    "description": "Srovnání nejlepších ESG ETF 2025. Udržitelné investování, ESG screening, klimatické cíle - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-esg-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-esg-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "ESG ETF, udržitelné investování, ESG screening, klimatické cíle, sustainable investing",
    "wordCount": 2800,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "ESG ETF",
        "description": "Exchange-traded funds focused on environmental, social, and governance criteria"
      },
      {
        "@type": "FinancialProduct",
        "name": "iShares MSCI USA ESG Enhanced CTB UCITS ETF",
        "identifier": "IE00BHZPJ890"
      },
      {
        "@type": "FinancialProduct", 
        "name": "JPMorgan US Research Enhanced Index Equity (ESG) UCITS ETF",
        "identifier": "IE00BF4G7076"
      },
      {
        "@type": "FinancialProduct",
        "name": "Xtrackers MSCI USA ESG UCITS ETF", 
        "identifier": "IE00BFMNPS42"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "ESG Screening",
        "description": "Process of evaluating investments based on environmental, social, and governance criteria"
      },
      {
        "@type": "Thing", 
        "name": "Sustainable Investing",
        "description": "Investment strategy that considers ESG factors alongside financial returns"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší ESG ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší ESG ETF jsou: iShares MSCI USA ESG Enhanced CTB UCITS ETF (IE00BHZPJ890) největší ESG ETF s 11,4 mld. EUR a TER 0,07%, JPMorgan US Research Enhanced Index Equity (ESG) UCITS ETF (IE00BF4G7076) s 9,6 mld. EUR a TER 0,20%, a Xtrackers MSCI USA ESG UCITS ETF (IE00BFMNPS42) s 7,9 mld. EUR a TER 0,15%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co znamená ESG a jak funguje ESG investování?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ESG znamená Environmental (životní prostředí), Social (společenské faktory) a Governance (správa a řízení). ESG investování kombinuje finanční výnosy s pozitivním dopadem na společnost a planetu. ESG ETF vylučují kontroverzní sektory a upřednostňují společnosti s vysokým ESG skóre."
        }
      },
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi ESG ETF a tradičními ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ESG ETF používají screening proces pro vyloučení společností z kontroverzních odvětví (zbraně, tabák, fosilní paliva) a upřednostňují firmy s lepšími ESG praktikami. Tradiční ETF se zaměřují pouze na finanční metriky bez ohledu na udržitelnost nebo společenský dopad."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou náklady na ESG ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TER (celkové náklady) ESG ETF se pohybují od 0,07% do 0,20% ročně u našich TOP 3. Nejnižší má iShares MSCI USA ESG Enhanced (IE00BHZPJ890) s TER 0,07%, Xtrackers MSCI USA ESG (IE00BFMNPS42) má TER 0,15%, nejvyšší má JPMorgan US Research Enhanced ESG (IE00BF4G7076) s TER 0,20%."
        }
      },
      {
        "@type": "Question",
        "name": "Dosahují ESG ETF horších výnosů než tradiční ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ESG ETF často dosahují srovnatelných nebo lepších výnosů než tradiční ETF. Studie ukazují, že společnosti s vysokým ESG skóre často vykazují lepší dlouhodobou finanční výkonnost a menší rizika. ESG screening může vést k vyloučení některých výnosných sektorů, ale také snižuje riziko regulačních a reputačních problémů."
        }
      },
      {
        "@type": "Question",
        "name": "Kde koupit ESG ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ESG ETF koupíte u všech hlavních brokerů jako DEGIRO, XTB, Trading212 nebo Interactive Brokers. Naše TOP 3 ESG ETF: iShares MSCI USA ESG Enhanced (IE00BHZPJ890), JPMorgan US Research Enhanced ESG (IE00BF4G7076) a Xtrackers MSCI USA ESG (IE00BFMNPS42) jsou dostupné na evropských burzách."
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
        "name": "Nejlepší ESG ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-esg-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-teal-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-emerald-200/50">
                <LeafIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ESG ETF
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
                Kompletní srovnání nejlepších ESG ETF pro udržitelné investování. 
                ESG screening, klimatické cíle a sustainable investing včetně praktických tipů.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <StarFilledIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <LeafIcon className="w-5 h-5 mr-2" />
                    ESG kritéria
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
                    <LeafIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">ESG investování v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro udržitelné investování</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUpIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">RŮST ESG AKTIV</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">350%</div>
                    <div className="text-xs text-gray-600">za 5 let</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <GlobeIcon className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ ESG ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">11,4B</div>
                    <div className="text-xs text-gray-600">iShares USA ESG</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,07%</div>
                    <div className="text-xs text-gray-600">iShares Enhanced</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <HeartIcon className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-gray-500 font-medium">CO2 REDUKCE</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">50%</div>
                    <div className="text-xs text-gray-600">vs benchmark</div>
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
              <LeafIcon className="w-10 h-10 text-green-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou ESG ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na společnosti s vysokými standardy v oblasti životního prostředí, 
              sociální odpovědnosti a správy společností
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <SproutIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-emerald-800 transition-colors">Environmental (E)</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Klimatické změny, obnovitelné zdroje, odpadové hospodářství, 
                energetická efektivnost a ochrana biodiverzity.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <UsersIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-emerald-800 transition-colors">Social (S)</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Pracovní podmínky, lidská práva, diverzita a inkluze, 
                bezpečnost produktů a vztahy s komunitou.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-green-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShieldIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-emerald-800 transition-colors">Governance (G)</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Správa společností, transparentnost, etické podnikání, 
                nezávislost dozorčí rady a protikorupční opatření.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top 3 ETF Section */}
      <Top3ETFLiveSection 
        sectionId="top3"
        title="🏆 Top 3 nejlepší ESG ETF"
        subtitle="Naše doporučení na základě analýzy ESG kritérií a velikosti fondů"
        etfTemplates={TOP_3_ESG_ETFS_TEMPLATE}
        colorScheme="green"
      />

      {/* Comprehensive ETF Sections */}
      <FilteredETFSections 
        indexKeywords={["ESG", "SRI", "Sustainable", "Green", "Climate"]}
        excludeKeywords={["Leveraged", "2x", "3x", "Short", "Bear", "Bond", "Corporate"]}
      />

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Často kladené otázky</h2>
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o ESG ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jaké jsou nejlepší ESG ETF v roce 2025?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší ESG ETF jsou: <strong>iShares MSCI USA ESG Enhanced CTB UCITS ETF</strong> (IE00BHZPJ890) 
                největší ESG ETF s 11,4 mld. EUR a TER 0,07%, <strong>JPMorgan US Research Enhanced Index Equity (ESG) UCITS ETF</strong> (IE00BF4G7076) 
                s 9,6 mld. EUR a TER 0,20%, a <strong>Xtrackers MSCI USA ESG UCITS ETF</strong> 
                (IE00BFMNPS42) s 7,9 mld. EUR a TER 0,15%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Co znamená ESG a jak funguje ESG investování?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>ESG</strong> znamená Environmental (životní prostředí), Social (společenské faktory) a Governance (správa a řízení). 
                ESG investování kombinuje finanční výnosy s pozitivním dopadem na společnost a planetu. 
                ESG ETF vylučují kontroverzní sektory a upřednostňují společnosti s vysokým ESG skóre.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jaký je rozdíl mezi ESG ETF a tradičními ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>ESG ETF</strong> používají screening proces pro vyloučení společností z kontroverzních odvětví 
                (zbraně, tabák, fosilní paliva) a upřednostňují firmy s lepšími ESG praktikami. 
                <strong>Tradiční ETF</strong> se zaměřují pouze na finanční metriky bez ohledu na udržitelnost nebo společenský dopad.
                ESG ETF se také nazývají <strong>SRI</strong> (Socially Responsible Investing), <strong>Sustainable</strong>, 
                <strong>Green</strong> nebo <strong>Climate</strong> ETF podle konkrétního zaměření.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Jaké jsou náklady na ESG ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>TER (celkové náklady) ESG ETF</strong> se pohybují od 0,07% do 0,20% ročně u našich TOP 3. Nejnižší má iShares MSCI USA ESG Enhanced (IE00BHZPJ890) s TER 0,07%, Xtrackers MSCI USA ESG (IE00BFMNPS42) má TER 0,15%, nejvyšší má JPMorgan US Research Enhanced ESG (IE00BF4G7076) s TER 0,20%. Počítejte také s transakčními poplatky u brokera.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Dosahují ESG ETF horších výnosů než tradiční ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>ESG ETF často dosahují srovnatelných nebo lepších výnosů</strong> než tradiční ETF. Studie ukazují, že společnosti s vysokým ESG skóre často vykazují lepší dlouhodobou finanční výkonnost a menší rizika. ESG screening může vést k vyloučení některých výnosných sektorů, ale také snižuje riziko regulačních a reputačních problémů.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">Kde koupit ESG ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                ESG ETF koupíte u všech hlavních brokerů jako <strong>DEGIRO, XTB, Trading212 nebo Interactive Brokers</strong>. Naše TOP 3 ESG ETF: iShares MSCI USA ESG Enhanced (IE00BHZPJ890), JPMorgan US Research Enhanced ESG (IE00BF4G7076) a Xtrackers MSCI USA ESG (IE00BFMNPS42) jsou dostupné na evropských burzách. Porovnejte si poplatky a ESG kritéria před investicí.
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
            description: "Průvodce americkými indexovými fondy"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-growth-etf",
            title: "Nejlepší Growth ETF", 
            description: "Růstové ETF pro long-term investory"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-dividendove-etf",
            title: "Nejlepší dividendové ETF",
            description: "Passive income z dividend ETF"
          }
        ]}
      />
    </Layout>
  );
}