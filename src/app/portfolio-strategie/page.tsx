'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEO/SEOHead';
import PortfolioStrategies from '@/components/portfolio/PortfolioStrategies';
import PortfolioWizard from '@/components/onboarding/PortfolioWizard';
import InternalLinking from '@/components/SEO/InternalLinking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BarChart3, PieChart, Target, TrendingUp, Users } from 'lucide-react';

export default function PortfolioStrategiePage() {
  const currentYear = new Date().getFullYear();
  const [showWizard, setShowWizard] = useState(false);

  return (
    <Layout>
      <SEOHead 
        title="5 Osvědčených Portfolio Strategií pro ETF Investory 2025"
        description="Porovnejte reálnou performance 5 investičních strategií: Permanentní Portfolio, Ray Dalio All-Weather, Nobel Portfolio, Akciové a Dividendové. Včetně aktuálních dat z databáze ETF."
        keywords="portfolio strategie, ETF strategie, investiční portfolio, Ray Dalio All Weather, Nobel portfolio, dividendové portfolio, permanentní portfolio, performance ETF, asset allocation"
        schema={{
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "Portfolio Strategie pro ETF Investory",
          "description": "5 osvědčených portfolio strategií s reálnou performance z databáze ETF fondů",
          "provider": {
            "@type": "Organization",
            "name": "ETF průvodce.cz",
            "url": "https://etfpruvodce.cz"
          },
          "category": "Investment Strategy",
          "audience": {
            "@type": "Audience",
            "audienceType": "investors"
          }
        }}
      />
      
      <div className="bg-white">
        {/* Modern Hero Section */}
        <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-blue-50/50"></div>
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-200 to-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
              
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-violet-200/50">
                  <PieChart className="w-4 h-4 mr-2" />
                  Aktualizováno pro rok {currentYear}
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Portfolio{' '}
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    strategie
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Odhalte, která investiční strategie skutečně funguje! Testujeme 5 legendárních portfolií na reálných datech z 3000+ ETF fondů. 
                  Zjistěte, jestli byste dnes byli bohatší s Ray Daliem nebo Nobelovou nadací.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => document.getElementById('strategies')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 h-12"
                  >
                    <Target className="w-5 h-5" />
                    Zobrazit strategie
                  </button>
                  <button
                    onClick={() => setShowWizard(true)}
                    className="bg-white/80 backdrop-blur-sm border-2 border-violet-300 text-violet-700 hover:bg-violet-50 px-8 py-3 text-lg font-semibold rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2 h-12"
                  >
                    <Sparkles className="w-5 h-5" />
                    Použít průvodce
                  </button>
                </div>
              </div>
              
              {/* Right Content - Visual Element */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-blue-400/20 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Analýza založená na reálných datech</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                      <span className="text-gray-700">Historická performance z databáze ETF</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Přesné výpočty ze 3000+ fondů</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Osvědčené investiční strategie</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span className="text-gray-700">Aktuální data roku {currentYear}</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
                    <p className="text-sm font-semibold text-violet-800">
                      📊 5 osvědčených investičních strategií
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wizard Modal */}
        {showWizard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <PortfolioWizard onClose={() => setShowWizard(false)} />
            </div>
          </div>
        )}

        <div id="strategies">
          <PortfolioStrategies />
        </div>

        {/* Portfolio Selection Guide */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Která strategie vás udělá bohatým?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nezáleží na tom, jestli jste začátečník nebo zkušený investor. Záleží na tom, jestli dokážete dodržet strategii i v krizi. 
              Vyberte si tu, se kterou budete spát v klidu i když trhy padají.
            </p>
          </div>
          
          <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Průvodce výběrem portfolia</h3>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Odpovězte si na pár jednoduchých otázek a my vám doporučíme ideální strategii podle vašeho rizikového profilu, 
                investičního horizontu a životní situace.
              </p>
              <Button
                onClick={() => setShowWizard(true)}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
              >
                <Target className="w-5 h-5 mr-2" />
                Spustit průvodce výběrem
              </Button>
            </div>
          </Card>
        </div>

        {/* Strategy Selection CTA */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="bg-gradient-to-r from-blue-50 to-violet-50 border-violet-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Nejste si jisti kterou strategii vybrat?</h3>
                  <p className="text-gray-600 text-sm">Nechte si vytvořit personalizované portfolio na míru vašemu profilu</p>
                </div>
              </div>
              <Button
                onClick={() => setShowWizard(true)}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Průvodce modelovými portfolii
              </Button>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Často kladené otázky o portfolio strategiích
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Odpovědi na nejčastější dotazy o výběru a implementaci investičních strategií
            </p>
          </div>
          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.2s]">
            <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "Která portfolio strategie je nejlepší pro začátečníky?",
                answer: "Pro začátečníky doporučujeme Nobel Portfolio nebo Dividendové portfolio. Jsou jednoduché na implementaci, vyžadují pouze 2-3 ETF fondy a historicky dosahují solidních výnosů kolem 6% ročně. Začněte s 70% akcie (VWCE) a 30% dluhopisy (AGGH), postupně si najděte vlastní poměr podle tolerance k riziku."
              },
              {
                question: "Jak často mám rebalancovat portfolio podle strategie?",
                answer: "Doporučujeme rebalancing 2x ročně nebo když některá alokace vybočí o více než 5% od cílové hodnoty. Například u 60/40 portfolia rebalancujte když máte 65/35 nebo 55/45. Častější rebalancing není potřeba a zvyšuje transakční náklady."
              },
              {
                question: "Jsou portfolio strategie vhodné i pro malé částky?",
                answer: "Ano! Většina strategií funguje s částkami od 1000 Kč měsíčně. U malých částek doporučujeme začít s jedním širokým ETF (VWCE) a postupně přidávat další komponenty. Minimální investice do ETF je většinou 1 podíl (~70-100 Kč)."
              },
              {
                question: "Jak se liší výkonnost jednotlivých strategií?",
                answer: "Naše analýza z období 1995-2024 ukazuje: Akciové 7-8% (~7-8% ročně), Nobel 6% (~6%), Dividendové 4% dividendy + růst, All-Weather (~5-8%), Permanentní (~4%). Vyšší výnos = vyšší volatilita. Výběr závisí na vaší toleranci k riziku."
              },
              {
                question: "Mohu kombinovat více strategií v jednom portfoliu?",
                answer: "Není to doporučeno. Každá strategie má svou logiku a kombinování může vést k překrývání nebo protichůdným signálům. Lepší je vybrat jednu strategii a držet se jí dlouhodobě. Můžete postupně přecházet mezi strategiemi podle věku a životní situace."
              },
              {
                question: "Jak zohlednit český trh v globálních strategiích?",
                answer: "Globální strategie automaticky obsahují český trh (cca 0,1% z MSCI World). Pro vyšší expozici můžete přidat 5-10% středoevropských ETF, ale pozor na home bias. Diverzifikace je klíčová - neinvestujte více než 10% do domácího trhu."
              },
              {
                question: "Kdy změnit portfolio strategii?",
                answer: "Strategii měňte jen při zásadních změnách: přiblížení k důchodu (snížení rizika), změna finanční situace nebo rizikového profilu. Neměňte kvůli krátkodobé performance. Nejhorší je časté přepínání mezi strategiemi - 'strategy hopping' ničí dlouhodobé výnosy."
              },
              {
                question: "Které ETF fondy použít pro implementaci strategií?",
                answer: "Doporučujeme nízkonákladové ETF: akcie (VWCE, CSPX, EUNL), dluhopisy (AGGH, IEAA), komodity (CMCX), nemovitosti (EPRA). Vždy kontrolujte TER pod 0,5%, vysokou likviditu a tracking error. Konkrétní ETF najdete v našem srovnání fondů."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg hover:border-violet-200 transition-colors">
                <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-violet-50 rounded-lg group-open:rounded-b-none transition-colors">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-violet-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-violet-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Related Links */}
        <InternalLinking
          relatedLinks={[
            {
              title: "Jak začít investovat do ETF",
              href: "/co-jsou-etf/jak-zacit-investovat",
              description: "Kompletní průvodce s detailním popisem strategií pro začátečníky"
            },
            {
              title: "Srovnání ETF fondů",
              href: "/srovnani-etf",
              description: "Najděte nejlepší ETF pro vaše portfolio"
            },
            {
              title: "Investiční kalkulačka",
              href: "/kalkulacky/investicni-kalkulacka",
              description: "Simulujte růst vašeho portfolia"
            },
            {
              title: "Monte Carlo simulátor",
              href: "/kalkulacky/monte-carlo-simulator",
              description: "Analýza rizik a pravděpodobnosti úspěchu"
            },
            {
              title: "Nejlepší ETF 2025",
              href: "/nejlepsi-etf/nejlepsi-etf-2025",
              description: "Doporučené ETF fondy pro jednotlivé strategie"
            }
          ]}
          title="Související nástroje a články"
          className="mt-16"
        />
      </div>
    </Layout>
  );
}