/**
 * „Pravidlo 4 % v korunách" – čísla pro článek (Vlna 7 / bod 7.2, 17. 10. 2026).
 *
 * Simulace: na začátku 1 (= 100 % portfolia). Každý měsíc na začátku měsíce výběr sazba/12 počáteční
 * hodnoty, navyšovaný o českou inflaci od startu (ČSÚ, cpiLevel). Zbytek nese výnos portfolia
 * (měsíční řady stroje času = stejný engine jako backtest, Kč, roční vyvažování, po poplatcích ETF,
 * před daní). Hodnota ≤ 0 = portfolio vyčerpáno.
 *
 * OVĚŘENO 17. 10. 2026 (pravidlo č. 1) nezávislým ročním přepočtem z S&P 500 TR (S&P DJI), kurzů
 * USD/CZK ČNB k 31. 12. a míry inflace ČSÚ (skript mimo kód webu): S&P 500, 4 %, start 2000 →
 * vyčerpáno 2012 (zde 1/2012), start 2001 → 2013 (zde 7/2013), start 2002 → 2020 (zde 2/2020),
 * start 2003 → přežilo (konec 2024 2,75× vs. zde 3,0× v 10/2026). Měsíční a roční krok se liší
 * jen načasováním výběrů, roky vyčerpání sedí.
 */
import { cache } from 'react';
import { nactiStrojCasu, STROJ_PRESETY, type StrojRada } from '@/lib/strojCasu';
import { cpiLevel } from '@/lib/backtest/inflation';

const pridej = (ym: string, n: number) => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7);
};

export interface VysledekVyberu {
  start: string;              // YYYY-MM
  sazba: number;              // 0.04 = 4 %
  vycerpano: string | null;   // měsíc, kdy portfolio došlo (YYYY-MM)
  /** Hodnota na konci dat jako násobek počáteční částky (nominálně, v Kč) – null když vyčerpáno. */
  hodnota: number | null;
  /** Totéž v cenách roku startu (po inflaci). 1 = kupní síla jako na začátku. */
  realne: number | null;
  /** Nejnižší hodnota (konec měsíce, nominálně) – jak hluboko portfolio při výběrech kleslo. 0 = vyčerpáno. */
  nejnize: number;
  /** Hodnota na konci každého prosince (a posledního měsíce) – pro graf. */
  prubeh: { mesic: string; hodnota: number }[];
}

export function simulujVybery(rada: StrojRada, start: string, sazba: number): VysledekVyberu | null {
  const mes = (i: number) => pridej(rada.od, i);
  const [ry, rm] = rada.od.split('-').map(Number);
  const [sy, sm] = start.split('-').map(Number);
  const i0 = (sy - ry) * 12 + (sm - rm);
  if (i0 < 0 || i0 >= rada.nav.length) return null;
  const c0 = cpiLevel(`${start}-01`);
  if (!c0) return null;
  let h = 1, nejnize = 1;
  const prubeh: VysledekVyberu['prubeh'] = [{ mesic: pridej(start, -1), hodnota: 1 }];
  for (let t = i0; t < rada.nav.length; t++) {
    const c = cpiLevel(`${mes(t)}-01`);
    if (!c) return null; // raději žádné číslo než špatné
    h -= (sazba / 12) * (c / c0);
    if (h <= 0) {
      prubeh.push({ mesic: mes(t), hodnota: 0 });
      return { start, sazba, vycerpano: mes(t), hodnota: null, realne: null, nejnize: 0, prubeh };
    }
    h *= rada.nav[t] / (t === 0 ? 1 : rada.nav[t - 1]);
    nejnize = Math.min(nejnize, h);
    if (mes(t).endsWith('-12') || t === rada.nav.length - 1) prubeh.push({ mesic: mes(t), hodnota: h });
  }
  const cKonec = cpiLevel(`${mes(rada.nav.length - 1)}-28`);
  if (!cKonec) return null;
  return { start, sazba, vycerpano: null, hodnota: h, realne: h / (cKonec / c0), nejnize, prubeh };
}

/**
 * PRUŽNÁ varianta: výběr se navyšuje o inflaci jen jednou ročně (v lednu) a jen když portfolio za
 * předchozí kalendářní rok nebylo ve ztrátě. Jinak zůstává na loňské částce (jednoduchá verze
 * „guardrails“). Vrací totéž co simulujVybery.
 */
export function simulujPruzne(rada: StrojRada, start: string, sazba: number): VysledekVyberu | null {
  const mes = (i: number) => pridej(rada.od, i);
  const [ry, rm] = rada.od.split('-').map(Number);
  const [sy, sm] = start.split('-').map(Number);
  const i0 = (sy - ry) * 12 + (sm - rm);
  if (i0 < 0 || i0 >= rada.nav.length) return null;
  const c0 = cpiLevel(`${start}-01`);
  if (!c0) return null;
  let h = 1, nejnize = 1, rocniVyber = sazba, hodnotaLoni = 1, cLoni = c0;
  const prubeh: VysledekVyberu['prubeh'] = [{ mesic: pridej(start, -1), hodnota: 1 }];
  for (let t = i0; t < rada.nav.length; t++) {
    const m = mes(t);
    if (t > i0 && m.endsWith('-01')) {
      const c = cpiLevel(`${m}-01`);
      if (!c) return null;
      if (h >= hodnotaLoni) rocniVyber *= c / cLoni;   // jen po roce bez ztráty
      cLoni = c; hodnotaLoni = h;
    }
    h -= rocniVyber / 12;
    if (h <= 0) {
      prubeh.push({ mesic: m, hodnota: 0 });
      return { start, sazba, vycerpano: m, hodnota: null, realne: null, nejnize: 0, prubeh };
    }
    h *= rada.nav[t] / (t === 0 ? 1 : rada.nav[t - 1]);
    nejnize = Math.min(nejnize, h);
    if (m.endsWith('-12') || t === rada.nav.length - 1) prubeh.push({ mesic: m, hodnota: h });
  }
  const cKonec = cpiLevel(`${mes(rada.nav.length - 1)}-28`);
  if (!cKonec) return null;
  return { start, sazba, vycerpano: null, hodnota: h, realne: h / (cKonec / c0), nejnize, prubeh };
}

/** Nejvyšší roční sazba (pevný výběr s inflací), která pro daný start dosud nevyčerpala portfolio. Půlení intervalu, přesnost 0,05 p. b. */
function maxUdrzitelna(rada: StrojRada, start: string): number | null {
  let lo = 0.005, hi = 0.2;
  if (!simulujVybery(rada, start, lo) || simulujVybery(rada, start, lo)!.vycerpano) return null;
  while (hi - lo > 0.0005) {
    const mid = (lo + hi) / 2;
    if (simulujVybery(rada, start, mid)!.vycerpano) hi = mid; else lo = mid;
  }
  return lo;
}

export interface Uspesnost { sazba: number; startu: number; vycerpano: number; nejdrivRoky: number | null }

/** Úspěšnost sazeb přes VŠECHNY měsíční starty s aspoň `minLet` lety dat (vydrželo do konce dat). */
function uspesnost(rada: StrojRada, sazby: number[], minLet: number): Uspesnost[] {
  const n = rada.nav.length;
  return sazby.map((sazba) => {
    let startu = 0, vycerpano = 0, nejdriv: number | null = null;
    for (let i = 0; i + minLet * 12 <= n - 1; i++) {
      const st = pridej(rada.od, i);
      const v = simulujVybery(rada, st, sazba);
      if (!v) continue;
      startu++;
      if (v.vycerpano) {
        vycerpano++;
        const [a, b] = [st, v.vycerpano].map((x) => { const [y, m] = x.split('-').map(Number); return y * 12 + m; });
        const roky = (b - a) / 12;
        nejdriv = nejdriv === null ? roky : Math.min(nejdriv, roky);
      }
    }
    return { sazba, startu, vycerpano, nejdrivRoky: nejdriv };
  });
}

export interface CtyriProcentaPreset {
  id: string;
  nazev: string;
  od: string;
  /** Start v lednu každého roku (od prvního úplného roku dat do roku před posledním). */
  starty: { rok: number; s4: VysledekVyberu; s35: VysledekVyberu; s3: VysledekVyberu; pruzne4: VysledekVyberu; maxSazba: number | null }[];
  /** Úspěšnost 3–5 % přes měsíční starty s aspoň 15 lety dat. */
  uspesnost: Uspesnost[];
  /** Měsíc posledního startu, který má 15 let dat. */
  uspesnostDo: string;
}

export interface CtyriProcenta { presety: CtyriProcentaPreset[]; posledniDen: string }

async function spoctiCtyriProcentaBezCache(): Promise<CtyriProcenta | null> {
  try {
    const rady = await nactiStrojCasu(['sp500', 'svet', 'vyvazene']);
    if (rady.length < 3) return null; // nikdy neukázat půlku článku
    const posledniRok = Number(rady[0].posledniDen.slice(0, 4)) - 1;
    const presety = rady.map((r) => {
      const prvniRok = Number(r.od.slice(0, 4)) + (r.od.endsWith('-01') ? 0 : 1);
      const starty: CtyriProcentaPreset['starty'] = [];
      for (let rok = prvniRok; rok <= posledniRok; rok++) {
        const s4 = simulujVybery(r, `${rok}-01`, 0.04);
        const s35 = simulujVybery(r, `${rok}-01`, 0.035);
        const s3 = simulujVybery(r, `${rok}-01`, 0.03);
        const pruzne4 = simulujPruzne(r, `${rok}-01`, 0.04);
        if (!s4 || !s35 || !s3 || !pruzne4) throw new Error(`simulace ${r.id} ${rok} selhala`);
        starty.push({ rok, s4, s35, s3, pruzne4, maxSazba: maxUdrzitelna(r, `${rok}-01`) });
      }
      const usp = uspesnost(r, [0.03, 0.035, 0.04, 0.045, 0.05], 15);
      return { id: r.id, nazev: STROJ_PRESETY.find((p) => p.id === r.id)?.nazev ?? r.id, od: r.od, starty, uspesnost: usp,
        uspesnostDo: pridej(r.od, r.nav.length - 1 - 15 * 12) };
    });
    // Datum dat = nejstarší z konců řad (nikdy netvrdit novější den, než mají všechny presety).
    return { presety, posledniDen: rady.map((r) => r.posledniDen).sort()[0] };
  } catch (e) {
    console.error('[4-procenta] výpočet selhal:', e);
    return null;
  }
}

/** V rámci jednoho renderu (generateMetadata + stránka) se počítá jen jednou. */
export const spoctiCtyriProcenta = cache(spoctiCtyriProcentaBezCache);
