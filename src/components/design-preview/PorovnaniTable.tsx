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
import InfoTip from '@/components/design-preview/InfoTip';
import { detectHedging } from '@/utils/hedgingDetection';
import { barvaFondu } from '@/lib/barvyFondu';

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
/* Replikace: zdroj rozlišuje jen „Physical“, „Synthetic“ a „Synthetic (Unfunded swap)“ (ověřeno nad celou DB
   18. 10. 2026) – plnou replikaci od výběru vzorku (sampling) data neuvádějí, proto ji nevymýšlíme. */
const replLabel = (r: string | null) => {
  const s = (r || '').toLowerCase();
  if (s.includes('unfunded')) return 'Syntetická (unfunded swap)';
  if (s.includes('synth') || s.includes('swap')) return 'Syntetická (swap)';
  if (s) return 'Fyzická';
  return '—';
};
/* Krátký název (bez „UCITS ETF…“) – stejně jako srovnávač a žebříčky; celý název je v title. */
const kratkyNazev = (n: string) => n.replace(/\s+UCITS\b.*$/i, '').replace(/\s+\([^()]*\)\s*$/, '').trim() || n;

/* Burzy a tickery fondu (exchange_1…10). Pomlčka místo tickeru = burza bez tickeru ve zdroji → vynechat.
   XETRA první (tam nakupuje většina českých brokerů), pak podle pořadí ve zdroji; duplicity pryč. */
function burzy(e: ComparisonETF): { burza: string; ticker: string; mena: string | null }[] {
  const r = raw(e);
  const out: { burza: string; ticker: string; mena: string | null }[] = [];
  for (let i = 1; i <= 10; i++) {
    const burza = str(r[`exchange_${i}_name`]);
    const ticker = platnyTicker(str(r[`exchange_${i}_ticker`]));
    if (!burza || !ticker) continue;
    const mena = str(r[`exchange_${i}_currency`]);
    if (!out.some((x) => x.burza === burza && x.ticker === ticker && x.mena === mena)) out.push({ burza, ticker, mena });
  }
  return out.sort((a, b) => Number(/xetra/i.test(b.burza)) - Number(/xetra/i.test(a.burza)));
}
const BURZA_CS: Record<string, string> = { 'London Stock Exchange': 'Londýn', 'SIX Swiss Exchange': 'SIX (Švýcarsko)', 'Borsa Italiana': 'Milán', 'Euronext Amsterdam': 'Amsterdam', 'Euronext Paris': 'Paříž', 'Stuttgart Stock Exchange': 'Stuttgart', 'Bolsa Mexicana de Valores': 'Mexiko' };
function Burzy({ e }: { e: ComparisonETF }) {
  // Seskupeno podle tickeru a měny („VWCE · EUR: XETRA, gettex, Milán…“) – dřív 10 řádků na fond.
  const skupiny = new Map<string, { ticker: string; mena: string | null; burzy: string[] }>();
  for (const x of burzy(e)) {
    const k = `${x.ticker}|${x.mena ?? ''}`;
    const g = skupiny.get(k) ?? { ticker: x.ticker, mena: x.mena, burzy: [] };
    g.burzy.push(BURZA_CS[x.burza] ?? x.burza);
    skupiny.set(k, g);
  }
  const vse = [...skupiny.values()];
  if (!vse.length) return <span className="text-slate-400">—</span>;
  const ukaz = vse.slice(0, 4);
  return (
    <ul className="space-y-1 text-xs">
      {ukaz.map((g) => (
        <li key={`${g.ticker}${g.mena}`} className="leading-snug">
          <span className="font-semibold text-slate-800">{g.ticker}</span>{g.mena && <span className="text-slate-500"> · {g.mena}</span>}
          <span className="block text-slate-500">{g.burzy.join(', ')}</span>
        </li>
      ))}
      {vse.length > ukaz.length && <li className="text-slate-400">+ další {vse.length - ukaz.length}</li>}
    </ul>
  );
}

/* Top 10 pozic: scraper do 18. 10. 2026 zahazoval 1. řádek (u S&P 500 chyběla NVIDIA) – stejná pojistka
   jako detail fondu (pozicNeuplne v src/app/etf/[isin]/page.tsx): 9 pozic u fondu s víc než 9 tituly =
   neúplný seznam → neukazovat jako „největší pozice“. Pravidlo č. 1. */
const poziceNeuplne = (e: ComparisonETF) => vahy(e, 'holding', 10).length === 9 && (e.total_holdings ?? 0) > 9;
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

const nazevVahy = (prefix: string, name: string) => (prefix === 'country' ? ceskaZeme(name) : prefix === 'sector' ? ceskySektor(name) : name);

function WeightList({ e, prefix, n }: { e: ComparisonETF; prefix: string; n: number }) {
  if (prefix === 'holding' && poziceNeuplne(e)) return <span className="text-xs text-slate-500">Dočasně neuvádíme – ve zdroji chybí největší pozice. Doplní se s další aktualizací.</span>;
  const items = vahy(e, prefix, n);
  if (!items.length) return <span className="text-slate-400">—</span>;
  return (
    <ul className="space-y-1">
      {items.map((it, i) => (
        <li key={i} className="flex items-center justify-between gap-2 text-xs">
          <span className="truncate text-slate-700" title={nazevVahy(prefix, it.name)}>{nazevVahy(prefix, it.name)}</span>
          {it.w != null && <span className="shrink-0 tabular-nums text-slate-500">{pct1(it.w)}</span>}
        </li>
      ))}
    </ul>
  );
}

/* `omit` = řádek, pro který nemá ANI JEDEN porovnávaný fond hodnotu. Takový řádek se nevykresluje:
   sloupec plný pomlček nevypadá jako chybějící údaj, ale jako rozbitý nástroj. */
type Row = { label: React.ReactNode; cell: (e: ComparisonETF) => React.ReactNode; best?: (e: ComparisonETF) => boolean; top?: boolean; omit?: boolean;
  /** Mobil: vlastní vykreslení přes celou šířku (místo úzkých sloupců vedle sebe). */
  mobil?: React.ReactNode };

/* MOBIL – váhy otočené: řádek = pozice/sektor/země, sloupce = fondy (revize 18. 10. 2026: tři useknuté seznamy
   vedle sebe se na telefonu nedaly číst). Prázdná buňka = u fondu není mezi uvedenými největšími. */
function VahyOtocene({ etfs, prefix, n }: { etfs: ComparisonETF[]; prefix: string; n: number }) {
  const platne = etfs.map((e) => (prefix === 'holding' && poziceNeuplne(e) ? null : vahy(e, prefix, n)));
  const radky = new Map<string, (number | null | undefined)[]>();
  platne.forEach((items, fi) => items?.forEach((it) => {
    const k = nazevVahy(prefix, it.name);
    const r = radky.get(k) ?? etfs.map(() => undefined);
    r[fi] = it.w;
    radky.set(k, r);
  }));
  const serazene = [...radky].sort((a, b) => Math.max(...b[1].map((x) => x ?? 0)) - Math.max(...a[1].map((x) => x ?? 0)));
  const ostatni = serazene.filter(([k]) => /^ostatn/i.test(k));
  const poradi = [...serazene.filter(([k]) => !/^ostatn/i.test(k)), ...ostatni];
  return (
    <div className="rounded-lg border border-slate-100 bg-white">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-100 text-slate-500">
            <th className="py-1.5 pl-2.5 pr-1 text-left font-medium"><span className="sr-only">Položka</span></th>
            {etfs.map((e, i) => (
              <th key={e.isin} className="py-1.5 px-1.5 text-right font-semibold text-slate-700 whitespace-nowrap">
                <span aria-hidden="true" className="mr-1 inline-block w-2 h-2 rounded-[2px] align-middle" style={{ background: barvaFondu(i) }} />
                {platnyTicker(e.primary_ticker) ?? `${i + 1}.`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {poradi.map(([k, v]) => (
            <tr key={k} className="border-b border-slate-50 last:border-0">
              <td className="py-1.5 pl-2.5 pr-1 text-slate-700 leading-snug">{k}</td>
              {v.map((w, fi) => (
                <td key={fi} className="py-1.5 px-1.5 text-right tabular-nums text-slate-600 whitespace-nowrap">
                  {platne[fi] == null ? <span className="text-slate-300">·</span> : w == null ? '' : pct1(w)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-slate-100 px-2.5 py-1.5 text-[11px] text-slate-400">
        Prázdné = u fondu není mezi {prefix === 'holding' ? '10' : '5'} největšími.
        {platne.some((x) => x == null) && ' „·“ = seznam dočasně neuvádíme (ve zdroji chybí největší pozice).'}
      </p>
    </div>
  );
}
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
    omit: etfs.every((e) => vahy(e, prefix, n).length === 0 || (prefix === 'holding' && poziceNeuplne(e))),
    mobil: <VahyOtocene etfs={etfs} prefix={prefix} n={n} />,
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
        { label: <InfoTip label="Fyzická = fond drží cenné papíry indexu (nebo fyzický kov). Syntetická = výnos indexu dodává protistrana swapem; „unfunded“ = fond drží vlastní koš cenných papírů a jeho výnos za výnos indexu směňuje.">Replikace</InfoTip>, cell: (e) => replLabel(e.replication) },
        { label: <InfoTip label="Zajištěná třída tlumí vliv kurzu (např. USD/EUR) za poplatek – její výnos se proto liší od nezajištěné třídy stejného indexu.">Měnové zajištění</InfoTip>, cell: (e) => { const h = detectHedging(e.name); return h.isHedged ? (h.hedgedCurrency ? `Zajištěno do ${h.hedgedCurrency}` : 'Zajištěno') : 'Nezajištěno'; } },
        { label: 'Domicil', cell: (e) => dom(e.fund_domicile) },
        { label: 'Právní struktura', cell: (e) => str(raw(e).legal_structure) ?? '—' },
        { label: 'Měna fondu', cell: (e) => str(e.fund_currency) ?? '—' },
        { label: <InfoTip label="Stejný fond se obchoduje na více burzách pod různými tickery a v různých měnách – poplatek i výnos fondu jsou stejné. V Česku se nejčastěji kupuje na XETRA.">Burzy a tickery</InfoTip>, top: true, cell: (e) => <Burzy e={e} />, omit: etfs.every((e) => burzy(e).length === 0) },
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
        // Výnos ÷ kolísavost – oba údaje v EUR (justETF „return per risk“; 1 rok: výnos/volatilita, 3 a 5 let: roční výnos/volatilita).
        // Dřív nebyl; výnos v Kč dělený kolísavostí v EUR by byl metodicky nekonzistentní (revize 18. 10. 2026).
        riskRow('Výnos / kolísavost 1 rok', 'return_per_risk_1y', ''),
        riskRow('Výnos / kolísavost 3 roky', 'return_per_risk_3y', ''),
        riskRow('Beta (vs trh)', 'beta', ''),
        riskRow('Tracking error', 'tracking_error'),
      ],
    },
    {
      title: 'Dividendy',
      rows: [
        { label: 'Dividendový výnos', cell: (e) => {
          const d = num(e.current_dividend_yield_numeric);
          // „—“ = údaj chybí. Akumulační fond dividendy nevyplácí → říct to slovy, ne pomlčkou.
          if ((d == null || d === 0) && distTypeLabel(e.distribution_policy, e.distribution_frequency) === 'Akumulační') return <span className="text-slate-500">nevyplácí</span>;
          return pct1(d);
        }, best: (e) => bestDiv != null && bestDiv > 0 && num(e.current_dividend_yield_numeric) === bestDiv },
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
  const poziceChybi = etfs.some(poziceNeuplne);
  const vynechane = sections
    .filter((s) => !visibleSections.some((v) => v.title === s.title))
    .filter((s) => !(poziceChybi && s.title.startsWith('Největší pozice')))
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
                    <EmitentLogo nazev={e.name} size={24} className="mt-0.5" monogram={e.fund_provider ?? e.name} />
                    <div className="min-w-0">
                      <Link href={`/etf/${e.isin}`} title={e.name} className="line-clamp-2 font-semibold text-slate-900 hover:text-teal-700 leading-snug">{kratkyNazev(e.name)}</Link>
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-normal">
                        <span aria-hidden="true" className="inline-block w-2.5 h-2.5 rounded-[3px]" style={{ background: barvaFondu(etfs.indexOf(e)) }} />
                        {platnyTicker(e.primary_ticker) ?? e.isin}
                      </span>
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
            <Link key={e.isin} href={`/etf/${e.isin}`} className="min-w-0 rounded-lg bg-white border border-slate-200 p-2 text-center" style={{ borderTop: `3px solid ${barvaFondu(etfs.indexOf(e))}` }}>
              <span className="block text-sm font-semibold text-slate-900 leading-tight truncate">{platnyTicker(e.primary_ticker) ?? e.isin}</span>
              <span className="block text-[11px] text-slate-500 truncate" title={e.name}>{kratkyNazev(e.name)}</span>
            </Link>
          ))}
        </div>
        {visibleSections.map((sec) => (
          <div key={sec.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{sec.title}</h3>
            {/* Jedna karta na sekci, řádky oddělené linkou (dřív karta na každý řádek = 40 rámečků pod sebou). */}
            <div className={sec.rows.some((r) => r.mobil) ? 'space-y-2' : 'rounded-lg border border-slate-200 bg-white divide-y divide-slate-100'}>
              {sec.rows.map((r, i) => r.mobil ? <div key={i}>{r.mobil}</div> : (
                <div key={i} className="px-2.5 py-2">
                  <p className="text-xs text-slate-500 mb-1">{r.label}</p>
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
        {poziceChybi && <> Největší držené pozice {etfs.every(poziceNeuplne) ? '' : 'u některých fondů '}dočasně neuvádíme – ve zdroji dat chybí ta největší. Doplní se s další aktualizací.</>}
      </p>
    </>
  );
}
