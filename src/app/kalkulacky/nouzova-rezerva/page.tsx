import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import EmergencyFundContent from '@/components/tools/EmergencyFundContent';

export const metadata: Metadata = {
  title: 'Kalkulačka nouzové rezervy 2026 - Emergency Fund',
  description: '✅ Spočítejte si optimální velikost nouzové rezervy podle rizikového profilu. Kde držet peníze, strategie spoření a finanční bezpečnost 2026.',
  keywords: 'nouzová rezerva, emergency fund, kalkulačka rezervy, kde držet peníze, finanční bezpečnost 2026, rezervní fond',
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/kalkulacky/nouzova-rezerva'
  },
  openGraph: {
    title: 'Kalkulačka nouzové rezervy 2026 - Emergency Fund',
    description: '✅ Spočítejte si optimální velikost nouzové rezervy podle rizikového profilu. Kde držet peníze a strategie spoření.',
    url: 'https://www.etfpruvodce.cz/kalkulacky/nouzova-rezerva',
    images: [
      {
        url: 'https://www.etfpruvodce.cz/og-nouzova-rezerva.jpg',
        width: 1200,
        height: 630,
        alt: 'Kalkulačka nouzové rezervy 2026'
      }
    ]
  }
};

export default function NouzovaRezarvaPage() {
  return (
    <Layout>
      <EmergencyFundContent />
    </Layout>
  );
}