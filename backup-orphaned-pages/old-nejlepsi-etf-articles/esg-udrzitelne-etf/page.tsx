import { Metadata } from 'next';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Shield, TrendingUp, Users, Factory, Zap, AlertTriangle, CheckCircle, Globe, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ESG a udržitelné ETF 2025 | Průvodce odpovědným investováním | ETF průvodce.cz',
  description: 'Kompletní průvodce ESG a udržitelnými ETF fondy. Zjistěte, jak investovat odpovědně s ohledem na životní prostředí, společnost a správu firem.',
  keywords: 'ESG ETF, udržitelné ETF, odpovědné investování, environmentální ETF, sociálně odpovědné investování 2025',
  openGraph: {
    title: 'ESG a udržitelné ETF 2025 | Průvodce odpovědným investováním',
    description: 'Kompletní průvodce ESG a udržitelnými ETF fondy. Jak investovat odpovědně s ohledem na životní prostředí a společnost.',
    type: 'article',
    locale: 'cs_CZ',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'ESG a udržitelné ETF 2025 | Průvodce odpovědným investováním',
  description: 'Kompletní průvodce ESG a udržitelnými ETF fondy. Zjistěte, jak investovat odpovědně s ohledem na životní prostředí, společnost a správu firem.',
  author: {
    '@type': 'Organization',
    name: 'ETF průvodce.cz'
  },
  publisher: {
    '@type': 'Organization',
    name: 'ETF průvodce.cz'
  },
  datePublished: '2025-01-15',
  dateModified: '2025-01-15',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.etfpruvodce.cz/tipy/esg-udrzitelne-etf'
  }
};

export default function ESGUdrzitelneETFPage() {
  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <nav className="text-sm text-gray-600 mb-4">
            <span>Domů</span> → <span>Tipy</span> → <span className="text-gray-900">ESG a udržitelné ETF</span>
          </nav>
        </div>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ESG a udržitelné ETF: Průvodce odpovědným investováním
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Objevte, jak investovat do společností, které respektují životní prostředí, společenskou odpovědnost 
            a dobré firemní řízení. Kompletní průvodce ESG ETF fondy pro rok 2025.
          </p>
        </header>

        {/* Co je ESG */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Co je ESG investování?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-gray-700">
                ESG je zkratka pro Environmental, Social, and Governance - tedy životní prostředí, 
                společenská odpovědnost a správa firem. ESG investování znamená výběr společností, 
                které dosahují vysokých standardů v těchto třech oblastech.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-600">Environmental (E)</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Snižování emisí CO₂</li>
                    <li>• Obnovitelné zdroje energie</li>
                    <li>• Efektivní využití zdrojů</li>
                    <li>• Ochrana biodiverzity</li>
                    <li>• Nakládání s odpady</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-600">Social (S)</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Pracovní podmínky</li>
                    <li>• Diverzita a inkluze</li>
                    <li>• Bezpečnost práce</li>
                    <li>• Vztahy se zákazníky</li>
                    <li>• Podpora komunity</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-600">Governance (G)</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Transparentnost řízení</li>
                    <li>• Nezávislost představenstva</li>
                    <li>• Etické podnikání</li>
                    <li>• Boj proti korupci</li>
                    <li>• Akcionářská práva</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Růst ESG investování */}
        <Card className="mb-8 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800">Růst ESG investování</CardTitle>
            <CardDescription>
              ESG investování zažívá nebývalý boom
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">35 bil. $</div>
                <div className="text-sm text-gray-600">Globální ESG aktiva 2024</div>
              </div>
              
              <div className="text-center p-4 bg-blue-100 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">25%</div>
                <div className="text-sm text-gray-600">Roční růst ESG ETF</div>
              </div>
              
              <div className="text-center p-4 bg-purple-100 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">83%</div>
                <div className="text-sm text-gray-600">Millennials preferuje ESG</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Trend:</strong> ESG není jen módní vlna. Společnosti s lepším ESG skóre často 
                vykazují stabilnější výkonnost, nižší riziko a lepší dlouhodobé výnosy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Typy ESG ETF */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Typy ESG a udržitelných ETF</CardTitle>
            <CardDescription>
              Různé přístupy k odpovědnému investování
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">ESG Screened ETF</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Vylučují společnosti s špatným ESG hodnocením nebo kontroverzní sektory.
                  </p>
                  <div className="text-xs text-green-600">
                    <strong>Příklad:</strong> VWCE ESG, IWDA ESG - vyloučeny tabák, zbraně, hazard
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">ESG Leaders ETF</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Investují pouze do společností s nejlepším ESG hodnocením v rámci sektorů.
                  </p>
                  <div className="text-xs text-blue-600">
                    <strong>Příklad:</strong> MSCI World ESG Leaders - top ESG společnosti z každého sektoru
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-800">Tematické ETF</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Zaměřují se na konkrétní udržitelná témata nebo technologie.
                  </p>
                  <div className="text-xs text-purple-600">
                    <strong>Příklad:</strong> Clean Energy ETF, Water ETF, Circular Economy ETF
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold text-orange-800">Impact ETF</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Aktivně směřují kapitál k řešení konkrétních společenských nebo environmentálních problémů.
                  </p>
                  <div className="text-xs text-orange-600">
                    <strong>Příklad:</strong> Green Bonds ETF, Social Impact ETF
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nejlepší ESG ETF */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nejlepší ESG ETF fondy 2025</CardTitle>
            <CardDescription>
              Doporučené ESG ETF s nejlepším poměrem ceny a výkonu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Globální ESG ETF */}
              <div>
                <h4 className="font-semibold text-blue-600 mb-4">🌍 Globální ESG ETF</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-semibold">ETF</th>
                        <th className="text-left p-4 font-semibold">TER</th>
                        <th className="text-left p-4 font-semibold">Velikost</th>
                        <th className="text-left p-4 font-semibold">ESG přístup</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-green-600">SUSW</div>
                            <div className="text-xs text-gray-600">iShares MSCI World ESG Screened</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-green-100 text-green-800 border-green-300">0,20%</Badge>
                        </td>
                        <td className="p-4 text-sm">8,2 mld. €</td>
                        <td className="p-4 text-sm">Screening + vyloučení</td>
                      </tr>
                      <tr>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-green-600">VWRL</div>
                            <div className="text-xs text-gray-600">Vanguard ESG Global All Cap</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-green-100 text-green-800 border-green-300">0,24%</Badge>
                        </td>
                        <td className="p-4 text-sm">2,1 mld. €</td>
                        <td className="p-4 text-sm">ESG screening</td>
                      </tr>
                      <tr>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-green-600">ESGW</div>
                            <div className="text-xs text-gray-600">Xtrackers MSCI World ESG</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-green-100 text-green-800 border-green-300">0,20%</Badge>
                        </td>
                        <td className="p-4 text-sm">1,8 mld. €</td>
                        <td className="p-4 text-sm">ESG leaders</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tematické ESG ETF */}
              <div>
                <h4 className="font-semibold text-green-600 mb-4">🌱 Tematické ESG ETF</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-semibold">Téma</th>
                        <th className="text-left p-4 font-semibold">ETF</th>
                        <th className="text-left p-4 font-semibold">TER</th>
                        <th className="text-left p-4 font-semibold">Velikost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-4 font-medium text-green-600">Čistá energie</td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-blue-600">IQQH</div>
                            <div className="text-xs text-gray-600">iShares Global Clean Energy</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">0,65%</Badge>
                        </td>
                        <td className="p-4 text-sm">6,1 mld. €</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-blue-600">Voda</td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-blue-600">IH2O</div>
                            <div className="text-xs text-gray-600">iShares Global Water</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">0,65%</Badge>
                        </td>
                        <td className="p-4 text-sm">2,8 mld. €</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-purple-600">Cirkulární ekonomika</td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-blue-600">CIRC</div>
                            <div className="text-xs text-gray-600">SPDR MSCI ACWI IMI Circular Economy</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">0,45%</Badge>
                        </td>
                        <td className="p-4 text-sm">180 mil. €</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ESG vs tradiční ETF výkonnost */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ESG ETF vs tradiční ETF: Výkonnost a náklady</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-600">✅ Výhody ESG ETF:</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span className="text-sm">Často lepší dlouhodobá výkonnost</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span className="text-sm">Nižší volatilita a riziko</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span className="text-sm">Investice v souladu s hodnotami</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span className="text-sm">Pozitivní dopad na společnost</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-red-600">⚠️ Možné nevýhody:</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-1" />
                      <span className="text-sm">Vyšší TER poplatky (0,20-0,65%)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-1" />
                      <span className="text-sm">Menší diverzifikace (vyloučené sektory)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-1" />
                      <span className="text-sm">ESG kritéria se mohou lišit</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-1" />
                      <span className="text-sm">Riziko "greenwashingu"</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Srovnání výkonnosti (5 let)</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-bold">VWCE (tradiční)</div>
                    <div>Roční výnos: 8,2%</div>
                    <div>TER: 0,22%</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-600">SUSW (ESG)</div>
                    <div>Roční výnos: 8,1%</div>
                    <div>TER: 0,20%</div>
                  </div>
                  <div className="text-xs text-blue-600 self-center">
                    Rozdíl: prakticky zanedbatelný
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jak vybrat ESG ETF */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Jak vybrat správný ESG ETF</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-green-800">Definujte své ESG priority</h4>
                    <p className="text-sm text-green-700">
                      Co je pro vás nejdůležitější? Klima, sociální spravedlnost, nebo etické řízení?
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Zkontrolujte ESG metodiku</h4>
                    <p className="text-sm text-blue-700">
                      MSCI ESG, Sustainalytics, nebo FTSE4Good? Každý má jiná kritéria.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Porovnejte výloučené sektory</h4>
                    <p className="text-sm text-purple-700">
                      Tabák, alkohol, zbraně, jaderná energie - co konkrétně se vylučuje?
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-orange-800">Vyhodnoťte náklady vs. přínos</h4>
                    <p className="text-sm text-orange-700">
                      Jsem ochoten platit vyšší TER za soulad s mými hodnotami?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ESG hodnocení společností */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Jak se hodnotí ESG společností</CardTitle>
            <CardDescription>
              Nejpoužívanější ESG hodnotící systémy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3">MSCI ESG Ratings</h4>
                  <div className="space-y-2 text-sm">
                    <div>Škála: AAA až CCC</div>
                    <div className="text-xs text-gray-600">
                      AAA = nejlepší ESG, CCC = nejhorší ESG
                    </div>
                    <div className="text-xs">
                      <strong>Používá:</strong> většina globálních ESG ETF
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">Sustainalytics ESG</h4>
                  <div className="space-y-2 text-sm">
                    <div>Škála: 0-100 bodů</div>
                    <div className="text-xs text-gray-600">
                      0-20 = nízké riziko, 40+ = vysoké riziko
                    </div>
                    <div className="text-xs">
                      <strong>Používá:</strong> Vanguard ESG ETF
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">FTSE4Good</h4>
                  <div className="space-y-2 text-sm">
                    <div>Škála: 0-5 bodů</div>
                    <div className="text-xs text-gray-600">
                      5 = vynikající ESG
                    </div>
                    <div className="text-xs">
                      <strong>Používá:</strong> některé evropské ETF
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Pozor na rozdíly v hodnocení</h4>
                    <p className="text-sm text-yellow-700">
                      Stejná společnost může mít různá ESG hodnocení u různých agentur. 
                      Tesla například má u MSCI nízké ESG skóre, ale u jiných agentur vysoké.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ESG portfolio strategie */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ESG portfolio strategie</CardTitle>
            <CardDescription>
              Jak začlenit ESG investice do portfolia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3">100% ESG portfolio</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>SUSW (ESG svět)</span>
                      <span className="font-medium">80%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ESG dluhopisy</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="mt-2 text-xs text-green-600">
                      ✅ Plný soulad s hodnotami<br/>
                      ⚠️ Vyšší náklady, menší diverzifikace
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">Core-Satellite ESG</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>VWCE (tradiční jádro)</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IQQH (clean energy)</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dluhopisy</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="mt-2 text-xs text-blue-600">
                      ✅ Vyvážené náklady a hodnoty<br/>
                      ✅ Tematické investice v menší části
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">Postupný přechod</h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-700">Rok 1: 100% VWCE</div>
                    <div className="text-gray-700">Rok 2: 70% VWCE + 30% SUSW</div>
                    <div className="text-gray-700">Rok 3: 50% VWCE + 50% SUSW</div>
                    <div className="text-gray-700">Rok 4+: 100% SUSW</div>
                    <div className="mt-2 text-xs text-purple-600">
                      ✅ Postupné snižování nákladů přechodu<br/>
                      ✅ Čas na vyhodnocení ESG výkonnosti
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Greenwashing */}
        <Card className="mb-8 border-orange-200">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-800">Pozor na greenwashing!</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-gray-700">
                Greenwashing je praxe, kdy společnosti nebo fondy prezentují své produkty 
                jako udržitelnější, než ve skutečnosti jsou. Jak se vyhnout této pasti?
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-600">🚨 Varovné signály:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                      <span>Vágní ESG terminologie bez konkrétních dat</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                      <span>Název obsahuje "ESG", ale portfolio má pochybné firmy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                      <span>Žádné jasné ESG kritéria nebo metodika</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                      <span>Marketing zdůrazňuje "zelené" více než fakta</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600">✅ Jak se chránit:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Čtěte fact sheet a prospekt fondu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Zkontrolujte top 10 holdings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Ověřte ESG metodiku (MSCI, Sustainalytics)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Porovnejte s podobnými fondy</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budoucnost ESG */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Budoucnost ESG investování</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Factory className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold">Regulace</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    EU zavádí SFDR regulaci, která nutí fondy jasně kategorizovat 
                    své ESG přístupy.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold">Výkonnost</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Studie ukazují, že ESG společnosti mají často stabilnější 
                    výnosy a nižší riziko.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold">Generační změna</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Mladší investoři preferují udržitelné investice, 
                    což zvyšuje poptávku po ESG ETF.
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🔮 Trendy na rok 2025</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Více levných ESG ETF díky konkurenci</li>
                  <li>• Lepší transparentnost a standardizace ESG kritérií</li>
                  <li>• Růst tematických ETF (klima, cirkulární ekonomika)</li>
                  <li>• Integration AI do ESG hodnocení společností</li>
                  <li>• Emphasis na "just transition" - spravedlivý přechod k udržitelnosti</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Časté otázky */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Často kladené otázky</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold mb-2">Mají ESG ETF horší výnosy než tradiční ETF?</h4>
                <p className="text-sm text-gray-600">
                  Ne, studie ukazují, že ESG ETF mají podobné nebo dokonce lepší dlouhodobé výnosy. 
                  Společnosti s dobrým ESG často lépe řídí rizika a mají stabilnější výsledky.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold mb-2">Kolik stojí ESG ETF oproti klasickým?</h4>
                <p className="text-sm text-gray-600">
                  ESG ETF mají TER obvykle 0,20-0,65%, zatímco tradiční ETF 0,07-0,22%. 
                  Rozdíl se však snižuje díky rostoucí konkurenci.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold mb-2">Můžu skutečně ovlivnit změnu investováním do ESG?</h4>
                <p className="text-sm text-gray-600">
                  Ano, rostoucí poptávka po ESG investicích nutí společnosti zlepšovat své praktiky. 
                  Navíc ESG fondy často aktivně hlasují na valných hromadách za udržitelné změny.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Jak poznám skutečný ESG ETF od greenwashingu?</h4>
                <p className="text-sm text-gray-600">
                  Zkontrolujte konkrétní ESG metodiku, top holdings a exclusions. 
                  Skutečný ESG ETF má jasná kritéria a vyloučené kontroverzní sektory.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Závěr */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Shrnutí: ESG investování jako cesta k udržitelné budoucnosti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                ESG investování není jen módní trend, ale zásadní změna ve způsobu, 
                jak uvažujeme o investicích. Umožňuje vám zhodnocovat peníze způsobem, 
                který je v souladu s vašimi hodnotami a přispívá k lepší budoucnosti.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-800">Pro planetu</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Podpora společností, které aktivně snižují svůj environmentální dopad
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">Pro společnost</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Investice do firem s odpovědnými pracovními praktikami a sociálním dopadem
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-purple-800">Pro výnosy</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    ESG společnosti často vykazují stabilnější a dlouhodobě lepší výsledky
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Doporučení:</strong> Začněte s jedním kvalitním ESG ETF jako je SUSW 
                  a postupně rozšiřte o tematické ETF podle svých priorit. 
                  Pamatujte, že i malé změny v investičním chování mohou mít velký dopad na budoucnost.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Související odkazy */}
        <Card>
          <CardHeader>
            <CardTitle>Související články</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <a href="/tipy/nejlepsi-etf-2025" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-blue-600">Nejlepší ETF fondy 2025</h4>
                  <p className="text-sm text-gray-600">Srovnání klasických a ESG ETF</p>
                </a>
                <a href="/tipy/nejlevnejsi-etf-fondy" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-blue-600">Nejlevnější ETF fondy</h4>
                  <p className="text-sm text-gray-600">Porovnání nákladů ESG vs tradičních ETF</p>
                </a>
              </div>
              <div className="space-y-2">
                <a href="/portfolio-strategie/ray-dalio-all-weather" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-blue-600">All Weather Portfolio</h4>
                  <p className="text-sm text-gray-600">Jak začlenit ESG do diverzifikované strategie</p>
                </a>
                <a href="/tipy/jak-zacit-investovat-do-etf" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-blue-600">Jak začít investovat</h4>
                  <p className="text-sm text-gray-600">První kroky s ESG investováním</p>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}