
import React from 'react';
import { Metadata } from 'next';
import Script from 'next/script';
import Layout from '@/components/Layout';
import InternalLinking from '@/components/SEO/InternalLinking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Users, TrendingUp, Shield } from 'lucide-react';
import BrokerRatingGrid from '@/components/broker/BrokerRatingGrid';

const currentYear = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Fio e-Broker recenze ${currentYear} - Český broker s optimálním zdaněním | ETF průvodce.cz`,
  description: `✅ Fio e-Broker recenze ${currentYear} - hodnocení 75/100. Český broker s lokální podporou a optimálním zdaněním českých dividend (15%).`,
  keywords: `Fio e-Broker recenze, Fio broker, Fio e-Broker test, Fio hodnocení, český broker, 15% zdanění dividend`,
  authors: [{ name: 'ETF průvodce.cz' }],
  openGraph: {
    title: `Fio e-Broker recenze ${currentYear} - Český broker s optimálním zdaněním`,
    description: `Fio e-Broker recenze ${currentYear} - hodnocení 75/100. Český broker s lokální podporou.`,
    url: 'https://www.etfpruvodce.cz/fio-ebroker-recenze',
    siteName: 'ETF průvodce.cz',
    images: [{
      url: 'https://www.etfpruvodce.cz/og-fio-recenze.jpg',
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
    title: `Fio e-Broker recenze ${currentYear}`,
    description: `Fio e-Broker recenze ${currentYear} - hodnocení 75/100. Český broker s lokální podporou.`,
    images: ['https://www.etfpruvodce.cz/og-fio-recenze.jpg'],
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/fio-ebroker-recenze',
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

export default function FioEbrokerRecenzePage() {
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
        "name": "Fio e-Broker recenze 2025",
        "item": "https://www.etfpruvodce.cz/fio-ebroker-recenze"
      }
    ]
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "FinancialService",
      "name": "Fio e-Broker",
      "description": "Český online broker pro obchodování s ETF, akciemi a dluhopisy",
      "url": "https://www.fio.cz/e-broker",
      "serviceType": "Online brokerage",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "75",
        "bestRating": "100",
        "worstRating": "0",
        "reviewCount": "1"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "75",
      "bestRating": "100",
      "worstRating": "0"
    },
    "author": {
      "@type": "Organization",
      "name": "ETF Průvodce"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ETF Průvodce"
    },
    "datePublished": "2025-09-26",
    "dateModified": "2025-09-26",
    "reviewBody": "Fio e-Broker získává hodnocení 76/100 bodů jako český broker s výhodou domácí regulace ČNB a podpory v češtině. Nabízí základní investiční instrumenty s rozumnými poplatky, ale omezenou nabídkou ETF fondů."
  };

  const pros = [
    "Český broker s domácí regulací (CNB)",
    "Podpora v českém jazyce",
    "Rozumné poplatky na českém trhu",
    "Dostupnost českých dluhopisů", 
    "Správné zdanění CZ dividend (15%)",
    "Konverze měn zdarma",
    "Jednoduché daňové přiznání",
    "Tradiční bankovní instituce"
  ];

  const cons = [
    "Omezená nabídka ETF fondů",
    "Starší obchodní platforma",
    "Vysoké poplatky za zahraniční akcie",
    "Žádný přístup k USA trhům",
    "Omezené analytické nástroje",
    "Poplatky za správu účtu",
    "Nižší likvidita na českém trhu"
  ];

  return (
    <Layout>
      <Script
        id="fio-review-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewSchema),
        }}
      />
      <Script
        id="fio-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero sekce */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fio e-Broker recenze 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Komplexní hodnocení českého brokera Fio e-Broker. Výhody domácí regulace 
            a podpory, ale omezená nabídka ETF. Vhodný pro konzervativní české investory.
          </p>
        </div>



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
              overallRating={75}
              overallDescription="Komplexní hodnocení brokera"
              categories={[
                { name: 'Poplatky', score: 60, description: 'Vyšší než zahraniční konkurence' },
                { name: 'Platforma', score: 70, description: 'Starší design, ale funkční' },
                { name: 'Nabídka', score: 65, description: 'Omezené ETF, pouze EU trhy' },
                { name: 'Podpora', score: 85, description: 'Česká podpora, bankové zázemí' },
                { name: 'Důvěryhodnost', score: 90, description: 'ČNB regulace, tradiční banka' },
                { name: 'Vzdělání', score: 55, description: 'Základní materiály a návody' }
              ]}
            />
          </CardContent>
        </Card>

        {/* Rychlý přehled */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Výhody Fio e-Broker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pros.map((pro, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{pro}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                Nevýhody Fio e-Broker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cons.map((con, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm">{con}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Klíčové informace */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Klíčové informace o Fio e-Broker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Založení a regulace</h4>
                  <p className="text-sm text-gray-600">
                    Fio banka založena v roce 1993. Regulace Českou národní bankou (CNB), 
                    pojištění vkladů do 100 000 EUR.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Pozice na trhu</h4>
                  <p className="text-sm text-gray-600">
                    Jedna z největších českých bank. Významný hráč na českém 
                    retailovém bankovním trhu.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Nabídka instrumentů</h4>
                  <p className="text-sm text-gray-600">
                    Omezená nabídka ETF, české akcie (BCPP), evropské akcie, 
                    dluhopisy. Žádný přístup k USA trhům.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ochrana klientů</h4>
                  <p className="text-sm text-gray-600">
                    Pojištění vkladů do 100 000 EUR přes Fond pojištění vkladů. 
                    Regulace ČNB.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Poplatky */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Struktura poplatků
            </CardTitle>
            <CardDescription>Poplatky jsou vyšší než u zahraničních brokerů</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Typ transakce</th>
                    <th className="text-left py-2 font-semibold">Poplatek</th>
                    <th className="text-left py-2 font-semibold">Poznámka</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b">
                    <td className="py-2">České akcie/ETF (BCPP)</td>
                    <td className="py-2">0.35%</td>
                    <td className="py-2 text-gray-600">Min. 40 Kč (RM-S EasyClick 0.29%)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Evropské akcie/ETF</td>
                    <td className="py-2">
                      <Badge className="bg-orange-100 text-orange-800">0.79%</Badge>
                    </td>
                    <td className="py-2 text-gray-600">Min. 7,95 EUR</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Zahraniční akcie</td>
                    <td className="py-2">0.6%</td>
                    <td className="py-2 text-gray-600">Min. 10 EUR, max. 260 EUR</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Správa účtu</td>
                    <td className="py-2">79 CZK/měsíc</td>
                    <td className="py-2 text-gray-600">Při obratu pod 25 000 CZK</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Měnová konverze</td>
                    <td className="py-2">
                      <Badge className="bg-green-100 text-green-800">Zdarma</Badge>
                    </td>
                    <td className="py-2 text-gray-600">Kurz deviza střed Fio banky</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Nabídka ETF */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Omezená nabídka ETF
            </CardTitle>
            <CardDescription>Hlavní nevýhoda pro ETF investory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Dostupné trhy</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Burza cenných papírů Praha (BCPP)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Některé evropské burzy (omezené)
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Žádný přístup k USA trhům
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Velmi omezená nabídka ETF
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Doporučení</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Pro diverzifikované ETF portfolio doporučujeme kombinaci:
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>DEGIRO nebo XTB</strong> - pro ETF investice</li>
                  <li>• <strong>Fio e-Broker</strong> - pro české akcie a dluhopisy</li>
                  <li>• Rozdělení podle typu instrumentů</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platforma */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Obchodní platforma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Vlastní e-Broker platforma</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Plně v českém jazyce
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Jednoduché ovládání
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Základní analýzy a grafy
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Starší design a funkcionalita
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Mobilní aplikace</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    iOS a Android aplikace
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Základní obchodní funkce
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Omezené pokročilé funkce
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Starší uživatelský zážitek
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro koho je vhodný */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pro koho je Fio e-Broker vhodný?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✅ Vhodné pro</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Investory preferující český broker</li>
                  <li>• Ty, kdo chtějí českou podporu a jazyk</li>
                  <li>• Konzervativní investory (české akcie, dluhopisy)</li>
                  <li>• Investory s jednoduchou daňovou situací</li>
                  <li>• Ty, kdo obchodují českou korunu</li>
                  <li>• Klienty Fio banky (integrace služeb)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-red-600">❌ Nevhodné pro</h4>
                <ul className="space-y-2 text-sm">
                  <li>• ETF investory hledající diverzifikaci</li>
                  <li>• Ty, kdo chtějí přístup k USA trhům</li>
                  <li>• Investory hledající nízké poplatky</li>
                  <li>• Pokročilé tradery</li>
                  <li>• Ty, kdo preferují moderní platformy</li>
                  <li>• Aktivní obchodníky</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upozornění o omezenosti */}
        <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Omezená nabídka pro ETF investory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800">
              Fio e-Broker má velmi omezenou nabídku ETF fondů a neumožňuje přístup 
              k USA trhům. Pro diversifikované ETF investice doporučujeme zahraniční brokery 
              jako DEGIRO nebo XTB.
            </p>
          </CardContent>
        </Card>

        {/* Závěr */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle>Závěrečné hodnocení</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              Fio e-Broker je solidní český broker s výhodou domácí regulace a podpory v češtině. 
              Je vhodný pro konzervativní investory zaměřené na český trh, ale jeho hlavní nevýhodou 
              je velmi omezená nabídka ETF fondů.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Pro ETF investory doporučujeme kombinovat Fio e-Broker (české akcie, dluhopisy) 
              se zahraničním brokerem jako DEGIRO či XTB (pro ETF a zahraniční akcie). 
              Toto řešení poskytne nejlepší kombinaci přístupu k trhům a domácí podpory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <a 
                  href="https://www.fio.cz/e-broker" 
                  target="_blank" 
                  rel="nofollow noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Otevřít účet u Fio
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Související stránky */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Kde koupit ETF - přehled brokerů",
              href: "/kde-koupit-etf#porovnani",
              description: "Zpět na kompletní přehled a srovnání všech brokerů"
            },
            {
              title: "DEGIRO recenze",
              href: "/degiro-recenze",
              description: "Lepší volba pro ETF investice"
            },
            {
              title: "XTB recenze",
              href: "/xtb-recenze",
              description: "Další vhodná alternativa pro ETF"
            },
            {
              title: "Srovnání ETF fondů",
              href: "/srovnani-etf",
              description: "Najděte nejlepší ETF pro investice"
            }
          ]}
          title="Související články"
          className="mt-8"
        />
      </div>
    </Layout>
  );
}