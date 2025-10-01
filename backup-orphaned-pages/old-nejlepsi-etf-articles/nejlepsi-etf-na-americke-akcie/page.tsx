'use client';

import React from "react";
import Link from "next/link";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, DollarSign, Flag, Building, BarChart3, Star, ArrowRight, AlertTriangle } from 'lucide-react';
import BlogArticleLayout from "@/components/blog/BlogArticleLayout";
import FilteredETFList from "@/components/blog/FilteredETFList";
import { useETFArticleData } from "@/hooks/useETFArticleData";

const RECOMMENDED_US_ETFS_TEMPLATE = [
  {
    name: "iShares Core S&P 500 UCITS ETF",
    ticker: "CSPX",
    isin: "IE00B5BMR087",
    index: "S&P 500",
    reason: "Nejlevnější a nejlikvidnější cesta k americkému trhu. Zlatý standard pro USA expozici.",
    type: "S&P 500",
    rating: 5,
    category: "large-cap",
    pros: ["Nejnižší TER", "Obrovská likvidita", "500 největších US firem", "Ideální pro DCA"],
    cons: ["Koncentrace do top 10 firem", "Pouze large-cap", "Bez mid/small cap"],
    topHoldings: ["Apple (7.1%)", "Microsoft (6.8%)", "Amazon (3.4%)", "Nvidia (3.2%)", "Google (3.1%)"]
  },
  {
    name: "Vanguard S&P 500 UCITS ETF",
    ticker: "VUSA",
    isin: "IE00B3XXRP09",
    index: "S&P 500",
    reason: "Vanguard kvalita s identickou expozicí jako CSPX. Alternativa pro diverzifikaci brokerů.",
    type: "S&P 500",
    rating: 5,
    category: "large-cap",
    pros: ["Vanguard značka", "Identické výnosy s CSPX", "Distribučná verzia", "Vysoká likvidita"],
    cons: ["Identické riziko jako CSPX", "Pouze large-cap", "Bez dividend re-investování"]
  },
  {
    name: "iShares NASDAQ 100 UCITS ETF",
    ticker: "CNDX",
    isin: "IE00B53SZB19",
    index: "NASDAQ 100",
    reason: "Čistá technologická expozice. 100 největších non-finančních firem na NASDAQ.",
    type: "NASDAQ 100",
    rating: 4,
    category: "tech-growth",
    pros: ["Vysoké historické výnosy", "Tech koncentrace", "Růstové firmy", "Innovation exposure"],
    cons: ["Vyšší volatilita", "Sektorová koncentrace", "Vyšší TER", "Cyclical performance"],
    topHoldings: ["Apple (11.2%)", "Microsoft (10.8%)", "Amazon (6.1%)", "Nvidia (5.9%)", "Google (5.7%)"]
  },
  {
    name: "iShares MSCI USA UCITS ETF",
    ticker: "IUSA",
    isin: "IE00B3VVMM84",
    index: "MSCI USA",
    reason: "Širší pokrytí amerického trhu včetně mid-cap firem. Lepší diverzifikace než S&P 500.",
    type: "Celý trh USA",
    rating: 4,
    category: "broad-market",
    pros: ["Širší diverzifikace", "Mid-cap exposure", "Nízký TER", "MSCI kvalita"],
    cons: ["Nižší performance než S&P 500", "Méně známý index", "Lower liquidity"],
    topHoldings: ["Apple (6.8%)", "Microsoft (6.5%)", "Amazon (3.2%)", "Nvidia (3.0%)", "Google (2.9%)"]
  },
  {
    name: "SPDR S&P U.S. Dividend Aristocrats UCITS ETF",
    ticker: "UDVD",
    isin: "IE00B6YX5D40",
    index: "S&P Dividend Aristocrats",
    reason: "Americké firmy s 25+ lety nepřerušeného růstu dividend. Kvalita + příjem.",
    type: "Dividendové",
    rating: 4,
    category: "dividend",
    pros: ["Pravidelný příjem", "Kvalitní firmy", "Dividend growth", "Défensive charakteristiky"],
    cons: ["Vyšší TER", "Nižší růstový potenciál", "Sektor bias (utilities)", "Tax drag"],
    topHoldings: ["Walmart (6.8%)", "Johnson & Johnson (5.2%)", "Coca-Cola (4.9%)", "Procter & Gamble (4.1%)"]
  },
  {
    name: "Xtrackers MSCI USA Information Technology UCITS ETF",
    ticker: "XWT1",
    isin: "IE00BM67HM91",
    index: "MSCI USA IT",
    reason: "Čistá technologická expozice s širší diverzifikací než NASDAQ. AI, cloud, software.",
    type: "Technologie",
    rating: 3,
    category: "sector",
    pros: ["Nejvyšší růstový potenciál", "AI exposure", "Innovation leaders", "Secular growth"],
    cons: ["Extrémní volatilita", "Valuačné riziko", "Regulatory risks", "Koncentrované portfolio"],
    topHoldings: ["Apple (19.2%)", "Microsoft (18.1%)", "Nvidia (8.4%)", "Google (7.8%)", "Meta (4.2%)"]
  },
  {
    name: "Invesco EQQQ NASDAQ-100 UCITS ETF",
    ticker: "EQQQ",
    isin: "IE0032077012",
    index: "NASDAQ 100",
    reason: "Historicky první NASDAQ ETF v Evropě. Dlouhá track record a vysoká likvidita.",
    type: "NASDAQ 100",
    rating: 4,
    category: "tech-growth",
    pros: ["Nejdelšia história", "Vysoká likvidita", "Strong performance", "Established fund"],
    cons: ["Vyšší TER než CNDX", "Tech koncentrácia", "Volatilita", "Currency exposure"],
    topHoldings: ["Apple (11.2%)", "Microsoft (10.8%)", "Amazon (6.1%)", "Nvidia (5.9%)", "Google (5.7%)"]
  }
];

// Filtr pro americké ETF - největší fondy podle velikosti
const US_ETF_TABLE_FILTER = {
  top: 12,
  sortBy: "fund_size_numeric" as const,
  sortOrder: "desc" as const,
  regionKeywords: ["US"],
  minFundSize: 1, // Vyloučí ETF bez údaje o velikosti fondu
};

export default function NejlepsiETFNaAmerickeAkcie() {
  const { etfsWithData, isLoading } = useETFArticleData(RECOMMENDED_US_ETFS_TEMPLATE);
  const RECOMMENDED_US_ETFS = etfsWithData;
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'large-cap': 'bg-blue-100 text-blue-800',
      'broad-market': 'bg-green-100 text-green-800',
      'tech-growth': 'bg-purple-100 text-purple-800',
      'dividend': 'bg-orange-100 text-orange-800',
      'sector': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const coreETFs = RECOMMENDED_US_ETFS.sort((a, b) => b.rating - a.rating).slice(0, 3);
  const specializedETFs = RECOMMENDED_US_ETFS.filter(etf => etf.rating < 5);

  return (
    <BlogArticleLayout
      title="Nejlepší ETF na americké akcie"
      perex="Kompletní průvodce investováním do amerického akciového trhu. Srovnání S&P 500, celého amerického trhu a růstových akcií s praktickými tipy pro výběr."
      seoDescription="Nejlepší ETF na americké akcie 2025: S&P 500, NASDAQ, celý americký trh. Srovnání poplatků TER, výnosů a velikosti fondů. Kompletní průvodce pro české investory."
      readTime="10 min"
      difficulty="Začátečník" 
      category="Regionální"
    >
      {/* Úvod */}
      <div className="prose max-w-none mb-8">
        <p className="text-lg text-gray-700 leading-relaxed">
          USA představuje největší a nejlikvidnější akciový trh světa s historicky nejlepšími dlouhodobými výnosy. 
          Americké ETF vám umožní investovat do globálních lídrů jako Apple, Microsoft, Amazon a získat podíl na americkém růstu.
        </p>
      </div>

      {/* Proč USA */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">🇺🇸 Proč investovat do amerických akcií?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-blue-800">Dominance USA trhů:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">60% celosvětové tržní kapitalizace</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Domov největších globálních firem</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Historický průměr 10% ročně (S&P 500)</span>
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Nejnižší poplatky ETF (od 0.03%)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-blue-800">Klíčové indexy:</h3>
              <ul className="space-y-2 text-sm">
                <li>📊 <strong>S&P 500:</strong> 500 největších firem</li>
                <li>🚀 <strong>NASDAQ 100:</strong> 100 tech gigantů</li>
                <li>🏢 <strong>Dow Jones:</strong> 30 blue-chip firem</li>
                <li>🌍 <strong>Total Market:</strong> Celý americký trh</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TOP 3 ETF showcase */}
      <h2 className="text-3xl font-bold mb-8 text-gray-900">🏆 TOP 3 americké ETF fondy</h2>
      
      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        {coreETFs.map((etf, index) => (
          <Card key={etf.isin} className={`relative overflow-hidden ${
            index === 0 ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-white'
          }`}>
            {index === 0 && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-semibold">
                #1 VÝBĚR
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className={getCategoryColor(etf.category)}>
                  {etf.type}
                </Badge>
                <div className="flex items-center gap-1">
                  {getRatingStars(etf.rating)}
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{etf.name}</h3>
              <div className="text-2xl font-bold text-blue-600 mb-1">{etf.ticker}</div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">TER:</span>
                  <div className="font-semibold">{isLoading ? "Načítání..." : (etf.ter || "N/A")}</div>
                </div>
                <div>
                  <span className="text-gray-600">Velikost:</span>
                  <div className="font-semibold">{isLoading ? "Načítání..." : (etf.size || "N/A")}</div>
                </div>
                <div>
                  <span className="text-gray-600">Firmy:</span>
                  <div className="font-semibold">{etf.companies}</div>
                </div>
                <div>
                  <span className="text-gray-600">Historický výnos:</span>
                  <div className="font-semibold text-green-600">
                    {isLoading ? "Načítání..." : (etf.historicalReturn || "N/A")}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{etf.reason}</p>
              
              <Link href={`/etf/${etf.isin}`} className="block" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Detail fondu
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Všechny doporučené ETF */}
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Všechny doporučené americké ETF</h2>
      
      <div className="space-y-6 mb-12">
        {RECOMMENDED_US_ETFS.map((etf) => (
          <Card key={etf.isin} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getCategoryColor(etf.category)}>
                      {etf.type}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getRatingStars(etf.rating)}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{etf.name}</h3>
                  <div className="text-lg font-semibold text-blue-600 mb-2">{etf.ticker} • {etf.isin}</div>
                  
                  <p className="text-gray-700 mb-4">{etf.reason}</p>
                </div>
                
                <div className="lg:ml-6">
                  <Link href={`/etf/${etf.isin}`} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Detail fondu
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600 text-sm">TER</span>
                  <div className="font-semibold">{isLoading ? "Načítání..." : (etf.ter || "N/A")}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600 text-sm">Velikost</span>
                  <div className="font-semibold">{isLoading ? "Načítání..." : (etf.size || "N/A")}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600 text-sm">Počet firem</span>
                  <div className="font-semibold">{etf.companies}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600 text-sm">Historický výnos</span>
                  <div className="font-semibold text-green-600">
                    {isLoading ? "Načítání..." : (etf.historicalReturn || 'N/A')}
                  </div>
                </div>
              </div>
              
              {etf.pros && etf.cons && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">✅ Výhody:</h4>
                    <ul className="text-sm space-y-1">
                      {etf.pros.map((pro, idx) => (
                        <li key={idx}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">⚠️ Nevýhody:</h4>
                    <ul className="text-sm space-y-1">
                      {etf.cons.map((con, idx) => (
                        <li key={idx}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {etf.topHoldings && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold mb-2">🏢 Největší pozice:</h4>
                  <div className="flex flex-wrap gap-2">
                    {etf.topHoldings.map((holding, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {holding}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Výběrová kritéria */}
      <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-green-900">🎯 Naše výběrová kritéria</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800">Nízké poplatky (TER)</h3>
                  <p className="text-sm text-gray-700">Preferujeme ETF s ročním nákladem pod 0,15%</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800">Velikost fondu</h3>
                  <p className="text-sm text-gray-700">Čím větší fond, tím nižší riziko likvidace</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800">Dlouhodobá výkonnost</h3>
                  <p className="text-sm text-gray-700">Sledujeme minimálně 5letou historii výnosů</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800">Reputace správce</h3>
                  <p className="text-sm text-gray-700">BlackRock, Vanguard, Amundi - nejdůvěryhodnější společnosti</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800">Dostupnost v ČR</h3>
                  <p className="text-sm text-gray-700">Všechny ETF dostupné u DEGIRO, XTB, Trading212</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Další ETF tabulka */}
      <h2 className="text-3xl font-bold mb-4 text-gray-900">Další americké ETF fondy</h2>
      <p className="mb-6 text-gray-700">
        V tabulce najdete největší ETF fondy zaměřené na americký akciový trh seřazené podle velikosti spravovaných aktiv.
      </p>
      <FilteredETFList filter={US_ETF_TABLE_FILTER} />

      {/* Upozornění */}
      <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Důležité upozornění</h3>
              <p className="text-sm text-gray-700">
                Investování do ETF nese investiční riziko. Minulé výnosy nejsou zárukou výnosů budoucích. 
                Tento článek není individuálním investičním doporučením.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jak koupit ETF */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-900">📋 Jak koupit americké ETF krok za krokem</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li><strong>Vyberte vhodné ETF</strong> podle vaší strategie (S&P 500? NASDAQ? Dividendové?)</li>
            <li><strong>Ověřte si parametry</strong> - TER, velikost fondu a dostupnost u vašeho brokera</li>
            <li><strong>Otevřete účet</strong> u ověřených brokerů jako DEGIRO, XTB, Trading212</li>
            <li><strong>Najděte fond podle ISIN</strong> a zadejte pokyn k nákupu</li>
            <li><strong>Zvažte pravidelné investování</strong> pro snížení rizika špatného načasování</li>
          </ol>
        </CardContent>
      </Card>

      {/* FAQ */}
      <h2 className="text-3xl font-bold mb-6 text-gray-900">❓ Časté otázky</h2>
      
      <div className="space-y-4 mb-12">
        <details className="group bg-white border rounded-lg p-4">
          <summary className="font-semibold cursor-pointer text-gray-900 hover:text-blue-600">
            Které ETF je nejvhodnější na americké akcie?
          </summary>
          <div className="mt-3 text-gray-700">
            Pro většinu investorů je nejlepší{' '}
            <Link href="/etf/IE00B5BMR087" className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
              iShares Core S&P 500 (CSPX)
            </Link>
            , případně jeho ekvivalenty VUSA od Vanguard.
          </div>
        </details>

        <details className="group bg-white border rounded-lg p-4">
          <summary className="font-semibold cursor-pointer text-gray-900 hover:text-blue-600">
            Má smysl zvolit místo S&P 500 i ETF na NASDAQ 100?
          </summary>
          <div className="mt-3 text-gray-700">
            NASDAQ 100 obsahuje hlavně technologické firmy a může být vhodným doplňkem pro růstovější část portfolia. 
            Má však vyšší volatilitu a koncentraci do tech sektoru.
          </div>
        </details>

        <details className="group bg-white border rounded-lg p-4">
          <summary className="font-semibold cursor-pointer text-gray-900 hover:text-blue-600">
            Mohu nakoupit americká ETF z ČR?
          </summary>
          <div className="mt-3 text-gray-700">
            Ano, evropské verze amerických ETF jsou běžně dostupné u evropských brokerů (DEGIRO, XTB, Trading212 atd.).
          </div>
        </details>

        <details className="group bg-white border rounded-lg p-4">
          <summary className="font-semibold cursor-pointer text-gray-900 hover:text-blue-600">
            Jak zvolit měnu ETF (USD vs EUR)?
          </summary>
          <div className="mt-3 text-gray-700">
            Většina evropských ETF na americké akcie je dostupná v EUR i USD variantě. Pro dlouhodobé investování 
            není rozdíl zásadní. Důležitější jsou poplatky (TER), likvidita a šíře indexu.
          </div>
        </details>
      </div>

      {/* Závěr */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">🎯 Americké ETF pro vaše portfolio</h2>
          <p className="mb-6 opacity-90">
            Americké akciové ETF představují základ každého globálního portfolia. Nabízí stabilitu, 
            růstový potenciál a přístup k nejvýznamnějším firmám světa.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/srovnani-etf">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Prozkoumat ETF
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/srovnani-brokeru">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Vybrat brokera
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </BlogArticleLayout>
  );
}