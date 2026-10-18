import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { TrendingUp, ArrowRight, ArrowLeft, Scale, Trophy, Coins, Layers, Landmark, ShieldCheck, Info, Wallet, HelpCircle } from 'lucide-react';
import { getComparisonETFData, type ComparisonETF , getDataDate } from '@/lib/etf-data';
import { SrovnaniSoubojKarta } from '@/components/design-preview/SrovnaniCompareUI';
import SrovnaniParams from '@/components/design-preview/SrovnaniParams';
import { getPairContent } from '@/components/design-preview/pairContent';
import { ter, money, pct } from '@/components/design-preview/CategoryUI';
import { POPULAR_PAIRS } from '@/lib/pairs';
import { distKind } from '@/utils/distribution';
import { platnyTicker } from '@/lib/ticker';

export const revalidate = 86400;
export const dynamicParams = true;

/* Nejžádanější dvojice se předgenerují staticky; zbytek on-demand (seznam v src/lib/pairs.ts).
   Pozn.: vwce-vs-cspx má vlastní kurátorskou stránku (statická routa má přednost). */

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
  if (data.etf1.isin === data.etf2.isin) {
    return {
      title: `${k1} vs ${k2}: je to stejný ETF? Ano – liší se jen burza a měna`,
      alternates: { canonical: `/srovnani/${pair.toLowerCase()}` },
      description: `${k1} a ${k2} jsou tickery téhož fondu ${data.etf1.name} (ISIN ${data.etf1.isin}). Stejný poplatek, složení i výnos – liší se burza a měna obchodování. Přehled všech burz a tickerů.`,
    };
  }
  const cheaper = (num(data.etf1.ter_numeric) ?? 9) <= (num(data.etf2.ter_numeric) ?? 9) ? data.etf1 : data.etf2;
  return {
    title: `${k1} vs ${k2}: srovnání ETF, výnos v Kč a který koupit`,
    alternates: { canonical: `/srovnani/${pair.toLowerCase()}` },
    description: `Detailní souboj ${k1} (${data.etf1.isin}) vs ${k2} (${data.etf2.isin}) pro české investory: poplatek (TER), výnos přepočtený do korun, riziko, index a jasný verdikt. Nižší TER má ${cheaper === data.etf1 ? k1 : k2} (${ter(cheaper.ter_numeric)}).`,
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

/* Řádek „kdo vyhrává" v datovém verdiktu. */
function WinRow({ icon: Icon, label, winner, detail }: { icon: typeof Coins; label: string; winner: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Icon className="w-4 h-4" /></span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{winner}</p>
        <p className="text-xs text-slate-500 leading-snug mt-0.5">{detail}</p>
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
  // Adresa s ISINy → trvale na tickerovou (jedna kanonická stránka na dvojici).
  if (jeIsin(t1) || jeIsin(t2)) {
    const a = zobrazTicker(t1, etf1), b = zobrazTicker(t2, etf2);
    if (!jeIsin(a) && !jeIsin(b)) permanentRedirect(`/srovnani/${a.toLowerCase()}-vs-${b.toLowerCase()}`);
  }
  // Ticker z URL – tak ho člověk hledal („sxr8 vs vuaa"), ne primární ticker fondu.
  const tk1 = zobrazTicker(t1, etf1);
  const tk2 = zobrazTicker(t2, etf2);
  if (etf1.isin === etf2.isin) return <StejnyFond etf={etf1} tk1={tk1} tk2={tk2} />;
  const curated = getPairContent(pair);

  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  // Datový verdikt – kdo vyhrává v čem (jen když jsou data a liší se).
  const pickLower = (a: ComparisonETF, b: ComparisonETF, k: 'ter_numeric') => {
    const va = num(a[k]), vb = num(b[k]);
    if (va == null || vb == null || va === vb) return null;
    return va < vb ? a : b;
  };
  const pickHigher = (a: ComparisonETF, b: ComparisonETF, k: 'fund_size_numeric' | 'return_1y_czk' | 'return_3y_czk' | 'total_holdings') => {
    const va = num(a[k]), vb = num(b[k]);
    if (va == null || vb == null || va === vb) return null;
    return va > vb ? a : b;
  };
  const terW = pickLower(etf1, etf2, 'ter_numeric');
  const sizeW = pickHigher(etf1, etf2, 'fund_size_numeric');
  const r3W = pickHigher(etf1, etf2, 'return_3y_czk');
  const divW = pickHigher(etf1, etf2, 'total_holdings');
  const tkOf = (e: ComparisonETF | null) => (e ? (platnyTicker(e.primary_ticker) ?? '—') : null);

  const sameIndex = !!etf1.index_name && etf1.index_name === etf2.index_name;
  // Sourozenecké třídy (VWCE vs VWRL, VUAA vs VUSA): stejný index, jiná výplata dividend.
  const d1 = distKind(etf1.distribution_policy), d2 = distKind(etf2.distribution_policy);
  const sourozenci = sameIndex && d1 !== 'unknown' && d2 !== 'unknown' && d1 !== d2;

  // Datové FAQ – z reálných hodnot obou fondů.
  const faqs: { q: string; a: string }[] = [];
  if (terW) faqs.push({
    q: `Který má nižší poplatek, ${tk1}, nebo ${tk2}?`,
    a: `Nižší roční poplatek (TER) má ${tkOf(terW)} se sazbou ${ter(terW.ter_numeric)}. Druhý fond má ${ter((terW === etf1 ? etf2 : etf1).ter_numeric)}. U dlouhodobého držení se rozdíl v TER promítá do výnosu, ale bývá menší než rozdíl daný odlišnou skladbou fondů.`,
  });
  faqs.push({
    q: sameIndex ? `Sledují ${tk1} a ${tk2} stejný index?` : `Jaký je hlavní rozdíl mezi ${tk1} a ${tk2}?`,
    a: sameIndex
      ? `Ano, oba sledují ${etf1.index_name}. Rozhoduje pak spíš poplatek, velikost fondu, typ výplaty (akumulační vs distribuční) a domicil.`
      : `${tk1} sleduje index ${etf1.index_name ?? '—'}, zatímco ${tk2} sleduje ${etf2.index_name ?? '—'}. To je hlavní zdroj rozdílu ve výnosu i riziku – jiná expozice na regiony a firmy.`,
  });
  if (sizeW) faqs.push({
    q: `Který fond je větší a likvidnější?`,
    a: `Větší je ${tkOf(sizeW)} se spravovaným majetkem ${money(sizeW.fund_size_numeric, sizeW.fund_currency)} (druhý ${money((sizeW === etf1 ? etf2 : etf1).fund_size_numeric, (sizeW === etf1 ? etf2 : etf1).fund_currency)}). Větší fond obvykle znamená lepší likviditu a nižší riziko zrušení.`,
  });
  faqs.push({
    q: `Jak se zdaní zisk z ${tk1} nebo ${tk2} v Česku?`,
    a: `Pro oba platí stejná pravidla: zisk z prodeje je osvobozen, pokud fond držíte déle než 3 roky (časový test, od roku 2026 bez horního limitu), nebo když úhrn vašich prodejů za rok nepřekročí 100 000 Kč. Jinak se zisk daní 15 % (u vysokých příjmů 23 %).`,
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Srovnávač ETF', item: 'https://etfpruvodce.cz/srovnani' },
      { '@type': 'ListItem', position: 3, name: `${tk1} vs ${tk2}` },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Head />

      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-24">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link><span>/</span>
          <Link href="/srovnani" className="hover:text-slate-700">Srovnávač</Link><span>/</span>
          <span className="text-slate-700">{tk1} vs {tk2}</span>
        </nav>

        {/* HERO */}
        <section className="pb-6">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">{tk1} vs {tk2}: který ETF koupit?</h1>
            <p className="mt-2 max-w-2xl text-slate-300 text-sm md:text-base leading-relaxed">
              Porovnání dvou fondů vedle sebe očima českého investora – poplatky, výnos <strong className="text-white">přepočtený do korun</strong>, riziko a jasný verdikt.
            </p>
            <p className="mt-2 text-xs text-slate-400 font-mono">ISIN {tk1}: {etf1.isin} · ISIN {tk2}: {etf2.isin}</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <SrovnaniSoubojKarta etf={etf1} podtitul={etf1.index_name ?? 'Fond 1'} accent="teal" />
              <SrovnaniSoubojKarta etf={etf2} podtitul={etf2.index_name ?? 'Fond 2'} accent="sky" />
            </div>
          </div>
        </section>

        {sourozenci && (
          <section className="pb-6">
            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-5 max-w-3xl text-sm md:text-[15px] text-slate-700 leading-relaxed">
              <p><strong>Stejný index, liší se výplatou dividend.</strong> {tk1} je {d1 === 'acc' ? 'akumulační' : 'distribuční'} a {tk2} {d2 === 'acc' ? 'akumulační' : 'distribuční'} třída fondu na index {etf1.index_name}. Před daní vydělávají prakticky stejně; rozdíl je v tom, jestli dividendy dostáváte na účet (a v Česku je daníte), nebo se automaticky reinvestují.{' '}
                <Link href="/akumulacni-vs-distribucni-etf" className="font-medium text-teal-700 underline underline-offset-2">Akumulační, nebo distribuční?</Link></p>
            </div>
          </section>
        )}

        {/* Kurátorský úvod (jen top dvojice) */}
        {curated?.intro && curated.intro.length > 0 && (
          <section className="pb-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 text-sm md:text-[15px] text-slate-700 leading-relaxed max-w-3xl">
              {curated.intro.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>
        )}

        {/* DATOVÝ VERDIKT */}
        <section className="pb-8">
          <div className="mb-4"><h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Kdo vyhrává v čem</h2>
            <p className="mt-1 text-sm text-slate-500">Z reálných dat obou fondů. „Lepší" závisí na tom, co hledáte.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {terW && <WinRow icon={Coins} label="Nižší poplatek (TER)" winner={tkOf(terW)!} detail={`${ter(terW.ter_numeric)} vs ${ter((terW === etf1 ? etf2 : etf1).ter_numeric)}`} />}
            {sizeW && <WinRow icon={Landmark} label="Větší fond (likvidita)" winner={tkOf(sizeW)!} detail={`${money(sizeW.fund_size_numeric, sizeW.fund_currency)} spravovaného majetku`} />}
            {r3W && <WinRow icon={Trophy} label="Vyšší výnos 3 roky (Kč)" winner={tkOf(r3W)!} detail={`${pct(r3W.return_3y_czk)} v korunách za 3 roky`} />}
            {divW && <WinRow icon={Layers} label="Širší diverzifikace" winner={tkOf(divW)!} detail={`drží ${divW.total_holdings?.toLocaleString('cs-CZ')} firem`} />}
          </div>
          {curated && (curated.pick1 || curated.pick2) && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {curated.pick1 && <div className="rounded-lg border border-teal-200 bg-teal-50/60 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-teal-700 mb-1">Zvolte {tk1}, když…</p><p className="text-sm text-slate-700 leading-relaxed">{curated.pick1}</p></div>}
              {curated.pick2 && <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Zvolte {tk2}, když…</p><p className="text-sm text-slate-700 leading-relaxed">{curated.pick2}</p></div>}
            </div>
          )}
        </section>

        {/* TABULKA PARAMETRŮ (s přepínačem měny) */}
        <section className="pb-10">
          <div className="mb-4"><h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Srovnání parametrů</h2>
            <p className="mt-1 text-sm text-slate-500">Klíčové hodnoty vedle sebe. Zelené pole = výhodnější v daném řádku.</p></div>
          <SrovnaniParams etf1={etf1} etf2={etf2} ticker1={tk1} ticker2={tk2} />
        </section>

        {/* ČESKÉ DANĚ */}
        <section className="pb-10">
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><ShieldCheck className="w-5 h-5 text-teal-700" /> Daně a měna pro českého investora</h2>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed max-w-3xl">
              U obou fondů platí stejná česká pravidla: zisk z prodeje je osvobozen po <strong>3 letech držení</strong> (časový test, od 2026 bez limitu) nebo když úhrn prodejů za rok nepřekročí <strong>100 000 Kč</strong>. Oba fondy kotují v cizí měně, takže jako český investor nesete <strong>měnové riziko vůči koruně</strong> – proto výnosy uvádíme přepočtené do Kč.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-10">
          <div className="mb-4"><h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight text-slate-900"><HelpCircle className="w-5 h-5 text-teal-700" /> Časté dotazy</h2></div>
          <div className="space-y-2 max-w-3xl">
            {[...(curated?.faqs ?? []), ...faqs].map((f, i) => (
              <details key={i} className="group rounded-lg border border-slate-200 bg-white p-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-slate-900 list-none">
                  {f.q}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* PROLINKOVÁNÍ */}
        <section className="pb-4">
          <div className="flex flex-wrap gap-3">
            <Link href={`/etf/${etf1.isin}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"><Wallet className="w-4 h-4" /> Detail {tk1}</Link>
            <Link href={`/etf/${etf2.isin}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"><Wallet className="w-4 h-4" /> Detail {tk2}</Link>
            <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"><ArrowLeft className="w-4 h-4" /> Zpět do srovnávače</Link>
          </div>
          <p className="mt-4 text-xs text-slate-400 flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Minulé výnosy nezaručují budoucí vývoj. Datum aktualizace: {dateStr}. „Vítěz" řádku je orientační, ne investiční doporučení.</p>
        </section>
      </main>
    </div>
  );
}

/* „CSPX vs SXR8" – dva tickery TÉHOŽ fondu. Častý dotaz (našeptávač 17. 10. 2026: „iwda swda eunl",
   „cspx nebo sxr8", „vuaa vs vuag"); dřív stránka vracela 404. */
function StejnyFond({ etf, tk1, tk2 }: { etf: ComparisonETF; tk1: string; tk2: string }) {
  const seznam = burzy(etf);
  const faqs = [
    { q: `Je ${tk1} a ${tk2} stejný ETF?`, a: `Ano. ${tk1} a ${tk2} jsou tickery téhož fondu ${etf.name} (ISIN ${etf.isin}). Fond má jeden poplatek (TER ${ter(etf.ter_numeric)}), jedno složení a jeden výnos. Liší se jen burza, na které se obchoduje, a měna obchodování.` },
    { q: `Který ticker koupit – ${tk1}, nebo ${tk2}?`, a: `Ten, který váš broker nabízí na burze s nejnižšími poplatky a v měně, kterou chcete platit. Měna obchodování (EUR, USD, GBP…) nemění měnové riziko fondu – to určuje, do čeho fond investuje – ale ovlivní poplatek za směnu korun u brokera. Na větších burzách bývá i užší rozpětí mezi nákupní a prodejní cenou.` },
  ];
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Head />
      <main id="obsah" className="max-w-3xl mx-auto px-4 pb-24">
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
                {f.q}<ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </section>

        <section className="pt-8 flex flex-wrap gap-3">
          <Link href={`/etf/${etf.isin}`} className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800"><Wallet className="w-4 h-4" /> Detail fondu s výnosem v Kč</Link>
          <Link href="/kde-koupit" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">Kde fond koupit</Link>
        </section>
      </main>
    </div>
  );
}
