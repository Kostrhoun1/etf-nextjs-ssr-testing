/* Modelový příklad dopadu poplatků (/pruvodce, kolo 6, 20. 10. 2026). Čísla se počítají, ne píšou natvrdo;
   check-fund-data.mjs (kolo6 zebricky, bod 7) je přepočítá nezávisle z data-atributů stránky. */

/** Hodnota pravidelného měsíčního vkladu (na konci měsíce) po `let` letech při ročním výnosu `rocne`.
 *  Měsíční sazba je EFEKTIVNÍ (1 + r)^(1/12) − 1, ne r/12 (ZAMERNA-ROZHODNUTI.md – investiční kalkulačka). */
export function hodnotaVkladu(mesicne: number, let_: number, rocne: number): number {
  const m = Math.pow(1 + rocne, 1 / 12) - 1;
  let v = 0;
  for (let i = 0; i < let_ * 12; i++) v = v * (1 + m) + mesicne;
  return v;
}

/** Roční výnos PO poplatku fondu: TER se strhává z hodnoty fondu, ne z výnosu → (1 + r) × (1 − TER) − 1.
 *  Stejně jako /kalkulacka (FeeCalculatorWidget). Audit nástrojů 22. 10. 2026 (V4): dřív r − TER → u 7 % a TER 1,8 %
 *  5,2 % místo 5,074 % a rozdíl levný/drahý fond 813 000 místo 862 465 Kč. */
export function vynosPoPoplatku(hrubyVynos: number, ter: number): number {
  return (1 + hrubyVynos) * (1 - ter) - 1;
}

/** Modelový příklad poplatků na /pruvodce – vstupy na jednom místě (kontrola v check-fund-data.mjs je přepočítá). */
export const PRIKLAD_POPLATKU = { mesicne: 10_000, let: 20, hrubyVynos: 0.07, terLevny: 0.002, terDrahy: 0.018 };
