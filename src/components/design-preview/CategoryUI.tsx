import Link from 'next/link';
import type { ETFBasicInfo } from '@/lib/etf-data';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

/* ---------- Formátovače ---------- */
export const ter = (v: number | null) => (v == null ? '—' : `${v.toFixed(2).replace('.', ',')} %`);

export const money = (v: number | null) => {
  if (v == null) return '—';
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace('.', ',')} mld €`;
  return `${Math.round(v)} mil €`;
};

export const pct = (v: number | null) => {
  if (v == null) return '—';
  return `${v >= 0 ? '+' : ''}${v.toFixed(1).replace('.', ',')} %`;
};

export const shortName = (n: string) =>
  n.replace(/\s+UCITS ETF.*/i, '').replace(/\s+\(.*\)/, '').trim();

export const dist = (p: string | null) => {
  if (!p) return '—';
  if (/acc/i.test(p)) return 'Akumulační';
  if (/dist/i.test(p)) return 'Distribuční';
  return p;
};

export const repl = (r: string | null) => {
  if (!r) return '—';
  if (/physical/i.test(r)) return 'Fyzická';
  if (/swap|synth/i.test(r)) return 'Swap';
  return r;
};

export const domicile = (d: string | null) => {
  if (!d) return '—';
  if (/ireland/i.test(d)) return 'Irsko';
  if (/luxem/i.test(d)) return 'Lucembursko';
  if (/france/i.test(d)) return 'Francie';
  return d;
};

/* ---------- Výkonnostní pruh (stejný jazyk jako design-preview) ---------- */
export function PerfBar({ v }: { v: number | null }) {
  const val = v ?? 0;
  const pos = val >= 0;
  const w = Math.min((Math.abs(val) / 40) * 100, 100);
  return (
    <div className="flex items-center gap-2 justify-end">
      <span className={`tabular-nums text-sm font-medium ${pos ? 'text-emerald-600' : 'text-red-600'}`}>
        {pct(v)}
      </span>
      <div className="hidden sm:block w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${pos ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${w}%` }} />
      </div>
    </div>
  );
}

/* ---------- Žebříčkový panel (DataPanel z design-preview) ---------- */
export function RankPanel({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle?: string;
  rows: { isin: string; label: string; sub?: string; value: React.ReactNode; flagged?: boolean }[];
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <ul className="divide-y divide-slate-50">
        {rows.map((r, i) => (
          <li key={r.isin}>
            <Link
              href={`/design-preview/etf/${r.isin}`}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
            >
              <span className="text-xs text-slate-400 tabular-nums w-4 shrink-0">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-slate-900 truncate">{r.label}</span>
                  {r.flagged && (
                    <span className="shrink-0 rounded-full bg-amber-50 text-amber-700 text-[10px] font-medium px-1.5 py-0.5 border border-amber-200">
                      nečistý
                    </span>
                  )}
                </span>
                {r.sub && <span className="block text-xs text-slate-400">{r.sub}</span>}
              </span>
              <span className="shrink-0 text-right">{r.value}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Mini ticker badge řádek pro tržní strip ---------- */
export function TickerStrip({ etfs }: { etfs: ETFBasicInfo[] }) {
  return (
    <div className="hidden sm:block bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-5 overflow-x-auto text-sm">
        <span className="text-xs font-medium text-slate-400 shrink-0 uppercase tracking-wide">Výnos 1R (CZK)</span>
        {etfs.map((etf) => {
          const v = etf.return_1y_czk ?? etf.return_1y ?? 0;
          const pos = v >= 0;
          return (
            <Link key={etf.isin} href={`/design-preview/etf/${etf.isin}`} className="flex items-center gap-1.5 shrink-0 hover:opacity-80">
              <span className="font-medium text-slate-700">{etf.primary_ticker || shortName(etf.name).slice(0, 10)}</span>
              <span className={`tabular-nums font-medium inline-flex items-center gap-0.5 ${pos ? 'text-emerald-600' : 'text-red-600'}`}>
                {pos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {pct(v)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Sekční nadpis ---------- */
export function SectionHead({
  id,
  title,
  desc,
  href,
  hrefLabel,
}: {
  id?: string;
  title: string;
  desc?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div id={id} className="flex items-end justify-between mb-4 scroll-mt-20">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {desc && <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">{desc}</p>}
      </div>
      {href && (
        <Link href={href} className="text-sm text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 shrink-0">
          {hrefLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
