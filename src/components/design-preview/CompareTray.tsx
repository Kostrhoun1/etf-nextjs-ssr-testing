'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, X, ArrowRight, Plus } from 'lucide-react';
import { getCompare, subscribeCompare, removeCompare, clearCompare, toggleCompare, COMPARE_MAX, type CompareItem } from '@/components/design-preview/compareStore';
import FondHledani from '@/components/design-preview/FondHledani';

/* Plovoucí lišta porovnání – drží se napříč stránkami (localStorage).
   Revize 18. 10. 2026: po prvním přidání lišta vysvětlí, co dál („vyberte ještě aspoň 1 fond“),
   a fond jde přidat i hledáním přímo z lišty (bez návratu do srovnávače). */
export default function CompareTray() {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [ready, setReady] = useState(false);
  const [hledani, setHledani] = useState(false);
  const pathname = usePathname();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setItems(getCompare());
    sync();
    setReady(true);
    return subscribeCompare(sync);
  }, []);

  // Klik mimo zavře hledání.
  useEffect(() => {
    if (!hledani) return;
    const h = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setHledani(false); };
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setHledani(false); };
    document.addEventListener('mousedown', h);
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [hledani]);

  // Na stránce porovnání lišta jen zakrývala tabulku a nabízela „Porovnat“ toho, co už člověk vidí.
  if (!ready || items.length === 0 || pathname?.startsWith('/srovnani/porovnani')) return null;

  const href = `/srovnani/porovnani?isins=${items.map((i) => i.isin).join(',')}`;
  const plno = items.length >= COMPARE_MAX;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 pointer-events-none" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
      <div ref={boxRef} className="pointer-events-auto relative max-w-4xl mx-auto">
        {hledani && (
          <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/15">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Přidat fond do porovnání</p>
              <button type="button" onClick={() => setHledani(false)} aria-label="Zavřít hledání" className="flex items-center justify-center w-8 h-8 -mr-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <FondHledani
              autoFocus
              plno={plno}
              vybrane={items.map((i) => i.isin)}
              onPick={(f) => { toggleCompare(f.isin, f.label); if (items.length + 1 >= COMPARE_MAX) setHledani(false); }}
            />
          </div>
        )}
        <div className="rounded-2xl border border-slate-200 bg-white/95 backdrop-blur shadow-lg shadow-slate-900/10 px-3 py-2.5 flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Scale className="w-4 h-4" /></span>
          <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto">
            {items.map((it) => (
              <span key={it.isin} className="inline-flex items-center gap-1 shrink-0 rounded-full bg-slate-100 pl-2.5 pr-1 py-1 text-xs font-medium text-slate-700">
                {it.label}
                <button type="button" aria-label={`Odebrat ${it.label}`} onClick={() => removeCompare(it.isin)} className="flex items-center justify-center w-5 h-5 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {!plno && (
              <button type="button" onClick={() => setHledani((o) => !o)} aria-expanded={hledani} className="inline-flex items-center gap-1 shrink-0 rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-teal-500 hover:text-teal-700">
                <Plus className="w-3 h-3" /> Přidat
              </button>
            )}
            {items.length === 1 && (
              <span className="hidden sm:inline shrink-0 pl-1 text-xs text-slate-500">Vyberte ještě aspoň 1 fond (nejvýš {COMPARE_MAX}).</span>
            )}
          </div>
          <button type="button" onClick={() => clearCompare()} className="hidden sm:inline text-xs text-slate-400 hover:text-slate-600 shrink-0">Vymazat</button>
          {items.length >= 2 ? (
            <Link href={href} className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 shrink-0">
              Porovnat ({items.length}) <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500 shrink-0 sm:hidden">vyberte ještě 1</span>
          )}
        </div>
      </div>
    </div>
  );
}
