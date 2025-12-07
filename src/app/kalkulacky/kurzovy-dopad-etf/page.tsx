import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import CurrencyImpactAnalyzerContent from '@/components/tools/CurrencyImpactAnalyzerContent';

export const metadata: Metadata = {
  title: 'Kalkulačka kurzového dopadu ETF 2025 | Měnové riziko ETF',
  description: '✅ Bezplatná kalkulačka kurzového dopadu ETF. Analyzujte měnové riziko CSPX, VWCE a hedged ETF. Spočítejte dopad kurzových změn na vaše portfolio za 2 minuty.',
  keywords: 'kalkulačka kurzový dopad ETF, měnové riziko ETF, CSPX hedging, EUR hedged ETF, USD CZK kurz, currency hedging kalkulačka 2025',
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/kalkulacky/kurzovy-dopad-etf'
  },
  openGraph: {
    title: 'Kalkulačka kurzového dopadu ETF 2025 | Měnové riziko ETF',
    description: '✅ Bezplatná kalkulačka kurzového dopadu ETF. Analyzujte měnové riziko CSPX, VWCE a hedged ETF. Spočítejte dopad kurzových změn na vaše portfolio za 2 minuty.',
    url: 'https://www.etfpruvodce.cz/kalkulacky/kurzovy-dopad-etf',
    images: [
      {
        url: 'https://www.etfpruvodce.cz/og-kurzovy-dopad-etf.jpg',
        width: 1200,
        height: 630,
        alt: 'Kalkulačka kurzového dopadu ETF 2025'
      }
    ]
  }
};

export default function KurzovyDopadETFPage() {
  return (
    <Layout>
      <CurrencyImpactAnalyzerContent />
    </Layout>
  );
}