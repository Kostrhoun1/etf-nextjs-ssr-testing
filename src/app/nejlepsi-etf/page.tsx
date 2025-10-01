import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Button } from '@/components/ui/button';
import { 
  Star, Brain, ArrowRight, BarChart3, 
  Target, ChevronRight, BookOpen, Globe, Building, Shield, Award,
  DollarSign, Rocket, Zap, Users} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import type { Metadata } from 'next';

// Kompletní ETF kategorie pro rok 2025
const ETF_CATEGORIES = {
  // Podle indexů - nejpopulárnější
  indexes: {
    title: "Podle indexů",
    description: "ETF sledující konkrétní indexy a benchmarky",
    icon: BarChart3,
    color: "from-blue-500 to-blue-600",
    articles: [
      { slug: "nejlepsi-sp500-etf", title: "S&P 500 ETF", description: "Americké blue-chip společnosti" },
      { slug: "nejlepsi-nasdaq-etf", title: "NASDAQ ETF", description: "Technologické a růstové tituly" },
      { slug: "nejlepsi-msci-world-etf", title: "MSCI World ETF", description: "Celosvětová diverzifikace" },
      { slug: "nejlepsi-stoxx600-etf", title: "STOXX 600 ETF", description: "Největší evropské firmy" },
      { slug: "nejlepsi-ftse100-etf", title: "FTSE 100 ETF", description: "Britské blue-chip akcie" },
      { slug: "nejlepsi-dax-etf", title: "DAX ETF", description: "Německé dividend aristokraty" }
    ]
  },
  
  // Podle regionů
  regions: {
    title: "Podle regionů",
    description: "Geografická diverzifikace podle zemí a kontinentů",
    icon: Globe,
    color: "from-green-500 to-green-600",
    articles: [
      { slug: "nejlepsi-celosvetove-etf", title: "Celosvětové ETF", description: "Maximální diverzifikace" },
      { slug: "nejlepsi-evropske-etf", title: "Evropské ETF", description: "Evropské akciové trhy" },
      { slug: "nejlepsi-americke-etf", title: "Americké ETF", description: "USA akciové indexy" },
      { slug: "nejlepsi-emerging-markets-etf", title: "Emerging Markets ETF", description: "Rozvíjející se ekonomiky" },
      { slug: "nejlepsi-cinske-etf", title: "Čínské ETF", description: "Čínský růstový potenciál" },
      { slug: "nejlepsi-japonske-etf", title: "Japonské ETF", description: "Japonský akciový trh" }
    ]
  },

  // Podle strategie
  strategies: {
    title: "Podle strategie",
    description: "Investiční styly a přístupy",
    icon: Target,
    color: "from-purple-500 to-purple-600",
    articles: [
      { slug: "nejlepsi-dividendove-etf", title: "Dividendové ETF", description: "Pasivní příjem z dividend" },
      { slug: "nejlepsi-value-etf", title: "Value ETF", description: "Podhodnocené kvalitní firmy" },
      { slug: "nejlepsi-growth-etf", title: "Growth ETF", description: "Rychle rostoucí společnosti" },
      { slug: "nejlepsi-esg-etf", title: "ESG ETF", description: "Udržitelné investování" },
      { slug: "nejlepsi-small-cap-etf", title: "Small Cap ETF", description: "Malé perspektivní firmy" }
    ]
  },

  // Podle sektorů - tradiční
  sectors: {
    title: "Podle sektorů",
    description: "Specializace na konkrétní odvětví",
    icon: Building,
    color: "from-orange-500 to-orange-600",
    articles: [
      { slug: "nejlepsi-technologicke-etf", title: "Technologické ETF", description: "IT a software firmy" },
      { slug: "nejlepsi-healthcare-etf", title: "Healthcare ETF", description: "Zdravotnictví a farmacie" },
      { slug: "nejlepsi-financni-etf", title: "Finanční ETF", description: "Banky a pojišťovny" },
      { slug: "nejlepsi-energeticke-etf", title: "Energetické ETF", description: "Ropný a plynárenský sektor" },
      { slug: "nejlepsi-spotrebni-etf", title: "Spotřební ETF", description: "Konzumní zboží a služby" }
    ]
  },

  // Moderní sektory
  modern: {
    title: "Moderní trendy",
    description: "Budoucnost a inovace",
    icon: Brain,
    color: "from-pink-500 to-pink-600",
    articles: [
      { slug: "nejlepsi-ai-etf", title: "AI ETF", description: "Umělá inteligence a robotika" },
      { slug: "nejlepsi-clean-energy-etf", title: "Čistá energie ETF", description: "Obnovitelné zdroje energie" },
      { slug: "nejlepsi-biotechnologie-etf", title: "Biotechnologie ETF", description: "Moderní medicína a výzkum" },
      { slug: "nejlepsi-robotika-etf", title: "Robotika ETF", description: "Automatizace a robotika" },
      { slug: "nejlepsi-cloud-etf", title: "Cloud Computing ETF", description: "Cloudové služby a SaaS" },
      { slug: "nejlepsi-kyberbezpecnost-etf", title: "Kyberbezpečnost ETF", description: "Digitální zabezpečení" },
      { slug: "nejlepsi-defense-etf", title: "Defense ETF", description: "Obranný průmysl" }
    ]
  },

  // Podle asset class
  assets: {
    title: "Podle tříd aktiv",
    description: "Různé typy investičních aktiv",
    icon: Shield,
    color: "from-indigo-500 to-indigo-600",
    articles: [
      { slug: "nejlepsi-dluhopisove-etf", title: "Dluhopisové ETF", description: "Stabilní výnosy z dluhopisů" },
      { slug: "nejlepsi-zlate-etf", title: "Zlato ETF", description: "Investice do drahých kovů" },
      { slug: "nejlepsi-komoditni-etf", title: "Komoditní ETF", description: "Suroviny a komodity" },
      { slug: "nejlepsi-nemovitostni-etf", title: "REIT ETF", description: "Nemovitostní investice" }
    ]
  },

  // Podle nákladů
  costs: {
    title: "Podle nákladů",
    description: "Optimalizace podle poplatků a dostupnosti",
    icon: DollarSign,
    color: "from-emerald-500 to-emerald-600",
    articles: [
      { slug: "nejlevnejsi-etf", title: "Nejlevnější ETF fondy", description: "ETF s nejnižšími poplatky" },
      { slug: "etf-zdarma-degiro", title: "ETF zdarma na Degiro", description: "Nákup ETF bez poplatků" }
    ]
  }
};

// Next.js Metadata API for SSR SEO
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('cs-CZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return {
    title: `Nejlepší ETF ${currentYear} - Kompletní průvodce podle kategorií | ETF průvodce.cz`,
    description: `✅ Nejlepší ETF ${currentYear} podle indexů, regionů, sektorů a strategií. S&P 500, NASDAQ, MSCI World, dividendové a tech ETF. Aktuální data k ${currentDate}.`,
    keywords: `nejlepší ETF ${currentYear}, S&P 500 ETF, NASDAQ ETF, MSCI World ETF, dividendové ETF, tech ETF, evropské ETF, ETF indexy, investování do ETF`,
    openGraph: {
      title: `Nejlepší ETF ${currentYear} - Kompletní průvodce podle kategorií`,
      description: `Nejlepší ETF ${currentYear} podle indexů, regionů, sektorů a strategií. S&P 500, NASDAQ, MSCI World, dividendové a tech ETF.`,
      url: 'https://etfpruvodce.cz/nejlepsi-etf',
      siteName: 'ETF průvodce.cz',
      images: [
        {
          url: 'https://etfpruvodce.cz/og-nejlepsi-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlepší ETF ${currentYear}`,
        },
      ],
      locale: 'cs_CZ',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlepší ETF ${currentYear} - Kompletní průvodce`,
      description: `Nejlepší ETF ${currentYear} podle indexů, regionů, sektorů a strategií. S&P 500, NASDAQ, MSCI World, dividendové ETF.`,
      images: ['https://etfpruvodce.cz/og-nejlepsi-etf.jpg'],
    },
    alternates: {
      canonical: 'https://etfpruvodce.cz/nejlepsi-etf',
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
      'article:published_time': `${currentYear}-01-01T10:00:00.000Z`,
      'article:modified_time': new Date().toISOString(),
      'article:section': 'Investment Guides',
      'article:tag': 'nejlepší ETF, ETF průvodce, investování, indexové fondy',
      'theme-color': '#3B82F6',
      'msapplication-TileColor': '#3B82F6',
      'format-detection': 'telephone=no',
    },
  };
}

const currentYear = new Date().getFullYear();

export default function NejlepsiETFPage() {
  return (
    <Layout>
      {/* Modern Hero Section - matching /co-jsou-etf style */}
      <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-violet-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
                <Award className="w-4 h-4 mr-2" />
                Kompletní přehled nejlepších ETF {currentYear}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Nejlepší{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  ETF {currentYear}
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Kompletní průvodce nejlepšími ETF podle kategorií. Indexy, regiony, sektory a strategie pro české investory.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/srovnani-etf" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-5 h-5" />
                  Porovnat všechny ETF
                </Link>
                <Link 
                  href="/kde-koupit-etf" 
                  className="bg-white/80 backdrop-blur-sm border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Najít brokera
                </Link>
              </div>
            </div>
            
            {/* Right Content - Visual Element */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-violet-400/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">7 kategorií ETF</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Podle indexů (S&P 500, NASDAQ, MSCI World)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-700">Podle regionů (USA, Evropa, Asie)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                    <span className="text-gray-700">Podle sektorů (Tech, Healthcare, Finance)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Podle strategie (Value, Growth, ESG)</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-800">
                    💡 Přes 60 detailních článků o ETF fondech
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="prose prose-lg max-w-none">
          
          {/* Featured Article - Nejlepší ETF 2025 */}
          <section className="mb-16">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 rounded-2xl p-8 border border-blue-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl">
                  <Star className="h-8 w-8" />
                </div>
                <div>
                  <div className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    <Rocket className="w-4 h-4 mr-1" />
                    Doporučený článek {currentYear}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Nejlepší ETF {currentYear}</h2>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Kompletní přehled nejlepších ETF fondů pro rok {currentYear} s konkrétními doporučeními, 
                analýzou výkonnosti a tipy pro české investory. Ideální startovní bod pro vaše ETF investice.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/nejlepsi-etf/nejlepsi-etf-2025"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  Zobrazit nejlepší ETF {currentYear}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="bg-white/80 backdrop-blur-sm border border-blue-200 px-6 py-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Přečetlo už <span className="font-semibold text-blue-600">15 000+</span> investorů</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/60 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-900">TOP 10 ETF</span>
                  </div>
                  <p className="text-sm text-gray-600">Konkrétní doporučení fondů s analýzou</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-900">Pro začátečníky</span>
                  </div>
                  <p className="text-sm text-gray-600">Jednoduché rady a doporučení</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-900">Aktuální data</span>
                  </div>
                  <p className="text-sm text-gray-600">Pravidelně aktualizované informace</p>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Sections */}
          {Object.entries(ETF_CATEGORIES).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <section key={key} className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{category.title}</h2>
                    <p className="text-gray-600 text-lg">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/nejlepsi-etf/${article.slug}`}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all group"
                    >
                      <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {article.description}
                      </p>
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors mt-4">
                        <span className="text-sm font-medium mr-2">Zobrazit nejlepší ETF</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          {/* CTA Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Začněte investovat do ETF fondů ještě dnes</h2>
              <p className="text-xl mb-8 opacity-90">
                ETF fondy jsou nejjednodušší způsob, jak začít s pasivním investováním. 
                Nízké poplatky, automatická diverzifikace a dlouhodobé zhodnocení.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/srovnani-etf" className="bg-white text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all">
                  Srovnat všechny ETF
                </Link>
                <Link href="/kde-koupit-etf" className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-white/10 transition-all">
                  Kde koupit ETF
                </Link>
              </div>
            </div>
          </section>
        </article>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Internal Linking */}
        <InternalLinking 
          relatedLinks={[
            {
              title: "Kde koupit ETF",
              description: "Srovnání brokerů pro nákup ETF",
              href: "/kde-koupit-etf",
              category: "Praktické tipy"
            },
            {
              title: "Srovnání ETF",
              description: "Porovnejte všechny ETF podle kritérií",
              href: "/srovnani-etf",
              category: "Nástroje"
            },
            {
              title: "Portfolio strategie",
              description: "Jak sestavit ETF portfolio",
              href: "/portfolio-strategie",
              category: "Investiční strategie"
            },
            {
              title: "Co jsou ETF",
              description: "Základní průvodce ETF pro začátečníky",
              href: "/co-jsou-etf",
              category: "Vzdělání"
            }
          ]}
          title="Další užitečné stránky"
          className="bg-gray-50"
        />
      </div>
    </Layout>
  );
}