

import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEO/SEOHead';
import StructuredData from '@/components/SEO/StructuredData';
import InternalLinking from '@/components/SEO/InternalLinking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Star , Flag, Shield, Users, Award, TrendingUp} from 'lucide-react';
import BrokerRatingGrid from '@/components/broker/BrokerRatingGrid';

export default function Trading212RecenzePage() {
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
        "name": "Trading 212 recenze 2025",
        "item": "https://etfpruvodce.cz/trading212-recenze"
      }
    ]
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "FinancialService",
      "name": "Trading 212",
      "description": "Online broker s komisí 0% pro akcie a ETF investice",
      "url": "https://www.trading212.com/",
      "serviceType": "Online brokerage",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "87",
        "bestRating": "100",
        "worstRating": "0",
        "reviewCount": "1"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "87",
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
    "reviewBody": "Trading 212 získává hodnocení 87/100 bodů za 0% poplatky za akcie a ETF, pokročilý AutoInvest systém a frakční obchodování. Ideální pro začátečníky i pokročilé investory hledající automatizované investování."
  };

  const pros = [
    "0% poplatky za akcie a ETF (bez omezení)",
    "Frakční obchodování od 25 Kč",
    "AutoInvest & Pies - pokročilá automatizace",
    "9000+ akcií a ETF z celého světa",
    "Úroky na neinvestované prostředky",
    "Bezplatné vklady a výběry",
    "Demo účet s 50 000 virtuální měny",
    "Regulace FCA (UK) a CySEC (Cyprus)"
  ];

  const cons = [
    "Bez českých akcií (nejsou na BCPP)",
    "Bez MetaTrader platformy",
    "Především anglická komunikace",
    "Bez telefonní podpory",
    "Poplatek za měnové konverze (0,15%)",
    "Omezené analytické nástroje",
    "Lending program (půjčování akcií)"
  ];

  return (
    <Layout>
      <SEOHead
        title="Trading 212 recenze 2025 - Bezpoplatkový broker s AutoInvest | ETF průvodce.cz"
        description="✅ Kompletní recenze Trading 212 2025. 0% poplatky za akcie i ETF, frakční obchodování, AutoInvest funkce. Ideální pro začátečníky."
        canonical="https://etfpruvodce.cz/trading212-recenze"
        keywords="Trading 212 recenze, Trading 212 broker, 0% poplatky, AutoInvest, frakční akcie, ETF bez poplatků"
        schema={reviewSchema}
        ogImage="https://etfpruvodce.cz/og-trading212-recenze.jpg"
      />
      <StructuredData data={breadcrumbSchema} />
      
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero sekce */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trading 212 recenze 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Kompletní recenze Trading 212 - britského brokera s 0% poplatky a pokročilým AutoInvest systémem. 
            Ideální pro začátečníky i pokročilé investory hledající automatizované investování.
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
              overallRating={87}
              overallDescription="Komplexní hodnocení brokera"
              categories={[
                { name: 'Poplatky', score: 95, description: '0% poplatky za akcie a ETF' },
                { name: 'Platforma', score: 90, description: 'Intuitivní mobilní aplikace' },
                { name: 'Nabídka', score: 83, description: '9000+ akcií a ETF' },
                { name: 'Podpora', score: 85, description: 'Převážně anglická komunikace' },
                { name: 'Důvěryhodnost', score: 90, description: 'FCA a CySEC regulace' },
                { name: 'Vzdělání', score: 85, description: 'Základní materiály a AutoInvest' }
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
                Výhody Trading 212
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
                Nevýhody Trading 212
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
              Klíčové informace o Trading 212
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Založení a regulace</h4>
                  <p className="text-sm text-gray-600">
                    Založeno v roce 2004 v Bulharsku. Pro české klienty Trading 212 Markets Ltd. 
                    regulované kyperskou CySEC (evropské klienty).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Velikost a dosah</h4>
                  <p className="text-sm text-gray-600">
                    Více než 2.5 milionu registrovaných uživatelů. 
                    Rychle rostoucí broker v Evropě.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Nabídka instrumentů</h4>
                  <p className="text-sm text-gray-600">
                    11 000+ akcií a 1400+ ETF z USA a EU burz. 
                    Zaměření na akcie a ETF.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ochrana klientů</h4>
                  <p className="text-sm text-gray-600">
                    Hotovost u německých bank (JP Morgan SE, Sparkasse) pojištěna do 100k €. 
                    Investice pojištěny kyperským ICF do 20k €.
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
              Struktura poplatků
            </CardTitle>
            <CardDescription>Jedny z nejnižších poplatků na trhu</CardDescription>
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
                    <td className="py-2">Akcie a ETF</td>
                    <td className="py-2">
                      <Badge className="bg-green-100 text-green-800">0%</Badge>
                    </td>
                    <td className="py-2 text-gray-600">Bez omezení objemu</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Měnová konverze</td>
                    <td className="py-2">0.15%</td>
                    <td className="py-2 text-gray-600">Víkendy 0.5%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Výběr prostředků</td>
                    <td className="py-2">
                      <Badge className="bg-green-100 text-green-800">0 EUR</Badge>
                    </td>
                    <td className="py-2 text-gray-600">Zdarma</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Poplatek za neaktivitu</td>
                    <td className="py-2">10 EUR/rok</td>
                    <td className="py-2 text-gray-600">Po 12 měsících bez aktivity</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Dividend handling</td>
                    <td className="py-2">
                      <Badge className="bg-green-100 text-green-800">0%</Badge>
                    </td>
                    <td className="py-2 text-gray-600">Bez poplatků</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Platforma a aplikace */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Platformy a aplikace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Mobilní aplikace</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Velmi intuitivní design
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Fractional shares (část akcie)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    AutoInvest funkce
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Rychlé obchodování
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Webová platforma</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Synchronizace s aplikací
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Základní charty
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Omezené analytické nástroje
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Žádné pokročilé obchodní typy
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AutoInvest funkce */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              AutoInvest - Automatické investování
            </CardTitle>
            <CardDescription>Jedinečná funkce pro pravidelné investování</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Jak funguje AutoInvest</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Nastavte si měsíční částku pro investování</li>
                  <li>• Vyberte ETF nebo akcie do portfolia</li>
                  <li>• Určete procentuální rozdělení</li>
                  <li>• Trading 212 automaticky nakupuje každý měsíc</li>
                  <li>• Možnost i fractional shares (části akcií)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Výhody AutoInvest</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Pravidelné investování (DCA)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Automatické rebalancování
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Žádné další poplatky
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Možnost úprav kdykoliv
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro koho je vhodný */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pro koho je Trading 212 vhodný?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✅ Vhodné pro</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Začátečníky v investování</li>
                  <li>• Investory hledající jednoduchost</li>
                  <li>• Ty, kdo preferují mobilní aplikace</li>
                  <li>• Buy-and-hold investory</li>
                  <li>• Pravidelné investory (DCA)</li>
                  <li>• Investory s menším kapitálem</li>
                  <li>• Ty, kdo chtějí 0% komise</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-red-600">❌ Nevhodné pro</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Pokročilé tradery a analýzy</li>
                  <li>• Aktivní day tradery</li>
                  <li>• Ty, kdo potřebují pokročilé obchodní typy</li>
                  <li>• Investory vyžadující detailní analytiku</li>
                  <li>• Ty, kdo se obávají lending programu</li>
                  <li>• Investory preferující desktop platformy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bezpečnostní upozornění */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Důležité bezpečnostní informace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Lending Program</h4>
                <p className="text-sm text-gray-700">
                  Trading 212 automaticky zapojuje vaše akcie do program půjčování třetím stranám. 
                  V krizích může být problém s dostupností akcií. Doporučujeme program vypnout 
                  v nastavení účtu.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Výpadky systému</h4>
                <p className="text-sm text-gray-700">
                  Občas dochází k výpadkům aplikace při extrémní volatilitě trhu. 
                  Mějte připravený backup plán pro urgentní obchody.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upozornění o lending programu */}
        <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Pozor na lending program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800">
              Trading 212 automaticky zapojuje vaše akcie do lending programu (půjčování). 
              To může být rizikem při krizích. Program lze vypnout, ale pozor na automatické zapojení 
              nových pozic.
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
              Trading 212 je výborná volba pro začátečníky a jednoduché investování díky 0% komisím 
              a intuitivní aplikaci. AutoInvest funkce je skvělá pro pravidelné investování do ETF. 
              Hlavními nevýhodami jsou omezené pokročilé funkce a lending program.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Pro začátečníky hledající jednoduché a levné řešení je Trading 212 jedna z nejlepších voleb. 
              Pokročilí investoři by měli zvážit DEGIRO či Interactive Brokers s lepšími analytickými nástroji.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <a 
                  href="https://www.trading212.com/" 
                  target="_blank" 
                  rel="nofollow noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Otevřít účet u Trading 212
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
              description: "Porovnání s dalším populárním brokerem"
            },
            {
              title: "XTB recenze",
              href: "/xtb-recenze",
              description: "Alternativa s pokročilejšími funkcemi"
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