'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

// GA jen na ostré doméně. Lokální produkční build (testeři, Playwright) a náhledy na *.vercel.app GA dřív načítaly
// a každý testovací prohlížeč se počítal jako nový uživatel (18.–21. 10. 2026: až 120 „uživatelů“ denně z localhostu).
// Hlídá scripts/check-fund-data.mjs (blok „GA jen produkce“).
export const GA_HOSTY = ['etfpruvodce.cz', 'www.etfpruvodce.cz'];

interface GoogleAnalyticsProps {
  measurementId: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const [ostry, setOstry] = useState(false);
  useEffect(() => setOstry(GA_HOSTY.includes(window.location.hostname)), []);
  if (!ostry) return null;
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