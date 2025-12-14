'use client';

import React, { useState } from 'react';
import { ETFListItem } from '@/types/etf';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { ChevronUpIcon, ChevronDownIcon, LoaderIcon } from '@/components/ui/icons';
import { formatPercentage, formatTER } from '@/utils/csvParser';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ETFSimpleTableProps {
  etfs: ETFListItem[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  selectedETFs?: ETFListItem[];
  onAddETF?: (etf: ETFListItem) => void;
  onRemoveETF?: (isin: string) => void;
  isETFSelected?: (isin: string) => boolean;
  canAddMore?: boolean;
  showPagination?: boolean;
  isHomepage?: boolean;
}

const ETFSimpleTable: React.FC<ETFSimpleTableProps> = ({
  etfs,
  sortBy,
  sortOrder,
  onSort,
  selectedETFs = [],
  onAddETF,
  onRemoveETF,
  isETFSelected,
  canAddMore = true,
  showPagination = true,
  isHomepage = false,
}) => {
  const [loadingETF, setLoadingETF] = useState<string | null>(null);
  const { getPerformanceValue } = useCurrency();

  const handleSelectETF = async (etf: ETFListItem) => {
    if (!onAddETF || !onRemoveETF) return;
    
    setLoadingETF(etf.isin);
    try {
      if (isETFSelected && isETFSelected(etf.isin)) {
        onRemoveETF(etf.isin);
      } else {
        onAddETF(etf);
      }
    } finally {
      setLoadingETF(null);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy === field) {
      return sortOrder === 'asc' ?
        <ChevronUpIcon /> :
        <ChevronDownIcon />;
    }
    return null;
  };

  const getReturnColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return '';
  };

  const getDistributionPolicyLabel = (policy: string) => {
    if (policy === 'Accumulating') return 'Akumulační';
    if (policy === 'Distributing') return 'Distribuční';
    return policy || '-';
  };

  const formatFundSize = (size: number) => {
    if (!size) return '-';
    
    return size.toLocaleString('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-50 text-left md:relative sticky left-0 bg-white z-10 md:border-r-0 border-r border-gray-200 min-w-[200px] md:min-w-0"
                onClick={() => onSort('name')}
              >
                Název / ISIN
                {getSortIcon('name')}
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('ter_numeric')}
              >
                TER
                {getSortIcon('ter_numeric')}
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('return_ytd')}
              >
                Výnos YTD
                {getSortIcon('return_ytd')}
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('return_1y')}
              >
                Výnos 1Y
                {getSortIcon('return_1y')}
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('return_3y')}
              >
                Výnos 3Y
                {getSortIcon('return_3y')}
              </TableHead>
               <TableHead
                 className="text-right cursor-pointer hover:bg-gray-50"
                 onClick={() => onSort('return_5y')}
               >
                 Výnos 5Y
                 {getSortIcon('return_5y')}
               </TableHead>
               <TableHead
                 className="text-right cursor-pointer hover:bg-gray-50"
                 onClick={() => onSort('fund_size_numeric')}
               >
                 Velikost fondu (mil EUR)
                 {getSortIcon('fund_size_numeric')}
               </TableHead>
               <TableHead
                 className="text-right cursor-pointer hover:bg-gray-50"
                 onClick={() => onSort('current_dividend_yield_numeric')}
               >
                 Dividendový výnos
                 {getSortIcon('current_dividend_yield_numeric')}
               </TableHead>
               <TableHead className="text-left">Typ fondu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {etfs.map((etf) => (
              <TableRow key={etf.isin} className="border-b hover:bg-gray-50">
                <TableCell className="p-3 md:relative sticky left-0 bg-white z-10 md:border-r-0 border-r border-gray-200 min-w-[200px] md:min-w-0">
                  <div className="flex items-start gap-3">
                    {(onAddETF && onRemoveETF) && (
                      <div className="flex pt-1">
                        {isETFSelected && isETFSelected(etf.isin) ? (
                          <Checkbox
                            checked={true}
                            onCheckedChange={() => handleSelectETF(etf)}
                            disabled={loadingETF === etf.isin}
                            aria-label="Odebrat z porovnání"
                          />
                        ) : (
                          <Checkbox
                            checked={false}
                            onCheckedChange={() => handleSelectETF(etf)}
                            disabled={!canAddMore || loadingETF === etf.isin}
                            aria-label="Porovnat fond"
                          />
                        )}
                        {loadingETF === etf.isin && (
                          <LoaderIcon />
                        )}
                      </div>
                    )}
                    <div>
                      <div className="font-medium">
                        <Link
                          href={`/etf/${etf.isin}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {etf.name}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">{etf.isin}</div>
                      {etf.primary_ticker && (
                        <div className="text-xs text-blue-600">{etf.primary_ticker}</div>
                      )}
                      <div className="mt-1 flex flex-wrap gap-1">
                        {etf.degiro_free && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            DEGIRO Free
                          </Badge>
                        )}
                        {etf.category === 'Páková ETF' && (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 font-semibold">
                            PÁKOVÁ
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono p-3">
                  {formatTER(etf.ter_numeric)}
                </TableCell>
                <TableCell className={`p-3 text-right ${getReturnColor(getPerformanceValue(etf, 'ytd'))}`}>
                  {getPerformanceValue(etf, 'ytd') !== null ? formatPercentage(getPerformanceValue(etf, 'ytd')!) : '-'}
                </TableCell>
                <TableCell className={`p-3 text-right ${getReturnColor(getPerformanceValue(etf, '1y'))}`}>
                  {getPerformanceValue(etf, '1y') !== null ? formatPercentage(getPerformanceValue(etf, '1y')!) : '-'}
                </TableCell>
                <TableCell className={`p-3 text-right ${getReturnColor(getPerformanceValue(etf, '3y'))}`}>
                  {getPerformanceValue(etf, '3y') !== null ? formatPercentage(getPerformanceValue(etf, '3y')!) : '-'}
                </TableCell>
                 <TableCell className={`p-3 text-right ${getReturnColor(getPerformanceValue(etf, '5y'))}`}>
                   {getPerformanceValue(etf, '5y') !== null ? formatPercentage(getPerformanceValue(etf, '5y')!) : '-'}
                 </TableCell>
                 <TableCell className="text-right font-mono p-3 text-sm">
                   {formatFundSize(etf.fund_size_numeric)}
                 </TableCell>
                 <TableCell className="text-right font-mono p-3">
                   {etf.current_dividend_yield_numeric ? formatPercentage(etf.current_dividend_yield_numeric) : '-'}
                 </TableCell>
                 <TableCell className="p-3">
                   <Badge variant="outline" className="text-xs">
                     {getDistributionPolicyLabel(etf.distribution_policy)}
                   </Badge>
                 </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ETFSimpleTable;