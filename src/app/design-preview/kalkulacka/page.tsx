import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, CalendarDays, Database, Info, Calculator,
  Percent, Landmark, Wallet, Coins, Layers, Receipt, Scale, ShieldCheck,
  Crown, HelpCircle, BookOpen,
} from 'lucide-react';
import { ter, shortName, SectionHead } from '@/components/design-preview/CategoryUI';
import { getTopETFsForCategory, getTotalETFCount, categoryConfigs , getDataDate } from '@/lib/etf-data';
import { brokers } from '@/data/brokerData';
import FeeCalculatorWidget from '@/components/design-preview/FeeCalculatorWidget';
import InfoTip from '@/components/design-preview/InfoTip';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Kalkulačka poplatků ETF: dopad TER na výnos za 30 let',
  description:
    'Spočítejte v korunách, kolik vás roční poplatek (TER) stojí za 30 let. Srovnání levného ETF vs. bankovní fond + nejlevnější ETF z naší databáze.',
};

/* Brokeři, které na stránce ukážeme – tažené z @/data/brokerData.ts (kontrakt).
   Vybíráme relevantní pro českého investora v pořadí dle zaměření. */
const BROKER_ORDER = ['portu', 'xtb', 'trading212', 'degiro', 'ibkr', 'fio'];

export default async function FeeCalculatorPreview() {
  const cheapest = (await getTopETFsForCategory(categoryConfigs['nejlevnejsi-etf'])).slice(0, 10);
  const totalCount = await getTotalETFCount();

  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const lowestTer = cheapest[0];

  const brokerCards = BROKER_ORDER
    .map((id) => brokers.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  /* Modelový rozdíl pro hero – předpočítaný pro výchozí vstupy kalkulačky
     (250 000 Kč jednorázově + 12 500 Kč/měs, 30 let, 7 % p.a., TER 0,2 % vs 1,8 %).
     Stejná logika jako ve widgetu, jen staticky pro náhled nad ohybem. */
  const modelDiff = (() => {
    const months = 30 * 12;
    const annualReturn = 0.07;
    const run = (terPct: number) => {
      const r = Math.pow(1 + (annualReturn - terPct / 100), 1 / 12) - 1;
      let v = 250000;
      for (let m = 1; m <= months; m++) {
        v *= 1 + r;
        v += 12500;
      }
      return v;
    };
    return run(0.2) - run(1.8);
  })();
  const modelDiffStr = new Intl.NumberFormat('cs-CZ', {
    style: 'currency', currency: 'CZK', maximumFractionDigits: 0,
  }).format(modelDiff);

  /* ---------- FAQ + JSON-LD ---------- */
  const faqs = [
    {
      q: 'Co je TER u ETF?',
      a: 'TER (Total Expense Ratio, česky celková nákladovost) je roční poplatek fondu vyjádřený v procentech z hodnoty vaší investice. Zahrnuje správu, administrativu a audit fondu. TER 0,2 % znamená, že z 250 000 Kč zaplatíte zhruba 500 Kč ročně.',
    },
    {
      q: 'Jak se TER strhává – přijde mi faktura?',
      a: 'Ne. TER se nestrhává jako samostatná platba, ale průběžně a automaticky se odečítá z hodnoty fondu (NAV). Projeví se tak, že výnos fondu je o TER nižší než výnos sledovaného indexu. Žádnou fakturu nedostanete.',
    },
    {
      q: 'Co TER nezahrnuje?',
      a: 'TER nepokrývá poplatek brokera za nákup, spread (rozdíl mezi nákupní a prodejní cenou) ani daně. Celkové náklady na investování = TER + poplatky brokera + spread + daně. Proto se vyplatí vybrat zároveň levný fond i levného brokera.',
    },
    {
      q: 'Jak moc poplatky ovlivní výnos za 30 let?',
      a: 'Zásadně, kvůli složenému úročení. Poplatek se strhává každý rok z celé hodnoty portfolia – i z částky, kterou vám trh předtím vydělal. Rozdíl mezi levným ETF (kolem 0,2 %) a drahým fondem (kolem 1,8 %) může u pravidelného investora za 30 let dělat statisíce až miliony korun. Přesné číslo pro vaše vstupy ukáže kalkulačka výše.',
    },
    {
      q: 'Kolik je u ETF „nízký“ poplatek?',
      a: 'Indexové ETF se obvykle pohybují mezi 0,03 % a 0,30 % ročně. Aktivně spravované bankovní a podílové fondy mívají 1,5–2,5 % ročně a často k tomu vstupní poplatek. Právě tento rozdíl řádu procent dělá při dlouhém horizontu obrovský rozdíl.',
    },
    {
      q: 'Jsou levné ETF horší kvalitou?',
      a: 'Ne nutně. Pasivní ETF s nízkým TER často sledují přesně stejný index jako dražší fondy. Při výběru sledujte velikost fondu, kvalitu sledování indexu (tracking difference) a typ replikace – ne pouze samotný poplatek.',
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
      { '@type': 'ListItem', position: 3, name: 'Kalkulačka poplatků ETF', item: 'https://www.etfpruvodce.cz/kalkulacky/kalkulacka-poplatku-etf' },
    ],
  };

  const terColor = (v: number | null) =>
    v == null ? 'text-slate-500' : v <= 0.15 ? 'text-emerald-600' : v <= 0.35 ? 'text-amber-600' : 'text-red-600';

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
            <Link href="/design-preview/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/design-preview/kalkulacky" className="hover:text-slate-600">Kalkulačky</Link>
          <span>/</span>
          <span className="text-slate-600">Kalkulačka poplatků ETF</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Kalkulačka poplatků ETF</h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Spočítejte si, kolik vás roční poplatek (
                  <InfoTip label="Total Expense Ratio — roční nákladovost fondu v % z hodnoty investice; strhává se průběžně z fondu, ne fakturou.">TER</InfoTip>
                  ) reálně stojí za 30 let – v přepočtu na koruny.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/design-preview/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                  <span className="inline-flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> Výnosy přepočtené do Kč</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href="#kalkulacka" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">Spustit kalkulačku</Link>
                  <Link href="/design-preview/srovnani" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Najít levný ETF</Link>
                </div>
              </div>

              {/* Živé mini-metriky */}
              <div className="mt-6 md:mt-0 md:w-72 shrink-0 grid grid-cols-3 md:grid-cols-1 gap-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Nejlevnější ETF (TER)</p>
                  <p className="text-lg font-bold tabular-nums">{ter(lowestTer?.ter_numeric ?? null)}</p>
                  <p className="text-xs text-slate-400">{lowestTer?.primary_ticker ?? '—'}</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Typický bankovní fond</p>
                  <p className="text-lg font-bold tabular-nums">~1,8 %</p>
                  <p className="text-xs text-slate-400">aktivní správa</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Modelový rozdíl / 30 let</p>
                  <p className="text-lg font-bold tabular-nums text-emerald-400">{modelDiffStr}</p>
                  <p className="text-xs text-slate-400">výchozí vstupy</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROČ NA TER ZÁLEŽÍ – edukace NAD kalkulačkou */}
        <section className="pb-10">
          <SectionHead title="Proč na TER záleží" desc="Krátké vysvětlení, než si spočítáte vlastní případ." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Poplatek se strhává <strong className="text-slate-900">každý rok z celé hodnoty portfolia</strong> – i z částky,
              kterou vám trh předtím vydělal. Tomu se říká složené úročení poplatku a pracuje proti vám.
            </p>


            {/* Důsledek */}
            <div className="mt-3 rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-900 flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Čím delší horizont, tím větší rozdíl – za desítky let <strong>statisíce až miliony korun</strong>.</span>
            </div>

            {/* Tři pointy s ikonami */}
            <ul className="mt-5 grid sm:grid-cols-3 gap-3">
              {([
                [Coins, 'Strhává se z celku', 'Ne jen z výnosu, ale z celé hodnoty fondu, rok co rok.'],
                [TrendingUp, 'Bere i budoucí výnos', 'Peníze sebrané poplatkem už pro vás dál nevydělávají.'],
                [CalendarDays, 'Násobí se časem', 'Čím delší horizont, tím větší rozdíl mezi levným a drahým fondem.'],
              ] as [typeof Coins, string, string][]).map(([Icon, t, d]) => (
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
          <SectionHead title="Spočítejte si dopad poplatku" desc="Zadejte svůj případ. Stejný vklad i výnos trhu, jediný rozdíl je roční poplatek." />
          <FeeCalculatorWidget />
        </section>

        {/* CO JE TER – edukace vetkaná */}
        <section className="pb-10">
          <SectionHead title="Co je TER" desc="Pojem, který se schovává za každým číslem v kalkulačce." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong className="text-slate-900">TER (Total Expense Ratio, česky celková nákladovost)</strong> je roční
              poplatek fondu vyjádřený v procentech z hodnoty investice. Nestrhává se jako samostatná platba – odečítá se{' '}
              automaticky a průběžně z hodnoty fondu (
              <InfoTip label="Net Asset Value — čistá hodnota aktiv fondu připadající na jeden podíl; z ní se TER průběžně odečítá.">NAV</InfoTip>
              ), takže žádná faktura vám nepřijde. Příklad v korunách:{' '}
              <strong className="text-slate-900">TER 0,2 % u 250 000 Kč = 500 Kč ročně</strong>.
            </p>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {([
                [Layers, 'Co TER zahrnuje', 'Správu fondu, administrativu a audit – běžný provoz, který platíte vždy.'],
                [Receipt, 'Co TER nezahrnuje', (
                  <>
                    Poplatek brokera,{' '}
                    <InfoTip label="Rozdíl mezi nákupní a prodejní cenou ETF; skrytý náklad navíc k TER a poplatku brokera.">spread</InfoTip>
                    {' '}a daně. Celkové náklady = TER + broker + spread + daně.
                  </>
                )],
                [Percent, 'Kolik je hodně', 'Indexové ETF 0,03–0,30 %. Bankovní a podílové fondy 1,5–2,5 % + často vstupní poplatek.'],
              ] as [typeof Layers, string, ReactNode][]).map(([Icon, t, d]) => (
                <div key={t} className="rounded-lg bg-slate-50 p-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-teal-700 border border-slate-200 mb-3"><Icon className="w-4 h-4" /></span>
                  <p className="font-medium text-slate-900 text-sm">{t}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ČESKÝ DAŇOVÝ + NÁKLADOVÝ ÚHEL */}
        <section className="pb-10">
          <SectionHead title="Poplatky nejsou jediný náklad" desc="Český investor řeší kromě TER i brokera a daně." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              TER je jen jedna část skládačky. Na celkové náklady investování se skládá víc položek:
            </p>

            {/* Schéma: skládačka celkových nákladů */}
            <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
              {([
                [Percent, 'TER', 'poplatek fondu'],
                [Landmark, 'Poplatek brokera', 'za nákup'],
                [Scale, 'Spread', 'rozdíl cen'],
                [Receipt, 'Daň', 'při prodeji do 3 let'],
              ] as [typeof Percent, string, string][]).map(([Icon, t, d], i) => (
                <div key={t} className="flex items-stretch sm:items-center gap-2">
                  {i > 0 && <span className="text-slate-300 font-semibold self-center px-0.5">+</span>}
                  <div className="flex-1 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 min-w-[7.5rem]">
                    <span className="flex items-center gap-1.5 font-medium text-slate-900 text-sm"><Icon className="w-4 h-4 text-teal-700 shrink-0" /> {t}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{d}</span>
                  </div>
                </div>
              ))}
              <span className="text-slate-300 font-semibold self-center px-0.5 hidden sm:inline">=</span>
              <div className="rounded-lg bg-teal-50 border border-teal-200 px-3 py-2.5 min-w-[7.5rem]">
                <span className="flex items-center gap-1.5 font-medium text-teal-900 text-sm"><Coins className="w-4 h-4 text-teal-700 shrink-0" /> Celkové náklady</span>
                <span className="block text-xs text-teal-700/80 mt-0.5">to, co reálně zaplatíte</span>
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-600 leading-relaxed">
              U českého investora dokresluje obrázek <strong className="text-slate-900">daňový režim</strong>: zisk z prodeje
              ETF je podle § 4 zákona o daních z příjmů osvobozen, pokud fond držíte déle než 3 roky (časový test). Při prodeji
              do 3 let se zisk daní sazbou 15 %. Proto se pro dlouhodobé držení hodí levný{' '}
              <InfoTip label="Akumulační ETF dividendy reinvestuje uvnitř fondu — neřešíte každoroční zdanění výplat ani řádky v přiznání.">akumulační</InfoTip>
              {' '}ETF.
            </p>
            <p className="mt-3">
              <Link href="/design-preview/pruvodce" className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium text-sm">
                Více o daních a fungování ETF <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </section>

        {/* POPLATKY BROKERŮ */}
        <section className="pb-10">
          <SectionHead title="Poplatky brokerů" desc="Navazující náklad – kde ETF nakoupíte za nejméně." href="/design-preview/kde-koupit" hrefLabel="srovnání brokerů" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brokerCards.map((b) => {
              const recommended = b.id === 'portu' || b.id === 'xtb' || b.id === 'trading212';
              return (
                <div key={b.id} className={`rounded-lg border bg-white p-4 transition-colors hover:border-teal-300 ${recommended ? 'border-teal-200' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">{b.name}</h3>
                    {recommended && (
                      <span className="rounded-full bg-teal-50 text-teal-700 text-[11px] font-medium px-2 py-0.5 border border-teal-200">Nízké poplatky</span>
                    )}
                  </div>
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500">Nákup ETF</dt>
                      <dd className="text-slate-800 text-right font-medium">{b.etfFee}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500">Konverze měn</dt>
                      <dd className="text-slate-800 text-right font-medium">{b.fxFee}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500">Daň z dividend</dt>
                      <dd className="text-slate-800 text-right font-medium">{b.czDividends}</dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Údaje jsou orientační a tažené z naší databáze brokerů. Aktuální ceník vždy ověřte u brokera. Aktualizováno {dateStr}.
          </p>
        </section>

        {/* NEJLEVNĚJŠÍ ETF Z DB */}
        <section className="pb-10">
          <SectionHead title="Nejlevnější ETF" desc="Reálně seřazené podle TER vzestupně z naší databáze – už víte, že poplatek bolí, tady jsou ty nejlevnější." href="/design-preview/srovnani" hrefLabel="srovnat vše" />

          {cheapest.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              Data se nepodařilo načíst. Zkuste obnovit stránku.
            </div>
          ) : (
            <>
              {/* Desktop tabulka */}
              <div className="hidden sm:block rounded-lg border border-slate-200 bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-left">
                      <th className="py-3 px-4 font-medium w-8">#</th>
                      <th className="py-3 px-4 font-medium">Fond</th>
                      <th className="py-3 px-4 font-medium text-right">TER</th>
                      <th className="py-3 px-4 font-medium">Kategorie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cheapest.map((e, i) => (
                      <tr key={e.isin} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-4 text-slate-400 tabular-nums">{i + 1}</td>
                        <td className="py-2.5 px-4">
                          <Link href={`/design-preview/etf/${e.isin}`} className="block group">
                            <span className="font-medium text-slate-900 group-hover:text-teal-700">{e.primary_ticker ?? shortName(e.name)}</span>
                            <span className="block text-xs text-slate-400 truncate max-w-xs">{shortName(e.name)}</span>
                          </Link>
                        </td>
                        <td className={`py-2.5 px-4 text-right font-semibold tabular-nums ${terColor(e.ter_numeric)}`}>{ter(e.ter_numeric)}</td>
                        <td className="py-2.5 px-4 text-slate-600">{e.category ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobil karty */}
              <div className="sm:hidden space-y-2">
                {cheapest.map((e, i) => (
                  <Link key={e.isin} href={`/design-preview/etf/${e.isin}`} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
                    <span className="text-xs text-slate-400 tabular-nums w-4 shrink-0">{i + 1}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-medium text-slate-900 truncate">{e.primary_ticker ?? shortName(e.name)}</span>
                      <span className="block text-xs text-slate-400 truncate">{shortName(e.name)}</span>
                    </span>
                    <span className={`shrink-0 font-semibold tabular-nums ${terColor(e.ter_numeric)}`}>{ter(e.ter_numeric)}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          <div className="mt-4">
            <Link href="/design-preview/srovnani" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800">
              Zobrazit všech {totalCount > 0 ? `${totalCount}+ ` : ''}ETF <ArrowRight className="w-4 h-4" />
            </Link>
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
              [Database, 'Aktuální data', `Nejlevnější ETF i brokeři z vlastní databáze, aktualizováno ${dateStr}.`],
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
              ['/design-preview/nejlepsi-etf/nejlevnejsi-etf', 'Nejlevnější ETF', Wallet],
              ['/design-preview/srovnani', 'Srovnání ETF', Scale],
              ['/design-preview/kde-koupit', 'Kde koupit ETF', Landmark],
              ['/design-preview/nejlepsi-etf/nejlepsi-etf-2026', 'Nejlepší ETF 2026', TrendingUp],
              ['/design-preview/pruvodce', 'Co jsou ETF', BookOpen],
              ['/design-preview/kalkulacky', 'Další kalkulačky', Calculator],
            ] as [string, string, typeof Wallet][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* E-E-A-T patička + disclaimer DOLE */}
        <section className="pb-12">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Kalkulačku i srovnání stavíme nezávisle, na základě veřejných dat – bez placeného pořadí.
                  <Link href="/design-preview/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroje: justETF, vlastní databáze ETF a brokerů, ČNB. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Kalkulačka má vzdělávací charakter a pracuje s modelovým výnosem – skutečné výnosy se liší a nelze je zaručit. Obsah nepředstavuje investiční doporučení. Minulá výkonnost nezaručuje budoucí výnosy. Investice do ETF nesou riziko ztráty.</p>
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
