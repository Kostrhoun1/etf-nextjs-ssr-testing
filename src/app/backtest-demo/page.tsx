import { Metadata } from 'next'
import { BacktestDemoClient } from './BacktestDemoClient'

export const metadata: Metadata = {
  title: 'Backtest Demo | ETF Průvodce',
  description: 'Testovací stránka pro backtest nástroj portfolia ETF',
  robots: 'noindex, nofollow',
}

export default function BacktestDemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Historický backtest portfolia
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Backtest portfolia ETF
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Otestujte historickou výkonnost vašeho portfolia s reálnými daty od roku 2000.
            Zjistěte, jak by vaše investice rostla v minulosti a analyzujte rizika.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-900 mb-1">Reálná data</h3>
              <p className="text-sm text-gray-600">Historické kurzy od roku 2000</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-1">Analýza rizik</h3>
              <p className="text-sm text-gray-600">VaR, drawdown, volatilita</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-3xl mb-2">🔮</div>
              <h3 className="font-semibold text-gray-900 mb-1">Monte Carlo</h3>
              <p className="text-sm text-gray-600">Prognóza budoucnosti</p>
            </div>
          </div>
        </div>

        <BacktestDemoClient />
      </div>
    </main>
  )
}
