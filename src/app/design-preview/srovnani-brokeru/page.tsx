import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, ShieldCheck, Coins, Receipt, ArrowLeftRight,
  PieChart, MessageCircle, Sparkles, Landmark, Bot, Building2, BookOpen,
  Wallet, Calculator, BarChart3, Star,
} from 'lucide-react';
import InfoTip from '@/components/design-preview/InfoTip';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import SrovnaniBrokeruClient from '@/components/design-preview/SrovnaniBrokeruClient';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import { brokers } from '@/data/brokerData';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Srovnání brokerů pro ETF 2026 – poplatky, daně, skóre | ETF průvodce',
  description:
    '6 brokerů pro ETF se skóre /100: srovnání poplatků za nákup, konverze měn a zdanění českých dividend 15 vs 35 %. Redakční hodnocení pro české investory.',
  alternates: { canonical: '/design-preview/srovnani-brokeru' },
};

/* Pořadí dle skóre pro schema i profilové karty. */
const ordered = [...brokers].sort((a, b) => b.rating - a.rating);

/* Doporučení podle profilu – vzájemně odlišné osy (pravidlo 7). */
const PROFILES = [
  {
    icon: Sparkles,
    title: 'Začátečník',
    brokerId: 'trading212',
    alt: 'xtb',
    name: 'Trading 212 / XTB',
    why: 'Jednoduché ovládání, nákup ETF bez komisí a frakční investování – začnete i s pár stovkami.',
  },
  {
    icon: Building2,
    title: 'Aktivní a zkušený',
    brokerId: 'ibkr',
    alt: 'degiro',
    name: 'Interactive Brokers / DEGIRO',
    why: 'Nejnižší náklady při větším objemu a nejširší nabídka burz i nástrojů.',
  },
  {
    icon: Bot,
    title: 'Bez starostí',
    brokerId: 'portu',
    name: 'Portu',
    why: 'Robo-poradce složí a spravuje portfolio za vás, stačí 500 Kč na start.',
  },
  {
    icon: Landmark,
    title: 'České akcie a jednoduché daně',
    brokerId: 'fio',
    name: 'Fio e-Broker',
    why: 'Standardní 15% zdanění českých dividend, kurz ČNB a kompletní podpora v češtině.',
  },
] as const;

/* Ikonové vysvětlivky – na co u brokera koukat (žádné box-šipka schéma). */
const WATCH = [
  { icon: Coins, title: 'Poplatky za ETF', text: 'Komise za nákup i roční náklady; u malých částek rozhodují fixní poplatky.' },
  { icon: Receipt, title: 'Zdanění dividend 15 vs 35 %', text: 'U dividend z fondů s americkou expozicí může broker srazit 35 %, jinde platí českých 15 %.' },
  { icon: ArrowLeftRight, title: 'Konverze měn', text: 'Přirážka při směně CZK na EUR/USD se opakuje při každém vkladu i nákupu.' },
  { icon: PieChart, title: 'Frakční investování', text: 'Umožní koupit část akcie či ETF za pevnou částku – ideální pro pravidelné menší vklady.' },
  { icon: ShieldCheck, title: 'Regulace a ochrana', text: 'Pod kým broker spadá (ČNB, BaFin, CySEC) a do jaké výše jsou kryté vaše prostředky.' },
  { icon: MessageCircle, title: 'Česká podpora', text: 'Komunikace, dokumentace i daňové podklady v češtině šetří čas i chyby.' },
] as const;

/* FAQ – odpovědi konzistentní s tabulkou (skóre /100, daně 15/35, min. vklady). */
const FAQ = [
  {
    q: 'Který broker je pro ETF nejbezpečnější?',
    a: 'Bezpečnost stojí na regulaci a ochraně prostředků. Nejvýše hodnocené jsou Portu (98/100), XTB (94/100) a Trading 212 (87/100). Fio i Portu jsou pod dohledem české ČNB. Ochrana se ale liší podle typu firmy: u bank (Fio, DEGIRO přes flatexDEGIRO) je hotovost pojištěná do 100 000 EUR, u nebankovních brokerů (XTB, Trading 212, IBKR) chrání investice garanční schéma obvykle do 20 000 EUR. U IBKR pro české klienty platí irský systém ICS (20 000 EUR); americké SIPC (500 000 USD) se vztahuje jen na americkou entitu, ne na klienty IBKR Ireland. Vyšší skóre navíc neznamená automaticky „nejbezpečnější pro vás" – záleží i na poplatcích a nabídce.',
  },
  {
    q: 'Jak se daní dividendy – 15 nebo 35 %?',
    a: 'Jsou to dva různé mechanismy. U amerických cenných papírů je bez formuláře W-8BEN srážková daň 30 %; s W-8BEN ji smlouva ČR–USA snižuje na 15 %. U irských UCITS ETF řeší srážku z amerických dividend správce fondu (15 %) a W-8BEN vůbec neřešíte – proto se pro Čechy volí irské fondy. Sazba 35 % je naopak český strop, který hrozí u dividend z nedoložených či nesmluvních zdrojů (typicky když dividendu vyplácí zahraniční broker bez statusu tuzemského plátce) – rozdíl pak dorovnáte v daňovém přiznání. Jde o zdanění dividend, ne kapitálových zisků.',
  },
  {
    q: 'Můžu mít účet u více brokerů najednou?',
    a: 'Ano. Kombinace je běžná – například levný nákup u jednoho brokera a robo-poradce (Portu) pro automatickou část. Více účtů nemá žádné právní omezení, jen si hlídejte přehled o poplatcích a daních.',
  },
  {
    q: 'S jakým minimálním vkladem se dá začít?',
    a: 'Většina brokerů nemá minimální vklad (DEGIRO, XTB, Fio, IBKR – 0). Trading 212 začíná od 1 EUR, Portu od 500 Kč. Reálně rozhoduje spíš velikost první investice a poplatková struktura, ne formální minimum.',
  },
  {
    q: 'Kdo nabízí českou podporu?',
    a: 'Plně česky komunikují XTB (24/7), Fio (8–18) a Portu (9–17), částečně DEGIRO. Trading 212 a Interactive Brokers nabízejí podporu jen v angličtině.',
  },
  {
    q: 'Jak rychle můžu začít investovat?',
    a: 'Účet u brokerů s českou podporou (XTB, Fio, Portu) bývá ověřen v řádu hodin až jednoho dne. Po vkladu a směně měny můžete zadat první nákup ETF prakticky ihned.',
  },
] as const;

export default async function SrovnaniBrokeruPage() {
  const published = '2026-01-10T08:00:00+01:00';
  // Datum aktualizace = 1. den aktuálního měsíce (viz MAINTENANCE-mesicni-kontrola.md).
  const now = new Date();
  const firstOfMonth = (await getDataDate(now));
  const modified = firstOfMonth.toISOString();
  const dateStr = firstOfMonth.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://www.etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Kde koupit ETF', item: 'https://www.etfpruvodce.cz/kde-koupit-etf' },
      { '@type': 'ListItem', position: 3, name: 'Srovnání brokerů pro ETF 2026', item: 'https://www.etfpruvodce.cz/srovnani-brokeru' },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Srovnání brokerů pro ETF 2026',
    itemListElement: ordered.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      url: `https://www.etfpruvodce.cz${reviewHref[b.id]}`,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Srovnání brokerů pro ETF 2026',
    author: { '@type': 'Person', name: 'Tomáš Kostrhoun' },
    datePublished: published,
    dateModified: modified,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Header – stejná navigace jako homepage */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/design-preview/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/design-preview/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/design-preview/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/design-preview/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/design-preview/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* 1. Hero / H1 + USP */}
        <section className="py-8 md:py-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Srovnání brokerů pro ETF 2026
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 leading-relaxed">
            Porovnání brokerů podle českých kritérií: poplatky za nákup ETF, zdanění
            českých dividend, podpora v češtině a minimální vklad. Vše přepočtené na
            korunový pohled českého investora.
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
            <span>6 brokerů</span>
            <span aria-hidden>·</span>
            <span>aktualizováno {dateStr}</span>
            <span aria-hidden>·</span>
            <span>redakční skóre /100</span>
          </p>
        </section>

        {/* Nezávislost / nekomerčnost */}
        <p className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 leading-relaxed">
          <span className="font-medium text-emerald-700">Nezávislé a nekomerční:</span> nebereme žádné provize ani reklamu. Odkazy na brokery jsou jen pro vaše pohodlí; skóre hodnotíme podle stejných kritérií pro všechny.
        </p>

        {/* 2. Srovnávací tabulka */}
        <section>
          <h2 className="sr-only">Srovnávací tabulka brokerů</h2>
          <SrovnaniBrokeruClient />
        </section>

        {/* 3. Doporučení podle profilu */}
        <section className="py-10 md:py-14">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Doporučení podle profilu</h2>
          <p className="mt-1 text-sm text-slate-500">Vyberte podle toho, jak chcete investovat – ne každý broker sedí každému.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROFILES.map((p) => {
              const broker = brokers.find((b) => b.id === p.brokerId)!;
              return (
                <div key={p.title} className="flex flex-col rounded-lg border border-slate-200 bg-white p-5">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3">
                    <p.icon className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">{p.title}</h3>
                  <p className="mt-1 text-sm font-medium text-teal-700">{p.name}</p>
                  <p className="mt-2 flex-1 text-sm text-slate-600 leading-relaxed">{p.why}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="tabular-nums text-sm font-bold text-slate-900">
                      {broker.rating}<span className="text-slate-400 font-medium text-xs">/100</span>
                    </span>
                    <Link href={reviewHref[p.brokerId]} className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
                      Recenze <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Na co u brokera koukat (edukace) */}
        <section className="pb-10 md:pb-14">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Na co u brokera koukat</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 leading-relaxed">
            Šest věcí, které u brokera pro ETF rozhodují nejvíc. Pojmy jako{' '}
            <InfoTip label="Roční poplatek za správu fondu; strhává se automaticky z hodnoty.">TER</InfoTip>,{' '}
            <InfoTip label="Nákup části akcie nebo ETF za pevnou částku, ne za celý kus.">frakční investování</InfoTip>{' '}
            nebo rozdíl mezi{' '}
            <InfoTip label="Sráží se u zdroje u dividend z fondů s americkou expozicí; část lze získat zpět přes daňové přiznání.">srážkovou daní 35 %</InfoTip>{' '}
            a{' '}
            <InfoTip label="České standardní zdanění dividend.">15 %</InfoTip>{' '}
            vysvětlujeme přímo v textu.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WATCH.map((w) => (
              <div key={w.title} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 shrink-0">
                  <w.icon className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{w.title}</span>
                  <span className="block text-sm text-slate-600 mt-0.5 leading-relaxed">{w.text}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FAQ */}
        <section className="pb-10 md:pb-14">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Časté otázky</h2>
          <div className="mt-5 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-lg border border-slate-200 bg-white p-4">
                <summary className="flex cursor-pointer items-center justify-between gap-3 text-base font-semibold text-slate-900 list-none">
                  <h3 className="text-base font-semibold">{f.q}</h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 6. Prolinky + E-E-A-T */}
        <section className="pb-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pokračujte dál</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: '/design-preview/kde-koupit', label: 'Kde koupit ETF', desc: 'Výběr brokera v ČR krok za krokem.', icon: Landmark },
              { href: '/design-preview/srovnani', label: 'Srovnání ETF fondů', desc: 'Porovnejte 4 300+ fondů podle kritérií.', icon: BarChart3 },
              { href: '/design-preview/jak-zacit', label: 'Jak začít investovat', desc: 'Od základů k prvnímu nákupu.', icon: BookOpen },
              { href: '/design-preview/kalkulacky', label: 'Kalkulačky', desc: 'Poplatky, výnosy i daně spočítané.', icon: Calculator },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="group flex flex-col rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3 group-hover:bg-teal-100 transition-colors">
                  <l.icon className="w-5 h-5" />
                </span>
                <span className="block text-sm font-semibold text-slate-900">{l.label}</span>
                <span className="block text-xs text-slate-500 mt-1 leading-snug">{l.desc}</span>
              </Link>
            ))}
          </div>

          {/* E-E-A-T řádek */}
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-teal-50 text-teal-700 shrink-0">
              <Star className="w-4 h-4" />
            </span>
            <span>
              <span className="font-medium text-slate-800">Autor: Tomáš Kostrhoun.</span>{' '}
              Skóre /100 je redakční hodnocení – nejvíc vážíme to, co dlouhodobému
              českému investorovi do ETF ušetří peníze a ochrání je: poplatky za nákup
              a konverzi měn, zdanění českých dividend a regulaci s ochranou prostředků.
              Menší váhu má frakční investování, česká podpora a minimální vklad.
              Není to placené pořadí a čísla neurčuje žádný broker.
            </span>
          </div>
        </section>

        {/* Disclaimer na úplný konec */}
        <section className="pb-12">
          <InvestmentDisclaimer variant="box" />
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
