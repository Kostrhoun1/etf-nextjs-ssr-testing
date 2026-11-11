'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

/* Odkazový sloupec patičky (3.8, 11. 11. 2026). Na mobilu sbalený do řádku s tlačítkem (patička
   842 px → ~500 px), od md vždy rozbalený jako dřív. Odkazy zůstávají v HTML i sbalené (jen skryté
   třídou `hidden`) – nic se neořezává, roboti i „najít na stránce“ po rozbalení je vidí. */
export default function PatickaSloupec({ nadpis, odkazy }: { nadpis: string; odkazy: { href: string; label: string }[] }) {
  const [otevreno, setOtevreno] = useState(false);
  const id = useId();
  return (
    <nav aria-label={nadpis} className="border-b border-slate-100 md:border-0">
      <button type="button" aria-expanded={otevreno} aria-controls={id} onClick={() => setOtevreno((o) => !o)}
        className="md:hidden flex w-full min-h-[44px] items-center justify-between gap-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
        {nadpis}
        <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${otevreno ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <p className="hidden md:block text-xs font-semibold uppercase tracking-wide text-slate-500">{nadpis}</p>
      <ul id={id} className={`${otevreno ? 'grid' : 'hidden'} grid-cols-2 gap-x-4 gap-y-1 pb-3 md:block md:pb-0 md:mt-3 md:space-y-2`}>
        {odkazy.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-[36px] items-center text-sm text-slate-600 hover:text-teal-700 md:min-h-0">{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
