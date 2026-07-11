'use client';

import React, { useMemo, useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend,
} from 'recharts';
import {
  Plus, Trash2, AlertTriangle, Zap, TrendingDown, TrendingUp, Activity, Coins, Loader2, Info, ChevronDown,
} from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';

/**
 * Backtest portfolia – PRESKINOVANÁ verze do design systému.
 * Logika je portnuta 1:1 z původního BacktestCalculator.tsx:
 *   – stejná nabídka indexů (AVAILABLE_INDEXES, data uložená v EUR),
 *   – stejná hotová portfolia (PRESET_PORTFOLIOS),
 *   – výpočet běží přes STEJNÝ API endpoint POST /api/backtest/simulate
 *     (server čte historická data z @/lib/backtest/engine a přepočítává kurzy ECB/ČNB).
 * Měněn je POUZE vizuál (teal/slate, recharts graf) + čeština bez anglicismů.
 * Místo sdíleného CurrencyContextu (vyžaduje provider, který v /design-preview není)
 * používáme lokální přepínač měny – do API se posílá stejně.
 */

type Currency = 'EUR' | 'CZK' | 'USD';
type ContributionFrequency = 'none' | 'monthly' | 'quarterly' | 'yearly';

// === Nabídka indexů – 1:1 z originálu (data uložená v EUR) ===
const AVAILABLE_INDEXES = [
  { indexCode: 'sp500', name: 'S&P 500', category: 'Akcie', isin: 'IE00B5BMR087', etfName: 'iShares Core S&P 500', ter: 0.0007 },
  { indexCode: 'us_total_market', name: 'US Total Stock Market', category: 'Akcie', isin: 'IE00B3XXRP09', etfName: 'Vanguard Total Stock Market', ter: 0.0003 },
  { indexCode: 'msci_eafe', name: 'MSCI EAFE (vyspělé mimo USA)', category: 'Akcie', isin: 'IE00B4L5Y983', etfName: 'iShares MSCI EAFE', ter: 0.002 },
  { indexCode: 'world_ex_us', name: 'Svět mimo USA (vyspělé + EM, od 1996)', category: 'Akcie', isin: 'US9219097683', etfName: 'Vanguard Total International Stock', ter: 0.0008 },
  { indexCode: 'ftse_europe', name: 'FTSE Europe', category: 'Akcie', isin: 'IE00B945VV12', etfName: 'Vanguard FTSE Developed Europe', ter: 0.001 },
  { indexCode: 'msci_em', name: 'MSCI Emerging Markets', category: 'Akcie', isin: 'IE00BKM4GZ66', etfName: 'iShares Core MSCI EM', ter: 0.0018 },
  { indexCode: 'ftse_all_world', name: 'FTSE All-World', category: 'Akcie', isin: 'IE00BK5BQT80', etfName: 'Vanguard FTSE All-World', ter: 0.0022 },
  { indexCode: 'eur_govt_bond', name: 'EUR vládní dluhopisy', category: 'Dluhopisy EUR', isin: 'IE00B4WXJJ64', etfName: 'iShares Core EUR Govt Bond', ter: 0.0007 },
  { indexCode: 'eur_govt_bond_1_3y', name: 'EUR vládní dluhopisy 1–3 roky', category: 'Dluhopisy EUR', isin: 'IE00B14X4Q57', etfName: 'iShares EUR Govt Bond 1-3yr', ter: 0.002 },
  { indexCode: 'eur_govt_bond_3_7y', name: 'EUR vládní dluhopisy 3–7 let', category: 'Dluhopisy EUR', isin: 'IE00B3VTML14', etfName: 'iShares EUR Govt Bond 3-7yr', ter: 0.002 },
  { indexCode: 'eur_govt_bond_15_30y', name: 'EUR vládní dluhopisy 15–30 let', category: 'Dluhopisy EUR', isin: 'IE00B1FZS913', etfName: 'iShares EUR Govt Bond 15-30yr', ter: 0.002 },
  { indexCode: 'eur_corp_bond', name: 'EUR firemní dluhopisy', category: 'Dluhopisy EUR', isin: 'IE00B3F81R35', etfName: 'iShares Core EUR Corp Bond', ter: 0.002 },
  { indexCode: 'us_treasury_1_3y', name: 'US státní dluhopisy 1–3 roky', category: 'Dluhopisy USD', isin: 'IE00BYXPSP02', etfName: 'iShares USD Treasury Bond 1-3yr', ter: 0.0007 },
  { indexCode: 'us_treasury_7_10y', name: 'US státní dluhopisy 7–10 let', category: 'Dluhopisy USD', isin: 'IE00B3VWN518', etfName: 'iShares USD Treasury Bond 7-10yr', ter: 0.0007 },
  { indexCode: 'us_treasury_20y', name: 'US státní dluhopisy 20+ let', category: 'Dluhopisy USD', isin: 'IE00BSKRJZ44', etfName: 'iShares USD Treasury Bond 20+yr', ter: 0.0007 },
  { indexCode: 'us_aggregate_bond', name: 'US agregátní dluhopisy', category: 'Dluhopisy USD', isin: 'IE00BYXYYM63', etfName: 'iShares US Aggregate Bond', ter: 0.0025 },
  { indexCode: 'us_corp_bond_ig', name: 'US firemní dluhopisy (IG)', category: 'Dluhopisy USD', isin: 'IE00BYXYYL56', etfName: 'iShares USD Corporate Bond', ter: 0.002 },
  { indexCode: 'gold', name: 'Zlato', category: 'Komodity', isin: 'IE00B4ND3602', etfName: 'iShares Physical Gold', ter: 0.0012 },
  { indexCode: 'commodities', name: 'Komodity (diverzifikované)', category: 'Komodity', isin: 'IE00BDFL4P12', etfName: 'iShares Diversified Commodity', ter: 0.0019 },
];

// === Hotová portfolia – 1:1 z originálu ===
const PRESET_PORTFOLIOS = [
  { id: 'sp500-100', name: '100% S&P 500', description: 'Čistě americké akcie', etfs: [{ indexCode: 'sp500', weight: 100 }] },
  { id: 'ftse-all-world', name: '100% All-World', description: 'Globální akcie', etfs: [{ indexCode: 'ftse_all_world', weight: 100 }] },
  { id: 'global-since-2000', name: 'Globální akcie (od 2000)', description: 'US 60 % + svět 40 %, historie až do roku 2000 (dot-com i krize 2008)', etfs: [{ indexCode: 'sp500', weight: 60 }, { indexCode: 'world_ex_us', weight: 40 }] },
  { id: '60-40', name: '60/40 portfolio', description: '60 % akcie, 40 % dluhopisy', etfs: [{ indexCode: 'ftse_all_world', weight: 60 }, { indexCode: 'us_aggregate_bond', weight: 40 }] },
  {
    id: 'all-weather', name: 'Ray Dalio All-Weather', description: 'Pro všechny tržní podmínky',
    etfs: [
      { indexCode: 'ftse_all_world', weight: 30 }, { indexCode: 'us_treasury_20y', weight: 40 },
      { indexCode: 'us_treasury_7_10y', weight: 15 }, { indexCode: 'gold', weight: 7.5 }, { indexCode: 'commodities', weight: 7.5 },
    ],
  },
  {
    id: 'permanent', name: 'Permanentní portfolio', description: '25 % akcie, dlouhé dluhopisy, hotovost, zlato',
    etfs: [
      { indexCode: 'ftse_all_world', weight: 25 }, { indexCode: 'us_treasury_20y', weight: 25 },
      { indexCode: 'us_treasury_1_3y', weight: 25 }, { indexCode: 'gold', weight: 25 },
    ],
  },
  {
    id: 'global-em', name: '80 % vyspělé + 20 % EM', description: 'Globální akcie s rozvíjejícími se trhy',
    etfs: [{ indexCode: 'msci_eafe', weight: 40 }, { indexCode: 'sp500', weight: 40 }, { indexCode: 'msci_em', weight: 20 }],
  },
];

interface SelectedETF {
  isin: string; name: string; ter: number; indexCode: string; indexName: string; weight: number;
}

// === Výstupní typ z API – 1:1 z originálu ===
interface DrawdownPeriod {
  startDate: string; troughDate: string; endDate: string | null; depth: number; lengthMonths: number; recovered: boolean;
}
interface BacktestResult {
  evolution: Array<{ date: string; value: number }>;
  summary: { amountInvested: number; netAssetValue: number; cagr: number; standardDeviation: number; sharpeRatio: number; sortinoRatio: number };
  returns: { annualReturns: Array<{ year: number; return: number }> };
  risk: {
    maxDrawdown: DrawdownPeriod;
    allDrawdowns?: DrawdownPeriod[];
    valueAtRisk95: number;
  };
  stressPeriods?: Array<{ key: string; name: string; startDate: string; troughDate: string; drop: number; recoveryMonths: number | null }>;
  drawdownSeries?: Array<{ date: string; drawdown: number }>;
  rollingReturns?: Array<{ years: number; average: number; high: number; low: number; count: number; positiveShare: number }>;
}

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: 'CZK', label: 'Kč' }, { code: 'EUR', label: '€' }, { code: 'USD', label: '$' },
];

// Barvy sérií pro porovnání: [0] = vlastní portfolio (teal), [1..] = porovnávaná.
const SERIES_COLORS = ['#0d9488', '#6366f1', '#f59e0b'];

const fmtMoney = (v: number, currency: Currency) =>
  new Intl.NumberFormat('cs-CZ', { style: 'currency', currency, maximumFractionDigits: 0 }).format(v);

const fmtPct = (v: number, digits = 1) =>
  `${v.toLocaleString('cs-CZ', { minimumFractionDigits: digits, maximumFractionDigits: digits })} %`;

const fmtCompact = (v: number, currency: Currency) => {
  const sym = currency === 'CZK' ? ' Kč' : currency === 'EUR' ? ' €' : ' $';
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace('.', ',')} mil.${sym}`;
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1000)} tis.${sym}`;
  return `${Math.round(v)}${sym}`;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('cs-CZ', { month: 'short', year: 'numeric' });

const indexNameByCode = (code: string) =>
  AVAILABLE_INDEXES.find((i) => i.indexCode === code)?.name ?? code;

export default function BacktestWidget() {
  const [currency, setCurrency] = useState<Currency>('CZK');
  const [selectedETFs, setSelectedETFs] = useState<SelectedETF[]>([
    { isin: 'IE00B5BMR087', name: 'iShares Core S&P 500', ter: 0.0007, indexCode: 'sp500', indexName: 'S&P 500', weight: 100 },
  ]);
  const [startDate, setStartDate] = useState('2005-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [initialAmount, setInitialAmount] = useState(100000);
  const [contributionAmount, setContributionAmount] = useState(5000);
  const [contributionFrequency, setContributionFrequency] = useState<ContributionFrequency>('monthly');
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultCurrency, setResultCurrency] = useState<Currency>('CZK');
  // Porovnání: id hotových portfolií, se kterými se vlastní portfolio poměří (max 2).
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [comparison, setComparison] = useState<{ name: string; result: BacktestResult }[] | null>(null);

  const totalWeight = selectedETFs.reduce((sum, etf) => sum + etf.weight, 0);
  // Vážený roční poplatek portfolia (TER) – kolik ročně stojí držení celého portfolia.
  const weightedTER = selectedETFs.reduce((sum, etf) => sum + (etf.weight / 100) * etf.ter, 0);

  const applyPreset = (presetId: string) => {
    const preset = PRESET_PORTFOLIOS.find((p) => p.id === presetId);
    if (!preset) return;
    const newETFs: SelectedETF[] = preset.etfs.map((item) => {
      const index = AVAILABLE_INDEXES.find((i) => i.indexCode === item.indexCode)!;
      return { isin: index.isin, name: index.etfName, ter: index.ter, indexCode: index.indexCode, indexName: index.name, weight: item.weight };
    });
    setSelectedETFs(newETFs);
  };

  const addETF = (indexCode: string) => {
    const index = AVAILABLE_INDEXES.find((i) => i.indexCode === indexCode);
    if (!index) return;
    if (selectedETFs.some((e) => e.indexCode === indexCode)) return;
    setSelectedETFs((prev) => [
      ...prev,
      { isin: index.isin, name: index.etfName, ter: index.ter, indexCode: index.indexCode, indexName: index.name, weight: 0 },
    ]);
  };

  const removeETF = (indexCode: string) =>
    setSelectedETFs((prev) => prev.filter((e) => e.indexCode !== indexCode));

  const setWeight = (indexCode: string, weight: number) =>
    setSelectedETFs((prev) => prev.map((e) => (e.indexCode === indexCode ? { ...e, weight: Math.max(0, Math.min(100, weight)) } : e)));

  // === Výpočet 1:1 z originálu – stejné tělo požadavku, stejný endpoint ===
  const runBacktest = async (overrideCurrency?: Currency) => {
    // Obrana: overrideCurrency smí být jen platná měna. Kdyby se sem dostal
    // např. klikací event (onClick={runBacktest}), padne JSON.stringify na
    // „cyclic structures". Proto raději fallback na aktuální currency.
    const cur: Currency =
      overrideCurrency === 'EUR' || overrideCurrency === 'CZK' || overrideCurrency === 'USD'
        ? overrideCurrency
        : currency;
    if (totalWeight !== 100) {
      setError(`Rozdělení musí být přesně 100 %. Aktuálně: ${totalWeight} %`);
      return;
    }
    if (selectedETFs.length === 0) {
      setError('Vyberte alespoň jeden fond.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const contributions = contributionFrequency !== 'none' && contributionAmount > 0
        ? { amount: contributionAmount, frequency: contributionFrequency as 'monthly' | 'quarterly' | 'yearly' }
        : undefined;

      // Jeden běh backtestu se stejnými parametry (částky, měna) – jen jiné složení a případně jiný start.
      const simulateOne = async (
        portfolio: { isin: string; name: string; weight: number; ter: number; indexCode: string }[],
        start: string,
      ) => {
        const response = await fetch('/api/backtest/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            portfolio, startDate: start, endDate, initialAmount,
            rebalancingStrategy: 'yearly', currency: cur, contributions,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Backtest se nepodařilo spustit.');
        }
        return response.json() as Promise<BacktestResult>;
      };

      const mainPortfolio = selectedETFs.map((etf) => ({
        isin: etf.isin, name: etf.name, weight: etf.weight / 100, ter: etf.ter, indexCode: etf.indexCode,
      }));
      const compPortfolios = compareIds.map((id) => {
        const preset = PRESET_PORTFOLIOS.find((p) => p.id === id)!;
        return preset.etfs.map((item) => {
          const index = AVAILABLE_INDEXES.find((i) => i.indexCode === item.indexCode)!;
          return { isin: index.isin, name: index.etfName, weight: item.weight / 100, ter: index.ter, indexCode: index.indexCode };
        });
      });

      // Vlastní portfolio + porovnávaná hotová portfolia spočítáme naráz (stejné období/vklady/měna).
      const runAll = (start: string) =>
        Promise.all([simulateOne(mainPortfolio, start), ...compPortfolios.map((pf) => simulateOne(pf, start))]);

      let results = await runAll(startDate);

      // FÉR SROVNÁNÍ: každé portfolio má jinak dlouhou historii (např. All-World až od 2008-07).
      // Kdyby jedno mělo delší období, mělo by nespravedlivou výhodu. Proto zarovnáme všechna
      // na společný start = nejpozdější první datum a přepočítáme (jako PortfolioVisualizer).
      if (compareIds.length) {
        const firsts = results.map((r) => r.evolution[0]?.date).filter(Boolean).sort() as string[];
        const commonStart = firsts[firsts.length - 1];
        const earliest = firsts[0];
        if (commonStart && earliest &&
            new Date(commonStart).getTime() - new Date(earliest).getTime() > 40 * 864e5) {
          results = await runAll(commonStart);
        }
      }

      const [mainData, ...compData] = results;

      setResult(mainData);
      setResultCurrency(cur);
      setComparison(
        compareIds.length
          ? compareIds.map((id, i) => ({ name: PRESET_PORTFOLIOS.find((p) => p.id === id)!.name, result: compData[i] }))
          : null,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neznámá chyba.');
    } finally {
      setLoading(false);
    }
  };

  const availableToAdd = AVAILABLE_INDEXES.filter((i) => !selectedETFs.some((e) => e.indexCode === i.indexCode));

  // Data pro recharts: hodnota portfolia + vložené prostředky (pro kontext)
  const chartData = useMemo(() => {
    if (!result) return [];
    return result.evolution.map((p) => ({ date: p.date, value: Math.round(p.value) }));
  }, [result]);

  const investedLine = result ? result.summary.amountInvested : 0;

  // Pokročilé ukazatele z ročních výnosů (engine je počítá time-weighted, bez vkladů).
  const advanced = useMemo(() => {
    const ar = result?.returns.annualReturns ?? [];
    if (ar.length === 0 || !result) return null;
    let best = ar[0], worst = ar[0];
    for (const r of ar) {
      if (r.return > best.return) best = r;
      if (r.return < worst.return) worst = r;
    }
    // Sortino (bezriziková sazba 0) = CAGR / kolísavost jen záporných let.
    const downside = Math.sqrt(ar.reduce((a, r) => a + (r.return < 0 ? r.return * r.return : 0), 0) / ar.length);
    const sortino = downside > 0 ? result.summary.cagr / downside : null;
    return { best, worst, sortino };
  }, [result]);

  // Největší propady (drawdowny) – API je počítá z time-weighted NAV. Nejhlubší první.
  const topDrawdowns = useMemo(() => {
    const dd = result?.risk.allDrawdowns ?? [];
    return [...dd].sort((a, b) => a.depth - b.depth).slice(0, 5);
  }, [result]);

  return (
    <div className="space-y-4">
      {/* ===== VSTUPY ===== */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Sestavte portfolio</p>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Skládáte z <strong className="font-medium text-slate-600">tříd aktiv</strong> (akcie, dluhopisy, zlato…). Každou testujeme
          na historii přes její <strong className="font-medium text-slate-600">reprezentativní ETF</strong> – jeho roční poplatek (TER)
          se do výsledku promítá.
        </p>

        {/* Hotová portfolia */}
        <div className="mb-5">
          <label className="block text-sm text-slate-600 mb-2">Hotová portfolia (jeden klik)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {PRESET_PORTFOLIOS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className="text-left rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-colors min-h-[44px]"
              >
                <span className="block font-medium text-sm text-slate-900">{preset.name}</span>
                <span className="block text-xs text-slate-500 mt-0.5">{preset.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Složení portfolia s váhami */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-slate-600">Složení a váhy</label>
            <span className={`text-sm font-semibold tabular-nums ${totalWeight === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
              Součet: {totalWeight} %
            </span>
          </div>
          <div className="space-y-2">
            {selectedETFs.map((etf) => (
              <div key={etf.indexCode} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-slate-900 truncate">{etf.indexName}</span>
                  <span className="block text-xs text-slate-400 truncate">
                    přes {etf.name} · TER {fmtPct(etf.ter * 100, 2)}
                  </span>
                </div>
                <div className="relative w-24 shrink-0">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={100}
                    value={etf.weight}
                    onChange={(e) => setWeight(etf.indexCode, Number(e.target.value))}
                    className="w-full min-h-[40px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-right text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                </div>
                <button
                  onClick={() => removeETF(etf.indexCode)}
                  aria-label={`Odebrat ${etf.indexName}`}
                  className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Přidat fond */}
          {availableToAdd.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-teal-50 text-teal-700">
                <Plus className="w-4 h-4" />
              </span>
              <select
                value=""
                onChange={(e) => { if (e.target.value) addETF(e.target.value); }}
                className="flex-1 min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
              >
                <option value="">Přidat další třídu aktiv…</option>
                {['Akcie', 'Dluhopisy EUR', 'Dluhopisy USD', 'Komodity'].map((cat) => (
                  <optgroup key={cat} label={cat}>
                    {availableToAdd.filter((i) => i.category === cat).map((i) => (
                      <option key={i.indexCode} value={i.indexCode}>{i.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}

          {/* Vážený roční poplatek celého portfolia */}
          {selectedETFs.length > 0 && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
              <span className="text-xs text-slate-600 flex items-center gap-1">
                Průměrný roční poplatek portfolia (TER)
                <InfoTip label="Vážený průměr TER podle vah. Kolik ročně stojí držení tohoto portfolia – tento poplatek se v backtestu odečítá z výnosu.">
                  <span className="sr-only">vysvětlení</span>
                </InfoTip>
              </span>
              <span className="text-sm font-semibold tabular-nums text-slate-900">{fmtPct(weightedTER * 100, 2)}</span>
            </div>
          )}
        </div>

        {/* Období + částky */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="bt-start" className="block text-sm text-slate-600 mb-1">Počáteční datum</label>
            <input id="bt-start" type="date" min="1993-01-01" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none" />
            <p className="text-xs text-slate-400 mt-1">Nejdelší historie od roku 1993 (S&amp;P 500). Každý index má jinak dlouhá data – backtest začne, až je mají všechny složky.</p>
          </div>
          <div>
            <label htmlFor="bt-end" className="block text-sm text-slate-600 mb-1">Koncové datum</label>
            <input id="bt-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="bt-initial" className="block text-sm text-slate-600 mb-1">Počáteční vklad</label>
            <div className="relative">
              <input id="bt-initial" type="text" inputMode="numeric" value={initialAmount === 0 ? '' : initialAmount} placeholder="0"
                onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ''); setInitialAmount(v === '' ? 0 : parseInt(v, 10)); }}
                className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">Kč</span>
            </div>
          </div>
          <div>
            <label htmlFor="bt-contrib" className="block text-sm text-slate-600 mb-1">Pravidelný vklad</label>
            <div className="relative">
              <input id="bt-contrib" type="text" inputMode="numeric" value={contributionAmount === 0 ? '' : contributionAmount} placeholder="0"
                onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ''); setContributionAmount(v === '' ? 0 : parseInt(v, 10)); }}
                className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">Kč</span>
            </div>
          </div>
          <div>
            <label htmlFor="bt-freq" className="block text-sm text-slate-600 mb-1 flex items-center gap-1">
              Frekvence vkladů
              <InfoTip label="Pravidelné investování stejné částky bez ohledu na cenu (tzv. průměrování nákupní ceny). Rozkládá riziko špatného načasování.">
                <span className="sr-only">vysvětlení</span>
              </InfoTip>
            </label>
            <select id="bt-freq" value={contributionFrequency} onChange={(e) => setContributionFrequency(e.target.value as ContributionFrequency)}
              className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none">
              <option value="none">Bez pravidelných vkladů</option>
              <option value="monthly">Měsíčně</option>
              <option value="quarterly">Čtvrtletně</option>
              <option value="yearly">Ročně</option>
            </select>
          </div>
        </div>

        {/* Měna zobrazení */}
        <div className="mb-4">
          <label className="block text-sm text-slate-600 mb-2 flex items-center gap-1">
            Měna zobrazení
            <InfoTip label="Indexy jsou vedeny v eurech. Pro zobrazení se hodnoty přepočítají historickými kurzy ECB/ČNB do zvolené měny.">
              <span className="sr-only">vysvětlení</span>
            </InfoTip>
          </label>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            {CURRENCIES.map((c) => (
              <button key={c.code} disabled={loading}
                onClick={() => { setCurrency(c.code); if (result) runBacktest(c.code); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors min-h-[40px] disabled:opacity-60 ${currency === c.code ? 'bg-white text-teal-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                {c.label} {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Porovnání s dalšími portfolii (volitelné) */}
        <div className="mb-5">
          <label className="block text-sm text-slate-600 mb-2 flex items-center gap-1">
            Porovnat s dalším portfoliem (volitelné)
            <InfoTip label="Poměřte své portfolio až se dvěma hotovými portfolii naráz – na stejném období, se stejnými vklady i měnou. Ukážeme srovnávací tabulku a překryvný graf.">
              <span className="sr-only">vysvětlení</span>
            </InfoTip>
          </label>
          {compareIds.length > 0 && (
            <div className="space-y-2 mb-2">
              {compareIds.map((id, i) => {
                const preset = PRESET_PORTFOLIOS.find((p) => p.id === id);
                return (
                  <div key={id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SERIES_COLORS[i + 1] }} />
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-slate-900 truncate">{preset?.name}</span>
                      <span className="block text-xs text-slate-500 truncate">{preset?.description}</span>
                    </div>
                    <button
                      onClick={() => setCompareIds((prev) => prev.filter((x) => x !== id))}
                      aria-label={`Odebrat ${preset?.name} z porovnání`}
                      className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {compareIds.length < 2 && (
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-indigo-50 text-indigo-600">
                <Plus className="w-4 h-4" />
              </span>
              <select
                value=""
                onChange={(e) => { if (e.target.value) setCompareIds((prev) => [...prev, e.target.value]); }}
                className="flex-1 min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
              >
                <option value="">Přidat portfolio k porovnání…</option>
                {PRESET_PORTFOLIOS.filter((p) => !compareIds.includes(p.id)).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Spustit */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <button
            onClick={() => runBacktest()}
            disabled={loading || totalWeight !== 100 || selectedETFs.length === 0}
            className="w-full sm:w-auto sm:flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Počítám historický vývoj…</> : <><Zap className="w-4 h-4" /> Otestovat na historii</>}
          </button>
          {totalWeight !== 100 && (
            <span className="flex items-center gap-1.5 text-sm text-amber-600">
              <AlertTriangle className="w-4 h-4 shrink-0" /> Součet vah musí být 100 %
            </span>
          )}
        </div>
      </div>

      {/* Chyba */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-red-800">Backtest se nepodařilo spustit</p>
            <p className="text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* ===== VÝSLEDKY ===== */}
      {result && !loading && (
        <>
          {/* Headline výsledek – kolik jsi vložil vs. kolik z toho je zisk (v Kč) */}
          {(() => {
            const invested = result.summary.amountInvested;
            const final = result.summary.netAssetValue;
            const profit = final - invested;
            const gain = profit >= 0;
            const profitPct = invested > 0 ? (profit / invested) * 100 : 0;
            const seg = gain
              ? [{ label: 'Vloženo', v: invested, color: 'bg-slate-400' }, { label: 'Zisk', v: profit, color: 'bg-emerald-500' }]
              : [{ label: 'Zůstalo', v: final, color: 'bg-slate-400' }, { label: 'Ztráta', v: -profit, color: 'bg-red-400' }];
            const total = seg.reduce((s, x) => s + x.v, 0) || 1;
            return (
              <div className="rounded-lg border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5 md:p-6">
                <p className="text-sm text-slate-600">
                  Z vložených <span className="font-medium text-slate-800">{fmtMoney(invested, resultCurrency)}</span> by k dnešku bylo
                </p>
                <p className="text-3xl md:text-4xl font-bold tabular-nums text-teal-800 mt-0.5">{fmtMoney(final, resultCurrency)}</p>
                <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  {seg.map((s) => (
                    <div key={s.label} className={s.color} style={{ width: `${(s.v / total) * 100}%` }} />
                  ))}
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-400" />
                    Vloženo <span className="font-semibold tabular-nums text-slate-800">{fmtMoney(invested, resultCurrency)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${gain ? 'bg-emerald-500' : 'bg-red-400'}`} />
                    {gain ? 'Zisk' : 'Ztráta'}{' '}
                    <span className={`font-semibold tabular-nums ${gain ? 'text-emerald-600' : 'text-red-600'}`}>
                      {gain ? '+' : ''}{fmtMoney(profit, resultCurrency)} ({gain ? '+' : ''}{fmtPct(profitPct)})
                    </span>
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Souhrnné metriky */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              icon={Coins} label="Konečná hodnota"
              value={fmtMoney(result.summary.netAssetValue, resultCurrency)}
              hint={`Vloženo ${fmtMoney(result.summary.amountInvested, resultCurrency)}`}
              tone="brand"
            />
            <MetricCard
              icon={TrendingUp}
              label={<>Roční zhodnocení <InfoTip label="Průměrné roční tempo růstu se zohledněním složeného úročení (CAGR) – jakým tempem portfolio reálně rostlo rok za rokem."><span className="sr-only">vysvětlení</span></InfoTip></>}
              value={fmtPct(result.summary.cagr * 100)}
              hint="ročně, po složeném úročení"
              tone={result.summary.cagr >= 0 ? 'pos' : 'neg'}
            />
            <MetricCard
              icon={TrendingDown}
              label={<>Max. pokles <InfoTip label="Největší propad hodnoty portfolia od předchozího vrcholu po dno. Ukazuje, kolik nervů by takové držení vyžadovalo."><span className="sr-only">vysvětlení</span></InfoTip></>}
              value={fmtPct(result.risk.maxDrawdown.depth * 100)}
              hint={`Trvání ${result.risk.maxDrawdown.lengthMonths} měs.`}
              tone="neg"
            />
            <MetricCard
              icon={Activity}
              label={<>Kolísavost <InfoTip label="Volatilita – jak silně hodnota portfolia kolísá nahoru a dolů (roční směrodatná odchylka). Vyšší číslo = divočejší jízda."><span className="sr-only">vysvětlení</span></InfoTip></>}
              value={fmtPct(result.summary.standardDeviation * 100)}
              hint="roční výkyvy hodnoty"
              tone="neutral"
            />
          </div>

          {/* Srovnání portfolií (když jsou vybrána) */}
          {comparison && (
            <ComparisonBlock
              portfolios={[{ name: 'Vaše portfolio', result }, ...comparison]}
              currency={resultCurrency}
            />
          )}

          {/* Graf vývoje hodnoty portfolia */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">
              {comparison ? 'Vývoj vašeho portfolia v čase' : 'Vývoj hodnoty portfolia v čase'}
            </p>
            <p className="text-xs text-slate-400 mb-3">
              {fmtDate(result.evolution[0]?.date)} – {fmtDate(result.evolution[result.evolution.length - 1]?.date)} · v přepočtu na {resultCurrency}
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="btFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="date" tickFormatter={fmtDate} minTickGap={48}
                    tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false}
                  />
                  <YAxis
                    width={64} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                    tickFormatter={(v: number) => fmtCompact(v, resultCurrency)}
                  />
                  {investedLine > 0 && (
                    <ReferenceLine y={investedLine} stroke="#94a3b8" strokeDasharray="4 4"
                      label={{ value: 'vloženo', position: 'insideTopLeft', fontSize: 10, fill: '#94a3b8' }} />
                  )}
                  <Tooltip
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const p = payload[0].payload as { date: string; value: number };
                      return (
                        <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
                          <div className="font-semibold mb-0.5">
                            {new Date(p.date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-teal-400" />
                            Hodnota: <span className="font-medium tabular-nums">{fmtMoney(p.value, resultCurrency)}</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2} fill="url(#btFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Přerušovaná čára ukazuje celkem vložené prostředky. Plocha nad ní je zhodnocení, propady pod předchozí vrchol jsou ony „max. poklesy“.
            </p>
          </div>

          {/* ── AKT 2: Kolik to bolelo (riziko) ── */}
          <div className="pt-2">
            <p className="text-sm font-semibold text-slate-800">Kolik to bolelo</p>
            <p className="text-xs text-slate-400 mt-0.5">Jak hluboké propady a jak dlouhé čekání na návrat portfolio přinášelo.</p>
          </div>

          {/* Krizové testy – jak by portfolio zvládlo slavné propady trhu */}
          {result.stressPeriods && result.stressPeriods.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Krizové testy</p>
              <p className="text-xs text-slate-400 mb-3">
                Jak hluboko by portfolio kleslo během slavných propadů trhu (ukazujeme jen krize, které vaše období pokrývá).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {result.stressPeriods.map((s) => {
                  const rec = s.recoveryMonths;
                  const y = rec != null ? Math.round(rec / 12) : 0;
                  const recLabel = rec == null
                    ? 'zatím bez návratu'
                    : rec < 18
                      ? `návrat za ${rec} měs.`
                      : `návrat za ~${y} ${y === 1 ? 'rok' : y < 5 ? 'roky' : 'let'}`;
                  return (
                    <div key={s.key} className="rounded-lg border border-red-100 bg-red-50/40 p-3.5">
                      <p className="text-sm font-medium text-slate-900 leading-snug">{s.name}</p>
                      <p className="mt-1.5 text-2xl font-bold tabular-nums text-red-600">{fmtPct(s.drop * 100)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        dno {fmtDate(s.troughDate)} · <span className={rec == null ? 'text-amber-600' : 'text-emerald-600'}>{recLabel}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                Propady jsou normální daň za dlouhodobý růst. Kdo vydržel a neprodal ve strachu, se v minulosti zpravidla dočkal zotavení – ale zaručené to není.
              </p>
            </div>
          )}

          {/* Underwater graf – jak dlouho bylo portfolio ve ztrátě (pod vrcholem) */}
          {result.drawdownSeries && result.drawdownSeries.length > 1 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1 flex items-center gap-1">
                Jak dlouho bylo portfolio ve ztrátě
                <InfoTip label="Underwater / drawdown – graf ztráty od předchozího maxima v čase. Nula = nový vrchol, čím hlouběji, tím větší dočasná ztráta.">
                  <span className="sr-only">vysvětlení</span>
                </InfoTip>
              </p>
              <p className="text-xs text-slate-400 mb-3">
                Plocha pod nulou ukazuje, jak hluboko a jak dlouho byla hodnota pod předchozím vrcholem, než se vrátila zpět.
              </p>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={result.drawdownSeries.map((p) => ({ date: p.date, dd: +(p.drawdown * 100).toFixed(2) }))}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="uwFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#dc2626" stopOpacity={0.06} />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity={0.35} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={fmtDate} minTickGap={48}
                      tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis width={48} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                      tickFormatter={(v: number) => `${Math.round(v)} %`} domain={['dataMin', 0]} />
                    <ReferenceLine y={0} stroke="#cbd5e1" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const p = payload[0].payload as { date: string; dd: number };
                        return (
                          <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
                            <div className="font-semibold mb-0.5">
                              {new Date(p.date).toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
                            </div>
                            {p.dd >= -0.05
                              ? <div>Na vrcholu — bez ztráty</div>
                              : <div>Pod vrcholem: <span className="font-medium tabular-nums">{fmtPct(p.dd)}</span></div>}
                          </div>
                        );
                      }}
                    />
                    <Area type="monotone" dataKey="dd" stroke="#dc2626" strokeWidth={1.5} fill="url(#uwFill)" baseValue={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                Většinu času se hodnota drží na nule (nové maximum) nebo blízko ní; hluboké „doliny" jsou krize. Návrat na nulu znamená, že portfolio překonalo předchozí vrchol.
              </p>
            </div>
          )}

          {/* ── AKT 3: Jak spolehlivý byl výnos ── */}
          <div className="pt-2">
            <p className="text-sm font-semibold text-slate-800">Jak spolehlivý byl výnos</p>
            <p className="text-xs text-slate-400 mt-0.5">Jak konzistentní byl výnos napříč jednotlivými roky i delšími horizonty.</p>
          </div>

          {/* Roční výnosy – reálná data z backtestu (nej/nejhorší rok vyznačen) */}
          {result.returns.annualReturns.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">Roční výnosy</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                {result.returns.annualReturns.map((r) => {
                  const pos = r.return >= 0;
                  const isBest = !!advanced && r.year === advanced.best.year;
                  const isWorst = !!advanced && r.year === advanced.worst.year;
                  return (
                    <div key={r.year} className={`relative rounded-lg border p-2.5 text-center ${isBest ? 'border-emerald-400 ring-1 ring-emerald-300' : isWorst ? 'border-red-400 ring-1 ring-red-300' : pos ? 'border-emerald-100 bg-emerald-50/50' : 'border-red-100 bg-red-50/50'}`}>
                      {(isBest || isWorst) && (
                        <span className={`absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-[9px] font-medium leading-none ${isBest ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                          {isBest ? 'nejlepší' : 'nejhorší'}
                        </span>
                      )}
                      <p className="text-xs text-slate-500 tabular-nums">{r.year}</p>
                      <p className={`text-sm font-semibold tabular-nums ${pos ? 'text-emerald-600' : 'text-red-600'}`}>
                        {pos ? '+' : ''}{fmtPct(r.return * 100)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                Zelené roky portfolio rostlo, červené klesalo (nejlepší a nejhorší rok jsou vyznačené). Pro klid v duši je důležitý dlouhodobý trend, ne jednotlivý špatný rok.
              </p>
            </div>
          )}

          {/* Rolling returns – „záleželo, kdy jste začali?" */}
          {result.rollingReturns && result.rollingReturns.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1 flex items-center gap-1">
                Záleželo, kdy jste začali?
                <InfoTip label="Rolling returns – vezmeme každý možný začátek v historii, podržíme daný počet let a spočítáme roční výnos. Ukáže, jak moc na načasování záleželo.">
                  <span className="sr-only">vysvětlení</span>
                </InfoTip>
              </p>
              <p className="text-xs text-slate-400 mb-3">
                Kdybyste do tohoto portfolia vstoupili kdykoli v historii a drželi daný počet let, jaký roční výnos byste dostali – a jak často to skončilo v plusu.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="text-left font-medium py-2 pr-3 whitespace-nowrap">Držel/a jsem</th>
                      <th className="text-right font-medium py-2 px-3 whitespace-nowrap">Nejhorší</th>
                      <th className="text-right font-medium py-2 px-3 whitespace-nowrap">Průměr</th>
                      <th className="text-right font-medium py-2 px-3 whitespace-nowrap">Nejlepší</th>
                      <th className="text-right font-medium py-2 pl-3 whitespace-nowrap">V plusu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rollingReturns.map((r) => (
                      <tr key={r.years} className="border-b border-slate-100 last:border-0">
                        <td className="text-slate-600 py-2.5 pr-3 whitespace-nowrap">{r.years} {r.years === 1 ? 'rok' : r.years < 5 ? 'roky' : 'let'}</td>
                        <td className={`text-right py-2.5 px-3 tabular-nums font-semibold whitespace-nowrap ${r.low >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {r.low >= 0 ? '+' : ''}{fmtPct(r.low * 100)}
                        </td>
                        <td className="text-right py-2.5 px-3 tabular-nums text-slate-700 whitespace-nowrap">{r.average >= 0 ? '+' : ''}{fmtPct(r.average * 100)}</td>
                        <td className="text-right py-2.5 px-3 tabular-nums font-semibold text-emerald-600 whitespace-nowrap">+{fmtPct(r.high * 100)}</td>
                        <td className={`text-right py-2.5 pl-3 tabular-nums font-semibold whitespace-nowrap ${r.positiveShare >= 0.999 ? 'text-emerald-600' : 'text-slate-700'}`}>
                          {Math.round(r.positiveShare * 100)} %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                Čím delší horizont, tím užší rozpětí mezi nejhorším a nejlepším – načasování přestává rozhodovat a roste šance na kladný výsledek. Zaručené to ale není.
              </p>
            </div>
          )}

          {/* Pokročilé ukazatele – za rozklikem (progressive disclosure), standardní názvy + ⓘ */}
          {(() => {
            const s = result.summary;
            const dd = Math.abs(result.risk.maxDrawdown.depth);
            const calmar = dd > 0 ? s.cagr / dd : null;
            const fmt2 = (v: number) => v.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            return (
              <details className="group rounded-lg border border-slate-200 bg-white">
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Pokročilé ukazatele</span>
                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="hidden sm:inline">Sharpe · Sortino · Calmar · VaR</span>
                    <span className="inline-flex items-center gap-1 font-medium text-teal-700 group-open:text-slate-500">
                      <span className="group-open:hidden">Zobrazit</span>
                      <span className="hidden group-open:inline">Skrýt</span>
                      <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                    </span>
                  </span>
                </summary>
                <div className="px-5 pb-5 md:px-6 md:pb-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <MetricCard
                      icon={Activity}
                      label={<>Sharpe <InfoTip label="Kolik výnosu jsi dostal za každou jednotku kolísání. Vyšší číslo = líp zaplaceno za podstoupené nervy."><span className="sr-only">vysvětlení</span></InfoTip></>}
                      value={fmt2(s.sharpeRatio)} hint="výnos vs. kolísání" tone="neutral"
                    />
                    <MetricCard
                      icon={Activity}
                      label={<>Sortino <InfoTip label="Jako Sharpe, ale trestá jen propady (ty, co bolí), ne výkyvy nahoru. Vyšší = lepší."><span className="sr-only">vysvětlení</span></InfoTip></>}
                      value={fmt2(s.sortinoRatio)} hint="výnos vs. propady" tone="neutral"
                    />
                    <MetricCard
                      icon={Activity}
                      label={<>Calmar <InfoTip label="Roční výnos vůči nejhoršímu propadu. Vyšší = výnos se drží snáz, protože propady byly mělčí."><span className="sr-only">vysvětlení</span></InfoTip></>}
                      value={calmar != null ? fmt2(calmar) : '—'} hint="výnos vs. max. propad" tone="neutral"
                    />
                    <MetricCard
                      icon={TrendingDown}
                      label={<>VaR 95 % <InfoTip label="Value at Risk – zhruba nejhorší rok, který běžně čekat. Horší nastane jen asi v 1 roce z 20."><span className="sr-only">vysvětlení</span></InfoTip></>}
                      value={fmtPct(result.risk.valueAtRisk95 * 100)} hint="odhad špatného roku" tone="neg"
                    />
                  </div>
                  <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                    Rizikově vážené ukazatele pro pokročilé – co znamenají, najdete pod ⓘ u každého názvu. Pro běžné rozhodnutí stačí výnos a největší pokles výše.
                  </p>

                  {/* Největší propady – přesná tabulka pro pokročilé (pojmenované verze jsou v Krizových testech výše) */}
                  {topDrawdowns.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-slate-100">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Největší propady (detailně)</p>
                      <p className="text-xs text-slate-400 mb-3">Nejhlubší poklesy od vrcholu po dno a jak dlouho trvalo zotavení.</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500">
                              <th className="text-left font-medium py-2 pr-3 whitespace-nowrap">#</th>
                              <th className="text-right font-medium py-2 px-3 whitespace-nowrap">Hloubka</th>
                              <th className="text-left font-medium py-2 px-3 whitespace-nowrap">Od vrcholu</th>
                              <th className="text-left font-medium py-2 px-3 whitespace-nowrap">Dno</th>
                              <th className="text-left font-medium py-2 px-3 whitespace-nowrap">Zotaveno</th>
                              <th className="text-right font-medium py-2 pl-3 whitespace-nowrap">Délka</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topDrawdowns.map((d, i) => (
                              <tr key={i} className="border-b border-slate-100 last:border-0">
                                <td className="text-slate-400 py-2.5 pr-3 tabular-nums">{i + 1}</td>
                                <td className="text-right py-2.5 px-3 tabular-nums font-semibold text-red-600 whitespace-nowrap">{fmtPct(d.depth * 100)}</td>
                                <td className="text-slate-600 py-2.5 px-3 whitespace-nowrap">{fmtDate(d.startDate)}</td>
                                <td className="text-slate-600 py-2.5 px-3 whitespace-nowrap">{fmtDate(d.troughDate)}</td>
                                <td className="py-2.5 px-3 whitespace-nowrap">
                                  {d.recovered && d.endDate
                                    ? <span className="text-slate-600">{fmtDate(d.endDate)}</span>
                                    : <span className="text-amber-600">zatím ne</span>}
                                </td>
                                <td className="text-right py-2.5 pl-3 tabular-nums text-slate-500 whitespace-nowrap">{d.lengthMonths} měs.</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </details>
            );
          })()}

          {/* Připomenutí limitů backtestu */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-900/80 leading-relaxed">
              Výsledky ukazují, jak by se portfolio chovalo <strong>v minulosti</strong>. Testujeme <strong>třídy aktiv</strong> (indexy)
              očištěné o roční poplatek reprezentativního fondu (TER). Nezahrnují poplatky brokera, spready ani daně a nejsou
              příslibem budoucích výnosů – trh se v dalších letech může chovat úplně jinak.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// Nejlepší/nejhorší rok z ročních výnosů (v %).
const bestYearPct = (r: BacktestResult) =>
  r.returns.annualReturns.length ? Math.max(...r.returns.annualReturns.map((a) => a.return)) * 100 : 0;
const worstYearPct = (r: BacktestResult) =>
  r.returns.annualReturns.length ? Math.min(...r.returns.annualReturns.map((a) => a.return)) * 100 : 0;

function ComparisonBlock({
  portfolios, currency,
}: {
  portfolios: { name: string; result: BacktestResult }[];
  currency: Currency;
}) {
  // Překryvný graf: hodnoty všech portfolií sloučené podle data (osy zarovnané na společné období).
  const chartData = useMemo(() => {
    const byDate = new Map<string, Record<string, number | string>>();
    portfolios.forEach((p, si) => {
      p.result.evolution.forEach((pt) => {
        const row = byDate.get(pt.date) ?? { date: pt.date };
        row[`s${si}`] = Math.round(pt.value);
        byDate.set(pt.date, row);
      });
    });
    return [...byDate.values()].sort((a, b) => ((a.date as string) < (b.date as string) ? -1 : 1));
  }, [portfolios]);

  // Řádky tabulky: hodnota + směr „co je lepší" (pro zvýraznění nejlepšího sloupce).
  const rows: { label: React.ReactNode; values: number[]; fmt: (v: number) => string; better: 'high' | 'low' }[] = [
    { label: 'Konečná hodnota', values: portfolios.map((p) => p.result.summary.netAssetValue), fmt: (v) => fmtMoney(v, currency), better: 'high' },
    { label: 'Roční zhodnocení (CAGR)', values: portfolios.map((p) => p.result.summary.cagr * 100), fmt: (v) => fmtPct(v), better: 'high' },
    { label: 'Max. pokles', values: portfolios.map((p) => p.result.risk.maxDrawdown.depth * 100), fmt: (v) => fmtPct(v), better: 'high' },
    { label: 'Kolísavost', values: portfolios.map((p) => p.result.summary.standardDeviation * 100), fmt: (v) => fmtPct(v), better: 'low' },
    { label: 'Sharpe', values: portfolios.map((p) => p.result.summary.sharpeRatio), fmt: (v) => v.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), better: 'high' },
    { label: 'Nejlepší rok', values: portfolios.map((p) => bestYearPct(p.result)), fmt: (v) => fmtPct(v), better: 'high' },
    { label: 'Nejhorší rok', values: portfolios.map((p) => worstYearPct(p.result)), fmt: (v) => fmtPct(v), better: 'high' },
  ];

  const bestIndex = (values: number[], better: 'high' | 'low') => {
    let idx = 0;
    for (let i = 1; i < values.length; i++) {
      if (better === 'high' ? values[i] > values[idx] : values[i] < values[idx]) idx = i;
    }
    return idx;
  };

  const first = chartData[0]?.date as string | undefined;
  const last = chartData[chartData.length - 1]?.date as string | undefined;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6 space-y-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Srovnání portfolií</p>
        {first && last && (
          <p className="text-xs text-slate-400">
            Stejné období {fmtDate(first)} – {fmtDate(last)} · stejné vklady · v přepočtu na {currency}. Nejlepší hodnota v každém řádku je zvýrazněná.
          </p>
        )}
      </div>

      {/* Překryvný graf vývoje */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="date" tickFormatter={fmtDate} minTickGap={48}
              tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
            <YAxis width={64} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
              tickFormatter={(v: number) => fmtCompact(v, currency)} />
            <Tooltip
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
                    <div className="font-semibold mb-1">
                      {new Date(label as string).toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
                    </div>
                    {payload.map((entry, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: entry.color as string }} />
                        {portfolios[Number(String(entry.dataKey).slice(1))]?.name}:{' '}
                        <span className="font-medium tabular-nums">{fmtMoney(entry.value as number, currency)}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            <Legend
              formatter={(value) => <span className="text-xs text-slate-600">{portfolios[Number(String(value).slice(1))]?.name}</span>}
            />
            {portfolios.map((_, si) => (
              <Line key={si} type="monotone" dataKey={`s${si}`} name={`s${si}`}
                stroke={SERIES_COLORS[si] ?? '#64748b'} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Srovnávací tabulka */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left font-medium text-slate-500 py-2 pr-3 whitespace-nowrap">Ukazatel</th>
              {portfolios.map((p, si) => (
                <th key={si} className="text-right font-semibold text-slate-900 py-2 px-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SERIES_COLORS[si] ?? '#64748b' }} />
                    {p.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const bi = bestIndex(row.values, row.better);
              return (
                <tr key={ri} className="border-b border-slate-100 last:border-0">
                  <td className="text-slate-600 py-2.5 pr-3 whitespace-nowrap">{row.label}</td>
                  {row.values.map((v, ci) => (
                    <td key={ci}
                      className={`text-right py-2.5 px-3 tabular-nums whitespace-nowrap ${ci === bi ? 'font-bold text-teal-700 bg-teal-50/60 rounded' : 'text-slate-700'}`}>
                      {row.fmt(v)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        Vyšší konečná hodnota neznamená automaticky lepší portfolio – všímejte si i max. poklesu a kolísavosti (kolik nervů by vás držení stálo).
        Sharpe poměřuje výnos vůči riziku: čím vyšší, tím lepší poměr.
      </p>
    </div>
  );
}

function MetricCard({
  icon: Icon, label, value, hint, tone,
}: {
  icon: typeof Coins;
  label: React.ReactNode;
  value: string;
  hint: string;
  tone: 'brand' | 'pos' | 'neg' | 'neutral';
}) {
  const valueColor =
    tone === 'pos' ? 'text-emerald-600' : tone === 'neg' ? 'text-red-600' : 'text-slate-900';
  const iconWrap =
    tone === 'brand' ? 'bg-teal-50 text-teal-700'
      : tone === 'pos' ? 'bg-emerald-50 text-emerald-600'
        : tone === 'neg' ? 'bg-red-50 text-red-600'
          : 'bg-slate-100 text-slate-500';
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <span className={`flex items-center justify-center w-9 h-9 rounded-lg mb-3 ${iconWrap}`}>
        <Icon className="w-4 h-4" />
      </span>
      <p className="text-xs text-slate-500 flex items-center gap-1 flex-wrap">{label}</p>
      <p className={`text-xl font-bold tabular-nums mt-0.5 ${valueColor}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{hint}</p>
    </div>
  );
}
