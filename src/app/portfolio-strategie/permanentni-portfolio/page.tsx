import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from '@/components/ui/badge'; // unused
// import { Button } from '@/components/ui/button'; // unused
import Link from 'next/link';
import { AlertCircle, CheckCircle, Target, Clock , Flag, Shield, Users, Award} from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import PortfolioAllocationChart from '@/components/portfolio/PortfolioAllocationChart';
import PermanentniPortfolioHero from '@/components/portfolio/PermanentniPortfolioHero';
import PermanentniPortfolioPerformance from '@/components/portfolio/PermanentniPortfolioPerformance';
import { getETFLink } from '@/data/etf-mappings';

export const metadata: Metadata = {
  title: 'Permanentní Portfolio Strategie 2025 | 4% bezpečně s ETF | ETF průvodce.cz',
  description: 'Kompletní průvodce Permanentní Portfolio strategií Harryho Browna. Očekávaný výnos 4% ročně s minimálním rizikem a ochranou proti všem ekonomickým cyklům pomocí čtyř tříd aktiv.',
  keywords: [
    'permanentní portfolio',
    'Harry Browne',
    'konzervativní investování',
    'ETF strategie',
    '25/25/25/25 portfolio',
    'bezpečné investování',
    'nemovitosti ETF',
    'komodity ETF',
    'ochrana proti inflaci',
    'všepogodní portfolio',
    'ekonomické cykly'
  ],
  openGraph: {
    title: 'Permanentní Portfolio Strategie 2025 | 4% bezpečně s ETF',
    description: 'Kompletní průvodce Permanentní Portfolio strategií Harryho Browna. 25% akcie + 25% dluhopisy + 25% nemovitosti + 25% komodity s očekávaným výnosem 4% ročně.',
    url: 'https://www.etfpruvodce.cz/portfolio-strategie/permanentni-portfolio',
    siteName: 'ETF průvodce.cz',
    images: [
      {
        url: 'https://www.etfpruvodce.cz/og-permanentni-portfolio.jpg',
        width: 1200,
        height: 630,
        alt: 'Permanentní Portfolio - 25% akcie, 25% dluhopisy, 25% nemovitosti, 25% komodity',
      },
    ],
    locale: 'cs_CZ',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/portfolio-strategie/permanentni-portfolio'
  }
};

export default function PermanentniPortfolioPage() {
  return (
    <Layout>
      <div className="bg-white">
        <PermanentniPortfolioHero />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialProduct",
              "name": "Permanentní Portfolio",
              "description": "Kompletní průvodce Permanentní Portfolio strategií Harryho Browna. 25% akcie + 25% dluhopisy + 25% nemovitosti + 25% komodity s očekávaným výnosem 4% ročně.",
              "category": "Investment Strategy",
              "provider": {
                "@type": "Organization",
                "name": "ETF průvodce.cz",
                "url": "https://www.etfpruvodce.cz"
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Conservative Investors"
              },
              "feesAndCommissionsSpecification": "TER 0.15-0.60% ročně",
              "interestRate": "4% očekávaný výnos ročně",
              "riskRating": "Konzervativní",
              "creator": {
                "@type": "Person",
                "name": "Harry Browne"
              }
            })
          }}
        />

        <div className="max-w-6xl mx-auto px-4 py-12">


          {/* Portfolio Složení */}
          <div id="allocation">
            <PortfolioAllocationChart 
            title="Složení Permanentního Portfolia"
            className="mb-12"
            data={[
              {
                name: "Akcie",
                value: 25,
                color: "#3b82f6",
                description: "Globální akciový trh",
                etf: "Vanguard FTSE All-World", link: "/etf/IE00BK5BQT80"
              },
              {
                name: "Dluhopisy", 
                value: 25,
                color: "#10b981",
                description: "Globální agregované dluhopisy EUR Hedged",
                etf: "iShares Core Global Aggregate Bond UCITS ETF EUR Hedged (Acc)", link: "/etf/IE00BDBRDM35"
              },
              {
                name: "Nemovitosti",
                value: 25, 
                color: "#f59e0b",
                description: "Evropské nemovitostní investice",
                etf: "iShares European Property Yield UCITS ETF", link: "/etf/IE00B0M63284"
              },
              {
                name: "Komodity",
                value: 25,
                color: "#6b7280", 
                description: "Široký komoditní košík",
                etf: "Invesco Bloomberg Commodity UCITS ETF Acc", link: "/etf/IE00BD6FTQ80"
              }
            ]}
          />
          </div>

          {/* O strategii */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Clock className="text-green-600" />
                O strategii
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <h4 className="font-bold text-lg text-blue-900 mb-3">Harry Browne a ekonomické cykly</h4>
                <p className="text-blue-800 leading-relaxed">
                  <strong>S tímto portfoliem přišel poprvé Harry Browne v roce 1981.</strong> Je to pravděpodobně první portfolio 
                  založené na analýze ekonomického cyklu. Stojí na principu, že ekonomika se v každém okamžiku nachází 
                  v jedné ze čtyř fází: <strong>prosperita/růst</strong>, <strong>inflace</strong>, <strong>deflace</strong> a <strong>recese</strong>.
                </p>
                <p className="text-blue-700 mt-3">
                  Cílem této strategie není snaha předpovídat, kdy která fáze cyklu nastane nebo jak dlouho bude trvat. 
                  Záměrem je držet čtyři rovnocenné třídy aktiv, kdy v každé fázi ekonomického cyklu se bude více dařit jedné z nich.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Filozofie a principy */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="text-green-600" />
                  Čtyři ekonomické fáze
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🌱 Prosperita (akcie 25%)</h4>
                  <p className="text-sm">Výnos během ekonomického růstu a prosperity</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🔥 Inflace (nemovitosti 25%)</h4>
                  <p className="text-sm">Ochrana před inflací a stabilní výnosy z realit</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">❄️ Deflace (dluhopisy 25%)</h4>
                  <p className="text-sm">Ochrana během deflace a zajištění likvidity</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📉 Recese (komodity 25%)</h4>
                  <p className="text-sm">Hedge proti ekonomické nestabilitě a krizím</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="text-green-600" />
                  Výhody strategie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Funguje ve všech ekonomických cyklech</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Nejnižší volatilita ze všech strategií</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Nevyžaduje predikci trhu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Jednoduchá implementace</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Ochrana před inflací i deflací</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Reálná výkonnost */}
          <div id="performance">
            <PermanentniPortfolioPerformance />
          </div>

          {/* Implementace */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="text-blue-600" />
                Jak implementovat Permanentní Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">📋 Doporučené UCITS ETF</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Akcie (25%):</span>
                      <span className="font-semibold"><Link href={getETFLink('VWCE')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">VWCE</Link></span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dluhopisy (25%):</span>
                      <span className="font-semibold"><Link href={getETFLink('AGGH')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">AGGH</Link></span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nemovitosti (25%):</span>
                      <span className="font-semibold"><Link href={getETFLink('IPRP')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">IPRP</Link></span>
                    </div>
                    <div className="flex justify-between">
                      <span>Komodity (25%):</span>
                      <span className="font-semibold"><Link href={getETFLink('COMM')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">COMM</Link></span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">⚖️ Rebalancing pravidla</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Frekvence:</strong> Jednou ročně</li>
                    <li>• <strong>Trigger:</strong> Při odchylce &gt;5%</li>
                    <li>• <strong>Cíl:</strong> Návrat na 25/25/25/25</li>
                    <li>• <strong>Metoda:</strong> Prodej nejsilnější, nákup nejslabší</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Tip pro začátečníky</h4>
                <p className="text-sm text-blue-800">
                  Začněte s jednodušší verzí: 50% <Link href={getETFLink('VWCE')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">VWCE</Link> + 50% <Link href={getETFLink('AGGH')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">AGGH</Link>. 
                  Nemovitosti a komodity přidejte později, když získáte zkušenosti s investováním.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rizika a nevýhody */}
          <Card className="mb-12 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-orange-700">
                <AlertCircle className="text-orange-600" />
                Rizika a nevýhody
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 p-6 rounded-lg">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Nízký výnos:</strong> Nejnižší očekávaný výnos ze všech strategií</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Komplexnost:</strong> Nutnost držet 4 různé třídy aktiv</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Náklady na rebalancing:</strong> Častější transakce = vyšší poplatky</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Opportunity cost:</strong> V bull marketu zaostává za akciovými portfolii</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Pro koho je vhodné */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="text-purple-600" />
                Pro koho je Permanentní Portfolio vhodné?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-600 mb-4">✅ Vhodné pro:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Konzervativní investory</li>
                    <li>• Lidi blízko nebo v důchodu</li>
                    <li>• Ty, kdo se bojí volatility</li>
                    <li>• Investory preferující jednoduchost</li>
                    <li>• Ty, kdo chtějí "fire and forget" strategii</li>
                    <li>• Investory s nízkou tolerancí k riziku</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-4">❌ Méně vhodné pro:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Mladé investory (pod 40 let)</li>
                    <li>• Ty, kdo hledají vysoké výnosy</li>
                    <li>• Aktivní investory</li>
                    <li>• Investory s malým kapitálem (pod 50k Kč)</li>
                    <li>• Ty, kdo preferují jednoduché portfolio</li>
                    <li>• Investory s vysokou tolerancí k riziku</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <section className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Často kladené otázky o Permanentním Portfoliu
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Odpovědi na nejčastější dotazy o implementaci a správě této konzervativní strategie
              </p>
            </div>
            <div className="space-y-6">
            {[
              {
                question: "Proč má Permanentní Portfolio jen 4% očekávaný výnos?",
                answer: "Permanentní Portfolio je navrženo pro maximální bezpečnost, ne výnos. 4% je reálný očekávaný výnos po inflaci s minimálním rizikem. Strategie nikdy neztratila více než 15% v žádné krizi za posledních 50 let, což je výjimečné. Je to cena za stabilitu a klid na investicích."
              },
              {
                question: "Jak často musím rebalancovat Permanentní Portfolio?",
                answer: "Doporučujeme rebalancing jednou ročně nebo když některá alokace vybočí o více než 5% (např. místo 25% máte 30% nebo 20%). Častější rebalancing není nutný a zvyšuje transakční náklady. Harry Browne původně doporučoval rebalancing jen při odchylce větší než 35%."
              },
              {
                question: "Mohu použít jiné ETF než ty doporučené?",
                answer: "Ano, ale držte se principů. Pro akcie použijte široký světový index (VWCE, CSPX), pro dlouhodobé dluhopisy 15+ let (IGLT, VGLT), pro nemovitosti REITs (IPRP, EPRA), pro komodity širký košík (EXXY, CMCX). Klíčové je dodržet 25% alokaci každé třídy aktiv."
              },
              {
                question: "Je Permanentní Portfolio vhodné pro mladé investory?",
                answer: "Spíše ne. Pro investory pod 40 let je příliš konzervativní. Mladí lidé mohou tolerovat větší volatilitu výměnou za vyšší výnosy. Lepší volbou je Nobel Portfolio (6%) nebo Akciové portfolio (7-8%). Permanentní Portfolio je ideální pro investory 50+ nebo velmi konzervativní investory."
              },
              {
                question: "Jak Permanentní Portfolio reaguje na inflaci?",
                answer: "Velmi dobře. Portfolio má zabudovanou ochranu proti inflaci prostřednictvím komodit (růst cen surovin), nemovitostí (růst nájmů) a akcií (dlouhodobá ochrana). Pouze dlouhodobé dluhopisy trpí, ale ostatní složky to kompenzují. To je síla této strategie."
              },
              {
                question: "Potřebuji velký kapitál na začátek?",
                answer: "Doporučujeme alespoň 100 000 Kč pro efektivní diverzifikaci do 4 ETF. S menším kapitálem začněte s jedním širokým ETF (VWCE) a postupně přidávejte další složky. Minimální investice je obvykle 50-100 Kč za podíl, ale efektivní rebalancing vyžaduje větší částky."
              },
              {
                question: "Může Permanentní Portfolio ztratit více než 15%?",
                answer: "Teoreticky ano, ale historicky se to nestalo. Za posledních 50 let byl největší propad -13% během finanční krize 2008. Portfolio je navrženo tak, aby různé třídy aktiv reagovaly opačně na ekonomické šoky, což minimalizuje celkové ztráty."
              },
              {
                question: "Jak se liší od Ray Dalio All-Weather strategie?",
                answer: "Obě jsou 'všepogodní', ale liší se složitostí. Permanentní Portfolio je jednodušší (4 aktiva po 25%), All-Weather složitější (5 aktiv v různých poměrech). Permanentní má nižší očekávaný výnos (4% vs 5-8%), ale jednodušší správu. All-Weather vyžaduje častější rebalancing."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-green-200 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-green-50 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-green-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                  {faq.answer}
                </div>
              </details>
            ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Chcete začít s Permanentním Portfoliem?</h2>
            <p className="text-lg mb-6 opacity-90">
              Naučte se implementovat tuto konzervativní strategii krok za krokem.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/srovnani-etf" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Najít vhodné ETF
              </Link>
              <Link href="/kalkulacky/investicni-kalkulacka" className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-400 transition-colors">
                Spočítat výnos
              </Link>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Backtest portfolia",
              href: "/kalkulacky/backtest-portfolia",
              description: "Otestujte historickou výkonnost Permanentního Portfolia"
            },
            {
              title: "Monte Carlo simulátor",
              href: "/kalkulacky/monte-carlo-simulator",
              description: "Prognóza budoucnosti s tisíci scénářů"
            },
            {
              title: "Portfolio strategie přehled",
              href: "/portfolio-strategie",
              description: "Porovnejte všech 5 investičních strategií"
            },
            {
              title: "Nobel Portfolio",
              href: "/portfolio-strategie/nobel-portfolio",
              description: "Vědecky podložená strategie s 6% očekávaným výnosem"
            },
            {
              title: "Ray Dalio All-Weather",
              href: "/portfolio-strategie/ray-dalio-all-weather",
              description: "Pokročilejší všepogodní strategie"
            }
          ]}
          title="Související strategie a nástroje"
          className="mt-16"
        />
      </div>
    </Layout>
  );
}