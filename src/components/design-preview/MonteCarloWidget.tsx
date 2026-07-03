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
import {
  Play,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Sparkles,
  Wallet,
  Dices,
} from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';

/**
 * Interaktivní jádro Monte Carlo simulátoru portfolia – redesign.
 *
 * Výpočetní logika (model aktiv, korelační matice, Choleskyho dekompozice,
 * generování měsíčních výnosů, běh simulací a výpočet percentilů) je převzata
 * 1:1 z ověřené utility `src/utils/monteCarloUtils.ts` (funkce
 * `runMonteCarloSimulation`, konstanty `ASSETS`, `ASSET_KEYS`,
 * `CORRELATION_MATRIX`) a typů `src/types/monteCarlo.ts`. Měněn je POUZE
 * vizuál (teal/slate, design systém, graf přes recharts). Finanční logiku
 * neměnit.
 *
 * JEDINÁ funkční odchylka oproti originálu: zdroj náhody `Math.random()` je
 * nahrazen DETERMINISTICKÝM generátorem se semínkem (Mulberry32). Důvod: aby
 * byly výsledky napříč spuštěními konzistentní a aby případný prerender
 * nepadal na nedeterminismu. Statistika (Box–Muller, korelace, percentily)
 * zůstává totožná.
 */

// ===== Typy (1:1 z src/types/monteCarlo.ts) =====
type AssetClass =
  | 'us_large'
  | 'us_small'
  | 'emerging'
  | 'intl_dev'
  | 'canada'
  | 'reits'
  | 'us_high_yield'
  | 'us_quality_bond'
  | 'intl_bond'
  | 'gold'
  | 'cash';

type AssetAllocation = Record<AssetClass, number>;

interface SimulationResult {
  year: number;
  percentile5: number;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile95: number;
  mean: number;
}

// ===== VÝPOČET 1:1 z src/utils/monteCarloUtils.ts – NEMĚNIT (kromě zdroje náhody) =====

// Roční výnos a volatilita aktiv
const ASSETS: Record<AssetClass, { label: string; annualReturn: number; volatility: number }> = {
  us_large: { label: 'US velké akcie', annualReturn: 0.086, volatility: 0.168 },
  us_small: { label: 'US malé akcie', annualReturn: 0.076, volatility: 0.205 },
  emerging: { label: 'Akcie rozvíjejících se trhů', annualReturn: 0.073, volatility: 0.231 },
  intl_dev: { label: 'Rozvinuté zahraniční akcie', annualReturn: 0.062, volatility: 0.194 },
  canada: { label: 'Kanadské akcie', annualReturn: 0.06, volatility: 0.172 },
  reits: { label: 'REITs (nemovitosti)', annualReturn: 0.058, volatility: 0.187 },
  us_high_yield: { label: 'US vysoce výnosné dluhopisy', annualReturn: 0.048, volatility: 0.089 },
  us_quality_bond: { label: 'US vysokokvalitní dluhopisy', annualReturn: 0.042, volatility: 0.054 },
  intl_bond: { label: 'Mezinárodní dluhopisy', annualReturn: 0.026, volatility: 0.108 },
  gold: { label: 'Zlato', annualReturn: 0.023, volatility: 0.162 },
  cash: { label: 'Hotovost (státní pokladniční poukázky)', annualReturn: 0.004, volatility: 0.015 },
};

const ASSET_KEYS: AssetClass[] = [
  'us_large', 'us_small', 'intl_dev', 'emerging', 'canada',
  'us_quality_bond', 'us_high_yield', 'intl_bond', 'reits', 'gold', 'cash',
];

const CORRELATION_MATRIX: number[][] = [
  /*us_large*/        [1, 0.85, 0.78, 0.65, 0.74, 0.15, 0.45, 0.25, 0.65, 0.05, -0.05],
  /*us_small*/        [0.85, 1, 0.72, 0.7, 0.68, 0.1, 0.5, 0.2, 0.7, 0, -0.1],
  /*intl_dev*/        [0.78, 0.72, 1, 0.8, 0.82, 0.25, 0.4, 0.45, 0.55, 0.15, 0],
  /*emerging*/        [0.65, 0.7, 0.8, 1, 0.6, 0.2, 0.35, 0.3, 0.5, 0.1, 0.05],
  /*canada*/          [0.74, 0.68, 0.82, 0.6, 1, 0.22, 0.42, 0.35, 0.58, 0.12, 0.02],
  /*us_quality_bond*/ [0.15, 0.1, 0.25, 0.2, 0.22, 1, 0.65, 0.55, 0.2, 0.3, 0.35],
  /*us_high_yield*/   [0.45, 0.5, 0.4, 0.35, 0.42, 0.65, 1, 0.45, 0.55, 0.15, 0.2],
  /*intl_bond*/       [0.25, 0.2, 0.45, 0.3, 0.35, 0.55, 0.45, 1, 0.3, 0.25, 0.3],
  /*reits*/           [0.65, 0.7, 0.55, 0.5, 0.58, 0.2, 0.55, 0.3, 1, 0.15, -0.1],
  /*gold*/            [0.05, 0, 0.15, 0.1, 0.12, 0.3, 0.15, 0.25, 0.15, 1, 0.2],
  /*cash*/            [-0.05, -0.1, 0, 0.05, 0.02, 0.35, 0.2, 0.3, -0.1, 0.2, 1],
];

function choleskyDecomposition(matrix: number[][]): number[][] {
  const n = matrix.length;
  const L = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) sum += L[i][k] * L[j][k];
      if (i === j) L[i][j] = Math.sqrt(matrix[i][i] - sum);
      else L[i][j] = (matrix[i][j] - sum) / L[j][j];
    }
  }
  return L;
}
const CHOLESKY = choleskyDecomposition(CORRELATION_MATRIX);

// Deterministický generátor náhody (Mulberry32) – nahrazuje Math.random().
// Stejné semínko ⇒ stejná posloupnost ⇒ konzistentní výsledky.
function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateCorrelatedStandardNormals(rng: () => number): number[] {
  const n = ASSET_KEYS.length;
  const z: number[] = Array.from({ length: n }, () => {
    // Box–Muller pro N(0,1)
    const u = rng();
    const v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  });
  const correlated: number[] = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let k = 0; k <= i; k++) sum += CHOLESKY[i][k] * z[k];
    correlated.push(sum);
  }
  return correlated;
}

function generateMonthlyReturns(rng: () => number): number[] {
  const normals = generateCorrelatedStandardNormals(rng);
  return ASSET_KEYS.map((key, i) => {
    const annualR = ASSETS[key].annualReturn;
    const vol = ASSETS[key].volatility;
    const monthlyMu = Math.log(1 + annualR) / 12;
    const monthlySigma = vol / Math.sqrt(12);
    return Math.exp(monthlyMu + monthlySigma * normals[i]) - 1;
  });
}

interface SimulationParameters {
  allocation: AssetAllocation;
  initialInvestment: number;
  monthlyContribution: number;
  years: number;
  simulations: number;
  seed: number;
}

function runMonteCarloSimulation(params: SimulationParameters): SimulationResult[] {
  const { allocation, initialInvestment, monthlyContribution, years, simulations, seed } = params;
  const nAssets = ASSET_KEYS.length;
  const monthsTotal = years * 12;
  const allSimulations: number[][] = [];
  const rng = createRng(seed);

  for (let sim = 0; sim < simulations; sim++) {
    let value = initialInvestment;
    const values: number[] = [initialInvestment];

    for (let month = 1; month <= monthsTotal; month++) {
      value += monthlyContribution;
      const rets = generateMonthlyReturns(rng);
      let portRet = 0;
      for (let i = 0; i < nAssets; i++) {
        const key = ASSET_KEYS[i];
        const weight = allocation[key];
        portRet += (weight / 100) * rets[i];
      }
      value = value * (1 + portRet);
      if (month % 12 === 0) values.push(value);
    }
    allSimulations.push(values);
  }

  const results: SimulationResult[] = [];
  for (let year = 0; year <= years; year++) {
    const yearVals = allSimulations.map((sim) => sim[year]).sort((a, b) => a - b);
    const p = (q: number) => yearVals[Math.floor(simulations * q)];
    const mean = yearVals.reduce((acc, v) => acc + v, 0) / yearVals.length;
    results.push({
      year,
      percentile5: p(0.05),
      percentile25: p(0.25),
      percentile50: p(0.5),
      percentile75: p(0.75),
      percentile95: p(0.95),
      mean,
    });
  }
  return results;
}
// ===== KONEC převzaté logiky =====

// ===== Modelová portfolia (kompaktní volba alokace) =====
const PRESETS: { id: string; name: string; desc: string; allocation: AssetAllocation }[] = [
  {
    id: 'akcie100',
    name: '100 % akcie',
    desc: 'Růstové, kolísavé',
    allocation: {
      us_large: 60, us_small: 0, emerging: 10, intl_dev: 30, canada: 0,
      reits: 0, us_high_yield: 0, us_quality_bond: 0, intl_bond: 0, gold: 0, cash: 0,
    },
  },
  {
    id: 'vyvazene6040',
    name: '60 / 40',
    desc: 'Akcie a dluhopisy',
    allocation: {
      us_large: 40, us_small: 0, emerging: 0, intl_dev: 20, canada: 0,
      reits: 0, us_high_yield: 0, us_quality_bond: 30, intl_bond: 10, gold: 0, cash: 0,
    },
  },
  {
    id: 'konzervativni',
    name: 'Opatrné',
    desc: 'Klidnější průběh',
    allocation: {
      us_large: 25, us_small: 0, emerging: 0, intl_dev: 10, canada: 0,
      reits: 0, us_high_yield: 0, us_quality_bond: 45, intl_bond: 10, gold: 5, cash: 5,
    },
  },
  {
    id: 'allweather',
    name: 'Všepočasní',
    desc: 'Široká diverzifikace',
    allocation: {
      us_large: 30, us_small: 0, emerging: 0, intl_dev: 0, canada: 0,
      reits: 0, us_high_yield: 0, us_quality_bond: 40, intl_bond: 15, gold: 7, cash: 0,
    },
  },
];

// Aktiva nabízená v editoru alokace (podmnožina s rozumnými volbami)
const EDITABLE_KEYS: AssetClass[] = [
  'us_large', 'intl_dev', 'emerging', 'us_quality_bond', 'intl_bond', 'reits', 'gold', 'cash',
];

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

const yearWord = (n: number) => (n === 1 ? 'roce' : n >= 2 && n <= 4 ? 'letech' : 'letech');

function getDefaultAllocation(): AssetAllocation {
  return PRESETS[1].allocation; // 60/40
}

type ChartDatum = {
  year: number;
  pesimisticky: number;
  konzervativni: number;
  median: number;
  optimisticky: number;
  velmiOptimisticky: number;
};

function GraphTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartDatum }>;
  label?: number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  const rows: [string, number, string][] = [
    ['Optimistický (95 %)', d.velmiOptimisticky, 'bg-emerald-400'],
    ['Spíše dobrý (75 %)', d.optimisticky, 'bg-teal-300'],
    ['Medián (50 %)', d.median, 'bg-teal-500'],
    ['Spíše slabý (25 %)', d.konzervativni, 'bg-amber-300'],
    ['Pesimistický (5 %)', d.pesimisticky, 'bg-red-400'],
  ];
  return (
    <div className="rounded-lg bg-slate-900 px-3 py-2.5 text-xs text-white shadow-lg whitespace-nowrap">
      <div className="font-semibold mb-1.5">
        Po {label} {yearWord(Number(label))}
      </div>
      <div className="space-y-1">
        {rows.map(([name, val, dot]) => (
          <div key={name} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className={`inline-block w-2 h-2 rounded-full ${dot}`} /> {name}
            </span>
            <span className="font-medium tabular-nums">{fmtCZK(val)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MonteCarloWidget() {
  // Vstupy 1:1 s původním simulátorem (MonteCarloSimulator.tsx)
  const [allocation, setAllocation] = useState<AssetAllocation>(getDefaultAllocation());
  const [activePreset, setActivePreset] = useState<string | null>('vyvazene6040');
  const [initialInvestment, setInitialInvestment] = useState<number>(100000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(5000);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(20);
  const [simulations, setSimulations] = useState<number>(600);
  const [goalAmount, setGoalAmount] = useState<number>(3000000);

  const [results, setResults] = useState<SimulationResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Parametry zafixované v okamžiku posledního výpočtu (pro popisky výsledků)
  const [ranWith, setRanWith] = useState<{
    years: number;
    simulations: number;
    goal: number;
    initial: number;
    monthly: number;
    probGoal: number;
  } | null>(null);

  const totalAllocation = useMemo(
    () => Object.values(allocation).reduce((sum, v) => sum + v, 0),
    [allocation],
  );

  const applyPreset = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setAllocation({ ...preset.allocation });
    setActivePreset(id);
    setResults(null);
  };

  const setAssetWeight = (asset: AssetClass, value: number) => {
    setAllocation((prev) => ({ ...prev, [asset]: Math.max(0, Math.min(100, value)) }));
    setActivePreset(null);
    setResults(null);
  };

  const normalizeAllocation = () => {
    const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
    if (total !== 100 && total > 0) {
      const factor = 100 / total;
      const next = {} as AssetAllocation;
      (Object.keys(allocation) as AssetClass[]).forEach((key) => {
        next[key] = Math.round(allocation[key] * factor);
      });
      setAllocation(next);
      setActivePreset(null);
      setResults(null);
    }
  };

  const runSimulation = () => {
    if (totalAllocation !== 100) return;
    setIsLoading(true);
    // Deterministické semínko odvozené ze vstupů: stejné zadání ⇒ stejný výsledek.
    const seed =
      (initialInvestment * 31 +
        monthlyContribution * 17 +
        investmentPeriod * 7 +
        simulations * 13 +
        totalAllocation) >>> 0 || 1;

    // necháme prohlížeč vykreslit stav „počítám" a teprve pak spustíme výpočet
    setTimeout(() => {
      const res = runMonteCarloSimulation({
        allocation,
        initialInvestment,
        monthlyContribution,
        years: investmentPeriod,
        simulations,
        seed,
      });

      // Pravděpodobnost dosažení cíle: podíl simulací, jejichž konečná hodnota ≥ cíl.
      // Replikuje běh simulací stejným semínkem a počítá zásah cíle v posledním roce.
      let reached = 0;
      const monthsTotal = investmentPeriod * 12;
      const rng2 = createRng(seed);
      for (let sim = 0; sim < simulations; sim++) {
        let value = initialInvestment;
        for (let month = 1; month <= monthsTotal; month++) {
          value += monthlyContribution;
          const rets = generateMonthlyReturns(rng2);
          let portRet = 0;
          for (let i = 0; i < ASSET_KEYS.length; i++) {
            portRet += (allocation[ASSET_KEYS[i]] / 100) * rets[i];
          }
          value = value * (1 + portRet);
        }
        if (value >= goalAmount) reached++;
      }
      const probGoal = simulations > 0 ? (reached / simulations) * 100 : 0;

      setResults(res);
      setRanWith({
        years: investmentPeriod,
        simulations,
        goal: goalAmount,
        initial: initialInvestment,
        monthly: monthlyContribution,
        probGoal,
      });
      setIsLoading(false);
    }, 30);
  };

  const chartData = useMemo<ChartDatum[] | null>(() => {
    if (!results) return null;
    return results.map((r) => ({
      year: r.year,
      pesimisticky: Math.round(r.percentile5),
      konzervativni: Math.round(r.percentile25),
      median: Math.round(r.percentile50),
      optimisticky: Math.round(r.percentile75),
      velmiOptimisticky: Math.round(r.percentile95),
    }));
  }, [results]);

  const finalRow = results && ranWith ? results.find((r) => r.year === ranWith.years) : null;
  const totalInvested = ranWith ? ranWith.initial + ranWith.monthly * 12 * ranWith.years : 0;

  return (
    <div className="space-y-4">
      {/* ===== Vstupní parametry ===== */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">
          Nastavení simulace
        </p>

        {/* Modelová portfolia */}
        <div className="mb-5">
          <p className="block text-sm text-slate-600 mb-2">
            Složení portfolia{' '}
            <InfoTip label="Rozdělení peněz mezi typy aktiv (akcie, dluhopisy, zlato, hotovost). Každé má jiný očekávaný výnos a kolísavost. Můžete vybrat hotovou variantu nebo si poměry upravit níže.">
              co kupujete
            </InfoTip>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`min-h-[44px] rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  activePreset === p.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/40'
                }`}
              >
                <span className="block text-sm font-medium text-slate-900">{p.name}</span>
                <span className="block text-xs text-slate-500 mt-0.5">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Jemné doladění alokace */}
        <details className="mb-5 group rounded-lg border border-slate-200 bg-slate-50">
          <summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer list-none text-sm font-medium text-slate-700">
            <span>Upravit poměry aktiv ručně</span>
            <span
              className={`tabular-nums text-xs ${
                totalAllocation === 100 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              celkem {totalAllocation} %
            </span>
          </summary>
          <div className="px-4 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
              {EDITABLE_KEYS.map((key) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>{ASSETS[key].label}</span>
                    <span className="tabular-nums font-medium text-slate-900">
                      {allocation[key]} %
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={allocation[key]}
                    onChange={(e) => setAssetWeight(key, Number(e.target.value))}
                    aria-label={`Podíl: ${ASSETS[key].label}`}
                    className="w-full accent-teal-600"
                  />
                </div>
              ))}
            </div>
            {totalAllocation !== 100 && (
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-xs text-amber-700">
                  Součet musí být 100 %. Aktuálně {totalAllocation} %.
                </p>
                <button
                  type="button"
                  onClick={normalizeAllocation}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"
                >
                  Dorovnat na 100 %
                </button>
              </div>
            )}
          </div>
        </details>

        {/* Číselné vstupy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="mc-initial" className="block text-sm text-slate-600 mb-1">
              Počáteční investice
            </label>
            <div className="relative">
              <input
                id="mc-initial"
                type="number"
                inputMode="numeric"
                min={0}
                max={100000000}
                value={initialInvestment}
                onChange={(e) => {
                  setInitialInvestment(Math.max(0, Number(e.target.value)));
                  setResults(null);
                }}
                className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-10 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                Kč
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="mc-monthly" className="block text-sm text-slate-600 mb-1">
              Měsíční vklad
            </label>
            <div className="relative">
              <input
                id="mc-monthly"
                type="number"
                inputMode="numeric"
                min={0}
                max={10000000}
                value={monthlyContribution}
                onChange={(e) => {
                  setMonthlyContribution(Math.max(0, Number(e.target.value)));
                  setResults(null);
                }}
                className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-10 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                Kč
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="mc-period" className="block text-sm text-slate-600 mb-1">
              Investiční horizont
            </label>
            <div className="relative">
              <input
                id="mc-period"
                type="number"
                inputMode="numeric"
                min={1}
                max={50}
                value={investmentPeriod}
                onChange={(e) => {
                  setInvestmentPeriod(Math.max(1, Math.min(50, Number(e.target.value))));
                  setResults(null);
                }}
                className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-10 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                let
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="mc-goal" className="block text-sm text-slate-600 mb-1">
              <InfoTip label="Volitelný cíl. Simulátor spočítá, v kolika procentech scénářů portfolio na konci horizontu tuto částku dosáhne nebo překročí.">Cílová částka</InfoTip>
            </label>
            <div className="relative">
              <input
                id="mc-goal"
                type="number"
                inputMode="numeric"
                min={0}
                max={1000000000}
                value={goalAmount}
                onChange={(e) => {
                  setGoalAmount(Math.max(0, Number(e.target.value)));
                  setResults(null);
                }}
                className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-10 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                Kč
              </span>
            </div>
          </div>
        </div>

        {/* Počet simulací */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="mc-sims" className="block text-sm text-slate-600">
              <span className="inline-flex items-center gap-1">
                Počet scénářů{' '}
                <InfoTip label="Kolik náhodných vývojů trhu simulátor vygeneruje. Více scénářů = stabilnější a přesnější pravděpodobnostní pásma, ale delší výpočet.">
                  proč na tom záleží
                </InfoTip>
              </span>
            </label>
            <span className="text-sm font-medium tabular-nums text-slate-900">{simulations}</span>
          </div>
          <input
            id="mc-sims"
            type="range"
            min={100}
            max={1000}
            step={100}
            value={simulations}
            onChange={(e) => {
              setSimulations(Number(e.target.value));
              setResults(null);
            }}
            className="w-full accent-teal-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>100</span>
            <span>více scénářů = přesnější</span>
            <span>1000</span>
          </div>
        </div>

        {/* Tlačítko spuštění */}
        <button
          type="button"
          onClick={runSimulation}
          disabled={isLoading || totalAllocation !== 100}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 min-h-[48px] rounded-lg bg-teal-700 px-4 py-3 text-sm font-medium text-white hover:bg-teal-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Dices className="w-4 h-4 animate-spin" /> Generuji {simulations} scénářů…
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Spustit simulaci
            </>
          )}
        </button>
        {totalAllocation !== 100 && (
          <p className="mt-2 text-center text-xs text-amber-700">
            Nejprve nastavte složení portfolia na 100 % (aktuálně {totalAllocation} %).
          </p>
        )}
      </div>

      {/* ===== Výsledky ===== */}
      {results && chartData && ranWith && finalRow && (
        <>
          {/* Pravděpodobnost dosažení cíle */}
          {ranWith.goal > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-teal-50 text-teal-700 shrink-0">
                    <Target className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-sm text-slate-500">
                      Šance dosáhnout {fmtCZK(ranWith.goal)} za {ranWith.years} let
                    </p>
                    <p className="text-2xl font-bold text-slate-900 tabular-nums">
                      {ranWith.probGoal.toFixed(0)} %
                    </p>
                  </div>
                </div>
                <div className="flex-1 sm:max-w-md">
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-600"
                      style={{ width: `${Math.min(100, Math.max(0, ranWith.probGoal))}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    Cíle dosáhlo {Math.round((ranWith.probGoal / 100) * ranWith.simulations)} z{' '}
                    {ranWith.simulations} náhodných scénářů.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Souhrn scénářů (3 karty, BEZ šipek mezi nimi) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600">
                  <TrendingDown className="w-4 h-4" />
                </span>
                <p className="text-sm text-slate-500">
                  <InfoTip label="Pesimistický scénář: jen 5 % simulací dopadlo hůře než tato hodnota. Slouží jako odhad nepříznivého vývoje.">
                    Pesimistický (5 %)
                  </InfoTip>
                </p>
              </div>
              <p className="text-xl font-bold text-slate-900 tabular-nums">
                {fmtCZK(finalRow.percentile5)}
              </p>
            </div>
            <div className="rounded-lg border border-teal-200 bg-teal-50/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-teal-100 text-teal-700">
                  <Wallet className="w-4 h-4" />
                </span>
                <p className="text-sm text-slate-500">
                  <InfoTip label="Medián = prostřední scénář. Polovina simulací skončila výš, polovina níž. Nejlepší jediný odhad „typického“ vývoje.">
                    Medián (50 %)
                  </InfoTip>
                </p>
              </div>
              <p className="text-xl font-bold text-teal-800 tabular-nums">
                {fmtCZK(finalRow.percentile50)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <p className="text-sm text-slate-500">
                  <InfoTip label="Optimistický scénář: jen 5 % simulací dopadlo lépe než tato hodnota. Příznivý, ale ne zaručený vývoj.">
                    Optimistický (95 %)
                  </InfoTip>
                </p>
              </div>
              <p className="text-xl font-bold text-emerald-700 tabular-nums">
                {fmtCZK(finalRow.percentile95)}
              </p>
            </div>
          </div>

          {/* Graf pravděpodobnostních pásem */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">
              Pravděpodobnostní pásma vývoje portfolia
            </p>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Pásmo ukazuje rozsah možných hodnot z {ranWith.simulations} scénářů. Široké pásmo =
              velká nejistota. Tmavá linka je medián.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-sm bg-teal-200" /> Pásmo 5–95 %
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-sm bg-teal-400" /> Pásmo 25–75 %
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-4 h-0.5 rounded bg-teal-600" /> Medián{' '}
                <InfoTip label="Percentil udává, jaký podíl scénářů skončil pod danou hodnotou. 5. percentil = jen 5 % scénářů bylo horších; 95. percentil = jen 5 % bylo lepších.">
                  percentily
                </InfoTip>
              </span>
            </div>
            <div className="w-full h-72 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mc-band-wide" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5eead4" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#5eead4" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="mc-band-narrow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.45} />
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
                    width={72}
                  />
                  <Tooltip content={<GraphTooltip />} />
                  {/* Spodní okraj širokého pásma (neviditelná výplň po pesimistický) */}
                  <Area
                    type="monotone"
                    dataKey="pesimisticky"
                    stackId="band"
                    stroke="none"
                    fill="none"
                    isAnimationActive={false}
                  />
                  {/* Není přímo stackovatelné jako "mezi" – proto kreslíme pásma překryvem ploch */}
                  <Area
                    type="monotone"
                    dataKey="velmiOptimisticky"
                    stroke="#5eead4"
                    strokeWidth={1}
                    fill="url(#mc-band-wide)"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="optimisticky"
                    stroke="#2dd4bf"
                    strokeWidth={1}
                    fill="url(#mc-band-narrow)"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="konzervativni"
                    stroke="#2dd4bf"
                    strokeWidth={1}
                    fill="#ffffff"
                    fillOpacity={1}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="pesimisticky"
                    stroke="#fca5a5"
                    strokeWidth={1}
                    fill="#ffffff"
                    fillOpacity={1}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="median"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fill="none"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Najetím myší (nebo tapnutím na mobilu) zobrazíte hodnoty pro daný rok ve všech pásmech.
              Hodnoty jsou nominální, bez zohlednění inflace, daní a poplatků.
            </p>
          </div>

          {/* Výsledkový panel – interpretace (čísla jsou výše v kartách, tady jen závěr) */}
          <div className="rounded-2xl bg-teal-700 text-white p-5 md:p-7">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-100">
              <Sparkles className="w-4 h-4" /> Co si z toho odnést
            </p>
            <p className="mt-3 text-sm md:text-base text-teal-50 leading-relaxed">
              Celkem vložíte {fmtCZK(totalInvested)}. V polovině scénářů portfolio za {ranWith.years}{' '}
              {ranWith.years === 1 ? 'rok' : ranWith.years >= 2 && ranWith.years <= 4 ? 'roky' : 'let'} skončí nad{' '}
              <strong className="font-semibold">{fmtCZK(finalRow.percentile50)}</strong>,
              ale skutečný výsledek může být kdekoli v rámci pásma – budoucnost nikdo nezná. Proto se
              díváme na rozsah, ne na jediné číslo.
            </p>
          </div>

          {/* Připomenutí omezení */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-900/80">
                <p className="font-semibold text-amber-800">Co simulace nezohledňuje</p>
                <p className="mt-1 leading-relaxed">
                  Předpokládá normální rozdělení výnosů (reálné trhy mají „tlusté chvosty“ – extrémní
                  události jsou častější). Nepočítá s inflací, daněmi, poplatky ani s nepředvídatelnými
                  událostmi. Jde o pravděpodobnostní model, ne o předpověď.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
