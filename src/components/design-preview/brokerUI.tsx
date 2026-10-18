/* Sdílené stavební prvky stránek o brokerech (/kde-koupit, /srovnani-brokeru, /recenze/[broker]).
 * Serverové komponenty – žádný 'use client' (InfoTip je klientský list, to nevadí).
 * Jeden zdroj doporučení i spočítaných nákladů, ať si stránky neodporují (revize 18. 10. 2026). */
import Link from 'next/link';
import { ArrowRight, ChevronDown, Sparkles, Coins, Layers, Globe, Landmark, Bot } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import { brokers, brokeriPodleSkore, nakladNakupu, provizeEur, type Kurzy } from '@/data/brokerData';
import { datumKurzu } from '@/lib/kurzCnb';
import type { Broker } from '@/types/broker/index';

export const najdiBrokera = (id: string) => brokers.find((b) => b.id === id)!;

/* ---------- Formátování ---------- */
const kc = (v: number) =>
  `${v < 10 ? v.toLocaleString('cs-CZ', { maximumFractionDigits: 1 }) : Math.round(v).toLocaleString('cs-CZ')} Kč`;
const proc = (v: number) => `${v.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} %`;
const eur = (v: number) => `${v.toLocaleString('cs-CZ', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 })} EUR`;

/* ---------- Logo (čtvercová ikona z public/loga-brokeru, stejný režim jako homepage) ---------- */
export function BrokerLogo({ id, size = 'md' }: { id: string; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'w-12 h-12 rounded-xl' : size === 'sm' ? 'w-6 h-6 rounded-md' : 'w-8 h-8 rounded-lg';
  return (
    <span className={`${cls} flex items-center justify-center shrink-0 overflow-hidden bg-white ring-1 ring-slate-200`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/loga-brokeru/${id}-ikona.png`} alt="" width={64} height={64} loading="lazy" className="w-full h-full object-contain" />
    </span>
  );
}

/* ---------- Skóre (jen brokeři; robo-poradce „—“) ---------- */
export function Skore({ b, className = '' }: { b: Broker; className?: string }) {
  if (b.rating == null) {
    return <span className={`tabular-nums text-slate-400 ${className}`} title="Robo-poradce je jiná kategorie – skóre brokerů se na něj nevztahuje">—</span>;
  }
  return (
    <span className={`tabular-nums font-bold text-slate-900 ${className}`} title={`Naše skóre ${b.rating} ze 100`}>
      {b.rating}<span className="text-xs font-medium text-slate-400">/100</span>
    </span>
  );
}

/* ---------- FAQ – jeden styl na všech stránkách o brokerech ---------- */
export function FaqSeznam({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[15px] font-medium text-slate-900 hover:bg-slate-50">
            <h3 className="font-medium">{f.q}</h3>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
          </summary>
          <p className="px-4 pb-4 text-sm leading-relaxed text-slate-600">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ---------- Doporučení podle profilu – JEDINÝ zdroj pro /kde-koupit i /srovnani-brokeru ---------- */
export interface Profil { id: string; icon: typeof Sparkles; profil: string; brokerId: string; proc: string }

/** Profily → jeden broker na profil. Částky v důvodech se počítají z ceníků (brokerData), ne natvrdo. */
/** Sazba směny CZK→EUR z ceníku (strukturovaně), jinak textový popis. */
const smena = (b: Broker) => b.nakup?.smena ? proc(b.nakup.smena.procento) : b.fxFee;

export function doporuceniProfily(kurzy: Kurzy | null): Profil[] {
  const t212 = najdiBrokera('trading212');
  const xtb = najdiBrokera('xtb');
  const degiro = najdiBrokera('degiro');
  // Malé částky: nejlevnější celkový nákup za 2 000 Kč (provize + směna) mezi brokery se známým součtem.
  let nejlevnejsi = t212;
  if (kurzy) {
    const znam = brokeriPodleSkore
      .map((b) => ({ b, n: nakladNakupu(b, 2000, kurzy) }))
      .filter((x) => x.n?.celkemKc != null && !x.n.plusBurza)
      .sort((a, b) => a.n!.celkemKc! - b.n!.celkemKc!);
    if (znam[0]) nejlevnejsi = znam[0].b;
  }
  // Větší nákupy: od jaké částky je pevný 1 EUR u DEGIRO levnější než směna 0,5 % u XTB.
  const zlom = kurzy && degiro.nakup && xtb.nakup?.smena?.procento
    ? Math.ceil((provizeEur(degiro.nakup, 1000) * kurzy.eurCzk) / (xtb.nakup.smena.procento / 100) / 100) * 100
    : null;
  return [
    { id: 'zacinam', icon: Sparkles, profil: 'Začínám a chci vše česky', brokerId: 'xtb', proc: `Nákup ETF bez provize, koupíte i část podílu, česká podpora v pracovní dny. Směna měny ${smena(xtb)}.` },
    { id: 'male-castky', icon: Coins, profil: 'Posílám malé částky', brokerId: nejlevnejsi.id, proc: `U nákupu za 2 000 Kč nejnižší celkový náklad – bez provize, směna ${smena(nejlevnejsi)}.${nejlevnejsi.czSupport ? '' : ' Podpora jen anglicky.'}` },
    { id: 'vetsi-castky', icon: Layers, profil: 'Nakupuji větší částky najednou', brokerId: 'degiro', proc: `Vybraná ETF za 1 EUR a směna CZK/EUR zdarma${zlom ? ` – od ${zlom.toLocaleString('cs-CZ')} Kč na nákup levnější než XTB` : ''}. Bez části podílu.` },
    { id: 'svet', icon: Globe, profil: 'Chci trhy celého světa', brokerId: 'ibkr', proc: `${najdiBrokera('ibkr').etfCount}, levná směna u větších částek. Minimum za pokyn prodraží malé nákupy.` },
    { id: 'banka', icon: Landmark, profil: 'Chci banku s pobočkou a české akcie', brokerId: 'fio', proc: 'Česká banka, vše česky, z českých dividend 15\u00a0%. Nákup zahraničních ETF je ale dražší.' },
  ];
}

export function ProfilKarty({ kurzy }: { kurzy: Kurzy | null }) {
  const portu = najdiBrokera('portu');
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {doporuceniProfily(kurzy).map((p) => {
        const b = najdiBrokera(p.brokerId);
        return (
          <Link key={p.id} href={reviewHref[b.id]} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal-300">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <p.icon className="h-4 w-4 text-teal-700" /> {p.profil}
            </span>
            <span className="mt-2.5 flex items-center gap-2.5">
              <BrokerLogo id={b.id} />
              <span className="font-semibold text-slate-900">{b.name}</span>
              <Skore b={b} className="ml-auto text-sm" />
            </span>
            <span className="mt-2 flex-1 text-sm leading-snug text-slate-600">{p.proc}</span>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 group-hover:text-teal-800">Recenze <ArrowRight className="h-4 w-4" /></span>
          </Link>
        );
      })}
      {/* Robo-poradce – jiná kategorie (spravuje portfolio za roční poplatek), bez skóre brokerů */}
      <Link href={reviewHref.portu} className="group flex flex-col rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition-colors hover:border-teal-300">
        <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Bot className="h-4 w-4 text-slate-500" /> Nechci nic vybírat
        </span>
        <span className="mt-2.5 flex items-center gap-2.5">
          <BrokerLogo id="portu" />
          <span className="font-semibold text-slate-900">{portu.name}</span>
          <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">robo-poradce</span>
        </span>
        <span className="mt-2 flex-1 text-sm leading-snug text-slate-600">
          Jiná kategorie než broker: portfolio sestaví a spravuje za vás za {portu.managementFee.replace(' (dle objemu a fixace)', '')}. Proto bez skóre brokerů.
        </span>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 group-hover:text-teal-800">Recenze <ArrowRight className="h-4 w-4" /></span>
      </Link>
    </div>
  );
}

/* ---------- Kolik stojí jeden nákup ETF (spočítané z ceníků) ---------- */
export const CASTKY_NAKUPU = [2000, 5000] as const;

function BunkaNakladu({ b, castka, kurzy }: { b: Broker; castka: number; kurzy: Kurzy }) {
  const n = nakladNakupu(b, castka, kurzy);
  if (!n) return <span className="text-slate-400">—</span>;
  const rozpis = `poplatek ${kc(n.provizeKc)} + směna ${n.smenaKc == null ? '—' : kc(n.smenaKc)}`;
  const celkem = n.celkemKc ?? n.provizeKc;
  const druhy = n.celkemKc == null ? '+ kurz banky' : `${n.plusBurza ? '+ burza · ' : ''}${proc((n.celkemKc / castka) * 100)}`;
  return (
    <span className="block leading-tight">
      <span className="block font-semibold text-slate-900">{kc(celkem)}</span>
      <span className="block text-xs text-slate-500 mt-0.5">{druhy}</span>
      <span className="hidden sm:block text-xs text-slate-400 mt-0.5">{rozpis}</span>
    </span>
  );
}

export function NakladyNakupu({ kurzy, zvyraznit }: { kurzy: Kurzy | null; zvyraznit?: string }) {
  const rady = brokeriPodleSkore.filter((b) => b.nakup);
  if (!kurzy) {
    // Pravidlo č. 1: bez aktuálního kurzu ČNB žádné korunové částky – jen ceník v EUR.
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Aktuální kurz ČNB se nepodařilo načíst, proto náklady v korunách teď neukazujeme. Ceníky v EUR najdete v{' '}
        <Link href="/srovnani-brokeru" className="font-medium underline underline-offset-2">detailním srovnání</Link>.
      </div>
    );
  }
  const serazene = [...rady].sort((a, b) => {
    const na = nakladNakupu(a, CASTKY_NAKUPU[0], kurzy), nb = nakladNakupu(b, CASTKY_NAKUPU[0], kurzy);
    const va = na?.celkemKc ?? (na ? na.provizeKc + 1e6 : 1e9), vb = nb?.celkemKc ?? (nb ? nb.provizeKc + 1e6 : 1e9);
    return va - vb;
  });
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs text-slate-500">
          <tr>
            <th className="px-3 py-2.5 font-medium sm:px-4">Broker</th>
            {CASTKY_NAKUPU.map((c) => (
              <th key={c} className="px-3 py-2.5 font-medium sm:px-4">Nákup za {c.toLocaleString('cs-CZ')}&nbsp;Kč</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 tabular-nums">
          {serazene.map((b) => (
            <tr key={b.id} className={b.id === zvyraznit ? 'bg-teal-50/60' : undefined}>
              <td className="px-3 py-3 align-top sm:px-4">
                <Link href={reviewHref[b.id]} className="flex items-center gap-2 font-medium text-slate-900 hover:text-teal-700">
                  <BrokerLogo id={b.id} size="sm" />
                  <span className="leading-tight">{b.name.replace('-', '\u2011')}</span>
                </Link>
              </td>
              {CASTKY_NAKUPU.map((c) => (
                <td key={c} className="px-3 py-3 align-top sm:px-4"><BunkaNakladu b={b} castka={c} kurzy={kurzy} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-xs text-slate-500">
        <span>Kurz ČNB k {datumKurzu(kurzy)}: 1 EUR = {kurzy.eurCzk.toLocaleString('cs-CZ', { maximumFractionDigits: 3 })} Kč</span>
        <InfoTip label={`Jeden nákup evropského ETF na burze Xetra (v EUR) z korunového účtu: poplatek za nákup + směna CZK→EUR podle ceníku. DEGIRO = fondy z výběru ETF Selection (ostatní 3 EUR). IBKR: minimum ${eur(1.25)} za pokyn a 2 USD za směnu, plus poplatky burzy. Fio směnu zvlášť neúčtuje, náklad je v kurzu banky – jeho výši ceník neuvádí. Nepočítáme roční poplatek DEGIRO za burzu ani víkendovou přirážku Trading 212.`}>Jak počítáme</InfoTip>
      </div>
    </div>
  );
}

/* ---------- Robo-poradce: samostatná karta (jiná kategorie) ---------- */
export function RoboKarta() {
  const portu = najdiBrokera('portu');
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-4 sm:flex-row sm:items-center sm:gap-5">
      <span className="flex items-center gap-3">
        <BrokerLogo id="portu" size="lg" />
        <span>
          <span className="flex items-center gap-2 font-semibold text-slate-900">{portu.name}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">robo-poradce – jiná kategorie</span>
          </span>
          <span className="block text-sm text-slate-600">Portfolio sestaví a spravuje za vás. Neplatíte za nákup, ale {portu.managementFee} z celé hodnoty.</span>
        </span>
      </span>
      <span className="text-xs text-slate-500 sm:ml-auto sm:max-w-[16rem]">Skóre brokerů na něj nepoužíváme – srovnávat ho s brokery ke svépomocnému nákupu by nebylo férové.</span>
      <Link href={reviewHref.portu} className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">Recenze <ArrowRight className="h-4 w-4" /></Link>
    </div>
  );
}
