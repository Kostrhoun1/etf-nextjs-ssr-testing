import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, Database, RefreshCw, CalendarDays, Coins, ShieldCheck, History, Mail, Minus } from 'lucide-react';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import AutorBox from '@/components/design-preview/AutorBox';
import { getETFCountLabel, CERSTVOST_DNI, NABIDKA_DNI } from '@/lib/etf-data';
import { clanekSchema } from '@/lib/redakce';

/**
 * /metodika – odkud bereme data a jak je počítáme (SEO audit 20. 10. 2026, E-E-A-T).
 * VŠECHNA FAKTA jsou z kódu a ZAMERNA-ROZHODNUTI.md (scraper a kurzy: etf-astro/scraper/exchange_rates_fetcher.py,
 * performance_converter.py; den dat: src/lib/datumVynosu.ts (returns_as_of, etf-astro scraper/vynosy_z_rady.py); čerstvost: CERSTVOST_DNI/NABIDKA_DNI v etf-data.ts;
 * backtest: src/lib/backtest/engine.ts, BACKTEST-DATA.md; inflace: src/lib/backtest/inflation.ts). Zdroj dat fondů se
 * tu jmenuje (rozhodnutí majitele 19. 10. 2026: jmenovat v metodice a patičce detailu, ne na homepage).
 * Když se změní postup (frekvence scraperu, zdroj kurzů…), upravte i tuhle stránku a `upraveno` v src/lib/redakce.ts.
 */
export const revalidate = 86400;

const POPIS = 'Odkud bere ETF průvodce.cz data o fondech, jak často je aktualizuje, jak přepočítává výnosy do korun, k jakému dni čísla platí a jak hlídáme a opravujeme chyby.';

export const metadata: Metadata = {
  title: 'Metodika: zdroje dat, přepočet do korun a aktualizace',
  description: POPIS,
  alternates: { canonical: '/metodika' },
};

function Sekce({ id, icon: Icon, nadpis, children }: { id: string; icon: typeof Database; nadpis: string; children: React.ReactNode }) {
  return (
    <section id={id} className="pb-9 scroll-mt-20">
      <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight text-slate-900">
        <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg bg-teal-50 text-teal-700"><Icon className="w-4 h-4" aria-hidden="true" /></span>
        {nadpis}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] text-slate-700 leading-relaxed">{children}</div>
    </section>
  );
}

const OBSAH: [string, string][] = [
  ['zdroje', 'Zdroje dat'],
  ['aktualizace', 'Jak často data obnovujeme'],
  ['datum', 'K jakému dni čísla platí'],
  ['prepocet', 'Přepočet výnosů do korun'],
  ['pravidla', 'Kdy číslo neukážeme („—“)'],
  ['backtest', 'Backtest a datové články'],
  ['kontrola', 'Jak data kontrolujeme'],
  ['chyby', 'Našli jste chybu?'],
];

export default async function Metodika() {
  const pocet = await getETFCountLabel();
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Metodika', item: 'https://etfpruvodce.cz/metodika' },
    ],
  };
  const odkaz = 'font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800';
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clanekSchema({ cesta: '/metodika', nadpis: 'Metodika: odkud bereme data a jak je počítáme', popis: POPIS })) }} />
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <SiteNav />
          <HeaderSearch />
        </div>
      </header>

      <main id="obsah" data-stranka="metodika" className="max-w-3xl mx-auto px-4 pb-16">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link><span>/</span>
          <span className="text-slate-700">Metodika</span>
        </nav>

        <section className="pb-7">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-balance">Metodika: odkud bereme data a jak je počítáme</h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Jsme datový web – srovnáváme {pocet} fondů a výnosy přepočítáváme do korun. Tady je popsané, odkud čísla
            pocházejí, jak často se obnovují, k jakému dni platí a co děláme, když je některé špatně. Platí jedno
            pravidlo: raději žádné číslo než špatné.
          </p>
          <nav aria-label="Obsah stránky" className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Obsah</p>
            <ol className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              {OBSAH.map(([id, t], i) => (
                <li key={id}><a href={`#${id}`} className="text-teal-700 hover:underline">{i + 1}. {t}</a></li>
              ))}
            </ol>
          </nav>
        </section>

        <Sekce id="zdroje" icon={Database} nadpis="Zdroje dat">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Údaje o fondech</strong> – poplatek (TER), velikost, výnosy v eurech, kolísavost, složení, burzy a tickery:
              veřejné profily fondů na <strong>justETF</strong>. Stahuje je náš vlastní program (scraper). Jde o fondy ETF a ETC
              kótované na evropských burzách. Počet fondů v nabídce ({pocet}) zahrnuje fondy s názvem, bez pákových a inverzních
              produktů a s daty staženými za posledních {NABIDKA_DNI} dní.
            </li>
            <li><strong>Směnné kurzy pro výnosy fondů</strong>: kurz EUR/CZK České národní banky (denní kurz devizového trhu), kurz EUR/USD Evropské centrální banky.</li>
            <li><strong>Historie indexů</strong> (backtest, datové články): denní ceny s reinvesticí dividend fondů, které daný index sledují (například SPY pro S&amp;P 500 nebo VT pro akcie celého světa), ze služby Yahoo Finance. U každého indexu je ve výsledku uvedeno, z jakého fondu řada pochází.</li>
            <li><strong>Kurzy pro backtest</strong>: denní kurzy Evropské centrální banky.</li>
            <li><strong>Inflace</strong>: index spotřebitelských cen Českého statistického úřadu – měsíčně od roku 2015, starší roky z průměrné roční míry inflace.</li>
            <li><strong>Poplatky brokerů</strong>: oficiální ceníky a dokumenty brokerů. U srovnání je uvedeno, ke kterému dni jsme ceníky ověřili.</li>
          </ul>
        </Sekce>

        <Sekce id="aktualizace" icon={RefreshCw} nadpis="Jak často data obnovujeme">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Data fondů</strong>: každý pracovní den ráno (pondělí až pátek). O víkendu se nestahuje – ceny se nemění, data „k pátku“ jsou správně.</li>
            <li><strong>Historie indexů</strong>: přírůstkově každé ráno od pondělí do soboty, jednou týdně celá řada znovu (kvůli dodatečně upraveným dividendám).</li>
            <li><strong>Srovnávač, žebříčky a homepage</strong> se přepočítají nejpozději jednou denně.</li>
            <li><strong>Detail fondu</strong> se na webu ukládá do mezipaměti až na 30 dní – u každého detailu je proto vidět, ke kterému dni jeho čísla platí.</li>
          </ul>
        </Sekce>

        <Sekce id="datum" icon={CalendarDays} nadpis="K jakému dni čísla platí">
          <p>
            Údaj <strong>„Data k …“</strong> je den, ke kterému platí výnosy fondu – poslední obchodní den, za který má zdroj
            dat <strong>konečnou</strong> hodnotu fondu, ne den, kdy jsme data stáhli. Zdroj totiž za poslední obchodní den
            nejdřív zveřejní předběžnou cenu a konečnou ji nahradí až během dalšího dne. Výnosy proto počítáme z denní řady
            hodnot fondu k předposlednímu obchodnímu dni řady – bývají tak o den starší, ale nezmění se.
          </p>
          <p>
            Den výnosů má každý fond vlastní. U některých fondů má zdroj ceny o pár dní později; ty mají u výnosu své
            datum („výnosy k …“) a když jsou o víc než 3 pracovní dny pozadu, nepočítáme je do mediánů ani do výběru
            nejvýkonnějšího fondu. „Data k …“ celé stránky je den, ke kterému platí výnosy většiny fondů. Když fond
            v datech zdroje chybí, jeho datum zůstane staré a web to řekne (viz níže).
          </p>
        </Sekce>

        <Sekce id="prepocet" icon={Coins} nadpis="Přepočet výnosů do korun">
          <p>
            Zdroj uvádí výnosy fondů v eurech. Výnos v korunách počítáme tak, jako by investor nakoupil za koruny na začátku
            období a na konci prodal zpět do korun:
          </p>
          <p className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-800">
            výnos v Kč = (1 + výnos v EUR) × (kurz EUR/CZK na konci / kurz EUR/CZK na začátku) − 1
          </p>
          <p>
            Kurz je kurz ČNB ke dni začátku a konce období. Výnos v Kč tedy obsahuje i pohyb koruny – posílení koruny výnos
            snižuje, oslabení zvyšuje. Kalendářní roky se počítají od posledního dne předchozího roku do posledního dne roku.
            Výnosy v dolarech stejně, kurzem EUR/USD ECB. Krátká období (1, 3 a 6 měsíců) ukazujeme jen v eurech a tak je
            i popisujeme.
          </p>
          <p>
            Všechny výnosy jsou <strong>po poplatcích fondu</strong> (TER je v ceně fondu), <strong>před daněmi</strong>{' '}
            a bez poplatků brokera. Velikost fondu je vždy v eurech.
          </p>
        </Sekce>

        <Sekce id="pravidla" icon={Minus} nadpis="Kdy číslo neukážeme („—“)">
          <p>Pomlčka znamená, že hodnotu nemáme, nebo jí nevěříme. Nikdy ji nenahrazujeme jiným číslem. Konkrétně:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Chybí-li přepočet do korun nebo dolarů, je „—“ – výnos v eurech se nikdy nevydává za výnos v korunách.</li>
            <li>Když se výnos fondu za 12 měsíců liší o víc než 1,5 procentního bodu od ostatních fondů na stejný trh (nejčastěji kvůli opožděné ceně u zdroje), výnosy za období u něj neukazujeme a říkáme proč.</li>
            <li>Když dvě třídy téhož fondu mají ve zdroji kolísavost nebo pokles, které spolu nesedí, a nedá se poznat, která je správně, je u obou „—“.</li>
            <li>Žebříčky vynechávají fondy, jejichž data se {CERSTVOST_DNI} a více dní neobnovila; srovnávač fondy starší {NABIDKA_DNI} dní (obvykle už nejsou v nabídce). Detail takového fondu zůstává dostupný se žlutým upozorněním, z kterého dne data jsou.</li>
            <li>Sektory jsou v klasifikaci zdroje dat, ne GICS – podíly se proto mohou lišit od údajů emitentů indexů. Složení fondu je podle posledního zveřejnění emitenta, obvykle 1–2 měsíce zpětně.</li>
          </ul>
        </Sekce>

        <Sekce id="backtest" icon={History} nadpis="Backtest a datové články">
          <p>
            <Link href="/backtest" className={odkaz}>Backtest</Link> a články v sekci{' '}
            <Link href="/co-rikaji-data" className={odkaz}>Co říkají data</Link> počítají z historie indexů přepočtené do korun
            den po dni. Kurz pro přepočet smí být nejvýš 4 kalendářní dny starý – den bez takového kurzu se vynechá a výsledek
            poctivě končí posledním dnem s kurzem. V backtestu počítáme kolísavost a další ukazatele rizika z měsíčních
            výnosů; jak přesně je počítá konkrétní článek, je napsané v jeho metodice pod textem. Výsledky jsou po poplatcích
            fondu, ze kterého řada pochází, před daněmi.
          </p>
          <p>
            Čísla, která zveřejňujeme, ověřujeme nezávisle: přepočtem mimo vlastní kód z holých dat a porovnáním s vnějším
            zdrojem (kurzy ČNB a ECB, data ČSÚ, výnosy publikované emitenty indexů a fondů). Ověřovat jen proti vlastnímu
            nástroji by byl kruh.
          </p>
        </Sekce>

        <Sekce id="kontrola" icon={ShieldCheck} nadpis="Jak data kontrolujeme">
          <p>
            Každý den běží automatická kontrola dat fondů i stránek webu: hlídá, jestli scraper doběhl a data jsou čerstvá,
            nemožné hodnoty, fondy na stejný index s výnosem mimo svůj trh, shodu čísel mezi stránkami a desítky dalších
            pravidel. Když něco nesedí, přijde nám upozornění e-mailem.
          </p>
          <p>
            Každou chybu, kterou najdeme, opravujeme dvakrát: opravíme číslo a přidáme do denní kontroly pravidlo, které by
            stejnou chybu příště našlo samo. Hodnoty, které vypadají podivně, ale jsou skutečné (například roční výnos
            korejských ETF nebo ropných ETC), prověřujeme proti burzovním cenám a zapisujeme, aby je nikdo „neopravil“.
          </p>
        </Sekce>

        <Sekce id="chyby" icon={Mail} nadpis="Našli jste chybu?">
          <p>
            Napište nám na <a href="mailto:info@etfpruvodce.cz" className={odkaz}>info@etfpruvodce.cz</a> – ideálně s adresou
            stránky a číslem, které nesedí. Každé hlášení prověříme proti zdroji; opravu ověřujeme až na ostrém webu.
          </p>
          <p className="text-sm text-slate-500">
            Obsah má vzdělávací charakter a nepředstavuje investiční ani daňové doporučení. Minulé výnosy nezaručují budoucí.
            Kdo za webem stojí, najdete na stránce <Link href="/o-nas" className={odkaz}>O nás</Link>.
          </p>
        </Sekce>

        <AutorBox cesta="/metodika" text={<>Autor a správce dat ETF průvodce.cz, 12+ let praxe v českém bankovnictví.</>} />
      </main>
    </div>
  );
}
