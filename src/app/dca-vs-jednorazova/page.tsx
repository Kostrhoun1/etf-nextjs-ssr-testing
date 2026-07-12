import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, Database, Info, Calculator, Wallet, Coins,
  Scale, ShieldCheck, HelpCircle, Clock, LineChart, PiggyBank, BookOpen,
  Brain, CalendarClock,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'DCA vs. jednorázová investice: co říkají data (a co ne)',
  description:
    'Pravidelné investování (DCA), nebo naráz (lump sum)? Data Vanguardu: jednorázová vyhrává ~2/3 času. Ale záleží, jestli máte balík hotovosti, nebo investujete z výplaty. Vysvětlíme rozdíl i psychologii – v korunách.',
  alternates: { canonical: '/dca-vs-jednorazova' },
  openGraph: {
    title: 'DCA vs. jednorázová investice: co říkají data (a co ne)',
    description:
      'Jednorázová vyhrává ~2/3 času, ale rozhoduje, zda máte balík teď, nebo investujete z výplaty. Data + psychologie, vzdělávací a nezávislé.',
    url: 'https://etfpruvodce.cz/dca-vs-jednorazova',
    images: [ogImage({ title: 'DCA vs. jednorázová investice: co říkají data (a co ne)', eyebrow: 'Data vs. psychologie', stat: '~2/3', statLabel: 'času vyhrává jednorázová investice' })],
    type: 'article',
  },
};

export default async function DcaVsJednorazova() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const faqs = [
    {
      q: 'Mám 500 000 Kč z dědictví – naházet do ETF naráz, nebo po částech?',
      a: 'Statisticky je jednorázový vstup lepší zhruba ve dvou třetinách případů (v průměru o ~1–2 % ročně), protože trh většinu času roste. Pokud byste ale nervově neustáli propad hned po vstupu a hrozilo, že v panice prodáte, rozložte investici na 6–12 měsíců. Je to klid za cenu mírně nižšího očekávaného výnosu.',
    },
    {
      q: 'Je pravidelné investování z výplaty horší než jednorázové?',
      a: 'Ne – to je falešné srovnání. Když žádný balík hotovosti nemáte, investování průběžně z příjmu je jediná možnost a je naprosto správné. Debata „naráz vs. postupně" má smysl jen u peněz, které už máte na účtu teď.',
    },
    {
      q: 'Mám počkat, až trh spadne, a pak investovat?',
      a: 'Obvykle prohra. Odkládání investice je samo o sobě skryté časování trhu – a to se dlouhodobě daří málokomu. Trh většinu času roste a nejlepší dny se často schovávají hned za propady, takže kdo čeká „na dně", je většinou propásne.',
    },
    {
      q: 'Kdy naopak vyhraje postupné investování (DCA)?',
      a: 'Když trh krátce po vstupu klesá nebo jde do strany – tehdy postupné nákupy nakoupí levněji než jednorázový vstup. Je to ale menšina období (zhruba třetina) a dopředu se to spolehlivě poznat nedá.',
    },
    {
      q: 'Sníží pravidelné investování mé měnové riziko u amerických ETF?',
      a: 'Částečně ano – rozložením nákupů zprůměrujete i nákupní kurz CZK/USD, nejen cenu akcií. Je to ale vedlejší efekt. U dlouhodobého akciového ETF se měna dlouhodobě sama částečně vyrovnává a měnové zajištění se obvykle nevyplatí.',
    },
    {
      q: 'Jak dlouhé období pro postupné investování zvolit?',
      a: 'Čím delší rozložení, tím víc obětujete z očekávaného výnosu – 36měsíční postupné investování prohrálo s jednorázovým v ~90 % historických období. Pokud už rozkládat kvůli klidu, volte spíš kratší dobu (3–12 měsíců).',
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
      { '@type': 'ListItem', position: 2, name: 'DCA vs. jednorázová investice', item: 'https://etfpruvodce.cz/dca-vs-jednorazova' },
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
          <span className="text-slate-600">DCA vs. jednorázová investice</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <LineChart className="w-3.5 h-3.5" /> Vzdělávací pilíř · data + psychologie
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              DCA vs. jednorázová investice: co říkají data (a co ne)
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Investovat naráz, nebo postupně? Data Vanguardu jsou jasná –{' '}
              <strong className="text-white">jednorázový vstup vyhrává zhruba ve 2/3 případů</strong>. Jenže nejdřív si
              musíte ujasnit, kterou otázku vlastně řešíte. To lidé nejčastěji pletou.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Scale className="w-4 h-4" /> Otestovat na historii (backtest)
              </Link>
              <Link href="/kolik-investovat-mesicne" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <Calculator className="w-4 h-4" /> Kolik investovat měsíčně
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroj: studie Vanguardu</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční</span>
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* 1. KTEROU OTÁZKU ŘEŠÍTE */}
        <section className="pb-10">
          <SectionHead title="Nejdřív: kterou otázku vlastně řešíte?" desc="Tohle rozlišení mění všechno – a většina lidí ho plete dohromady." />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-teal-200 bg-teal-50/40 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-100 text-teal-700 mb-3"><PiggyBank className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Mám balík hotovosti TEĎ</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Dědictví, bonus, prodej bytu. <strong className="text-slate-800">Jen tady má debata „naráz vs. postupně" smysl</strong> –
                a jen tady je jednorázový vstup statisticky lepší. O tom je celý tento článek.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 mb-3"><CalendarClock className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Investuji průběžně z výplaty</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Odkládáte každý měsíc část příjmu. <strong className="text-slate-800">To není strategie k rozhodování</strong> –
                je to jediný způsob, jak investovat peníze, které ještě nemáte. Dělejte to a neřešte.
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Nemá smysl se trápit, že jste „měli investovat naráz", když žádný balík neexistuje. Pravidelné investování
            z příjmu je správné vždy.
          </p>
        </section>

        {/* 2. DATA */}
        <section className="pb-10">
          <SectionHead title="Data: jednorázový vstup statisticky vyhrává" desc="Vanguard to spočítal na desítkách let historie napříč USA, Británií i Austrálií." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              ['~67 %', 'času vyhrála jednorázová investice nad postupným rozložením (Vanguard, US/UK/AU).'],
              ['+1,8 % ročně', 'průměrný náskok jednorázové u portfolia 60/40 za rok (u 100% akcií ~2,2 %).'],
              ['~90 %', 'času vyhrála jednorázová, když se DCA rozložilo na 36 měsíců – čím déle, tím hůř.'],
            ] as [string, string][]).map(([big, d]) => (
              <div key={big} className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-2xl font-bold text-teal-700 tabular-nums">{big}</p>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Důvod je prostý: <strong className="text-slate-700">trh většinu času roste</strong>. Peníze čekající v hotovosti
            = ušlá riziková prémie. Čím dřív jsou investované, tím déle pracují.
          </p>
        </section>

        {/* 3. KDY VYHRAJE DCA */}
        <section className="pb-10">
          <SectionHead title="Kdy naopak vyhraje postupné investování" desc="Menšina období – ale je dobré vědět kdy." />
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="text-[15px] text-slate-600 leading-relaxed space-y-3">
              <p>
                DCA (postupné investování balíku) dopadne líp, když trh <strong className="text-slate-900">krátce po vstupu
                klesá nebo jde do strany</strong> – tehdy postupné nákupy koupí levněji než jednorázový vstup na vrcholu.
                To je ale zhruba jen <strong className="text-slate-900">třetina období</strong> a dopředu se to spolehlivě
                poznat nedá.
              </p>
              <p>
                Vanguard proto DCA doporučuje hlavně investorům s <strong className="text-slate-900">velmi vysokou averzí
                ke ztrátě</strong>, kteří by jinak nechali celý balík ležet v hotovosti. I DCA totiž poráží držení hotovosti
                (v ~69 % případů) – takže když je alternativou „nechat cash ležet", i postupné investování je lepší než nic.
              </p>
            </div>
          </div>
        </section>

        {/* 4. PSYCHOLOGIE */}
        <section className="pb-10">
          <SectionHead title="Čísla nejsou všechno: psychologie" desc="Optimální na papíře ≠ ustojitelné v reálu. A na tom záleží." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              [Brain, 'Averze ke ztrátě ~2:1', 'Bolest ze ztráty je zhruba dvakrát silnější než radost ze stejného zisku. Jednorázový vstup těsně před propadem je psychicky těžký, i když je matematicky lepší.'],
              [ShieldCheck, 'Minimalizace lítosti', 'DCA není o maximálním výnosu, ale o menší lítosti a nižším riziku, že v panice prodáte na dně. Ten klid má reálnou hodnotu.'],
              [Clock, 'Disciplína bez emocí', 'Pravidelná automatická investice odstraňuje rozhodování. Nejlepší strategie je ta, kterou skutečně dodržíte.'],
            ] as [typeof Brain, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Icon className="w-5 h-5" /></span>
                <p className="font-semibold text-slate-900">{t}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Rozhodnutí je tedy kompromis: <strong className="text-slate-700">jednorázová = vyšší očekávaný výnos</strong>,
            postupná = klidnější spánek. Když víte, že byste propad neustáli, klid za pár desetin procenta stojí.
          </p>
        </section>

        {/* 5. ČASOVÁNÍ TRHU */}
        <section className="pb-10">
          <SectionHead title="Nečekejte na pokles (časování trhu)" desc="Nejčastější chyba: „investuji, až to spadne.“ Proč to obvykle prohrává." />
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 md:p-6">
            <div className="text-[15px] text-amber-900/90 leading-relaxed space-y-3">
              <p>
                <strong>Odkládání investice je samo o sobě skrytá forma časování trhu</strong> – a to se dlouhodobě daří
                málokomu. „Cost of waiting": zatímco čekáte na dno, trh vám většinou uteče nahoru.
              </p>
              <p>
                Nejlepší dny na trhu se navíc <strong>schovávají hned za propady</strong> (přes tři čtvrtiny nejlepších dnů
                padne do turbulentních období). Kdo v panice vyskočí ven, propásne odraz. Ilustrativně: vynechání jen ~10
                nejlepších dnů za 20 let dokáže konečný výnos <strong>zhruba půlit</strong>.
              </p>
              <p className="text-sm text-amber-900/70">
                Pointa: <strong>„čas na trhu" poráží „časování trhu".</strong> Čísla o nejlepších dnech jsou ilustrace principu, ne přesný zákon.
              </p>
            </div>
          </div>
        </section>

        {/* 6. ČESKÝ ÚHEL */}
        <section className="pb-10">
          <SectionHead title="Český úhel: a co kurz koruny?" desc="Investujete do amerických (USD) ETF z korunové výplaty – hraje kurz roli?" />
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6 flex items-start gap-3">
            <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 shrink-0"><Coins className="w-5 h-5" /></span>
            <div className="text-[15px] text-slate-600 leading-relaxed space-y-3">
              <p>
                Když investujete pravidelně z české výplaty do světového ETF, děláte postupné investování{' '}
                <strong className="text-slate-900">i na kurzu CZK/USD</strong>, nejen na ceně akcií – vyhnete se vstupu
                celého balíku v jeden nepříznivý den kurzu. Je to ale <strong className="text-slate-900">druhořadý
                efekt</strong> vedle pohybu akciové ceny.
              </p>
              <p>
                Měnové výkyvy se přes dlouhé horizonty <strong className="text-slate-900">samy částečně vyrovnávají</strong>,
                proto se u dlouhodobého akciového portfolia měnové zajištění obvykle nevyplatí. Není důvod kvůli kurzu
                spekulativně čekat. <Link href="/menove-riziko-etf" className="text-teal-700 hover:underline">Víc o měnovém riziku →</Link>
              </p>
            </div>
          </div>
        </section>

        {/* NÁSTROJE */}
        <section className="pb-10">
          <SectionHead title="Spočítejte a otestujte si to" desc="Přestaňte spekulovat a podívejte se na čísla." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ['/backtest', 'Backtest portfolia', 'Jak by strategie prošla historií', Scale],
              ['/kolik-investovat-mesicne', 'Kolik investovat měsíčně', 'Cesta k milionu v Kč', Calculator],
              ['/investicni-kalkulacka', 'Investiční kalkulačka', 'Budoucí hodnota pravidelného vkladu', TrendingUp],
              ['/menove-riziko-etf', 'Měnové riziko', 'Vliv kurzu na korunový výnos', Coins],
              ['/srovnani', 'Srovnávač ETF', 'Vyberte konkrétní fond', Wallet],
              ['/fire', 'Průvodce FIRE', 'Kam ta pravidelná investice směřuje', BookOpen],
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

        {/* FAQ */}
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

        {/* E-E-A-T */}
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
              <p className="flex items-start gap-1.5"><Database className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Zdroje: Vanguard (2012 &amp; 2023) – studie o dollar-cost averaging vs. lump-sum. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Vzdělávací obsah, není investičním doporučením. Historická data nezaručují budoucí výsledky.</p>
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
