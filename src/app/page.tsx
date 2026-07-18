import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import HeroSearch from '@/components/home/HeroSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import {
  getFeaturedETFs, getTotalETFCount, getMarketSnapshot, getReturnsByIsins,
  getETFsByIsins, categoryConfigs, type ETFBasicInfo,
} from '@/lib/etf-data';
import { portfolioModels, RISK_PILL } from '@/components/design-preview/portfolioData';
import { brokers } from '@/data/brokerData';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import InfoTip from '@/components/design-preview/InfoTip';
import {
  TrendingUp, ArrowRight, ArrowUpRight, Star, Wallet, Globe,
  LineChart, Landmark, Building2, Banknote, ShieldCheck, Sparkles,
  Calculator, PieChart, Flame, RefreshCw, History, LayoutGrid, BookOpen,
  HelpCircle,
} from 'lucide-react';

export const revalidate = 3600;
export const metadata: Metadata = {
  // Title/description ladí na dotaz „etf" (pozice ~10, dřív CTR 0 %): konkrétní číslo fondů
  // + USP „výnosy v Kč" místo obecných frází; bez ★ znaků, které Google trestá přepsáním snippetu.
  title: 'Srovnání 4 800+ ETF fondů, výnosy v Kč – ETF průvodce.cz',
  description:
    'Kolik reálně vydělaly ETF? Výnosy 4 800+ fondů přepočtené do korun, žebříčky pro rok 2026, backtest portfolia a investiční kalkulačky. Zdarma a česky.',
  alternates: { canonical: '/' },
};

const ter = (v: number | null) => (v == null ? '—' : `${v.toFixed(2).replace('.', ',')} %`);
/** Velikost fondu je z justETF VŽDY v EUR (i u USD tříd) → vždy €. Ověřeno proti justETF. */
const curSym = (_c?: string | null) => '€';
const money = (v: number | null, cur: string | null = 'EUR') => {
  if (v == null) return '—';
  const s = curSym(cur);
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace('.', ',')} mld ${s}`;
  return `${Math.round(v)} mil ${s}`;
};
const pct = (v: number | null) => {
  if (v == null) return '—';
  return `${v >= 0 ? '+' : ''}${v.toFixed(1).replace('.', ',')} %`;
};
const short = (n: string) => n.replace(/\s+UCITS ETF.*/i, '').replace(/\s+\(.*\)/, '').trim();

/* Kurátorské „první volby" pro sekci Kterým ETF začít (úhel + důvod). */
const STARTER_ISINS = ['IE00BK5BQT80', 'IE00B5BMR087', 'IE00B4L5Y983'];
const STARTER_META: Record<string, { tag: string; icon: typeof Globe; why: string }> = {
  IE00BK5BQT80: { tag: 'Celý svět', icon: Globe, why: 'Jedním nákupem tisíce firem z celého světa. Nejširší rozložení rizika – nemusíte hádat, který region poroste.' },
  IE00B5BMR087: { tag: 'Jen USA (S&P 500)', icon: LineChart, why: '500 největších amerických firem. Nejnižší poplatek z trojice, historicky nejsilnější výnos, vyšší koncentrace do USA.' },
  IE00B4L5Y983: { tag: 'Rozvinuté trhy', icon: Building2, why: 'Zhruba 1 500 firem z vyspělých zemí (MSCI World) bez rozvíjejících se trhů. Klasická a osvědčená volba.' },
};

/* Počet kategorií žebříčků – shodná logika jako /design-preview/zebricky
   (bez duplicitních SEO slugů), ať homepage neuvádí nižší, zastaralé číslo. */
const DUPLICATE_CATEGORY_SLUGS = ['nejlepsi-nemovitostni-etf', 'nejlepsi-zlate-etf'];
const CATEGORY_COUNT = Object.keys(categoryConfigs).filter(
  (s) => !DUPLICATE_CATEGORY_SLUGS.includes(s),
).length;

const CATEGORIES = [
  { href: '/nejlepsi-etf/nejlepsi-celosvetove-etf', label: 'Celosvětové', icon: Globe },
  { href: '/nejlepsi-etf/nejlepsi-sp500-etf', label: 'S&P 500', icon: LineChart },
  { href: '/nejlepsi-etf/nejlepsi-americke-etf', label: 'Americké', icon: Landmark },
  { href: '/nejlepsi-etf/nejlepsi-evropske-etf', label: 'Evropské', icon: Building2 },
  { href: '/nejlepsi-etf/nejlepsi-emerging-markets-etf', label: 'Rozvíjející se', icon: Globe },
  { href: '/nejlepsi-etf/nejlepsi-dividendove-etf', label: 'Dividendové', icon: Banknote },
  { href: '/nejlepsi-etf/nejlepsi-technologicke-etf', label: 'Technologické', icon: Sparkles },
  { href: '/nejlepsi-etf/nejlevnejsi-etf', label: 'Nejlevnější', icon: Wallet },
];

/* Kde koupit ETF – kurátorský výběr brokerů pro homepage (parita se starým webem,
   který na homepage jmenoval brokery a dával doporučení). Skóre a jména z brokerData;
   krátká věta „pro koho" jen na homepage, plné srovnání je v sekci Kde koupit. */
const BROKER_PICK: { id: string; forWhom: string }[] = [
  { id: 'portu', forWhom: 'Robo-poradce – sestaví a spravuje portfolio za vás.' },
  { id: 'xtb', forWhom: 'Akcie i ETF bez poplatku, česká podpora 24/7.' },
  { id: 'trading212', forWhom: 'Nulové poplatky a frakční ETF pro malé částky.' },
  { id: 'ibkr', forWhom: 'Nejširší nabídka trhů pro pokročilé investory.' },
  { id: 'degiro', forWhom: 'Levné nákupy z Core Selection pro buy-and-hold.' },
  { id: 'fio', forWhom: 'Český broker, dividendy z ČR akcií jen 15 %.' },
];
const HOME_BROKERS = BROKER_PICK
  .map((p) => ({ ...p, broker: brokers.find((b) => b.id === p.id) }))
  .filter((x) => x.broker)
  .sort((a, b) => (b.broker!.rating ?? 0) - (a.broker!.rating ?? 0));

/* Jen nástroje relevantní k výběru ETF a portfoliu (osekáno z 12). */
const TOOLS = [
  { href: '/kolik-vydelaly-etf', label: 'Kolik vydělaly ETF a akcie', desc: 'Kompletní datový rozbor v Kč (2008–2026)', icon: LineChart },
  { href: '/investicni-kalkulacka', label: 'Investiční kalkulačka', desc: 'Budoucí hodnota investice', icon: Calculator },
  { href: '/kalkulacka', label: 'Kalkulačka poplatků', desc: 'Kolik vás stojí TER za 30 let', icon: PieChart },
  { href: '/backtest', label: 'Backtest portfolia', desc: 'Historická simulace od roku 2000', icon: History },
  { href: '/fire-kalkulacka', label: 'FIRE kalkulačka', desc: 'Kdy dosáhnete nezávislosti', icon: Flame },
  { href: '/kurzovy-dopad', label: 'Kurzový dopad', desc: 'Vliv kurzu na korunový výnos', icon: RefreshCw },
  { href: '/portfolio-strategie', label: 'Modelová portfolia', desc: '5 ověřených strategií', icon: LayoutGrid },
  { href: '/fire', label: 'Průvodce FIRE', desc: 'Kolik potřebujete k nezávislosti', icon: BookOpen },
  { href: '/dane-z-etf', label: 'Daně z ETF', desc: 'Kdy platíte a kdy ne (2026)', icon: Landmark },
  { href: '/svetove-etf-indexy', label: 'Světové ETF: který index', desc: 'MSCI World vs FTSE All-World vs S&P 500', icon: Globe },
  { href: '/menove-riziko-etf', label: 'Měnové riziko a zajištění', desc: 'Potřebujete hedged fond? (pohled v Kč)', icon: ShieldCheck },
  { href: '/kolik-investovat-mesicne', label: 'Kolik investovat měsíčně', desc: 'Kolik na milion nebo rentu (v Kč)', icon: Wallet },
  { href: '/jaky-sp500-etf', label: 'Který S&P 500 ETF', desc: 'CSPX vs VUAA vs VUSA vs SPYL', icon: Landmark },
  { href: '/dca-vs-jednorazova', label: 'DCA vs. jednorázová', desc: 'Investovat naráz, nebo postupně? (data)', icon: LineChart },
  { href: '/investovani-pro-deti', label: 'Investování pro děti', desc: 'Kolik naspoříte do 18 let (v Kč)', icon: Sparkles },
  { href: '/dip', label: 'DIP: vyplatí se?', desc: 'Dlouhodobý investiční produkt (daně, v Kč)', icon: Landmark },
];

const FAQ: { q: string; a: ReactNode; plain: string; href: string }[] = [
  {
    q: 'Co je vlastně ETF?',
    a: <>ETF je fond, který jedním nákupem investuje do desítek až tisíců firem najednou. Pasivně kopíruje nějaký index (třeba S&P 500), a proto má výrazně nižší poplatky než aktivně řízené fondy. Místo vybírání jednotlivých akcií koupíte rovnou celý trh.</>,
    plain: 'ETF je fond, který jedním nákupem investuje do desítek až tisíců firem najednou. Pasivně kopíruje index (např. S&P 500), a proto má výrazně nižší poplatky než aktivně řízené fondy. Místo vybírání jednotlivých akcií koupíte celý trh.',
    href: '/pruvodce',
  },
  {
    q: 'Jak se ETF v Česku daní?',
    a: <>Zisk z prodeje je osvobozen, pokud fond držíte déle než 3 roky (<InfoTip label="Časový test: po 3 letech držení je zisk z prodeje cenných papírů v ČR osvobozen od daně z příjmu. Od roku 2026 bez horního limitu.">časový test</InfoTip>), nebo když <strong>úhrn vašich prodejů</strong> za rok nepřekročí 100 000 Kč (hodnotový test – jde o hrubé příjmy, ne zisk). Jinak se zisk daní 15 % (u vysokých příjmů 23 %). Dividendy se daní 15 % – u akumulačních fondů to ale řešit nemusíte, reinvestují se uvnitř fondu.</>,
    plain: 'Zisk z prodeje ETF je v ČR osvobozen po 3 letech držení (časový test, od 2026 bez limitu) nebo když úhrn prodejů za rok nepřekročí 100 000 Kč hrubých příjmů (ne zisku). Jinak se daní 15 %, u vysokých příjmů 23 %. Dividendy se daní 15 %; u akumulačních fondů se reinvestují uvnitř fondu a daň neřešíte.',
    href: '/pruvodce',
  },
  {
    q: 'Akumulační, nebo distribuční fond?',
    a: <>Akumulační (<InfoTip label="Acc – Accumulating. Dividendy se automaticky reinvestují uvnitř fondu, na účet vám nechodí.">Acc</InfoTip>) dividendy automaticky reinvestuje uvnitř fondu – vhodné pro dlouhodobý růst a bez daňové starosti. Distribuční (<InfoTip label="Dist – Distributing. Dividendy fond pravidelně vyplácí na váš účet.">Dist</InfoTip>) je vyplácí na účet – vhodné, když chcete pravidelný příjem.</>,
    plain: 'Akumulační fond (Acc) dividendy automaticky reinvestuje uvnitř fondu – vhodné pro dlouhodobý růst a bez daňové starosti. Distribuční fond (Dist) je vyplácí na účet – vhodné, když chcete pravidelný příjem.',
    href: '/pruvodce',
  },
  {
    q: 'Kolik peněz stačí na začátek?',
    a: <>Začít jde i s pár tisíci korunami. Někteří brokeři umožňují koupit i zlomek akcie, takže limituje spíš poplatek za nákup než cena fondu. Důležitější než výše první investice je začít a investovat pravidelně.</>,
    plain: 'Začít jde i s pár tisíci korunami. Někteří brokeři umožňují koupit i zlomek akcie, takže limituje spíš poplatek za nákup než cena fondu. Důležitější než výše první investice je začít a investovat pravidelně.',
    href: '/kde-koupit',
  },
  {
    q: 'Kde ETF koupit?',
    a: <>Přes brokera nebo <InfoTip label="Robo-poradce sestaví a spravuje portfolio za vás podle zvoleného profilu. Vyšší poplatek za pohodlí.">robo-poradce</InfoTip> dostupného v ČR. Liší se hlavně poplatky za nákup a konverzí měn – kompletní srovnání najdete v sekci Kde koupit.</>,
    plain: 'ETF koupíte přes brokera nebo robo-poradce dostupného v ČR. Liší se hlavně poplatky za nákup a konverzí měn – kompletní srovnání najdete v sekci Kde koupit.',
    href: '/kde-koupit',
  },
  {
    q: 'Proč ukazujete výnosy v korunách?',
    a: <>Protože jako český investor utrácíte koruny. Fondy sice kotují v dolarech nebo eurech, ale váš reálný výnos ovlivňuje i pohyb kurzu. Výnos přepočtený do Kč proto ukazuje, kolik byste reálně vydělali – ne jen kolik vydělal fond ve své měně.</>,
    plain: 'Protože jako český investor utrácíte koruny. Fond kotuje v cizí měně, ale váš reálný výnos ovlivňuje i pohyb kurzu. Výnos přepočtený do Kč ukazuje, kolik byste reálně vydělali, ne jen kolik vydělal fond ve své měně.',
    href: '/srovnani',
  },
];

function PerfBar({ v }: { v: number | null }) {
  const val = v ?? 0;
  const pos = val >= 0;
  const w = Math.min(Math.abs(val) / 40 * 100, 100);
  return (
    <div className="flex items-center gap-2 justify-end">
      <span className={`tabular-nums text-sm font-medium ${pos ? 'text-emerald-600' : 'text-red-600'}`}>{pct(v)}</span>
      <div className="hidden sm:block w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${pos ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${w}%` }} />
      </div>
    </div>
  );
}

function DataPanel({ title, href, etfs, metric }: { title: string; href: string; etfs: ETFBasicInfo[]; metric: 'ter' | 'return' | 'size' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <Link href={href} className="text-xs text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">vše <ArrowRight className="w-3 h-3" /></Link>
      </div>
      <ul className="divide-y divide-slate-50">
        {etfs.slice(0, 5).map((etf, i) => (
          <li key={etf.isin}>
            <Link href={`/etf/${etf.isin}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors">
              <span className="text-xs text-slate-400 tabular-nums w-4">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-slate-900 truncate">{short(etf.name)}</span>
                <span className="block text-xs text-slate-400">{etf.primary_ticker || etf.fund_provider}</span>
              </span>
              {metric === 'ter' && <span className="tabular-nums text-sm font-medium text-slate-700">{ter(etf.ter_numeric)}</span>}
              {metric === 'size' && <span className="tabular-nums text-sm font-medium text-slate-700">{money(etf.fund_size_numeric, etf.fund_currency)}</span>}
              {metric === 'return' && <PerfBar v={etf.return_1y} />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const PORTFOLIO_ICON: Record<string, typeof ShieldCheck> = {
  permanent: LayoutGrid,
  nobel: Star,
  stock: TrendingUp,
  allweather: ShieldCheck,
  dividend: Banknote,
};

export default async function DesignPreviewV2() {
  const allPortfolioIsins = Array.from(
    new Set(portfolioModels.flatMap((p) => p.allocations.map((a) => a.isin))),
  );
  const [featured, totalCount, markets, isinReturns, starters] = await Promise.all([
    getFeaturedETFs(),
    getTotalETFCount(),
    getMarketSnapshot(),
    getReturnsByIsins(allPortfolioIsins),
    getETFsByIsins(STARTER_ISINS),
  ]);

  // Výnos portfolia = vážený průměr korunových výnosů jeho ETF složek (přes dostupné složky).
  const portfolioPerf = portfolioModels.map((p) => {
    let w1 = 0, r1 = 0, w3 = 0, r3 = 0;
    for (const a of p.allocations) {
      const ret = isinReturns[a.isin];
      if (ret?.return_1y_czk != null) { r1 += a.percentage * ret.return_1y_czk; w1 += a.percentage; }
      if (ret?.return_3y_czk != null) { r3 += a.percentage * ret.return_3y_czk; w3 += a.percentage; }
    }
    return { ...p, return1y: w1 > 0 ? r1 / w1 : null, return3y: w3 > 0 ? r3 / w3 : null };
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.plain },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
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

      <main className="max-w-6xl mx-auto px-4 pb-24">
        {/* 1. HERO – USP + vyhledávání + dvojí cesta (vím co hledám / začátečník) */}
        <section className="py-4 md:py-7">
          <div className="rounded-2xl bg-slate-900 text-white px-5 py-6 md:px-9 md:py-9">
            <div className="md:flex md:items-start md:justify-between gap-10">
              <div className="md:max-w-lg">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Největší srovnávač ETF pro české investory</h1>
                <p className="mt-2.5 text-slate-300 text-sm md:text-base leading-relaxed">
                  Nezávislá data {totalCount.toLocaleString('cs-CZ')} fondů — výnosy přepočtené do korun, poplatky a daně. Vše česky.
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-xs font-medium text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% nezávislý a nekomerční — žádné provize, žádná reklama
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500 transition-colors">
                    <LayoutGrid className="w-4 h-4" /> Prozkoumat všechny fondy
                  </Link>
                  <Link href="/vyber-etf" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-200 underline-offset-4 hover:text-white hover:underline transition-colors">
                    <Sparkles className="w-4 h-4" /> Nevíš který? Poradíme s výběrem
                  </Link>
                </div>
              </div>
              <HeroSearch />
            </div>
          </div>
        </section>

        {/* 2. KTERÝM ETF ZAČÍT – hned pod hero: přesně záměr začátečníka (hlavní publikum) */}
        {starters.length > 0 && (
          <section className="pt-2 pb-8">
            <div className="mb-4">
              <h2 className="text-lg font-bold tracking-tight">Kterým ETF začít?</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Tři nejčastější první volby českých investorů – všechny široce rozložené, levné a akumulační. Pro orientaci, ne jako doporučení.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {starters.map((etf) => {
                const meta = STARTER_META[etf.isin];
                const Icon = meta?.icon ?? Globe;
                const r = isinReturns[etf.isin]?.return_1y_czk ?? etf.return_1y_czk ?? etf.return_1y;
                return (
                  <Link key={etf.isin} href={`/etf/${etf.isin}`} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-100 transition-colors"><Icon className="w-5 h-5" /></span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{meta?.tag}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900 leading-tight">{short(etf.name)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{etf.primary_ticker}</p>
                    <p className="mt-2 flex-1 text-sm text-slate-600 leading-relaxed">{meta?.why}</p>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                      <span className="text-slate-500">TER <span className="font-semibold text-slate-900 tabular-nums">{ter(etf.ter_numeric)}</span></span>
                      <span className="text-slate-500">1R v Kč <span className={`font-semibold tabular-nums ${(r ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(r)}</span></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. DATOVÉ PANELY */}
        <section className="pb-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Rychlý přehled fondů</h2>
              <p className="text-sm text-slate-500 mt-0.5">Největší, nejvýkonnější a nejlevnější ETF na jeden pohled.</p>
            </div>
            <Link href="/srovnani" className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
              Filtrovat všechny fondy <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <DataPanel title="Největší fondy" href="/srovnani" etfs={featured.bySize || []} metric="size" />
            <DataPanel title="Nejvýkonnější (1R)" href="/srovnani" etfs={featured.byPerformance || []} metric="return" />
            <DataPanel title="Nejlevnější (TER)" href="/nejlepsi-etf/nejlevnejsi-etf" etfs={featured.lowCost || []} metric="ter" />
          </div>
          <Link href="/srovnani" className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50/50 px-4 py-3 text-sm font-semibold text-teal-800 hover:bg-teal-50 hover:border-teal-300 transition-colors">
            <LayoutGrid className="w-4 h-4" /> Prozkoumat a filtrovat všech {totalCount.toLocaleString('cs-CZ')} fondů <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* KTERÝM ETF ZAČÍT přesunuto nahoru (pod hero). Zde bylo, teď je tu „Jak si vedou trhy". */}
        {markets.length > 0 && (
          <section className="pb-8 pt-2">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Jak si vedou trhy</h2>
                <p className="text-sm text-slate-500 mt-0.5">Výnos největšího fondu v dané oblasti za posledních 12 měsíců, přepočtený do korun.</p>
              </div>
              <Link href="/infografiky#trzni-heatmapa" className="text-sm text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 shrink-0">tržní heatmapa <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {markets.map((m) => {
                const v = m.return_1y_czk;
                const posM = (v ?? 0) >= 0;
                return (
                  <Link key={m.slug} href={`/nejlepsi-etf/${m.slug}`} className="group rounded-lg border border-slate-200 bg-white px-3 py-3 hover:border-teal-300 hover:shadow-sm transition-all">
                    <span className="block text-xs text-slate-500 leading-snug">{m.label}</span>
                    <span className={`mt-1 block text-lg font-bold tabular-nums ${posM ? 'text-emerald-600' : 'text-red-600'}`}>{pct(v)}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
        {/* 5. HOTOVÁ MODELOVÁ PORTFOLIA – s reálnou výkonností v Kč */}
        <section className="pb-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Hotová modelová portfolia</h2>
              <p className="text-sm text-slate-500 mt-0.5">Ověřené strategie z ETF – i s tím, jak si vedly v korunách.</p>
            </div>
            <Link href="/portfolio-strategie" className="text-sm text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">všechna portfolia <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {portfolioPerf.map((p) => {
              const Icon = PORTFOLIO_ICON[p.id] ?? LayoutGrid;
              const pos1 = (p.return1y ?? 0) >= 0;
              return (
                <Link key={p.slug} href={`/portfolio-strategie/${p.slug}`} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-100 transition-colors shrink-0"><Icon className="w-5 h-5" /></span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none ${RISK_PILL[p.risk]}`}>{p.risk}</span>
                  </div>
                  <span className="block text-sm font-semibold text-slate-900 leading-tight mt-3">{p.name}</span>
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span className="flex items-baseline gap-1.5">
                      <span className={`tabular-nums text-base font-bold ${pos1 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(p.return1y)}</span>
                      <span className="text-[11px] text-slate-400">za 1 rok</span>
                    </span>
                    <span className="block text-[11px] text-slate-400 tabular-nums mt-0.5">3 roky {pct(p.return3y)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link href="/backtest" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800">
            <History className="w-4 h-4" /> Spočítej si to na svých penězích – backtest portfolia <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-3 text-xs text-slate-400 leading-relaxed">
            Výnos je orientační – vážený průměr korunových výnosů ETF složek daného portfolia (bez průběžného rebalancingu). Minulá výkonnost nezaručuje budoucí výnosy.
          </p>
        </section>

        {/* 6. ČASTÉ OTÁZKY – reálný obsah + FAQ schema */}
        <section className="py-10">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Časté otázky o ETF</h2>
              <p className="text-sm text-slate-500 mt-0.5">To nejdůležitější, než koupíte první fond.</p>
            </div>
            <Link href="/pruvodce" className="text-sm text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 shrink-0">celý průvodce <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-xl border border-slate-200 bg-white">
                <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer list-none">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <HelpCircle className="w-4 h-4 text-teal-700 shrink-0" /> {f.q}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                  <p>{f.a}</p>
                  <Link href={f.href} className="mt-2 inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium text-xs">Více <ArrowRight className="w-3.5 h-3.5" /></Link>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* 7. ŽEBŘÍČKY PODLE KATEGORIÍ – kompaktní navigace */}
        <section className="pb-10">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">Žebříčky podle kategorií</h2>
            <Link href="/zebricky" className="text-sm text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">všech {CATEGORY_COUNT} kategorií <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CATEGORIES.map((c) => (
              <Link key={c.href} href={c.href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><c.icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{c.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 8. NÁSTROJE A KALKULAČKY – osekané na relevantní */}
        <section className="pb-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Nástroje a kalkulačky</h2>
              <p className="text-sm text-slate-500 mt-0.5">Bezplatné nástroje pro výběr ETF a plánování portfolia.</p>
            </div>
            <Link href="/kalkulacky" className="text-sm text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">všechny <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="group rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 mb-3 group-hover:bg-teal-100 transition-colors"><t.icon className="w-5 h-5" /></span>
                <span className="block text-sm font-semibold text-slate-900 leading-tight">{t.label}</span>
                <span className="block text-xs text-slate-500 mt-1 leading-snug">{t.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 8b. KDE KOUPIT ETF – konkrétní brokeři se skóre (parita se starým webem) */}
        <section className="pb-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Kde koupit ETF</h2>
              <p className="text-sm text-slate-500 mt-0.5">Brokeři a robo-poradci dostupní v ČR – seřazeno podle našeho hodnocení.</p>
            </div>
            <Link href="/kde-koupit" className="text-sm text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 shrink-0">plné srovnání <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HOME_BROKERS.map(({ id, forWhom, broker }) => (
              <Link key={id} href={reviewHref[id] ?? '/kde-koupit'} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900 text-sm">{broker!.name}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 tabular-nums" title={`Naše skóre ${broker!.rating} ze 100`}>
                    <Star className="w-3 h-3 fill-current" /> {broker!.rating}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm text-slate-600 leading-relaxed">{forWhom}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>ETF poplatek <span className="font-medium text-slate-700">{broker!.etfFee.split(',')[0].split('(')[0].trim()}</span></span>
                  <span className="inline-flex items-center gap-1 text-teal-700 group-hover:text-teal-800 font-medium">recenze <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400 leading-relaxed">
            Hodnocení je nezávislé – nebereme provize ani reklamu. Poplatky se mohou lišit dle trhu a typu obchodu.
          </p>
        </section>

        {/* 9. POPULÁRNÍ SROVNÁNÍ + TRUST */}
        <section className="pb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-base font-bold">Populární srovnání</h2>
                <p className="text-sm text-slate-500">Která dvojice fondů je lepší volba?</p>
              </div>
              <Link href="/srovnani" className="text-sm text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">srovnat <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {[['/srovnani/vwce-vs-cspx', 'VWCE vs CSPX'], ['/srovnani/iwda-vs-cspx', 'IWDA vs CSPX'], ['/srovnani/vwce-vs-iwda', 'VWCE vs IWDA'], ['/srovnani/swrd-vs-iwda', 'SWRD vs IWDA'], ['/srovnani/cspx-vs-vuaa', 'CSPX vs VUAA'], ['/srovnani/vwce-vs-vwrl', 'VWCE vs VWRL']].map(([href, label]) => (
                <li key={label}><Link href={href} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 hover:border-teal-300 hover:bg-teal-50/40 transition-all"><span className="font-medium text-slate-700">{label}</span><ArrowUpRight className="w-3.5 h-3.5 text-slate-400" /></Link></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid sm:grid-cols-3 gap-4 pb-12">
          {[[ShieldCheck, 'Nezávislé a nekomerční', 'Žádné provize, žádná reklama, žádné placené pořadí.', '/o-nas'], [Star, '12 let praxe ve financích', 'Obsah od experta, ne anonymně.', '/o-nas'], [Banknote, 'Kde koupit ETF', 'Srovnání brokerů pro české investory.', '/kde-koupit']].map(([Icon, t, d, href]: any) => (
            <Link key={t} href={href} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 transition-all">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-700 shrink-0"><Icon className="w-5 h-5" /></span>
              <span><span className="block font-semibold text-sm">{t}</span><span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">{d}</span></span>
            </Link>
          ))}
        </section>
      </main>

    </div>
  );
}
