import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import TwitterVariants from '@/components/infographics/TwitterVariants';

export const metadata: Metadata = {
  title: 'Nejlevnější ETF 2025 - Nejnižší poplatky TER | Infografika pro X/Twitter',
  description: 'Infografika s ETF fondy s nejnižšími poplatky TER. Optimalizováno pro sdílení na X/Twitter.',
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/infografiky/nejlevnejsi-etf-ter',
  },
  openGraph: {
    title: 'Nejlevnější ETF 2025 - Nejnižší TER',
    description: 'TOP 5 ETF fondů s nejnižšími poplatky TER',
    url: 'https://www.etfpruvodce.cz/infografiky/nejlevnejsi-etf-ter',
    siteName: 'ETF průvodce.cz',
    locale: 'cs_CZ',
    type: 'website',
    images: ['/og-etf-ter.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

// Vzorová data ETF s nejnižšími poplatky
const lowTERETFs = [
  {
    isin: 'IE00B1XNHC34',
    name: 'Core S&P 500 UCITS ETF',
    primary_ticker: 'CSPX',
    ter_numeric: 0.07,
    performance: 11.6
  },
  {
    isin: 'IE00B0M62Q58',
    name: 'MSCI World UCITS ETF',
    primary_ticker: 'SWDA',
    ter_numeric: 0.12,
    performance: 12.5
  },
  {
    isin: 'IE00BKX55T58',
    name: 'Core MSCI Europe UCITS ETF',
    primary_ticker: 'IMEU',
    ter_numeric: 0.12,
    performance: 8.9
  },
  {
    isin: 'IE00BF4RFH31',
    name: 'Core MSCI EM IMI UCITS ETF',
    primary_ticker: 'IEMB',
    ter_numeric: 0.18,
    performance: 6.2
  },
  {
    isin: 'IE00B4L5Y983',
    name: 'Core MSCI World UCITS ETF',
    primary_ticker: 'IWDA',
    ter_numeric: 0.20,
    performance: 12.8
  }
];

export default function NejlevnejsiETFTER() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nejlevnější ETF 2025 - Nejnižší TER
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              TOP 5 ETF fondů s nejnižšími ročními poplatky
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">
                💰 TER = Total Expense Ratio - celkové roční náklady fondu
              </p>
            </div>
          </div>

          <TwitterVariants 
            title="Nejlevnější ETF 2025"
            subtitle="TOP 5 s nejnižšími poplatky TER"
            data={lowTERETFs}
            mode="ter"
          />

          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">O TER poplatcích</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Co je TER?</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Total Expense Ratio</li>
                  <li>• Celkové roční náklady fondu</li>
                  <li>• Strhává se automaticky z hodnoty</li>
                  <li>• Nezahrnuje transakční poplatky</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Proč je TER důležité?</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Snižuje vaše dlouhodobé výnosy</li>
                  <li>• U 1M Kč za 20 let = rozdíl 100k Kč</li>
                  <li>• Nízké TER = více peněz pro vás</li>
                  <li>• Vždy porovnávejte podobné fondy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}