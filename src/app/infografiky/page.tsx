import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  getFeaturedETFs,
  getTotalETFCount,
  getDataDate,
  getTopETFsForCategory,
  categoryConfigs,
} from '@/lib/etf-data';
import InfoTip from '@/components/design-preview/InfoTip';
import AktualnostDat from '@/components/design-preview/AktualnostDat';
import {
  InfografikyHeatGrid,
  InfografikyListPanel,
  InfografikyLinkRow,
  type InfografikyHeatTile,
} from '@/components/design-preview/InfografikyUI';
import { TrendingUp, Wallet, Grid3x3, ShieldCheck, Star, Banknote, Layers } from 'lucide-react';
import { titulek } from '@/lib/seoTitulek';
import { porovnejNejlevnejsi, jeAkumulacni } from '@/lib/trhy';
import { detectHedging } from '@/utils/hedgingDetection';
import { zobrazovanyTicker } from '@/lib/ticker';
import { shortName } from '@/components/design-preview/CategoryUI';
import type { ETFBasicInfo } from '@/lib/etf-data';

export const revalidate = 86400;

const TOTAL_FALLBACK = 4800;

export const metadata: Metadata = {
  title: titulek('Infografiky ETF: velikost, poplatky a tržní heatmapa'),
  description:
    'Vizuální přehledy z dat ETF fondů: největší fondy podle majetku, nejlevnější podle poplatku TER a tržní heatmapa regionů a sektorů s výnosy v korunách.',
  alternates: { canonical: 'https://etfpruvodce.cz/infografiky' },
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
  { slug: 'nejlepsi-realitni-etf', label: 'Nemovitosti' },
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
        const value = top.return_1y_czk ?? null; // nikdy EUR místo Kč
        return { label: c.label, value, href: `/nejlepsi-etf/${c.slug}` } as InfografikyHeatTile;
      } catch {
        return null;
      }
    })
  );
  return results.filter((t): t is InfografikyHeatTile => t != null);
}

export default async function InfografikyRozcestnik() {
  const [featured, totalCount, heatTiles, dataDate] = await Promise.all([
    getFeaturedETFs(),
    getTotalETFCount(),
    getHeatmapTiles(),
    getDataDate(new Date()),
  ]);

  const count = totalCount > 0 ? totalCount : TOTAL_FALLBACK;
  // SEO audit 6b (art director): „Nejvýkonnější ETF“ (Korea +101 %, polovodiče) šlo proti rozhodnutí „široké seznamy
  // bez Nejvýkonnější“ (ZAMERNA-ROZHODNUTI.md) → neutrální přehledy: největší podle majetku a nejlevnější podle
  // JEDNOHO pravidla webu (porovnejNejlevnejsi: TER > 0, ≥ 100 mil. €, při shodě akumulační, pak větší; bez zajištění).
  const nazevRadku = (e: ETFBasicInfo) => shortName(e.name);
  const popisRadku = (e: ETFBasicInfo) => zobrazovanyTicker(e as unknown as Record<string, unknown>) ?? e.fund_provider ?? null;
  const nejvetsi = (featured.bySize || []).slice(0, 5);
  const maxVel = Math.max(1, ...nejvetsi.map((e) => e.fund_size_numeric ?? 0));
  const nejlevnejsi = (featured.lowCost || [])
    .filter((e) => (e.ter_numeric ?? 0) > 0 && (e.fund_size_numeric ?? 0) >= 100 && !detectHedging(e.name).isHedged)
    .sort((a, b) => porovnejNejlevnejsi(
      { ter: a.ter_numeric, acc: jeAkumulacni(a.distribution_policy), velikost: a.fund_size_numeric },
      { ter: b.ter_numeric, acc: jeAkumulacni(b.distribution_policy), velikost: b.fund_size_numeric },
    ))
    .slice(0, 5);
  const maxTer = Math.max(0.01, ...nejlevnejsi.map((e) => e.ter_numeric ?? 0));
  const velikostText = (v: number | null) => (v == null ? '—' : v >= 1000 ? `${(v / 1000).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} mld. €` : `${Math.round(v).toLocaleString('cs-CZ')} mil. €`);
  const terText = (t: number | null) => (t == null ? '—' : `${t.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`);

  // ItemList schema pro tři infografiky (rozcestník, ne Article)
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Největší ETF podle majetku',
        description: 'Fondy s největším spravovaným majetkem napříč všemi třídami aktiv.',
        url: 'https://etfpruvodce.cz/nejlepsi-etf/nejlepsi-etf-2026',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Nejlevnější ETF podle TER',
        description: 'Fondy s nejnižším ročním poplatkem za správu.',
        url: 'https://etfpruvodce.cz/nejlepsi-etf/nejlevnejsi-etf',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Tržní heatmapa',
        description: 'Barevná mapa výkonnosti regionů a sektorů.',
        url: 'https://etfpruvodce.cz/infografiky#trzni-heatmapa',
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Infografiky', item: 'https://etfpruvodce.cz/infografiky' },
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
        <nav aria-label="Drobečková navigace" className="pt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <span className="text-slate-700">Infografiky</span>
        </nav>

        {/* Hero / intro – kompaktní, bez tmavého panelu */}
        <section className="pt-5 pb-8 md:pb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Infografiky ETF: trhy a fondy přehledně
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 leading-relaxed">
            Vizuální přehledy z dat {`${(Math.floor(count / 100) * 100).toLocaleString('cs-CZ')}+`} fondů: největší fondy podle majetku, nejlevnější
            podle poplatku a tržní heatmapa regionů a sektorů s výnosy v korunách.
          </p>
          {/* Pravidlo č. 1: čísla na stránce bez data nebyla (SEO audit 20. 10. 2026). */}
          <AktualnostDat datum={dataDate} className="mt-3" />
        </section>

        {/* Dva přehledy fondů – každé číslo jen jednou (dřív top 3 v kartách a znovu top 5 pod nimi). */}
        <section className="pb-10 grid lg:grid-cols-2 gap-6">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4">
              <Layers className="w-5 h-5 text-teal-700" aria-hidden="true" /> Největší ETF podle majetku
            </h2>
            <InfografikyListPanel
              title="Spravovaný majetek fondu"
              subtitle="Napříč akciemi, dluhopisy i komoditami – velikost neříká nic o budoucím výnosu"
              href="/nejlepsi-etf/nejlepsi-etf-2026"
              hrefLabel="celý žebříček"
              rows={nejvetsi.map((e) => ({ isin: e.isin, nazev: nazevRadku(e), popis: popisRadku(e), hodnota: velikostText(e.fund_size_numeric), podil: (e.fund_size_numeric ?? 0) / maxVel }))}
            />
          </div>
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4">
              <Wallet className="w-5 h-5 text-teal-700" aria-hidden="true" /> Nejlevnější ETF podle TER
            </h2>
            <InfografikyListPanel
              title="Roční poplatek za správu (TER)"
              subtitle="Fondy nad 100 mil. € bez měnového zajištění; při shodě akumulační, pak větší"
              href="/nejlepsi-etf/nejlevnejsi-etf"
              hrefLabel="celý žebříček"
              rows={nejlevnejsi.map((e) => ({ isin: e.isin, nazev: nazevRadku(e), popis: popisRadku(e), hodnota: terText(e.ter_numeric), podil: (e.ter_numeric ?? 0) / maxTer }))}
            />
          </div>
        </section>

        {/* Tržní heatmapa – jednou, v plné velikosti */}
        <section id="trzni-heatmapa" className="scroll-mt-20 pb-10">
          <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4">
            <Grid3x3 className="w-5 h-5 text-teal-700" aria-hidden="true" /> Tržní heatmapa: regiony a sektory
          </h2>
          <InfografikyHeatGrid tiles={heatTiles} />
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Hodnota = výnos největšího fondu v kategorii za 12 měsíců, přepočteno do Kč. Zelená je růst, červená pokles;
            minulý výnos nezaručuje budoucí.
          </p>
        </section>

        {/* Edukační pruh – ikonové vysvětlivky, BEZ schémat */}
        <section className="py-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4">
            Co která infografika ukazuje
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3">
                <Layers className="w-5 h-5" strokeWidth={2} />
              </span>
              <h3 className="text-sm font-semibold text-slate-900">
                <InfoTip label="Kolik peněz fond spravuje (v eurech). Velký fond má obvykle nižší riziko zrušení a užší rozpětí mezi nákupní a prodejní cenou – o budoucím výnosu nic neříká.">
                  Velikost fondu
                </InfoTip>
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Kolik majetku fond spravuje – ne jak si povede.
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
              { href: '/zebricky', label: 'Žebříčky ETF' },
              { href: '/srovnani', label: 'Srovnání fondů' },
              { href: '/nejlepsi-etf/nejlevnejsi-etf', label: 'Nejlevnější ETF' },
              { href: '/kde-koupit', label: 'Kde koupit ETF' },
            ]}
          />

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              [ShieldCheck, 'Nezávislé srovnání', 'Žádné reklamy ani placené pořadí.', '/o-nas'],
              [Star, '12+ let v českém bankovnictví', 'Obsah od Tomáše Kostrhouna, ne anonymně.', '/o-nas'],
              [Banknote, 'Kde koupit ETF', 'Srovnání brokerů pro české investory.', '/kde-koupit'],
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
    </div>
  );
}
