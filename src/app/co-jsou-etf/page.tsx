import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Metadata } from 'next';
import { BookOpen, Calculator, TrendingUp } from 'lucide-react';
import InternalLinking, { ETFGuideRelatedLinks } from '@/components/SEO/InternalLinking';

export const metadata: Metadata = {
  title: 'Co jsou ETF fondy? | Kompletní průvodce pro české investory 2025',
  description: 'Kompletní průvodce Exchange Traded Funds pro české investory. Naučte se pasivní investování, porovnejte nejlepší ETF a začněte investovat ještě dnes.',
  keywords: 'ETF fondy, co jsou ETF, Exchange Traded Fund, pasivní investování, VWCE, CSPX, SWDA',
  openGraph: {
    title: 'Co jsou ETF fondy? | ETF průvodce.cz',
    description: 'Kompletní průvodce Exchange Traded Funds pro české investory. Naučte se pasivní investování, porovnejte nejlepší ETF a začněte investovat ještě dnes.',
    url: 'https://etfpruvodce.cz/co-jsou-etf',
  },
};

const WhatAreETFs: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Layout>
      {/* Modern Hero Section */}
      <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-blue-50/50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-emerald-200/50">
                <BookOpen className="w-4 h-4 mr-2" />
                Kompletní průvodce ETF {currentYear}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Co jsou{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                  ETF fondy?
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Naučte se pasivní investování s nejpopulárnějším investičním nástrojem. 
                ETF fondy jednoduše vysvětleny pro české investory.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/srovnani-etf" 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  Srovnat ETF fondy
                </Link>
                <Link 
                  href="/kalkulacky/investicni-kalkulacka" 
                  className="bg-white/80 backdrop-blur-sm border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Kalkulačka výnosů
                </Link>
              </div>
            </div>
            
            {/* Right Content - Visual Element */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Klíčové výhody ETF</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-700">Nízké poplatky 0,03-0,5% ročně</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    <span className="text-gray-700">Automatická diverzifikace</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Vysoká likvidita</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-700">Transparentnost</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                  <p className="text-sm font-semibold text-emerald-800">
                    💡 Jeden ETF = tisíce firem po celém světe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <article className="prose prose-lg max-w-none">
          {/* 1. Definice ETF */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">ETF jednoduše vysvětleno</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <p className="text-xl text-gray-800 mb-6">
                  <strong className="text-emerald-700">ETF (Exchange Traded Fund)</strong> je investiční fond, který se obchoduje na burze jako akcie. 
                  Jedním nákupem získáte podíl ve stovkách nebo tisících světových firem automaticky.
                </p>
                
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6 border border-emerald-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Klíčové vlastnosti ETF fondů:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span className="text-gray-700">Nízké poplatky (0,03-0,5%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span className="text-gray-700">Automatická diverzifikace</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span className="text-gray-700">Vysoká likvidita</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span className="text-gray-700">Transparentnost</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <img 
                  src="/images/etf-kosik-vs-akcie.png" 
                  alt="ETF košík vs jednotlivé akcie - srovnání investičních strategií" 
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </section>

          {/* 2. Geografická diverzifikace ETF */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Světová diverzifikace ETF fondů</h2>
            
            <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
              <div className="md:col-span-2">
                <p className="text-lg text-gray-800 mb-6">
                  Jeden ETF vám umožní investovat do <strong>celého světa najednou</strong>. Například ETF VWCE obsahuje 
                  3800+ firem z desítek zemí a automaticky vás diverzifikuje napříč všemi kontinenty.
                </p>
                
                <p className="text-lg text-gray-700">
                  Místo vybírání jednotlivých akcií z různých zemí stačí jeden nákup ETF a automaticky získáte 
                  vyváženou expozici vůči všem hlavním světovým trhům podle jejich ekonomické velikosti.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-900">🇺🇸 Severní Amerika</span>
                    <span className="text-blue-700 font-bold">64%</span>
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-900">🇪🇺 Evropa</span>
                    <span className="text-emerald-700 font-bold">15%</span>
                  </div>
                </div>
                <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-violet-900">🇯🇵 Japonsko</span>
                    <span className="text-violet-700 font-bold">6%</span>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-amber-900">🌏 Ostatní trhy</span>
                    <span className="text-amber-700 font-bold">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Nejlepší ETF pro začátečníky */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nejlepší ETF fondy pro začátečníky v roce 2025</h2>
            
            <p className="text-lg text-gray-700 mb-8">
              Pro začátečníky doporučujeme začít s jedním <strong>celosvětovým ETF</strong>, který poskytuje okamžitou diverzifikaci 
              do tisíců firem z celého světa. Zde jsou nejpopulárnější volby:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Link href="/etf/IE00BK5BQT80" className="border-2 border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all group">
                <div className="text-center">
                  <div className="text-4xl mb-4">🌍</div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-emerald-600">VWCE</h3>
                  <div className="text-gray-600 mb-3">Vanguard FTSE All-World</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Počet firem:</span>
                      <span className="font-semibold">3800+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TER poplatek:</span>
                      <span className="font-semibold text-emerald-600">0,22%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Výkonnost 5 let:</span>
                      <span className="font-semibold">+11,2% p.a.</span>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/etf/IE00B5BMR087" className="border-2 border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all group">
                <div className="text-center">
                  <div className="text-4xl mb-4">🇺🇸</div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-emerald-600">CSPX</h3>
                  <div className="text-gray-600 mb-3">iShares Core S&P 500</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Počet firem:</span>
                      <span className="font-semibold">500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TER poplatek:</span>
                      <span className="font-semibold text-emerald-600">0,07%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Výkonnost 5 let:</span>
                      <span className="font-semibold">+13,1% p.a.</span>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/etf/IE00B4L5Y983" className="border-2 border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all group">
                <div className="text-center">
                  <div className="text-4xl mb-4">🏢</div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-emerald-600">SWDA</h3>
                  <div className="text-gray-600 mb-3">iShares Core MSCI World</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Počet firem:</span>
                      <span className="font-semibold">1600+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TER poplatek:</span>
                      <span className="font-semibold text-emerald-600">0,20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Výkonnost 5 let:</span>
                      <span className="font-semibold">+12,8% p.a.</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            
          </section>

          {/* 4. Jak fungují ETF technicky */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Jak fungují ETF fondy? Mechanismus pasivního investování</h2>
            
            <p className="text-lg text-gray-700 mb-8">
              ETF fungují na principu <strong>pasivního sledování indexů</strong>. Správce fondu automaticky nakupuje 
              všechny akcie obsažené v daném indexu ve správných poměrech podle jejich tržní kapitalizace.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <h3 className="text-xl font-semibold mb-4 text-emerald-800 flex items-center gap-2">
                  <span>🔄</span> Fyzická replikace
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>ETF skutečně vlastní všechny akcie z indexu</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Nejbezpečnější způsob replikace</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Používá VWCE, CSPX, SWDA</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span>Minimální tracking error</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center gap-2">
                  <span>📊</span> Syntetická replikace
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Používá deriváty (swapy) místo akcií</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Umožňuje přístup k exotickým trhům</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Counterparty riziko</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Nižší transakční náklady</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. ETF vs jiné investice */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">ETF vs akcie vs aktivní fondy - srovnání</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 border-b">Kritérium</th>
                    <th className="text-center py-4 px-6 font-semibold text-emerald-700 border-b">ETF fondy</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700 border-b">Jednotlivé akcie</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700 border-b">Aktivní fondy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 font-medium">Diverzifikace</td>
                    <td className="text-center py-4 px-6">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ✅ Automatická
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ❌ Ruční
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ⚠️ Závisí
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 font-medium">Poplatky ročně</td>
                    <td className="text-center py-4 px-6">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ✅ 0,03-0,5%
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ✅ 0% (jen broker)
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ❌ 1-3%
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 font-medium">Časová náročnost</td>
                    <td className="text-center py-4 px-6">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ✅ Minimální
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ❌ Vysoká
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ⚠️ Střední
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Pro začátečníky</td>
                    <td className="text-center py-4 px-6">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ✅ Ideální
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ❌ Náročné
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ❌ Drahé
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Praktická ukázka dopadu poplatků */}
            <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
              <h3 className="font-bold text-lg text-red-900 mb-4 flex items-center gap-2">
                💸 Poplatky při investování 10 000 Kč měsíčně po 20 let
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-3">ETF fond (0,2% poplatek)</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Celková investice:</span>
                      <span className="font-semibold">2 400 000 Kč</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Po 20 letech:</span>
                      <span className="font-semibold text-emerald-600">4 853 044 Kč</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zisk:</span>
                      <span className="font-semibold text-emerald-600">+2 453 044 Kč</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-3">Aktivní fond (1,8% poplatek)</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Celková investice:</span>
                      <span className="font-semibold">2 400 000 Kč</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Po 20 letech:</span>
                      <span className="font-semibold text-red-600">4 040 000 Kč</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zisk:</span>
                      <span className="font-semibold text-red-600">+1 640 000 Kč</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-red-800 font-semibold mb-3">
                  ⚠️ Rozdíl: <span className="text-xl">813 044 Kč</span> méně kvůli vyšším poplatkům!
                </p>
                <a 
                  href="/kalkulacky/kalkulacka-poplatku-etf" 
                  className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 text-sm font-semibold rounded-lg transition-all"
                >
                  🧮 Spočítejte si dopad poplatků
                </a>
              </div>
            </div>
          </section>

          {/* 6. Jak začít investovat do ETF - 3 jednoduché kroky */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Jak začít investovat do ETF - 3 jednoduché kroky</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Krok 1: Vyberte si ETF */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-200 text-center flex flex-col">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-emerald-700">1</span>
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-4">Vyberte si ETF</h3>
                <p className="text-emerald-800 mb-6 flex-grow">
                  Porovnejte ETF fondy podle poplatků, výnosů a oblastí investování. Najděte si ty nejlepší pro vaše portfolio.
                </p>
                <Link href="/srovnani-etf" className="block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-sm font-semibold rounded-lg transition-all mt-auto">
                  🔍 Porovnat ETF fondy
                </Link>
              </div>
              
              {/* Krok 2: Rozhodněte se kolik investovat */}
              <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-8 border border-blue-200 text-center flex flex-col">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-700">2</span>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-4">Rozhodněte se kolik investovat</h3>
                <p className="text-blue-800 mb-6 flex-grow">
                  Spočítejte si, kolik investovat měsíčně a jaké můžete očekávat výnosy při různých strategiích.
                </p>
                <Link href="/kalkulacky/investicni-kalkulacka" className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-semibold rounded-lg transition-all mt-auto">
                  💰 Spočítejte výnosy
                </Link>
              </div>
              
              {/* Krok 3: Vyberte si brokera a pravidelně investujte */}
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-8 border border-violet-200 text-center flex flex-col">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-violet-700">3</span>
                </div>
                <h3 className="text-xl font-bold text-violet-900 mb-4">Vyberte si brokera a pravidelně investujte</h3>
                <p className="text-violet-800 mb-6 flex-grow">
                  Kde a jak koupit ETF? Porovnejte poplatky, funkce a dostupné ETF u různých brokerů.
                </p>
                <Link href="/kde-koupit-etf" className="block bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 text-sm font-semibold rounded-lg transition-all mt-auto">
                  🏦 Srovnání brokerů
                </Link>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-bold text-xl text-emerald-900 mb-3">Nejjednodušší start pro začátečníky</h3>
                <p className="text-emerald-800 mb-6">
                  Pokud se nechcete zabývat výběrem a chcete začít jednoduše, máme pro vás osvědčenou kombinaci:
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <h4 className="font-semibold text-emerald-900 mb-2">📈 Doporučený ETF</h4>
                  <p className="text-sm text-emerald-800 mb-3">
                    <strong>VWCE</strong> - nejpopulárnější ETF pokrývající celý svět
                  </p>
                  <Link href="/etf/IE00BK5BQT80" className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-lg transition-all inline-block">
                    Podrobnosti o VWCE →
                  </Link>
                </div>
                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <h4 className="font-semibold text-emerald-900 mb-2">🏦 Doporučený broker</h4>
                  <p className="text-sm text-emerald-800 mb-3">
                    <strong>XTB</strong> - česká podpora a nulové poplatky
                  </p>
                  <Link href="/xtb-recenze" className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-lg transition-all inline-block">
                    Recenze XTB →
                  </Link>
                </div>
              </div>
              
            </div>
          </section>

          {/* 7. Často kladené otázky */}
          <section className="mb-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Často kladené otázky o ETF fondech
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Odpovědi na nejčastější dotazy o ETF investování pro české investory
              </p>
            </div>
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.2s]">
              <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  question: "Jsou ETF fondy bezpečné?",
                  answer: "ETF s označením UCITS (většina evropských ETF) jsou velmi bezpečné díky přísné regulaci Evropské unie. Vaše peníze jsou odděleny od majetku správce fondu podle zákona o kolektivním investování. I kdyby správce ETF zkrachoval, vaše investice zůstávají chráněny jako samostatný majetek. ETF jsou proto bezpečnější než jednotlivé akcie nebo aktivní fondy."
                },
                {
                  question: "Jak dlouho držet ETF investice?",
                  answer: "ETF jsou určené pro dlouhodobé investování (5+ let). Čím déle držíte, tím více se vyrovnají krátkodobé výkyvy. Historická data ukazují, že při držení déle než 15 let byla pravděpodobnost ztráty téměř nulová. Daňová výhoda v ČR: Zisky z prodeje ETF jsou po 3 letech držení osvobozeny od daně z příjmu."
                },
                {
                  question: "Jaký je rozdíl mezi VWCE a CSPX?",
                  answer: "VWCE (Vanguard FTSE All-World) obsahuje 3800+ firem z celého světa s TER 0,22%, zatímco CSPX (iShares Core S&P 500) obsahuje 500 největších US firem s TER 0,07%. Pro začátečníky doporučujeme VWCE - poskytuje větší diverzifikaci a automaticky vás chrání před koncentračním rizikem jednoho regionu."
                },
                {
                  question: "Jaké jsou poplatky u ETF a jak se platí?",
                  answer: "ETF mají nejnižší poplatky ze všech investičních instrumentů. TER (Total Expense Ratio) je 0,03-0,5% ročně a automaticky se strhává z hodnoty ETF. Navíc platíte broker poplatky za nákup/prodej - Trading 212 a XTB nabízí 0% poplatky. Spread (rozdíl mezi nákupní a prodejní cenou) je u velkých ETF obvykle 0,01-0,05%."
                },
                {
                  question: "S kolika penězi začít investovat do ETF?",
                  answer: "Můžete začít investovat do ETF už s 1000-5000 Kč. Moderní brokeři jako Trading 212 nebo XTB umožňují nákup frakčních podílů, takže nemusíte kupovat celý podíl ETF. Důležitější než velikost počáteční investice je pravidelnost - investování 3000 Kč měsíčně po dobu 20 let může při průměrném výnosu 7% p.a. vyrůst na více než 1,5 milionu korun."
                },
                {
                  question: "Jak se platí daně z ETF v České republice?",
                  answer: "Při držení méně než 3 roky platíte 15% daň z příjmu z realizovaného zisku. Při držení 3+ roky je zisk z prodeje zcela osvobozen od daně! Akumulační ETF (VWCE, CSPX) nevyplácí dividendy, takže neplatíte žádnou daň během držení. Pro daňovou efektivitu vybírejte akumulační ETF."
                },
                {
                  question: "Jaké jsou nevýhody ETF fondů?",
                  answer: "ETF kopírují trh, takže během recesí klesají stejně jako celý trh. Zahraniční ETF jsou vystaveny měnovému riziku. U menších ETF může být větší spread. Tracking error způsobuje malé odchylky od indexu (0,1-0,3% ročně). Nemůžete ovlivnit, které konkrétní akcie ETF drží. Nevýhody ETF jsou však minimální ve srovnání s výhodami."
                }
              ].map((faq, index) => (
                <details key={index} className="group border border-gray-200 rounded-lg hover:border-emerald-200 transition-colors">
                  <summary className="flex justify-between items-center w-full px-6 py-4 text-left bg-gray-50 cursor-pointer hover:bg-emerald-50 rounded-lg group-open:rounded-b-none transition-colors">
                    <span className="font-semibold text-lg text-gray-900 group-hover:text-emerald-800">{faq.question}</span>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-emerald-600 transition-all group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* 8. Závěr a CTA */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Začněte investovat do ETF fondů ještě dnes</h2>
              <p className="text-xl mb-8 opacity-90">
                ETF fondy jsou nejjednodušší způsob, jak začít s pasivním investováním. 
                Nízké poplatky, automatická diverzifikace a dlouhodobé zhodnocení.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/srovnani-etf" className="bg-white text-emerald-600 px-8 py-4 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all">
                  Srovnat všechny ETF
                </Link>
                <Link href="/kde-koupit-etf" className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-white/10 transition-all">
                  Kde koupit ETF
                </Link>
              </div>
            </div>
          </section>
        </article>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Internal Linking */}
        <InternalLinking 
          relatedLinks={ETFGuideRelatedLinks} 
        />
      </div>
    </Layout>
  );
};

export default WhatAreETFs;