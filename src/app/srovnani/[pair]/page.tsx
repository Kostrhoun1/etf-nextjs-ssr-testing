import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { TrendingUp, ArrowLeft, ArrowRight, Coins, Layers, Landmark, Info, Wallet, HelpCircle, ChevronDown, Equal, Database, LineChart } from 'lucide-react';
import { getComparisonETFData, type ComparisonETF , getDataDate } from '@/lib/etf-data';
import { SrovnaniSoubojKarta } from '@/components/design-preview/SrovnaniCompareUI';
import { getPairContent } from '@/components/design-preview/pairContent';
import { terFmt, procenta, velikostFondu } from '@/lib/formatyCisel';

// Jednotné formáty (kolo 5): „0,07 %“, „−15,9 %“, „139,4 mld. €“ – src/lib/formatyCisel.ts.
const ter = (v: number | null) => terFmt(v);
const pct = (v: number | null) => procenta(v);
const money = (v: number | null, _cur?: string | null) => velikostFondu(v);
import { POPULAR_PAIRS, KURATORSKE, KURATORSKE_ALIASY, kanonickaDvojice } from '@/lib/pairs';
import DalsiSrovnani from '@/components/design-preview/DalsiSrovnani';
import { distKind } from '@/utils/distribution';
import { platnyTicker, zobrazovanyTicker } from '@/lib/ticker';
import { nactiDoplnkyFondu, tickerProCesko } from '@/lib/srovnaniRocni';
import SrovnaniRocniVynosy from '@/components/design-preview/SrovnaniRocniVynosy';
import ParametryDvojice from './ParametryDvojice';
import { barvaFondu } from '@/lib/barvyFondu';
import { datumCen } from '@/lib/datumCen';
import { FaqSeznam } from '@/components/design-preview/brokerUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { ceskaZeme } from '@/lib/preklady';
import { indexFonduLabel } from '@/utils/indexNormalization';

export const revalidate = 86400;
export const dynamicParams = true;

/* Nejžádanější dvojice se předgenerují staticky; zbytek on-demand (seznam v src/lib/pairs.ts).
   Pozn.: vwce-vs-cspx má vlastní kurátorskou stránku (statická routa má přednost).
   Kolo 3 (18. 10. 2026): srovnávač, ne poradce – „Rozdíly v kostce“ místo „Kdo vyhrává“, titulky bez
   „který koupit“, jedno jméno fondu (ticker z XETRA), kratší mobil. */

export async function generateStaticParams() {
  return POPULAR_PAIRS.map((pair) => ({ pair }));
}

/** "vwce-vs-iwda" → ["VWCE","IWDA"], nebo null pokud slug nemá tvar x-vs-y. */
function parsePair(slug: string): [string, string] | null {
  const parts = slug.toLowerCase().split('-vs-');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  // Tickery jdou do filtru .or() v dotazu na DB → jen písmena a číslice (čárka/tečka by
  // filtr rozšířily). Stejné pravidlo hlídá už middleware, tohle je pojistka.
  if (!parts.every((p) => /^[a-z0-9]{1,12}$/.test(p))) return null;
  return [parts[0].toUpperCase(), parts[1].toUpperCase()];
}

const num = (v: number | null | undefined) => (v == null || Number.isNaN(v) ? null : Number(v));
const jeIsin = (x: string) => /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(x);
/** Ticker, pod kterým fond zobrazit: ten z URL (tak ho člověk hledal), u ISINu primární ticker. */
const zobrazTicker = (urlTok: string, etf: ComparisonETF) =>
  jeIsin(urlTok) ? (etf.primary_ticker && etf.primary_ticker !== '-' ? etf.primary_ticker : urlTok) : urlTok;
/** Burzy fondu z polí exchange_N_* (jen pro odpověď „stejný fond"). */
const burzy = (etf: ComparisonETF) => {
  const r = etf as unknown as Record<string, string | null>;
  return Array.from({ length: 10 }, (_, i) => ({
    burza: r[`exchange_${i + 1}_name`], ticker: r[`exchange_${i + 1}_ticker`], mena: r[`exchange_${i + 1}_currency`],
  })).filter((b) => b.burza && b.ticker && b.ticker !== '-');
};

/**
 * Kanonická adresa dvojice (SEO audit 20. 10. 2026, pravidlo v src/lib/pairs.ts): kurátorská dvojice je kanonická
 * sama (alias → hlavní kurátorská, bez přesměrování); ostatní tvary → kurátorská pro stejné fondy, jinak zobrazované
 * tickery abecedně. `presmerovat` = adresa se liší od kanonické → trvalé přesměrování.
 */
function kanonika(pair: string, etf1: ComparisonETF, etf2: ComparisonETF, t1: string, t2: string) {
  const slug = pair.toLowerCase();
  if (KURATORSKE[slug]) return { kanon: KURATORSKE_ALIASY[slug] ?? slug, kuratorska: true, presmerovat: null as string | null };
  const zt = (e: ComparisonETF) => zobrazovanyTicker(e as unknown as Record<string, unknown>);
  let cil = kanonickaDvojice({ isin: etf1.isin, ticker: zt(etf1) }, { isin: etf2.isin, ticker: zt(etf2) });
  // Tentýž fond pod dvěma tickery mimo kurátorský seznam: tickery z adresy (tak se lidé ptají), jen abecedně.
  if (!cil && etf1.isin === etf2.isin && !jeIsin(t1) && !jeIsin(t2) && t1 !== t2) cil = [t1.toLowerCase(), t2.toLowerCase()].sort().join('-vs-');
  const kanon = cil ?? slug;
  return { kanon, kuratorska: !!KURATORSKE[kanon], presmerovat: kanon !== slug ? kanon : null };
}

export async function generateMetadata(
  { params }: { params: Promise<{ pair: string }> },
): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return { title: 'Srovnání ETF', robots: { index: false, follow: false } };
  const [t1, t2] = parsed;
  const data = await getComparisonETFData(t1, t2);
  if (!data) return { title: `${t1} vs ${t2}`, robots: { index: false, follow: false } };
  const k1 = zobrazTicker(t1, data.etf1), k2 = zobrazTicker(t2, data.etf2);
  const { kanon, kuratorska } = kanonika(pair, data.etf1, data.etf2, t1, t2);
  // Dvojice mimo kurátorský seznam: Google ne (nekonečný prostor kombinací = tenké duplicity), Bing/Seznam ano –
  // stejný princip jako ocas detailů fondů (experiment-index-detaily). Kurátorské dvojice indexují všichni.
  const robots = kuratorska ? undefined : { index: true, follow: true, googleBot: { index: false, follow: true } };
  // Canonical: kurátorský alias → hlavní dvojice. Jiný nekanonický tvar stránka přesměruje (metadata se nepoužijí);
  // když přesměrování neprojde ověřením (ticker vede na jiný fond), zůstane stránka s canonicalem na sebe.
  const alternates = { canonical: `/srovnani/${KURATORSKE[pair.toLowerCase()] ? kanon : pair.toLowerCase()}` };
  if (data.etf1.isin === data.etf2.isin) {
    return {
      title: `${k1} vs ${k2}: je to stejný ETF? Ano – liší se jen burza a měna`,
      alternates,
      ...(robots ? { robots } : {}),
      description: `${k1} a ${k2} jsou tickery téhož fondu ${data.etf1.name} (ISIN ${data.etf1.isin}). Stejný poplatek, složení i výnos – liší se burza a měna obchodování. Přehled všech burz a tickerů.`,
    };
  }
  // „Nižší TER má…“ jen při rozdílu, který je po zaokrouhlení vidět.
  const terRozdil = data.etf1.ter_numeric != null && data.etf2.ter_numeric != null && ter(data.etf1.ter_numeric) !== ter(data.etf2.ter_numeric);
  const cheaper = (num(data.etf1.ter_numeric) ?? 9) <= (num(data.etf2.ter_numeric) ?? 9) ? data.etf1 : data.etf2;
  return {
    title: `${k1} vs ${k2}: srovnání ETF – výnos v Kč, poplatky, riziko`,
    alternates,
    ...(robots ? { robots } : {}),
    description: `Srovnání ${k1} (${data.etf1.isin}) a ${k2} (${data.etf2.isin}) pro české investory: poplatek (TER), výnos přepočtený do korun po letech, riziko a index. ${terRozdil ? `Nižší TER má ${cheaper === data.etf1 ? k1 : k2} (${ter(cheaper.ter_numeric)}).` : `Oba mají TER ${ter(data.etf1.ter_numeric)}.`}`,
  };
}

function Head() {
  return (
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
  );
}

/* Řádek „Rozdíly v kostce“ – fakt z dat (který fond má nižší poplatek…), ne verdikt. */
function FaktRow({ icon: Icon, label, value, detail }: { icon: typeof Coins; label: string; value: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3.5">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 shrink-0"><Icon className="w-4 h-4" /></span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 leading-snug mt-0.5 tabular-nums">{detail}</p>
      </div>
    </div>
  );
}

export default async function PairComparePage(
  { params }: { params: Promise<{ pair: string }> },
) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();
  const [t1, t2] = parsed;
  const data = await getComparisonETFData(t1, t2);
  if (!data) notFound();
  const { etf1, etf2 } = data;
  // Jedna kanonická adresa na dvojici fondů (dřív jen ISIN → ticker; SEO audit 20. 10. 2026: obrácené pořadí a aliasy
  // tickerů byly duplicity s vlastním canonicalem). Cíl mimo kurátorský seznam se před přesměrováním ověří – jeho
  // tickery musí vést na tytéž fondy (ticker bývá u víc fondů), jinak by vznikla smyčka nebo jiné srovnání.
  const { kanon, presmerovat } = kanonika(pair, etf1, etf2, t1, t2);
  if (presmerovat) {
    let platny = !!KURATORSKE[presmerovat];
    if (!platny) {
      const [c1, c2] = presmerovat.toUpperCase().split('-VS-');
      const over = await getComparisonETFData(c1, c2);
      platny = !!over && [over.etf1.isin, over.etf2.isin].sort().join() === [etf1.isin, etf2.isin].sort().join();
    }
    if (platny) permanentRedirect(`/srovnani/${presmerovat}`);
  }
  const vlastni = KURATORSKE[pair.toLowerCase()] ? kanon : pair.toLowerCase(); // kanonická adresa vykreslené stránky
  // Ticker z URL – tak ho člověk hledal („sxr8 vs vuaa"), ne primární ticker fondu.
  const tk1 = zobrazTicker(t1, etf1);
  const tk2 = zobrazTicker(t2, etf2);
  if (etf1.isin === etf2.isin) {
    const dp = (await nactiDoplnkyFondu([etf1.isin]))[etf1.isin];
    const den = dp?.scrapingDate ? datumCen(new Date(dp.scrapingDate)) : await getDataDate(new Date());
    return <StejnyFond etf={etf1} tk1={tk1} tk2={tk2} kanon={vlastni} dateStr={den.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })} />;
  }
  const curated = getPairContent(pair);
  // V nadpisu tickery z URL; dál na stránce JEDNO jméno – ticker z XETRA, pod kterým se fond v Česku kupuje
  // (kolo 3: střídalo se „CSPX (SXR8)“ a „SXR8“). Rozdíl se vysvětlí jednou v úvodu.
  const cz1 = tickerProCesko(etf1) ?? tk1, cz2 = tickerProCesko(etf2) ?? tk2;
  const aliasy = ([[tk1, cz1, etf1], [tk2, cz2, etf2]] as const).filter(([u, c]) => u.toUpperCase() !== c.toUpperCase());
  const doplnky = await nactiDoplnkyFondu([etf1.isin, etf2.isin]);
  const dp1 = doplnky[etf1.isin], dp2 = doplnky[etf2.isin];

  const today = new Date();
  // Datum = den cen staršího ze dvou fondů (datumCen ze scraping_date), ne globální datum (pravidlo č. 1).
  const stazeno = [dp1?.scrapingDate, dp2?.scrapingDate].filter(Boolean).map((d) => new Date(String(d))).sort((a, b) => a.getTime() - b.getTime())[0];
  const dateStr = (stazeno ? datumCen(stazeno) : await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  const zemeDvojice = [dp1?.zeme ?? [], dp2?.zeme ?? []];
  const ODSTINY = ['bg-slate-700', 'bg-slate-500', 'bg-slate-400', 'bg-slate-300', 'bg-slate-200'];

  // Fakta z dat – „nižší/vyšší“ JEN při rozdílu, který je po zaokrouhlení vidět (revize 18. 10. 2026:
  // „vyhrál“ fond při +68,2 % vs +68,2 %); u výnosu za 3 roky až od 1 p. b. – desetina procenta za 3 roky je šum.
  const pickLower = (a: ComparisonETF, b: ComparisonETF, k: 'ter_numeric') => {
    const va = num(a[k]), vb = num(b[k]);
    if (va == null || vb == null || ter(va) === ter(vb)) return null;
    return va < vb ? a : b;
  };
  const pickHigher = (a: ComparisonETF, b: ComparisonETF, k: 'fund_size_numeric' | 'return_3y_czk' | 'total_holdings', prah: number, fmt: (v: number) => string) => {
    const va = num(a[k]), vb = num(b[k]);
    if (va == null || vb == null || fmt(va) === fmt(vb) || Math.abs(va - vb) < prah) return null;
    return va > vb ? a : b;
  };
  const odlehly = !!dp1?.odlehly || !!dp2?.odlehly; // výnos mimo trh → výnosy neporovnávat
  const terW = pickLower(etf1, etf2, 'ter_numeric');
  const sizeW = pickHigher(etf1, etf2, 'fund_size_numeric', 0, (v) => money(v));
  const r3W = odlehly ? null : pickHigher(etf1, etf2, 'return_3y_czk', 1, (v) => pct(v));
  const r3Shoda = !odlehly && !r3W && num(etf1.return_3y_czk) != null && num(etf2.return_3y_czk) != null;
  const terShoda = !terW && num(etf1.ter_numeric) != null && num(etf2.ter_numeric) != null;
  const divW = pickHigher(etf1, etf2, 'total_holdings', 0, (v) => String(v));
  const tkOf = (e: ComparisonETF | null) => (e ? (e === etf1 ? cz1 : cz2) : null);
  const druhy = (e: ComparisonETF) => (e === etf1 ? etf2 : etf1);

  // Index k zobrazení = indexFonduLabel (jako porovnání a detail): index_name bývá prázdný řetězec (SPYI).
  const ix1 = indexFonduLabel(etf1), ix2 = indexFonduLabel(etf2);
  const sameIndex = !!ix1 && ix1 === ix2;
  // Sourozenecké třídy (VWCE vs VWRL, VUAA vs VUSA): stejný index, jiná výplata dividend.
  const d1 = distKind(etf1.distribution_policy), d2 = distKind(etf2.distribution_policy);
  const sourozenci = sameIndex && d1 !== 'unknown' && d2 !== 'unknown' && d1 !== d2;

  // Datové FAQ – z reálných hodnot obou fondů.
  const faqs: { q: string; a: string }[] = [];
  for (const [u, c, e] of aliasy) faqs.push({
    q: `Je ${u} totéž co ${c}?`,
    a: `Ano. ${u} a ${c} jsou tickery téhož fondu ${e.name} (ISIN ${e.isin}) na různých burzách – poplatek, složení i výnos jsou stejné. Na XETRA, kde nakupuje většina českých brokerů, má ticker ${c}.`,
  });
  if (terW) faqs.push({
    q: `Který má nižší poplatek, ${cz1}, nebo ${cz2}?`,
    a: `Nižší roční poplatek (TER) má ${tkOf(terW)} – ${ter(terW.ter_numeric)}. Druhý fond má ${ter(druhy(terW).ter_numeric)}. U dlouhodobého držení se rozdíl v TER promítá do výnosu, ale bývá menší než rozdíl daný odlišnou skladbou fondů.`,
  });
  faqs.push({
    q: sameIndex ? `Sledují ${cz1} a ${cz2} stejný index?` : `Jaký je hlavní rozdíl mezi ${cz1} a ${cz2}?`,
    a: sameIndex
      ? `Ano, oba sledují ${ix1}. Liší se pak poplatkem, velikostí fondu, typem výplaty (akumulační vs distribuční) a domicilem.`
      : `${cz1} sleduje ${ix1 ? `index ${ix1}` : 'jiný index'}, zatímco ${cz2} ${ix2 ? `index ${ix2}` : 'jiný index'}. To je hlavní zdroj rozdílu ve výnosu i riziku – jiná expozice na regiony a firmy.`,
  });
  if (sizeW) faqs.push({
    q: `Který fond je větší?`,
    a: `Větší je ${tkOf(sizeW)} se spravovaným majetkem ${money(sizeW.fund_size_numeric, sizeW.fund_currency)} (druhý ${money(druhy(sizeW).fund_size_numeric, druhy(sizeW).fund_currency)}). Větší fond obvykle znamená lepší likviditu a nižší riziko zrušení.`,
  });
  faqs.push({
    q: `Jak se zdaní zisk z ${cz1} nebo ${cz2} v Česku?`,
    a: `Pro oba platí stejná pravidla: zisk z prodeje je osvobozen, pokud fond držíte déle než 3 roky (časový test, od roku 2026 bez horního limitu), nebo když úhrn vašich prodejů za rok nepřekročí 100 000 Kč. Jinak se zisk daní 15 % (u vysokých příjmů 23 %).`,
  });
  // Kurátorské texty píšou tickery z URL (IWDA, CSPX) – na stránce držíme jedno jméno (XETRA), proto je přejmenujeme.
  const jednoJmeno = (t: string) => aliasy.reduce((acc, [u, c]) => acc.replace(new RegExp(`\\b${u}\\b`, 'g'), c), t);
  const pick1 = curated?.pick1 ? jednoJmeno(curated.pick1) : undefined;
  const pick2 = curated?.pick2 ? jednoJmeno(curated.pick2) : undefined;
  const vsechnyFaq = [...faqs, ...(curated?.faqs ?? []).map((f) => ({ q: jednoJmeno(f.q), a: jednoJmeno(f.a) }))];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: vsechnyFaq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Srovnávač ETF', item: 'https://etfpruvodce.cz/srovnani' },
      { '@type': 'ListItem', position: 3, name: `${tk1} vs ${tk2}`, item: `https://etfpruvodce.cz/srovnani/${vlastni}` },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Head />

      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-16">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link><span>/</span>
          <Link href="/srovnani" className="hover:text-slate-700">Srovnávač</Link><span>/</span>
          <span className="text-slate-700">{tk1} vs {tk2}</span>
        </nav>

        {/* ÚVOD – kompaktní; karty obou fondů vedle sebe i na mobilu, první čísla nad zlomem */}
        <section data-sekce="hero" className="pb-8">
          <div className="rounded-2xl bg-slate-900 text-white p-4 md:px-8 md:py-7">
            <h1 className="text-xl md:text-3xl font-bold tracking-tight leading-tight">{tk1} vs {tk2}: srovnání v korunách</h1>
            <p className="mt-1.5 text-sm text-slate-300 leading-snug">
              Poplatky, výnos přepočtený do korun a riziko obou fondů vedle sebe. <span className="text-slate-400">Data k {dateStr}.</span>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 md:gap-4">
              <SrovnaniSoubojKarta etf={etf1} ticker={cz1} podtitul={ix1 ?? etf1.name} barva={barvaFondu(0)} odlehly={!!dp1?.odlehly} />
              <SrovnaniSoubojKarta etf={etf2} ticker={cz2} podtitul={ix2 ?? etf2.name} barva={barvaFondu(1)} odlehly={!!dp2?.odlehly} />
            </div>
            {aliasy.map(([u, c, e]) => (
              <p key={u} className="mt-3 flex items-start gap-1.5 text-xs text-slate-400 leading-relaxed">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{u} je tentýž fond jako <strong className="text-slate-200">{c}</strong> – pod tímto tickerem ho na XETRA nabízí většina českých brokerů, proto dál píšeme {c}.</span>
              </p>
            ))}
          </div>
        </section>

        {/* VÝNOS PO LETECH – skutečné výnosy obou fondů (ne index) */}
        {dp1 && dp2 && (
          <section data-sekce="graf" className="pb-10">
            <h2 className="mb-3 text-xl md:text-2xl font-bold tracking-tight text-slate-900">Výnos po jednotlivých letech</h2>
            <SrovnaniRocniVynosy fondy={[{ label: cz1, roky: dp1.roky }, { label: cz2, roky: dp2.roky }]} />
          </section>
        )}

        {/* ROZDÍLY V KOSTCE (+ pro koho který u kurátorských dvojic) – fakta, ne verdikt */}
        <section data-sekce="verdikt" className="pb-10">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Rozdíly v kostce</h2>
          {sourozenci ? (
            <p className="mt-1 max-w-3xl text-sm text-slate-600 leading-relaxed">
              Stejný index, liší se výplatou dividend: {cz1} je {d1 === 'acc' ? 'akumulační' : 'distribuční'}, {cz2} {d2 === 'acc' ? 'akumulační' : 'distribuční'}. Před daní vydělávají prakticky stejně; rozdíl je v tom, jestli dividendy chodí na účet (a v Česku je daníte), nebo se reinvestují.{' '}
              <Link href="/akumulacni-vs-distribucni-etf" className="font-medium text-teal-700 underline underline-offset-2">Akumulační, nebo distribuční?</Link>
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">{sameIndex ? `Oba sledují ${ix1} – liší se hlavně poplatkem a velikostí.` : 'Každý fond sleduje jiný index – to je hlavní zdroj rozdílu ve výnosu i riziku.'}</p>
          )}
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {terW && <FaktRow icon={Coins} label="Poplatek (TER)" value={`Nižší má ${tkOf(terW)}`} detail={`${ter(terW.ter_numeric)} vs ${ter(druhy(terW).ter_numeric)} ročně`} />}
            {terShoda && <FaktRow icon={Equal} label="Poplatek (TER)" value="Stejný" detail={`oba ${ter(etf1.ter_numeric)} ročně`} />}
            {r3W && <FaktRow icon={LineChart} label="Výnos 3 roky v Kč" value={`Vyšší měl ${tkOf(r3W)}`} detail={`${pct(r3W.return_3y_czk)} vs ${pct(druhy(r3W).return_3y_czk)}`} />}
            {r3Shoda && <FaktRow icon={Equal} label="Výnos 3 roky v Kč" value="Prakticky stejný" detail={`${pct(etf1.return_3y_czk)} · ${pct(etf2.return_3y_czk)} (rozdíl pod 1 p. b.)`} />}
            {sizeW && <FaktRow icon={Landmark} label="Velikost fondu" value={`Větší je ${tkOf(sizeW)}`} detail={`${money(sizeW.fund_size_numeric, sizeW.fund_currency)} vs ${money(druhy(sizeW).fund_size_numeric, druhy(sizeW).fund_currency)}`} />}
            {divW && <FaktRow icon={Layers} label="Počet firem" value={`Víc drží ${tkOf(divW)}`} detail={`${divW.total_holdings?.toLocaleString('cs-CZ')} vs ${druhy(divW).total_holdings?.toLocaleString('cs-CZ') ?? '—'}`} />}
          </div>
          {(pick1 || pick2) && (
            <div className="mt-4">
              <h3 className="mb-2 text-base font-semibold text-slate-900">Pro koho který</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {([[cz1, pick1, 0], [cz2, pick2, 1]] as const).map(([t, text, i]) => text && (
                  <div key={t} className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-900"><span className="h-2.5 w-2.5 rounded-full" style={{ background: barvaFondu(i) }} aria-hidden="true" />{t}</p>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {curated?.intro && curated.intro.length > 0 && (
            <details className="group mt-3 rounded-xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Proč se {cz1} a {cz2} často porovnávají
                <ChevronDown className="w-4 h-4 shrink-0 text-slate-400 group-open:rotate-180 transition-transform" aria-hidden="true" />
              </summary>
              <div className="space-y-2 px-4 pb-4 text-sm text-slate-600 leading-relaxed max-w-3xl">
                {curated.intro.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </details>
          )}
        </section>

        {/* DO ČEHO FONDY INVESTUJÍ – země z dat */}
        {(zemeDvojice[0].length > 0 || zemeDvojice[1].length > 0) && !sameIndex && (
          <section data-sekce="slozeni" className="pb-10">
            <h2 className="mb-4 text-xl md:text-2xl font-bold tracking-tight text-slate-900">Do čeho fondy investují</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {([[cz1, etf1, zemeDvojice[0], 0], [cz2, etf2, zemeDvojice[1], 1]] as const).map(([tk, e, zeme, i]) => (
                <div key={tk} className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900"><span className="h-2.5 w-2.5 rounded-full" style={{ background: barvaFondu(i) }} aria-hidden="true" /> {tk}</span>
                    {e.total_holdings != null && <span className="text-sm text-slate-500"><strong className="text-xl font-bold text-slate-900 tabular-nums">{e.total_holdings.toLocaleString('cs-CZ')}</strong> pozic</span>}
                  </div>
                  {zeme.length > 0 ? (
                    <>
                      <div className="mt-3 flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={zeme.map((z) => `${ceskaZeme(z.nazev)} ${procenta(z.vaha, 1, false)}`).join(', ')}>
                        {zeme.map((z, j) => <span key={z.nazev} className={ODSTINY[j]} style={{ width: `${z.vaha}%` }} />)}
                      </div>
                      <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
                        {zeme.map((z, j) => (
                          <li key={z.nazev} className="inline-flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${ODSTINY[j]}`} /> {ceskaZeme(z.nazev)} <span className="tabular-nums text-slate-500">{procenta(z.vaha, 1, false)}</span></li>
                        ))}
                      </ul>
                    </>
                  ) : <p className="mt-3 text-sm text-slate-400">Rozložení podle zemí nemáme.</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VŠECHNY PARAMETRY */}
        <section data-sekce="parametry" className="pb-10">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Všechny parametry</h2>
          <p className="mt-1 mb-4 text-sm text-slate-500">Zelená = nižší poplatek, vyšší výnos nebo menší kolísání v řádku. Výnosy v měně zvolené u grafu.</p>
          <ParametryDvojice etf1={etf1} etf2={etf2} ticker1={cz1} ticker2={cz2} />
          {/* Podrobné porovnání se STEJNÝM pořadím fondů → stejné barvy (barvaFondu podle pozice; revize kola 4). */}
          <Link href={`/srovnani/porovnani?isins=${etf1.isin},${etf2.isin}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
            Podrobné porovnání – sektory, největší pozice, riziko <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-2 text-xs text-slate-400">Daně: u obou fondů platí stejná česká pravidla (osvobození po 3 letech držení nebo do 100 000 Kč prodejů za rok). Výnosy v Kč už obsahují pohyb kurzu koruny.</p>
        </section>

        {/* FAQ */}
        <section data-sekce="faq" className="pb-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight text-slate-900"><HelpCircle className="w-5 h-5 text-teal-700" /> Časté dotazy</h2>
          <FaqSeznam items={vsechnyFaq} />
        </section>

        <DalsiSrovnani aktualni={vlastni} />

        {/* PROLINKOVÁNÍ */}
        <section className="pb-4">
          <div className="flex flex-wrap gap-2.5">
            <Link href={`/etf/${etf1.isin}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"><Wallet className="w-4 h-4" /> Detail {cz1}</Link>
            <Link href={`/etf/${etf2.isin}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"><Wallet className="w-4 h-4" /> Detail {cz2}</Link>
            <Link href="/kde-koupit" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">Kde koupit <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"><ArrowLeft className="w-4 h-4" /> Zpět do srovnávače</Link>
          </div>
          <p className="mt-4 flex items-start gap-1.5 text-xs text-slate-400 leading-relaxed">
            <Database className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
            <span>Data fondů: justETF · kurzy ČNB · data k {dateStr}. <Link href="/metodika" className="underline underline-offset-2 hover:text-slate-600">Metodika</Link></span>
          </p>
          <InvestmentDisclaimer variant="inline" className="mt-2 !text-slate-400" />
        </section>
      </main>
    </div>
  );
}

/* „CSPX vs SXR8" – dva tickery TÉHOŽ fondu. Častý dotaz (našeptávač 17. 10. 2026: „iwda swda eunl",
   „cspx nebo sxr8", „vuaa vs vuag"); dřív stránka vracela 404. SEO audit 20. 10. 2026: stránka měla 215–236 slov,
   bez data a drobečků → doplněno datum dat, BreadcrumbList, jasná věta o stejném ISINu, odkazy a další srovnání.
   Canonical zůstává na sobě (jiný záměr hledání než detail fondu: „je X totéž co Y?“); alias iwda-vs-swda → iwda-vs-eunl. */
function StejnyFond({ etf, tk1, tk2, kanon, dateStr }: { etf: ComparisonETF; tk1: string; tk2: string; kanon: string; dateStr: string }) {
  const seznam = burzy(etf);
  const meny = Array.from(new Set(seznam.map((b) => b.mena).filter(Boolean))) as string[];
  const faqs = [
    { q: `Je ${tk1} a ${tk2} stejný ETF?`, a: `Ano. ${tk1} a ${tk2} jsou tickery téhož fondu ${etf.name} (ISIN ${etf.isin}). Fond má jeden poplatek (TER ${ter(etf.ter_numeric)}), jedno složení a jeden výnos. Liší se jen burza, na které se obchoduje, a měna obchodování.` },
    { q: `Podle čeho poznám, že jde o stejný fond?`, a: `Podle ISINu – mezinárodního identifikátoru fondu. Ticker se liší podle burzy (jedna burza = jeden ticker), ISIN je pro fond jen jeden. ${tk1} i ${tk2} mají ISIN ${etf.isin}.` },
    { q: `Který ticker koupit – ${tk1}, nebo ${tk2}?`, a: `Ten, který váš broker nabízí na burze s nejnižšími poplatky a v měně, kterou chcete platit. Měna obchodování (EUR, USD, GBP…) nemění měnové riziko fondu – to určuje, do čeho fond investuje – ale ovlivní poplatek za směnu korun u brokera. Na větších burzách bývá i užší rozpětí mezi nákupní a prodejní cenou.` },
  ];
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Srovnávač ETF', item: 'https://etfpruvodce.cz/srovnani' },
      { '@type': 'ListItem', position: 3, name: `${tk1} vs ${tk2}`, item: `https://etfpruvodce.cz/srovnani/${kanon}` },
    ],
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Head />
      <main id="obsah" data-stejny-fond className="max-w-3xl mx-auto px-4 pb-24">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link><span>/</span>
          <Link href="/srovnani" className="hover:text-slate-700">Srovnávač</Link><span>/</span>
          <span className="text-slate-700">{tk1} vs {tk2}</span>
        </nav>
        <section className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">{tk1} vs {tk2}: je to stejný ETF?</h1>
          <p className="mt-3 text-slate-200 leading-relaxed">
            <strong className="text-white">Ano.</strong> {tk1} a {tk2} jsou dva tickery <strong className="text-white">téhož fondu</strong> {etf.name}.
            Poplatek, složení i výnos jsou stejné – liší se jen burza a měna, ve které se obchoduje.
          </p>
          <p className="mt-2 text-xs text-slate-400 font-mono">ISIN {etf.isin} · TER {ter(etf.ter_numeric)} · {money(etf.fund_size_numeric, etf.fund_currency)}</p>
          <p className="mt-1 text-xs text-slate-400">Data k {dateStr}.</p>
        </section>

        <section className="pt-8">
          <h2 className="text-xl font-bold tracking-tight">Jde o tentýž fond (stejný ISIN)</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            Jde o tentýž fond (stejný ISIN {etf.isin}), liší se jen burza a měna obchodování. Fond je jeden – jeden
            správce, jeden majetek a jeden poplatek (TER {ter(etf.ter_numeric)}). Každá burza, na které je fond kotovaný,
            mu ale přidělí vlastní zkratku (ticker){meny.length > 1 ? <>, a podle burzy se obchoduje v různých měnách ({meny.join(', ')})</> : null}.
            Proto {tk1} a {tk2} mají stejné složení i stejný výnos ve stejné měně – rozdíl může být jen v ceně obchodu
            u konkrétního brokera.
          </p>
          <p className="mt-3 text-slate-700 leading-relaxed">
            Výnos fondu přepočtený do korun, poplatky, složení a riziko najdete na{' '}
            <Link href={`/etf/${etf.isin}`} className="font-medium text-teal-700 underline underline-offset-2">detailu fondu</Link>.
            U kterých brokerů se fond dá koupit a kolik stojí nákup, ukazuje{' '}
            <Link href="/kde-koupit" className="font-medium text-teal-700 underline underline-offset-2">přehled Kde koupit ETF</Link>.
          </p>
        </section>

        {seznam.length > 0 && (
          <section className="pt-8">
            <h2 className="text-xl font-bold tracking-tight">Kde se fond obchoduje</h2>
            <p className="mt-1 text-sm text-slate-500">Stejný fond na různých burzách – vyberte tu, kterou nabízí váš broker.</p>
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="px-4 py-2.5">Ticker</th><th className="px-4 py-2.5">Burza</th><th className="px-4 py-2.5">Měna</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {seznam.map((b, i) => {
                    const hledany = [tk1, tk2].includes(String(b.ticker).toUpperCase());
                    return (
                      <tr key={i} className={hledany ? 'bg-teal-50/60' : ''}>
                        <td className="px-4 py-2.5 font-semibold tabular-nums">{b.ticker}</td>
                        <td className="px-4 py-2.5 text-slate-700">{b.burza}</td>
                        <td className="px-4 py-2.5 text-slate-700">{b.mena ?? '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="pt-8 space-y-2">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight"><HelpCircle className="w-5 h-5 text-teal-700" /> Časté dotazy</h2>
          {faqs.map((f, i) => (
            <details key={i} className="group rounded-lg border border-slate-200 bg-white p-4" open={i === 0}>
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-slate-900 list-none">
                {f.q}<ChevronDown className="w-4 h-4 shrink-0 text-slate-400 group-open:rotate-180 transition-transform" aria-hidden="true" />
              </summary>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </section>

        <section className="pt-8 flex flex-wrap gap-3">
          <Link href={`/etf/${etf.isin}`} className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800"><Wallet className="w-4 h-4" /> Detail fondu s výnosem v Kč</Link>
          <Link href="/kde-koupit" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">Kde fond koupit</Link>
        </section>

        <div className="pt-10"><DalsiSrovnani aktualni={kanon} /></div>
        <p className="flex items-start gap-1.5 text-xs text-slate-400 leading-relaxed">
          <Database className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
          <span>Data fondu: justETF · data k {dateStr}. <Link href="/metodika" className="underline underline-offset-2 hover:text-slate-600">Metodika</Link></span>
        </p>
      </main>
    </div>
  );
}
