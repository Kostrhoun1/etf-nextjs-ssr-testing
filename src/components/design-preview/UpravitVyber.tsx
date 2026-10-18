'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Pencil } from 'lucide-react';
import FondHledani from '@/components/design-preview/FondHledani';
import { setCompare } from '@/components/design-preview/compareStore';
import { COMPARE_MAX } from '@/components/design-preview/compareLimit';
import { BARVY_FONDU } from '@/components/design-preview/PorovnaniGraf';

/* „Upravit výběr“ přímo na stránce porovnání (revize 18. 10. 2026): odebrat fond křížkem, přidat
   hledáním – bez návratu do srovnávače. Výběr se zapíše i do lišty porovnání (localStorage),
   ať po návratu do srovnávače sedí s tím, co uživatel vidí tady. */
export default function UpravitVyber({ fondy }: { fondy: { isin: string; label: string }[] }) {
  const router = useRouter();
  const [hledani, setHledani] = useState(false);
  const [pending, setPending] = useState(false);

  const prejdi = (list: { isin: string; label: string }[]) => {
    setCompare(list);
    setPending(true);
    router.push(`/srovnani/porovnani?isins=${list.map((f) => f.isin).join(',')}`);
  };
  const plno = fondy.length >= COMPARE_MAX;

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-3 ${pending ? 'opacity-60' : ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500"><Pencil className="w-3.5 h-3.5" /> Výběr:</span>
        {fondy.map((f, i) => (
          <span key={f.isin} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 pl-2.5 pr-1 py-1 text-sm font-medium text-slate-800">
            <span aria-hidden="true" className="inline-block w-2.5 h-2.5 rounded-[3px]" style={{ background: BARVY_FONDU[i] }} />
            {f.label}
            <button
              type="button"
              disabled={fondy.length <= 2 || pending}
              title={fondy.length <= 2 ? 'Porovnání potřebuje aspoň 2 fondy' : `Odebrat ${f.label}`}
              aria-label={`Odebrat ${f.label} z porovnání`}
              onClick={() => prejdi(fondy.filter((x) => x.isin !== f.isin))}
              className="flex items-center justify-center w-6 h-6 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        {!plno && (
          <button type="button" onClick={() => setHledani((o) => !o)} aria-expanded={hledani}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-3 py-1 text-sm font-medium text-slate-600 hover:border-teal-500 hover:text-teal-700">
            <Plus className="w-3.5 h-3.5" /> Přidat fond
          </button>
        )}
        {plno && <span className="text-xs text-slate-500">Nejvýš {COMPARE_MAX} fondy – pro další nejdřív některý odeberte.</span>}
      </div>
      {hledani && !plno && (
        <div className="mt-3 max-w-xl">
          <FondHledani autoFocus vybrane={fondy.map((f) => f.isin)} onPick={(f) => { setHledani(false); prejdi([...fondy, { isin: f.isin, label: f.label }]); }} />
        </div>
      )}
    </div>
  );
}
