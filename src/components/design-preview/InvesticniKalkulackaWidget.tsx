'use client';

import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PiggyBank, TrendingUp, Wallet, AlertTriangle, Sparkles } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';

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

const fmtCompact = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace('.', ',')} mil. Kč`;
  if (v >= 1_000) return `${Math.round(v / 1000)} tis. Kč`;
  return `${Math.round(v)} Kč`;
};

interface YearRow {
  year: number;
  totalInvested: number;
  grossValue: number;
  netValue: number;
  grossGain: number;
  netGain: number;
  tax: number;
}

// ===== VÝPOČET 1:1 z src/utils/investmentCalculations.ts (calculateInvestment) – NEMĚNIT =====
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
      const monthlyReturn = annualReturn / 12;
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
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </div>
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
      <div className="font-semibold mb-1">
        Po {d.year} {d.year === 1 ? 'roce' : d.year >= 5 ? 'letech' : 'letech'}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-slate-400" /> Vloženo:{' '}
        <span className="font-medium tabular-nums">{fmtCZK(d.invested)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-teal-400" /> Zhodnoceno:{' '}
        <span className="font-medium tabular-nums">{fmtCZK(d.gain)}</span>
      </div>
      <div className="mt-1 pt-1 border-t border-white/15 text-teal-300">
        Celkem: <span className="font-semibold tabular-nums">{fmtCZK(d.total)}</span>
      </div>
    </div>
  );
}

export default function InvesticniKalkulackaWidget() {
  // Výchozí hodnoty 1:1 z původní komponenty InvestmentCalculatorContent.tsx
  const [initialInvestment, setInitialInvestment] = useState<number>(100000);
  const [recurringInvestment, setRecurringInvestment] = useState<number>(5000);
  const [recurringFrequency, setRecurringFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [averageReturn, setAverageReturn] = useState<number>(7);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(20);
  const [taxRate, setTaxRate] = useState<number>(0);

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
    const start: ChartDatum = {
      year: 0,
      invested: initialInvestment,
      gain: 0,
      total: initialInvestment,
    };
    const rest = results.map((r) => ({
      year: r.year,
      invested: r.totalInvested,
      // zhodnocení = čistá hodnota po dani − vložená částka (nezáporné pro plochu)
      gain: Math.max(0, r.netValue - r.totalInvested),
      total: Math.max(r.totalInvested, r.netValue),
    }));
    return [start, ...rest];
  }, [results, initialInvestment]);

  const warnReturn = averageReturn < 3 || averageReturn > 15;
  const hasData = Boolean(finalResult) && investmentPeriod > 0;

  return (
    <div className="space-y-4">
      {/* Vstupní parametry */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">
          Parametry investice
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberField
            id="initial"
            label="Jednorázový vklad"
            value={initialInvestment}
            min={0}
            max={50000000}
            onChange={(v) => setInitialInvestment(Math.max(0, v))}
            suffix="Kč"
          />

          {/* Pravidelný vklad + frekvence */}
          <div>
            <label htmlFor="recurring" className="block text-sm text-slate-600 mb-1">
              Pravidelný vklad
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="recurring"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={1000000}
                  value={recurringInvestment}
                  onChange={(e) => setRecurringInvestment(Math.max(0, Number(e.target.value)))}
                  className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  Kč
                </span>
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

          <NumberField
            id="period"
            label="Doba investování"
            value={investmentPeriod}
            min={1}
            max={50}
            onChange={(v) => setInvestmentPeriod(Math.max(1, Math.min(50, v)))}
            suffix="let"
          />
          <NumberField
            id="return"
            label={
              <span className="inline-flex items-center gap-1">
                Očekávaný výnos{' '}
                <InfoTip label="p.a. = per annum, tj. ročně. Průměrný roční výnos investice. Globální akciové indexy historicky dosahovaly zhruba 7–10 % ročně před inflací.">
                  p.a.
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
          <NumberField
            id="tax"
            label={
              <InfoTip label="Při držení ETF déle než 3 roky je zisk v ČR osvobozen (časový test = 0 %). Při kratším držení a aktivním obchodování se zisk daní 15 %, resp. 23 %.">Daň z výnosů</InfoTip>
            }
            value={taxRate}
            step="1"
            min={0}
            max={23}
            onChange={(v) => setTaxRate(Math.max(0, Math.min(23, v)))}
            suffix="%"
          />
        </div>

        {/* Kontrola parametrů */}
        {warnReturn && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-900/80">
                <p className="font-semibold text-amber-800">Zkontrolujte zadané hodnoty</p>
                <ul className="mt-1 space-y-0.5">
                  {averageReturn < 3 && <li>Velmi nízký očekávaný výnos (pod 3 % ročně).</li>}
                  {averageReturn > 15 && <li>Velmi vysoký očekávaný výnos (nad 15 % ročně).</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Souhrn výsledků */}
      {hasData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600">
                <Wallet className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate-500">Celkem vloženo</p>
            </div>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{fmtCZK(finalResult.totalInvested)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-teal-50 text-teal-700">
                <TrendingUp className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate-500">{taxRate > 0 ? 'Čistý výnos (po dani)' : 'Zhodnocení'}</p>
            </div>
            <p className="text-xl font-bold text-emerald-600 tabular-nums">{fmtCZK(finalResult.netGain)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-teal-50 text-teal-700">
                <PiggyBank className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate-500">Celková hodnota portfolia</p>
            </div>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{fmtCZK(finalResult.netValue)}</p>
          </div>
        </div>
      )}

      {/* Graf růstu hodnoty v čase */}
      {hasData && chartData.length > 1 && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">
            Růst hodnoty portfolia v čase
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-slate-300" /> Vloženo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-teal-400" /> Zhodnocení{' '}
              <InfoTip label="Složené úročení: výnosy se reinvestují a samy dál vydělávají. Čím delší horizont, tím větší podíl tvoří zhodnocení oproti vkladům.">
                (složené úročení)
              </InfoTip>
            </span>
          </div>
          <div className="w-full h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="year"
                  tickFormatter={(y) => `${y} l.`}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  minTickGap={16}
                />
                <YAxis
                  tickFormatter={(v) => fmtCompact(Number(v))}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  width={64}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stackId="1"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  fill="url(#ik-invested)"
                />
                <Area
                  type="monotone"
                  dataKey="gain"
                  stackId="1"
                  stroke="#0d9488"
                  strokeWidth={2}
                  fill="url(#ik-gain)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Spodní plocha je to, co sami vložíte; tyrkysová plocha nad ní je zhodnocení – výnosy z výnosů
            díky složenému úročení. Najetím (nebo tapnutím na mobilu) zobrazíte hodnoty v daném roce.
          </p>
        </div>
      )}

      {/* Výsledkový panel */}
      {hasData && (
        <div className="rounded-2xl bg-teal-700 text-white p-5 md:p-7">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-100">
            <Sparkles className="w-4 h-4" /> Co si z toho odnést
          </p>
          <p className="mt-3 text-sm md:text-base text-teal-50 leading-relaxed">
            Při {recurringFrequency === 'monthly' ? 'měsíčním' : 'ročním'} vkladu {fmtCZK(recurringInvestment)} a
            výnosu {averageReturn.toLocaleString('cs-CZ')} % ročně narostou peníze za {investmentPeriod} let na{' '}
            <strong className="font-semibold">{fmtCZK(finalResult.netValue)}</strong>. Většinu rozdílu tvoří
            složené úročení – výnosy, které samy dál vydělávají.
          </p>
          <p className="mt-2 text-xs text-teal-100/80 leading-relaxed">
            Jde o nominální částku (výnos je před inflací). V dnešní kupní síle bude kvůli inflaci nižší –
            při 2–3 % inflaci ročně zhruba o třetinu za 30 let.
          </p>
        </div>
      )}
    </div>
  );
}
