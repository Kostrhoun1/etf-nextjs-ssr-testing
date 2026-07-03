import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, ArrowUpRight, Check, X, AlertTriangle, Info,
  ShieldCheck, Wallet, Landmark, Banknote, Percent, Layers, Coins,
  User, CalendarDays, Database, BadgeCheck, HelpCircle, BookOpen,
  Building2, Globe, Smartphone, Scale, Calculator, FileText, ListChecks,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InfoTip from '@/components/design-preview/InfoTip';
import { degiroOverall } from '@/components/design-preview/BrokerScore';
import BrokerScoreGrid from '@/components/design-preview/BrokerScoreGrid';
import BrokerFeeTable from '@/components/design-preview/BrokerFeeTable';
import BrokerStickyCTA from '@/components/design-preview/BrokerStickyCTA';

export const revalidate = 86400;

const YEAR = new Date().getFullYear();
const AFFILIATE_HREF = 'https://www.degiro.cz';

export const metadata: Metadata = {
  title: `Recenze DEGIRO ${YEAR}: poplatky, daně a verdikt ${degiroOverall}/100`,
  description:
    `Nezávislá recenze DEGIRO ${YEAR} pro české investory. Hodnocení ${degiroOverall}/100, poplatky za ETF (1 EUR Core), 35% daň z CZ dividend a vratka, vklady v Kč a poctivé pro koho ANO/NE.`,
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.etfpruvodce.cz/degiro-recenze' },
};

export default function BrokerReviewPreview() {
  const today = new Date();
  const dateStr = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  /* ---------- Rychlá fakta ---------- */
  const facts: { icon: typeof Wallet; label: ReactNode; value: string }[] = [
    {
      icon: Wallet,
      label: (
        <InfoTip label="Pevná částka za jeden nákupní nebo prodejní pokyn, nezávislá na objemu obchodu.">
          Poplatek za ETF
        </InfoTip>
      ),
      value: '1 EUR Core / 3 EUR ostatní',
    },
    { icon: Coins, label: 'Konverze CZK/EUR', value: 'Zdarma' },
    { icon: Banknote, label: 'Minimální vklad', value: '0 EUR' },
    {
      icon: ShieldCheck,
      label: (
        <InfoTip label="Dozorové úřady, které dohlížejí na brokera a chrání klienty; BaFin je německý, DNB/AFM nizozemský regulátor.">
          Regulace
        </InfoTip>
      ),
      value: 'BaFin, DNB/AFM',
    },
    {
      icon: Landmark,
      label: (
        <InfoTip label="Záruční systém, který vám vyplatí hotovost na účtu (do 100 000 EUR) i v případě úpadku banky.">
          Ochrana hotovosti
        </InfoTip>
      ),
      value: '100 000 EUR',
    },
    {
      icon: Layers,
      label: (
        <InfoTip label="Možnost koupit i zlomek jedné akcie ETF, takže investujete přesnou částku bez ohledu na cenu celého kusu.">
          Frakční ETF
        </InfoTip>
      ),
      value: 'Nepodporuje',
    },
  ];

  /* ---------- Modelový výpočet nákladů (CZK) ---------- */
  // 1 EUR ≈ 25 Kč; 3 EUR ≈ 75 Kč (ilustrativní kurz pro českého čtenáře)
  const coreMonthlyCzk = 25;
  const otherMonthlyCzk = 75;

  /* ---------- FAQ ---------- */
  const faqs = [
    {
      q: 'Je DEGIRO bezpečné?',
      a: 'Ano. DEGIRO je součástí banky flatexDEGIRO Bank AG regulované německým BaFin a nizozemským DNB/AFM. Hotovost na účtu kryje záruční systém do 100 000 EUR, investiční nástroje jsou drženy odděleně od majetku brokera. Z hlediska regulace a ochrany patří DEGIRO k bezpečným volbám.',
    },
    {
      q: 'Jaké jsou poplatky DEGIRO za ETF?',
      a: 'ETF ze seznamu Core Selection (~200+ vybraných fondů) stojí 1 EUR za pokyn, ostatní ETF 3 EUR. K tomu se přičítá roční poplatek 2,50 EUR za každou cizí burzu, kde v daném roce obchodujete. Vedení účtu je zdarma, vklady a výběry v korunách bez poplatku.',
    },
    {
      q: 'Jak se daní zisky z DEGIRO v ČR?',
      a: 'Zisk z prodeje ETF je osvobozen po 3 letech držby (časový test), případně pokud roční objem prodejů nepřesáhne 100 000 Kč (hodnotový test). Pod těmito limity se zisk daní sazbou 15 %. U dividend českých akcií DEGIRO sráží 35 %, část (20 %) lze získat zpět v daňovém přiznání. U amerických dividend uvnitř irských ETF (CSPX, VWCE…) je 15 % sraženo už na úrovni fondu díky daňové smlouvě Irsko–USA — jako český investor v irských ETF formulář W-8BEN nevyplňujete.',
    },
    {
      q: 'Podporuje DEGIRO frakční ETF?',
      a: 'Ne. U DEGIRO nakupujete vždy celé kusy ETF. Pokud chcete investovat menší pravidelné částky přesně (například 1 000 Kč měsíčně), zvažte brokera s frakčním investováním, jako je Trading 212 nebo XTB.',
    },
  ];

  /* ---------- JSON-LD ---------- */
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'FinancialService',
      name: 'DEGIRO',
      url: 'https://www.degiro.cz',
    },
    author: { '@type': 'Person', name: 'Tomáš Kostrhoun' },
    publisher: { '@type': 'Organization', name: 'ETF průvodce.cz' },
    datePublished: `${YEAR}-01-01`,
    dateModified: today.toISOString().slice(0, 10),
    reviewRating: {
      '@type': 'Rating',
      ratingValue: degiroOverall,
      bestRating: 100,
      worstRating: 0,
    },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://www.etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Kde koupit ETF', item: 'https://www.etfpruvodce.cz/kde-koupit-etf' },
      { '@type': 'ListItem', position: 3, name: 'Recenze DEGIRO', item: 'https://www.etfpruvodce.cz/degiro-recenze' },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Jak si založit účet u DEGIRO',
    step: [
      { '@type': 'HowToStep', name: 'Registrace přes web', text: 'Vyplňte registrační formulář, připravte si občanku nebo pas a daňové identifikační číslo.' },
      { '@type': 'HowToStep', name: 'Ověření totožnosti', text: 'Doložte totožnost a projděte ověřením podle pravidel proti praní špinavých peněz.' },
      { '@type': 'HowToStep', name: 'První vklad v korunách', text: 'Pošlete peníze bankovním převodem v Kč, minimální vklad je 0 EUR.' },
      { '@type': 'HowToStep', name: 'Vyhledání ETF', text: 'Najděte fond podle ISIN a ověřte, zda patří do Core Selection (nižší poplatek).' },
      { '@type': 'HowToStep', name: 'Zadání pokynu', text: 'Zadejte nákupní pokyn, zkontrolujte poplatek a potvrďte obchod.' },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased pb-16 md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      {/* Header */}
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
          <Link href="/design-preview/srovnani-brokeru" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Srovnat brokery</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/design-preview/kde-koupit" className="hover:text-slate-600">Kde koupit ETF</Link>
          <span>/</span>
          <span className="text-slate-600">Recenze DEGIRO</span>
        </nav>

        {/* HERO – verdikt-first */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-stretch md:justify-between gap-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-white text-slate-900 font-bold text-sm shrink-0">
                    <Building2 className="w-6 h-6 text-teal-700" />
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-teal-300">Recenze brokera</span>
                </div>
                <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight leading-tight">Recenze DEGIRO {YEAR}</h1>
                <p className="mt-2 text-base font-medium text-white">Dobrá volba pro levné dlouhodobé ETF investování.</p>
                <p className="mt-2.5 text-slate-300 text-sm md:text-base leading-relaxed">
                  <span className="text-white font-medium">Ano</span>, pokud chcete levně nakupovat ETF z Core Selection,
                  vkládat peníze v korunách a mít v zádech banku pod evropskou regulací.{' '}
                  <span className="text-white font-medium">Spíš ne</span>, pokud potřebujete frakční investování,
                  českou podporu 24/7 nebo investujete do českých dividendových akcií (35% srážka).
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/design-preview/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                  <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" /> Jednotná metodika pro všechny brokery</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <a
                    href={AFFILIATE_HREF}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500 inline-flex items-center gap-1.5"
                  >
                    Otevřít účet u DEGIRO <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <Link href="#poplatky" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Přejít na poplatky</Link>
                </div>
              </div>

              {/* Skóre panel */}
              <div className="mt-6 md:mt-0 md:w-64 shrink-0 flex">
                <div className="w-full rounded-xl bg-white/5 border border-white/10 px-5 py-6 flex flex-col items-center justify-center text-center">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Celkové hodnocení</p>
                  <p className="mt-1 text-5xl font-bold tabular-nums leading-none">
                    {degiroOverall}<span className="text-xl font-medium text-slate-400">/100</span>
                  </p>
                  <p className="mt-2 text-sm font-medium text-teal-300">Dobrá volba</p>
                  <Link href="#hodnoceni" className="mt-3 text-xs text-slate-300 hover:text-white inline-flex items-center gap-1">
                    Z čeho se skóre skládá <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RYCHLÁ FAKTA */}
        <section className="pb-10">
          <SectionHead title="Rychlá fakta" desc="Nejdůležitější parametry na jeden pohled, bez scrollování celé recenze." />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Icon className="w-4 h-4 text-teal-700" /> {label}
                </span>
                <p className="mt-1.5 font-semibold text-slate-900 text-sm leading-snug">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AFFILIATE DISCLOSURE */}
        <section className="pb-10">
          <div className="rounded-lg border border-slate-200 bg-white p-4 md:p-5 flex items-start gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-500 shrink-0"><Info className="w-4 h-4" /></span>
            <div className="text-sm text-slate-600 leading-relaxed">
              <p className="font-medium text-slate-900">Transparentně k odkazům</p>
              <p className="mt-1">
                Pokud si přes náš odkaz založíte účet, můžeme dostat provizi. Neovlivňuje to hodnocení ani výši poplatků
                pro vás – skóre stavíme na datech a stejnou metodikou hodnotíme všechny brokery.{' '}
                <Link href="/design-preview/srovnani-brokeru" className="text-teal-700 hover:underline">Jak hodnotíme brokery</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* HODNOCENÍ – dílčí skóre */}
        <section id="hodnoceni" className="pb-10 scroll-mt-16">
          <SectionHead title="Z čeho se skládá skóre 79/100" desc="Šest kritérií s váhami. Celkové číslo je jejich vážený průměr – stejné v heru i v závěru." />
          <BrokerScoreGrid />
        </section>

        {/* VÝHODY A NEVÝHODY */}
        <section className="pb-10">
          <SectionHead title="Výhody a nevýhody" desc="Co DEGIRO umí dobře a kde naráží – s konkrétními čísly." />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-emerald-700 flex items-center gap-2"><Check className="w-4 h-4" /> Výhody</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  'ETF z Core Selection za 1 EUR (~200+ zvýhodněných fondů)',
                  'Vklady a výběry v korunách zdarma, konverze CZK/EUR bez poplatku',
                  'Banka flatexDEGIRO pod regulací BaFin a DNB/AFM, ochrana 100 000 EUR',
                  'Široká nabídka 3000+ UCITS ETF a přístup na 31 burz',
                  'Minimální vklad 0 EUR – začnete s libovolnou částkou',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-red-700 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Nevýhody</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  'Nepodporuje frakční ETF – nakupujete vždy celé kusy',
                  'Vyšší zdanění dividend českých akcií: 35 % (vratku 20 % řešíte v přiznání)',
                  'Česká podpora jen 9–17 v pracovní dny, ne 24/7',
                  'Roční poplatek 2,50 EUR za každou cizí burzu, kde obchodujete',
                  'Některé US ETF nejsou dostupné kvůli chybějící KID dokumentaci (PRIIPS)',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* POPLATKY – detail */}
        <section id="poplatky" className="pb-10 scroll-mt-16">
          <SectionHead title="Poplatky DEGIRO" desc="Kompletní přehled nákladů. Co je manipulační poplatek a co Core Selection vysvětlujeme rovnou u tabulky." />

          {/* Edukace: schéma cesty poplatku za ETF (boxy + šipky) */}
          <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 md:p-5">
            <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-teal-700" /> Kolik zaplatíte za jeden pokyn
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {/* Vstupní box */}
              <div className="flex flex-col sm:flex-row sm:items-stretch gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 sm:w-44 shrink-0">
                  <Wallet className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-900">Nákup ETF</span>
                </div>
                <div className="hidden sm:flex items-center text-slate-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
                {/* Dvě větve */}
                <div className="flex-1 grid sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-3">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <Layers className="w-3.5 h-3.5 text-teal-700" />
                      <InfoTip label="Seznam zhruba 200+ vybraných ETF (včetně fondů na S&P 500 nebo MSCI World) se zvýhodněným poplatkem 1 EUR za pokyn.">
                        Core Selection
                      </InfoTip>
                    </p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">1 EUR<span className="text-xs font-medium text-slate-400"> / pokyn</span></p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <Layers className="w-3.5 h-3.5 text-slate-400" /> Mimo seznam
                    </p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">3 EUR<span className="text-xs font-medium text-slate-400"> / pokyn</span></p>
                  </div>
                </div>
              </div>
              {/* Připomínka ročního poplatku za burzu */}
              <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
                <Landmark className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                <span>
                  K tomu <span className="font-medium text-slate-800 tabular-nums">2,50 EUR ročně</span> za každou cizí burzu, kde v daném roce obchodujete. Výše{' '}
                  <InfoTip label="Pevný poplatek za zpracování jednoho pokynu, u DEGIRO 1 EUR (Core) nebo 3 EUR.">manipulačního poplatku</InfoTip>{' '}
                  nezávisí na objemu obchodu.
                </span>
              </div>
            </div>
          </div>

          <BrokerFeeTable />

          {/* Modelový výpočet v Kč */}
          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50/50 p-5">
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2"><Calculator className="w-4 h-4 text-teal-700" /> Modelový výpočet nákladů v korunách</p>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Pravidelný měsíční nákup jednoho ETF (ilustrativní kurz 1 EUR ≈ 25 Kč):
            </p>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              <div className="rounded-lg bg-white border border-slate-200 p-4">
                <p className="text-xs text-slate-500">ETF z Core Selection</p>
                <p className="mt-0.5 text-xl font-bold tabular-nums text-slate-900">~{coreMonthlyCzk} Kč<span className="text-sm font-medium text-slate-400"> / měsíc</span></p>
                <p className="text-xs text-slate-500 mt-1">≈ {coreMonthlyCzk * 12} Kč ročně za 12 nákupů</p>
              </div>
              <div className="rounded-lg bg-white border border-slate-200 p-4">
                <p className="text-xs text-slate-500">ETF mimo Core Selection</p>
                <p className="mt-0.5 text-xl font-bold tabular-nums text-slate-900">~{otherMonthlyCzk} Kč<span className="text-sm font-medium text-slate-400"> / měsíc</span></p>
                <p className="text-xs text-slate-500 mt-1">≈ {otherMonthlyCzk * 12} Kč ročně za 12 nákupů</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Volbou fondu z Core Selection ušetříte zhruba <span className="font-medium text-slate-700">{(otherMonthlyCzk - coreMonthlyCzk) * 12} Kč ročně</span>.
              U dlouhodobého investování je to citelný rozdíl – proto u DEGIRO vyplatí preferovat Core Selection.
            </p>
          </div>
        </section>

        {/* ZDANĚNÍ */}
        <section className="pb-10">
          <SectionHead title="Zdanění pro českého investora" desc="Český daňový úhel, který v zahraničních srovnáních nenajdete. Není to daňové poradenství." />
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-left">
                  <th className="py-3 px-4 font-medium">Situace</th>
                  <th className="py-3 px-4 font-medium">Daňový dopad v ČR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr><td className="py-3 px-4 font-medium text-slate-900">Prodej ETF po 3+ letech držby</td><td className="py-3 px-4">Osvobozeno (časový test) – 0 %</td></tr>
                <tr><td className="py-3 px-4 font-medium text-slate-900">Prodej do 100 000 Kč / rok</td><td className="py-3 px-4">Osvobozeno (hodnotový test) – 0 %</td></tr>
                <tr><td className="py-3 px-4 font-medium text-slate-900">Prodej do 3 let nad limit</td><td className="py-3 px-4">Daň 15 % ze zisku</td></tr>
                <tr><td className="py-3 px-4 font-medium text-slate-900">Dividenda z české akcie</td><td className="py-3 px-4">35 % sraženo; možnost vratky 20 % v přiznání</td></tr>
                <tr><td className="py-3 px-4 font-medium text-slate-900">Dividenda z americké akcie</td><td className="py-3 px-4">15 % díky formuláři W-8BEN (jinak 30 %)</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Layers className="w-4 h-4 text-teal-700" /> Akumulační ETF</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Dividendy se reinvestují uvnitř fondu, na účet nic nepřijde. V ČR tak neřešíte žádné řádky v přiznání kvůli dividendám –
                <span className="font-medium text-slate-800"> akumulační fond daňovou evidenci výrazně zjednodušuje</span> a je vhodný pro dlouhodobé držení.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Banknote className="w-4 h-4 text-teal-700" /> Distribuční ETF</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Dividendy chodí na účet (po srážce na úrovni fondu) a musíte je uvést v daňovém přiznání. Vhodné, pokud chcete pravidelný hotovostní příjem,
                ale za cenu více administrativy.
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Daňové informace mají vzdělávací charakter a nejsou daňovým poradenstvím. Konkrétní situaci konzultujte s daňovým poradcem.
          </p>
        </section>

        {/* PLATFORMA A NABÍDKA */}
        <section className="pb-10">
          <SectionHead title="Platforma a nabídka" desc="Stručně – hloubku má verdikt a poplatky, ne výčet funkcí." />
          <div className="grid sm:grid-cols-3 gap-4">
            {([
              [Smartphone, 'Platforma', 'WebTrader v prohlížeči a mobilní aplikace (Android, iOS). Částečná čeština, bez demo účtu.'],
              [Globe, 'Nabídka', '3000+ ETF a přístup na 31 burz. Vklady a výběry v korunách.'],
              [FileText, 'UCITS ETF', 'Evropsky regulované fondy dostupné českým investorům. Většina populárních ETF (S&P 500, MSCI World) je v této formě.'],
            ] as [typeof Smartphone, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600 mb-3"><Icon className="w-4 h-4" /></span>
                <p className="font-medium text-slate-900 text-sm">{t}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRO KOHO JE / NENÍ */}
        <section className="pb-10">
          <SectionHead title="Pro koho je DEGIRO" desc="Poctivě a s konkrétní alternativou tam, kde DEGIRO nestačí." />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-emerald-700 flex items-center gap-2"><Check className="w-4 h-4" /> JE pro vás, pokud</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  'Stavíte levné dlouhodobé ETF portfolio z Core Selection',
                  'Chcete v zádech banku pod evropskou regulací',
                  'Vkládáte peníze v korunách a chcete konverzi CZK/EUR zdarma',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-red-700 flex items-center gap-2"><X className="w-4 h-4" /> NENÍ pro vás, pokud</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <span>Chcete frakční investování malých částek → <Link href="/design-preview/recenze/trading212" className="text-teal-700 hover:underline">Trading 212</Link> nebo <Link href="/design-preview/recenze/xtb" className="text-teal-700 hover:underline">XTB</Link></span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <span>Potřebujete českou podporu 24/7 → <Link href="/design-preview/recenze/xtb" className="text-teal-700 hover:underline">XTB</Link></span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <span>Investujete do CZ dividendových akcií (kvůli 35% srážce) → <Link href="/design-preview/recenze/fio" className="text-teal-700 hover:underline">Fio e-Broker</Link> (15 %)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* JAK ZALOŽIT ÚČET */}
        <section className="pb-10">
          <SectionHead title="Jak založit účet krok za krokem" desc="Pět kroků od registrace k prvnímu nákupu ETF." />
          <ol className="space-y-3">
            {[
              ['1', 'Registrace přes web', 'Vyplňte formulář. Připravte si občanku nebo pas a daňové identifikační číslo (DIČ).'],
              ['2', 'Ověření totožnosti', 'Doložte totožnost a projděte ověřením podle pravidel proti praní špinavých peněz.'],
              ['3', 'První vklad v korunách', 'Pošlete peníze bankovním převodem v Kč. Minimální vklad je 0 EUR.'],
              ['4', 'Vyhledání ETF', 'Najděte fond podle ISIN a ověřte, zda patří do Core Selection (nižší poplatek). Pozor: některé US ETF nejsou kvůli chybějící KID/PRIIPS dokumentaci dostupné.'],
              ['5', 'Zadání pokynu', 'Zadejte nákupní pokyn, zkontrolujte poplatek a potvrďte obchod.'],
            ].map(([n, t, d]) => (
              <li key={n} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold shrink-0">{n}</span>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{t}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4">
            <a
              href={AFFILIATE_HREF}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
            >
              Otevřít účet u DEGIRO <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* EDUKAČNÍ META-BLOK: jak vybírat brokera */}
        <section className="pb-10">
          <SectionHead title="Podle čeho vybírat brokera" desc="Šest kritérií, podle kterých srovnáváme každého brokera – ať si nakonec vyberete kohokoli." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {([
              [Percent, 'Poplatky', 'Za nákup ETF, vedení účtu a konverzi měn. U dlouhodobého investování rozhodují nejvíc.'],
              [Scale, 'Daně', 'Zdanění dividend a kapitálových zisků v ČR – liší se brokera od brokera (např. CZ dividendy 15 % vs. 35 %).'],
              [ShieldCheck, 'Regulace a ochrana', 'Kdo brokera dozoruje a do jaké výše je krytá vaše hotovost.'],
              [User, 'Čeština a podpora', 'Jazyk platformy, dokumentace a dostupnost zákaznické podpory.'],
              [Layers, 'Frakce a DCA', 'Možnost kupovat zlomky ETF a automatizovat pravidelné investice.'],
              [Globe, 'Nabídka', 'Počet dostupných ETF, burz a dalších nástrojů.'],
            ] as [typeof Percent, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
                  <Icon className="w-4 h-4 text-teal-700" /> {t}
                </span>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ZÁVĚREČNÝ VERDIKT */}
        <section className="pb-10">
          <SectionHead title="Závěrečný verdikt" />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 text-center">
                <p className="text-4xl font-bold tabular-nums text-slate-900 leading-none">
                  {degiroOverall}<span className="text-base font-medium text-slate-400">/100</span>
                </p>
                <p className="mt-1 text-sm font-medium text-teal-700">Dobrá</p>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed space-y-2.5">
                <p>
                  DEGIRO je <span className="font-medium text-slate-900">dobrá volba pro levné dlouhodobé ETF investování</span>.
                  Kombinace nízkého poplatku za ETF z Core Selection (1 EUR), vkladů v korunách zdarma a banky pod evropskou
                  regulací z něj dělá rozumný výchozí účet pro pasivní investory, kteří pravidelně nakupují celé kusy fondů.
                </p>
                <p>
                  Hlavní slabiny jsou české: žádné frakční investování, podpora jen v pracovní době a vysoká 35% srážka z dividend
                  českých akcií (část lze získat zpět). Pokud spadáte do těchto scénářů, podívejte se na alternativy výše –
                  recenzi píšeme nezávisle, aby vás dovedla ke správné volbě, ne nutně k DEGIRO.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <a
                href={AFFILIATE_HREF}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
              >
                Otevřít účet u DEGIRO <ArrowUpRight className="w-4 h-4" />
              </a>
              <Link href="/design-preview/srovnani-brokeru" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">
                Srovnat s ostatními brokery <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              Investování s sebou nese riziko ztráty. Minulá výkonnost nezaručuje budoucí výnosy.
            </p>
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
              [ShieldCheck, 'Nezávislé hodnocení', 'Jednotná metodika pro všechny brokery, žádné placené pořadí.'],
              [BadgeCheck, 'Transparentní provize', 'Affiliate odkazy přiznáváme, neovlivňují skóre ani vaše poplatky.'],
              [Database, 'Aktuální data', `Z veřejných zdrojů a ceníku DEGIRO, aktualizováno ${dateStr}.`],
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
              ['/design-preview/srovnani-brokeru', 'Srovnání brokerů', Scale],
              ['/design-preview/kde-koupit', 'Kde koupit ETF', Landmark],
              ['/design-preview/recenze/xtb', 'Recenze XTB', BadgeCheck],
              ['/design-preview/recenze/fio', 'Recenze Fio e-Broker', BadgeCheck],
              ['/design-preview/recenze/trading212', 'Recenze Trading 212', BadgeCheck],
              ['/design-preview/recenze/ibkr', 'Recenze Interactive Brokers', BadgeCheck],
              ['/design-preview/recenze/portu', 'Recenze Portu', BadgeCheck],
              ['/design-preview/zebricky', 'Nejlepší ETF (co koupit)', TrendingUp],
              ['/design-preview/pruvodce', 'Jak začít investovat', BookOpen],
            ] as [string, string, typeof Scale][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* E-E-A-T patička + disclaimer */}
        <section className="pb-12">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz. Recenze brokerů píšeme nezávisle a stejnou metodikou – bez placeného pořadí.
                  <Link href="/design-preview/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroje: ceník DEGIRO, ČNB, zákon o daních z příjmů. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><ListChecks className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Hodnocení {degiroOverall}/100 je vážený průměr šesti kritérií podle naší jednotné metodiky.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Obsah má vzdělávací charakter a nepředstavuje investiční ani daňové doporučení. Investice nesou riziko ztráty.</p>
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

      {/* Sticky mobilní CTA */}
      <BrokerStickyCTA href={AFFILIATE_HREF} />
    </div>
  );
}
