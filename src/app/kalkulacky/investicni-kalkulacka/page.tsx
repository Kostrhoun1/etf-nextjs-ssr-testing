import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import InvestmentCalculatorContent from '@/components/tools/InvestmentCalculatorContent';

export const metadata: Metadata = {
  title: 'Investiční kalkulačka 2025 - Pravidelné investování | ETF průvodce.cz',
  description: '✅ Bezplatná investiční kalkulačka pro pravidelné investování. Spočítejte si výnosy z měsíčního investování do ETF fondů. Včetně daní, inflace a složeného úročení. Zdarma 2025.',
  keywords: 'investiční kalkulačka, pravidelné investování, měsíční investice, složené úročení, výpočet výnosů, ETF kalkulačka 2025, složené úročení',
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/kalkulacky/investicni-kalkulacka'
  },
  openGraph: {
    title: 'Investiční kalkulačka 2025 - Pravidelné investování',
    description: '✅ Bezplatná investiční kalkulačka pro pravidelné investování. Spočítejte si výnosy z měsíčního investování do ETF fondů.',
    url: 'https://www.etfpruvodce.cz/kalkulacky/investicni-kalkulacka',
    images: [
      {
        url: 'https://www.etfpruvodce.cz/og-investicni-kalkulacka.jpg',
        width: 1200,
        height: 630,
        alt: 'Investiční kalkulačka 2025 - Pravidelné investování'
      }
    ]
  }
};

export default function InvesticniKalkulackaPage() {
  return (
    <Layout>
      <InvestmentCalculatorContent />
    </Layout>
  );
}