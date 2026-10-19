'use client';

import { useEffect, useMemo, useState } from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useCurrency, curLabel, type Currency } from '@/components/design-preview/currencyStore';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import InfoTip from '@/components/design-preview/InfoTip';
import type { BacktestConfig, BacktestItem } from '@/components/design-preview/portfolioData';
import { BACKTEST_BENCHMARK } from '@/components/design-preview/portfolioData';
import { kulateKroky, fmtOsa } from '@/lib/osyGrafu';

/* Historická výkonnost modelového portfolia na REÁLNÝCH denních datech (stejné jádro jako /backtest).
 *
 * Revize 18. 10. 2026 (kolo 3):
 *  – každé číslo JEDNOU: srovnávací tabulka portfolio × 100 % akcie je jediné místo s ukazateli (dřív stejné
 *    10,5 % čtyřikrát: dlaždice nahoře, tabulka, dlaždice dole, souhrnný text),
 *  – graf ve stejném vizuálním jazyce jako backtest (recharts, kulaté osy osyGrafu.ts, roky na ose X),
 *  – kolísavost = ukazatel backtestu (z měsíčních výnosů), ne směrodatná odchylka ročních výnosů včetně neúplných let,
 *  – neúplné krajní roky (2008 od července, letošek) jsou označené a nesoutěží o nejlepší/nejhorší rok ani kladné roky,
 *  – „✓ klidnější“ jen při kolísavosti nižší o ≥ 1 p. b. A propadu mělčím o ≥ 1 p. b. (Akciové portfolio dřív
 *    tvrdilo klidnější jízdu, ač nemovitosti počítá přes evropské akcie = akcie proti akciím). */

interface EvoPoint { date: string; value: number }
interface AnnualRet { year: number; return: number }
interface Drawdown { depth: number; lengthMonths: number; recovered: boolean; troughDate: string; startDate?: string; endDate?: string | null }
interface Result {
  summary: { cagr: number; standardDeviation: number; netAssetValue: number; amountInvested: number };
  returns: { annualReturns: AnnualRet[]; positiveYears: number; totalYears: number };
  risk: { maxDrawdown: Drawdown };
  evolution: EvoPoint[];
  stressPeriods?: { key: string; name: string; drop: number; recoveryMonths: number | null; troughDate: string }[];
}

const INITIAL: Record<Currency, number> = { CZK: 100000, EUR: 4000, USD: 4500 };

const pctD = (v: number | null | undefined, digits = 1) =>
  v == null || !Number.isFinite(v) ? '—' : `${v >= 0 ? '+' : '−'}${Math.abs(v * 100).toLocaleString('cs-CZ', { minimumFractionDigits: digits, maximumFractionDigits: digits })} %`;
const pct0 = (v: number) => `${(v * 100).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).replace('-', '−')} %`;

const money = (v: number, cur: Currency) => {
  const sym = cur === 'CZK' ? ' Kč' : cur === 'EUR' ? ' €' : ' $';
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} mil.${sym}`;
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1000).toLocaleString('cs-CZ')} tis.${sym}`;
  return `${Math.round(v).toLocaleString('cs-CZ')}${sym}`;
};
const mesRok = (iso: string) => { const d = new Date(iso); return `${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`; };
const den = (iso: string) => new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });
const jednotka = (c: Currency) => (c === 'CZK' ? 'v Kč' : c === 'EUR' ? 'v eurech' : 'v dolarech');

async function fetchBacktest(items: BacktestItem[], start: string, end: string, cur: Currency): Promise<Result | null> {
  const body = {
    portfolio: items.map((i) => ({ isin: i.indexCode, name: i.indexCode, weight: i.weight, ter: i.ter, indexCode: i.indexCode })),
    startDate: start, endDate: end, initialAmount: INITIAL[cur], rebalancingStrategy: 'yearly', currency: cur,
  };
  try {
    const res = await fetch('/api/backtest/simulate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) return null;
    return (await res.json()) as Result;
  } catch {
    return null;
  }
}

/** Roky, které výpočet nepokrývá celé (první začíná v červnu 2008, poslední končí letos). */
function neuplneRoky(evo: EvoPoint[]) {
  const out = new Set<number>();
  if (evo.length < 2) return out;
  const p = new Date(evo[0].date), k = new Date(evo[evo.length - 1].date);
  if (p.getUTCMonth() > 0 || p.getUTCDate() > 7) out.add(p.getUTCFullYear());
  if (!(k.getUTCMonth() === 11 && k.getUTCDate() >= 28)) out.add(k.getUTCFullYear());
  return out;
}

function navrat(d: Drawdown) {
  if (!d.recovered || !d.endDate) return d.recovered ? `návrat za ${d.lengthMonths} měs. od vrcholu` : 'zatím bez návratu';
  const mes = Math.round((Date.parse(d.endDate) - Date.parse(d.troughDate)) / (30.44 * 864e5));
  if (mes < 1) return 'návrat do měsíce';
  if (mes < 18) return `návrat za ${mes} měs.`;
  const r = Math.round(mes / 12);
  return `návrat za ~${r} ${r === 1 ? 'rok' : r < 5 ? 'roky' : 'let'}`;
}

/** Ukazatele z výsledku – CELÉ roky pro nejlepší/nejhorší/kladné. */
function ukazatele(r: Result) {
  const neuplne = neuplneRoky(r.evolution);
  const cele = r.returns.annualReturns.filter((a) => !neuplne.has(a.year));
  const best = cele.length ? cele.reduce((a, b) => (b.return > a.return ? b : a)) : null;
  const worst = cele.length ? cele.reduce((a, b) => (b.return < a.return ? b : a)) : null;
  return { neuplne, cele, best, worst, kladne: cele.filter((a) => a.return > 0).length };
}

const POZNAMKA_KRIZE: Record<string, string> = {
  covid: 'jarní propad 2020',
  bear2022: 'pokles akcií i dluhopisů (inflace, sazby)',
  dotcom: 'splasknutí technologické bubliny',
};

const rokyOsy = (t0: number, t1: number) => {
  const y0 = new Date(t0).getUTCFullYear(), y1 = new Date(t1).getUTCFullYear();
  const span = y1 - y0;
  const krok = span <= 5 ? 1 : span <= 11 ? 2 : 5;
  const out: number[] = [];
  for (let y = Math.ceil(y0 / krok) * krok; y <= y1; y += krok) { const t = Date.UTC(y, 0, 1); if (t >= t0 && t <= t1) out.push(t); }
  return out;
};
const OSA_TICK = { fontSize: 12, fill: '#64748b' } as const;
/* Srovnávací řada = 100 % akcie CELÉHO SVĚTA (fond VT). Název jednoznačně (revize 19. 10. 2026: Dividendové portfolio
   srovnávalo „100 % akcie (S&P 500)“ a 60/40 „100 % akcie (VT)“ – stejný název, jiný index). */
const BENCH = '100\u00a0% akcie světa (VT)';
const BENCH_KRATCE = 'Akcie světa (VT)';

export default function PortfolioBacktest({ config, portfolioName, initialCzk }: {
  config: BacktestConfig; portfolioName: string;
  /** Předpočet v Kč ze serveru (src/lib/backtest/predpocet.ts) – v Kč se pak API nevolá vůbec. */
  initialCzk?: { pf: Result; bench: Result } | null;
}) {
  const [cur] = useCurrency();
  const [pf, setPf] = useState<Result | null>(initialCzk?.pf ?? null);
  const [bench, setBench] = useState<Result | null>(initialCzk?.bench ?? null);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>(initialCzk ? 'ok' : 'loading');
  // Jiná měna = STEJNÉ období jako předpočet (konec dat předpočtu), ať se čísla nemíchají s jiným dnem.
  const konecDat = initialCzk?.pf.evolution[initialCzk.pf.evolution.length - 1]?.date.slice(0, 10) ?? new Date().toISOString().slice(0, 10);

  useEffect(() => {
    let alive = true;
    if (cur === 'CZK' && initialCzk) { setPf(initialCzk.pf); setBench(initialCzk.bench); setState('ok'); return; }
    setState('loading');
    Promise.all([
      fetchBacktest(config.items, config.start, konecDat, cur),
      fetchBacktest([BACKTEST_BENCHMARK], config.start, konecDat, cur),
    ]).then(([p, b]) => {
      if (!alive) return;
      if (p && b) { setPf(p); setBench(b); setState('ok'); }
      else setState('error');
    });
    return () => { alive = false; };
  }, [config, cur, initialCzk, konecDat]);

  const chart = useMemo(() => {
    if (!pf || !bench) return null;
    const bMap = new Map(bench.evolution.map((p) => [p.date.slice(0, 7), p.value]));
    const data = pf.evolution.map((p) => ({ t: Date.parse(p.date), date: p.date, pf: Math.round(p.value), b: bMap.has(p.date.slice(0, 7)) ? Math.round(bMap.get(p.date.slice(0, 7))!) : undefined }));
    const max = data.reduce((m, d) => Math.max(m, d.pf, d.b ?? 0), 0);
    const osa = kulateKroky(max, 0, 4);
    return { data, osa, t0: data[0]?.t ?? 0, t1: data[data.length - 1]?.t ?? 0 };
  }, [pf, bench]);

  if (state === 'error') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Historická data se teď nepodařilo načíst. Zkuste to prosím za chvíli.
      </div>
    );
  }
  if (state === 'loading' || !pf || !bench || !chart) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="h-5 w-40 bg-slate-100 rounded animate-pulse mb-4" />
        <div className="h-56 bg-slate-50 rounded-lg animate-pulse" />
      </div>
    );
  }

  const s = pf.summary, b = bench.summary;
  const dd = pf.risk.maxDrawdown, bdd = bench.risk.maxDrawdown;
  const u = ukazatele(pf), ub = ukazatele(bench);
  const prvni = pf.evolution[0].date, posledni = pf.evolution[pf.evolution.length - 1].date;
  const priblizne = !!config.proxyNote;
  const ap = priblizne ? '≈ ' : '';

  // Práh pro tvrzení „klidnější“: kolísavost o ≥ 1 p. b. nižší A propad o ≥ 1 p. b. mělčí (depth je záporný).
  const nizsiVol = s.standardDeviation <= b.standardDeviation - 0.01;
  const melci = dd.depth >= bdd.depth + 0.01;
  const klidnejsi = nizsiVol && melci;

  // Krize 2008 v tabulce krizí chybí (řada začíná 7/2008, po vrcholu trhu 10/2007). Je největší propad v 2008–09?
  const ddVKrizi2008 = dd.troughDate.slice(0, 7) <= '2009-03' && dd.troughDate.slice(0, 7) >= '2008-07';

  const radky: { label: string; hint?: string; pfV: string; bV: string; badge?: string | null; sub?: string; sub2?: string; bSub?: string }[] = [
    { label: 'Roční zhodnocení', hint: 'průměrně ročně (CAGR)', pfV: `${ap}${pctD(s.cagr)}`, bV: pctD(b.cagr) },
    { label: 'Kolísavost', hint: 'ročně, z měsíčních výnosů', pfV: `${ap}${pct0(s.standardDeviation)}`, bV: pct0(b.standardDeviation), badge: klidnejsi ? 'klidnější' : null },
    // „od vrcholu kdykoli“ bylo nepřesné: data začínají 6/2008, propad od vrcholu 10/2007 by byl hlubší (revize 19. 10. 2026).
    { label: 'Největší propad', hint: `od vrcholu, data od ${mesRok(prvni)}`, pfV: `${ap}${pctD(dd.depth)}`, bV: pctD(bdd.depth), badge: melci ? 'mělčí' : null, sub: `dno ${mesRok(dd.troughDate)}`, sub2: navrat(dd), bSub: `dno ${mesRok(bdd.troughDate)}` },
    { label: 'Nejlepší celý rok', pfV: u.best ? `${ap}${pctD(u.best.return)}` : '—', bV: ub.best ? pctD(ub.best.return) : '—', sub: u.best ? String(u.best.year) : undefined, bSub: ub.best ? String(ub.best.year) : undefined },
    { label: 'Nejhorší celý rok', pfV: u.worst ? `${ap}${pctD(u.worst.return)}` : '—', bV: ub.worst ? pctD(ub.worst.return) : '—', sub: u.worst ? String(u.worst.year) : undefined, bSub: ub.worst ? String(ub.worst.year) : undefined },
    { label: 'Roky v plusu', hint: 'jen celé roky', pfV: `${u.kladne} z ${u.cele.length}`, bV: `${ub.kladne} z ${ub.cele.length}` },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600 max-w-2xl">
          Denní data {mesRok(prvni)} – {den(posledni)}, {jednotka(cur)}, srovnání se 100&nbsp;% akciemi celého světa (fond VT, index FTSE Global All Cap).
          {cur === 'CZK' && (
            <> <InfoTip label={`Výpočet začíná ${den(prvni)}, v létě 2008, kdy byla koruna vůči dolaru nejsilnější v historii (USD/CZK kolem 15; dnes kolem 21). Pozdější oslabení koruny výsledky v Kč zvedá – a v krizi 2008–09 tlumilo propad akcií. Jiný start by vyšel jinak; vlastní období si zvolte v backtestu.`}>
              <span className="text-slate-500">vliv kurzu</span>
            </InfoTip></>
          )}
        </p>
        <CurrencyToggle size="sm" />
      </div>

      {/* Graf vývoje – stejný jazyk jako /backtest */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-sm font-semibold text-slate-900">Kolik by bylo ze {money(INITIAL[cur], cur)} <span className="font-normal text-slate-500">(hodnota {jednotka(cur)})</span></h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><span className="inline-block w-3 h-0.5 bg-teal-600" />{portfolioName}: <span className="font-semibold text-slate-900">{ap}{money(s.netAssetValue, cur)}</span></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><span className="inline-block w-3 border-t border-dashed border-slate-500" />{BENCH}: <span className="font-medium text-slate-800">{money(b.netAssetValue, cur)}</span></span>
          </div>
        </div>
        <div className="mt-3 h-60 md:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart.data} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="pfFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="t" type="number" domain={[chart.t0, chart.t1]} ticks={rokyOsy(chart.t0, chart.t1)} tickFormatter={(t) => String(new Date(t).getUTCFullYear())}
                tick={OSA_TICK} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
              <YAxis width={58} ticks={chart.osa} domain={[0, chart.osa[chart.osa.length - 1]]} tickFormatter={fmtOsa} tick={OSA_TICK} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0].payload as { date: string; pf: number; b?: number };
                  return (
                    <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
                      <div className="font-semibold mb-0.5">{new Date(p.date).toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</div>
                      <div>{portfolioName}: <span className="tabular-nums font-medium">{money(p.pf, cur)}</span></div>
                      {p.b != null && <div className="text-slate-300">{BENCH}: <span className="tabular-nums">{money(p.b, cur)}</span></div>}
                    </div>
                  );
                }}
              />
              <Area type="monotone" dataKey="pf" stroke="#0d9488" strokeWidth={2} fill="url(#pfFill)" isAnimationActive={false} />
              <Line type="monotone" dataKey="b" stroke="#64748b" strokeDasharray="4 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Jediné místo s ukazateli: portfolio × 100 % akcie */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1">
          {portfolioName} proti 100&nbsp;% akciím světa
          {priblizne && <InfoTip label={`≈ = orientační čísla. ${config.proxyNote}`}><span className="sr-only">proč přibližně</span></InfoTip>}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 mb-3">
          {klidnejsi
            ? <>Menší výkyvy i mělčí propad než čisté akcie{s.cagr < b.cagr ? ', za cenu nižšího růstu' : ''}.</>
            : melci || nizsiVol
              ? <>Mírnější je jen {melci ? 'propad' : 'kolísavost'}, druhý ukazatel ne – za klidnější průběh to nepovažujeme.</>
              : <>Kolísavost i propady jsou podobné jako u čistých akcií (rozdíl pod 1 procentní bod).</>}
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-100">
              <th className="text-left font-medium py-2 pr-2"><span className="hidden sm:inline">Za období {mesRok(prvni)} – {mesRok(posledni)}</span><span className="sm:hidden">Od {mesRok(prvni)}</span></th>
              <th className="text-right font-medium py-2 px-2">Toto portfolio</th>
              <th className="text-right font-medium py-2 pl-2">{BENCH_KRATCE}</th>
            </tr>
          </thead>
          <tbody>
            {radky.map((r) => (
              <tr key={r.label} className="border-b border-slate-50 last:border-0 align-top">
                <td className="py-2.5 pr-2">
                  <span className="font-medium text-slate-800">{r.label}</span>
                  {r.hint && <span className="hidden sm:block text-[11px] text-slate-500">{r.hint}</span>}
                </td>
                <td className="py-2.5 px-2 text-right">
                  <span className="tabular-nums font-semibold text-slate-900 whitespace-nowrap">{r.pfV}</span>
                  {r.badge && <span className="ml-1.5 inline-flex rounded-full bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700 whitespace-nowrap">✓ {r.badge}</span>}
                  {r.sub && <span className="block text-[11px] text-slate-500 whitespace-nowrap">{r.sub}</span>}
                  {r.sub2 && <span className="block text-[11px] text-slate-500 whitespace-nowrap">{r.sub2}</span>}
                </td>
                <td className="py-2.5 pl-2 text-right">
                  <span className="tabular-nums text-slate-600 whitespace-nowrap">{r.bV}</span>
                  {r.bSub && <span className="block text-[11px] text-slate-500">{r.bSub}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Roční výnosy – dlaždice jako v backtestu; neúplné roky čárkovaně */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
        <h3 className="text-sm font-semibold text-slate-900">Výnos rok po roce ({curLabel[cur]})</h3>
        <p className="text-xs text-slate-500 mt-0.5 mb-3">
          {u.neuplne.size ? <>Čárkovaně = jen část roku ({[...u.neuplne].sort().map((y) => y === new Date(prvni).getUTCFullYear() ? `${y} od ${mesRok(prvni)}` : `${y} do ${den(posledni)}`).join(', ')}).</> : 'Celé kalendářní roky.'}
        </p>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-1.5 sm:gap-2">
          {pf.returns.annualReturns.map((r) => {
            const pos = r.return >= 0;
            const cast = u.neuplne.has(r.year);
            return (
              <div key={r.year} title={cast ? 'Jen část roku' : undefined}
                className={`rounded-lg border px-1 py-2 text-center ${cast ? 'border-dashed border-slate-300 bg-white' : pos ? 'border-emerald-100 bg-emerald-50/50' : 'border-red-100 bg-red-50/50'}`}>
                <p className="text-xs text-slate-500 tabular-nums">{r.year}{cast ? '*' : ''}</p>
                <p className={`text-[13px] sm:text-sm font-semibold tabular-nums whitespace-nowrap ${pos ? 'text-emerald-700' : 'text-red-600'}`}>{pctD(r.return)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Krize */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
        <h3 className="text-sm font-semibold text-slate-900">Jak si vedlo v krizích</h3>
        <p className="text-xs text-slate-500 mt-0.5 mb-3">
          Propad od vrcholu ke dnu uvnitř okna krize – stejný výpočet jako v backtestu.{' '}
          <InfoTip label={`Finanční krize 2008 v tabulce chybí: data začínají ${mesRok(prvni)}, až po vrcholu trhu (10/2007), takže propad krize celý nezachytí. ${ddVKrizi2008 ? `Největší propad tohoto portfolia (${pctD(dd.depth)}, dno ${mesRok(dd.troughDate)}) proběhl právě v jejím závěru – je v tabulce výše.` : `Největší propad tohoto portfolia (${pctD(dd.depth)}) přišel až v ${mesRok(dd.troughDate)} – je v tabulce výše.`}`}>
            <span className="text-slate-600">Proč chybí rok 2008?</span>
          </InfoTip>
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-100">
              <th className="text-left font-medium py-2 pr-2">Krize</th>
              <th className="text-right font-medium py-2 px-2">Toto portfolio</th>
              <th className="text-right font-medium py-2 pl-2">{BENCH_KRATCE}</th>
            </tr>
          </thead>
          <tbody>
            {(pf.stressPeriods ?? []).map((k) => {
              const bch = bench.stressPeriods?.find((x) => x.key === k.key)?.drop ?? null;
              return (
                <tr key={k.key} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 pr-2">
                    <span className="font-medium text-slate-800">{k.name}</span>
                    <span className="block text-[11px] text-slate-500">{POZNAMKA_KRIZE[k.key] ?? ''}{k.recoveryMonths != null ? (k.recoveryMonths < 1 ? ' · návrat do měsíce' : ` · návrat za ${k.recoveryMonths} měs.`) : ' · zatím bez návratu'}</span>
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums font-semibold text-red-600 whitespace-nowrap">{ap}{pctD(k.drop)}</td>
                  <td className="py-2.5 pl-2 text-right tabular-nums text-red-600 whitespace-nowrap">{pctD(bch)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Backtest na denních cenách fondů (přepočet do {curLabel[cur]} referenčními kurzy ECB), vyvažování jednou ročně, poplatky fondů jsou v cenách, daně a poplatky brokera ne.
        {config.menoveRiziko && <> <InfoTip label={config.menoveRiziko}><span className="text-slate-600">Měnové riziko</span></InfoTip></>}
        {priblizne && <> <InfoTip label={config.proxyNote!}><span className="text-slate-600">≈ orientační</span></InfoTip></>}
      </p>
    </div>
  );
}
