/**
 * NEOVĚŘENÝ VÝNOS VŠUDE STEJNĚ (kontrolní revize kola 6b, 21. 10. 2026; rozšířeno v kole 7, 22. 10. 2026).
 *
 * A) ODLEHLÝ VÝNOS (kolo 6b): fond, jehož výnos za 12 měsíců v Kč se liší o víc než 1,5 p. b. od mediánu fondů na
 * stejný trh (src/lib/trhy.ts, `odlehle`; seznam trhů src/data/trhyDvojcata.ts), má nejčastěji opožděnou poslední
 * cenu u zdroje dat. Detail fondu jeho výnosy za období neukazuje („—“) a /metodika to slibuje – dřív je ale
 * ukazovaly žebříčky, srovnávač i porovnání (XSXD +24,9 % v EUR, zdroj +20,05 %, 1. při řazení podle výnosu).
 *
 * B) VÝNOS V ROZPORU S BURZOU / S HOLÝMI DATY (kolo 7): `NEOVERENE_VYNOSY` níže – fondy mimo ruční seznamy trhů, u
 * kterých jsme NEZÁVISLE (burzovní ceny Yahoo, kurzy, vlastní přepočet z řady) ověřili, že výnosy za období od zdroje
 * dat nesedí. Tři druhy chyb zdroje:
 *   - 'skok'      – v denní řadě zdroje je skok, který burza nemá (HASH 22. 9. 2026 49,55 → 1,70 = −96,6 %; burza
 *                   od září bez obchodu na 49,61 €, bitcoin za rok −22 %) → web ukazoval 1R −97,8 %, 3R −92,2 %;
 *   - 'sum'       – řada zdroje je zašuměná cena, ne cena produktu (EUWAX Gold II: denní odchylka od vlastní burzy
 *                   sd 1,3–1,6 %, Xetra-Gold 0–0,4 %) → výnos k jednomu dni o 1–3 p. b. vedle (1R +1,01 % vs. burza −1,64 %);
 *   - 'dividenda' – zdroj nemá poslední vyplacenou dividendu distribuční třídy (I50D ex 15. 10. 2026 0,0398 USD,
 *                   XISP ex 19. 8. 2026 0,19 €: Yahoo ji má, cena v řadě zdroje v ex-den spadla, „s dividendami“
 *                   ne) → výnos s reinvesticí o 0,4–1,4 p. b. nižší, než byl (I50D 19,55 % vs. akumulační I500 20,23 %).
 * Seznam je RUČNÍ a ověřený; denní kontrola (scripts/check-fund-data.mjs, blok „kolo7 podezrele“) hledá NOVÉ případy
 * (poplach / varování) a hlásí položky, které už neplatí (zdroj chybu opravil, scraper vrací null) – ty se smažou.
 * Scraper (etf-astro, vynosy_z_rady.py, větev oprava/btcw-vynosy) od nasazení sám vrací null u období přes skok/díru.
 *
 * JEDNO pravidlo pro celý web:
 *   - seznam ISINů: `odlehleIsiny()` v src/lib/trhy.ts (odlehlé) ∪ `NEOVERENE_ISINY` (tento soubor) – `sNeoverenymi()`,
 *   - výnosy za období → null: `bezVynosuObdobi` / `bezOdlehlychVynosu` / `bezOdlehlehoVynosu` (tento soubor – čistý, jde
 *     i do klienta; `NEOVERENE_VYNOSY` uplatní VŽDY, i když volající předá jen odlehlé z trhů),
 *   - vysvětlivka u „—“: `VYNOS_NEOVERENY_TEXT` (obecná), u konkrétního fondu `duvodNeovereni(isin)`.
 * Kalendářní roky (return_2021…2025) zůstávají – jsou uzavřené a opožděná dnešní cena je neovlivní (stejně jako detail).
 * Hlídá scripts/check-fund-data.mjs (bloky kolo6b detail a kolo7 podezrele).
 */

/** Výnosy za období, které opožděná poslední cena zkreslí (všechny měny a varianty sloupců v DB: _czk, _usd, _percent),
 *  i „výnos / riziko“ (počítá se z téhož výnosu). Kalendářní roky (return_2021…) a returns_as_of (datum) NE. */
export const VYNOS_OBDOBI = /^(?:return_(?:1m|3m|6m|ytd|1y|3y|5y|10y|inception)(?:_czk|_usd|_percent)?|ytd_return_percent|return_per_risk_(?:1y|3y|5y))$/;
/** Obecná vysvětlivka (srovnávač, porovnání – jeden text pro všechny důvody). */
export const VYNOS_NEOVERENY_TEXT =
  'Výnosy za období neukazujeme: nesedí s ostatními fondy na stejný trh nebo s cenou na burze – nejčastěji kvůli opožděné nebo chybné ceně u zdroje dat.';

export type DruhNeovereni = 'skok' | 'sum' | 'dividenda';
export interface NeoverenyVynos {
  /** Ticker jen pro čtení seznamu (zdroj pravdy je ISIN). */
  ticker: string;
  druh: DruhNeovereni;
  /** Den chyby u zdroje: skok / ex-den chybějící dividendy (YYYY-MM-DD). U 'sum' neuveden. */
  den?: string;
  /** Kdy jsme nezávisle ověřili (YYYY-MM-DD). */
  overeno: string;
  /** Důkaz s čísly a zdrojem (pro lidi a pro kontrolu). */
  dukaz: string;
}

/**
 * Ověřené chyby zdroje (kolo 7, 22. 10. 2026). FORMÁT: jeden fond = jeden řádek (čte ho i scripts/check-fund-data.mjs).
 * Přidat jen po nezávislém ověření; smazat, když ho kontrola nahlásí jako neplatný.
 */
export const NEOVERENE_VYNOSY: Readonly<Record<string, NeoverenyVynos>> = {
  'CH1184151731': { ticker: 'HASH', druh: 'skok', den: '2026-09-22', overeno: '2026-10-22', dukaz: 'zdroj 21.→22. 9. 49,55 → 1,70 $ (−96,6 %); Xetra HDX1 bez obchodu od 11. 9. (49,61 €), Paris HASH od 10. 9.; BTC-EUR 1R −22 %' },
  'CH1218734544': { ticker: 'HAMO', druh: 'skok', den: '2026-09-22', overeno: '2026-10-22', dukaz: 'zdroj 21.→22. 9. 56,91 → 1,33 (−97,7 %); Amsterdam HAMO bez obchodu od 1. 9.' },
  'XS2819843736': { ticker: 'VIXL', druh: 'skok', den: '2024-01-05', overeno: '2026-10-22', dukaz: 'zdroj 5. 1. 2024 0,02 → 113,02 (×5 651), 8. 1. zpět, 22. 7. 2024 0,01 → 42,70; 3R +700 % při 1R −88 %' },
  'XS2819843900': { ticker: '3NGL', druh: 'skok', den: '2024-01-05', overeno: '2026-10-22', dukaz: 'zdroj 5. 1. 2024 0,31 → 142,10 (×458), 8. 1. zpět; Milán 3NGL.MI tytéž dny ×1,00' },
  'XS2842095320': { ticker: '3LAA', druh: 'skok', den: '2024-06-28', overeno: '2026-10-22', dukaz: 'zdroj 28. 6. 2024 3,4e8 → 8,4e10 €, 2. 7. → 22,79; Milán 3LAA.MI ×0,98 / ×1,04; 3R −100 %' },
  'XS2842095676': { ticker: '3SNV', druh: 'skok', den: '2024-06-28', overeno: '2026-10-22', dukaz: 'zdroj 28. 6. 2024 4,5e9 → 2,7e12 €, 2. 7. → 23,35; Milán 3SNV.MI ×0,94 / ×1,06; 3R −100 %' },
  'XS2842095759': { ticker: '3SAA', druh: 'skok', den: '2024-06-28', overeno: '2026-10-22', dukaz: 'zdroj 28. 6. 2024 2,9e7 → 3,0e9 €, 2. 7. → 27,75 (ceny v miliardách €); 3R −100 %' },
  'IE00B8K7KM88': { ticker: '3USS', druh: 'skok', den: '2022-12-19', overeno: '2026-10-22', dukaz: 'zdroj 19. 12. 2022 7 127,38 → 56,48 (×0,008); Milán 3USS.MI 16.→19. 12. ×1,02; zasaženo 5R −99,9 %' },
  'XS2337090851': { ticker: '3BBE', druh: 'skok', den: '2022-01-03', overeno: '2026-10-22', dukaz: 'zdroj 3. 1. 2022 96,41 → 0,52 (×0,005); Xetra 3BBE.DE tehdy bez obchodu; zasaženo 5R −99,7 %' },
  'XS2656472193': { ticker: '3LTS', druh: 'skok', den: '2022-01-03', overeno: '2026-10-22', dukaz: 'zdroj 3. 1. 2022 435,93 → 76 384,85 (×175); Milán 3LTS.MI 30. 12.→4. 1. ×1,09; zasaženo 5R −99,6 %' },
  'XS2671672819': { ticker: '3SFB', druh: 'skok', den: '2022-01-03', overeno: '2026-10-22', dukaz: 'zdroj 3. 1. 2022 436,76 → 0,43 (×0,001); Londýn 3SFE.L 23. 12.→4. 1. ×0,99; zasaženo 5R −100 %' },
  'DE000EWG2LD7': { ticker: 'EWG2', druh: 'sum', overeno: '2026-10-22', dukaz: 'zdroj vs. Stuttgart EWG2: sd denní odchylky 1,3–1,6 % (Xetra-Gold 0–0,4 %); 1R zdroj +1,01 %, burza 20. 10. 2025→2026 122,51 → 120,50 € −1,64 %, 4GLD −1,33 %; 1M zdroj −0,96 %, burza −3,12 %' },
  'DE000TMG0LD6': { ticker: 'TMGD', druh: 'sum', overeno: '2026-10-22', dukaz: 'vlastní šum řady proti skupině fyzického zlata 1,14 % (60 dní; medián skupiny 0,44 %); 1R +1,07 % a 1M −0,89 % vs. medián zlata −0,44 % / −3,08 % ke stejnému dni' },
  'IE000D3BWBR2': { ticker: 'I50D', druh: 'dividenda', den: '2026-10-15', overeno: '2026-10-22', dukaz: 'Yahoo I50D.AS i I50D.L dividenda ex 15. 10. 2026 (0,0398 USD ≈ 0,46 %), zdroj ji nemá; 1R 19,55 % vs. akumulační I500 20,23 % při stejném TER' },
  'IE000FO05UG4': { ticker: 'XISP', druh: 'dividenda', den: '2026-08-19', overeno: '2026-10-22', dukaz: 'Yahoo XISP.DE ex 19. 8. 2026 0,1905 € (≈ 0,51 %), zdroj ji nemá – v ex-den cena −0,52 %, řada s dividendami také −0,52 %; 1R 19,52 % vs. X500 20,19 %' },
  'IE00B5M4WH52': { ticker: 'IUSP', druh: 'dividenda', den: '2026-10-15', overeno: '2026-10-22', dukaz: 'Yahoo SEML.MI ex 15. 10. 2026 0,5628 € (≈ 1,41 %), zdroj ji nemá – v ex-den cena i řada s dividendami −1,06 %' },
  'IE00BG0J4957': { ticker: 'UDHY', druh: 'dividenda', den: '2026-10-15', overeno: '2026-10-22', dukaz: 'Yahoo HYUS.L ex 15. 10. 2026 0,0835 USD (≈ 1,87 %), zdroj ji nemá – cena i řada s dividendami −1,48 / −1,45 %' },
  'IE00B2NPKV68': { ticker: 'IUS7', druh: 'dividenda', den: '2026-10-15', overeno: '2026-10-22', dukaz: 'Yahoo IEMB.MI ex 15. 10. 2026 0,3926 € (≈ 0,50 %), zdroj od 7. 10. žádnou dividendu nemá' },
  'IE00B9M6RS56': { ticker: 'IS3C', druh: 'dividenda', den: '2026-10-15', overeno: '2026-10-22', dukaz: 'Yahoo EMBE.MI ex 15. 10. 2026 0,333 € (≈ 0,52 %), zdroj od 7. 10. žádnou dividendu nemá' },
};
export const NEOVERENE_ISINY: ReadonlySet<string> = new Set(Object.keys(NEOVERENE_VYNOSY));

const datumCz = (iso: string) => { const [r, m, d] = iso.split('-').map(Number); return `${d}. ${m}. ${r}`; };

/** Vysvětlivka pro konkrétní fond ze seznamu B (detail fondu), jinak null. */
export function duvodNeovereni(isin: string): string | null {
  const z = NEOVERENE_VYNOSY[isin];
  if (!z) return null;
  if (z.druh === 'skok') return `Výnosy za období neukazujeme: v denních cenách u zdroje dat je${z.den ? ` ${datumCz(z.den)}` : ''} skok, který cena na burze nemá – je to chyba dat, ne pohyb trhu.`;
  if (z.druh === 'sum') return 'Výnosy za období neukazujeme: denní ceny tohoto produktu u zdroje dat kolísají kolem ceny na burze o víc než procento denně, takže výnos k jednomu dni může být o 1–3 p. b. vedle.';
  return `Výnosy za období neukazujeme: zdroj dat nemá poslední vyplacenou dividendu (ex-den ${z.den ? datumCz(z.den) : '—'}), takže výnos s reinvesticí dividend vychází nižší, než ve skutečnosti byl.`;
}

/** Odlehlé z trhů ∪ ověřené chyby zdroje (seznam B) – jeden seznam pro detail, žebříčky, srovnávač, porovnání i hledání. */
export function sNeoverenymi(odlehle: ReadonlySet<string> | Iterable<string>): Set<string> {
  return new Set([...odlehle, ...NEOVERENE_ISINY]);
}

/** Kopie řádku bez výnosů za období (jen pole, která řádek má) + značka `_vynosNeovereny`. */
export function bezVynosuObdobi<T extends object>(radek: T): T & { _vynosNeovereny: true } {
  const out: Record<string, unknown> = { ...(radek as Record<string, unknown>), _vynosNeovereny: true };
  for (const k of Object.keys(out)) if (VYNOS_OBDOBI.test(k)) out[k] = null;
  return out as T & { _vynosNeovereny: true };
}

const neovereny = (isin: string, odlehle: ReadonlySet<string>) => odlehle.has(isin) || NEOVERENE_ISINY.has(isin);

/** Řádky fondů: odlehlým a ověřeně chybným (seznam B) výnosy za období vynulovat, ostatní beze změny (stejné pořadí). */
export function bezOdlehlychVynosu<T extends { isin: string }>(radky: T[], odlehle: ReadonlySet<string>): T[] {
  return radky.map((r) => (neovereny(r.isin, odlehle) ? bezVynosuObdobi(r) : r));
}

/** Jeden fond (nebo null). */
export function bezOdlehlehoVynosu<T extends { isin: string }>(radek: T | null | undefined, odlehle: ReadonlySet<string>): T | null {
  if (!radek) return null;
  return neovereny(radek.isin, odlehle) ? bezVynosuObdobi(radek) : radek;
}
