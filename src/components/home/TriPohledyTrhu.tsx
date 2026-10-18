'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { RadekTrhu, FondTrhu } from '@/lib/trhy';

/* Tři pohledy na fondy podle trhu (homepage, 18. 10. 2026): nejlevnější / největší / nejvýkonnější.
   Všechny panely jsou ve HTML (server), JS jen přepíná záložky (WAI-ARIA tabs, šipky). */

type Pohled = 'ter' | 'size' | 'r1';
/* Odkaz pod tabulkou vede tam, kde data odpovídají pohledu (revize 18. 10.: srovnávač řazený podle
   TER ukazoval nahoře chybné 0 %, podle výkonu sektory a země – proto u výkonu výslovně „i sektory“). */
const POHLEDY: { id: Pohled; label: string; dalsi: { href: string; text: string } }[] = [
  { id: 'ter', label: 'Nejlevnější (TER)', dalsi: { href: '/nejlepsi-etf/nejlevnejsi-etf', text: 'Celý žebříček nejlevnějších ETF' } },
  { id: 'size', label: 'Největší', dalsi: { href: '/srovnani?sort=size&smer=desc', text: 'Všechny fondy podle velikosti ve srovnávači' } },
  { id: 'r1', label: 'Nejvýkonnější · 12 měs. v Kč', dalsi: { href: '/srovnani?kat=Akcie&sort=r1&smer=desc', text: 'Nejvýkonnější ze všech fondů, i sektory a země' } },
];

const cz = (v: number, d = 1) => v.toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d });
/** Výnos se znaménkem (− je skutečné minus, ne pomlčka – čtečky i barvoslepí). */
const pct = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : v < 0 ? '−' : ''}${cz(Math.abs(v))} %`);
const terF = (v: number | null) => (v == null ? '—' : `${cz(v, 2)} %`);
const mld = (v: number | null) => (v == null ? '—' : v >= 1000 ? `${cz(v / 1000)} mld €` : `${Math.round(v)} mil €`);
const barva = (v: number | null) => (v == null ? 'text-slate-500' : v >= 0 ? 'text-emerald-700' : 'text-red-700');

function Fond({ f }: { f: FondTrhu | null }) {
  if (!f) return <span className="text-slate-500">—</span>;
  return (
    <Link href={`/etf/${f.isin}`} className="group/f min-w-0 flex md:flex-col items-baseline md:items-start gap-x-1.5 hover:text-teal-800">
      <span className="truncate text-sm font-medium text-slate-900 group-hover/f:text-teal-800 group-hover/f:underline underline-offset-2">{f.nazev}</span>
      <span className="shrink-0 text-xs text-slate-500">{f.ticker ?? f.isin}</span>
    </Link>
  );
}

function Trh({ r }: { r: RadekTrhu }) {
  return (
    <Link href={r.trh.href} className="min-w-0 inline-flex flex-col hover:text-teal-800">
      <span className="text-sm font-semibold text-slate-900 hover:underline underline-offset-2">{r.trh.label}</span>
      <span className="hidden md:block text-xs text-slate-500">{r.trh.index} · {r.pocet} fondů</span>
    </Link>
  );
}

export default function TriPohledyTrhu({ radky, dvojice }: {
  radky: RadekTrhu[]; dvojice: [string, string][];
}) {
  const [pohled, setPohled] = useState<Pohled>('ter');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const poVykonu = [...radky].sort((a, b) => (b.median ?? -1e9) - (a.median ?? -1e9));
  const sVykonem = radky.filter((r) => r.median != null && r.min != null && r.max != null);
  const maxRozpeti = sVykonem.length ? Math.max(...sVykonem.map((r) => r.max! - r.min!)) : null;
  const mezitrhy = sVykonem.length >= 2 ? Math.max(...sVykonem.map((r) => r.median!)) - Math.min(...sVykonem.map((r) => r.median!)) : null;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = POHLEDY.length;
    const j = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (j < 0) return;
    e.preventDefault();
    setPohled(POHLEDY[j].id);
    tabs.current[j]?.focus();
  };

  const radkyPohledu = pohled === 'r1' ? poVykonu : radky;
  const aktivni = POHLEDY.find((p) => p.id === pohled)!.dalsi;

  return (
    <div>
      <div role="tablist" aria-label="Pohled na fondy" className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 sm:inline-grid">
        {POHLEDY.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => { tabs.current[i] = el; }}
            role="tab"
            id={`tab-${p.id}`}
            aria-selected={pohled === p.id}
            aria-controls={`panel-${p.id}`}
            tabIndex={pohled === p.id ? 0 : -1}
            onClick={() => setPohled(p.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`min-h-11 rounded-lg px-3 text-xs sm:text-sm font-semibold leading-tight transition-colors ${pohled === p.id ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {POHLEDY.map((p) => (
        <div key={p.id} role="tabpanel" id={`panel-${p.id}`} aria-labelledby={`tab-${p.id}`} hidden={pohled !== p.id} className="mt-3">
          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            <li className="hidden md:grid md:grid-cols-[1.1fr_1.6fr_0.8fr_0.9fr] gap-4 px-4 py-2.5 text-xs font-medium text-slate-500">
              <span>Trh</span>
              {p.id === 'ter' && <><span>Nejlevnější fond</span><span className="text-right">TER</span><span className="text-right">Velikost</span></>}
              {p.id === 'size' && <><span>Největší fond</span><span className="text-right">Velikost</span><span className="text-right">TER</span></>}
              {p.id === 'r1' && <><span>Nejvýkonnější fond</span><span className="text-right">Výnos trhu (medián)</span><span className="text-right">Rozpětí fondů</span></>}
            </li>
            {(p.id === 'r1' ? poVykonu : radky).map((r) => (
              <li key={r.trh.id} className="grid grid-cols-[1fr_auto] md:grid-cols-[1.1fr_1.6fr_0.8fr_0.9fr] gap-x-4 gap-y-0.5 px-4 py-2.5 md:py-3 items-center">
                <Trh r={r} />
                {p.id === 'ter' && <>
                  <span className="order-3 md:order-none col-span-2 md:col-span-1 min-w-0"><Fond f={r.nejlevnejsi} /></span>
                  <span className="order-2 md:order-none text-right">
                    <span className="block text-base md:text-sm font-semibold tabular-nums text-slate-900">{terF(r.nejlevnejsi?.ter ?? null)}</span>
                    {r.stejnyTer > 0 && <span className="block text-[11px] text-slate-500">+{r.stejnyTer} se stejným</span>}
                  </span>
                  <span className="hidden md:block text-right text-sm tabular-nums text-slate-600">{mld(r.nejlevnejsi?.velikost ?? null)}</span>
                </>}
                {p.id === 'size' && <>
                  <span className="order-3 md:order-none col-span-2 md:col-span-1 min-w-0"><Fond f={r.nejvetsi} /></span>
                  <span className="order-2 md:order-none text-right text-base md:text-sm font-semibold tabular-nums text-slate-900">{mld(r.nejvetsi?.velikost ?? null)}</span>
                  <span className="hidden md:block text-right text-sm tabular-nums text-slate-600">{terF(r.nejvetsi?.ter ?? null)}</span>
                </>}
                {p.id === 'r1' && <>
                  <span className="order-3 md:order-none col-span-2 md:col-span-1 min-w-0 flex items-baseline gap-2">
                    <span className="md:hidden shrink-0 text-xs text-slate-500">Nejlepší fond:</span>
                    <Fond f={r.nejvykonnejsi} />
                    {r.nejvykonnejsi && <span className={`shrink-0 text-xs font-semibold tabular-nums ${barva(r.nejvykonnejsi.r1)}`}>{pct(r.nejvykonnejsi.r1)}</span>}
                  </span>
                  <span className="order-2 md:order-none text-right">
                    <span className={`block text-base md:text-sm font-semibold tabular-nums ${barva(r.median)}`}>{pct(r.median)}</span>
                    <span className="md:hidden block text-[11px] text-slate-500">medián trhu</span>
                  </span>
                  <span className="hidden md:block text-right text-sm tabular-nums text-slate-600">{r.min != null && r.max != null ? `${pct(r.min)} až ${pct(r.max)}` : '—'}</span>
                </>}
              </li>
            ))}
          </ul>
          {p.id === 'ter' && (
            <p className="mt-2 text-xs text-slate-500">TER = roční poplatek fondu. Syntetické (swapové) fondy mohou mít navíc swap poplatek – detail u fondu.</p>
          )}
          {p.id === 'r1' && maxRozpeti != null && mezitrhy != null && (
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Fondy na stejný trh se za 12 měsíců lišily nejvýš o <strong className="tabular-nums">{cz(maxRozpeti)} p. b.</strong>, mezi trhy byl rozdíl <strong className="tabular-nums">{cz(mezitrhy)} p. b.</strong> Rozhoduje tedy hlavně výběr trhu, pak poplatek. Minulý výnos se nemusí opakovat.
            </p>
          )}
        </div>
      ))}
      {radkyPohledu.length === 0 && <p className="mt-3 text-sm text-slate-500">Data se nepodařilo načíst.</p>}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link href={aktivni.href} className="inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-teal-700 hover:text-teal-800">
          {aktivni.text} <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="hidden sm:flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-slate-500">
          <span>Často srovnávané:</span>
          {dvojice.map(([href, label]) => (
            <Link key={href} href={href} className="inline-flex items-center min-h-8 rounded-md px-1.5 font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-800">{label}</Link>
          ))}
        </p>
      </div>
    </div>
  );
}
