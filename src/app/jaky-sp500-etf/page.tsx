import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, ArrowRight, User, Database, Info, Calculator, Wallet, Coins,
  Landmark, Scale, ShieldCheck, HelpCircle, Percent, PiggyBank, Trophy,
  CheckCircle2, BookOpen, Layers,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { getETFsByIsins, CERSTVOST_DNI } from '@/lib/etf-data';
import { datumVynosu } from '@/lib/datumVynosu';
import { procenta, terFmt, velikostFondu } from '@/lib/formatyCisel';
import { SITEMAP_PAIRS } from '@/lib/pairs';
import { cache as reactCache } from 'react';

export const revalidate = 86400;
/* SEO audit kola 6 – kanibalizace s /nejlepsi-etf/nejlepsi-sp500-etf: žebříček = srovnání VŠECH S&P 500 ETF
   („nejlepší S&P 500 ETF“), tahle stránka = průvodce výběrem mezi hlavními fondy („jaký S&P 500 ETF vybrat“).
   Titulek, H1 a popisek se proto nepřekrývají a stránky na sebe odkazují obousměrně. Bez doporučení (jsme srovnávač). */
const TITULEK = 'Jaký S&P 500 ETF vybrat? CSPX, VUAA, SPYL, nebo VUSA';

export async function generateMetadata(): Promise<Metadata> {
  const { datum } = await nactiFondy(); // stejná cache jako stránka – žádný dotaz navíc
  const zaklad = `Jak vybrat mezi ${FUNDS.length} hlavními S&P 500 ETF (CSPX, VUAA, SPYL, VUSA…): poplatek, akumulace, nebo výplata dividend, replikace a výnos v Kč.`;
  return {
    title: { absolute: TITULEK },
    description: datum ? `${zaklad} Data k ${datumText(datum)}.` : zaklad,
    alternates: { canonical: '/jaky-sp500-etf' },
    openGraph: {
      title: TITULEK,
      description: 'Jak vybrat mezi S&P 500 ETF: poplatek, akumulace vs. distribuce, replikace a likvidita, výnos v korunách. Srovnání všech fondů je v žebříčku.',
      url: 'https://etfpruvodce.cz/jaky-sp500-etf',
      images: [ogImage({ title: TITULEK, eyebrow: 'Průvodce výběrem' })],
      type: 'article',
    },
  };
}

/* Kurátorské dvojice S&P 500 – jen ty, které existují v SITEMAP_PAIRS (předgenerované, v sitemapě). */
const DVOJICE = ['cspx-vs-vuaa', 'cspx-vs-spyl', 'cspx-vs-vusa', 'vusa-vs-vuaa', 'cspx-vs-spy5'].filter((p) => SITEMAP_PAIRS.includes(p));

/* Kolo 5 (19. 10. 2026, pravidlo č. 1): velikost, poplatek, typ výplaty, replikace a výnos se NAČÍTAJÍ z DB
   (dřív natvrdo zastaralé velikosti fondů a výnos za 5 let pod hlavičkou „Aktualizováno“ s dnešním datem).
   Poplatky zmíněné v textu (SPDR 0,03 %, Invesco 0,05 %, iShares/Vanguard 0,07 %) hlídá kontrola proti DB.
   Natvrdo zůstávají jen tickery (pro čtení), název a poznámka. Fond se zastaralými daty (CERSTVOST_DNI) = „—“.
   Kontrola: scripts/check-fund-data.mjs (blok kolo5 B) – stránka nesmí mít natvrdo velikost ani výnos.
   Jen fondy na ČISTÝ S&P 500 (market-cap), bez sektorových/equal-weight variant. */
type Fund = { isin: string; tickers: string; name: string; note: string };
const FUNDS: Fund[] = [
  { isin: 'IE00B5BMR087', tickers: 'CSPX / SXR8', name: 'iShares Core S&P 500', note: 'Největší a nejlikvidnější – bezpečná výchozí volba' },
  { isin: 'IE00BFMXXD54', tickers: 'VUAA', name: 'Vanguard S&P 500', note: 'Vanguard, nižší cena jednoho podílu' },
  { isin: 'IE000XZSV718', tickers: 'SPYL', name: 'SPDR S&P 500', note: 'Nejnižší TER (ale širší spread)' },
  // Xetra P500 (EUR), LSE SPXS (USD) – ověřeno 19. 10. 2026 (dřív chybně „SPXP“).
  { isin: 'IE00B3YCGJ38', tickers: 'P500 / SPXS', name: 'Invesco S&P 500', note: 'Swap – historicky mírně lepší tracking' },
  { isin: 'IE00B3XXRP09', tickers: 'VUSA', name: 'Vanguard S&P 500', note: 'Vyplácí dividendy (čtvrtletně)' },
  { isin: 'IE0031442068', tickers: 'IUSA', name: 'iShares Core S&P 500', note: 'iShares distribuční' },
  { isin: 'IE00B6YX5C33', tickers: 'SPY5', name: 'SPDR S&P 500', note: 'Nejnižší TER, distribuční' },
];

type FundData = Fund & {
  ter: number | null; aum: number | null; r5: number | null;
  dist: 'Acc' | 'Dist' | null; repl: 'Fyzická' | 'Syntetická' | null;
};

/** Údaje fondů z DB; zastaralý fond (scraper ho 14+ dní neaktualizoval) → null, ne stará čísla. */
const nactiFondy = reactCache(async (): Promise<{ fondy: FundData[]; datum: Date | null }> => {
  const data = await getETFsByIsins(FUNDS.map((f) => f.isin));
  const podle = new Map(data.map((e) => [e.isin, e]));
  const hranice = Date.now() - CERSTVOST_DNI * 864e5;
  let nejstarsi: Date | null = null;
  const fondy = FUNDS.map((f) => {
    const e = podle.get(f.isin);
    const sd = e?.scraping_date ? new Date(e.scraping_date) : null;
    const ok = !!e && !!sd && sd.getTime() >= hranice;
    const dv = ok ? datumVynosu(e) : null; // den výnosů fondu (returns_as_of), src/lib/datumVynosu.ts
    if (dv && (!nejstarsi || dv < nejstarsi)) nejstarsi = dv;
    const num = (v: unknown) => (ok && v != null && Number.isFinite(Number(v)) ? Number(v) : null);
    const dp = String(e?.distribution_policy ?? '').toLowerCase();
    const rp = String(e?.replication ?? '').toLowerCase();
    return {
      ...f,
      ter: num(e?.ter_numeric), aum: num(e?.fund_size_numeric), r5: num(e?.return_5y_czk),
      dist: !ok ? null : dp.startsWith('accum') ? 'Acc' as const : dp.startsWith('distrib') ? 'Dist' as const : null,
      repl: !ok ? null : /synth|swap/.test(rp) ? 'Syntetická' as const : /phys|full|sampl|optim/.test(rp) ? 'Fyzická' as const : null,
    };
  });
  return { fondy, datum: nejstarsi };
});

const datumText = (d: Date) => d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** Výplata dividend – stejná slova jako srovnávač a detail fondu (Reinvestuje / Vyplácí). */
function VyplataStitek({ dist }: { dist: 'Acc' | 'Dist' }) {
  return (
    <span className={`inline-block whitespace-nowrap text-[11px] px-2 py-0.5 rounded-full ${dist === 'Acc' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
      {dist === 'Acc' ? 'Reinvestuje' : 'Vyplácí'}
    </span>
  );
}

export default async function JakySp500Etf() {
  const { fondy, datum } = await nactiFondy();
  const dateStr = datum ? datumText(datum) : null;
  const podle = (isin: string) => fondy.find((f) => f.isin === isin)!;
  const cspx = podle('IE00B5BMR087');
  const vuaa = podle('IE00BFMXXD54');
  // Výnos za 5 let v Kč: rozpětí přes fondy, které ho mají (SPYL je mladší než 5 let).
  const r5 = fondy.map((f) => f.r5).filter((v): v is number => v != null);
  const r5Text = r5.length >= 2
    ? `${procenta(Math.min(...r5))} až ${procenta(Math.max(...r5))}`
    : null;

  const faqs = [
    {
      q: 'Který S&P 500 ETF je nejlepší?',
      a: 'Neexistuje jeden „nejlepší" – všechny sledují stejný index, takže výnosy jsou prakticky totožné. Jako bezpečná výchozí volba slouží iShares CSPX (největší a nejlikvidnější). Kdo chce nejnižší poplatek, sáhne po SPDR (SPYL/SPY5, TER 0,03 %). Kdo chce dividendy v hotovosti, volí distribuční (VUSA, IUSA).',
    },
    {
      q: 'Jaký je rozdíl mezi CSPX a VUAA?',
      a: `Oba jsou akumulační S&P 500 ETF s TER 0,07 %, fyzickou replikací a irským domicilem – v podstatě zaměnitelné. CSPX (iShares) je mnohem větší (${cspx.aum != null && vuaa.aum != null ? `${velikostFondu(cspx.aum)} vs ${velikostFondu(vuaa.aum)}${dateStr ? ` k ${dateStr}` : ''}` : 'několikanásobně'}), takže má lepší likviditu a o chlup lepší tracking. VUAA (Vanguard) má nižší cenu jednoho podílu, což se hodí při malých pravidelných nákupech.`,
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
      { '@type': 'ListItem', position: 2, name: 'Jaký S&P 500 ETF vybrat', item: 'https://etfpruvodce.cz/jaky-sp500-etf' },
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
          <SiteNav />
          <HeaderSearch />
        </div>
      </header>

      <main id="obsah" className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-400 flex items-center gap-1.5">
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
              Jaký S&amp;P 500 ETF vybrat: CSPX, VUAA, SPYL, nebo VUSA?
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Všechny sledují stejný index, takže výnosy jsou <strong className="text-white">prakticky totožné</strong>.
              Rozdíl je v poplatku, typu výplaty, replikaci a likviditě. Srovnáme je v korunách a ukážeme,{' '}
              <strong className="text-white">podle čeho vybrat</strong>. Všechny fondy na S&amp;P{'\u00a0'}500 seřazené podle dat najdete
              v <Link href="/nejlepsi-etf/nejlepsi-sp500-etf" className="text-white underline underline-offset-2 hover:text-teal-200">žebříčku S&amp;P{'\u00a0'}500 ETF</Link>.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href={`/srovnani?index=${encodeURIComponent('S&P 500')}`} className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800 transition-colors">
                <Scale className="w-4 h-4" /> Všechny S&amp;P 500 ETF ve srovnávači
              </Link>
              <Link href="/svetove-etf-indexy" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <TrendingUp className="w-4 h-4" /> Nebo raději celý svět?
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Výnosy v Kč</span>
              <span className="inline-flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Data z naší databáze</span>
              {dateStr && <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Data k {dateStr}</span>}
            </div>
          </div>
        </section>

        {/* ÚVOD */}
        <section className="pb-9">
          <div className="max-w-3xl text-[15px] text-slate-600 leading-relaxed space-y-3">
            <p>
              „Nejlepší S&amp;P 500 ETF“ je trochu chyták. <strong className="text-slate-900">Všechny sledují úplně
              stejných 500 amerických firem</strong>, takže se jejich výnos za 5 let liší jen o jednotky procentních bodů
              {r5Text ? <> – v korunách udělaly za posledních 5 let <strong className="text-slate-900">{r5Text}</strong>{dateStr ? ` (data k ${dateStr})` : ''}</> : null}.
            </p>
            <p>
              Nevybíráte tedy „lepší výnos“, ale <strong className="text-slate-900">nejnižší náklady a správný typ fondu</strong>.
              Rozhodují čtyři věci: poplatek (TER), akumulace vs. distribuce, replikace a likvidita.
            </p>
          </div>
        </section>

        {/* SROVNÁVACÍ TABULKA */}
        <section className="pb-10">
          <SectionHead title="Srovnání hlavních S&P 500 ETF" desc={`Nejznámější fondy na čistý S&P 500 dostupné českým investorům.${dateStr ? ` Velikost, poplatek a výnos v Kč k ${dateStr}.` : ''}`} />
          {/* Mobil a tablet: karty (tabulka s 8 sloupci byla uříznutá bez náznaku posunu – revize 19. 10. 2026). */}
          <ul className="lg:hidden space-y-2">
            {fondy.map((f) => (
              <li key={f.isin} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/etf/${f.isin}`} className="min-w-0 hover:text-teal-800">
                    <span className="block font-semibold text-slate-900">{f.tickers}</span>
                    <span className="block text-sm text-slate-600">{f.name}</span>
                  </Link>
                  {f.dist && <VyplataStitek dist={f.dist} />}
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500">
                  <div><dt>Poplatek</dt><dd className={`mt-0.5 text-sm font-semibold tabular-nums ${f.ter != null && f.ter <= 0.03 ? 'text-emerald-700' : 'text-slate-900'}`}>{terFmt(f.ter)}</dd></div>
                  <div><dt>Velikost</dt><dd className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">{velikostFondu(f.aum)}</dd></div>
                  <div><dt>5 let v Kč</dt><dd className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">{procenta(f.r5)}</dd></div>
                </dl>
                <p className="mt-2 text-xs text-slate-500">{f.repl ? `${f.repl} replikace · ` : ''}{f.note}</p>
              </li>
            ))}
          </ul>
          <div className="hidden lg:block rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                  <th className="py-3 px-4 text-left font-medium">Tickery</th>
                  <th className="py-3 px-4 text-left font-medium">Fond</th>
                  <th className="py-3 px-4 text-right font-medium">TER</th>
                  <th className="py-3 px-4 text-right font-medium">Velikost</th>
                  <th className="py-3 px-4 text-right font-medium">5 let v Kč</th>
                  <th className="py-3 px-4 text-center font-medium">Dividendy</th>
                  <th className="py-3 px-4 text-center font-medium">Replikace</th>
                  <th className="py-3 px-4 text-left font-medium">Poznámka</th>
                </tr>
              </thead>
              <tbody>
                {fondy.map((f) => (
                  <tr key={f.isin} className="border-b border-slate-100 last:border-0 align-top">
                    <td className="py-3 px-4 font-semibold text-slate-900"><Link href={`/etf/${f.isin}`} className="hover:text-teal-800 hover:underline">{f.tickers}</Link></td>
                    <td className="py-3 px-4 text-slate-600">{f.name}</td>
                    <td className={`py-3 px-4 text-right tabular-nums font-medium whitespace-nowrap ${f.ter != null && f.ter <= 0.03 ? 'text-emerald-700' : 'text-slate-700'}`}>{terFmt(f.ter)}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600 whitespace-nowrap">{velikostFondu(f.aum)}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600 whitespace-nowrap">{procenta(f.r5)}</td>
                    <td className="py-3 px-4 text-center">{f.dist ? <VyplataStitek dist={f.dist} /> : <span className="text-slate-500">—</span>}</td>
                    <td className="py-3 px-4 text-center text-xs text-slate-500">{f.repl ?? '—'}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{f.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-3xl">
            <Info className="inline w-4 h-4 text-slate-400 mr-1 -mt-0.5" />
            iShares CSPX/SXR8/CSSPX je jeden fond na různých burzách (jeden ISIN); SPYL a SPY5 jsou dvě různé třídy SPDR
            (akumulační a distribuční, každá s vlastním ISIN). SPYL je mladší než 5 let, proto u něj výnos za 5 let chybí. Výnosy v Kč
            a aktuální velikost porovnáte v <Link href={`/srovnani?index=${encodeURIComponent('S&P 500')}`} className="text-teal-700 hover:underline">srovnávači (filtr S&amp;P 500)</Link>,
            všechny fondy na index v <Link href="/nejlepsi-etf/nejlepsi-sp500-etf" className="text-teal-700 hover:underline">žebříčku S&amp;P 500 ETF</Link>.
          </p>
          {DVOJICE.length > 0 && (
            <div data-dvojice className="mt-4">
              <p className="text-sm font-medium text-slate-700">Dva fondy vedle sebe:</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {DVOJICE.map((p) => (
                  <li key={p}>
                    <Link href={`/srovnani/${p}`} className="inline-flex items-center min-h-9 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-800">
                      {p.toUpperCase().replace('-VS-', ' vs ')}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
              ['/nejlepsi-etf/nejlepsi-sp500-etf', 'Žebříček S&P 500 ETF', 'Všechny fondy na index: TER, velikost, výnos v Kč', Trophy],
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
              <p className="flex items-start gap-1.5"><Database className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Zdroj: vlastní databáze ETF. Poplatek, velikost, typ výplaty, replikace a výnos v Kč{dateStr ? ` k ${dateStr}` : ' – data nejsou aktuální, proto „—“'}.</p>
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
