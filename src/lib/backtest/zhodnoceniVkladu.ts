/**
 * „Roční zhodnocení vašich vkladů“ (XIRR) – prezentační vrstva backtestu, NEmění výpočetní jádro.
 *
 * PROČ (test s uživatelkou 18. 10. 2026): při pravidelných vkladech ukazoval backtest jen CAGR (časově
 * vážený výnos portfolia, např. 8,8 %), kalkulačka se stálým výnosem 8 % dala 1,15 mil. Kč a backtest
 * 1,77 mil. Kč – vypadalo to jako rozpor. Číslo srovnatelné s kalkulačkou je vnitřní výnosové procento
 * peněžních toků: jaký STÁLÝ roční výnos by ze stejných vkladů ve stejných dnech udělal stejnou částku.
 *
 * Peněžní toky se rekonstruují ze stejného pravidla jako engine (combinePortfolio → shouldContribute):
 * počáteční vklad v den prvního bodu, pravidelný vklad v první obchodní den nového měsíce/čtvrtletí/roku.
 * Kontrola: součet vkladů musí sedět s `amountInvested` z enginu, jinak vracíme null (pravidlo č. 1).
 */

export type Frekvence = 'none' | 'monthly' | 'quarterly' | 'yearly';

const obdobi = (d: Date, f: Frekvence) =>
  f === 'monthly' ? d.getUTCFullYear() * 12 + d.getUTCMonth()
    : f === 'quarterly' ? d.getUTCFullYear() * 4 + Math.floor(d.getUTCMonth() / 3)
      : d.getUTCFullYear();

/** Kumulativně vloženo k jednotlivým bodům řady + seznam vkladů (datum, částka). */
export function vkladyVCase(evolution: { date: string }[], pocatecni: number, vklad: number, f: Frekvence) {
  const kumul: number[] = [];
  const toky: { t: number; castka: number }[] = [];
  let suma = pocatecni;
  if (evolution.length && pocatecni > 0) toky.push({ t: Date.parse(evolution[0].date), castka: pocatecni });
  for (let i = 0; i < evolution.length; i++) {
    if (i > 0 && f !== 'none' && vklad > 0) {
      const d = new Date(evolution[i].date), p = new Date(evolution[i - 1].date);
      if (obdobi(d, f) !== obdobi(p, f)) { suma += vklad; toky.push({ t: d.getTime(), castka: vklad }); }
    }
    kumul.push(suma);
  }
  return { kumul, toky, celkem: suma };
}

const ROK_MS = 365.25 * 864e5;

/**
 * XIRR: roční sazba r, při níž Σ vklad·(1+r)^((T−t)/rok) = konečná hodnota. Bisekce (monotónní funkce),
 * přesnost 1e-9. null, když řešení v rozumném rozsahu (−99 % až +1000 %) neexistuje.
 */
export function xirr(toky: { t: number; castka: number }[], konecT: number, konecHodnota: number): number | null {
  if (!toky.length || !(konecHodnota > 0)) return null;
  const f = (r: number) => toky.reduce((s, x) => s + x.castka * Math.pow(1 + r, (konecT - x.t) / ROK_MS), 0) - konecHodnota;
  let lo = -0.99, hi = 10;
  let flo = f(lo), fhi = f(hi);
  if (flo > 0 || fhi < 0) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2, fm = f(mid);
    if (Math.abs(fm) < 1e-9 * konecHodnota) return mid;
    if (fm < 0) { lo = mid; flo = fm; } else { hi = mid; fhi = fm; }
  }
  return (lo + hi) / 2;
}

/** Zhodnocení vkladů z výsledku backtestu; null když se vklady nedají spolehlivě zrekonstruovat. */
export function zhodnoceniVkladu(
  evolution: { date: string; value: number }[], pocatecni: number, vklad: number, f: Frekvence, amountInvested: number,
): number | null {
  if (evolution.length < 2) return null;
  const { toky, celkem } = vkladyVCase(evolution, pocatecni, vklad, f);
  if (Math.abs(celkem - amountInvested) >= 1) return null;
  const konec = evolution[evolution.length - 1];
  return xirr(toky, Date.parse(konec.date), konec.value);
}
