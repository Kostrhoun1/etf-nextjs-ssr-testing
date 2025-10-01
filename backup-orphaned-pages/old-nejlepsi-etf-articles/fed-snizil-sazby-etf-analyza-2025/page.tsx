

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar, DollarSign, BarChart3, PieChart, Shield, Lightbulb, Coins, Building2, Globe } from 'lucide-react';
import BlogArticleLayout from "@/components/blog/BlogArticleLayout";
import ETFTicker from "@/components/ETFTicker";

const FedSnizilSazbyETFAnalyza2025: React.FC = () => {
  const marketReaction = [
    { name: "S&P 500", change: "-0.1%", trend: "down" },
    { name: "NASDAQ", change: "-0.33%", trend: "down" },
    { name: "Dow Jones", change: "+0.57%", trend: "up" },
    { name: "VIX", value: "15.45", change: "Pokles strachu", trend: "down" }
  ];

  const topCommodityETFs = [
    { rank: 1, name: "L&G Gold Mining UCITS ETF", ticker: "ETLX", ytd: "+91.48%", reason: "Čisté exposure na gold miners" },
    { rank: 2, name: "UBS Solactive Global Pure Gold Miners", ticker: "UBUD", ytd: "+83.96%", reason: "Globální diverzifikace" },
    { rank: 3, name: "HANetf AuAg ESG Gold Mining", ticker: "ZSG0", ytd: "+80.48%", reason: "ESG zaměření + zlato" }
  ];

  const topEquityETFs = [
    { rank: 1, name: "iShares Gold Producers UCITS ETF", ticker: "SPGP", ytd: "+77.18%", sector: "Gold Mining" },
    { rank: 2, name: "iShares EURO STOXX Banks 30-15", ticker: "EXX1", ytd: "+64.57%", sector: "Evropské banky" },
    { rank: 3, name: "Amundi Euro Stoxx Banks UCITS ETF", ticker: "BNKE", ytd: "+64.39%", sector: "Eurozone banky" }
  ];

  const topCryptoETFs = [
    { name: "Global X Blockchain UCITS ETF", ticker: "BLCH", ytd: "+46.03%", focus: "Blockchain infrastruktura" },
    { name: "iShares Blockchain Technology", ticker: "CBUT", ytd: "+40.77%", focus: "Tech companies" },
    { name: "Invesco CoinShares Global Blockchain", ticker: "BCHS", ytd: "+39.46%", focus: "Široké exposure" }
  ];

  const weeklyEvents = [
    { date: "Pondělí 23.9.", event: "Německý PMI", impact: "Evropské akciové ETF", description: "indikátor ekonomické síly Eurozone" },
    { date: "Úterý 24.9.", event: "US Consumer Confidence", impact: "Americké broad market ETF", description: "nálada spotřebitelů" },
    { date: "Středa 25.9.", event: "ECB Minutes", impact: "Dluhopisové a bankovní ETF", description: "detaily z posledního zasedání" },
    { date: "Čtvrtek 26.9.", event: "US GDP Q2 Final", impact: "Všechny americké ETF", description: "konečná čísla růstu" },
    { date: "Pátek 27.9.", event: "Core PCE Inflation", impact: "Komoditní ETF, zejména zlato", description: "preferovaná inflační metrika Fedu" }
  ];

  const categoryPerformance = [
    { category: "KOMODITY", performance: 12.57, funds: 149, icon: "💎" },
    { category: "AKCIE", performance: 6.76, funds: 1000, icon: "📈" },
    { category: "KRYPTO", performance: 4.25, funds: 91, icon: "₿" },
    { category: "NEMOVITOSTI", performance: 2.00, funds: 51, icon: "🏢" },
    { category: "DLUHOPISY", performance: -0.79, funds: 980, icon: "🛡️" }
  ];

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return "";
    }
  };

  const getPerformanceBar = (performance: number) => {
    const maxWidth = 32; // reprezentuje 32 jednotek pro 12.57%
    const width = Math.max(4, Math.abs(performance) / 12.57 * maxWidth);
    const color = performance >= 0 ? "text-green-400" : "text-red-400";
    const bar = "█".repeat(Math.round(width));
    return <span className={color}>{bar}</span>;
  };

  return (
    <BlogArticleLayout
      title="📈 Fed snížil sazby o 0,25%: ETF fondy reagují na první úrokové uvolnění roku 2025"
      perex="Středeční rozhodnutí Federální rezervy snížit úrokové sazby o čtvrt procenta odstartovalo první uvolnění měnové politiky v roce 2025. Analýza dopadu na ETF trhy, zlatá horečka mining fondů a investiční příležitosti."
      readTime="12 min"
      difficulty="Mírně pokročilé"
      category="Týdenní zprávy"
    >
      {/* Header info */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-violet-50 rounded-xl border-2 border-blue-200 shadow-lg">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">20. září 2025</span>
          </div>
          <p className="text-base font-semibold text-gray-800 mt-2">
            📈 Týdenní ETF přehled s analýzou trhů 📊
          </p>
        </div>
      </div>

      {/* Key News */}
      <div className="mb-12">
        <h2 className="text-4xl font-black mb-8 text-gray-900 flex items-center gap-3 leading-tight">
          <div className="p-3 bg-violet-100 rounded-xl">
            <DollarSign className="w-10 h-10 text-violet-600" />
          </div>
          <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            🏦 Klíčová zpráva týdne: Fed začíná cyklus snižování sazeb
          </span>
        </h2>
      </div>

      <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <DollarSign className="w-6 h-6" />
            Středeční rozhodnutí Federální rezervy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            <strong>Středeční rozhodnutí Federální rezervy</strong> snížit úrokové sazby o čtvrt procenta na <strong>4,00-4,25%</strong> 
            odstartovalo první uvolnění měnové politiky v roce 2025. Trhy reagovaly smíšeně - ačkoli bylo rozhodnutí očekávané, 
            volatilita ukázala nervozitu investorů ohledně budoucího směřování ekonomiky.
          </p>
          
          <p className="text-gray-700 mb-4">
            Jerome Powell charakterizoval snížení jako <strong>"řízení rizik"</strong> spíše než reakci na výrazné zpomalení ekonomiky. 
            Nově jmenovaný guvernér Stephen Miran jako jediný hlasoval proti, preferoval agresivnější snížení o půl procenta.
          </p>

          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            📊 Okamžitá reakce trhů
          </h3>
          
          {/* Infographic-style market reaction */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {marketReaction.map((market, index) => (
                <div key={index} className="relative">
                  <div className={`p-6 rounded-xl shadow-lg border-2 ${market.trend === 'up' ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200' : 'bg-gradient-to-br from-red-50 to-rose-100 border-red-200'}`}>
                    <div className="text-center">
                      <h4 className="font-bold text-gray-800 text-sm mb-2">{market.name}</h4>
                      <div className={`text-2xl font-black mb-2 ${market.trend === 'up' ? 'text-green-700' : 'text-red-700'}`}>
                        {market.change || market.value}
                      </div>
                      <div className="flex justify-center">
                        {market.trend === 'up' ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-6 h-6" />
                            <span className="text-xs font-semibold">RŮST</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600">
                            <TrendingDown className="w-6 h-6" />
                            <span className="text-xs font-semibold">POKLES</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Decorative arrow for visual flow */}
                  {index < marketReaction.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-slate-300 text-xl">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Summary box */}
            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-medium">
                  ⚖️ <strong>Tržní verdikt:</strong> Smíšená reakce - volatilita ukazuje nervozitu investorů
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gold Mining Section */}
      <div className="mb-12">
        <h2 className="text-4xl font-black mb-8 text-gray-900 flex items-center gap-3 leading-tight">
          <div className="p-3 bg-yellow-100 rounded-xl">
            <Coins className="w-10 h-10 text-yellow-600" />
          </div>
          <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            💰 Zlatá horečka: Mining ETF s rekordními zisky
          </span>
        </h2>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-yellow-800">
            Největšími vítězi týdne jsou ETF fondy zaměřené na těžbu zlata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            <strong>Největšími vítězi týdne jsou ETF fondy zaměřené na těžbu zlata</strong>, které profitují z historických maxim drahého kovu. 
            Zlato dosáhlo nového rekordu nad <strong>3 600 USD za unci</strong>, poháněno kombinací faktorů:
          </p>

          <div className="bg-gray-900 text-orange-400 p-4 rounded-lg font-mono text-sm mb-6">
            <div className="text-center mb-2">🔥 KLÍČOVÉ CATALYSTY:</div>
            <div className="border border-orange-400 p-3">
              <div>│ 🏦 Fed rate cuts - očekávání dalších snížení v roce 2025      │</div>
              <div>│ 💵 Slabý dolar - 10% pokles v roce 2025 podporuje zlato       │</div>
              <div>│ 📈 Inflační obavy - dlouhodobá očekávání na 30letých maximech │</div>
              <div>│ ⚔️ Geopolitické napětí - zlato jako bezpečný přístav         │</div>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            🏆 TOP ETF fondy v kategorii komodit (YTD výkonnost)
          </h3>

          {/* Infographic-style TOP ETF cards */}
          <div className="space-y-4">
            {topCommodityETFs.map((etf, i) => (
              <div key={i} className={`p-6 rounded-xl shadow-lg border-2 ${
                etf.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' :
                etf.rank === 2 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300' :
                'bg-gradient-to-r from-orange-50 to-red-50 border-orange-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">
                      {getRankEmoji(etf.rank)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{etf.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <ETFTicker ticker={etf.ticker} />
                        <Badge className="bg-blue-100 text-blue-800 text-xs">Gold Mining</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-green-600 mb-1">
                      {etf.ytd}
                    </div>
                    <div className="text-sm text-gray-600">
                      YTD výnos
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <strong>Klíč k úspěchu:</strong> {etf.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-gray-700">
              Podle analýzy Goldman Sachs může zlato dosáhnout <strong className="text-yellow-800">5 000 USD/oz</strong> v závislosti na dalších rozhodnutích Fedu.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Banking ETF Section */}
      <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <Building2 className="w-8 h-8 text-violet-600" />
        🏦 Bankovní ETF: Paradox nižších sazeb
      </h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-blue-800">
            Evropské bankovní ETF překvapivě vedou navzdory poklesu úrokových sazeb
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            <strong>Evropské bankovní ETF překvapivě vedou</strong> navzdory poklesu úrokových sazeb. 
            Investoři sází na stabilizaci ekonomiky a potenciální růst úvěrové aktivity.
          </p>

          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            📈 TOP akciové ETF fondy (YTD)
          </h3>

          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left">Pořadí</th>
                  <th className="border border-gray-200 p-3 text-left">ETF</th>
                  <th className="border border-gray-200 p-3 text-center">Ticker</th>
                  <th className="border border-gray-200 p-3 text-center">YTD výnos</th>
                  <th className="border border-gray-200 p-3 text-center">Sektor</th>
                </tr>
              </thead>
              <tbody>
                {topEquityETFs.map((etf, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-25"}>
                    <td className="border border-gray-200 p-3 font-bold">
                      {getRankEmoji(etf.rank)}
                    </td>
                    <td className="border border-gray-200 p-3">{etf.name}</td>
                    <td className="border border-gray-200 p-3 text-center">
                      <ETFTicker ticker={etf.ticker} />
                    </td>
                    <td className="border border-gray-200 p-3 text-center font-bold text-green-600">
                      {etf.ytd}
                    </td>
                    <td className="border border-gray-200 p-3 text-center">{etf.sector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm">
            <div className="text-center mb-2">🏦 KLÍČOVÉ FAKTORY PRO BANKY:</div>
            <div className="border border-blue-400 p-3">
              <div>│ ✅ Očekávání stability - konec agresivního růstu sazeb   │</div>
              <div>│ 📊 Potenciální NIM recovery - stabilizace čistých marží │</div>
              <div>│ 💪 Ekonomická rezilient - zatím žádné signály recese    │</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Europe ECB Section */}
      <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <Globe className="w-8 h-8 text-violet-600" />
        🇪🇺 Evropa drží kurz: ECB zůstává při sazbách 2%
      </h2>

      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            🇪🇺 Evropská centrální banka zachovala sazby na 2%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            <strong>Evropská centrální banka zachovala sazby na 2%</strong> a signalizovala opatrný přístup k dalším změnám. 
            Euro posílilo o 0,3% vůči dolaru po oznámení.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-blue-800 mb-3">📋 ECB September Updates:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Inflace:</strong> Průměr 2,1% v 2025, 1,7% v 2026</li>
                <li>• <strong>Růst HDP:</strong> Očekávání 0,3% kvartálně</li>
                <li>• <strong>Další cuts:</strong> Dveře otevřené, ale opatrně</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-blue-800 mb-3">🌍 Výkonnost evropských trhů:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>EURO STOXX 50:</strong> +1,40% na 5 447 bodů</li>
                <li>• <strong>Stoxx 600:</strong> +0,51% za týden</li>
                <li>• <strong>Banking sector:</strong> Stabilní performance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crypto ETF Section */}
      <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <span className="text-2xl">₿</span>
        Krypto ETF: Blockchain technologie táhnou růst
      </h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-purple-800">
            Blockchain a krypto ETF zaznamenávají solidní výkonnost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            <strong>Blockchain a krypto ETF zaznamenávají solidní výkonnost</strong> díky kombinaci technologického optimismu a uvolnění měnové politiky.
          </p>

          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            🚀 TOP Krypto ETF fondy (YTD)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left">ETF</th>
                  <th className="border border-gray-200 p-3 text-center">Ticker</th>
                  <th className="border border-gray-200 p-3 text-center">YTD výnos</th>
                  <th className="border border-gray-200 p-3 text-left">Fokus</th>
                </tr>
              </thead>
              <tbody>
                {topCryptoETFs.map((etf, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-25"}>
                    <td className="border border-gray-200 p-3">{etf.name}</td>
                    <td className="border border-gray-200 p-3 text-center">
                      <ETFTicker ticker={etf.ticker} />
                    </td>
                    <td className="border border-gray-200 p-3 text-center font-bold text-green-600">
                      {etf.ytd}
                    </td>
                    <td className="border border-gray-200 p-3">{etf.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Investment Opportunities */}
      <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <Lightbulb className="w-8 h-8 text-violet-600" />
        💡 Investiční příležitosti: Co sledovat příští týden
      </h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🗓️ Klíčové události (23.-27. září)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyEvents.map((event, i) => (
              <div key={i} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <div className="font-bold text-violet-600 min-w-[120px]">{event.date}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{event.event}</div>
                    <div className="text-sm text-gray-600">{event.description}</div>
                  </div>
                  <div className="text-sm font-medium text-blue-600">
                    <strong>Dopad:</strong> {event.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment Recommendations */}
      <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <Target className="w-8 h-8 text-violet-600" />
        🎯 Taktické doporučení pro investory
      </h2>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">💼 Konzervativní profil (Capital preservation)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm mb-4">
              <div className="text-center mb-2">📊 ALOKACE: 60% Akcie | 30% Dluhopisy | 10% Komodity</div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  ✅ BUY signals:
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>World equity ETF</strong> s nízkým TER (SCWX - 0% TER)</li>
                  <li>• <strong>Short duration bonds</strong> - méně citlivé na sazby</li>
                  <li>• <strong>Gold ETF</strong> (5-10% jako hedge)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                  ⚠️ AVOID:
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• Long duration dluhopisy (citlivost na sazby)</li>
                  <li>• High dividend ETF (konkurence s bondy)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-800">⚡ Agresivní profil (Growth seeking)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-purple-400 p-4 rounded-lg font-mono text-sm mb-4">
              <div className="text-center mb-2">📊 ALOKACE: 80% Akcie | 15% Komodity | 5% Alternatives</div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                  ✅ BUY signals:
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Banking sector ETF</strong> (beneficienti rate stability)</li>
                  <li>• <strong>Gold mining ETF</strong> (momentum play)</li>
                  <li>• <strong>Small cap ETF</strong> (více citlivé na lower rates)</li>
                  <li>• <strong>Blockchain ETF</strong> (small allocation, 2-3%)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-yellow-600 mb-2 flex items-center gap-2">
                  ⚠️ Risk management:
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• Pozor na vysoké valuace tech sektorů</li>
                  <li>• Diversifikace napříč regiony</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Statistics */}
      <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <BarChart3 className="w-8 h-8 text-violet-600" />
        📊 Statistiky a trendy
      </h2>

      <Card className="mb-6 bg-gradient-to-br from-violet-50 to-blue-50 border-violet-200">
        <CardHeader>
          <CardTitle className="text-violet-800 text-xl">🔢 Výkonnost podle kategorií (YTD průměry)</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Infographic-style performance bars */}
          <div className="space-y-6 mb-8">
            {categoryPerformance.map((cat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{cat.category}</h3>
                      <p className="text-sm text-gray-500">{cat.funds} fondů</p>
                    </div>
                  </div>
                  <div className={`text-3xl font-black ${cat.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {cat.performance > 0 ? '+' : ''}{cat.performance}%
                  </div>
                </div>
                
                {/* Visual progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ${cat.performance >= 0 
                      ? 'bg-gradient-to-r from-green-400 to-green-600' 
                      : 'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ 
                      width: `${Math.min(100, Math.abs(cat.performance) / 12.57 * 100)}%`,
                      marginLeft: cat.performance < 0 ? `${100 - Math.min(100, Math.abs(cat.performance) / 12.57 * 100)}%` : '0%'
                    }}
                  ></div>
                </div>
                
                {/* Performance indicator */}
                <div className="flex justify-center mt-2">
                  {cat.performance >= 10 ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">🔥 VÝBORNÁ</Badge>
                  ) : cat.performance >= 5 ? (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">📈 DOBRÁ</Badge>
                  ) : cat.performance >= 0 ? (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">📊 MÍRNÁ</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 border-red-200">📉 ZÁPORNÁ</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Key insights box */}
          <div className="bg-white p-6 rounded-xl border-2 border-violet-200 shadow-lg">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              🔍 Klíčová pozorování:
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-700"><strong>Komodity dominují</strong> díky zlaté rally</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-700"><strong>Akcie stabilně rostou</strong> navzdory volatilitě</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-gray-700"><strong>Dluhopisy pod tlakem</strong> rising rates začátku roku</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-700"><strong>Krypto ETF pozitivní</strong> tech optimismus</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risks and Outlook */}
      <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <AlertTriangle className="w-8 h-8 text-violet-600" />
        ⚠️ Rizika na radaru
      </h2>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">🚨 Short-term risks (1-3 měsíce)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Fed policy error</strong> - příliš rychlé nebo pomalé cuts</li>
              <li>• <strong>Dollar strength rally</strong> - negativní pro komodity</li>
              <li>• <strong>China slowdown</strong> - dopad na global growth</li>
              <li>• <strong>Geopolitical escalation</strong> - flight to safety</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">📈 Medium-term opportunities (3-12 měsíců)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Infrastructure boom</strong> - fiscal stimulus ETF</li>
              <li>• <strong>Energy transition</strong> - clean energy ETF</li>
              <li>• <strong>AI infrastructure</strong> - tech hardware ETF</li>
              <li>• <strong>Demographic plays</strong> - healthcare ETF</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Outlook */}
      <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <span className="text-2xl">🔮</span>
        Výhled: "Soft landing" nebo volatilita?
      </h2>

      <Card className="mb-8 bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
        <CardContent className="p-6">
          <p className="text-gray-700 mb-4">
            <strong>Konzensus analytiků</strong> míří k scenáři "měkkého přistání" ekonomiky, ale trhy zůstávají nervózní. 
            Fed dot plot ukazuje <strong>2 další cuts v roce 2025</strong>, což by mělo podporovat risk assets.
          </p>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <div className="text-center mb-2">💡 BOTTOM LINE PRO ETF INVESTORY:</div>
            <div className="border border-green-400 p-3">
              <div>│ 🎯 Diversifikace remains king - žádný sektor není bulletproof │</div>
              <div>│ 💎 Quality over momentum - preferujte ETF s nízkým TER        │</div>
              <div>│ 🔄 Stay flexible - připraveni na rychlé změny sentiment      │</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Information */}
      <div className="text-center text-sm text-gray-500 space-y-1 mb-6">
        <p>📊 <em>Data: Yahoo Finance, Fed, ECB | 📈 ETF výkonnost: ETF Průvodce databáze</em></p>
        <p>⏰ <em>Příští týdenní přehled: 27. září 2025</em></p>
      </div>

      {/* Disclaimer */}
      <Card className="mb-8 bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <p className="text-sm text-gray-700">
            <strong>Disclaimer:</strong> <em>Tento článek slouží pouze pro informační účely a není investičním doporučením. 
            Všechna investiční rozhodnutí činíte na vlastní riziko.</em>
          </p>
        </CardContent>
      </Card>

      {/* Related articles */}
      <Card className="mt-8 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle>🔗 Související články</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Link href="/tipy/nejlepsi-etf-2025" className="block hover:underline">
              • Nejlepší ETF pro začátečníky 2025
            </Link>
            <Link href="/tipy/nejlepsi-dividendove-etf" className="block hover:underline">
              • Nejlepší dividendové ETF fondy
            </Link>
            <Link href="/tipy/rebalancing-portfolia" className="block hover:underline">
              • Jak rebalancovat ETF portfolio
            </Link>
          </div>
        </CardContent>
      </Card>
    </BlogArticleLayout>
  );
};

export default FedSnizilSazbyETFAnalyza2025;