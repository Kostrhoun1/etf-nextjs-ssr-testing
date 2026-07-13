import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, Database, Calculator, Wallet, Scale, ShieldCheck, LineChart,
  AlertTriangle, BookOpen, Layers,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Faktorové ETF: co skutečně říkají data (v korunách)',
  description:
    'Value, momentum, quality, small cap, minimální volatilita, dividendy – co je faktorové investování, co slibuje akademický výzkum a jak faktory dopadly v korunách na reálných datech od roku 2000. Včetně konkrétních UCITS ETF.',
  alternates: { canonical: '/faktorove-etf' },
  openGraph: {
    title: 'Faktorové ETF: co skutečně říkají data (v korunách)',
    description:
      'Šest faktorů přepočtených do Kč na denních datech. Spoiler: od 2013 porazil S&P 500 jediný. Poctivý rozbor včetně konkrétních UCITS ETF.',
    url: 'https://etfpruvodce.cz/faktorove-etf',
    images: [ogImage({ title: 'Faktorové ETF: co skutečně říkají data', eyebrow: 'Datový rozbor · v korunách', stat: '1 ze 6', statLabel: 'faktorů porazil S&P 500 (od 2013, v Kč)' })],
    type: 'article',
  },
};

export default async function FaktoroveEtf() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  // Čísla z našeho backtest enginu (denní data, v Kč, po TER, roční rebalance).
  // Každý faktor od začátku svých dat + S&P 500 na STEJNÉM okně (férové srovnání).
  const factors = [
    { name: 'Value (hodnotové akcie)', od: '2000', nav: '398 tis.', cagr: '+5,4 %', dd: '−64 %', spNav: '419 tis.', spCagr: '+5,6 %', beat: false,
      what: 'Levné firmy vůči účetní hodnotě a ziskům. Nejstarší „prémiový" faktor (Fama–French).' },
    { name: 'Small cap (malé firmy)', od: '2000', nav: '444 tis.', cagr: '+5,9 %', dd: '−63 %', spNav: '419 tis.', spCagr: '+5,6 %', beat: true,
      what: 'Menší firmy s vyšším růstovým potenciálem – a vyšším rizikem.' },
    { name: 'Dividendové akcie', od: '2006', nav: '532 tis.', cagr: '+8,9 %', dd: '−55 %', spNav: '739 tis.', spCagr: '+10,7 %', beat: false,
      what: 'Firmy s vysokou dividendou. Psychologicky příjemné, matematicky žádná záruka.' },
    { name: 'Minimální volatilita', od: '2011', nav: '572 tis.', cagr: '+12,6 %', dd: '−26 %', spNav: '936 tis.', spCagr: '+16,4 %', beat: false,
      what: 'Akcie s nejmenším kolísáním. Slibuje klidnější jízdu za cenu nižšího výnosu.' },
    { name: 'Momentum', od: '2013', nav: '764 tis.', cagr: '+16,6 %', dd: '−31 %', spNav: '651 tis.', spCagr: '+15,2 %', beat: true,
      what: 'Akcie, kterým se dařilo v posledním roce. Nejsilnější faktor posledního desetiletí.' },
    { name: 'Quality (kvalitní firmy)', od: '2013', nav: '548 tis.', cagr: '+14,0 %', dd: '−27 %', spNav: '592 tis.', spCagr: '+14,7 %', beat: false,
      what: 'Ziskové firmy s nízkým dluhem a stabilními maržemi.' },
  ];

  const etfs = [
    ['Value', 'iShares Edge MSCI World Value Factor', 'IE00BP3QZB59', '0,25 %'],
    ['Small cap', 'iShares MSCI World Small Cap', 'IE00BF4RFH31', '0,35 %'],
    ['Dividendy', 'Vanguard FTSE All-World High Dividend Yield', 'IE00B8GKDB10', '0,29 %'],
    ['Min. volatilita', 'iShares Edge MSCI World Minimum Volatility', 'IE00B8FHGS14', '0,30 %'],
    ['Momentum', 'iShares Edge MSCI World Momentum Factor', 'IE00BP3QZ825', '0,25 %'],
    ['Quality', 'iShares Edge MSCI World Quality Factor', 'IE00BP3QZ601', '0,25 %'],
  ] as [string, string, string, string][];

  const faqs = [
    {
      q: 'Co je faktorové investování?',
      a: 'Investování do skupin akcií se společnou vlastností (levné, malé, rostoucí cenou, kvalitní…), u kterých akademický výzkum historicky naměřil vyšší výnos nebo nižší riziko než u celého trhu. Základ položili ekonomové Fama a French v 90. letech. Faktorové ETF tato pravidla automatizují.',
    },
    {
      q: 'Funguje to? Porazím s faktory trh?',
      a: 'Na dlouhých akademických datech faktory prémii měly. V praxi posledních 10–25 let je to slabší: v našem korunovém přepočtu porazil S&P 500 od roku 2013 jediný faktor (momentum) a od roku 2000 jen malé firmy, o desetiny procenta. Faktory umí i dekádu zaostávat – kdo je kupuje, musí to vydržet.',
    },
    {
      q: 'Proč se výsledky liší od amerických studií?',
      a: 'Tři důvody: (1) studie často měří teoretické portfolio bez poplatků, my počítáme reálné ETF po TER; (2) my přepočítáváme do korun, takže výsledek zahrnuje i pohyb kurzu; (3) prémii, kterou všichni znají, trh částečně „vyarbitrážuje" – po objevení bývají faktory slabší.',
    },
    {
      q: 'Mám faktorové ETF vůbec kupovat?',
      a: 'Pro většinu investorů je základní široký index (celý svět nebo S&P 500) jednodušší a historicky srovnatelně dobrý. Faktory dávají smysl jako menší doplněk (např. 10–20 % portfolia) pro toho, kdo jim rozumí, věří evidenci a udrží je i v letech, kdy zaostávají. Rozhodně ne jako náhrada základu.',
    },
    {
      q: 'Jaký je rozdíl mezi daty v backtestu a UCITS ETF v tabulce?',
      a: 'Nejdelší dostupné denní řady jsou z amerických faktorových ETF (od 2000), evropské UCITS verze jsou mladší (většinou od 2014). V backtestu proto testujete americké faktorové řady; v tabulce doporučujeme evropské UCITS ekvivalenty, které v ČR reálně koupíte. Metodiky indexů se mírně liší.',
    },
    {
      q: 'Který faktor je „nejlepší"?',
      a: 'Žádný není nejlepší napořád – vedou se střídavě. Momentum táhlo posledních 10 let, value zase 2000–2007. Pokud faktory, tak spíš kombinaci (multifaktor), a hlavně: levně, dlouhodobě a bez přebíhání podle posledního roku.',
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
          <span className="text-slate-600">Faktorové ETF</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Layers className="w-3.5 h-3.5" /> Datový rozbor · šest faktorů v korunách
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Faktorové ETF: co skutečně říkají data
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Value, momentum, quality, malé firmy… Faktorové investování slibuje porazit trh vědecky. Přepočítali
              jsme šest faktorů do korun na reálných denních datech – a výsledek je střízlivější, než říká marketing:{' '}
              <strong className="text-white">od roku 2013 porazil S&P 500 jediný faktor</strong>.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Scale className="w-4 h-4" /> Otestovat faktory v backtestu
              </Link>
              <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <BookOpen className="w-4 h-4" /> Najít faktorové ETF
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Denní data od 2000, v Kč, po TER</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Vzdělávací a nezávislé</span>
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* 1. CO TO JE */}
        <section className="pb-10">
          <SectionHead title="Co je faktorové investování" desc="Místo výběru jednotlivých akcií sázíte na vlastnosti, které historicky nesly prémii." />
          <div className="rounded-lg border border-slate-200 bg-white p-6 max-w-3xl">
            <p className="text-sm text-slate-700 leading-relaxed">
              Akademický výzkum (nejznáměji Fama a French v 90. letech) našel skupiny akcií, které dlouhodobě
              vydělávaly víc, než by odpovídalo jejich riziku: <strong>levné firmy (value)</strong>,{' '}
              <strong>malé firmy (size)</strong>, později <strong>momentum</strong>, <strong>kvalita</strong> a{' '}
              <strong>nízká volatilita</strong>. Faktorové ETF tyto „recepty“ automatizují – místo správce vybírá
              akcie pravidlo.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mt-3">
              Zní to jako věda, a částečně to věda je. Háček: prémie byly naměřené na dlouhé americké historii,
              před poplatky a před tím, než je znal celý svět. Jak dopadly <em>reálné faktorové ETF</em> přepočtené{' '}
              <em>do korun</em>? To spočítal náš backtest engine – stejný, který pohání{' '}
              <Link href="/backtest" className="text-teal-700 underline decoration-teal-300 hover:decoration-teal-600">kalkulačku backtestu</Link>.
            </p>
          </div>
        </section>

        {/* 2. TABULKA FAKTORŮ */}
        <section className="pb-10">
          <SectionHead title="Šest faktorů v korunách – proti S&P 500 na stejném období" desc="Jednorázových 100 000 Kč, každý faktor od začátku svých dat. Po poplatcích, kurz den po dni." />
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Faktor</th>
                  <th className="px-4 py-3">Data od</th>
                  <th className="px-4 py-3 text-right">Ze 100 tis. Kč</th>
                  <th className="px-4 py-3 text-right">Ročně</th>
                  <th className="px-4 py-3 text-right">Propad</th>
                  <th className="px-4 py-3 text-right">S&P 500 stejné období</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {factors.map((f) => (
                  <tr key={f.name} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{f.name} {f.beat && <span className="ml-1 rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700 align-middle">porazil index</span>}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{f.what}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{f.od}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">{f.nav}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{f.cagr}</td>
                    <td className="px-4 py-3 text-right text-rose-600">{f.dd}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{f.spNav} ({f.spCagr})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            Čtěte po řádcích, ne mezi řádky: momentum od 2013 index porazilo (+16,6 % vs. +15,2 %), malé firmy od 2000
            těsně také – všechno ostatní zaostalo. Minimální volatilita splnila slib nižšího kolísání (propad −26 %),
            ale stála skoro 4 procentní body výnosu ročně.
          </p>
        </section>

        {/* 3. VALUE VS GROWTH OD 2000 */}
        <section className="pb-10">
          <SectionHead title="Poučení z roku 2000: value vs. growth" desc="Kdo koupil na vrcholu dot-com bubliny, čekal na odpověď 26 let." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              ['398 tis. Kč', 'value (hodnotové akcie) – prvních 7 let jasně vedly, pak 15 let zaostávaly.'],
              ['423 tis. Kč', 'growth (růstové akcie) – po dot-com krachu propad v Kč až −81 %, dohnaly to až po 2010.'],
              ['419 tis. Kč', 'S&P 500 – celý trh skončil… přesně mezi nimi.'],
            ] as [string, string][]).map(([big, d]) => (
              <div key={big} className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-2xl font-bold text-teal-700 tabular-nums">{big}</p>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            Za 26 let od vrcholu bubliny se rozdíl mezi „levnými“ a „drahými“ akciemi v korunách prakticky smazal –
            ale po cestě se vedení několikrát prohodilo, vždy na roky. To je hlavní lekce faktorů:{' '}
            <strong className="text-slate-700">fungují v dekádách, ne v letech</strong> – a většina investorů je
            vzdá přesně ve chvíli, kdy zaostávají.
          </p>
        </section>

        {/* 4. VAROVÁNÍ */}
        <section className="pb-10">
          <SectionHead title="Tři poctivá varování" desc="Než faktorům propadnete." />
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              ['Dekáda zaostávání je normální', 'Value zaostávalo za trhem prakticky celá 2010s. Kdo nevydrží 10 let podprůměru, faktorům jen zaplatí vyšší TER a nervy.', AlertTriangle],
              ['Prémii sežraly poplatky a sláva', 'Faktorové ETF stojí 0,25–0,35 % (vs. 0,03–0,07 % u indexu) a známou prémii trh částečně vyarbitrážoval. Rozdíl je pak menší, než ukazují studie.', Scale],
              ['Základ portfolia to není', 'Faktor je koření, ne jídlo. Základem zůstává široký levný index – faktory případně jako menší, vědomý doplněk.', ShieldCheck],
            ] as [string, string, typeof AlertTriangle][]).map(([t, d, Icon]) => (
              <div key={t} className="rounded-lg border border-amber-200 bg-amber-50/40 p-5">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100 text-amber-700 mb-3"><Icon className="w-4.5 h-4.5" /></span>
                <p className="font-semibold text-slate-900 text-sm">{t}</p>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. KONKRÉTNÍ ETF */}
        <section className="pb-10">
          <SectionHead title="Faktorové UCITS ETF dostupné v Česku" desc="Celosvětové faktorové verze od velkých správců. Detaily a srovnání najdete v našem srovnávači." />
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Faktor</th>
                  <th className="px-4 py-3">ETF</th>
                  <th className="px-4 py-3">ISIN</th>
                  <th className="px-4 py-3 text-right">TER</th>
                </tr>
              </thead>
              <tbody>
                {etfs.map(([f, name, isin, ter]) => (
                  <tr key={isin} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2.5 font-medium text-slate-900">{f}</td>
                    <td className="px-4 py-2.5 text-slate-700">{name}</td>
                    <td className="px-4 py-2.5"><Link href={`/etf/${isin}`} className="text-teal-700 hover:underline tabular-nums">{isin}</Link></td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">{ter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            Pozn.: nejdelší denní řady pro backtest pocházejí z amerických faktorových ETF (od roku 2000); evropské
            UCITS verze v tabulce jsou mladší, ale v ČR je reálně koupíte. Metodiky se mírně liší.
          </p>
        </section>

        {/* FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky" desc="Faktory prakticky a bez marketingu." />
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
              <p className="text-lg font-semibold">Otestujte si faktory sami</p>
              <p className="text-sm text-slate-300 mt-1">Value, momentum, quality i další jsou nově v backtestu – na denních datech, v korunách.</p>
            </div>
            <Link href="/backtest" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-500 transition-colors whitespace-nowrap">
              <Calculator className="w-4 h-4" /> Spustit backtest
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
            {([
              ['/buffettovo-portfolio', 'Buffettovo portfolio 90/10 v korunách'],
              ['/kolik-vydelaly-etf', 'Kolik vydělaly ETF a akcie: datový rozbor'],
              ['/svetove-etf-indexy', 'Světové ETF indexy: který vybrat'],
            ] as [string, string][]).map(([href, label]) => (
              <Link key={href} href={href} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 transition-colors flex items-center justify-between gap-2">
                <span className="text-slate-700">{label}</span>
                <LineChart className="w-4 h-4 text-teal-600 shrink-0" />
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
