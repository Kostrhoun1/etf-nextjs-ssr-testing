import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import type { ETF } from '@/types/etf';
import {
  TrendingUp, ArrowRight, Layers, Scale, AlertTriangle, Database, Globe2, PieChart, ChevronDown,
} from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import CompareButton from '@/components/design-preview/CompareButton';
import EmitentLogo from '@/components/home/EmitentLogo';
import GrafVykonnosti from './GrafVykonnosti';
import HeroVynosy from './HeroVynosy';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import { FaqSeznam } from '@/components/design-preview/brokerUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { distKind } from '@/utils/distribution';
import EtfReturns from '@/components/design-preview/EtfReturns';
import { type CalCol } from '@/components/design-preview/EtfCalendarReturns';
import { getDataDate, getPodobneFondy, SPECIFICKY_FOND, rizikoNesediFondu } from '@/lib/etf-data';
import { RIZIKO_NESEDI_TEXT } from '@/lib/tridyFondu';
import { canonicalIndexLabel, indexFonduLabel } from '@/utils/indexNormalization';
import { isHeadFund } from '@/lib/etf-head';
import { prirazeniFondu, type FondProPrirazeni } from '@/lib/backtest/fondNaIndex';
import { INDEX_BY_CODE } from '@/lib/backtest/indexes';
import { nactiTrhy } from '@/lib/trhy';
import { platnyTicker, zobrazovanyTicker, SLOUPCE_TICKERU } from '@/lib/ticker';
import OdkazBurzy from './OdkazBurzy';
import { datumCen } from '@/lib/datumCen';
import { ceskaZeme, ceskySektor, ceskeZamereni, SEKTORY_POZNAMKA } from '@/lib/preklady';
import { terFmt, procenta, velikostFondu, cislo, NBSP } from '@/lib/formatyCisel';
import { nevyplaciKomodita, VYPLATA_ACC, VYPLATA_DIST } from '@/lib/dividendyFondu';

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
    .select('name, fund_size_numeric, ' + SLOUPCE_TICKERU.join(', '))
    .eq('isin', isin).single();
  const fund = data as Record<string, unknown> | null;
  const name = (fund?.name as string) || 'ETF fond';
  // Zobrazovaný ticker (jeden pro celý web, src/lib/ticker.ts) první – stejný jako hero, srovnávač a žebříčky.
  const zt = zobrazovanyTicker(fund);
  const tickers = zt ? [zt, ...uniqueTickers(fund).filter((t) => t.toUpperCase() !== zt.toUpperCase())] : uniqueTickers(fund);
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

// Jednotné formáty (kolo 5): minus „−“, nezlomitelná mezera před %, „mld. €“ – src/lib/formatyCisel.ts.
const ter = (v: number | null | undefined) => terFmt(num(v));
const pct = (v: number | null | undefined) => procenta(num(v));
/** Velikost fondu je z justETF VŽDY v EUR (i u USD tříd) → vždy €. Ověřeno proti justETF. */
const money = (v: number | null | undefined, _cur: string | null = 'EUR') => velikostFondu(num(v));

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
/** Co fond sleduje, když zdroj index nemá (364 komoditních a kryptoměnových produktů k 18. 10. 2026, např.
 *  iShares Physical Gold). JEN z doslovné věty popisu zdroje (description_en), nic se nedomýšlí – „LBMA“ popis
 *  neuvádí, proto ho neuvádíme ani my. Neznámá formulace → null („—“). */
const KOVY: Record<string, string> = { gold: 'zlata', silver: 'stříbra', platinum: 'platiny', palladium: 'palladia', rhodium: 'rhodia' };
const KOVY_1P: Record<string, string> = { gold: 'zlato', silver: 'stříbro' };
function podkladZPopisu(popis: string | null | undefined): string | null {
  const t = (popis ?? '').trim();
  let m = t.match(/^The product tracks the spot price of (gold|silver|platinum|palladium) in US Dollar\./i)
    ?? t.match(/^The (platinum|palladium) spot price is the price of \1 in US Dollar/i)
    ?? t.match(/^The (rhodium) spot price tracks the price of rhodium in USD/i);
  if (m) return `Spotová cena ${KOVY[m[1].toLowerCase()]} v USD`;
  m = t.match(/^The product tracks the value of the cryptocurrency ([A-Z][\w ()-]{1,40}?)\./);
  if (m) return `Cena kryptoměny ${m[1]}`;
  m = t.match(/^The product tracks the price of futures contracts on (gold|silver)\./i);
  if (m) return `Futures na ${KOVY_1P[m[1].toLowerCase()]}`;
  return null;
}

const TIP_DIVIDENDY = 'Akumulační fond dividendy reinvestuje uvnitř (na účet nic nechodí); distribuční je vyplácí na účet.';
const TIP_KOMODITA = 'Komodita ani kryptoměna dividendy nevyplácí – hodnota fondu se mění jen s cenou podkladu.';
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
        {procenta(weight, 1, false)}
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

/** Krátký český název burzy do úvodu („Ticker na XETRA: SXR8“). */
const burzaKratce = (n: string) =>
  /xetra/i.test(n) ? 'XETRA' : /london/i.test(n) ? 'londýnské burze' : /amsterdam/i.test(n) ? 'burze v Amsterdamu'
    : /milan|italiana/i.test(n) ? 'burze v Miláně' : /paris/i.test(n) ? 'burze v Paříži' : /six|swiss/i.test(n) ? 'burze SIX' : n;

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
    return d && !Number.isNaN(d.getTime()) ? datumCen(d) : null; // datum cen (předchozí obchodní den), ne den stažení
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
  // Komodita/krypto dividendy nemá – zdroj ji přesto vede jako „Accumulating“ (revize kola 4: zlato „Reinvestuje“).
  const komodita = nevyplaciKomodita(r.category as string | null, etf.name, dKind);
  const isAcc = dKind === 'acc' && !komodita;
  const isDist = dKind === 'dist';
  // Pákové/inverzní produkty (audit 17. 10. 2026: detail 3× pákového ETF ho doporučoval
  // dlouhodobým pasivním investorům a nikde nevaroval).
  const isLev = etf.is_leveraged === true;
  // Kam dál + kontextové odkazy (deep dive 17. 10. 2026: z detailu na články vedlo 0 z 1 243 prokliků).
  const canonIdx = canonicalIndexLabel(etf.index_name);
  // Sledovaný podklad: index ze zdroje, jinak doslovně z popisu fondu (zlato: „Spotová cena zlata v USD“).
  // Sledovaný index k ZOBRAZENÍ = stejná funkce jako porovnání a srovnávač (kolo 5, 19. 10. 2026): SPYI má index_name
  // prázdný řetězec → dřív prázdná buňka, porovnání přitom ukázalo „MSCI ACWI IMI“. Raw index_name jen pro dotazy.
  const indexLabel = indexFonduLabel({ index_name: etf.index_name, name: etf.name, investment_focus: (r.investment_focus as string | null) ?? null });
  const podklad = indexLabel ? null : podkladZPopisu((r.description_en as string | null) ?? etf.description_cs);
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
  // Kolísavost/pokles, které nesedí s jinou třídou téhož fondu (chyba zdroje – SPSA vs SPYI), → „—“.
  const nesediRiziko = await rizikoNesediFondu(etf as unknown as Parameters<typeof rizikoNesediFondu>[0]);
  const skryj = (pole: string, v: number | null) => (nesediRiziko.includes(pole as never) ? null : v);
  const vol1 = skryj('volatility_1y', num(etf.volatility_1y));
  const vol3 = skryj('volatility_3y', num(etf.volatility_3y));
  const vol5 = skryj('volatility_5y', num(etf.volatility_5y));
  const dd1 = skryj('max_drawdown_1y', num(etf.max_drawdown_1y));
  const dd3 = skryj('max_drawdown_3y', num(etf.max_drawdown_3y));
  const dd5 = num(etf.max_drawdown_5y);
  const sharpe = vol1 == null ? null : num(r.return_per_risk_1y as number);

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

  // Sekce burz: XETRA nahoře (DEGIRO, XTB, Trading 212 nakupují tam); ostatní burzy až pod „Další burzy“ (Markéta:
  // „SXR8 · CSSPX · CSPX · CSP1 – který koupit?“).
  const xetra = exchanges.find((e) => /xetra/i.test(e.name));
  const hlavniListing = xetra ?? exchanges[0] ?? null;
  // Ticker v úvodu, <title>, FAQ a tlačítku porovnání = JEDEN zobrazovaný ticker webu (src/lib/ticker.ts) – kolo 5:
  // u zlata detail ukazoval PPFB (XETRA), zbytek webu SGLN. Burza v úvodu = první listing s tímto tickerem.
  const hlavniTicker = zobrazovanyTicker(etf as unknown as Record<string, unknown>);
  const tickerListing = hlavniTicker ? exchanges.find((e) => e.ticker.trim().toUpperCase() === hlavniTicker.toUpperCase()) ?? null : null;
  const ostatniTickery = allTickers.filter((t) => t.toUpperCase() !== (hlavniTicker ?? '').toUpperCase() && platnyTicker(t));
  const dalsiBurzy = exchanges.filter((e) => e !== hlavniListing);
  // „Další burzy“ = tickery mimo XETRA listing; v úvodu tickery mimo zobrazovaný (gettex/Stuttgart mají stejný ticker).
  const dalsiTickery = Array.from(new Set(dalsiBurzy.map((e) => e.ticker.trim().toUpperCase())))
    .filter((t) => t !== (hlavniListing?.ticker ?? '').trim().toUpperCase());
  const tickeryUvod = Array.from(new Set(exchanges.map((e) => e.ticker.trim().toUpperCase())))
    .filter((t) => t !== (hlavniTicker ?? '').toUpperCase());
  const burzyUvod = exchanges.filter((e) => e !== tickerListing).length;
  const tickeryText = (n: number) => (n === 1 ? 'další ticker' : n < 5 ? 'další tickery' : 'dalších tickerů');
  const burzyText = (n: number) => (n === 1 ? '1 další burze' : `${n} dalších burzách`);

  const tkHlavni = hlavniTicker; // v odkazech stejné jméno jako v úvodu (XETRA)
  // Graf vývoje podle indexu/proxy fondu ZRUŠEN (rozhodnutí majitele 18. 10. 2026) – na detailu jen data fondu.
  // Proxy a delší historie indexu patří do backtestu (tam je popsaná). Backtest počítá v Kč až od prvního
  // kurzu (30. 12. 1999) → od roku max(začátek řady, 2000); +7 dní: řada z posledních dnů roku = od dalšího roku.
  const btOdRok = btCode
    ? Math.max(new Date(new Date(INDEX_BY_CODE[btCode].since).getTime() + 7 * 864e5).getUTCFullYear(), 2000)
    : null;

  // Top 10 pozic: scraper do 18. 10. 2026 zahazoval 1. řádek (u S&P 500 chyběla NVIDIA). Neúplný seznam
  // (9 pozic u fondu s víc než 9 tituly) NEukazovat jako „největší pozice“ – pravidlo č. 1.
  const pozicNeuplne = holdings.length === 9 && (etf.total_holdings ?? 0) > 9;

  // Podobné fondy: výnos v Kč jen u ověřených (fond s výnosem mimo trh = „—“).
  const odlehleIsin = new Set(((await nactiTrhy()) ?? []).flatMap((t) => t.odlehle.map((f) => f.isin)));
  const tickerSouper = souper ? platnyTicker(souper.primary_ticker) : null;

  // Výnosy v úvodu – jediné místo kumulativních 1R/3R/5R. Fond s výnosem mimo trh: „—“.
  const heroByCur = trhOdlehly
    ? { CZK: NEOVERENO, EUR: NEOVERENO, USD: NEOVERENO }
    : returnsByCur;
  const rokVzniku = (() => { const d = etf.inception_date ? new Date(etf.inception_date) : null; return d && !Number.isNaN(d.getTime()) ? String(d.getFullYear()) : '—'; })();
  const faktaHero: [React.ReactNode, string][] = [
    [<InfoTip key="ter" label="Total Expense Ratio – roční poplatek za správu fondu, strhává se průběžně z hodnoty investice.">Poplatek (TER)</InfoTip>, ter(etf.ter_numeric)],
    ['Velikost fondu', money(etf.fund_size_numeric, etf.fund_currency)],
    [<InfoTip key="dist" label={komodita ? TIP_KOMODITA : TIP_DIVIDENDY}>Dividendy</InfoTip>, komodita ? 'Nevyplácí' : isAcc ? VYPLATA_ACC : isDist ? (divYield != null ? `${VYPLATA_DIST} ${procenta(divYield, 2, false)}` : VYPLATA_DIST) : 'Neuvedeno'],
    [<InfoTip key="rep" label="Fyzická replikace = fond reálně nakupuje cenné papíry z indexu; syntetická používá swap s protistranou.">Replikace</InfoTip>, replText.split(' ')[0]],
    [<InfoTip key="dom" label="Země, kde fond právně sídlí. Irsko má výhodnou daňovou smlouvu s USA, W-8BEN neřešíte.">Domicil</InfoTip>, domText],
    ['Na trhu od', rokVzniku],
  ];
  // Zaměření fondu jako štítek: bez kódů měn (USD vedle „Spojené státy“ je navíc) a „7-10“ → „7–10 let“.
  const zamereni = (ceskeZamereni((etf as unknown as { investment_focus?: string | null }).investment_focus ?? null) || '')
    .split(', ').filter((c) => c && !/^[A-Z]{3}$/.test(c)).map((c) => (/^\d+-\d+$/.test(c) ? `${c.replace('-', '–')} let` : /^\d+\+$/.test(c) ? `${c} let` : c))
    .join(', ') || null;
  const pocetDalsich = Math.max(0, (etf.total_holdings ?? 0) - holdings.length);
  const popisFondu = etf.description_cs && etf.description_cs.trim() !== '' && !jeAnglicky(etf.description_cs) ? cleanDesc(etf.description_cs) : null;

  // Riziko: kolísavost, max. pokles a výnos/riziko jsou ze zdroje JEN v EUR (v Kč je nemáme) → jedna tabulka „v EUR“.
  const rr = { y1: sharpe, y3: vol3 == null ? null : num(r.return_per_risk_3y as number), y5: vol5 == null ? null : num(r.return_per_risk_5y as number) };
  const ddMax = num(r.max_drawdown_inception as number);
  const f1 = (v: number | null) => procenta(v, 1, false);
  const f2 = (v: number | null) => (v == null ? '—' : cislo(v, 2));
  const prikladRR = eur.y1 != null && vol1 != null && sharpe != null ? ` Za poslední rok: ${f1(eur.y1)} ÷ ${f1(vol1)} = ${f2(sharpe)}.` : '';

  const faqs: { q: string; a: string }[] = [
    {
      q: `Je ${hlavniTicker ? `${hlavniTicker} (${shortName})` : shortName} vhodný pro dlouhodobé investování?`,
      a: isLev
        ? `Pro dlouhodobé držení obecně ne. Jde o pákový (nebo inverzní) produkt, který násobí DENNÍ pohyb ${indexLabel ? `indexu ${indexLabel}` : 'podkladového trhu'} a každý den se přenastavuje. Za delší období se proto jeho výnos může výrazně lišit od násobku výnosu indexu – při kolísavém trhu i směrem dolů – a o investici lze přijít i úplně. Je určený ke krátkodobému obchodování zkušenými investory.`
        : [
            `Je to ${isAcc ? 'akumulační ' : isDist ? 'distribuční ' : ''}${komodita === 'kryptoměna' ? 'kryptoměnový produkt' : komodita ? 'komoditní produkt' : 'fond'}${indexLabel ? ` sledující index ${indexLabel}` : podklad ? ` (podklad: ${podklad.charAt(0).toLowerCase()}${podklad.slice(1)})` : ''}${replikaceVeta(etf.replication) ? ` ${replikaceVeta(etf.replication)}` : ''}.`,
            `Velikost fondu je ${money(etf.fund_size_numeric, etf.fund_currency)}, roční poplatek ${ter(etf.ter_numeric)}${sidloVeta(etf.fund_domicile) ? ` a ${sidloVeta(etf.fund_domicile)}` : ''}.`,
            'Vhodnost pro vás závisí na vašem cíli, horizontu a na tom, jak snesete kolísání (viz Riziko a kolísavost).',
          ].join(' '),
    },
    ...(ostatniTickery.length > 0 ? [{
      q: `Proč má fond víc tickerů (${[hlavniTicker, ...ostatniTickery].filter(Boolean).slice(0, 4).join(', ')})?`,
      a: `Všechny jsou tentýž fond (ISIN ${etf.isin}) na různých burzách – poplatek, složení i výnos jsou stejné. Liší se burza a měna obchodování.${xetra ? ` U českých brokerů se nejčastěji obchoduje na burze XETRA – ticker ${xetra.ticker}${xetra.currency ? `, v ${xetra.currency}` : ''}.` : ''} U brokera fond najdete i podle ISIN.`,
    }] : []),
    {
      q: 'Vyplácí tento fond dividendy?',
      a: komodita
        ? `Ne. ${komodita === 'kryptoměna' ? 'Kryptoměna' : 'Komodita'} dividendy nevyplácí – hodnota fondu se mění jen s cenou podkladu. Na účet vám nic nechodí a v daňovém přiznání dividendy neřešíte.`
        : isAcc
        ? 'Ne. Je to akumulační fond – dividendy se automaticky reinvestují uvnitř fondu. Na účet vám nic nechodí, takže v ČR neřešíte dividendy v daňovém přiznání.'
        : isDist
        ? `Ano. Je to distribuční fond – dividendy vyplácí na váš účet${divYield != null ? ` (aktuální dividendový výnos zhruba ${procenta(divYield, 2, false)})` : ''}. V ČR se daní 15 % a uvádějí se v daňovém přiznání.`
        : 'U tohoto fondu nemáme distribuční politiku spolehlivě ověřenou. Zkontrolujte si ji v dokumentu KID od emitenta – akumulační fondy dividendy reinvestují, distribuční je vyplácejí na účet.',
    },
    {
      q: 'Musím jako Čech vyplňovat formulář W-8BEN?',
      a: `Ne. W-8BEN se týká amerických (US-domiciled) fondů. Tento fond sídlí ${etf.fund_domicile && DOMICILE_LOK[etf.fund_domicile] ? DOMICILE_LOK[etf.fund_domicile] : `v zemi ${domText}`}, takže srážkovou daň z amerických dividend řeší správce fondu na úrovni fondu.`,
    },
    {
      q: 'Proč ukazujete výnos v korunách?',
      a: `Protože jako český investor utrácíte koruny. Fond se obchoduje v cizí měně (${etf.fund_currency || 'USD/EUR'}), ale váš reálný výnos ovlivňuje i pohyb kurzu. Výnos přepočtený do Kč proto ukazuje, kolik byste reálně vydělali nebo prodělali. Výnos v EUR nebo USD si přepnete v sekci Výkonnost.`,
    },
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  const faktaTabulka: [React.ReactNode, React.ReactNode][] = [
    [<InfoTip key="ter" label="Total Expense Ratio – roční poplatek za správu fondu, strhává se průběžně z hodnoty investice.">Roční poplatek (TER)</InfoTip>, ter(etf.ter_numeric)],
    ['Velikost fondu', money(etf.fund_size_numeric, etf.fund_currency)],
    [<InfoTip key="dist" label={komodita ? TIP_KOMODITA : TIP_DIVIDENDY}>Dividendy</InfoTip>, komodita ? `Nevyplácí (${komodita})` : isAcc ? VYPLATA_ACC : isDist ? VYPLATA_DIST : distText], // jednotné názvy (kolo 5)
    ...(isDist ? [[<InfoTip key="dy" label="Dividendový výnos – kolik fond za rok vyplatil na dividendách vůči své ceně.">Dividendový výnos</InfoTip>, divYield != null ? procenta(divYield, 2, false) : '—'] as [React.ReactNode, React.ReactNode]] : []),
    [<InfoTip key="rep" label="Fyzická replikace = fond reálně nakupuje cenné papíry z indexu; syntetická používá swap s protistranou.">Replikace</InfoTip>, replText],
    [<InfoTip key="dom" label="Země, kde fond právně sídlí. Irsko má výhodnou daňovou smlouvu s USA, W-8BEN neřešíte.">Domicil</InfoTip>, domText],
    podklad
      ? [<InfoTip key="podklad" label="Zdroj dat u tohoto produktu index neuvádí; podklad přebíráme z popisu fondu.">Sleduje</InfoTip>, podklad]
      : ['Sledovaný index', indexLabel ?? '—'],
    // Komodita/krypto bez pozic: řádek „—“ by mátl (drží kov/kryptoměnu, ne cenné papíry).
    ...(komodita && etf.total_holdings == null ? [] : [[<InfoTip key="hold" label="Počet cenných papírů, které fond reálně drží.">Počet držených pozic</InfoTip>, etf.total_holdings != null ? etf.total_holdings.toLocaleString('cs-CZ') : '—'] as [React.ReactNode, React.ReactNode]]),
    [<InfoTip key="mena" label="Měna, ve které fond vede účetnictví. Měnové riziko vůči koruně určuje hlavně to, do čeho fond investuje.">Měna fondu</InfoTip>, etf.fund_currency || '—'],
    ['Datum vzniku', dateLabel(etf.inception_date)],
    ['Emitent', etf.fund_provider || '—'],
    ['ISIN', <span key="isin" className="font-mono text-[13px]">{etf.isin}</span>],
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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

        {/* HLAVIČKA FONDU – vlevo identita a výnos, vpravo klíčová fakta a akce */}
        <section data-sekce="hlavicka" className="pb-8">
          <div className="rounded-2xl bg-slate-900 text-white p-4 md:p-7">
            <div className="md:grid md:grid-cols-[minmax(0,1fr)_19rem] md:gap-8">
              <div className="min-w-0 md:flex md:flex-col">
                <div className="flex items-center gap-3">
                  <EmitentLogo nazev={etf.name} size={40} className="!rounded-lg" />
                  <div className="min-w-0 text-xs text-slate-400 leading-snug">
                    <span className="block text-slate-300 font-medium">{etf.fund_provider}</span>
                    {indexLabel ? <span className="block truncate">Index {indexLabel}</span> : podklad && <span className="block truncate">{podklad}</span>}
                  </div>
                </div>
                <h1 className="mt-3 text-[22px] md:text-3xl font-bold tracking-tight leading-tight">{etf.name}</h1>
                <p className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-slate-300">
                  {hlavniTicker && (
                    <span>
                      {tickerListing ? <>Ticker na {burzaKratce(tickerListing.name)}: </> : 'Ticker: '}
                      <strong data-ticker className="font-semibold text-white">{hlavniTicker}</strong>
                      {tickeryUvod.length > 0 && (
                        // Kolo 5: klik dřív nic viditelně neudělal (jen bublina) → odscroluje na burzy a rozbalí je.
                        <OdkazBurzy title={`Stejný fond se obchoduje i na ${burzyText(burzyUvod)} pod tickery ${tickeryUvod.join(', ')}. Poplatek, složení i výnos jsou stejné, liší se jen burza a měna obchodování.`}>
                          +{NBSP}{tickeryUvod.length} {tickeryText(tickeryUvod.length)}
                        </OdkazBurzy>
                      )}
                    </span>
                  )}
                  <span className="font-mono text-xs text-slate-400">ISIN {etf.isin}</span>
                </p>
                {(zamereni || etf.total_holdings) && (
                  <p className="mt-3 flex flex-wrap gap-1.5 text-xs">
                    {zamereni && <span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-200">{zamereni}</span>}
                    {etf.total_holdings != null && etf.total_holdings > 1 && <span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-200 tabular-nums">{etf.total_holdings.toLocaleString('cs-CZ')} {etf.total_holdings < 5 ? 'pozice' : 'pozic'} ve fondu</span>}
                  </p>
                )}

                <div className="mt-5 md:mt-auto md:pt-6">
                  <HeroVynosy
                    byCur={heroByCur}
                    datum={isStale ? (
                      <span className="inline-flex items-center gap-1 text-amber-200"><AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> data z {dataDate.toLocaleDateString('cs-CZ')}</span>
                    ) : (
                      <span className="tabular-nums">data k {dataDate.toLocaleDateString('cs-CZ')}</span>
                    )}
                  />
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
              </div>

              {/* Klíčová fakta + akce (dřív samotná tlačítka a prázdno pod nimi) */}
              <div className="mt-5 md:mt-0 flex flex-col rounded-xl bg-white/[0.04] ring-1 ring-white/10 p-4">
                <dl className="grid grid-cols-3 gap-x-3 gap-y-3 md:grid-cols-1 md:gap-y-0 md:divide-y md:divide-white/10">
                  {faktaHero.map(([k, v], i) => (
                    <div key={i} className="min-w-0 md:flex md:items-baseline md:justify-between md:gap-3 md:py-[7px] md:first:pt-0">
                      <dt className="text-[11px] md:text-xs text-slate-400">{k}</dt>
                      <dd className="text-sm font-semibold text-white tabular-nums truncate">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4 grid grid-cols-2 gap-2 md:mt-auto md:pt-4 [&_a]:h-11 [&_button]:h-11 md:[&_a]:h-10 md:[&_button]:h-10 [&_a]:py-0 [&_button]:py-0 [&_a]:whitespace-nowrap [&_button]:whitespace-nowrap [&_button]:px-2 [&_a]:px-2">
                  <Link href={`/kde-koupit?isin=${etf.isin}`} className="flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-teal-700">
                    Kde koupit <ArrowRight className="w-4 h-4" />
                  </Link>
                  <CompareButton isin={etf.isin} label={hlavniTicker ?? shortName} variant="hero" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VÝKONNOST – stejná kostra pro všechny fondy: karta grafu (čára indexu / roční sloupce) + doplňkové výnosy */}
        <section data-sekce="vykonnost" className="pb-10">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Výkonnost</h2>
            <CurrencyToggle size="sm" />
          </div>
          {trhOdlehly && (
            <p role="note" className="mb-3 flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 leading-relaxed">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
              <span>Výnosy za období neukazujeme: výnos za 12 měsíců se u tohoto fondu lišil o víc než 1,5 p. b. od ostatních fondů na {trhOdlehly.trh.label} (medián {procenta(trhOdlehly.median, 1, false)} v Kč) – nejčastěji kvůli opožděné ceně u zdroje dat.{' '}
              <Link href={trhOdlehly.trh.href} className="font-medium text-teal-700 underline underline-offset-2">Fondy na stejný trh</Link></span>
            </p>
          )}
          <div className="grid gap-4 lg:grid-cols-5 items-start">
            <div className="lg:col-span-3 min-w-0">
              <GrafVykonnosti cols={calCols2} />
            </div>
            <div className="lg:col-span-2 min-w-0">
              {/* Pravidlo č. 1: u fondu s výnosem mimo trh (opožděná cena u zdroje) výnosy za období neukazovat („—“). */}
              <EtfReturns
                byCur={trhOdlehly ? { CZK: NEOVERENO, EUR: NEOVERENO, USD: NEOVERENO } : returnsByCur}
                fundCurrency={etf.fund_currency}
                short={trhOdlehly ? { m1: null, m3: null, m6: null } : shortPeriods}
              >
                {btCode && (
                  <Link href={`/backtest?fondy=${etf.isin}:100&run=1`} className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">
                    Delší historie indexu v backtestu (v Kč od roku {btOdRok}) <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                {/* Stroj času jen při PŘESNÉ shodě indexu s presetem (S&P 500). */}
                {btCode === 'sp500' && (
                  <Link href="/stroj-casu?co=sp500&mesicne=3000&od=2010" className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">
                    3 000 Kč měsíčně od roku 2010 – kolik by to dnes bylo <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </EtfReturns>
            </div>
          </div>
        </section>

        {/* SLOŽENÍ FONDU */}
        {(holdings.length > 0 || sectors.length > 0 || countries.length > 0) && (
          <section data-sekce="slozeni" className="pb-10">
            {/* Složení nemá v DB vlastní datum (justETF ho uvádí „k 31. 8.“, výnosy jsou k včerejšku) – revize kola 4.
                Až scraper začne ukládat datum složení, nahradit konkrétním „Složení k …“. */}
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Složení fondu</h2>
              <p className="mt-1 text-xs text-slate-500">Podle posledního zveřejnění emitenta – obvykle 1–2 měsíce zpětně, ne k datu výnosů.</p>
            </div>
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
                      <span className="font-medium text-slate-700">{procenta(top10Sum, 1, false)}</span> fondu
                      {pocetDalsich > 0 ? <>, zbytek je rozložen mezi dalších {pocetDalsich.toLocaleString('cs-CZ')} titulů.</> : '.'}
                    </p>
                  )}
                </div>
              )}

              <div className={holdings.length > 0 && !pozicNeuplne ? 'space-y-4' : 'contents'}>
                {sectors.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-teal-700" />
                      <InfoTip label={SEKTORY_POZNAMKA}>Sektory</InfoTip>
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">Podle klasifikace zdroje dat, ne GICS.</p>
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

        {/* RIZIKO – všechna rizika pohromadě a v jedné měně (EUR; v Kč je zdroj nemá) */}
        <section data-sekce="riziko" className="pb-10">
          <SectionHead title="Riziko a kolísavost" />
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-500">
                    <th className="py-2.5 pl-4 pr-1 text-left font-medium"><span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-slate-600 ring-1 ring-slate-200">v EUR</span></th>
                    <th className="py-2.5 px-2 text-right font-medium">1 rok</th>
                    <th className="py-2.5 px-2 text-right font-medium">3 roky</th>
                    <th className="py-2.5 px-4 text-right font-medium">5 let</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 tabular-nums whitespace-nowrap text-[13px] sm:text-sm">
                  <tr>
                    <td className="py-3 pl-4 pr-1 text-slate-600"><InfoTip label="Roční kolísavost (volatilita) ceny v eurech. Vyšší číslo = větší výkyvy nahoru i dolů.">Kolísavost</InfoTip></td>
                    <td className="py-3 px-1.5 sm:px-2 text-right font-semibold text-slate-900">{f1(vol1)}</td>
                    <td className="py-3 px-1.5 sm:px-2 text-right text-slate-700">{f1(vol3)}</td>
                    <td className="py-3 px-4 text-right text-slate-700">{f1(vol5)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pl-4 pr-1 text-slate-600"><InfoTip label="Největší propad z vrcholu na dno v daném období (v eurech) – kolik byste v nejhorším dočasně viděli v minusu.">Max. pokles</InfoTip></td>
                    <td className="py-3 px-1.5 sm:px-2 text-right font-semibold text-red-600">{pct(dd1)}</td>
                    <td className="py-3 px-1.5 sm:px-2 text-right text-red-600">{pct(dd3)}</td>
                    <td className="py-3 px-4 text-right text-red-600">{pct(dd5)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pl-4 pr-1 text-slate-600"><InfoTip label={`Průměrný roční výnos vydělený kolísavostí, obojí v eurech. Vyšší číslo = víc výnosu na jednotku kolísání.${prikladRR}`}>Výnos / riziko</InfoTip></td>
                    <td className="py-3 px-1.5 sm:px-2 text-right font-semibold text-slate-900">{f2(rr.y1)}</td>
                    <td className="py-3 px-1.5 sm:px-2 text-right text-slate-700">{f2(rr.y3)}</td>
                    <td className="py-3 px-4 text-right text-slate-700">{f2(rr.y5)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="lg:col-span-2 space-y-2 text-sm text-slate-600 leading-relaxed">
              {nesediRiziko.length > 0 && <p className="text-xs text-amber-800">„—“ u části rizika: {RIZIKO_NESEDI_TEXT}</p>}
              <p><strong className="text-slate-900">{volDesc(vol1)}</strong>{ddMax != null && <> Největší propad od vzniku fondu byl <strong className="text-red-600 tabular-nums">{pct(ddMax)}</strong> (v EUR).</>}</p>
              {etf.fund_currency && etf.fund_currency !== 'CZK' && (
                <p className="text-xs text-slate-500">
                  Kolísavost a propady jsou v eurech – v korunách mohou být jiné, protože k nim přistupuje pohyb kurzu.{isHedged ? ` Měnové zajištění (hedged) tlumí jen pohyby vůči ${etf.fund_currency}, ne vůči koruně.` : ''}{' '}
                  <Link href="/menove-riziko-etf" className="font-medium text-teal-700 underline underline-offset-2">Jak měna mění výnos v Kč</Link>
                </p>
              )}
              {/* Práh 80 %: u VWCE (≈ 60 % USA) varování o koncentraci působilo absurdně (revize 18. 10. 2026). */}
              {countries[0] && (countries[0].weight ?? 0) >= 80 && (
                <p className="text-xs text-slate-500">Zhruba {Math.round(countries[0].weight ?? 0)} % fondu míří do jediné země ({ceskaZeme(countries[0].name)}).</p>
              )}
            </div>
          </div>
        </section>

        {/* O FONDU – popis + všechna základní fakta (dřív samostatný box s jedinou větou) */}
        <section data-sekce="fakta" data-komodita={komodita ?? undefined} className="pb-10">
          <SectionHead title="O fondu" />
          {popisFondu && <p className="mb-4 max-w-3xl text-sm text-slate-600 leading-relaxed">{popisFondu}</p>}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <dl className="grid md:grid-cols-2 md:divide-x divide-slate-100">
              {[faktaTabulka.slice(0, Math.ceil(faktaTabulka.length / 2)), faktaTabulka.slice(Math.ceil(faktaTabulka.length / 2))].map((sloupec, si) => (
                <div key={si} className="divide-y divide-slate-100 border-t border-slate-100 first:border-t-0 md:border-t-0">
                  {sloupec.map(([k, v], i) => (
                    <div key={i} className="flex items-baseline justify-between gap-4 px-4 py-2.5 text-sm">
                      <dt className="text-slate-500 shrink-0">{k}</dt>
                      <dd className="min-w-0 text-right font-medium text-slate-900 tabular-nums">{v}</dd>
                    </div>
                  ))}
                </div>
              ))}
            </dl>
          </div>
          {(isAcc || isDist) && (
            <p className="mt-3 text-sm text-slate-600">
              {isAcc ? 'Fond dividendy reinvestuje – na účet nic nechodí a do prodeje nic nedaníte.' : 'Fond vyplácí dividendy na účet – v Česku je zdaníte 15 %.'}{' '}
              <Link href="/akumulacni-vs-distribucni-etf" className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800">Akumulační, nebo distribuční?</Link>
            </p>
          )}

          {/* Burzy – hlavní listing vidět, ostatní sbalené */}
          {exchanges.length > 0 && (
            <div id="burzy" data-sekce="burzy" className="mt-4 scroll-mt-20 rounded-xl border border-slate-200 bg-white">
              {hlavniListing && (
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <span className="text-slate-600">
                    {xetra ? <InfoTip label="Na XETRA nakupuje většina brokerů, které Češi používají (DEGIRO, XTB, Trading 212).">Burza XETRA</InfoTip> : hlavniListing.name}
                    {xetra && <span className="ml-2 inline-block rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-800 ring-1 ring-teal-100 whitespace-nowrap">u českých brokerů nejčastěji</span>}
                  </span>
                  <span className="tabular-nums"><strong className="font-semibold text-slate-900">{hlavniListing.ticker}</strong> <span className="text-slate-500">· {hlavniListing.currency || '—'}</span></span>
                </div>
              )}
              {dalsiBurzy.length > 0 && (
                <details id="dalsi-burzy" className="group border-t border-slate-100">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <span>Další burzy ({dalsiBurzy.length}) <span className="font-normal text-slate-500">– {dalsiTickery.length > 0 ? `${dalsiTickery.length === 1 ? 'ticker' : 'tickery'} ${dalsiTickery.join(', ')}` : `stejný ticker ${hlavniListing?.ticker ?? ''}`}, stejný fond</span></span>
                    <ChevronDown className="w-4 h-4 shrink-0 text-slate-400 group-open:rotate-180 transition-transform" aria-hidden="true" />
                  </summary>
                  <ul className="divide-y divide-slate-100 border-t border-slate-100">
                    {dalsiBurzy.map((e, i) => (
                      <li key={i} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
                        <span className="text-slate-600">{e.name}</span>
                        <span className="tabular-nums"><strong className="font-semibold text-slate-900">{e.ticker}</strong> <span className="text-slate-500">· {e.currency || '—'}</span></span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}
        </section>

        {/* DALŠÍ FONDY NA STEJNÝ INDEX + srovnání s nejbližším */}
        {(podobne.length > 0 || parHref) && (
          <section data-sekce="podobne-fondy" className="pb-10">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Další fondy na {indexLabel ? `index ${indexLabel}` : 'stejný index'}</h2>
              <Link href={zebricekHref} className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">{zebricekLabel} <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-3 items-start">
              {podobne.length > 0 && (
                <ul className="lg:col-span-2 min-w-0 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
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
                            <span className="block text-[11px] text-slate-400">1 rok v Kč</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
              {parHref && souper && tickerSouper && (
                <Link href={parHref} className="group min-w-0 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm transition-all">
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
          <FaqSeznam items={faqs} />
        </section>

        {/* Zdroj dat – jednou a střídmě (revize 18. 10. 2026: justETF se na stránce jmenoval 2×). */}
        <p className="flex items-start gap-1.5 text-xs text-slate-400 leading-relaxed">
          <Database className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
          <span>Data fondu: justETF{etf.fund_provider ? `, ${etf.fund_provider}` : ''} · kurzy ČNB · data k {dateStr}{isStale ? ` (před ${staleDays} dny)` : ''}. <Link href="/o-nas" className="underline underline-offset-2 hover:text-slate-600">O webu</Link></span>
        </p>
        <InvestmentDisclaimer variant="inline" className="mt-2 !text-slate-400" />
      </main>

    </div>
  );
}
