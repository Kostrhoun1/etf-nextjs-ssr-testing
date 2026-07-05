'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

/* Mobilní navigace nového webu (hamburger + rozbalovací panel).
   Zobrazuje se jen na mobilu (md:hidden); na desktopu je viditelné klasické menu. */
const LINKS: { href: string; label: string }[] = [
  { href: '/pruvodce', label: 'Co jsou ETF' },
  { href: '/zebricky', label: 'Žebříčky' },
  { href: '/srovnani', label: 'Srovnání' },
  { href: '/portfolio-strategie', label: 'Portfolia' },
  { href: '/kalkulacky', label: 'Kalkulačky' },
  { href: '/kde-koupit', label: 'Kde koupit' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-10 h-10 -mr-2 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <>
          {/* podklad pro zavření klepnutím mimo */}
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-14 z-40 bg-slate-900/20"
          />
          <nav className="fixed left-0 right-0 top-14 z-50 border-b border-slate-200 bg-white shadow-lg">
            <ul className="max-w-6xl mx-auto px-4 py-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-[15px] font-medium text-slate-700 border-b border-slate-100 last:border-0 hover:text-teal-700"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 pb-1">
                <Link
                  href="/srovnani"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-teal-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-teal-800"
                >
                  Otevřít srovnávač
                </Link>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
