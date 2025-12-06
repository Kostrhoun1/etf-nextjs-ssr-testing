'use client';

import React from 'react';
import Layout from '@/components/Layout';
import CalculatorHub from '@/components/CalculatorHub';
import SEOHead from '@/components/SEO/SEOHead';

import StructuredData from '@/components/SEO/StructuredData';
import InternalLinking from '@/components/SEO/InternalLinking';
import { Calculator, TrendingUp } from 'lucide-react';

export default function KalkulackyPage() {
  const currentYear = new Date().getFullYear();
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
        "name": "Finanční kalkulačky 2025",
        "item": "https://www.etfpruvodce.cz/kalkulacky"
      }
    ]
  };

  const sitemapSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Finanční kalkulačky 2025 - Kompletní přehled",
    "description": "Kompletní přehled všech finančních kalkulaček. Hypotéka, úvěry, čistá mzda, investice, penzi. Bezplatné nástroje s aktuálními daty 2025.",
    "url": "https://www.etfpruvodce.cz/kalkulacky",
    "breadcrumb": breadcrumbSchema,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Finanční kalkulačky",
      "numberOfItems": "10",
      "itemListElement": [
        {
          "@type": "SoftwareApplication",
          "position": 1,
          "name": "Hypoteční kalkulačka 2025",
          "url": "https://www.etfpruvodce.cz/kalkulacky/hypotecni-kalkulacka",
          "applicationCategory": "FinanceApplication"
        },
        {
          "@type": "SoftwareApplication",
          "position": 2,
          "name": "Kalkulačka čisté mzdy 2025",
          "url": "https://www.etfpruvodce.cz/kalkulacky/cisty-plat-2025",
          "applicationCategory": "FinanceApplication"
        },
        {
          "@type": "SoftwareApplication",
          "position": 3,
          "name": "Úvěrová kalkulačka - spotřebitelský úvěr",
          "url": "https://www.etfpruvodce.cz/kalkulacky/spotrebitelsky-uver",
          "applicationCategory": "FinanceApplication"
        }
      ]
    }
  };

  return (
    <Layout>
      <SEOHead
        title={`Finanční kalkulačky ${currentYear} - Hypotéka, úvěry, mzda | ETF průvodce.cz`}
        description={`✅ Kompletní přehled finančních kalkulaček ${currentYear}. Hypoteční kalkulačka, čistá mzda, spotřebitelské úvěry, investiční nástroje. Vše zdarma s aktuálními daty.`}
        canonical="https://www.etfpruvodce.cz/kalkulacky"
        keywords={`finanční kalkulačky ${currentYear}, hypoteční kalkulačka, kalkulačka čisté mzdy, úvěrová kalkulačka, investiční kalkulačky, bezplatné nástroje`}
        schema={sitemapSchema}
        ogImage="https://www.etfpruvodce.cz/og-kalkulacky.jpg"
      />
      <StructuredData data={breadcrumbSchema} />

      {/* Modern Hero Section */}
      <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-violet-50/30 to-blue-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-200 to-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-purple-200/50">
                <Calculator className="w-4 h-4 mr-2" />
                Aktualizováno pro rok {currentYear}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Finanční{' '}
                <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                  kalkulačky
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Kompletní sada bezplatných finančních nástrojů s nejnovějšími daty. 
                Od hypotéky až po pokročilé investiční analýzy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('kalkulacky')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Zobrazit kalkulačky
                </button>
                <button 
                  onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white/80 backdrop-blur-sm border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  Jak fungují?
                </button>
              </div>
            </div>
            
            {/* Right Content - Visual Element */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Proč naše kalkulačky?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Aktuální data {currentYear}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                    <span className="text-gray-700">Přesné výpočty jako banky</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Zdarma navždy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-700">Žádná registrace</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-semibold text-purple-800">
                    📊 10+ specializovaných nástrojů včetně backtestů
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="kalkulacky">


        {/* Samotný hub s kalkulačkami */}
        <CalculatorHub />

        {/* Často kladené otázky */}
        <section className="mb-12" id="faq">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Často kladené otázky
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Odpovědi na nejčastější dotazy o finančních kalkulačkách
            </p>
          </div>
          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.2s]">
            <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: `Jsou kalkulačky aktuální pro rok ${currentYear}?`,
                answer: `Ano, všechny nástroje jsou pravidelně aktualizovány s nejnovějšími sazbami, daňovými změnami a legislativními úpravami pro rok ${currentYear}. Sledujeme aktuální úrokové sazby bank, daňové tabulky a další relevantní data.`
              },
              {
                question: "Je používání kalkulaček zdarma?",
                answer: "Všechny kalkulačky jsou zcela zdarma bez jakýchkoli omezení. Nepotřebujete registraci ani předplatné. Nástroje budou vždy dostupné bezplatně."
              },
              {
                question: "Jak přesné jsou výpočty?",
                answer: "Používáme stejné matematické vzorce jako banky a finanční instituce. Výsledky jsou kontrolovány finančními experty a pravidelně ověřovány proti skutečným bankám a pojišťovnám."
              },
              {
                question: "Lze kalkulačky používat na mobilu?",
                answer: "Ano, všechny nástroje jsou plně responzivní a fungují perfektně na mobilních telefonech a tabletech. Optimalizovali jsme uživatelské rozhraní pro dotykové ovládání."
              },
              {
                question: "Ukládáte naše data?",
                answer: "Ne, všechny výpočty probíhají přímo ve vašem prohlížeči. Žádná data se neukládají ani neodesílají na naše servery. Vaše finanční informace zůstávají pouze u vás."
              },
              {
                question: "Máte i pokročilé nástroje?",
                answer: "Ano, nabízíme backtest portfolia pro historickou analýzu od roku 2000, Monte Carlo simulace pro prognózu budoucnosti, kalkulátor měnových dopadů na ETF, FIRE kalkulátor pro předčasný důchod a další pokročilé nástroje pro zkušené investory."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-purple-50 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-purple-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 text-gray-700 leading-relaxed bg-white rounded-b-lg">
                  {faq.answer}
                </div>
              </details>
            ))}
            </div>
          </div>
        </section>

        {/* Související stránky */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Srovnání ETF fondů",
              href: "/srovnani-etf",
              description: "Najděte nejlepší ETF pro investice"
            },
            {
              title: "Nejlepší brokeři 2025",
              href: "/srovnani-brokeru",
              description: "Kde nejlépe investovat a obchodovat"
            },
            {
              title: "Návod pro začátečníky",
              href: "/co-jsou-etf/jak-zacit-investovat",
              description: "Jak začít s investováním do ETF"
            },
            {
              title: "Investiční tipy 2025",
              href: "/tipy",
              description: "Aktuální investiční strategie a rady"
            }
          ]}
          title="Další užitečné stránky"
          className="mt-16"
        />
      </div>
    </Layout>
  );
}