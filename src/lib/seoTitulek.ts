/**
 * Titulek stránky do 65 znaků (SEO audit 6b, 21. 10. 2026).
 *
 * Layout přidává šablonou „ | ETF průvodce.cz“ (18 znaků). Kde by se celý titulek nevešel do 65 znaků,
 * vrátí se `absolute` – BEZ přípony (obsah titulku má přednost před značkou webu, stejně jako u žebříčků).
 * Samotný text titulku musí mít ≤ 65 znaků; hlídá check-fund-data.mjs (blok kolo6b seo obsah).
 */
export const PRIPONA_ZNACKY = ' | ETF průvodce.cz';
export const MAX_TITULEK = 65;

export function titulek(t: string): string | { absolute: string } {
  return t.length + PRIPONA_ZNACKY.length <= MAX_TITULEK ? t : { absolute: t };
}
