import { Metadata } from 'next'
import Layout from '../../../components/Layout'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Top3ETFServer from '@/components/etf/Top3ETFServer';
import Top10SectionsServer from '@/components/etf/Top10SectionsServer';
import { getTopETFsForCategory, categoryConfigs } from '@/lib/etf-data';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';
import { Button } from '@/components/ui/button';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nejlepší asijsko-pacifické ETF 2025 | Srovnání',
    description: 'Kompletní průvodce asijsko-pacifickými ETF v roce 2025. Porovnání MSCI Pacific vs FTSE Asia Pacific indexů. TOP 3 doporučení pro investice do Austrálie, Singapuru a dalších asijských trhů.',
    keywords: [
      'asijsko-pacifické ETF',
      'MSCI Pacific ETF',
      'FTSE Asia Pacific ETF',
      'nejlepší asijské ETF 2025',
      'Asia Pacific ex Japan ETF',
      'australské ETF',
      'singapurské ETF',
      'iShares MSCI Pacific',
      'Vanguard Asia Pacific',
      'investice do Asie',
      'rozvojové asijské trhy',
      'asijské akcie ETF'
    ].join(', '),
    openGraph: {
      title: 'Nejlepší asijsko-pacifické ETF 2025 | Srovnání',
      description: 'Kompletní průvodce asijsko-pacifickými ETF. TOP 3 doporučení, porovnání indexů a analýza asijsko-pacifických trhů bez Japonska.',
      type: 'article',
      locale: 'cs_CZ',
      siteName: 'ETF Průvodce',
      images: [
        {
          url: '/og-asia-pacific-etf.jpg',
          width: 1200,
          height: 630,
          alt: 'Nejlepší asijsko-pacifické ETF 2025 - průvodce a porovnání'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Nejlepší asijsko-pacifické ETF 2025 | Srovnání',
      description: 'Kompletní průvodce asijsko-pacifickými ETF. TOP 3 doporučení, porovnání indexů a analýza asijsko-pacifických trhů bez Japonska.',
      images: ['/og-asia-pacific-etf.jpg']
    },
    alternates: {
      canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlepsi-asijsko-pacificke-etf'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1
      }
    }
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Nejlepší asijsko-pacifické ETF 2025 - MSCI Pacific, FTSE Asia Pacific',
  description: 'Kompletní průvodce asijsko-pacifickými ETF v roce 2025. Porovnání MSCI Pacific vs FTSE Asia Pacific indexů s TOP 3 doporučeními.',
  author: {
    '@type': 'Person',
    name: 'Tomáš Kostrhoun',
    url: 'https://www.etfpruvodce.cz/o-nas#tomas-kostrhoun'
  },
  publisher: {
    '@type': 'Organization',
    name: 'ETF Průvodce',
    url: 'https://etf-pruvodce.cz'
  },
  datePublished: '2025-01-15',
  dateModified: new Date().toISOString().split('T')[0],
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://etf-pruvodce.cz/nejlepsi-etf/nejlepsi-asijsko-pacificke-etf'
  },
  image: {
    '@type': 'ImageObject',
    url: 'https://etf-pruvodce.cz/og-asia-pacific-etf.jpg',
    width: 1200,
    height: 630
  }
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Jaké jsou nejlepší asijsko-pacifické ETF v roce 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nejlepší asijsko-pacifické ETF v roce 2025 jsou: 1) iShares Core MSCI Pacific ex Japan UCITS ETF (IE00B52MJY50) s TER 0,20% a velikostí 2,9 mld EUR, 2) Vanguard FTSE Developed Asia Pacific ex Japan UCITS ETF (IE00B9F5YL18) s TER 0,15% a velikostí 1,2 mld EUR, 3) UBS MSCI Pacific Socially Responsible UCITS ETF (LU0629460832) s TER 0,28% a velikostí 894 mil EUR.'
      }
    },
    {
      '@type': 'Question', 
      name: 'Jaký je rozdíl mezi MSCI Pacific ex Japan a FTSE Asia Pacific ex Japan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MSCI Pacific ex Japan se zaměřuje primárně na vyspělé trhy jako Austrálie, Singapur a Hong Kong. FTSE Asia Pacific ex Japan zahrnuje širší spektrum asijsko-pacifických zemí včetně některých rozvojových trhů. Oba indexy vylučují Japonsko pro čistší expozici k ostatním asijským trhům.'
      }
    },
    {
      '@type': 'Question',
      name: 'Proč investovat do asijsko-pacifických ETF bez Japonska?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Asijsko-pacifické ETF bez Japonska nabízejí expozici k rychle rostoucím ekonomikám jako Austrálie, Singapur, Hong Kong a další. Umožňují cílenou diverzifikaci do asijského regionu bez překrývání s japonskými ETF. Region nabízí vysoký růstový potenciál a komplementární expozici k západním trhům.'
      }
    },
    {
      '@type': 'Question',
      name: 'Jaké země dominují v asijsko-pacifických ETF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'V asijsko-pacifických ETF dominují: Austrálie (~50-60% podíl) s těžebními a finančními společnostmi, Hong Kong (~15-20%) s technologickými firmami, Singapur (~8-12%) s bankami a nemovitostmi, Taiwan (~5-8%) s polovodičovými společnostmi a další země jako Nový Zéland a Jižní Korea.'
      }
    },
    {
      '@type': 'Question',
      name: 'Jak zdanit asijsko-pacifické ETF v České republice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Asijsko-pacifické UCITS ETF se zdaňují podle českého práva. Výnosy z prodeje podléhají dani z příjmů 15% (při držení nad 3 roky osvobození). Dividendy se zdaňují 15% srážkovou daní. Některé země mohou mít daňové smlouvy s ČR ovlivňující zdanění u zdroje.'
      }
    },
    {
      '@type': 'Question',
      name: 'Kde koupit asijsko-pacifické ETF v Česku?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Asijsko-pacifické ETF můžete koupit u českých brokerů jako Degiro, XTB, Trading212 nebo Interactive Brokers. Náš TOP 3 (iShares MSCI Pacific ex Japan IE00B52MJY50, Vanguard FTSE Asia Pacific ex Japan IE00B9F5YL18, UBS MSCI Pacific Socially Responsible LU0629460832) jsou dostupné na evropských burzách s nízkými transakčními poplatky.'
      }
    }
  ]
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Domů',
      item: 'https://etf-pruvodce.cz'
    },
    {
      '@type': 'ListItem', 
      position: 2,
      name: 'Nejlepší ETF',
      item: 'https://etf-pruvodce.cz/nejlepsi-etf'
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Nejlepší asijsko-pacifické ETF',
      item: 'https://etf-pruvodce.cz/nejlepsi-etf/nejlepsi-asijsko-pacificke-etf'
    }
  ]
}

export default async function NejlepsiAsijskoPacifickeETFPage() {
  // Server-side data fetching - data is included in HTML at build time
  const config = categoryConfigs['nejlepsi-asijsko-pacificke-etf'];
  const [etfs, lastModified] = await Promise.all([
    getTopETFsForCategory(config),
    getLastModifiedDate(),
  ]);

  const breadcrumbItems = [
    { href: '/', label: 'Domů' },
    { href: '/nejlepsi-etf', label: 'Nejlepší ETF' },
    { href: '/nejlepsi-etf/nejlepsi-asijsko-pacificke-etf', label: 'Nejlepší asijsko-pacifické ETF' }
  ]

  const top3ETFs = [
    {
      name: 'iShares Core MSCI Pacific ex Japan UCITS ETF (Acc)',
      ticker: 'IPAC',
      isin: 'IE00B52MJY50',
      provider: 'iShares',
      degiroFree: false,
      reason: 'Největší asijsko-pacifický ETF s expozicí k vyspělým trhům bez Japonska. Dominuje Austrálie a Hong Kong.'
    },
    {
      name: 'Vanguard FTSE Developed Asia Pacific ex Japan UCITS ETF', 
      ticker: 'VAPX',
      isin: 'IE00B9F5YL18',
      provider: 'Vanguard',
      degiroFree: false,
      reason: 'Velmi nízký TER 0,15% od Vanguardu. Pokrývá vyspělé asijsko-pacifické trhy s distribuční politikou.'
    },
    {
      name: 'UBS MSCI Pacific Socially Responsible UCITS ETF USD dis',
      ticker: 'UBSP',
      isin: 'LU0629460832',
      provider: 'UBS',
      degiroFree: false,
      reason: 'ESG orientovaný fond pro společensky odpovědné investování do asijsko-pacifického regionu.'
    }
  ]

  const indexKeywords = ['Pacific', 'Asia']
  const excludeKeywords = [
    'Leveraged', '2x', '3x', 'Short', 'Bear', 'Sector', 'Value', 'Growth', 'Quality',
    'Small Cap', 'ESG', 'SRI', 'Enhanced', 'Volatility', 'Dividend', 'Factor',
    'Mining', 'Gold', 'Silver', 'Crypto', 'Bitcoin', 'Blockchain', 'Energy', 'Water',
    'Aerospace', 'Defence', 'Defense', 'Climate', 'Technology', 'Healthcare',
    'Financials', 'Utilities', 'Materials', 'Consumer', 'Industrials', 'Bond',
    'Government', 'Semiconductors', 'Software', 'Banks', 'Insurance', 'REIT',
    'Infrastructure', 'Biotech', 'Pharmaceutical', 'Japan'
  ]

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Nejlepší asijsko-pacifické ETF 2025
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

              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Kompletní průvodce asijsko-pacifickými ETF. Porovnání <strong>MSCI Pacific</strong> vs <strong>FTSE Asia Pacific</strong> indexů, 
                TOP 3 doporučení pro investice do Austrálie, Singapuru a dalších asijských trhů.
              </p>
            </header>

            

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-teal-100">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b-4 border-teal-500 pb-3">
                🌏 Proč investovat do asijsko-pacifických ETF?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-teal-700">Největší výhody</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-3 text-xl">🚀</span>
                      <span><strong>Rychle rostoucí ekonomiky</strong> s HDP růstem 3-6% ročně</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-3 text-xl">🏭</span>
                      <span><strong>Suroviny a těžba</strong> - železná ruda, zlato, zemní plyn</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-3 text-xl">🏦</span>
                      <span><strong>Silný bankovní sektor</strong> v Austrálii a Singapuru</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-3 text-xl">💰</span>
                      <span><strong>Komplementární expozice</strong> k západním trhům</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-emerald-700">Klíčové trhy</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-3 text-xl">🇦🇺</span>
                      <span><strong>Austrálie</strong> - Commonwealth Bank, BHP Billiton</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-3 text-xl">🇭🇰</span>
                      <span><strong>Hong Kong</strong> - Tencent, AIA Group</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-3 text-xl">🇸🇬</span>
                      <span><strong>Singapur</strong> - DBS Bank, Singapore Airlines</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-3 text-xl">🇹🇼</span>
                      <span><strong>Taiwan</strong> - TSMC, MediaTek</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-teal-100">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b-4 border-teal-500 pb-3">
                📊 MSCI Pacific vs FTSE Asia Pacific - porovnání indexů
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                      <th className="border border-gray-300 p-4 text-left">Charakteristika</th>
                      <th className="border border-gray-300 p-4 text-left">MSCI Pacific ex Japan</th>
                      <th className="border border-gray-300 p-4 text-left">FTSE Asia Pacific ex Japan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-teal-50">
                      <td className="border border-gray-300 p-4 font-semibold">Počet společností</td>
                      <td className="border border-gray-300 p-4">~130 společností</td>
                      <td className="border border-gray-300 p-4">~600 společností</td>
                    </tr>
                    <tr className="hover:bg-teal-50">
                      <td className="border border-gray-300 p-4 font-semibold">Pokrytí trhu</td>
                      <td className="border border-gray-300 p-4">~85% vyspělých trhů</td>
                      <td className="border border-gray-300 p-4">~90% celého regionu</td>
                    </tr>
                    <tr className="hover:bg-teal-50">
                      <td className="border border-gray-300 p-4 font-semibold">Hlavní země</td>
                      <td className="border border-gray-300 p-4">Austrálie (~60%), Hong Kong (~25%)</td>
                      <td className="border border-gray-300 p-4">Austrálie (~50%), Hong Kong (~20%), Taiwan (~10%)</td>
                    </tr>
                    <tr className="hover:bg-teal-50">
                      <td className="border border-gray-300 p-4 font-semibold">Největší pozice</td>
                      <td className="border border-gray-300 p-4">Commonwealth Bank (~8%), ASML (~6%)</td>
                      <td className="border border-gray-300 p-4">Taiwan Semiconductor (~8%), Tencent (~6%)</td>
                    </tr>
                    <tr className="hover:bg-teal-50">
                      <td className="border border-gray-300 p-4 font-semibold">Diverzifikace</td>
                      <td className="border border-gray-300 p-4">✅ Zaměření na vyspělé trhy</td>
                      <td className="border border-gray-300 p-4">✅ Širší pokrytí regionu</td>
                    </tr>
                    <tr className="hover:bg-teal-50">
                      <td className="border border-gray-300 p-4 font-semibold">Dostupnost ETF</td>
                      <td className="border border-gray-300 p-4">✅ Široká nabídka</td>
                      <td className="border border-gray-300 p-4">✅ Dobrá nabídka</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500">
                <p className="text-gray-800">
                  <strong>Doporučení:</strong> MSCI Pacific ex Japan je ideální pro konzervativnější investory 
                  zaměřené na vyspělé trhy. FTSE Asia Pacific ex Japan nabízí širší expozici včetně růstových trhů.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-teal-100">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b-4 border-teal-500 pb-3">
                🗺️ Geografické rozložení asijsko-pacifických ETF
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-teal-700">Austrálie (50-60%)</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Banky:</strong> Commonwealth Bank, Westpac, ANZ</li>
                    <li><strong>Těžba:</strong> BHP Billiton, Rio Tinto, Fortescue</li>
                    <li><strong>Retail:</strong> Woolworths, Coles</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-emerald-700 mt-6">Hong Kong (15-25%)</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Technologie:</strong> Tencent, Alibaba</li>
                    <li><strong>Finanční služby:</strong> AIA Group, HKEX</li>
                    <li><strong>Nemovitosti:</strong> Sun Hung Kai Properties</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-teal-700">Singapur (8-12%)</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Banky:</strong> DBS Bank, UOB, OCBC</li>
                    <li><strong>Telekomunikace:</strong> Singapore Telecommunications</li>
                    <li><strong>Transport:</strong> Singapore Airlines</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-emerald-700 mt-6">Taiwan (5-10%)</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Polovodiče:</strong> Taiwan Semiconductor (TSMC)</li>
                    <li><strong>Technologie:</strong> MediaTek, ASE Group</li>
                    <li><strong>Elektronika:</strong> Hon Hai Precision</li>
                  </ul>
                </div>
              </div>
            </div>

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

      <Top10SectionsServer etfs={etfs} currency="EUR" categoryName="asijsko-pacifické" />

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-teal-100">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b-4 border-teal-500 pb-3">
                ❓ Nejčastější otázky o asijsko-pacifických ETF
              </h2>
              <div className="space-y-6">
                <details className="group border border-gray-200 rounded-lg hover:border-teal-200 transition-colors">
                  <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-teal-50 rounded-lg group-open:rounded-b-none transition-colors">
                    <span className="font-semibold text-lg text-gray-900 group-hover:text-teal-800">Jaké jsou nejlepší asijsko-pacifické ETF v roce 2025?</span>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-teal-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                    Nejlepší asijsko-pacifické ETF jsou: <strong>iShares Core MSCI Pacific ex Japan UCITS ETF</strong> (IE00B52MJY50) 
                    s TER 0,20% a velikostí 2,9 mld EUR, <strong>Vanguard FTSE Developed Asia Pacific ex Japan UCITS ETF</strong> (IE00B9F5YL18) 
                    s TER 0,15% a velikostí 1,2 mld EUR, a <strong>UBS MSCI Pacific Socially Responsible UCITS ETF</strong> 
                    (LU0629460832) s TER 0,28% a velikostí 894 mil EUR.
                  </div>
                </details>

                <details className="group border border-gray-200 rounded-lg hover:border-teal-200 transition-colors">
                  <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-teal-50 rounded-lg group-open:rounded-b-none transition-colors">
                    <span className="font-semibold text-lg text-gray-900 group-hover:text-teal-800">Jaký je rozdíl mezi MSCI Pacific ex Japan a FTSE Asia Pacific ex Japan?</span>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-teal-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                    <strong>MSCI Pacific ex Japan</strong> se zaměřuje primárně na vyspělé trhy jako Austrálie, Singapur a Hong Kong. 
                    <strong>FTSE Asia Pacific ex Japan</strong> zahrnuje širší spektrum asijsko-pacifických zemí včetně některých 
                    rozvojových trhů. Oba indexy vylučují Japonsko pro čistší expozici k ostatním asijským trhům.
                  </div>
                </details>

                <details className="group border border-gray-200 rounded-lg hover:border-teal-200 transition-colors">
                  <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-teal-50 rounded-lg group-open:rounded-b-none transition-colors">
                    <span className="font-semibold text-lg text-gray-900 group-hover:text-teal-800">Proč investovat do asijsko-pacifických ETF bez Japonska?</span>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-teal-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                    Asijsko-pacifické ETF bez Japonska nabízejí expozici k <strong>rychle rostoucím ekonomikám</strong> 
                    jako Austrálie, Singapur, Hong Kong a další. Umožňují cílenou diverzifikaci do asijského regionu 
                    bez překrývání s japonskými ETF. Region nabízí vysoký růstový potenciál a komplementární expozici k západním trhům.
                  </div>
                </details>

                <details className="group border border-gray-200 rounded-lg hover:border-teal-200 transition-colors">
                  <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-teal-50 rounded-lg group-open:rounded-b-none transition-colors">
                    <span className="font-semibold text-lg text-gray-900 group-hover:text-teal-800">Jaké země dominují v asijsko-pacifických ETF?</span>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-teal-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                    V asijsko-pacifických ETF dominují: <strong>Austrálie</strong> (~50-60% podíl) s těžebními a finančními společnostmi, 
                    <strong>Hong Kong</strong> (~15-20%) s technologickými firmami, <strong>Singapur</strong> (~8-12%) s bankami 
                    a nemovitostmi, <strong>Taiwan</strong> (~5-8%) s polovodičovými společnostmi a další země jako Nový Zéland a Jižní Korea.
                  </div>
                </details>

                <details className="group border border-gray-200 rounded-lg hover:border-teal-200 transition-colors">
                  <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-teal-50 rounded-lg group-open:rounded-b-none transition-colors">
                    <span className="font-semibold text-lg text-gray-900 group-hover:text-teal-800">Jak zdanit asijsko-pacifické ETF v České republice?</span>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-teal-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                    Asijsko-pacifické <strong>UCITS ETF se zdaňují podle českého práva</strong>. Výnosy z prodeje podléhají 
                    dani z příjmů 15% (při držení nad 3 roky osvobození). Dividendy se zdaňují 15% srážkovou daní. 
                    Některé země mohou mít daňové smlouvy s ČR ovlivňující zdanění u zdroje.
                  </div>
                </details>

                <details className="group border border-gray-200 rounded-lg hover:border-teal-200 transition-colors">
                  <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-teal-50 rounded-lg group-open:rounded-b-none transition-colors">
                    <span className="font-semibold text-lg text-gray-900 group-hover:text-teal-800">Kde koupit asijsko-pacifické ETF v Česku?</span>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-teal-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                    <strong>Asijsko-pacifické ETF můžete koupit</strong> u českých brokerů jako Degiro, XTB, Trading212 nebo Interactive Brokers. 
                    Náš TOP 3 (iShares MSCI Pacific ex Japan IE00B52MJY50, Vanguard FTSE Asia Pacific ex Japan IE00B9F5YL18, 
                    UBS MSCI Pacific Socially Responsible LU0629460832) jsou dostupné na evropských burzách s nízkými transakčními poplatky.
                  </div>
                </details>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-6">
                🎯 Závěrečné doporučení pro asijsko-pacifické ETF
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Pro konzervativní investory</h3>
                  <p className="mb-4">
                    Doporučujeme <strong>iShares Core MSCI Pacific ex Japan UCITS ETF</strong> nebo 
                    <strong> Vanguard FTSE Developed Asia Pacific ex Japan UCITS ETF</strong> - oba 
                    se zaměřují na vyspělé asijsko-pacifické trhy s nízkými poplatky.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Pro ESG orientované investory</h3>
                  <p className="mb-4">
                    Zvažte <strong>UBS MSCI Pacific Socially Responsible UCITS ETF</strong>, 
                    který kombinuje expozici k asijsko-pacifickému regionu s ESG kritérii 
                    pro společensky odpovědné investování.
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white/10 rounded-lg">
                <p className="text-lg">
                  <strong>Tip:</strong> Asijsko-pacifické ETF jsou ideálním doplněním globálního portfolia 
                  pro diverzifikaci do rychle rostoucích asijských ekonomik s komplementárními sektory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}