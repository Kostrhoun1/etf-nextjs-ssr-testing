'use client';

import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import InfoTip from '@/components/design-preview/InfoTip';
import { useCurrency, curLabel, type Currency } from '@/components/design-preview/currencyStore';

type Vals = { ytd: number | null; y1: number | null; y3: number | null; y5: number | null };
type ByCur = Record<Currency, Vals>;

/* Krátká období (1M/3M/6M) – data je mají jen v EUR (báze justETF), bez přepočtu do Kč/USD,
   proto je držíme mimo přepínač měny, v odděleném řádku se štítkem „v EUR“ (audit 17. 10. 2026:
   SXR8 1M „+5,1 % USD“, v USD přitom +2,1 %; revize 18. 10.: u zapnutých Kč splývaly s Kč). */
type ShortPeriods = { m1: number | null; m3: number | null; m6: number | null };

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

const barva = (v: number | null) => (v == null ? 'text-slate-400' : v >= 0 ? 'text-emerald-700' : 'text-red-600');

/* Výnosová sekce ETF detailu s přepínačem měny (default CZK): letos, 1R, 3R, 5R (u 3R/5R i p.a.).
   Vysvětlivky jen v tooltipech (revize 18. 10. 2026: odstavec pod kartami nikdo nečetl). */
export default function EtfReturns({
  byCur,
  fundCurrency,
  short,
}: {
  byCur: ByCur;
  fundCurrency: string | null;
  short?: ShortPeriods;
}) {
  const [cur] = useCurrency();
  const v = byCur[cur];
  const tiles = [
    { label: 'Letos', value: v.ytd, years: 0 },
    { label: '1 rok', value: v.y1, years: 1 },
    { label: '3 roky', value: v.y3, years: 3 },
    { label: '5 let', value: v.y5, years: 5 },
  ];
  const hasShort = short && (short.m1 != null || short.m3 != null || short.m6 != null);
  const tipMena = cur === 'CZK'
    ? `Přepočteno do korun kurzem ČNB – zahrnuje pohyb kurzu ${fundCurrency && fundCurrency !== 'CZK' ? `${fundCurrency}/CZK` : 'cizí měny vůči koruně'}. Po poplatcích fondu, bez daní a poplatků brokera.`
    : cur === 'USD' ? 'V dolarech – bez pohybu kurzu vůči koruně.' : 'V eurech – bez pohybu kurzu vůči koruně.';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          <InfoTip label={<>Kumulativní výnos za celé období. {tipMena} <strong>p.a.</strong> = průměrný roční výnos (geometrický průměr).</>}>Výnos v {curLabel[cur]}</InfoTip>
        </p>
        <CurrencyToggle size="sm" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-100 bg-slate-100">
        {tiles.map((t) => {
          const pa = t.years > 1 ? annualize(t.value, t.years) : null;
          return (
            <div key={t.label} className="bg-white p-3 md:p-4">
              <p className="text-xs text-slate-500">{t.label}</p>
              <p className={`mt-0.5 text-xl md:text-2xl font-bold tabular-nums ${barva(t.value)}`}>{pct(t.value)}</p>
              <p className="mt-0.5 h-4 text-xs tabular-nums text-slate-500">{pa != null ? `${pct(pa)} p.a.` : ''}</p>
            </div>
          );
        })}
      </div>

      {hasShort && (
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <InfoTip label="Výnosy za 1–6 měsíců máme jen v eurech, bez přepočtu do korun. S výnosy v Kč výše je proto nesčítejte.">Krátkodobě</InfoTip>
            <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-slate-600 ring-1 ring-slate-200">v EUR</span>
          </span>
          {[
            { label: '1M', value: short!.m1 },
            { label: '3M', value: short!.m3 },
            { label: '6M', value: short!.m6 },
          ].map((t) => (
            <span key={t.label} className="inline-flex items-baseline gap-1.5">
              <span className="text-xs text-slate-400">{t.label}</span>
              <span className={`tabular-nums font-semibold ${barva(t.value)}`}>{pct(t.value)}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
