'use client';

import { useMemo, useState } from 'react';
import { RADKU_TABULKY_VYCHOZI } from '@/lib/zebrickySouvisejici';
import Link from 'next/link';
import { ArrowRight, ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';
import EmitentLogo from '@/components/home/EmitentLogo';
import InfoTip from '@/components/design-preview/InfoTip';
import CompareButton from '@/components/design-preview/CompareButton';
import { CURRENCIES, useCurrency, type Currency } from '@/components/design-preview/currencyStore';
import { mer } from '@/lib/mereni';

/* Kompletní tabulka fondů žebříčku /nejlepsi-etf/[slug] (revize 18. 10. 2026: stránka slibovala
   „30 fondů“, ale ukazovala jen 3× top 5). Data připraví server (page.tsx), tady jen řazení,
   filtr typu a stránkování – žádný dotaz z prohlížeče.
   Pravidlo č. 1: výnos v Kč/USD bez hodnoty = „—“, NIKDY EUR místo něj (proto ne pickReturn,
   který na bázi EUR padá zpět).
   Kolo 5: plovoucí záhlaví (sticky top-14 – předek nesmí mít overflow), mobil i ve výchozím
   pohledu ukazuje výnos za 1 rok, ovládání v jedné řadě má jednu výšku a jeden aktivní styl. */

export interface RadekFondu {
  isin: string;
  nazev: string;
  ticker: string | null;
  /** Emitent (fund_provider) – monogram, když nemáme logo (Ossiam…). */
  emitent: string | null;
  /** Rok vzniku fondu (z inception_date), null = neznámý. */
  rok: number | null;
  ter: number | null;
  velikost: number | null;
  /** Výnosy podle měny – bez fallbacku mezi měnami. */
  r1: Record<Currency, number | null>;
  r3: Record<Currency, number | null>;
  typ: 'acc' | 'dist' | null;
  /** Měna zajištění („EUR“, „CHF“…), „ano“ když měna není poznat, null = nezajištěná třída. */
  zajisteni: string | null;
  /** Den výnosů fondu („16. 10. 2026“) jen když se liší od „Data k …“ žebříčku (zpožděná řada u zdroje,
   *  src/lib/datumVynosu.ts); jinak chybí. */
  vynosyK?: string;
  /** Švýcarský fond (sídlo CH) – štítek „sídlo CH – ověřte dostupnost u brokera“ (SEO audit 6b). */
  svycarsky?: boolean;
  /** Typ produktu ve smíšených žebříčcích („ETC“, „peněžní trh“, „dluhopisy“…); null = akcie / neukazovat. */
  druh?: string | null;
}

type Klic = 'size' | 'ter' | 'r1' | 'r3';
const RAZENI: { id: Klic; label: string; mobil: string; kratce: string }[] = [
  { id: 'size', label: 'Největší', mobil: 'Největší', kratce: 'velikost fondu' },
  { id: 'ter', label: 'Nejlevnější', mobil: 'Nejlevnější', kratce: 'poplatek ročně' },
  { id: 'r1', label: 'Výnos 1 rok', mobil: 'Výnos 1 r.', kratce: 'výnos za 12 měs.' },
  { id: 'r3', label: 'Výnos 3 roky', mobil: 'Výnos 3 r.', kratce: 'výnos za 3 roky' },
];
// Počet řádků ve výchozím pohledu – sdílený se žebříčkem (vypisuje velké fondy, které tabulka hned neukáže).
const KROK = RADKU_TABULKY_VYCHOZI;

const NB = ' ';
const cz = (v: number, d = 1) => v.toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : v < 0 ? '−' : ''}${cz(Math.abs(v))}${NB}%`);
const terF = (v: number | null) => (v == null ? '—' : `${cz(v, 2)}${NB}%`);
const vel = (v: number | null) => (v == null ? '—' : v >= 1000 ? `${cz(v / 1000)}${NB}mld.${NB}€` : `${Math.round(v)}${NB}mil.${NB}€`);
const barva = (v: number | null) => (v == null ? 'text-slate-400' : v >= 0 ? 'text-emerald-700' : 'text-red-700');
const n0 = (n: number) => n.toLocaleString('cs-CZ');
/** Skloňování „fond“ (1 fond, 2–4 fondy, 5+ fondů). */
const fondu = (n: number) => (n === 1 ? 'fond' : n >= 2 && n <= 4 ? 'fondy' : 'fondů');
/** „akumulační“ / „akumulačních“ podle počtu (1–4 vs. 5+). */
const typSlovo = (typ: 'vse' | 'acc' | 'dist', n: number) =>
  typ === 'vse' ? '' : `${typ === 'acc' ? 'akumulační' : 'distribuční'}${n >= 5 || n === 0 ? 'ch' : ''} `;
const curText: Record<Currency, string> = { CZK: 'v Kč', EUR: 'v EUR', USD: 'v USD' };

const TIP_ZAJISTENI = 'Měnově zajištěná třída je verze stejného fondu, která za poplatek tlumí výkyvy kurzu (např. dolaru vůči euru). Její výnos se proto liší od nezajištěné třídy – ve výchozím pohledu ji neukazujeme, aby se v jednom sloupci nemíchaly různé měny.';

/** Přepínač – jedna výška (mobil 44 px, desktop 40 px) a jeden aktivní styl pro všechny přepínače v řadě. */
function Prepinac<T extends string>({ label, moznosti, hodnota, onChange, mrizka }: {
  label: string;
  moznosti: readonly (readonly [T, string, string?])[];
  hodnota: T;
  onChange: (v: T) => void;
  /** Roztáhnout na celou šířku (mobil: řazení ve 4 stejných sloupcích). */
  mrizka?: boolean;
}) {
  return (
    <div role="group" aria-label={label}
      className={`${mrizka ? 'grid w-full sm:inline-flex sm:w-auto' : 'inline-flex'} h-11 sm:h-10 gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5`}
      style={mrizka ? { gridTemplateColumns: `repeat(${moznosti.length}, minmax(0, 1fr))` } : undefined}>
      {moznosti.map(([id, l, m]) => (
        <button key={id} type="button" aria-pressed={hodnota === id} onClick={() => onChange(id)}
          className={`h-full rounded-md px-2 sm:px-3 text-[13px] sm:text-sm font-medium leading-tight tabular-nums transition-colors ${hodnota === id ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
          {m ? <><span className="sm:hidden">{m}</span><span className="hidden sm:inline">{l}</span></> : l}
        </button>
      ))}
    </div>
  );
}

export default function TabulkaFondu({
  radky, celkem, vychozi = 'size', datum, srovnavac, nadpisId, prah,
}: {
  /** id nadpisu tabulky (aria-labelledby sekce) – nadpis je tady, protože počet závisí na filtrech. */
  nadpisId?: string;
  radky: RadekFondu[];
  /** Kolik fondů do žebříčku patří celkem (může být víc, než kolik posíláme). */
  celkem: number;
  vychozi?: Klic;
  /** „18. 10. 2026“ – k jakému dni platí výnosy (do popisků sloupců). */
  datum: string;
  srovnavac: { href: string; text: string };
  /** Práh velikosti žebříčku v mil. € (do vysvětlivky u velkých kategorií). */
  prah?: number;
}) {
  const [cur, setCur] = useCurrency();
  const [klic, setKlic] = useState<Klic>(vychozi);
  const [vzestupne, setVzestupne] = useState(vychozi === 'ter');
  const [typ, setTyp] = useState<'vse' | 'acc' | 'dist'>('vse');
  // Výchozí: zajištěné třídy skryté – míchaly by výnosy v Kč s jinou měnou (revize kola 2). Přepínač zůstává.
  const [bezZajisteni, setBezZajisteni] = useState(true);
  const [pocet, setPocet] = useState(KROK);

  const maOba = radky.some((r) => r.typ === 'acc') && radky.some((r) => r.typ === 'dist');

  const r1 = (r: RadekFondu) => r.r1[cur];
  const r3 = (r: RadekFondu) => r.r3[cur];
  const hodnota = (r: RadekFondu, k: Klic) =>
    k === 'size' ? r.velikost : k === 'ter' ? (r.ter != null && r.ter > 0 ? r.ter : null) : k === 'r1' ? r1(r) : r3(r);

  const vyber = useMemo(() => {
    const f = radky.filter((r) => (typ === 'vse' || r.typ === typ) && (!bezZajisteni || !r.zajisteni));
    // Bez hodnoty vždy na konec (nezávisle na směru) – „—“ nesmí vyhrát řazení.
    // Při shodě TER akumulační třída, pak větší fond – stejné pravidlo jako karta „Nejnižší poplatek“ a homepage (src/lib/trhy.ts).
    return [...f].sort((a, b) => {
      const x = hodnota(a, klic), y = hodnota(b, klic);
      if (x == null && y == null) return (b.velikost ?? 0) - (a.velikost ?? 0);
      if (x == null) return 1;
      if (y == null) return -1;
      return (vzestupne ? x - y : y - x)
        || (klic === 'ter' ? Number(b.typ === 'acc') - Number(a.typ === 'acc') : 0)
        || (b.velikost ?? 0) - (a.velikost ?? 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radky, typ, bezZajisteni, klic, vzestupne, cur]);

  const radit = (k: Klic, zHlavicky = false) => {
    if (zHlavicky && k === klic) setVzestupne((v) => !v);
    else { setKlic(k); setVzestupne(k === 'ter'); }
    setPocet(KROK);
    mer('zalozka', { s: 'tabulka', c: k });
  };

  // Kolo 6: počty JEDNOU větou („Ukazujeme 300 největších z 2 256 fondů nad 100 mil. €, bez 13 měnově zajištěných
  // tříd“) – dřív nadpis „287 fondů bez měnového zajištění“ + druhý řádek „300 největších z 2 256…“.
  const castecne = celkem > radky.length;
  const zajisteneVTypu = radky.filter((r) => r.zajisteni && (typ === 'vse' || r.typ === typ)).length;
  const skrytoZajistenych = bezZajisteni ? zajisteneVTypu : 0;
  const nadpis = 'Fondy v žebříčku';
  // SEO audit 6b: dřív „Ukazujeme 300 největších z 813 fondů, bez 64 zajištěných“ – ukázalo se ale 236 řádků.
  // Teď vždy skutečný počet řádků: „Ukazujeme 236 z 300 největších fondů (celkem 813 nad 50 mil. €); 64 … skrýváme“.
  const celkemText = `celkem ${n0(celkem)}${prah ? ` nad ${prah}${NB}mil.${NB}€` : ''}`;
  const zCeho = castecne
    ? `${n0(radky.length)} největších fondů (${celkemText})`
    : `${n0(celkem)} ${celkem === 1 ? 'fondu' : 'fondů'}`;
  const veta = castecne
    ? (vyber.length === radky.length ? `Ukazujeme ${zCeho}` : `Ukazujeme ${n0(vyber.length)} ${typSlovo(typ, vyber.length)}z ${zCeho}`)
    : typ === 'vse' && skrytoZajistenych === 0
      ? `Ukazujeme ${celkem === 1 ? 'jediný fond' : `všech ${n0(celkem)} ${fondu(celkem)}`}`
      : `Ukazujeme ${n0(vyber.length)} ${typSlovo(typ, vyber.length)}z ${zCeho}`;

  const zobrazene = vyber.slice(0, pocet);
  const zbyva = vyber.length - zobrazene.length;

  // Mobil: dvě čísla nad sebou – hlavní podle řazení a výnos za 1 rok (USP: výnos v Kč i ve výchozím pohledu).
  const mobilVedlejsi: Klic = klic === 'r1' ? 'size' : 'r1';
  const popisSloupce = (k: Klic) => (k === 'size' ? 'Velikost' : k === 'ter' ? 'TER' : k === 'r1' ? `1 rok ${curText[cur]}` : `3 roky ${curText[cur]}`);
  const textHodnoty = (k: Klic, v: number | null) => (k === 'size' ? vel(v) : k === 'ter' ? terF(v) : pct(v));

  // Řadicí hlavička: tlačítko a vysvětlivka vedle sebe (InfoTip je tlačítko – nesmí být uvnitř jiného).
  const Hlavicka = ({ k, tip, children }: { k: Klic; tip?: string; children: React.ReactNode }) => (
    <span className="inline-flex items-center justify-end gap-1">
      <button type="button" onClick={() => radit(k, true)} className={`inline-flex items-center gap-1 hover:text-slate-900 ${klic === k ? 'text-slate-900 font-semibold' : ''}`}
        aria-label={`Řadit podle: ${RAZENI.find((r) => r.id === k)!.kratce}`}>
        {children}
        {klic === k && (vzestupne ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
      </button>
      {tip && <InfoTip label={tip}>{null}</InfoTip>}
    </span>
  );

  const zmenZajisteni = (skryt: boolean) => { setBezZajisteni(skryt); setPocet(KROK); };

  return (
    <div>
      <h2 id={nadpisId} className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">{nadpis}</h2>
      <p className="mt-1 mb-3 text-sm text-slate-500 leading-relaxed" data-veta-pocty>
        {veta}
        {zajisteneVTypu > 0 ? (bezZajisteni
          ? <>; {n0(skrytoZajistenych)}{NB}{skrytoZajistenych === 1 ? 'měnově zajištěnou třídu' : skrytoZajistenych <= 4 ? 'měnově zajištěné třídy' : 'měnově zajištěných tříd'} skrýváme{' '}
              <InfoTip label={TIP_ZAJISTENI}>{null}</InfoTip>{' · '}
              <button type="button" onClick={() => zmenZajisteni(false)} className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800">zobrazit je</button></>
          : <>, včetně {n0(zajisteneVTypu)}{NB}měnově {zajisteneVTypu === 1 ? 'zajištěné třídy' : 'zajištěných tříd'}{' '}
              <InfoTip label={TIP_ZAJISTENI}>{null}</InfoTip>{' · '}
              <button type="button" onClick={() => zmenZajisteni(true)} className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800">skrýt je</button></>)
          : '.'}
      </p>

      {/* Ovládání: řazení, typ, měna – jedna výška, jeden aktivní styl */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <Prepinac label="Řazení fondů" mrizka hodnota={klic} onChange={(k) => radit(k)}
          moznosti={RAZENI.map((r) => [r.id, r.label, r.mobil] as const)} />
        {/* Mobil: druhá řada přes celou šířku (kolo 6: nerovný pravý okraj vůči řazení nad ní). */}
        <div className={`grid gap-2 sm:flex sm:flex-wrap sm:items-center ${maOba ? 'grid-cols-[minmax(0,3fr)_minmax(0,2fr)]' : 'grid-cols-1'}`}>
          {maOba && (
            <Prepinac label="Typ fondu" mrizka hodnota={typ} onChange={(t) => { setTyp(t); setPocet(KROK); }}
              moznosti={[['vse', 'Vše'], ['acc', 'Akumulační', 'Akum.'], ['dist', 'Distribuční', 'Dist.']] as const} />
          )}
          <span className="flex min-w-0 items-center gap-2 sm:inline-flex">
            <span className="hidden sm:inline text-xs font-medium text-slate-500">Výnosy v</span>
            <Prepinac label="Měna výnosů" mrizka hodnota={cur} onChange={setCur} moznosti={CURRENCIES.map((c) => [c, c] as const)} />
          </span>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-slate-200 bg-white">
        {/* Plovoucí záhlaví sloupců: sticky pod hlavičkou webu (h-14). Předci tabulky nesmí mít overflow. */}
        <div className="sticky top-14 z-20 rounded-t-2xl border-b border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]">
          {/* Desktop */}
          <div className="hidden md:grid md:grid-cols-[2rem_minmax(0,1fr)_5.5rem_7rem_6.5rem_6.5rem_6.5rem] gap-4 px-5 py-3 text-xs font-medium text-slate-500">
            <span>#</span>
            <span>Fond</span>
            <span className="text-right"><Hlavicka k="ter" tip="TER = roční poplatek fondu, strhává se z jeho hodnoty. Swapové fondy mohou mít navíc swap poplatek – detail u fondu.">TER</Hlavicka></span>
            <span className="text-right"><Hlavicka k="size">Velikost</Hlavicka></span>
            <span className="text-right"><Hlavicka k="r1" tip={`Celkový výnos za posledních 12 měsíců ${curText[cur]}, k ${datum}. Minulý výnos nezaručuje budoucí.`}>1 rok</Hlavicka></span>
            <span className="text-right"><Hlavicka k="r3" tip={`Celkový (ne roční) výnos za poslední 3 roky ${curText[cur]}, k ${datum}. Mladší fondy ho nemají („—“).`}>3 roky</Hlavicka></span>
            <span className="sr-only">Porovnat</span>
          </div>
          {/* Mobil: co znamenají dvě čísla vpravo */}
          <div className="md:hidden flex items-end justify-between gap-3 px-4 py-2 text-[11px] font-medium leading-tight text-slate-500">
            <span>Fond</span>
            <span className="text-right">
              <span className="block text-slate-700">{popisSloupce(klic)}</span>
              <span className="block">{popisSloupce(mobilVedlejsi)}</span>
            </span>
          </div>
        </div>

        <ol className="divide-y divide-slate-100">
          {zobrazene.map((r, i) => {
            const hlavni = hodnota(r, klic);
            const vedl = hodnota(r, mobilVedlejsi);
            return (
              <li key={r.isin} className="relative grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[2rem_minmax(0,1fr)_5.5rem_7rem_6.5rem_6.5rem_6.5rem] gap-x-4 items-center px-4 md:px-5 py-2.5 hover:bg-slate-50/70">
                <span className="hidden md:block text-xs tabular-nums text-slate-400">{i + 1}</span>
                <Link href={`/etf/${r.isin}`} className="group min-w-0 flex items-center gap-2.5 min-h-11">
                  <EmitentLogo nazev={r.nazev} size={28} monogram={r.emitent} />
                  <span className="min-w-0 flex flex-col">
                    {/* Zkracuje se jen když se název opravdu nevejde (2 řádky), žádný pevný ořez. */}
                    <span className="text-[15px] md:text-sm font-medium leading-snug text-slate-900 group-hover:text-teal-800 group-hover:underline underline-offset-2 line-clamp-2">{r.nazev}</span>
                    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-500">
                      {/* Bez tickeru celý ISIN (useknutý „IE…ZB19“ působil jako rozbitý export) */}
                      <span className={r.ticker ? 'font-medium text-slate-600' : 'text-slate-500'}>{r.ticker ?? r.isin}</span>
                      {r.typ && <span>· {r.typ === 'acc' ? 'akumulační' : 'distribuční'}</span>}
                      {r.rok && <span>· od {r.rok}</span>}
                      {r.zajisteni && <span className="rounded bg-amber-50 px-1 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200">zajištěno{r.zajisteni !== 'ano' ? ` ${r.zajisteni}` : ''}</span>}
                      {r.vynosyK && <span data-vynosy-k={r.vynosyK} title="Zdroj má ceny tohoto fondu se zpožděním – jeho výnosy platí k jinému dni než ostatní." className="cursor-help rounded bg-amber-50 px-1 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200">výnosy k {r.vynosyK}</span>}
                      {r.druh && <span className="rounded bg-slate-100 px-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200">{r.druh}</span>}
                      {r.svycarsky && <span className="rounded bg-slate-100 px-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200" title="Fond se sídlem ve Švýcarsku (není UCITS) – část brokerů ho českým investorům nenabízí.">sídlo CH – ověřte dostupnost u brokera</span>}
                    </span>
                  </span>
                </Link>
                {/* Mobil: hlavní číslo podle řazení + výnos za 1 rok (při řazení podle 1 roku velikost) */}
                <span className="md:hidden text-right">
                  <span className={`block text-[15px] font-semibold tabular-nums whitespace-nowrap ${klic === 'r1' || klic === 'r3' ? barva(hlavni) : 'text-slate-900'}`}>{textHodnoty(klic, hlavni)}</span>
                  <span className={`block text-xs tabular-nums whitespace-nowrap ${mobilVedlejsi === 'r1' ? barva(vedl) : 'text-slate-500'}`}>{textHodnoty(mobilVedlejsi, vedl)}</span>
                </span>
                <span className={`hidden md:block text-right text-sm tabular-nums whitespace-nowrap ${klic === 'ter' ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{terF(r.ter)}</span>
                <span className={`hidden md:block text-right text-sm tabular-nums whitespace-nowrap ${klic === 'size' ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{vel(r.velikost)}</span>
                <span className={`hidden md:block text-right text-sm tabular-nums whitespace-nowrap ${barva(r1(r))} ${klic === 'r1' ? 'font-semibold' : ''}`}>{pct(r1(r))}</span>
                <span className={`hidden md:block text-right text-sm tabular-nums whitespace-nowrap ${barva(r3(r))} ${klic === 'r3' ? 'font-semibold' : ''}`}>{pct(r3(r))}</span>
                <span className="hidden md:flex justify-end"><CompareButton isin={r.isin} label={r.ticker ?? r.isin} variant="row" /></span>
              </li>
            );
          })}
          {zobrazene.length === 0 && (
            <li className="px-5 py-6 text-sm text-slate-500">Filtru neodpovídá žádný fond.</li>
          )}
        </ol>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        {zbyva > 0 ? (
          <button type="button" onClick={() => setPocet((p) => p + 40)} className="inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-teal-700 hover:text-teal-800">
            <ChevronDown className="w-4 h-4" /> Zobrazit další {Math.min(40, zbyva)} {zbyva > 40 ? `(zbývá ${zbyva})` : ''}
          </button>
        ) : <span />}
        <Link href={srovnavac.href} className="inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-teal-700 hover:text-teal-800">
          {srovnavac.text} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
