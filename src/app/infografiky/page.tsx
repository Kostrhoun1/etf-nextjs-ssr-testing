import React from 'react';
import type { Metadata } from 'next';
import InfographicsContent from '@/components/infographics/InfographicsContent';

export const metadata: Metadata = {
  title: 'Infografiky ETF - Vizuální průvodce investováním',
  description: 'Interaktivní infografiky a vizualizace pro ETF investování. Generátor grafů, portfolio analýzy a investiční nástroje v češtině i angličtině.',
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/infografiky'
  }
};

export default function InfographicsPage() {
  return <InfographicsContent />;
}