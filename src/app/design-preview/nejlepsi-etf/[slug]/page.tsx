import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import { notFound } from 'next/navigation';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, ArrowLeft, Trophy, Coins, ShieldCheck, AlertTriangle,
  CalendarDays, Database, HelpCircle, Wallet, BookOpen,
} from 'lucide-react';
import { getTopETFsForCategory, categoryConfigs, type ETFBasicInfo } from '@/lib/etf-data';
import { ter, money, pct, shortName, RankPanel, SectionHead } from '@/components/design-preview/CategoryUI';
import { getCategoryContent } from '@/components/design-preview/categoryContent';
import CompareButton from '@/components/design-preview/CompareButton';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import ReturnValue, { ReturnCurLabel } from '@/components/design-preview/ReturnValue';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

export const revalidate = 86400;
export const dynamicParams = true;

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
    robots: { index: false, follow: false },
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
  const dateStr = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  // Tři žebříčky z dat kategorie.
  const byTer = [...etfs].filter((e) => e.ter_numeric != null && e.ter_numeric > 0).sort((a, b) => (a.ter_numeric! - b.ter_numeric!)).slice(0, 5);
  const bySize = [...etfs].filter((e) => e.fund_size_numeric != null).sort((a, b) => (b.fund_size_numeric! - a.fund_size_numeric!)).slice(0, 5);
  const byPerf = [...etfs].filter((e) => e.return_1y_czk != null).sort((a, b) => (b.return_1y_czk! - a.return_1y_czk!)).slice(0, 5);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/design-preview/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/design-preview/zebricky" className="text-teal-700 font-medium">Žebříčky</Link>
            <Link href="/design-preview/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/design-preview/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/design-preview/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
          <Link href="/design-preview/srovnani" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Srovnávač</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-14">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <Link href="/design-preview/zebricky" className="hover:text-slate-700">Žebříčky</Link>
          <span>/</span>
          <span className="text-slate-700">{cfg.title}</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">{cfg.title}</h1>
            <p className="mt-2 max-w-2xl text-slate-300 text-sm md:text-base leading-relaxed">{cfg.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> {etfs.length} fondů v kategorii</span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Výnosy v Kč</span>
            </div>
          </div>
        </section>

        {/* INTRO – co kategorie je (redakční obsah) */}
        {content && (
          <section className="pb-8">
            <SectionHead title={content.introTitle} />
            <div className="space-y-3 text-sm md:text-[15px] text-slate-700 leading-relaxed max-w-3xl">
              {content.intro.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>
        )}

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
                  <Link href={`/design-preview/etf/${etf.isin}`} className="flex flex-col min-w-0">
                    <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                      <Icon className="w-3.5 h-3.5" /> {tag}
                    </span>
                    <span className="mt-3 text-lg font-bold text-slate-900">{etf.primary_ticker ?? shortName(etf.name)}</span>
                    <span className="text-xs text-slate-500 leading-snug line-clamp-2">{shortName(etf.name)}</span>
                    <p className="mt-2 text-xs text-slate-600 leading-snug">{note}</p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs">
                      <span className="text-slate-500">TER <span className="font-semibold text-slate-800 tabular-nums">{ter(etf.ter_numeric)}</span></span>
                      <span className="text-slate-500">1R <ReturnValue etf={etf} period="1y" className="font-semibold" /></span>
                      <span className="text-slate-500">Velikost <span className="font-semibold text-slate-800 tabular-nums">{money(etf.fund_size_numeric)}</span></span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 group-hover:text-teal-800">Detail fondu <ArrowRight className="w-4 h-4" /></span>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VERDIKT – proč (text) */}
        {content && content.verdict.length > 0 && (
          <section className="pb-8">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-700 mb-2"><Trophy className="w-4 h-4" /> Proč právě tyto fondy</p>
              <div className="space-y-2 text-sm text-slate-700 leading-relaxed max-w-3xl">
                {content.verdict.map((p, i) => <p key={i}>{p}</p>)}
              </div>
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
              {bySize.length > 0 && <RankPanel title="Největší (AUM)" subtitle="Velikost spravovaných aktiv" rows={bySize.map((e) => row(e, <span className="tabular-nums text-sm font-medium text-slate-700">{money(e.fund_size_numeric)}</span>))} />}
              {byPerf.length > 0 && <RankPanel title={<>Nejvýkonnější 1R (<ReturnCurLabel />)</>} subtitle="Výnos za posledních 12 měsíců" rows={byPerf.map((e) => row(e, <ReturnValue etf={e} period="1y" className="text-sm font-medium" />))} />}
            </div>
          </section>
        )}

        {/* PRO KOHO */}
        {content && (
          <section className="pb-8">
            <SectionHead title="Pro koho se hodí" />
            <p className="text-sm md:text-[15px] text-slate-700 leading-relaxed max-w-3xl">{content.forWhom}</p>
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
            <Link href="/design-preview/srovnani" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800">Porovnat fondy <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/design-preview/kde-koupit" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400"><Coins className="w-4 h-4" /> Kde koupit</Link>
            <Link href="/design-preview/zebricky" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400"><ArrowLeft className="w-4 h-4" /> Všechny žebříčky</Link>
          </div>
        </section>

        <InvestmentDisclaimer variant="box" />
      </main>
    </div>
  );
}
