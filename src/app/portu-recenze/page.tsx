

import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEO/SEOHead';
import StructuredData from '@/components/SEO/StructuredData';
import InternalLinking from '@/components/SEO/InternalLinking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Star, Smartphone, Users, TrendingUp, Globe } from 'lucide-react';
import BrokerRatingGrid from '@/components/broker/BrokerRatingGrid';

export default function PortuRecenzePage() {
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
        "name": "Portu recenze 2025",
        "item": "https://etfpruvodce.cz/portu-recenze"
      }
    ]
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "FinancialService",
      "name": "Portu",
      "description": "Česká automatizovaná investiční platforma založená v roce 2017",
      "url": "https://www.portu.cz/",
      "serviceType": "Robo-advisor",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "98",
        "bestRating": "100",
        "worstRating": "0",
        "reviewCount": "734"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "98",
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
    "datePublished": "2025-01-01",
    "dateModified": "2025-01-24",
    "reviewBody": "Portu získává hodnocení 98/100 bodů jako česká automatizovaná investiční platforma ideální pro začátečníky a pasivní investory. Nabízí uživatelsky přívětivé rozhraní s automatickou správou portfolia a nízkými poplatky od 0,47% ročně."
  };

  const pros = [
    "Velmi uživatelský přístup pro začátečníky",
    "Nízké poplatky (0,47-1% ročně)",
    "Žádné minimální požadavky na investice (od 500 Kč)",
    "Automatická správa portfolia a rebalancing",
    "Česká společnost s ČNB regulací",
    "Investiční rezerva jako alternativa k spořícím účtům",
    "Dětské účty a krypto portfolia",
    "Flexibilní investování s možností změn"
  ];

  const cons = [
    "Omezený výběr jednotlivých akcií",
    "Nižší potenciální výnosy než u aktivního obchodování",
    "Není ideální pro zkušené investory",
    "Bez možnosti aktivního tradingu",
    "Vyšší poplatky než u přímého ETF investování",
    "Omezené analytické nástroje"
  ];

  return (
    <Layout>
      <SEOHead
        title="Portu recenze 2025 - Český robo-advisor pro začátečníky | ETF průvodce.cz"
        description="✅ Kompletní recenze Portu 2025. Česká automatizovaná investiční platforma s poplatky 0,47-1% ročně. Ideální pro začátečníky a pasivní investory."
        canonical="https://etfpruvodce.cz/portu-recenze"
        keywords="Portu recenze, Portu robo-advisor, automatické investování, česká investiční platforma, pasivní investování"
        schema={reviewSchema}
        ogImage="https://etfpruvodce.cz/og-portu-recenze.jpg"
      />
      <StructuredData data={breadcrumbSchema} />
      
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero sekce */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Portu recenze 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Kompletní hodnocení Portu - české automatizované investiční platformy založené v roce 2017. 
            Ideální řešení pro začátečníky a méně zkušené investory hledající pasivní investování.
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
              overallRating={98}
              overallDescription="Komplexní hodnocení brokera"
              categories={[
                { name: 'Poplatky', score: 95, description: '0,47-1% ročně, all-inclusive' },
                { name: 'Platforma', score: 100, description: 'Nejjednodušší a nejintuitivnější' },
                { name: 'Nabídka', score: 100, description: 'ETF portfolia, automatizace' },
                { name: 'Podpora', score: 95, description: 'Česká podpora, konzultace zdarma' },
                { name: 'Důvěryhodnost', score: 100, description: 'ČNB regulace, WOOD & Company' },
                { name: 'Vzdělání', score: 90, description: 'Robo-advisor přístup, automatizace' }
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
                Výhody Portu
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
                Nevýhody Portu
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
              Klíčové informace o Portu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Založení a regulace</h4>
                  <p className="text-sm text-gray-600">
                    Založeno v roce 2017 skupinou WOOD & Company. 
                    200 000+ klientů, 28 miliard Kč spravovaných aktiv.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Historické výnosy</h4>
                  <p className="text-sm text-gray-600">
                    Historické výnosy okolo 10,5% ročně. 
                    Doporučený investicíní horizont 5-10 let.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Nabídka investic</h4>
                  <p className="text-sm text-gray-600">
                    ETF portfolia, jednotlivé akcie, české akcie, 
                    krypto portfolia a investiční rezerva.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ochrana investic</h4>
                  <p className="text-sm text-gray-600">
                    Regulováno ČNB. Aktiva oddělena od majetku společnosti. 
                    Garanční fond do 100 000 EUR.
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
            <CardDescription>All-inclusive model s ročním poplatkem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Typ poplatku</th>
                    <th className="text-left py-2 font-semibold">Sazba</th>
                    <th className="text-left py-2 font-semibold">Poznámka</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b">
                    <td className="py-2">Správcovský poplatek</td>
                    <td className="py-2">Max. 1% ročně</td>
                    <td className="py-2 text-gray-600">Slevy až na 0,24% dle částky</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Vstupní poplatek</td>
                    <td className="py-2">
                      <Badge className="bg-green-100 text-green-800">0 Kč</Badge>
                    </td>
                    <td className="py-2 text-gray-600">Bez vstupních poplatků</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Výstupní poplatek</td>
                    <td className="py-2">
                      <Badge className="bg-green-100 text-green-800">0 Kč</Badge>
                    </td>
                    <td className="py-2 text-gray-600">Bezplatný výběr</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Měnové konverze</td>
                    <td className="py-2">
                      <Badge className="bg-green-100 text-green-800">Zahrnut</Badge>
                    </td>
                    <td className="py-2 text-gray-600">Bez dalších poplatků</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Rebalancing</td>
                    <td className="py-2">
                      <Badge className="bg-green-100 text-green-800">Automaticky</Badge>
                    </td>
                    <td className="py-2 text-gray-600">Zahrnut v poplatku</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Investiční možnosti */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Investiční možnosti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Hlavní produkty</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    ETF portfolia podle rizikového profilu
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Jednotlivé akcie
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    České akcie s optimálním zdaněním
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Krypto portfolia
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Speciální služby</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    Investiční rezerva (0,25% ročně, konzervativní)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    Portu &lt;26 (50% sleva, min. 100 Kč)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    DIP - daňové výhody (0,5% ročně)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    Portu Crypto (max. 1% ročně)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platformy a aplikace */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-purple-600" />
              Platformy a dostupnost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Dostupné platformy</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Webová aplikace
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Mobilní aplikace (Android)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Mobilní aplikace (iOS)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Kompletně v češtině
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Zákaznická podpora</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Česká zákaznická podpora
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Pracovní doba 9:00-17:00
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Chat, e-mail, telefon
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Investiční konzultace zdarma
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro koho je vhodný */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pro koho je Portu vhodné?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✅ Vhodné pro</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Úplné začátečníky v investování</li>
                  <li>• Pasivní investory (buy-and-hold)</li>
                  <li>• Ty, kdo preferují automatizaci</li>
                  <li>• Investory s menším kapitálem</li>
                  <li>• Rodiče investující pro děti</li>
                  <li>• Ty, kdo chtějí českou podporu</li>
                  <li>• Dlouhodobé spořitele (5-10 let)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-red-600">❌ Nevhodné pro</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Aktivní tradery</li>
                  <li>• Zkušené investory chtějící kontrolu</li>
                  <li>• Ty, kdo preferují nižší poplatky</li>
                  <li>• Investory chtějící široký výběr akcií</li>
                  <li>• Day tradery a spekulanty</li>
                  <li>• Ty, kdo chtějí pokročilé analytické nástroje</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Minimální vklad */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Minimální vklad a očekávané výnosy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Vstupní požadavky</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <strong>Minimální vklad: 500 Kč</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Další vklady od 100 Kč
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Bezplatný výběr kdykoliv
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Očekávané výnosy</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <strong>Historicky 10,5% ročně</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    28 miliard Kč spravovaných aktiv
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    200 000+ spokojenych klientů
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Závěr */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle>Závěrečné hodnocení</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              Portu je výborná volba pro začátečníky a pasivní investory díky velmi jednoduchému 
              ovládání a automatické správě portfolia. Česká regulace ČNB a lokální podpora 
              přidávají další plus pro domácí investory.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Poplatky 0,47-1% ročně jsou rozumné za all-inclusive službu, ale zkušení investoři 
              mohou dosáhnout nižších nákladů u přímého ETF investování. Pro začátečníky je však 
              pohodlí a automatizace často cennější než úspora na poplatcích.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <a 
                  href="https://www.portu.cz/" 
                  target="_blank" 
                  rel="nofollow noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Otevřít účet u Portu
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
              description: "Porovnání s evropským brokerem"
            },
            {
              title: "XTB recenze",
              href: "/xtb-recenze",
              description: "Alternativa s nižšími poplatky"
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