import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { TrendingUp, Compass, ShieldCheck, Wallet, Sparkles } from 'lucide-react';
import EtfSelector, { type UkazkaFondu, type PortfolioKlid } from '@/components/design-preview/EtfSelector';
import { portfolioModels, PORTFOLIO_BACKTEST, BACKTEST_BENCHMARK } from '@/components/design-preview/portfolioData';
import { predpocitejPortfolio } from '@/lib/backtest/predpocet';
import { vynosyFonduSDatem } from '@/lib/vynosyFonduSDatem';

/* Ukázkový fond každé kategorie výsledku – velký, běžně dostupný fond; výnos za 5 let v Kč z dat fondu s datem. */
const UKAZKOVE_FONDY: Record<string, string> = {
  world: 'IE00BK5BQT80',     // Vanguard FTSE All-World (VWCE)
  usa: 'IE00B5BMR087',       // iShares Core S&P 500 (SXR8)
  europe: 'IE00B4K48X80',    // iShares Core MSCI Europe (EUNK)
  dividends: 'IE00B8GKDB10', // Vanguard FTSE All-World High Dividend Yield (VHYL)
  tech: 'IE00B3WJKG14',      // iShares S&P 500 Information Technology (QDVE)
  esg: 'IE00BYX2JD69',       // iShares MSCI World SRI
  bonds: 'IE00B14X4Q57',     // iShares € Govt Bond 1-3yr – krátký horizont
};

export const revalidate = 86400;
export const metadata: Metadata = {
  // Self-canonical: na stránku vedou odkazy s parametry (FB, presety, přesměrování) – ty
  // nemají být samostatné URL ve vyhledávači (deep dive 17. 10. 2026).
  alternates: { canonical: '/vyber-etf' },
  title: 'Který ETF si vybrat? Průvodce výběrem ETF pro české investory',
  description: 'Nevíte, který ETF koupit? Odpovězte na 4 otázky a průvodce podle horizontu, rizika a cíle ukáže, které typy ETF a modelová portfolia odpovídají – se skutečnými výnosy v korunách.',
};

export default async function VyberEtfPage() {
  // Skutečná čísla do výsledku (pravidlo č. 1: s datem). Při chybě prázdné → výsledek ukáže „—“ / bez karty.
  const fondyRaw = await vynosyFonduSDatem(Object.values(UKAZKOVE_FONDY));
  const fondy: Record<string, UkazkaFondu> = {};
  for (const [k, isin] of Object.entries(UKAZKOVE_FONDY)) {
    const f = fondyRaw[isin];
    if (f?.nazev) fondy[k] = { isin, nazev: f.nazev, ticker: f.ticker, r5: f.r5, datum: f.datum };
  }
  // „Chci hlavně klid“ = konzervativní modelová portfolia, historie ze stejného předpočtu jako /portfolio-strategie.
  const klidna = portfolioModels.filter((m) => m.risk === 'Konzervativní' && PORTFOLIO_BACKTEST[m.slug]);
  const start = klidna[0] ? PORTFOLIO_BACKTEST[klidna[0].slug].start : null;
  const [vysledky, bench] = await Promise.all([
    Promise.all(klidna.map((m) => predpocitejPortfolio(PORTFOLIO_BACKTEST[m.slug].items, PORTFOLIO_BACKTEST[m.slug].start))),
    start ? predpocitejPortfolio([BACKTEST_BENCHMARK], start) : Promise.resolve(null),
  ]);
  const portfoliaKlid: PortfolioKlid[] = klidna.flatMap((m, i) => {
    const r = vysledky[i];
    const ev = r?.evolution ?? [];
    return r && ev.length > 1 ? [{
      slug: m.slug, nazev: m.name, cagr: r.summary.cagr, maxPokles: r.risk.maxDrawdown.depth,
      od: ev[0].date.slice(0, 10), do: ev[ev.length - 1].date.slice(0, 10), nahrada: PORTFOLIO_BACKTEST[m.slug].nahrada,
    }] : [];
  });
  const akcie = bench ? { cagr: bench.summary.cagr, maxPokles: bench.risk.maxDrawdown.depth } : null;

  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Jak si vybrat správný ETF?', acceptedAnswer: { '@type': 'Answer', text: 'Vyjděte z investičního horizontu (jak dlouho nebudete peníze potřebovat), z toho, jak velký propad unesete, a z cíle (růst, nebo pravidelný příjem). Průvodce podle odpovědí ukáže, které typy ETF a modelová portfolia odpovídají – se skutečnými výnosy v korunách.' } },
      { '@type': 'Question', name: 'Je lepší celosvětový ETF, nebo S&P 500?', acceptedAnswer: { '@type': 'Answer', text: 'Celosvětový ETF (např. FTSE All-World) dává nejširší rozložení bez nutnosti hádat region. S&P 500 je koncentrovaná sázka na 500 největších amerických firem s nižšími poplatky, ale 100 % v USA. Celosvětový fond rozkládá riziko do více zemí.' } },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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

      <main id="obsah" className="max-w-3xl mx-auto px-4 pb-20">
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-700">Domů</Link><span>/</span>
          <span className="text-slate-700">Který ETF vybrat</span>
        </nav>

        <section className="pb-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700"><Sparkles className="w-3.5 h-3.5" /> Průvodce výběrem</span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Který ETF si vybrat?</h1>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Odpovězte na 4 otázky a podle horizontu, rizika a cíle uvidíte, které typy ETF odpovídají –
            se <strong>skutečnými výnosy v korunách</strong> a českým daňovým kontextem. Zdarma, bez registrace.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> 4 otázky, ~30 vteřin</span>
            <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Výnosy v Kč</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Vzdělávací, ne poradenství</span>
          </div>
        </section>

        <EtfSelector fondy={fondy} portfoliaKlid={portfoliaKlid} akcie={akcie} />
      </main>
    </div>
  );
}
