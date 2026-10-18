'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import type { ComparisonETF } from '@/lib/etf-data';
import { useCurrency, pickReturn, curLabel } from '@/components/design-preview/currencyStore';
import { platnyTicker } from '@/lib/ticker';
import { ceskaZeme, ceskySektor, ceskeZamereni } from '@/lib/preklady';
import { indexFonduLabel } from '@/utils/indexNormalization';
import EmitentLogo from '@/components/home/EmitentLogo';

const raw = (e: ComparisonETF) => e as unknown as Record<string, unknown>;
const num = (v: unknown) => (v == null || v === '' || Number.isNaN(Number(v)) ? null : Number(v));
const str = (v: unknown) => (v == null || v === '' ? null : String(v));

const ter = (v: number | null) => (v == null ? '—' : `${v.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`);
const pct = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : ''}${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`);
/* Jednotně 1 desetinné místo (revize 18. 10. 2026: „1 %“ vedle „1,45 %“). TER zůstává na 2 místa –
   0,07 vs. 0,12 % je u poplatku podstatný rozdíl a takhle ho uvádějí i emitenti. */
const pct1 = (v: number | null) => (v == null ? '—' : `${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`);
/* POZOR: velikost fondu (fund_size_numeric) se z justETF stahuje VŽDY v EUR
   (standardizováno kvůli srovnatelnosti), i u USD/GBP tříd. Proto vždy €.
   Ověřeno proti justETF: CSPX = EUR 131 612 mil., SWDA = EUR 123 901 mil. */
const money = (v: number | null) => (v == null ? '—' : v >= 1000 ? `${(v / 1000).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mld. €` : `${Math.round(v).toLocaleString('cs-CZ')} mil. €`);
const distTypeLabel = (p: string | null, freq?: string | null) => {
  const s = p || '';
  if (/accumulat|thesaur|capitalis/i.test(s)) return 'Akumulační';
  if (/distribut/i.test(s)) return 'Distribuční';
  if (freq && /(quarter|month|annual|semi|dividend|income)/i.test(freq)) return 'Distribuční';
  return 'Neuvedeno';
};
const replLabel = (r: string | null) => { const s = (r || '').toLowerCase(); if (s.includes('synth') || s.includes('swap')) return 'Syntetická (swap)'; if (s) return 'Fyzická'; return '—'; };
const DOM: Record<string, string> = { Ireland: 'Irsko', Luxembourg: 'Lucembursko', Germany: 'Německo', France: 'Francie', Netherlands: 'Nizozemsko', Switzerland: 'Švýcarsko', 'United Kingdom': 'Spojené království' };
const dom = (d: string | null) => (d ? DOM[d] ?? d : '—');

const age = (inc: string | null) => {
  if (!inc) return '—';
  const d = new Date(inc); if (Number.isNaN(d.getTime())) return '—';
  const y = (Date.now() - d.getTime()) / (365.25 * 864e5);
  return y < 1 ? '< 1 rok' : `${Math.floor(y)} let`;
};

/* Barevná procentní buňka pro výnos (zelená = kladný, červená = záporný – nic jiného). */
function Perf({ v }: { v: number | null }) {
  if (v == null) return <span className="text-slate-400">—</span>;
  return <span className={`tabular-nums font-medium ${v >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(v)}</span>;
}

/* Váhy (pozice / sektory / země) jednoho fondu. */
function vahy(e: ComparisonETF, prefix: string, n: number) {
  const r = raw(e);
  const items: { name: string; w: number | null }[] = [];
  for (let i = 1; i <= n; i++) {
    const name = str(r[`${prefix}_${i}_name`]);
    if (!name) continue;
    items.push({ name, w: num(r[`${prefix}_${i}_weight`]) });
  }
  return items;
}

function WeightList({ e, prefix, n }: { e: ComparisonETF; prefix: string; n: number }) {
  const items = vahy(e, prefix, n);
  if (!items.length) return <span className="text-slate-400">—</span>;
  return (
    <ul className="space-y-1">
      {items.map((it, i) => (
        <li key={i} className="flex items-center justify-between gap-2 text-xs">
          <span className="truncate text-slate-700">{prefix === 'country' ? ceskaZeme(it.name) : prefix === 'sector' ? ceskySektor(it.name) : it.name}</span>
          {it.w != null && <span className="shrink-0 tabular-nums text-slate-500">{pct1(it.w)}</span>}
        </li>
      ))}
    </ul>
  );
}

/* `omit` = řádek, pro který nemá ANI JEDEN porovnávaný fond hodnotu. Takový řádek se nevykresluje:
   sloupec plný pomlček nevypadá jako chybějící údaj, ale jako rozbitý nástroj. */
type Row = { label: string; cell: (e: ComparisonETF) => React.ReactNode; best?: (e: ComparisonETF) => boolean; top?: boolean; omit?: boolean };
type Section = { title: string; rows: Row[] };

/* Nejlepší hodnota v řádku: ✓ a tučně, NE zelenou – zelená už znamená kladný výnos (revize 18. 10. 2026). */
function Bunka({ children, vitez }: { children: React.ReactNode; vitez: boolean }) {
  if (!vitez) return <>{children}</>;
  return (
    <span className="inline-flex items-center gap-1 font-bold text-slate-900">
      {children}
      <Check className="w-3.5 h-3.5 shrink-0 text-teal-700" aria-label="nejlepší v řádku" />
    </span>
  );
}

export default function PorovnaniTable({ etfs, rokDat }: { etfs: ComparisonETF[]; rokDat: number }) {
  const [cur] = useCurrency();
  const ret = (e: ComparisonETF, period: string) => pickReturn(raw(e), period, cur);

  const extrem = (f: (e: ComparisonETF) => number | null, smer: 1 | -1) => {
    const v = etfs.map(f).filter((x): x is number => x != null);
    return v.length ? (smer === 1 ? Math.max(...v) : Math.min(...v)) : null;
  };
  const bestLowTer = extrem((e) => num(e.ter_numeric), -1);
  const bestSize = extrem((e) => num(e.fund_size_numeric), 1);
  const bestDiv = extrem((e) => num(e.current_dividend_yield_numeric), 1);

  const perf = (period: string, label: string, best?: boolean): Row => {
    const b = best ? extrem((e) => ret(e, period), 1) : null;
    return {
      label, cell: (e) => <Perf v={ret(e, period)} />,
      best: b != null ? (e) => ret(e, period) === b : undefined,
      omit: etfs.every((e) => ret(e, period) == null),
    };
  };
  /* Krátká období (1M/3M/6M) máme JEN v eurech (ZAMERNA-ROZHODNUTI.md) → vždy EUR a tak i popsané,
     nezávisle na přepínači měny. Dřív se pod nadpisem „Výkonnost (Kč)“ ukazovala eurová čísla. */
  const perfEur = (period: string, label: string): Row => ({
    label, cell: (e) => <Perf v={num(raw(e)[`return_${period}`])} />,
    omit: etfs.every((e) => num(raw(e)[`return_${period}`]) == null),
  });
  const riskRow = (label: string, key: string, suffix = ' %'): Row => ({
    label, cell: (e) => { const v = num(raw(e)[key]); return v == null ? <span className="text-slate-400">—</span> : <span className="tabular-nums text-slate-700">{v.toLocaleString('cs-CZ', suffix ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{suffix}</span>; },
    omit: etfs.every((e) => num(raw(e)[key]) == null),
  });
  const vahyRow = (label: string, prefix: string, n: number): Row => ({
    label, top: true, cell: (e) => <WeightList e={e} prefix={prefix} n={n} />,
    omit: etfs.every((e) => vahy(e, prefix, n).length === 0),
  });
  const roky = [rokDat - 1, rokDat - 2, rokDat - 3, rokDat - 4, rokDat - 5].map(String);

  const sections: Section[] = [
    {
      title: 'Základní informace',
      rows: [
        { label: 'Ticker', cell: (e) => <span className="font-semibold text-slate-800">{platnyTicker(e.primary_ticker) ?? '—'}</span> },
        /* ISIN je jediný identifikátor, podle kterého se zadává pokyn u brokera –
           musí být vidět vždy, i když má fond ticker. */
        { label: 'ISIN', cell: (e) => <span className="font-mono text-xs text-slate-700">{e.isin}</span> },
        { label: 'Poskytovatel', cell: (e) => str(e.fund_provider) ?? '—' },
        // Index: čistý údaj ze zdroje, jinak poznaný z názvu fondu (SPYI → MSCI ACWI IMI), jinak „—“.
        { label: 'Sledovaný index', cell: (e) => indexFonduLabel({ index_name: e.index_name, name: e.name, investment_focus: str(raw(e).investment_focus) }) ?? '—' },
        { label: 'Zaměření', cell: (e) => ceskeZamereni(str(raw(e).investment_focus) ?? str(e.region)) || '—' },
        { label: 'Typ výplaty', cell: (e) => distTypeLabel(e.distribution_policy, e.distribution_frequency) },
        { label: 'Replikace', cell: (e) => replLabel(e.replication) },
        { label: 'Domicil', cell: (e) => dom(e.fund_domicile) },
        { label: 'Právní struktura', cell: (e) => str(raw(e).legal_structure) ?? '—' },
        { label: 'Měna fondu', cell: (e) => str(e.fund_currency) ?? '—' },
      ],
    },
    {
      title: 'Poplatky a velikost',
      rows: [
        { label: 'Roční poplatek (TER)', cell: (e) => ter(num(e.ter_numeric)), best: (e) => bestLowTer != null && num(e.ter_numeric) === bestLowTer },
        { label: 'Velikost fondu', cell: (e) => money(num(e.fund_size_numeric)), best: (e) => bestSize != null && num(e.fund_size_numeric) === bestSize },
        { label: 'Počet pozic ve fondu', cell: (e) => e.total_holdings != null ? e.total_holdings.toLocaleString('cs-CZ') : '—' },
        { label: 'Stáří fondu', cell: (e) => age(e.inception_date) },
      ],
    },
    {
      title: `Výkonnost (${curLabel[cur]})`,
      rows: [
        perf('ytd', 'Od začátku roku'),
        perf('1y', '1 rok', true),
        perf('3y', '3 roky celkem', true),
        perf('5y', '5 let celkem', true),
      ],
    },
    { title: `Výkonnost po letech (${curLabel[cur]})`, rows: roky.map((y) => perf(y, `Rok ${y}`)) },
    { title: 'Krátkodobá výkonnost (v EUR)', rows: [perfEur('1m', '1 měsíc'), perfEur('3m', '3 měsíce'), perfEur('6m', '6 měsíců')] },
    {
      title: 'Riziko a kolísavost (počítáno v EUR)',
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
        { label: 'Dividendový výnos', cell: (e) => pct1(num(e.current_dividend_yield_numeric)), best: (e) => bestDiv != null && bestDiv > 0 && num(e.current_dividend_yield_numeric) === bestDiv },
        { label: 'Politika výplaty', cell: (e) => { const t = distTypeLabel(e.distribution_policy, e.distribution_frequency); return t === 'Akumulační' ? 'Reinvestuje (ACC)' : t === 'Distribuční' ? 'Vyplácí (DIST)' : 'Neuvedeno'; } },
      ],
    },
    { title: 'Největší pozice (top 10)', rows: [vahyRow('Držené firmy', 'holding', 10)] },
    { title: 'Sektory', rows: [vahyRow('Rozložení sektorů', 'sector', 5)] },
    { title: 'Země', rows: [vahyRow('Geografické rozložení', 'country', 5)] },
  ];

  /* Vyhodit prázdné řádky a sekce, které tím zůstaly bez obsahu – a říct to JEDNOU poznámkou
     (dřív u komodit 9× „Data nejsou k dispozici“). */
  const visibleSections = sections
    .map((s) => ({ ...s, rows: s.rows.filter((r) => !r.omit) }))
    .filter((s) => s.rows.length > 0);
  const vynechane = sections
    .filter((s) => !visibleSections.some((v) => v.title === s.title))
    .map((s) => s.title.replace(/ \(.*\)$/, '').toLowerCase());

  const colW = etfs.length + 1;
  const vitez = (r: Row, e: ComparisonETF) => !!r.best?.(e) && etfs.filter((x) => r.best!(x)).length === 1;

  return (
    <>
      {/* DESKTOP: tabulka vedle sebe */}
      <div className="hidden md:block rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full min-w-[44rem] text-sm table-fixed">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="w-[12.5rem] py-3 px-4 text-left align-bottom text-xs font-medium uppercase tracking-wide text-slate-400 bg-slate-50">Parametr</th>
              {etfs.map((e) => (
                <th key={e.isin} className="py-3 px-4 text-left align-top bg-slate-50">
                  <div className="flex items-start gap-2">
                    <EmitentLogo nazev={e.name} size={24} className="mt-0.5" />
                    <div className="min-w-0">
                      <Link href={`/etf/${e.isin}`} title={e.name} className="line-clamp-2 font-semibold text-slate-900 hover:text-teal-700 leading-snug">{e.name}</Link>
                      <span className="text-xs text-slate-500 font-normal">{platnyTicker(e.primary_ticker) ?? e.isin}</span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleSections.map((sec) => (
              <React.Fragment key={sec.title}>
                <tr>
                  <td colSpan={colW} className="bg-slate-100/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{sec.title}</td>
                </tr>
                {sec.rows.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100 align-top">
                    <td className="py-2.5 px-4 text-slate-500 font-medium">{r.label}</td>
                    {etfs.map((e) => (
                      <td key={e.isin} className={`py-2.5 px-4 text-slate-800 ${r.top ? '' : 'tabular-nums'}`}><Bunka vitez={vitez(r, e)}>{r.cell(e)}</Bunka></td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBIL: stack po parametrech (tabulka vedle sebe je na telefon moc široká) */}
      <div className="md:hidden space-y-4">
        <div className="grid gap-2 sticky top-14 z-10 bg-slate-50 py-2" style={{ gridTemplateColumns: `repeat(${etfs.length}, minmax(0,1fr))` }}>
          {etfs.map((e) => (
            <Link key={e.isin} href={`/etf/${e.isin}`} className="rounded-lg bg-white border border-slate-200 p-2 text-center">
              <span className="block text-sm font-semibold text-teal-700 leading-tight">{platnyTicker(e.primary_ticker) ?? e.isin.slice(0, 6)}</span>
              <span className="block text-[11px] text-slate-500 truncate">{e.name}</span>
            </Link>
          ))}
        </div>
        {visibleSections.map((sec) => (
          <div key={sec.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{sec.title}</h3>
            <div className="space-y-2">
              {sec.rows.map((r, i) => (
                <div key={i} className="rounded-lg border border-slate-100 bg-white p-2.5">
                  <p className="text-xs text-slate-500 mb-1.5">{r.label}</p>
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${etfs.length}, minmax(0,1fr))` }}>
                    {etfs.map((e) => (
                      <div key={e.isin} className={`min-w-0 text-sm text-slate-800 ${r.top ? '' : 'tabular-nums'}`}><Bunka vitez={vitez(r, e)}>{r.cell(e)}</Bunka></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        <Check className="inline w-3.5 h-3.5 -mt-0.5 text-teal-700" aria-hidden="true" /> = nejlepší hodnota v řádku (při shodě se neoznačuje).
        {vynechane.length > 0 && <> Vynechali jsme sekce {vynechane.join(', ')} – pro tyto fondy data nemáme (u komodit a krypta složení fondu nedává smysl).</>}
      </p>
    </>
  );
}
