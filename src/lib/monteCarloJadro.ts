/**
 * Jádro Monte Carlo simulace pro /monte-carlo (MonteCarloWidget). Čistý TS bez Reactu – testuje ho
 * scripts/monteCarlo.test.mjs (npm test).
 *
 * Model: měsíční log výnos aktiva ~ N(ln(1+r)/12, σ/√12), korelace Choleského rozkladem, vklad na začátku měsíce,
 * portfolio = vážený součet jednoduchých výnosů (měsíční rebalancování). Předpoklady z historie ETF:
 * src/lib/monteCarloPredpoklady.ts.
 *
 * ANTITETICKÉ CESTY (8. 11. 2026, zlatý případ fire-14): cesty se počítají po dvojicích – druhá cesta dvojice má
 * v každém měsíci tytéž korelované normály s opačným znaménkem. Pevné semínko ze vstupů a jen 600 scénářů dřív dalo
 * u „Všepočasní, 500 000 + 2 000 Kč měsíčně, 50 let“ medián 15,3 mil. místo ~16,8 mil. (−3,5σ, ověřeno nezávislým
 * numpy modelem 200 000 cest) – každý návštěvník s těmito vstupy viděl „15 mil.“. Antitetické páry ruší společný
 * posun průměru náhodného proudu: rozptyl mediánu mezi semínky 365 tis. → 72 tis., rozdělení se nemění.
 */
import { MC_PREDPOKLADY, type McAktivum } from '@/lib/monteCarloPredpoklady';

export type AssetAllocation = Record<McAktivum, number>;

export interface SimulationResult {
  year: number;
  percentile5: number;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile95: number;
  mean: number;
}

export interface SimulationParameters {
  allocation: AssetAllocation;
  initialInvestment: number;
  monthlyContribution: number;
  years: number;
  simulations: number;
  seed: number;
}

const ASSETS = MC_PREDPOKLADY.aktiva;
export const ASSET_KEYS: McAktivum[] = MC_PREDPOKLADY.poradi;

function choleskyDecomposition(matrix: number[][]): number[][] {
  const n = matrix.length;
  const L = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) sum += L[i][k] * L[j][k];
      if (i === j) L[i][j] = Math.sqrt(matrix[i][i] - sum);
      else L[i][j] = (matrix[i][j] - sum) / L[j][j];
    }
  }
  return L;
}
const CHOLESKY = choleskyDecomposition(MC_PREDPOKLADY.korelace);

// Měsíční parametry aktiv v pořadí ASSET_KEYS (spočítané jednou).
const MU = ASSET_KEYS.map((k) => Math.log(1 + ASSETS[k].annualReturn) / 12);
const SIGMA = ASSET_KEYS.map((k) => ASSETS[k].volatility / Math.sqrt(12));

/** Deterministický generátor náhody (Mulberry32): stejné semínko ⇒ stejná posloupnost ⇒ stejný výsledek. */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function korelovaneNormaly(rng: () => number): number[] {
  const n = ASSET_KEYS.length;
  const z: number[] = Array.from({ length: n }, () => {
    // Box–Muller pro N(0,1); rng() je z [0, 1) → 1 − rng() z (0, 1], log(0) = −∞ nenastane (N6).
    const u = 1 - rng();
    const v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  });
  const c: number[] = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let k = 0; k <= i; k++) sum += CHOLESKY[i][k] * z[k];
    c.push(sum);
  }
  return c;
}

/** Výnos portfolia za měsíc z korelovaných normál; `znamenko` −1 = antitetická cesta. */
function vynosPortfolia(vahy: number[], c: number[], znamenko: 1 | -1): number {
  let r = 0;
  for (let i = 0; i < vahy.length; i++) r += vahy[i] * (Math.exp(MU[i] + znamenko * SIGMA[i] * c[i]) - 1);
  return r;
}

/** Simulace: percentily po letech + konečné hodnoty všech cest (šance na cíl se počítá ze stejných cest). */
export function runMonteCarloSimulation(params: SimulationParameters): { results: SimulationResult[]; konecne: number[] } {
  const { allocation, initialInvestment, monthlyContribution, years, simulations, seed } = params;
  const vahy = ASSET_KEYS.map((k) => (allocation[k] ?? 0) / 100);
  const monthsTotal = years * 12;
  const cesty: number[][] = [];
  const rng = createRng(seed);

  for (let sim = 0; sim < simulations; sim += 2) {
    const par = sim + 1 < simulations; // lichý počet → poslední cesta bez dvojčete
    let a = initialInvestment, b = initialInvestment;
    const va: number[] = [initialInvestment], vb: number[] = [initialInvestment];
    for (let month = 1; month <= monthsTotal; month++) {
      const c = korelovaneNormaly(rng);
      a = (a + monthlyContribution) * (1 + vynosPortfolia(vahy, c, 1));
      if (par) b = (b + monthlyContribution) * (1 + vynosPortfolia(vahy, c, -1));
      if (month % 12 === 0) { va.push(a); if (par) vb.push(b); }
    }
    cesty.push(va);
    if (par) cesty.push(vb);
  }

  const results: SimulationResult[] = [];
  for (let year = 0; year <= years; year++) {
    const yearVals = cesty.map((c) => c[year]).sort((x, y) => x - y);
    const p = (q: number) => yearVals[Math.floor(simulations * q)];
    const mean = yearVals.reduce((acc, v) => acc + v, 0) / yearVals.length;
    results.push({
      year,
      percentile5: p(0.05),
      percentile25: p(0.25),
      percentile50: p(0.5),
      percentile75: p(0.75),
      percentile95: p(0.95),
      mean,
    });
  }
  return { results, konecne: cesty.map((c) => c[years]) };
}

/** Semínko odvozené ze vstupů: stejné zadání ⇒ stejný výsledek. */
export function seminko(initialInvestment: number, monthlyContribution: number, years: number, simulations: number, totalAllocation: number): number {
  return (initialInvestment * 31 + monthlyContribution * 17 + years * 7 + simulations * 13 + totalAllocation) >>> 0 || 1;
}

/** Šance v % k zobrazení: „> 99“ / „< 1“ místo zaokrouhlení na 100 / 0, které by tvrdilo jistotu (599/600 ≠ 100 %). */
export function sanceText(pct: number): string {
  if (pct > 99.5 && pct < 100) return '> 99';
  if (pct > 0 && pct < 0.5) return '< 1';
  return pct.toFixed(0);
}
