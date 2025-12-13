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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Backtest portfolia ETF 2025',
  description: 'Nástroj pro historickou simulaci výkonnosti ETF portfolia s reálnými daty od roku 2000. Podpora pravidelných investic (DCA), analýza rizik a Monte Carlo simulace.',
  url: 'https://www.etfpruvodce.cz/kalkulacky/backtest-portfolia',
  applicationCategory: 'FinanceApplication',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CZK'
  },
  featureList: [
    'Historická simulace od roku 2000',
    'Pravidelné investování (DCA)',
    'Podpora CZK, EUR a USD',
    'Analýza rizika a drawdownů',
    'Monte Carlo simulace budoucnosti',
    'Porovnání různých strategií',
    'Přednastavená portfolia (60/40, All Weather, Permanent)',
    'Výpočet CAGR, Sharpe Ratio, volatility'
  ]
};

export default function BacktestPortfoliaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Layout>
        <BacktestContent />
      </Layout>
    </>
  );
}
