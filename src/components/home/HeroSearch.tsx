'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader2, ArrowRight, ListOrdered } from 'lucide-react';
import EmitentLogo from '@/components/home/EmitentLogo';
import { jeDotazZacatecnika } from '@/lib/hledaniCz';
import { mer } from '@/lib/mereni';

/* Živý našeptávač ETF v hero sekci na homepage – při psaní názvu, ISIN nebo
   tickeru rovnou nabízí fondy; klik/Enter otevře detail, „Zobrazit vše" pošle
   dotaz do srovnávače. Ovládání i klávesnicí (šipky, Enter, Esc). */

interface Result {
  isin: string;
  name: string;
  primary_ticker?: string | null;
  fund_provider?: string | null;
  ter?: number | null;
  r1_czk?: number | null;
}

export default function HeroSearch({ priklady = [] }: { priklady?: string[] }) {
  // Na mobilu kratší nápověda (dlouhá se ořízla na „(na…“).
  const [placeholder, setPlaceholder] = useState('Fond nebo ticker (např. VWCE)');
  useEffect(() => {
    if (window.matchMedia('(min-width: 640px)').matches) setPlaceholder('Hledejte fond nebo ticker (např. VWCE, zlato)');
  }, []);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  // Žebříčky k dotazu (české hledání: „zlato“ → Nejlepší zlato ETF) – viz src/lib/hledaniCz.ts.
  const [kategorie, setKategorie] = useState<{ href: string; label: string; typ?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1); // -1 = žádná položka (Enter → srovnávač)
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const posledniHledani = useRef<{ q: string; n: number; k: number } | null>(null);
  const odeslaneHledani = useRef('');

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
      setKategorie([]);
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
        setKategorie(data.kategorie ?? []);
        // Měření: dotaz + počet fondů (nula = slepá ulička, kterou chceme vidět). Jen ustálený dotaz.
        posledniHledani.current = { q: term.toLowerCase().slice(0, 60), n: (data.results ?? []).length, k: (data.kategorie ?? []).length };
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

  // Hledání zaznamenat po 1,5 s klidu (ne každé písmeno).
  useEffect(() => {
    const t = window.setTimeout(() => {
      const h = posledniHledani.current;
      if (h && h.q.length >= 2 && h.q !== odeslaneHledani.current) {
        odeslaneHledani.current = h.q;
        mer('hledani', { s: 'hero', c: h.q, v: h.n, m: { kategorie: h.k } });
      }
    }, 1500);
    return () => window.clearTimeout(t);
  }, [results, kategorie]);

  const goToScreener = useCallback(() => {
    const term = query.trim();
    if (!term) return;
    setOpen(false);
    // „jaké etf koupit“ apod. (i Enter dřív, než přijde nabídka) → průvodce, ne prázdný srovnávač.
    if (results.length === 0 && jeDotazZacatecnika(term)) { router.push('/vyber-etf'); return; }
    router.push(`/srovnani?q=${encodeURIComponent(term)}`);
  }, [query, router, results.length]);

  const goToEtf = useCallback((isin: string) => {
    mer('hledani_vyber', { s: 'hero', c: isin, m: { dotaz: query.trim().toLowerCase().slice(0, 60) } });
    setOpen(false);
    setQuery('');
    router.push(`/etf/${isin}`);
  }, [router, query]);

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
      // Bez fondů, ale s nabídnutou cestou (průvodce/žebříček) → tam, ne do prázdného srovnávače.
      else if (results.length === 0 && kategorie.length > 0) { setOpen(false); router.push(kategorie[0].href); }
      else goToScreener();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    // Hlavní akce homepage (redesign 18. 10. 2026: jsme srovnávač – hledání fondu je první věc,
    // kterou návštěvník udělá; dřív úzký sloupec vpravo). Viditelné zaměření = WCAG 2.4.7.
    <div ref={boxRef} className="relative w-full max-w-2xl">
      <div className="flex items-center gap-2.5 rounded-xl bg-white px-4 h-12 md:h-14 ring-2 ring-transparent focus-within:ring-teal-400 transition-shadow">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={open && results.length > 0 ? 'hero-hledani-vysledky' : undefined}
          aria-activedescendant={open && active >= 0 && results[active] ? `hero-vysledek-${results[active].isin}` : undefined}
          aria-autocomplete="list"
          aria-label="Hledat ETF podle názvu, ISIN nebo tickeru"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => { if (results.length || kategorie.length) setOpen(true); }}
          className="flex-1 min-w-0 bg-transparent text-base text-slate-900 placeholder:text-slate-400 outline-none"
        />
        {loading && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0" />}
      </div>
      {priklady.length > 0 && (
        // Příklady dotazů – ukazují, že funguje ticker i čeština („zlato“, „dluhopisy“).
        <p className="mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-1.5 text-xs text-slate-400">
          <span>Zkuste:</span>
          {priklady.map((p) => (
            <button key={p} type="button" onClick={() => { setQuery(p); inputRef.current?.focus(); }}
              className="rounded-full bg-white/10 px-2.5 py-1 min-h-7 font-medium text-slate-200 hover:bg-white/20 transition-colors">{p}</button>
          ))}
        </p>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {open && !loading && query.trim().length >= 2 ? `${results.length} ${results.length === 1 ? 'fond' : results.length >= 2 && results.length <= 4 ? 'fondy' : 'fondů'}${kategorie.length ? `, ${kategorie.length} ${kategorie.length === 1 ? 'tip' : 'tipy'}` : ''}` : ''}
      </p>
      {open && (results.length > 0 || (query.trim().length >= 2 && !loading)) && (
        <div className="absolute left-0 top-12 md:top-14 mt-1.5 w-full min-w-[20rem] rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden z-50">
          {kategorie.length > 0 && (
            <ul className="border-b border-slate-100 py-1" aria-label="Žebříčky">
              {kategorie.map((k) => (
                <li key={k.href}>
                  <Link href={k.href} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3.5 py-2.5 text-sm hover:bg-slate-50 transition-colors">
                    <ListOrdered className="w-4 h-4 shrink-0 text-teal-700" aria-hidden="true" />
                    <span className="min-w-0 flex-1 font-medium text-slate-900">{k.typ === 'pruvodce' ? k.label : `Žebříček: ${k.label}`}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {results.length > 0 ? (
            <ul id="hero-hledani-vysledky" role="listbox" aria-label="Nalezené fondy" className="max-h-[50vh] overflow-y-auto py-1">
              {results.map((r, i) => (
                <li key={r.isin} id={`hero-vysledek-${r.isin}`} role="option" aria-selected={active === i}>
                  <button
                    tabIndex={-1}
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goToEtf(r.isin)}
                    className={`w-full px-3.5 py-2.5 text-left flex items-center gap-3 transition-colors ${active === i ? 'bg-teal-50' : 'hover:bg-slate-50'}`}
                  >
                    <span className="flex items-center justify-center w-5 h-5 shrink-0"><EmitentLogo nazev={r.name} size={20} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex min-w-0 text-sm text-slate-900"><span className="truncate font-medium">{r.name}</span>{r.primary_ticker && <span className="shrink-0 text-slate-500">&nbsp;· {r.primary_ticker}</span>}</span>
                      <span className="block text-xs text-slate-500 truncate">
                        {r.fund_provider ? `${r.fund_provider} · ` : ''}{r.isin}
                      </span>
                    </span>
                    {(r.ter != null || r.r1_czk != null) && (
                      <span className="hidden sm:flex shrink-0 flex-col items-end text-xs tabular-nums">
                        <span className="text-slate-600">TER {r.ter != null ? `${r.ter.toFixed(2).replace('.', ',')} %` : '—'}</span>
                        {r.r1_czk != null && <span className={r.r1_czk >= 0 ? 'text-emerald-700' : 'text-red-700'}>{r.r1_czk > 0 ? '+' : r.r1_czk < 0 ? '−' : ''}{Math.abs(r.r1_czk).toFixed(1).replace('.', ',')} % <span className="text-slate-500">12 měs. Kč</span></span>}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            kategorie.length === 0 && (
              // Nikdy slepá ulička: bez shody nabídnout žebříčky.
              <div className="px-3.5 py-3 text-sm text-slate-500">
                Žádný fond neodpovídá „{query.trim()}“. Zkuste ticker (VWCE), ISIN, nebo{' '}
                <Link href="/zebricky" onClick={() => setOpen(false)} className="font-medium text-teal-700 hover:underline">projděte žebříčky podle trhu</Link>.
              </div>
            )
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
