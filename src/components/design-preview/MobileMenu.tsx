'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';

/* Mobilní navigace nového webu (hledání + hamburger).
   Zobrazuje se jen na mobilu/tabletu (md:hidden); na desktopu je klasické menu + HeaderSearch.
   POZOR: HeaderSearch je `hidden lg:block`, takže pod 1024 px je JEDINÉ hledání tohle. */
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
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Po otevření hledání rovnou kurzor do pole – na mobilu ušetří další klepnutí.
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const closeAll = () => { setOpen(false); setSearchOpen(false); };

  return (
    <div className="md:hidden flex items-center">
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
              <form action="/srovnani" onSubmit={closeAll} className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 h-12 focus-within:border-teal-400 focus-within:bg-white transition-colors">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    ref={inputRef}
                    name="q"
                    type="search"
                    enterKeyHint="search"
                    aria-label="Hledat ETF"
                    placeholder="Název, ISIN nebo ticker…"
                    className="flex-1 min-w-0 bg-transparent text-base text-slate-700 placeholder:text-slate-400 outline-none"
                  />
                  <button type="submit" className="shrink-0 rounded-md bg-teal-700 px-3 py-1.5 text-sm font-medium text-white active:bg-teal-800">
                    Hledat
                  </button>
                </div>
              </form>
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
