/**
 * ODLEHLÝ VÝNOS VŠUDE STEJNĚ (kontrolní revize kola 6b, 21. 10. 2026).
 *
 * Fond, jehož výnos za 12 měsíců v Kč se liší o víc než 1,5 p. b. od mediánu fondů na stejný trh
 * (src/lib/trhy.ts, `odlehle`; seznam trhů src/data/trhyDvojcata.ts), má nejčastěji opožděnou poslední
 * cenu u zdroje dat. Detail fondu jeho výnosy za období neukazuje („—“) a /metodika to slibuje – dřív
 * je ale ukazovaly žebříčky, srovnávač i porovnání (XSXD +24,9 % v EUR, zdroj +20,05 %, 1. při řazení
 * podle výnosu). Teď JEDNO pravidlo pro celý web:
 *   - seznam odlehlých ISINů: `odlehleIsiny()` v src/lib/trhy.ts (React cache nad `nactiTrhy` – žádný dotaz navíc
 *     tam, kde stránka trhy už načítá; detail fondu),
 *   - výnosy za období → null: `bezVynosuObdobi` / `bezOdlehlychVynosu` (tento soubor – čistý, jde i do klienta),
 *   - vysvětlivka u „—“: `VYNOS_NEOVERENY_TEXT`.
 * Kalendářní roky (return_2021…2025) zůstávají – jsou uzavřené a opožděná dnešní cena je neovlivní (stejně jako detail).
 * Hlídá scripts/check-fund-data.mjs (blok kolo6b detail): odlehlý ISIN nesmí mít číslo výnosu v žebříčku,
 * v /api/etf/screener ani v porovnání.
 */

/** Výnosy za období, které opožděná poslední cena zkreslí (všechny měny a varianty sloupců v DB: _czk, _usd, _percent),
 *  i „výnos / riziko“ (počítá se z téhož výnosu). Kalendářní roky (return_2021…) a returns_as_of (datum) NE. */
export const VYNOS_OBDOBI = /^(?:return_(?:1m|3m|6m|ytd|1y|3y|5y|10y|inception)(?:_czk|_usd|_percent)?|ytd_return_percent|return_per_risk_(?:1y|3y|5y))$/;
export const VYNOS_NEOVERENY_TEXT =
  'Výnosy za období neukazujeme: výnos za 12 měsíců se u tohoto fondu lišil o víc než 1,5 p. b. od ostatních fondů na stejný trh – nejčastěji kvůli opožděné ceně u zdroje dat.';

/** Kopie řádku bez výnosů za období (jen pole, která řádek má) + značka `_vynosNeovereny`. */
export function bezVynosuObdobi<T extends object>(radek: T): T & { _vynosNeovereny: true } {
  const out: Record<string, unknown> = { ...(radek as Record<string, unknown>), _vynosNeovereny: true };
  for (const k of Object.keys(out)) if (VYNOS_OBDOBI.test(k)) out[k] = null;
  return out as T & { _vynosNeovereny: true };
}

/** Řádky fondů: odlehlým výnosy za období vynulovat, ostatní beze změny (stejné pořadí). */
export function bezOdlehlychVynosu<T extends { isin: string }>(radky: T[], odlehle: ReadonlySet<string>): T[] {
  if (!odlehle.size) return radky;
  return radky.map((r) => (odlehle.has(r.isin) ? bezVynosuObdobi(r) : r));
}

/** Jeden fond (nebo null). */
export function bezOdlehlehoVynosu<T extends { isin: string }>(radek: T | null | undefined, odlehle: ReadonlySet<string>): T | null {
  if (!radek) return null;
  return odlehle.has(radek.isin) ? bezVynosuObdobi(radek) : radek;
}
