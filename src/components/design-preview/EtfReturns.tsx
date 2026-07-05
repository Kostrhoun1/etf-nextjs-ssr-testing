'use client';

import { Info } from 'lucide-react';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import { useCurrency, curLabel, type Currency } from '@/components/design-preview/currencyStore';

type Vals = { ytd: number | null; y1: number | null; y3: number | null; y5: number | null };
type ByCur = Record<Currency, Vals>;

/* Krátká období (1M/3M/6M) – v měně fondu (u kratších období není měnový přepočet
   v datech spolehlivý), proto je držíme mimo přepínač měny a jasně to označíme. */
type ShortPeriods = { m1: number | null; m3: number | null; m6: number | null };
type Vol = { v3: number | null; v5: number | null };

const pct = (v: number | null) => {
  if (v == null) return '—';
  const s = v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${v > 0 ? '+' : ''}${s} %`;
};

/** Průměrný roční (p.a.) výnos z KUMULATIVNÍHO výnosu: (1+kum)^(1/roky)−1. */
const annualize = (cumPct: number | null, years: number): number | null => {
  if (cumPct == null) return null;
  const g = 1 + cumPct / 100;
  if (g <= 0) return null; // ztráta ≥ 100 %: p.a. nedává rozumný smysl
  return (Math.pow(g, 1 / years) - 1) * 100;
};

/** p.a. hezky do textu: „≈ 18,9 % p.a." */
const paLabel = (cumPct: number | null, years: number): string | null => {
  const pa = annualize(cumPct, years);
  if (pa == null) return null;
  const s = pa.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `≈ ${pa > 0 ? '+' : ''}${s} % p.a.`;
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
   ve zvolené měně (u 3R/5R i průměrný roční p.a. výnos) + letošní (YTD); u ne-EUR
   měny doplní původní výnos fondu v EUR (bez měnového efektu) pro srovnání.
   Volitelně krátká období (1M/3M/6M) a kolísavost 3R/5R. */
export default function EtfReturns({
  byCur,
  fundCurrency,
  short,
  vol,
}: {
  byCur: ByCur;
  fundCurrency: string | null;
  short?: ShortPeriods;
  vol?: Vol;
}) {
  const [cur] = useCurrency();
  const v = byCur[cur];
  const tiles = [
    { label: '1 rok', value: v.y1, years: 1 },
    { label: '3 roky', value: v.y3, years: 3 },
    { label: '5 let', value: v.y5, years: 5 },
  ];
  const max = Math.max(...tiles.map((t) => Math.abs(t.value ?? 0)), 1);

  const hasShort = short && (short.m1 != null || short.m3 != null || short.m6 != null);
  const hasVol = vol && (vol.v3 != null || vol.v5 != null);
  const baseSym = fundCurrency || 'měna fondu';

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Kumulativní výnos za celé období{cur === 'CZK' ? ', přepočtený do korun' : cur === 'USD' ? ' v dolarech' : ' v eurech (báze fondu)'}. U 3 a 5 let ukazujeme i průměrný roční výnos (p.a.).</p>
        <CurrencyToggle />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tiles.map((t) => {
          const pos = (t.value ?? 0) >= 0;
          const pa = t.years > 1 && t.value != null ? paLabel(t.value, t.years) : null;
          return (
            <div key={t.label} className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs text-slate-500">{t.label} ({curLabel[cur]})</p>
              <p className={`mt-1 text-2xl font-bold tabular-nums ${pos ? 'text-emerald-600' : 'text-red-600'}`}>{pct(t.value)}</p>
              {t.years > 1 && (
                <p className="mt-0.5 text-xs font-medium tabular-nums text-slate-500">
                  {pa ? <>{pa} <span className="font-normal text-slate-400">(průměrně ročně)</span></> : <span className="text-slate-300">—</span>}
                </p>
              )}
              <div className="mt-2.5"><PerfBar value={t.value} max={max} /></div>
            </div>
          );
        })}
      </div>

      {/* Krátká období – v měně fondu (bez měnového přepočtu) */}
      {hasShort && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500 mb-2">Krátkodobý vývoj ({baseSym}, v měně fondu)</p>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {[
              { label: '1 měsíc', value: short!.m1 },
              { label: '3 měsíce', value: short!.m3 },
              { label: '6 měsíců', value: short!.m6 },
            ].map((t) => (
              <div key={t.label} className="flex flex-col">
                <span className="text-xs text-slate-400">{t.label}</span>
                <span className={`tabular-nums font-medium ${(t.value ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(t.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500 leading-relaxed flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
        <span>
          Letošní výnos (od ledna): <span className="font-medium text-slate-700">{pct(v.ytd)}</span>.
          {' '}Průměrný roční výnos (p.a.) přepočítáváme z kumulativního jako geometrický průměr – u 3letého výnosu {pct(v.y3)} to znamená {paLabel(v.y3, 3) ?? '—'}.
          {cur === 'CZK'
            ? <> Výnosy jsou přepočtené kurzem ČNB do Kč a zohledňují pohyb kurzu {fundCurrency ? `${fundCurrency}/CZK` : 'cizí měny vůči koruně'}, který výnos českého investora zvyšuje i snižuje.</>
            : <> Bez zahrnutí pohybu kurzu vůči koruně – český investor navíc nese měnové riziko (přepněte na Kč pro reálný dopad).</>}
          {hasVol && (
            <>
              {' '}Kolísavost (roční):{' '}
              {vol!.v3 != null && <>3R <span className="font-medium text-slate-700">{vol!.v3.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %</span></>}
              {vol!.v3 != null && vol!.v5 != null && <> · </>}
              {vol!.v5 != null && <>5R <span className="font-medium text-slate-700">{vol!.v5.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %</span></>}
              {' '}– vyšší číslo znamená větší výkyvy.
            </>
          )}
        </span>
      </p>

      {cur !== 'EUR' && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500 mb-2">Pro srovnání: původní výnos fondu v eurech (bez měnového efektu)</p>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {[
              { label: '1 rok', value: byCur.EUR.y1, years: 1 },
              { label: '3 roky', value: byCur.EUR.y3, years: 3 },
              { label: '5 let', value: byCur.EUR.y5, years: 5 },
            ].map((t) => {
              const pa = t.years > 1 && t.value != null ? paLabel(t.value, t.years) : null;
              return (
                <div key={t.label} className="flex flex-col">
                  <span className="text-xs text-slate-400">{t.label} (€)</span>
                  <span className={`tabular-nums font-medium ${(t.value ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(t.value)}</span>
                  {pa && <span className="text-[11px] tabular-nums text-slate-400">{pa}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
