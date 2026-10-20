/* Modelový příklad dopadu poplatků (/pruvodce, kolo 6, 20. 10. 2026). Čísla se počítají, ne píšou natvrdo;
   check-fund-data.mjs (kolo6 zebricky) je přepočítá nezávisle z data-atributů stránky. */

/** Hodnota pravidelného měsíčního vkladu (na konci měsíce) po `let` letech při ročním výnosu `rocne`.
 *  Měsíční sazba je EFEKTIVNÍ (1 + r)^(1/12) − 1, ne r/12 (ZAMERNA-ROZHODNUTI.md – investiční kalkulačka). */
export function hodnotaVkladu(mesicne: number, let_: number, rocne: number): number {
  const m = Math.pow(1 + rocne, 1 / 12) - 1;
  let v = 0;
  for (let i = 0; i < let_ * 12; i++) v = v * (1 + m) + mesicne;
  return v;
}
/** Modelový příklad poplatků na /pruvodce – vstupy na jednom místě (kontrola v check-fund-data.mjs je přepočítá). */
export const PRIKLAD_POPLATKU = { mesicne: 10_000, let: 20, hrubyVynos: 0.07, terLevny: 0.002, terDrahy: 0.018 };
