import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { getFeaturedETFs, getTotalETFCount, type ETFBasicInfo , getDataDate } from '@/lib/etf-data';
import {
  TrendingUp, TrendingDown, ArrowRight, ArrowDown, ArrowUpRight, User, CalendarDays, BookOpen,
  Database, Check, X, Layers, Coins, Percent, Banknote, ShieldCheck, Landmark,
  Wallet, Calculator, Info, ShoppingBasket, RefreshCw, Split, Repeat, Building2,
  Globe, ListChecks, BadgeCheck,
} from 'lucide-react';
import { ter, pct, shortName, SectionHead } from '@/components/design-preview/CategoryUI';
import { GuideSection, GuideCallout, GuideTermCard, GuideTOC, GuideFAQ } from '@/components/design-preview/GuideUI';
import InfoTip from '@/components/design-preview/InfoTip';
import { zobrazovanyTicker } from '@/lib/ticker';
import { porovnejNejlevnejsi } from '@/lib/trhy';
import { detectHedging } from '@/utils/hedgingDetection';
import { distKind } from '@/utils/distribution';

import { hodnotaVkladu, PRIKLAD_POPLATKU } from '@/lib/prikladPoplatku';
import { titulek } from '@/lib/seoTitulek';
import { upravenoDlouze, clanekSchema, ogObrazek } from '@/lib/redakce';
import SouvisejiciZebricky from '@/components/design-preview/SouvisejiciZebricky';

export const revalidate = 86400;

export const metadata: Metadata = {
  // Self-canonical: na stránku vedou odkazy s parametry (FB, presety, přesměrování) – ty
  // nemají být samostatné URL ve vyhledávači (deep dive 17. 10. 2026).
  alternates: { canonical: '/pruvodce' },
  title: titulek('Co jsou ETF? Jednoduchý průvodce pro začátečníky 2026'),
  description:
    'ETF jednoduše vysvětleno: jak fungují, co je TER, akumulační vs distribuční, daně v ČR a výnosy přepočtené do korun. Průvodce pro začátečníky.',
};

export default async function GuidePreview() {
  const [featured, totalCount] = await Promise.all([getFeaturedETFs(), getTotalETFCount()]);

  const today = new Date();
  const datumDat = await getDataDate(today);
  const dateStr = datumDat.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  const upraveno = upravenoDlouze('/pruvodce'); // datum úpravy TEXTU (redakce.ts), ne den dat fondů
  const dataDen = datumDat.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
  const year = today.getFullYear();

  /* ---------- Živé metriky do hero (vše z DB, nic ručně psaného) ---------- */
  // Bez čísla raději „—“ než vymyšlený odhad (kolo 6: dřív tichý fallback „4 800“).
  const countLabel = totalCount > 0 ? `${(Math.floor(totalCount / 100) * 100).toLocaleString('cs-CZ')}+` : '—';
  // Nejnižší TER = STEJNÉ PRAVIDLO jako žebříček a homepage (porovnejNejlevnejsi, src/lib/trhy.ts): TER > 0,
  // fond ≥ 100 mil. €, bez měnového zajištění, při shodě akumulační, pak větší. Kolo 6: dřív první řádek dotazu (XD9D).
  const proPravidlo = (e: ETFBasicInfo) => ({ ter: e.ter_numeric, acc: distKind(e.distribution_policy) === 'acc', velikost: e.fund_size_numeric });
  const levne = featured.lowCost
    .filter((e) => e.ter_numeric != null && e.ter_numeric > 0 && (e.fund_size_numeric ?? 0) >= 100 && !detectHedging(e.name).isHedged)
    .sort((a, b) => porovnejNejlevnejsi(proPravidlo(a), proPravidlo(b)));
  const lowestTerEtf = levne[0] ?? null;
  const stejnyTer = lowestTerEtf ? levne.filter((e) => e !== lowestTerEtf && e.ter_numeric === lowestTerEtf.ter_numeric).length : 0;
  const lowestTicker = lowestTerEtf ? zobrazovanyTicker(lowestTerEtf as unknown as Record<string, unknown>) : null;

  // Medián výnosu za 1 rok v Kč z 20 největších fondů v databázi (akcie, dluhopisy, peněžní trh) – obecný
  // orientační údaj, ne tip na konkrétní fond. Skutečný medián (u sudého počtu průměr dvou prostředních).
  const perfVals = featured.bySize
    .map((e) => e.return_1y_czk)
    .filter((v): v is number => v != null)
    .sort((a, b) => a - b);
  const medianPerf = perfVals.length
    ? (perfVals.length % 2 ? perfVals[(perfVals.length - 1) / 2] : (perfVals[perfVals.length / 2 - 1] + perfVals[perfVals.length / 2]) / 2)
    : null;

  // Modelový příklad poplatků – počítá se, ne natvrdo (kolo 6: r/12 dávalo 5 085 000 / 4 207 000 Kč).
  const P = PRIKLAD_POPLATKU;
  const hodnotaLevny = hodnotaVkladu(P.mesicne, P.let, P.hrubyVynos - P.terLevny);
  const hodnotaDrahy = hodnotaVkladu(P.mesicne, P.let, P.hrubyVynos - P.terDrahy);
  const tisice = (v: number) => `${(Math.round(v / 1000) * 1000).toLocaleString('cs-CZ')}\u00a0Kč`;
  const procento = (v: number) => `${(v * 100).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })}\u00a0%`;

  /* ---------- Tři ukázkové široké fondy pro začátečníka (živá data) ---------- */
  const pool = [...featured.bySize, ...featured.byRating, ...featured.lowCost];
  const findByTicker = (t: string) => pool.find((e) => e.primary_ticker === t);
  const findByName = (re: RegExp) => pool.find((e) => re.test(e.name));

  const vwce = findByTicker('VWCE') || findByName(/FTSE All-World/i);
  const cspx = findByTicker('CSP1') || findByTicker('CSPX') || findByName(/Core S&P 500/i);
  const swda = findByTicker('SWDA') || findByTicker('IWDA') || findByName(/Core MSCI World/i);

  const sampleEtfs = [
    {
      etf: vwce,
      role: 'Celý svět v jednom fondu',
      desc: 'Sleduje index FTSE All-World – akcie tisíců firem z vyspělých i rozvíjejících se zemí. Maximální rozložení rizika.',
      icon: Globe,
    },
    {
      etf: swda,
      role: 'Vyspělé trhy (MSCI World)',
      desc: 'Velké a střední firmy z 23 vyspělých zemí. Bez rozvíjejících se trhů, jinak velmi široký záběr.',
      icon: Building2,
    },
    {
      etf: cspx,
      role: 'Sázka na USA (S&P 500)',
      desc: '500 největších amerických firem. Koncentrovanější, historicky silný výnos, ale 100 % v jedné zemi.',
      icon: Landmark,
    },
  ].filter((s): s is typeof s & { etf: ETFBasicInfo } => Boolean(s.etf));

  /* ---------- FAQ – BEZ vymyšlených TER/výkonností, jen obecná rozpětí ---------- */
  const faqs: { q: string; a: React.ReactNode }[] = [
    {
      q: 'Jsou ETF bezpečné?',
      a: (
        <>
          Žádná akciová investice není bez rizika – hodnota ETF kolísá a v krizi může dočasně klesnout o desítky procent.
          Z hlediska <strong>struktury</strong> jsou ale evropské fondy se značkou <strong>UCITS</strong> dobře chráněné:
          majetek fondu je oddělený od správce, takže i kdyby správcovská firma zkrachovala, vaše podíly tím nezmizí.
          ETF navíc nesází na jednu firmu, ale na stovky až tisíce najednou.
        </>
      ),
    },
    {
      q: 'S kolika penězi mám začít?',
      a: (
        <>
          Začít lze i s pár tisíci korunami – u mnoha brokerů koupíte i zlomek jedné akcie ETF. Důležitější než
          jednorázová částka je <strong>pravidelnost</strong> a dlouhý horizont. Zvažte jen peníze, které nebudete
          potřebovat několik let, protože hodnota v čase kolísá.
        </>
      ),
    },
    {
      q: 'Akumulační, nebo distribuční ETF?',
      a: (
        <>
          <strong>Akumulační</strong> fond dividendy automaticky reinvestuje uvnitř – ideální pro dlouhodobý růst a
          jednodušší daně v ČR (nemusíte řešit vyplacené dividendy v přiznání). <strong>Distribuční</strong> fond
          dividendy vyplácí na účet, což oceníte, pokud chcete pravidelný příjem – počítejte ale s 15% zdaněním a
          uvedením v přiznání. Pro většinu začátečníků, kteří budují majetek, dává smysl akumulační.
        </>
      ),
    },
    {
      q: 'Jak se ETF daní v České republice?',
      a: (
        <>
          Zisk z prodeje je <strong>osvobozen, pokud fond držíte déle než 3 roky</strong> (časový test podle § 4 zákona
          o daních z příjmů) – od roku 2026 bez horního limitu. Osvobozen je i tehdy, když <strong>úhrn vašich prodejů
          za rok nepřekročí 100 000 Kč</strong> (hodnotový test – jde o hrubé příjmy, ne zisk). Jinak se zisk daní 15 %
          (u vysokých příjmů, nad 36násobek průměrné mzdy, 23 %). Dividendy u distribučních fondů podléhají 15% dani
          a uvádějí se v přiznání. U irských fondů neřešíte americký formulář W-8BEN – správce fondu díky daňové smlouvě
          Irsko–USA odvádí z amerických dividend jen 15 % místo 30 %.
        </>
      ),
    },
    {
      q: 'ETF, nebo jednotlivé akcie?',
      a: (
        <>
          Pro většinu lidí jsou <strong>ETF jednodušší a méně rizikové</strong>: jedním nákupem koupíte podíl ve
          stovkách firem, takže krach jedné z nich váš výsledek nezničí. Výběr jednotlivých akcií vyžaduje čas, znalosti
          a nese vyšší riziko. ETF je proto typická volba pro pasivního dlouhodobého investora.
        </>
      ),
    },
    {
      q: 'Co je TER a kolik ETF stojí?',
      a: (
        <>
          <strong>TER</strong> (Total Expense Ratio) je roční poplatek za správu fondu, který se strhává automaticky z
          hodnoty – nic neplatíte zvlášť. U široce diverzifikovaných indexových fondů bývá velmi nízký (řádově desetiny
          procenta ročně), zatímco aktivně řízené fondy si často účtují výrazně víc. Aktuální poplatky konkrétních fondů
          najdete v našem{' '}
          <Link href="/srovnani" className="text-teal-700 hover:underline">
            srovnání ETF
          </Link>
          .
        </>
      ),
    },
    {
      q: 'Co znamená „výnos přepočtený do korun“?',
      a: (
        <>
          Většina ETF je vedená v dolarech nebo eurech, protože drží zahraniční akcie. Váš reálný výnos jako Čecha ale
          ovlivňuje i <strong>kurz koruny</strong>. Proto výnosy uvádíme přepočtené do korun – ukazují, co byste skutečně
          měli na účtu v Kč. Nejde o „ETF v korunách“, samotný fond zůstává v cizí měně.
        </>
      ),
    },
    {
      q: 'Jaké jsou nevýhody ETF?',
      a: (
        <>
          ETF nejsou kouzelná – kopírují trh, takže v recesi <strong>klesají spolu s ním</strong> a žádný správce vás
          před propadem „nezachrání“. U zahraničních fondů nesete <strong>měnové riziko</strong> (pohyb koruny vůči
          dolaru či euru). Výnos fondu se navíc mírně liší od indexu (odchylka od indexu) a nemůžete ovlivnit, které
          konkrétní akcie fond drží. Ve srovnání s výhodami – nízké náklady, okamžitá diverzifikace, jednoduchost – jsou
          ale tyto nevýhody pro dlouhodobého investora malé.
        </>
      ),
    },
  ];

  /* ---------- JSON-LD: Article + FAQPage + BreadcrumbList ---------- */
  // Article ze sdíleného helperu: skutečné datum zveřejnění/úpravy (redakce.ts), ne „dnes“; správná URL (dřív /co-jsou-etf).
  const articleSchema = clanekSchema({ cesta: '/pruvodce', nadpis: 'Co jsou ETF? Průvodce pro začátečníky', popis: typeof metadata.description === 'string' ? metadata.description : undefined, obrazek: ogObrazek(metadata) });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: faqPlainText(f.q) },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Co jsou ETF', item: 'https://etfpruvodce.cz/co-jsou-etf' },
    ],
  };

  const toc = [
    { href: '#co-je-etf', label: 'Co je ETF' },
    { href: '#diverzifikace', label: 'Jeden fond = celý svět' },
    { href: '#jak-funguje', label: 'Jak ETF funguje' },
    { href: '#pojmy', label: '4 pojmy, které musíte znát' },
    { href: '#srovnani', label: 'ETF vs akcie vs aktivní fond' },
    { href: '#prvni-etf', label: 'První ETF pro českého investora' },
    { href: '#dane', label: 'Daně a výnos v korunách' },
    { href: '#jak-koupit', label: 'Jak koupit ETF' },
    { href: '#faq', label: 'Časté dotazy' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header (stejný jako kategorie) */}
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
          <span className="text-slate-600">Co jsou ETF</span>
        </nav>

        {/* HERO – slate-900 panel */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 md:py-8">
            <div className="md:flex md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                  Co jsou ETF? Průvodce pro začátečníky
                </h1>
                <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
                  ETF je burzovně obchodovaný fond – jedním nákupem koupíte podíl ve stovkách až tisících firem
                  najednou. Tento průvodce vás krok za krokem provede tím, co ETF je, jak funguje a na co si dát
                  v Česku pozor.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" />
                    <Link href="/o-nas" className="text-slate-200 hover:text-white">Tomáš Kostrhoun</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Aktualizováno {upraveno}</span>
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Čtení ~12 min</span>
                  <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroj: justETF / ČNB / vlastní databáze</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href="#jak-koupit" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Jak vybrat fond</Link>
                  <Link href="/srovnani" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Srovnat ETF</Link>
                </div>
              </div>

              {/* Živé metriky z DB */}
              <div className="mt-6 md:mt-0 md:w-72 shrink-0 grid grid-cols-3 md:grid-cols-1 gap-2.5">
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Fondů v databázi</p>
                  <p className="text-lg font-bold tabular-nums">{countLabel}</p>
                  <p className="text-xs text-slate-400">z čeho vybíráme</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Nejnižší TER</p>
                  <p className="text-lg font-bold tabular-nums">{ter(lowestTerEtf?.ter_numeric ?? null)}</p>
                  <p className="text-xs text-slate-400">{lowestTicker ?? 'ročně'}{stejnyTer > 0 ? ` a ${stejnyTer} dalších` : ''}</p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-slate-400">Výnos za 1 rok</p>
                  <p className={`text-lg font-bold tabular-nums ${(medianPerf ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{pct(medianPerf)}</p>
                  <p className="text-xs text-slate-400">medián, v Kč</p>
                </div>
                {/* Kolo 6: definice a datum čísel v dlaždicích (dřív „Medián 1R – velké fondy“ bez data). */}
                <p className="col-span-3 md:col-span-1 text-[11px] leading-snug text-slate-400">
                  Data k {dataDen}. Výnos = medián výnosů za posledních 12 měsíců v korunách u 20 největších fondů v databázi.
                  Nejnižší TER: fondy nad 100 mil. € bez měnového zajištění, při shodě akumulační, pak větší.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VE ZKRATCE – 3 kroky nahoře (kolo 6: 12 minut a 9 kapitol bez shrnutí). Fakta a odkazy, ne doporučení. */}
        <section className="pb-7" data-sekce="ve-zkratce">
          <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 md:p-5">
            <p className="text-sm font-semibold text-slate-900">Ve zkratce: tři kroky k prvnímu ETF</p>
            <ol className="mt-3 grid gap-2.5 md:grid-cols-3">
              {([
                ['1', 'Vyberte široký indexový fond', 'Třeba fond na celý svět – ukázka: VWCE (FTSE All-World).', '/etf/IE00BK5BQT80', 'Detail fondu VWCE'],
                ['2', 'Vyberte brokera', 'Kolik zaplatíte za nákup a směnu měny při vaší částce.', '/kde-koupit', 'Kalkulačka nákladů brokerů'],
                ['3', 'Investujte pravidelně a dlouhodobě', 'Kolik vás za desítky let stojí poplatek fondu.', '/kalkulacka', 'Kalkulačka poplatků'],
              ] as [string, string, string, string, string][]).map(([n, t, d, href, odkaz]) => (
                <li key={n} className="flex gap-2.5 rounded-lg bg-white border border-slate-200 p-3">
                  <span className="flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-teal-700 text-white text-xs font-semibold">{n}</span>
                  <span className="min-w-0 text-sm">
                    <span className="block font-medium text-slate-900">{t}</span>
                    <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">{d}</span>
                    <Link href={href} className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-800">{odkaz} <ArrowRight className="w-3.5 h-3.5" /></Link>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ROZCESTNÍK – „Průvodce“ v menu zastřešuje i datové články a portfolia (menu 6 položek, 17. 10. 2026) */}
        <section className="pb-7">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['#obsah-pruvodce', 'Základy ETF', 'Co je ETF, jak funguje, jak vybrat a koupit – čtěte níže.'],
              ['/co-rikaji-data', 'Co říkají data', 'Odpovědi z dat v korunách: měnové riziko, naráz vs. postupně, daně…'],
              ['/portfolio-strategie', 'Modelová portfolia', 'Hotová portfolia z ETF a jak si vedla v korunách.'],
            ].map(([href, t, p]) => (
              <Link key={href} href={href} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300">
                <span className="block text-sm font-semibold text-slate-900">{t}</span>
                <span className="mt-1 block text-xs text-slate-500 leading-relaxed">{p}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* OBSAH / KOTVY */}
        <section id="obsah-pruvodce" className="pb-9 scroll-mt-20">
          <GuideTOC items={toc} />
        </section>

        {/* 3. CO JE ETF */}
        <GuideSection id="co-je-etf">
          <SectionHead title="Co je ETF" desc="Začněme od úplného základu – co se vlastně skrývá za třemi písmeny." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6 text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              <strong className="text-slate-900">ETF</strong> je zkratka anglického <em>Exchange Traded Fund</em>, tedy
              <strong className="text-slate-900"> burzovně obchodovaný fond</strong>. Je to balíček mnoha akcií (nebo
              dluhopisů) zabalený do jednoho cenného papíru, který se nakupuje a prodává na burze stejně snadno jako
              akcie jediné firmy.
            </p>
            <p>
              Představte si to jako <strong className="text-slate-900">nákupní košík</strong>: místo abyste kupovali
              akcie 500 firem jednu po druhé (a platili 500× poplatek), koupíte jeden košík, ve kterém už všech 500 firem
              je. Když některá firma v košíku poroste a jiná klesne, vaše investice se o výsledek opře jako celek –
              jeden propadák vás nepoloží.
            </p>
            <GuideCallout icon={ShoppingBasket} title="Proč to dává smysl pro začátečníka">
              Nemusíte umět vybírat „tu správnou akcii“. Jedním nákupem získáte okamžité rozložení rizika napříč
              stovkami firem, nízké náklady a strategii, kterou zvládnete spravovat i bez denního sledování trhů.
            </GuideCallout>
            <p>
              Většina ETF dostupných českým investorům nese označení <strong className="text-slate-900">UCITS</strong> –
              je to evropský regulační standard pro fondy. Jeho klíčová výhoda: majetek fondu je{' '}
              <strong className="text-slate-900">oddělen od majetku správce</strong>. I kdyby správcovská firma
              zkrachovala, vaše podíly v ETF nejsou součástí její konkurzní podstaty a zůstávají vaše.
            </p>
          </div>
        </GuideSection>

        {/* 3b. JEDEN FOND = CELÝ SVĚT (geografická diverzifikace) */}
        <GuideSection id="diverzifikace">
          <SectionHead title="Jeden fond = celý svět" desc="Jak vypadá rozložení peněz, když koupíte jeden široký ETF na celý svět." />
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-lg border border-slate-200 bg-white p-5 md:p-6 text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                Široký ETF na celý svět (například na index FTSE All-World) drží <strong className="text-slate-900">tisíce
                firem z desítek zemí</strong>. Jedním nákupem tak automaticky získáte vyváženou expozici vůči hlavním
                světovým trhům – a to podle jejich <strong className="text-slate-900">ekonomické velikosti</strong>,
                ne podle toho, kterou zemi máte zrovna rádi.
              </p>
              <p>
                Rozdělení není napevno: mění se s tím, jak firmy v jednotlivých regionech rostou nebo klesají. Fond ho
                sám průběžně dorovnává, takže se o žádné „přerovnávání“ nemusíte starat. Orientačně vypadá geografické
                rozložení světového ETF takto:
              </p>
              <GuideCallout icon={Globe} title="Proč nejde jen o USA" tone="slate">
                I když americké firmy dnes tvoří většinu světového indexu, jeden široký fond automaticky drží i Evropu,
                Japonsko a rozvíjející se trhy. Nesázíte tak vše na jednu zemi – když jeden region zaostává, ostatní
                to mohou vyrovnat.
              </GuideCallout>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 flex flex-col justify-center">
              <p className="text-xs font-medium text-slate-500 mb-3">Orientační rozložení (světový ETF)</p>
              <ul className="space-y-2.5">
                {([
                  ['Severní Amerika', 64],
                  ['Evropa', 15],
                  ['Japonsko', 6],
                  ['Ostatní trhy', 15],
                ] as [string, number][]).map(([region, share]) => (
                  <li key={region}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">{region}</span>
                      <span className="font-semibold tabular-nums text-slate-800">{share} %</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-teal-600" style={{ width: `${share}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                Ilustrační podíly dle tržní kapitalizace; přesné hodnoty se v čase mění a liší se podle indexu.
              </p>
            </div>
          </div>
        </GuideSection>

        {/* 4. JAK ETF FUNGUJE */}
        <GuideSection id="jak-funguje">
          <SectionHead title="Jak ETF funguje" desc="Tajemství nízkých poplatků: ETF nikoho neplatí za vybírání akcií." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6 text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              Drtivá většina ETF je <strong className="text-slate-900">pasivní</strong> – jen co nejvěrněji kopíruje
              nějaký <strong className="text-slate-900">index</strong>. Index je seznam firem sestavený podle pevného
              pravidla. Například <strong className="text-slate-900">S&P 500</strong> je index 500 největších firem v
              USA; <strong className="text-slate-900">MSCI World</strong> sdružuje velké firmy z vyspělých zemí celého
              světa.
            </p>
            <p>
              Fond tedy nikoho neplatí za to, aby „vymýšlel“, které akcie koupit – jen mechanicky drží to, co je v
              indexu. Díky tomu jsou náklady na správu velmi nízké. Existují dva způsoby, jak fond index napodobuje:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="flex items-center gap-2 font-semibold text-slate-900">
                  <Layers className="w-4 h-4 text-teal-700" /> Fyzická replikace
                </p>
                <p className="mt-1.5 text-slate-600 leading-relaxed">
                  Fond za vaše peníze opravdu nakoupí reálné akcie z indexu. Nejsrozumitelnější a nejčastější varianta –
                  vlastníte podíl na skutečných firmách.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="flex items-center gap-2 font-semibold text-slate-900">
                  <RefreshCw className="w-4 h-4 text-teal-700" /> Swapová (syntetická) replikace
                </p>
                <p className="mt-1.5 text-slate-600 leading-relaxed">
                  Fond nedrží akcie napřímo, ale přes smlouvu (derivát) s bankou, která se zaváže dodat výnos indexu.
                  Přináší to malé <strong className="text-slate-900">protistranové riziko</strong> – riziko, že druhá
                  strana smlouvy nedostojí závazku.
                </p>
              </div>
            </div>
            <GuideCallout icon={Info} title="Drobnost, kterou uslyšíte: odchylka od indexu" tone="slate">
              Žádný fond nekopíruje index úplně přesně – malému rozdílu mezi výnosem fondu a indexu se říká odchylka od
              indexu (anglicky „tracking error“). U velkých levných fondů bývá zanedbatelná.
            </GuideCallout>
          </div>
        </GuideSection>

        {/* 5. ČTYŘI POJMY */}
        <GuideSection id="pojmy">
          <SectionHead title="4 pojmy, které musíte znát" desc="Když pochopíte tyto čtyři věci, přečtete každé srovnání ETF bez problémů." />
          <div className="grid sm:grid-cols-2 gap-4">
            <GuideTermCard
              icon={ListChecks}
              term="Index"
              abbr="Co fond sleduje"
              definition="Seznam firem sestavený podle pevného pravidla. ETF tento seznam kopíruje, takže index určuje, do čeho vlastně investujete."
              why="Index rozhoduje o riziku i výnosu víc než název fondu. Celý svět se chová jinak než jen americké technologické firmy."
              example="S&P 500 = 500 největších firem v USA. Kdo koupí ETF na tento index, drží podíl ve všech 500 najednou."
            />
            <GuideTermCard
              icon={Percent}
              term="TER"
              abbr="Total Expense Ratio – roční poplatek"
              definition="Roční poplatek za správu fondu vyjádřený v procentech. Strhává se automaticky z hodnoty fondu, neplatíte ho zvlášť."
              why="Poplatek vám ukrajuje z výnosu každý rok. U dlouhého horizontu i malý rozdíl v TER nakonec udělá znatelnou částku."
              example={
                <>
                  U široce diverzifikovaných indexových fondů bývá TER velmi nízký (desetiny procenta ročně).
                  Aktuálně nejlevnější v naší databázi má {ter(lowestTerEtf?.ter_numeric ?? null)} ročně.
                </>
              }
            />
            <GuideTermCard
              icon={Split}
              term="Akumulační vs distribuční"
              abbr="Co fond dělá s dividendami"
              definition="Akumulační fond dividendy automaticky reinvestuje uvnitř. Distribuční je vyplácí na váš účet."
              why="V Česku má volba daňový dopad: vyplacené dividendy (distribuční) se daní 15 % a uvádějí v přiznání. U akumulačního tato starost odpadá."
              example="Chcete v klidu budovat majetek? Akumulační. Chcete pravidelný příjem na účet? Distribuční."
            />
            <GuideTermCard
              icon={Repeat}
              term="Replikace"
              abbr="Jak fond index napodobuje"
              definition="Fyzická replikace = fond drží reálné akcie. Swapová (syntetická) = fond získává výnos přes smlouvu s bankou."
              why="Fyzická je nejsrozumitelnější. U swapové existuje malé protistranové riziko, někdy je ale daňově výhodnější."
              example="Většina velkých fondů na S&P 500 nebo MSCI World je fyzická – vlastníte podíl na skutečných firmách."
            />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Konkrétní hodnoty (TER, výnosy) u jednotlivých fondů najdete vždy aktuální v{' '}
            <Link href="/srovnani" className="text-teal-700 hover:underline">srovnání ETF</Link>.
          </p>
        </GuideSection>

        {/* 6. ETF VS AKCIE VS AKTIVNÍ FOND */}
        <GuideSection id="srovnani">
          <SectionHead title="ETF vs akcie vs aktivní fond" desc="Tři způsoby, jak investovat do akciového trhu, a v čem se liší." />
          {/* Desktop tabulka */}
          <div className="hidden md:block rounded-lg border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-left">
                  <th className="py-3 px-4 font-medium">Kritérium</th>
                  <th className="py-3 px-4 font-medium">ETF (indexový fond)</th>
                  <th className="py-3 px-4 font-medium">Jednotlivé akcie</th>
                  <th className="py-3 px-4 font-medium">Aktivně řízený fond</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Diverzifikace</td>
                  <td className="py-3 px-4"><CellYes>Stovky až tisíce firem</CellYes></td>
                  <td className="py-3 px-4"><CellNo>Jen co si koupíte sami</CellNo></td>
                  <td className="py-3 px-4"><CellYes>Široká</CellYes></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Roční poplatky</td>
                  <td className="py-3 px-4"><CellYes>Nízké (0,03–0,5 %)</CellYes></td>
                  <td className="py-3 px-4"><CellYes>Žádné průběžné</CellYes></td>
                  <td className="py-3 px-4"><CellNo>Vyšší (1–2 %)</CellNo></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Časová náročnost</td>
                  <td className="py-3 px-4"><CellYes>Nízká, pasivní</CellYes></td>
                  <td className="py-3 px-4"><CellNo>Vysoká, vlastní výběr</CellNo></td>
                  <td className="py-3 px-4"><CellYes>Nízká</CellYes></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Vhodné pro začátečníka</td>
                  <td className="py-3 px-4"><CellYes>Ano</CellYes></td>
                  <td className="py-3 px-4"><CellNo>Spíš ne</CellNo></td>
                  <td className="py-3 px-4"><CellNeutral>Jde to, ale drahé</CellNeutral></td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Mobil – karty */}
          <div className="md:hidden space-y-3">
            {[
              { t: 'ETF (indexový fond)', rows: [['Diverzifikace', 'Stovky až tisíce firem', 'yes'], ['Poplatky', 'Nízké (0,03–0,5 %)', 'yes'], ['Náročnost', 'Nízká, pasivní', 'yes'], ['Pro začátečníka', 'Ano', 'yes']] },
              { t: 'Jednotlivé akcie', rows: [['Diverzifikace', 'Jen co si koupíte', 'no'], ['Poplatky', 'Žádné průběžné', 'yes'], ['Náročnost', 'Vysoká, vlastní výběr', 'no'], ['Pro začátečníka', 'Spíš ne', 'no']] },
              { t: 'Aktivně řízený fond', rows: [['Diverzifikace', 'Široká', 'yes'], ['Poplatky', 'Vyšší (1–2 %)', 'no'], ['Náročnost', 'Nízká', 'yes'], ['Pro začátečníka', 'Jde, ale drahé', 'neutral']] },
            ].map((col) => (
              <div key={col.t} className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">{col.t}</p>
                <ul className="mt-2 space-y-1.5">
                  {col.rows.map(([k, v, tone]) => (
                    <li key={k} className="flex items-start gap-2 text-sm">
                      {tone === 'no'
                        ? <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        : tone === 'neutral'
                          ? <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          : <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />}
                      <span className="text-slate-600"><span className="text-slate-400">{k}: </span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Konkrétní dopad poplatků v korunách (koruna-first USP) */}
          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Coins className="w-4 h-4 text-teal-700 shrink-0" /> Kolik vás poplatky reálně stojí v korunách
            </p>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              Modelový příklad: <strong className="text-slate-900">{P.mesicne.toLocaleString('cs-CZ')}{'\u00a0'}Kč měsíčně po dobu {P.let} let</strong> (vloženo
              {' '}{(P.mesicne * 12 * P.let).toLocaleString('cs-CZ')}{'\u00a0'}Kč, vždy na konci měsíce) při shodném hrubém zhodnocení {procento(P.hrubyVynos)} ročně.
              Jediný rozdíl je roční poplatek fondu, který zhodnocení snižuje.
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-teal-200 bg-teal-50/50 p-4">
                <p className="text-xs font-medium text-teal-800">Levný ETF – TER {procento(P.terLevny)}</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-slate-900" data-priklad-levny={Math.round(hodnotaLevny)}>≈ {tisice(hodnotaLevny)}</p>
                <p className="text-xs text-slate-500 mt-0.5">hodnota po 20 letech</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-600">Aktivní fond – poplatek {procento(P.terDrahy)}</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-slate-900" data-priklad-drahy={Math.round(hodnotaDrahy)}>≈ {tisice(hodnotaDrahy)}</p>
                <p className="text-xs text-slate-500 mt-0.5">hodnota po 20 letech</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              Rozdíl jen kvůli poplatku: <strong className="text-slate-900 tabular-nums">zhruba {tisice(hodnotaLevny - hodnotaDrahy)}</strong>{' '}
              méně na účtu. Rozdíl {procento(P.terLevny)} vs {procento(P.terDrahy)} ročně vypadá malý, ale za 20–30 let ukrojí značnou část výnosu.
            </p>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Ilustrační výpočet za zjednodušených předpokladů (konstantní výnos 7 % minus poplatek, měsíční úročení
              odpovídající roční sazbě, bez daní a poplatků brokera). Na
              vlastní částku si dopad spočítejte v{' '}
              <Link href="/kalkulacka" className="text-teal-700 hover:underline font-medium">
                kalkulačce poplatků ETF
              </Link>
              .
            </p>
          </div>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed">
            <Info className="inline w-4 h-4 text-teal-700 mr-1 -mt-0.5" />
            Váháte mezi vlastními akciemi a fondem? Proč většina jednotlivých akcií dlouhodobě zaostává za indexem
            (a kdy naopak dávají smysl) rozebírá pilíř{' '}
            <Link href="/etf-vs-akcie" className="text-teal-700 hover:underline font-medium">ETF, nebo jednotlivé akcie?</Link>
          </p>
        </GuideSection>

        {/* 7. PRVNÍ ETF PRO ČECHA – živá data */}
        <GuideSection id="prvni-etf">
          <SectionHead
            title="První ETF pro českého investora"
            desc="Tři populární široké fondy, které začátečníci nejčastěji zvažují. Data jsou živá z naší databáze."
            href="/srovnani"
            hrefLabel="srovnat vše"
          />
          {sampleEtfs.length > 0 ? (
            <div className="grid sm:grid-cols-3 gap-4">
              {sampleEtfs.map(({ etf, role, desc, icon: Icon }) => {
                const v = etf.return_1y_czk;
                const pos = (v ?? 0) >= 0;
                return (
                  <Link
                    key={etf.isin}
                    href={`/etf/${etf.isin}`}
                    className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm transition-all flex flex-col"
                  >
                    <span className="flex items-center gap-2 text-xs font-medium text-teal-700">
                      <Icon className="w-4 h-4" /> {role}
                    </span>
                    <p className="mt-2 font-semibold text-slate-900">{shortName(etf.name)}</p>
                    <p className="text-xs text-slate-400">{zobrazovanyTicker(etf as unknown as Record<string, unknown>) ?? etf.isin}</p>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed flex-1">{desc}</p>
                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">TER ročně</p>
                        <p className="font-semibold tabular-nums text-slate-800">{ter(etf.ter_numeric)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Výnos 1R (CZK)</p>
                        <p className={`font-semibold tabular-nums inline-flex items-center gap-1 ${pos ? 'text-emerald-600' : 'text-red-600'}`}>
                          {v != null && (pos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />)}
                          {pct(v)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
              Konkrétní fondy a jejich aktuální data najdete ve{' '}
              <Link href="/srovnani" className="text-teal-700 hover:underline">srovnání ETF</Link>.
            </div>
          )}

          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900/80 leading-relaxed">
            <span className="font-semibold text-amber-800">Jen příklady, ne doporučení.</span> Uvádíme je, abyste viděli,
            jak vypadají populární široké fondy a jejich živá data. Který je pro vás vhodný, závisí na vašem horizontu a
            cílech.
          </div>

          {/* Rozcestník: podle čeho vybrat → kategorie */}
          <div className="mt-5">
            <p className="text-sm font-semibold text-slate-900 mb-2.5">Podle čeho vybrat dál</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {([
                ['/nejlepsi-etf/nejlepsi-msci-world-etf', 'MSCI World ETF', Globe],
                ['/nejlepsi-etf/nejlepsi-sp500-etf', 'S&P 500 ETF', Landmark],
                ['/nejlepsi-etf/nejlepsi-dividendove-etf', 'Dividendové ETF', Banknote],
              ] as [string, string, typeof Globe][]).map(([href, label, Icon]) => (
                <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                  <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                  <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </GuideSection>

        {/* 8. DANĚ A VÝNOS V KORUNÁCH */}
        <GuideSection id="dane">
          <SectionHead title="Daně a výnos v korunách" desc="Český úhel, který v zahraničních průvodcích nenajdete." />
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6 text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              ETF samotné je téměř vždy vedené v dolarech nebo eurech, protože drží zahraniční akcie. Váš reálný výnos
              ale ovlivňuje i pohyb kurzu koruny – proto na webu uvádíme <strong className="text-slate-900">výnosy
              přepočtené do korun</strong> kurzem ČNB. Ukazují, co byste reálně měli na účtu v Kč. (Nejde o „ETF
              v korunách“ – samotný fond zůstává v cizí měně.)
            </p>
            <GuideCallout icon={Coins} title="Měnové riziko jednou větou" tone="slate">
              Když trh vyroste o 10 %, ale koruna proti dolaru posílí o 8 %, váš výnos v korunách je výrazně nižší než
              10 % – kurz může výnos zvednout i ubrat.
            </GuideCallout>
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-left">
                  <th className="py-3 px-4 font-medium">Situace</th>
                  <th className="py-3 px-4 font-medium">Daňový dopad v ČR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr><td className="py-3 px-4">Prodej po 3+ letech držby</td><td className="py-3 px-4">Osvobozeno (§ 4 časový test), od 2026 bez limitu</td></tr>
                <tr><td className="py-3 px-4">Roční objem prodejů do 100 000 Kč</td><td className="py-3 px-4">Osvobozeno (hodnotový test) – hrubé příjmy, ne zisk</td></tr>
                <tr><td className="py-3 px-4">Prodej do 3 let (nad limit)</td><td className="py-3 px-4">Daň 15 % ze zisku (u vysokých příjmů 23 %)</td></tr>
                <tr><td className="py-3 px-4">Dividenda u distribučního ETF</td><td className="py-3 px-4">15 % daň, uvést v přiznání</td></tr>
                <tr><td className="py-3 px-4">Irský domicil fondu</td><td className="py-3 px-4">Z amer. dividend 15 % místo 30 %; W-8BEN neřešíte</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Orientační shrnutí, ne daňová rada. Konkrétní situaci vždy ověřte u svého daňového poradce.
          </p>
        </GuideSection>

        {/* 9. JAK KOUPIT */}
        <GuideSection id="jak-koupit">
          <SectionHead title="Jak koupit ETF" desc="Čtyři kroky od rozhodnutí k první koupi." href="/kde-koupit" hrefLabel="srovnání brokerů" />
          <div className="grid sm:grid-cols-4 gap-3">
            {[
              ['1', 'Vyberte brokera', 'Obchodníka s cennými papíry – např. DEGIRO, XTB nebo Trading 212.'],
              ['2', 'Ověření a vklad', 'Registrace, ověření totožnosti a převod peněz (obvykle 1–3 dny).'],
              ['3', 'Najděte fond podle ISIN', 'ISIN je jednoznačný kód fondu – zadáte ho do vyhledávání u brokera.'],
              ['4', 'Nákup limitním pokynem', 'Limitní pokyn určí nejvyšší cenu, kterou jste ochotni zaplatit – dráž nenakoupíte.'],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold">{n}</span>
                <p className="font-medium text-slate-900 text-sm mt-2.5">{t}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {['DEGIRO', 'XTB', 'Trading 212'].map((b) => (
              <Link key={b} href="/kde-koupit" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors">Recenze {b}</Link>
            ))}
            <Link href="/kde-koupit" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors inline-flex items-center gap-1">
              Všichni brokeři <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </GuideSection>

        {/* 10. FAQ */}
        <GuideSection id="faq">
          <SectionHead title="Časté dotazy" desc="Otázky, které si pokládá skoro každý začátečník." />
          <GuideFAQ faqs={faqs} />
        </GuideSection>

        {/* TRUST PRUH */}
        <section className="pb-10">
          <div className="grid sm:grid-cols-3 gap-4">
            {([
              [ShieldCheck, 'Vysvětleno bez žargonu', 'Každý pojem rozebíráme srozumitelně a s příkladem.'],
              [BadgeCheck, 'Jmenný autor', 'Obsah od Tomáše Kostrhouna, ne anonymně.'],
              [Database, 'Živá data', `Ukázková čísla tažená z databáze, data k ${dateStr}.`],
            ] as [typeof ShieldCheck, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Icon className="w-5 h-5" /></span>
                <span><span className="block font-semibold text-sm text-slate-900">{t}</span><span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">{d}</span></span>
              </div>
            ))}
          </div>
        </section>

        {/* INTERNÍ PROLINKOVÁNÍ */}
        <section className="pb-10">
          <SectionHead title="Pokračujte dál" desc="Když rozumíte základům, vyberte si konkrétní směr." />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {([
              ['/nejlepsi-etf/nejlepsi-msci-world-etf', 'MSCI World ETF', Globe],
              ['/nejlepsi-etf/nejlepsi-sp500-etf', 'S&P 500 ETF', Landmark],
              ['/nejlepsi-etf/nejlepsi-dividendove-etf', 'Dividendové ETF', Banknote],
              ['/nejlepsi-etf/nejlevnejsi-etf', 'Nejlevnější ETF', Wallet],
              ['/kde-koupit', 'Kde koupit ETF', Landmark],
              ['/kalkulacka', 'Kalkulačka poplatků', Calculator],
              ['/kolik-vydelaly-etf', 'Kolik ETF vydělaly', TrendingUp],
            ] as [string, string, typeof Globe][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 ml-auto shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Žebříčky k tématu (SEO audit 6b – prolinkování článků a žebříčků) */}
        <SouvisejiciZebricky nadpis="Žebříčky k tématu" slugy={['nejlepsi-etf-2026', 'nejlepsi-celosvetove-etf', 'nejlepsi-sp500-etf', 'nejlevnejsi-etf', 'nejlepsi-dividendove-etf']} />

        {/* E-E-A-T patička + disclaimer */}
        <section className="pb-12">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz. Edukační obsah píšeme srozumitelně a nezávisle, na základě veřejných dat – bez
                  placeného pořadí.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Zdroje: justETF, S&amp;P Dow Jones Indices, ČNB, vlastní databáze. Aktualizováno {upraveno}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Obsah má vzdělávací charakter a nepředstavuje investiční doporučení. Minulá výkonnost nezaručuje budoucí výnosy. Investice do ETF nesou riziko ztráty. {year}</p>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

/* ---------- Pomocné buňky tabulky (Check/X v emerald/red, žádné emoji) ---------- */
function CellYes({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-700">
      <Check className="w-4 h-4 text-emerald-600 shrink-0" /> {children}
    </span>
  );
}
function CellNo({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-700">
      <X className="w-4 h-4 text-red-500 shrink-0" /> {children}
    </span>
  );
}
function CellNeutral({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-700">
      <Info className="w-4 h-4 text-amber-500 shrink-0" /> {children}
    </span>
  );
}

/* Plain-text verze FAQ odpovědí pro JSON-LD (bez JSX/odkazů). */
function faqPlainText(q: string): string {
  const map: Record<string, string> = {
    'Jsou ETF bezpečné?':
      'Žádná akciová investice není bez rizika – hodnota ETF kolísá. Strukturálně jsou ale evropské fondy se značkou UCITS dobře chráněné: majetek fondu je oddělený od správce, takže i při krachu správce vaše podíly nezmizí. ETF navíc sází na stovky až tisíce firem najednou.',
    'S kolika penězi mám začít?':
      'Začít lze i s pár tisíci korunami – u mnoha brokerů koupíte i zlomek akcie ETF. Důležitější než částka je pravidelnost a dlouhý horizont. Investujte jen peníze, které nebudete několik let potřebovat.',
    'Akumulační, nebo distribuční ETF?':
      'Akumulační fond dividendy automaticky reinvestuje (jednodušší daně v ČR), distribuční je vyplácí na účet (15% daň a přiznání). Pro většinu začátečníků budujících majetek dává smysl akumulační.',
    'Jak se ETF daní v České republice?':
      'Zisk z prodeje je osvobozen při držbě déle než 3 roky (§ 4 časový test, od 2026 bez limitu) nebo když úhrn prodejů za rok nepřekročí 100 000 Kč hrubých příjmů (hodnotový test). Jinak se daní 15 % (u vysokých příjmů 23 %). Dividendy u distribučních fondů podléhají 15 %. U irských fondů neřešíte W-8BEN a z amerických dividend platí 15 % místo 30 %.',
    'ETF, nebo jednotlivé akcie?':
      'Pro většinu lidí jsou ETF jednodušší a méně rizikové: jedním nákupem získáte podíl ve stovkách firem. Výběr jednotlivých akcií vyžaduje čas, znalosti a nese vyšší riziko.',
    'Co je TER a kolik ETF stojí?':
      'TER je roční poplatek za správu fondu, který se strhává automaticky. U široce diverzifikovaných indexových fondů bývá velmi nízký (desetiny procenta ročně), aktivní fondy si účtují víc. Aktuální poplatky najdete ve srovnání ETF.',
    'Co znamená „výnos přepočtený do korun“?':
      'ETF je obvykle v dolarech či eurech. Reálný výnos Čecha ovlivňuje i kurz koruny, proto výnosy uvádíme přepočtené do korun – ukazují, co byste měli na účtu v Kč. Nejde o ETF v korunách.',
    'Jaké jsou nevýhody ETF?':
      'ETF kopírují trh, takže v recesi klesají spolu s ním. U zahraničních fondů nesete měnové riziko (pohyb koruny vůči dolaru či euru). Výnos se mírně liší od indexu (odchylka od indexu) a nemůžete ovlivnit, které konkrétní akcie fond drží. Ve srovnání s výhodami – nízké náklady, diverzifikace, jednoduchost – jsou tyto nevýhody pro dlouhodobého investora malé.',
  };
  return map[q] ?? q;
}
