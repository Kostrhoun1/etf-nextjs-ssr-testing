import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'Monte Carlo Simulátor | Analýza investičních rizik ETF portfolia',
  description: 'Pokročilý Monte Carlo simulátor pro analýzu pravděpodobnosti úspěchu investičního portfolia. Simulace tisíců scénářů pro ETF investice.',
  keywords: 'Monte Carlo simulátor, analýza rizik, portfolio simulace, ETF rizika, pravděpodobnost úspěchu',
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/kalkulacky/monte-carlo-simulator',
  },
  openGraph: {
    title: 'Monte Carlo Simulátor | ETF průvodce.cz',
    description: 'Pokročilý Monte Carlo simulátor pro analýzu pravděpodobnosti úspěchu investičního portfolia.',
    url: 'https://www.etfpruvodce.cz/kalkulacky/monte-carlo-simulator',
    siteName: 'ETF průvodce.cz',
    locale: 'cs_CZ',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

export default function MonteCarloSimulatorPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Monte Carlo Simulátor</h1>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">🚀 Pokročilá kalkulačka se připravuje</h2>
          <p>Monte Carlo simulátor pro analýzu portfolia bude brzy dostupný.</p>
        </div>
      </div>
    </Layout>
  );
}