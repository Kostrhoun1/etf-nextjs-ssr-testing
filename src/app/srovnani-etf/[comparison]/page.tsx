import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SrovnaniETFClient from '../SrovnaniETFClient';
import { getFeaturedETFs, getTotalETFCount, getLastModifiedDate, getComparisonETFData } from '@/lib/etf-data';
import ComparisonSEOSection from '@/components/etf/ComparisonSEOSection';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

const currentYear = new Date().getFullYear();

// Define popular ETF comparisons (10 most popular based on research)
const POPULAR_COMPARISONS = [
  'vwce-vs-cspx',    // #1 Most popular: All-World vs S&P 500
  'iwda-vs-cspx',    // #2 Most popular: MSCI World vs S&P 500  
  'vwce-vs-iwda',    // #3 Most popular: All-World vs MSCI World
  'cspx-vs-vwra',    // #4 S&P 500 acc vs All-World dist
  'cspx-vs-vuaa',    // #5 S&P 500 variants comparison
  'swrd-vs-iwda',    // #6 MSCI World variants
  'vwce-vs-vwrl',    // #7 All-World acc vs dist
  'iwda-vs-vwra',    // #8 MSCI World vs All-World dist
  'cspx-vs-eunl',    // #9 US vs Europe
  'vwce-vs-eunl'     // #10 Global vs Europe
];

interface PageProps {
  params: Promise<{
    comparison: string;
  }>;
}

// Helper to parse comparison URL slug
function parseComparison(comparison: string): { ticker1: string; ticker2: string } | null {
  const match = comparison.match(/^([a-z0-9]+)-vs-([a-z0-9]+)$/i);
  if (!match) return null;
  
  return {
    ticker1: match[1].toUpperCase(),
    ticker2: match[2].toUpperCase()
  };
}

export async function generateStaticParams() {
  return POPULAR_COMPARISONS.map((comparison) => ({
    comparison,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { comparison } = await params;
  const parsed = parseComparison(comparison);

  if (!parsed) {
    return {
      title: 'ETF srovnání nenalezeno',
    };
  }
  
  const { ticker1, ticker2 } = parsed;
  const data = await getComparisonETFData(ticker1, ticker2);

  if (!data) {
    return {
      title: `${ticker1} vs ${ticker2} - ETF srovnání`,
    };
  }

  const etf1Name = data.etf1.name || ticker1;
  const etf2Name = data.etf2.name || ticker2;

  return {
    title: `${ticker1} vs ${ticker2} srovnání ${currentYear} - ${etf1Name} vs ${etf2Name}`,
    description: `🔍 Detailní srovnání ETF ${ticker1} vs ${ticker2}. Porovnání poplatků, výkonnosti a rizika. ${etf1Name} vs ${etf2Name} - která investice je lepší?`,
    keywords: `${ticker1} vs ${ticker2}, ${ticker1} ${ticker2} srovnání, ETF srovnání ${ticker1}, ETF srovnání ${ticker2}, ${etf1Name}, ${etf2Name}, ETF porovnání ${currentYear}`,
    authors: [{ name: 'ETF průvodce.cz' }],
    openGraph: {
      title: `${ticker1} vs ${ticker2} - ETF srovnání ${currentYear}`,
      description: `Detailní srovnání ETF fondů ${ticker1} vs ${ticker2}. Porovnání výkonnosti, poplatků a rizika.`,
      url: `https://www.etfpruvodce.cz/srovnani-etf/${comparison}`,
      siteName: 'ETF průvodce.cz',
      images: [{
        url: 'https://www.etfpruvodce.cz/og-etf-comparison.jpg',
        width: 1200,
        height: 630,
      }],
      locale: 'cs_CZ',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ticker1} vs ${ticker2} srovnání`,
      description: `Detailní ETF srovnání ${ticker1} vs ${ticker2} - poplatky, výkonnost, riziko.`,
      images: ['https://www.etfpruvodce.cz/og-etf-comparison.jpg'],
    },
    alternates: {
      canonical: `https://www.etfpruvodce.cz/srovnani-etf/${comparison}`,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}

export default async function StaticComparisonPage({ params }: PageProps) {
  const { comparison } = await params;
  const parsed = parseComparison(comparison);

  // Check if comparison format is valid
  if (!parsed) {
    notFound();
  }

  const { ticker1, ticker2 } = parsed;

  // Fetch rich comparison metrics + featured ETFs in parallel
  const [comparisonData, featuredETFs, totalCount, lastModified] = await Promise.all([
    getComparisonETFData(ticker1, ticker2),
    getFeaturedETFs(),
    getTotalETFCount(),
    getLastModifiedDate(),
  ]);

  // comparisonData is the source of truth; if either ETF is missing → 404
  if (!comparisonData) {
    notFound();
  }

  // Create searchParams for the existing client component
  const searchParams = {
    compare: `${ticker1},${ticker2}`
  };

  return (
    <>
      {/* Obohacený unikátní SSR obsah (text, tabulka metrik, FAQ, JSON-LD) –
          řeší thin-content problém srovnávacích stránek pro indexaci */}
      {comparisonData && (
        <ComparisonSEOSection
          etf1={comparisonData.etf1}
          etf2={comparisonData.etf2}
          ticker1={ticker1}
          ticker2={ticker2}
          comparison={comparison}
          lastModified={lastModified}
        />
      )}
      <SrovnaniETFClient
        searchParams={searchParams}
        featuredETFs={featuredETFs}
        totalCount={totalCount}
        lastModified={lastModified}
      />
    </>
  );
}