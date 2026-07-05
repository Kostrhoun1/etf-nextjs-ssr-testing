'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, SlidersHorizontal, X, Star } from 'lucide-react';
import type { ScreenerETF } from '@/lib/etf-data';
import CompareButton from '@/components/design-preview/CompareButton';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import { useCurrency, pickReturn, curLabel } from '@/components/design-preview/currencyStore';
import { buildIndexOptions, canonicalIndexLabel } from '@/utils/indexNormalization';
import { buildRegionOptions, classifyRegion } from '@/utils/regionClassification';
import { detectHedging } from '@/utils/hedgingDetection';
import { calculateETFRating } from '@/utils/etfRating';
import type { ETFListItem } from '@/types/etf';

type SortKey = 'name' | 'ter' | 'size' | 'ytd' | 'r1' | 'r3' | 'r5' | 'div';
type SortDir = 'asc' | 'desc';

const num = (v: number | null | undefined) => (v == null || Number.isNaN(v) ? null : Number(v));
const ter = (v: number | null) => (v == null ? '—' : `${v.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`);
const pct = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : ''}${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`);
const curSym = (c: string | null) => (c === 'USD' ? '$' : c === 'GBP' ? '£' : c === 'CHF' ? 'CHF' : '€');
/** fund_size_numeric je v milionech MĚNY FONDU (justETF) → zobraz se symbolem té měny. */
const money = (v: number | null, cur: string | null = 'EUR') => {
  if (v == null) return '—';
  const s = curSym(cur);
  if (v >= 1000) return `${(v / 1000).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mld. ${s}`;
  return `${Math.round(v).toLocaleString('cs-CZ')} mil. ${s}`;
};
const isAcc = (p: string | null) => !/distribut/i.test(p || '');
const replLabel = (r: string | null) => {
  const s = (r || '').toLowerCase();
  if (s.includes('synth') || s.includes('swap')) return 'Syntetická';
  if (s.includes('physical') || s.includes('full') || s.includes('sampl') || s.includes('optim')) return 'Fyzická';
  return r || '—';
};

const PAGE = 25;

const selCls = 'min-h-[40px] w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none';

/* Prezentační obal pole filtru (label + input/select). Definováno na úrovni
   modulu, aby si input při každém překreslení zachoval stabilní identitu a
   neztrácel fokus po každém stisku klávesy. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block"><span className="block mb-1 text-xs font-medium text-slate-500">{label}</span>{children}</label>
  );
}

/* Řaditelná hlavička sloupce. Stav řazení dostává propy, aby mohla zůstat mimo
   tělo komponenty (stabilní identita = žádný zbytečný remount hlavičky). */
function SortH({ k, children, right, tip, sortKey, sortDir, toggleSort }: {
  k: SortKey; children: React.ReactNode; right?: boolean; tip?: string;
  sortKey: SortKey; sortDir: SortDir; toggleSort: (k: SortKey) => void;
}) {
  return (
    <th aria-sort={sortKey === k ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'} className={`py-2.5 px-3 font-medium ${right ? 'text-right' : 'text-left'}`}>
      <button onClick={() => toggleSort(k)} title={tip} aria-label={`${tip ? tip + '. ' : ''}Seřadit podle sloupce, aktuálně ${sortKey === k ? (sortDir === 'asc' ? 'vzestupně' : 'sestupně') : 'neseřazeno'}`} className={`inline-flex items-center gap-1 hover:text-teal-700 ${tip ? 'cursor-help decoration-dotted underline-offset-4 hover:underline' : ''} ${sortKey === k ? 'text-teal-700' : ''}`}>
        {children}
        {sortKey === k ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
      </button>
    </th>
  );
}

/* Kompaktní hvězdičkové hodnocení do seznamu. */
function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center" title={`Hodnocení ${n}/5`} aria-label={`Hodnocení ${n} z 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3 h-3 ${i <= n ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
      ))}
    </span>
  );
}

/* Předpočítané odvozené hodnoty (region/hedging/index/rating) – jednou, ať filtr
   nemusí pouštět regexy přes 4 300 řádků při každém stisku klávesy. */
interface Enriched {
  e: ScreenerETF;
  region: string | null;
  hedge: string;          // hedgingType
  indexLabel: string;
  ratingVal: number | null;
  blob: string;           // text pro fulltext (name/isin/provider/tickery)
}

export default function ScreenerUI({ etfs, initialQ = '' }: { etfs: ScreenerETF[]; initialQ?: string }) {
  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState('all');
  const [dist, setDist] = useState('all');
  const [region, setRegion] = useState('all');
  const [indexName, setIndexName] = useState('all');
  const [repl, setRepl] = useState('all');
  const [currency, setCurrency] = useState('all');
  const [hedging, setHedging] = useState('all');
  const [sizeCat, setSizeCat] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [leveraged, setLeveraged] = useState(false);
  const [terMax, setTerMax] = useState<string>('');
  const [sizeMin, setSizeMin] = useState<string>('');
  const [divMin, setDivMin] = useState<string>('');
  const [advOpen, setAdvOpen] = useState(false);

  const [sortKey, setSortKey] = useState<SortKey>('size');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [shown, setShown] = useState(PAGE);
  const [cur] = useCurrency();

  // Předpočítej odvozené hodnoty jednou pro celou sadu.
  const enriched = useMemo<Enriched[]>(() =>
    etfs.map((e) => ({
      e,
      region: classifyRegion(e),
      hedge: detectHedging(e.name, e.currency_risk ?? undefined).hedgingType,
      indexLabel: canonicalIndexLabel(e.index_name),
      ratingVal: e.rating ?? calculateETFRating(e as unknown as ETFListItem)?.rating ?? null,
      blob: `${e.name} ${e.isin} ${e.fund_provider ?? ''} ${e.primary_ticker ?? ''} ${e.exchange_1_ticker ?? ''} ${e.exchange_2_ticker ?? ''} ${e.exchange_3_ticker ?? ''} ${e.exchange_4_ticker ?? ''} ${e.exchange_5_ticker ?? ''}`.toLowerCase(),
    })), [etfs]);

  // Kategorie jako taby (nejvyšší dělení). Řazení dle preferovaného pořadí,
  // neznámé kategorie na konec; „Ostatní“ (1 fond) vynecháme jako původní web.
  const CATEGORY_ORDER = ['Akcie', 'Dluhopisy', 'Nemovitosti', 'Komodity', 'Krypto'];
  const categories = useMemo(() => {
    const present = [...new Set(etfs.map((e) => e.category).filter((c): c is string => !!c && c !== 'Ostatní'))];
    const ordered = CATEGORY_ORDER.filter((c) => present.includes(c));
    const extra = present.filter((c) => !CATEGORY_ORDER.includes(c)).sort((a, b) => a.localeCompare(b));
    return [...ordered, ...extra];
  }, [etfs]);
  const catCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of etfs) if (e.category) m.set(e.category, (m.get(e.category) ?? 0) + 1);
    return m;
  }, [etfs]);
  const regions = useMemo(() => buildRegionOptions(etfs), [etfs]);
  const indexOpts = useMemo(() => buildIndexOptions(etfs), [etfs]);
  const currencies = useMemo(() => [...new Set(etfs.map((e) => e.fund_currency).filter(Boolean))].sort() as string[], [etfs]);
  const replications = useMemo(() => {
    const set = new Set<string>();
    for (const e of etfs) { const l = replLabel(e.replication); if (l !== '—') set.add(l); }
    return [...set].sort();
  }, [etfs]);

  // Filtrace nezávisí na měně (`cur`) – ta ovlivňuje jen řazení sloupců ytd/r1/r3/r5.
  // Držíme ji ve vlastním memu, aby přepnutí měny nespouštělo drahý filtr přes ~4867 fondů.
  const filteredRows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const terMaxN = terMax === '' ? null : parseFloat(terMax.replace(',', '.'));
    const sizeMinN = sizeMin === '' ? null : parseFloat(sizeMin.replace(/\s/g, '').replace(',', '.'));
    const divMinN = divMin === '' ? null : parseFloat(divMin.replace(',', '.'));

    return enriched.filter(({ e, region: reg, hedge, indexLabel, ratingVal, blob }) => {
      if (term && !blob.includes(term)) return false;
      if (category !== 'all' && e.category !== category) return false;
      if (!leveraged && e.is_leveraged) return false;
      if (dist === 'acc' && !isAcc(e.distribution_policy)) return false;
      if (dist === 'dist' && isAcc(e.distribution_policy)) return false;
      if (region !== 'all' && reg !== region) return false;
      if (indexName !== 'all' && indexLabel !== indexName) return false;
      if (repl !== 'all' && replLabel(e.replication) !== repl) return false;
      if (currency !== 'all' && e.fund_currency !== currency) return false;
      if (hedging !== 'all') {
        if (hedging === 'unhedged' && hedge !== 'unhedged') return false;
        if (hedging === 'hedged' && hedge === 'unhedged') return false;
        if (hedging !== 'unhedged' && hedging !== 'hedged' && hedge !== hedging) return false;
      }
      if (minRating > 0 && (ratingVal == null || ratingVal < minRating)) return false;
      const size = num(e.fund_size_numeric);
      if (sizeCat !== 'all' && size != null) {
        if (sizeCat === 'small' && !(size < 100)) return false;
        if (sizeCat === 'medium' && !(size >= 100 && size < 1000)) return false;
        if (sizeCat === 'large' && !(size >= 1000 && size < 10000)) return false;
        if (sizeCat === 'xlarge' && !(size >= 10000)) return false;
      }
      if (terMaxN != null && num(e.ter_numeric) != null && num(e.ter_numeric)! > terMaxN) return false;
      if (sizeMinN != null && (size == null || size < sizeMinN)) return false;
      if (divMinN != null) { const d = num(e.current_dividend_yield_numeric); if (d == null || d < divMinN) return false; }
      return true;
    });
  }, [enriched, q, category, dist, region, indexName, repl, currency, hedging, sizeCat, minRating, leveraged, terMax, sizeMin, divMin]);

  const filtered = useMemo(() => {
    const rows = [...filteredRows];

    const get = (e: ScreenerETF): number | string | null => {
      const o = e as unknown as Record<string, unknown>;
      switch (sortKey) {
        case 'name': return e.name?.toLowerCase() ?? '';
        case 'ter': return num(e.ter_numeric);
        case 'size': return num(e.fund_size_numeric);
        case 'ytd': return pickReturn(o, 'ytd', cur);
        case 'r1': return pickReturn(o, '1y', cur);
        case 'r3': return pickReturn(o, '3y', cur);
        case 'r5': return pickReturn(o, '5y', cur);
        case 'div': return num(e.current_dividend_yield_numeric);
      }
    };
    rows.sort((A, B) => {
      const va = get(A.e), vb = get(B.e);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      const cmp = typeof va === 'string' ? va.localeCompare(vb as string, 'cs') : (va as number) - (vb as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return rows;
  }, [filteredRows, sortKey, sortDir, cur]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir(k === 'name' || k === 'ter' ? 'asc' : 'desc'); }
    setShown(PAGE);
  };

  const reset = () => {
    setQ(''); setCategory('all'); setDist('all'); setRegion('all'); setIndexName('all');
    setRepl('all'); setCurrency('all'); setHedging('all'); setSizeCat('all'); setMinRating(0);
    setLeveraged(false); setTerMax(''); setSizeMin(''); setDivMin(''); setShown(PAGE);
  };
  // Kategorie je samostatný tab, do odznaku „Pokročilé filtry“ ji nepočítáme.
  const activeCount =
    (dist !== 'all' ? 1 : 0) + (region !== 'all' ? 1 : 0) +
    (indexName !== 'all' ? 1 : 0) + (repl !== 'all' ? 1 : 0) + (currency !== 'all' ? 1 : 0) +
    (hedging !== 'all' ? 1 : 0) + (sizeCat !== 'all' ? 1 : 0) + (minRating > 0 ? 1 : 0) +
    (leveraged ? 1 : 0) + (terMax !== '' ? 1 : 0) + (sizeMin !== '' ? 1 : 0) + (divMin !== '' ? 1 : 0);
  const anyFilter = activeCount > 0 || q !== '' || category !== 'all';

  const bump = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => { setter(e.target.value); setShown(PAGE); };
  const bumpN = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => { setter(e.target.value); setShown(PAGE); };

  return (
    <div>
      {/* KATEGORIE JAKO TABY – nejvyšší dělení, vždy na jeden klik */}
      <div className="-mx-1 mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {[{ v: 'all', label: 'Vše' }, ...categories.map((c) => ({ v: c, label: c }))].map(({ v, label }) => {
          const active = category === v;
          const count = v === 'all' ? etfs.length : (catCounts.get(v) ?? 0);
          return (
            <button
              key={v}
              aria-pressed={active}
              onClick={() => { setCategory(v); setShown(PAGE); }}
              className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${active ? 'bg-teal-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-700'}`}
            >
              {label}
              <span className={`ml-1.5 tabular-nums text-xs ${active ? 'text-teal-100' : 'text-slate-400'}`}>{count.toLocaleString('cs-CZ')}</span>
            </button>
          );
        })}
      </div>

      {/* TOOLBAR */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            aria-label="Hledat fond podle názvu, ISIN, poskytovatele nebo tickeru"
            value={q}
            onChange={(e) => { setQ(e.target.value); setShown(PAGE); }}
            placeholder="Hledat podle názvu, ISIN, poskytovatele nebo tickeru…"
            className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
          />
        </div>

        {/* Primární filtry – vždy vidět */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field label="Region">
            <select aria-label="Region" value={region} onChange={bump(setRegion)} className={selCls}>
              <option value="all">Všechny regiony</option>
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Sledovaný index">
            <select aria-label="Sledovaný index" value={indexName} onChange={bump(setIndexName)} className={selCls}>
              <option value="all">Všechny indexy</option>
              {indexOpts.groups.map((g) => (
                <optgroup key={g.heading} label={g.heading}>
                  {g.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field label="Typ výplaty">
            <select aria-label="Typ výplaty" value={dist} onChange={bump(setDist)} className={selCls}>
              <option value="all">Akum. i distrib.</option>
              <option value="acc">Akumulační</option>
              <option value="dist">Distribuční</option>
            </select>
          </Field>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button onClick={() => setAdvOpen((o) => !o)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-teal-300 hover:text-teal-700">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Pokročilé filtry
            {activeCount > 0 && <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-teal-600 text-white text-[11px] font-semibold">{activeCount}</span>}
          </button>
          {anyFilter && (
            <button onClick={reset} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-600"><X className="w-3.5 h-3.5" /> Vymazat vše</button>
          )}
        </div>

        {/* Pokročilé filtry – rozbalovací */}
        {advOpen && (
          <div className="mt-4 border-t border-slate-100 pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Field label="Replikace">
              <select aria-label="Replikace" value={repl} onChange={bump(setRepl)} className={selCls}>
                <option value="all">Každá replikace</option>
                {replications.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Měna fondu">
              <select aria-label="Měna fondu" value={currency} onChange={bump(setCurrency)} className={selCls}>
                <option value="all">Všechny měny</option>
                {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Měnové zajištění">
              <select aria-label="Měnové zajištění" value={hedging} onChange={bump(setHedging)} className={selCls}>
                <option value="all">Všechny typy</option>
                <option value="unhedged">Nezajištěné</option>
                <option value="hedged">Zajištěné (všechny)</option>
                <option value="eur_hedged">EUR zajištěné</option>
                <option value="usd_hedged">USD zajištěné</option>
                <option value="gbp_hedged">GBP zajištěné</option>
                <option value="chf_hedged">CHF zajištěné</option>
              </select>
            </Field>
            <Field label="Velikost fondu">
              <select aria-label="Velikost fondu" value={sizeCat} onChange={bump(setSizeCat)} className={selCls}>
                <option value="all">Všechny velikosti</option>
                <option value="small">Malé (&lt; 100 mil.)</option>
                <option value="medium">Střední (100 mil.–1 mld.)</option>
                <option value="large">Velké (1–10 mld.)</option>
                <option value="xlarge">Velmi velké (&gt; 10 mld.)</option>
              </select>
            </Field>
            <Field label="Minimální hodnocení">
              <select aria-label="Minimální hodnocení" value={minRating} onChange={(e) => { setMinRating(Number(e.target.value)); setShown(PAGE); }} className={selCls}>
                <option value={0}>Všechna hodnocení</option>
                <option value={1}>★ 1+</option>
                <option value={2}>★★ 2+</option>
                <option value={3}>★★★ 3+</option>
                <option value={4}>★★★★ 4+</option>
                <option value={5}>★★★★★ 5</option>
              </select>
            </Field>
            <Field label="Max. TER (%)">
              <input type="number" inputMode="decimal" step="0.01" min="0" placeholder="např. 0,20" value={terMax} onChange={bumpN(setTerMax)} className={selCls} />
            </Field>
            <Field label="Min. velikost (mil.)">
              <input type="number" inputMode="numeric" step="10" min="0" placeholder="např. 500" value={sizeMin} onChange={bumpN(setSizeMin)} className={selCls} />
            </Field>
            <Field label="Min. dividendový výnos (%)">
              <input type="number" inputMode="decimal" step="0.1" min="0" placeholder="např. 2,0" value={divMin} onChange={bumpN(setDivMin)} className={selCls} />
            </Field>
            <label className="flex items-end gap-2 pb-1.5">
              <input type="checkbox" checked={leveraged} onChange={(e) => { setLeveraged(e.target.checked); setShown(PAGE); }} className="w-4 h-4 rounded accent-teal-600" />
              <span className="text-sm text-slate-700">Zobrazit i páková ETF</span>
            </label>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">Nalezeno <span className="font-semibold text-slate-800">{filtered.length}</span> z {etfs.length} fondů. Klikněte na fond pro detail, tlačítkem <span className="font-medium text-slate-700">+</span> přidáte do porovnání.</p>
        <CurrencyToggle size="sm" />
      </div>

      {/* TABULKA – desktop */}
      <div className="mt-3 hidden md:block rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full min-w-[52rem] text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
              <SortH k="name" sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>Fond</SortH>
              <SortH k="ter" right tip="TER (Total Expense Ratio) = celkový roční poplatek za správu fondu v procentech. Čím nižší, tím lépe – strhává se automaticky z hodnoty fondu." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>TER</SortH>
              <SortH k="size" right tip="Velikost fondu = kolik peněz fond celkem spravuje (v měně fondu). Větší fond obvykle znamená lepší likviditu a nižší riziko zrušení." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>Velikost</SortH>
              <SortH k="ytd" right tip="YTD (Year To Date) = výnos od začátku letošního roku, přepočtený do zvolené měny." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>YTD ({curLabel[cur]})</SortH>
              <SortH k="r1" right tip="Výnos za poslední 1 rok (kumulativně), přepočtený do zvolené měny." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>1R ({curLabel[cur]})</SortH>
              <SortH k="r3" right tip="Výnos za poslední 3 roky (kumulativně, ne ročně), přepočtený do zvolené měny." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>3R ({curLabel[cur]})</SortH>
              <SortH k="div" right tip="Dividendový výnos = roční dividenda vůči ceně fondu v procentech. U akumulačních fondů se dividendy reinvestují uvnitř." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>Div.</SortH>
              <th className="py-2.5 px-3 font-medium text-center" title="Typ výplaty: ACC (akumulační) = dividendy se reinvestují uvnitř fondu. DIST (distribuční) = dividendy se vyplácejí na účet.">Typ</th>
              <th className="py-2.5 px-3 font-medium text-center"><span className="sr-only">Porovnat</span></th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, shown).map(({ e, region: reg, ratingVal }) => (
              <tr key={e.isin} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-3">
                  <Link href={`/design-preview/etf/${e.isin}`} className="font-medium text-teal-700 hover:text-teal-800">
                    {e.name.length > 44 ? e.name.slice(0, 44) + '…' : e.name}
                  </Link>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    {e.primary_ticker ?? e.isin}{reg ? ` · ${reg}` : ''}
                    {e.is_leveraged && <span className="rounded bg-amber-50 px-1 text-[10px] font-medium text-amber-700">páka</span>}
                    {ratingVal != null && <Stars n={ratingVal} />}
                  </span>
                </td>
                <td className="py-3 px-3 text-right tabular-nums font-medium text-slate-800">{ter(num(e.ter_numeric))}</td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-600">{money(num(e.fund_size_numeric), e.fund_currency)}</td>
                {(() => { const o = e as unknown as Record<string, unknown>; const ytd = pickReturn(o, 'ytd', cur), r1 = pickReturn(o, '1y', cur), r3 = pickReturn(o, '3y', cur); return (<>
                <td className={`py-3 px-3 text-right tabular-nums ${(ytd ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(ytd)}</td>
                <td className={`py-3 px-3 text-right tabular-nums font-medium ${(r1 ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(r1)}</td>
                <td className={`py-3 px-3 text-right tabular-nums ${(r3 ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(r3)}</td>
                </>); })()}
                <td className="py-3 px-3 text-right tabular-nums text-slate-600">{e.current_dividend_yield_numeric != null ? `${Number(e.current_dividend_yield_numeric).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %` : '—'}</td>
                <td className="py-3 px-3 text-center">
                  <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full ${isAcc(e.distribution_policy) ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {isAcc(e.distribution_policy) ? 'ACC' : 'DIST'}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex justify-center"><CompareButton isin={e.isin} label={e.primary_ticker ?? e.name.slice(0, 8)} variant="chip" /></div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="py-10 text-center text-sm text-slate-400">Žádný fond neodpovídá filtrům. <button onClick={reset} className="text-teal-700 hover:underline">Vymazat filtry</button></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* KARTY – mobil (stejná data jako tabulka, jen jiné vykreslení) */}
      <div className="mt-3 md:hidden space-y-2">
        {filtered.slice(0, shown).map(({ e, region: reg, ratingVal }) => {
          const o = e as unknown as Record<string, unknown>;
          const ytd = pickReturn(o, 'ytd', cur), r1 = pickReturn(o, '1y', cur), r3 = pickReturn(o, '3y', cur);
          return (
            <div key={e.isin} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/design-preview/etf/${e.isin}`} className="font-medium text-teal-700 hover:text-teal-800 leading-tight">
                    {e.name.length > 44 ? e.name.slice(0, 44) + '…' : e.name}
                  </Link>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                    {e.primary_ticker ?? e.isin}{reg ? ` · ${reg}` : ''}
                    {e.is_leveraged && <span className="rounded bg-amber-50 px-1 text-[10px] font-medium text-amber-700">páka</span>}
                    {ratingVal != null && <Stars n={ratingVal} />}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-slate-400">1R ({curLabel[cur]})</p>
                  <p className={`tabular-nums font-semibold ${(r1 ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(r1)}</p>
                </div>
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <dt className="text-slate-400">TER</dt>
                  <dd className="tabular-nums font-medium text-slate-800">{ter(num(e.ter_numeric))}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">YTD ({curLabel[cur]})</dt>
                  <dd className={`tabular-nums font-medium ${(ytd ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(ytd)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">3R ({curLabel[cur]})</dt>
                  <dd className={`tabular-nums font-medium ${(r3 ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(r3)}</dd>
                </div>
              </dl>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full ${isAcc(e.distribution_policy) ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {isAcc(e.distribution_policy) ? 'ACC' : 'DIST'}
                </span>
                <CompareButton isin={e.isin} label={e.primary_ticker ?? e.name.slice(0, 8)} variant="chip" />
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
            Žádný fond neodpovídá filtrům. <button onClick={reset} className="text-teal-700 hover:underline">Vymazat filtry</button>
          </div>
        )}
      </div>

      {shown < filtered.length && (
        <div className="mt-4 text-center">
          <button onClick={() => setShown((s) => s + PAGE)} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">
            Zobrazit další ({Math.min(PAGE, filtered.length - shown)})
          </button>
        </div>
      )}
    </div>
  );
}
