'use client';

/* Sdílená volba měny pro zobrazení VÝKONNOSTI fondů (nový web = samostatné SSR
   stránky). Uživatel zvolí jednou, drží se napříč stránkami přes localStorage
   a všechny výkonnostní plochy reagují přes subscribe. Default = CZK (český
   investor). Báze dat v justETF je EUR, proto EUR = sloupec bez přípony. */

import { useEffect, useState } from 'react';

export type Currency = 'CZK' | 'EUR' | 'USD';

const KEY = 'dp-currency-v1';
const EVT = 'dp-currency-change';
const DEFAULT: Currency = 'CZK';
const VALID: Currency[] = ['CZK', 'EUR', 'USD'];

export const CURRENCIES: Currency[] = VALID;

/** Přípona sloupce výnosu pro danou měnu: CZK→_czk, USD→_usd, EUR→'' (báze). */
export function curSuffix(cur: Currency): '' | '_czk' | '_usd' {
  return cur === 'CZK' ? '_czk' : cur === 'USD' ? '_usd' : '';
}

/** Symbol/label měny pro popisky. */
export const curLabel: Record<Currency, string> = { CZK: 'Kč', EUR: '€', USD: '$' };

/**
 * Vybere hodnotu výnosu za období v aktuální měně z objektu s poli
 * return_<period>(_czk|_usd). EUR = pole bez přípony. Fallback na bázi.
 */
export function pickReturn(
  obj: Record<string, unknown> | null | undefined,
  period: string,
  cur: Currency,
): number | null {
  if (!obj) return null;
  const raw = obj[`return_${period}${curSuffix(cur)}`];
  const v = raw == null ? obj[`return_${period}`] : raw; // fallback na bázi (EUR)
  return v == null || Number.isNaN(Number(v)) ? null : Number(v);
}

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
