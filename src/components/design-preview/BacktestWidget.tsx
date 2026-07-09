'use client';

import React, { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import {
  Plus, Trash2, AlertTriangle, Zap, TrendingDown, TrendingUp, Activity, Coins, Loader2, Info,
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
  { id: '60-40', name: '60/40 portfolio', description: '60 % akcie, 40 % dluhopisy', etfs: [{ indexCode: 'sp500', weight: 60 }, { indexCode: 'us_aggregate_bond', weight: 40 }] },
  {
    id: 'all-weather', name: 'Ray Dalio All-Weather', description: 'Pro všechny tržní podmínky',
    etfs: [
      { indexCode: 'sp500', weight: 30 }, { indexCode: 'us_treasury_20y', weight: 40 },
      { indexCode: 'us_treasury_7_10y', weight: 15 }, { indexCode: 'gold', weight: 7 }, { indexCode: 'commodities', weight: 8 },
    ],
  },
  {
    id: 'permanent', name: 'Permanentní portfolio', description: '25 % akcie, dluhopisy, zlato, hotovost',
    etfs: [
      { indexCode: 'sp500', weight: 25 }, { indexCode: 'us_treasury_20y', weight: 25 },
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
interface BacktestResult {
  evolution: Array<{ date: string; value: number }>;
  summary: { amountInvested: number; netAssetValue: number; cagr: number; standardDeviation: number; sharpeRatio: number };
  returns: { annualReturns: Array<{ year: number; return: number }> };
  risk: {
    maxDrawdown: { startDate: string; troughDate: string; endDate: string | null; depth: number; lengthMonths: number; recovered: boolean };
    valueAtRisk95: number;
  };
}

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: 'CZK', label: 'Kč' }, { code: 'EUR', label: '€' }, { code: 'USD', label: '$' },
];

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

  const totalWeight = selectedETFs.reduce((sum, etf) => sum + etf.weight, 0);

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
      const portfolio = selectedETFs.map((etf) => ({
        isin: etf.isin, name: etf.name, weight: etf.weight / 100, ter: etf.ter, indexCode: etf.indexCode,
      }));
      const contributions = contributionFrequency !== 'none' && contributionAmount > 0
        ? { amount: contributionAmount, frequency: contributionFrequency as 'monthly' | 'quarterly' | 'yearly' }
        : undefined;

      const response = await fetch('/api/backtest/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolio, startDate, endDate, initialAmount,
          rebalancingStrategy: 'yearly', currency: cur, contributions,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Backtest se nepodařilo spustit.');
      }
      const data = await response.json();
      setResult(data);
      setResultCurrency(cur);
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

  return (
    <div className="space-y-4">
      {/* ===== VSTUPY ===== */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">Sestavte portfolio</p>

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
                  <span className="block text-xs text-slate-400 truncate">{etf.name}</span>
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
                <option value="">Přidat fond do portfolia…</option>
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
        </div>

        {/* Období + částky */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="bt-start" className="block text-sm text-slate-600 mb-1">Počáteční datum</label>
            <input id="bt-start" type="date" min="2000-01-01" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none" />
            <p className="text-xs text-slate-400 mt-1">Data dostupná od roku 2000</p>
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

          {/* Graf vývoje hodnoty portfolia */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Vývoj hodnoty portfolia v čase</p>
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

          {/* Roční výnosy – reálná data z backtestu */}
          {result.returns.annualReturns.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">Roční výnosy</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {result.returns.annualReturns.map((r) => {
                  const pos = r.return >= 0;
                  return (
                    <div key={r.year} className={`rounded-lg border p-2.5 text-center ${pos ? 'border-emerald-100 bg-emerald-50/50' : 'border-red-100 bg-red-50/50'}`}>
                      <p className="text-xs text-slate-500 tabular-nums">{r.year}</p>
                      <p className={`text-sm font-semibold tabular-nums ${pos ? 'text-emerald-600' : 'text-red-600'}`}>
                        {pos ? '+' : ''}{fmtPct(r.return * 100)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                Zelené roky portfolio rostlo, červené klesalo. Pro klid v duši je důležitý dlouhodobý trend, ne jednotlivý špatný rok.
              </p>
            </div>
          )}

          {/* Připomenutí limitů backtestu */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-900/80 leading-relaxed">
              Výsledky ukazují, jak by se portfolio chovalo <strong>v minulosti</strong>. Nezahrnují poplatky brokera, spready ani daně a nejsou
              příslibem budoucích výnosů – trh se v dalších letech může chovat úplně jinak.
            </p>
          </div>
        </>
      )}
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
