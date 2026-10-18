import Link from 'next/link';
import { Check, X, ArrowRight, MoveHorizontal } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import {
  brokeriPodleSkore, popisPoplatku, popisSmeny, popisMinVkladu, ochranaHotovosti, ochranaPapiru, nezlomit,
} from '@/data/brokerData';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import type { Broker } from '@/types/broker/index';

/* Srovnávací tabulka se GENERUJE z objektů brokerů (src/data/brokerData.ts) – jeden zdroj pravdy.
   Revize kola 2: jedna tabulka i na mobilu (pevný první sloupec + vodorovný posun, dřív 5 karet pod sebou),
   vysvětlivka ⓘ jen u názvu řádku (dřív ~40 ikon za hodnotami), jednotky jednotně (poplatek v EUR, směna v %,
   „bez minima“). Hodnota + krátká poznámka šedě pod ní. Poplatek a směna mají atributy data-poplatek/data-smena,
   které denní kontrola porovnává s /kde-koupit. Robo-poradce Portu v tabulce brokerů není (karta pod tabulkou).
   (Název souboru zůstal, komponenta už ale nepotřebuje klientský stav.) */

type Hodnota = { v: string; pozn?: string; ano?: boolean; data?: Record<string, string> };
interface Radek { nazev: string; tip?: string; hodnota: (b: Broker) => Hodnota }

const pct = (t: string) => t.replace(/(\d)\s?%/g, '$1 %');

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
    tip: 'Vaše ETF jsou vedená odděleně od majetku brokera. Garanční systém nastupuje, kdyby při krachu brokera chyběla.',
    hodnota: (b) => ochranaPapiru(b),
  },
  {
    nazev: 'Regulace',
    tip: 'Dohled nad entitou, se kterou uzavírá smlouvu český klient.',
    hodnota: (b) => {
      // Pro české klienty rozhoduje entita „pro CZ klienty“ (T212 = CySEC, ne FCA; IBKR = CBI).
      const casti = b.regulation.split(', ');
      const hlavni = casti.find((c) => c.includes('pro CZ')) ?? casti[0];
      const ostatni = casti.filter((c) => c !== hlavni).join(', ');
      return { v: hlavni.replace(' pro CZ klienty', '').replace(' (EU pro CZ klienty)', ''), pozn: ostatni || undefined };
    },
  },
  {
    nazev: 'Část podílu',
    tip: 'Koupě části podílu ETF za přesnou částku, třeba 2 000 Kč, i když jeden podíl stojí víc.',
    hodnota: (b) => ({ v: b.fractional ? 'Ano' : 'Ne', ano: b.fractional }),
  },
  {
    nazev: 'Česká podpora',
    hodnota: (b) => ({ v: b.czSupport ? 'Ano' : 'Ne', ano: b.czSupport, pozn: b.czSupport ? b.customerSupport : 'jen anglicky' }),
  },
  {
    nazev: 'Daň z CZ dividend',
    tip: 'Srážka z dividend českých akcií. U akumulačních ETF se vás přímo netýká.',
    hodnota: (b) => ({
      v: pct(b.czDividends.split(' (')[0]),
      pozn: b.czDividends.includes('(') ? pct(b.czDividends.split(' (')[1].replace(')', '')) : b.czDividends === '—' ? 'neověřeno' : undefined,
    }),
  },
  {
    nazev: 'Min. vklad',
    tip: 'Nejmenší částka, kterou musíte na účet poslat. Bez nákupu části podílu ale kupujete celé kusy – první nákup pak stojí aspoň cenu jednoho podílu.',
    hodnota: (b) => ({ v: popisMinVkladu(b) }),
  },
];

function Bunka({ h }: { h: Hodnota }) {
  const ikona = h.ano === true
    ? <Check className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} />
    : h.ano === false ? <X className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2.5} /> : null;
  return (
    <>
      <span className={`flex items-center gap-1 font-medium leading-snug ${h.ano === false ? 'text-slate-500' : 'text-slate-900'}`} {...h.data}>{ikona}{nezlomit(h.v)}</span>
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

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold tabular-nums text-slate-900">{score}<span className="text-xs font-medium text-slate-400">/100</span></span>
      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-teal-600" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

/* Pevný první sloupec: bílé pozadí (překrývá posunuté buňky) a jemný stín na pravé hraně. */
const PRVNI = 'sticky left-0 z-10 bg-white shadow-[1px_0_0_0_rgb(226_232_240)] md:shadow-none';

/** profil = krátký štítek „pro koho“ ze sdíleného doporučení (předává server, ať se neliší od /kde-koupit). */
export default function SrovnaniBrokeruClient({ profil }: { profil: Record<string, string> }) {
  const brokeri = brokeriPodleSkore;
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <p className="flex items-center gap-1.5 border-b border-slate-100 px-3 py-2 text-xs text-slate-500 md:hidden">
        <MoveHorizontal className="h-3.5 w-3.5" /> Tabulku posunete do strany, první sloupec zůstává.
      </p>
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full min-w-[47rem] table-fixed text-[13px] md:min-w-0 md:text-sm">
          <colgroup>
            <col className="w-[7rem] md:w-[13rem]" />
            {brokeri.map((b) => <col key={b.id} />)}
          </colgroup>
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th scope="col" className={`${PRVNI} !bg-slate-50 px-3 py-3 text-left align-bottom text-xs font-medium md:px-4`}>Parametr</th>
              {brokeri.map((b) => (
                <th key={b.id} scope="col" className="px-2.5 py-3 text-left align-bottom font-medium md:px-3">
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
            <tr className="border-t border-slate-100">
              <th scope="row" className={`${PRVNI} px-3 py-3 text-left font-medium text-slate-900 md:px-4`}>
                <InfoTip label="Redakční skóre 0–100 podle stejných šesti os pro všechny brokery – metodika na stránce Kde koupit ETF.">Skóre</InfoTip>
              </th>
              {brokeri.map((b) => <td key={b.id} className="px-3 py-3"><ScoreBar score={b.rating ?? 0} /></td>)}
            </tr>
            {RADKY.map((r) => (
              <tr key={r.nazev} className="border-t border-slate-100">
                <th scope="row" className={`${PRVNI} px-3 py-3 text-left align-top text-[13px] font-medium leading-snug text-slate-700 md:px-4 md:text-sm`}>
                  {/* Na mobilu se dlouhý název smí zalomit (InfoTip drží text na jednom řádku). */}
                  {r.tip ? <span className="whitespace-normal [&>span]:!whitespace-normal"><InfoTip label={r.tip}>{r.nazev}</InfoTip></span> : r.nazev}
                </th>
                {brokeri.map((b) => (
                  <td key={b.id} data-broker={b.id} className="px-2.5 py-3 align-top md:px-3"><Bunka h={r.hodnota(b)} /></td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-slate-100 bg-slate-50">
              <th scope="row" className={`${PRVNI} !bg-slate-50 px-3 py-3 md:px-4`}><span className="sr-only">Recenze</span></th>
              {brokeri.map((b) => (
                <td key={b.id} className="px-3 py-3">
                  <Link href={reviewHref[b.id]} className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-teal-700 hover:text-teal-800">
                    Recenze <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
