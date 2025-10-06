import { supabaseAdmin } from '@/lib/supabase';
import { redirect, notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    ticker: string;
  }>;
}

// Helper function to find ETF by ticker and redirect to ISIN URL
async function getETFByTicker(ticker: string) {
  const upperTicker = ticker.toUpperCase();
  
  // Try to find ETF by various ticker fields
  // Order by fund size to prefer larger/more popular ETFs when there are duplicates
  const { data: etfs, error } = await supabaseAdmin
    .from('etf_funds')
    .select('isin, primary_ticker, exchange_1_ticker, exchange_2_ticker, exchange_3_ticker, fund_size_numeric')
    .or(
      `primary_ticker.eq.${upperTicker},exchange_1_ticker.eq.${upperTicker},exchange_2_ticker.eq.${upperTicker},exchange_3_ticker.eq.${upperTicker}`
    )
    .order('fund_size_numeric', { ascending: false })
    .limit(1);

  if (error || !etfs || etfs.length === 0) {
    return null;
  }

  return etfs[0];
}

export async function generateMetadata({ params }: PageProps) {
  const { ticker } = await params;
  const etf = await getETFByTicker(ticker);

  if (!etf) {
    return {
      title: `${ticker.toUpperCase()} ETF nenalezen`,
    };
  }

  return {
    title: `${ticker.toUpperCase()} ETF - Přesměrování | ETF Průvodce`,
    description: `Přesměrování na detail ETF fondu s tickerem ${ticker.toUpperCase()}.`,
    robots: 'noindex', // Don't index redirect pages
  };
}

export default async function ETFTickerRedirectPage({ params }: PageProps) {
  const { ticker } = await params;
  const etf = await getETFByTicker(ticker);

  if (!etf) {
    notFound();
  }

  // Redirect to the ISIN-based URL (301 permanent redirect for SEO)
  redirect(`/etf/${etf.isin}`);
}