import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import NetSalaryCalculatorContent from '@/components/tools/NetSalaryCalculatorContent';

export const metadata: Metadata = {
  title: 'Kalkulačka čisté mzdy 2025 | Výpočet čistého platu',
  description: 'Přesná kalkulačka čisté mzdy 2025. Spočítejte si čistý plat ze superhrubé mzdy podle aktuální české legislativy. Zahrnuje daně, pojistné a slevy.',
  keywords: [
    'kalkulačka čisté mzdy 2025',
    'výpočet čistého platu',
    'čistá mzda z hrubé',
    'daň z příjmu 2025',
    'sociální pojištění',
    'zdravotní pojištění',
    'slevy na dani',
    'superhrubá mzda'
  ],
  openGraph: {
    title: 'Kalkulačka čisté mzdy 2025 - Přesný výpočet',
    description: 'Spočítejte si čistý plat podle aktuální české legislativy pro rok 2025 včetně všech odvodů.',
    type: 'website',
    locale: 'cs_CZ'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulačka čisté mzdy 2025',
    description: 'Přesný výpočet čistého platu podle české legislativy 2025.'
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/kalkulacky/cisty-plat-2025'
  }
};

export default function CistyPlat2025Page() {
  return (
    <Layout>
      <NetSalaryCalculatorContent />
    </Layout>
  );
}