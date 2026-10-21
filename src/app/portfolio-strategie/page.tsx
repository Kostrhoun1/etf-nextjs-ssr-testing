import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import InfoTip from '@/components/design-preview/InfoTip';
import StructuredData from '@/components/SEO/StructuredData';
import { type HistorieMap } from '@/components/design-preview/portfolioComponents';
import { portfolioModels, PORTFOLIO_BACKTEST, backtestOdkaz } from '@/components/design-preview/portfolioData';
import PortfolioVyber from './PortfolioVyber';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { FaqSeznam } from '@/components/design-preview/brokerUI';
import { predpocitejPortfolio } from '@/lib/backtest/predpocet';
import { getReturnsByIsins, getTotalETFCount } from '@/lib/etf-data';
import {
  TrendingUp, ShieldCheck,
  History, Activity, Search, Landmark, BookOpen, Trophy,
} from 'lucide-react';
import { titulek } from '@/lib/seoTitulek';

export const revalidate = 86400;

export const metadata: Metadata = {
  // Self-canonical: na stránku vedou odkazy s parametry (FB, presety, přesměrování) – ty
  // nemají být samostatné URL ve vyhledávači (deep dive 17. 10. 2026).
  alternates: { canonical: '/portfolio-strategie' },
  title: titulek(`Modelová portfolia z ETF: ${portfolioModels.length} strategií pro české investory`),
  description:
    'Modelová portfolia z ETF – Permanentní, All Weather, Nobelovo, 60/40, Akciové, Dividendové a Svět + malé firmy: složení, konkrétní fondy a historie v Kč.',
};

const BASE = 'https://etfpruvodce.cz';

// FAQ – znění synchronizované 1:1 se schématem níže.
const FAQ: { q: string; a: string }[] = [
  {
    q: 'Co je modelové portfolio?',
    a: 'Modelové portfolio je hotový poměr tříd aktiv (akcie, dluhopisy, nemovitosti, komodity, zlato), který stačí složit z několika ETF. Místo vymýšlení vlastní skladby zkopírujete ověřený recept a jen jednou za čas vrátíte poměry na cílové hodnoty.',
  },
  {
    q: 'Jak vybrat portfolio podle své povahy?',
    a: 'Rozhodněte se podle toho, jak velký propad unesete. Konzervativní portfolia (Permanentní, All Weather) mají méně akcií a mírnější výkyvy; akciová portfolia rostla v historii nejvíc, ale propadala se nejhlouběji – skutečný největší pokles každého portfolia od roku 2008 vidíte přímo na kartě.',
  },
  {
    q: 'Jak často portfolio vyvažovat?',
    a: 'Obvykle stačí jednou ročně, případně když se některá třída aktiv odchýlí od cílového podílu o více než zhruba 5 procentních bodů. Vyvážení (anglicky rebalancing) znamená vrátit poměry na původní cílové hodnoty – prodat to, co narostlo, a dokoupit to, co zaostalo.',
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
  const etfCount = await getTotalETFCount();

  // Historie z backtestu (CAGR, max. pokles v Kč) – předpočet jednou za ISR render, stejné jádro jako /backtest.
  const historie: HistorieMap = Object.fromEntries(await Promise.all(portfolioModels.map(async (m) => {
    const cfg = PORTFOLIO_BACKTEST[m.slug];
    const r = cfg ? await predpocitejPortfolio(cfg.items, cfg.start) : null;
    const evo = r?.evolution ?? [];
    return [m.slug, r && evo.length > 1 ? {
      cagr: r.summary.cagr, maxPokles: r.risk.maxDrawdown.depth, od: evo[0].date.slice(0, 10), do: evo[evo.length - 1].date.slice(0, 10), proxy: cfg?.proxyNote, nahrada: cfg?.nahrada,
      nav: r.summary.netAssetValue, kurzyDo: r.kurzyDo,
      odkaz: backtestOdkaz(m.slug, evo[evo.length - 1].date.slice(0, 10)),
    } : null] as const;
  })));
  const hodnoty = Object.values(historie).filter((h): h is NonNullable<typeof h> => !!h);
  const historieDo = hodnoty.map((h) => h.do).sort().pop();
  const historieOd = hodnoty.map((h) => h.od).sort()[0];
  const mr = (iso: string) => `${Number(iso.slice(5, 7))}/${iso.slice(0, 4)}`;
  const etfCountLabel = etfCount > 0 ? `${(Math.floor(etfCount / 100) * 100).toLocaleString('cs-CZ')}+` : '4 800+';

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
    { href: '/backtest', label: 'Backtest portfolia', desc: 'Historie vlastního složení v korunách', icon: History },
    { href: '/monte-carlo', label: 'Monte Carlo simulátor', desc: 'Pravděpodobnostní výhled vývoje portfolia', icon: Activity },
    { href: '/srovnani', label: 'Srovnávač ETF', desc: 'Porovnejte konkrétní fondy do portfolia', icon: Search },
    { href: '/kde-koupit', label: 'Kde koupit ETF', desc: 'Výběr brokera pro české investory', icon: Landmark },
    { href: '/jak-zacit', label: 'Jak začít investovat', desc: 'Krok za krokem k prvnímu nákupu', icon: BookOpen },
    { href: '/zebricky', label: 'Nejlepší ETF', desc: 'Žebříčky fondů pro jednotlivé složky', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <StructuredData data={breadcrumbSchema} id="portfolio-breadcrumb" />
      <StructuredData data={itemListSchema} id="portfolio-itemlist" />
      <StructuredData data={faqSchema} id="portfolio-faq" />

      {/* Header – 1:1 z homepage */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <SiteNav />
          <HeaderSearch />
        </div>
      </header>

      <main id="obsah" className="max-w-6xl mx-auto px-4">
        {/* 1. Úvod – krátce, karty hned pod ním (revize 18. 10. 2026: karty byly až na třetí obrazovce) */}
        <section className="pt-5 pb-4">
          <nav aria-label="Drobečková navigace" className="mb-3 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-700">Domů</Link>
            <span className="mx-1.5">/</span>
            <span className="text-slate-700">Modelová portfolia</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-slate-900">Modelová portfolia z ETF</h1>
          <p className="mt-1.5 max-w-3xl text-sm md:text-base leading-relaxed text-slate-600">
            {portfolioModels.length} hotových poměrů{' '}
            <InfoTip label="Druh investice – akcie, dluhopisy, nemovitosti, komodity nebo zlato.">tříd aktiv</InfoTip>{' '}
            s konkrétními ETF a historií v korunách. Stačí zvolit jeden a jednou ročně vrátit poměry na cíl (
            <InfoTip label="Návrat poměru aktiv na cílové hodnoty – prodáte to, co narostlo, a dokoupíte to, co zaostalo.">rebalancing</InfoTip>).
          </p>
        </section>

        {/* 2. JÁDRO: výběr podle povahy + karty */}
        <section data-sekce="portfolia" className="pb-8">
          <p className="mb-3 text-xs text-slate-500">
            Seřazeno podle největšího propadu v historii, od nejmenšího. Zhodnocení a max. pokles z backtestu v korunách
            {historieOd && historieDo ? ` (${mr(historieOd)} – ${new Date(`${historieDo}T00:00:00Z`).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' })})` : ''}, po poplatcích fondů; ≈ = část složení počítáme přes podobný index.
          </p>
          <PortfolioVyber returns={returns} historie={historie} />
        </section>

        {/* 5. Prolinkování na nástroje */}
        <section data-sekce="nastroje" className="py-8">
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
        <section data-sekce="faq" className="py-4">
          <h2 className="mb-4 text-xl md:text-2xl font-bold tracking-tight text-slate-900">Časté otázky</h2>
          <FaqSeznam items={FAQ} />
        </section>

        {/* Trust / metodika */}
        <section className="py-4">
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><ShieldCheck className="h-5 w-5" /></span>
            <p className="text-xs leading-relaxed text-slate-500">
              Složení portfolií a výnosy vychází z naší databáze {etfCountLabel} ETF fondů. Každá strategie obsahuje konkrétní
              UCITS ETF s ISIN dostupné u českých brokerů. Obsah připravil Tomáš Kostrhoun.
            </p>
          </div>
        </section>

        {/* 7. Upozornění – jednotně malým šedým textem */}
        <section className="pt-2 pb-12">
          <InvestmentDisclaimer variant="inline" />
        </section>
      </main>

      {/* Footer – 1:1 z homepage */}
    </div>
  );
}
