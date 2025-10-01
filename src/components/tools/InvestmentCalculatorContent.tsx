'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FAQSection from '@/components/SEO/FAQSection';
import InternalLinking from '@/components/SEO/InternalLinking';
import StructuredData from '@/components/SEO/StructuredData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, PiggyBank, Target, TrendingUp } from 'lucide-react';
import InvestmentCalculatorForm from '@/components/tools/InvestmentCalculatorForm';
import InvestmentResultsSummary from '@/components/tools/InvestmentResultsSummary';
import InvestmentChart from '@/components/tools/InvestmentChart';
import InvestmentTable from '@/components/tools/InvestmentTable';
import { calculateInvestment } from '@/utils/investmentCalculations';

const InvestmentCalculatorContent: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState<number>(0);
  const [recurringInvestment, setRecurringInvestment] = useState<number>(0);
  const [recurringFrequency, setRecurringFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [averageReturn, setAverageReturn] = useState<number>(7);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(20);
  const [taxRate, setTaxRate] = useState<number>(0);

  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleCalculate = () => {
    const calculationParams = {
      initialInvestment,
      recurringInvestment,
      recurringFrequency,
      averageReturn,
      investmentPeriod,
      taxRate
    };

    const calculatedResults = calculateInvestment(calculationParams);
    setResults(calculatedResults);
    setShowResults(true);
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Domů",
        "item": "https://www.etfpruvodce.cz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Kalkulačky",
        "item": "https://www.etfpruvodce.cz/kalkulacky"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Investiční kalkulačka 2025",
        "item": "https://www.etfpruvodce.cz/kalkulacky/investicni-kalkulacka"
      }
    ]
  };

  const calculatorSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Investiční kalkulačka 2025 - Pravidelné investování",
    "description": "Bezplatná investiční kalkulačka pro výpočet výnosů z pravidelného měsíčního investování do ETF fondů. Včetně daní, inflace a složeného úročení.",
    "url": "https://www.etfpruvodce.cz/kalkulacky/investicni-kalkulacka",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CZK"
    },
    "featureList": [
      "Compound interest výpočty",
      "Simulace pravidelného měsíčního investování", 
      "Zohlednění daní z výnosů",
      "Analýza vlivu inflace",
      "Grafické znázornění růstu investice",
      "Porovnání různých scénářů"
    ]
  };

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero sekce */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Investiční kalkulačka 2025
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Investiční kalkulačka 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Spočítejte si výnosy z pravidelného měsíčního investování s efektem složeného úročení.
          </p>
        </div>

        {/* Samotná kalkulačka - přesně podle původní */}
        <div className="space-y-6">
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-violet-600" />
                <CardTitle className="text-2xl">
                  Investiční kalkulačka
                </CardTitle>
              </div>
              <CardDescription className="text-sm">
                Spočítejte si růst vašich investic s pravidelným investováním a zohledněním daní
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvestmentCalculatorForm
                initialInvestment={initialInvestment}
                setInitialInvestment={setInitialInvestment}
                recurringInvestment={recurringInvestment}
                setRecurringInvestment={setRecurringInvestment}
                recurringFrequency={recurringFrequency}
                setRecurringFrequency={setRecurringFrequency}
                averageReturn={averageReturn}
                setAverageReturn={setAverageReturn}
                investmentPeriod={investmentPeriod}
                setInvestmentPeriod={setInvestmentPeriod}
                taxRate={taxRate}
                setTaxRate={setTaxRate}
                onCalculate={handleCalculate}
              />

              {showResults && results.length > 0 && (
                <InvestmentResultsSummary results={results} />
              )}

              {/* Rozbalovací předpoklady */}
              <details className="mt-4 border border-gray-200 rounded-lg">
                <summary className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors rounded-lg">
                  <span className="font-semibold text-gray-900 text-sm">📋 Předpoklady kalkulačky</span>
                </summary>
                <div className="p-3 border-t border-gray-200">
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• <strong>Měsíční investice:</strong> Investice probíhá vždy 1. den měsíce s okamžitou aplikací výnosu</li>
                    <li>• <strong>Roční investice:</strong> Investice probíhá vždy 1. ledna s aplikací výnosu po celý rok</li>
                    <li>• <strong>Složené úročení:</strong> Výnosy se reinvestují a dále zhodnocují</li>
                    <li>• <strong>Konstantní výnos:</strong> Uvažujeme stabilní průměrný roční výnos (realita je volatilnější)</li>
                    <li>• <strong>Daně v ČR:</strong> Časový test 3+ roky = 0% daň. Aktivní obchodování = 15%/23% daň z ročních zisků</li>
                    <li>• <strong>Poplatky a inflace:</strong> Nejsou v kalkulaci zahrnuty</li>
                  </ul>
                </div>
              </details>
            </CardContent>
          </Card>

          {showResults && results.length > 0 && (
            <>
              <InvestmentChart data={results} />
              <InvestmentTable data={results} />
            </>
          )}
        </div>

        {/* Výhody pravidelného investování */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Proč pravidelné investování funguje?</h2>
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Calculator className="w-12 h-12 text-violet-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Compound Interest</h3>
                <p className="text-gray-600 text-sm">
                  Složené úročení - nejsilnější síla v investování
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <PiggyBank className="w-12 h-12 text-violet-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Pravidelné investování</h3>
                <p className="text-gray-600 text-sm">
                  Dollar Cost Averaging - snížení rizika časování trhu
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-violet-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Cílové plánování</h3>
                <p className="text-gray-600 text-sm">
                  Naplánujte si cestu k finanční nezávislosti
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-violet-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Reálné výnosy</h3>
                <p className="text-gray-600 text-sm">
                  Výpočty včetně daní a inflace pro ČR
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Co je pravidelné investování a složené úročení */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Jak funguje pravidelné investování a složené úročení?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-violet-800">Pravidelné měsíční investování</h3>
              <p className="text-gray-700 mb-4">
                Pravidelné investování je strategie, kdy investujete stejnou částku každý měsíc bez ohledu na aktuální cenu trhu. 
                Například každý měsíc nakoupíte ETF za 5000 Kč.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Snižuje riziko:</strong> Nekupujete vše najednou v špatný čas</li>
                <li>• <strong>Jednoduchost:</strong> Nevyžaduje timing trhu</li>
                <li>• <strong>Disciplína:</strong> Automatické investování bez emocí</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-violet-800">Compound Interest (Složené úročení)</h3>
              <p className="text-gray-700 mb-4">
                Compound interest znamená, že dostáváte výnosy nejen z původní investice, 
                ale i z dříve získaných výnosů. Čím déle investujete, tím silnější je efekt.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Exponenciální růst:</strong> Výnosy z výnosů</li>
                <li>• <strong>Čas je klíčový:</strong> Efekt se zesiluje s časem</li>
                <li>• <strong>Magie investování:</strong> "8. div světa" podle Einsteina</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ sekce */}
        <FAQSection
          title="Často kladené otázky o investiční kalkulačce"
          faqs={[
            {
              question: "Co je strategie pravidelného investování?",
              answer: "Pravidelné investování (angl. Dollar Cost Averaging) je strategie, kdy každý měsíc investujete stejnou částku bez ohledu na cenu trhu. Například každý měsíc 5000 Kč do ETF. Výhodou je snížení rizika špatného timingu a lepší průměrná nákupní cena."
            },
            {
              question: "Jak funguje složené úročení (složené úročení)?",
              answer: "Compound interest znamená, že získáváte výnosy nejen z původní investice, ale i z předchozích výnosů. Například: investice 100 tis. s 7% ročním výnosem po roce = 107 tis. Druhý rok se počítá 7% z 107 tis. = 114,5 tis. Efekt se zesiluje s časem."
            },
            {
              question: "Jaký je realistický výnos z ETF investic?",
              answer: "Historicky dosáhly globální akciové indexy (S&P 500, MSCI World) průměrně 7-10% ročně před inflací. Po zdanění a inflaci lze očekávat reálný výnos 4-7% ročně. Konkrétní výnosy se liší podle období a složení portfolia."
            },
            {
              question: "Jak se zdaňují výnosy z ETF v České republice?",
              answer: "V ČR platí ČASOVÝ TEST: při držení ETF déle než 3 roky se daň z kapitálových výnosů NEPLATÍ (0%). Při kratším držení se zisky zdaňují 15% (základní sazba) nebo 23% (vyšší sazba). Dividendy podléhají srážkové dani 15% - proto jsou akumulační ETF daňově výhodnější."
            },
            {
              question: "Co je časový test a jak funguje v praxi?",
              answer: "Časový test znamená, že pokud držíte ETF déle než 3 roky, zisky z prodeje se nezdaňují vůbec (0% daň). Test se počítá od data nákupu do data prodeje. Příklad: koupíte ETF 1.1.2025, prodáte 2.1.2028 = 3 roky a 1 den = 0% daň. Prodáte 31.12.2027 = méně než 3 roky = 15% daň."
            },
            {
              question: "Kolik bych měl investovat měsíčně?",
              answer: "Doporučuje se investovat 10-20% čistého příjmu po vytvoření nouzové rezervy. Začněte s částkou, kterou můžete bezpečně postrádat. Důležitější je pravidelnost než výše - i 1000 Kč měsíčně může za 20 let narůst na značnou sumu."
            },
            {
              question: "Kdy začít s pravidelným investováním?",
              answer: "Nejlepší čas začít bylo včera, druhý nejlepší je dnes. Čím dříve začnete, tím více využijete sílu složeného úročení. Nepřemýšlejte o ideálním okamžiku - u pravidelného investování jde právě o to, že timing není důležitý."
            },
            {
              question: "Jaké ETF jsou vhodné pro pravidelné investování strategii?",
              answer: "Pro pravidelné investování jsou ideální široce diverzifikované ETF s nízkými poplatky: VWCE (celý svět), CSPX (S&P 500), EUNL (Evropa), VFEM (rozvíjející se trhy). Vybírejte ETF s vysokým objemem obchodování a nízkou TER (pod 0,5%)."
            }
          ]}
          className="mt-16"
        />

        {/* ETF Investment Guide CTA */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-3">💡 Chcete se dozvědět více o investování?</h3>
            <p className="text-green-100 mb-4">
              Stáhněte si náš komplexní průvodce s 5 ověřenými portfolio strategiemi a praktickými radami pro začátečníky i pokročilé.
            </p>
            <Link 
              href="/co-jsou-etf/jak-zacit-investovat"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-block"
            >
              📚 Stáhnout průvodce zdarma
            </Link>
          </div>
        </div>

        {/* Související nástroje */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Průvodce investováním",
              href: "/co-jsou-etf/jak-zacit-investovat",
              description: "Kompletní návod s 5 portfolio strategiemi"
            },
            {
              title: "Srovnání ETF fondů",
              href: "/srovnani-etf",
              description: "Najděte si nejlepší ETF pro pravidelné investování investování"
            },
            {
              title: "FIRE kalkulačka",
              href: "/kalkulacky/fire-kalkulacka",
              description: "Naplánujte si cestu k finanční nezávislosti"
            },
            {
              title: "Monte Carlo simulátor",
              href: "/kalkulacky/monte-carlo-simulator",
              description: "Analýza rizik vašeho portfolia"
            },
            {
              title: "Nejlepší ETF 2025",
              href: "/nejlepsi-etf/nejlepsi-etf-2025",
              description: "Doporučené ETF fondy pro pravidelné investování"
            }
          ]}
          title="Související kalkulačky a nástroje"
          className="mt-16"
        />
      </div>
    </>
  );
};

export default InvestmentCalculatorContent;