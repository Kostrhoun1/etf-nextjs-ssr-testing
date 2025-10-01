import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Cloud, BarChart3, Brain, Shield, AlertCircle, CheckCircle, Target } from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import SocialSharing from '@/components/SocialSharing';

export const metadata: Metadata = {
  title: 'All-Weather Portfolio podle Raya Dalia 2025 | Kompletní průvodce | ETF průvodce.cz',
  description: 'Legendární strategie pro každé ekonomické prostředí. Krok za krokem návod jak sestavit odolné portfolio s ETF fondy včetně praktických kalkulací a rebalancingu.',
  keywords: [
    'All-Weather portfolio',
    'Ray Dalio',
    'Bridgewater',
    'všepogodní portfolio',
    'risk parity',
    'ekonomické cykly',
    'ETF strategie',
    'diversifikace rizika'
  ],
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/tipy/all-weather-portfolio'
  }
};

export default function AllWeatherPortfolioPage() {
  return (
    <Layout>
      <div className="bg-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-slate-100 text-slate-800 px-4 py-2 text-lg">
                <Cloud className="w-5 h-5 mr-2" />
                All-Weather Portfolio
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              All-Weather Portfolio podle Raya Dalia
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Legendární strategie pro každé ekonomické prostředí od zakladatele největšího hedge fondu světa. 
              Krok za krokem návod jak sestavit odolné portfolio s ETF fondy.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Úvod do All-Weather */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Brain className="text-slate-600" />
                    Co je All-Weather Portfolio?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    All-Weather Portfolio je investiční strategie vyvinutá Rayem Daliem, zakladatelem 
                    hedge fondu Bridgewater Associates - největšího hedge fondu na světě.
                  </p>
                  <p className="mb-4">
                    Cílem je vytvořit portfolio, které bude fungovat ve všech ekonomických prostředích 
                    bez nutnosti předpovídat budoucnost.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Klíčové principy:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Risk Parity - vyvážení podle rizika</li>
                      <li>• Uncorrelated Returns - nekoreliované výnosy</li>
                      <li>• Diversifikace napříč ekonomickými cykly</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="text-green-600" />
                    Proč funguje?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-700 mb-2">🌱 Ekonomický růst</h4>
                      <p className="text-sm text-green-600">Akcie a korporátní dluhopisy prosperují</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-700 mb-2">❄️ Recese</h4>
                      <p className="text-sm text-blue-600">Dlouhodobé dluhopisy poskytují ochranu</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-700 mb-2">🔥 Inflace</h4>
                      <p className="text-sm text-red-600">Komodity a TIPS chrání kupní sílu</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-700 mb-2">📉 Deflace</h4>
                      <p className="text-sm text-orange-600">Hotovost a dluhopisy si vedou dobře</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Portfolio složení */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BarChart3 className="text-slate-600" />
                Složení All-Weather Portfolia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">📊 Originální alokace</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Dlouhodobé dluhopisy</span>
                      <span className="font-bold text-lg">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '40%'}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Akcie</span>
                      <span className="font-bold text-lg">30%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '30%'}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Střední dluhopisy</span>
                      <span className="font-bold text-lg">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '15%'}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Komodity</span>
                      <span className="font-bold text-lg">7.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: '7.5%'}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>TIPS (inflační dluhopisy)</span>
                      <span className="font-bold text-lg">7.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '7.5%'}}></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">🎯 ETF implementace</h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="font-semibold">40% - IGLT</div>
                      <div>iShares Core Government Bond (15+ let)</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="font-semibold">30% - VWCE</div>
                      <div>Vanguard FTSE All-World</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <div className="font-semibold">15% - IEGA</div>
                      <div>iShares Euro Government Bond 7-10yr</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded">
                      <div className="font-semibold">7.5% - CMDY</div>
                      <div>iShares Diversified Commodity Swap</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                      <div className="font-semibold">7.5% - ITIP</div>
                      <div>iShares € Inflation Linked Government Bond</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Parity vysvětlení */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>⚖️ Risk Parity - vyvážení podle rizika</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4 text-red-600">❌ Tradiční přístup</h4>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm mb-3">
                      Tradiční 60/40 portfolio alokuje podle hodnoty investice, 
                      ale ne podle rizika.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div>• 60% akcií = 90% rizika portfolia</div>
                      <div>• 40% dluhopisů = 10% rizika portfolia</div>
                    </div>
                    <p className="text-sm mt-3 font-semibold text-red-600">
                      Výsledek: Portfolio je ve skutečnosti 90% akciové!
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 text-green-600">✅ Risk Parity přístup</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm mb-3">
                      All-Weather alokuje tak, aby každá třída aktiv 
                      přispívala stejným dílem k celkovému riziku.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div>• Každá třída aktiv = 20-25% rizika</div>
                      <div>• Vyvážené podle volatility</div>
                      <div>• Lepší diverzifikace rizik</div>
                    </div>
                    <p className="text-sm mt-3 font-semibold text-green-600">
                      Výsledek: Skutečně diverzifikované portfolio!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historická performance */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>📈 Historická performance vs. alternativy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Portfolio</th>
                      <th className="text-right py-3">Roční výnos</th>
                      <th className="text-right py-3">Volatilita</th>
                      <th className="text-right py-3">Sharpe ratio</th>
                      <th className="text-right py-3">Max. propad</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-slate-50">
                      <td className="py-3 font-semibold">All-Weather</td>
                      <td className="text-right py-3 text-green-600">5.4%</td>
                      <td className="text-right py-3">6.8%</td>
                      <td className="text-right py-3 font-semibold">0.79</td>
                      <td className="text-right py-3">-3.9%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">60/40 Portfolio</td>
                      <td className="text-right py-3">6.2%</td>
                      <td className="text-right py-3">12.8%</td>
                      <td className="text-right py-3">0.48</td>
                      <td className="text-right py-3">-23.1%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">100% Akcie</td>
                      <td className="text-right py-3">8.1%</td>
                      <td className="text-right py-3">16.5%</td>
                      <td className="text-right py-3">0.49</td>
                      <td className="text-right py-3">-50.9%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">🏆 Klíčové výhody All-Weather</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">0.79</div>
                    <div className="text-sm">Nejvyšší Sharpe ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">6.8%</div>
                    <div className="text-sm">Nejnižší volatilita</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">-3.9%</div>
                    <div className="text-sm">Minimální propad</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Praktická implementace */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="text-blue-600" />
                Krok za krokem implementace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4">📝 Krok 1: Výpočet částek</h4>
                    <div className="bg-blue-50 p-4 rounded-lg text-sm">
                      <div className="font-semibold mb-2">Příklad s 100 000 Kč:</div>
                      <div>• IGLT (40%): 40 000 Kč</div>
                      <div>• VWCE (30%): 30 000 Kč</div>
                      <div>• IEGA (15%): 15 000 Kč</div>
                      <div>• CMDY (7.5%): 7 500 Kč</div>
                      <div>• ITIP (7.5%): 7 500 Kč</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">⚖️ Krok 2: Rebalancing pravidla</h4>
                    <div className="bg-green-50 p-4 rounded-lg text-sm">
                      <div>• <strong>Frekvence:</strong> Čtvrtletně</div>
                      <div>• <strong>Práh:</strong> Při odchylce &gt;3%</div>
                      <div>• <strong>Metoda:</strong> Prodej nad target, nákup pod target</div>
                      <div>• <strong>Priorita:</strong> Dlouhé dluhopisy nejdůležitější</div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">💡 Zjednodušená varianta pro začátečníky</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold mb-2">3-ETF verze:</h5>
                      <div className="text-sm space-y-1">
                        <div>• 50% IGLT (dlouhé dluhopisy)</div>
                        <div>• 40% VWCE (světové akcie)</div>
                        <div>• 10% SGLN (zlato jako commodity proxy)</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Proč jednodušší:</h5>
                      <div className="text-sm space-y-1">
                        <div>• Méně ETF = nižší náklady</div>
                        <div>• Snadnější rebalancing</div>
                        <div>• Stále zachovává hlavní principy</div>
                        <div>• Ideální pro kapitál pod 50k Kč</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Výhody a nevýhody */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" />
                  Výhody All-Weather
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
                    <span>Nejnižší volatilita a drawdowny</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Nevyžaduje market timing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Prověřeno největším hedge fondem</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Ochrana proti inflaci i deflaci</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertCircle className="text-orange-600" />
                  Nevýhody a rizika
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span>Komplexnost - potřeba 5 ETF</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span>Nižší očekávaný výnos než akcie</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span>Vysoké exposure na dluhopisy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span>Častější rebalancing = vyšší náklady</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span>Může zaostávat v dlouhých bull trzích</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Pro koho je vhodné */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>👥 Pro koho je All-Weather vhodné?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-600 mb-4">✅ Ideální pro:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Velmi konzervativní investory</li>
                    <li>• Lidi blížící se důchodu</li>
                    <li>• Ty, kdo chtějí minimální volatilitu</li>
                    <li>• Investory s velkým kapitálem (100k+ Kč)</li>
                    <li>• Pokročilé investory</li>
                    <li>• Ty, kdo věří v diverzifikaci</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-4">❌ Méně vhodné pro:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Mladé investory (pod 40 let)</li>
                    <li>• Ty, kdo hledají vysoké výnosy</li>
                    <li>• Začátečníky</li>
                    <li>• Investory s malým kapitálem</li>
                    <li>• Ty, kdo preferují jednoduchost</li>
                    <li>• Aktivní obchodníky</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-slate-600 to-gray-600 text-white p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Chcete implementovat All-Weather strategii?</h2>
            <p className="text-lg mb-6 opacity-90">
              Začněte s pokročilou všepogodní strategií od Ray Dalia krok za krokem.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/portfolio-strategie/ray-dalio-all-weather" className="bg-white text-slate-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Detailní průvodce
              </Link>
              <Link href="/srovnani-etf" className="bg-slate-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-400 transition-colors">
                Najít vhodné ETF
              </Link>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Ray Dalio All-Weather Portfolio detailně",
              href: "/portfolio-strategie/ray-dalio-all-weather",
              description: "Kompletní průvodce implementací All-Weather strategie"
            },
            {
              title: "Permanentní Portfolio",
              href: "/portfolio-strategie/permanentni-portfolio", 
              description: "Jednodušší všepogodní alternativa"
            },
            {
              title: "Rebalancing portfolia",
              href: "/tipy/rebalancing-portfolia",
              description: "Jak správně rebalancovat složité portfolio"
            },
            {
              title: "Portfolio strategie přehled",
              href: "/portfolio-strategie",
              description: "Porovnejte všech 5 investičních strategií"
            },
            {
              title: "Investiční kalkulačka",
              href: "/kalkulacky/investicni-kalkulacka", 
              description: "Simulujte růst All-Weather portfolia"
            }
          ]}
          title="Související strategie a nástroje"
          className="mt-16"
        />

        {/* Social Sharing */}
        <SocialSharing 
          url="https://etfpruvodce.cz/tipy/all-weather-portfolio"
          title="All-Weather Portfolio podle Raya Dalia - Kompletní průvodce"
          description="Legendární strategie pro každé ekonomické prostředí. Krok za krokem návod s ETF fondy."
          shareTitle="Sdílejte All-Weather Portfolio strategii"
          shareText="Objevte legendární investiční strategii Ray Dalia!"
          className="mt-8"
        />
      </div>
    </Layout>
  );
}