/**
 * JEDNOTNÉ FORMÁTY ČÍSEL (kolo 5, 18. 10. 2026) – detail fondu a stránky srovnání dvou fondů.
 *
 * - záporná čísla znaménkem minus „−“ (U+2212), ne spojovníkem (cs-CZ toLocaleString dává „-“),
 * - mezi číslem a „%“ / „€“ / „Kč“ nezlomitelná mezera (U+00A0) – „12,5 %“ se nerozdělí na dva řádky,
 * - velikost fondu „139,4 mld. €“ / „529 mil. €“ (s tečkou),
 * - výnosy 1 desetinné místo, TER 2, desetinná čárka.
 *
 * Velikost fondu je ze zdroje (justETF) VŽDY v EUR, i u USD tříd – proto vždy „€“.
 */
export const NBSP = ' ';
export const MINUS = '−';

/** Číslo v češtině s pevným počtem desetinných míst a skutečným minusem. */
export function cislo(v: number, des = 1): string {
  // Zaokrouhlení na zobrazená místa PŘED znaménkem: −0,04 → „0,0“, ne „−0,0“.
  const r = Math.round(v * 10 ** des) / 10 ** des || 0;
  return r.toLocaleString('cs-CZ', { minimumFractionDigits: des, maximumFractionDigits: des }).replace('-', MINUS);
}

/** Výnos „+12,5 %“ / „−15,9 %“ / „—“. `znamenko: false` = bez „+“ (kolísavost, dividendový výnos). */
export function procenta(v: number | null | undefined, des = 1, znamenko = true): string {
  if (v == null || Number.isNaN(Number(v))) return '—';
  const r = Math.round(Number(v) * 10 ** des) / 10 ** des || 0;
  return `${znamenko && r > 0 ? '+' : ''}${cislo(r, des)}${NBSP}%`;
}

/** Roční poplatek „0,07 %“. */
export const terFmt = (v: number | null | undefined) => procenta(v, 2, false);

/** Velikost fondu (vstup v mil. EUR): „139,4 mld. €“ / „529 mil. €“. */
export function velikostFondu(v: number | null | undefined): string {
  if (v == null || Number.isNaN(Number(v))) return '—';
  const n = Number(v);
  if (n >= 1000) return `${cislo(n / 1000, 1)}${NBSP}mld.${NBSP}€`;
  return `${Math.round(n).toLocaleString('cs-CZ')}${NBSP}mil.${NBSP}€`;
}

/** Celé číslo s mezerou po tisících („3 655“) – cs-CZ dává nezlomitelnou mezeru. */
export const celeCislo = (v: number | null | undefined) =>
  v == null || Number.isNaN(Number(v)) ? '—' : Math.round(Number(v)).toLocaleString('cs-CZ').replace('-', MINUS);
