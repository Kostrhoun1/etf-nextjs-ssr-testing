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
import { cache } from 'react';
import { runBacktest } from '@/lib/backtest/engine';
import { resampleMonthEnd } from '@/lib/backtest/calculations';
import { nactiStrojCasu, STROJ_PRESETY, type StrojRada } from '@/lib/strojCasu';
import { cpiLevel } from '@/lib/backtest/inflation';

const pridej = (ym: string, n: number) => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7);
};

/**
 * Investice byla dlouho (≥ 2 roky souvisle) nad vkladem a pak pod něj znovu spadla – tehdy přísná
 * „doba v minusu“ (do posledního měsíce pod vkladem) může působit přehnaně, tak to stránka vysvětlí.
 * Indexy jsou měsíce od nákupu (0 = konec měsíce nákupu).
 */
export interface DlouhoNad { od: number; delka: number; znovuPodMesicu: number; hloubka: number }

export interface StartPodVodou {
  start: string;             // YYYY-MM (nákup na začátku měsíce = cena konce předchozího)
  nominalne: number | null;  // měsíců v minusu (0 = nikdy pod vkladem, null = dosud v minusu)
  realne: number | null;
  dlouhoNadNominalne: DlouhoNad | null;
  dlouhoNadRealne: DlouhoNad | null;
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
  /** Podíl startů v minusu po N letech držení (jednorázově) – jen starty, které N let dat mají. */
  poLetech: { roky: number; startu: number; nom: number; real: number; dcaStartu: number; dcaNom: number; dcaReal: number }[];
  /** Po 5 letech v minusu (jednorázově, nominálně) podle roku nákupu: [rok, v minusu, celkem]. */
  pet: [string, number, number][];
  /** Nejhlubší pokles pod nákupní cenu (jednorázově), rozložení přes starty s aspoň 5 lety dat. */
  hloubka: { median: number; p90: number; nejhorsi: number; nejhorsiStart: string; podil20: number; startu: number };
  /** Rozložení doby v minusu (nominálně / reálně) přes starty s aspoň 10 lety dat. */
  doba: { median: number; p75: number; p90: number; medianReal: number; p75Real: number; p90Real: number; startu: number };
}

/** Délka v minusu pro řazení – „dosud" = do konce dat. */
const delka = (x: number | null, zbyva: number) => (x === null ? zbyva : x);

/**
 * r[k] = hodnota / vklad na konci k-tého měsíce od nákupu. Doba v minusu = do posledního měsíce pod
 * vkladem (PŘÍSNĚ – „trvalý návrat“; rozhodnutí 17. 10. 2026: měkčí pravidla vždy nějaký skutečný
 * pokles schovala, viz ZAMERNA-ROZHODNUTI.md). Navíc nejdelší souvislý úsek nad vkladem před tím.
 */
function prehled(r: number[]): { mesicu: number | null; dlouhoNad: DlouhoNad | null } {
  const n = r.length;
  let posl = -1;
  for (let k = 0; k < n; k++) if (r[k] < 1) posl = k;
  const mesicu = posl === n - 1 ? null : posl + 1;
  let nej = { od: -1, delka: 0 }, zac = -1;
  for (let k = 0; k <= posl; k++) {
    if (r[k] >= 1) { if (zac < 0) zac = k; }
    else if (zac >= 0) { if (k - zac > nej.delka) nej = { od: zac, delka: k - zac }; zac = -1; }
  }
  if (nej.delka < 24) return { mesicu, dlouhoNad: null };
  let znovuPodMesicu = 0, nejnize = 1;
  for (let k = nej.od + nej.delka; k <= posl; k++) if (r[k] < 1) { znovuPodMesicu++; nejnize = Math.min(nejnize, r[k]); }
  return { mesicu, dlouhoNad: { od: nej.od, delka: nej.delka, znovuPodMesicu, hloubka: nejnize - 1 } };
}

function analyzuj(rada: StrojRada): StartPodVodou[] {
  const n = rada.nav.length;
  const mes = rada.nav.map((_, t) => pridej(rada.od, t));
  const cpiKonec = mes.map((m) => cpiLevel(`${m}-28`));
  const out: StartPodVodou[] = [];
  for (let i = 0; i < n; i++) {
    const zaklad = i === 0 ? 1 : rada.nav[i - 1];
    const cpi0 = cpiLevel(`${mes[i]}-01`);
    const nom: number[] = [], real: number[] = [];
    for (let t = i; t < n; t++) {
      const c = cpiKonec[t];
      if (!cpi0 || !c) throw new Error(`chybí inflace pro ${mes[t]}`); // raději žádný článek než špatné číslo
      nom.push(rada.nav[t] / zaklad);
      real.push(rada.nav[t] / zaklad / (c / cpi0));
    }
    const pn = prehled(nom), pr = prehled(real);
    out.push({ start: mes[i], nominalne: pn.mesicu, realne: pr.mesicu, dlouhoNadNominalne: pn.dlouhoNad, dlouhoNadRealne: pr.dlouhoNad });
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
    for (let k = i0; k <= t; k++) { const c0 = cpiStart[k]; if (!cT || !c0) return null; vkladyReal += cT / c0; }
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

const ROKY_DRZENI = [1, 2, 3, 5, 10, 15];

/** Podíly „v minusu po N letech“ pro jednorázový nákup i pravidelné investování (stejná částka každý měsíc). */
function poLetech(rada: StrojRada): PodVodouPreset['poLetech'] {
  const n = rada.nav.length;
  const mes = rada.nav.map((_, t) => pridej(rada.od, t));
  const cpiS = mes.map((m) => cpiLevel(`${m}-01`)), cpiK = mes.map((m) => cpiLevel(`${m}-28`));
  const navPred = (i: number) => (i === 0 ? 1 : rada.nav[i - 1]);
  return ROKY_DRZENI.map((roky) => {
    const k = roky * 12;
    let startu = 0, nom = 0, real = 0, dcaStartu = 0, dcaNom = 0, dcaReal = 0;
    for (let i = 0; i + k - 1 < n - 1; i++) {   // konec okna = konec měsíce i+k−1; poslední (rozběhlý) měsíc vynecháváme
      const t = i + k - 1;
      const pomer = rada.nav[t] / navPred(i);
      const infl = (cpiK[t] ?? NaN) / (cpiS[i] ?? NaN);
      if (!Number.isFinite(infl)) continue;
      startu++; if (pomer < 1) nom++; if (pomer < infl) real++;
      // pravidelně: 1 Kč na začátku každého měsíce i..t
      let podily = 0, vkladyReal = 0;
      for (let j = i; j <= t; j++) { podily += 1 / navPred(j); vkladyReal += (cpiK[t] ?? NaN) / (cpiS[j] ?? NaN); }
      const hodnota = podily * rada.nav[t];
      if (!Number.isFinite(vkladyReal)) continue;
      dcaStartu++; if (hodnota < k) dcaNom++; if (hodnota < vkladyReal) dcaReal++;
    }
    return { roky, startu, nom: nom / Math.max(1, startu), real: real / Math.max(1, startu), dcaStartu, dcaNom: dcaNom / Math.max(1, dcaStartu), dcaReal: dcaReal / Math.max(1, dcaStartu) };
  }).filter((x) => x.startu >= 12);
}

const kvantil = (xs: number[], p: number) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))]; };

function hloubka(rada: StrojRada): PodVodouPreset['hloubka'] {
  const n = rada.nav.length, mes = rada.nav.map((_, t) => pridej(rada.od, t));
  const xs: { d: number; start: string }[] = [];
  for (let i = 0; i + 60 < n; i++) {
    const z = i === 0 ? 1 : rada.nav[i - 1];
    let min = 1; for (let t = i; t < n; t++) min = Math.min(min, rada.nav[t] / z);
    xs.push({ d: min - 1, start: mes[i] });
  }
  const d = xs.map((x) => x.d);
  const nej = xs.reduce((a, b) => (b.d < a.d ? b : a));
  return { median: kvantil(d, 0.5), p90: kvantil(d, 0.1), nejhorsi: nej.d, nejhorsiStart: nej.start, podil20: d.filter((x) => x <= -0.2).length / d.length, startu: d.length };
}

function doba(starty: StartPodVodou[], n: number): PodVodouPreset['doba'] {
  const s10 = starty.filter((_, i) => n - i >= 120);
  const nom = s10.map((s, i) => s.nominalne ?? n - i), real = s10.map((s, i) => s.realne ?? n - i);
  return { median: kvantil(nom, 0.5), p75: kvantil(nom, 0.75), p90: kvantil(nom, 0.9), medianReal: kvantil(real, 0.5), p75Real: kvantil(real, 0.75), p90Real: kvantil(real, 0.9), startu: s10.length };
}

export interface PodVodou {
  presety: PodVodouPreset[];
  /** S&P 500 od 1/2000 v dolarech – pro srovnání, o kolik to koruna prodloužila. */
  sp500Usd2000: number | null;
  posledniDen: string;
}

async function spoctiPodVodouBezCache(): Promise<PodVodou | null> {
  try {
    const rady = await nactiStrojCasu(['sp500', 'svet', 'vyvazene']);
    if (rady.length < 3) return null; // nikdy neukázat půlku článku
    const presety: PodVodouPreset[] = rady.map((r) => {
      const starty = analyzuj(r);
      const n = r.nav.length;
      const nejhorsi = (k: 'nominalne' | 'realne') =>
        starty.reduce((b, s, i) => (delka(s[k], n - i) > delka(b.s[k], n - b.i) ? { s, i } : b), { s: starty[0], i: 0 }).s;
      const s10 = starty.filter((_, i) => n - i >= 120); // máme hodnotu po 10 letech (konec 120. měsíce)
      const pod10 = (k: 'nominalne' | 'realne') => s10.filter((s) => s[k] === null || s[k]! >= 120).map((s) => s.start);
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
        poLetech: poLetech(r),
        pet: (() => {
          const mes = r.nav.map((_, t) => pridej(r.od, t)), po = new Map<string, [number, number]>();
          for (let i = 0; i + 59 < r.nav.length - 1; i++) {
            const y = mes[i].slice(0, 4), z = i === 0 ? 1 : r.nav[i - 1], x = po.get(y) ?? [0, 0];
            po.set(y, [x[0] + (r.nav[i + 59] / z < 1 ? 1 : 0), x[1] + 1]);
          }
          return [...po.entries()].map(([y, [a, b]]) => [y, a, b] as [string, number, number]);
        })(),
        hloubka: hloubka(r),
        doba: doba(starty, n),
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
      sp500Usd2000 = posl === m.length - 1 ? null : posl < 0 ? 0 : posl - i0 + 1;
    }
    return { presety, sp500Usd2000, posledniDen: rady.map((r) => r.posledniDen).sort()[0] };
  } catch (e) {
    console.error('[pod-vodou] výpočet selhal:', e);
    return null;
  }
}

/** V rámci jednoho renderu (generateMetadata + stránka) se počítá jen jednou. */
export const spoctiPodVodou = cache(spoctiPodVodouBezCache);
