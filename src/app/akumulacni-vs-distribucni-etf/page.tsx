import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, Database, Info, Calculator, Wallet, Coins,
  Landmark, Scale, ShieldCheck, HelpCircle, Repeat, Banknote, Percent,
  CheckCircle2, BookOpen,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Akumulační vs. distribuční ETF: který je pro vás lepší?',
  description:
    'Akumulační (Acc), nebo distribuční (Dist) ETF? Vysvětlíme rozdíl, dopad na daně a složené úročení i to, který se hodí pro fázi spoření a který pro rentu. Přehledně a v korunách.',
  alternates: { canonical: '/akumulacni-vs-distribucni-etf' },
  openGraph: {
    title: 'Akumulační vs. distribuční ETF: který je pro vás lepší?',
    description:
      'Rozdíl mezi Acc a Dist, dopad na daně a složené úročení, a který zvolit pro spoření vs. rentu. Vzdělávací a nezávislé.',
    url: 'https://etfpruvodce.cz/akumulacni-vs-distribucni-etf',
    type: 'article',
  },
};

export default async function AccVsDist() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const faqs = [
    {
      q: 'Jaký je rozdíl mezi akumulačním a distribučním ETF?',
      a: 'Akumulační fond (Acc) dividendy od firem automaticky reinvestuje zpět uvnitř fondu – neuvidíte je na účtu, ale zvyšují hodnotu podílu. Distribuční fond (Dist) vám dividendy vyplácí v hotovosti na účet, obvykle čtvrtletně nebo ročně. Samotné portfolio firem je u obou tříd stejné; liší se jen zacházení s dividendami.',
    },
    {
      q: 'Který je lepší na dlouhodobé spoření?',
      a: 'Ve fázi spoření bývá výhodnější akumulační (Acc). Dividendy se reinvestují automaticky (nemusíte to řešit ručně ani platit poplatek za nákup), naplno pracuje složené úročení a v Česku navíc odpadá každoroční danění vyplácených dividend. Vše se schová pod tříletý časový test.',
    },
    {
      q: 'Kdy má smysl distribuční ETF?',
      a: 'Když chcete z portfolia čerpat pravidelný pasivní příjem, aniž byste museli prodávat podíly – typicky v rentě nebo při FIRE. Distribuční fond posílá hotovost sám. Někomu také vyhovuje psychologicky vidět reálný příjem z investic.',
    },
    {
      q: 'Jak akumulační vs. distribuční ovlivní daně v Česku?',
      a: 'Vyplácené dividendy (distribuční fond) se daní 15 %. U akumulačního fondu se dividendy reinvestují uvnitř a investor je v přiznání každoročně neřeší – zdanění se odkládá na případný prodej, který je po 3 letech držby za splnění zákonných podmínek osvobozen. Pro dlouhodobé zhodnocení je akumulační daňově jednodušší. Jde o obecné shrnutí, ne daňové poradenství.',
    },
    {
      q: 'Poznám třídu fondu podle názvu?',
      a: 'Většinou ano – v názvu fondu bývá zkratka „Acc" (accumulating, akumulační) nebo „Dist" / „D" (distributing, distribuční). Jistotu dá karta fondu. V našem srovnávači u každého ETF vidíte štítek ACC/DIST a můžete podle něj i filtrovat.',
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
      { '@type': 'ListItem', position: 2, name: 'Akumulační vs. distribuční ETF', item: 'https://etfpruvodce.cz/akumulacni-vs-distribucni-etf' },
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
          <span className="text-slate-600">Akumulační vs. distribuční ETF</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Repeat className="w-3.5 h-3.5" /> Vzdělávací pilíř
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Akumulační vs. distribuční ETF: který zvolit?
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Jedno z prvních rozhodnutí každého investora do ETF. Vysvětlíme rozdíl, jeho dopad na{' '}
              <strong className="text-white">daně i složené úročení</strong> a poradíme, který se hodí pro fázi
              spoření a který pro rentu.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Scale className="w-4 h-4" /> Filtrovat podle typu výplaty
              </Link>
              <Link href="/investicni-kalkulacka" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <Calculator className="w-4 h-4" /> Spočítat složené úročení
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Vše v Kč</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Nezávislé a nekomerční</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* ÚVOD */}
        <section className="pb-9">
          <div className="max-w-3xl text-[15px] text-slate-600 leading-relaxed space-y-3">
            <p>
              Když si vyberete konkrétní index (třeba celosvětový nebo S&amp;P 500), narazíte často na{' '}
              <strong className="text-slate-900">dvě verze téhož fondu</strong> – akumulační a distribuční. Drží stejné
              firmy, mají podobný poplatek. Liší se jediným: <strong className="text-slate-900">co dělají s dividendami</strong>,
              které jim firmy vyplácejí.
            </p>
            <p>A právě tenhle detail rozhoduje o vašich daních i o tom, jak rychle vám portfolio poroste.</p>
          </div>
        </section>

        {/* 1. DVĚ TŘÍDY */}
        <section className="pb-10">
          <SectionHead title="Dvě třídy, jeden fond" desc="Rozdíl je jen v zacházení s dividendami – portfolio firem uvnitř je u obou stejné." />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 mb-3"><Repeat className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Akumulační (Acc)</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Dividendy automaticky <strong className="text-slate-800">reinvestuje uvnitř fondu</strong>. Neuvidíte je na
                účtu, ale zvyšují hodnotu vašeho podílu. Peníze pracují dál bez vašeho zásahu.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Banknote className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Distribuční (Dist)</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Dividendy vám <strong className="text-slate-800">vyplácí v hotovosti</strong> na účet, obvykle čtvrtletně
                nebo ročně. Reálný pasivní příjem, se kterým si naložíte, jak chcete.
              </p>
            </div>
          </div>
        </section>

        {/* 2. SROVNÁVACÍ TABULKA */}
        <section className="pb-10">
          <SectionHead title="Srovnání bod po bodu" desc="Jak se obě třídy liší v tom, na čem investorovi reálně záleží." />
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                  <th className="py-3 px-4 text-left font-medium">Hledisko</th>
                  <th className="py-3 px-4 text-left font-medium">Akumulační (Acc)</th>
                  <th className="py-3 px-4 text-left font-medium">Distribuční (Dist)</th>
                </tr>
              </thead>
              <tbody className="[&_td]:py-3 [&_td]:px-4 [&_td]:align-top [&_tr]:border-b [&_tr]:border-slate-100">
                <tr>
                  <td className="font-medium text-slate-500">Dividendy</td>
                  <td className="text-slate-800">Reinvestují se uvnitř fondu</td>
                  <td className="text-slate-800">Vyplácejí se na účet</td>
                </tr>
                <tr>
                  <td className="font-medium text-slate-500">Složené úročení</td>
                  <td className="text-emerald-700 font-medium">Automatické, naplno</td>
                  <td className="text-slate-800">Jen když dividendy sami reinvestujete</td>
                </tr>
                <tr>
                  <td className="font-medium text-slate-500">Daně (ČR)</td>
                  <td className="text-emerald-700 font-medium">Dividendy neřešíte každý rok</td>
                  <td className="text-slate-800">Vyplacené dividendy daníte 15 %</td>
                </tr>
                <tr>
                  <td className="font-medium text-slate-500">Pasivní příjem</td>
                  <td className="text-slate-800">Ne (musíte prodat podíl)</td>
                  <td className="text-emerald-700 font-medium">Ano, hotovost sama</td>
                </tr>
                <tr>
                  <td className="font-medium text-slate-500">Administrativa</td>
                  <td className="text-emerald-700 font-medium">Minimální</td>
                  <td className="text-slate-800">Hlídání a danění výplat</td>
                </tr>
                <tr className="last:border-0">
                  <td className="font-medium text-slate-500">Hodí se pro</td>
                  <td className="text-slate-800">Fázi spoření a růstu</td>
                  <td className="text-slate-800">Rentu a pasivní příjem</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. DAŇOVÝ ÚHEL */}
        <section className="pb-10">
          <SectionHead title="Proč je akumulace daňově jednodušší" desc="V Česku má volba třídy přímý daňový dopad – a akumulační obvykle vyhrává na klid." />
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0"><ShieldCheck className="w-5 h-5" /></span>
              <div className="text-[15px] text-slate-600 leading-relaxed space-y-3">
                <p>
                  Vyplacené dividendy (distribuční fond) se daní <strong className="text-slate-900">15 %</strong>. U
                  akumulačního fondu se dividendy reinvestují uvnitř a v přiznání je{' '}
                  <strong className="text-slate-900">každý rok neřešíte</strong> – zdanění se odkládá na případný prodej,
                  který je po <strong className="text-slate-900">3 letech držby</strong> za splnění zákonných podmínek
                  osvobozen. Pro dlouhodobé zhodnocení tak akumulační třída znamená méně papírování i nižší reálnou zátěž.
                </p>
              </div>
            </div>
            <Link href="/dane-z-etf" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800">
              Kompletní přehled: Daně z ETF v Česku <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 4. KTERÝ ZVOLIT */}
        <section className="pb-10">
          <SectionHead title="Který zvolit? Jednoduché vodítko" desc="Rozhoduje hlavně to, v jaké fázi jste – jestli majetek budujete, nebo z něj čerpáte." />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 mb-3"><Repeat className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Spoříte a budujete majetek → Acc</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Chcete maximum růstu, minimum starostí a odklad daní. Akumulační reinvestuje za vás a nechá pracovat
                složené úročení. Nejčastější volba pro dlouhodobé investory.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 mb-3"><Banknote className="w-5 h-5" /></span>
              <p className="font-semibold text-slate-900">Čerpáte rentu / pasivní příjem → Dist</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Chcete pravidelnou hotovost, aniž byste museli prodávat podíly. Distribuční fond posílá výplaty sám –
                vhodné v rentě, při FIRE nebo když chcete reálný příjem vidět.
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            Není to neodvolatelné rozhodnutí – během spoření lze mít Acc a před rentou postupně přejít na Dist. Obě třídy
            drží stejný index, takže neměníte svou investiční strategii, jen způsob výplaty.
          </p>
        </section>

        {/* 5. NÁSTROJE */}
        <section className="pb-10">
          <SectionHead title="Vyberte si konkrétní fond" desc="V našem srovnávači u každého ETF vidíte štítek ACC/DIST a můžete podle typu výplaty filtrovat." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ['/srovnani', 'Srovnávač ETF', 'Filtrujte podle typu výplaty (ACC/DIST)', Scale],
              ['/dane-z-etf', 'Daně z ETF', 'Časový test, dividendy 15 %, DIP', Landmark],
              ['/investicni-kalkulacka', 'Investiční kalkulačka', 'Síla složeného úročení v Kč', TrendingUp],
              ['/fire', 'Průvodce FIRE', 'Kdy z portfolia čerpat rentu', BookOpen],
              ['/zebricky', 'Žebříčky ETF', 'Vybrané nejlepší fondy v kategoriích', TrendingUp],
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

        {/* 6. FAQ */}
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
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Vzdělávací obsah, není investičním ani daňovým doporučením. Aktualizováno {dateStr}.</p>
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
          <p className="max-w-md text-center sm:text-right leading-relaxed">Obsah má vzdělávací charakter a nepředstavuje investiční ani daňové doporučení.</p>
        </div>
      </footer>
    </div>
  );
}
