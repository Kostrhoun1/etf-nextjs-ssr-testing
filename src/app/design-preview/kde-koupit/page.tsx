import type React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, Trophy, Info, ShieldCheck,
  User, CalendarDays, Database, BadgeCheck, Wallet, Coins, Layers, Landmark,
  Percent, Headphones, HelpCircle, Scale, Calculator, BookOpen,
  Sparkles, ListChecks, ArrowDownToLine, Globe, ChevronDown, Plus, Equal,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InfoTip from '@/components/design-preview/InfoTip';
import {
  KkScoreBadge, KkYesNo, KkTaxBadge, KkBrokerCta, KkBrokerCard, KkStarMetric,
} from '@/components/design-preview/KdeKoupitUI';
import { brokers } from '@/data/brokerData';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Kde koupit ETF v Česku 2026: srovnání 6 brokerů',
  description:
    'Kde koupit ETF? Jednotné skóre 6 brokerů – XTB a Trading 212 s 0% poplatkem, DEGIRO Core Selection od 0 EUR, daně 15 vs 35 %. Verdikt a tabulka na první pohled.',
};

export default async function KdeKoupitPreview() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  const year = today.getFullYear();

  /* ---------- Živé metriky z brokerData.ts ---------- */
  const find = (id: string) => brokers.find((b) => b.id === id)!;
  const xtb = find('xtb');
  const degiro = find('degiro');
  const fio = find('fio');
  const portu = find('portu');

  // Brokeři (bez robo-poradce Portu) seřazení podle skóre pro hlavní tabulku.
  const realBrokers = brokers.filter((b) => b.id !== 'portu').sort((a, b) => b.rating - a.rating);
  const topBroker = realBrokers[0]; // nejvyšší skóre mezi brokery = XTB
  const zeroFeeCount = brokers.filter((b) => /^0\s*%/.test(b.etfFee) || /bez komisí/i.test(b.etfFee)).length;
  const czSupportCount = brokers.filter((b) => b.czSupport).length;
  const lowTaxCount = brokers.filter((b) => /15/.test(b.czDividends)).length;

  // Pořadí pro srovnávací tabulku: robo-poradce Portu zvlášť nahoře (jiná kategorie), pak brokeři dle skóre.
  const tableOrder = [portu, ...realBrokers];

  /* ---------- Na co koukat – edukační dlaždice ---------- */
  const watchFor: { icon: typeof Wallet; t: string; d: React.ReactNode }[] = [
    { icon: Wallet, t: 'Poplatky a komise', d: <><InfoTip label="Poplatek brokera za provedení jednoho obchodu (nákup/prodej) – u ETF dnes často 0 %.">Komise</InfoTip> je poplatek brokera za jeden obchod. U ETF se pohybuje od 0 % (XTB, Trading 212) po pevnou částku za pokyn (DEGIRO).</> },
    { icon: Coins, t: 'Konverze měn', d: <>Když platíte v korunách a fond je v eurech či dolarech, broker provede směnu a účtuje si <InfoTip label="Přirážka brokera při směně CZK na měnu fondu (EUR/USD) – reálný náklad navíc k samotné komisi.">přirážku</InfoTip> – reálný náklad navíc k poplatku.</> },
    { icon: Layers, t: 'Nabídka ETF', d: <>Počet dostupných fondů. Pro pasivní investování stačí pár <InfoTip label="Evropský regulační standard pro fondy se zvýšenou ochranou investora – typický rámec ETF prodávaných v EU.">UCITS</InfoTip> ETF; aktivní investor ocení tisíce titulů (IBKR, Trading 212).</> },
    { icon: ShieldCheck, t: 'Regulace a ochrana', d: 'Hlídejte dohled (ČNB, BaFin, FCA) a ochranu investora – pojištění aktiv při krachu brokera, zpravidla do 20 000 EUR investic.' },
    { icon: Scale, t: 'Frakční nákup', d: <><InfoTip label="Nákup zlomku drahé akcie nebo ETF – můžete investovat přesnou částku (např. 500 Kč), i když podíl stojí víc.">Frakční nákup</InfoTip> umožňuje koupit zlomek drahé akcie nebo ETF. Užitečné, když investujete malé částky pravidelně (XTB, Trading 212, IBKR).</> },
    { icon: Percent, t: 'Daně: 15 vs 35 %', d: <>U českých dividend rozhoduje <InfoTip label="Registrace brokera jako tuzemského plátce daně v ČR – díky ní sráží z českých dividend jen 15 % místo 35 %.">status plátce daně</InfoTip>. Tuzemský zástupce sráží 15 %, zahraniční bez něj plných 35 % (XTB, DEGIRO).</> },
  ];

  /* ---------- Metodika – osy skóre ---------- */
  const axes: { icon: typeof Percent; t: string; d: React.ReactNode }[] = [
    { icon: Percent, t: 'Poplatky', d: 'Komise za ETF, konverze měn a poplatky za vedení účtu.' },
    { icon: Layers, t: 'Nabídka', d: 'Počet a šíře dostupných UCITS ETF i akcií.' },
    { icon: ShieldCheck, t: 'Regulace', d: 'Dohled, ochrana investora a transparentnost brokera.' },
    { icon: Headphones, t: 'Česká podpora', d: 'Komunikace v češtině a KID dokumentace v češtině.' },
    { icon: Landmark, t: 'Daně', d: 'Zdanění českých dividend a daňová administrativa.' },
    { icon: ListChecks, t: 'Použitelnost', d: 'Přehlednost platformy a vhodnost pro začátečníky.' },
  ];

  /* ---------- FAQ ---------- */
  const faqs = [
    {
      q: 'Kde koupím ETF nejlevněji?',
      a: 'Skutečný náklad = komise za obchod + konverze měny (viz schéma „Kolik vás nákup opravdu stojí" výše). Nejnižší přímé náklady mají XTB a Trading 212 (0 % komise), pozor ale na konverzi: Trading 212 účtuje 0,15 %, XTB 0,5 %. U DEGIRO koupíte fondy z Core Selection za 1 EUR a směnu CZK/EUR máte zdarma.',
    },
    {
      q: 'Jsou ETF u DEGIRO opravdu zdarma?',
      a: 'Fondy z tzv. Core Selection (200+ ETF) koupíte u DEGIRO za 1 EUR manipulační poplatek, ostatní ETF za 3 EUR. Není to tedy úplná nula jako u XTB, ale směnu CZK/EUR máte zdarma a u jednoho většího nákupu měsíčně jsou náklady zanedbatelné.',
    },
    {
      q: 'Proč některý broker sráží 35 % z dividend?',
      a: 'U českých dividend rozhoduje status plátce daně – tuzemský zástupce (Fio, Portu) srazí 15 %, zahraniční broker bez tohoto statusu (IBKR, XTB, DEGIRO) plných 35 %. Detail je ve schématu „Jak se daní české dividendy" výše. U DEGIRO lze část přeplatku získat zpět vratkou; u akumulačních ETF se vás srážka přímo netýká, protože fond dividendy řeší uvnitř.',
    },
    {
      q: 'Co je frakční nákup a kdy ho potřebuju?',
      a: 'Frakční nákup umožňuje koupit zlomek akcie nebo ETF – třeba za 500 Kč i podíl fondu, který stojí 10 000 Kč. Hodí se, když investujete pravidelně malé částky a chcete je celé zainvestovat. Nabízí ho XTB, Trading 212, Interactive Brokers a robo-poradce Portu.',
    },
    {
      q: 'Musím vyplňovat formulář W-8BEN?',
      a: 'Pro evropské (UCITS) ETF se sídlem v Irsku nebo Lucembursku ne – srážkovou daň z amerických dividend řeší správce fondu díky daňové smlouvě. W-8BEN se týká přímého držení amerických cenných papírů. Jako český retailový investor do UCITS ETF formulář vyplňovat nemusíte.',
    },
    {
      q: 'Robo-poradce, nebo klasický broker?',
      a: 'Robo-poradce (Portu) za vás sestaví a spravuje hotové portfolio ETF – platíte roční poplatek za správu (0,24–1 %) a o nic se nestaráte. Klasický broker (XTB, DEGIRO) vám dá nástroj a fondy si vybíráte a kupujete sami za nižší poplatky. Portu hodnotíme zvlášť, protože nejde o brokera ke svépomocnému nákupu, ale o spravovanou službu.',
    },
  ];

  /* ---------- JSON-LD ---------- */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://www.etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Kde koupit ETF', item: 'https://www.etfpruvodce.cz/kde-koupit-etf' },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Srovnání brokerů pro nákup ETF v Česku',
    itemListElement: tableOrder.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'FinancialService',
        name: b.name,
        description: b.description,
      },
    })),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Kde koupit ETF v Česku ${year}`,
    author: { '@type': 'Person', name: 'Tomáš Kostrhoun' },
    dateModified: today.toISOString().slice(0, 10),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/design-preview" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
            </span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/design-preview/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/design-preview/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/design-preview/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/design-preview/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/design-preview/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/design-preview/kde-koupit" className="text-slate-900 font-medium">Kde koupit</Link>
          </nav>
          <HeaderSearch />
          <Link href="/design-preview/srovnani-brokeru" className="rounded-lg bg-teal-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-teal-800">Srovnat brokery</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/design-preview" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <span className="text-slate-600">Kde koupit ETF</span>
        </nav>

        {/* HERO – slate-900 panel */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Kde koupit ETF v Česku {year}</h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  Vybíráte brokera pro první ETF? Srovnáváme {brokers.length} platforem podle jednotného skóre –
                  poplatky, nabídku, regulaci, českou podporu a daně z pohledu českého investora. Žádný marketingový žebříček.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/design-preview/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
                  <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" /> {brokers.length} hodnocených platforem</span>
                </div>
                <div className="mt-5 flex gap-2.5">
                  <Link href="#verdikt" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">Náš verdikt</Link>
                  <Link href="#srovnani" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Srovnání brokerů</Link>
                </div>
              </div>

              {/* Živé metriky z brokerData.ts */}
              <div className="mt-6 md:mt-0 md:w-72 shrink-0 grid grid-cols-3 md:grid-cols-1 gap-2.5">
                <KkStarMetric label="Nejvyšší skóre (broker)" value={`${topBroker.rating}/100`} sub={topBroker.name} />
                <KkStarMetric label="0 % za nákup ETF" value={`${zeroFeeCount} brokeři`} sub="XTB, Trading 212" />
                <KkStarMetric label="Česká podpora" value={`${czSupportCount} ze ${brokers.length}`} sub={`${lowTaxCount} s daní 15 %`} />
              </div>
            </div>
          </div>
        </section>

        {/* NEZÁVISLOST / NEKOMERČNÍ */}
        <section className="pb-8">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <p className="text-sm text-emerald-900/90 leading-relaxed">
              <span className="font-medium text-emerald-900">Nezávislé a nekomerční:</span> nebereme žádné provize ani
              reklamu. Odkazy na brokery jsou jen pro vaše pohodlí – hodnocení počítáme z veřejných dat stejnou
              metodikou pro všechny brokery a celou ji máte níže před očima.
            </p>
          </div>
        </section>

        {/* VERDIKT-FIRST */}
        <section id="verdikt" className="pb-10 scroll-mt-16">
          <SectionHead title="Náš verdikt" desc="Koho zvolit za 10 sekund. Jeden hlavní tip mezi brokery a tři alternativy podle situace." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Trophy className="w-5 h-5" /></span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-teal-700">Hlavní tip mezi brokery</p>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                  XTB <KkScoreBadge score={xtb.rating} size="sm" />
                </h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Nákup akcií a ETF bez komise, frakční nákup, česká podpora 24/7 a licence ČNB.
                  Pro většinu českých investorů nejlepší poměr nákladů, nabídky a pohodlí. Jediné mínus –
                  z českých dividend sráží 35 %, což pasivního investora do akumulačních ETF prakticky netrápí.
                </p>
                <div className="mt-3"><KkBrokerCta name="XTB" brokerId="xtb" primary /></div>
              </div>
            </div>

            <div className="mt-5 grid sm:grid-cols-3 gap-3">
              {[
                { icon: Sparkles, label: 'Začínám a chci klid', name: portu.name, reason: `Robo-poradce sestaví a spravuje portfolio za vás (skóre ${portu.rating}). Jiná kategorie než broker.` },
                { icon: Layers, label: 'Chci nejširší nabídku', name: degiro.name, reason: 'Tisíce UCITS ETF, Core Selection od 1 EUR a směna CZK/EUR zdarma.' },
                { icon: Percent, label: 'Chci nižší daň z dividend', name: fio.name, reason: 'Český broker – z českých dividend sráží jen 15 %, KID v češtině.' },
              ].map(({ icon: Icon, label, name, reason }) => (
                <div key={label} className="rounded-lg border border-slate-200 p-4">
                  <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Icon className="w-4 h-4 text-teal-700" /> {label}
                  </span>
                  <p className="mt-1.5 font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NA CO KOUKAT – edukace */}
        <section className="pb-10">
          <SectionHead title="Na co u brokera koukat" desc="Šest věcí, které rozhodují o ceně i pohodlí. Každý pojem jednou větou." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {watchFor.map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600 mb-3"><Icon className="w-4 h-4" /></span>
                <p className="font-medium text-slate-900 text-sm">{t}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400 leading-relaxed">
            <span className="font-medium text-slate-500">Pozor na pojmy:</span>{' '}
            <InfoTip label="Total Expense Ratio – roční nákladovost fondu, kterou si účtuje správce ETF (ne broker).">TER</InfoTip>{' '}
            je roční poplatek fondu (ne brokera),{' '}
            <InfoTip label="Evropský regulační standard pro fondy se zvýšenou ochranou investora – typický rámec ETF prodávaných v EU.">UCITS</InfoTip>{' '}
            je evropský standard ochrany investora a komise je poplatek brokera za jeden obchod.
          </p>
        </section>

        {/* SCHÉMA: SKUTEČNÝ NÁKLAD = KOMISE + KONVERZE */}
        <section className="pb-10">
          <SectionHead title="Kolik vás nákup opravdu stojí" desc="Cena obchodu není jen komise. Skutečný náklad poskládáte ze dvou složek." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="grid sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-3">
              {/* Komise */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Wallet className="w-4 h-4 text-teal-700" /> Komise za obchod
                </span>
                <ul className="mt-2.5 space-y-1 text-sm text-slate-700 tabular-nums">
                  <li className="flex justify-between gap-3"><span>XTB</span><span className="font-medium">0 %</span></li>
                  <li className="flex justify-between gap-3"><span>Trading 212</span><span className="font-medium">0 %</span></li>
                  <li className="flex justify-between gap-3"><span>DEGIRO</span><span className="font-medium">1 EUR</span></li>
                </ul>
              </div>

              {/* + */}
              <div className="flex items-center justify-center text-slate-300">
                <Plus className="w-5 h-5" />
              </div>

              {/* Konverze */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Coins className="w-4 h-4 text-teal-700" /> Konverze CZK→měna fondu
                </span>
                <ul className="mt-2.5 space-y-1 text-sm text-slate-700 tabular-nums">
                  <li className="flex justify-between gap-3"><span>XTB</span><span className="font-medium">0,5 %</span></li>
                  <li className="flex justify-between gap-3"><span>Trading 212</span><span className="font-medium">0,15 %</span></li>
                  <li className="flex justify-between gap-3"><span>DEGIRO</span><span className="font-medium">0 %</span></li>
                </ul>
              </div>

              {/* = */}
              <div className="flex items-center justify-center text-slate-300">
                <Equal className="w-5 h-5" />
              </div>

              {/* Skutečný náklad */}
              <div className="rounded-lg border border-teal-200 bg-teal-50/50 p-4">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
                  <Scale className="w-4 h-4" /> Skutečný náklad
                </span>
                <p className="mt-2.5 text-sm text-slate-700 leading-relaxed">
                  Sečtěte obě složky. Nulová komise neznamená nulový náklad – rozhoduje až
                  součet s&nbsp;konverzí měny.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* METODIKA SKÓRE */}
        <section className="pb-10">
          <SectionHead title="Jak počítáme skóre" desc={`Jednotné srovnání ${brokers.length} platforem na šesti osách. Transparentně, bez placeného pořadí.`} />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Každého brokera hodnotíme na stejných osách a výsledné skóre 0–100 z nich skládáme.
              Cílem je porovnatelnost z pohledu českého investora – ne marketingové hvězdičky.
            </p>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {axes.map(({ icon: Icon, t, d }) => (
                <div key={t} className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                  <span><span className="font-medium text-slate-800">{t}.</span> <span className="text-slate-600">{d}</span></span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg bg-amber-50 border border-amber-200 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                <Info className="w-4 h-4" /> Robo-poradce Portu vs. klasický broker
              </p>
              <p className="text-sm text-amber-900/80 mt-1.5 leading-relaxed">
                Portu má v tabulce nejvyšší skóre ({portu.rating}), ale není to broker ke svépomocnému nákupu –
                je to robo-poradce, který za vás portfolio sestaví a spravuje za roční poplatek (0,24–1 %).
                Hodnotíme ho zvlášť: pokud chcete jen koupit konkrétní ETF a držet ho s nejnižšími náklady, srovnávejte
                klasické brokery (XTB, DEGIRO, Fio). Pokud chcete mít starost z krku, dává Portu smysl.
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-3">Zdroj dat: veřejné ceníky brokerů, ČNB. Aktualizováno {dateStr}.</p>
          </div>
        </section>

        {/* SROVNÁVACÍ TABULKA */}
        <section id="srovnani" className="pb-10 scroll-mt-16">
          <SectionHead title="Srovnání brokerů pro ETF" desc="Šest platforem na jednom místě. Pod 768px se tabulka mění na karty." href="/design-preview/srovnani-brokeru" hrefLabel="detailní srovnání" />

          {/* Desktop tabulka */}
          <div className="hidden md:block rounded-lg border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-left">
                    <th className="py-3 px-4 font-medium">Broker</th>
                    <th className="py-3 px-3 font-medium text-center">Skóre</th>
                    <th className="py-3 px-3 font-medium">Poplatek ETF</th>
                    <th className="py-3 px-3 font-medium">Konverze</th>
                    <th className="py-3 px-3 font-medium">Počet ETF</th>
                    <th className="py-3 px-3 font-medium text-center">Frakční</th>
                    <th className="py-3 px-3 font-medium text-center">CZ podpora</th>
                    <th className="py-3 px-3 font-medium text-center">Daň</th>
                    <th className="py-3 px-3 font-medium">Min. vklad</th>
                    <th className="py-3 px-3 font-medium" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tableOrder.map((b, i) => (
                    <tr key={b.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900">{b.name}</span>
                        {b.id === 'portu' && (
                          <span className="ml-1.5 inline-block rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium px-1.5 py-0.5 align-middle">robo-poradce</span>
                        )}
                        <span className="block text-xs text-slate-400">{b.regulation}</span>
                      </td>
                      <td className="py-3 px-3"><div className="flex justify-center"><KkScoreBadge score={b.rating} size="sm" /></div></td>
                      <td className="py-3 px-3">{b.etfFee}</td>
                      <td className="py-3 px-3">{b.fxFee}</td>
                      <td className="py-3 px-3">{b.etfCount}</td>
                      <td className="py-3 px-3 text-center"><KkYesNo yes={b.fractional} /></td>
                      <td className="py-3 px-3 text-center"><KkYesNo yes={b.czSupport} /></td>
                      <td className="py-3 px-3 text-center"><KkTaxBadge value={b.czDividends} /></td>
                      <td className="py-3 px-3 tabular-nums">{b.minDeposit}</td>
                      <td className="py-3 px-3 text-right"><KkBrokerCta name={b.name} brokerId={b.id} primary={i === 1} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobilní karty */}
          <div className="md:hidden space-y-3">
            {tableOrder.map((b, i) => (
              <KkBrokerCard key={b.id} broker={b} rank={i + 1} primary={i === 1} />
            ))}
          </div>

          <p className="mt-3 text-xs text-slate-400 leading-relaxed">
            Daň = srážka z českých dividend (15 % tuzemský status, 35 % bez něj). U akumulačních ETF řeší dividendy fond a vás se srážka přímo netýká.
          </p>
        </section>

        {/* DOPORUČENÍ PODLE SITUACE */}
        <section className="pb-10">
          <SectionHead title="Doporučení podle situace" desc="Pro koho se který broker hodí nejlépe." />
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: Sparkles, t: 'Začátečník, chci to jednoduché', who: 'XTB nebo Trading 212', why: 'Nulové komise, frakční nákup a moderní aplikace. Stačí pár UCITS ETF a klid.' },
              { icon: ShieldCheck, t: 'Pasivní investor, chci to z krku', who: 'Portu', why: 'Robo-poradce sestaví a spravuje portfolio za roční poplatek. Žádný výběr fondů.' },
              { icon: Globe, t: 'Aktivní investor, chci nabídku', who: 'Interactive Brokers nebo DEGIRO', why: 'Tisíce ETF a globální burzy. IBKR pro profíky, DEGIRO levně a v evropském režimu.' },
              { icon: Landmark, t: 'Chci i české akcie a nižší daň', who: 'Fio e-Broker', why: 'Český broker, dividendy daněné 15 %, lokální podpora a KID v češtině.' },
            ].map(({ icon: Icon, t, who, why }) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Icon className="w-4 h-4 text-teal-700 shrink-0" /> {t}
                </span>
                <p className="text-sm text-teal-700 font-medium mt-1.5">{who}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{why}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3 KROKY K NÁKUPU */}
        <section className="pb-10">
          <SectionHead title="Tři kroky k nákupu ETF" desc="Od výběru brokera k první koupi." href="/design-preview/jak-zacit" hrefLabel="jak začít investovat" />
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              ['1', 'Vyberte brokera', 'Podle tabulky výše – třeba XTB pro nulové komise nebo DEGIRO pro širokou nabídku.'],
              ['2', 'Ověřte účet', 'Registrace, ověření totožnosti a vklad. Trvá zpravidla 1–3 pracovní dny.'],
              ['3', 'Kupte ETF', 'Najděte fond podle ISIN, zadejte pokyn a zkontrolujte konverzi měny.'],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold">{n}</span>
                <p className="font-medium text-slate-900 text-sm mt-2.5">{t}</p>
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
              [ShieldCheck, 'Nezávislé skóre', 'Stejné osy pro všechny brokery. Nebereme provize ani reklamu.'],
              [Scale, 'Český úhel pohledu', 'Daně 15 vs 35 %, konverze CZK a česká podpora – co justETF neřeší.'],
              [Database, 'Aktuální data', `Z veřejných ceníků brokerů a ČNB, aktualizováno ${dateStr}.`],
            ] as [typeof ShieldCheck, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Icon className="w-5 h-5" /></span>
                <span><span className="block font-semibold text-sm text-slate-900">{t}</span><span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">{d}</span></span>
              </div>
            ))}
          </div>
        </section>

        {/* PROLINKY */}
        <section className="pb-10">
          <SectionHead title="Pokračujte dál" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {([
              ['/design-preview/srovnani-brokeru', 'Recenze brokerů', BadgeCheck],
              ['/design-preview/pruvodce', 'Co jsou ETF', BookOpen],
              ['/design-preview/jak-zacit', 'Jak začít investovat', ArrowDownToLine],
              ['/design-preview/zebricky', 'Nejlepší ETF', Trophy],
              ['/design-preview/srovnani', 'Srovnávač ETF', Layers],
              ['/design-preview/kalkulacka', 'Kalkulačka poplatků', Calculator],
            ] as [string, string, typeof BookOpen][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* E-E-A-T patička + disclaimer */}
        <section className="pb-12">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Brokery srovnáváme nezávisle, na základě veřejných ceníků – bez placeného pořadí.
                  <Link href="/design-preview/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroje: veřejné ceníky brokerů, ČNB. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Obsah má vzdělávací charakter a nepředstavuje investiční doporučení. Nekomerční vzdělávací web – bez provizí a reklam. Investice do ETF nesou riziko ztráty.</p>
            </div>
          </div>
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
