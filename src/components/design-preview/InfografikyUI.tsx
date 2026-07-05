import Link from 'next/link';
import type { ETFBasicInfo } from '@/lib/etf-data';
import { ArrowRight, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { pct, shortName } from '@/components/design-preview/CategoryUI';

/* ============================================================
   Komponenty pro rozcestník /design-preview/infografiky
   Prefix "Infografiky" → bez konfliktů s ostatními stránkami.
   Vše staví na REÁLNÝCH datech z @/lib/etf-data.
   ============================================================ */

/** Jedna dlaždice tržní heatmapy – barva dle reálné výkonnosti za 1 rok. */
export type InfografikyHeatTile = {
  label: string;
  value: number | null;
  href: string;
};

/** Barevné pozadí dlaždice podle výkonnosti (zelená = růst, červená = pokles). */
function heatClasses(v: number | null): string {
  if (v == null) return 'bg-slate-50 text-slate-500 border-slate-200';
  if (v >= 20) return 'bg-emerald-600 text-white border-emerald-600';
  if (v >= 8) return 'bg-emerald-500 text-white border-emerald-500';
  if (v >= 0) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (v >= -8) return 'bg-red-100 text-red-800 border-red-200';
  return 'bg-red-500 text-white border-red-500';
}

/* ---------- Mini-náhled: výkonnostní pruh top 3 (pro kartu) ---------- */
export function InfografikyMiniPerf({ etfs }: { etfs: ETFBasicInfo[] }) {
  const rows = etfs.slice(0, 3);
  const max = Math.max(1, ...rows.map((e) => Math.abs(e.return_1y_czk ?? e.return_1y ?? 0)));
  return (
    <ul className="space-y-2">
      {rows.map((etf) => {
        const v = etf.return_1y_czk ?? etf.return_1y ?? 0;
        const pos = v >= 0;
        const w = Math.min((Math.abs(v) / max) * 100, 100);
        return (
          <li key={etf.isin} className="flex items-center gap-2">
            <span className="flex-1 min-w-0 text-xs font-medium text-slate-700 truncate">
              {shortName(etf.name)}
            </span>
            <span className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden shrink-0">
              <span
                className={`block h-full rounded-full ${pos ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${w}%` }}
              />
            </span>
            <span
              className={`tabular-nums text-xs font-semibold w-14 text-right shrink-0 ${pos ? 'text-emerald-600' : 'text-red-600'}`}
            >
              {pct(v)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Mini-náhled: TER top 3 (pro kartu nejlevnějších) ---------- */
export function InfografikyMiniTer({ etfs }: { etfs: ETFBasicInfo[] }) {
  const rows = etfs.slice(0, 3);
  return (
    <ul className="space-y-2">
      {rows.map((etf) => (
        <li key={etf.isin} className="flex items-center gap-2">
          <span className="flex-1 min-w-0 text-xs font-medium text-slate-700 truncate">
            {shortName(etf.name)}
          </span>
          <span className="tabular-nums text-xs font-semibold text-slate-900 shrink-0">
            {etf.ter_numeric == null ? '—' : `${etf.ter_numeric.toFixed(2).replace('.', ',')} %`}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Mini-náhled: heatmapa dlaždic (pro kartu heatmapy) ---------- */
export function InfografikyMiniHeat({ tiles }: { tiles: InfografikyHeatTile[] }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {tiles.slice(0, 4).map((t) => (
        <div
          key={t.label}
          className={`rounded-md border px-2 py-1.5 ${heatClasses(t.value)}`}
        >
          <span className="block text-[11px] font-medium leading-tight truncate">{t.label}</span>
          <span className="block tabular-nums text-xs font-bold leading-tight">{pct(t.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Karta infografiky v rozcestníku ---------- */
export function InfografikyCard({
  icon: Icon,
  title,
  desc,
  href,
  hrefLabel,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  desc: string;
  href: string;
  hrefLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col min-w-0 rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm transition-all"
    >
      <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3 group-hover:bg-teal-100 transition-colors shrink-0">
        <Icon className="w-5 h-5" strokeWidth={2} />
      </span>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>

      <div className="mt-4 rounded-lg bg-slate-50 border border-slate-100 p-3">{children}</div>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-700 group-hover:text-teal-800">
        {hrefLabel} <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}

/* ---------- Plná heatmapa (mini-žebříček variant dlaždic) ---------- */
export function InfografikyHeatGrid({ tiles }: { tiles: InfografikyHeatTile[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {tiles.map((t) => (
        <Link
          key={t.label}
          href={t.href}
          className={`group rounded-lg border px-3 py-3 transition-transform hover:-translate-y-0.5 ${heatClasses(t.value)}`}
        >
          <span className="flex items-center justify-between gap-1">
            <span className="text-xs font-medium leading-tight">{t.label}</span>
            {t.value != null &&
              (t.value >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 shrink-0 opacity-80" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 shrink-0 opacity-80" />
              ))}
          </span>
          <span className="block tabular-nums text-lg font-bold leading-tight mt-1">{pct(t.value)}</span>
        </Link>
      ))}
    </div>
  );
}

/* ---------- Reálný mini-žebříček (výnos 1R v Kč), top 5 ---------- */
export function InfografikyRankPanel({
  title,
  subtitle,
  href,
  hrefLabel,
  etfs,
}: {
  title: string;
  subtitle?: string;
  href: string;
  hrefLabel: string;
  etfs: ETFBasicInfo[];
}) {
  const rows = etfs.slice(0, 5);
  const max = Math.max(1, ...rows.map((e) => Math.abs(e.return_1y_czk ?? e.return_1y ?? 0)));
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <Link
          href={href}
          className="text-xs text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 shrink-0"
        >
          {hrefLabel} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <ul className="divide-y divide-slate-50">
        {rows.map((etf, i) => {
          const v = etf.return_1y_czk ?? etf.return_1y ?? 0;
          const pos = v >= 0;
          const w = Math.min((Math.abs(v) / max) * 100, 100);
          return (
            <li key={etf.isin}>
              <Link
                href={`/etf/${etf.isin}`}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
              >
                <span className="text-xs text-slate-400 tabular-nums w-4 shrink-0">{i + 1}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-slate-900 truncate">{shortName(etf.name)}</span>
                  <span className="block text-xs text-slate-400">{etf.primary_ticker || etf.fund_provider}</span>
                </span>
                <span className="hidden sm:block w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden shrink-0">
                  <span
                    className={`block h-full rounded-full ${pos ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${w}%` }}
                  />
                </span>
                <span
                  className={`tabular-nums text-sm font-semibold w-16 text-right shrink-0 ${pos ? 'text-emerald-600' : 'text-red-600'}`}
                >
                  {pct(v)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- Pruh interních odkazů ---------- */
export function InfografikyLinkRow({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all"
          >
            <span className="font-medium text-slate-700">{l.label}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
