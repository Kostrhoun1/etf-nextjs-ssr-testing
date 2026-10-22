'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TrendingDown, Landmark, AlertTriangle, Sparkles } from 'lucide-react';
import { CisloPole, VysledekChybi } from '@/components/CisloInput';

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

/* Modelové výsledky (stálý výnos, desítky let) zaokrouhlujeme na tisíce – „4 416 696 Kč“ budilo
   dojem přesnosti, kterou model nemá (revize AD 22. 10. 2026). */
const fmtTis = (amount: number) => fmtCZK(Math.round(amount / 1000) * 1000);

const fmtCompact = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace('.', ',')}\u00a0mil.`;
  if (v >= 1_000) return `${Math.round(v / 1000)}\u00a0tis.`;
  return `${Math.round(v)}`;
};

/** Interaktivní SVG graf vývoje hodnoty portfolia (bez knihovny). Najetí myší ukáže hodnoty v daném roce.
 *  Šířka SVG = skutečná šířka kontejneru (ResizeObserver), takže písmo má na mobilu opravdu 11–12 px
 *  (dřív viewBox 640 px zmenšený na ~340 px → popisky ~5 px). Vlevo osa Y se třemi úrovněmi. */
function FeeChart({ etf, active, years, etfTER, activeTER }: { etf: number[]; active: number[]; years: number; etfTER: number; activeTER: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(640);
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  if (etf.length < 2 || active.length < 2) return null;
  const H = W < 480 ? 220 : 260, padL = 64, padR = 12, padT = 22, padB = 24;
  const iW = W - padL - padR, iH = H - padT - padB;
  const maxV = Math.max(...etf, ...active, 1);
  const n = etf.length;
  const X = (i: number) => padL + (i / (n - 1)) * iW;
  const Y = (v: number) => padT + iH - (v / maxV) * iH;
  const ptsEtf = etf.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
  const ptsAct = active.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
  const area = etf.map((v, i) => `${X(i)},${Y(v)}`).join(' ') + ' ' + active.map((_, i) => `${X(n - 1 - i)},${Y(active[n - 1 - i])}`).join(' ');
  const yearTicks = Array.from(new Set([0, Math.round(years / 2), years]));
  const yTicks = [0, maxV / 2, maxV];
  const NB = ' ';

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left - padL) / Math.max(1, rect.width - padL - padR);
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
      <div ref={boxRef} className="relative" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block max-w-full" role="img" aria-label="Graf vývoje hodnoty portfolia levného ETF vs drahého fondu v čase">
          {/* osa Y: tři úrovně s popisky */}
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={padL} x2={W - padR} y1={Y(t)} y2={Y(t)} stroke="#e2e8f0" strokeDasharray={t === 0 ? undefined : '3 3'} />
              <text x={padL - 6} y={Y(t) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{fmtCompact(t)}{NB}Kč</text>
            </g>
          ))}
          <polygon points={area} fill="#5eead4" opacity="0.35" />
          <polyline points={ptsAct} fill="none" stroke="#94a3b8" strokeWidth="2" />
          <polyline points={ptsEtf} fill="none" stroke="#0d9488" strokeWidth="2.5" />
          {/* koncové hodnoty – vždy viditelné */}
          <circle cx={X(n - 1)} cy={Y(etf[n - 1])} r="3.5" fill="#0d9488" />
          <circle cx={X(n - 1)} cy={Y(active[n - 1])} r="3.5" fill="#94a3b8" />
          <text x={X(n - 1) - 6} y={Y(etf[n - 1]) - 7} textAnchor="end" fontSize="12" fontWeight="600" fill="#0d9488">{fmtCompact(etf[n - 1])}{NB}Kč</text>
          <text x={X(n - 1) - 6} y={Y(active[n - 1]) + 14} textAnchor="end" fontSize="12" fill="#64748b">{fmtCompact(active[n - 1])}{NB}Kč</text>
          {yearTicks.map((t) => (
            <text key={t} x={Math.min(Math.max(X(t), padL + 14), W - padR - 14)} y={H - 6} textAnchor="middle" fontSize="11" fill="#94a3b8">{t}{NB}let</text>
          ))}
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
            <div className="font-semibold mb-1">Po {hi} {hi === 1 ? 'roce' : 'letech'}</div>
            <div className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-teal-400" /> Levný ETF: <span className="font-medium tabular-nums">{fmtTis(etf[hi])}</span></div>
            <div className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-slate-400" /> Drahý fond: <span className="font-medium tabular-nums">{fmtTis(active[hi])}</span></div>
            <div className="mt-1 pt-1 border-t border-white/15 text-teal-300">Rozdíl: <span className="font-semibold tabular-nums">{fmtTis(etf[hi] - active[hi])}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeeCalculatorWidget() {
  // Společné parametry investice
  // null = prázdné / nedopsané pole → výsledek „—“ (žádná tichá 0).
  const [investedAmountV, setInvestedAmount] = useState<number | null>(250000);
  const [monthlyContributionV, setMonthlyContribution] = useState<number | null>(12500);
  const [investmentPeriodV, setInvestmentPeriod] = useState<number | null>(30);
  const [expectedReturnV, setExpectedReturn] = useState<number | null>(7);

  // TER pro oba typy fondů
  const [etfTERV, setEtfTER] = useState<number | null>(0.2);
  const [activeTERV, setActiveTER] = useState<number | null>(1.8);
  const vstupyOk = [investedAmountV, monthlyContributionV, investmentPeriodV, expectedReturnV, etfTERV, activeTERV].every((v) => v != null);
  const investedAmount = investedAmountV ?? 0, monthlyContribution = monthlyContributionV ?? 0,
    investmentPeriod = investmentPeriodV ?? 0, expectedReturn = expectedReturnV ?? 0,
    etfTER = etfTERV ?? 0, activeTER = activeTERV ?? 0;

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

    // TER se strhává z hodnoty fondu → čistý výnos = (1 + r)(1 − TER) − 1. Dřív „r − TER“, což
    // dopad poplatku mírně podceňovalo (výchozí příklad o ~5 %; audit výpočtů 17. 10. 2026).
    const annualETFReturn = Math.max(-0.99, (1 + annualReturn) * (1 - etfTER / 100) - 1);
    const annualActiveReturn = Math.max(-0.99, (1 + annualReturn) * (1 - activeTER / 100) - 1);

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
  const K = (v: number) => (vstupyOk ? fmtTis(v) : '—');
  // ===== KONEC převzaté logiky =====

  const warnSameOrHigher = vstupyOk && etfTER >= activeTER;
  const warnReturn = vstupyOk && (expectedReturn < 3 || expectedReturn > 15);

  return (
    <div className="space-y-4">
      {/* Vstupní parametry */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">
          Parametry srovnání
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CisloPole id="initial" label="Počáteční investice" value={investedAmountV} min={0} max={50000000} step="10000" onChange={setInvestedAmount} suffix="Kč" />
          <CisloPole id="monthly" label="Měsíční vklad" value={monthlyContributionV} min={0} max={1000000} step="500" onChange={setMonthlyContribution} suffix="Kč" />
          <CisloPole id="period" label="Doba investování" value={investmentPeriodV} min={1} max={50} tisice={false} onChange={setInvestmentPeriod} suffix="let" />
          <CisloPole id="return" label="Očekávaný výnos p.a." value={expectedReturnV} step="0.1" min={0} max={20} onChange={setExpectedReturn} suffix="%" />
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
            <CisloPole id="etf-ter" label="Roční poplatek (TER)" value={etfTERV} step="0.01" min={0} max={5} onChange={setEtfTER} suffix="%" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                <p className="text-xs text-slate-500">Konečná hodnota</p>
                <p className="font-bold text-slate-900 tabular-nums">{K(etfFinalValue)}</p>
              </div>
              <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                <p className="text-xs text-slate-500">Zaplacené poplatky</p>
                <p className="font-semibold text-slate-900 tabular-nums">{K(etfTotalFees)}</p>
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
            <CisloPole id="active-ter" label="Roční poplatek (TER)" value={activeTERV} step="0.01" min={0} max={5} onChange={setActiveTER} suffix="%" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                <p className="text-xs text-slate-500">Konečná hodnota</p>
                <p className="font-bold text-slate-900 tabular-nums">{K(activeFinalValue)}</p>
              </div>
              <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                <p className="text-xs text-slate-500">Zaplacené poplatky</p>
                <p className="font-semibold text-slate-900 tabular-nums">{K(activeTotalFees)}</p>
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
      {vstupyOk && etfSeries.length > 1 && !warnSameOrHigher && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">Vývoj hodnoty portfolia v čase</p>
          <FeeChart etf={etfSeries} active={activeSeries} years={investmentPeriod} etfTER={etfTER} activeTER={activeTER} />
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Obě křivky mají stejný vklad i tržní výnos – rozevírají se jen kvůli rozdílnému poplatku. Tyrkysová plocha mezi nimi je to, o co budete mít za {investmentPeriod} let méně – zaplacené poplatky i zhodnocení, o které vás připravily.
          </p>
        </div>
      )}

      {/* Výsledkový panel */}
      {!vstupyOk ? (
        <VysledekChybi />
      ) : warnSameOrHigher ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 md:p-6 text-center">
          <p className="text-sm text-amber-900/80">
            Při zadaných hodnotách vychází bankovní fond stejně nebo levněji než ETF. Upravte poplatky (TER) a uvidíte typický rozdíl.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 max-w-md mx-auto">
            <div className="rounded-lg bg-white border border-slate-200 px-4 py-3">
              <p className="text-xs text-slate-500">Rozdíl hodnoty portfolia</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{fmtTis(Math.abs(valueDifference))}</p>
            </div>
            <div className="rounded-lg bg-white border border-slate-200 px-4 py-3">
              <p className="text-xs text-slate-500">Rozdíl na poplatcích</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{fmtTis(Math.abs(feeDifference))}</p>
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
              <p className="text-3xl md:text-4xl font-bold tabular-nums mt-1" data-qa="poplatky-rozdil">{fmtTis(valueDifference)}</p>
              <p className="text-xs text-teal-200 mt-1">oproti drahému bankovnímu fondu</p>
            </div>
            <div className="sm:border-l sm:border-white/15 sm:pl-5">
              <p className="text-sm text-teal-100">Na poplatcích ušetříte</p>
              <p className="text-3xl md:text-4xl font-bold tabular-nums mt-1">{fmtTis(feeDifference)}</p>
              <p className="text-xs text-teal-200 mt-1">peníze, které zůstanou ve vašem portfoliu</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-teal-50 leading-relaxed border-t border-white/15 pt-4">
            Stejný vklad i stejný výnos trhu. Jediný rozdíl je roční poplatek (TER){' '}
            {etfTER.toLocaleString('cs-CZ')} % vs. {activeTER.toLocaleString('cs-CZ')} % – a přesto dělá za {investmentPeriod} let{' '}
            <strong className="font-semibold">{fmtTis(valueDifference)}</strong>. To je síla složeného úročení poplatku.
          </p>
        </div>
      )}
    </div>
  );
}
