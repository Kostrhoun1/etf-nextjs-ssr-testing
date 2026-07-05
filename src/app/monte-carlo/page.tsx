import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, CalendarDays, Database, Info, Calculator,
  Scale, Landmark, ShieldCheck, Crown, HelpCircle, BookOpen, PiggyBank,
  Dices, Target, BarChart3, AlertTriangle,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InfoTip from '@/components/design-preview/InfoTip';
import MonteCarloWidget from '@/components/design-preview/MonteCarloWidget';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Monte Carlo simulátor portfolia: pravděpodobnostní scénáře v Kč',
  description:
    'Nikdo nezná budoucnost. Monte Carlo simulátor vygeneruje stovky možných vývojů vašeho portfolia a ukáže pesimistický, mediánový i optimistický scénář v korunách – včetně šance na dosažení cíle.',
};

export default async function MonteCarloPreview() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  /* ---------- FAQ + JSON-LD ---------- */
  const faqs = [
    {
      q: 'Co je Monte Carlo simulace?',
      a: 'Monte Carlo je statistická metoda pojmenovaná po kasinu v Monaku. Místo jediné předpovědi vygeneruje stovky až tisíce náhodných vývojů trhu a ukáže, jak široký je rozsah možných výsledků. U portfolia tak nevidíte jen jedno číslo, ale celé pravděpodobnostní pásmo – od nepříznivých scénářů po ty velmi dobré.',
    },
    {
      q: 'Jak simulátor počítá scénáře?',
      a: 'Pro každé aktivum (akcie, dluhopisy, zlato, hotovost) pracujeme s historickým ročním výnosem a kolísavostí (volatilitou). Vzájemné vazby mezi aktivy zachycuje korelační matice, kterou rozkládáme Choleskyho dekompozicí – díky tomu se aktiva v jednotlivých měsících pohybují realisticky společně. Každý měsíc přičteme váš vklad a aplikujeme náhodně vygenerovaný výnos. Tento postup zopakujeme pro stovky scénářů a z výsledků spočítáme percentily.',
    },
    {
      q: 'Co znamená percentil a pásmo?',
      a: 'Percentil udává, jaký podíl scénářů skončil pod danou hodnotou. 5. percentil je pesimistický scénář – jen 5 % simulací dopadlo hůře. Medián (50. percentil) je prostřední výsledek: polovina scénářů skončila výš, polovina níž. 95. percentil je optimistický scénář, který překonalo jen 5 % simulací. Pásmo mezi nimi ukazuje, jak velká je nejistota – čím širší, tím méně jisté.',
    },
    {
      q: 'Proč se výsledek zobrazuje jako rozsah, a ne jako jedno číslo?',
      a: 'Protože budoucnost nikdo nezná. Jediné „průměrné“ číslo budí dojem jistoty, kterou trh nemá. Rozsah scénářů upřímně ukazuje, že výsledek může dopadnout výrazně lépe i hůř. To je hlavní hodnota Monte Carlo metody – pomáhá odpovědět na otázku „a co když to dopadne špatně?“.',
    },
    {
      q: 'Co simulace nezohledňuje?',
      a: 'Model předpokládá zhruba normální rozdělení výnosů, jenže reálné trhy mají „tlusté chvosty“ – velké propady i vzestupy přicházejí častěji, než by čistá statistika čekala. Simulátor také nepočítá s inflací, daněmi, poplatky fondu (TER) ani brokera a neumí předvídat nepředvídatelné události. Výsledky berte jako orientační pravděpodobnostní model, ne jako záruku.',
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
      { '@type': 'ListItem', position: 3, name: 'Monte Carlo simulátor', item: 'https://etfpruvodce.cz/kalkulacky/monte-carlo-simulator' },
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
          <div className="flex items-center gap-2">
            <HeaderSearch />
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
          <span className="text-slate-600">Monte Carlo simulátor</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Monte Carlo simulátor portfolia</h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Nikdo nezná budoucnost. Simulátor vygeneruje stovky náhodných vývojů trhu a ukáže{' '}
                  <InfoTip label="Místo jediné předpovědi statistická metoda generuje mnoho náhodných scénářů. Pojmenovaná je po kasinu v Monaku.">
                    pravděpodobnostní rozsah
                  </InfoTip>
                  {' '}hodnoty vašeho portfolia – v přepočtu na koruny.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                  <span className="inline-flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Výsledky v korunách</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href="#simulator" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">Spustit simulátor</Link>
                  <Link href="/investicni-kalkulacka" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Klasická kalkulačka</Link>
                </div>
              </div>

              {/* Co dostanete – ikonové karty, BEZ šipek */}
              <div className="mt-6 md:mt-0 md:w-72 shrink-0 grid grid-cols-3 md:grid-cols-1 gap-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Vstupujete</p>
                  <p className="text-lg font-bold tabular-nums">Vklady + výnos</p>
                  <p className="text-xs text-slate-400">a kolísavost trhu</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Pracuje pro vás</p>
                  <p className="text-lg font-bold tabular-nums text-teal-300">Stovky scénářů</p>
                  <p className="text-xs text-slate-400">náhodný vývoj trhu</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Vidíte</p>
                  <p className="text-lg font-bold tabular-nums">Rozsah, ne číslo</p>
                  <p className="text-xs text-slate-400">pásma + šance na cíl</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROČ ROZSAH MÍSTO JEDNOHO ČÍSLA – edukace NAD simulátorem */}
        <section className="pb-10">
          <SectionHead title="Proč se dívat na rozsah, ne na jedno číslo" desc="Krátké vysvětlení principu, než spustíte vlastní simulaci." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Klasická kalkulačka počítá s jedním pevným výnosem a dá vám jedno číslo. Jenže trh
              nikdy neroste rovnoměrně – jednou přidá 25 %, jindy o 30 % spadne. Monte Carlo
              tuto <strong className="text-slate-900">kolísavost</strong> bere vážně: vygeneruje
              mnoho náhodných cest a ukáže, jak různě může stejné zadání dopadnout.
            </p>
            <div className="mt-4 rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-900 flex items-center gap-2.5">
              <Info className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Výsledkem není předpověď, ale <strong>pravděpodobnost</strong> – například „v 70 % scénářů portfolio dosáhne cíle“.</span>
            </div>
          </div>
        </section>

        {/* SIMULÁTOR */}
        <section id="simulator" className="pb-10 scroll-mt-16">
          <SectionHead title="Spusťte si vlastní simulaci" desc="Zadejte vklady, horizont a složení portfolia. Simulátor vygeneruje scénáře a zobrazí pásma i šanci na dosažení cíle." />
          <MonteCarloWidget />
        </section>

        {/* JAK TO FUNGUJE – ikonové karty, BEZ schémat a šipek */}
        <section className="pb-10">
          <SectionHead title="Jak simulace vzniká" desc="Tři kroky, které simulátor opakuje pro každý scénář znovu a znovu." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="grid sm:grid-cols-3 gap-3">
              {([
                [Database, 'Vstupní data aktiv', (
                  <>
                    Každé aktivum má historický roční výnos a{' '}
                    <InfoTip label="Volatilita = míra kolísání hodnoty. Vyšší volatilita znamená větší výkyvy nahoru i dolů.">volatilitu</InfoTip>
                    . Vzájemné vazby řeší korelační matice.
                  </>
                )],
                [Dices, 'Náhodné měsíční výnosy', 'Pro každý měsíc se vylosuje výnos podle statistiky aktiv. Připočte se váš vklad a hodnota portfolia se přepočítá.'],
                [BarChart3, 'Percentily ze scénářů', 'Po stovkách scénářů se z výsledků spočítají pásma: pesimistické (5 %), medián (50 %) a optimistické (95 %).'],
              ] as [typeof Database, string, ReactNode][]).map(([Icon, t, d]) => (
                <div key={t} className="rounded-lg bg-slate-50 p-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-teal-700 border border-slate-200 mb-3"><Icon className="w-4 h-4" /></span>
                  <p className="font-medium text-slate-900 text-sm">{t}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* JAK ČÍST PÁSMA – ikonové vysvětlivky percentilů, BEZ schémat */}
        <section className="pb-10">
          <SectionHead title="Jak číst pravděpodobnostní pásma" desc="Co znamenají jednotlivé scénáře v grafu i v kartách výsledků." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="grid sm:grid-cols-3 gap-3">
              {([
                ['bg-red-50 text-red-600', AlertTriangle, 'Pesimistický (5 %)', 'Jen 5 % scénářů dopadlo hůře. Odhad nepříznivého, ne nejhoršího možného vývoje.'],
                ['bg-teal-50 text-teal-700', Target, 'Medián (50 %)', 'Prostřední scénář. Polovina simulací skončila výš, polovina níž – nejlepší jediný odhad.'],
                ['bg-emerald-50 text-emerald-600', TrendingUp, 'Optimistický (95 %)', 'Jen 5 % scénářů dopadlo lépe. Příznivý, ale rozhodně ne zaručený výsledek.'],
              ] as [string, typeof Target, string, string][]).map(([cls, Icon, t, d]) => (
                <div key={t} className="rounded-lg bg-slate-50 p-4">
                  <span className={`flex items-center justify-center w-9 h-9 rounded-lg mb-3 ${cls}`}><Icon className="w-4 h-4" /></span>
                  <p className="font-medium text-slate-900 text-sm">{t}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              Čím širší je pásmo mezi pesimistickým a optimistickým scénářem, tím větší je nejistota.
              Konzervativní portfolio (více dluhopisů) mívá pásmo užší, ryze akciové portfolio širší.
            </p>
          </div>
        </section>

        {/* KDY SE HODÍ */}
        <section className="pb-10">
          <SectionHead title="Kdy se Monte Carlo hodí" desc="Typické otázky, na které pravděpodobnostní pohled odpovídá lépe než průměr." />
          <div className="grid sm:grid-cols-3 gap-3">
            {([
              ['Plánování důchodu', 'Zjistíte, s jakou pravděpodobností portfolio dosáhne cílové částky za 20–30 let.'],
              ['Předčasný důchod', 'U dlouhých horizontů (40+ let) ukáže riziko nepříznivého načasování propadů.'],
              ['Porovnání profilů', 'Srovnáte nejen výnos, ale i šíři pásma – tedy riziko – mezi opatrnou a růstovou variantou.'],
            ] as [string, string][]).map(([t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900 text-sm">{t}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
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
              [Database, 'Ověřená metodika', `Stejný výpočetní model jako náš původní simulátor. Aktualizováno ${dateStr}.`],
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
              ['/investicni-kalkulacka', 'Investiční kalkulačka', Calculator],
              ['/kalkulacka', 'Kalkulačka poplatků', Scale],
              ['/srovnani', 'Srovnání ETF', TrendingUp],
              ['/portfolio-strategie', 'Modelová portfolia', PiggyBank],
              ['/kde-koupit', 'Kde koupit ETF', Landmark],
              ['/pruvodce', 'Co jsou ETF', BookOpen],
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
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Simulátor stavíme nezávisle – výpočetní model vychází z ověřené metodiky Monte Carlo.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Metodika: měsíční simulace s historickými výnosy a volatilitou aktiv, korelace přes Choleskyho dekompozici, percentily z výsledných scénářů. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Simulátor má vzdělávací charakter, pracuje s nominálními hodnotami a předpokládá přibližně normální rozdělení výnosů – skutečné výnosy kolísají a nelze je zaručit.</p>
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
