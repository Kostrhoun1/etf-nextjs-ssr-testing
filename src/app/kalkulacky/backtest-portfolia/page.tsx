import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import BacktestContent from '@/components/tools/BacktestContent';

export const metadata: Metadata = {
  title: 'Backtest portfolia ETF 2025 | Historická simulace',
  description: 'Otestujte historickou výkonnost ETF portfolia s reálnými daty od roku 2000. Analyzujte rizika, drawdowny, CAGR a porovnejte různé investiční strategie. Pravidelné investování (DCA) v CZK.',
  keywords: [
    'backtest ETF',
    'historická simulace portfolia',
    'ETF portfolio backtest',
    'backtest investic',
    'historická výkonnost ETF',
    'DCA kalkulačka',
    'pravidelné investování',
    'Monte Carlo simulace',
    'analýza rizika portfolia',
    'CAGR kalkulačka',
    'drawdown analýza',
    'volatilita portfolia'
  ],
  openGraph: {
    title: 'Backtest portfolia ETF 2025 - Historická simulace',
    description: 'Otestujte historickou výkonnost vašeho ETF portfolia s reálnými daty. Pravidelné investování, analýza rizik, Monte Carlo simulace.',
    type: 'website',
    locale: 'cs_CZ'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Backtest portfolia ETF 2025',
    description: 'Historická simulace ETF portfolia s reálnými daty od roku 2000.'
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/kalkulacky/backtest-portfolia'
  }
};

export default function BacktestPortfoliaPage() {
  return (
    <Layout>
      <BacktestContent />
    </Layout>
  );
}
