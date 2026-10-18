'use client';

import { procenta, NBSP } from '@/lib/formatyCisel';
import InfoTip from '@/components/design-preview/InfoTip';
import { useCurrency, curLabel, type Currency } from '@/components/design-preview/currencyStore';

type Vals = { ytd: number | null; y1: number | null; y3: number | null; y5: number | null };
type ByCur = Record<Currency, Vals>;

/* Krátká období (1M/3M/6M) jsou v EUR a tak jsou i popsaná (ZAMERNA-ROZHODNUTI.md) – mimo přepínač
   měny, v odděleném řádku se štítkem „v EUR“ (audit 17. 10. 2026: SXR8 1M „+5,1 % USD“, v USD +2,1 %). */
type ShortPeriods = { m1: number | null; m3: number | null; m6: number | null };

// Jednotný formát (kolo 5): „−15,9 %“ s minusem a nezlomitelnou mezerou – src/lib/formatyCisel.ts.
const pct = (v: number | null) => procenta(v);

/** Průměrný roční (p.a.) výnos z KUMULATIVNÍHO výnosu: (1+kum)^(1/roky)−1. */
export const annualize = (cumPct: number | null, years: number): number | null => {
  if (cumPct == null) return null;
  const g = 1 + cumPct / 100;
  if (g <= 0) return null; // ztráta ≥ 100 %: p.a. nedává rozumný smysl
  return (Math.pow(g, 1 / years) - 1) * 100;
};

const barva = (v: number | null) => (v == null ? 'text-slate-400' : v >= 0 ? 'text-emerald-700' : 'text-red-600');

/* Doplňkové výnosy na detailu fondu (kolo 3, 18. 10. 2026): JEN to, co úvodní blok nemá – letos,
   průměr p.a. za 3 a 5 let a krátká období v EUR. Kumulativní 1R/3R/5R jsou v úvodu (dřív 2× na
   první obrazovce). Přepínač měny je jeden – v hlavičce sekce Výkonnost. */
export default function EtfReturns({
  byCur,
  fundCurrency,
  short,
  children,
}: {
  byCur: ByCur;
  fundCurrency: string | null;
  short?: ShortPeriods;
  /** Odkazy pod čísly (backtest, stroj času). */
  children?: React.ReactNode;
}) {
  const [cur] = useCurrency();
  const v = byCur[cur];
  const tiles = [
    { label: 'Letos', sub: 'od 1. ledna', value: v.ytd },
    { label: '3 roky', sub: 'průměrně ročně', value: annualize(v.y3, 3) },
    { label: '5 let', sub: 'průměrně ročně', value: annualize(v.y5, 5) },
  ];
  const hasShort = short && (short.m1 != null || short.m3 != null || short.m6 != null);
  const tipMena = cur === 'CZK'
    ? `Přepočteno do korun – zahrnuje pohyb kurzu ${fundCurrency && fundCurrency !== 'CZK' ? `${fundCurrency}/CZK` : 'cizí měny vůči koruně'}. Po poplatcích fondu, bez daní a poplatků brokera.`
    : cur === 'USD' ? 'V dolarech – bez pohybu kurzu vůči koruně.' : 'V eurech – bez pohybu kurzu vůči koruně.';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
      <p className="text-sm font-semibold text-slate-900">
        <InfoTip label={<>{tipMena} <strong>Průměrně ročně (p.a.)</strong> = geometrický průměr z výnosu za celé období: (1 + výnos)^(1/roky) − 1.</>}>Výnos v {curLabel[cur]}</InfoTip>
      </p>

      <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-slate-100 bg-slate-100">
        {tiles.map((t) => (
          <div key={t.label} className="bg-white p-3">
            <p className="text-xs font-medium text-slate-700">{t.label}</p>
            <p className={`mt-0.5 text-lg md:text-xl font-bold tabular-nums whitespace-nowrap ${barva(t.value)}`}>{pct(t.value)}</p>
            <p className="text-[11px] text-slate-400 leading-tight">{t.sub}</p>
          </div>
        ))}
      </div>

      {/* 10 000 Kč před 1/3/5 lety → dnes: vlastní čísla fondu (return_*_czk), ne index. Jen v Kč –
          výnos v EUR/USD na korunovou částku použít nejde. */}
      {cur === 'CZK' && [v.y1, v.y3, v.y5].some((x) => x != null) && (
        <div className="mt-3">
          <p className="text-xs text-slate-500">
            <InfoTip label="Kolik by dnes měla hodnotu jednorázová investice 10 000 Kč do tohoto fondu – spočteno z výnosu fondu v Kč za dané období (po poplatcích fondu, bez daní a poplatků brokera).">Kolik je dnes 10 000 Kč vložených…</InfoTip>
          </p>
          <div className="mt-1 grid grid-cols-3 text-sm">
            {([['před rokem', v.y1], ['před 3 lety', v.y3], ['před 5 lety', v.y5]] as const).map(([k, x]) => (
              <span key={k} className="min-w-0">
                <span className="block text-[11px] text-slate-400">{k}</span>
                <span className="font-semibold tabular-nums text-slate-900 whitespace-nowrap">{x == null ? '—' : `${Math.round(10000 * (1 + x / 100)).toLocaleString('cs-CZ')}${NBSP}Kč`}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {hasShort && (
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5">
          <p className="text-xs text-slate-500">
            <InfoTip label="Výnosy za 1–6 měsíců máme jen v eurech, bez přepočtu do korun. S výnosy v Kč je proto nesčítejte.">Krátkodobě, v EUR</InfoTip>
          </p>
          <div className="mt-1 grid grid-cols-3 text-sm">
            {[
              { label: '1 měsíc', value: short!.m1 },
              { label: '3 měsíce', value: short!.m3 },
              { label: '6 měsíců', value: short!.m6 },
            ].map((t) => (
              <span key={t.label} className="min-w-0">
                <span className="block text-[11px] text-slate-400">{t.label}</span>
                <span className={`tabular-nums font-semibold ${barva(t.value)}`}>{pct(t.value)}</span>
              </span>
            ))}
          </div>
        </div>
      )}
      {children && <div className="mt-4 flex flex-col gap-1.5 text-sm">{children}</div>}
    </div>
  );
}
