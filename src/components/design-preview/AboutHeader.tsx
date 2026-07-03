'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Menu, X } from 'lucide-react';

const NAV = [
  { href: '/co-jsou-etf', label: 'Co jsou ETF' },
  { href: '/nejlepsi-etf', label: 'Žebříčky' },
  { href: '/srovnani-etf', label: 'Srovnání' },
  { href: '/portfolio-strategie', label: 'Portfolia' },
  { href: '/kalkulacky', label: 'Kalkulačky' },
  { href: '/kde-koupit-etf', label: 'Kde koupit' },
];

/** Sdílená hlavička (vzor homepage) s mobilním hamburgerem. */
export default function AboutHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white">
            <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
          </span>
          ETF průvodce
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-slate-900">{n.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/srovnani-etf" className="hidden sm:inline-flex rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Srovnávač</Link>
          <button
            type="button"
            aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-slate-700 hover:text-teal-700"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/srovnani-etf"
              onClick={() => setOpen(false)}
              className="mt-2 mb-1 inline-flex justify-center rounded-lg bg-teal-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              Srovnávač ETF
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
