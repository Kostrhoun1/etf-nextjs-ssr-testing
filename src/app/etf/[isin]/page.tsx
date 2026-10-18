import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import type { ETF } from '@/types/etf';
import {
  TrendingUp, ArrowRight, Layers, Scale, AlertTriangle, Database, Globe2, PieChart, Star, HelpCircle, ChevronDown,
} from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import CompareButton from '@/components/design-preview/CompareButton';
import EmitentLogo from '@/components/home/EmitentLogo';
import VyvojGraf from './VyvojGraf';
import { nactiVyvojIndexu } from './vyvojIndexu';
import { distKind } from '@/utils/distribution';
import EtfReturns from '@/components/design-preview/EtfReturns';
import EtfCalendarReturns, { type CalCol } from '@/components/design-preview/EtfCalendarReturns';
import { getDataDate, getPodobneFondy, SPECIFICKY_FOND } from '@/lib/etf-data';
import { canonicalIndexLabel } from '@/utils/indexNormalization';
import { isHeadFund } from '@/lib/etf-head';
import { prirazeniFondu, type FondProPrirazeni } from '@/lib/backtest/fondNaIndex';
import { INDEX_BY_CODE } from '@/lib/backtest/indexes';
import { nactiTrhy } from '@/lib/trhy';
import { platnyTicker } from '@/lib/ticker';
import { ceskaZeme, ceskySektor } from '@/lib/preklady';

// 30 dní (ne 1 den): ~4970 ETF stránek se dlouhým ocasem regeneruje ISR na požádání,
// crawleři (Seznam/Bing) je projíždějí a každá expirovaná = 1 Vercel ISR Write. Při
// 1denní expiraci jsme spotřebovali 75 % free-tier limitu (200k writes/měs → auto-pauza).
// Měsíční interval zastaví regeneraci ocasu skoro úplně (delší než zbytek účt. cyklu).
// Fundamenty fondu (název, TER, složení) se mění pomalu → měsíční cache je OK; aktivní
// srovnávač jede přes /api/etf/screener. Po resetu cyklu lze vrátit na 7 dní (604800).
export const revalidate = 2592000;
export const dynamicParams = true;


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
  //   necháme googlebot-noindex. Práh + seznam hlavy: src/lib/etf-head.ts (hlava
  //   musí být i v sitemap.ts, jinak ji Google neobjeví).
  const isHead = isHeadFund(fund?.fund_size_numeric);
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
const distLabelOf = (kind: ReturnType<typeof distKind>) =>
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
/** Index fondu → index v backtestu. JEN přesné shody, které backtest opravdu má (data
 *  od emitenta indexu přes ETF proxy) – raději žádný odkaz než odkaz na jiný index. */
// Backtest konkrétního fondu: přiřazení fond → historie indexu řeší JEDNO místo (fondNaIndex.ts, 17. 10. 2026).
/** „Kam dál": žebříček podle toho, co fond je (dřív napevno S&P 500 i u zlata). */
const zebricekFondu = (canon: string, category: string | null, name: string): [string, string] => {
  if (!SPECIFICKY_FOND.test(name)) {
    if (canon === 'S&P 500') return ['/nejlepsi-etf/nejlepsi-sp500-etf', 'Nejlepší S&P 500 ETF'];
    if (canon === 'MSCI World') return ['/nejlepsi-etf/nejlepsi-msci-world-etf', 'Nejlepší MSCI World ETF'];
    if (canon === 'FTSE All-World') return ['/nejlepsi-etf/nejlepsi-celosvetove-etf', 'Nejlepší celosvětové ETF'];
    if (canon === 'MSCI Emerging Markets') return ['/nejlepsi-etf/nejlepsi-emerging-markets-etf', 'Nejlepší ETF rozvíjejících se trhů'];
  }
  if (category === 'Komodity' && /\bgold\b|zlat/i.test(name) && !/miner/i.test(name)) return ['/nejlepsi-etf/nejlepsi-zlato-etf', 'Nejlepší zlaté ETF'];
  // Sektorové akciové fondy podle názvu (akciové energetické fondy měla DB do 18. 10. 2026
  // chybně v Komoditách – proto test na akciový index v názvu, ne jen na kategorii).
  const akciovy = category === 'Akcie' || /\b(msci|s&p|stoxx|ftse|sector|equity)\b/i.test(name);
  if (akciovy) {
    if (/\benergy\b|oil & gas/i.test(name)) return ['/nejlepsi-etf/nejlepsi-energeticke-etf', 'Nejlepší energetické ETF'];
    if (/information technology|\btechnology\b|semiconductor/i.test(name)) return ['/nejlepsi-etf/nejlepsi-technologicke-etf', 'Nejlepší technologické ETF'];
    if (/health ?care|biotech|pharma/i.test(name)) return ['/nejlepsi-etf/nejlepsi-healthcare-etf', 'Nejlepší healthcare ETF'];
    if (/financials?|\bbanks?\b/i.test(name)) return ['/nejlepsi-etf/nejlepsi-financni-etf', 'Nejlepší finanční ETF'];
    if (/dividend/i.test(name)) return ['/nejlepsi-etf/nejlepsi-dividendove-etf', 'Nejlepší dividendové ETF'];
    if (/small ?cap/i.test(name)) return ['/nejlepsi-etf/nejlepsi-small-cap-etf', 'Nejlepší small cap ETF'];
  }
  switch (category) {
    case 'Akcie': return ['/nejlepsi-etf/nejlepsi-akciove-etf', 'Nejlepší akciové ETF'];
    case 'Dluhopisy': return ['/nejlepsi-etf/nejlepsi-dluhopisove-etf', 'Nejlepší dluhopisové ETF'];
    case 'Komodity': return ['/nejlepsi-etf/nejlepsi-komoditni-etf', 'Nejlepší komoditní ETF'];
    case 'Nemovitosti': return ['/nejlepsi-etf/nejlepsi-realitni-etf', 'Nejlepší realitní ETF'];
    case 'Krypto': return ['/nejlepsi-etf/nejlepsi-bitcoin-etf', 'Nejlepší bitcoin ETF'];
    default: return ['/zebricky', 'Žebříčky ETF'];
  }
};
const TICKER_OK = /^[A-Za-z0-9]{1,12}$/;
/** „sídlo v Irsku" – 6. pád (dřív „sídlo v Irsko"). Neznámá země → „sídlo: X". */
const DOMICILE_LOK: Record<string, string> = {
  Ireland: 'v Irsku', Luxembourg: 'v Lucembursku', Germany: 'v Německu', France: 've Francii',
  Netherlands: 'v Nizozemsku', Switzerland: 've Švýcarsku', 'United Kingdom': 've Spojeném království',
};
const sidloVeta = (d: string | null | undefined, slovo = 'sídlo') => (d ? (DOMICILE_LOK[d] ? `${slovo} ${DOMICILE_LOK[d]}` : `${slovo} v zemi ${DOMICILE_CS[d] ?? d}`) : null);
/** „s fyzickou replikací" (dřív „s fyzická replikací"). */
const replikaceVeta = (rep: string | null | undefined) => {
  const t = replLabel(rep);
  if (t.startsWith('Syntetická')) return 'se syntetickou replikací (swap)';
  if (t === 'Fyzická') return 's fyzickou replikací';
  return null;
};
/** Popis description_cs je u části fondů ve skutečnosti anglicky (audit 17. 10. 2026) –
 *  takový neukazovat jako český. Hrubý test: žádná diakritika a 3+ časté anglické výrazy. */
const jeAnglicky = (t: string) =>
  !/[ěščřžýáíéůúňťď]/i.test(t) && (t.match(/\b(the|and|of|fund|which|invests|index|shares)\b/gi) || []).length >= 3;
const volDesc = (v: number | null) =>
  v == null ? 'Data o kolísavosti nejsou k dispozici.'
    : v < 10 ? 'Nízká kolísavost.'
    : v < 18 ? 'Střední kolísavost, typická pro široký akciový index.'
    : v < 28 ? 'Zvýšená kolísavost – počítejte s výraznějšími výkyvy.'
    : 'Vysoká kolísavost – hodnota může prudce kolísat.';

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

/* ---------- nadpis sekce ---------- */
function SectionHead({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
      {desc && <p className="mt-1 text-sm text-slate-500 leading-relaxed">{desc}</p>}
    </div>
  );
}

const PORADI_BURZ = [/xetra/i, /london/i, /amsterdam/i, /milan|italiana/i, /paris/i, /six|swiss/i, /gettex/i, /stuttgart/i];
const poradiBurzy = (n: string) => { const i = PORADI_BURZ.findIndex((re) => re.test(n)); return i < 0 ? 99 : i; };

export default async function ETFDetailPreview(
  { params }: { params: Promise<{ isin: string }> },
) {
  const { isin } = await params;
  const { data } = await supabaseAdmin.from('etf_funds').select('*').eq('isin', isin).single();
  // Fond bez názvu = rozbitý řádek ze scraperu (12 k 17. 10. 2026, bez TER, měny i data vzniku).
  if (!data || !String((data as { name?: string }).name ?? '').trim()) notFound();

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
  const NEOVERENO = { y1: null, y3: null, y5: null, ytd: null };

  const ticker = etf.primary_ticker || '—';
  const allTickers = uniqueTickers(etf as unknown as Record<string, unknown>);
  const today = new Date();
  /* DATUM MUSÍ BÝT OD TOHOTO FONDU (scraping_date = kdy scraper data fondu opravdu stáhl).
     NE updated_at: ten do 17. 10. 2026 přepisoval i upsert starých dat z checkpointů,
     takže ~640 fondů s dubnovými čísly hlásilo „aktualizováno včera" (audit dat).
     Původní poznámka: ne globální MAX(updated_at) přes celou tabulku.
     Scraper neprojde každý den všech 5 064 fondů – k 6. 9. 2026 bylo 313 záznamů
     starších než 30 dní. Globální razítko u nich tvrdilo, že jsou čerstvé, což je
     přesně ten typ automaticky se posouvajícího data, jaké jsme vyhodili u ceníků
     brokerů (viz src/lib/editorial-check.ts). Fallback na globální datum jen tehdy,
     když fond vlastní `updated_at` nemá. */
  const fundUpdated = (() => {
    const iso = (etf as unknown as Record<string, unknown>).scraping_date ?? (etf as unknown as Record<string, unknown>).updated_at;
    const d = iso ? new Date(String(iso)) : null;
    return d && !Number.isNaN(d.getTime()) ? d : null;
  })();
  const dataDate = fundUpdated ?? (await getDataDate(today));
  const dateStr = dataDate.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  const staleDays = Math.floor((today.getTime() - dataDate.getTime()) / 864e5);
  // 7 dní: scraper běží denně – týden bez aktualizace už znamená, že s fondem něco je.
  const isStale = staleDays > 7;

  // krátký název pro nadpis – odvozený z názvu fondu (ne napevno)
  const shortName = etf.name.replace(/\s+UCITS ETF.*/i, '').replace(/\s+\(.*\)/, '').trim();

  // měnově zajištěný (hedged) fond – z názvu. Zajištění je jen do EUR/USD (měny fondu),
  // NIKDY do CZK → český investor nese kurzové riziko fund_currency/CZK vždy.
  const isHedged = /\bhedged\b|\bhdg\b|zajišt/i.test(etf.name || '');

  // odvozené parametry z dat
  const dKind = distKind(etf.distribution_policy, etf.distribution_frequency);
  const isAcc = dKind === 'acc';
  const isDist = dKind === 'dist';
  // Pákové/inverzní produkty (audit 17. 10. 2026: detail 3× pákového ETF ho doporučoval
  // dlouhodobým pasivním investorům a nikde nevaroval).
  const isLev = etf.is_leveraged === true;
  // Kam dál + kontextové odkazy (deep dive 17. 10. 2026: z detailu na články vedlo 0 z 1 243 prokliků).
  const canonIdx = canonicalIndexLabel(etf.index_name);
  const btFond = prirazeniFondu(etf as unknown as FondProPrirazeni);
  const btTer = etf.ter_numeric == null ? null : Number(etf.ter_numeric) / 100;
  // Odkaz jen když umíme fond poctivě spočítat: přiřazený index se známým poplatkem zdroje a známé TER fondu.
  const btCode = btFond && btTer !== null && Number.isFinite(btTer) && INDEX_BY_CODE[btFond.indexCode]?.sourceTer !== undefined ? btFond.indexCode : undefined;
  const [zebricekHref, zebricekLabel] = zebricekFondu(canonIdx, (etf as unknown as { category?: string | null }).category ?? null, etf.name || '');
  const podobne = await getPodobneFondy(etf.index_name, etf.isin, etf.name || '');
  // Fond s výnosem mimo svůj trh (> 1,5 p. b. od mediánu fondů na stejný index, src/lib/trhy.ts) –
  // nejčastěji opožděná cena u zdroje. Pravidlo č. 1: číslo nechat, ale viditelně upozornit.
  const trhOdlehly = (await nactiTrhy())?.find((r) => r.odlehle.some((f) => f.isin === etf.isin)) ?? null;
  const souper = podobne.find((f) => f.primary_ticker && TICKER_OK.test(f.primary_ticker));
  const parHref = souper && etf.primary_ticker && TICKER_OK.test(etf.primary_ticker)
    ? `/srovnani/${etf.primary_ticker.toLowerCase()}-vs-${souper.primary_ticker!.toLowerCase()}` : null;
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
        // Bez přepočtu NEukazovat EUR jako Kč/USD (18. 10. 2026: tichý fallback u 10 fondů + fondů mimo nabídku).
        CZK: num(r[`return_${y}_czk`] as number),
        USD: num(r[`return_${y}_usd`] as number),
      },
    }))
    .filter((c) => c.vals.EUR != null || c.vals.CZK != null || c.vals.USD != null);
  // letošní rok (YTD) jako poslední, viditelně odlišený sloupec
  const ytdCol: CalCol = {
    year: currentYear,
    ytd: true,
    vals: {
      EUR: num(r.return_ytd as number),
      // Bez přepočtu NEukazovat EUR jako Kč/USD (dřív tichý fallback – 172 mladých fondů).
      CZK: num(r.return_ytd_czk as number),
      USD: num(r.return_ytd_usd as number),
    },
  };
  const hasYtd = ytdCol.vals.EUR != null || ytdCol.vals.CZK != null || ytdCol.vals.USD != null;
  // Fond s ověřeně opožděnou cenou (trhOdlehly): letošní výnos také neověřený → bez sloupce YTD.
  const calCols2 = hasYtd && !trhOdlehly ? [...calCols, ytdCol] : calCols;

  // krátká období (jen v EUR) pro výnosovou sekci
  const shortPeriods = {
    m1: num(r.return_1m as number),
    m3: num(r.return_3m as number),
    m6: num(r.return_6m as number),
  };

  // burzy / listingy – kde a v jaké měně se obchoduje
  const exchanges = Array.from({ length: 10 }, (_, i) => ({
    name: (etf as unknown as Record<string, string>)[`exchange_${i + 1}_name`],
    ticker: (etf as unknown as Record<string, string>)[`exchange_${i + 1}_ticker`],
    currency: (etf as unknown as Record<string, string>)[`exchange_${i + 1}_currency`],
  })).filter((e) => e.name && e.name.trim() !== '' && platnyTicker(e.ticker) && !/mexic/i.test(e.name))
    // Všechny listingy (dřív jen prvních 6 → chyběla XETRA i CSPX na LSE, revize 18. 10. 2026), seřazené podle
    // toho, kde Češi nakupují: XETRA (DEGIRO, XTB, T212), pak další evropské burzy. Mexiko pro Čechy irelevantní.
    .sort((x, y) => poradiBurzy(x.name) - poradiBurzy(y.name));

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

  /* ---------- graf vývoje: jen fond, který PŘESNĚ sedí na index z manifestu (pravidlo č. 1) ---------- */
  const presnyIndex = btFond && btFond.shoda === 'stejny' ? btFond : null;
  const vyvoj = presnyIndex ? await nactiVyvojIndexu(presnyIndex.indexCode) : null;
  const tkHlavni = platnyTicker(etf.primary_ticker) ?? null;
  const jeZdrojovyFond = !!presnyIndex && INDEX_BY_CODE[presnyIndex.indexCode]?.sourceIsin === etf.isin;
  const popisVyvoje = presnyIndex
    ? jeZdrojovyFond ? `data přímo tohoto fondu (${INDEX_BY_CODE[presnyIndex.indexCode].name})` : `${presnyIndex.zdroj}, ne přímo ${tkHlavni ?? 'tento fond'}`
    : '';
  const zdrojVyvoje = presnyIndex
    ? jeZdrojovyFond ? 'Řada je přímo tento fond.' : `Řada je ${presnyIndex.zdroj} – fond na stejný index s historií delší než ${tkHlavni ?? 'tento fond'}. Liší se jen poplatkem a drobnou odchylkou od indexu.`
    : '';
  // Backtest počítá v Kč až od prvního kurzu (30. 12. 1999, vznik eura) → rok z dat, ne natvrdo (revize 18. 10. 2026:
  // „od 1993“ vs. „od 2000“). +7 dní: řada začínající posledními dny roku se počítá od dalšího roku.
  const btOdRok = btCode
    ? Math.max(Number(INDEX_BY_CODE[btCode].since.slice(0, 4)), vyvoj && btCode === presnyIndex?.indexCode ? new Date(new Date(vyvoj.zacatek).getTime() + 7 * 864e5).getUTCFullYear() : 2000)
    : null;

  // „Kde se kupuje nejčastěji“ – odvozeno z dat: XETRA listing (DEGIRO, XTB, Trading 212 nakupují tam).
  const xetra = exchanges.find((e) => /xetra/i.test(e.name));
  const tipTickery = allTickers.length > 1
    ? `Stejný fond na různých burzách – liší se jen burza a měna obchodování, poplatek i výnos jsou stejné.${xetra ? ` V Česku se nejčastěji kupuje na burze XETRA (${xetra.ticker}).` : ''}`
    : null;

  // Top 10 pozic: scraper do 18. 10. 2026 zahazoval 1. řádek (u S&P 500 chyběla NVIDIA). Neúplný seznam
  // (9 pozic u fondu s víc než 9 tituly) NEukazovat jako „největší pozice“ – pravidlo č. 1.
  const pozicNeuplne = holdings.length === 9 && (etf.total_holdings ?? 0) > 9;

  // Podobné fondy: výnos v Kč jen u ověřených (fond s výnosem mimo trh = „—“).
  const odlehleIsin = new Set(((await nactiTrhy()) ?? []).flatMap((t) => t.odlehle.map((f) => f.isin)));
  const tickerSouper = souper ? platnyTicker(souper.primary_ticker) : null;

  const vynosyHero = [
    { label: '1 rok', v: trhOdlehly ? null : czk.y1 },
    { label: '3 roky', v: trhOdlehly ? null : czk.y3 },
    { label: '5 let', v: trhOdlehly ? null : czk.y5 },
  ];
  const fakta: [React.ReactNode, string][] = [
    [<InfoTip key="ter" label="Total Expense Ratio – roční poplatek za správu fondu, strhává se průběžně z hodnoty investice.">TER</InfoTip>, ter(etf.ter_numeric)],
    ['Velikost', money(etf.fund_size_numeric, etf.fund_currency)],
    [<InfoTip key="dist" label="Akumulační fond dividendy reinvestuje uvnitř (na účet nic nechodí); distribuční je vyplácí na účet.">Dividendy</InfoTip>, isAcc ? 'Reinvestuje' : isDist ? (divYield != null ? `Vyplácí ${pct(divYield).replace('+', '')}` : 'Vyplácí') : 'Neuvedeno'],
    ['Replikace', replText.split(' ')[0]],
    [<InfoTip key="dom" label="Země, kde fond právně sídlí. Irsko má výhodnou daňovou smlouvu s USA, W-8BEN neřešíte.">Domicil</InfoTip>, domText],
  ];

  const tickeryText = allTickers.slice(0, 5).join(' · ') + (allTickers.length > 5 ? ` +${allTickers.length - 5}` : '');
  const pocetDalsich = Math.max(0, (etf.total_holdings ?? 0) - holdings.length);

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
          <SiteNav />
          <HeaderSearch />
        </div>
      </header>

      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-16">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-400 flex items-center gap-1.5 min-w-0">
          <Link href="/" className="hover:text-slate-600 shrink-0">Domů</Link>
          <span>/</span>
          <Link href="/srovnani" className="hover:text-slate-600 shrink-0">Srovnání ETF</Link>
          <span>/</span>
          <span className="text-slate-600 truncate">{shortName}</span>
        </nav>

        {/* HLAVIČKA FONDU – název, tickery, výnos v Kč a klíčová fakta nad zlomem (i na mobilu) */}
        <section data-sekce="hlavicka" className="pb-6">
          <div className="rounded-2xl bg-slate-900 text-white px-4 py-5 md:px-8 md:py-7">
            <div className="md:flex md:items-start md:justify-between gap-8">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <EmitentLogo nazev={etf.name} size={40} className="!rounded-lg" />
                  <div className="min-w-0 text-xs text-slate-400 leading-snug">
                    <span className="block text-slate-300 font-medium">{etf.fund_provider}</span>
                    {etf.index_name && <span className="block truncate">Index {etf.index_name}</span>}
                  </div>
                </div>
                <h1 className="mt-3 text-[22px] md:text-3xl font-bold tracking-tight leading-tight">{etf.name}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300">
                  {allTickers.length > 0 && (
                    <span className="font-semibold text-white">
                      {tipTickery ? <InfoTip label={tipTickery}>{tickeryText}</InfoTip> : tickeryText}
                    </span>
                  )}
                  <span className="font-mono text-xs text-slate-400">ISIN {etf.isin}</span>
                  {ratingVal != null && (
                    <span className="inline-flex items-center gap-0.5 text-amber-300" aria-label={`Hodnocení ${ratingVal} z 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < ratingVal ? 'fill-amber-300' : 'text-slate-600'}`} strokeWidth={1.5} />
                      ))}
                    </span>
                  )}
                </div>

                {/* Výnos v Kč – první číslo, které návštěvník hledá */}
                <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
                  <InfoTip label="Kumulativní výnos fondu přepočtený kurzem ČNB do korun – zahrnuje pohyb kurzu. Po poplatcích fondu, bez daní a poplatků brokera.">Výnos v Kč</InfoTip>
                  {isStale ? (
                    <span className="inline-flex items-center gap-1 text-amber-200"><AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> data z {dataDate.toLocaleDateString('cs-CZ')}</span>
                  ) : (
                    <span className="tabular-nums">data k {dataDate.toLocaleDateString('cs-CZ')}</span>
                  )}
                </div>
                <div className="mt-1.5 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
                  {vynosyHero.map((t) => (
                    <div key={t.label} className="bg-slate-900/80 px-3 py-2.5 md:px-4 md:py-3">
                      <p className="text-[11px] md:text-xs text-slate-400">{t.label}</p>
                      <p className={`text-lg md:text-2xl font-bold tabular-nums ${t.v == null ? 'text-slate-500' : t.v >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>{pct(t.v)}</p>
                    </div>
                  ))}
                </div>
                {isStale && (
                  <p className="mt-2 text-xs text-amber-200/90">Data tohoto fondu jsou {staleDays} dní stará – čísla nemusí odpovídat dnešku.</p>
                )}
                {isLev && (
                  <p className="mt-3 flex items-start gap-1.5 rounded-lg border border-red-300/50 bg-red-500/15 px-3 py-2 text-xs text-red-100">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                    <span><strong>Pákový produkt.</strong> Násobí denní pohyb trhu a každý den se přenastavuje – za delší dobu se výnos může od násobku indexu výrazně lišit a lze přijít o celou investici. Není určený k dlouhodobému investování.</span>
                  </p>
                )}

                {/* Klíčová fakta */}
                <dl className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-2.5">
                  {fakta.map(([k, v], i) => (
                    <div key={i} className="min-w-0">
                      <dt className="text-[11px] md:text-xs text-slate-400">{k}</dt>
                      <dd className="text-sm font-semibold text-white tabular-nums truncate">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-5 md:mt-1 md:w-56 shrink-0 grid grid-cols-2 md:grid-cols-1 gap-2.5">
                <Link href="/kde-koupit" className="flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-teal-700">
                  Kde koupit <ArrowRight className="w-4 h-4" />
                </Link>
                <CompareButton isin={etf.isin} label={ticker !== '—' ? ticker : shortName} variant="hero" />
              </div>
            </div>
          </div>
        </section>

        {/* VÝKONNOST – graf (vývoj indexu, nebo roční výnosy) + výnosy za období */}
        <section data-sekce="vykonnost" className="pb-10">
          <h2 className="mb-3 text-xl md:text-2xl font-bold tracking-tight text-slate-900">Výkonnost</h2>
          {trhOdlehly && (
            <p role="note" className="mb-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 leading-relaxed">
              <strong>Pozor na aktuálnost výnosů:</strong> výnos za 12 měsíců se u tohoto fondu lišil o víc než 1,5 p. b. od ostatních fondů na stejný trh – {trhOdlehly.trh.label} (medián {trhOdlehly.median != null ? `${trhOdlehly.median.toFixed(1).replace('.', ',')} %` : '—'} v Kč). Nejčastější příčinou je opožděná cena u zdroje dat, proto výnosy za jednotlivá období neukazujeme. Porovnejte s{' '}
              <Link href={trhOdlehly.trh.href} className="font-medium underline underline-offset-2">ostatními fondy na stejný trh</Link>.
            </p>
          )}
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3 min-w-0">
              {vyvoj ? (
                <VyvojGraf body={vyvoj.body} popis={popisVyvoje} zdroj={zdrojVyvoje} konec={vyvoj.konec} mesicni={vyvoj.mesicni} />
              ) : calCols2.length > 0 ? (
                <EtfCalendarReturns cols={calCols2} nadpis="Výnos po jednotlivých letech" />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Historii výnosů tohoto fondu zatím nemáme.</div>
              )}
            </div>
            <div className="lg:col-span-2 min-w-0 space-y-3">
              {/* Pravidlo č. 1: u fondu s výnosem mimo trh (opožděná cena u zdroje) výnosy za období neukazovat („—“). */}
              <EtfReturns
                byCur={trhOdlehly ? { CZK: NEOVERENO, EUR: NEOVERENO, USD: NEOVERENO } : returnsByCur}
                fundCurrency={etf.fund_currency}
                short={trhOdlehly ? { m1: null, m3: null, m6: null } : shortPeriods}
              />
              {btCode && (
                <div className="flex flex-col gap-1.5 px-1 text-sm">
                  {btCode && (
                    <Link href={`/backtest?fondy=${etf.isin}:100&run=1`} className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">
                      Backtest {tkHlavni ?? 'fondu'} v Kč od roku {btOdRok} <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  {/* Stroj času jen při PŘESNÉ shodě indexu s presetem (S&P 500). */}
                  {btCode === 'sp500' && (
                    <Link href="/stroj-casu?co=sp500&mesicne=3000&od=2010" className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">
                      3 000 Kč měsíčně od roku 2010 – kolik by to dnes bylo <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
          {vyvoj && calCols2.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-base font-semibold text-slate-900">Výnos po jednotlivých letech</h3>
              <EtfCalendarReturns cols={calCols2} />
            </div>
          )}
        </section>

        {/* NÁKLADY A ZÁKLADNÍ FAKTA */}
        <section data-sekce="fakta" className="pb-10">
          <SectionHead title="Náklady a základní fakta" />

          {/* Tabulka na desktopu */}
          <div className="hidden md:block rounded-xl border border-slate-200 bg-white overflow-hidden">
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
          {(isAcc || isDist) && (
            <p className="mt-3 text-sm text-slate-600">
              {isAcc ? 'Fond dividendy reinvestuje – na účet nic nechodí a do prodeje nic nedaníte.' : 'Fond vyplácí dividendy na účet – v Česku je zdaníte 15 %.'}{' '}
              <Link href="/akumulacni-vs-distribucni-etf" className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800">Akumulační, nebo distribuční?</Link>
            </p>
          )}
        </section>

        {/* SLOŽENÍ FONDU */}
        {(holdings.length > 0 || sectors.length > 0 || countries.length > 0) && (
          <section data-sekce="slozeni" className="pb-10">
            <SectionHead title="Složení fondu" />
            <div className="grid lg:grid-cols-2 gap-4">
              {holdings.length > 0 && !pozicNeuplne && (
                <div className="rounded-xl border border-slate-200 bg-white p-5">
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
                      {holdings.length === 1 ? 'Největší pozice tvoří' : `${holdings.length} největších pozic tvoří`} přibližně{' '}
                      <span className="font-medium text-slate-700">{top10Sum.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %</span> fondu
                      {pocetDalsich > 0 ? <>, zbytek je rozložen mezi dalších {pocetDalsich.toLocaleString('cs-CZ')} titulů.</> : '.'}
                    </p>
                  )}
                </div>
              )}

              <div className={holdings.length > 0 && !pozicNeuplne ? 'space-y-4' : 'contents'}>
                {sectors.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-teal-700" /> Sektory
                    </h3>
                    <div className="mt-3 divide-y divide-slate-100">
                      {sectors.map((s) => (
                        <WeightRow key={s.name} label={ceskySektor(s.name)} weight={s.weight!} max={sectorMax} />
                      ))}
                    </div>
                  </div>
                )}
                {countries.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Globe2 className="w-4 h-4 text-teal-700" /> Země
                    </h3>
                    <div className="mt-3 divide-y divide-slate-100">
                      {countries.map((c) => (
                        <WeightRow key={c.name} label={ceskaZeme(c.name)} weight={c.weight!} max={countryMax} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {pozicNeuplne && (
              <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-500 leading-relaxed">
                <PieChart className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
                <span>Největší držené pozice dočasně neukazujeme – ve zdroji dat chybí ta největší. Doplní se s další aktualizací.</span>
              </p>
            )}
          </section>
        )}

        {/* RIZIKO */}
        <section data-sekce="riziko" className="pb-10">
          <SectionHead title="Riziko a kolísavost" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <InfoTip label="Roční kolísavost (volatilita) ceny. Vyšší číslo = větší výkyvy nahoru i dolů.">Kolísavost (1 rok, v EUR)</InfoTip>
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
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <InfoTip label="Největší propad z vrcholu na dno – kolik byste v nejhorším dočasně viděli v minusu.">Max. pokles (v EUR)</InfoTip>
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-red-600">{pct(dd1)} <span className="text-xs font-medium text-slate-400">1R</span></p>
              <p className="mt-1 text-xs text-slate-400 tabular-nums">
                {dd3 != null && <>3R {pct(dd3)}</>}
                {dd3 != null && dd5 != null && <> · </>}
                {dd5 != null && <>5R {pct(dd5)}</>}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <InfoTip label="Poměr výnosu k podstoupenému riziku za poslední rok (podobné Sharpe ratio). Vyšší číslo = lepší výnos za jednotku kolísavosti.">Výnos / riziko (1R)</InfoTip>
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                {sharpe != null ? sharpe.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
              </p>
            </div>
          </div>
          {(etf.fund_currency && etf.fund_currency !== 'CZK') || (countries[0] && (countries[0].weight ?? 0) >= 80) ? (
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
              <p className="flex items-start gap-2 text-sm text-amber-900/90 leading-relaxed">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
                {/* Text v jednom <span> – přímé potomky flexu (text, odkaz, text) prohlížeč skládal do 3 úzkých sloupců. */}
                <span>
                {etf.fund_currency && etf.fund_currency !== 'CZK' && <>Fond kotuje v {etf.fund_currency}, nesete tak měnové riziko vůči koruně – posílení Kč váš výnos snižuje, oslabení ho zvyšuje.{isHedged ? ' Měnové zajištění (hedged) tlumí jen pohyby uvnitř fondu vůči jeho měně, riziko '+etf.fund_currency+'/CZK ale nese český investor dál.' : ''} <Link href="/menove-riziko-etf" className="font-medium underline underline-offset-2">Jak moc měna mění výnos v Kč?</Link> </>}
                {/* Práh 80 %: u VWCE (≈ 60 % USA) varování o koncentraci působilo absurdně (revize 18. 10. 2026). */}
                {countries[0] && (countries[0].weight ?? 0) >= 80 && <>Zhruba {Math.round(countries[0].weight ?? 0)} % fondu míří do jediné země ({ceskaZeme(countries[0].name)}), což zvyšuje koncentraci.</>}
                </span>
              </p>
            </div>
          ) : null}
        </section>

        {/* KDE SE OBCHODUJE – burzy/listingy */}
        {exchanges.length > 0 && (
          <section data-sekce="burzy" className="pb-10">
            <SectionHead title="Kde se fond obchoduje" />
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
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
                    <tr key={i} className={e === xetra ? 'bg-teal-50/50' : 'hover:bg-slate-50'}>
                      <td className="py-2.5 px-4 text-slate-700">
                        {e.name}
                        {e === xetra && <span className="ml-2 inline-block rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-medium text-teal-800 whitespace-nowrap">u českých brokerů nejčastěji</span>}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900 tabular-nums">{e.ticker}</td>
                      <td className="py-2.5 px-4 text-right text-slate-600">{e.currency || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* O FONDU – popis */}
        <section data-sekce="o-fondu" className="pb-10">
          <SectionHead title="O fondu" />
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              {etf.description_cs && etf.description_cs.trim() !== '' && !jeAnglicky(etf.description_cs)
                ? cleanDesc(etf.description_cs)
                : `${etf.name} je ${isLev ? 'pákový produkt (ETP) ' : `${isAcc ? 'akumulační ' : isDist ? 'distribuční ' : ''}fond `}${etf.index_name ? `sledující index ${etf.index_name} ` : ''}s nákladovostí ${ter(etf.ter_numeric)} ročně${sidloVeta(etf.fund_domicile, 'sídlem') ? ` a ${sidloVeta(etf.fund_domicile, 'sídlem')}` : ''}.`}
            </p>
          </div>
        </section>

        {/* DALŠÍ FONDY NA STEJNÝ INDEX + srovnání s nejbližším */}
        {(podobne.length > 0 || parHref) && (
          <section data-sekce="podobne-fondy" className="pb-10">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Další fondy na {etf.index_name ? `index ${etf.index_name}` : 'stejný index'}</h2>
              <Link href={zebricekHref} className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">{zebricekLabel} <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {podobne.length > 0 && (
                <ul className="lg:col-span-2 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                  {podobne.map((f) => {
                    const r1 = odlehleIsin.has(f.isin) ? null : num(f.return_1y_czk);
                    return (
                      <li key={f.isin}>
                        <Link href={`/etf/${f.isin}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                          <EmitentLogo nazev={f.name} size={28} />
                          <span className="flex-1 min-w-0">
                            <span className="block truncate text-sm font-medium text-slate-900">{f.name}</span>
                            <span className="block text-xs text-slate-500 tabular-nums">{platnyTicker(f.primary_ticker) ?? f.isin} · TER {ter(f.ter_numeric)} · {money(f.fund_size_numeric)}</span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className={`block text-sm font-semibold tabular-nums ${r1 == null ? 'text-slate-400' : r1 >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{pct(r1)}</span>
                            <span className="block text-[11px] text-slate-400">1R v Kč</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
              {parHref && souper && tickerSouper && (
                <Link href={parHref} className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                  <span>
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700"><Scale className="w-4 h-4" /></span>
                    <span className="mt-3 block text-lg font-bold text-slate-900">{etf.primary_ticker} vs {tickerSouper}</span>
                    <span className="mt-1 block text-sm text-slate-500 leading-relaxed">Poplatek, velikost a výnos v Kč obou fondů vedle sebe.</span>
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-700 group-hover:text-teal-800">Porovnat <ArrowRight className="w-4 h-4" /></span>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section data-sekce="faq" className="pb-8">
          <SectionHead title="Časté dotazy k fondu" />
          <div className="space-y-2">
            {[
              {
                q: `Je ${ticker !== '—' ? `${ticker} (${shortName})` : shortName} vhodný pro dlouhodobé investování?`,
                a: isLev
                  ? `Pro dlouhodobé držení obecně ne. Jde o pákový (nebo inverzní) produkt, který násobí DENNÍ pohyb ${etf.index_name ? `indexu ${etf.index_name}` : 'podkladového trhu'} a každý den se přenastavuje. Za delší období se proto jeho výnos může výrazně lišit od násobku výnosu indexu – při kolísavém trhu i směrem dolů – a o investici lze přijít i úplně. Je určený ke krátkodobému obchodování zkušenými investory.`
                  : [
                      `Je to ${isAcc ? 'akumulační ' : isDist ? 'distribuční ' : ''}fond${etf.index_name ? ` sledující index ${etf.index_name}` : ''}${replikaceVeta(etf.replication) ? ` ${replikaceVeta(etf.replication)}` : ''}.`,
                      `Velikost fondu je ${money(etf.fund_size_numeric, etf.fund_currency)}, roční poplatek ${ter(etf.ter_numeric)}${sidloVeta(etf.fund_domicile) ? ` a ${sidloVeta(etf.fund_domicile)}` : ''}.`,
                      isAcc ? 'Akumulační politika a nízké náklady z něj dělají praktickou volbu pro dlouhodobé pasivní investory.' : isDist ? 'Distribuční politika se hodí těm, kdo chtějí z investice pravidelný příjem.' : '',
                      'Vhodnost pro vás ale závisí na vašem cíli a horizontu.',
                    ].filter(Boolean).join(' '),
              },
              ...(allTickers.length > 1 ? [{
                q: `${allTickers.slice(0, 4).join(', ')} – který ticker koupit?`,
                a: `Všechny jsou tentýž fond (ISIN ${etf.isin}) na různých burzách – poplatek, složení i výnos jsou stejné. Liší se burza a měna obchodování.${xetra ? ` U českých brokerů se nejčastěji kupuje na burze XETRA – ticker ${xetra.ticker}${xetra.currency ? `, v ${xetra.currency}` : ''}.` : ''} U brokera můžete fond najít i podle ISIN.`,
              }] : []),
              {
                q: 'Vyplácí tento fond dividendy?',
                a: isAcc
                  ? 'Ne. Je to akumulační fond – dividendy se automaticky reinvestují uvnitř fondu. Na účet vám nic nechodí, takže v ČR neřešíte srážkovou daň ani řádky v přiznání z dividend.'
                  : isDist
                  ? `Ano. Je to distribuční fond – dividendy vyplácí na váš účet${divYield != null ? ` (aktuální výnos zhruba ${pct(divYield).replace('+', '')})` : ''}. V ČR se daní 15 % a uvádějí se v daňovém přiznání.`
                  : 'U tohoto fondu nemáme distribuční politiku spolehlivě ověřenou. Zkontrolujte si ji prosím v oficiálním dokumentu KID od emitenta – akumulační fondy dividendy reinvestují, distribuční je vyplácejí na účet.',
              },
              {
                q: 'Musím jako Čech vyplňovat formulář W-8BEN?',
                a: `Ne. W-8BEN se týká amerických (US-domiciled) fondů. Tento fond sídlí ${etf.fund_domicile && DOMICILE_LOK[etf.fund_domicile] ? DOMICILE_LOK[etf.fund_domicile] : `v zemi ${domText}`}, takže srážkovou daň z amerických dividend řeší správce fondu na úrovni fondu (u irského domicilu 15 % místo 30 % díky daňové smlouvě s USA).`,
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
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" aria-hidden="true" />
                </summary>
                <p className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Zdroj dat – jednou a střídmě (revize 18. 10. 2026: justETF se na stránce jmenoval 2×). */}
        <p className="flex items-start gap-1.5 text-xs text-slate-400 leading-relaxed">
          <Database className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
          <span>Data fondu: justETF{etf.fund_provider ? `, ${etf.fund_provider}` : ''} · kurzy ČNB · data k {dateStr}{isStale ? ` (před ${staleDays} dny)` : ''}. <Link href="/o-nas" className="underline underline-offset-2 hover:text-slate-600">O webu</Link></span>
        </p>
      </main>

    </div>
  );
}
