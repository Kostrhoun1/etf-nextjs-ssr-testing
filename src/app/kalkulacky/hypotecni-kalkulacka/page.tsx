import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import MortgageCalculatorContent from '@/components/tools/MortgageCalculatorContent';

export const metadata: Metadata = {
  title: 'Hypoteční kalkulačka 2025 | Výpočet splátky hypotéky',
  description: 'Přesná hypoteční kalkulačka 2025. Spočítejte si měsíční splátky hypotéky, celkové náklady na úvěr a porovnejte nabídky bank. Aktuální úrokové sazby.',
  keywords: [
    'hypoteční kalkulačka 2025',
    'výpočet hypotéky',
    'měsíční splátka hypotéky',
    'úrokové sazby hypotéky',
    'kalkulačka úvěru na bydlení',
    'hypotéka 2025',
    'refinancování hypotéky',
    'srovnání hypoték'
  ],
  openGraph: {
    title: 'Hypoteční kalkulačka 2025 - Přesný výpočet splátky',
    description: 'Spočítejte si přesnou výši měsíční splátky hypotéky s aktuálními úrokovými sazbami pro rok 2025.',
    type: 'website',
    locale: 'cs_CZ'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hypoteční kalkulačka 2025',
    description: 'Přesný výpočet měsíční splátky hypotéky s aktuálními sazbami.'
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/kalkulacky/hypotecni-kalkulacka'
  }
};

export default function HypotecniKalkulackaPage() {
  return (
    <Layout>
      <MortgageCalculatorContent />
    </Layout>
  );
}