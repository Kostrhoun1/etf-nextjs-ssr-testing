import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, ArrowRight, Layers, BarChart3, Globe2, Factory,
  Sparkles, Coins, Compass, PieChart, ShoppingCart, ChevronRight, ListOrdered,
} from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { categoryConfigs, getTotalETFCount, getDataDate } from '@/lib/etf-data';
import { nactiSouhrnyZebricku, type SouhrnZebricku } from '@/lib/zebricky';
import AktualnostDat from '@/components/design-preview/AktualnostDat';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Žebříčky ETF – nejlepší fondy podle třídy, indexu i tématu',
  description:
    'Rozcestník všech žebříčků ETF: S&P 500, celý svět, dluhopisy, zlato i tematické fondy. U každého počet fondů, nejnižší poplatek a výnos největšího fondu v korunách.',
  alternates: { canonical: '/zebricky' },
};

/* Cílová routa žebříčku. */
const catHref = (slug: string) => `/nejlepsi-etf/${slug}`;

/* Krátký název do řádku rozcestníku („Nejlepší S&P 500 ETF“ ×48 byla zeď stejných slov – revize
   18. 10. 2026) + nepovinné upřesnění. Titulek stránky žebříčku (SEO) zůstává beze změny. */
const POPISKY: Record<string, [string, string?]> = {
  'nejlepsi-etf-2026': ['Největší fondy', 'napříč všemi třídami aktiv'],
  'nejlevnejsi-etf': ['Nejlevnější fondy', 'podle poplatku TER'],
  'nejlepsi-akciove-etf': ['Akciové'],
  'nejlepsi-dluhopisove-etf': ['Dluhopisové'],
  'nejlepsi-komoditni-etf': ['Komoditní'],
  'nejlepsi-dividendove-etf': ['Dividendové', 's výplatou dividend'],
  'nejlepsi-realitni-etf': ['Realitní', 'REITs'],
  'nejlepsi-vladni-dluhopisy-etf': ['Vládní dluhopisy'],
  'nejlepsi-korporatni-dluhopisy-etf': ['Firemní dluhopisy'],
  'nejlepsi-high-yield-etf': ['High yield', 'dluhopisy s vyšším rizikem'],
  'nejlepsi-sp500-etf': ['S&P 500', '500 největších firem USA'],
  'nejlepsi-msci-world-etf': ['MSCI World', 'vyspělé trhy'],
  'nejlepsi-nasdaq-etf': ['Nasdaq-100', 'americké technologie'],
  'nejlepsi-dax-etf': ['DAX', 'Německo'],
  'nejlepsi-stoxx600-etf': ['STOXX Europe 600', 'Evropa'],
  'nejlepsi-ftse100-etf': ['FTSE 100', 'Velká Británie'],
  'nejlepsi-celosvetove-etf': ['Celý svět', 'vyspělé i rozvíjející se trhy'],
  'nejlepsi-americke-etf': ['USA'],
  'nejlepsi-evropske-etf': ['Evropa'],
  'nejlepsi-japonske-etf': ['Japonsko'],
  'nejlepsi-cinske-etf': ['Čína'],
  'nejlepsi-indicke-etf': ['Indie'],
  'nejlepsi-emerging-markets-etf': ['Rozvíjející se trhy', 'emerging markets'],
  'nejlepsi-asijsko-pacificke-etf': ['Asie a Pacifik'],
  'nejlepsi-technologicke-etf': ['Technologie'],
  'nejlepsi-healthcare-etf': ['Zdravotnictví'],
  'nejlepsi-financni-etf': ['Finance'],
  'nejlepsi-energeticke-etf': ['Energetika'],
  'nejlepsi-prumyslove-etf': ['Průmysl'],
  'nejlepsi-spotrebitelske-etf': ['Spotřební zboží'],
  'nejlepsi-infrastrukturni-etf': ['Infrastruktura'],
  'nejlepsi-ai-etf': ['Umělá inteligence'],
  'nejlepsi-robotika-etf': ['Robotika'],
  'nejlepsi-cloud-etf': ['Cloud'],
  'nejlepsi-kyberbezpecnost-etf': ['Kyberbezpečnost'],
  'nejlepsi-obnovitelne-zdroje-etf': ['Obnovitelné zdroje'],
  'nejlepsi-biotechnologie-etf': ['Biotechnologie'],
  'nejlepsi-defense-etf': ['Obrana'],
  'nejlepsi-esg-etf': ['ESG', 'udržitelné investování'],
  'nejlepsi-zlato-etf': ['Zlato'],
  'nejlepsi-stribro-etf': ['Stříbro'],
  'nejlepsi-ropa-etf': ['Ropa'],
  'nejlepsi-bitcoin-etf': ['Bitcoin'],
  'nejlepsi-value-etf': ['Value', 'levnější firmy'],
  'nejlepsi-growth-etf': ['Growth', 'růstové firmy'],
  'nejlepsi-small-cap-etf': ['Malé firmy', 'small cap'],
  'nejlepsi-akumulacni-etf': ['Akumulační', 'dividendy zůstávají ve fondu'],
  'nejlepsi-distribucni-etf': ['Distribuční', 'dividendy se vyplácejí'],
};

/* Nejhledanější žebříčky – štítek „populární“ (ne hvězda: ★ jinde na webu znamená hodnocení). */
const HLEDANE = new Set(['nejlepsi-sp500-etf', 'nejlepsi-celosvetove-etf', 'nejlepsi-msci-world-etf', 'nejlevnejsi-etf', 'nejlepsi-nasdaq-etf', 'nejlepsi-zlato-etf']);

/* Skupiny žebříčků (id = kotva). Každý žebříček právě jednou; co v configu chybí ve skupinách,
   spadne do „Další žebříčky“ – žádný se neztratí a žádný mrtvý odkaz. */
const GROUP_DEFS: { id: string; title: string; chip: string; icon: typeof Layers; slugs: string[] }[] = [
  {
    id: 'index', chip: 'Index', title: 'Podle indexu', icon: BarChart3,
    slugs: ['nejlepsi-sp500-etf', 'nejlepsi-celosvetove-etf', 'nejlepsi-msci-world-etf', 'nejlepsi-nasdaq-etf', 'nejlepsi-stoxx600-etf', 'nejlepsi-dax-etf', 'nejlepsi-ftse100-etf'],
  },
  {
    id: 'region', chip: 'Region', title: 'Podle regionu', icon: Globe2,
    slugs: ['nejlepsi-americke-etf', 'nejlepsi-evropske-etf', 'nejlepsi-emerging-markets-etf', 'nejlepsi-japonske-etf', 'nejlepsi-cinske-etf', 'nejlepsi-indicke-etf', 'nejlepsi-asijsko-pacificke-etf'],
  },
  {
    id: 'trida', chip: 'Třída aktiv', title: 'Podle třídy aktiv', icon: Layers,
    slugs: ['nejlepsi-akciove-etf', 'nejlepsi-dluhopisove-etf', 'nejlepsi-vladni-dluhopisy-etf', 'nejlepsi-korporatni-dluhopisy-etf', 'nejlepsi-high-yield-etf', 'nejlepsi-dividendove-etf', 'nejlepsi-realitni-etf', 'nejlepsi-komoditni-etf'],
  },
  {
    id: 'komodity', chip: 'Komodity a krypto', title: 'Komodity a krypto', icon: Coins,
    slugs: ['nejlepsi-zlato-etf', 'nejlepsi-stribro-etf', 'nejlepsi-ropa-etf', 'nejlepsi-bitcoin-etf'],
  },
  {
    id: 'sektor', chip: 'Sektor', title: 'Podle sektoru', icon: Factory,
    slugs: ['nejlepsi-technologicke-etf', 'nejlepsi-healthcare-etf', 'nejlepsi-financni-etf', 'nejlepsi-energeticke-etf', 'nejlepsi-prumyslove-etf', 'nejlepsi-spotrebitelske-etf', 'nejlepsi-infrastrukturni-etf'],
  },
  {
    id: 'tema', chip: 'Téma', title: 'Podle tématu', icon: Sparkles,
    slugs: ['nejlepsi-ai-etf', 'nejlepsi-robotika-etf', 'nejlepsi-cloud-etf', 'nejlepsi-kyberbezpecnost-etf', 'nejlepsi-obnovitelne-zdroje-etf', 'nejlepsi-biotechnologie-etf', 'nejlepsi-defense-etf', 'nejlepsi-esg-etf'],
  },
  {
    id: 'styl', chip: 'Styl', title: 'Podle stylu', icon: Compass,
    slugs: ['nejlepsi-value-etf', 'nejlepsi-growth-etf', 'nejlepsi-small-cap-etf', 'nejlepsi-akumulacni-etf', 'nejlepsi-distribucni-etf'],
  },
  {
    id: 'vse', chip: 'Všechny fondy', title: 'Napříč všemi fondy', icon: ListOrdered,
    slugs: ['nejlevnejsi-etf', 'nejlepsi-etf-2026'],
  },
];

/* Formátování (− je skutečné minus). */
const cz = (v: number, d = 1) => v.toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d });
const NB = '\u00a0';
const pct = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : v < 0 ? '\u2212' : ''}${cz(Math.abs(v))}${NB}%`);
const terF = (v: number | null | undefined) => (v == null ? '—' : `${cz(v, 2)}${NB}%`);
const fondu = (n: number) => (n === 1 ? 'fond' : n >= 2 && n <= 4 ? 'fondy' : 'fondů');
const fmtDatum = (d: Date) => d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });

/** Řádek žebříčku: název (+ upřesnění), počet fondů, nejnižší TER, největší fond a jeho výnos za 12 m v Kč. */
function Radek({ slug, s }: { slug: string; s: SouhrnZebricku | null }) {
  const [label, sub] = POPISKY[slug] ?? [categoryConfigs[slug]?.title ?? slug];
  const r1 = s?.nejvetsi?.r1 ?? null;
  const nv = s?.nejvetsi;
  return (
    <li data-pocet={s?.pocet ?? ''} data-slug={slug}>
      <Link
        href={catHref(slug)}
        className="group grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_3.5rem_4.5rem_6.5rem_1rem] items-center gap-x-3 px-4 py-2.5 min-h-[3.25rem] hover:bg-teal-50/50 transition-colors"
      >
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 min-w-0">
            <span className="text-[15px] font-semibold text-slate-900 group-hover:text-teal-800 truncate">{label}</span>
            {HLEDANE.has(slug) && <span className="shrink-0 rounded-full bg-teal-50 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-teal-800 ring-1 ring-teal-100">populární</span>}
          </span>
          {/* Mobil: počet a poplatek pod názvem; desktop: upřesnění */}
          <span className="block text-xs text-slate-500 truncate">
            <span className="sm:hidden">{s ? `${s.pocet.toLocaleString('cs-CZ')} ${fondu(s.pocet)} · TER od ${terF(s.nejlevnejsi?.ter)}` : '—'}</span>
            {sub && <span className="hidden sm:inline">{sub}</span>}
          </span>
        </span>
        <span className="hidden sm:block text-right text-sm tabular-nums text-slate-700">{s ? s.pocet.toLocaleString('cs-CZ') : '—'}</span>
        <span className="hidden sm:block text-right text-sm tabular-nums text-slate-700">{terF(s?.nejlevnejsi?.ter)}</span>
        <span className="text-right">
          <span className={`block text-sm font-semibold tabular-nums ${r1 == null ? 'text-slate-400' : r1 >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{pct(r1)}</span>
          <span className="block text-[11px] text-slate-500 whitespace-nowrap">{nv ? (nv.ticker ?? nv.isin) : '—'}<span className="sm:hidden"> · 12 m</span></span>
        </span>
        <ChevronRight className="hidden sm:block w-4 h-4 text-slate-300 group-hover:text-teal-700" />
      </Link>
    </li>
  );
}

export default async function ZebrickyPage() {
  const [souhrn, totalCount, dataDate] = await Promise.all([
    nactiSouhrnyZebricku(),
    getTotalETFCount(),
    getDataDate(new Date()),
  ]);
  const datum = fmtDatum(dataDate);

  // Skupiny jen z reálně existujících kategorií; zbytek configu do „Další žebříčky“.
  const groups = GROUP_DEFS.map((g) => ({ ...g, slugs: g.slugs.filter((s) => categoryConfigs[s]) })).filter((g) => g.slugs.length);
  const covered = new Set(groups.flatMap((g) => g.slugs));
  const ostatni = Object.keys(categoryConfigs).filter((s) => !covered.has(s));
  if (ostatni.length) groups.push({ id: 'dalsi', title: 'Další žebříčky', chip: 'Další', icon: Layers, slugs: ostatni });

  const totalCategories = Object.keys(categoryConfigs).length;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Žebříčky ETF', item: 'https://etfpruvodce.cz/zebricky' },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Žebříčky ETF',
    description: 'Rozcestník žebříčků ETF fondů podle indexu, regionu, třídy aktiv, sektoru, tématu a stylu.',
    hasPart: groups.map((g) => ({
      '@type': 'ItemList',
      name: g.title,
      itemListElement: g.slugs.map((s, i) => ({
        '@type': 'ListItem', position: i + 1, name: categoryConfigs[s].title, url: `https://etfpruvodce.cz${catHref(s)}`,
      })),
    })),
  };

  const hlavicka = (
    <div className="hidden sm:grid sm:grid-cols-[minmax(0,1fr)_3.5rem_4.5rem_6.5rem_1rem] gap-x-3 px-4 py-2 text-[11px] font-medium text-slate-500 border-b border-slate-100 bg-slate-50/60">
      <span>Žebříček</span>
      <span className="text-right whitespace-nowrap"><InfoTip label="Kolik fondů do žebříčku patří: jen fondy nad práh velikosti (10, 50 nebo 100 mil. € – uvedený na stránce žebříčku), bez pákových produktů a fondů, jejichž data nebyla 14 dní aktualizována.">Fondů</InfoTip></span>
      <span className="text-right whitespace-nowrap"><InfoTip label="Nejnižší roční poplatek (TER) mezi fondy žebříčku.">TER od</InfoTip></span>
      <span className="text-right whitespace-nowrap"><InfoTip label={`Výnos největšího fondu žebříčku za posledních 12 měsíců v Kč, k ${datum}. Pod číslem jeho ticker.`}>Největší, 12 m</InfoTip></span>
      <span />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      {/* Header – stejná navigace jako homepage */}
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
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <span className="text-slate-700">Žebříčky ETF</span>
        </nav>

        {/* Úvod – jedna věta, čísla, datum */}
        <section data-sekce="uvod" className="pt-2 pb-5">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Žebříčky ETF</h1>
          <p className="mt-2 max-w-2xl text-[15px] md:text-base text-slate-600 leading-relaxed">
            {totalCategories} žebříčků podle indexu, regionu i tématu – u každého počet fondů, nejnižší poplatek a výnos největšího fondu v korunách.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
            {totalCount > 0 && <span><strong className="font-semibold text-slate-900 tabular-nums">{totalCount.toLocaleString('cs-CZ')}</strong> fondů ve srovnávači</span>}
            <AktualnostDat datum={dataDate} />
          </div>
          {/* Proč „Akciové 1 780“, když srovnávač má 2 900+ akciových fondů (kolo 5): práh velikosti žebříčku.
              Změřeno 18. 10. 2026: data 98,7 % fondů jsou z téhož dne – rozdíl NENÍ čerstvost, ale fondy pod 50 mil. €. */}
          <p className="mt-2 max-w-2xl text-xs text-slate-500 leading-relaxed">
            Žebříčky berou jen fondy nad {'10–100'}{NB}mil.{NB}€ (práh podle žebříčku) s daty mladšími 14{NB}dní – proto mají méně fondů než srovnávač.
          </p>
        </section>

        {/* Rychlá navigace na skupiny (mobil: vodorovně posuvná) */}
        <nav aria-label="Skupiny žebříčků" className="-mx-4 px-4 pb-5 overflow-x-auto [scrollbar-width:none]">
          <ul className="flex gap-2 w-max">
            {groups.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="inline-flex items-center gap-1.5 min-h-9 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-800 whitespace-nowrap">
                  <g.icon className="w-3.5 h-3.5 text-teal-700" /> {g.chip}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobil nemá hlavičku sloupců → jednou vysvětlit číslo vpravo */}
        <p className="sm:hidden -mt-1 pb-4 text-xs text-slate-500">Vpravo výnos největšího fondu žebříčku za 12 měsíců v Kč.</p>

        {/* Skupiny – dva sloupce na desktopu, kompaktní řádky s čísly */}
        {/* Sloupce (ne mřížka po dvojicích): krátká skupina vedle dlouhé nenechá díru (revize kola 2). */}
        <div className="lg:columns-2 lg:gap-5 pb-4">
          {groups.map((g) => (
            <section key={g.id} id={g.id} data-sekce={`skupina-${g.id}`} className="scroll-mt-20 min-w-0 break-inside-avoid pb-6" aria-labelledby={`h-${g.id}`}>
              <h2 id={`h-${g.id}`} className="flex items-center gap-2 mb-2 text-lg font-bold tracking-tight text-slate-900">
                <g.icon className="w-[18px] h-[18px] text-teal-700" /> {g.title}
              </h2>
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                {hlavicka}
                <ul className="divide-y divide-slate-100">
                  {g.slugs.map((s) => <Radek key={s} slug={s} s={souhrn.get(s) ?? null} />)}
                </ul>
              </div>
            </section>
          ))}
        </div>

        {/* Kam dál */}
        <section data-sekce="kam-dal" className="pb-10">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Kam dál</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { href: '/srovnani', label: 'Srovnávač ETF', desc: 'Vlastní filtry napříč všemi fondy.', icon: BarChart3 },
              { href: '/portfolio-strategie', label: 'Modelová portfolia', desc: 'Strategie složené z ETF.', icon: PieChart },
              { href: '/kde-koupit', label: 'Kde koupit ETF', desc: 'Brokeři dostupní v ČR.', icon: ShoppingCart },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0"><l.icon className="w-5 h-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900">{l.label}</span>
                  <span className="block text-xs text-slate-500 mt-0.5">{l.desc}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700" />
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500 leading-relaxed max-w-3xl">
            Žebříčky řadí fondy podle dat (velikost, poplatek, výnos v Kč) – pořadí není placené a není investičním doporučením.
            Vynecháváme pákové produkty a fondy, jejichž data nebyla 14 dní aktualizována.
          </p>
        </section>

        <section className="pb-12">
          <InvestmentDisclaimer variant="inline" />
        </section>
      </main>
    </div>
  );
}
