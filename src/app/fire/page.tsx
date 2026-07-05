import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, Database, Info, Calculator, Wallet, Coins,
  Landmark, Scale, ShieldCheck, HelpCircle, BookOpen, Flame, Target, PiggyBank,
  Percent, Coffee, Sprout, Gem, LineChart,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'FIRE v Česku: kolik potřebuješ na finanční nezávislost (v Kč)',
  description:
    'Kompletní český průvodce FIRE a finanční nezávislostí. Kolik reálně potřebujete naspořit podle pravidla 4 % v korunách, jak dlouho to trvá podle míry úspor, role ETF a české daně. Vzdělávací, nezávislé, bez reklam.',
  alternates: { canonical: '/fire' },
  openGraph: {
    title: 'FIRE v Česku: kolik potřebuješ na finanční nezávislost (v Kč)',
    description:
      'Kolik naspořit podle pravidla 4 % v korunách, jak dlouho to trvá podle míry úspor, role ETF a české daně. Vzdělávací a nezávislé.',
    url: 'https://etfpruvodce.cz/fire',
    type: 'article',
  },
};

/* Cílová částka = 25× roční výdaje = 300× měsíční výdaje (pravidlo 4 %). */
const TARGET_ROWS: { monthly: number; note: string }[] = [
  { monthly: 25000, note: 'skromnější „lean" život' },
  { monthly: 35000, note: 'běžná domácnost' },
  { monthly: 50000, note: 'komfortní život' },
  { monthly: 75000, note: 'štědrý „fat" rozpočet' },
];

/* Roky do FIRE podle míry úspor (start od nuly, ~5 % reálný výnos, cíl 25× výdaje). */
const SAVINGS_ROWS: { rate: number; years: string }[] = [
  { rate: 10, years: '~51 let' },
  { rate: 20, years: '~37 let' },
  { rate: 30, years: '~28 let' },
  { rate: 40, years: '~22 let' },
  { rate: 50, years: '~17 let' },
  { rate: 60, years: '~12,5 roku' },
  { rate: 70, years: '~8,5 roku' },
];

const czk = (v: number) => v.toLocaleString('cs-CZ');
const mil = (v: number) => (v / 1_000_000).toLocaleString('cs-CZ', { maximumFractionDigits: 1 });

export default async function FireHub() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const faqs = [
    {
      q: 'Kolik peněz potřebuji na FIRE v Česku?',
      a: 'Orientačně 25násobek svých ročních výdajů (pravidlo 4 %). Při výdajích 35 000 Kč měsíčně (420 000 Kč ročně) vychází cíl zhruba na 10,5 milionu Kč. Přesnou částku pro vaše výdaje, inflaci a výnos vám spočítá FIRE kalkulačka.',
    },
    {
      q: 'Funguje pravidlo 4 % i pro české investory?',
      a: 'Matematika je stejná – vychází z historie globálních akcií a dluhopisů. Pro velmi dlouhou rentu (40+ let) nebo opatrnější plán se používá 3–3,5 %, což znamená vyšší cílovou částku. Jde o pravděpodobnostní odhad z minulosti, ne o záruku; osobní situaci probírejte s finančním či daňovým poradcem.',
    },
    {
      q: 'Co rozhoduje o tom, jak rychle FIRE dosáhnu?',
      a: 'Nejvíc míra úspor – tedy jaké procento příjmu odkládáte, ne kolik vyděláváte. Při 50% míře úspor je cesta zhruba 17 let, při 20 % kolem 37 let. Vyšší příjem pomáhá jen tehdy, když se výdaje nezvednou spolu s ním.',
    },
    {
      q: 'Musím danit prodej ETF, když z něj čerpám rentu?',
      a: 'V Česku platí časový test: pokud podíly držíte déle než 3 roky, je zisk z prodeje za splnění zákonných podmínek osvobozen od daně z příjmu. Dividendy se obvykle daní 15 %. Jde o orientační shrnutí – konkrétní situaci si ověřte u daňového poradce.',
    },
    {
      q: 'Jaké ETF se pro cestu k FIRE hodí?',
      a: 'Historicky se osvědčila široce diverzifikovaná, akumulační ETF s nízkým poplatkem (TER) – typicky celosvětový akciový index. Akumulační třída reinvestuje dividendy uvnitř fondu, takže je nemusíte danit každý rok. S blížícím se cílem se část portfolia obvykle přesouvá do stabilnějších dluhopisů.',
    },
    {
      q: 'Co je Coast FIRE a Barista FIRE?',
      a: 'Coast FIRE = máte naspořeno tolik, že i bez dalšího spoření portfolio do důchodu doroste na cílovou částku; dál si vyděláváte jen na běžné výdaje. Barista FIRE = kombinujete částečný pasivní příjem z investic s prací na částečný úvazek. Obojí umožňuje ubrat plyn dřív, než dosáhnete plné nezávislosti.',
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
      { '@type': 'ListItem', position: 2, name: 'FIRE a finanční nezávislost', item: 'https://etfpruvodce.cz/fire' },
    ],
  };

  const TYPES: { icon: typeof Flame; name: string; desc: string }[] = [
    { icon: Sprout, name: 'Lean FIRE', desc: 'Nezávislost se skromným rozpočtem. Nižší cílová částka, ale menší polštář na neočekávané výdaje.' },
    { icon: Gem, name: 'Fat FIRE', desc: 'Komfortní život bez velkého škrtání. Vyšší cílová částka, delší cesta – nebo vyšší míra úspor.' },
    { icon: TrendingUp, name: 'Coast FIRE', desc: 'Naspořeno tolik, že portfolio do důchodu doroste samo. Dál si vyděláváte jen na běžné výdaje.' },
    { icon: Coffee, name: 'Barista FIRE', desc: 'Kombinace částečného pasivního příjmu a práce na částečný úvazek. Volnost dřív než plná renta.' },
  ];

  const TOOLS: { href: string; label: string; desc: string; icon: typeof Wallet }[] = [
    { href: '/fire-kalkulacka', label: 'FIRE kalkulačka', desc: 'Rok dosažení a cílová částka v Kč', icon: Flame },
    { href: '/investicni-kalkulacka', label: 'Investiční kalkulačka', desc: 'Kolik naroste pravidelné spoření', icon: TrendingUp },
    { href: '/nouzova-rezerva', label: 'Nouzová rezerva', desc: 'Polštář, než začnete investovat', icon: ShieldCheck },
    { href: '/monte-carlo', label: 'Monte Carlo', desc: 'Pravděpodobnost úspěchu renty', icon: LineChart },
    { href: '/backtest', label: 'Backtest portfolia', desc: 'Jak by strategie prošla krizemi', icon: Scale },
    { href: '/kurzovy-dopad', label: 'Kurzový dopad', desc: 'Vliv kurzu koruny na výnos', icon: Coins },
  ];

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
          <span className="text-slate-600">FIRE a finanční nezávislost</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Flame className="w-3.5 h-3.5" /> Vzdělávací pilíř · 100% nezávislé
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              FIRE a finanční nezávislost v Česku
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Kolik reálně potřebujete naspořit, abyste mohli žít z výnosů – spočítáno{' '}
              <strong className="text-white">v korunách</strong>, s českými daněmi a bez marketingových keců.
              Kompletní průvodce od pravidla 4 % přes míru úspor až po roli ETF.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/fire-kalkulacka" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Calculator className="w-4 h-4" /> Spočítat můj rok FIRE
              </Link>
              <Link href="/investicni-kalkulacka" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <TrendingUp className="w-4 h-4" /> Kolik potřebuji naspořit
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Vše v Kč</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Bez provizí a reklam</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* ÚVOD */}
        <section className="pb-9">
          <div className="max-w-3xl text-[15px] text-slate-600 leading-relaxed space-y-3">
            <p>
              <strong className="text-slate-900">FIRE</strong> (Financial Independence, Retire Early – finanční
              nezávislost a předčasná renta) není o zbohatnutí přes noc. Je to stav, kdy vám pasivní příjem z
              naspořeného portfolia pokryje životní náklady, takže <em>práce se stává volbou, ne nutností</em>.
            </p>
            <p>
              Většina zahraničních textů počítá v dolarech a ignoruje české reálie. Tady najdete opak: cílové částky
              přepočtené na koruny, český <strong className="text-slate-900">3letý časový test</strong> u prodeje ETF a
              důraz na to, co skutečně rozhoduje – <strong className="text-slate-900">míru úspor</strong>, ne výši platu.
            </p>
          </div>
        </section>

        {/* 1. PODOBY FIRE */}
        <section className="pb-10">
          <SectionHead title="Co je FIRE a jaké má podoby" desc="Finanční nezávislost není jen „všechno, nebo nic“. Existuje několik stupňů, ze kterých si vyberete podle rozpočtu i chuti pracovat." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TYPES.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{name}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. KOLIK POTŘEBUJETE – pravidlo 4 % */}
        <section className="pb-10">
          <SectionHead title="Kolik potřebujete: pravidlo 4 % v korunách" desc="Nejjednodušší odhad cílové částky. Vezměte roční výdaje a vynásobte je 25 – tolik zhruba potřebujete, aby vám výběr ~4 % ročně uživil rentu." />
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                  <th className="py-3 px-4 text-left font-medium">Měsíční výdaje</th>
                  <th className="py-3 px-4 text-right font-medium">Ročně</th>
                  <th className="py-3 px-4 text-right font-medium">Cílová částka (×25)</th>
                  <th className="py-3 px-4 text-left font-medium">Typ rozpočtu</th>
                </tr>
              </thead>
              <tbody>
                {TARGET_ROWS.map(({ monthly, note }) => (
                  <tr key={monthly} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4 font-medium text-slate-800 tabular-nums">{czk(monthly)} Kč</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600">{czk(monthly * 12)} Kč</td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold text-teal-700">{mil(monthly * 300)} mil. Kč</td>
                    <td className="py-3 px-4 text-slate-500">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Pravidlo 4 % vychází z historických dat globálních akcií a dluhopisů (tzv. Trinity Study). Pro velmi dlouhou
            rentu (40+ let) nebo opatrnější plán použijte 3–3,5 %, což cílovou částku zvedne. Není to záruka – jen
            pravděpodobnostní odhad z minulosti.
          </p>
          <div className="mt-4">
            <Link href="/fire-kalkulacka" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800 transition-colors">
              <Calculator className="w-4 h-4" /> Spočítat přesně pro moje výdaje
            </Link>
          </div>
        </section>

        {/* 3. MÍRA ÚSPOR */}
        <section className="pb-10">
          <SectionHead title="Co rozhoduje: míra úspor, ne výše platu" desc="Nejsilnější páka k FIRE je poměr toho, co odložíte, k tomu, co vyděláte. Čím vyšší míra úspor, tím kratší cesta – nezávisle na výši příjmu." />
          <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr] items-start">
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                    <th className="py-3 px-4 text-left font-medium">Míra úspor</th>
                    <th className="py-3 px-4 text-right font-medium">Přibližně do FIRE</th>
                  </tr>
                </thead>
                <tbody>
                  {SAVINGS_ROWS.map(({ rate, years }) => (
                    <tr key={rate} className="border-b border-slate-100 last:border-0">
                      <td className="py-2.5 px-4">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden hidden sm:inline-block"><span className="block h-full bg-teal-500" style={{ width: `${rate}%` }} /></span>
                          <span className="font-medium text-slate-800 tabular-nums">{rate} %</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-slate-800">{years}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-[15px] text-slate-600 leading-relaxed space-y-3">
              <p>
                Tabulka předpokládá spoření <strong className="text-slate-900">od nuly</strong>, průměrný{' '}
                <strong className="text-slate-900">reálný výnos ~5 % ročně</strong> a cíl ve výši 25násobku výdajů. Kdo
                odkládá polovinu příjmu, je u cíle zhruba za 17 let; kdo pětinu, potřebuje skoro dvakrát tak dlouho.
              </p>
              <p>
                Proč tak velký rozdíl? Vyšší míra úspor zároveň <em>snižuje výdaje</em> (potřebujete menší cílovou částku)
                a <em>zvyšuje vklady</em> (rostete rychleji). Působí tedy na obě strany rovnice najednou.
              </p>
              <p className="text-sm text-slate-500">
                <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
                Jde o modelové zjednodušení. Přesnou trajektorii pro váš příjem, vklady a inflaci si nechte spočítat.
              </p>
            </div>
          </div>
        </section>

        {/* 4. ROLE ETF */}
        <section className="pb-10">
          <SectionHead title="Role ETF na cestě k FIRE" desc="Motor, který má portfolio dovést k cílové částce. Rozhodují diverzifikace, nízké náklady a čas – ne trefování jednotlivých akcií." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              [Target, 'Široká diverzifikace', 'Celosvětový akciový index drží tisíce firem najednou – jedna krachující společnost portfoliem nezahýbe.'],
              [Percent, 'Nízký poplatek (TER)', 'Každé procento ročního poplatku ukrojí za desítky let velkou část konečné částky. U ETF bývá TER pod 0,25 %.'],
              [PiggyBank, 'Akumulace = klid s daněmi', 'Akumulační třída reinvestuje dividendy uvnitř fondu, takže je neřešíte v daňovém přiznání každý rok.'],
            ] as [typeof Target, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors"><TrendingUp className="w-4 h-4" /> Srovnat ETF fondy</Link>
            <Link href="/portfolio-strategie" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors"><Scale className="w-4 h-4" /> Modelová portfolia</Link>
          </div>
        </section>

        {/* 5. ČESKÉ DANĚ */}
        <section className="pb-10">
          <SectionHead title="České daně a FIRE (orientačně)" desc="Než začnete z portfolia čerpat, vyplatí se znát základní česká pravidla. Nejde o daňové poradenství – konkrétní situaci řešte s odborníkem." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              [Landmark, '3letý časový test', 'Držíte-li podíly ETF déle než 3 roky, je zisk z prodeje za splnění zákonných podmínek osvobozen od daně z příjmu.'],
              [Coins, 'Dividendy 15 %', 'Vyplácené dividendy se obvykle daní 15 %. Akumulační fondy je reinvestují uvnitř, takže je každoročně neřešíte.'],
              [ShieldCheck, 'Plánujte čerpání', 'Při rentě se hodí čerpat tak, aby prodávané podíly splňovaly časový test – tím legálně snižujete daňovou zátěž.'],
            ] as [typeof Landmark, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. NÁSTROJE */}
        <section className="pb-10">
          <SectionHead title="Nástroje pro tvůj plán" desc="Vše, co potřebujete k sestavení a otestování vlastní cesty k nezávislosti – zdarma a v korunách." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map(({ href, label, desc, icon: Icon }) => (
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
          <SectionHead title="Časté otázky o FIRE" />
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
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Obsah tvoříme nezávisle, na základě veřejných dat a doložené metodiky – bez provizí a placeného pořadí.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Obsah má vzdělávací charakter, není investičním ani daňovým doporučením. Uvedené výpočty jsou modelové a orientační. Aktualizováno {dateStr}.</p>
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="pb-12">
          <InvestmentDisclaimer />
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">ETF průvodce.cz</span>
          <p className="max-w-md text-center sm:text-right leading-relaxed">Obsah má vzdělávací charakter a nepředstavuje investiční doporučení. Minulá výkonnost nezaručuje budoucí výnosy.</p>
        </div>
      </footer>
    </div>
  );
}
