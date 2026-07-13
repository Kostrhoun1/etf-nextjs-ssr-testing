import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, Database, Calculator, Wallet, Scale, ShieldCheck, LineChart,
  Landmark, History, Percent, AlertTriangle,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Buffettovo portfolio 90/10: kolik by vydělalo v korunách',
  description:
    'Warren Buffett předepsal manželce nejjednodušší portfolio na světě: 90 % S&P 500 a 10 % krátkých státních dluhopisů. Přepočítali jsme ho do korun na reálných datech od roku 2002 – výnos, propady i pravidelné investování.',
  alternates: { canonical: '/buffettovo-portfolio' },
  openGraph: {
    title: 'Buffettovo portfolio 90/10: kolik by vydělalo v korunách',
    description:
      'Nejslavnější investiční pokyn světa přepočtený do Kč na datech 2002–2026: ze 100 000 Kč přes 700 tisíc. Včetně propadů a pravidelného investování.',
    url: 'https://etfpruvodce.cz/buffettovo-portfolio',
    images: [ogImage({ title: 'Buffettovo portfolio 90/10 v korunách', eyebrow: 'Světové myšlenky česky', stat: '100 000 → 729 000 Kč', statLabel: 'od 2002 · v Kč · po poplatcích' })],
    type: 'article',
  },
};

export default async function BuffettovoPortfolio() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const faqs = [
    {
      q: 'Co přesně Buffett poradil?',
      a: 'V dopise akcionářům Berkshire Hathaway za rok 2013 popsal pokyn pro správce dědictví své ženy: 10 % do krátkodobých státních dluhopisů a 90 % do velmi levného indexového fondu na S&P 500. Argumentoval, že dlouhodobé výsledky tohoto jednoduchého portfolia překonají většinu investorů, kteří platí drahé správce.',
    },
    {
      q: 'Proč zrovna 90/10 a ne 60/40?',
      a: 'Buffett míří na velmi dlouhý horizont (dědictví) – tam akcie historicky jasně vítězí a dluhopisová složka slouží hlavně jako rezerva na výběry ve špatných letech, ne jako tlumič kolísání. Pro kratší horizont nebo slabší nervy je konzervativnější poměr rozumnější. Porovnat si oba můžete v našem backtestu.',
    },
    {
      q: 'Není 90 % v jediném americkém indexu málo diverzifikace?',
      a: 'To je nejčastější výtka. S&P 500 je 500 velkých firem s globálními tržbami, ale měnově i geograficky je to sázka na USA. Pro českého investora dává smysl zvážit i celosvětovou variantu (FTSE All-World) – v backtestu si obě verze porovnáte na stejném období. Buffett sám americkou koncentraci vědomě přijímá („nikdy nesázejte proti Americe").',
    },
    {
      q: 'Z jakých ETF to poskládám v Česku?',
      a: 'Akciová část: ETF na S&P 500, např. iShares Core S&P 500 (ISIN IE00B5BMR087, TER 0,07 %). Dluhopisová část: krátké americké státní dluhopisy, např. iShares USD Treasury Bond 1–3yr (ISIN IE00BYXPSP02, TER 0,07 %). Obojí koupíte u běžných brokerů dostupných v ČR – viz náš přehled Kde koupit ETF.',
    },
    {
      q: 'Jak často rebalancovat?',
      a: 'Stačí jednou ročně vrátit váhy na 90/10 (náš výpočet s roční rebalancí počítá). U tak malé dluhopisové složky je efekt rebalance malý – důležitější je disciplína nechat portfolio být.',
    },
    {
      q: 'Jak je to s daněmi?',
      a: 'V Česku platí časový test: po 3 letech držení je zisk z prodeje cenných papírů osvobozen od daně z příjmů. U akumulačních ETF se dividendy reinvestují uvnitř fondu, takže průběžně nedaníte nic. Detaily v článku Daně z ETF.',
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
      { '@type': 'ListItem', position: 2, name: 'Buffettovo portfolio 90/10', item: 'https://etfpruvodce.cz/buffettovo-portfolio' },
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
          <span className="text-slate-600">Buffettovo portfolio 90/10</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <LineChart className="w-3.5 h-3.5" /> Světové myšlenky, česká čísla
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Buffettovo portfolio 90/10: kolik by vydělalo v korunách
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Nejslavnější investor světa předepsal pro dědictví své ženy nejjednodušší portfolio, jaké existuje:{' '}
              <strong className="text-white">90 % levný indexový fond na S&P 500 a 10 % krátké státní dluhopisy</strong>.
              Přepočítali jsme ho do korun na reálných denních datech od roku 2002 – ze 100 000 Kč by dnes bylo{' '}
              <strong className="text-white">přes 729 000 Kč</strong>.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Scale className="w-4 h-4" /> Otestovat 90/10 v backtestu
              </Link>
              <Link href="/portfolio-strategie" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <Landmark className="w-4 h-4" /> Další modelová portfolia
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Denní data 2002–2026, v Kč, po TER</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Vzdělávací a nezávislé</span>
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* 1. PŘÍBĚH */}
        <section className="pb-10">
          <SectionHead title="Odkud se 90/10 vzalo" desc="Dopis akcionářům Berkshire Hathaway za rok 2013 – pokyn pro správce dědictví." />
          <div className="rounded-lg border border-slate-200 bg-white p-6 max-w-3xl">
            <p className="text-sm text-slate-700 leading-relaxed">
              Buffett v dopise popsal, co má správce udělat s penězi pro jeho ženu: <em>vložit 10 % do krátkodobých
              státních dluhopisů a 90 % do velmi levného indexového fondu na S&P 500</em>. A dodal, že dlouhodobé
              výsledky tohoto portfolia budou lepší než u většiny investorů – penzijních fondů i institucí – kteří
              platí drahé správce.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mt-3">
              Nebyla to jen teorie. Ve slavné desetileté sázce (2008–2017) postavil levný indexový fond na S&P 500
              proti výběru hedgeových fondů – indexový fond vydělal zhruba +126 %, hedgeové fondy v průměru kolem
              +36 %. Jednoduchost a nízké poplatky vyhrály.
            </p>
            <p className="text-xs text-slate-500 mt-4">
              My jsme si položili otázku, kterou za vás nikdo nespočítá: <strong className="text-slate-700">co by 90/10
              udělalo s korunami českého investora?</strong> Kurz se přepočítává den po dni, výnosy jsou po odečtení
              poplatků ETF (TER).
            </p>
          </div>
        </section>

        {/* 2. ČÍSLA */}
        <section className="pb-10">
          <SectionHead title="Výsledky v korunách (červenec 2002 – červenec 2026)" desc="Jednorázový vklad 100 000 Kč, rebalancováno 1× ročně, po poplatcích ETF." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              ['729 000 Kč', 'hodnota ze 100 000 Kč po 24 letech (výnos 8,6 % ročně).', Percent],
              ['−47 %', 'nejhlubší propad (finanční krize 2008–2009). Kdo vydržel, vydělal.', History],
              ['−27 %', 'nejhorší kalendářní rok (2008). Čisté akcie měly −33 %.', AlertTriangle],
            ] as [string, string, typeof Percent][]).map(([big, d, Icon]) => (
              <div key={big} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 mb-3"><Icon className="w-4.5 h-4.5" /></span>
                <p className="text-2xl font-bold text-teal-700 tabular-nums">{big}</p>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">2002–2026 · v Kč · po TER</th>
                  <th className="px-4 py-3 text-right">Buffett 90/10</th>
                  <th className="px-4 py-3 text-right">100 % S&P 500</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {([
                  ['Hodnota ze 100 000 Kč', '729 413 Kč', '845 188 Kč'],
                  ['Výnos ročně (CAGR)', '+8,6 %', '+9,3 %'],
                  ['Nejhlubší propad', '−47,3 %', '−52,9 %'],
                  ['Kolísavost', '± 19,6 %', '± 21,5 %'],
                  ['Nejhorší rok (2008)', '−27,4 %', '−32,6 %'],
                ] as [string, string, string][]).map(([m, a, b]) => (
                  <tr key={m} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2.5 text-slate-600">{m}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-900">{a}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            Dluhopisová desetina výnos mírně brzdí, ale změkčuje nejhorší chvíle – v roce 2008 o víc než 5 procentních
            bodů. Přesně to od ní Buffett chce: rezervu na výběry ve špatných letech, ne maximalizaci výnosu.
          </p>
        </section>

        {/* 3. DCA */}
        <section className="pb-10">
          <SectionHead title="A co pravidelné investování?" desc="Stejné portfolio, 100 000 Kč na startu + 5 000 Kč měsíčně." />
          <div className="rounded-lg border border-teal-200 bg-teal-50/40 p-6 max-w-3xl">
            <p className="text-sm text-slate-700 leading-relaxed">
              Kdo od července 2002 vložil 100 000 Kč a přidával 5 000 Kč měsíčně, vložil celkem{' '}
              <strong className="text-slate-900">1 540 000 Kč</strong> – a dnes by měl{' '}
              <strong className="text-slate-900">přibližně 7 715 000 Kč</strong>. Pětinásobek vkladů, v korunách,
              po poplatcích, včetně dvou velkých krizí po cestě.
            </p>
            <p className="text-xs text-slate-500 mt-3">
              Každý měsíční vklad se přepočítává kurzem daného dne – žádné průměrování kurzu zpětně.
            </p>
          </div>
        </section>

        {/* 4. POCTIVÉ VÝHRADY */}
        <section className="pb-10">
          <SectionHead title="Co si rozmyslet, než to zkopírujete" desc="Poctivé výhrady – žádné portfolio není zadarmo." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              ['Koncentrace na USA', 'S&P 500 = sázka na americký trh a dolar. Celosvětová varianta (FTSE All-World) je diverzifikovanější – porovnejte si obě v backtestu.'],
              ['Kurz koruny', 'Výnos v Kč zahrnuje pohyb koruny vůči dolaru. Historicky koruna dlouhodobě posilovala – proto je korunový výnos nižší než dolarový. Počítáme to poctivě.'],
              ['Propad −47 % je test nervů', 'Buffett ho ustojí. Vy? Pokud ne, konzervativnější poměr (60/40) je lepší než panický prodej na dně.'],
            ] as [string, string][]).map(([t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="font-semibold text-slate-900 text-sm">{t}</p>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky" desc="Prakticky k portfoliu 90/10 pro českého investora." />
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
              <p className="text-lg font-semibold">Vyzkoušejte Buffettovo 90/10 na vlastní čísla</p>
              <p className="text-sm text-slate-300 mt-1">V backtestu je jako hotový preset – změňte částku, období nebo přidejte vklady.</p>
            </div>
            <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-500 transition-colors whitespace-nowrap">
              <Calculator className="w-4 h-4" /> Spustit backtest
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
            {([
              ['/kolik-vydelaly-etf', 'Kolik vydělaly ETF a akcie: datový rozbor'],
              ['/faktorove-etf', 'Faktorové ETF: co říkají data v Kč'],
              ['/dane-z-etf', 'Daně z ETF v Česku'],
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
