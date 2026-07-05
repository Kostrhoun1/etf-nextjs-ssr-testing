import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, CalendarDays, Database, Info, Calculator,
  Wallet, Receipt, BadgePercent, HelpCircle, BookOpen, Scale, Landmark,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import CistyPlatWidget from '@/components/design-preview/CistyPlatWidget';
import InfoTip from '@/components/design-preview/InfoTip';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Kalkulačka čisté mzdy 2026: výpočet čistého platu z hrubého',
  description:
    'Spočítejte si čistou mzdu z hrubé podle pravidel pro rok 2026 – pojistné, daň 15/23 %, sleva na poplatníka i na děti. Včetně nákladů zaměstnavatele.',
};

export default async function CistyPlatPreview() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  /* ---------- FAQ + JSON-LD ---------- */
  const faqs = [
    {
      q: 'Jak se počítá čistá mzda v roce 2026?',
      a: 'Z hrubé mzdy se nejdřív strhne pojistné zaměstnance – sociální 7,1 % a zdravotní 4,5 % (dohromady 11,6 %). Z hrubé mzdy se dále spočítá daň z příjmů sazbou 15 % (u vysokých příjmů 23 % nad limit). Od daně se odečtou slevy, hlavně sleva na poplatníka 2 570 Kč měsíčně. Čistá mzda = hrubá mzda − pojistné − daň po slevách.',
    },
    {
      q: 'Jaké jsou sazby pojistného a daně pro rok 2026?',
      a: 'Zaměstnanec odvádí sociální pojištění 7,1 % (6,5 % důchodové + 0,6 % nemocenské) a zdravotní pojištění 4,5 %. Daň z příjmů je 15 %, u části příjmu nad 146 901 Kč měsíčně (36násobek průměrné mzdy ročně) je sazba 23 %. Základní sleva na poplatníka je 2 570 Kč měsíčně, tedy 30 840 Kč ročně.',
    },
    {
      q: 'Co je sleva na poplatníka a jak funguje?',
      a: 'Sleva na poplatníka je 2 570 Kč měsíčně (30 840 Kč ročně) a náleží každému zaměstnanci. Odečítá se přímo z vypočtené daně, ne ze základu daně. Pokud je sleva vyšší než daň, daň vyjde nula – peníze se ale nevracejí zpět nad rámec daně.',
    },
    {
      q: 'Jak velké jsou slevy na děti v roce 2026?',
      a: 'Daňové zvýhodnění na děti je progresivní podle pořadí dítěte: 1 267 Kč měsíčně na 1. dítě, 1 860 Kč na 2. dítě a 2 320 Kč na 3. a každé další dítě. Tyto částky se odečítají od daně a mohou daň snížit i pod nulu (vzniká daňový bonus).',
    },
    {
      q: 'Kolik stojí moje pracovní místo zaměstnavatele?',
      a: 'Zaměstnavatel platí nad rámec vaší hrubé mzdy ještě pojistné: 24,8 % na sociální a 9 % na zdravotní pojištění, dohromady 33,8 %. U hrubé mzdy 45 000 Kč tak celkové náklady zaměstnavatele činí zhruba 60 210 Kč měsíčně.',
    },
    {
      q: 'Co je superhrubá mzda a platí ještě?',
      a: 'Superhrubá mzda byla zrušena k 1. 1. 2021. Dříve se z ní (hrubá mzda navýšená o pojistné zaměstnavatele) počítala daň. Od roku 2021 se daň počítá přímo z hrubé mzdy sazbou 15 %, což zaměstnancům zvýšilo čistou mzdu.',
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
      { '@type': 'ListItem', position: 3, name: 'Kalkulačka čisté mzdy 2026', item: 'https://www.etfpruvodce.cz/kalkulacky/cisty-plat-2026' },
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
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
            </span>
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
          <Link href="/kalkulacky" className="hover:text-slate-600">Kalkulačky</Link>
          <span>/</span>
          <span className="text-slate-600">Kalkulačka čisté mzdy 2026</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Kalkulačka čisté mzdy 2026</h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Spočítejte si, kolik vám z hrubé mzdy reálně zůstane na účet – podle pravidel
                  pro rok 2026. Včetně{' '}
                  <InfoTip label="Povinné platby z hrubé mzdy: sociální a zdravotní pojištění zaměstnance.">odvodů</InfoTip>
                  {' '}na pojistné, daně a slev.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                  <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Sazby a slevy pro rok 2026</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href="#kalkulacka" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">Spustit kalkulačku</Link>
                  <Link href="/investicni-kalkulacka" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Investiční kalkulačka</Link>
                </div>
              </div>

              {/* Mini-metriky – fixní sazby 2026 */}
              <div className="mt-6 md:mt-0 md:w-72 shrink-0 grid grid-cols-3 md:grid-cols-1 gap-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Pojistné zaměstnance</p>
                  <p className="text-lg font-bold tabular-nums">11,6 %</p>
                  <p className="text-xs text-slate-400">sociální 7,1 % + zdravotní 4,5 %</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Daň z příjmů</p>
                  <p className="text-lg font-bold tabular-nums">15 / 23 %</p>
                  <p className="text-xs text-slate-400">vyšší sazba nad limit</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Sleva na poplatníka</p>
                  <p className="text-lg font-bold tabular-nums text-emerald-400">2 570 Kč</p>
                  <p className="text-xs text-slate-400">měsíčně</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* JAK SE POČÍTÁ ČISTÁ MZDA – edukace NAD kalkulačkou */}
        <section className="pb-10">
          <SectionHead title="Jak se z hrubé mzdy stane čistá" desc="Tři kroky, než si spočítáte vlastní případ." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Z hrubé mzdy vám nedorazí na účet vše. Stát si bere{' '}
              <strong className="text-slate-900">pojistné a daň</strong> – ale daň zase snižují slevy.
              Postupně tedy probíhají tři kroky:
            </p>
            <ol className="mt-5 grid sm:grid-cols-3 gap-3">
              {([
                [Receipt, '1. Pojistné', 'Z hrubé mzdy se strhne sociální 7,1 % a zdravotní 4,5 % pojištění zaměstnance.'],
                [BadgePercent, '2. Daň po slevách', 'Z hrubé mzdy se spočítá daň 15 % a od ní se odečtou slevy (na poplatníka, na děti).'],
                [Wallet, '3. Čistá mzda', 'Co zbude po pojistném a dani po slevách, je vaše čistá mzda na účet.'],
              ] as [typeof Receipt, string, string][]).map(([Icon, t, d]) => (
                <li key={t} className="rounded-lg bg-slate-50 p-3">
                  <span className="flex items-center gap-2 font-medium text-slate-900 text-sm"><Icon className="w-4 h-4 text-teal-700 shrink-0" /> {t}</span>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-4 rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-900 flex items-center gap-2.5">
              <Info className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                Tzv. <strong>superhrubá mzda</strong> byla zrušena v roce 2021 – daň se dnes počítá přímo z hrubé mzdy.
              </span>
            </div>
          </div>
        </section>

        {/* KALKULAČKA */}
        <section id="kalkulacka" className="pb-10 scroll-mt-16">
          <SectionHead title="Spočítejte si čistou mzdu" desc="Zadejte hrubou mzdu a případné slevy. Výsledek se přepočítá hned." />
          <CistyPlatWidget />
        </section>

        {/* CO ZNAMENAJÍ JEDNOTLIVÉ POJMY – edukace vetkaná */}
        <section className="pb-10">
          <SectionHead title="Co znamenají jednotlivé položky" desc="Pojmy, které se schovávají za čísly v kalkulačce." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="grid sm:grid-cols-2 gap-3">
              {([
                [Receipt, 'Sociální pojištění (7,1 %)', 'Důchodové (6,5 %) a nemocenské (0,6 %) pojištění. Z něj se platí starobní důchody a nemocenská.'],
                [Receipt, 'Zdravotní pojištění (4,5 %)', 'Platba do veřejného zdravotního pojištění. Pokrývá vaši zdravotní péči.'],
                [BadgePercent, 'Sleva na poplatníka', 'Základní sleva 2 570 Kč měsíčně, kterou má každý zaměstnanec. Odečítá se přímo z daně.'],
                [BadgePercent, 'Daňové zvýhodnění na děti', 'Progresivní sleva podle pořadí dítěte: 1 267 / 1 860 / 2 320 Kč měsíčně. Sníží daň, případně vznikne bonus.'],
              ] as [typeof Receipt, string, string][]).map(([Icon, t, d]) => (
                <div key={t} className="rounded-lg bg-slate-50 p-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-teal-700 border border-slate-200 mb-3"><Icon className="w-4 h-4" /></span>
                  <p className="font-medium text-slate-900 text-sm">{t}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              Kromě hrubé a čisté mzdy je dobré znát i{' '}
              <InfoTip label="Celkové náklady zaměstnavatele = hrubá mzda + 24,8 % sociální + 9 % zdravotní pojištění, které platí zaměstnavatel navíc nad vaši hrubou mzdu.">
                náklady zaměstnavatele
              </InfoTip>
              {' '}– kolik vaše místo reálně stojí firmu. Tu částku vidíte ve výsledku kalkulačky.
            </p>
          </div>
        </section>

        {/* OD ČISTÉ MZDY K INVESTOVÁNÍ – český úhel / konverze */}
        <section className="pb-10">
          <SectionHead title="Co s čistou mzdou dál" desc="Když víte, kolik vám zbude, můžete část pravidelně investovat." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Čistá mzda je výchozí bod pro rozpočet. Část, která vám po výdajích zůstane, můžete
              dlouhodobě zhodnocovat – třeba pravidelným nákupem levných{' '}
              <InfoTip label="Burzovně obchodované fondy sledující index – jedním nákupem koupíte stovky firem najednou, s nízkým ročním poplatkem.">ETF</InfoTip>.
              Kolik z toho udělá za desítky let složené úročení, ukáže investiční kalkulačka.
            </p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {([
                ['/investicni-kalkulacka', 'Investiční kalkulačka', TrendingUp],
                ['/kalkulacka', 'Kalkulačka poplatků ETF', Scale],
                ['/pruvodce', 'Co jsou ETF', BookOpen],
                ['/kde-koupit', 'Kde koupit ETF', Landmark],
                ['/srovnani', 'Srovnání ETF', Scale],
                ['/kalkulacky', 'Další kalkulačky', Calculator],
              ] as [string, string, typeof TrendingUp][]).map(([href, label, Icon]) => (
                <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                  <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                  <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
                </Link>
              ))}
            </div>
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

        {/* E-E-A-T patička */}
        <section className="pb-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Kalkulačka vychází z platných sazeb pojistného a daně pro rok 2026.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroje: zákon o daních z příjmů, sazby pojistného ČSSZ a zdravotních pojišťoven pro rok 2026. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Kalkulačka má orientační a vzdělávací charakter. Nezahrnuje benefity, stravenky, nadlimitní příjmy ani zvláštní situace. Pro závazný výpočet se obraťte na mzdovou účtárnu.</p>
            </div>
          </div>
        </section>

        {/* DISCLAIMER – na konec obsahu */}
        <section className="pb-12">
          <InvestmentDisclaimer />
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">ETF průvodce.cz</span>
          <p className="max-w-md text-center sm:text-right leading-relaxed">Obsah má vzdělávací charakter a nepředstavuje investiční ani daňové poradenství.</p>
        </div>
      </footer>
    </div>
  );
}
