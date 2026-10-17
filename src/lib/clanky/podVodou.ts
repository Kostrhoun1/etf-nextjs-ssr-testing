/**
 * „Jak dlouho můžete být v minusu" – čísla pro článek (Vlna 7, 17. 10. 2026).
 *
 * Pro každý měsíc startu (jednorázová investice) hledáme POSLEDNÍ měsíc, kdy hodnota byla pod
 * vloženou částkou – nominálně (v Kč) a reálně (v Kč po české inflaci, ČSÚ). Doba „v minusu" =
 * od startu do posledního měsíce pod vkladem (i když se mezitím na chvíli dostala nad).
 * Když je pod vkladem i poslední bod, je „dosud" (null).
 *
 * Data: měsíční řady stroje času (stejný engine jako backtest, ověřené – scripts/overeni-stroj-casu.mjs)
 * a index cen ČSÚ (src/lib/backtest/inflation.ts, ověřený na publikovanou míru inflace).
 *
 * OVĚŘENO 17. 10. 2026 (pravidlo č. 1), nezávisle z ročních výnosů S&P 500 TR (S&P DJI),
 * kurzů ČNB ke konci roku a míry inflace ČSÚ:
 * - S&P 500 od 1/2000 v Kč nominálně: 31. 12. 2013 hodnota 0,90 vkladu (1,641 × 19,894/36,132),
 *   v Kč pod vkladem naposledy 7/2014 → výpočet 175 měsíců (2000-01 … 2014-07) ✓
 * - totéž reálně: začátek 2018 hodnota ~1,46–1,52 vkladu, ceny ×1,48 → pod vodou do 3/2018 ✓ (219 měsíců)
 * - v USD pod vkladem naposledy 8/2011 (141 měsíců) – sedí s obecně známým „ztraceným desetiletím"
 */
import { runBacktest } from '@/lib/backtest/engine';
import { resampleMonthEnd } from '@/lib/backtest/calculations';
import { nactiStrojCasu, STROJ_PRESETY, type StrojRada } from '@/lib/strojCasu';
import { cpiLevel } from '@/lib/backtest/inflation';

const pridej = (ym: string, n: number) => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7);
};

export interface StartPodVodou {
  start: string;             // YYYY-MM (nákup na začátku měsíce = cena konce předchozího)
  nominalne: number | null;  // měsíců v minusu (0 = nikdy pod vkladem, null = dosud v minusu)
  realne: number | null;
  /** Nejdelší souvislý úsek (měsíce) reálně NAD vkladem před posledním propadem pod vklad – „byl dlouho v plusu a pak znovu spadl". */
  realneNadPred: number;
}

export interface PravidelnePodVodou { od: string; nominalne: number | null; realne: number | null; nejhure: number; nejhureKdy: string }

export interface PodVodouPreset {
  id: string;
  nazev: string;
  od: string;
  starty: StartPodVodou[];
  nejhorsiNominalne: StartPodVodou;
  nejhorsiRealne: StartPodVodou;
  /** Jednorázové starty s aspoň 10 lety dat, které byly po 10 letech pořád pod vkladem. */
  po10: { celkem: number; nominalne: string[]; realne: string[] };
  nikdyPod: number;
  pravidelne: PravidelnePodVodou[];
}

/** Délka v minusu pro řazení – „dosud" = do konce dat. */
const delka = (x: number | null, zbyva: number) => (x === null ? zbyva : x);

function analyzuj(rada: StrojRada): StartPodVodou[] {
  const n = rada.nav.length;
  const mes = rada.nav.map((_, t) => pridej(rada.od, t));
  const cpiKonec = mes.map((m) => cpiLevel(`${m}-28`));
  const out: StartPodVodou[] = [];
  for (let i = 0; i < n; i++) {
    const zaklad = i === 0 ? 1 : rada.nav[i - 1];
    const cpi0 = cpiLevel(`${mes[i]}-01`);
    let nom = -1, real = -1, usek = 0, nejdelsi = 0, nejdelsiPredPoslednim = 0;
    for (let t = i; t < n; t++) {
      const pomer = rada.nav[t] / zaklad;
      if (pomer < 1) nom = t;
      const c = cpiKonec[t];
      if (cpi0 && c && pomer < c / cpi0) { real = t; nejdelsiPredPoslednim = nejdelsi; usek = 0; }
      else { usek++; nejdelsi = Math.max(nejdelsi, usek); }
    }
    out.push({
      start: mes[i],
      nominalne: nom === n - 1 ? null : nom < 0 ? 0 : nom - i + 1,
      realne: real === n - 1 ? null : real < 0 ? 0 : real - i + 1,
      realneNadPred: nejdelsiPredPoslednim,
    });
  }
  return out;
}

/** Pravidelná investice (stejná částka na začátku každého měsíce od `od`): kdy byla hodnota naposledy pod součtem vkladů. */
function pravidelne(rada: StrojRada, od: string): PravidelnePodVodou | null {
  const n = rada.nav.length;
  const mes = rada.nav.map((_, t) => pridej(rada.od, t));
  const i0 = mes.indexOf(od);
  if (i0 < 0) return null;
  let podily = 0, nom = -1, real = -1, nejhure = Infinity, nejhureKdy = od;
  const cpiStart = mes.map((m) => cpiLevel(`${m}-01`));
  for (let t = i0; t < n; t++) {
    podily += 1 / (t === 0 ? 1 : rada.nav[t - 1]);
    const hodnota = podily * rada.nav[t];
    const vklady = t - i0 + 1;
    const cT = cpiLevel(`${mes[t]}-28`);
    let vkladyReal = 0;
    for (let k = i0; k <= t; k++) { const c0 = cpiStart[k]; vkladyReal += cT && c0 ? cT / c0 : 1; }
    if (hodnota < vklady) nom = t;
    if (hodnota < vkladyReal) real = t;
    if (hodnota / vklady < nejhure) { nejhure = hodnota / vklady; nejhureKdy = mes[t]; }
  }
  return {
    od,
    nominalne: nom === n - 1 ? null : nom < 0 ? 0 : nom - i0 + 1,
    realne: real === n - 1 ? null : real < 0 ? 0 : real - i0 + 1,
    nejhure: nejhure - 1,
    nejhureKdy,
  };
}

export interface PodVodou {
  presety: PodVodouPreset[];
  /** S&P 500 od 1/2000 v dolarech – pro srovnání, o kolik to koruna prodloužila. */
  sp500Usd2000: number | null;
  posledniDen: string;
}

export async function spoctiPodVodou(): Promise<PodVodou | null> {
  try {
    const rady = await nactiStrojCasu(['sp500', 'svet', 'vyvazene']);
    if (rady.length < 3) return null; // nikdy neukázat půlku článku
    const presety: PodVodouPreset[] = rady.map((r) => {
      const starty = analyzuj(r);
      const n = r.nav.length;
      const nejhorsi = (k: 'nominalne' | 'realne') =>
        starty.reduce((b, s, i) => (delka(s[k], n - i) > delka(b.s[k], n - b.i) ? { s, i } : b), { s: starty[0], i: 0 }).s;
      const s10 = starty.filter((_, i) => n - i > 120);
      const pod10 = (k: 'nominalne' | 'realne') => s10.filter((s) => s[k] === null || s[k]! > 120).map((s) => s.start);
      return {
        id: r.id,
        nazev: STROJ_PRESETY.find((p) => p.id === r.id)?.nazev ?? r.id,
        od: r.od,
        starty,
        nejhorsiNominalne: nejhorsi('nominalne'),
        nejhorsiRealne: nejhorsi('realne'),
        po10: { celkem: s10.length, nominalne: pod10('nominalne'), realne: pod10('realne') },
        nikdyPod: starty.filter((s) => s.nominalne === 0).length,
        pravidelne: ['2000-01', '2003-10', '2007-10'].map((od) => pravidelne(r, od)).filter((x): x is PravidelnePodVodou => !!x),
      };
    });

    // Srovnání s dolary: S&P 500 od 1/2000 (stejný engine, jen bez převodu do Kč).
    let sp500Usd2000: number | null = null;
    const usd = await runBacktest({
      portfolio: [{ isin: 'sp500', name: 'sp500', weight: 1, ter: 0, indexCode: 'sp500' }],
      startDate: new Date('1999-12-20'), endDate: new Date(), initialAmount: 1, rebalancingStrategy: 'yearly', currency: 'USD',
    });
    const m = resampleMonthEnd(usd.marketNav ?? []);
    const i0 = m.findIndex((b) => b.date.toISOString().startsWith('2000-01'));
    if (i0 > 0) {
      let posl = -1;
      for (let t = i0; t < m.length; t++) if (m[t].value < m[i0 - 1].value) posl = t;
      sp500Usd2000 = posl === m.length - 1 ? null : posl - i0 + 1;
    }
    return { presety, sp500Usd2000, posledniDen: rady[0].posledniDen };
  } catch (e) {
    console.error('[pod-vodou] výpočet selhal:', e);
    return null;
  }
}
