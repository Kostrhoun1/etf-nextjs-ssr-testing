'use client';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, SlidersHorizontal, X, Loader2, Download, Info, ChevronDown, Check } from 'lucide-react';
import type { ScreenerRow, ScreenerOptions } from '@/lib/etf-data';
import { INDEXY_TRHU } from '@/lib/screenerTrhy';
import { nastavPocetFondu } from '@/components/design-preview/PocetFondu';
import { bezDiakritiky } from '@/lib/hledaniCz';
import CompareButton from '@/components/design-preview/CompareButton';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import { useCurrency, pickReturn, curLabel } from '@/components/design-preview/currencyStore';
import { COMPARE_MAX } from '@/components/design-preview/compareStore';
import { platnyTicker } from '@/lib/ticker';
import { anglickeTermy, skoreHledani } from '@/lib/hledaniCz';
import EmitentLogo from '@/components/home/EmitentLogo';
import { TipTlacitko } from '@/components/design-preview/InfoTip';
import { procenta, terText, velikostText } from '@/lib/formatSrovnavac';
import { RIZIKO_NESEDI_TEXT } from '@/lib/tridyFondu';
import { VYNOS_NEOVERENY_TEXT } from '@/lib/vynosNeovereny';
import { DIV_VYNOS_ACC, DIV_VYNOS_ACC_TIP } from '@/lib/dividendyFondu';

type SortKey = 'name' | 'ter' | 'size' | 'ytd' | 'r1' | 'r3' | 'r5' | 'div' | 'vol';
type SortDir = 'asc' | 'desc';

const num = (v: number | null | undefined) => (v == null || Number.isNaN(v) ? null : Number(v));
/* Jednotné formáty (src/lib/formatSrovnavac.ts): „−“, nezlomitelná mezera před %, „139,4 mld. €“.
   Velikost fondu je z justETF VŽDY v EUR (i u USD tříd) → vždy €. Viz PorovnaniTable. */
const ter = (v: number | null) => terText(v);
const pct = (v: number | null) => procenta(v, 1, true);
const pct1 = (v: number | null) => procenta(v, 1);
const money = (v: number | null) => velikostText(v);
/** Desetinná čárka i ve vstupech (TER, dividenda): „0,2“ i „0.2“ → 0.2. */
const desetinne = (v: string) => (v.trim() === '' ? null : parseFloat(v.replace(/\s/g, '').replace(',', '.')));
const barva = (v: number | null) => (v == null ? 'text-slate-400' : v >= 0 ? 'text-emerald-600' : 'text-red-600');
const distChip = (k: 'acc' | 'dist' | 'unknown') =>
  k === 'acc'
    ? { cls: 'bg-blue-50 text-blue-700', label: 'ACC', title: 'Akumulační – dividendy se reinvestují uvnitř fondu' }
    : k === 'dist'
    ? { cls: 'bg-emerald-50 text-emerald-700', label: 'DIST', title: 'Distribuční – dividendy se vyplácejí na účet' }
    : { cls: 'bg-slate-100 text-slate-500', label: '—', title: 'Typ výplaty neuvádí zdroj' };

const PAGE = 25;

/* Sloupec „Div.“: „—“ znamená „údaj chybí“. Akumulační fond dividendy nevyplácí (reinvestuje) – u něj
   „— (reinvestuje)“ jako na porovnání a detailu (jednotné názvy, kolo 5: dřív „reinv.“). */
function Dividenda({ e }: { e: ScreenerRow }) {
  const d = num(e.current_dividend_yield_numeric);
  if ((e.category === 'Komodity' || e.category === 'Krypto') && (d == null || d === 0)) {
    // Viditelná pomlčka (dřív jen sr-only → buňka vypadala prázdně, jako chyba). Vysvětlení v title.
    return <span title="Komoditní a kryptoměnové produkty dividendy nevyplácejí" className="cursor-help text-slate-400">—<span className="sr-only"> nevyplácí</span></span>;
  }
  if (e._dist === 'acc' && (d == null || d === 0)) {
    return <span title={DIV_VYNOS_ACC_TIP} className="whitespace-nowrap text-xs text-slate-500">{DIV_VYNOS_ACC}</span>;
  }
  return <>{pct1(d)}</>;
}

/* Kolísavost: „—“ i tam, kde údaj zdroje nesedí s jinou třídou téhož fondu (src/lib/tridyFondu.ts, pravidlo č. 1). */
function Kolisavost({ e }: { e: ScreenerRow }) {
  if (e._volX) return <span title={RIZIKO_NESEDI_TEXT} className="cursor-help text-slate-400 underline decoration-dotted decoration-slate-300 underline-offset-2">—<span className="sr-only"> ({RIZIKO_NESEDI_TEXT})</span></span>;
  return <>{pct1(num(e.volatility_1y))}</>;
}

/* Výnos za období: fond s výnosem mimo svůj trh (src/lib/vynosNeovereny.ts) = podtržená „—“ s vysvětlivkou
   jako na detailu fondu (pravidlo č. 1, kolo 6b). */
function vyn(e: ScreenerRow, v: number | null) {
  if (e._vynX) return <span title={VYNOS_NEOVERENY_TEXT} className="cursor-help text-slate-400 underline decoration-dotted decoration-slate-300 underline-offset-2">—<span className="sr-only"> ({VYNOS_NEOVERENY_TEXT})</span></span>;
  return pct(v);
}

/* Investiční styly (faktory). Data nemají sloupec „faktor", takže se rozpoznávají
   z názvu fondu (`blob` = název + ISIN + poskytovatel + tickery, lowercase).
   `exclude` řeší falešné shody – např. „Battery Value-Chain" NENÍ value fond. */
const FACTORS: { value: string; label: string; match: string[]; exclude?: string[] }[] = [
  { value: 'small_cap', label: 'Small cap', match: ['small cap', 'smallcap', 'small-cap', 'russell 2000'] },
  { value: 'value', label: 'Value', match: ['value'], exclude: ['value-chain', 'value chain'] },
  { value: 'growth', label: 'Growth', match: ['growth'] },
  { value: 'momentum', label: 'Momentum', match: ['momentum'] },
  { value: 'quality', label: 'Quality', match: ['quality'] },
  { value: 'min_vol', label: 'Nízká volatilita', match: ['minimum volatility', 'min vol', 'minimum vol', 'low volatility'] },
  { value: 'dividend', label: 'Dividendové', match: ['dividend', 'dividendenaristokraten'] },
  { value: 'multifactor', label: 'Multifaktorové', match: ['multifactor', 'multi-factor', 'multi factor'] },
];

/* Vysvětlivky sloupců – JEDEN zdroj pro tooltip v hlavičce tabulky (desktop) i legendu u karet (mobil).
   Dřív byly jen v atributu title → na dotyku nefungovaly (revize 18. 10. 2026). */
const VYSVETLIVKY: Record<string, string> = {
  ter: 'TER = roční poplatek za správu fondu. Strhává se automaticky z hodnoty fondu, nikam ho neplatíte. Čím nižší, tím lépe.',
  size: 'Kolik peněz fond spravuje (v eurech). Větší fond = obvykle nižší náklady na obchodování a menší riziko, že ho emitent zruší.',
  ytd: 'Výnos od 1. ledna letošního roku do data dat, přepočtený do zvolené měny.',
  r1: 'Výnos za posledních 12 měsíců, přepočtený do zvolené měny (v korunách včetně vlivu kurzu). Podtržená „—“ = výnos fondu se o víc než 1,5 p. b. liší od ostatních fondů na stejný trh (nejčastěji opožděná cena u zdroje dat), proto ho neukazujeme.',
  r3: 'Výnos za poslední 3 roky celkem (ne za rok), přepočtený do zvolené měny.',
  r5: 'Výnos za posledních 5 let celkem (ne za rok), přepočtený do zvolené měny. Řekne o fondu víc než jeden rok.',
  vol: 'Kolísavost (volatilita) za poslední rok, počítaná v eurech. Vyšší číslo = divočejší průběh, ne nutně horší fond. „—“ = údaj chybí nebo nesedí s jinou třídou téhož fondu.',
  div: 'Dividendový výnos = roční dividendy vůči ceně fondu. Akumulační (ACC) fondy dividendy nevyplácejí, reinvestují je uvnitř – proto „— (reinvestuje)“. Pomlčka = údaj chybí, u komodit a krypta = nevyplácí.',
  typ: 'Štítek u názvu: ACC (akumulační) dividendy reinvestuje uvnitř fondu, DIST (distribuční) je vyplácí na váš účet. „Zajištěno do EUR“ = třída fondu s měnovým zajištěním.',
};

const SORT_VOLBY: { v: string; label: string }[] = [
  { v: 'size:desc', label: 'Velikost fondu' },
  { v: 'ter:asc', label: 'Nejnižší poplatek (TER)' },
  { v: 'r1:desc', label: 'Výnos za 1 rok' },
  { v: 'r3:desc', label: 'Výnos za 3 roky' },
  { v: 'r5:desc', label: 'Výnos za 5 let' },
  { v: 'ytd:desc', label: 'Výnos letos (YTD)' },
  { v: 'div:desc', label: 'Dividendový výnos' },
  { v: 'vol:asc', label: 'Nejnižší kolísavost' },
  { v: 'name:asc', label: 'Název (A–Z)' },
];

const selCls = 'vyber h-11 md:h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none';

/* Prezentační obal pole filtru (label + input/select). Definováno na úrovni
   modulu, aby si input při každém překreslení zachoval stabilní identitu a
   neztrácel fokus po každém stisku klávesy. */
/* Vysvětlivky filtrů (kolo 5, 19. 10. 2026): začátečnice ve Filtrech nenašla ani jednu (i) – Value, Growth,
   Replikace, Domicil… nic neříkaly. Jedna lidská věta ke každé skupině; bublina TipTlacitko (drží se v okně). */
const TIPY_FILTRU: Record<string, string> = {
  'Region / země': 'Kam fond investuje – do oblasti (Evropa, rozvíjející se trhy) nebo do jedné země.',
  'Typ výplaty': 'Akumulační fond dividendy reinvestuje uvnitř fondu, distribuční je vyplácí na váš účet.',
  'Investiční styl': 'Fondy, které vybírají akcie podle jednoho rysu: Value = levné vůči zisku, Growth = rychle rostoucí, Momentum = v poslední době rostoucí, Quality = ziskové s nízkým dluhem, Small cap = malé firmy.',
  'Max. TER (%)': 'Nejvyšší roční poplatek fondu, který vám ještě nevadí – např. 0,20 %.',
  'Velikost fondu': 'Kolik peněz fond spravuje – větší fondy mívají nižší náklady na obchodování a menší riziko, že je emitent zruší.',
  'Měnové zajištění': 'Zajištěná třída za malý poplatek tlumí výkyvy kurzu (např. dolaru vůči euru) – do koruny ale nezajišťuje žádná.',
  'Min. dividenda (%)': 'Jen fondy, které za rok vyplatí na dividendách aspoň tolik procent z ceny podílu.',
  'Replikace': 'Fyzická = fond akcie z indexu opravdu drží; syntetická = výnos indexu mu dodává banka přes swap.',
  'Stáří fondu': 'Jak dlouho fond existuje – starší fond má delší a ověřenější historii výnosů.',
  'Měna fondu': 'Měna, ve které fond vede účetnictví; o kurzovém riziku rozhoduje hlavně to, do čeho fond investuje.',
  'Domicil fondu': 'Země, kde fond právně sídlí – fondy z Irska platí z amerických dividend nižší srážkovou daň.',
  'Poskytovatel (emitent)': 'Firma, která fond spravuje a vydává (iShares, Vanguard, Xtrackers…).',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const tip = TIPY_FILTRU[label];
  // S vysvětlivkou není obal <label> (tlačítko (i) by se stalo ovládacím prvkem popisku); pole mají aria-label.
  if (tip) {
    return (
      <div>
        <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">{label}<TipTlacitko obsah={tip} ariaLabel={`Co znamená ${label}`} maly /></span>
        {children}
      </div>
    );
  }
  return (
    <label className="block"><span className="block mb-1 text-xs font-medium text-slate-500">{label}</span>{children}</label>
  );
}

/* Vysvětlivka v hlavičce tabulky – sdílené řešení s InfoTip (bublina position: fixed v portálu,
   poloha z getBoundingClientRect, nikdy nepřeteče okno; hover, fokus, tap, Escape). Tabulka je
   v kontejneru s overflow-x-auto, který by běžný absolutní tooltip ořízl. */
function HeadTip({ k, label }: { k: string; label: string }) {
  return <TipTlacitko obsah={VYSVETLIVKY[k]} ariaLabel={`Co znamená ${label}`} maly />;
}

/* Skupiny sloupců (majitel 18. 10. 2026: „špatně se v tom čte“): svislá linka mezi skupinami Fond | parametry |
   výnosy | riziko a dividenda, výnosy jemně podbarvené (stejný tón jako jejich společný nadpis). */
const SKUPINA = 'border-l border-slate-200';
const VYNOSY = 'bg-teal-50/40';

/* Řaditelná hlavička sloupce (+ vysvětlivka vedle). Stav řazení dostává propy, aby mohla zůstat
   mimo tělo komponenty (stabilní identita = žádný zbytečný remount hlavičky). */
function SortH({ k, children, right, wide, rowSpan, tip, cls = '', sortKey, sortDir, toggleSort }: {
  k: SortKey; children: React.ReactNode; right?: boolean; wide?: boolean; rowSpan?: number; tip?: string; cls?: string;
  sortKey: SortKey; sortDir: SortDir; toggleSort: (k: SortKey) => void;
}) {
  return (
    <th rowSpan={rowSpan} aria-sort={sortKey === k ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'} className={`py-2 align-bottom font-medium whitespace-nowrap ${wide ? 'pl-3 pr-2 min-w-[17rem] w-[30%]' : 'px-2'} ${right ? 'text-right' : 'text-left'} ${cls}`}>
      <span className={`inline-flex items-center gap-0.5 ${right ? 'justify-end' : ''}`}>
        <button onClick={() => toggleSort(k)} aria-label={`Seřadit podle: ${typeof children === 'string' ? children : k}`} className={`inline-flex items-center gap-1 hover:text-teal-700 ${sortKey === k ? 'text-teal-700' : ''}`}>
          {children}
          {sortKey === k ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
        </button>
        {tip && <HeadTip k={tip} label={typeof children === 'string' ? children : tip} />}
      </span>
    </th>
  );
}

/* Zajištěná měnová třída – u useknutého názvu jinak nepoznáte, že „ACWI“ je EUR Hedged (test s uživatelem 18. 10. 2026). */
function HedgeChip({ h }: { h: string }) {
  if (!h || h === 'unhedged') return null;
  const mena = h.split('_')[0].toUpperCase();
  return <span className="rounded bg-sky-50 px-1 text-[10px] font-medium text-sky-800 whitespace-nowrap">{mena === 'OTHER' ? 'zajištěno' : `zajištěno do ${mena}`}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────
   VÝBĚR INDEXŮ (víc najednou). Revize 18. 10. 2026 (kolo 3): „S&P 500“ byl v nabídce 2× s jiným
   počtem (Celé trhy 33 × Populární indexy 73) a žebříček měl 58. Teď JEDNA položka na trh, obsah =
   PŘESNĚ výběr žebříčku (TRHY_SROVNAVACE v etf-data.ts) a přepínač „vč. měnově zajištěných tříd“
   (= filtr Měnové zajištění). Počty u položek = kolik fondů po kliknutí uvidíte (stejná páka
   a zajištění jako výsledek). Hodnota trhu = „trh:<id>“.
   ───────────────────────────────────────────────────────────────────────── */
interface PoctyNabidky { trh: (id: string) => number; index: (label: string, i: number, g: IndexOptionGroupLite) => number | undefined }
type IndexOptionGroupLite = ScreenerOptions['indexGroups'][number];

function IndexList({ options, vybrane, setVybrane, pocty, vcZajist, setVcZajist, kompakt = false, autoFocus = false }: {
  options: ScreenerOptions; vybrane: string[]; setVybrane: (v: string[]) => void; pocty: PoctyNabidky;
  vcZajist: boolean; setVcZajist: (v: boolean) => void; kompakt?: boolean; autoFocus?: boolean;
}) {
  const [hledat, setHledat] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (autoFocus) inputRef.current?.focus(); }, [autoFocus]);
  const h = hledat.trim().toLowerCase();
  const prepni = (v: string) => setVybrane(vybrane.includes(v) ? vybrane.filter((x) => x !== v) : [...vybrane, v]);
  const trhy = options.trhy.filter((t) => !h || `${t.label} ${t.popis}`.toLowerCase().includes(h));
  // Kompaktní režim (panel na mobilu): bez hledání jen trhy + populární + už vybrané – 200 položek
  // v posuvném panelu by se nedaly projít; ostatní indexy najde hledání.
  const skupiny = options.indexGroups
    .map((g) => ({ ...g, idx: g.options.map((o, i) => i).filter((i) => (h ? g.options[i].toLowerCase().includes(h) : !kompakt || g.heading === 'Populární indexy' || vybrane.includes(g.options[i]))) }))
    .filter((g) => g.idx.length > 0);
  const vsech = options.indexGroups.reduce((n, g) => n + g.options.length, 0);
  const Polozka = ({ v, label, note, count }: { v: string; label: string; note?: string; count?: number }) => {
    const on = vybrane.includes(v);
    return (
      <button type="button" role="menuitemcheckbox" aria-checked={on} onClick={() => prepni(v)}
        className={`w-full flex items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-slate-50 ${kompakt ? 'min-h-[44px] py-2.5' : ''} ${on ? 'text-teal-800' : count === 0 ? 'text-slate-400' : 'text-slate-700'}`}>
        <span className={`mt-0.5 flex items-center justify-center w-4 h-4 shrink-0 rounded border ${on ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 bg-white'}`}>{on && <Check className="w-3 h-3" />}</span>
        <span className="min-w-0 flex-1">
          <span className="block leading-snug">{label}</span>
          {note && <span className="block text-xs text-slate-500 leading-snug">{note}</span>}
        </span>
        {count != null && <span className="shrink-0 tabular-nums text-xs text-slate-400">{count.toLocaleString('cs-CZ')}</span>}
      </button>
    );
  };
  return (
    <div>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
        <input ref={inputRef} type="search" value={hledat} onChange={(e) => setHledat(e.target.value)} placeholder="Hledat index (např. ACWI, Russell)" aria-label="Hledat index"
          className={`w-full ${kompakt ? 'h-11 text-[15px]' : 'min-h-[38px] text-sm'} rounded-lg border border-slate-200 bg-white pl-8 pr-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none`} />
      </div>
      <div className={kompakt ? 'mt-2' : 'mt-2 max-h-[min(60vh,440px)] overflow-y-auto overscroll-contain pr-1'}>
        {trhy.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center justify-between gap-2 px-2 pt-1 pb-0.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Celé trhy · jako žebříčky</p>
              <label className={`inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer ${kompakt ? 'min-h-[44px]' : ''}`}>
                <input type="checkbox" checked={vcZajist} onChange={(e) => setVcZajist(e.target.checked)} className="w-3.5 h-3.5 rounded accent-teal-600" />
                vč. měnově zajištěných
              </label>
            </div>
            <p className="px-2 pb-1 text-[11px] leading-snug text-slate-400">Stejný výběr jako žebříčky: fondy od 100 mil. €, bez ESG, sektorových a jiných variant indexu.</p>
            {trhy.map((t) => <Polozka key={t.id} v={`trh:${t.id}`} label={t.label} note={t.popis} count={pocty.trh(t.id)} />)}
          </div>
        )}
        {skupiny.map((g) => (
          <div key={g.heading} className="mb-2">
            <p className="px-2 pt-1 pb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{g.heading}</p>
            {g.idx.map((i) => <Polozka key={g.options[i]} v={g.options[i]} label={g.options[i]} count={pocty.index(g.options[i], i, g)} />)}
          </div>
        ))}
        {trhy.length === 0 && skupiny.length === 0 && <p className="px-2 py-3 text-sm text-slate-500">Žádný index neodpovídá.</p>}
        {kompakt && !h && <p className="px-2 pt-1 text-xs text-slate-500">Ostatní indexy (celkem {vsech.toLocaleString("cs-CZ")}) najdete hledáním.</p>}
      </div>
    </div>
  );
}

function popisIndexu(v: string, options: ScreenerOptions): string {
  if (v.startsWith('trh:')) return options.trhy.find((t) => t.id === v.slice(4))?.label ?? v;
  return v;
}

function IndexPicker(props: { options: ScreenerOptions; vybrane: string[]; setVybrane: (v: string[]) => void; pocty: PoctyNabidky; vcZajist: boolean; setVcZajist: (v: boolean) => void }) {
  const { options, vybrane, setVybrane } = props;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [open]);
  const text = vybrane.length === 0 ? 'Všechny indexy' : vybrane.length === 1 ? popisIndexu(vybrane[0], options) : `${popisIndexu(vybrane[0], options)} +${vybrane.length - 1}`;
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu"
        className={`${selCls} inline-flex items-center justify-between gap-2 text-left ${vybrane.length ? 'border-teal-500 text-teal-800' : ''}`}>
        <span className="truncate"><span className="text-slate-400">Index: </span>{text}</span>
        <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-full z-30 mt-1 w-[23rem] rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl shadow-slate-900/10">
          <IndexList {...props} autoFocus />
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <button type="button" onClick={() => setVybrane([])} disabled={!vybrane.length} className="text-xs font-medium text-slate-500 hover:text-red-600 disabled:opacity-40">Zrušit výběr</button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800">Hotovo</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Hledání „sp500“ vrací 179 fondů s „S&P 500“ v názvu (i sektory, Equal Weight, ESG…). Když dotaz
   odpovídá celému trhu, nabídneme výběr trhu = žebříčku (revize 18. 10. 2026). Bez diakritiky. */
const TRH_Z_DOTAZU: [RegExp, string][] = [
  [/^(s ?& ?p|sp|snp)[ -]?500$/, 'sp500'],
  [/^msci[ -]?world$/, 'world'],
  [/^(nasdaq|nasdaq[ -]?100|ndx)$/, 'nasdaq'],
  [/^(svet|cely svet|all[ -]?world|ftse all[ -]?world|acwi|msci acwi)$/, 'svet'],
];

/* Krátký název fondu: bez „UCITS ETF…“ a koncové závorky – stejně jako žebříčky (nejlepsi-etf/[slug]).
   Typ výplaty a měnové zajištění, které se tím z názvu ztratí, nesou štítky vedle. */
const kratkyNazev = (n: string) => n.replace(/\s+UCITS\b.*$/i, '').replace(/\s+\([^()]*\)\s*$/, '').trim() || n;

/* Odvozené hodnoty (region/hedging/index/trh/fulltext) přicházejí PŘEDPOČÍTANÉ
   ze serveru (ScreenerRow._*), takže klient přes ~5 000 fondů nepouští žádné regexy. */
interface Enriched {
  e: ScreenerRow;
  blob: string;
}

export default function ScreenerUI({
  initialRows,
  total,
  options,
  dataDate = '',
}: {
  initialRows: ScreenerRow[];
  total: number;
  options: ScreenerOptions;
  /** Datum dat – jde do hlavičky exportovaného CSV, aby výstup šlo doložit. */
  dataDate?: string;
}) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [dist, setDist] = useState('all');
  const [region, setRegion] = useState('all');
  const [indexSel, setIndexSel] = useState<string[]>([]);
  const [repl, setRepl] = useState('all');
  const [currency, setCurrency] = useState('all');
  const [hedging, setHedging] = useState('all');
  const [factor, setFactor] = useState('all');
  const [leveraged, setLeveraged] = useState(false);
  const [terMax, setTerMax] = useState<string>('');
  const [sizeMin, setSizeMin] = useState<string>('');
  const [divMin, setDivMin] = useState<string>('');
  const [domicile, setDomicile] = useState('all');
  const [provider, setProvider] = useState('all');
  const [minAge, setMinAge] = useState('all');
  const [panel, setPanel] = useState(false);
  const [legenda, setLegenda] = useState(false);

  const [sortKey, setSortKey] = useState<SortKey>('size');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [shown, setShown] = useState(PAGE);
  const [cur] = useCurrency();
  const rootRef = useRef<HTMLDivElement>(null);
  // Konec tabulky (kolo 5): plovoucí hlavička na konci zakrývala poslední řádek a pod ní zbyl jeho proužek.
  // Když spodek tabulky vyjede nad hlavičku + jeden řádek, hlavička přestane plavat (odjede s tabulkou).
  const tabulkaRef = useRef<HTMLTableElement>(null);
  const [konecTabulky, setKonecTabulky] = useState(false);
  useEffect(() => {
    let raf = 0;
    const mer = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const t = tabulkaRef.current;
        if (!t) return;
        const hlavicka = t.tHead?.getBoundingClientRect().height ?? 0;
        const posledni = t.tBodies[0]?.rows[t.tBodies[0].rows.length - 1]?.getBoundingClientRect().height ?? 0;
        setKonecTabulky(t.getBoundingClientRect().bottom < 56 + hlavicka + posledni);
      });
    };
    mer();
    window.addEventListener('scroll', mer, { passive: true });
    window.addEventListener('resize', mer);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', mer); window.removeEventListener('resize', mer); };
  }, []);

  // Progresivní načtení: stránka vloží jen prvních ~50 řádků (rychlý FCP + SEO);
  // celou databázi si dotáhneme z cachovaného API a odemkneme filtrování nad celkem.
  const [rows, setRows] = useState<ScreenerRow[]>(initialRows);
  const [full, setFull] = useState(initialRows.length >= total);
  useEffect(() => {
    if (full) return;
    let cancelled = false;
    fetch('/api/etf/screener')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: ScreenerRow[]) => {
        if (cancelled || !Array.isArray(data) || data.length === 0) return;
        setRows(data);
        setFull(true);
      })
      .catch(() => { /* necháme initialRows – stránka zůstane funkční nad ukázkou */ });
    return () => { cancelled = true; };
  }, [full]);

  // Panel filtrů: zamknout scroll stránky pod ním a zavírat Escapem.
  useEffect(() => {
    if (!panel) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setPanel(false); };
    document.addEventListener('keydown', k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, [panel]);

  /* ────────────────────────────────────────────────────────────────────────
     STAV FILTRŮ V URL.
     Bez tohohle nešlo výběr nikomu poslat ani ho po čase zopakovat. Do URL jdou jen hodnoty
     odlišné od výchozích. replaceState (ne router.push) – nezanáší historii a nespouští
     re-render serverové komponenty; filtrování běží celé na klientu.
     ──────────────────────────────────────────────────────────────────────── */
  const restored = useRef(false);
  /* Přišel v URL dotaz/index? Pak se do načtení celé databáze nesmí ukázat
     „Žádný fond neodpovídá filtrům“ – server posílá jen prvních 50 řádků. */
  const urlQuery = useRef(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const g = (k: string) => p.get(k);
    // ?q= (hledání z hlavičky) a ?index= (proklik ze srovnání indexů) – víc indexů oddělených „|“.
    if (g('q')) { setQ(g('q')!); urlQuery.current = true; }
    // Staré odkazy ?index=S%26P%20500 (žebříčky, články) → celý trh (stejný výběr jako žebříček).
    if (g('index')) { setIndexSel([...new Set(g('index')!.split('|').filter(Boolean).map((v) => (INDEXY_TRHU[v] ? `trh:${INDEXY_TRHU[v]}` : v)))]); urlQuery.current = true; }
    if (g('kat')) setCategory(g('kat')!);
    if (g('vyplata')) setDist(g('vyplata')!);
    if (g('region')) setRegion(g('region')!);
    if (g('replikace')) setRepl(g('replikace')!);
    if (g('mena')) setCurrency(g('mena')!);
    if (g('zajisteni')) setHedging(g('zajisteni')!);
    // Dřív samostatný filtr „Velikost fondu“ (kategorie) vedle „Min. velikost“ – sloučeno do minimální velikosti.
    if (g('velikost') && !g('minvel')) { const m = ({ medium: '100', large: '1000', xlarge: '10000' } as Record<string, string>)[g('velikost')!]; if (m) setSizeMin(m); }
    if (g('styl')) setFactor(g('styl')!);
    if (g('paka') === '1') setLeveraged(true);
    if (g('ter')) setTerMax(g('ter')!);
    if (g('minvel')) setSizeMin(g('minvel')!);
    if (g('divmin')) setDivMin(g('divmin')!);
    if (g('domicil')) setDomicile(g('domicil')!);
    if (g('poskytovatel')) setProvider(g('poskytovatel')!);
    if (g('stari')) setMinAge(g('stari')!);
    if (g('sort')) setSortKey(g('sort') as SortKey);
    if (g('smer')) setSortDir(g('smer') as SortDir);
    restored.current = true;
    if (urlQuery.current) {
      setShown(PAGE);
      rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    const p = new URLSearchParams();
    const put = (k: string, v: string, def: string) => { if (v !== def) p.set(k, v); };
    put('q', q, '');
    put('kat', category, 'all');
    put('vyplata', dist, 'all');
    put('region', region, 'all');
    if (indexSel.length) p.set('index', indexSel.join('|'));
    put('replikace', repl, 'all');
    put('mena', currency, 'all');
    put('zajisteni', hedging, 'all');
    put('styl', factor, 'all');
    if (leveraged) p.set('paka', '1');
    put('ter', terMax, '');
    put('minvel', sizeMin, '');
    put('divmin', divMin, '');
    put('domicil', domicile, 'all');
    put('poskytovatel', provider, 'all');
    put('stari', minAge, 'all');
    put('sort', sortKey, 'size');
    put('smer', sortDir, 'desc');
    const qs = p.toString();
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }, [q, category, dist, region, indexSel, repl, currency, hedging, factor, leveraged, terMax, sizeMin, divMin, domicile, provider, minAge, sortKey, sortDir]);

  /* Měnové zajištění – jedna podmínka pro výsledek i pro počty v nabídce indexů. */
  const hedgeOk = useCallback((e: ScreenerRow) => {
    if (hedging === 'all') return true;
    if (hedging === 'unhedged') return e._hedge === 'unhedged';
    if (hedging === 'hedged') return e._hedge !== 'unhedged';
    return e._hedge === hedging;
  }, [hedging]);

  /* Počty v nabídce indexů = kolik fondů po kliknutí uvidíte (páka a zajištění jako výsledek). Do načtení
     celé databáze počty ze serveru (stejná data, výchozí stav). */
  const poctyMapy = useMemo(() => {
    if (!full) return null;
    const trh = new Map<string, number>(), idx = new Map<string, number>();
    for (const e of rows) {
      if (!leveraged && e.is_leveraged) continue;
      if (!hedgeOk(e)) continue;
      if (e._trh) trh.set(e._trh, (trh.get(e._trh) ?? 0) + 1);
      if (e._index) idx.set(e._index, (idx.get(e._index) ?? 0) + 1);
    }
    return { trh, idx };
  }, [rows, full, leveraged, hedgeOk]);
  const pocty: PoctyNabidky = {
    trh: (id) => poctyMapy ? poctyMapy.trh.get(id) ?? 0 : (() => { const t = options.trhy.find((x) => x.id === id); return t ? (hedging === 'unhedged' ? t.countNezaj : t.count) : 0; })(),
    index: (label, i, g) => poctyMapy ? poctyMapy.idx.get(label) ?? 0 : g.counts?.[i],
  };
  const vcZajist = hedging !== 'unhedged';
  const setVcZajist = (v: boolean) => { setHedging(v ? 'all' : 'unhedged'); setShown(PAGE); };

  // Celkový počet fondů v záhlaví stránky = výchozí výsledek z dat, která má klient (viz PocetFondu).
  useEffect(() => { if (full) nastavPocetFondu(rows.filter((r) => !r.is_leveraged).length); }, [full, rows]);

  // Fulltext se skládá jednou na načtená data (dřív hotový `_blob` ze serveru = +426 kB v payloadu).
  const enriched = useMemo<Enriched[]>(() =>
    rows.map((e) => ({ e, blob: `${e.name} ${e.isin} ${e.fund_provider ?? ''} ${e._tickers.join(' ')}`.toLowerCase() })), [rows]);

  const term = q.trim().toLowerCase();
  // České výrazy a varianty zápisu („sp500“ → S&P 500, „zlato“ → Gold) – stejně jako našeptávač.
  const termy = useMemo(() => anglickeTermy(q), [q]);

  /* Filtrace ve dvou krocích: všechno KROMĚ kategorie → z toho počty v záložkách (sedí s výsledkem,
     revize 18. 10. 2026: „Vše 5 124“ vs. „Nalezeno 4 974“) → pak kategorie. Na měně (`cur`) nezávisí. */
  const bezKategorie = useMemo(() => {
    const termyL = termy.map((t) => t.toLowerCase());
    const terMaxN = desetinne(terMax);
    const sizeMinN = desetinne(sizeMin);
    const divMinN = desetinne(divMin);
    const indexy = new Set(indexSel.filter((v) => !v.startsWith('trh:')));
    const trhy = new Set(indexSel.filter((v) => v.startsWith('trh:')).map((v) => v.slice(4)));
    const f = factor !== 'all' ? FACTORS.find((x) => x.value === factor) : undefined;
    const rok = new Date().getFullYear();

    return enriched.filter(({ e, blob }) => {
      if (term && !blob.includes(term) && !termyL.some((t) => blob.includes(t))) return false;
      if (!leveraged && e.is_leveraged) return false;
      if (dist === 'acc' && e._dist !== 'acc') return false;
      if (dist === 'dist' && e._dist !== 'dist') return false;
      if (region !== 'all' && e._region !== region) return false;
      if (indexSel.length && !(indexy.has(e._index) || (e._trh != null && trhy.has(e._trh)))) return false;
      if (repl !== 'all' && e._repl !== repl) return false;
      if (currency !== 'all' && e.fund_currency !== currency) return false;
      if (!hedgeOk(e)) return false;
      if (f) {
        if (!f.match.some((m) => blob.includes(m))) return false;
        if (f.exclude?.some((m) => blob.includes(m))) return false;
      }
      const size = num(e.fund_size_numeric);
      if (terMaxN != null && (num(e.ter_numeric) == null || num(e.ter_numeric)! > terMaxN)) return false;
      // Fond bez velikosti filtr velikosti NEPROJDE (tvrdit „aspoň X“ bez údaje by bylo horší).
      if (sizeMinN != null && (size == null || size < sizeMinN)) return false;
      if (divMinN != null) { const d = num(e.current_dividend_yield_numeric); if (d == null || d < divMinN) return false; }
      if (domicile !== 'all' && e._dom !== domicile) return false;
      if (provider !== 'all' && e.fund_provider !== provider) return false;
      if (minAge !== 'all') {
        // Fond bez data vzniku filtr na stáří NEPROJDE – tvrdit „je starší než X let" bez data by bylo horší.
        if (e._year == null) return false;
        if (rok - e._year < Number(minAge)) return false;
      }
      return true;
    });
  }, [enriched, term, termy, dist, region, indexSel, repl, currency, hedgeOk, factor, leveraged, terMax, sizeMin, divMin, domicile, provider, minAge]);

  const catCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const { e } of bezKategorie) if (e.category) m.set(e.category, (m.get(e.category) ?? 0) + 1);
    return m;
  }, [bezKategorie]);

  const filteredRows = useMemo(
    () => (category === 'all' ? bezKategorie : bezKategorie.filter(({ e }) => e.category === category)),
    [bezKategorie, category],
  );

  const filtered = useMemo(() => {
    const get = (e: ScreenerRow): number | string | null => {
      const o = e as unknown as Record<string, unknown>;
      switch (sortKey) {
        case 'name': return e.name?.toLowerCase() ?? '';
        case 'ter': return num(e.ter_numeric);
        case 'size': return num(e.fund_size_numeric);
        case 'ytd': return pickReturn(o, 'ytd', cur);
        case 'r1': return pickReturn(o, '1y', cur);
        case 'r3': return pickReturn(o, '3y', cur);
        case 'r5': return pickReturn(o, '5y', cur);
        case 'div': return num(e.current_dividend_yield_numeric);
        case 'vol': return num(e.volatility_1y);
      }
    };
    // Relevance hledání je stejná jako v našeptávači (src/lib/hledaniCz.ts) – „sp500“ dá CSPX/SXR8 nahoru.
    const list = filteredRows.map((r) => ({ r, s: term ? skoreHledani(term, termy, { isin: r.e.isin, name: r.e.name, tickers: r.e._tickers, index: r.e._index || null, zajisteno: r.e._hedge !== 'unhedged' }) : 0 }));
    list.sort((A, B) => {
      if (term && A.s !== B.s) return B.s - A.s; // relevantnější nahoru, nezávisle na řazení sloupce
      const va = get(A.r.e), vb = get(B.r.e);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      const cmp = typeof va === 'string' ? va.localeCompare(vb as string, 'cs') : (va as number) - (vb as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list.map((x) => x.r);
  }, [filteredRows, sortKey, sortDir, cur, term, termy]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir(k === 'name' || k === 'ter' || k === 'vol' ? 'asc' : 'desc'); }
    setShown(PAGE);
  };
  const nastavRazeni = (v: string) => { const [k, d] = v.split(':'); setSortKey(k as SortKey); setSortDir(d as SortDir); setShown(PAGE); };

  const reset = () => {
    setQ(''); setCategory('all'); setDist('all'); setRegion('all'); setIndexSel([]);
    setRepl('all'); setCurrency('all'); setHedging('all'); setFactor('all');
    setLeveraged(false); setTerMax(''); setSizeMin(''); setDivMin('');
    setDomicile('all'); setProvider('all'); setMinAge('all'); setShown(PAGE);
  };

  /* Aktivní filtry jako odebíratelné štítky – je vidět, PROČ je výsledek zúžený, i když je panel zavřený. */
  const regionLabel = (r: string) => r;
  const stitky: { k: string; label: string; off: () => void }[] = [
    ...indexSel.map((v) => ({ k: `i-${v}`, label: popisIndexu(v, options), off: () => setIndexSel(indexSel.filter((x) => x !== v)) })),
    ...(region !== 'all' ? [{ k: 'region', label: regionLabel(region), off: () => setRegion('all') }] : []),
    ...(dist !== 'all' ? [{ k: 'dist', label: dist === 'acc' ? 'Akumulační' : 'Distribuční', off: () => setDist('all') }] : []),
    ...(factor !== 'all' ? [{ k: 'styl', label: FACTORS.find((f) => f.value === factor)?.label ?? factor, off: () => setFactor('all') }] : []),
    ...(repl !== 'all' ? [{ k: 'repl', label: `Replikace: ${repl}`, off: () => setRepl('all') }] : []),
    ...(currency !== 'all' ? [{ k: 'mena', label: `Měna fondu ${currency}`, off: () => setCurrency('all') }] : []),
    ...(hedging !== 'all' ? [{ k: 'hedge', label: hedging === 'unhedged' ? 'Bez měnového zajištění' : hedging === 'hedged' ? 'Měnově zajištěné' : `Zajištěno do ${hedging.split('_')[0].toUpperCase()}`, off: () => setHedging('all') }] : []),
    ...(terMax !== '' ? [{ k: 'ter', label: `TER do ${terMax.replace('.', ',')}\u00A0%`, off: () => setTerMax('') }] : []),
    ...(sizeMin !== '' ? [{ k: 'minvel', label: `Velikost od ${Number(sizeMin) >= 1000 ? `${(Number(sizeMin) / 1000).toLocaleString('cs-CZ')} mld.` : `${sizeMin} mil.`} €`, off: () => setSizeMin('') }] : []),
    ...(divMin !== '' ? [{ k: 'div', label: `Dividenda od ${divMin.replace('.', ',')}\u00A0%`, off: () => setDivMin('') }] : []),
    ...(domicile !== 'all' ? [{ k: 'dom', label: `Domicil ${domicile}`, off: () => setDomicile('all') }] : []),
    ...(provider !== 'all' ? [{ k: 'prov', label: provider, off: () => setProvider('all') }] : []),
    ...(minAge !== 'all' ? [{ k: 'stari', label: `Starší než ${minAge} let`, off: () => setMinAge('all') }] : []),
    ...(leveraged ? [{ k: 'paka', label: 'Včetně pákových', off: () => setLeveraged(false) }] : []),
  ];
  // Kolik filtrů je v panelu (odznak na tlačítku „Filtry“). Index, region a výplata jsou na desktopu v liště.
  const vPanelu = stitky.filter((s) => !s.k.startsWith('i-') && s.k !== 'region' && s.k !== 'dist').length;
  const anyFilter = stitky.length > 0 || q !== '' || category !== 'all';

  /* ────────────────────────────────────────────────────────────────────────
     EXPORT CSV. Exportuje CELÝ vyfiltrovaný výběr. Hlavička nese zdroj dat, datum a použité filtry –
     bez toho je výstup po čase nedoložitelný. Oddělovač `;` a desetinná čárka kvůli českému Excelu,
     BOM kvůli diakritice.
     ──────────────────────────────────────────────────────────────────────── */
  const exportCsv = () => {
    const dec = (v: number | null, d = 2) => (v == null ? '' : v.toFixed(d).replace('.', ','));
    const q2 = (v: string) => (/[";\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const distTxt = { acc: 'Akumulační', dist: 'Distribuční', unknown: 'Neuvedeno' };
    const aktivni = [q && `hledání: ${q}`, category !== 'all' && `kategorie: ${category}`, ...stitky.map((s) => s.label)]
      .filter(Boolean).join(', ') || 'žádné (všechny fondy bez pákových)';
    const hlavicka = [
      `# Export ze srovnávače ETF – etfpruvodce.cz`,
      `# Vyexportováno: ${new Date().toLocaleString('cs-CZ')}`,
      `# Data k datu: ${dataDate || 'neuvedeno'} (kurzy ČNB)`,
      `# Použité filtry: ${aktivni}`,
      `# Fondů ve výběru: ${filtered.length}`,
      `# Výnosy přepočtené do: ${curLabel[cur]} (prázdné = přepočet chybí)`,
      '',
    ];
    const sloupce = ['Název','ISIN','Ticker','Poskytovatel','Kategorie','Region','Sledovaný index','Domicil','Rok vzniku','TER (%)','Velikost (mil. EUR)','Měna fondu','Typ výplaty','Replikace','Div. výnos (%)',`YTD (${curLabel[cur]}, %)`,`1 rok (${curLabel[cur]}, %)`,`3 roky (${curLabel[cur]}, %)`,`5 let (${curLabel[cur]}, %)`,'Kolísavost 1r (EUR, %)','Páka'];
    const radky = filtered.map(({ e }) => {
      const o = e as unknown as Record<string, unknown>;
      return [
        e.name, e.isin, platnyTicker(e.primary_ticker) ?? '', e.fund_provider ?? '', e.category ?? '', e._region ?? '', e._index ?? '',
        e._dom ?? '', e._year != null ? String(e._year) : '',
        dec(num(e.ter_numeric)), dec(num(e.fund_size_numeric), 0), e.fund_currency ?? '',
        distTxt[e._dist], e._repl ?? '',
        dec(num(e.current_dividend_yield_numeric)),
        dec(pickReturn(o, 'ytd', cur), 1), dec(pickReturn(o, '1y', cur), 1), dec(pickReturn(o, '3y', cur), 1),
        dec(pickReturn(o, '5y', cur), 1), dec(num(e.volatility_1y), 1), e.is_leveraged ? 'ano' : '',
      ].map((v) => q2(String(v))).join(';');
    });
    const csv = '﻿' + [...hlavicka, sloupce.map(q2).join(';'), ...radky].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `etf-vyber-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  // Dotaz „sp500“, „msci world“, „celý svět“… = celý trh → nabídnout výběr trhu (stejný jako žebříček).
  const trhDotazu = useMemo(() => {
    const t = bezDiakritiky(q).replace(/\s+/g, ' ');
    const hit = t ? TRH_Z_DOTAZU.find(([re]) => re.test(t)) : undefined;
    return hit ? options.trhy.find((x) => x.id === hit[1]) ?? null : null;
  }, [q, options.trhy]);

  // Dotaz z URL a ještě nemáme celou databázi → nejde o „nic nenalezeno“, ale o načítání.
  const cekaNaData = !full && urlQuery.current;
  const pocetVse = useMemo(() => [...catCounts.values()].reduce((s, n) => s + n, 0) + bezKategorie.filter(({ e }) => !e.category).length, [catCounts, bezKategorie]);

  const bump = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => { setter(e.target.value); setShown(PAGE); };
  const bumpN = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => { setter(e.target.value); setShown(PAGE); };
  const setIdx = (v: string[]) => { setIndexSel(v); setShown(PAGE); };

  const regionSelect = (
    <select aria-label="Region" value={region} onChange={bump(setRegion)} className={`${selCls} ${region !== 'all' ? 'border-teal-500 text-teal-800' : ''}`}>
      <option value="all">Všechny regiony</option>
      <optgroup label="Oblasti">
        {options.regions.map((r, i) => ({ r, n: options.regionCounts[i] })).filter(({ r }) => ['Celosvětově', 'USA', 'Evropa', 'Rozvíjející se trhy', 'Asie a Pacifik', 'Severní Amerika', 'Latinská Amerika', 'Východní Evropa', 'Afrika'].includes(r))
          .map(({ r, n }) => <option key={r} value={r}>{r} ({n.toLocaleString('cs-CZ')})</option>)}
      </optgroup>
      <optgroup label="Země">
        {options.regions.map((r, i) => ({ r, n: options.regionCounts[i] })).filter(({ r }) => !['Celosvětově', 'USA', 'Evropa', 'Rozvíjející se trhy', 'Asie a Pacifik', 'Severní Amerika', 'Latinská Amerika', 'Východní Evropa', 'Afrika'].includes(r))
          .map(({ r, n }) => <option key={r} value={r}>{r} ({n.toLocaleString('cs-CZ')})</option>)}
      </optgroup>
    </select>
  );
  const distSelect = (
    <select aria-label="Typ výplaty" value={dist} onChange={bump(setDist)} className={`${selCls} ${dist !== 'all' ? 'border-teal-500 text-teal-800' : ''}`}>
      {/* Krátce – „Akumulační i distribuční“ se do lišty nevešlo (končilo „distribučn“). */}
      <option value="all">Výplata: ACC i DIST</option>
      <option value="acc">Akumulační (ACC)</option>
      <option value="dist">Distribuční (DIST)</option>
    </select>
  );
  const razeniSelect = (id: string, panelovy = false) => (
    <select id={id} aria-label="Řadit podle" value={`${sortKey}:${sortDir}`} onChange={(e) => nastavRazeni(e.target.value)}
      className={panelovy ? selCls : 'vyber h-11 max-w-[13rem] rounded-lg border border-slate-200 bg-white pl-2 text-sm font-medium text-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none'}>
      {!SORT_VOLBY.some((s) => s.v === `${sortKey}:${sortDir}`) && <option value={`${sortKey}:${sortDir}`}>{SORT_VOLBY.find((s) => s.v.startsWith(`${sortKey}:`))?.label ?? sortKey} ({sortDir === 'asc' ? 'vzestupně' : 'sestupně'})</option>}
      {SORT_VOLBY.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
    </select>
  );

  return (
    <div ref={rootRef} className="scroll-mt-20">
      {/* KATEGORIE JAKO ZÁLOŽKY – počty stejným filtrem jako výsledek */}
      <div className="-mx-4 px-4 mb-2.5 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
        {[{ v: 'all', label: 'Vše' }, ...options.categories.map((c) => ({ v: c, label: c }))].map(({ v, label }) => {
          const active = category === v;
          const count = v === 'all' ? pocetVse : (catCounts.get(v) ?? 0);
          // Záložka bez fondů po filtru („Krypto 0“) ZŮSTÁVÁ (zašedlá, neaktivní) – dřív mizela a lišta při výběru
          // indexu poskakovala (revize kola 4: po S&P 500 zbylo jen „Vše / Akcie“).
          const prazdna = full && count === 0 && !active && v !== 'all';
          return (
            <button
              key={v}
              aria-pressed={active}
              disabled={prazdna}
              title={prazdna ? 'V této kategorii žádný fond neodpovídá ostatním filtrům' : undefined}
              onClick={() => { setCategory(v); setShown(PAGE); }}
              className={`shrink-0 h-9 rounded-full border px-3.5 text-sm font-medium transition-colors ${active ? 'bg-slate-900 border-slate-900 text-white' : prazdna ? 'bg-white text-slate-300 border-slate-100 cursor-default' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-700'}`}
            >
              {label}
              {full && <span className={`ml-1.5 tabular-nums text-xs ${active ? 'text-slate-300' : prazdna ? 'text-slate-300' : 'text-slate-400'}`}>{count.toLocaleString('cs-CZ')}</span>}
            </button>
          );
        })}
      </div>

      {/* LIŠTA FILTRŮ – jeden řádek: hledání + index + region + výplata + „Filtry (n)“ */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1 min-w-0 flex gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              aria-label="Hledat fond podle názvu, ISIN, tickeru nebo poskytovatele"
              value={q}
              onChange={(e) => { setQ(e.target.value); setShown(PAGE); }}
              placeholder="Hledat: VWCE, IE00B4L5Y983, sp500, zlato…"
              className="w-full h-11 md:h-10 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[15px] md:text-sm text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
            />
          </div>
          {/* Mobil: jedno tlačítko na celý panel (filtry + řazení) */}
          <button type="button" onClick={() => setPanel(true)} className="md:hidden inline-flex items-center gap-1.5 shrink-0 rounded-lg border border-slate-300 bg-white px-3 min-h-[44px] text-sm font-medium text-slate-700 active:bg-slate-50">
            <SlidersHorizontal className="w-4 h-4" /> Filtry
            {stitky.length > 0 && <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-teal-700 text-white text-[11px] font-semibold">{stitky.length}</span>}
          </button>
        </div>
        <div className="hidden md:block w-[15rem] shrink-0"><IndexPicker options={options} vybrane={indexSel} setVybrane={setIdx} pocty={pocty} vcZajist={vcZajist} setVcZajist={setVcZajist} /></div>
        <div className="hidden md:block w-[11.5rem] shrink-0">{regionSelect}</div>
        <div className="hidden md:block w-[12.5rem] shrink-0">{distSelect}</div>
        <button type="button" onClick={() => setPanel(true)} className={`hidden md:inline-flex items-center gap-1.5 shrink-0 rounded-lg border px-3 h-10 text-sm font-medium hover:border-teal-400 hover:text-teal-700 ${vPanelu ? 'border-teal-500 text-teal-800 bg-teal-50/50' : 'border-slate-300 bg-white text-slate-700'}`}>
          <SlidersHorizontal className="w-4 h-4" /> Filtry
          {vPanelu > 0 && <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-teal-700 text-white text-[11px] font-semibold">{vPanelu}</span>}
        </button>
      </div>

      {/* AKTIVNÍ FILTRY – odebíratelné štítky */}
      {stitky.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {stitky.map((s) => (
            <button key={s.k} type="button" onClick={() => { s.off(); setShown(PAGE); }} className="inline-flex items-center gap-1 rounded-full bg-teal-50 pl-2.5 pr-1.5 py-1 text-xs font-medium text-teal-800 ring-1 ring-teal-200 hover:bg-teal-100" aria-label={`Zrušit filtr ${s.label}`}>
              {s.label} <X className="w-3 h-3" />
            </button>
          ))}
          <button onClick={reset} className="inline-flex items-center gap-1 px-2 min-h-[32px] md:min-h-0 md:py-1 text-xs font-medium text-slate-500 hover:text-red-600">Vymazat vše</button>
        </div>
      )}

      {trhDotazu && !indexSel.includes(`trh:${trhDotazu.id}`) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-teal-200 bg-teal-50/60 px-3 py-2 text-sm text-slate-700">
          <span>Hledáte fondy na {trhDotazu.id === 'svet' ? 'celý svět' : `celý trh ${trhDotazu.label}`}? Hledání podle názvu vrací i sektorové, ESG a další varianty.</span>
          <button type="button" onClick={() => { setQ(''); setIdx([`trh:${trhDotazu.id}`]); }}
            className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-2 hover:decoration-teal-700">
            Zobrazit {pocty.trh(trhDotazu.id).toLocaleString('cs-CZ')} fondů {trhDotazu.id === 'svet' ? 'na celý svět' : `na ${trhDotazu.label}`} (jako žebříček)
          </button>
        </div>
      )}

      {/* VÝSLEDEK – počet + řazení (i na mobilu) + export + měna */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        {full ? (
          <p className="text-sm text-slate-600" aria-live="polite">
            <span className="font-semibold text-slate-900 tabular-nums">{filtered.length.toLocaleString('cs-CZ')}</span> {filtered.length === 1 ? 'fond' : filtered.length >= 2 && filtered.length <= 4 ? 'fondy' : 'fondů'}
            {!leveraged && <span className="hidden sm:inline text-slate-400"> · bez pákových produktů</span>}
          </p>
        ) : (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500"><Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" /> Načítám všechny fondy…</p>
        )}
        <div className="flex items-center gap-2">
          <label htmlFor="razeni-mobil" className="md:hidden text-xs text-slate-500">Řadit:</label>
          <span className="md:hidden">{razeniSelect('razeni-mobil')}</span>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!full || filtered.length === 0}
            title="Stáhne celý vyfiltrovaný výběr jako CSV (otevře se v Excelu) včetně data dat a použitých filtrů."
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <span className="hidden md:inline-flex"><CurrencyToggle size="sm" showLabel={false} /></span>
        </div>
      </div>

      {/* TABULKA – desktop */}
      {/* Plovoucí hlavička (majitel 18. 10. 2026): sticky funguje jen bez overflow na předkovi → od lg (tabulka se vejde)
          kontejner bez overflow-x-auto; md–lg (úzké okno) se dál posouvá do strany a hlavička neplave. */}
      <div className="mt-2 hidden md:block rounded-xl border border-slate-200 bg-white overflow-x-auto lg:overflow-visible">
        <table ref={tabulkaRef} className="w-full min-w-[60rem] text-sm border-separate border-spacing-0">
          <thead className={`${konecTabulky ? '' : 'lg:sticky'} lg:top-14 z-20 shadow-[0_1px_0_0_theme(colors.slate.200)]`}>
            {/* Dvouřádková hlavička: měna výnosů jednou nad skupinou sloupců (explicitně, ale bez opakování). */}
            <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wide">
              <SortH k="name" wide rowSpan={2} tip="typ" cls="rounded-tl-xl" sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>Fond</SortH>
              <SortH k="ter" right rowSpan={2} tip="ter" cls={SKUPINA} sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>TER</SortH>
              <SortH k="size" right rowSpan={2} tip="size" sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>Velikost</SortH>
              <th colSpan={4} className="pt-2 px-2 text-center font-semibold normal-case tracking-normal text-xs text-teal-800 bg-teal-50 border-l border-slate-200">
                <span className="block border-b border-slate-200 pb-1">Výnos v {cur === 'CZK' ? 'korunách' : cur === 'EUR' ? 'eurech' : 'dolarech'}</span>
              </th>
              <SortH k="vol" right rowSpan={2} tip="vol" cls={SKUPINA} sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>Kolísavost (EUR)</SortH>
              <SortH k="div" right rowSpan={2} tip="div" sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>Div.</SortH>
              <th rowSpan={2} className="py-2.5 px-2 font-medium text-center rounded-tr-xl"><span className="sr-only">Porovnat</span></th>
            </tr>
            <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wide">
              <SortH k="ytd" right tip="ytd" cls={`${SKUPINA} bg-teal-50 border-b border-slate-200`} sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>Letos</SortH>
              <SortH k="r1" right tip="r1" cls="bg-teal-50 border-b border-slate-200" sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>1 rok</SortH>
              <SortH k="r3" right tip="r3" cls="bg-teal-50 border-b border-slate-200" sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>3 roky</SortH>
              <SortH k="r5" right tip="r5" cls="bg-teal-50 border-b border-slate-200" sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>5 let</SortH>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, shown).map(({ e }) => {
              const o = e as unknown as Record<string, unknown>;
              const ytd = pickReturn(o, 'ytd', cur), r1 = pickReturn(o, '1y', cur), r3 = pickReturn(o, '3y', cur), r5 = pickReturn(o, '5y', cur);
              const c = distChip(e._dist);
              const tk = platnyTicker(e.primary_ticker);
              return (
                <tr key={e.isin} className="even:bg-slate-50 hover:bg-amber-50/50 transition-colors [&>td]:border-b [&>td]:border-slate-100 last:[&>td]:border-b-0">
                  <td className="py-2.5 pl-3 pr-2">
                    <div className="flex items-center gap-2.5">
                      <EmitentLogo nazev={e.name} size={28} monogram={e.fund_provider ?? e.name} />
                      <div className="min-w-0">
                        <Link href={`/etf/${e.isin}`} title={e.name} className="line-clamp-2 font-medium leading-snug text-slate-900 hover:text-teal-700">
                          {kratkyNazev(e.name)}
                        </Link>
                        <span className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                          {/* Bez tickeru celý ISIN normálním písmem (dřív useknutý monospace „IE…ZB19“ = jako rozbitý export). */}
                          <span className={tk ? 'font-medium text-slate-600' : 'text-slate-500'}>{tk ?? e.isin}</span>
                          <span title={c.title} className={`inline-block text-[10px] font-medium px-1.5 py-px rounded-full ${c.cls}`}>{c.label}</span>
                          {e.is_leveraged && <span className="rounded bg-amber-50 px-1 text-[10px] font-medium text-amber-700">páka</span>}
                          <HedgeChip h={e._hedge} />
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className={`py-2.5 px-2 text-right tabular-nums whitespace-nowrap font-medium text-slate-800 ${SKUPINA}`}>{ter(num(e.ter_numeric))}</td>
                  <td className="py-2.5 px-2 text-right tabular-nums whitespace-nowrap text-slate-600">{money(num(e.fund_size_numeric))}</td>
                  <td className={`py-2.5 px-2 text-right tabular-nums whitespace-nowrap ${VYNOSY} ${SKUPINA} ${barva(ytd)}`}>{vyn(e, ytd)}</td>
                  <td className={`py-2.5 px-2 text-right tabular-nums whitespace-nowrap font-semibold ${VYNOSY} ${barva(r1)}`}>{vyn(e, r1)}</td>
                  <td className={`py-2.5 px-2 text-right tabular-nums whitespace-nowrap ${VYNOSY} ${barva(r3)}`}>{vyn(e, r3)}</td>
                  <td className={`py-2.5 px-2 text-right tabular-nums whitespace-nowrap ${VYNOSY} ${barva(r5)}`}>{vyn(e, r5)}</td>
                  <td className={`py-2.5 px-2 text-right tabular-nums whitespace-nowrap text-slate-600 ${SKUPINA}`}><Kolisavost e={e} /></td>
                  <td className="py-2.5 px-2 text-right tabular-nums whitespace-nowrap text-slate-600"><Dividenda e={e} /></td>
                  <td className="py-2.5 pl-1 pr-2.5 text-right">
                    <CompareButton isin={e.isin} label={tk ?? e.name.slice(0, 8)} variant="row" />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="py-10 text-center text-sm text-slate-500">
                {cekaNaData || !full
                  ? <span className="inline-flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" /> Hledám ve všech fondech…</span>
                  : <>Žádný fond neodpovídá filtrům. <button onClick={reset} className="text-teal-700 hover:underline">Vymazat filtry</button></>}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* KARTY – mobil (stejná data jako tabulka) */}
      <div className="mt-2 md:hidden">
        <button type="button" onClick={() => setLegenda((l) => !l)} aria-expanded={legenda} className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-teal-700">
          <Info className="w-3.5 h-3.5" /> {legenda ? 'Skrýt vysvětlivky' : 'Co znamenají čísla?'}
        </button>
        {legenda && (
          <dl className="mb-2 rounded-lg border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-600 space-y-1.5">
            <div><dt className="inline font-semibold text-slate-800">1 rok, 5 let: </dt><dd className="inline">výnos celkem za dané období, přepočtený do {curLabel[cur] === 'Kč' ? 'korun (včetně vlivu kurzu)' : 'zvolené měny'}. Minulý výnos nezaručuje budoucí. Podtržená „—“ = výnos se o víc než 1,5 p. b. liší od ostatních fondů na stejný trh (nejčastěji opožděná cena u zdroje), proto ho neukazujeme.</dd></div>
            <div><dt className="inline font-semibold text-slate-800">TER: </dt><dd className="inline">{VYSVETLIVKY.ter}</dd></div>
            <div><dt className="inline font-semibold text-slate-800">Velikost: </dt><dd className="inline">{VYSVETLIVKY.size}</dd></div>
            <div><dt className="inline font-semibold text-slate-800">ACC / DIST: </dt><dd className="inline">{VYSVETLIVKY.typ}</dd></div>
            <div><dd className="inline">Tlačítkem <strong>Porovnat</strong> vyberete 2–{COMPARE_MAX} fondy a uvidíte je vedle sebe.</dd></div>
          </dl>
        )}
        <div className="space-y-2">
          {filtered.slice(0, shown).map(({ e }) => {
            const o = e as unknown as Record<string, unknown>;
            const r1 = pickReturn(o, '1y', cur), r5 = pickReturn(o, '5y', cur);
            const c = distChip(e._dist);
            const tk = platnyTicker(e.primary_ticker);
            return (
              <div key={e.isin} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-start gap-2.5">
                  <EmitentLogo nazev={e.name} size={28} className="mt-0.5" monogram={e.fund_provider ?? e.name} />
                  <div className="min-w-0 flex-1">
                    <Link href={`/etf/${e.isin}`} className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900 active:text-teal-700">
                      {kratkyNazev(e.name)}
                    </Link>
                    <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                      <span className={tk ? 'font-medium text-slate-600' : 'text-slate-500'}>{tk ?? e.isin}</span>
                      <span className={`inline-block text-[10px] font-medium px-1.5 py-px rounded-full ${c.cls}`}>{c.label}</span>
                      {e.is_leveraged && <span className="rounded bg-amber-50 px-1 text-[10px] font-medium text-amber-700">páka</span>}
                      <HedgeChip h={e._hedge} />
                    </span>
                  </div>
                  <CompareButton isin={e.isin} label={tk ?? e.name.slice(0, 8)} variant="row" />
                </div>
                {/* Kolo 5: poslední sloupec podle obsahu – „139,4 mld. €“ přetékalo čtvrtinu karty o ~5 px. */}
                <dl className="mt-2.5 grid grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-1.5 text-xs">
                  <div>
                    <dt className="text-slate-500">1 rok</dt>
                    <dd className={`tabular-nums text-sm font-semibold whitespace-nowrap ${barva(r1)}`}>{vyn(e, r1)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">5 let</dt>
                    <dd className={`tabular-nums text-sm font-semibold whitespace-nowrap ${barva(r5)}`}>{vyn(e, r5)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">TER</dt>
                    <dd className="tabular-nums text-sm font-medium text-slate-800 whitespace-nowrap">{ter(num(e.ter_numeric))}</dd>
                  </div>
                  <div className="text-right">
                    <dt className="text-slate-500">Velikost</dt>
                    <dd className="tabular-nums text-sm font-medium text-slate-800 whitespace-nowrap">{money(num(e.fund_size_numeric))}</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
        {filtered.length > 0 && <p className="mt-2 text-[11px] text-slate-400">Výnosy v {curLabel[cur]}.</p>}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
            {cekaNaData || !full
              ? <span className="inline-flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" /> Hledám ve všech fondech…</span>
              : <>Žádný fond neodpovídá filtrům. <button onClick={reset} className="text-teal-700 hover:underline">Vymazat filtry</button></>}
          </div>
        )}
      </div>

      {shown < filtered.length && (
        <div className="mt-4 text-center">
          <button onClick={() => setShown((s) => s + PAGE)} className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">
            Zobrazit dalších {Math.min(PAGE, filtered.length - shown)} <span className="text-slate-400">(z {filtered.length.toLocaleString('cs-CZ')})</span>
          </button>
        </div>
      )}

      {/* PANEL FILTRŮ – desktop: vysouvací zprava; mobil: zespodu. Tabulka zůstává na svém místě
          (dřív rozbalené pokročilé filtry odsunuly výsledky pod okraj obrazovky). */}
      {panel && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filtry a řazení">
          <button type="button" aria-label="Zavřít filtry" onClick={() => setPanel(false)} className="absolute inset-0 bg-slate-900/40" />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] rounded-t-2xl md:inset-y-0 md:left-auto md:right-0 md:bottom-auto md:h-full md:max-h-none md:w-[26rem] md:rounded-none bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <p className="text-base font-semibold text-slate-900">Filtry<span className="md:hidden"> a řazení</span></p>
              <button type="button" onClick={() => setPanel(false)} aria-label="Zavřít" className="flex items-center justify-center w-11 h-11 md:w-9 md:h-9 -mr-2 rounded-lg text-slate-500 hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4">
              <div className="md:hidden grid grid-cols-1 gap-3">
                <Field label="Řadit podle">{razeniSelect('razeni-panel', true)}</Field>
                <div><span className="block mb-1 text-xs font-medium text-slate-500">Výnosy zobrazit v</span><CurrencyToggle showLabel={false} /></div>
              </div>
              <div className="md:hidden">
                <span className="block mb-1 text-xs font-medium text-slate-500">Sledovaný index nebo trh (lze víc)</span>
                <IndexList kompakt options={options} vybrane={indexSel} setVybrane={setIdx} pocty={pocty} vcZajist={vcZajist} setVcZajist={setVcZajist} />
              </div>
              <div className="md:hidden grid grid-cols-1 gap-3">
                <Field label="Region / země">{regionSelect}</Field>
                <Field label="Typ výplaty">{distSelect}</Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Investiční styl">
                  <select aria-label="Investiční styl" value={factor} onChange={bump(setFactor)} className={selCls}>
                    <option value="all">Všechny</option>
                    {FACTORS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </Field>
                <Field label="Max. TER (%)">
                  <input type="text" inputMode="decimal" pattern="[0-9]*[,.]?[0-9]*" placeholder="např. 0,20" value={terMax} onChange={bumpN(setTerMax)} className={selCls} />
                </Field>
                {/* Jedno pole místo dvou (dřív „Velikost fondu: Jakákoli“ + „Min. velikost“ = dvě věci na totéž). */}
                <Field label="Velikost fondu">
                  <select aria-label="Minimální velikost fondu" value={sizeMin} onChange={bump(setSizeMin)} className={selCls}>
                    <option value="">Jakákoli</option>
                    {!['', '50', '100', '500', '1000', '10000'].includes(sizeMin) && <option value={sizeMin}>od {sizeMin} mil. €</option>}
                    <option value="50">od 50 mil. €</option>
                    <option value="100">od 100 mil. €</option>
                    <option value="500">od 500 mil. €</option>
                    <option value="1000">od 1 mld. €</option>
                    <option value="10000">od 10 mld. €</option>
                  </select>
                </Field>
                <Field label="Měnové zajištění">
                  <select aria-label="Měnové zajištění" value={hedging} onChange={bump(setHedging)} className={selCls}>
                    <option value="all">Jakékoli</option>
                    <option value="unhedged">Nezajištěné</option>
                    <option value="hedged">Zajištěné (všechny)</option>
                    <option value="eur_hedged">Zajištěno do EUR</option>
                    <option value="usd_hedged">Zajištěno do USD</option>
                    <option value="gbp_hedged">Zajištěno do GBP</option>
                    <option value="chf_hedged">Zajištěno do CHF</option>
                  </select>
                </Field>
                <Field label="Min. dividenda (%)">
                  <input type="text" inputMode="decimal" pattern="[0-9]*[,.]?[0-9]*" placeholder="např. 2,0" value={divMin} onChange={bumpN(setDivMin)} className={selCls} />
                </Field>
                <Field label="Replikace">
                  <select aria-label="Replikace" value={repl} onChange={bump(setRepl)} className={selCls}>
                    <option value="all">Jakákoli</option>
                    {options.replications.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Stáří fondu">
                  <select aria-label="Minimální stáří fondu" value={minAge} onChange={bump(setMinAge)} className={selCls}>
                    <option value="all">Jakékoli</option>
                    <option value="3">3 roky a víc</option>
                    <option value="5">5 let a víc</option>
                    <option value="10">10 let a víc</option>
                    <option value="15">15 let a víc</option>
                  </select>
                </Field>
                <Field label="Měna fondu">
                  <select aria-label="Měna fondu" value={currency} onChange={bump(setCurrency)} className={selCls}>
                    <option value="all">Jakákoli</option>
                    {options.currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Domicil fondu">
                  <select aria-label="Domicil fondu" value={domicile} onChange={bump(setDomicile)} className={selCls}>
                    <option value="all">Jakýkoli</option>
                    {options.domiciles.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Poskytovatel (emitent)">
                <select aria-label="Poskytovatel fondu" value={provider} onChange={bump(setProvider)} className={selCls}>
                  <option value="all">Všichni</option>
                  {options.providers.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </Field>
              <label className="flex items-center gap-2.5 min-h-[44px] rounded-lg border border-slate-200 px-3 py-2.5">
                <input type="checkbox" checked={leveraged} onChange={(e) => { setLeveraged(e.target.checked); setShown(PAGE); }} className="w-4 h-4 rounded accent-teal-600" />
                <span className="text-sm text-slate-700">Zobrazit i pákové a inverzní produkty <span className="text-slate-400">(vysoké riziko)</span></span>
              </label>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
              <button type="button" onClick={reset} disabled={!anyFilter} className="inline-flex items-center min-h-[44px] md:min-h-[40px] -ml-2 px-2 rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 disabled:opacity-40">Vymazat vše</button>
              <button type="button" onClick={() => setPanel(false)} className="inline-flex items-center min-h-[44px] md:min-h-[40px] rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800">
                Zobrazit {filtered.length.toLocaleString('cs-CZ')} {filtered.length === 1 ? 'fond' : filtered.length >= 2 && filtered.length <= 4 ? 'fondy' : 'fondů'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
