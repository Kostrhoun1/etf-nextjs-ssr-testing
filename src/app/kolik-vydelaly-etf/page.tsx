import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, Database, Calculator, Wallet, ShieldCheck,
  Clock, AlertTriangle, TrendingDown, LineChart, CheckCircle2, Flame,
  Sprout, Timer, Receipt, Target, Repeat, Percent,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';
import { getEquityCurve } from '@/lib/backtest/equityCurve';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Kolik vydělaly ETF a akcie: kompletní datový rozbor (ze 100 000 Kč čtyřnásobek za 18 let)',
  description:
    'Nejhlubší český datový rozbor, kolik reálně vydělaly světové akcie v korunách. Ze 100 000 Kč přibližně čtyřnásobek za ~18 let, rok po roce 2008–2026, rolling okna 1/5/10/15 let, šest největších krizí, pravidelné vs. jednorázové vklady i svět vs. USA vs. regiony. Orientačně, v korunách, po TER.',
  alternates: { canonical: '/kolik-vydelaly-etf' },
  openGraph: {
    title: 'Kolik vydělaly ETF a akcie: kompletní datový rozbor v korunách',
    description:
      'Ze 100 000 Kč přibližně čtyřnásobek za ~18 let – rok po roce, rolling okna, největší krize, DCA i svět vs. USA. Nejhlubší český datový rozbor. Vzdělávací, nezávislé.',
    url: 'https://etfpruvodce.cz/kolik-vydelaly-etf',
    images: [ogImage({ title: 'Kolik vydělaly ETF a akcie: kompletní datový rozbor v korunách', eyebrow: 'Datový rozbor', stat: '100 000 → 400 000 Kč', statLabel: 'za 18 let' })],
    type: 'article',
  },
};

export default async function KolikVydelalyEtf() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  // Equity křivka (serverové SVG). Null → graf se nevykreslí, stránka nespadne.
  const equity = await getEquityCurve();
  const chart = (() => {
    if (!equity) return null;
    const W = 720, H = 300, padL = 8, padR = 14, padT = 18, padB = 30;
    const yMin = Math.min(equity.minY, 100000) * 0.9;
    const yMax = equity.maxY * 1.06;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const px = (x: number) => padL + x * plotW;
    const py = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * plotH;
    const line = equity.points.map((p, i) => `${i ? 'L' : 'M'}${px(p.x).toFixed(1)},${py(p.y).toFixed(1)}`).join(' ');
    const area = `${line} L${px(1).toFixed(1)},${py(yMin).toFixed(1)} L${px(0).toFixed(1)},${py(yMin).toFixed(1)} Z`;
    const years: number[] = [];
    for (let y = Math.ceil(equity.startYear / 4) * 4; y < equity.endYear; y += 4) years.push(y);
    const yearX = (y: number) => (y - equity.startYear) / (equity.endYear - equity.startYear);
    return { W, H, padL, padR, py, px, line, area, yMin, yMax, years, yearX,
      y100: py(100000), xEnd: px(1), yEndVal: py(equity.finalValue) };
  })();

  // ── Ověřená data z našeho enginu (FTSE All-World, v Kč, po TER), start 06/2008 ──
  // Formátování v češtině (desetinná čárka, mezery v tisících)
  const czk = (n: number) => n.toLocaleString('cs-CZ');
  const num = (n: number) => n.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const spct = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${num(Math.abs(n))} %`;

  // 1) Roční výnosy 2008–2026 (2026 = neúplný rok, do data výše)
  const annualData: { year: number; v: number }[] = [
    { year: 2008, v: -25.4 }, { year: 2009, v: 30.4 }, { year: 2010, v: 6.8 },
    { year: 2011, v: -6.2 }, { year: 2012, v: 16.9 }, { year: 2013, v: 22.7 },
    { year: 2014, v: 3.5 }, { year: 2015, v: -2.1 }, { year: 2016, v: 8.3 },
    { year: 2017, v: 24.2 }, { year: 2018, v: -10.0 }, { year: 2019, v: 26.5 },
    { year: 2020, v: 16.3 }, { year: 2021, v: 18.0 }, { year: 2022, v: -18.2 },
    { year: 2023, v: 21.8 }, { year: 2024, v: 16.2 }, { year: 2025, v: 22.2 },
    { year: 2026, v: 11.8 },
  ];
  const bar = (() => {
    const W = 720, H = 320, padL = 30, padR = 10, padT = 24, padB = 46;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const vMax = 34, vMin = -30;
    const py = (v: number) => padT + (1 - (v - vMin) / (vMax - vMin)) * plotH;
    const n = annualData.length;
    const slot = plotW / n;
    const bw = slot * 0.6;
    const bx = (i: number) => padL + i * slot + (slot - bw) / 2;
    return { W, H, padL, padR, padT, plotW, plotH, vMax, vMin, py, n, slot, bw, bx, zero: py(0) };
  })();

  // 2) Rolling okna (1/5/10/15 let): nejhorší / nejlepší / průměr p.a. / % v plusu
  const rolling = [
    { y: 1, low: -28.5, high: 59.0, avg: 11.6, pos: 77 },
    { y: 5, low: 2.6, high: 19.8, avg: 9.6, pos: 100 },
    { y: 10, low: 5.7, high: 12.8, avg: 9.3, pos: 100 },
    { y: 15, low: 6.6, high: 11.9, avg: 9.6, pos: 100 },
  ];

  // 3) Šest největších propadů (drawdownů)
  const drawdowns = [
    { depth: -50.3, from: 'červen 2008', months: 31, note: 'finanční krize' },
    { depth: -34.3, from: 'únor 2020', months: 6, note: 'covidový krach' },
    { depth: -26.5, from: 'listopad 2021', months: 26, note: 'inflace a růst sazeb' },
    { depth: -23.9, from: 'duben 2011', months: 21, note: 'dluhová krize eurozóny' },
    { depth: -20.1, from: 'leden 2018', months: 21, note: 'obchodní války' },
    { depth: -19.9, from: 'květen 2015', months: 20, note: 'zpomalení Číny' },
  ];

  // 5) Pravidelně vs. jednorázově (DCA 5 000 Kč/měs)
  const dcaInvested = 2015484;
  const dcaFinal = 7508568;
  const dcaGain = dcaFinal - dcaInvested;

  // 7) Svět vs. USA vs. regiony (100 000 Kč jednorázově, od 2008)
  const indices = [
    { name: 'S&P 500 (USA)', cagr: 11.2, final: 6948451, maxDD: -51.9, accent: 'emerald' as const },
    { name: 'FTSE All-World (celý svět)', cagr: 8.6, final: 4305791, maxDD: -50.3, accent: 'teal' as const },
    { name: 'Rozvinuté trhy mimo USA (EAFE)', cagr: 4.4, final: 2158874, maxDD: -58.4, accent: 'slate' as const },
    { name: 'Rozvíjející se trhy (EM)', cagr: 3.6, final: 1868875, maxDD: -64.3, accent: 'slate' as const },
  ];

  const faqs = [
    {
      q: 'Kolik vydělaly světové akcie za posledních zhruba 18 let?',
      a: 'Podle našich historických dat od poloviny roku 2008 zhodnotil široký index světových akcií (FTSE All-World) v korunách přibližně na čtyřnásobek – ze 100 000 Kč tedy zhruba 400 000 Kč. To odpovídá průměrnému zhodnocení kolem 8–9 % ročně. Jde o orientační výpočet z minulých dat, ne o příslib budoucnosti; budoucí výnos může být výrazně jiný.',
    },
    {
      q: 'Znamená to, že investování do širokých akciových ETF je bez rizika?',
      a: 'Ne. Stejný široký index cestou prošel několika hlubokými propady – v roce 2008 klesl o zhruba 50 %, na začátku covidu o zhruba 34 % a v roce 2022 o zhruba 26 %. Kdo by prodal na dně, ztrátu si zafixoval. Zhodnocení dostal ten, kdo propady vydržel a zůstal investovaný. (Pozn.: v roce 2008 šlo o index; investovatelné světové ETF přišly na trh až později, kolem roku 2012.)',
    },
    {
      q: 'Jak dlouho trvalo, než se trh po propadu vzpamatoval?',
      a: 'Různě. Po covidovém propadu se index vrátil na původní hodnotu během několika měsíců, po medvědím trhu 2022 přibližně za rok. Po roce 2008 to trvalo déle. Právě proto se akcie hodí na peníze, které nebudete potřebovat řadu let.',
    },
    {
      q: 'Proč se říká, že čas snižuje riziko?',
      a: 'V našich datech platí, že na horizontu jednoho roku skončilo v plusu zhruba 77 % období – jednotlivý rok tedy klidně mohl být ztrátový. Ale na horizontu deseti let skončilo v plusu 100 % období a nejhorší desetiletka stále vydělala kolem 5–6 % ročně. Delší horizont historicky výrazně zvyšoval šanci na kladný výsledek.',
    },
    {
      q: 'Jak si to můžu spočítat pro své vlastní portfolio?',
      a: 'V našem backtestu si můžete složit vlastní portfolio z konkrétních ETF, zvolit období i pravidelné vklady a uvidíte zhodnocení, nejhlubší propad i to, jak dlouho trvalo zotavení – vše v korunách. Výsledek je orientační a vychází z minulých dat.',
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
      { '@type': 'ListItem', position: 2, name: 'Kolik vydělaly ETF', item: 'https://etfpruvodce.cz/kolik-vydelaly-etf' },
    ],
  };

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
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <span className="text-slate-600">Kolik vydělaly ETF</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <LineChart className="w-3.5 h-3.5" /> Datový pohled · reálná čísla v korunách
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Kolik reálně vydělaly ETF a světové akcie v korunách
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Ze <strong className="text-white">100 000 Kč přibližně čtyřnásobek</strong> za zhruba 18 let. Cesta k tomu
              ale vedla přes tři hluboké propady – a právě ony rozhodly, kdo výnos nakonec dostal. Reálný příběh
              širokého indexu světových akcií v číslech: kolik vydělal, o kolik cestou spadl a co z toho plyne pro váš horizont.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Calculator className="w-4 h-4" /> Otestovat vlastní portfolio
              </Link>
              <Link href="/pruvodce" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <TrendingUp className="w-4 h-4" /> Co jsou vlastně ETF
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Vše v Kč</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Data k {dateStr}</span>
            </div>

            {/* Klíčová čísla */}
            <div className="mt-6 grid grid-cols-3 gap-2.5 max-w-2xl">
              <div className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-400"><Sprout className="w-3.5 h-3.5" /> Ze 100 000 Kč</span>
                <p className="mt-1 text-lg md:text-xl font-bold tabular-nums text-emerald-400">~400 000 Kč</p>
                <p className="text-xs text-slate-400 mt-0.5">za ~18 let (~8–9 % ročně)</p>
              </div>
              <div className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-400"><TrendingDown className="w-3.5 h-3.5" /> Nejhlubší propad</span>
                <p className="mt-1 text-lg md:text-xl font-bold tabular-nums text-rose-300">~ −50 %</p>
                <p className="text-xs text-slate-400 mt-0.5">během krize 2008</p>
              </div>
              <div className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-400"><Timer className="w-3.5 h-3.5" /> Na 10 letech</span>
                <p className="mt-1 text-lg md:text-xl font-bold tabular-nums text-white">100 %</p>
                <p className="text-xs text-slate-400 mt-0.5">období skončilo v plusu</p>
              </div>
            </div>
          </div>
        </section>

        {/* UPOZORNĚNÍ */}
        <section className="pb-8">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>Orientační pohled do historie, ne příslib budoucnosti.</strong> Čísla vycházejí z historického
              vývoje širokého indexu světových akcií (typu FTSE All-World) přepočteného do korun, od poloviny roku 2008
              do současnosti, a jsou zaokrouhlená. Minulé výnosy nezaručují ty budoucí a skutečný výsledek závisí na
              konkrétním fondu, poplatcích, daních i době, kdy nakoupíte a prodáte.
            </p>
          </div>
        </section>

        {/* 1. KOLIK VYDĚLALO 100k */}
        <section className="pb-10">
          <SectionHead title="Ze 100 000 Kč přibližně čtyřnásobek" desc="Kdyby investor v polovině roku 2008 vložil 100 000 Kč do širokého indexu světových akcií a nechal ho být, měl by dnes zhruba čtyřikrát tolik." />
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0"><Sprout className="w-5 h-5" /></span>
              <div className="text-[15px] text-slate-600 leading-relaxed space-y-3">
                <p>
                  Široký světový index (typu FTSE All-World) sdružuje tisíce firem z celého světa. Kdo do něj vložil{' '}
                  <strong className="text-slate-900">100 000 Kč</strong> v polovině roku 2008, měl by dnes v korunách{' '}
                  <strong className="text-emerald-700">přibližně 400 000 Kč</strong> – tedy zhruba{' '}
                  <strong className="text-slate-900">čtyřnásobek</strong>. To odpovídá průměrnému zhodnocení kolem{' '}
                  <strong className="text-slate-900">8–9 % ročně</strong>.
                </p>
                <p>
                  A to i přesto, že &bdquo;start&ldquo; v roce 2008 padl těsně před jednu z největších finančních krizí v historii.
                  Kdo začal později, měl cestu klidnější. To je první důležitý poznatek: <strong className="text-slate-900">u
                  dlouhého horizontu rozhoduje víc vytrvalost než dokonalé načasování.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CESTA NEBYLA KLIDNÁ */}
        <section className="pb-10">
          <SectionHead title="Cesta ale zdaleka nebyla klidná" desc="Ten čtyřnásobek nevznikl v přímé linii. Investor cestou zažil několik hlubokých propadů – a právě ty rozhodují, kdo výnos nakonec dostane." />
          {chart && equity && (
            <div className="mb-3 rounded-xl border border-slate-200 bg-white p-4 md:p-5">
              <p className="text-sm font-medium text-slate-900 mb-2">Hodnota 100 000 Kč ve světovém indexu ({equity.startYear}–{equity.endYear})</p>
              <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${chart.W} ${chart.H}`} className="w-full h-auto min-w-[520px]" role="img" aria-label={`Vývoj hodnoty 100 000 Kč investovaných do světového indexu od roku ${equity.startYear}: přibližně čtyřnásobek, cestou přes hluboké propady v letech 2008, 2020 a 2022.`}>
                  <defs>
                    <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {chart.years.map((y) => {
                    const xx = chart.px(chart.yearX(y));
                    const anchor = xx < 24 ? 'start' : xx > chart.W - 24 ? 'end' : 'middle';
                    return (
                      <g key={y}>
                        <line x1={xx} y1={chart.padT} x2={xx} y2={chart.H - 30} stroke="#f1f5f9" strokeWidth="1" />
                        <text x={xx} y={chart.H - 11} textAnchor={anchor} fontSize="11" fill="#94a3b8">{y}</text>
                      </g>
                    );
                  })}
                  <line x1={chart.padL} y1={chart.y100} x2={chart.W - chart.padR} y2={chart.y100} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
                  <text x={chart.padL + 2} y={chart.y100 - 4} fontSize="10.5" fill="#94a3b8">vklad 100 000 Kč</text>
                  <path d={chart.area} fill="url(#eqFill)" />
                  <path d={chart.line} fill="none" stroke="#0d9488" strokeWidth="2" strokeLinejoin="round" />
                  {equity.troughs.map((t) => (
                    <g key={t.year}>
                      <circle cx={chart.px(t.x)} cy={chart.py(t.y)} r="3.5" fill="#e11d48" />
                      <text x={chart.px(t.x)} y={chart.py(t.y) + 16} textAnchor="middle" fontSize="11" fontWeight="600" fill="#e11d48">{t.label}</text>
                    </g>
                  ))}
                  <circle cx={chart.xEnd} cy={chart.yEndVal} r="3.5" fill="#0d9488" />
                  <text x={chart.xEnd - 6} y={chart.yEndVal - 7} textAnchor="end" fontSize="12" fontWeight="700" fill="#0f766e">~400 000 Kč</text>
                  <text x={chart.W - 2} y="12" textAnchor="end" fontSize="11" fontWeight="600" fill="#94a3b8" fontFamily="sans-serif">Zdroj: etfpruvodce.cz</text>
                </svg>
              </div>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">Skutečný historický vývoj širokého světového indexu (FTSE All-World) přepočtený na vklad 100 000 Kč, od poloviny roku 2008 do současnosti. Hodnoty jsou zaokrouhlené. Minulé výnosy nezaručují ty budoucí.</p>
            </div>
          )}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-medium">Krize</th>
                  <th className="px-4 py-3 font-medium text-right">Propad</th>
                  <th className="px-4 py-3 font-medium text-right">Návrat na původní hodnotu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Finanční krize 2008</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-rose-600">~ −50 %</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-600">několik let</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Covidový krach 2020</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-rose-600">~ −34 %</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-600">několik měsíců</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Medvědí trh 2022</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-rose-600">~ −26 %</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-600">přibližně rok</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Vidět na papíře &bdquo;−50 %&ldquo; je jiné než to zažít na vlastním účtu. Právě proto skončí spousta lidí ve ztrátě –
            ne proto, že by trh nevydělal, ale proto, že <strong className="text-slate-700">prodali ve chvíli největšího
            strachu</strong>. Zhodnocení výše dostal ten, kdo propady přečkal. Jak hluboký propad by uneslo vaše portfolio,
            si můžete osahat v <Link href="/backtest" className="text-teal-700 hover:underline">backtestu</Link>.
          </p>
        </section>

        {/* 3. PROČ ČAS MĚNÍ VŠECHNO */}
        <section className="pb-10">
          <SectionHead title="Proč čas mění všechno" desc="Stejná investice vypadá úplně jinak podle toho, jak dlouhý úsek si vezmete. Tady je rozdíl mezi jedním rokem a deseti lety." />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 mb-3"><Clock className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Na horizontu 1 roku</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">~77 %<span className="text-base font-medium text-slate-500"> období v plusu</span></p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Jednotlivý rok byl loterie – klidně mohl skončit hlubokou ztrátou. Na krátký horizont akcie nepatří.
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 mb-3"><CheckCircle2 className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Na horizontu 10 let</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-700">100 %<span className="text-base font-medium text-emerald-600/70"> období v plusu</span></p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Každé desetileté období v datech skončilo v plusu – i to nejhorší stále vydělalo kolem 5–6 % ročně.
                Čas byl nejsilnější spojenec.
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Tohle je jádro celého příběhu: akcie nejsou nástroj na příští rok, ale na příští dekádu. Čím delší horizont,
            tím víc jednotlivý špatný rok ztrácí na váze a tím <strong className="text-slate-700">spolehlivější byl kladný
            výsledek</strong>. Data ale pokrývají jen zhruba 18 let, takže desetiletých období je omezený počet a všechna
            začínají poblíž dna krize 2008 – ono &bdquo;100 %&ldquo; proto berte jako ilustraci síly času, ne jako záruku.
          </p>
        </section>

        {/* ROK PO ROCE – sloupcový graf */}
        <section className="pb-10">
          <SectionHead title="Rok po roce (2008–2026)" desc="Průměr 8–9 % ročně skrývá obří rozdíly mezi jednotlivými roky. Takhle vypadala skutečná jízda – od −25 % v roce 2008 po +30 % o rok později." />
          <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${bar.W} ${bar.H}`} className="w-full h-auto min-w-[560px]" role="img" aria-label="Roční zhodnocení světového indexu v korunách za jednotlivé roky 2008 až 2026.">
                {[20, 0, -20].map((g) => (
                  <g key={g}>
                    <line x1={bar.padL} y1={bar.py(g)} x2={bar.W - bar.padR} y2={bar.py(g)} stroke={g === 0 ? '#cbd5e1' : '#f1f5f9'} strokeWidth="1" />
                    <text x={bar.padL - 6} y={bar.py(g) + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{g > 0 ? `+${g}` : g}%</text>
                  </g>
                ))}
                {annualData.map((d, i) => {
                  const rectY = d.v >= 0 ? bar.py(d.v) : bar.zero;
                  const rectH = Math.max(Math.abs(bar.py(d.v) - bar.zero), 1);
                  return (
                    <g key={d.year}>
                      <rect x={bar.bx(i)} y={rectY} width={bar.bw} height={rectH} rx="2" fill={d.v >= 0 ? '#0d9488' : '#e11d48'} />
                      <text x={bar.bx(i) + bar.bw / 2} y={d.v >= 0 ? rectY - 4 : rectY + rectH + 11} textAnchor="middle" fontSize="9.5" fontWeight="600" fill={d.v >= 0 ? '#0f766e' : '#e11d48'}>{`${d.v >= 0 ? '+' : '−'}${Math.round(Math.abs(d.v))}`}</text>
                      <text x={bar.bx(i) + bar.bw / 2} y={bar.H - 8} textAnchor="middle" fontSize="9.5" fill="#94a3b8">{`’${String(d.year).slice(2)}`}</text>
                    </g>
                  );
                })}
                <text x={bar.W - 2} y="12" textAnchor="end" fontSize="11" fontWeight="600" fill="#94a3b8">Zdroj: etfpruvodce.cz</text>
              </svg>
            </div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">Roční zhodnocení širokého světového indexu (FTSE All-World) v korunách, po poplatcích. Rok 2026 je neúplný (do data výše). Data k {dateStr}.</p>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">Z 19 sledovaných let bylo <strong className="text-slate-700">14 kladných a 5 ztrátových</strong>. Skvělé roky (+20 až +30 %) i ošklivé (−25 % v roce 2008) se střídaly nepravidelně – a přesně proto se nedá &bdquo;počkat si na ten správný rok&ldquo;.</p>
        </section>

        {/* ROLLING – tabulka oken */}
        <section className="pb-10">
          <SectionHead title="Záleželo, kdy jste začali – ale čím dýl, tím míň" desc="Vzali jsme všechna období dané délky a spočítali nejhorší, nejlepší a průměrný roční výnos. Čím delší okno, tím užší rozpětí a jistější kladný výsledek." />
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-medium">Držel jsem</th>
                  <th className="px-4 py-3 font-medium text-right">Nejhorší p.a.</th>
                  <th className="px-4 py-3 font-medium text-right">Nejlepší p.a.</th>
                  <th className="px-4 py-3 font-medium text-right">Průměr p.a.</th>
                  <th className="px-4 py-3 font-medium text-right">Období v plusu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rolling.map((r) => (
                  <tr key={r.y}>
                    <td className="px-4 py-3 font-medium text-slate-900">{r.y === 1 ? '1 rok' : `${r.y} let`}</td>
                    <td className={`px-4 py-3 text-right tabular-nums font-semibold ${r.low < 0 ? 'text-rose-600' : 'text-slate-700'}`}>{spct(r.low)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">{spct(r.high)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">{spct(r.avg)}</td>
                    <td className={`px-4 py-3 text-right tabular-nums font-semibold ${r.pos === 100 ? 'text-emerald-600' : 'text-slate-700'}`}>{r.pos} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">Na <strong className="text-slate-700">jeden rok</strong> byl výsledek loterie – od −28 % do +59 %, jen 77 % období skončilo v plusu. Ale <strong className="text-emerald-700">od pěti let výš skončilo v plusu 100 % období</strong> a i nejhorší desetiletka a patnáctiletka pořád vydělaly přes 5 % ročně. (Data pokrývají ~18 let, delších oken je omezený počet – berte jako ilustraci síly času.)</p>
        </section>

        {/* KRIZE DO HLOUBKY – 6 propadů */}
        <section className="pb-10">
          <SectionHead title="Krize do hloubky: šest největších propadů" desc="Nejen ty tři nejznámější. Za 18 let přišla celá řada propadů – a všechny se nakonec vrátily zpět na vrchol." />
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-medium">Od kdy</th>
                  <th className="px-4 py-3 font-medium">Příčina</th>
                  <th className="px-4 py-3 font-medium text-right">Propad</th>
                  <th className="px-4 py-3 font-medium text-right">Zpět na vrcholu za</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {drawdowns.map((d) => (
                  <tr key={d.from}>
                    <td className="px-4 py-3 font-medium text-slate-900">{d.from}</td>
                    <td className="px-4 py-3 text-slate-600">{d.note}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold text-rose-600">{spct(d.depth)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600">{d.months} měs.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">Propady jsou u akcií <strong className="text-slate-700">normální, ne výjimka</strong> – přišly v průměru každých pár let. Rozdíl je v tom, že po každém přišlo zotavení. Nejrychleji po covidu (6 měsíců), nejdéle po roce 2008 (31 měsíců).</p>
        </section>

        {/* NEJHORŠÍ NAČASOVÁNÍ */}
        <section className="pb-10">
          <SectionHead title="A co nejhorší možné načasování?" desc="Náš výpočet začíná v polovině roku 2008 – tedy prakticky těsně před krachem. Byl to jeden z nejhorších možných okamžiků na nákup." />
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6 flex items-start gap-3">
            <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 shrink-0"><Target className="w-5 h-5" /></span>
            <div className="text-[15px] text-slate-600 leading-relaxed space-y-3">
              <p>Kdo vložil 100 000 Kč právě tehdy, viděl je do roka spadnout o <strong className="text-rose-600">zhruba polovinu</strong>. A přesto – kdo vydržel – má dnes <strong className="text-emerald-700">přibližně čtyřnásobek</strong>.</p>
              <p>To je možná nejsilnější zjištění celého rozboru: i <strong className="text-slate-900">nejhorší možný vstup</strong> nakonec fungoval, pokud investor nepanikařil. Ne proto, že by na trhu neexistovalo riziko – ale proto, že dost dlouhý horizont ho historicky přebil.</p>
            </div>
          </div>
        </section>

        {/* DCA – pravidelně vs jednorázově */}
        <section className="pb-10">
          <SectionHead title="Pravidelně, nebo jednorázově?" desc="Většina lidí nemá milion na hromadě. Co když místo toho posíláte 5 000 Kč měsíčně? Spočítali jsme i to." />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Repeat className="w-5 h-5" /></span>
              <p className="text-xs uppercase tracking-wide text-slate-500">Celkem vloženo</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{czk(dcaInvested)} Kč</p>
              <p className="text-sm text-slate-500 mt-0.5">5 000 Kč měsíčně, 2008–2026</p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 mb-3"><Sprout className="w-5 h-5" /></span>
              <p className="text-xs uppercase tracking-wide text-emerald-700/80">Hodnota dnes</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-emerald-700">{czk(dcaFinal)} Kč</p>
              <p className="text-sm text-slate-600 mt-0.5">skoro čtyřnásobek vložených peněz</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><TrendingUp className="w-5 h-5" /></span>
              <p className="text-xs uppercase tracking-wide text-slate-500">Z toho čistý zisk</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{czk(dcaGain)} Kč</p>
              <p className="text-sm text-slate-500 mt-0.5">nad rámec vložených peněz</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">Pravidelné investování (DCA) má bonus: v propadech nakupujete levněji, takže špatné načasování bolí míň. Nevýhoda? V dlouhém rostoucím trhu vyděláte o něco méně než při velkém vkladu na začátku – zato klidněji a bez nutnosti mít balík hotovosti.</p>
        </section>

        {/* PO DANÍCH A POPLATCÍCH */}
        <section className="pb-10">
          <SectionHead title="Kolik z toho zůstane po daních a poplatcích" desc="Výnosy výše už jsou po ročních poplatcích fondů (TER). A dobrá zpráva pro české investory: po třech letech držby se zisk z prodeje nedaní." />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 mb-3"><CheckCircle2 className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Daň: po 3 letech nula</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Když ETF držíte déle než 3 roky (časový test), je zisk z prodeje za splnění zákonných podmínek osvobozen od daně z příjmu. Dlouhodobý investor tak z výnosu obvykle neodvede nic.{' '}
                <Link href="/dane-z-etf" className="text-teal-700 hover:underline">Jak to funguje →</Link>
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Percent className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Poplatky: ukrojí málo</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">Roční poplatek širokých ETF (TER) bývá kolem 0,2 % – na 18 letech to konečnou hodnotu sníží jen mírně. Čísla v tomto rozboru už poplatky obsahují, takže vidíte reálné zhodnocení.</p>
            </div>
          </div>
        </section>

        {/* SVĚT vs USA vs REGIONY */}
        <section className="pb-10">
          <SectionHead title="Svět, USA, nebo rozvíjející se trhy?" desc="Stejných 100 000 Kč, stejné období – ale jiný region. Rozdíly jsou obrovské a hodně napoví o riziku koncentrace." />
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-medium">Index</th>
                  <th className="px-4 py-3 font-medium text-right">Zhodnocení p.a.</th>
                  <th className="px-4 py-3 font-medium text-right">Ze 100 000 Kč</th>
                  <th className="px-4 py-3 font-medium text-right">Nejhlubší propad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {indices.map((idx) => (
                  <tr key={idx.name} className={idx.accent === 'teal' ? 'bg-teal-50/40' : undefined}>
                    <td className="px-4 py-3 font-medium text-slate-900">{idx.name}</td>
                    <td className={`px-4 py-3 text-right tabular-nums font-semibold ${idx.accent === 'emerald' ? 'text-emerald-700' : idx.accent === 'teal' ? 'text-teal-700' : 'text-slate-700'}`}>{spct(idx.cagr)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">~ {czk(Math.round(idx.final / 100000) * 10000)} Kč</td>
                    <td className="px-4 py-3 text-right tabular-nums text-rose-600">{spct(idx.maxDD)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">Za posledních 18 let jednoznačně táhly <strong className="text-slate-700">americké akcie</strong> (S&amp;P 500) – z milionu udělaly skoro sedminásobek. Rozvíjející se trhy naopak zaostaly. Pozor ale: <strong className="text-slate-700">minulý vítěz nemusí být ten budoucí</strong>. Sázka na jediný region je koncentrace rizika; široký svět (All-World) je kompromis, který drží kus obojího.</p>
        </section>

        {/* DELŠÍ POHLED – ZTRACENÁ DEKÁDA (S&P 500 od 1993) */}
        <section className="pb-10">
          <SectionHead title="A co ještě delší historie? Ztracená dekáda" desc="Rozbor výše začíná v roce 2008. Ještě delší data v korunách máme jen pro americké akcie (S&P 500) – koruna totiž vznikla až v roce 1993. A ukazují ještě drsnější lekci o trpělivosti." />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 mb-3"><Sprout className="w-5 h-5" /></span>
              <p className="text-xs uppercase tracking-wide text-emerald-700/80">33 let (1993→dnes)</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-700">2 720 000 Kč</p>
              <p className="text-sm text-slate-600 mt-0.5">ze 100 000 Kč, ~10,8 % ročně</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 mb-3"><TrendingDown className="w-5 h-5" /></span>
              <p className="text-xs uppercase tracking-wide text-slate-500">Dot-com krach 2000</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-rose-600">−57 %</p>
              <p className="text-sm text-slate-600 mt-0.5">zotavení trvalo skoro 7 let</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 mb-3"><Timer className="w-5 h-5" /></span>
              <p className="text-xs uppercase tracking-wide text-slate-500">Roky 2000–2013</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">~13 let</p>
              <p className="text-sm text-slate-600 mt-0.5">akcie skoro bez reálného zisku</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">Kdo koupil americké akcie na vrcholu roku 2000, viděl je spadnout o 57 % a na původní hodnotu se dostal až po sedmi letech – aby vzápětí přišla krize 2008. Reálně tak byl přes <strong className="text-slate-700">13 let skoro na nule</strong>. Extrémní příklad, proč horizont u akcií znamená klidně 15+ let, ne pět. Druhá strana mince: kdo těch 33 let vydržel, udělal ze 100 000 Kč přes <strong className="text-emerald-700">2,7 milionu</strong>. (Delší řada v korunách nejde – koruna vznikla v roce 1993.)</p>
        </section>

        {/* 4. CO SI Z TOHO VZÍT */}
        <section className="pb-10">
          <SectionHead title="Co si z toho vzít" desc="Tři závěry, které z těchto čísel plynou pro obyčejného investora." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              [Timer, 'Investujte na roky, ne na měsíce', 'Peníze, které možná budete potřebovat za rok nebo dva, do akcií nepatří. Síla ETF se projeví až na dlouhém horizontu.'],
              [Flame, 'Nejtěžší je nic nedělat', 'Největší nepřítel výnosu není krize, ale prodej v panice. Kdo v roce 2008 vydržel, vydělal. Kdo prodal na dně, ztratil.'],
              [Receipt, 'Náklady a daně rozhodují taky', 'Nízké poplatky (TER) a tříletý daňový test v Česku mají na konečný výsledek reálný vliv. Vyplatí se je znát předem.'],
            ] as [typeof Timer, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA – vyzkoušet na svých číslech */}
        <section className="pb-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Spočítejte si to na svých číslech</h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              V backtestu složíte vlastní portfolio, přidáte pravidelné vklady a uvidíte zhodnocení, nejhlubší propad
              i dobu zotavení – vše v korunách. Orientačně, na reálných historických datech.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Calculator className="w-4 h-4" /> Otevřít backtest
              </Link>
              <Link href="/kolik-investovat-mesicne" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <TrendingUp className="w-4 h-4" /> Kolik investovat měsíčně
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky" desc="Krátké odpovědi na to, co k těmto číslům lidi nejčastěji napadne." />
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {faqs.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-3 font-medium text-slate-900 list-none">
                  {f.q}
                  <ArrowRight className="w-4 h-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* POKRAČUJTE DÁL */}
        <section className="pb-10">
          <SectionHead title="Pokračujte dál" desc="Kam se vydat, když vás příběh v číslech zaujal." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {([
              [Calculator, 'Backtest portfolia', 'Otestujte vlastní ETF na historii.', '/backtest'],
              [Flame, 'FIRE kalkulačka', 'Za jak dlouho k finanční nezávislosti.', '/fire-kalkulacka'],
              [Receipt, 'Daně z ETF', 'Kdy z výnosu platíte a kdy ne.', '/dane-z-etf'],
              [TrendingUp, 'Modelová portfolia', 'Hotové strategie podle rizika.', '/portfolio-strategie'],
            ] as [typeof Calculator, string, string, string][]).map(([Icon, t, d, href]) => (
              <Link key={href} href={href} className="group rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900 flex items-center gap-1">{t}<ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* AUTOR / E-E-A-T */}
        <section className="pb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-start gap-4">
            <span className="flex items-center justify-center w-11 h-11 rounded-full bg-slate-100 text-slate-500 border border-slate-200 shrink-0"><User className="w-5 h-5" /></span>
            <div className="text-sm text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
              <p className="mt-1">
                Autor ETF průvodce.cz s 12 lety praxe ve financích. Čísla vycházejí z historických dat širokého indexu
                světových akcií přepočtených do korun – jde o orientační vzdělávací materiál, nikoli investiční
                doporučení. Pro výpočet na vlastních číslech použijte{' '}
                <Link href="/backtest" className="text-teal-700 hover:underline">backtest</Link>.
                <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
              </p>
            </div>
          </div>
        </section>

        <div className="pb-10"><InvestmentDisclaimer /></div>
      </main>
    </div>
  );
}
