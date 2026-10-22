'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import { NAV_LINKS } from '@/components/design-preview/SiteNav';
import HeaderSearch from '@/components/design-preview/HeaderSearch';

/* Mobilní navigace nového webu (hledání + hamburger).
   Zobrazuje se pod 1024 px (lg:hidden) – stejně jako HeaderSearch od lg; na desktopu je SiteNav + HeaderSearch.
   POZOR: HeaderSearch je `hidden lg:block`, takže pod 1024 px je JEDINÉ hledání tohle – proto tu je TÁŽ komponenta
   ve variantě „mobil“ (s našeptávačem). Hlídá scripts/prod-smoke.mjs (mobilní hledání, Chromium + WebKit). */
// Odkazy jsou sdílené s desktopovou navigací (SiteNav.tsx).
const LINKS = NAV_LINKS;

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeAll = () => { setOpen(false); setSearchOpen(false); };

  return (
    <div className="lg:hidden flex items-center">
      {/* Hledání jako VLASTNÍ tlačítko v hlavičce – dřív bylo schované až v hamburgeru,
          takže ho na mobilu nikdo nenašel. */}
      <button
        type="button"
        aria-label={searchOpen ? 'Zavřít hledání' : 'Hledat ETF'}
        aria-expanded={searchOpen}
        onClick={() => { setSearchOpen((v) => !v); setOpen(false); }}
        className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200"
      >
        {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
      </button>

      <button
        type="button"
        aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
        aria-expanded={open}
        onClick={() => { setOpen((v) => !v); setSearchOpen(false); }}
        className="flex items-center justify-center w-10 h-10 -mr-2 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {(open || searchOpen) && (
        <>
          {/* podklad pro zavření klepnutím mimo */}
          <button
            aria-hidden
            tabIndex={-1}
            onClick={closeAll}
            className="fixed inset-0 top-14 z-40 bg-slate-900/20"
          />

          {searchOpen && (
            <div className="fixed left-0 right-0 top-14 z-50 border-b border-slate-200 bg-white shadow-lg">
              <div className="max-w-6xl mx-auto px-4 py-3">
                <HeaderSearch varianta="mobil" onHotovo={closeAll} />
              </div>
            </div>
          )}

          {open && (
            <nav className="fixed left-0 right-0 top-14 z-50 border-b border-slate-200 bg-white shadow-lg">
              <ul className="max-w-6xl mx-auto px-4 py-2">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={closeAll}
                      className="block py-3 text-[15px] font-medium text-slate-700 border-b border-slate-100 last:border-0 hover:text-teal-700"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-2 pb-1">
                  <Link
                    href="/srovnani"
                    onClick={closeAll}
                    className="block rounded-lg bg-teal-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-teal-800"
                  >
                    Otevřít srovnávač
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
