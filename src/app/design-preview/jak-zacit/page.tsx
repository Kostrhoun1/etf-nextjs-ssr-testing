import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import { getTotalETFCount } from '@/lib/etf-data';
import {
  TrendingUp, ArrowRight, ArrowUpRight, User, CalendarDays, BookOpen,
  Wallet, ShieldCheck, Target, ListChecks, Search, Building2, CalendarClock,
  HeartPulse, PiggyBank, CreditCard, Hourglass, Globe, Percent, Layers,
  Banknote, Repeat, AlertTriangle, Clock, Boxes, RefreshCw, Calculator,
  Landmark, Check,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import { GuideSection, GuideCallout, GuideTOC, GuideFAQ } from '@/components/design-preview/GuideUI';
import InfoTip from '@/components/design-preview/InfoTip';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Jak začít investovat do ETF: 7 kroků pro začátečníky 2026',
  description:
    'Praktická roadmapa pro úplného začátečníka: od finanční rezervy přes výběr fondu a brokera až po první nákup. 7 kroků, časté chyby a jak nepanikařit.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/jak-zacit-investovat-do-etf' },
};

export default async function HowToStartPreview() {
  const totalCount = await getTotalETFCount();
  const countLabel = totalCount > 0 ? totalCount.toLocaleString('cs-CZ') : '4 300';

  const today = new Date();
  const dateStr = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  /* ---------- 7 akčních kroků (číslo + nadpis + věty + mini-seznam) ---------- */
  const steps: {
    n: string;
    icon: typeof Target;
    title: string;
    lead: React.ReactNode;
    items?: { icon: typeof Check; text: React.ReactNode }[];
  }[] = [
    {
      n: '1',
      icon: ShieldCheck,
      title: 'Než vůbec začnete',
      lead: (
        <>
          Investování není první krok, ale až ten po zajištění základů. Tyto tři věci si odškrtněte
          ještě předtím, než pošlete brokerovi první korunu.
        </>
      ),
      items: [
        { icon: HeartPulse, text: <>Mám <strong>finanční rezervu</strong> na 3–6 měsíců běžných výdajů (na horší časy, ne na investice).</> },
        { icon: CreditCard, text: <>Nemám <strong>drahé dluhy</strong> – kreditka ani spotřebitelská půjčka neporazí žádný fond.</> },
        { icon: PiggyBank, text: <>Investuju jen peníze, které <strong>roky nebudu potřebovat</strong> – ne na auto za rok.</> },
      ],
    },
    {
      n: '2',
      icon: Target,
      title: 'Určete si cíl a horizont',
      lead: (
        <>
          Proč investuju a na jak dlouho? Odpověď rozhodne o všem dalším. U akciových ETF platí jednoduché
          pravidlo: čím delší{' '}
          <InfoTip label="Doba, po kterou plánujete peníze nechat zainvestované, než je budete chtít vybrat.">
            investiční horizont
          </InfoTip>
          , tím lépe peníze ustojí výkyvy trhu.
        </>
      ),
      items: [
        { icon: Hourglass, text: <><strong>Krátký horizont</strong> (méně než 3–5 let): akciová ETF spíš ne – trh může zrovna být dole, když budete chtít vybrat.</> },
        { icon: CalendarClock, text: <><strong>Dlouhý horizont</strong> (10+ let na penzi, na děti): ideální podhoubí pro pravidelné investování do širokých ETF.</> },
      ],
    },
    {
      n: '3',
      icon: ListChecks,
      title: 'Vyberte strategii a portfolio',
      lead: (
        <>
          Začátečník nepotřebuje deset fondů. Pro start bohatě stačí <strong>jeden široký globální ETF</strong> –
          jedním nákupem pokryjete tisíce firem z celého světa. Až získáte jistotu, můžete portfolio rozšířit.
        </>
      ),
      items: [
        { icon: Globe, text: <>Nejjednodušší start: jeden fond na celý svět nebo na vyspělé trhy.</> },
        { icon: Boxes, text: <>Chcete hotový recept? Mrkněte na <Link href="/design-preview/portfolio-strategie" className="text-teal-700 hover:underline font-medium">modelová portfolia</Link> (např. permanentní nebo akciové).</> },
      ],
    },
    {
      n: '4',
      icon: Search,
      title: 'Vyberte konkrétní ETF',
      lead: (
        <>
          Strategie je jasná, teď vyberte fond, který ji naplní. U široce diverzifikovaného ETF sledujte
          hlavně tato čtyři vodítka.
        </>
      ),
      items: [
        { icon: Globe, text: <><strong>Široký index</strong> – celý svět nebo vyspělé trhy, ne sázka na jednu zemi či odvětví.</> },
        { icon: Percent, text: <>Nízký <InfoTip label="Roční poplatek za správu fondu v procentech. Strhává se automaticky z hodnoty, neplatíte ho zvlášť.">TER</InfoTip> – u širokých indexových fondů bývá jen desetiny procenta ročně.</> },
        { icon: Layers, text: <><strong>Velký fond</strong> – objem v miliardách znamená stabilitu a nízké riziko zrušení fondu.</> },
        { icon: Banknote, text: <>Pro dlouhý horizont <InfoTip label="Akumulační fond dividendy automaticky reinvestuje uvnitř. V ČR tím odpadá starost s daněním vyplacených dividend.">akumulační</InfoTip> varianta – dividendy se reinvestují za vás.</> },
      ],
    },
    {
      n: '5',
      icon: Building2,
      title: 'Vyberte brokera',
      lead: (
        <>
          Fond koupíte přes{' '}
          <InfoTip label="Obchodník s cennými papíry, který vám zprostředkuje nákup ETF na burze.">brokera</InfoTip>.
          U začátečníka rozhodují hlavně náklady – ty umí výnos potichu ukrojit.
        </>
      ),
      items: [
        { icon: Wallet, text: <><strong>Poplatky za nákup</strong> – někteří brokeři nabízejí vybraná ETF bez poplatku za nákup.</> },
        { icon: RefreshCw, text: <><strong>Konverze měn</strong> – fond je v dolarech či eurech; poplatek za směnu z korun se sčítá při každém nákupu.</> },
      ],
    },
    {
      n: '6',
      icon: CalendarClock,
      title: 'Nastavte pravidelné investování',
      lead: (
        <>
          Nejlepší okamžik k investici se nedá trefit. Proto investujte{' '}
          <InfoTip label="Pravidelná investice (anglicky DCA): nakupujete stejnou částku v pevných intervalech, např. každý měsíc, bez ohledu na to, kde zrovna trh je.">
            pravidelně každý měsíc
          </InfoTip>{' '}
          stejnou částku – jednou koupíte dráž, jindy levněji a dlouhodobě se to vyrovná.
        </>
      ),
      items: [
        { icon: Repeat, text: <>Pevná částka v pevný den v měsíci – ideálně hned po výplatě.</> },
        { icon: Clock, text: <>Nečekejte na „lepší cenu“ – načasování trhu se dlouhodobě skoro nikomu nedaří.</> },
      ],
    },
    {
      n: '7',
      icon: HeartPulse,
      title: 'Vydržte a nepanikařte',
      lead: (
        <>
          Tohle je nejtěžší krok – a zároveň ten, který rozhoduje o výsledku. Propady jsou normální součást
          cesty. Široký index má v dobrém roce klidně +20 %, jindy ho ale čeká i −40 % propad (úzké trhy
          výjimečně zvládnou i +200 %, ale počítat s tím nelze). Kdo prodá ve strachu, ztrátu si zafixuje.
        </>
      ),
      items: [
        { icon: TrendingUp, text: <>Pokles ceny není ztráta, dokud neprodáte – držte se plánu a investujte dál.</> },
        { icon: RefreshCw, text: <>Jednou za čas (např. ročně){' '}
          <InfoTip label="Rebalancing: vrácení portfolia k původnímu poměru, když některá složka přeroste. U jednoho fondu řešit nemusíte.">
            vyvažte portfolio
          </InfoTip>, máte-li víc fondů. U jednoho širokého ETF to neřešíte.</> },
      ],
    },
  ];

  /* ---------- Časté chyby začátečníků ---------- */
  const mistakes: { icon: typeof Clock; title: string; desc: string }[] = [
    { icon: Clock, title: 'Časování trhu', desc: 'Čekání na „ideální okamžik“. Trefit dno se dlouhodobě skoro nikomu nedaří – pravidelnost vyhrává.' },
    { icon: Boxes, title: 'Příliš mnoho fondů', desc: 'Deset překrývajících se ETF nezvyšuje rozložení rizika, jen zamotá hlavu i daně. Pro start stačí jeden.' },
    { icon: AlertTriangle, title: 'Prodej v panice', desc: 'Výprodej při propadu zafixuje ztrátu. Kdo vydržel, historicky se dočkal návratu nahoru.' },
    { icon: Wallet, title: 'Ignorování poplatků', desc: 'Vysoký TER a poplatky za nákup i konverzi měn ukrajují výnos potichu, ale celé roky.' },
  ];

  /* ---------- FAQ ---------- */
  const faqs: { q: string; a: React.ReactNode }[] = [
    {
      q: 'Kolik peněz potřebuju na start?',
      a: (
        <>
          Klidně pár tisíc korun – u řady brokerů koupíte i zlomek jedné akcie ETF. Důležitější než velikost
          první částky je <strong>pravidelnost</strong> a dlouhý horizont. Investujte jen peníze, které několik
          let nebudete potřebovat.
        </>
      ),
    },
    {
      q: 'Jak často mám investovat?',
      a: (
        <>
          Pro většinu lidí se osvědčí <strong>pravidelná měsíční investice</strong> stejné částky, ideálně hned
          po výplatě. Nakupujete tak za různé ceny a nemusíte řešit, jestli je zrovna „dobrá doba“ – tu nikdo
          spolehlivě nepozná.
        </>
      ),
    },
    {
      q: 'Stačí jeden fond, nebo jich mám mít víc?',
      a: (
        <>
          Pro úplný start <strong>bohatě stačí jeden široký globální ETF</strong> – už sám drží tisíce firem
          z celého světa. Víc fondů má smysl až tehdy, když chcete cíleně doladit poměr regionů nebo přidat
          dluhopisy. Více fondů ale neznamená automaticky lepší rozložení rizika.
        </>
      ),
    },
    {
      q: 'Co když hned po nákupu přijde krize?',
      a: (
        <>
          Propady jsou normální a u dlouhého horizontu je dokonce výhoda: za stejnou částku nakoupíte víc
          podílů. <strong>Klíč je neprodávat ve strachu</strong> a pokračovat v pravidelných nákupech. Historicky
          se trhy z propadů vždy zotavily – jen to chtělo čas a klid.
        </>
      ),
    },
    {
      q: 'Musím rozumět grafům a sledovat trh každý den?',
      a: (
        <>
          Ne. Smysl pasivního investování do ETF je právě v tom, že ho <strong>nemusíte denně hlídat</strong>.
          Nastavíte pravidelnou investici a pak hlavně necháte čas pracovat. Časté kontrolování zůstatku spíš
          svádí k unáhleným rozhodnutím.
        </>
      ),
    },
  ];

  /* ---------- JSON-LD: HowTo + FAQPage + BreadcrumbList ---------- */
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Jak začít investovat do ETF',
    description: metadata.description,
    totalTime: 'P1D',
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: stepPlainText(s.title),
      url: `https://www.etfpruvodce.cz/jak-zacit-investovat-do-etf#krok-${i + 1}`,
    })),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: faqPlainText(f.q) },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://www.etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Jak začít investovat do ETF', item: 'https://www.etfpruvodce.cz/jak-zacit-investovat-do-etf' },
    ],
  };

  const toc = [
    { href: '#kroky', label: '7 kroků, jak začít' },
    { href: '#chyby', label: 'Časté chyby začátečníků' },
    { href: '#faq', label: 'Časté dotazy' },
    { href: '#dal', label: 'Kam dál' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header – 1:1 dle pruvodce */}
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
            <Link href="/design-preview/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/design-preview/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
          <Link href="/design-preview/srovnani" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Srovnávač</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <span className="text-slate-600">Jak začít investovat do ETF</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                  Jak začít investovat do ETF
                </h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Praktická roadmapa pro úplného začátečníka – sedm kroků od rozhodnutí k prvnímu nákupu.
                  Záměrně v pořadí, ve kterém je dělat: od finanční rezervy přes výběr fondu a brokera až
                  po klid, když trhy padají.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/design-preview/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Čtení ~9 min</span>
                  <span className="inline-flex items-center gap-1.5"><ListChecks className="w-3.5 h-3.5" /> 7 kroků</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href="#kroky" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">Začít prvním krokem</Link>
                  <Link href="/design-preview/pruvodce" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Co je ETF?</Link>
                </div>
              </div>

              <div className="mt-6 md:mt-0 md:w-72 shrink-0 rounded-xl bg-white/5 border border-white/10 p-5">
                <p className="text-sm font-semibold text-white">Nejdřív základ, pak roadmapa</p>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Nevíte, co ETF vlastně je, jak funguje a jak se daní v Česku? Tahle stránka řeší
                  <strong className="text-slate-200"> pořadí kroků</strong>, ne teorii.
                </p>
                <Link href="/design-preview/pruvodce" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal-300 hover:text-teal-200">
                  Co jsou ETF – základ <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-400">
                  Vybíráme z <strong className="text-slate-200 tabular-nums">{countLabel}</strong> fondů v databázi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* OBSAH / KOTVY */}
        <section className="pb-9">
          <GuideTOC items={toc} />
        </section>

        {/* KROKY */}
        <GuideSection id="kroky">
          <SectionHead
            title="7 kroků, jak začít investovat do ETF"
            desc="Záleží na pořadí. Projděte kroky shora dolů – každý navazuje na předchozí."
          />
          <ol className="space-y-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.n}
                  id={`krok-${i + 1}`}
                  className="scroll-mt-20 rounded-lg border border-slate-200 bg-white p-5 md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-teal-700 text-white text-base font-bold tabular-nums">
                      {s.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 leading-tight">
                        <Icon className="w-5 h-5 text-teal-700 shrink-0" /> {s.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.lead}</p>
                      {s.items && (
                        <ul className="mt-3 space-y-2">
                          {s.items.map((it, j) => {
                            const ItemIcon = it.icon;
                            return (
                              <li key={j} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                                <span className="flex items-center justify-center w-6 h-6 shrink-0 rounded-md bg-teal-50 text-teal-700">
                                  <ItemIcon className="w-3.5 h-3.5" />
                                </span>
                                <span className="pt-0.5">{it.text}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Akční rozcestník navázaný na kroky 4–5 */}
          <div className="mt-5 grid sm:grid-cols-3 gap-2.5">
            {([
              ['/design-preview/srovnani', 'Srovnat ETF', Search],
              ['/design-preview/zebricky', 'Žebříčky fondů', ListChecks],
              ['/design-preview/srovnani-brokeru', 'Srovnání brokerů', Building2],
            ] as [string, string, typeof Search][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3.5 py-3 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 ml-auto shrink-0" />
              </Link>
            ))}
          </div>

          <div className="mt-4">
            <GuideCallout icon={Calculator} title="Chcete vidět, kam vás pravidelné investování dovede?">
              Místo dohadů si na vlastní částku a horizont spočítejte výsledek v naší{' '}
              <Link href="/design-preview/investicni-kalkulacka" className="text-teal-700 hover:underline font-medium">
                investiční kalkulačce
              </Link>
              {' '}– uvidíte sílu pravidelnosti a času na číslech.
            </GuideCallout>
          </div>
        </GuideSection>

        {/* CHYBY */}
        <GuideSection id="chyby">
          <SectionHead
            title="Časté chyby začátečníků"
            desc="Čtyři přešlapy, které stojí nejvíc peněz i nervů. Když je obejdete, máte půlku úspěchu."
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {mistakes.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{m.title}</p>
                    <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </GuideSection>

        {/* FAQ */}
        <GuideSection id="faq">
          <SectionHead title="Časté dotazy" desc="Co řeší skoro každý, kdo stojí před prvním nákupem." />
          <GuideFAQ faqs={faqs} />
        </GuideSection>

        {/* KAM DÁL */}
        <GuideSection id="dal">
          <SectionHead title="Kam dál" desc="Podle toho, u kterého kroku zrovna jste." />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {([
              ['/design-preview/pruvodce', 'Co jsou ETF (základ)', BookOpen],
              ['/design-preview/portfolio-strategie', 'Modelová portfolia', Boxes],
              ['/design-preview/srovnani', 'Srovnání ETF', Search],
              ['/design-preview/zebricky', 'Nejlepší ETF', ListChecks],
              ['/design-preview/etf', 'Ukázka detailu fondu', Globe],
              ['/design-preview/kde-koupit', 'Kde koupit ETF', Landmark],
            ] as [string, string, typeof BookOpen][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 ml-auto shrink-0" />
              </Link>
            ))}
          </div>
        </GuideSection>

        {/* E-E-A-T patička + disclaimer na úplném konci */}
        <section className="pb-12 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz. Edukační obsah píšeme srozumitelně a nezávisle, na základě veřejných
                  dat – bez placeného pořadí.
                  <Link href="/design-preview/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <p className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 leading-relaxed">
              Aktualizováno {dateStr}.
            </p>
          </div>

          <InvestmentDisclaimer />
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

/* ---------- Plain-text verze kroků pro JSON-LD HowToStep ---------- */
function stepPlainText(title: string): string {
  const map: Record<string, string> = {
    'Než vůbec začnete':
      'Před investováním si zajistěte finanční rezervu na 3–6 měsíců výdajů, splaťte drahé dluhy a investujte jen peníze, které roky nebudete potřebovat.',
    'Určete si cíl a horizont':
      'Ujasněte si, proč a na jak dlouho investujete. Pro horizont kratší než 3–5 let se akciová ETF spíš nehodí, ideální jsou na 10 a více let.',
    'Vyberte strategii a portfolio':
      'Pro start bohatě stačí jeden široký globální ETF. Hotové recepty nabízejí modelová portfolia.',
    'Vyberte konkrétní ETF':
      'U fondu sledujte široký index, nízký TER, velký objem fondu a pro dlouhý horizont akumulační variantu.',
    'Vyberte brokera':
      'Vyberte obchodníka s cennými papíry. Hlídejte hlavně poplatky za nákup a za konverzi měn.',
    'Nastavte pravidelné investování':
      'Investujte pravidelně každý měsíc stejnou částku bez ohledu na to, kde je trh. Načasování trhu se dlouhodobě skoro nikomu nedaří.',
    'Vydržte a nepanikařte':
      'Propady jsou normální. Neprodávejte ve strachu, pokračujte v nákupech a máte-li víc fondů, jednou za čas portfolio vyvažte.',
  };
  return map[title] ?? title;
}

/* ---------- Plain-text verze FAQ odpovědí pro JSON-LD ---------- */
function faqPlainText(q: string): string {
  const map: Record<string, string> = {
    'Kolik peněz potřebuju na start?':
      'Klidně pár tisíc korun – u řady brokerů koupíte i zlomek akcie ETF. Důležitější než velikost první částky je pravidelnost a dlouhý horizont. Investujte jen peníze, které několik let nebudete potřebovat.',
    'Jak často mám investovat?':
      'Pro většinu lidí se osvědčí pravidelná měsíční investice stejné částky, ideálně po výplatě. Nakupujete tak za různé ceny a nemusíte řešit, jestli je zrovna dobrá doba.',
    'Stačí jeden fond, nebo jich mám mít víc?':
      'Pro úplný start bohatě stačí jeden široký globální ETF – už sám drží tisíce firem z celého světa. Víc fondů má smysl až při cíleném dolaďování portfolia.',
    'Co když hned po nákupu přijde krize?':
      'Propady jsou normální a u dlouhého horizontu i výhoda: za stejnou částku nakoupíte víc podílů. Klíč je neprodávat ve strachu a pokračovat v pravidelných nákupech.',
    'Musím rozumět grafům a sledovat trh každý den?':
      'Ne. Smysl pasivního investování do ETF je v tom, že ho nemusíte denně hlídat. Nastavíte pravidelnou investici a necháte čas pracovat.',
  };
  return map[q] ?? q;
}
