'use client';

import React, { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceDot, ReferenceLine,
} from 'recharts';
import { Target, TrendingUp, CalendarClock, AlertTriangle, Sparkles, Flame , ChevronUp, ChevronDown } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';

/**
 * Interaktivní jádro FIRE kalkulačky – PRESKINOVANÁ verze.
 *
 * Výpočetní logika je 1:1 převzata z původní kalkulačky
 * (src/utils/retirementCalculations.ts → getPortfolioParameters, getPortfolioReturn,
 * calculateFireScenario) a z RetirementPlanner.tsx (FIRE cíl = výdaje × 12 × 25,
 * realistický scénář pro graf, inflačně navyšovaný cíl). Měněn je POUZE vizuál
 * (teal/slate, design systém, recharts). Matematiku neměnit.
 */

type Strategy = 'conservative' | 'moderate' | 'aggressive';

// ===== 1:1 z retirementCalculations.ts (getPortfolioParameters) – NEMĚNIT =====
const getPortfolioParameters = (strategy: Strategy) => {
  switch (strategy) {
    case 'conservative':
      return { expectedReturn: 7.7, volatility: 0.065, stockAllocation: 0.30, bondAllocation: 0.70 };
    case 'moderate':
      return { expectedReturn: 8.8, volatility: 0.105, stockAllocation: 0.60, bondAllocation: 0.40 };
    case 'aggressive':
      return { expectedReturn: 9.8, volatility: 0.136, stockAllocation: 0.80, bondAllocation: 0.20 };
    default:
      return { expectedReturn: 8.8, volatility: 0.105, stockAllocation: 0.60, bondAllocation: 0.40 };
  }
};

// ===== 1:1 z retirementCalculations.ts (getPortfolioReturn) – NEMĚNIT =====
const getPortfolioReturn = (
  strategy: Strategy,
  year: number,
  scenario: 'optimistic' | 'realistic' | 'pessimistic' = 'realistic',
): number => {
  const params = getPortfolioParameters(strategy);

  let returnMultiplier: number;
  let volatilityMultiplier: number;

  switch (scenario) {
    case 'optimistic':
      returnMultiplier = 1.3;
      volatilityMultiplier = 0.8;
      break;
    case 'pessimistic':
      returnMultiplier = 0.6;
      volatilityMultiplier = 1.4;
      break;
    default:
      returnMultiplier = 1.0;
      volatilityMultiplier = 1.0;
  }

  const adjustedReturn = params.expectedReturn * returnMultiplier;
  const adjustedVolatility = params.volatility * volatilityMultiplier;

  const cycleFactor = Math.sin((year * 1.618) % (2 * Math.PI));
  const volatilityFactor = cycleFactor * adjustedVolatility * 0.6;

  const finalReturn = adjustedReturn + (adjustedReturn * volatilityFactor);

  const minReturn = scenario === 'pessimistic' ? -0.40 : -0.25;
  const maxReturn = scenario === 'optimistic' ? 0.50 : 0.35;

  return Math.max(minReturn, Math.min(maxReturn, finalReturn / 100));
};

interface FirePoint {
  year: number;
  age: number;
  portfolioValue: number;
  fireTargetAtYear: number;
}

interface FireResult {
  fireTarget: number;            // 25x ročních výdajů (dnešní ceny)
  fireAge: number | null;        // věk dosažení FIRE (realistický scénář)
  yearsToFire: number | null;
  fireAmount: number;            // hodnota portfolia v okamžiku dosažení
  monthlyFireIncome: number;     // 4 % z cíle / 12
  projection: FirePoint[];
}

// ===== 1:1 z calculateFireScenario(..., 'realistic') – NEMĚNIT =====
function computeFire(params: {
  currentAge: number;
  currentSavings: number;
  monthlySavings: number;
  monthlyExpensesInFire: number;
  inflationRate: number;
  investmentStrategy: Strategy;
}): FireResult {
  const {
    currentAge, currentSavings, monthlySavings,
    monthlyExpensesInFire, inflationRate, investmentStrategy,
  } = params;

  const yearlyInflation = inflationRate / 100;
  const annualExpensesInFire = monthlyExpensesInFire * 12;
  const fireTarget = annualExpensesInFire * 25; // 4% pravidlo

  const projection: FirePoint[] = [];
  let portfolioValue = currentSavings;
  let totalContributed = currentSavings;
  let fireAge: number | null = null;
  let fireAmount = 0;

  for (let year = 0; year < 50; year++) {
    const age = currentAge + year;
    const yearlyContribution = year === 0 ? 0 : monthlySavings * 12;

    if (year > 0) {
      portfolioValue += yearlyContribution;
      totalContributed += yearlyContribution;

      const portfolioReturn = getPortfolioReturn(investmentStrategy, year, 'realistic');
      portfolioValue *= (1 + portfolioReturn);

      portfolioValue = Math.max(portfolioValue, totalContributed * 0.6);
    }

    const currentFireTarget = fireTarget * Math.pow(1 + yearlyInflation, year);

    projection.push({ year, age, portfolioValue, fireTargetAtYear: currentFireTarget });

    if (fireAge === null && portfolioValue >= currentFireTarget) {
      fireAge = age;
      fireAmount = portfolioValue;
    }
  }

  const monthlyFireIncome = (fireTarget * 0.04) / 12;

  return {
    fireTarget,
    fireAge,
    yearsToFire: fireAge !== null ? fireAge - currentAge : null,
    fireAmount: fireAge !== null ? fireAmount : portfolioValue,
    monthlyFireIncome,
    projection,
  };
}

const fmtCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency', currency: 'CZK', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount);

const fmtCompact = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace('.', ',')} mil.`;
  if (v >= 1_000) return `${Math.round(v / 1000)} tis.`;
  return `${Math.round(v)}`;
};

function NumberField({
  id, label, value, onChange, step, min, max, suffix, hint,
}: {
  id: string; label: React.ReactNode; value: number; onChange: (v: number) => void;
  step?: string; min?: number; max?: number; suffix?: string; hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-slate-600 mb-1">{label}</label>
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
      {hint && <p className="mt-1 text-xs text-slate-400 leading-snug">{hint}</p>}
    </div>
  );
}

const STRATEGIES: { value: Strategy; label: string; sub: string }[] = [
  { value: 'conservative', label: 'Konzervativní', sub: '30 % akcie / 70 % dluhopisy' },
  { value: 'moderate', label: 'Vyvážená', sub: '60 % akcie / 40 % dluhopisy' },
  { value: 'aggressive', label: 'Agresivní', sub: '80 % akcie / 20 % dluhopisy' },
];

interface TooltipPayloadItem { payload: FirePoint }
function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
      <div className="font-semibold mb-1">Věk {p.age} · rok {p.year}</div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-teal-400" /> Portfolio:{' '}
        <span className="font-medium tabular-nums">{fmtCZK(p.portfolioValue)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-slate-400" /> FIRE cíl:{' '}
        <span className="font-medium tabular-nums">{fmtCZK(p.fireTargetAtYear)}</span>
      </div>
    </div>
  );
}

export default function FireKalkulackaWidget() {
  const [currentAge, setCurrentAge] = useState(30);
  const [monthlyExpensesInFire, setMonthlyExpensesInFire] = useState(40000);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlySavings, setMonthlySavings] = useState(15000);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [investmentStrategy, setInvestmentStrategy] = useState<Strategy>('moderate');

  const result = useMemo(
    () => computeFire({
      currentAge, currentSavings, monthlySavings,
      monthlyExpensesInFire, inflationRate, investmentStrategy,
    }),
    [currentAge, currentSavings, monthlySavings, monthlyExpensesInFire, inflationRate, investmentStrategy],
  );

  // Graf ořízneme do roku dosažení FIRE (+2 roky kontextu), jinak celé období do 50 let.
  const chartData = useMemo(() => {
    if (result.yearsToFire !== null) {
      const cut = Math.min(result.projection.length, result.yearsToFire + 3);
      return result.projection.slice(0, Math.max(cut, 2));
    }
    return result.projection.slice(0, 41);
  }, [result]);

  const fireDot = result.fireAge !== null
    ? result.projection.find((p) => p.age === result.fireAge) ?? null
    : null;

  const warnExpenses = monthlyExpensesInFire < 10000;
  const warnInflation = inflationRate < 0 || inflationRate > 10;
  const warnNoFire = result.fireAge === null;

  return (
    <div className="space-y-4">
      {/* Vstupní parametry */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">Vaše vstupy</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberField
            id="age" label="Současný věk" value={currentAge} min={18} max={80} suffix="let"
            onChange={(v) => setCurrentAge(Math.max(18, Math.min(80, v)))}
          />
          <NumberField
            id="expenses"
            label={
              <span className="inline-flex items-center gap-1">
                Měsíční výdaje v nezávislosti
                <InfoTip label="Kolik chcete měsíčně utrácet, až přestanete pracovat — v dnešních cenách. Kalkulačka inflaci dopočítá sama.">
                  <span className="sr-only">dnešní ceny</span>
                </InfoTip>
              </span>
            }
            value={monthlyExpensesInFire} min={5000} step="1000" suffix="Kč"
            hint="V dnešních cenách"
            onChange={(v) => setMonthlyExpensesInFire(Math.max(0, v))}
          />
          <NumberField
            id="savings" label="Současné úspory / portfolio" value={currentSavings} min={0} step="10000" suffix="Kč"
            onChange={(v) => setCurrentSavings(Math.max(0, v))}
          />
          <NumberField
            id="monthly" label="Měsíční spoření / investice" value={monthlySavings} min={0} step="1000" suffix="Kč"
            onChange={(v) => setMonthlySavings(Math.max(0, v))}
          />
          <NumberField
            id="inflation" label="Roční inflace" value={inflationRate} min={0} max={10} step="0.1" suffix="%"
            onChange={(v) => setInflationRate(Math.max(0, Math.min(10, v)))}
          />
          <div>
            <label htmlFor="strategy" className="block text-sm text-slate-600 mb-1">
              <span className="inline-flex items-center gap-1">
                Investiční strategie
                <InfoTip label="Skladba portfolia akcie/dluhopisy. Agresivnější = vyšší očekávaný výnos, ale i vyšší výkyvy. Výnosy vychází z historických dat 1995–2024.">
                  <span className="sr-only">akcie a dluhopisy</span>
                </InfoTip>
              </span>
            </label>
            <select
              id="strategy"
              value={investmentStrategy}
              onChange={(e) => setInvestmentStrategy(e.target.value as Strategy)}
              className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
            >
              {STRATEGIES.map((s) => (
                <option key={s.value} value={s.value}>{s.label} – {s.sub}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400 leading-snug">
              Očekávaný výnos {getPortfolioParameters(investmentStrategy).expectedReturn.toLocaleString('cs-CZ')} % p.a. (nominálně) – cílová částka se navyšuje o inflaci zvlášť.
            </p>
          </div>
        </div>

        {(warnExpenses || warnInflation) && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-900/80">
                <p className="font-semibold text-amber-800">Zkontrolujte zadané hodnoty</p>
                <ul className="mt-1 space-y-0.5">
                  {warnExpenses && <li>Velmi nízké měsíční výdaje – zadejte částku, ze které byste reálně žili.</li>}
                  {warnInflation && <li>Neobvyklá hodnota inflace (mimo 0–10 % ročně).</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Výsledkový panel */}
      {warnNoFire ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 md:p-6">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-sm text-amber-900/80">
              <p className="font-semibold text-amber-800">Při těchto vstupech nezávislosti do 50 let nedosáhnete</p>
              <p className="mt-1">
                Zkuste zvýšit měsíční spoření, snížit cílové výdaje nebo zvolit agresivnější strategii.
                Cílová částka (
                <InfoTip label="Pravidlo 4 % (Trinity Study): při výběru 4 % ročně portfolio s vysokou pravděpodobností vydrží desítky let. Odpovídá 25násobku ročních výdajů.">
                  pravidlo 4 %
                </InfoTip>
                ) vychází na <strong>{fmtCZK(result.fireTarget)}</strong> v dnešních cenách.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-teal-700 text-white p-5 md:p-7">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-100">
            <Sparkles className="w-4 h-4" /> Váš výsledek
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <p className="text-sm text-teal-100">Nezávislosti dosáhnete ve věku</p>
              <p className="text-3xl md:text-4xl font-bold tabular-nums mt-1">
                {result.fireAge} let
              </p>
              <p className="text-xs text-teal-200 mt-1">
                tj. za {result.yearsToFire} {result.yearsToFire === 1 ? 'rok' : (result.yearsToFire ?? 0) < 5 ? 'roky' : 'let'}
              </p>
            </div>
            <div className="sm:border-l sm:border-white/15 sm:pl-5">
              <p className="text-sm text-teal-100">Cílová částka (
                <InfoTip label="Pravidlo 4 % (Trinity Study): 25násobek ročních výdajů. Z takového portfolia můžete vybírat ~4 % ročně a s vysokou pravděpodobností vám vydrží.">
                  <span className="text-teal-50 underline decoration-dotted">pravidlo 4 %</span>
                </InfoTip>
                )
              </p>
              <p className="text-3xl md:text-4xl font-bold tabular-nums mt-1">{fmtCZK(result.fireTarget)}</p>
              <p className="text-xs text-teal-200 mt-1">v dnešních cenách</p>
            </div>
            <div className="sm:border-l sm:border-white/15 sm:pl-5">
              <p className="text-sm text-teal-100">Měsíční příjem z portfolia</p>
              <p className="text-3xl md:text-4xl font-bold tabular-nums mt-1">{fmtCZK(result.monthlyFireIncome)}</p>
              <p className="text-xs text-teal-200 mt-1">při výběru 4 % ročně</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-teal-50 leading-relaxed border-t border-white/15 pt-4">
            Při měsíčním spoření <strong className="font-semibold">{fmtCZK(monthlySavings)}</strong> a strategii{' '}
            {STRATEGIES.find((s) => s.value === investmentStrategy)?.label.toLowerCase()} naroste portfolio na cílovou
            částku v okamžiku dosažení nezávislosti zhruba na <strong className="font-semibold">{fmtCZK(result.fireAmount)}</strong>.
            Cíl počítáme inflačně navýšený, takže zadáváte dnešní výdaje.
          </p>
        </div>
      )}

      {/* Graf vývoje majetku */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">
          Vývoj majetku v čase
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-slate-600">
          <span className="flex items-center gap-1.5"><span className="inline-block w-3.5 h-1 rounded-full bg-teal-600" /> Hodnota portfolia</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3.5 h-0 border-t-2 border-dashed border-slate-400" /> FIRE cíl (s inflací)</span>
          {fireDot && (
            <span className="flex items-center gap-1.5 sm:ml-auto"><Flame className="w-3.5 h-3.5 text-teal-600" /> bod dosažení nezávislosti</span>
          )}
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="fireFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="age"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(v: number) => `${v} let`}
                minTickGap={24}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                width={52}
                tickFormatter={(v: number) => fmtCompact(v)}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }} />
              <Area
                type="monotone"
                dataKey="fireTargetAtYear"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="5 4"
                fill="none"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="portfolioValue"
                stroke="#0d9488"
                strokeWidth={2.5}
                fill="url(#fireFill)"
                dot={false}
                isAnimationActive={false}
              />
              {fireDot && (
                <>
                  <ReferenceLine x={fireDot.age} stroke="#0d9488" strokeDasharray="3 3" strokeWidth={1} />
                  <ReferenceDot
                    x={fireDot.age}
                    y={fireDot.portfolioValue}
                    r={5}
                    fill="#0d9488"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <p className="mt-3 text-xs text-slate-500 leading-relaxed">
          Tyrkysová křivka je hodnota vašeho portfolia, čárkovaná je cílová částka navyšovaná o inflaci.
          {fireDot
            ? ` Jakmile se křivky protnou (věk ${fireDot.age}), dosáhnete finanční nezávislosti.`
            : ' V zadaném horizontu se křivky neprotnou – zkuste upravit vstupy.'}
        </p>
      </div>

    </div>
  );
}
