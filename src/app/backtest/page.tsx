import { Metadata } from 'next';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, ArrowRight, User, Database, Calculator,
  Wallet, Scale, Landmark, HelpCircle, BookOpen,
} from 'lucide-react';
import { SectionHead } from '@/components/design-preview/CategoryUI';
import InfoTip from '@/components/design-preview/InfoTip';
import BacktestWidget, { type BacktestResult } from '@/components/design-preview/BacktestWidget';
import { VYCHOZI_SCENAR } from '@/lib/backtest/vychoziScenar';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { simulateAndSerialize } from '@/lib/backtest/simulate';
import { ogImage } from '@/lib/ogImage';

export const revalidate = 86400;
export const metadata: Metadata = {
  // Self-canonical: na stránku vedou odkazy s parametry (FB, presety, přesměrování) – ty
  // nemají být samostatné URL ve vyhledávači (deep dive 17. 10. 2026).
  alternates: { canonical: '/backtest' },
  title: 'Backtest portfolia ETF: historický test výnosů a poklesů',
  description:
    'Otestujte své ETF portfolio na reálných datech od roku 2000. Roční zhodnocení, největší pokles a kolísavost – v přepočtu na koruny, včetně grafu vývoje.',
  openGraph: {
    title: 'Backtest portfolia ETF: výnosy a propady v korunách',
    description:
      'Otestujte své portfolio na reálných denních datech od roku 2000 – zhodnocení, největší pokles a kolísavost v Kč.',
    url: 'https://etfpruvodce.cz/backtest',
    type: 'website',
    images: [ogImage({ title: 'Backtest portfolia ETF: výnosy a propady v korunách', eyebrow: 'Nástroj zdarma', stat: '2000–2026', statLabel: 'reálná denní data, výsledky v Kč' })],
  },
};

/**
 * Výchozí scénář (100 % S&P 500, od 1/2005, 100 000 Kč + 5 000 Kč měsíčně) spočítaný při ISR renderu
 * STEJNÝM jádrem a STEJNÝM tělem požadavku jako widget (VYCHOZI_SCENAR) → číslo a graf jsou vidět hned
 * po načtení, bez kliknutí a bez volání API (revize 18. 10. 2026: 19 s na zobrazení, výsledek nikdo neviděl).
 * Do HTML jde jen to, co widget kreslí: denní řada → první bod měsíce + poslední bod, bez měsíčních
 * výnosů, z propadů jen 5 nejhlubších. Při chybě null → widget ukáže formulář (raději nic než špatně).
 */
async function predpocitejVychozi(): Promise<BacktestResult | null> {
  try {
    const r = await simulateAndSerialize({
      ...VYCHOZI_SCENAR,
      endDate: new Date().toISOString().split('T')[0],
    });
    const mesicni: { date: string; value: number }[] = [];
    let posledni = '';
    for (const p of r.evolution) {
      const k = p.date.slice(0, 7);
      if (k !== posledni) { mesicni.push(p); posledni = k; }
    }
    const konec = r.evolution[r.evolution.length - 1];
    if (konec && mesicni[mesicni.length - 1] !== konec) mesicni.push(konec);
    const nejhlubsi = [...r.risk.allDrawdowns].sort((a, b) => a.depth - b.depth).slice(0, 5);
    return {
      evolution: mesicni,
      summary: r.summary,
      returns: { annualReturns: r.returns.annualReturns },
      inflation: r.inflation,
      risk: { maxDrawdown: r.risk.maxDrawdown, allDrawdowns: nejhlubsi, valueAtRisk95: r.risk.valueAtRisk95 },
      stressPeriods: r.stressPeriods,
      drawdownSeries: r.drawdownSeries,
      rollingReturns: r.rollingReturns,
    } as BacktestResult;
  } catch (e) {
    console.error('[backtest] předpočet výchozího scénáře selhal:', e);
    return null;
  }
}

export default async function BacktestPreview() {
  const vychozi = await predpocitejVychozi();
  const posledniDen = vychozi?.evolution[vychozi.evolution.length - 1]?.date;
  const datumDat = posledniDen
    ? new Date(posledniDen).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    : null;

  /* ---------- FAQ + JSON-LD ---------- */
  const faqs = [
    {
      q: 'Co je backtest portfolia?',
      a: 'Backtest je historický test investiční strategie – ukáže, jak by se vaše portfolio chovalo v minulosti na reálných tržních datech: jakým tempem rostlo, jak silně kolísalo a jaké zažilo propady. Minulá výkonnost nezaručuje budoucí výnosy.',
    },
    {
      q: 'Jak výsledky backtestu správně číst?',
      a: 'Backtest je mapa minulosti, ne věštba. Ukazuje povahu strategie – jak rostla, kolísala a jak hluboké propady přinášela. Dívejte se vždy na dvojici výnos + největší pokles: vysoký výnos s 50% propadem se v reálu těžko drží. Výchozí nastavení vrací portfolio k zadaným vahám jednou ročně (vyvážení), jinou frekvenci zvolíte v nastavení.',
    },
    {
      q: 'Odkud bere backtest historická data?',
      a: 'Z denních cen skutečných fondů, které dané trhy sledují – například S&P 500 z fondu SPDR S&P 500 (SPY) od roku 1993, akcie celého světa z fondu Vanguard Total World (VT) od června 2008, evropské dluhopisy z evropských fondů iShares a Xtrackers. U každé složky najdete zdroj pod ikonou ⓘ. Data jsou v měně daného fondu (většinou v dolarech, evropské dluhopisy v eurech) a do korun se přepočítávají historickými denními kurzy; kurzy máme od ledna 2000, proto výpočet v korunách začíná nejdřív tehdy. Výpočet běží na našem serveru nad celou historií, ne z odhadu.',
    },
    {
      q: 'Jsou ve výsledku započtené poplatky?',
      a: 'Poplatky fondů ano – data jsou ceny skutečných fondů, jejich roční poplatek je v nich už obsažený. U konkrétního fondu, který si vyhledáte (např. VWCE), výpočet data přepočítá na jeho poplatek. Poplatky brokera, spready ani daně backtest nezahrnuje.',
    },
    {
      q: 'Co znamená roční zhodnocení (CAGR)?',
      a: 'Roční zhodnocení (CAGR) je průměrné roční tempo růstu portfolia se zohledněním složeného úročení. Na rozdíl od prostého průměru ukazuje, jakým tempem hodnota skutečně rostla rok za rokem. Počítá se bez vlivu vkladů, takže je srovnatelné mezi portfolii.',
    },
    {
      q: 'Proč se „Známé krize“ liší od tabulky největších propadů?',
      a: 'Jde o dvě různá měření. Známé krize měří propad jen uvnitř pevného okna krize (například medvědí trh leden–říjen 2022). Tabulka největších propadů hledá propady od vrcholu po dno bez ohledu na kalendář – může tedy začít už před oknem krize nebo skončit po něm a ukázat proto hlubší číslo.',
    },
    {
      q: 'Co je maximální pokles a proč na něm záleží?',
      a: 'Maximální pokles (drawdown) je největší propad hodnoty portfolia od předchozího vrcholu po dno. Ukazuje nejhorší situaci, kterou byste v daném období zažili. Pokles o 50 % znamená, že portfolio dočasně ztratilo polovinu hodnoty – a právě toto číslo prozradí, kolik nervů by držení vyžadovalo.',
    },
    {
      q: 'Jsou výsledky backtestu spolehlivé pro budoucnost?',
      a: 'Ne. Backtest ukazuje minulost: minulé výnosy se nemusí opakovat a trh se v dalších letech může chovat úplně jinak. Je užitečný k pochopení povahy strategie – jak kolísá a jak hluboké propady přináší – nikoli jako předpověď.',
    },
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Kalkulačky', item: 'https://etfpruvodce.cz/kalkulacky' },
      { '@type': 'ListItem', position: 3, name: 'Backtest portfolia ETF', item: 'https://etfpruvodce.cz/backtest' },
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
          <Link href="/kalkulacky" className="hover:text-slate-600">Kalkulačky</Link>
          <span>/</span>
          <span className="text-slate-600">Backtest portfolia</span>
        </nav>

        {/* ÚVOD – nadpis + jedna věta. Dřív tmavý hero s tlačítkem „Spustit backtest“ a nástroj až
            na druhé obrazovce (revize 18. 10. 2026). Výsledek je teď hned pod nadpisem. */}
        <section data-sekce="backtest-uvod" className="pb-5">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Backtest portfolia ETF</h1>
          <p className="mt-1.5 text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed">
            Jak by vaše portfolio obstálo v minulosti (
            <InfoTip label="Backtest = historický test strategie na skutečných datech: kolik by vydělala, jak kolísala a jak hluboko klesala.">backtest</InfoTip>
            ) – výnos i propady v korunách, na reálných datech od roku 2000.
          </p>
        </section>

        {/* NÁSTROJ – výsledek výchozího scénáře je předpočítaný na serveru */}
        <section id="backtest" className="pb-12 scroll-mt-16">
          <BacktestWidget initialResult={vychozi} />
        </section>

        {/* FAQ (sem se přesunulo i „Jak výsledky správně číst“) */}
        <section data-sekce="faq" className="pb-10">
          <SectionHead title="Časté dotazy" />
          <div className="space-y-2">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-lg border border-slate-200 bg-white">
                <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none min-h-[44px]">
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

        {/* POKRAČUJTE DÁL */}
        <section data-sekce="pokracujte" className="pb-10">
          <SectionHead title="Pokračujte dál" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {([
              ['/kolik-vydelaly-etf', 'Kolik vydělaly akcie v Kč', TrendingUp],
              ['/investicni-kalkulacka', 'Investiční kalkulačka', Calculator],
              ['/kalkulacka', 'Kalkulačka poplatků', Wallet],
              ['/portfolio-strategie', 'Modelová portfolia', Scale],
              ['/srovnani', 'Srovnání ETF', TrendingUp],
              ['/kde-koupit', 'Kde koupit ETF', Landmark],
              ['/pruvodce', 'Co jsou ETF', BookOpen],
            ] as [string, string, typeof Wallet][]).map(([href, label, Icon]) => (
              <Link key={href} href={href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><Icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Autor + zdroje + jediné obecné upozornění (dřív 5 varování na jedné stránce) */}
        <section data-sekce="autor" className="pb-12">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 shrink-0"><User className="w-5 h-5" /></span>
              <div>
                <p className="font-semibold text-slate-900">Tomáš Kostrhoun</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Autor ETF průvodce.cz s 12 lety praxe ve financích. Nástroj i data stavíme nezávisle, na veřejných historických datech – bez placeného pořadí.
                  <Link href="/o-nas" className="text-teal-700 hover:underline ml-1">O autorovi</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <p className="flex items-start gap-1.5 text-xs text-slate-500"><Database className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Zdroje: denní ceny fondů sledujících dané trhy (zdroj každé složky pod ⓘ), historické referenční kurzy ECB, index spotřebitelských cen ČSÚ (výnos po inflaci).{datumDat ? ` Data k ${datumDat}.` : ''}</p>
              <InvestmentDisclaimer variant="inline" />
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
