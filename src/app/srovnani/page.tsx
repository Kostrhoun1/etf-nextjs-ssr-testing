import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { TrendingUp, ArrowRight, HelpCircle, ChevronDown } from 'lucide-react';
import AktualnostDat from '@/components/design-preview/AktualnostDat';
import { getScreenerRows, buildInitialScreenerRows, getDataDate, getTotalETFCount } from '@/lib/etf-data';
import ScreenerUI from '@/components/design-preview/ScreenerUI';
import { COMPARE_MAX } from '@/components/design-preview/compareLimit';

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
      'Interaktivní srovnávač ETF pro české investory. Filtrujte podle indexu, TER a typu výplaty, řaďte podle výnosu v Kč a porovnejte fondy vedle sebe.',
    alternates: { canonical: '/srovnani' },
  };
}

export default async function SrovnaniScreenerPreview() {
  const { rows, options, total } = await getScreenerRows();
  // Stejné číslo jako záložka „Vše“ ve výchozím stavu (pákové produkty jsou skryté).
  const pocet = rows.filter((r) => !r.is_leveraged).length;
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

        {/* HLAVIČKA – jen nadpis, jeden řádek a datum dat. Revize art directora 18. 10. 2026: tmavý hero
            (220 px) + filtry ve dvou řádcích odsunuly první fond na y≈800, na mobilu až k dolnímu okraji. */}
        <section className="pb-3 md:pb-4">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <h1 className="text-2xl md:text-[1.75rem] font-bold tracking-tight leading-tight text-slate-900">Srovnávač ETF</h1>
            <AktualnostDat datum={dataDate} />
          </div>
          <p className="mt-0.5 text-sm text-slate-600">
            {pocet.toLocaleString('cs-CZ')} fondů<span className="hidden sm:inline"> dostupných z Česka</span> · výnosy přepočtené do korun
          </p>
        </section>

        {/* SCREENER – hlavní obsah stránky (výpis fondů z databáze) */}
        <section id="screener" className="scroll-mt-16">
          <ScreenerUI initialRows={initialRows} total={total} options={options} dataDate={dateStr} />
        </section>

        {/* Nejhledanější kategorie – prolink na žebříčky (navigace + interní odkazy) */}
        <section className="pt-10">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Hotové žebříčky podle kategorie</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {POPULAR_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/nejlepsi-etf/${c.slug}`}
                title={c.note}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"
              >
                {c.label}
              </Link>
            ))}
            <Link href="/zebricky" className="inline-flex items-center gap-1 px-2 py-1.5 text-sm font-medium text-teal-700 hover:text-teal-800">
              Všechny žebříčky <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Jak srovnávač používat – JEDEN sbalený blok (dřív 3 karty + text o hvězdičkách + žlutý box
            s upozorněním, které je i v patičce; revize 18. 10. 2026). Text zůstává v HTML pro vyhledávače. */}
        <section className="pt-8">
          <details className="group rounded-xl border border-slate-200 bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2"><HelpCircle className="w-4 h-4 text-teal-700" /> Jak srovnávač používat a co u ETF porovnávat</span>
              <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="grid gap-6 border-t border-slate-100 px-4 py-4 text-sm leading-relaxed text-slate-600 md:grid-cols-3">
              <div>
                <h2 className="mb-1.5 text-sm font-semibold text-slate-900">Co je srovnávač ETF</h2>
                <p>
                  Nástroj pro české investory: projdete {pocet.toLocaleString('cs-CZ')} ETF fondů a seřadíte je podle poplatku (TER),
                  velikosti nebo výnosu. Na rozdíl od zahraničních srovnávačů ukazuje <strong className="text-slate-800">výnosy přepočtené
                  do korun</strong> kurzem ČNB – tedy kolik byste reálně vydělali vy.
                </p>
              </div>
              <div>
                <h2 className="mb-1.5 text-sm font-semibold text-slate-900">Jak ho používat</h2>
                <ol className="list-decimal space-y-1 pl-4">
                  <li>Nahoře vyberte třídu aktiv (akcie, dluhopisy, komodity…).</li>
                  <li>Zvolte index nebo celý trh (např. „Celý svět“ nebo S&amp;P 500) – i víc najednou.</li>
                  <li>Seřaďte podle poplatku, velikosti nebo výnosu v Kč.</li>
                  <li>Tlačítkem <strong className="text-slate-800">Porovnat</strong> vyberte 2–{COMPARE_MAX} fondy a uvidíte je vedle sebe
                    (třeba <Link href="/srovnani/vwce-vs-cspx" className="text-teal-700 hover:underline">VWCE vs. CSPX</Link>).</li>
                </ol>
              </div>
              <div>
                <h2 className="mb-1.5 text-sm font-semibold text-slate-900">Co u ETF porovnávat</h2>
                <ul className="list-disc space-y-1 pl-4">
                  <li><strong className="text-slate-800">TER</strong> – roční poplatek, dlouhodobě dělá velký rozdíl.</li>
                  <li><strong className="text-slate-800">Velikost fondu</strong> – větší fond bývá levnější na obchodování.</li>
                  <li><strong className="text-slate-800">Výnos v Kč</strong> – kurz koruny mění reálný výsledek.</li>
                  <li><strong className="text-slate-800">ACC / DIST</strong> – reinvestice vs. výplata dividend.</li>
                  <li><strong className="text-slate-800">Replikace</strong> – fyzická vs. syntetická (swap).</li>
                </ul>
                <p className="mt-2 text-xs text-slate-500">Výnosy jsou minulé a nezaručují budoucí vývoj.</p>
              </div>
            </div>
          </details>
        </section>
      </main>
    </div>
  );
}
