import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, ShieldCheck, Coins, Receipt, ArrowLeftRight,
  PieChart, MessageCircle, Landmark, BookOpen, Calculator, BarChart3, Star,
} from 'lucide-react';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import SrovnaniBrokeruClient from '@/components/design-preview/SrovnaniBrokeruClient';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import { ProfilKarty, RoboKarta, FaqSeznam, doporuceniProfily } from '@/components/design-preview/brokerUI';
import { brokeriPodleSkore, roboPoradci, cenikyOverenyIso, cenikyOverenyStr } from '@/data/brokerData';
import { getDataDate, getTotalETFCount } from '@/lib/etf-data';
import { nactiKurzCnb } from '@/lib/kurzCnb';

/* /srovnani-brokeru = DETAILNÍ TABULKA parametrů. Průvodce „kde koupit“ (rozhodnutí + spočítané náklady)
   je na /kde-koupit; doporučení podle profilu je na obou stránkách ZE STEJNÉHO zdroje (brokerUI). */

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Srovnání brokerů pro ETF 2026 – poplatky, ochrana, daně, skóre',
  description:
    'Srovnání 5 brokerů pro ETF se skóre /100 a robo-poradce Portu: poplatek za nákup, směna měny, ochrana hotovosti a cenných papírů, zdanění českých dividend.',
  alternates: { canonical: '/srovnani-brokeru' },
};

/* Pořadí dle skóre (jen brokeři); robo-poradce je jiná kategorie bez skóre (revize 18. 10. 2026). */
const ordered = [...brokeriPodleSkore, ...roboPoradci];

/* Na co u brokera koukat – ikonové vysvětlivky. */
const WATCH = [
  { icon: Coins, title: 'Poplatek za nákup', text: 'U malých částek rozhodují pevné a minimální poplatky za pokyn.' },
  { icon: ArrowLeftRight, title: 'Směna měny', text: 'Přirážka při směně korun na eura se platí při každém nákupu z korun.' },
  { icon: ShieldCheck, title: 'Regulace a ochrana', text: 'Hotovost a cenné papíry chrání různé systémy s různými limity.' },
  { icon: Receipt, title: 'Daň z českých dividend', text: '15 nebo 35 % podle brokera. Akumulačních ETF se to netýká.' },
  { icon: PieChart, title: 'Část podílu', text: 'Frakce umožní investovat přesnou částku, třeba 2 000 Kč měsíčně.' },
  { icon: MessageCircle, title: 'Česká podpora', text: 'Komunikace a daňové podklady v češtině šetří čas i chyby.' },
] as const;

const FAQ = [
  {
    q: 'Který broker je pro ETF nejbezpečnější?',
    a: 'Bezpečnost stojí na regulaci a ochraně, a ta se liší podle typu majetku. Hotovost na účtu u bank (Fio, DEGIRO přes flatexDEGIRO Bank) kryje pojištění vkladů do 100 000 EUR. U ostatních (XTB, Trading 212, IBKR, Portu) kryje hotovost i cenné papíry garanční fond se společným limitem kolem 20 000 EUR. Samotná ETF jsou vedená odděleně od majetku brokera – garanční fond nastupuje, kdyby při krachu brokera chyběla. U IBKR pro české klienty platí irský systém (20 000 EUR); americké SIPC se vztahuje jen na americkou entitu.',
  },
  {
    q: 'Jak se daní dividendy – 15 nebo 35 %?',
    a: 'Jsou to dva různé mechanismy. U amerických cenných papírů je bez formuláře W-8BEN srážková daň 30 %; s W-8BEN ji smlouva ČR–USA snižuje na 15 %. U irských UCITS ETF řeší srážku z amerických dividend správce fondu (15 %) a W-8BEN vůbec neřešíte – proto se pro Čechy volí irské fondy. Sazba 35 % je naopak český strop, který hrozí u dividend z nedoložených či nesmluvních zdrojů (typicky když dividendu vyplácí zahraniční broker bez statusu tuzemského plátce) – rozdíl pak dorovnáte v daňovém přiznání. Jde o zdanění dividend, ne kapitálových zisků.',
  },
  {
    q: 'Můžu mít účet u více brokerů najednou?',
    a: 'Ano. Kombinace je běžná – například levný nákup u jednoho brokera a robo-poradce pro automatickou část. Jen si hlídejte přehled o poplatcích a daních.',
  },
  {
    q: 'S jakým minimálním vkladem se dá začít?',
    a: 'DEGIRO, XTB, Fio a IBKR minimální vklad nemají, Trading 212 začíná od 1 EUR, Portu od 500 Kč. Reálně rozhoduje spíš poplatek za nákup u malé částky – spočítaný je na stránce Kde koupit ETF.',
  },
  {
    q: 'Kdo nabízí českou podporu?',
    a: 'Česky komunikují XTB (Po–Pá 8–18), Fio (infolinka Po–Pá 9–17) a Portu (pracovní dny). DEGIRO má web v češtině, ale podporu jen anglicky; Trading 212 a Interactive Brokers jen anglicky.',
  },
] as const;

export default async function SrovnaniBrokeruPage() {
  const published = '2026-01-10T08:00:00+01:00';
  const modified = (await getDataDate(new Date())).toISOString();
  const etfCount = await getTotalETFCount();
  const etfCountLabel = etfCount > 0 ? etfCount.toLocaleString('cs-CZ') : '—';
  const kurzy = await nactiKurzCnb();
  // Štítek „pro koho“ v hlavičce tabulky = stejné doporučení jako na /kde-koupit (jeden zdroj).
  const profil: Record<string, string> = {};
  for (const p of doporuceniProfily(kurzy)) profil[p.brokerId] ??= p.profil;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Kde koupit ETF', item: 'https://etfpruvodce.cz/kde-koupit' },
      { '@type': 'ListItem', position: 3, name: 'Srovnání brokerů pro ETF', item: 'https://etfpruvodce.cz/srovnani-brokeru' },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Srovnání brokerů pro ETF',
    itemListElement: ordered.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, url: `https://etfpruvodce.cz${reviewHref[b.id]}` })),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
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

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <SiteNav />
          <HeaderSearch />
        </div>
      </header>

      <main id="obsah" className="max-w-6xl mx-auto px-4">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <Link href="/kde-koupit" className="hover:text-slate-700">Kde koupit ETF</Link>
          <span>/</span>
          <span className="text-slate-700">Srovnání brokerů</span>
        </nav>

        <section data-sekce="hero" className="pb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Srovnání brokerů pro ETF 2026</h1>
          <p className="mt-2 max-w-2xl text-base text-slate-600 leading-relaxed">
            {brokeriPodleSkore.length} brokerů vedle sebe: poplatky, směna měny, ochrana hotovosti i cenných papírů, daně a podpora.
            Kolik stojí konkrétní nákup, máme spočítané na stránce <Link href="/kde-koupit#naklady" className="text-teal-700 underline underline-offset-2 hover:text-teal-800">Kde koupit ETF</Link>.
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
            <span>Ceníky ověřeny <time dateTime={cenikyOverenyIso}>{cenikyOverenyStr}</time></span>
            <span aria-hidden>·</span>
            <span>bez provizí a reklamy</span>
            <span aria-hidden>·</span>
            <Link href="/kde-koupit#metodika" className="hover:text-slate-700 underline underline-offset-2">jak počítáme skóre</Link>
          </p>
        </section>

        <section data-sekce="tabulka" className="space-y-3">
          <h2 className="sr-only">Srovnávací tabulka brokerů</h2>
          <SrovnaniBrokeruClient profil={profil} />
          <RoboKarta />
        </section>

        <section data-sekce="profily" className="py-10 md:py-14">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Doporučení podle situace</h2>
          <p className="mt-1 mb-5 text-sm text-slate-500">Jeden broker na každou situaci – stejné doporučení jako v průvodci Kde koupit ETF.</p>
          <ProfilKarty kurzy={kurzy} />
        </section>

        <section data-sekce="na-co-koukat" className="pb-10 md:pb-14">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Na co u brokera koukat</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WATCH.map((w) => (
              <div key={w.title} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 shrink-0"><w.icon className="w-5 h-5" /></span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{w.title}</span>
                  <span className="block text-sm text-slate-600 mt-0.5 leading-snug">{w.text}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section data-sekce="faq" className="pb-10 md:pb-14">
          <h2 className="mb-5 text-2xl font-bold tracking-tight text-slate-900">Časté otázky</h2>
          <FaqSeznam items={FAQ} />
        </section>

        <section data-sekce="dal" className="pb-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pokračujte dál</h2>
          <div className="mt-5 grid gap-3 grid-cols-2 lg:grid-cols-4">
            {[
              { href: '/kde-koupit', label: 'Kde koupit ETF', desc: 'Který broker a kolik stojí nákup.', icon: Landmark },
              { href: '/srovnani', label: 'Srovnání ETF fondů', desc: `Porovnejte ${etfCountLabel} fondů.`, icon: BarChart3 },
              { href: '/jak-zacit', label: 'Jak začít investovat', desc: 'Od základů k prvnímu nákupu.', icon: BookOpen },
              { href: '/kalkulacky', label: 'Kalkulačky', desc: 'Poplatky, výnosy i daně.', icon: Calculator },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 transition-colors">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3"><l.icon className="w-5 h-5" /></span>
                <span className="block text-sm font-semibold text-slate-900">{l.label}</span>
                <span className="block text-xs text-slate-500 mt-1 leading-snug">{l.desc}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-teal-50 text-teal-700 shrink-0"><Star className="w-4 h-4" /></span>
            <span>
              <span className="font-medium text-slate-800">Autor: Tomáš Kostrhoun.</span>{' '}
              Skóre /100 je redakční hodnocení – nejvíc vážíme poplatky za nákup a směnu, zdanění českých dividend a regulaci
              s ochranou prostředků. Není to placené pořadí. Zdroje: veřejné ceníky brokerů (ověřeny{' '}
              <time dateTime={cenikyOverenyIso}>{cenikyOverenyStr}</time>), ČNB. Před založením účtu si podmínky ověřte i na webu brokera.
            </span>
          </div>
        </section>

        <section className="pb-12">
          <InvestmentDisclaimer variant="box" />
        </section>
      </main>
    </div>
  );
}
