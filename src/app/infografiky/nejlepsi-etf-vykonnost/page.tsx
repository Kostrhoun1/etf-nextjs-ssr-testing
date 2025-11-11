import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import TwitterVariants from '@/components/infographics/TwitterVariants';

export const metadata: Metadata = {
  title: 'Nejlepší ETF 2025 - Výkonnost | Infografika pro X/Twitter',
  description: 'Infografika s nejlepšími ETF fondy podle výkonnosti za posledních 3 roky. Optimalizováno pro sdílení na X/Twitter.',
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/infografiky/nejlepsi-etf-vykonnost',
  },
  openGraph: {
    title: 'Nejlepší ETF 2025 - Výkonnost',
    description: 'TOP 5 ETF fondů s nejvyšší výkonností za posledních 3 roky',
    url: 'https://www.etfpruvodce.cz/infografiky/nejlepsi-etf-vykonnost',
    siteName: 'ETF průvodce.cz',
    locale: 'cs_CZ',
    type: 'website',
    images: ['/og-etf-performance.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

// Vzorová data nejlepších ETF podle výkonnosti
const topPerformanceETFs = [
  {
    isin: 'IE00B4L5Y983',
    name: 'Core MSCI World UCITS ETF',
    primary_ticker: 'IWDA',
    ter_numeric: 0.20,
    performance: 12.8
  },
  {
    isin: 'IE00B0M62Q58',
    name: 'MSCI World UCITS ETF',
    primary_ticker: 'SWDA',
    ter_numeric: 0.12,
    performance: 12.5
  },
  {
    isin: 'IE00B3RBWM25',
    name: 'Vanguard FTSE All-World UCITS ETF',
    primary_ticker: 'VWCE',
    ter_numeric: 0.22,
    performance: 12.2
  },
  {
    isin: 'IE00BKM4GZ66',
    name: 'Core MSCI EM IMI UCITS ETF',
    primary_ticker: 'IEMB',
    ter_numeric: 0.18,
    performance: 11.9
  },
  {
    isin: 'IE00B1XNHC34',
    name: 'Core S&P 500 UCITS ETF',
    primary_ticker: 'CSPX',
    ter_numeric: 0.07,
    performance: 11.6
  }
];

export default function NejlepsiETFVykonnost() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nejlepší ETF 2025 - Výkonnost
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              TOP 5 ETF fondů s nejvyšší výkonností za posledních 3 roky
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">
                💡 Infografika optimalizovaná pro sdílení na X/Twitter (1200x675px)
              </p>
            </div>
          </div>

          <TwitterVariants 
            title="Nejlepší ETF 2025"
            subtitle="TOP 5 podle výkonnosti za 3 roky"
            data={topPerformanceETFs}
            mode="performance"
          />

          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">O této infografice</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Parametry</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Období: 3 roky (2022-2025)</li>
                  <li>• Výkonnost přepočítaná do CZK</li>
                  <li>• Zahrnuje dividendy</li>
                  <li>• Data z prosince 2024</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Formáty</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Optimalizováno pro X/Twitter</li>
                  <li>• Rozměr: 1200x675 pixelů</li>
                  <li>• 4 grafické varianty</li>
                  <li>• Export PNG/JPG</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}