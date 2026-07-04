'use client';

import { useCurrency, pickReturn, curLabel, type Currency } from '@/components/design-preview/currencyStore';

const fmtPct = (v: number | null) => {
  if (v == null) return '—';
  const s = v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${v > 0 ? '+' : ''}${s} %`;
};

/* Jedna výnosová hodnota ve zvolené měně (default CZK), barevná dle znaménka.
   Lze vložit do serverových stránek – reaguje na globální přepínač měny. */
export default function ReturnValue({
  etf, period, colored = true, className = '',
}: {
  etf: Record<string, unknown> | null | undefined;
  period: string;
  colored?: boolean;
  className?: string;
}) {
  const [cur] = useCurrency();
  const v = pickReturn(etf, period, cur);
  const color = !colored ? '' : (v ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600';
  return <span className={`tabular-nums ${color} ${className}`}>{fmtPct(v)}</span>;
}

/* Popisek měny výnosů, reaktivní (např. do hlavičky sloupce „1R (Kč)"). */
export function ReturnCurLabel({ prefix = '' }: { prefix?: string }) {
  const [cur] = useCurrency() as [Currency, unknown];
  return <>{prefix}{curLabel[cur]}</>;
}
