import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  getFeaturedETFs,
  getTotalETFCount,
  getDataDatum,
  getTopETFsForCategory,
  categoryConfigs,
} from '@/lib/etf-data';
import AktualnostDat from '@/components/design-preview/AktualnostDat';
import {
  InfografikyHeatGrid,
  InfografikyListPanel,
  InfografikyLinkRow,
  type InfografikyHeatTile,
} from '@/components/design-preview/InfografikyUI';
import { TrendingUp, Wallet, Grid3x3, ShieldCheck, Star, Layers } from 'lucide-react';
import { nactiRozlozeniTer } from '@/lib/infografikyData';
import { odlehleIsiny } from '@/lib/trhy';
import { bezOdlehlehoVynosu } from '@/lib/vynosNeovereny';
import { nejcastejsiDatumVynosu, jineDatumVynosu } from '@/lib/datumVynosu';
import { titulek } from '@/lib/seoTitulek';
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

/* Regiony, sektory a třídy aktiv pro tržní heatmapu – hodnota = výnos NEJVĚTŠÍHO fondu žebříčku za 12 měsíců v Kč
   (z DB, nic napevno). Kolo 7 (22. 10. 2026): dřív 8 dlaždic, všechny zelené – heatmapa bez poklesů nic neukazuje.
   Seznam pokrývá i trhy a aktiva, která umí klesat (Čína, Indie, zlato, bitcoin, dluhopisy, čistá energie);
   barvu určují data, ne výběr. Názvy = názvy žebříčků („Realitní“, ne „Nemovitosti“). */
const HEATMAP_CATEGORIES: { slug: string; label: string }[] = [
  { slug: 'nejlepsi-celosvetove-etf', label: 'Celý svět' },
  { slug: 'nejlepsi-sp500-etf', label: 'USA (S&P 500)' },
  { slug: 'nejlepsi-evropske-etf', label: 'Evropa' },
  { slug: 'nejlepsi-japonske-etf', label: 'Japonsko' },
  { slug: 'nejlepsi-emerging-markets-etf', label: 'Rozvíjející se trhy' },
  { slug: 'nejlepsi-cinske-etf', label: 'Čína' },
  { slug: 'nejlepsi-indicke-etf', label: 'Indie' },
  { slug: 'nejlepsi-technologicke-etf', label: 'Technologie' },
  { slug: 'nejlepsi-healthcare-etf', label: 'Zdravotnictví' },
  { slug: 'nejlepsi-financni-etf', label: 'Finance' },
  { slug: 'nejlepsi-energeticke-etf', label: 'Energetika' },
  { slug: 'nejlepsi-obnovitelne-zdroje-etf', label: 'Obnovitelné zdroje' },
  { slug: 'nejlepsi-realitni-etf', label: 'Realitní (REIT)' },
  { slug: 'nejlepsi-vladni-dluhopisy-etf', label: 'Vládní dluhopisy' },
  { slug: 'nejlepsi-zlato-etf', label: 'Zlato' },
  { slug: 'nejlepsi-bitcoin-etf', label: 'Bitcoin' },
];

async function getHeatmapTiles(): Promise<{ tiles: InfografikyHeatTile[]; den: Date | null }> {
  const [odlehle, results] = await Promise.all([
    odlehleIsiny().catch(() => new Set<string>()),
    Promise.all(
      HEATMAP_CATEGORIES.map(async (c) => {
        const cfg = categoryConfigs[c.slug];
        if (!cfg) return null;
        try {
          const etfs = await getTopETFsForCategory({ ...cfg, limit: 1 });
          return etfs[0] ? { c, top: etfs[0] } : null;
        } catch {
          return null;
        }
      }),
    ),
  ]);
  const nalezene = results.filter((x): x is NonNullable<typeof x> => x != null);
  // Den výnosů heatmapy = nejčastější returns_as_of; fond se zpožděnou řadou ukáže vlastní den (pravidlo č. 1).
  const den = nejcastejsiDatumVynosu(nalezene.map((x) => x.top));
  const tiles = nalezene.map(({ c, top }) => {
    const r = bezOdlehlehoVynosu(top, odlehle) ?? top;
    return {
      label: c.label,
      value: r.return_1y_czk ?? null, // nikdy EUR místo Kč; odlehlý výnos → „—“
      href: `/nejlepsi-etf/${c.slug}`,
      ticker: zobrazovanyTicker(top as unknown as Record<string, unknown>),
      jinyDen: jineDatumVynosu(top, den),
    } as InfografikyHeatTile;
  });
  return { tiles, den };
}

export default async function InfografikyRozcestnik() {
  const [featured, totalCount, heat, dataDate, ter] = await Promise.all([
    getFeaturedETFs(),
    getTotalETFCount(),
    getHeatmapTiles(),
    getDataDatum(), // kolo 7: bez návratu ke dnešku (null = datum neukazovat)
    nactiRozlozeniTer(),
  ]);
  const heatTiles = heat.tiles;
  const denCz = (d: Date | null) => (d ? d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '—');

  const count = totalCount > 0 ? totalCount : TOTAL_FALLBACK;
  // SEO audit 6b (art director): „Nejvýkonnější ETF“ (Korea +101 %, polovodiče) šlo proti rozhodnutí „široké seznamy
  // bez Nejvýkonnější“ (ZAMERNA-ROZHODNUTI.md) → neutrální přehledy: největší podle majetku a nejlevnější podle
  // JEDNOHO pravidla webu (porovnejNejlevnejsi: TER > 0, ≥ 100 mil. €, při shodě akumulační, pak větší; bez zajištění).
  const nazevRadku = (e: ETFBasicInfo) => shortName(e.name);
  const popisRadku = (e: ETFBasicInfo) => zobrazovanyTicker(e as unknown as Record<string, unknown>) ?? e.fund_provider ?? null;
  const nejvetsi = (featured.bySize || []).slice(0, 5);
  const maxVel = Math.max(1, ...nejvetsi.map((e) => e.fund_size_numeric ?? 0));
  const maxPasmo = ter ? Math.max(1, ...ter.pasma.map((p) => p.pocet)) : 1;
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
          {dataDate && <AktualnostDat datum={dataDate} className="mt-3" />}
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
          {/* Kolo 7: místo 5 náhodně vybraných fondů s TER 0,03 % (stejně dlouhé pruhy) rozložení poplatků
              a VŠECHNY fondy s nejnižším TER. Chybí-li data, panel se nevykreslí (raději nic než část). */}
          {ter && (
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4">
                <Wallet className="w-5 h-5 text-teal-700" aria-hidden="true" /> Kolik ETF stojí: poplatky (TER)
              </h2>
              <div data-infografika="ter" className="min-w-0 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900">Roční poplatek za správu (TER) u {ter.pocet.toLocaleString('cs-CZ')} fondů</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Fondy nad 100 mil. € bez měnového zajištění · data k {denCz(ter.den)} · medián {terText(ter.median)}</p>
                  </div>
                  <Link href="/nejlepsi-etf/nejlevnejsi-etf" className="text-xs text-teal-700 hover:text-teal-800 shrink-0">celý žebříček →</Link>
                </div>
                <ul className="px-4 py-3 space-y-1.5">
                  {ter.pasma.map((p) => (
                    <li key={p.label} className="flex items-center gap-3 text-sm">
                      <span className="w-24 shrink-0 text-slate-600 tabular-nums">{p.label}</span>
                      <span className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <span className="block h-full rounded-full bg-teal-600" style={{ width: `${p.pocet ? Math.max(2, (p.pocet / maxPasmo) * 100) : 0}%` }} />
                      </span>
                      <span className="w-20 shrink-0 text-right tabular-nums font-semibold text-slate-900">{p.pocet.toLocaleString('cs-CZ')} <span className="font-normal text-slate-500">fondů</span></span>
                    </li>
                  ))}
                </ul>
                <div data-ter-nejnizsi={ter.nejnizsi} data-ter-pocet={ter.nejlevnejsi.length} className="border-t border-slate-100 px-4 py-3">
                  <p className="text-sm text-slate-700">
                    Nejnižší poplatek <strong className="tabular-nums">{terText(ter.nejnizsi)}</strong> má {ter.nejlevnejsi.length === 1 ? 'jediný fond' : `${ter.nejlevnejsi.length} fondů`} (od největšího):
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {ter.nejlevnejsi.map((f) => (
                      <li key={f.isin}>
                        <Link href={`/etf/${f.isin}`} title={f.nazev} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-800">
                          {f.ticker ?? f.isin}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Tržní heatmapa – jednou, v plné velikosti */}
        <section id="trzni-heatmapa" className="scroll-mt-20 pb-10">
          <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4">
            <Grid3x3 className="w-5 h-5 text-teal-700" aria-hidden="true" /> Tržní heatmapa: regiony a sektory
          </h2>
          <InfografikyHeatGrid tiles={heatTiles} />
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Hodnota = výnos největšího fondu žebříčku (ticker pod číslem) za 12 měsíců v Kč, k {denCz(heat.den)}. Zelená je růst,
            červená pokles; minulý výnos nezaručuje budoucí.
          </p>
        </section>

        {/* Kolo 7: blok „Co která infografika ukazuje“ odstraněn – opakoval popisky panelů výše. */}
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

          {/* „Kde koupit ETF“ je už v řádku odkazů výše – karta byla duplicitní (kolo 7). */}
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {([
              [ShieldCheck, 'Nezávislé srovnání', 'Žádné reklamy ani placené pořadí.', '/o-nas'],
              [Star, '12+ let v českém bankovnictví', 'Obsah od Tomáše Kostrhouna, ne anonymně.', '/o-nas'],
            ] as [typeof Star, string, string, string][]).map(([Icon, t, d, href]) => (
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
