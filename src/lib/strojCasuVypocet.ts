/**
 * Korunový stroj času – presety, typy a výpočet. ČISTÝ modul bez importů: používá ho server
 * (homepage, předpočet) i prohlížeč (widget). Data načítá src/lib/strojCasu.ts.
 */
export interface StrojPreset {
  id: string;
  nazev: string;
  popis: string;
  slozeni: { indexCode: string; weight: number }[];
  /** První měsíc s daty všech složek a kurzem koruny (YYYY-MM). */
  od: string;
}

export const STROJ_PRESETY: StrojPreset[] = [
  {
    id: 'svet', nazev: 'Celý svět',
    popis: 'Akcie celého světa: 60 % USA (S&P 500) a 40 % ostatní svět včetně rozvíjejících se trhů.',
    slozeni: [{ indexCode: 'sp500', weight: 0.6 }, { indexCode: 'world_ex_us', weight: 0.4 }],
    od: '2000-01',
  },
  {
    id: 'sp500', nazev: 'S&P 500',
    popis: '500 největších amerických firem.',
    slozeni: [{ indexCode: 'sp500', weight: 1 }],
    od: '2000-01',
  },
  {
    id: 'vyvazene', nazev: 'Vyvážené 60/40',
    popis: '60 % akcie celého světa, 40 % dluhopisy – klidnější průběh za cenu nižšího výnosu.',
    slozeni: [
      { indexCode: 'sp500', weight: 0.36 }, { indexCode: 'world_ex_us', weight: 0.24 },
      { indexCode: 'us_aggregate_bond', weight: 0.4 },
    ],
    od: '2003-10',
  },
  {
    id: 'zlato', nazev: 'Zlato',
    popis: 'Fyzické zlato.',
    slozeni: [{ indexCode: 'gold', weight: 1 }],
    od: '2004-12',
  },
];

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
  let podily = 0; // počet „podílů" NAV, které vklady koupily
  let vlozeno = 0;
  const prubeh: StrojVysledek['prubeh'] = [];
  let vrchol = 0;
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
