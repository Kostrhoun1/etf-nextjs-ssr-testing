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
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Star, Users, Shield, TrendingUp, BookOpen, Target, DollarSign, Lightbulb, Calculator } from 'lucide-react';

export default function InvestovaniProZacatecnikyPage() {
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
        "name": "Investování pro začátečníky 2025",
        "item": "https://etfpruvodce.cz/investovani-pro-zacatecniky"
      }
    ]
  };

  const guideSchema = {
    "@context": "https://schema.org",
    "@type": "Guide",
    "name": "Investování pro začátečníky - Kompletní průvodce 2025",
    "description": "Naučte se investovat od základů. ETF fondy, brokeři, strategie a praktické tipy pro úplné začátečníky v investování.",
    "author": {
      "@type": "Organization",
      "name": "ETF Průvodce"
    },
    "datePublished": "2025-01-24"
  };

  const investmentBasics = [
    {
      concept: "Akcie",
      definition: "Podíl na vlastnictví firmy",
      example: "Kupujete kousek Applu nebo Microsoftu",
      riskLevel: "Střední-vysoké",
      icon: "📈"
    },
    {
      concept: "Dluhopisy", 
      definition: "Půjčka státu nebo firmě",
      example: "Půjčujete peníze státu za úrok",
      riskLevel: "Nízké",
      icon: "🏛️"
    },
    {
      concept: "ETF fondy",
      definition: "Koš stovek nebo tisíc akcií",
      example: "Jeden ETF = 500 nejlepších USA firem",
      riskLevel: "Střední",
      icon: "📊"
    },
    {
      concept: "Kryptoměny",
      definition: "Digitální měny",
      example: "Bitcoin, Ethereum",
      riskLevel: "Velmi vysoké", 
      icon: "₿"
    }
  ];

  const commonMistakes = [
    {
      mistake: "Začínám s jednotlivými akciemi",
      why: "Začátečníci často kupují akcie firem, které znají (Apple, Tesla)",
      solution: "Začněte s ETF - jsou automaticky diverzifikované a bezpečnější",
      severity: "Vysoké"
    },
    {
      mistake: "Investuji všechny peníze najednou",
      why: "Strach z růstu cen vede k investici vše hned",
      solution: "Používejte DCA - investujte měsíčně stejnou částku",
      severity: "Střední"
    },
    {
      mistake: "Sleduji grafy každý den",
      why: "Fascinace denními výkyvy a změnami portfolia",
      solution: "Kontrolujte portfolio max. 1x měsíčně, ignorujte krátkodobé výkyvy",
      severity: "Střední"
    },
    {
      mistake: "Kupuji co je \"levné\" nebo kleslo",
      why: "Zdá se logické kupovat co kleslo",
      solution: "Klesající akcie často klesají z dobrého důvodu. Držte se širokých ETF",
      severity: "Vysoké"
    },
    {
      mistake: "Nemám emergency fond",
      why: "Všechno volné peníze investuji",
      solution: "Nejdřív 3-6 měsíců výdajů stranou, pak teprve investujte",
      severity: "Kritické"
    }
  ];

  const ageBasedStrategy = [
    {
      age: "20-30 let",
      strategy: "Agresivní růst",
      allocation: "100% akcie (ETF)",
      reasoning: "Dlouhý investiční horizont umožňuje vysoké riziko",
      example: "100% VWCE",
      expectedReturn: "8-12% ročně"
    },
    {
      age: "30-40 let", 
      strategy: "Růstová s diverzifikací",
      allocation: "90% akcie, 10% dluhopisy",
      reasoning: "Stále dlouhý horizont, ale začíná opatrnost",
      example: "90% VWCE, 10% AGGH",
      expectedReturn: "7-10% ročně"
    },
    {
      age: "40-50 let",
      strategy: "Vyvážené portfolio",
      allocation: "70% akcie, 30% dluhopisy",
      reasoning: "Potřeba větší stability před důchodem",
      example: "70% VWCE, 30% AGGH",
      expectedReturn: "6-8% ročně"
    },
    {
      age: "50+ let",
      strategy: "Konzervativní přístup",
      allocation: "50% akcie, 50% dluhopisy",
      reasoning: "Blíží se důchod, potřeba zachovat kapitál",
      example: "50% VWCE, 50% AGGH",
      expectedReturn: "4-6% ročně"
    }
  ];

  return (
    <Layout>
      <SEOHead
        title="Investování pro začátečníky 2025 - Kompletní průvodce | ETF průvodce.cz"
        description="✅ Investování pro začátečníky od A-Z. Naučte se investovat do ETF, vybrat brokera, sestavit portfolio. Praktické tipy, strategie a časté chyby."
        canonical="https://etfpruvodce.cz/investovani-pro-zacatecniky"
        keywords="investování pro začátečníky, ETF pro začátečníky, jak investovat, první investice, investiční strategie"
        schema={guideSchema}
        ogImage="https://etfpruvodce.cz/og-investovani-pro-zacatecniky.jpg"
      />
      <StructuredData data={breadcrumbSchema} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero sekce */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            🎓 Kompletní vzdělávací kurz
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Investování pro začátečníky
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Naučte se investovat od úplných základů. Pochopíte co jsou akcie, ETF, dluhopisy, 
            jak vybrat brokera a sestavit si první portfolio. Bez zbytečné složitosti.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Čas studia: 20 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Úroveň: Úplný začátečník</span>
            </div>
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span>Praktické příklady</span>
            </div>
          </div>
        </div>

        {/* Základní pojmy */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Základní investiční pojmy jednoduše
            </CardTitle>
            <CardDescription>Začněme od úplných základů - co to vlastně je investování</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {investmentBasics.map((item, index) => (
                <div key={index} className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="font-bold">{item.concept}</h3>
                      <Badge 
                        className={
                          item.riskLevel === "Velmi vysoké" ? "bg-red-100 text-red-800" :
                          item.riskLevel === "Střední-vysoké" ? "bg-orange-100 text-orange-800" :
                          item.riskLevel === "Střední" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }
                      >
                        {item.riskLevel} riziko
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.definition}</p>
                  <p className="text-sm text-blue-600 font-medium">Příklad: {item.example}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">💡 Doporučení pro začátečníky</h4>
              <p className="text-sm text-green-700">
                Začněte s ETF fondy - kombinují bezpečnost (diverzifikace) s růstovým potenciálem 
                a jsou ideální pro začátečníky. Jednotlivé akcie a krypta nechte na později.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Proč investovat */}
        <Card className="mb-12 bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
              Proč vůbec investovat?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">🏦 Spořící účet</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Úrok: 2-3% ročně</li>
                  <li>• Inflace: 3-4% ročně</li>
                  <li>• <span className="text-red-600 font-semibold">Výsledek: -1% reálně</span></li>
                  <li>• Za 20 let: Ztráta kupní síly</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">📈 Investice do ETF</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Průměrný výnos: 7-10% ročně</li>
                  <li>• Inflace: 3-4% ročně</li>
                  <li>• <span className="text-green-600 font-semibold">Výsledek: +4-6% reálně</span></li>
                  <li>• Za 20 let: Trojnásobek původní částky</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-emerald-200">
              <h4 className="font-semibold mb-2">Příklad: 10 000 Kč měsíčně po 20 let</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold">Spořící účet (2%)</div>
                  <div className="text-red-600">2.6 mil. Kč</div>
                </div>
                <div>
                  <div className="font-semibold">ETF investice (8%)</div>
                  <div className="text-green-600">5.9 mil. Kč</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                *Investovali jste celkem 2.4 mil. Kč, rozdíl je 3.3 mil. Kč!
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategie podle věku */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              Investiční strategie podle věku
            </CardTitle>
            <CardDescription>Čím jste mladší, tím více si můžete dovolit riskovat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {ageBasedStrategy.map((strategy, index) => (
                <div key={index} className="p-6 border-2 border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{strategy.age}</h3>
                      <p className="text-gray-600">{strategy.strategy}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Očekávané výnosy</div>
                      <div className="font-semibold text-green-600">{strategy.expectedReturn}</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Alokace</div>
                      <div className="font-semibold">{strategy.allocation}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Konkrétní příklad</div>
                      <div className="font-semibold">{strategy.example}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Důvod</div>
                      <div className="text-sm">{strategy.reasoning}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Časté chyby začátečníků */}
        <Card className="mb-12 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-6 w-6" />
              5 nejčastějších chyb začátečníků (a jak se jim vyhnout)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {commonMistakes.map((mistake, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border-2 border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-red-800">❌ {mistake.mistake}</h4>
                    <Badge 
                      className={
                        mistake.severity === "Kritické" ? "bg-red-100 text-red-800" :
                        mistake.severity === "Vysoké" ? "bg-orange-100 text-orange-800" :
                        "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {mistake.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2"><strong>Proč se to děje:</strong> {mistake.why}</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <p className="text-sm text-green-700"><strong>Správné řešení:</strong> {mistake.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Praktický startovací plán */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Váš první investiční plán (krok za krokem)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                  Připravte si finance (měsíc 1)
                </h3>
                <ul className="space-y-2 text-sm ml-8">
                  <li>• Emergency fond: 3-6 měsíčních výdajů na spořící účet</li>
                  <li>• Spočítejte si měsíční přebytek po všech výdajích</li>
                  <li>• Rozhodněte kolik budete investovat (doporučuje 10-20% příjmů)</li>
                </ul>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                  Vyberte brokera (týden 1-2)
                </h3>
                <ul className="space-y-2 text-sm ml-8">
                  <li>• Pro začátečníky: Trading 212 (nejjednodušší)</li>
                  <li>• Pro ETF: XTB (nejlepší ETF nabídka)</li>
                  <li>• Pro nejnižší náklady: DEGIRO</li>
                </ul>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                  První investice (týden 3)
                </h3>
                <ul className="space-y-2 text-sm ml-8">
                  <li>• Kupte VWCE (Vanguard All-World ETF)</li>
                  <li>• Investujte pouze 50% připravené částky</li>
                  <li>• Zbytek nechte na další měsíc</li>
                </ul>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                  Pravidelné investování (od měsíce 2)
                </h3>
                <ul className="space-y-2 text-sm ml-8">
                  <li>• Nastavte si automatické měsíční investice</li>
                  <li>• Kupujte stejnou částku každý měsíc (DCA)</li>
                  <li>• Nekontrolujte portfolio častěji než 1x měsíčně</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kalkulátor příklad */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-green-600" />
              Příklad: Kolik můžete vydělat?
            </CardTitle>
            <CardDescription>Realistické výpočty pro různé měsíční investice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border-2 border-gray-200 rounded-xl text-center">
                <div className="text-2xl font-bold mb-2">1 000 Kč</div>
                <div className="text-sm text-gray-600 mb-4">měsíčně</div>
                <div className="space-y-2 text-sm">
                  <div><strong>Za 10 let:</strong> 185 000 Kč</div>
                  <div><strong>Za 20 let:</strong> 589 000 Kč</div>
                  <div><strong>Za 30 let:</strong> 1.4 mil. Kč</div>
                </div>
                <div className="mt-3 text-xs text-gray-600">Investováno celkem: 360 000 Kč</div>
              </div>
              
              <div className="p-6 border-2 border-green-300 bg-green-50 rounded-xl text-center">
                <div className="text-2xl font-bold mb-2">5 000 Kč</div>
                <div className="text-sm text-gray-600 mb-4">měsíčně</div>
                <div className="space-y-2 text-sm">
                  <div><strong>Za 10 let:</strong> 925 000 Kč</div>
                  <div><strong>Za 20 let:</strong> 2.9 mil. Kč</div>
                  <div><strong>Za 30 let:</strong> 7.1 mil. Kč</div>
                </div>
                <div className="mt-3 text-xs text-gray-600">Investováno celkem: 1.8 mil. Kč</div>
              </div>
              
              <div className="p-6 border-2 border-gray-200 rounded-xl text-center">
                <div className="text-2xl font-bold mb-2">10 000 Kč</div>
                <div className="text-sm text-gray-600 mb-4">měsíčně</div>
                <div className="space-y-2 text-sm">
                  <div><strong>Za 10 let:</strong> 1.85 mil. Kč</div>
                  <div><strong>Za 20 let:</strong> 5.9 mil. Kč</div>
                  <div><strong>Za 30 let:</strong> 14.2 mil. Kč</div>
                </div>
                <div className="mt-3 text-xs text-gray-600">Investováno celkem: 3.6 mil. Kč</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-800">
                <strong>Předpoklad:</strong> 8% průměrný roční výnos (historický průměr světových akcií). 
                Skutečné výnosy se můžou lišit.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA sekce */}
        <Card className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Připraveni začít investovat?</CardTitle>
            <CardDescription className="text-center text-base">
              Máte základy, teď je čas na praxi. Vyberte si cestu podle své situace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-blue-200 text-center">
                <Lightbulb className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Chci se více učit</h3>
                <p className="text-sm text-gray-600 mb-4">Detailní návod krok za krokem</p>
                <Button asChild className="w-full">
                  <a href="/navod-pro-zacatecniky">Kompletní návod</a>
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-green-200 text-center">
                <Target className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Chci rychle začít</h3>
                <p className="text-sm text-gray-600 mb-4">Praktický rychlý start</p>
                <Button asChild className="w-full">
                  <a href="/jak-zacit-investovat">Jak začít investovat</a>
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-purple-200 text-center">
                <Star className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Chci najít nejlepší ETF</h3>
                <p className="text-sm text-gray-600 mb-4">Top fondy pro rok 2025</p>
                <Button asChild className="w-full">
                  <a href="/nejlepsi-etf-2025">Nejlepší ETF 2025</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Související stránky */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Pasivní investování",
              href: "/pasivni-investovani",
              description: "Nejjednodušší investiční strategie"
            },
            {
              title: "Co jsou ETF",
              href: "/co-jsou-etf",
              description: "Základy ETF fondů jednoduše"
            },
            {
              title: "Srovnání brokerů 2025",
              href: "/srovnani-brokeru",
              description: "Najděte ideálního brokera"
            },
            {
              title: "Investiční kalkulačky",
              href: "/kalkulacky",
              description: "Spočítejte si výnosy a plánujte"
            }
          ]}
          title="Pokračujte ve studiu"
          className="mt-8"
        />
      </div>
    </Layout>
  );
}