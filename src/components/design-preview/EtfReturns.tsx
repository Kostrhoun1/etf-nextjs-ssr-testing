'use client';

import { Info } from 'lucide-react';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import { useCurrency, curLabel, type Currency } from '@/components/design-preview/currencyStore';

type Vals = { ytd: number | null; y1: number | null; y3: number | null; y5: number | null };
type ByCur = Record<Currency, Vals>;

const pct = (v: number | null) => {
  if (v == null) return '—';
  const s = v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${v > 0 ? '+' : ''}${s} %`;
};

function PerfBar({ value, max }: { value: number | null; max: number }) {
  const v = value ?? 0;
  const w = Math.min(100, (Math.abs(v) / max) * 100);
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full ${v >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${w}%` }} />
    </div>
  );
}

/* Výnosová sekce ETF detailu s přepínačem měny (default CZK). Ukazuje 1R/3R/5R
   ve zvolené měně + letošní (YTD); u ne-EUR měny doplní původní výnos fondu
   v EUR (bez měnového efektu) pro srovnání. */
export default function EtfReturns({ byCur, fundCurrency }: { byCur: ByCur; fundCurrency: string | null }) {
  const [cur] = useCurrency();
  const v = byCur[cur];
  const tiles = [
    { label: '1 rok', value: v.y1 },
    { label: '3 roky', value: v.y3 },
    { label: '5 let', value: v.y5 },
  ];
  const max = Math.max(...tiles.map((t) => Math.abs(t.value ?? 0)), 1);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Kumulativní výnos za celé období{cur === 'CZK' ? ', přepočtený do korun' : cur === 'USD' ? ' v dolarech' : ' v eurech (báze fondu)'}.</p>
        <CurrencyToggle />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tiles.map((t) => {
          const pos = (t.value ?? 0) >= 0;
          return (
            <div key={t.label} className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs text-slate-500">{t.label} ({curLabel[cur]})</p>
              <p className={`mt-1 text-2xl font-bold tabular-nums ${pos ? 'text-emerald-600' : 'text-red-600'}`}>{pct(t.value)}</p>
              <div className="mt-2.5"><PerfBar value={t.value} max={max} /></div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-slate-500 leading-relaxed flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
        Letošní výnos (od ledna): <span className="font-medium text-slate-700">{pct(v.ytd)}</span>.
        {cur === 'CZK'
          ? <> Výnosy jsou přepočtené kurzem ČNB do Kč a zohledňují pohyb kurzu {fundCurrency ? `${fundCurrency}/CZK` : 'cizí měny vůči koruně'}, který výnos českého investora zvyšuje i snižuje.</>
          : <> Bez zahrnutí pohybu kurzu vůči koruně – český investor navíc nese měnové riziko (přepněte na Kč pro reálný dopad).</>}
      </p>

      {cur !== 'EUR' && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500 mb-2">Pro srovnání: původní výnos fondu v eurech (bez měnového efektu)</p>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {[
              { label: '1 rok', value: byCur.EUR.y1 },
              { label: '3 roky', value: byCur.EUR.y3 },
              { label: '5 let', value: byCur.EUR.y5 },
            ].map((t) => (
              <div key={t.label} className="flex flex-col">
                <span className="text-xs text-slate-400">{t.label} (€)</span>
                <span className={`tabular-nums font-medium ${(t.value ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(t.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
