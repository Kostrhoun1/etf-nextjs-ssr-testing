'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, SlidersHorizontal, X } from 'lucide-react';
import type { ComparisonETF } from '@/lib/etf-data';
import CompareButton from '@/components/design-preview/CompareButton';

type SortKey = 'name' | 'ter' | 'size' | 'r1' | 'r3' | 'div';
type SortDir = 'asc' | 'desc';

const num = (v: number | null | undefined) => (v == null || Number.isNaN(v) ? null : Number(v));
const ter = (v: number | null) => (v == null ? '—' : `${v.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`);
const pct = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : ''}${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`);
const money = (v: number | null) => {
  if (v == null) return '—';
  if (v >= 1000) return `${(v / 1000).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mld. €`;
  return `${Math.round(v).toLocaleString('cs-CZ')} mil. €`;
};
const isAcc = (p: string | null) => !/distribut/i.test(p || '');
const replLabel = (r: string | null) => {
  const s = (r || '').toLowerCase();
  if (s.includes('synth') || s.includes('swap')) return 'Syntetická';
  if (s) return 'Fyzická';
  return '—';
};

const PAGE = 25;

export default function ScreenerUI({ etfs, initialQ = '' }: { etfs: ComparisonETF[]; initialQ?: string }) {
  const [q, setQ] = useState(initialQ);
  const [dist, setDist] = useState<'all' | 'acc' | 'dist'>('all');
  const [repl, setRepl] = useState<'all' | 'fyz' | 'syn'>('all');
  const [region, setRegion] = useState('all');
  const [maxTer, setMaxTer] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('size');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [shown, setShown] = useState(PAGE);

  const regions = useMemo(() => {
    const set = new Map<string, number>();
    for (const e of etfs) if (e.region) set.set(e.region, (set.get(e.region) ?? 0) + 1);
    return [...set.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14).map(([r]) => r);
  }, [etfs]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const rows = etfs.filter((e) => {
      if (term && !(`${e.name} ${e.primary_ticker ?? ''} ${e.isin}`.toLowerCase().includes(term))) return false;
      if (dist === 'acc' && !isAcc(e.distribution_policy)) return false;
      if (dist === 'dist' && isAcc(e.distribution_policy)) return false;
      const rl = replLabel(e.replication);
      if (repl === 'fyz' && rl !== 'Fyzická') return false;
      if (repl === 'syn' && rl !== 'Syntetická') return false;
      if (region !== 'all' && e.region !== region) return false;
      if (num(e.ter_numeric) != null && num(e.ter_numeric)! > maxTer) return false;
      return true;
    });
    const get = (e: ComparisonETF): number | string | null => {
      switch (sortKey) {
        case 'name': return e.name?.toLowerCase() ?? '';
        case 'ter': return num(e.ter_numeric);
        case 'size': return num(e.fund_size_numeric);
        case 'r1': return num(e.return_1y_czk);
        case 'r3': return num(e.return_3y_czk);
        case 'div': return num(e.current_dividend_yield_numeric);
      }
    };
    rows.sort((a, b) => {
      const va = get(a), vb = get(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      const cmp = typeof va === 'string' ? va.localeCompare(vb as string, 'cs') : (va as number) - (vb as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return rows;
  }, [etfs, q, dist, repl, region, maxTer, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir(k === 'name' || k === 'ter' ? 'asc' : 'desc'); }
    setShown(PAGE);
  };

  const resetFilters = () => { setQ(''); setDist('all'); setRepl('all'); setRegion('all'); setMaxTer(1); setShown(PAGE); };
  const anyFilter = q || dist !== 'all' || repl !== 'all' || region !== 'all' || maxTer < 1;

  const SortH = ({ k, children, right }: { k: SortKey; children: React.ReactNode; right?: boolean }) => (
    <th className={`py-2.5 px-3 font-medium ${right ? 'text-right' : 'text-left'}`}>
      <button onClick={() => toggleSort(k)} className={`inline-flex items-center gap-1 hover:text-teal-700 ${sortKey === k ? 'text-teal-700' : ''}`}>
        {children}
        {sortKey === k ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
      </button>
    </th>
  );

  const selCls = 'min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none';

  return (
    <div>
      {/* TOOLBAR */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setShown(PAGE); }}
            placeholder="Hledat podle názvu, tickeru nebo ISIN…"
            className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400"><SlidersHorizontal className="w-3.5 h-3.5" /> Filtry</span>
          <select aria-label="Typ výplaty" value={dist} onChange={(e) => { setDist(e.target.value as typeof dist); setShown(PAGE); }} className={selCls}>
            <option value="all">Akum. i distrib.</option>
            <option value="acc">Akumulační</option>
            <option value="dist">Distribuční</option>
          </select>
          <select aria-label="Replikace" value={repl} onChange={(e) => { setRepl(e.target.value as typeof repl); setShown(PAGE); }} className={selCls}>
            <option value="all">Každá replikace</option>
            <option value="fyz">Fyzická</option>
            <option value="syn">Syntetická</option>
          </select>
          <select aria-label="Region" value={region} onChange={(e) => { setRegion(e.target.value); setShown(PAGE); }} className={selCls}>
            <option value="all">Všechny regiony</option>
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <label className="inline-flex items-center gap-2 text-sm text-slate-600">
            Max. TER <span className="tabular-nums font-medium text-slate-800">{maxTer.toFixed(2)} %</span>
            <input type="range" min={0.03} max={1} step={0.01} value={maxTer} onChange={(e) => { setMaxTer(Number(e.target.value)); setShown(PAGE); }} className="accent-teal-600" />
          </label>
          {anyFilter && (
            <button onClick={resetFilters} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"><X className="w-3.5 h-3.5" /> Zrušit</button>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-500">Nalezeno <span className="font-semibold text-slate-800">{filtered.length}</span> fondů z {etfs.length} největších. Klikněte na fond pro detail.</p>

      {/* TABULKA */}
      <div className="mt-3 rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full min-w-[46rem] text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
              <SortH k="name">Fond</SortH>
              <SortH k="ter" right>TER</SortH>
              <SortH k="size" right>Velikost</SortH>
              <SortH k="r1" right>1R (Kč)</SortH>
              <SortH k="r3" right>3R (Kč)</SortH>
              <SortH k="div" right>Div.</SortH>
              <th className="py-2.5 px-3 font-medium text-center">Typ</th>
              <th className="py-2.5 px-3 font-medium text-center"><span className="sr-only">Porovnat</span></th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, shown).map((e) => (
              <tr key={e.isin} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-3">
                  <Link href={`/design-preview/etf/${e.isin}`} className="font-medium text-teal-700 hover:text-teal-800">
                    {e.name.length > 44 ? e.name.slice(0, 44) + '…' : e.name}
                  </Link>
                  <span className="block text-xs text-slate-400">{e.primary_ticker ?? e.isin}{e.region ? ` · ${e.region}` : ''}</span>
                </td>
                <td className="py-3 px-3 text-right tabular-nums font-medium text-slate-800">{ter(num(e.ter_numeric))}</td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-600">{money(num(e.fund_size_numeric))}</td>
                <td className={`py-3 px-3 text-right tabular-nums font-medium ${(num(e.return_1y_czk) ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(num(e.return_1y_czk))}</td>
                <td className={`py-3 px-3 text-right tabular-nums ${(num(e.return_3y_czk) ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(num(e.return_3y_czk))}</td>
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
              <tr><td colSpan={8} className="py-10 text-center text-sm text-slate-400">Žádný fond neodpovídá filtrům. <button onClick={resetFilters} className="text-teal-700 hover:underline">Zrušit filtry</button></td></tr>
            )}
          </tbody>
        </table>
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
