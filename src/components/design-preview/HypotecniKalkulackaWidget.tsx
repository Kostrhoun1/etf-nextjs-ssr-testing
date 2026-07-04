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
import { Home, Percent, Wallet, Coins, AlertTriangle, Banknote , ChevronUp, ChevronDown } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';

/**
 * Interaktivní jádro hypoteční kalkulačky – redesign.
 * Výpočetní logika je převzata 1:1 z ověřené komponenty
 * `src/components/tools/MortgageCalculator.tsx` (anuitní splátka,
 * měsíční umořovací plán, celkem zaplaceno, celkem úroky). Měněn je POUZE
 * vizuál (teal/slate, design systém, graf přes recharts). Finanční logiku neměnit.
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

interface MortgageRow {
  month: number;
  year: number;
  remainingDebt: number;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
  totalInterest: number;
}

// ===== VÝPOČET 1:1 z src/components/tools/MortgageCalculator.tsx – NEMĚNIT =====
function buildSchedule(params: {
  loanAmount: number;
  interestRate: number;
  loanPeriod: number;
}): MortgageRow[] {
  const { loanAmount, interestRate, loanPeriod } = params;
  if (!loanAmount || !interestRate || !loanPeriod || loanAmount <= 0) return [];

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanPeriod * 12;

  // Anuitní (mortgage) vzorec pro měsíční splátku
  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const data: MortgageRow[] = [];
  let remainingDebt = loanAmount;
  let totalInterest = 0;

  for (let month = 1; month <= totalMonths; month++) {
    const interestPayment = remainingDebt * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;

    remainingDebt = Math.max(0, remainingDebt - principalPayment);
    totalInterest += interestPayment;

    data.push({
      month,
      year: Math.ceil(month / 12),
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
          className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white pl-3 pr-20 py-2.5 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {suffix && <span className="pointer-events-none text-sm text-slate-400">{suffix}</span>}
          {(() => { const sN = parseFloat(step ?? '1') || 1; const cl = (v: number) => { if (min != null && v < min) v = min; if (max != null && v > max) v = max; return Number(v.toFixed(6)); }; return (
          <div className="flex flex-col">
            <button type="button" aria-label="Zvýšit" tabIndex={-1} onClick={() => onChange(cl(value + sN))} className="flex items-center justify-center w-6 h-[18px] rounded-t bg-slate-100 text-slate-500 hover:bg-slate-200 active:bg-slate-300"><ChevronUp className="w-3.5 h-3.5" /></button>
            <button type="button" aria-label="Snížit" tabIndex={-1} onClick={() => onChange(cl(value - sN))} className="flex items-center justify-center w-6 h-[18px] rounded-b bg-slate-100 text-slate-500 hover:bg-slate-200 active:bg-slate-300 mt-px"><ChevronDown className="w-3.5 h-3.5" /></button>
          </div> ); })()}
        </div>
      </div>
    </div>
  );
}

type ChartDatum = {
  year: number;
  principalRemaining: number;
  interestPaid: number;
  paidOff: number;
};

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDatum }> }) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg whitespace-nowrap">
      <div className="font-semibold mb-1">Po {d.year} {d.year === 1 ? 'roce' : 'letech'}</div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-teal-400" /> Splaceno z jistiny:{' '}
        <span className="font-medium tabular-nums">{fmtCZK(d.paidOff)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-slate-400" /> Zbývá dluh:{' '}
        <span className="font-medium tabular-nums">{fmtCZK(d.principalRemaining)}</span>
      </div>
      <div className="mt-1 pt-1 border-t border-white/15 text-amber-300">
        Zaplaceno na úrocích: <span className="font-semibold tabular-nums">{fmtCZK(d.interestPaid)}</span>
      </div>
    </div>
  );
}

export default function HypotecniKalkulackaWidget() {
  // Výchozí hodnoty 1:1 z původní komponenty MortgageCalculator.tsx
  const [propertyValue, setPropertyValue] = useState<number>(4500000);
  const [loanAmount, setLoanAmount] = useState<number>(3600000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [loanPeriod, setLoanPeriod] = useState<number>(25);

  const downPayment = propertyValue - loanAmount;
  const ltv = propertyValue > 0 ? (loanAmount / propertyValue) * 100 : 0;

  const schedule = useMemo(
    () => buildSchedule({ loanAmount, interestRate, loanPeriod }),
    [loanAmount, interestRate, loanPeriod],
  );

  const summary = useMemo(() => {
    if (schedule.length === 0) return null;
    const monthlyPayment = schedule[0].monthlyPayment;
    const totalPayments = monthlyPayment * schedule.length;
    const totalInterest = schedule[schedule.length - 1].totalInterest;
    return { monthlyPayment, totalPayments, totalInterest };
  }, [schedule]);

  // Časová řada pro graf: rozpad splaceno z jistiny vs. zbývající dluh (vyvoj zůstatku),
  // year 0 = stav na začátku (celý úvěr zbývá).
  const chartData = useMemo<ChartDatum[]>(() => {
    if (schedule.length === 0) return [];
    const start: ChartDatum = {
      year: 0,
      principalRemaining: loanAmount,
      interestPaid: 0,
      paidOff: 0,
    };
    const yearly = schedule
      .filter((r) => r.month % 12 === 0 || r.month === schedule.length)
      .map((r) => ({
        year: r.year,
        principalRemaining: Math.round(r.remainingDebt),
        interestPaid: Math.round(r.totalInterest),
        paidOff: Math.round(loanAmount - r.remainingDebt),
      }));
    return [start, ...yearly];
  }, [schedule, loanAmount]);

  const ltvWarn = ltv > 90;
  const inputError = loanAmount <= 0 || loanAmount > propertyValue;
  const hasData = Boolean(summary) && !inputError;

  return (
    <div className="space-y-4">
      {/* Vstupní parametry */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">
          Parametry hypotéky
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NumberField
            id="propertyValue"
            label="Cena nemovitosti"
            value={propertyValue}
            min={500000}
            max={50000000}
            step="100000"
            onChange={(v) => {
              const nv = Math.max(0, v);
              setPropertyValue(nv);
              if (loanAmount > nv) setLoanAmount(Math.round(nv * 0.8));
            }}
            suffix="Kč"
          />
          <NumberField
            id="loanAmount"
            label={
              <InfoTip label="Kolik si půjčíte od banky. Rozdíl mezi cenou nemovitosti a úvěrem jsou vaše vlastní zdroje.">Výše úvěru</InfoTip>
            }
            value={loanAmount}
            min={0}
            max={propertyValue}
            step="50000"
            onChange={(v) => setLoanAmount(Math.max(0, v))}
            suffix="Kč"
          />
          <NumberField
            id="interestRate"
            label={
              <InfoTip label="Roční úrok, který platíte bance z dlužné částky. Po skončení fixace se může změnit.">Úroková sazba</InfoTip>
            }
            value={interestRate}
            min={0.1}
            max={15}
            step="0.1"
            onChange={(v) => setInterestRate(Math.max(0, v))}
            suffix="%"
          />
          <NumberField
            id="loanPeriod"
            label="Doba splatnosti"
            value={loanPeriod}
            min={5}
            max={40}
            step="1"
            onChange={(v) => setLoanPeriod(Math.max(1, Math.min(40, v)))}
            suffix="let"
          />
        </div>

        {/* Odvozené ukazatele: vlastní zdroje a LTV */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-teal-700 border border-slate-200 shrink-0">
              <Wallet className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs text-slate-500">Vlastní zdroje</p>
              <p className="font-semibold text-slate-900 tabular-nums">{fmtCZK(Math.max(0, downPayment))}</p>
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-teal-700 border border-slate-200 shrink-0">
              <Percent className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                <InfoTip label="LTV (loan-to-value) = poměr úvěru k ceně nemovitosti. Banky obvykle půjčí maximálně 80–90 % ceny.">
                  Poměr úvěru k ceně
                </InfoTip>
              </p>
              <p className="font-semibold text-slate-900 tabular-nums">{ltv.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %</p>
            </div>
          </div>
        </div>

        {/* Kontrola parametrů */}
        {inputError && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-900/80">
                <p className="font-semibold text-amber-800">Zkontrolujte zadané hodnoty</p>
                <ul className="mt-1 space-y-0.5">
                  {loanAmount <= 0 && <li>Zadejte kladnou výši úvěru.</li>}
                  {loanAmount > propertyValue && <li>Úvěr nemůže být vyšší než cena nemovitosti.</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
        {!inputError && ltvWarn && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-900/80">
                Poměr úvěru k ceně přesahuje 90 %. Banky obvykle vyžadují alespoň 10–20 % vlastních zdrojů a vyšší poměr znamená přísnější podmínky i sazbu.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Souhrn výsledků */}
      {hasData && summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-teal-50 text-teal-700">
                <Banknote className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate-500">Měsíční splátka</p>
            </div>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{fmtCZK(Math.round(summary.monthlyPayment))}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600">
                <Coins className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate-500">Celkem zaplatíte</p>
            </div>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{fmtCZK(Math.round(summary.totalPayments))}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-700">
                <Percent className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate-500">Přeplatíte na úrocích</p>
            </div>
            <p className="text-xl font-bold text-amber-600 tabular-nums">{fmtCZK(Math.round(summary.totalInterest))}</p>
          </div>
        </div>
      )}

      {/* Graf vývoje zůstatku jistiny v čase */}
      {hasData && chartData.length > 1 && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">
            Vývoj zůstatku jistiny v čase
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-teal-400" /> Splaceno z jistiny
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-slate-300" /> Zbývající dluh{' '}
              <InfoTip label="Na začátku tvoří úroky většinu splátky, takže dluh klesá pomalu. Ke konci se poměr obrací a jistina mizí rychleji.">
                (umořování)
              </InfoTip>
            </span>
          </div>
          <div className="w-full h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="hk-paid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="hk-remaining" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="paidOff"
                  stackId="1"
                  stroke="#0d9488"
                  strokeWidth={2}
                  fill="url(#hk-paid)"
                />
                <Area
                  type="monotone"
                  dataKey="principalRemaining"
                  stackId="1"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  fill="url(#hk-remaining)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Tyrkysová plocha je část jistiny, kterou už máte splacenou; šedá nad ní je dluh, který ještě
            zbývá. Najetím (nebo tapnutím na mobilu) zobrazíte hodnoty v daném roce včetně zaplacených úroků.
          </p>
        </div>
      )}

      {/* Splátkový kalendář po měsících (volitelný, sbalený) */}
      {hasData && schedule.length > 0 && (
        <details className="group rounded-lg border border-slate-200 bg-white">
          <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none">
            <span className="text-sm font-medium text-slate-900">
              Splátkový kalendář{' '}
              <InfoTip label="Rozpis splácení (umořovací plán): u každé splátky vidíte, kolik jde na úrok a kolik na úmor jistiny a jak klesá zbývající dluh.">
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
                  <th className="px-3 py-2 text-right font-medium">Zbývá dluh</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, index) => (
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
            Splátka je po celou dobu fixace stejná, ale její složení se mění: na začátku platíte hlavně
            úrok, ke konci převažuje úmor jistiny. Tyrkysové řádky označují začátek každého roku.
          </p>
        </details>
      )}

      {/* Výsledkový panel – interpretace (čísla jsou výše v kartách, tady jen závěr) */}
      {hasData && summary && (
        <div className="rounded-2xl bg-teal-700 text-white p-5 md:p-7">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-100">
            <Home className="w-4 h-4" /> Co si z toho odnést
          </p>
          <p className="mt-3 text-sm md:text-base text-teal-50 leading-relaxed">
            Při úvěru {fmtCZK(loanAmount)}, sazbě {interestRate.toLocaleString('cs-CZ')} % a splatnosti{' '}
            {loanPeriod} let zaplatíte měsíčně{' '}
            <strong className="font-semibold">{fmtCZK(Math.round(summary.monthlyPayment))}</strong> a celkem
            bance vrátíte <strong className="font-semibold">{fmtCZK(Math.round(summary.totalPayments))}</strong>.
            Výpočet je orientační – počítá s neměnnou sazbou po celou dobu a nezahrnuje poplatky ani pojištění.
          </p>
        </div>
      )}
    </div>
  );
}
