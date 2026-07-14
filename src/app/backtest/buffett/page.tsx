import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, ArrowRight, TrendingDown, Activity, ShieldCheck } from 'lucide-react';
import MobileMenu from '@/components/design-preview/MobileMenu';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { simulateAndSerialize } from '@/lib/backtest/simulate';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Kolik by vydělalo Buffettovo portfolio 90/10? | ETF průvodce.cz',
  description:
    'Warren Buffett své ženě odkázal jednoduché portfolio: 90 % S&P 500, 10 % krátké dluhopisy. Podívejte se, kolik by z milionu korun bylo od roku 2002 – v korunách, na reálných datech.',
  robots: { index: false, follow: false }, // TEST STRÁNKA – neindexovat
  alternates: { canonical: '/backtest/buffett' },
  openGraph: {
    title: 'Kolik by vydělalo Buffettovo portfolio 90/10?',
    description: '90 % S&P 500 + 10 % dluhopisy. Kolik by z milionu korun bylo od roku 2002 – v Kč, na reálných datech.',
    url: 'https://etfpruvodce.cz/backtest/buffett',
    type: 'article',
  },
};

const czk = (v: number) => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(v);
const czkM = (v: number) => `${(v / 1_000_000).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mil. Kč`;
const pct = (v: number, d = 1) => `${v.toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d })} %`;

const PRESET_QS = 'portfolio=buffett-90-10&start=2002-07-01&amount=1000000&contrib=none&run=1';

export default async function BuffettLanding() {
  const start = '2002-07-01';
  const amount = 1_000_000;
  let r: Awaited<ReturnType<typeof simulateAndSerialize>> | null = null;
  try {
    r = await simulateAndSerialize({
      portfolio: [
        { isin: 'IE00B5BMR087', name: 'iShares Core S&P 500', weight: 0.9, ter: 0.0007, indexCode: 'sp500' },
        { isin: 'IE00BYXPSP02', name: 'iShares USD Treasury Bond 1-3yr', weight: 0.1, ter: 0.0007, indexCode: 'us_treasury_1_3y' },
      ],
      startDate: start,
      endDate: new Date().toISOString().split('T')[0],
      initialAmount: amount,
      rebalancingStrategy: 'yearly',
      currency: 'CZK',
    });
  } catch {
    r = null;
  }

  const invested = r?.summary.amountInvested ?? amount;
  const final = r?.summary.netAssetValue ?? 0;
  const profit = final - invested;
  const profitPct = invested > 0 ? (profit / invested) * 100 : 0;
  // summary.cagr a standardDeviation jsou POMĚRY (0.086) – do procent ×100, stejně jako widget.
  const cagr = (r?.summary.cagr ?? 0) * 100;
  const maxDD = r ? Math.abs(r.risk.maxDrawdown.depth) * 100 : 0;
  const vol = (r?.summary.standardDeviation ?? 0) * 100;

  // Kompaktní plošný graf z měsíčního NAV (downsample na ~90 bodů).
  const series = (r?.evolution ?? []).map((p) => p.value);
  const N = 90;
  const step = Math.max(1, Math.ceil(series.length / N));
  const pts = series.filter((_, i) => i % step === 0);
  const min = Math.min(...pts, 0);
  const max = Math.max(...pts, 1);
  const W = 800, H = 240;
  const path = pts.map((v, i) => {
    const x = (i / (pts.length - 1 || 1)) * W;
    const y = H - ((v - min) / (max - min || 1)) * H;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const area = `${path} L${W},${H} L0,${H} Z`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
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
            <Link href="/kalkulacky" className="text-teal-700 font-medium">Kalkulačky</Link>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* HERO – result-first story */}
        <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          Co Warren Buffett odkázal své ženě
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight leading-tight text-balance">
          Kolik by vydělalo Buffettovo portfolio 90/10?
        </h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          Buffett v závěti pro manželku doporučil až nečekaně jednoduchou strategii: <strong className="font-semibold text-slate-800">90 % do indexu S&amp;P 500</strong> a <strong className="font-semibold text-slate-800">10 % do krátkých státních dluhopisů</strong>. Takhle by dopadla od roku 2002 – v korunách, na reálných datech.
        </p>

        {/* Velké číslo */}
        <div className="mt-7 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6 md:p-8">
          <p className="text-sm text-slate-600">Z vložených <strong className="font-semibold text-slate-800">{czk(invested)}</strong> by k dnešku bylo</p>
          <p className="mt-1 text-4xl md:text-6xl font-bold tracking-tight text-teal-800 tabular-nums">{czkM(final)}</p>
          <p className="mt-2 text-lg font-semibold text-emerald-600">
            zisk +{czkM(profit)} <span className="text-emerald-500">({pct(profitPct, 0)})</span>
          </p>

          {/* Graf */}
          {pts.length > 2 && (
            <div className="mt-5 overflow-hidden rounded-lg">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none" role="img" aria-label="Vývoj hodnoty Buffettova portfolia 2002–dnes">
                <defs>
                  <linearGradient id="bfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={area} fill="url(#bfill)" />
                <path d={path} fill="none" stroke="#0d9488" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              </svg>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>2002</span><span>v přepočtu na Kč</span><span>dnes</span>
              </div>
            </div>
          )}
        </div>

        {/* Metriky */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            [TrendingUp, 'Roční zhodnocení', pct(cagr), 'text-emerald-600'],
            [TrendingDown, 'Největší pokles', `-${pct(maxDD)}`, 'text-red-600'],
            [Activity, 'Kolísavost', pct(vol), 'text-slate-900'],
          ].map(([Icon, label, val, tone], i) => {
            const I = Icon as typeof TrendingUp;
            return (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-3 md:p-4">
                <I className="w-4 h-4 text-slate-400" />
                <p className="mt-2 text-xs text-slate-500">{label as string}</p>
                <p className={`text-lg md:text-xl font-bold tabular-nums ${tone as string}`}>{val as string}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-7">
          <Link href={`/backtest?${PRESET_QS}`} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-teal-700 px-6 py-3.5 text-base font-semibold text-white hover:bg-teal-800 transition-colors">
            Spočítej si vlastní portfolio <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-2 text-xs text-slate-500">Zdarma, bez registrace. Přepni si částku, období nebo portfolio – přepočítá se na reálných datech.</p>
        </div>

        {/* Poznámka + disclaimer */}
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 leading-relaxed">
          <p className="inline-flex items-center gap-1.5 font-medium text-slate-700"><ShieldCheck className="w-4 h-4 text-teal-600" /> Jak to počítáme</p>
          <p className="mt-1">
            Historická data indexů od roku 2000, vedená v eurech a přepočtená do korun kurzy ČNB (zahrnuje tedy i pohyb kurzu, který výnos českého investora zvyšuje i snižuje). Portfolio se jednou ročně vyvažuje zpět na 90/10. Nezahrnuje poplatky brokera ani daně. Minulá výkonnost nezaručuje budoucí výnosy.
          </p>
        </div>

        <div className="mt-6"><InvestmentDisclaimer /></div>
      </main>
    </div>
  );
}
