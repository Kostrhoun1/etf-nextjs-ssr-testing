'use client';

import React, { useId, useState } from 'react';
import { Info } from 'lucide-react';

/**
 * Vysvětlivka technického pojmu. Zobrazí pojem + malé ⓘ; po najetí myší
 * (a po tapu/fokusu na mobilu) ukáže 1–2větné vysvětlení v tooltipu.
 *
 *   <InfoTip label="Roční poplatek za správu fondu.">TER</InfoTip>
 */
export default function InfoTip({
  children,
  label,
}: {
  children: React.ReactNode;
  label: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative inline-flex items-center gap-0.5 whitespace-nowrap">
      <span>{children}</span>
      <button
        type="button"
        aria-label="Vysvětlení pojmu"
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        /* p-2/-m-2: zvětší klikací plochu ze 14×14 px na ~30×30 px, aniž by se ikona
           vizuálně změnila nebo rozhodila řádek. 14px cíl se na mobilu netrefí. */
        className="inline-flex items-center justify-center align-middle p-2 -m-2 text-slate-400 hover:text-teal-700 focus:outline-none focus-visible:text-teal-700"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-1/2 bottom-full z-40 mb-1.5 max-w-[calc(100vw-2rem)] w-56 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-normal leading-relaxed text-white shadow-lg whitespace-normal break-words"
        >
          {label}
        </span>
      )}
    </span>
  );
}
