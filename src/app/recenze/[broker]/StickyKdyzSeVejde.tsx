'use client';

/* Karta „Kolik vás X stojí“ je ~840 px vysoká. Sticky bez ohledu na výšku okna (kolo 4) znamenalo, že na
   1366×768 byl spodek karty (odkazy, datum ceníku) vidět až na konci stránky. Teď je sticky JEN tehdy, když se
   celá karta vejde pod hlavičku webu; jinak se normálně odroluje. Server vykreslí ne-sticky variantu (bez skoku). */
import { useEffect, useRef, useState, type ReactNode } from 'react';

const ODSHORA = 80; // lg:top-20
const REZERVA = 16;

export default function StickyKdyzSeVejde({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vejde, setVejde] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const zmer = () => setVejde(el.offsetHeight + ODSHORA + REZERVA <= window.innerHeight);
    zmer();
    const ro = new ResizeObserver(zmer);
    ro.observe(el);
    window.addEventListener('resize', zmer);
    return () => { ro.disconnect(); window.removeEventListener('resize', zmer); };
  }, []);
  return <div ref={ref} data-sticky={vejde ? 'ano' : 'ne'} className={vejde ? 'lg:sticky lg:top-20' : undefined}>{children}</div>;
}
