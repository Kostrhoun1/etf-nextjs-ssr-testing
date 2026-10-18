/* Sdílené stavební prvky stránek o brokerech (/kde-koupit, /srovnani-brokeru, /recenze/[broker]).
 * Serverové komponenty – žádný 'use client' (InfoTip je klientský list, to nevadí).
 * Jeden zdroj doporučení i spočítaných nákladů, ať si stránky neodporují (revize 18. 10. 2026). */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Sparkles, Coins, Layers, Globe, Landmark, Bot } from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import { brokers, brokeriPodleSkore, nakladNakupu, provizeEur, popisSmeny, type Kurzy } from '@/data/brokerData';
import type { Broker } from '@/types/broker/index';

export const najdiBrokera = (id: string) => brokers.find((b) => b.id === id)!;

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

/* ---------- Popisek s vysvětlivkou, který se smí zalomit ----------
   InfoTip drží text i ikonu v inline-flexu; s vynuceným zalomením se ikona odsunula na pravý kraj buňky
   (kolo 4). Tady se láme jen text a POSLEDNÍ slovo drží ikonu – ⓘ je vždy hned za textem. */
export function TipZaTextem({ text, tip }: { text: string; tip: string }) {
  const i = text.lastIndexOf(' ');
  return (
    <span>
      {i > 0 ? `${text.slice(0, i)} ` : ''}
      <InfoTip label={tip}>{i > 0 ? text.slice(i + 1) : text}</InfoTip>
    </span>
  );
}

/* ---------- Doporučení podle profilu – JEDINÝ zdroj pro /kde-koupit i /srovnani-brokeru ---------- */
export interface Profil { id: string; icon: typeof Sparkles; profil: string; brokerId: string; proc: string }

/** Profily → jeden broker na profil. Částky v důvodech se počítají z ceníků (brokerData), ne natvrdo.
 *  Sazba směny = sdílený popis z brokerData (stejné znění jako tabulky). */
const smena = (b: Broker) => popisSmeny(b) ?? b.fxFee;

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

/* ---------- Kolik stojí nákup ETF ----------
   Živý přepočet pro zadanou částku je klientská komponenta NakladyKalkulacka (/kde-koupit). Tady jen příkladová
   částka pro hero a recenze. */
export const CASTKA_PRIKLAD = 2000;

/* ---------- Autor – jeden box pro všechny stránky o brokerech ----------
   Fotka autora v repu není (public/ prohledáno 18. 10. 2026) → iniciály v kroužku jako na /o-nas, ne ikona. */
/** Iniciály autora – JEDINÁ podoba autora na stránkách o brokerech (kolo 4: v hero byla ikona, dole „TK“). */
export function AutorZnak({ tmavy = false, velky = false }: { tmavy?: boolean; velky?: boolean }) {
  const vel = velky ? 'h-10 w-10 text-sm' : 'h-5 w-5 text-[9px]';
  const barva = tmavy ? 'bg-white/10 text-slate-100 ring-1 ring-white/20' : 'bg-teal-50 text-teal-700';
  return <span aria-hidden className={`flex ${vel} shrink-0 items-center justify-center rounded-full font-bold tracking-tight ${barva}`}>TK</span>;
}

export function AutorBox({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <AutorZnak velky />
      <p className="text-sm leading-relaxed text-slate-600">
        <span className="block font-semibold text-slate-900">Tomáš Kostrhoun</span>
        {children ?? 'Brokery srovnáváme podle veřejných ceníků, bez provizí a placeného pořadí.'}{' '}
        <Link href="/o-nas" className="text-teal-700 hover:underline">O autorovi</Link>
      </p>
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
