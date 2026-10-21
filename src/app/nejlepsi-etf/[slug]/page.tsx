import { Metadata } from 'next';
import { cache as reactCache } from 'react';
import Link from 'next/link';
import HeaderSearch from '@/components/design-preview/HeaderSearch';
import { notFound } from 'next/navigation';
import MobileMenu from '@/components/design-preview/MobileMenu';
import SiteNav from '@/components/design-preview/SiteNav';
import {
  TrendingUp, ArrowRight, ArrowLeft, Trophy, Coins, AlertTriangle,
  Wallet, BookOpen, ChevronDown, ListChecks,
} from 'lucide-react';
import {
  getTopETFsForCategory, getCategoryCount, getFlagshipComposition, categoryConfigs, getVyberKarty,
  type ETFBasicInfo, getDataDatum, inceptionYear,
} from '@/lib/etf-data';
import { datumCen } from '@/lib/datumCen';
import { titulekZebricku, popisekZebricku, odpovedZebricku, type DataZebricku, type FondSeo } from '@/lib/zebrickySeo';
import { porovnejNejlevnejsi } from '@/lib/trhy';
import { ter, money, shortName, nbsp, SectionHead, CompositionInfographic, CategoryIndexes, slozeniPouzitelne } from '@/components/design-preview/CategoryUI';
import { getCategoryContent, categoryLead } from '@/components/design-preview/categoryContent';
import { FaqSeznam } from '@/components/design-preview/brokerUI';
import InfoTip from '@/components/design-preview/InfoTip';
import AktualnostDat, { nejstarsiDatum } from '@/components/design-preview/AktualnostDat';
import { topIndexesForCategory, topBondFamilies } from '@/components/design-preview/indexDescriptions';
import CompareButton from '@/components/design-preview/CompareButton';
import EmitentLogo from '@/components/home/EmitentLogo';
import TabulkaFondu, { type RadekFondu } from '@/components/zebricky/TabulkaFondu';
import SouvisejiciZebricky from '@/components/design-preview/SouvisejiciZebricky';
import { SOUVISEJICI, RADKU_TABULKY_VYCHOZI } from '@/lib/zebrickySouvisejici';
import { HEAD_MIN_SIZE } from '@/lib/etf-head';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';
import { zobrazovanyTicker } from '@/lib/ticker';
import { detectHedging } from '@/utils/hedgingDetection';
import { tridaFondu, tridaText, jeSvycarskyFond } from '@/lib/nazevFondu';
import { distKind } from '@/utils/distribution';

export const revalidate = 86400;
export const dynamicParams = true;

/** Kolik fondů posíláme do tabulky (největší napřed). Větší kategorie (dluhopisy, akcie) odkazují
 *  na srovnávač – stovky řádků v HTML by stránku zpomalily a nikdo je nečte. */
const MAX_V_TABULCE = 300;

/**
 * Kterou dimenzi složení preferovat v infografice podle typu kategorie.
 * Sektorové/tematické kategorie ukážou top pozice (co konkrétně držíte),
 * ostatní geografické rozložení. Fallback řeší sama komponenta.
 */
function preferredDimension(slug: string): 'country' | 'sector' | 'holding' {
  const holdingFirst = [
    'technologicke', 'ai-', 'nasdaq', 'cloud', 'robotika', 'kyberbezpecnost',
    'healthcare', 'biotechnologie', 'financni', 'energeticke', 'prumyslove',
    'spotrebitelske', 'infrastrukturni', 'defense', 'clean-energy',
    'obnovitelne', 'realitni', 'nemovitostni', 'value', 'growth', 'small-cap',
    'dividendove', 'ai-etf', 'kyber',
  ];
  if (holdingFirst.some((k) => slug.includes(k))) return 'holding';
  return 'country';
}

/* Kategorie, u kterých dává smysl odkázat na pilíř „Světové ETF – který index“
   (porovnání MSCI World / FTSE All-World / ACWI / S&P 500 napříč žebříčky).
   Silo: pilíř = hub „který index“, žebříček = užší seznam pro daný index. */
const WORLD_INDEX_SLUGS = new Set([
  'nejlepsi-celosvetove-etf', 'nejlepsi-msci-world-etf', 'nejlepsi-sp500-etf',
  'nejlepsi-americke-etf', 'nejlepsi-evropske-etf', 'nejlepsi-emerging-markets-etf',
  'nejlepsi-technologicke-etf', 'nejlevnejsi-etf',
]);

/* Proklik do srovnávače s předvyplněným filtrem – jen tam, kde filtr srovnávače odpovídá kategorii
   (index = kanonický název z src/utils/indexNormalization.ts, kat = třída aktiv). Jinde obecný odkaz. */
const SROVNAVAC: Record<string, { q: string; text: string }> = {
  'nejlepsi-sp500-etf': { q: `index=${encodeURIComponent('S&P 500')}`, text: 'Fondy na S&P 500 ve srovnávači' },
  'nejlepsi-msci-world-etf': { q: `index=${encodeURIComponent('MSCI World')}`, text: 'Fondy na MSCI World ve srovnávači' },
  'nejlepsi-nasdaq-etf': { q: `index=${encodeURIComponent('Nasdaq 100')}`, text: 'Fondy na Nasdaq-100 ve srovnávači' },
  'nejlepsi-akciove-etf': { q: 'kat=Akcie', text: 'Všechny akciové fondy ve srovnávači' },
  'nejlepsi-dluhopisove-etf': { q: 'kat=Dluhopisy', text: 'Všechny dluhopisové fondy ve srovnávači' },
  'nejlepsi-komoditni-etf': { q: 'kat=Komodity', text: 'Všechny komoditní fondy ve srovnávači' },
};

/* Související průvodce a analýzy (SEO audit kola 6): žebříček = srovnání VŠECH fondů („nejlepší S&P 500 ETF“),
   /jaky-sp500-etf = průvodce výběrem mezi hlavními fondy („jaký S&P 500 ETF vybrat“) – prolinkované obousměrně,
   ať si stránky nekonkurují. Faktorové analýzy (/faktorove-etf/*) měly jen po jednom interním odkazu. */
const SOUVISI: Record<string, { href: string; text: string }[]> = {
  'nejlepsi-sp500-etf': [{ href: '/jaky-sp500-etf', text: 'Jaký S&P 500 ETF vybrat: CSPX, VUAA, SPYL, nebo VUSA?' }],
  'nejlepsi-value-etf': [{ href: '/faktorove-etf/value', text: 'Value faktor v datech: jak si vedl v korunách' }],
  'nejlepsi-small-cap-etf': [{ href: '/faktorove-etf/small-cap', text: 'Malé firmy (small cap) v datech: výnos a propady v korunách' }],
  'nejlepsi-dividendove-etf': [{ href: '/faktorove-etf/dividendove-akcie', text: 'Dividendové akcie v datech: výnos v korunách' }],
};

/** Varianty indexu s jinou metodikou – nevyhrávají „nejvyšší výnos“ (liší se metodikou, ne kvalitou fondu;
 *  revize 18. 10. 2026: v S&P 500 vyhrával „S&P 500 Leaders“). */
const VARIANTA = /\b(ESG|SRI|Screened|Scored|Leaders|Paris|Climate|PAB|CTB|Equal Weight|Hedged|Islamic|Active|Enhanced)\b/i;

/** Měna zajištění třídy fondu („EUR“…), „ano“ = zajištěná bez poznané měny, null = nezajištěná.
 *  JEDNA funkce pro celý web (src/utils/hedgingDetection.ts) – stejná jako srovnávač a porovnání. */
function zajisteni(nazev: string): string | null {
  const h = detectHedging(nazev);
  return h.isHedged ? h.hedgedCurrency ?? 'ano' : null;
}

/** Krátký název fondu: bez „UCITS ETF…“ a koncové závorky. (shortName z CategoryUI maže všechno od první
 *  závorky po poslední – „UBS ETF (CH) Gold (USD) A-dis“ pak bylo „UBS ETF A-dis“.) */
function nazevFondu(n: string): string {
  let k = n.replace(/\s+UCITS\b.*$/i, '')
    // Kolo 6: švýcarské fondy nemají „UCITS“ – třída na konci zůstávala („UBS ETF (CH) Gold (USD) A-dis“,
    // „Swisscanto (CH) Gold ETF EA EUR“). Kód třídy pryč; měnu a zajištění ukazuje druhý řádek / „· USD“.
    .replace(/\s+(?:ETF|ETC|ETP)\s+EAH?\s+[A-Z]{3}\b.*$/, '')
    .replace(/\s+[AIUE]-(?:acc|dis)\s*$/i, '');
  for (let i = 0; i < 3; i++) k = k.replace(/\s+(?:hedged\s+)?\((?:USD|EUR|CHF|GBP|JPY)\)\s*$/i, '');
  k = k.replace(/\s+\([^()]*\)\s*$/, '').replace(/\bETF\s+\(CH\)/, '(CH)').trim();
  return k || n;
}

/** Krátké názvy pro tabulku: když dva fondy vyjdou stejně (6× „UBS MSCI ACWI SF“), připojí se měna třídy.
 *  Kolo 5 (19. 10. 2026): dřív syrový konec názvu („· 1C“, „· 4C“, „· USD acc“ vs „· USD Acc“, „· USD Ukdis“).
 *  Teď normalizovaně ze sdílené funkce (src/lib/nazevFondu.ts): v názvu jen měna třídy, výplatu (akumulační/
 *  distribuční) a měnové zajištění ukazuje druhý řádek; kód třídy se neukazuje. Revize kola 2: řádky nešly odlišit. */
function kratkeNazvy(fondy: { name: string; distribution_policy?: string | null; ticker?: string | null }[]): string[] {
  const kratke = fondy.map((f) => nazevFondu(f.name));
  const duplicity = (xs: string[]) => {
    const pocet = new Map<string, number>();
    xs.forEach((k) => pocet.set(k, (pocet.get(k) ?? 0) + 1));
    return (k: string) => (pocet.get(k) ?? 0) > 1;
  };
  // 1) měna třídy („· USD“), 2) celá třída – výplata, měna, zajištění („· Acc · USD“, „· Dist · zajištěno do EUR“),
  // 3) ticker. SEO audit 6b: 5× „UBS MSCI ACWI SF“, 2× „… · USD“ se v tabulce nedaly rozlišit.
  const dupl1 = duplicity(kratke);
  const krok1 = kratke.map((k, i) => {
    if (!dupl1(k)) return k;
    const mena = tridaFondu(fondy[i].name).mena;
    return mena ? `${k}\u00a0· ${mena}` : k;
  });
  const dupl2 = duplicity(krok1);
  const krok2 = krok1.map((k, i) => {
    if (!dupl2(k)) return k;
    const t = tridaText(tridaFondu(fondy[i].name, fondy[i].distribution_policy));
    return t ? `${kratke[i]}\u00a0· ${t}` : k;
  });
  const dupl3 = duplicity(krok2);
  return krok2.map((k, i) => (dupl3(k) && fondy[i].ticker ? `${k} (${fondy[i].ticker})` : k));
}

/** Indexové kategorie: fondy sledují STEJNÝ podklad (index, kov, bitcoin) a liší se hlavně poplatkem a třídou.
 *  „Nejvýkonnější“ by tu ukazoval šum (rozdíl 1–2 p. b. mezi třídami) – místo něj neutrální „Jak vybrat“. */
/** Široké smíšené žebříčky: karta „Nejvýkonnější“ ZÁMĚRNĚ chybí (ZAMERNA-ROZHODNUTI.md, kolo 6) – vyhrávaly úzké
 *  sektorové sázky (polovodiče +228 %, konvertibilní dluhopisy +45 %) a první velké zelené číslo působilo jako tip. */
const BEZ_VYKONU = new Set(['nejlepsi-etf-2026', 'nejlepsi-akciove-etf', 'nejlepsi-dluhopisove-etf']);

/** Žebříčky, kde se v jedné tabulce míchají akcie s dluhopisy, komoditami a peněžním trhem → štítek typu v řádku
 *  (SEO audit 6b, Markéta: v „Nejlepší ETF 2026“ nebylo poznat, že zlato je ETC a XEON peněžní trh). */
const SMISENE = new Set(['nejlepsi-etf-2026', 'nejlevnejsi-etf', 'nejlepsi-akumulacni-etf', 'nejlepsi-distribucni-etf', 'nejlepsi-esg-etf']);
function druhProduktu(kategorie: string | null | undefined, nazev: string): string | null {
  switch (kategorie) {
    case 'Komodity': return /\bUCITS\b/i.test(nazev) ? 'komodity' : 'ETC';
    case 'Krypto': return 'krypto ETP';
    case 'Peněžní trh': return 'peněžní trh';
    case 'Dluhopisy': return 'dluhopisy';
    case 'Nemovitosti': return 'nemovitosti';
    default: return null;
  }
}

/** Práh velikosti pro karty „Vybrané podle dat“ – stejný jako homepage (MIN_VELIKOST_VITEZE v src/lib/trhy.ts). */
const PRAH_KARET = 100;

/** Burza pro rozlišení stejného tickeru („GOLD“ = Amundi Physical Gold na Euronextu i EUWAX Gold ve Stuttgartu). */
function burzaTickeru(e: Record<string, unknown>, ticker: string): string | null {
  for (let i = 1; i <= 10; i++) {
    if (String(e[`exchange_${i}_ticker`] ?? '').trim() !== ticker) continue;
    const b = String(e[`exchange_${i}_name`] ?? '').trim();
    if (!b) continue;
    return b.replace(/^Euronext\s+/i, '').replace(/\s+Stock Exchange$/i, '').replace(/^London$/, 'Londýn')
      .replace(/^Borsa Italiana$/i, 'Milán').replace(/^SIX Swiss Exchange$/i, 'SIX').replace(/^XETRA$/i, 'Xetra');
  }
  return null;
}

/** Ticker pro žebříček: když stejný ticker mají v jednom žebříčku různé fondy, připojí se burza (kolo 6). */
function tickeryBezDuplicit(fondy: ETFBasicInfo[]): Map<string, string | null> {
  const tk = fondy.map((e) => zobrazovanyTicker(e as unknown as Record<string, unknown>));
  const kolik = new Map<string, number>();
  tk.forEach((t) => { if (t) kolik.set(t, (kolik.get(t) ?? 0) + 1); });
  return new Map(fondy.map((e, i) => {
    const t = tk[i];
    if (!t || (kolik.get(t) ?? 0) < 2) return [e.isin, t];
    const b = burzaTickeru(e as unknown as Record<string, unknown>, t);
    return [e.isin, b ? `${t} (${b})` : `${t} · ${e.isin}`];
  }));
}

const INDEXOVE: Record<string, 'akcie' | 'komodita' | 'krypto'> = {
  'nejlepsi-sp500-etf': 'akcie', 'nejlepsi-msci-world-etf': 'akcie', 'nejlepsi-nasdaq-etf': 'akcie',
  'nejlepsi-celosvetove-etf': 'akcie', 'nejlepsi-dax-etf': 'akcie', 'nejlepsi-stoxx600-etf': 'akcie', 'nejlepsi-ftse100-etf': 'akcie',
  'nejlepsi-zlato-etf': 'komodita', 'nejlepsi-stribro-etf': 'komodita', 'nejlepsi-bitcoin-etf': 'krypto',
};

/** Riziko „Hlavička: podrobnosti…“ → [hlavička, zbytek]. Hlavička jde do krátkého bodu, zbytek do rozbalení. */
function rozdelRiziko(t: string): [string, string] {
  const m = t.match(/^(.{8,90}?)(?::\s|\s[–-]\s|\.\s)([\s\S]+)$/);
  if (!m) return [t, ''];
  const zbytek = m[2].trim();
  return [m[1].trim(), zbytek.charAt(0).toUpperCase() + zbytek.slice(1)];
}

/** „Jak vybrat mezi fondy na stejný index“ – fakta, ne doporučení. Desktop: karta se seznamem.
 *  Mobil: jeden kompaktní rozbalovací řádek („1 TER · 2 velikost · …“), ať tabulka začíná výš. */
function JakVybrat({ druh }: { druh: 'akcie' | 'komodita' | 'krypto' }) {
  const nadpis = druh === 'akcie' ? 'Jak vybrat mezi fondy na stejný index' : 'Jak vybrat mezi produkty na stejný podklad';
  const body: [string, string, React.ReactNode][] = [
    ['TER', 'Poplatek (TER)', 'strhává se každý rok z hodnoty fondu'],
    ['velikost', 'Velikost fondu', 'spravovaný majetek; malé fondy správci ruší častěji'],
    druh === 'akcie'
      ? ['akum./dist.', 'Akumulační, nebo distribuční', 'dividendy fond reinvestuje, nebo vyplácí']
      : druh === 'krypto'
        // SEO audit 6b (Markéta): u bitcoinu rozhoduje krytí a úschova, ne měnové zajištění.
        ? ['krytí', 'Krytí, úschova a emitent', 'zda je produkt krytý skutečným bitcoinem, kdo ho uschovává a kdo produkt vydává (ETP je dluhový cenný papír emitenta)']
        : ['zajištění', 'Zajištěná, nebo nezajištěná třída', 'zajištění tlumí kurz dolaru (ne koruny)'],
    ['kde koupit', 'Kde ho koupíte', <>ne každý broker má každý fond. <Link href="/kde-koupit" className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800">Kde koupit</Link></>],
  ];
  const cislo = (i: number) => (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-teal-800 ring-1 ring-slate-200">{i + 1}</span>
  );
  const seznam = (
    <ol className="space-y-1.5 text-sm text-slate-700">
      {body.map(([, co, proc], i) => (
        <li key={co} className="flex gap-2">{cislo(i)}<span><span className="font-medium text-slate-900">{co}</span> – {proc}</span></li>
      ))}
    </ol>
  );
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/70" data-sekce="jak-vybrat">
      <details className="group md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-2.5">
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600"><ListChecks className="w-3.5 h-3.5 shrink-0" /> {nadpis}</span>
            <span className="mt-0.5 block truncate text-[13px] text-slate-700">{body.map(([k], i) => `${i + 1} ${k}`).join(' · ')}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
        </summary>
        <div className="px-3.5 pb-3">{seznam}</div>
      </details>
      <div className="hidden md:block p-5">
        <h3 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600"><ListChecks className="w-3.5 h-3.5" /> {nadpis}</h3>
        {seznam}
      </div>
    </div>
  );
}

const median = (xs: number[]): number | null => {
  if (!xs.length) return null;
  const a = [...xs].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
};

const num = (v: unknown): number | null => (v == null || Number.isNaN(Number(v)) ? null : Number(v));
const fmtDatum = (d: Date) => d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
const pctKc = (v: number | null) =>
  v == null ? '—' : `${v > 0 ? '+' : v < 0 ? '\u2212' : ''}${Math.abs(v).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\u00a0%`;
/** Skloňování „fond“ (1 fond, 2–4 fondy, 5+ fondů). */
const fondu = (n: number) => (n === 1 ? 'fond' : n >= 2 && n <= 4 ? 'fondy' : 'fondů');

export function generateStaticParams() {
  return Object.keys(categoryConfigs).map((slug) => ({ slug }));
}

/** Data žebříčku – JEDNOU za render (React cache): generateMetadata i stránka čtou stejné dotazy a stejný výpočet karet,
 *  takže titulek/popisek nemůžou ukázat jiné číslo než stránka a metadata nepřidávají žádný dotaz (free tier). */
const nactiZebricek = reactCache(async (slug: string) => {
  const cfg = categoryConfigs[slug];
  const [all, pocetDb, dataDatum] = await Promise.all([
    getTopETFsForCategory({ ...cfg, limit: MAX_V_TABULCE }),
    getCategoryCount(cfg),
    getDataDatum(),
  ]);
  const etfs = all.filter((e) => e.ter_numeric != null || e.fund_size_numeric != null);
  // Počet fondů v kategorii: z DB (count), jinak aspoň kolik jsme načetli – nikdy nevymyšlený.
  const celkem = Math.max(pocetDb ?? 0, etfs.length);
  const prah = cfg.filters.minFundSize ?? 10;

  // Výběr podle dat: největší, nejlevnější, nejvýkonnější za 3 roky (při nedostatku 3R dat za 1 rok).
  const bySize = [...etfs].filter((e) => e.fund_size_numeric != null).sort((a, b) => (b.fund_size_numeric! - a.fund_size_numeric!));
  const indexova = INDEXOVE[slug];
  // „Nejvýkonnější“ jen u kategorií s různými podklady (sektory, regiony…), ne u indexových a širokých smíšených.
  const sVykonem = !indexova && !BEZ_VYKONU.has(slug);
  // Kolo 6: karty z CELÉ kategorie, ne z 300 načtených fondů. Když tabulka nenese všechno (velké kategorie,
  // žebříček řazený podle TER), načtou se kandidáti zvlášť lehkým dotazem – práh je vždy 100 mil. €.
  const castecneNacteno = celkem > etfs.length || cfg.sortBy === 'ter_numeric';
  const vyberDb = castecneNacteno ? await getVyberKarty(cfg, PRAH_KARET, sVykonem) : null;
  // Švýcarské fondy (sídlo CH, jeSvycarskyFond) se na karty nevybírají – v tabulce zůstávají se štítkem (SEO audit 6b).
  const mimoCH = (xs: ETFBasicInfo[]) => xs.filter((e) => !jeSvycarskyFond(e.isin, e.name));
  const zdrojLevne = castecneNacteno ? (vyberDb?.levne ?? []) : mimoCH(etfs);
  const zdrojVykon = castecneNacteno ? (vyberDb?.vsechny ?? []) : mimoCH(etfs);
  const nejvetsi = castecneNacteno ? (vyberDb?.nejvetsi ?? null) : (mimoCH(bySize)[0] ?? null);
  const nejvetsiJeCH = castecneNacteno ? !!vyberDb?.nejvetsiJeCH : !!bySize[0] && jeSvycarskyFond(bySize[0].isin, bySize[0].name);
  // Nejvýkonnější: jen „čisté“ třídy (ne ESG/Screened/Leaders, ne měnově zajištěné – liší se metodikou nebo
  // měnou, ne kvalitou fondu) a fondy ≥ 100 mil. €. Momentum za 12 měsíců je u indexových kategorií spíš
  // šum (revize 18. 10. 2026) → primárně 3 roky v Kč, když je má aspoň 3 fondy.
  const jeEsgKategorie = /esg|udrzitel|klima|zajist|hedg|equal|stejne-vah/i.test(slug);
  const kandidati = zdrojVykon.filter((e) => (e.fund_size_numeric ?? 0) >= PRAH_KARET && (jeEsgKategorie || (!VARIANTA.test(e.name) && !zajisteni(e.name))));
  // Nejnižší poplatek = PRAVIDLO HOMEPAGE (porovnejNejlevnejsi v src/lib/trhy.ts): nejnižší TER > 0, při shodě
  // akumulační třída, pak větší fond; jen fondy nad 100 mil. € a bez měnového zajištění.
  const jeZajistKategorie = /zajist|hedg/i.test(slug);
  const proPravidlo = (e: ETFBasicInfo) => ({ ter: e.ter_numeric, acc: distKind(e.distribution_policy) === 'acc', velikost: e.fund_size_numeric });
  const byTer = zdrojLevne
    .filter((e) => e.ter_numeric != null && e.ter_numeric > 0 && (e.fund_size_numeric ?? 0) >= PRAH_KARET && (jeZajistKategorie || !zajisteni(e.name)))
    .sort((a, b) => porovnejNejlevnejsi(proPravidlo(a), proPravidlo(b)));
  const stejnyTer = byTer[0] ? byTer.filter((e) => e !== byTer[0] && e.ter_numeric === byTer[0].ter_numeric).length : 0;
  const s3 = kandidati.filter((e) => e.return_3y_czk != null);
  const vykonObdobi: '3y' | '1y' = s3.length >= 3 ? '3y' : '1y';
  const byPerf = (vykonObdobi === '3y' ? s3 : kandidati.filter((e) => e.return_1y_czk != null))
    .sort((a, b) => vykonObdobi === '3y' ? (b.return_3y_czk! - a.return_3y_czk!) : (b.return_1y_czk! - a.return_1y_czk!));
  const hodnotaVykonu = (e: ETFBasicInfo) => (vykonObdobi === '3y' ? e.return_3y_czk : e.return_1y_czk)!;
  const medianVykonu = sVykonem && byPerf[0] ? median(byPerf.map(hodnotaVykonu)) : null;

  // „TER od“ (titulek) = nejnižší TER > 0 v CELÉ kategorii – jen když ho z načtených dat umíme ověřit:
  // celá kategorie v tabulce, žebříček řazený podle TER (první řádek), nebo práh žebříčku ≥ 100 mil. €
  // (pak lehký dotaz karet nese nejlevnější fondy celé kategorie). Jinak null → v titulku chybí.
  const terKladne = (xs: ETFBasicInfo[]) => xs.map((e) => e.ter_numeric).filter((t): t is number => t != null && t > 0);
  const terOd = !castecneNacteno ? (terKladne(etfs).length ? Math.min(...terKladne(etfs)) : null)
    : cfg.sortBy === 'ter_numeric' && cfg.sortOrder === 'asc' && cfg.filters.minTer === 0 ? (terKladne(etfs.slice(0, 1))[0] ?? null)
    : prah >= PRAH_KARET && vyberDb ? (terKladne(vyberDb.levne).length ? Math.min(...terKladne(vyberDb.levne)) : null)
    : null;

  return {
    cfg, etfs, pocetDb, celkem, prah, dataDatum, bySize, indexova, sVykonem, nejvetsi, nejvetsiJeCH, jeEsgKategorie,
    byTer, stejnyTer, vykonObdobi, byPerf, hodnotaVykonu, medianVykonu, terOd,
  };
});

type Zebricek = Awaited<ReturnType<typeof nactiZebricek>>;

/** Fond pro titulek/popisek/odpověď: krátký název, ticker a den, ke kterému platí jeho data. */
const fondSeo = (e: ETFBasicInfo): FondSeo => ({
  nazev: nazevFondu(e.name),
  ticker: zobrazovanyTicker(e as unknown as Record<string, unknown>),
  datum: e.scraping_date ? datumCen(new Date(e.scraping_date)) : null,
});

/** Vstup pro src/lib/zebrickySeo.ts – jen čísla, která stránka sama ukazuje. */
function dataSeo(z: Zebricek): DataZebricku {
  const L = z.byTer[0];
  const V = z.nejvetsi;
  return {
    nazev: z.cfg.title,
    datum: z.dataDatum,
    celkem: z.celkem,
    prah: z.prah,
    terOd: z.terOd,
    nejlevnejsi: L && L.ter_numeric != null ? { ...fondSeo(L), ter: L.ter_numeric, stejnyTer: z.stejnyTer } : null,
    nejvetsi: V ? { ...fondSeo(V), velikost: num(V.fund_size_numeric), r1Kc: num(V.return_1y_czk), mimoCH: z.nejvetsiJeCH } : null,
    median: z.medianVykonu != null ? { hodnota: z.medianVykonu, obdobi: z.vykonObdobi, pocet: z.byPerf.length, bezVariant: !z.jeEsgKategorie } : null,
    prahKaret: PRAH_KARET,
  };
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const cfg = categoryConfigs[slug];
  if (!cfg) return { title: 'Žebříček ETF', robots: { index: false, follow: false } };
  const d = dataSeo(await nactiZebricek(slug));
  return {
    // Absolutní titulek: značku webu přidává titulekZebricku jen tam, kde se vejde do ~65 znaků.
    title: { absolute: titulekZebricku(d) },
    description: popisekZebricku(d) ?? (cfg.metaDescription || cfg.description),
    alternates: { canonical: `/nejlepsi-etf/${slug}` },
  };
}

export default async function CategoryDetailPreview(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const cfg = categoryConfigs[slug];
  if (!cfg) notFound();

  const z = await nactiZebricek(slug);
  const {
    etfs, pocetDb, celkem, prah, bySize, indexova, sVykonem, nejvetsi, jeEsgKategorie,
    byTer, stejnyTer, vykonObdobi, byPerf, hodnotaVykonu, medianVykonu,
  } = z;
  // Datum dat: bez tichého fallbacku na dnešek (pravidlo č. 1) – když se nenačte, štítek „Data k“ chybí.
  const dataDate = z.dataDatum;
  const content = getCategoryContent(slug);
  const nejstarsi = nejstarsiDatum(etfs);
  const datumText = dataDate ? fmtDatum(dataDate) : '—';
  const prahText = `${PRAH_KARET} mil. €`;
  const dalsiFondy = (n: number) => (n === 1 ? 'další fond' : n <= 4 ? 'další fondy' : 'dalších fondů');
  // GEO „odpověď nahoře“: 2–3 věty z dat stránky s datem (src/lib/zebrickySeo.ts).
  const odpoved = odpovedZebricku(dataSeo(z));
  const souvisi = SOUVISI[slug] ?? [];

  const recos: { tag: string; icon: typeof Trophy; etf: ETFBasicInfo; hodnota: string; popis: string; pravidlo?: string }[] = [];
  const KRATCE: Record<string, string> = { 'Největší fond': 'Největší', 'Nejnižší poplatek': 'Nejlevnější' };
  const pushReco = (tag: string, icon: typeof Trophy, etf: ETFBasicInfo | null | undefined, hodnota: string, popis: string, pravidlo?: string) => {
    if (!etf) return;
    const uz = recos.find((r) => r.etf.isin === etf.isin);
    // Kolo 6: když je nejvýkonnější zároveň největší (finanční ETF), karta se nezahodí – dostane oba štítky.
    if (uz) {
      uz.tag = `${KRATCE[uz.tag] ?? uz.tag} i ${tag.toLowerCase()}`;
      uz.pravidlo = [uz.pravidlo, `${tag}: ${hodnota.replace(/ /g, ' ')} ${popis}. ${pravidlo ?? ''}`.trim()].filter(Boolean).join(' ');
      return;
    }
    recos.push({ tag, icon, etf, hodnota, popis, pravidlo });
  };
  pushReco('Největší fond', Trophy, nejvetsi, nejvetsi ? money(nejvetsi.fund_size_numeric) : '', 'spravovaný majetek',
    z.nejvetsiJeCH ? 'Největší fond mimo švýcarské fondy (sídlo CH) – ty v Česku nabízí jen část brokerů, proto je na karty nevybíráme; v tabulce zůstávají.' : undefined);
  pushReco('Nejnižší poplatek', Wallet, byTer[0], byTer[0] ? ter(byTer[0].ter_numeric) : '', 'roční poplatek',
    byTer[0] && stejnyTer > 0
      ? `Stejný poplatek ${ter(byTer[0].ter_numeric)} ${stejnyTer >= 2 && stejnyTer <= 4 ? 'mají' : 'má'} ${stejnyTer} ${dalsiFondy(stejnyTer)} – při shodě ukazujeme akumulační, pak větší fond. Jen fondy nad ${prahText} bez měnového zajištění.`
      : `Jen fondy nad ${prahText} bez měnového zajištění.`);
  if (sVykonem && byPerf[0]) {
    const v = hodnotaVykonu(byPerf[0]);
    const med = medianVykonu;
    const obdobi = vykonObdobi === '3y' ? 'za 3 roky' : 'za 12 měsíců';
    pushReco('Nejvýkonnější', TrendingUp, byPerf[0], pctKc(v),
      med != null ? `${obdobi} v Kč · medián ${pctKc(med)}` : `${obdobi} v Kč`,
      `Nejvyšší výnos ${obdobi} v Kč mezi ${byPerf.length} ${byPerf.length === 1 ? 'fondem' : 'fondy'} nad ${prahText}${jeEsgKategorie ? '' : ' (bez měnově zajištěných tříd a ESG variant)'}.`);
  }
  // Co znamená „nejlepší“ – skutečná kritéria karet (kolo 6: slib „s nejdelší historií“ nic neplnil).
  const kriteria = ['největší fond', 'nejnižší poplatek',
    ...(recos.some((r) => /nejvýkonnější/i.test(r.tag)) ? [`nejvyšší výnos ${vykonObdobi === '3y' ? 'za 3 roky' : 'za 12 měsíců'} v Kč`] : [])];
  const kriteriaText = kriteria.length === 3 ? `${kriteria[0]}, ${kriteria[1]} a ${kriteria[2]}` : `${kriteria[0]} a ${kriteria[1]}`;

  // Tabulka – data pro klienta (bez fallbacku mezi měnami).
  // Jeden ticker webu (src/lib/ticker.ts); stejný ticker u dvou různých fondů v jednom žebříčku → s burzou.
  const tickery = tickeryBezDuplicit([...etfs, ...recos.map((r) => r.etf).filter((e) => !etfs.some((x) => x.isin === e.isin))]);
  const nazvy = kratkeNazvy(etfs.map((e) => ({ name: e.name, distribution_policy: e.distribution_policy, ticker: tickery.get(e.isin) ?? null })));
  const radky: RadekFondu[] = etfs.map((e, i) => {
    const k = distKind(e.distribution_policy);
    return {
      isin: e.isin,
      nazev: nazvy[i],
      ticker: tickery.get(e.isin) ?? null,
      emitent: e.fund_provider ?? null,
      rok: inceptionYear(e.inception_date),
      ter: num(e.ter_numeric),
      velikost: num(e.fund_size_numeric),
      r1: { CZK: num(e.return_1y_czk), EUR: num(e.return_1y), USD: num(e.return_1y_usd) },
      r3: { CZK: num(e.return_3y_czk), EUR: num(e.return_3y), USD: num(e.return_3y_usd) },
      typ: k === 'unknown' ? null : k,
      zajisteni: zajisteni(e.name),
      svycarsky: jeSvycarskyFond(e.isin, e.name),
      druh: SMISENE.has(slug) ? druhProduktu(e.category, e.name) : null,
    };
  });
  // Velké fondy (hlava katalogu, AUM ≥ HEAD_MIN_SIZE – ty jsou v sitemapě), které tabulka ve VÝCHOZÍM pohledu
  // neukáže (zajištěné třídy skryté, prvních KROK řádků) → serverový seznam odkazů, ať žádný detail z hlavy
  // nezůstane bez vnitřního odkazu (SEO audit 6b: 86 osiřelých detailů). Řazení výchozího pohledu = jako TabulkaFondu.
  const vychoziKlic = cfg.sortBy === 'ter_numeric' ? 'ter' : 'size';
  const vychoziPohled = radky
    .filter((r) => !r.zajisteni)
    .sort((a, b) => {
      if (vychoziKlic === 'size') return (b.velikost ?? -1) - (a.velikost ?? -1);
      const x = a.ter != null && a.ter > 0 ? a.ter : null, y = b.ter != null && b.ter > 0 ? b.ter : null;
      if (x == null || y == null) return x == null && y == null ? (b.velikost ?? 0) - (a.velikost ?? 0) : x == null ? 1 : -1;
      return x - y || Number(b.typ === 'acc') - Number(a.typ === 'acc') || (b.velikost ?? 0) - (a.velikost ?? 0);
    })
    .slice(0, RADKU_TABULKY_VYCHOZI);
  const videt = new Set(vychoziPohled.map((r) => r.isin));
  const dalsiVelke = radky.filter((r) => (r.velikost ?? 0) >= HEAD_MIN_SIZE && !videt.has(r.isin))
    .sort((a, b) => (b.velikost ?? 0) - (a.velikost ?? 0));
  const souvisejiciZebricky = (SOUVISEJICI[slug] ?? []).filter((x) => x !== slug && categoryConfigs[x]);

  const sr = SROVNAVAC[slug];
  // Odkaz „všechny … fondy“ nese i práh velikosti žebříčku – jinak srovnávač ukáže tisíce fondů místo počtu
  // ze žebříčku (kolo 6: „1 782 akciových“ vs. srovnávač bez prahu).
  const srovnavac = !sr ? { href: '/srovnani', text: 'Všechny fondy ve srovnávači' }
    : sr.q.startsWith('kat=') ? { href: `/srovnani?${sr.q}&minvel=${prah}`, text: `${sr.text} (nad ${prah}\u00a0mil.\u00a0€)` }
    : { href: `/srovnani?${sr.q}`, text: sr.text };

  // Infografika „co v tom je“ – složení největšího fondu kategorie. Rozložení podle zemí jen když
  // něco říká: „USA 97 %“ u S&P 500 je informace s nulovou hodnotou → sektory.
  const flagship = nejvetsi ?? bySize[0];
  const composition = flagship ? await getFlagshipComposition(flagship.isin) : null;
  let prefer = preferredDimension(slug);
  if (prefer === 'country' && (composition?.countries?.[0]?.weight ?? 0) > 90) prefer = 'sector';

  // Reálně sledované indexy v kategorii (s odborným popisem) – datově řízené.
  // Dluhopisy: indexy se tříští na desítky variant (splatnost, měna, poskytovatel) – „Euro Government 2 z 259“.
  // Proto po rodinách (státní USA, státní eurozóna, firemní EUR…), kolo 6.
  const DLUHOPISOVE = ['nejlepsi-dluhopisove-etf', 'nejlepsi-vladni-dluhopisy-etf', 'nejlepsi-korporatni-dluhopisy-etf'];
  const rodiny = DLUHOPISOVE.includes(slug);
  const topIndexes = rodiny ? topBondFamilies(etfs) : topIndexesForCategory(etfs);
  const lead = categoryLead[slug] ?? cfg.description;
  // FAQ: „Pro koho“ (dřív dlouhý odstavec v boxu) jako první otázka; zbytek beze změny.
  const faqs = content ? [
    ...(content.forWhom ? [{ q: `K čemu investoři tyto fondy používají?`, a: content.forWhom }] : []),
    ...content.faqs,
  ] : [];
  const rizika = (content?.risks ?? []).slice(0, 3).map(rozdelRiziko);

  const faqSchema = faqs.length ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://etfpruvodce.cz/' },
      { '@type': 'ListItem', position: 2, name: 'Žebříčky ETF', item: 'https://etfpruvodce.cz/zebricky' },
      { '@type': 'ListItem', position: 3, name: cfg.title, item: `https://etfpruvodce.cz/nejlepsi-etf/${slug}` },
    ],
  };

  const itemListSchema = bySize.length > 0 ? {
    '@context': 'https://schema.org', '@type': 'ItemList', name: cfg.title,
    itemListElement: bySize.slice(0, 10).map((e, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'FinancialProduct', name: shortName(e.name), identifier: e.isin, url: `https://etfpruvodce.cz/etf/${e.isin}` },
    })),
  } : null;

  const maSlozeni = slozeniPouzitelne(composition, prefer); // zlato, ropa: složení nemá smysl
  const slozeni = maSlozeni ? <CompositionInfographic comp={composition} prefer={prefer} fundLabel={flagship ? shortName(flagship.name) : undefined} /> : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />}

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

      <main id="obsah" className="max-w-6xl mx-auto px-4 pb-28">
        {/* Breadcrumb */}
        <nav aria-label="Drobečková navigace" className="py-3 text-xs text-slate-500 flex items-center gap-1.5 min-w-0">
          <Link href="/" className="hover:text-slate-700">Domů</Link>
          <span>/</span>
          <Link href="/zebricky" className="hover:text-slate-700">Žebříčky</Link>
          <span>/</span>
          <span className="text-slate-700 truncate">{cfg.title}</span>
        </nav>

        {/* ÚVOD – krátký: název, jedna věta, počet fondů a datum. Žádná půlobrazovková infografika. */}
        <section data-sekce="uvod" className="pt-2 pb-6">
          <h1 className="text-[28px] md:text-4xl font-bold tracking-tight leading-tight text-slate-900">{cfg.title}</h1>
          {/* Odpověď nahoře (SEO/GEO, kolo 6): fakta z dat stránky s datem – počet, nejnižší poplatek, největší fond, výnos v Kč. */}
          {odpoved.length > 0 && (
            <p data-odpoved="zebricek" className="mt-2 max-w-3xl text-sm md:text-base text-slate-800 leading-relaxed">{odpoved.slice(0, 2).join(' ')}
            {/* Mobil: jen první 2 věty (počet + poplatek/velikost) – další opakují karty pod nimi a tlačily tabulku níž (SEO audit 6b). */}
            {odpoved.slice(2).map((v) => <span key={v} className="hidden md:inline"> {v}</span>)}</p>
          )}
          {/* Mobil: s odpovědí nahoře se popis kategorie neukazuje (zůstává v HTML) – ať tabulka nezačíná až pod ohybem (kolo 6). */}
          <p className={`mt-2 max-w-2xl text-sm md:text-[15px] text-slate-600 leading-relaxed ${odpoved.length > 0 ? 'hidden md:block' : ''}`}>{nbsp(lead)}</p>
          {souvisi.length > 0 && (
            <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {souvisi.map((l) => (
                <Link key={l.href} href={l.href} className="inline-flex items-center gap-1 font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800">{l.text} <ArrowRight className="w-3.5 h-3.5 shrink-0" /></Link>
              ))}
            </p>
          )}
          {/* Co znamená „nejlepší“ (Markéta, kolo 4: nadpis „Nejlepší…“ a pak jen „největší a nejlevnější“) */}
          {/* Kolo 6: mobil – jedna krátká věta + vysvětlivka (tabulka začínala až na 770–970 px). */}
          <p className="hidden md:block mt-1.5 max-w-2xl text-sm text-slate-500 leading-relaxed">
            „Nejlepší“ = vybrané podle faktů: {kriteriaText} (fondy nad {prahText}). Tabulku si seřadíte sami. Pořadí není placené ani doporučení.
          </p>
          <p className="md:hidden mt-1 text-sm text-slate-500 inline-flex items-center gap-1">
            „Nejlepší“ = podle faktů, ne doporučení
            <InfoTip label={`Vybíráme podle faktů: ${kriteriaText} (fondy nad ${prahText}). Tabulku si seřadíte sami. Pořadí není placené ani doporučení.`}>{null}</InfoTip>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
            <span data-pocet-fondu={pocetDb ?? undefined} className="inline-flex items-center gap-1">
              <span><strong className="font-semibold text-slate-900 tabular-nums">{celkem.toLocaleString('cs-CZ')}</strong> {fondu(celkem)} nad {prah}{'\u00a0'}mil.{'\u00a0'}€</span>
              <InfoTip label={`V žebříčku jsou fondy se spravovaným majetkem aspoň ${prah} mil. €. Vynecháváme pákové a inverzní produkty a fondy, jejichž data nebyla 14 dní aktualizována.`}>{null}</InfoTip>
            </span>
            {dataDate && <AktualnostDat datum={dataDate} nejstarsi={nejstarsi} />}
          </div>
        </section>

        {/* VYBRANÉ PODLE DAT – tři fondy, každý s jedním hlavním číslem */}
        {recos.length > 0 && (
          <section data-sekce="vybrane" className="pb-8" aria-labelledby="vybrane-h">
            <h2 id="vybrane-h" className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Vybrané podle dat</h2>
            {/* Kolo 5: karty se neroztahují na výšku nejvyšší karty v řadě (u S&P 500 měla „Největší fond“ velkou prázdnou spodní část). */}
            <div className={`grid gap-2 md:gap-3 md:items-start ${recos.length + (indexova ? 1 : 0) === 2 ? 'md:grid-cols-2 lg:max-w-4xl' : 'md:grid-cols-3'}`}>
              {recos.map(({ tag, icon: Icon, etf, hodnota, popis, pravidlo }) => {
                const tk = tickery.get(etf.isin) ?? zobrazovanyTicker(etf as unknown as Record<string, unknown>);
                return (
                  <div key={etf.isin} className="group relative min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-3 md:p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                    <div className="absolute right-3 top-3 z-10 hidden md:block">
                      <CompareButton isin={etf.isin} label={tk ?? shortName(etf.name)} variant="row" />
                    </div>
                    {/* Mobil: jeden řádek (logo, štítek + název, číslo vpravo) – ať je tabulka fondů blízko. */}
                    <Link href={`/etf/${etf.isin}`} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 md:flex md:flex-col md:items-stretch min-w-0">
                      <span className="md:hidden"><EmitentLogo nazev={etf.name} size={32} monogram={etf.fund_provider} /></span>
                      <span className="min-w-0">
                        <span className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-semibold uppercase tracking-wide text-teal-700">
                          <Icon className="w-3.5 h-3.5" /> {tag}
                        </span>
                        <span className="mt-0.5 md:mt-2.5 flex items-center gap-2.5 min-w-0">
                          <span className="hidden md:inline-flex"><EmitentLogo nazev={etf.name} size={32} monogram={etf.fund_provider} /></span>
                          <span className="min-w-0">
                            <span className="text-[15px] font-semibold leading-snug text-slate-900 group-hover:text-teal-800 line-clamp-1 md:line-clamp-2">{nazevFondu(etf.name)}</span>
                            <span className="block text-xs text-slate-500">{tk ?? etf.isin}<span className="md:hidden"> · {popis}</span></span>
                          </span>
                        </span>
                      </span>
                      <span className="text-right md:mt-3 md:flex md:items-baseline md:justify-between md:gap-3 md:border-t md:border-slate-100 md:pt-3">
                        <span className={`text-lg md:text-2xl font-bold tabular-nums whitespace-nowrap ${Icon === TrendingUp ? 'text-emerald-700' : 'text-slate-900'}`}>{hodnota}</span>
                        <span className="hidden md:inline text-xs text-slate-500 text-right leading-snug">{popis}</span>
                      </span>
                    </Link>
                    {pravidlo && <p className="hidden md:block mt-2 text-[11px] leading-snug text-slate-500">{pravidlo}</p>}
                    {/* Mobil: pravidlo výběru ve vysvětlivce vpravo nahoře, ať karta zabírá jeden řádek. */}
                    {pravidlo && <span className="md:hidden absolute right-2.5 top-2"><InfoTip label={pravidlo}>{null}</InfoTip></span>}
                  </div>
                );
              })}
              {indexova && <JakVybrat druh={indexova} />}
            </div>
          </section>
        )}

        {/* VŠECHNY FONDY KATEGORIE – řaditelná tabulka */}
        {radky.length > 0 && (
          <section data-sekce="tabulka" className="pb-10" aria-labelledby="tabulka-h">
            <TabulkaFondu nadpisId="tabulka-h" radky={radky} celkem={celkem} vychozi={cfg.sortBy === 'ter_numeric' ? 'ter' : 'size'} datum={datumText} srovnavac={srovnavac} prah={prah} />
            {radky.some((r) => r.druh === 'ETC' || r.druh === 'krypto ETP') && (
              <p data-sekce="vysvetlivka-druhu" className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm leading-relaxed text-amber-900">
                <strong>ETC a ETP nejsou klasické fondy:</strong> jde o dluhové cenné papíry emitenta kryté kovem nebo kryptoměnou.
                Zlato a další komodity nevyplácejí dividendy ani úroky – výnos plyne jen ze změny ceny, která umí roky stagnovat nebo padat.
              </p>
            )}
            {dalsiVelke.length > 0 && (
              <details data-sekce="dalsi-velke-fondy" className="group mt-3 rounded-xl border border-slate-200 bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-xl [&::-webkit-details-marker]:hidden">
                  <span>Další velké fondy v žebříčku ({dalsiVelke.length}) – nad 2 mld. €, ve výchozím pohledu tabulky nejsou{dalsiVelke.some((r) => r.zajisteni) ? ' (i měnově zajištěné třídy)' : ''}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <ul className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-3">
                  {dalsiVelke.map((r) => (
                    <li key={r.isin}>
                      <Link href={`/etf/${r.isin}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-700 hover:border-teal-300 hover:text-teal-800">
                        {r.ticker && <span className="font-semibold">{r.ticker}</span>}<span>{r.nazev}</span>{r.zajisteni && <span className="text-amber-800">· zajištěno</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        )}

        {/* CO V KATEGORII JE – složení největšího fondu + sledované indexy vedle sebe */}
        {(maSlozeni || topIndexes.length > 0) && (
          <section data-sekce="slozeni" className="pb-10">
            <SectionHead title="Co v kategorii je" desc={`${maSlozeni ? 'Složení největšího fondu a nejčastější ' : 'Nejčastější '}${rodiny ? 'skupiny indexů (podle typu dluhopisů), které' : 'indexy, které'} fondy v žebříčku sledují.`} />
            {/* grid-cols-1 + min-w-0: bez nich se sloupec natáhl podle obsahu a stránka na mobilu přetékala o ~22 px */}
            <div className={`grid grid-cols-1 gap-4 ${maSlozeni && topIndexes.length > 0 ? 'lg:grid-cols-2 lg:items-start' : ''}`}>
              {slozeni && <div className="min-w-0">{slozeni}</div>}
              {topIndexes.length > 0 && (
                <div className="min-w-0">
                  <CategoryIndexes indexes={topIndexes} total={etfs.length} sloupce={maSlozeni ? 1 : 2} zCeho={celkem > etfs.length ? 'největších fondů' : 'fondů v žebříčku'} rodiny={rodiny} />
                  {WORLD_INDEX_SLUGS.has(slug) && (
                    <Link href="/svetove-etf-indexy" className="mt-3 inline-flex items-center gap-1.5 min-h-11 text-sm font-medium text-teal-700 hover:text-teal-800">
                      MSCI World, FTSE All-World, nebo S&amp;P 500? Srovnání indexů <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* NA CO SI DÁT POZOR – max. 3 krátké body, podrobnosti po rozbalení (dřív 9řádkové odstavce ve žlutém boxu) */}
        {rizika.length > 0 && (
          <section data-sekce="rizika" className="pb-8">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900"><AlertTriangle className="w-[18px] h-[18px] text-slate-500" /> Na co si dát pozor</h2>
            <ul className="mt-3 grid gap-2 md:grid-cols-3 md:items-start">
              {rizika.map(([hlava, detail]) => (
                <li key={hlava} className="min-w-0 rounded-xl border border-slate-200 bg-white">
                  {detail ? (
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-2 px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-xl">
                        <span>{hlava}</span>
                        <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="px-4 pb-3 text-sm leading-relaxed text-slate-600">{detail}</p>
                    </details>
                  ) : <p className="px-4 py-3 text-sm font-medium text-slate-900">{hlava}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* HLUBŠÍ VÝKLAD – dlouhý text schovaný do rozbalovacího bloku */}
        {content && (content.intro.length > 0 || content.verdict.length > 0) && (
          <section data-sekce="vyklad" className="pb-8">
            <details className="group rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-5 py-4 md:px-6 hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm md:text-base font-semibold text-slate-900 leading-tight">{content.introTitle}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">Podrobný rozbor kategorie a na co se při výběru dívat</span>
                  </span>
                </span>
                <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-6 md:px-6 border-t border-slate-100">
                <div className="pt-5 space-y-3 text-sm md:text-[15px] text-slate-700 leading-relaxed max-w-3xl">
                  {content.intro.map((p, i) => <p key={i}>{p}</p>)}
                </div>
                {content.verdict.length > 0 && (
                  <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50/60 p-5 max-w-3xl">
                    <p className="text-xs font-medium uppercase tracking-wide text-teal-700 mb-2">Na co se při výběru dívat</p>
                    <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
                      {content.verdict.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                  </div>
                )}
              </div>
            </details>
          </section>
        )}

        {/* FAQ – jednotný spojený seznam (FaqSeznam) */}
        {faqs.length > 0 && (
          <section data-sekce="faq" className="pb-8">
            <SectionHead title="Časté dotazy" />
            <div className="max-w-3xl"><FaqSeznam items={faqs.map((f) => ({ q: nbsp(f.q), a: nbsp(f.a) }))} /></div>
          </section>
        )}

        {/* SOUVISEJÍCÍ ŽEBŘÍČKY – vzájemné odkazy mezi příbuznými kategoriemi (SEO audit 6b) */}
        <SouvisejiciZebricky slugy={souvisejiciZebricky} />

        {/* CTA */}
        <section data-sekce="dalsi-kroky" className="pb-8">
          <div className="flex flex-wrap gap-3">
            <Link href={srovnavac.href} className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800">Porovnat fondy <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/kde-koupit" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400"><Coins className="w-4 h-4" /> Kde koupit</Link>
            <Link href="/zebricky" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400"><ArrowLeft className="w-4 h-4" /> Všechny žebříčky</Link>
          </div>
        </section>

        <InvestmentDisclaimer variant="inline" className="max-w-3xl" />
      </main>
    </div>
  );
}
