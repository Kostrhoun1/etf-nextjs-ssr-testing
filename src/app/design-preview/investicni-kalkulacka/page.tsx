import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, CalendarDays, Database, Info, Calculator,
  Coins, Wallet, Scale, Landmark, ShieldCheck, Crown, HelpCircle, BookOpen,
  PiggyBank, Clock, Repeat,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InfoTip from '@/components/design-preview/InfoTip';
import InvesticniKalkulackaWidget from '@/components/design-preview/InvesticniKalkulackaWidget';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Investiční kalkulačka: složené úročení a pravidelné investování',
  description:
    'Spočítejte, na kolik narostou vaše investice díky složenému úročení. Zadejte jednorázový i pravidelný vklad, dobu a výnos – výsledek v korunách včetně grafu.',
};

export default function InvesticniKalkulackaPreview() {
  const today = new Date();
  const dateStr = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  /* ---------- FAQ + JSON-LD ---------- */
  const faqs = [
    {
      q: 'Co je složené úročení a proč na něm tolik záleží?',
      a: 'Složené úročení znamená, že výnosy nedostáváte jen z původně vložené částky, ale i z dříve připsaných výnosů. Příklad: 100 000 Kč při 7 % ročně je po roce 107 000 Kč; druhý rok se počítá 7 % už ze 107 000 Kč, tedy 114 490 Kč. Čím delší horizont, tím větší podíl konečné hodnoty tvoří výnosy z výnosů – proto je čas u investování zásadní.',
    },
    {
      q: 'Jak kalkulačka počítá pravidelné investování?',
      a: 'U měsíčního vkladu kalkulačka simuluje rok po měsících: každý měsíc přičte váš vklad a poté na celou hodnotu portfolia aplikuje měsíční výnos (roční výnos dělený dvanácti). U ročního vkladu přičte vklad jednou za rok a aplikuje celý roční výnos. Výsledek je tak srovnatelný s reálným pravidelným investováním.',
    },
    {
      q: 'Jaký výnos mám do kalkulačky zadat?',
      a: 'Globální akciové indexy (například MSCI World nebo S&P 500) historicky dosahovaly zhruba 7–10 % ročně před inflací. Po zohlednění inflace bývá reálný výnos nižší, kolem 4–7 % ročně. Výchozí hodnota 7 % je realistický střed, konkrétní budoucí výnos ale nikdo nezaručí.',
    },
    {
      q: 'Počítá kalkulačka s daní z výnosů?',
      a: 'Volitelně ano. V Česku platí časový test: při držení ETF déle než 3 roky je zisk z prodeje osvobozen (0 % daň). Proto je výchozí daň 0 %. Pokud obchodujete aktivně a držíte kratší dobu, můžete zadat 15 % (případně 23 % u vyšších příjmů) a kalkulačka sníží konečnou hodnotu o daň ze zisku.',
    },
    {
      q: 'Počítá kalkulačka s inflací a poplatky?',
      a: 'Ne. Kalkulačka pracuje s nominálním výnosem a nezahrnuje inflaci ani poplatky fondu (TER) či brokera. Dopad poplatků na dlouhodobý výnos si můžete spočítat v samostatné kalkulačce poplatků. Reálnou kupní sílu zohledníte tak, že do výnosu zadáte nižší, reálné číslo.',
    },
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://www.etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Kalkulačky', item: 'https://www.etfpruvodce.cz/kalkulacky' },
      { '@type': 'ListItem', position: 3, name: 'Investiční kalkulačka', item: 'https://www.etfpruvodce.cz/kalkulacky/investicni-kalkulacka' },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
            </span>
            ETF průvodce
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/design-preview/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/design-preview/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/design-preview/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/design-preview/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/design-preview/kalkulacky" className="text-teal-700 font-medium">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/design-preview/srovnani" className="hidden sm:inline-flex rounded-lg border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">Srovnávač</Link>
            <HeaderSearch />
            <Link href="/design-preview/kalkulacky" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Kalkulačky</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/design-preview/kalkulacky" className="hover:text-slate-600">Kalkulačky</Link>
          <span>/</span>
          <span className="text-slate-600">Investiční kalkulačka</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Investiční kalkulačka</h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Spočítejte, na kolik narostou vaše peníze díky{' '}
                  <InfoTip label="Výnosy se reinvestují a samy dál vydělávají – úrok z úroku. Čím delší horizont, tím silnější efekt.">složenému úročení</InfoTip>
                  {' '}– jednorázový i pravidelný vklad, v přepočtu na koruny.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/design-preview/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                  <span className="inline-flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> Výsledky v korunách</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href="#kalkulacka" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">Spustit kalkulačku</Link>
                  <Link href="/design-preview/srovnani" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Najít vhodný ETF</Link>
                </div>
              </div>

              {/* Mini-vysvětlení principu */}
              <div className="mt-6 md:mt-0 md:w-72 shrink-0 grid grid-cols-3 md:grid-cols-1 gap-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Vstupujete</p>
                  <p className="text-lg font-bold tabular-nums">Vklad + výnos</p>
                  <p className="text-xs text-slate-400">jednorázově i pravidelně</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Pracuje pro vás</p>
                  <p className="text-lg font-bold tabular-nums text-emerald-400">Úrok z úroku</p>
                  <p className="text-xs text-slate-400">složené úročení</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Vidíte</p>
                  <p className="text-lg font-bold tabular-nums">Vklad vs. zisk</p>
                  <p className="text-xs text-slate-400">graf + hodnoty v Kč</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROČ NA SLOŽENÉM ÚROČENÍ ZÁLEŽÍ – edukace NAD kalkulačkou */}
        <section className="pb-10">
          <SectionHead title="Proč funguje pravidelné investování" desc="Krátké vysvětlení principu, než si spočítáte vlastní případ." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Pravidelné investování spojuje dvě síly: <strong className="text-slate-900">disciplínu</strong> (vkládáte stejnou
              částku bez ohledu na náladu trhu) a <strong className="text-slate-900">složené úročení</strong> (výnosy se
              reinvestují a samy dál vydělávají). Výsledek roste nejdřív pomalu, ale s časem zrychluje.
            </p>

            <div className="mt-4 rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-900 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Čím dřív začnete, tím větší podíl konečné hodnoty tvoří <strong>výnosy z výnosů</strong>, ne vaše vklady.</span>
            </div>
          </div>
        </section>

        {/* KALKULAČKA */}
        <section id="kalkulacka" className="pb-10 scroll-mt-16">
          <SectionHead title="Spočítejte si svůj výnos" desc="Zadejte vklady, dobu a očekávaný roční výnos. Výsledek i graf se přepočítají hned." />
          <InvesticniKalkulackaWidget />
        </section>

        {/* CO JE SLOŽENÉ ÚROČENÍ – edukace vetkaná */}
        <section className="pb-10">
          <SectionHead title="Co je složené úročení" desc="Princip, který se schovává za každým číslem v kalkulačce." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Složené úročení</strong> znamená, že výnosy nedostáváte jen z původního
              vkladu, ale i z dříve připsaných výnosů. Příklad v korunách:{' '}
              <strong className="text-slate-900">100 000 Kč při 7 % p.a.</strong> je po roce 107 000 Kč; druhý rok se 7 %
              počítá už ze 107 000 Kč = 114 490 Kč. Rozdíl se každý rok zvětšuje.
            </p>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {([
                [Repeat, 'Výnos z výnosů', 'Připsaný výnos se reinvestuje a sám dál vydělává – ne jen původní vklad.'],
                [Clock, 'Čas je klíčový', 'Efekt se zesiluje s délkou horizontu. Dvojnásobek let neznamená dvojnásobek, ale výrazně víc.'],
                [PiggyBank, 'Pravidelnost vyhrává', (
                  <>
                    Důležitější než výše vkladu je vytrvalost.{' '}
                    <InfoTip label="Pravidelné investování stejné částky v čase rozkládá nákupy do různých cen a snižuje riziko špatného načasování.">Pravidelné vklady</InfoTip>
                    {' '}rozkládají riziko načasování.
                  </>
                )],
              ] as [typeof Repeat, string, ReactNode][]).map(([Icon, t, d]) => (
                <div key={t} className="rounded-lg bg-slate-50 p-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-teal-700 border border-slate-200 mb-3"><Icon className="w-4 h-4" /></span>
                  <p className="font-medium text-slate-900 text-sm">{t}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ČESKÝ DAŇOVÝ ÚHEL */}
        <section className="pb-10">
          <SectionHead title="Výnos a daně v Česku" desc="Co kalkulačka počítá – a co ne." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Kalkulačka pracuje s <strong className="text-slate-900">nominálním výnosem</strong> a nezahrnuje inflaci ani
              poplatky. Daň je volitelná: v Česku platí <strong className="text-slate-900">časový test</strong> – při držení
              ETF déle než 3 roky je zisk z prodeje osvobozen (0 %). Proto je výchozí daň 0 %. Při kratším držení a aktivním
              obchodování se zisk daní 15 %, u vyšších příjmů 23 %.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
              {([
                [Wallet, 'Vklad', 'co sami vložíte'],
                [TrendingUp, 'Výnos', 'zhodnocení trhem'],
                [Scale, 'Daň', 'jen při držení do 3 let'],
              ] as [typeof Wallet, string, string][]).map(([Icon, t, d], i) => (
                <div key={t} className="flex items-stretch sm:items-center gap-2">
                  {i > 0 && <span className="text-slate-300 font-semibold self-center px-0.5">+</span>}
                  <div className="flex-1 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 min-w-[8rem]">
                    <span className="flex items-center gap-1.5 font-medium text-slate-900 text-sm"><Icon className="w-4 h-4 text-teal-700 shrink-0" /> {t}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{d}</span>
                  </div>
                </div>
              ))}
              <span className="text-slate-300 font-semibold self-center px-0.5 hidden sm:inline">=</span>
              <div className="rounded-lg bg-teal-50 border border-teal-200 px-3 py-2.5 min-w-[8rem]">
                <span className="flex items-center gap-1.5 font-medium text-teal-900 text-sm"><Coins className="w-4 h-4 text-teal-700 shrink-0" /> Čistá hodnota</span>
                <span className="block text-xs text-teal-700/80 mt-0.5">to, co vám zůstane</span>
              </div>
            </div>
            <p className="mt-3">
              <Link href="/design-preview/pruvodce" className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium text-sm">
                Více o daních a fungování ETF <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté dotazy" />
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

        {/* TRUST PRUH */}
        <section className="pb-10">
          <div className="grid sm:grid-cols-3 gap-4">
            {([
              [ShieldCheck, 'Nezávislý nástroj', 'Bez placeného pořadí a reklamních doporučení.'],
              [Crown, '12 let praxe ve financích', 'Obsah od jmenného autora, ne anonymně.'],
              [Database, 'Ověřená metodika', `Stejný výpočet jako naše původní kalkulačka. Aktualizováno ${dateStr}.`],
            ] as [typeof ShieldCheck, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Icon className="w-5 h-5" /></span>
                <span><span className="block font-semibold text-sm text-slate-900">{t}</span><span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">{d}</span></span>
              </div>
            ))}
          </div>
        </section>

        {/* POKRAČUJTE DÁL */}
        <section className="pb-10">
          <SectionHead title="Pokračujte dál" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {([
              ['/design-preview/kalkulacka', 'Kalkulačka poplatků', Scale],
              ['/design-preview/srovnani', 'Srovnání ETF', TrendingUp],
              ['/design-preview/kde-koupit', 'Kde koupit ETF', Landmark],
              ['/design-preview/portfolio-strategie', 'Modelová portfolia', PiggyBank],
              ['/design-preview/pruvodce', 'Co jsou ETF', BookOpen],
              ['/design-preview/kalkulacky', 'Další kalkulačky', Calculator],
            ] as [string, string, typeof Scale][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* E-E-A-T patička + zdroje */}
        <section className="pb-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Kalkulačku stavíme nezávisle – výpočet vychází z ověřené metodiky složeného úročení.
                  <Link href="/design-preview/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Metodika: model složeného úročení s měsíční/roční frekvencí vkladu. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Kalkulačka má vzdělávací charakter a pracuje s modelovým konstantním výnosem – skutečné výnosy kolísají a nelze je zaručit.</p>
            </div>
          </div>
        </section>

        {/* DISCLAIMER – úplný konec obsahu */}
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
