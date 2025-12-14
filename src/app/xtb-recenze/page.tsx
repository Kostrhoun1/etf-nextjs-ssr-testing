import React from 'react';
import { Metadata } from 'next';
import Layout from '@/components/Layout';
import InternalLinking from '@/components/SEO/InternalLinking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckIcon, XIcon, AlertIcon, StarRating, ExternalLinkIcon } from '@/components/ui/icons';
import BrokerRatingGrid from '@/components/broker/BrokerRatingGrid';

const currentYear = new Date().getFullYear();

export const metadata: Metadata = {
  title: `XTB recenze ${currentYear} - Komplexní test a hodnocení brokera`,
  description: `✅ XTB recenze ${currentYear} - hodnocení 94/100. Transparentní broker s českou licencí ČNB, bezplatnými ETF obchody a 24/7 podporou.`,
  keywords: `XTB recenze, XTB broker, XTB test, XTB hodnocení, XTB poplatky, XTB ETF, online broker Česká republika, XTB česká licence`,
  authors: [{ name: 'ETF průvodce.cz' }],
  openGraph: {
    title: `XTB recenze ${currentYear} - Komplexní test a hodnocení brokera`,
    description: `XTB recenze ${currentYear} - hodnocení 94/100. Transparentní broker s českou licencí ČNB.`,
    url: 'https://www.etfpruvodce.cz/xtb-recenze',
    siteName: 'ETF průvodce.cz',
    images: [{
      url: 'https://www.etfpruvodce.cz/og-xtb-recenze.jpg',
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
    title: `XTB recenze ${currentYear}`,
    description: `XTB recenze ${currentYear} - hodnocení 94/100. Transparentní broker s českou licencí ČNB.`,
    images: ['https://www.etfpruvodce.cz/og-xtb-recenze.jpg'],
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/xtb-recenze',
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

export default function XTBRecenzePage() {
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
        "name": "XTB recenze 2025",
        "item": "https://www.etfpruvodce.cz/xtb-recenze"
      }
    ]
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "FinancialService",
      "name": "XTB",
      "description": "Online broker pro obchodování s ETF, akciemi a dalšími finančními instrumenty",
      "url": "https://www.xtb.com/cz",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Purkyňova 2121/3",
        "addressLocality": "Praha",
        "postalCode": "110 00",
        "addressCountry": "CZ"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "94",
        "bestRating": "100",
        "worstRating": "0",
        "reviewCount": "1"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "94",
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
    "reviewBody": "XTB je transparentní broker s českou licencí ČNB, kótovaný na varšavské burze. Nabízí bezplatné ETF obchody do 100k EUR měsíčně a 24/7 českou podporu. Hodnocení 94/100 bodů."
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
              src="/lovable-uploads/a7162820-5478-4cd8-9bfd-fd04b80a42ff.png" 
              alt="XTB logo" 
              className="w-20 h-20 object-contain"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                XTB recenze 2025
              </h1>
              <div className="flex items-center justify-center gap-2">
                <StarRating rating={5} size="lg" />
                <span className="text-lg font-semibold text-gray-700">94/100 bodů</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                XTB je vynikající volba pro české investory
              </h2>
              <p className="text-gray-600 text-lg">
                Veřejně obchodovaný polský broker s českou licencí ČNB, 1,7 miliony klientů a více než 11 400 instrumentů
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                  <CheckIcon className="mr-2" />
                  Hlavní výhody
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="flex-shrink-0" />
                    Investování do akcií a ETF bez komisí
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="flex-shrink-0" />
                    Přes 7 000 akcií a 1 600+ ETF
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="flex-shrink-0" />
                    Česká zákaznická podpora dostupná 24/7
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="flex-shrink-0" />
                    Moderní obchodní platforma xStation 5 zdarma
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="flex-shrink-0" />
                    Možnost XTB demo účtu s 200 000 Kč
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="flex-shrink-0" />
                    Frakční práva pro investice s malým kapitálem
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="flex-shrink-0" />
                    Rychlé vklady a výběry, většinou zdarma
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="flex-shrink-0" />
                    Transparentní broker kótovaný na varšavské burze
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="flex-shrink-0" />
                    Kvalitní vzdělávací sekce a webináře
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                  <AlertIcon className="mr-2" />
                  Na co si dát pozor
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <XIcon className="flex-shrink-0" />
                    Nenabízí obchodování opcí a futures kontraktů
                  </li>
                  <li className="flex items-center gap-2">
                    <XIcon className="flex-shrink-0" />
                    České akcie mají vysoké zdanění dividend (35 %)
                  </li>
                  <li className="flex items-center gap-2">
                    <XIcon className="flex-shrink-0" />
                    Platforma může být pro nováčky zpočátku nepřehledná
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
              overallRating={94}
              overallDescription="Komplexní hodnocení brokera"
              categories={[
                { name: 'Poplatky', score: 90, description: '0% až do 100k EUR měsíčně' },
                { name: 'Platforma', score: 95, description: 'xStation 5 je vynikající' },
                { name: 'Nabídka', score: 90, description: 'Široký výběr akcií a ETF' },
                { name: 'Podpora', score: 100, description: '24/7 česká podpora' },
                { name: 'Důvěryhodnost', score: 100, description: 'ČNB licence, kótován na burze' },
                { name: 'Vzdělání', score: 95, description: 'Kvalitní sekce a webináře' }
              ]}
            />
          </CardContent>
        </Card>

        {/* About XTB */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-blue-600">🌍</span>
              O společnosti XTB
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">Historie a pozadí</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    XTB (X-Trade Brokers) byla založena v roce 2002 v Polsku. Jedná se o veřejně 
                    obchodovanou společnost na Varšavské burze cenných papírů, což zajišťuje vysokou 
                    míru transparentnosti a finančního reportingu.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">Regulace a licence</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Pro české klienty má XTB licenci České národní banky, což je zásadní výhoda 
                    pro místní investory. Tato licence zajišťuje dodržování českých právních předpisů 
                    a regulací.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">Velikost a dosah</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    S více než 1,7 miliony klientů po celém světě patří XTB mezi největší evropské 
                    brokery. Společnost nabízí služby ve více než 13 zemích.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">Bezpečnost prostředků</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Jako veřejně obchodovaná společnost s licencí ČNB poskytuje XTB vysokou úroveň 
                    transparentnosti. Prostředky klientů jsou uloženy na segregovaných účtech 
                    u renomovaných bank.
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
              <span className="text-green-600">📱</span>
              Obchodní platforma xStation 5
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed">
                XTB nabízí proprietární platformu xStation 5, která je dostupná jako webová aplikace, 
                desktopová verze i mobilní aplikace pro iOS a Android. Platforma je známá svou 
                intuitivností a moderním designem.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Klíčové funkce</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Pokročilé charting nástroje
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Technická analýza (80+ indikátorů)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    One-click trading
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Kalkulátor pozic
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Ekonomický kalendář
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Dostupnost</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Webová verze (bez stahování)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Desktop verze (Windows, Mac)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Mobilní aplikace (iOS/Android)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Česká lokalizace
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Demo účet</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>200 000 Kč virtuálních prostředků</strong>
                  </p>
                  <p className="text-xs text-gray-600">
                    Perfektní pro vyzkoušení platformy a testování strategií bez rizika. 
                    Demo účet je dostupný zdarma a bez časového omezení.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruments & Markets */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-purple-600">📈</span>
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
                    <Badge variant="secondary">7 000+</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">🏛️ ETF</span>
                    <Badge variant="secondary">1 690</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">💱 Forex</span>
                    <Badge variant="secondary">69 párů</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">📊 Indexy</span>
                    <Badge variant="secondary">27</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">🥇 Komodity</span>
                    <Badge variant="secondary">27</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">₿ Kryptoměny</span>
                    <Badge variant="secondary">40</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-gray-900">Speciální funkce</h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium text-green-800">Frakční podíly</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Můžete investovat i do zlomků akcií - například koupit 0,1 akcie Apple 
                      místo celé akcie za tisíce korun.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium text-blue-800">Fyzické vs CFD</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      U akcií a ETF získáváte skutečné vlastnictví (ne CFD), což znamená 
                      práva akcionáře včetně dividend.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-medium text-purple-800">Globální trhy</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Přístup k akcím z USA, Evropy, Asie včetně hlavních burz jako NYSE, 
                      NASDAQ, LSE, Xetra a další.
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
              <span className="text-green-600">💰</span>
              Struktura poplatků
            </CardTitle>
            <CardDescription>
              Detailní přehled všech poplatků - transparentně a bez skrytých nákladů
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
                    <td className="py-3 px-4 font-medium">Akcie a ETF obchody</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 font-semibold">0 %</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Bez provize - spread-based pricing
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Bankovní převody</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 font-semibold">Zdarma</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      SEPA převody z banky zdarma
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Vklady kartou (CZK)</td>
                    <td className="py-3 px-4 text-amber-700 font-semibold">0,77 %</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Pouze při platbě kartou
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Vklady kartou (EUR)</td>
                    <td className="py-3 px-4 text-amber-700 font-semibold">0,70 %</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Pouze při platbě kartou
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Měnová konverze</td>
                    <td className="py-3 px-4 text-amber-700 font-semibold">0,5 %</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Spread nad tržním kurzem
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Výběry</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 font-semibold">Zdarma</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Bez poplatku při výběru
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
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Neaktivita</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 font-semibold">Zdarma</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      12 měsíců bez poplatku za neaktivitu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-800 mb-2">💡 Tip pro úsporu nákladů</h4>
              <p className="text-sm text-green-700">
                <strong>Vždy použijte bankovní převod namísto karty!</strong> SEPA převody z banky jsou zdarma, 
                zatímco poplatky za kartu jsou 0,77% (CZK) nebo 0,70% (EUR). Ušetříte tak stovky korun.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Taxation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-amber-600">🛡</span>
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
                
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                  <p className="text-xs text-amber-800">
                    <strong>Pozor:</strong> Vyšší zdanění českých dividend (35% vs standardních 15%) 
                    je nevýhoda tohoto brokera pro investory zaměřené na české akcie.
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
              <span className="text-blue-600">👥</span>
              Zákaznická podpora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📞</span>
                </div>
                <h4 className="font-semibold mb-2">Telefonní podpora</h4>
                <p className="text-sm text-gray-600 mb-2">24/7 dostupnost</p>
                <p className="text-xs text-gray-500">Česky mluvící operátoři</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💬</span>
                </div>
                <h4 className="font-semibold mb-2">Live chat</h4>
                <p className="text-sm text-gray-600 mb-2">Rychlá odpověď</p>
                <p className="text-xs text-gray-500">Přímo v platformě</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✉️</span>
                </div>
                <h4 className="font-semibold mb-2">Email podpora</h4>
                <p className="text-sm text-gray-600 mb-2">Odpověď do 24h</p>
                <p className="text-xs text-gray-500">Detailní řešení problémů</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Naše zkušenost:</strong> Česká zákaznická podpora dostupná 24/7 patří mezi nejlepší na trhu. 
                Operátoři jsou kompetentní a dokáží vyřešit i složitější dotazy. Rychlé vklady a výběry 
                jsou většinou zdarma, což oceníte především u bankovních převodů.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Final Verdict */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Závěrečné hodnocení</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold">
                <span>🏆</span>
                94/100 bodů - VYNIKAJÍCÍ
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-6 text-left max-w-4xl">
              <strong>XTB je jasně jedním z nejlepších brokerů pro české investory.</strong> Investování do akcií a ETF 
              bez komisí, transparentní broker kótovaný na varšavské burze, česká zákaznická podpora 24/7 
              a moderna platforma xStation 5 vytváří nabídku, kterou jen těžko někdo překoná.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6 text-left max-w-4xl">
              S více než 7 000 akcií a 1 600+ ETF nabízí dostatečnou diverzifikaci. Frakční práva umožňují 
              investování i s malým kapitálem. Demo účet s 200 000 Kč je perfektní pro vyzkoušení platformy, 
              kterou doplňuje kvalitní vzdělávací sekce s webináři.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-8 text-left max-w-4xl">
              Hlavními nevýhodami jsou chybějící opce a futures kontrakty, vysoké zdanění českých dividend (35%) 
              a platforma, která může být pro nováčky zpočátku nepřehledná. Pro většinu ETF investorů to však 
              nejsou zásadní problémy.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">🎯 Pro koho je XTB ideální?</h4>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• Investoři hledající bezpoplatkové obchodování s ETF a akciemi</li>
                <li>• Začátečníci ocenující českou podporu 24/7 a demo účet</li>
                <li>• Investoři s malým kapitálem díky frakčním právům</li>
                <li>• Ti, kdo chtějí transparentního brokera s kvalitním vzděláváním</li>
                <li>• Investoři vyhýbající se českým akciím (kvůli vyššímu zdanění)</li>
              </ul>
            </div>
            
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <a 
                href="https://www.xtb.com/cz" 
                target="_blank" 
                rel="nofollow noopener noreferrer"
                className="flex items-center gap-2"
              >
                Otevřít účet u XTB
                <ExternalLinkIcon />
              </a>
            </Button>
            
            <p className="text-xs text-gray-500 mt-3">
              * CFD jsou složité nástroje a nesou vysoké riziko rychlé ztráty peněz kvůli finanční páce.
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
              description: "Porovnejte XTB s dalšími populárními brokery"
            },
            {
              title: "DEGIRO recenze",
              href: "/degiro-recenze",
              description: "Alternativa s ještě nižšími poplatky"
            },
            {
              title: "Trading 212 recenze", 
              href: "/trading212-recenze",
              description: "Zcela bezpoplatkový broker z Bulharska"
            },
            {
              title: "Nejlepší ETF 2025",
              href: "/nejlepsi-etf/nejlepsi-etf-2025", 
              description: "Doporučené ETF pro investování přes XTB"
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
            },
            {
              title: "Investiční kalkulačka",
              href: "/kalkulacky/investicni-kalkulacka",
              description: "Spočítejte si budoucí hodnotu investic"
            },
            {
              title: "Backtest portfolia",
              href: "/kalkulacky/backtest-portfolia",
              description: "Otestujte historickou výkonnost portfolia"
            }
          ]}
          title="Související články a nástroje"
          className="mt-8"
        />
      </div>
    </Layout>
  );
}