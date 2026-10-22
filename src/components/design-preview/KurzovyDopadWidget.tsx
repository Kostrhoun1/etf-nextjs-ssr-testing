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
import { DollarSign, Coins, ShieldAlert, AlertTriangle, Sparkles } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import { CisloPole, VysledekChybi } from '@/components/CisloInput';
import { kulateKroky } from '@/lib/osyGrafu';

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

const MINUS = '\u2212'; // typografické minus „−“ (ne spojovník „-“)
const NB = '\u00a0';
/* Popisky osy odchylek: se znaménkem a nezlomitelnou mezerou („+120 tis.“, „−80 tis.“). */
const fmtOsa = (v: number) => {
  const abs = Math.abs(v);
  const z = v > 0 ? '+' : v < 0 ? MINUS : '';
  if (abs >= 1_000_000) return `${z}${(abs / 1_000_000).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })}${NB}mil.`;
  if (abs >= 1_000) return `${z}${Math.round(abs / 1000).toLocaleString('cs-CZ')}${NB}tis.`;
  return `${z}${Math.round(abs)}`;
};
/** České procento se znaménkem: „+12,0 %“, „−8,0 %“, „0,0 %“ (dřív „-8,00 %“). */
const fmtPct = (value: number) => {
  const r = Math.round(value * 10) / 10;
  const z = r > 0 ? '+' : r < 0 ? MINUS : '';
  return `${z}${Math.abs(r).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${NB}%`;
};
/** České procento bez znaménka („60,0 %“ místo „60.0 %“). */
const fmtP1 = (value: number) => `${value.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${NB}%`;
const fmtDelta = (v: number) => (Math.round(v) === 0 ? fmtCZK(0) : `${v > 0 ? '+' : MINUS}${fmtCZK(Math.abs(v))}`);

// ===== TYPY 1:1 z src/utils/currencyImpactCalculations.ts =====
interface CurrencyScenario {
  name: string;
  description: string;
  usdCzkChange: number;
  eurCzkChange: number;
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

  // Ilustrační scénáře „co kdyby“ – NE předpověď. Dřív u nich byly pravděpodobnosti 20/15/20/15/30 %
  // natvrdo bez zdroje (revize AD 22. 10. 2026) → odstraněny; nikde je nepublikujeme.
  const scenarios: CurrencyScenario[] = [
    {
      name: 'Oslabení koruny',
      description: 'Koruna oslabí vůči dolaru o 12 %, vůči euru o 8 % (ekonomická nejistota).',
      usdCzkChange: 12,
      eurCzkChange: 8,
      portfolioImpact: 0,
      portfolioValueCzk: 0,
    },
    {
      name: 'Posílení koruny',
      description: 'Koruna posílí vůči dolaru o 8 %, vůči euru o 5 % (zásah ČNB).',
      usdCzkChange: -8,
      eurCzkChange: -5,
      portfolioImpact: 0,
      portfolioValueCzk: 0,
    },
    {
      name: 'Silný dolar',
      description: 'Dolar posílí o 15 %, euro oslabí o 3 % (přísnější Fed).',
      usdCzkChange: 15,
      eurCzkChange: -3,
      portfolioImpact: 0,
      portfolioValueCzk: 0,
    },
    {
      name: 'Slabý dolar',
      description: 'Dolar oslabí o 10 %, euro posílí o 4 % (uvolněnější Fed).',
      usdCzkChange: -10,
      eurCzkChange: 4,
      portfolioImpact: 0,
      portfolioValueCzk: 0,
    },
    {
      name: 'Stabilita',
      description: 'Kurzy se do konce období vrátí tam, kde jsou dnes (průběžně kolísají v pásmu ±3 %).',
      usdCzkChange: 0,
      eurCzkChange: 0,
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

  // Kolísavost portfolia ZPŮSOBENÁ KURZEM (v % hodnoty celého portfolia). Dřív se míchala s akciovou
  // volatilitou přiřazenou jen korunové části → nesmyslné číslo („celková kolísavost“ 10,5 %).
  const portfolioVolatility = currencyVolatility * currencyExposure * 100;

  const maxDrawdown = portfolioVolatility * 2.2;

  // VaR jen z části vystavené kurzu (dřív z celého portfolia včetně korunové části).
  const valueAtRisk = (unhedgedUsd + unhedgedEur) * currencyVolatility * 1.65;

  const currentUnhedgedExposure = unhedgedUsd + unhedgedEur;
  // Skutečné pohyby kurzu podle ČNB (17. 10. 2026 opraveno – scénáře byly OBRÁCENĚ: březen 2020
  // byl veden jako ztráta −17,7 %, ačkoli koruna oslabila a zahraniční aktiva v Kč vydělala; rok
  // 2017 jako zisk +14,4 %, ačkoli koruna po konci intervencí posílila a investor ztratil).
  //   2017:     USD/CZK 25,819 (2. 1.) → 21,291 (29. 12.) = −17,5 %; EUR/CZK 27,020 → 25,540 = −5,5 %
  //   III/2020: USD/CZK 22,952 (2. 3.) → 24,943 (31. 3.)  = +8,7 %;  EUR/CZK 25,525 → 27,325 = +7,1 %
  const HIST = {
    r2017: { usd: 21.291 / 25.819 - 1, eur: 25.540 / 27.020 - 1 },
    r2020: { usd: 24.943 / 22.952 - 1, eur: 27.325 / 25.525 - 1 },
  };
  const dopad = (h: { usd: number; eur: number }) =>
    currentUnhedgedExposure > 0 && portfolioValue > 0 ? ((unhedgedUsd * h.usd + unhedgedEur * h.eur) / portfolioValue) * 100 : 0;
  const historicalAnalysis = {
    worstCase: {
      period: 'Posílení koruny 2017 (konec intervencí ČNB)',
      usdCzkImpact: HIST.r2017.usd * 100,
      eurCzkImpact: HIST.r2017.eur * 100,
      totalPortfolioImpact: dopad(HIST.r2017),
    },
    bestCase: {
      period: 'Oslabení koruny v březnu 2020 (pandemie)',
      usdCzkImpact: HIST.r2020.usd * 100,
      eurCzkImpact: HIST.r2020.eur * 100,
      totalPortfolioImpact: dopad(HIST.r2020),
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

type ChartDatum = {
  name: string;
  description: string;
  usdCzkChange: number;
  eurCzkChange: number;
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
  const nula = Math.round(d.delta) === 0;
  return (
    <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg max-w-[15rem]">
      <div className="font-semibold mb-1">{d.name}</div>
      <div className="text-slate-300 leading-relaxed mb-1.5">{d.description}</div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-teal-400" /> Hodnota v Kč:{' '}
        <span className="font-medium tabular-nums">{fmtCZK(d.valueCzk)}</span>
      </div>
      <div className={`mt-1 pt-1 border-t border-white/15 ${nula ? 'text-slate-300' : positive ? 'text-emerald-300' : 'text-red-300'}`}>
        Změna oproti dnešku: <span className="font-semibold tabular-nums">{fmtDelta(d.delta)}</span> ({fmtPct(d.impactPct)})
      </div>
      <div className="mt-1 text-slate-400">Výchozí hodnota: {fmtCZK(baseValue)}</div>
    </div>
  );
}

export default function KurzovyDopadWidget() {
  // Výchozí hodnoty 1:1 z původní komponenty CurrencyImpactAnalyzer.tsx
  // null = prázdné / nedopsané pole → výsledek „—“. „60,5“ = 60,5 % (dřív 605 → ořez na 100 %).
  const [portfolioValueV, setPortfolioValue] = useState<number | null>(1_000_000);
  const [usdAllocationV, setUsdAllocation] = useState<number | null>(60);
  const [eurAllocationV, setEurAllocation] = useState<number | null>(30);
  const [czkAllocationV, setCzkAllocation] = useState<number | null>(10);
  const vstupyOk = portfolioValueV != null && usdAllocationV != null && eurAllocationV != null && czkAllocationV != null;
  const portfolioValue = portfolioValueV ?? 0, usdAllocation = usdAllocationV ?? 0,
    eurAllocation = eurAllocationV ?? 0, czkAllocation = czkAllocationV ?? 0;
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

  const hasValue = vstupyOk && portfolioValue > 0 && totalAllocation > 0;

  // Data pro graf: scénáře seřazené dle dopadu kurzu na korunovou hodnotu
  const chartData = useMemo<ChartDatum[]>(() => {
    return results.scenarios
      .map((s) => ({
        name: s.name,
        description: s.description,
        usdCzkChange: s.usdCzkChange,
        eurCzkChange: s.eurCzkChange,
        impactPct: s.portfolioImpact,
        valueCzk: s.portfolioValueCzk,
        delta: s.portfolioValueCzk - portfolioValue,
      }))
      .sort((a, b) => a.delta - b.delta);
  }, [results.scenarios, portfolioValue]);

  // Kulaté kroky osy odchylek včetně nuly (1/2/2,5/5 × 10^n).
  const osaX = useMemo(() => {
    const d = chartData.map((x) => x.delta);
    const lo = Math.min(0, ...d), hi = Math.max(0, ...d);
    return hi - lo < 1 ? [0, 1] : kulateKroky(hi, lo, 4);
  }, [chartData]);

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
          <CisloPole
            id="portfolio"
            label="Hodnota portfolia"
            value={portfolioValueV}
            min={0}
            max={1_000_000_000}
            step="50000"
            onChange={setPortfolioValue}
            suffix="Kč"
          />
        </div>

        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mt-6 mb-3">
          Měnová expozice portfolia
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CisloPole
            id="usdAlloc"
            label="Dolarová (USD) část"
            value={usdAllocationV}
            min={0}
            max={100}
            desetinna
            onChange={setUsdAllocation}
            suffix="%"
          />
          <CisloPole
            id="eurAlloc"
            label="Eurová (EUR) část"
            value={eurAllocationV}
            min={0}
            max={100}
            desetinna
            onChange={setEurAllocation}
            suffix="%"
          />
          <CisloPole
            id="czkAlloc"
            label="Korunová (CZK) část"
            value={czkAllocationV}
            min={0}
            max={100}
            desetinna
            onChange={setCzkAllocation}
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
            {vstupyOk ? fmtP1(totalAllocation) : '—'}
          </span>
        </div>
        {!isAllocationValid && (
          <p className="mt-1.5 text-xs text-slate-500">
            Součet by měl být 100 %. Pro výpočet se podíly automaticky přepočítají na 100 %.
          </p>
        )}
      </div>

      {!hasValue && <VysledekChybi co={!vstupyOk ? undefined : 'hodnotu portfolia a expozici'} />}

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
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">{fmtP1(usdPct)} portfolia</p>
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
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">{fmtP1(eurPct)} portfolia</p>
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
            <p className="text-xl font-bold text-slate-900 tabular-nums">{fmtP1(exposurePct)}</p>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">korunová část {fmtP1(czkPct)}</p>
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
            Výnos samotných ETF necháváme stranou – sloupce ukazují <strong className="text-slate-900">jen o kolik korun
            se změní hodnota portfolia kvůli kurzu</strong>: doprava = přibude, doleva = ubude. Nulová čára je dnešní hodnota{' '}
            {fmtCZK(portfolioValue)}. Scénáře jsou ilustrační „co kdyby“, ne předpověď.
          </p>
          <div className="w-full h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              {/* Vodorovné sloupce (jména scénářů čitelně vlevo i na mobilu – dřív se popisky osy X překrývaly)
                  a kulaté kroky osy přes nulu (dřív „+57 tis. / +17 tis. / −23 tis.“). */}
              <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  ticks={osaX}
                  domain={[osaX[0], osaX[osaX.length - 1]]}
                  tickFormatter={(v) => fmtOsa(Number(v))}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  width={104}
                  interval={0}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(15, 118, 110, 0.06)' }}
                  content={<ChartTooltip baseValue={portfolioValue} />}
                />
                <ReferenceLine x={0} stroke="#64748b" strokeWidth={1.5} />
                <Bar dataKey="delta" maxBarSize={36} minPointSize={2}>
                  {chartData.map((d) => (
                    <Cell key={d.name} fill={Math.round(d.delta) === 0 ? '#94a3b8' : d.delta > 0 ? '#0d9488' : '#dc2626'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Tyrkysové sloupce = kurz vaší korunové hodnotě pomohl, červené = uškodil, šedá = beze změny. Najetím (nebo tapnutím
            na mobilu) zobrazíte přesné hodnoty v korunách a popis scénáře.
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
              const barva = (v: number) => (Math.abs(v) < 0.05 ? 'text-slate-600' : v > 0 ? 'text-emerald-600' : 'text-red-600');
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
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <p className="text-xs text-slate-400">Kurz USD/CZK</p>
                      <p
                        className={`text-sm font-semibold tabular-nums ${barva(s.usdCzkChange)}`}
                      >
                        {fmtPct(s.usdCzkChange)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Kurz EUR/CZK</p>
                      <p
                        className={`text-sm font-semibold tabular-nums ${barva(s.eurCzkChange)}`}
                      >
                        {fmtPct(s.eurCzkChange)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Dopad na hodnotu</p>
                      <p
                        className={`text-sm font-semibold tabular-nums ${barva(s.impactPct)}`}
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
              <p className="text-2xl md:text-3xl font-bold tabular-nums mt-1">{fmtP1(exposurePct)}</p>
              <p className="text-xs text-teal-200 mt-1">část portfolia citlivá na kurz</p>
            </div>
            <div className="sm:border-l sm:border-white/15 sm:pl-5">
              <p className="text-sm text-teal-100">Kolísavost z kurzu</p>
              <p className="text-2xl md:text-3xl font-bold tabular-nums mt-1">
                {fmtP1(results.riskMetrics.portfolioVolatility)}
              </p>
              <p className="text-xs text-teal-200 mt-1">roční výkyv hodnoty jen kvůli kurzu (odhad)</p>
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
