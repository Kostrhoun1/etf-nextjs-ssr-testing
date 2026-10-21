import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, ArrowRight, Calculator, Percent, Coins, Dice5, History,
  Flame, ShieldAlert, Receipt, Home, Landmark, LineChart, BarChart3,
  PieChart, BookOpen, Wallet,
} from 'lucide-react';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getTotalETFCount } from '@/lib/etf-data';

export const revalidate = 86400;

const DAN_ROK = new Date().getFullYear();

export const metadata: Metadata = {
  title: 'Kalkulačky a nástroje pro investory',
  description:
    `Kalkulačky pro investory: složené úročení, poplatky ETF, kurzový dopad, Monte Carlo, FIRE, hypotéka i čistá mzda ${DAN_ROK}. Všechny výsledky v korunách.`,
  alternates: { canonical: '/kalkulacky' },
};

/* Cílové routy v náhledové větvi (na ostrém webu se přemapují 1:1). */
/** `detail` = co nástroj spočítá a z čeho (SEO audit 20. 10. 2026: rozcestník byl tenký – jen jedna věta u položky). */
type Tool = { href: string; title: string; desc: string; detail?: string; icon: typeof Calculator };
type Group = { title: string; intro: string; icon: typeof Calculator; tools: Tool[] };

const GROUPS: Group[] = [
  {
    title: 'Investování do ETF',
    icon: LineChart,
    intro: 'Spočítejte, jak vám peníze porostou, kolik vás stojí poplatky a jak výnos ovlivní kurz koruny.',
    tools: [
      {
        href: '/investicni-kalkulacka',
        title: 'Investiční kalkulačka',
        desc: 'Kolik naspoříte pravidelným vkladem díky složenému úročení.',
        detail: 'Zadáte jednorázový a pravidelný vklad, jeho frekvenci, dobu a očekávaný roční výnos. Ukáže hodnotu na konci, kolik jste vložili a kolik tvoří výnos.',
        icon: Calculator,
      },
      {
        href: '/kalkulacka',
        title: 'Kalkulačka poplatků ETF',
        desc: 'Dopad ročního poplatku (TER) na váš výnos za desítky let.',
        detail: 'Zadáte investici, měsíční vklad, dobu, očekávaný výnos a roční poplatky (TER) k porovnání. Ukáže, kolik korun vás rozdíl v poplatku za celou dobu stojí.',
        icon: Percent,
      },
      {
        href: '/kurzovy-dopad',
        title: 'Kurzový dopad ETF',
        desc: 'Jak pohyb kurzu USD/CZK mění výnos přepočtený do korun.',
        detail: 'Zadáte hodnotu portfolia a podíl v dolarech, eurech a korunách. Ukáže, jak se hodnota v korunách mění při posílení nebo oslabení koruny, i na historických scénářích.',
        icon: Coins,
      },
      {
        href: '/monte-carlo',
        title: 'Monte Carlo simulátor',
        desc: 'Pravděpodobnostní scénáře vývoje portfolia, ne jediné číslo.',
        detail: 'Složíte portfolio z tříd aktiv (akcie, dluhopisy, zlato…) a zadáte vklady. Simulace mnoha možných průběhů ukáže rozpětí výsledků a pravděpodobnost dosažení cíle.',
        icon: Dice5,
      },
      {
        href: '/backtest',
        title: 'Backtest portfolia',
        desc: 'Otestujte složení portfolia na historických datech trhu.',
        detail: 'Složíte portfolio z indexů a nastavíte vklady a vyvažování. Spočítá vývoj v korunách na skutečných historických datech – roční zhodnocení, největší propady a kolísavost.',
        icon: History,
      },
    ],
  },
  {
    title: 'Plánování a renta',
    icon: Flame,
    intro: 'Zjistěte, kolik potřebujete k finanční nezávislosti a jak velkou rezervu si držet.',
    tools: [
      {
        href: '/fire',
        title: 'Průvodce FIRE',
        desc: 'Kompletní český pilíř: kolik potřebujete, míra úspor, role ETF a daně.',
        detail: 'Rozbor finanční nezávislosti v českých podmínkách: kolik majetku je potřeba, jakou roli hraje míra úspor, ETF a daně.',
        icon: BookOpen,
      },
      {
        href: '/fire-kalkulacka',
        title: 'FIRE kalkulačka',
        desc: 'Kdy a s jakým majetkem dosáhnete finanční nezávislosti.',
        detail: 'Zadáte věk, úspory, měsíční investice, inflaci a strategii. Spočítá, kdy a s jakým majetkem byste mohli žít z výnosů, i s jednorázovými výdaji nebo příjmy.',
        icon: Flame,
      },
      {
        href: '/nouzova-rezerva',
        title: 'Nouzová rezerva',
        desc: 'Kolik peněz si držet stranou pro nečekané výdaje.',
        detail: 'Zadáte měsíční výdaje, úspory, spoření, počet osob a stabilitu příjmu. Spočítá velikost rezervy v korunách i v měsících výdajů.',
        icon: ShieldAlert,
      },
    ],
  },
  {
    title: 'Osobní finance',
    icon: Wallet,
    intro: 'Praktické výpočty kolem mzdy, hypotéky a úvěru – aby vám na investování zbylo.',
    tools: [
      {
        href: '/cisty-plat',
        title: `Čistá mzda ${DAN_ROK}`,
        desc: 'Kolik vám z hrubé mzdy zbude po dani a odvodech.',
        detail: 'Zadáte hrubou mzdu a počet dětí. Spočítá čistou mzdu, pojistné a daň po slevách podle pravidel pro daný rok.',
        icon: Receipt,
      },
      {
        href: '/hypotecni-kalkulacka',
        title: 'Hypoteční kalkulačka',
        desc: 'Měsíční splátka hypotéky podle výše úvěru a sazby.',
        detail: 'Zadáte cenu nemovitosti, výši úvěru, sazbu a dobu splatnosti. Spočítá měsíční splátku a kolik celkem zaplatíte na úrocích.',
        icon: Home,
      },
      {
        href: '/uverova-kalkulacka',
        title: 'Úvěrová kalkulačka',
        desc: 'Splátka a celkové náklady spotřebitelského úvěru.',
        detail: 'Zadáte výši úvěru, sazbu a dobu splácení. Spočítá měsíční splátku a celkové náklady úvěru.',
        icon: Landmark,
      },
    ],
  },
];

const toolCount = GROUPS.reduce((n, g) => n + g.tools.length, 0);

/** Šířka buňky v 6sloupcové mřížce: po třech (span 2); zbylé 2 přes polovinu (span 3), zbylá 1 přes celou šířku. */
function bunka(i: number, n: number): string {
  const zbytek = n % 3;
  const vPosledniRade = i >= n - zbytek;
  const lg = !zbytek || !vPosledniRade ? 'lg:col-span-2' : zbytek === 2 ? 'lg:col-span-3' : 'lg:col-span-6';
  const sm = n % 2 === 1 && i === n - 1 ? 'sm:col-span-2' : '';
  return `${lg} ${sm}`.trim();
}

const kamDalItems = (countLabel: string): { href: string; label: string; desc: string; icon: typeof Calculator }[] => [
  { href: '/srovnani', label: 'Srovnání ETF fondů', desc: `Porovnejte ${countLabel} fondů podle vlastních kritérií.`, icon: BarChart3 },
  { href: '/portfolio-strategie', label: 'Modelová portfolia', desc: 'Hotové strategie složené z ETF na míru cíli.', icon: PieChart },
  { href: '/pruvodce', label: 'Co jsou ETF', desc: 'Základy fungování ETF srozumitelně pro začátečníky.', icon: BookOpen },
];

export default async function KalkulackyPage() {
  const etfCount = await getTotalETFCount();
  const KAM_DAL = kamDalItems(etfCount > 0 ? `${(Math.floor(etfCount / 100) * 100).toLocaleString('cs-CZ')}+` : '4 800+');
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Kalkulačky', item: 'https://etfpruvodce.cz/kalkulacky' },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kalkulačky a nástroje pro investory',
    description:
      'Rozcestník kalkulaček pro investory do ETF i osobní finance: složené úročení, poplatky, kurzový dopad, FIRE, hypotéka a další.',
    hasPart: GROUPS.map((g) => ({
      '@type': 'ItemList',
      name: g.title,
      itemListElement: g.tools.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: t.title,
        url: `https://etfpruvodce.cz${t.href}`,
      })),
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Header – stejná navigace jako ostatní náhledy */}
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

      <main id="obsah" className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <span className="text-slate-700">Kalkulačky</span>
        </nav>

        {/* Hero / H1 + co tu uživatel najde */}
        <section className="py-8 md:py-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Kalkulačky a nástroje pro investory
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 leading-relaxed">
            Na jednom místě najdete nástroje pro výpočet výnosů, poplatků i plánování renty –
            a k tomu praktické kalkulačky kolem mzdy, hypotéky a úvěru. Výnosy počítáme
            v přepočtu na koruny, ať vidíte reálný dopad na vaši peněženku.
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
            <span>{toolCount} kalkulaček a nástrojů</span>
            <span aria-hidden>·</span>
            <span>{GROUPS.length} tematické oblasti</span>
            <span aria-hidden>·</span>
            <span>výnosy přepočtené do korun</span>
          </p>
        </section>

        {/* Skupiny kalkulaček */}
        {GROUPS.map((g) => (
          <section key={g.title} className="pb-10">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700">
                <g.icon className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{g.title}</h2>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-slate-600 leading-relaxed">{g.intro}</p>
            {/* SEO audit 6b (art director): 5 nástrojů v mřížce po 3 nechávalo prázdné místo → 6sloupcová mřížka,
                poslední dva přes 3 sloupce (3 + 2 bez díry); na tabletu lichý poslední přes celou šířku. */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {g.tools.map((t, i) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`${bunka(i, g.tools.length)} group flex flex-col rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all`}
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3 group-hover:bg-teal-100 transition-colors">
                    <t.icon className="w-5 h-5" />
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">{t.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 transition-all group-hover:text-teal-700 group-hover:translate-x-0.5" />
                  </span>
                  <span className="block text-xs text-slate-500 mt-1 leading-snug">{t.desc}</span>
                  {t.detail && <span className="block text-xs text-slate-600 mt-2 leading-relaxed">{t.detail}</span>}
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Kam dál */}
        <section className="pb-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Kam dál</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {KAM_DAL.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group flex flex-col rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3 group-hover:bg-teal-100 transition-colors">
                  <l.icon className="w-5 h-5" />
                </span>
                <span className="block text-sm font-semibold text-slate-900">{l.label}</span>
                <span className="block text-xs text-slate-500 mt-1 leading-snug">{l.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Disclaimer na úplný konec */}
        <section className="pb-12">
          <InvestmentDisclaimer variant="box" />
        </section>
      </main>

    </div>
  );
}
