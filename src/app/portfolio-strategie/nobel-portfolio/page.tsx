import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, AlertCircle, CheckCircle, Target, Award, Shield, Users } from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import NobelPortfolioPerformance from '@/components/portfolio/NobelPortfolioPerformance';
import { getETFLink } from '@/data/etf-mappings';
import NobelPortfolioHero from '@/components/portfolio/NobelPortfolioHero';

export const metadata: Metadata = {
  title: 'Nobel Portfolio Strategie 2025 | 6% ročně s ETF | ETF průvodce.cz',
  description: 'Kompletní průvodce Nobel Portfolio strategií založené na vědeckých poznatcích. 55% akcie + 25% dluhopisy + 20% nemovitosti s očekávaným výnosem 6% ročně.',
  keywords: [
    'Nobel portfolio',
    'investiční strategie',
    'ETF portfolio',
    '55% akcie 25% dluhopisy 20% nemovitosti',
    'diverzifikace',
    'ETF strategie',
    'dlouhodobé investování',
    'rebalancing portfolio'
  ],
  openGraph: {
    title: 'Nobel Portfolio Strategie 2025 | 6% ročně s ETF',
    description: 'Kompletní průvodce Nobel Portfolio strategií založené na vědeckých poznatcích. 55% akcie + 25% dluhopisy + 20% nemovitosti s očekávaným výnosem 6% ročně.',
    url: 'https://www.etfpruvodce.cz/portfolio-strategie/nobel-portfolio',
    siteName: 'ETF průvodce.cz',
    images: [
      {
        url: 'https://www.etfpruvodce.cz/og-nobel-portfolio.jpg',
        width: 1200,
        height: 630,
        alt: 'Nobel Portfolio - 55% akcie, 25% dluhopisy, 20% nemovitosti',
      },
    ],
    locale: 'cs_CZ',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/portfolio-strategie/nobel-portfolio'
  }
};

export default function NobelPortfolioPage() {
  return (
    <Layout>
      <div className="bg-white">
        <NobelPortfolioHero />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialProduct",
              "name": "Nobel Portfolio",
              "description": "Kompletní průvodce Nobel Portfolio strategií založené na vědeckých poznatcích. 55% akcie + 25% dluhopisy + 20% nemovitosti s očekávaným výnosem 6% ročně.",
              "category": "Investment Strategy",
              "provider": {
                "@type": "Organization",
                "name": "ETF průvodce.cz",
                "url": "https://www.etfpruvodce.cz"
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Moderate Investors"
              },
              "feesAndCommissionsSpecification": "TER 0.20-0.45% ročně",
              "interestRate": "6% očekávaný výnos ročně",
              "riskRating": "Umírněné",
              "isBasedOn": {
                "@type": "ResearchProject",
                "name": "Nobelova nadace",
                "description": "Investiční strategie používaná Nobelovou nadací pro správu svého kapitálu"
              }
            })
          }}
        />

        <div className="max-w-6xl mx-auto px-4 py-12">


          {/* Portfolio Složení */}
          <div id="allocation">
            <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BarChart3 className="text-amber-600" />
                Složení Nobel Portfolia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Globální akcie</span>
                    <span className="text-lg font-bold">55%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div className="bg-blue-600 h-3 rounded-full" style={{width: '55%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600"><Link href="/etf/IE00BK5BQT80" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">IE00BK5BQT80</Link> - Vanguard FTSE All-World</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Globální dluhopisy</span>
                    <span className="text-lg font-bold">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div className="bg-green-600 h-3 rounded-full" style={{width: '25%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600"><Link href="/etf/IE00BDBRDM35" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">IE00BDBRDM35</Link> - iShares Core Global Aggregate Bond UCITS ETF EUR Hedged (Acc)</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Globální nemovitosti</span>
                    <span className="text-lg font-bold">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div className="bg-orange-600 h-3 rounded-full" style={{width: '20%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600"><Link href="/etf/IE00B0M63284" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">IE00B0M63284</Link> - iShares European Property Yield UCITS ETF</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Vědecké pozadí */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="text-amber-600" />
                  Klíčové principy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🎯 Diverzifikace</h4>
                  <p className="text-sm">Rozložení investice do různých tříd aktiv snižuje celkové riziko portfolia</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">⚖️ Vyváženost</h4>
                  <p className="text-sm">Kombinace růstových a defenzivních aktiv pro stabilní výkonnost</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📈 Dlouhodobost</h4>
                  <p className="text-sm">Strategie navržená pro dlouhodobé investory s investičním horizontem 10+ let</p>
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
                    <span>Vyvážený poměr růstu a stability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Nižší volatilita než čistě akciové portfolio</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Vhodné pro střední rizikovou toleranci</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Jednoduchá implementace se 3 ETF</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Diverzifikace napříč třídami aktiv</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* O Nobelově nadaci */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Award className="text-amber-600" />
                O Nobelově nadaci
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
                <h4 className="font-bold text-lg text-amber-900 mb-3">Historie investiční strategie</h4>
                <p className="text-amber-800 leading-relaxed">
                  <strong>Nobelova nadace původně investovala pouze do švédských státních dluhopisů.</strong> 
                  Po významných ztrátách způsobených inflací a světovými válkami v 50. letech 20. století 
                  nadace přehodnotila svou investiční strategii.
                </p>
                <p className="text-amber-700 mt-3">
                  Nová strategie se zaměřila na diverzifikaci mezi různé třídy aktiv s cílem zajistit 
                  dlouhodobý růst při rozumném riziku. Tato zkušenost inspirovala mnoho investorů 
                  k vytvoření vyváženého portfolia s různými třídami aktiv.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reálná výkonnost */}
          <div id="performance">
            <NobelPortfolioPerformance />
          </div>

          {/* Implementace */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="text-blue-600" />
                Jak implementovat Nobel Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">📋 Krok za krokem</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Otevřete si účet u brokera (Degiro, IBKR, XTB)</li>
                    <li>Vložte počáteční kapitál</li>
                    <li>Nakupte ETF podle alokace 55/25/20</li>
                    <li>Nastavte pravidelné investování (DCA)</li>
                    <li>Rebalancujte jednou ročně</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">💰 Potřebný kapitál</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Minimum:</strong> 10 000 Kč</li>
                    <li><strong>Optimum:</strong> 50 000+ Kč</li>
                    <li><strong>Měsíční:</strong> 2 000+ Kč (DCA)</li>
                    <li><strong>Rebalancing:</strong> Jednou ročně</li>
                  </ul>
                </div>
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
                    <span><strong>Nižší výnos:</strong> Ve srovnání s 100% akciovým portfoliem v bull marketu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Úrokové riziko:</strong> Dluhopisy citlivé na změny úrokových sazeb</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Inflační riziko:</strong> V prostředí vysoké inflace může podávat horší výkon</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Korelace aktiv:</strong> V krizích mohou akcie i dluhopisy klesat současně</span>
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
                Pro koho je Nobel Portfolio vhodné?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-600 mb-4">✅ Vhodné pro:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Investory se střední tolerancí k riziku</li>
                    <li>• Začátečníky hledající prokázanou strategii</li>
                    <li>• Investory blížící se důchodu</li>
                    <li>• Ty, kdo chtějí nižší volatilitu než akcie</li>
                    <li>• Dlouhodobé investory (10+ let)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-4">❌ Méně vhodné pro:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Mladé agresivní investory</li>
                    <li>• Ty, kdo hledají maximální výnos</li>
                    <li>• Krátkodobé investory (méně než 5 let)</li>
                    <li>• Investory preferující jednoduché řešení</li>
                    <li>• Ty, kdo nechtějí rebalancovat</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <section className="py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-6 py-3 rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4 mr-2" />
                Často kladené otázky
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Vše o Nobel Portfoliu
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Odpovědi na nejčastější dotazy o implementaci a správě této vědecky podložené strategie
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                question: "Proč má Nobel Portfolio zrovna 55/25/20 složení?",
                answer: "Toto rozdělení používá Nobelova nadace pro správu svého kapitálu. 55% akcií poskytuje růstový potenciál, 25% dluhopisů stabilitu a ochranu v krizích, 20% nemovitostí diverzifikaci a ochranu proti inflaci. Tato kombinace optimalizuje poměr výnos/riziko pro střední rizikový profil."
              },
              {
                question: "Jak často je potřeba rebalancovat Nobel Portfolio?",
                answer: "Doporučujeme rebalancing jednou ročně nebo když některá složka vybočí o více než 5% od cílové alokace. Například když akcie místo 55% tvoří 60% nebo více. Častější rebalancing není nutný a zvyšuje transakční náklady. Používejte calendar rebalancing (každý leden) nebo threshold rebalancing (při překročení limitu)."
              },
              {
                question: "Je Nobel Portfolio vhodné pro začátečníky?",
                answer: "Ano, je velmi vhodné pro začátečníky se střední tolerancí k riziku. Skládá se pouze ze 3 ETF, což je snadné na správu. Poskytuje dobrou diverzifikaci bez složitosti. Začátečníci ocení stabilnější výkonnost než u čistě akciového portfolia, ale vyšší výnosy než u konzervativního portfolia."
              },
              {
                question: "Jak se liší od klasického 60/40 portfolia?",
                answer: "Nobel Portfolio má 55% akcií místo 60% a přidává 20% nemovitostí. Klasické 60/40 má 60% akcií a 40% dluhopisů bez nemovitostí. Přidání nemovitostí poskytuje další diverzifikaci, ochranu proti inflaci a často nižší korelaci s akciemi a dluhopisy. To zlepšuje rizikově upravený výnos."
              },
              {
                question: "Jaký je minimální kapitál pro efektivní investování?",
                answer: "Doporučujeme alespoň 50 000 Kč pro efektivní rozdělení do 3 ETF. S menší částkou začněte postupně - nejdříve VWCE (akcie), pak přidejte AGGH (dluhopisy) a nakonec IPRP (nemovitosti). Minimální investice do ETF je obvykle 50-100 Kč za podíl, ale pro efektivní rebalancing potřebujete větší částky."
              },
              {
                question: "Jak Nobel Portfolio reaguje na ekonomické krize?",
                answer: "Portfolio je navrženo k zvládání různých ekonomických podmínek. V recesi pomohou dluhopisy, během inflace nemovitosti a akcie, v deflaci dlouhodobé dluhopisy. Během krize 2008 podobná portfolia ztratila méně než čistě akciová. Není 'všepogodní' jako Permanent Portfolio, ale je odolnější než agresivní strategie."
              },
              {
                question: "Mohu upravit alokaci podle svého věku?",
                answer: "Ano, doporučujeme úpravy podle věku. Mladší investoři (20-30 let) mohou zvýšit akcie na 70% a snížit dluhopisy na 15%. Starší investoři (50+) mohou snížit akcie na 40% a zvýšit dluhopisy na 35%. Nemovitosti ponechte na 20-25%. Toto umožňuje přizpůsobit riziko vašemu investičnímu horizontu."
              },
              {
                question: "Které ETF jsou nejlepší pro implementaci?",
                answer: "Doporučujeme: VWCE (akcie - široká světová diverzifikace), AGGH (dluhopisy - globální agregát), IPRP (nemovitosti - evropské REITs). Alternativy: CSPX místo VWCE, IEAA místo AGGH, EPRA místo IPRP. Klíčové je nízký TER (pod 0,5%), vysoká likvidita a široká diverzifikace. Vyhněte se syntetickým ETF pro začátečníky."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-xl hover:border-amber-300 transition-all duration-300 bg-white hover:shadow-lg">
                <summary className="flex justify-between items-center w-full px-8 py-6 text-left cursor-pointer group-hover:bg-gradient-to-r group-hover:from-amber-50 group-hover:to-orange-50 rounded-xl group-open:rounded-b-none transition-all">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-amber-800 pr-4">{faq.question}</span>
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center group-hover:from-amber-200 group-hover:to-orange-200 transition-all">
                      <svg className="w-4 h-4 text-amber-600 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </summary>
                <div className="px-8 py-6 text-gray-700 leading-relaxed bg-gradient-to-r from-gray-50 to-amber-50 rounded-b-xl border-t border-gray-100">
                  {faq.answer}
                </div>
              </details>
            ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-amber-600 to-orange-600 text-white p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Chcete začít s Nobel Portfoliem?</h2>
            <p className="text-lg mb-6 opacity-90">
              Zjistěte, jak implementovat tuto vědecky podloženou strategii krok za krokem.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/srovnani-etf" className="bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Najít vhodné ETF
              </Link>
              <Link href="/kalkulacky/investicni-kalkulacka" className="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors">
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
              description: "Otestujte historickou výkonnost Nobel Portfolia"
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
              title: "Ray Dalio All-Weather",
              href: "/portfolio-strategie/ray-dalio-all-weather",
              description: "Strategie odolná vůči všem ekonomickým podmínkám"
            },
            {
              title: "Srovnání ETF fondů",
              href: "/srovnani-etf",
              description: "Najděte nejlepší ETF pro vaši strategii"
            }
          ]}
          title="Související strategie a nástroje"
          className="mt-16"
        />

      </div>
    </Layout>
  );
}