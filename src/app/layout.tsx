import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ETF průvodce.cz - Nejlepší ETF fondy pro české investory",
    template: "%s | ETF průvodce.cz"
  },
  description: "★ ZDARMA ETF průvodce ★ Kompletní databáze 3500+ ETF fondů s analýzami a kalkulačkami pro české investory. Srovnání brokerů, portfolio strategie, investiční nástroje.",
  keywords: [
    "ETF fondy", "nejlepší ETF", "ETF srovnání", "kde koupit ETF", 
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
    title: 'ETF průvodce.cz - Nejlepší ETF fondy pro české investory',
    description: 'Kompletní databáze 3500+ ETF fondů s analýzami a kalkulačkami pro české investory.',
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
    title: 'ETF průvodce.cz - Nejlepší ETF fondy pro české investory',
    description: 'Kompletní databáze 3500+ ETF fondů s analýzami a kalkulačkami pro české investory.',
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
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
