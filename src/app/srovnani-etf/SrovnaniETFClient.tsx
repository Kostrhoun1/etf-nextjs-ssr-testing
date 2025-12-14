'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Layout from '@/components/Layout';
import ETFDetailedComparison from '@/components/ETFDetailedComparison';
import ETFComparisonContainer from '@/components/comparison/ETFComparisonContainer';
import FeaturedETFSection from '@/components/etf/FeaturedETFSection';
import { ETF } from '@/types/etf';
import SEOHead from '@/components/SEO/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { ETFBasicInfo } from '@/lib/etf-data';

interface FeaturedETFs {
  bySize: ETFBasicInfo[];
  byPerformance: ETFBasicInfo[];
  byRating: ETFBasicInfo[];
  lowCost: ETFBasicInfo[];
}

interface SrovnaniETFContentProps {
  searchParams: { [key: string]: string | string[] | undefined };
  featuredETFs: FeaturedETFs;
  totalCount: number;
  lastModified: string | null;
}

function SrovnaniETFContent({ searchParams, featuredETFs, totalCount, lastModified }: SrovnaniETFContentProps) {
  
  // Read URL parameters for pre-selected ETFs
  const compareParam = searchParams?.compare;
  const compareString = Array.isArray(compareParam) ? compareParam[0] : compareParam;
  const preSelectedISINs = compareString ? compareString.split(',').filter(isin => isin.trim() !== '') : undefined;
  
  console.log('SrovnaniETF page - compareParam:', compareParam);
  console.log('SrovnaniETF page - compareString:', compareString);
  console.log('SrovnaniETF page - preSelectedISINs:', preSelectedISINs);
  console.log('SrovnaniETF page - showDetailedComparison will be:', !!preSelectedISINs);
  
  // Check if we have ISINs (already converted from tickers on server)
  const hasISINs = preSelectedISINs && preSelectedISINs.length > 0 && 
    preSelectedISINs.every(param => param.length >= 12 && /^[A-Z]{2}/.test(param));
  
  console.log('SrovnaniETF page - hasISINs:', hasISINs);
  
  // If we have ISINs, start directly with detailed comparison
  const [showDetailedComparison, setShowDetailedComparison] = useState(hasISINs);
  const [selectedETFsForComparison, setSelectedETFsForComparison] = useState<ETF[]>([]);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ETF srovnání 2025 - Nejlepší nástroj pro porovnání ETF fondů",
    "description": "Porovnejte více než 4300 ETF fondů podle TER poplatků, výkonnosti a rizika. ETF srovnání zdarma pro české investory s DEGIRO ETF filtery.",
    "url": "https://www.etfpruvodce.cz/srovnani-etf",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "featureList": [
      "Srovnání více než 4300 ETF fondů",
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
      "url": "https://www.etfpruvodce.cz"
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
    console.log('🔥 useEffect STARTED - preSelectedISINs:', preSelectedISINs);
    
    // Skip if no preSelectedISINs or if already have selected ETFs
    if (!preSelectedISINs || preSelectedISINs.length === 0 || selectedETFsForComparison.length > 0) {
      console.log('Skipping useEffect - no params or already have ETFs');
      return;
    }
    
    const loadETFsFromURL = async () => {
      console.log('Loading ETFs from URL parameters:', preSelectedISINs);
      
      try {
        // If we got here and have ISINs, load them directly
        if (hasISINs) {
          console.log('🎯 Loading ETFs directly with ISINs:', preSelectedISINs);
          const { data, error } = await supabase
            .from('etf_funds')
            .select('*')
            .in('isin', preSelectedISINs);
            
          if (error) {
            console.error('Error loading ETFs from ISINs:', error);
            return;
          }

          const loadedETFs = data as unknown as ETF[];
          console.log('✅ Loaded ETFs from ISINs:', loadedETFs.length);
          setSelectedETFsForComparison(loadedETFs);
          return;
        }
        
        // For static pages with tickers, we should have server-side conversion
        // so this fallback should rarely be needed
        console.log('🔄 Client-side ticker conversion (fallback):', preSelectedISINs);
        
        // Find ETFs by tickers using all ticker fields
        const tickerFields = [
          'primary_ticker',
          'exchange_1_ticker', 'exchange_2_ticker', 'exchange_3_ticker', 'exchange_4_ticker', 'exchange_5_ticker',
          'exchange_6_ticker', 'exchange_7_ticker', 'exchange_8_ticker', 'exchange_9_ticker', 'exchange_10_ticker'
        ];
        
        const orConditions = preSelectedISINs.map(symbol => 
          tickerFields.map(field => `${field}.eq.${symbol}`).join(',')
        ).join(',');
        
        const { data, error } = await supabase
          .from('etf_funds')
          .select('*')
          .or(orConditions);
          
        if (error) {
          console.error('Error looking up tickers:', error);
          return;
        }
        
        const foundETFs = data as unknown as ETF[];
        
        if (foundETFs && foundETFs.length > 0) {
          console.log('✅ Found ETFs for tickers:', foundETFs.length);
          setSelectedETFsForComparison(foundETFs);
          setShowDetailedComparison(true);
        } else {
          console.warn('No ETFs found for tickers:', preSelectedISINs);
        }
      } catch (error) {
        console.error('Error loading ETFs from URL:', error);
      }
    };

    loadETFsFromURL();
  }, [preSelectedISINs, hasISINs, selectedETFsForComparison.length]);

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

  return (
    <Layout>
      <SEOHead
        title="ETF srovnání 2025 - Nejlepší nástroj pro porovnání ETF fondů České republiky"
        description="★ ETF srovnání ZDARMA ★ Porovnejte více než 4300 ETF fondů 2025. Filtrování podle TER poplatků, výkonnosti, rizika. Americké ETF, evropské ETF, DEGIRO zdarma ETF. Nejlepší ETF srovnání pro české investory."
        canonical="https://www.etfpruvodce.cz/srovnani-etf"
        keywords="ETF srovnání, srovnání ETF fondů, ETF porovnání, nejlepší ETF 2025, ETF filtr, ETF search, DEGIRO ETF zdarma, americké ETF, evropské ETF, TER poplatky ETF, výkonnost ETF, ETF databáze česky"
        ogImage="https://www.etfpruvodce.cz/og-etf-comparison.jpg"
        schema={webAppSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Server-rendered featured ETFs for SEO */}
        <FeaturedETFSection
          bySize={featuredETFs.bySize}
          byPerformance={featuredETFs.byPerformance}
          byRating={featuredETFs.byRating}
          lowCost={featuredETFs.lowCost}
          totalCount={totalCount}
        />

        {/* Interactive comparison tool */}
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
                Náš pokročilý nástroj pro <strong>porovnání ETF fondů</strong> umožňuje filtrovat a analyzovat více než <strong>4300 ETF fondů</strong> podle kritérií, 
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
                <span className="text-2xl">🔍</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">Jak používat ETF srovnání?</h2>
            </div>
            <div className="prose max-w-none">
              <ol className="text-gray-600 space-y-3">
                <li><strong>Vyberte kategorii ETF</strong> - americké akcie, evropské akcie, dluhopisy nebo komodity</li>
                <li><strong>Nastavte filtry</strong> - TER poplatky, velikost fondu, výkonnost nebo dostupnost u DEGIRO</li>
                <li><strong>Porovnejte výsledky</strong> - analyzujte riziko vs výnos různých ETF fondů</li>
                <li><strong>Detailní srovnání</strong> - vyberte až 5 ETF pro podrobné porovnání vedle sebe</li>
              </ol>
            </div>
          </div>

          {/* Nejpopulárnější ETF kategorie - statický obsah pro crawlery */}
          <div className="sr-only">
            <h2>Nejpopulárnější ETF kategorie:</h2>
            <ul>
              <li>MSCI World ETF (110 fondů) - globální diverzifikace s důrazem na vyspělé trhy</li>
              <li>Government Bond ETF (100 fondů) - stabilní dluhopisové investice</li>
              <li>S&P 500 ETF (78 fondů) - americké velké společnosti</li>
              <li>MSCI Europe ETF (72 fondů) - evropské akciové trhy</li>
              <li>STOXX Europe 600 ETF (44 fondů) - široká evropská diverzifikace</li>
              <li>MSCI Emerging Markets ETF (27 fondů) - rozvíjející se trhy</li>
              <li>EURO STOXX 50 ETF (21 fondů) - největší evropské společnosti</li>
              <li>Bitcoin ETF (19 fondů) - kryptoměnové investice</li>
              <li>Nasdaq-100 ETF (15 fondů) - technologické akcie</li>
            </ul>
            
            <h3>Dostupné filtry:</h3>
            <ul>
              <li>TER poplatky: 0% - 2%</li>
              <li>Velikost fondu: všechny velikosti</li>
              <li>Distribuční politika: akumulační vs distribuční</li>
              <li>Replikační metoda: fyzická vs syntetická</li>
              <li>Region: globální, americké, evropské, asijské</li>
              <li>Měna: EUR, USD, GBP, CHF a další</li>
              <li>DEGIRO zdarma: ano/ne</li>
              <li>Páková ETF: ano/ne</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface SrovnaniETFClientProps {
  searchParams: { [key: string]: string | string[] | undefined };
  featuredETFs: FeaturedETFs;
  totalCount: number;
  lastModified: string | null;
}

export default function SrovnaniETFClient({ searchParams, featuredETFs, totalCount, lastModified }: SrovnaniETFClientProps) {
  return (
    <Suspense fallback={<div>Načítání ETF srovnání...</div>}>
      <SrovnaniETFContent
        searchParams={searchParams}
        featuredETFs={featuredETFs}
        totalCount={totalCount}
        lastModified={lastModified}
      />
    </Suspense>
  );
}