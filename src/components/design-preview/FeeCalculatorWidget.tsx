'use client';

import React, { useState, useEffect } from 'react';
import { TrendingDown, Landmark, AlertTriangle, Sparkles } from 'lucide-react';

/**
 * Interaktivní jádro kalkulačky poplatků – PRESKINOVANÁ verze.
 * Výpočetní logika je 1:1 převzata z původního FeeCalculatorContent.tsx
 * (ověřené řádky 37–119) – měněn je POUZE vizuál (teal/slate, karty design systému,
 * mobil = dva fondy pod sebou). Logiku neměnit.
 */

const fmtCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

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
  label: string;
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

const fmtCompact = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace('.', ',')} mil.`;
  if (v >= 1_000) return `${Math.round(v / 1000)} tis.`;
  return `${Math.round(v)}`;
};

/** Interaktivní SVG graf vývoje hodnoty portfolia (bez knihovny). Najetí myší ukáže hodnoty v daném roce. */
function FeeChart({ etf, active, years, etfTER, activeTER }: { etf: number[]; active: number[]; years: number; etfTER: number; activeTER: number }) {
  const [hover, setHover] = useState<number | null>(null);
  if (etf.length < 2 || active.length < 2) return null;
  const W = 640, H = 240, padL = 10, padR = 10, padT = 22, padB = 24;
  const iW = W - padL - padR, iH = H - padT - padB;
  const maxV = Math.max(...etf, ...active, 1);
  const n = etf.length;
  const X = (i: number) => padL + (i / (n - 1)) * iW;
  const Y = (v: number) => padT + iH - (v / maxV) * iH;
  const ptsEtf = etf.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
  const ptsAct = active.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
  const area = etf.map((v, i) => `${X(i)},${Y(v)}`).join(' ') + ' ' + active.map((_, i) => `${X(n - 1 - i)},${Y(active[n - 1 - i])}`).join(' ');
  const yearTicks = Array.from(new Set([0, Math.round(years / 2), years]));

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    setHover(Math.max(0, Math.min(n - 1, Math.round(rel * (n - 1)))));
  };
  const hi = hover;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-slate-600">
        <span className="flex items-center gap-1.5"><span className="inline-block w-3.5 h-1 rounded-full bg-teal-600" /> Levný ETF ({etfTER.toLocaleString('cs-CZ')} % TER)</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3.5 h-1 rounded-full bg-slate-400" /> Drahý fond ({activeTER.toLocaleString('cs-CZ')} % TER)</span>
        <span className="flex items-center gap-1.5 sm:ml-auto"><span className="inline-block w-3 h-3 rounded-sm bg-teal-100" /> rozdíl = zaplacené poplatky</span>
      </div>
      <div className="relative" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Graf vývoje hodnoty portfolia levného ETF vs drahého fondu v čase">
          <polygon points={area} fill="#5eead4" opacity="0.35" />
          <polyline points={ptsAct} fill="none" stroke="#94a3b8" strokeWidth="2" />
          <polyline points={ptsEtf} fill="none" stroke="#0d9488" strokeWidth="2.5" />
          {/* koncové hodnoty – vždy viditelné */}
          <circle cx={X(n - 1)} cy={Y(etf[n - 1])} r="3.5" fill="#0d9488" />
          <circle cx={X(n - 1)} cy={Y(active[n - 1])} r="3.5" fill="#94a3b8" />
          <text x={X(n - 1) - 6} y={Y(etf[n - 1]) - 7} textAnchor="end" fontSize="12" fontWeight="600" fill="#0d9488">{fmtCompact(etf[n - 1])} Kč</text>
          <text x={X(n - 1) - 6} y={Y(active[n - 1]) + 14} textAnchor="end" fontSize="12" fill="#64748b">{fmtCompact(active[n - 1])} Kč</text>
          {yearTicks.map((t) => (
            <text key={t} x={Math.min(Math.max(X(t), 14), W - 14)} y={H - 6} textAnchor="middle" fontSize="11" fill="#94a3b8">{t} let</text>
          ))}
          <text x={padL} y={13} fontSize="11" fill="#94a3b8">{fmtCompact(maxV)} Kč</text>
          {/* hover */}
          {hi != null && (
            <g>
              <line x1={X(hi)} x2={X(hi)} y1={padT} y2={H - padB} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={X(hi)} cy={Y(etf[hi])} r="4.5" fill="#0d9488" stroke="#fff" strokeWidth="1.5" />
              <circle cx={X(hi)} cy={Y(active[hi])} r="4.5" fill="#94a3b8" stroke="#fff" strokeWidth="1.5" />
            </g>
          )}
        </svg>
        {hi != null && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -top-1 z-10 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg whitespace-nowrap"
            style={{ left: `${(X(hi) / W) * 100}%` }}
          >
            <div className="font-semibold mb-1">Po {hi} {hi === 1 ? 'roce' : hi >= 5 ? 'letech' : 'letech'}</div>
            <div className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-teal-400" /> Levný ETF: <span className="font-medium tabular-nums">{fmtCZK(etf[hi])}</span></div>
            <div className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-slate-400" /> Drahý fond: <span className="font-medium tabular-nums">{fmtCZK(active[hi])}</span></div>
            <div className="mt-1 pt-1 border-t border-white/15 text-teal-300">Rozdíl: <span className="font-semibold tabular-nums">{fmtCZK(etf[hi] - active[hi])}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeeCalculatorWidget() {
  // Společné parametry investice
  const [investedAmount, setInvestedAmount] = useState<number>(250000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(12500);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(30);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);

  // TER pro oba typy fondů
  const [etfTER, setEtfTER] = useState<number>(0.2);
  const [activeTER, setActiveTER] = useState<number>(1.8);

  // Výsledky pro ETF
  const [etfFinalValue, setEtfFinalValue] = useState<number>(0);
  const [etfTotalFees, setEtfTotalFees] = useState<number>(0);

  // Výsledky pro bankovní/podílový fond
  const [activeFinalValue, setActiveFinalValue] = useState<number>(0);
  const [activeTotalFees, setActiveTotalFees] = useState<number>(0);

  // Rozdíl mezi nimi
  const [valueDifference, setValueDifference] = useState<number>(0);
  const [feeDifference, setFeeDifference] = useState<number>(0);

  // Časová řada hodnoty portfolia po letech (pro graf)
  const [etfSeries, setEtfSeries] = useState<number[]>([]);
  const [activeSeries, setActiveSeries] = useState<number[]>([]);

  // ===== VÝPOČET 1:1 z původní komponenty (řádky 37–119) – NEMĚNIT =====
  const calculateComparison = () => {
    const annualReturn = expectedReturn / 100;
    const months = investmentPeriod * 12;

    if (months <= 0 || investedAmount < 0 || monthlyContribution < 0) {
      setEtfFinalValue(0);
      setEtfTotalFees(0);
      setActiveFinalValue(0);
      setActiveTotalFees(0);
      setValueDifference(0);
      setFeeDifference(0);
      setEtfSeries([]);
      setActiveSeries([]);
      return;
    }

    const annualETFReturn = Math.max(-0.99, annualReturn - etfTER / 100);
    const annualActiveReturn = Math.max(-0.99, annualReturn - activeTER / 100);

    const monthlyETFReturn = Math.pow(1 + annualETFReturn, 1 / 12) - 1;
    const monthlyActiveReturn = Math.pow(1 + annualActiveReturn, 1 / 12) - 1;

    let etfPortfolioValue = investedAmount;
    let etfTotalFeesCalc = 0;
    const etfPoints: number[] = [investedAmount];
    for (let month = 1; month <= months; month++) {
      etfPortfolioValue *= 1 + monthlyETFReturn;
      etfPortfolioValue += monthlyContribution;
      const monthlyFee = etfPortfolioValue * (etfTER / 100 / 12);
      etfTotalFeesCalc += monthlyFee;
      if (month % 12 === 0) etfPoints.push(etfPortfolioValue);
    }

    let activePortfolioValue = investedAmount;
    let activeTotalFeesCalc = 0;
    const activePoints: number[] = [investedAmount];
    for (let month = 1; month <= months; month++) {
      activePortfolioValue *= 1 + monthlyActiveReturn;
      activePortfolioValue += monthlyContribution;
      const monthlyFee = activePortfolioValue * (activeTER / 100 / 12);
      activeTotalFeesCalc += monthlyFee;
      if (month % 12 === 0) activePoints.push(activePortfolioValue);
    }

    setEtfSeries(etfPoints.map((v) => (isFinite(v) ? Math.max(0, v) : 0)));
    setActiveSeries(activePoints.map((v) => (isFinite(v) ? Math.max(0, v) : 0)));

    const safeETFValue = isFinite(etfPortfolioValue) ? etfPortfolioValue : 0;
    const safeActiveValue = isFinite(activePortfolioValue) ? activePortfolioValue : 0;
    const safeETFFees = isFinite(etfTotalFeesCalc) ? etfTotalFeesCalc : 0;
    const safeActiveFees = isFinite(activeTotalFeesCalc) ? activeTotalFeesCalc : 0;

    setEtfFinalValue(Math.max(0, safeETFValue));
    setEtfTotalFees(Math.max(0, safeETFFees));
    setActiveFinalValue(Math.max(0, safeActiveValue));
    setActiveTotalFees(Math.max(0, safeActiveFees));

    setValueDifference(safeETFValue - safeActiveValue);
    setFeeDifference(safeActiveFees - safeETFFees);
  };

  useEffect(() => {
    calculateComparison();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investedAmount, monthlyContribution, investmentPeriod, expectedReturn, etfTER, activeTER]);
  // ===== KONEC převzaté logiky =====

  const warnSameOrHigher = etfTER >= activeTER;
  const warnReturn = expectedReturn < 3 || expectedReturn > 15;

  return (
    <div className="space-y-4">
      {/* Vstupní parametry */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">
          Parametry srovnání
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NumberField id="initial" label="Počáteční investice" value={investedAmount} min={0} max={50000000} onChange={(v) => setInvestedAmount(Math.max(0, v))} suffix="Kč" />
          <NumberField id="monthly" label="Měsíční vklad" value={monthlyContribution} min={0} max={1000000} onChange={(v) => setMonthlyContribution(Math.max(0, v))} suffix="Kč" />
          <NumberField id="period" label="Doba investování" value={investmentPeriod} min={1} max={50} onChange={(v) => setInvestmentPeriod(Math.max(1, Math.min(50, v)))} suffix="let" />
          <NumberField id="return" label="Očekávaný výnos p.a." value={expectedReturn} step="0.1" min={0} max={30} onChange={(v) => setExpectedReturn(Math.max(0, Math.min(30, v)))} suffix="%" />
        </div>

        {/* Dva fondy – mobil pod sebou (grid-cols-1), desktop vedle sebe */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Levný ETF */}
          <div className="rounded-lg border border-teal-200 bg-teal-50/40 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-100 text-teal-700">
                <TrendingDown className="w-4 h-4" />
              </span>
              <h3 className="font-semibold text-slate-900">Levný ETF</h3>
            </div>
            <NumberField id="etf-ter" label="Roční poplatek (TER)" value={etfTER} step="0.01" min={0} max={5} onChange={(v) => setEtfTER(Math.max(0, Math.min(5, v)))} suffix="%" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                <p className="text-xs text-slate-500">Konečná hodnota</p>
                <p className="font-bold text-slate-900 tabular-nums">{fmtCZK(etfFinalValue)}</p>
              </div>
              <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                <p className="text-xs text-slate-500">Zaplacené poplatky</p>
                <p className="font-semibold text-slate-900 tabular-nums">{fmtCZK(etfTotalFees)}</p>
              </div>
            </div>
          </div>

          {/* Bankovní / podílový fond */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-200 text-slate-600">
                <Landmark className="w-4 h-4" />
              </span>
              <h3 className="font-semibold text-slate-900">Bankovní / podílový fond</h3>
            </div>
            <NumberField id="active-ter" label="Roční poplatek (TER)" value={activeTER} step="0.01" min={0} max={5} onChange={(v) => setActiveTER(Math.max(0, Math.min(5, v)))} suffix="%" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                <p className="text-xs text-slate-500">Konečná hodnota</p>
                <p className="font-bold text-slate-900 tabular-nums">{fmtCZK(activeFinalValue)}</p>
              </div>
              <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                <p className="text-xs text-slate-500">Zaplacené poplatky</p>
                <p className="font-semibold text-slate-900 tabular-nums">{fmtCZK(activeTotalFees)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kontrola parametrů (slate/amber, ne violet) */}
        {(warnSameOrHigher || warnReturn) && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-900/80">
                <p className="font-semibold text-amber-800">Zkontrolujte zadané hodnoty</p>
                <ul className="mt-1 space-y-0.5">
                  {warnSameOrHigher && <li>Levný ETF má stejný nebo vyšší poplatek než bankovní fond – tak to v praxi téměř nebývá.</li>}
                  {expectedReturn < 3 && <li>Velmi nízký očekávaný výnos (pod 3 % ročně).</li>}
                  {expectedReturn > 15 && <li>Velmi vysoký očekávaný výnos (nad 15 % ročně).</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Graf vývoje hodnoty portfolia */}
      {etfSeries.length > 1 && !warnSameOrHigher && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">Vývoj hodnoty portfolia v čase</p>
          <FeeChart etf={etfSeries} active={activeSeries} years={investmentPeriod} etfTER={etfTER} activeTER={activeTER} />
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Obě křivky mají stejný vklad i tržní výnos – rozevírají se jen kvůli rozdílnému poplatku. Tyrkysová plocha mezi nimi je to, co za {investmentPeriod} let zaplatíte navíc na poplatcích.
          </p>
        </div>
      )}

      {/* Výsledkový panel */}
      {warnSameOrHigher ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 md:p-6 text-center">
          <p className="text-sm text-amber-900/80">
            Při zadaných hodnotách vychází bankovní fond stejně nebo levněji než ETF. Upravte poplatky (TER) a uvidíte typický rozdíl.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 max-w-md mx-auto">
            <div className="rounded-lg bg-white border border-slate-200 px-4 py-3">
              <p className="text-xs text-slate-500">Rozdíl hodnoty portfolia</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{fmtCZK(Math.abs(valueDifference))}</p>
            </div>
            <div className="rounded-lg bg-white border border-slate-200 px-4 py-3">
              <p className="text-xs text-slate-500">Rozdíl na poplatcích</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{fmtCZK(Math.abs(feeDifference))}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-teal-700 text-white p-5 md:p-7">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-100">
            <Sparkles className="w-4 h-4" /> Výsledek za {investmentPeriod} let
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-sm text-teal-100">S levným ETF budete mít navíc</p>
              <p className="text-3xl md:text-4xl font-bold tabular-nums mt-1">{fmtCZK(valueDifference)}</p>
              <p className="text-xs text-teal-200 mt-1">oproti drahému bankovnímu fondu</p>
            </div>
            <div className="sm:border-l sm:border-white/15 sm:pl-5">
              <p className="text-sm text-teal-100">Na poplatcích ušetříte</p>
              <p className="text-3xl md:text-4xl font-bold tabular-nums mt-1">{fmtCZK(feeDifference)}</p>
              <p className="text-xs text-teal-200 mt-1">peníze, které zůstanou ve vašem portfoliu</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-teal-50 leading-relaxed border-t border-white/15 pt-4">
            Stejný vklad i stejný výnos trhu. Jediný rozdíl je roční poplatek (TER){' '}
            {etfTER.toLocaleString('cs-CZ')} % vs. {activeTER.toLocaleString('cs-CZ')} % – a přesto dělá za {investmentPeriod} let{' '}
            <strong className="font-semibold">{fmtCZK(valueDifference)}</strong>. To je síla složeného úročení poplatku.
          </p>
        </div>
      )}
    </div>
  );
}
