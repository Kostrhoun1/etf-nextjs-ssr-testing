'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import type { ComparisonETF } from '@/lib/etf-data';
import { useCurrency, pickReturn, curLabel } from '@/components/design-preview/currencyStore';
import { platnyTicker } from '@/lib/ticker';
import { ceskaZeme, ceskySektor, ceskeZamereni } from '@/lib/preklady';
import { indexFonduLabel } from '@/utils/indexNormalization';
import EmitentLogo from '@/components/home/EmitentLogo';
import InfoTip from '@/components/design-preview/InfoTip';
import { detectHedging } from '@/utils/hedgingDetection';
import { barvaFondu } from '@/lib/barvyFondu';
import { cislo, procenta, terText, velikostText } from '@/lib/formatSrovnavac';
import { RIZIKO_NESEDI_TEXT, type RizikoPole } from '@/lib/tridyFondu';

const raw = (e: ComparisonETF) => e as unknown as Record<string, unknown>;
const num = (v: unknown) => (v == null || v === '' || Number.isNaN(Number(v)) ? null : Number(v));
const str = (v: unknown) => (v == null || v === '' ? null : String(v));

/* Formáty: src/lib/formatSrovnavac.ts (jednotně se srovnávačem – „−“, nbsp před %, „mld. €“).
   Výnosy 1 desetinné místo, TER 2 (0,07 vs. 0,12 % je u poplatku podstatný rozdíl).
   POZOR: velikost fondu (fund_size_numeric) se z justETF stahuje VŽDY v EUR, i u USD/GBP tříd → vždy €.
   Ověřeno proti justETF: CSPX = EUR 131 612 mil., SWDA = EUR 123 901 mil. */
const ter = (v: number | null) => terText(v);
const pct = (v: number | null) => procenta(v, 1, true);
const pct1 = (v: number | null) => procenta(v, 1);
const money = (v: number | null) => velikostText(v);
const komodita = (e: ComparisonETF) => e.category === 'Komodity' || e.category === 'Krypto';
const CETNOST: [RegExp, string][] = [[/month/i, 'měsíčně'], [/quarter/i, 'čtvrtletně'], [/semi/i, 'pololetně'], [/annual/i, 'ročně']];
const distTypeLabel = (p: string | null, freq?: string | null) => {
  const s = p || '';
  if (/accumulat|thesaur|capitalis/i.test(s)) return 'Akumulační';
  if (/distribut/i.test(s)) return 'Distribuční';
  if (freq && /(quarter|month|annual|semi|dividend|income)/i.test(freq)) return 'Distribuční';
  return 'Neuvedeno';
};
/* Replikace: zdroj rozlišuje jen „Physical“, „Synthetic“ a „Synthetic (Unfunded swap)“ (ověřeno nad celou DB
   18. 10. 2026) – plnou replikaci od výběru vzorku (sampling) data neuvádějí, proto ji nevymýšlíme. */
const replLabel = (r: string | null) => {
  const s = (r || '').toLowerCase();
  if (s.includes('unfunded')) return 'Syntetická (unfunded swap)';
  if (s.includes('synth') || s.includes('swap')) return 'Syntetická (swap)';
  if (s) return 'Fyzická';
  return '—';
};
/* Krátký název (bez „UCITS ETF…“) – stejně jako srovnávač a žebříčky; celý název je v title. */
const kratkyNazev = (n: string) => n.replace(/\s+UCITS\b.*$/i, '').replace(/\s+\([^()]*\)\s*$/, '').trim() || n;

/* Burzy a tickery fondu (exchange_1…10). Pomlčka místo tickeru = burza bez tickeru ve zdroji → vynechat.
   XETRA první (tam nakupuje většina českých brokerů), pak podle pořadí ve zdroji; duplicity pryč. */
function burzy(e: ComparisonETF): { burza: string; ticker: string; mena: string | null }[] {
  const r = raw(e);
  const out: { burza: string; ticker: string; mena: string | null }[] = [];
  for (let i = 1; i <= 10; i++) {
    const burza = str(r[`exchange_${i}_name`]);
    const ticker = platnyTicker(str(r[`exchange_${i}_ticker`]));
    if (!burza || !ticker) continue;
    const mena = str(r[`exchange_${i}_currency`]);
    if (!out.some((x) => x.burza === burza && x.ticker === ticker && x.mena === mena)) out.push({ burza, ticker, mena });
  }
  return out.sort((a, b) => Number(/xetra/i.test(b.burza)) - Number(/xetra/i.test(a.burza)));
}
const BURZA_CS: Record<string, string> = { 'London Stock Exchange': 'Londýn', 'SIX Swiss Exchange': 'SIX (Švýcarsko)', 'Borsa Italiana': 'Milán', 'Euronext Amsterdam': 'Amsterdam', 'Euronext Paris': 'Paříž', 'Stuttgart Stock Exchange': 'Stuttgart', 'Bolsa Mexicana de Valores': 'Mexiko' };
function skupinyBurz(e: ComparisonETF) {
  const skupiny = new Map<string, { ticker: string; mena: string | null; burzy: string[] }>();
  for (const x of burzy(e)) {
    const k = `${x.ticker}|${x.mena ?? ''}`;
    const g = skupiny.get(k) ?? { ticker: x.ticker, mena: x.mena, burzy: [] };
    g.burzy.push(BURZA_CS[x.burza] ?? x.burza);
    skupiny.set(k, g);
  }
  return [...skupiny.values()];
}

/* Mobil: burzy po fondech přes celou šířku (ve 3–4 úzkých sloupcích se seznam lámal po slovech). */
function BurzyMobil({ etfs }: { etfs: ComparisonETF[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
      <p className="px-2.5 pt-2 text-xs text-slate-500">Burzy a tickery <span className="text-slate-400">· stejný fond, jiná burza a měna</span></p>
      {etfs.map((e, i) => {
        const g = skupinyBurz(e);
        return (
          <div key={e.isin} className="flex gap-2 px-2.5 py-2 text-xs">
            <span aria-hidden="true" className="mt-1 inline-block w-2 h-2 shrink-0 rounded-[2px]" style={{ background: barvaFondu(i) }} />
            <span className="min-w-0 leading-relaxed text-slate-500">
              {g.length === 0 ? '—' : g.slice(0, 4).map((x, j) => (
                <span key={j} className="mr-2.5 inline-block"><strong className="font-semibold text-slate-800">{x.ticker}</strong> {x.mena} · {x.burzy.join(', ')}</span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Burzy({ e }: { e: ComparisonETF }) {
  // Seskupeno podle tickeru a měny („VWCE · EUR: XETRA, gettex, Milán…“) – dřív 10 řádků na fond.
  const skupiny = new Map<string, { ticker: string; mena: string | null; burzy: string[] }>();
  for (const x of burzy(e)) {
    const k = `${x.ticker}|${x.mena ?? ''}`;
    const g = skupiny.get(k) ?? { ticker: x.ticker, mena: x.mena, burzy: [] };
    g.burzy.push(BURZA_CS[x.burza] ?? x.burza);
    skupiny.set(k, g);
  }
  const vse = [...skupiny.values()];
  if (!vse.length) return <span className="text-slate-400">—</span>;
  const ukaz = vse.slice(0, 4);
  return (
    <ul className="space-y-1 text-xs">
      {ukaz.map((g) => (
        <li key={`${g.ticker}${g.mena}`} className="leading-snug">
          <span className="font-semibold text-slate-800">{g.ticker}</span>{g.mena && <span className="text-slate-500"> · {g.mena}</span>}
          <span className="block text-slate-500">{g.burzy.join(', ')}</span>
        </li>
      ))}
      {vse.length > ukaz.length && <li className="text-slate-400">+ další {vse.length - ukaz.length}</li>}
    </ul>
  );
}

/* Top 10 pozic: scraper do 18. 10. 2026 zahazoval 1. řádek (u S&P 500 chyběla NVIDIA) – stejná pojistka
   jako detail fondu (pozicNeuplne v src/app/etf/[isin]/page.tsx): 9 pozic u fondu s víc než 9 tituly =
   neúplný seznam → neukazovat jako „největší pozice“. Pravidlo č. 1. */
const poziceNeuplne = (e: ComparisonETF) => vahy(e, 'holding', 10).length === 9 && (e.total_holdings ?? 0) > 9;
const DOM: Record<string, string> = { Ireland: 'Irsko', Luxembourg: 'Lucembursko', Germany: 'Německo', France: 'Francie', Netherlands: 'Nizozemsko', Switzerland: 'Švýcarsko', 'United Kingdom': 'Spojené království' };
const dom = (d: string | null) => (d ? DOM[d] ?? d : '—');

const age = (inc: string | null) => {
  if (!inc) return '—';
  const d = new Date(inc); if (Number.isNaN(d.getTime())) return '—';
  const y = (Date.now() - d.getTime()) / (365.25 * 864e5);
  return y < 1 ? '< 1 rok' : `${Math.floor(y)} let`;
};

/* Barevná procentní buňka pro výnos (zelená = kladný, červená = záporný – nic jiného). */
function Perf({ v }: { v: number | null }) {
  if (v == null) return <span className="text-slate-400">—</span>;
  return <span className={`tabular-nums font-medium ${v >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(v)}</span>;
}

/* Váhy (pozice / sektory / země) jednoho fondu. */
function vahy(e: ComparisonETF, prefix: string, n: number) {
  const r = raw(e);
  const items: { name: string; w: number | null }[] = [];
  for (let i = 1; i <= n; i++) {
    const name = str(r[`${prefix}_${i}_name`]);
    if (!name) continue;
    items.push({ name, w: num(r[`${prefix}_${i}_weight`]) });
  }
  return items;
}

const nazevVahy = (prefix: string, name: string) => (prefix === 'country' ? ceskaZeme(name) : prefix === 'sector' ? ceskySektor(name) : name);

function WeightList({ e, prefix, n }: { e: ComparisonETF; prefix: string; n: number }) {
  if (prefix === 'holding' && poziceNeuplne(e)) return <span className="text-xs text-slate-500">Dočasně neuvádíme – ve zdroji chybí největší pozice. Doplní se s další aktualizací.</span>;
  const items = vahy(e, prefix, n);
  if (!items.length) return <span className="text-slate-400">—</span>;
  return (
    <ul className="space-y-1">
      {items.map((it, i) => (
        <li key={i} className="flex items-center justify-between gap-2 text-xs">
          <span className="truncate text-slate-700" title={nazevVahy(prefix, it.name)}>{nazevVahy(prefix, it.name)}</span>
          {it.w != null && <span className="shrink-0 tabular-nums text-slate-500">{pct1(it.w)}</span>}
        </li>
      ))}
    </ul>
  );
}

/* `omit` = řádek, pro který nemá ANI JEDEN porovnávaný fond hodnotu. Takový řádek se nevykresluje:
   sloupec plný pomlček nevypadá jako chybějící údaj, ale jako rozbitý nástroj. */
/* `nej` = nejlepší hodnota v řádku: hodnota, směr (1 = víc je lépe, −1 = míň je lépe) a zobrazení – shoda
   PO ZAOKROUHLENÍ (stejný text v buňce) = shoda, pak se neoznačuje nikdo. */
type Nej = { v: (e: ComparisonETF) => number | null; smer: 1 | -1; fmt: (v: number) => string };
type Row = { label: React.ReactNode; cell: (e: ComparisonETF) => React.ReactNode; nej?: Nej; top?: boolean; omit?: boolean;
  /** Mobil: vlastní vykreslení přes celou šířku (místo úzkých sloupců vedle sebe). */
  mobil?: React.ReactNode };

/* MOBIL – váhy otočené: řádek = pozice/sektor/země, sloupce = fondy (revize 18. 10. 2026: tři useknuté seznamy
   vedle sebe se na telefonu nedaly číst). Prázdná buňka = u fondu není mezi uvedenými největšími. */
function VahyOtocene({ etfs, prefix, n }: { etfs: ComparisonETF[]; prefix: string; n: number }) {
  const platne = etfs.map((e) => (prefix === 'holding' && poziceNeuplne(e) ? null : vahy(e, prefix, n)));
  const radky = new Map<string, (number | null | undefined)[]>();
  platne.forEach((items, fi) => items?.forEach((it) => {
    const k = nazevVahy(prefix, it.name);
    const r = radky.get(k) ?? etfs.map(() => undefined);
    r[fi] = it.w;
    radky.set(k, r);
  }));
  const serazene = [...radky].sort((a, b) => Math.max(...b[1].map((x) => x ?? 0)) - Math.max(...a[1].map((x) => x ?? 0)));
  const ostatni = serazene.filter(([k]) => /^ostatn/i.test(k));
  const poradi = [...serazene.filter(([k]) => !/^ostatn/i.test(k)), ...ostatni];
  return (
    <div className="rounded-lg border border-slate-100 bg-white">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-100 text-slate-500">
            <th className="py-1.5 pl-2.5 pr-1 text-left font-medium"><span className="sr-only">Položka</span></th>
            {etfs.map((e, i) => (
              <th key={e.isin} className="py-1.5 px-1.5 text-right font-semibold text-slate-700 whitespace-nowrap">
                <span aria-hidden="true" className="mr-1 inline-block w-2 h-2 rounded-[2px] align-middle" style={{ background: barvaFondu(i) }} />
                {platnyTicker(e.primary_ticker) ?? `${i + 1}.`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {poradi.map(([k, v]) => (
            <tr key={k} className="border-b border-slate-50 last:border-0">
              <td className="py-1.5 pl-2.5 pr-1 text-slate-700 leading-snug">{k}</td>
              {v.map((w, fi) => (
                <td key={fi} className="py-1.5 px-1.5 text-right tabular-nums text-slate-600 whitespace-nowrap">
                  {platne[fi] == null ? <span className="text-slate-300">·</span> : w == null ? '' : pct1(w)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-slate-100 px-2.5 py-1.5 text-[11px] text-slate-400">
        Prázdné = u fondu není mezi {prefix === 'holding' ? '10' : '5'} největšími.
        {platne.some((x) => x == null) && ' „·“ = seznam dočasně neuvádíme (ve zdroji chybí největší pozice).'}
      </p>
    </div>
  );
}
type Section = { title: string; rows: Row[] };

/* Nejlepší hodnota v řádku: ✓ a tučně, NE zelenou – zelená už znamená kladný výnos (revize 18. 10. 2026). */
function Bunka({ children, vitez }: { children: React.ReactNode; vitez: boolean }) {
  if (!vitez) return <>{children}</>;
  return (
    <span className="inline-flex items-center gap-1 font-bold text-slate-900 [&_span]:font-bold">
      {children}
      <Check className="w-3.5 h-3.5 shrink-0 text-teal-700" aria-label="nejlepší v řádku" />
    </span>
  );
}

export default function PorovnaniTable({ etfs, rokDat }: { etfs: ComparisonETF[]; rokDat: number }) {
  const [cur] = useCurrency();
  const ret = (e: ComparisonETF, period: string) => pickReturn(raw(e), period, cur);

  const perf = (period: string, label: string): Row => ({
    label, cell: (e) => <Perf v={ret(e, period)} />,
    nej: { v: (e) => ret(e, period), smer: 1, fmt: pct },
    omit: etfs.every((e) => ret(e, period) == null),
  });
  /* Krátká období (1M/3M/6M) máme JEN v eurech (ZAMERNA-ROZHODNUTI.md) → vždy EUR a tak i popsané,
     nezávisle na přepínači měny. Dřív se pod nadpisem „Výkonnost (Kč)“ ukazovala eurová čísla. */
  const perfEur = (period: string, label: string): Row => ({
    label, cell: (e) => <Perf v={num(raw(e)[`return_${period}`])} />,
    nej: { v: (e) => num(raw(e)[`return_${period}`]), smer: 1, fmt: pct },
    omit: etfs.every((e) => num(raw(e)[`return_${period}`]) == null),
  });
  /* Kolísavost/pokles, které nesedí s jinou třídou téhož fondu (src/lib/tridyFondu.ts) → „—“ s vysvětlením.
     Výnos / kolísavost stojí na téže kolísavosti → „—“ taky. Pravidlo č. 1. */
  const volNesedi = (e: ComparisonETF, key: string) => {
    const pole = (key.startsWith('return_per_risk_') ? `volatility_${key.slice(16)}` : key) as RizikoPole;
    return !!e._rizikoNesedi?.includes(pole);
  };
  const riskVal = (e: ComparisonETF, key: string) => (volNesedi(e, key) ? null : num(raw(e)[key]));
  const riskRow = (label: string, key: string, mist: number, smer?: 1 | -1, suffix = true): Row => {
    const fmt = (v: number) => (suffix ? procenta(v, mist) : cislo(v, mist));
    return {
      label,
      cell: (e) => {
        if (volNesedi(e, key)) return <span title={RIZIKO_NESEDI_TEXT} className="cursor-help text-slate-400 underline decoration-dotted decoration-slate-300 underline-offset-2">—<span className="sr-only"> ({RIZIKO_NESEDI_TEXT})</span></span>;
        const v = riskVal(e, key);
        return v == null ? <span className="text-slate-400">—</span> : <span className="tabular-nums text-slate-700">{fmt(v)}</span>;
      },
      nej: smer ? { v: (e) => riskVal(e, key), smer, fmt } : undefined,
      omit: etfs.every((e) => num(raw(e)[key]) == null),
    };
  };
  const vahyRow = (label: string, prefix: string, n: number): Row => ({
    label, top: true, cell: (e) => <WeightList e={e} prefix={prefix} n={n} />,
    omit: etfs.every((e) => vahy(e, prefix, n).length === 0 || (prefix === 'holding' && poziceNeuplne(e))),
    mobil: <VahyOtocene etfs={etfs} prefix={prefix} n={n} />,
  });
  const roky = [rokDat - 1, rokDat - 2, rokDat - 3, rokDat - 4, rokDat - 5].map(String);

  const sections: Section[] = [
    {
      title: 'Základní informace',
      rows: [
        { label: 'Ticker', cell: (e) => <span className="font-semibold text-slate-800">{platnyTicker(e.primary_ticker) ?? '—'}</span> },
        /* ISIN je jediný identifikátor, podle kterého se zadává pokyn u brokera –
           musí být vidět vždy, i když má fond ticker. */
        { label: 'ISIN', cell: (e) => <span className="font-mono text-xs text-slate-700">{e.isin}</span> },
        { label: 'Poskytovatel', cell: (e) => str(e.fund_provider) ?? '—' },
        // Index: čistý údaj ze zdroje, jinak poznaný z názvu fondu (SPYI → MSCI ACWI IMI), jinak „—“.
        { label: 'Sledovaný index', cell: (e) => indexFonduLabel({ index_name: e.index_name, name: e.name, investment_focus: str(raw(e).investment_focus) }) ?? '—' },
        { label: 'Zaměření', cell: (e) => ceskeZamereni(str(raw(e).investment_focus) ?? str(e.region)) || '—' },
        { label: 'Výplata dividend', cell: (e) => {
          const t = distTypeLabel(e.distribution_policy, e.distribution_frequency);
          if (komodita(e) && t !== 'Distribuční') return <span className="text-slate-500">Nevyplácí</span>;
          if (t === 'Akumulační') return 'Reinvestuje (ACC)';
          if (t === 'Distribuční') { const c = CETNOST.find(([re]) => re.test(e.distribution_frequency ?? ''))?.[1]; return `Vyplácí (DIST)${c ? `, ${c}` : ''}`; }
          return <span className="text-slate-400">—</span>;
        } },
        { label: <InfoTip label="Fyzická = fond drží cenné papíry indexu (nebo fyzický kov). Syntetická = výnos indexu dodává protistrana swapem; „unfunded“ = fond drží vlastní koš cenných papírů a jeho výnos za výnos indexu směňuje.">Replikace</InfoTip>, cell: (e) => replLabel(e.replication) },
        { label: <InfoTip label="Zajištěná třída tlumí vliv kurzu (např. USD/EUR) za poplatek – její výnos se proto liší od nezajištěné třídy stejného indexu.">Měnové zajištění</InfoTip>, cell: (e) => { const h = detectHedging(e.name); return h.isHedged ? (h.hedgedCurrency ? `Zajištěno do ${h.hedgedCurrency}` : 'Zajištěno') : 'Nezajištěno'; } },
        { label: 'Domicil', cell: (e) => dom(e.fund_domicile) },
        { label: 'Právní struktura', cell: (e) => str(raw(e).legal_structure) ?? '—' },
        { label: 'Měna fondu', cell: (e) => str(e.fund_currency) ?? '—' },
        { label: <InfoTip label="Stejný fond se obchoduje na více burzách pod různými tickery a v různých měnách – poplatek i výnos fondu jsou stejné. V Česku se nejčastěji kupuje na XETRA.">Burzy a tickery</InfoTip>, top: true, cell: (e) => <Burzy e={e} />, omit: etfs.every((e) => burzy(e).length === 0), mobil: <BurzyMobil etfs={etfs} /> },
      ],
    },
    {
      title: 'Poplatky a velikost',
      rows: [
        { label: 'Roční poplatek (TER)', cell: (e) => ter(num(e.ter_numeric)), nej: { v: (e) => num(e.ter_numeric), smer: -1, fmt: ter } },
        { label: 'Velikost fondu', cell: (e) => money(num(e.fund_size_numeric)), nej: { v: (e) => num(e.fund_size_numeric), smer: 1, fmt: money } },
        { label: 'Počet pozic ve fondu', cell: (e) => e.total_holdings != null ? e.total_holdings.toLocaleString('cs-CZ') : '—' },
        { label: 'Stáří fondu', cell: (e) => age(e.inception_date) },
      ],
    },
    {
      title: `Výkonnost (${curLabel[cur]})`,
      rows: [
        perf('ytd', 'Od začátku roku'),
        perf('1y', '1 rok'),
        perf('3y', '3 roky celkem'),
        perf('5y', '5 let celkem'),
      ],
    },
    { title: `Výkonnost po letech (${curLabel[cur]})`, rows: roky.map((y) => perf(y, `Rok ${y}`)) },
    { title: 'Krátkodobá výkonnost (v EUR)', rows: [perfEur('1m', '1 měsíc'), perfEur('3m', '3 měsíce'), perfEur('6m', '6 měsíců')] },
    {
      title: 'Riziko a kolísavost (počítáno v EUR)',
      rows: [
        // ✓ jen tam, kde „lepší“ dává smysl: nižší kolísavost, menší pokles, vyšší výnos na jednotku rizika,
        // nižší tracking error. Pokles od založení ne (fondy mají různé stáří), beta ne (není lepší/horší).
        riskRow('Kolísavost 1 rok', 'volatility_1y', 1, -1),
        riskRow('Kolísavost 3 roky', 'volatility_3y', 1, -1),
        riskRow('Kolísavost 5 let', 'volatility_5y', 1, -1),
        riskRow('Nejhorší pokles 1 rok', 'max_drawdown_1y', 1, 1),
        riskRow('Nejhorší pokles 3 roky', 'max_drawdown_3y', 1, 1),
        riskRow('Nejhorší pokles od založení', 'max_drawdown_inception', 1),
        // Výnos ÷ kolísavost – oba údaje v EUR (justETF „return per risk“; 1 rok: výnos/volatilita, 3 a 5 let: roční výnos/volatilita).
        // Výnos v Kč dělený kolísavostí v EUR by byl metodicky nekonzistentní (revize 18. 10. 2026).
        riskRow('Výnos / kolísavost 1 rok', 'return_per_risk_1y', 2, 1, false),
        riskRow('Výnos / kolísavost 3 roky', 'return_per_risk_3y', 2, 1, false),
        riskRow('Beta (vs trh)', 'beta', 2, undefined, false),
        riskRow('Tracking error', 'tracking_error', 2, -1),
      ],
    },
    {
      title: 'Dividendy',
      rows: [
        { label: 'Dividendový výnos', cell: (e) => {
          const d = num(e.current_dividend_yield_numeric);
          // „—“ = údaj chybí. Akumulační fond dividendy reinvestuje, komodity a krypto nevyplácejí → slovy, ne pomlčkou.
          if (d == null || d === 0) {
            if (komodita(e)) return <span className="text-slate-500" title="Komoditní a kryptoměnové produkty dividendy nevyplácejí">nevyplácí</span>;
            if (distTypeLabel(e.distribution_policy, e.distribution_frequency) === 'Akumulační') return <span className="text-slate-500" title="Akumulační fond dividendy reinvestuje uvnitř fondu">reinvestuje</span>;
          }
          return pct1(d);
        }, nej: { v: (e) => { const d = num(e.current_dividend_yield_numeric); return d != null && d > 0 ? d : null; }, smer: 1, fmt: pct1 } },
      ],
    },
    { title: 'Největší pozice (top 10)', rows: [vahyRow('Držené firmy', 'holding', 10)] },
    { title: 'Sektory', rows: [vahyRow('Rozložení sektorů', 'sector', 5)] },
    { title: 'Země', rows: [vahyRow('Geografické rozložení', 'country', 5)] },
  ];

  /* Vyhodit prázdné řádky a sekce, které tím zůstaly bez obsahu – a říct to JEDNOU poznámkou
     (dřív u komodit 9× „Data nejsou k dispozici“). */
  const visibleSections = sections
    .map((s) => ({ ...s, rows: s.rows.filter((r) => !r.omit) }))
    .filter((s) => s.rows.length > 0);
  const poziceChybi = etfs.some(poziceNeuplne);
  const vynechane = sections
    .filter((s) => !visibleSections.some((v) => v.title === s.title))
    .filter((s) => !(poziceChybi && s.title.startsWith('Největší pozice')))
    .map((s) => s.title.replace(/ \(.*\)$/, '').toLowerCase());

  const colW = etfs.length + 1;
  /* Vítěz řádku: aspoň 2 fondy s hodnotou a nejlepší hodnotu PO ZAOKROUHLENÍ (jak je vidět v buňce) má právě jeden. */
  const vitezove = new Map<Row, string | null>();
  const vitez = (r: Row, e: ComparisonETF) => {
    if (!r.nej) return false;
    if (!vitezove.has(r)) {
      const { v, smer, fmt } = r.nej;
      const hodnoty = etfs.map((x) => ({ isin: x.isin, v: v(x) })).filter((x): x is { isin: string; v: number } => x.v != null);
      let w: string | null = null;
      if (hodnoty.length >= 2) {
        const ext = smer === 1 ? Math.max(...hodnoty.map((x) => x.v)) : Math.min(...hodnoty.map((x) => x.v));
        const top = hodnoty.filter((x) => fmt(x.v) === fmt(ext));
        w = top.length === 1 ? top[0].isin : null;
      }
      vitezove.set(r, w);
    }
    return vitezove.get(r) === e.isin;
  };

  return (
    <>
      {/* DESKTOP: tabulka vedle sebe */}
      {/* Plovoucí hlavička s fondy (revize kola 4: u „Rok 2023“ nebo „Kolísavost“ nebylo vidět, který sloupec je
          který fond). Sticky funguje jen bez overflow na předkovi → kontejner NEMÁ overflow-x-auto; tabulka se od md
          (≥ 46 rem obsahu) vejde i se 4 fondy. Sticky jsou buňky th (spolehlivější v Safari než thead). */}
      <div className="hidden md:block rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm table-fixed border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky top-14 z-20 w-[12.5rem] rounded-tl-xl py-2.5 px-4 text-left align-middle text-xs font-medium uppercase tracking-wide text-slate-400 bg-slate-50 shadow-[inset_0_-1px_0_theme(colors.slate.200)]">Parametr</th>
              {etfs.map((e, i) => (
                <th key={e.isin} className={`sticky top-14 z-20 py-2.5 px-4 text-left align-middle bg-slate-50 shadow-[inset_0_-1px_0_theme(colors.slate.200)] ${i === etfs.length - 1 ? 'rounded-tr-xl' : ''}`}
                  style={{ borderTop: `3px solid ${barvaFondu(i)}` }}>
                  <div className="flex items-center gap-2.5">
                    <EmitentLogo nazev={e.name} size={28} monogram={e.fund_provider ?? e.name} />
                    <div className="min-w-0">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900 leading-tight">
                        <span aria-hidden="true" className="inline-block w-2.5 h-2.5 shrink-0 rounded-[3px]" style={{ background: barvaFondu(i) }} />
                        {platnyTicker(e.primary_ticker) ?? e.isin}
                      </span>
                      <Link href={`/etf/${e.isin}`} title={e.name} className="mt-0.5 block truncate text-xs font-normal text-slate-500 hover:text-teal-700 leading-snug">{kratkyNazev(e.name)}</Link>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleSections.map((sec) => (
              <React.Fragment key={sec.title}>
                <tr>
                  <td colSpan={colW} className="bg-slate-100/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-100">{sec.title}</td>
                </tr>
                {sec.rows.map((r, i) => (
                  <tr key={i} className="align-top [&>td]:border-b [&>td]:border-slate-100">
                    <td className="py-2.5 px-4 text-slate-500 font-medium">{r.label}</td>
                    {etfs.map((e) => (
                      <td key={e.isin} className={`py-2.5 px-4 text-slate-800 ${r.top ? '' : 'tabular-nums'}`}><Bunka vitez={vitez(r, e)}>{r.cell(e)}</Bunka></td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBIL: stack po parametrech (tabulka vedle sebe je na telefon moc široká) */}
      <div className="md:hidden space-y-4">
        <div className="grid gap-2 sticky top-14 z-10 bg-slate-50 py-2" style={{ gridTemplateColumns: `repeat(${etfs.length}, minmax(0,1fr))` }}>
          {etfs.map((e) => (
            <Link key={e.isin} href={`/etf/${e.isin}`} className="min-w-0 rounded-lg bg-white border border-slate-200 p-2 text-center" style={{ borderTop: `3px solid ${barvaFondu(etfs.indexOf(e))}` }}>
              <span className="block text-sm font-semibold text-slate-900 leading-tight truncate">{platnyTicker(e.primary_ticker) ?? e.isin}</span>
              <span className="block text-[11px] text-slate-500 truncate" title={e.name}>{kratkyNazev(e.name)}</span>
            </Link>
          ))}
        </div>
        {visibleSections.map((sec) => (
          <div key={sec.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{sec.title}</h3>
            {/* Jedna karta na skupinu řádků, řádky oddělené linkou (dřív karta na každý řádek = 40 rámečků pod sebou).
                Řádky s vlastním mobilním vykreslením (váhy, burzy) stojí samostatně. */}
            <div className="space-y-2">
              {sec.rows.reduce<Row[][]>((acc, r) => {
                if (r.mobil || !acc.length || acc[acc.length - 1][0].mobil) acc.push([r]); else acc[acc.length - 1].push(r);
                return acc;
              }, []).map((skup, si) => skup[0].mobil ? <div key={si}>{skup[0].mobil}</div> : (
                <div key={si} className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
                  {skup.map((r, i) => (
                    <div key={i} className="px-2.5 py-2">
                      <p className="text-xs text-slate-500 mb-1">{r.label}</p>
                      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${etfs.length}, minmax(0,1fr))` }}>
                        {etfs.map((e) => (
                          <div key={e.isin} className={`min-w-0 text-sm text-slate-800 ${r.top ? '' : 'tabular-nums'}`}><Bunka vitez={vitez(r, e)}>{r.cell(e)}</Bunka></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        <Check className="inline w-3.5 h-3.5 -mt-0.5 text-teal-700" aria-hidden="true" /> = nejlepší hodnota v řádku (vyšší výnos, nižší poplatek a kolísavost, menší pokles; při shodě po zaokrouhlení se neoznačuje).
        {etfs.some((e) => e._rizikoNesedi?.length) && <> Podtržená „—“ u rizika = údaj zdroje nesedí s jinou třídou téhož fondu (stejné portfolio), proto ho neuvádíme.</>}
        {vynechane.length > 0 && <> Vynechali jsme sekce {vynechane.join(', ')} – pro tyto fondy data nemáme (u komodit a krypta složení fondu nedává smysl).</>}
        {poziceChybi && <> Největší držené pozice {etfs.every(poziceNeuplne) ? '' : 'u některých fondů '}dočasně neuvádíme – ve zdroji dat chybí ta největší. Doplní se s další aktualizací.</>}
      </p>
    </>
  );
}
