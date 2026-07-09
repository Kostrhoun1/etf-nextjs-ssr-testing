'use client';

import React, { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { TrendingUp, AlertTriangle, Sparkles, Flame, ChevronUp, ChevronDown } from 'lucide-react';
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

/* Očekávaný (nominální) roční výnos strategie. FIRE ukazuje očekávanou střední
   dráhu – nejistotu a výkyvy záměrně řeší samostatná Monte Carlo simulace, ne
   pseudonáhodný ornament. Proto tu žádný „Math.sin" ani umělá volatilita nejsou. */
const expectedAnnualReturn = (strategy: Strategy): number =>
  getPortfolioParameters(strategy).expectedReturn / 100;

interface FirePoint {
  year: number;
  age: number;
  portfolioValue: number;
  realValue: number;        // hodnota portfolia v dnešní kupní síle
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

/* Poctivý model očekávané dráhy: portfolio roste očekávaným výnosem strategie,
   cílová částka i (volitelně) měsíční spoření se navyšují o inflaci – aby model
   nebyl asymetrický (dřív cíl rostl s inflací, ale vklad byl konstantní, což FIRE
   uměle oddalovalo). Bez pseudonáhodných výkyvů a bez umělé „podlahy". */
function computeFire(params: {
  currentAge: number;
  currentSavings: number;
  monthlySavings: number;
  monthlyExpensesInFire: number;
  inflationRate: number;
  investmentStrategy: Strategy;
  growContributions: boolean;
}): FireResult {
  const {
    currentAge, currentSavings, monthlySavings,
    monthlyExpensesInFire, inflationRate, investmentStrategy, growContributions,
  } = params;

  const yearlyInflation = inflationRate / 100;
  const r = expectedAnnualReturn(investmentStrategy);
  const annualExpensesInFire = monthlyExpensesInFire * 12;
  const fireTarget = annualExpensesInFire * 25; // 4% pravidlo

  const projection: FirePoint[] = [];
  let portfolioValue = currentSavings;
  let fireAge: number | null = null;
  let fireAmount = 0;

  for (let year = 0; year < 50; year++) {
    const age = currentAge + year;

    if (year > 0) {
      // Volitelně valorizujeme roční vklad o inflaci (mzdy typicky rostou s inflací).
      const yearlyContribution = (monthlySavings * 12) *
        (growContributions ? Math.pow(1 + yearlyInflation, year - 1) : 1);
      portfolioValue += yearlyContribution;
      portfolioValue *= (1 + r);
    }

    const currentFireTarget = fireTarget * Math.pow(1 + yearlyInflation, year);
    const realValue = portfolioValue / Math.pow(1 + yearlyInflation, year);

    projection.push({ year, age, portfolioValue, realValue, fireTargetAtYear: currentFireTarget });

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

/* Normální rozdělení (Box-Muller). Klientský Math.random je tu v pořádku. */
function randNormal(mean: number, sd: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

interface FireBandPoint { age: number; low: number; mid: number; high: number; targetReal: number }
interface FireRange {
  fastYears: number | null;   // 10. percentil (když se dařilo)
  medYears: number | null;    // medián
  slowYears: number | null;   // 90. percentil (když se nedařilo)
  currentAge: number;
  targetReal: number;
  band: FireBandPoint[];
  halfAge: number | null;       // věk, kdy medián dosáhne 50 % cíle
  firstYearAge: number | null;  // věk, kdy medián pokryje 1 rok výdajů
}

/* Monte Carlo v REÁLNÝCH korunách (dnešní kupní síla): reálný výnos = (1+nom)/(1+infl)-1,
   měsíční kroky s kolísáním, cíl je konstantní (25× ročních výdajů dnes). Vrací rozsah LET
   do cíle (10./50./90. percentil) + pás hodnot pro graf. Nejistota akumulace = KDY, ne JESTLI. */
/* Volitelné „životní události" na časové ose (v dnešních korunách):
   jednorázový výdaj (auto, rekonstrukce), jednorázový příliv (dědictví, prodej),
   dodatečný měsíční příjem (přivýdělek) do roku N. Modelujeme je v reálných korunách. */
type LifeEventType = 'oneoffExpense' | 'oneoffIncome' | 'monthlyIncome';
interface LifeEvent { id: number; type: LifeEventType; amount: number; year: number }

function computeFireRange(params: {
  currentAge: number; currentSavings: number; monthlySavings: number;
  monthlyExpensesInFire: number; inflationRate: number; investmentStrategy: Strategy;
  growContributions: boolean; events: LifeEvent[];
}, sims = 600): FireRange {
  const { currentAge, currentSavings, monthlySavings, monthlyExpensesInFire,
    inflationRate, investmentStrategy, growContributions, events } = params;
  const infl = inflationRate / 100;
  const rNom = getPortfolioParameters(investmentStrategy).expectedReturn / 100;
  const vol = getPortfolioParameters(investmentStrategy).volatility;
  const rReal = (1 + rNom) / (1 + infl) - 1;
  const mMean = Math.pow(1 + rReal, 1 / 12) - 1;
  const mVol = vol / Math.sqrt(12);
  const annualExpenses = monthlyExpensesInFire * 12;
  const targetReal = annualExpenses * 25;
  const YEARS = 50, MONTHS = YEARS * 12;

  const yearsReached: number[] = [];
  const perYear: number[][] = Array.from({ length: YEARS + 1 }, () => []);

  for (let s = 0; s < sims; s++) {
    let pv = currentSavings; // reálné dnešní koruny
    let reached: number | null = null;
    perYear[0].push(pv);
    for (let m = 1; m <= MONTHS; m++) {
      const year = Math.floor((m - 1) / 12);
      // reálný měsíční vklad: s valorizací = konstantní reálně; bez ní klesá reálnou hodnotu
      const realMonthly = growContributions ? monthlySavings : monthlySavings / Math.pow(1 + infl, year);
      pv += realMonthly;
      // Životní události (v dnešních korunách): měsíční přivýdělek do roku N + jednorázové v roce N.
      for (const ev of events) {
        if (ev.type === 'monthlyIncome') { if (year < ev.year) pv += ev.amount; }
        else if (m === ev.year * 12) {
          if (ev.type === 'oneoffIncome') pv += ev.amount;
          else pv -= ev.amount; // oneoffExpense
        }
      }
      pv *= (1 + randNormal(mMean, mVol));
      if (pv < 0) pv = 0;
      if (reached === null && pv >= targetReal) reached = m;
      if (m % 12 === 0) perYear[m / 12].push(pv);
    }
    yearsReached.push(reached === null ? MONTHS : reached);
  }

  yearsReached.sort((a, b) => a - b);
  const qYears = (p: number) => yearsReached[Math.min(sims - 1, Math.floor(p * sims))] / 12;
  const norm = (y: number): number | null => (y >= YEARS ? null : Math.max(0, Math.round(y)));

  const band: FireBandPoint[] = perYear.map((arr, y) => {
    arr.sort((a, b) => a - b);
    const pick = (p: number) => arr[Math.min(arr.length - 1, Math.floor(p * arr.length))];
    return { age: currentAge + y, low: pick(0.10), mid: pick(0.50), high: pick(0.90), targetReal };
  });

  let halfAge: number | null = null, firstYearAge: number | null = null;
  for (const b of band) {
    if (halfAge === null && b.mid >= targetReal * 0.5) halfAge = b.age;
    if (firstYearAge === null && b.mid >= annualExpenses) firstYearAge = b.age;
  }

  return {
    fastYears: norm(qYears(0.10)), medYears: norm(qYears(0.50)), slowYears: norm(qYears(0.90)),
    currentAge, targetReal, band, halfAge, firstYearAge,
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


export default function FireKalkulackaWidget() {
  const [currentAge, setCurrentAge] = useState(30);
  const [monthlyExpensesInFire, setMonthlyExpensesInFire] = useState(40000);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlySavings, setMonthlySavings] = useState(15000);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [investmentStrategy, setInvestmentStrategy] = useState<Strategy>('moderate');
  const [growContributions, setGrowContributions] = useState(true);
  const [events, setEvents] = useState<LifeEvent[]>([]);

  const result = useMemo(
    () => computeFire({
      currentAge, currentSavings, monthlySavings,
      monthlyExpensesInFire, inflationRate, investmentStrategy, growContributions,
    }),
    [currentAge, currentSavings, monthlySavings, monthlyExpensesInFire, inflationRate, investmentStrategy, growContributions],
  );

  // Monte Carlo rozsah (kolísání trhu) – nejistota akumulace je „kdy", ne „jestli".
  const range = useMemo(
    () => computeFireRange({
      currentAge, currentSavings, monthlySavings,
      monthlyExpensesInFire, inflationRate, investmentStrategy, growContributions, events,
    }),
    [currentAge, currentSavings, monthlySavings, monthlyExpensesInFire, inflationRate, investmentStrategy, growContributions, events],
  );

  const addEvent = () => setEvents((p) => [...p, { id: (p.length ? p[p.length - 1].id : 0) + 1, type: 'oneoffExpense', amount: 300000, year: 5 }]);
  const updateEvent = (id: number, patch: Partial<LifeEvent>) => setEvents((p) => p.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const removeEvent = (id: number) => setEvents((p) => p.filter((e) => e.id !== id));

  // Graf: pás jistoty (10.–90. percentil) kolem střední (mediánové) dráhy, v dnešních korunách.
  // Ořízneme do „když se nedařilo" + kontext, jinak do 50 let.
  const chartData = useMemo(() => {
    const horizon = range.slowYears != null ? range.slowYears + 3 : 40;
    return range.band.slice(0, Math.max(2, Math.min(range.band.length, horizon + 1)))
      .map((b) => ({ age: b.age, low: b.low, bandHeight: Math.max(0, b.high - b.low), mid: b.mid, high: b.high, targetReal: b.targetReal }));
  }, [range]);

  const warnExpenses = monthlyExpensesInFire < 10000;
  const warnInflation = inflationRate < 0 || inflationRate > 10;
  const warnNoFire = range.medYears === null;
  // Věky dosažení z Monte Carlo rozsahu (nejistota je „kdy", ne „jestli").
  const fastAge = range.fastYears != null ? range.currentAge + range.fastYears : null;
  const medAge = range.medYears != null ? range.currentAge + range.medYears : null;
  const slowAge = range.slowYears != null ? range.currentAge + range.slowYears : null;

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

        <label className="mt-4 flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={growContributions}
            onChange={(e) => setGrowContributions(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <span className="text-sm text-slate-600">
            Navyšovat měsíční spoření o inflaci
            <span className="block text-xs text-slate-400 leading-snug">Realističtější – mzdy i spoření obvykle rostou s inflací. Bez toho model dosažení nezávislosti uměle oddaluje.</span>
          </span>
        </label>

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

      {/* Životní události – volitelně, za rozklikem (default zůstane čistý) */}
      <details className="group rounded-lg border border-slate-200 bg-white">
        <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none">
          <span>
            <span className="text-sm font-medium text-slate-800">Životní události (volitelné)</span>
            <span className="block text-xs text-slate-400 mt-0.5">
              Velký výdaj, dědictví nebo přivýdělek v konkrétním roce – {events.length ? `${events.length} přidáno` : 'zpřesní odhad'}.
            </span>
          </span>
          <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
        </summary>
        <div className="px-5 pb-5 space-y-2.5">
          {events.map((ev) => (
            <div key={ev.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2.5">
              <select
                value={ev.type}
                onChange={(e) => updateEvent(ev.id, { type: e.target.value as LifeEventType })}
                className="min-h-[40px] rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
              >
                <option value="oneoffExpense">Jednorázový výdaj</option>
                <option value="oneoffIncome">Jednorázový příliv (dědictví…)</option>
                <option value="monthlyIncome">Měsíční přivýdělek</option>
              </select>
              <div className="relative">
                <input
                  type="number" inputMode="numeric" min={0} step={10000} value={ev.amount}
                  onChange={(e) => updateEvent(ev.id, { amount: Math.max(0, Number(e.target.value)) })}
                  className="w-32 min-h-[40px] rounded-lg border border-slate-200 bg-white pl-2.5 pr-14 py-1.5 text-right text-sm text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  Kč{ev.type === 'monthlyIncome' ? '/měs' : ''}
                </span>
              </div>
              <span className="text-xs text-slate-500">{ev.type === 'monthlyIncome' ? 'do roku' : 'v roce'}</span>
              <div className="relative">
                <input
                  type="number" inputMode="numeric" min={1} max={50} value={ev.year}
                  onChange={(e) => updateEvent(ev.id, { year: Math.max(1, Math.min(50, Number(e.target.value))) })}
                  className="w-16 min-h-[40px] rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-right text-sm text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <button
                onClick={() => removeEvent(ev.id)} aria-label="Odebrat událost"
                className="ml-auto flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >×</button>
            </div>
          ))}
          <button
            onClick={addEvent}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-teal-300 hover:bg-teal-50/40 transition-colors"
          >
            + Přidat událost
          </button>
          <p className="text-xs text-slate-400 leading-relaxed">
            Částky zadávejte v dnešních cenách; rok = za kolik let od teď. Události se promítnou do rozsahu i grafu výše.
          </p>
        </div>
      </details>

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
          {/* Headline = rozsah věku (nejistota akumulace je „kdy", ne „jestli") */}
          <p className="mt-3 text-2xl md:text-3xl font-bold leading-tight text-balance">
            Nezávislosti dosáhnete nejspíš <span className="whitespace-nowrap">mezi {fastAge} a {slowAge} lety</span>, obvykle kolem {medAge}.
          </p>
          <p className="mt-1.5 text-sm text-teal-100 leading-relaxed">
            Podle 600 simulací s kolísáním trhu
            <InfoTip label="Simulujeme stovky možných vývojů trhu (kolísání nahoru i dolů). V akumulaci portfolio cíle skoro vždy nakonec dosáhne – nejistota je hlavně KDY, ne jestli.">
              <span className="text-teal-50 underline decoration-dotted"> proč rozsah?</span>
            </InfoTip>
            {' '}– v polovině případů jste v cíli do {medAge} let, ve většině do {slowAge}.
          </p>
          {/* Tři čísla: dařilo / obvykle / nedařilo */}
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <div className="rounded-lg bg-white/10 px-3 py-2.5">
              <p className="text-[11px] text-teal-100 leading-tight">Když se trhu dařilo</p>
              <p className="text-xl md:text-2xl font-bold tabular-nums mt-0.5">{fastAge} let</p>
              <p className="text-[11px] text-teal-200">za ~{range.fastYears} let</p>
            </div>
            <div className="rounded-lg bg-white/[0.18] ring-1 ring-white/25 px-3 py-2.5">
              <p className="text-[11px] text-teal-50 leading-tight">Nejčastěji</p>
              <p className="text-xl md:text-2xl font-bold tabular-nums mt-0.5">{medAge} let</p>
              <p className="text-[11px] text-teal-100">za ~{range.medYears} let</p>
            </div>
            <div className="rounded-lg bg-white/10 px-3 py-2.5">
              <p className="text-[11px] text-teal-100 leading-tight">Když se nedařilo</p>
              <p className="text-xl md:text-2xl font-bold tabular-nums mt-0.5">{slowAge} let</p>
              <p className="text-[11px] text-teal-200">za ~{range.slowYears} let</p>
            </div>
          </div>
          {/* Sekundárně: cílová částka + měsíční příjem */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/15 pt-4">
            <div>
              <p className="text-sm text-teal-100">Cílová částka (
                <InfoTip label="Pravidlo 4 % (Trinity Study): 25násobek ročních výdajů. Z takového portfolia můžete vybírat ~4 % ročně a s vysokou pravděpodobností vydrží.">
                  <span className="text-teal-50 underline decoration-dotted">pravidlo 4 %</span>
                </InfoTip>
                )
              </p>
              <p className="text-2xl md:text-3xl font-bold tabular-nums mt-0.5">{fmtCZK(range.targetReal)}</p>
              <p className="text-xs text-teal-200 mt-0.5">v dnešní kupní síle</p>
            </div>
            <div className="sm:border-l sm:border-white/15 sm:pl-4">
              <p className="text-sm text-teal-100">Měsíční příjem z portfolia</p>
              <p className="text-2xl md:text-3xl font-bold tabular-nums mt-0.5">{fmtCZK(range.targetReal * 0.04 / 12)}</p>
              <p className="text-xs text-teal-200 mt-0.5">při výběru 4 % ročně</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-teal-100/90 leading-relaxed">
            Všechny částky jsou <strong className="font-semibold text-teal-50">v dnešní kupní síle</strong> – {fmtCZK(range.targetReal)} znamená, co si za tolik koupíte dnes (inflaci máme započítanou).
          </p>
        </div>
      )}

      {/* Milníky na cestě (z mediánové dráhy) – jen ty budoucí (věk > současný) */}
      {!warnNoFire && ((range.firstYearAge != null && range.firstYearAge > range.currentAge) || (range.halfAge != null && range.halfAge > range.currentAge)) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {range.firstYearAge != null && range.firstYearAge > range.currentAge && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-teal-50 text-teal-700"><Flame className="w-4 h-4" /></span>
              <div><p className="text-sm font-medium text-slate-900">První rok svobody pokrytý</p>
              <p className="text-xs text-slate-500 mt-0.5">Kolem věku <strong className="text-slate-700">{range.firstYearAge}</strong> už portfolio pokryje jeden celý rok vašich výdajů.</p></div>
            </div>
          )}
          {range.halfAge != null && range.halfAge > range.currentAge && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-teal-50 text-teal-700"><TrendingUp className="w-4 h-4" /></span>
              <div><p className="text-sm font-medium text-slate-900">Polovina cesty</p>
              <p className="text-xs text-slate-500 mt-0.5">Kolem věku <strong className="text-slate-700">{range.halfAge}</strong> máte 50 % cíle – dál to díky složenému úročení zrychluje.</p></div>
            </div>
          )}
        </div>
      )}

      {/* Graf vývoje majetku */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">
          Vývoj majetku v čase
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-slate-600">
          <span className="flex items-center gap-1.5"><span className="inline-block w-3.5 h-1 rounded-full bg-teal-600" /> Střední (nejpravděpodobnější) dráha</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3.5 h-2.5 rounded-sm bg-teal-600/15 border border-teal-600/20" /> Pás možností (kolísání trhu)</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3.5 h-0 border-t-2 border-dashed border-slate-400" /> FIRE cíl</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
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
              <Tooltip
                cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const p = payload[0].payload as { age: number; low: number; mid: number; high: number };
                  return (
                    <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
                      <div className="font-semibold mb-0.5">Věk {p.age} let</div>
                      <div>Obvykle: <span className="font-medium tabular-nums">{fmtCZK(p.mid)}</span></div>
                      <div className="text-slate-300">Rozpětí {fmtCompact(p.low)} – {fmtCompact(p.high)}</div>
                    </div>
                  );
                }}
              />
              {/* Pás jistoty: spodní hrana (neviditelná) + výška pásu (světlá výplň) */}
              <Area type="monotone" dataKey="low" stackId="band" stroke="none" fill="transparent" isAnimationActive={false} />
              <Area type="monotone" dataKey="bandHeight" stackId="band" stroke="none" fill="#0d9488" fillOpacity={0.13} isAnimationActive={false} />
              {/* Cíl (čárkovaně) */}
              <Area type="monotone" dataKey="targetReal" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" fill="none" dot={false} activeDot={false} isAnimationActive={false} />
              {/* Střední dráha */}
              <Area type="monotone" dataKey="mid" stroke="#0d9488" strokeWidth={2.5} fill="none" dot={false} isAnimationActive={false} />
              {medAge != null && <ReferenceLine x={medAge} stroke="#0d9488" strokeDasharray="3 3" strokeWidth={1} />}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <p className="mt-3 text-xs text-slate-500 leading-relaxed">
          Tyrkysová čára je nejpravděpodobnější vývoj, světlý pás ukazuje rozpětí podle toho, jak se povede trhu. Kde pás protne čárkovanou čáru cíle, tam se pohybuje věk dosažení nezávislosti. Vše v dnešní kupní síle.
        </p>
      </div>

    </div>
  );
}
