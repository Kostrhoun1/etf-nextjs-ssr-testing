

import React from 'react';
import BlogArticleLayout from '@/components/blog/BlogArticleLayout';
import FilteredETFList from '@/components/blog/FilteredETFList';
import { TrendingUp, Calendar, Calculator, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';

export default function RebalancingPortfoliaPage() {
  const rebalancingStrategies = [
    {
      name: "Časové rebalancování",
      frequency: "Každých 6-12 měsíců",
      complexity: "Jednoduché",
      cost: "Nízké",
      description: "Pravidelné rebalancování bez ohledu na výši odchylek",
      pros: ["Jednoduché na implementaci", "Automatizovatelné", "Disciplinované"],
      cons: ["Může ignorovat velké pohyby", "Fixní náklady"]
    },
    {
      name: "Prahové rebalancování",
      frequency: "Při odchylce 5-10%",
      complexity: "Střední",
      cost: "Střední",
      description: "Rebalancování pouze při překročení stanové odchylky",
      pros: ["Reaguje na volatilitu", "Menší transakční náklady", "Flexibilní"],
      cons: ["Vyžaduje monitoring", "Složitější pravidla"]
    },
    {
      name: "Kombinovaný přístup",
      frequency: "Čas + práh",
      complexity: "Pokročilé",
      cost: "Optimální",
      description: "Kombinace časového a prahového rebalancování",
      pros: ["Nejlepší poměr výkon/náklady", "Univerzální", "Profesionální"],
      cons: ["Komplexnější nastavení"]
    }
  ];

  const rebalancingSteps = [
    {
      step: 1,
      title: "Analýza aktuálního portfolia",
      description: "Zjistěte skutečnou alokaci vašich ETF fondů"
    },
    {
      step: 2,
      title: "Porovnání s cílovou alokací",
      description: "Identifikujte odchylky od původního plánu"
    },
    {
      step: 3,
      title: "Výpočet potřebných transakcí",
      description: "Stanovte, kolik musíte koupit/prodat"
    },
    {
      step: 4,
      title: "Provedení transakcí",
      description: "Realizujte nákupy a prodeje v správném pořadí"
    },
    {
      step: 5,
      title: "Dokumentace a plán",
      description: "Zaznamenejte změny a naplánujte další rebalancování"
    }
  ];

  return (
    <BlogArticleLayout
      title="Rebalancing portfolia ⚖️"
      description="Kdy a jak rebalancovat portfolio ETF fondů. Praktické strategie, náklady, daňové dopady a automatizace rebalancingu pro optimální dlouhodobé výnosy."
      keywords="rebalancing portfolia, ETF rebalancování, portfolio strategie, investiční disciplína, dlouhodobé investování"
      slug="rebalancing-portfolia"
    >
      {/* Úvod */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-8 mb-8 border border-violet-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rebalancing portfolia ⚖️
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Kdy a jak rebalancovat portfolio ETF fondů. Praktické strategie, náklady, daňové dopady a automatizace rebalancingu pro optimální dlouhodobé výnosy.
          </p>
        </div>
      </div>

      {/* Co je rebalancování */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-violet-600" />
            <h2 className="text-2xl font-bold">Co je rebalancování portfolia?</h2>
          </div>
          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              Rebalancování je proces obnovení původní alokace aktiv ve vašem portfoliu. Časem se kvůli různým výnosům jednotlivých ETF fondů změní poměry investic, což může ovlivnit rizikový profil portfolia.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <h3 className="font-semibold mb-2 text-blue-900">Příklad rebalancování</h3>
              <p className="text-blue-800">
                Vaše původní alokace: 70% akcie (IWDA) + 30% dluhopisy (IEAG)<br/>
                Po roce: 80% akcie + 20% dluhopisy (akcie rostly rychleji)<br/>
                Rebalancování: Prodáte část akcií a dokoupíte dluhopisy na původních 70:30
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategie rebalancování */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">Strategie rebalancování</h2>
          <div className="grid md:grid-cols-1 gap-6">
            {rebalancingStrategies.map((strategy, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{strategy.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{strategy.complexity}</span>
                    <span className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-sm font-medium">{strategy.cost} náklady</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{strategy.description}</p>
                <div className="text-sm text-violet-600 font-medium mb-3">
                  Frekvence: {strategy.frequency}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Výhody:</h4>
                    <ul className="text-sm space-y-1">
                      {strategy.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">Nevýhody:</h4>
                    <ul className="text-sm space-y-1">
                      {strategy.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Praktický postup */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-violet-600" />
            <h2 className="text-2xl font-bold">Jak na rebalancování krok za krokem</h2>
          </div>
          <div className="space-y-6">
            {rebalancingSteps.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailní příklad rebalancování */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">📊 Praktický příklad rebalancování</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Výchozí situace</h3>
            <p className="text-gray-700 mb-4">Portfolio hodnoty 100,000 Kč s cílovou alokací:</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-3 rounded-lg text-center">
                <div className="font-semibold text-blue-800">IWDA (Světové akcie)</div>
                <div className="text-2xl font-bold text-blue-700">60%</div>
                <div className="text-sm text-blue-600">60,000 Kč</div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg text-center">
                <div className="font-semibold text-green-800">IEAG (Evropské dluhopisy)</div>
                <div className="text-2xl font-bold text-green-700">30%</div>
                <div className="text-sm text-green-600">30,000 Kč</div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg text-center">
                <div className="font-semibold text-yellow-800">SGLN (Zlato)</div>
                <div className="text-2xl font-bold text-yellow-700">10%</div>
                <div className="text-sm text-yellow-600">10,000 Kč</div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Po roce - před rebalancováním</h3>
            <p className="text-gray-700 mb-4">Portfolio hodnoty 112,000 Kč po růstu trhů:</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-100 p-3 rounded-lg text-center">
                <div className="font-semibold text-red-800">IWDA</div>
                <div className="text-2xl font-bold text-red-700">72%</div>
                <div className="text-sm text-red-600">80,640 Kč</div>
                <div className="text-xs text-red-500">+34,3% růst</div>
              </div>
              <div className="bg-red-100 p-3 rounded-lg text-center">
                <div className="font-semibold text-red-800">IEAG</div>
                <div className="text-2xl font-bold text-red-700">23%</div>
                <div className="text-sm text-red-600">25,760 Kč</div>
                <div className="text-xs text-red-500">-14,1% pokles</div>
              </div>
              <div className="bg-red-100 p-3 rounded-lg text-center">
                <div className="font-semibold text-red-800">SGLN</div>
                <div className="text-2xl font-bold text-red-700">5%</div>
                <div className="text-sm text-red-600">5,600 Kč</div>
                <div className="text-xs text-red-500">-44% pokles</div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Po rebalancování</h3>
            <p className="text-gray-700 mb-4">Návrat k původní alokaci:</p>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg text-center">
                <div className="font-semibold text-green-800">IWDA</div>
                <div className="text-2xl font-bold text-green-700">60%</div>
                <div className="text-sm text-green-600">67,200 Kč</div>
                <div className="text-xs text-green-500">Prodej 13,440 Kč</div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg text-center">
                <div className="font-semibold text-green-800">IEAG</div>
                <div className="text-2xl font-bold text-green-700">30%</div>
                <div className="text-sm text-green-600">33,600 Kč</div>
                <div className="text-xs text-green-500">Nákup 7,840 Kč</div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg text-center">
                <div className="font-semibold text-green-800">SGLN</div>
                <div className="text-2xl font-bold text-green-700">10%</div>
                <div className="text-sm text-green-600">11,200 Kč</div>
                <div className="text-xs text-green-500">Nákup 5,600 Kč</div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-600">
              <strong>Výsledek:</strong> Portfolio je zpět na původní alokaci a připraveno na další růst
            </div>
          </div>
        </div>
      </div>

      {/* Náklady a daně */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8 text-violet-600" />
            <h2 className="text-2xl font-bold">Náklady a daňové dopady</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Transakční náklady</h3>
              <ul className="space-y-2 text-sm">
                <li>• DEGIRO: 0-2 EUR na transakci</li>
                <li>• XTB: 0 EUR (pro ETF na seznamu)</li>
                <li>• Trading212: 0 EUR</li>
                <li>• Interactive Brokers: 1.25-4 EUR</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Daňové dopady v ČR</h3>
              <ul className="space-y-2 text-sm">
                <li>• Prodej = daňová událost</li>
                <li>• Test časový: držba &gt;3 roky</li>
                <li>• Test částkový: prodej &lt;100k Kč/rok</li>
                <li>• Daň 15% z rozdílu mezi prodejem a nákupem</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Tip pro minimalizaci daní</h4>
            <p className="text-yellow-700 text-sm">
              Raději rebalancujte novými příspěvky než prodeji. Místo prodeje přehodnotěné části kupujte více podhodnocené části.
            </p>
          </div>
        </div>
      </div>

      {/* Kdy rebalancovat */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-violet-600" />
            <h2 className="text-2xl font-bold">Kdy je čas na rebalancování?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-green-700">✅ Signály pro rebalancování</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium">Odchylka větší než 5%</div>
                  <div className="text-sm text-gray-600">Alokace se odchýlila od cíle o 5+ procentních bodů</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium">Roční interval</div>
                  <div className="text-sm text-gray-600">Pravidelné roční rebalancování bez ohledu na odchylky</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium">Změna životní situace</div>
                  <div className="text-sm text-gray-600">Svatba, děti, změna zaměstnání, blížící se důchod</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium">Nové příspěvky</div>
                  <div className="text-sm text-gray-600">Možnost rebalancovat bez prodejů při pravidelném investování</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-red-700">❌ Kdy nerebalancovat</h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="font-medium">Malé odchylky</div>
                  <div className="text-sm text-gray-600">Odchylky menší než 5% nemusí být řešeny</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="font-medium">Vysoké transakční náklady</div>
                  <div className="text-sm text-gray-600">Když náklady převyšují přínos rebalancování</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="font-medium">Daňové dopady</div>
                  <div className="text-sm text-gray-600">V ČR při držbě kratší než 3 roky a prodeji nad 100k Kč</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="font-medium">Trendové trhy</div>
                  <div className="text-sm text-gray-600">V silně trendovém trhu může být lepší nechat vítěze běžet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Automatizace */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">Automatizace rebalancování</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Portfolio Management aplikace</h3>
              <p className="text-gray-600 text-sm mb-2">Personal Capital, Betterment (USA), Nutmeg (UK)</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Broker funkce</h3>
              <p className="text-gray-600 text-sm mb-2">Interactive Brokers má funkce pro automatické rebalancování</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Target-date fondy</h3>
              <p className="text-gray-600 text-sm">Automaticky mění alokaci podle věku investora</p>
            </div>
          </div>
        </div>
      </div>

      {/* Psychologické aspekty */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">🧠 Psychologie rebalancování</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-blue-700">Mentální výzvy</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium">Prodej vítězů</div>
                  <div className="text-sm text-gray-600">Je těžké prodat aktiva, která dobře rostou</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium">Nákup poražených</div>
                  <div className="text-sm text-gray-600">Psychicky náročné kupovat klesající aktiva</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium">Timing problém</div>
                  <div className="text-sm text-gray-600">Pocit, že by bylo lepší počkat na "správný" moment</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-green-700">Jak překonat překážky</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium">Automatické pravidla</div>
                  <div className="text-sm text-gray-600">Předem stanovené podmínky pro rebalancování</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium">Pravidelné termíny</div>
                  <div className="text-sm text-gray-600">Kalendářní reminder na každých 6-12 měsíců</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium">Fokus na dlouhodobé cíle</div>
                  <div className="text-sm text-gray-600">Připomeňte si, proč investujete a co chcete dosáhnout</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA sekce */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Chcete se dozvědět více?</h2>
          <p className="text-gray-600 mb-6">
            Prozkoumejte naše další návody a kalkulačky pro optimalizaci vašeho portfolia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/kalkulacky/investicni-kalkulacka" 
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Investiční kalkulačka
            </a>
            <a 
              href="/tipy/nejlepsi-etf-2025" 
              className="border border-violet-200 text-violet-700 hover:bg-violet-50 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Nejlepší ETF 2025
            </a>
          </div>
        </div>
      </div>

      {/* Rebalancing kalkulačka */}
      <div className="mb-12">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">🧮 Rebalancing kalkulačka</h2>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Jak spočítat potřebné transakce?</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded border">
                  <div className="text-sm text-gray-600">Krok 1: Současná hodnota</div>
                  <div className="font-semibold">112,000 Kč</div>
                </div>
                <div className="p-3 bg-white rounded border">
                  <div className="text-sm text-gray-600">Krok 2: Cílová alokace</div>
                  <div className="font-semibold">60% / 30% / 10%</div>
                </div>
                <div className="p-3 bg-white rounded border">
                  <div className="text-sm text-gray-600">Krok 3: Rozdíl</div>
                  <div className="font-semibold">Prodat / Koupit</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Vzorec:</strong> Cílová částka = Celková hodnota × Cílová alokace %<br/>
                <strong>Transakce:</strong> Cílová částka - Současná částka = Potřebná transakce
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Související ETF fondy */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 Nejpopulárnější ETF fondy pro diverzifikované portfolio</h2>
        <FilteredETFList filter={{
          top: 6,
          sortBy: "fund_size_numeric" as const,
          sortOrder: "desc" as const,
          indexNameKeywords: ["MSCI World", "FTSE All-World", "S&P 500", "MSCI Emerging Markets"],
          minFundSize: 5,
          category: "equity"
        }} />
      </div>

      {/* Závěr */}
      <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Klíčové poznatky</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            <strong className="text-gray-800">Rebalancování je disciplína, ne věda.</strong> Nejdůležitější je mít jasný plán 
            a držet se ho. Každý rok kontrolujte své portfolio a při odchylkách větších než 5% zvažte rebalancování.
          </p>
          <p>
            <strong className="text-gray-800">Minimalizujte náklady a daně:</strong> Rebalancujte novými příspěvky, 
            používejte levné brokery a pamatujte na tříleté osvobození od daní v ČR.
          </p>
          <p className="font-medium text-gray-800">
            💡 <em>Pamatujte: Nejlepší rebalancování je to, které skutečně provedete. Jednoduchý systém, který 
            dodržíte, je lepší než složitá strategie, kterou opustíte.</em>
          </p>
        </div>
      </div>
    </BlogArticleLayout>
  );
}