'use client';

import { useEffect, useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { isInCompare, toggleCompare, subscribeCompare, getCompare, COMPARE_MAX } from '@/components/design-preview/compareStore';

/* Přidat/odebrat fond z porovnání. Varianta „button" (velké) nebo „chip" (kompaktní do řádku/karty). */
export default function CompareButton({ isin, label, variant = 'button' }: { isin: string; label: string; variant?: 'button' | 'chip' | 'hero' }) {
  const [inList, setInList] = useState(false);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const sync = () => { setInList(isInCompare(isin)); setFull(getCompare().length >= COMPARE_MAX); };
    sync();
    return subscribeCompare(sync);
  }, [isin]);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(isin, label);
  };

  const disabled = full && !inList;

  if (variant === 'chip') {
    return (
      <button
        type="button" onClick={onClick} disabled={disabled}
        aria-label={inList ? 'Odebrat z porovnání' : 'Přidat do porovnání'}
        title={disabled ? `Maximum ${COMPARE_MAX} fondů` : inList ? 'V porovnání' : 'Přidat do porovnání'}
        className={`flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-lg border shrink-0 transition-colors disabled:opacity-40 ${
          inList ? 'border-teal-300 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-400 hover:border-teal-300 hover:text-teal-700'
        }`}
      >
        {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    );
  }

  if (variant === 'hero') {
    return (
      <button
        type="button" onClick={onClick} disabled={disabled}
        className={`w-full flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 ${
          inList ? 'border-teal-400/40 bg-teal-500/20 text-teal-100' : 'border-white/20 text-white hover:bg-white/10'
        }`}
      >
        {inList ? <><Check className="w-4 h-4" /> V porovnání</> : <><Plus className="w-4 h-4" /> {disabled ? `Max. ${COMPARE_MAX} fondy` : 'Do porovnání'}</>}
      </button>
    );
  }

  return (
    <button
      type="button" onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 ${
        inList ? 'border-teal-300 bg-teal-50 text-teal-700' : 'border-slate-300 text-slate-700 hover:border-teal-300 hover:text-teal-700'
      }`}
    >
      {inList ? <><Check className="w-4 h-4" /> V porovnání</> : <><Plus className="w-4 h-4" /> {disabled ? `Max. ${COMPARE_MAX} fondy` : 'Do porovnání'}</>}
    </button>
  );
}
