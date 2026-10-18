/**
 * Jednotné formáty čísel srovnávače a porovnání fondů (kolo 5, 18. 10. 2026):
 * desetinná čárka, záporná čísla znaménkem minus „−“ (U+2212, ne spojovník), nezlomitelná mezera před „%“
 * a jednotkou, výnosy na 1 desetinné místo, TER na 2, velikost „139,4 mld. €“ / „529 mil. €“.
 * Chybějící údaj = „—“.
 */
const NBSP = ' ';
const MINUS = '−';

/** Číslo s desetinnou čárkou a pevným počtem míst; záporné s „−“. */
export function cislo(v: number, mist = 1): string {
  const s = Math.abs(v).toLocaleString('cs-CZ', { minimumFractionDigits: mist, maximumFractionDigits: mist });
  // Záporné, které se po zaokrouhlení ukáže jako nula, nemá znaménko („−0,0 %“ by mátlo).
  return v < 0 && Number(Math.abs(v).toFixed(mist)) !== 0 ? `${MINUS}${s}` : s;
}

/** Procenta: „12,5 %“, „−3,1 %“; `plus` = kladné se znaménkem („+12,5 %“) – u výnosů. */
export function procenta(v: number | null | undefined, mist = 1, plus = false): string {
  if (v == null || Number.isNaN(Number(v))) return '—';
  const n = Number(v);
  const kladne = plus && n > 0 && Number(n.toFixed(mist)) !== 0;
  return `${kladne ? '+' : ''}${cislo(n, mist)}${NBSP}%`;
}

/** Roční poplatek (TER) na 2 desetinná místa. */
export const terText = (v: number | null | undefined) => procenta(v, 2);

/** Velikost fondu (vstup v mil. EUR – zdroj ji vede vždy v eurech). */
export function velikostText(v: number | null | undefined): string {
  if (v == null || Number.isNaN(Number(v))) return '—';
  const n = Number(v);
  if (n >= 1000) return `${cislo(n / 1000, 1)}${NBSP}mld.${NBSP}€`;
  return `${Math.round(n).toLocaleString('cs-CZ')}${NBSP}mil.${NBSP}€`;
}

/** Hodnota v přesnosti, v jaké se zobrazuje (pro „nejlepší v řádku“: shoda po zaokrouhlení = shoda). */
export const zaokrouhleno = (v: number, mist: number) => Math.round(v * 10 ** mist) / 10 ** mist;
