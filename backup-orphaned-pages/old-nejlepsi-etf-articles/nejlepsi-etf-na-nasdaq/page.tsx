

import React from 'react';
import BlogArticleLayout from '@/components/blog/BlogArticleLayout';
import FilteredETFList from '@/components/blog/FilteredETFList';
import { useETFArticleData } from '@/hooks/useETFArticleData';

const RECOMMENDED_NASDAQ_ETFS_TEMPLATE = [
  {
    name: "Invesco QQQ Trust ETF",
    ticker: "QQQ",
    isin: "US46090E1038",
    index: "NASDAQ-100",
    reason: "Nejpopulárnější NASDAQ ETF s nejlepší likviditou. Koncentrace do 100 největších technologických gigantů.",
    type: "NASDAQ-100",
    rating: 5,
    category: "tech-growth",
    pros: ["Nejlepší likvidita", "Top 100 tech firem", "Silná historická výkonnost", "Ideální pro growth investory"],
    cons: ["Vysoká koncentrace do top 10", "Volatilita", "Drahé oceňování", "Bez dividend"],
    topHoldings: ["Apple (12.1%)", "Microsoft (11.8%)", "Amazon (5.4%)", "Nvidia (4.8%)", "Google (4.2%)"]
  },
  {
    name: "iShares NASDAQ 100 UCITS ETF",
    ticker: "CNDX",
    isin: "IE00B53SZB19",
    index: "NASDAQ-100",
    reason: "Evropská alternativa k QQQ s nižšími náklady a UCITS strukturou pro EU investory.",
    type: "NASDAQ-100",
    rating: 5,
    category: "tech-growth",
    pros: ["UCITS struktura", "Nižší TER než QQQ", "Stejná expozice", "Daňově výhodnější"],
    cons: ["Nižší likvidita než QQQ", "Mladší fond", "Tracking difference", "EUR denominace"],
    topHoldings: ["Apple (12.1%)", "Microsoft (11.8%)", "Amazon (5.4%)", "Nvidia (4.8%)", "Google (4.2%)"]
  },
  {
    name: "Xtrackers NASDAQ 100 UCITS ETF",
    ticker: "XNAQ",
    isin: "LU0292097747",
    index: "NASDAQ-100",
    reason: "Další solidní UCITS alternativa s dobrou likviditou a konkurenceschopnými poplatky.",
    type: "NASDAQ-100",
    rating: 4,
    category: "tech-growth",
    pros: ["Dobrá likvidita", "Solidní tracking", "Deutsche Bank pozadí", "Stabilní výkonnost"],
    cons: ["Vyšší TER než konkurenti", "Složitější struktura", "Méně populární", "Tracking chyby"],
    topHoldings: ["Apple (12.1%)", "Microsoft (11.8%)", "Amazon (5.4%)", "Nvidia (4.8%)", "Google (4.2%)"]
  },
  {
    name: "iShares NASDAQ 100 UCITS ETF (Acc)",
    ticker: "EQNX",
    isin: "IE00B53SZB19",
    index: "NASDAQ-100",
    reason: "Akumulující verze s reinvestovanými dividendami pro dlouhodobé budování bohatství.",
    type: "NASDAQ-100",
    rating: 4,
    category: "tech-growth",
    pros: ["Automatická reinvestice", "Složené úročení", "Daňová efektivita", "Dlouhodobý růst"],
    cons: ["Nižší likvidita", "Bez pasivního příjmu", "Sledování jen kapitálového růstu", "Komplikovanější daně"],
    topHoldings: ["Apple (12.1%)", "Microsoft (11.8%)", "Amazon (5.4%)", "Nvidia (4.8%)", "Google (4.2%)"]
  },
  {
    name: "Amundi NASDAQ-100 UCITS ETF",
    ticker: "ANQX",
    isin: "LU1681038243",
    index: "NASDAQ-100",
    reason: "Francouzský poskytovatel s konkurenceschopnými poplatky a solidním trackingem.",
    type: "NASDAQ-100",
    rating: 4,
    category: "tech-growth",
    pros: ["Nízké poplatky", "Dobrý tracking", "Amundi management", "Solidní alternativa"],
    cons: ["Nižší obliba", "Mladší historie", "Menší fund size", "Nižší likvidita"],
    topHoldings: ["Apple (12.1%)", "Microsoft (11.8%)", "Amazon (5.4%)", "Nvidia (4.8%)", "Google (4.2%)"]
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'tech-growth':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
    </div>
  );
};

export default function NejlepsiETFNaNASDAQPage() {
  const {
    recommendedETFs,
    loading,
    error
  } = useETFArticleData(RECOMMENDED_NASDAQ_ETFS_TEMPLATE);

  if (loading) {
    return (
      <BlogArticleLayout
        title="Nejlepší ETF na NASDAQ 2025"
        description="Kompletní průvodce nejlepšími ETF fondy pro investice do NASDAQ indexu. Porovnání, analýza a doporučení pro rok 2025."
        keywords="ETF NASDAQ, NASDAQ 100 ETF, technologické ETF, QQQ ETF, investice do technologií"
        slug="nejlepsi-etf-na-nasdaq"
      >
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </BlogArticleLayout>
    );
  }

  if (error) {
    console.error('Error loading ETF data:', error);
  }

  const topThreeETFs = recommendedETFs?.slice(0, 3) || RECOMMENDED_NASDAQ_ETFS_TEMPLATE.slice(0, 3);

  return (
    <BlogArticleLayout
      title="Nejlepší ETF na NASDAQ 2025 🚀"
      description="Objevte nejlepší ETF fondy pro investice do NASDAQ indexu. Kompletní analýza QQQ, CNDX a dalších top fondů s detailním porovnáním pro rok 2025."
      keywords="ETF NASDAQ, NASDAQ 100 ETF, technologické ETF, QQQ ETF, investice do technologií, growth investice, tech akcie"
      slug="nejlepsi-etf-na-nasdaq"
    >
      {/* Hero sekce */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 mb-8 border border-purple-100">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Nejlepší ETF na NASDAQ 2025 🚀
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          NASDAQ představuje koncentraci největších technologických gigantů světa. 
          Investice do NASDAQ ETF vám umožní participovat na růstu firem jako Apple, 
          Microsoft, Amazon či Google s jediným nákupem.
        </p>
      </div>

      {/* TOP 3 showcase */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 TOP 3 NASDAQ ETF pro rok 2025</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {topThreeETFs.map((etf, index) => (
            <div key={etf.ticker} className="bg-white rounded-xl shadow-md border border-purple-100 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-purple-600">#{index + 1}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{etf.ticker}</h3>
                    <StarRating rating={etf.rating} />
                  </div>
                </div>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">{etf.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{etf.reason}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(etf.category)}`}>
                  {etf.type}
                </span>
                {etf.total_expense_ratio !== undefined && (
                  <span className="text-sm font-semibold text-purple-600">
                    {etf.total_expense_ratio}% TER
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kompletní seznam ETF */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Kompletní analýza NASDAQ ETF fondů</h2>
        
        <div className="space-y-8">
          {recommendedETFs?.map((etf, index) => (
            <div key={etf.ticker} className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{etf.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(etf.category)}`}>
                      {etf.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 mb-4">
                    <span className="text-lg font-semibold text-purple-600">{etf.ticker}</span>
                    <span className="text-sm text-gray-500">ISIN: {etf.isin}</span>
                    <StarRating rating={etf.rating} />
                  </div>
                  <p className="text-gray-700 mb-4">{etf.reason}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-3">✅ Výhody</h4>
                  <ul className="space-y-2">
                    {etf.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span className="text-sm text-gray-600">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-3">⚠️ Nevýhody</h4>
                  <ul className="space-y-2">
                    {etf.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="text-sm text-gray-600">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-3">🏢 TOP 5 Holdings</h4>
                <div className="flex flex-wrap gap-2">
                  {etf.topHoldings.map((holding, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                      {holding}
                    </span>
                  ))}
                </div>
              </div>

              {/* Zobrazení dat z databáze pokud jsou dostupná */}
              {etf.total_expense_ratio !== undefined && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">TER</span>
                      <p className="font-semibold">{etf.total_expense_ratio}%</p>
                    </div>
                    {etf.fund_size && (
                      <div>
                        <span className="text-sm text-gray-500">Velikost fondu</span>
                        <p className="font-semibold">{(etf.fund_size / 1000000).toFixed(0)}M €</p>
                      </div>
                    )}
                    {etf.domicile && (
                      <div>
                        <span className="text-sm text-gray-500">Domicil</span>
                        <p className="font-semibold">{etf.domicile}</p>
                      </div>
                    )}
                    {etf.replication && (
                      <div>
                        <span className="text-sm text-gray-500">Replikace</span>
                        <p className="font-semibold">{etf.replication}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )) || RECOMMENDED_NASDAQ_ETFS_TEMPLATE.map((etf, index) => (
            <div key={etf.ticker} className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{etf.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(etf.category)}`}>
                      {etf.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 mb-4">
                    <span className="text-lg font-semibold text-purple-600">{etf.ticker}</span>
                    <span className="text-sm text-gray-500">ISIN: {etf.isin}</span>
                    <StarRating rating={etf.rating} />
                  </div>
                  <p className="text-gray-700 mb-4">{etf.reason}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-3">✅ Výhody</h4>
                  <ul className="space-y-2">
                    {etf.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span className="text-sm text-gray-600">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-3">⚠️ Nevýhody</h4>
                  <ul className="space-y-2">
                    {etf.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="text-sm text-gray-600">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-3">🏢 TOP 5 Holdings</h4>
                <div className="flex flex-wrap gap-2">
                  {etf.topHoldings.map((holding, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                      {holding}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kritéria výběru */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Jak vybrat nejlepší NASDAQ ETF?</h2>
        <div className="bg-purple-50 rounded-xl p-8 border border-purple-100">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-purple-800 mb-4">📊 Klíčové metriky</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <div>
                    <strong className="text-gray-800">TER (Total Expense Ratio):</strong>
                    <span className="text-gray-600 ml-2">Ideálně pod 0,35%</span>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <div>
                    <strong className="text-gray-800">Velikost fondu:</strong>
                    <span className="text-gray-600 ml-2">Minimálně 100M USD</span>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <div>
                    <strong className="text-gray-800">Likvidita:</strong>
                    <span className="text-gray-600 ml-2">Vysoký denní objem obchodů</span>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <div>
                    <strong className="text-gray-800">Tracking Error:</strong>
                    <span className="text-gray-600 ml-2">Minimální odchylka od indexu</span>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-800 mb-4">🎯 Investiční strategie</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <div>
                    <strong className="text-gray-800">Growth orientace:</strong>
                    <span className="text-gray-600 ml-2">NASDAQ je zaměřený na růst</span>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <div>
                    <strong className="text-gray-800">Tech expozice:</strong>
                    <span className="text-gray-600 ml-2">Koncentrace do technologií</span>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <div>
                    <strong className="text-gray-800">Volatilita:</strong>
                    <span className="text-gray-600 ml-2">Vyšší než široký trh</span>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <div>
                    <strong className="text-gray-800">Dlouhodobost:</strong>
                    <span className="text-gray-600 ml-2">Ideální pro 5+ let</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ sekce */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">❓ Často kladené otázky</h2>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Co je NASDAQ-100 index?</h3>
            <p className="text-gray-600">
              NASDAQ-100 je index 100 největších nefinančních společností obchodovaných na burze NASDAQ. 
              Zahrnuje technologické giganty jako Apple, Microsoft, Amazon, Google a Tesla. 
              Index je váženým podle tržní kapitalizace.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Je lepší QQQ nebo UCITS alternativa?</h3>
            <p className="text-gray-600">
              Pro evropské investory jsou UCITS ETF (jako CNDX) daňově výhodnější kvůli struktuře fondů. 
              QQQ má sice nejlepší likviditu, ale podléhá americké srážkové dani. 
              UCITS fondy mají nižší daňovou zátěž díky smlouvám o zamezení dvojího zdanění.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Kolik procent portfolia věnovat NASDAQ ETF?</h3>
            <p className="text-gray-600">
              NASDAQ ETF by měl představovat maximálně 20-30% diversifikovaného portfolia. 
              Jedná se o koncentrovaný tech index s vyšší volatilitou. 
              Kombinujte s širšími indexy jako S&P 500 pro lepší diversifikaci.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Kdy je nejlepší doba na nákup NASDAQ ETF?</h3>
            <p className="text-gray-600">
              Nejlepší strategie je Dollar Cost Averaging (DCA) - pravidelné měsíční investice 
              bez ohledu na aktuální cenu. NASDAQ je volatilní, takže timing trhu je obtížný. 
              Pravidelné investice vyhlazují volatilitu v dlouhodobém horizontu.
            </p>
          </div>
        </div>
      </div>

      {/* Postup nákupu */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🛒 Jak koupit NASDAQ ETF krok za krokem</h2>
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-100">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Vyberte brokera</h3>
                <p className="text-gray-600">
                  Doporučujeme <a href="/srovnani-brokeru" className="text-purple-600 hover:underline">Interactive Brokers</a>, 
                  <a href="/degiro-recenze" className="text-purple-600 hover:underline ml-1">DEGIRO</a>, nebo 
                  <a href="/xtb-recenze" className="text-purple-600 hover:underline ml-1">XTB</a> pro nízké poplatky.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Založte investiční účet</h3>
                <p className="text-gray-600">
                  Zaregistrujte se u vybraného brokera a projděte ověřením identity. 
                  Proces obvykle trvá 1-3 pracovní dny.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Vložte prostředky</h3>
                <p className="text-gray-600">
                  Převeďte peníze na investiční účet bankovním převodem. 
                  Minimální částka se liší podle brokera (obvykle 0-2000 €).
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Najděte ETF</h3>
                <p className="text-gray-600">
                  Vyhledejte vybraný ETF podle tickeru (např. CNDX) nebo ISIN kódu. 
                  Zkontrolujte poplatky a údaje o fondu.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">5</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Zadejte objednávku</h3>
                <p className="text-gray-600">
                  Zvolte typ objednávky (doporučujeme market order), zadejte částku 
                  a potvrďte nákup. ETF se objeví ve vašem portfoliu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Závěr */}
      <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Shrnutí</h2>
        <p className="text-gray-600 mb-4">
          NASDAQ ETF představují skvělou příležitost pro investice do technologického sektoru 
          a growth akcií. Nejvhodnější jsou pro investory s dlouhodobým horizontem, 
          kteří dokážou snést vyšší volatilitu výměnou za potenciál vyšších výnosů.
        </p>
        <p className="text-gray-600">
          Začněte s <strong>QQQ</strong> pro maximální likviditu nebo <strong>CNDX</strong> 
          pro daňovou optimalizaci v EU. Investujte pravidelně pomocí DCA strategie 
          a kombinujte s širšími indexy pro optimální diversifikaci.
        </p>
      </div>

      {/* Související ETF */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 Související ETF fondy</h2>
        <FilteredETFList filter={{
          top: 6,
          sortBy: "fund_size_numeric" as const,
          sortOrder: "desc" as const,
          indexNameKeywords: ["NASDAQ-100", "NASDAQ Composite", "Technology"],
          minFundSize: 0.5
        }} />
      </div>
    </BlogArticleLayout>
  );
}