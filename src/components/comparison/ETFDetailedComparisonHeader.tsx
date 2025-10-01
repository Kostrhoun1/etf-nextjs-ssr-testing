'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ETFDetailedComparisonHeaderProps {
  onBack: () => void;
}

const ETFDetailedComparisonHeader: React.FC<ETFDetailedComparisonHeaderProps> = ({ onBack }) => {
  return (
    <div className="mb-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Zpět na seznam
      </Button>
      <h1 className="text-3xl font-bold text-gray-900">
        Detailní porovnání ETF fondů
      </h1>
      <p className="text-gray-600 mt-2">
        Kompletní srovnání všech dostupných parametrů vybraných fondů
      </p>
    </div>
  );
};

export default ETFDetailedComparisonHeader;