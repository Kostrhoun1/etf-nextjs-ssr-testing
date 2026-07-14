import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, Database, Info, Calculator, Wallet, Coins,
  Landmark, Scale, ShieldCheck, HelpCircle, Target, PiggyBank, Clock,
  LineChart, BookOpen, AlertTriangle,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Kolik investovat měsíčně, abyste měli milion (nebo rentu)',
  description:
    'Kolik reálně naspoříte pravidelným měsíčním vkladem do ETF – spočítáno v korunách pro 10, 20 i 30 let. Kolik měsíčně na první milion, jak výnos mění výsledek a kolik potřebujete na rentu. Srozumitelně a bez keců.',
  alternates: { canonical: '/kolik-investovat-mesicne' },
  openGraph: {
    title: 'Kolik investovat měsíčně, abyste měli milion (nebo rentu)',
    description:
      'Kolik naspoříte pravidelným vkladem do ETF v korunách – 10/20/30 let, kolik měsíčně na milion, kolik na rentu. Vzdělávací a nezávislé.',
    url: 'https://etfpruvodce.cz/kolik-investovat-mesicne',
    images: [ogImage({ title: 'Kolik investovat měsíčně, abyste měli milion (nebo rentu)', eyebrow: 'Kalkulačka' })],
    type: 'article',
  },
};

/* Budoucí hodnota pravidelného měsíčního vkladu (spořicí anuita). */
const fv = (pmt: number, annual: number, years: number) => {
  const r = annual / 12, n = years * 12;
  return pmt * ((Math.pow(1 + r, n) - 1) / r);
};
/* Kolik měsíčně je potřeba na cílovou částku. */
const need = (target: number, annual: number, years: number) => {
  const r = annual / 12, n = years * 12;
  return target / ((Math.pow(1 + r, n) - 1) / r);
};

const RATE = 0.07; // modelový nominální výnos p.a.
const MONTHLY = [1000, 3000, 5000, 10000];
const HORIZONS = [10, 20, 30];

/* Kč: nad milion „X,XX mil.", jinak plné číslo. */
const kc = (v: number) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mil. Kč`
    : `${Math.round(v).toLocaleString('cs-CZ')} Kč`;
const kcRound = (v: number) => `${Math.round(v).toLocaleString('cs-CZ')} Kč`;

export default async function KolikInvestovat() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const faqs = [
    {
      q: 'Kolik musím investovat měsíčně, abych měl milion?',
      a: `Záleží hlavně na čase. Při modelovém výnosu 7 % ročně stačí na první milion zhruba ${Math.round(need(1_000_000, RATE, 30)).toLocaleString('cs-CZ')} Kč měsíčně, pokud investujete 30 let, ${Math.round(need(1_000_000, RATE, 20)).toLocaleString('cs-CZ')} Kč při 20 letech a ${Math.round(need(1_000_000, RATE, 10)).toLocaleString('cs-CZ')} Kč při 10 letech. Čím dřív začnete, tím míň musíte odkládat – práci za vás udělá složené úročení.`,
    },
    {
      q: 'S jakým výnosem mám počítat u ETF?',
      a: 'Široký akciový index historicky vynášel dlouhodobě zhruba 7 % ročně nominálně (před inflací). Není to záruka – trh kolísá a jednotlivé roky mohou být hluboko v mínusu i výrazně v plusu. Proto počítáme s modelovým průměrem a v kalkulačce si můžete zkusit i opatrnější 5 % nebo optimističtější 9 %.',
    },
    {
      q: 'Jsou ta čísla po zdanění a inflaci?',
      a: 'Ne – tabulky ukazují nominální hodnotu před inflací a bez daní. Reálná kupní síla bude nižší (milion za 30 let koupí méně než dnes). Na druhou stranu při držbě ETF déle než 3 roky je zisk z prodeje v Česku za splnění podmínek osvobozen od daně. Reálnou (inflací očištěnou) hodnotu si přepnete v naší kalkulačce.',
    },
    {
      q: 'Je lepší investovat pravidelně, nebo jednorázově?',
      a: 'Pokud máte peníze k dispozici hned, historicky mírně vyhrává jednorázová investice (trh většinu času roste). Pravidelné investování (DCA) je ale pro většinu lidí přirozenější – investujete z výplaty, rozložíte nákupy v čase a nemusíte řešit „správný okamžik". Nejdůležitější je vůbec začít a vydržet.',
    },
    {
      q: 'Kolik potřebuji naspořit na rentu?',
      a: `Podle pravidla 4 % zhruba 25násobek ročních výdajů (300násobek měsíčních). Renta 20 000 Kč měsíčně tak vyžaduje kolem 6 milionů Kč, renta 30 000 Kč kolem 9 milionů. Detailně to řešíme v průvodci FIRE a ve FIRE kalkulačce.`,
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
      { '@type': 'ListItem', position: 2, name: 'Kolik investovat měsíčně', item: 'https://etfpruvodce.cz/kolik-investovat-mesicne' },
    ],
  };

  const millionMonthly = HORIZONS.map((y) => ({ y, pmt: need(1_000_000, RATE, y) }));

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
            <Link href="/kalkulacky" className="text-teal-700 font-medium">Kalkulačky</Link>
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
          <span className="text-slate-600">Kolik investovat měsíčně</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <PiggyBank className="w-3.5 h-3.5" /> Vzdělávací pilíř · vše v Kč
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Kolik investovat měsíčně, abyste měli milion (nebo rentu)?
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Kolik reálně naspoříte pravidelným vkladem do ETF – <strong className="text-white">v korunách</strong> pro 10, 20 i 30 let.
              Příklad: na první milion stačí <strong className="text-white">~{Math.round(need(1_000_000, RATE, 30)).toLocaleString('cs-CZ')} Kč měsíčně</strong>,
              když investujete 30 let při modelovém výnosu ~7 % ročně (nominálně, před inflací).
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/investicni-kalkulacka" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Calculator className="w-4 h-4" /> Spočítat pro moje číslo
              </Link>
              <Link href="/fire" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <Target className="w-4 h-4" /> Kolik na rentu (FIRE)
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Výnosy v Kč</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* ÚVOD */}
        <section className="pb-9">
          <div className="max-w-3xl text-[15px] text-slate-600 leading-relaxed space-y-3">
            <p>
              „Kolik mám investovat?" je špatně položená otázka. Správně zní: <strong className="text-slate-900">kolik
              chci mít – a za jak dlouho?</strong> Zbytek je aritmetika, kterou za vás odpracuje složené úročení.
            </p>
            <p>
              Počítáme s modelovým výnosem <strong className="text-slate-900">7 % ročně</strong> (dlouhodobý historický
              průměr širokého akciového indexu, před inflací) a s pravidelným měsíčním vkladem, který reinvestujete.
              Všechno v korunách.
            </p>
          </div>
        </section>

        {/* 1. TABULKA: kolik naspořím */}
        <section className="pb-10">
          <SectionHead title="Kolik naspoříte měsíčním vkladem" desc="Budoucí hodnota pravidelné investice při 7 % ročně. Vidíte, jak čas dělá většinu práce – vklad roste lineárně, ale výsledek exponenciálně." />
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full min-w-[38rem] text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                  <th className="py-3 px-4 text-left font-medium">Měsíčně</th>
                  {HORIZONS.map((y) => <th key={y} className="py-3 px-4 text-right font-medium">Za {y} let</th>)}
                  <th className="py-3 px-4 text-right font-medium">Vloženo (30 let)</th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY.map((pmt) => (
                  <tr key={pmt} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4 font-semibold text-slate-900 tabular-nums">{pmt.toLocaleString('cs-CZ')} Kč</td>
                    {HORIZONS.map((y) => (
                      <td key={y} className="py-3 px-4 text-right tabular-nums font-medium text-teal-700">{kc(fv(pmt, RATE, y))}</td>
                    ))}
                    <td className="py-3 px-4 text-right tabular-nums text-slate-400">{kcRound(pmt * 360)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Všimněte si posledního sloupce: kdo 30 let posílá 5 000 Kč měsíčně, vloží 1,8 milionu – ale na účtu má{' '}
            <strong className="text-slate-700">{kc(fv(5000, RATE, 30))}</strong>. Ten rozdíl vydělaly výnosy z výnosů.
          </p>
        </section>

        {/* 2. KOLIK NA MILION */}
        <section className="pb-10">
          <SectionHead title="Kolik měsíčně na první milion" desc="Stejná otázka z druhé strany. A hlavní ponaučení: začít dřív je mnohem silnější než posílat víc." />
          <div className="grid gap-3 sm:grid-cols-3">
            {millionMonthly.map(({ y, pmt }) => (
              <div key={y} className="rounded-lg border border-slate-200 bg-white p-5 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide">za {y} let</p>
                <p className="mt-1 text-2xl font-bold text-teal-700 tabular-nums">{Math.round(pmt).toLocaleString('cs-CZ')} Kč</p>
                <p className="text-xs text-slate-400 mt-0.5">měsíčně</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-teal-100 bg-teal-50/50 p-4">
            <Clock className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-relaxed">
              Kdo začne v 30 a odkládá <strong>{Math.round(need(1_000_000, RATE, 30)).toLocaleString('cs-CZ')} Kč</strong> měsíčně, má
              v 60 milion. Kdo začne až v 50 a chce ho mít taky v 60, musí posílat{' '}
              <strong>{Math.round(need(1_000_000, RATE, 10)).toLocaleString('cs-CZ')} Kč</strong> – tedy{' '}
              {(need(1_000_000, RATE, 10) / need(1_000_000, RATE, 30)).toLocaleString('cs-CZ', { maximumFractionDigits: 0 })}× víc.
              Nejlevnější palivo k cíli je čas, ne výše vkladu.
            </p>
          </div>
        </section>

        {/* 3. VÝNOS ROZHODUJE */}
        <section className="pb-10">
          <SectionHead title="Kolik změní výnos" desc="Výnos není zaručený. Podívejte se, jak by dopadlo 5 000 Kč měsíčně po 30 letech při různých ročních výnosech." />
          <div className="grid gap-3 sm:grid-cols-3">
            {[0.05, 0.07, 0.09].map((a) => (
              <div key={a} className={`rounded-lg border bg-white p-5 text-center ${a === RATE ? 'border-teal-300 ring-1 ring-teal-100' : 'border-slate-200'}`}>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{(a * 100).toLocaleString('cs-CZ')} % ročně</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{kc(fv(5000, a, 30))}</p>
                <p className="text-xs text-slate-400 mt-0.5">{a === RATE ? 'náš modelový průměr' : a < RATE ? 'opatrnější' : 'optimističtější'}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Dva procentní body ročně udělají za 30 let rozdíl v milionech. Proto se u ETF vyplatí hlídat i poplatek (TER) –
            každé procento navíc si ukrojí právě z tohoto výsledku. <Link href="/kalkulacka" className="text-teal-700 hover:underline">Dopad poplatků spočítáte tady</Link>.
          </p>
        </section>

        {/* 4. OD MILIONU K RENTĚ */}
        <section className="pb-10">
          <SectionHead title="Od milionu k rentě" desc="Milion je milník, ne cíl. Kolik potřebujete, aby vás portfolio uživilo – podle pravidla 4 % (25násobek ročních výdajů)." />
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full min-w-[28rem] text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                  <th className="py-3 px-4 text-left font-medium">Chci rentu měsíčně</th>
                  <th className="py-3 px-4 text-right font-medium">Potřebuji naspořit</th>
                </tr>
              </thead>
              <tbody>
                {[15000, 20000, 30000, 40000].map((m) => (
                  <tr key={m} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4 font-medium text-slate-800 tabular-nums">{m.toLocaleString('cs-CZ')} Kč</td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold text-teal-700">{kc(m * 300)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Link href="/fire" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800">
              Celý průvodce cestou k rentě: FIRE a finanční nezávislost <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 5. CO ČÍSLA NEZOHLEDŇUJÍ – poctivé caveaty */}
        <section className="pb-10">
          <SectionHead title="Tři věci, které tabulky nezohledňují" desc="Ať nejsou čekání zbytečně růžová. Poctivě k tomu, co realitu mění." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              [AlertTriangle, 'Inflace', 'Milion za 30 let koupí méně než dnes. Reálná (inflací očištěná) hodnota je nižší – v kalkulačce ji přepnete.'],
              [Scale, 'Kolísání trhu', 'Výnos není lineárních 7 % každý rok. Přijdou i hluboké propady; klíčové je nepanikařit a vydržet.'],
              [Coins, 'Daně', 'Dobrá zpráva: při držbě ETF déle než 3 roky je zisk z prodeje v Česku za splnění podmínek osvobozen.'],
            ] as [typeof AlertTriangle, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Víc o zdanění v průvodci <Link href="/dane-z-etf" className="text-teal-700 hover:underline">Daně z ETF</Link>,
            reálnou vs. nominální hodnotu si přepnete v <Link href="/investicni-kalkulacka" className="text-teal-700 hover:underline">investiční kalkulačce</Link>.
            Kolik ETF reálně vydělaly v minulosti (v Kč) rozebírá <Link href="/kolik-vydelaly-etf" className="text-teal-700 hover:underline">Kolik vydělaly akcie</Link>.
          </p>
        </section>

        {/* 6. NÁSTROJE */}
        <section className="pb-10">
          <SectionHead title="Spočítejte si to přesně" desc="Zadejte vlastní čísla – tabulky výše jsou modelové." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ['/investicni-kalkulacka', 'Investiční kalkulačka', 'Váš vklad, výnos, horizont – v Kč', Calculator],
              ['/monte-carlo', 'Monte Carlo', 'Pravděpodobnostní scénáře, ne jedno číslo', LineChart],
              ['/backtest', 'Backtest portfolia', 'Jak by strategie prošla historií', Scale],
              ['/fire', 'Průvodce FIRE', 'Kolik potřebujete k rentě', Target],
              ['/svetove-etf-indexy', 'Který světový ETF', 'Do čeho ty peníze vlastně poslat', TrendingUp],
              ['/kalkulacka', 'Kalkulačka poplatků', 'Kolik ukrojí TER za desítky let', Wallet],
              ['/investovani-pro-deti', 'Investování pro děti', 'Kolik naspoříte dítěti do 18 let', PiggyBank],
            ] as [string, string, string, typeof Wallet][]).map(([href, label, desc, Icon]) => (
              <Link key={href} href={href} className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 shrink-0 group-hover:bg-teal-100 transition-colors"><Icon className="w-4 h-4" /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900 group-hover:text-teal-700">{label}</span>
                  <span className="block text-xs text-slate-500 leading-relaxed">{desc}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-700 shrink-0 ml-auto" />
              </Link>
            ))}
          </div>
        </section>

        {/* 7. FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky" />
          <div className="space-y-2">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-lg border border-slate-200 bg-white">
                <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <HelpCircle className="w-4 h-4 text-teal-700 shrink-0" /> {f.q}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <p className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* E-E-A-T patička */}
        <section className="pb-8">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Obsah tvoříme nezávisle a nekomerčně – bez provizí a placeného pořadí.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Výpočty jsou modelové (7 % p.a., před inflací a daněmi) a mají vzdělávací charakter. Nejde o investiční doporučení a skutečné výnosy se liší. Aktualizováno {dateStr}.</p>
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="pb-12">
          <InvestmentDisclaimer />
        </section>
      </main>

    </div>
  );
}
