'use client';

import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, TrendingUp, Coins, ShieldAlert, AlertTriangle, Sparkles } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';

/**
 * Interaktivní jádro kalkulačky kurzového dopadu (vliv kurzu USD/CZK a EUR/CZK
 * na korunový výnos ETF) – redesign.
 *
 * Výpočetní logika je převzata 1:1 z ověřené utility
 * `src/utils/currencyImpactCalculations.ts` (funkce calculateCurrencyImpact)
 * a původních komponent CurrencyImpactAnalyzer.tsx / CurrencyImpactResults.tsx.
 * Měněn je POUZE vizuál (teal/slate, design systém, graf přes recharts).
 * Finanční logiku neměnit.
 */

const fmtCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const fmtCompact = (v: number) => {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace('.', ',')} mil.`;
  if (abs >= 1_000) return `${Math.round(v / 1000)} tis.`;
  return `${Math.round(v)}`;
};

const fmtPct = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2).replace('.', ',')} %`;

// ===== TYPY 1:1 z src/utils/currencyImpactCalculations.ts =====
interface CurrencyScenario {
  name: string;
  description: string;
  usdCzkChange: number;
  eurCzkChange: number;
  probability: number;
  portfolioImpact: number;
  portfolioValueCzk: number;
}

interface CurrencyImpactData {
  currentExposure: {
    unhedgedUsd: number;
    unhedgedEur: number;
    czkAmount: number;
  };
  scenarios: CurrencyScenario[];
  riskMetrics: {
    portfolioVolatility: number;
    currencyVolatility: number;
    maxDrawdown: number;
    valueAtRisk: number;
  };
  historicalAnalysis: {
    worstCase: { period: string; usdCzkImpact: number; eurCzkImpact: number; totalPortfolioImpact: number };
    bestCase: { period: string; usdCzkImpact: number; eurCzkImpact: number; totalPortfolioImpact: number };
    averageImpact: number;
  };
}

interface CurrencyImpactParams {
  portfolioValue: number;
  allocations: { usd: number; eur: number; czk: number };
  investmentHorizon: number;
  currentRates: { usdCzk: number; eurCzk: number };
}

// ===== VÝPOČET 1:1 z src/utils/currencyImpactCalculations.ts (calculateCurrencyImpact) – NEMĚNIT =====
function calculateCurrencyImpact(params: CurrencyImpactParams): CurrencyImpactData {
  const { portfolioValue, allocations, currentRates } = params;

  // Výpočet současné expozice – všechny zahraniční pozice jsou nezajištěné
  const usdValue = (portfolioValue * allocations.usd) / 100;
  const eurValue = (portfolioValue * allocations.eur) / 100;
  const czkValue = (portfolioValue * allocations.czk) / 100;

  const unhedgedUsd = usdValue;
  const unhedgedEur = eurValue;

  const scenarios: CurrencyScenario[] = [
    {
      name: 'Oslabení koruny',
      description: 'Koruna oslabí vůči dolaru o 12 %, vůči euru o 8 % (ekonomická nejistota).',
      usdCzkChange: 12,
      eurCzkChange: 8,
      probability: 20,
      portfolioImpact: 0,
      portfolioValueCzk: 0,
    },
    {
      name: 'Posílení koruny',
      description: 'Koruna posílí vůči dolaru o 8 %, vůči euru o 5 % (zásah ČNB).',
      usdCzkChange: -8,
      eurCzkChange: -5,
      probability: 15,
      portfolioImpact: 0,
      portfolioValueCzk: 0,
    },
    {
      name: 'Silný dolar',
      description: 'Dolar posílí o 15 %, euro oslabí o 3 % (přísnější Fed).',
      usdCzkChange: 15,
      eurCzkChange: -3,
      probability: 20,
      portfolioImpact: 0,
      portfolioValueCzk: 0,
    },
    {
      name: 'Slabý dolar',
      description: 'Dolar oslabí o 10 %, euro posílí o 4 % (uvolněnější Fed).',
      usdCzkChange: -10,
      eurCzkChange: 4,
      probability: 15,
      portfolioImpact: 0,
      portfolioValueCzk: 0,
    },
    {
      name: 'Stabilita',
      description: 'Kurzy oscilují v úzkém pásmu ±3 %.',
      usdCzkChange: 0,
      eurCzkChange: 0,
      probability: 30,
      portfolioImpact: 0,
      portfolioValueCzk: 0,
    },
  ];

  // Výpočet dopadů jednotlivých scénářů
  scenarios.forEach((scenario) => {
    const usdImpact = unhedgedUsd * (scenario.usdCzkChange / 100);
    const eurImpact = unhedgedEur * (scenario.eurCzkChange / 100);

    const totalImpact = usdImpact + eurImpact;

    scenario.portfolioImpact = portfolioValue > 0 ? (totalImpact / portfolioValue) * 100 : 0;
    scenario.portfolioValueCzk = portfolioValue + totalImpact;
  });

  // Rizikové metriky
  const currencyExposure = portfolioValue > 0 ? (unhedgedUsd + unhedgedEur) / portfolioValue : 0;

  const usdVolatility = 0.12;
  const eurVolatility = 0.08;
  const correlation = 0.6;

  const usdWeight = unhedgedUsd / (unhedgedUsd + unhedgedEur + 0.001);
  const eurWeight = unhedgedEur / (unhedgedUsd + unhedgedEur + 0.001);

  const currencyVolatility = Math.sqrt(
    Math.pow(usdWeight * usdVolatility, 2) +
      Math.pow(eurWeight * eurVolatility, 2) +
      2 * usdWeight * eurWeight * usdVolatility * eurVolatility * correlation,
  );

  const assetVolatility = 0.16;
  const portfolioVolatility =
    (currencyVolatility * currencyExposure + assetVolatility * (1 - currencyExposure)) * 100;

  const maxDrawdown = portfolioVolatility * 2.2;

  const valueAtRisk = portfolioValue * currencyVolatility * 1.65;

  const currentUnhedgedExposure = unhedgedUsd + unhedgedEur;
  const historicalAnalysis = {
    worstCase: {
      period: 'Pandemická krize 2020 (březen)',
      usdCzkImpact: -22,
      eurCzkImpact: -15,
      totalPortfolioImpact:
        currentUnhedgedExposure > 0 && portfolioValue > 0
          ? ((unhedgedUsd * -0.22 + unhedgedEur * -0.15) / portfolioValue) * 100
          : 0,
    },
    bestCase: {
      period: 'Zásah ČNB 2017',
      usdCzkImpact: 18,
      eurCzkImpact: 12,
      totalPortfolioImpact:
        currentUnhedgedExposure > 0 && portfolioValue > 0
          ? ((unhedgedUsd * 0.18 + unhedgedEur * 0.12) / portfolioValue) * 100
          : 0,
    },
    averageImpact: currencyExposure * 100 * 0.08,
  };

  return {
    currentExposure: { unhedgedUsd, unhedgedEur, czkAmount: czkValue },
    scenarios,
    riskMetrics: { portfolioVolatility, currencyVolatility, maxDrawdown, valueAtRisk },
    historicalAnalysis,
  };
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
  name: string;
  description: string;
  usdCzkChange: number;
  eurCzkChange: number;
  probability: number;
  impactPct: number;
  valueCzk: number;
  delta: number;
};

function ChartTooltip({
  active,
  payload,
  baseValue,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartDatum }>;
  baseValue: number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  const positive = d.delta >= 0;
  return (
    <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg max-w-[15rem]">
      <div className="font-semibold mb-1">{d.name}</div>
      <div className="text-slate-300 leading-relaxed mb-1.5">{d.description}</div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-teal-400" /> Hodnota v Kč:{' '}
        <span className="font-medium tabular-nums">{fmtCZK(d.valueCzk)}</span>
      </div>
      <div className={`mt-1 pt-1 border-t border-white/15 ${positive ? 'text-emerald-300' : 'text-red-300'}`}>
        Změna oproti dnešku: <span className="font-semibold tabular-nums">{fmtCZK(d.delta)}</span> ({fmtPct(d.impactPct)})
      </div>
      <div className="mt-1 text-slate-400">Výchozí hodnota: {fmtCZK(baseValue)}</div>
    </div>
  );
}

export default function KurzovyDopadWidget() {
  // Výchozí hodnoty 1:1 z původní komponenty CurrencyImpactAnalyzer.tsx
  const [portfolioValue, setPortfolioValue] = useState<number>(1_000_000);
  const [usdAllocation, setUsdAllocation] = useState<number>(60);
  const [eurAllocation, setEurAllocation] = useState<number>(30);
  const [czkAllocation, setCzkAllocation] = useState<number>(10);
  const [currentUsdCzk, setCurrentUsdCzk] = useState<number>(23.5);
  const [currentEurCzk, setCurrentEurCzk] = useState<number>(25.2);

  const totalAllocation = usdAllocation + eurAllocation + czkAllocation;
  const isAllocationValid = Math.abs(totalAllocation - 100) < 0.1;

  const results = useMemo<CurrencyImpactData>(() => {
    // Normalizace alokace na 100 % – 1:1 z handleCalculate v původní komponentě
    const total = usdAllocation + eurAllocation + czkAllocation || 1;
    const normalizedUsd = (usdAllocation / total) * 100;
    const normalizedEur = (eurAllocation / total) * 100;
    const normalizedCzk = (czkAllocation / total) * 100;

    return calculateCurrencyImpact({
      portfolioValue,
      allocations: { usd: normalizedUsd, eur: normalizedEur, czk: normalizedCzk },
      investmentHorizon: 10,
      currentRates: { usdCzk: currentUsdCzk, eurCzk: currentEurCzk },
    });
  }, [portfolioValue, usdAllocation, eurAllocation, czkAllocation, currentUsdCzk, currentEurCzk]);

  const totalExposure = results.currentExposure.unhedgedUsd + results.currentExposure.unhedgedEur;
  const totalPortfolio = totalExposure + results.currentExposure.czkAmount;
  const exposurePct = totalPortfolio > 0 ? (totalExposure / totalPortfolio) * 100 : 0;
  const usdPct = totalPortfolio > 0 ? (results.currentExposure.unhedgedUsd / totalPortfolio) * 100 : 0;
  const eurPct = totalPortfolio > 0 ? (results.currentExposure.unhedgedEur / totalPortfolio) * 100 : 0;
  const czkPct = totalPortfolio > 0 ? (results.currentExposure.czkAmount / totalPortfolio) * 100 : 0;

  const hasValue = portfolioValue > 0;

  // Data pro graf: scénáře seřazené dle dopadu kurzu na korunovou hodnotu
  const chartData = useMemo<ChartDatum[]>(() => {
    return results.scenarios
      .map((s) => ({
        name: s.name,
        description: s.description,
        usdCzkChange: s.usdCzkChange,
        eurCzkChange: s.eurCzkChange,
        probability: s.probability,
        impactPct: s.portfolioImpact,
        valueCzk: s.portfolioValueCzk,
        delta: s.portfolioValueCzk - portfolioValue,
      }))
      .sort((a, b) => a.delta - b.delta);
  }, [results.scenarios, portfolioValue]);

  const recommendation =
    exposurePct / 100 > 0.7
      ? 'Vysoká kurzová expozice. Pro dlouhodobé investice je nejlepší pravidelné nákupy (rozložení v čase), které kurzové riziko zmírňují.'
      : exposurePct / 100 > 0.3
        ? 'Střední kurzová expozice. Pravidelné investování pomáhá vyrovnat kurzové výkyvy v čase.'
        : 'Nízká kurzová expozice. Portfolio má minimální závislost na kurzových změnách.';

  return (
    <div className="space-y-4">
      {/* Vstupní parametry */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">Parametry portfolia</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberField
            id="portfolio"
            label="Hodnota portfolia"
            value={portfolioValue}
            min={0}
            max={1_000_000_000}
            step="50000"
            onChange={(v) => setPortfolioValue(Math.max(0, v))}
            suffix="Kč"
          />
          <NumberField
            id="usdCzk"
            label={
              <InfoTip label="Kolik korun stojí jeden americký dolar. Když dolar posílí (číslo roste), vaše dolarové ETF mají v přepočtu na koruny vyšší hodnotu.">Kurz USD/CZK</InfoTip>
            }
            value={currentUsdCzk}
            step="0.1"
            min={10}
            max={40}
            onChange={(v) => setCurrentUsdCzk(Math.max(0, v))}
            suffix="Kč"
          />
          <NumberField
            id="eurCzk"
            label={
              <InfoTip label="Kolik korun stojí jedno euro. Ovlivňuje korunový výnos části portfolia v evropských aktivech.">Kurz EUR/CZK</InfoTip>
            }
            value={currentEurCzk}
            step="0.1"
            min={15}
            max={35}
            onChange={(v) => setCurrentEurCzk(Math.max(0, v))}
            suffix="Kč"
          />
        </div>

        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mt-6 mb-3">
          Měnová expozice portfolia
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberField
            id="usdAlloc"
            label="Dolarová (USD) část"
            value={usdAllocation}
            min={0}
            max={100}
            onChange={(v) => setUsdAllocation(Math.max(0, Math.min(100, v)))}
            suffix="%"
          />
          <NumberField
            id="eurAlloc"
            label="Eurová (EUR) část"
            value={eurAllocation}
            min={0}
            max={100}
            onChange={(v) => setEurAllocation(Math.max(0, Math.min(100, v)))}
            suffix="%"
          />
          <NumberField
            id="czkAlloc"
            label="Korunová (CZK) část"
            value={czkAllocation}
            min={0}
            max={100}
            onChange={(v) => setCzkAllocation(Math.max(0, Math.min(100, v)))}
            suffix="%"
          />
        </div>

        {/* Upozornění na expozici podle podkladových aktiv */}
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-900/80 leading-relaxed">
              Zadejte expozici podle <strong className="text-amber-800">podkladových aktiv</strong>, ne podle měny, ve které
              fond obchodujete. Příklad: fond na americké akcie vedený v eurech má fakticky{' '}
              <strong className="text-amber-800">100% dolarovou expozici</strong> – v korunách na něj působí kurz USD/CZK.
            </p>
          </div>
        </div>

        {/* Kontrola součtu alokace */}
        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5">
          <span className="text-sm text-slate-600">Součet expozice</span>
          <span className={`text-sm font-bold tabular-nums ${isAllocationValid ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalAllocation.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %
          </span>
        </div>
        {!isAllocationValid && (
          <p className="mt-1.5 text-xs text-slate-500">
            Součet by měl být 100 %. Pro výpočet se podíly automaticky přepočítají na 100 %.
          </p>
        )}
      </div>

      {/* Souhrn expozice */}
      {hasValue && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-teal-50 text-teal-700">
                <DollarSign className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate-500">Dolarová (USD) expozice</p>
            </div>
            <p className="text-xl font-bold text-slate-900 tabular-nums">
              {fmtCZK(results.currentExposure.unhedgedUsd)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">{usdPct.toFixed(1)} % portfolia</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-teal-50 text-teal-700">
                <Coins className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate-500">Eurová (EUR) expozice</p>
            </div>
            <p className="text-xl font-bold text-slate-900 tabular-nums">
              {fmtCZK(results.currentExposure.unhedgedEur)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">{eurPct.toFixed(1)} % portfolia</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <p className="text-sm text-slate-500">
                <InfoTip label="Podíl portfolia v cizích měnách, jehož korunová hodnota se mění s kurzem. Korunová část kurzu nepodléhá.">
                  Kurzová expozice
                </InfoTip>
              </p>
            </div>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{exposurePct.toFixed(1)} %</p>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">korunová část {czkPct.toFixed(1)} %</p>
          </div>
        </div>
      )}

      {/* Graf: korunová hodnota v různých kurzových scénářích */}
      {hasValue && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">
            Korunový výnos v různých kurzových scénářích
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Výnos samotných ETF necháváme stranou – sloupce ukazují <strong className="text-slate-900">jen dopad pohybu
            kurzu</strong> na hodnotu portfolia v přepočtu na koruny. Tečkovaná čára je dnešní hodnota{' '}
            {fmtCZK(portfolioValue)}.
          </p>
          <div className="w-full h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  interval={0}
                />
                <YAxis
                  tickFormatter={(v) => fmtCompact(Number(v))}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  domain={['dataMin - dataMin * 0.02', 'dataMax + dataMax * 0.02']}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(15, 118, 110, 0.06)' }}
                  content={<ChartTooltip baseValue={portfolioValue} />}
                />
                <ReferenceLine
                  y={portfolioValue}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
                <Bar dataKey="valueCzk" radius={[4, 4, 0, 0]} maxBarSize={64}>
                  {chartData.map((d) => (
                    <Cell key={d.name} fill={d.delta >= 0 ? '#0d9488' : '#dc2626'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Tyrkysové sloupce = kurz vaší korunové hodnotě pomohl, červené = uškodil. Najetím (nebo tapnutím na mobilu)
            zobrazíte přesné hodnoty v korunách a popis scénáře.
          </p>
        </div>
      )}

      {/* Detailní scénáře – kartový vzor (mobile-first) */}
      {hasValue && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">
            Kurzové scénáře a jejich dopad
          </p>
          <div className="space-y-2.5">
            {chartData.map((s) => {
              const positive = s.impactPct >= 0;
              return (
                <div
                  key={s.name}
                  className="rounded-lg border border-slate-200 p-3.5 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{s.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{s.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 tabular-nums">
                      {s.probability} %
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <p className="text-xs text-slate-400">USD/CZK</p>
                      <p
                        className={`text-sm font-semibold tabular-nums ${s.usdCzkChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                      >
                        {fmtPct(s.usdCzkChange)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">EUR/CZK</p>
                      <p
                        className={`text-sm font-semibold tabular-nums ${s.eurCzkChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                      >
                        {fmtPct(s.eurCzkChange)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Dopad na výnos</p>
                      <p
                        className={`text-sm font-semibold tabular-nums ${positive ? 'text-emerald-600' : 'text-red-600'}`}
                      >
                        {fmtPct(s.impactPct)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Hodnota v Kč</p>
                      <p className="text-sm font-semibold text-slate-900 tabular-nums">{fmtCZK(s.valueCzk)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rizikové metriky + doporučení */}
      {hasValue && (
        <div className="rounded-2xl bg-teal-700 text-white p-5 md:p-7">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-100">
            <Sparkles className="w-4 h-4" /> Shrnutí kurzového rizika
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <p className="text-sm text-teal-100">Kurzová expozice</p>
              <p className="text-2xl md:text-3xl font-bold tabular-nums mt-1">{exposurePct.toFixed(1)} %</p>
              <p className="text-xs text-teal-200 mt-1">část portfolia citlivá na kurz</p>
            </div>
            <div className="sm:border-l sm:border-white/15 sm:pl-5">
              <p className="text-sm text-teal-100">Celková kolísavost</p>
              <p className="text-2xl md:text-3xl font-bold tabular-nums mt-1">
                {results.riskMetrics.portfolioVolatility.toFixed(1)} %
              </p>
              <p className="text-xs text-teal-200 mt-1">roční výkyv hodnoty (odhad)</p>
            </div>
            <div className="sm:border-l sm:border-white/15 sm:pl-5">
              <p className="text-sm text-teal-100">
                <InfoTip label="Value at Risk: částka, kterou s 95% jistotou nepřekročí roční ztráta z kurzu. V 5 % případů může být ztráta vyšší.">
                  Hodnota v riziku (95 %)
                </InfoTip>
              </p>
              <p className="text-2xl md:text-3xl font-bold tabular-nums mt-1">
                {fmtCZK(results.riskMetrics.valueAtRisk)}
              </p>
              <p className="text-xs text-teal-200 mt-1">možná roční ztráta z kurzu</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-teal-50 leading-relaxed border-t border-white/15 pt-4">
            {recommendation}
          </p>
        </div>
      )}

      {/* Historické srovnání – reálné události */}
      {hasValue && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-red-200 bg-red-50/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-red-700/80 mb-1">Nepříznivý vývoj</p>
            <p className="font-semibold text-slate-900 text-sm">{results.historicalAnalysis.worstCase.period}</p>
            <p className="text-2xl font-bold text-red-600 tabular-nums mt-1">
              {fmtPct(results.historicalAnalysis.worstCase.totalPortfolioImpact)}
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Dopad kurzu na korunovou hodnotu vašeho portfolia v podobném období.
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700/80 mb-1">Příznivý vývoj</p>
            <p className="font-semibold text-slate-900 text-sm">{results.historicalAnalysis.bestCase.period}</p>
            <p className="text-2xl font-bold text-emerald-600 tabular-nums mt-1">
              {fmtPct(results.historicalAnalysis.bestCase.totalPortfolioImpact)}
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Dopad kurzu na korunovou hodnotu vašeho portfolia v podobném období.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
