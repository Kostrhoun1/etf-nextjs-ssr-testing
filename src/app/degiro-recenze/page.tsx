import React from 'react';
import { Metadata } from 'next';
import Layout from '@/components/Layout';
import InternalLinking from '@/components/SEO/InternalLinking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Star, Smartphone, Globe, TrendingUp, Shield, Users, Award } from 'lucide-react';
import BrokerRatingGrid from '@/components/broker/BrokerRatingGrid';

const currentYear = new Date().getFullYear();

export const metadata: Metadata = {
  title: `DEGIRO recenze ${currentYear} - Komplexní test a hodnocení brokera`,
  description: `✅ DEGIRO recenze ${currentYear} - hodnocení 79/100. Součást flatexDEGIRO Bank AG s 3+ miliony klientů. Přístup na 31 světových burz, nízké poplatky.`,
  keywords: `DEGIRO recenze, DEGIRO broker, DEGIRO test, DEGIRO hodnocení, DEGIRO poplatky, DEGIRO ETF, online broker Česká republika`,
  authors: [{ name: 'ETF průvodce.cz' }],
  openGraph: {
    title: `DEGIRO recenze ${currentYear} - Komplexní test a hodnocení brokera`,
    description: `DEGIRO recenze ${currentYear} - hodnocení 79/100. Součást flatexDEGIRO Bank AG s 3+ miliony klientů.`,
    url: 'https://www.etfpruvodce.cz/degiro-recenze',
    siteName: 'ETF průvodce.cz',
    images: [{
      url: 'https://www.etfpruvodce.cz/og-image.jpg',
      width: 1200,
      height: 630,
    }],
    locale: 'cs_CZ',
    type: 'article',
    publishedTime: `${currentYear}-01-01`,
    modifiedTime: new Date().toISOString(),
  },
  twitter: {
    card: 'summary_large_image',
    title: `DEGIRO recenze ${currentYear}`,
    description: `DEGIRO recenze ${currentYear} - hodnocení 79/100. Součást flatexDEGIRO Bank AG.`,
    images: ['https://www.etfpruvodce.cz/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/degiro-recenze',
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

export default function DEGIRORecenzePage() {
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "FinancialService",
      "name": "DEGIRO",
      "description": "Online broker pro obchodování s ETF, akciemi a dalšími finančními instrumenty",
      "url": "https://www.degiro.cz",
      "serviceType": "Online brokerage",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rembrandt Tower, Amstelplein 1",
        "addressLocality": "Amsterdam",
        "postalCode": "1096 HA",
        "addressCountry": "NL"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "79",
        "bestRating": "100",
        "worstRating": "0",
        "reviewCount": "1"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "79",
      "bestRating": "100"
    },
    "author": {
      "@type": "Organization",
      "name": "ETF průvodce.cz"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ETF průvodce.cz"
    },
    "datePublished": "2025-09-26",
    "dateModified": "2025-09-26",
    "reviewBody": "DEGIRO je populární evropský online broker s nízkými poplatky a širokou nabídkou ETF fondů. Součást flatexDEGIRO Bank AG s více než 3 miliony klientů. Hodnocení 79/100 bodů."
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
        "name": "Kde koupit ETF",
        "item": "https://www.etfpruvodce.cz/kde-koupit-etf"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "DEGIRO recenze 2025",
        "item": "https://www.etfpruvodce.cz/degiro-recenze"
      }
    ]
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewSchema),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="/lovable-uploads/f9bacf3b-7b11-4c31-917d-e16803dc0887.png" 
              alt="DEGIRO logo" 
              className="w-20 h-20 object-contain"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                DEGIRO recenze 2025
              </h1>
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-700">79/100 bodů</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <Card className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                DEGIRO - součást flatexDEGIRO Bank AG
              </h2>
              <p className="text-gray-600 text-lg">
                Německo-nizozemský broker s více než 3 miliony klientů, přístupem na 31 světových burz a integrací do banky
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Hlavní výhody
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Dostupnost tisíců akcií, ETF, dluhopisů a derivátů
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Vysoká míra finanční bezpečnosti díky začlenění do banky
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Jednoduchá a intuitivní obchodní platforma WebTrader
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Možnost vkladů a výběrů v českých korunách
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Nulový minimální vklad
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Core Selection ETF za 0 EUR + 1 EUR manipulační poplatek
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Přístup na 31 světových burz
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Na co si dát pozor
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    Absence demo účtu
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    Zdanění českých dividend 35% sazbou
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    Chybí pokročilé obchodní nástroje
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    Nedostupnost CFD
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    Velmi omezené možnosti prodeje nakrátko
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Rating */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Detailní hodnocení</CardTitle>
            <CardDescription className="text-center">
              Náš verdikt založený na důkladné analýze všech aspektů brokera
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BrokerRatingGrid 
              overallRating={79}
              overallDescription="Komplexní hodnocení brokera"
              categories={[
                { name: 'Poplatky', score: 70, description: 'Nízké pro Core ETF' },
                { name: 'Platforma', score: 80, description: 'Funkční web i mobilní app' },
                { name: 'Nabídka', score: 85, description: 'Široký výběr UCITS ETF' },
                { name: 'Podpora', score: 80, description: 'Částečně česká podpora' },
                { name: 'Důvěryhodnost', score: 95, description: 'EU regulace, silná značka' },
                { name: 'Vzdělání', score: 80, description: 'Základní materiály a návody' }
              ]}
            />
          </CardContent>
        </Card>

        {/* About DEGIRO */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              O společnosti DEGIRO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">Historie a pozadí</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    DEGIRO byla založena v roce 2008, služby pro drobné investory poskytuje od roku 2013. 
                    Je součástí flatexDEGIRO Bank AG, což zajišťuje vysokou úroveň finanční bezpečnosti 
                    díky začlenění do bankovní struktury.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">Regulace a licence</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Regulováno v Německu a Nizozemsku pod dohledem BaFin, DNB a AFM. Jako součást banky 
                    podléhá přísnějším regulatorním požadavkům než samostatní brokeři.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">Velikost a dosah</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    S více než 3 miliony klientů patří mezi největší evropské brokery. 
                    Poskytuje přístup na 31 světových burz v Evropě, Severní Americe a Asii.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">Bezpečnost prostředků</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Jako součást flatexDEGIRO Bank AG poskytuje vyšší úroveň ochrany než běžní brokeři. 
                    Prostředky klientů jsou plně segregovány a chráněny evropskými garančními schématy.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Platform */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-green-600" />
              Obchodní platforma WebTrader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed">
                DEGIRO nabízí proprietární platformu WebTrader dostupnou jako webová aplikace 
                i mobilní aplikace. Platforma je známá svou jednoduchostí a intuitivním ovládáním, 
                vhodným především pro začátečníky a střední investory.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Klíčové funkce</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Jednoduchá a přehledná
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Základní charting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Portfolio přehled
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Watchlist
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    Omezené analytické nástroje
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Dostupnost</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Webová verze
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Mobilní aplikace (iOS/Android)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Částečná česká lokalizace
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Bez demo účtu
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Omezení</h4>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-800 mb-2">
                    <strong>Chybějící pokročilé funkce:</strong>
                  </p>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>• Pokročilé obchodní nástroje</li>
                    <li>• Demo účet pro testování</li>
                    <li>• CFD obchodování</li>
                    <li>• Algoritmické obchodování</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruments & Markets */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              Nabídka instrumentů
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 text-gray-900">Dostupné instrumenty</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">📈 Akcie</span>
                    <Badge variant="secondary">Desetitisíce</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">🏛️ ETF</span>
                    <Badge variant="secondary">Tisíce</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">🏦 Dluhopisy</span>
                    <Badge variant="secondary">Dostupné</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">📊 Deriváty</span>
                    <Badge variant="secondary">Opce, warranty</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="font-medium">❌ CFD</span>
                    <Badge variant="destructive">Nedostupné</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-gray-900">Trhy a burzy</h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium text-blue-800">31 světových burz</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Evropa, Severní Amerika, Asie včetně NYSE, NASDAQ, LSE, Xetra, 
                      Euronext, Burza cenných papírů Praha a další.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium text-green-800">České koruny</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Možnost vkladů a výběrů přímo v českých korunách, 
                      což usnadňuje správu účtu pro české investory.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h5 className="font-medium text-orange-800">Omezení prodeje nakrátko</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Velmi omezené možnosti prodeje nakrátko, což může být 
                      nevýhodou pro pokročilé obchodníky.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fees Structure */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Struktura poplatků
            </CardTitle>
            <CardDescription>
              Detailní přehled všech poplatků podle aktuálních sazeb
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Typ transakce</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Poplatek</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Poznámka</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Vklady/výběry</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 font-semibold">Zdarma</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Bankovní převody
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Americké akcie</td>
                    <td className="py-3 px-4 text-orange-700 font-semibold">2 EUR</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Poplatek za transakci
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">České akcie</td>
                    <td className="py-3 px-4 text-orange-700 font-semibold">40 CZK</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Poplatek za transakci
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Evropské akcie</td>
                    <td className="py-3 px-4 text-orange-700 font-semibold">4,90 EUR</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Poplatek za transakci
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="py-3 px-4 font-medium">ETF Core Selection</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 font-semibold">0 EUR + 1 EUR manipulační</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      200+ vybraných ETF zdarma
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">ETF ostatní</td>
                    <td className="py-3 px-4 text-orange-700 font-semibold">3 EUR + manipulační</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Podle burzy a ETF
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Konverze měn</td>
                    <td className="py-3 px-4 text-amber-700 font-semibold">0,25%</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Při směně měn
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Real-time data</td>
                    <td className="py-3 px-4 text-amber-700 font-semibold">5-10 EUR/měs.</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Podle burzy
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Minimální vklad</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 font-semibold">0 EUR</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Žádný povinný minimální vklad
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Tip pro úsporu nákladů</h4>
              <p className="text-sm text-blue-700">
                <strong>Vybírejte ETF z Core Selection</strong> (200+ fondů) - platíte pouze 1 EUR manipulační poplatek, 
                žádné transakční poplatky! Využívejte také vklady a výběry v českých korunách zdarma 
                a konverzi měn provádějte v co největších objemech.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Taxation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-600" />
              Zdanění pro české investory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Zdanění dividend</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm">🇨🇿 České akcie</span>
                    <Badge variant="destructive">35 %</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm">🇺🇸 Americké akcie</span>
                    <Badge className="bg-green-600">15 %</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm">🇪🇺 EU akcie</span>
                    <Badge className="bg-yellow-600">Různě</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Kapitálové zisky</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Kapitálové zisky z prodeje akcií a ETF podléhají české daňové povinnosti. 
                    Akcie držené déle než 3 roky jsou osvobozené od daně z kapitálových zisků 
                    (test času).
                  </p>
                </div>
                
                <div className="mt-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <p className="text-xs text-red-800">
                    <strong>Pozor:</strong> Vysoké zdanění českých dividend (35% místo standardních 15%) 
                    je výrazná nevýhoda pro investory zaměřené na české akcie.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Support */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Zákaznická podpora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📞</span>
                </div>
                <h4 className="font-semibold mb-2">Telefonní podpora</h4>
                <p className="text-sm text-gray-600 mb-2">Pracovní dny</p>
                <p className="text-xs text-gray-500">Částečně česky</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✉️</span>
                </div>
                <h4 className="font-semibold mb-2">Email podpora</h4>
                <p className="text-sm text-gray-600 mb-2">Odpověď do 24h</p>
                <p className="text-xs text-gray-500">Vícejazyčná</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📚</span>
                </div>
                <h4 className="font-semibold mb-2">Vzdělávací materiály</h4>
                <p className="text-sm text-gray-600 mb-2">Základní návody</p>
                <p className="text-xs text-gray-500">Online centrum</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Naše zkušenost:</strong> Zákaznická podpora je na solidní úrovni, 
                ale neposkytuje tak rozsáhlé služby jako specializovaní brokeři. 
                Částečná česká lokalizace usnadňuje základní orientaci.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Final Verdict */}
        <Card className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Závěrečné hodnocení</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-6 py-3 rounded-full text-lg font-semibold">
                <Award className="w-6 h-6" />
                79/100 bodů - DOBRÁ
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-6 text-left max-w-4xl">
              <strong>DEGIRO je solidní volbou pro investory hledající jednoduchost a bezpečnost.</strong> 
              Jako součást flatexDEGIRO Bank AG poskytuje vyšší úroveň finanční bezpečnosti než běžní brokeři. 
              Přístup na 31 světových burz a možnost vkladů v českých korunách jsou významné výhody.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6 text-left max-w-4xl">
              Jednoduchost WebTrader platformy ocení především začátečníci, ale pokročilí investoři 
              mohou postrádat analytické nástroje. Tisíce dostupných ETF a akcií pokryjí potřeby 
              většiny dlouhodobých investorů.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-8 text-left max-w-4xl">
              Hlavními nevýhodami jsou absence demo účtu, vysoké zdanění českých dividend (35%) 
              a chybějící pokročilé obchodní funkce jako CFD či algoritmické obchodování.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">🎯 Pro koho je DEGIRO ideální?</h4>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• Začátečníci hledající jednoduchou a bezpečnou platformu</li>
                <li>• Investoři do zahraničních akcií a ETF</li>
                <li>• Ti, kdo preferují součást banky před samostatným brokerem</li>
                <li>• Investoři využívající vklady v českých korunách</li>
                <li>• Dlouhodobí investoři nevyžadující pokročilé nástroje</li>
              </ul>
            </div>
            
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <a 
                href="https://www.degiro.cz" 
                target="_blank" 
                rel="nofollow noopener noreferrer"
                className="flex items-center gap-2"
              >
                Otevřít účet u DEGIRO
                <ExternalLink className="w-5 h-5" />
              </a>
            </Button>
            
            <p className="text-xs text-gray-500 mt-3">
              * Investování je spojeno s rizikem. Hodnota vašich investic může klesnout i vzrůst.
            </p>
          </CardContent>
        </Card>

        {/* Related Links */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Kde koupit ETF - přehled brokerů",
              href: "/kde-koupit-etf#porovnani",
              description: "Zpět na kompletní přehled a srovnání všech brokerů"
            },
            {
              title: "Srovnání brokerů 2025",
              href: "/srovnani-brokeru",
              description: "Porovnejte DEGIRO s dalšími populárními brokery"
            },
            {
              title: "XTB recenze",
              href: "/xtb-recenze",
              description: "Alternativa s vyšším hodnocením a 24/7 podporou"
            },
            {
              title: "Trading 212 recenze", 
              href: "/trading212-recenze",
              description: "Zcela bezpoplatkový broker pro začátečníky"
            },
            {
              title: "Nejlepší ETF 2025",
              href: "/nejlepsi-etf/nejlepsi-etf-2025", 
              description: "Doporučené ETF pro investování přes DEGIRO"
            },
            {
              title: "Jak začít investovat",
              href: "/co-jsou-etf/jak-zacit-investovat",
              description: "Kompletní průvodce pro začátečníky"
            },
            {
              title: "Portfolio strategie",
              href: "/portfolio-strategie",
              description: "Vytvořte si optimální investiční portfolio"
            }
          ]}
          title="Související články a nástroje"
          className="mt-8"
        />
      </div>
    </Layout>
  );
}