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
}

// Definice Permanentního Portfolia podle aktuálního složení
const permanentPortfolioAllocations = [
  { asset: 'Akcie', percentage: 25, isin: 'IE00BK5BQT80', etfName: 'Vanguard FTSE All-World' },
  { asset: 'Dluhopisy', percentage: 25, isin: 'IE00BDBRDM35', etfName: 'iShares Core Global Aggregate Bond UCITS ETF EUR Hedged (Acc)' },
  { asset: 'Nemovitosti', percentage: 25, isin: 'IE00B0M63284', etfName: 'iShares European Property Yield UCITS ETF' },
  { asset: 'Komodity', percentage: 25, isin: 'IE00BD6FTQ80', etfName: 'Invesco Bloomberg Commodity UCITS ETF Acc' },
];

const PermanentniPortfolioPerformance: React.FC = () => {
  const [etfData, setEtfData] = useState<Record<string, ETFData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchETFData();
  }, []);

  const fetchETFData = async () => {
    try {
      const isins = permanentPortfolioAllocations.map(allocation => allocation.isin);

      const { data, error } = await supabase
        .from('etf_funds')
        .select('isin, name, return_ytd, return_1y, return_3y, return_5y, ter_numeric')
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
      console.error('Error fetching ETF data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePortfolioPerformance = () => {
    const periods = ['return_ytd', 'return_1y', 'return_3y', 'return_5y'] as const;
    const results: Record<string, number | null> = {};

    for (const period of periods) {
      let weightedReturn = 0;
      let totalAvailableWeight = 0;

      for (const allocation of permanentPortfolioAllocations) {
        const etf = etfData[allocation.isin];
        if (etf && etf[period] !== null && etf[period] !== undefined) {
          weightedReturn += (allocation.percentage / 100) * etf[period]!;
          totalAvailableWeight += allocation.percentage / 100;
        }
      }

      if (totalAvailableWeight >= 0.8) {
        results[period] = weightedReturn / totalAvailableWeight;
      } else {
        results[period] = null;
      }
    }

    return results;
  };

  const formatPerformance = (value: number | null) => {
    if (value === null) return '-';
    const formatted = value.toFixed(2);
    return `${value >= 0 ? '+' : ''}${formatted}%`;
  };

  const getPerformanceColor = (value: number | null) => {
    if (value === null) return 'text-gray-500';
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="text-green-600" />
            Reálná výkonnost portfolia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Načítám data výkonnosti...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const performance = calculatePortfolioPerformance();

  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <BarChart3 className="text-green-600" />
          Reálná výkonnost portfolia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${getPerformanceColor(performance.return_ytd as number)}`}>
              {formatPerformance(performance.return_ytd as number)}
            </div>
            <div className="text-gray-600 mb-1">Letos (YTD)</div>
            <div className="text-sm text-gray-500">Aktuální rok</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${getPerformanceColor(performance.return_1y as number)}`}>
              {formatPerformance(performance.return_1y as number)}
            </div>
            <div className="text-gray-600 mb-1">1 rok</div>
            <div className="text-sm text-gray-500">Posledních 12 měsíců</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${getPerformanceColor(performance.return_3y as number)}`}>
              {formatPerformance(performance.return_3y as number)}
            </div>
            <div className="text-gray-600 mb-1">3 roky</div>
            <div className="text-sm text-gray-500">Anualizovaný výnos</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${getPerformanceColor(performance.return_5y as number)}`}>
              {formatPerformance(performance.return_5y as number)}
            </div>
            <div className="text-gray-600 mb-1">5 let</div>
            <div className="text-sm text-gray-500">Anualizovaný výnos</div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3">Složení portfolia a výkonnost jednotlivých ETF</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Aktivum</th>
                  <th className="text-right py-2">Alokace</th>
                  <th className="text-left py-2">ETF</th>
                  <th className="text-right py-2">YTD</th>
                  <th className="text-right py-2">1 rok</th>
                </tr>
              </thead>
              <tbody>
                {permanentPortfolioAllocations.map((allocation, index) => {
                  const etf = etfData[allocation.isin];
                  return (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 font-medium">{allocation.asset}</td>
                      <td className="py-2 text-right font-semibold">{allocation.percentage}%</td>
                      <td className="py-2">{allocation.etfName}</td>
                      <td className={`py-2 text-right font-semibold ${getPerformanceColor(etf?.return_ytd || null)}`}>
                        {etf ? formatPerformance(etf.return_ytd) : '-'}
                      </td>
                      <td className={`py-2 text-right font-semibold ${getPerformanceColor(etf?.return_1y || null)}`}>
                        {etf ? formatPerformance(etf.return_1y) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            * Výkonnost je vypočítána na základě vážených průměrů skutečných výnosů ETF fondů v portfoliu podle aktuálního složení 25/25/25/25
          </p>
          {Object.values(performance).some(value => value === null) && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠️ Některá období nemají kompletní data pro všechna ETF v portfoliu
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PermanentniPortfolioPerformance;