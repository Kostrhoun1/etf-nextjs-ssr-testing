import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, User, Database, Calculator,
  Scale, Landmark, BookOpen, History,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InfoTip from '@/components/design-preview/InfoTip';
import InvesticniKalkulackaWidget, { type HistorickyVynos } from '@/components/design-preview/InvesticniKalkulackaWidget';
import { nactiStrojCasu, cagrOd, STROJ_PRESETY } from '@/lib/strojCasu';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { FaqSeznam } from '@/components/design-preview/brokerUI';
import { simulateAndSerialize } from '@/lib/backtest/simulate';
import { scenarSkutecnosti, shrnSkutecnost, type SkutecnostVysledek } from '@/lib/kalkulackaSkutecnost';
import { titulek } from '@/lib/seoTitulek';

export const revalidate = 86400;
export const metadata: Metadata = {
  // Self-canonical: na stránku vedou odkazy s parametry (FB, presety, přesměrování) – ty
  // nemají být samostatné URL ve vyhledávači (deep dive 17. 10. 2026).
  alternates: { canonical: '/investicni-kalkulacka' },
  title: titulek('Investiční kalkulačka: složené úročení a pravidelné investování'),
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

  // „A jak by to dopadlo doopravdy?“ – výchozí scénář (100 000 Kč + 5 000 Kč měsíčně, 20 let, S&P 500) spočítaný
  // při ISR STEJNÝM jádrem jako /backtest (simulateAndSerialize). Při chybě null → karta ukáže „—“.
  let skutecnost: SkutecnostVysledek | null = null;
  try {
    const sc = scenarSkutecnosti({ presetId: 'sp500', roky: 20, jednorazove: 100000, pravidelne: 5000, frekvence: 'monthly' });
    skutecnost = shrnSkutecnost(sc, await simulateAndSerialize(sc.body));
  } catch (e) {
    console.error('[kalkulacka] výchozí historický scénář selhal:', e);
  }

  /* ---------- FAQ + JSON-LD ---------- */
  const faqs = [
    {
      q: 'Co je složené úročení a proč na něm tolik záleží?',
      a: 'Složené úročení znamená, že výnosy nedostáváte jen z původně vložené částky, ale i z dříve připsaných výnosů. Příklad: 100 000 Kč při 7 % ročně je po roce 107 000 Kč; druhý rok se počítá 7 % už ze 107 000 Kč, tedy 114 490 Kč. Čím delší horizont, tím větší podíl konečné hodnoty tvoří výnosy z výnosů – proto je čas u investování zásadní.',
    },
    {
      q: 'Jak kalkulačka počítá pravidelné investování?',
      a: 'U měsíčního vkladu kalkulačka simuluje rok po měsících: na začátku každého měsíce přičte váš vklad a poté na celou hodnotu aplikuje měsíční výnos odpovídající zadanému ročnímu – (1 + r)^(1/12) − 1, při 7 % ročně zhruba 0,565 % měsíčně, aby za 12 měsíců vyšlo přesně 7 %. U ročního vkladu přičte vklad jednou za rok a aplikuje celý roční výnos.',
    },
    {
      q: 'Jaký výnos mám do kalkulačky zadat?',
      a: 'Orientaci dají rychlé volby pod polem výnosu: kolik skutečně vynesly S&P 500, akcie celého světa a portfolio 60/40 v korunách od ledna 2004 (po poplatcích fondů, před daní). Výchozích 7 % je zaokrouhlený předpoklad, ne předpověď – budoucí výnos nikdo nezaručí. Jak by stejné vklady dopadly na skutečných datech i s propady, ukazuje karta „A jak by to dopadlo doopravdy?“ pod výsledkem (stejný výpočet jako backtest).',
    },
    {
      q: 'Proč se skutečná historie liší od kalkulačky se stejným výnosem?',
      a: 'Průměrné roční zhodnocení trhu (CAGR) a zhodnocení vašich pravidelných vkladů nejsou totéž. Pozdější vklady jsou investované kratší dobu a zažijí jiné roky než počáteční vklad – když po propadu přijde silný růst, vklady nakoupené levně vydělají víc, než napovídá průměr trhu. Proto u historie ukazujeme i „zhodnocení vkladů“ (XIRR): stálý roční výnos, který by ze stejných vkladů udělal stejnou částku. To číslo je s kalkulačkou přímo srovnatelné.',
    },
    {
      q: 'Počítá kalkulačka s poplatky a inflací?',
      a: 'Kalkulačka bere výnos tak, jak ho zadáte – poplatky ani inflaci sama neodečítá. Chcete-li výsledek po poplatcích fondu, zadejte výnos už po nich; historické výnosy u rychlých voleb jsou po poplatcích fondů (před daní). Poplatky brokera nezahrnuje. Přepočet do dnešních cen pod výsledkem je orientační, při inflaci 2 % ročně (inflační cíl ČNB).',
    },
    {
      q: 'Počítá kalkulačka s daní z výnosů?',
      a: 'Volitelně ano (rozbalovací pole Daň z výnosů). V Česku platí časový test: při držení ETF déle než 3 roky je zisk z prodeje osvobozen (0 % daň). Proto je výchozí daň 0 %. Pokud držíte kratší dobu, můžete zadat 15 % (případně 23 % u vyšších příjmů) a kalkulačka sníží konečnou hodnotu o daň ze zisku.',
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
          <InvesticniKalkulackaWidget historicke={stejneObdobi ? historicke : []} skutecnostVychozi={skutecnost} />
        </section>

        {/* FAQ */}
        <section data-sekce="faq" className="pb-10">
          <SectionHead title="Časté otázky" />
          <FaqSeznam items={faqs} />
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
                  Autor ETF průvodce.cz s více než 12 lety praxe v českém bankovnictví. Kalkulačku stavíme nezávisle, bez placeného pořadí.
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
