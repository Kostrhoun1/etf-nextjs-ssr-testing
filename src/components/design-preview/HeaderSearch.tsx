'use client';

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { platnyTicker } from '@/lib/ticker';
import TridaStitky from '@/components/design-preview/TridaStitky';
import type { TridaFondu } from '@/lib/nazevFondu';

/* Živý našeptávač ETF v hlavičce – při psaní rovnou nabízí fondy (název/ISIN/ticker),
   klik nebo Enter otevře detail fondu; „Zobrazit vše“ pošle dotaz do screeneru.
   Ovládání i klávesnicí (šipky, Enter, Esc).
   Dvě varianty: `desktop` (v hlavičce od lg) a `mobil` (v rozbalovacím panelu MobileMenu pod 1024 px).
   Kolo 7 (22. 10. 2026): mobil dřív měl vlastní <form>, který se při odeslání odpojil z DOM (onSubmit zavřel panel
   dřív, než prohlížeč formulář odeslal → „Form submission canceled because the form is not connected“) a neměl
   našeptávač vůbec. Teď obě varianty sdílejí jednu logiku a navigují přes router (žádné nativní odeslání). */

interface Result {
  isin: string;
  name: string;
  primary_ticker?: string | null;
  fund_provider?: string | null;
  nazev?: string;
  trida?: TridaFondu | null;
}

interface Props {
  /** `mobil` = velké pole + tlačítko „Hledat“ + výsledky pod polem (v panelu MobileMenu). */
  varianta?: 'desktop' | 'mobil';
  /** Zavolá se po přechodu na výsledek (MobileMenu tím zavře panel). */
  onHotovo?: () => void;
}

export default function HeaderSearch({ varianta = 'desktop', onHotovo }: Props = {}) {
  const mobil = varianta === 'mobil';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [kategorie, setKategorie] = useState<{ href: string; label: string; typ?: string }[]>([]); // české hledání → žebříčky
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1); // -1 = žádná položka (Enter → screener)
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const seznamId = useId();

  // Mobil: po otevření panelu rovnou kurzor do pole (ušetří další klepnutí).
  useEffect(() => {
    if (mobil) inputRef.current?.focus();
  }, [mobil]);

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
    onHotovo?.();
  }, [query, router, onHotovo]);

  const goToEtf = useCallback((isin: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/etf/${isin}`);
    onHotovo?.();
  }, [router, onHotovo]);

  const zavritPoOdkazu = () => { setOpen(false); onHotovo?.(); };

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

  const pole = (
    <input
      ref={inputRef}
      type="search"
      role="combobox"
      enterKeyHint="search"
      aria-expanded={open}
      aria-controls={seznamId}
      aria-autocomplete="list"
      aria-label={mobil ? 'Hledat ETF' : 'Hledat ETF podle názvu, ISIN nebo tickeru'}
      placeholder={mobil ? 'Název, ISIN nebo ticker…' : 'Hledat ETF…'}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={onKeyDown}
      onFocus={() => { if (results.length) setOpen(true); }}
      className={mobil
        ? 'flex-1 min-w-0 bg-transparent text-base text-slate-700 placeholder:text-slate-400 outline-none'
        : 'w-36 xl:w-44 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none'}
    />
  );

  return (
    <div ref={boxRef} className={mobil ? 'relative' : 'relative hidden lg:block'}>
      {mobil ? (
        // Žádný nativní <form action> – odeslání řeší router (viz komentář nahoře). <form> zůstává kvůli klávese „Hledat“ na klávesnici telefonu.
        <form role="search" onSubmit={(e) => { e.preventDefault(); goToScreener(); }}>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 h-12 focus-within:border-teal-400 focus-within:bg-white transition-colors">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            {pole}
            {loading && <Loader2 className="w-4 h-4 text-slate-400 animate-spin shrink-0" />}
            <button type="submit" className="shrink-0 rounded-md bg-teal-700 px-3 py-1.5 text-sm font-medium text-white active:bg-teal-800">
              Hledat
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 h-9 focus-within:border-teal-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 transition-colors">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          {pole}
          {loading && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0" />}
        </div>
      )}

      {open && (results.length > 0 || (query.trim().length >= 2 && !loading)) && (
        <div
          id={seznamId}
          data-testid={mobil ? 'mobil-naseptavac' : 'naseptavac'}
          className={mobil
            ? 'mt-2 rounded-xl border border-slate-200 bg-white overflow-hidden'
            : 'absolute right-0 top-full mt-1.5 w-[26rem] max-w-[80vw] rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-50'}
        >
          {kategorie.length > 0 && (
            <ul className="border-b border-slate-100 py-1" aria-label="Žebříčky">
              {kategorie.map((k) => (
                <li key={k.href}>
                  <Link href={k.href} onClick={zavritPoOdkazu} className="flex items-center justify-between gap-2 px-3.5 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50">
                    {k.typ === 'pruvodce' ? k.label : `Žebříček: ${k.label}`} <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {results.length > 0 ? (
            <ul className={`${mobil ? 'max-h-[55vh]' : 'max-h-[70vh]'} overflow-y-auto overscroll-contain py-1`}>
              {results.map((r, i) => (
                <li key={r.isin}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goToEtf(r.isin)}
                    className={`w-full px-3.5 py-2.5 text-left flex items-center gap-3 transition-colors ${active === i ? 'bg-teal-50' : 'hover:bg-slate-50'}`}
                  >
                    <span className="inline-flex items-center justify-center min-w-14 shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 tabular-nums">
                      {platnyTicker(r.primary_ticker) ?? '—'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-slate-900" title={r.name}><span className="truncate">{r.nazev ?? r.name}</span><TridaStitky t={r.trida} /></span>
                      <span className="block text-xs text-slate-500 truncate">
                        {r.fund_provider ? `${r.fund_provider} · ` : ''}{r.isin}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            kategorie.length === 0 && (
              <div className="px-3.5 py-3 text-sm text-slate-500">
                Žádný fond neodpovídá „{query.trim()}“.{' '}
                <Link href="/zebricky" onClick={zavritPoOdkazu} className="font-medium text-teal-700 hover:underline">Žebříčky podle trhu</Link>
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
