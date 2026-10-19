'use client';

/* „Kolik stojí nákup ETF“ – živý přepočet pro částku, kterou návštěvník zadá (revize kola 2: dřív jen dvě
   pevné částky). Výpočet = nakladNakupu / nakladRocne z brokerData (ceník) + kurz ČNB s datem, předaný ze serveru.
   Pravidlo č. 1: co neznáme (směna Fio v kurzu banky, poplatky burzy IBKR), je „—“ a součet je „od“.
   Kolo 5: roční náklad konzistentní s texty (IBKR směna jednou za rok, DEGIRO ETF Selection vs ostatní ETF),
   rychlé volby částky hned u pole, štítek „nejlevnější“ podle zadané částky. */
import { useState } from 'react';
import Link from 'next/link';
import InfoTip from '@/components/design-preview/InfoTip';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import { useFond } from '@/components/design-preview/FondKontext';
import { TipZaTextem } from '@/components/design-preview/brokerUI';
import {
  brokeriPodleSkore, nakladNakupu, nakladRocne, popisPoplatku, popisSmeny, type Kurzy,
} from '@/data/brokerData';

const NB = ' ';
const kc = (v: number) =>
  `${v < 10 ? v.toLocaleString('cs-CZ', { maximumFractionDigits: 1 }) : Math.round(v).toLocaleString('cs-CZ')}${NB}Kč`;
const proc = (v: number) => `${v.toLocaleString('cs-CZ', { maximumFractionDigits: v < 1 ? 2 : 1 })}${NB}%`;
const datum = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });

const PRESETY = [1000, 2000, 5000, 10000, 50000];
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
const TIP_IBKR_SMENA = 'Na účtu IBKR můžete držet hotovost ve více měnách. Stačí směnit jednou větší částku a z ní nakupovat postupně – minimum 2 USD pak platíte jen jednou. Za jeden nákup počítáme směnu pokaždé, v ročním součtu jen jednou (celá roční částka najednou).';
const TIP_DEGIRO_FOND = 'U DEGIRO záleží, zda je fond ve výběru ETF Selection: pak nákup stojí 1 EUR a bez ročního poplatku za burzu, jinak 3 EUR a k tomu až 2,5 EUR ročně za každou zahraniční burzu (nejvýš 0,25 % hodnoty účtu). Seznam se mění a ověřený ho nemáme – podívejte se v aplikaci DEGIRO.';
const TIP_DEGIRO = 'ETF Selection = výběr fondů DEGIRO za 1 EUR a bez ročního poplatku za připojení k burze. Ostatní ETF stojí 3 EUR za nákup a k tomu až 2,5 EUR ročně za každou zahraniční burzu (nejvýš 0,25 % hodnoty účtu). Zda je váš fond ve výběru, ověřte v aplikaci DEGIRO.';

export default function NakladyKalkulacka({ kurzy, zvyraznit }: { kurzy: Kurzy | null; zvyraznit?: string }) {
  // Jen číslice; zobrazení s mezerami po tisících („2 000“).
  const [vstup, setVstup] = useState('2000');
  const castka = Number(vstup);
  const platna = Number.isFinite(castka) && castka >= MIN && castka <= MAX;
  // Přišel z detailu fondu: nevíme, zda je fond v ETF Selection DEGIRO → obě sazby rovnocenně, bez štítku „nejlevnější“
  // (kolo 5: dřív se počítalo za 1 EUR, jako by fond ve výběru byl).
  const fond = useFond();

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
      const r = platna ? nakladRocne(b, castka, kurzy) : null;
      // „od“ = část nákladu neznáme (Fio směna, IBKR burza) → číslo je spodní hranice.
      const castecne = !!n && (n.celkemKc == null || n.plusBurza);
      const spodni = n ? (n.celkemKc ?? n.provizeKc) : Infinity;
      // Fond z detailu + DEGIRO: nákup mimo ETF Selection (3 EUR + směna) jako rovnocenná druhá varianta.
      const dvoji = !!fond && b.nakup?.ostatniEtfEur != null && !!n && n.celkemKc != null
        ? { nakupKc: b.nakup.ostatniEtfEur * kurzy.eurCzk + (n.smenaKc ?? 0) }
        : null;
      return { b, n, r, castecne, spodni, dvoji };
    })
    .sort((a, b) => a.spodni - b.spodni);
  // „Nejlevnější“ jen když je první řádek přesně známý a levnější než spodní hranice všech „od“.
  const nejlevnejsiId = rady[0] && !rady[0].castecne && !rady[0].dvoji && rady[0].n ? rady[0].b.id : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      {/* Vstup + rychlé volby v jedné řadě hned u pole (kolo 4: volby byly na desktopu na opačném kraji). */}
      <div className="border-b border-slate-100 p-4">
        <label htmlFor="naklady-castka" className="block text-sm font-medium text-slate-800">Kolik investujete měsíčně</label>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="flex h-11 w-full items-center rounded-lg border border-slate-300 bg-white focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20 sm:w-44 md:h-10">
            <input
              id="naklady-castka"
              type="text"
              inputMode="numeric"
              value={vstup ? Number(vstup).toLocaleString('cs-CZ') : ''}
              onChange={(e) => setVstup(e.target.value.replace(/\D/g, '').slice(0, 8))}
              aria-describedby="naklady-rozsah"
              className="h-full min-w-0 flex-1 rounded-lg bg-transparent px-3 text-base font-semibold tabular-nums text-slate-900 outline-none"
            />
            <span className="pr-3 text-sm text-slate-500">Kč</span>
          </span>
          <div className="grid w-full grid-cols-5 gap-1.5 sm:flex sm:w-auto" role="group" aria-label="Rychlá volba částky">
            {PRESETY.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setVstup(String(p))}
                aria-pressed={castka === p}
                className={`h-11 rounded-lg px-1 text-sm sm:px-3 tabular-nums transition-colors md:h-10 ${castka === p ? 'bg-teal-700 font-medium text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                {p.toLocaleString('cs-CZ')}
              </button>
            ))}
          </div>
        </div>
      </div>
      {!platna && (
        <p id="naklady-rozsah" className="border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
          Zadejte částku od {MIN.toLocaleString('cs-CZ')} do {MAX.toLocaleString('cs-CZ')}{NB}Kč.
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
          {rady.map(({ b, n, r, castecne, dvoji }) => {
            const ibkr = !!b.nakup?.plusBurza;
            const smenaNezn = n ? n.smenaKc == null : false;
            const poplatekTxt = n ? `${ibkr ? 'od ' : ''}${kc(n.provizeKc)}` : '—';
            const smenaTxt = !n ? '—' : n.smenaKc == null ? '—' : kc(n.smenaKc);
            const celkem = n ? (n.celkemKc ?? n.provizeKc) : null;
            const rocne = r ? (r.celkemKc ?? r.provizeKc) : null;
            const od = castecne ? 'od ' : '';
            const ostatni = r?.ostatni;
            const nej = b.id === nejlevnejsiId;
            // Fond z detailu + DEGIRO: dvě rovnocenné varianty (ve výběru ETF Selection / mimo něj).
            const dPoplatek = dvoji && n ? `${kc(n.provizeKc)} / ${kc(b.nakup!.ostatniEtfEur! * kurzy.eurCzk)}` : null;
            // IBKR (kolo 5): nákup počítá směnu pokaždé, rok jen jednou – rozdíl napoprvé mátl → popisek přímo u čísla.
            const smenaJednou = !!r?.smenaJednou;
            return (
              <tr key={b.id} data-broker={b.id} data-poplatek={popisPoplatku(b) ?? ''} data-smena={popisSmeny(b) ?? ''} data-za-nakup={celkem == null ? '' : Math.round(celkem)} data-za-rok={rocne == null ? '' : Math.round(rocne)} className={b.id === zvyraznit ? 'bg-teal-50/60' : undefined}>
                <td className="px-3 py-3 align-top sm:px-4">
                  <Link href={reviewHref[b.id]} className="flex items-center gap-2 font-medium text-slate-900 hover:text-teal-700">
                    <Logo id={b.id} />
                    {/* Slovo se spojovníkem drží pohromadě přes nowrap, ne nedělitelným spojovníkem U+2011 –
                        ten písmo nemá a záložní font ho vykreslil jako „e - Broker“ (revize kola 5). */}
                    <span className="leading-tight">
                      {b.name.split(/(\S+-\S+)/).map((c, i) => (i % 2 ? <span key={i} className="whitespace-nowrap">{c}</span> : c))}
                    </span>
                  </Link>
                  {nej && <span className="ml-9 mt-1 inline-block rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-800 ring-1 ring-teal-200">nejlevnější pro {kc(castka)}</span>}
                  {/* Mobil: rozpis pod jménem (sloupce poplatek/směna jsou jen od md) */}
                  {n && (
                    <span className="mt-1 block pl-9 text-xs leading-snug text-slate-500 md:hidden">
                      {dvoji
                        ? <>poplatek {dPoplatek} · směna {smenaTxt}<span className="block"><TipZaTextem text="ve výběru ETF Selection / mimo něj" tip={TIP_DEGIRO_FOND} /></span></>
                        : <>poplatek {poplatekTxt}{ostatni ? ' (ETF Selection)' : ''} · směna {smenaTxt}</>}
                      {ibkr && <span className="block"><TipZaTextem text="směna u každého nákupu, ročně jen jednou" tip={TIP_IBKR_SMENA} /></span>}
                      {ostatni && !dvoji && <span className="block">ostatní ETF 3{NB}EUR, ročně {kc(ostatni.celkemKc)} + <InfoTip label={TIP_DEGIRO}>burza</InfoTip></span>}
                    </span>
                  )}
                </td>
                <td className="hidden px-3 py-3 align-top md:table-cell">
                  {dvoji ? (
                    <>
                      <span className="block font-medium text-slate-800">{dPoplatek}</span>
                      <span className="block text-xs text-slate-500"><TipZaTextem text="ve výběru ETF Selection / mimo něj" tip={TIP_DEGIRO_FOND} /></span>
                    </>
                  ) : (
                    <>
                      <span className="block font-medium text-slate-800">
                        {ibkr ? <InfoTip label={TIP_BURZA}>{poplatekTxt}</InfoTip> : poplatekTxt}
                      </span>
                      <span className="block text-xs text-slate-400">ceník {popisPoplatku(b)}{ostatni ? ' (ETF Selection)' : ''}</span>
                      {ostatni && <span className="mt-0.5 block text-xs text-slate-500"><InfoTip label={TIP_DEGIRO}>ostatní ETF 3{NB}EUR</InfoTip></span>}
                    </>
                  )}
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
                  {dvoji && n?.celkemKc != null ? (
                    <>
                      {/* Dvě rovnocenné varianty pod sebou (vedle sebe tabulka na mobilu přetékala). */}
                      <span className="block text-base font-semibold text-slate-900">{kc(n.celkemKc)} <span className="text-xs font-normal text-slate-500">ve výběru</span></span>
                      <span className="block text-base font-semibold text-slate-900">{kc(dvoji.nakupKc)} <span className="text-xs font-normal text-slate-500">mimo</span></span>
                      <span className="hidden text-xs text-slate-500 md:block">{proc((n.celkemKc / castka) * 100)} / {proc((dvoji.nakupKc / castka) * 100)} z částky</span>
                    </>
                  ) : (
                    <>
                      <span className="block text-base font-semibold text-slate-900">
                        {celkem == null ? '—' : `${od}${kc(celkem)}`}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {celkem == null ? '' : `${od}${proc((celkem / castka) * 100)}`}<span className="hidden md:inline"> z částky</span>
                      </span>
                      {smenaJednou && celkem != null && <span className="hidden text-xs text-slate-500 md:block">se směnou u každého nákupu</span>}
                    </>
                  )}
                  {/* whitespace-normal: buňka je nowrap kvůli číslu, poznámky se ale musí zalomit (jinak tabulka na mobilu přeteče) */}
                  <span className="block whitespace-normal text-xs text-slate-500 md:hidden">
                    {rocne == null ? '' : dvoji && ostatni ? `ročně ${kc(rocne)} / ${kc(ostatni.celkemKc)} + burza` : `ročně ${od}${kc(rocne)}`}
                  </span>
                </td>
                <td className="hidden px-3 py-3 align-top md:table-cell">
                  {dvoji && ostatni ? (
                    <>
                      <span className="block font-medium text-slate-800">{kc(rocne ?? 0)} / {kc(ostatni.celkemKc)}</span>
                      <span className="block text-xs leading-snug text-slate-500">mimo výběr + až {kc(ostatni.burzaMaxKc)} ročně za burzu</span>
                    </>
                  ) : (
                    <>
                      <span className="block font-medium text-slate-800">{rocne == null ? '—' : `${od}${kc(rocne)}`}</span>
                      {ostatni && <span className="block text-xs text-slate-400">ETF Selection</span>}
                      {smenaJednou && <span className="block text-xs text-slate-500">směna jen jednou za celý rok, bez poplatků burzy</span>}
                      {castecne && !smenaJednou && <span className="block text-xs text-slate-400">bez nákladu směny</span>}
                      {ostatni && (
                        <span className="mt-1 block text-xs leading-snug text-slate-500">
                          ostatní ETF {kc(ostatni.celkemKc)}<br />+ až {kc(ostatni.burzaMaxKc)} ročně za burzu
                        </span>
                      )}
                    </>
                  )}
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
        {fond && (
          <p>
            U DEGIRO dvě čísla: fond ve výběru ETF Selection / mimo něj. Který případ platí pro {fond.ticker ?? fond.isin}, uvidíte v aplikaci DEGIRO.
          </p>
        )}
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>Kurz ČNB k {datum(kurzy.datum)}: 1{NB}EUR = {kurzy.eurCzk.toLocaleString('cs-CZ', { maximumFractionDigits: 3 })}{NB}Kč, 1{NB}USD = {kurzy.usdCzk.toLocaleString('cs-CZ', { maximumFractionDigits: 3 })}{NB}Kč</span>
          <InfoTip label="Jeden nákup evropského ETF na burze Xetra (v EUR) z korunového účtu: poplatek za nákup + směna CZK→EUR podle ceníku brokera. Za rok = 12 nákupů; u IBKR se směna počítá jednou za celou roční částku. DEGIRO: ETF Selection za 1 EUR bez poplatku za burzu, ostatní ETF 3 EUR + až 2,5 EUR ročně za burzu (podle hodnoty účtu).">Jak počítáme</InfoTip>
        </p>
      </div>
    </div>
  );
}
