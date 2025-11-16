import { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Star, BarChart3, Target, Lock, Cpu, AlertTriangle , DollarSign, Rocket, Zap, Users, Award, Globe, TrendingUp, Shield} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFLiveSection from '@/components/etf/Top3ETFLiveSection';
import FilteredETFSections from '@/components/etf/FilteredETFSections';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

const TOP_3_CYBERSECURITY_ETFS_TEMPLATE = [
  {
    name: "L&G Cyber Security UCITS ETF",
    ticker: "ISPY",
    isin: "IE00BYPLS672",
    provider: "Legal & General",
    reason: "Největší pure-play cybersecurity ETF s 2,42 mld. EUR. Zaměřuje se výhradně na společnosti poskytující kybernetickou bezpečnost a ochranu dat.",
    degiroFree: false,
  },
  {
    name: "iShares Digital Security UCITS ETF USD (Acc)",
    ticker: "SECT",
    isin: "IE00BG0J4C88", 
    provider: "iShares",
    reason: "Kvalitní cybersecurity ETF s 1,46 mld. EUR a TER 0,40%. Sleduje globální společnosti v oblasti digitální bezpečnosti a kybernetické ochrany.",
    degiroFree: false,
  },
  {
    name: "First Trust Nasdaq Cybersecurity UCITS ETF",
    ticker: "CIBR",
    isin: "IE00BF16M727",
    provider: "First Trust", 
    reason: "Specializovaný cybersecurity ETF s 1,11 mld. EUR sledující Nasdaq CTA Cybersecurity Index. Zaměřuje se na technologie kybernetické bezpečnosti.",
    degiroFree: false,
  }
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nejlepší Kyberbezpečnost ETF 2025 | Srovnání a Doporučení',
    description: 'Najděte nejlepší Kyberbezpečnost ETF pro rok 2025. Srovnání výkonnosti, poplatků a držených aktiv. Investujte do kybernetické bezpečnosti budoucnosti.',
    keywords: 'kyberbezpečnost ETF, nejlepší cyber ETF 2025, kybernetická bezpečnost investice, cyber security ETF, ISPY ETF, SECT ETF, CIBR ETF',
    openGraph: {
      title: 'Nejlepší Kyberbezpečnost ETF 2025 | Srovnání a Doporučení',
      description: 'Kompletní průvodce nejlepšími Kyberbezpečnost ETF. Analyzujeme výkonnost, poplatky a portfolia pro investice do kybernetické bezpečnosti.',
      type: 'article',
      url: 'https://etf-srovnani.cz/nejlepsi-etf/nejlepsi-kyberbezpecnost-etf',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Nejlepší Kyberbezpečnost ETF 2025',
      description: 'Srovnání nejlepších Kyberbezpečnost ETF pro investice do kybernetické bezpečnosti a ochrany digitálních dat.',
    },
    alternates: {
      canonical: 'https://etf-srovnani.cz/nejlepsi-etf/nejlepsi-kyberbezpecnost-etf',
    },
  };
}


export default async function NejlepsiCybersecurityETFPage() {
  // Get last modified date from database (all ETF updates)
  const lastModified = await getLastModifiedDate();

  const currentYear = new Date().getFullYear();

  // JSON-LD strukturovaná data pro SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Nejlepší kyberbezpečnost ETF ${currentYear} - cybersecurity a ochrana dat`,
    "description": "Srovnání nejlepších kyberbezpečnost ETF 2025. Cybersecurity, ochrana dat, L&G Cyber Security - TER, velikost fondů.",
    "image": "https://www.etfpruvodce.cz/og-cybersecurity-etf.jpg",
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
      "@id": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-kyberbezpecnost-etf"
    },
    "articleSection": "Investment Guides",
    "keywords": "kyberbezpečnost ETF, cybersecurity, ochrana dat, L&G Cyber Security, iShares Digital Security",
    "wordCount": 2800,
    "inLanguage": "cs-CZ",
    "about": [
      {
        "@type": "Thing",
        "name": "Cybersecurity ETF",
        "description": "Exchange-traded funds focused on cybersecurity and data protection companies"
      },
      {
        "@type": "FinancialProduct",
        "name": "L&G Cyber Security UCITS ETF",
        "identifier": "IE00BYPLS672"
      },
      {
        "@type": "FinancialProduct", 
        "name": "iShares Digital Security UCITS ETF USD (Acc)",
        "identifier": "IE00BG0J4C88"
      },
      {
        "@type": "FinancialProduct",
        "name": "First Trust Nasdaq Cybersecurity UCITS ETF", 
        "identifier": "IE00BF16M727"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "Cybersecurity Industry",
        "description": "Industry sector focused on digital security, data protection and cyber defense"
      },
      {
        "@type": "Thing", 
        "name": "Data Protection",
        "description": "Investment strategy focused on companies providing digital security solutions"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší kyberbezpečnost ETF v roce 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlepší kyberbezpečnost ETF jsou: L&G Cyber Security UCITS ETF (ISPY, IE00BYPLS672) největší pure-play cybersecurity ETF s 2,42 mld. EUR, iShares Digital Security UCITS ETF (SECT, IE00BG0J4C88) s 1,46 mld. EUR a TER 0,40%, a First Trust Nasdaq Cybersecurity UCITS ETF (CIBR, IE00BF16M727) s 1,11 mld. EUR."
        }
      },
      {
        "@type": "Question", 
        "name": "Co jsou kyberbezpečnost ETF a jaké firmy obsahují?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Kyberbezpečnost ETF investují do společností poskytujících kyberbezpečnost jako CrowdStrike, Palo Alto Networks, Fortinet, Check Point a další firmy. Zaměřují se na endpoint security, network security, cloud security a ochranu dat."
        }
      },
      {
        "@type": "Question",
        "name": "Proč investovat do kyberbezpečnost ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Kyberbezpečnost je defenzivní tech sektor s nezbytností služeb. Rostoucí kybernetické hrozby, digitalizace a regulace vytvářejí dlouhodobý růstový potenciál. Kyberbezpečnost ETF poskytují stabilnější expozici k tech sektoru."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou nejlevnější cybersecurity ETF s nízkými náklady?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlevnější cybersecurity ETF jsou: L&G Cyber Security UCITS ETF (ISPY, IE00BYPLS672) s TER 0,75%, iShares Digital Security UCITS ETF (SECT, IE00BG0J4C88) s TER 0,40%, a First Trust Nasdaq Cybersecurity UCITS ETF (CIBR, IE00BF16M727) s TER 0,60%."
        }
      },
      {
        "@type": "Question",
        "name": "Který cybersecurity ETF má největší velikost a likviditu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Největší cybersecurity ETF je L&G Cyber Security UCITS ETF (ISPY, IE00BYPLS672) s velikostí 2,42 mld. EUR. Poskytuje nejvyšší likviditu, nejužší spready a nejpure expozici pouze k cybersecurity společnostem."
        }
      },
      {
        "@type": "Question",
        "name": "Jaká je budoucnost cybersecurity sektoru a investic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cybersecurity sektor má silný růstový potenciál díky rostoucím kybernetickým hrozbám, digitalizaci firem, cloudové migraci a regulačním požadavkům. Globální cybersecurity trh roste tempem 12-15% ročně s dlouhodobou strukturální poptávkou."
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
        "name": "Nejlepší kyberbezpečnost ETF",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-kyberbezpecnost-etf"
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
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-gray-50/30 to-blue-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-red-200 to-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-gray-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-gray-100 text-red-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-red-200/50">
                <Shield className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-red-600 via-gray-600 to-blue-600 bg-clip-text text-transparent">
                  kyberbezpečnost ETF
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
                Kompletní srovnání nejlepších cybersecurity ETF. 
                Ochrana dat, kyberbezpečnost a digitální obrana včetně CrowdStrike, Palo Alto a Fortinet.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-red-600 to-gray-600 hover:from-red-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <Star className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <Shield className="w-5 h-5 mr-2" />
                    Kyberbezpečnost
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-3">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Kyberbezpečnost sektor v číslech</h3>
                  <p className="text-sm text-gray-600">Klíčové metriky pro cybersecurity investice</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-red-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ CYBER ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">2,4B</div>
                    <div className="text-xs text-gray-600">L&G Cyber Security</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0,40%</div>
                    <div className="text-xs text-gray-600">iShares Digital Security</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-red-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP HOLDING</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">5%</div>
                    <div className="text-xs text-gray-600">CrowdStrike</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">HROZBY ROSTOU</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">+25%</div>
                    <div className="text-xs text-gray-600">roční nárůst</div>
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
            <div className="flex items-center justify-center rounded-full bg-red-100 w-20 h-20 mx-auto mb-8 hover:bg-red-200 transition-colors hover-scale">
              <Shield className="w-10 h-10 text-red-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Co jsou kyberbezpečnost ETF?</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na společnosti poskytující kyberbezpečnost 
              a ochranu digitálních dat v době rostoucích hrozeb
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-gray-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-red-800 transition-colors">Ochrana dat</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Kyberbezpečnost chrání citlivá data před hackery a kyberútoky. 
                Firmy musí investovat do ochrany proti rostoucím digitálním hrozbám.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-gray-500 to-blue-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-gray-800 transition-colors">Defenzivní sektor</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Cybersecurity je nezbytná služba s opakovanými příjmy. 
                Firmy nemohou riskovat bez ochrany - stabilní obchodní model.
              </p>
            </div>

            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-red-600 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-800 transition-colors">Rostoucí hrozby</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Kyberútoky rostou exponenciálně s digitalizací. Regulace GDPR 
                a compliance požadavky pohánějí poptávku po bezpečnostních řešeních.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top 3 ETF Section */}
      <Top3ETFLiveSection 
        sectionId="top3"
        title="🏆 Top 3 nejlepší kyberbezpečnost ETF"
        subtitle="Naše doporučení na základě analýzy velikosti fondů a exposure k cybersecurity technologiím"
        etfTemplates={TOP_3_CYBERSECURITY_ETFS_TEMPLATE}
        colorScheme="red"
      />

      {/* Comprehensive ETF Sections */}
      <FilteredETFSections 
        indexKeywords={["Cyber", "Security", "Digital Security", "Data Protection"]}
        excludeKeywords={["China", "KraneShares", "Leveraged", "2x", "3x", "Short", "Bear", "Bond", "Currency", "Sustainable", "ESG", "Defense", "Defence"]}
      />

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="pruvodce" className="bg-gradient-to-br from-white to-red-50 rounded-3xl p-12 border border-red-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-red-100 to-gray-100 w-20 h-20 mx-auto mb-6">
                <Target className="w-10 h-10 text-red-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                🛡️ Jak vybrat ten správný kyberbezpečnost ETF?
              </h4>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Praktický průvodce výběrem nejlepšího cybersecurity ETF podle vaší investiční strategie a rizikového profilu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Velikost fondu a čistota</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Vybírejte ETF s minimálně 1 mld. EUR pro stabilitu. 
                  L&G Cyber Security (2,4 mld.) je pure-play, zatímco iShares Digital Security má širší záběr.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">TER a náklady</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cybersecurity ETF mají vyšší TER (0,40-0,69%) kvůli specializaci. 
                  iShares nabízí nejnižší poplatky 0,40%, L&G má 0,69%.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                  <Lock className="w-6 h-6 text-gray-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Subsektory cybersecurity</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sledujte expozici k endpoint security (CrowdStrike), network security (Palo Alto), 
                  cloud security (Zscaler) a identity management.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4">
                  <Globe className="w-6 h-6 text-red-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Geografická diverzifikace</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cybersecurity ETF jsou dominantně americké (60-70%) s evropskými a izraelskými 
                  firmami. Žádná závislost na čínských společnostech.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Defenzivní charakteristiky</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cybersecurity je méně volatilní než tech sektor. 
                  Opakované SaaS příjmy a nezbytnost služeb poskytují stabilitu.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                  <Award className="w-6 h-6 text-gray-600" />
                </div>
                <h5 className="text-lg font-bold text-gray-900 mb-3">Kvalita lídrů trhu</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sledujte top holdingy jako CrowdStrike, Palo Alto Networks, Fortinet, 
                  Check Point a Zscaler. Kvalitní firmy s rostoucími tržbami.
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
            <p className="text-xl text-gray-600">Odpovědi na nejčastější dotazy o kyberbezpečnost ETF</p>
          </div>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">
                  Jaké jsou nejlepší kyberbezpečnost ETF v roce 2025?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlepší kyberbezpečnost ETF jsou: <strong>L&G Cyber Security UCITS ETF</strong> (ISPY, IE00BYPLS672) 
                největší pure-play cybersecurity ETF s 2,42 mld. EUR, <strong>iShares Digital Security UCITS ETF</strong> (SECT, IE00BG0J4C88) 
                s 1,46 mld. EUR a TER 0,40%, a <strong>First Trust Nasdaq Cybersecurity UCITS ETF</strong> 
                (CIBR, IE00BF16M727) s 1,11 mld. EUR.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">
                  Co jsou kyberbezpečnost ETF a jaké firmy obsahují?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Kyberbezpečnost ETF</strong> investují do společností poskytujících kyberbezpečnost jako CrowdStrike, 
                Palo Alto Networks, Fortinet, Check Point a další firmy. Zaměřují se na endpoint security, network security, 
                cloud security a ochranu dat.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">
                  Proč investovat do kyberbezpečnost ETF?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Kyberbezpečnost je defenzivní tech sektor</strong> s nezbytností služeb. Rostoucí kybernetické hrozby, 
                digitalizace a regulace vytvářejí dlouhodobý růstový potenciál. Kyberbezpečnost ETF poskytují stabilnější 
                expozici k tech sektoru.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">
                  Jaké jsou nejlevnější cybersecurity ETF s nízkými náklady?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Nejlevnější cybersecurity ETF jsou: <strong>iShares Digital Security UCITS ETF</strong> (SECT, IE00BG0J4C88) 
                s TER 0,40%, <strong>First Trust Nasdaq Cybersecurity UCITS ETF</strong> (CIBR, IE00BF16M727) 
                s TER 0,60%, a <strong>L&G Cyber Security UCITS ETF</strong> (ISPY, IE00BYPLS672) s TER 0,75%.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">
                  Který cybersecurity ETF má největší velikost a likviditu?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                Největší cybersecurity ETF je <strong>L&G Cyber Security UCITS ETF</strong> (ISPY, IE00BYPLS672) 
                s velikostí 2,42 mld. EUR. Poskytuje nejvyšší likviditu, nejužší spready a nejpure expozici pouze k cybersecurity společnostem.
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
              <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-red-50 rounded-lg group-open:rounded-b-none transition-colors">
                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800">
                  Jaká je budoucnost cybersecurity sektoru a investic?
                </span>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                <strong>Cybersecurity sektor má silný růstový potenciál</strong> díky rostoucím kybernetickým hrozbám, 
                digitalizaci firem, cloudové migraci a regulačním požadavkům. Globální cybersecurity trh roste tempem 12-15% ročně 
                s dlouhodobou strukturální poptávkou.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-red-100">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-red-100 to-gray-100 w-20 h-20 mx-auto mb-6">
                <Rocket className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Připraveni investovat do digitální bezpečnosti?
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Kybernetické hrozby rostou exponenciálně a poptávka po ochraně dat nekončí. 
                Objevte nejlepší cybersecurity ETF a chraňte své portfolio moderními technologiemi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-red-50 rounded-xl border border-red-100">
                <Shield className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Ochrana dat</h4>
                <p className="text-sm text-gray-600">CrowdStrike, Palo Alto Networks a další lídři</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                <Lock className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Defenzivní růst</h4>
                <p className="text-sm text-gray-600">Nezbytné služby s opakovanými příjmy</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                <AlertTriangle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Rostoucí hrozby</h4>
                <p className="text-sm text-gray-600">Digitalizace zvyšuje potřebu ochrany</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-red-600 to-gray-600 hover:from-red-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                <a href="#top3">
                  <Star className="w-5 h-5 mr-2" />
                  Vybrat kyberbezpečnost ETF
                </a>
              </Button>
              <Button asChild variant="outline" className="border-2 border-red-300 text-red-700 hover:bg-red-50 px-8 py-3 text-lg font-semibold">
                <a href="/srovnani-etf">
                  <BarChart3 className="w-5 h-5 mr-2" />
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
            href: "/nejlepsi-etf/nejlepsi-cloud-etf", 
            title: "Nejlepší cloud ETF",
            description: "Cloud computing a SaaS"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-ai-etf",
            title: "Nejlepší AI ETF", 
            description: "Umělá inteligence a strojové učení"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-technologicke-etf",
            title: "Nejlepší technologické ETF",
            description: "Širší tech sektor a inovace"
          }
        ]}
      />
    </Layout>
  );
}