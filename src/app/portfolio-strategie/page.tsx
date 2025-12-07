import React from 'react';
import Layout from '@/components/Layout';
import StructuredData from '@/components/SEO/StructuredData';
import PortfolioStrategieClient from './PortfolioStrategieClient';
import { Metadata } from 'next';

const currentYear = new Date().getFullYear();

export const metadata: Metadata = {
  title: `5 Osvědčených Portfolio Strategií pro ETF Investory ${currentYear} | ETF průvodce.cz`,
  description: `✅ Porovnejte reálnou performance 5 investičních strategií: Permanentní Portfolio, Ray Dalio All-Weather, Nobel Portfolio, Akciové a Dividendové. Včetně aktuálních dat z databáze 4300+ ETF.`,
  keywords: `portfolio strategie, ETF strategie ${currentYear}, investiční portfolio, Ray Dalio All Weather, Nobel portfolio, dividendové portfolio, permanentní portfolio, performance ETF, asset allocation`,
  openGraph: {
    title: `5 Osvědčených Portfolio Strategií pro ETF Investory ${currentYear}`,
    description: `Porovnejte reálnou performance 5 investičních strategií: Permanentní Portfolio, Ray Dalio All-Weather, Nobel Portfolio, Akciové a Dividendové. Včetně aktuálních dat z databáze ETF.`,
    url: 'https://www.etfpruvodce.cz/portfolio-strategie',
    siteName: 'ETF průvodce.cz',
    images: [{
      url: 'https://www.etfpruvodce.cz/og-portfolio-strategie.jpg',
      width: 1200,
      height: 630,
    }],
    locale: 'cs_CZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `5 Osvědčených Portfolio Strategií ${currentYear}`,
    description: `Porovnejte reálnou performance 5 investičních strategií pro ETF investory.`,
    images: ['https://www.etfpruvodce.cz/og-portfolio-strategie.jpg'],
  },
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/portfolio-strategie',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PortfolioStrategiePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Domů",
        "item": "https://www.etfpruvodce.cz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `Portfolio Strategie ${currentYear}`,
        "item": "https://www.etfpruvodce.cz/portfolio-strategie"
      }
    ]
  };

  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": `Portfolio Strategie pro ETF Investory ${currentYear}`,
    "description": "5 osvědčených portfolio strategií s reálnou performance z databáze ETF fondů",
    "provider": {
      "@type": "Organization",
      "name": "ETF průvodce.cz",
      "url": "https://www.etfpruvodce.cz"
    },
    "category": "Investment Strategy",
    "audience": {
      "@type": "Audience",
      "audienceType": "investors"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Která portfolio strategie je nejlepší pro začátečníky?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pro začátečníky doporučujeme Nobel Portfolio nebo Dividendové portfolio. Jsou jednoduché na implementaci, vyžadují pouze 2-3 ETF fondy a historicky dosahují solidních výnosů kolem 6% ročně."
        }
      },
      {
        "@type": "Question",
        "name": "Jak často mám rebalancovat portfolio podle strategie?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Doporučujeme rebalancing 2x ročně nebo když některá alokace vybočí o více než 5% od cílové hodnoty. Například u 60/40 portfolia rebalancujte když máte 65/35 nebo 55/45."
        }
      },
      {
        "@type": "Question",
        "name": "Jsou portfolio strategie vhodné i pro malé částky?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano! Většina strategií funguje s částkami od 1000 Kč měsíčně. U malých částek doporučujeme začít s jedním širokým ETF (VWCE) a postupně přidávat další komponenty."
        }
      },
      {
        "@type": "Question",
        "name": "Jak se liší výkonnost jednotlivých strategií?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Naše analýza z období 1995-2024 ukazuje: Akciové 7-8% ročně, Nobel 6%, Dividendové 4% dividendy + růst, All-Weather 5-8%, Permanentní 4%. Vyšší výnos = vyšší volatilita."
        }
      }
    ]
  };

  return (
    <Layout>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={financialProductSchema} />
      <StructuredData data={faqSchema} />

      <PortfolioStrategieClient currentYear={currentYear} />
    </Layout>
  );
}
