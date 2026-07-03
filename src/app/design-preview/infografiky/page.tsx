import { Metadata } from 'next';
import Link from 'next/link';
import {
  getFeaturedETFs,
  getTotalETFCount,
  getTopETFsForCategory,
  categoryConfigs,
} from '@/lib/etf-data';
import InfoTip from '@/components/design-preview/InfoTip';
import {
  InfografikyCard,
  InfografikyMiniPerf,
  InfografikyMiniTer,
  InfografikyMiniHeat,
  InfografikyHeatGrid,
  InfografikyRankPanel,
  InfografikyLinkRow,
  type InfografikyHeatTile,
} from '@/components/design-preview/InfografikyUI';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Grid3x3,
  ArrowRight,
  ShieldCheck,
  Star,
  Banknote,
} from 'lucide-react';

export const revalidate = 86400;

const TOTAL_FALLBACK = 4300;

export const metadata: Metadata = {
  title: 'Infografiky ETF: výkonnost, poplatky a tržní heatmapa | ETF průvodce',
  description:
    'Vizuální přehledy z dat ETF fondů — nejvýkonnější a nejlevnější fondy a tržní heatmapa sektorů a regionů. Výnosy přepočtené do korun.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.etfpruvodce.cz/infografiky' },
};

/* Regiony a sektory pro tržní heatmapu – reálná data z DB (top fond v kategorii). */
const HEATMAP_CATEGORIES: { slug: string; label: string }[] = [
  { slug: 'nejlepsi-celosvetove-etf', label: 'Celý svět' },
  { slug: 'nejlepsi-sp500-etf', label: 'USA (S&P 500)' },
  { slug: 'nejlepsi-evropske-etf', label: 'Evropa' },
  { slug: 'nejlepsi-emerging-markets-etf', label: 'Rozvíjející se' },
  { slug: 'nejlepsi-technologicke-etf', label: 'Technologie' },
  { slug: 'nejlepsi-financni-etf', label: 'Finance' },
  { slug: 'nejlepsi-energeticke-etf', label: 'Energetika' },
  { slug: 'nejlepsi-nemovitostni-etf', label: 'Nemovitosti' },
];

async function getHeatmapTiles(): Promise<InfografikyHeatTile[]> {
  const results = await Promise.all(
    HEATMAP_CATEGORIES.map(async (c) => {
      const cfg = categoryConfigs[c.slug];
      if (!cfg) return null;
      try {
        const etfs = await getTopETFsForCategory({ ...cfg, limit: 1 });
        const top = etfs[0];
        if (!top) return null;
        const value = top.return_1y_czk ?? top.return_1y ?? null;
        return { label: c.label, value, href: `/nejlepsi-etf/${c.slug}` } as InfografikyHeatTile;
      } catch {
        return null;
      }
    })
  );
  return results.filter((t): t is InfografikyHeatTile => t != null);
}

export default async function InfografikyRozcestnik() {
  const [featured, totalCount, heatTiles] = await Promise.all([
    getFeaturedETFs(),
    getTotalETFCount(),
    getHeatmapTiles(),
  ]);

  const count = totalCount > 0 ? totalCount : TOTAL_FALLBACK;
  const byPerf = featured.byPerformance || [];
  const lowCost = featured.lowCost || [];

  // ItemList schema pro tři infografiky (rozcestník, ne Article)
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Nejvýkonnější ETF',
        description: 'Žebříček ETF podle výnosu za posledních 12 měsíců, přepočteno do korun.',
        url: 'https://www.etfpruvodce.cz/nejlepsi-etf',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Nejlevnější ETF podle TER',
        description: 'Fondy s nejnižším ročním poplatkem za správu.',
        url: 'https://www.etfpruvodce.cz/nejlepsi-etf/nejlevnejsi-etf',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Tržní heatmapa',
        description: 'Barevná mapa výkonnosti regionů a sektorů.',
        url: 'https://www.etfpruvodce.cz/infografiky#trzni-heatmapa',
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://www.etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Infografiky', item: 'https://www.etfpruvodce.cz/infografiky' },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([itemListSchema, breadcrumbSchema]) }}
      />

      {/* Header – 1:1 dle homepage vzoru */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
            </span>
            ETF průvodce
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/co-jsou-etf" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/nejlepsi-etf" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/srovnani-etf" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/kde-koupit-etf" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <Link
            href="/srovnani-etf"
            className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800"
          >
            Srovnávač
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Hero / intro – kompaktní, bez tmavého panelu */}
        <section className="py-8 md:py-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Infografiky ETF: trhy a fondy přehledně
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 leading-relaxed">
            Vizuální přehledy z dat {count.toLocaleString('cs-CZ')}+ fondů — výnosy přepočtené do
            korun, poplatky a výkonnost. Vyberte si přehled a proklikněte se k celému žebříčku.
          </p>
        </section>

        {/* Rozcestník karet infografik – jádro stránky */}
        <section className="pb-2">
          <h2 className="sr-only">Přehledy infografik</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfografikyCard
              icon={TrendingUp}
              title="Nejvýkonnější ETF"
              desc="Fondy s nejvyšším výnosem za posledních 12 měsíců, přepočteno do korun."
              href="/nejlepsi-etf"
              hrefLabel="Otevřít přehled výkonnosti"
            >
              <InfografikyMiniPerf etfs={byPerf} />
            </InfografikyCard>

            <InfografikyCard
              icon={Wallet}
              title="Nejlevnější ETF (TER)"
              desc="Fondy s nejnižším ročním poplatkem za správu. Nižší TER znamená méně nákladů."
              href="/nejlepsi-etf/nejlevnejsi-etf"
              hrefLabel="Otevřít přehled poplatků"
            >
              <InfografikyMiniTer etfs={lowCost} />
            </InfografikyCard>

            <InfografikyCard
              icon={Grid3x3}
              title="Tržní heatmapa"
              desc="Barevná mapa regionů a sektorů — zelená je růst, červená pokles za 12 měsíců."
              href="#trzni-heatmapa"
              hrefLabel="Otevřít tržní heatmapu"
            >
              <InfografikyMiniHeat tiles={heatTiles} />
            </InfografikyCard>
          </div>
        </section>

        {/* Mini-žebříček + plná heatmapa – reálná data, okamžitá hodnota */}
        <section id="trzni-heatmapa" className="scroll-mt-20 py-10 grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4">
              Nejvýkonnější za 12 měsíců
            </h2>
            <InfografikyRankPanel
              title="Výnos za 12 měsíců (v přepočtu na Kč)"
              subtitle="Bez pákových produktů"
              href="/nejlepsi-etf"
              hrefLabel="celý žebříček"
              etfs={byPerf}
            />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4">
              Výkonnost regionů a sektorů
            </h2>
            <InfografikyHeatGrid tiles={heatTiles} />
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Hodnota = výnos největšího fondu v kategorii za 12 měsíců, přepočteno do Kč.
            </p>
          </div>
        </section>

        {/* Edukační pruh – ikonové vysvětlivky, BEZ schémat */}
        <section className="py-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4">
            Co která infografika ukazuje
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3">
                <TrendingUp className="w-5 h-5" strokeWidth={2} />
              </span>
              <h3 className="text-sm font-semibold text-slate-900">
                <InfoTip label="Jak hodnota fondu rostla za dané období. U nás přepočteno do korun, takže vidíte výnos tak, jak ho pocítí český investor.">
                  Výkonnost
                </InfoTip>
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Jak fond rostl za období — u nás přepočteno do Kč.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3">
                <Wallet className="w-5 h-5" strokeWidth={2} />
              </span>
              <h3 className="text-sm font-semibold text-slate-900">
                <InfoTip label="Total Expense Ratio – roční poplatek za správu fondu. Strhává se automaticky z hodnoty fondu, nižší je lépe.">
                  TER
                </InfoTip>
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Roční poplatek za správu — nižší je lépe.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3">
                <Grid3x3 className="w-5 h-5" strokeWidth={2} />
              </span>
              <h3 className="text-sm font-semibold text-slate-900">
                <InfoTip label="Barevná mřížka, kde každá dlaždice je jeden region nebo sektor. Zelená značí růst, červená pokles — barva odpovídá výnosu za období.">
                  Heatmapa
                </InfoTip>
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Barevná mapa, kde zelená je růst a červená pokles.
              </p>
            </div>
          </div>
        </section>

        {/* Prolinkování + trust */}
        <section className="py-8">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4">
            Kam dál
          </h2>
          <InfografikyLinkRow
            links={[
              { href: '/nejlepsi-etf', label: 'Žebříčky ETF' },
              { href: '/srovnani-etf', label: 'Srovnání fondů' },
              { href: '/nejlepsi-etf/nejlevnejsi-etf', label: 'Nejlevnější ETF' },
              { href: '/kde-koupit-etf', label: 'Kde koupit ETF' },
            ]}
          />

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              [ShieldCheck, 'Nezávislé srovnání', 'Žádné reklamy ani placené pořadí.', '/o-nas'],
              [Star, '12 let praxe ve financích', 'Obsah od Tomáše Kostrhouna, ne anonymně.', '/o-nas'],
              [Banknote, 'Kde koupit ETF', 'Srovnání brokerů pro české investory.', '/kde-koupit-etf'],
            ].map(([Icon, t, d, href]: any) => (
              <Link
                key={t}
                href={href}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 transition-all"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0">
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </span>
                <span>
                  <span className="block font-semibold text-sm text-slate-900">{t}</span>
                  <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">{d}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Disclaimer – na konci */}
        <section className="pb-12">
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-500 leading-relaxed">
            Obsah má vzdělávací charakter a nepředstavuje investiční doporučení. Minulá výkonnost
            nezaručuje budoucí výnosy. Výnosy jsou přepočtené do korun a mohou se lišit od výnosů
            v původní měně fondu.
          </div>
        </section>
      </main>

      {/* Patička – dle homepage vzoru */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">ETF průvodce.cz</span>
          <p className="max-w-md text-center sm:text-right leading-relaxed">
            Obsah má vzdělávací charakter a nepředstavuje investiční doporučení. Minulá výkonnost
            nezaručuje budoucí výnosy.
          </p>
        </div>
      </footer>
    </div>
  );
}
