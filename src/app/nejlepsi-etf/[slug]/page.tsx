import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import { notFound } from 'next/navigation';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, ArrowLeft, Trophy, Coins, AlertTriangle,
  CalendarDays, Database, HelpCircle, Wallet, BookOpen, ChevronDown,
} from 'lucide-react';
import { getTopETFsForCategory, getFlagshipComposition, categoryConfigs, type ETFBasicInfo , getDataDate } from '@/lib/etf-data';
import { ter, money, pct, shortName, RankPanel, SectionHead, CompositionInfographic, CategoryIndexes } from '@/components/design-preview/CategoryUI';
import { getCategoryContent } from '@/components/design-preview/categoryContent';
import { topIndexesForCategory } from '@/components/design-preview/indexDescriptions';
import CompareButton from '@/components/design-preview/CompareButton';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import ReturnValue, { ReturnCurLabel } from '@/components/design-preview/ReturnValue';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

export const revalidate = 86400;
export const dynamicParams = true;

/**
 * Kterou dimenzi složení preferovat v infografice podle typu kategorie.
 * Sektorové/tematické kategorie ukážou top pozice (co konkrétně držíte),
 * ostatní geografické rozložení. Fallback řeší sama komponenta.
 */
function preferredDimension(slug: string): 'country' | 'sector' | 'holding' {
  const holdingFirst = [
    'technologicke', 'ai-', 'nasdaq', 'cloud', 'robotika', 'kyberbezpecnost',
    'healthcare', 'biotechnologie', 'financni', 'energeticke', 'prumyslove',
    'spotrebitelske', 'infrastrukturni', 'defense', 'clean-energy',
    'obnovitelne', 'realitni', 'nemovitostni', 'value', 'growth', 'small-cap',
    'dividendove', 'ai-etf', 'kyber',
  ];
  if (holdingFirst.some((k) => slug.includes(k))) return 'holding';
  return 'country';
}

/* Kategorie, u kterých dává smysl odkázat na pilíř „Světové ETF – který index"
   (porovnání MSCI World / FTSE All-World / ACWI / S&P 500 napříč žebříčky).
   Silo: pilíř = hub „který index", žebříček = užší seznam pro daný index. */
const WORLD_INDEX_SLUGS = new Set([
  'nejlepsi-celosvetove-etf', 'nejlepsi-msci-world-etf', 'nejlepsi-sp500-etf',
  'nejlepsi-americke-etf', 'nejlepsi-evropske-etf', 'nejlepsi-emerging-markets-etf',
  'nejlepsi-technologicke-etf', 'nejlevnejsi-etf',
]);

export function generateStaticParams() {
  return Object.keys(categoryConfigs).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const cfg = categoryConfigs[slug];
  if (!cfg) return { title: 'Žebříček ETF | ETF průvodce', robots: { index: false, follow: false } };
  return {
    title: `${cfg.title} – srovnání a výnosy v Kč | ETF průvodce`,
    description: cfg.metaDescription || cfg.description,
    alternates: { canonical: `/nejlepsi-etf/${slug}` },
  };
}

export default async function CategoryDetailPreview(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const cfg = categoryConfigs[slug];
  if (!cfg) notFound();

  const all = await getTopETFsForCategory(cfg);
  const etfs = all.filter((e) => e.ter_numeric != null || e.fund_size_numeric != null);
  const content = getCategoryContent(slug);

  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  // Tři žebříčky z dat kategorie.
  const byTer = [...etfs].filter((e) => e.ter_numeric != null && e.ter_numeric > 0).sort((a, b) => (a.ter_numeric! - b.ter_numeric!)).slice(0, 5);
  const bySize = [...etfs].filter((e) => e.fund_size_numeric != null).sort((a, b) => (b.fund_size_numeric! - a.fund_size_numeric!)).slice(0, 5);
  const byPerf = [...etfs].filter((e) => e.return_1y_czk != null).sort((a, b) => (b.return_1y_czk! - a.return_1y_czk!)).slice(0, 5);

  // Infografika „co v tom je" – složení vlajkového (největšího) fondu kategorie.
  const flagship = bySize[0];
  const composition = flagship ? await getFlagshipComposition(flagship.isin) : null;
  const prefer = preferredDimension(slug);

  // Reálně sledované indexy v kategorii (s odborným popisem) – datově řízené.
  const topIndexes = topIndexesForCategory(etfs);

  const row = (e: ETFBasicInfo, value: React.ReactNode) => ({ isin: e.isin, label: shortName(e.name), sub: e.primary_ticker ?? undefined, value });

  // Doporučené fondy – vlajková loď + varianty (bez duplicit).
  const recos: { tag: string; icon: typeof Trophy; etf: ETFBasicInfo; note: string }[] = [];
  const pushReco = (tag: string, icon: typeof Trophy, etf: ETFBasicInfo | undefined, note: string) => {
    if (etf && !recos.some((r) => r.etf.isin === etf.isin)) recos.push({ tag, icon, etf, note });
  };
  pushReco('Vlajková loď', Trophy, bySize[0], 'Největší a nejlikvidnější fond v kategorii – bezpečná výchozí volba.');
  pushReco('Nejnižší poplatek', Wallet, byTer[0], byTer[0] ? `Nejlevnější v kategorii, TER ${ter(byTer[0].ter_numeric)}.` : '');
  pushReco('Nejvyšší výnos (1R)', TrendingUp, byPerf[0], byPerf[0] ? `Za posledních 12 měsíců ${pct(byPerf[0].return_1y_czk)} v Kč.` : '');

  const faqSchema = content ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: content.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Žebříčky ETF', item: 'https://etfpruvodce.cz/nejlepsi-etf' },
      { '@type': 'ListItem', position: 3, name: cfg.title, item: `https://etfpruvodce.cz/nejlepsi-etf/${slug}` },
    ],
  };

  const itemListSchema = bySize.length > 0 ? {
    '@context': 'https://schema.org', '@type': 'ItemList', name: cfg.title,
    itemListElement: bySize.map((e, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'FinancialProduct', name: shortName(e.name), identifier: e.isin, url: `https://etfpruvodce.cz/etf/${e.isin}` },
    })),
  } : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/zebricky" className="text-teal-700 font-medium">Žebříčky</Link>
            <Link href="/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-28">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <Link href="/zebricky" className="hover:text-slate-700">Žebříčky</Link>
          <span>/</span>
          <span className="text-slate-700">{cfg.title}</span>
        </nav>

        {/* HERO – krátký lead + infografika vedle sebe (odlehčený úvod) */}
        <section className="pb-7">
          <div className="grid gap-4 lg:grid-cols-5 lg:items-start">
            {/* Lead */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">{cfg.title}</h1>
              <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">{cfg.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> {etfs.length} fondů</span>
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {dateStr}</span>
                <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Výnosy v Kč</span>
              </div>
            </div>

            {/* Infografika „co v tom je" – hned nahoře, ať to ožije */}
            <div className="lg:col-span-3">
              {composition ? (
                <CompositionInfographic comp={composition} prefer={prefer} fundLabel={flagship ? shortName(flagship.name) : undefined} />
              ) : (
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 flex items-center">
                  <div className="space-y-3 text-sm md:text-[15px] text-slate-700 leading-relaxed">
                    {content?.intro[0] && <p>{content.intro[0]}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* NAŠE DOPORUČENÉ ETF – grafické, proklikávací */}
        {recos.length > 0 && (
          <section className="pb-8">
            <SectionHead title="Naše doporučené ETF" desc="Konkrétní fondy z kategorie – klikněte pro detail s výnosem v Kč, složením a riziky." />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recos.map(({ tag, icon: Icon, etf, note }, i) => (
                <div
                  key={etf.isin}
                  className={`group relative flex flex-col min-w-0 rounded-xl border bg-white p-5 transition-all hover:shadow-sm ${i === 0 ? 'border-teal-300 ring-1 ring-teal-100' : 'border-slate-200 hover:border-teal-300'}`}
                >
                  <div className="absolute right-3 top-3 z-10">
                    <CompareButton isin={etf.isin} label={etf.primary_ticker ?? shortName(etf.name)} variant="chip" />
                  </div>
                  <Link href={`/etf/${etf.isin}`} className="flex flex-col min-w-0">
                    <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                      <Icon className="w-3.5 h-3.5" /> {tag}
                    </span>
                    <span className="mt-3 text-lg font-bold text-slate-900">{etf.primary_ticker ?? shortName(etf.name)}</span>
                    <span className="text-xs text-slate-500 leading-snug line-clamp-2">{shortName(etf.name)}</span>
                    <p className="mt-2 text-xs text-slate-600 leading-snug">{note}</p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs">
                      <span className="text-slate-500">TER <span className="font-semibold text-slate-800 tabular-nums">{ter(etf.ter_numeric)}</span></span>
                      <span className="text-slate-500">1R <ReturnValue etf={etf} period="1y" className="font-semibold" /></span>
                      <span className="text-slate-500">Velikost <span className="font-semibold text-slate-800 tabular-nums">{money(etf.fund_size_numeric, etf.fund_currency)}</span></span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 group-hover:text-teal-800">Detail fondu <ArrowRight className="w-4 h-4" /></span>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ŽEBŘÍČKY Z DAT */}
        {etfs.length >= 3 && (
          <section className="pb-8">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
              <SectionHead title="Žebříčky podle kritéria" desc="Nejlevnější, největší a nejvýkonnější fondy v kategorii – z reálných dat." className="mb-0" />
              <CurrencyToggle size="sm" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {byTer.length > 0 && <RankPanel title="Nejlevnější (TER)" subtitle="Roční poplatek za správu" rows={byTer.map((e) => row(e, <span className="tabular-nums text-sm font-medium text-slate-700">{ter(e.ter_numeric)}</span>))} />}
              {bySize.length > 0 && <RankPanel title="Největší (AUM)" subtitle="Velikost spravovaných aktiv" rows={bySize.map((e) => row(e, <span className="tabular-nums text-sm font-medium text-slate-700">{money(e.fund_size_numeric, e.fund_currency)}</span>))} />}
              {byPerf.length > 0 && <RankPanel title={<>Nejvýkonnější 1R (<ReturnCurLabel />)</>} subtitle="Výnos za posledních 12 měsíců" rows={byPerf.map((e) => row(e, <ReturnValue etf={e} period="1y" className="text-sm font-medium" />))} />}
            </div>
          </section>
        )}

        {/* KTERÉ INDEXY KATEGORIE SLEDUJE – datově řízené, s odborným popisem */}
        {topIndexes.length > 0 && (
          <section className="pb-8">
            <SectionHead
              title="Které indexy tato kategorie sleduje"
              desc="Podkladové indexy fondů v kategorii – co měří, kolik mají složek a jak jsou vážené."
            />
            <CategoryIndexes indexes={topIndexes} total={etfs.length} />
            {WORLD_INDEX_SLUGS.has(slug) && (
              <Link href="/svetove-etf-indexy" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800">
                Nevíte, který světový index vybrat? MSCI World vs FTSE All-World vs S&amp;P 500 <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </section>
        )}

        {/* PRO KOHO – krátké, ponecháno viditelné (1 odstavec) */}
        {content && (
          <section className="pb-8">
            <SectionHead title="Pro koho se hodí" />
            <p className="text-sm md:text-[15px] text-slate-700 leading-relaxed max-w-3xl">{content.forWhom}</p>
          </section>
        )}

        {/* HLUBŠÍ VÝKLAD – dlouhý text schovaný do rozbalovacího bloku, ať nezavalí úvod */}
        {content && (content.intro.length > 0 || content.verdict.length > 0) && (
          <section className="pb-8">
            <details className="group rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-5 py-4 md:px-6 hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm md:text-base font-semibold text-slate-900 leading-tight">{content.introTitle}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">Podrobný rozbor kategorie, na co koukat při výběru a proč</span>
                  </span>
                </span>
                <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-6 md:px-6 border-t border-slate-100">
                <div className="pt-5 space-y-3 text-sm md:text-[15px] text-slate-700 leading-relaxed max-w-3xl">
                  {content.intro.map((p, i) => <p key={i}>{p}</p>)}
                </div>
                {content.verdict.length > 0 && (
                  <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50/60 p-5 max-w-3xl">
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-700 mb-2"><Trophy className="w-4 h-4" /> Proč právě tyto fondy</p>
                    <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
                      {content.verdict.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                  </div>
                )}
              </div>
            </details>
          </section>
        )}

        {/* RIZIKA */}
        {content && content.risks.length > 0 && (
          <section className="pb-8">
            <SectionHead title="Na co si dát pozor" />
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <ul className="space-y-2">
                {content.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-900/90 leading-relaxed">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* FAQ */}
        {content && content.faqs.length > 0 && (
          <section className="pb-8">
            <SectionHead title="Časté dotazy" />
            <div className="space-y-3 max-w-3xl">
              {content.faqs.map((f, i) => (
                <details key={i} className="rounded-xl border border-slate-200 bg-white p-4 group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-slate-800 list-none">
                    <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-teal-700 shrink-0" /> {f.q}</span>
                  </summary>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="pb-8">
          <div className="flex flex-wrap gap-3">
            <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800">Porovnat fondy <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/kde-koupit" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400"><Coins className="w-4 h-4" /> Kde koupit</Link>
            <Link href="/zebricky" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400"><ArrowLeft className="w-4 h-4" /> Všechny žebříčky</Link>
          </div>
        </section>

        <InvestmentDisclaimer variant="box" />
      </main>
    </div>
  );
}
