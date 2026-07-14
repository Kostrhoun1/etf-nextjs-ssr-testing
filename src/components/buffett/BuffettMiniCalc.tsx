'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Lehká mini-kalkulačka do úvodu Buffettova článku.
 * ZÁMĚRNĚ není to celý backtest – jen dvě pole (jednorázový vklad + nepovinný
 * měsíční vklad) a živě přepočtený výsledek. Na plný nástroj vede jen odkaz.
 *
 * Výpočet je přesný: backtestovací engine je lineární v cashflow (rebalancing
 * násobí celé portfolio, nezávisle na částce). Server proto předpočítá dva
 * koeficienty a klient jen násobí – žádné volání API, okamžitá odezva.
 *   výsledek = jednorázový × lumpMultiple + měsíční × monthlyCoeff
 */
export default function BuffettMiniCalc({
  lumpMultiple,
  monthlyCoeff,
  contribMonths,
}: {
  lumpMultiple: number;
  monthlyCoeff: number;
  contribMonths: number;
}) {
  const [amount, setAmount] = useState(100000);
  const [monthly, setMonthly] = useState(0);

  const result = amount * lumpMultiple + monthly * monthlyCoeff;
  const invested = amount + monthly * contribMonths;

  const fmt = (v: number) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(Math.round(v));
  const parse = (s: string) => {
    const n = parseInt(s.replace(/\D/g, ''), 10);
    return Number.isFinite(n) ? Math.min(n, 1_000_000_000) : 0;
  };

  const backtestHref =
    `/backtest?portfolio=buffett-90-10&start=2002-07-01&amount=${amount}` +
    `&contrib=${monthly > 0 ? monthly : 'none'}&run=1`;

  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5 md:p-6">
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
        {/* Vstupy */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-slate-600">Jednorázový vklad</span>
            <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
              <input
                inputMode="numeric"
                value={amount === 0 ? '' : fmt(amount)}
                onChange={(e) => setAmount(parse(e.target.value))}
                placeholder="100 000"
                className="w-full bg-transparent px-3 py-2.5 text-right text-base font-semibold tabular-nums text-slate-900 outline-none"
                aria-label="Jednorázový vklad v korunách"
              />
              <span className="pr-3 text-sm text-slate-400">Kč</span>
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-slate-600">Měsíčně navíc <span className="text-slate-400">(nepovinné)</span></span>
            <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
              <input
                inputMode="numeric"
                value={monthly === 0 ? '' : fmt(monthly)}
                onChange={(e) => setMonthly(parse(e.target.value))}
                placeholder="0"
                className="w-full bg-transparent px-3 py-2.5 text-right text-base font-semibold tabular-nums text-slate-900 outline-none"
                aria-label="Měsíční vklad v korunách"
              />
              <span className="pr-3 text-sm text-slate-400">Kč</span>
            </div>
          </label>
        </div>

        {/* Výsledek */}
        <div className="text-center md:text-right md:pl-6 md:border-l md:border-teal-200 md:min-w-[180px]">
          <div className="text-xs font-medium text-slate-500">dnes by bylo</div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-teal-700 tabular-nums">{fmt(result)} Kč</div>
          <div className="mt-0.5 text-xs text-slate-500 tabular-nums">z vložených {fmt(invested)} Kč</div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500 leading-relaxed">
          Buffettovo 90/10 (90 % S&P 500 + 10 % krátké dluhopisy), 2002–dnes, v Kč, po poplatcích. Orientační přepočet.
        </p>
        <Link
          href={backtestHref}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-500 transition-colors"
        >
          Změnit portfolio a období v backtestu <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
