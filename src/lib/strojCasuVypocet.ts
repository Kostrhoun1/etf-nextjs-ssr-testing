/**
 * Korunový stroj času – presety, typy a výpočet. ČISTÝ modul bez importů (index inflace dostává
 * spocitejStrojRealne jako funkci): používá ho server (homepage, předpočet) i prohlížeč (widget).
 * Data načítá src/lib/strojCasu.ts.
 *
 * 11. 11. 2026: odstraněna vlozenoVDnesnichCenach – za posledním měsícem indexu ČSÚ držela poslední
 * hodnotu a stránka pak srovnávala listopadovou hodnotu portfolia se zářijovými cenami. Nahrazuje ji
 * spocitejStrojRealne (výpočet končí posledním zveřejněným měsícem inflace).
 */

export interface StrojPreset {
  id: string;
  nazev: string;
  popis: string;
  slozeni: { indexCode: string; weight: number }[];
  /** První měsíc s daty všech složek a kurzem koruny (YYYY-MM). */
  od: string;
  /**
   * Od měsíce `od` (včetně) řada pokračuje výnosy JINÉHO složení (napojení řetězením měsíčních
   * výnosů). Použití: „celý svět“ = skutečný celosvětový fond Vanguard VT (index FTSE Global All Cap) od 7/2008; dřív, kdy
   * VT neexistoval, aproximace 60 % S&P 500 + 40 % svět mimo USA. `start` = první den dat nového
   * složení (potřebujeme konec měsíce PŘED `od`).
   */
  pozdeji?: { od: string; start: string; slozeni: { indexCode: string; weight: number }[] };
  /** Název ve 2. pádě pro věty „do …“ (sdílení). */
  nazev2p: string;
}

export const STROJ_PRESETY: StrojPreset[] = [
  {
    id: 'svet', nazev: 'Celý svět', nazev2p: 'akcií celého světa',
    popis: 'Akcie celého světa: fond Vanguard VT (index FTSE Global All Cap – velké i malé firmy z vyspělých i rozvíjejících se trhů). Před červencem 2008, kdy fond ještě nebyl, přibližně 60 % USA (S&P 500) a 40 % ostatní svět.',
    slozeni: [{ indexCode: 'sp500', weight: 0.6 }, { indexCode: 'world_ex_us', weight: 0.4 }],
    pozdeji: { od: '2008-07', start: '2008-06-26', slozeni: [{ indexCode: 'ftse_all_world', weight: 1 }] },
    od: '2000-01',
  },
  {
    id: 'sp500', nazev: 'S&P 500', nazev2p: 'S&P 500',
    popis: '500 největších amerických firem.',
    slozeni: [{ indexCode: 'sp500', weight: 1 }],
    od: '2000-01',
  },
  {
    id: 'vyvazene', nazev: 'Vyvážené 60/40', nazev2p: 'vyváženého portfolia 60/40',
    // Audit 22. 10. 2026 (S20): dluhopisy = AGG (americké), jiné 60/40 než modelové portfolio a FIRE kalkulačka (XGLE, eurozóna).
    popis: '60 % akcie celého světa (fond VT, před 7/2008 aproximace), 40 % americké dluhopisy (fond AGG) – klidnější průběh za cenu nižšího výnosu.',
    slozeni: [
      { indexCode: 'sp500', weight: 0.36 }, { indexCode: 'world_ex_us', weight: 0.24 },
      { indexCode: 'us_aggregate_bond', weight: 0.4 },
    ],
    pozdeji: { od: '2008-07', start: '2008-06-26', slozeni: [{ indexCode: 'ftse_all_world', weight: 0.6 }, { indexCode: 'us_aggregate_bond', weight: 0.4 }] },
    od: '2003-10',
  },
  {
    id: 'zlato', nazev: 'Zlato', nazev2p: 'zlata',
    popis: 'Fyzické zlato.',
    slozeni: [{ indexCode: 'gold', weight: 1 }],
    od: '2004-12',
  },
];

/** Složení platné pro start v měsíci `odMesic` (pro odkaz do backtestu). */
export function slozeniProStart(p: StrojPreset, odMesic: string) {
  return p.pozdeji && odMesic >= p.pozdeji.od ? p.pozdeji.slozeni : p.slozeni;
}

export interface StrojRada {
  id: string;
  /** Měsíc prvního bodu řady (YYYY-MM). Bod i = konec měsíce od + i. */
  od: string;
  /** Hodnota portfolia (1 Kč investovaná na konci měsíce před `od`) na konci každého měsíce. */
  nav: number[];
  /** Datum posledního bodu (poslední obchodní den v datech). */
  posledniDen: string;
}

/* ---------- Výpočet (sdílený serverem i prohlížečem – čistá funkce) ---------- */

export interface StrojVysledek {
  vlozeno: number;
  hodnota: number;
  /** Průběh hodnoty po měsících od začátku (pro graf). */
  prubeh: { mesic: string; hodnota: number; vlozeno: number }[];
  /** Největší propad hodnoty portfolia (NAV, bez vlivu vkladů) v období. */
  nejhorsiPropad: { hloubka: number; mesic: string } | null;
}

const pridejMesice = (ym: string, n: number) => {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return d.toISOString().slice(0, 7);
};

/**
 * Hodnota dnes při vkladu od měsíce `odMesic`. `mesicne` = vklad na začátku každého měsíce,
 * `jednorazove` = vklad na začátku prvního měsíce.
 */
export function spocitejStroj(rada: StrojRada, odMesic: string, mesicne: number, jednorazove: number): StrojVysledek | null {
  const [ry, rm] = rada.od.split('-').map(Number);
  const [sy, sm] = odMesic.split('-').map(Number);
  const i0 = (sy - ry) * 12 + (sm - rm);
  if (i0 < 0 || i0 >= rada.nav.length) return null;
  const nav = rada.nav;
  const navPred = (i: number) => (i === 0 ? 1 : nav[i - 1]); // hodnota na začátku měsíce i
  let podily = 0; // počet „podílů“ NAV, které vklady koupily
  let vlozeno = 0;
  const prubeh: StrojVysledek['prubeh'] = [];
  let vrchol = navPred(i0); // nákupní cena je první vrchol – propad v 1. měsíci se počítá
  let propad: StrojVysledek['nejhorsiPropad'] = null;
  for (let i = i0; i < nav.length; i++) {
    const vklad = mesicne + (i === i0 ? jednorazove : 0);
    podily += vklad / navPred(i);
    vlozeno += vklad;
    prubeh.push({ mesic: pridejMesice(rada.od, i), hodnota: podily * nav[i], vlozeno });
    if (nav[i] > vrchol) vrchol = nav[i];
    const dd = nav[i] / vrchol - 1;
    if (!propad || dd < propad.hloubka) propad = { hloubka: dd, mesic: pridejMesice(rada.od, i) };
  }
  return { vlozeno, hodnota: prubeh[prubeh.length - 1].hodnota, prubeh, nejhorsiPropad: propad && propad.hloubka < 0 ? propad : null };
}

/**
 * Průměrný roční výnos (CAGR) v Kč od začátku měsíce `odMesic` do posledního bodu řady.
 * Pro srovnání více presetů VŽDY se stejným `odMesic` – jinak by rozdíl dělalo období
 * (např. 2000 s krachem dot-com vs. 2003 po něm), ne strategie.
 */
export function cagrOd(rada: StrojRada, odMesic: string): { cagr: number; roky: number } | null {
  const [ry, rm] = rada.od.split('-').map(Number);
  const [sy, sm] = odMesic.split('-').map(Number);
  const i0 = (sy - ry) * 12 + (sm - rm);
  if (i0 < 0 || i0 >= rada.nav.length) return null;
  const zaklad = i0 === 0 ? 1 : rada.nav[i0 - 1];
  const roky = (rada.nav.length - i0) / 12;
  return { cagr: Math.pow(rada.nav[rada.nav.length - 1] / zaklad, 1 / roky) - 1, roky };
}

export interface StrojRealne extends StrojVysledek {
  /** Měsíc, k jehož cenám je vše přepočteno = poslední měsíc výpočtu (poslední zveřejněný index ČSÚ). */
  cenyMesic: string;
  /** Vloženo nominálně (součet zadaných vkladů do `cenyMesic`) – pro srovnání s nominálním pohledem. */
  vlozenoNominalne: number;
}

/**
 * „V dnešních korunách“ (3.7, 11. 11. 2026): stejný výpočet jako spocitejStroj, ale vše přepočtené na ceny
 * měsíce `cenyMesic` (index ČSÚ, CPI_LAST_MONTH) a výpočet KONČÍ na konci toho měsíce – za posledním
 * zveřejněným měsícem inflace reálná čísla neukazujeme (nevíme, o kolik ceny mezitím vzrostly).
 *   hodnota_real(t) = podíly(t) × NAV[t] × CPI[ceny] / CPI[t]
 *   vloženo_real(t) = Σ_{m ≤ t} vklad_m × CPI[ceny] / CPI[m]   (vklad na začátku měsíce m, index měsíce m)
 * Největší propad = z reálné hodnoty portfolia (NAV / CPI), tj. ztráta kupní síly od předchozího vrcholu.
 * null = start až po `cenyMesic` nebo chybí index (raději nic než odhad).
 */
export function spocitejStrojRealne(
  rada: StrojRada, odMesic: string, mesicne: number, jednorazove: number,
  cpi: (ym: string) => number | null, cenyMesic: string,
): StrojRealne | null {
  const [ry, rm] = rada.od.split('-').map(Number);
  const [sy, sm] = odMesic.split('-').map(Number);
  const [cy, cm] = cenyMesic.split('-').map(Number);
  const i0 = (sy - ry) * 12 + (sm - rm);
  // Poslední bod = konec `cenyMesic`, nejvýš poslední bod řady.
  const iKonec = Math.min(rada.nav.length - 1, (cy - ry) * 12 + (cm - rm));
  if (i0 < 0 || i0 > iKonec) return null;
  const mesicI = (i: number) => pridejMesice(rada.od, i);
  const cRef = cpi(mesicI(iKonec));
  if (!cRef) return null;
  const nav = rada.nav;
  // Reálná NAV pro propad: hodnota na začátku měsíce i0 = konec předchozího měsíce, deflovaná jeho indexem.
  const cPred = cpi(mesicI(i0 - 1));
  const navPred = (i: number) => (i === 0 ? 1 : nav[i - 1]);
  if (!cPred) return null;
  let podily = 0, vlozenoReal = 0, vlozenoNom = 0;
  const prubeh: StrojVysledek['prubeh'] = [];
  let vrchol = navPred(i0) / cPred;
  let propad: StrojVysledek['nejhorsiPropad'] = null;
  for (let i = i0; i <= iKonec; i++) {
    const c = cpi(mesicI(i));
    if (!c) return null;
    const vklad = mesicne + (i === i0 ? jednorazove : 0);
    podily += vklad / navPred(i);
    vlozenoNom += vklad;
    vlozenoReal += vklad * (cRef / c);
    prubeh.push({ mesic: mesicI(i), hodnota: podily * nav[i] * (cRef / c), vlozeno: vlozenoReal });
    const navR = nav[i] / c;
    if (navR > vrchol) vrchol = navR;
    const dd = navR / vrchol - 1;
    if (!propad || dd < propad.hloubka) propad = { hloubka: dd, mesic: mesicI(i) };
  }
  return {
    vlozeno: vlozenoReal,
    hodnota: prubeh[prubeh.length - 1].hodnota,
    prubeh,
    // −1e-9: podíl dvou deflovaných hodnot nese chybu plovoucí čárky (−1e-16 není propad).
    nejhorsiPropad: propad && propad.hloubka < -1e-9 ? propad : null,
    cenyMesic: mesicI(iKonec),
    vlozenoNominalne: vlozenoNom,
  };
}
