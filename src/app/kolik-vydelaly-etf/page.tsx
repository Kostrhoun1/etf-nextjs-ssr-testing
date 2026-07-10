import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, Database, Calculator, Wallet, ShieldCheck,
  Clock, AlertTriangle, TrendingDown, LineChart, CheckCircle2, Flame,
  Sprout, Timer, Receipt,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Kolik vydělaly ETF a akcie: ze 100 000 Kč čtyřnásobek za 18 let',
  description:
    'Kolik reálně vydělají ETF a světové akcie? Ze 100 000 Kč přibližně čtyřnásobek za ~18 let – ale cestou přes propady −50 % (2008), −34 % (covid) a −26 % (2022). A proč na desetiletém horizontu skončilo 100 % období v plusu. Orientačně, v korunách.',
  alternates: { canonical: '/kolik-vydelaly-etf' },
  openGraph: {
    title: 'Kolik vydělaly ETF a akcie: ze 100 000 Kč čtyřnásobek za 18 let',
    description:
      'Kolik reálně vydělají ETF? Ze 100 000 Kč přibližně čtyřnásobek za ~18 let – ale cestou přes −50 % v roce 2008. A proč na 10 letech skončilo 100 % období v plusu. Vzdělávací, nezávislé.',
    url: 'https://etfpruvodce.cz/kolik-vydelaly-etf',
    type: 'article',
  },
};

export default async function KolikVydelalyEtf() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

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
