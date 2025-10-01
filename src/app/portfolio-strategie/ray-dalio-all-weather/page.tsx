import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Cloud, BarChart3, AlertCircle, CheckCircle, Target, Brain } from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import AllWeatherPortfolioPerformance from '@/components/portfolio/AllWeatherPortfolioPerformance';
import { getETFLink } from '@/data/etf-mappings';

export const metadata: Metadata = {
  title: 'Ray Dalio All-Weather Portfolio 2025 | 5% s ETF | ETF průvodce.cz',
  description: 'Kompletní průvodce All-Weather strategií Ray Dalia z Bridgewater. Očekávaný výnos 5% ročně s minimální volatilitou ve všech ekonomických podmínkách.',
  keywords: [
    'Ray Dalio',
    'All-Weather portfolio',
    'Bridgewater',
    'všepogodní strategie',
    'risk parity',
    'ETF investování',
    'diverzifikace rizika',
    'ekonomické cykly'
  ],
  openGraph: {
    title: 'Ray Dalio All-Weather Portfolio 2025 | 5% s ETF',
    description: 'Kompletní průvodce All-Weather strategií Ray Dalia z Bridgewater. Očekávaný výnos 5% ročně s minimální volatilitou ve všech ekonomických podmínkách.',
    url: 'https://www.etfpruvodce.cz/portfolio-strategie/ray-dalio-all-weather',
    siteName: 'ETF průvodce.cz',
    images: [
      {
        url: 'https://www.etfpruvodce.cz/og-ray-dalio-all-weather.jpg',
        width: 1200,
        height: 630,
        alt: 'Ray Dalio All-Weather Portfolio - 40% dlouhodobé dluhopisy, 30% akcie, 15% střednědobé dluhopisy, 7.5% komodity, 7.5% zlato',
      },
    ],
    locale: 'cs_CZ',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/portfolio-strategie/ray-dalio-all-weather'
  }
};

export default function RayDalioAllWeatherPage() {
  return (
    <Layout>
      <div className="bg-white">
        {/* Modern Hero Section */}
        <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-gray-50/30 to-slate-50/50"></div>
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-slate-200 to-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-gray-200 to-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-slate-300 to-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
              
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-slate-200/50">
                  <Cloud className="w-4 h-4 mr-2" />
                  All-Weather Portfolio
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Ray Dalio{' '}
                  <span className="bg-gradient-to-r from-slate-600 via-gray-600 to-slate-600 bg-clip-text text-transparent">
                    All-Weather
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Pokročilá strategie od legendárního Ray Dalia s <strong>5-8% očekávaným výnosem</strong> a minimální volatilitou ve všech ekonomických podmínkách.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="#allocation"
                    className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 h-12"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Zobrazit složení
                  </Link>
                  <Link 
                    href="#vykonnost"
                    className="bg-white/80 backdrop-blur-sm border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 text-lg font-semibold rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2 h-12"
                  >
                    <Target className="w-5 h-5" />
                    Aktuální výnos
                  </Link>
                </div>
              </div>
              
              {/* Right Content - Visual Element */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-400/20 to-gray-400/20 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Klíčové údaje</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Očekávaný výnos</span>
                      <span className="text-2xl font-bold text-slate-600">5-8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Složení</span>
                      <span className="font-semibold text-gray-900">40/30/15/7.5/7.5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Riziko</span>
                      <span className="font-semibold text-slate-600">Konzervativní</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rebalancing</span>
                      <span className="font-semibold text-gray-900">Čtvrtletně</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-semibold text-slate-800">
                      🌦️ Funguje ve všech ekonomických podmínkách
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialProduct",
              "name": "Ray Dalio All-Weather Portfolio",
              "description": "Kompletní průvodce All-Weather strategií Ray Dalia z Bridgewater. 40% dlouhodobé dluhopisy + 30% akcie + 15% střednědobé dluhopisy + 7.5% komodity + 7.5% zlato s očekávaným výnosem 5-8% ročně.",
              "category": "Investment Strategy",
              "provider": {
                "@type": "Organization",
                "name": "ETF průvodce.cz",
                "url": "https://www.etfpruvodce.cz"
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Conservative Investors"
              },
              "feesAndCommissionsSpecification": "TER 0.15-0.60% ročně",
              "interestRate": "5-8% očekávaný výnos ročně",
              "riskRating": "Konzervativní",
              "creator": {
                "@type": "Person",
                "name": "Ray Dalio",
                "jobTitle": "Founder of Bridgewater Associates"
              }
            })
          }}
        />

        <div className="max-w-6xl mx-auto px-4 py-12">

          {/* Portfolio Složení */}
          <div id="allocation">
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BarChart3 className="text-slate-600" />
                  Složení All-Weather Portfolia
                </CardTitle>
              </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Dlouhodobé státní dluhopisy</span>
                    <span className="text-lg font-bold">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div className="bg-blue-600 h-3 rounded-full" style={{width: '40%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600"><Link href={getETFLink('SXRC')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">SXRC</Link> - iShares USD Treasury Bond 20+yr UCITS ETF USD (Acc)</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Akcie</span>
                    <span className="text-lg font-bold">30%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div className="bg-green-600 h-3 rounded-full" style={{width: '30%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600"><Link href={getETFLink('VWCE')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">VWCE</Link> - Vanguard FTSE All-World</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Střednědobé státní dluhopisy</span>
                    <span className="text-lg font-bold">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div className="bg-purple-600 h-3 rounded-full" style={{width: '15%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600"><Link href={getETFLink('EGOV7')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">EGOV7</Link> - Amundi Euro Government Bond 7-10Y UCITS ETF Acc</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Komodity</span>
                    <span className="text-lg font-bold">7.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div className="bg-yellow-500 h-3 rounded-full" style={{width: '7.5%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600"><Link href={getETFLink('COMM')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">COMM</Link> - Invesco Bloomberg Commodity UCITS ETF Acc</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Zlato</span>
                    <span className="text-lg font-bold">7.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div className="bg-orange-500 h-3 rounded-full" style={{width: '7.5%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600"><Link href={getETFLink('SGLN')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">SGLN</Link> - iShares Physical Gold ETC</p>
                </div>
              </div>
            </CardContent>
            </Card>
          </div>

          {/* Filosofie Ray Dalia */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Brain className="text-slate-600" />
                  Filozofie Ray Dalia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🌍 Ekonomické prostředí</h4>
                  <p className="text-sm">Čtyři možné scénáře: růst/pokles × inflace/deflace</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">⚖️ Risk Parity</h4>
                  <p className="text-sm">Vyvážení podle rizika, ne podle hodnoty investice</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🔄 Uncorrelated Returns</h4>
                  <p className="text-sm">Kombinace aktiv reagujících různě na ekonomické podmínky</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📊 Diverzifikace</h4>
                  <p className="text-sm">Jediný "free lunch" v investování</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" />
                  Výhody strategie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Funguje ve všech ekonomických cyklech</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Nejnižší volatilita ze všech portfolií</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Ochrana proti inflaci i deflaci</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Prověřeno největším hedge fondem světa</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Vysoká diverzifikace napříč třídami aktiv</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Minimální drawdowny</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Aktuální výkonnost */}
          <AllWeatherPortfolioPerformance />

          {/* 4 ekonomické scénáře */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Cloud className="text-slate-600" />
                Čtyři ekonomické scénáře
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-3">🚀 Růst + Nízká inflace</h4>
                    <div className="text-sm">
                      <div className="font-semibold mb-2">Výherce:</div>
                      <div>• Akcie (hlavní driver)</div>
                      <div>• Korporátní dluhopisy</div>
                      <div className="font-semibold mb-2 mt-3">Alokace: 30% akcií</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-3">❄️ Pokles + Deflace</h4>
                    <div className="text-sm">
                      <div className="font-semibold mb-2">Výherce:</div>
                      <div>• Dlouhodobé státní dluhopisy</div>
                      <div>• Hotovost</div>
                      <div className="font-semibold mb-2 mt-3">Alokace: 55% dluhopisů</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-red-700 mb-3">🔥 Růst + Vysoká inflace</h4>
                    <div className="text-sm">
                      <div className="font-semibold mb-2">Výherce:</div>
                      <div>• Komodity</div>
                      <div>• TIPS (inflační dluhopisy)</div>
                      <div className="font-semibold mb-2 mt-3">Alokace: 15% komodit + TIPS</div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-orange-700 mb-3">📉 Pokles + Inflace (Stagflace)</h4>
                    <div className="text-sm">
                      <div className="font-semibold mb-2">Výherce:</div>
                      <div>• TIPS</div>
                      <div>• Komodity (zlato)</div>
                      <div className="font-semibold mb-2 mt-3">Nejhorší scénář pro většinu portfolií</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Implementace */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="text-blue-600" />
                Praktická implementace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">🎯 Přesná alokace</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span><Link href={getETFLink('IGLT')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">IGLT</Link> (dlouhé dluhopisy):</span>
                      <span className="font-semibold">40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span><Link href={getETFLink('VWCE')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">VWCE</Link> (světové akcie):</span>
                      <span className="font-semibold">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span><Link href={getETFLink('IEGA')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">IEGA</Link> (střední dluhopisy):</span>
                      <span className="font-semibold">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span><Link href={getETFLink('CMDY')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">CMDY</Link> (komodity):</span>
                      <span className="font-semibold">7.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span><Link href={getETFLink('ITIP')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">ITIP</Link> (inflační dluhopisy):</span>
                      <span className="font-semibold">7.5%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">⚖️ Rebalancing pravidla</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Frekvence:</strong> Čtvrtletně</li>
                    <li>• <strong>Práh:</strong> Při odchylce &gt;3%</li>
                    <li>• <strong>Metoda:</strong> Band rebalancing</li>
                    <li>• <strong>Priority:</strong> Dlouhé dluhopisy first</li>
                    <li>• <strong>Náklady:</strong> Započítejte transakční poplatky</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Zjednodušená varianta pro začátečníky</h4>
                <div className="text-sm">
                  <div>• <strong>50%</strong> <Link href={getETFLink('IGLT')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">IGLT</Link> (dlouhé dluhopisy)</div>
                  <div>• <strong>40%</strong> <Link href={getETFLink('VWCE')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">VWCE</Link> (světové akcie)</div>
                  <div>• <strong>10%</strong> <Link href={getETFLink('SGLN')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">SGLN</Link> (zlato jako commodity proxy)</div>
                  <p className="text-xs text-gray-500 mt-2">Jednodušší implementace se zachováním základní filozofie</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rizika a nevýhody */}
          <Card className="mb-12 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-orange-700">
                <AlertCircle className="text-orange-600" />
                Rizika a nevýhody
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 p-6 rounded-lg">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Komplexnost:</strong> Vyžaduje 5 různých ETF a častý rebalancing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Nízký očekávaný výnos:</strong> Pouze 5% ročně</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Úrokové riziko:</strong> 55% v dluhopisech citlivých na sazby</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Náklady na rebalancing:</strong> Častější transakce = vyšší poplatky</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span><strong>Opportunity cost:</strong> V dlouhých bull trzích zaostává</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Pro koho je vhodné */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="text-purple-600" />
                Pro koho je All-Weather Portfolio vhodné?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-600 mb-4">✅ Ideální pro:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Velmi konzervativní investory</li>
                    <li>• Ty, kdo chtějí minimální volatilitu</li>
                    <li>• Investory blízko/v důchodu</li>
                    <li>• Ty, kdo se bojí krizí</li>
                    <li>• Pokročilé investory</li>
                    <li>• Lidi s velkým kapitálem (100k+ Kč)</li>
                    <li>• Ty, kdo chtějí "všepogodní" strategii</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-4">❌ Méně vhodné pro:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Mladé investory (pod 40)</li>
                    <li>• Ty, kdo hledají vysoké výnosy</li>
                    <li>• Začátečníky</li>
                    <li>• Investory s malým kapitálem</li>
                    <li>• Ty, kdo preferují jednoduchost</li>
                    <li>• Aktivní obchodníky</li>
                    <li>• Investory s vysokou tolerancí k riziku</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <section className="py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 px-6 py-3 rounded-full text-sm font-medium mb-6">
                <Cloud className="w-4 h-4 mr-2" />
                Často kladené otázky
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Vše o All-Weather Strategii
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Odpovědi na nejčastější dotazy o pokročilé strategii od Ray Dalia pro všechny ekonomické podmínky
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                question: "Proč All-Weather Portfolio obsahuje 55% dluhopisů?",
                answer: "Ray Dalio navrhuje vysoký podíl dluhopisů (40% dlouhodobé + 15% střednědobé), protože poskytují stabilitu a rostou během deflace a recese. Dluhopisy s dlouhou dobou splatnosti jsou velmi citlivé na úrokové sazby a mohou dosáhnout velkých zisků během krizí. Toto 'risk parity' vyváží volatilitu všech složek portfolia."
              },
              {
                question: "Jak funguje Risk Parity přístup v praxi?",
                answer: "Risk Parity znamená, že každá třída aktiv přispívá stejným dílem k celkovému riziku portfolia, ne k hodnotě. Akcie jsou volatilní, takže tvoří jen 30%. Dluhopisy jsou stabilnější, takže jich je více (55%). Komodity a zlato (15%) poskytují ochranu při inflaci. Výsledek je portfolio odolné vůči všem ekonomickým scénářům."
              },
              {
                question: "Je All-Weather příliš složité pro běžné investory?",
                answer: "Ano, vyžaduje 5 různých ETF a čtvrtletní rebalancing. Pro zjednodušení můžete použít 3-ETF verzi: 50% IGLT (dlouhé dluhopisy), 40% VWCE (akcie), 10% zlato. Zachováte základní principy, ale s jednodušší správou. Pokud chcete ještě jednodušší řešení, zvolte Permanent Portfolio s 4 aktivy po 25%."
              },
              {
                question: "Proč má All-Weather nižší výnos než jiné strategie?",
                answer: "All-Weather obětuje část výnosu pro stabilitu. Cílem není maximalizovat výnos, ale minimalizovat riziko při zachování slušného růstu. 5-8% ročně s minimální volatilitou je lepší než 10% s možností ztráty 50%. Pro konzervativní investory je předvídatelnost důležitější než maximální růst."
              },
              {
                question: "Jak se All-Weather chová během inflace?",
                answer: "Velmi dobře. Komodity a zlato (15%) přímo těží z inflace. Akcie (30%) dlouhodobě překonávají inflaci. Pouze dluhopisy trpí, ale jejich velký podíl je kompenzován ostatními složkami. All-Weather je jedna z mála strategií skutečně chráněných proti inflaci, na rozdíl od tradičního 60/40 portfolia."
              },
              {
                question: "Jaké ETF použít pro evropské investory?",
                answer: "Doporučujeme: IGLT (dlouhé evropské dluhopisy), VWCE (světové akcie), IEAA (střednědobé dluhopisy), CMCX (komodity), SGLN (zlato). Alternativy: VGLT místo IGLT, AGGH místo IEAA. Klíčové je zachovat proporce a používat EUR denominované ETF pro snížení měnového rizika."
              },
              {
                question: "Kdy rebalancovat a jak často?",
                answer: "Ray Dalio doporučuje čtvrtletní rebalancing nebo při odchylce >3% od cíle. Používejte 'band rebalancing' - když dluhopisy klesnou pod 37% nebo vystoupí nad 43%, rebalancujte zpět na 40%. Častější rebalancing zvyšuje náklady, řidší snižuje efektivitu strategie."
              },
              {
                question: "Funguje All-Weather i v Evropě nebo jen v USA?",
                answer: "Principy fungují globálně, ale implementace se liší. V Evropě jsou nižší úrokové sazby, jiná inflační dynamika a odlišné komodity. Použijte evropské ETF a přizpůsobte komoditní složku (více energie, méně zemědělství). Základní logika 4 ekonomických scénářů platí univerzálně."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-xl hover:border-slate-300 transition-all duration-300 bg-white hover:shadow-lg">
                <summary className="flex justify-between items-center w-full px-8 py-6 text-left cursor-pointer group-hover:bg-gradient-to-r group-hover:from-slate-50 group-hover:to-gray-50 rounded-xl group-open:rounded-b-none transition-all">
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-slate-800 pr-4">{faq.question}</span>
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-100 to-gray-100 rounded-full flex items-center justify-center group-hover:from-slate-200 group-hover:to-gray-200 transition-all">
                      <svg className="w-4 h-4 text-slate-600 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </summary>
                <div className="px-8 py-6 text-gray-700 leading-relaxed bg-gradient-to-r from-gray-50 to-slate-50 rounded-b-xl border-t border-gray-100">
                  {faq.answer}
                </div>
              </details>
            ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-slate-600 to-gray-600 text-white p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Zajímá vás All-Weather strategie?</h2>
            <p className="text-lg mb-6 opacity-90">
              Naučte se implementovat pokročilou strategii od Ray Dalia krok za krokem.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/srovnani-etf" className="bg-white text-slate-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Najít vhodné ETF
              </Link>
              <Link href="/kalkulacky/investicni-kalkulacka" className="bg-slate-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-400 transition-colors">
                Spočítat výnos
              </Link>
            </div>
          </div>

          {/* Related Links */}
          <InternalLinking
            relatedLinks={[
              {
                title: "Portfolio strategie přehled",
                href: "/portfolio-strategie",
                description: "Porovnejte všech 5 investičních strategií"
              },
              {
                title: "Permanentní Portfolio",
                href: "/portfolio-strategie/permanentni-portfolio", 
                description: "Jednodušší konzervativní alternativa"
              },
              {
                title: "Nobel Portfolio",
                href: "/portfolio-strategie/nobel-portfolio",
                description: "Vědecky podložená strategie s 6% výnosem"
              },
              {
                title: "Investiční kalkulačka",
                href: "/kalkulacky/investicni-kalkulacka",
                description: "Simulujte růst vašeho All-Weather portfolia"
              },
              {
                title: "Srovnání ETF fondů",
                href: "/srovnani-etf",
                description: "Najděte nejlepší ETF pro vaši strategii"
              }
            ]}
            title="Související strategie a nástroje"
            className="mt-16"
          />

        </div>

      </div>
    </Layout>
  );
}