import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import ClientErrorReporter from '@/components/ClientErrorReporter';
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
  // POZOR: canonical zde NENASTAVOVAT. Next.js metadata se dědí, takže globální
  // canonical:'/' by na KAZDE stránce bez vlastního canonicalu hlásil Googlu
  // homepage jako kanonickou URL → stránky se berou jako duplikáty a neindexují se.
  // Homepage má vlastní canonical:'/' ve svém page.tsx; ostatní stránky se
  // self-kanonizují na vlastní URL (žádný tag = Google bere vlastní adresu).
  // POZOR: ani og:url / og:title / og:description zde NENASTAVOVAT – ze stejného důvodu jako
  // canonical. Dědily se na 102 stránek bez vlastního openGraph (žebříčky, srovnání, portfolia,
  // recenze, kalkulačky) a Facebook pak sdílel KAŽDOU z nich jako homepage (audit 17. 10. 2026).
  // Bez nich si Facebook/LinkedIn vezmou skutečnou adresu, <title> a popis dané stránky.
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'ETF průvodce.cz',
    images: [
      {
        url: '/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'ETF průvodce.cz - Nejlepší ETF fondy pro české investory',
      },
    ],
  },
  // Jen typ karty – title/description/obrázek si X bere z og:* dané stránky.
  // (Globální twitter.title tady dřív přebíjel titulky článků na celém webu.)
  twitter: {
    card: 'summary_large_image',
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
    // Seznam Webmaster (search.seznam.cz/wmt) – ověření vlastnictví, osobní Seznam účet.
    // Neodstraňovat: bez něj Seznam Webmaster přestane ukazovat data o indexaci.
    'seznam-wmt': 'iFpr9DXojGjJlaJLLC30J107n0voWcrc',
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
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Author & Organization Schema - E-E-A-T signals for Google */}
        <AuthorSchema />
      </head>
      <body className={`${inter.className} antialiased overflow-x-clip`}>
        {/* Přístupnost: z klávesnice/čtečky rovnou na obsah, bez procházení navigace. */}
        <a href="#obsah" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-teal-800 focus:shadow-lg focus:ring-2 focus:ring-teal-600">Přeskočit na obsah</a>
        <GoogleAnalytics measurementId="G-JYJPWHLMZX" />
        <ClientErrorReporter />
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
