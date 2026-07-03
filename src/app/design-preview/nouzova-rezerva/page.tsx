import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  TrendingUp, ArrowRight, User, CalendarDays, Database, Info, Calculator,
  ShieldAlert, Wallet, PiggyBank, Landmark, Clock, HelpCircle, BookOpen,
  ShieldCheck, Crown, Scale, Coins, CheckCircle2, XCircle, Target,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import NouzovaRezervaWidget from '@/components/design-preview/NouzovaRezervaWidget';
import InfoTip from '@/components/design-preview/InfoTip';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Kalkulačka nouzové rezervy: kolik si naspořit a za jak dlouho',
  description:
    'Spočítejte si v korunách optimální velikost nouzové rezervy podle své situace – kolik vám chybí dospořit a za jak dlouho při vašem tempu spoření.',
  robots: { index: false, follow: false },
};

export default function NouzovaRezervaPreview() {
  const today = new Date();
  const dateStr = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  /* ---------- FAQ + JSON-LD ---------- */
  const faqs = [
    {
      q: 'Kolik měsíců výdajů má nouzová rezerva pokrýt?',
      a: 'Závisí na vaší situaci. Pro stabilní zaměstnání bez závazků bývá dostatečná rezerva na 3 měsíce výdajů, pro většinu lidí s rodinou nebo hypotékou spíš 6 měsíců a pro OSVČ či nestabilní příjmy 9–12 měsíců. Kalkulačka výše vychází ze základu podle stability zaměstnání a podle dalších rizikových faktorů ho navyšuje (maximálně na 12 měsíců).',
    },
    {
      q: 'Z jakých výdajů se rezerva počítá?',
      a: 'Počítají se pouze nezbytné měsíční výdaje – bydlení, jídlo, doprava, pojištění, splátky a léky. Zbytné položky jako dovolená, restaurace nebo spoření do rezervy nezapočítávejte. Smyslem je, aby vám rezerva pokryla nutný provoz domácnosti, když vypadne příjem.',
    },
    {
      q: 'Kde nouzovou rezervu držet?',
      a: 'Rezerva musí být kdykoli po ruce, takže patří na spořicí účet v korunách s okamžitou dostupností, případně z části na krátkodobý termínovaný vklad. Nepatří do akcií, ETF ani kryptoměn – ty mohou klesnout právě ve chvíli, kdy peníze potřebujete. Rezerva není investice, ale pojistka likvidity.',
    },
    {
      q: 'Mám nejdřív spořit na rezervu, nebo investovat?',
      a: 'Nejdřív rezerva. Bez ní byste museli v krizi prodávat investice za nevýhodnou cenu. Doporučený postup: nejprve menší základ (rezerva na 1 měsíc), pak dobudování plné rezervy a teprve potom pravidelné investování do ETF. Rezerva je vlastně pojistka vašich budoucích investic.',
    },
    {
      q: 'Jak často velikost rezervy přehodnotit?',
      a: 'Ideálně jednou ročně a vždy při větší životní změně – narození dítěte, koupi nemovitosti, změně zaměstnání, nemoci nebo výrazné změně výdajů. Rezerva má odpovídat vaší aktuální situaci, ne té, jakou jste měli před lety.',
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
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Kalkulačky', item: 'https://etfpruvodce.cz/kalkulacky' },
      { '@type': 'ListItem', position: 3, name: 'Kalkulačka nouzové rezervy', item: 'https://etfpruvodce.cz/kalkulacky/nouzova-rezerva' },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
            </span>
            ETF průvodce
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/design-preview/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/design-preview/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/design-preview/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/design-preview/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/design-preview/kalkulacky" className="text-teal-700 font-medium">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <Link href="/design-preview/srovnani" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Srovnávač</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/design-preview/kalkulacky" className="hover:text-slate-600">Kalkulačky</Link>
          <span>/</span>
          <span className="text-slate-600">Kalkulačka nouzové rezervy</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Kalkulačka nouzové rezervy</h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Spočítejte si, jak velkou{' '}
                  <InfoTip label="Peníze stranou na nečekané výpadky příjmu nebo velké výdaje (ztráta práce, nemoc, oprava). Drží se likvidně, ne v investicích.">nouzovou rezervu</InfoTip>
                  {' '}potřebujete, kolik vám chybí dospořit a za jak dlouho ji při svém tempu spoření vybudujete – vše v korunách.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/design-preview/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                  <span className="inline-flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> Výpočet v korunách</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href="#kalkulacka" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">Spustit kalkulačku</Link>
                  <Link href="/design-preview/kalkulacky" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Další kalkulačky</Link>
                </div>
              </div>

              {/* Mini-vysvětlení tří doporučených velikostí */}
              <div className="mt-6 md:mt-0 md:w-72 shrink-0 grid grid-cols-3 md:grid-cols-1 gap-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Stabilní příjem</p>
                  <p className="text-lg font-bold tabular-nums">3 měsíce</p>
                  <p className="text-xs text-slate-400">minimální rezerva</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Rodina, hypotéka</p>
                  <p className="text-lg font-bold tabular-nums">6 měsíců</p>
                  <p className="text-xs text-slate-400">standardní rezerva</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">OSVČ, nestabilní příjem</p>
                  <p className="text-lg font-bold tabular-nums text-emerald-400">9–12 měsíců</p>
                  <p className="text-xs text-slate-400">vyšší rezerva</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROČ REZERVA – edukace NAD kalkulačkou */}
        <section className="pb-10">
          <SectionHead title="Proč mít nouzovou rezervu" desc="Krátké vysvětlení, než si spočítáte vlastní případ." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Nouzová rezerva je <strong className="text-slate-900">polštář pro nečekané výpadky</strong> – ztrátu zaměstnání,
              nemoc nebo velkou opravu. Díky ní nemusíte sahat na dluh ani prodávat investice ve špatnou chvíli.
            </p>
            <div className="mt-3 rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-900 flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Rezerva je <strong>pojistka likvidity</strong> – ne investice. Cílem je dostupnost, ne výnos.</span>
            </div>
            <ul className="mt-5 grid sm:grid-cols-3 gap-3">
              {([
                [ShieldAlert, 'Tlumí výpadek příjmu', 'Pokryje nutné výdaje, když přijdete o práci nebo onemocníte.'],
                [Wallet, 'Brání zadlužení', 'Nemusíte řešit nečekané výdaje drahou půjčkou nebo kreditkou.'],
                [TrendingUp, 'Chrání investice', 'V krizi nemusíte prodávat ETF se ztrátou kvůli hotovosti.'],
              ] as [typeof ShieldAlert, string, string][]).map(([Icon, t, d]) => (
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
          <SectionHead title="Spočítejte si svou rezervu" desc="Zadejte své výdaje a situaci. Výsledek ukáže cílovou částku, kolik vám chybí a za jak dlouho ji naspoříte." />
          <NouzovaRezervaWidget />
        </section>

        {/* JAK SE VELIKOST POČÍTÁ – edukace vetkaná */}
        <section className="pb-10">
          <SectionHead title="Jak kalkulačka velikost počítá" desc="Žádná magie – jednoduché pravidlo, které pak doladí vaše rizikové faktory." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Základ určuje <strong className="text-slate-900">stabilita zaměstnání</strong> (stabilní 3 měsíce, středně
              stabilní 6, nestabilní 9). Podle rizikových faktorů (typ smlouvy, věk, vzdělání, druhý příjem, dluhy, počet osob)
              se pak rezerva navýší o 30 % při středním riziku a o 60 % při vysokém. Výsledek je vždy mezi 3 a 12 měsíci výdajů.
            </p>

          </div>
        </section>

        {/* KDE DRŽET REZERVU */}
        <section className="pb-10">
          <SectionHead title="Kde nouzovou rezervu držet" desc="Rezerva musí být kdykoli po ruce – proto patří jen na likvidní a bezpečná místa." />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-emerald-200 bg-white p-5">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Vhodná místa
              </h3>
              <ul className="space-y-3 text-sm">
                {([
                  ['Spořicí účet v korunách', 'Okamžitá dostupnost, pojištěno do 100 000 €, bez měnového rizika. Hlavní pilíř rezervy.'],
                  ['Krátkodobý termínovaný vklad', 'Splatnost 3–6 měsíců, mírně vyšší úrok, garance. Vhodný pro menší část rezervy.'],
                ] as [string, string][]).map(([t, d]) => (
                  <li key={t}>
                    <p className="font-medium text-slate-900">{t}</p>
                    <p className="text-slate-500 leading-relaxed">{d}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-red-200 bg-white p-5">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900 mb-3">
                <XCircle className="w-4 h-4 text-red-600 shrink-0" /> Nevhodná místa
              </h3>
              <ul className="space-y-3 text-sm">
                {([
                  ['Akciové ETF a akcie', 'Vysoká kolísavost – hodnota může spadnout právě ve chvíli, kdy peníze potřebujete.'],
                  ['Kryptoměny', 'Extrémní kolísavost a regulatorní rizika. Pro rezervu nepoužitelné.'],
                  ['Dlouhodobé dluhopisy', 'Citlivé na pohyb úrokových sazeb, hodnota může kolísat.'],
                ] as [string, string][]).map(([t, d]) => (
                  <li key={t}>
                    <p className="font-medium text-slate-900">{t}</p>
                    <p className="text-slate-500 leading-relaxed">{d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-3">
            <Link href="/design-preview/pruvodce" className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium text-sm">
              Až budete mít rezervu, podívejte se na ETF <ArrowRight className="w-4 h-4" />
            </Link>
          </p>
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
              [ShieldCheck, 'Nezávislý průvodce', 'Bez placeného pořadí a reklamních doporučení.'],
              [Crown, '12 let praxe ve financích', 'Obsah od jmenného autora, ne anonymně.'],
              [Calculator, 'Průhledný výpočet', 'Metodika i předpoklady jsou popsané přímo na stránce.'],
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
              ['/design-preview/kalkulacky', 'Další kalkulačky', Calculator],
              ['/design-preview/pruvodce', 'Co jsou ETF', BookOpen],
              ['/design-preview/srovnani', 'Srovnání ETF', Scale],
              ['/design-preview/kde-koupit', 'Kde koupit ETF', Landmark],
              ['/design-preview/zebricky', 'Žebříčky ETF', TrendingUp],
              ['/design-preview/portfolio-strategie', 'Modelová portfolia', PiggyBank],
            ] as [string, string, typeof Calculator][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* E-E-A-T patička */}
        <section className="pb-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Kalkulačku stavíme nezávisle a srozumitelně, s otevřenou metodikou – bez placeného pořadí.
                  <Link href="/design-preview/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Předpoklady: základ 3/6/9 měsíců dle stability, navýšení o riziko (max. 12 měsíců), pouze nezbytné výdaje. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Kalkulačka má vzdělávací charakter a pracuje s modelovými předpoklady – nezohledňuje inflaci, daně ani specifické životní situace. Nepředstavuje investiční ani finanční doporučení.</p>
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
