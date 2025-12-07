import React from 'react';
import Layout from '@/components/Layout';
import CalculatorHub from '@/components/CalculatorHub';
import StructuredData from '@/components/SEO/StructuredData';
import InternalLinking from '@/components/SEO/InternalLinking';
import KalkulackyHero from './KalkulackyHero';
import { Metadata } from 'next';

const currentYear = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Finanční kalkulačky ${currentYear} - Hypotéka, úvěry, mzda`,
  description: `✅ Kompletní přehled finančních kalkulaček ${currentYear}. Hypoteční kalkulačka, čistá mzda, spotřebitelské úvěry, investiční nástroje. Vše zdarma s aktuálními daty.`,
  keywords: `finanční kalkulačky ${currentYear}, hypoteční kalkulačka, kalkulačka čisté mzdy, úvěrová kalkulačka, investiční kalkulačky, bezplatné nástroje`,
  openGraph: {
    title: `Finanční kalkulačky ${currentYear} - Hypotéka, úvěry, mzda`,
    description: `Kompletní přehled finančních kalkulaček ${currentYear}. Hypoteční kalkulačka, čistá mzda, spotřebitelské úvěry, investiční nástroje. Vše zdarma.`,
    url: 'https://www.etfpruvodce.cz/kalkulacky',
    siteName: 'ETF průvodce.cz',
    images: [{
      url: 'https://www.etfpruvodce.cz/og-kalkulacky.jpg',
      width: 1200,
      height: 630,
    }],
    locale: 'cs_CZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Finanční kalkulačky ${currentYear}`,
    description: `Kompletní přehled finančních kalkulaček. Hypotéka, úvěry, mzda, investice. Vše zdarma.`,
    images: ['https://www.etfpruvodce.cz/og-kalkulacky.jpg'],
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/kalkulacky',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function KalkulackyPage() {
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
        "name": `Finanční kalkulačky ${currentYear}`,
        "item": "https://www.etfpruvodce.cz/kalkulacky"
      }
    ]
  };

  const sitemapSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Finanční kalkulačky ${currentYear} - Kompletní přehled`,
    "description": `Kompletní přehled všech finančních kalkulaček. Hypotéka, úvěry, čistá mzda, investice, penzi. Bezplatné nástroje s aktuálními daty ${currentYear}.`,
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
          "name": `Hypoteční kalkulačka ${currentYear}`,
          "url": "https://www.etfpruvodce.cz/kalkulacky/hypotecni-kalkulacka",
          "applicationCategory": "FinanceApplication"
        },
        {
          "@type": "SoftwareApplication",
          "position": 2,
          "name": `Kalkulačka čisté mzdy ${currentYear}`,
          "url": "https://www.etfpruvodce.cz/kalkulacky/cisty-plat-2025",
          "applicationCategory": "FinanceApplication"
        },
        {
          "@type": "SoftwareApplication",
          "position": 3,
          "name": "Úvěrová kalkulačka - spotřebitelský úvěr",
          "url": "https://www.etfpruvodce.cz/kalkulacky/spotrebitelsky-uver",
          "applicationCategory": "FinanceApplication"
        },
        {
          "@type": "SoftwareApplication",
          "position": 4,
          "name": "Backtest portfolia",
          "url": "https://www.etfpruvodce.cz/kalkulacky/backtest-portfolia",
          "applicationCategory": "FinanceApplication"
        },
        {
          "@type": "SoftwareApplication",
          "position": 5,
          "name": "Monte Carlo simulátor",
          "url": "https://www.etfpruvodce.cz/kalkulacky/monte-carlo-simulator",
          "applicationCategory": "FinanceApplication"
        }
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Jsou kalkulačky aktuální pro rok ${currentYear}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Ano, všechny nástroje jsou pravidelně aktualizovány s nejnovějšími sazbami, daňovými změnami a legislativními úpravami pro rok ${currentYear}.`
        }
      },
      {
        "@type": "Question",
        "name": "Je používání kalkulaček zdarma?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Všechny kalkulačky jsou zcela zdarma bez jakýchkoli omezení. Nepotřebujete registraci ani předplatné."
        }
      },
      {
        "@type": "Question",
        "name": "Jak přesné jsou výpočty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Používáme stejné matematické vzorce jako banky a finanční instituce. Výsledky jsou kontrolovány finančními experty."
        }
      }
    ]
  };

  return (
    <Layout>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={sitemapSchema} />
      <StructuredData data={faqSchema} />

      {/* Hero Section - Client Component pro interaktivitu */}
      <KalkulackyHero currentYear={currentYear} />

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
