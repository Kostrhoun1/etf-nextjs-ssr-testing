import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import InfoTip from '@/components/design-preview/InfoTip';
import StructuredData from '@/components/SEO/StructuredData';
import {
  PortfolioGrid,
  PortfolioVerdictTable,
} from '@/components/design-preview/portfolioComponents';
import { portfolioModels } from '@/components/design-preview/portfolioData';
import { getReturnsByIsins } from '@/lib/etf-data';
import {
  TrendingUp, ArrowRight, LayoutGrid, PieChart, Scale, ShieldCheck,
  History, Activity, Search, Landmark, BookOpen, Trophy,
} from 'lucide-react';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Modelová portfolia z ETF: 5 ověřených strategií pro české investory',
  description:
    'Vyberte si hotové modelové portfolio z ETF – Permanentní, Nobelovo, Akciové, Ray Dalio a Dividendové. Reálné složení, konkrétní fondy (ISIN) a verdikt pro koho.',
};

const BASE = 'https://www.etfpruvodce.cz';

// FAQ – znění synchronizované 1:1 se schématem níže.
const FAQ: { q: string; a: string }[] = [
  {
    q: 'Co je modelové portfolio?',
    a: 'Modelové portfolio je hotový poměr tříd aktiv (akcie, dluhopisy, nemovitosti, komodity, zlato), který stačí složit z několika ETF. Místo vymýšlení vlastní skladby zkopírujete ověřený recept a jen jednou za čas vrátíte poměry na cílové hodnoty.',
  },
  {
    q: 'Jak vybrat portfolio podle své povahy?',
    a: 'Rozhodněte se podle toho, jak velký propad unesete. Konzervativní portfolia (Permanentní, Ray Dalio) mají méně akcií a mírnější výkyvy, agresivní (Akciové) má 80 % v akciích a počítá s propady i kolem 40 %, ale dlouhodobě nabízí nejvyšší růst.',
  },
  {
    q: 'Jak často rebalancovat?',
    a: 'Obvykle stačí jednou ročně, případně když se některá třída aktiv odchýlí od cílového podílu o více než zhruba 5 procentních bodů. Rebalancing znamená vrátit poměry na původní cílové hodnoty – prodat to, co narostlo, a dokoupit to, co zaostalo.',
  },
  {
    q: 'Funguje to i pro malé částky?',
    a: 'Ano. U malé částky lze začít i jediným světovým akciovým ETF a další třídy aktiv přidávat postupně, jak portfolio roste. Mnoho brokerů navíc umožňuje nakupovat zlomky podílů, takže poměry dodržíte i s nižšími vklady.',
  },
  {
    q: 'Můžu kombinovat více strategií dohromady?',
    a: 'Nedoporučuje se. Smícháním více modelů vznikne nepřehledná skladba, kterou je těžké rebalancovat, a často se tím jen zředí výsledek. Vyberte si jedno portfolio, které odpovídá vaší povaze a horizontu, a u něj zůstaňte. Časté přeskakování mezi strategiemi výnosům spíše škodí.',
  },
];

export default async function PortfolioStrategieDesignPreview() {
  // Reálné korunové výnosy (1R) složek – pro živý výnos na kartách (USP: koruna-first).
  const allIsins = [...new Set(portfolioModels.flatMap((m) => m.allocations.map((a) => a.isin)))];
  const returnsRaw = await getReturnsByIsins(allIsins);
  const returns: Record<string, number | null> = {};
  for (const isin of allIsins) returns[isin] = returnsRaw[isin]?.return_1y_czk ?? null;

  // SCHEMA: BreadcrumbList + ItemList (5 detailů) + FAQPage synchronizovaný se zněním FAQ.
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Modelová portfolia', item: `${BASE}/portfolio-strategie` },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Modelová portfolia z ETF',
    itemListElement: portfolioModels.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.name,
      url: `${BASE}/portfolio-strategie/${m.slug}`,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const TOOLS = [
    { href: '/design-preview/backtest', label: 'Backtest portfolia', desc: 'Historická simulace strategie od roku 2000', icon: History },
    { href: '/design-preview/monte-carlo', label: 'Monte Carlo simulátor', desc: 'Pravděpodobnostní výhled vývoje portfolia', icon: Activity },
    { href: '/design-preview/srovnani', label: 'Srovnávač ETF', desc: 'Porovnejte konkrétní fondy do portfolia', icon: Search },
    { href: '/design-preview/kde-koupit', label: 'Kde koupit ETF', desc: 'Výběr brokera pro české investory', icon: Landmark },
    { href: '/design-preview/jak-zacit', label: 'Jak začít investovat', desc: 'Krok za krokem k prvnímu nákupu', icon: BookOpen },
    { href: '/design-preview/zebricky', label: 'Nejlepší ETF', desc: 'Žebříčky fondů pro jednotlivé složky', icon: Trophy },
  ];

  const EDU = [
    { icon: LayoutGrid, title: 'Modelové portfolio', text: 'Hotový poměr tříd aktiv – stačí ho zkopírovat, nemusíte nic vymýšlet.' },
    { icon: PieChart, title: 'Diverzifikace', text: 'Peníze rozložené mezi více druhů aktiv, ne všechno v jednom.' },
    { icon: Scale, title: 'Rebalancing', text: 'Jednou za čas vrátíte poměry aktiv zpět na cílové hodnoty.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <StructuredData data={breadcrumbSchema} id="portfolio-breadcrumb" />
      <StructuredData data={itemListSchema} id="portfolio-itemlist" />
      <StructuredData data={faqSchema} id="portfolio-faq" />

      {/* Header – 1:1 z homepage */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/design-preview/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/design-preview/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/design-preview/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/design-preview/portfolio-strategie" className="text-teal-700 font-medium">Portfolia</Link>
            <Link href="/design-preview/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
          <Link href="/design-preview/srovnani" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Srovnávač</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* 1. Intro panel */}
        <section className="py-7">
          <nav aria-label="Drobečková navigace" className="mb-3 text-xs text-slate-500">
            <Link href="/design-preview" className="hover:text-slate-700">Domů</Link>
            <span className="mx-1.5">/</span>
            <span className="text-slate-700">Modelová portfolia</span>
          </nav>
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
              Modelová portfolia z ETF pro české investory
            </h1>
            <p className="mt-2 max-w-2xl text-sm md:text-base leading-relaxed text-slate-300">
              5 ověřených strategií – hotové složení tříd aktiv s konkrétními ETF (ISIN) ke koupi u českého brokera.
            </p>
          </div>
        </section>

        {/* 2. Edukace ikonová */}
        <section className="pb-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Co je modelové portfolio</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tři pojmy, které stačí znát, než si vyberete jednu z {portfolioModels.length} hotových strategií.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {EDU.map((e) => (
                <div key={e.title} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                    <e.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="block text-sm font-semibold text-slate-900">{e.title}</span>
                    <span className="block text-xs leading-snug text-slate-500 mt-0.5">{e.text}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
              Vysvětlivky pojmů:{' '}
              <InfoTip label="Roční poplatek za správu fondu, strhává se průběžně z hodnoty fondu.">TER</InfoTip>,{' '}
              <InfoTip label="Návrat poměru aktiv na cílové hodnoty – prodáte to, co narostlo, a dokoupíte to, co zaostalo.">rebalancing</InfoTip>,{' '}
              <InfoTip label="Fond investující do nemovitostí; příjem plyne hlavně z nájmů.">nemovitostní fond</InfoTip>,{' '}
              <InfoTip label="Druh investice – akcie, dluhopisy, nemovitosti, komodity nebo zlato.">třída aktiv</InfoTip>.
            </p>
          </div>
        </section>

        {/* 3. JÁDRO: mřížka 5 karet */}
        <section className="py-8">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Vyberte si portfolio podle své povahy</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
              Každá karta ukazuje reálné složení tříd aktiv i skutečný korunový výnos za poslední rok. Klikněte na detail pro konkrétní ETF s ISIN ke koupi.
            </p>
          </div>
          <PortfolioGrid returns={returns} />
        </section>

        {/* 4. Verdikt pro koho */}
        <section className="py-4">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Pro koho je která strategie</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
              Rozhodněte se na první pohled – bez čtení všech pěti detailů.
            </p>
          </div>
          <PortfolioVerdictTable />
        </section>

        {/* 5. Prolinkování na nástroje */}
        <section className="py-8">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Ověřte si portfolio nástroji</h2>
            <p className="mt-1 text-sm text-slate-500">Simulujte vývoj a najděte si konkrétní fondy i brokera.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-teal-300 hover:shadow-sm">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-100"><t.icon className="h-5 w-5" /></span>
                <span className="block text-sm font-semibold leading-tight text-slate-900">{t.label}</span>
                <span className="mt-1 block text-xs leading-snug text-slate-500">{t.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. FAQ */}
        <section className="py-4">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Časté otázky</h2>
          </div>
          <div className="space-y-2.5">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-lg border border-slate-200 bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-slate-900">
                  {f.q}
                  <ArrowRight className="h-4 w-4 shrink-0 text-teal-700 transition-transform group-open:rotate-90" />
                </summary>
                <p className="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Trust / metodika */}
        <section className="py-4">
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><ShieldCheck className="h-5 w-5" /></span>
            <p className="text-xs leading-relaxed text-slate-500">
              Složení portfolií a výnosy vychází z naší databáze 4 300+ ETF fondů. Každá strategie obsahuje konkrétní
              UCITS ETF s ISIN dostupné u českých brokerů. Obsah připravil Tomáš Kostrhoun.
            </p>
          </div>
        </section>

        {/* 7. Disclaimer dole */}
        <section className="py-8 pb-12">
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-500">
            Obsah má vzdělávací charakter a nepředstavuje investiční doporučení. Modelová portfolia jsou ilustrativní,
            ne návod na konkrétní nákup. Minulá výkonnost nezaručuje budoucí výnosy.
          </p>
        </section>
      </main>

      {/* Footer – 1:1 z homepage */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">ETF průvodce.cz</span>
          <p className="max-w-md text-center sm:text-right leading-relaxed">Obsah má vzdělávací charakter a nepředstavuje investiční doporučení. Minulá výkonnost nezaručuje budoucí výnosy.</p>
        </div>
      </footer>
    </div>
  );
}
