'use client';

/* Stav volby měny pro zobrazení VÝKONNOSTI fondů. Default = CZK.
   Kolo 6b (rozhodnutí: výnosy v Kč jsou USP webu): volba platí JEN v rámci stránky – při každém novém vstupu
   na stránku (i klientskou navigací) je zase CZK. Dřív se volba pamatovala v localStorage napříč stránkami
   a návštěvník, který si jednou přepnul EUR, pak všude viděl eura bez vysvětlení.
   Všechny výkonnostní plochy stránky reagují přes subscribe. Čisté helpery (curSuffix/curLabel/pickReturn/
   CURRENCIES/Currency) jsou v currency.ts a re-exportují se odsud pro pohodlí. */

import { useEffect, useState } from 'react';
import { type Currency } from '@/components/design-preview/currency';

export { CURRENCIES, curSuffix, curLabel, pickReturn, type Currency } from '@/components/design-preview/currency';

const EVT = 'dp-currency-change';
const DEFAULT: Currency = 'CZK';
/** Volba na aktuální stránce (cesta) – jiná cesta = výchozí CZK. */
let volba: { cesta: string; mena: Currency } | null = null;

// Úklid staré trvalé volby (dřív localStorage „dp-currency-v1“) – jinak by ležela v prohlížeči zbytečně.
if (typeof window !== 'undefined') {
  try { window.localStorage.removeItem('dp-currency-v1'); } catch { /* ignore */ }
}

export function getCurrency(): Currency {
  if (typeof window === 'undefined') return DEFAULT;
  return volba && volba.cesta === window.location.pathname ? volba.mena : DEFAULT;
}

export function setCurrency(cur: Currency) {
  if (typeof window === 'undefined') return;
  volba = { cesta: window.location.pathname, mena: cur };
  window.dispatchEvent(new CustomEvent(EVT));
}

export function subscribeCurrency(cb: () => void): () => void {
  const h = () => cb();
  window.addEventListener(EVT, h);
  return () => window.removeEventListener(EVT, h);
}

/** Hook: aktuální měna + setter, reaktivní na změny z jiných komponent stránky. */
export function useCurrency(): [Currency, (c: Currency) => void] {
  const [cur, setCur] = useState<Currency>(DEFAULT);
  useEffect(() => {
    setCur(getCurrency());
    return subscribeCurrency(() => setCur(getCurrency()));
  }, []);
  return [cur, setCurrency];
}
