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
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Star, Users, Shield, TrendingUp, BookOpen, Target, DollarSign, PieChart, Lightbulb } from 'lucide-react';

export default function JakZacitInvestovatPage() {
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
        "name": "Jak začít investovat v roce 2025",
        "item": "https://etfpruvodce.cz/jak-zacit-investovat"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Kolik peněz potřebuji k začátku investování?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "K začátku investování postačuje již 50-100 EUR. Důležitější než vysoká částka je pravidelnost. Doporučujeme začít s částkou, kterou si můžete dovolit ztratit a postupně investice zvyšovat."
        }
      },
      {
        "@type": "Question", 
        "name": "Jak začít investovat bez rizika?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Investování bez rizika neexistuje, ale můžete riziko minimalizovat diverzifikací do širokých ETF fondů, pravidelným investováním (DCA) a dlouhodobým horizontem alespoň 5-10 let."
        }
      },
      {
        "@type": "Question",
        "name": "Který broker je nejlepší pro začátečníky?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "Pro začátečníky doporučujeme Trading 212 (nejjednodušší aplikace), XTB (výborné pro ETF) nebo DEGIRO (nejnižší poplatky). Všichni jsou regulovaní v EU."
        }
      }
    ]
  };

  const investmentTypes = [
    {
      name: "ETF fondy",
      risk: "Střední",
      returns: "7-10% ročně",
      description: "Diverzifikované fondy sledující indexy",
      pros: ["Nízké poplatky", "Automatická diverzifikace", "Likvidita"],
      cons: ["Tržní riziko", "Měnové riziko"],
      recommended: true,
      icon: "📊"
    },
    {
      name: "Jednotlivé akcie", 
      risk: "Vysoké",
      returns: "Variabilní",
      description: "Nákup akcií konkrétních společností",
      pros: ["Vysoký potenciál", "Kontrola nad výběrem"],
      cons: ["Vysoké riziko", "Potřeba analýzy"],
      recommended: false,
      icon: "📈"
    },
    {
      name: "Dluhopisy/Obligace",
      risk: "Nízké",
      returns: "2-5% ročně", 
      description: "Půjčky státům nebo firmám",
      pros: ["Stabilní výnosy", "Nízké riziko"],
      cons: ["Nízké výnosy", "Inflační riziko"],
      recommended: true,
      icon: "🏛️"
    },
    {
      name: "Kryptoměny",
      risk: "Velmi vysoké",
      returns: "Velmi variabilní",
      description: "Digitální měny jako Bitcoin",
      pros: ["Vysoký potenciál", "Inovace"],
      cons: ["Extrémní volatilita", "Regulační rizika"],
      recommended: false,
      icon: "₿"
    }
  ];

  const quickSteps = [
    {
      step: "1",
      title: "Vytvořte si emergency fond",
      description: "Mějte stranou 3-6 měsíčních výdajů než začnete investovat",
      time: "1-6 měsíců"
    },
    {
      step: "2", 
      title: "Vyberte si brokera",
      description: "Zaregistrujte se u spolehlivého EU brokera",
      time: "30 minut"
    },
    {
      step: "3",
      title: "Začněte s ETF",
      description: "Investujte do diverzifikovaných ETF fondů",
      time: "15 minut"
    },
    {
      step: "4",
      title: "Pravidelně investujte", 
      description: "Nastavte si automatické měsíční investice",
      time: "Průběžně"
    }
  ];

  return (
    <Layout>
      <SEOHead
        title="Jak začít investovat v roce 2025 - Kompletní průvodce | ETF průvodce.cz"
        description="✅ Jak začít investovat v roce 2025? Krok za krokem průvodce pro začátečníky. Výběr brokera, první investice, ETF fondy. Začněte již s 50 EUR!"
        canonical="https://etfpruvodce.cz/jak-zacit-investovat"
        keywords="jak začít investovat, investování pro začátečníky, první investice, ETF investice, začátek investování 2025"
        schema={faqSchema}
        ogImage="https://etfpruvodce.cz/og-jak-zacit-investovat.jpg"
      />
      <StructuredData data={breadcrumbSchema} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero sekce */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            🚀 Začněte investovat už dnes
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Jak začít investovat v roce 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Kompletní průvodce pro úplné začátečníky. Naučte se investovat bezpečně, 
            s minimálními poplatky a reálnými výnosy. Stačí vám 50 EUR a 30 minut času.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Čas čtení: 12 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Úroveň: Naprostý začátečník</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Start: Od 50 EUR</span>
            </div>
          </div>
        </div>

        {/* Rychlý přehled */}
        <Card className="mb-12 bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center text-2xl">
              <Lightbulb className="h-6 w-6 text-emerald-600" />
              Rychlý start - 4 kroky k první investici
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {quickSteps.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <Badge variant="outline" className="text-xs">{item.time}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Základní otázky */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Než začnete - odpovězte si na tyto otázky
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">✅ Jste připraveni začít?</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Máte emergency fond (3-6 měsíčních výdajů)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Nemáte vysokoúročné dluhy
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Můžete investovat alespoň 5+ let
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Rozumíte, že můžete ztratit peníze
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">❌ Ještě počkejte, pokud</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Peníze budete potřebovat do 2 let
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Investujete půjčené peníze
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Očekáváte rychlé zbohatnutí
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Nevydržíte vidět ztráty
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typy investic */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-6 w-6 text-purple-600" />
              Do čeho můžete investovat - srovnání
            </CardTitle>
            <CardDescription>Porovnání hlavních typů investic pro začátečníky</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {investmentTypes.map((type, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-xl border-2 ${
                    type.recommended 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{type.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold">{type.name}</h3>
                      {type.recommended && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Doporučeno</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Riziko</div>
                      <div className="font-semibold">{type.risk}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Očekávané výnosy</div>
                      <div className="font-semibold">{type.returns}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-green-600 mb-2">Výhody</h4>
                      <ul className="space-y-1">
                        {type.pros.map((pro, i) => (
                          <li key={i} className="text-xs text-gray-600">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-red-600 mb-2">Nevýhody</h4>
                      <ul className="space-y-1">
                        {type.cons.map((con, i) => (
                          <li key={i} className="text-xs text-gray-600">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Doporučení pro začátek */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-blue-600" />
              Naše doporučení pro začátek 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-lg font-bold mb-2">Kolik investovat</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Začněte s 50-200 EUR, pak měsíčně 100-500 EUR podle možností
                </p>
                <Badge className="bg-blue-100 text-blue-800">Min. 50 EUR</Badge>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-bold mb-2">Co kupovat</h3>
                <p className="text-sm text-gray-600 mb-4">
                  90% světové ETF (VWCE), 10% dluhopisy (AGGH) pro začátek
                </p>
                <Badge className="bg-green-100 text-green-800">ETF fondy</Badge>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-4">🏦</div>
                <h3 className="text-lg font-bold mb-2">Který broker</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Trading 212 (nejjednodušší) nebo XTB (česká podpora)
                </p>
                <Badge className="bg-purple-100 text-purple-800">EU regulace</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              Nejčastější otázky začátečníků
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Kolik peněz potřebuji k začátku?</h4>
                <p className="text-sm text-gray-600">
                  K začátku postačuje již 50-100 EUR. Důležitější než vysoká částka je pravidelnost. 
                  Doporučujeme začít s částkou, kterou si můžete dovolit ztratit a postupně investice zvyšovat.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Jak začít investovat bez rizika?</h4>
                <p className="text-sm text-gray-600">
                  Investování bez rizika neexistuje, ale můžete riziko minimalizovat diverzifikací do širokých 
                  ETF fondů, pravidelným investováním (DCA) a dlouhodobým horizontem alespoň 5-10 let.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Který broker je nejlepší pro začátečníky?</h4>
                <p className="text-sm text-gray-600">
                  Pro začátečníky doporučujeme Trading 212 (nejjednodušší aplikace), XTB (výborné pro ETF) 
                  nebo DEGIRO (nejnižší poplatky). Všichni jsou regulovaní v EU.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Kdy je nejlepší čas začít investovat?</h4>
                <p className="text-sm text-gray-600">
                  Nejlepší čas byl před 10 lety, druhý nejlepší čas je dnes. Nečekejte na &quot;správný&quot; 
                  okamžik - čas na trhu je důležitější než načasování trhu.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Co dělat při poklesu trhu?</h4>
                <p className="text-sm text-gray-600">
                  Poklesy jsou normální součást investování. Držte své pozice, neprodávejte v panice 
                  a ideálně nakupujte více při velkých poklesech (DCA strategie).
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Kolik můžu realisticky vydělat?</h4>
                <p className="text-sm text-gray-600">
                  Dlouhodobě můžete očekávat průměrné roční výnosy 7-10% u diverzifikovaných ETF. 
                  Někdy víc, někdy míň, ale čas vyrovnává krátkodobé výkyvy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA sekce */}
        <Card className="mb-12 bg-gradient-to-r from-emerald-50 to-green-50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Připraveni začít svou investiční cestu?</CardTitle>
            <CardDescription className="text-center text-base">
              Vyberte si vhodného brokera a proveďte svou první investici ještě dnes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-blue-200 text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Naprostý začátečník?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Trading 212 má nejjednodušší aplikaci a 0% poplatky
                </p>
                <Button asChild className="w-full">
                  <a href="/trading212-recenze">Začít s Trading 212</a>
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-green-200 text-center">
                <Star className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Zaměření na ETF?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  XTB nabízí 7000+ akcií, 1600+ ETF bez poplatků a českou podporu 24/7
                </p>
                <Button asChild className="w-full">
                  <a href="/xtb-recenze">Začít s XTB</a>
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-yellow-200 text-center">
                <Shield className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Nejnižší poplatky?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  DEGIRO je evropský lídr s minimálními poplatky
                </p>
                <Button asChild className="w-full">
                  <a href="/degiro-recenze">Začít s DEGIRO</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Související stránky */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Návod pro začátečníky",
              href: "/navod-pro-zacatecniky", 
              description: "Podrobný krok za krokem průvodce"
            },
            {
              title: "Srovnání brokerů 2025",
              href: "/srovnani-brokeru",
              description: "Najděte nejlepšího brokera pro začátek"
            },
            {
              title: "Co jsou ETF",
              href: "/co-jsou-etf",
              description: "Základy ETF investování jednoduše"
            },
            {
              title: "Investiční kalkulačky",
              href: "/kalkulacky",
              description: "Spočítejte si potenciální výnosy"
            }
          ]}
          title="Další užitečné články"
          className="mt-8"
        />
      </div>
    </Layout>
  );
}