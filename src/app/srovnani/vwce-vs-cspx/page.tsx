import { Metadata } from 'next';
import { indexFonduLabel } from '@/utils/indexNormalization';
import Link from 'next/link';
import DalsiSrovnani from '@/components/design-preview/DalsiSrovnani';
import { autorSchema, vydavatelSchema, dataClanku, datumUpravy } from '@/lib/redakce';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { getComparisonETFData, type ComparisonETF, getDataDate } from '@/lib/etf-data';
import { TrendingUp, ArrowRight, Database, Globe2, Landmark, Info } from 'lucide-react';
import { terFmt, procenta, velikostFondu } from '@/lib/formatyCisel';

// Jednotné formáty (kolo 5): „0,07 %“, „−15,9 %“, „139,4 mld. €“ – src/lib/formatyCisel.ts.
const ter = (v: number | null) => terFmt(v);
const pct = (v: number | null) => procenta(v);
const money = (v: number | null, _cur?: string | null) => velikostFondu(v);
import InfoTip from '@/components/design-preview/InfoTip';
import { SrovnaniSoubojKarta } from '@/components/design-preview/SrovnaniCompareUI';
import ParametryDvojice from '../[pair]/ParametryDvojice';
import { nactiDoplnkyFondu, tickerProCesko } from '@/lib/srovnaniRocni';
import SrovnaniRocniVynosy from '@/components/design-preview/SrovnaniRocniVynosy';
import { ceskaZeme } from '@/lib/preklady';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import { barvaFondu } from '@/lib/barvyFondu';
import { datumCen } from '@/lib/datumCen';
import { FaqSeznam } from '@/components/design-preview/brokerUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

export const revalidate = 86400;

/* Kurátorská dvojice VWCE vs CSPX (URL tak, jak ji lidé hledají). Kolo 3 (18. 10. 2026): srovnávač, ne
   poradce – „Rozdíly v kostce“ a „Pro koho který“ místo verdiktu; Verdikt + Shrnutí + Kdy zvolit který
   sloučené do jednoho bloku; CSPX jednou vysvětlen jako SXR8 (XETRA) a dál jen SXR8; mobil z 10 177 px
   výrazně kratší (sbalené parametry daní a měny, žádný 4krokový návod). */
const TICKER1 = 'VWCE';
const TICKER2 = 'CSPX';
const CANONICAL = 'https://etfpruvodce.cz/srovnani/vwce-vs-cspx';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getComparisonETFData(TICKER1, TICKER2);
  const popis = data
    ? `VWCE (TER ${ter(data.etf1.ter_numeric)}, ${data.etf1.total_holdings?.toLocaleString('cs-CZ') ?? 'tisíce'} firem celého světa) vs CSPX/SXR8 (TER ${ter(data.etf2.ter_numeric)}, ${data.etf2.total_holdings?.toLocaleString('cs-CZ') ?? '500'} firem USA). Výnos v Kč po letech, poplatky, složení, daně a měnové riziko vedle sebe.`
    : 'VWCE (celý svět) vs CSPX/SXR8 (500 firem USA): výnos v Kč po letech, poplatky, složení, daně a měnové riziko vedle sebe.';
  return {
    title: `VWCE vs CSPX (SXR8): srovnání ETF v korunách ${new Date().getFullYear()}`,
    description: popis,
    alternates: { canonical: CANONICAL },
  };
}

export default async function SrovnaniPreview() {
  const data = await getComparisonETFData(TICKER1, TICKER2);
  const today = new Date();
  const year = today.getFullYear();

  if (!data) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-600 p-6 text-center">
        <p>Data pro srovnání {TICKER1} vs {TICKER2} se nepodařilo načíst. Zkuste to prosím později.</p>
      </div>
    );
  }

  const { etf1, etf2 } = data;
  // Jméno, pod kterým se fond v Česku kupuje (XETRA): CSPX → SXR8. Vysvětlí se jednou v úvodu.
  const t1 = tickerProCesko(etf1) ?? TICKER1;
  const t2 = tickerProCesko(etf2) ?? TICKER2;
  const doplnky = await nactiDoplnkyFondu([etf1.isin, etf2.isin]);
  const dp1 = doplnky[etf1.isin], dp2 = doplnky[etf2.isin];
  // Datum = den cen staršího ze dvou fondů (datumCen ze scraping_date), ne den stažení ani globální datum.
  const stazeno = [dp1?.scrapingDate, dp2?.scrapingDate].filter(Boolean).map((d) => new Date(String(d))).sort((a, b) => a.getTime() - b.getTime())[0];
  const denDat = stazeno ? datumCen(stazeno) : await getDataDate(today);
  const datumK = denDat.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  const odl1 = !!dp1?.odlehly, odl2 = !!dp2?.odlehly;

  const terNizsi = etf1.ter_numeric != null && etf2.ter_numeric != null && ter(etf1.ter_numeric) !== ter(etf2.ter_numeric)
    ? (etf1.ter_numeric < etf2.ter_numeric ? 1 : 2) : 0;
  const r5a = odl1 ? null : etf1.return_5y_czk, r5b = odl2 ? null : etf2.return_5y_czk;
  const zeme1 = dp1?.zeme ?? [];
  const zeme2 = dp2?.zeme ?? [];
  const usa = (z: { nazev: string; vaha: number }[]) => z.find((x) => x.nazev === 'United States')?.vaha ?? null;
  const usa1 = usa(zeme1), usa2 = usa(zeme2);
  const ODSTINY = ['bg-slate-700', 'bg-slate-500', 'bg-slate-400', 'bg-slate-300', 'bg-slate-200'];
  const holdings1 = etf1.total_holdings;
  const holdings2 = etf2.total_holdings;
  const f1 = (v: number | null) => procenta(v, 0, false);

  /* ---------- JSON-LD ---------- */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Srovnávač ETF', item: 'https://etfpruvodce.cz/srovnani' },
      { '@type': 'ListItem', position: 3, name: `${TICKER1} vs ${TICKER2}`, item: CANONICAL },
    ],
  };
  const financialProduct = (e: ComparisonETF) => ({
    '@type': 'FinancialProduct',
    name: e.name,
    identifier: e.isin,
    category: 'ETF',
    feesAndCommissionsSpecification: e.ter_numeric != null ? `${e.ter_numeric} % TER ročně` : undefined,
  });
  const faqs = [
    {
      q: `Je CSPX totéž co ${t2}?`,
      a: `Ano. CSPX (londýnská burza, v USD) a ${t2} (XETRA, v EUR) jsou tickery téhož fondu ${etf2.name} (ISIN ${etf2.isin}) – stejný poplatek, složení i výnos. Čeští brokeři (DEGIRO, XTB, Trading 212) ho obvykle nabízejí na XETRA jako ${t2}.`,
    },
    {
      q: `Jaký je hlavní rozdíl mezi ${t1} a ${t2}?`,
      a: `${t1} (${indexFonduLabel(etf1) ?? 'index celého světa'}) drží zhruba ${holdings1?.toLocaleString('cs-CZ') ?? 'tisíce'} firem z celého světa – USA, Evropa, Japonsko i rozvíjející se trhy. ${t2} (${indexFonduLabel(etf2) ?? 'S&P 500'}) drží ${holdings2?.toLocaleString('cs-CZ') ?? '500'} největších firem z USA. ${t1} je tedy celosvětová diverzifikace, ${t2} soustředění na americký trh.`,
    },
    {
      q: 'Vyplácejí tyto fondy dividendy?',
      a: 'Ne, oba jsou akumulační – dividendy se reinvestují uvnitř fondu a na účet nic nechodí. V ČR proto dividendy v daňovém přiznání neřešíte.',
    },
    {
      q: 'Jak se tyto ETF daní v Česku?',
      a: 'Zisk z prodeje je osvobozen, pokud fond držíte déle než 3 roky (časový test, od roku 2026 bez horního limitu), nebo když úhrn vašich prodejů za rok nepřekročí 100 000 Kč (hodnotový test – hrubé příjmy, ne zisk). Jinak se zisk daní 15 % (u vysokých příjmů 23 %). Oba fondy jsou irské, takže W-8BEN nevyplňujete.',
    },
    {
      q: `Má smysl držet ${t1} i ${t2} zároveň?`,
      a: `Kombinace zvyšuje podíl USA: ${t1} už ${usa1 != null ? `má v USA zhruba ${f1(usa1)}` : 'obsahuje i velké americké firmy'}, takže ${t2} k němu přidává hlavně ty samé firmy. Kdo chce vyšší váhu USA než ve světovém indexu, může oba kombinovat záměrně – jde o rozhodnutí o poměru regionů, ne o lepší diverzifikaci.`,
    },
    {
      q: 'Jak koupit VWCE nebo SXR8?',
      a: `U brokera fond najdete podle ISIN: ${t1} ${etf1.isin}, ${t2} ${etf2.isin}. Oba se obchodují na XETRA v eurech. Poplatky brokerů porovnává stránka Kde koupit ETF.`,
    },
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${TICKER1} vs ${TICKER2} (${t2}): srovnání ETF v korunách ${year}`,
    // Autor, vydavatel a data ze src/lib/redakce.ts (SEO audit 20. 10. 2026: dřív dateModified = „dnes“, bez datePublished).
    author: autorSchema,
    publisher: vydavatelSchema,
    datePublished: dataClanku('/srovnani/vwce-vs-cspx')?.publikovano,
    dateModified: datumUpravy('/srovnani/vwce-vs-cspx', denDat),
    about: [financialProduct(etf1), financialProduct(etf2)],
    mainEntityOfPage: CANONICAL,
  };

  /* Rozdíly v kostce – fakta z dat, bez „vítěze“. */
  const kostka: { label: React.ReactNode; v1: string; v2: string; pozn?: string }[] = [
    { label: 'Index', v1: indexFonduLabel(etf1) ?? '—', v2: indexFonduLabel(etf2) ?? '—' },
    { label: 'Počet firem', v1: holdings1?.toLocaleString('cs-CZ') ?? '—', v2: holdings2?.toLocaleString('cs-CZ') ?? '—' },
    { label: 'Podíl USA', v1: f1(usa1), v2: f1(usa2) },
    { label: <InfoTip label="Roční poplatek za správu fondu (TER), strhává se průběžně z hodnoty investice.">Poplatek (TER)</InfoTip>, v1: ter(etf1.ter_numeric), v2: ter(etf2.ter_numeric), pozn: terNizsi ? `nižší má ${terNizsi === 1 ? t1 : t2}` : undefined },
    { label: <InfoTip label="Kumulativní výnos fondu za 5 let přepočtený do korun – zahrnuje pohyb kurzu. Minulé výnosy nezaručují budoucí.">Výnos 5 let v Kč</InfoTip>, v1: pct(r5a), v2: pct(r5b) },
    { label: 'Velikost fondu', v1: money(etf1.fund_size_numeric, etf1.fund_currency), v2: money(etf2.fund_size_numeric, etf2.fund_currency) },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

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

      <main id="obsah" className="max-w-6xl mx-auto px-4">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/srovnani" className="hover:text-slate-600">Srovnávač ETF</Link>
          <span>/</span>
          <span className="text-slate-600">{TICKER1} vs {TICKER2}</span>
        </nav>

        {/* ÚVOD – kompaktní, karty obou fondů vedle sebe i na mobilu (první čísla nad zlomem) */}
        <section data-sekce="hero" className="pb-8">
          <div className="rounded-2xl bg-slate-900 text-white p-4 md:px-8 md:py-7">
            <h1 className="text-xl md:text-3xl font-bold tracking-tight leading-tight">{TICKER1} vs {TICKER2}: srovnání v korunách</h1>
            <p className="mt-1.5 text-sm text-slate-300 leading-snug">
              Celý svět ({holdings1?.toLocaleString('cs-CZ') ?? 'tisíce'} firem) proti 500 největším firmám USA.{' '}
              <span className="text-slate-400">Data k {datumK}.</span>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 md:gap-4">
              <SrovnaniSoubojKarta etf={etf1} ticker={t1} podtitul="Celý svět" barva={barvaFondu(0)} odlehly={odl1} />
              <SrovnaniSoubojKarta etf={etf2} ticker={t2} podtitul="USA – 500 firem" barva={barvaFondu(1)} odlehly={odl2} />
            </div>
            {t2 !== TICKER2 && (
              <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-400 leading-relaxed">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{TICKER2} je tentýž fond jako <strong className="text-slate-200">{t2}</strong> – pod tímto tickerem ho na XETRA nabízí většina českých brokerů, proto dál píšeme {t2}.</span>
              </p>
            )}
          </div>
        </section>

        {/* VÝNOS PO LETECH – skutečné výnosy obou fondů (ne index) */}
        {dp1 && dp2 && (
          <section data-sekce="graf" className="pb-10">
            <h2 className="mb-3 text-xl md:text-2xl font-bold tracking-tight text-slate-900">Výnos po jednotlivých letech</h2>
            <SrovnaniRocniVynosy fondy={[{ label: t1, roky: dp1.roky }, { label: t2, roky: dp2.roky }]} />
          </section>
        )}

        {/* ROZDÍLY V KOSTCE + PRO KOHO KTERÝ – jeden blok (dřív Verdikt + Shrnutí + Kdy zvolit který) */}
        <section id="rozdily" data-sekce="verdikt" className="pb-10 scroll-mt-16">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Rozdíly v kostce</h2>
          <p className="mt-1 text-sm text-slate-500">Oba fondy jsou akumulační a irské – výplatou dividend ani daněmi se neliší. Liší se tím, do čeho investují.</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-[13px] sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-500">
                    <th className="py-2.5 pl-4 pr-2 text-left font-medium" />
                    {[t1, t2].map((t, i) => (
                      <th key={t} className="py-2.5 px-2 last:pr-4 text-right font-semibold text-slate-800">
                        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: barvaFondu(i) }} aria-hidden="true" />{t}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 tabular-nums">
                  {kostka.map((r, i) => (
                    <tr key={i}>
                      <td className="py-2.5 pl-4 pr-2 text-slate-600">{r.label}{r.pozn && <span className="block text-[11px] text-slate-400">{r.pozn}</span>}</td>
                      <td className="py-2.5 px-2 text-right font-medium text-slate-900 whitespace-nowrap">{r.v1}</td>
                      <td className="py-2.5 pl-2 pr-4 text-right font-medium text-slate-900 whitespace-nowrap">{r.v2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="lg:col-span-2 grid gap-3 content-start">
              <h3 className="text-base font-semibold text-slate-900">Pro koho který</h3>
              {[
                {
                  t: t1, i: 0, Icon: Globe2, titul: 'Celý svět v jednom fondu',
                  body: [
                    `Pro toho, kdo chce jedním fondem pokrýt vyspělé i rozvíjející se trhy a nevybírat regiony.`,
                    usa1 != null ? `USA tvoří zhruba ${f1(usa1)}, zbytek Evropa, Japonsko a další.` : '',
                  ],
                },
                {
                  t: t2, i: 1, Icon: Landmark, titul: '500 největších firem USA',
                  body: [
                    'Pro toho, kdo cíleně chce americký trh a snese soustředění do jedné země a měny.',
                    terNizsi === 2 ? `Nižší poplatek: ${ter(etf2.ter_numeric)} vs ${ter(etf1.ter_numeric)}.` : '',
                  ],
                },
              ].map(({ t, i, Icon, titul, body }) => (
                <div key={t} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="flex items-center gap-2 font-semibold text-slate-900">
                    <Icon className="w-4 h-4 shrink-0" style={{ color: barvaFondu(i) }} aria-hidden="true" />{t} – {titul}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{body.filter(Boolean).join(' ')}</p>
                  <Link href={`/etf/${i === 0 ? etf1.isin : etf2.isin}`} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">Detail {t} <ArrowRight className="w-4 h-4" /></Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DO ČEHO FONDY INVESTUJÍ – země z dat */}
        <section data-sekce="slozeni" className="pb-10">
          <h2 className="mb-4 text-xl md:text-2xl font-bold tracking-tight text-slate-900">Do čeho fondy investují</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {([[t1, etf1, zeme1, 0], [t2, etf2, zeme2, 1]] as const).map(([tk, e, zeme, i]) => (
              <div key={tk} className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900"><span className="h-2.5 w-2.5 rounded-full" style={{ background: barvaFondu(i) }} aria-hidden="true" /> {tk}</span>
                  <span className="text-sm text-slate-500"><strong className="text-xl font-bold text-slate-900 tabular-nums">{e.total_holdings?.toLocaleString('cs-CZ') ?? '—'}</strong> firem</span>
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

        {/* VŠECHNY PARAMETRY */}
        <section id="parametry" data-sekce="parametry" className="pb-10 scroll-mt-16">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Všechny parametry</h2>
          <p className="mt-1 mb-4 text-sm text-slate-500">Zelená = nižší poplatek, vyšší výnos nebo menší kolísání v řádku. Výnosy v měně zvolené u grafu.</p>
          <ParametryDvojice etf1={etf1} etf2={etf2} ticker1={t1} ticker2={t2} />
          {/* Podrobné porovnání se STEJNÝM pořadím fondů → stejné barvy (barvaFondu podle pozice; revize kola 4). */}
          <Link href={`/srovnani/porovnani?isins=${etf1.isin},${etf2.isin}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
            Podrobné porovnání – sektory, největší pozice, riziko <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* DANĚ A MĚNA – stručně (dřív tabulka + 2 karty + žlutý box) */}
        <section data-sekce="dane" className="pb-10">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Daně a měna</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5 text-sm text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900">Daně – u obou stejné</p>
              <ul className="mt-2 space-y-1.5">
                <li><strong className="text-slate-800">Po 3 letech držení</strong> je zisk z prodeje osvobozen (od 2026 bez limitu).</li>
                <li><strong className="text-slate-800">Do 3 let</strong> daň 15 % ze zisku, pokud prodeje za rok přesáhnou 100 000 Kč.</li>
                <li>Akumulační fondy – dividendy v přiznání neřešíte. Irský domicil – W-8BEN nevyplňujete.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5 text-sm text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900">Měnové riziko vůči koruně</p>
              <ul className="mt-2 space-y-1.5">
                <li><strong className="text-slate-800">{t1}</strong> drží firmy v dolarech, eurech, jenech a dalších měnách – riziko je rozložené.</li>
                <li><strong className="text-slate-800">{t2}</strong> drží jen americké firmy – výnos v Kč stojí a padá s kurzem USD/CZK.</li>
                <li>Výnosy na této stránce jsou přepočtené do Kč, takže pohyb kurzu už obsahují. <Link href="/menove-riziko-etf" className="font-medium text-teal-700 underline underline-offset-2">Jak měna mění výnos</Link></li>
              </ul>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">Daňové údaje jsou orientační, nejde o daňové poradenství.</p>
        </section>

        {/* FAQ */}
        <section data-sekce="faq" className="pb-10">
          <h2 className="mb-4 text-xl md:text-2xl font-bold tracking-tight text-slate-900">Časté dotazy</h2>
          <FaqSeznam items={faqs} />
        </section>

        {/* POKRAČUJTE */}
        {/* Kolo 6b: stejná komponenta jako ostatní dvojice a detail (dřív vlastní mřížka 13 karet s ↗ a jiným písmem). */}
        <section data-sekce="dalsi" className="pb-8">
          <DalsiSrovnani aktualni="vwce-vs-cspx" nadpis="Další srovnání" />
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/kde-koupit" className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">Kde koupit ETF <ArrowRight className="w-4 h-4" /></Link>
            {([['DEGIRO', reviewHref.degiro], ['XTB', reviewHref.xtb], ['Interactive Brokers', reviewHref.ibkr]] as [string, string][]).map(([b, href]) => (
              <Link key={b} href={href} className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">Recenze {b} <ArrowRight className="w-4 h-4" /></Link>
            ))}
            <Link href="/nejlepsi-etf/nejlepsi-celosvetove-etf" className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">Celosvětové ETF <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/nejlepsi-etf/nejlepsi-sp500-etf" className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">S&amp;P 500 ETF <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>

        <div className="pb-12 space-y-2">
          <p className="flex items-start gap-1.5 text-xs text-slate-400 leading-relaxed">
            <Database className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
            <span>Data fondů: justETF · kurzy ČNB · data k {datumK} (<Link href="/metodika" className="underline underline-offset-2 hover:text-slate-600">metodika</Link>). Píše <Link href="/o-nas" className="underline underline-offset-2 hover:text-slate-600">Tomáš Kostrhoun</Link>, bez placeného pořadí.</span>
          </p>
          <InvestmentDisclaimer variant="inline" className="!text-slate-400" />
        </div>
      </main>
    </div>
  );
}
