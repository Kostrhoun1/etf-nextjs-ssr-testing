'use client';

import Link from 'next/link';
import type { ComparisonETF } from '@/lib/etf-data';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import { useCurrency, pickReturn, curLabel } from '@/components/design-preview/currencyStore';

const num = (v: number | null | undefined) => (v == null || Number.isNaN(v) ? null : Number(v));
const ter = (v: number | null) => (v == null ? '—' : `${v.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`);
const pct = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : ''}${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`);
const money = (v: number | null) => (v == null ? '—' : v >= 1000 ? `${(v / 1000).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mld. €` : `${Math.round(v).toLocaleString('cs-CZ')} mil. €`);
const isAcc = (p: string | null) => !/distribut/i.test(p || '');
const replLabel = (r: string | null) => { const s = (r || '').toLowerCase(); if (s.includes('synth') || s.includes('swap')) return 'Syntetická'; if (s) return 'Fyzická'; return '—'; };
const DOM: Record<string, string> = { Ireland: 'Irsko', Luxembourg: 'Lucembursko', Germany: 'Německo', France: 'Francie' };

export default function PorovnaniTable({ etfs }: { etfs: ComparisonETF[] }) {
  const [cur] = useCurrency();
  const ret = (e: ComparisonETF, period: string) => pickReturn(e as unknown as Record<string, unknown>, period, cur);

  const bestLowTer = Math.min(...etfs.map((e) => num(e.ter_numeric) ?? Infinity));
  const bestR1 = Math.max(...etfs.map((e) => ret(e, '1y') ?? -Infinity));

  const rows: { label: string; cell: (e: ComparisonETF) => React.ReactNode; best?: (e: ComparisonETF) => boolean }[] = [
    { label: 'Ticker', cell: (e) => e.primary_ticker ?? '—' },
    { label: 'Poplatek (TER)', cell: (e) => ter(num(e.ter_numeric)), best: (e) => num(e.ter_numeric) === bestLowTer },
    { label: 'Velikost fondu', cell: (e) => money(num(e.fund_size_numeric)) },
    { label: `Výnos 1 rok (${curLabel[cur]})`, cell: (e) => pct(ret(e, '1y')), best: (e) => ret(e, '1y') === bestR1 },
    { label: `Výnos 3 roky (${curLabel[cur]})`, cell: (e) => pct(ret(e, '3y')) },
    { label: `Výnos 5 let (${curLabel[cur]})`, cell: (e) => pct(ret(e, '5y')) },
    { label: 'Dividendový výnos', cell: (e) => (e.current_dividend_yield_numeric != null ? `${Number(e.current_dividend_yield_numeric).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %` : '—') },
    { label: 'Kolísavost 1 rok', cell: (e) => (num(e.volatility_1y) != null ? `${num(e.volatility_1y)!.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %` : '—') },
    { label: 'Typ výplaty', cell: (e) => (isAcc(e.distribution_policy) ? 'Akumulační' : 'Distribuční') },
    { label: 'Replikace', cell: (e) => replLabel(e.replication) },
    { label: 'Domicil', cell: (e) => (e.fund_domicile ? DOM[e.fund_domicile] ?? e.fund_domicile : '—') },
    { label: 'Index', cell: (e) => e.index_name ?? '—' },
    { label: 'Počet firem', cell: (e) => (e.total_holdings != null ? e.total_holdings.toLocaleString('cs-CZ') : '—') },
  ];

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">Zelené zvýraznění = nejlepší hodnota (nejnižší poplatek, nejvyšší roční výnos).</p>
        <CurrencyToggle />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400 bg-slate-50">Parametr</th>
              {etfs.map((e) => (
                <th key={e.isin} className="py-3 px-4 text-left align-top bg-slate-50">
                  <Link href={`/design-preview/etf/${e.isin}`} className="font-semibold text-teal-700 hover:text-teal-800 leading-tight block">{e.name.length > 34 ? e.name.slice(0, 34) + '…' : e.name}</Link>
                  <span className="text-xs text-slate-400 font-normal">{e.primary_ticker ?? e.isin}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2.5 px-4 text-slate-500 font-medium">{r.label}</td>
                {etfs.map((e) => (
                  <td key={e.isin} className={`py-2.5 px-4 tabular-nums ${r.best?.(e) ? 'font-bold text-emerald-700' : 'text-slate-800'}`}>{r.cell(e)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
