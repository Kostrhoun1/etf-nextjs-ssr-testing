import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${inter.className} antialiased`}>
      <GoogleAnalytics measurementId="G-JYJPWHLMZX" />
      <CurrencyProvider>
        <Component {...pageProps} />
      </CurrencyProvider>
      <SpeedInsights />
      <Analytics />
    </div>
  );
}
