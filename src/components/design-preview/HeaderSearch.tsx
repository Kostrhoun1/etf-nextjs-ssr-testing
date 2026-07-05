'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, ArrowRight } from 'lucide-react';

/* Živý našeptávač ETF v hlavičce – při psaní rovnou nabízí fondy (název/ISIN/ticker),
   klik nebo Enter otevře detail fondu; „Zobrazit vše" pošle dotaz do screeneru.
   Ovládání i klávesnicí (šipky, Enter, Esc). Skryté na úzkých obrazovkách. */

interface Result {
  isin: string;
  name: string;
  primary_ticker?: string | null;
  fund_provider?: string | null;
}

export default function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1); // -1 = žádná položka (Enter → screener)
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  // Zavři dropdown při kliknutí mimo.
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
    router.push(`/design-preview/srovnani?q=${encodeURIComponent(term)}`);
  }, [query, router]);

  const goToEtf = useCallback((isin: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/design-preview/etf/${isin}`);
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
    <div ref={boxRef} className="relative hidden lg:block">
      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 h-9 focus-within:border-teal-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 transition-colors">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-label="Hledat ETF podle názvu, ISIN nebo tickeru"
          placeholder="Hledat ETF…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => { if (results.length) setOpen(true); }}
          className="w-36 xl:w-52 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
        />
        {loading && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0" />}
      </div>

      {open && (results.length > 0 || (query.trim().length >= 2 && !loading)) && (
        <div className="absolute right-0 top-full mt-1.5 w-[26rem] max-w-[80vw] rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-50">
          {results.length > 0 ? (
            <ul className="max-h-[70vh] overflow-y-auto py-1">
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
    </div>
  );
}
