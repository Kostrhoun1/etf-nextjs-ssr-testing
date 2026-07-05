import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import ReturnValue from '@/components/design-preview/ReturnValue';
import {
  TrendingUp, ArrowRight, Layers, BarChart3, Globe2, Factory,
  Sparkles, Coins, Compass, Star, Trophy, Tag, BadgePercent,
  PieChart, Calculator, ShoppingCart, BookOpen,
} from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { categoryConfigs, getFeaturedETFs, getTotalETFCount } from '@/lib/etf-data';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Žebříčky ETF – nejlepší fondy podle třídy, indexu i tématu | ETF průvodce',
  description:
    'Rozcestník všech žebříčků ETF: nejlepší akciové, dluhopisové, S&P 500, světové i tematické fondy. Řazení podle velikosti, hodnocení a výnosů přepočtených do korun.',
  alternates: { canonical: '/design-preview/zebricky' },
};

/* Cílová routa na ostrém webu. */
const catHref = (slug: string) => `/design-preview/nejlepsi-etf/${slug}`;

/* Skupiny žebříčků. Každá nese jen slugy, které REÁLNĚ existují v
   categoryConfigs (filtrujeme níže) – žádné mrtvé odkazy. Co se nevejde
   do žádné skupiny, spadne automaticky do bloku „Další žebříčky". */
const GROUP_DEFS: { title: string; icon: typeof Layers; intro: string; slugs: string[] }[] = [
  {
    title: 'Podle třídy aktiv',
    icon: Layers,
    intro: 'Z čeho fond drží majetek – akcie, dluhopisy, komodity či nemovitosti.',
    slugs: [
      'nejlepsi-akciove-etf',
      'nejlepsi-dluhopisove-etf',
      'nejlepsi-komoditni-etf',
      'nejlepsi-dividendove-etf',
      'nejlepsi-realitni-etf',
      'nejlepsi-vladni-dluhopisy-etf',
      'nejlepsi-korporatni-dluhopisy-etf',
      'nejlepsi-high-yield-etf',
    ],
  },
  {
    title: 'Podle indexu',
    icon: BarChart3,
    intro: 'Fondy sledující konkrétní burzovní index – od S&P 500 po DAX.',
    slugs: [
      'nejlepsi-sp500-etf',
      'nejlepsi-msci-world-etf',
      'nejlepsi-nasdaq-etf',
      'nejlepsi-dax-etf',
      'nejlepsi-stoxx600-etf',
      'nejlepsi-ftse100-etf',
    ],
  },
  {
    title: 'Podle regionu',
    icon: Globe2,
    intro: 'Geografické zaměření – svět, USA, Evropa, Asie či rozvíjející se trhy.',
    slugs: [
      'nejlepsi-celosvetove-etf',
      'nejlepsi-globalni-etf',
      'nejlepsi-americke-etf',
      'nejlepsi-evropske-etf',
      'nejlepsi-japonske-etf',
      'nejlepsi-cinske-etf',
      'nejlepsi-indicke-etf',
      'nejlepsi-emerging-markets-etf',
      'nejlepsi-asijsko-pacificke-etf',
    ],
  },
  {
    title: 'Podle sektoru',
    icon: Factory,
    intro: 'Zaměření na jedno odvětví hospodářství – technologie, zdravotnictví, energie.',
    slugs: [
      'nejlepsi-technologicke-etf',
      'nejlepsi-healthcare-etf',
      'nejlepsi-financni-etf',
      'nejlepsi-energeticke-etf',
      'nejlepsi-prumyslove-etf',
      'nejlepsi-spotrebitelske-etf',
      'nejlepsi-infrastrukturni-etf',
    ],
  },
  {
    title: 'Podle tématu',
    icon: Sparkles,
    intro: 'Dlouhodobé trendy napříč obory – umělá inteligence, robotika, čistá energie.',
    slugs: [
      'nejlepsi-ai-etf',
      'nejlepsi-robotika-etf',
      'nejlepsi-cloud-etf',
      'nejlepsi-kyberbezpecnost-etf',
      'nejlepsi-clean-energy-etf',
      'nejlepsi-obnovitelne-zdroje-etf',
      'nejlepsi-biotechnologie-etf',
      'nejlepsi-defense-etf',
      'nejlepsi-esg-etf',
    ],
  },
  {
    title: 'Komodity a krypto',
    icon: Coins,
    intro: 'Fondy na drahé kovy, suroviny a kryptoměny.',
    slugs: [
      'nejlepsi-zlato-etf',
      'nejlepsi-stribro-etf',
      'nejlepsi-ropa-etf',
      'nejlepsi-bitcoin-etf',
    ],
  },
  {
    title: 'Podle stylu a strategie',
    icon: Compass,
    intro: 'Investiční přístup – levné firmy, růstové tituly, malé společnosti či nakládání s dividendou.',
    slugs: [
      'nejlepsi-value-etf',
      'nejlepsi-growth-etf',
      'nejlepsi-small-cap-etf',
      'nejlepsi-akumulacni-etf',
      'nejlepsi-distribucni-etf',
    ],
  },
];

/* Nejhledanější – zvýrazněné nahoře. */
const POPULAR_SLUGS = [
  'nejlepsi-etf-2026',
  'nejlepsi-sp500-etf',
  'nejlepsi-celosvetove-etf',
  'nejlevnejsi-etf',
  'etf-zdarma-degiro',
];

/* Pomocná čísla. */
const fmtNum = (n: number) => n.toLocaleString('cs-CZ');
const fmtPct = (n: number | null) =>
  n == null ? '—' : `${n > 0 ? '+' : ''}${n.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
const fmtTer = (n: number | null) =>
  n == null ? '—' : `${n.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

export default async function ZebrickyPage() {
  const [featured, totalCount] = await Promise.all([
    getFeaturedETFs(),
    getTotalETFCount(),
  ]);
  const total = totalCount || 4300;

  // Sestavit skupiny jen z reálně existujících kategorií.
  const groups = GROUP_DEFS.map((g) => ({
    ...g,
    items: g.slugs.map((s) => categoryConfigs[s]).filter(Boolean),
  })).filter((g) => g.items.length > 0);

  // Duplicitní SEO varianty stejného obsahu – kanonickou ponecháváme, druhou skrýváme,
  // aby se uživateli ani v „Dalších žebříčcích" nezobrazovaly dvě totožné dlaždice.
  const DUPLICATE_SLUGS = ['nejlepsi-nemovitostni-etf', 'nejlepsi-zlate-etf'];

  // Vše, co je zařazené ve skupinách nebo v „nejhledanějších" (+ skryté duplicity).
  const covered = new Set<string>([
    ...groups.flatMap((g) => g.items.map((c) => c.slug)),
    ...POPULAR_SLUGS,
    ...DUPLICATE_SLUGS,
  ]);

  // Zbytek → „Další žebříčky" (ať nic z configu nevypadne, žádné mrtvé odkazy).
  const otherItems = Object.values(categoryConfigs).filter((c) => !covered.has(c.slug));

  const popular = POPULAR_SLUGS.map((s) => categoryConfigs[s]).filter(Boolean);

  // Teaser řadíme přesně podle toho, co zobrazujeme: výnos v Kč, resp. TER vzestupně.
  const topPerf = [...featured.byPerformance]
    .sort((a, b) => (b.return_1y_czk ?? -Infinity) - (a.return_1y_czk ?? -Infinity))
    .slice(0, 3);
  const cheapest = [...featured.lowCost]
    .sort((a, b) => (a.ter_numeric ?? Infinity) - (b.ter_numeric ?? Infinity))
    .slice(0, 3);

  const totalCategories = Object.keys(categoryConfigs).filter(
    (s) => !DUPLICATE_SLUGS.includes(s),
  ).length;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://www.etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Žebříčky ETF', item: 'https://www.etfpruvodce.cz/nejlepsi-etf' },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Žebříčky ETF',
    description:
      'Rozcestník žebříčků ETF fondů podle třídy aktiv, indexu, regionu, sektoru, tématu a strategie.',
    hasPart: groups.map((g) => ({
      '@type': 'ItemList',
      name: g.title,
      itemListElement: g.items.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.title,
        url: `https://www.etfpruvodce.cz${catHref(c.slug)}`,
      })),
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      {/* Header – stejná navigace jako homepage */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/design-preview/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/design-preview/zebricky" className="font-medium text-teal-700">Žebříčky</Link>
            <Link href="/design-preview/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/design-preview/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/design-preview/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <span className="text-slate-700">Žebříčky ETF</span>
        </nav>

        {/* 1. Hero / H1 + USP + metodika */}
        <section className="py-8 md:py-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Žebříčky ETF
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 leading-relaxed">
            Přehled nejlepších ETF fondů rozdělený podle třídy aktiv, indexu, regionu,
            sektoru, tématu i strategie. V každém žebříčku řadíme fondy podle velikosti,{' '}
            <InfoTip label="Naše souhrnné hodnocení fondu (1–5) z velikosti, nákladů a historické výkonnosti. Nejde o investiční doporučení.">hodnocení</InfoTip>{' '}
            a výkonnosti, přičemž výnosy ukazujeme i přepočtené do korun.
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
            <span>{fmtNum(total)}+ fondů v databázi</span>
            <span aria-hidden>·</span>
            <span>{fmtNum(totalCategories)} žebříčků</span>
            <span aria-hidden>·</span>
            <span>výnosy přepočtené do korun</span>
          </p>
        </section>

        {/* 2. Nejhledanější */}
        {popular.length > 0 && (
          <section className="pb-8">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-teal-700" />
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Nejhledanější</h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {popular.map((c) => (
                <Link
                  key={c.slug}
                  href={catHref(c.slug)}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all"
                >
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{c.title}</span>
                    <span className="block text-xs text-slate-500 mt-0.5 leading-snug">{c.description}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-teal-700 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 3. Datový teaser – nejvýkonnější a nejlevnější */}
        {(topPerf.length > 0 || cheapest.length > 0) && (
          <section className="pb-10">
            <div className="mb-4 flex justify-end"><CurrencyToggle size="sm" /></div>
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Nejvýkonnější za 12 měsíců (v Kč) */}
              <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700"><Trophy className="w-5 h-5" /></span>
                    <h3 className="text-lg font-semibold text-slate-900">Nejvýkonnější za 12 měsíců</h3>
                  </div>
                  <span className="text-xs text-slate-400">za posledních 12 měsíců</span>
                </div>
                <ul className="mt-4 divide-y divide-slate-100">
                  {topPerf.map((etf) => (
                    <li key={etf.isin} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="flex-1 min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-900">{etf.name}</span>
                        <span className="block text-xs text-slate-500">{etf.fund_provider}</span>
                      </span>
                      <ReturnValue etf={etf} period="1y" className="shrink-0 text-sm font-semibold" />
                    </li>
                  ))}
                </ul>
                <Link href={catHref('nejlepsi-etf-2026')} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
                  Více v žebříčku Nejlepší ETF 2026 <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Nejlevnější podle TER */}
              <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700"><BadgePercent className="w-5 h-5" /></span>
                    <h3 className="text-lg font-semibold text-slate-900">Nejlevnější fondy</h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    podle <InfoTip label="Celková roční nákladovost fondu – strhává se automaticky z hodnoty, nižší je lepší.">TER</InfoTip>
                  </span>
                </div>
                <ul className="mt-4 divide-y divide-slate-100">
                  {cheapest.map((etf) => (
                    <li key={etf.isin} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="flex-1 min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-900">{etf.name}</span>
                        <span className="block text-xs text-slate-500">{etf.fund_provider}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-sm font-semibold text-slate-900">
                        {fmtTer(etf.ter_numeric)}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href={catHref('nejlevnejsi-etf')} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
                  Celý žebříček nejlevnějších ETF <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 4. Skupiny žebříčků */}
        {groups.map((g) => (
          <section key={g.title} className="pb-10">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700"><g.icon className="w-5 h-5" /></span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{g.title}</h2>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-slate-600 leading-relaxed">{g.intro}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((c) => (
                <Link
                  key={c.slug}
                  href={catHref(c.slug)}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all"
                >
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">{c.title}</span>
                    <span className="block text-xs text-slate-500 mt-0.5 leading-snug">{c.description}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 transition-all group-hover:text-teal-700 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Další žebříčky – cokoli z configu, co se nevešlo výše */}
        {otherItems.length > 0 && (
          <section className="pb-10">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700"><Tag className="w-5 h-5" /></span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Další žebříčky</h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {otherItems.map((c) => (
                <Link
                  key={c.slug}
                  href={catHref(c.slug)}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all"
                >
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">{c.title}</span>
                    <span className="block text-xs text-slate-500 mt-0.5 leading-snug">{c.description}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 transition-all group-hover:text-teal-700 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 5. Kam dál */}
        <section className="pb-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Kam dál</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: '/design-preview/srovnani', label: 'Srovnání ETF fondů', desc: `Porovnejte ${fmtNum(total)}+ fondů podle vlastních kritérií.`, icon: BarChart3 },
              { href: '/design-preview/portfolio-strategie', label: 'Modelová portfolia', desc: 'Hotové strategie složené z ETF na míru cíli.', icon: PieChart },
              { href: '/design-preview/kde-koupit', label: 'Kde koupit ETF', desc: 'Výběr brokera v ČR krok za krokem.', icon: ShoppingCart },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="group flex flex-col rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3 group-hover:bg-teal-100 transition-colors">
                  <l.icon className="w-5 h-5" />
                </span>
                <span className="block text-sm font-semibold text-slate-900">{l.label}</span>
                <span className="block text-xs text-slate-500 mt-1 leading-snug">{l.desc}</span>
              </Link>
            ))}
          </div>

          {/* E-E-A-T řádek */}
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-teal-50 text-teal-700 shrink-0">
              <BookOpen className="w-4 h-4" />
            </span>
            <span>
              <span className="font-medium text-slate-800">Jak žebříčky sestavujeme:</span>{' '}
              vycházíme z dat o velikosti fondu, nákladovosti ({''}
              <InfoTip label="Celková roční nákladovost fondu – strhává se automaticky z hodnoty.">TER</InfoTip>
              ) a historické výkonnosti přepočtené do korun. Pořadí není placené a slouží
              k orientaci, ne jako investiční doporučení.
            </span>
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
