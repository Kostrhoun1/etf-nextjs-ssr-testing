import React from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Button } from '@/components/ui/button';
import { TrendingDownIcon, BarChart3Icon, TargetIcon, TrophyIcon, CalculatorIcon, DollarSignIcon, RocketIcon, ZapIcon, UsersIcon, AwardIcon } from '@/components/ui/icons';
import InternalLinking, { ETFGuideRelatedLinks } from '@/components/SEO/InternalLinking';
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import type { Metadata } from 'next';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Top 3 nejlevnější ETF - editoriální výběr s live daty z databáze
const TOP_3_CHEAPEST_ETFS_TEMPLATE = [
  {
    name: "UBS ETF (IE) MSCI World UCITS ETF (USD) A-acc",
    ticker: "WLDA",
    isin: "IE00B7KQ7B66",
    provider: "UBS",
    degiroFree: false,
    reason: "Jeden z nejlevnějších globálních ETF s TER pouze 0,17%. Diverzifikace napříč 1500+ akcií z vyspělých trhů.",
  },
  {
    name: "iShares Core FTSE 100 UCITS ETF GBP (Acc)",
    ticker: "ISF",
    isin: "IE00B53HP851",
    provider: "iShares",
    degiroFree: false,
    reason: "Extrémně nízký TER 0,07% pro britský trh. Ideální pro investory hledající nákladově efektivní přístup k UK akciím.",
  },
  {
    name: "iShares Core S&P 500 UCITS ETF USD (Acc)",
    ticker: "CSPX",
    isin: "IE00B5BMR087",
    provider: "iShares",
    degiroFree: true,
    reason: "Nejpopulárnější a nejlevnější S&P 500 ETF s TER 0,07%. Vysoká likvidita a dostupný zdarma na DEGIRO.",
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
    title: `Nejlevnější ETF ${currentYear} - Nejnižší TER poplatky`,
    description: `✅ Nejlevnější ETF ${currentYear} s nejnižšími TER poplatky. Akciové, dluhopisové a REIT ETF od 0,03%. Srovnání a doporučení k ${currentDate}.`,
    keywords: `nejlevnější ETF ${currentYear}, nejnižší TER poplatky, levné ETF fondy, nízké náklady ETF, UBS S&P 500, JPMorgan dluhopisy, Amundi REIT`,
    openGraph: {
      title: `Nejlevnější ETF ${currentYear} - Nejnižší TER poplatky`,
      description: `Nejlevnější ETF ${currentYear} s nejnižšími TER poplatky. Akciové, dluhopisové a REIT ETF od 0,03%.`,
      url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlevnejsi-etf',
      siteName: 'ETF průvodce.cz',
      images: [
        {
          url: 'https://www.etfpruvodce.cz/og-nejlevnejsi-etf.jpg',
          width: 1200,
          height: 630,
          alt: `Nejlevnější ETF ${currentYear}`,
        },
      ],
      locale: 'cs_CZ',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nejlevnější ETF ${currentYear} - Nejnižší TER poplatky`,
      description: `Nejlevnější ETF ${currentYear} s nejnižšími TER poplatky. Akciové, dluhopisové a REIT ETF od 0,03%.`,
      images: ['https://www.etfpruvodce.cz/og-nejlevnejsi-etf.jpg'],
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlevnejsi-etf',
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
      'article:published_time': `${currentYear}-01-15T10:00:00.000Z`,
      'article:modified_time': new Date(new Date().getMonth(), 1).toISOString(),
      'article:section': 'Investment Guides',
      'article:tag': 'nejlevnější ETF, nízké poplatky, TER, investování',
      'theme-color': '#10B981',
      'msapplication-TileColor': '#10B981',
      'format-detection': 'telephone=no',
    },
  };
}

export default async function NejlevnejsiETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlevnejsi-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const currentYear = new Date().getFullYear();

  // JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Nejlevnější ETF ${currentYear} - Nejnižší TER poplatky`,
    description: 'Kompletní přehled nejlevnějších ETF fondů s nejnižšími TER poplatky podle kategorií.',
    image: 'https://www.etfpruvodce.cz/og-nejlevnejsi-etf.jpg',
    author: {
      '@type': 'Person',
      name: 'Tomáš Kostrhoun',
      url: 'https://www.etfpruvodce.cz/o-nas#tomas-kostrhoun'
    },
    publisher: {
      '@type': 'Organization',
      name: 'ETF průvodce.cz',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.etfpruvodce.cz/logo.png'
      }
    },
    datePublished: `${currentYear}-01-15`,
    dateModified: lastModified.split('T')[0],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlevnejsi-etf'
    }
  };

  // FAQ structured data for better search snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Co je TER poplatek a jak se počítá?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TER (Total Expense Ratio) je celkový poplatek za správu ETF vyjádřený jako procento z hodnoty investice ročně. Například při TER 0,20% a investici 10.000 € zaplatíte 20 € ročně. Poplatek se strhává automaticky z výkonnosti fondu."
        }
      },
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi nejlevnějším a nejdražším ETF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nejlevnější ETF mají TER kolem 0,03-0,07%, zatímco nejdražší mohou mít 1-2% ročně. Na investici 100.000 € za 20 let může tento rozdíl znamenat 50.000+ € méně na konečné částce kvůli složenému úročení."
        }
      },
      {
        "@type": "Question",
        "name": "Jaké jsou nejlepší nejlevnější ETF pro začátečníky?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pro začátečníky doporučujeme iShares Core S&P 500 ETF (CSPX, IE00B5BMR087) s TER 0,07%, UBS MSCI World ETF (WLDA, IE00B7KQ7B66) s TER 0,17% a iShares Core FTSE 100 ETF (ISF, IE00B53HP851) s TER 0,07%. Tyto ETF kombinují nízké poplatky s vysokou likviditou a stabilitou."
        }
      }
    ]
  };

  // Fixed syntax error
  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                <TrendingDownIcon className="w-4 h-4" />
                <span>Nejnižší poplatky</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Nejlevnější ETF{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                {currentYear}
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

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Objevte ETF s nejnižšími TER poplatky podle kategorií. 
              <span className="text-green-600 font-semibold"> Od 0,03% ročně</span> - maximální úspory pro dlouhodobé investování.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                <a href="#top3" className="flex items-center">
                  <TrophyIcon className="w-5 h-5 mr-2" />
                  Top 3 nejlevnější
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3">
                <a href="#tabulky" className="flex items-center">
                  <BarChart3Icon className="w-5 h-5 mr-2" />
                  Kompletní tabulky
                </a>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">0,03%</div>
                <div className="text-sm text-gray-600">Nejnižší TER akciové</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">0,04%</div>
                <div className="text-sm text-gray-600">Nejnižší TER dluhopisové</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">0,24%</div>
                <div className="text-sm text-gray-600">Nejnižší TER REIT</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Low Costs Matter - Same as SP500 style */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              💰 Proč jsou nízké poplatky klíčové?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nízké TER poplatky mají obrovský dopad na dlouhodobé výnosy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CalculatorIcon,
                title: "Složené úročení",
                description: "Každé procento poplatku snižuje konečnou částku. Na investici 100.000 € za 20 let může rozdíl 0,5% znamenat 10.000+ € méně.",
                color: "green"
              },
              {
                icon: TargetIcon,
                title: "Transparentnost",
                description: "TER je jednoduše srovnatelná metrika. Čím nižší číslo, tím více peněz zůstává ve vašem portfoliu.",
                color: "blue"
              },
              {
                icon: AwardIcon,
                title: "Kontrola nákladů",
                description: "Poplatky jsou to jediné, co můžete ovlivnit. Výnosy trhu jsou nepředvídatelné, poplatky ETF konstantní.",
                color: "purple"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              const colorMap = {
                green: 'from-green-500 to-emerald-600',
                blue: 'from-blue-500 to-blue-600', 
                purple: 'from-purple-500 to-purple-600'
              };
              
              return (
                <div key={index} className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
                  <div className={`flex items-center justify-center rounded-full bg-gradient-to-r ${colorMap[item.color]} w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-green-800 transition-colors">
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

      {/* Top 3 Recommendations - Client Component with Live Data */}
      


      {/* FilteredETF Sections - Client Component with Database Queries */}
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

      <Top10SectionsServer etfs={etfs} currency="EUR" categoryName="nejlevnější" />

      {/* Selection Guide Section - Same as SP500 style */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Selection Guide */}
          <div id="pruvodce" className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-12 border border-green-100 shadow-xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-green-100 to-emerald-100 w-20 h-20 mx-auto mb-6">
                <TargetIcon className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                💡 Jak vybrat nejlevnější ETF?
              </h4>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Praktický průvodce výběrem podle vašeho investičního profilu
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">✅ Na co se zaměřit</h3>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">TER pod 0,3%</h4>
                    <p className="text-gray-600">Pro dlouhodobé investování vybírejte ETF s nejnižšími možnými poplatky.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Velikost fondu</h4>
                    <p className="text-gray-600">Větší fondy (500M+) jsou stabilnější a mají lepší likviditu.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Sledovaný index</h4>
                    <p className="text-gray-600">Důležitější než poskytovatel je kvalita a diverzifikace indexu.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">⚠️ Čeho se vyvarovat</h3>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">×</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Vysoké TER</h4>
                    <p className="text-gray-600">ETF s TER nad 0,7% jsou zpravidla příliš drahé pro pasivní investování.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">×</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Malé fondy</h4>
                    <p className="text-gray-600">Fondy pod 100M € mohou být uzavřeny nebo mít problémy s likviditou.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">×</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Pákové ETF</h4>
                    <p className="text-gray-600">Leveraged ETF mají vyšší poplatky a jsou vhodné jen pro zkušené investory.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center rounded-full bg-green-100 w-20 h-20 mx-auto mb-8 hover:bg-green-200 transition-colors hover-scale">
              <span className="text-2xl">❓</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Často kladené otázky o nejlevnějších ETF
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Odpovědi na nejčastější dotazy o poplatcích a výběru ETF s nejnižšími náklady
            </p>
          </div>

          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.2s]">
            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  question: "Co je TER poplatek a jak se počítá?",
                  answer: "TER (Total Expense Ratio) je celkový poplatek za správu ETF vyjádřený jako procento z hodnoty investice ročně. Například při TER 0,20% a investici 10.000 € zaplatíte 20 € ročně. Poplatek se strhává automaticky z výkonnosti fondu."
                },
                {
                  question: "Jaký je rozdíl mezi nejlevnějším a nejdražším ETF?",
                  answer: "Nejlevnější ETF mají TER kolem 0,03-0,07%, zatímco nejdražší mohou mít 1-2% ročně. Na investici 100.000 € za 20 let může tento rozdíl znamenat 50.000+ € méně na konečné částce kvůli složenému úročení."
                },
                {
                  question: "Jaké jsou nejlepší nejlevnější ETF pro začátečníky?",
                  answer: "Pro začátečníky doporučujeme iShares Core S&P 500 ETF (CSPX, IE00B5BMR087) s TER 0,07%, UBS MSCI World ETF (WLDA, IE00B7KQ7B66) s TER 0,17% a iShares Core FTSE 100 ETF (ISF, IE00B53HP851) s TER 0,07%. Tyto ETF kombinují nízké poplatky s vysokou likviditou a stabilitou."
                },
                {
                  question: "Proč mají některé ETF vyšší poplatky než jiné?",
                  answer: "Vyšší poplatky mohou odrážet složitější strategii, aktivní správu, menší velikost fondu nebo specializaci na konkrétní trhy. Základní indexové ETF na velké trhy mají zpravidla nejnižší poplatky díky úsporám z rozsahu."
                },
                {
                  question: "Jsou data v našich žebříčcích aktuální?",
                  answer: "Ano, všechny žebříčky nejlevnějších ETF jsou generovány živě z naší databáze při každém načtení stránky. Zahrnují nejnovější data o TER, velikosti fondů a dalších klíčových parametrech všech ETF dostupných pro evropské investory."
                },
                {
                  question: "Jak ovlivní nízké poplatky můj dlouhodobý výnos?",
                  answer: "Nízké poplatky mají zásadní vliv na dlouhodobé výnosy díky složenému úročení. Rozdíl 0,5% v TER může na 30letém investování snížit konečnou částku o 15-20%. Proto jsou nízké poplatky klíčové pro pasivní investory."
                }
              ].map((faq, index) => (
                <details key={index} className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
                  <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                    <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">{faq.question}</span>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InternalLinking relatedLinks={ETFGuideRelatedLinks} />
        </div>
      </div>
    </Layout>
  );
}