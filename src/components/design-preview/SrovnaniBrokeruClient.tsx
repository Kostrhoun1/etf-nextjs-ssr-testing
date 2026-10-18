'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ChevronDown, ArrowRight } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import { brokeriPodleSkore } from '@/data/brokerData';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import type { Broker, CenikNakupu } from '@/types/broker/index';

/* Srovnávací tabulka se GENERUJE z objektů brokerů (src/data/brokerData.ts) – jeden zdroj pravdy.
   Buňka = krátká hodnota, plné znění z ceníku je v tooltipu (dřív odstavce v buňkách, revize 18. 10. 2026).
   Robo-poradce Portu v tabulce brokerů není – je to jiná kategorie bez skóre (karta pod tabulkou). */

type Hodnota = { kratce: string; detail?: string; ano?: boolean };
interface Radek { nazev: string; tip?: string; hodnota: (b: Broker) => Hodnota }

const num = (v: number) => v.toLocaleString('cs-CZ', { maximumFractionDigits: 3 });

function kratkyPoplatek(c: CenikNakupu | undefined): string {
  if (!c) return '—';
  const p = c.pasma;
  if (p.every((x) => x.pevneEur === 0 && x.procento === 0 && x.minEur === 0)) return '0 %';
  if (p.length > 1) return `od ${num(p[0].pevneEur)} EUR`;
  if (p[0].procento > 0) return `${num(p[0].procento)} %, min. ${num(p[0].minEur)} EUR`;
  return `${num(p[0].pevneEur)} EUR`;
}
function kratkaSmena(c: CenikNakupu | undefined, plny: string): string {
  if (!c) return plny;
  if (c.smena == null) return 'V kurzu banky';
  if (c.smena.procento === 0) return 'Zdarma';
  return c.smena.minUsd > 0 ? `${num(c.smena.procento)} %, min. ${num(c.smena.minUsd)} USD` : `${num(c.smena.procento)} %`;
}
/** „Do 20 100 EUR – společný limit s cennými papíry“ → „Do 20 100 EUR“; „100 000 EUR (FPV)“ → „100 000 EUR“. */
const castka = (t: string) => t.split(' – ')[0].split(' (')[0].split(';')[0];

const RADKY: Radek[] = [
  { nazev: 'Nákup ETF', tip: 'Poplatek za nákup evropského ETF na burze Xetra. Plné znění ceníku po najetí na ⓘ u hodnoty.', hodnota: (b) => ({ kratce: kratkyPoplatek(b.nakup), detail: b.etfFee }) },
  { nazev: 'Směna CZK → EUR', tip: 'Přirážka při směně korun na eura – platíte ji při každém nákupu z korun.', hodnota: (b) => ({ kratce: kratkaSmena(b.nakup, b.fxFee), detail: b.fxFee }) },
  { nazev: 'Hotovost na účtu', tip: 'Do jaké výše je chráněna hotovost na účtu. U bank pojištění vkladů, u ostatních garanční fond se společným limitem pro hotovost i cenné papíry.', hodnota: (b) => ({ kratce: b.ochrana ? castka(b.ochrana.hotovost) : '—', detail: b.ochrana?.hotovost }) },
  { nazev: 'Cenné papíry (při krachu brokera)', tip: 'Vaše ETF jsou vedená odděleně od majetku brokera. Garanční fond kryje, kdyby při krachu brokera chyběla.', hodnota: (b) => ({ kratce: b.ochrana ? castka(b.ochrana.cennePapiry) : '—', detail: b.ochrana?.cennePapiry }) },
  { nazev: 'Regulace', hodnota: (b) => {
    // Pro české klienty rozhoduje entita „pro CZ klienty“ (T212 = CySEC, ne FCA; IBKR = CBI).
    const casti = b.regulation.split(', ');
    return { kratce: (casti.find((c) => c.includes('pro CZ')) ?? casti[0]).replace(' pro CZ klienty', ''), detail: b.regulation };
  } },
  { nazev: 'Část podílu (frakce)', tip: 'Koupě části podílu ETF za přesnou částku.', hodnota: (b) => ({ kratce: b.fractional ? 'Ano' : 'Ne', ano: b.fractional }) },
  { nazev: 'Česká podpora', hodnota: (b) => ({ kratce: b.czSupport ? 'Ano' : 'Ne', ano: b.czSupport, detail: b.czSupport ? b.customerSupport : undefined }) },
  { nazev: 'Daň z CZ dividend', tip: 'Srážka z dividend českých akcií. U akumulačních ETF se vás přímo netýká.', hodnota: (b) => ({ kratce: b.czDividends.split(' (')[0].replace('%', ' %'), detail: b.czDividends.includes('(') ? b.czDividends : undefined }) },
  { nazev: 'Min. vklad', hodnota: (b) => ({ kratce: b.minDeposit }) },
];

function Bunka({ h }: { h: Hodnota }) {
  const ikona = h.ano === true
    ? <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.5} />
    : h.ano === false ? <X className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={2.5} /> : null;
  const text = <span className={`inline-flex items-center gap-1 ${h.ano === false ? 'text-slate-500' : 'text-slate-800'}`}>{ikona}{h.kratce}</span>;
  return h.detail && h.detail !== h.kratce ? <InfoTip label={h.detail}>{text}</InfoTip> : text;
}

function Logo({ id, size = 'w-7 h-7' }: { id: string; size?: string }) {
  return (
    <span className={`${size} flex items-center justify-center shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-slate-200`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/loga-brokeru/${id}-ikona.png`} alt="" width={64} height={64} className="w-full h-full object-contain" />
    </span>
  );
}

function ScoreBar({ score, wide = false }: { score: number; wide?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${wide ? 'w-full' : ''}`}>
      <span className="tabular-nums font-bold text-slate-900 text-sm">{score}<span className="text-slate-400 font-medium text-xs">/100</span></span>
      <div className={`${wide ? 'flex-1' : 'w-14'} h-1.5 rounded-full bg-slate-100 overflow-hidden`}>
        <div className="h-full rounded-full bg-teal-600" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

/** profil = krátký štítek „pro koho“ ze sdíleného doporučení (předává server, ať se neliší od /kde-koupit). */
export default function SrovnaniBrokeruClient({ profil }: { profil: Record<string, string> }) {
  const brokeri = brokeriPodleSkore;
  return (
    <>
      {/* DESKTOP – jedna datová tabulka */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[16.5rem]" />
            {brokeri.map((b) => <col key={b.id} />)}
          </colgroup>
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left font-medium px-4 py-3 align-bottom">Parametr</th>
              {brokeri.map((b) => (
                <th key={b.id} className="text-left font-medium px-3 py-3 align-bottom">
                  <Link href={reviewHref[b.id]} className="flex items-center gap-2 font-semibold text-slate-900 hover:text-teal-700">
                    <Logo id={b.id} />
                    <span className="leading-tight">{b.name}</span>
                  </Link>
                  {profil[b.id] && <span className="mt-1 block text-xs font-normal text-slate-500 leading-snug">{profil[b.id]}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-900">
                <InfoTip label="Redakční hodnocení 0–100 podle stejných šesti os pro všechny brokery (metodika na stránce Kde koupit ETF).">Skóre</InfoTip>
              </td>
              {brokeri.map((b) => <td key={b.id} className="px-3 py-3"><ScoreBar score={b.rating ?? 0} /></td>)}
            </tr>
            {RADKY.map((r) => (
              <tr key={r.nazev} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-700">{r.tip ? <InfoTip label={r.tip}>{r.nazev}</InfoTip> : r.nazev}</td>
                {brokeri.map((b) => <td key={b.id} className="px-3 py-3 align-top"><Bunka h={r.hodnota(b)} /></td>)}
              </tr>
            ))}
            <tr className="border-t border-slate-100 bg-slate-50/60">
              <td className="px-4 py-3" />
              {brokeri.map((b) => (
                <td key={b.id} className="px-3 py-3">
                  <Link href={reviewHref[b.id]} className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800 whitespace-nowrap">
                    Recenze <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* MOBIL – karty na brokera */}
      <div className="md:hidden space-y-3">
        {brokeri.map((b) => <MobileBrokerCard key={b.id} b={b} profil={profil[b.id]} />)}
      </div>
    </>
  );
}

function MobileBrokerCard({ b, profil }: { b: Broker; profil?: string }) {
  const [open, setOpen] = useState(false);
  const klicove = RADKY.filter((r) => ['Nákup ETF', 'Směna CZK → EUR', 'Hotovost na účtu', 'Cenné papíry (při krachu brokera)', 'Daň z CZ dividend', 'Česká podpora'].includes(r.nazev));
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <Logo id={b.id} size="w-10 h-10" />
        <div className="min-w-0 flex-1">
          <Link href={reviewHref[b.id]} className="block font-semibold text-slate-900 hover:text-teal-700">{b.name}</Link>
          {profil && <span className="block text-xs text-slate-500">{profil}</span>}
        </div>
      </div>
      <div className="mt-3"><ScoreBar score={b.rating ?? 0} wide /></div>
      <dl className="mt-3 divide-y divide-slate-100 text-sm">
        {klicove.map((r) => (
          <div key={r.nazev} className="flex items-start justify-between gap-3 py-2">
            <dt className="text-slate-500">{r.nazev}</dt>
            <dd className="text-right tabular-nums"><Bunka h={r.hodnota(b)} /></dd>
          </div>
        ))}
      </dl>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-teal-700">
        Klady a zápory <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="grid gap-3 text-sm">
          <ul className="space-y-1">
            {b.pros.slice(0, 4).map((p) => (
              <li key={p} className="flex items-start gap-1.5 text-slate-700"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} /><span>{p}</span></li>
            ))}
          </ul>
          <ul className="space-y-1">
            {b.cons.slice(0, 3).map((c) => (
              <li key={c} className="flex items-start gap-1.5 text-slate-500"><X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" strokeWidth={2.5} /><span>{c}</span></li>
            ))}
          </ul>
        </div>
      )}
      <Link href={reviewHref[b.id]} className="mt-2 inline-flex w-full min-h-11 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">
        Recenze {b.name} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
