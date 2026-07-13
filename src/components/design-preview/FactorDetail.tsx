/**
 * Sdílená šablona detailní stránky faktoru (/faktorove-etf/<faktor>).
 *
 * Každá stránka dodá jen config (texty + čísla ověřená proti /api/backtest/simulate)
 * a metadata; strukturu, schema.org bloky i vizuál drží tahle komponenta, aby všech
 * šest faktorových detailů vypadalo i fungovalo stejně. Vzor: momentum (první ručně
 * psaná stránka série).
 */
import Link from 'next/link';
import {
  TrendingUp, Database, Calculator, Wallet, Scale, ShieldCheck,
  AlertTriangle, BookOpen, History, LineChart, Zap,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import { getDataDate } from '@/lib/etf-data';
import { runBacktest } from '@/lib/backtest/engine';
import type { BacktestInput, TimeSeriesPoint } from '@/lib/backtest/types';

export interface FactorConfig {
  slug: string;            // např. 'value'
  badge: string;           // „Faktorová analýza 3/6 · value“
  h1: string;
  /** Kód indexu v index_historical_data + TER – z nich se počítají grafy a řada rok po roce. */
  indexCode: string;
  ter: number;
  /** Začátek dat faktoru (YYYY-MM-DD) – stejné okno se použije i pro S&P 500, ať je srovnání férové. */
  dataStart: string;
  /** Krátký název do legendy grafů, např. „Value“. */
  shortName: string;
  lead: React.ReactNode;   // hero odstavec (může obsahovat <strong>)
  dataRange: string;       // „Denní data 2000–2026, v Kč, po TER“
  howTitle: string;
  howParagraphs: React.ReactNode[];
  numbersTitle: string;
  numbersDesc: string;
  statCards: { big: string; text: string }[];   // 3 karty
  dcaText: React.ReactNode;
  rolling: { yrs: string; avg: string; low: string; high: string; pos: string }[];
  rollingNote: React.ReactNode;
  crises: { name: string; drop: string; note: string }[];
  riskTitle: string;
  riskDesc: string;
  riskBody: React.ReactNode;
  etfs: { name: string; isin: string; ter: string }[];
  etfNote: React.ReactNode;
  faqs: { q: string; a: string }[];
  related: [string, string][];
}

/** Poslední bod každého měsíce – SVG s ~300 body je čitelné i lehké. */
function monthly(points: TimeSeriesPoint[]): TimeSeriesPoint[] {
  const out: TimeSeriesPoint[] = [];
  for (let i = 0; i < points.length; i++) {
    const next = points[i + 1];
    if (!next || next.date.getMonth() !== points[i].date.getMonth()) out.push(points[i]);
  }
  return out;
}

const fmtKc = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1).replace('.', ',')} mil.` : `${Math.round(v / 1000)} tis.`;

/**
 * Spočítá srovnávací data faktor vs. S&P 500 živě z backtest enginu (stejné okno,
 * 100 000 Kč, po TER, roční rebalance). Stránka je ISR (1 den), takže se to počítá
 * nejvýš jednou denně – a čísla nikdy nezastarají vůči nástroji /backtest.
 */
async function computeComparison(cfg: FactorConfig) {
  const base = {
    startDate: new Date(cfg.dataStart),
    endDate: new Date(),
    initialAmount: 100000,
    rebalancingStrategy: 'yearly' as const,
    currency: 'CZK' as const,
  };
  const run = (indexCode: string, ter: number) =>
    runBacktest({ ...base, portfolio: [{ isin: 'X', name: indexCode, weight: 1, ter, indexCode }] } as BacktestInput);
  try {
    const [fac, spx] = await Promise.all([run(cfg.indexCode, cfg.ter), run('sp500', 0.0007)]);
    // zarovnat na společné datumy (stejný US kalendář → prakticky identické)
    const spxByTime = new Map(spx.evolution.map((p) => [p.date.getTime(), p.value]));
    const both = fac.evolution
      .filter((p) => spxByTime.has(p.date.getTime()))
      .map((p) => ({ date: p.date, f: p.value, s: spxByTime.get(p.date.getTime())! }));
    if (both.length < 24) return null;
    const m = monthly(both.map((p) => ({ date: p.date, value: p.f })));
    const ms = monthly(both.map((p) => ({ date: p.date, value: p.s })));
    const ratio = monthly(both.map((p) => ({ date: p.date, value: p.f / p.s })));
    const annual = fac.returns.annualReturns.map((a) => ({
      year: a.year,
      f: a.return,
      s: spx.returns.annualReturns.find((b) => b.year === a.year)?.return ?? null,
    }));
    return {
      fac: m, spx: ms, ratio,
      facFinal: both[both.length - 1].f, spxFinal: both[both.length - 1].s,
      startYear: both[0].date.getFullYear(), endYear: both[both.length - 1].date.getFullYear(),
      annual,
    };
  } catch {
    return null; // graf se nevykreslí, stránka nespadne
  }
}

/** Jednoduchý dvouřadý čárový graf (SVG) – faktor teal, S&P 500 šedě. */
function EquityChart({ cmp, shortName }: { cmp: NonNullable<Awaited<ReturnType<typeof computeComparison>>>; shortName: string }) {
  const W = 900, H = 320, PAD = { l: 56, r: 8, t: 12, b: 26 };
  const all = [...cmp.fac, ...cmp.spx];
  const minV = Math.min(...all.map((p) => p.value));
  const maxV = Math.max(...all.map((p) => p.value));
  const t0 = cmp.fac[0].date.getTime(), t1 = cmp.fac[cmp.fac.length - 1].date.getTime();
  const x = (d: Date) => PAD.l + ((d.getTime() - t0) / (t1 - t0)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - minV) / (maxV - minV)) * (H - PAD.t - PAD.b);
  const path = (pts: TimeSeriesPoint[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.date).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const yTicks = [minV, (minV + maxV) / 2, maxV];
  const years: number[] = [];
  for (let yr = cmp.startYear + 1; yr <= cmp.endYear; yr += Math.ceil((cmp.endYear - cmp.startYear) / 8)) years.push(yr);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Vývoj 100 000 Kč: ${shortName} vs. S&P 500`}>
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="#e2e8f0" strokeWidth="1" />
          <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end" fontSize="12" fill="#64748b">{fmtKc(v)}</text>
        </g>
      ))}
      {years.map((yr) => {
        const d = new Date(`${yr}-01-01`);
        return <text key={yr} x={x(d)} y={H - 8} textAnchor="middle" fontSize="12" fill="#94a3b8">{yr}</text>;
      })}
      <path d={path(cmp.spx)} fill="none" stroke="#94a3b8" strokeWidth="2" />
      <path d={path(cmp.fac)} fill="none" stroke="#0d9488" strokeWidth="2.5" />
    </svg>
  );
}

/** Poměr faktor / S&P 500 (start = 1). Nad čarou faktor vede, pod čarou zaostává. */
function RatioChart({ cmp, shortName }: { cmp: NonNullable<Awaited<ReturnType<typeof computeComparison>>>; shortName: string }) {
  const W = 900, H = 220, PAD = { l: 56, r: 8, t: 12, b: 26 };
  const base = cmp.ratio[0].value;
  const pts = cmp.ratio.map((p) => ({ date: p.date, value: p.value / base }));
  const minV = Math.min(...pts.map((p) => p.value), 1);
  const maxV = Math.max(...pts.map((p) => p.value), 1);
  const t0 = pts[0].date.getTime(), t1 = pts[pts.length - 1].date.getTime();
  const x = (d: Date) => PAD.l + ((d.getTime() - t0) / (t1 - t0)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - minV) / (maxV - minV)) * (H - PAD.t - PAD.b);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.date).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const years: number[] = [];
  for (let yr = cmp.startYear + 1; yr <= cmp.endYear; yr += Math.ceil((cmp.endYear - cmp.startYear) / 8)) years.push(yr);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Relativní síla: ${shortName} vs. S&P 500`}>
      {[minV, 1, maxV].map((v) => (
        <g key={v}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke={v === 1 ? '#cbd5e1' : '#e2e8f0'} strokeWidth={v === 1 ? 1.5 : 1} strokeDasharray={v === 1 ? '4 3' : undefined} />
          <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end" fontSize="12" fill="#64748b">{v.toFixed(2).replace('.', ',')}×</text>
        </g>
      ))}
      {years.map((yr) => {
        const d = new Date(`${yr}-01-01`);
        return <text key={yr} x={x(d)} y={H - 8} textAnchor="middle" fontSize="12" fill="#94a3b8">{yr}</text>;
      })}
      <path d={path} fill="none" stroke="#0d9488" strokeWidth="2.5" />
    </svg>
  );
}

export default async function FactorDetail({ cfg }: { cfg: FactorConfig }) {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  const cmp = await computeComparison(cfg);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cfg.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Faktorové ETF', item: 'https://etfpruvodce.cz/faktorove-etf' },
      { '@type': 'ListItem', position: 3, name: cfg.h1, item: `https://etfpruvodce.cz/faktorove-etf/${cfg.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/faktorove-etf" className="hover:text-slate-600">Faktorové ETF</Link>
          <span>/</span>
          <span className="text-slate-600">{cfg.h1}</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Zap className="w-3.5 h-3.5" /> {cfg.badge}
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">{cfg.h1}</h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">{cfg.lead}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Scale className="w-4 h-4" /> Otestovat v backtestu
              </Link>
              <Link href="/faktorove-etf" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <BookOpen className="w-4 h-4" /> Přehled všech faktorů
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> {cfg.dataRange}</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Vzdělávací a nezávislé</span>
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* JAK FUNGUJE */}
        <section className="pb-10">
          <SectionHead title={cfg.howTitle} desc="Pravidlo, podle kterého index vybírá akcie – a proč by mělo fungovat." />
          <div className="rounded-lg border border-slate-200 bg-white p-6 max-w-3xl">
            {cfg.howParagraphs.map((p, i) => (
              <p key={i} className={`text-sm text-slate-700 leading-relaxed${i > 0 ? ' mt-3' : ''}`}>{p}</p>
            ))}
          </div>
        </section>

        {/* ČÍSLA */}
        <section className="pb-10">
          <SectionHead title={cfg.numbersTitle} desc={cfg.numbersDesc} />
          <div className="grid gap-3 sm:grid-cols-3">
            {cfg.statCards.map((c, i) => {
              const Icon = [LineChart, Zap, History][i] ?? LineChart;
              return (
                <div key={c.big} className="rounded-lg border border-slate-200 bg-white p-5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 mb-3"><Icon className="w-4.5 h-4.5" /></span>
                  <p className="text-2xl font-bold text-teal-700 tabular-nums">{c.big}</p>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{c.text}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50/40 p-5 max-w-3xl">
            <p className="text-sm text-slate-700 leading-relaxed">{cfg.dcaText}</p>
          </div>
        </section>

        {/* GRAF VÝVOJE VS S&P 500 */}
        {cmp && (
          <section className="pb-10">
            <SectionHead
              title={`Vývoj v čase: ${cfg.shortName} vs. S&P 500 (${cmp.startYear}–${cmp.endYear})`}
              desc="Jednorázových 100 000 Kč na stejném období, v korunách, po poplatcích. Počítáno živě naším backtest enginem."
            />
            <div className="rounded-lg border border-slate-200 bg-white p-4 md:p-6">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm mb-2">
                <span className="inline-flex items-center gap-2"><span className="w-5 h-1 rounded bg-teal-600 inline-block" /> {cfg.shortName}: <strong className="tabular-nums">{fmtKc(cmp.facFinal)} Kč</strong></span>
                <span className="inline-flex items-center gap-2 text-slate-500"><span className="w-5 h-1 rounded bg-slate-400 inline-block" /> S&P 500: <strong className="tabular-nums">{fmtKc(cmp.spxFinal)} Kč</strong></span>
              </div>
              <EquityChart cmp={cmp} shortName={cfg.shortName} />
            </div>
          </section>
        )}

        {/* RELATIVNÍ SÍLA */}
        {cmp && (
          <section className="pb-10">
            <SectionHead
              title="Kdy faktor vedl a kdy zaostával"
              desc={`Poměr hodnoty ${cfg.shortName.toLowerCase()} / S&P 500 (start = 1×). Stoupá = faktor index poráží, klesá = zaostává.`}
            />
            <div className="rounded-lg border border-slate-200 bg-white p-4 md:p-6">
              <RatioChart cmp={cmp} shortName={cfg.shortName} />
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Tohle je nejdůležitější graf celé stránky: ukazuje, že faktor nevede plynule, ale ve vlnách po
                letech. Konec čáry {cmp.facFinal >= cmp.spxFinal ? 'nad' : 'pod'} 1× znamená, že za celé období
                faktor index {cmp.facFinal >= cmp.spxFinal ? 'porazil' : 'neporazil'}.
              </p>
            </div>
          </section>
        )}

        {/* ROK PO ROCE */}
        {cmp && (
          <section className="pb-10">
            <SectionHead title={`Rok po roce vs. S&P 500`} desc="Roční výnosy v Kč po poplatcích. Zeleně roky, kdy faktor index porazil." />
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3">Rok</th>
                    <th className="px-4 py-3 text-right">{cfg.shortName}</th>
                    <th className="px-4 py-3 text-right">S&P 500</th>
                    <th className="px-4 py-3 text-right">Rozdíl</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {cmp.annual.map((a) => {
                    const diff = a.s == null ? null : a.f - a.s;
                    const pct = (v: number) => `${v > 0 ? '+' : ''}${(v * 100).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
                    return (
                      <tr key={a.year} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-2 font-medium text-slate-700">{a.year}</td>
                        <td className={`px-4 py-2 text-right ${a.f < 0 ? 'text-rose-600' : 'text-slate-800'}`}>{pct(a.f)}</td>
                        <td className={`px-4 py-2 text-right ${a.s != null && a.s < 0 ? 'text-rose-500' : 'text-slate-500'}`}>{a.s == null ? '–' : pct(a.s)}</td>
                        <td className={`px-4 py-2 text-right font-medium ${diff == null ? '' : diff >= 0 ? 'text-teal-700 bg-teal-50/60' : 'text-rose-600'}`}>{diff == null ? '–' : pct(diff)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
              Faktor index porazil v {cmp.annual.filter((a) => a.s != null && a.f > a.s).length} z {cmp.annual.filter((a) => a.s != null).length} let.
              První a poslední rok jsou započtené jen zčásti (od začátku dat, resp. do dneška).
            </p>
          </section>
        )}

        {/* ROLLING */}
        <section className="pb-10">
          <SectionHead title="Klouzavá okna: jak stabilní ten výnos je" desc="Všechna možná období dané délky v našich datech – průměr, nejhorší a nejlepší case." />
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Délka držení</th>
                  <th className="px-4 py-3 text-right">Průměr p.a.</th>
                  <th className="px-4 py-3 text-right">Nejhorší case</th>
                  <th className="px-4 py-3 text-right">Nejlepší case</th>
                  <th className="px-4 py-3 text-right">Kladných období</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {cfg.rolling.map((r) => (
                  <tr key={r.yrs} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2.5 font-medium text-slate-900">{r.yrs}</td>
                    <td className="px-4 py-2.5 text-right text-slate-700">{r.avg}</td>
                    <td className="px-4 py-2.5 text-right text-rose-600">{r.low}</td>
                    <td className="px-4 py-2.5 text-right text-teal-700">{r.high}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-900">{r.pos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">{cfg.rollingNote}</p>
        </section>

        {/* KRIZE */}
        <section className="pb-10">
          <SectionHead title="Jak faktor snášel krize" desc="Velké propady v našem období – v korunách, od vrcholu ke dnu, a doba návratu." />
          <div className={`grid gap-3 ${cfg.crises.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 max-w-3xl'}`}>
            {cfg.crises.map((c) => (
              <div key={c.name} className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
                <p className="text-2xl font-bold text-rose-600 tabular-nums mt-1">{c.drop}</p>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{c.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RIZIKO */}
        <section className="pb-10">
          <SectionHead title={cfg.riskTitle} desc={cfg.riskDesc} />
          <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-6 max-w-3xl">
            <p className="text-sm text-slate-700 leading-relaxed">
              <AlertTriangle className="inline w-4 h-4 text-amber-600 mr-1 -mt-0.5" />
              {cfg.riskBody}
            </p>
          </div>
        </section>

        {/* JAK KOUPIT */}
        <section className="pb-10">
          <SectionHead title="Jak faktor koupit v Česku" desc="UCITS verze dostupné u běžných brokerů." />
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white max-w-3xl">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">ETF</th>
                  <th className="px-4 py-3">ISIN</th>
                  <th className="px-4 py-3 text-right">TER</th>
                </tr>
              </thead>
              <tbody>
                {cfg.etfs.map((e) => (
                  <tr key={e.isin} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2.5 text-slate-700">{e.name}</td>
                    <td className="px-4 py-2.5"><Link href={`/etf/${e.isin}`} className="text-teal-700 hover:underline tabular-nums">{e.isin}</Link></td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">{e.ter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">{cfg.etfNote}</p>
        </section>

        {/* FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky" desc="Prakticky a bez marketingu." />
          <div className="grid gap-3 max-w-3xl">
            {cfg.faqs.map((f) => (
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
              <p className="text-lg font-semibold">Otestujte si to na vlastní čísla</p>
              <p className="text-sm text-slate-300 mt-1">V backtestu najdete faktor v kategorii „Akcie – faktory“ – zkuste ho i v kombinaci s indexem.</p>
            </div>
            <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-500 transition-colors whitespace-nowrap">
              <Calculator className="w-4 h-4" /> Spustit backtest
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
            {cfg.related.map(([href, label]) => (
              <Link key={href} href={href} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 transition-colors flex items-center justify-between gap-2">
                <span className="text-slate-700">{label}</span>
                <TrendingUp className="w-4 h-4 text-teal-600 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        <div className="pb-10">
          <InvestmentDisclaimer />
        </div>
      </main>
    </div>
  );
}
