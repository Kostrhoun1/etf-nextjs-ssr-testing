/**
 * GRAF VÝVOJE INDEXU V KČ NA DETAILU FONDU – čisté funkce bez sítě (úkol 3.3, varianta A schválená majitelem 11. 11. 2026).
 *
 * Data připravuje src/lib/vyvojIndexu.ts (stejná cesta jako backtest: loadIndexData → convertIndexSeriesToCurrency do Kč).
 * Tady jen: výběr konců měsíců, osa Y, souřadnice čáry. Test: scripts/vyvojIndexu.test.mjs (ruční očekávání, bez sítě).
 *
 * PRAVIDLO Č. 1: graf ukazuje JEN index (zdrojový fond dat backtestu), nikdy ho nevydávat za cenu fondu na stránce.
 * Proto žádné procento výnosu ani „kolik by bylo“ – jen hladina v Kč s popisem, z čeho je, a datem.
 */

export interface BodGrafu {
  /** Den bodu YYYY-MM-DD (poslední obchodní den měsíce s kurzem; u posledního měsíce poslední den dat). */
  d: string;
  /** Hodnota v Kč (cena podílu zdrojového fondu s reinvestovanými výplatami × kurz). */
  v: number;
}

/** Nejméně tolik měsíčních bodů, jinak graf nemá smysl (a spíš jde o výpadek dat) – bez grafu. */
export const MIN_BODU = 24;

const iso = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Poslední bod každého kalendářního měsíce (řada seřazená vzestupně). Poslední bod řady je vždy zahrnutý
 * (= „data k“ u nedokončeného měsíce). Neplatné hodnoty (≤ 0, NaN) se vynechají – ne nahradí.
 */
export function mesicniBody(rada: Array<{ date: Date; closePrice: number }>): BodGrafu[] {
  const platne = rada.filter((b) => Number.isFinite(b.closePrice) && b.closePrice > 0 && !Number.isNaN(b.date.getTime()));
  const out: BodGrafu[] = [];
  for (let i = 0; i < platne.length; i++) {
    const dalsi = platne[i + 1];
    const d = iso(platne[i].date);
    if (!dalsi || iso(dalsi.date).slice(0, 7) !== d.slice(0, 7)) out.push({ d, v: platne[i].closePrice });
  }
  return out;
}

/** „Hezké“ dílky osy Y (1–2–2,5–5 × 10^k), 3–6 čar mezi minimem a maximem. */
export function osaY(min: number, max: number): { od: number; do: number; dilky: number[] } {
  if (!(max > min)) { const m = Math.abs(min) || 1; return osaY(min - m * 0.1, max + m * 0.1); }
  const hruby = (max - min) / 4;
  const mocnina = Math.pow(10, Math.floor(Math.log10(hruby)));
  const krok = [1, 2, 2.5, 5, 10].map((k) => k * mocnina).find((k) => k >= hruby) ?? 10 * mocnina;
  const od = Math.floor(min / krok) * krok;
  const doH = Math.ceil(max / krok) * krok;
  const dilky: number[] = [];
  for (let x = od; x <= doH + krok / 1e6; x += krok) dilky.push(Math.round(x * 1e6) / 1e6);
  return { od, do: doH, dilky };
}

/** Roky na ose X: krok 1/2/5/10 let tak, aby popisků bylo nejvýš 6. Vrací roky, jejichž 1. leden leží v rozsahu dat. */
export function rokyOsyX(prvni: string, posledni: string): number[] {
  const r1 = Number(prvni.slice(0, 4)), r2 = Number(posledni.slice(0, 4));
  const krok = [1, 2, 5, 10].find((k) => Math.floor((r2 - r1) / k) + 1 <= 6) ?? 10;
  const out: number[] = [];
  for (let r = Math.ceil((r1 + 1) / krok) * krok; r <= r2; r += krok) out.push(r);
  return out;
}

/** Pozice dne na ose X (0–1) podle skutečného času, ne pořadí bodu. */
export function poziceX(den: string, prvni: string, posledni: string): number {
  const t0 = Date.parse(prvni), t1 = Date.parse(posledni);
  return t1 > t0 ? (Date.parse(den) - t0) / (t1 - t0) : 0;
}

/**
 * Atribut `d` čáry pro SVG s viewBox 0 0 `sirka` `vyska` (Y dolů). Kompaktně kvůli velikosti HTML (detail je předgenerovaný
 * a čára je v HTML i v datech RSC): celočíselné souřadnice (1 jednotka = 0,1 % šířky / 0,3 % výšky – pod rozlišením
 * grafu) a relativní úseky „l dx dy“ mezi ZAOKROUHLENÝMI body (chyba se nesčítá). ~320 bodů ≈ 1,7 kB.
 * Rozsah Y = osa (od–do), ne min/max dat, ať čára sedí na mřížce.
 */
export function cestaCary(body: BodGrafu[], osa: { od: number; do: number }, sirka: number, vyska: number): string {
  if (body.length < 2) return '';
  const prvni = body[0].d, posledni = body[body.length - 1].d;
  const xy = body.map((b) => [
    Math.round(poziceX(b.d, prvni, posledni) * sirka),
    Math.round(vyska - ((b.v - osa.od) / (osa.do - osa.od)) * vyska),
  ]);
  const cislo = (n: number) => (n < 0 ? `${n}` : ` ${n}`); // záporné číslo nepotřebuje oddělovač
  let d = `M${xy[0][0]}${cislo(xy[0][1])}`;
  for (let i = 1; i < xy.length; i++) d += `l${xy[i][0] - xy[i - 1][0]}${cislo(xy[i][1] - xy[i - 1][1])}`;
  return d;
}

/**
 * Kontrolní body pro denní kontrolu a nezávislé ověření (začátek, střed, konec) – „YYYY-MM-DD:hodnota“ oddělené „|“.
 * Hodnota na 2 desetinná místa (Kč). Nese je atribut data-kontrola grafu (~60 bajtů).
 */
export function kontrolniBody(body: BodGrafu[]): string {
  if (body.length === 0) return '';
  const vyber = [body[0], body[Math.floor((body.length - 1) / 2)], body[body.length - 1]];
  return vyber.map((b) => `${b.d}:${b.v.toFixed(2)}`).join('|');
}
