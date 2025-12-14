import React from 'react';
import { Metadata } from 'next';
import SrovnaniETFClient from './SrovnaniETFClient';
import FeaturedETFSection from '@/components/etf/FeaturedETFSection';
import { getFeaturedETFs, getTotalETFCount, getLastModifiedDate, ETFBasicInfo } from '@/lib/etf-data';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

const currentYear = new Date().getFullYear();

// Dynamic metadata generation to handle query parameters
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const compareParam = resolvedSearchParams?.compare;

  // Build canonical URL with query parameters if present
  let canonicalUrl = 'https://www.etfpruvodce.cz/srovnani-etf';
  if (compareParam) {
    const compareString = Array.isArray(compareParam) ? compareParam[0] : compareParam;
    canonicalUrl += `?compare=${encodeURIComponent(compareString)}`;
  }

  return {
    title: `ETF srovnání ${currentYear} - Porovnání všech ETF fondů`,
    description: `🔍 Nejpokročilejší ETF srovnání pro české investory. Porovnejte 4300+ ETF podle TER, výkonnosti a rizika. DEGIRO filtry, live databáze, zdarma.`,
    keywords: `ETF srovnání, srovnání ETF fondů, ETF porovnání, nejlepší ETF ${currentYear}, ETF filtr, DEGIRO ETF zdarma, americké ETF, evropské ETF, TER poplatky ETF, výkonnost ETF, ETF databáze`,
    authors: [{ name: 'ETF průvodce.cz' }],
    openGraph: {
      title: `ETF srovnání ${currentYear} - Porovnání všech ETF fondů`,
      description: `Nejpokročilejší ETF srovnání pro české investory. Porovnejte 4300+ ETF podle TER, výkonnosti a rizika.`,
      url: canonicalUrl,
      siteName: 'ETF průvodce.cz',
      images: [{
        url: 'https://www.etfpruvodce.cz/og-etf-comparison.jpg',
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
      description: `Nejpokročilejší ETF srovnání pro české investory. Porovnejte 4300+ ETF podle TER a výkonnosti.`,
      images: ['https://www.etfpruvodce.cz/og-etf-comparison.jpg'],
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

  // Fetch featured ETFs and metadata server-side for SSG
  const [featuredETFs, totalCount, lastModified] = await Promise.all([
    getFeaturedETFs(),
    getTotalETFCount(),
    getLastModifiedDate(),
  ]);

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

        const { data: etfs, error } = await supabaseAdmin
          .from('etf_funds')
          .select(`isin, ${tickerFields.join(', ')}`)
          .or(orConditions);

        if (!error && etfs && etfs.length > 0) {
          const isins = etfs.map((etf: any) => etf.isin);
          finalSearchParams = { ...resolvedSearchParams, compare: isins.join(',') };
        }
      } catch (error) {
        console.error('Server-side ticker conversion failed:', error);
      }
    }
  }
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
        "contentUrl": "https://www.etfpruvodce.cz/api/etf"
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
        "item": "https://www.etfpruvodce.cz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "ETF srovnání",
        "item": "https://www.etfpruvodce.cz/srovnani-etf"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <SrovnaniETFClient
        searchParams={finalSearchParams}
        featuredETFs={featuredETFs}
        totalCount={totalCount}
        lastModified={lastModified}
      />
    </>
  );
}