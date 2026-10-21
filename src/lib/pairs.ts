/**
 * Srovnání dvojic ETF (/srovnani/<a>-vs-<b>).
 * POPULAR_PAIRS se předgenerují při buildu; SITEMAP_PAIRS jdou do sitemapy (předgenerované
 * + dvojice nalinkované z webu). Ostatní dvojice vznikají on-demand a do sitemapy NEpatří
 * (nekonečný prostor URL by jen pálil ISR zápisy).
 * Proč v sitemapě: dvojice vyhrávají na Seznamu (např. „VWCE výnos“ 1. místo), ale v sitemapě
 * nebyly (deep dive 17. 10. 2026).
 *
 * KANONICKÉ ADRESY (SEO audit 20. 10. 2026, kolo 6): libovolná kombinace tickerů dřív vracela 200,
 * index a vlastní canonical → obrácené pořadí (iwda-vs-vwce) i aliasy tickerů (sxr8-vs-vuaa vs.
 * cspx-vs-vuaa) byly duplicity. Pravidlo – JEDNA adresa na dvojici fondů (dvojici ISINů, bez pořadí):
 *   1. dvojice ISINů má kurátorskou adresu (KURATORSKE níže) → kanonická je ona; kurátorské URL
 *      se nemění a nepřesměrovávají (jen kurátorské aliasy mají canonical na hlavní tvar);
 *   2. jinak zobrazované tickery obou fondů (zobrazovanyTicker, src/lib/ticker.ts) seřazené abecedně.
 * Jiný tvar adresy → trvalé přesměrování (page.tsx; obrácené kurátorské dvojice už v middleware bez DB).
 * Dvojice mimo kurátorský seznam mají googlebot noindex (Bing/Seznam indexují) – stejný princip jako
 * ocas detailů fondů. Hlídá scripts/check-fund-data.mjs (blok kolo6 seo).
 */
export const POPULAR_PAIRS = [
  'vwce-vs-iwda', 'iwda-vs-cspx', 'swrd-vs-iwda', 'cspx-vs-vuaa', 'vusa-vs-vuaa',
  'cspx-vs-spy5', 'vwce-vs-vwrl', 'cspx-vs-eunl', 'vwce-vs-eunl',
  // Podle našeptávače Googlu (17. 10. 2026) – takhle lidé srovnání opravdu píšou:
  'sxr8-vs-vuaa', 'cspx-vs-spyl', 'iwda-vs-vwra', 'cspx-vs-vwra', 'cspx-vs-vusa',
  // „Stejný fond, jiný ticker“ – odpověď „ano, je to stejný fond“ (dřív 404):
  'iwda-vs-eunl', 'iwda-vs-swda', 'cspx-vs-sxr8', 'vuaa-vs-vuag', 'vwce-vs-vwra',
];

/**
 * Kurátorské dvojice → ISINy fondů, na které se tickery z adresy překládají (getComparisonETFData).
 * Ověřeno dotazem do etf_funds 20. 10. 2026; denní kontrola (check-fund-data, kolo6 seo) hlídá, že
 * stránka dvojice pořád ukazuje tytéž fondy. Pořadí ISINů = pořadí tickerů v adrese.
 */
export const KURATORSKE: Record<string, [string, string]> = {
  'vwce-vs-cspx': ['IE00BK5BQT80', 'IE00B5BMR087'], // vlastní kurátorská stránka (statická routa)
  'vwce-vs-iwda': ['IE00BK5BQT80', 'IE00B4L5Y983'],
  'iwda-vs-cspx': ['IE00B4L5Y983', 'IE00B5BMR087'],
  'swrd-vs-iwda': ['IE00BFY0GT14', 'IE00B4L5Y983'],
  'cspx-vs-vuaa': ['IE00B5BMR087', 'IE00BFMXXD54'],
  'vusa-vs-vuaa': ['IE00B3XXRP09', 'IE00BFMXXD54'],
  'cspx-vs-spy5': ['IE00B5BMR087', 'IE00B6YX5C33'],
  'vwce-vs-vwrl': ['IE00BK5BQT80', 'IE00B3RBWM25'],
  'cspx-vs-spyl': ['IE00B5BMR087', 'IE000XZSV718'],
  'cspx-vs-vusa': ['IE00B5BMR087', 'IE00B3XXRP09'],
  'iwda-vs-eunl': ['IE00B4L5Y983', 'IE00B4L5Y983'],
  'cspx-vs-sxr8': ['IE00B5BMR087', 'IE00B5BMR087'],
  'vuaa-vs-vuag': ['IE00BFMXXD54', 'IE00BFMXXD54'],
  'vwce-vs-vwra': ['IE00BK5BQT80', 'IE00BK5BQT80'],
  // Aliasy – jiné tickery TÝCHŽ fondů jako hlavní dvojice (stránka zůstává, canonical míří na hlavní):
  'vwce-vs-eunl': ['IE00BK5BQT80', 'IE00B4L5Y983'],
  'iwda-vs-vwra': ['IE00B4L5Y983', 'IE00BK5BQT80'],
  'cspx-vs-eunl': ['IE00B5BMR087', 'IE00B4L5Y983'],
  'sxr8-vs-vuaa': ['IE00B5BMR087', 'IE00BFMXXD54'],
  'cspx-vs-vwra': ['IE00B5BMR087', 'IE00BK5BQT80'],
  'iwda-vs-swda': ['IE00B4L5Y983', 'IE00B4L5Y983'],
};

/** Kurátorský alias → hlavní kurátorská dvojice (stejné fondy). Hlavní = ta, kterou web prolinkovává. */
export const KURATORSKE_ALIASY: Record<string, string> = {
  'vwce-vs-eunl': 'vwce-vs-iwda',
  'iwda-vs-vwra': 'vwce-vs-iwda',
  'cspx-vs-eunl': 'iwda-vs-cspx',
  'sxr8-vs-vuaa': 'cspx-vs-vuaa',
  'cspx-vs-vwra': 'vwce-vs-cspx',
  'iwda-vs-swda': 'iwda-vs-eunl',
};

/** Hlavní (kanonické) kurátorské dvojice – jen ty patří do sitemapy a do odkazů. */
export const HLAVNI_DVOJICE = Object.keys(KURATORSKE).filter((s) => !KURATORSKE_ALIASY[s]);

// Sitemapa = jen kanonické adresy (aliasy mají canonical jinam – posílat je vyhledávači by byl rozpor).
export const SITEMAP_PAIRS = HLAVNI_DVOJICE;

/** Popisky hlavních dvojic do odkazů (otázka, na kterou srovnání odpovídá – bez doporučení). */
export const POPISKY_DVOJIC: Record<string, string> = {
  'vwce-vs-cspx': 'Celý svět, nebo jen USA?',
  'vwce-vs-iwda': 'Celý svět, nebo jen vyspělé trhy?',
  'iwda-vs-cspx': 'Vyspělé trhy, nebo jen USA?',
  'swrd-vs-iwda': 'Dva fondy na MSCI World – SPDR, nebo iShares?',
  'cspx-vs-vuaa': 'Dva S&P 500 fondy – iShares, nebo Vanguard?',
  'vusa-vs-vuaa': 'Vanguard S&P 500 – vyplácí, nebo reinvestuje?',
  'cspx-vs-spy5': 'S&P 500 – iShares, nebo SPDR (vyplácí)?',
  'vwce-vs-vwrl': 'Celý svět – reinvestuje, nebo vyplácí?',
  'cspx-vs-spyl': 'S&P 500 – největší, nebo nejlevnější?',
  'cspx-vs-vusa': 'S&P 500 – iShares, nebo Vanguard (vyplácí)?',
  'iwda-vs-eunl': 'IWDA, EUNL a SWDA – je to stejný fond?',
  'cspx-vs-sxr8': 'CSPX a SXR8 – je to stejný fond?',
  'vuaa-vs-vuag': 'VUAA a VUAG – je to stejný fond?',
  'vwce-vs-vwra': 'VWCE a VWRA – je to stejný fond?',
};

const dvojiceKlic = (a: string, b: string) => [a, b].sort().join('|');
const PODLE_ISINU = new Map<string, string>();
for (const s of HLAVNI_DVOJICE) PODLE_ISINU.set(dvojiceKlic(...KURATORSKE[s]), s);

/** Hlavní kurátorská dvojice pro dva fondy (bez ohledu na pořadí), nebo null. */
export function kuratorskaProIsiny(isinA: string, isinB: string): string | null {
  return PODLE_ISINU.get(dvojiceKlic(isinA, isinB)) ?? null;
}

/**
 * Kanonická adresa dvojice (bez „/srovnani/“): kurátorská, jinak zobrazované tickery abecedně.
 * `tkA`/`tkB` = zobrazované tickery fondů (zobrazovanyTicker). null = nejde sestavit (fond bez tickeru).
 */
export function kanonickaDvojice(
  a: { isin: string; ticker: string | null }, b: { isin: string; ticker: string | null },
): string | null {
  const kur = kuratorskaProIsiny(a.isin, b.isin);
  if (kur) return kur;
  if (!a.ticker || !b.ticker || !/^[A-Za-z0-9]{1,12}$/.test(a.ticker) || !/^[A-Za-z0-9]{1,12}$/.test(b.ticker)) return null;
  const [x, y] = [a.ticker.toLowerCase(), b.ticker.toLowerCase()].sort();
  if (x === y) return null; // stejný zobrazovaný ticker (tentýž fond) – tvar z adresy nechat
  return `${x}-vs-${y}`;
}

/** Obrácené pořadí kurátorské dvojice a obrácené aliasy → hlavní dvojice (pro middleware, bez DB). */
export function obracenaKuratorska(slug: string): string | null {
  const m = slug.toLowerCase().match(/^([a-z0-9]+)-vs-([a-z0-9]+)$/);
  if (!m) return null;
  const obraceny = `${m[2]}-vs-${m[1]}`;
  if (KURATORSKE[slug.toLowerCase()]) return null; // sama je kurátorská
  if (KURATORSKE[obraceny]) return KURATORSKE_ALIASY[obraceny] ?? obraceny;
  return null;
}

/** Hlavní kurátorské dvojice, ve kterých je daný fond (pro „Srovnání s …“ na detailu). */
export function dvojiceFondu(isin: string): string[] {
  return HLAVNI_DVOJICE.filter((s) => KURATORSKE[s].includes(isin));
}
