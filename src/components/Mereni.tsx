'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { UdalostMereni } from '@/lib/mereni';

/* Měření chování návštěvníků BEZ COOKIES a bez ukládání čehokoli do prohlížeče (18. 10. 2026).
   - pv = náhodné ID jednoho zobrazení stránky (jen v paměti) – spojí události zobrazení, ne člověka.
   - Co se měří: zobrazení (cesta, zdroj – jen doména, typ zařízení), které sekce [data-sekce] se
     ukázaly, kliky (odkazy/tlačítka, v jaké sekci), hloubka scrollu, aktivní čas, hledání, záložky, FAQ.
   - Neměří se: IP, user-agent (server ho jen použije k vyřazení botů), text formulářů, nic osobního.
   Odesílání: dávky přes navigator.sendBeacon na /api/ev (při skrytí stránky a průběžně). */

const ENDPOINT = '/api/ev';

function nahodneId() {
  const a = new Uint8Array(6);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 12);
}
const zarizeni = (w: number) => (w < 640 ? 'mobil' : w < 1024 ? 'tablet' : 'desktop');

function zdroj(): string | null {
  try {
    if (!document.referrer) return null;
    const h = new URL(document.referrer).host.replace(/^www\./, '');
    return h === location.host.replace(/^www\./, '') ? 'interni' : h;
  } catch { return null; }
}

function cilKliku(el: Element): string {
  const track = (el as HTMLElement).dataset?.track;
  if (track) return track;
  if (el instanceof HTMLAnchorElement && el.href) {
    try {
      const u = new URL(el.href);
      return u.host === location.host ? u.pathname + (u.hash || '') : `ext:${u.host}`;
    } catch { /* níže */ }
  }
  return ((el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60)) || el.tagName.toLowerCase();
}

export default function Mereni() {
  const path = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || !('sendBeacon' in navigator)) return;
    const pv = nahodneId();
    const fronta: UdalostMereni[] = [];
    const vw = window.innerWidth;
    const zaklad = { pv, path, ref: zdroj(), device: zarizeni(vw), vw };

    const odeslat = () => {
      if (!fronta.length) return;
      const e = fronta.splice(0, fronta.length);
      try { navigator.sendBeacon(ENDPOINT, new Blob([JSON.stringify({ ...zaklad, e })], { type: 'application/json' })); } catch { /* nic */ }
    };
    const pridat = (u: UdalostMereni) => { fronta.push(u); if (fronta.length >= 25) odeslat(); };

    pridat({ t: 'zobrazeni' });
    // Zobrazení odeslat hned (i když člověk hned odejde, víme o něm).
    const t0 = window.setTimeout(odeslat, 1500);

    // Sekce, které se skutečně ukázaly (40 % plochy), každá jednou.
    const videne = new Set<string>();
    const io = new IntersectionObserver((zaznamy) => {
      for (const z of zaznamy) {
        const s = (z.target as HTMLElement).dataset.sekce;
        if (z.isIntersecting && s && !videne.has(s)) { videne.add(s); pridat({ t: 'sekce', s }); }
      }
    }, { threshold: 0.4 });
    const sledovat = () => document.querySelectorAll<HTMLElement>('[data-sekce]').forEach((el) => io.observe(el));
    sledovat();
    const t1 = window.setTimeout(sledovat, 2000); // pozdě vykreslené části

    // Kliky na odkazy, tlačítka, rozbalovačky.
    const naKlik = (ev: MouseEvent) => {
      const el = (ev.target as Element | null)?.closest('a, button, summary, [data-track]');
      if (!el) return;
      const s = (el.closest('[data-sekce]') as HTMLElement | null)?.dataset.sekce ?? null;
      if (el.tagName === 'SUMMARY') return; // FAQ řeší toggle níže (otevření, ne zavření)
      pridat({ t: 'klik', s, c: cilKliku(el) });
      if (el instanceof HTMLAnchorElement) odeslat(); // odchod ze stránky – poslat hned
    };
    document.addEventListener('click', naKlik, { capture: true });

    // FAQ: otevření otázky.
    const naToggle = (ev: Event) => {
      const d = ev.target as HTMLDetailsElement;
      if (d.tagName === 'DETAILS' && d.open) {
        const s = (d.closest('[data-sekce]') as HTMLElement | null)?.dataset.sekce ?? null;
        pridat({ t: 'faq', s, c: (d.querySelector('summary')?.textContent || '').trim().slice(0, 80) });
      }
    };
    document.addEventListener('toggle', naToggle, { capture: true });

    // Hloubka scrollu 25/50/75/100 %.
    const prahy = [25, 50, 75, 100];
    const dosazeno = new Set<number>();
    const naScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h <= 0 ? 100 : Math.round((window.scrollY / h) * 100);
      for (const x of prahy) if (p >= x && !dosazeno.has(x)) { dosazeno.add(x); pridat({ t: 'scroll', v: x }); }
    };
    window.addEventListener('scroll', naScroll, { passive: true });

    // Události z komponent (hledání, záložky): mer() v src/lib/mereni.ts.
    const naVlastni = (ev: Event) => pridat((ev as CustomEvent<UdalostMereni>).detail);
    window.addEventListener('mereni', naVlastni);

    // Aktivní čas (jen když je stránka vidět) + odeslání při skrytí/odchodu.
    let aktivni = 0;
    let od = document.visibilityState === 'visible' ? Date.now() : 0;
    let odeslanyCas = -1;
    // Stejný čas neposílat dvakrát (skrytí stránky a pagehide přijdou těsně po sobě).
    const zapsatCas = () => {
      if (od) { aktivni += Date.now() - od; od = 0; }
      const s = Math.round(aktivni / 1000);
      if (s !== odeslanyCas) { odeslanyCas = s; pridat({ t: 'cas', v: s }); }
    };
    const naViditelnost = () => {
      if (document.visibilityState === 'hidden') {
        zapsatCas();
        odeslat();
      } else { od = Date.now(); }
    };
    document.addEventListener('visibilitychange', naViditelnost);
    const naOdchod = () => { zapsatCas(); odeslat(); };
    window.addEventListener('pagehide', naOdchod);

    return () => {
      // Přechod na jinou stránku v aplikaci (Next router) = konec tohoto zobrazení.
      naOdchod();
      window.clearTimeout(t0); window.clearTimeout(t1);
      io.disconnect();
      document.removeEventListener('click', naKlik, { capture: true });
      document.removeEventListener('toggle', naToggle, { capture: true });
      window.removeEventListener('scroll', naScroll);
      window.removeEventListener('mereni', naVlastni);
      document.removeEventListener('visibilitychange', naViditelnost);
      window.removeEventListener('pagehide', naOdchod);
    };
  }, [path]);

  return null;
}
