import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import { getTopETFsForCategory, categoryConfigs, type ETFBasicInfo , getDataDate } from '@/lib/etf-data';
import {
  TrendingUp, ArrowRight, Trophy, Coins, Layers, Banknote, Scale, ShieldCheck,
  AlertTriangle, Check, X, Info, Database, User, CalendarDays, BadgeCheck,
  Wallet, Crown, Percent, BookOpen, Landmark, Calculator, ArrowUpRight,
  Filter, HelpCircle,
} from 'lucide-react';
import { ter, money, pct, shortName, RankPanel, TickerStrip, SectionHead } from '@/components/design-preview/CategoryUI';
import CompareTable from '@/components/design-preview/CompareTable';
import ReturnValue, { ReturnCurLabel } from '@/components/design-preview/ReturnValue';
import InfoTip from '@/components/design-preview/InfoTip';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Nejlepší S&P 500 ETF 2026: CSPX, VUAA, SPY5 srovnání',
  description:
    'Srovnání 30+ S&P 500 ETF pro české investory. TER od 0,03 %, výnosy v CZK, akum vs dist, daně a jasný verdikt, který koupit.',
};

/* Tickery, které NEJSOU čisté indexové fondy S&P 500 (sektor / Leaders / Screened / Equal Weight / hedged).
   Tyto varianty mají uměle vyšší 1R výnos a v běžném žebříčku klamou. */
const IMPOSTOR_PATTERNS = [
  /information technology|health care|financials|sector/i,
  /leaders|screened|scored|esg|climate|paris/i,
  /equal weight/i,
  /(?<!un)hedged/i, // měnově zajištěné, ale NE "Unhedged" (to je čistý indexový fond, např. SPY5/SPYL)
];
const isImpostor = (e: ETFBasicInfo) => IMPOSTOR_PATTERNS.some((p) => p.test(e.name));

/* Preferované čisté indexové fondy pro hlavní tabulku (v pořadí relevance pro Čecha). */
const CORE_TICKERS = ['CSP1', 'CSPX', 'VUAA', 'SPXP', 'SPY5', 'SPYL', 'VUSA', 'IUSA', 'LYP7', 'I500'];

export default async function CategoryPreview() {
  const all = await getTopETFsForCategory(categoryConfigs['nejlepsi-sp500-etf']);
  const clean = all.filter((e) => !isImpostor(e));

  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  const year = today.getFullYear();

  /* Hlavní tabulka: čisté indexové fondy v preferovaném pořadí, pak doplnit zbytkem podle velikosti. */
  const byTicker = new Map(clean.map((e) => [e.primary_ticker ?? '', e] as const));
  const ordered: ETFBasicInfo[] = [];
  for (const t of CORE_TICKERS) {
    const e = byTicker.get(t);
    if (e && !ordered.includes(e)) ordered.push(e);
  }
  for (const e of clean) if (!ordered.includes(e) && ordered.length < 8) ordered.push(e);
  const mainTable = ordered.slice(0, 8);

  /* Žebříčky */
  const byTer = [...clean].filter((e) => e.ter_numeric != null).sort((a, b) => a.ter_numeric! - b.ter_numeric!).slice(0, 5);
  const bySize = [...clean].sort((a, b) => (b.fund_size_numeric ?? 0) - (a.fund_size_numeric ?? 0)).slice(0, 5);
  // Výkonnostní žebříček – z VŠECH (vč. nečistých), řazeno dle výnosu v Kč (výchozí báze).
  const perfField = (e: ETFBasicInfo) => e.return_1y_czk ?? -999;
  const byPerf = [...all].filter((e) => perfField(e) > -999).sort((a, b) => perfField(b) - perfField(a)).slice(0, 5);

  /* Klíčové metriky pro hero */
  const lowestTer = byTer[0];
  const biggest = bySize[0];
  const perfVals = clean.map((e) => e.return_1y_czk).filter((v): v is number => v != null).sort((a, b) => a - b);
  const medianPerf = perfVals.length ? perfVals[Math.floor(perfVals.length / 2)] : null;

  const find = (t: string) => all.find((e) => e.primary_ticker === t);
  const cspx = find('CSP1') || find('CSPX'); // hlavní tip: akumulační, fyzický, největší
  const spy5 = find('SPY5') || find('SPYL'); // alternativa: nejlevnější
  const vusa = find('VUSA') || find('IUSA'); // alternativa: distribuční (výplata dividend)
  const spxp = find('SPXP') || find('LYP7'); // alternativa: swap (daňově efektivní na US dividendy)

  /* ---------- JSON-LD ---------- */
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Nejlepší S&P 500 ETF',
    itemListElement: mainTable.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'FinancialProduct',
        name: e.name,
        identifier: e.isin,
        feesAndCommissionsSpecification: e.ter_numeric != null ? `${e.ter_numeric} % TER` : undefined,
      },
    })),
  };
  const faqs = [
    {
      q: 'Který S&P 500 ETF je nejlepší pro většinu Čechů?',
      a: `Pro většinu dlouhodobých investorů dává smysl iShares Core S&P 500 (CSPX, ISIN IE00B5BMR087): akumulační, fyzická replikace, největší fond na trhu (${money(cspx?.fund_size_numeric ?? null, cspx?.fund_currency)}) a nízký TER ${ter(cspx?.ter_numeric ?? null)}. Pokud chcete nejnižší možný poplatek, zvažte SPY5/SPYL s TER ${ter(spy5?.ter_numeric ?? null)}.`,
    },
    {
      q: 'Jaký je rozdíl mezi akumulačním a distribučním S&P 500 ETF?',
      a: 'Akumulační ETF (CSPX, VUAA) automaticky reinvestují dividendy uvnitř fondu – ideální pro dlouhodobý růst a jednodušší daňovou evidenci v ČR. Distribuční ETF (VUSA, IUSA, SPY5) vyplácejí dividendy na účet, které musíte uvést v daňovém přiznání.',
    },
    {
      q: 'Který S&P 500 ETF má nejnižší poplatek?',
      a: `Nejnižší TER mají SPY5 a SPYL od State Street se sazbou ${ter(spy5?.ter_numeric ?? null)} ročně. Hned za nimi je Invesco SPXP a swapové fondy Amundi s ${ter(spxp?.ter_numeric ?? null)}.`,
    },
    {
      q: 'Musím jako investor vyplňovat formulář W-8BEN?',
      a: 'Ne. W-8BEN se týká amerických (US-domiciled) ETF. U irských fondů jako CSPX, VUAA nebo SPY5 řeší srážkovou daň správce fondu díky daňové smlouvě Irsko–USA. Jako český retailový investor W-8BEN nevyplňujete.',
    },
    {
      q: 'Kdy je prodej S&P 500 ETF osvobozen od daně?',
      a: 'Podle § 4 zákona o daních z příjmů je zisk z prodeje cenných papírů osvobozen, pokud jste je drželi déle než 3 roky (časový test). Pod hranicí 3 let se zisk daní sazbou 15 %.',
    },
    {
      q: 'Je lepší S&P 500, nebo celosvětový ETF?',
      a: 'S&P 500 nabízí koncentrovanou expozici na 500 největších firem USA (~10 % p.a. historicky), ale 100 % v jedné zemi a měně. MSCI World přidává Evropu, Japonsko a další trhy. Pro maximální diverzifikaci je vhodnější celosvětový fond, pro sázku na USA S&P 500.',
    },
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Header (jazyk z design-preview) */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
            </span>
            ETF průvodce
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

      <TickerStrip etfs={mainTable.slice(0, 6)} />

      <main className="max-w-6xl mx-auto px-4 pb-28">
        {/* Breadcrumb (v produkci dodá Layout) */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/design-preview/zebricky" className="hover:text-slate-600">Nejlepší ETF</Link>
          <span>/</span>
          <span className="text-slate-600">S&amp;P 500 ETF</span>
        </nav>

        {/* HERO – slate-900 panel */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Nejlepší S&amp;P 500 ETF {year}</h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Daty podložený verdikt, který fond koupit – a proč. Hodnotíme {all.length}+ fondů sledujících index
                  S&amp;P 500 podle velikosti, poplatků, replikace a výnosu v korunách.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/design-preview/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                  <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroj: justETF / vlastní databáze</span>
                  <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" /> {all.length} hodnocených fondů</span>
                </div>
                <div className="mt-5 flex gap-2.5">
                  <Link href="#verdikt" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">Náš verdikt</Link>
                  <Link href="#srovnani" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Srovnání všech</Link>
                </div>
              </div>

              {/* Živé klíčové metriky místo dekorace */}
              <div className="mt-6 md:mt-0 md:w-72 shrink-0 grid grid-cols-3 md:grid-cols-1 gap-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Nejnižší TER</p>
                  <p className="text-lg font-bold tabular-nums">{ter(lowestTer?.ter_numeric ?? null)}</p>
                  <p className="text-xs text-slate-400">{lowestTer?.primary_ticker}</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Největší fond</p>
                  <p className="text-lg font-bold tabular-nums">{money(biggest?.fund_size_numeric ?? null, biggest?.fund_currency)}</p>
                  <p className="text-xs text-slate-400">{biggest?.primary_ticker}</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Medián 1R (Kč)</p>
                  <p className="text-lg font-bold tabular-nums text-emerald-400">{pct(medianPerf)}</p>
                  <p className="text-xs text-slate-400">čisté indexové fondy</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VERDIKT / TL;DR */}
        <section id="verdikt" className="pb-10 scroll-mt-16">
          <SectionHead title="Náš verdikt" desc="Co koupit za 10 sekund. Jeden vítěz pro většinu a tři alternativy podle situace." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Trophy className="w-5 h-5" /></span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-teal-700">Volba pro většinu Čechů</p>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">iShares Core S&amp;P 500 — CSPX</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Největší fond na trhu ({money(cspx?.fund_size_numeric ?? null, cspx?.fund_currency)}), akumulační, plně fyzická replikace a nízký TER {ter(cspx?.ter_numeric ?? null)}.
                  Kombinace likvidity, nízkých nákladů a jednoduché daňové evidence z něj dělá bezpečnou výchozí volbu pro dlouhodobé držení.
                </p>
                <Link href={`/design-preview/etf/${cspx?.isin ?? 'IE00B5BMR087'}`} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
                  Detail fondu <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="mt-5 grid sm:grid-cols-3 gap-3">
              {[
                { icon: Wallet, label: 'Chci nejnižší poplatek', etf: spy5, reason: `TER ${ter(spy5?.ter_numeric ?? null)} – nejlevnější na trhu.` },
                { icon: Banknote, label: 'Chci vyplácené dividendy', etf: vusa, reason: 'Distribuční – dividendy chodí na účet, ne reinvestice.' },
                { icon: Layers, label: 'Chci daňově efektivní swap', etf: spxp, reason: 'Syntetická replikace obchází 15% srážkovou daň z US dividend.' },
              ].filter(({ etf }) => etf?.isin).map(({ icon: Icon, label, etf, reason }) => (
                <Link
                  key={label}
                  href={`/design-preview/etf/${etf!.isin}`}
                  className="rounded-lg border border-slate-200 p-4 hover:border-teal-300 hover:shadow-sm transition-all"
                >
                  <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Icon className="w-4 h-4 text-teal-700" /> {label}
                  </span>
                  <p className="mt-1.5 font-semibold text-slate-900">{etf!.primary_ticker ?? '—'}</p>
                  <p className="text-xs text-slate-400">{etf!.isin}</p>
                  <p className="text-xs text-slate-600 mt-1.5 leading-snug">{reason}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CO JE S&P 500 – edukační blok (vizuální) */}
        <section className="pb-10">
          <SectionHead title="Co je index S&P 500?" desc="Krátké vysvětlení, než se pustíte do výběru fondu." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            {/* Lead věta + 3 skenovatelná fakta */}
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong className="text-slate-900">
                <InfoTip label="Koš akcií podle pevných pravidel; S&P 500 = 500 největších veřejně obchodovaných firem v USA.">S&amp;P 500</InfoTip>
              </strong>{' '}
              je akciový index 500 největších veřejně obchodovaných firem v USA – Apple, Microsoft, Nvidia, Amazon a další.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                [Landmark, '500 firem', '~80 % hodnoty US trhu'],
                [TrendingUp, '~7–10 % p.a.', 'historický výnos'],
                [AlertTriangle, 'poklesy i přes −50 %', 'volatilita, výkyvy'],
              ] as [typeof Landmark, string, string][]).map(([Icon, big, sub]) => (
                <div key={big} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3.5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-teal-700 shrink-0 border border-slate-200"><Icon className="w-4 h-4" /></span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-900 text-sm tabular-nums">{big}</span>
                    <span className="block text-xs text-slate-500 leading-tight">{sub}</span>
                  </span>
                </div>
              ))}
            </div>


            {/* 3 pojmy s InfoTip */}
            <p className="mt-6 text-sm text-slate-600 leading-relaxed">Při výběru fondu rozhodují tři věci, které najdete v každém našem srovnání:</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center gap-2 font-medium text-slate-900 text-sm">
                  <Percent className="w-4 h-4 text-teal-700 shrink-0" />
                  <InfoTip label="Total Expense Ratio – roční poplatek za správu fondu, strhává se průběžně z hodnoty investice.">TER</InfoTip>
                </span>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">Roční poplatek za správu – u S&amp;P 500 už od 0,03 %.</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center gap-2 font-medium text-slate-900 text-sm flex-wrap">
                  <Coins className="w-4 h-4 text-teal-700 shrink-0" />
                  <InfoTip label="Fond dividendy automaticky reinvestuje uvnitř – na účet nic nechodí, vhodné pro dlouhodobý růst.">Akumulační</InfoTip>
                  <span className="text-slate-400">/</span>
                  <InfoTip label="Fond vyplácí dividendy na váš účet; v ČR je musíte uvést v daňovém přiznání.">distribuční</InfoTip>
                </span>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">Fond dividendy buď reinvestuje, nebo vyplácí na účet.</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center gap-2 font-medium text-slate-900 text-sm">
                  <Layers className="w-4 h-4 text-teal-700 shrink-0" />
                  <InfoTip label="Způsob, jakým fond kopíruje index: fyzicky drží akcie, nebo to řeší swapem (synteticky).">Replikace</InfoTip>
                </span>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  <InfoTip label="Fond reálně nakupuje akcie z indexu – žádné protistranové riziko.">Fyzická</InfoTip>{' '}
                  (drží reálné akcie) vs.{' '}
                  <InfoTip label="Fond kopíruje index přes smlouvu s bankou; levné a daňově efektivní, ale nese protistranové riziko.">swap</InfoTip>{' '}
                  (syntetická).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* METODIKA */}
        <section className="pb-10">
          <SectionHead title="Jak hodnotíme" desc={`Transparentní metodika žebříčku. Vybíráme z ${all.length} fondů sledujících S&P 500.`} />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Fondy řadíme podle kombinace velikosti aktiv (AUM), nákladovosti (TER), typu replikace (fyzická vs. swap),
              kvality sledování indexu a distribuční politiky. Preferujeme velké, likvidní a levné indexové fondy se sídlem v Irsku.
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
              {([
                [Scale, 'Velikost (AUM)', 'Větší fond = nižší riziko uzavření a lepší likvidita.'],
                [Percent, 'Náklady (TER)', 'Roční poplatek; u S&P 500 se pohybuje 0,03–0,15 %.'],
                [Layers, 'Replikace', 'Fyzická drží reálné akcie; swap nese protistranové riziko.'],
                [Coins, 'Distribuce', 'Akumulační (reinvestice) vs. distribuční (výplata).'],
              ] as [typeof Scale, string, string][]).map(([Icon, t, d]) => (
                <div key={t} className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                  <span><span className="font-medium text-slate-800">{t}.</span> <span className="text-slate-600">{d}</span></span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg bg-amber-50 border border-amber-200 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                <Filter className="w-4 h-4" /> Co z žebříčku vylučujeme
              </p>
              <p className="text-sm text-amber-900/80 mt-1.5 leading-relaxed">
                Databáze i justETF míchají do „S&amp;P 500“ varianty, které sledují něco jiného a mají uměle vyšší výnos.
                Z čistého žebříčku je vyřazujeme: sektorové (iShares S&amp;P 500 Information Technology – IITU),
                „Leaders / Screened / Scored“ (SPPY, SPEP, F500), Equal Weight (XDEW, EWSP) a měnově zajištěné varianty.
                Ve výkonnostním žebříčku níže je necháváme viditelně označené štítkem <span className="font-medium">„nečistý“</span>, aby vás nepletly.
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-3">Zdroj dat: justETF, S&amp;P Dow Jones Indices, ČNB. Aktualizováno {dateStr}.</p>
          </div>
        </section>

        {/* HLAVNÍ SROVNÁVACÍ TABULKA */}
        <section id="srovnani" className="pb-10 scroll-mt-16">
          <SectionHead title="Srovnání hlavních S&P 500 ETF" desc="Největší a nejvýznamnější fondy sledující čistý index S&P 500. Přepněte měnu výnosů." href="/design-preview/srovnani" hrefLabel="srovnat vše" />
          <CompareTable etfs={mainTable} />
        </section>

        {/* ŽEBŘÍČKY PODLE KRITÉRIA */}
        <section className="pb-10">
          <SectionHead title="Žebříčky podle kritéria" desc="Nejlevnější, největší a nejvýkonnější fondy na první pohled." />
          <div className="grid md:grid-cols-3 gap-4">
            <RankPanel
              title="Nejlevnější (TER)"
              subtitle="Roční poplatek za správu"
              rows={byTer.map((e) => ({
                isin: e.isin,
                label: shortName(e.name),
                sub: e.primary_ticker ?? undefined,
                value: <span className="tabular-nums text-sm font-medium text-slate-700">{ter(e.ter_numeric)}</span>,
              }))}
            />
            <RankPanel
              title="Největší (AUM)"
              subtitle="Velikost spravovaných aktiv"
              rows={bySize.map((e) => ({
                isin: e.isin,
                label: shortName(e.name),
                sub: e.primary_ticker ?? undefined,
                value: <span className="tabular-nums text-sm font-medium text-slate-700">{money(e.fund_size_numeric, e.fund_currency)}</span>,
              }))}
            />
            <RankPanel
              title={<>Nejvýkonnější 1R (<ReturnCurLabel />)</>}
              subtitle="Pozor: nečisté varianty označeny"
              rows={byPerf.map((e) => ({
                isin: e.isin,
                label: shortName(e.name),
                sub: e.primary_ticker ?? undefined,
                flagged: isImpostor(e),
                value: <ReturnValue etf={e} period="1y" className="text-sm font-medium" />,
              }))}
            />
          </div>
        </section>

        {/* PŘÍMÉ SOUBOJE */}
        <section className="pb-10">
          <SectionHead title="Přímé souboje fondů" desc="Kdo vyhrává v populárních dvojicích a proč." href="/design-preview/srovnani" hrefLabel="všechna srovnání" />
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { slug: 'cspx-vs-vuaa', href: '/design-preview/srovnani?q=VUAA', label: 'CSPX vs VUAA', verdict: 'CSPX – stejný TER, výrazně větší fond a likvidita.' },
              { slug: 'vusa-vs-vuaa', href: '/design-preview/srovnani?q=VUSA', label: 'VUSA vs VUAA', verdict: 'VUAA pro růst (akum), VUSA pro výplatu dividend.' },
              { slug: 'cspx-vs-spy5', href: '/design-preview/srovnani?q=SPY5', label: 'CSPX vs SPY5', verdict: 'SPY5 levnější (TER 0,03 %), CSPX větší a akumulační.' },
              { slug: 'cspx-vs-vusa', href: '/design-preview/srovnani?q=VUSA', label: 'CSPX vs VUSA', verdict: 'CSPX akumulační, VUSA distribuční – rozhoduje politika.' },
            ].map((d) => (
              <Link
                key={d.slug}
                href={`/design-preview/srovnani/${d.slug}`}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all"
              >
                <span>
                  <span className="block font-semibold text-slate-900">{d.label}</span>
                  <span className="block text-sm text-slate-600 mt-0.5 leading-snug">{d.verdict}</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              </Link>
            ))}
          </div>
        </section>

        {/* AKUM VS DIST + DANĚ */}
        <section className="pb-10">
          <SectionHead title="Akumulační vs. distribuční a české daně" desc="Rozhodující kritérium pro českého investora." />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Layers className="w-4 h-4 text-teal-700" /> Akumulační (CSPX, VUAA)</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Dividendy se reinvestují uvnitř fondu. Na účet nic nepřijde, takže v ČR neřešíte žádnou srážkovou daň ani řádky v přiznání.
                Vhodné pro dlouhodobé budování majetku.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Banknote className="w-4 h-4 text-teal-700" /> Distribuční (VUSA, IUSA, SPY5)</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Dividendy chodí na účet (po 15% srážce na úrovni fondu) a musíte je uvést v daňovém přiznání.
                Vhodné, pokud chcete pravidelný hotovostní příjem.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-left">
                  <th className="py-3 px-4 font-medium">Událost</th>
                  <th className="py-3 px-4 font-medium">Daňový dopad v ČR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr><td className="py-3 px-4">Prodej po 3+ letech držby</td><td className="py-3 px-4">Osvobozeno (§ 4 časový test) – 0 %</td></tr>
                <tr><td className="py-3 px-4">Prodej do 3 let</td><td className="py-3 px-4">Daň 15 % ze zisku</td></tr>
                <tr><td className="py-3 px-4">Dividenda u distribučního ETF</td><td className="py-3 px-4">15 % sraženo fondem, uvést v přiznání</td></tr>
                <tr><td className="py-3 px-4">Irský domicil (CSPX, VUAA)</td><td className="py-3 px-4">W-8BEN nevyplňujete – řeší správce fondu</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* JE TO PRO VÁS? */}
        <section className="pb-10">
          <SectionHead title="Je S&P 500 pro vás?" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-emerald-700 flex items-center gap-2"><Check className="w-4 h-4" /> Vhodné, pokud</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {['Investujete na 10+ let a unesete pokles −30 až −50 %', 'Věříte dlouhodobému růstu americké ekonomiky', 'Chcete jednoduchou pasivní strategii buy & hold', 'Stačí vám jeden fond pokrývající 500 firem'].map((t) => (
                  <li key={t} className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-red-700 flex items-center gap-2"><X className="w-4 h-4" /> Spíš nevhodné, pokud</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />Potřebujete peníze do 5 let</li>
                <li className="flex items-start gap-2"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />Chcete globální diverzifikaci → <Link href="/design-preview/nejlepsi-etf/nejlepsi-msci-world-etf" className="text-teal-700 hover:underline ml-1">MSCI World</Link></li>
                <li className="flex items-start gap-2"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />Hledáte pravidelný příjem → <Link href="/design-preview/nejlepsi-etf/nejlepsi-dividendove-etf" className="text-teal-700 hover:underline ml-1">dividendové ETF</Link></li>
                <li className="flex items-start gap-2"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />Máte velmi nízkou toleranci k riziku</li>
              </ul>
            </div>
          </div>
        </section>

        {/* RIZIKA */}
        <section className="pb-10">
          <SectionHead title="Rizika S&P 500" desc="Upřímně a s čísly – co může jít špatně." />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Coins, t: 'Měnové riziko USD/CZK', d: 'Index je v USD. Když S&P vzroste o 10 %, ale CZK posílí o 15 %, váš výnos v CZK je ≈ −4,3 %.' },
              { icon: Landmark, t: '100% expozice na USA', d: 'Jedna země, jedna měna, jeden trh. Žádná expozice na Evropu, Japonsko ani rozvíjející se trhy.' },
              { icon: AlertTriangle, t: 'Koncentrace top 10', d: 'Top 10 firem (Apple, Microsoft, Nvidia…) tvoří ~30 % indexu. Tech sektor dominuje.' },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600 mb-3"><Icon className="w-4 h-4" /></span>
                <p className="font-medium text-slate-900 text-sm">{t}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-left">
                  <th className="py-3 px-4 font-medium">Krize</th>
                  <th className="py-3 px-4 font-medium text-right">Pokles</th>
                  <th className="py-3 px-4 font-medium">Čas obnovy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr><td className="py-3 px-4">Dot-com (2000–2002)</td><td className="py-3 px-4 text-right tabular-nums text-red-600">−49 %</td><td className="py-3 px-4">~7 let</td></tr>
                <tr><td className="py-3 px-4">Finanční krize (2007–2009)</td><td className="py-3 px-4 text-right tabular-nums text-red-600">−57 %</td><td className="py-3 px-4">~5,5 roku</td></tr>
                <tr><td className="py-3 px-4">COVID-19 (2020)</td><td className="py-3 px-4 text-right tabular-nums text-red-600">−34 %</td><td className="py-3 px-4">~5 měsíců</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* JAK KOUPIT */}
        <section className="pb-10">
          <SectionHead title="Jak koupit" desc="Čtyři kroky od registrace k první akcii." href="/design-preview/kde-koupit" hrefLabel="srovnání brokerů" />
          <div className="grid sm:grid-cols-4 gap-3">
            {[
              ['1', 'Vyberte brokera', 'DEGIRO, XTB nebo Interactive Brokers.'],
              ['2', 'Ověření a vklad', 'Registrace a převod peněz (1–3 dny).'],
              ['3', 'Najděte fond', 'Zadejte ISIN CSPX: IE00B5BMR087.'],
              ['4', 'Nákup', 'Limit order, zkontrolujte spread, koupit.'],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold">{n}</span>
                <p className="font-medium text-slate-900 text-sm mt-2.5">{t}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
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
          <SectionHead title="Časté dotazy" />
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
              [Crown, '12 let praxe ve financích', 'Obsah od jmenného autora, ne anonymně.'],
              [Database, 'Aktuální data', `Z justETF a vlastní DB, aktualizováno ${dateStr}.`],
            ] as [typeof ShieldCheck, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Icon className="w-5 h-5" /></span>
                <span><span className="block font-semibold text-sm text-slate-900">{t}</span><span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">{d}</span></span>
              </div>
            ))}
          </div>
        </section>

        {/* INTERNÍ PROLINKOVÁNÍ */}
        <section className="pb-10">
          <SectionHead title="Pokračujte dál" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {([
              ['/design-preview/nejlepsi-etf/nejlepsi-msci-world-etf', 'MSCI World ETF', BookOpen],
              ['/design-preview/nejlepsi-etf/nejlepsi-nasdaq-etf', 'NASDAQ 100 ETF', TrendingUp],
              ['/design-preview/nejlepsi-etf/nejlepsi-dividendove-etf', 'Dividendové ETF', Banknote],
              ['/design-preview/nejlepsi-etf/nejlevnejsi-etf', 'Nejlevnější ETF', Wallet],
              ['/design-preview/kde-koupit', 'Kde koupit ETF', Landmark],
              ['/design-preview/kalkulacka', 'Kalkulačka poplatků', Calculator],
            ] as [string, string, typeof BookOpen][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* E-E-A-T patička: zdroje + autor + disclaimer */}
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
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroje: justETF, S&amp;P Dow Jones Indices, ČNB. Aktualizováno {dateStr}.</p>
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
