import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, AlertCircle, CheckCircle, Target, DollarSign, TrendingUp, Users } from 'lucide-react';
import InternalLinking from '@/components/SEO/InternalLinking';
import DividendPortfolioPerformance from '@/components/portfolio/DividendPortfolioPerformance';
import { getETFLink } from '@/data/etf-mappings';

export const metadata: Metadata = {
  title: 'Dividendové Portfolio 2025 | 4% dividendy + růst',
  description: 'Kompletní průvodce dividendovým portfoliem s Dividend Aristocrats. Očekávaný dividendový výnos 4% ročně + růst kurzu. Zaměření na kvalitní společnosti s dlouholetou tradicí růstu dividend.',
  keywords: [
    'dividendové portfolio',
    'dividend aristocrats',
    'dividendové akcie',
    'pasivní příjem',
    'dividendové ETF',
    'REIT investice',
    'kvalitní dividendy',
    'růst dividend'
  ],
  openGraph: {
    title: 'Dividendové Portfolio 2025 | 4% dividendy + růst',
    description: 'Kompletní průvodce dividendovým portfoliem s Dividend Aristocrats. 95% dividendové akcie + 5% REITs s očekávaným dividendovým výnosem 4% ročně + růst kurzu.',
    url: 'https://www.etfpruvodce.cz/portfolio-strategie/dividendove-portfolio',
    siteName: 'ETF průvodce.cz',
    images: [
      {
        url: 'https://www.etfpruvodce.cz/og-dividendove-portfolio.jpg',
        width: 1200,
        height: 630,
        alt: 'Dividendové Portfolio - 95% dividend aristocrats, 5% REITs',
      },
    ],
    locale: 'cs_CZ',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/portfolio-strategie/dividendove-portfolio'
  }
};

export default function DividendPortfolioPage() {
  return (
    <Layout>
      <div className="bg-white">
        {/* Modern Hero Section */}
        <section className="relative min-h-[60vh] bg-gradient-to-br from-violet-50 to-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-violet-50/50"></div>
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-200 to-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-violet-300 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
              
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-violet-200/50">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Dividendové Portfolio
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Dividendové{' '}
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Portfolio
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Zaměření na kvalitní společnosti s dlouholetou tradicí růstu dividend. <strong>4% ročních dividend</strong> + růst kurzu pro pasivní příjem.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="#allocation"
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 h-12"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Zobrazit složení
                  </Link>
                  <Link 
                    href="#vykonnost"
                    className="bg-white/80 backdrop-blur-sm border-2 border-violet-300 text-violet-700 hover:bg-violet-50 px-8 py-3 text-lg font-semibold rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2 h-12"
                  >
                    <Target className="w-5 h-5" />
                    Aktuální výnos
                  </Link>
                </div>
              </div>
              
              {/* Right Content - Visual Element */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-violet-200/50 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Klíčové údaje</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Dividendový výnos</span>
                      <span className="text-2xl font-bold text-violet-600">4%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Složení</span>
                      <span className="font-semibold text-gray-900">95/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Riziko</span>
                      <span className="font-semibold text-violet-600">Umírněné</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rebalancing</span>
                      <span className="font-semibold text-gray-900">Ročně</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
                    <p className="text-sm font-semibold text-violet-800">
                      💰 Pro milovníky pasivního příjmu
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
              "name": "Dividendové Portfolio",
              "description": "Kompletní průvodce dividendovým portfoliem s Dividend Aristocrats. 95% dividendové akcie + 5% REITs s očekávaným dividendovým výnosem 4% ročně.",
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
              "feesAndCommissionsSpecification": "TER 0.20-0.50% ročně",
              "interestRate": "4% dividendový výnos + růst kurzu"
            })
          }}
        />

        <div className="max-w-6xl mx-auto px-4 py-12">


          {/* Portfolio Složení */}
          <div id="allocation">
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BarChart3 className="text-violet-600" />
                  Složení Dividendového Portfolia
                </CardTitle>
              </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Dividendové akcie (Dividend Aristocrats)</span>
                    <span className="text-lg font-bold">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div className="bg-violet-600 h-3 rounded-full" style={{width: '95%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600"><Link href={getETFLink('ZPRG')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">ZPRG</Link> - SPDR S&P Global Dividend Aristocrats UCITS ETF</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Nemovitostní investice (REITs)</span>
                    <span className="text-lg font-bold">5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div className="bg-orange-600 h-3 rounded-full" style={{width: '5%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600"><Link href={getETFLink('IWDP')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">IWDP</Link> - iShares Developed Markets Property Yield UCITS ETF</p>
                </div>
              </div>
            </CardContent>
            </Card>
          </div>

          {/* Reálná výkonnost */}
          <div id="performance">
            <DividendPortfolioPerformance />
          </div>

          {/* Co jsou Dividend Aristocrats */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="text-violet-600" />
                  Co jsou Dividend Aristocrats?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-violet-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">👑 Kritéria výběru</h4>
                  <p className="text-sm">Společnosti, které zvyšovaly dividendy nejméně 25 let v řadě</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">💪 Kvalita a stabilita</h4>
                  <p className="text-sm">Pouze nejkvalitnější společnosti s dlouhodobě rostoucími zisky</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🌍 Globální diverzifikace</h4>
                  <p className="text-sm">Akcie z vyspělých trhů po celém světě</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📊 Pravidelný růst</h4>
                  <p className="text-sm">Konzistentní růst dividend i v krizových obdobích</p>
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
                    <span>Pravidelný pasivní příjem z dividend</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Dlouhodobý růst hodnoty dividend</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Investice do nejkvalitnějších společností</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Částečná ochrana proti inflaci</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Jednoduchá implementace s 2 ETF</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Vhodné pro konzervativní investory</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Implementace */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="text-violet-600" />
                Jak investovat do Dividendového Portfolia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">📋 Doporučené UCITS ETF</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Dividend Aristocrats (95%):</span>
                      <span className="font-semibold"><Link href={getETFLink('ZPRG')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ZPRG</Link></span>
                    </div>
                    <div className="flex justify-between">
                      <span>REITs (5%):</span>
                      <span className="font-semibold"><Link href={getETFLink('IWDP')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">IWDP</Link></span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">⚖️ Rebalancing strategie</h4>
                  <div className="space-y-2 text-sm">
                    <div>• <strong>Kdy:</strong> Jednou ročně nebo při odchylce 5%+</div>
                    <div>• <strong>Jak:</strong> Prodej převážené, nákup podvážené části</div>
                    <div>• <strong>Tip:</strong> Využijte nové investice k rebalancingu</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-violet-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Tip pro začátečníky</h4>
                <p className="text-sm text-violet-800">
                  Začněte pouze s <Link href={getETFLink('ZPRG')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">ZPRG</Link> (100%). 
                  REITs přidejte později, když získáte zkušenosti s dividendovým investováním.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Varování a rizika */}
          <Card className="mb-12 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-800">
                <AlertCircle className="text-amber-600" />
                Důležitá upozornění
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-800">
              <ul className="space-y-2 text-sm">
                <li>• <strong>Daně z dividend:</strong> V ČR podléhají dani z příjmů (15% srážková daň)</li>
                <li>• <strong>Měnové riziko:</strong> ETF je denominován v USD, kurz může ovlivnit výnosy</li>
                <li>• <strong>Koncentrace:</strong> Zaměření hlavně na velké stabilní společnosti</li>
                <li>• <strong>Nižší růst:</strong> Dividend aristocrats rostou pomaleji než technologické akcie</li>
                <li>• <strong>Sektorové riziko:</strong> Převaha tradičních sektorů (utilities, spotřeba)</li>
              </ul>
            </CardContent>
          </Card>

          {/* FAQ sekce */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="text-violet-600" />
                Časté otázky o Dividendovém Portfoliu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    question: "Jak fungují Dividend Aristocrats a proč jsou výjimeční?",
                    answer: "Dividend Aristocrats jsou společnosti, které zvyšovaly dividendy nejméně 25 let v řadě. To dokazuje jejich schopnost generovat stabilní zisky i během ekonomických krizí. Pouze nejkvalitnější společnosti s konzervativním managementem a silnou tržní pozicí dokážou tento rekord udržet."
                  },
                  {
                    question: "Jaký je skutečný dividendový výnos tohoto portfolia?",
                    answer: "ZPRG má aktuální dividendový výnos kolem 2-2.5%, REITs kolem 3-4%. Vážený průměr portfolia je cca 2.3%. Ale klíčové je, že tyto dividendy každoročně rostou! Historicky Dividend Aristocrats zvyšovali dividendy o 6-8% ročně, takže výnos se postupně zvyšuje."
                  },
                  {
                    question: "Jak se dividendové portfolio chová během krizí?",
                    answer: "Dividend Aristocrats jsou obecně defenzivnější než celkový trh. Během krize 2008 klesli méně než S&P 500 a rychleji se zotavili. Navíc většina z nich pokračovala ve zvyšování dividend i během krize. Jsou to 'blue chip' společnosti s stabilními obchodními modely."
                  },
                  {
                    question: "Proč pouze 5% REITs a ne více?",
                    answer: "REITs mají vysoký dividendový výnos (3-5%), ale jsou volatilnější a citlivější na úrokové sazby. 5% zajišťuje diversifikaci a dodatečný příjem, aniž by zvýšilo riziko portfolia. Pokud chcete vyšší dividendový výnos, můžete zvýšit podíl REITs na 10-15%."
                  },
                  {
                    question: "Jak se vypořádat s daněmi z dividend v České republice?",
                    answer: "Dividendy z ETF podléhají 15% srážkové dani (díky smlouvě o zamezení dvojího zdanění s Irskem). Daň se strhává automaticky u brokera. Dividendy také musíte uvést v daňovém přiznání jako příjem z kapitálového majetku. Zvažte držení v DIP pro daňové výhody."
                  },
                  {
                    question: "Je toto portfolio vhodné pro mladé investory?",
                    answer: "Pro mladé investory (20-35 let) je obvykle lepší růstová strategie s vyšším podílem technologických akcií. Dividendové portfolio je ideální pro investory 40+, kteří chtějí kombinovat růst s příjmem, nebo pro kohokoli, kdo preferuje pravidelný cash flow z investic."
                  },
                  {
                    question: "Můžu reinvestovat dividendy automaticky?",
                    answer: "Závisí na brokerovi. Někteří brokeři nabízejí automatickou reinvestici dividend (DRIP). Pokud ne, můžete dividendy reinvestovat manuálně čtvrtletně. Reinvestice dividend je klíčová pro dosažení kompoundingového efektu dlouhodobého růstu."
                  },
                  {
                    question: "Jak toto portfolio srovnat s klasickým 60/40?",
                    answer: "Dividendové portfolio má podobnou volatilitu jako 60/40, ale poskytuje vyšší current yield (aktuální výnos). Má také lepší ochranu proti inflaci díky růstu dividend. Na druhou stranu může zaostávat za 60/40 během bull marketů růstových akcií."
                  }
                ].map((faq, index) => (
                  <details key={index} className="group border border-gray-200 rounded-xl hover:border-violet-300 transition-all duration-300 bg-white hover:shadow-lg">
                    <summary className="flex justify-between items-center w-full px-8 py-6 text-left cursor-pointer group-hover:bg-gradient-to-r group-hover:from-violet-50 group-hover:to-purple-50 rounded-xl group-open:rounded-b-none transition-all">
                      <span className="font-semibold text-lg text-gray-900 group-hover:text-violet-800 pr-4">{faq.question}</span>
                      <div className="flex-shrink-0 w-8 h-8 bg-violet-100 group-hover:bg-violet-200 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                        <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>
                    <div className="px-8 pb-6 pt-2">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </CardContent>
          </Card>

          <InternalLinking
            relatedLinks={[
              { title: "Backtest portfolia", href: "/kalkulacky/backtest-portfolia", description: "Otestujte historickou výkonnost Dividendového Portfolia" },
              { title: "Monte Carlo simulátor", href: "/kalkulacky/monte-carlo-simulator", description: "Prognóza budoucnosti s tisíci scénářů" },
              { title: "Portfolio strategie přehled", href: "/portfolio-strategie", description: "Porovnejte všech 5 investičních strategií" },
              { title: "Nobel Portfolio", href: "/portfolio-strategie/nobel-portfolio", description: "Vyvážené portfolio s 6% očekávaným výnosem" },
              { title: "Akciové Portfolio", href: "/portfolio-strategie/akciove-portfolio", description: "Agresivní růstová strategie s 7-8% výnosem" }
            ]}
            title="Související strategie a nástroje"
            className="mt-16"
          />
        </div>
      </div>
    </Layout>
  );
}