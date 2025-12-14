'use client';

import React from 'react';
import Link from 'next/link';
import FAQSection from '@/components/SEO/FAQSection';
import InternalLinking from '@/components/SEO/InternalLinking';
import StructuredData from '@/components/SEO/StructuredData';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUpIcon, AlertIcon, BarChart3Icon, TargetIcon } from '@/components/ui/icons';
import { MonteCarloCalculator } from '@/components/tools/MonteCarloCalculator';

const MonteCarloContent: React.FC = () => {
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
        "name": "Monte Carlo simulátor",
        "item": "https://www.etfpruvodce.cz/kalkulacky/monte-carlo-simulator"
      }
    ]
  };

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero sekce */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-4 h-4 flex items-center justify-center">🎲</span>
            Monte Carlo simulátor 2025
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Monte Carlo simulace portfolia
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Nikdo neví, co přinese budoucnost. Monte Carlo simulace generuje tisíce možných scénářů
            a ukazuje pravděpodobnostní rozsah budoucích hodnot vašeho portfolia.
          </p>
        </div>

        {/* Samotná kalkulačka */}
        <MonteCarloCalculator />

        {/* Co Monte Carlo ukazuje */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Co vám simulace ukáže</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            <Card>
              <CardContent className="p-4 text-center">
                <span className="w-10 h-10 text-purple-600 mx-auto mb-3 flex items-center justify-center text-2xl">🎲</span>
                <h3 className="text-sm font-semibold mb-1">Scénáře</h3>
                <p className="text-gray-600 text-xs">
                  Stovky možných budoucností
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUpIcon className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold mb-1">Optimistický</h3>
                <p className="text-gray-600 text-xs">
                  Nejlepší možný vývoj
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <span className="w-10 h-10 text-blue-600 mx-auto mb-3 flex items-center justify-center text-2xl">📈</span>
                <h3 className="text-sm font-semibold mb-1">Průměrný</h3>
                <p className="text-gray-600 text-xs">
                  Nejpravděpodobnější cesta
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <AlertIcon className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold mb-1">Pesimistický</h3>
                <p className="text-gray-600 text-xs">
                  Horší scénáře
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3Icon className="w-10 h-10 text-red-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold mb-1">Volatilita</h3>
                <p className="text-gray-600 text-xs">
                  Rozptyl výsledků
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TargetIcon className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold mb-1">Percentily</h3>
                <p className="text-gray-600 text-xs">
                  Pravděpodobnostní pásma
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Jak funguje Monte Carlo */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Jak funguje Monte Carlo simulace?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-800">Princip metody</h3>
              <p className="text-gray-700 mb-4">
                Monte Carlo je statistická metoda pojmenovaná po kasinu v Monaku. Místo jedné predikce
                generuje tisíce náhodných scénářů na základě historické volatility a výnosů.
              </p>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>Analyzujeme historická data portfolia</li>
                <li>Spočítáme průměrný výnos a volatilitu</li>
                <li>Generujeme stovky náhodných cest</li>
                <li>Vyhodnotíme percentily (5%, 16%, 50%, 84%, 95%)</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-800">Co znamenají percentily?</h3>
              <p className="text-gray-700 mb-4">
                Percentily ukazují, jaká hodnota nebude překročena s danou pravděpodobností:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>5. percentil (2.3%):</strong> Velmi špatný scénář - pouze 2.3% simulací dopadlo hůře</li>
                <li>• <strong>16. percentil:</strong> Špatný scénář (-1 sigma)</li>
                <li>• <strong>50. percentil:</strong> Medián - polovina scénářů lepších, polovina horších</li>
                <li>• <strong>84. percentil:</strong> Dobrý scénář (+1 sigma)</li>
                <li>• <strong>95. percentil (97.7%):</strong> Skvělý scénář - pouze 2.3% dopadlo lépe</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Omezení metody */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Omezení Monte Carlo simulace</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-amber-800">Předpoklady metody</h3>
              <p className="text-gray-700 mb-4">
                Monte Carlo předpokládá normální rozdělení výnosů, ale reálné trhy se chovají jinak:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Tlusté chvosty:</strong> Extrémní události jsou častější než by měly být</li>
                <li>• <strong>Shlukování volatility:</strong> Období vysoké a nízké volatility se střídají</li>
                <li>• <strong>Nenormální rozdělení:</strong> Výnosy nejsou symetrické</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-amber-800">Co simulace nezohledňuje</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Strukturální změny:</strong> Ekonomika se může zásadně změnit</li>
                <li>• <strong>Černé labutě:</strong> Nepředvídatelné události (pandemie, války)</li>
                <li>• <strong>Inflace:</strong> Reálná kupní síla peněz</li>
                <li>• <strong>Daně a poplatky:</strong> Skutečné náklady investování</li>
                <li>• <strong>Změny korelací:</strong> V krizích korelace často rostou</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Praktické použití */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kdy používat Monte Carlo?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Plánování důchodu</h3>
              <p className="text-gray-600 text-sm">
                Zjistěte, jaká je pravděpodobnost, že váš důchodový fond vydrží 30 let.
                Lépe než jedna "průměrná" predikce je vidět rozsah možných výsledků.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">FIRE strategie</h3>
              <p className="text-gray-600 text-sm">
                Odchod do předčasného důchodu vyžaduje, aby portfolio vydrželo 40+ let.
                Monte Carlo ukáže riziko "sequence of returns" - špatného načasování.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Porovnání portfolií</h3>
              <p className="text-gray-600 text-sm">
                Srovnejte nejen průměrné výnosy, ale i rizika. Konzervativní portfolio
                může mít užší pásmo výsledků než agresivní.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ sekce */}
        <FAQSection
          title="Často kladené otázky o Monte Carlo simulaci"
          faqs={[
            {
              question: "Co je Monte Carlo simulace?",
              answer: "Monte Carlo je statistická metoda, která generuje tisíce náhodných scénářů budoucího vývoje portfolia na základě historických dat. Místo jedné predikce poskytuje rozsah možných výsledků s pravděpodobnostmi. Metoda je pojmenována po slavném kasinu v Monaku - využívá náhodnost podobně jako ruleta."
            },
            {
              question: "Kolik simulací je dostatečných?",
              answer: "Pro spolehlivé výsledky se doporučuje minimálně 500-1000 simulací. Více simulací poskytuje přesnější percentily, ale nad 1000 se výsledky už výrazně nemění. Naše kalkulačka umožňuje nastavit 100-1000 simulací - pro většinu účelů stačí výchozích 600."
            },
            {
              question: "Jaký je rozdíl mezi Monte Carlo a backtestem?",
              answer: "Backtest ukazuje jednu konkrétní historickou cestu - jak by portfolio fungovalo v minulosti. Monte Carlo generuje tisíce možných budoucích cest na základě statistických vlastností (průměr, volatilita) z historie. Backtest říká 'co bylo', Monte Carlo říká 'co by mohlo být'."
            },
            {
              question: "Co znamená 5. percentil?",
              answer: "5. percentil (přesněji 2.3. percentil) představuje hodnotu, pod kterou spadá pouze 2.3% všech simulací. Je to 'velmi špatný scénář' - odpovídá přibližně -2 směrodatným odchylkám od průměru. Jinými slovy: s 97.7% pravděpodobností bude výsledek lepší než tato hodnota."
            },
            {
              question: "Proč se výsledky liší při každém spuštění?",
              answer: "Monte Carlo používá náhodná čísla pro generování scénářů. Při každém spuštění se vygenerují jiné náhodné cesty, takže percentily mohou mírně kolísat. S více simulacemi (např. 1000) jsou výsledky stabilnější. To je normální vlastnost metody, ne chyba."
            },
            {
              question: "Je Monte Carlo spolehlivá pro predikci budoucnosti?",
              answer: "Monte Carlo nepředpovídá budoucnost - ukazuje rozsah možných výsledků za předpokladu, že budoucnost bude statisticky podobná minulosti. Hlavní omezení: předpokládá normální rozdělení (reálné trhy mají 'tlusté chvosty'), nezohledňuje strukturální změny ekonomiky a nepočítá s 'černými labutěmi'."
            },
            {
              question: "Jak interpretovat pravděpodobnostní pásma?",
              answer: "Pásma ukazují rozsah možných hodnot. Modrá čára (50. percentil) je medián - polovina scénářů dopadne lépe, polovina hůře. Zelená zóna nahoře jsou optimistické scénáře (84-97.7%), červená dole pesimistické (2.3-16%). Čím širší pásmo, tím větší nejistota."
            },
            {
              question: "Proč používat historická data pro budoucnost?",
              answer: "Historie je jediný zdroj dat, který máme. Monte Carlo předpokládá, že statistické vlastnosti (průměrný výnos, volatilita) zůstanou podobné. To není perfektní - budoucnost může být jiná - ale je to lepší než hádat nebo používat pouze průměr. Proto zobrazujeme rozsah scénářů, ne jednu predikci."
            },
            {
              question: "Jaký časový horizont zvolit?",
              answer: "Záleží na vašem investičním cíli. Pro důchodové plánování 20-30 let, pro FIRE strategii 40+ let, pro kratší cíle (auto, bydlení) 5-10 let. Obecně platí: čím delší horizont, tím větší je rozsah možných výsledků - proto je diverzifikace důležitější."
            },
            {
              question: "Můžu výsledky Monte Carlo použít pro investiční rozhodnutí?",
              answer: "Monte Carlo je užitečný nástroj pro pochopení rizik a rozsahu možných výsledků, ale nenahrazuje profesionální investiční poradenství. Pomáhá odpovědět na otázky typu 'Co když to dopadne špatně?' nebo 'Jaká je šance dosáhnout cíle?'. Vždy zohledněte i faktory, které simulace nezahrnuje (inflace, daně, životní změny)."
            }
          ]}
          className="mt-16"
        />

        {/* CTA sekce */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-3">Otestujte i historickou výkonnost</h3>
            <p className="text-purple-100 mb-4">
              Monte Carlo ukazuje budoucnost, backtest ukazuje minulost. Kombinujte obě metody pro lepší rozhodování.
            </p>
            <Link
              href="/kalkulacky/backtest-portfolia"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors inline-block"
            >
              Backtest portfolia
            </Link>
          </div>
        </div>

        {/* Související nástroje */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Backtest portfolia",
              href: "/kalkulacky/backtest-portfolia",
              description: "Otestujte historickou výkonnost portfolia"
            },
            {
              title: "FIRE kalkulačka",
              href: "/kalkulacky/fire-kalkulacka",
              description: "Spočítejte cestu k finanční nezávislosti"
            },
            {
              title: "Investiční kalkulačka",
              href: "/kalkulacky/investicni-kalkulacka",
              description: "Budoucí hodnota pravidelných investic"
            },
            {
              title: "Kalkulačka poplatků ETF",
              href: "/kalkulacky/kalkulacka-poplatku-etf",
              description: "Vliv TER poplatků na dlouhodobé výnosy"
            },
            {
              title: "Srovnání ETF",
              href: "/srovnani-etf",
              description: "Porovnejte 4300+ ETF fondů"
            }
          ]}
          title="Související kalkulačky a nástroje"
          className="mt-16"
        />
      </div>
    </>
  );
};

export default MonteCarloContent;
