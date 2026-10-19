'use client';

/* Fond, ze kterého návštěvník přišel na /kde-koupit (?isin=…). Sdílí ho hero (FondZDetailu) a kalkulačka nákladů
   (NakladyKalkulacka – u DEGIRO pak nevíme, zda je fond ve výběru ETF Selection). Parametr čte až prohlížeč
   (window.location), ne useSearchParams – stránka tak zůstává ve statickém HTML (ISR, SEO). */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Fond = { isin: string; name: string; ticker: string | null; xetra: boolean };

const FondCtx = createContext<Fond | null>(null);
export const useFond = () => useContext(FondCtx);

export function FondProvider({ children }: { children: ReactNode }) {
  const [fond, setFond] = useState<Fond | null>(null);
  useEffect(() => {
    const isin = (new URLSearchParams(window.location.search).get('isin') ?? '').trim().toUpperCase();
    if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(isin)) return;
    let zruseno = false;
    fetch(`/kde-koupit/fond?isin=${encodeURIComponent(isin)}`)
      .then((r) => (r.ok ? r.json() : { fond: null }))
      .then((d: { fond: Fond | null }) => { if (!zruseno) setFond(d.fond); })
      .catch(() => { /* bez fondu = obecná stránka */ });
    return () => { zruseno = true; };
  }, []);
  return <FondCtx.Provider value={fond}>{children}</FondCtx.Provider>;
}
