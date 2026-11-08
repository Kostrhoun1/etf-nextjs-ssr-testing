/**
 * Kalendářní roky výnosů fondů (sloupce return_<rok>, _czk, _usd v etf_funds) – JEDEN seznam pro detail fondu,
 * dvojice srovnání a kontroly (8. 11. 2026). justETF ukazuje posledních 5 uzavřených let; v lednu 2027 přidá 2026.
 * Sloupce 2026 a 2027 jsou v DB předem (migrace etf_funds_kalendarni_roky_2026_2027), scraper je plní sám
 * (etf-astro performance_converter.KALENDARNI_ROKY). Ukazují se jen uzavřené roky, a jen když mají data.
 * Rok 2028+: přidat sem, do scraperu a migrací sloupců.
 */
export const KALENDARNI_ROKY = [2021, 2022, 2023, 2024, 2025, 2026, 2027] as const;

/** Uzavřené roky (< letošní) – kandidáti do grafu a tabulek; prázdné se odfiltrují podle dat. */
export const uzavreneRoky = (dnes: Date = new Date()): number[] => KALENDARNI_ROKY.filter((r) => r < dnes.getFullYear());
