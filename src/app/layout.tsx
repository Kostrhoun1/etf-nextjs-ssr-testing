import type { Metadata } from "next";
import "./globals.css";
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata: Metadata = {
  title: {
    default: "ETF průvodce.cz - Nejlepší ETF fondy pro české investory",
    template: "%s | ETF průvodce.cz"
  },
  description: "★ ZDARMA ETF průvodce ★ Srovnání více než 3500 ETF fondů pro české investory s výkonností přepočítanou do CZK! Kompletní databáze, pokročilé filtry, srovnání brokerů a investiční kalkulačky.",
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
    title: 'ETF průvodce.cz - Srovnání 3500+ ETF fondů s výkonností v CZK',
    description: 'Kompletní databáze ETF fondů pro české investory s výkonností přepočítanou do korun. Pokročilé filtry, srovnání brokerů a kalkulačky zdarma!',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ETF průvodce.cz - Nejlepší ETF fondy pro české investory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ETF průvodce.cz - Srovnání 3500+ ETF fondů s výkonností v CZK',
    description: 'Kompletní databáze ETF fondů pro české investory s výkonností přepočítanou do korun. Pokročilé filtry, srovnání brokerů a kalkulačky zdarma!',
    images: ['/og-image.jpg'],
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
    'google-site-verification': 'your-google-verification-code',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://nbhwnatadyubiuadfakx.supabase.co" />
      </head>
      <body className="font-sans antialiased">
        <GoogleAnalytics measurementId="G-JYJPWHLMZX" />
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
