'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightIcon, TrendingUpIcon, SearchIcon, FilterIcon, DollarSignIcon, BuildingIcon, LandmarkIcon, BitcoinIcon } from '@/components/ui/icons';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ETFItem {
  isin: string;
  name: string;
  fund_provider: string;
  primary_ticker?: string;
  ter_numeric: number;
  fund_size_numeric: number;
  rating?: number;
  return_1y_czk?: number;
  return_1y_usd?: number;
  return_1y?: number;
  return_ytd_czk?: number;
  return_ytd_usd?: number;
  return_ytd?: number;
  return_3y_czk?: number;
  return_3y_usd?: number;
  return_3y?: number;
  return_5y_czk?: number;
  return_5y_usd?: number;
  return_5y?: number;
  category: string;
}

interface CategoryData {
  id: string;
  name: string;
  iconName: string;
  description: string;
  etfs: ETFItem[];
}

interface TopETFTabsProps {
  categories: CategoryData[];
  totalETFCount?: number;
}

const TopETFTabs: React.FC<TopETFTabsProps> = ({ categories, totalETFCount = 0 }) => {
  const [activeTab, setActiveTab] = useState(categories[0]?.id || '');
  const { selectedCurrency: currency, setCurrency } = useCurrency();

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('cs-CZ').format(num);
  };

  const formatPercentage = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return 'N/A';
    const formatted = (num > 0 ? '+' : '') + num.toFixed(1) + '%';
    return formatted;
  };

  const getReturnValue = (etf: ETFItem, period: 'ytd' | '1y' | '3y' | '5y'): number | null => {
    switch (currency) {
      case 'CZK':
        switch (period) {
          case 'ytd': return etf.return_ytd_czk || null;
          case '1y': return etf.return_1y_czk || null;
          case '3y': return etf.return_3y_czk || null;
          case '5y': return etf.return_5y_czk || null;
        }
        break;
      case 'USD':
        switch (period) {
          case 'ytd': return etf.return_ytd_usd || null;
          case '1y': return etf.return_1y_usd || null;
          case '3y': return etf.return_3y_usd || null;
          case '5y': return etf.return_5y_usd || null;
        }
        break;
      default:
        switch (period) {
          case 'ytd': return etf.return_ytd || null;
          case '1y': return etf.return_1y || null;
          case '3y': return etf.return_3y || null;
          case '5y': return etf.return_5y || null;
        }
    }
    return null;
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Nejlepší ETF podle kategorií
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-4">
            Top hodnocené ETF fondy z databáze {formatNumber(totalETFCount)} fondů
          </p>
          
          {/* Currency Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <span className="text-xs md:text-sm text-gray-600 px-2 md:px-3 py-1">Výkonnost:</span>
              {(['EUR', 'CZK', 'USD'] as const).map((currencyOption) => (
                <button
                  key={currencyOption}
                  onClick={() => setCurrency(currencyOption)}
                  className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded-md transition-colors ${
                    currency === currencyOption
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {currencyOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className="md:hidden mb-6">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {(() => {
                  const activeCategory = categories.find(cat => cat.id === activeTab);
                  const iconMap = { TrendingUp: TrendingUpIcon, DollarSign: DollarSignIcon, Building: BuildingIcon, Landmark: LandmarkIcon, Bitcoin: BitcoinIcon };
                  const IconComponent = iconMap[activeCategory?.iconName as keyof typeof iconMap] || TrendingUpIcon;
                  return (
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{activeCategory?.name}</span>
                    </div>
                  );
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => {
                const iconMap = { TrendingUp: TrendingUpIcon, DollarSign: DollarSignIcon, Building: BuildingIcon, Landmark: LandmarkIcon, Bitcoin: BitcoinIcon };
                const IconComponent = iconMap[category.iconName as keyof typeof iconMap] || TrendingUpIcon;
                return (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden md:grid w-full grid-cols-3 lg:grid-cols-5 mb-8 h-auto p-1">
            {categories.map((category) => {
              const iconMap = { TrendingUp: TrendingUpIcon, DollarSign: DollarSignIcon, Building: BuildingIcon, Landmark: LandmarkIcon, Bitcoin: BitcoinIcon };
              const IconComponent = iconMap[category.iconName as keyof typeof iconMap] || TrendingUpIcon;
              
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 p-3 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

        {/* Content for both mobile dropdown and desktop tabs */}
        <div className="mt-0">
          {(() => {
            const activeCategory = categories.find(cat => cat.id === activeTab);
            if (!activeCategory) return null;
            
            return (
              <div className="overflow-x-auto">
                {/* Desktop Table */}
                <table className="hidden md:table w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-900">ETF fond</th>
                      <th className="text-center p-4 font-semibold text-gray-900">TER</th>
                      <th className="text-center p-4 font-semibold text-gray-900">YTD</th>
                      <th className="text-center p-4 font-semibold text-gray-900">1Y</th>
                      <th className="text-center p-4 font-semibold text-gray-900">3Y</th>
                      <th className="text-center p-4 font-semibold text-gray-900">5Y</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Velikost</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCategory.etfs.slice(0, 10).map((etf, index) => (
                      <tr key={etf.isin} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <Link href={`/etf/${etf.isin}`} className="font-medium text-gray-900 hover:text-violet-600 transition-colors">
                              {etf.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                              <span className="font-mono">{etf.isin}</span>
                              {etf.primary_ticker && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                                  {etf.primary_ticker}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center text-sm font-medium">
                          {etf.ter_numeric?.toFixed(2)}%
                        </td>
                        <td className="p-4 text-center text-sm">
                          <span className={`font-medium ${
                            getReturnValue(etf, 'ytd') && getReturnValue(etf, 'ytd')! > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(getReturnValue(etf, 'ytd'))}
                          </span>
                        </td>
                        <td className="p-4 text-center text-sm">
                          <span className={`font-medium ${
                            getReturnValue(etf, '1y') && getReturnValue(etf, '1y')! > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(getReturnValue(etf, '1y'))}
                          </span>
                        </td>
                        <td className="p-4 text-center text-sm">
                          <span className={`font-medium ${
                            getReturnValue(etf, '3y') && getReturnValue(etf, '3y')! > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(getReturnValue(etf, '3y'))}
                          </span>
                        </td>
                        <td className="p-4 text-center text-sm">
                          <span className={`font-medium ${
                            getReturnValue(etf, '5y') && getReturnValue(etf, '5y')! > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(getReturnValue(etf, '5y'))}
                          </span>
                        </td>
                        <td className="p-4 text-center text-sm font-medium">
                          {formatNumber(etf.fund_size_numeric)} mil. EUR
                        </td>
                        <td className="p-4 text-center">
                          <Link href={`/etf/${etf.isin}`}>
                            <Button variant="outline" size="sm">
                              Detail
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {activeCategory.etfs.slice(0, 5).map((etf, index) => (
                    <Card key={etf.isin} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0 pr-3">
                            <Link href={`/etf/${etf.isin}`} className="font-medium text-gray-900 hover:text-violet-600 transition-colors block">
                              {etf.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                              <span className="font-mono text-xs">{etf.isin}</span>
                              {etf.primary_ticker && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                                  {etf.primary_ticker}
                                </span>
                              )}
                            </div>
                          </div>
                          <Link href={`/etf/${etf.isin}`}>
                            <Button variant="outline" size="sm" className="shrink-0">
                              Detail
                            </Button>
                          </Link>
                        </div>
                        
                        {/* Mobile metrics grid */}
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="text-center">
                            <div className="text-gray-500 text-xs mb-1">TER</div>
                            <div className="font-medium">{etf.ter_numeric?.toFixed(2)}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-500 text-xs mb-1">1Y</div>
                            <div className={`font-medium ${
                              getReturnValue(etf, '1y') && getReturnValue(etf, '1y')! > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatPercentage(getReturnValue(etf, '1y'))}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-500 text-xs mb-1">Velikost</div>
                            <div className="font-medium text-xs">{formatNumber(etf.fund_size_numeric)} mil.</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
        </Tabs>

        {/* Bottom CTA Section */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FilterIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Potřebujete detailnější srovnání?
            </h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 max-w-2xl mx-auto">
            Prozkoumejte všech {formatNumber(totalETFCount)} ETF fondů s pokročilými filtry a detailními analýzami.
          </p>
          
          <Link href="/srovnani-etf">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <SearchIcon className="w-4 h-4 mr-2" />
              Srovnat všechny ETF fondy
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopETFTabs;