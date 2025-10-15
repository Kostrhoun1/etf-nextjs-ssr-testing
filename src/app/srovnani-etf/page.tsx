import React from 'react';
import { Metadata } from 'next';
import Script from 'next/script';
import SrovnaniETFClient from './SrovnaniETFClient';

const currentYear = new Date().getFullYear();

// Dynamic metadata generation to handle query parameters
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const compareParam = resolvedSearchParams?.compare;

  // Build canonical URL with query parameters if present
  let canonicalUrl = 'https://etfpruvodce.cz/srovnani-etf';
  if (compareParam) {
    const compareString = Array.isArray(compareParam) ? compareParam[0] : compareParam;
    canonicalUrl += `?compare=${encodeURIComponent(compareString)}`;
  }

  return {
    title: `ETF srovnání ${currentYear} - Porovnání všech ETF fondů | ETF průvodce.cz`,
    description: `🔍 Nejpokročilejší ETF srovnání pro české investory. Porovnejte 3500+ ETF podle TER, výkonnosti a rizika. DEGIRO filtry, live databáze, zdarma.`,
    keywords: `ETF srovnání, srovnání ETF fondů, ETF porovnání, nejlepší ETF ${currentYear}, ETF filtr, DEGIRO ETF zdarma, americké ETF, evropské ETF, TER poplatky ETF, výkonnost ETF, ETF databáze`,
    authors: [{ name: 'ETF průvodce.cz' }],
    openGraph: {
      title: `ETF srovnání ${currentYear} - Porovnání všech ETF fondů`,
      description: `Nejpokročilejší ETF srovnání pro české investory. Porovnejte 3500+ ETF podle TER, výkonnosti a rizika.`,
      url: canonicalUrl,
      siteName: 'ETF průvodce.cz',
      images: [{
        url: 'https://etfpruvodce.cz/og-etf-comparison.jpg',
        width: 1200,
        height: 630,
      }],
      locale: 'cs_CZ',
      type: 'website',
      publishedTime: `${currentYear}-01-01`,
      modifiedTime: new Date().toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: `ETF srovnání ${currentYear}`,
      description: `Nejpokročilejší ETF srovnání pro české investory. Porovnejte 3500+ ETF podle TER a výkonnosti.`,
      images: ['https://etfpruvodce.cz/og-etf-comparison.jpg'],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    other: {
      'article:author': 'ETF průvodce.cz',
      'article:published_time': `${currentYear}-01-01`,
      'article:modified_time': new Date().toISOString(),
    }
  };
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SrovnaniETFPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  console.log('SrovnaniETFPage - resolved searchParams:', resolvedSearchParams);
  
  // Handle ticker-to-ISIN conversion on server side
  let finalSearchParams = resolvedSearchParams;
  const compareParam = resolvedSearchParams?.compare;
  if (compareParam) {
    const compareString = Array.isArray(compareParam) ? compareParam[0] : compareParam;
    const symbols = compareString.split(',').filter(s => s.trim() !== '');
    
    // Check if these are tickers (not ISINs) - ISINs start with 2 letters and are 12+ chars
    const areTickers = symbols.every(symbol => 
      symbol.length < 12 || !/^[A-Z]{2}/.test(symbol)
    );
    
    if (areTickers) {
      console.log('🔄 Server-side ticker conversion for:', symbols);
      try {
        const { supabaseAdmin } = await import('@/lib/supabase');
        // Find ETFs by any ticker field (primary or exchange tickers 1-10)
        const tickerFields = [
          'primary_ticker',
          'exchange_1_ticker', 'exchange_2_ticker', 'exchange_3_ticker', 'exchange_4_ticker', 'exchange_5_ticker',
          'exchange_6_ticker', 'exchange_7_ticker', 'exchange_8_ticker', 'exchange_9_ticker', 'exchange_10_ticker'
        ];
        
        const orConditions = symbols.map(symbol => 
          tickerFields.map(field => `${field}.eq.${symbol}`).join(',')
        ).join(',');
        
        console.log('🔍 OR conditions:', orConditions);
        
        const { data: etfs, error } = await supabaseAdmin
          .from('etf_funds')
          .select(`isin, ${tickerFields.join(', ')}`)
          .or(orConditions);
          
        if (error) {
          console.error('❌ Database error:', error);
        } else {
          console.log('🔍 Found ETFs in database:', etfs);
          if (etfs && etfs.length > 0) {
            const isins = etfs.map((etf: any) => etf.isin);
            console.log('✅ Converted tickers to ISINs:', symbols, '→', isins);
            finalSearchParams = { ...resolvedSearchParams, compare: isins.join(',') };
          } else {
            console.log('⚠️ No ETFs found for tickers:', symbols);
          }
        }
      } catch (error) {
        console.error('❌ Server-side ticker conversion failed:', error);
      }
    }
  }
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `ETF srovnání ${currentYear} - Nejlepší nástroj pro porovnání ETF fondů`,
    "description": "Porovnejte více než 3500 ETF fondů podle TER poplatků, výkonnosti a rizika. ETF srovnání zdarma pro české investory s DEGIRO ETF filtery.",
    "url": "https://etfpruvodce.cz/srovnani-etf",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Moderní webový prohlížeč",
    "featureList": [
      "Srovnání více než 3500 ETF fondů",
      "Pokročilé filtrování podle TER poplatků",
      "Analýza historické výkonnosti",
      "DEGIRO zdarma ETF filtr",
      "Porovnání amerických a evropských ETF",
      "Detailní rizikové metriky",
      "Export dat a srovnání",
      "Real-time databáze ETF"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CZK",
      "description": "Bezplatné ETF srovnání"
    },
    "provider": {
      "@type": "Organization",
      "name": "ETF průvodce.cz",
      "url": "https://etfpruvodce.cz",
      "logo": "https://etfpruvodce.cz/logo.png"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Čeští investoři a investorky",
      "geographicArea": "Česká republika"
    },
    "inLanguage": "cs",
    "availableLanguage": ["cs"],
    "softwareVersion": "2025.1",
    "applicationSubCategory": "Investment Analysis Tool"
  };

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `ETF databáze ${currentYear}`,
    "description": "Kompletní databáze ETF fondů s aktuálními daty o výkonnosti, poplatcích a rizicích pro české investory",
    "keywords": ["ETF", "fondy", "TER", "výkonnost", "investice", "DEGIRO"],
    "creator": {
      "@type": "Organization",
      "name": "ETF průvodce.cz"
    },
    "distribution": [
      {
        "@type": "DataDownload",
        "encodingFormat": "application/json",
        "contentUrl": "https://etfpruvodce.cz/api/etf"
      }
    ],
    "temporalCoverage": `${currentYear}`,
    "spatialCoverage": "Globální ETF trhy",
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "measurementTechnique": "Finanční analýza a porovnání",
    "variableMeasured": [
      "TER poplatky",
      "Historická výkonnost",
      "Velikost fondu", 
      "Dividendový výnos",
      "Volatilita"
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Domů",
        "item": "https://etfpruvodce.cz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "ETF srovnání",
        "item": "https://etfpruvodce.cz/srovnani-etf"
      }
    ]
  };

  return (
    <>
      <Script
        id="etf-comparison-webapp-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webAppSchema),
        }}
      />
      <Script
        id="etf-comparison-dataset-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetSchema),
        }}
      />
      <Script
        id="etf-comparison-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <SrovnaniETFClient searchParams={finalSearchParams} />
    </>
  );
}