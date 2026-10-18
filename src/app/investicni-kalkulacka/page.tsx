import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, ArrowRight, User, Database, Calculator,
  Scale, Landmark, HelpCircle, BookOpen, PiggyBank, Clock, Repeat, History,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InfoTip from '@/components/design-preview/InfoTip';
import InvesticniKalkulackaWidget, { type HistorickyVynos } from '@/components/design-preview/InvesticniKalkulackaWidget';
import { nactiStrojCasu, cagrOd, STROJ_PRESETY } from '@/lib/strojCasu';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

export const revalidate = 86400;
export const metadata: Metadata = {
  // Self-canonical: na stránku vedou odkazy s parametry (FB, presety, přesměrování) – ty
  // nemají být samostatné URL ve vyhledávači (deep dive 17. 10. 2026).
  alternates: { canonical: '/investicni-kalkulacka' },
  title: 'Investiční kalkulačka: složené úročení a pravidelné investování',
  description:
    'Spočítejte, na kolik narostou vaše investice díky složenému úročení. Zadejte jednorázový i pravidelný vklad, dobu a výnos – výsledek v korunách včetně grafu.',
};

export default async function InvesticniKalkulackaPreview() {
  // Skutečné průměrné roční výnosy v Kč za STEJNÉ období (od 1/2004 – první rok, kdy mají data
  // všechny tři presety). Ověřeno: CAGR z měsíčních dat vs. backtest ±0,07 p. b.
  // Každé číslo má datum: posíláme první měsíc a poslední den dat (dřív jen roky „2004–2026“).
  const OBDOBI_OD = '2004-01';
  const rady = await nactiStrojCasu(['sp500', 'svet', 'vyvazene']);
  const historicke: HistorickyVynos[] = rady.flatMap((r) => {
    const c = cagrOd(r, OBDOBI_OD);
    const p = STROJ_PRESETY.find((x) => x.id === r.id);
    return c && p ? [{ id: r.id, nazev: p.nazev, cagr: c.cagr, odMesic: OBDOBI_OD, doDen: r.posledniDen }] : [];
  });
  // Pořadí rychlých voleb: S&P 500, celý svět, 60/40 (od nejvyššího rizika).
  const PORADI = ['sp500', 'svet', 'vyvazene'];
  historicke.sort((a, b) => PORADI.indexOf(a.id) - PORADI.indexOf(b.id));
  // Všechny volby musí mít STEJNÝ konec období (jinak by srovnání neplatilo) – jinak je raději nezobrazit.
  const stejneObdobi = historicke.every((h) => h.doDen === historicke[0]?.doDen);

  /* ---------- FAQ + JSON-LD ---------- */
  const faqs = [
    {
      q: 'Co je složené úročení a proč na něm tolik záleží?',
      a: 'Složené úročení znamená, že výnosy nedostáváte jen z původně vložené částky, ale i z dříve připsaných výnosů. Příklad: 100 000 Kč při 7 % ročně je po roce 107 000 Kč; druhý rok se počítá 7 % už ze 107 000 Kč, tedy 114 490 Kč. Čím delší horizont, tím větší podíl konečné hodnoty tvoří výnosy z výnosů – proto je čas u investování zásadní.',
    },
    {
      q: 'Jak kalkulačka počítá pravidelné investování?',
      a: 'U měsíčního vkladu kalkulačka simuluje rok po měsících: na začátku každého měsíce přičte váš vklad a poté na celou hodnotu aplikuje měsíční výnos odpovídající zadanému ročnímu – (1 + r)^(1/12) − 1, při 7 % ročně zhruba 0,565 % měsíčně, aby za 12 měsíců vyšlo přesně 7 %. U ročního vkladu přičte vklad jednou za rok a aplikuje celý roční výnos.',
    },
    {
      q: 'Jaký výnos mám do kalkulačky zadat?',
      a: 'Orientaci dají rychlé volby pod polem výnosu: kolik skutečně vynesly S&P 500, akcie celého světa a portfolio 60/40 v korunách od ledna 2004 (po poplatcích fondů, před daní). Výchozích 7 % je zaokrouhlený předpoklad, ne předpověď – budoucí výnos nikdo nezaručí. Jak by stejné vklady dopadly na skutečných datech i s propady, ukáže backtest.',
    },
    {
      q: 'Počítá kalkulačka s poplatky a inflací?',
      a: 'Kalkulačka bere výnos tak, jak ho zadáte – poplatky ani inflaci sama neodečítá. Chcete-li výsledek po poplatcích fondu, zadejte výnos už po nich; historické výnosy u rychlých voleb jsou po poplatcích fondů (před daní). Poplatky brokera nezahrnuje. Přepočet do dnešních cen pod výsledkem je orientační, při inflaci 2 % ročně (inflační cíl ČNB).',
    },
    {
      q: 'Počítá kalkulačka s daní z výnosů?',
      a: 'Volitelně ano (rozbalovací pole Daň z výnosů). V Česku platí časový test: při držení ETF déle než 3 roky je zisk z prodeje osvobozen (0 % daň). Proto je výchozí daň 0 %. Pokud držíte kratší dobu, můžete zadat 15 % (případně 23 % u vyšších příjmů) a kalkulačka sníží konečnou hodnotu o daň ze zisku.',
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
      { '@type': 'ListItem', position: 3, name: 'Investiční kalkulačka', item: 'https://etfpruvodce.cz/investicni-kalkulacka' },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header – stejný jako backtest (dřív navíc zelené tlačítko „Kalkulačky“, které na mobilu tlačilo logo) */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
            </span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <SiteNav />
          <HeaderSearch />
        </div>
      </header>

      <main id="obsah" className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/kalkulacky" className="hover:text-slate-600">Kalkulačky</Link>
          <span>/</span>
          <span className="text-slate-600">Investiční kalkulačka</span>
        </nav>

        {/* ÚVOD – nadpis + jedna věta. Dřív tmavý hero s prázdným pravým sloupcem a výsledek pod okrajem. */}
        <section data-sekce="kalk-uvod" className="pb-5">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Investiční kalkulačka</h1>
          <p className="mt-1.5 text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed">
            Na kolik narostou vaše peníze díky{' '}
            <InfoTip label="Výnosy se reinvestují a samy dál vydělávají – úrok z úroku. Čím delší horizont, tím silnější efekt.">složenému úročení</InfoTip>
            {' '}– jednorázový i pravidelný vklad, výsledek v korunách se počítá hned.
          </p>
        </section>

        <section id="kalkulacka" className="pb-12 scroll-mt-16">
          <InvesticniKalkulackaWidget historicke={stejneObdobi ? historicke : []} />
        </section>

        {/* CO JE SLOŽENÉ ÚROČENÍ – krátce, ve třech kartách (dřív dvě sekce s odstavci) */}
        <section data-sekce="kalk-slozene-uroceni" className="pb-10">
          <SectionHead title="Co je složené úročení" desc="100 000 Kč při 7 % ročně je po roce 107 000 Kč; druhý rok se 7 % počítá už ze 107 000 Kč = 114 490 Kč." />
          <div className="grid sm:grid-cols-3 gap-3">
            {([
              [Repeat, 'Výnos z výnosů', 'Připsaný výnos se reinvestuje a sám dál vydělává – ne jen původní vklad.'],
              [Clock, 'Čas je klíčový', 'Dvojnásobek let neznamená dvojnásobek peněz, ale výrazně víc.'],
              [PiggyBank, 'Pravidelnost vyhrává', (
                <>
                  <InfoTip label="Pravidelné investování stejné částky v čase rozkládá nákupy do různých cen a snižuje riziko špatného načasování.">Pravidelné vklady</InfoTip>
                  {' '}rozkládají riziko špatného načasování.
                </>
              )],
            ] as [typeof Repeat, string, ReactNode][]).map(([Icon, t, d]) => (
              <div key={t} className="flex items-start gap-3 sm:block rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-teal-50 text-teal-700 sm:mb-3"><Icon className="w-4 h-4" /></span>
                <span className="block">
                  <span className="block font-medium text-slate-900 text-sm">{t}</span>
                  <span className="block text-xs text-slate-500 mt-1 leading-relaxed">{d}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section data-sekce="faq" className="pb-10">
          <SectionHead title="Časté dotazy" />
          <div className="space-y-2">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-lg border border-slate-200 bg-white">
                <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none min-h-[44px]">
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

        {/* POKRAČUJTE DÁL */}
        <section data-sekce="pokracujte" className="pb-10">
          <SectionHead title="Pokračujte dál" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {([
              ['/backtest', 'Backtest na skutečných datech', History],
              ['/kalkulacka', 'Kalkulačka poplatků', Scale],
              ['/srovnani', 'Srovnání ETF', TrendingUp],
              ['/kde-koupit', 'Kde koupit ETF', Landmark],
              ['/pruvodce', 'Co jsou ETF', BookOpen],
              ['/kalkulacky', 'Další kalkulačky', Calculator],
            ] as [string, string, typeof Scale][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Autor + metodika (vzorec místo kruhového „ověřená metodika“) + jedno obecné upozornění */}
        <section data-sekce="autor" className="pb-12">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Kalkulačku stavíme nezávisle, bez placeného pořadí.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <p className="flex items-start gap-1.5 text-xs text-slate-500">
                <Database className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  Výpočet: každý měsíc (hodnota + vklad) × (1 + r)<sup>1/12</sup>, takže zadaný roční výnos r platí přesně za rok.
                  Historické výnosy u rychlých voleb: ceny fondů SPY, VT, VGTSX a AGG přepočtené do Kč historickými kurzy
                  {historicke[0] ? `, data k ${new Date(`${historicke[0].doDen}T00:00:00Z`).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}` : ''}.
                </span>
              </p>
              <InvestmentDisclaimer variant="inline" />
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
