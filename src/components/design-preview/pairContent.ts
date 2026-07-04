/* Kurátorský obsah pro konkrétní „X vs Y" souboje (nový design).
 *
 * Šablona /design-preview/srovnani/[pair] funguje pro LIBOVOLNOU dvojici čistě
 * z dat (výnosy, TER, velikost, index) – každá stránka je tak unikátní. Tady
 * navíc přidáváme REDAKČNÍ úhel pro nejžádanější dvojice (proč zrovna tenhle
 * souboj, komu co sedí), aby top stránky nebyly jen datové.
 *
 * Klíč = pair slug „ticker1-vs-ticker2" (malými písmeny), musí sedět s tím, jak
 * je stránka volaná. Vše je volitelné – co chybí, dožene datová šablona.
 */

export interface PairFaq {
  q: string;
  a: string;
}

export interface PairContent {
  /** 1–3 odstavce: proč tenhle souboj lidi řeší a co je jádro rozdílu. */
  intro?: string[];
  /** Redakční verdikt po fondech (kdy zvolit který). */
  pick1?: string;
  pick2?: string;
  /** Doplňkové FAQ specifické pro tuhle dvojici (nad rámec datových). */
  faqs?: PairFaq[];
}

export const pairContent: Record<string, PairContent> = {};

export function getPairContent(slug: string): PairContent | null {
  return pairContent[slug.toLowerCase()] ?? null;
}
