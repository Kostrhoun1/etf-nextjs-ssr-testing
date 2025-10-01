'use client';

import React from 'react';
import { ETF } from '@/types/etf';
import { formatPercentage, formatTER } from '@/utils/csvParser';
import { formatCurrency, getDistributionPolicyLabel } from '@/utils/etfFormatters';
import ETFDetailedComparisonHeader from './comparison/ETFDetailedComparisonHeader';
import ETFComparisonTable from './comparison/ETFComparisonTable';
import ETFPerformanceMetricsTable from './comparison/ETFPerformanceMetricsTable';
import ETFFundDetailsTable from './comparison/ETFFundDetailsTable';
import ETFHoldingsTable from './comparison/ETFHoldingsTable';
import ETFCountriesTable from './comparison/ETFCountriesTable';
import ETFSectorsTable from './comparison/ETFSectorsTable';
import ETFExchangesTable from './comparison/ETFExchangesTable';

interface ETFDetailedComparisonProps {
  selectedETFs: ETF[];
  onBack: () => void;
}

const ETFDetailedComparison: React.FC<ETFDetailedComparisonProps> = ({
  selectedETFs,
  onBack,
}) => {
  console.log('ETFDetailedComparison - selectedETFs:', selectedETFs);
  console.log('ETFDetailedComparison - selectedETFs length:', selectedETFs.length);

  const basicInfoData = [
    { label: 'Poskytovatel', key: 'fund_provider' },
    { label: 'Kategorie', key: 'category' },
    { label: 'Sledovaný index', key: 'index_name' },
    { label: 'Typ fondu', key: 'distribution_policy', format: (value: string) => getDistributionPolicyLabel(value) },
    { label: 'Měna fondu', key: 'fund_currency' },
    { label: 'Ticker', key: 'primary_ticker', format: (value: string) => value ? value : '-' },
    { label: 'DEGIRO Free', key: 'degiro_free', format: (value: boolean) => value ? 'Ano' : 'Ne' },
  ];

  const feesAndSizeData = [
    { label: 'TER (roční poplatek)', key: 'ter_numeric', format: (value: number) => formatTER(value), className: 'font-mono' },
    { label: 'Velikost fondu', key: 'fund_size_numeric', format: (value: number, etf: ETF) => formatCurrency(value, etf?.fund_currency), className: 'font-mono' },
  ];

  const performanceData = [
    { label: 'Výnos 1 měsíc', key: 'return_1m', format: (value: number) => formatPercentage(value), className: 'font-mono' },
    { label: 'Výnos 3 měsíce', key: 'return_3m', format: (value: number) => formatPercentage(value), className: 'font-mono' },
    { label: 'Výnos 6 měsíců', key: 'return_6m', format: (value: number) => formatPercentage(value), className: 'font-mono' },
    { label: 'YTD výnos', key: 'return_ytd', format: (value: number) => formatPercentage(value), className: 'font-mono' },
    { label: 'Výnos 1 rok', key: 'return_1y', format: (value: number) => formatPercentage(value), className: 'font-mono' },
    { label: 'Výnos 3 roky', key: 'return_3y', format: (value: number) => formatPercentage(value), className: 'font-mono' },
    { label: 'Výnos 5 let', key: 'return_5y', format: (value: number) => formatPercentage(value), className: 'font-mono' },
  ];

  const yearlyPerformanceData = [
    { label: 'Výnos 2021', key: 'return_2021', format: (value: number) => formatPercentage(value), className: 'font-mono' },
    { label: 'Výnos 2022', key: 'return_2022', format: (value: number) => formatPercentage(value), className: 'font-mono' },
    { label: 'Výnos 2023', key: 'return_2023', format: (value: number) => formatPercentage(value), className: 'font-mono' },
    { label: 'Výnos 2024', key: 'return_2024', format: (value: number) => formatPercentage(value), className: 'font-mono' },
  ];

  if (selectedETFs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ETFDetailedComparisonHeader onBack={onBack} />
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            Nejsou vybrány žádné fondy pro porovnání.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ETFDetailedComparisonHeader onBack={onBack} />

      <div className="space-y-6">
        <ETFComparisonTable title="Základní informace" data={basicInfoData} selectedETFs={selectedETFs} />
        <ETFComparisonTable title="Poplatky a velikost fondu" data={feesAndSizeData} selectedETFs={selectedETFs} />
        <ETFComparisonTable title="Výkonnost" data={performanceData} selectedETFs={selectedETFs} />
        <ETFComparisonTable title="Roční výkonnost" data={yearlyPerformanceData} selectedETFs={selectedETFs} />
        <ETFPerformanceMetricsTable selectedETFs={selectedETFs} />
        <ETFFundDetailsTable selectedETFs={selectedETFs} />
        <ETFHoldingsTable selectedETFs={selectedETFs} />
        <ETFCountriesTable selectedETFs={selectedETFs} />
        <ETFSectorsTable selectedETFs={selectedETFs} />
        <ETFExchangesTable selectedETFs={selectedETFs} />
      </div>
    </div>
  );
};

export default ETFDetailedComparison;