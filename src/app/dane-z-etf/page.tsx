import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, Database, Info, Calculator, Wallet, Coins,
  Landmark, Scale, ShieldCheck, HelpCircle, Clock, Receipt, Percent, PiggyBank,
  CheckCircle2, AlertTriangle, BookOpen,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Daně z ETF v Česku: kdy platíte a kdy ne (2026)',
  description:
    'Přehledný český průvodce zdaněním ETF: časový test (3 roky), hodnotový test do 100 000 Kč, strop 40 milionů, daň z dividend 15 % a odečet přes DIP. Orientačně, v korunách, srozumitelně.',
  alternates: { canonical: '/dane-z-etf' },
  openGraph: {
    title: 'Daně z ETF v Česku: kdy platíte a kdy ne (2026)',
    description:
      'Časový test, hodnotový test, strop 40 mil., dividendy 15 % a DIP – přehledně a v korunách. Vzdělávací, nezávislé.',
    url: 'https://etfpruvodce.cz/dane-z-etf',
    type: 'article',
  },
};

export default async function DaneZEtf() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const faqs = [
    {
      q: 'Musím danit zisk z prodeje ETF?',
      a: 'Záleží na době držby a objemu. Pokud podíly držíte déle než 3 roky (časový test), je zisk z prodeje za splnění zákonných podmínek osvobozen. Osvobozeny jsou také drobné prodeje do 100 000 Kč příjmu za rok (hodnotový test). V roce 2025 platil roční strop 40 milionů Kč na osvobozené příjmy, ten byl ale od roku 2026 pro prodej cenných papírů a podílů zrušen – u ETF tak žádný horní limit osvobození neplatí. Jde o obecné shrnutí – konkrétní situaci ověřte u daňového poradce.',
    },
    {
      q: 'Jak funguje časový test u ETF?',
      a: 'Časový test znamená, že pokud mezi nákupem a prodejem cenného papíru uplynou více než 3 roky, je zisk z prodeje osvobozen od daně z příjmu (za splnění zákonných podmínek). Počítá se od nabytí konkrétních podílů k jejich prodeji – proto se u dlouhodobého investora, který nakupuje a drží, na většinu zisku daň nevztahuje.',
    },
    {
      q: 'Kolik je daň z dividend u ETF?',
      a: 'Vyplácené dividendy podléhají dani 15 %. U zahraničních fondů se řeší v daňovém přiznání s ohledem na smlouvy o zamezení dvojího zdanění. Akumulační fondy dividendy reinvestují uvnitř fondu, takže je investor neřeší v přiznání každý rok – to je pro dlouhodobé zhodnocení daňově jednodušší.',
    },
    {
      q: 'Co je hodnotový test do 100 000 Kč?',
      a: 'Pokud je váš celkový příjem (ne zisk) z prodeje cenných papírů za kalendářní rok do 100 000 Kč, je osvobozen bez ohledu na dobu držby. Hodí se pro drobné prodeje. Pozor: jde o příjem (tržbu), nikoli jen o zisk.',
    },
    {
      q: 'Co je DIP a jak snižuje daně?',
      a: 'DIP (dlouhodobý investiční produkt) je od roku 2024 režim, ve kterém si příspěvky můžete odečíst od základu daně – až 48 000 Kč ročně (společný limit s penzijním a životním pojištěním). Podmínkou je držení produktu alespoň 10 let a zpravidla do 60 let věku; při předčasném ukončení se výhoda dodaňuje. Konkrétní podmínky a nabídku DIP ověřte u svého poskytovatele a daňového poradce.',
    },
    {
      q: 'Danit ETF je složité – kde si to ověřím?',
      a: 'Tato stránka je vzdělávací shrnutí, ne daňové poradenství. Daňová pravidla se mění a každá situace má svá specifika. Před podáním přiznání se vyplatí ověřit aktuální znění zákona a poradit se s daňovým poradcem.',
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
      { '@type': 'ListItem', position: 2, name: 'Daně z ETF', item: 'https://etfpruvodce.cz/dane-z-etf' },
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
          <span className="text-slate-600">Daně z ETF</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Receipt className="w-3.5 h-3.5" /> Vzdělávací pilíř · aktuální pro rok 2026
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Daně z ETF v Česku: kdy platíte a kdy ne
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Kolik vám z výnosu <strong className="text-white">reálně zůstane po zdanění</strong>. Časový test,
              hodnotový test, strop 40 milionů, dividendy i odečet přes DIP – přehledně, v korunách a bez paniky.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/investicni-kalkulacka" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Calculator className="w-4 h-4" /> Spočítat výnos v Kč
              </Link>
              <Link href="/fire" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <TrendingUp className="w-4 h-4" /> Průvodce FIRE
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Vše v Kč</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* UPOZORNĚNÍ – orientační charakter */}
        <section className="pb-8">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>Orientační shrnutí, ne daňové poradenství.</strong> Daňová pravidla se mění a každá situace má svá
              specifika. Před podáním přiznání ověřte aktuální znění zákona a případně se poraďte s daňovým poradcem.
            </p>
          </div>
        </section>

        {/* 1. DVĚ SITUACE */}
        <section className="pb-10">
          <SectionHead title="Dvě situace, kdy se daň vůbec řeší" desc="U ETF přicházejí na řadu daně jen ve dvou okamžicích. Ve zbytku času vaše portfolio jen roste – bez ročního papírování." />
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              [Coins, 'Prodej podílů (kapitálový zisk)', 'Když ETF prodáte se ziskem. Tady rozhoduje doba držby a objem – a právě sem míří časový i hodnotový test.'],
              [PiggyBank, 'Výplata dividend', 'Když fond vyplácí dividendy v hotovosti. Ty se daní 15 %. Akumulační fondy je řeší za vás uvnitř fondu.'],
            ] as [typeof Coins, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. ČASOVÝ TEST */}
        <section className="pb-10">
          <SectionHead title="Časový test: držte 3 roky a zisk je osvobozen" desc="Nejdůležitější pravidlo pro dlouhodobého investora – a hlavní důvod, proč se ETF vyplatí držet, ne překlápět." />
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0"><Clock className="w-5 h-5" /></span>
              <div className="text-[15px] text-slate-600 leading-relaxed space-y-3">
                <p>
                  Pokud mezi <strong className="text-slate-900">nákupem a prodejem</strong> podílů uplynou{' '}
                  <strong className="text-slate-900">více než 3 roky</strong>, je zisk z prodeje za splnění zákonných
                  podmínek <strong className="text-emerald-700">osvobozen od daně z příjmu</strong>. Počítá se od nabytí
                  konkrétních podílů k jejich prodeji.
                </p>
                <p>
                  Pro disciplinovaného investora, který nakoupí široké ETF a nechá ho ležet, to znamená, že se na většinu
                  zisku daň nevztahuje. Čím méně zbytečně překlápíte, tím čistší je daňový výsledek.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HODNOTOVÝ TEST + 4. STROP – dvě karty vedle sebe */}
        <section className="pb-10">
          <SectionHead title="Dvě věci navíc, které stojí za zapamatování" desc="Kromě časového testu existuje osvobození pro drobné prodeje. A dobrá zpráva pro rok 2026: dřívější strop 40 milionů byl u cenných papírů zrušen." />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Scale className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Hodnotový test: do 100 000 Kč / rok</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Je-li váš celkový <strong className="text-slate-800">příjem</strong> (tržba, ne jen zisk) z prodeje
                cenných papírů za kalendářní rok do <strong className="text-slate-800">100 000 Kč</strong>, je osvobozen
                bez ohledu na dobu držby. Hodí se pro drobné prodeje.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 mb-3"><CheckCircle2 className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Strop 40 mil. Kč: od 2026 u ETF zrušen</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                V roce 2025 platil roční strop <strong className="text-slate-800">40 milionů Kč</strong> na osvobozené
                příjmy z prodeje. Od <strong className="text-slate-800">1. 1. 2026</strong> byl pro prodej cenných papírů
                a podílů zrušen – u ETF tak osvobození po splnění časového testu opět neomezuje žádný horní limit.
              </p>
            </div>
          </div>
        </section>

        {/* 5. DIVIDENDY */}
        <section className="pb-10">
          <SectionHead title="Dividendy: 15 % a proč je akumulace jednodušší" desc="Druhá situace, kdy se daň objeví. Volba mezi akumulačním a distribučním fondem tu má přímý daňový dopad." />
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              [CheckCircle2, 'Akumulační fond (Acc)', 'Dividendy reinvestuje uvnitř fondu. Neřešíte je v přiznání každý rok a celý výnos se schová pod tříletý časový test. Pro dlouhodobé zhodnocení daňově čistší.', 'text-emerald-600 bg-emerald-50 border-emerald-100'],
              [Percent, 'Distribuční fond (Dist)', 'Vyplácí dividendy v hotovosti na účet. Ty se daní 15 %; u zahraničních fondů se řeší v přiznání s ohledem na smlouvy o zamezení dvojího zdanění.', 'text-teal-700 bg-teal-50 border-slate-200'],
            ] as [typeof CheckCircle2, string, string, string][]).map(([Icon, t, d, cls]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className={`flex items-center justify-center w-10 h-10 rounded-lg border mb-3 ${cls}`}><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <Link href="/akumulacni-vs-distribucni-etf" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800">
            Podrobně: Akumulační vs. distribuční ETF – který zvolit <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* 6. DIP */}
        <section className="pb-10">
          <SectionHead title="DIP: daňový odečet až 48 000 Kč ročně" desc="Od roku 2024 lze do ETF investovat i v režimu dlouhodobého investičního produktu se státní daňovou podporou." />
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 shrink-0"><Landmark className="w-5 h-5" /></span>
              <div className="text-[15px] text-slate-600 leading-relaxed space-y-3">
                <p>
                  <strong className="text-slate-900">DIP (dlouhodobý investiční produkt)</strong> umožňuje odečíst
                  příspěvky od základu daně – až <strong className="text-slate-900">48 000 Kč ročně</strong> (společný
                  limit s penzijním a životním pojištěním). Při 15% dani to znamená až 7 200 Kč zpět ročně.
                </p>
                <p>
                  Podmínkou je držení zpravidla alespoň <strong className="text-slate-900">10 let</strong> a do 60 let
                  věku; při předčasném ukončení se výhoda dodaňuje. Zda a jaké ETF lze v DIP držet, závisí na konkrétním
                  poskytovateli – ověřte si nabídku i podmínky předem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. NÁSTROJE */}
        <section className="pb-10">
          <SectionHead title="Spočítejte si to v korunách" desc="Než začnete řešit daně, vyplatí se vědět, o jaké částky vůbec jde. Naše kalkulačky počítají rovnou v korunách." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ['/investicni-kalkulacka', 'Investiční kalkulačka', 'Kolik naspoříte pravidelným vkladem', TrendingUp],
              ['/fire', 'Průvodce FIRE', 'Kolik potřebujete k finanční nezávislosti', TrendingUp],
              ['/kalkulacka', 'Kalkulačka poplatků', 'Dopad TER na výnos za desítky let', Percent],
              ['/srovnani', 'Srovnávač ETF', 'Akum. vs distr., TER a výnosy v Kč', Scale],
              ['/kde-koupit', 'Kde koupit ETF', 'Přehled brokerů a platforem', Landmark],
              ['/pruvodce', 'Co jsou ETF', 'Základy pro úplné začátečníky', BookOpen],
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

        {/* 8. FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky o daních z ETF" />
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
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Vzdělávací shrnutí, není daňovým ani investičním poradenstvím. Uvedená pravidla jsou orientační a mohou se měnit. Aktualizováno {dateStr}.</p>
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
