import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import MonteCarloContent from '@/components/tools/MonteCarloContent';

export const metadata: Metadata = {
  title: 'Monte Carlo simulátor ETF portfolia 2025 | Prognóza investic',
  description: 'Generujte tisíce scénářů budoucího vývoje vašeho ETF portfolia. Monte Carlo simulace ukáže pravděpodobnostní rozsah výsledků na 5-30 let dopředu. Zdarma online nástroj.',
  keywords: [
    'Monte Carlo simulace',
    'simulátor portfolia',
    'prognóza investic',
    'pravděpodobnostní analýza',
    'budoucí hodnota portfolia',
    'ETF prognóza',
    'investiční scénáře',
    'riziko portfolia',
    'percentily výnosů',
    'finanční plánování',
    'důchodové plánování',
    'FIRE kalkulačka'
  ],
  openGraph: {
    title: 'Monte Carlo simulátor ETF portfolia 2025',
    description: 'Generujte tisíce scénářů budoucího vývoje portfolia. Zjistěte pravděpodobnostní rozsah výsledků investice.',
    type: 'website',
    locale: 'cs_CZ'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monte Carlo simulátor ETF portfolia 2025',
    description: 'Tisíce scénářů budoucího vývoje vašeho portfolia.'
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/kalkulacky/monte-carlo-simulator'
  }
};

export default function MonteCarloSimulatorPage() {
  return (
    <Layout>
      <MonteCarloContent />
    </Layout>
  );
}
