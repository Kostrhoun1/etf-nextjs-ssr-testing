import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, CalendarDays, Database, Info, Calculator,
  Coins, Wallet, Scale, Landmark, ShieldCheck, Crown, HelpCircle, BookOpen,
  Percent, Banknote,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InfoTip from '@/components/design-preview/InfoTip';
import HypotecniKalkulackaWidget from '@/components/design-preview/HypotecniKalkulackaWidget';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Hypoteční kalkulačka: měsíční splátka a přeplacení na úrocích',
  description:
    'Spočítejte si měsíční splátku hypotéky i kolik celkem přeplatíte na úrocích. Zadejte cenu nemovitosti, vlastní zdroje, sazbu a dobu splatnosti – výsledek v korunách včetně grafu.',
  robots: { index: false, follow: false },
};

export default function HypotecniKalkulackaPreview() {
  const today = new Date();
  const dateStr = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  /* ---------- FAQ + JSON-LD ---------- */
  const faqs = [
    {
      q: 'Jak kalkulačka počítá měsíční splátku hypotéky?',
      a: 'Splátka se počítá anuitním vzorcem: po celou dobu fixace platíte stejnou částku, která se skládá z úroku a úmoru jistiny. Z výše úvěru, úrokové sazby a doby splatnosti kalkulačka spočítá měsíční splátku a poté měsíc po měsíci modeluje, kolik z ní jde na úroky a kolik na snižování dluhu. Na začátku tvoří úroky většinu splátky, postupně se poměr obrací ve prospěch jistiny.',
    },
    {
      q: 'Co znamená poměr úvěru k ceně (LTV) a proč na něm záleží?',
      a: 'LTV (loan-to-value) je poměr výše úvěru k ceně nemovitosti. Pokud koupíte byt za 5 milionů a půjčíte si 4 miliony, LTV je 80 %. Banky obvykle půjčí maximálně 80–90 % ceny, zbytek musíte pokrýt z vlastních zdrojů. Nižší LTV (více vlastních peněz) zpravidla znamená lepší úrokovou sazbu a snazší schválení.',
    },
    {
      q: 'Kolik celkem přeplatím na úrocích?',
      a: 'Záleží hlavně na sazbě a době splatnosti. Čím delší splatnost, tím nižší měsíční splátka, ale tím víc celkem zaplatíte na úrocích, protože dluh splácíte déle. Kalkulačka ukazuje celkové úroky za celou dobu i celkovou částku, kterou bance vrátíte. Pozor: počítá s neměnnou sazbou po celou dobu – po skončení fixace se reálná sazba a tím i splátka mohou změnit.',
    },
    {
      q: 'Počítá kalkulačka i s poplatky a pojištěním?',
      a: 'Ne. Výpočet je orientační a zahrnuje pouze úrok a úmor jistiny. Nezahrnuje poplatky za zpracování úvěru, odhad nemovitosti, vedení účtu, pojištění nemovitosti ani pojištění schopnosti splácet. Skutečnou roční cenu úvěru včetně poplatků vyjadřuje ukazatel RPSN, který najdete v nabídce konkrétní banky.',
    },
    {
      q: 'Vyplatí se kratší, nebo delší doba splatnosti?',
      a: 'Kratší splatnost znamená vyšší měsíční splátku, ale výrazně nižší celkové úroky – dluh splatíte rychleji. Delší splatnost sníží měsíční zatížení, ale prodraží úvěr na úrocích. Rozumný kompromis bývá tak nastavit splatnost, aby splátka nepřesáhla únosnou část čistého příjmu, a zbytek řešit mimořádnými splátkami na konci fixace, kdy bývají bez sankce.',
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
      { '@type': 'ListItem', position: 3, name: 'Hypoteční kalkulačka', item: 'https://www.etfpruvodce.cz/kalkulacky/hypotecni-kalkulacka' },
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
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/design-preview/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/design-preview/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/design-preview/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/design-preview/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/design-preview/kalkulacky" className="text-teal-700 font-medium">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/design-preview/srovnani" className="hidden sm:inline-flex rounded-lg border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">Srovnávač</Link>
            <HeaderSearch />
            <Link href="/design-preview/kalkulacky" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Kalkulačky</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/design-preview/kalkulacky" className="hover:text-slate-600">Kalkulačky</Link>
          <span>/</span>
          <span className="text-slate-600">Hypoteční kalkulačka</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Hypoteční kalkulačka</h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Spočítejte si měsíční splátku hypotéky a kolik celkem přeplatíte na{' '}
                  <InfoTip label="Úrok je cena za půjčené peníze. Platíte ho z dosud nesplacené části dluhu, takže na začátku je úrok ve splátce největší.">úrocích</InfoTip>
                  {' '}– cena nemovitosti, vlastní zdroje, sazba a doba splatnosti, výsledek v korunách.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/design-preview/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                  <span className="inline-flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> Výsledky v korunách</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href="#kalkulacka" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">Spustit kalkulačku</Link>
                  <Link href="/design-preview/investicni-kalkulacka" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Investiční kalkulačka</Link>
                </div>
              </div>

              {/* Mini-přehled, co kalkulačka dělá */}
              <div className="mt-6 md:mt-0 md:w-72 shrink-0 grid grid-cols-3 md:grid-cols-1 gap-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Zadáte</p>
                  <p className="text-lg font-bold tabular-nums">Cena + úvěr</p>
                  <p className="text-xs text-slate-400">sazba a splatnost</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Spočítáte</p>
                  <p className="text-lg font-bold tabular-nums text-teal-300">Měsíční splátku</p>
                  <p className="text-xs text-slate-400">anuita po celou fixaci</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Vidíte</p>
                  <p className="text-lg font-bold tabular-nums">Přeplacení</p>
                  <p className="text-xs text-slate-400">graf + hodnoty v Kč</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CO JE HYPOTÉKA – krátká edukace NAD kalkulačkou */}
        <section className="pb-10">
          <SectionHead title="Co se počítá u hypotéky" desc="Krátké vysvětlení, než si spočítáte vlastní případ." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Hypotéka je dlouhodobý úvěr na bydlení zajištěný nemovitostí. Splácíte ho{' '}
              <strong className="text-slate-900">anuitně</strong> – po celou dobu fixace platíte stejnou
              měsíční splátku, která se skládá z <strong className="text-slate-900">úroku</strong> (cena za
              půjčené peníze) a <strong className="text-slate-900">úmoru jistiny</strong> (snižování dluhu).
            </p>
            <div className="mt-4 rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-900 flex items-center gap-2.5">
              <Info className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Na začátku tvoří většinu splátky <strong>úrok</strong>, ke konci převažuje <strong>úmor jistiny</strong> – proto dluh zpočátku klesá pomalu.</span>
            </div>
          </div>
        </section>

        {/* KALKULAČKA */}
        <section id="kalkulacka" className="pb-10 scroll-mt-16">
          <SectionHead title="Spočítejte si splátku hypotéky" desc="Zadejte cenu nemovitosti, výši úvěru, sazbu a dobu splatnosti. Výsledek i graf se přepočítají hned." />
          <HypotecniKalkulackaWidget />
        </section>

        {/* Z ČEHO SE SKLÁDÁ SPLÁTKA – ikonové vysvětlivky (bez schémat/šipek) */}
        <section className="pb-10">
          <SectionHead title="Z čeho se skládá měsíční splátka" desc="Tři pojmy, které se schovávají za každým číslem v kalkulačce." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="grid sm:grid-cols-3 gap-3">
              {([
                [Banknote, 'Anuitní splátka', 'Stejná částka každý měsíc po celou dobu fixace. Mění se jen poměr úroku a jistiny uvnitř ní.'],
                [Percent, 'Úrok', (
                  <>
                    Cena za půjčené peníze, počítá se z dosud nesplaceného dluhu. Po skončení{' '}
                    <InfoTip label="Fixace je období, po které máte garantovanou neměnnou úrokovou sazbu. Po jejím skončení banka nabídne novou sazbu podle trhu.">fixace</InfoTip>
                    {' '}se může změnit.
                  </>
                )],
                [Wallet, 'Úmor jistiny', 'Část splátky, která reálně snižuje váš dluh. Zpočátku malá, ke konci splácení převažuje.'],
              ] as [typeof Banknote, string, ReactNode][]).map(([Icon, t, d]) => (
                <div key={t} className="rounded-lg bg-slate-50 p-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-teal-700 border border-slate-200 mb-3"><Icon className="w-4 h-4" /></span>
                  <p className="font-medium text-slate-900 text-sm">{t}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VLASTNÍ ZDROJE A LTV – český úhel */}
        <section className="pb-10">
          <SectionHead title="Vlastní zdroje a poměr úvěru k ceně" desc="Kolik banka půjčí a co musíte mít z vlastních peněz." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Banky v Česku obvykle půjčí maximálně 80–90 % ceny nemovitosti – zbytek musíte pokrýt z{' '}
              <strong className="text-slate-900">vlastních zdrojů</strong>. Tento poměr vyjadřuje{' '}
              <InfoTip label="LTV (loan-to-value) = poměr úvěru k ceně nemovitosti. Nižší LTV znamená nižší riziko pro banku a zpravidla lepší sazbu.">poměr úvěru k ceně (LTV)</InfoTip>.
              Čím víc vlastních peněz vložíte, tím nižší LTV, lepší sazba a snazší schválení. Úroky z hypotéky na vlastní bydlení si navíc lze za splnění podmínek odečíst z daní.
            </p>
            <p className="mt-3">
              <Link href="/design-preview/cisty-plat" className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium text-sm">
                Spočítejte si čistý příjem pro posouzení bonity <ArrowRight className="w-4 h-4" />
              </Link>
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
              [ShieldCheck, 'Nezávislý nástroj', 'Bez placeného pořadí a reklamních doporučení.'],
              [Crown, '12 let praxe ve financích', 'Obsah od jmenného autora, ne anonymně.'],
              [Database, 'Ověřená metodika', `Stejný anuitní výpočet jako naše původní kalkulačka. Aktualizováno ${dateStr}.`],
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
              ['/design-preview/investicni-kalkulacka', 'Investiční kalkulačka', TrendingUp],
              ['/design-preview/cisty-plat', 'Kalkulačka čisté mzdy', Wallet],
              ['/design-preview/kalkulacky', 'Další kalkulačky', Calculator],
              ['/design-preview/srovnani', 'Srovnání ETF', Scale],
              ['/design-preview/kde-koupit', 'Kde koupit ETF', Landmark],
              ['/design-preview/pruvodce', 'Co jsou ETF', BookOpen],
            ] as [string, string, typeof Scale][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* E-E-A-T patička + zdroje */}
        <section className="pb-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Kalkulačku stavíme nezávisle – výpočet vychází z ověřeného anuitního umořovacího modelu.
                  <Link href="/design-preview/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Metodika: anuitní splátka s měsíční kapitalizací úroku a umořovacím plánem. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Kalkulačka má orientační charakter, počítá s neměnnou sazbou po celou dobu a nezahrnuje poplatky, pojištění ani změny po refixaci.</p>
            </div>
          </div>
        </section>

        {/* DISCLAIMER – úplný konec obsahu */}
        <section className="pb-12">
          <InvestmentDisclaimer />
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">ETF průvodce.cz</span>
          <p className="max-w-md text-center sm:text-right leading-relaxed">Obsah má vzdělávací charakter a nepředstavuje investiční ani úvěrové doporučení. Skutečné podmínky hypoték se liší podle banky a bonity.</p>
        </div>
      </footer>
    </div>
  );
}
