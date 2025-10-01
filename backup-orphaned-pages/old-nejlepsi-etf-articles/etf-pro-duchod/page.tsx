import { Metadata } from 'next';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Shield, DollarSign, Target, AlertTriangle, Users, Briefcase, PiggyBank } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ETF pro důchod 2025 | Investiční strategie pro penze | ETF průvodce.cz',
  description: 'Kompletní průvodce investováním do ETF pro důchod. Nejlepší strategie, portfolio alokace podle věku a praktické tipy pro dlouhodobé spoření na penzi.',
  keywords: 'ETF pro důchod, investování na penzi, důchodové spoření, ETF strategie, portfolio pro důchod 2025',
  openGraph: {
    title: 'ETF pro důchod 2025 | Investiční strategie pro penze',
    description: 'Kompletní průvodce investováním do ETF pro důchod. Nejlepší strategie a portfolio alokace podle věku.',
    type: 'article',
    locale: 'cs_CZ',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'ETF pro důchod 2025 | Investiční strategie pro penze',
  description: 'Kompletní průvodce investováním do ETF pro důchod. Nejlepší strategie, portfolio alokace podle věku a praktické tipy.',
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
    '@id': 'https://www.etfpruvodce.cz/tipy/etf-pro-duchod'
  }
};

export default function ETFProDuchodPage() {
  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <nav className="text-sm text-gray-600 mb-4">
            <span>Domů</span> → <span>Tipy</span> → <span className="text-gray-900">ETF pro důchod</span>
          </nav>
        </div>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ETF pro důchod: Investiční strategie pro bezstarostnou penzi
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Objevte, jak investovat do ETF fondů pro zajištění finančně bezstarostného důchodu. 
            Praktické strategie, portfolio alokace podle věku a nejlepší ETF pro dlouhodobé spoření.
          </p>
        </header>

        {/* Proč ETF pro důchod */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-blue-600" />
              Proč jsou ETF ideální pro důchodové spoření?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold">Nízké náklady</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Poplatky 0,05-0,75% ročně vs 2-3% u aktivních fondů. 
                  Za 30 let ušetříte stovky tisíc korun.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold">Dlouhodobý růst</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Historicky akcie rostou 7-10% ročně. 
                  Díky složenému úročení z malých částek vyrostou miliony.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold">Transparentnost</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Víte přesně, do čeho investujete. 
                  Žádné skryté poplatky ani překvapení.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Výzva důchodového systému */}
        <Card className="mb-8 border-orange-200">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-800">Realita českého důchodového systému</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-red-600">Současný stav:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Průměrný starobní důchod: ~18 000 Kč/měsíc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Náhradní poměr: pouze 50-60% čistého příjmu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Demografická krize: stárnutí populace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Inflace snižuje kupní sílu důchodu</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-green-600">Řešení pomocí ETF:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>Vytvoření dodatečného příjmu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>Ochrana proti inflaci</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>Nezávislost na státním systému</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>Kontrola nad vlastními financemi</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alokace podle věku */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Portfolio alokace podle věku</CardTitle>
            <CardDescription>
              Jak měnit rozložení investic s přibývajícím věkem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4">
                {/* 20-30 let */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-green-800">20-30 let: Agresivní růst</h4>
                    <Badge className="bg-green-600">40+ let do důchodu</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm mb-2"><strong>Doporučená alokace:</strong></div>
                      <div className="text-sm space-y-1">
                        <div>• 90% akcie (VWCE)</div>
                        <div>• 10% dluhopisy (AGGH)</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2"><strong>Strategie:</strong></div>
                      <div className="text-sm space-y-1">
                        <div>• Maximální růstový potenciál</div>
                        <div>• Pravidelné měsíční investice</div>
                        <div>• Ignorovat krátkodobé výkyvy</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 30-40 let */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-blue-800">30-40 let: Stabilní růst</h4>
                    <Badge className="bg-blue-600">25-35 let do důchodu</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm mb-2"><strong>Doporučená alokace:</strong></div>
                      <div className="text-sm space-y-1">
                        <div>• 80% akcie (VWCE)</div>
                        <div>• 20% dluhopisy (AGGH)</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2"><strong>Strategie:</strong></div>
                      <div className="text-sm space-y-1">
                        <div>• Stále růstově orientované</div>
                        <div>• Zvýšení příspěvků s platem</div>
                        <div>• První rebalancování</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 40-50 let */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-purple-800">40-50 let: Vyvážený přístup</h4>
                    <Badge className="bg-purple-600">15-25 let do důchodu</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm mb-2"><strong>Doporučená alokace:</strong></div>
                      <div className="text-sm space-y-1">
                        <div>• 70% akcie (VWCE)</div>
                        <div>• 30% dluhopisy (AGGH)</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2"><strong>Strategie:</strong></div>
                      <div className="text-sm space-y-1">
                        <div>• Postupné snižování rizika</div>
                        <div>• Maximalizace příspěvků</div>
                        <div>• Pravidelný rebalancing</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 50-60 let */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-orange-800">50-60 let: Konzervativnější</h4>
                    <Badge className="bg-orange-600">5-15 let do důchodu</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm mb-2"><strong>Doporučená alokace:</strong></div>
                      <div className="text-sm space-y-1">
                        <div>• 60% akcie (VWCE)</div>
                        <div>• 40% dluhopisy (AGGH)</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2"><strong>Strategie:</strong></div>
                      <div className="text-sm space-y-1">
                        <div>• Ochrana proti volatilitě</div>
                        <div>• Příprava na důchod</div>
                        <div>• Čtvrtletní rebalancing</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 60+ let */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-800">60+ let: Výběr důchodu</h4>
                    <Badge className="bg-gray-600">V důchodu</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm mb-2"><strong>Doporučená alokace:</strong></div>
                      <div className="text-sm space-y-1">
                        <div>• 40% akcie (VWCE)</div>
                        <div>• 60% dluhopisy (AGGH)</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2"><strong>Strategie:</strong></div>
                      <div className="text-sm space-y-1">
                        <div>• Pravidelný výběr dividend</div>
                        <div>• Ochrana kapitálu</div>
                        <div>• 4% pravidlo</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nejlepší ETF pro důchod */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nejlepší ETF pro důchodové spoření</CardTitle>
            <CardDescription>
              Doporučené ETF fondy pro různé fáze spoření na důchod
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">Akciové ETF (růstová část portfolia)</h4>
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium text-sm text-blue-600">VWCE</div>
                        <div className="text-xs text-gray-600 mb-1">Vanguard FTSE All-World</div>
                        <div className="text-xs">
                          <div>• TER: 0,22%</div>
                          <div>• 4000+ akcií světa</div>
                          <div>• Nejoblíbenější volba</div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium text-sm text-blue-600">IWDA + EMIM</div>
                        <div className="text-xs text-gray-600 mb-1">Rozvinuté + rozvíjející se trhy</div>
                        <div className="text-xs">
                          <div>• TER: 0,20% + 0,18%</div>
                          <div>• Lepší diverzifikace</div>
                          <div>• Více práce s rebalancingem</div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium text-sm text-blue-600">SPYI</div>
                        <div className="text-xs text-gray-600 mb-1">SPDR MSCI World</div>
                        <div className="text-xs">
                          <div>• TER: 0,12%</div>
                          <div>• Pouze rozvinuté trhy</div>
                          <div>• Nejnižší poplatky</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3">Dluhopisové ETF (stabilní část portfolia)</h4>
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium text-sm text-green-600">AGGH</div>
                        <div className="text-xs text-gray-600 mb-1">Globální dluhopisy zajišt.</div>
                        <div className="text-xs">
                          <div>• TER: 0,10%</div>
                          <div>• Zajištěno proti měně</div>
                          <div>• Široká diverzifikace</div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium text-sm text-green-600">IGLO</div>
                        <div className="text-xs text-gray-600 mb-1">Globální státní dluhopisy</div>
                        <div className="text-xs">
                          <div>• TER: 0,20%</div>
                          <div>• Vysoce kvalitní dluhopisy</div>
                          <div>• Stabilní výnosy</div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded border">
                        <div className="font-medium text-sm text-green-600">IBGS</div>
                        <div className="text-xs text-gray-600 mb-1">Německé státní dluhopisy</div>
                        <div className="text-xs">
                          <div>• TER: 0,09%</div>
                          <div>• Nejbezpečnější volba</div>
                          <div>• Nízké výnosy</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategii výběru v důchodu */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Strategie výběru peněz v důchodu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">4% pravidlo</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Princip:</strong> Vybírejte max. 4% z celkové hodnoty portfolia ročně</p>
                    <p><strong>Příklad:</strong> Portfolio 5 mil. Kč = max. 200k Kč ročně (16,7k měsíčně)</p>
                    <p><strong>Výhody:</strong> Portfolio vydrží 30+ let, ochrana proti inflaci</p>
                  </div>
                  <div className="mt-3 p-2 bg-white rounded text-xs">
                    <strong>Výpočet:</strong> 5 000 000 × 4% = 200 000 Kč/rok
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">Výběr dividend</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Princip:</strong> Vybírejte pouze dividendy, nechte kapitál růst</p>
                    <p><strong>Výnos:</strong> ~2-3% ročně z akciových ETF</p>
                    <p><strong>Výhody:</strong> Nenarušujete kapitál, výnosy rostou s inflací</p>
                  </div>
                  <div className="mt-3 p-2 bg-white rounded text-xs">
                    <strong>Výpočet:</strong> 5 000 000 × 2,5% = 125 000 Kč/rok
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">Kombinovaná strategie (doporučeno)</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>1. Základní příjem z dividend:</strong></p>
                    <p>Vybírejte dividendy z celého portfolia (2-3% ročně)</p>
                  </div>
                  <div>
                    <p><strong>2. Doplňkový výběr z dluhopisů:</strong></p>
                    <p>Při potřebě vybírejte další peníze pouze z dluhopisové části</p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-white rounded text-sm">
                  <strong>Výsledek:</strong> Udržíte růstový potenciál akcií, ale máte pravidelný příjem
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Praktický příklad spoření */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Praktický příklad: Spoření na důchod</CardTitle>
            <CardDescription>
              25letý investor, měsíční příspěvek 10 000 Kč, důchod v 65 letech
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">Parametry investice</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div><strong>Věk začátku:</strong> 25 let</div>
                      <div><strong>Věk důchodu:</strong> 65 let</div>
                      <div><strong>Doba investování:</strong> 40 let</div>
                    </div>
                    <div className="space-y-1">
                      <div><strong>Měsíční příspěvek:</strong> 10 000 Kč</div>
                      <div><strong>Ročně:</strong> 120 000 Kč</div>
                      <div><strong>Očekávaný výnos:</strong> 7% ročně</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-3xl font-bold text-green-600 mb-2">26,1 mil. Kč</div>
                    <div className="text-sm text-gray-600">Celkové portfolio v důchodu</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">4,8 mil. Kč</div>
                    <div className="text-sm text-gray-600">Celkové příspěvky za 40 let</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-2">21,3 mil. Kč</div>
                    <div className="text-sm text-gray-600">Zisk z investování</div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-3">Měsíční příjem v důchodu</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-center">
                    <div>
                      <div className="font-bold text-lg text-orange-700">87 000 Kč</div>
                      <div>4% pravidlo (max. udržitelné)</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-orange-700">54 000 Kč</div>
                      <div>Pouze z dividend (2,5%)</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-orange-700">70 000 Kč</div>
                      <div>Kombinovaná strategie</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-orange-600 text-center">
                    Pro srovnání: průměrný důchod v ČR je ~18 000 Kč/měsíc
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daňové aspekty */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Daňové aspekty ETF pro důchod</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-600">Během spoření:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-green-500 mt-1" />
                      <span>Dividendy: daň 15% (automaticky stržena)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-green-500 mt-1" />
                      <span>Kapitálové zisky: žádná daň při držení</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-green-500 mt-1" />
                      <span>Reinvestice dividend: automatické</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-green-500 mt-1" />
                      <span>Rebalancing: daň při prodeji se ziskem</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-orange-600">V důchodu:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-1" />
                      <span>Prodej ETF: 15% daň z kapitálového zisku</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-green-500 mt-1" />
                      <span>Dividendy: stále zdaněny 15%</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-green-500 mt-1" />
                      <span>Slevy: důchodce má vyšší slevy</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-green-500 mt-1" />
                      <span>Strategie: postupný prodej minimalizuje daně</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Daňová optimalizace:</h4>
                    <div className="text-sm text-yellow-700 mt-1">
                      V důchodu prodávejte ETF postupně po menších částech, abyste nevyčerpali daňové slevy. 
                      Důchodci mají vyšší slevy na dani, které mohou částečně pokrýt kapitálové zisky.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chyby, kterým se vyhnout */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Časté chyby při spoření na důchod</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-red-600">❌ Chyby, kterým se vyhnout:</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="font-medium text-sm text-red-800">Příliš pozdní začátek</div>
                    <div className="text-xs text-red-600">Každý rok čekání vás stojí statisíce korun</div>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="font-medium text-sm text-red-800">Přerušování investic</div>
                    <div className="text-xs text-red-600">V krizi je nejdůležitější pokračovat</div>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="font-medium text-sm text-red-800">Příliš konzervativní přístup</div>
                    <div className="text-xs text-red-600">Mladí lidé potřebují více akcií</div>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="font-medium text-sm text-red-800">Panické rozhodování</div>
                    <div className="text-xs text-red-600">Časování trhu nefunguje</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-green-600">✅ Správný přístup:</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-medium text-sm text-green-800">Začít co nejdříve</div>
                    <div className="text-xs text-green-600">I 1000 Kč měsíčně je lepší než nic</div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-medium text-sm text-green-800">Pravidelnost</div>
                    <div className="text-xs text-green-600">Automatické investice každý měsíc</div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-medium text-sm text-green-800">Zvyšování příspěvků</div>
                    <div className="text-xs text-green-600">S rostoucím platem i investice</div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-medium text-sm text-green-800">Dlouhodobé myšlení</div>
                    <div className="text-xs text-green-600">40 let je dlouhá doba</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kroky k zahájení */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Jak začít spořit na důchod pomocí ETF</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Stanovte cíl</h4>
                    <p className="text-sm text-blue-700">
                      Kolik budete potřebovat v důchodu? Obecně 70-80% současného příjmu.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-green-800">Vyberte brokera</h4>
                    <p className="text-sm text-green-700">
                      XTB nebo IBKR nabízí ETF bez poplatků. Založte si účet.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Vyberte ETF</h4>
                    <p className="text-sm text-purple-700">
                      Začněte s VWCE (90%) + AGGH (10%) a postupně měňte alokaci.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-orange-800">Automatizujte</h4>
                    <p className="text-sm text-orange-700">
                      Nastavte pravidelné převody a investice. Disciplína je klíčová.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg">
                  <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <h4 className="font-semibold text-red-800">Sledujte a upravujte</h4>
                    <p className="text-sm text-red-700">
                      Každých 6 měsíců zkontrolujte alokaci a podle věku upravte.
                    </p>
                  </div>
                </div>
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
                <h4 className="font-semibold mb-2">Kolik procent příjmu bych měl investovat?</h4>
                <p className="text-sm text-gray-600">
                  Ideálně 10-20% čistého příjmu. Pokud nemůžete, začněte i s 5%. 
                  Důležité je začít a postupně zvyšovat s rostoucím platem.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold mb-2">Co když mi investice klesnou těsně před důchodem?</h4>
                <p className="text-sm text-gray-600">
                  Proto postupně snižujeme podíl akcií s věkem. 5-10 let před důchodem 
                  mějte 40-60% v dluhopisech, které jsou stabilnější.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold mb-2">Můžu počítat s inflací?</h4>
                <p className="text-sm text-gray-600">
                  Akcie dlouhodobě rostou rychleji než inflace (7% vs 3%). 
                  ETF tedy chrání před inflací lépe než spořicí účty nebo dluhopisy.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Co když budu potřebovat peníze dříve?</h4>
                <p className="text-sm text-gray-600">
                  Důchodové úspory nechte v ETF. Pro nouzové situace mějte oddělenou rezervu 
                  na spořicím účtu (3-6 měsíčních výdajů).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Závěr */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Shrnutí: ETF jako cesta k bezstarostné penzi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                ETF fondy jsou nejefektivnější způsob, jak si zajistit dostatečný příjem v důchodu. 
                Kombinace nízkých poplatků, dlouhodobého růstu a flexibility z nich dělá ideální nástroj 
                pro důchodové spoření.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Klíčové přínosy:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Náklady 5-10x nižší než u aktivních fondů</li>
                    <li>• Historicky 7-10% růst ročně</li>
                    <li>• Automatická diverzifikace</li>
                    <li>• Ochrana proti inflaci</li>
                    <li>• Flexibilita a likvidita</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Zlatá pravidla:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Začněte co nejdříve</li>
                    <li>• Investujte pravidelně</li>
                    <li>• Snižujte riziko s věkem</li>
                    <li>• Nepřerušujte v krizích</li>
                    <li>• Používejte 4% pravidlo v důchodu</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Pamatujte:</strong> Důchod není cíl, ale nová životní etapa. ETF vám pomohou 
                  zajistit finanční svobodu, abyste ji mohli prožít podle svých představ. 
                  Nezávislejte pouze na státním důchodu - vezměte svou budoucnost do vlastních rukou.
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
                <a href="/kalkulacky/investicni-kalkulacka" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-blue-600">Investiční kalkulačka</h4>
                  <p className="text-sm text-gray-600">Spočítejte si důchodové spoření</p>
                </a>
                <a href="/tipy/nejlepsi-etf-2025" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-blue-600">Nejlepší ETF fondy 2025</h4>
                  <p className="text-sm text-gray-600">Doporučené ETF pro důchod</p>
                </a>
              </div>
              <div className="space-y-2">
                <a href="/tipy/rebalancing-portfolia" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-blue-600">Rebalancing portfolia</h4>
                  <p className="text-sm text-gray-600">Jak udržovat správnou alokaci</p>
                </a>
                <a href="/portfolio-strategie/permanentni-portfolio" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-blue-600">Permanentní Portfolio</h4>
                  <p className="text-sm text-gray-600">Konzervativní strategie pro důchod</p>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}