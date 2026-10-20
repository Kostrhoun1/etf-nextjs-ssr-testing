import { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import HeroSearch from '@/components/home/HeroSearch';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import {
  getTotalETFCount, getETFCountLabel, getLastModifiedDate, getReturnsByIsins,
  getETFsByIsins, categoryConfigs, CERSTVOST_DNI, type ETFBasicInfo,
} from '@/lib/etf-data';
import { nactiTrhy } from '@/lib/trhy';
import TriPohledyTrhu from '@/components/home/TriPohledyTrhu';
import EmitentLogo, { emitentFondu } from '@/components/home/EmitentLogo';
import { brokers, CENIKY_OVERENY, nakladNakupu } from '@/data/brokerData';
import { nactiKurzCnb, datumKurzu } from '@/lib/kurzCnb';
import { nejstarsiDatum } from '@/components/design-preview/AktualnostDat';
import { portfolioModels, RISK_PILL } from '@/components/design-preview/portfolioData';
import { reviewHref } from '@/components/design-preview/brokerReviewHref';
import InfoTip from '@/components/design-preview/InfoTip';
import { TrendingUp, ArrowRight, Globe, LineChart, Building2, ChevronDown, Check } from 'lucide-react';
import { BARVY_SLOZEK } from '@/components/design-preview/portfolioData';
import { datumCen } from '@/lib/datumCen';

export const revalidate = 3600;
export async function generateMetadata(): Promise<Metadata> {
  const pocet = await getETFCountLabel();
  return {
    // Title/description ladí na dotaz „etf" (pozice ~10, dřív CTR 0 %): konkrétní číslo fondů
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

const ter = (v: number | null) => (v == null ? '—' : `${v.toFixed(2).replace('.', ',')}\u00a0%`);
/** Velikost fondu je z justETF VŽDY v EUR (i u USD tříd) → vždy €. Ověřeno proti justETF. */
const curSym = (_c?: string | null) => '€';
const money = (v: number | null, cur: string | null = 'EUR') => {
  if (v == null) return '—';
  const s = curSym(cur);
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace('.', ',')}\u00a0mld.\u00a0${s}`;
  return `${Math.round(v)}\u00a0mil.\u00a0${s}`;
};
/** Výnos se znaménkem; záporný se skutečným „−“ (ne jen barvou – a11y). */
const pct = (v: number | null) => {
  if (v == null) return '—';
  return `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1).replace('.', ',')}\u00a0%`;
};
const short = (n: string) => n.replace(/\s+UCITS ETF.*/i, '').replace(/\s+\(.*\)/, '').trim();

/* Kurátorské „první volby" pro sekci Kterým ETF začít (úhel + důvod). */
const STARTER_ISINS = ['IE00BK5BQT80', 'IE00B5BMR087', 'IE00B4L5Y983'];
/* trh = řádek v TRHY (kolik fondů kopíruje stejný index), href = kam vede „porovnat“. */
/* U každého startovního fondu nejčastější srovnání dvojice (art director: dvojice do karet, ne řádek čipů). */
const STARTER_DVOJICE: Record<string, { href: string; label: string }> = {
  // Popisky tickery z karty (SXR8 = CSPX, EUNL = IWDA – stejné fondy, jiná burza); URL zůstávají.
  IE00BK5BQT80: { href: '/srovnani/vwce-vs-iwda', label: 'VWCE vs EUNL' },
  IE00B5BMR087: { href: '/srovnani/vwce-vs-cspx', label: 'SXR8 vs VWCE' },
  IE00B4L5Y983: { href: '/srovnani/iwda-vs-cspx', label: 'EUNL vs SXR8' },
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
  // „Oblíbené žebříčky“ = nejklikanější z homepage podle GA4 (90 dní). Dřív „Další žebříčky“ – v hero
  // nedávalo smysl, nad nimi žádné nejsou (majitel 18. 10. 2026).
  { href: '/nejlepsi-etf/nejlepsi-celosvetove-etf', label: 'Celosvětové ETF' },
  { href: '/nejlepsi-etf/nejlepsi-evropske-etf', label: 'Evropské ETF' },
  { href: '/nejlepsi-etf/nejlepsi-emerging-markets-etf', label: 'Rozvíjející se trhy' },
  { href: '/nejlepsi-etf/nejlepsi-dividendove-etf', label: 'Dividendové ETF' },
  { href: '/nejlepsi-etf/nejlepsi-zlato-etf', label: 'Zlato' },
  { href: '/nejlepsi-etf/nejlepsi-technologicke-etf', label: 'Technologické ETF' },
];
/* Krátké názvy portfolií na homepage (dlouhé se lámaly a posouvaly čísla). „ETF průvodce portfolio“
   působilo jako reklama na sebe → název podle obsahu (test s uživateli 18. 10. 2026). */
const NAZEV_PORTFOLIA: Record<string, string> = {
  'permanentni-portfolio': 'Permanentní',
  'nobel-portfolio': 'Nobelovo',
  'akciove-portfolio': 'Akciové',
  'ray-dalio-all-weather': 'All Weather',
  'portfolio-60-40': '60/40',
  'dividendove-portfolio': 'Dividendové',
  'globalni-jadro-small-cap-value': 'Svět + malé firmy',
};
const RIZIKO_TECKY: Record<string, number> = { 'Konzervativní': 1, 'Umírněné': 2, 'Agresivní': 3 };
/* Loga brokerů ořezaná na obsah (public/loga-brokeru, z lovable-uploads 18. 10. 2026). Portu má jen
   provizorní zástupné logo → jméno textem. */
const LOGO_BROKERA: Record<string, string> = {
  // Čtvercové ikony brokerů (favicony z jejich webů, 18. 10. 2026) – jeden režim: ikona + jméno.
  xtb: '/loga-brokeru/xtb-ikona.png', trading212: '/loga-brokeru/trading212-ikona.png', ibkr: '/loga-brokeru/ibkr-ikona.png',
  degiro: '/loga-brokeru/degiro-ikona.png', fio: '/loga-brokeru/fio-ikona.png', portu: '/loga-brokeru/portu-ikona.png',
};/* Složení modelových portfolií – barvy tříd aktiv pro proužek. */
// Stejná paleta jako modelová portfolia (portfolioData.ts – Okabe–Ito, rozlišitelná i pro barvoslepé).
const BARVA_TRIDY: Record<string, string> = { akcie: BARVY_SLOZEK.akcie, dluhopisy: BARVY_SLOZEK.dluhopisyDlouhe, zlato: BARVY_SLOZEK.zlato, komodity: BARVY_SLOZEK.komodity, nemovitosti: BARVY_SLOZEK.nemovitosti };
const PORADI_RIZIKA: Record<string, number> = { 'Konzervativní': 0, 'Umírněné': 1, 'Agresivní': 2 };
/* Na mobilu jen 4 nejklikanější portfolia z homepage (GA4 90 dní); ostatní za „Porovnat portfolia“. */
const PORTFOLIA_MOBIL = new Set(['dividendove-portfolio', 'permanentni-portfolio', 'akciove-portfolio', 'globalni-jadro-small-cap-value']);

/* Kde koupit ETF – výběr brokerů pro homepage. Jména a ceníky z brokerData; krátká věta „pro koho“ jen na
   homepage, plné srovnání je v sekci Kde koupit. Redakční skóre ZRUŠENO (rozhodnutí majitele 19. 10. 2026) –
   řazení abecedně, místo skóre fakt z ceníků: kolik stojí nákup ETF za 2 000 Kč (poplatek + směna, kurz ČNB). */
type Poplatek = { popisek: string; hodnota: string; smena: string };
// Poplatek na kartě je ručně zkrácený a OVĚŘENÝ u ceníku brokera (18. 10. 2026; zdroje a datum v
// brokerData.ts → CENIKY_OVERENY, denní kontrola hlídá stáří). Dřív se bral
// z brokerData.etfFee ořezem před první čárkou → Portu „0,24-1 % ročně“ se ukazoval jako „0“.
const BROKER_PICK: { id: string; forWhom: string; poplatek: Poplatek }[] = [
  { id: 'portu', forWhom: 'Robo-poradce – sestaví a spravuje portfolio za vás.', poplatek: { popisek: 'Vše v ceně', hodnota: '0,24–1 % ročně', smena: 'v ceně' } },
  { id: 'xtb', forWhom: 'ETF bez provize do 100 000 € měsíčně, česká podpora v pracovní dny.', poplatek: { popisek: 'Nákup ETF', hodnota: '0 € do 100 000 €/měs.', smena: '0,5 %' } },
  { id: 'trading212', forWhom: 'Bez provize, koupíte i část podílu (od 1 €).', poplatek: { popisek: 'Nákup ETF', hodnota: '0 €', smena: '0,15 %' } },
  { id: 'ibkr', forWhom: 'Nejširší nabídka trhů pro pokročilé investory.', poplatek: { popisek: 'Nákup ETF', hodnota: '0,05 %, min. 1,25 € + poplatek burzy', smena: '0,002 % (min. 2 USD)' } },
  { id: 'degiro', forWhom: 'Levné nákupy vybraných ETF pro dlouhodobé držení.', poplatek: { popisek: 'Nákup ETF', hodnota: '1 € u vybraných, jinak 3 €', smena: 'CZK↔EUR zdarma' } },
  { id: 'fio', forWhom: 'Česká banka s pobočkami, vše v češtině.', poplatek: { popisek: 'Nákup ETF', hodnota: 'Xetra 3,95 € do 1 400 €', smena: 'v kurzu banky' } },
];
/* Robo-poradce (Portu) je jiný typ služby (spravuje portfolio za roční poplatek) – v tabulce zvlášť
   za brokery, ať nepůsobí jako „nejlevnější broker“ (revize 18. 10. 2026). */
const ROBO = new Set(['portu']);
const HOME_BROKERS = BROKER_PICK
  .map((p) => ({ ...p, broker: brokers.find((b) => b.id === p.id), robo: ROBO.has(p.id) }))
  .filter((x) => x.broker)
  .sort((a, b) => Number(a.robo) - Number(b.robo) || a.broker!.name.localeCompare(b.broker!.name, 'cs'));
/** Ukázkový nákup pro sloupec „Nákup za 2 000 Kč“ (běžná měsíční investice). */
const UKAZKOVY_NAKUP_KC = 2000;

const FAQ: { q: string; a: ReactNode; plain: string; href: string }[] = [
  {
    q: 'Co je vlastně ETF?',
    a: <>ETF je fond, který jedním nákupem investuje do desítek až tisíců firem najednou. Pasivně kopíruje nějaký index (třeba S&P 500), a proto má výrazně nižší poplatky než aktivně řízené fondy. Místo vybírání jednotlivých akcií koupíte rovnou celý trh.</>,
    plain: 'ETF je fond, který jedním nákupem investuje do desítek až tisíců firem najednou. Pasivně kopíruje index (např. S&P 500), a proto má výrazně nižší poplatky než aktivně řízené fondy. Místo vybírání jednotlivých akcií koupíte celý trh.',
    href: '/pruvodce',
  },
  {
    q: 'Jak se ETF v Česku daní?',
    a: <>Zisk z prodeje je osvobozen, pokud fond držíte déle než 3 roky (<InfoTip label="Časový test: po 3 letech držení je zisk z prodeje cenných papírů v ČR osvobozen od daně z příjmu. Od roku 2026 bez horního limitu.">časový test</InfoTip>), nebo když <strong>úhrn vašich prodejů</strong> za rok nepřekročí 100 000 Kč (hodnotový test – jde o hrubé příjmy, ne zisk). Jinak se zisk daní 15 % (u vysokých příjmů 23 %). Dividendy se daní 15 % – u akumulačních fondů to ale řešit nemusíte, reinvestují se uvnitř fondu.</>,
    plain: 'Zisk z prodeje ETF je v ČR osvobozen po 3 letech držení (časový test, od 2026 bez limitu) nebo když úhrn prodejů za rok nepřekročí 100 000 Kč hrubých příjmů (ne zisku). Jinak se daní 15 %, u vysokých příjmů 23 %. Dividendy se daní 15 %; u akumulačních fondů se reinvestují uvnitř fondu a daň neřešíte.',
    href: '/pruvodce',
  },
  {
    q: 'Akumulační, nebo distribuční fond?',
    a: <>Akumulační (<InfoTip label="Acc – Accumulating. Dividendy se automaticky reinvestují uvnitř fondu, na účet vám nechodí.">Acc</InfoTip>) dividendy automaticky reinvestuje uvnitř fondu – vhodné pro dlouhodobý růst a bez daňové starosti. Distribuční (<InfoTip label="Dist – Distributing. Dividendy fond pravidelně vyplácí na váš účet.">Dist</InfoTip>) je vyplácí na účet – vhodné, když chcete pravidelný příjem.</>,
    plain: 'Akumulační fond (Acc) dividendy automaticky reinvestuje uvnitř fondu – vhodné pro dlouhodobý růst a bez daňové starosti. Distribuční fond (Dist) je vyplácí na účet – vhodné, když chcete pravidelný příjem.',
    href: '/pruvodce',
  },
  {
    q: 'Co je TER a kolik je rozumné?',
    a: <>TER (celková nákladovost) je roční poplatek fondu v procentech. Strhává se průběžně z hodnoty fondu – nic neplatíte zvlášť, jen je výnos o tuto částku nižší. U fondů na široké indexy (celý svět, S&P 500) se dnes pohybuje většinou mezi 0,03 a 0,25 % ročně, výjimečně i výš; nejlevnější fondy pro každý trh ukazujeme výše.</>,
    plain: 'TER (celková nákladovost) je roční poplatek fondu v procentech. Strhává se průběžně z hodnoty fondu – nic neplatíte zvlášť, jen je výnos o tuto částku nižší. U fondů na široké indexy (celý svět, S&P 500) se dnes pohybuje většinou mezi 0,03 a 0,25 % ročně, výjimečně i výš.',
    href: '/srovnani',
  },
  {
    q: 'Můžu o peníze přijít?',
    a: <>Ano, hodnota akciových ETF kolísá. V krizích (2008, 2020) klesly i široké fondy na celý svět o desítky procent a návrat nad původní hodnotu trval měsíce až roky. ETF nezkrachuje jako jedna firma, ale krátkodobě v minusu být může – proto se investuje na roky a peníze na nečekané výdaje se drží zvlášť. Kolik času trvalo dostat se z minusu, ukazujeme na datech v článku <Link href="/jak-dlouho-v-minusu" className="text-teal-700 underline underline-offset-2">Jak dlouho v minusu</Link>.</>,
    plain: 'Ano, hodnota akciových ETF kolísá. V krizích (2008, 2020) klesly i široké fondy na celý svět o desítky procent a návrat nad původní hodnotu trval měsíce až roky. ETF nezkrachuje jako jedna firma, ale krátkodobě v minusu být může – proto se investuje na roky a peníze na nečekané výdaje se drží zvlášť.',
    href: '/jak-dlouho-v-minusu',
  },
  {
    q: 'Kolik peněz stačí na začátek?',
    a: <>Začít jde i s pár tisíci korunami. Někteří brokeři umožňují koupit i zlomek podílu, takže limituje spíš poplatek za nákup než cena fondu. Při menších pravidelných částkách (např. 2 000 Kč měsíčně) dává smysl broker bez poplatku za nákup ETF – srovnání najdete níže.</>,
    plain: 'Začít jde i s pár tisíci korunami. Někteří brokeři umožňují koupit i zlomek podílu, takže limituje spíš poplatek za nákup než cena fondu. Při menších pravidelných částkách (např. 2 000 Kč měsíčně) dává smysl broker bez poplatku za nákup ETF.',
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
    // SEO audit 20. 10. 2026: datový článek měl málo interních odkazů – z homepage jen odkaz, bez dalšího textu.
    href: '/kolik-vydelaly-etf',
  },
];

const FAQ_ODKAZ: Record<string, string> = { '/pruvodce': 'Číst víc v průvodci', '/kde-koupit': 'Srovnání brokerů', '/srovnani': 'Otevřít srovnávač', '/jak-dlouho-v-minusu': 'Data o propadech', '/kolik-vydelaly-etf': 'Kolik vydělaly ETF v korunách' };

export default async function DesignPreviewV2() {
  // Homepage = SROVNÁVAČ ETF (majitel 18. 10. 2026). Koncept 9/10 (nezávislý expert): hero s hledáním
  // (rozumí češtině) → tři pohledy na fondy podle trhu → startovní fondy → modelová portfolia →
  // odkud čísla bereme → brokeři → FAQ. Bez simulací „kolik by z toho bylo“.
  const allPortfolioIsins = Array.from(new Set(portfolioModels.flatMap((p) => p.allocations.map((a) => a.isin))));
  const [totalCount, starters, posledniScrape, isinReturns, trhy, kurzy] = await Promise.all([
    getTotalETFCount(),
    getETFsByIsins(STARTER_ISINS),
    getLastModifiedDate(),
    getReturnsByIsins(allPortfolioIsins),
    nactiTrhy(),
    nactiKurzCnb(),
  ]);
  // Nákup ETF za 2 000 Kč v Kč (stejná funkce jako /kde-koupit). Bez kurzu ČNB „—“ (pravidlo č. 1).
  // „od“ = část nákladu neznáme (Fio: směna v kurzu banky; IBKR: poplatky burzy) – stejně jako /kde-koupit.
  const nakup2000 = (id: string): string => {
    const b = brokers.find((x) => x.id === id);
    const n = b && kurzy ? nakladNakupu(b, UKAZKOVY_NAKUP_KC, kurzy) : null;
    if (!n) return '—';
    const kc = (v: number) => `${Math.round(v).toLocaleString('cs-CZ')}\u00a0Kč`;
    if (n.celkemKc == null) return `od ${kc(n.provizeKc)}`;
    return n.plusBurza ? `od ${kc(n.celkemKc)}` : kc(n.celkemKc);
  };
  const pocet = totalCount.toLocaleString('cs-CZ');
  // Pravidlo č. 1: datum dat BEZ fallbacku na dnešek – když ho nejde načíst, čísla s datem se neukážou.
  // Datum CEN (předchozí obchodní den před stažením), ne den stažení – src/lib/datumCen.ts.
  const dataDate = posledniScrape && !Number.isNaN(new Date(posledniScrape).getTime()) ? datumCen(new Date(posledniScrape)) : null;
  // Pevné mezery: datum se nesmí rozlomit na „18. / 10. 2026“.
  const datumText = dataDate ? dataDate.toLocaleDateString('cs-CZ', { timeZone: 'UTC' }).replace(/ /g, '\u00a0') : null;
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
        {/* Stejná hlavička jako na ostatních stránkách (logo · navigace · hledání). Dřív tu hledání chybělo
            a navigace kvůli justify-between ujela doprava (revize kola 4). Hledání v hero zůstává. */}
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-700 text-white"><TrendingUp className="w-4 h-4" strokeWidth={2.5} /></span>
            ETF průvodce.cz
          </Link>
          <MobileMenu />
          <SiteNav />
          <HeaderSearch />
        </div>
      </header>

      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-12">
        {/* S1 HERO – co web dělá, hledání (rozumí češtině), dvě rovnocenné cesty (vím co hledám /
            nevím co koupit), řádek důvěry s datem. Vpravo další žebříčky (GA4: 25 % přechodů). */}
        <section data-sekce="hero" className="py-4 md:py-7">
          <div className="rounded-2xl bg-slate-900 text-white px-4 py-6 md:px-10 md:py-10 md:grid md:grid-cols-[minmax(0,1fr)_16rem] md:gap-12">
            <div className="min-w-0">
              <h1 className="text-[28px] md:text-[40px] font-bold tracking-tight leading-[1.1] text-balance">Srovnání ETF fondů s výnosy v korunách</h1>
              <p className="mt-3 max-w-2xl text-slate-300 text-base md:text-lg leading-relaxed text-pretty">
                {pocet} fondů – poplatky, velikost a výnosy přepočtené do Kč. Nezávisle, bez provizí a reklamy.
              </p>
              <div className="mt-5 md:mt-7">
                <HeroSearch priklady={['VWCE', 'S&P 500', 'zlato', 'dluhopisy']} />
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <Link href="/srovnani" className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 min-h-12 text-[15px] font-semibold text-white ring-1 ring-teal-500/40 hover:bg-teal-800 transition-colors">
                  Otevřít srovnávač fondů <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/vyber-etf" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 min-h-12 text-[15px] font-semibold text-white hover:bg-white/10 transition-colors">
                  Nevím, co koupit · 4 otázky
                </Link>
              </div>
              <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-slate-400">
                <Check className="w-3.5 h-3.5 text-teal-300" aria-hidden="true" />
                {datumText && <><span>Data k <strong className="font-semibold text-slate-200 tabular-nums">{datumText}</strong></span><span aria-hidden="true">·</span></>}
                <span>kurz ČNB</span><span aria-hidden="true">·</span><span>denní kontrola dat</span><span aria-hidden="true">·</span><span>bez provizí a reklamy</span>
              </p>
            </div>
            <nav aria-label="Oblíbené žebříčky ETF" className="hidden md:block relative md:mt-1">
              <p className="hidden md:block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Oblíbené žebříčky</p>
              {/* Mobil: vodorovný posuv s náznakem pokračování (mask fade vpravo). */}
              <ul className="flex md:flex-col gap-2 md:gap-0 overflow-x-auto px-4 md:px-0 pb-1 md:pb-0 [scrollbar-width:none] md:divide-y md:divide-white/10 [mask-image:linear-gradient(to_right,black_85%,transparent)] md:[mask-image:none]">
                {HERO_ZEBRICKY.map((z) => (
                  <li key={z.href} className="shrink-0">
                    <Link href={z.href} className="flex items-center justify-between gap-3 whitespace-nowrap rounded-full md:rounded-none bg-white/10 md:bg-transparent px-3.5 md:px-1 min-h-10 md:min-h-11 text-sm text-slate-300 hover:text-white hover:bg-white/20 md:hover:bg-white/5 transition-colors">
                      {z.label} <ArrowRight className="hidden md:block w-4 h-4 text-slate-500" />
                    </Link>
                  </li>
                ))}
                <li className="shrink-0">
                  <Link href="/zebricky" className="flex items-center justify-between gap-3 whitespace-nowrap rounded-full md:rounded-none bg-white/10 md:bg-transparent px-3.5 md:px-1 min-h-10 md:min-h-11 text-sm font-semibold text-teal-300 hover:text-teal-200">
                    Všech {CATEGORY_COUNT} žebříčků <ArrowRight className="w-4 h-4" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </section>

        {/* S2 TŘI POHLEDY PODLE TRHU – jádro srovnávače (ruční seznam fondů: src/data/trhyDvojcata.ts). */}
        {trhy && trhy.length > 0 && datumText && (
          <section data-sekce="trhy" className="pt-4 pb-12" aria-labelledby="h-trhy">
            <Nadpis id="h-trhy" meta={`data k ${datumText}`} podnadpis="Šest hlavních trhů, jen fondy na široké indexy.">
              Nejlevnější, největší a nejvýnosnější ETF
            </Nadpis>
            <TriPohledyTrhu radky={trhy} />
          </section>
        )}

        {/* S3 KTERÝM ETF ZAČÍT – 3 nejnavštěvovanější detaily fondů (GA4 90 dní). Výnos jako průměr
            ročně za 5 let (12 měsíců svádělo ke čtení „ETF vydělá 20 % ročně“ – test s uživateli). */}
        {starters.length > 0 && (
          <section data-sekce="zacit" className="pb-12" aria-labelledby="h-zacit">
            <Nadpis id="h-zacit" meta={datumText ? `data k ${datumText}` : undefined} podnadpis={`Nejčastěji otevírané fondy u nás – široce rozložené, levné a akumulační. Pro orientaci, ne jako doporučení.${starsiText ? ` U některého fondu jsou data starší (${starsiText}).` : ''}`}>
              Kterým ETF začít?
            </Nadpis>
            <div className="grid gap-3 md:grid-cols-3">
              {starters.map((etf) => {
                const meta = STARTER_META[etf.isin];
                const Icon = meta?.icon ?? Globe;
                const r5 = cerstvy(etf) && etf.return_5y_czk != null ? (Math.pow(1 + Number(etf.return_5y_czk) / 100, 1 / 5) - 1) * 100 : null;
                const dv = STARTER_DVOJICE[etf.isin];
                return (
                  <div key={etf.isin} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
                    <Link href={`/etf/${etf.isin}`} className="group flex items-start gap-3">
                      {emitentFondu(etf.name)
                        ? <EmitentLogo nazev={etf.name} size={40} className="rounded-xl" />
                        : <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl border border-slate-200 bg-white"><Icon className="w-5 h-5 text-teal-700" /></span>}
                      <span className="min-w-0">
                        <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">{meta?.tag}</span>
                        <span className="block text-base font-semibold text-slate-900 leading-snug group-hover:text-teal-800">{short(etf.name)} <span className="font-normal text-slate-500">· {etf.primary_ticker}</span></span>
                      </span>
                    </Link>
                    <p className="hidden md:block mt-2 flex-1 text-sm text-slate-600 leading-relaxed">{meta?.why}</p>
                    <dl className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-500">
                      <div><dt>Poplatek</dt><dd className="mt-0.5 text-base font-semibold text-slate-900 tabular-nums">{ter(etf.ter_numeric)}</dd></div>
                      <div><dt>Ø ročně 5 let v Kč</dt><dd className={`mt-0.5 text-base font-semibold tabular-nums ${r5 == null ? 'text-slate-500' : r5 >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{pct(r5)}</dd></div>
                      <div><dt>Velikost</dt><dd className="mt-0.5 text-base font-semibold text-slate-900 tabular-nums">{money(etf.fund_size_numeric, etf.fund_currency)}</dd></div>
                    </dl>
                    {dv && (
                      <Link href={dv.href} className="mt-2 inline-flex items-center gap-1 min-h-10 text-sm font-medium text-teal-700 hover:text-teal-800">
                        Srovnání {dv.label} <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Co dál – tři kroky (test s uživateli: chyběl krok od výběru k nákupu). */}
            <ol className="mt-4 flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
              <li className="sm:mr-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Jak začít</li>
              {[
                { href: '/srovnani', t: 'Vyberte fond', d: 've srovnávači nebo výše' },
                { href: '#brokeri', t: 'Otevřete účet u brokera', d: 'srovnání poplatků níže' },
                { href: '/jak-zacit', t: 'Nastavte pravidelný nákup', d: 'jak začít krok za krokem' },
              ].map((k, i) => (
                <li key={k.t} className="inline-flex items-center gap-2">
                  {i > 0 && <ArrowRight className="hidden sm:block w-4 h-4 text-slate-300" aria-hidden="true" />}
                  <Link href={k.href} className="inline-flex items-center gap-2 min-h-10 font-medium hover:text-teal-800">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-700 text-[11px] font-semibold text-white tabular-nums">{i + 1}</span> {k.t}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* S4 MODELOVÁ PORTFOLIA – s výkonností v Kč a datem; řazené podle rizika, krátké názvy,
            neutrální značení rizika (červený štítek působil jako chyba). */}
        <section data-sekce="portfolia" className="pb-12" aria-labelledby="h-portfolia">
          <Nadpis id="h-portfolia" meta={datumText ? `data k ${datumText}` : undefined} podnadpis="Hotová složení z konkrétních fondů a jak si vedla v korunách. Pro inspiraci, ne jako doporučení."
            odkaz={{ href: '/portfolio-strategie', text: 'Porovnat portfolia' }}>
            Modelová portfolia z ETF
          </Nadpis>
          <p className="-mt-2 mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500" aria-label="Legenda složení">
            {/* Kolo 5: legenda jen pro barvy, které jsou vidět – na mobilu jen ze 4 zobrazených portfolií. */}
            {Object.entries(BARVA_TRIDY).filter(([c]) => portfolia.some((p) => p.slozeni.some(([k]) => k === c))).map(([c, b]) => (
              <span key={c} className={`${portfolia.some((p) => PORTFOLIA_MOBIL.has(p.slug) && p.slozeni.some(([k]) => k === c)) ? 'inline-flex' : 'hidden md:inline-flex'} items-center gap-1.5`}><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b }} />{c}</span>
            ))}
          </p>
          {/* Řádkový přehled jako tabulka trhů (art director: mřížka 4+3 nechávala osiřelou kartu). */}
          <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
            <li className="hidden md:grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_7rem_7rem] gap-6 px-5 py-3 text-xs font-medium text-slate-500">
              <span>Portfolio a riziko</span><span>Složení</span><span className="text-right">12 měs. v Kč</span><span className="text-right">3 roky celkem</span>
            </li>
            {portfolia.map((p) => (
              <li key={p.slug} className={PORTFOLIA_MOBIL.has(p.slug) ? undefined : 'hidden md:block'}>
                <Link href={`/portfolio-strategie/${p.slug}`} className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_7rem_7rem] gap-x-6 gap-y-1.5 px-4 md:px-5 py-3 items-center hover:bg-teal-50/40 transition-colors">
                  <span className="min-w-0 flex items-center gap-3">
                    <span className="truncate text-[15px] font-semibold text-slate-900">{NAZEV_PORTFOLIA[p.slug] ?? p.name}</span>
                    <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-slate-500" title={`Riziko: ${p.risk}`}>
                      {[1, 2, 3].map((d) => <span key={d} className={`inline-block w-1.5 h-1.5 rounded-full ${d <= (RIZIKO_TECKY[p.risk] ?? 0) ? 'bg-slate-600' : 'bg-slate-200'}`} />)}
                      <span className="ml-0.5">{p.risk}</span>
                    </span>
                  </span>
                  <span className="order-3 md:order-none col-span-2 md:col-span-1 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`Složení: ${p.slozeni.map(([c, v]) => `${c} ${v} %`).join(', ')}`}>
                    {p.slozeni.map(([c, v]) => <span key={c} style={{ width: `${v}%`, backgroundColor: BARVA_TRIDY[c] ?? '#94a3b8' }} />)}
                  </span>
                  <span className={`order-2 md:order-none text-right text-base font-semibold tabular-nums ${p.return1y == null ? 'text-slate-500' : p.return1y >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {pct(p.return1y)}<span className="md:hidden block text-[11px] font-normal text-slate-500">12 měs.</span>
                  </span>
                  <span className={`hidden md:block text-right text-base font-semibold tabular-nums ${p.return3y == null ? 'text-slate-500' : p.return3y >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {p.return3y == null ? <span className="text-xs font-normal">kratší historie</span> : pct(p.return3y)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {/* Mobil ukazuje 4 ze 7 (záměr) – zbytek přiznat odkazem, jako u brokerů (kolo 5). */}
          {portfolia.length > PORTFOLIA_MOBIL.size && (
            <Link href="/portfolio-strategie" className="md:hidden mt-2 inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-teal-700 hover:text-teal-800">
              Další {portfolia.length - portfolia.filter((p) => PORTFOLIA_MOBIL.has(p.slug)).length} portfolia a srovnání <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </section>

        {/* S5 KDE ETF KOUPIT – loga, ověřené poplatky (CENIKY_OVERENY), abecedně, bez skóre (majitel 19. 10. 2026). */}
        <section id="brokeri" data-sekce="brokeri" className="pb-12 scroll-mt-20" aria-labelledby="h-brokeri">
          <Nadpis id="h-brokeri" meta={`ceníky ověřeny ${new Date(CENIKY_OVERENY).toLocaleDateString('cs-CZ').replace(/ /g, ' ')}`} podnadpis="Seřazeno abecedně. Nebereme provize ani reklamu."
            odkaz={{ href: '/kde-koupit', text: 'Srovnání brokerů' }}>
            Kde ETF koupit
          </Nadpis>
          <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
            <li className="hidden sm:grid sm:grid-cols-[13rem_minmax(0,1fr)_minmax(0,1fr)_9rem] gap-6 px-5 py-3 text-xs font-medium text-slate-500">
              <span>Broker</span><span>Pro koho</span><span>Poplatky (nákup ETF, směna)</span>
              <span className="text-right"><InfoTip label={`Poplatek za nákup ETF na Xetře + směna korun na eura${kurzy ? ` (kurz ČNB k ${datumKurzu(kurzy)})` : ''}. „od“ = část nákladu ceník neuvádí.`}>Nákup za 2 000 Kč</InfoTip></span>
            </li>
            {HOME_BROKERS.map(({ id, forWhom, poplatek, broker, robo }, bi) => (
              <li key={id} className={bi >= 4 ? 'hidden sm:block' : undefined}>
                <Link href={reviewHref[id] ?? '/kde-koupit'} className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[13rem_minmax(0,1fr)_minmax(0,1fr)_9rem] gap-x-6 gap-y-1 px-4 sm:px-5 py-3 items-center hover:bg-teal-50/40 transition-colors">
                  <span className="flex items-center gap-2 min-w-0">
                    {/* Wordmark brokera v jednotném rámečku (obsahuje jméno → bez duplicitního textu); Fio má
                        logo bez čitelného názvu a Portu jen provizorní → jméno textem. */}
                    {/* Jeden režim: čtvercová ikona brokera + jméno (art director: nemíchat škálu ani wordmarky). */}
                    <span className="flex items-center justify-center w-8 h-8 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
                      {LOGO_BROKERA[id]
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={LOGO_BROKERA[id]} alt="" loading="lazy" className="w-full h-full object-contain" />
                        : <span aria-hidden="true" className="text-xs font-bold text-slate-600">{broker!.name.charAt(0)}</span>}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 truncate">{broker!.name}</span>
                    {robo && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">robo-poradce</span>}
                  </span>
                  <span className="hidden sm:block text-sm text-slate-600">{forWhom}</span>
                  {/* Nákup + směna měny u všech (test s uživateli: XTB bez 0,5 % za směnu vypadal nejlevnější). */}
                  <span className="order-3 sm:order-none col-span-2 sm:col-span-1 text-sm text-slate-700">
                    {poplatek.hodnota}{poplatek.popisek === 'Vše v ceně' && <span className="text-slate-500"> (vše v ceně)</span>}
                    <span className="block text-xs text-slate-500">Směna měny: {poplatek.smena}</span>
                  </span>
                  <span className="order-2 sm:order-none text-right text-base font-semibold tabular-nums text-slate-900 whitespace-nowrap" title={robo ? 'Robo-poradce účtuje roční poplatek ze spravované částky, ne poplatek za nákup' : undefined}>
                    {robo ? <span className="text-slate-500">—</span> : nakup2000(id)}
                    <span className="sm:hidden block text-[11px] font-normal text-slate-500">{robo ? 'roční poplatek' : 'nákup za 2 000 Kč'}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap gap-x-6">
            <Link href="/kde-koupit" className="sm:hidden inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-teal-700 hover:text-teal-800">Další {HOME_BROKERS.length - 4} ({HOME_BROKERS.slice(4).map((x) => x.broker!.name).join(', ')}) a srovnání <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/kde-koupit#metodika" className="inline-flex items-center gap-1 min-h-11 text-sm font-medium text-teal-700 hover:text-teal-800">Jak srovnáváme <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>

        {/* S6 ČASTÉ OTÁZKY */}
        <section data-sekce="faq" className="pb-6" aria-labelledby="h-faq">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
          <Nadpis id="h-faq" odkaz={{ href: '/pruvodce', text: 'Celý průvodce' }}>Časté otázky o ETF</Nadpis>
          <div className="grid md:grid-cols-2 gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white">
                <summary className="flex items-center justify-between gap-3 px-4 min-h-12 py-3 cursor-pointer list-none">
                  <span className="text-[15px] font-semibold text-slate-900">{f.q}</span>
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

/** Jednotná hlavička sekce (art director 18. 10. 2026): odkaz vždy vpravo na úrovni nadpisu,
    podnadpis a datum vždy v jednom řádku pod ním. */
function Nadpis({ id, children, meta, podnadpis, odkaz }: {
  id: string; children: ReactNode; meta?: string; podnadpis?: string; odkaz?: { href: string; text: string };
}) {
  return (
    <div className="mb-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className="text-2xl md:text-[28px] font-semibold tracking-tight leading-tight text-balance">{children}</h2>
        {odkaz && <Link href={odkaz.href} className="shrink-0 hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-800">{odkaz.text} <ArrowRight className="w-4 h-4" /></Link>}
      </div>
      {(podnadpis || meta) && (
        <p className="mt-1.5 text-[15px] text-slate-600 text-pretty">
          {podnadpis}{podnadpis && meta && ' '}{meta && <span className="whitespace-nowrap text-sm text-slate-500">· {meta}</span>}
        </p>
      )}
      {odkaz && <Link href={odkaz.href} className="sm:hidden mt-1 inline-flex items-center gap-1 min-h-10 text-sm font-semibold text-teal-700">{odkaz.text} <ArrowRight className="w-4 h-4" /></Link>}
    </div>
  );
}
