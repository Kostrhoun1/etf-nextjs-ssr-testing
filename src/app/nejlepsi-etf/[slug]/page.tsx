import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import { notFound } from 'next/navigation';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, ArrowRight, ArrowLeft, Trophy, Coins, AlertTriangle,
  HelpCircle, Wallet, BookOpen, ChevronDown, Users,
} from 'lucide-react';
import {
  getTopETFsForCategory, getCategoryCount, getFlagshipComposition, categoryConfigs,
  type ETFBasicInfo, getDataDate,
} from '@/lib/etf-data';
import { ter, money, shortName, SectionHead, CompositionInfographic, CategoryIndexes, slozeniPouzitelne } from '@/components/design-preview/CategoryUI';
import { getCategoryContent } from '@/components/design-preview/categoryContent';
import AktualnostDat, { nejstarsiDatum } from '@/components/design-preview/AktualnostDat';
import { topIndexesForCategory } from '@/components/design-preview/indexDescriptions';
import CompareButton from '@/components/design-preview/CompareButton';
import EmitentLogo from '@/components/home/EmitentLogo';
import TabulkaFondu, { type RadekFondu } from '@/components/zebricky/TabulkaFondu';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { platnyTicker } from '@/lib/ticker';
import { detectHedging } from '@/utils/hedgingDetection';
import { distKind } from '@/utils/distribution';

export const revalidate = 86400;
export const dynamicParams = true;

/** Kolik fondů posíláme do tabulky (největší napřed). Větší kategorie (dluhopisy, akcie) odkazují
 *  na srovnávač – stovky řádků v HTML by stránku zpomalily a nikdo je nečte. */
const MAX_V_TABULCE = 300;

/**
 * Kterou dimenzi složení preferovat v infografice podle typu kategorie.
 * Sektorové/tematické kategorie ukážou top pozice (co konkrétně držíte),
 * ostatní geografické rozložení. Fallback řeší sama komponenta.
 */
function preferredDimension(slug: string): 'country' | 'sector' | 'holding' {
  const holdingFirst = [
    'technologicke', 'ai-', 'nasdaq', 'cloud', 'robotika', 'kyberbezpecnost',
    'healthcare', 'biotechnologie', 'financni', 'energeticke', 'prumyslove',
    'spotrebitelske', 'infrastrukturni', 'defense', 'clean-energy',
    'obnovitelne', 'realitni', 'nemovitostni', 'value', 'growth', 'small-cap',
    'dividendove', 'ai-etf', 'kyber',
  ];
  if (holdingFirst.some((k) => slug.includes(k))) return 'holding';
  return 'country';
}

/* Kategorie, u kterých dává smysl odkázat na pilíř „Světové ETF – který index"
   (porovnání MSCI World / FTSE All-World / ACWI / S&P 500 napříč žebříčky).
   Silo: pilíř = hub „který index", žebříček = užší seznam pro daný index. */
const WORLD_INDEX_SLUGS = new Set([
  'nejlepsi-celosvetove-etf', 'nejlepsi-msci-world-etf', 'nejlepsi-sp500-etf',
  'nejlepsi-americke-etf', 'nejlepsi-evropske-etf', 'nejlepsi-emerging-markets-etf',
  'nejlepsi-technologicke-etf', 'nejlevnejsi-etf',
]);

/* Proklik do srovnávače s předvyplněným filtrem – jen tam, kde filtr srovnávače odpovídá kategorii
   (index = kanonický název z src/utils/indexNormalization.ts, kat = třída aktiv). Jinde obecný odkaz. */
const SROVNAVAC: Record<string, { q: string; text: string }> = {
  'nejlepsi-sp500-etf': { q: `index=${encodeURIComponent('S&P 500')}`, text: 'Fondy na S&P 500 ve srovnávači' },
  'nejlepsi-msci-world-etf': { q: `index=${encodeURIComponent('MSCI World')}`, text: 'Fondy na MSCI World ve srovnávači' },
  'nejlepsi-nasdaq-etf': { q: `index=${encodeURIComponent('Nasdaq 100')}`, text: 'Fondy na Nasdaq-100 ve srovnávači' },
  'nejlepsi-akciove-etf': { q: 'kat=Akcie', text: 'Všechny akciové fondy ve srovnávači' },
  'nejlepsi-dluhopisove-etf': { q: 'kat=Dluhopisy', text: 'Všechny dluhopisové fondy ve srovnávači' },
  'nejlepsi-komoditni-etf': { q: 'kat=Komodity', text: 'Všechny komoditní fondy ve srovnávači' },
};

/** Varianty indexu s jinou metodikou – nevyhrávají „nejvyšší výnos“ (liší se metodikou, ne kvalitou fondu;
 *  revize 18. 10. 2026: v S&P 500 vyhrával „S&P 500 Leaders“). */
const VARIANTA = /\b(ESG|SRI|Screened|Scored|Leaders|Paris|Climate|PAB|CTB|Equal Weight|Hedged|Islamic|Active|Enhanced)\b/i;

/** Měna zajištění třídy fondu („EUR“…), „ano“ = zajištěná bez poznané měny, null = nezajištěná.
 *  UBS značí zajištěné třídy „hEUR“/„hCHF“, Swisscanto „EAH CHF“ – obecná detekce je nezná. */
function zajisteni(nazev: string): string | null {
  const ubs = nazev.match(/\bh(EUR|USD|CHF|GBP|JPY|SGD)\b/);
  if (ubs) return ubs[1];
  const swisscanto = nazev.match(/\bEAH ([A-Z]{3})\b/); // Swisscanto: „EA“ = nezajištěná, „EAH“ = zajištěná třída
  if (swisscanto) return swisscanto[1];
  const h = detectHedging(nazev);
  if (!h.isHedged) return null;
  return h.hedgedCurrency
    ?? nazev.match(/[Hh]edged (?:to )?\(?([A-Z]{3})\b/)?.[1]   // „hedged to JPY“, „hedged (CHF)“
    ?? nazev.match(/\b([A-Z]{3}) Daily Hedged/)?.[1]                          // WisdomTree „GBP Daily Hedged“
    ?? 'ano';
}

/** Krátký název fondu: bez „UCITS ETF…“ a koncové závorky. (shortName z CategoryUI maže všechno od první
 *  závorky po poslední – „UBS ETF (CH) Gold (USD) A-dis“ pak bylo „UBS ETF A-dis“.) */
const nazevFondu = (n: string) => n.replace(/\s+UCITS\b.*$/i, '').replace(/\s+\([^()]*\)\s*$/, '').trim() || n;

const num = (v: unknown): number | null => (v == null || Number.isNaN(Number(v)) ? null : Number(v));
const fmtDatum = (d: Date) => d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
const pctKc = (v: number | null) =>
  v == null ? '—' : `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
/** Skloňování „fond“ (1 fond, 2–4 fondy, 5+ fondů). */
const fondu = (n: number) => (n === 1 ? 'fond' : n >= 2 && n <= 4 ? 'fondy' : 'fondů');

export function generateStaticParams() {
  return Object.keys(categoryConfigs).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const cfg = categoryConfigs[slug];
  if (!cfg) return { title: 'Žebříček ETF', robots: { index: false, follow: false } };
  return {
    title: `${cfg.title} – srovnání a výnosy v Kč`,
    description: cfg.metaDescription || cfg.description,
    alternates: { canonical: `/nejlepsi-etf/${slug}` },
  };
}

export default async function CategoryDetailPreview(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const cfg = categoryConfigs[slug];
  if (!cfg) notFound();

  const [all, pocetDb, dataDate] = await Promise.all([
    getTopETFsForCategory({ ...cfg, limit: MAX_V_TABULCE }),
    getCategoryCount(cfg),
    getDataDate(new Date()),
  ]);
  const etfs = all.filter((e) => e.ter_numeric != null || e.fund_size_numeric != null);
  // Počet fondů v kategorii: z DB (count), jinak aspoň kolik jsme načetli – nikdy nevymyšlený.
  const celkem = Math.max(pocetDb ?? 0, etfs.length);
  const content = getCategoryContent(slug);
  const nejstarsi = nejstarsiDatum(etfs);
  const datumText = fmtDatum(dataDate);

  // Výběr podle dat: největší, nejlevnější, nejvýkonnější za 3 roky (při nedostatku 3R dat za 1 rok).
  const bySize = [...etfs].filter((e) => e.fund_size_numeric != null).sort((a, b) => (b.fund_size_numeric! - a.fund_size_numeric!));
  const byTer = [...etfs].filter((e) => e.ter_numeric != null && e.ter_numeric > 0)
    .sort((a, b) => (a.ter_numeric! - b.ter_numeric!) || ((b.fund_size_numeric ?? 0) - (a.fund_size_numeric ?? 0)));
  // Nejvýkonnější: jen „čisté“ třídy (ne ESG/Screened/Leaders, ne měnově zajištěné – liší se metodikou nebo
  // měnou, ne kvalitou fondu) a fondy ≥ 100 mil. €. Momentum za 12 měsíců je u indexových kategorií spíš
  // šum (revize 18. 10. 2026) → primárně 3 roky v Kč, když je má aspoň 3 fondy.
  const jeEsgKategorie = /esg|udrzitel|klima|zajist|hedg|equal|stejne-vah/i.test(slug);
  const kandidati = etfs.filter((e) => (e.fund_size_numeric ?? 0) >= 100 && (jeEsgKategorie || (!VARIANTA.test(e.name) && !zajisteni(e.name))));
  const s3 = kandidati.filter((e) => e.return_3y_czk != null);
  const vykonObdobi: '3y' | '1y' = s3.length >= 3 ? '3y' : '1y';
  const byPerf = (vykonObdobi === '3y' ? s3 : kandidati.filter((e) => e.return_1y_czk != null))
    .sort((a, b) => vykonObdobi === '3y' ? (b.return_3y_czk! - a.return_3y_czk!) : (b.return_1y_czk! - a.return_1y_czk!));

  const recos: { tag: string; icon: typeof Trophy; etf: ETFBasicInfo; hodnota: string; popis: string }[] = [];
  const pushReco = (tag: string, icon: typeof Trophy, etf: ETFBasicInfo | undefined, hodnota: string, popis: string) => {
    if (etf && !recos.some((r) => r.etf.isin === etf.isin)) recos.push({ tag, icon, etf, hodnota, popis });
  };
  pushReco('Největší fond', Trophy, bySize[0], bySize[0] ? money(bySize[0].fund_size_numeric) : '', 'spravovaný majetek');
  pushReco('Nejnižší poplatek', Wallet, byTer[0], byTer[0] ? ter(byTer[0].ter_numeric) : '', 'roční poplatek');
  if (byPerf[0]) {
    const v = vykonObdobi === '3y' ? byPerf[0].return_3y_czk : byPerf[0].return_1y_czk;
    pushReco('Nejvýkonnější', TrendingUp, byPerf[0], pctKc(v),
      vykonObdobi === '3y' ? 'celkem za 3 roky v Kč' : 'za 12 měsíců v Kč');
  }

  // Tabulka – data pro klienta (bez fallbacku mezi měnami).
  const radky: RadekFondu[] = etfs.map((e) => {
    const k = distKind(e.distribution_policy);
    return {
      isin: e.isin,
      nazev: nazevFondu(e.name),
      ticker: platnyTicker(e.primary_ticker),
      ter: num(e.ter_numeric),
      velikost: num(e.fund_size_numeric),
      r1: { CZK: num(e.return_1y_czk), EUR: num(e.return_1y), USD: num(e.return_1y_usd) },
      r3: { CZK: num(e.return_3y_czk), EUR: num(e.return_3y), USD: num(e.return_3y_usd) },
      typ: k === 'unknown' ? null : k,
      zajisteni: zajisteni(e.name),
    };
  });
  const sr = SROVNAVAC[slug];
  const srovnavac = sr ? { href: `/srovnani?${sr.q}`, text: sr.text } : { href: '/srovnani', text: 'Všechny fondy ve srovnávači' };

  // Infografika „co v tom je" – složení největšího fondu kategorie. Rozložení podle zemí jen když
  // něco říká: „USA 97 %“ u S&P 500 je informace s nulovou hodnotou → sektory.
  const flagship = bySize[0];
  const composition = flagship ? await getFlagshipComposition(flagship.isin) : null;
  let prefer = preferredDimension(slug);
  if (prefer === 'country' && (composition?.countries?.[0]?.weight ?? 0) > 90) prefer = 'sector';

  // Reálně sledované indexy v kategorii (s odborným popisem) – datově řízené.
  const topIndexes = topIndexesForCategory(etfs);

  const faqSchema = content ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: content.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Žebříčky ETF', item: 'https://etfpruvodce.cz/zebricky' },
      { '@type': 'ListItem', position: 3, name: cfg.title, item: `https://etfpruvodce.cz/nejlepsi-etf/${slug}` },
    ],
  };

  const itemListSchema = bySize.length > 0 ? {
    '@context': 'https://schema.org', '@type': 'ItemList', name: cfg.title,
    itemListElement: bySize.slice(0, 10).map((e, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'FinancialProduct', name: shortName(e.name), identifier: e.isin, url: `https://etfpruvodce.cz/etf/${e.isin}` },
    })),
  } : null;

  const maSlozeni = slozeniPouzitelne(composition, prefer); // zlato, ropa: složení nemá smysl
  const slozeni = maSlozeni ? <CompositionInfographic comp={composition} prefer={prefer} fundLabel={flagship ? shortName(flagship.name) : undefined} /> : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <SiteNav />
          <HeaderSearch />
        </div>
      </header>

      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-28">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5 min-w-0">
          <Link href="/" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <Link href="/zebricky" className="hover:text-slate-700">Žebříčky</Link>
          <span>/</span>
          <span className="text-slate-700 truncate">{cfg.title}</span>
        </nav>

        {/* ÚVOD – krátký: název, jedna věta, počet fondů a datum. Žádná půlobrazovková infografika. */}
        <section data-sekce="uvod" className="pt-2 pb-6">
          <h1 className="text-[28px] md:text-4xl font-bold tracking-tight leading-tight text-slate-900">{cfg.title}</h1>
          <p className="mt-2 max-w-2xl text-[15px] md:text-base text-slate-600 leading-relaxed">{cfg.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
            <span data-pocet-fondu={pocetDb ?? undefined}><strong className="font-semibold text-slate-900 tabular-nums">{celkem.toLocaleString('cs-CZ')}</strong> {fondu(celkem)} v žebříčku</span>
            <AktualnostDat datum={dataDate} nejstarsi={nejstarsi} />
          </div>
        </section>

        {/* VYBRANÉ PODLE DAT – tři fondy, každý s jedním hlavním číslem */}
        {recos.length > 0 && (
          <section data-sekce="vybrane" className="pb-8" aria-labelledby="vybrane-h">
            <h2 id="vybrane-h" className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Vybrané podle dat</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {recos.map(({ tag, icon: Icon, etf, hodnota, popis }) => {
                const tk = platnyTicker(etf.primary_ticker);
                return (
                  <div key={etf.isin} className="group relative min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-3 md:p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                    <div className="absolute right-3 top-3 z-10 hidden md:block">
                      <CompareButton isin={etf.isin} label={tk ?? shortName(etf.name)} variant="chip" />
                    </div>
                    {/* Mobil: jeden řádek (logo, štítek + název, číslo vpravo) – ať je tabulka fondů blízko. */}
                    <Link href={`/etf/${etf.isin}`} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 md:flex md:flex-col md:items-stretch min-w-0">
                      <span className="md:hidden"><EmitentLogo nazev={etf.name} size={32} /></span>
                      <span className="min-w-0">
                        <span className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-semibold uppercase tracking-wide text-teal-700">
                          <Icon className="w-3.5 h-3.5" /> {tag}
                        </span>
                        <span className="mt-0.5 md:mt-2.5 flex items-center gap-2.5 min-w-0 md:pr-8">
                          <span className="hidden md:inline-flex"><EmitentLogo nazev={etf.name} size={32} /></span>
                          <span className="min-w-0">
                            <span className="block text-[15px] font-semibold leading-snug text-slate-900 group-hover:text-teal-800 truncate md:whitespace-normal md:line-clamp-2">{nazevFondu(etf.name)}</span>
                            <span className="block text-xs text-slate-500">{tk ?? `${etf.isin.slice(0, 2)}…${etf.isin.slice(-4)}`}<span className="md:hidden"> · {popis}</span></span>
                          </span>
                        </span>
                      </span>
                      <span className="text-right md:mt-3 md:flex md:items-baseline md:justify-between md:gap-3 md:border-t md:border-slate-100 md:pt-3">
                        <span className={`text-lg md:text-2xl font-bold tabular-nums whitespace-nowrap ${Icon === TrendingUp ? 'text-emerald-700' : 'text-slate-900'}`}>{hodnota}</span>
                        <span className="hidden md:inline text-xs text-slate-500 text-right leading-snug">{popis}</span>
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* VŠECHNY FONDY KATEGORIE – řaditelná tabulka */}
        {radky.length > 0 && (
          <section data-sekce="tabulka" className="pb-10" aria-labelledby="tabulka-h">
            <h2 id="tabulka-h" className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-3">
              {celkem > radky.length ? `${radky.length} největších z ${celkem.toLocaleString('cs-CZ')} fondů` : `Všech ${celkem} ${fondu(celkem)}`}
            </h2>
            <TabulkaFondu radky={radky} celkem={celkem} vychozi={cfg.sortBy === 'ter_numeric' ? 'ter' : 'size'} datum={datumText} srovnavac={srovnavac} />
          </section>
        )}

        {/* CO V KATEGORII JE – složení největšího fondu + sledované indexy vedle sebe */}
        {(maSlozeni || topIndexes.length > 0) && (
          <section data-sekce="slozeni" className="pb-10">
            <SectionHead title="Co v kategorii je" desc="Složení největšího fondu a indexy, které fondy v žebříčku sledují." />
            <div className={`grid gap-4 ${maSlozeni && topIndexes.length > 0 ? 'lg:grid-cols-2 lg:items-start' : ''}`}>
              {slozeni}
              {topIndexes.length > 0 && (
                <div>
                  <CategoryIndexes indexes={topIndexes} total={etfs.length} sloupce={maSlozeni ? 1 : 2} />
                  {WORLD_INDEX_SLUGS.has(slug) && (
                    <Link href="/svetove-etf-indexy" className="mt-3 inline-flex items-center gap-1.5 min-h-11 text-sm font-medium text-teal-700 hover:text-teal-800">
                      MSCI World, FTSE All-World, nebo S&amp;P 500? Srovnání indexů <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* PRO KOHO + NA CO SI DÁT POZOR – vedle sebe */}
        {content && (content.forWhom || content.risks.length > 0) && (
          <section data-sekce="pro-koho" className="pb-8 grid gap-4 lg:grid-cols-2 lg:items-start">
            {content.forWhom && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900"><Users className="w-5 h-5 text-teal-700" /> Pro koho se hodí</h2>
                <p className="mt-2 text-sm md:text-[15px] text-slate-700 leading-relaxed">{content.forWhom}</p>
              </div>
            )}
            {content.risks.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 md:p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900"><AlertTriangle className="w-5 h-5 text-amber-700" /> Na co si dát pozor</h2>
                <ul className="mt-2 space-y-2">
                  {content.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-950/90 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" aria-hidden /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* HLUBŠÍ VÝKLAD – dlouhý text schovaný do rozbalovacího bloku */}
        {content && (content.intro.length > 0 || content.verdict.length > 0) && (
          <section data-sekce="vyklad" className="pb-8">
            <details className="group rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-5 py-4 md:px-6 hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm md:text-base font-semibold text-slate-900 leading-tight">{content.introTitle}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">Podrobný rozbor kategorie a na co se při výběru dívat</span>
                  </span>
                </span>
                <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-6 md:px-6 border-t border-slate-100">
                <div className="pt-5 space-y-3 text-sm md:text-[15px] text-slate-700 leading-relaxed max-w-3xl">
                  {content.intro.map((p, i) => <p key={i}>{p}</p>)}
                </div>
                {content.verdict.length > 0 && (
                  <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50/60 p-5 max-w-3xl">
                    <p className="text-xs font-medium uppercase tracking-wide text-teal-700 mb-2">Na co se při výběru dívat</p>
                    <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
                      {content.verdict.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                  </div>
                )}
              </div>
            </details>
          </section>
        )}

        {/* FAQ – přes celou šířku, na desktopu dva sloupce */}
        {content && content.faqs.length > 0 && (
          <section data-sekce="faq" className="pb-8">
            <SectionHead title="Časté dotazy" />
            <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
              {content.faqs.map((f, i) => (
                <details key={i} className="rounded-xl border border-slate-200 bg-white p-4 group">
                  <summary className="flex items-center justify-between gap-3 cursor-pointer text-sm font-medium text-slate-800 list-none min-h-6">
                    <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-teal-700 shrink-0" /> {f.q}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section data-sekce="dalsi-kroky" className="pb-8">
          <div className="flex flex-wrap gap-3">
            <Link href={srovnavac.href} className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800">Porovnat fondy <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/kde-koupit" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400"><Coins className="w-4 h-4" /> Kde koupit</Link>
            <Link href="/zebricky" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400"><ArrowLeft className="w-4 h-4" /> Všechny žebříčky</Link>
          </div>
        </section>

        <InvestmentDisclaimer variant="box" />
      </main>
    </div>
  );
}
