'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight } from 'lucide-react';
import { TipZaTextem } from '@/components/design-preview/brokerUI';
import {
  brokeriAbecedne, popisPoplatku, popisSmeny, popisMinVkladu, popisRegulace, popisDaneDividend, popisPodpory, ochranaHotovosti, ochranaPapiru, nezlomit,
} from '@/data/brokerData';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import type { Broker } from '@/types/broker/index';

/* Srovnávací tabulka se GENERUJE z objektů brokerů (src/data/brokerData.ts) – jeden zdroj pravdy.
   Kolo 5: desktop = celá tabulka BEZ overflow předka a se sticky záhlavím (logo + jméno zůstává při scrollu
   vidět, top-14 = pod hlavičkou webu). Mobil = výběr 2 brokerů vedle sebe (dřív vodorovně posouvaná tabulka,
   ve které bylo vidět ~1,7 brokera). Poplatek a směna mají v desktopové tabulce atributy data-poplatek/data-smena,
   které denní kontrola porovnává s /kde-koupit – mobilní výběr je záměrně nemá (jinak by se počítaly dvakrát).
   Robo-poradce Portu v tabulce brokerů není (karta pod tabulkou). */

type Hodnota = { v: string; pozn?: string; ano?: boolean; data?: Record<string, string> };
interface Radek { nazev: string; tip?: string; hodnota: (b: Broker) => Hodnota }


const RADKY: Radek[] = [
  {
    nazev: 'Nákup ETF',
    tip: 'Poplatek za nákup evropského ETF na burze Xetra (v EUR, podle ceníku). Kolik to dělá v korunách pro vaši částku, spočítáme na stránce Kde koupit ETF.',
    hodnota: (b) => ({ v: popisPoplatku(b) ?? '—', pozn: b.nakup?.pozn, data: { 'data-poplatek': popisPoplatku(b) ?? '' } }),
  },
  {
    nazev: 'Směna CZK → EUR',
    tip: 'Přirážka při směně korun na eura – platíte ji při každém nákupu z korun. „—“ = výši ceník neuvádí.',
    hodnota: (b) => ({ v: popisSmeny(b) ?? '—', pozn: b.nakup?.smenaPozn, data: { 'data-smena': popisSmeny(b) ?? '' } }),
  },
  {
    nazev: 'Hotovost na účtu',
    tip: 'Do jaké výše je chráněna hotovost na účtu. U bank pojištění vkladů, u ostatních garanční systém se společným limitem pro hotovost i cenné papíry.',
    hodnota: (b) => ochranaHotovosti(b),
  },
  {
    nazev: 'Cenné papíry při krachu',
    // Bez vysvětlivky – hodnota sama říká „Vracejí se vám“ a kdy nastupuje náhrada (kolo 5: bublina na mobilu překrývala řádek).
    hodnota: (b) => ochranaPapiru(b),
  },
  {
    nazev: 'Regulace',
    tip: 'Dohled nad entitou, se kterou uzavírá smlouvu český klient.',
    hodnota: (b) => popisRegulace(b),
  },
  {
    nazev: 'Část podílu',
    tip: 'Koupě části podílu ETF za přesnou částku, třeba 2 000 Kč, i když jeden podíl stojí víc.',
    hodnota: (b) => ({ v: b.fractional ? 'Ano' : 'Ne', ano: b.fractional }),
  },
  {
    nazev: 'Česká podpora',
    hodnota: (b) => ({ ...popisPodpory(b), ano: b.czSupport }),
  },
  {
    nazev: 'Daň z CZ dividend',
    tip: 'Srážka z dividend českých akcií. U akumulačních ETF se vás přímo netýká.',
    hodnota: (b) => popisDaneDividend(b),
  },
  {
    nazev: 'Min. vklad',
    tip: 'Nejmenší částka, kterou musíte na účet poslat. Bez nákupu části podílu ale kupujete celé kusy – první nákup pak stojí aspoň cenu jednoho podílu.',
    hodnota: (b) => ({ v: popisMinVkladu(b) }),
  },
];

function Bunka({ h, sData = true }: { h: Hodnota; sData?: boolean }) {
  const ikona = h.ano === true
    ? <Check className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} />
    : h.ano === false ? <X className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2.5} /> : null;
  return (
    <>
      <span className={`flex items-center gap-1 font-medium leading-snug ${h.ano === false ? 'text-slate-500' : 'text-slate-900'}`} {...(sData ? h.data : {})}>{ikona}{nezlomit(h.v)}</span>
      {h.pozn && <span className="mt-0.5 block text-xs leading-snug text-slate-500">{nezlomit(h.pozn)}</span>}
    </>
  );
}

function Logo({ id }: { id: string }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/loga-brokeru/${id}-ikona.png`} alt="" width={64} height={64} className="h-full w-full object-contain" />
    </span>
  );
}

/* Sticky záhlaví: buňky th (ne thead – Safari sticky na thead ignoruje), neprůhledné pozadí a spodní linka. */
const ZAHLAVI = 'sticky top-14 z-20 bg-slate-50 shadow-[0_1px_0_0_rgb(226_232_240)]';

/** Desktop (md+): celá tabulka, záhlaví se při scrollu drží pod hlavičkou webu. */
function Tabulka({ profil }: { profil: Record<string, string> }) {
  const brokeri = brokeriAbecedne;
  return (
    <table className="hidden w-full table-fixed text-sm md:table">
      <colgroup>
        <col className="w-[9.5rem] lg:w-[13rem]" />
        {brokeri.map((b) => <col key={b.id} />)}
      </colgroup>
      <thead className="text-slate-600">
        <tr>
          <th scope="col" className={`${ZAHLAVI} rounded-tl-xl px-4 py-3 text-left align-bottom text-xs font-medium`}>Parametr</th>
          {brokeri.map((b, i) => (
            <th key={b.id} scope="col" className={`${ZAHLAVI} ${i === brokeri.length - 1 ? 'rounded-tr-xl' : ''} px-3 py-3 text-left align-bottom font-medium`}>
              <Link href={reviewHref[b.id]} className="flex items-center gap-2 font-semibold text-slate-900 hover:text-teal-700">
                <Logo id={b.id} />
                <span className="leading-tight">{b.name}</span>
              </Link>
              {profil[b.id] && <span className="mt-1 block text-xs font-normal leading-snug text-slate-500">{profil[b.id]}</span>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="tabular-nums">
        {RADKY.map((r, i) => (
          <tr key={r.nazev} className={i ? 'border-t border-slate-100' : undefined}>
            <th scope="row" className="px-4 py-3 text-left align-top font-medium leading-snug text-slate-700">
              {r.tip ? <TipZaTextem text={r.nazev} tip={r.tip} /> : r.nazev}
            </th>
            {brokeri.map((b) => (
              <td key={b.id} data-broker={b.id} className="px-3 py-3 align-top"><Bunka h={r.hodnota(b)} /></td>
            ))}
          </tr>
        ))}
        <tr className="border-t border-slate-100 bg-slate-50">
          <th scope="row" className="rounded-bl-xl px-4 py-3"><span className="sr-only">Recenze</span></th>
          {brokeri.map((b, i) => (
            <td key={b.id} className={`px-3 py-3 ${i === brokeri.length - 1 ? 'rounded-br-xl' : ''}`}>
              <Link href={reviewHref[b.id]} className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-teal-700 hover:text-teal-800">
                Recenze <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

/** Mobil (< md): dva brokeři vedle sebe, výběr nahoře; výchozí první dva abecedně. */
function DvaBrokeri({ profil }: { profil: Record<string, string> }) {
  const brokeri = brokeriAbecedne;
  // Výchozí dvojice = první dva abecedně (neutrálně; dřív XTB vs Trading 212 = nejvyšší skóre, zrušeno 19. 10. 2026).
  const [a, setA] = useState(brokeri[0].id);
  const [b, setB] = useState(brokeri[1].id);
  const najdi = (id: string) => brokeri.find((x) => x.id === id) ?? brokeri[0];
  const vybrat = (strana: 'a' | 'b', id: string) => {
    // Stejný broker na obou stranách nedává smysl → strany prohodit.
    if (strana === 'a') { if (id === b) setB(a); setA(id); } else { if (id === a) setA(b); setB(id); }
  };
  const dva = [najdi(a), najdi(b)];
  return (
    <div className="md:hidden">
      <div className="grid grid-cols-2 gap-2 border-b border-slate-100 p-3">
        {(['a', 'b'] as const).map((strana, i) => (
          <label key={strana} className="block min-w-0">
            <span className="mb-1 block text-xs font-medium text-slate-500">{i === 0 ? 'Broker A' : 'Broker B'}</span>
            <select
              value={strana === 'a' ? a : b}
              onChange={(e) => vybrat(strana, e.target.value)}
              className="vyber h-11 w-full rounded-lg border border-slate-300 bg-white pl-3 text-sm font-medium text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            >
              {brokeri.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </label>
        ))}
      </div>
      {/* Záhlaví dvojice drží při scrollu (top-14 = pod hlavičkou webu) */}
      <div className="sticky top-14 z-20 grid grid-cols-2 gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2.5">
        {dva.map((x) => (
          <Link key={x.id} href={reviewHref[x.id]} className="min-w-0">
            <span className="flex items-center gap-2 text-sm font-semibold leading-tight text-slate-900"><Logo id={x.id} /><span className="min-w-0">{x.name}</span></span>
            {profil[x.id] && <span className="mt-1 block text-[11px] leading-snug text-slate-500">{profil[x.id]}</span>}
          </Link>
        ))}
      </div>
      <dl className="divide-y divide-slate-100 text-[13px] tabular-nums">
        {RADKY.map((r) => (
          <div key={r.nazev} className="px-3 py-2.5">
            <dt className="text-xs font-medium text-slate-500">{r.tip ? <TipZaTextem text={r.nazev} tip={r.tip} /> : r.nazev}</dt>
            <dd className="mt-1 grid grid-cols-2 gap-2">
              {dva.map((x) => <span key={x.id} className="min-w-0"><Bunka h={r.hodnota(x)} sData={false} /></span>)}
            </dd>
          </div>
        ))}
      </dl>
      <div className="grid grid-cols-2 gap-2 rounded-b-xl border-t border-slate-100 bg-slate-50 px-3 py-1.5">
        {dva.map((x) => (
          <Link key={x.id} href={reviewHref[x.id]} className="inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-teal-700">
            Recenze <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

/** profil = krátký štítek „pro koho“ ze sdíleného doporučení (předává server, ať se neliší od /kde-koupit). */
export default function SrovnaniBrokeruClient({ profil }: { profil: Record<string, string> }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <Tabulka profil={profil} />
      <DvaBrokeri profil={profil} />
    </div>
  );
}
