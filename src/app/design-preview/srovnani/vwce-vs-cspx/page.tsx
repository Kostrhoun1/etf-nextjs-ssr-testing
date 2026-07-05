import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import { getComparisonETFData, type ComparisonETF , getDataDate } from '@/lib/etf-data';
import {
  TrendingUp, ArrowRight, ArrowUpRight, Trophy, Scale, Layers, Coins,
  ShieldCheck, AlertTriangle, Check, Info, Database, User, CalendarDays,
  BadgeCheck, Wallet, Landmark, Calculator, BookOpen, HelpCircle, Globe2,
  Building2, Percent, ArrowLeftRight,
} from 'lucide-react';
import { ter, dist } from '@/components/design-preview/CategoryUI';
import InfoTip from '@/components/design-preview/InfoTip';
import { SrovnaniSoubojKarta } from '@/components/design-preview/SrovnaniCompareUI';
import SrovnaniParams from '@/components/design-preview/SrovnaniParams';

export const revalidate = 86400;

/* Pilot: VWCE vs CSPX. V produkci by ticker1/ticker2 přišly z URL slugu. */
const TICKER1 = 'VWCE';
const TICKER2 = 'CSPX';
const CANONICAL = 'https://www.etfpruvodce.cz/srovnani-etf/vwce-vs-cspx';

export const metadata: Metadata = {
  title: 'VWCE vs CSPX: srovnání 2026 a které ETF koupit',
  description:
    'VWCE (TER 0,19 %, 3 700+ firem celého světa) vs CSPX (TER 0,07 %, 500 firem USA). Srovnání pro Čechy: daně, měnové riziko, verdikt který koupit.',
  alternates: { canonical: CANONICAL },
};

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
  const t1 = etf1.primary_ticker ?? TICKER1;
  const t2 = etf2.primary_ticker ?? TICKER2;

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
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://www.etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Srovnání ETF', item: 'https://www.etfpruvodce.cz/srovnani-etf' },
      { '@type': 'ListItem', position: 3, name: `${t1} vs ${t2}`, item: CANONICAL },
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
          <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
            </span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/design-preview/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/design-preview/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/design-preview/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/design-preview/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb (v produkci dodá Layout) */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/design-preview/srovnani" className="hover:text-slate-600">Srovnání ETF</Link>
          <span>/</span>
          <span className="text-slate-600">{t1} vs {t2}</span>
        </nav>

        {/* HERO – slate-900 panel, verdikt-first */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                {t1} vs {t2}: které ETF koupit?
              </h1>
              <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                Souboj dvou nejoblíbenějších fondů u českých investorů. {t1} sází na{' '}
                <strong className="text-white">celý svět</strong> ({holdings1?.toLocaleString('cs-CZ') ?? 'tisíce'} firem),
                {' '}{t2} na <strong className="text-white">500 největších firem USA</strong>.
                Porovnáváme poplatky, expozici, daně v ČR i měnové riziko – a říkáme, komu sedí který.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                  <Link href="/design-preview/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                </span>
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroj: justETF / vlastní databáze</span>
                <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" /> Data k dnešnímu dni</span>
              </div>
            </div>

            {/* Souboj-karty obou fondů */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-3">
              <SrovnaniSoubojKarta etf={etf1} podtitul="Celý svět" accent="teal" />
              <div className="hidden sm:flex items-center justify-center shrink-0">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-slate-300 text-xs font-bold">vs</span>
              </div>
              <SrovnaniSoubojKarta etf={etf2} podtitul="USA – 500 firem" accent="sky" />
            </div>

            <div className="mt-5 flex gap-2.5">
              <Link href="#verdikt" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">Náš verdikt</Link>
              <Link href="#parametry" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Tabulka parametrů</Link>
            </div>
          </div>
        </section>

        {/* VERDIKT */}
        <section id="verdikt" className="pb-10 scroll-mt-16">
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
              <Link href={`/design-preview/etf/${etf1.isin}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
                Detail fondu {t1} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Větev 2 – CSPX / USA */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 text-slate-700 shrink-0"><Landmark className="w-5 h-5" /></span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-700">Pro sázku na USA</p>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{t2} — 500 firem USA, nejnižší poplatek</h3>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Koncentrovaná expozice na {holdings2?.toLocaleString('cs-CZ') ?? '500'} největších amerických firem (Apple, Microsoft, Nvidia…).
                Nižší TER {ter(etf2.ter_numeric)} a historicky vyšší výnos – ale 100 % v jedné zemi a měně.
                Vhodné, když cíleně věříte americkému trhu a unesete vyšší koncentraci.
              </p>
              <Link href={`/design-preview/etf/${etf2.isin}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
                Detail fondu {t2} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-teal-50 border border-teal-200 p-4 flex items-start gap-2.5">
            <Trophy className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
            <p className="text-sm text-teal-900/90 leading-relaxed">
              <strong>Shrnutí:</strong> Nejde o to, který fond je „lepší“ – {t1} a {t2} řeší jinou potřebu.
              Chcete jeden globální fond a klid? {t1}. Věříte konkrétně americkým firmám a chcete nejnižší poplatek? {t2}.
              Daně ani výplata dividend vás v rozhodování nemusí trápit – jsou u obou stejné.
            </p>
          </div>
        </section>

        {/* CO SE VLASTNĚ POROVNÁVÁ – edukace 7b */}
        <section className="pb-10">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Co se vlastně porovnává</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Než se rozhodnete, pár pojmů, na kterých srovnání stojí.
            </p>
          </div>

          {/* Diverzifikace vs koncentrace – VIZUÁLNÍ schéma (počty firem) */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-700" />
              <InfoTip label="Rozložení peněz mezi víc firem, zemí a měn, aby propad jednoho trhu neohrozil celé portfolio.">
                Diverzifikace
              </InfoTip>
              <span className="text-slate-400">vs.</span>
              <InfoTip label="Soustředění investice do jednoho trhu nebo regionu; vyšší potenciál výnosu i vyšší riziko.">
                koncentrace
              </InfoTip>
            </h3>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {/* VWCE – celý svět, segmenty regionů */}
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
                    <Globe2 className="w-4 h-4" /> {t1}
                  </span>
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">{holdings1?.toLocaleString('cs-CZ') ?? '3 741'}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">firem napříč regiony</p>
                {/* Pruh rozdělený na orientační segmenty regionů */}
                <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full" role="img" aria-label="Rozložení napříč USA, Evropou, Japonskem a rozvíjejícími se trhy">
                  <span className="bg-teal-700" style={{ width: '62%' }} title="USA" />
                  <span className="bg-teal-500" style={{ width: '17%' }} title="Evropa" />
                  <span className="bg-teal-400" style={{ width: '11%' }} title="Japonsko" />
                  <span className="bg-teal-300" style={{ width: '10%' }} title="Rozvíjející se trhy" />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-700" /> USA</span>
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500" /> Evropa</span>
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400" /> Japonsko</span>
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-300" /> Rozvíjející se</span>
                </div>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">Když zaostane USA, mohou táhnout Evropa nebo Asie.</p>
              </div>

              {/* CSPX – jen USA, jeden plný pruh */}
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    <Landmark className="w-4 h-4" /> {t2}
                  </span>
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">{holdings2?.toLocaleString('cs-CZ') ?? '503'}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">firem, jeden trh</p>
                {/* Jeden plný pruh = 100 % USA */}
                <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full" role="img" aria-label="100 % USA">
                  <span className="bg-slate-600 w-full" title="USA" />
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600" /> 100 % USA</span>
                </div>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">Vše stojí a padá s jednou ekonomikou a s dolarem.</p>
              </div>
            </div>

            {/* Společný poměrový pruh – kolikrát víc firem drží VWCE */}
            {holdings1 != null && holdings2 != null && holdings1 > 0 && holdings2 > 0 && (
              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-600">Poměr počtu firem</p>
                <div className="mt-2 relative h-7 w-full overflow-hidden rounded-md bg-teal-100">
                  <div className="absolute inset-y-0 left-0 bg-teal-700 flex items-center px-2" style={{ width: '100%' }}>
                    <span className="text-[11px] font-semibold text-white tabular-nums">{t1} · {holdings1.toLocaleString('cs-CZ')}</span>
                  </div>
                  <div className="absolute inset-y-0 left-0 bg-slate-700 flex items-center px-2 rounded-r-md" style={{ width: `${Math.max((holdings2 / holdings1) * 100, 8)}%` }}>
                    <span className="text-[11px] font-semibold text-white tabular-nums">{t2} · {holdings2.toLocaleString('cs-CZ')}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {t1} drží zhruba <strong className="text-slate-700 tabular-nums">{(holdings1 / holdings2).toFixed(1).replace('.', ',')}×</strong> více firem než {t2}.
                </p>
              </div>
            )}
          </div>

          {/* Pojmy v mřížce – vizuální legenda, popis schovaný do InfoTipu */}
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {([
              [Percent, 'TER', 'Roční poplatek za správu fondu; strhává se průběžně z majetku, ne zvlášť z účtu.', 'Roční poplatek fondu'],
              [Layers, 'Akumulační vs. distribuční', 'Akumulační reinvestuje dividendy uvnitř fondu, distribuční je vyplácí na účet.', 'Co fond dělá s dividendami'],
              [ArrowLeftRight, 'Replikace', 'Způsob, jak fond kopíruje index: fyzicky drží akcie, nebo je nahrazuje swapem přes protistranu.', 'Jak fond kopíruje index'],
              [Building2, 'Domicil', 'Sídlo fondu; irský domicil znamená, že český investor nevyplňuje americký formulář W-8BEN.', 'Sídlo fondu'],
            ] as [typeof Percent, string, string, string][]).map(([Icon, t, tip, oneLiner]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 mb-2.5"><Icon className="w-4 h-4" /></span>
                <p className="font-medium text-slate-900 text-sm">
                  <InfoTip label={tip}>{t}</InfoTip>
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{oneLiner}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TABULKA PARAMETRŮ */}
        <section id="parametry" className="pb-10 scroll-mt-16">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Srovnání parametrů</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Klíčové hodnoty obou fondů vedle sebe. Výnosy si přepněte do měny podle sebe –
              <strong> ve výchozím stavu do korun</strong> (jak je pocítí český investor). Zelené pole = výhodnější hodnota v daném řádku.
            </p>
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
                  `Chcete nejnižší poplatek (TER ${ter(etf2.ter_numeric)})`,
                  'Unesete 100% expozici na USA a koncentraci do top firem',
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
              <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">Čtyři kroky od registrace k první akcii.</p>
            </div>
            <Link href="/design-preview/kde-koupit" className="text-sm text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 shrink-0">
              srovnání brokerů <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-4 gap-3">
            {[
              ['1', 'Vyberte brokera', 'DEGIRO, XTB nebo Interactive Brokers – srovnání poplatků níže.'],
              ['2', 'Ověření a vklad', 'Registrace, ověření totožnosti a převod peněz (1–3 dny).'],
              ['3', 'Najděte fond podle ISIN', `${t1}: ${etf1.isin} · ${t2}: ${etf2.isin}`],
              ['4', 'Nákup', 'Zadejte limitní pokyn, zkontrolujte rozpětí ceny a potvrďte.'],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold">{n}</span>
                <p className="font-medium text-slate-900 text-sm mt-2.5">{t}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {['DEGIRO', 'XTB', 'Interactive Brokers'].map((b) => (
              <Link key={b} href="/design-preview/kde-koupit" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors">{b}</Link>
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
              [ShieldCheck, 'Nezávislé srovnání', 'Žádné placené pořadí ani reklamní žebříček.'],
              [BadgeCheck, 'Aktuální data z DB', `Parametry obou fondů k ${dateStr}.`],
              [Database, 'Doložené zdroje', 'justETF, S&P Dow Jones Indices, FTSE Russell, ČNB.'],
            ] as [typeof ShieldCheck, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Icon className="w-5 h-5" /></span>
                <span><span className="block font-semibold text-sm text-slate-900">{t}</span><span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">{d}</span></span>
              </div>
            ))}
          </div>
        </section>

        {/* PROLINKOVÁNÍ */}
        <section className="pb-10">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Pokračujte dál</h2>
          </div>

          {/* Další souboje */}
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">Další oblíbené souboje</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {[
              { slug: 'iwda-vs-cspx', href: '/design-preview/srovnani?q=IWDA', label: 'IWDA vs CSPX', verdict: 'MSCI World (vyspělý svět) vs S&P 500 (jen USA).' },
              { slug: 'vwce-vs-iwda', href: '/design-preview/srovnani?q=VWCE', label: 'VWCE vs IWDA', verdict: 'All-World (i rozvíjející se trhy) vs MSCI World.' },
              { slug: 'cspx-vs-vuaa', href: '/design-preview/srovnani?q=VUAA', label: 'CSPX vs VUAA', verdict: 'Dva akumulační S&P 500 fondy – rozhoduje velikost.' },
              { slug: 'cspx-vs-eunl', href: '/design-preview/srovnani?q=EUNL', label: 'CSPX vs EUNL', verdict: 'USA vs vyspělý svět včetně Evropy a Japonska.' },
              { slug: 'vwce-vs-vwrl', href: '/design-preview/srovnani?q=VWRL', label: 'VWCE vs VWRL', verdict: 'Stejný index All-World: akumulační vs distribuční.' },
            ].map((d) => (
              <Link key={d.slug} href={`/design-preview/srovnani/${d.slug}`} className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                <span>
                  <span className="block font-semibold text-slate-900">{d.label}</span>
                  <span className="block text-sm text-slate-600 mt-0.5 leading-snug">{d.verdict}</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              </Link>
            ))}
          </div>

          {/* Kategorie, detaily, nástroje */}
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">Kategorie a nástroje</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {([
              ['/design-preview/nejlepsi-etf/nejlepsi-sp500-etf', 'Nejlepší S&P 500 ETF', Landmark],
              ['/design-preview/nejlepsi-etf/nejlepsi-celosvetove-etf', 'Celosvětové ETF', Globe2],
              [`/design-preview/etf/${etf1.isin}`, `Detail ${t1}`, BookOpen],
              [`/design-preview/etf/${etf2.isin}`, `Detail ${t2}`, BookOpen],
              ['/design-preview/kde-koupit', 'Kde koupit ETF', Wallet],
              ['/design-preview/kalkulacka', 'Kalkulačka poplatků', Calculator],
            ] as [string, string, typeof BookOpen][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* E-E-A-T patička: autor + zdroje + disclaimer */}
        <section className="pb-12">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Srovnání píšeme nezávisle, na základě veřejných dat – bez placeného pořadí.
                  <Link href="/design-preview/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroje: justETF, S&amp;P Dow Jones Indices, FTSE Russell, ČNB. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Obsah má vzdělávací charakter a nepředstavuje investiční doporučení. Minulá výkonnost nezaručuje budoucí výnosy. Investice do ETF nesou riziko ztráty.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">ETF průvodce.cz</span>
          <p className="max-w-md text-center sm:text-right leading-relaxed">Obsah má vzdělávací charakter a nepředstavuje investiční doporučení. Minulá výkonnost nezaručuje budoucí výnosy.</p>
        </div>
      </footer>
    </div>
  );
}
