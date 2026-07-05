import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, CalendarDays, Database, Info, Calculator,
  Wallet, Coins, Landmark, Scale, ShieldCheck, Crown, HelpCircle, BookOpen,
  Flame, Target, PiggyBank, Percent,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import FireKalkulackaWidget from '@/components/design-preview/FireKalkulackaWidget';
import InfoTip from '@/components/design-preview/InfoTip';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'FIRE kalkulačka: kdy dosáhnu finanční nezávislosti?',
  description:
    'Spočítejte si v korunách, v kolika letech dosáhnete finanční nezávislosti. FIRE podle pravidla 4 % – cílová částka, rok dosažení a graf růstu portfolia.',
};

export default async function FireKalkulackaPreview() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  /* ---------- FAQ + JSON-LD ---------- */
  const faqs = [
    {
      q: 'Co znamená FIRE a finanční nezávislost?',
      a: 'FIRE (Financial Independence, Retire Early – finanční nezávislost a předčasná renta) je stav, kdy máte naspořeno tolik, že vám pasivní příjem z investic pokryje životní náklady a nemusíte chodit do práce. Cílem je nashromáždit dostatečně velké portfolio, jehož výnosy uživí vaše výdaje.',
    },
    {
      q: 'Jak kalkulačka počítá cílovou částku?',
      a: 'Vychází z pravidla 4 % (Trinity Study): potřebná částka je 25násobek vašich ročních výdajů. Při výdajích 40 000 Kč měsíčně (480 000 Kč ročně) vychází cíl na 12 milionů Kč. Z takového portfolia pak můžete vybírat zhruba 4 % ročně, aniž byste jistinu rychle vyčerpali.',
    },
    {
      q: 'Co je pravidlo 4 % a je bezpečné?',
      a: 'Pravidlo 4 % říká, že pokud první rok vyberete 4 % portfolia a dál výběr jen navyšujete o inflaci, portfolio s vysokou pravděpodobností vydrží 30 a více let. Pro velmi dlouhé renty (40+ let) je opatrnější použít 3–3,5 %. Jde o pravděpodobnostní odhad z historických dat, ne o záruku.',
    },
    {
      q: 'Jak je v kalkulačce zohledněna inflace?',
      a: 'Měsíční výdaje zadáváte v dnešních cenách. Kalkulačka cílovou částku každý rok automaticky navyšuje o zadanou míru inflace, takže nemusíte odhadovat budoucí ceny – stačí říct, kolik byste potřebovali dnes.',
    },
    {
      q: 'Jaké portfolio je pro cestu k nezávislosti vhodné?',
      a: 'Historicky se osvědčila diverzifikovaná portfolia – v období spoření více akcií (široké světové ETF), s blížícím se cílem postupně více dluhopisů. Zásadní jsou nízké poplatky: každé procento ročního poplatku (TER) ukrojí za desítky let velkou část konečné částky.',
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
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://www.etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Kalkulačky', item: 'https://www.etfpruvodce.cz/kalkulacky' },
      { '@type': 'ListItem', position: 3, name: 'FIRE kalkulačka', item: 'https://www.etfpruvodce.cz/kalkulacky/fire-kalkulacka' },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/kalkulacky" className="text-teal-700 font-medium">Kalkulačky</Link>
            <Link href="/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/kalkulacky" className="hover:text-slate-600">Kalkulačky</Link>
          <span>/</span>
          <span className="text-slate-600">FIRE kalkulačka</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
                  <Flame className="w-3.5 h-3.5" /> Finanční nezávislost
                </span>
                <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                  FIRE kalkulačka: kdy dosáhnu finanční nezávislosti?
                </h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Spočítejte si, v kolika letech vám naspořené portfolio uživí výdaje a budete moct přestat pracovat.
                  Stojí na pravidle{' '}
                  <InfoTip label="Pravidlo 4 % (Trinity Study): cílem je 25násobek ročních výdajů. Z takového portfolia můžete vybírat zhruba 4 % ročně a s vysokou pravděpodobností vám vydrží desítky let.">
                    <span className="text-teal-200 underline decoration-dotted">4 %</span>
                  </InfoTip>{' '}
                  a počítá v korunách.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                  <span className="inline-flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> Částky v Kč</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href="#kalkulacka" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">Spustit kalkulačku</Link>
                  <Link href="/portfolio-strategie" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Vybrat portfolio</Link>
                </div>
              </div>

              {/* Mini vysvětlení pravidla 4 % */}
              <div className="mt-6 md:mt-0 md:w-72 shrink-0 grid grid-cols-3 md:grid-cols-1 gap-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Cílová částka</p>
                  <p className="text-lg font-bold tabular-nums">25×</p>
                  <p className="text-xs text-slate-400">ročních výdajů</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Bezpečný výběr</p>
                  <p className="text-lg font-bold tabular-nums text-teal-300">~4 %</p>
                  <p className="text-xs text-slate-400">ročně z portfolia</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Výsledek</p>
                  <p className="text-lg font-bold tabular-nums">věk + graf</p>
                  <p className="text-xs text-slate-400">vývoje majetku</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* JAK TO FUNGUJE – edukace NAD kalkulačkou */}
        <section className="pb-10">
          <SectionHead title="Jak se k nezávislosti počítá" desc="Tři kroky, než si spočítáte vlastní případ." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Princip je jednoduchý: spočítáte si, kolik potřebujete utratit za rok, vynásobíte to{' '}
              <strong className="text-slate-900">25×</strong> (
              <InfoTip label="Pravidlo 4 %: 4 % ročně z portfolia odpovídá 1/25, proto cíl = 25násobek ročních výdajů.">
                <span className="underline decoration-dotted">pravidlo 4 %</span>
              </InfoTip>
              ) a tím získáte cílovou částku. Pak sledujete, kdy k ní vaše portfolio doroste.
            </p>

            <ul className="mt-5 grid sm:grid-cols-3 gap-3">
              {([
                [PiggyBank, 'Spoříte a investujete', 'Pravidelný vklad + výnos trhu portfolio postupně nafukují.'],
                [TrendingUp, 'Pracuje složené úročení', 'Výnosy vydělávají další výnosy – křivka se časem zrychluje.'],
                [Flame, 'Protnete cíl', 'Jakmile portfolio dosáhne 25× ročních výdajů, jste nezávislí.'],
              ] as [typeof PiggyBank, string, string][]).map(([Icon, t, d]) => (
                <li key={t} className="rounded-lg bg-slate-50 p-3">
                  <span className="flex items-center gap-2 font-medium text-slate-900 text-sm"><Icon className="w-4 h-4 text-teal-700 shrink-0" /> {t}</span>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* KALKULAČKA */}
        <section id="kalkulacka" className="pb-10 scroll-mt-16">
          <SectionHead title="Spočítejte si svůj rok nezávislosti" desc="Zadejte své vstupy. Výsledek i graf se přepočítají hned." />
          <FireKalkulackaWidget />
        </section>

        {/* CO JE FIRE – edukace vetkaná */}
        <section className="pb-10">
          <SectionHead title="Co je FIRE" desc="Pojem, který se schovává za výpočtem." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong className="text-slate-900">FIRE (Financial Independence, Retire Early)</strong> česky znamená
              finanční nezávislost a předčasná renta. Jde o stav, kdy máte naspořeno tolik, že vás uživí výnosy z investic
              a práce se stává dobrovolnou. Liší se podle náročnosti životního stylu:
            </p>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {([
                [Wallet, 'Lean (úsporná)', 'Skromnější životní styl, nižší výdaje – cíl je menší, dosáhnete dřív.'],
                [Scale, 'Běžná', 'Standardní výdaje běžné domácnosti – nejčastější varianta.'],
                [Crown, 'Fat (komfortní)', 'Vyšší výdaje a rezerva navíc – cíl je vyšší, trvá to déle.'],
              ] as [typeof Wallet, string, string][]).map(([Icon, t, d]) => (
                <div key={t} className="rounded-lg bg-slate-50 p-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-teal-700 border border-slate-200 mb-3"><Icon className="w-4 h-4" /></span>
                  <p className="font-medium text-slate-900 text-sm">{t}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              U českého investora hraje roli i{' '}
              <strong className="text-slate-900">daňový režim</strong>: zisk z prodeje ETF je po 3 letech držení
              osvobozený (časový test), takže se pro dlouhodobé budování portfolia hodí levný{' '}
              <InfoTip label="Akumulační ETF dividendy reinvestuje uvnitř fondu — neřešíte každoroční zdanění výplat ani řádky v přiznání.">akumulační</InfoTip>
              {' '}fond. Státní důchod berte jako bonus navíc, kalkulačka s ním nepočítá.
            </p>
            <p className="mt-3">
              <Link href="/pruvodce" className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium text-sm">
                Více o ETF a daních <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </section>

        {/* PŘEDPOKLADY VÝPOČTU */}
        <section className="pb-10">
          <SectionHead title="Předpoklady výpočtu" desc="Z čeho kalkulačka vychází – ať víte, jak čísla číst." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-slate-600">
              {[
                ['Cílová částka', '25× ročních výdajů (pravidlo 4 %).'],
                ['Strategie a výnosy', 'Konzervativní 7,7 %, vyvážená 8,8 %, agresivní 9,8 % p.a. (nominálně, před inflací) – historická data 1995–2024.'],
                ['Inflace', 'Cíl se každý rok navyšuje o zadanou míru inflace; výdaje zadáváte v dnešních cenách.'],
                ['Horizont', 'Výpočet sleduje vývoj portfolia až 50 let dopředu.'],
                ['Daně', 'Nezahrnuje daň z výnosů (u ETF v ČR po 3 letech osvobozeno).'],
                ['Státní důchod', 'Nezapočítává I. ani II. pilíř – berte jako rezervu navíc.'],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span><strong className="text-slate-900">{t}:</strong> {d}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              Výsledky jsou modelové a pracují s historickým průměrným výnosem. Skutečné výnosy kolísají a nelze je zaručit.
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
              [ShieldCheck, 'Nezávislé nástroje', 'Žádné placené pořadí ani skrytá reklama.'],
              [Crown, '12 let praxe ve financích', 'Obsah od jmenného autora, ne anonymně.'],
              [Database, 'Doložená metodika', `Výnosy z historických dat 1995–2024. Aktualizováno ${dateStr}.`],
            ] as [typeof ShieldCheck, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Icon className="w-5 h-5" /></span>
                <span><span className="block font-semibold text-sm text-slate-900">{t}</span><span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">{d}</span></span>
              </div>
            ))}
          </div>
        </section>

        {/* POKRAČUJTE DÁL */}
        <section className="pb-10">
          <SectionHead title="Pokračujte dál" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {([
              ['/kalkulacka', 'Kalkulačka poplatků', Percent],
              ['/portfolio-strategie', 'Modelová portfolia', Scale],
              ['/kde-koupit', 'Kde koupit ETF', Landmark],
              ['/srovnani', 'Srovnání ETF', TrendingUp],
              ['/pruvodce', 'Co jsou ETF', BookOpen],
              ['/kalkulacky', 'Další kalkulačky', Calculator],
            ] as [string, string, typeof Wallet][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* E-E-A-T patička */}
        <section className="pb-8">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Kalkulačky stavíme nezávisle, na základě veřejných dat a doložené metodiky – bez placeného pořadí.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroje: historická data 1995–2024 (portfoliovisualizer.com), vlastní metodika. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Kalkulačka má vzdělávací charakter a pracuje s modelovým výnosem – skutečné výnosy se liší a nelze je zaručit.</p>
            </div>
          </div>
        </section>

        {/* DISCLAIMER – na konci obsahu */}
        <section className="pb-12">
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
