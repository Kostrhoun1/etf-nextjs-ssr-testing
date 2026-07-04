import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, Calculator, Percent, Coins, Dice5, History,
  Flame, ShieldAlert, Receipt, Home, Landmark, LineChart, BarChart3,
  PieChart, BookOpen, Wallet,
} from 'lucide-react';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Kalkulačky a nástroje pro investory | ETF průvodce',
  description:
    'Rozcestník kalkulaček pro investory: složené úročení, poplatky ETF, kurzový dopad do korun, Monte Carlo, FIRE, hypotéka i čistá mzda 2025. Vše přehledně na jednom místě.',
  alternates: { canonical: '/design-preview/kalkulacky' },
};

/* Cílové routy v náhledové větvi (na ostrém webu se přemapují 1:1). */
type Tool = { href: string; title: string; desc: string; icon: typeof Calculator };
type Group = { title: string; intro: string; icon: typeof Calculator; tools: Tool[] };

const GROUPS: Group[] = [
  {
    title: 'Investování do ETF',
    icon: LineChart,
    intro: 'Spočítejte, jak vám peníze porostou, kolik vás stojí poplatky a jak výnos ovlivní kurz koruny.',
    tools: [
      {
        href: '/design-preview/investicni-kalkulacka',
        title: 'Investiční kalkulačka',
        desc: 'Kolik naspoříte pravidelným vkladem díky složenému úročení.',
        icon: Calculator,
      },
      {
        href: '/design-preview/kalkulacka',
        title: 'Kalkulačka poplatků ETF',
        desc: 'Dopad ročního poplatku (TER) na váš výnos za desítky let.',
        icon: Percent,
      },
      {
        href: '/design-preview/kurzovy-dopad',
        title: 'Kurzový dopad ETF',
        desc: 'Jak pohyb kurzu USD/CZK mění výnos přepočtený do korun.',
        icon: Coins,
      },
      {
        href: '/design-preview/monte-carlo',
        title: 'Monte Carlo simulátor',
        desc: 'Pravděpodobnostní scénáře vývoje portfolia, ne jediné číslo.',
        icon: Dice5,
      },
      {
        href: '/design-preview/backtest',
        title: 'Backtest portfolia',
        desc: 'Otestujte složení portfolia na historických datech trhu.',
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
        href: '/design-preview/fire-kalkulacka',
        title: 'FIRE kalkulačka',
        desc: 'Kdy a s jakým majetkem dosáhnete finanční nezávislosti.',
        icon: Flame,
      },
      {
        href: '/design-preview/nouzova-rezerva',
        title: 'Nouzová rezerva',
        desc: 'Kolik peněz si držet stranou pro nečekané výdaje.',
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
        href: '/design-preview/cisty-plat',
        title: 'Čistá mzda 2025',
        desc: 'Kolik vám z hrubé mzdy zbude po dani a odvodech.',
        icon: Receipt,
      },
      {
        href: '/design-preview/hypotecni-kalkulacka',
        title: 'Hypoteční kalkulačka',
        desc: 'Měsíční splátka hypotéky podle výše úvěru a sazby.',
        icon: Home,
      },
      {
        href: '/design-preview/uverova-kalkulacka',
        title: 'Úvěrová kalkulačka',
        desc: 'Splátka a celkové náklady spotřebitelského úvěru.',
        icon: Landmark,
      },
    ],
  },
];

const toolCount = GROUPS.reduce((n, g) => n + g.tools.length, 0);

const KAM_DAL: { href: string; label: string; desc: string; icon: typeof Calculator }[] = [
  { href: '/design-preview/srovnani', label: 'Srovnání ETF fondů', desc: 'Porovnejte 4 300+ fondů podle vlastních kritérií.', icon: BarChart3 },
  { href: '/design-preview/portfolio-strategie', label: 'Modelová portfolia', desc: 'Hotové strategie složené z ETF na míru cíli.', icon: PieChart },
  { href: '/design-preview/pruvodce', label: 'Co jsou ETF', desc: 'Základy fungování ETF srozumitelně pro začátečníky.', icon: BookOpen },
];

export default function KalkulackyPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://www.etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Kalkulačky', item: 'https://www.etfpruvodce.cz/kalkulacky' },
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
        url: `https://www.etfpruvodce.cz${t.href}`,
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
            <Link href="/design-preview/kalkulacky" className="font-medium text-teal-700">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
          <Link href="/design-preview/srovnani" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Srovnávač</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-700">Domů</Link>
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
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.tools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group flex flex-col rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3 group-hover:bg-teal-100 transition-colors">
                    <t.icon className="w-5 h-5" />
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">{t.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 transition-all group-hover:text-teal-700 group-hover:translate-x-0.5" />
                  </span>
                  <span className="block text-xs text-slate-500 mt-1 leading-snug">{t.desc}</span>
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

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">ETF průvodce.cz</span>
          <p className="max-w-md text-center sm:text-right leading-relaxed">Obsah má vzdělávací charakter a nepředstavuje investiční doporučení. Minulá výkonnost nezaručuje budoucí výnosy.</p>
        </div>
      </footer>
    </div>
  );
}
