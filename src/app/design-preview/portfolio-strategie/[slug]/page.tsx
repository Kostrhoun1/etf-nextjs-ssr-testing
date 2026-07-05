import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import { notFound } from 'next/navigation';
import {
  TrendingUp, ArrowRight, ArrowLeft, ShieldCheck, Target, CalendarDays,
  Layers, Wallet, BookOpen, Settings2, ThumbsUp, TrendingDown,
} from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { PortfolioBar } from '@/components/design-preview/portfolioComponents';
import {
  portfolioModels, ASSET_COLORS, RISK_PILL, PORTFOLIO_BACKTEST,
} from '@/components/design-preview/portfolioData';
import PortfolioBacktest from '@/components/design-preview/PortfolioBacktest';
import { getPortfolioContent } from '@/components/design-preview/portfolioContent';
import { getMetricsByIsins } from '@/lib/etf-data';

/* Benchmark: 100% akciový S&P 500 (iShares Core S&P 500, CSP1). */
const SP500_ISIN = 'IE00B5BMR087';

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
  const content = getPortfolioContent(slug);
  const btConfig = PORTFOLIO_BACKTEST[slug];
  // Kurátorský max. pokles strategie (číslo z „do −15 %").
  const pfMaxDD = -(parseInt(model.maxDrawdown.replace(/[^0-9]/g, ''), 10) || 0);

  const today = new Date();
  const dateStr = new Date(today.getFullYear(), today.getMonth(), 1)
    .toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  // Reálné metriky z DB pro složky portfolia + benchmark S&P 500.
  const isins = model.allocations.map((a) => a.isin);
  const ret = await getMetricsByIsins([...isins, SP500_ISIN]);
  const sp = ret[SP500_ISIN];
  const weighted = (key: 'return_1y_czk' | 'return_3y_czk' | 'volatility_1y') => {
    let sum = 0, w = 0;
    for (const a of model.allocations) {
      const v = ret[a.isin]?.[key];
      if (v != null) { sum += v * a.percentage; w += a.percentage; }
    }
    return w > 0 ? sum / w : null;
  };
  const perf1y = weighted('return_1y_czk');
  const perf3y = weighted('return_3y_czk');

  // Kolísavost portfolia: vážený průměr přeceňuje riziko (ignoruje diverzifikaci).
  // Počítáme přes kovarianční vzorec s konzervativní cross-asset korelací 0,3,
  // takže je vidět reálný efekt diverzifikace (nižší vol než u čistě akciového indexu).
  const RHO = 0.3;
  const pfVol = (() => {
    const parts = model.allocations
      .map((a) => ({ w: a.percentage / 100, s: ret[a.isin]?.volatility_1y }))
      .filter((x): x is { w: number; s: number } => x.s != null);
    if (parts.length === 0) return null;
    const wsum = parts.reduce((s, x) => s + x.w, 0);
    const p = parts.map((x) => ({ w: x.w / wsum, s: x.s }));
    let v = 0;
    for (let i = 0; i < p.length; i++)
      for (let j = 0; j < p.length; j++)
        v += p[i].w * p[j].w * p[i].s * p[j].s * (i === j ? 1 : RHO);
    return Math.sqrt(v);
  })();

  // Srovnání se S&P 500 (jen když máme obě strany).
  const cmp = (sp && (perf1y != null || pfVol != null)) ? {
    ret1y: { pf: perf1y, sp: sp.return_1y_czk },
    ret3y: { pf: perf3y, sp: sp.return_3y_czk },
    vol: { pf: pfVol, sp: sp.volatility_1y },
    maxdd: { pf: pfMaxDD, sp: sp.max_drawdown_all },
  } : null;
  const fmtVol = (v: number | null) =>
    v == null ? '—' : `${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
  const fmtDD = (v: number | null) =>
    v == null ? '—' : `${Math.round(v)} %`;
  const cmpNarrative = (() => {
    if (!cmp) return '';
    const parts: string[] = [];
    if (cmp.vol.pf != null && cmp.vol.sp != null) {
      parts.push(`Kolísavost tohoto portfolia je ${fmtVol(cmp.vol.pf)} oproti ${fmtVol(cmp.vol.sp)} u čistě akciového S&P 500 – ${cmp.vol.pf < cmp.vol.sp ? 'tedy klidnější průběh s menšími výkyvy' : 'srovnatelný průběh'}.`);
    }
    if (cmp.maxdd.pf != null && cmp.maxdd.sp != null) {
      parts.push(`Nejhorší historický propad portfolia je zhruba ${fmtDD(cmp.maxdd.pf)} proti ${fmtDD(cmp.maxdd.sp)} u S&P 500 – ${cmp.maxdd.pf > cmp.maxdd.sp + 3 ? 'v krizích tedy ztrácí méně a rychleji se vzpamatuje' : cmp.maxdd.pf < cmp.maxdd.sp - 3 ? 'toto portfolio tedy padá v krizích ještě hlouběji než samotný index' : 'propady jsou podobně hluboké jako u čistě akciového indexu'}.`);
    }
    if (cmp.ret1y.pf != null && cmp.ret1y.sp != null) {
      parts.push(`Ve výnosu za poslední rok ${cmp.ret1y.pf < cmp.ret1y.sp ? 'zaostává za' : 'vede nad'} S&P 500: ${pct(cmp.ret1y.pf)} vs ${pct(cmp.ret1y.sp)}.`);
    }
    parts.push('To je jádro diverzifikace – menší výkyvy a mělčí propady výměnou za nižší růst. Kolísavost portfolia je odhad z kolísavosti složek při konzervativní korelaci 0,3; protože se aktiva nehýbou stejně, je skutečná ještě nižší.');
    return parts.join(' ');
  })();

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
          <HeaderSearch />
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

        {/* O STRATEGII – úvod */}
        {content && (
          <section className="pb-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-1 flex items-center gap-2"><BookOpen className="w-5 h-5 text-teal-700" /> O strategii</h2>
            <div className="mt-3 space-y-3 text-sm md:text-[15px] text-slate-700 leading-relaxed max-w-3xl">
              {content.intro.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 max-w-3xl">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Settings2 className="w-4 h-4" /></span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Jak funguje</p>
                <p className="mt-0.5 text-sm text-slate-700 leading-relaxed">{content.howItWorks}</p>
              </div>
            </div>
          </section>
        )}

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

        {/* HISTORICKÁ VÝKONNOST – reálný backtest (dlouhodobě + chování v krizích) */}
        {btConfig ? (
          <section className="pb-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-1">Historická výkonnost a chování v krizích</h2>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">Jak by se toto portfolio chovalo na reálných datech od roku 2008 – dlouhodobý růst, kolísavost, nejhlubší propady a co se dělo v krizích. Vše přepočtené do zvolené měny.</p>
            <PortfolioBacktest config={btConfig} portfolioName={model.name} />
          </section>
        ) : cmp ? (
          <section className="pb-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-1">Portfolio vs 100&nbsp;% akcie (S&amp;P 500)</h2>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">Reálná data: jak si toto portfolio vede proti čistě akciovému indexu S&amp;P 500 – ve výnosu, kolísavosti i nejhorším propadu.</p>
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
              {[
                { label: 'Výnos za 1 rok (Kč)', pf: cmp.ret1y.pf, sp: cmp.ret1y.sp, kind: 'ret' as const },
                { label: 'Výnos za 3 roky (Kč)', pf: cmp.ret3y.pf, sp: cmp.ret3y.sp, kind: 'ret' as const },
                { label: 'Kolísavost za 1 rok (odhad)', pf: cmp.vol.pf, sp: cmp.vol.sp, kind: 'vol' as const },
                { label: 'Nejhorší historický propad', pf: cmp.maxdd.pf, sp: cmp.maxdd.sp, kind: 'dd' as const },
              ].filter((r) => r.pf != null && r.sp != null).map((r, i) => {
                const max = Math.max(Math.abs(r.pf as number), Math.abs(r.sp as number), 1);
                const fmt = r.kind === 'ret' ? pct : r.kind === 'dd' ? fmtDD : fmtVol;
                const rows = [
                  { who: 'Toto portfolio', v: r.pf as number, bar: 'bg-teal-600' },
                  { who: 'S&P 500', v: r.sp as number, bar: 'bg-slate-400' },
                ];
                return (
                  <div key={i}>
                    <p className="text-sm font-medium text-slate-700 mb-1.5">{r.label}</p>
                    <div className="space-y-1.5">
                      {rows.map((x) => (
                        <div key={x.who} className="flex items-center gap-2">
                          <span className="w-24 shrink-0 text-xs text-slate-500">{x.who}</span>
                          <span className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                            <span className={`block h-full rounded-full ${x.bar}`} style={{ width: `${(Math.abs(x.v) / max) * 100}%` }} />
                          </span>
                          <span className="w-16 shrink-0 text-right text-sm font-semibold tabular-nums text-slate-800">{fmt(x.v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              <p className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed">{cmpNarrative}</p>
            </div>
          </section>
        ) : null}

        {/* SILNÉ / SLABÉ STRÁNKY */}
        {content && (
          <section className="pb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="min-w-0 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-emerald-700 mb-2"><ThumbsUp className="w-4 h-4" /> Kdy září</p>
                <p className="text-sm text-emerald-900/90 leading-relaxed">{content.strengths}</p>
              </div>
              <div className="min-w-0 rounded-xl border border-amber-200 bg-amber-50 p-5">
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-700 mb-2"><TrendingDown className="w-4 h-4" /> Slabina</p>
                <p className="text-sm text-amber-900/90 leading-relaxed">{content.weakness}</p>
              </div>
            </div>
          </section>
        )}

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
