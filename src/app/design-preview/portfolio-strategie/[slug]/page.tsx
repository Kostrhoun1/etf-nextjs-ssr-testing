import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import MobileMenu from '@/components/design-preview/MobileMenu';
import { notFound } from 'next/navigation';
import {
  TrendingUp, ArrowRight, ArrowLeft, ShieldCheck, Target, CalendarDays,
  Layers, Wallet,
} from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { PortfolioBar } from '@/components/design-preview/portfolioComponents';
import {
  portfolioModels, ASSET_COLORS, RISK_PILL,
} from '@/components/design-preview/portfolioData';
import { getReturnsByIsins } from '@/lib/etf-data';

export const revalidate = 86400;

export function generateStaticParams() {
  return portfolioModels.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const m = portfolioModels.find((p) => p.slug === slug);
  if (!m) return { title: 'Portfolio | ETF průvodce', robots: { index: false, follow: false } };
  return {
    title: `${m.name} – složení, ETF a výnos v Kč | ETF průvodce`,
    description: `${m.name}: ${m.tagline} Složení z ETF, očekávaný výnos, riziko a historická výkonnost přepočtená do korun.`,
    robots: { index: false, follow: false },
    alternates: { canonical: `/design-preview/portfolio-strategie/${slug}` },
  };
}

const pct = (v: number | null) =>
  v == null ? '—' : `${v > 0 ? '+' : ''}${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;

export default async function PortfolioDetailPreview(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const model = portfolioModels.find((p) => p.slug === slug);
  if (!model) notFound();

  const today = new Date();
  const dateStr = new Date(today.getFullYear(), today.getMonth(), 1)
    .toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  // Reálná vážená výkonnost v Kč z držených fondů.
  const isins = model.allocations.map((a) => a.isin);
  const ret = await getReturnsByIsins(isins);
  const weighted = (key: 'return_1y_czk' | 'return_3y_czk') => {
    let sum = 0, w = 0;
    for (const a of model.allocations) {
      const v = ret[a.isin]?.[key];
      if (v != null) { sum += v * a.percentage; w += a.percentage; }
    }
    return w > 0 ? sum / w : null;
  };
  const perf1y = weighted('return_1y_czk');
  const perf3y = weighted('return_3y_czk');

  const stats: { icon: typeof Target; label: ReactNode; value: string }[] = [
    {
      icon: TrendingUp,
      label: (
        <InfoTip label="Nominální odhad před inflací a daněmi. Reálný (kupní síla) výnos je zhruba o inflaci nižší.">
          Očekávaný výnos
        </InfoTip>
      ),
      value: model.expectedReturn,
    },
    { icon: ShieldCheck, label: <InfoTip label="Největší historický propad hodnoty od vrcholu ke dnu.">Max. pokles</InfoTip>, value: model.maxDrawdown },
    { icon: CalendarDays, label: 'Doporučený horizont', value: model.horizon },
    { icon: Layers, label: 'Podíl akcií', value: `${model.stocksPct} %` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
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
            <Link href="/design-preview/portfolio-strategie" className="text-teal-700 font-medium">Portfolia</Link>
            <Link href="/design-preview/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <Link href="/design-preview/srovnani" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Srovnávač</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-14">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <Link href="/design-preview/portfolio-strategie" className="hover:text-slate-700">Portfolia</Link>
          <span>/</span>
          <span className="text-slate-700">{model.name}</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${RISK_PILL[model.risk]}`}>{model.risk}</span>
            <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight leading-tight">{model.name}</h1>
            <p className="mt-2 max-w-2xl text-slate-300 text-sm md:text-base leading-relaxed">{model.tagline}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Výnosy přepočtené do Kč</span>
            </div>
          </div>
        </section>

        {/* STATISTIKY */}
        <section className="pb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400"><s.icon className="w-3.5 h-3.5" /> {s.label}</div>
                <div className="mt-1 text-lg font-bold tabular-nums text-slate-900">{s.value}</div>
              </div>
            ))}
          </div>
          {(perf1y != null || perf3y != null) && (
            <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <InfoTip label="Vážený průměr korunových výnosů jednotlivých ETF složek podle jejich váhy v portfoliu. Bez průběžného rebalancingu. Minulá výkonnost nezaručuje budoucí výnosy.">
                  Historická výkonnost v Kč
                </InfoTip>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-8 gap-y-1">
                <span className="text-sm text-slate-600">Za 1 rok: <span className={`font-bold tabular-nums ${(perf1y ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(perf1y)}</span></span>
                <span className="text-sm text-slate-600">Za 3 roky: <span className={`font-bold tabular-nums ${(perf3y ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(perf3y)}</span></span>
              </div>
            </div>
          )}
        </section>

        {/* SLOŽENÍ */}
        <section className="pb-8">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-1">Složení portfolia</h2>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">Rozdělení mezi třídy aktiv a konkrétní ETF fondy, kterými portfolio poskládáte.</p>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <PortfolioBar model={model} />
          </div>

          {/* Holdings tabulka */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-left text-xs uppercase tracking-wide">
                  <th className="py-2.5 px-4 font-medium">Fond</th>
                  <th className="py-2.5 px-4 font-medium">Třída</th>
                  <th className="py-2.5 px-4 font-medium text-right">Váha</th>
                  <th className="py-2.5 px-4 font-medium text-right">Výnos 1R (Kč)</th>
                </tr>
              </thead>
              <tbody>
                {model.allocations.map((a, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-3 px-4">
                      <Link href={`/design-preview/etf/${a.isin}`} className="font-medium text-teal-700 hover:text-teal-800">{a.etfName}</Link>
                      <span className="block text-xs text-slate-400 font-mono">{a.isin}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${ASSET_COLORS[a.cls].dot}`} />
                        {ASSET_COLORS[a.cls].label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-medium text-slate-700">{a.percentage} %</td>
                    <td className={`py-3 px-4 text-right tabular-nums font-medium ${(ret[a.isin]?.return_1y_czk ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(ret[a.isin]?.return_1y_czk ?? null)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* PRO KOHO */}
        <section className="pb-8">
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-700"><Target className="w-4 h-4" /> Pro koho se hodí</p>
            <p className="mt-2 text-sm text-teal-900/90 leading-relaxed">„{model.forWhom}"</p>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-8">
          <div className="flex flex-wrap gap-3">
            <Link href="/design-preview/srovnani" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800">Porovnat tyto ETF <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/design-preview/kde-koupit" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400">Kde je koupit</Link>
            <Link href="/design-preview/portfolio-strategie" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400"><ArrowLeft className="w-4 h-4" /> Všechna portfolia</Link>
          </div>
        </section>

        <InvestmentDisclaimer variant="box" />
      </main>
    </div>
  );
}
