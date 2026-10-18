'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import type { RadekTrhu, FondTrhu } from '@/lib/trhy';

/* Tři pohledy na fondy podle trhu (homepage, 18. 10. 2026): nejlevnější / největší / nejvýkonnější.
   Všechny panely jsou ve HTML (server), JS jen přepíná záložky (WAI-ARIA tabs, šipky).
   Revize (art director + test s uživateli): krátké záložky, stejné pořadí trhů ve všech pohledech,
   hlavní číslo = údaj o vítězném fondu (ne „medián“), žádné odstavce pod tabulkou.
   Odkaz pod tabulkou vede tam, kde data odpovídají pohledu (ne na srovnávač s chybným TER 0 %). */

type Pohled = 'ter' | 'size' | 'r1';
const POHLEDY: { id: Pohled; label: string; sloupec: string; dalsi: { href: string; text: string } }[] = [
  { id: 'ter', label: 'Nejlevnější', sloupec: 'Poplatek (TER)', dalsi: { href: '/nejlepsi-etf/nejlevnejsi-etf', text: 'Žebříček nejlevnějších ETF' } },
  { id: 'size', label: 'Největší', sloupec: 'Velikost fondu', dalsi: { href: '/srovnani?sort=size&smer=desc', text: 'Všechny fondy podle velikosti' } },
  { id: 'r1', label: 'Nejvýkonnější', sloupec: 'Výnos 12 měs. v Kč', dalsi: { href: '/srovnani?kat=Akcie&sort=r1&smer=desc', text: 'Všechny fondy podle výkonu' } },
];

const cz = (v: number, d = 1) => v.toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d });
/** Výnos se znaménkem (− je skutečné minus, ne pomlčka – čtečky i barvoslepí). */
const pct = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : v < 0 ? '−' : ''}${cz(Math.abs(v))} %`);
const terF = (v: number | null) => (v == null ? '—' : `${cz(v, 2)} %`);
const mld = (v: number | null) => (v == null ? '—' : v >= 1000 ? `${cz(v / 1000)} mld €` : `${Math.round(v)} mil €`);

function Fond({ f }: { f: FondTrhu | null }) {
  if (!f) return <span className="text-slate-500">—</span>;
  return (
    <Link href={`/etf/${f.isin}`} className="group/f min-w-0 min-h-6 flex flex-col py-0.5">
      <span className="text-[15px] font-medium leading-snug text-slate-900 group-hover/f:text-teal-800 group-hover/f:underline underline-offset-2 md:truncate">{f.nazev}</span>
      {f.ticker && <span className="text-xs text-slate-500">{f.ticker}</span>}
    </Link>
  );
}

export default function TriPohledyTrhu({ radky }: { radky: RadekTrhu[] }) {
  const [pohled, setPohled] = useState<Pohled>('ter');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const aktivni = POHLEDY.find((p) => p.id === pohled)!;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = POHLEDY.length;
    const j = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (j < 0) return;
    e.preventDefault();
    setPohled(POHLEDY[j].id);
    tabs.current[j]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Pohled na fondy" className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 sm:inline-grid sm:min-w-[26rem]">
        {POHLEDY.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => { tabs.current[i] = el; }}
            role="tab"
            id={`tab-${p.id}`}
            aria-selected={pohled === p.id}
            aria-controls={`panel-${p.id}`}
            tabIndex={pohled === p.id ? 0 : -1}
            onClick={() => setPohled(p.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`min-h-11 rounded-lg px-3 text-sm font-semibold transition-colors ${pohled === p.id ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {POHLEDY.map((p) => (
        <div key={p.id} role="tabpanel" id={`panel-${p.id}`} aria-labelledby={`tab-${p.id}`} hidden={pohled !== p.id} className="mt-3">
          <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
            <li className="hidden md:grid md:grid-cols-[13rem_minmax(0,1fr)_10rem_8rem] gap-6 px-5 py-3 text-xs font-medium text-slate-500">
              <span>Trh</span>
              <span>{p.id === 'ter' ? 'Nejlevnější fond' : p.id === 'size' ? 'Největší fond' : 'Nejvýkonnější fond'}</span>
              <span className="text-right">
                {p.id === 'ter'
                  ? <InfoTip label="TER = roční poplatek fondu, strhává se z jeho hodnoty. Syntetické (swapové) fondy mohou mít navíc swap poplatek – detail u fondu.">{p.sloupec}</InfoTip>
                  : p.sloupec}
              </span>
              <span className="text-right">{p.id === 'size' ? 'Poplatek (TER)' : 'Velikost'}</span>
            </li>
            {radky.map((r) => {
              const f = p.id === 'ter' ? r.nejlevnejsi : p.id === 'size' ? r.nejvetsi : r.nejvykonnejsi;
              const hlavni = p.id === 'ter' ? terF(f?.ter ?? null) : p.id === 'size' ? mld(f?.velikost ?? null) : pct(f?.r1 ?? null);
              const vedlejsi = p.id === 'size' ? terF(f?.ter ?? null) : mld(f?.velikost ?? null);
              const barva = p.id === 'r1' && f?.r1 != null ? (f.r1 >= 0 ? 'text-emerald-700' : 'text-red-700') : 'text-slate-900';
              return (
                <li key={r.trh.id} className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[13rem_minmax(0,1fr)_10rem_8rem] gap-x-6 gap-y-1 px-4 md:px-5 py-3 items-center">
                  <Link href={r.trh.href} className="min-w-0 min-h-6 inline-flex flex-col py-0.5 hover:text-teal-800">
                    <span className="text-[15px] font-semibold text-slate-900 hover:underline underline-offset-2">{r.trh.label}</span>
                    <span className="hidden md:block text-xs text-slate-500">{r.trh.index}</span>
                  </Link>
                  <span className="order-3 md:order-none col-span-2 md:col-span-1 min-w-0"><Fond f={f} /></span>
                  <span className={`order-2 md:order-none text-right text-base font-semibold tabular-nums ${barva}`}>
                    {hlavni}
                    {p.id === 'ter' && r.stejnyTer > 0 && (
                      <Link href={r.trh.href} className="block text-xs font-normal text-teal-700 hover:underline">+{r.stejnyTer} za stejný poplatek</Link>
                    )}
                  </span>
                  <span className="hidden md:block text-right text-sm tabular-nums text-slate-600">{vedlejsi}</span>
                </li>
              );
            })}
          </ul>
          {p.id === 'r1' && radky.some((r) => r.odlehle.length > 0) && (
            // Pravidlo č. 1: vyřazení přiznat stručně (podrobnosti a upozornění na detailu fondu).
            <p className="mt-2 text-xs text-slate-500">Fondy s neověřeným výnosem v přehledu neukazujeme.</p>
          )}
        </div>
      ))}

      <Link href={aktivni.dalsi.href} className="mt-2 inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-teal-700 hover:text-teal-800">
        {aktivni.dalsi.text} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
