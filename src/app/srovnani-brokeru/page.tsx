import React from 'react';
import { Metadata } from 'next';
import Script from 'next/script';
import Layout from '@/components/Layout';
import InternalLinking from '@/components/SEO/InternalLinking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Star, Crown , Flag, Shield, Users, Award, TrendingUp} from 'lucide-react';

const currentYear = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Nejlepší brokeři ${currentYear} - Kompletní srovnání ETF brokerů | ETF průvodce.cz`,
  description: `✅ Objektivní srovnání nejlepších brokerů pro ETF investice v ${currentYear}. Portu 98/100, XTB 94/100, Trading 212, DEGIRO a další. Poplatky, funkce, hodnocení.`,
  keywords: `nejlepší brokeři ${currentYear}, srovnání brokerů, ETF broker, XTB, DEGIRO, Trading 212, Interactive Brokers, Portu, Fio e-Broker`,
  authors: [{ name: 'ETF průvodce.cz' }],
  openGraph: {
    title: `Nejlepší brokeři ${currentYear} - Kompletní srovnání ETF brokerů`,
    description: `Objektivní srovnání nejlepších brokerů pro ETF investice v ${currentYear}. Portu 98/100, XTB 94/100 a další.`,
    url: 'https://www.etfpruvodce.cz/srovnani-brokeru',
    siteName: 'ETF průvodce.cz',
    images: [{
      url: 'https://www.etfpruvodce.cz/og-srovnani-brokeru.jpg',
      width: 1200,
      height: 630,
    }],
    locale: 'cs_CZ',
    type: 'website',
    publishedTime: `${currentYear}-01-01`,
    modifiedTime: new Date().toISOString(),
  },
  twitter: {
    card: 'summary_large_image',
    title: `Nejlepší brokeři ${currentYear}`,
    description: `Objektivní srovnání nejlepších brokerů pro ETF investice v ${currentYear}.`,
    images: ['https://www.etfpruvodce.cz/og-srovnani-brokeru.jpg'],
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/srovnani-brokeru',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  other: {
    'article:author': 'ETF průvodce.cz',
    'article:published_time': `${currentYear}-01-01`,
    'article:modified_time': new Date().toISOString(),
  }
};

export default function SrovnaniBrokeruPage() {
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
        "name": "Nejlepší brokeři 2025",
        "item": "https://www.etfpruvodce.cz/srovnani-brokeru"
      }
    ]
  };

  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Nejlepší brokeři 2025 - Kompletní srovnání",
    "description": "Objektivní srovnání nejlepších brokerů pro ETF investice v roce 2025. XTB 4.7/5, DEGIRO, Interactive Brokers, Trading 212 a další.",
    "url": "https://www.etfpruvodce.cz/srovnani-brokeru",
    "breadcrumb": breadcrumbSchema,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Nejlepší brokeři 2025",
      "numberOfItems": "5",
      "itemListElement": [
        {
          "@type": "FinancialService",
          "position": 1,
          "name": "DEGIRO",
          "url": "https://www.etfpruvodce.cz/degiro-recenze"
        },
        {
          "@type": "FinancialService", 
          "position": 2,
          "name": "XTB",
          "url": "https://www.etfpruvodce.cz/xtb-recenze"
        },
        {
          "@type": "FinancialService",
          "position": 3,
          "name": "Trading 212",
          "url": "https://www.etfpruvodce.cz/trading212-recenze"
        }
      ]
    }
  };

  const brokers = [
    {
      name: "DEGIRO",
      rating: 4.6,
      badge: "🏆 Nejlepší celkově",
      badgeColor: "bg-yellow-100 text-yellow-800",
      pros: ["Nejnižší poplatky", "Největší výběr ETF", "Regulace EU", "Pokročilé funkce"],
      cons: ["Složitější pro začátečníky", "Poplatky za spojení burz"],
      bestFor: "Zkušení investoři, velké portfolio",
      etfFee: "2 EUR/rok za ETF",
      link: "/degiro-recenze",
      color: "border-yellow-300 bg-yellow-50"
    },
    {
      name: "XTB",
      rating: 4.7,
      badge: "🏆 Nejlepší pro české investory",
      badgeColor: "bg-green-100 text-green-800",
      pros: ["Investování bez komisí", "7000+ akcií, 1600+ ETF", "Česká podpora 24/7", "Transparentní broker"],
      cons: ["Bez opcí/futures", "Vysoké zdanění CZ akcií", "Složitější pro nováčky"],
      bestFor: "ETF investoři, začátečníci s českou podporou",
      etfFee: "0 EUR",
      link: "/xtb-recenze",
      color: "border-green-300 bg-green-50"
    },
    {
      name: "Trading 212",
      rating: 4.3,
      badge: "👶 Nejlepší pro začátečníky",
      badgeColor: "bg-blue-100 text-blue-800",
      pros: ["0% komise", "Velmi jednoduché", "AutoInvest", "Fractional shares"],
      cons: ["Lending program", "Omezené analýzy", "Výpadky systému"],
      bestFor: "Začátečníci, mobilní investování",
      etfFee: "0 EUR",
      link: "/trading212-recenze",
      color: "border-blue-300 bg-blue-50"
    },
    {
      name: "Interactive Brokers",
      rating: 4.2,
      badge: "🔬 Pro pokročilé",
      badgeColor: "bg-purple-100 text-purple-800",
      pros: ["Nejširší nabídka", "Nejnižší poplatky (velké obj.)", "150+ trhů", "Profesionální nástroje"],
      cons: ["Velmi složité", "Vysoký min. vklad", "Poplatky za data"],
      bestFor: "Profíci, vysoký kapitál",
      etfFee: "0.05% (min. 1.25 EUR)",
      link: "/interactive-brokers-recenze",
      color: "border-purple-300 bg-purple-50"
    },
    {
      name: "Fio e-Broker",
      rating: 3.8,
      badge: "🇨🇿 Český broker",
      badgeColor: "bg-red-100 text-red-800",
      pros: ["Regulace ČNB", "Český jazyk", "Jednoduché daně", "Domácí podpora"],
      cons: ["Velmi omezená nabídka ETF", "Vysoké poplatky", "Starší platforma"],
      bestFor: "České akcie, konzervativní investoři",
      etfFee: "0.25% (min. 10 EUR)",
      link: "/fio-ebroker-recenze",
      color: "border-red-300 bg-red-50"
    }
  ];

  return (
    <Layout>
      <Script
        id="broker-comparison-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(comparisonSchema),
        }}
      />
      <Script
        id="broker-comparison-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero sekce */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            🏆 Aktualizováno pro rok 2025
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Nejlepší brokeři 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Objektivní srovnání top brokerů pro ETF investice. Detailní analýza poplatků, 
            funkcí a vhodnosti pro různé typy investorů. Najděte svého ideálního brokera.
          </p>
        </div>

        {/* Rychlé srovnání - tabulka */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-600" />
              Rychlé srovnání top brokerů
            </CardTitle>
            <CardDescription>Klíčové parametry na jeden pohled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-semibold">Broker</th>
                    <th className="text-left py-3 font-semibold">Hodnocení</th>
                    <th className="text-left py-3 font-semibold">ETF poplatek</th>
                    <th className="text-left py-3 font-semibold">Min. vklad</th>
                    <th className="text-left py-3 font-semibold">Nejlepší pro</th>
                    <th className="text-left py-3 font-semibold">Akce</th>
                  </tr>
                </thead>
                <tbody>
                  {brokers.map((broker, index) => (
                    <tr key={broker.name} className="border-b hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="font-semibold">{broker.name}</div>
                          <Badge className={broker.badgeColor}>{broker.badge}</Badge>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                          <span className="font-semibold">{broker.rating}/5</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={broker.etfFee === "0 EUR" ? "text-green-600 font-semibold" : ""}>
                          {broker.etfFee}
                        </span>
                      </td>
                      <td className="py-4">
                        {broker.name === "Interactive Brokers" ? "10 000 USD" : 
                         broker.name === "Fio e-Broker" ? "Žádný" : "Žádný"}
                      </td>
                      <td className="py-4 text-gray-600">{broker.bestFor}</td>
                      <td className="py-4">
                        <Button size="sm" variant="outline" asChild>
                          <a href={broker.link}>Recenze</a>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detailní srovnání brokerů */}
        <div className="grid lg:grid-cols-1 gap-8 mb-12">
          {brokers.map((broker, index) => (
            <Card key={broker.name} className={`${broker.color} border-2`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold">{index + 1}.</div>
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        {broker.name}
                        <Badge className={broker.badgeColor}>{broker.badge}</Badge>
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(broker.rating) ? 'text-yellow-600 fill-yellow-600' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-2 text-lg font-semibold">{broker.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild>
                    <a href={broker.link} className="flex items-center gap-2">
                      Detailní recenze
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Výhody
                    </h4>
                    <ul className="space-y-2">
                      {broker.pros.map((pro, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
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
                    <ul className="space-y-2">
                      {broker.cons.map((con, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="font-semibold">ETF poplatek:</span> 
                      <span className={`ml-2 ${broker.etfFee === "0 EUR" ? "text-green-600 font-semibold" : ""}`}>
                        {broker.etfFee}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Nejlepší pro:</span> 
                      <span className="ml-2 text-gray-600">{broker.bestFor}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Jak si vybrat brokera */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-blue-600" />
              Jak si vybrat správného brokera?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">👶 Začátečníci</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-800">1. Trading 212</div>
                    <p className="text-sm text-green-700">Nejjednodušší aplikace, 0% poplatky</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-800">2. XTB</div>
                    <p className="text-sm text-blue-700">Česká podpora, jednoduché ETF investování</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600">📊 Pokročilí</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="font-semibold text-yellow-800">1. DEGIRO</div>
                    <p className="text-sm text-yellow-700">Nejlepší poměr cena/funkce</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-800">2. XTB</div>
                    <p className="text-sm text-green-700">Skvělá platforma, velká nabídka ETF</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-purple-600">🏢 Profíci</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800">1. Interactive Brokers</div>
                    <p className="text-sm text-purple-700">Nejširší nabídka, nejlepší nástroje</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="font-semibold text-yellow-800">2. DEGIRO</div>
                    <p className="text-sm text-yellow-700">Výborné pokročilé funkce</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Srovnání podle kritérií */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Nejnižší poplatky
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="font-semibold">Trading 212</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">0% komise</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="font-semibold">XTB</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">0% ETF</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="font-semibold">DEGIRO</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">2 EUR/rok</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Nejlepší pro začátečníky
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="font-semibold">Trading 212</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Nejjednodušší</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="font-semibold">XTB</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Česká podpora</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="font-semibold">DEGIRO</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Více funkcí</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Často kladené otázky */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Často kladené otázky o výběru brokera
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Který broker je nejbezpečnější?</h4>
                  <p className="text-sm text-gray-600">
                    Všichni brokeři jsou regulováni v EU. Portu má licenci ČNB (98/100), XTB má licenci ČNB (94/100), 
                    DEGIRO je regulován BaFin/DNB (79/100), Trading 212 má CySEC licenci (87/100).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Mohu mít účty u více brokerů?</h4>
                  <p className="text-sm text-gray-600">
                    Ano, mnoho investorů kombinuje brokery. Například Portu pro automatizaci 
                    a XTB pro aktivní obchodování, nebo Trading 212 pro začátek a DEGIRO později.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Jak s daněmi v Česku?</h4>
                  <p className="text-sm text-gray-600">
                    České brokeři (Portu, Fio) mají automatické daňové vykazování. 
                    XTB a DEGIRO poskytují daňové přehledy. U všech zahraničních je potřeba hlásit zisky.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Kolik peněz potřebuji na start?</h4>
                  <p className="text-sm text-gray-600">
                    Portu má minimum 500 Kč, Trading 212 jen 1 EUR, XTB a DEGIRO 0 EUR. 
                    Interactive Brokers nevyžaduje minimální vklad. Doporučujeme začít s 1000+ EUR.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Který broker má nejlepší aplikaci?</h4>
                  <p className="text-sm text-gray-600">
                    Portu má nejjednodušší automatizovanou aplikaci. Trading 212 má nejpřívětivější 
                    rozhraní pro začátečníky. XTB má profesionální xStation 5.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Jak rychle mohu začít investovat?</h4>
                  <p className="text-sm text-gray-600">
                    České brokeři (Portu, Fio) mají nejrychlejší ověření. Trading 212 a XTB 
                    trvají 1-3 dny. DEGIRO a IBKR mohou trvat déle kvůli ověření.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doporučení podle profilu */}
        <Card className="mb-12 bg-gradient-to-r from-violet-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-purple-600" />
              Naše finální doporučení 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-yellow-200">
                <div className="text-center mb-4">
                  <Crown className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">🏆 CELKOVÝ VÍTĚZ</h3>
                  <div className="text-2xl font-bold text-yellow-600 mt-2">DEGIRO</div>
                </div>
                <p className="text-sm text-center text-gray-600 mb-4">
                  Nejlepší poměr cena/funkce pro zkušené investory
                </p>
                <Button asChild className="w-full">
                  <a href="/degiro-recenze">Přečíst recenzi</a>
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-green-200">
                <div className="text-center mb-4">
                  <Star className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">⭐ PRO ETF</h3>
                  <div className="text-2xl font-bold text-green-600 mt-2">XTB</div>
                </div>
                <p className="text-sm text-center text-gray-600 mb-4">
                  3000+ ETF bez poplatků + česká podpora
                </p>
                <Button asChild className="w-full">
                  <a href="/xtb-recenze">Přečíst recenzi</a>
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-blue-200">
                <div className="text-center mb-4">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">👶 ZAČÁTEČNÍCI</h3>
                  <div className="text-2xl font-bold text-blue-600 mt-2">Trading 212</div>
                </div>
                <p className="text-sm text-center text-gray-600 mb-4">
                  Nejjednodušší aplikace s 0% komisemi
                </p>
                <Button asChild className="w-full">
                  <a href="/trading212-recenze">Přečíst recenzi</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Související stránky */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Kde koupit ETF",
              href: "/kde-koupit-etf",
              description: "Kompletní průvodce výběrem brokera"
            },
            {
              title: "Srovnání ETF fondů",
              href: "/srovnani-etf",
              description: "Najděte nejlepší ETF pro investice"
            },
            {
              title: "Finanční kalkulačky",
              href: "/kalkulacky",
              description: "Nástroje pro plánování investic"
            },
            {
              title: "Návod pro začátečníky",
              href: "/co-jsou-etf/jak-zacit-investovat",
              description: "Jak začít s investováním do ETF"
            }
          ]}
          title="Související články"
          className="mt-8"
        />
      </div>
    </Layout>
  );
}