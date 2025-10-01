'use client';

import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEO/SEOHead';
import BreadcrumbNav from '@/components/SEO/BreadcrumbNav';
import StructuredData from '@/components/SEO/StructuredData';
import InternalLinking from '@/components/SEO/InternalLinking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Star, Users, Shield, TrendingUp, Clock, Target, BarChart3, Zap } from 'lucide-react';

export default function PasivniInvestovaniPage() {
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
        "name": "Pasivní investování 2025",
        "item": "https://etfpruvodce.cz/pasivni-investovani"
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Pasivní investování - Kompletní průvodce 2025",
    "description": "Jak funguje pasivní investování, jeho výhody a nevýhody. Průvodce ETF investováním a sestavením pasivního portfolia.",
    "author": {
      "@type": "Organization",
      "name": "ETF Průvodce"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ETF Průvodce"
    },
    "datePublished": "2025-01-24",
    "dateModified": "2025-01-24"
  };

  const passiveVsActive = [
    {
      aspect: "Poplatky",
      passive: "0.1-0.3% ročně",
      active: "1-3% ročně",
      winner: "passive"
    },
    {
      aspect: "Čas investora",
      passive: "5 minut měsíčně",
      active: "Hodiny týdně",
      winner: "passive"
    },
    {
      aspect: "Výnosy",
      passive: "Tržní průměr",
      active: "Variabilní",
      winner: "passive"
    },
    {
      aspect: "Riziko",
      passive: "Tržní riziko",
      active: "Vyšší riziko",
      winner: "passive"
    },
    {
      aspect: "Stres",
      passive: "Minimální",
      active: "Vysoký",
      winner: "passive"
    },
    {
      aspect: "Kontrola",
      passive: "Žádná",
      active: "Plná",
      winner: "active"
    }
  ];

  const passiveStrategies = [
    {
      name: "Buy & Hold",
      description: "Kup a drž dlouhodobě",
      timeframe: "10+ let",
      difficulty: "Velmi jednoduché",
      example: "100% VWCE",
      pros: ["Nejjednodušší", "Nejnižší náklady", "Dlouhodobě nejúspěšnější"],
      cons: ["Žádné přizpůsobení", "Psychicky náročné při poklesech"]
    },
    {
      name: "Dollar Cost Averaging (DCA)",
      description: "Pravidelné investování stejné částky",
      timeframe: "Kontinuální",
      difficulty: "Jednoduché",
      example: "500 EUR měsíčně do VWCE",
      pros: ["Vyrovnává volatilitu", "Disciplína", "Automatizovatelné"],
      cons: ["Může být horší než lump sum", "Pomalejší růst"]
    },
    {
      name: "Core-Satellite",
      description: "Základ + malé aktivní pozice",
      timeframe: "5-10 let",
      difficulty: "Střední",
      example: "80% VWCE + 20% sektorové ETF",
      pros: ["Flexibilita", "Potenciál nadprůměru", "Kontrola"],
      cons: ["Složitější", "Vyšší náklady", "Časově náročnější"]
    },
    {
      name: "Asset Allocation",
      description: "Rozdělení podle tříd aktiv",
      timeframe: "Dlouhodobé",
      difficulty: "Střední",
      example: "60% akcie + 40% dluhopisy",
      pros: ["Lepší poměr riziko/výnos", "Menší volatilita"],
      cons: ["Potřeba rebalancování", "Nižší růstový potenciál"]
    }
  ];

  return (
    <Layout>
      <SEOHead
        title="Pasivní investování 2025 - Kompletní průvodce ETF | ETF průvodce.cz"
        description="✅ Pasivní investování 2025: Co to je, jak funguje, výhody vs aktivní investování. ETF strategie, buy & hold, DCA. Začněte s minimálními náklady!"
        canonical="https://etfpruvodce.cz/pasivni-investovani"
        keywords="pasivní investování, buy and hold, dollar cost averaging, ETF investování, pasivní strategie"
        schema={articleSchema}
        ogImage="https://etfpruvodce.cz/og-pasivni-investovani.jpg"
      />
      <StructuredData data={breadcrumbSchema} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero sekce */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            📈 Nejúspěšnější strategie
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Pasivní investování
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Nejjednodušší a nejúspěšnější způsob investování. Minimální čas, minimální náklady, 
            maximální dlouhodobé výnosy. Zjistěte, proč 95% aktivních fondů neporáží trh.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>5 minut měsíčně</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>7-10% ročně</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Minimální riziko</span>
            </div>
          </div>
        </div>

        {/* Co je pasivní investování */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Co je pasivní investování?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Pasivní investování je strategie, kdy investujete do široce diverzifikovaných 
                indexových fondů (ETF) a držíte je dlouhodobě. Místo snahy "porazit trh" 
                jednoduše kopírujete jeho výkonnost.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-semibold mb-2">Cíl</h3>
                  <p className="text-sm text-gray-600">
                    Dosáhnout tržních výnosů s minimálními náklady a rizikem
                  </p>
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <div className="text-3xl mb-3">⏱️</div>
                  <h3 className="font-semibold mb-2">Čas</h3>
                  <p className="text-sm text-gray-600">
                    Pouze několik minut měsíčně na kontrolu a případné dokupování
                  </p>
                </div>
                
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-semibold mb-2">Nástroje</h3>
                  <p className="text-sm text-gray-600">
                    Široké indexové ETF jako VWCE, IWDA, nebo S&P 500
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pasivní vs Aktivní */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-green-600" />
              Pasivní vs Aktivní investování
            </CardTitle>
            <CardDescription>Objektivní srovnání obou přístupů</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-semibold">Aspekt</th>
                    <th className="text-left py-3 font-semibold">Pasivní investování</th>
                    <th className="text-left py-3 font-semibold">Aktivní investování</th>
                    <th className="text-center py-3 font-semibold">Výhoda</th>
                  </tr>
                </thead>
                <tbody>
                  {passiveVsActive.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{item.aspect}</td>
                      <td className={`py-3 ${item.winner === 'passive' ? 'text-green-600 font-semibold' : ''}`}>
                        {item.passive}
                      </td>
                      <td className={`py-3 ${item.winner === 'active' ? 'text-green-600 font-semibold' : ''}`}>
                        {item.active}
                      </td>
                      <td className="py-3 text-center">
                        {item.winner === 'passive' ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Statistika:</strong> 95% aktivně řízených fondů neporáží trh po odečtení poplatků 
                za období 15 let. Pasivní investování vyhrává v dlouhodobém horizontu.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pasivní strategie */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-purple-600" />
              Hlavní pasivní strategie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {passiveStrategies.map((strategy, index) => (
                <div key={index} className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{strategy.name}</h3>
                      <p className="text-gray-600">{strategy.description}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-500">Časový horizont</div>
                      <div className="font-semibold">{strategy.timeframe}</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Obtížnost</div>
                      <Badge variant="outline" className="mt-1">{strategy.difficulty}</Badge>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Příklad</div>
                      <div className="font-semibold mt-1">{strategy.example}</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Výhody
                      </h4>
                      <ul className="space-y-1">
                        {strategy.pros.map((pro, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-red-600 flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Nevýhody
                      </h4>
                      <ul className="space-y-1">
                        {strategy.cons.map((con, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Praktický návod */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Jak začít s pasivním investováním - 4 kroky
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold mb-2">Vyberte si ETF</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Pro začátek stačí jeden široký světový ETF jako VWCE nebo IWDA. 
                    Obsahuje tisíce akcií z celého světa.
                  </p>
                  <Badge className="bg-green-100 text-green-800">Doporučeno: VWCE</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold mb-2">Zvolte brokera</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Vyberte brokera s nízkými poplatky pro ETF. Ideálně s 0% komisemi.
                  </p>
                  <div className="space-x-2">
                    <Badge variant="outline">XTB: 0€</Badge>
                    <Badge variant="outline">Trading 212: 0€</Badge>
                    <Badge variant="outline">DEGIRO: 2€/rok</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold mb-2">Nastavte pravidelné investice</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Investujte každý měsíc stejnou částku (DCA strategie). Minimálně 50-100 EUR.
                  </p>
                  <Badge className="bg-purple-100 text-purple-800">Automaticky každý měsíc</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold mb-2">Držte a nečtěte zprávy</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Nejdůležitější krok: Ignorujte krátkodobé výkyvy, neprodávejte při poklesech. 
                    Kontrolujte portfolio maximálně 1x měsíčně.
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-800">Trpělivost = klíč k úspěchu</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Psychologie pasivního investování */}
        <Card className="mb-12 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-6 w-6" />
              Psychologické výzvy pasivního investování
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. FOMO (Fear of Missing Out)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Vidíte, jak někdo vydělal 50% na Teslě, zatímco váš ETF "jen" +8%. 
                  Pamatujte: výjimečné zisky znamenají výjimečná rizika.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">2. Panika při poklesech</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Když trh klesne o 20%, vzniká nutkání vše prodat. Historicky ale každý 
                  pokles následoval ještě větší růst. Držte se plánu.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">3. Nuda a netrpělivost</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Pasivní investování je "nudné". Žádné vzrušení, žádné denní změny. 
                  Ale právě nuda je recepted na dlouhodobý úspěch.
                </p>
              </div>
              
              <div className="mt-6 p-4 bg-green-100 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Řešení: Automatizace</h4>
                <p className="text-sm text-green-700">
                  Nastavte si automatické měsíční investice a nekontrolujte portfolio příliš často. 
                  Čím méně se díváte na grafy, tím lepší jsou vaše výsledky.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Častá FAQ */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              Často kladené otázky
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Je pasivní investování pouze pro líné lidi?</h4>
                <p className="text-sm text-gray-600">
                  Ne, je to pro chytré lidi. Warren Buffett, nejúspěšnější investor historie, 
                  doporučuje 90% lidí investovat pasivně. Statistiky mu dávají za pravdu.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Co když zrovna začnu investovat před krizí?</h4>
                <p className="text-sm text-gray-600">
                  I nejhorší načasování se dlouhodobě vyplatí. Někdo kdo začal investovat 
                  těsně před krizí 2008, má dnes portfolio větší než někdo kdo čekal na "správný čas".
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Neměl bych alespoň trochu spekulovat?</h4>
                <p className="text-sm text-gray-600">
                  Pokud máte nutkání, vyhradťe si max. 5-10% portfolia na "hraní". 
                  Zbývajících 90% investujte pasivně. Většinou vás ta spekulativní část naučí držet se pasivity.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Jaké výnosy můžu realisticky očekávat?</h4>
                <p className="text-sm text-gray-600">
                  Historicky světové akcie rostly průměrně 7-10% ročně před inflací. 
                  Někdy +30%, někdy -30%, ale dlouhodobý trend je rostoucí.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA sekce */}
        <Card className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Začněte s pasivním investováním už dnes</CardTitle>
            <CardDescription className="text-center text-base">
              Jednoduchost, nízké náklady, dlouhodobý úspěch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-semibold">1 ETF</div>
                  <div className="text-sm text-gray-600">VWCE stačí na začátek</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-semibold">50 EUR</div>
                  <div className="text-sm text-gray-600">Minimální měsíční investice</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-2">⏱️</div>
                  <div className="font-semibold">5 minut</div>
                  <div className="text-sm text-gray-600">Měsíčně na údržbu</div>
                </div>
              </div>
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <a href="/jak-zacit-investovat">Začít s pasivním investováním</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Související stránky */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Jak začít investovat",
              href: "/jak-zacit-investovat",
              description: "Krok za krokem návod pro začátečníky"
            },
            {
              title: "Nejlepší ETF 2025",
              href: "/nejlepsi-etf-2025",
              description: "Top ETF fondy pro pasivní investování"
            },
            {
              title: "Srovnání brokerů",
              href: "/srovnani-brokeru",
              description: "Kde investovat s nejnižšími poplatky"
            },
            {
              title: "Co jsou ETF",
              href: "/co-jsou-etf",
              description: "Základy ETF investování"
            }
          ]}
          title="Další užitečné články"
          className="mt-8"
        />
      </div>
    </Layout>
  );
}