import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, Database, Calculator, Wallet, Scale, ShieldCheck, LineChart,
  Landmark, History, Percent, AlertTriangle,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';
import { simulateAndSerialize } from '@/lib/backtest/simulate';
import BuffettMiniCalc from '@/components/buffett/BuffettMiniCalc';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Buffettovo portfolio 90/10: kolik by vydělalo v korunách',
  description:
    'Warren Buffett předepsal manželce nejjednodušší portfolio na světě: 90 % S&P 500 a 10 % krátkých státních dluhopisů. Přepočítali jsme ho do korun na reálných datech od roku 2002 – výnos, propady i pravidelné investování.',
  alternates: { canonical: '/buffettovo-portfolio' },
  openGraph: {
    title: 'Buffettovo portfolio 90/10: kolik by vydělalo v korunách',
    description:
      'Nejslavnější investiční pokyn světa přepočtený do Kč na datech 2002–2026: ze 100 000 Kč přes 700 tisíc. Včetně propadů a pravidelného investování.',
    url: 'https://etfpruvodce.cz/buffettovo-portfolio',
    images: [ogImage({ title: 'Buffettovo portfolio 90/10 v korunách', eyebrow: 'Světové myšlenky česky', stat: '100 000 → přes 700 000 Kč', statLabel: 'od 2002 · v Kč · po poplatcích' })],
    type: 'article',
  },
};

export default async function BuffettovoPortfolio() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const faqs = [
    {
      q: 'Co přesně Buffett poradil?',
      a: 'V dopise akcionářům Berkshire Hathaway za rok 2013 popsal pokyn pro správce dědictví své ženy: 10 % do krátkodobých státních dluhopisů a 90 % do velmi levného indexového fondu na S&P 500. Argumentoval, že dlouhodobé výsledky tohoto jednoduchého portfolia překonají většinu investorů, kteří platí drahé správce.',
    },
    {
      q: 'Proč zrovna 90/10 a ne 60/40?',
      a: 'Buffett míří na velmi dlouhý horizont (dědictví) – tam akcie historicky jasně vítězí a dluhopisová složka slouží hlavně jako rezerva na výběry ve špatných letech, ne jako tlumič kolísání. Pro kratší horizont nebo slabší nervy je konzervativnější poměr rozumnější. Porovnat si oba můžete v našem backtestu.',
    },
    {
      q: 'Není 90 % v jediném americkém indexu málo diverzifikace?',
      a: 'To je nejčastější výtka. S&P 500 je 500 velkých firem s globálními tržbami, ale měnově i geograficky je to sázka na USA. Pro českého investora dává smysl zvážit i celosvětovou variantu (FTSE All-World) – v backtestu si obě verze porovnáte na stejném období. Buffett sám americkou koncentraci vědomě přijímá („nikdy nesázejte proti Americe").',
    },
    {
      q: 'Z jakých ETF to poskládám v Česku?',
      a: 'Akciová část: ETF na S&P 500, např. iShares Core S&P 500 (ISIN IE00B5BMR087, TER 0,07 %). Dluhopisová část: krátké americké státní dluhopisy, např. iShares USD Treasury Bond 1–3yr (ISIN IE00BYXPSP02, TER 0,07 %). Obojí koupíte u běžných brokerů dostupných v ČR – viz náš přehled Kde koupit ETF.',
    },
    {
      q: 'Jak často rebalancovat?',
      a: 'Stačí jednou ročně vrátit váhy na 90/10 (náš výpočet s roční rebalancí počítá). U tak malé dluhopisové složky je efekt rebalance malý – důležitější je disciplína nechat portfolio být.',
    },
    {
      q: 'Jak je to s daněmi?',
      a: 'V Česku platí časový test: po 3 letech držení je zisk z prodeje cenných papírů osvobozen od daně z příjmů. U akumulačních ETF se dividendy reinvestují uvnitř fondu, takže průběžně nedaníte nic. Detaily v článku Daně z ETF.',
    },
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
      { '@type': 'ListItem', position: 2, name: 'Buffettovo portfolio 90/10', item: 'https://etfpruvodce.cz/buffettovo-portfolio' },
    ],
  };

  /* ================= ŽIVÁ DATA – 4 portfolia na stejném okně 2002→dnes =================
     Vše serverově přes stejný engine jako backtest (100 000 Kč, roční rebalance, CZK, po
     TER). Čísla se tak nikdy nerozejdou s nástrojem a nezastarají. Fallback = poslední
     známé hodnoty, kdyby data nebyla při buildu dostupná. */
  const START = '2002-07-01';
  const AMOUNT = 100000;
  const END = today.toISOString().split('T')[0];
  const IX = {
    sp500: { isin: 'IE00B5BMR087', ter: 0.0007, indexCode: 'sp500', name: 'S&P 500' },
    t13: { isin: 'IE00BYXPSP02', ter: 0.0007, indexCode: 'us_treasury_1_3y', name: 'US Treasury 1–3y' },
    t710: { isin: 'IE00B3VWN518', ter: 0.0007, indexCode: 'us_treasury_7_10y', name: 'US Treasury 7–10y' },
    wxus: { isin: 'US9219097683', ter: 0.0008, indexCode: 'world_ex_us', name: 'Svět mimo USA' },
  };
  const w = (base: typeof IX.sp500, weight: number) => ({ ...base, weight });
  const PF = {
    buffett: [w(IX.sp500, 0.9), w(IX.t13, 0.1)],
    sp: [w(IX.sp500, 1)],
    balanced: [w(IX.sp500, 0.6), w(IX.t710, 0.4)],
    global: [w(IX.sp500, 0.6), w(IX.wxus, 0.4)],
  };
  const runPF = (portfolio: { isin: string; ter: number; indexCode: string; name: string; weight: number }[], contributions?: { amount: number; frequency: 'monthly' }) =>
    simulateAndSerialize({ portfolio, startDate: START, endDate: END, initialAmount: AMOUNT, rebalancingStrategy: 'yearly', currency: 'CZK', contributions });

  type Sim = Awaited<ReturnType<typeof simulateAndSerialize>>;
  let R: { buffett: Sim; sp: Sim; balanced: Sim; global: Sim; dca: Sim } | null = null;
  try {
    const [buffett, sp, balanced, global, dca] = await Promise.all([
      runPF(PF.buffett), runPF(PF.sp), runPF(PF.balanced), runPF(PF.global),
      runPF(PF.buffett, { amount: 5000, frequency: 'monthly' }),
    ]);
    R = { buffett, sp, balanced, global, dca };
  } catch {
    R = null;
  }

  const worstYear = (r: Sim) => { const a = r.returns.annualReturns.map((x) => x.return); return a.length ? Math.min(...a) * 100 : 0; };
  const metrics = (r: Sim) => ({ final: r.summary.netAssetValue, cagr: r.summary.cagr * 100, dd: r.risk.maxDrawdown.depth * 100, vol: r.summary.standardDeviation * 100, worst: worstYear(r) });
  const M = R ? { buffett: metrics(R.buffett), sp: metrics(R.sp), balanced: metrics(R.balanced), global: metrics(R.global) } : null;

  // Koeficienty pro mini-kalkulačku (engine je lineární v cashflow):
  //   výsledek = jednorázový × lumpMultiple + měsíční × monthlyCoeff
  // lumpMultiple = násobek jednorázového vkladu; monthlyCoeff = konečná hodnota 1 Kč vkládané měsíčně.
  const DCA_STEP = 5000; // měsíční vklad použitý v serverové DCA simulaci
  const lumpMultiple = M ? M.buffett.final / AMOUNT : 7.24;
  const monthlyCoeff = R && M ? (R.dca.summary.netAssetValue - M.buffett.final) / DCA_STEP : 0;
  const contribMonths = R ? Math.round((R.dca.summary.amountInvested - AMOUNT) / DCA_STEP) : 288;

  // Formátovače
  const kc = (v: number) => `${new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(Math.round(v))} Kč`;
  const p1 = (v: number) => `${v >= 0 ? '+' : ''}${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
  const p1a = (v: number) => `${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;

  // Data pro grafy (equity křivka 4 portfolií + drawdown + rok po roce – vše z Buffetta/S&P)
  const CW = 900, CH = 320;
  const eqSeries = R ? [
    { name: 'Buffett 90/10', color: '#0d9488', ev: R.buffett.evolution },   // teal (hero)
    { name: '100 % S&P 500', color: '#1d4ed8', ev: R.sp.evolution },        // sytě modrá
    { name: '60/40', color: '#f59e0b', ev: R.balanced.evolution },          // jantarová
    { name: 'Celý svět', color: '#9333ea', ev: R.global.evolution },  // fialová
  ] : [];
  const eqAll = eqSeries.flatMap((s) => s.ev.map((p) => p.value));
  const eqMax = eqAll.length ? Math.max(...eqAll) : 1;
  const eqMinV = eqAll.length ? Math.min(...eqAll) : 1;
  // Logaritmická osa: dlouhý horizont (24 let) se na lineární škále zmáčkne dolů.
  const lg = Math.log;
  const eqY = (v: number) => CH - ((lg(v) - lg(eqMinV)) / ((lg(eqMax) - lg(eqMinV)) || 1)) * CH;
  const eqPath = (ev: { value: number }[]) => {
    const N = 160; const st = Math.max(1, Math.ceil(ev.length / N));
    const pts = ev.filter((_, i) => i % st === 0);
    return pts.map((p, i) => { const x = (i / (pts.length - 1 || 1)) * CW; const y = eqY(p.value); return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
  };
  const eqPaths = eqSeries.map((s) => ({ ...s, d: eqPath(s.ev) }));

  // Drawdown Buffett 90/10 (plocha pod nulou)
  const dd = R?.buffett.drawdownSeries ?? [];
  const ddN = 200; const ddStep = Math.max(1, Math.ceil(dd.length / ddN));
  const ddPts = dd.filter((_, i) => i % ddStep === 0);
  const ddMin = ddPts.length ? Math.min(...ddPts.map((p) => p.drawdown)) : -0.5; // nejhlubší (záporné)
  const DDW = 900, DDH = 200;
  const ddLine = ddPts.map((p, i) => { const x = (i / (ddPts.length - 1 || 1)) * DDW; const y = (p.drawdown / (ddMin || -1)) * DDH; return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
  const ddArea = ddPts.length ? `${ddLine} L${DDW},0 L0,0 Z` : '';

  // Rok po roce – Buffett 90/10 vs S&P (sloupce)
  const yrs = R ? R.buffett.returns.annualReturns.map((b) => {
    const s = R!.sp.returns.annualReturns.find((x) => x.year === b.year);
    return { year: b.year, b: b.return * 100, s: s ? s.return * 100 : 0 };
  }) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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
          <span className="text-slate-600">Buffettovo portfolio 90/10</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <LineChart className="w-3.5 h-3.5" /> Světové myšlenky, česká čísla
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Buffettovo portfolio 90/10: kolik by vydělalo v korunách
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Nejslavnější investor světa předepsal pro dědictví své ženy nejjednodušší portfolio, jaké existuje:{' '}
              <strong className="text-white">90 % levný indexový fond na S&P 500 a 10 % krátké státní dluhopisy</strong>.
              Přepočítali jsme ho do korun na reálných denních datech od roku 2002 – ze 100 000 Kč by dnes bylo{' '}
              <strong className="text-white">přes 700 000 Kč</strong>.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="#spocitat" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Scale className="w-4 h-4" /> Zkusit vlastní částku ↓
              </Link>
              <Link href="/portfolio-strategie" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <Landmark className="w-4 h-4" /> Další modelová portfolia
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Denní data 2002–2026, v Kč, po TER</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Vzdělávací a nezávislé</span>
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* MINI-KALKULAČKA – hned na úvod: jen vlastní částka (+ nepovinný měsíční vklad) */}
        <section id="spocitat" className="pb-9 scroll-mt-16">
          <SectionHead title="Kolik by to udělalo s vaší částkou" desc="Zadejte svůj vklad – přepočítá se stejným enginem jako náš backtest, na reálných datech do korun." />
          <BuffettMiniCalc lumpMultiple={lumpMultiple} monthlyCoeff={monthlyCoeff} contribMonths={contribMonths} />
        </section>

        {/* 1. PŘÍBĚH */}
        <section className="pb-10">
          <SectionHead title="Odkud se 90/10 vzalo" desc="Dopis akcionářům Berkshire Hathaway za rok 2013 – pokyn pro správce dědictví." />
          <div className="rounded-lg border border-slate-200 bg-white p-6 max-w-3xl">
            <p className="text-sm text-slate-700 leading-relaxed">
              Není to náhodný nápad. Buffett ten pokyn napsal do závěti – jako instrukci správci, jak má naložit
              s dědictvím jeho ženy. A dodal, že takové jednoduché portfolio dlouhodobě porazí většinu investorů –
              penzijních fondů i institucí – kteří platí drahé správce.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mt-3">
              Nebyla to jen teorie. Ve slavné desetileté sázce (2008–2017) postavil levný indexový fond na S&P 500
              proti výběru hedgeových fondů – indexový fond vydělal zhruba +126 %, hedgeové fondy v průměru kolem
              +36 %. Jednoduchost a nízké poplatky vyhrály.
            </p>
            <p className="text-xs text-slate-500 mt-4">
              My jsme si položili otázku, kterou za vás nikdo nespočítá: <strong className="text-slate-700">co by 90/10
              udělalo s korunami českého investora?</strong> Kurz se přepočítává den po dni, výnosy jsou po odečtení
              poplatků ETF (TER).
            </p>
          </div>
        </section>

        {/* 2. ČÍSLA – živě z enginu */}
        <section className="pb-10">
          <SectionHead
            title={`Výsledky v korunách (červenec 2002 – ${today.getFullYear()})`}
            desc={`Jednorázový vklad 100 000 Kč, rebalancováno 1× ročně, po poplatcích ETF. Čísla i grafy počítá stejný engine jako náš backtest${M ? '' : ' (dočasně zobrazeny poslední známé hodnoty)'} – aktualizováno ${dateStr}.`}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              [M ? kc(M.buffett.final) : '729 000 Kč', `hodnota ze 100 000 Kč (výnos ${M ? p1(M.buffett.cagr) : '+8,6 %'} ročně, po poplatcích).`, Percent],
              [M ? p1a(M.buffett.dd) : '−47,3 %', 'nejhlubší propad (finanční krize 2008–2009). Kdo vydržel, vydělal.', History],
              [M ? p1(M.buffett.worst) : '−27,4 %', `nejhorší kalendářní rok. Čisté akcie (100 % S&P) měly ${M ? p1(M.sp.worst) : '−32,6 %'}.`, AlertTriangle],
            ] as [string, string, typeof Percent][]).map(([big, d, Icon]) => (
              <div key={d} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 mb-3"><Icon className="w-4.5 h-4.5" /></span>
                <p className="text-2xl font-bold text-teal-700 tabular-nums">{big}</p>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>

          {/* Equity křivka – 4 portfolia na stejném okně */}
          {R && (
            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 md:p-5">
              <p className="text-sm font-semibold text-slate-900">Vývoj 100 000 Kč (2002 → dnes), v přepočtu na koruny</p>
              <p className="text-xs text-slate-500 mt-0.5 mb-3">Buffettovo 90/10 mezi třemi alternativami na stejném období. Svislá osa je logaritmická – stejný sklon = stejné tempo růstu.</p>
              {/* Legenda seřazená podle konečné hodnoty – nejvyšší čára = první v legendě */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-5 gap-y-1.5 mb-3">
                {[...eqPaths]
                  .sort((a, b) => (b.ev[b.ev.length - 1]?.value ?? 0) - (a.ev[a.ev.length - 1]?.value ?? 0))
                  .map((s) => (
                    <span key={s.name} className="inline-flex items-center gap-2 text-xs">
                      <span className="inline-block w-5 h-1 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className={`${s.name.startsWith('Buffett') ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>{s.name}</span>
                      <span className="text-slate-500 tabular-nums">{kc(s.ev[s.ev.length - 1]?.value ?? 0)}</span>
                    </span>
                  ))}
              </div>
              <div className="overflow-hidden">
                <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full h-auto" preserveAspectRatio="none" role="img" aria-label="Vývoj hodnoty portfolií 2002 až dnes">
                  {[0.25, 0.5, 0.75].map((f) => (
                    <line key={f} x1="0" y1={CH * f} x2={CW} y2={CH * f} stroke="#f1f5f9" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  ))}
                  {/* Nejdřív ostatní, Buffett navrch a nejtlustší */}
                  {[...eqPaths].sort((a) => (a.name.startsWith('Buffett') ? 1 : -1)).map((s) => (
                    <path key={s.name} d={s.d} fill="none" stroke={s.color} strokeWidth={s.name.startsWith('Buffett') ? 3.4 : 2.2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                  ))}
                </svg>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>červenec 2002</span><span className="tabular-nums">až {kc(eqMax).replace(' Kč', '')} Kč</span><span>dnes</span>
              </div>
            </div>
          )}

          {/* Širší srovnávací tabulka – 4 portfolia */}
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">2002–{today.getFullYear()} · v Kč · po TER</th>
                  <th className="px-4 py-3 text-right bg-teal-50/60 text-teal-800">Buffett 90/10</th>
                  <th className="px-4 py-3 text-right">100 % S&P 500</th>
                  <th className="px-4 py-3 text-right">60/40</th>
                  <th className="px-4 py-3 text-right">Celý svět</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {([
                  ['Hodnota ze 100 000 Kč', (m: { final: number }) => M ? kc(m.final) : '—'],
                  ['Výnos ročně (CAGR)', (m: { cagr: number }) => M ? p1(m.cagr) : '—'],
                  ['Nejhlubší propad', (m: { dd: number }) => M ? p1a(m.dd) : '—'],
                  ['Kolísavost', (m: { vol: number }) => M ? `± ${p1a(m.vol)}` : '—'],
                  ['Nejhorší rok', (m: { worst: number }) => M ? p1(m.worst) : '—'],
                ] as [string, (m: { final: number; cagr: number; dd: number; vol: number; worst: number }) => string][]).map(([label, fmt]) => (
                  <tr key={label} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2.5 text-slate-600">{label}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-900 bg-teal-50/40">{M ? fmt(M.buffett) : '—'}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{M ? fmt(M.sp) : '—'}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{M ? fmt(M.balanced) : '—'}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{M ? fmt(M.global) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            Dluhopisová desetina výnos mírně brzdí (proti čistým akciím), ale změkčuje nejhorší chvíle – v roce 2008 zhruba
            o 5 procentních bodů. Přesně to od ní Buffett chce: rezervu na výběry ve špatných letech, ne maximalizaci výnosu.
            Celosvětová varianta (poslední sloupec) je diverzifikovanější měnově i geograficky – historicky ale za americkou
            koncentrací v tomto okně zaostávala. „Celý svět" tu skládáme z 60 % USA + 40 % zbytek světa (vyspělé i rozvíjející
            se trhy), protože ETF na FTSE All-World má data až od roku 2008; tahle proxy sahá poctivě do roku 2002.
          </p>
        </section>

        {/* 2b. PROPADY + ROK PO ROCE */}
        {R && (
          <section className="pb-10">
            <SectionHead title="Kolik to bolelo cestou" desc="Backtest není jen konečné číslo. Tohle je průběh propadů a rozdílnost jednotlivých let – to, co rozhoduje, jestli strategii ustojíte." />

            {/* Drawdown */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 md:p-5">
              <p className="text-sm font-semibold text-slate-900">Propad od vrcholu (drawdown) – Buffettovo 90/10</p>
              <p className="text-xs text-slate-500 mt-0.5 mb-3">Jak hluboko pod předchozím maximem portfolio bylo. Dno {M ? p1a(M.buffett.dd) : ''} přišlo ve finanční krizi 2008–2009.</p>
              <div className="overflow-hidden">
                <svg viewBox={`0 0 ${DDW} ${DDH}`} className="w-full h-auto" preserveAspectRatio="none" role="img" aria-label="Průběh propadů Buffettova portfolia">
                  <path d={ddArea} fill="#fecaca" opacity="0.7" />
                  <path d={ddLine} fill="none" stroke="#ef4444" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>2002</span><span>dnes</span></div>
            </div>

            {/* Rok po roce */}
            {yrs.length > 0 && (() => {
              const n = yrs.length;
              const PL = 68;                     // levý okraj pro popisky osy Y
              const gw = (900 - PL) / n;
              const base = 110;                  // nula
              const maxAbs = Math.max(...yrs.map((y) => Math.abs(y.b)), 1);
              const niceMax = Math.max(10, Math.ceil(maxAbs / 10) * 10);
              const yOf = (v: number) => base - (v / niceMax) * 95;
              const levels = [niceMax, niceMax / 2, 0, -niceMax / 2, -niceMax];
              const pos = yrs.filter((y) => y.b >= 0).length;
              const maxB = Math.max(...yrs.map((y) => y.b));
              const minB = Math.min(...yrs.map((y) => y.b));
              return (
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 md:p-5">
                  <p className="text-sm font-semibold text-slate-900">Výnos rok po roce – Buffettovo 90/10 (v Kč)</p>
                  <p className="text-xs text-slate-500 mt-0.5 mb-3">{pos} z {n} let kladných. Ne každý rok je růstový – klíč je přečkat ty červené. Popsaný je nejlepší a nejhorší rok.</p>
                  <div className="overflow-hidden">
                    <svg viewBox="0 0 900 248" className="w-full h-auto" role="img" aria-label="Roční výnosy Buffettova portfolia">
                      {/* osa Y – gridlines + procentní popisky */}
                      {levels.map((lv) => (
                        <g key={lv}>
                          <line x1={PL} y1={yOf(lv)} x2="900" y2={yOf(lv)} stroke={lv === 0 ? '#cbd5e1' : '#f1f5f9'} strokeWidth={lv === 0 ? 1.2 : 1} />
                          <text x={PL - 8} y={yOf(lv) + 5} textAnchor="end" fontSize="15" fill="#64748b" className="tabular-nums">{lv > 0 ? `+${lv}` : lv} %</text>
                        </g>
                      ))}
                      {yrs.map((y, i) => {
                        const x = PL + i * gw;
                        const bh = Math.max(Math.abs(yOf(y.b) - base), 0.5);
                        const extreme = y.b === maxB || y.b === minB;
                        return (
                          <g key={y.year}>
                            <rect x={x + gw * 0.18} y={y.b >= 0 ? base - bh : base} width={gw * 0.64} height={bh} rx="1.5" fill={y.b >= 0 ? '#0d9488' : '#ef4444'} />
                            {i % 3 === 0 && <text x={x + gw / 2} y="242" textAnchor="middle" fontSize="15" fill="#64748b">{`'${String(y.year).slice(2)}`}</text>}
                            {extreme && <text x={x + gw / 2} y={y.b >= 0 ? base - bh - 6 : base + bh + 17} textAnchor="middle" fontSize="15" fontWeight="600" fill={y.b >= 0 ? '#0f766e' : '#dc2626'}>{`${y.b >= 0 ? '+' : ''}${Math.round(y.b)} %`}</text>}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* 3. DCA */}
        <section className="pb-10">
          <SectionHead title="A co pravidelné investování?" desc="Stejné portfolio, 100 000 Kč na startu + 5 000 Kč měsíčně." />
          <div className="rounded-lg border border-teal-200 bg-teal-50/40 p-6 max-w-3xl">
            <p className="text-sm text-slate-700 leading-relaxed">
              Kdo od července 2002 vložil 100 000 Kč a přidával 5 000 Kč měsíčně, vložil celkem{' '}
              <strong className="text-slate-900">{R ? kc(R.dca.summary.amountInvested) : '1 540 000 Kč'}</strong> – a dnes by měl{' '}
              <strong className="text-slate-900">{R ? `přibližně ${kc(R.dca.summary.netAssetValue)}` : 'přibližně 7 715 000 Kč'}</strong>.{' '}
              {R ? `Zhruba ${(R.dca.summary.netAssetValue / R.dca.summary.amountInvested).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })}×` : 'Pětinásobek'} vkladů, v korunách,
              po poplatcích, včetně dvou velkých krizí po cestě.
            </p>
            <p className="text-xs text-slate-500 mt-3">
              Každý měsíční vklad se přepočítává kurzem daného dne – žádné průměrování kurzu zpětně.
            </p>
          </div>
        </section>

        {/* 4. POCTIVÉ VÝHRADY */}
        <section className="pb-10">
          <SectionHead title="Co si rozmyslet, než to zkopírujete" desc="Poctivé výhrady – žádné portfolio není zadarmo." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              ['Koncentrace na USA', 'S&P 500 = sázka na americký trh a dolar. Celosvětová varianta (FTSE All-World) je diverzifikovanější – porovnejte si obě v backtestu.'],
              ['Kurz koruny', 'Výnos v Kč zahrnuje pohyb koruny vůči dolaru. Historicky koruna dlouhodobě posilovala – proto je korunový výnos nižší než dolarový. Počítáme to poctivě.'],
              ['Propad −47 % je test nervů', 'Buffett ho ustojí. Vy? Pokud ne, konzervativnější poměr (60/40) je lepší než panický prodej na dně.'],
            ] as [string, string][]).map(([t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="font-semibold text-slate-900 text-sm">{t}</p>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky" desc="Prakticky k portfoliu 90/10 pro českého investora." />
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

        {/* Pokračování – související články */}
        <section className="pb-12">
          <div className="grid gap-3 sm:grid-cols-3 text-sm">
            {([
              ['/kolik-vydelaly-etf', 'Kolik vydělaly ETF a akcie: datový rozbor'],
              ['/faktorove-etf', 'Faktorové ETF: co říkají data v Kč'],
              ['/dane-z-etf', 'Daně z ETF v Česku'],
            ] as [string, string][]).map(([href, label]) => (
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
