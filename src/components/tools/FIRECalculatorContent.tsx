'use client';

import React from 'react';
import FAQSection from '@/components/SEO/FAQSection';
import InternalLinking from '@/components/SEO/InternalLinking';
import StructuredData from '@/components/SEO/StructuredData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBankIcon } from '@/components/ui/icons';
import RetirementPlanner from '@/components/tools/RetirementPlanner';

const FIRECalculatorContent: React.FC = () => {
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
        "name": "FIRE kalkulačka",
        "item": "https://www.etfpruvodce.cz/kalkulacky/fire-kalkulacka"
      }
    ]
  };

  const calculatorSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FIRE kalkulačka - Kdy dosáhnu finanční nezávislosti?",
    "description": "Spočítejte si kdy dosáhnete FIRE podle 4% pravidla. Trinity Study analýza s pravděpodobnostními scénáři a dlouhodobé plánování předčasného důchodu.",
    "url": "https://www.etfpruvodce.cz/kalkulacky/fire-kalkulacka",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CZK"
    },
    "featureList": [
      "Výpočet kdy dosáhnete FIRE podle 4% pravidla",
      "Trinity Study analýza s pravděpodobnostními scénáři",
      "Lean FIRE, Regular FIRE, Fat FIRE časové odhady",
      "Analýza vlivu inflace na FIRE věk", 
      "FIRE (Financial Independence Retire Early) plánování",
      "Interaktivní grafy optimalizace spoření a výdajů",
      "Portfolio strategie podle rizikového profilu",
      "Optimalizace FIRE věku s ETF investicemi",
      "Simulace různých investičních strategií",
      "Pravděpodobnost dosažení FIRE v různých scénářích"
    ]
  };

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero sekce */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <PiggyBankIcon className="w-4 h-4" />
            FIRE kalkulačka 2025
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            FIRE kalkulačka - Kdy dosáhnu finanční nezávislosti?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Zjistěte kdy dosáhnete finanční nezávislosti podle vědecky ověřeného 4% pravidla z Trinity Study. 
            Naplánujte si cestu k FIRE (Lean/Regular/Fat) a předčasný odchod z práce díky pasivnímu příjmu z investic.
          </p>
        </div>

        {/* Samotná kalkulačka - přesunuta na začátek pro lepší UX */}
        <RetirementPlanner />

        {/* Co je FIRE a 4% rule */}
        <div className="mt-16 border-transparent shadow-none hover:shadow-md transition-shadow duration-200 bg-white rounded-2xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center rounded-full bg-violet-100 w-10 h-10">
              <span className="text-xl">📚</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Co je FIRE a 4% withdrawal rule?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-violet-800">FIRE (Financial Independence, Retire Early)</h3>
              <p className="text-gray-600 mb-4">
                FIRE je hnutí zaměřené na dosažení finanční nezávislosti a možnost předčasného odchodu z práce. 
                Cílem je nashromáždit dostatek peněz, aby pasivní příjem z investic pokryl životní náklady.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Lean FIRE:</strong> Minimalistický životní styl, nižší výdaje</li>
                <li>• <strong>Regular FIRE:</strong> Standardní životní styl, běžné výdaje</li>
                <li>• <strong>Fat FIRE:</strong> Luxusní životní styl, vyšší výdaje</li>
                <li>• <strong>Coast FIRE:</strong> Máte už dost úspor, nechají růst</li>
                <li>• <strong>Barista FIRE:</strong> Částečná FI + part-time příjmy</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-violet-800">4% pravidlo pro výpočet FIRE věku</h3>
              <p className="text-gray-600 mb-4">
                Podle 4% pravidla potřebujete 25x ročních výdajů na dosažení FIRE. 
                Naše kalkulačka počítá kdy tohoto cíle dosáhnete na základě Trinity Study analýzy.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Cíl:</strong> 25x roční výdaje (50k Kč/měsíc = 15 mil. Kč FIRE)</li>
                <li>• <strong>Pravděpodobnost:</strong> 3 scénáře podle historických dat</li>
                <li>• <strong>Časový horizont:</strong> Kdy dosáhnete tohoto cíle</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ sekce */}
        <FAQSection
          title="Často kladené otázky o FIRE a finanční nezávislosti"
          faqs={[
            {
              question: "Jak FIRE kalkulačka počítá kdy dosáhnu finanční nezávislosti?",
              answer: "Kalkulačka používá 4% pravidlo (25x ročních výdajů) a Trinity Study metodiku. Počítá růst vašeho portfolia podle zvolené strategie a ukáže kdy dosáhnete cílové částky ve 3 scénářích: optimistickém (20%), realistickém (60%) a pesimistickém (20%). Zahrnuje volatilitu trhů a inflaci."
            },
            {
              question: "V kolika letech můžu dosáhnout FIRE podle kalkulace?",
              answer: "Závisí na vašem věku, úsporách, měsíčním spoření a cílových výdajích. Kalkulačka ukáže přesný odhad pro vaše parametry ve třech scénářích a umožní testovat různé možnosti pomocí interaktivních grafů spoření a výdajů."
            },
            {
              question: "Je 4% rule bezpečné pro 40+ let důchodu?",
              answer: "Pro velmi dlouhé důchody (40+ let) je konzervativnější použít 3-3,5% rule. Původní studie se zaměřovala na 30 let. Trinity Study ukazuje 79% úspěšnost 4% rule na 50 let. Flexibilní strategie (úpravy podle trhu) zvyšují bezpečnost na 85-90%."
            },
            {
              question: "Jak kalkulačka zohledňuje inflaci při FIRE plánování?",
              answer: "Do pole 'Cílové měsíční výdaje při FIRE' zadávejte kolik potřebujete dnes (v dnešních cenách). Kalkulačka automaticky přepočítá inflaci a navyšuje cílovou částku každý rok podle zadané míry inflace. Takže nemusíte počítat budoucí ceny - stačí zadat dnešní potřeby."
            },
            {
              question: "Jaké portfolio je nejlepší pro FIRE?",
              answer: "Historicky nejlépe fungovala diverzifikovaná portfolia: 50-80% akcie (světové ETF), 20-50% dluhopisy/hotovost. V akumulační fázi více akcií (80-90%), při dosažení FIRE postupné snižování rizika. Nejdůležitější jsou nízké poplatky - každé 1% TER snižuje konečnou sumu o 20-30%!"
            },
            {
              question: "Mám sporit na FIRE nebo splácet hypotéku předčasně?",
              answer: "Závisí na úrokové sazbě hypotéky vs očekávaných výnosech z investic. Při hypotéce pod 4% a očekávaných výnosech 7-9% se matematicky vyplatí investovat. Ale zohledněte riziko - předčasné splácení je jisté, investice nejisté. Kalkulačka vám ukáže dopad různých strategií na váš FIRE věk."
            },
            {
              question: "Kdy je nejlepší začít s cestou k FIRE?",
              answer: "Nejlepší čas byl včera, druhý nejlepší je dnes! Složené úročení funguje nejlépe s časem. Kdo začne dříve, potřebuje investovat výrazně méně. Kalkulačka vám ukáže jak se váš FIRE věk mění podle toho, kdy začnete a kolik budete spořit."
            },
            {
              question: "Jaký je rozdíl mezi Lean, Regular a Fat FIRE?",
              answer: "Lean FIRE = minimalistický životní styl s nízkými výdaji, Regular FIRE = standardní životní styl s běžnými výdaji, Fat FIRE = luxusní životní styl s vyššími výdaji. Volba závisí na vašich životních nárocích - kalkulačka spočítá kdy dosáhnete cíle podle vašich konkrétních měsíčních výdajů."
            },
            {
              question: "Jak zrychlit cestu k FIRE podle výsledků kalkulace?",
              answer: "Naše interaktivní grafy ukazují jak se FIRE věk zkracuje: 1) Zvýšením měsíčního spoření o 50% můžete zkrátit cestu o 5-10 let, 2) Snížením měsíčních výdajů o 20% také o 3-7 let. Kalkulačka vám ukáže přesný dopad každé úpravy na váš FIRE věk."
            },
            {
              question: "Jsou české ETF vhodné pro FIRE spoření?",
              answer: "Ano! Světové ETF jako VWCE (Vanguard FTSE All-World) nebo kombinace CSPX (S&P 500) + EUNL (Evropa) jsou ideální. Nízké poplatky (0,1-0,2% TER), široká diverzifikace, daňová výhoda (po 3 letech bez daně). Vyhněte se aktivním fondům s vysokými poplatky 1-2%."
            },
            {
              question: "Zohledňuje kalkulačka riziko tržních krachů?",
              answer: "Ano! Naše analýza zahrnuje volatilitu a medvědí trhy z období 1995-2024 včetně dot-com krize (2000-2002) a finanční krize (2007-2009). Proto ukážeme 3 scénáře - pesimistický počítá s nejhoršími historickými obdobími. Díky tomu je vaše FIRE plánování robustnější."
            },
            {
              question: "Jak přesné jsou výsledky FIRE kalkulace pro Českou republiku?",
              answer: "Naše kalkulačka je kalibrována pro české prostředí. Používá historická data 1995-2024, začleňuje českou inflaci a výnosy. Daňová výhoda ETF (po 3 letech 0%) je výhodnější než v USA. Státní důchod je bonus navíc k FIRE. Částky se počítají individuálně podle vašich konkrétních parametrů."
            }
          ]}
          className="mt-16"
        />

        {/* Související nástroje */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Investiční kalkulačka",
              href: "/kalkulacky/investicni-kalkulacka",
              description: "Spočítejte si růst investic do ETF fondů"
            },
            {
              title: "Nouzová rezerva",
              href: "/kalkulacky/nouzova-rezerva",
              description: "Rezerva je základ před investováním na FIRE"
            },
            {
              title: "Monte Carlo simulátor",
              href: "/kalkulacky/monte-carlo-simulator",
              description: "Analýza rizik FIRE portfolia"
            },
            {
              title: "All Weather Portfolio",
              href: "/tipy/all-weather-portfolio",
              description: "Diverzifikovaná strategie pro FIRE spoření"
            }
          ]}
          title="Související kalkulačky a nástroje"
          className="mt-16"
        />
      </div>
    </>
  );
};

export default FIRECalculatorContent;