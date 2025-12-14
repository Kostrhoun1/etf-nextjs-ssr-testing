import { Metadata } from 'next'
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { StarIcon, BarChart3Icon, TargetIcon, PlaneIcon, ScanLineIcon, DollarSignIcon, RocketIcon, ZapIcon, UsersIcon, TrendingUpIcon, BuildingIcon, ShieldIcon, GlobeIcon, AwardIcon, FlagIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import ETFTableServer from '@/components/etf/ETFTableServer';
import { getTopETFsForCategory, categoryConfigs, getTotalETFCount } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

const TOP_3_DEFENSE_ETFS_TEMPLATE = [
  {
    name: "VanEck Defense UCITS ETF A",
    ticker: "DFEN",
    isin: "IE000YYE6WK5",
    provider: "VanEck",
    degiroFree: true,
    reason: "Největší defense ETF s 6,38 mld. EUR a TER 0,55%. Globální exposure k obranným technologiím a aerospace sektoru."
  },
  {
    name: "WisdomTree Europe Defence UCITS ETF EUR Unhedged Acc",
    ticker: "DEFN", 
    isin: "IE0002Y8CX98",
    provider: "WisdomTree",
    degiroFree: true,
    reason: "Druhý největší s 3,40 mld. EUR a TER 0,40%. Zaměření na evropské obranné společnosti s nevyhedgenou EUR expozicí."
  },
  {
    name: "HANetf Future of Defence UCITS ETF",
    ticker: "NATO",
    isin: "IE000OJ5TQP4", 
    provider: "HANetf",
    degiroFree: false,
    reason: "Specializovaný defense ETF s 2,59 mld. EUR a TER 0,49%. Zaměřuje se na budoucnost obrany a vojenských technologií."
  }
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nejlepší Defense ETF 2025 | Srovnání a Doporučení',
    description: 'Najděte nejlepší Defense ETF pro rok 2025. Srovnání výkonnosti, poplatků a držených aktiv. Investujte do obranného průmyslu budoucnosti.',
    keywords: 'defense ETF, nejlepší defense ETF 2025, obranný průmysl investice, aerospace ETF, DFEN ETF, NATO ETF, vojenské technologie ETF',
    openGraph: {
      title: 'Nejlepší Defense ETF 2025 | Srovnání a Doporučení',
      description: 'Kompletní průvodce nejlepšími Defense ETF. Analyzujeme výkonnost, poplatky a portfolia pro investice do obranného průmyslu.',
      type: 'article',
      url: 'https://etf-srovnani.cz/nejlepsi-etf/nejlepsi-defense-etf',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Nejlepší Defense ETF 2025',
      description: 'Srovnání nejlepších Defense ETF pro investice do obranného průmyslu a aerospace technologií.',
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-defense-etf',
    },
  };
}

const defenseFaqData = [
  {
    question: "Který Defense ETF je nejlepší pro rok 2025?",
    answer: "Naše TOP 3 doporučení: VanEck Defense UCITS ETF (DFEN, IE000YYE6WK5) s největšími aktivy 6,38 mld. EUR, WisdomTree Europe Defence ETF (DEFN, IE0002Y8CX98) s 3,40 mld. EUR pro evropskou expozici, a HANetf Future of Defence ETF (NATO, IE000OJ5TQP4) s 2,59 mld. EUR zaměřený na budoucí vojenské technologie."
  },
  {
    question: "Jaké jsou výhody investování do Defense ETF?",
    answer: "Defense ETF nabízejí expozici k defenzivnímu a strategicky důležitému sektoru. Výhody zahrnují: stabilní vládní kontrakty, dlouhodobé investiční cykly, technologické inovace v aerospace a rosnoucí geopolitické napětí zvyšující poptávku po obraně."
  },
  {
    question: "Obsahují Defense ETF i civilní aerospace společnosti?",
    answer: "Ano, kvalitní Defense ETF obvykle obsahují mix čistě obranných společností (Lockheed Martin, Northrop Grumman) i civilních aerospace firem (Boeing, Airbus). Tato diversifikace snižuje závislost pouze na vojenských zakázkách."
  },
  {
    question: "Jaké jsou poplatky u Defense ETF?",
    answer: "Poplatky (TER) u Defense ETF se pohybují mezi 0,35-0,55% ročně. iShares Global Aerospace & Defence má nejnižší TER 0,35%, WisdomTree Europe Defence 0,40% a VanEck Defense 0,55%. Specializované ETF mají vyšší poplatky než široké indexy."
  },
  {
    question: "Jsou Defense ETF etické pro investování?",
    answer: "Defense ETF investují do společností vyrábějících obranné technologie pro legitímní národní obranu. Mnoho investorů je považuje za etické, protože podporují bezpečnost demokratických zemí. Rozhodnutí je však individuální podle osobních hodnot."
  },
  {
    question: "Kde koupit naše doporučené Defense ETF?",
    answer: "Naše TOP 3 Defense ETF můžete koupit u většiny českých brokerů. VanEck Defense (IE000YYE6WK5) a WisdomTree Europe Defence (IE0002Y8CX98) jsou dostupné zdarma na Degiro. HANetf Future of Defence (IE000OJ5TQP4) najdete u Interactive Brokers, XTB nebo Trading212."
  }
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Nejlepší Defense ETF 2025 | Srovnání a Doporučení",
  "description": "Kompletní průvodce nejlepšími Defense ETF pro rok 2025. Srovnání výkonnosti, poplatků a držených aktiv.",
  "author": {
    "@type": "Person",
    "name": "Tomáš Kostrhoun",
    "url": "https://www.etfpruvodce.cz/o-nas#tomas-kostrhoun"
  },
  "publisher": {
    "@type": "Organization", 
    "name": "ETF Srovnání",
    "logo": {
      "@type": "ImageObject",
      "url": "https://etf-srovnani.cz/logo.png"
    }
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-15",
  "mainEntityOfPage": "https://etf-srovnani.cz/nejlepsi-etf/nejlepsi-defense-etf",
  "image": "https://etf-srovnani.cz/og-defense-etf.jpg",
  "articleSection": "ETF Investice",
  "keywords": "defense ETF, nejlepší defense ETF 2025, obranný průmysl investice, aerospace ETF",
  "mainEntity": {
    "@type": "FAQPage",
    "mainEntity": defenseFaqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
};

export default async function NejlepsiDefenseETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-defense-etf'];
  const [etfs, lastModified, totalCount] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
    getTotalETFCount(),
  ]);

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-blue-50/30 to-slate-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-gray-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-slate-200 to-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-gray-100 to-blue-100 text-gray-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-gray-200/50">
                <ShieldIcon className="w-4 h-4 mr-2" />
                Aktuální k {new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-gray-600 via-blue-600 to-slate-600 bg-clip-text text-transparent">
                  Defense ETF
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
                Kompletní srovnání nejlepších Defense ETF fondů pro investice do obranného průmyslu. 
                Analýza poplatků, výkonnosti a praktické tipy pro výběr.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-gray-600 to-blue-600 hover:from-gray-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-md h-12">
                  <a href="#top3">
                    <StarIcon className="w-5 h-5 mr-2" />
                    Top 3 doporučení
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold h-12">
                  <a href="#srovnani">
                    <ShieldIcon className="w-5 h-5 mr-2" />
                    Srovnání ETF
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Content - Defense Stats */}
            <div className="relative mt-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
                
                {/* Simple Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-3">
                    <ShieldIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Defense sektor v číslech
                  </h3>
                  <p className="text-sm text-gray-600">Klíčová fakta o obranném průmyslu</p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BuildingIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJVĚTŠÍ ETF</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">6.4B</div>
                    <div className="text-xs text-gray-600">VanEck Defense</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSignIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500 font-medium">NEJNIŽŠÍ TER</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0.35%</div>
                    <div className="text-xs text-gray-600">iShares Aerospace</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <GlobeIcon className="w-4 h-4 text-slate-600" />
                      <span className="text-xs text-gray-500 font-medium">TOP HOLDING</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">8%</div>
                    <div className="text-xs text-gray-600">Lockheed Martin</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <PlaneIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-500 font-medium">VÝBĚR</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">10+</div>
                    <div className="text-xs text-gray-600">Defense ETF</div>
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
            <div className="flex items-center justify-center rounded-full bg-gray-100 w-20 h-20 mx-auto mb-8 hover:bg-gray-200 transition-colors hover-scale">
              <ShieldIcon className="w-10 h-10 text-gray-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Co jsou Defense ETF?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Investiční fondy zaměřené na obranný průmysl a aerospace společnosti poskytující národní bezpečnost
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: ShieldIcon,
                title: "Obranné technologie",
                description: "ETF investují do společností vyvíjejících vojenské systémy, radary, rakety a pokročilé obranné technologie.",
                color: "gray"
              },
              {
                icon: PlaneIcon,
                title: "Aerospace průmysl",
                description: "Zahrnují civilní i vojenské letectví - Boeing, Airbus, Lockheed Martin a další aerospace lídry.",
                color: "blue"
              },
              {
                icon: BuildingIcon,
                title: "Stabilní kontrakty",
                description: "Dlouhodobé vládní zakázky poskytují předvídatelné příjmy a menší volatilitu než jiné tech sektory.",
                color: "slate"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              const colorMap = {
                gray: "from-gray-500 to-slate-600",
                blue: "from-blue-500 to-indigo-600", 
                slate: "from-slate-500 to-gray-600"
              };
              
              return (
                <div key={index} className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
                  <div className={`flex items-center justify-center rounded-full bg-gradient-to-r ${colorMap[item.color]} w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-gray-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top 3 ETF Live Section */}
      

      {/* Filtered ETF Sections */}
            {/* Top 3 Recommendations - Server-side rendered with real data */}
      <section id="top3" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top 3 ETF v této kategorii
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naše doporučení na základě analýzy {etfs.length} ETF fondů
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
              Top {Math.min(50, etfs.length)} ETF fondů seřazených podle velikosti
            </p>
          </div>
          <ETFTableServer etfs={etfs} showRank={true} currency="EUR" maxRows={50} />
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-2">
              <a href="/srovnani-etf">
                Zobrazit všech {totalCount.toLocaleString('cs-CZ')} ETF fondů
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Selection Guide Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="pruvodce" className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 border border-gray-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-gray-100 to-blue-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-gray-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                💡 Jak vybrat ten správný Defense ETF?
              </h4>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Při výběru Defense ETF je důležité zvážit geografickou expozici, mix obranných vs. civilních aerospace společností 
                a poměr mezi tradičními a high-tech defense firmami.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3Icon className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technické faktory</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Velikost aktiv:</strong> Min. 500 mil. EUR</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>TER poplatky:</strong> Obvykle 0,35-0,55%</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Geografická expozice:</strong> US vs. evropská</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Likvidita:</strong> Denní obchodování</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <TargetIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Portfolio faktory</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Defense vs. Aerospace:</strong> Poměr segmentů</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Top holdings:</strong> Kvalita lídrů trhu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Kontraktová stabilita:</strong> Vládní vs. komerční</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Technologický fokus:</strong> Tradiční vs. high-tech</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                  <AwardIcon className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Praktické tipy</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Začněte s velkými:</strong> DFEN nebo DEFN</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Diverzifikace:</strong> Kombinujte US a EU</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Dlouhodobě:</strong> 5+ let horizon</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Monitorujte:</strong> Geopolitické trendy</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-600 to-blue-600 text-white rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <RocketIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Tip pro začátečníky</h3>
                  <p className="text-gray-100">Strategické investování do obrany</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed">
                Začněte s největšími defense ETF jako <strong>VanEck Defense ETF</strong> 
                nebo <strong>WisdomTree Europe Defence ETF</strong>. Defense sektor je cyklický, 
                ale má stabilní dlouhodobé trendy díky geopolitickým faktorům a kontinuálním vládním investicím.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Často kladené otázky o <span className="bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent">Defense ETF</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Odpovědi na nejčastější dotazy ohledně investování do Defense ETF a obranného průmyslu
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {defenseFaqData.map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-gray-100 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-gray-800 flex items-start gap-3">
                    <span className="w-6 h-6 bg-gradient-to-r from-gray-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {faq.question}
                  </span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg ml-9">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur rounded-3xl p-12 border border-white/20">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Připraveni investovat do 
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"> Defense ETF</span>?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Začněte s našimi doporučenými Defense ETF a získejte expozici k strategicky důležitému obranému průmyslu s dlouhodobým růstovým potenciálem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
              >
                <a href="#top3">
                  <ShieldIcon className="w-5 h-5 mr-2" />
                  Zobrazit TOP Defense ETF
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-blue-400 text-blue-100 hover:bg-blue-500/20 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur"
              >
                <a href="/srovnani-brokeru" target="_blank" rel="noopener noreferrer">
                  <UsersIcon className="w-5 h-5 mr-2" />
                  Najít brokera
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
            href: "/nejlepsi-etf/nejlepsi-kyberbezpecnost-etf",
            title: "Nejlepší Kyberbezpečnost ETF 2025",
            description: "Investice do kybernetické bezpečnosti a defense technologií"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-ai-etf", 
            title: "Nejlepší AI ETF 2025",
            description: "ETF zaměřené na umělou inteligenci a vojenské AI systémy"
          },
          {
            href: "/nejlepsi-etf/nejlepsi-tech-etf",
            title: "Nejlepší Tech ETF 2025", 
            description: "Širší technologický sektor včetně defense tech"
          }
        ]}
      />
    </Layout>
  );
}