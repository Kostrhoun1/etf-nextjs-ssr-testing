'use client';

import React from 'react';
import { ETF } from '@/types/etf';
import { Badge } from '@/components/ui/badge';
import ETFRating from '@/components/ETFRating';
import CurrencyToggle from '@/components/ui/CurrencyToggle';

interface ETFDetailHeaderProps {
  etf: ETF;
}

const ETFDetailHeader: React.FC<ETFDetailHeaderProps> = ({ etf }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{etf.name}</h1>
          <p className="text-lg text-gray-600 mb-4">
            {(etf.primary_ticker || etf.exchange_1_ticker) && 
              `${etf.primary_ticker || etf.exchange_1_ticker} • `
            }
            {etf.isin} • {etf.fund_provider}
          </p>
          <div className="mb-4">
            <ETFRating etf={etf} showDescription size="lg" />
          </div>
          <div className="flex flex-wrap gap-2">
            {etf.degiro_free && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                DEGIRO Free
              </Badge>
            )}
            {etf.category === 'Páková ETF' && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 font-semibold">
                PÁKOVÁ ETF
              </Badge>
            )}
            <Badge variant="outline">
              {etf.category}
            </Badge>
            <Badge variant="outline">
              {etf.fund_currency}
            </Badge>
            <Badge variant="outline">
              {etf.distribution_policy}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="hidden md:block">
            <CurrencyToggle />
          </div>
        </div>
      </div>
      
      <div className="flex justify-center md:hidden mt-4">
        <CurrencyToggle />
      </div>
    </div>
  );
};

export default ETFDetailHeader;