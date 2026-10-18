'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';
import EmitentLogo from '@/components/home/EmitentLogo';
import InfoTip from '@/components/design-preview/InfoTip';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import CompareButton from '@/components/design-preview/CompareButton';
import { useCurrency, type Currency } from '@/components/design-preview/currencyStore';
import { mer } from '@/lib/mereni';

/* Kompletní tabulka fondů žebříčku /nejlepsi-etf/[slug] (revize 18. 10. 2026: stránka slibovala
   „30 fondů“, ale ukazovala jen 3× top 5). Data připraví server (page.tsx), tady jen řazení,
   filtr typu a stránkování – žádný dotaz z prohlížeče.
   Pravidlo č. 1: výnos v Kč/USD bez hodnoty = „—“, NIKDY EUR místo něj (proto ne pickReturn,
   který na bázi EUR padá zpět). */

export interface RadekFondu {
  isin: string;
  nazev: string;
  ticker: string | null;
  ter: number | null;
  velikost: number | null;
  /** Výnosy podle měny – bez fallbacku mezi měnami. */
  r1: Record<Currency, number | null>;
  r3: Record<Currency, number | null>;
  typ: 'acc' | 'dist' | null;
  /** Měna zajištění („EUR“, „CHF“…), „ano“ když měna není poznat, null = nezajištěná třída. */
  zajisteni: string | null;
}

type Klic = 'size' | 'ter' | 'r1' | 'r3';
const RAZENI: { id: Klic; label: string; mobil: string; kratce: string }[] = [
  { id: 'size', label: 'Největší', mobil: 'Největší', kratce: 'velikost fondu' },
  { id: 'ter', label: 'Nejlevnější', mobil: 'Nejlevnější', kratce: 'poplatek ročně' },
  { id: 'r1', label: 'Výnos 1 rok', mobil: 'Výnos 1 r.', kratce: 'výnos za 12 měs.' },
  { id: 'r3', label: 'Výnos 3 roky', mobil: 'Výnos 3 r.', kratce: 'výnos za 3 roky' },
];
const KROK = 20;

const cz = (v: number, d = 1) => v.toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : v < 0 ? '−' : ''}${cz(Math.abs(v))} %`);
const terF = (v: number | null) => (v == null ? '—' : `${cz(v, 2)} %`);
const vel = (v: number | null) => (v == null ? '—' : v >= 1000 ? `${cz(v / 1000)} mld €` : `${Math.round(v)} mil €`);
const barva = (v: number | null) => (v == null ? 'text-slate-400' : v >= 0 ? 'text-emerald-700' : 'text-red-700');
const kratkyIsin = (isin: string) => `${isin.slice(0, 2)}…${isin.slice(-4)}`;
const curText: Record<Currency, string> = { CZK: 'v Kč', EUR: 'v EUR', USD: 'v USD' };

export default function TabulkaFondu({
  radky, celkem, vychozi = 'size', datum, srovnavac,
}: {
  radky: RadekFondu[];
  /** Kolik fondů do žebříčku patří celkem (může být víc, než kolik posíláme). */
  celkem: number;
  vychozi?: Klic;
  /** „18. 10. 2026“ – k jakému dni platí výnosy (do popisků sloupců). */
  datum: string;
  srovnavac: { href: string; text: string };
}) {
  const [cur] = useCurrency();
  const [klic, setKlic] = useState<Klic>(vychozi);
  const [vzestupne, setVzestupne] = useState(vychozi === 'ter');
  const [typ, setTyp] = useState<'vse' | 'acc' | 'dist'>('vse');
  const [bezZajisteni, setBezZajisteni] = useState(false);
  const [pocet, setPocet] = useState(KROK);

  const maZajistene = radky.some((r) => r.zajisteni);
  const maOba = radky.some((r) => r.typ === 'acc') && radky.some((r) => r.typ === 'dist');

  const hodnota = (r: RadekFondu, k: Klic) =>
    k === 'size' ? r.velikost : k === 'ter' ? (r.ter != null && r.ter > 0 ? r.ter : null) : k === 'r1' ? r1(r) : r3(r);
  const r1 = (r: RadekFondu) => r.r1[cur];
  const r3 = (r: RadekFondu) => r.r3[cur];

  const vyber = useMemo(() => {
    const f = radky.filter((r) => (typ === 'vse' || r.typ === typ) && (!bezZajisteni || !r.zajisteni));
    // Bez hodnoty vždy na konec (nezávisle na směru) – „—“ nesmí vyhrát řazení.
    return [...f].sort((a, b) => {
      const x = hodnota(a, klic), y = hodnota(b, klic);
      if (x == null && y == null) return (b.velikost ?? 0) - (a.velikost ?? 0);
      if (x == null) return 1;
      if (y == null) return -1;
      return (vzestupne ? x - y : y - x) || (b.velikost ?? 0) - (a.velikost ?? 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radky, typ, bezZajisteni, klic, vzestupne, cur]);

  const radit = (k: Klic, zHlavicky = false) => {
    if (zHlavicky && k === klic) setVzestupne((v) => !v);
    else { setKlic(k); setVzestupne(k === 'ter'); }
    setPocet(KROK);
    mer('zalozka', { s: 'tabulka', c: k });
  };

  const zobrazene = vyber.slice(0, pocet);
  const zbyva = vyber.length - zobrazene.length;
  const aktivni = RAZENI.find((r) => r.id === klic)!;

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

  return (
    <div>
      {/* Ovládání: řazení (záložky), typ, měna */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Řazení fondů" className="grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1 lg:inline-grid lg:min-w-[30rem]">
          {RAZENI.map((r) => (
            <button key={r.id} type="button" aria-pressed={klic === r.id} onClick={() => radit(r.id)}
              className={`min-h-10 rounded-lg px-1.5 text-[13px] sm:text-sm font-semibold leading-tight transition-colors ${klic === r.id ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
              <span className="sm:hidden">{r.mobil}</span><span className="hidden sm:inline">{r.label}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {maOba && (
            <div role="group" aria-label="Typ fondu" className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
              {([['vse', 'Vše', 'Vše'], ['acc', 'Akumulační', 'Akum.'], ['dist', 'Distribuční', 'Dist.']] as const).map(([id, l, m]) => (
                <button key={id} type="button" aria-pressed={typ === id} onClick={() => { setTyp(id); setPocet(KROK); }}
                  className={`rounded-md px-2.5 py-2 sm:py-1 font-medium ${typ === id ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  <span className="sm:hidden">{m}</span><span className="hidden sm:inline">{l}</span>
                </button>
              ))}
            </div>
          )}
          <span className="sm:hidden"><CurrencyToggle size="sm" showLabel={false} /></span>
          <span className="hidden sm:inline-flex"><CurrencyToggle size="sm" /></span>
          {maZajistene && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-600">
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none min-h-9">
                <input type="checkbox" checked={bezZajisteni} onChange={(e) => { setBezZajisteni(e.target.checked); setPocet(KROK); }} className="h-4 w-4 accent-teal-700" />
                Skrýt měnově zajištěné
              </label>
              <InfoTip label="Měnově zajištěná třída fondu tlumí kurz (např. USD/EUR), za poplatek. Výnos se proto liší od nezajištěné třídy stejného indexu.">{null}</InfoTip>
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-slate-200 bg-white">
        {/* Hlavička sloupců (desktop) */}
        <div className="hidden md:grid md:grid-cols-[2rem_minmax(0,1fr)_5.5rem_6.5rem_6.5rem_6.5rem_2.5rem] gap-4 px-5 py-3 text-xs font-medium text-slate-500 border-b border-slate-100">
          <span>#</span>
          <span>Fond</span>
          <span className="text-right"><Hlavicka k="ter" tip="TER = roční poplatek fondu, strhává se z jeho hodnoty. Swapové fondy mohou mít navíc swap poplatek – detail u fondu.">TER</Hlavicka></span>
          <span className="text-right"><Hlavicka k="size">Velikost</Hlavicka></span>
          <span className="text-right"><Hlavicka k="r1" tip={`Celkový výnos za posledních 12 měsíců ${curText[cur]}, k ${datum}. Minulý výnos nezaručuje budoucí.`}>1 rok</Hlavicka></span>
          <span className="text-right"><Hlavicka k="r3" tip={`Celkový (ne roční) výnos za poslední 3 roky ${curText[cur]}, k ${datum}. Mladší fondy ho nemají („—“).`}>3 roky</Hlavicka></span>
          <span className="sr-only">Porovnat</span>
        </div>

        <ol className="divide-y divide-slate-100">
          {zobrazene.map((r, i) => {
            const hlavni = hodnota(r, klic);
            const hlavniText = klic === 'size' ? vel(hlavni) : klic === 'ter' ? terF(hlavni) : pct(hlavni);
            const vedlejsi = klic === 'size' || klic === 'r1' || klic === 'r3' ? `TER ${terF(r.ter)}` : vel(r.velikost);
            return (
              <li key={r.isin} className="relative grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[2rem_minmax(0,1fr)_5.5rem_6.5rem_6.5rem_6.5rem_2.5rem] gap-x-4 items-center px-4 md:px-5 py-2.5 hover:bg-slate-50/70">
                <span className="hidden md:block text-xs tabular-nums text-slate-400">{i + 1}</span>
                <Link href={`/etf/${r.isin}`} className="group min-w-0 flex items-center gap-2.5 min-h-11">
                  <EmitentLogo nazev={r.nazev} size={28} />
                  <span className="min-w-0 flex flex-col">
                    <span className="text-[15px] md:text-sm font-medium leading-snug text-slate-900 group-hover:text-teal-800 group-hover:underline underline-offset-2 line-clamp-2 md:line-clamp-1">{r.nazev}</span>
                    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-500">
                      <span className="font-medium text-slate-600">{r.ticker ?? <span title={r.isin}>{kratkyIsin(r.isin)}</span>}</span>
                      {r.typ && <span>· {r.typ === 'acc' ? 'akumulační' : 'distribuční'}</span>}
                      {r.zajisteni && <span className="rounded bg-amber-50 px-1 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200">zajištěno{r.zajisteni !== 'ano' ? ` ${r.zajisteni}` : ''}</span>}
                    </span>
                  </span>
                </Link>
                {/* Mobil: hlavní číslo podle řazení + vedlejší údaj */}
                <span className="md:hidden text-right">
                  <span className={`block text-base font-semibold tabular-nums ${klic === 'r1' || klic === 'r3' ? barva(hlavni) : 'text-slate-900'}`}>{hlavniText}</span>
                  <span className="block text-[11px] text-slate-500 whitespace-nowrap">{klic === 'r1' || klic === 'r3' ? aktivni.kratce : vedlejsi}</span>
                </span>
                <span className={`hidden md:block text-right text-sm tabular-nums ${klic === 'ter' ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{terF(r.ter)}</span>
                <span className={`hidden md:block text-right text-sm tabular-nums ${klic === 'size' ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{vel(r.velikost)}</span>
                <span className={`hidden md:block text-right text-sm tabular-nums ${barva(r1(r))} ${klic === 'r1' ? 'font-semibold' : ''}`}>{pct(r1(r))}</span>
                <span className={`hidden md:block text-right text-sm tabular-nums ${barva(r3(r))} ${klic === 'r3' ? 'font-semibold' : ''}`}>{pct(r3(r))}</span>
                <span className="hidden md:flex justify-end"><CompareButton isin={r.isin} label={r.ticker ?? kratkyIsin(r.isin)} variant="chip" /></span>
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
      {celkem > radky.length && (
        <p className="text-xs text-slate-500">Zobrazujeme {radky.length} největších z {celkem.toLocaleString('cs-CZ')} fondů – ostatní najdete ve srovnávači.</p>
      )}
    </div>
  );
}
