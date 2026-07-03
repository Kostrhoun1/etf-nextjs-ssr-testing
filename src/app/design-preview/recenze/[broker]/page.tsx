import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import { notFound } from 'next/navigation';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, ArrowLeft, Star, Wallet, Coins, ShieldCheck,
  Banknote, Receipt, CalendarDays, HelpCircle, Check, X, ExternalLink,
} from 'lucide-react';
import { brokers } from '@/data/brokerData';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import { getBrokerContent } from '@/components/design-preview/brokerContent';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

export const revalidate = 86400;

export function generateStaticParams() {
  return brokers.map((b) => ({ broker: b.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ broker: string }> },
): Promise<Metadata> {
  const { broker } = await params;
  const b = brokers.find((x) => x.id === broker);
  if (!b) return { title: 'Recenze brokera | ETF průvodce', robots: { index: false, follow: false } };
  return {
    title: `${b.name} recenze ${new Date().getFullYear()} – poplatky, ETF, daně | ETF průvodce`,
    description: `Recenze brokera ${b.name} pro investování do ETF: poplatky za nákup, konverze měn, zdanění dividend, ochrana prostředků a pro koho se hodí.`,
    robots: { index: false, follow: false },
    alternates: { canonical: reviewHref[b.id] },
  };
}

export default async function BrokerReviewPreview(
  { params }: { params: Promise<{ broker: string }> },
) {
  const { broker } = await params;
  const b = brokers.find((x) => x.id === broker);
  if (!b) notFound();
  const c = getBrokerContent(b.id);

  const today = new Date();
  const dateStr = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const facts: { icon: typeof Wallet; label: string; value: string }[] = [
    { icon: Wallet, label: 'Poplatek za ETF', value: b.etfFee },
    { icon: Coins, label: 'Konverze měn', value: b.fxFee },
    { icon: Banknote, label: 'Min. vklad', value: b.minDeposit },
    { icon: ShieldCheck, label: 'Ochrana prostředků', value: b.protection },
    { icon: Receipt, label: 'Zdanění CZ dividend', value: b.czDividends },
    { icon: Star, label: 'Regulace', value: b.regulation },
  ];

  const pros = c?.pros ?? b.pros;
  const cons = c?.cons ?? b.cons;

  const faqSchema = c ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: c.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
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
            <Link href="/design-preview/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/design-preview/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/design-preview/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/design-preview/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="text-teal-700 font-medium">Kde koupit</Link>
          </nav>
          <HeaderSearch />
          <Link href="/design-preview/srovnani-brokeru" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Srovnat brokery</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-14">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <Link href="/design-preview/srovnani-brokeru" className="hover:text-slate-700">Brokeři</Link>
          <span>/</span>
          <span className="text-slate-700">{b.name}</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">{b.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-600/20 border border-teal-500/30 px-2.5 py-1 text-sm font-semibold text-teal-200"><Star className="w-3.5 h-3.5" /> {b.rating}/100</span>
            </div>
            {c?.tagline && <p className="mt-2 max-w-2xl text-slate-300 text-sm md:text-base leading-relaxed">{c.tagline}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* RYCHLÁ FAKTA */}
        <section className="pb-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {facts.map((f, i) => (
              <div key={i} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400"><f.icon className="w-3.5 h-3.5" /> {f.label}</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 leading-snug">{f.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* INTRO */}
        {c && (
          <section className="pb-8">
            <div className="space-y-3 text-sm md:text-[15px] text-slate-700 leading-relaxed max-w-3xl">
              {c.intro.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>
        )}

        {/* POPLATKY */}
        {c && c.feesText.length > 0 && (
          <section className="pb-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-1">Kolik vás {b.name} reálně stojí</h2>
            <p className="text-sm text-slate-500 mb-4">Náklady českého investora do ETF – nákup, konverze měn a daně.</p>
            <div className="space-y-3 text-sm md:text-[15px] text-slate-700 leading-relaxed max-w-3xl">
              {c.feesText.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>
        )}

        {/* KLADY / ZÁPORY */}
        <section className="pb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="min-w-0 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 mb-2">Výhody</p>
              <ul className="space-y-1.5">
                {pros.map((p, i) => <li key={i} className="flex items-start gap-2 text-sm text-emerald-900/90"><Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" /> {p}</li>)}
              </ul>
            </div>
            <div className="min-w-0 rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-red-700 mb-2">Nevýhody</p>
              <ul className="space-y-1.5">
                {cons.map((p, i) => <li key={i} className="flex items-start gap-2 text-sm text-red-900/90"><X className="w-4 h-4 mt-0.5 shrink-0 text-red-500" /> {p}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* VERDIKT */}
        {c && c.verdict.length > 0 && (
          <section className="pb-8">
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-700 mb-2"><Star className="w-4 h-4" /> Verdikt</p>
              <div className="space-y-2 text-sm text-teal-900/90 leading-relaxed">{c.verdict.map((p, i) => <p key={i}>{p}</p>)}</div>
              {c.forWhom && <p className="mt-3 text-sm text-teal-900/80 leading-relaxed"><span className="font-medium">Pro koho: </span>{c.forWhom}</p>}
            </div>
          </section>
        )}

        {/* FAQ */}
        {c && c.faqs.length > 0 && (
          <section className="pb-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-4">Časté dotazy</h2>
            <div className="space-y-3 max-w-3xl">
              {c.faqs.map((f, i) => (
                <details key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                  <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-800 list-none"><HelpCircle className="w-4 h-4 text-teal-700 shrink-0" /> {f.q}</summary>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="pb-8">
          <div className="flex flex-wrap gap-3">
            <Link href="/design-preview/srovnani-brokeru" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800">Srovnat s dalšími brokery <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/design-preview/kde-koupit" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400"><ArrowLeft className="w-4 h-4" /> Kde koupit ETF</Link>
          </div>
        </section>

        <InvestmentDisclaimer variant="box" />
      </main>
    </div>
  );
}
