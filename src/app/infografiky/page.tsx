import React from 'react';
import type { Metadata } from 'next';
import InfographicsContent from '@/components/infographics/InfographicsContent';

export const metadata: Metadata = {
  title: 'Infografiky ETF - Vizuální průvodce investováním',
  description: '✅ Interaktivní infografiky a vizualizace ETF fondů 2025. Nejlepší ETF podle výkonnosti, nejlevnější ETF podle TER, tržní heatmapa. Bezplatné investiční nástroje v češtině.',
  keywords: 'ETF infografiky, vizualizace ETF, nejlepší ETF graf, TER srovnání, tržní heatmapa, investiční grafy, ETF analýza',
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/infografiky'
  },
  openGraph: {
    title: 'Infografiky ETF - Vizuální průvodce investováním',
    description: 'Interaktivní infografiky a vizualizace ETF fondů. Nejlepší ETF podle výkonnosti, nejlevnější podle TER, tržní heatmapa.',
    url: 'https://www.etfpruvodce.cz/infografiky',
    siteName: 'ETF průvodce.cz',
    locale: 'cs_CZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infografiky ETF - Vizuální průvodce investováním',
    description: 'Interaktivní infografiky ETF fondů. Výkonnost, TER poplatky, tržní heatmapa.',
  }
};

export default function InfographicsPage() {
  return <InfographicsContent />;
}