import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { TrendingUp, ArrowRight, Wallet, Database, CalendarDays, Swords, SlidersHorizontal, Coins, Layers } from 'lucide-react';
import AktualnostDat from '@/components/design-preview/AktualnostDat';
import { getScreenerRows, buildInitialScreenerRows, getDataDate, getTotalETFCount } from '@/lib/etf-data';
import ScreenerUI from '@/components/design-preview/ScreenerUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

const currentYear = new Date().getFullYear();

/* Nejhledanější ETF kategorie – prolink na reálné žebříčky (parita s odkazy na
   starém webu z FeaturedETFSection + sr-only seznamu kategorií). */
const POPULAR_CATEGORIES: { label: string; slug: string; note: string }[] = [
  { label: 'MSCI World ETF', slug: 'nejlepsi-msci-world-etf', note: 'Globální diverzifikace, vyspělé trhy' },
  { label: 'S&P 500 ETF', slug: 'nejlepsi-sp500-etf', note: 'Největší americké společnosti' },
  { label: 'Celosvětové ETF', slug: 'nejlepsi-celosvetove-etf', note: 'Celý svět v jednom fondu' },
  { label: 'Nasdaq / technologické ETF', slug: 'nejlepsi-technologicke-etf', note: 'Technologické akcie' },
  { label: 'Dluhopisové ETF', slug: 'nejlepsi-dluhopisove-etf', note: 'Stabilnější složka portfolia' },
  { label: 'Dividendové ETF', slug: 'nejlepsi-dividendove-etf', note: 'Pravidelný pasivní příjem' },
  { label: 'Emerging Markets ETF', slug: 'nejlepsi-emerging-markets-etf', note: 'Rozvíjející se trhy' },
  { label: 'Zlato ETF', slug: 'nejlepsi-zlato-etf', note: 'Ochrana proti inflaci' },
  { label: 'Bitcoin ETF', slug: 'nejlepsi-bitcoin-etf', note: 'Kryptoměnová expozice' },
];

export const revalidate = 86400;
/* POZOR – proč tahle stránka NESMÍ číst searchParams:
   V Next.js 15 udělá už samotné přečtení `searchParams` z routy DYNAMICKOU a
   `revalidate` výše se pak ignoruje. Stránka se tím renderovala při KAŽDÉM
   požadavku (x-vercel-cache: MISS, no-store) a pokaždé tahala z databáze všech
   ~5 000 fondů → 4,2–4,8 s odezvy a spotřeba Fluid CPU z free tieru na každé
   načtení. Změřeno na produkci 9. 9. 2026.
   `?q=` a `?index=` si proto přebírá ScreenerUI na klientu z window.location –
   pro SEO to nic neznamená (canonical míří na čisté /srovnani) a filtrování
   stejně celé běží na klientu nad daty z /api/etf/screener. */
export async function generateMetadata(): Promise<Metadata> {
  const n = await getTotalETFCount();
  const count = n > 0 ? n.toLocaleString('cs-CZ') : '4 800';
  return {
    title: `Srovnávač ETF: filtrujte a porovnejte ${count} fondů`,
    description:
      'Interaktivní srovnávač ETF pro české investory. Filtrujte podle TER, typu, replikace a regionu, řaďte podle výnosu v Kč a proklikněte se na detail fondu.',
    alternates: { canonical: '/srovnani' },
  };
}

export default async function SrovnaniScreenerPreview() {
  const { rows, options, total } = await getScreenerRows();
  const initialRows = buildInitialScreenerRows(rows, '', 50);
  const today = new Date();
  const dataDate = await getDataDate(today);
  const dateStr = dataDate.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Databáze ETF fondů ${currentYear}`,
    description:
      'Databáze ETF fondů dostupných českým investorům s aktuálními daty o poplatcích (TER), velikosti, replikaci a výkonnosti přepočtené do korun.',
    keywords: ['ETF', 'srovnání ETF', 'TER', 'výkonnost', 'investice', 'koruna'],
    creator: { '@type': 'Organization', name: 'ETF průvodce.cz' },
    temporalCoverage: `${currentYear}`,
    spatialCoverage: 'Globální ETF trhy',
    variableMeasured: ['TER poplatky', 'Historická výkonnost v Kč', 'Velikost fondu', 'Dividendový výnos', 'Replikace'],
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz' },
      { '@type': 'ListItem', position: 2, name: 'Srovnávač ETF', item: 'https://etfpruvodce.cz/srovnani-etf' },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Header */}
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

      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-28">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <span className="text-slate-700">Srovnávač ETF</span>
        </nav>

        {/* HERO – na mobilu krátký (dřív 380 px před filtry; UX audit 17. 10. 2026) */}
        <section className="pb-4 md:pb-6">
          <div className="rounded-2xl bg-slate-900 text-white px-5 py-5 md:px-9 md:py-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Srovnávač ETF</h1>
            <p className="mt-1.5 max-w-2xl text-slate-300 text-sm md:text-base leading-relaxed">
              <span className="md:hidden">Filtrujte a řaďte fondy podle poplatku a výnosu <strong className="text-white">v korunách</strong>.</span>
              <span className="hidden md:inline">
                Projděte a porovnejte největší ETF fondy dostupné pro české investory. Filtrujte podle poplatku (TER),
                typu, replikace a regionu, řaďte podle výnosu <strong className="text-white">přepočteného do korun</strong> a
                proklikněte se na detail každého fondu.
              </span>
            </p>
            <AktualnostDat datum={dataDate} tmavy className="mt-3" />
          </div>
        </section>

        {/* SCREENER – hlavní obsah stránky (výpis fondů z databáze) */}
        <section id="screener" className="scroll-mt-16">
          <ScreenerUI initialRows={initialRows} total={total} options={options} dataDate={dateStr} />
        </section>

        {/* Ukázkový souboj – featured (až POD samotným výpisem fondů) */}
        <section className="pt-8">
          <Link href="/srovnani/vwce-vs-cspx" className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
            <span className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Swords className="w-4 h-4" /></span>
              <span>
                <span className="block text-sm font-semibold text-slate-900">Souboj fondů: VWCE vs CSPX</span>
                <span className="block text-xs text-slate-500">Detailní porovnání dvou nejoblíbenějších fondů – celý svět vs S&amp;P 500.</span>
              </span>
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 shrink-0" />
          </Link>
        </section>

        {/* Nejhledanější kategorie – prolink na žebříčky (interní linkbuilding + SEO) */}
        <section className="pt-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700"><Layers className="w-4 h-4" /></span>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Nejhledanější kategorie ETF</h2>
          </div>
          <p className="mb-4 max-w-2xl text-sm text-slate-600 leading-relaxed">
            Nevíte, kde začít? Projděte hotové žebříčky nejlepších fondů v dané kategorii – vybrané,
            seřazené a s výnosy přepočtenými do korun.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {POPULAR_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/nejlepsi-etf/${c.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-teal-300 hover:shadow-sm transition-all"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900 group-hover:text-teal-700">{c.label}</span>
                  <span className="block text-xs text-slate-500">{c.note}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 shrink-0" />
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/zebricky" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800">
              Všechny žebříčky ETF <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Co je srovnávač / jak používat / co porovnávat – SEO obsah (parita se starým webem) */}
        <section className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700"><Database className="w-4 h-4" /></span>
              <h2 className="text-base font-bold text-slate-900">Co je srovnávač ETF</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Srovnávač je nástroj pro české investory, který nechá <strong className="text-slate-800">filtrovat {total.toLocaleString('cs-CZ')} ETF fondů</strong>{' '}
              podle poplatku (TER), typu výplaty, replikace a regionu. Na rozdíl od zahraničních nástrojů
              ukazuje <strong className="text-slate-800">výnosy přepočtené do korun</strong> – tedy kolik reálně vyděláte vy.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700"><SlidersHorizontal className="w-4 h-4" /></span>
              <h2 className="text-base font-bold text-slate-900">Jak srovnávač používat</h2>
            </div>
            <ol className="text-sm text-slate-600 leading-relaxed space-y-1.5 list-decimal pl-4">
              <li>Vyberte třídu aktiv nahoře (akcie, dluhopisy, komodity…).</li>
              <li>Zúžením filtrů nastavte TER, region, index či velikost fondu.</li>
              <li>Seřaďte tabulku podle výnosu v Kč, TER nebo velikosti.</li>
              <li>Tlačítkem <span className="font-medium text-slate-700">+</span> přidejte až {`5`} fondů do detailního porovnání.</li>
            </ol>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700"><Coins className="w-4 h-4" /></span>
              <h2 className="text-base font-bold text-slate-900">Co u ETF porovnávat</h2>
            </div>
            <ul className="text-sm text-slate-600 leading-relaxed space-y-1.5 list-disc pl-4">
              <li><strong className="text-slate-800">TER</strong> – roční nákladovost, dlouhodobě zásadní.</li>
              <li><strong className="text-slate-800">Velikost fondu</strong> – větší fond bývá likvidnější a stabilnější.</li>
              <li><strong className="text-slate-800">Výnos v Kč</strong> – kurz koruny mění reálný výsledek.</li>
              <li><strong className="text-slate-800">Akum. vs. distr.</strong> – reinvestice vs. výplata dividend.</li>
              <li><strong className="text-slate-800">Replikace</strong> – fyzická vs. syntetická.</li>
            </ul>
          </article>
        </section>

        {/* Disclaimer */}
        <section className="pt-8 space-y-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            Výnosy jsou přepočtené do Kč a ukazují minulou výkonnost – nezaručují budoucí vývoj.
            Hvězdičkové hodnocení je orientační souhrn (velikost, náklady, historická výkonnost),
            ne investiční doporučení.
          </p>
          <InvestmentDisclaimer />
        </section>
      </main>
    </div>
  );
}
