import type { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import AutorBox from '@/components/design-preview/AutorBox';
import { FAKTORY, vyctiRoky } from '@/components/design-preview/FactorDetail';
import { clanekSchema, upravenoDlouze } from '@/lib/redakce';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, Database, Calculator, Wallet, Scale, ShieldCheck, LineChart,
  AlertTriangle, BookOpen, Layers,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { titulek } from '@/lib/seoTitulek';
import SouvisejiciZebricky from '@/components/design-preview/SouvisejiciZebricky';
import { nactiFaktory, porazily, FAKTORY_DEF, POCATECNI, PRODLOUZENI, SHODA, type FaktoryVysledek, type FaktorVysledek, type FaktorSlug } from '@/lib/faktory/vypocet';
import { nactiFondyFaktoru, nactiTerSp500 } from '@/lib/faktory/fondy';
import { pct, pctBez, pb, kc, kcKratce, den, mesic, ter } from '@/lib/faktory/format';

/*
 * KOLO 8 (22. 10. 2026, pravidlo č. 1): stránka už nemá ŽÁDNÉ číslo natvrdo. Dřív tabulka i karty pocházely
 * z 13. 7. 2026 (před opravou dvojího TER), „S&P 500 stejné období“ nesedělo s oknem faktoru (value „419 tis.“)
 * a tvrzení „2 ze 6 porazily index“ / „každý faktor byl aspoň jednou nejlepší“ vyvracela vlastní ročenka.
 * Teď vše z backtest enginu (src/lib/faktory/vypocet.ts) a tvrzení z dat. Kontrola: check-fund-data.mjs „kolo8 faktory“.
 */
export const revalidate = 86400;

const vysledekText = (f: FaktorVysledek) => (f.vysledek === 'porazil' ? 'porazil index' : f.vysledek === 'nerozhodne' ? 'zhruba jako index' : 'neporazil index');

/** „jen momentum“, „momentum a value“, „žádný“ */
const vycetFaktoru = (fs: FaktorVysledek[]) =>
  fs.length === 0 ? 'žádný' : fs.length === 1 ? `jen ${fs[0].def.kratce.toLowerCase()}` : `${fs.slice(0, -1).map((f) => f.def.kratce.toLowerCase()).join(', ')} a ${fs[fs.length - 1].def.kratce.toLowerCase()}`;

export async function generateMetadata(): Promise<Metadata> {
  const v = await nactiFaktory().catch(() => null);
  const p = v?.kompletni ? porazily(v) : null;
  const titul = 'Faktorové ETF: co skutečně říkají data (v korunách)';
  return {
    title: titulek(titul),
    description: 'Value, momentum, quality, small cap, min. volatilita a dividendy: co slibuje výzkum a jak faktory dopadly v Kč proti S&P 500 na stejném okně – s UCITS ETF.',
    alternates: { canonical: '/faktorove-etf' },
    openGraph: {
      title: titul,
      description: p
        ? `Šest faktorů přepočtených do Kč na denních datech, každý proti S&P 500 na stejném okně. Index porazil ${vycetFaktoru(p)} (data k ${den(v!.dataDo!)}).`
        : 'Šest faktorů přepočtených do Kč na denních datech, každý proti S&P 500 na stejném okně.',
      url: 'https://etfpruvodce.cz/faktorove-etf',
      images: [ogImage({
        title: 'Faktorové ETF: co skutečně říkají data',
        eyebrow: 'Datový rozbor · v korunách',
        ...(p ? { stat: `${p.length} ze 6`, statLabel: 'faktorů porazilo S&P 500 na stejném okně (v Kč)' } : {}),
      })],
      type: 'article',
    },
  };
}

export default async function FaktoroveEtf() {
  const upraveno = upravenoDlouze('/faktorove-etf'); // datum úpravy TEXTU (redakce.ts), ne den dat
  const [v, fondy, terSp] = await Promise.all([
    nactiFaktory().catch((e) => { console.error('[faktory] výpočet selhal:', e); return null as FaktoryVysledek | null; }),
    nactiFondyFaktoru().catch(() => null),
    nactiTerSp500().catch(() => null),
  ]);
  const radky = FAKTORY_DEF.map((d) => ({ def: d, f: v?.faktory[d.slug] ?? null }));
  const vitezove = v?.kompletni ? porazily(v) : null;
  const roc = v?.rocenka ?? null;
  const vg = v?.valueGrowth ?? null;
  const minVol = v?.faktory['minimalni-volatilita'];
  const nejmelciPropad = v?.kompletni ? Object.values(v.faktory).map((f) => f!).sort((a, b) => b.maxPropad.hloubka - a.maxPropad.hloubka)[0] : null;
  const stara = v?.dataOd ? (Date.now() - new Date(v.dataOd).getTime()) / 864e5 > 7 : false;

  // Ročenka – odvozená tvrzení
  const kratce = (s: FaktorSlug) => FAKTORY_DEF.find((d) => d.slug === s)!.kratce;
  const nejcastejsi = roc ? FAKTORY_DEF.map((d) => ({ s: d.slug, n: roc.vyhry[d.slug].length })).sort((a, b) => b.n - a.n)[0] : null;
  const nikdyNejlepsi = roc ? FAKTORY_DEF.filter((d) => roc.vyhry[d.slug].length === 0).map((d) => d.kratce) : [];
  const nikdyNejhorsi = roc ? FAKTORY_DEF.filter((d) => roc.prohry[d.slug].length === 0).map((d) => d.kratce) : [];

  // Náklady: TER UCITS ETF na tytéž americké indexy (z DB) vs. nejlevnější velký S&P 500 ETF
  const terFaktoru = fondy ? Object.values(fondy).flatMap((x) => x.stejny.map((f) => f.ter)).filter((t): t is number => t != null) : [];

  const faqs: { q: string; a: string }[] = [
    {
      q: 'Co je faktorové investování?',
      a: 'Investování do skupin akcií se společnou vlastností (levné, malé, rostoucí cenou, kvalitní…), u kterých akademický výzkum historicky naměřil vyšší výnos nebo nižší riziko než u celého trhu. Základ položili ekonomové Fama a French v 90. letech. Faktorové ETF tato pravidla automatizují.',
    },
    ...(vitezove && v ? [{
      q: 'Funguje to? Porazím s faktory trh?',
      a: `Na dlouhých akademických datech faktory prémii měly. V praxi je to slabší: v našem korunovém přepočtu (každý faktor proti S&P 500 na přesně stejném okně, data k ${den(v.dataDo!)}) porazil index ${vycetFaktoru(vitezove)}${vitezove.length ? ` (${vitezove.map((f) => `${f.def.kratce.toLowerCase()} ${pct(f.cagr)} vs. ${pct(f.spCagr)} ročně`).join('; ')})` : ''}. Ostatní zaostaly nebo skončily zhruba jako index. A faktory umí i dekádu zaostávat; kdo je kupuje, musí to vydržet.`,
    }] : []),
    {
      q: 'Proč se výsledky liší od amerických studií?',
      a: 'Tři důvody: (1) studie často měří teoretické portfolio bez poplatků, my počítáme z kurzů reálných ETF s poplatkem v ceně; (2) přepočítáváme do korun, takže výsledek zahrnuje i pohyb kurzu; (3) prémii, kterou všichni znají, trh částečně „vyarbitrážuje“ – po objevení bývají faktory slabší.',
    },
    {
      q: 'Mám faktorové ETF vůbec kupovat?',
      a: 'Pro většinu investorů je základní široký index (celý svět nebo S&P 500) jednodušší a historicky srovnatelně dobrý. Faktory dávají smysl jako menší doplněk (např. 10–20 % portfolia) pro toho, kdo jim rozumí, věří evidenci a udrží je i v letech, kdy zaostávají. Rozhodně ne jako náhrada základu.',
    },
    {
      q: 'Jaký je rozdíl mezi daty a UCITS ETF v tabulce?',
      a: 'Naše data jsou AMERICKÉ faktorové indexy (Russell 1000 Value, Russell 2000, MSCI USA…) – nejdelší dostupné denní řady. Proto v tabulce nejdřív uvádíme UCITS ETF na tentýž americký index, které v ČR koupíte. Světové verze (MSCI World) sledují jiný index a čísla z této stránky pro ně neplatí.',
    },
    ...(roc && nejcastejsi ? [{
      q: 'Který faktor je „nejlepší“?',
      a: `Žádný není nejlepší napořád – vedou se střídavě. V ročence ${roc.odRoku}–${roc.doRoku} vyhrál nejčastěji ${kratce(nejcastejsi.s).toLowerCase()} (${nejcastejsi.n}× z ${roc.roky.length} let)${nikdyNejlepsi.length ? `, ${nikdyNejlepsi.join(' ani ').toLowerCase()} nebyl nejlepší ani jednou` : ''}. Pokud faktory, tak spíš kombinaci (multifaktor), a hlavně: levně, dlouhodobě a bez přebíhání podle posledního roku.`,
    }] : []),
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Faktorové ETF', item: 'https://etfpruvodce.cz/faktorove-etf' },
    ],
  };
  const okno = (f: FaktorVysledek) => `${den(f.od)} – ${den(f.do)}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clanekSchema({ cesta: '/faktorove-etf', nadpis: 'Faktorové ETF: co skutečně říkají data' })) }} />

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

      <main id="obsah" className="max-w-6xl mx-auto px-4">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <span className="text-slate-600">Faktorové ETF</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Layers className="w-3.5 h-3.5" /> Datový rozbor · šest faktorů v korunách
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Faktorové ETF: co skutečně říkají data
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl" data-sekce="faktory-hero">
              Value, momentum, quality, malé firmy… Faktorové investování slibuje porazit trh vědecky. Přepočítali
              jsme šest faktorů do korun na reálných denních datech – každý proti S&P 500 na přesně stejném okně.
              {vitezove && (
                <>
                  {' '}Výsledek je střízlivější, než říká marketing:{' '}
                  <strong className="text-white" data-porazily={vitezove.map((f) => f.def.slug).join(',')}>ze šesti faktorů porazil S&P 500 {vycetFaktoru(vitezove)}</strong>.
                </>
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800 transition-colors">
                <Scale className="w-4 h-4" /> Otestovat faktory v backtestu
              </Link>
              <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <BookOpen className="w-4 h-4" /> Najít faktorové ETF
              </Link>
              <Link href="/portfolio-strategie/globalni-jadro-small-cap-value" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <Layers className="w-4 h-4" /> Jak je zapojit do portfolia
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Denní data amerických faktorových indexů, v Kč</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Vzdělávací a nezávislé</span>
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Text upraven {upraveno}</span>
              {v?.dataDo && <span data-faktor-data-k={v.dataDo}>Data k {den(v.dataDo)}</span>}
            </div>
          </div>
        </section>

        {stara && v?.dataOd && (
          <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 max-w-3xl text-sm text-amber-900">Pozor: poslední data jsou k {den(v.dataOd)} – starší než týden. Čísla platí k tomuto dni.</p>
        )}

        {/* 1. CO TO JE */}
        <section className="pb-10">
          <SectionHead title="Co je faktorové investování" desc="Místo výběru jednotlivých akcií sázíte na vlastnosti, které historicky nesly prémii." />
          <div className="rounded-lg border border-slate-200 bg-white p-6 max-w-3xl">
            <p className="text-sm text-slate-700 leading-relaxed">
              Akademický výzkum (nejznáměji Fama a French v 90. letech) našel skupiny akcií, které dlouhodobě
              vydělávaly víc, než by odpovídalo jejich riziku: <strong>levné firmy (value)</strong>,{' '}
              <strong>malé firmy (size)</strong>, později <strong>momentum</strong>, <strong>kvalita</strong> a{' '}
              <strong>nízká volatilita</strong>. Faktorové ETF tyto „recepty“ automatizují – místo správce vybírá
              akcie pravidlo.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mt-3">
              Zní to jako věda, a částečně to věda je. Háček: prémie byly naměřené na dlouhé americké historii,
              před poplatky a před tím, než je znal celý svět. Jak dopadly <em>reálné faktorové ETF</em> přepočtené{' '}
              <em>do korun</em>? To spočítal náš backtest engine – stejný, který pohání{' '}
              <Link href="/backtest" className="text-teal-700 underline decoration-teal-300 hover:decoration-teal-600">kalkulačku backtestu</Link>.
            </p>
          </div>
        </section>

        {/* 2. TABULKA FAKTORŮ */}
        <section className="pb-10" data-sekce="faktory-tabulka">
          <SectionHead
            title="Šest faktorů v korunách – proti S&P 500 na stejném okně"
            desc={`Jednorázových ${kc(POCATECNI)}, každý faktor od prvního dne svých dat; S&P 500 vždy od stejného dne do stejného dne. Kurz den po dni, poplatek fondu v ceně.`}
          />
          {/* Desktop: tabulka */}
          <div className="hidden md:block rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Faktor</th>
                  <th className="px-4 py-3">Okno</th>
                  <th className="px-4 py-3 text-right">Z {kcKratce(POCATECNI)}</th>
                  <th className="px-4 py-3 text-right">Ročně</th>
                  <th className="px-4 py-3 text-right">Max. propad</th>
                  <th className="px-4 py-3 text-right">S&P 500 stejné okno</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {radky.map(({ def, f }) => (
                  <tr key={def.slug} className="border-b border-slate-100 last:border-0" data-faktor={def.slug} {...(f ? { 'data-od': f.od, 'data-do': f.do, 'data-konecna': Math.round(f.konecna), 'data-sp-konecna': Math.round(f.spKonecna), 'data-vysledek': f.vysledek } : {})}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        <Link href={`/faktorove-etf/${def.slug}`} className="text-teal-700 underline decoration-teal-300 hover:decoration-teal-600">{def.nazev}</Link>
                        {f && <span className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold align-middle ${f.vysledek === 'porazil' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'}`}>{vysledekText(f)}</span>}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{def.popis} Index {def.indexDat}.</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{f ? okno(f) : '—'}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900 whitespace-nowrap">{f ? kcKratce(f.konecna) : '—'}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{f ? pct(f.cagr) : '—'}</td>
                    <td className="px-4 py-3 text-right text-rose-600">{f ? pct(f.maxPropad.hloubka) : '—'}</td>
                    <td className="px-4 py-3 text-right text-slate-500 whitespace-nowrap">{f ? <>{kcKratce(f.spKonecna)} ({pct(f.spCagr)})</> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobil: karty – žádný skrytý sloupec */}
          <ul className="md:hidden grid gap-3">
            {radky.map(({ def, f }) => (
              <li key={def.slug} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/faktorove-etf/${def.slug}`} className="font-semibold text-teal-700 underline decoration-teal-300">{def.nazev}</Link>
                  {f && <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${f.vysledek === 'porazil' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'}`}>{vysledekText(f)}</span>}
                </div>
                <p className="text-xs text-slate-500 mt-1">{def.popis}</p>
                {f ? (
                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm tabular-nums">
                    <dt className="text-slate-500">Okno</dt><dd className="text-right text-slate-700 text-xs">{okno(f)}</dd>
                    <dt className="text-slate-500">Z {kcKratce(POCATECNI)}</dt><dd className="text-right font-medium text-slate-900">{kcKratce(f.konecna)}</dd>
                    <dt className="text-slate-500">Ročně</dt><dd className="text-right text-slate-700">{pct(f.cagr)}</dd>
                    <dt className="text-slate-500">Max. propad</dt><dd className="text-right text-rose-600">{pct(f.maxPropad.hloubka)}</dd>
                    <dt className="text-slate-500">S&P 500 stejné okno</dt><dd className="text-right text-slate-500">{kcKratce(f.spKonecna)} ({pct(f.spCagr)})</dd>
                  </dl>
                ) : <p className="mt-2 text-sm text-slate-500">Čísla se teď nepodařilo spočítat – raději „—“ než stará.</p>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            {vitezove && <>Čtěte po řádcích, ne mezi řádky: index na stejném okně porazil {vycetFaktoru(vitezove)}. </>}
            {minVol && nejmelciPropad?.def.slug === 'minimalni-volatilita' && (
              <>Minimální volatilita splnila slib nejmělčího propadu ({pct(minVol.maxPropad.hloubka)}), ale stála {pb(minVol.cagr - minVol.spCagr)} výnosu ročně. </>
            )}
            Okna se liší podle toho, odkdy data faktoru existují – proto má každý řádek vlastní S&P 500.
            Řady momentum a quality jsou před vznikem ETF prodlouženy akademickými denními portfolii z Kenneth R. French
            Data Library: momentum {PRODLOUZENI.momentum?.kalibrace}; quality {PRODLOUZENI.quality?.kalibrace}. Proto u nich
            malý rozdíl proti indexu hodnotíme jako „zhruba jako index“.
          </p>
        </section>

        {/* 2b. FAKTOROVÁ ROČENKA */}
        {roc && (
          <section className="pb-10" data-sekce="faktory-rocenka">
            <SectionHead
              title={`Faktorová ročenka ${roc.odRoku}–${roc.doRoku}`}
              desc="Roční výnosy v Kč za celé kalendářní roky, kdy už všech šest faktorů běží na reálných ETF. Nejlepší faktor roku zeleně, nejhorší červeně."
            />
            <p className="mb-2 text-xs text-slate-500 md:hidden" aria-hidden="true">Tabulku posuňte do strany →</p>
            <div className="relative overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-sm min-w-[680px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="sticky left-0 z-10 bg-white px-3 py-3 shadow-[1px_0_0_#e2e8f0]">Rok</th>
                    {FAKTORY_DEF.map((d) => <th key={d.slug} className="px-3 py-3 text-right">{d.kratce}</th>)}
                    <th className="px-3 py-3 text-right text-slate-400">S&P 500</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {roc.roky.map(({ rok, f, sp }) => {
                    const max = Math.max(...Object.values(f));
                    const min = Math.min(...Object.values(f));
                    // shoda na zobrazenou přesnost = dělené místo, zvýrazní se obě hodnoty (src/lib/faktory/vypocet.ts SHODA)
                    return (
                      <tr key={rok} className="border-b border-slate-100 last:border-0">
                        <td className="sticky left-0 z-10 bg-white px-3 py-2 font-medium text-slate-700 shadow-[1px_0_0_#e2e8f0]">{rok}</td>
                        {FAKTORY_DEF.map((d) => {
                          const val = f[d.slug];
                          const cls = max - val < SHODA ? 'bg-teal-50 text-teal-800 font-semibold' : val - min < SHODA ? 'bg-rose-50 text-rose-700' : val < 0 ? 'text-rose-600' : 'text-slate-700';
                          return <td key={d.slug} className={`px-3 py-2 text-right ${cls}`}>{pct(val)}</td>;
                        })}
                        <td className="px-3 py-2 text-right text-slate-400">{pct(sp)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {nejcastejsi && (
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="font-bold text-teal-700">{nejcastejsi.n}× z {roc.roky.length} let</p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">vyhrálo {kratce(nejcastejsi.s).toLowerCase()} – nejčastější vítěz ({vyctiRoky(roc.vyhry[nejcastejsi.s])}).</p>
                </div>
              )}
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="font-bold text-teal-700">Vedení se střídá</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {nikdyNejlepsi.length ? <>{nikdyNejlepsi.join(', ')} nebyl{nikdyNejlepsi.length > 1 ? 'y' : ''} nejlepší ani jednou, </> : <>Každý faktor byl aspoň jednou nejlepší, </>}
                  {nikdyNejhorsi.length ? <>{nikdyNejhorsi.join(', ')} ani jednou nejhorší. </> : <>každý faktor byl aspoň jednou nejhorší. </>}
                  {roc.remizy.map((x) => <span key={`${x.rok}${x.typ}`}>V roce {x.rok} se o {x.typ === 'nejlepsi' ? 'první' : 'poslední'} místo dělily {x.slugy.map((s) => kratce(s).toLowerCase()).join(' a ')}. </span>)}
                  Přebíhání podle loňska nefunguje.
                </p>
              </div>
              {roc.jedinyKladny.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="font-bold text-teal-700">{roc.jedinyKladny.map((x) => `${x.rok}: ${kratce(x.slug).toLowerCase()} ${pct(x.vynos)}`).join(' · ')}</p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {roc.jedinyKladny.length === 1 ? 'jediný kladný faktor roku' : 'jediné kladné faktory svých let'}, kdy všechno ostatní padalo. Diverzifikace mezi faktory má smysl víc než výběr „toho pravého“.
                  </p>
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-3xl">
              Výnosy v korunách – zahrnují tedy i pohyb kurzu (proto se mohou lišit od dolarových tabulek). Ročenka začíná
              prvním celým rokem, kdy všech šest faktorů běží na reálném ETF (momentum a quality až od roku 2013).
              S&P 500 uvádíme šedě jako referenci.
            </p>
          </section>
        )}

        {/* 3. VALUE VS GROWTH */}
        {vg && (
          <section className="pb-10" data-sekce="value-growth">
            <SectionHead title="Poučení z bubliny: value vs. growth" desc={`Start ${den(vg.od)} (krátce po vrcholu dot-com bubliny), stav k ${den(vg.do)}, ze ${kc(POCATECNI)}.`} />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-2xl font-bold text-teal-700 tabular-nums">{kc(vg.value)}</p>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">value (hodnotové akcie) – největší náskok před growth v {mesic(vg.vrcholNaskoku.datum)} (o {pctBez(vg.vrcholNaskoku.naskok, 0)}), pak ho postupně ztrácely.</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-2xl font-bold text-teal-700 tabular-nums">{kc(vg.growth)}</p>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">growth (růstové akcie) – po dot-com krachu propad v Kč až {pct(vg.growthPropad)}{vg.growthDohnal ? `; náskok value dohnaly až v ${mesic(vg.growthDohnal)}` : ''}.</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-2xl font-bold text-teal-700 tabular-nums">{kc(vg.sp)}</p>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  S&P 500 (celý trh) – {vg.sp > Math.max(vg.value, vg.growth) ? 'skončil nad oběma styly' : vg.sp < Math.min(vg.value, vg.growth) ? 'skončil pod oběma styly' : 'skončil mezi nimi'}.
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
              Za čtvrtstoletí od bubliny se rozdíl mezi „levnými“ a „drahými“ akciemi v korunách {Math.abs(vg.value / vg.growth - 1) < 0.05 ? 'prakticky smazal' : `ustálil na ${pctBez(Math.abs(vg.value / vg.growth - 1), 0)} ve prospěch ${vg.value > vg.growth ? 'value' : 'growth'}`} –
              ale po cestě se vedení prohodilo, vždy na roky. To je hlavní lekce faktorů:{' '}
              <strong className="text-slate-700">fungují v dekádách, ne v letech</strong> – a většina investorů je
              vzdá přesně ve chvíli, kdy zaostávají.
            </p>
          </section>
        )}

        {/* 4. VAROVÁNÍ */}
        <section className="pb-10">
          <SectionHead title="Tři poctivá varování" desc="Než faktorům propadnete." />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-5">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100 text-amber-700 mb-3"><AlertTriangle className="w-4.5 h-4.5" /></span>
              <p className="font-semibold text-slate-900 text-sm">Dekáda zaostávání je normální</p>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                {vg ? <>Value v letech 2010–2019 zaostal za S&P 500 v {vg.value2010s.zaostal} z {vg.value2010s.let} let. </> : null}
                Kdo nevydrží roky podprůměru, faktorům jen zaplatí vyšší poplatek a nervy.
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-5">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100 text-amber-700 mb-3"><Scale className="w-4.5 h-4.5" /></span>
              <p className="font-semibold text-slate-900 text-sm">Prémii ukrojí poplatky a sláva</p>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                {terFaktoru.length && terSp ? <>UCITS ETF na americké faktorové indexy stojí {ter(Math.min(...terFaktoru))}–{ter(Math.max(...terFaktoru))} ročně, nejlevnější velký S&P 500 ETF {ter(terSp.ter)}. </> : null}
                Známou prémii trh navíc částečně vyarbitrážoval – rozdíl je pak menší, než ukazují studie.
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-5">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100 text-amber-700 mb-3"><ShieldCheck className="w-4.5 h-4.5" /></span>
              <p className="font-semibold text-slate-900 text-sm">Základ portfolia to není</p>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">Faktor je koření, ne jídlo. Základem zůstává široký levný index – faktory případně jako menší, vědomý doplněk.</p>
            </div>
          </div>
        </section>

        {/* 5. KONKRÉTNÍ ETF */}
        <section className="pb-10" data-sekce="faktory-fondy">
          <SectionHead title="Faktorové UCITS ETF dostupné v Česku" desc="Nejdřív fond na tentýž americký index, na kterém běží čísla výše; světová verze je jiný index s jiným výsledkem." />
          <ul className="grid gap-3 md:grid-cols-2">
            {FAKTORY_DEF.map((d) => {
              const x = fondy?.[d.slug];
              const hlavni = x?.stejny[0] ?? null;
              const nejblizsi = !hlavni ? x?.nejblizsi[0] ?? null : null;
              const svet = x?.svetove[0] ?? null;
              return (
                <li key={d.slug} className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-900">{d.nazev}</p>
                  <p className="text-xs text-slate-500">Data: {d.indexDat}</p>
                  <div className="mt-2 text-sm">
                    {hlavni ? (
                      <p><span className="text-xs font-semibold uppercase tracking-wide text-teal-700">Stejný index: </span><Link href={`/etf/${hlavni.isin}`} className="text-teal-700 hover:underline">{hlavni.nazev}</Link> <span className="tabular-nums text-slate-600">· TER {ter(hlavni.ter)}</span>{hlavni.poznamka && <span className="text-slate-500"> ({hlavni.poznamka})</span>}{x && x.stejny.length > 1 && <span className="text-slate-500"> (+ další {x.stejny.length - 1} na detailu faktoru)</span>}</p>
                    ) : nejblizsi ? (
                      <p><span className="text-xs font-semibold uppercase tracking-wide text-amber-700">Na tento index UCITS ETF není, nejbližší (jiná metodika): </span><Link href={`/etf/${nejblizsi.isin}`} className="text-teal-700 hover:underline">{nejblizsi.nazev}</Link> <span className="tabular-nums text-slate-600">· TER {ter(nejblizsi.ter)}</span></p>
                    ) : <p className="text-slate-500">Fond na tentýž index: —</p>}
                    {svet && <p className="mt-1.5 text-slate-600"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Světová verze (jiný index): </span><Link href={`/etf/${svet.isin}`} className="text-teal-700 hover:underline">{svet.nazev}</Link> <span className="tabular-nums">· TER {ter(svet.ter)}</span></p>}
                  </div>
                </li>
              );
            })}
          </ul>
          {!fondy && <p className="mt-3 text-sm text-slate-500">Údaje o fondech se teď nepodařilo načíst.</p>}
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            TER a velikost z naší databáze fondů (stejná data jako srovnávač); jen fondy s čerstvými daty a bez měnového zajištění.
          </p>
        </section>

        {/* Žebříčky k tématu (SEO audit 6b – prolinkování článků a žebříčků) */}
        <SouvisejiciZebricky nadpis="Žebříčky k tématu" slugy={['nejlepsi-value-etf', 'nejlepsi-small-cap-etf', 'nejlepsi-growth-etf', 'nejlepsi-dividendove-etf']} />

        {/* FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky" desc="Faktory prakticky a bez marketingu." />
          <div className="grid gap-3 max-w-3xl">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-lg border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-medium text-slate-900 text-sm flex items-center justify-between">
                  {f.q}
                  <span className="text-slate-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA + pokračování */}
        <section className="pb-12">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">Otestujte si faktory sami</p>
              <p className="text-sm text-slate-300 mt-1">Value, momentum, quality i další jsou v backtestu – na denních datech, v korunách.</p>
            </div>
            <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-medium text-white hover:bg-teal-800 transition-colors whitespace-nowrap">
              <Calculator className="w-4 h-4" /> Spustit backtest
            </Link>
          </div>
          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">Podrobné rozbory jednotlivých faktorů</h2>
          <ul data-sekce="rozbory-faktoru" className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {FAKTORY.map((f) => (
              <li key={f.slug}>
                <Link href={`/faktorove-etf/${f.slug}`} className="block h-full rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 transition-colors">
                  <span className="block font-semibold text-slate-900">{f.nazev}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{f.popis}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
            {([
              ['/backtest?portfolio=buffett-90-10&start=2002-07-01&amount=100000&contrib=none&run=1', 'Buffettovo 90/10 v backtestu: kolik vydělalo'],
              ['/kolik-vydelaly-etf', 'Kolik vydělaly ETF a akcie: datový rozbor'],
              ['/svetove-etf-indexy', 'Světové ETF indexy: který vybrat'],
            ] as [string, string][]).map(([href, label]) => (
              <Link key={href} href={href} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 transition-colors flex items-center justify-between gap-2">
                <span className="text-slate-700">{label}</span>
                <LineChart className="w-4 h-4 text-teal-600 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        <AutorBox cesta="/faktorove-etf" />
        <div className="pb-10">
          <InvestmentDisclaimer />
        </div>
      </main>
    </div>
  );
}
