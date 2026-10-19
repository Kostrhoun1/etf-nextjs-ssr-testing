import Link from 'next/link';
import type { ETFBasicInfo, FlagshipComposition, CompositionSlice } from '@/lib/etf-data';
import type { IndexInfo } from '@/components/design-preview/indexDescriptions';
import { ArrowRight, TrendingUp, TrendingDown, Globe2, PieChart, Layers, Info } from 'lucide-react';
import { ceskaZeme, ceskySektor } from '@/lib/preklady';

/* ---------- Formátovače ----------
   Jednotné formáty webu (kolo 5): „139,4 mld. €“ / „529 mil. €“, záporná čísla skutečným minus (U+2212),
   mezi číslem a % / jednotkou nezlomitelná mezera (žádné „80 / %“ na konci řádku). */
const NB = '\u00a0';
export const ter = (v: number | null) => (v == null ? '—' : `${v.toFixed(2).replace('.', ',')}${NB}%`);

/** POZOR: fund_size_numeric se z justETF stahuje VŽDY v EUR (standardizace kvůli
 *  srovnatelnosti), i u USD/GBP tříd → symbol je vždy €. Ověřeno proti justETF. */
export const curSym = (_c?: string | null) => '€';

export const money = (v: number | null, cur: string | null = 'EUR') => {
  if (v == null) return '—';
  const s = curSym(cur);
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace('.', ',')}${NB}mld.${NB}${s}`;
  return `${Math.round(v)}${NB}mil.${NB}${s}`;
};

export const pct = (v: number | null) => {
  if (v == null) return '—';
  return `${v > 0 ? '+' : v < 0 ? '\u2212' : ''}${Math.abs(v).toFixed(1).replace('.', ',')}${NB}%`;
};

/** Text s čísly: „80 %“ → „80&nbsp;%“, „100 mil. €“ → nezlomitelně (pro popisy z obsahu). */
export const nbsp = (t: string) => t.replace(/(\d) (%|mil\.|mld\.|€|Kč)/g, `$1${NB}$2`).replace(/(mil\.|mld\.) €/g, `$1${NB}€`);

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
  title: React.ReactNode;
  subtitle?: string;
  rows: { isin: string; label: string; sub?: string; value: React.ReactNode; flagged?: boolean }[];
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <ul className="divide-y divide-slate-50">
        {rows.map((r, i) => (
          <li key={r.isin}>
            <Link
              href={`/etf/${r.isin}`}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
            >
              <span className="text-xs text-slate-400 tabular-nums w-4 shrink-0">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1.5 min-w-0">
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
          const v = etf.return_1y_czk ?? null; // nikdy EUR místo Kč; bez hodnoty „—“
          const pos = (v ?? 0) >= 0;
          return (
            <Link key={etf.isin} href={`/etf/${etf.isin}`} className="flex items-center gap-1.5 shrink-0 hover:opacity-80">
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
  className = 'mb-4',
}: {
  id?: string;
  title: string;
  desc?: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
}) {
  return (
    <div id={id} className={`flex items-start justify-between scroll-mt-20 ${className}`}>
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {desc && <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">{desc}</p>}
      </div>
      {href && (
        <Link href={href} className="text-sm text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 shrink-0 mt-1">
          {hrefLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

/* ---------- Infografika složení vlajkového fondu ---------- */

// Odstupňovaná tyrkysová paleta pro segmenty (poslední = „ostatní" – šedá).
const SLICE_COLORS = ['#0f766e', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'];
const REST_COLOR = '#cbd5e1';

// Názvy zemí a sektorů jen přes src/lib/preklady.ts (jeden slovník pro celý web – revize 18. 10. 2026:
// „Spotřeba (běžná)“ tady vs. „Spotřební zboží (základní)“ na detailu fondu).


type Dimension = 'country' | 'sector' | 'holding';

/** Vybere nejvýstižnější dimenzi podle typu kategorie a dostupnosti dat. */
function pickDimension(
  comp: FlagshipComposition,
  prefer: Dimension,
): { dim: Dimension; slices: CompositionSlice[] } | null {
  const order: Dimension[] =
    prefer === 'sector' ? ['sector', 'country', 'holding']
    : prefer === 'holding' ? ['holding', 'sector', 'country']
    : ['country', 'sector', 'holding'];
  const byDim: Record<Dimension, CompositionSlice[]> = {
    country: comp.countries, sector: comp.sectors, holding: comp.holdings,
  };
  for (const dim of order) {
    const slices = byDim[dim];
    // Přeskoč degenerované případy: 0/1 segment nebo jediný „Other 100 %".
    const meaningful = slices.filter((s) => s.name.toLowerCase() !== 'other' || slices.length > 1);
    if (meaningful.length >= 2) return { dim, slices };
  }
  return null;
}

/** Vykreslí CompositionInfographic něco? (Kvůli rozložení stránky – komponenta jinak vrací null.) */
export function slozeniPouzitelne(comp: FlagshipComposition | null, prefer: Dimension = 'country'): boolean {
  return !!comp && pickDimension(comp, prefer) != null;
}

const DIM_META: Record<Dimension, { title: string; icon: typeof Globe2; localize: (n: string) => string }> = {
  country: { title: 'Geografické rozložení', icon: Globe2, localize: ceskaZeme },
  sector: { title: 'Rozložení podle sektorů', icon: PieChart, localize: ceskySektor },
  holding: { title: 'Největší pozice ve fondu', icon: Layers, localize: (n) => n },
};

/**
 * Vizuální infografika „co v tom je" – 100% skládaný pruh + legenda.
 * Segmenty se normalizují na 100 %; zbytek do 100 % je „Ostatní".
 * Graceful: když vlajkový fond nemá použitelná data (zlato, ropa), vrací null.
 */
export function CompositionInfographic({
  comp,
  prefer = 'country',
  fundLabel,
}: {
  comp: FlagshipComposition | null;
  prefer?: Dimension;
  fundLabel?: string;
}) {
  if (!comp) return null;
  const picked = pickDimension(comp, prefer);
  if (!picked) return null;
  const { dim, slices } = picked;
  const meta = DIM_META[dim];
  const Icon = meta.icon;

  // Segmenty (max 5) + dopočítaný zbytek do 100 %.
  const top = slices.slice(0, 5).map((s) => ({ ...s, label: meta.localize(s.name) }));
  const sum = top.reduce((a, s) => a + s.weight, 0);
  const rest = Math.max(0, 100 - sum);
  // „Ostatní" segment: buď už je v datech (name==Other), nebo dopočet nad 3 %.
  const hasExplicitOther = top.some((s) => s.name.toLowerCase() === 'other');
  const showRest = !hasExplicitOther && rest > 3 && dim !== 'holding';

  const segs = top.map((s, i) => ({
    label: s.name.toLowerCase() === 'other' ? 'Ostatní' : s.label,
    weight: s.weight,
    color: s.name.toLowerCase() === 'other' ? REST_COLOR : SLICE_COLORS[i % SLICE_COLORS.length],
  }));
  if (showRest) segs.push({ label: 'Ostatní', weight: rest, color: REST_COLOR });

  const totalForScale = segs.reduce((a, s) => a + s.weight, 0) || 100;
  // Jednotně 1 desetinné místo („45,2 %“ vedle „9,1 %“ – dřív se míchalo „45 %“ a „9,1 %“).
  const fmtW = (w: number) => `${w.toFixed(1).replace('.', ',')}${NB}%`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 shrink-0">
            <Icon className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm md:text-base font-semibold text-slate-900 leading-tight">{meta.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
              Podle {fundLabel ?? shortName(comp.name)}
              {comp.totalHoldings ? ` · ${comp.totalHoldings.toLocaleString('cs-CZ')} pozic ve fondu` : ''}
              {/* Kolo 5: sektory zdroje ≠ GICS (src/lib/preklady.ts). */}
              {dim === 'sector' ? ' · klasifikace zdroje dat, ne GICS' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Skládaný pruh */}
      <div className="flex w-full h-7 rounded-lg overflow-hidden bg-slate-100" role="img" aria-label={meta.title}>
        {segs.map((s, i) => (
          <div
            key={i}
            className="h-full first:rounded-l-lg last:rounded-r-lg"
            style={{ width: `${(s.weight / totalForScale) * 100}%`, backgroundColor: s.color }}
            title={`${s.label}: ${fmtW(s.weight)}`}
          />
        ))}
      </div>

      {/* Legenda */}
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {segs.map((s, i) => (
          <li key={i} className="flex items-center gap-2 text-sm min-w-0">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-slate-700 line-clamp-2 flex-1 min-w-0">{s.label}</span>
            <span className="tabular-nums font-semibold text-slate-900 shrink-0">{fmtW(s.weight)}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-start gap-1.5 text-xs text-slate-400 leading-relaxed">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        Ilustrační složení největšího fondu v kategorii. Jednotlivé fondy se mohou lišit; přesné složení najdete v detailu fondu.
      </p>
    </div>
  );
}

/**
 * „Které indexy tato kategorie sleduje" – datově řízený přehled reálně sledovaných
 * indexů (dle fondů v kategorii) s odborným popisem. Index fondu = indexFonduLabel (stejně jako srovnávač).
 * Počet slovy („Sledují ho všechny fondy v žebříčku (58)“, „14 z 24 fondů“) – „58 z 58“ bylo nesrozumitelné.
 */
export function CategoryIndexes({ indexes, total, sloupce = 2, zCeho = 'fondů v žebříčku' }: {
  indexes: { info: IndexInfo; count: number }[]; total: number; sloupce?: 1 | 2;
  /** Doplněk za „z N …“ – u velkých kategorií „největších fondů“. */
  zCeho?: string;
}) {
  if (!indexes.length) return null;
  return (
    <div className={`grid gap-3 ${sloupce === 2 ? 'sm:grid-cols-2' : ''}`}>
      {indexes.map(({ info, count }) => (
        <div key={info.label} className="min-w-0 rounded-xl border border-slate-200 bg-white p-5" data-index-pocet={count} data-index-celkem={total}>
          <h3 className="text-base font-semibold text-slate-900 leading-tight">{info.label}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">{info.provider}</span>
            {info.holdings && <span>{info.holdings}</span>}
          </div>
          <p className="mt-2 text-sm font-medium text-teal-800">
            {count === total
              ? `Sledují ho všechny fondy v žebříčku (${total.toLocaleString('cs-CZ')})`
              : `Sleduje ho ${count.toLocaleString('cs-CZ')} z ${total.toLocaleString('cs-CZ')} ${zCeho}`}
          </p>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{nbsp(info.what)}</p>
        </div>
      ))}
    </div>
  );
}
