'use client';

import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

/**
 * Vysvětlivky pojmů – JEDNO řešení pro celý web (InfoTip v textu i HeadTip v hlavičce srovnávače).
 *
 * Revize kola 4 (18. 10. 2026): bublina `absolute left-1/2 -translate-x-1/2` přetékala na mobilu
 * mimo obrazovku (left −39 až −60 px). Teď je bublina `position: fixed` v portálu do <body>
 * (neořízne ji overflow tabulky ani transformace předka) a její poloha se počítá v JS
 * z getBoundingClientRect ikony a šířky okna: vždy aspoň 8 px od okraje, nad ikonou, a když
 * nahoře není místo, pod ní. Šířka max. min(16rem, 100vw − 16 px), text se zalamuje.
 *
 * Ovládání: myš (najetí), klávesnice (fokus, Escape zavře), dotyk (klepnutí otevře, druhé
 * klepnutí nebo klepnutí mimo zavře). Safari na iOS tlačítka po klepnutí nefokusuje → zavírání
 * klepnutím mimo hlídá pointerdown na dokumentu, ne jen blur.
 */

const OKRAJ = 8; // px od okraje okna
const MEZERA = 6; // px mezi ikonou a bublinou

type Zdroj = 'hover' | 'focus' | 'click';

export function TipTlacitko({
  obsah,
  ariaLabel = 'Vysvětlení pojmu',
  maly = false,
  className = '',
}: {
  obsah: React.ReactNode;
  ariaLabel?: string;
  /** Menší ikona (hlavičky tabulek). */
  maly?: boolean;
  className?: string;
}) {
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);
  const bub = useRef<HTMLSpanElement>(null);
  const [zdroj, setZdroj] = useState<Zdroj | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const otevrenoV = useRef(0);
  const open = zdroj != null;

  const otevri = (z: Zdroj) => {
    if (!open) otevrenoV.current = Date.now();
    setZdroj(z);
  };
  const zavri = useCallback(() => { setZdroj(null); setPos(null); }, []);

  const umisti = useCallback(() => {
    const b = btn.current, t = bub.current;
    if (!b || !t) return;
    const r = b.getBoundingClientRect();
    const vw = document.documentElement.clientWidth || window.innerWidth;
    const w = t.offsetWidth, h = t.offsetHeight;
    const left = Math.max(OKRAJ, Math.min(r.left + r.width / 2 - w / 2, vw - w - OKRAJ));
    const nahore = r.top - MEZERA - h;
    const top = nahore >= OKRAJ ? nahore : r.bottom + MEZERA;
    setPos({ left: Math.round(left), top: Math.round(top) });
  }, []);

  // Změřit až po vykreslení (šířka závisí na textu) – před prvním nakreslením, žádné probliknutí.
  useLayoutEffect(() => { if (open) umisti(); }, [open, umisti]);

  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const prepocti = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(umisti); };
    const mimo = (e: PointerEvent) => {
      const c = e.target as Node;
      if (btn.current?.contains(c) || bub.current?.contains(c)) return;
      zavri();
    };
    const klavesa = (e: KeyboardEvent) => { if (e.key === 'Escape') zavri(); };
    window.addEventListener('scroll', prepocti, true);
    window.addEventListener('resize', prepocti);
    document.addEventListener('pointerdown', mimo);
    document.addEventListener('keydown', klavesa);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', prepocti, true);
      window.removeEventListener('resize', prepocti);
      document.removeEventListener('pointerdown', mimo);
      document.removeEventListener('keydown', klavesa);
    };
  }, [open, umisti, zavri]);

  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-label={ariaLabel}
        aria-describedby={open ? id : undefined}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') otevri(zdroj ?? 'hover'); }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse' && zdroj === 'hover') zavri(); }}
        onFocus={() => otevri(zdroj ?? 'focus')}
        onBlur={zavri}
        onClick={(e) => {
          e.stopPropagation(); // v hlavičce tabulky / v odkazu nesmí klik řadit ani navigovat
          e.preventDefault();
          // Dotyk: focus otevře a hned přijde click – ten tooltip nezavírá (otevřeno před < 400 ms).
          if (!open) otevri('click');
          else if (zdroj === 'hover' || (zdroj === 'focus' && Date.now() - otevrenoV.current < 400)) setZdroj('click');
          else zavri();
        }}
        className={`inline-flex items-center justify-center align-middle rounded text-slate-400 hover:text-teal-700 focus:outline-none focus-visible:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500/40 ${maly ? 'p-1.5 -m-1' : 'p-2 -m-2'} ${className}`}
      >
        <Info className={maly ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />
      </button>
      {open && typeof document !== 'undefined' && createPortal(
        <span
          ref={bub}
          id={id}
          role="tooltip"
          style={{
            position: 'fixed',
            left: pos?.left ?? 0,
            top: pos?.top ?? 0,
            visibility: pos ? 'visible' : 'hidden',
            width: 'max-content',
            maxWidth: `min(16rem, calc(100vw - ${2 * OKRAJ}px))`,
          }}
          className="z-[60] block rounded-lg bg-slate-900 px-3 py-2 text-left text-xs font-normal normal-case tracking-normal leading-relaxed text-white shadow-lg whitespace-normal break-words pointer-events-none"
        >
          {obsah}
        </span>,
        document.body,
      )}
    </>
  );
}

/**
 * Vysvětlivka technického pojmu. Zobrazí pojem + malé ⓘ; po najetí myší, fokusu nebo klepnutí
 * ukáže 1–2větné vysvětlení.
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
  return (
    <span className="inline-flex items-center gap-0.5 whitespace-nowrap">
      <span>{children}</span>
      <TipTlacitko obsah={label} />
    </span>
  );
}
