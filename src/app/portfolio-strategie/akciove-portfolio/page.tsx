import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3Icon, AlertTriangleIcon, CheckCircleIcon, TargetIcon, ZapIcon, UsersIcon, TrendingUpIcon } from '@/components/ui/icons';
import InternalLinking from '@/components/SEO/InternalLinking';
import AkcioviPortfolioPerformance from '@/components/portfolio/AkcioviPortfolioPerformance';
import { getETFLink } from '@/data/etf-mappings';

export const metadata: Metadata = {
  title: 'Akciové Portfolio Strategie | 80% akcie + 20% nemovitosti',
  description: 'Akciová strategie pro zkušené investory. 80% akcie diverzifikované globálně + 20% nemovitosti pro stabilitu. Minimálně 15letý horizont.',
  keywords: [
    'akciové portfolio strategie',
    '80% akcie 20% nemovitosti',
    'globální diverzifikace',
    'REITs nemovitosti',
    'USA Evropa emerging markets',
    'zkušení investori',
    'dlouhodobé investování',
    '15letý horizont'
  ],
  openGraph: {
    title: 'Akciové Portfolio Strategie | 80% akcie + 20% nemovitosti',
    description: 'Akciová strategie pro zkušené investory. 80% akcie diverzifikované globálně + 20% nemovitosti pro stabilitu. Minimálně 15letý horizont.',
    url: 'https://www.etfpruvodce.cz/portfolio-strategie/akciove-portfolio',
    siteName: 'ETF průvodce.cz',
    images: [
      {
        url: 'https://www.etfpruvodce.cz/og-akciove-portfolio.jpg',
        width: 1200,
        height: 630,
        alt: 'Akciové Portfolio - 80% světové akcie, 20% nemovitosti',
      },
    ],
    locale: 'cs_CZ',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/portfolio-strategie/akciove-portfolio'
  }
};

export default function AkciovPortfolioPage() {
  return (
    <Layout>
      <div className="bg-white">
        {/* Modern Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-pink-50/30 to-red-50/50"></div>
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-red-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-pink-200 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-red-300 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
              
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-red-200/50">
                  <ZapIcon className="w-4 h-4 mr-2" />
                  Akciové Portfolio
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Akciové{' '}
                  <span className="bg-gradient-to-r from-red-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                    Portfolio
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Strategie pro zkušené investory s <strong>80% akciemi + 20% nemovitostmi</strong>. Kombinuje růstový potenciál s diverzifikací do nemovitostí.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="#allocation"
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 h-12"
                  >
                    <BarChart3Icon className="w-5 h-5" />
                    Zobrazit složení
                  </Link>
                  <Link
                    href="#vykonnost"
                    className="bg-white/80 backdrop-blur-sm border-2 border-red-300 text-red-700 hover:bg-red-50 px-8 py-3 text-lg font-semibold rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2 h-12"
                  >
                    <TargetIcon className="w-5 h-5" />
                    Aktuální výnos
                  </Link>
                </div>
              </div>
              
              {/* Right Content - Visual Element */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Klíčové údaje</h3>
                  <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Cílový výnos</span>
                  <span className="text-2xl font-bold text-red-600">7-8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Minimální horizont</span>
                  <span className="font-semibold text-gray-900">15+ let</span>
                </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Akcie</span>
                      <span className="text-2xl font-bold text-red-600">80%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Nemovitosti</span>
                      <span className="font-semibold text-gray-900">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Riziko</span>
                      <span className="font-semibold text-red-600">Vysoké</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rebalancing</span>
                      <span className="font-semibold text-gray-900">Ročně</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                    <p className="text-sm font-semibold text-red-800">
                      📈 Pro zkušené investory (15+ let)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialProduct",
              "name": "Akciové Portfolio",
              "description": "Akciová strategie pro zkušené investory. 80% akcie diverzifikované globálně + 20% nemovitosti pro stabilitu s očekávaným výnosem 7-8% ročně.",
              "category": "Investment Strategy",
              "provider": {
                "@type": "Organization",
                "name": "ETF průvodce.cz",
                "url": "https://www.etfpruvodce.cz"
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Aggressive Investors"
              },
              "feesAndCommissionsSpecification": "TER 0.20-0.45% ročně",
              "interestRate": "7-8% očekávaný výnos ročně",
              "riskRating": "Agresivní",
              "minimumInvestmentHorizon": "15 let"
            })
          }}
        />

        <div className="max-w-6xl mx-auto px-4 py-12">


          {/* Portfolio Složení */}
          <div id="allocation">
            <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BarChart3Icon className="text-red-600" />
                Složení Akciového Portfolia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Světové akcie</span>
                    <span className="text-lg font-bold">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div className="bg-blue-600 h-3 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600"><Link href="/etf/IE00BK5BQT80" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">IE00BK5BQT80</Link> - Vanguard FTSE All-World UCITS ETF</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Nemovitostní investice (REITs)</span>
                    <span className="text-lg font-bold">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div className="bg-orange-600 h-3 rounded-full" style={{width: '20%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600"><Link href="/etf/IE00B0M63284" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">IE00B0M63284</Link> - iShares European Property Yield UCITS ETF</p>
                </div>
              </div>
              
              <div className="mt-6 bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Klíčové principy</h4>
                <div className="text-sm">
                  <div>• <strong>Globální diverzifikace:</strong> Rozložení rizika napříč čtyři hlavní regiony</div>
                  <div>• <strong>Dlouhodobý růst:</strong> 100% akciová expozice pro maximální potenciál</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Maximální růst s geografickou diverzifikací</p>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Filozofie strategie */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <ZapIcon className="text-red-600" />
                  Filozofie strategie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📈 Value + Growth kombinace</h4>
                  <p className="text-sm">Kombinuje stabilní value akcie s růstovým potenciálem malých firem</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🏠 Nemovitostní diverzifikace</h4>
                  <p className="text-sm">REITs poskytují další zdroj růstu a ochranu proti inflaci</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🌍 Geografická diverzifikace</h4>
                  <p className="text-sm">Expozice na vyspělé i rozvíjející se trhy pro optimální růst</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">⏰ Dlouhodobý horizont</h4>
                  <p className="text-sm">Minimálně 15letý horizont pro překonání volatility</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircleIcon className="text-green-600" />
                  Výhody strategie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Nejvyšší dlouhodobý růstový potenciál</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Jednoduchost - jen akciové ETF</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Nejnižší náklady na správu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Ochrana proti inflaci</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Ideální pro mládí</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Transparentnost a likvidita</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Aktuální výkonnost */}
          <AkcioviPortfolioPerformance />


          {/* Implementace podle věku */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <TargetIcon className="text-blue-600" />
                Implementace podle životní fáze
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4 text-green-700">🚀 Fáze akumulace (20-40 let)</h4>
                  <div className="space-y-2 text-sm">
                    <div>• <strong>100%</strong> akcie</div>
                    <div>• Maximální růst</div>
                    <div>• DCA každý měsíc</div>
                    <div>• Ignorace volatility</div>
                  </div>
                  <p className="text-xs text-green-600 mt-3">Ideální pro mladé investory</p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4 text-orange-700">⚖️ Fáze přechodu (40-55 let)</h4>
                  <div className="space-y-2 text-sm">
                    <div>• <strong>90%</strong> akcie, 10% dluhopisy</div>
                    <div>• Postupné snižování rizika</div>
                    <div>• Pokračování v akumulaci</div>
                    <div>• Kontrola volatility</div>
                  </div>
                  <p className="text-xs text-orange-600 mt-3">Příprava na důchod</p>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4 text-red-700">🛡️ Před důchodem (55+ let)</h4>
                  <div className="space-y-2 text-sm">
                    <div>• <strong>70-80%</strong> akcie</div>
                    <div>• Ochrana kapitálu</div>
                    <div>• Snížení volatility</div>
                    <div>• Přechod na konzervativní</div>
                  </div>
                  <p className="text-xs text-red-600 mt-3">Ochrana před sequence riskem</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Praktická implementace */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <TargetIcon className="text-blue-600" />
                Praktická implementace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">🔥 Pro začátečníky (1 ETF)</h4>
                  <div className="space-y-2 text-sm bg-blue-50 p-4 rounded-lg">
                    <div className="font-semibold"><Link href="/etf/IE00BK5BQT80" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">IE00BK5BQT80</Link> - Vanguard FTSE All-World</div>
                    <div>• <strong>100%</strong> alokace</div>
                    <div>• TER: 0,22%</div>
                    <div>• 4000+ společností</div>
                    <div>• Automatická diverzifikace</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">⚡ Pro pokročilé (3 ETF)</h4>
                  <div className="space-y-2 text-sm bg-red-50 p-4 rounded-lg">
                    <div>• <strong>75%</strong> <Link href={getETFLink('IWDA')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">IWDA</Link> (vyspělé trhy)</div>
                    <div>• <strong>15%</strong> <Link href={getETFLink('EIMI')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">EIMI</Link> (rozvíjející se trhy)</div>
                    <div>• <strong>10%</strong> <Link href={getETFLink('IUSN')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">IUSN</Link> (malé společnosti)</div>
                    <div className="text-xs text-gray-500 mt-2">Vyšší diverzifikace + small cap tilt</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Tipy pro úspěch</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>DCA:</strong> Investujte pravidelně bez ohledu na trh</li>
                  <li>• <strong>Rebalancing:</strong> Jednou ročně při více ETF</li>
                  <li>• <strong>Disciplína:</strong> Nekupujte/neprodávejte na základě emocí</li>
                  <li>• <strong>Dlouhodobost:</strong> Počítejte s horizontem 20+ let</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Rizika a nevýhody */}
          <Card className="mb-12 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-orange-700">
                <AlertTriangleIcon className="text-orange-600" />
                Rizika a nevýhody
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 p-6 rounded-lg">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <AlertTriangleIcon className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Vysoká volatilita:</strong> Velké výkyvy během krizí (-50%)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangleIcon className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Sequence risk:</strong> Špatné časování na začátku důchodu může zruinovat plán</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangleIcon className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Emocionální nápor:</strong> Obtížné držet během bear marketu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangleIcon className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Koncentrace rizika:</strong> Pouze jedna třída aktiv</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangleIcon className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Dlouhé recovery:</strong> Návrat na peak může trvat roky</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Pro koho je vhodné */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <UsersIcon className="text-purple-600" />
                Pro koho je Akciové Portfolio vhodné?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-600 mb-4">✅ Ideální pro:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Mladé investory (20-40 let)</li>
                    <li>• Ty s vysokou tolerancí k riziku</li>
                    <li>• Dlouhodobé investory (20+ let)</li>
                    <li>• Investory s pravidelným příjmem</li>
                    <li>• Ty, kdo chtějí maximalizovat růst</li>
                    <li>• Disciplinované investory</li>
                    <li>• Fanoušky jednoduchosti</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-4">❌ Nevhodné pro:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Investory blízko důchodu</li>
                    <li>• Ty s nízkou tolerancí k riziku</li>
                    <li>• Krátkodobé investory (méně než 10 let)</li>
                    <li>• Lidi potřebující pravidelný příjem</li>
                    <li>• Emocionální investory</li>
                    <li>• Ty bez emergency fondu</li>
                    <li>• Konzervativní investory</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <section className="py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-6 py-3 rounded-full text-sm font-medium mb-6">
                <TrendingUpIcon className="w-4 h-4 mr-2" />
                Často kladené otázky
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Vše o Akciovém Portfoliu
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Odpovědi na nejčastější dotazy o této agresivní růstové strategii pro zkušené investory
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                question: "Proč je Akciové Portfolio složené ze 80% akcií a 20% nemovitostí?",
                answer: "Toto složení maximalizuje růstový potenciál při zachování určité diverzifikace. 80% akcií poskytuje hlavní růstový motor s historicky nejvyššími výnosy. 20% nemovitostí (REITs) přidává diverzifikaci, pravidelné dividendy a ochranu proti inflaci, aniž by významně snížilo celkový růstový potenciál portfolia."
              },
              {
                question: "Je tato strategie opravdu vhodná jen pro zkušené investory?",
                answer: "Ano, vyžaduje vysokou psychickou odolnost. Musíte zvládnout ztráty 30-50% bez paniky a pokračovat v investování. Mnoho začátečníků prodá na dně trhu ze strachu. Potřebujete minimálně 15-20 let investiční horizont a stabilní příjem. Zkušenost pomáhá, ale klíčová je disciplína a dlouhodobé myšlení."
              },
              {
                question: "Proč tak specifické ETF? Nemohu použít jiné?",
                answer: "Doporučené ETF jsou vybráné pro optimální diverzifikaci: IE00BL25JM42 (hodnotové akcie), IE00BF4RFH31 (malé společnosti), IE00BK5BR626 (emerging markets), IE00B1FZS350 (REITs). Můžete použít alternativy, ale držte se principů - kombinace hodnoty/růstu, velikosti firem, geografické diverzifikace a nemovitostí."
              },
              {
                question: "Jak často rebalancovat a kdy nakupovat?",
                answer: "Rebalancování jednou ročně nebo při odchylce >10% od cílové alokace. Používejte Dollar Cost Averaging - investujte stejnou částku každý měsíc bez ohledu na ceny. Nikdy nečekejte na 'správný čas' k nákupu. V krizích investujte víc, ne méně. Time in market beats timing the market."
              },
              {
                question: "Kolik mohu ztratit a jak dlouho to bude trvat?",
                answer: "Historicky největší ztráty byly 50-60% (dot-com 2000, krize 2008). Recovery trvala 5-7 let. Musíte být připraveni na ztrátu poloviny hodnoty portfolia a pokračovat v investování. Bez této mentální připravenosti tato strategie není pro vás. Pamatujte: ztráty jsou jen na papíře, dokud neprodáte."
              },
              {
                question: "Potřebuji velký kapitál na začátek?",
                answer: "Ne, můžete začít s 10 000 Kč měsíčně. Začněte s jedním širokým ETF (VWCE nebo CSPX) a postupně přidávejte další složky. Při pravidelném investování 10 000 Kč měsíčně dosáhnete za 20 let při 8% výnosu na 6 milionů Kč. Klíčová je pravidelnost, ne velikost počáteční investice."
              },
              {
                question: "Jak se liší od jiných akcních strategií?",
                answer: "Naše strategie kombinuje různé faktory (value/growth, size, geography) místo pouhého sledování jednoho indexu. To poskytuje lepší diverzifikaci než jen S&P 500 nebo FTSE All-World. Přidání REITs snižuje korelaci a volatilitu. Výsledek je optimalizované akciové portfolio s lepším rizikovým profilem."
              },
              {
                question: "Co v době krize a jak psychicky zvládnout ztráty?",
                answer: "V krizi NEPRODÁVEJTE a pokračujte v pravidelném investování. Krize jsou příležitosti, ne katastrofy. Mějte 6-12 měsíců výdajů v emergency fondu. Sledujte dlouhodobé cíle, ne denní výkyvy. Vzdělejte se o historii trhů. Připomeňte si, že všechny krize skončily a trhy dosáhly nových maxim."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-xl hover:border-red-300 transition-all duration-300 bg-white hover:shadow-lg">
                <summary className="flex justify-between items-center w-full px-8 py-6 text-left cursor-pointer group-hover:bg-gradient-to-r group-hover:from-red-50 group-hover:to-orange-50 rounded-xl group-open:rounded-b-none transition-all">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-red-800 pr-4">{faq.question}</span>
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center group-hover:from-red-200 group-hover:to-orange-200 transition-all">
                      <svg className="w-4 h-4 text-red-600 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </summary>
                <div className="px-8 py-6 text-gray-700 leading-relaxed bg-gradient-to-r from-gray-50 to-red-50 rounded-b-xl border-t border-gray-100">
                  {faq.answer}
                </div>
              </details>
            ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-red-600 to-orange-600 text-white p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Připraveni na akciové investování?</h2>
            <p className="text-lg mb-6 opacity-90">
              Naučte se implementovat agresivní růstovou strategii pro maximalizaci dlouhodobého bohatství.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/srovnani-etf" className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Najít akciové ETF
              </Link>
              <Link href="/kalkulacky/investicni-kalkulacka" className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-400 transition-colors">
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
              description: "Otestujte historickou výkonnost Akciového Portfolia"
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
              title: "Dividendové Portfolio",
              href: "/portfolio-strategie/dividendove-portfolio",
              description: "Dividendové akcie s 4% výnosem + růst"
            },
            {
              title: "Nejlepší ETF 2025",
              href: "/nejlepsi-etf/nejlepsi-etf-2025",
              description: "Najděte nejlepší akciové ETF pro vaši strategii"
            }
          ]}
          title="Související strategie a nástroje"
          className="mt-16"
        />

      </div>
    </Layout>
  );
}