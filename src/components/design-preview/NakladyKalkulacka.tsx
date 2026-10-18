'use client';

/* „Kolik stojí nákup ETF“ – živý přepočet pro částku, kterou návštěvník zadá (revize kola 2: dřív jen dvě
   pevné částky). Výpočet = nakladNakupu z brokerData (ceník) + kurz ČNB s datem, předaný ze serveru.
   Pravidlo č. 1: co neznáme (směna Fio v kurzu banky, poplatky burzy IBKR), je „—“ a součet je „od“. */
import { useState } from 'react';
import Link from 'next/link';
import InfoTip from '@/components/design-preview/InfoTip';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import {
  brokeriPodleSkore, nakladNakupu, popisPoplatku, popisSmeny, type Kurzy,
} from '@/data/brokerData';

const kc = (v: number) =>
  `${v < 10 ? v.toLocaleString('cs-CZ', { maximumFractionDigits: 1 }) : Math.round(v).toLocaleString('cs-CZ')} Kč`;
const proc = (v: number) => `${v.toLocaleString('cs-CZ', { maximumFractionDigits: v < 1 ? 2 : 1 })} %`;
const datum = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });

const PRESETY = [1000, 2000, 5000, 10000];
const MIN = 100;
const MAX = 1_000_000;

function Logo({ id }: { id: string }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-slate-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/loga-brokeru/${id}-ikona.png`} alt="" width={64} height={64} loading="lazy" className="h-full w-full object-contain" />
    </span>
  );
}

const TIP_BURZA = 'K poplatku IBKR (plán Tiered) se připočítávají poplatky burzy a vypořádání. Jejich výši jsme na oficiálním ceníku nemohli ověřit, proto je nezapočítáváme – skutečný náklad je o ně vyšší.';
const TIP_FIO = 'Fio směnu korun na eura zvlášť neúčtuje, náklad je v kurzu banky (rozdíl nákupního a prodejního kurzu). Jeho výši ceník neuvádí, proto „—“ a součet „od“.';
const TIP_IBKR_SMENA = 'Na účtu IBKR můžete držet hotovost ve více měnách. Stačí směnit jednou větší částku a z ní nakupovat postupně – minimum 2 USD pak platíte jen jednou. Tabulka počítá směnu při každém nákupu.';

export default function NakladyKalkulacka({ kurzy, zvyraznit }: { kurzy: Kurzy | null; zvyraznit?: string }) {
  // Jen číslice; zobrazení s mezerami po tisících („2 000“).
  const [vstup, setVstup] = useState('2000');
  const castka = Number(vstup);
  const platna = Number.isFinite(castka) && castka >= MIN && castka <= MAX;

  if (!kurzy) {
    // Bez aktuálního kurzu ČNB žádné korunové částky (pravidlo č. 1) – žádný natvrdo zapsaný kurz.
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Aktuální kurz ČNB se nepodařilo načíst, proto náklady v korunách teď nepočítáme. Ceníky v EUR najdete
        v <Link href="/srovnani-brokeru" className="font-medium text-teal-700 underline underline-offset-2">srovnání brokerů</Link>.
      </p>
    );
  }

  const rady = brokeriPodleSkore
    .filter((b) => b.nakup)
    .map((b) => {
      const n = platna ? nakladNakupu(b, castka, kurzy) : null;
      // „od“ = část nákladu neznáme (Fio směna, IBKR burza) → číslo je spodní hranice.
      const castecne = !!n && (n.celkemKc == null || n.plusBurza);
      const spodni = n ? (n.celkemKc ?? n.provizeKc) : Infinity;
      return { b, n, castecne, spodni };
    })
    .sort((a, b) => a.spodni - b.spodni);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      {/* Vstup */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-end sm:justify-between">
        <label className="block">
          <span className="block text-sm font-medium text-slate-800">Kolik investujete měsíčně</span>
          <span className="mt-1.5 flex h-11 w-full items-center rounded-lg border border-slate-300 bg-white focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20 sm:w-48">
            <input
              type="text"
              inputMode="numeric"
              value={vstup ? Number(vstup).toLocaleString('cs-CZ') : ''}
              onChange={(e) => setVstup(e.target.value.replace(/\D/g, '').slice(0, 8))}
              aria-describedby="naklady-rozsah"
              className="h-full min-w-0 flex-1 rounded-lg bg-transparent px-3 text-base font-semibold tabular-nums text-slate-900 outline-none"
            />
            <span className="pr-3 text-sm text-slate-500">Kč</span>
          </span>
        </label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Rychlá volba částky">
          {PRESETY.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setVstup(String(p))}
              aria-pressed={castka === p}
              className={`h-9 rounded-full px-3 text-sm tabular-nums transition-colors ${castka === p ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {p.toLocaleString('cs-CZ')}
            </button>
          ))}
        </div>
      </div>
      {!platna && (
        <p id="naklady-rozsah" className="border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
          Zadejte částku od {MIN.toLocaleString('cs-CZ')} do {MAX.toLocaleString('cs-CZ')}&nbsp;Kč.
        </p>
      )}

      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs text-slate-500">
          <tr>
            <th className="px-3 py-2.5 font-medium sm:px-4">Broker</th>
            <th className="hidden px-3 py-2.5 font-medium md:table-cell">Poplatek za nákup</th>
            <th className="hidden px-3 py-2.5 font-medium md:table-cell">Směna CZK → EUR</th>
            <th className="px-3 py-2.5 text-right font-medium sm:px-4 md:text-left">Celkem<span className="hidden md:inline"> za nákup</span></th>
            <th className="hidden px-3 py-2.5 font-medium md:table-cell">Za rok (12 nákupů)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 tabular-nums">
          {rady.map(({ b, n, castecne }) => {
            const ibkr = !!b.nakup?.plusBurza;
            const smenaNezn = n ? n.smenaKc == null : false;
            const poplatekTxt = n ? `${ibkr ? 'od ' : ''}${kc(n.provizeKc)}` : '—';
            const smenaTxt = !n ? '—' : n.smenaKc == null ? '—' : kc(n.smenaKc);
            const celkem = n ? (n.celkemKc ?? n.provizeKc) : null;
            const od = castecne ? 'od ' : '';
            return (
              <tr key={b.id} data-broker={b.id} data-poplatek={popisPoplatku(b) ?? ''} data-smena={popisSmeny(b) ?? ''} className={b.id === zvyraznit ? 'bg-teal-50/60' : undefined}>
                <td className="px-3 py-3 align-top sm:px-4">
                  <Link href={reviewHref[b.id]} className="flex items-center gap-2 font-medium text-slate-900 hover:text-teal-700">
                    <Logo id={b.id} />
                    <span className="leading-tight">{b.name.replace('-', '‑')}</span>
                  </Link>
                  {/* Mobil: rozpis pod jménem (sloupce poplatek/směna jsou jen od md) */}
                  {n && (
                    <span className="mt-1 block pl-9 text-xs leading-snug text-slate-500 md:hidden">
                      poplatek {poplatekTxt} · směna {smenaTxt}
                      {ibkr && <span className="block"><InfoTip label={TIP_IBKR_SMENA}>směnu stačí udělat jednou</InfoTip></span>}
                    </span>
                  )}
                </td>
                <td className="hidden px-3 py-3 align-top md:table-cell">
                  <span className="block font-medium text-slate-800">
                    {ibkr ? <InfoTip label={TIP_BURZA}>{poplatekTxt}</InfoTip> : poplatekTxt}
                  </span>
                  <span className="block text-xs text-slate-400">ceník {popisPoplatku(b)}</span>
                </td>
                <td className="hidden px-3 py-3 align-top md:table-cell">
                  <span className="block font-medium text-slate-800">
                    {smenaNezn ? <InfoTip label={TIP_FIO}>—</InfoTip> : smenaTxt}
                  </span>
                  <span className="block text-xs text-slate-400">
                    {smenaNezn ? 'v kurzu banky' : <>ceník {popisSmeny(b)}</>}
                  </span>
                  {ibkr && <span className="mt-0.5 block text-xs text-slate-500"><InfoTip label={TIP_IBKR_SMENA}>stačí jednou za větší částku</InfoTip></span>}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right align-top sm:px-4 md:text-left">
                  <span className="block text-base font-semibold text-slate-900">
                    {celkem == null ? '—' : `${od}${kc(celkem)}`}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {celkem == null ? '' : `${od}${proc((celkem / castka) * 100)}`}<span className="hidden md:inline"> z částky</span>
                  </span>
                  <span className="block text-xs text-slate-500 md:hidden">{celkem == null ? '' : `ročně ${od}${kc(celkem * 12)}`}</span>
                </td>
                <td className="hidden px-3 py-3 align-top md:table-cell">
                  <span className="block font-medium text-slate-800">{celkem == null ? '—' : `${od}${kc(celkem * 12)}`}</span>
                  {castecne && <span className="block text-xs text-slate-400">{ibkr ? 'bez poplatků burzy' : 'bez nákladu směny'}</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="space-y-1 border-t border-slate-100 bg-slate-50/60 px-4 py-3 text-xs leading-relaxed text-slate-500">
        <p>
          Řazeno podle známých nákladů. „od“ = část nákladu neznáme (u Fio směnu v kurzu banky, u IBKR poplatky burzy), skutečná částka je vyšší.
        </p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>Kurz ČNB k {datum(kurzy.datum)}: 1&nbsp;EUR = {kurzy.eurCzk.toLocaleString('cs-CZ', { maximumFractionDigits: 3 })}&nbsp;Kč, 1&nbsp;USD = {kurzy.usdCzk.toLocaleString('cs-CZ', { maximumFractionDigits: 3 })}&nbsp;Kč</span>
          <InfoTip label="Jeden nákup evropského ETF na burze Xetra (v EUR) z korunového účtu: poplatek za nákup + směna CZK→EUR podle ceníku brokera. DEGIRO = fondy z výběru ETF Selection (ostatní 3 EUR). Nepočítáme roční poplatek DEGIRO za připojení k burze (až 2,5 EUR ročně) ani víkendovou přirážku Trading 212 (směna 0,5 %).">Jak počítáme</InfoTip>
        </p>
      </div>
    </div>
  );
}
