/**
 * Titulek, popisek a „odpověď nahoře“ žebříčků /nejlepsi-etf/* (SEO audit kola 6, 20. 10. 2026).
 *
 * PROČ: všech 48 žebříčků mělo titulek „{X} – srovnání a výnosy v Kč“ (bez roku a čísla) a popisky 60–90 znaků.
 * Teď se texty skládají ze STEJNÝCH dat, která stránka ukazuje (sdílená cache v page.tsx – žádný dotaz navíc).
 *
 * Pravidlo č. 1: číslo jen tehdy, když ho máme; chybějící hodnota se z věty VYPUSTÍ (nikdy „TER od —“,
 * „undefined“, „NaN“). Popisek vždy nese datum dat („Data k …“); bez data se číselný popisek negeneruje.
 * „TER od X“ = nejnižší TER > 0 v CELÉ kategorii (stejně jako sloupec „TER od“ na /zebricky); když ho z dat
 * stránky nelze ověřit (velká kategorie načtená jen částečně), v titulku chybí. „Nejnižší poplatek“ v textu =
 * karta stránky (porovnejNejlevnejsi: fondy nad 100 mil. € bez měnového zajištění).
 * Hlídá scripts/check-fund-data.mjs, blok „kolo6 seo zebricky“.
 */

export interface FondSeo {
  nazev: string;
  ticker: string | null;
  /** K jakému dni platí data fondu (den výnosů – src/lib/datumVynosu.ts). */
  datum: Date | null;
}

export interface DataZebricku {
  /** cfg.title, např. „Nejlepší S&P 500 ETF“. */
  nazev: string;
  /** Datum dat stránky (null = nepodařilo se načíst → žádný číselný popisek). */
  datum: Date | null;
  celkem: number;
  /** Práh velikosti žebříčku v mil. €. */
  prah: number;
  /** Nejnižší TER > 0 v celé kategorii; null = nelze ověřit z dat stránky. */
  terOd: number | null;
  /** Karta „Nejnižší poplatek“. */
  nejlevnejsi: (FondSeo & { ter: number; stejnyTer: number }) | null;
  /** Karta „Největší fond“. */
  nejvetsi: (FondSeo & { velikost: number | null; r1Kc: number | null; /** větší je švýcarský fond, který karty přeskakují */ mimoCH?: boolean }) | null;
  /** Medián výnosu z karty „Nejvýkonnější“ (jen kde ji stránka ukazuje). */
  median: { hodnota: number; obdobi: '3y' | '1y'; pocet: number; bezVariant: boolean } | null;
  /** Práh karet (100 mil. €). */
  prahKaret: number;
}

const NB = ' ';
const BRAND = ' | ETF průvodce.cz';
export const MAX_TITULEK = 65;
export const POPISEK_MIN = 140;
export const POPISEK_MAX = 160;

const cz = (v: number, d: number) => v.toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d });
export const terText = (v: number) => `${cz(v, 2)}${NB}%`;
export const pctText = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${cz(Math.abs(v), 1)}${NB}%`;
export const velikostText = (v: number) => (v >= 1000 ? `${cz(v / 1000, 1)}${NB}mld.${NB}€` : `${Math.round(v)}${NB}mil.${NB}€`);
export const datumText = (d: Date) => d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });
const pocet = (n: number) => n.toLocaleString('cs-CZ');
/** 1 fond, 2–4 fondy, 5+ fondů (1. pád). */
const fondy1 = (n: number) => (n === 1 ? 'fond' : n >= 2 && n <= 4 ? 'fondy' : 'fondů');
/** Za předložkou s 2. pádem („srovnání 3 fondů“). */
/** Shoda podmětu s číslovkou: „má 1 další fond“, „mají 2–4 další fondy“, „má 5 dalších fondů“ (SEO audit 6b). */
const maji = (n: number) => (n >= 2 && n <= 4 ? 'mají' : 'má');
const fondy2 = (n: number) => (n === 1 ? 'fondu' : 'fondů');
const stejnyDen = (a: Date | null, b: Date | null) => !!a && !!b && datumText(a) === datumText(b);
/** Ticker, jinak krátký název. */
const oznaceni = (f: FondSeo) => f.ticker ?? f.nazev;

/** „Nejlepší S&P 500 ETF 2026“ – rok = rok data dat; když ho titulek už má („Nejlepší ETF 2026“), nepřidává se. */
function nazevSRokem(d: DataZebricku): string {
  if (!d.datum || /\b20\d\d\b/.test(d.nazev)) return d.nazev;
  return `${d.nazev} ${d.datum.getUTCFullYear()}`;
}

/** Titulek ≤ 65 znaků: s číslem, kde ho máme; se značkou webu, kde se vejde. Vrací absolutní titulek. */
export function titulekZebricku(d: DataZebricku): string {
  const z = nazevSRokem(d);
  const n = d.celkem > 0 ? `${pocet(d.celkem)} ${fondy1(d.celkem)}` : null;
  const kandidati = [
    n && d.terOd != null ? `${z}: ${n}, TER od ${terText(d.terOd)}` : null,
    n ? `${z}: ${n} v žebříčku` : null,
    n ? `${z}: ${n}` : null,
    z,
  ].filter((t): t is string => !!t);
  for (const k of kandidati) {
    if ((k + BRAND).length <= MAX_TITULEK) return k + BRAND;
    if (k.length <= MAX_TITULEK) return k;
  }
  return z;
}

/** Popisek 140–160 znaků s datem dat a výnosem v Kč. null = bez data dat (stránka použije statický popisek). */
export function popisekZebricku(d: DataZebricku): string | null {
  if (!d.datum || d.celkem <= 0) return null;
  const datum = `Data k ${datumText(d.datum)}.`;
  const uvodDlouhy = `Srovnání ${pocet(d.celkem)} ${fondy2(d.celkem)} nad ${d.prah}${NB}mil.${NB}€ podle poplatku, velikosti a výnosu v Kč.`;
  const uvodKratky = `${pocet(d.celkem)} ${fondy1(d.celkem)} nad ${d.prah}${NB}mil.${NB}€ s výnosy v Kč.`;
  const L = d.nejlevnejsi, V = d.nejvetsi;
  const stejny = !!L && !!V && L.nazev === V.nazev && L.ticker === V.ticker && !V.mimoCH;
  // „Nejnižší poplatek“ bez upřesnění jen tehdy, když karta = skutečné minimum kategorie; jinak s prahem karty.
  const levnyKde = L && d.terOd != null && L.ter === d.terOd ? '' : ` nad ${d.prahKaret}${NB}mil.${NB}€`;
  const levny = L && !stejny ? `Nejnižší TER${levnyKde} má ${oznaceni(L)} (${terText(L.ter)}).` : null;
  const r1 = V && V.r1Kc != null && stejnyDen(V.datum, d.datum) ? V.r1Kc : null;
  const velky = (sVelikosti: boolean) => {
    if (!V) return null;
    const vel = sVelikosti && V.velikost != null ? ` (${velikostText(V.velikost)})` : '';
    const kdo = stejny && L ? `Největší a nejlevnější${levnyKde ? ` nad ${d.prahKaret}${NB}mil.${NB}€` : ''} je ${oznaceni(V)}${vel}, TER ${terText(L.ter)}` : `Největší${V.mimoCH ? ' mimo švýcarské fondy' : ''} je ${oznaceni(V)}${vel}`;
    return `${kdo}${r1 != null ? `, za 12 měsíců v Kč ${pctText(r1)}` : ''}.`;
  };
  const varianty = [
    [uvodDlouhy, levny, velky(true), datum],
    [uvodKratky, levny, velky(true), datum],
    [uvodKratky, levny, velky(false), datum],
    [uvodKratky, velky(false), datum],
    [uvodKratky, datum],
  ].map((v) => v.filter(Boolean).join(' '));
  let t = varianty.find((v) => v.length <= POPISEK_MAX) ?? varianty[varianty.length - 1];
  for (const doplnek of ['Tabulku seřadíte sami.', 'Pořadí není placené.']) {
    if (t.length >= POPISEK_MIN) break;
    if ((`${t} ${doplnek}`).length <= POPISEK_MAX) t = `${t} ${doplnek}`;
  }
  return t;
}

/** „Odpověď nahoře“ (GEO): 2–3 věty pod H1, jen fakta s datem. Prázdné pole = nic neukazovat. */
export function odpovedZebricku(d: DataZebricku): string[] {
  if (!d.datum || d.celkem <= 0) return [];
  const den = datumText(d.datum);
  const vety: string[] = [];
  const sloveso = d.celkem === 1 ? 'je' : d.celkem <= 4 ? 'jsou' : 'je';
  vety.push(`K${NB}${den} ${sloveso} v${NB}žebříčku ${pocet(d.celkem)} ${fondy1(d.celkem)} nad ${d.prah}${NB}mil.${NB}€.`);
  const kDni = (f: FondSeo) => (f.datum && !stejnyDen(f.datum, d.datum) ? ` (data k${NB}${datumText(f.datum)})` : '');
  const jmeno = (f: FondSeo) => (f.ticker ? `${f.nazev} (${f.ticker})` : f.nazev) + kDni(f);
  const L = d.nejlevnejsi, V = d.nejvetsi;
  const casti: string[] = [];
  const tentyz = !!L && !!V && L.nazev === V.nazev && L.ticker === V.ticker && !V.mimoCH;
  if (L && V && tentyz && V.velikost != null) {
    // Nejlevnější je zároveň největší (STOXX 600, robotika…) – jedna věta, ne „má X; největší je X“.
    const kde = d.terOd != null && L.ter === d.terOd ? '' : ` mezi fondy nad ${d.prahKaret}${NB}mil.${NB}€ bez měnového zajištění`;
    const dalsi = L.stejnyTer > 0 ? ` (stejný poplatek ${maji(L.stejnyTer)} ještě ${L.stejnyTer} ${L.stejnyTer === 1 ? 'další fond' : L.stejnyTer <= 4 ? 'další fondy' : 'dalších fondů'})` : '';
    casti.push(`nejnižší poplatek${kde} a zároveň největší majetek má ${jmeno(L)}: TER ${terText(L.ter)}${dalsi}, ${velikostText(V.velikost)}`);
  } else if (L) {
    const kde = d.terOd != null && L.ter === d.terOd ? '' : ` mezi fondy nad ${d.prahKaret}${NB}mil.${NB}€ bez měnového zajištění`;
    const dalsi = L.stejnyTer > 0 ? `, stejný ${maji(L.stejnyTer)} ještě ${L.stejnyTer} ${L.stejnyTer === 1 ? 'další fond' : L.stejnyTer <= 4 ? 'další fondy' : 'dalších fondů'}` : '';
    casti.push(`nejnižší poplatek${kde} má ${jmeno(L)} s${NB}TER ${terText(L.ter)}${dalsi}`);
  }
  if (V && V.velikost != null && !tentyz) casti.push(`největší${V.mimoCH ? ' mimo švýcarské fondy' : ''} je ${jmeno(V)} se spravovaným majetkem ${velikostText(V.velikost)}`);
  if (casti.length) {
    const s = casti.join('; ');
    vety.push(`${s.charAt(0).toUpperCase()}${s.slice(1)}.`);
  }
  if (d.median) {
    const obdobi = d.median.obdobi === '3y' ? 'za 3 roky' : 'za 12 měsíců';
    vety.push(`Medián výnosu ${obdobi} v${NB}Kč je ${pctText(d.median.hodnota)} (${pocet(d.median.pocet)} ${fondy1(d.median.pocet)} nad ${d.prahKaret}${NB}mil.${NB}€${d.median.bezVariant ? ' bez měnově zajištěných tříd a ESG variant' : ''}).`);
  } else if (V && V.r1Kc != null && stejnyDen(V.datum, d.datum)) {
    vety.push(`Největší fond za posledních 12 měsíců vydělal v${NB}korunách ${pctText(V.r1Kc)}.`);
  }
  return vety;
}
