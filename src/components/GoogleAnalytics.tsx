'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          // Rozhodnutí majitele 18. 10. 2026: Google signals a reklamní personalizace vypnuté
          // (web nesmí používat nástroje vyžadující souhlas; měření chování je vlastní, bez cookies).
          gtag('config', '${measurementId}', { allow_google_signals: false, allow_ad_personalization_signals: false });
        `}
      </Script>
    </>
  );
}