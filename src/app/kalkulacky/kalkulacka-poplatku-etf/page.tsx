import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import FeeCalculatorContent from '@/components/tools/FeeCalculatorContent';

export const metadata: Metadata = {
  title: 'Kalkulačka poplatků ETF 2025 - TER a dopad na výnosy | ETF průvodce.cz',
  description: '✅ Spočítejte si dopad poplatků ETF na dlouhodobé výnosy. Srovnání TER, transakčních poplatků a jejich vliv na investice do ETF fondů. Zdarma 2025.',
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/kalkulacky/kalkulacka-poplatku-etf'
  }
};

export default function FeeCalculatorPage() {
  return (
    <Layout>
      <FeeCalculatorContent />
    </Layout>
  );
}