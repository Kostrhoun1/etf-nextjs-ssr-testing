import React from 'react';
import Layout from '@/components/Layout';
import StructuredData from '@/components/SEO/StructuredData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nejlepší ETF 2025 - Top 10 fondů pro investování',
  description: '✅ Nejlepší ETF fondy 2025: VWCE, IWDA, VUAA a další. Detailní analýza, poplatky, výnosy. Sestavte si ideální portfolio s minimálními náklady!',
  keywords: 'nejlepší ETF 2025, VWCE, IWDA, VUAA, ETF fondy, investování ETF, portfolio ETF, top ETF',
  openGraph: {
    title: 'Nejlepší ETF 2025 - Top 10 fondů pro investování',
    description: 'Nejlepší ETF fondy 2025: VWCE, IWDA, VUAA. Detailní analýza, poplatky, výnosy. Sestavte si ideální portfolio!',
    url: 'https://www.etfpruvodce.cz/nejlepsi-etf-2025',
    siteName: 'ETF průvodce.cz',
    images: [{
      url: 'https://www.etfpruvodce.cz/og-nejlepsi-etf-2025.jpg',
      width: 1200,
      height: 630,
    }],
    locale: 'cs_CZ',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nejlepší ETF 2025 - Top 10 fondů',
    description: 'VWCE, IWDA, VUAA - nejlepší ETF fondy pro rok 2025',
    images: ['https://www.etfpruvodce.cz/og-nejlepsi-etf-2025.jpg'],
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/nejlepsi-etf-2025',
  },
  robots: {
    index: true,
    follow: true,
  },
};
import InternalLinking from '@/components/SEO/InternalLinking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Star, PieChart , Flag, Shield, Users, Award, TrendingUp, Building} from 'lucide-react';

export default function NejlepsiETF2025Page() {
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
        "name": "Nejlepší ETF 2025",
        "item": "https://www.etfpruvodce.cz/nejlepsi-etf-2025"
      }
    ]
  };

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Nejlepší ETF fondy 2025",
    "description": "Výběr nejlepších ETF fondů pro investování v roce 2025 podle kategorií a investičních cílů",
    "numberOfItems": 5,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Vanguard FTSE All-World UCITS ETF (VWCE)",
        "url": "https://www.etfpruvodce.cz/etf/IE00BK5BQT80"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "iShares Core MSCI World UCITS ETF (IWDA)",
        "url": "https://www.etfpruvodce.cz/etf/IE00B4L5Y983"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Vanguard S&P 500 UCITS ETF (VUAA)",
        "url": "https://www.etfpruvodce.cz/etf/IE00BFMXXD54"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "iShares Core Euro Aggregate Bond UCITS ETF (AGGH)",
        "url": "https://www.etfpruvodce.cz/etf/IE00B3DKXQ41"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "iShares MSCI Emerging Markets UCITS ETF (IEMA)",
        "url": "https://www.etfpruvodce.cz/etf/IE00B4L5YC18"
      }
    ]
  };

  const topETFs = [
    {
      rank: 1,
      name: "Vanguard FTSE All-World",
      ticker: "VWCE", 
      category: "🌍 Celosvětové akcie",
      ter: "0.22%",
      assets: "15.8 mld EUR",
      description: "Nejlepší ETF pro začátečníky i pokročilé investory",
      pros: ["4000+ akcií z celého světa", "Automatická diverzifikace", "Nízké poplatky", "Vysoká likvidita"],
      cons: ["Vyšší TER než IWDA", "Bez dividend reinvestice"],
      recommendation: "Nejlepší volba pro všechny",
      badge: "🏆 #1 Volba",
      badgeColor: "bg-yellow-100 text-yellow-800",
      performance: "+8.5% ročně (5 let)",
      whereToBuy: ["DEGIRO: 2€/rok", "XTB: 0€", "Trading 212: 0€"]
    },
    {
      rank: 2, 
      name: "iShares Core MSCI World",
      ticker: "IWDA",
      category: "🌎 Rozvinuté země",
      ter: "0.20%",
      assets: "63.2 mld EUR",
      description: "Nejpopulárnější světový ETF s nejnižšími poplatky",
      pros: ["Nejnižší TER (0.20%)", "Obrovské AUM", "Výborná likvidita", "Jen rozvinuté trhy"],
      cons: ["Bez emerging markets", "Menší diverzifikace"],
      recommendation: "Pro nákladově citlivé investory",
      badge: "💰 Nejnižší TER",
      badgeColor: "bg-green-100 text-green-800", 
      performance: "+8.1% ročně (5 let)",
      whereToBuy: ["DEGIRO: 2€/rok", "XTB: 0€", "Trading 212: 0€"]
    },
    {
      rank: 3,
      name: "Vanguard S&P 500",
      ticker: "VUAA",
      category: "🇺🇸 USA akcie",
      ter: "0.07%",
      assets: "9.1 mld EUR", 
      description: "Nejlepší ETF pro investice do USA technologií",
      pros: ["Nejnižší poplatky", "500 největších USA firem", "Dlouhá historie", "Tech giganti"],
      cons: ["Pouze USA", "Koncentrace do tech", "Měnové riziko"],
      recommendation: "Pro růstové investory",
      badge: "🚀 USA Tech",
      badgeColor: "bg-blue-100 text-blue-800",
      performance: "+12.8% ročně (5 let)",
      whereToBuy: ["DEGIRO: 2€/rok", "XTB: 0€", "Trading 212: 0€"]
    },
    {
      rank: 4,
      name: "iShares Core Euro Aggregate Bond",
      ticker: "AGGH",
      category: "🏛️ Evropské dluhopisy",
      ter: "0.12%", 
      assets: "2.1 mld EUR",
      description: "Nejlepší dluhopisový ETF pro stabilizaci portfolia",
      pros: ["Nízké riziko", "Stabilní výnosy", "EUR denominace", "Kvalitní dluhopisy"],
      cons: ["Nízké výnosy", "Citlivost na úroky", "Inflační riziko"],
      recommendation: "Pro konzervativní část portfolia",
      badge: "🛡️ Stabilita",
      badgeColor: "bg-gray-100 text-gray-800",
      performance: "+1.2% ročně (5 let)",
      whereToBuy: ["DEGIRO: 2€/rok", "XTB: 0€", "Trading 212: 0€"]
    },
    {
      rank: 5,
      name: "iShares MSCI Emerging Markets",
      ticker: "IEMA", 
      category: "🌏 Rozvíjející se trhy",
      ter: "0.18%",
      assets: "14.9 mld EUR",
      description: "Nejlepší ETF pro diverzifikaci do rozvíjejících se trhů",
      pros: ["Rychle rostoucí ekonomiky", "Nízká korelace s USA", "Vysoký růstový potenciál"],
      cons: ["Vyšší volatilita", "Politická rizika", "Měnové výkyvy"],
      recommendation: "Max. 20% portfolia",
      badge: "📈 Vysoký růst",
      badgeColor: "bg-purple-100 text-purple-800",
      performance: "+2.1% ročně (5 let)",
      whereToBuy: ["DEGIRO: 2€/rok", "XTB: 0€", "Trading 212: 0€"]
    }
  ];

  const portfolioSuggestions = [
    {
      name: "Konzervativní portfolio",
      ageGroup: "50+ let",
      allocation: [
        { etf: "IWDA", percentage: 50, name: "Světové akcie" },
        { etf: "AGGH", percentage: 40, name: "Dluhopisy" },
        { etf: "IEMA", percentage: 10, name: "Emerging markets" }
      ],
      expectedReturn: "5-7% ročně",
      riskLevel: "Nízké"
    },
    {
      name: "Vyvážené portfolio", 
      ageGroup: "30-50 let",
      allocation: [
        { etf: "VWCE", percentage: 70, name: "Světové akcie" },
        { etf: "AGGH", percentage: 20, name: "Dluhopisy" },
        { etf: "IEMA", percentage: 10, name: "Emerging markets" }
      ],
      expectedReturn: "6-9% ročně",
      riskLevel: "Střední"
    },
    {
      name: "Růstové portfolio",
      ageGroup: "20-40 let", 
      allocation: [
        { etf: "VWCE", percentage: 80, name: "Světové akcie" },
        { etf: "VUAA", percentage: 15, name: "USA Tech" },
        { etf: "IEMA", percentage: 5, name: "Emerging markets" }
      ],
      expectedReturn: "8-12% ročně",
      riskLevel: "Vysoké"
    }
  ];

  return (
    <Layout>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={listSchema} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero sekce */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            🏆 Aktualizováno pro rok 2025
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Nejlepší ETF 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Výběr top ETF fondů pro rok 2025. Detailní analýza výnosů, poplatků a rizik. 
            Sestavte si ideální portfolio s našimi doporučeními od expertů.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Top 10 ETF</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Aktuální data 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>EU regulované</span>
            </div>
          </div>
        </div>

        {/* Kritéria výběru */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-blue-600" />
              Podle jakých kritérií vybíráme nejlepší ETF?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-semibold mb-2">Nízké poplatky</h3>
                <p className="text-sm text-gray-600">TER pod 0.25%, žádné skryté poplatky</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold mb-2">Velikost fondu</h3>
                <p className="text-sm text-gray-600">AUM nad 100 mil. EUR pro stabilitu</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌍</div>
                <h3 className="font-semibold mb-2">Diverzifikace</h3>
                <p className="text-sm text-gray-600">Široká geografická a sektorová</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-semibold mb-2">Dlouhodobé výnosy</h3>
                <p className="text-sm text-gray-600">Konzistentní performance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top ETF seznam */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            🏆 Top 5 nejlepších ETF pro rok 2025
          </h2>
          
          {topETFs.map((etf, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {etf.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{etf.name}</CardTitle>
                        <Badge className={etf.badgeColor}>{etf.badge}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-mono font-semibold">{etf.ticker}</span>
                        <span>{etf.category}</span>
                        <span>TER: {etf.ter}</span>
                        <span>AUM: {etf.assets}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">{etf.performance}</div>
                    <div className="text-sm text-gray-600">5letý průměr</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{etf.description}</p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Výhody
                    </h4>
                    <ul className="space-y-1">
                      {etf.pros.map((pro, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-red-600 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Nevýhody
                    </h4>
                    <ul className="space-y-1">
                      {etf.cons.map((con, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Kde koupit nejlevněji</h4>
                    <ul className="space-y-1">
                      {etf.whereToBuy.map((broker, i) => (
                        <li key={i} className="text-sm">{broker}</li>
                      ))}
                    </ul>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-800 text-sm">{etf.recommendation}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Portfolio návrhy */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-6 w-6 text-purple-600" />
              Doporučená portfolia podle věku
            </CardTitle>
            <CardDescription>Jak sestavit portfolio z nejlepších ETF podle vašeho věku a rizikového profilu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {portfolioSuggestions.map((portfolio, index) => (
                <div key={index} className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold">{portfolio.name}</h3>
                    <p className="text-sm text-gray-600">{portfolio.ageGroup}</p>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {portfolio.allocation.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold">{item.percentage}%</span>
                          <span className="text-sm text-gray-600 ml-2">{item.name}</span>
                        </div>
                        <Badge variant="outline" className="font-mono text-xs">{item.etf}</Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-xs text-gray-500 uppercase">Očekávané výnosy</div>
                      <div className="font-semibold text-green-600">{portfolio.expectedReturn}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase">Riziko</div>
                      <div className="font-semibold">{portfolio.riskLevel}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Srovnávací tabulka */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Rychlé srovnání top ETF</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-semibold">ETF</th>
                    <th className="text-left py-3 font-semibold">TER</th>
                    <th className="text-left py-3 font-semibold">AUM</th>
                    <th className="text-left py-3 font-semibold">5letý výnos</th>
                    <th className="text-left py-3 font-semibold">Počet pozic</th>
                    <th className="text-left py-3 font-semibold">Riziko</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div>
                        <div className="font-semibold">VWCE</div>
                        <div className="text-xs text-gray-600">Vanguard All-World</div>
                      </div>
                    </td>
                    <td className="py-3">0.22%</td>
                    <td className="py-3">15.8 mld €</td>
                    <td className="py-3 text-green-600 font-semibold">+8.5%</td>
                    <td className="py-3">4000+</td>
                    <td className="py-3">
                      <Badge className="bg-yellow-100 text-yellow-800">Střední</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div>
                        <div className="font-semibold">IWDA</div>
                        <div className="text-xs text-gray-600">iShares MSCI World</div>
                      </div>
                    </td>
                    <td className="py-3 text-green-600 font-semibold">0.20%</td>
                    <td className="py-3">63.2 mld €</td>
                    <td className="py-3 text-green-600 font-semibold">+8.1%</td>
                    <td className="py-3">1500+</td>
                    <td className="py-3">
                      <Badge className="bg-yellow-100 text-yellow-800">Střední</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div>
                        <div className="font-semibold">VUAA</div>
                        <div className="text-xs text-gray-600">Vanguard S&P 500</div>
                      </div>
                    </td>
                    <td className="py-3 text-green-600 font-semibold">0.07%</td>
                    <td className="py-3">9.1 mld €</td>
                    <td className="py-3 text-green-600 font-semibold">+12.8%</td>
                    <td className="py-3">500</td>
                    <td className="py-3">
                      <Badge className="bg-orange-100 text-orange-800">Vyšší</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Často kladené otázky */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              Často kladené otázky o nejlepších ETF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  question: "Který ETF je nejlepší pro začátečníky?",
                  answer: "VWCE (Vanguard All-World) je ideální pro začátečníky. Obsahuje přes 4000 akcií z celého světa, takže získáte maximální diverzifikaci v jednom ETF."
                },
                {
                  question: "Stačí investovat pouze do jednoho ETF?",
                  answer: "Ano, VWCE nebo IWDA vám poskytnou dostatečnou diverzifikaci. Pro začátek je často lepší jeden kvalitní ETF než komplikované portfolio."
                },
                {
                  question: "Jaký je rozdíl mezi VWCE a IWDA?",
                  answer: "VWCE obsahuje i rozvojové trhy (23%), IWDA pouze rozvinuté země. IWDA má nižší poplatky (0.20% vs 0.22%), VWCE větší diverzifikaci."
                },
                {
                  question: "Měl bych přidat dluhopisy do portfolia?",
                  answer: "Záleží na věku a rizikovém profilu. Mladší investoři (do 40) mohou být 100% v akciích. Starší by měli zvážit 20-40% v dluhopisech (AGGH)."
                },
                {
                  question: "Kde koupit tyto ETF nejlevněji?",
                  answer: "XTB a Trading 212 nabízí většinu ETF bez poplatků. DEGIRO má poplatek 2€/rok za ETF, ale má nejširší nabídku."
                },
                {
                  question: "Kdy rebalancovat portfolio?",
                  answer: "Rebalancujte 1-2x ročně nebo když se alokace odchýlí o více než 5% od cílové. Častější rebalancování snižuje výnosy kvůli poplatkům."
                }
              ].map((faq, index) => (
                <details key={index} className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
                  <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-blue-50 rounded-lg group-open:rounded-b-none transition-colors">
                    <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-800">{faq.question}</span>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA sekce */}
        <Card className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Připraveni investovat do nejlepších ETF?</CardTitle>
            <CardDescription className="text-center text-base">
              Vyberte si brokera a začněte stavět své portfolio z top ETF fondů
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-blue-200 text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Začátečník?</h3>
                <p className="text-sm text-gray-600 mb-4">Trading 212 - nejjednoduší cesta k ETF</p>
                <Button asChild className="w-full">
                  <a href="/trading212-recenze">Začít investovat</a>
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-green-200 text-center">
                <Star className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">ETF expert?</h3>
                <p className="text-sm text-gray-600 mb-4">XTB - 3000+ ETF bez poplatků</p>
                <Button asChild className="w-full">
                  <a href="/xtb-recenze">Pokračovat s XTB</a>
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-yellow-200 text-center">
                <Shield className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Nejnižší náklady?</h3>
                <p className="text-sm text-gray-600 mb-4">DEGIRO - evropský líder</p>
                <Button asChild className="w-full">
                  <a href="/degiro-recenze">Ušetřit s DEGIRO</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Související stránky */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Srovnání ETF fondů",
              href: "/srovnani-etf",
              description: "Detailní databáze všech ETF"
            },
            {
              title: "Jak začít investovat", 
              href: "/co-jsou-etf/jak-zacit-investovat",
              description: "Kompletní průvodce pro začátečníky"
            },
            {
              title: "Nejlepší brokeři 2025",
              href: "/srovnani-brokeru", 
              description: "Kde koupit ETF nejlevněji"
            },
            {
              title: "Portfolio strategie",
              href: "/portfolio-strategie",
              description: "Jak sestavit ideální portfolio"
            }
          ]}
          title="Další užitečné články"
          className="mt-8"
        />
      </div>
    </Layout>
  );
}