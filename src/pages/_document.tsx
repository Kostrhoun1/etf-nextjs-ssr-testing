import { Html, Head, Main, NextScript } from 'next/document';
import AuthorSchema from '@/components/SEO/AuthorSchema';

export default function Document() {
  return (
    <Html lang="cs">
      <Head>
        <link rel="dns-prefetch" href="https://nbhwnatadyubiuadfakx.supabase.co" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" type="application/rss+xml" title="ETF průvodce.cz RSS" href="/rss.xml" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="google-site-verification" content="xcO4Z-AnzPYJ288SOKyYz4KphoizdnaitN7V8e1yXKc" />

        {/* Author & Organization Schema - E-E-A-T signals for Google */}
        <AuthorSchema />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
