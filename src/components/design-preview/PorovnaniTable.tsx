'use client';

import React from 'react';
import Link from 'next/link';
import type { ComparisonETF } from '@/lib/etf-data';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import { useCurrency, pickReturn, curLabel } from '@/components/design-preview/currencyStore';

const raw = (e: ComparisonETF) => e as unknown as Record<string, unknown>;
const num = (v: unknown) => (v == null || Number.isNaN(Number(v)) ? null : Number(v));
const str = (v: unknown) => (v == null || v === '' ? null : String(v));

const ter = (v: number | null) => (v == null ? '—' : `${v.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`);
const pct = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : ''}${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`);
const pct1 = (v: number | null) => (v == null ? '—' : `${v.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %`);
/* POZOR: velikost fondu (fund_size_numeric) se z justETF stahuje VŽDY v EUR
   (standardizováno kvůli srovnatelnosti), i u USD/GBP tříd. Proto vždy €.
   Ověřeno proti justETF: CSPX = EUR 131 612 mil., SWDA = EUR 123 901 mil. */
const curSym = (_c?: string | null) => '€';
const money = (v: number | null, cur: string | null = 'EUR') => (v == null ? '—' : v >= 1000 ? `${(v / 1000).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mld. ${curSym(cur)}` : `${Math.round(v).toLocaleString('cs-CZ')} mil. ${curSym(cur)}`);
const isAcc = (p: string | null) => !/distribut/i.test(p || '');
const replLabel = (r: string | null) => { const s = (r || '').toLowerCase(); if (s.includes('synth') || s.includes('swap')) return 'Syntetická (swap)'; if (s) return 'Fyzická'; return '—'; };
const DOM: Record<string, string> = { Ireland: 'Irsko', Luxembourg: 'Lucembursko', Germany: 'Německo', France: 'Francie', Netherlands: 'Nizozemsko', Switzerland: 'Švýcarsko', 'United Kingdom': 'Spojené království' };
const dom = (d: string | null) => (d ? DOM[d] ?? d : '—');

const age = (inc: string | null) => {
  if (!inc) return '—';
  const d = new Date(inc); if (Number.isNaN(d.getTime())) return '—';
  const y = (Date.now() - d.getTime()) / (365.25 * 864e5);
  return y < 1 ? '< 1 rok' : `${Math.floor(y)} let`;
};

/* Barevná procentní buňka pro výnos. */
function Perf({ v }: { v: number | null }) {
  if (v == null) return <span className="text-slate-400">—</span>;
  return <span className={`tabular-nums font-medium ${v >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(v)}</span>;
}

/* Seznam vah (pozice / sektory / země) pro jeden fond. */
function WeightList({ e, prefix, n }: { e: ComparisonETF; prefix: string; n: number }) {
  const r = raw(e);
  const items: { name: string; w: number | null }[] = [];
  for (let i = 1; i <= n; i++) {
    const name = str(r[`${prefix}_${i}_name`]);
    if (!name) continue;
    items.push({ name, w: num(r[`${prefix}_${i}_weight`]) });
  }
  if (!items.length) return <span className="text-slate-400 text-xs">Data nejsou k dispozici</span>;
  return (
    <ul className="space-y-1">
      {items.map((it, i) => (
        <li key={i} className="flex items-center justify-between gap-2 text-xs">
          <span className="truncate text-slate-700">{it.name}</span>
          {it.w != null && <span className="shrink-0 tabular-nums text-slate-500">{pct1(it.w)}</span>}
        </li>
      ))}
    </ul>
  );
}

type Row = { label: string; cell: (e: ComparisonETF) => React.ReactNode; best?: (e: ComparisonETF) => boolean; top?: boolean };
type Section = { title: string; rows: Row[] };

export default function PorovnaniTable({ etfs }: { etfs: ComparisonETF[] }) {
  const [cur] = useCurrency();
  const ret = (e: ComparisonETF, period: string) => pickReturn(raw(e), period, cur);

  const bestLowTer = Math.min(...etfs.map((e) => num(e.ter_numeric) ?? Infinity));
  const bestSize = Math.max(...etfs.map((e) => num(e.fund_size_numeric) ?? -Infinity));
  const bestR1 = Math.max(...etfs.map((e) => ret(e, '1y') ?? -Infinity));
  const bestDiv = Math.max(...etfs.map((e) => num(e.current_dividend_yield_numeric) ?? -Infinity));

  const perf = (period: string, label: string, best?: boolean): Row => ({
    label, cell: (e) => <Perf v={ret(e, period)} />, best: best ? (e) => ret(e, '1y') === bestR1 && bestR1 !== -Infinity : undefined,
  });
  const riskRow = (label: string, key: string, suffix = ' %'): Row => ({
    label, cell: (e) => { const v = num(raw(e)[key]); return v == null ? <span className="text-slate-400">—</span> : <span className="tabular-nums text-slate-700">{v.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })}{suffix}</span>; },
  });

  const sections: Section[] = [
    {
      title: 'Základní informace',
      rows: [
        { label: 'Ticker', cell: (e) => <span className="font-semibold text-slate-800">{e.primary_ticker ?? '—'}</span> },
        { label: 'Poskytovatel', cell: (e) => str(e.fund_provider) ?? '—' },
        { label: 'Sledovaný index', cell: (e) => str(e.index_name) ?? '—' },
        { label: 'Zaměření', cell: (e) => str(raw(e).investment_focus) ?? str(e.region) ?? '—' },
        { label: 'Typ výplaty', cell: (e) => isAcc(e.distribution_policy) ? 'Akumulační' : 'Distribuční' },
        { label: 'Replikace', cell: (e) => replLabel(e.replication) },
        { label: 'Domicil', cell: (e) => dom(e.fund_domicile) },
        { label: 'Právní struktura', cell: (e) => str(raw(e).legal_structure) ?? '—' },
        { label: 'Měna fondu', cell: (e) => str(e.fund_currency) ?? '—' },
      ],
    },
    {
      title: 'Poplatky a velikost',
      rows: [
        { label: 'Roční poplatek (TER)', cell: (e) => ter(num(e.ter_numeric)), best: (e) => num(e.ter_numeric) === bestLowTer },
        { label: 'Velikost fondu', cell: (e) => money(num(e.fund_size_numeric), e.fund_currency), best: (e) => num(e.fund_size_numeric) === bestSize && bestSize !== -Infinity },
        { label: 'Počet firem v indexu', cell: (e) => e.total_holdings != null ? e.total_holdings.toLocaleString('cs-CZ') : '—' },
        { label: 'Stáří fondu', cell: (e) => age(e.inception_date) },
      ],
    },
    {
      title: `Výkonnost (${curLabel[cur]})`,
      rows: [
        perf('ytd', 'Od začátku roku (YTD)'),
        perf('1m', '1 měsíc'),
        perf('3m', '3 měsíce'),
        perf('6m', '6 měsíců'),
        perf('1y', '1 rok', true),
        perf('3y', '3 roky'),
        perf('5y', '5 let'),
      ],
    },
    {
      title: `Výkonnost po letech (${curLabel[cur]})`,
      rows: ['2025', '2024', '2023', '2022', '2021'].map((y) => perf(y, `Rok ${y}`)),
    },
    {
      title: 'Riziko a kolísavost',
      rows: [
        riskRow('Volatilita 1 rok', 'volatility_1y'),
        riskRow('Volatilita 3 roky', 'volatility_3y'),
        riskRow('Volatilita 5 let', 'volatility_5y'),
        riskRow('Nejhorší pokles 1 rok', 'max_drawdown_1y'),
        riskRow('Nejhorší pokles 3 roky', 'max_drawdown_3y'),
        riskRow('Nejhorší pokles od založení', 'max_drawdown_inception'),
        riskRow('Beta (vs trh)', 'beta', ''),
        riskRow('Tracking error', 'tracking_error'),
      ],
    },
    {
      title: 'Dividendy',
      rows: [
        { label: 'Dividendový výnos', cell: (e) => { const v = num(e.current_dividend_yield_numeric); return v == null ? '—' : pct1(v); }, best: (e) => num(e.current_dividend_yield_numeric) === bestDiv && bestDiv > 0 },
        { label: 'Politika výplaty', cell: (e) => isAcc(e.distribution_policy) ? 'Reinvestuje (Acc)' : 'Vyplácí (Dist)' },
      ],
    },
    {
      title: 'Největší pozice (Top 10)',
      rows: [{ label: 'Držené firmy', top: true, cell: (e) => <WeightList e={e} prefix="holding" n={10} /> }],
    },
    {
      title: 'Sektory',
      rows: [{ label: 'Rozložení sektorů', top: true, cell: (e) => <WeightList e={e} prefix="sector" n={5} /> }],
    },
    {
      title: 'Země / regiony',
      rows: [{ label: 'Geografické rozložení', top: true, cell: (e) => <WeightList e={e} prefix="country" n={5} /> }],
    },
  ];

  const colW = etfs.length + 1;

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">Kompletní srovnání vedle sebe. Zelené pole = nejlepší hodnota v řádku.</p>
        <CurrencyToggle />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full min-w-[44rem] text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400 bg-slate-50 sticky left-0">Parametr</th>
              {etfs.map((e) => (
                <th key={e.isin} className="py-3 px-4 text-left align-top bg-slate-50">
                  <Link href={`/design-preview/etf/${e.isin}`} className="font-semibold text-teal-700 hover:text-teal-800 leading-tight block">{e.name.length > 32 ? e.name.slice(0, 32) + '…' : e.name}</Link>
                  <span className="text-xs text-slate-400 font-normal">{e.primary_ticker ?? e.isin}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((sec) => (
              <React.Fragment key={sec.title}>
                <tr>
                  <td colSpan={colW} className="bg-slate-100/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{sec.title}</td>
                </tr>
                {sec.rows.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100 align-top">
                    <td className="py-2.5 px-4 text-slate-500 font-medium sticky left-0 bg-white">{r.label}</td>
                    {etfs.map((e) => (
                      <td key={e.isin} className={`py-2.5 px-4 ${r.top ? '' : 'tabular-nums'} ${r.best?.(e) ? 'font-bold text-emerald-700' : 'text-slate-800'}`}>{r.cell(e)}</td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
