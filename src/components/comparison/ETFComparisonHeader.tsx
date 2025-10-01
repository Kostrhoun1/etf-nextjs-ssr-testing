'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CurrencyToggle from '@/components/ui/CurrencyToggle';

interface ETFComparisonHeaderProps {
  selectedCount: number;
  onShowDetailedComparison: () => void;
  onClearAll: () => void;
}

const ETFComparisonHeader: React.FC<ETFComparisonHeaderProps> = ({ 
  selectedCount, 
  onShowDetailedComparison, 
  onClearAll 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            ETF srovnání - Nejlepší nástroj pro porovnání ETF fondů 2025
          </h1>
          <p className="text-gray-600 mt-2">
            Porovnejte více než 3500 ETF fondů podle TER poplatků, výkonnosti a rizika. Vyberte až 3 fondy pro detailní analýzu.
          </p>
        </div>
        
        <div className="flex gap-3">
          {selectedCount > 0 && (
            <>
              <Button variant="outline" onClick={onClearAll}>
                Vymazat výběr ({selectedCount})
              </Button>
              {selectedCount >= 2 && (
                <Button onClick={onShowDetailedComparison}>
                  Porovnat vybrané fondy
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ETFComparisonHeader;