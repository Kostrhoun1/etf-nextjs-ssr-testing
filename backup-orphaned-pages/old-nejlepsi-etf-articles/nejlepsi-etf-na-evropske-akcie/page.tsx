'use client';

import React from "react";
import Link from "next/link";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, DollarSign, Map, Building, BarChart3, Star, ArrowRight, AlertTriangle, Globe, Euro, Flag } from 'lucide-react';
import BlogArticleLayout from "@/components/blog/BlogArticleLayout";
import FilteredETFList from "@/components/blog/FilteredETFList";
import { useETFArticleData } from "@/hooks/useETFArticleData";

const RECOMMENDED_EU_ETFS_TEMPLATE = [
  {
    name: "iShares Core MSCI Europe UCITS ETF",
    ticker: "IEUR",
    isin: "IE00B4K48X80",
    index: "MSCI Europe",
    reason: "Nejoblíbenější a nejlikvidnější evropský ETF se širokým pokrytím velkých a středních firem.",
    type: "MSCI Europe",
    rating: 5,
    category: "europe-broad",
    pros: ["Nejnižší TER", "Nejvyšší likvidita", "Široké pokrytí", "iShares kvalita"],
    cons: ["Koncentrace do velkých firem", "Nižší růst než USA", "Brexit exposure"],
    topHoldings: ["ASML (4.8%)", "Nestlé (3.9%)", "LVMH (3.2%)", "Novartis (2.8%)", "SAP (2.4%)"],
    countries: ["Německo (28%)", "Francie (18%)", "UK (16%)", "Švýcarsko (14%)", "Nizozemsko (8%)"]
  },
  {
    name: "Xtrackers MSCI Europe UCITS ETF",
    ticker: "XEUR",
    isin: "LU0274209237",
    index: "MSCI Europe",
    reason: "Alternativa s identickým indexem a extrémně nízkým TER. Deutsche Bank kvalita.",
    type: "MSCI Europe",
    rating: 5,
    category: "europe-broad",
    pros: ["Identický index s IEUR", "Deutsche Bank", "Kvalitní replikace", "Vysoké AUM"],
    cons: ["Menší likvidita než IEUR", "Mladší brand", "Lower trading volume"],
    topHoldings: ["ASML (4.8%)", "Nestlé (3.9%)", "LVMH (3.2%)", "Novartis (2.8%)", "SAP (2.4%)"],
    countries: ["Německo (28%)", "Francie (18%)", "UK (16%)", "Švýcarsko (14%)", "Nizozemsko (8%)"]
  },
  {
    name: "Lyxor STOXX Europe 600 UCITS ETF",
    ticker: "LYX0Q",
    isin: "LU0908500753", 
    index: "STOXX Europe 600",
    reason: "Široká expozice na 600 top firem napříč velikostními kategoriemi. Nejnižší TER.",
    type: "STOXX 600",
    rating: 4,
    category: "europe-comprehensive",
    pros: ["Nejnižší TER", "600 firem", "Širší pokrytí", "Include mid-caps"],
    cons: ["Menší velikost", "Lyxor brand", "Lower liquidity"],
    topHoldings: ["ASML (3.2%)", "Nestlé (2.6%)", "LVMH (2.1%)", "Novartis (1.9%)", "SAP (1.6%)"],
    countries: ["Německo (19%)", "Francie (16%)", "UK (15%)", "Švýcarsko (9%)", "Nizozemsko (7%)"]
  },
  {
    name: "Vanguard FTSE Developed Europe UCITS ETF",
    ticker: "VERX",
    isin: "IE00BKX55T58",
    index: "FTSE Developed Europe",
    reason: "Zastoupení vyspělých evropských trhů s Vanguard kvalitou a nízkými poplatky.",
    type: "FTSE Europe",
    rating: 4,
    category: "europe-developed",
    pros: ["Vanguard reputace", "Velmi nízký TER", "FTSE index", "Developed markets"],
    cons: ["Mladší fond", "Menší AUM", "Different methodology"],
    topHoldings: ["ASML (4.2%)", "Nestlé (3.4%)", "LVMH (2.8%)", "Novartis (2.5%)", "SAP (2.1%)"],
    countries: ["Německo (25%)", "UK (19%)", "Francie (17%)", "Švýcarsko (12%)", "Nizozemsko (9%)"]
  },
  {
    name: "Amundi MSCI Europe UCITS ETF",
    ticker: "AEUE",
    isin: "LU1681041971",
    index: "MSCI Europe",
    reason: "Cenově dostupná volba s plnou replikací evropského indexu MSCI.",
    type: "MSCI Europe",
    rating: 3,
    category: "europe-broad",
    pros: ["Francouzský správce", "Physical replication", "EUR denominated", "Accessible pricing"],
    cons: ["Vyšší TER", "Menší velikost", "Lower brand recognition"],
    topHoldings: ["ASML (4.7%)", "Nestlé (3.8%)", "LVMH (3.1%)", "Novartis (2.7%)", "SAP (2.3%)"],
    countries: ["Německo (28%)", "Francie (18%)", "UK (16%)", "Švýcarsko (14%)", "Nizozemsko (8%)"]
  }
];

const EU_ETF_TABLE_FILTER = {
  top: 12,
  sortBy: "fund_size_numeric" as const,
  sortOrder: "desc" as const,
  category: "Akcie", // Vyloučí dluhopisové fondy
  regionKeywords: ["Evropa"],
  minFundSize: 1, // Vyloučí ETF bez údaje o velikosti fondu
};

export default function NejlepsiETFNaEvropskeAkcie() {
  const { etfsWithData, isLoading } = useETFArticleData(RECOMMENDED_EU_ETFS_TEMPLATE);
  const RECOMMENDED_EU_ETFS = etfsWithData;
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'europe-broad': 'bg-blue-100 text-blue-800',
      'europe-comprehensive': 'bg-indigo-100 text-indigo-800',
      'europe-developed': 'bg-green-100 text-green-800'
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

  const topETFs = RECOMMENDED_EU_ETFS.filter(etf => etf.rating === 5);
  const otherETFs = RECOMMENDED_EU_ETFS.filter(etf => etf.rating < 5);

  return (
    <BlogArticleLayout
      title="Nejlepší ETF na evropské akcie"
      perex="Diverzifikace do evropských trhů. Analýza STOXX 600, jednotlivých zemí a sektorů s praktickými radami pro sestavení vyváženého portfolia."
      seoDescription="Srovnání nejlepších ETF na evropské akcie, detailní doporučení a kritéria výběru na rok 2025. Výhody, poplatky, výnosy, FAQ."
      readTime="9 min"
      difficulty="Začátečník"
      category="Regionální"
    >
      {/* Úvod */}
      <div className="prose max-w-none mb-8">
        <p className="text-lg text-gray-700 leading-relaxed">
          Evropské akciové ETF nabízí přístup k vyspělým ekonomikám s tradičními značkami a stabilními firmami. 
          Představují ideální diverzifikaci mimo americký trh s atraktivními valuacemi.
        </p>
      </div>

      {/* Proč Evropa */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">🇪🇺 Proč investovat do evropských akcií?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-blue-800">Regionální výhody:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Expozice na vyspělé ekonomiky</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Tradiční globální značky</span>
                </li>
                <li className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Měnová diverzifikace</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Atraktivní valuace (P/E)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-blue-800">Klíčové trhy:</h3>
              <ul className="space-y-2 text-sm">
                <li>🇩🇪 <strong>Německo:</strong> Průmysl, automotive, SAP</li>
                <li>🇫🇷 <strong>Francie:</strong> Luxus, kosmetika, LVMH</li>
                <li>🇨🇭 <strong>Švýcarsko:</strong> Farmacie, Nestlé, banky</li>
                <li>🇳🇱 <strong>Nizozemsko:</strong> ASML, technologie</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TOP 2 ETF showcase */}
      <h2 className="text-3xl font-bold mb-8 text-gray-900">🏆 TOP evropské ETF fondy</h2>
      
      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        {topETFs.map((etf, index) => (
          <Card key={etf.isin} className={`relative overflow-hidden ${index === 0 ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-white'}`}>
            {index === 0 && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-semibold">
                #1 EVROPA
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
                  <span className="text-gray-600">10Y výnos:</span>
                  <div className="font-semibold text-green-600">{isLoading ? "Načítání..." : (etf.historicalReturn || "N/A")}</div>
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
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Kompletní přehled evropských ETF</h2>
      
      <div className="space-y-6 mb-12">
        {RECOMMENDED_EU_ETFS.map((etf) => (
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
                  <div className="font-semibold text-green-600">{isLoading ? "Načítání..." : (etf.historicalReturn || "N/A")}</div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
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
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">🏢 Největší pozice:</h4>
                  <div className="flex flex-wrap gap-2">
                    {etf.topHoldings.map((holding, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {holding}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🌍 Geografické rozložení:</h4>
                  <div className="flex flex-wrap gap-2">
                    {etf.countries.map((country, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Výběrová kritéria */}
      <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-green-900">🎯 Jak vybíráme nejlepší evropské ETF</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800">Náklady fondu (TER)</h3>
                  <p className="text-sm text-gray-700">Preferujeme ETF pod 0,2% ročně</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800">Velikost a likvidita</h3>
                  <p className="text-sm text-gray-700">Velké fondy jsou bezpečnější</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Map className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800">Diverzifikace</h3>
                  <p className="text-sm text-gray-700">Široké pokrytí sektorů a zemí</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800">Renomé správce</h3>
                  <p className="text-sm text-gray-700">iShares, Xtrackers, Vanguard</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Euro className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800">Měna fondu</h3>
                  <p className="text-sm text-gray-700">EUR výhodné pro české investory</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Flag className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800">Dostupnost</h3>
                  <p className="text-sm text-gray-700">Všechny u českých brokerů</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Další ETF tabulka */}
      <h2 className="text-3xl font-bold mb-4 text-gray-900">Další evropské ETF fondy</h2>
      <p className="mb-6 text-gray-700">
        V tabulce najdete další kvalitní ETF na evropské akcie seřazené podle velikosti fondu.
      </p>
      <FilteredETFList filter={EU_ETF_TABLE_FILTER} />

      {/* Upozornění */}
      <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Upozornění na rizika</h3>
              <p className="text-sm text-gray-700">
                Ani široce diverzifikovaný evropský ETF negarantuje zisk. Záporné výnosy nebo 
                krátkodobé propady jsou běžné při negativním vývoji na evropských burzách.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jak koupit */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-900">📋 Jak koupit evropský ETF krok za krokem</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li><strong>Stanovte alokaci</strong> - jaký podíl portfolia má mít expozici na Evropu</li>
            <li><strong>Vyberte ETF</strong> podle plánu (akumulační/distribuční, EUR měna)</li>
            <li><strong>Zkontrolujte parametry</strong> - TER, historii, velikost fondu a index</li>
            <li><strong>Ověřte dostupnost</strong> u vašeho brokera (DEGIRO, XTB, Trading212)</li>
            <li><strong>Sledujte měnové riziko</strong> - EUR/CZK kurz a dividend pravidla</li>
          </ol>
        </CardContent>
      </Card>

      {/* FAQ */}
      <h2 className="text-3xl font-bold mb-6 text-gray-900">❓ Časté otázky</h2>
      
      <div className="space-y-4 mb-12">
        <details className="group bg-white border rounded-lg p-4">
          <summary className="font-semibold cursor-pointer text-gray-900 hover:text-blue-600">
            Je lepší vybrat index MSCI Europe nebo STOXX Europe 600?
          </summary>
          <div className="mt-3 text-gray-700">
            Oba pokrývají většinu velkých a středních evropských firem. STOXX 600 má širší diverzifikaci 
            díky zastoupení i menších společností. Výběr záleží na vašich preferencích.
          </div>
        </details>

        <details className="group bg-white border rounded-lg p-4">
          <summary className="font-semibold cursor-pointer text-gray-900 hover:text-blue-600">
            Jsou evropské ETF méně výnosné než americké?
          </summary>
          <div className="mt-3 text-gray-700">
            Dlouhodobě mají evropské akcie nižší růst než americké, ale mohou být výnosnější 
            v období oživení evropské ekonomiky nebo při slabším dolaru.
          </div>
        </details>

        <details className="group bg-white border rounded-lg p-4">
          <summary className="font-semibold cursor-pointer text-gray-900 hover:text-blue-600">
            Existují evropské ETF s vyplácením dividend?
          </summary>
          <div className="mt-3 text-gray-700">
            Ano, většina ETF existuje ve dvou variantách - akumulační (reinvestuje dividendy) 
            a distribuční (vyplácí na účet). Sledujte označení "Acc" nebo "Dist" v názvu.
          </div>
        </details>

        <details className="group bg-white border rounded-lg p-4">
          <summary className="font-semibold cursor-pointer text-gray-900 hover:text-blue-600">
            Jaké evropské ETF mají nejnižší poplatky?
          </summary>
          <div className="mt-3 text-gray-700">
            {" "}
            <Link href="/etf/LU0908500753" className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
              Lyxor STOXX Europe 600 (0.07%)
            </Link>{" "}
            a{" "}
            <Link href="/etf/IE00BKX55T58" className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
              Vanguard FTSE Developed Europe (0.10%)
            </Link>{" "}
            kombinují extrémně nízký TER s kvalitním pokrytím.
          </div>
        </details>
      </div>

      {/* Závěr */}
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">🇪🇺 Evropské ETF v diverzifikovaném portfoliu</h2>
          <p className="mb-6 opacity-90">
            ETF na evropské akcie jsou klíčovým stavebním kamenem vyváženého portfolia. 
            Nabízí stabilitu, sektorovou rozmanitost a měnovou diverzifikaci mimo dolar.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/srovnani-etf">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Prozkoumat ETF
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/tipy/nejlepsi-etf-na-americke-akcie">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Americké akcie
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </BlogArticleLayout>
  );
}