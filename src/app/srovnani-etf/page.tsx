'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Metadata } from 'next';
import Layout from '@/components/Layout';
import ETFDetailedComparison from '@/components/ETFDetailedComparison';
import ETFComparisonContainer from '@/components/comparison/ETFComparisonContainer';
import { ETF } from '@/types/etf';
import SEOHead from '@/components/SEO/SEOHead';
import { supabase } from '@/integrations/supabase/client';

export default function SrovnaniETF() {
  const searchParams = useSearchParams();
  
  // Read URL parameters for pre-selected ETFs
  const compareParam = searchParams?.get('compare');
  const preSelectedISINs = compareParam ? compareParam.split(',').filter(isin => isin.trim() !== '') : undefined;
  
  // If we have pre-selected ETFs from URL, start directly with detailed comparison
  const [showDetailedComparison, setShowDetailedComparison] = useState(!!preSelectedISINs);
  const [selectedETFsForComparison, setSelectedETFsForComparison] = useState<ETF[]>([]);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ETF srovnání 2025 - Nejlepší nástroj pro porovnání ETF fondů",
    "description": "Porovnejte více než 3500 ETF fondů podle TER poplatků, výkonnosti a rizika. ETF srovnání zdarma pro české investory s DEGIRO ETF filtery.",
    "url": "https://etfpruvodce.cz/srovnani-etf",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "featureList": [
      "Srovnání více než 3500 ETF fondů",
      "Filtrování podle TER poplatků",
      "Analýza historické výkonnosti", 
      "DEGIRO zdarma ETF filtr",
      "Porovnání amerických a evropských ETF",
      "Detailní rizikové metriky"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CZK"
    },
    "provider": {
      "@type": "Organization",
      "name": "ETF průvodce.cz",
      "url": "https://etfpruvodce.cz"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Čeští investoři"
    }
  };

  const handleShowDetailedComparison = (selectedETFs: ETF[]) => {
    console.log('ETFComparison - handleShowDetailedComparison called with:', selectedETFs.length, 'ETFs');
    setSelectedETFsForComparison(selectedETFs);
    setShowDetailedComparison(true);
  };

  const handleBackToList = () => {
    setShowDetailedComparison(false);
  };

  // Load ETFs from URL parameters when component mounts
  useEffect(() => {
    const loadETFsFromURL = async () => {
      if (!preSelectedISINs || preSelectedISINs.length === 0) return;
      
      console.log('Loading ETFs from URL parameters:', preSelectedISINs);
      
      try {
        const { data, error } = await supabase
          .from('etf_funds')
          .select('*')
          .in('isin', preSelectedISINs);

        if (error) {
          console.error('Error loading ETFs from URL:', error);
          return;
        }

        const loadedETFs = data as unknown as ETF[];
        console.log('Loaded ETFs from URL:', loadedETFs.length);
        setSelectedETFsForComparison(loadedETFs);
      } catch (error) {
        console.error('Error loading ETFs from URL:', error);
      }
    };

    loadETFsFromURL();
  }, [preSelectedISINs]);

  if (showDetailedComparison) {
    return (
      <Layout>
        <ETFDetailedComparison
          selectedETFs={selectedETFsForComparison}
          onBack={handleBackToList}
        />
      </Layout>
    );
  }

  console.log('SrovnaniETF page - compareParam:', compareParam);
  console.log('SrovnaniETF page - preSelectedISINs:', preSelectedISINs);

  return (
    <Layout>
      <SEOHead
        title="ETF srovnání 2025 - Nejlepší nástroj pro porovnání ETF fondů České republiky"
        description="★ ETF srovnání ZDARMA ★ Porovnejte více než 3500 ETF fondů 2025. Filtrování podle TER poplatků, výkonnosti, rizika. Americké ETF, evropské ETF, DEGIRO zdarma ETF. Nejlepší ETF srovnání pro české investory."
        canonical="https://etfpruvodce.cz/srovnani-etf"
        keywords="ETF srovnání, srovnání ETF fondů, ETF porovnání, nejlepší ETF 2025, ETF filtr, ETF search, DEGIRO ETF zdarma, americké ETF, evropské ETF, TER poplatky ETF, výkonnost ETF, ETF databáze česky"
        ogImage="https://etfpruvodce.cz/og-etf-comparison.jpg"
        schema={webAppSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ETFComparisonContainer 
          onShowDetailedComparison={handleShowDetailedComparison} 
          preSelectedISINs={preSelectedISINs}
        />
        
        {/* SEO optimalizovaný obsah */}
        <div className="mt-16 space-y-8">
          {/* Co je ETF srovnání */}
          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.2s]">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center rounded-full bg-violet-100 w-12 h-12 group-hover:bg-violet-200 transition-colors hover-scale">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-violet-800 transition-colors">Co je ETF srovnání a proč je důležité?</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                <strong>ETF srovnání</strong> je klíčový nástroj pro každého českého investora, který chce najít <strong>nejlepší ETF fondy</strong> pro své portfolio. 
                Náš pokročilý nástroj pro <strong>porovnání ETF fondů</strong> umožňuje filtrovat a analyzovat více než <strong>3500 ETF fondů</strong> podle kritérií, 
                které jsou nejdůležitější pro vaše investiční cíle.
              </p>
              <p className="text-gray-600 mb-4">
                Při <strong>srovnání ETF</strong> je důležité porovnávat nejen <strong>TER poplatky</strong>, ale také výkonnost, riziko, velikost fondu 
                a dostupnost u českých brokerů jako je <strong>DEGIRO</strong>, <strong>XTB</strong> nebo <strong>Interactive Brokers</strong>.
              </p>
            </div>
          </div>

          {/* Jak používat ETF srovnání */}
          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.4s]">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center rounded-full bg-emerald-100 w-12 h-12 group-hover:bg-emerald-200 transition-colors hover-scale">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">Jak používat náš ETF srovnání nástroj</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center rounded-full bg-violet-100 w-10 h-10 group-hover:bg-violet-200 transition-colors hover-scale">
                    <span className="text-xl">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-violet-800 transition-colors">Filtrace podle kategorií</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Americké ETF</strong> - S&P 500, NASDAQ, Russell fondy</li>
                  <li>• <strong>Evropské ETF</strong> - STOXX 600, FTSE Europe fondy</li>
                  <li>• <strong>Světové ETF</strong> - MSCI World, FTSE All-World</li>
                  <li>• <strong>Dluhopisové ETF</strong> - Government a corporate bonds</li>
                  <li>• <strong>Komoditní ETF</strong> - Zlato, ropu, broad commodities</li>
                </ul>
              </div>
              <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center rounded-full bg-emerald-100 w-10 h-10 group-hover:bg-emerald-200 transition-colors hover-scale">
                    <span className="text-xl">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-800 transition-colors">Pokročilé filtry</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>TER poplatky</strong> - Najděte nejlevnější ETF</li>
                  <li>• <strong>Výkonnost</strong> - 1Y, 3Y, 5Y historické výnosy</li>
                  <li>• <strong>Velikost fondu</strong> - Minimální assets under management</li>
                  <li>• <strong>DEGIRO dostupnost</strong> - ETF zdarma bez poplatků</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Výhody našeho ETF srovnání */}
          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.6s]">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center rounded-full bg-violet-100 w-12 h-12 group-hover:bg-violet-200 transition-colors hover-scale">
                <span className="text-2xl">⭐</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-violet-800 transition-colors">Proč používat náš ETF srovnání nástroj?</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover text-center">
                <div className="flex items-center justify-center rounded-full bg-emerald-100 w-16 h-16 group-hover:bg-emerald-200 transition-colors hover-scale mx-auto mb-4">
                  <span className="text-2xl">🇨🇿</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-emerald-800 transition-colors">Česky lokalizováno</h3>
                <p className="text-gray-600">Speciálně připraveno pro české investory s českými brokery a daňovými aspekty</p>
              </div>
              <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover text-center">
                <div className="flex items-center justify-center rounded-full bg-violet-100 w-16 h-16 group-hover:bg-violet-200 transition-colors hover-scale mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-violet-800 transition-colors">Rychlé a přesné</h3>
                <p className="text-gray-600">Okamžité filtrování a srovnání tisíců ETF fondů v reálném čase</p>
              </div>
              <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover text-center">
                <div className="flex items-center justify-center rounded-full bg-emerald-100 w-16 h-16 group-hover:bg-emerald-200 transition-colors hover-scale mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-emerald-800 transition-colors">Detailní analýza</h3>
                <p className="text-gray-600">Porovnání výkonnosti, rizika, poplatků a dalších klíčových metrik</p>
              </div>
            </div>
          </div>

          {/* Nejoblíbenější ETF kategorie */}
          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.6s]">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center rounded-full bg-violet-100 w-12 h-12 group-hover:bg-violet-200 transition-colors hover-scale">
                <span className="text-2xl">⭐</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-violet-800 transition-colors">Nejoblíbenější ETF kategorie pro srovnání</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center rounded-full bg-emerald-100 w-10 h-10 group-hover:bg-emerald-200 transition-colors hover-scale">
                    <span className="text-xl">🇺🇸</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-800 transition-colors">Top americké ETF pro srovnání</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded hover:bg-emerald-50 transition-colors">
                    <span className="font-medium text-gray-900">S&P 500 ETF (CSPX, VOO)</span>
                    <span className="text-sm text-gray-600">TER od 0.03%</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded hover:bg-emerald-50 transition-colors">
                    <span className="font-medium text-gray-900">NASDAQ ETF (QQQ, EQQQ)</span>
                    <span className="text-sm text-gray-600">TER od 0.30%</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded hover:bg-emerald-50 transition-colors">
                    <span className="font-medium text-gray-900">US Total Market (VTI, ITOT)</span>
                    <span className="text-sm text-gray-600">TER od 0.03%</span>
                  </div>
                </div>
              </div>
              <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center rounded-full bg-violet-100 w-10 h-10 group-hover:bg-violet-200 transition-colors hover-scale">
                    <span className="text-xl">🌍</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-violet-800 transition-colors">Top světové ETF pro srovnání</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded hover:bg-violet-50 transition-colors">
                    <span className="font-medium text-gray-900">MSCI World (IWDA, SWDA)</span>
                    <span className="text-sm text-gray-600">TER od 0.20%</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded hover:bg-violet-50 transition-colors">
                    <span className="font-medium text-gray-900">FTSE All-World (VWCE)</span>
                    <span className="text-sm text-gray-600">TER 0.22%</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded hover:bg-violet-50 transition-colors">
                    <span className="font-medium text-gray-900">MSCI ACWI (SSAC, SPYI)</span>
                    <span className="text-sm text-gray-600">TER od 0.20%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ sekce */}
          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-2xl p-8 card-hover animate-fade-in [animation-delay:0.8s]">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center rounded-full bg-violet-100 w-12 h-12 group-hover:bg-violet-200 transition-colors hover-scale">
                <span className="text-2xl">❓</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-violet-800 transition-colors">Často kladené otázky o ETF srovnání</h2>
            </div>
            <div className="space-y-6">
              <details className="group border-b border-gray-200 pb-4">
                <summary className="font-semibold text-lg cursor-pointer text-gray-900 hover:text-violet-600 transition-colors">
                  Jak najít nejlevnější ETF pomocí srovnání?
                </summary>
                <div className="mt-3 text-gray-700">
                  V našem ETF srovnání nástroji použijte filtr "TER poplatky" a seřaďte podle nejnižší hodnoty. 
                  Nejlevnější ETF mají TER pod 0.10% ročně. Pozor však na to, že nejlevnější nemusí být vždy nejlepší volba.
                </div>
              </details>

              <details className="group border-b border-gray-200 pb-4">
                <summary className="font-semibold text-lg cursor-pointer text-gray-900 hover:text-violet-600 transition-colors">
                  Které ETF jsou dostupné zdarma na DEGIRO?
                </summary>
                <div className="mt-3 text-gray-700">
                  DEGIRO nabízí více než 200 ETF bez transakčních poplatků. V našem srovnání najdete filtr "DEGIRO zdarma", 
                  který zobrazí pouze tyto fondy. Populární volby zahrnují IWDA, VWCE, CSPX a mnohé další.
                </div>
              </details>

              <details className="group border-b border-gray-200 pb-4">
                <summary className="font-semibold text-lg cursor-pointer text-gray-900 hover:text-violet-600 transition-colors">
                  Jak porovnat výkonnost ETF za různá období?
                </summary>
                <div className="mt-3 text-gray-700">
                  Náš ETF srovnání nástroj zobrazuje historické výnosy za 1, 3 a 5 let. Můžete řadit podle jakéhokoli období. 
                  Důležité je porovnávat ETF ze stejné kategorie a zohlednit i riziko (volatilitu).
                </div>
              </details>

              <details className="group border-b border-gray-200 pb-4">
                <summary className="font-semibold text-lg cursor-pointer text-gray-900 hover:text-violet-600 transition-colors">
                  Kolik ETF mohu porovnat současně?
                </summary>
                <div className="mt-3 text-gray-700">
                  V našem nástroji můžete vybrat až 3 ETF fondy pro detailní side-by-side porovnání. 
                  To je optimální počet pro důkladnou analýzu a rozhodování mezi konkrétními možnostmi.
                </div>
              </details>

              <details className="group border-b border-gray-200 pb-4">
                <summary className="font-semibold text-lg cursor-pointer text-gray-900 hover:text-violet-600 transition-colors">
                  Jsou americké ETF lepší než evropské ETF?
                </summary>
                <div className="mt-3 text-gray-700">
                  Záleží na vaších cílech. Americké ETF často mají nižší TER a větší likviditu, ale evropské ETF 
                  jsou daňově výhodnější pro české investory (UCITS struktura). Použijte náš srovnání pro konkrétní analýzu.
                </div>
              </details>
            </div>
          </div>

          {/* Call to Action */}
          <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 card-hover animate-fade-in [animation-delay:1.0s] text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex items-center justify-center rounded-full bg-white/20 w-12 h-12 group-hover:bg-white/30 transition-colors hover-scale">
                <span className="text-2xl">🚀</span>
              </div>
              <h2 className="text-2xl font-bold">Začněte s ETF srovnáním ještě dnes</h2>
            </div>
            <p className="text-xl mb-6 opacity-90">
              Najděte nejlepší ETF fondy pro vaše investiční cíle pomocí našeho pokročilého srovnání nástroje.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/nejlepsi-etf/nejlepsi-etf-2025" className="hover-scale bg-white text-violet-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Nejlepší ETF 2025
              </a>
              <a href="/kde-koupit-etf" className="hover-scale bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-800 transition-colors border border-white/20">
                Kde koupit ETF
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}