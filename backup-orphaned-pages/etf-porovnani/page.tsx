import React from 'react';
import type { Metadata } from 'next';
import ETFComparisonContent from '@/components/etf/ETFComparisonContent';

export const metadata: Metadata = {
  title: 'Pokročilé porovnání ETF fondů - Detailní analýza | ETF průvodce.cz',
  description: 'Pokročilé nástroje pro porovnání ETF fondů. Detailní analýza poplatků, výkonnosti, rizik a složení portfolia. Najděte nejlepší ETF pro investice.',
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/etf-porovnani'
  }
};

export default function ETFComparisonPage() {
  return <ETFComparisonContent />;
}