import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { getComparisonETFData, type ComparisonETF , getDataDate } from '@/lib/etf-data';
import {
  TrendingUp, ArrowRight, ArrowUpRight, Trophy, Scale, Coins,
  AlertTriangle, Check, Info, Database, User, Landmark, HelpCircle, Globe2, ChevronDown,
} from 'lucide-react';
import { ter, dist } from '@/components/design-preview/CategoryUI';
import InfoTip from '@/components/design-preview/InfoTip';
import { SrovnaniSoubojKarta } from '@/components/design-preview/SrovnaniCompareUI';
import SrovnaniParams from '@/components/design-preview/SrovnaniParams';
import { platnyTicker } from '@/lib/ticker';
import { nactiDoplnkyFondu } from '@/lib/srovnaniRocni';
import SrovnaniRocniVynosy from '@/components/design-preview/SrovnaniRocniVynosy';
import { ceskaZeme } from '@/lib/preklady';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';

export const revalidate = 86400;

/* Pilot: VWCE vs CSPX. V produkci by ticker1/ticker2 přišly z URL slugu. */
const TICKER1 = 'VWCE';
const TICKER2 = 'CSPX';
// Dřív /srovnani-etf/… = adresa s přesměrováním 308 → canonical mířil na redirect.
const CANONICAL = 'https://etfpruvodce.cz/srovnani/vwce-vs-cspx';

// Popis z dat (dřív natvrdo „VWCE TER 0,19 %“, přitom fond má 0,14 % – revize 18. 10. 2026).
export async function generateMetadata(): Promise<Metadata> {
  const data = await getComparisonETFData(TICKER1, TICKER2);
  const popis = data
    ? `VWCE (TER ${ter(data.etf1.ter_numeric)}, ${data.etf1.total_holdings?.toLocaleString('cs-CZ') ?? 'tisíce'} firem celého světa) vs CSPX (TER ${ter(data.etf2.ter_numeric)}, ${data.etf2.total_holdings?.toLocaleString('cs-CZ') ?? '500'} firem USA). Srovnání pro Čechy: výnos v Kč po letech, daně, měnové riziko a který koupit.`
    : 'VWCE (celý svět) vs CSPX (500 firem USA). Srovnání pro Čechy: výnos v Kč, daně, měnové riziko a který koupit.';
  return {
    title: `VWCE vs CSPX: srovnání ${new Date().getFullYear()} a které ETF koupit`,
    description: popis,
    alternates: { canonical: CANONICAL },
  };
}

export default async function SrovnaniPreview() {
  const data = await getComparisonETFData(TICKER1, TICKER2);

  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  const year = today.getFullYear();

  if (!data) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-600 p-6 text-center">
        <p>Data pro srovnání {TICKER1} vs {TICKER2} se nepodařilo načíst. Zkuste to prosím později.</p>
      </div>
    );
  }

  const { etf1, etf2 } = data;
  // V textu ticker z URL (tak ho člověk hledal); v nadpisu a kartách i primární ticker, když se liší –
  // revize 18. 10. 2026: URL „vwce-vs-cspx“, nadpis „VWCE vs SXR8“ → nesedělo.
  const t1 = TICKER1;
  const t2 = TICKER2;
  const nz = (tk: string, e: ComparisonETF) => { const p = platnyTicker(e.primary_ticker); return p && p.toUpperCase() !== tk ? `${tk} (${p})` : tk; };
  const nz1 = nz(t1, etf1), nz2 = nz(t2, etf2);
  const doplnky = await nactiDoplnkyFondu([etf1.isin, etf2.isin]);
  const dp1 = doplnky[etf1.isin], dp2 = doplnky[etf2.isin];
  // Datum = starší ze dvou dat fondů (scraping_date), ne globální datum.
  const datumFondu = [dp1?.scrapingDate, dp2?.scrapingDate].filter(Boolean).map((d) => new Date(String(d))).sort((a, b) => a.getTime() - b.getTime())[0];
  const datumK = datumFondu ? datumFondu.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' }) : dateStr;
  const terNizsi2 = etf1.ter_numeric != null && etf2.ter_numeric != null && ter(etf2.ter_numeric) !== ter(etf1.ter_numeric) && etf2.ter_numeric < etf1.ter_numeric;
  // „Historicky vyšší výnos“ jen když to data za 5 let v Kč opravdu ukazují (rozdíl aspoň 1 p. b.).
  const r5a = etf1.return_5y_czk, r5b = etf2.return_5y_czk;
  const vyssiVynos2 = r5a != null && r5b != null && r5b - r5a >= 1;
  const pctKc = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : ''}${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`);
  const zemeVwce = dp1?.zeme ?? [];
  const zemeCspx = dp2?.zeme ?? [];
  const ODSTINY = ['bg-teal-700', 'bg-teal-500', 'bg-teal-400', 'bg-teal-300', 'bg-teal-200'];

  /* Klíčová logika verdiktu: liší se sledovaný index?
     U VWCE vs CSPX jsou indexy RŮZNÉ (FTSE All-World vs S&P 500) → větev
     "různá expozice celý svět vs USA". Pokud by šlo o stejný index, verdikt
     by řešil vítěze podle nákladů/velikosti + niku. */
  const sameIndex = !!etf1.index_name && etf1.index_name === etf2.index_name;

  /* Edukační čísla – počet firem, diverzifikace vs koncentrace. */
  const holdings1 = etf1.total_holdings;
  const holdings2 = etf2.total_holdings;

  /* ---------- JSON-LD ---------- */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Srovnání ETF', item: 'https://etfpruvodce.cz/srovnani-etf' },
      { '@type': 'ListItem', position: 3, name: `${nz1} vs ${nz2}`, item: CANONICAL },
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
      q: `Jaký je hlavní rozdíl mezi ${t1} a ${t2}?`,
      a: `${t1} (${etf1.index_name}) drží zhruba ${holdings1?.toLocaleString('cs-CZ') ?? 'tisíce'} firem z celého světa – USA, Evropa, Japonsko i rozvíjející se trhy. ${t2} (${etf2.index_name}) drží ${holdings2?.toLocaleString('cs-CZ') ?? '500'} největších firem výhradně z USA. ${t1} je tedy globální diverzifikace, ${t2} koncentrovaná sázka na americký trh.`,
    },
    {
      q: 'Který z nich má nižší poplatky?',
      a: `Nižší roční poplatek má ${(etf2.ter_numeric ?? 1) < (etf1.ter_numeric ?? 1) ? t2 : t1} s TER ${ter(Math.min(etf1.ter_numeric ?? 1, etf2.ter_numeric ?? 1))}. ${t1} má ${ter(etf1.ter_numeric)}, ${t2} ${ter(etf2.ter_numeric)}. Rozdíl v poplatcích je ale obvykle menší než rozdíl ve výnosu daný odlišnou expozicí (celý svět vs USA).`,
    },
    {
      q: 'Vyplácejí tyto fondy dividendy?',
      a: `Oba fondy jsou ${dist(etf1.distribution_policy).toLowerCase()} – dividendy se reinvestují uvnitř fondu, na účet nic nechodí. V ČR proto neřešíte žádnou srážkovou daň z dividend ani řádky v daňovém přiznání. Z hlediska výplaty a daní se ${t1} a ${t2} neliší – rozhoduje expozice.`,
    },
    {
      q: 'Který je vhodnější pro začátečníka?',
      a: `Pro úplného začátečníka bývá jednodušší volbou globální ${t1}: jedním fondem koupíte celý světový trh a nemusíte řešit, jestli zrovna porostou USA, nebo Evropa. ${t2} dává smysl, pokud cíleně chcete vyšší podíl amerických firem a unesete vyšší koncentraci.`,
    },
    {
      q: 'Jak se tyto ETF daní v Česku?',
      a: 'Zisk z prodeje je osvobozen, pokud fond držíte déle než 3 roky (časový test, od roku 2026 bez horního limitu), nebo když úhrn vašich prodejů za rok nepřekročí 100 000 Kč (hodnotový test – hrubé příjmy, ne zisk). Jinak se zisk daní 15 % (u vysokých příjmů 23 %). Oba fondy jsou irské, takže W-8BEN nevyplňujete.',
    },
    {
      q: `Má smysl držet ${t1} i ${t2} zároveň?`,
      a: `Spíš ne. ${t1} už ${holdings2 ?? 500} velkých amerických firem obsahuje (USA tvoří většinu světového indexu). Kombinací byste si jen zvýšili podíl USA – pak je čistší zvolit rovnou ${t2}, nebo zůstat u globálního ${t1}. Držet oba najednou vede k překryvu, ne k lepší diverzifikaci.`,
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
    headline: `${t1} vs ${t2}: srovnání ${year} a které ETF koupit`,
    author: { '@type': 'Person', name: 'Tomáš Kostrhoun' },
    publisher: { '@type': 'Organization', name: 'ETF průvodce.cz' },
    dateModified: today.toISOString().slice(0, 10),
    about: [financialProduct(etf1), financialProduct(etf2)],
    mainEntityOfPage: CANONICAL,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Header – stejný jazyk jako schválená homepage/kategorie */}
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
        {/* Breadcrumb (v produkci dodá Layout) */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/srovnani" className="hover:text-slate-600">Srovnání ETF</Link>
          <span>/</span>
          <span className="text-slate-600">{nz1} vs {nz2}</span>
        </nav>

        {/* HERO – slate-900 panel, verdikt-first */}
        <section data-sekce="hero" className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-5 py-6 md:px-9 md:py-8">
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                {nz1} vs {nz2}: které ETF koupit?
              </h1>
              <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                Souboj dvou nejoblíbenějších fondů u českých investorů. {t1} sází na{' '}
                <strong className="text-white">celý svět</strong> ({holdings1?.toLocaleString('cs-CZ') ?? 'tisíce'} firem),
                {' '}{t2} na <strong className="text-white">500 největších firem USA</strong>.
                Porovnáváme poplatky, expozici, daně v ČR i měnové riziko – a říkáme, komu sedí který.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                  <Link href="/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                </span>
                <span>Data fondů k {datumK}</span>
              </div>
            </div>

            {/* Souboj-karty obou fondů */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-3">
              <SrovnaniSoubojKarta etf={etf1} ticker={nz1} podtitul="Celý svět" accent="teal" />
              <div className="hidden sm:flex items-center justify-center shrink-0">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-slate-300 text-xs font-bold">vs</span>
              </div>
              <SrovnaniSoubojKarta etf={etf2} ticker={nz2} podtitul="USA – 500 firem" accent="sky" />
            </div>

            <div className="mt-5 flex gap-2.5">
              <Link href="#verdikt" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Náš verdikt</Link>
              <Link href="#parametry" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Tabulka parametrů</Link>
            </div>
          </div>
        </section>

        {/* VÝNOS PO LETECH – skutečné výnosy obou fondů (ne index), v Kč */}
        {dp1 && dp2 && (
          <section data-sekce="graf" className="pb-10">
            <h2 className="mb-3 text-xl md:text-2xl font-bold tracking-tight text-slate-900">Výnos po jednotlivých letech</h2>
            <SrovnaniRocniVynosy fondy={[{ label: t1, roky: dp1.roky }, { label: t2, roky: dp2.roky }]} />
          </section>
        )}

        {/* VERDIKT */}
        <section id="verdikt" data-sekce="verdikt" className="pb-10 scroll-mt-16">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Verdikt: rozhoduje expozice, ne poplatek</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {sameIndex
                  ? 'Oba fondy sledují stejný index – liší se hlavně náklady a velikostí.'
                  : 'Oba fondy jsou akumulační a irské, takže výplata dividend ani daně se neliší. Skutečný rozdíl je v tom, do čeho investujete.'}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Větev 1 – VWCE / celý svět */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Globe2 className="w-5 h-5" /></span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-teal-700">Pro většinu a začátečníky</p>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{t1} — celý svět v jednom fondu</h3>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Drží {holdings1?.toLocaleString('cs-CZ') ?? 'tisíce'} firem napříč USA, Evropou, Japonskem i rozvíjejícími se trhy.
                Maximální diverzifikace – nemusíte hádat, který region zrovna poroste. Vyšší TER {ter(etf1.ter_numeric)} je
                cena za globální záběr. Vhodné jako jediný, „nech a zapomeň“ fond.
              </p>
              <Link href={`/etf/${etf1.isin}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
                Detail fondu {t1} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Větev 2 – CSPX / USA */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 text-slate-700 shrink-0"><Landmark className="w-5 h-5" /></span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-700">Pro sázku na USA</p>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{t2} — 500 firem USA{terNizsi2 ? ', nižší poplatek' : ''}</h3>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Koncentrovaná expozice na {holdings2?.toLocaleString('cs-CZ') ?? '500'} největších amerických firem (Apple, Microsoft, Nvidia…).{' '}
                {terNizsi2 ? <>Nižší TER {ter(etf2.ter_numeric)}{vyssiVynos2 ? <> a za posledních 5 let vyšší výnos v Kč ({pctKc(r5b)} vs {pctKc(r5a)})</> : null} – ale</> : vyssiVynos2 ? <>Za posledních 5 let vyšší výnos v Kč ({pctKc(r5b)} vs {pctKc(r5a)}) – ale</> : 'Ale'} prakticky celý v jedné zemi a měně.
                Vhodné, když cíleně věříte americkému trhu a unesete vyšší koncentraci.
              </p>
              <Link href={`/etf/${etf2.isin}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
                Detail fondu {t2} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-teal-50 border border-teal-200 p-4 flex items-start gap-2.5">
            <Trophy className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
            <p className="text-sm text-teal-900/90 leading-relaxed">
              <strong>Shrnutí:</strong> Nejde o to, který fond je „lepší“ – {t1} a {t2} řeší jinou potřebu.
              Chcete jeden globální fond a klid? {t1}. Věříte konkrétně americkým firmám{terNizsi2 ? ' a chcete nižší poplatek' : ''}? {t2}.
              Daně ani výplata dividend vás v rozhodování nemusí trápit – jsou u obou stejné.
            </p>
          </div>
        </section>

        {/* DO ČEHO FONDY INVESTUJÍ – země a počet firem z dat (dřív natvrdo 62/17/11/10 % a „100 % USA“) */}
        <section data-sekce="slozeni" className="pb-10">
          <h2 className="mb-4 text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            <InfoTip label="Diverzifikace = rozložení peněz mezi víc firem a zemí, aby propad jednoho trhu neohrozil celé portfolio.">Do čeho fondy investují</InfoTip>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {([[t1, etf1, zemeVwce, Globe2, 'text-teal-700'], [t2, etf2, zemeCspx, Landmark, 'text-slate-700']] as const).map(([tk, e, zeme, Icon, barva]) => (
              <div key={tk} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${barva}`}><Icon className="w-4 h-4" /> {tk}</span>
                  <span className="text-sm text-slate-500"><strong className="text-2xl font-bold text-slate-900 tabular-nums">{e.total_holdings?.toLocaleString('cs-CZ') ?? '—'}</strong> firem</span>
                </div>
                {zeme.length > 0 ? (
                  <>
                    <div className="mt-3 flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={zeme.map((z) => `${ceskaZeme(z.nazev)} ${z.vaha.toLocaleString('cs-CZ')} %`).join(', ')}>
                      {zeme.map((z, i) => <span key={z.nazev} className={ODSTINY[i]} style={{ width: `${z.vaha}%` }} />)}
                    </div>
                    <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
                      {zeme.map((z, i) => (
                        <li key={z.nazev} className="inline-flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${ODSTINY[i]}`} /> {ceskaZeme(z.nazev)} <span className="tabular-nums text-slate-500">{z.vaha.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %</span></li>
                      ))}
                    </ul>
                  </>
                ) : <p className="mt-3 text-sm text-slate-400">Rozložení podle zemí nemáme.</p>}
              </div>
            ))}
          </div>
          {holdings1 != null && holdings2 != null && holdings1 > 0 && holdings2 > 0 && (
            <p className="mt-3 text-sm text-slate-600">
              {t1} drží zhruba <strong className="text-slate-900 tabular-nums">{(holdings1 / holdings2).toFixed(1).replace('.', ',')}×</strong> více firem než {t2}.
            </p>
          )}
        </section>

        {/* TABULKA PARAMETRŮ */}
        <section id="parametry" data-sekce="parametry" className="pb-10 scroll-mt-16">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Srovnání parametrů</h2>
            <p className="text-sm text-slate-500 mt-1">Zelené pole = výhodnější hodnota v řádku.</p>
          </div>
          <SrovnaniParams etf1={etf1} etf2={etf2} ticker1={t1} ticker2={t2} />
          <p className="text-xs text-slate-400 mt-3 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Výnosy jsou přepočtené do korun a ukazují minulou výkonnost – nezaručují budoucí vývoj. „Vítěz“ řádku je jen orientační –
            u expozice a strategie (počet firem, index) nejde o lepší/horší, ale o jiný profil.
          </p>
        </section>

        {/* KDY ZVOLIT KTERÝ */}
        <section className="pb-10">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Kdy zvolit který</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Dvě různé osy rozhodování – ne stejná volba dvakrát.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Globe2 className="w-4 h-4 text-teal-700" /> Zvolte {t1}, pokud</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  'Chcete jediný fond pokrývající celý svět a mít klid',
                  'Nechcete sázet na jednu zemi ani odhadovat, co poroste',
                  'Preferujete maximální rozložení rizika (diverzifikaci)',
                  `Vyšší TER ${ter(etf1.ter_numeric)} vám za globální záběr stojí`,
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Landmark className="w-4 h-4 text-slate-700" /> Zvolte {t2}, pokud</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  'Cíleně věříte americkému trhu a největším US firmám',
                  terNizsi2 ? `Chcete nižší poplatek (TER ${ter(etf2.ter_numeric)} vs ${ter(etf1.ter_numeric)})` : `Poplatek je u obou podobný (TER ${ter(etf2.ter_numeric)})`,
                  'Unesete sázku prakticky na jednu zemi a koncentraci do největších firem',
                  'Diverzifikaci napříč regiony řešíte jiným fondem zvlášť',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ČESKÉ DANĚ */}
        <section className="pb-10">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Jak se {t1} a {t2} daní v Česku</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Oba fondy jsou akumulační a irské – daňově se mezi sebou neliší.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-left">
                  <th className="py-3 px-4 font-medium">Situace</th>
                  <th className="py-3 px-4 font-medium">Daňový dopad v ČR (platí pro oba fondy)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr><td className="py-3 px-4">Prodej po 3+ letech držby</td><td className="py-3 px-4">Osvobozeno – časový test podle § 4 zákona o daních z příjmů (0 %)</td></tr>
                <tr><td className="py-3 px-4">Prodej do 3 let</td><td className="py-3 px-4">Daň 15 % ze zisku (prodejní mínus nákupní cena)</td></tr>
                <tr><td className="py-3 px-4">Dividendy</td><td className="py-3 px-4">Oba jsou akumulační – nic se nevyplácí, v přiznání neuvádíte</td></tr>
                <tr><td className="py-3 px-4">Formulář W-8BEN</td><td className="py-3 px-4">Nevyplňujete – irský domicil řeší srážkovou daň z US dividend za vás</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Daně jsou orientační a nejsou daňovým poradenstvím. Konkrétní situaci konzultujte s daňovým poradcem.
          </p>
        </section>

        {/* MĚNOVÉ RIZIKO */}
        <section className="pb-10">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Měnové riziko: výnos v korunách ovlivní kurz</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Žádný z těchto fondů není v korunách. Váš výnos v Kč závisí i na pohybu měny.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Coins className="w-4 h-4 text-teal-700" /> {t1} — mix měn celého světa</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Fond je veden v {etf1.fund_currency ?? 'USD'}, ale uvnitř drží firmy v dolarech, eurech, jenech i dalších měnách.
                Měnové riziko je rozložené přes víc měn. I tak platí: když koruna posílí, výnos přepočtený do Kč klesne.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Coins className="w-4 h-4 text-slate-700" /> {t2} — navázáno na dolar</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Drží jen americké firmy, takže výnos v korunách stojí a padá s kurzem USD/CZK.
                Když index vzroste o 10 %, ale koruna proti dolaru posílí o 15 %, výnos přepočtený do Kč může být i záporný.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-900/80 leading-relaxed">
              Výnosy v tabulce jsou přepočtené do korun, takže už zahrnují pohyb kurzu. Samotný fond ale nadále kotuje
              v cizí měně (ETF nekupujete „v korunách“), a měnové výkyvy proto patří k riziku obou fondů i do budoucna.
            </p>
          </div>
        </section>

        {/* JAK KOUPIT */}
        <section className="pb-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Jak {t1} nebo {t2} koupit</h2>
              <p className="text-sm text-slate-500 mt-1">Čtyři kroky od registrace k prvnímu nákupu.</p>
            </div>
            <Link href="/kde-koupit" className="text-sm text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 shrink-0">
              srovnání brokerů <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {([
              ['1', 'Vyberte brokera', 'Např. DEGIRO, XTB nebo Interactive Brokers – recenze a poplatky najdete pod odkazy níže.'],
              ['2', 'Ověření a vklad', 'Registrace, ověření totožnosti a převod peněz (1–3 dny).'],
              ['3', 'Najděte fond podle ISIN', <span key="isin" className="block font-mono text-[11px] leading-relaxed"><span className="block whitespace-nowrap">{t1}: {etf1.isin}</span><span className="block whitespace-nowrap">{t2}: {etf2.isin}</span></span>],
              ['4', 'Nákup', 'Zadejte limitní pokyn, zkontrolujte rozpětí ceny a potvrďte.'],
            ] as [string, string, React.ReactNode][]).map(([n, t, d]) => (
              <div key={n} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold">{n}</span>
                <p className="font-medium text-slate-900 text-sm mt-2.5">{t}</p>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {([['DEGIRO', reviewHref.degiro], ['XTB', reviewHref.xtb], ['Interactive Brokers', reviewHref.ibkr], ['Srovnání brokerů', '/kde-koupit']] as [string, string][]).map(([b, href]) => (
              <Link key={b} href={href} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors">{b} <ArrowRight className="w-3.5 h-3.5 text-slate-400" /></Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-10">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Časté dotazy</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((f) => (
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

        {/* PROLINKOVÁNÍ */}
        <section data-sekce="dalsi" className="pb-8">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Pokračujte dál</h2>
          </div>

          {/* Další souboje */}
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">Další oblíbené souboje</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {[
              { slug: 'iwda-vs-cspx', href: '/srovnani?q=IWDA', label: 'IWDA vs CSPX', verdict: 'MSCI World (vyspělý svět) vs S&P 500 (jen USA).' },
              { slug: 'vwce-vs-iwda', href: '/srovnani?q=VWCE', label: 'VWCE vs IWDA', verdict: 'All-World (i rozvíjející se trhy) vs MSCI World.' },
              { slug: 'cspx-vs-vuaa', href: '/srovnani?q=VUAA', label: 'CSPX vs VUAA', verdict: 'Dva akumulační S&P 500 fondy – rozhoduje velikost.' },
              { slug: 'cspx-vs-eunl', href: '/srovnani?q=EUNL', label: 'CSPX vs EUNL', verdict: 'USA vs vyspělý svět včetně Evropy a Japonska.' },
              { slug: 'vwce-vs-vwrl', href: '/srovnani?q=VWRL', label: 'VWCE vs VWRL', verdict: 'Stejný index All-World: akumulační vs distribuční.' },
            ].map((d) => (
              <Link key={d.slug} href={`/srovnani/${d.slug}`} className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                <span>
                  <span className="block font-semibold text-slate-900">{d.label}</span>
                  <span className="block text-sm text-slate-600 mt-0.5 leading-snug">{d.verdict}</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href={`/etf/${etf1.isin}`} className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">Detail fondu {t1} <ArrowRight className="w-4 h-4" /></Link>
            <Link href={`/etf/${etf2.isin}`} className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">Detail fondu {t2} <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/nejlepsi-etf/nejlepsi-celosvetove-etf" className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">Celosvětové ETF <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/nejlepsi-etf/nejlepsi-sp500-etf" className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800">S&amp;P 500 ETF <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>

        {/* Zdroj dat – jednou a střídmě */}
        <p className="pb-12 flex items-start gap-1.5 text-xs text-slate-400 leading-relaxed">
          <Database className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
          <span>Data fondů: justETF · kurzy ČNB · data k {datumK}. Píše <Link href="/o-nas" className="underline underline-offset-2 hover:text-slate-600">Tomáš Kostrhoun</Link>, bez placeného pořadí.</span>
        </p>
      </main>

    </div>
  );
}
