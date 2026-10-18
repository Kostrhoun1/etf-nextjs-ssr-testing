'use client';

import InfoTip from '@/components/design-preview/InfoTip';
import { useCurrency, curLabel, type Currency } from '@/components/design-preview/currencyStore';

type Vals = { y1: number | null; y3: number | null; y5: number | null };

const pct = (v: number | null) => {
  if (v == null) return '—';
  const s = v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${v > 0 ? '+' : ''}${s} %`;
};

/* Výnos 1R/3R/5R v úvodu detailu – JEDINÉ místo kumulativních výnosů na stránce (kolo 3). Měnu řídí
   jediný přepínač v sekci Výkonnost (sdílený stav); výchozí je Kč, server vykreslí Kč. */
export default function HeroVynosy({ byCur, datum }: { byCur: Record<Currency, Vals>; datum: React.ReactNode }) {
  const [cur] = useCurrency();
  const v = byCur[cur];
  const tip = cur === 'CZK'
    ? 'Kumulativní výnos fondu za celé období přepočtený do korun – zahrnuje pohyb kurzu. Po poplatcích fondu, bez daní a poplatků brokera.'
    : `Kumulativní výnos fondu v ${cur === 'USD' ? 'dolarech' : 'eurech'} – bez pohybu kurzu vůči koruně. Měnu přepnete v sekci Výkonnost.`;
  const tiles = [
    { label: '1 rok', v: v.y1 },
    { label: '3 roky', v: v.y3 },
    { label: '5 let', v: v.y5 },
  ];
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
        <InfoTip label={tip}>Výnos v {curLabel[cur]}</InfoTip>
        {datum}
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
        {tiles.map((t) => (
          <div key={t.label} className="bg-slate-900/80 px-2.5 py-2.5 sm:px-3 md:px-4 md:py-3">
            <p className="text-[11px] md:text-xs text-slate-400">{t.label}</p>
            <p className={`${t.v != null && Math.abs(t.v) >= 100 ? 'text-base' : 'text-lg'} sm:text-lg md:text-2xl font-bold tabular-nums whitespace-nowrap ${t.v == null ? 'text-slate-500' : t.v >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>{pct(t.v)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
