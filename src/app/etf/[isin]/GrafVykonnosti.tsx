'use client';

import EtfCalendarReturns, { type CalCol } from '@/components/design-preview/EtfCalendarReturns';

/* Karta grafu v sekci Výkonnost – STEJNÁ pro všechny fondy (kolo 3, 18. 10. 2026).
   Rozhodnutí majitele 18. 10. 2026: na detailu fondu jen VLASTNÍ data fondu – kalendářní výnosy fondu
   (sloupce, přepínač měny v hlavičce sekce). Čárový graf podle indexu/proxy fondu (SPY u SXR8) zrušen:
   „je divné ukazovat graf indexu, a ne daného ETF“. Časovou řadu cen fondu zatím nemáme
   (ZAMERNA-ROZHODNUTI.md); delší historie indexu patří do backtestu, kde je proxy popsaná. */
// Kolo 6: prázdný stav nesmí znít jako naše chyba („Historii výnosů zatím nemáme“) – text dodá stránka podle data vzniku.
export default function GrafVykonnosti({ cols, prazdno }: { cols: CalCol[]; prazdno: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">Výnos po jednotlivých letech</h3>
      {cols.length > 0 ? (
        <EtfCalendarReturns cols={cols} />
      ) : (
        <p className="py-8 text-center text-sm text-slate-500">{prazdno}</p>
      )}
    </div>
  );
}
