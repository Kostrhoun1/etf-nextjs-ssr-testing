'use client';

/* Stav volby měny pro zobrazení VÝKONNOSTI fondů (nový web = samostatné SSR
   stránky). Uživatel zvolí jednou, drží se napříč stránkami přes localStorage
   a všechny výkonnostní plochy reagují přes subscribe. Default = CZK.
   Čisté helpery (curSuffix/curLabel/pickReturn/CURRENCIES/Currency) jsou v
   currency.ts a re-exportují se odsud pro pohodlí. */

import { useEffect, useState } from 'react';
import { type Currency } from '@/components/design-preview/currency';

export { CURRENCIES, curSuffix, curLabel, pickReturn, type Currency } from '@/components/design-preview/currency';

const KEY = 'dp-currency-v1';
const EVT = 'dp-currency-change';
const DEFAULT: Currency = 'CZK';
const VALID: Currency[] = ['CZK', 'EUR', 'USD'];

export function getCurrency(): Currency {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const v = window.localStorage.getItem(KEY) as Currency | null;
    return v && VALID.includes(v) ? v : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function setCurrency(cur: Currency) {
  try {
    window.localStorage.setItem(KEY, cur);
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    /* ignore */
  }
}

export function subscribeCurrency(cb: () => void): () => void {
  const h = () => cb();
  window.addEventListener(EVT, h);
  const sh = (e: StorageEvent) => { if (e.key === KEY) cb(); };
  window.addEventListener('storage', sh);
  return () => {
    window.removeEventListener(EVT, h);
    window.removeEventListener('storage', sh);
  };
}

/** Hook: aktuální měna + setter, reaktivní na změny z jiných komponent/záložek. */
export function useCurrency(): [Currency, (c: Currency) => void] {
  const [cur, setCur] = useState<Currency>(DEFAULT);
  useEffect(() => {
    setCur(getCurrency());
    return subscribeCurrency(() => setCur(getCurrency()));
  }, []);
  return [cur, setCurrency];
}
