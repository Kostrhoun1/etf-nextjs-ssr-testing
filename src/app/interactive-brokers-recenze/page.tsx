

import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEO/SEOHead';
import StructuredData from '@/components/SEO/StructuredData';
import InternalLinking from '@/components/SEO/InternalLinking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Users, TrendingUp, Shield } from 'lucide-react';
import BrokerRatingGrid from '@/components/broker/BrokerRatingGrid';

export default function InteractiveBrokersRecenzePage() {
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
        "name": "Kde koupit ETF",
        "item": "https://etfpruvodce.cz/kde-koupit-etf"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Interactive Brokers recenze 2025",
        "item": "https://etfpruvodce.cz/interactive-brokers-recenze"
      }
    ]
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "FinancialService",
      "name": "Interactive Brokers",
      "description": "Americký online broker pro profesionální a pokročilé investory",
      "url": "https://www.interactivebrokers.com/",
      "serviceType": "Online brokerage",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "85",
        "bestRating": "100",
        "worstRating": "0",
        "reviewCount": "1"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "85",
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
    "reviewBody": "Interactive Brokers získává hodnocení 85/100 bodů za rozsáhlý globální přístup k trhům a nízké obchodní náklady. Ideální pro profesionální a zkušené investory s kapitálem nad 20 000 USD."
  };

  const pros = [
    "Rozsahlý globální přístup k trhům (86 burz)",
    "Nízké obchodní náklady ($0.0005-0.0035/akcie)",
    "14 000+ akcií a ETF k obchodování",
    "Frakční obchodování s akciemi",
    "Žádný minimální vklad",
    "Žádné poplatky za neaktivitu",
    "Úroky z neinvestovaných prostředků",
    "Profesionální platformy (TWS, IBKR Desktop)"
  ];

  const cons = [
    "Komplexní rozhraní pro začátečníky",
    "Žádná podpora MetaTrader platformy",
    "Bez české jazykové podpory",
    "Vhodné především pro zkušené investory",
    "Složitější proces registrace",
    "Profesionální nástroje mohou působit zastrašující"
  ];

  return (
    <Layout>
      <SEOHead
        title="Interactive Brokers recenze 2025 - Profesionální broker | ETF průvodce.cz"
        description="✅ Detailní recenze Interactive Brokers 2025. Poplatky, výhody, nevýhody. Nejširší nabídka investičních instrumentů. Vhodné pro pokročilé investory."
        canonical="https://etfpruvodce.cz/interactive-brokers-recenze"
        keywords="Interactive Brokers recenze, IBKR broker, Interactive Brokers poplatky, profesionální broker"
        schema={reviewSchema}
        ogImage="https://etfpruvodce.cz/og-interactive-brokers-recenze.jpg"
      />
      <StructuredData data={breadcrumbSchema} />
      
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero sekce */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Interactive Brokers recenze 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Kompletni hodnocení Interactive Brokers - americké brokerské společnosti založené v 1978. 
            Více než 1,5 milionu účtů, kótovaná na Nasdaq. Ideální pro zkušené investory.
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
              overallRating={85}
              overallDescription="Komplexní hodnocení brokera"
              categories={[
                { name: 'Poplatky', score: 98, description: 'Nejnižší pro velké objemy' },
                { name: 'Platforma', score: 85, description: 'Pokročilé TWS, složité pro začátečníky' },
                { name: 'Nabídka', score: 100, description: '150+ milionů instrumentů' },
                { name: 'Podpora', score: 65, description: 'Pouze angličtina, složité' },
                { name: 'Důvěryhodnost', score: 100, description: 'SEC/FINRA regulace, kótován Nasdaq' },
                { name: 'Vzdělání', score: 75, description: 'Rozsáhlé, ale komplexní materiály' }
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
                Výhody IBKR
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
                Nevýhody IBKR
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
              Klíčové informace o Interactive Brokers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Založení a regulace</h4>
                  <p className="text-sm text-gray-600">
                    Založeno v roce 1978 v USA. Pro česká klienty Interactive Brokers Ireland Ltd. 
                    regulované irskou CBI (Central Bank of Ireland). Mateřská firma regulovaná SEC/FINRA v USA.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Velikost a dosah</h4>
                  <p className="text-sm text-gray-600">
                    Více než 1,5 milionu účtů, přes 400 miliard USD v aktivech klientů. 
                    Jeden z největších světových brokerů s přístupem na 150+ burz ve 33 zemích.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Nabídka instrumentů</h4>
                  <p className="text-sm text-gray-600">
                    Více než 150 milionů obchodovatelných instrumentů včetně akcií, ETF, opcí, 
                    futures, forex, dluhopisů a kommodit na 150+ trzích ve 33 zemích.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ochrana klientů</h4>
                  <p className="text-sm text-gray-600">
                    SIPC pojištění do 500 000 USD (hotovost 250 000 USD), dodatečné pojištění až 30 mil. USD. 
                    Segregované účty, kompenzační fond ICF do 20 000 EUR pro evropské klienty.
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
              <TrendingUp className="h-5 w-5 text-green-600" />
              Struktura poplatků (IBKR Pro)
            </CardTitle>
            <CardDescription>Poplatky se liší podle typu účtu a objemu obchodování</CardDescription>
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
                    <td className="py-2">USA akcie/ETF</td>
                    <td className="py-2">0.005 USD/akcie</td>
                    <td className="py-2 text-gray-600">Min. 1 USD, max. 1% hodnoty</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Evropské akcie/ETF</td>
                    <td className="py-2">0.05% hodnoty</td>
                    <td className="py-2 text-gray-600">Min. 1.25 EUR, max. 29 EUR</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Měnová konverze</td>
                    <td className="py-2">
                      <Badge className="bg-green-100 text-green-800">0.002%</Badge>
                    </td>
                    <td className="py-2 text-gray-600">Min. $2 za konverzi</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Minimální vklad</td>
                    <td className="py-2">
                      <Badge className="bg-green-100 text-green-800">0 USD</Badge>
                    </td>
                    <td className="py-2 text-gray-600">Zrušen od 2021</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Tržní data</td>
                    <td className="py-2">1-45 USD/měsíc</td>
                    <td className="py-2 text-gray-600">Podle typu dat</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Platformy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Obchodní platformy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Trader Workstation (TWS)</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Nejpokročilejší desktopová obchodní platforma
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Komplexní analýzy a nástroje
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Algoritmické obchodování
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Složitá pro začátečníky
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">IBKR Mobile & WebTrader</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Zjednodušená mobilní aplikace
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Webová verze bez stahování
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Základní funkce pro běžné obchodování
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Omezené možnosti oproti TWS
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kdo by měl zvážit IBKR */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pro koho je Interactive Brokers vhodný?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✅ Vhodné pro</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Pokročilé investory s kapitálem 20k+ USD</li>
                  <li>• Profesionální tradery a portfolio manažery</li>
                  <li>• Investory hledající nejširší nabídku instrumentů</li>
                  <li>• Ty, kdo potřebují přístup k mezinárodním trhům</li>
                  <li>• Aktivní obchodníky s velkými objemy</li>
                  <li>• Zkušené uživatele komplexních platforem</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-red-600">❌ Nevhodné pro</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Začátečníky v investování</li>
                  <li>• Investory s malým kapitálem (pod 5k USD)</li>
                  <li>• Ty, kdo preferují jednoduché rozhraní</li>
                  <li>• Neaktivní investory (buy-and-hold)</li>
                  <li>• Uživatele preferující český jazyk</li>
                  <li>• Investory pouze do ETF</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Upozornění pro začátečníky */}
        <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Vhodné pouze pro pokročilé investory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800">
              Interactive Brokers nabízí velmi široké možnosti obchodování a profesionální nástroje, 
              ale složitost platform je vhodná především pro zkušené a profesionální investory.
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
              Interactive Brokers je jedním z nejkomplexnějších a nejpokročilejších brokerů na světě. 
              Nabízí velmi nízké poplatky, nejširší výběr instrumentů (150+ milionů) a profesionální 
              nástroje. Je však určen především pro zkušené investory se znalostí angličtiny.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Pro začátečníky nebo investory s menším kapitálem doporučujeme začít s jednoduššími 
              alternativami jako XTB či DEGIRO. K IBKR můžete přejít později, když získáte zkušenosti 
              a vyšší kapitál (doporučujeme minimálně 20 000 USD).
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <a 
                  href="https://www.interactivebrokers.com/" 
                  target="_blank" 
                  rel="nofollow noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Otevřít účet u IBKR
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
              description: "Jednodušší alternativa pro začátečníky"
            },
            {
              title: "XTB recenze",
              href: "/xtb-recenze",
              description: "Další broker vhodný pro ETF investice"
            },
            {
              title: "Kde koupit ETF",
              href: "/kde-koupit-etf",
              description: "Porovnání všech brokerů pro ETF"
            },
            {
              title: "Návod pro začátečníky",
              href: "/co-jsou-etf/jak-zacit-investovat",
              description: "Začněte s investováním do ETF"
            }
          ]}
          title="Související články"
          className="mt-8"
        />
      </div>
    </Layout>
  );
}