'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ETFData {
  isin: string;
  name: string;
  return_ytd: number | null;
  return_1y: number | null;
  return_3y: number | null;
  return_5y: number | null;
  ter_numeric: number | null;
  current_dividend_yield_numeric: number | null;
}

// Definice Dividendového Portfolia podle aktuálního složení
const dividendPortfolioAllocations = [
  { asset: 'Dividendové akcie', percentage: 95, isin: 'IE00B9CQXS71', etfName: 'SPDR S&P Global Dividend Aristocrats UCITS ETF' },
  { asset: 'Nemovitosti (REITs)', percentage: 5, isin: 'IE00B1FZS350', etfName: 'iShares Developed Markets Property Yield UCITS ETF' },
];

const DividendPortfolioPerformance: React.FC = () => {
  const [etfData, setEtfData] = useState<Record<string, ETFData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchETFData();
  }, []);

  const fetchETFData = async () => {
    try {
      const isins = dividendPortfolioAllocations.map(allocation => allocation.isin);

      const { data, error } = await supabase
        .from('etf_funds')
        .select('isin, name, return_ytd, return_1y, return_3y, return_5y, ter_numeric, current_dividend_yield_numeric')
        .in('isin', isins);

      if (error) {
        console.error('Error fetching ETF data:', error);
        return;
      }

      const etfMap: Record<string, ETFData> = {};
      data?.forEach(etf => {
        etfMap[etf.isin] = etf;
      });

      setEtfData(etfMap);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWeightedReturn = (period: 'ytd' | '1y' | '3y' | '5y'): number | null => {
    let totalReturn = 0;
    let totalWeight = 0;

    for (const allocation of dividendPortfolioAllocations) {
      const etf = etfData[allocation.isin];
      if (!etf) continue;

      const returnValue = etf[`return_${period}`];
      if (returnValue !== null && returnValue !== undefined) {
        totalReturn += returnValue * (allocation.percentage / 100);
        totalWeight += allocation.percentage / 100;
      }
    }

    return totalWeight > 0 ? totalReturn : null;
  };

  const calculateWeightedTER = (): number | null => {
    let totalTER = 0;
    let totalWeight = 0;

    for (const allocation of dividendPortfolioAllocations) {
      const etf = etfData[allocation.isin];
      if (!etf || etf.ter_numeric === null) continue;

      totalTER += etf.ter_numeric * (allocation.percentage / 100);
      totalWeight += allocation.percentage / 100;
    }

    return totalWeight > 0 ? totalTER : null;
  };

  const calculateWeightedDividendYield = (): number | null => {
    let totalDividendYield = 0;
    let totalWeight = 0;

    for (const allocation of dividendPortfolioAllocations) {
      const etf = etfData[allocation.isin];
      if (!etf || etf.current_dividend_yield_numeric === null) continue;

      totalDividendYield += etf.current_dividend_yield_numeric * (allocation.percentage / 100);
      totalWeight += allocation.percentage / 100;
    }

    return totalWeight > 0 ? totalDividendYield : null;
  };

  if (loading) {
    return (
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="text-violet-600" />
            Aktuální výkonnost portfolia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Načítám data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ytdReturn = calculateWeightedReturn('ytd');
  const return1y = calculateWeightedReturn('1y');
  const return3y = calculateWeightedReturn('3y');
  const return5y = calculateWeightedReturn('5y');
  const ter = calculateWeightedTER();
  const dividendYield = calculateWeightedDividendYield();

  return (
    <Card className="mb-12" id="vykonnost">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <BarChart3 className="text-violet-600" />
          Aktuální výkonnost Dividendového Portfolia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg border border-violet-200">
            <div className="text-2xl font-bold text-violet-600">
              {ytdReturn !== null ? `${ytdReturn.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600 mt-1">Letošní výnos</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {return1y !== null ? `${return1y.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600 mt-1">1 rok</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {return3y !== null ? `${return3y.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600 mt-1">3 roky (celkem)</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
            <div className="text-2xl font-bold text-amber-600">
              {return5y !== null ? `${return5y.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600 mt-1">5 let (celkem)</div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold mb-4">Složení portfolia</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {dividendPortfolioAllocations.map((allocation, index) => {
              const etf = etfData[allocation.isin];
              return (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <div className="font-medium">{allocation.asset} ({allocation.percentage}%)</div>
                    <div className="text-sm text-gray-600">{allocation.etfName}</div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      {etf && etf.ter_numeric && (
                        <span>TER: {etf.ter_numeric}%</span>
                      )}
                      {etf && etf.current_dividend_yield_numeric && (
                        <span>Dividendy: {etf.current_dividend_yield_numeric.toFixed(2)}%</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {etf && etf.return_1y !== null && (
                      <div className="text-sm font-medium text-gray-700">
                        {etf.return_1y.toFixed(1)}% (1 rok)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {ter !== null && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium">Celkový TER portfolia:</span>
                <span className="font-bold text-violet-600">{ter.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-violet-50 border border-violet-200 rounded-lg">
          <h4 className="font-semibold text-violet-800 mb-2">💰 Aktuální dividendový výnos</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-violet-700">Vážený dividendový výnos portfolia:</span>
            <span className="text-lg font-bold text-violet-800">
              {dividendYield !== null ? `${dividendYield.toFixed(2)}%` : 'N/A'}
            </span>
          </div>
          <p className="text-sm text-violet-700">
            Celkový výnos se skládá z dividend + růstu kurzu akcií. Portfolio se zaměřuje na kvalitní společnosti s dlouholetou tradicí růstu dividend.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DividendPortfolioPerformance;