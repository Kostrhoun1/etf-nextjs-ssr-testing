'use client';

import { useState } from 'react';
import { procenta } from '@/lib/formatyCisel';
import InfoTip from '@/components/design-preview/InfoTip';
import { useCurrency, curLabel, type Currency } from '@/components/design-preview/currencyStore';

type YearVals = Record<Currency, number | null>;
/** Jeden sloupec grafu: kalendářní rok, nebo letošní (YTD) rok. */
export type CalCol = { year: number; vals: YearVals; ytd?: boolean };

// Jednotný formát (kolo 5): „−15,9 %“ s minusem a nezlomitelnou mezerou – src/lib/formatyCisel.ts.
const pct = (v: number | null) => procenta(v);

/* Roční (kalendářní) výnosy fondu + letošní rok (YTD), reaktivní na přepínač měny.
   Data jsou přepočtená do zvolené měny (return_<rok>_czk/_usd), letošní sloupec
   používá return_ytd_* a je viditelně odlišený. Sloupce stojí na nulové ose – záporné
   roky jdou dolů (dřív rostly nahoru jen v jiné barvě, 18. 10. 2026).
   Kolo 3 (18. 10. 2026): bez vlastního rámu a přepínače měny – sedí v kartě grafu sekce Výkonnost
   (GrafVykonnosti.tsx), přepínač měny je na stránce jen jeden (v hlavičce sekce). */
export default function EtfCalendarReturns({ cols }: { cols: CalCol[] }) {
  const [cur] = useCurrency();
  const [aktivni, setAktivni] = useState<number | null>(null);
  const data = cols.map((c) => ({ ...c, v: c.vals[cur] })).filter((c) => c.v != null);
  if (data.length === 0) return null;
  const maxKl = Math.max(0, ...data.map((c) => c.v!));
  const maxZap = Math.max(0, ...data.map((c) => -c.v!));
  const rozsah = maxKl + maxZap || 1;
  const VYSKA = 168;
  const hKl = (maxKl / rozsah) * VYSKA;
  const hZap = (maxZap / rozsah) * VYSKA;

  return (
    <div>
      <div className="grid gap-1.5 sm:gap-4" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((c, i) => {
          const pos = c.v! >= 0;
          const h = Math.max(2, (Math.abs(c.v!) / rozsah) * VYSKA);
          const barva = pos ? (c.ytd ? 'bg-emerald-400' : 'bg-emerald-600') : (c.ytd ? 'bg-red-400' : 'bg-red-600');
          return (
            <button key={c.year} type="button" onMouseEnter={() => setAktivni(i)} onMouseLeave={() => setAktivni(null)} onFocus={() => setAktivni(i)} onBlur={() => setAktivni(null)}
              aria-label={`${c.ytd ? `Letos (${c.year})` : c.year}: ${pct(c.v)} v ${curLabel[cur]}`}
              className={`flex flex-col items-center rounded-md py-1 transition-colors ${aktivni === i ? 'bg-slate-50' : ''}`}>
              {/* kladná část */}
              <div className="flex w-full flex-col items-center justify-end" style={{ height: hKl + 20 }}>
                {pos && <span className="mb-1 text-[11px] sm:text-sm font-semibold tabular-nums text-slate-800 whitespace-nowrap">{pct(c.v)}</span>}
                {pos && <div className={`w-full max-w-[44px] rounded-t ${barva}`} style={{ height: h }} />}
              </div>
              {/* nulová osa */}
              <div className="h-px w-full bg-slate-300" />
              {/* záporná část */}
              <div className="flex w-full flex-col items-center justify-start" style={{ height: hZap + (maxZap > 0 ? 20 : 0) }}>
                {!pos && <div className={`w-full max-w-[44px] rounded-b ${barva}`} style={{ height: h }} />}
                {!pos && <span className="mt-1 text-[11px] sm:text-sm font-semibold tabular-nums text-slate-800 whitespace-nowrap">{pct(c.v)}</span>}
              </div>
              <span className="mt-1.5 text-xs text-slate-500 tabular-nums">{c.ytd ? 'letos' : c.year}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-slate-400 leading-relaxed">
        <InfoTip label={`Výnos fondu za každý kalendářní rok ${cur === 'CZK' ? 'přepočtený do korun – zahrnuje pohyb kurzu' : cur === 'USD' ? 'v dolarech' : 'v eurech'}. Skutečná data fondu, ne indexu.`}>Výnos fondu v {curLabel[cur]}</InfoTip>
        {' · '}{data[data.length - 1].ytd ? `letos = od 1. 1. ${data[data.length - 1].year}` : 'kalendářní roky'}
      </p>
    </div>
  );
}
