import { Metadata } from 'next';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, ArrowRight, User, CalendarDays, Database, Info, Calculator,
  Coins, Wallet, Scale, Landmark, ShieldCheck, Crown, HelpCircle, BookOpen,
  PiggyBank, Percent, FileText, Banknote, ListChecks,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InfoTip from '@/components/design-preview/InfoTip';
import UverovaKalkulackaWidget from '@/components/design-preview/UverovaKalkulackaWidget';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Úvěrová kalkulačka: měsíční splátka a přeplatek spotřebitelského úvěru',
  description:
    'Spočítejte si měsíční splátku spotřebitelského úvěru, celkovou zaplacenou částku a přeplatek na úrocích. Zadejte výši úvěru, sazbu a dobu splácení – výsledek v korunách včetně grafu.',
  robots: { index: false, follow: false },
};

export default function UverovaKalkulackaPreview() {
  const today = new Date();
  const dateStr = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  /* ---------- FAQ + JSON-LD ---------- */
  const faqs = [
    {
      q: 'Jak se počítá měsíční splátka úvěru?',
      a: 'Kalkulačka používá standardní anuitní vzorec: roční úroková sazba se vydělí dvanácti na měsíční sazbu a doba splácení se převede na počet měsíců. Splátka je pak po celou dobu stejná (konstantní), jen se postupně mění její složení – na začátku tvoří většinu úrok, ke konci úmor jistiny.',
    },
    {
      q: 'Jaký je rozdíl mezi úrokovou sazbou a RPSN?',
      a: 'Úroková sazba je cena za půjčené peníze. RPSN (roční procentní sazba nákladů) navíc zahrnuje i poplatky spojené s úvěrem – za sjednání, vedení úvěru nebo povinné pojištění. RPSN je proto vždy vyšší než úrok a lépe vyjadřuje skutečnou cenu úvěru. Při porovnávání nabídek se řiďte RPSN, ne jen úrokem.',
    },
    {
      q: 'Co je to přeplatek úvěru?',
      a: 'Přeplatek je rozdíl mezi tím, co celkem zaplatíte, a tím, co jste si půjčili. Jsou to úroky (a u reálných nabídek i poplatky) navíc oproti původní jistině. Čím delší doba splácení, tím nižší měsíční splátka, ale tím vyšší celkový přeplatek – delší úvěr je pohodlnější na splátku, ale dražší celkově.',
    },
    {
      q: 'Mohu úvěr předčasně splatit?',
      a: 'Ano. U spotřebitelského úvěru máte ze zákona právo na předčasné splacení. Banka může účtovat náhradu nákladů nejvýše 1 % z předčasně splacené částky (při zbývající době nad 1 rok), resp. 0,5 % (do 1 roku). Mimořádné splátky snižují jistinu, a tím i celkový přeplatek na úrocích.',
    },
    {
      q: 'Vyplatí se vzít si úvěr, nebo si raději naspořit?',
      a: 'Záleží na účelu. U úvěru platíte úrok navíc; u spoření a investování naopak peníze pracují pro vás. Pokud výdaj snese odklad, často vyjde levněji si nejdřív naspořit. Kolik by ze stejné částky mohlo narůst při investování, si spočítáte v investiční kalkulačce. Nejde o moralizování – jen o srovnání obou cest v korunách.',
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
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Kalkulačky', item: 'https://etfpruvodce.cz/kalkulacky' },
      { '@type': 'ListItem', position: 3, name: 'Úvěrová kalkulačka', item: 'https://etfpruvodce.cz/kalkulacky/uverova-kalkulacka' },
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
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/co-jsou-etf" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/nejlepsi-etf" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/srovnani-etf" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/kalkulacky" className="text-teal-700 font-medium">Kalkulačky</Link>
            <Link href="/kde-koupit-etf" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/srovnani-etf" className="hidden sm:inline-flex rounded-lg border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">Srovnávač</Link>
            <Link href="/kalkulacky" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Kalkulačky</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/kalkulacky" className="hover:text-slate-600">Kalkulačky</Link>
          <span>/</span>
          <span className="text-slate-600">Úvěrová kalkulačka</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Úvěrová kalkulačka</h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Spočítejte si měsíční splátku spotřebitelského úvěru, kolik celkem zaplatíte a jak velký bude{' '}
                  <InfoTip label="Přeplatek = rozdíl mezi tím, co celkem zaplatíte, a tím, co jste si půjčili. Jsou to úroky navíc oproti původní jistině.">přeplatek</InfoTip>
                  {' '}na úrocích – vše v korunách.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                  <span className="inline-flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> Výsledky v korunách</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href="#kalkulacka" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">Spustit kalkulačku</Link>
                  <Link href="/design-preview/investicni-kalkulacka" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Místo úvěru investovat?</Link>
                </div>
              </div>

              {/* Mini-přehled pojmů – ikonové karty (BEZ schématu/šipek) */}
              <div className="mt-6 md:mt-0 md:w-72 shrink-0 grid grid-cols-3 md:grid-cols-1 gap-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Zadáte</p>
                  <p className="text-lg font-bold tabular-nums">Výše a sazba</p>
                  <p className="text-xs text-slate-400">a dobu splácení</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Spočítáte</p>
                  <p className="text-lg font-bold tabular-nums text-teal-300">Měsíční splátku</p>
                  <p className="text-xs text-slate-400">stejnou každý měsíc</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Uvidíte</p>
                  <p className="text-lg font-bold tabular-nums text-red-300">Přeplatek</p>
                  <p className="text-xs text-slate-400">graf + hodnoty v Kč</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KALKULAČKA */}
        <section id="kalkulacka" className="pb-10 scroll-mt-16">
          <SectionHead title="Spočítejte si splátku a přeplatek" desc="Zadejte výši úvěru, úrokovou sazbu a dobu splácení. Výsledek i graf se přepočítají hned." />
          <UverovaKalkulackaWidget />
        </section>

        {/* CO POČÍTÁME – edukace přes ikonové karty (žádné schéma/šipky) */}
        <section className="pb-10">
          <SectionHead title="Čemu rozumět u spotřebitelského úvěru" desc="Tři pojmy, které rozhodují o tom, kolik vás úvěr nakonec bude stát." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              U spotřebitelského úvěru platíte stejnou{' '}
              <InfoTip label="Anuita = stejně vysoká splátka po celou dobu splácení. Mění se jen poměr úroku a jistiny uvnitř splátky.">anuitní</InfoTip>
              {' '}splátku každý měsíc. Na začátku v ní převažuje úrok, ke konci úmor jistiny. Skutečnou
              cenu úvěru ale neukáže samotný úrok – rozhoduje{' '}
              <InfoTip label="RPSN = roční procentní sazba nákladů. Zahrnuje úrok i poplatky (sjednání, vedení, pojištění), proto je vždy vyšší než úrok.">RPSN</InfoTip>.
            </p>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {([
                [Banknote, 'Měsíční splátka', 'Stejná částka každý měsíc. Závisí na výši úvěru, sazbě a délce splácení.'],
                [Percent, 'Úrok vs. RPSN', 'Úrok je cena za peníze; RPSN navíc obsahuje poplatky. Porovnávejte podle RPSN.'],
                [Scale, 'Přeplatek', 'Kolik zaplatíte navíc oproti půjčené částce. Delší doba = nižší splátka, vyšší přeplatek.'],
              ] as [typeof Banknote, string, string][]).map(([Icon, t, d]) => (
                <div key={t} className="rounded-lg bg-slate-50 p-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-teal-700 border border-slate-200 mb-3"><Icon className="w-4 h-4" /></span>
                  <p className="font-medium text-slate-900 text-sm">{t}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CO ZAHRNUJE RPSN */}
        <section className="pb-10">
          <SectionHead title="Co všechno se skrývá v RPSN" desc="Proto je RPSN vyšší než samotný úrok – a proč podle něj porovnávat." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Tahle kalkulačka počítá s úrokem (cena za půjčené peníze). U reálné nabídky banky ale do
              celkové ceny vstupují i poplatky – a ty shrne právě RPSN. Při porovnávání více nabídek se
              proto vždy dívejte na RPSN, ne jen na úrok.
            </p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([
                [Percent, 'Úroková sazba', 'cena za půjčené peníze'],
                [FileText, 'Poplatek za sjednání', 'jednorázově při uzavření'],
                [Wallet, 'Vedení úvěru', 'pravidelný poplatek'],
                [ShieldCheck, 'Pojištění', 'pokud je povinné'],
              ] as [typeof Percent, string, string][]).map(([Icon, t, d]) => (
                <div key={t} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-teal-700 border border-slate-200 mb-3"><Icon className="w-4 h-4" /></span>
                  <p className="font-medium text-slate-900 text-sm leading-tight">{t}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <span>Tip: dvě nabídky se stejným úrokem mohou mít kvůli poplatkům výrazně jinou RPSN. Levnější je ta s nižší RPSN.</span>
            </div>
          </div>
        </section>

        {/* INVESTIČNÍ ÚHEL – bez moralizování */}
        <section className="pb-10">
          <SectionHead title="Úvěr, nebo si nejdřív naspořit?" desc="Když výdaj snese odklad, vyplatí se srovnat obě cesty v korunách." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              U úvěru platíte úrok navíc – peníze stojí vás. U spoření a investování je to obráceně:
              peníze pracují pro vás. U nutného nebo neodkladného výdaje má úvěr smysl. Pokud ale výdaj
              snese čas, často vyjde levněji si nejdřív naspořit a teprve pak nakoupit. Kolik by ze
              stejné částky mohlo narůst, když ji místo splátek investujete, si spočítáte v investiční
              kalkulačce.
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {([
                [TrendingDown, 'Úvěr', 'Peníze máte hned, ale platíte úrok navíc. Vhodný u neodkladných výdajů.', 'text-red-600', 'bg-red-50'],
                [PiggyBank, 'Spoření a investice', 'Počkáte si, ale peníze rostou ve váš prospěch díky výnosům.', 'text-teal-700', 'bg-teal-50'],
              ] as [typeof PiggyBank, string, string, string, string][]).map(([Icon, t, d, color, bg]) => (
                <div key={t} className="rounded-lg border border-slate-200 bg-white p-4">
                  <span className={`flex items-center justify-center w-9 h-9 rounded-lg ${bg} ${color} border border-slate-200 mb-3`}><Icon className="w-4 h-4" /></span>
                  <p className="font-medium text-slate-900 text-sm">{t}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              <Link href="/design-preview/investicni-kalkulacka" className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium text-sm">
                Spočítat, kolik by vynesla investice <ArrowRight className="w-4 h-4" />
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
              [Database, 'Ověřená metodika', `Stejný anuitní výpočet jako naše původní kalkulačka. Aktualizováno ${dateStr}.`],
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
              ['/design-preview/investicni-kalkulacka', 'Investiční kalkulačka', TrendingUp],
              ['/kalkulacky/kalkulacka-poplatku-etf', 'Kalkulačka poplatků', Scale],
              ['/srovnani-etf', 'Srovnání ETF', ListChecks],
              ['/kde-koupit-etf', 'Kde koupit ETF', Landmark],
              ['/co-jsou-etf', 'Co jsou ETF', BookOpen],
              ['/kalkulacky', 'Další kalkulačky', Calculator],
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
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Kalkulačku stavíme nezávisle – výpočet vychází z ověřeného anuitního modelu splácení.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Metodika: anuitní splácení – konstantní měsíční splátka, měsíční rozpad na úrok a úmor jistiny. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Kalkulačka má vzdělávací charakter, počítá s úrokem (ne s RPSN ani poplatky konkrétní banky). Skutečná cena úvěru se může lišit – řiďte se nabídkou a smlouvou.</p>
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
          <p className="max-w-md text-center sm:text-right leading-relaxed">Obsah má vzdělávací charakter a nepředstavuje investiční ani úvěrové doporučení. Před uzavřením úvěru si přečtěte smlouvu a porovnejte RPSN.</p>
        </div>
      </footer>
    </div>
  );
}
