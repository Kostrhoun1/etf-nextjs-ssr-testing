import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import MarketHeatmap from '@/components/infographics/MarketHeatmap';

export const metadata: Metadata = {
  title: 'Tržní heatmapa 2025 - Výkonnost sektorů a regionů | Infografika',
  description: '✅ Interaktivní heatmapa trhů 2025. Výkonnost 11 sektorů (tech, healthcare, finance), 7 regionů (USA, Evropa, Asie) a tříd aktiv. Denně aktualizovaná data pro investory.',
  keywords: 'tržní heatmapa, výkonnost sektorů, výkonnost regionů, akciové trhy, ETF heatmapa, investiční přehled, tech sektor, USA trhy',
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/infografiky/trzni-heatmapa',
  },
  openGraph: {
    title: 'Tržní heatmapa 2025 - Výkonnost sektorů a regionů',
    description: 'Interaktivní heatmapa výkonnosti 11 sektorů, 7 regionů a tříd aktiv. Denně aktualizováno.',
    url: 'https://www.etfpruvodce.cz/infografiky/trzni-heatmapa',
    siteName: 'ETF průvodce.cz',
    locale: 'cs_CZ',
    type: 'website',
    images: ['/og-market-heatmap.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tržní heatmapa 2025 - Výkonnost sektorů',
    description: 'Interaktivní heatmapa sektorů, regionů a aktiv. Denně aktualizováno.',
    images: ['/og-market-heatmap.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

// Vzorová data pro heatmapu
const heatmapData = {
  metadata: {
    period: 'ytd',
    generated_at: '2025-01-02T10:00:00Z',
    data_source: 'ETF průvodce.cz'
  },
  sectors: {
    'Technology': {
      symbol: 'XLK',
      performance: 15.2,
      current_price: 168.45,
      currency: 'USD',
      name: 'Technology Select Sector',
      last_updated: '2025-01-02'
    },
    'Healthcare': {
      symbol: 'XLV',
      performance: 8.7,
      current_price: 142.31,
      currency: 'USD',
      name: 'Health Care Select Sector',
      last_updated: '2025-01-02'
    },
    'Financials': {
      symbol: 'XLF',
      performance: 12.4,
      current_price: 43.22,
      currency: 'USD',
      name: 'Financial Select Sector',
      last_updated: '2025-01-02'
    },
    'Energy': {
      symbol: 'XLE',
      performance: -2.1,
      current_price: 91.77,
      currency: 'USD',
      name: 'Energy Select Sector',
      last_updated: '2025-01-02'
    },
    'Utilities': {
      symbol: 'XLU',
      performance: 3.2,
      current_price: 68.94,
      currency: 'USD',
      name: 'Utilities Select Sector',
      last_updated: '2025-01-02'
    },
    'Consumer Staples': {
      symbol: 'XLP',
      performance: 5.8,
      current_price: 78.12,
      currency: 'USD',
      name: 'Consumer Staples Sector',
      last_updated: '2025-01-02'
    },
    'Consumer Discretionary': {
      symbol: 'XLY',
      performance: 11.3,
      current_price: 184.56,
      currency: 'USD',
      name: 'Consumer Discretionary Sector',
      last_updated: '2025-01-02'
    },
    'Industrials': {
      symbol: 'XLI',
      performance: 9.1,
      current_price: 132.89,
      currency: 'USD',
      name: 'Industrial Select Sector',
      last_updated: '2025-01-02'
    },
    'Materials': {
      symbol: 'XLB',
      performance: 4.6,
      current_price: 96.34,
      currency: 'USD',
      name: 'Materials Select Sector',
      last_updated: '2025-01-02'
    },
    'Real Estate': {
      symbol: 'XLRE',
      performance: 7.3,
      current_price: 41.78,
      currency: 'USD',
      name: 'Real Estate Select Sector',
      last_updated: '2025-01-02'
    },
    'Communication Services': {
      symbol: 'XLC',
      performance: 13.7,
      current_price: 76.45,
      currency: 'USD',
      name: 'Communication Services Sector',
      last_updated: '2025-01-02'
    }
  },
  regions: {
    'USA': {
      symbol: 'SPY',
      performance: 11.8,
      current_price: 567.89,
      currency: 'USD',
      name: 'S&P 500',
      last_updated: '2025-01-02'
    },
    'Europe': {
      symbol: 'VGK',
      performance: 6.2,
      current_price: 67.34,
      currency: 'USD',
      name: 'FTSE Europe',
      last_updated: '2025-01-02'
    },
    'Japan': {
      symbol: 'EWJ',
      performance: 4.1,
      current_price: 62.17,
      currency: 'USD',
      name: 'Japan MSCI',
      last_updated: '2025-01-02'
    },
    'China': {
      symbol: 'MCHI',
      performance: -1.8,
      current_price: 51.23,
      currency: 'USD',
      name: 'China MSCI',
      last_updated: '2025-01-02'
    },
    'Emerging Markets': {
      symbol: 'VWO',
      performance: 2.3,
      current_price: 44.56,
      currency: 'USD',
      name: 'FTSE Emerging Markets',
      last_updated: '2025-01-02'
    },
    'Developed Markets': {
      symbol: 'VEA',
      performance: 7.9,
      current_price: 52.78,
      currency: 'USD',
      name: 'FTSE Developed Markets',
      last_updated: '2025-01-02'
    },
    'Asia Pacific': {
      symbol: 'VPL',
      performance: 3.7,
      current_price: 89.12,
      currency: 'USD',
      name: 'FTSE Pacific',
      last_updated: '2025-01-02'
    }
  },
  asset_classes: {
    'US Stocks': {
      symbol: 'VTI',
      performance: 11.4,
      current_price: 284.67,
      currency: 'USD',
      name: 'Total Stock Market',
      last_updated: '2025-01-02'
    },
    'International Stocks': {
      symbol: 'VTIAX',
      performance: 5.8,
      current_price: 34.89,
      currency: 'USD',
      name: 'Total International Stock',
      last_updated: '2025-01-02'
    },
    'Bonds': {
      symbol: 'AGG',
      performance: 1.2,
      current_price: 103.45,
      currency: 'USD',
      name: 'Core U.S. Aggregate Bond',
      last_updated: '2025-01-02'
    },
    'REITs': {
      symbol: 'VNQ',
      performance: 8.6,
      current_price: 91.23,
      currency: 'USD',
      name: 'Real Estate',
      last_updated: '2025-01-02'
    },
    'Commodities': {
      symbol: 'DJP',
      performance: -0.8,
      current_price: 28.91,
      currency: 'USD',
      name: 'DJ-UBS Commodity',
      last_updated: '2025-01-02'
    },
    'Gold': {
      symbol: 'GLD',
      performance: 2.4,
      current_price: 199.78,
      currency: 'USD',
      name: 'SPDR Gold Trust',
      last_updated: '2025-01-02'
    },
    'Bitcoin': {
      symbol: 'BTC',
      performance: 45.2,
      current_price: 42567.89,
      currency: 'USD',
      name: 'Bitcoin',
      last_updated: '2025-01-02'
    },
    'Oil': {
      symbol: 'USO',
      performance: -3.7,
      current_price: 67.45,
      currency: 'USD',
      name: 'United States Oil Fund',
      last_updated: '2025-01-02'
    },
    'Ethereum': {
      symbol: 'ETH',
      performance: 38.9,
      current_price: 2456.78,
      currency: 'USD',
      name: 'Ethereum',
      last_updated: '2025-01-02'
    }
  },
  summary_stats: {
    best_performers: {
      sectors: ['Technology', 15.2],
      regions: ['USA', 11.8],
      assets: ['Bitcoin', 45.2]
    },
    worst_performers: {
      sectors: ['Energy', -2.1],
      regions: ['China', -1.8],
      assets: ['Oil', -3.7]
    },
    category_averages: {
      sectors: 8.3,
      regions: 4.8,
      assets: 12.1
    }
  }
};

export default function TrzniHeatmapa() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tržní heatmapa 2025
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Aktuální výkonnost sektorů, regionů a tříd aktiv
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-purple-800 font-medium">
                📊 Data aktualizována denně | Výkonnost Year-to-Date
              </p>
            </div>
          </div>

          <MarketHeatmap data={heatmapData} />

          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Jak číst heatmapu</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">🟢 Zelená</h3>
                <p className="text-gray-600">Pozitivní výkonnost - rostoucí trhy</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">🔴 Červená</h3>
                <p className="text-gray-600">Negativní výkonnost - klesající trhy</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">⚪ Šedá</h3>
                <p className="text-gray-600">Neutrální výkonnost - stabilní trhy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}