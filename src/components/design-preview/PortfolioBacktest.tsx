'use client';

import { useEffect, useMemo, useState } from 'react';
import { Info, TrendingUp, AlertTriangle } from 'lucide-react';
import { useCurrency, curLabel, type Currency } from '@/components/design-preview/currencyStore';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import type { BacktestConfig, BacktestItem } from '@/components/design-preview/portfolioData';
import { BACKTEST_BENCHMARK } from '@/components/design-preview/portfolioData';

/* Historická výkonnost modelového portfolia postavená na REÁLNÝCH denních datech
   (engine src/lib/backtest, /api/backtest/simulate). Ukazuje dlouhodobý vývoj,
   klíčové metriky (CAGR, kolísavost, max. pokles, nejlepší/nejhorší rok) a chování
   v krizích (2008, 2020, 2022) proti čistě akciovému portfoliu – jako u dobrého poradce. */

interface EvoPoint { date: string; value: number }
interface AnnualRet { year: number; return: number }
interface Drawdown { depth: number; lengthMonths: number; recovered: boolean; troughDate: string }
interface Result {
  summary: { cagr: number; standardDeviation: number; netAssetValue: number; amountInvested: number };
  returns: { annualReturns: AnnualRet[]; positiveYears: number; totalYears: number };
  risk: { maxDrawdown: Drawdown };
  evolution: EvoPoint[];
}

const INITIAL: Record<Currency, number> = { CZK: 100000, EUR: 4000, USD: 4500 };

const pctD = (v: number | null | undefined, digits = 1) =>
  v == null ? '—' : `${v >= 0 ? '+' : ''}${(v * 100).toLocaleString('cs-CZ', { minimumFractionDigits: digits, maximumFractionDigits: digits })} %`;

const money = (v: number, cur: Currency) => {
  const sym = cur === 'CZK' ? ' Kč' : cur === 'EUR' ? ' €' : ' $';
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} mil.${sym}`;
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1000).toLocaleString('cs-CZ')} tis.${sym}`;
  return `${Math.round(v).toLocaleString('cs-CZ')}${sym}`;
};

async function fetchBacktest(items: BacktestItem[], start: string, cur: Currency): Promise<Result | null> {
  const body = {
    portfolio: items.map((i) => ({ isin: i.indexCode, name: i.indexCode, weight: i.weight, ter: i.ter, indexCode: i.indexCode })),
    startDate: start,
    endDate: new Date().toISOString().split('T')[0],
    initialAmount: INITIAL[cur],
    rebalancingStrategy: 'yearly',
    currency: cur,
  };
  try {
    const res = await fetch('/api/backtest/simulate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) return null;
    return (await res.json()) as Result;
  } catch {
    return null;
  }
}

/* Krize, které chceme jednoznačně ukázat. 2008 je pouze 2. pololetí (data od 07/2008),
   což ale výborně zachycuje pád po pádu Lehman Brothers. */
const CRISES: { year: number; label: string; note: string }[] = [
  { year: 2008, label: 'Finanční krize 2008', note: 'druhé pololetí – pád po krachu Lehman Brothers' },
  { year: 2020, label: 'Covid 2020', note: 'celý rok – propad na jaře a rychlé zotavení' },
  { year: 2022, label: 'Rok 2022', note: 'současný pokles akcií i dluhopisů (inflace, sazby)' },
];

function LineChart({ portfolio, bench, cur }: { portfolio: EvoPoint[]; bench: EvoPoint[]; cur: Currency }) {
  const W = 720, H = 260, padL = 8, padR = 8, padT = 12, padB = 22;
  const sample = (arr: EvoPoint[], n = 160) => {
    if (arr.length <= n) return arr;
    const step = (arr.length - 1) / (n - 1);
    return Array.from({ length: n }, (_, i) => arr[Math.round(i * step)]);
  };
  const p = sample(portfolio), b = sample(bench);
  const all = [...p, ...b];
  if (!all.length) return null;
  const min = Math.min(...all.map((d) => d.value));
  const max = Math.max(...all.map((d) => d.value));
  const t0 = new Date(p[0].date).getTime();
  const t1 = new Date(p[p.length - 1].date).getTime();
  const x = (iso: string) => padL + ((new Date(iso).getTime() - t0) / (t1 - t0)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - min) / (max - min || 1)) * (H - padT - padB);
  const path = (arr: EvoPoint[]) => arr.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(d.date).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const years = Array.from(new Set(p.map((d) => new Date(d.date).getFullYear()))).filter((_, i, a) => i % Math.ceil(a.length / 7) === 0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Vývoj hodnoty portfolia">
      {years.map((yr) => {
        const xx = x(`${yr}-01-01`);
        return <text key={yr} x={xx} y={H - 6} fontSize="11" fill="#94a3b8" textAnchor="middle">{yr}</text>;
      })}
      <path d={path(b)} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d={path(p)} fill="none" stroke="#0f766e" strokeWidth="2.25" />
      <circle cx={x(p[p.length - 1].date)} cy={y(p[p.length - 1].value)} r="3.5" fill="#0f766e" />
    </svg>
  );
}

const dec1 = (v: number) => v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/* Klouzavé (rolling) výnosy – nejlepší/nejhorší roční zhodnocení přes VŠECHNA
   N‑letá okna v období. Ukazuje konzistenci: „ať jste nastoupili kdykoli,
   při N‑letém držení jste ročně vydělali X–Y %." Nejpřesvědčivější, když je min > 0. */
function rollingAnnualized(evo: EvoPoint[], windowYears: number): { min: number; max: number } | null {
  const monthly: EvoPoint[] = [];
  let lastKey = '';
  for (const p of evo) {
    const key = p.date.slice(0, 7);
    if (key !== lastKey) { monthly.push(p); lastKey = key; }
  }
  const ms = windowYears * 12;
  if (monthly.length <= ms) return null;
  let min = Infinity, max = -Infinity;
  for (let i = 0; i + ms < monthly.length; i++) {
    const a = monthly[i].value, b = monthly[i + ms].value;
    if (a <= 0) continue;
    const ann = Math.pow(b / a, 1 / windowYears) - 1;
    if (ann < min) min = ann;
    if (ann > max) max = ann;
  }
  return Number.isFinite(min) ? { min, max } : null;
}

/* Divergující sloupcový graf ročních výnosů: kladné nahoru, záporné dolů od nulové
   osy. Poloviny jsou flex-1 uvnitř kontejneru s pevnou výškou, takže % výšky sloupců
   spolehlivě fungují (dřív se počítaly vůči rodiči bez výšky → sloupce mizely). */
function AnnualBars({ data }: { data: AnnualRet[] }) {
  if (!data.length) return null;
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.return)), 0.01);
  return (
    <div className="flex items-stretch gap-1 h-56" role="img" aria-label="Roční výnosy">
      {data.map((d) => {
        const h = (Math.abs(d.return) / maxAbs) * 82; // necháme ~18 % na popisek
        const pos = d.return >= 0;
        return (
          <div key={d.year} className="flex-1 flex flex-col min-w-0" title={`${d.year}: ${pctD(d.return)}`}>
            {/* horní polovina – kladné roky */}
            <div className="flex-1 flex flex-col justify-end items-center gap-0.5">
              {pos && <span className="text-[9px] tabular-nums text-emerald-600 leading-none">{dec1(d.return * 100)}</span>}
              {pos && <div className="w-full rounded-t-sm bg-emerald-500" style={{ height: `${h}%` }} />}
            </div>
            {/* nulová osa */}
            <div className="h-px bg-slate-300" />
            {/* dolní polovina – záporné roky */}
            <div className="flex-1 flex flex-col justify-start items-center gap-0.5">
              {!pos && <div className="w-full rounded-b-sm bg-red-400" style={{ height: `${h}%` }} />}
              {!pos && <span className="text-[9px] tabular-nums text-red-500 leading-none">{dec1(d.return * 100)}</span>}
            </div>
            <span className="text-[9px] text-slate-400 mt-1 text-center leading-none">{`'${String(d.year).slice(2)}`}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function PortfolioBacktest({ config, portfolioName }: { config: BacktestConfig; portfolioName: string }) {
  const [cur] = useCurrency();
  const [pf, setPf] = useState<Result | null>(null);
  const [bench, setBench] = useState<Result | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    let alive = true;
    setState('loading');
    Promise.all([
      fetchBacktest(config.items, config.start, cur),
      fetchBacktest([BACKTEST_BENCHMARK], config.start, cur),
    ]).then(([p, b]) => {
      if (!alive) return;
      if (p && b) { setPf(p); setBench(b); setState('ok'); }
      else setState('error');
    });
    return () => { alive = false; };
  }, [config, cur]);

  const startYear = useMemo(() => new Date(config.start).getFullYear(), [config.start]);
  const annualByYearBench = useMemo(() => {
    const m = new Map<number, number>();
    bench?.returns.annualReturns.forEach((r) => m.set(r.year, r.return));
    return m;
  }, [bench]);

  if (state === 'error') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Historická data se teď nepodařilo načíst. Zkuste to prosím za chvíli.
      </div>
    );
  }
  if (state === 'loading' || !pf || !bench) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="h-5 w-40 bg-slate-100 rounded animate-pulse mb-4" />
        <div className="h-56 bg-slate-50 rounded-lg animate-pulse" />
      </div>
    );
  }

  const s = pf.summary;
  const dd = pf.risk.maxDrawdown;
  const best = [...pf.returns.annualReturns].sort((a, b) => b.return - a.return)[0];
  const worst = [...pf.returns.annualReturns].sort((a, b) => a.return - b.return)[0];
  const years = pf.returns.totalYears || pf.returns.annualReturns.length;

  // Roční kolísavost počítáme přímo z ročních výnosů (srozumitelné a v souladu se
  // sloupci níže) – engine vrací stdev na jiné bázi, která laika mate.
  const rets = pf.returns.annualReturns.map((r) => r.return);
  const meanRet = rets.reduce((a, b) => a + b, 0) / (rets.length || 1);
  const annualVol = Math.sqrt(rets.reduce((a, b) => a + (b - meanRet) ** 2, 0) / (rets.length || 1));

  const tiles = [
    { label: 'Zhodnocení p.a.', value: pctD(s.cagr), tone: s.cagr >= 0 ? 'pos' : 'neg', sub: 'průměrně ročně (CAGR)' },
    { label: 'Kolísavost', value: `± ${dec1(annualVol * 100)} %`, tone: 'neutral', sub: 'roční – míra výkyvů' },
    { label: 'Nejhlubší propad', value: pctD(dd.depth), tone: 'neg', sub: dd.recovered ? `zotaveno za ${dd.lengthMonths} měs.` : 'zatím nezotaveno' },
    { label: 'Nejlepší rok', value: pctD(best?.return), tone: 'pos', sub: best ? String(best.year) : '' },
    { label: 'Nejhorší rok', value: pctD(worst?.return), tone: 'neg', sub: worst ? String(worst.year) : '' },
    { label: 'Kladných let', value: `${pf.returns.positiveYears}/${years}`, tone: 'neutral', sub: 'let v plusu' },
  ];

  // Klouzavé 5leté výnosy (konzistence) + poradenský souhrn.
  const roll5 = rollingAnnualized(pf.evolution, 5);
  const benchDD = bench.risk.maxDrawdown.depth;
  const takeaway = (() => {
    const parts: string[] = [];
    parts.push(`Za ${years} let rostlo portfolio tempem ${pctD(s.cagr)} ročně – ze ${money(INITIAL[cur], cur)} by dnes bylo ${money(s.netAssetValue, cur)}.`);
    if (roll5) {
      parts.push(
        `Ať jste nastoupili kdykoli, při libovolném pětiletém držení jste ročně vydělali ${pctD(roll5.min)} až ${pctD(roll5.max)}` +
        (roll5.min > 0 ? ' – tedy ani v nejhorším pětiletém okně jste neprodělali.' : '.')
      );
    }
    if (dd.depth != null && benchDD != null) {
      const shallower = dd.depth > benchDD + 0.03; // méně hluboký propad (depth je záporný)
      parts.push(
        `Nejhlubší propad byl ${pctD(dd.depth)}${dd.recovered ? ` a trvalo ${dd.lengthMonths} měsíců, než se vrátil na původní hodnotu` : ''} – ` +
        (shallower ? `mělčí než u čistě akciového portfolia (${pctD(benchDD)}), to je odměna za diverzifikaci.` : `srovnatelný s čistě akciovým portfoliem (${pctD(benchDD)}).`)
      );
    }
    return parts.join(' ');
  })();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 max-w-2xl">
          Reálný průběh na denních datech od {startYear} (rebalancováno jednou ročně). Srovnáváme se 100% globálními akciemi.
        </p>
        <CurrencyToggle size="sm" />
      </div>

      {/* Growth chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Kolik by vydělalo {money(INITIAL[cur], cur)}</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-0.5 bg-teal-700 rounded" />{portfolioName}: <span className="font-semibold text-slate-900">{money(s.netAssetValue, cur)}</span></span>
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-400 rounded" style={{ borderTop: '1px dashed' }} />Čisté akcie: <span className="font-medium text-slate-700">{money(bench.summary.netAssetValue, cur)}</span></span>
          </div>
        </div>
        <LineChart portfolio={pf.evolution} bench={bench.evolution} cur={cur} />
      </div>

      {/* Metric tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">{t.label}</p>
            <p className={`mt-1 text-xl font-bold tabular-nums ${t.tone === 'pos' ? 'text-emerald-600' : t.tone === 'neg' ? 'text-red-600' : 'text-slate-900'}`}>{t.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{t.sub}</p>
          </div>
        ))}
      </div>

      {/* Poradenský souhrn – „co si z toho vzít" */}
      <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-5">
        <div className="flex items-center gap-2 mb-1.5">
          <TrendingUp className="w-4 h-4 text-teal-700" />
          <h3 className="text-sm font-semibold text-teal-900">Co si z toho vzít</h3>
        </div>
        <p className="text-sm text-teal-900/85 leading-relaxed">{takeaway}</p>
      </div>

      {/* Annual returns */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Výnos rok po roce ({curLabel[cur]})</h3>
          {roll5 && (
            <span className="text-xs text-slate-500">
              Klouzavý 5letý výnos: <span className="font-medium text-slate-700 tabular-nums">{pctD(roll5.min)} až {pctD(roll5.max)}</span> ročně
            </span>
          )}
        </div>
        <AnnualBars data={pf.returns.annualReturns} />
      </div>

      {/* Crisis behaviour */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-900">Jak si vedlo v krizích</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Nejdůležitější test každého portfolia – co se dělo, když trhy padaly. Srovnání s čistě akciovým portfoliem.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-100">
                <th className="text-left font-medium py-2 pr-3">Období</th>
                <th className="text-right font-medium py-2 px-3">{portfolioName}</th>
                <th className="text-right font-medium py-2 pl-3">Čisté akcie</th>
              </tr>
            </thead>
            <tbody>
              {CRISES.filter((c) => c.year >= startYear).map((c) => {
                const p = pf.returns.annualReturns.find((r) => r.year === c.year)?.return ?? null;
                const bch = annualByYearBench.get(c.year) ?? null;
                return (
                  <tr key={c.year} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-3">
                      <span className="font-medium text-slate-800">{c.label}</span>
                      <span className="block text-[11px] text-slate-400">{c.note}</span>
                    </td>
                    <td className={`py-2.5 px-3 text-right tabular-nums font-semibold ${(p ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pctD(p)}</td>
                    <td className={`py-2.5 pl-3 text-right tabular-nums ${(bch ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pctD(bch)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="flex items-start gap-1.5 text-xs text-slate-400 leading-relaxed">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>
          Backtest na reálných denních datech indexů (přepočet do {curLabel[cur]} kurzem ČNB), rebalancováno ročně, po odečtení TER fondů.
          Historická výkonnost nezaručuje budoucí výnosy.{config.proxyNote ? ` ${config.proxyNote}` : ''}
        </span>
      </p>
    </div>
  );
}
