import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';

/* Rozcestník článků a nástrojů, které odpovídají na otázky investora DATY V KORUNÁCH.
   PROČ: tyto stránky byly z navigace nedostupné – na DCA vedl jediný odkaz (z homepage),
   z detailů fondů za 90 dní 0 prokliků (deep dive 17. 10. 2026). Texty karet záměrně
   bez čísel: čísla žijí v článcích, kde prošla ověřením (pravidlo č. 1, CLAUDE.md). */

export const metadata: Metadata = {
  title: 'Co říkají data: výnosy ETF v korunách a odpovědi pro české investory',
  description: 'Kolik ETF reálně vydělaly v korunách, jak kurz koruny mění výnos, naráz nebo postupně, akumulační nebo distribuční – odpovědi z dat a výzkumů, přepočtené pro českého investora.',
  alternates: { canonical: '/co-rikaji-data' },
};

const SKUPINY: { nadpis: string; popis: string; polozky: { href: string; titulek: string; text: string }[] }[] = [
  {
    nadpis: 'Kolik se dá vydělat – v korunách',
    popis: 'Výnosy po přepočtu do Kč, tedy tak, jak je uvidíte na účtu.',
    polozky: [
      { href: '/stroj-casu', titulek: 'Korunový stroj času', text: 'Kolik byste dnes měli, kdybyste začali investovat od roku 2000, 2010 nebo 2016 – v korunách.' },
      { href: '/kolik-vydelaly-etf', titulek: 'Kolik vydělaly ETF a akcie', text: 'Datový rozbor výnosů hlavních trhů v korunách za posledních zhruba 18 let.' },
      { href: '/backtest', titulek: 'Backtest portfolia', text: 'Otestujte vlastní složení na historických datech – výnos, propady a krize v Kč.' },
      { href: '/infografiky', titulek: 'Infografiky', text: 'Výkonnost, poplatky a tržní heatmapa na jeden pohled.' },
    ],
  },
  {
    nadpis: 'Rozhodnutí, která řeší každý investor',
    popis: 'Co k nim říkají výzkumy a jak vychází pro investora v korunách.',
    polozky: [
      { href: '/dca-vs-jednorazova', titulek: 'Naráz, nebo postupně?', text: 'Jednorázová investice proti průměrování (DCA) – co říkají data a co ne.' },
      { href: '/menove-riziko-etf', titulek: 'Měnové riziko', text: 'Jak kurz koruny mění výnos zahraničních ETF a kdy dává smysl zajištěný fond.' },
      { href: '/akumulacni-vs-distribucni-etf', titulek: 'Akumulační, nebo distribuční?', text: 'Reinvestovat dividendy, nebo je vyplácet – a co to znamená pro daně v Česku.' },
      { href: '/etf-vs-akcie', titulek: 'ETF, nebo jednotlivé akcie?', text: 'Srovnání pro začátečníka s daty v korunách.' },
      { href: '/fire', titulek: 'Finanční nezávislost (FIRE)', text: 'Kolik potřebujete na finanční nezávislost v českých podmínkách.' },
      { href: '/kolik-investovat-mesicne', titulek: 'Kolik investovat měsíčně', text: 'Kolik odkládat na milion nebo na rentu – spočítané v korunách.' },
      { href: '/dip', titulek: 'DIP: vyplatí se?', text: 'Dlouhodobý investiční produkt – daňové výhody a pro koho dávají smysl.' },
      { href: '/investovani-pro-deti', titulek: 'Investování pro děti', text: 'Kolik se dá naspořit do 18 let a jak účet založit.' },
    ],
  },
  {
    nadpis: 'Jaký fond vybrat',
    popis: 'Rozdíly mezi indexy a fondy, které se nejčastěji porovnávají.',
    polozky: [
      { href: '/svetove-etf-indexy', titulek: 'Světové indexy', text: 'MSCI World, FTSE All-World, ACWI a S&P 500 – v čem se liší.' },
      { href: '/jaky-sp500-etf', titulek: 'Který S&P 500 ETF', text: 'CSPX, VUAA, VUSA a SPYL vedle sebe – poplatky a výnos v Kč.' },
      { href: '/faktorove-etf', titulek: 'Faktorové ETF', text: 'Value, momentum, kvalita a další faktory – co skutečně ukazují data v korunách.' },
    ],
  },
];

export default function CoRikajiData() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
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

      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-20">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link><span>/</span>
          <span className="text-slate-700">Co říkají data</span>
        </nav>

        <section className="py-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">Co říkají data</h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Odpovědi na otázky, které řeší každý investor – z dat a výzkumů, přepočtené do korun.
            Zahraniční studie počítají v dolarech; pro českého investora mění výsledek i kurz koruny.
          </p>
        </section>

        <div className="space-y-10">
          {SKUPINY.map((g) => (
            <section key={g.nadpis}>
              <h2 className="text-xl font-bold tracking-tight">{g.nadpis}</h2>
              <p className="mt-1 text-sm text-slate-500">{g.popis}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.polozky.map((p) => (
                  <Link key={p.href} href={p.href} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-slate-900">{p.titulek}</span>
                      <ArrowUpRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-teal-700" />
                    </span>
                    <span className="mt-1.5 text-sm text-slate-600 leading-relaxed">{p.text}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
