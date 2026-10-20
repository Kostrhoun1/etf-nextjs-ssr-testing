import { Metadata } from 'next';
import Link from 'next/link';
import { clanekSchema } from '@/lib/redakce';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, ArrowRight, ShieldCheck, CalendarDays, Percent, Layers, Landmark,
  Headphones, ListChecks, Table2,
} from 'lucide-react';
import {
  ProfilKarty, FaqSeznam, BrokerLogo, AutorBox, AutorZnak,
} from '@/components/design-preview/brokerUI';
import NakladyKalkulacka from '@/components/design-preview/NakladyKalkulacka';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { brokers, brokeriAbecedne, nejlevnejsiPodleCastky, nakladNakupu, cenikyOverenyIso, cenikyOverenyStr, type Kurzy } from '@/data/brokerData';
import { FondHero, BezFondu } from './FondZDetailu';
import { FondProvider } from '@/components/design-preview/FondKontext';
import { nactiKurzCnb, datumKurzu } from '@/lib/kurzCnb';

/* /kde-koupit = PRŮVODCE „kde koupit ETF“: živě spočítané náklady pro zadanou částku + rozhodnutí podle profilu.
   Detailní tabulka parametrů je jen na /srovnani-brokeru (dřív se stránky překrývaly – dvě tabulky,
   dvojí doporučení, revize 18. 10. 2026). Doporučení i náklady jsou ze sdíleného brokerUI. */

export const revalidate = 86400;
/* Odpověď nahoře (SEO/GEO, kolo 6): „za 2 000 Kč měsíčně vychází podle ceníků k … nejlevněji …“ – STEJNÝ výpočet jako hero
   a kalkulačka (nejlevnejsiPodleCastky / nakladNakupu z brokerData + kurz ČNB s datem). Fakt z ceníků, ne doporučení.
   Bez kurzu ČNB žádná korunová částka (pravidlo č. 1). Hlídá scripts/check-fund-data.mjs (kolo6 seo zebricky). */
const UKAZKOVA_CASTKA = 2000;
function nejlevnejsiUkazka(kurzy: Kurzy | null) {
  if (!kurzy) return null;
  const b = nejlevnejsiPodleCastky(kurzy, UKAZKOVA_CASTKA, UKAZKOVA_CASTKA)[0]?.b ?? null;
  const n = b ? nakladNakupu(b, UKAZKOVA_CASTKA, kurzy) : null;
  if (!b || !n || n.celkemKc == null) return null;
  return { b, kc: n.celkemKc, jmeno: `${b.name}${b.nakup?.ostatniEtfEur != null ? ' (ETF Selection)' : ''}` };
}
const kcPresne = (v: number) => `${v < 10 ? v.toLocaleString('cs-CZ', { maximumFractionDigits: 1 }) : Math.round(v).toLocaleString('cs-CZ')}\u00a0Kč`;
const cenikyCisla = new Date(`${cenikyOverenyIso}T00:00:00Z`).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });

export async function generateMetadata(): Promise<Metadata> {
  const kurzy = await nactiKurzCnb(); // stejný fetch jako stránka (cache 1 den) – žádný dotaz navíc
  const u = nejlevnejsiUkazka(kurzy);
  const s = brokeriAbecedne.filter((b) => b.nakup);
  const jmena = s.map((b) => b.name.replace(' e-Broker', '').replace('Interactive Brokers', 'IBKR'));
  const seznam = `${jmena.slice(0, -1).join(', ')} a ${jmena[jmena.length - 1]}`;
  const zaklad = `Nákup ETF u ${seznam}: poplatek i směna v Kč podle kurzu ČNB.`;
  const varianty = u ? [
    `${zaklad} Za 2\u00a0000\u00a0Kč vychází podle ceníků k ${cenikyCisla} nejlevněji u ${u.jmeno} (${kcPresne(u.kc)}).`,
    `${zaklad} Za 2\u00a0000\u00a0Kč je podle ceníků k ${cenikyCisla} nejlevnější ${u.jmeno}.`,
  ] : [];
  const description = varianty.find((t) => t.length <= 160) ?? `${zaklad} Ceníky ověřeny ${cenikyCisla}, náklady pro vaši měsíční částku.`;
  return {
    // Self-canonical: na stránku vedou odkazy s parametry (FB, presety, přesměrování) – ty
    // nemají být samostatné URL ve vyhledávači (deep dive 17. 10. 2026).
    alternates: { canonical: '/kde-koupit' },
    title: { absolute: `Kde koupit ETF v Česku ${new Date().getFullYear()}: náklady nákupu u ${s.length} brokerů` },
    description,
  };
}

const kcText = (v: number) => `${Math.round(v).toLocaleString('cs-CZ')}\u00a0Kč`;

export default async function KdeKoupitPage() {
  const year = new Date().getFullYear();
  const kurzy = await nactiKurzCnb();
  const ukazka = nejlevnejsiUkazka(kurzy);

  // Hero: nejlevnější nákup PODLE ČÁSTKY („do 16 200 Kč Trading 212, nad DEGIRO“) – spočítané z ceníků, ne natvrdo.
  // Kolo 4: dřív pevně „za 2 000 Kč“, takže při zadání 50 000 Kč hero tvrdil něco jiného než tabulka pod ním.
  const useky = kurzy ? nejlevnejsiPodleCastky(kurzy) : [];
  const nejlevnejsiRadky = useky.length > 0 && useky.length <= 3
    ? useky.map((u, i) => ({
        k: useky.length === 1 ? 'Nejlevnější nákup'
          : i === 0 ? `Nejlevnější do ${kcText(u.doKc)}`
          : i === useky.length - 1 ? `Nejlevnější nad ${kcText(useky[i - 1].doKc)}`
          : `Nejlevnější ${kcText(u.odKc)}–${kcText(u.doKc)}`,
        v: u.b ? `${u.b.name}${u.b.nakup?.ostatniEtfEur != null ? ' (ETF Selection)' : ''}` : '—',
      }))
    : [{ k: 'Nejlevnější nákup', v: kurzy ? 'podle částky – viz tabulka' : '—' }];
  const bezProvize = brokeriAbecedne.filter((b) => b.nakup && b.nakup.pasma.every((p) => p.pevneEur === 0 && p.procento === 0 && p.minEur === 0));
  const cesky = brokers.filter((b) => b.czSupport);

  // Co u každého brokera uvádíme – stejné údaje pro všechny, BEZ bodování a vah (skóre /100 zrušeno 19. 10. 2026).
  const axes = [
    { icon: Percent, t: 'Náklady nákupu', d: 'Poplatek za nákup ETF a směna korun na eura, spočítané z ceníku pro vaši částku.' },
    { icon: ShieldCheck, t: 'Ochrana', d: 'Hotovost na účtu a cenné papíry při krachu brokera.' },
    { icon: Landmark, t: 'Regulace a daně', d: 'Kdo brokera dohlíží a kolik sráží z českých dividend.' },
    { icon: Layers, t: 'Část podílu', d: 'Zda koupíte ETF i za částku menší než jeden podíl.' },
    { icon: Headphones, t: 'Česká podpora', d: 'Zda broker komunikuje česky.' },
    { icon: ListChecks, t: 'Min. vklad a vedení účtu', d: 'Kolik musíte poslat a zda účet něco stojí.' },
  ];

  const faqs = [
    {
      q: 'Kde koupím ETF nejlevněji?',
      a: 'Skutečný náklad = poplatek za nákup + směna korun na eura. U malých nákupů vycházejí nejlevněji brokeři bez provize s levnou směnou (tabulka výše je spočítaná z ceníků). U větších jednorázových nákupů vychází levněji pevný poplatek bez přirážky za směnu (DEGIRO). Minimální poplatky (IBKR, Fio) prodražují hlavně malé částky.',
    },
    {
      q: 'Jsou ETF u DEGIRO opravdu zdarma?',
      a: 'Ne úplně. Fondy z výběru ETF Selection koupíte za 1 EUR manipulační poplatek, ostatní ETF za 3 EUR a u nich platíte i až 2,5 EUR ročně za připojení k burze. Směna CZK/EUR je zdarma, takže u jednoho většího nákupu měsíčně jsou náklady nízké.',
    },
    {
      q: 'Proč některý broker sráží 35 % z dividend?',
      a: 'U dividend z českých akcií rozhoduje, zda broker umí doložit, komu dividenda patří. Fio a Portu srazí 15 %, zahraniční brokeři se sběrným účtem (XTB, DEGIRO, IBKR) 35 %. U akumulačních ETF se vás to přímo netýká – dividendy řeší fond uvnitř.',
    },
    {
      q: 'Co je frakční nákup a kdy ho potřebuju?',
      a: 'Frakční nákup = koupě části podílu ETF za přesnou částku, třeba 2 000 Kč, i když jeden podíl stojí víc. Hodí se při pravidelném investování menších částek. Nabízí ho XTB, Trading 212, Interactive Brokers a robo-poradce Portu.',
    },
    {
      q: 'Musím vyplňovat formulář W-8BEN?',
      a: 'Pro evropské (UCITS) ETF se sídlem v Irsku nebo Lucembursku ne – srážku z amerických dividend řeší správce fondu. W-8BEN se týká přímého držení amerických akcií.',
    },
    {
      q: 'Robo-poradce, nebo broker?',
      a: 'Robo-poradce (Portu) za vás sestaví a spravuje portfolio ETF za roční poplatek z celé hodnoty. U brokera si fondy vybíráte a kupujete sami a platíte jen za nákup. Proto Portu uvádíme zvlášť.',
    },
  ];

  /* ---------- JSON-LD ---------- */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Kde koupit ETF', item: 'https://etfpruvodce.cz/kde-koupit' },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  // Article: autor + vydavatel + datum zveřejnění (src/lib/redakce.ts); datum úpravy = pozdější z poslední úpravy
  // stránky a dne ověření ceníků (SEO audit 20. 10. 2026 – dřív bez datePublished a publisher).
  const articleSchema = clanekSchema({ cesta: '/kde-koupit', nadpis: `Kde koupit ETF v Česku ${year}`, denDat: cenikyOverenyIso });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap">
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
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <span className="text-slate-700">Kde koupit ETF</span>
        </nav>

        {/* Přišel z detailu fondu (?isin=…) → hero „Kde koupit SXR8“ a kalkulačka s oběma sazbami DEGIRO.
            Klientský kontext, ať stránka zůstane statická (ISR). Kolo 5: dřív samostatný box nad hero = dvě hlavičky. */}
        <FondProvider>
        {/* HERO */}
        <section data-sekce="hero" className="pb-8">
          <div className="rounded-2xl bg-slate-900 text-white px-5 py-6 md:px-9 md:py-8">
            <div className="md:flex md:items-end md:justify-between gap-10">
              <div className="max-w-xl">
                <FondHero>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Kde koupit ETF v Česku {year}</h1>
                  <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                    Zadejte, kolik investujete měsíčně, a uvidíte, kolik vás nákup ETF u každého brokera stojí – poplatek i směna korun na eura.
                  </p>
                  {ukazka && kurzy && (
                    <p data-odpoved="kde-koupit" data-broker-odpoved={ukazka.b.id} data-kc-odpoved={ukazka.kc.toFixed(2)} className="mt-2 text-slate-200 text-sm md:text-base leading-relaxed">
                      Podle ceníků ověřených {cenikyOverenyStr} a kurzu ČNB k{'\u00a0'}{datumKurzu(kurzy)} vychází nákup ETF za 2{'\u00a0'}000{'\u00a0'}Kč nejlevněji
                      u <strong className="text-white">{ukazka.jmeno}</strong>: {kcPresne(ukazka.kc)} včetně směny korun na eura. U jiných částek se pořadí mění.
                    </p>
                  )}
                </FondHero>
                <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><AutorZnak tmavy /><Link href="/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link></span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /><span>Ceníky ověřeny {cenikyOverenyStr}</span></span>
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /><span>Bez provizí a reklamy</span></span>
                </p>
              </div>
              {/* Tři fakta – jen desktop; na mobilu je hned pod hero živý přepočet (stejná čísla, bez duplicity).
                  S fondem skryté: „nejlevnější nad X Kč DEGIRO (ETF Selection)“ u fondu, o kterém nevíme, zda je ve výběru, mate. */}
              <BezFondu><dl className="hidden md:block mt-6 md:mt-0 md:w-[24rem] shrink-0 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5 text-sm">
                {nejlevnejsiRadky.map((r) => (
                  <div key={r.k} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <dt className="whitespace-nowrap text-slate-400 tabular-nums">{r.k}</dt>
                    <dd className="text-right font-semibold whitespace-nowrap">{r.v}</dd>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <dt className="text-slate-400">Bez provize za nákup</dt>
                  <dd className="text-right font-semibold">{bezProvize.map((b) => b.name).join(', ')}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <dt className="text-slate-400">Podpora v češtině</dt>
                  <dd className="text-right font-semibold">{cesky.map((b) => b.name.replace(' e-Broker', '')).join(', ')}</dd>
                </div>
              </dl></BezFondu>
            </div>
          </div>
        </section>

        {/* 1. SPOČÍTANÉ NÁKLADY – živě pro zadanou částku (na mobilu i desktopu PŘED kartami brokerů) */}
        <section id="naklady" data-sekce="naklady" className="pb-10 scroll-mt-20">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Kolik vás stojí nákup ETF</h2>
          <p className="mt-1 mb-4 text-sm text-slate-500">
            Poplatek za nákup + směna korun na eura podle ceníků brokerů. Nulová provize neznamená nulový náklad.
          </p>
          <NakladyKalkulacka kurzy={kurzy} />
        </section>
        </FondProvider>

        {/* 2. DOPORUČENÍ PODLE PROFILU */}
        <section id="verdikt" data-sekce="profily" className="pb-10 scroll-mt-20">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Který broker sedí na vaši situaci</h2>
          <p className="mt-1 mb-4 text-sm text-slate-500">Jeden broker na každou situaci, podle ceníků a parametrů výše.</p>
          <ProfilKarty kurzy={kurzy} />
        </section>

        {/* 3. TŘI KROKY */}
        <section data-sekce="kroky" className="pb-10">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Tři kroky k nákupu ETF</h2>
            <Link href="/jak-zacit" className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">Jak začít investovat <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <ol className="grid sm:grid-cols-3 gap-3">
            {[
              ['Vyberte brokera', 'Podle situace výše. Účet můžete mít i u více brokerů.'],
              ['Ověřte účet a pošlete peníze', 'Registrace, ověření totožnosti a vklad převodem z banky.'],
              ['Kupte ETF', 'Najděte fond podle ISIN nebo tickeru a zadejte pokyn.'],
            ].map(([t, d], i) => (
              <li key={t} className="rounded-xl border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold">{i + 1}</span>
                <p className="font-medium text-slate-900 text-sm mt-2.5">{t}</p>
                <p className="text-sm text-slate-500 mt-1 leading-snug">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 4. ODKAZ NA DETAILNÍ SROVNÁNÍ */}
        <section data-sekce="srovnani-odkaz" className="pb-10">
          <Link href="/srovnani-brokeru" className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-teal-300 sm:flex-row sm:items-center">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Table2 className="w-5 h-5" /></span>
            <span className="flex-1">
              <span className="block font-semibold text-slate-900">Detailní srovnání brokerů</span>
              <span className="block text-sm text-slate-500">Regulace, ochrana hotovosti a cenných papírů, daně a podpora vedle sebe.</span>
            </span>
            <span className="flex items-center gap-1.5">
              {brokeriAbecedne.map((b) => <BrokerLogo key={b.id} id={b.id} size="sm" />)}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 group-hover:text-teal-800">Otevřít srovnání <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </section>

        {/* 5. JAK SROVNÁVÁME (kotva #metodika – odkazuje na ni homepage; dřív „Jak počítáme skóre“, skóre zrušeno 19. 10. 2026) */}
        <section id="metodika" data-sekce="metodika" className="pb-10 scroll-mt-20">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Jak srovnáváme</h2>
          <p className="mt-1 mb-4 text-sm text-slate-500">U každého brokera stejné údaje z veřejných ceníků a dokumentů, bez bodování. Brokery řadíme abecedně, náklady podle zadané částky. Robo-poradce Portu je jiná kategorie, proto zvlášť.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 rounded-xl border border-slate-200 bg-white p-5 text-sm">
            {axes.map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-start gap-2.5">
                <Icon className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                <span><span className="font-medium text-slate-800">{t}.</span> <span className="text-slate-600">{d}</span></span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. FAQ */}
        <section data-sekce="faq" className="pb-10">
          <h2 className="mb-4 text-xl md:text-2xl font-bold tracking-tight text-slate-900">Časté otázky</h2>
          <FaqSeznam items={faqs} />
        </section>

        {/* Autor + zdroje */}
        <section data-sekce="autor" className="space-y-3 pb-12">
          <AutorBox />
          {/* Text v jednom <span> – smíšený text ve flexu se lámal na samostatné sloupce („2026 .“). */}
          <p className="text-xs text-slate-500 leading-relaxed">
            <span>
              Zdroje: veřejné ceníky brokerů (ověřeny <time dateTime={cenikyOverenyIso}>{cenikyOverenyStr}</time>), kurzovní lístek ČNB.
              Brokeři mohou ceník změnit kdykoli – před založením účtu si podmínky ověřte na jejich webu.
            </span>
          </p>
          <InvestmentDisclaimer variant="inline" />
        </section>
      </main>
    </div>
  );
}
