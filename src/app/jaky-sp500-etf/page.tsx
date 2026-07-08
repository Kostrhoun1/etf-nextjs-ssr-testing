import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  TrendingUp, ArrowRight, User, Database, Info, Calculator, Wallet, Coins,
  Landmark, Scale, ShieldCheck, HelpCircle, Percent, PiggyBank, Trophy,
  CheckCircle2, BookOpen, Layers,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getDataDate } from '@/lib/etf-data';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Který S&P 500 ETF koupit? CSPX vs VUAA vs VUSA vs SPYL (v Kč)',
  description:
    'Srovnání nejlepších S&P 500 ETF pro české investory: CSPX, VUAA, SPYL, VUSA, SPY5, Invesco. TER, akumulační vs distribuční, replikace a výnos v korunách – a který si vybrat.',
  alternates: { canonical: '/jaky-sp500-etf' },
  openGraph: {
    title: 'Který S&P 500 ETF koupit? CSPX vs VUAA vs VUSA vs SPYL',
    description:
      'Srovnání S&P 500 ETF v korunách: TER, akumulace vs distribuce, replikace, likvidita – a jasné doporučení, který vybrat.',
    url: 'https://etfpruvodce.cz/jaky-sp500-etf',
    type: 'article',
  },
};

/* Data z naší databáze (velikost/výnosy orientační – aktuální ve srovnávači).
   TER, typ výplaty a replikace jsou stabilní. Jen fondy sledující ČISTÝ
   S&P 500 (market-cap), bez sektorových/equal-weight variant. */
type Fund = {
  tickers: string; name: string; ter: number; aumMld: number;
  dist: 'Acc' | 'Dist'; repl: 'Fyzická' | 'Syntetická'; note: string;
};
const FUNDS: Fund[] = [
  { tickers: 'CSPX / SXR8', name: 'iShares Core S&P 500', ter: 0.07, aumMld: 131, dist: 'Acc', repl: 'Fyzická', note: 'Největší a nejlikvidnější – bezpečná výchozí volba' },
  { tickers: 'VUAA', name: 'Vanguard S&P 500', ter: 0.07, aumMld: 27, dist: 'Acc', repl: 'Fyzická', note: 'Vanguard, nižší cena jednoho podílu' },
  { tickers: 'SPYL', name: 'SPDR S&P 500', ter: 0.03, aumMld: 15, dist: 'Acc', repl: 'Fyzická', note: 'Nejnižší TER (ale širší spread)' },
  { tickers: 'SPXP / SPXS', name: 'Invesco S&P 500', ter: 0.05, aumMld: 36, dist: 'Acc', repl: 'Syntetická', note: 'Swap – historicky mírně lepší tracking' },
  { tickers: 'VUSA', name: 'Vanguard S&P 500', ter: 0.07, aumMld: 46, dist: 'Dist', repl: 'Fyzická', note: 'Vyplácí dividendy (čtvrtletně)' },
  { tickers: 'IUSA', name: 'iShares Core S&P 500', ter: 0.07, aumMld: 19, dist: 'Dist', repl: 'Fyzická', note: 'iShares distribuční' },
  { tickers: 'SPY5', name: 'SPDR S&P 500', ter: 0.03, aumMld: 18, dist: 'Dist', repl: 'Fyzická', note: 'Nejnižší TER, distribuční' },
];

export default async function JakySp500Etf() {
  const today = new Date();
  const dateStr = (await getDataDate(today)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  const faqs = [
    {
      q: 'Který S&P 500 ETF je nejlepší?',
      a: 'Neexistuje jeden „nejlepší" – všechny sledují stejný index, takže výnosy jsou prakticky totožné. Jako bezpečná výchozí volba slouží iShares CSPX (největší a nejlikvidnější). Kdo chce nejnižší poplatek, sáhne po SPDR (SPYL/SPY5, TER 0,03 %). Kdo chce dividendy v hotovosti, volí distribuční (VUSA, IUSA).',
    },
    {
      q: 'Jaký je rozdíl mezi CSPX a VUAA?',
      a: 'Oba jsou akumulační S&P 500 ETF s TER 0,07 %, fyzickou replikací a irským domicilem – v podstatě zaměnitelné. CSPX (iShares) je mnohem větší (~131 mld. € vs ~27 mld.), takže má lepší likviditu a o chlup lepší tracking. VUAA (Vanguard) má nižší cenu jednoho podílu, což se hodí při malých pravidelných nákupech.',
    },
    {
      q: 'Akumulační, nebo distribuční S&P 500 ETF?',
      a: 'Pro dlouhodobé zhodnocení je pro české investory obvykle jednodušší akumulační (CSPX, VUAA, SPYL): dividendy reinvestuje uvnitř fondu, nedaníte je každý rok a celý výnos se schová pod tříletý časový test. Distribuční (VUSA, IUSA, SPY5) vyplácí dividendy v hotovosti, které se daní 15 %.',
    },
    {
      q: 'Proč je SPDR (SPYL) levnější, ale ne vždy výhodnější?',
      a: 'SPDR má nejnižší TER (0,03 % vs 0,07 % u iShares/Vanguard), ale historicky širší rozpětí nákup/prodej (spread). U jednorázové malé investice může vyšší spread ten rozdíl v TER sníst; u dlouhodobého držení a větších částek se nižší TER vyplatí. Rozhoduje celková nákladovost, ne jen poplatek.',
    },
    {
      q: 'Fyzická, nebo syntetická replikace?',
      a: 'Většina velkých S&P 500 ETF je fyzická (drží reálné akcie) – transparentní a bez protistrany. Syntetické (Invesco, Amundi) používají swap a díky daňové mechanice US dividend mívají historicky o chlup lepší tracking, nesou ale malé riziko protistrany. Pro většinu investorů je fyzická replikace klidnější volba.',
    },
    {
      q: 'Poznám fond podle tickeru?',
      a: 'Ano – ticker se liší podle burzy (iShares Core S&P 500 se obchoduje jako CSPX na londýnské burze, SXR8 na Xetře, CSSPX v Miláně – vše je ale jeden fond, ISIN IE00B5BMR087). V našem srovnávači u každého fondu vidíte všechny tickery i ISIN.',
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
      { '@type': 'ListItem', position: 2, name: 'Který S&P 500 ETF', item: 'https://etfpruvodce.cz/jaky-sp500-etf' },
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
        {/* Breadcrumb */}
        <nav className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Domů</Link>
          <span>/</span>
          <span className="text-slate-600">Který S&amp;P 500 ETF</span>
        </nav>

        {/* HERO */}
        <section className="pb-7">
          <div className="rounded-2xl bg-slate-900 text-white px-6 py-8 md:px-9 md:py-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200">
              <Landmark className="w-3.5 h-3.5" /> Vzdělávací pilíř · výnosy v Kč
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
              Který S&amp;P 500 ETF koupit? CSPX vs VUAA vs VUSA vs SPYL
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Všechny sledují stejný index, takže výnosy jsou <strong className="text-white">prakticky totožné</strong>.
              Rozdíl je v poplatku, typu výplaty, replikaci a likviditě. Srovnáme je v korunách a řekneme,{' '}
              <strong className="text-white">který si vybrat</strong>.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href={`/srovnani?index=${encodeURIComponent('S&P 500')}`} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                <Scale className="w-4 h-4" /> Všechny S&amp;P 500 ETF ve srovnávači
              </Link>
              <Link href="/svetove-etf-indexy" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <TrendingUp className="w-4 h-4" /> Nebo raději celý svět?
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Výnosy v Kč</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Data z naší databáze</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Aktualizováno {dateStr}</span>
            </div>
          </div>
        </section>

        {/* ÚVOD */}
        <section className="pb-9">
          <div className="max-w-3xl text-[15px] text-slate-600 leading-relaxed space-y-3">
            <p>
              „Nejlepší S&amp;P 500 ETF" je trochu chyták. <strong className="text-slate-900">Všechny sledují úplně
              stejných 500 amerických firem</strong>, takže jejich výnos se za 5 let liší jen o setiny procenta – v
              korunách všechny udělaly zhruba <strong className="text-slate-900">+78 % za posledních 5 let</strong>.
            </p>
            <p>
              Nevybíráte tedy „lepší výnos", ale <strong className="text-slate-900">nejnižší náklady a správný typ fondu</strong>.
              Rozhodují čtyři věci: poplatek (TER), akumulace vs. distribuce, replikace a likvidita.
            </p>
          </div>
        </section>

        {/* SROVNÁVACÍ TABULKA */}
        <section className="pb-10">
          <SectionHead title="Srovnání hlavních S&P 500 ETF" desc="Nejznámější fondy na čistý S&P 500 dostupné českým investorům. Velikost je orientační; aktuální čísla a výnosy v Kč najdete ve srovnávači." />
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                  <th className="py-3 px-4 text-left font-medium">Tickery</th>
                  <th className="py-3 px-4 text-left font-medium">Fond</th>
                  <th className="py-3 px-4 text-right font-medium">TER</th>
                  <th className="py-3 px-4 text-right font-medium">Velikost</th>
                  <th className="py-3 px-4 text-center font-medium">Výplata</th>
                  <th className="py-3 px-4 text-center font-medium">Replikace</th>
                  <th className="py-3 px-4 text-left font-medium">Poznámka</th>
                </tr>
              </thead>
              <tbody>
                {FUNDS.map((f) => (
                  <tr key={f.tickers} className="border-b border-slate-100 last:border-0 align-top">
                    <td className="py-3 px-4 font-semibold text-slate-900">{f.tickers}</td>
                    <td className="py-3 px-4 text-slate-600">{f.name}</td>
                    <td className={`py-3 px-4 text-right tabular-nums font-medium ${f.ter <= 0.03 ? 'text-emerald-700' : 'text-slate-700'}`}>{f.ter.toLocaleString('cs-CZ', { minimumFractionDigits: 2 })} %</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600">~{f.aumMld} mld. €</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full ${f.dist === 'Acc' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>{f.dist === 'Acc' ? 'ACC' : 'DIST'}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-slate-500">{f.repl}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{f.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            iShares CSPX/SXR8/CSSPX i SPDR SPYL/SPY5 jsou stejné fondy na různých burzách (jeden ISIN). Výnosy v Kč
            a aktuální velikost porovnáte v <Link href={`/srovnani?index=${encodeURIComponent('S&P 500')}`} className="text-teal-700 hover:underline">srovnávači (filtr S&amp;P 500)</Link>.
          </p>
        </section>

        {/* ROZHODOVACÍ VODÍTKO */}
        <section className="pb-10">
          <SectionHead title="Který si vybrat (rychlé vodítko)" desc="Podle toho, co je pro vás priorita." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {([
              [Trophy, 'Nechci nic řešit', 'CSPX (iShares) – největší, nejlikvidnější, akumulační. Bezpečný default.'],
              [Percent, 'Nejnižší poplatek', 'SPYL / SPY5 (SPDR), TER 0,03 %. Pozor na spread u malých částek.'],
              [PiggyBank, 'Chci dividendy v hotovosti', 'VUSA nebo IUSA (distribuční) – vyplácí čtvrtletně.'],
              [Coins, 'Malé pravidelné nákupy', 'VUAA (Vanguard) – nižší cena jednoho podílu.'],
            ] as [typeof Trophy, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 mb-2.5"><Icon className="w-4 h-4" /></span>
                <p className="text-sm font-semibold text-slate-900 leading-snug">{t}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NA CO KOUKAT */}
        <section className="pb-10">
          <SectionHead title="Čtyři věci, které rozhodují" desc="Výnos ne (ten je stejný). Tohle ano." />
          <div className="space-y-3">
            {([
              [Percent, 'Poplatek (TER)', 'Rozpětí je 0,03–0,07 % ročně. Rozdíl je malý, ale za desítky let se sečte. U velkých částek a dlouhého držení má nejnižší TER (SPDR) navrch – pokud ho nesní širší spread.'],
              [PiggyBank, 'Akumulace vs. distribuce', 'Akumulační reinvestuje dividendy uvnitř (daňově jednodušší pro dlouhodobé zhodnocení). Distribuční vyplácí hotovost, která se daní 15 %. Viz náš průvodce daněmi.'],
              [Layers, 'Replikace', 'Fyzická drží reálné akcie (transparentní). Syntetická (swap) mívá o chlup lepší tracking díky daňové mechanice US dividend, nese ale malé riziko protistrany.'],
              [Scale, 'Likvidita a spread', 'Větší fond = užší rozpětí nákup/prodej = levnější obchod. CSPX je zdaleka největší; drobný spread ušetříte hlavně u větších nebo jednorázových nákupů.'],
            ] as [typeof Percent, string, string][]).map(([Icon, t, d]) => (
              <div key={t} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-slate-200 shrink-0"><Icon className="w-5 h-5" /></span>
                <div>
                  <p className="font-semibold text-slate-900">{t}</p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* JEN USA? */}
        <section className="pb-10">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>Pozor na jednu věc:</strong> S&amp;P 500 je 500 <em>amerických</em> firem – veškerá vejce v jednom
              (americkém) koši. Kdo chce rozložit riziko napříč celým světem, zvažuje celosvětový index.{' '}
              <Link href="/svetove-etf-indexy" className="font-medium text-amber-900 underline">Porovnání S&amp;P 500 vs MSCI World vs FTSE All-World →</Link>
            </p>
          </div>
        </section>

        {/* NÁSTROJE */}
        <section className="pb-10">
          <SectionHead title="Pokračujte dál" desc="Ověřte si konkrétní čísla a zasaďte fond do plánu." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ['/srovnani?index=' + encodeURIComponent('S&P 500'), 'Všechny S&P 500 ETF', 'Filtr S&P 500, výnos v Kč', Scale],
              ['/dane-z-etf', 'Daně z ETF', 'Acc vs Dist a časový test', Coins],
              ['/kalkulacka', 'Kalkulačka poplatků', 'Kolik ukrojí TER za 30 let', Percent],
              ['/svetove-etf-indexy', 'Který světový index', 'S&P 500 vs MSCI World vs All-World', TrendingUp],
              ['/kolik-investovat-mesicne', 'Kolik investovat měsíčně', 'Cesta k milionu v Kč', Calculator],
              ['/kde-koupit', 'Kde koupit ETF', 'Přehled brokerů v ČR', Landmark],
            ] as [string, string, string, typeof Wallet][]).map(([href, label, desc, Icon]) => (
              <Link key={href} href={href} className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 text-teal-700 shrink-0 group-hover:bg-teal-100 transition-colors"><Icon className="w-4 h-4" /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900 group-hover:text-teal-700">{label}</span>
                  <span className="block text-xs text-slate-500 leading-relaxed">{desc}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-700 shrink-0 ml-auto" />
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-10">
          <SectionHead title="Časté otázky" />
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

        {/* E-E-A-T */}
        <section className="pb-8">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Srovnání stavíme nezávisle a nekomerčně, z vlastní databáze – bez provizí a placeného pořadí.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p className="flex items-start gap-1.5"><Database className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Zdroj: vlastní databáze ETF (justETF). TER/typ/replikace jsou stabilní, velikost a výnosy orientační. Aktualizováno {dateStr}.</p>
              <p className="flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Vzdělávací obsah, není investičním doporučením.</p>
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="pb-12">
          <InvestmentDisclaimer />
        </section>
      </main>

    </div>
  );
}
