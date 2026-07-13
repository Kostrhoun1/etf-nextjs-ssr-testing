import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, Database, Calculator, Wallet, Scale, ShieldCheck, LineChart,
  AlertTriangle, BookOpen, Zap, History,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Momentum faktor: jediný, který porazil index – hloubková analýza',
  description:
    'Momentum je nejsilnější faktor posledního desetiletí: od 2013 vydělal v korunách 16,6 % ročně a jako jediný porazil S&P 500. Jak funguje, co říká výzkum, rolling okna, chování v krizích a jeho skrytá rizika.',
  alternates: { canonical: '/faktorove-etf/momentum' },
  openGraph: {
    title: 'Momentum: jediný faktor, který porazil index',
    description:
      'Hloubková analýza v korunách: 16,6 % ročně od 2013, 5leté okno nikdy záporné – a riziko, které v našich datech vidět není.',
    url: 'https://etfpruvodce.cz/faktorove-etf/momentum',
    images: [ogImage({ title: 'Momentum: jediný faktor, který porazil index', eyebrow: 'Faktorová analýza · v korunách', stat: '+16,6 % ročně', statLabel: 'od 2013 · S&P 500 měl +15,2 %' })],
    type: 'article',
  },
};

export default async function MomentumFaktor() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  // Čísla z backtest enginu (denní data od 2013-04, v Kč, po TER 0,25 %, roční rebalance),
  // ověřená proti produkčnímu /api/backtest/simulate.
  const rolling = [
    { yrs: '1 rok', avg: '+16,3 %', low: '−17,1 %', high: '+55,8 %', pos: '84 %' },
    { yrs: '5 let', avg: '+13,1 %', low: '+5,1 %', high: '+22,0 %', pos: '100 %' },
    { yrs: '10 let', avg: '+13,2 %', low: '+11,1 %', high: '+15,7 %', pos: '100 %' },
  ];

  const faqs = [
    {
      q: 'Co přesně momentum faktor kupuje?',
      a: 'Akcie, kterým se v posledních 6–12 měsících dařilo nejvíc (očištěno o poslední měsíc a o volatilitu). Index se přeskládává dvakrát ročně, takže složení se průběžně mění podle toho, co zrovna „jede" – jednou technologie, jindy energie nebo banky.',
    },
    {
      q: 'Proč by mělo momentum fungovat i do budoucna?',
      a: 'Nejčastější vysvětlení je behaviorální: investoři na nové informace reagují pomalu (trendy „dojíždějí") a zároveň rádi naskakují na to, co roste. Protože jde o lidské chování, může přetrvávat – ale také se může po rozšíření faktorových ETF oslabit. Záruka neexistuje.',
    },
    {
      q: 'Jaké je největší riziko momenta?',
      a: 'Tzv. momentum crash: prudký obrat trhu po propadu. Momentum drží akcie, které vedly v klesajícím trhu (defenzivní tituly), a při rychlém obratu nahoru zůstane stát – v roce 2009 ztratil americký momentum přes 40 % vůči trhu během pár měsíců. Naše data začínají 2013, takže tento scénář v tabulkách vidět není. To neznamená, že se nevrátí.',
    },
    {
      q: 'Jak si momentum koupím v Česku?',
      a: 'Nejběžnější je iShares Edge MSCI World Momentum Factor (ISIN IE00BP3QZ825, TER 0,25 %) – celosvětová verze dostupná u brokerů v ČR. Detaily a alternativy najdete v našem srovnávači ETF.',
    },
    {
      q: 'Kolik procent portfolia dává smysl dát do momenta?',
      a: 'Pokud vůbec, tak jako doplněk k širokému indexu – běžně se uvádí 10–20 % akciové složky. Momentum má vyšší obrátkovost a specifická rizika; jako jediná akciová pozice se nehodí.',
    },
    {
      q: 'Proč se vaše čísla liší od amerických zdrojů?',
      a: 'Počítáme v korunách (výsledek zahrnuje pohyb kurzu USD/CZK), po odečtení TER a na reálném ETF, ne na papírovém indexu. Americké tabulky bývají v dolarech a bez poplatků.',
    },
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Faktorové ETF', item: 'https://etfpruvodce.cz/faktorove-etf' },
      { '@type': 'ListItem', position: 3, name: 'Momentum', item: 'https://etfpruvodce.cz/faktorove-etf/momentum' },
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
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/pruvodce" className="hover:text-slate-900">Co jsou ETF</Link>
            <Link href="/zebricky" className="hover:text-slate-900">Žebříčky</Link>
            <Link href="/srovnani" className="hover:text-slate-900">Srovnání</Link>
            <Link href="/portfolio-strategie" className="hover:text-slate-900">Portfolia</Link>
            <Link href="/kalkulacky" className="hover:text-slate-900">Kalkulačky</Link>
            <Link href="/kde-koupit" className="hover:text-slate-900">Kde koupit</Link>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <Link href="/faktorove-etf" className="hover:text-slate-600">Faktorové ETF</Link>
          <span>/</span>
          <span className="text-slate-600">Momentum</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Zap className="w-3.5 h-3.5" /> Faktorová analýza 1/6 · momentum
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Momentum: jediný faktor, který porazil index
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Kupovat to, co roste, zní jako nejhloupější možná strategie. Data říkají opak:{' '}
              <strong className="text-white">od roku 2013 vydělal momentum v korunách 16,6 % ročně</strong> a jako
              jediný ze šesti faktorů porazil S&P 500. Tady je celý rozbor – včetně rizika, které v našich číslech
              vidět není.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Scale className="w-4 h-4" /> Otestovat momentum v backtestu
              </Link>
              <Link href="/faktorove-etf" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <BookOpen className="w-4 h-4" /> Přehled všech faktorů
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Denní data 2013–2026, v Kč, po TER</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Vzdělávací a nezávislé</span>
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* 1. JAK FUNGUJE */}
        <section className="pb-10">
          <SectionHead title="Jak momentum funguje" desc="Pravidlo je jednoduché: kup vítěze posledního roku, za půl roku přeskládej." />
          <div className="rounded-lg border border-slate-200 bg-white p-6 max-w-3xl">
            <p className="text-sm text-slate-700 leading-relaxed">
              Momentum index (u ETF nejčastěji metodika MSCI) vybírá akcie s nejlepším výnosem za posledních{' '}
              <strong>6 a 12 měsíců</strong> – s vynecháním posledního měsíce (krátkodobé pohyby se často obracejí)
              a s korekcí na volatilitu (aby nevyhrávaly jen divoké tituly). Přeskládává se dvakrát ročně.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mt-3">
              Proč by to mělo fungovat? Nejpřijímanější vysvětlení je <strong>behaviorální</strong>: trh na nové
              informace reaguje pomalu – dobré zprávy se do ceny promítají týdny a měsíce, ne okamžitě. A jakmile
              trend běží, přitahuje další kupující. Momentum tedy nevydělává na „kvalitě" firem, ale na
              předvídatelných chybách lidského chování.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mt-3">
              Akademicky je momentum popsané od roku 1993 (Jegadeesh a Titman) a drží se napříč trhy, obdobími
              i třídami aktiv. Eugene Fama – otec teorie efektivních trhů, pro kterou je momentum noční můrou –
              ho označil za <em>hlavní anomálii</em> trhu.
            </p>
          </div>
        </section>

        {/* 2. NAŠE ČÍSLA */}
        <section className="pb-10">
          <SectionHead title="Momentum v korunách (duben 2013 – červenec 2026)" desc="Jednorázových 100 000 Kč, po poplatcích (TER 0,25 %), kurz den po dni." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              ['764 000 Kč', 'ze 100 000 Kč za 13 let (+16,6 % ročně). S&P 500 dal za stejné období 651 000 Kč (+15,2 %).', LineChart],
              ['+43,6 %', 'nejlepší rok (2024). V ročence faktorů momentum vyhrálo 5× z 12 let.', Zap],
              ['−30,9 %', 'nejhlubší propad (od listopadu 2021, návrat na vrchol trval 27 měsíců).', History],
            ] as [string, string, typeof Zap][]).map(([big, d, Icon]) => (
              <div key={big} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 mb-3"><Icon className="w-4.5 h-4.5" /></span>
                <p className="text-2xl font-bold text-teal-700 tabular-nums">{big}</p>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50/40 p-5 max-w-3xl">
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900">S pravidelnými vklady:</strong> kdo od dubna 2013 vložil 100 000 Kč
              a přidával 5 000 Kč měsíčně, vložil celkem 895 000 Kč – a dnes by měl{' '}
              <strong className="text-slate-900">přibližně 3 208 000 Kč</strong>.
            </p>
          </div>
        </section>

        {/* 3. ROLLING OKNA */}
        <section className="pb-10">
          <SectionHead title="Klouzavá okna: jak stabilní ten výnos je" desc="Všechna možná období dané délky v našich datech – průměr, nejhorší a nejlepší case." />
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Délka držení</th>
                  <th className="px-4 py-3 text-right">Průměr p.a.</th>
                  <th className="px-4 py-3 text-right">Nejhorší case</th>
                  <th className="px-4 py-3 text-right">Nejlepší case</th>
                  <th className="px-4 py-3 text-right">Kladných období</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {rolling.map((r) => (
                  <tr key={r.yrs} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2.5 font-medium text-slate-900">{r.yrs}</td>
                    <td className="px-4 py-2.5 text-right text-slate-700">{r.avg}</td>
                    <td className="px-4 py-2.5 text-right text-rose-600">{r.low}</td>
                    <td className="px-4 py-2.5 text-right text-teal-700">{r.high}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-900">{r.pos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            Jeden rok je loterie (od −17 % do +56 %). Ale <strong className="text-slate-700">žádné pětileté ani
            desetileté okno v našich datech neskončilo v mínusu</strong> – nejhorší pětiletka dala +5,1 % ročně.
            Platí ovšem výhrada: data pokrývají jen 13 let, vesměs rostoucí trh.
          </p>
        </section>

        {/* 4. KRIZE */}
        <section className="pb-10">
          <SectionHead title="Jak momentum snášelo krize" desc="Dvě velké zkoušky v našem období – v korunách, od vrcholu ke dnu." />
          <div className="grid gap-3 sm:grid-cols-2 max-w-3xl">
            {([
              ['COVID krach (2020)', '−27 %', 'zotavení za 4 měsíce – momentum drželo technologie, které z pandemie vyšly jako vítěz'],
              ['Medvědí trh 2022', '−23 %', 'zotavení za 19 měsíců – obrat trhu momentum zaskočil, držel růstové tituly z 2021'],
            ] as [string, string, string][]).map(([name, drop, d]) => (
              <div key={name} className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="font-semibold text-slate-900 text-sm">{name}</p>
                <p className="text-2xl font-bold text-rose-600 tabular-nums mt-1">{drop}</p>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. SKRYTÉ RIZIKO */}
        <section className="pb-10">
          <SectionHead title="Riziko, které v našich datech vidět není" desc="Poctivost především: nejhorší scénář momenta se stal před začátkem našich dat." />
          <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-6 max-w-3xl">
            <p className="text-sm text-slate-700 leading-relaxed">
              <AlertTriangle className="inline w-4 h-4 text-amber-600 mr-1 -mt-0.5" />
              <strong className="text-slate-900">Momentum crash.</strong> Když trh prudce otočí po velkém propadu,
              momentum drží defenzivní akcie, které „vedly" v klesajícím trhu – a rally úplně propásne, nebo hůř.
              V roce 2009, při obratu po finanční krizi, ztratil americký momentum faktor přes 40 % vůči trhu
              během několika měsíců. <strong className="text-slate-900">Naše data začínají v roce 2013, takže tento
              scénář v žádné z tabulek výše není.</strong> Krásná 13letá statistika zahrnuje jen období, kdy se
              momentu dařilo – to je přesně druh výběrového zkreslení, na který je u faktorů potřeba myslet.
            </p>
          </div>
        </section>

        {/* 6. JAK KOUPIT */}
        <section className="pb-10">
          <SectionHead title="Jak momentum koupit v Česku" desc="Celosvětová UCITS verze dostupná u běžných brokerů." />
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white max-w-3xl">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">ETF</th>
                  <th className="px-4 py-3">ISIN</th>
                  <th className="px-4 py-3 text-right">TER</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2.5 text-slate-700">iShares Edge MSCI World Momentum Factor</td>
                  <td className="px-4 py-2.5"><Link href="/etf/IE00BP3QZ825" className="text-teal-700 hover:underline tabular-nums">IE00BP3QZ825</Link></td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">0,25 %</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            Pozn.: backtest výše běží na nejdelší dostupné řadě (americký momentum od 2013); světová UCITS verze má
            mírně odlišnou metodiku a kratší historii. Kde ETF koupit, srovnáváme v přehledu{' '}
            <Link href="/kde-koupit" className="text-teal-700 underline decoration-teal-300 hover:decoration-teal-600">brokerů</Link>.
          </p>
        </section>

        {/* FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky" desc="Momentum prakticky." />
          <div className="grid gap-3 max-w-3xl">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-lg border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-medium text-slate-900 text-sm flex items-center justify-between">
                  {f.q}
                  <span className="text-slate-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA + pokračování */}
        <section className="pb-12">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-7 md:px-9 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">Otestujte momentum na vlastní čísla</p>
              <p className="text-sm text-slate-300 mt-1">V backtestu ho najdete v kategorii „Akcie – faktory" – zkuste ho i v kombinaci s indexem.</p>
            </div>
            <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-500 transition-colors whitespace-nowrap">
              <Calculator className="w-4 h-4" /> Spustit backtest
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
            {([
              ['/faktorove-etf', 'Přehled všech šesti faktorů'],
              ['/buffettovo-portfolio', 'Buffettovo portfolio 90/10 v korunách'],
              ['/kolik-vydelaly-etf', 'Kolik vydělaly ETF a akcie'],
            ] as [string, string][]).map(([href, label]) => (
              <Link key={href} href={href} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 transition-colors flex items-center justify-between gap-2">
                <span className="text-slate-700">{label}</span>
                <TrendingUp className="w-4 h-4 text-teal-600 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        <div className="pb-10">
          <InvestmentDisclaimer />
        </div>
      </main>
    </div>
  );
}
