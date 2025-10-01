import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import ConsumerLoanCalculator from '@/components/tools/ConsumerLoanCalculator';

export const metadata: Metadata = {
  title: 'Úvěrová kalkulačka 2025 | Spotřebitelský úvěr | ETF průvodce.cz',
  description: 'Kalkulačka spotřebitelského úvěru 2025. Spočítejte si měsíční splátky, celkové náklady a porovnejte nabídky bank. Aktuální úrokové sazby.',
  keywords: [
    'úvěrová kalkulačka 2025',
    'spotřebitelský úvěr',
    'osobní půjčka kalkulačka',
    'měsíční splátka úvěru',
    'úrokové sazby úvěru',
    'kalkulačka půjčky',
    'rychlá půjčka',
    'bankovní úvěr'
  ],
  openGraph: {
    title: 'Úvěrová kalkulačka 2025 - Spotřebitelský úvěr',
    description: 'Spočítejte si přesnou výši měsíčních splátek spotřebitelského úvěru s aktuálními úrokovými sazbami.',
    type: 'website',
    locale: 'cs_CZ'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Úvěrová kalkulačka 2025',
    description: 'Výpočet splátek spotřebitelského úvěru s aktuálními sazbami.'
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/kalkulacky/uverova-kalkulacka'
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Úvěrová kalkulačka 2025',
  description: 'Kalkulačka pro výpočet měsíčních splátek spotřebitelského úvěru s aktuálními úrokovými sazbami.',
  url: 'https://www.etfpruvodce.cz/kalkulacky/uverova-kalkulacka',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CZK'
  },
  featureList: [
    'Výpočet měsíční splátky úvěru',
    'Analýza celkových nákladů úvěru',
    'Porovnání RPSN různých nabídek',
    'Splátkový kalendář',
    'Aktuální sazby pro rok 2025'
  ]
};

export default function UverovaKalkulackaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              💳 Aktualizováno pro rok 2025
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Úvěrová kalkulačka 2025
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Spočítejte si přesnou výši měsíčních splátek spotřebitelského úvěru 
              a porovnejte nabídky různých bank s aktuálními úrokovými sazbami.
            </p>
          </div>

          {/* Kalkulačka */}
          <ConsumerLoanCalculator />

          {/* Informační sekce */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Co je RPSN a jak se počítá?
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong className="text-blue-600">RPSN (Roční procentní sazba nákladů)</strong> 
                  zahrnuje nejen úrokovou sazbu, ale i všechny další poplatky spojené s úvěrem.
                </p>
                <p>
                  <strong>RPSN zahrnuje:</strong>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>• Úrokovou sazbu</li>
                  <li>• Poplatek za vyřízení úvěru</li>
                  <li>• Poplatek za vedení účtu</li>
                  <li>• Povinné pojištění</li>
                  <li>• Další související poplatky</li>
                </ul>
                <p className="text-sm bg-blue-50 p-3 rounded">
                  <strong>Tip:</strong> Při porovnávání úvěrů se vždy řiďte RPSN, 
                  ne pouze úrokovou sazbou.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Aktuální úrokové sazby 2025
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <strong className="text-blue-600">Spotřebitelské úvěry:</strong>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li>• Běžné úvěry: 8,9 - 15,9% p.a.</li>
                    <li>• Refinancování: 7,9 - 13,9% p.a.</li>
                    <li>• Úvěry pro VIP klienty: 6,9 - 11,9% p.a.</li>
                    <li>• Americká hypotéka: 8,5 - 14,5% p.a.</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-blue-600">RPSN obvykle:</strong>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li>• O 1-3% vyšší než úroková sazba</li>
                    <li>• Závisí na výši a délce úvěru</li>
                    <li>• Zahrnuje všechny poplatky</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600">
                  <em>Sazby jsou orientační a liší se podle bonity klienta a nabídky banky.</em>
                </p>
              </div>
            </div>
          </div>

          {/* Typy úvěrů */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🎯 Typy spotřebitelských úvěrů
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Účelový úvěr</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Na konkrétní účel (auto, nábytek)</li>
                  <li>• Nižší úroková sazba</li>
                  <li>• Potřeba doložit účel</li>
                  <li>• Zástava předmětu</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Neúčelový úvěr</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Na libovolný účel</li>
                  <li>• Vyšší úroková sazba</li>
                  <li>• Rychlejší vyřízení</li>
                  <li>• Bez zástavy</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Americká hypotéka</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Zajištění nemovitostí</li>
                  <li>• Na libovolný účel</li>
                  <li>• Nižší sazby než neúčelový</li>
                  <li>• Delší doba splatnosti</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tipy */}
          <div className="mt-16 bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              💡 Jak získat nejlepší úvěr?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Před žádostí:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Porovnejte RPSN u více bank</li>
                  <li>• Zkontrolujte si kreditní historii</li>
                  <li>• Připravte doklady o příjmech</li>
                  <li>• Zvažte potřebnou výši úvěru</li>
                  <li>• Vyberte optimální dobu splatnosti</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Při splácení:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Plaťte včas, abyste neplatili penále</li>
                  <li>• Využívejte mimořádné splátky</li>
                  <li>• Zvažte refinancování při poklesu sazeb</li>
                  <li>• Sledujte si zůstatek úvěru</li>
                  <li>• Neakumulujte více úvěrů najednou</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Často kladené otázky</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold mb-2">Jaký je rozdíl mezi úrokem a RPSN?</h3>
                <p className="text-gray-700">
                  Úroková sazba je cena za půjčené peníze, zatímco RPSN zahrnuje všechny náklady 
                  spojené s úvěrem včetně poplatků. RPSN je vždy vyšší než úroková sazba.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold mb-2">Mohu si úvěr předčasně splatit?</h3>
                <p className="text-gray-700">
                  Ano, podle zákona máte právo na předčasné splacení. Banka může účtovat 
                  sankci max. 1% ze splácené částky (při splatnosti nad 1 rok) nebo 0,5% (do 1 roku).
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold mb-2">Co ovlivňuje výši úrokové sazby?</h3>
                <p className="text-gray-700">
                  Hlavní faktory: kreditní historie, výše a stabilita příjmů, délka úvěru, 
                  účel úvěru, vztah s bankou a aktuální situace na trhu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}