'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, SlidersHorizontal, X, Star, Loader2, Download } from 'lucide-react';
import type { ScreenerRow, ScreenerOptions } from '@/lib/etf-data';
import CompareButton from '@/components/design-preview/CompareButton';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import { useCurrency, pickReturn, curLabel } from '@/components/design-preview/currencyStore';

type SortKey = 'name' | 'ter' | 'size' | 'ytd' | 'r1' | 'r3' | 'r5' | 'div' | 'vol';
type SortDir = 'asc' | 'desc';

const num = (v: number | null | undefined) => (v == null || Number.isNaN(v) ? null : Number(v));
const ter = (v: number | null) => (v == null ? '—' : `${v.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`);
const pct = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : ''}${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`);
/* Velikost fondu je z justETF VŽDY v EUR (i u USD tříd) → vždy €. Viz PorovnaniTable. */
const curSym = (_c?: string | null) => '€';
/** fund_size_numeric je v milionech MĚNY FONDU (justETF) → zobraz se symbolem té měny. */
const money = (v: number | null, cur: string | null = 'EUR') => {
  if (v == null) return '—';
  const s = curSym(cur);
  if (v >= 1000) return `${(v / 1000).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mld. ${s}`;
  return `${Math.round(v).toLocaleString('cs-CZ')} mil. ${s}`;
};
// Prázdná politika se nedomýšlí na akumulační; odvodí se z výplatní frekvence, jinak 'unknown'.
const distKind = (p: string | null | undefined, freq?: string | null): 'acc' | 'dist' | 'unknown' => {
  const s = p || '';
  if (/accumulat|thesaur|capitalis/i.test(s)) return 'acc';
  if (/distribut/i.test(s)) return 'dist';
  if (freq && /(quarter|month|annual|semi|dividend|income)/i.test(freq)) return 'dist';
  return 'unknown';
};
const distChip = (k: 'acc' | 'dist' | 'unknown') =>
  k === 'acc'
    ? { cls: 'bg-blue-50 text-blue-700', label: 'ACC' }
    : k === 'dist'
    ? { cls: 'bg-emerald-50 text-emerald-700', label: 'DIST' }
    : { cls: 'bg-slate-100 text-slate-500', label: '—' };

const PAGE = 25;

/* Investiční styly (faktory). Data nemají sloupec „faktor", takže se rozpoznávají
   z názvu fondu (`_blob` = název + ISIN + poskytovatel + tickery, lowercase).
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

const selCls = 'min-h-[40px] w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none';

/* Prezentační obal pole filtru (label + input/select). Definováno na úrovni
   modulu, aby si input při každém překreslení zachoval stabilní identitu a
   neztrácel fokus po každém stisku klávesy. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block"><span className="block mb-1 text-xs font-medium text-slate-500">{label}</span>{children}</label>
  );
}

/* Řaditelná hlavička sloupce. Stav řazení dostává propy, aby mohla zůstat mimo
   tělo komponenty (stabilní identita = žádný zbytečný remount hlavičky). */
function SortH({ k, children, right, tip, sortKey, sortDir, toggleSort }: {
  k: SortKey; children: React.ReactNode; right?: boolean; tip?: string;
  sortKey: SortKey; sortDir: SortDir; toggleSort: (k: SortKey) => void;
}) {
  return (
    <th aria-sort={sortKey === k ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'} className={`py-2.5 px-3 font-medium ${right ? 'text-right' : 'text-left'}`}>
      <button onClick={() => toggleSort(k)} title={tip} aria-label={`${tip ? tip + '. ' : ''}Seřadit podle sloupce, aktuálně ${sortKey === k ? (sortDir === 'asc' ? 'vzestupně' : 'sestupně') : 'neseřazeno'}`} className={`inline-flex items-center gap-1 hover:text-teal-700 ${tip ? 'cursor-help decoration-dotted underline-offset-4 hover:underline' : ''} ${sortKey === k ? 'text-teal-700' : ''}`}>
        {children}
        {sortKey === k ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
      </button>
    </th>
  );
}

/* Kompaktní hvězdičkové hodnocení do seznamu. */
function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center" title={`Hodnocení ${n}/5`} aria-label={`Hodnocení ${n} z 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3 h-3 ${i <= n ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
      ))}
    </span>
  );
}

/* Odvozené hodnoty (region/hedging/index/rating/fulltext) přicházejí PŘEDPOČÍTANÉ
   ze serveru (ScreenerRow._*), takže klient přes ~4900 fondů nepouští žádné regexy. */
interface Enriched {
  e: ScreenerRow;
  region: string | null;
  hedge: string;
  indexLabel: string;
  ratingVal: number | null;
  blob: string;
  tickers: string[];
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
  const [indexName, setIndexName] = useState('all');
  const [repl, setRepl] = useState('all');
  const [currency, setCurrency] = useState('all');
  const [hedging, setHedging] = useState('all');
  const [sizeCat, setSizeCat] = useState('all');
  const [factor, setFactor] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [leveraged, setLeveraged] = useState(false);
  const [terMax, setTerMax] = useState<string>('');
  const [sizeMin, setSizeMin] = useState<string>('');
  const [divMin, setDivMin] = useState<string>('');
  const [domicile, setDomicile] = useState('all');
  const [provider, setProvider] = useState('all');
  const [minAge, setMinAge] = useState('all');
  const [advOpen, setAdvOpen] = useState(false);

  const [sortKey, setSortKey] = useState<SortKey>('size');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [shown, setShown] = useState(PAGE);
  const [cur] = useCurrency();
  const rootRef = useRef<HTMLDivElement>(null);

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

  /* ────────────────────────────────────────────────────────────────────────
     STAV FILTRŮ V URL.
     Bez tohohle nešlo výběr nikomu poslat ani ho po čase zopakovat: uživatel si
     naklikal sestavu, ale odkaz vedl na prázdný screener. Do URL jdou jen hodnoty
     odlišné od výchozích, ať odkaz zůstane čitelný. Používáme replaceState (ne
     router.push), aby se nezanášela historie prohlížeče ani netriggeroval re-render
     serverové komponenty – filtrování běží celé na klientu.
     ──────────────────────────────────────────────────────────────────────── */
  const restored = useRef(false);
  /* Přišel v URL dotaz/index? Pak se do načtení celé databáze nesmí ukázat
     „Žádný fond neodpovídá filtrům“ – server posílá jen prvních 50 řádků a
     hledaný fond mezi nimi zpravidla není. Blikne prázdný výsledek a teprve
     pak se objeví ten správný. */
  const urlQuery = useRef(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const g = (k: string) => p.get(k);
    // ?q= (hledání z hlavičky) a ?index= (proklik ze srovnání indexů) chodily dřív
    // jako props ze serveru; ten je kvůli cachování číst nesmí (viz komentář
    // v src/app/srovnani/page.tsx), takže je přebíráme tady.
    if (g('q')) { setQ(g('q')!); urlQuery.current = true; }
    if (g('index')) { setIndexName(g('index')!); urlQuery.current = true; }
    if (g('kat')) setCategory(g('kat')!);
    if (g('vyplata')) setDist(g('vyplata')!);
    if (g('region')) setRegion(g('region')!);
    if (g('replikace')) setRepl(g('replikace')!);
    if (g('mena')) setCurrency(g('mena')!);
    if (g('zajisteni')) setHedging(g('zajisteni')!);
    if (g('velikost')) setSizeCat(g('velikost')!);
    if (g('styl')) setFactor(g('styl')!);
    if (g('rating')) setMinRating(Number(g('rating')) || 0);
    if (g('paka') === '1') setLeveraged(true);
    if (g('ter')) setTerMax(g('ter')!);
    if (g('minvel')) setSizeMin(g('minvel')!);
    if (g('divmin')) setDivMin(g('divmin')!);
    if (g('domicil')) setDomicile(g('domicil')!);
    if (g('poskytovatel')) setProvider(g('poskytovatel')!);
    if (g('stari')) setMinAge(g('stari')!);
    if (g('sort')) setSortKey(g('sort') as SortKey);
    if (g('smer')) setSortDir(g('smer') as SortDir);
    // Pokročilé filtry rozbalit, když z odkazu nějaký přišel – jinak by nebylo
    // vidět, proč je výsledek zúžený.
    if (['vyplata','region','replikace','mena','zajisteni','velikost','styl','rating','paka','ter','minvel','divmin','domicil','poskytovatel','stari'].some((k) => p.get(k))) {
      setAdvOpen(true);
    }
    restored.current = true;
    // Přišlo hledání z hlavičky nebo proklik na index → doscrollovat na výsledky,
    // ať je efekt odkazu vidět (dřív to dělaly efekty navázané na props).
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
    put('index', indexName, 'all');
    put('replikace', repl, 'all');
    put('mena', currency, 'all');
    put('zajisteni', hedging, 'all');
    put('velikost', sizeCat, 'all');
    put('styl', factor, 'all');
    if (minRating > 0) p.set('rating', String(minRating));
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
  }, [q, category, dist, region, indexName, repl, currency, hedging, sizeCat, factor, minRating, leveraged, terMax, sizeMin, divMin, domicile, provider, minAge, sortKey, sortDir]);

  // Odvozená pole už jsou předpočítaná na serveru – jen je přemapujeme do tvaru,
  // který filtr očekává (žádné skenování/regexy přes celou sadu na klientu).
  const enriched = useMemo<Enriched[]>(() =>
    rows.map((e) => ({
      e,
      region: e._region,
      hedge: e._hedge,
      indexLabel: e._index,
      ratingVal: e._rating,
      blob: e._blob,
      tickers: e._tickers,
    })), [rows]);

  // Volby filtrů + počty kategorií přicházejí předpočítané ze serveru (nad celou DB).
  const { regions, currencies, replications, categories, indexGroups, domiciles, providers } = {
    domiciles: options.domiciles,
    providers: options.providers,
    regions: options.regions,
    currencies: options.currencies,
    replications: options.replications,
    categories: options.categories,
    indexGroups: options.indexGroups,
  };
  const catCounts = useMemo(() => new Map(options.catCounts), [options]);

  // Filtrace nezávisí na měně (`cur`) – ta ovlivňuje jen řazení sloupců ytd/r1/r3/r5.
  const filteredRows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const terMaxN = terMax === '' ? null : parseFloat(terMax.replace(',', '.'));
    const sizeMinN = sizeMin === '' ? null : parseFloat(sizeMin.replace(/\s/g, '').replace(',', '.'));
    const divMinN = divMin === '' ? null : parseFloat(divMin.replace(',', '.'));

    return enriched.filter(({ e, region: reg, hedge, indexLabel, ratingVal, blob }) => {
      if (term && !blob.includes(term)) return false;
      if (category !== 'all' && e.category !== category) return false;
      if (!leveraged && e.is_leveraged) return false;
      if (dist === 'acc' && distKind(e.distribution_policy, e.distribution_frequency) !== 'acc') return false;
      if (dist === 'dist' && distKind(e.distribution_policy, e.distribution_frequency) !== 'dist') return false;
      if (region !== 'all' && reg !== region) return false;
      if (indexName !== 'all' && indexLabel !== indexName) return false;
      if (repl !== 'all' && e._repl !== repl) return false;
      if (currency !== 'all' && e.fund_currency !== currency) return false;
      if (hedging !== 'all') {
        if (hedging === 'unhedged' && hedge !== 'unhedged') return false;
        if (hedging === 'hedged' && hedge === 'unhedged') return false;
        if (hedging !== 'unhedged' && hedging !== 'hedged' && hedge !== hedging) return false;
      }
      if (factor !== 'all') {
        const f = FACTORS.find((x) => x.value === factor);
        if (f) {
          if (!f.match.some((m) => blob.includes(m))) return false;
          if (f.exclude?.some((m) => blob.includes(m))) return false;
        }
      }
      if (minRating > 0 && (ratingVal == null || ratingVal < minRating)) return false;
      const size = num(e.fund_size_numeric);
      if (sizeCat !== 'all' && size != null) {
        if (sizeCat === 'small' && !(size < 100)) return false;
        if (sizeCat === 'medium' && !(size >= 100 && size < 1000)) return false;
        if (sizeCat === 'large' && !(size >= 1000 && size < 10000)) return false;
        if (sizeCat === 'xlarge' && !(size >= 10000)) return false;
      }
      if (terMaxN != null && num(e.ter_numeric) != null && num(e.ter_numeric)! > terMaxN) return false;
      if (sizeMinN != null && (size == null || size < sizeMinN)) return false;
      if (divMinN != null) { const d = num(e.current_dividend_yield_numeric); if (d == null || d < divMinN) return false; }
      if (domicile !== 'all' && e._dom !== domicile) return false;
      if (provider !== 'all' && e.fund_provider !== provider) return false;
      if (minAge !== 'all') {
        // Fond bez data vzniku filtr na stáří NEPROJDE – tvrdit „je starší než X let"
        // bez data by bylo horší než ho vynechat.
        if (e._year == null) return false;
        if (new Date().getFullYear() - e._year < Number(minAge)) return false;
      }
      return true;
    });
  }, [enriched, q, category, dist, region, indexName, repl, currency, hedging, sizeCat, factor, minRating, leveraged, terMax, sizeMin, divMin, domicile, provider, minAge]);

  const filtered = useMemo(() => {
    const list = [...filteredRows];
    const term = q.trim().toLowerCase();

    // Skóre relevance pro hledaný výraz: přesná shoda ISIN/tickeru má přednost
    // před částečnou (aby „CSPX“ ukázal správný fond nahoře, ne náhodný substring).
    const relevance = (row: Enriched): number => {
      if (!term) return 0;
      if (row.e.isin.toLowerCase() === term || row.tickers.includes(term)) return 4;
      if (row.tickers.some((t) => t.startsWith(term))) return 3;
      const name = row.e.name.toLowerCase();
      if (name.startsWith(term)) return 2;
      if (name.includes(term)) return 1;
      return 0;
    };

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
    list.sort((A, B) => {
      if (term) {
        const ra = relevance(A), rb = relevance(B);
        if (ra !== rb) return rb - ra; // relevantnější nahoru, nezávisle na řazení sloupce
      }
      const va = get(A.e), vb = get(B.e);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      const cmp = typeof va === 'string' ? va.localeCompare(vb as string, 'cs') : (va as number) - (vb as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [filteredRows, sortKey, sortDir, cur, q]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir(k === 'name' || k === 'ter' ? 'asc' : 'desc'); }
    setShown(PAGE);
  };

  const reset = () => {
    setQ(''); setCategory('all'); setDist('all'); setRegion('all'); setIndexName('all');
    setRepl('all'); setCurrency('all'); setHedging('all'); setSizeCat('all'); setFactor('all'); setMinRating(0);
    setLeveraged(false); setTerMax(''); setSizeMin(''); setDivMin('');
    setDomicile('all'); setProvider('all'); setMinAge('all'); setShown(PAGE);
  };
  // Kategorie je samostatný tab, do odznaku „Pokročilé filtry“ ji nepočítáme.
  const activeCount =
    (dist !== 'all' ? 1 : 0) + (region !== 'all' ? 1 : 0) +
    (indexName !== 'all' ? 1 : 0) + (repl !== 'all' ? 1 : 0) + (currency !== 'all' ? 1 : 0) +
    (hedging !== 'all' ? 1 : 0) + (sizeCat !== 'all' ? 1 : 0) + (factor !== 'all' ? 1 : 0) + (minRating > 0 ? 1 : 0) +
    (leveraged ? 1 : 0) + (terMax !== '' ? 1 : 0) + (sizeMin !== '' ? 1 : 0) + (divMin !== '' ? 1 : 0) +
    (domicile !== 'all' ? 1 : 0) + (provider !== 'all' ? 1 : 0) + (minAge !== 'all' ? 1 : 0);
  const anyFilter = activeCount > 0 || q !== '' || category !== 'all';

  /* ────────────────────────────────────────────────────────────────────────
     EXPORT CSV.
     Exportuje CELÝ vyfiltrovaný výběr, ne jen zobrazenou stránku. Hlavička nese
     zdroj dat, datum a použité filtry – bez toho je výstup po čase nedoložitelný
     a nedá se zopakovat. Oddělovač `;` a desetinná čárka kvůli českému Excelu,
     BOM kvůli diakritice.
     ──────────────────────────────────────────────────────────────────────── */
  const exportCsv = () => {
    const dec = (v: number | null, d = 2) => (v == null ? '' : v.toFixed(d).replace('.', ','));
    const q2 = (v: string) => (/[";\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const distTxt = { acc: 'Akumulační', dist: 'Distribuční', unknown: 'Neuvedeno' };

    const aktivni = [
      q && `hledání: ${q}`,
      category !== 'all' && `kategorie: ${category}`,
      dist !== 'all' && `výplata: ${dist}`,
      region !== 'all' && `region: ${region}`,
      indexName !== 'all' && `index: ${indexName}`,
      repl !== 'all' && `replikace: ${repl}`,
      currency !== 'all' && `měna fondu: ${currency}`,
      hedging !== 'all' && `zajištění: ${hedging}`,
      sizeCat !== 'all' && `velikost: ${sizeCat}`,
      factor !== 'all' && `styl: ${factor}`,
      minRating > 0 && `min. hodnocení: ${minRating}`,
      leveraged && 'včetně pákových',
      terMax && `TER max: ${terMax} %`,
      sizeMin && `min. velikost: ${sizeMin} mil. EUR`,
      divMin && `min. div. výnos: ${divMin} %`,
      domicile !== 'all' && `domicil: ${domicile}`,
      provider !== 'all' && `poskytovatel: ${provider}`,
      minAge !== 'all' && `min. stáří: ${minAge} let`,
    ].filter(Boolean).join(', ') || 'žádné (celá databáze)';

    const hlavicka = [
      `# Export ze srovnávače ETF – etfpruvodce.cz`,
      `# Vyexportováno: ${new Date().toLocaleString('cs-CZ')}`,
      `# Data k datu: ${dataDate || 'neuvedeno'} (zdroj: justETF, kurzy ČNB)`,
      `# Použité filtry: ${aktivni}`,
      `# Fondů ve výběru: ${filtered.length} z ${total} v databázi`,
      `# Výnosy přepočtené do: ${curLabel[cur]}`,
      '',
    ];

    const sloupce = ['Název','ISIN','Ticker','Poskytovatel','Kategorie','Region','Sledovaný index','Domicil','Rok vzniku','TER (%)','Velikost (mil. EUR)','Měna fondu','Typ výplaty','Replikace','Div. výnos (%)',`YTD (${curLabel[cur]}, %)`,`1 rok (${curLabel[cur]}, %)`,`3 roky (${curLabel[cur]}, %)`,`5 let (${curLabel[cur]}, %)`,'Volatilita 1r (%)','Hodnocení','Páka'];

    const radky = filtered.map(({ e, region: reg, indexLabel, ratingVal }) => {
      const o = e as unknown as Record<string, unknown>;
      return [
        e.name, e.isin, e.primary_ticker ?? '', e.fund_provider ?? '', e.category ?? '', reg ?? '', indexLabel ?? '',
        e._dom ?? '', e._year != null ? String(e._year) : '',
        dec(num(e.ter_numeric)), dec(num(e.fund_size_numeric), 0), e.fund_currency ?? '',
        distTxt[distKind(e.distribution_policy)], e._repl ?? '',
        dec(num(e.current_dividend_yield_numeric)),
        dec(pickReturn(o, 'ytd', cur), 1), dec(pickReturn(o, '1y', cur), 1), dec(pickReturn(o, '3y', cur), 1),
        dec(pickReturn(o, '5y', cur), 1), dec(num(e.volatility_1y), 1),
        ratingVal != null ? String(ratingVal) : '', e.is_leveraged ? 'ano' : '',
      ].map((v) => q2(String(v))).join(';');
    });

    const csv = '\uFEFF' + [...hlavicka, sloupce.map(q2).join(';'), ...radky].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `etf-vyber-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  // Dotaz z URL a ještě nemáme celou databázi → nejde o „nic nenalezeno“, ale o načítání.
  const cekaNaData = !full && urlQuery.current;

  const bump = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => { setter(e.target.value); setShown(PAGE); };
  const bumpN = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => { setter(e.target.value); setShown(PAGE); };

  return (
    <div ref={rootRef} className="scroll-mt-20">
      {/* KATEGORIE JAKO TABY – nejvyšší dělení, vždy na jeden klik */}
      <div className="-mx-1 mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {[{ v: 'all', label: 'Vše' }, ...categories.map((c) => ({ v: c, label: c }))].map(({ v, label }) => {
          const active = category === v;
          const count = v === 'all' ? total : (catCounts.get(v) ?? 0);
          return (
            <button
              key={v}
              aria-pressed={active}
              onClick={() => { setCategory(v); setShown(PAGE); }}
              className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${active ? 'bg-teal-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-700'}`}
            >
              {label}
              <span className={`ml-1.5 tabular-nums text-xs ${active ? 'text-teal-100' : 'text-slate-400'}`}>{count.toLocaleString('cs-CZ')}</span>
            </button>
          );
        })}
      </div>

      {/* TOOLBAR */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            aria-label="Hledat fond podle názvu, ISIN, poskytovatele nebo tickeru"
            value={q}
            onChange={(e) => { setQ(e.target.value); setShown(PAGE); }}
            placeholder="Hledat podle názvu, ISIN, poskytovatele nebo tickeru…"
            className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
          />
        </div>

        {/* Primární filtry – vždy vidět */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field label="Region">
            <select aria-label="Region" value={region} onChange={bump(setRegion)} className={selCls}>
              <option value="all">Všechny regiony</option>
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Sledovaný index">
            <select aria-label="Sledovaný index" value={indexName} onChange={bump(setIndexName)} className={selCls}>
              <option value="all">Všechny indexy</option>
              {indexGroups.map((g) => (
                <optgroup key={g.heading} label={g.heading}>
                  {g.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field label="Typ výplaty">
            <select aria-label="Typ výplaty" value={dist} onChange={bump(setDist)} className={selCls}>
              <option value="all">Akum. i distrib.</option>
              <option value="acc">Akumulační</option>
              <option value="dist">Distribuční</option>
            </select>
          </Field>
          <Field label="Investiční styl">
            <select aria-label="Investiční styl (faktor)" value={factor} onChange={bump(setFactor)} className={selCls}>
              <option value="all">Všechny styly</option>
              {FACTORS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </Field>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button onClick={() => setAdvOpen((o) => !o)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-teal-300 hover:text-teal-700">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Pokročilé filtry
            {activeCount > 0 && <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-teal-600 text-white text-[11px] font-semibold">{activeCount}</span>}
          </button>
          {anyFilter && (
            <button onClick={reset} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-600"><X className="w-3.5 h-3.5" /> Vymazat vše</button>
          )}
        </div>

        {/* Pokročilé filtry – rozbalovací */}
        {advOpen && (
          <div className="mt-4 border-t border-slate-100 pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Field label="Replikace">
              <select aria-label="Replikace" value={repl} onChange={bump(setRepl)} className={selCls}>
                <option value="all">Každá replikace</option>
                {replications.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Domicil fondu">
              <select aria-label="Domicil fondu" value={domicile} onChange={bump(setDomicile)} className={selCls}>
                <option value="all">Všechny domicily</option>
                {domiciles.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Poskytovatel">
              <select aria-label="Poskytovatel fondu" value={provider} onChange={bump(setProvider)} className={selCls}>
                <option value="all">Všichni poskytovatelé</option>
                {providers.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Minimální stáří fondu">
              <select aria-label="Minimální stáří fondu" value={minAge} onChange={bump(setMinAge)} className={selCls}>
                <option value="all">Bez omezení</option>
                <option value="3">3 roky a více</option>
                <option value="5">5 let a více</option>
                <option value="10">10 let a více</option>
                <option value="15">15 let a více</option>
              </select>
            </Field>
            <Field label="Měna fondu">
              <select aria-label="Měna fondu" value={currency} onChange={bump(setCurrency)} className={selCls}>
                <option value="all">Všechny měny</option>
                {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Měnové zajištění">
              <select aria-label="Měnové zajištění" value={hedging} onChange={bump(setHedging)} className={selCls}>
                <option value="all">Všechny typy</option>
                <option value="unhedged">Nezajištěné</option>
                <option value="hedged">Zajištěné (všechny)</option>
                <option value="eur_hedged">EUR zajištěné</option>
                <option value="usd_hedged">USD zajištěné</option>
                <option value="gbp_hedged">GBP zajištěné</option>
                <option value="chf_hedged">CHF zajištěné</option>
              </select>
            </Field>
            <Field label="Velikost fondu">
              <select aria-label="Velikost fondu" value={sizeCat} onChange={bump(setSizeCat)} className={selCls}>
                <option value="all">Všechny velikosti</option>
                <option value="small">Malé (&lt; 100 mil.)</option>
                <option value="medium">Střední (100 mil.–1 mld.)</option>
                <option value="large">Velké (1–10 mld.)</option>
                <option value="xlarge">Velmi velké (&gt; 10 mld.)</option>
              </select>
            </Field>
            <Field label="Minimální hodnocení">
              <select aria-label="Minimální hodnocení" value={minRating} onChange={(e) => { setMinRating(Number(e.target.value)); setShown(PAGE); }} className={selCls}>
                <option value={0}>Všechna hodnocení</option>
                <option value={1}>★ 1+</option>
                <option value={2}>★★ 2+</option>
                <option value={3}>★★★ 3+</option>
                <option value={4}>★★★★ 4+</option>
                <option value={5}>★★★★★ 5</option>
              </select>
            </Field>
            <Field label="Max. TER (%)">
              <input type="number" inputMode="decimal" step="0.01" min="0" placeholder="např. 0,20" value={terMax} onChange={bumpN(setTerMax)} className={selCls} />
            </Field>
            <Field label="Min. velikost (mil.)">
              <input type="number" inputMode="numeric" step="10" min="0" placeholder="např. 500" value={sizeMin} onChange={bumpN(setSizeMin)} className={selCls} />
            </Field>
            <Field label="Min. dividendový výnos (%)">
              <input type="number" inputMode="decimal" step="0.1" min="0" placeholder="např. 2,0" value={divMin} onChange={bumpN(setDivMin)} className={selCls} />
            </Field>
            <label className="flex items-end gap-2 pb-1.5">
              <input type="checkbox" checked={leveraged} onChange={(e) => { setLeveraged(e.target.checked); setShown(PAGE); }} className="w-4 h-4 rounded accent-teal-600" />
              <span className="text-sm text-slate-700">Zobrazit i páková ETF</span>
            </label>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        {full ? (
          <p className="text-sm text-slate-500">Nalezeno <span className="font-semibold text-slate-800">{filtered.length}</span> z {total} fondů. Klikněte na fond pro detail, tlačítkem <span className="font-medium text-slate-700">+</span> přidáte do porovnání.</p>
        ) : (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500"><Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" /> Načítám celou databázi ({total.toLocaleString('cs-CZ')} fondů) pro filtrování…</p>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            disabled={!full || filtered.length === 0}
            title="Stáhne celý vyfiltrovaný výběr jako CSV (otevře se v Excelu) včetně zdroje a data dat."
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" /> Stáhnout CSV
          </button>
          <CurrencyToggle size="sm" />
        </div>
      </div>

      {/* TABULKA – desktop */}
      <div className="mt-3 hidden md:block rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full min-w-[64rem] text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
              <SortH k="name" sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>Fond</SortH>
              <SortH k="ter" right tip="TER (Total Expense Ratio) = celkový roční poplatek za správu fondu v procentech. Čím nižší, tím lépe – strhává se automaticky z hodnoty fondu." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>TER</SortH>
              <SortH k="size" right tip="Velikost fondu = kolik peněz fond celkem spravuje (v měně fondu). Větší fond obvykle znamená lepší likviditu a nižší riziko zrušení." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>Velikost</SortH>
              <SortH k="ytd" right tip="YTD (Year To Date) = výnos od začátku letošního roku, přepočtený do zvolené měny." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>YTD ({curLabel[cur]})</SortH>
              <SortH k="r1" right tip="Výnos za poslední 1 rok (kumulativně), přepočtený do zvolené měny." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>1R ({curLabel[cur]})</SortH>
              <SortH k="r3" right tip="Výnos za poslední 3 roky (kumulativně, ne ročně), přepočtený do zvolené měny." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>3R ({curLabel[cur]})</SortH>
              <SortH k="r5" right tip="Výnos za posledních 5 let (kumulativně, ne ročně), přepočtený do zvolené měny. Pětiletý horizont řekne o fondu víc než jeden rok." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>5L ({curLabel[cur]})</SortH>
              <SortH k="vol" right tip="Volatilita za 1 rok = jak moc cena fondu kolísala. Vyšší číslo znamená divočejší průběh, ne nutně horší fond." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>Kolísavost</SortH>
              <SortH k="div" right tip="Dividendový výnos = roční dividenda vůči ceně fondu v procentech. U akumulačních fondů se dividendy reinvestují uvnitř." sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort}>Div.</SortH>
              <th className="py-2.5 px-3 font-medium text-center" title="Typ výplaty: ACC (akumulační) = dividendy se reinvestují uvnitř fondu. DIST (distribuční) = dividendy se vyplácejí na účet.">Typ</th>
              <th className="py-2.5 px-3 font-medium text-center"><span className="sr-only">Porovnat</span></th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, shown).map(({ e, region: reg, ratingVal }) => (
              <tr key={e.isin} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-3">
                  <Link href={`/etf/${e.isin}`} className="font-medium text-teal-700 hover:text-teal-800">
                    {e.name.length > 44 ? e.name.slice(0, 44) + '…' : e.name}
                  </Link>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    {e.primary_ticker ?? e.isin}{reg ? ` · ${reg}` : ''}
                    {e.is_leveraged && <span className="rounded bg-amber-50 px-1 text-[10px] font-medium text-amber-700">páka</span>}
                    {ratingVal != null && <Stars n={ratingVal} />}
                  </span>
                </td>
                <td className="py-3 px-3 text-right tabular-nums font-medium text-slate-800">{ter(num(e.ter_numeric))}</td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-600">{money(num(e.fund_size_numeric), e.fund_currency)}</td>
                {(() => { const o = e as unknown as Record<string, unknown>; const ytd = pickReturn(o, 'ytd', cur), r1 = pickReturn(o, '1y', cur), r3 = pickReturn(o, '3y', cur), r5 = pickReturn(o, '5y', cur), vol = num(e.volatility_1y); return (<>
                <td className={`py-3 px-3 text-right tabular-nums ${(ytd ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(ytd)}</td>
                <td className={`py-3 px-3 text-right tabular-nums font-medium ${(r1 ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(r1)}</td>
                <td className={`py-3 px-3 text-right tabular-nums ${(r3 ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(r3)}</td>
                <td className={`py-3 px-3 text-right tabular-nums ${(r5 ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(r5)}</td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-600">{vol == null ? '—' : `${vol.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %`}</td>
                </>); })()}
                <td className="py-3 px-3 text-right tabular-nums text-slate-600">{e.current_dividend_yield_numeric != null ? `${Number(e.current_dividend_yield_numeric).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %` : '—'}</td>
                <td className="py-3 px-3 text-center">
                  {(() => { const c = distChip(distKind(e.distribution_policy, e.distribution_frequency)); return (
                  <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full ${c.cls}`}>
                    {c.label}
                  </span>); })()}
                </td>
                <td className="py-3 px-3">
                  <div className="flex justify-center"><CompareButton isin={e.isin} label={e.primary_ticker ?? e.name.slice(0, 8)} variant="chip" /></div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={11} className="py-10 text-center text-sm text-slate-400">
                {cekaNaData
                  ? <span className="inline-flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" /> Hledám ve všech {total.toLocaleString('cs-CZ')} fondech…</span>
                  : <>Žádný fond neodpovídá filtrům. <button onClick={reset} className="text-teal-700 hover:underline">Vymazat filtry</button></>}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* KARTY – mobil (stejná data jako tabulka, jen jiné vykreslení) */}
      <div className="mt-3 md:hidden space-y-2">
        {filtered.slice(0, shown).map(({ e, region: reg, ratingVal }) => {
          const o = e as unknown as Record<string, unknown>;
          const ytd = pickReturn(o, 'ytd', cur), r1 = pickReturn(o, '1y', cur), r3 = pickReturn(o, '3y', cur);
          return (
            <div key={e.isin} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/etf/${e.isin}`} className="font-medium text-teal-700 hover:text-teal-800 leading-tight">
                    {e.name.length > 44 ? e.name.slice(0, 44) + '…' : e.name}
                  </Link>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                    {e.primary_ticker ?? e.isin}{reg ? ` · ${reg}` : ''}
                    {e.is_leveraged && <span className="rounded bg-amber-50 px-1 text-[10px] font-medium text-amber-700">páka</span>}
                    {ratingVal != null && <Stars n={ratingVal} />}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-slate-400">1R ({curLabel[cur]})</p>
                  <p className={`tabular-nums font-semibold ${(r1 ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(r1)}</p>
                </div>
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <dt className="text-slate-400">TER</dt>
                  <dd className="tabular-nums font-medium text-slate-800">{ter(num(e.ter_numeric))}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">YTD ({curLabel[cur]})</dt>
                  <dd className={`tabular-nums font-medium ${(ytd ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(ytd)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">3R ({curLabel[cur]})</dt>
                  <dd className={`tabular-nums font-medium ${(r3 ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(r3)}</dd>
                </div>
              </dl>
              <div className="mt-3 flex items-center justify-between gap-2">
                {(() => { const c = distChip(distKind(e.distribution_policy, e.distribution_frequency)); return (
                <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full ${c.cls}`}>
                  {c.label}
                </span>); })()}
                <CompareButton isin={e.isin} label={e.primary_ticker ?? e.name.slice(0, 8)} variant="chip" />
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
            {cekaNaData
              ? <span className="inline-flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" /> Hledám ve všech {total.toLocaleString('cs-CZ')} fondech…</span>
              : <>Žádný fond neodpovídá filtrům. <button onClick={reset} className="text-teal-700 hover:underline">Vymazat filtry</button></>}
          </div>
        )}
      </div>

      {shown < filtered.length && (
        <div className="mt-4 text-center">
          <button onClick={() => setShown((s) => s + PAGE)} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">
            Zobrazit další ({Math.min(PAGE, filtered.length - shown)})
          </button>
        </div>
      )}
    </div>
  );
}
