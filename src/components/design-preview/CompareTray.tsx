'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Scale, X, ArrowRight } from 'lucide-react';
import { getCompare, subscribeCompare, removeCompare, clearCompare, type CompareItem } from '@/components/design-preview/compareStore';

/* Plovoucí lišta porovnání – drží se napříč stránkami (localStorage). */
export default function CompareTray() {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setItems(getCompare());
    sync();
    setReady(true);
    return subscribeCompare(sync);
  }, []);

  if (!ready || items.length === 0) return null;

  const href = `/design-preview/srovnani/porovnani?isins=${items.map((i) => i.isin).join(',')}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 pointer-events-none">
      <div className="pointer-events-auto max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white/95 backdrop-blur shadow-lg shadow-slate-900/10 px-3 py-2.5 flex items-center gap-3">
        <span className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Scale className="w-4 h-4" /></span>
        <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto">
          {items.map((it) => (
            <span key={it.isin} className="inline-flex items-center gap-1 shrink-0 rounded-full bg-slate-100 pl-2.5 pr-1 py-1 text-xs font-medium text-slate-700">
              {it.label}
              <button type="button" aria-label={`Odebrat ${it.label}`} onClick={() => removeCompare(it.isin)} className="flex items-center justify-center w-4 h-4 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <button type="button" onClick={() => clearCompare()} className="hidden sm:inline text-xs text-slate-400 hover:text-slate-600 shrink-0">Vymazat</button>
        {items.length >= 2 ? (
          <Link href={href} className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 shrink-0">
            Porovnat ({items.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="text-xs text-slate-400 shrink-0 px-2">Přidejte další fond</span>
        )}
      </div>
    </div>
  );
}
