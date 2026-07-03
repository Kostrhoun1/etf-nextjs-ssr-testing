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
import { Wallet, Coins, TrendingDown, Percent, AlertTriangle, Banknote } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';

/**
 * Interaktivní jádro úvěrové kalkulačky (spotřebitelský úvěr) – redesign.
 * Výpočetní logika je převzata 1:1 z ověřené komponenty
 * `src/components/tools/ConsumerLoanCalculator.tsx`:
 *   - měsíční úroková sazba = roční sazba / 100 / 12,
 *   - počet splátek = doba v letech × 12,
 *   - měsíční (anuitní) splátka podle standardního vzorce,
 *   - měsíc po měsíci se rozpadá splátka na úrok a úmor jistiny,
 *   - zbývající dluh a kumulované úroky.
 * Měněn je POUZE vizuál (teal/slate, design systém, graf přes recharts).
 * Finanční logiku NEMĚNIT.
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

interface LoanRow {
  month: number;
  remainingDebt: number;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
  totalInterest: number;
}

// ===== VÝPOČET 1:1 z src/components/tools/ConsumerLoanCalculator.tsx – NEMĚNIT =====
function buildSchedule(loanAmount: number, interestRate: number, loanPeriod: number): LoanRow[] {
  if (!loanAmount || !interestRate || !loanPeriod) return [];

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanPeriod * 12;

  // Anuitní měsíční splátka
  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const data: LoanRow[] = [];
  let remainingDebt = loanAmount;
  let totalInterest = 0;

  for (let month = 1; month <= totalMonths; month++) {
    const interestPayment = remainingDebt * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;

    remainingDebt = remainingDebt - principalPayment;
    if (remainingDebt < 0.01) remainingDebt = 0;
    totalInterest += interestPayment;

    data.push({
      month,
      remainingDebt,
      monthlyPayment,
      principalPayment,
      interestPayment,
      totalInterest,
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
  onBlur,
  step,
  min,
  max,
  suffix,
  hint,
}: {
  id: string;
  label: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  onBlur?: () => void;
  step?: string;
  min?: number;
  max?: number;
  suffix?: string;
  hint?: string;
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
          onBlur={onBlur}
          className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

type ChartDatum = {
  year: number;
  principalPaid: number; // splacená jistina (kumulativně)
  interestPaid: number; // zaplacené úroky (kumulativně)
  remaining: number; // zbývající dluh
};

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDatum }> }) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg whitespace-nowrap">
      <div className="font-semibold mb-1">
        {d.year === 0 ? 'Začátek' : `Po ${d.year} ${d.year === 1 ? 'roce' : 'letech'}`}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-slate-400" /> Zbývá splatit:{' '}
        <span className="font-medium tabular-nums">{fmtCZK(d.remaining)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-teal-400" /> Splacená jistina:{' '}
        <span className="font-medium tabular-nums">{fmtCZK(d.principalPaid)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-red-400" /> Zaplacené úroky:{' '}
        <span className="font-medium tabular-nums">{fmtCZK(d.interestPaid)}</span>
      </div>
    </div>
  );
}

export default function UverovaKalkulackaWidget() {
  // Výchozí hodnoty 1:1 z původní komponenty ConsumerLoanCalculator.tsx
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanPeriod, setLoanPeriod] = useState<number>(5);

  const loanData = useMemo(
    () => buildSchedule(loanAmount, interestRate, loanPeriod),
    [loanAmount, interestRate, loanPeriod],
  );

  const summary = useMemo(() => {
    if (loanData.length === 0) return null;
    const monthlyPayment = loanData[0].monthlyPayment;
    const totalPayments = monthlyPayment * loanData.length;
    const totalInterest = loanData[loanData.length - 1].totalInterest;
    return {
      monthlyPayment,
      totalPayments,
      totalInterest,
      interestPercentage: (totalInterest / loanAmount) * 100,
    };
  }, [loanData, loanAmount]);

  // Časová řada pro graf: rozpad zbývající dluh / splacená jistina / zaplacené úroky.
  // year 0 = stav před první splátkou.
  const chartData = useMemo<ChartDatum[]>(() => {
    const start: ChartDatum = {
      year: 0,
      principalPaid: 0,
      interestPaid: 0,
      remaining: loanAmount,
    };
    const rest = loanData
      .filter((_, index) => index % 12 === 11 || index === loanData.length - 1)
      .map((item) => ({
        year: Math.ceil(item.month / 12),
        principalPaid: Math.round(loanAmount - item.remainingDebt),
        interestPaid: Math.round(item.totalInterest),
        remaining: Math.round(item.remainingDebt),
      }));
    return [start, ...rest];
  }, [loanData, loanAmount]);

  const hasData = Boolean(summary);
  const warn =
    loanAmount > 0 &&
    (loanAmount < 50000 || loanAmount > 2000000 || interestRate < 3 || interestRate > 25);

  return (
    <div className="space-y-4">
      {/* Vstupní parametry */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">
          Parametry úvěru
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberField
            id="loanAmount"
            label="Výše úvěru"
            value={loanAmount}
            min={10000}
            max={5000000}
            step="10000"
            onChange={(v) => setLoanAmount(Math.max(0, v))}
            suffix="Kč"
            hint="Obvykle 50 000 – 2 000 000 Kč"
          />
          <NumberField
            id="interestRate"
            label={
              <span className="inline-flex items-center gap-1">
                Úroková sazba{' '}
                <InfoTip label="Roční úrok, tj. cena za půjčené peníze. Nezahrnuje poplatky – ty pokrývá až RPSN.">
                  p.a.
                </InfoTip>
              </span>
            }
            value={interestRate}
            min={0}
            max={50}
            step="0.1"
            onChange={(v) => setInterestRate(Math.max(0, v))}
            suffix="%"
            hint="Typicky 6 – 15 % ročně"
          />
          <NumberField
            id="loanPeriod"
            label="Doba splácení"
            value={loanPeriod}
            min={1}
            max={10}
            step="1"
            onChange={(v) => setLoanPeriod(Math.max(1, Math.min(10, Math.round(v) || 1)))}
            suffix="let"
            hint="Obvykle 1 – 7 let"
          />
        </div>

        {warn && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-900/80">
                <p className="font-semibold text-amber-800">Zkontrolujte zadané hodnoty</p>
                <ul className="mt-1 space-y-0.5">
                  {(loanAmount < 50000 || loanAmount > 2000000) && (
                    <li>Výše úvěru je mimo obvyklý rozsah 50 000 – 2 000 000 Kč.</li>
                  )}
                  {(interestRate < 3 || interestRate > 25) && (
                    <li>Úroková sazba je mimo obvyklý rozsah 3 – 25 % ročně.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Souhrn výsledků */}
      {hasData && summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-teal-50 text-teal-700">
                <Banknote className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate-500">Měsíční splátka</p>
            </div>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{fmtCZK(summary.monthlyPayment)}</p>
            <p className="text-xs text-slate-400 mt-1">stejná každý měsíc</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600">
                <Coins className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate-500">Celkem zaplatíte</p>
            </div>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{fmtCZK(summary.totalPayments)}</p>
            <p className="text-xs text-slate-400 mt-1">součet všech splátek</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600">
                <TrendingDown className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate-500">Přeplatek</p>
            </div>
            <p className="text-xl font-bold text-red-600 tabular-nums">{fmtCZK(summary.totalInterest)}</p>
            <p className="text-xs text-slate-400 mt-1">úroky navíc oproti půjčené částce</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600">
                <Percent className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate-500">Poměr přeplatku</p>
            </div>
            <p className="text-xl font-bold text-slate-900 tabular-nums">
              {summary.interestPercentage.toFixed(1).replace('.', ',')} %
            </p>
            <p className="text-xs text-slate-400 mt-1">přeplatek v % z výše úvěru</p>
          </div>
        </div>
      )}

      {/* Graf vývoje zůstatku v čase */}
      {hasData && chartData.length > 1 && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">
            Vývoj zůstatku úvěru v čase
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-slate-300" /> Zbývá splatit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-teal-400" /> Splacená jistina
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-red-300" /> Zaplacené úroky
            </span>
          </div>
          <div className="w-full h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="uk-remaining" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cbd5e1" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.5} />
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
                  dataKey="remaining"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  fill="url(#uk-remaining)"
                />
                <Area
                  type="monotone"
                  dataKey="principalPaid"
                  stroke="#0d9488"
                  strokeWidth={2}
                  fillOpacity={0}
                />
                <Area
                  type="monotone"
                  dataKey="interestPaid"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Šedá plocha je zbývající dluh, který postupně klesá. Tyrkysová čára ukazuje, kolik
            jistiny už máte splaceno, červená kolik jste zaplatili na úrocích. Najetím (nebo
            tapnutím na mobilu) zobrazíte hodnoty v daném roce.
          </p>
        </div>
      )}

      {/* Výsledkový panel */}
      {hasData && summary && (
        <div className="rounded-2xl bg-slate-900 text-white p-5 md:p-7">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-300">
            <Wallet className="w-4 h-4" /> Co si z toho odnést
          </p>
          <p className="mt-3 text-sm md:text-base text-slate-200 leading-relaxed">
            Za úvěr {fmtCZK(loanAmount)} při sazbě {interestRate.toLocaleString('cs-CZ')} % ročně na{' '}
            {loanPeriod} {loanPeriod === 1 ? 'rok' : loanPeriod < 5 ? 'roky' : 'let'} celkem zaplatíte{' '}
            <strong className="font-semibold">{fmtCZK(summary.totalPayments)}</strong>. To, co vidíte
            jako přeplatek, je cena za to, že peníze máte hned – proto se vyplatí porovnávat{' '}
            <InfoTip label="RPSN = roční procentní sazba nákladů. Na rozdíl od úroku zahrnuje i poplatky za sjednání, vedení a pojištění úvěru, takže lépe vyjadřuje skutečnou cenu.">
              RPSN
            </InfoTip>
            , ne jen úrok.
          </p>
        </div>
      )}

      {/* Umořovací tabulka (volitelná, sbalená) */}
      {hasData && (
        <details className="group rounded-lg border border-slate-200 bg-white">
          <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none">
            <span className="text-sm font-medium text-slate-900">
              Splátkový kalendář{' '}
              <InfoTip label="Rozpis splácení (umořovací plán): u každé splátky vidíte, kolik jde na úrok a kolik na úmor jistiny.">
                po měsících
              </InfoTip>
            </span>
            <span className="text-xs text-slate-400 group-open:hidden">rozbalit</span>
            <span className="text-xs text-slate-400 hidden group-open:inline">sbalit</span>
          </summary>
          <div className="border-t border-slate-100 max-h-96 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-600 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Měsíc</th>
                  <th className="px-3 py-2 text-right font-medium">Splátka</th>
                  <th className="px-3 py-2 text-right font-medium">Úrok</th>
                  <th className="px-3 py-2 text-right font-medium">Jistina</th>
                  <th className="px-3 py-2 text-right font-medium">Zůstatek</th>
                </tr>
              </thead>
              <tbody>
                {loanData.map((item, index) => (
                  <tr
                    key={item.month}
                    className={index % 12 === 0 ? 'bg-teal-50/40' : 'hover:bg-slate-50'}
                  >
                    <td className="px-3 py-1.5 font-medium text-slate-700">
                      {index % 12 === 0 && (
                        <span className="text-teal-700 font-semibold">Rok {Math.floor(index / 12) + 1}</span>
                      )}
                      <span className="block text-[11px] text-slate-400">měsíc {item.month}</span>
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-slate-700">
                      {fmtCZK(Math.round(item.monthlyPayment))}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-red-600">
                      {fmtCZK(Math.round(item.interestPayment))}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-emerald-600">
                      {fmtCZK(Math.round(item.principalPayment))}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-slate-700">
                      {fmtCZK(Math.round(item.remainingDebt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-3 text-xs text-slate-500 leading-relaxed border-t border-slate-100">
            Splátka je celou dobu stejná, ale její složení se mění: na začátku platíte hlavně úrok,
            ke konci převažuje úmor jistiny.
          </p>
        </details>
      )}
    </div>
  );
}
