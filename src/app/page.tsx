import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeroSearch from '@/components/home/HeroSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  getTotalETFCount, getETFCountLabel, getLastModifiedDate, getReturnsByIsins,
  getETFsByIsins, categoryConfigs, CERSTVOST_DNI, type ETFBasicInfo,
} from '@/lib/etf-data';
import { nactiTrhy } from '@/lib/trhy';
import TriPohledyTrhu from '@/components/home/TriPohledyTrhu';
import { brokers, CENIKY_OVERENY } from '@/data/brokerData';
import { nejstarsiDatum } from '@/components/design-preview/AktualnostDat';
import { portfolioModels, RISK_PILL } from '@/components/design-preview/portfolioData';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import InfoTip from '@/components/design-preview/InfoTip';
import { TrendingUp, ArrowRight, Globe, LineChart, Building2, RefreshCw, ChevronDown, Database, Coins, ShieldCheck } from 'lucide-react';

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
/** Výnos se znaménkem; záporný se skutečným „−“ (ne jen barvou – a11y). */
const pct = (v: number | null) => {
  if (v == null) return '—';
  return `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1).replace('.', ',')} %`;
};
const short = (n: string) => n.replace(/\s+UCITS ETF.*/i, '').replace(/\s+\(.*\)/, '').trim();

/* Kurátorské „první volby" pro sekci Kterým ETF začít (úhel + důvod). */
const STARTER_ISINS = ['IE00BK5BQT80', 'IE00B5BMR087', 'IE00B4L5Y983'];
/* trh = řádek v TRHY (kolik fondů kopíruje stejný index), href = kam vede „porovnat“. */
const STARTER_TRH: Record<string, { trh: string; href: string; na: string }> = {
  IE00BK5BQT80: { trh: 'svet', href: '/nejlepsi-etf/nejlepsi-celosvetove-etf', na: 'celý svět' },
  IE00B5BMR087: { trh: 'sp500', href: '/jaky-sp500-etf', na: 'S&P 500' },
  IE00B4L5Y983: { trh: 'world', href: '/nejlepsi-etf/nejlepsi-msci-world-etf', na: 'MSCI World' },
};
const STARTER_META: Record<string, { tag: string; icon: typeof Globe; why: string }> = {
  IE00BK5BQT80: { tag: 'Celý svět', icon: Globe, why: 'Tisíce firem z celého světa včetně rozvíjejících se trhů v jednom fondu.' },
  IE00B5BMR087: { tag: 'S&P 500', icon: LineChart, why: '500 největších amerických firem, nejnižší poplatek z trojice.' },
  IE00B4L5Y983: { tag: 'MSCI World', icon: Building2, why: 'Velké a střední firmy z 23 vyspělých zemí (MSCI World), bez rozvíjejících se trhů.' },
};

/* Počet kategorií žebříčků (duplicity zrušeny 17. 10. 2026 – 301 v next.config.ts). */
const CATEGORY_COUNT = Object.keys(categoryConfigs).length;

/* Žebříčky v hero – trhy, na které z homepage lidé nejčastěji klikali (GA4 90 dní). */
const HERO_ZEBRICKY = [
  // Trhy z tabulky „tři pohledy“ (svět, S&P 500, Evropa, EM…) se proklikávají tam; tady ostatní
  // nejklikanější žebříčky (GA4: dividendové, zlato, technologické) + typy fondů. Mobil: první 4.
  { href: '/nejlepsi-etf/nejlepsi-dividendove-etf', label: 'Dividendové ETF' },
  { href: '/nejlepsi-etf/nejlepsi-zlato-etf', label: 'Zlato' },
  { href: '/nejlepsi-etf/nejlepsi-dluhopisove-etf', label: 'Dluhopisové ETF' },
  { href: '/nejlepsi-etf/nejlepsi-technologicke-etf', label: 'Technologické ETF' },
  { href: '/nejlepsi-etf/nejlepsi-small-cap-etf', label: 'Malé firmy (small cap)' },
  { href: '/nejlepsi-etf/nejlepsi-realitni-etf', label: 'Nemovitosti (REIT)' },
  { href: '/nejlepsi-etf/nejlevnejsi-etf', label: 'Nejlevnější ETF' },
];
const DVOJICE: [string, string][] = [['/srovnani/vwce-vs-cspx', 'VWCE × CSPX'], ['/srovnani/iwda-vs-cspx', 'IWDA × CSPX'], ['/srovnani/vwce-vs-iwda', 'VWCE × IWDA'], ['/srovnani/swrd-vs-iwda', 'SWRD × IWDA'], ['/srovnani/cspx-vs-vuaa', 'CSPX × VUAA'], ['/srovnani/vwce-vs-vwrl', 'VWCE × VWRL']];
/* Složení modelových portfolií – barvy tříd aktiv pro proužek. */
const BARVA_TRIDY: Record<string, string> = { akcie: 'bg-teal-600', dluhopisy: 'bg-sky-400', zlato: 'bg-amber-400', komodity: 'bg-amber-600', nemovitosti: 'bg-violet-400' };
const PORADI_RIZIKA: Record<string, number> = { 'Konzervativní': 0, 'Umírněné': 1, 'Agresivní': 2 };
/* Na mobilu jen 4 nejklikanější portfolia z homepage (GA4 90 dní); ostatní za „Porovnat portfolia“. */
const PORTFOLIA_MOBIL = new Set(['dividendove-portfolio', 'permanentni-portfolio', 'akciove-portfolio', 'globalni-jadro-small-cap-value']);

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
/* Robo-poradce (Portu) je jiný typ služby (spravuje portfolio za roční poplatek) – v tabulce zvlášť
   za brokery, ať nepůsobí jako „nejlevnější broker“ (revize 18. 10. 2026). */
const ROBO = new Set(['portu']);
const HOME_BROKERS = BROKER_PICK
  .map((p) => ({ ...p, broker: brokers.find((b) => b.id === p.id), robo: ROBO.has(p.id) }))
  .filter((x) => x.broker)
  .sort((a, b) => Number(a.robo) - Number(b.robo) || (b.broker!.rating ?? 0) - (a.broker!.rating ?? 0));

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

export default async function DesignPreviewV2() {
  // Homepage = SROVNÁVAČ ETF (majitel 18. 10. 2026). Koncept 9/10 (nezávislý expert): hero s hledáním
  // (rozumí češtině) → tři pohledy na fondy podle trhu → startovní fondy → modelová portfolia →
  // odkud čísla bereme → brokeři → FAQ. Bez simulací „kolik by z toho bylo“.
  const allPortfolioIsins = Array.from(new Set(portfolioModels.flatMap((p) => p.allocations.map((a) => a.isin))));
  const [totalCount, starters, posledniScrape, isinReturns, trhy] = await Promise.all([
    getTotalETFCount(),
    getETFsByIsins(STARTER_ISINS),
    getLastModifiedDate(),
    getReturnsByIsins(allPortfolioIsins),
    nactiTrhy(),
  ]);
  const pocet = totalCount.toLocaleString('cs-CZ');
  // Pravidlo č. 1: datum dat BEZ fallbacku na dnešek – když ho nejde načíst, čísla s datem se neukážou.
  const dataDate = posledniScrape && !Number.isNaN(new Date(posledniScrape).getTime()) ? new Date(posledniScrape) : null;
  // Pevné mezery: datum se nesmí rozlomit na „18. / 10. 2026“.
  const datumText = dataDate ? dataDate.toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }).replace(/ /g, '\u00a0') : null;
  const cerstvy = (e: ETFBasicInfo) => !!e.scraping_date && Date.now() - new Date(e.scraping_date).getTime() < CERSTVOST_DNI * 864e5;
  const nejstarsi = nejstarsiDatum(starters);
  const starsiText = nejstarsi && dataDate && dataDate.getTime() - nejstarsi.getTime() > 2 * 864e5
    ? nejstarsi.toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }) : null;
  const trhPodleId = new Map((trhy ?? []).map((r) => [r.trh.id, r]));

  // Výnos portfolia v Kč = vážený průměr výnosů složek = přesně výnos bez rebalancování za dané období.
  // Chybí-li data KTERÉKOLI složky, číslo se neukáže.
  const vynosPortfolia = (p: (typeof portfolioModels)[number], k: 'return_1y_czk' | 'return_3y_czk') => {
    let r = 0, w = 0;
    for (const a of p.allocations) {
      const v = isinReturns[a.isin]?.[k];
      if (v == null) return null;
      r += a.percentage * v; w += a.percentage;
    }
    return Math.abs(w - 100) < 0.01 ? r / 100 : null;
  };
  const portfolia = portfolioModels
    .map((p, i) => {
      const slozeni = new Map<string, number>();
      for (const a of p.allocations) slozeni.set(a.cls, (slozeni.get(a.cls) ?? 0) + a.percentage);
      return { ...p, i, slozeni: [...slozeni.entries()], return1y: dataDate ? vynosPortfolia(p, 'return_1y_czk') : null, return3y: dataDate ? vynosPortfolia(p, 'return_3y_czk') : null };
    })
    .sort((a, b) => (PORADI_RIZIKA[a.risk] ?? 9) - (PORADI_RIZIKA[b.risk] ?? 9) || a.i - b.i);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.plain } })),
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
          {/* Hledání v hlavičce na homepage ne – hlavní akcí je hledání v hero (dvě pole = zmatek). */}
        </div>
      </header>

      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-20">
        {/* S1 HERO – vlevo co web dělá + hledání (rozumí češtině) + 1 tlačítko + řádek s důkazy a datem;
            vpravo žebříčky podle trhu (GA4: 25 % přechodů z homepage). */}
        <section className="py-4 md:py-7">
          <div className="rounded-2xl bg-slate-900 text-white px-4 py-5 md:px-9 md:py-9 md:grid md:grid-cols-[minmax(0,1fr)_17rem] md:gap-10">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight text-balance">Srovnání ETF fondů s výnosy v korunách</h1>
              <p className="mt-2 md:mt-3 max-w-2xl text-slate-300 text-sm md:text-lg leading-relaxed">
                {pocet} fondů – poplatky, velikost a výnosy přepočtené kurzem ČNB do Kč. Nezávisle, bez provizí a reklamy.
              </p>
              <div className="mt-4 md:mt-6">
                <HeroSearch priklady={['VWCE', 'S&P 500', 'zlato', 'dluhopisy']} />
              </div>
              <div className="mt-4 md:mt-5 flex flex-wrap items-center gap-x-6 gap-y-1">
                <Link href="/srovnani" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 min-h-11 text-sm font-semibold text-white ring-1 ring-teal-500/40 hover:bg-teal-800 transition-colors">
                  Otevřít srovnávač fondů <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/vyber-etf" className="inline-flex items-center gap-1.5 min-h-11 text-sm font-medium text-slate-100 underline decoration-slate-500 underline-offset-4 hover:text-white hover:decoration-white transition-colors">
                  Nevíte, který vybrat? <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {datumText && (
                <p className="hidden md:flex mt-4 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{pocet} fondů</span><span aria-hidden="true">·</span>
                  <span>{CATEGORY_COUNT} žebříčků</span><span aria-hidden="true">·</span>
                  <span>Data z justETF stažena <strong className="font-semibold text-slate-200">{datumText}</strong>, kurzy ČNB</span>
                </p>
              )}
            </div>
            <nav aria-label="Další žebříčky ETF" className="mt-4 md:mt-0 -mx-4 md:mx-0">
              <p className="hidden md:block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Další žebříčky</p>
              <ul className="flex md:flex-col gap-2 md:gap-0 overflow-x-auto px-4 md:px-0 pb-1 md:pb-0 [scrollbar-width:none] md:divide-y md:divide-white/10">
                {HERO_ZEBRICKY.map((z, zi) => (
                  <li key={z.href} className={`shrink-0 ${zi >= 4 ? 'hidden md:block' : ''}`}>
                    <Link href={z.href} className="flex items-center justify-between gap-3 whitespace-nowrap rounded-full md:rounded-none bg-white/10 md:bg-transparent px-3.5 md:px-1 min-h-10 md:min-h-11 text-sm text-slate-100 hover:bg-white/20 md:hover:bg-white/5 transition-colors">
                      {z.label} <ArrowRight className="hidden md:block w-4 h-4 text-slate-500" />
                    </Link>
                  </li>
                ))}
                <li className="shrink-0">
                  <Link href="/zebricky" className="flex items-center justify-between gap-3 whitespace-nowrap rounded-full md:rounded-none border border-white/20 md:border-0 px-3.5 md:px-1 min-h-10 md:min-h-11 text-sm font-semibold text-teal-300 hover:text-teal-200">
                    Všech {CATEGORY_COUNT} žebříčků <ArrowRight className="w-4 h-4" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </section>

        {/* S2 TŘI POHLEDY PODLE TRHU – jádro srovnávače (ruční seznam fondů: src/data/trhyDvojcata.ts). */}
        {trhy && trhy.length > 0 && datumText && (
          <section className="pt-2 pb-8 md:pb-10" aria-labelledby="h-trhy">
            <div className="mb-4">
              <h2 id="h-trhy" className="text-xl font-bold tracking-tight">Nejlevnější, největší a nejvýkonnější ETF podle trhu</h2>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl">
                Pro každý trh vybíráme jen z fondů, které kopírují široký index – bez sektorů, měnového zajištění a ESG variant. Data k {datumText}.
              </p>
            </div>
            <TriPohledyTrhu radky={trhy} dvojice={DVOJICE} />
          </section>
        )}

        {/* S3 KTERÝM ETF ZAČÍT – 17 % přechodů z homepage. */}
        {starters.length > 0 && (
          <section className="pb-8 md:pb-10" aria-labelledby="h-zacit">
            <div className="mb-4">
              <h2 id="h-zacit" className="text-xl font-bold tracking-tight">Kterým ETF začít?</h2>
              <p className="text-sm text-slate-600 mt-1">
                Fondy, které si naši návštěvníci otevírají nejčastěji (posledních 90 dní) – široce rozložené, levné a akumulační. Pro orientaci, ne jako doporučení.{starsiText && ` U některého fondu jsou data starší (${starsiText}).`}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {starters.map((etf) => {
                const meta = STARTER_META[etf.isin];
                const Icon = meta?.icon ?? Globe;
                const r = cerstvy(etf) ? etf.return_1y_czk ?? null : null;
                const st = STARTER_TRH[etf.isin];
                const dalsich = st ? (trhPodleId.get(st.trh)?.pocet ?? 0) - 1 : 0;
                return (
                  <div key={etf.isin} className="flex flex-col rounded-xl border border-slate-200 bg-white px-4 py-3 md:p-5">
                    <Link href={`/etf/${etf.isin}`} className="group flex items-start gap-3">
                      <span className="hidden md:flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-100 transition-colors"><Icon className="w-5 h-5" /></span>
                      <span className="min-w-0">
                        <span className="block text-xs font-medium text-slate-500">{meta?.tag}</span>
                        <span className="block text-sm font-semibold text-slate-900 leading-tight group-hover:text-teal-800">{short(etf.name)} <span className="font-normal text-slate-500">· {etf.primary_ticker}</span></span>
                      </span>
                    </Link>
                    <p className="hidden md:block mt-2 flex-1 text-sm text-slate-600 leading-relaxed">{meta?.why}</p>
                    <dl className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-500">
                      <div><dt>TER</dt><dd className="mt-0.5 text-sm font-semibold text-slate-900 tabular-nums">{ter(etf.ter_numeric)}</dd></div>
                      <div><dt>12 měs. v Kč</dt><dd className={`mt-0.5 text-sm font-semibold tabular-nums ${r == null ? 'text-slate-500' : r >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{pct(r)}</dd></div>
                      <div><dt>Velikost</dt><dd className="mt-0.5 text-sm font-semibold text-slate-900 tabular-nums">{money(etf.fund_size_numeric, etf.fund_currency)}</dd></div>
                    </dl>
                    {st && (dalsich > 0 || !trhy) && (
                      <Link href={st.href} className="mt-1 md:mt-2 inline-flex items-center gap-1 min-h-10 text-sm font-medium text-teal-700 hover:text-teal-800">
                        Porovnat s dalšími fondy na {st.na} <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* S4 MODELOVÁ PORTFOLIA – s výkonností v Kč a datem (majitel: bez čísel „ztratilo šťávu“). */}
        <section className="pb-8 md:pb-10" aria-labelledby="h-portfolia">
          <div className="mb-4 sm:flex sm:items-end sm:justify-between sm:gap-4">
            <div>
              <h2 id="h-portfolia" className="text-xl font-bold tracking-tight">Modelová portfolia z ETF</h2>
              <p className="text-sm text-slate-600 mt-1">
                Hotová složení z konkrétních fondů. Výnos v Kč{datumText ? ` k ${datumText}` : ''}: vážený průměr fondů, bez rebalancování, před daní. Pro inspiraci, ne jako doporučení.
              </p>
            </div>
            <Link href="/portfolio-strategie" className="mt-2 sm:mt-0 shrink-0 inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-teal-700 hover:text-teal-800">Porovnat portfolia <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white sm:divide-y-0 sm:border-0 sm:bg-transparent sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
            {portfolia.map((p) => (
              <li key={p.slug} className={PORTFOLIA_MOBIL.has(p.slug) ? undefined : 'hidden sm:block'}>
                <Link href={`/portfolio-strategie/${p.slug}`} className="group flex h-full flex-col gap-1.5 sm:gap-2 px-4 py-2.5 sm:rounded-xl sm:border sm:border-slate-200 sm:bg-white sm:p-4 hover:bg-teal-50/40 sm:hover:border-teal-300 transition-all">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900 leading-tight group-hover:text-teal-800">{p.name}</span>
                    <span className={`hidden sm:inline shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none ${RISK_PILL[p.risk]}`}>{p.risk}</span>
                    <span className={`sm:hidden shrink-0 text-sm font-bold tabular-nums ${p.return1y == null ? 'text-slate-500' : p.return1y >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{pct(p.return1y)}</span>
                  </span>
                  <span className="hidden sm:flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`Složení: ${p.slozeni.map(([c, v]) => `${c} ${v} %`).join(', ')}`}>
                    {p.slozeni.map(([c, v]) => <span key={c} className={BARVA_TRIDY[c] ?? 'bg-slate-400'} style={{ width: `${v}%` }} />)}
                  </span>
                  <span className="sm:hidden flex items-center justify-between gap-2 text-xs text-slate-500"><span>{p.risk} · za 12 měs.</span><span className="tabular-nums">{pct(p.return3y)} za 3 roky</span></span>
                  <span className="hidden sm:flex items-baseline gap-3 text-xs text-slate-500">
                    <span><span className={`text-base font-bold tabular-nums ${p.return1y == null ? 'text-slate-500' : p.return1y >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{pct(p.return1y)}</span> <span className="whitespace-nowrap">za 12 měs.</span></span>
                    <span className="tabular-nums whitespace-nowrap">{pct(p.return3y)} za 3 roky</span>
                  </span>
                </Link>
              </li>
            ))}
            <li className="hidden lg:block">
              <Link href="/portfolio-strategie" className="flex h-full min-h-24 flex-col justify-center gap-1 rounded-xl border border-dashed border-slate-300 p-4 text-sm font-semibold text-teal-700 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
                Porovnat všechna portfolia <ArrowRight className="w-4 h-4" />
              </Link>
            </li>
          </ul>
          <p className="mt-2 hidden sm:flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            {Object.entries(BARVA_TRIDY).map(([c, b]) => <span key={c} className="inline-flex items-center gap-1.5"><span className={`inline-block w-2.5 h-2.5 rounded-full ${b}`} />{c}</span>)}
          </p>
        </section>

        {/* S5 ODKUD ČÍSLA BEREME – důkaz pro „největší český průvodce“ i pravidlo č. 1. */}
        <section className="pb-8 md:pb-10" aria-labelledby="h-data">
          <h2 id="h-data" className="text-xl font-bold tracking-tight mb-3 md:mb-4">Odkud čísla bereme</h2>
          <ul className="grid gap-x-3 gap-y-2.5 md:gap-y-3 md:grid-cols-3 rounded-xl border border-slate-200 bg-white p-4 md:border-0 md:bg-transparent md:p-0">
            <li className="flex gap-3 md:rounded-xl md:border md:border-slate-200 md:bg-white md:p-4">
              <Database className="w-5 h-5 shrink-0 text-teal-700 mt-0.5" aria-hidden="true" />
              <span className="text-sm text-slate-600 leading-relaxed"><strong className="block text-slate-900">{pocet} fondů denně z justETF, u každého čísla datum</strong><span className="hidden md:inline">Data fondů stahujeme každý den. U každého čísla je datum, ke kterému platí.</span></span>
            </li>
            <li className="flex gap-3 md:rounded-xl md:border md:border-slate-200 md:bg-white md:p-4">
              <Coins className="w-5 h-5 shrink-0 text-teal-700 mt-0.5" aria-hidden="true" />
              <span className="text-sm text-slate-600 leading-relaxed"><strong className="block text-slate-900">Výnosy přepočtené kurzem ČNB do Kč</strong><span className="hidden md:inline">Vidíte, kolik byste vydělali v korunách, ne jen v měně fondu.</span></span>
            </li>
            <li className="flex gap-3 md:rounded-xl md:border md:border-slate-200 md:bg-white md:p-4">
              <ShieldCheck className="w-5 h-5 shrink-0 text-teal-700 mt-0.5" aria-hidden="true" />
              <span className="text-sm text-slate-600 leading-relaxed"><strong className="block text-slate-900">Denní automatická kontrola dat</strong><span className="hidden md:inline">Hlídá chyby. Číslu, kterému nevěříme, ukážeme „—“, ne odhad.</span></span>
            </li>
          </ul>
          <Link href="/o-nas#metodika" className="mt-2 inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-teal-700 hover:text-teal-800">Metodika a o nás <ArrowRight className="w-4 h-4" /></Link>
        </section>

        {/* S6 KDE ETF KOUPIT – jedna tabulka, poplatky ověřené u ceníků (CENIKY_OVERENY). */}
        <section className="pb-8 md:pb-10" aria-labelledby="h-brokeri">
          <div className="mb-4">
            <h2 id="h-brokeri" className="text-xl font-bold tracking-tight">Kde ETF koupit</h2>
            <p className="text-sm text-slate-600 mt-1">Brokeři dostupní v ČR seřazení podle našeho skóre (poplatky, ochrana, nabídka, čeština, daně, flexibilita), robo-poradce zvlášť. Nebereme provize ani reklamu. Ceníky ověřeny {new Date(CENIKY_OVERENY).toLocaleDateString('cs-CZ')}.</p>
          </div>
          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            <li className="hidden sm:grid sm:grid-cols-[1.2fr_1.6fr_1.4fr_auto] gap-4 px-4 py-2.5 text-xs font-medium text-slate-500">
              <span>Broker</span><span>Pro koho</span><span>Poplatek</span><span className="text-right">Skóre</span>
            </li>
            {HOME_BROKERS.map(({ id, forWhom, poplatek, broker, robo }, bi) => (
              <li key={id} className={bi >= 4 ? 'hidden sm:block' : undefined}>
                <Link href={reviewHref[id] ?? '/kde-koupit'} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.2fr_1.6fr_1.4fr_auto] gap-x-4 gap-y-0.5 px-4 py-2.5 sm:py-3 items-center hover:bg-teal-50/40 transition-colors">
                  <span className="text-sm font-semibold text-slate-900">{broker!.name}{robo && <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">robo-poradce</span>}</span>
                  <span className="hidden sm:block text-sm text-slate-600">{forWhom}</span>
                  <span className="order-4 sm:order-none col-span-2 sm:col-span-1 text-xs sm:text-sm text-slate-600"><span className="text-slate-500">{poplatek.popisek}:</span> <span className="font-medium text-slate-900">{poplatek.hodnota}</span></span>
                  {robo
                    ? <span className="order-2 sm:order-none text-right text-xs text-slate-500" title="Robo-poradce hodnotíme jinou metodikou než brokery">jiné hodnocení</span>
                    : <span className="order-2 sm:order-none text-right text-sm font-semibold tabular-nums text-teal-800" title={`Naše skóre ${broker!.rating} ze 100`}>{broker!.rating}<span className="text-xs font-normal text-slate-500">/100</span></span>}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap gap-x-6">
            <Link href="/kde-koupit" className="inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-teal-700 hover:text-teal-800">Srovnání brokerů <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/kde-koupit#metodika" className="inline-flex items-center gap-1 min-h-11 text-sm font-medium text-teal-700 hover:text-teal-800">Jak skóre počítáme</Link>
          </div>
        </section>

        {/* S7 ČASTÉ OTÁZKY */}
        <section className="pb-6" aria-labelledby="h-faq">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
          <h2 id="h-faq" className="text-xl font-bold tracking-tight mb-4">Časté otázky o ETF</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-xl border border-slate-200 bg-white">
                <summary className="flex items-center justify-between gap-3 px-4 min-h-12 py-3 cursor-pointer list-none">
                  <span className="text-sm font-semibold text-slate-900">{f.q}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform shrink-0" aria-hidden="true" />
                </summary>
                <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                  <p>{f.a}</p>
                  <Link href={f.href} className="mt-1 inline-flex items-center gap-1 min-h-10 text-teal-700 hover:text-teal-800 font-medium">{FAQ_ODKAZ[f.href] ?? 'Číst dál'} <ArrowRight className="w-3.5 h-3.5" /></Link>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
