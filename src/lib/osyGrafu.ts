/**
 * Kulaté osy grafů (revize 18. 10. 2026 – backtest a investiční kalkulačka).
 * Dřív recharts volil kroky sám („2,3 mil.“, „750 tis.“, „7,5 mil. Kč“ zalomené na dva řádky,
 * horní hodnota uříznutá). Teď kroky 1/2/2,5/5 × 10^n a jednotka v nadpisu grafu, ne na ose.
 */

function kroky(max: number, min: number, cil: number): number[] {
  const rozsah = Math.max(max - min, 1e-9);
  const hrubyKrok = rozsah / cil;
  const rad = Math.pow(10, Math.floor(Math.log10(hrubyKrok)));
  const krok = [1, 2, 2.5, 5, 10].map((k) => k * rad).find((k) => k >= hrubyKrok - 1e-9) ?? 10 * rad;
  const out: number[] = [];
  for (let v = Math.floor(min / krok + 1e-9) * krok; v < max + krok - 1e-9; v += krok) out.push(Math.round(v * 1e6) / 1e6);
  return out;
}

/** Hodnoty osy od min (zaokrouhleně dolů) po max (zaokrouhleně nahoru); vybere variantu s nejmenším přesahem. */
export function kulateKroky(max: number, min = 0, cil = 4): number[] {
  const a = kroky(max, min, cil), b = kroky(max, min, cil + 1);
  const presah = (t: number[]) => (t[t.length - 1] - t[0]) - (max - min);
  return presah(b) < presah(a) ? b : a;
}

/** Číslo na osu bez jednotky: „2,5 mil.“, „500 tis.“, „0“. Jednotka patří do nadpisu grafu. */
export const fmtOsa = (v: number) => {
  const a = Math.abs(v);
  if (a >= 1_000_000) return `${(v / 1_000_000).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })}\u00a0mil.`;
  if (a >= 1_000) return `${(v / 1000).toLocaleString('cs-CZ', { maximumFractionDigits: 0 })}\u00a0tis.`;
  return v.toLocaleString('cs-CZ', { maximumFractionDigits: 0 });
};
