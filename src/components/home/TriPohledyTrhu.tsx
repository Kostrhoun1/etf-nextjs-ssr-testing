'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import EmitentLogo from '@/components/home/EmitentLogo';
import type { RadekTrhu, FondTrhu } from '@/lib/trhy';
import { mer } from '@/lib/mereni';

/* Tři pohledy na fondy podle trhu (homepage, 18. 10. 2026): nejlevnější / největší / nejvyšší výnos.
   Všechny panely jsou ve HTML (server), JS jen přepíná záložky (WAI-ARIA tabs, šipky).
   Revize (art director + test s uživateli): krátké záložky, stejné pořadí trhů ve všech pohledech,
   hlavní číslo = údaj o vítězném fondu (ne „medián“), žádné odstavce pod tabulkou.
   Odkaz pod tabulkou vede tam, kde data odpovídají pohledu (ne na srovnávač s chybným TER 0 %). */

type Pohled = 'ter' | 'size' | 'r1';
const POHLEDY: { id: Pohled; label: string; sloupec: string; dalsi: { href: string; text: string } }[] = [
  { id: 'ter', label: 'Nejlevnější', sloupec: 'Poplatek (TER)', dalsi: { href: '/nejlepsi-etf/nejlevnejsi-etf', text: 'Žebříček nejlevnějších ETF' } },
  { id: 'size', label: 'Největší', sloupec: 'Velikost fondu', dalsi: { href: '/srovnani?sort=size&smer=desc', text: 'Všechny fondy podle velikosti' } },
  // Revize kola 4: fondy na stejný index mají skoro stejný výnos (rozdíl desetiny p. b. = poplatek, třída, burza).
  // Pohled zůstává (majitel chtěl tři), ale poctivě: výnos + rozdíl proti mediánu trhu.
  // Kolo 5: nadpis „…nejvýkonnější“, záložka „Nejvyšší výnos“ a na mobilu „Výnos“ → jedno slovo všude.
  { id: 'r1', label: 'Nejvýnosnější', sloupec: 'Výnos 12 měs. v Kč', dalsi: { href: '/srovnani?kat=Akcie&sort=r1&smer=desc', text: 'Všechny fondy podle výnosu' } },
];

const cz = (v: number, d = 1) => v.toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d });
/** Výnos se znaménkem (− je skutečné minus, ne pomlčka – čtečky i barvoslepí). */
const znamenko = (v: number) => (v > 0 ? '+' : v < 0 ? '−' : '');
/** „2026-10-16“ → „16. 10.“ (den výnosů fondu se zpožděnou řadou). */
const datumKratce = (iso: string) => { const [, m, d] = iso.slice(0, 10).split('-'); return `${Number(d)}.\u00a0${Number(m)}.`; };
const pct = (v: number | null) => (v == null ? '—' : `${znamenko(v)}${cz(Math.abs(v))}\u00a0%`);
const terF = (v: number | null) => (v == null ? '—' : `${cz(v, 2)}\u00a0%`);
const mld = (v: number | null) => (v == null ? '—' : v >= 1000 ? `${cz(v / 1000)}\u00a0mld.\u00a0€` : `${Math.round(v)}\u00a0mil.\u00a0€`);
/** Rozdíl v procentních bodech (výnos fondu − medián trhu). */
const pb = (v: number | null) => (v == null ? '—' : `${znamenko(Math.round(v * 10) / 10)}${cz(Math.abs(v))}\u00a0p.\u00a0b.`);

function Fond({ f }: { f: FondTrhu | null }) {
  if (!f) return <span className="text-slate-500">—</span>;
  return (
    <Link href={`/etf/${f.isin}`} className="group/f min-w-0 min-h-11 flex items-center gap-2.5 py-0.5">
      <EmitentLogo nazev={f.nazev} size={28} />
      <span className="min-w-0 flex flex-col">
        <span className="text-[15px] font-medium leading-snug text-slate-900 group-hover/f:text-teal-800 group-hover/f:underline underline-offset-2 md:truncate">{f.nazev}</span>
        {/* Bez tickeru (scraper ho u části fondů zatím nemá) emitent – ne zkrácený ISIN „IE…G4I4“ (kryptické, kolo 5). */}
        <span className="text-xs text-slate-500" title={f.ticker ? undefined : `ISIN ${f.isin}`}>{f.ticker ?? f.emitent ?? f.isin}</span>
      </span>
    </Link>
  );
}

export default function TriPohledyTrhu({ radky }: { radky: RadekTrhu[] }) {
  const [pohled, setPohled] = useState<Pohled>('ter');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const aktivni = POHLEDY.find((p) => p.id === pohled)!;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = POHLEDY.length;
    const j = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (j < 0) return;
    e.preventDefault();
    setPohled(POHLEDY[j].id);
    mer('zalozka', { s: 'trhy', c: POHLEDY[j].id });
    tabs.current[j]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Pohled na fondy" className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 sm:inline-grid sm:min-w-[26rem]">
        {POHLEDY.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => { tabs.current[i] = el; }}
            role="tab"
            id={`tab-${p.id}`}
            aria-selected={pohled === p.id}
            aria-controls={`panel-${p.id}`}
            tabIndex={pohled === p.id ? 0 : -1}
            onClick={() => { setPohled(p.id); mer('zalozka', { s: 'trhy', c: p.id }); }}
            onKeyDown={(e) => onKey(e, i)}
            className={`min-h-11 md:min-h-10 rounded-lg px-1.5 sm:px-3 text-[13px] sm:text-sm font-semibold transition-colors ${pohled === p.id ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {POHLEDY.map((p) => (
        <div key={p.id} role="tabpanel" id={`panel-${p.id}`} aria-labelledby={`tab-${p.id}`} hidden={pohled !== p.id} className="mt-3">
          <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
            <li className="hidden md:grid md:grid-cols-[12rem_minmax(0,1fr)_11rem_7rem_7rem] gap-6 px-5 py-3 text-xs font-medium text-slate-500">
              <span>Trh</span>
              <span>{p.id === 'ter' ? 'Nejlevnější fond' : p.id === 'size' ? 'Největší fond' : 'Nejvýnosnější fond'}</span>
              <span className="text-right">
                {p.id === 'ter'
                  ? <InfoTip label="TER = roční poplatek fondu, strhává se z jeho hodnoty. Syntetické (swapové) fondy mohou mít navíc swap poplatek – detail u fondu.">{p.sloupec}</InfoTip>
                  : p.sloupec}
              </span>
              <span className="text-right">
                {p.id === 'r1'
                  ? <InfoTip label="Výnos fondu minus medián výnosů všech fondů na tentýž trh (12 měsíců v Kč). Fondy na stejný index se liší hlavně poplatkem, třídou a burzou – rozdíl bývá v desetinách procentního bodu.">Proti mediánu</InfoTip>
                  : p.id === 'size' ? 'Poplatek (TER)' : 'Velikost'}
              </span>
              <span className="text-right">{p.id === 'r1' ? 'Poplatek (TER)' : '12 měs. v Kč'}</span>
            </li>
            {radky.map((r) => {
              const f = p.id === 'ter' ? r.nejlevnejsi : p.id === 'size' ? r.nejvetsi : r.nejvykonnejsi;
              const hlavni = p.id === 'ter' ? terF(f?.ter ?? null) : p.id === 'size' ? mld(f?.velikost ?? null) : pct(f?.r1 ?? null);
              const rozdil = f?.r1 != null && r.median != null ? f.r1 - r.median : null;
              const vedlejsi = p.id === 'size' ? terF(f?.ter ?? null) : p.id === 'r1' ? pb(rozdil) : mld(f?.velikost ?? null);
              const barva = p.id === 'r1' && f?.r1 != null ? (f.r1 >= 0 ? 'text-emerald-700' : 'text-red-700') : 'text-slate-900';
              return (
                <li key={r.trh.id} className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[12rem_minmax(0,1fr)_11rem_7rem_7rem] gap-x-6 gap-y-1 px-4 md:px-5 py-3 items-start md:items-center">
                  {/* Kolo 5: na mobilu trh nahoře zarovnaný s horním okrajem čísla (dřív visel uprostřed proti 3řádkovému bloku TER). */}
                  <Link href={r.trh.href} className="min-w-0 min-h-6 inline-flex flex-col py-0.5 hover:text-teal-800">
                    {/* Mobil: trh jako malý nadpis nad fondem (dva stejně velké názvy splývaly). */}
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 md:text-[15px] md:normal-case md:tracking-normal md:text-slate-900 hover:underline underline-offset-2">{r.trh.label}</span>
                    <span className="hidden md:block text-xs text-slate-500">{r.trh.index}</span>
                  </Link>
                  <span className="order-3 md:order-none col-span-2 md:col-span-1 min-w-0"><Fond f={f} /></span>
                  <span className={`order-2 md:order-none text-right text-base font-semibold tabular-nums ${barva}`}>
                    {hlavni}
                    {/* Mobil nemá hlavičku sloupců → popisek přímo u čísla (test s uživateli). */}
                    <span className="md:hidden block text-[11px] font-normal text-slate-500">{p.id === 'ter' ? 'poplatek ročně' : p.id === 'size' ? 'velikost fondu' : '12 měs. v Kč'}</span>
                    {p.id === 'r1' && rozdil != null && (
                      <span className="md:hidden block whitespace-nowrap text-[11px] font-normal text-slate-500">{pb(rozdil)} proti mediánu</span>
                    )}
                    {p.id === 'ter' && r.stejnyTer > 0 && (
                      <span className="block whitespace-nowrap text-xs font-normal text-slate-500">a {r.stejnyTer} {r.stejnyTer === 1 ? 'další fond' : r.stejnyTer <= 4 ? 'další fondy' : 'dalších fondů'} za {terF(f?.ter ?? null)}</span>
                    )}
                  </span>
                  <span className="hidden md:block text-right text-sm tabular-nums text-slate-600">{vedlejsi}</span>
                  {/* Výnos v Kč (USP) ve všech záložkách; v záložce výkonu je hlavním číslem → tady TER. */}
                  <span className={`hidden md:block text-right text-sm tabular-nums ${p.id === 'r1' ? 'text-slate-600' : f?.r1 == null || r.odlehle.some((o) => o.isin === f.isin) ? 'text-slate-500' : f.r1 >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {/* Fond s neověřeným výnosem (odlehlý) i tady „—“ – pravidlo č. 1. */}
                    {p.id === 'r1' ? terF(f?.ter ?? null) : pct(f && !r.odlehle.some((o) => o.isin === f.isin) ? f.r1 : null)}
                    {/* Výnos fondu se zpožděnou řadou u zdroje platí k jinému dni – ukázat ho (src/lib/datumVynosu.ts). */}
                    {p.id !== 'r1' && f?.r1 != null && f.returnsAsOf && r.pozadu.some((o) => o.isin === f.isin) && (
                      <span data-vynosy-k={f.returnsAsOf.slice(0, 10)} className="block whitespace-nowrap text-[11px] text-amber-700">k {datumKratce(f.returnsAsOf)}</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
          {p.id === 'r1' && (
            // Poctivost pohledu: rozdíly mezi fondy na stejný index jsou malé (ZAMERNA-ROZHODNUTI.md).
            // Pravidlo č. 1: vyřazení odlehlých hodnot přiznat stručně.
            <p className="mt-2 text-xs text-slate-500 text-pretty">
              Fondy na stejný index se liší hlavně poplatkem a třídou, proto je rozdíl proti mediánu trhu malý.
              {radky.some((r) => r.odlehle.length > 0) && ' Fondy s neověřeným výnosem neukazujeme.'}
              {radky.some((r) => r.pozadu.length > 0) && ' Fondy, jejichž ceny má zdroj o několik dní později, do mediánu nepočítáme.'}
            </p>
          )}
        </div>
      ))}

      <Link href={aktivni.dalsi.href} className="mt-2 inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-teal-700 hover:text-teal-800">
        {aktivni.dalsi.text} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
