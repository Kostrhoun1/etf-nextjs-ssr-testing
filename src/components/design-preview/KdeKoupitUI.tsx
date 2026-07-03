import Link from 'next/link';
import { Check, X, ExternalLink, Star } from 'lucide-react';
import type { Broker } from '@/types/broker/index';

/* ---------- Pomocné formátovače jen pro stránku Kde koupit ---------- */
export const kkScoreColor = (score: number) => {
  if (score >= 90) return 'text-teal-700';
  if (score >= 80) return 'text-slate-800';
  return 'text-slate-600';
};

/* ---------- Skóre odznak (kruh s číslem) ---------- */
export function KkScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls =
    size === 'lg'
      ? 'w-14 h-14 text-xl'
      : size === 'sm'
      ? 'w-9 h-9 text-sm'
      : 'w-11 h-11 text-base';
  return (
    <span
      className={`${cls} flex items-center justify-center rounded-full bg-teal-50 border border-teal-200 font-bold tabular-nums text-teal-700 shrink-0`}
      title={`Naše skóre ${score} ze 100`}
    >
      {score}
    </span>
  );
}

/* ---------- Ano / Ne odznáček ---------- */
export function KkYesNo({ yes, labelYes = 'Ano', labelNo = 'Ne' }: { yes: boolean; labelYes?: string; labelNo?: string }) {
  return yes ? (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
      <Check className="w-3.5 h-3.5" /> {labelYes}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-400">
      <X className="w-3.5 h-3.5" /> {labelNo}
    </span>
  );
}

/* ---------- Daň 15 / 35 odznak s vysvětlením ---------- */
export function KkTaxBadge({ value }: { value: string }) {
  const low = /15/.test(value);
  const high = /35/.test(value);
  const cls = low
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : high
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-slate-50 text-slate-600 border-slate-200';
  return (
    <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums ${cls}`}>
      {value}
    </span>
  );
}

/* ---------- CTA tlačítko na brokera (affiliate) ---------- */
export function KkBrokerCta({ name, href = '/srovnani-brokeru', primary = false }: { name: string; href?: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={
        primary
          ? 'inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800 transition-colors'
          : 'inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors'
      }
    >
      K&nbsp;{name} <ExternalLink className="w-3.5 h-3.5" />
    </Link>
  );
}

/* ---------- Mobilní karta brokera (pod 768px místo tabulky) ---------- */
export function KkBrokerCard({ broker, rank, primary = false }: { broker: Broker; rank: number; primary?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 tabular-nums w-4 shrink-0">{rank}</span>
        <KkScoreBadge score={broker.rating} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900 truncate">{broker.name}</p>
          <p className="text-xs text-slate-500 truncate">{broker.regulation}</p>
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-xs text-slate-400">Poplatek za ETF</dt>
          <dd className="text-slate-700">{broker.etfFee}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Konverze měn</dt>
          <dd className="text-slate-700">{broker.fxFee}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Nabídka ETF</dt>
          <dd className="text-slate-700">{broker.etfCount}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Min. vklad</dt>
          <dd className="text-slate-700 tabular-nums">{broker.minDeposit}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Frakční nákup</dt>
          <dd><KkYesNo yes={broker.fractional} /></dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Česká podpora</dt>
          <dd><KkYesNo yes={broker.czSupport} /></dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Daň z CZ dividend</dt>
          <dd><KkTaxBadge value={broker.czDividends} /></dd>
        </div>
      </dl>
      <div className="mt-4">
        <KkBrokerCta name={broker.name} primary={primary} />
      </div>
    </div>
  );
}

/* ---------- Hvězdičkové „top“ skóre do hero metriky ---------- */
export function KkStarMetric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
      <p className="text-xs text-slate-400 flex items-center gap-1">
        <Star className="w-3 h-3" /> {label}
      </p>
      <p className="text-lg font-bold tabular-nums mt-0.5">{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
