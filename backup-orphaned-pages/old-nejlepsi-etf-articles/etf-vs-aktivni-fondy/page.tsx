

import React from 'react';
import BlogArticleLayout from '@/components/blog/BlogArticleLayout';
import FilteredETFList from '@/components/blog/FilteredETFList';
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, Zap } from 'lucide-react';

export default function ETFVsAktivniFondyPage() {
  const comparisonData = [
    {
      category: "Poplatky (TER)",
      etf: "0,1 - 0,5% ročně",
      aktivni: "1,5 - 3% ročně",
      winner: "etf",
      impact: "Na 30 let rozdíl až 40% celkového výnosu"
    },
    {
      category: "Výkonnost vs. index",
      etf: "Kopíruje index (-TER)",
      aktivni: "85% nedokáže porazit index",
      winner: "etf",
      impact: "Konzistentní průměrné výnosy"
    },
    {
      category: "Transparentnost",
      etf: "Známé složení denně",
      aktivni: "Složení quarterly/ročně",
      winner: "etf",
      impact: "Víte přesně, do čeho investujete"
    },
    {
      category: "Diverzifikace",
      etf: "Automatická dle indexu",
      aktivni: "Závisí na manažerovi",
      winner: "etf",
      impact: "Menší závislost na lidském faktoru"
    },
    {
      category: "Likvidita",
      etf: "Obchodování během dne",
      aktivni: "1x denně po uzávěrce",
      winner: "etf",
      impact: "Flexibilnější vstup/výstup"
    },
    {
      category: "Daňová efektivita",
      etf: "Vyšší (méně obchodování)",
      aktivni: "Nižší (časté obchody)",
      winner: "etf",
      impact: "Méně zdanitelných událostí"
    },
    {
      category: "Minimální investice",
      etf: "Cena 1 podílu (~50-500€)",
      aktivni: "Často 500-5000€",
      winner: "etf",
      impact: "Dostupnější pro malé investory"
    },
    {
      category: "Aktivní řízení",
      etf: "Pasivní sledování",
      aktivni: "Aktivní výběr akcií",
      winner: "aktivni",
      impact: "Možnost překonat trh (15% šance)"
    }
  ];

  const myths = [
    {
      myth: "Aktivní fondy jsou bezpečnější",
      reality: "ETF mají stejné nebo lepší diverzifikaci",
      explanation: "Aktivní fondy mocha být více koncentrované do několika pozic, zatímco ETF automaticky diverzifikují podle indexu."
    },
    {
      myth: "Manažeři dokáží časovat trh",
      reality: "85% manažerů dlouhodobě nedokáže porazit index",
      explanation: "Akademické studie opakovaně potvrzují, že většina aktivních manažerů nedokáže konzistentně překonávat trh."
    },
    {
      myth: "Vyšší poplatky = lepší výsledky",
      reality: "Nízké poplatky jsou jeden z nejlepších prediktorů výnosu",
      explanation: "Morningstar studie ukázaly, že fondy s nejnižšími poplatky dosahují nejlepších dlouhodobých výsledků."
    },
    {
      myth: "ETF jsou jen pro pokročilé investory",
      reality: "ETF jsou naopak ideální pro začátečníky",
      explanation: "Jednoduchost, transparentnost a nízké náklady dělají z ETF perfektní volbu pro první kroky v investování."
    }
  ];

  const scenarioAnalysis = [
    {
      scenario: "Mladý investor (25 let, 30 let investování)",
      amount: "5 000 Kč měsíčně",
      etfResult: "4.2M Kč (TER 0,2%, 7% výnos)",
      aktivniResult: "3.1M Kč (TER 2%, 6% výnos)",
      difference: "1.1M Kč méně",
      etfColor: "text-green-600",
      aktivniColor: "text-red-600"
    },
    {
      scenario: "Střední věk (40 let, 15 let investování)",
      amount: "15 000 Kč měsíčně",
      etfResult: "4.8M Kč (TER 0,2%, 7% výnos)",
      aktivniResult: "4.2M Kč (TER 2%, 6% výnos)",
      difference: "600k Kč méně",
      etfColor: "text-green-600",
      aktivniColor: "text-red-600"
    },
    {
      scenario: "Před důchodem (55 let, 10 let investování)",
      amount: "25 000 Kč měsíčně",
      etfResult: "4.2M Kč (TER 0,2%, 6% výnos)",
      aktivniResult: "3.8M Kč (TER 2%, 5% výnos)",
      difference: "400k Kč méně",
      etfColor: "text-green-600",
      aktivniColor: "text-red-600"
    }
  ];

  return (
    <BlogArticleLayout
      title="ETF vs. aktivní fondy ⚖️"
      description="Objektivní srovnání ETF a aktivně řízených fondů. Analýza nákladů, výkonnosti, daní a rizik s konkrétními příklady a doporučeními pro různé typy investorů."
      keywords="ETF vs aktivní fondy, poplatky ETF, aktivní management, pasivní investice, TER poplatky"
      slug="etf-vs-aktivni-fondy"
    >
      {/* Úvod */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-8 mb-8 border border-blue-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ETF vs. aktivní fondy ⚖️
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Debata mezi ETF a aktivně řízenými fondy je jednou z nejdůležitějších otázek moderního investování. 
            Podívejme se na objektivní data a zjistěte, která možnost je lepší pro váš profil investora.
          </p>
        </div>
      </div>

      {/* Rychlé srovnání */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">Rychlé srovnání</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-4 bg-white rounded-lg border-2 border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-green-800">ETF fondy</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>✅ Nízké poplatky (0,1-0,5%)</li>
                <li>✅ Transparentní</li>
                <li>✅ Daňově efektivní</li>
                <li>✅ Široká diverzifikace</li>
                <li>✅ Konzistentní výnosy</li>
                <li>❌ Pouze průměrné výnosy trhu</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-lg border-2 border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-orange-600" />
                <h3 className="font-bold text-orange-800">Aktivní fondy</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>✅ Možnost překonat trh</li>
                <li>✅ Aktivní řízení rizik</li>
                <li>✅ Flexibilita strategie</li>
                <li>❌ Vysoké poplatky (1,5-3%)</li>
                <li>❌ 85% nedokáže porazit index</li>
                <li>❌ Méně transparentní</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Detailní srovnání */}
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Detailní srovnání klíčových faktů</h2>
      
      <div className="overflow-x-auto mb-12">
        <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 p-4 text-left font-semibold">Kategorie</th>
              <th className="border border-gray-200 p-4 text-center font-semibold text-green-700">ETF fondy</th>
              <th className="border border-gray-200 p-4 text-center font-semibold text-orange-700">Aktivní fondy</th>
              <th className="border border-gray-200 p-4 text-center font-semibold">Dopad</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-25"}>
                <td className="border border-gray-200 p-4 font-medium">{row.category}</td>
                <td className={`border border-gray-200 p-4 text-center ${row.winner === 'etf' ? 'bg-green-50 font-semibold' : ''}`}>
                  {row.etf}
                  {row.winner === 'etf' && <span className="ml-2 text-green-600">✓</span>}
                </td>
                <td className={`border border-gray-200 p-4 text-center ${row.winner === 'aktivni' ? 'bg-orange-50 font-semibold' : ''}`}>
                  {row.aktivni}
                  {row.winner === 'aktivni' && <span className="ml-2 text-orange-600">✓</span>}
                </td>
                <td className="border border-gray-200 p-4 text-sm text-gray-600">{row.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scénáře s kalkulacemi */}
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Reálné scénáře: Kolik vás stojí vysoké poplatky?</h2>
      
      <div className="space-y-6 mb-12">
        {scenarioAnalysis.map((scenario, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-bold mb-4">{scenario.scenario}</h3>
            <p className="text-gray-600 mb-4">Měsíční investice: <strong>{scenario.amount}</strong></p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">ETF portfolio</h4>
                <p className={`text-2xl font-bold ${scenario.etfColor} mb-2`}>{scenario.etfResult}</p>
                <p className="text-sm text-gray-600">Při průměrném ETF s nízkými poplatky</p>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">Aktivní fondy</h4>
                <p className={`text-2xl font-bold ${scenario.aktivniColor} mb-2`}>{scenario.aktivniResult}</p>
                <p className="text-sm text-gray-600">Při průměrném aktivním fondu</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-red-100 rounded-lg">
              <p className="text-red-800 font-semibold">
                <TrendingDown className="w-4 h-4 inline mr-2" />
                Ztráta kvůli vysokým poplatkům: {scenario.difference}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mýty a realita */}
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Časté mýty o aktivních fondech</h2>
      
      <div className="space-y-6 mb-12">
        {myths.map((myth, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md border-l-4 border-l-red-500 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-800 mb-2">❌ Mýtus: {myth.myth}</h3>
                <p className="font-semibold text-green-800 mb-3">✅ Realita: {myth.reality}</p>
                <p className="text-sm text-gray-700">{myth.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Kdy zvolit aktivní fondy */}
      <div className="mb-8">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-orange-900">Kdy má smysl zvolit aktivní fondy?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Velmi specifické sektory/trhy</h3>
                <p className="text-sm text-gray-700">Např. biotech, rozvíjející se trhy, kde není dobrý ETF nebo expert může přidat hodnotu.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Krátkodobé taktické alokace</h3>
                <p className="text-sm text-gray-700">Malá část portfolia (5-10%) pro aktivní strategie jako hedge proti krizím.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Výjimeční manažeři s dlouhým trackem</h3>
                <p className="text-sm text-gray-700">Méně než 5% manažerů, kteří dokázali dlouhodobě (10+ let) porazit svůj benchmark.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doporučení */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl shadow-md p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Naše doporučení</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">Pro většinu investorů: ETF</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>✓ 90-95% portfolia v levných ETF</li>
              <li>✓ Široká diverzifikace (VWCE, CSPX)</li>
              <li>✓ Dlouhodobé držení (10+ let)</li>
              <li>✓ Pravidelné investování (DCA)</li>
              <li>✓ Minimální rebalancing</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-xl mb-4">Pro pokročilé: Hybridní přístup</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>✓ 80-90% v ETF (jádro portfolia)</li>
              <li>✓ 10-20% v aktivních fondech</li>
              <li>✓ Pouze prověření manažeři</li>
              <li>✓ Specifické sektory/regiony</li>
              <li>✓ Pravidelné hodnocení výkonnosti</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-white bg-opacity-20 rounded-lg">
          <p className="text-center font-semibold">
            💡 Klíčové: Nízké náklady jsou jeden z mála faktorů, které můžete kontrolovat. 
            Každé procento ušetřené na poplatcích je procento navíc ve vašem portfoliu.
          </p>
        </div>
      </div>

      {/* Praktické příklady nejlepších fondů */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">💼 Praktické srovnání konkrétních fondů</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4">🏆 Nejlepší ETF fondy</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border border-green-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium">VWCE (Vanguard)</span>
                  <span className="text-sm text-green-600 font-bold">0,22% TER</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Celý svět, 3500+ firem</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-green-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium">CSPX (iShares)</span>
                  <span className="text-sm text-green-600 font-bold">0,07% TER</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">S&P 500, 500 US firem</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-green-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium">EUNL (iShares)</span>
                  <span className="text-sm text-green-600 font-bold">0,20% TER</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Evropa, 400+ firem</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-xl font-bold text-red-800 mb-4">📊 Typické aktivní fondy</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border border-red-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Akciový fond ČR</span>
                  <span className="text-sm text-red-600 font-bold">2,5% TER</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">České akcie, aktivní řízení</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-red-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium">US Growth Fund</span>
                  <span className="text-sm text-red-600 font-bold">1,8% TER</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">US růstové akcie</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-red-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium">European Equity</span>
                  <span className="text-sm text-red-600 font-bold">2,1% TER</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Evropské akcie, výběr manažera</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💰</span>
            <h4 className="font-bold text-yellow-800">Rozdíl za 20 let při investici 10,000 Kč měsíčně</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-green-700">ETF (0,2% TER):</span>
              <span className="text-green-700 ml-2 font-bold">5,8M Kč</span>
            </div>
            <div>
              <span className="font-semibold text-red-700">Aktivní fond (2% TER):</span>
              <span className="text-red-700 ml-2 font-bold">4,9M Kč</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2 italic">*Při stejném základním výnosu 7% ročně před poplatky</p>
        </div>
      </div>

      {/* Související ETF fondy */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 Nejlepší ETF fondy s nízkými poplatky</h2>
        <FilteredETFList filter={{
          top: 8,
          sortBy: "ter_numeric" as const,
          sortOrder: "asc" as const,
          minFundSize: 1,
          category: "equity"
        }}
        />
      </div>

      {/* Závěr */}
      <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Závěrečné shrnutí</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            <strong className="text-gray-800">Pro 95% investorů jsou ETF lepší volbou</strong> díky nízkým poplatkům, 
            transparentnosti a konzistentním výnosům. Matematika je jednoduchá: nižší náklady = více peněz ve vašem portfoliu.
          </p>
          <p>
            <strong className="text-gray-800">Aktivní fondy mají smysl pouze výjimečně:</strong> u velmi specifických trhů, 
            s prověřenými manažery nebo jako malá část (5-10%) portfolia pro taktické alokace.
          </p>
          <p className="font-medium text-gray-800">
            💡 <em>Nezapomeňte: Každé procento ušetřené na poplatcích se za 20-30 let investování promítne do desítek 
            nebo stovek tisíc korun navíc ve vašem portfoliu.</em>
          </p>
        </div>
      </div>
    </BlogArticleLayout>
  );
}