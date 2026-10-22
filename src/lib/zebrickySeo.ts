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
  /** Slug žebříčku – určuje záměr popisku a úvodní věty (ZAMER níže). */
  slug?: string;
  /** Tři největší fondy (bez švýcarských, stejně jako karty); `mimoCH` = nějaký větší švýcarský byl přeskočen. */
  topVelikost?: { fondy: (FondSeo & { velikost: number })[]; mimoCH: boolean };
  /** Tři nejlevnější podle pravidla karty (nad 100 mil. €, bez měnového zajištění). */
  topTer?: (FondSeo & { ter: number })[];
}

/* Záměr stránky (SEO audit kola 7, 22. 10. 2026): pět žebříčků mělo stejné jádro popisku („Nejnižší TER má SPYL…
   Největší je SXR8 (138,6 mld. €)…“) – nejlepsi-etf-2026, sp500, americke, akumulacni, nejlevnejsi. Každý teď vede
   fakty, kvůli kterým stránka existuje: největší fondy / nejnižší TER / index / medián trhu / třída. Čísla dál jen
   z dat stránky a s datem. Ostatní žebříčky beze změny (výchozí popisek). Hlídá check-fund-data.mjs, blok kolo7 seo. */
export type Zamer = 'nejvetsi' | 'nejlevnejsi' | 'index' | 'trh' | 'akumulacni';
const ZAMER: Record<string, Zamer> = {
  'nejlepsi-etf-2026': 'nejvetsi',
  'nejlevnejsi-etf': 'nejlevnejsi',
  'nejlepsi-sp500-etf': 'index',
  'nejlepsi-americke-etf': 'trh',
  'nejlepsi-akumulacni-etf': 'akumulacni',
};

/** Záměr stránky (kolo 8: i pro „odpověď nahoře“ na žebříčku, aby se úvodní věty 5 stránek neopakovaly). */
export const zamerZebricku = (slug: string | null | undefined): Zamer | undefined => (slug ? ZAMER[slug] : undefined);

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
  const zamer = d.slug ? ZAMER[d.slug] : undefined;
  const n = `${pocet(d.celkem)} ${fondy1(d.celkem)}`;
  const nadPrahem = `nad ${d.prah}${NB}mil.${NB}€`;
  const tv = d.topVelikost?.fondy ?? [];
  const seznamVel = (k: number, sVel: boolean) => tv.slice(0, k).map((f) => `${oznaceni(f)}${sVel ? ` ${velikostText(f.velikost)}` : ''}`).join(', ');
  const tt = d.topTer ?? [];
  const seznamTer = (k: number) => tt.slice(0, k).map((f) => `${oznaceni(f)} ${terText(f.ter)}`).join(', ');
  const vlastni: string[][] = [];
  if (zamer === 'nejvetsi' && tv.length >= 2) {
    const mimo = d.topVelikost?.mimoCH ? ' (mimo švýcarské)' : '';
    for (const k of [3, 2]) for (const sVel of [true, false]) {
      vlastni.push([`Největší ETF podle majetku${mimo}: ${seznamVel(k, sVel)}.`, `Srovnání ${pocet(d.celkem)} ${fondy2(d.celkem)} ${nadPrahem} napříč akciemi, dluhopisy i komoditami.`, datum]);
      vlastni.push([`Největší ETF podle majetku${mimo}: ${seznamVel(k, sVel)}.`, `${n} ${nadPrahem}, výnosy v Kč.`, datum]);
    }
  } else if (zamer === 'nejlevnejsi' && tt.length >= 2) {
    // Stejné minimum má často víc fondů (0,03 % = desítka S&P 500 / MSCI USA) → počet + první tři podle pravidla karty.
    const sMinimem = L ? L.stejnyTer + 1 : 0;
    const jmena = (k: number) => { const j = tt.slice(0, k).map(oznaceni); return `${j.slice(0, -1).join(', ')} a ${j[j.length - 1]}`; };
    if (L && sMinimem > 3 && tt.every((f) => f.ter === L.ter)) {
      vlastni.push([`Nejnižší TER (${terText(L.ter)}) má ${pocet(sMinimem)} ${fondy1(sMinimem)} nad ${d.prahKaret}${NB}mil.${NB}€ bez měnového zajištění, mj. ${jmena(3)}.`, `Srovnání ${pocet(d.celkem)} ${fondy2(d.celkem)} od nejlevnějšího.`, datum]);
      vlastni.push([`Nejnižší TER (${terText(L.ter)}) má ${pocet(sMinimem)} ${fondy1(sMinimem)} nad ${d.prahKaret}${NB}mil.${NB}€, mj. ${jmena(3)}.`, `${n} od nejlevnějšího.`, datum]);
    }
    for (const k of [3, 2]) {
      vlastni.push([`Nejnižší roční poplatek (TER) nad ${d.prahKaret}${NB}mil.${NB}€: ${seznamTer(k)}.`, `Srovnání ${pocet(d.celkem)} ${fondy2(d.celkem)} od nejlevnějšího, s výnosy v Kč.`, datum]);
      vlastni.push([`Nejnižší TER nad ${d.prahKaret}${NB}mil.${NB}€: ${seznamTer(k)}.`, `${n} od nejlevnějšího.`, datum]);
    }
  } else if (zamer === 'index') {
    vlastni.push([`${n} na index S&P${NB}500 (500 velkých firem USA) ${nadPrahem}.`, levny, velky(true), datum].filter((x): x is string => !!x));
    vlastni.push([`${n} na index S&P${NB}500 ${nadPrahem}.`, levny, velky(true), datum].filter((x): x is string => !!x));
    vlastni.push([`${n} na index S&P${NB}500 ${nadPrahem}.`, levny, velky(false), datum].filter((x): x is string => !!x));
  } else if (zamer === 'trh' && d.median) {
    const obd = d.median.obdobi === '3y' ? 'za 3 roky' : 'za 12 měsíců';
    const med = `Medián výnosu ${obd} v${NB}Kč ${pctText(d.median.hodnota)} (${pocet(d.median.pocet)} ${fondy1(d.median.pocet)} nad ${d.prahKaret}${NB}mil.${NB}€${d.median.bezVariant ? ' bez zajištěných a ESG tříd' : ''}).`;
    const vel = V && V.velikost != null ? `Největší je ${oznaceni(V)} (${velikostText(V.velikost)}).` : null;
    vlastni.push([`${n} na americké akcie ${nadPrahem}: široký trh i Nasdaq-100.`, med, vel, datum].filter((x): x is string => !!x));
    vlastni.push([`${n} na americké akcie ${nadPrahem}.`, med, vel, datum].filter((x): x is string => !!x));
    vlastni.push([`${n} na americké akcie ${nadPrahem}.`, med, datum]);
  } else if (zamer === 'akumulacni' && tv.length >= 2) {
    for (const k of [3, 2]) {
      vlastni.push([`${n} ${nadPrahem}, které dividendy reinvestují místo výplaty.`, `Největší: ${seznamVel(k, false)}.`, 'Výnosy v Kč.', datum]);
      vlastni.push([`${n} ${nadPrahem}, které dividendy reinvestují.`, `Největší: ${seznamVel(k, false)}.`, datum]);
    }
  }
  const vlastniOk = vlastni.map((v) => v.filter(Boolean).join(' ')).find((v) => v.length <= POPISEK_MAX && v.length >= 100);
  if (vlastniOk) return vlastniOk;

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
  const zamer = d.slug ? ZAMER[d.slug] : undefined;
  const nn = `${pocet(d.celkem)} ${fondy1(d.celkem)} nad ${d.prah}${NB}mil.${NB}€`;
  // Úvodní věta podle záměru stránky (kolo 7) – stejné číslo, jiná otázka, na kterou stránka odpovídá.
  vety.push(
    zamer === 'nejvetsi' ? `K${NB}${den} ${sloveso} v${NB}žebříčku ${nn} napříč akciemi, dluhopisy i komoditami, seřazených podle spravovaného majetku.`
      : zamer === 'nejlevnejsi' ? `K${NB}${den} ${sloveso} v${NB}žebříčku ${nn}, seřazených od nejnižšího ročního poplatku (TER).`
        : zamer === 'index' ? `K${NB}${den} ${sloveso} v${NB}žebříčku ${pocet(d.celkem)} ${fondy1(d.celkem)} na index S&P${NB}500 (500 velkých amerických firem) nad ${d.prah}${NB}mil.${NB}€.`
          : zamer === 'trh' ? `K${NB}${den} ${sloveso} v${NB}žebříčku ${nn} na americké akcie – široký trh (S&P 500, MSCI USA) i Nasdaq-100.`
            : zamer === 'akumulacni' ? `K${NB}${den} ${sloveso} v${NB}žebříčku ${nn}, které dividendy nevyplácejí, ale reinvestují.`
              : `K${NB}${den} ${sloveso} v${NB}žebříčku ${nn}.`,
  );
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

/* „Klíčová čísla k {datum}“ na hlavních žebříčcích (GEO, SEO audit kola 7, 22. 10. 2026) – dřív jen na 4 pilířích.
   Stejná čísla jako popisek a odpověď nahoře (DataZebricku = data stránky), vždy s datem; chybějící hodnota = řádek
   vynechán (nikdy „—“ v citovatelné tabulce). Zdroje = poskytovatel indexu a kurzy ČNB (přepočet do Kč). */
export const KLICOVA_CISLA_ZEBRICKY: Record<string, { index?: string; zdroje: { href: string; text: string }[] }> = {
  'nejlepsi-etf-2026': { zdroje: [] },
  'nejlepsi-sp500-etf': { index: 'S&P 500', zdroje: [{ href: 'https://www.spglobal.com/spdji/en/indices/equity/sp-500/', text: 'S&P Dow Jones Indices – S&P 500' }] },
  'nejlepsi-msci-world-etf': { index: 'MSCI World', zdroje: [{ href: 'https://www.msci.com/indexes/index/990100', text: 'MSCI – MSCI World' }] },
  'nejlepsi-celosvetove-etf': {
    index: 'celý svět (FTSE All-World, MSCI ACWI…)',
    zdroje: [
      { href: 'https://www.lseg.com/en/ftse-russell/indices/global-equity-index-series', text: 'FTSE Russell – FTSE Global Equity Index Series' },
      { href: 'https://www.msci.com/indexes/index/892400', text: 'MSCI – MSCI ACWI' },
    ],
  },
};
const CNB_KURZY = { href: 'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/', text: 'ČNB – kurzy devizového trhu (přepočet do Kč)' };

export function klicovaCislaZebricku(
  d: DataZebricku,
  medianTrhu: { hodnota: number; obdobi: '3y' | '1y'; pocet: number } | null,
): { datum: string; radky: { co: string; hodnota: string; pozn?: string }[]; zdroje: { href: string; text: string }[] } | null {
  const def = d.slug ? KLICOVA_CISLA_ZEBRICKY[d.slug] : undefined;
  if (!def || !d.datum || d.celkem <= 0) return null;
  const dalsich = (n: number) => (n === 1 ? 'další fond' : n <= 4 ? 'další fondy' : 'dalších fondů');
  const radky: { co: string; hodnota: string; pozn?: string }[] = [];
  radky.push({ co: def.index ? `Fondy na ${def.index} v žebříčku` : 'Fondy v žebříčku', hodnota: pocet(d.celkem), pozn: `spravovaný majetek nad ${d.prah}${NB}mil.${NB}€` });
  const L = d.nejlevnejsi, V = d.nejvetsi;
  if (L) radky.push({ co: 'Nejnižší roční poplatek (TER)', hodnota: terText(L.ter), pozn: `${oznaceni(L)} – fondy nad ${d.prahKaret}${NB}mil.${NB}€ bez měnového zajištění${L.stejnyTer > 0 ? `; stejný TER ${maji(L.stejnyTer)} ještě ${L.stejnyTer} ${dalsich(L.stejnyTer)}` : ''}` });
  if (V && V.velikost != null) radky.push({ co: `Největší fond${V.mimoCH ? ' (mimo švýcarské)' : ''}`, hodnota: velikostText(V.velikost), pozn: `${oznaceni(V)} – ${V.nazev}` });
  if (V && V.r1Kc != null && stejnyDen(V.datum, d.datum)) radky.push({ co: 'Výnos největšího fondu za 12 měsíců v Kč', hodnota: pctText(V.r1Kc), pozn: `${oznaceni(V)}, po poplatcích, před daní` });
  if (def.index && medianTrhu && medianTrhu.pocet >= 3) {
    radky.push({ co: `Medián výnosu ${medianTrhu.obdobi === '3y' ? 'za 3 roky' : 'za 12 měsíců'} v Kč`, hodnota: pctText(medianTrhu.hodnota), pozn: `${pocet(medianTrhu.pocet)} ${fondy1(medianTrhu.pocet)} nad ${d.prahKaret}${NB}mil.${NB}€ bez zajištěných a ESG tříd` });
  }
  return { datum: datumText(d.datum), radky, zdroje: [...def.zdroje, CNB_KURZY] };
}
