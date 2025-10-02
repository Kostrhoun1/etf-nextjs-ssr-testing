import React from 'react';

interface MarketData {
  symbol: string;
  performance: number;
  current_price: number;
  currency: string;
  name: string;
  last_updated: string;
}

interface HeatmapData {
  metadata: {
    period: string;
    generated_at: string;
    data_source: string;
  };
  sectors: { [key: string]: MarketData };
  regions: { [key: string]: MarketData };
  asset_classes: { [key: string]: MarketData };
  summary_stats: {
    best_performers: { [key: string]: [string, number] };
    worst_performers: { [key: string]: [string, number] };
    category_averages: { [key: string]: number };
  };
}

interface MarketHeatmapProps {
  data: HeatmapData;
}

const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ data }) => {
  const getPerformanceColor = (performance: number): { bg: string; text: string; border: string; shadow: string } => {
    if (performance >= 15) return { 
      bg: 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600', 
      text: 'text-white', 
      border: 'border-emerald-400 border-2',
      shadow: 'shadow-xl shadow-emerald-500/30'
    };
    if (performance >= 10) return { 
      bg: 'bg-gradient-to-br from-green-400 via-emerald-400 to-green-500', 
      text: 'text-white', 
      border: 'border-green-300 border-2',
      shadow: 'shadow-lg shadow-green-400/25'
    };
    if (performance >= 5) return { 
      bg: 'bg-gradient-to-br from-green-300 via-emerald-300 to-green-400', 
      text: 'text-green-900', 
      border: 'border-green-200 border-2',
      shadow: 'shadow-md shadow-green-300/20'
    };
    if (performance >= 2) return { 
      bg: 'bg-gradient-to-br from-green-100 via-emerald-50 to-green-200', 
      text: 'text-green-800', 
      border: 'border-green-100 border',
      shadow: 'shadow-sm shadow-green-200/15'
    };
    if (performance >= 0) return { 
      bg: 'bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100', 
      text: 'text-gray-700', 
      border: 'border-gray-200 border',
      shadow: 'shadow-sm shadow-gray-200/10'
    };
    if (performance >= -2) return { 
      bg: 'bg-gradient-to-br from-red-100 via-rose-50 to-red-200', 
      text: 'text-red-800', 
      border: 'border-red-100 border',
      shadow: 'shadow-sm shadow-red-200/15'
    };
    if (performance >= -5) return { 
      bg: 'bg-gradient-to-br from-red-300 via-rose-300 to-red-400', 
      text: 'text-red-900', 
      border: 'border-red-200 border-2',
      shadow: 'shadow-md shadow-red-300/20'
    };
    if (performance >= -10) return { 
      bg: 'bg-gradient-to-br from-red-400 via-rose-400 to-red-500', 
      text: 'text-white', 
      border: 'border-red-300 border-2',
      shadow: 'shadow-lg shadow-red-400/25'
    };
    return { 
      bg: 'bg-gradient-to-br from-red-500 via-rose-500 to-red-600', 
      text: 'text-white', 
      border: 'border-red-400 border-2',
      shadow: 'shadow-xl shadow-red-500/30'
    };
  };

  const getSectorIcon = (sectorName: string): string => {
    switch (sectorName) {
      case 'Technology': return '💻';
      case 'Healthcare': return '🏥';
      case 'Financials': return '🏦';
      case 'Energy': return '⚡';
      case 'Utilities': return '🔌';
      case 'Consumer Staples': return '🛒';
      case 'Consumer Discretionary': return '🛍️';
      case 'Industrials': return '🏭';
      case 'Materials': return '🔨';
      case 'Real Estate': return '🏢';
      case 'Communication Services': return '📡';
      default: return '📊';
    }
  };

  const getRegionIcon = (regionName: string): string => {
    switch (regionName) {
      case 'USA': return '🇺🇸';
      case 'Europe': return '🇪🇺';
      case 'Japan': return '🇯🇵';
      case 'China': return '🇨🇳';
      case 'Emerging Markets': return '🌏';
      case 'Developed Markets': return '🌎';
      case 'Asia Pacific': return '🏝️';
      default: return '🌍';
    }
  };

  const getAssetIcon = (assetName: string): string => {
    switch (assetName) {
      case 'US Stocks': return '📈';
      case 'International Stocks': return '🌐';
      case 'Bonds': return '📜';
      case 'REITs': return '🏘️';
      case 'Commodities': return '🌾';
      case 'Gold': return '🥇';
      case 'Bitcoin': return '₿';
      case 'Oil': return '🛢️';
      default: return '💰';
    }
  };

  const renderHeatmapGrid = (categoryData: { [key: string]: MarketData }, title: string, categoryType: 'sectors' | 'regions' | 'assets') => {
    const items = Object.entries(categoryData);
    
    const getIcon = (name: string) => {
      switch (categoryType) {
        case 'sectors': return getSectorIcon(name);
        case 'regions': return getRegionIcon(name);
        case 'assets': return getAssetIcon(name);
        default: return '📊';
      }
    };
    
    return (
      <div className="mb-12 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        {/* Kompletní header pro každou sekci - zmenšeno */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white p-4">
          <div className="text-center">
            <h2 className="text-xl font-black mb-1">{title}</h2>
            <div className="text-sm font-semibold text-purple-100">
              Performance - {formatPeriod(data.metadata.period)}
            </div>
            <div className="text-xs text-purple-200 mt-1">
              📊 {new Date(data.metadata.generated_at).toLocaleDateString('cs-CZ')} | {data.metadata.data_source}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className={`grid gap-3 ${
            categoryType === 'sectors' 
              ? 'grid-cols-4 lg:grid-cols-4 xl:grid-cols-4' // 3 řádky pro sektory (4x3 = 12 pozic pro 11 sektorů)
              : categoryType === 'regions'
                ? 'grid-cols-3 lg:grid-cols-3 xl:grid-cols-3' // 3 sloupce pro regiony (7 regionů = 3 řádky)
                : 'grid-cols-3 lg:grid-cols-4 xl:grid-cols-4' // 3-4 sloupce pro aktiva (9 aktiv)
          }`}>
            {items.map(([name, data]) => {
              const colorConfig = getPerformanceColor(data.performance);
              return (
                <div
                  key={name}
                  className={`relative overflow-hidden rounded-xl ${colorConfig.bg} ${colorConfig.border} ${colorConfig.shadow} transition-all duration-300 hover:scale-105 group cursor-pointer`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full transform translate-x-4 -translate-y-4"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative text-center p-4">
                    {/* Icon */}
                    <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                      {getIcon(name)}
                    </div>
                    
                    {/* Name */}
                    <div className={`font-bold mb-1 leading-tight ${colorConfig.text} text-lg`}>
                      {categoryType === 'sectors' && name.length > 16 ? `${name.substring(0, 16)}...` : name}
                    </div>
                    
                    {/* Performance */}
                    <div className={`font-black mb-1 ${colorConfig.text} text-2xl`}>
                      {data.performance > 0 ? '+' : ''}{data.performance.toFixed(1)}%
                    </div>
                    
                    {/* Symbol */}
                    <div className={`opacity-80 font-medium ${colorConfig.text} text-lg`}>
                      {data.symbol}
                    </div>
                    
                    {/* Trend Arrow */}
                    <div className="absolute top-1 right-1">
                      {data.performance > 0 ? (
                        <div className="text-sm">📈</div>
                      ) : data.performance < 0 ? (
                        <div className="text-sm">📉</div>
                      ) : (
                        <div className="text-sm">➡️</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer s branding - zmenšeno */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">
                💡 Data z reprezentativních ETF fondů
              </div>
              <div className="text-xs font-bold text-violet-600">
                📊 www.etfpruvodce.cz
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const formatPeriod = (period: string): string => {
    switch (period) {
      case '1d': return 'Denní změna';
      case 'wtd': return 'Week-to-Date';
      case 'mtd': return 'Month-to-Date';
      case 'ytd': return 'Year-to-Date';
      case '1y': return '1 rok';
      case '3y': return '3 roky';
      case '5y': return '5 let';
      case '10y': return '10 let';
      default: return period;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Heatmap gridy - každý s vlastním headerem pro printscreen */}
      {renderHeatmapGrid(data.sectors, '📈 S&P 500 Sektory', 'sectors')}
      {renderHeatmapGrid(data.regions, '🌍 Regiony & Země', 'regions')}
      {renderHeatmapGrid(data.asset_classes, '💰 Třídy aktiv', 'assets')}
    </div>
  );
};

export default MarketHeatmap;