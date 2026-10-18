'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AlertTriangle, Sparkles, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import { kulateKroky, fmtOsa } from '@/lib/osyGrafu';
import { STROJ_PRESETY, slozeniProStart } from '@/lib/strojCasuVypocet';

/**
 * Interaktivní jádro investiční kalkulačky (složené úročení) – redesign.
 * Výpočetní logika je převzata 1:1 z ověřené utility
 * `src/utils/investmentCalculations.ts` (funkce calculateInvestment) a původní
 * komponenty `InvestmentCalculatorContent.tsx`. Měněn je POUZE vizuál
 * (teal/slate, design systém, graf přes recharts). Finanční logiku neměnit.
 */

const fmtCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);


interface YearRow {
  year: number;
  totalInvested: number;
  grossValue: number;
  netValue: number;
  grossGain: number;
  netGain: number;
  tax: number;
}

// ===== VÝPOČET (původně 1:1 z utils/investmentCalculations.ts, ten už neexistuje) =====
// 17. 10. 2026 OPRAVENO (pravidlo č. 1): měsíční sazba byla „roční / 12", takže zadaných 7 % p.a.
// ve skutečnosti úročilo 7,23 % ročně a výsledek za 20 let byl o ~3 % vyšší (3,02 vs. 2,94 mil. Kč
// u 100 000 + 5 000/měs.). Teď (1 + r)^(1/12) − 1 – zadaný roční výnos je skutečně roční.
function calculateInvestment(params: {
  initialInvestment: number;
  recurringInvestment: number;
  recurringFrequency: 'monthly' | 'yearly';
  averageReturn: number;
  investmentPeriod: number;
  taxRate: number;
}): YearRow[] {
  const {
    initialInvestment,
    recurringInvestment,
    recurringFrequency,
    averageReturn,
    investmentPeriod,
    taxRate,
  } = params;

  const data: YearRow[] = [];
  const annualReturn = averageReturn / 100;

  let currentValue = initialInvestment;
  let totalInvested = initialInvestment;

  for (let year = 1; year <= investmentPeriod; year++) {
    if (recurringFrequency === 'monthly') {
      const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;
      for (let month = 1; month <= 12; month++) {
        currentValue += recurringInvestment;
        totalInvested += recurringInvestment;
        currentValue = currentValue * (1 + monthlyReturn);
      }
    } else {
      currentValue += recurringInvestment;
      totalInvested += recurringInvestment;
      currentValue = currentValue * (1 + annualReturn);
    }

    const grossGain = currentValue - totalInvested;
    const tax = taxRate > 0 && grossGain > 0 ? grossGain * (taxRate / 100) : 0;
    const netValue = currentValue - tax;
    const netGain = netValue - totalInvested;

    data.push({
      year,
      totalInvested: Math.round(totalInvested),
      grossValue: Math.round(currentValue),
      netValue: Math.round(netValue),
      grossGain: Math.round(grossGain),
      netGain: Math.round(netGain),
      tax: Math.round(tax),
    });
  }

  return data;
}
// ===== KONEC převzaté logiky =====

function NumberField({
  id,
  label,
  value,
  onChange,
  step,
  min,
  max,
  suffix,
}: {
  id: string;
  label: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  step?: string;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-slate-600 mb-1">
        {label}
      </label>
      {(() => {
        const stepNum = parseFloat(step ?? '1') || 1;
        const clamp = (v: number) => {
          if (min != null && v < min) v = min;
          if (max != null && v > max) v = max;
          return Number(v.toFixed(6));
        };
        return (
          <div className="relative">
            <input
              id={id}
              // Částky v Kč jako text s mezerami mezi tisíci („100 000"), stejně jako backtest;
              // procenta a roky zůstávají číselné pole (UX audit 17. 10. 2026).
              type={suffix === 'Kč' ? 'text' : 'number'}
              inputMode={suffix === 'Kč' ? 'numeric' : 'decimal'}
              step={suffix === 'Kč' ? undefined : step}
              min={suffix === 'Kč' ? undefined : min}
              max={suffix === 'Kč' ? undefined : max}
              value={suffix === 'Kč' ? (value === 0 ? '' : value.toLocaleString('cs-CZ')) : value}
              placeholder={suffix === 'Kč' ? '0' : undefined}
              onChange={(e) => suffix === 'Kč'
                ? onChange(clamp(Number(e.target.value.replace(/[^0-9]/g, '') || 0)))
                : onChange(Number(e.target.value))}
              className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white pl-3 pr-[4.25rem] py-2.5 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {suffix && <span className="pointer-events-none text-sm text-slate-400">{suffix}</span>}
              <div className="flex flex-col">
                <button type="button" aria-label="Zvýšit" tabIndex={-1} onClick={() => onChange(clamp(value + stepNum))}
                  className="flex items-center justify-center w-6 h-[18px] rounded-t bg-slate-100 text-slate-500 hover:bg-slate-200 active:bg-slate-300">
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" aria-label="Snížit" tabIndex={-1} onClick={() => onChange(clamp(value - stepNum))}
                  className="flex items-center justify-center w-6 h-[18px] rounded-b bg-slate-100 text-slate-500 hover:bg-slate-200 active:bg-slate-300 mt-px">
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

type ChartDatum = {
  year: number;
  invested: number;
  gain: number;
  total: number;
};

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDatum }> }) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg whitespace-nowrap">
      <div className="font-semibold mb-1">{d.year === 0 ? 'Na začátku' : `Po ${d.year} ${d.year === 1 ? 'roce' : 'letech'}`}</div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-slate-400" /> Vloženo:{' '}
        <span className="font-medium tabular-nums">{fmtCZK(d.invested)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-teal-400" /> Výnos:{' '}
        <span className="font-medium tabular-nums">{fmtCZK(d.gain)}</span>
      </div>
      <div className="mt-1 pt-1 border-t border-white/15 text-teal-300">
        Celkem: <span className="font-semibold tabular-nums">{fmtCZK(d.total)}</span>
      </div>
    </div>
  );
}

/** Skutečné průměrné roční výnosy v Kč (ze stejných dat jako backtest a stroj času), STEJNÉ období. */
export interface HistorickyVynos {
  id: string;
  nazev: string;
  cagr: number;
  /** První měsíc období (YYYY-MM). */
  odMesic: string;
  /** Poslední den dat (YYYY-MM-DD). */
  doDen: string;
}

const fmtDen = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });
const fmtMesic = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `${m}/${y}`; };
const let_ = (n: number) => (n === 1 ? 'rok' : n >= 2 && n <= 4 ? 'roky' : 'let');
/** Inflace pro přepočet do dnešních cen – inflační cíl ČNB (předpoklad, ne prognóza). */
const INFLACE_CIL_CNB = 0.02;

/** Roky na ose X: krok podle délky (max ~6 popisků i na mobilu). */
const rokyOsy = (n: number) => {
  const krok = n <= 6 ? 1 : n <= 12 ? 2 : n <= 30 ? 5 : 10;
  const out: number[] = [];
  for (let y = krok; y <= n; y += krok) out.push(y);
  return out;
};

/** Odkaz do backtestu se stejnými vklady a horizontem („A jak by to dopadlo doopravdy?“). */
function odkazDoBacktestu(p: {
  presetId: string; roky: number; jednorazove: number; pravidelne: number; frekvence: 'monthly' | 'yearly';
}) {
  const preset = STROJ_PRESETY.find((x) => x.id === p.presetId) ?? STROJ_PRESETY.find((x) => x.id === 'sp500')!;
  const dnes = new Date();
  // Start = stejný měsíc před N lety; nejdřív od prvního měsíce dat presetu (Kč máme od 1/2000).
  let start = `${dnes.getFullYear() - p.roky}-${String(dnes.getMonth() + 1).padStart(2, '0')}`;
  const zkraceno = start < preset.od;
  if (zkraceno) start = preset.od;
  const slozeni = slozeniProStart(preset, start);
  const q = new URLSearchParams();
  if (preset.id === 'sp500') q.set('portfolio', 'sp500-100');
  else q.set('slozeni', slozeni.map((s) => `${s.indexCode}:${Math.round(s.weight * 100)}`).join(','));
  q.set('start', `${start}-01`);
  q.set('amount', String(Math.round(p.jednorazove)));
  if (p.pravidelne > 0) { q.set('vklad', String(Math.round(p.pravidelne))); q.set('freq', p.frekvence); }
  else q.set('freq', 'none');
  q.set('run', '1');
  return { href: `/backtest?${q.toString()}`, nazev: preset.nazev, start, zkraceno };
}

export default function InvesticniKalkulackaWidget({ historicke = [] }: { historicke?: HistorickyVynos[] }) {
  // Výchozí hodnoty 1:1 z původní komponenty InvestmentCalculatorContent.tsx
  const [initialInvestment, setInitialInvestment] = useState<number>(100000);
  const [recurringInvestment, setRecurringInvestment] = useState<number>(5000);
  const [recurringFrequency, setRecurringFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [averageReturn, setAverageReturn] = useState<number>(7);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(20);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [vsechnyRoky, setVsechnyRoky] = useState(false);

  const results = useMemo(
    () =>
      calculateInvestment({
        initialInvestment,
        recurringInvestment,
        recurringFrequency,
        averageReturn,
        investmentPeriod,
        taxRate,
      }),
    [initialInvestment, recurringInvestment, recurringFrequency, averageReturn, investmentPeriod, taxRate],
  );

  const finalResult = results[results.length - 1];

  // Časová řada pro graf: rozpad vloženo (netto) vs. zhodnoceno (čistý zisk po dani).
  // year 0 = počáteční stav před prvním rokem.
  const chartData = useMemo<ChartDatum[]>(() => {
    const start: ChartDatum = { year: 0, invested: initialInvestment, gain: 0, total: initialInvestment };
    const rest = results.map((r) => ({
      year: r.year,
      invested: r.totalInvested,
      // zhodnocení = čistá hodnota po dani − vložená částka (nezáporné pro plochu)
      gain: Math.max(0, r.netValue - r.totalInvested),
      total: Math.max(r.totalInvested, r.netValue),
    }));
    return [start, ...rest];
  }, [results, initialInvestment]);
  const osaY = useMemo(() => kulateKroky(chartData.reduce((m, d) => Math.max(m, d.total), 0), 0, 4), [chartData]);

  const warnReturn = averageReturn < 3 || averageReturn > 15;
  const hasData = Boolean(finalResult) && investmentPeriod > 0;

  // Vybraná rychlá volba (shoda s historickým výnosem) → podle ní i odkaz do backtestu.
  const vybrany = historicke.find((h) => Math.abs(averageReturn - Math.round(h.cagr * 1000) / 10) < 0.05);
  const backtest = hasData ? odkazDoBacktestu({
    presetId: vybrany?.id ?? 'sp500', roky: investmentPeriod, jednorazove: initialInvestment,
    pravidelne: recurringInvestment, frekvence: recurringFrequency,
  }) : null;

  // Mobil: lišta s výsledkem dole jen když velké číslo není vidět.
  const vysledekRef = useRef<HTMLDivElement>(null);
  const [vysledekVidet, setVysledekVidet] = useState(true);
  useEffect(() => {
    const el = vysledekRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([z]) => setVysledekVidet(z.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [hasData]);

  // Tabulka: milníky po 5 letech + poslední rok; všechny roky na rozklik.
  const radkyTabulky = vsechnyRoky
    ? results
    : results.filter((r) => r.year % 5 === 0 || r.year === investmentPeriod || (investmentPeriod < 5 && r.year >= 1));

  const zisk = hasData ? finalResult.netValue - finalResult.totalInvested : 0;
  const podilVynosu = hasData && finalResult.netValue > 0 ? Math.max(0, zisk) / finalResult.netValue : 0;
  const frekvenceText = recurringFrequency === 'monthly' ? 'měsíčně' : 'ročně';
  const vDnesnichCenach = hasData ? finalResult.netValue / Math.pow(1 + INFLACE_CIL_CNB, investmentPeriod) : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
        {/* ===== VSTUPY ===== */}
        <div data-sekce="kalk-vstupy" className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
          <h2 className="text-base font-semibold text-slate-900 mb-3">Vaše investice</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1">
              <NumberField
                id="initial"
                label="Jednorázový vklad"
                value={initialInvestment}
                min={0}
                max={50000000}
                step="10000"
                onChange={(v) => setInitialInvestment(Math.max(0, v))}
                suffix="Kč"
              />
            </div>
            <div className="col-span-1">
              <NumberField
                id="period"
                label="Doba investování"
                value={investmentPeriod}
                min={1}
                max={50}
                onChange={(v) => setInvestmentPeriod(Math.max(1, Math.min(50, v)))}
                suffix="let"
              />
            </div>

            {/* Pravidelný vklad + frekvence */}
            <div className="col-span-2">
              <label htmlFor="recurring" className="block text-sm text-slate-600 mb-1">
                Pravidelný vklad
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1 min-w-0">
                  <input
                    id="recurring"
                    type="text"
                    inputMode="numeric"
                    value={recurringInvestment === 0 ? '' : recurringInvestment.toLocaleString('cs-CZ')}
                    placeholder="0"
                    onChange={(e) => setRecurringInvestment(Math.min(1000000, Number(e.target.value.replace(/[^0-9]/g, '') || 0)))}
                    className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white pl-3 pr-[4.25rem] py-2.5 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <span className="pointer-events-none text-sm text-slate-400">Kč</span>
                    <div className="flex flex-col">
                      <button type="button" aria-label="Zvýšit" tabIndex={-1} onClick={() => setRecurringInvestment(Math.min(1000000, recurringInvestment + 500))}
                        className="flex items-center justify-center w-6 h-[18px] rounded-t bg-slate-100 text-slate-500 hover:bg-slate-200 active:bg-slate-300">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" aria-label="Snížit" tabIndex={-1} onClick={() => setRecurringInvestment(Math.max(0, recurringInvestment - 500))}
                        className="flex items-center justify-center w-6 h-[18px] rounded-b bg-slate-100 text-slate-500 hover:bg-slate-200 active:bg-slate-300 mt-px">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
                <select
                  aria-label="Frekvence pravidelného vkladu"
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value as 'monthly' | 'yearly')}
                  className="min-h-[44px] rounded-lg border border-slate-200 bg-white px-2.5 py-2.5 text-sm text-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
                >
                  <option value="monthly">měsíčně</option>
                  <option value="yearly">ročně</option>
                </select>
              </div>
            </div>

            {/* Očekávaný výnos + rychlé volby PŘÍMO pod ním (dřív stály pod pravidelným vkladem) */}
            <div className="col-span-2">
              <NumberField
                id="return"
                label={
                  <span className="inline-flex items-center gap-1">
                    Očekávaný roční výnos
                    <InfoTip label="Průměrný roční výnos, se kterým kalkulačka počítá každý rok stejně. Bere ho tak, jak ho zadáte – poplatky ani inflaci sama neodečítá. Historické výnosy pod polem už jsou po poplatcích fondů (před daní).">
                      <span className="sr-only">vysvětlení</span>
                    </InfoTip>
                  </span>
                }
                value={averageReturn}
                step="0.1"
                min={0}
                max={30}
                onChange={(v) => setAverageReturn(Math.max(0, Math.min(30, v)))}
                suffix="%"
              />
              {/* Skutečné výnosy v Kč místo odhadu. Všechny za STEJNÉ období – jinak by rozdíl dělalo
                  období (krize v datech/mimo data), ne strategie. */}
              {historicke.length > 0 && (
                <div className="mt-2.5 rounded-lg bg-teal-50/70 border border-teal-100 p-2.5">
                  <p className="text-xs text-teal-900 flex items-center gap-1 flex-wrap">
                    Kolik skutečně vynesly v Kč ({fmtMesic(historicke[0].odMesic)} – {fmtDen(historicke[0].doDen)})
                    <InfoTip label="Průměrné roční zhodnocení (CAGR) v korunách z historických cen fondů: S&P 500 = fond SPY; celý svět = fond Vanguard Total World (VT), do 6/2008, kdy ještě nebyl, 60 % S&P 500 + 40 % svět mimo USA; 60/40 = 60 % akcie celého světa + 40 % americké dluhopisy (AGG). Po poplatcích těchto fondů, před daní. Minulost, ne předpověď.">
                      <span className="sr-only">odkud jsou čísla</span>
                    </InfoTip>
                  </p>
                  <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                    {historicke.map((h) => {
                      const pct = Math.round(h.cagr * 1000) / 10;
                      const on = Math.abs(averageReturn - pct) < 0.05;
                      return (
                        <button key={h.id} type="button" aria-pressed={on} data-track={`kalk-vynos:${h.id}`} onClick={() => setAverageReturn(pct)}
                          className={`min-h-[48px] rounded-lg border px-1.5 py-1 text-center transition-colors ${on ? 'border-teal-700 bg-teal-700 text-white' : 'border-teal-200 bg-white text-slate-700 hover:border-teal-400'}`}>
                          <span className="block text-[11px] leading-tight">{h.id === 'vyvazene' ? '60/40' : h.nazev}</span>
                          <span className="block text-sm font-semibold tabular-nums">{pct.toLocaleString('cs-CZ')} %</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Kontrola parametrů */}
          {warnReturn && (
            <p className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
              {averageReturn < 3 ? 'Velmi nízký výnos (pod 3 % ročně) – zkontrolujte zadání.' : 'Velmi vysoký výnos (nad 15 % ročně) – zkontrolujte zadání.'}
            </p>
          )}

          {/* Daň – do „dalšího nastavení“ (časový test = výchozí 0 %) */}
          <details className="group mt-4 rounded-lg border border-slate-200">
            <summary className="flex items-center justify-between gap-2 px-3 py-2.5 cursor-pointer list-none min-h-[44px] rounded-lg hover:bg-slate-50">
              <span className="text-sm font-medium text-slate-700">Daň z výnosů</span>
              <span className="flex items-center gap-2 text-xs text-slate-500">
                <span className="group-open:hidden tabular-nums">{taxRate} %</span>
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
              </span>
            </summary>
            <div className="px-3 pb-3 pt-2 border-t border-slate-200">
              <NumberField
                id="tax"
                label={
                  <InfoTip label="Při držení ETF déle než 3 roky je zisk v ČR osvobozen (časový test = 0 %). Při kratším držení se zisk daní 15 %, resp. 23 %.">Daň ze zisku</InfoTip>
                }
                value={taxRate}
                step="1"
                min={0}
                max={23}
                onChange={(v) => setTaxRate(Math.max(0, Math.min(23, v)))}
                suffix="%"
              />
            </div>
          </details>
        </div>

        {/* ===== VÝSLEDEK – velké číslo + graf (desktop vpravo, mobil hned pod vstupy) ===== */}
        {hasData && (
          <div id="vysledek" ref={vysledekRef} data-sekce="kalk-vysledek" className="lg:sticky lg:top-[4.5rem] scroll-mt-20 rounded-xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
            <p className="text-sm text-slate-600">
              Za {investmentPeriod} {let_(investmentPeriod)} byste měli{taxRate > 0 ? ' (po dani)' : ''}
            </p>
            <p className="text-4xl md:text-5xl font-bold tracking-tight tabular-nums text-slate-900 mt-1">{fmtCZK(finalResult.netValue)}</p>
            {(() => {
              const seg = [
                { label: 'Vloženo', v: finalResult.totalInvested, color: 'bg-slate-300' },
                { label: 'Výnos', v: Math.max(0, zisk), color: 'bg-teal-500' },
              ];
              const total = seg.reduce((s, x) => s + x.v, 0) || 1;
              return (
                <>
                  <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    {seg.map((s) => <div key={s.label} className={s.color} style={{ width: `${(s.v / total) * 100}%` }} />)}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-300" />
                      Vloženo <span className="font-semibold tabular-nums text-slate-800">{fmtCZK(finalResult.totalInvested)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-500" />
                      Výnos{taxRate > 0 ? ' po dani' : ''} <span className="font-semibold tabular-nums text-teal-700">+{fmtCZK(Math.max(0, zisk))}</span>
                    </span>
                  </div>
                </>
              );
            })()}

            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-xs font-medium text-slate-700">Hodnota v Kč podle let</p>
              <p className="flex items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-slate-300" /> vloženo</span>
                <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-teal-400" /> výnos</span>
              </p>
            </div>
            <div className="mt-2 w-full h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ik-invested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#cbd5e1" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id="ik-gain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="year"
                    type="number"
                    domain={[0, investmentPeriod]}
                    ticks={rokyOsy(investmentPeriod)}
                    tickFormatter={(y) => `rok ${y}`}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    ticks={osaY}
                    domain={[0, osaY[osaY.length - 1]]}
                    tickFormatter={(v) => fmtOsa(Number(v))}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                    width={56}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="invested" stackId="1" stroke="#94a3b8" strokeWidth={1.5} fill="url(#ik-invested)" isAnimationActive={false} />
                  <Area type="monotone" dataKey="gain" stackId="1" stroke="#0d9488" strokeWidth={2} fill="url(#ik-gain)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Model se stálým výnosem {averageReturn.toLocaleString('cs-CZ')} % každý rok. Skutečný trh kolísá – hodnota může i klesat, někdy i roky.
            </p>
          </div>
        )}
      </div>

      {hasData && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Co z toho plyne – vygenerované z TĚCH hodnot, které jsou zadané (dřív pevný text „za 30 let“) */}
          <div data-sekce="kalk-shrnuti" className="rounded-xl bg-teal-800 text-white p-5 md:p-6">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-100">
              <Sparkles className="w-4 h-4" /> Co z toho plyne
            </p>
            <p className="mt-3 text-sm md:text-base text-teal-50 leading-relaxed">
              {initialInvestment > 0 && recurringInvestment > 0
                ? <>Když vložíte {fmtCZK(initialInvestment)} hned a pak {fmtCZK(recurringInvestment)} {frekvenceText}, </>
                : initialInvestment > 0
                  ? <>Když jednorázově vložíte {fmtCZK(initialInvestment)}, </>
                  : <>Když budete vkládat {fmtCZK(recurringInvestment)} {frekvenceText}, </>}
              vložíte za {investmentPeriod} {let_(investmentPeriod)} celkem {fmtCZK(finalResult.totalInvested)}. Při výnosu {averageReturn.toLocaleString('cs-CZ')} % ročně z toho bude{' '}
              <strong className="font-semibold text-white">{fmtCZK(finalResult.netValue)}</strong>
              {podilVynosu > 0 && <> – {Math.round(podilVynosu * 100)} % konečné částky tvoří výnos, ne vaše vklady</>}.
            </p>
            <p className="mt-2 text-xs text-teal-100/90 leading-relaxed">
              V dnešních cenách to při inflaci 2 % ročně (cíl ČNB) odpovídá zhruba {fmtCZK(Math.round(vDnesnichCenach / 1000) * 1000)}.
            </p>
          </div>

          {/* Lákadlo: stejné vklady na skutečných datech */}
          {backtest && (
            <Link href={backtest.href} data-sekce="kalk-backtest" data-track="kalk-do-backtestu"
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 md:p-6 hover:border-teal-300 transition-colors">
              <span>
                <span className="block text-base font-semibold text-slate-900">A jak by to dopadlo doopravdy?</span>
                <span className="mt-1.5 block text-sm text-slate-600 leading-relaxed">
                  Stejné vklady do {backtest.nazev === 'Vyvážené 60/40' ? 'portfolia 60/40' : backtest.nazev} od {fmtMesic(backtest.start)} na skutečných
                  historických datech – i s propady, které kalkulačka se stálým výnosem nevidí.
                  {backtest.zkraceno && ' (Data v Kč máme od tohoto měsíce, období je proto kratší.)'}
                </span>
              </span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 group-hover:text-teal-800">
                Spočítat v backtestu <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          )}
        </div>
      )}

      {/* TABULKA PO LETECH – milníky, všechny roky na rozklik. Na mobilu Rok / Vloženo / Hodnota. */}
      {hasData && (
        <div data-sekce="kalk-tabulka" className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-900">Vývoj po letech</h3>
            <p className="text-xs text-slate-500">Hodnoty na konci roku{taxRate > 0 ? ', po zdanění' : ''}</p>
          </div>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="py-2 px-2 md:px-3 text-left font-medium">Rok</th>
                <th className="py-2 px-2 md:px-3 text-right font-medium">Vloženo</th>
                <th className="hidden sm:table-cell py-2 px-2 md:px-3 text-right font-medium">Výnos za rok</th>
                <th className="hidden sm:table-cell py-2 px-2 md:px-3 text-right font-medium">Výnos celkem</th>
                <th className="py-2 px-2 md:px-3 text-right font-medium">Hodnota</th>
              </tr>
            </thead>
            <tbody>
              {radkyTabulky.map((r) => {
                const i = r.year - 1;
                const predchozi = i === 0 ? initialInvestment : results[i - 1].netValue;
                const vkladyLetos = r.totalInvested - (i === 0 ? initialInvestment : results[i - 1].totalInvested);
                const vynosLetos = r.netValue - predchozi - vkladyLetos;
                const zhodnoceniCelkem = r.netValue - r.totalInvested;
                return (
                  <tr key={r.year} className="border-t border-slate-100">
                    <td className="py-2 px-2 md:px-3 tabular-nums text-slate-700">{r.year}.</td>
                    <td className="py-2 px-2 md:px-3 text-right tabular-nums text-slate-600 whitespace-nowrap">{fmtCZK(r.totalInvested)}</td>
                    <td className="hidden sm:table-cell py-2 px-2 md:px-3 text-right tabular-nums text-teal-700 whitespace-nowrap">{fmtCZK(vynosLetos)}</td>
                    <td className="hidden sm:table-cell py-2 px-2 md:px-3 text-right tabular-nums text-teal-700 whitespace-nowrap">{fmtCZK(zhodnoceniCelkem)}</td>
                    <td className="py-2 px-2 md:px-3 text-right tabular-nums font-semibold text-slate-900 whitespace-nowrap">{fmtCZK(r.netValue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {results.length > radkyTabulky.length || vsechnyRoky ? (
            <button type="button" onClick={() => setVsechnyRoky((v) => !v)}
              className="mt-2 inline-flex items-center gap-1 min-h-[44px] text-sm font-medium text-teal-700 hover:text-teal-800">
              {vsechnyRoky ? 'Jen po 5 letech' : `Zobrazit všechny roky (${results.length})`}
              <ChevronDown className={`w-4 h-4 transition-transform ${vsechnyRoky ? 'rotate-180' : ''}`} />
            </button>
          ) : null}
        </div>
      )}

      {/* Mobil: výsledek v liště dole, jen když velké číslo není na obrazovce. */}
      {hasData && !vysledekVidet && (
        <a href="#vysledek" className="md:hidden fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur shadow-[0_-4px_12px_rgba(15,23,42,0.06)]">
          <span className="text-xs text-slate-500">Za {investmentPeriod} {let_(investmentPeriod)}</span>
          <span className="text-base font-bold text-slate-900 tabular-nums">{fmtCZK(finalResult.netValue)}</span>
        </a>
      )}
    </div>
  );
}
