'use client';

import { useSyncExternalStore } from 'react';

/* Celkový počet fondů v záhlaví srovnávače. Server ho vykreslí z getScreenerRows; klient si ale celou
   databázi dotahuje z cachovaného /api/etf/screener, které se může vyrenderovat v jinou chvíli než
   stránka (revize 18. 10. 2026: záhlaví „4 974 fondů“ vs. záložka „Vše 4 981“). Po načtení dat proto
   ScreenerUI nastaví počet z TĚCH SAMÝCH dat, ze kterých počítá záložky a výsledek. */

let pocet: number | null = null;
const posluchaci = new Set<() => void>();

export function nastavPocetFondu(n: number) {
  if (n === pocet) return;
  pocet = n;
  posluchaci.forEach((f) => f());
}

export default function PocetFondu({ vychozi }: { vychozi: number }) {
  const n = useSyncExternalStore(
    (f) => { posluchaci.add(f); return () => { posluchaci.delete(f); }; },
    () => pocet,
    () => null,
  );
  return <>{(n ?? vychozi).toLocaleString('cs-CZ')}</>;
}
