import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import type { ETF } from '@/types/etf';
import {
  TrendingUp, ArrowRight, ArrowUpRight, Coins, Layers, Banknote, Scale,
  ShieldCheck, AlertTriangle, Info, Database, User, CalendarDays, BadgeCheck,
  Percent, Landmark, Calculator, Building2, Globe2, PieChart, Star, HelpCircle,
  BookOpen, Wallet,
} from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import CompareButton from '@/components/design-preview/CompareButton';
import EtfReturns from '@/components/design-preview/EtfReturns';
import EtfCalendarReturns, { type CalCol } from '@/components/design-preview/EtfCalendarReturns';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const dynamicParams = true;

/* Práh „hlavy" pro Google indexaci (mil. EUR AUM). ≥ 2 000 = ~329 největších
   a nejhledanějších fondů. Viz experiment níže. */
const HEAD_MIN_SIZE = 2000;

/* Unikátní tickery fondu (primary + burzovní, dedup case-insensitive, pryč „-").
   Lidé hledají podle tickeru, ne ISIN – a `primary_ticker` NENÍ spolehlivě ten
   nejhledanější (např. iShares S&P 500 má primary „CSP1", ale hledá se „CSPX").
   Proto neukazujeme jeden, ale VŠECHNY – v obsahu i (limitovaně) v titulku. */
const TICKER_KEYS = [
  'primary_ticker', 'exchange_1_ticker', 'exchange_2_ticker', 'exchange_3_ticker',
  'exchange_4_ticker', 'exchange_5_ticker', 'exchange_6_ticker', 'exchange_7_ticker',
  'exchange_8_ticker', 'exchange_9_ticker', 'exchange_10_ticker',
];
function uniqueTickers(row: Record<string, unknown> | null | undefined): string[] {
  if (!row) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of TICKER_KEYS) {
    const v = (row[k] ?? '').toString().trim();
    if (v && v !== '-' && !seen.has(v.toUpperCase())) { seen.add(v.toUpperCase()); out.push(v); }
  }
  return out;
}

/* Předgenerujeme jen pár nejznámějších fondů; zbytek se dogeneruje on-demand. */
export async function generateStaticParams() {
  return ['IE00B5BMR087', 'IE00BK5BQT80', 'IE00B4L5Y983'].map((isin) => ({ isin }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ isin: string }> },
): Promise<Metadata> {
  const { isin } = await params;
  const { data } = await supabaseAdmin
    .from('etf_funds')
    .select('name, fund_size_numeric, ' + TICKER_KEYS.join(', '))
    .eq('isin', isin).single();
  const fund = data as Record<string, unknown> | null;
  const name = (fund?.name as string) || 'ETF fond';
  const tickers = uniqueTickers(fund);
  const titleTk = tickers.slice(0, 4).join(', '); // titulek: max 4 (kdyby jich měl fond 8)
  // DIFERENCOVANÁ INDEXACE (experiment od 2026-07-07, měří CEO):
  // - Bing/Seznam/ostatní: indexovat VŠECHNY detaily – už dnes z nich chodí traffic
  //   (GA4: 54 organických vstupů / 28 dní), který jsme si dřív blanket-noindexem
  //   podřezávali.
  // - Google: indexovat jen „hlavu" (velké/hledané fondy ≥ HEAD_MIN_SIZE), aby 4500+
  //   šablonových detailů nedělalo na mladé doméně thin-content bloat; dlouhý ocas
  //   necháme googlebot-noindex. Po 2–4 týdnech vyhodnotit a případně rozšířit.
  const isHead = Number(fund?.fund_size_numeric ?? 0) >= HEAD_MIN_SIZE;
  return {
    // Brand „| ETF průvodce.cz" doplní layout template – neduplikovat.
    title: titleTk ? `${name} (${titleTk}): výnos v Kč, TER` : `${name} – detail fondu, výnos v Kč`,
    description: tickers.length
      ? `${name}. Burzovní tickery: ${tickers.slice(0, 5).join(', ')}. ISIN ${isin} – TER, výnos přepočtený do korun, složení, rizika a kde koupit fond. Pro české investory.`
      : `Detail fondu ${name} (ISIN ${isin}): TER, výnos přepočtený do korun, složení, rizika a kde koupit fond. Pro české investory.`,
    robots: isHead
      ? { index: true, follow: true }
      : { index: true, follow: true, googleBot: { index: false, follow: true } },
  };
}

/* ---------- formátovače ---------- */
const num = (v: number | null | undefined) =>
  v == null || Number.isNaN(v) ? null : Number(v);

const ter = (v: number | null | undefined) => {
  const n = num(v);
  return n == null ? '—' : `${n.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;
};

const pct = (v: number | null | undefined) => {
  const n = num(v);
  if (n == null) return '—';
  const s = n.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${n > 0 ? '+' : ''}${s} %`;
};

/** Velikost fondu je z justETF VŽDY v EUR (i u USD tříd) → vždy €. Ověřeno proti justETF. */
const curSym = (_c?: string | null) => '€';
const money = (v: number | null | undefined, cur: string | null = 'EUR') => {
  const n = num(v);
  if (n == null) return '—';
  const sym = curSym(cur);
  if (n >= 1000) {
    const mld = n / 1000;
    return `${mld.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mld. ${sym}`;
  }
  return `${Math.round(n).toLocaleString('cs-CZ')} mil. ${sym}`;
};

/** oprava systematických překlepů z generovaných DB popisů (IShares, dividenday, p.a..) */
const cleanDesc = (raw: string | null | undefined): string =>
  (raw ?? '')
    .replace(/\bIShares\b/g, 'iShares')
    .replace(/\bdividenday\b/g, 'dividendy')
    .replace(/\bp\.a\.\./g, 'p.a.')
    .replace(/\s{2,}/g, ' ')
    .trim();

/** lidsky čitelné datum z "19 May 2010" */
const dateLabel = (raw: string | null | undefined) => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
};

/* ---------- odvození popisků z dat (žádné hodnoty napevno) ---------- */
// Tri-state politika: 'acc' | 'dist' | 'unknown'. Prázdná politika se NIKDY
// nedomýšlí na akumulační – radši se odvodí z výplatní frekvence, jinak „neuvedeno".
const PAYOUT_FREQ = /(quarter|month|annual|semi|dividend|income)/i;
const distKind = (
  policy: string | null | undefined,
  freq?: string | null,
): 'acc' | 'dist' | 'unknown' => {
  const p = policy || '';
  if (/accumulat|thesaur|capitalis/i.test(p)) return 'acc';
  if (/distribut/i.test(p)) return 'dist';
  // politika chybí → výplatní frekvence je definiční signál distribuce
  if (freq && PAYOUT_FREQ.test(freq)) return 'dist';
  return 'unknown';
};
const distLabelOf = (kind: 'acc' | 'dist' | 'unknown') =>
  kind === 'acc' ? 'Akumulační' : kind === 'dist' ? 'Distribuční' : 'Neuvedeno';
const replLabel = (rep: string | null | undefined) => {
  const s = (rep || '').toLowerCase();
  if (s.includes('synth') || s.includes('swap')) return 'Syntetická (swap)';
  if (s.includes('physical') || s.includes('full') || s.includes('sampl') || s.includes('optim')) return 'Fyzická';
  return rep || '—';
};
const DOMICILE_CS: Record<string, string> = {
  Ireland: 'Irsko', Luxembourg: 'Lucembursko', Germany: 'Německo', France: 'Francie',
  Netherlands: 'Nizozemsko', Switzerland: 'Švýcarsko', 'United Kingdom': 'Spojené království',
};
const domLabel = (d: string | null | undefined) => (d ? DOMICILE_CS[d] ?? d : '—');
const volDesc = (v: number | null) =>
  v == null ? 'Data o kolísavosti nejsou k dispozici.'
    : v < 10 ? 'Nízká kolísavost.'
    : v < 18 ? 'Střední kolísavost, typická pro široký akciový index.'
    : v < 28 ? 'Zvýšená kolísavost – počítejte s výraznějšími výkyvy.'
    : 'Vysoká kolísavost – hodnota může prudce kolísat.';

/* ---------- výkonnostní pruh ---------- */
function PerfBar({ value, max }: { value: number | null; max: number }) {
  const v = value ?? 0;
  const pos = v >= 0;
  const w = Math.min(100, (Math.abs(v) / max) * 100);
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`h-full rounded-full ${pos ? 'bg-emerald-500' : 'bg-red-500'}`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

/* ---------- jednoduchý řádek s váhou (držené pozice / sektory / země) ---------- */
function WeightRow({ label, weight, max }: { label: string; weight: number; max: number }) {
  const w = Math.min(100, (weight / max) * 100);
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-40 sm:w-48 shrink-0 truncate text-sm text-slate-700">{label}</span>
      <span className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <span className="block h-full rounded-full bg-teal-600" style={{ width: `${w}%` }} />
      </span>
      <span className="w-14 shrink-0 text-right text-sm tabular-nums font-medium text-slate-700">
        {weight.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %
      </span>
    </div>
  );
}

/* ---------- štítek (badge) ---------- */
function Badge({ icon: Icon, children }: { icon: typeof Percent; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
      <Icon className="w-3.5 h-3.5 text-teal-700" strokeWidth={2} />
      {children}
    </span>
  );
}

/* ---------- nadpis sekce ---------- */
function SectionHead({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
      {desc && <p className="mt-1 text-sm text-slate-500 leading-relaxed">{desc}</p>}
    </div>
  );
}

export default async function ETFDetailPreview(
  { params }: { params: Promise<{ isin: string }> },
) {
  const { isin } = await params;
  const { data } = await supabaseAdmin.from('etf_funds').select('*').eq('isin', isin).single();
  if (!data) notFound();

  const etf = data as ETF;
  // CZK přepočty (NEJSOU v typu ETF, ale jsou v DB)
  const r = data as Record<string, unknown>;
  const czk = {
    y1: num(r.return_1y_czk as number),
    y3: num(r.return_3y_czk as number),
    y5: num(r.return_5y_czk as number),
    ytd: num(r.return_ytd_czk as number),
  };
  const usd = {
    y1: num(r.return_1y_usd as number),
    y3: num(r.return_3y_usd as number),
    y5: num(r.return_5y_usd as number),
    ytd: num(r.return_ytd_usd as number),
  };
  const eur = {
    y1: num(r.return_1y as number),
    y3: num(r.return_3y as number),
    y5: num(r.return_5y as number),
    ytd: num(r.return_ytd as number),
  };
  const returnsByCur = { CZK: czk, EUR: eur, USD: usd };

  const ticker = etf.primary_ticker || '—';
  const allTickers = uniqueTickers(etf as unknown as Record<string, unknown>);
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  // krátký název pro nadpis – odvozený z názvu fondu (ne napevno)
  const shortName = etf.name.replace(/\s+UCITS ETF.*/i, '').replace(/\s+\(.*\)/, '').trim();

  // měnově zajištěný (hedged) fond – z názvu. Zajištění je jen do EUR/USD (měny fondu),
  // NIKDY do CZK → český investor nese kurzové riziko fund_currency/CZK vždy.
  const isHedged = /\bhedged\b|\bhdg\b|zajišt/i.test(etf.name || '');

  // odvozené parametry z dat
  const dKind = distKind(etf.distribution_policy, etf.distribution_frequency);
  const isAcc = dKind === 'acc';
  const isDist = dKind === 'dist';
  const distText = distLabelOf(dKind);
  const replText = replLabel(etf.replication);
  const domText = domLabel(etf.fund_domicile);
  const divYield = num(r.current_dividend_yield_numeric as number);
  const vol1 = num(etf.volatility_1y);
  const vol3 = num(etf.volatility_3y);
  const vol5 = num(etf.volatility_5y);
  const dd1 = num(etf.max_drawdown_1y);
  const dd3 = num(etf.max_drawdown_3y);
  const dd5 = num(etf.max_drawdown_5y);
  const sharpe = num(r.return_per_risk_1y as number);

  // roční (kalendářní) výnosy – měnově citlivé (return_<rok>_czk/_usd v DB jsou)
  const currentYear = today.getFullYear();
  const calCols: CalCol[] = [2021, 2022, 2023, 2024, 2025]
    .map((y) => ({
      year: y,
      vals: {
        EUR: num(r[`return_${y}`] as number),
        CZK: num(r[`return_${y}_czk`] as number) ?? num(r[`return_${y}`] as number),
        USD: num(r[`return_${y}_usd`] as number) ?? num(r[`return_${y}`] as number),
      },
    }))
    .filter((c) => c.vals.EUR != null || c.vals.CZK != null || c.vals.USD != null);
  // letošní rok (YTD) jako poslední, viditelně odlišený sloupec
  const ytdCol: CalCol = {
    year: currentYear,
    ytd: true,
    vals: {
      EUR: num(r.return_ytd as number),
      CZK: num(r.return_ytd_czk as number) ?? num(r.return_ytd as number),
      USD: num(r.return_ytd_usd as number) ?? num(r.return_ytd as number),
    },
  };
  const hasYtd = ytdCol.vals.EUR != null || ytdCol.vals.CZK != null || ytdCol.vals.USD != null;
  const calCols2 = hasYtd ? [...calCols, ytdCol] : calCols;

  // krátká období (v měně fondu) + kolísavost pro výnosovou sekci
  const shortPeriods = {
    m1: num(r.return_1m as number),
    m3: num(r.return_3m as number),
    m6: num(r.return_6m as number),
  };
  const volForReturns = { v3: vol3, v5: vol5 };

  // burzy / listingy – kde a v jaké měně se obchoduje
  const exchanges = Array.from({ length: 10 }, (_, i) => ({
    name: (etf as unknown as Record<string, string>)[`exchange_${i + 1}_name`],
    ticker: (etf as unknown as Record<string, string>)[`exchange_${i + 1}_ticker`],
    currency: (etf as unknown as Record<string, string>)[`exchange_${i + 1}_currency`],
  })).filter((e) => e.name && e.name.trim() !== '' && e.ticker && e.ticker.trim() !== '').slice(0, 6);

  /* držené pozice (top, bez prázdných) */
  const holdings = Array.from({ length: 10 }, (_, i) => ({
    name: (etf as unknown as Record<string, string>)[`holding_${i + 1}_name`],
    weight: num((etf as unknown as Record<string, number>)[`holding_${i + 1}_weight`]),
  })).filter((h) => h.name && h.name.trim() !== '' && h.weight != null && h.weight > 0);
  const holdingsMax = Math.max(...holdings.map((h) => h.weight ?? 0), 1);
  const top10Sum = holdings.reduce((s, h) => s + (h.weight ?? 0), 0);

  /* země (top, bez prázdných) */
  const countries = Array.from({ length: 5 }, (_, i) => ({
    name: (etf as unknown as Record<string, string>)[`country_${i + 1}_name`],
    weight: num((etf as unknown as Record<string, number>)[`country_${i + 1}_weight`]),
  })).filter((c) => c.name && c.name.trim() !== '' && c.weight != null && c.weight > 0);
  const countryMax = Math.max(...countries.map((c) => c.weight ?? 0), 1);

  /* sektory (top, bez prázdných) */
  const sectors = Array.from({ length: 5 }, (_, i) => ({
    name: (etf as unknown as Record<string, string>)[`sector_${i + 1}_name`],
    weight: num((etf as unknown as Record<string, number>)[`sector_${i + 1}_weight`]),
  })).filter((s) => s.name && s.name.trim() !== '' && s.weight != null && s.weight > 0);
  const sectorMax = Math.max(...sectors.map((s) => s.weight ?? 0), 1);

  /* český překlad názvů zemí a sektorů (běžné případy) */
  const trCountry: Record<string, string> = {
    'United States': 'Spojené státy',
    Ireland: 'Irsko',
    Other: 'Ostatní',
  };
  const trSector: Record<string, string> = {
    Technology: 'Technologie',
    Telecommunication: 'Komunikační služby',
    'Communication Services': 'Komunikační služby',
    'Consumer Discretionary': 'Spotřební zboží (cyklické)',
    Financials: 'Finance',
    Healthcare: 'Zdravotnictví',
    Industrials: 'Průmysl',
    Other: 'Ostatní sektory',
  };

  /* ---------- JSON-LD ---------- */
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: etf.name,
    identifier: etf.isin,
    category: 'ETF',
    provider: { '@type': 'Organization', name: etf.fund_provider },
    feesAndCommissionsSpecification: etf.ter_numeric != null ? `${etf.ter_numeric} % TER (roční nákladovost)` : undefined,
    url: `https://etfpruvodce.cz/etf/${etf.isin}`,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Srovnání ETF', item: 'https://etfpruvodce.cz/srovnani-etf' },
      { '@type': 'ListItem', position: 3, name: etf.name, item: `https://etfpruvodce.cz/etf/${etf.isin}` },
    ],
  };

  const ratingVal = num(etf.rating);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
            </span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-28">
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/srovnani" className="hover:text-slate-600">Srovnání ETF</Link>
          <span>/</span>
          <span className="text-slate-600 truncate">{shortName}</span>
        </nav>

        {/* HLAVIČKA FONDU */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-5 py-6 md:px-9 md:py-8">
            <div className="md:flex md:items-start md:justify-between gap-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {etf.fund_provider}</span>
                  <span>·</span>
                  <span>Index {etf.index_name}</span>
                </div>
                <h1 className="mt-1.5 text-2xl md:text-3xl font-bold tracking-tight leading-tight">{etf.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
                  <span className="font-medium text-white" title="Tickery na burzách">{allTickers.length ? allTickers.join(' · ') : ticker}</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs">ISIN {etf.isin}</span>
                  {ratingVal != null && (
                    <span className="inline-flex items-center gap-1 text-amber-300" aria-label={`Hodnocení ${ratingVal} z 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < ratingVal ? 'fill-amber-300' : 'text-slate-600'}`} strokeWidth={1.5} />
                      ))}
                      <span className="ml-0.5 text-xs text-slate-300">{ratingVal}/5</span>
                    </span>
                  )}
                </div>

                {/* Klíčové štítky / fakta */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge icon={Percent}>TER {ter(etf.ter_numeric)}</Badge>
                  <Badge icon={Scale}>{money(etf.fund_size_numeric, etf.fund_currency)}</Badge>
                  <Badge icon={Coins}>{distText}</Badge>
                  <Badge icon={Layers}>{replText}</Badge>
                  <Badge icon={Landmark}>Domicil {domText}</Badge>
                  {isDist && divYield != null && <Badge icon={Banknote}>Div. výnos {pct(divYield).replace('+', '')}</Badge>}
                </div>
              </div>

              <div className="mt-5 md:mt-0 md:w-64 shrink-0">
                <Link href="/kde-koupit" className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 w-full">
                  Kde koupit tento fond <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="mt-2.5">
                  <CompareButton isin={etf.isin} label={ticker !== '—' ? ticker : shortName} variant="hero" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VÝKONNOST – přepínatelná měna (default Kč) */}
        <section className="pb-10">
          <SectionHead
            title="Výkonnost fondu"
            desc="Kolik fond reálně vydělal – přepněte měnu podle toho, jak to pocítíte na účtu. Kč zahrnuje pohyb kurzu (bez daní a poplatků brokera)."
          />
          <EtfReturns byCur={returnsByCur} fundCurrency={etf.fund_currency} short={shortPeriods} vol={volForReturns} />
        </section>

        {/* VÝNOS PO KALENDÁŘNÍCH LETECH (+ letošní YTD, měnově citlivé) */}
        {calCols2.length > 0 && (
          <section className="pb-10">
            <SectionHead title="Výnos po jednotlivých letech" desc="Roční výkonnost fondu včetně letošního roku (YTD). Ukazuje, jak rozdílné jednotlivé roky na trhu byly – ne každý je růstový. Přepněte měnu pro reálný dopad kurzu." />
            <EtfCalendarReturns cols={calCols2} />
          </section>
        )}

        {/* NÁKLADY A ZÁKLADNÍ FAKTA */}
        <section className="pb-10">
          <SectionHead title="Náklady a základní fakta" desc="Klíčové parametry fondu na jednom místě." />

          {/* Tabulka na desktopu */}
          <div className="hidden md:block rounded-lg border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {([
                  [<InfoTip key="ter" label="Total Expense Ratio – roční poplatek za správu fondu, strhává se průběžně z hodnoty investice.">Roční poplatek (TER)</InfoTip>, ter(etf.ter_numeric)],
                  ['Velikost fondu', money(etf.fund_size_numeric, etf.fund_currency)],
                  [<InfoTip key="dist" label="Akumulační fond dividendy reinvestuje uvnitř (na účet nic nechodí, vhodné pro růst); distribuční je vyplácí na účet.">Distribuční politika</InfoTip>, `${distText}${isAcc ? ' (reinvestuje dividendy)' : isDist ? ' (vyplácí dividendy)' : ''}`],
                  ...(isDist ? [[<InfoTip key="dy" label="Dividendový výnos – kolik fond za rok vyplatil na dividendách vůči své ceně.">Dividendový výnos</InfoTip>, divYield != null ? pct(divYield).replace('+', '') : '—'] as [React.ReactNode, React.ReactNode]] : []),
                  [<InfoTip key="rep" label="Fyzická replikace = fond reálně nakupuje akcie z indexu (bez protistranového rizika); syntetická používá swap.">Replikace</InfoTip>, replText],
                  [<InfoTip key="dom" label="Země, kde fond právně sídlí. Irsko má výhodnou daňovou smlouvu s USA, W-8BEN neřešíte.">Domicil</InfoTip>, domText],
                  ['Sledovaný index', etf.index_name || '—'],
                  [<InfoTip key="hold" label="Počet cenných papírů, které fond reálně drží.">Počet držených pozic</InfoTip>, etf.total_holdings != null ? etf.total_holdings.toLocaleString('cs-CZ') : '—'],
                  ['Měna fondu', etf.fund_currency || '—'],
                  ['Datum vzniku', dateLabel(etf.inception_date)],
                ] as [React.ReactNode, React.ReactNode][]).map(([k, v], i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-600">{k}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900 tabular-nums">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Karty na mobilu */}
          <div className="md:hidden grid grid-cols-2 gap-2.5">
            {([
              [<InfoTip key="t" label="Roční poplatek za správu fondu, strhává se průběžně z hodnoty.">TER</InfoTip>, ter(etf.ter_numeric)],
              ['Velikost', money(etf.fund_size_numeric, etf.fund_currency)],
              ['Politika', distText],
              ['Replikace', replText.split(' ')[0]],
              ['Domicil', domText],
              ['Index', etf.index_name || '—'],
              ['Pozic', etf.total_holdings != null ? String(etf.total_holdings) : '—'],
              ['Vznik', dateLabel(etf.inception_date)],
            ] as [React.ReactNode, React.ReactNode][]).map(([k, v], i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-500">{k}</p>
                <p className="mt-0.5 font-semibold text-slate-900 text-sm tabular-nums">{v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SLOŽENÍ FONDU */}
        <section className="pb-10">
          <SectionHead title="Složení fondu" desc="Co fond drží – největší pozice, rozložení podle zemí a sektorů." />
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Top držené pozice */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-teal-700" />
                <InfoTip label="Jednotlivé cenné papíry, které fond drží s největší vahou.">Největší držené pozice</InfoTip>
              </h3>
              <div className="mt-3 divide-y divide-slate-100">
                {holdings.map((h) => (
                  <WeightRow key={h.name} label={h.name} weight={h.weight!} max={holdingsMax} />
                ))}
              </div>
              {top10Sum > 0 && (
                <p className="mt-3 text-xs text-slate-500">
                  Top {holdings.length} pozic tvoří přibližně{' '}
                  <span className="font-medium text-slate-700">{top10Sum.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %</span>{' '}
                  fondu. Zbytek je rozložen mezi dalších {Math.max(0, (etf.total_holdings ?? 0) - holdings.length)} firem.
                </p>
              )}
            </div>

            {/* Sektory + země */}
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-700" /> Rozložení podle sektorů
                </h3>
                <div className="mt-3 divide-y divide-slate-100">
                  {sectors.map((s) => (
                    <WeightRow key={s.name} label={trSector[s.name] ?? s.name} weight={s.weight!} max={sectorMax} />
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-teal-700" /> Rozložení podle zemí
                </h3>
                <div className="mt-3 divide-y divide-slate-100">
                  {countries.map((c) => (
                    <WeightRow key={c.name} label={trCountry[c.name] ?? c.name} weight={c.weight!} max={countryMax} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIZIKO */}
        <section className="pb-10">
          <SectionHead title="Riziko a kolísavost" desc="Jak moc hodnota fondu kolísá, jak hluboko v minulosti klesla a jaký měl výnos vůči riziku." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <InfoTip label="Roční kolísavost (volatilita) ceny. Vyšší číslo = větší výkyvy nahoru i dolů.">Kolísavost (1 rok)</InfoTip>
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                {vol1 != null ? `${vol1.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %` : '—'}
              </p>
              <p className="mt-1 text-xs text-slate-400 tabular-nums">
                {vol3 != null && <>3R {vol3.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %</>}
                {vol3 != null && vol5 != null && <> · </>}
                {vol5 != null && <>5R {vol5.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %</>}
              </p>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{volDesc(vol1)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <InfoTip label="Největší propad z vrcholu na dno – kolik byste v nejhorším dočasně viděli v minusu.">Max. pokles</InfoTip>
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-red-600">{pct(dd1)} <span className="text-xs font-medium text-slate-400">1R</span></p>
              <p className="mt-1 text-xs text-slate-400 tabular-nums">
                {dd3 != null && <>3R {pct(dd3)}</>}
                {dd3 != null && dd5 != null && <> · </>}
                {dd5 != null && <>5R {pct(dd5)}</>}
              </p>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">Dočasné propady jsou u akcií normální – klíčové je je přečkat.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <InfoTip label="Poměr výnosu k podstoupenému riziku (podobné Sharpe ratio). Vyšší číslo = lepší výnos za jednotku kolísavosti.">Výnos / riziko (1R)</InfoTip>
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                {sharpe != null ? sharpe.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
              </p>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">Kolik výnosu fond přinesl na jednotku kolísavosti za poslední rok.</p>
            </div>
          </div>
          {(etf.fund_currency && etf.fund_currency !== 'CZK') || (countries[0] && (countries[0].weight ?? 0) > 55) ? (
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
              <p className="flex items-start gap-2 text-sm text-amber-900/90 leading-relaxed">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
                {etf.fund_currency && etf.fund_currency !== 'CZK' && <>Fond kotuje v {etf.fund_currency}, nesete tak měnové riziko vůči koruně – posílení Kč váš výnos snižuje, oslabení ho zvyšuje.{isHedged ? ' Měnové zajištění (hedged) tlumí jen pohyby uvnitř fondu vůči jeho měně, riziko '+etf.fund_currency+'/CZK ale nese český investor dál.' : ''} </>}
                {countries[0] && (countries[0].weight ?? 0) > 55 && <>Zhruba {Math.round(countries[0].weight ?? 0)} % fondu míří do jediné země ({trCountry[countries[0].name] ?? countries[0].name}), což zvyšuje koncentraci.</>}
              </p>
            </div>
          ) : null}
        </section>

        {/* KDE SE OBCHODUJE – burzy/listingy */}
        {exchanges.length > 0 && (
          <section className="pb-10">
            <SectionHead title="Kde se fond obchoduje" desc="Burzy a tickery, pod kterými fond koupíte. Měna listingu ovlivňuje spread i měnový přepočet." />
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-left text-xs uppercase tracking-wide">
                    <th className="py-2.5 px-4 font-medium">Burza</th>
                    <th className="py-2.5 px-4 font-medium">Ticker</th>
                    <th className="py-2.5 px-4 font-medium text-right">Měna</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exchanges.map((e, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 text-slate-700">{e.name}</td>
                      <td className="py-2.5 px-4 font-medium text-slate-900 tabular-nums">{e.ticker}</td>
                      <td className="py-2.5 px-4 text-right text-slate-600">{e.currency || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* O FONDU – popis */}
        <section className="pb-10">
          <SectionHead title="O fondu" />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              {etf.description_cs && etf.description_cs.trim() !== ''
                ? cleanDesc(etf.description_cs)
                : `${etf.name} je ${isAcc ? 'akumulační ' : isDist ? 'distribuční ' : ''}fond sledující index ${etf.index_name} s nákladovostí ${ter(etf.ter_numeric)} ročně a sídlem v ${etf.fund_domicile === 'Ireland' ? 'Irsku' : etf.fund_domicile}.`}
            </p>
          </div>
        </section>

        {/* KAM DÁL / POROVNAT */}
        <section className="pb-10">
          <SectionHead title="Kam dál" desc="Porovnejte fond s konkurencí nebo se podívejte na žebříčky." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              ['/srovnani', 'Porovnat s jiným fondem', Scale, 'Postavte tento fond proti VUAA, SPY5 nebo jinému S&P 500 ETF.'],
              ['/nejlepsi-etf/nejlepsi-sp500-etf', 'Nejlepší S&P 500 ETF', TrendingUp, 'Žebříček nejlepších fondů sledujících S&P 500.'],
              ['/kde-koupit', 'Kde fond koupit', Banknote, 'Srovnání brokerů, u kterých tento fond pořídíte.'],
            ] as [string, string, typeof Scale, string][]).map(([href, label, Icon, desc]) => (
              <Link key={href} href={href} className="group rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                <span className="flex items-center justify-between">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700"><Icon className="w-4 h-4" /></span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700" />
                </span>
                <p className="mt-2.5 font-semibold text-slate-900 text-sm">{label}</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {([
              ['/pruvodce', 'Co jsou ETF', BookOpen],
              ['/nejlepsi-etf/nejlevnejsi-etf', 'Nejlevnější ETF', Wallet],
              ['/portfolio-strategie', 'Modelová portfolia', Landmark],
              ['/kalkulacka', 'Kalkulačka poplatků', Calculator],
            ] as [string, string, typeof BookOpen][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté dotazy k fondu" />
          <div className="space-y-2">
            {[
              {
                q: `Je ${ticker} (${shortName}) vhodný pro dlouhodobé investování?`,
                a: `Je to ${isAcc ? 'akumulační ' : isDist ? 'distribuční ' : ''}fond sledující index ${etf.index_name} s ${replText.toLowerCase()} replikací. Velikost fondu je ${money(etf.fund_size_numeric, etf.fund_currency)}, roční poplatek ${ter(etf.ter_numeric)} a sídlo v ${domText}. ${isAcc ? 'Akumulační politika a nízké náklady z něj dělají praktickou volbu pro dlouhodobé pasivní investory.' : isDist ? 'Distribuční politika se hodí těm, kdo chtějí z investice pravidelný příjem.' : ''} Vhodnost pro vás ale závisí na vašem cíli a horizontu.`,
              },
              {
                q: 'Vyplácí tento fond dividendy?',
                a: isAcc
                  ? 'Ne. Je to akumulační fond – dividendy se automaticky reinvestují uvnitř fondu. Na účet vám nic nechodí, takže v ČR neřešíte srážkovou daň ani řádky v přiznání z dividend.'
                  : isDist
                  ? `Ano. Je to distribuční fond – dividendy vyplácí na váš účet${divYield != null ? ` (aktuální výnos zhruba ${pct(divYield).replace('+', '')})` : ''}. V ČR se daní 15 % a uvádějí se v daňovém přiznání.`
                  : 'U tohoto fondu nemáme distribuční politiku spolehlivě ověřenou. Zkontrolujte si ji prosím v oficiálním dokumentu KID nebo na justETF – akumulační fondy dividendy reinvestují, distribuční je vyplácejí na účet.',
              },
              {
                q: 'Musím jako Čech vyplňovat formulář W-8BEN?',
                a: `Ne. W-8BEN se týká amerických (US-domiciled) fondů. Tento fond sídlí v ${domText}, takže srážkovou daň z amerických dividend řeší správce fondu na úrovni fondu (u irského domicilu 15 % místo 30 % díky daňové smlouvě s USA).`,
              },
              {
                q: 'Proč ukazujete výnos v korunách?',
                a: `Protože jako český investor utrácíte koruny. Fond sice kotuje v cizí měně (${etf.fund_currency || 'USD/EUR'}), ale váš reálný výnos ovlivňuje i pohyb kurzu. Výnos přepočtený do Kč proto ukazuje, kolik byste reálně vydělali nebo prodělali.`,
              },
            ].map((f) => (
              <details key={f.q} className="group rounded-lg border border-slate-200 bg-white">
                <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <HelpCircle className="w-4 h-4 text-teal-700 shrink-0" /> {f.q}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <p className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* TRUST PRUH */}
        <section className="pb-10">
          <div className="grid sm:grid-cols-3 gap-4">
            {([
              [ShieldCheck, 'Nezávislá data', 'Parametry fondu z justETF a vlastní databáze, bez placeného pořadí.'],
              [BadgeCheck, 'Výnos v korunách', 'Jako jediný srovnávač přepočítáváme výnosy kurzem ČNB do Kč.'],
              [Database, 'Aktuální čísla', `Data fondu aktualizována ${dateStr}.`],
            ] as [typeof ShieldCheck, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Icon className="w-5 h-5" /></span>
                <span><span className="block font-semibold text-sm text-slate-900">{t}</span><span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">{d}</span></span>
              </div>
            ))}
          </div>
        </section>

        {/* E-E-A-T patička: autor + zdroje */}
        <section className="pb-8">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Data o fondech přebíráme z veřejných zdrojů a přepočítáváme do korun nezávisle.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
              <p className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" /> Zdroje: justETF{etf.fund_provider ? ', ' + etf.fund_provider : ''}, ČNB (kurz USD/CZK). Aktualizováno {dateStr}.
              </p>
            </div>
          </div>
        </section>

        {/* DISCLAIMER – úplný konec obsahu */}
        <section className="pb-12">
          <InvestmentDisclaimer />
        </section>
      </main>

    </div>
  );
}
