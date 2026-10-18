/**
 * Jedna paleta pro fondy ve všech srovnáních (graf, legenda, karty fondů) – kolo 3, 18. 10. 2026.
 * Pořadí = pořadí fondu ve srovnání. Stejné API jako u vývojáře srovnávače (sloučit, ne duplikovat).
 */
export const BARVY_FONDU = ['#0f766e', '#7c3aed', '#d97706', '#0284c7'];

/** Barva i-tého fondu (cyklicky, kdyby fondů bylo víc než barev). */
export function barvaFondu(i: number): string {
  return BARVY_FONDU[((i % BARVY_FONDU.length) + BARVY_FONDU.length) % BARVY_FONDU.length];
}
