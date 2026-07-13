'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Loader2, ArrowRight } from 'lucide-react';

/* Živý našeptávač ETF v hero sekci na homepage – při psaní názvu, ISIN nebo
   tickeru rovnou nabízí fondy; klik/Enter otevře detail, „Zobrazit vše" pošle
   dotaz do srovnávače. Ovládání i klávesnicí (šipky, Enter, Esc). */

interface Result {
  isin: string;
  name: string;
  primary_ticker?: string | null;
  fund_provider?: string | null;
}

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1); // -1 = žádná položka (Enter → srovnávač)
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // Debounced fetch.
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/etf/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        const data = res.ok ? await res.json() : { results: [] };
        setResults(data.results ?? []);
        setOpen(true);
        setActive(-1);
      } catch {
        /* abort nebo síť – ignoruj */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [query]);

  const goToScreener = useCallback(() => {
    const term = query.trim();
    if (!term) return;
    setOpen(false);
    router.push(`/srovnani?q=${encodeURIComponent(term)}`);
  }, [query, router]);

  const goToEtf = useCallback((isin: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/etf/${isin}`);
  }, [router]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length) { setOpen(true); setActive((i) => (i + 1) % results.length); }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length) setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && active >= 0 && results[active]) goToEtf(results[active].isin);
      else goToScreener();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className="relative mt-6 md:mt-1 md:w-80 shrink-0">
      <label className="hidden sm:block text-xs font-medium text-slate-400 mb-1.5">Hledáte konkrétní fond?</label>
      <div className="flex items-center gap-2 rounded-lg bg-white px-3 h-11">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-label="Hledat ETF podle názvu, ISIN nebo tickeru"
          placeholder="Název, ISIN nebo ticker…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => { if (results.length) setOpen(true); }}
          className="flex-1 min-w-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
        />
        {loading && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0" />}
      </div>

      {open && (results.length > 0 || (query.trim().length >= 2 && !loading)) && (
        <div className="absolute left-0 top-full mt-1.5 w-full min-w-[20rem] rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden z-50">
          {results.length > 0 ? (
            <ul className="max-h-[60vh] overflow-y-auto py-1">
              {results.map((r, i) => (
                <li key={r.isin}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goToEtf(r.isin)}
                    className={`w-full px-3.5 py-2.5 text-left flex items-center gap-3 transition-colors ${active === i ? 'bg-teal-50' : 'hover:bg-slate-50'}`}
                  >
                    <span className="inline-flex items-center justify-center min-w-14 shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 tabular-nums">
                      {r.primary_ticker || r.isin.slice(0, 5)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-900 truncate">{r.name}</span>
                      <span className="block text-xs text-slate-500 truncate">
                        {r.fund_provider ? `${r.fund_provider} · ` : ''}{r.isin}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3.5 py-3 text-sm text-slate-500">Žádný fond neodpovídá „{query.trim()}".</div>
          )}
          <button
            type="button"
            onClick={goToScreener}
            className="w-full flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-teal-700 hover:bg-slate-100 transition-colors"
          >
            Zobrazit všechny výsledky ve srovnávači
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="mt-2.5 hidden sm:flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400">Hledané:</span>
        <Link href="/nejlepsi-etf/nejlepsi-celosvetove-etf" className="rounded-full bg-white/10 px-2.5 py-1 hover:bg-white/20">MSCI World</Link>
        <Link href="/nejlepsi-etf/nejlepsi-sp500-etf" className="rounded-full bg-white/10 px-2.5 py-1 hover:bg-white/20">S&P 500</Link>
        <Link href="/nejlepsi-etf/nejlepsi-dividendove-etf" className="rounded-full bg-white/10 px-2.5 py-1 hover:bg-white/20">Dividendové</Link>
      </div>
    </div>
  );
}
