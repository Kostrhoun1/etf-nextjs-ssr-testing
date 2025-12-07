import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import FIRECalculatorContent from '@/components/tools/FIRECalculatorContent';

export const metadata: Metadata = {
  title: 'FIRE kalkulačka - Kdy dosáhnu finanční nezávislosti?',
  description: '✅ Spočítejte si kdy dosáhnete FIRE podle 4% pravidla. Kalkulačka finanční nezávislosti s Trinity Study analýzou. Lean/Regular/Fat FIRE plánování předčasného důchodu.',
  keywords: 'FIRE kalkulačka, finanční nezávislost, předčasný důchod, 4% pravidlo, trinity study, lean fire, regular fire, fat fire, ETF investice, kdy dosáhnu FIRE',
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/kalkulacky/fire-kalkulacka'
  },
  openGraph: {
    title: 'FIRE kalkulačka - Kdy dosáhnu finanční nezávislosti?',
    description: '✅ Spočítejte si kdy dosáhnete FIRE podle 4% pravidla. Kalkulačka finanční nezávislosti s Trinity Study analýzou.',
    url: 'https://www.etfpruvodce.cz/kalkulacky/fire-kalkulacka',
    images: [
      {
        url: 'https://www.etfpruvodce.cz/og-fire-kalkulacka.jpg',
        width: 1200,
        height: 630,
        alt: 'FIRE kalkulačka - Kdy dosáhnu finanční nezávislosti?'
      }
    ]
  }
};

export default function FIREKalkulackaPage() {
  return (
    <Layout>
      <FIRECalculatorContent />
    </Layout>
  );
}