import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import { TrendingUp, Compass, ShieldCheck, Wallet, Sparkles } from 'lucide-react';
import EtfSelector, { type UkazkaFondu, type PortfolioKlid, type PropadKategorie } from '@/components/design-preview/EtfSelector';
import { QUESTIONS, CATS } from '@/components/design-preview/vyberEtfData';
import { portfolioModels, PORTFOLIO_BACKTEST, BACKTEST_BENCHMARK, backtestOdkaz } from '@/components/design-preview/portfolioData';
import { INDEX_BY_CODE } from '@/lib/backtest/indexes';
import { predpocitejPortfolio } from '@/lib/backtest/predpocet';
import { vynosyFonduSDatem } from '@/lib/vynosyFonduSDatem';

/* Ukázkový fond každé kategorie výsledku – velký, běžně dostupný fond; výnos za 5 let v Kč z dat fondu s datem.
   Akumulační i distribuční třída: příklad se vybírá podle odpovědi „Co s dividendami?“ (revize 19. 10. 2026:
   „Vyplácet na účet“ ukázalo akumulační SXR8 a pod ním „Hledejte distribuční“). Třídy ověřeny v etf_funds 19. 10. 2026. */
const UKAZKOVE_FONDY: Record<string, { acc: string; dist: string }> = {
  world: { acc: 'IE00BK5BQT80', dist: 'IE00B3RBWM25' },     // Vanguard FTSE All-World – VWCE / VWRL
  usa: { acc: 'IE00B5BMR087', dist: 'IE00B3XXRP09' },       // iShares Core S&P 500 SXR8 / Vanguard S&P 500 VUSA
  europe: { acc: 'IE00B4K48X80', dist: 'IE00B1YZSC51' },    // iShares Core MSCI Europe Acc / Dist
  dividends: { acc: 'IE00BK5BR626', dist: 'IE00B8GKDB10' }, // Vanguard FTSE All-World High Dividend Yield VGWE / VHYL
  tech: { acc: 'IE00B3WJKG14', dist: 'IE00BGQYRS42' },      // iShares S&P 500 IT (QDVE) / Xtrackers MSCI USA IT 1D (XUTC)
  esg: { acc: 'IE00BYX2JD69', dist: 'IE00BDZZTM54' },       // iShares MSCI World SRI EUR Acc / USD Dist
  bonds: { acc: 'IE00B3VTMJ91', dist: 'IE00B14X4Q57' },     // iShares € Govt Bond 1-3yr Acc / Dist – krátký horizont
};

/* Max. propad z backtestu ke KAŽDÉMU výsledku (revize 19. 10. 2026: „Zvládnu střední výkyvy + USA“ → 100 % S&P 500
   bez zmínky o propadu). Řada = index z manifestu, který kategorii odpovídá; kde v datech není (technologie, ESG),
   propad neuvádíme a ukážeme srovnání s nejbližším širokým trhem – viditelně jako „pro srovnání“. Start = nejdřív
   1/2000 (od té doby máme kurzy koruny), jinak první den dat indexu. */
const PROPAD_KATEGORIE: Record<string, { kod: string; nazev: string; jenSrovnani?: string }> = {
  world: { kod: 'ftse_all_world', nazev: 'akcie celého světa (fond VT)' },
  usa: { kod: 'sp500', nazev: 'S&P 500 (fond SPY)' },
  europe: { kod: 'ftse_europe', nazev: 'evropské akcie (fond VGK)' },
  dividends: { kod: 'us_dividend', nazev: 'americké dividendové akcie (fond VYM)' },
  tech: { kod: 'sp500', nazev: 'S&P 500 (fond SPY)', jenSrovnani: 'Řadu technologického indexu v datech nemáme, propad technologických fondů proto neuvádíme.' },
  esg: { kod: 'ftse_all_world', nazev: 'akcie celého světa (fond VT)', jenSrovnani: 'Řadu ESG indexu v datech nemáme, propad ESG fondů proto neuvádíme.' },
  bonds: { kod: 'eur_govt_bond_1_3y', nazev: 'státní dluhopisy eurozóny 1–3 roky (fond iShares € Govt Bond 1-3yr)' },
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
  const fondyRaw = await vynosyFonduSDatem(Object.values(UKAZKOVE_FONDY).flatMap((x) => [x.acc, x.dist]));
  const fondy: Record<string, { acc?: UkazkaFondu; dist?: UkazkaFondu }> = {};
  for (const [k, tridy] of Object.entries(UKAZKOVE_FONDY)) {
    fondy[k] = {};
    for (const t of ['acc', 'dist'] as const) {
      const isin = tridy[t];
      const f = fondyRaw[isin];
      if (f?.nazev) fondy[k][t] = { isin, nazev: f.nazev, ticker: f.ticker, r5: f.r5, datum: f.datum };
    }
  }

  // Max. propad každé kategorie – stejné jádro jako /backtest (předpočet, Kč, 100 000 Kč, bez vkladů).
  const kody = [...new Set(Object.values(PROPAD_KATEGORIE).map((x) => x.kod))];
  const startKodu = (kod: string) => { const s = INDEX_BY_CODE[kod]?.since ?? '2000-01-03'; return s < '2000-01-03' ? '2000-01-03' : s; };
  const vypocty = await Promise.all(kody.map((kod) => predpocitejPortfolio([{ indexCode: kod, weight: 1, ter: 0 }], startKodu(kod))));
  const propadKodu = Object.fromEntries(kody.map((kod, i) => [kod, vypocty[i]]));
  const propady: Record<string, PropadKategorie | null> = Object.fromEntries(Object.entries(PROPAD_KATEGORIE).map(([k, def]) => {
    const r = propadKodu[def.kod];
    const ev = r?.evolution ?? [];
    const dd = r?.risk.maxDrawdown;
    if (!r || ev.length < 2 || !dd) return [k, null];
    return [k, {
      nazev: def.nazev, jenSrovnani: def.jenSrovnani, maxPokles: dd.depth, vrchol: dd.startDate ?? null, dno: dd.troughDate,
      navrat: dd.recovered && dd.endDate ? dd.endDate : null, od: ev[0].date.slice(0, 10), do: ev[ev.length - 1].date.slice(0, 10),
    }];
  }));
  // Kontrolní údaje pro denní kontrolu dat (check-fund-data.mjs, kolo5 A): odkaz do backtestu|CAGR|konečná hodnota|kurz.
  const kontroly = kody.flatMap((kod, i) => {
    const r = vypocty[i]; const ev = r?.evolution ?? [];
    if (!r || ev.length < 2) return [];
    const q = `slozeni=${kod}:100&start=${startKodu(kod)}&amount=100000&contrib=none&vyvazovani=yearly&do=${ev[ev.length - 1].date.slice(0, 10)}`;
    return [`/backtest?${q}|${r.summary.cagr}|${r.summary.netAssetValue}|${r.kurzyDo ?? ''}`];
  });
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
      vrchol: r.risk.maxDrawdown.startDate ?? null, dno: r.risk.maxDrawdown.troughDate,
      od: ev[0].date.slice(0, 10), do: ev[ev.length - 1].date.slice(0, 10), nahrada: PORTFOLIO_BACKTEST[m.slug].nahrada,
    }] : [];
  });
  for (const [i, m] of klidna.entries()) {
    const r = vysledky[i]; const ev = r?.evolution ?? [];
    const odkaz = r && ev.length > 1 ? backtestOdkaz(m.slug, ev[ev.length - 1].date.slice(0, 10)) : null;
    if (r && odkaz) kontroly.push(`${odkaz}|${r.summary.cagr}|${r.summary.netAssetValue}|${r.kurzyDo ?? ''}`);
  }
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

        {/* Kontrolní údaje pro denní kontrolu dat – čísla výsledků musí sedět s živým backtestem (kolo5 A). */}
        <div hidden>{kontroly.map((k) => <span key={k} data-kontrola-backtest={k} />)}</div>
        <section id="kviz-uvod" className="pb-6">
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

        <EtfSelector fondy={fondy} portfoliaKlid={portfoliaKlid} akcie={akcie} propady={propady} />

        {/* Serverem vykreslený popis průvodce (SEO audit 20. 10. 2026: v HTML bylo 77 slov, kvíz se vykreslí až v prohlížeči).
            Otázky a kategorie ze stejných dat jako kvíz (vyberEtfData.ts). Popis faktů, ne doporučení. */}
        <section data-sekce="jak-pruvodce-funguje" className="mt-12 space-y-4 text-[15px] text-slate-700 leading-relaxed">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Jak průvodce funguje</h2>
          <p>
            Průvodce nevybírá konkrétní fond za vás. Podle čtyř odpovědí ukáže, který <strong>typ</strong> ETF jim odpovídá,
            a k němu skutečná čísla z našich dat: výnos ukázkového fondu za 5 let v korunách (s datem, ke kterému platí),
            největší historický propad podobného trhu z backtestu v korunách a odkaz na žebříček, kde fondy daného typu
            porovnáte podle poplatku, velikosti a výnosu. Pravidla jsou pevná – stejné odpovědi dají vždy stejný výsledek.
          </p>
          <h3 className="pt-2 text-base font-semibold text-slate-900">Na co se průvodce ptá</h3>
          <ol className="list-decimal pl-5 space-y-2">
            {QUESTIONS.map((q) => (
              <li key={q.key}>
                <strong>{q.q}</strong> – {q.options.map((o) => o.label).join(' / ')}.
                {q.help && <span className="block text-sm text-slate-500">{q.help}</span>}
              </li>
            ))}
          </ol>
          <h3 className="pt-2 text-base font-semibold text-slate-900">Jaké výsledky může ukázat</h3>
          <ul className="list-disc pl-5 space-y-1.5">
            {Object.values(CATS).map((c) => (
              <li key={c.slug}>
                <Link href={`/nejlepsi-etf/${c.slug}`} className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800">{c.label}</Link> – {c.why}.
              </li>
            ))}
          </ul>
          <p>
            Při horizontu kratším než 3 roky ukáže průvodce dluhopisové ETF s upozorněním, že i ty v korunách kolísají.
            Když nechcete velké propady, uvidíte nejdřív modelová portfolia s dluhopisy s jejich historií z backtestu
            a akciové ETF až jako druhou možnost. U každého výsledku je vysvětlený rozdíl mezi akumulační a distribuční třídou
            a jak se v Česku daní.
          </p>
          <p className="text-sm text-slate-500">
            Jde o vzdělávací nástroj, ne investiční poradenství. Odkud čísla pocházejí, popisuje{' '}
            <Link href="/metodika" className="underline underline-offset-2 hover:text-slate-700">metodika</Link>; všechna portfolia
            najdete v <Link href="/portfolio-strategie" className="underline underline-offset-2 hover:text-slate-700">modelových portfoliích</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}
