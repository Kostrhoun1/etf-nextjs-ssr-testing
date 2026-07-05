import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, CalendarDays, Database, Info, Calculator,
  Coins, Wallet, Scale, Landmark, ShieldCheck, Crown, HelpCircle, BookOpen,
  PiggyBank, DollarSign, ShieldAlert, RefreshCcw, Banknote,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InfoTip from '@/components/design-preview/InfoTip';
import KurzovyDopadWidget from '@/components/design-preview/KurzovyDopadWidget';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Kalkulačka kurzového dopadu: jak kurz USD/CZK ovlivní výnos ETF',
  description:
    'Spočítejte, jak pohyb kurzu dolaru a eura vůči koruně promění výnos vašeho ETF v přepočtu na koruny. Scénáře, kurzová expozice a riziko – výsledky v korunách.',
};

export default async function KurzovyDopadPreview() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  /* ---------- FAQ + JSON-LD ---------- */
  const faqs = [
    {
      q: 'Jak velký vliv má kurz na výnos ETF v korunách?',
      a: 'Vliv je přímý a často podceňovaný. Pokud máte fond na americké akcie a dolar oslabí vůči koruně o 15 %, vaše portfolio v přepočtu na koruny klesne zhruba o 15 % – bez ohledu na to, jak si vedly samotné akcie. Kurz tedy může výrazně zvětšit, ale i smazat výnos fondu. Kalkulačka ukazuje tento dopad zvlášť, oddělený od výnosu trhu.',
    },
    {
      q: 'Co je měnová expozice a podle čeho ji zadat?',
      a: 'Měnová expozice znamená, v jakých měnách jsou skutečná aktiva fondu, ne v jaké měně fond obchodujete. Fond na americké akcie vedený v eurech má 100% dolarovou expozici – v korunách na něj působí kurz USD/CZK. Globální fond (například na index MSCI World) má zhruba 70 % v dolaru a zbytek v ostatních měnách. Expozici najdete v dokumentu fondu (tzv. fact sheet) v regionálním rozložení.',
    },
    {
      q: 'Existuje ETF zajištěné proti koruně?',
      a: 'Ne. Fondy zajištěné proti koruně (CZK) prakticky neexistují. Dostupné jsou pouze fondy zajištěné proti euru nebo dolaru, které ale řeší jen vztah EUR/USD, nikoli korunu. Pro českého investora proto kurzové riziko vůči koruně zůstává u prakticky všech zahraničních ETF. Měnově zajištěné fondy navíc bývají dražší kvůli vyšším nákladům na zajištění.',
    },
    {
      q: 'Jak kurzové riziko snížit?',
      a: 'U dlouhého horizontu (10 a více let) nejvíc pomáhá pravidelné investování stejné částky: postupně nakupujete za různé kurzy, čímž rozložíte riziko špatného načasování. U krátkého horizontu (do 3 let) je kurzové riziko významnější – tam dává smysl vyšší podíl korunových aktiv. Měnové zajištění proti koruně reálně k dispozici není.',
    },
    {
      q: 'Co přesně kalkulačka počítá a co ne?',
      a: 'Kalkulačka izoluje samotný dopad pohybu kurzu na korunovou hodnotu portfolia podle zadané měnové expozice. Nepočítá výnos samotných akcií ani inflaci či poplatky – ukazuje čistě, jak kurz zvětší nebo zmenší to, co máte. Scénáře vycházejí z historicky pozorovaných pohybů kurzu koruny vůči dolaru a euru a jsou orientační.',
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
      { '@type': 'ListItem', position: 3, name: 'Kalkulačka kurzového dopadu', item: 'https://www.etfpruvodce.cz/kalkulacky/kurzovy-dopad' },
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
          <span className="text-slate-600">Kalkulačka kurzového dopadu</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Kalkulačka kurzového dopadu</h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Zjistěte, jak pohyb kurzu dolaru a eura vůči koruně promění výnos vašeho ETF{' '}
                  <InfoTip label="Výnos fondu v měně aktiv přepočítaný kurzem na koruny. To je částka, kterou reálně máte na účtu v Kč.">v přepočtu na koruny</InfoTip>
                  {' '}– odděleně od toho, jak si vedly samotné akcie.
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

              {/* Mini-přehled – samostatné karty, BEZ šipek a vzorců */}
              <div className="mt-6 md:mt-0 md:w-72 shrink-0 grid grid-cols-3 md:grid-cols-1 gap-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Zadáte</p>
                  <p className="text-lg font-bold tabular-nums">Měnová expozice</p>
                  <p className="text-xs text-slate-400">USD / EUR / CZK podíl</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Spočítáme</p>
                  <p className="text-lg font-bold tabular-nums text-emerald-400">Dopad kurzu</p>
                  <p className="text-xs text-slate-400">na korunovou hodnotu</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Uvidíte</p>
                  <p className="text-lg font-bold tabular-nums">Scénáře v Kč</p>
                  <p className="text-xs text-slate-400">graf + hodnoty v korunách</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROČ NA KURZU ZÁLEŽÍ – edukace NAD kalkulačkou (text + tip, žádné schéma) */}
        <section className="pb-10">
          <SectionHead title="Proč na kurzu u ETF záleží" desc="Krátké vysvětlení, než si spočítáte vlastní případ." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Většina populárních ETF drží americké nebo globální akcie, jejichž hodnota je v{' '}
              <strong className="text-slate-900">dolarech či eurech</strong>. Vy ale žijete a počítáte v{' '}
              <strong className="text-slate-900">korunách</strong>. Mezi výnosem fondu a tím, co reálně máte na účtu, proto
              stojí ještě jeden krok: <strong className="text-slate-900">přepočet kurzem</strong>. Když dolar vůči koruně
              posílí, váš korunový výnos vzroste i bez pohybu akcií. Když oslabí, část výnosu se ztratí.
            </p>

            <div className="mt-4 rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-900 flex items-center gap-2.5">
              <RefreshCcw className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                Rozhoduje měna <strong>podkladových aktiv</strong>, ne měna, ve které fond obchodujete. To je nejčastější omyl.
              </span>
            </div>
          </div>
        </section>

        {/* KALKULAČKA */}
        <section id="kalkulacka" className="pb-10 scroll-mt-16">
          <SectionHead title="Spočítejte si dopad kurzu" desc="Zadejte hodnotu portfolia, měnovou expozici a aktuální kurzy. Scénáře i graf se přepočítají hned." />
          <KurzovyDopadWidget />
        </section>

        {/* JAK ČÍST MĚNOVOU EXPOZICI – ikonové karty, BEZ šipek */}
        <section className="pb-10">
          <SectionHead title="Jak číst měnovou expozici" desc="Tři pojmy, které u kurzového rizika rozhodují." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Kurzové riziko nezávisí na názvu fondu ani na měně, ve které ho kupujete, ale na tom, v jakých měnách jsou
              jeho <strong className="text-slate-900">skutečná aktiva</strong>. Tady jsou tři pojmy, které k tomu potřebujete.
            </p>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {([
                [DollarSign, 'Měna aktiv', (
                  <>
                    Rozhoduje, v jaké měně jsou akcie fondu. Fond na americké akcie = dolarová expozice, i když ho kupujete
                    v eurech.
                  </>
                )],
                [ShieldAlert, 'Kurzová expozice', (
                  <>
                    Část portfolia v cizí měně, jejíž korunová hodnota{' '}
                    <InfoTip label="Korunová část portfolia se kurzem nemění. Kurzové riziko nese jen část v dolaru, euru a dalších cizích měnách.">se mění s kurzem</InfoTip>
                    . Korunová část je vůči kurzu klidná.
                  </>
                )],
                [Banknote, 'Měnové zajištění', (
                  <>
                    <InfoTip label="Anglicky „hedging“. Fond, který smluvně zafixuje kurz mezi dvěma měnami. Proti koruně ale takové fondy prakticky nejsou – zajišťují jen EUR vůči USD.">Měnově zajištěné</InfoTip>
                    {' '}fondy proti koruně reálně neexistují – řeší jen vztah eura a dolaru.
                  </>
                )],
              ] as [typeof DollarSign, string, ReactNode][]).map(([Icon, t, d]) => (
                <div key={t} className="rounded-lg bg-slate-50 p-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-teal-700 border border-slate-200 mb-3"><Icon className="w-4 h-4" /></span>
                  <p className="font-medium text-slate-900 text-sm">{t}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ČESKÝ ÚHEL – co kalkulačka počítá */}
        <section className="pb-10">
          <SectionHead title="Co kalkulačka počítá – a co ne" desc="Aby čísla nebudila falešný dojem přesnosti." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Kalkulačka <strong className="text-slate-900">izoluje samotný dopad kurzu</strong> na korunovou hodnotu
              portfolia podle zadané měnové expozice. Nezahrnuje výnos samotných akcií, inflaci ani poplatky – ukazuje
              čistě, jak kurz zvětší nebo zmenší to, co máte. Scénáře vycházejí z historicky pozorovaných pohybů kurzu
              koruny vůči dolaru a euru a jsou orientační.
            </p>
            <p className="mt-3">
              <Link href="/design-preview/pruvodce" className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium text-sm">
                Více o tom, jak ETF fungují <ArrowRight className="w-4 h-4" />
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
              [Database, 'Ověřená metodika', `Stejný výpočet jako naše původní kalkulačka kurzového dopadu. Aktualizováno ${dateStr}.`],
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
              ['/design-preview/investicni-kalkulacka', 'Investiční kalkulačka', PiggyBank],
              ['/design-preview/kalkulacka', 'Kalkulačka poplatků', Scale],
              ['/design-preview/srovnani', 'Srovnání ETF', TrendingUp],
              ['/design-preview/kde-koupit', 'Kde koupit ETF', Landmark],
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
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Kalkulačku stavíme nezávisle – výpočet vychází z ověřené metodiky kurzového dopadu na korunovou hodnotu portfolia.
                  <Link href="/design-preview/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Metodika: dopad pohybu kurzu USD/CZK a EUR/CZK na nezajištěnou měnovou expozici portfolia; rizikové metriky z historických volatilit. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Kalkulačka má vzdělávací charakter; kurzové scénáře jsou orientační a skutečný vývoj kurzu nelze zaručit.</p>
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
