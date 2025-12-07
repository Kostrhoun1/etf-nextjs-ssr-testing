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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Hypoteční kalkulačka 2025',
  description: 'Přesná kalkulačka pro výpočet měsíčních splátek hypotéky s aktuálními úrokovými sazbami.',
  url: 'https://www.etfpruvodce.cz/kalkulacky/hypotecni-kalkulacka',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CZK'
  },
  featureList: [
    'Výpočet měsíční splátky hypotéky',
    'Analýza celkových nákladů úvěru',
    'Porovnání různých úrokových sazeb',
    'Graf vývoje zůstatku dluhu',
    'Aktuální data pro rok 2025'
  ]
};

export default function HypotecniKalkulackaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Layout>
        <MortgageCalculatorContent />
      </Layout>
    </>
  );
}