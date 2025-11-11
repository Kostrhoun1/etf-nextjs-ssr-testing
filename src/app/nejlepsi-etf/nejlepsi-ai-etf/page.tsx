import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Star, BarChart3, Target, Brain, Bot, Cpu , DollarSign, Rocket, Zap, Users} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// Top 3 doporučené AI ETF - editoriální výběr s live daty z databáze
const TOP_3_AI_ETFS_TEMPLATE = [
  {
    name: "Xtrackers Artificial Intelligence & Big Data UCITS ETF 1C",
    ticker: "XAIX",
    isin: "IE00BGV5VN51",
    provider: "Xtrackers",
    degiroFree: false,
    reason: "Největší AI ETF s 5,5 mld. EUR a TER 0,35%. Globální exposure k umělé inteligenci, big data a machine learning technologiím.",
  },
  {
    name: "iShares Automation & Robotics UCITS ETF",
    ticker: "RBOT",
    isin: "IE00BYZK4552",
    provider: "iShares",
    degiroFree: false,
    reason: "Druhý největší s 2,9 mld. EUR a TER 0,40%. Zaměření na automatizaci, robotiku a AI napříč různými sektory.",
  },
  {
    name: "L&G Artificial Intelligence UCITS ETF",
    ticker: "AIAI",
    isin: "IE00BK5BCD43",
    provider: "L&G (LGIM)",
    degiroFree: false,
    reason: "Specializovaný AI ETF s 1,1 mld. EUR a TER 0,49%. Čisté zaměření na AI a machine learning společnosti.",
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
    title: `Nejlepší AI ETF ${currentYear} - umělá inteligence a robotika | ETF průvodce.cz`,
    description: `✅ Srovnání nejlepších AI ETF ${currentYear}. Umělá inteligence, machine learning, big data - TER, velikost fondů. Aktuální data k ${currentDate}.`,
    keywords: [
      'AI ETF',
      'umělá inteligence ETF',
      `nejlepší AI ETF ${currentYear}`,
      'artificial intelligence ETF',
      'machine learning ETF',
      'big data ETF',
      'robotika ETF',
      'automatizace ETF',
      'technologické trendy ETF',
      'budoucnost ETF',
      'inovace ETF',
      'digitalizace ETF',
      'chatGPT ETF',
      'OpenAI ETF',
      'NVIDIA ETF'
    ].join(', '),
    openGraph: {
      title: `Nejlepší AI ETF ${currentYear} - umělá inteligence a robotika`,
      description: `Srovnání nejlepších AI ETF ${currentYear}. Umělá inteligence, machine learning, big data - TER, velikost fondů.`,
      type: 'article',
      url: 'https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-ai-etf',
      siteName: 'ETF průvodce.cz',
      locale: 'cs_CZ',
      images: [
        {
          url: '/og-ai-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší AI ETF ${currentYear} - umělá inteligence`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší AI ETF ${currentYear} - umělá inteligence a robotika`,
      description: `Srovnání nejlepších AI ETF ${currentYear}. Umělá inteligence, machine learning, big data - TER, velikost fondů.`,
      images: ['/og-ai-etf.jpg']
    },
    alternates: {
      canonical: 'https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-ai-etf'
    }
  };
}

export default async function NejlepsiAIETFPage() {
  // Get last modified date from database (all ETF updates)
  const lastModified = await getLastModifiedDate();

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší AI ETF ${currentYear} - umělá inteligence a robotika`,
    "description": "Srovnání nejlepších AI ETF 2025. Umělá inteligence, machine learning, big data - TER, velikost fondů.",
    "image": "https://etfpruvodce.cz/og-ai-etf.jpg",
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
    "dateModified": lastModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-ai-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "AI ETF, umělá inteligence, machine learning, big data, robotika, automatizace",
    "wordCount": 2800,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "AI ETF",
        "description": "Exchange-traded funds focused on artificial intelligence and machine learning companies"
      },
      {
        "@type": "FinancialProduct",
        "name": "Xtrackers Artificial Intelligence & Big Data UCITS ETF 1C",
        "identifier": "IE00BGV5VN51"
      },
      {
        "@type": "FinancialProduct", 
        "name": "iShares Automation & Robotics UCITS ETF",
        "identifier": "IE00BYZK4552"
      },
      {
        "@type": "FinancialProduct",
        "name": "L&G Artificial Intelligence UCITS ETF", 
        "identifier": "IE00BK5BCD43"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Artificial Intelligence",
        "description": "Technology sector focused on machine learning, neural networks and automated decision making"
      },
      {
        "@type": "Thing", 
        "name": "AI Investment Trends",
        "description": "Investment strategy focused on companies developing AI technologies and solutions"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší AI ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší AI ETF jsou: Xtrackers Artificial Intelligence & Big Data UCITS ETF (IE00BGV5VN51) největší AI ETF s 5,5 mld. EUR a TER 0,35%, iShares Automation & Robotics UCITS ETF (IE00BYZK4552) s 2,9 mld. EUR a TER 0,40%, a L&G Artificial Intelligence UCITS ETF (IE00BK5BCD43) s 1,1 mld. EUR a TER 0,49%."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou AI ETF a jaké firmy obsahují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI ETF investují do společností vyvíjejících umělou inteligenci jako NVIDIA, Microsoft, Alphabet (Google), Tesla, AMD a dalších tech firem. Zaměřují se na machine learning, big data, automatizaci a robotiku. Sledují AI indexy a poskytují diverzifikovaný přístup k investování do budoucnosti technologií."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do AI ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI představuje revolučního megatrend s obrovským růstovým potenciálem. ChatGPT a další AI nástroje mění způsob práce ve všech odvětvích. AI ETF poskytují exposure k této transformaci přes diversifikované portfolio technologických lídrů bez nutnosti vybírat jednotlivé akcie."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou náklady na AI ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TER (celkové náklady) AI ETF se pohybují mezi 0,35% až 0,49% ročně. Nejnižší TER má Xtrackers AI ETF (0,35%), iShares Automation & Robotics má TER 0,40% a L&G AI ETF má 0,49%. Kromě TER počítejte s transakčními poplatky u brokera při nákupu a prodeji."
        }
      },
      {
        "@type": "Question",
        "name": "Jsou AI ETF rizikové investice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI ETF patří mezi rizikovější investice kvůli vysoké volatilitě technologického sektoru a spekulativní povaze AI tématu. Doporučujeme alokovat maximálně 5-10% portfolia do AI ETF a kombinovat s širšími technologickými nebo globálními ETF pro diverzifikaci rizika."
        }
      },
      {
        "@type": "Question",
        "name": "Kde koupit AI ETF v Česku?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI ETF můžete koupit u českých brokerů jako Degiro, XTB, Trading212 nebo Interactive Brokers. Náš TOP 3 AI ETF (Xtrackers AI & Big Data, iShares Automation & Robotics, L&G AI ETF) jsou dostupné na evropských burzách. Nejlevnější jsou neobanky s nulovými poplatky za ETF."
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
        "name": "Nejlepší AI ETF",
        "item": "https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-ai-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-indigo-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-purple-200/50">
                <Brain className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI ETF
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
                Kompletní srovnání nejlepších AI ETF. 
                Umělá inteligence, machine learning a robotika včetně NVIDIA, Microsoft a Alphabet.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <Star className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <Brain className="w-5 h-5 mr-2" />
                    AI revoluce
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-3">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">AI sektor v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro AI investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ AI ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">5,5B</div>
                    <div className="text-xs text-gray-600">Xtrackers AI & Big Data</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,35%</div>
                    <div className="text-xs text-gray-600">Xtrackers AI ETF</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP HOLDING</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">8%</div>
                    <div className="text-xs text-gray-600">NVIDIA Corporation</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Rocket className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">CHATGPT BOOM</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">2023</div>
                    <div className="text-xs text-gray-600">AI revoluce</div>
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
            <div className="flex items-center justify-center rounded-full bg-purple-100 w-20 h-20 mx-auto mb-8 hover:bg-purple-200 transition-colors hover-scale">
              <Brain className="w-10 h-10 text-purple-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou AI ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na společnosti vyvíjející umělou inteligenci, 
              machine learning a automatizaci budoucnosti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-purple-800 transition-colors">AI revoluce</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                ChatGPT a generativní AI mění způsob práce ve všech odvětvích. 
                AI ETF poskytují exposure k této technologické revoluci.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-800 transition-colors">Automatizace</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Robotika a automatizace zvyšují produktivitu napříč výrobou, 
                logistikou i službami. Megatrend s dlouhodobým potenciálem.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-indigo-800 transition-colors">Technologičtí lídři</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                NVIDIA, Microsoft, Alphabet a další tech giganty vedou AI vývoj. 
                AI ETF koncentrují nejlepší inovátory v jednom fondu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top 3 ETF Section */}
      <Top3ETFLiveSection 
        sectionId="top3"
        title="🏆 Top 3 nejlepší AI ETF"
        subtitle="Naše doporučení na základě analýzy velikosti fondů a exposure k AI technologiím"
        etfTemplates={TOP_3_AI_ETFS_TEMPLATE}
        colorScheme="purple"
      />

      {/* Comprehensive ETF Sections */}
      <FilteredETFSections 
        indexKeywords={["Artificial Intelligence", " AI ", "Machine Learning", "Robotics", "Big Data", "Intelligence"]}
        excludeKeywords={["China", "KraneShares", "Leveraged", "2x", "3x", "Short", "Bear", "Bond", "Currency", "Sustainable", "ESG", "Daily", "Nikkei", "JPX", "Industrials", "Industrial", "MSCI USA"]}
      />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Selection Guide */}
          <div id="pruvodce" className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-12 border border-purple-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 w-20 h-20 mx-auto mb-6">
                <Target className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                💡 Jak vybrat ten správný AI ETF?
              </h4>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Praktický průvodce výběrem podle vašeho investičního profilu
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  <h5 className="text-lg font-bold text-green-800">Pro začátečníky</h5>
                </div>
                <p className="text-green-700 leading-relaxed">
                  Vyberte široce diverzifikovaný AI ETF s nižším rizikem. 
                  Zaměřte se na velikost fondu a stabilní poskytovatele jako iShares nebo Xtrackers.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <h5 className="text-lg font-bold text-blue-800">Pro pokročilé</h5>
                </div>
                <p className="text-blue-700 leading-relaxed">
                  Porovnejte zaměření jednotlivých AI ETF - některé se zaměřují více na hardware (čipy), 
                  jiné na software a aplikace.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <h5 className="text-lg font-bold text-purple-800">Pro rizikové investory</h5>
                </div>
                <p className="text-purple-700 leading-relaxed">
                  Zvažte menší, specializované AI ETF s vyšším potenciálem růstu. 
                  Počítejte s větší volatilitou a možnými ztrátami.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-bold text-sm">4</span>
                  </div>
                  <h5 className="text-lg font-bold text-orange-800">Pro diverzifikaci</h5>
                </div>
                <p className="text-orange-700 leading-relaxed">
                  AI ETF by měly tvořit maximálně 5-10% vašeho portfolia. 
                  Kombinujte s širšími technologickými nebo globálními ETF.
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
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o AI ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-purple-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-purple-800">Jaké jsou nejlepší AI ETF v roce 2025?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší AI ETF jsou: <strong>Xtrackers Artificial Intelligence & Big Data UCITS ETF</strong> (IE00BGV5VN51) 
                největší AI ETF s 5,5 mld. EUR a TER 0,35%, <strong>iShares Automation & Robotics UCITS ETF</strong> (IE00BYZK4552) 
                s 2,9 mld. EUR a TER 0,40%, a <strong>L&G Artificial Intelligence UCITS ETF</strong> 
                (IE00BK5BCD43) s 1,1 mld. EUR a TER 0,49%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-purple-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-purple-800">Co jsou AI ETF a jaké firmy obsahují?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>AI ETF</strong> investují do společností vyvíjejících umělou inteligenci jako NVIDIA, Microsoft, 
                Alphabet (Google), Tesla, AMD a dalších tech firem. Zaměřují se na machine learning, big data, automatizaci 
                a robotiku. Sledují AI indexy a poskytují diverzifikovaný přístup k investování do budoucnosti technologií.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-purple-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-purple-800">Proč investovat do AI ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>AI představuje revolučního megatrend</strong> s obrovským růstovým potenciálem. ChatGPT a další AI nástroje 
                mění způsob práce ve všech odvětvích. AI ETF poskytují exposure k této transformaci přes diversifikované portfolio 
                technologických lídrů bez nutnosti vybírat jednotlivé akcie.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-purple-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-purple-800">Jaké jsou náklady na AI ETF?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>TER (celkové náklady) AI ETF</strong> se pohybují mezi 0,35% až 0,49% ročně. Nejnižší TER má 
                Xtrackers AI ETF (0,35%), iShares Automation & Robotics má TER 0,40% a L&G AI ETF má 0,49%. 
                Kromě TER počítejte s transakčními poplatky u brokera při nákupu a prodeji.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-purple-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-purple-800">Jsou AI ETF rizikové investice?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>AI ETF patří mezi rizikovější investice</strong> kvůli vysoké volatilitě technologického sektoru a spekulativní povaze AI tématu. 
                Doporučujeme alokovat maximálně 5-10% portfolia do AI ETF a kombinovat s širšími technologickými nebo globálními ETF pro diverzifikaci rizika.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-purple-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-purple-800">Kde koupit AI ETF v Česku?</span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>AI ETF můžete koupit</strong> u českých brokerů jako Degiro, XTB, Trading212 nebo Interactive Brokers. 
                Náš TOP 3 AI ETF (Xtrackers AI & Big Data, iShares Automation & Robotics, L&G AI ETF) 
                jsou dostupné na evropských burzách. Nejlevnější jsou neobanky s nulovými poplatky za ETF.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-purple-100 w-20 h-20 mx-auto mb-8 hover:bg-purple-200 transition-colors hover-scale">
              <Zap className="w-10 h-10 text-purple-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Připraveni investovat do AI?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Najděte si ideálního brokera a začněte s investováním do nejlepších AI ETF
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="hover-scale bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold">
                <a href="/kde-koupit-etf">
                  <Users className="w-5 h-5 mr-2" />
                  Najít brokera pro ETF
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="hover-scale border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold">
                <a href="/srovnani-etf">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Srovnat všechny ETF
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
            href: "/nejlepsi-etf/nejlepsi-technologicke-etf", 
            title: "Nejlepší technologické ETF",
            description: "Širší tech sektor včetně AI"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-robotika-etf",
            title: "Nejlepší robotika ETF", 
            description: "Automatizace a robotické systémy"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-nasdaq-etf",
            title: "Nejlepší NASDAQ ETF",
            description: "Tech giganti z NASDAQ"
          }
        ]}
      />
    </Layout>
  );
}