/**
 * Formáty čísel pro sekci Faktorové ETF (kolo 8, 22. 10. 2026).
 * Minus = „−“ (U+2212), mezi číslem a jednotkou nezlomitelná mezera – stejně jako src/lib/formatyCisel.ts.
 * Vstupy jsou DESETINNÉ (0,054 = 5,4 %), protože tak je vrací backtest engine.
 */
import { procenta, cislo, celeCislo, NBSP } from '@/lib/formatyCisel';

/** Výnos „+5,4 %“ / „−64,1 %“ (vstup desetinný). */
export const pct = (v: number | null | undefined, des = 1) => (v == null ? '—' : procenta(v * 100, des));
/** Bez znaménka plus (propady se píšou s minusem i tak, kolísavost bez znaménka). */
export const pctBez = (v: number | null | undefined, des = 1) => (v == null ? '—' : procenta(v * 100, des, false));
/** Rozdíl v procentních bodech „1,8 p. b.“ (absolutní hodnota, vstup desetinný). */
export const pb = (v: number, des = 1) => `${cislo(Math.abs(v) * 100, des)}${NBSP}p.${NBSP}b.`;
/** Částka v Kč zaokrouhlená na tisíce: „443 000 Kč“. */
export const kc = (v: number | null | undefined) => (v == null ? '—' : `${celeCislo(Math.round(v / 1000) * 1000)}${NBSP}Kč`);
/** Krátce do grafu a tabulky: „443 tis. Kč“ / „1,2 mil. Kč“. */
export const kcKratce = (v: number | null | undefined) => {
  if (v == null) return '—';
  if (v >= 1_000_000) return `${cislo(v / 1_000_000, 1)}${NBSP}mil.${NBSP}Kč`;
  return `${celeCislo(Math.round(v / 1000))}${NBSP}tis.${NBSP}Kč`;
};
/** ISO den → „20. 10. 2026“. */
export const den = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${d}.${NBSP}${m}.${NBSP}${y}`;
};
/** ISO den → „5/2000“ (přesné okno místo pouhého roku). */
export const mesic = (iso: string) => {
  const [y, m] = iso.slice(0, 10).split('-').map(Number);
  return `${m}/${y}`;
};
/** Počet měsíců česky: „1 měsíc“, „3 měsíce“, „158 měsíců (13 let)“. */
export const mesicu = (n: number) => {
  const slovo = n === 1 ? 'měsíc' : n >= 2 && n <= 4 ? 'měsíce' : 'měsíců';
  const roky = Math.floor(n / 12);
  return roky >= 2 ? `${n}${NBSP}${slovo} (přes ${roky}${NBSP}${roky <= 4 ? 'roky' : 'let'})` : `${n}${NBSP}${slovo}`;
};
/** „1 rok“, „5 let“, „26 let“ (celé roky). */
export const let_ = (n: number) => `${n}${NBSP}${n === 1 ? 'rok' : n >= 2 && n <= 4 ? 'roky' : 'let'}`;
/** „5×“ */
export const krat = (n: number) => `${n}×`;
/** Počet faktorů slovy (1–6) – „dva ze šesti“. */
export const slovy = (n: number, rod: 'm' | 'z' = 'm') =>
  (rod === 'm'
    ? ['žádný', 'jeden', 'dva', 'tři', 'čtyři', 'pět', 'šest']
    : ['žádná', 'jedna', 'dvě', 'tři', 'čtyři', 'pět', 'šest'])[n] ?? String(n);
/** Roční poplatek „0,20 %“ (vstup v procentech, jak je v etf_funds.ter_numeric). */
export const ter = (v: number | null | undefined) => (v == null ? '—' : procenta(v, 2, false));
export { NBSP };
