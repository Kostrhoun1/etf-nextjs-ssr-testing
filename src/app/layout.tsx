import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import AuthorSchema from '@/components/SEO/AuthorSchema';
import CompareTray from '@/components/design-preview/CompareTray';
import SiteFooter from '@/components/design-preview/SiteFooter';
import { getTotalETFCount } from '@/lib/etf-data';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

export async function generateMetadata(): Promise<Metadata> {
  const n = await getTotalETFCount();
  const count = n > 0 ? n.toLocaleString('cs-CZ') : '4 800';
  return {
  title: {
    default: "ETF průvodce.cz - Nejlepší ETF fondy pro české investory",
    template: "%s | ETF průvodce.cz"
  },
  description: `Srovnání více než ${count} ETF fondů s výnosy přepočtenými do korun. Žebříčky, backtest portfolia, investiční kalkulačky a srovnání brokerů – zdarma a česky.`,
  keywords: [
    "ETF fondy", "nejlepší ETF", "ETF srovnání", "kde koupit ETF",
    "ETF výkonnost CZK", "přepočet výnosů ETF", "ETF česká koruna přepočet", 
    "DEGIRO ETF", "portfolio strategie", "investiční kalkulačky",
    "ETF průvodce", "české investování", "dividendové ETF"
  ],
  authors: [{ name: "ETF průvodce.cz" }],
  creator: "ETF průvodce.cz",
  publisher: "ETF průvodce.cz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://etfpruvodce.cz'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://etfpruvodce.cz',
    siteName: 'ETF průvodce.cz',
    title: `ETF průvodce.cz | Srovnání ${count} ETF fondů`,
    description: 'Kompletní databáze ETF fondů pro české investory s výkonností přepočítanou do korun. Pokročilé filtry, srovnání brokerů a kalkulačky zdarma!',
    images: [
      {
        url: '/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'ETF průvodce.cz - Nejlepší ETF fondy pro české investory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `ETF průvodce.cz | Srovnání ${count} ETF fondů`,
    description: 'Kompletní databáze ETF fondů pro české investory s výkonností přepočítanou do korun. Pokročilé filtry, srovnání brokerů a kalkulačky zdarma!',
    images: ['/og-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'google-site-verification': 'xcO4Z-AnzPYJ288SOKyYz4KphoizdnaitN7V8e1yXKc',
  },
  verification: {
    google: 'xcO4Z-AnzPYJ288SOKyYz4KphoizdnaitN7V8e1yXKc',
  },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${inter.variable} overflow-x-clip`}>
      <head>
        <link rel="dns-prefetch" href="https://nbhwnatadyubiuadfakx.supabase.co" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" type="application/rss+xml" title="ETF průvodce.cz RSS" href="/rss.xml" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Author & Organization Schema - E-E-A-T signals for Google */}
        <AuthorSchema />
      </head>
      <body className={`${inter.className} antialiased overflow-x-clip`}>
        <GoogleAnalytics measurementId="G-JYJPWHLMZX" />
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
        <SiteFooter />
        <CompareTray />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
