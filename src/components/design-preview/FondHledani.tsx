'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Loader2, Plus, Check } from 'lucide-react';
import { platnyTicker } from '@/lib/ticker';
import EmitentLogo from '@/components/home/EmitentLogo';

/* Hledání fondu pro ÚPRAVU VÝBĚRU k porovnání (lišta porovnání + stránka porovnání, revize
   18. 10. 2026: „chybí cesta, jak do porovnání přidat fond, aniž bych se vracel do srovnávače“).
   Stejné API a stejná relevance jako našeptávač v hlavičce (/api/etf/search → skoreHledani),
   takže „sp500“ najde CSPX/SXR8 nahoře. */

export interface NalezenyFond { isin: string; label: string; name: string }

interface Vysledek { isin: string; name: string; primary_ticker?: string | null }

export default function FondHledani({
  vybrane,
  onPick,
  plno = false,
  autoFocus = false,
}: {
  /** ISINy, které už ve výběru jsou (ukážou „Vybráno“). */
  vybrane: string[];
  onPick: (f: NalezenyFond) => void;
  /** Výběr je plný – přidat nejde. */
  plno?: boolean;
  autoFocus?: boolean;
}) {
  const [q, setQ] = useState('');
  const [vysledky, setVysledky] = useState<Vysledek[]>([]);
  const [nacitam, setNacitam] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (autoFocus) inputRef.current?.focus(); }, [autoFocus]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) { setVysledky([]); setNacitam(false); return; }
    setNacitam(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/etf/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        const d = r.ok ? await r.json() : { results: [] };
        setVysledky((d.results ?? []).slice(0, 6));
      } catch { /* abort / síť */ } finally { setNacitam(false); }
    }, 200);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q]);

  const vyber = (v: Vysledek) => {
    if (vybrane.includes(v.isin) || plno) return;
    onPick({ isin: v.isin, label: platnyTicker(v.primary_ticker) ?? v.name.slice(0, 10), name: v.name });
    setQ('');
    setVysledky([]);
  };

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && vysledky[0]) { e.preventDefault(); vyber(vysledky[0]); } }}
          placeholder={plno ? 'Výběr je plný (max. 4 fondy)' : 'Ticker, ISIN nebo název (např. VWCE, sp500)'}
          disabled={plno}
          aria-label="Najít fond a přidat ho do porovnání"
          className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none disabled:bg-slate-50"
        />
        {nacitam && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-teal-600" aria-hidden="true" />}
      </div>
      {vysledky.length > 0 && (
        <ul className="mt-1.5 max-h-72 overflow-y-auto rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
          {vysledky.map((v) => {
            const uz = vybrane.includes(v.isin);
            return (
              <li key={v.isin}>
                <button
                  type="button"
                  onClick={() => vyber(v)}
                  disabled={uz}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 disabled:cursor-default"
                >
                  <EmitentLogo nazev={v.name} size={24} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-800">{v.name}</span>
                    <span className="block text-xs text-slate-500">{platnyTicker(v.primary_ticker) ?? v.isin}</span>
                  </span>
                  {uz
                    ? <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-700"><Check className="w-3.5 h-3.5" /> Vybráno</span>
                    : <span className="inline-flex items-center gap-1 rounded-md border border-teal-600 px-2 py-1 text-xs font-medium text-teal-700"><Plus className="w-3.5 h-3.5" /> Přidat</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {q.trim().length >= 2 && !nacitam && vysledky.length === 0 && (
        <p className="mt-1.5 px-1 text-xs text-slate-500">Nic jsme nenašli – zkuste ticker nebo ISIN.</p>
      )}
    </div>
  );
}
