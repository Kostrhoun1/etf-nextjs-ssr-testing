'use client';

import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import { useCurrency, curLabel, type Currency } from '@/components/design-preview/currencyStore';

type YearVals = Record<Currency, number | null>;
/** Jeden sloupec grafu: kalendářní rok, nebo letošní (YTD) rok. */
export type CalCol = { year: number; vals: YearVals; ytd?: boolean };

const pct = (v: number | null) => {
  if (v == null) return '—';
  const s = v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${v > 0 ? '+' : ''}${s} %`;
};

/* Roční (kalendářní) výnosy fondu + letošní rok (YTD), reaktivní na přepínač měny.
   Data jsou přepočtená do zvolené měny (return_<rok>_czk/_usd), letošní sloupec
   používá return_ytd_* a je viditelně odlišený štítkem „letos / YTD". */
export default function EtfCalendarReturns({ cols }: { cols: CalCol[] }) {
  const [cur] = useCurrency();
  const data = cols.map((c) => ({ ...c, v: c.vals[cur] })).filter((c) => c.v != null);
  if (data.length === 0) return null;
  const max = Math.max(...data.map((c) => Math.abs(c.v ?? 0)), 1);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Roční výkonnost {cur === 'CZK' ? 'přepočtená do korun (kurz ČNB)' : cur === 'USD' ? 'v dolarech' : 'v eurech (báze fondu)'}. Poslední sloupec je letošní rok zatím (YTD).
        </p>
        <CurrencyToggle />
      </div>

      <div className="grid gap-2 sm:gap-4" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((c) => {
          const pos = (c.v ?? 0) >= 0;
          const h = Math.round((Math.abs(c.v ?? 0) / max) * 64) + 4;
          return (
            <div key={c.year} className="flex flex-col items-center">
              <span className={`text-xs sm:text-sm font-bold tabular-nums ${pos ? 'text-emerald-600' : 'text-red-600'}`}>{pct(c.v)}</span>
              <div className="mt-2 flex items-end" style={{ height: 68 }}>
                <div
                  className={`w-7 sm:w-9 rounded-t ${c.ytd ? (pos ? 'bg-emerald-400' : 'bg-red-400') : pos ? 'bg-emerald-500' : 'bg-red-500'} ${c.ytd ? 'ring-2 ring-teal-500/40' : ''}`}
                  style={{ height: `${h}px` }}
                />
              </div>
              <span className="mt-1 text-xs text-slate-400 tabular-nums">{c.year}</span>
              {c.ytd && <span className="mt-0.5 rounded-full bg-teal-50 px-1.5 py-0.5 text-[10px] font-medium text-teal-700 leading-none">letos (YTD)</span>}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Zobrazeno v {curLabel[cur]}. Letošní rok ({data[data.length - 1].ytd ? data[data.length - 1].year : new Date().getFullYear()}) není celý – jde o výnos od ledna do dneška.
      </p>
    </div>
  );
}
