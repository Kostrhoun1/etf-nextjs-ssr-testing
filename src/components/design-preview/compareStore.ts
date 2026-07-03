'use client';

/* Sdílený stav porovnání ETF přes localStorage (nový web = samostatné stránky).
   Komponenty se přihlásí přes subscribe a reagují na změny i mezi záložkami. */

export interface CompareItem {
  isin: string;
  label: string; // ticker nebo krátký název pro chip
}

const KEY = 'dp-compare-v1';
const MAX = 4;
const EVT = 'dp-compare-change';

export const COMPARE_MAX = MAX;

export function getCompare(): CompareItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => x && typeof x.isin === 'string').slice(0, MAX) : [];
  } catch {
    return [];
  }
}

function save(list: CompareItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    /* ignore */
  }
}

export function isInCompare(isin: string): boolean {
  return getCompare().some((x) => x.isin === isin);
}

/** Přepne fond v porovnání. Vrací true, pokud je po přepnutí uvnitř. */
export function toggleCompare(isin: string, label: string): boolean {
  const cur = getCompare();
  if (cur.some((x) => x.isin === isin)) {
    save(cur.filter((x) => x.isin !== isin));
    return false;
  }
  if (cur.length >= MAX) return true;
  save([...cur, { isin, label }]);
  return true;
}

export function removeCompare(isin: string) {
  save(getCompare().filter((x) => x.isin !== isin));
}

export function clearCompare() {
  save([]);
}

/** Přihlášení k odběru změn (i mezi záložkami přes storage event). */
export function subscribeCompare(cb: () => void): () => void {
  const h = () => cb();
  window.addEventListener(EVT, h);
  const sh = (e: StorageEvent) => { if (e.key === KEY) cb(); };
  window.addEventListener('storage', sh);
  return () => {
    window.removeEventListener(EVT, h);
    window.removeEventListener('storage', sh);
  };
}
