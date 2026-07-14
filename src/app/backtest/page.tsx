import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, CalendarDays, Database, Info, Calculator,
  Coins, Wallet, Scale, Landmark, ShieldCheck, Crown, HelpCircle, BookOpen,
  History, Repeat, LineChart,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InfoTip from '@/components/design-preview/InfoTip';
import BacktestWidget from '@/components/design-preview/BacktestWidget';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate, getTotalETFCount } from '@/lib/etf-data';
import { ogImage } from '@/lib/ogImage';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Backtest portfolia ETF: historický test výnosů a poklesů',
  description:
    'Otestujte své ETF portfolio na reálných datech od roku 2000. Roční zhodnocení, největší pokles a kolísavost – v přepočtu na koruny, včetně grafu vývoje.',
  openGraph: {
    title: 'Backtest portfolia ETF: výnosy a propady v korunách',
    description:
      'Otestujte své portfolio na reálných denních datech od roku 2000 – zhodnocení, největší pokles a kolísavost v Kč.',
    url: 'https://etfpruvodce.cz/backtest',
    type: 'website',
    images: [ogImage({ title: 'Backtest portfolia ETF: výnosy a propady v korunách', eyebrow: 'Nástroj zdarma', stat: '2000–2026', statLabel: 'reálná denní data, výsledky v Kč' })],
  },
};

export default async function BacktestPreview() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  const etfCount = await getTotalETFCount();
  const etfCountLabel = etfCount > 0 ? etfCount.toLocaleString('cs-CZ') : '4 800';

  /* ---------- FAQ + JSON-LD ---------- */
  const faqs = [
    {
      q: 'Co je backtest portfolia?',
      a: 'Backtest je historický test investiční strategie – ukáže, jak by se vaše portfolio chovalo v minulosti na reálných tržních datech. Pomáhá pochopit, jak silně portfolio kolísalo, jaké zažilo propady a jakým tempem dlouhodobě rostlo. Důležité je, že minulá výkonnost nezaručuje budoucí výnosy.',
    },
    {
      q: 'Odkud bere kalkulačka historická data?',
      a: 'Pracujeme s historickými daty indexů od roku 2000 (S&P 500, MSCI World, rozvíjející se trhy, státní i firemní dluhopisy, zlato a komodity). Data jsou vedena v eurech a do korun či dolarů se přepočítávají historickými kurzy ECB a ČNB. Výpočet běží na našem serveru, ne z odhadu – jde o stejná data jako v plné verzi nástroje.',
    },
    {
      q: 'Co znamená roční zhodnocení (CAGR)?',
      a: 'Roční zhodnocení (CAGR) je průměrné roční tempo růstu portfolia se zohledněním složeného úročení. Na rozdíl od prostého průměru přesně ukazuje, jakým tempem hodnota skutečně rostla rok za rokem. Roční zhodnocení 7 % znamená, že portfolio v průměru každý rok narostlo o 7 % včetně reinvestovaných výnosů.',
    },
    {
      q: 'Co je maximální pokles a proč na něm záleží?',
      a: 'Maximální pokles (anglicky drawdown) je největší propad hodnoty portfolia od předchozího vrcholu po dno. Ukazuje nejhorší situaci, kterou byste v daném období zažili. Pokud portfolio kleslo o 50 %, znamená to, že dočasně ztratilo polovinu hodnoty – a právě toto číslo prozradí, kolik nervů by takové držení vyžadovalo.',
    },
    {
      q: 'Co je vyvážení portfolia (rebalancing)?',
      a: 'Vyvážení je pravidelné obnovení původních vah jednotlivých složek. Když například akcie vyrostou rychleji než dluhopisy, portfolio se vychýlí od poměru 60/40. Vyvážením část akcií prodáte a dokoupíte dluhopisy, čímž udržíte zamýšlenou míru rizika. Tento backtest standardně vyvažuje jednou ročně.',
    },
    {
      q: 'Jsou výsledky backtestu spolehlivé pro budoucnost?',
      a: 'Ne zcela. Backtest ukazuje minulost, ne budoucnost. Hlavní omezení: minulé výnosy se nemusí opakovat, výpočet nezahrnuje poplatky brokera, spready ani daně a nepočítá s nepředvídatelnými událostmi. Backtest je užitečný k pochopení povahy strategie – jak kolísá a jak hluboké propady přináší – nikoli jako předpověď.',
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
      { '@type': 'ListItem', position: 3, name: 'Backtest portfolia ETF', item: 'https://etfpruvodce.cz/kalkulacky/backtest-portfolia' },
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
          <span className="text-slate-600">Backtest portfolia</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div>
              <div className="max-w-2xl">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Backtest portfolia ETF</h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Zadáte portfolio, my ukážeme, jak by obstálo v minulosti (
                  <InfoTip label="Backtest = historický test strategie. Ukáže, jak by se portfolio chovalo v minulosti – kolik vydělalo, jak kolísalo a jak hluboko klesalo.">backtest</InfoTip>
                  ) – výnos, propady i kolísavost na reálných datech od roku 2000, v korunách.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                  <span className="inline-flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> Výnosy přepočtené do Kč</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href="#backtest" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">Spustit backtest</Link>
                  <Link href="/srovnani" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Najít ETF do portfolia</Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Sekce „Co vám backtest ukáže" odstraněna – 3 pojmy (CAGR/propad/kolísavost)
            vysvětlují ⓘ tooltipy přímo u výsledku, sekce jen tlačila nástroj dolů. */}

        {/* NÁSTROJ */}
        <section id="backtest" className="pb-10 scroll-mt-16">
          <SectionHead title="Sestavte a otestujte portfolio" desc="Vyberte fondy a váhy, zadejte období a vklady. Výpočet běží na reálných historických datech." />
          <BacktestWidget />
        </section>

        {/* JAK BACKTEST ČÍST – edukace vetkaná (ikonové karty) */}
        <section className="pb-10">
          <SectionHead title="Jak výsledky správně číst" desc="Backtest je mapa minulosti, ne věštba. Tři věci, na které nezapomenout." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Historie ukazuje povahu strategie – jak rostla, jak kolísala a jak hluboké propady přinášela. Neříká ale, co bude.
              Trh se v dalších letech může chovat úplně jinak a backtest <strong className="text-slate-900">nezahrnuje poplatky brokera, spready ani daně</strong>.
            </p>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {([
                [History, 'Ukazuje minulost', 'Reálná data, ale jen do včerejška. Budoucnost se může lišit – černé labutě nikdo nenastaví dopředu.'],
                [Repeat, 'Standardně vyvažuje ročně', (
                  <>Portfolio se jednou za rok vrací k zadaným vahám (<InfoTip label="Vyvážení – obnovení původních vah. Prodá to, co vyrostlo, dokoupí to, co zaostalo, a drží míru rizika.">vyvážení</InfoTip>), aby si drželo zamýšlenou míru rizika.</>
                )],
                [LineChart, 'Sledujte i propady', 'Vysoký výnos s 50% propadem se těžko drží. Důležitá je dvojice výnos + největší pokles, ne jen jedno číslo.'],
              ] as [typeof History, string, ReactNode][]).map(([Icon, t, d]) => (
                <div key={t} className="rounded-lg bg-slate-50 p-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-teal-700 border border-slate-200 mb-3"><Icon className="w-4 h-4" /></span>
                  <p className="font-medium text-slate-900 text-sm">{t}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
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
              [ShieldCheck, 'Reálná historická data', 'Indexy od roku 2000, kurzy ECB/ČNB – ne odhad ani vymyšlená čísla.'],
              [Crown, '12 let praxe ve financích', 'Obsah od jmenného autora, ne anonymně.'],
              [Database, 'Vlastní databáze ETF', `${etfCountLabel} fondů a brokeři z naší databáze. Aktualizováno ${dateStr}.`],
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
              ['/kolik-vydelaly-etf', 'Kolik vydělaly akcie v Kč', TrendingUp],
              ['/investicni-kalkulacka', 'Investiční kalkulačka', Calculator],
              ['/kalkulacka', 'Kalkulačka poplatků', Wallet],
              ['/portfolio-strategie', 'Modelová portfolia', Scale],
              ['/srovnani', 'Srovnání ETF', TrendingUp],
              ['/kde-koupit', 'Kde koupit ETF', Landmark],
              ['/pruvodce', 'Co jsou ETF', BookOpen],
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
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Nástroj i data stavíme nezávisle, na základě veřejných historických dat – bez placeného pořadí.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroje: historická data indexů od roku 2000, kurzy ECB a ČNB, vlastní databáze ETF a brokerů. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Backtest pracuje s minulými daty a slouží ke vzdělávání. Nezahrnuje poplatky brokera, spready ani daně. <strong>Minulá výkonnost nezaručuje budoucí výnosy a backtest není předpovědí.</strong> Obsah nepředstavuje investiční doporučení. Investice do ETF nesou riziko ztráty.</p>
            </div>
          </div>
        </section>

        {/* DISCLAIMER – úplný konec obsahu */}
        <section className="pb-12">
          <InvestmentDisclaimer />
        </section>
      </main>

    </div>
  );
}
