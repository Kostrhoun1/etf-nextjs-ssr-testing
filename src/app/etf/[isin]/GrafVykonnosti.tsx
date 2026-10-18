'use client';

import { useState } from 'react';
import VyvojGraf from './VyvojGraf';
import type { VyvojIndexu } from './vyvojIndexu';
import EtfCalendarReturns, { type CalCol } from '@/components/design-preview/EtfCalendarReturns';

/* Jedna karta grafu v sekci Výkonnost – STEJNÁ kostra pro všechny fondy (revize kola 2, 18. 10. 2026:
   SXR8 měl čáru vlevo a sloupce pod ní, VWCE sloupce vlevo a nic pod nimi). Liší se jen obsah:
   - fond přesně na index z manifestu → záložky „Vývoj 10 000 Kč“ (čára) | „Po letech“ (sloupce),
   - ostatní → jen „Po letech“.
   Sloupce jsou skutečné výnosy fondu, čára je index (to říká podnadpis grafu). */

export default function GrafVykonnosti({
  vyvoj,
  podnadpis,
  zdroj,
  rozdilPoznamka,
  cols,
}: {
  vyvoj: VyvojIndexu | null;
  podnadpis: string;
  zdroj: string;
  rozdilPoznamka?: string;
  cols: CalCol[];
}) {
  const maRoky = cols.length > 0;
  const [tab, setTab] = useState<'vyvoj' | 'roky'>(vyvoj ? 'vyvoj' : 'roky');
  const zalozky = [
    ...(vyvoj ? [{ k: 'vyvoj' as const, label: 'Vývoj 10 000 Kč' }] : []),
    ...(maRoky ? [{ k: 'roky' as const, label: 'Po letech' }] : []),
  ];

  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white p-4 md:p-6">
      <div className="mb-4 flex items-center gap-1 border-b border-slate-100" role="tablist" aria-label="Typ grafu">
        {zalozky.length > 1 ? zalozky.map((z) => (
          <button key={z.k} type="button" role="tab" aria-selected={tab === z.k} onClick={() => setTab(z.k)}
            className={`-mb-px border-b-2 px-1 pb-2 mr-4 text-sm font-semibold transition-colors ${tab === z.k ? 'border-teal-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}>
            {z.label}
          </button>
        )) : (
          <p className="-mb-px border-b-2 border-teal-600 px-1 pb-2 text-sm font-semibold text-slate-900">{zalozky[0]?.label ?? 'Výnos'}</p>
        )}
      </div>
      {tab === 'vyvoj' && vyvoj ? (
        <VyvojGraf body={vyvoj.body} konec={vyvoj.konec} mesicni={vyvoj.mesicni} podnadpis={podnadpis} zdroj={zdroj} rozdilPoznamka={rozdilPoznamka} />
      ) : maRoky ? (
        <EtfCalendarReturns cols={cols} />
      ) : (
        <p className="py-8 text-center text-sm text-slate-500">Historii výnosů tohoto fondu zatím nemáme.</p>
      )}
    </div>
  );
}
