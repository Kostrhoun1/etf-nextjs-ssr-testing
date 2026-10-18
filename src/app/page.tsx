import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import HeroSearch from '@/components/home/HeroSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  getFeaturedETFs, getTotalETFCount, getETFCountLabel, getDataDate,
  getETFsByIsins, categoryConfigs, type ETFBasicInfo,
} from '@/lib/etf-data';
import AktualnostDat from '@/components/design-preview/AktualnostDat';
import { portfolioModels, RISK_PILL } from '@/components/design-preview/portfolioData';
import { brokers } from '@/data/brokerData';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import InfoTip from '@/components/design-preview/InfoTip';
import {
  TrendingUp, ArrowRight, ArrowUpRight, Star, Wallet, Globe,
  LineChart, Landmark, Building2, Banknote, Sparkles,
  Calculator, Flame, History, LayoutGrid, BookOpen, ChevronDown,
} from 'lucide-react';

export const revalidate = 3600;
export async function generateMetadata(): Promise<Metadata> {
  const pocet = await getETFCountLabel();
  return {
    // Title/description ladí na dotaz „etf" (pozice ~10, dřív CTR 0 %): konkrétní číslo fondů
    // + USP „výnosy v Kč" místo obecných frází; bez ★ znaků, které Google trestá přepsáním snippetu.
    title: `Srovnání ${pocet} ETF fondů, výnosy v Kč – ETF průvodce.cz`,
    description:
      `Kolik reálně vydělaly ETF? Výnosy ${pocet} fondů přepočtené do korun, žebříčky pro rok 2026, backtest portfolia a investiční kalkulačky. Zdarma a česky.`,
    alternates: { canonical: '/' },
    // Vlastní openGraph (layout už og:url/title nedává – viz layout.tsx). Obrázek musí být i tady:
    // openGraph stránky nahrazuje celý openGraph layoutu.
    openGraph: {
      type: 'website', locale: 'cs_CZ', siteName: 'ETF průvodce.cz', url: '/',
      title: `Srovnání ${pocet} ETF fondů, výnosy v Kč – ETF průvodce.cz`,
      description: `Kolik reálně vydělaly ETF? Výnosy ${pocet} fondů přepočtené do korun, žebříčky, backtest portfolia a kalkulačky. Zdarma a česky.`,
      images: [{ url: '/og-cover.jpg', width: 1200, height: 630, alt: 'ETF průvodce.cz – srovnání ETF s výnosy v korunách' }],
    },
  };
}

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

/* Počet kategorií žebříčků (duplicity zrušeny 17. 10. 2026 – 301 v next.config.ts). */
const CATEGORY_COUNT = Object.keys(categoryConfigs).length;

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
type Poplatek = { popisek: string; hodnota: string };
// Poplatek na kartě je ručně zkrácený a OVĚŘENÝ u ceníku brokera (18. 10. 2026; zdroje a datum v
// brokerData.ts → CENIKY_OVERENY, denní kontrola hlídá stáří). Dřív se bral
// z brokerData.etfFee ořezem před první čárkou → Portu „0,24-1 % ročně“ se ukazoval jako „0“.
const BROKER_PICK: { id: string; forWhom: string; poplatek: Poplatek }[] = [
  { id: 'portu', forWhom: 'Robo-poradce – sestaví a spravuje portfolio za vás.', poplatek: { popisek: 'Vše v ceně', hodnota: '0,24–1 % ročně' } },
  { id: 'xtb', forWhom: 'ETF bez provize do 100 000 € měsíčně, česká podpora v pracovní dny.', poplatek: { popisek: 'Nákup ETF', hodnota: '0 € do 100 000 €/měs.' } },
  { id: 'trading212', forWhom: 'Bez provize, frakční ETF už od 1 €.', poplatek: { popisek: 'Nákup ETF', hodnota: '0 € (směna měny 0,15 %)' } },
  { id: 'ibkr', forWhom: 'Nejširší nabídka trhů pro pokročilé investory.', poplatek: { popisek: 'Xetra', hodnota: '0,05 %, min. 1,25 € + burza' } },
  { id: 'degiro', forWhom: 'Levné nákupy ze seznamu ETF Selection pro buy-and-hold.', poplatek: { popisek: 'Nákup ETF', hodnota: '1 € ETF Selection, jinak 3 €' } },
  { id: 'fio', forWhom: 'Česká banka s pobočkami, vše v češtině.', poplatek: { popisek: 'Nákup ETF', hodnota: 'Xetra 3,95 € do 1 400 €' } },
];
const HOME_BROKERS = BROKER_PICK
  .map((p) => ({ ...p, broker: brokers.find((b) => b.id === p.id) }))
  .filter((x) => x.broker)
  .sort((a, b) => (b.broker!.rating ?? 0) - (a.broker!.rating ?? 0));

/* Jen nástroje relevantní k výběru ETF a portfoliu (osekáno z 12). */
/* Homepage ukazuje jen 6 nejsilnějších vstupů; ostatní nástroje jsou na /kalkulacky a články
   na /co-rikaji-data (UX audit 17. 10. 2026: 18 dlaždic = homepage 11,5 obrazovky na mobilu). */
const TOOLS = [
  { href: '/backtest', label: 'Backtest portfolia', desc: 'Jak by se portfolio z ETF chovalo v minulosti (v Kč)', icon: History },
  { href: '/investicni-kalkulacka', label: 'Investiční kalkulačka', desc: 'Kolik naspoříte pravidelnou investicí', icon: Calculator },
  { href: '/kolik-vydelaly-etf', label: 'Kolik vydělaly ETF', desc: 'Datový rozbor výnosů v korunách', icon: LineChart },
  { href: '/stroj-casu', label: 'Korunový stroj času', desc: 'Kolik by dnes měla investice od zvoleného roku', icon: Sparkles },
  { href: '/fire', label: 'Finanční nezávislost', desc: 'Kolik potřebujete na FIRE (v Kč)', icon: Flame },
  { href: '/co-rikaji-data', label: 'Co říkají data', desc: 'Naráz, nebo postupně? Měnové riziko? Daně?', icon: BookOpen },
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

const FAQ_ODKAZ: Record<string, string> = { '/pruvodce': 'Číst víc v průvodci', '/kde-koupit': 'Srovnání brokerů', '/srovnani': 'Otevřít srovnávač' };

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

function DataPanel({ title, href, hrefLabel, etfs, metric }: { title: string; href: string; hrefLabel: string; etfs: ETFBasicInfo[]; metric: 'ter' | 'return' | 'size' }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <Link href={href} className="text-xs text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 py-2 -my-2 px-1 -mx-1">{hrefLabel} <ArrowRight className="w-3 h-3" /></Link>
      </div>
      <ul className="divide-y divide-slate-50">
        {etfs.slice(0, 5).map((etf, i) => (
          // Na mobilu jen první 3 (UX audit: panely pod sebou = 1 371 px); celé pořadí přes „vše".
          <li key={etf.isin} className={i >= 3 ? 'hidden md:block' : undefined}>
            <Link href={`/etf/${etf.isin}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors">
              <span className="text-xs text-slate-400 tabular-nums w-4">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-slate-900 truncate">{short(etf.name)}</span>
                <span className="block text-xs text-slate-400">{etf.primary_ticker || etf.fund_provider}</span>
              </span>
              {metric === 'ter' && <span className="tabular-nums text-sm font-medium text-slate-700">{ter(etf.ter_numeric)}</span>}
              {metric === 'size' && <span className="tabular-nums text-sm font-medium text-slate-700">{money(etf.fund_size_numeric, etf.fund_currency)}</span>}
              {metric === 'return' && <PerfBar v={etf.return_1y_czk ?? null} />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default async function DesignPreviewV2() {
  // Redesign 18. 10. 2026 (4 expertní posudky + majitel): jsme SROVNÁVAČ ETF, ne investiční web.
  // Pryč: číslo ze stroje času v hero („5 000 Kč měsíčně od 2010 → 2,9 mil.“), výnosy modelových
  // portfolií, dlaždice „Jak si vedou trhy“, duplicitní panel „Největší fondy“. Hlavní akce = hledání.
  const [featured, totalCount, starters, dataDate] = await Promise.all([
    getFeaturedETFs(),
    getTotalETFCount(),
    getETFsByIsins(STARTER_ISINS),
    getDataDate(new Date()),
  ]);
  const pocet = totalCount.toLocaleString('cs-CZ');

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
          <SiteNav />
          <HeaderSearch />
        </div>
      </header>

      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-24">
        {/* 1. HERO – co je to za web (H1), hledání fondu jako hlavní akce, jedno tlačítko,
            jeden řádek důvěry s datem dat. Nic dalšího (dřív 8 klikacích míst). */}
        <section className="py-4 md:py-7">
          <div className="rounded-2xl bg-slate-900 text-white px-4 py-5 md:px-10 md:py-12 md:text-center">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight text-balance md:mx-auto md:max-w-3xl">Srovnání ETF fondů s výnosy v korunách</h1>
            <p className="mt-2 md:mt-3 max-w-2xl md:mx-auto text-slate-300 text-sm md:text-lg leading-relaxed">
              {pocet} fondů – poplatky, velikost a výnosy přepočtené do Kč. Nezávisle, bez provizí a reklamy.
            </p>
            <div className="mt-4 md:mt-7 md:flex md:justify-center">
              <HeroSearch />
            </div>
            <div className="mt-4 md:mt-6 flex flex-wrap items-center md:justify-center gap-x-6 gap-y-1">
              <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 min-h-11 text-sm font-semibold text-white hover:bg-teal-500 transition-colors">
                <LayoutGrid className="w-4 h-4" /> Otevřít srovnávač všech fondů
              </Link>
              <Link href="/vyber-etf" className="inline-flex items-center gap-1.5 min-h-11 text-sm font-medium text-slate-200 underline-offset-4 hover:text-white hover:underline transition-colors">
                Nevíte, který vybrat? Pomůžeme s výběrem <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <AktualnostDat datum={dataDate} tmavy className="mt-3 md:mt-5" />
          </div>
        </section>

        {/* 2. KTERÝM ETF ZAČÍT – záměr začátečníka; data fondu (TER, výnos v Kč) s datem výše. */}
        {starters.length > 0 && (
          <section className="pt-2 pb-10">
            <div className="mb-4">
              <h2 className="text-lg font-bold tracking-tight">Kterým ETF začít?</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Tři nejčastější první volby českých investorů – široce rozložené, levné a akumulační. Pro orientaci, ne jako doporučení.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {starters.map((etf) => {
                const meta = STARTER_META[etf.isin];
                const Icon = meta?.icon ?? Globe;
                const r = etf.return_1y_czk ?? null; // nikdy EUR místo Kč
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
                      <span className="text-slate-500">12 měsíců v Kč <span className={`font-semibold tabular-nums ${(r ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(r)}</span></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. ŽEBŘÍČKY ETF – datové panely + kategorie v jedné sekci (dřív 2 sekce + „trhy“). */}
        <section className="pb-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold tracking-tight">Žebříčky ETF</h2>
            <p className="text-sm text-slate-500 mt-0.5">Nejlevnější a nejvýkonnější fondy a žebříčky podle kategorií. Výkonnost za 12 měsíců v Kč, u každého tématu jen nejlepší fond.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>*]:min-w-0">
            <DataPanel title="Nejlevnější (TER)" href="/nejlepsi-etf/nejlevnejsi-etf" hrefLabel="celý žebříček" etfs={featured.lowCost || []} metric="ter" />
            <DataPanel title="Nejvýkonnější akciové (12 měs., Kč)" href="/srovnani" hrefLabel="srovnávač" etfs={featured.byPerformance || []} metric="return" />
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CATEGORIES.map((c) => (
              <Link key={c.href} href={c.href} className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 min-h-11 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors shrink-0"><c.icon className="w-4 h-4" /></span>
                <span className="font-medium text-slate-800 text-sm leading-tight">{c.label}</span>
              </Link>
            ))}
          </div>
          <Link href="/zebricky" className="mt-3 inline-flex items-center gap-1 min-h-11 text-sm font-medium text-teal-700 hover:text-teal-800">
            Všech {CATEGORY_COUNT} žebříčků podle kategorií <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* 3b. MODELOVÁ PORTFOLIA – GA4 90 dní: 11 % přechodů z homepage (víc než kalkulačky, průvodce
            a brokeři dohromady). Jen složení a profil, BEZ výnosů (jsme srovnávač, ne investiční web). */}
        <section className="pb-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold tracking-tight">Modelová portfolia z ETF</h2>
            <p className="text-sm text-slate-500 mt-0.5">Příklady, jak poskládat portfolio z ETF – složení a konkrétní fondy. Pro inspiraci, ne jako doporučení.</p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {portfolioModels.map((p) => (
              <li key={p.slug}>
                <Link href={`/portfolio-strategie/${p.slug}`} className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3.5 min-h-12 py-2.5 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                  <span className="text-sm font-medium text-slate-800 leading-tight">{p.name}</span>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none ${RISK_PILL[p.risk]}`}>{p.risk}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/portfolio-strategie" className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-slate-300 px-3.5 min-h-12 py-2.5 text-sm font-medium text-teal-700 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                Porovnat všechna portfolia <ArrowRight className="w-4 h-4" />
              </Link>
            </li>
          </ul>
        </section>

        {/* 4. NÁSTROJE – backtest první (nejpoužívanější). */}
        <section className="pb-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold tracking-tight">Spočítejte si to sami, v korunách</h2>
            <p className="text-sm text-slate-500 mt-0.5">Nástroje a datové rozbory nad stejnými daty jako srovnávač.</p>
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
          <Link href="/kalkulacky" className="mt-3 inline-flex items-center gap-1 min-h-11 text-sm font-medium text-teal-700 hover:text-teal-800">
            Všechny kalkulačky a nástroje <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* 5. KDE KOUPIT ETF – poplatek za nákup ETF ověřený u ceníku brokera (BROKER_PICK.poplatek). */}
        <section className="pb-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold tracking-tight">Kde ETF koupit</h2>
            <p className="text-sm text-slate-500 mt-0.5">Brokeři a robo-poradci dostupní v ČR, seřazení podle našeho skóre. Nebereme provize ani reklamu.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HOME_BROKERS.map(({ id, forWhom, poplatek, broker }, bi) => (
              <Link key={id} href={reviewHref[id] ?? '/kde-koupit'} className={`group ${bi >= 3 ? 'hidden sm:flex' : 'flex'} flex-col rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900 text-sm">{broker!.name}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 tabular-nums" title={`Naše skóre ${broker!.rating} ze 100`}>
                    <Star className="w-3 h-3 fill-current" /> {broker!.rating}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm text-slate-600 leading-relaxed">{forWhom}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>{poplatek.popisek} <span className="font-medium text-slate-700">{poplatek.hodnota}</span></span>
                  <span className="inline-flex items-center gap-1 text-teal-700 group-hover:text-teal-800 font-medium shrink-0">recenze <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6">
            <Link href="/kde-koupit" className="inline-flex items-center gap-1 min-h-11 text-sm font-medium text-teal-700 hover:text-teal-800">Srovnání všech brokerů <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/kde-koupit#metodika" className="inline-flex items-center gap-1 min-h-11 text-sm font-medium text-teal-700 hover:text-teal-800">Jak skóre počítáme <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>

        {/* 6. POPULÁRNÍ SROVNÁNÍ – dvojice fondů (SEO, vnitřní odkazy). */}
        <section className="pb-10">
          <h2 className="text-lg font-bold tracking-tight mb-3">Populární srovnání dvojic</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {[['/srovnani/vwce-vs-cspx', 'VWCE vs CSPX'], ['/srovnani/iwda-vs-cspx', 'IWDA vs CSPX'], ['/srovnani/vwce-vs-iwda', 'VWCE vs IWDA'], ['/srovnani/swrd-vs-iwda', 'SWRD vs IWDA'], ['/srovnani/cspx-vs-vuaa', 'CSPX vs VUAA'], ['/srovnani/vwce-vs-vwrl', 'VWCE vs VWRL']].map(([href, label]) => (
              <li key={label}><Link href={href} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 min-h-11 hover:border-teal-300 hover:bg-teal-50/40 transition-all"><span className="font-medium text-slate-700">{label}</span><ArrowUpRight className="w-3.5 h-3.5 text-slate-400" /></Link></li>
            ))}
          </ul>
        </section>

        {/* 7. ČASTÉ OTÁZKY – na konec (uprostřed trhaly datový tok); rozbalovací → chevron. */}
        <section className="pb-6">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
          <div className="mb-4">
            <h2 className="text-lg font-bold tracking-tight">Časté otázky o ETF</h2>
            <p className="text-sm text-slate-500 mt-0.5">To nejdůležitější, než koupíte první fond.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-xl border border-slate-200 bg-white">
                <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer list-none">
                  <span className="text-sm font-semibold text-slate-900">{f.q}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                  <p>{f.a}</p>
                  <Link href={f.href} className="mt-1 inline-flex items-center gap-1 min-h-11 text-teal-700 hover:text-teal-800 font-medium">{FAQ_ODKAZ[f.href] ?? 'Číst dál'} <ArrowRight className="w-3.5 h-3.5" /></Link>
                </div>
              </details>
            ))}
          </div>
          <Link href="/pruvodce" className="mt-3 inline-flex items-center gap-1 min-h-11 text-sm font-medium text-teal-700 hover:text-teal-800">Celý průvodce investováním do ETF <ArrowRight className="w-4 h-4" /></Link>
        </section>
      </main>
    </div>
  );
}
