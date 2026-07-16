/**
 * Český index spotřebitelských cen (ČSÚ) – pro přepočet výnosů na REÁLNÉ (po inflaci).
 *
 * ZDROJ (ověřeno 2026-07-16):
 *  - Měsíční bazický index „Úhrn", domácnosti celkem, Česko, **2015 = 100**:
 *    ČSÚ open data, datová sada CEN0101E
 *    https://data.csu.gov.cz/opendata/sady/CEN0101E/distribuce/csv
 *    Pokrytí: 2015-01 … 2026-06 (exaktní měsíční data).
 *  - Roky 1999–2015: dopočteno z publikované „míry inflace" (průměrná roční, ČSÚ
 *    https://csu.gov.cz/csu/czso/mira_inflace), zřetězeno zpět od kotvy průměr 2015 = 100.
 *    Tyto hodnoty jsou ROČNÍ PRŮMĚRY cenové hladiny (ne měsíční body).
 *
 * OVĚŘENÍ METODY: roční inflace dopočtená z měsíčního indexu výše sedí PŘESNĚ na
 * publikovanou míru inflace ČSÚ pro 2016–2025 (0,7 / 2,5 / 2,1 / 2,8 / 3,2 / 3,8 /
 * 15,1 / 10,7 / 2,4 / 2,5 %) a průměr roku 2015 vychází 100,0. Navazuje i přechod
 * 2015→2016 (100,66 z měsíčních vs. 100,70 z roční míry) – řady jsou spojité.
 *
 * PŘESNOST: od 2015-01 měsíčně exaktní. Před 2015 interpolujeme mezi ročními průměry
 * (kotva = 1. července), takže uvnitř roku jde o odhad – na víceletých horizontech
 * backtestu je chyba zanedbatelná, roční kotvy jsou oficiální. Po 2026-06 držíme
 * poslední známý index (novější data ČSÚ ještě nezveřejnil) – reálný výnos tím
 * NEnadhodnocujeme o budoucí inflaci, jen ji do konce řady nezapočítáme.
 *
 * Měna: index je český, proto ho používej JEN na výnosy převedené do CZK.
 */

/** Měsíční bazický index spotřebitelských cen, 2015 = 100 (ČSÚ, CEN0101E). */
export const MONTHLY_CPI: Record<string, number> = {
  '2015-01': 99.5,
  '2015-02': 99.7,
  '2015-03': 99.8,
  '2015-04': 100.1,
  '2015-05': 100.4,
  '2015-06': 100.5,
  '2015-07': 100.4,
  '2015-08': 100.2,
  '2015-09': 100.0,
  '2015-10': 100.0,
  '2015-11': 99.6,
  '2015-12': 99.5,
  '2016-01': 100.1,
  '2016-02': 100.2,
  '2016-03': 100.1,
  '2016-04': 100.7,
  '2016-05': 100.5,
  '2016-06': 100.6,
  '2016-07': 100.9,
  '2016-08': 100.8,
  '2016-09': 100.5,
  '2016-10': 100.8,
  '2016-11': 101.2,
  '2016-12': 101.5,
  '2017-01': 102.3,
  '2017-02': 102.7,
  '2017-03': 102.7,
  '2017-04': 102.7,
  '2017-05': 102.9,
  '2017-06': 102.9,
  '2017-07': 103.4,
  '2017-08': 103.3,
  '2017-09': 103.2,
  '2017-10': 103.7,
  '2017-11': 103.8,
  '2017-12': 103.9,
  '2018-01': 104.5,
  '2018-02': 104.5,
  '2018-03': 104.4,
  '2018-04': 104.7,
  '2018-05': 105.2,
  '2018-06': 105.6,
  '2018-07': 105.8,
  '2018-08': 105.9,
  '2018-09': 105.6,
  '2018-10': 106.0,
  '2018-11': 105.9,
  '2018-12': 106.0,
  '2019-01': 107.1,
  '2019-02': 107.3,
  '2019-03': 107.5,
  '2019-04': 107.6,
  '2019-05': 108.3,
  '2019-06': 108.5,
  '2019-07': 108.9,
  '2019-08': 109.0,
  '2019-09': 108.4,
  '2019-10': 108.9,
  '2019-11': 109.2,
  '2019-12': 109.4,
  '2020-01': 111.0,
  '2020-02': 111.3,
  '2020-03': 111.2,
  '2020-04': 111.0,
  '2020-05': 111.4,
  '2020-06': 112.1,
  '2020-07': 112.6,
  '2020-08': 112.6,
  '2020-09': 111.9,
  '2020-10': 112.1,
  '2020-11': 112.1,
  '2020-12': 111.9,
  '2021-01': 113.4,
  '2021-02': 113.6,
  '2021-03': 113.8,
  '2021-04': 114.4,
  '2021-05': 114.6,
  '2021-06': 115.2,
  '2021-07': 116.4,
  '2021-08': 117.2,
  '2021-09': 117.4,
  '2021-10': 118.6,
  '2021-11': 118.8,
  '2021-12': 119.3,
  '2022-01': 124.6,
  '2022-02': 126.2,
  '2022-03': 128.3,
  '2022-04': 130.6,
  '2022-05': 132.9,
  '2022-06': 135.0,
  '2022-07': 136.8,
  '2022-08': 137.4,
  '2022-09': 138.5,
  '2022-10': 136.5,
  '2022-11': 138.1,
  '2022-12': 138.1,
  '2023-01': 146.4,
  '2023-02': 147.3,
  '2023-03': 147.5,
  '2023-04': 147.2,
  '2023-05': 147.6,
  '2023-06': 148.1,
  '2023-07': 148.8,
  '2023-08': 149.1,
  '2023-09': 148.0,
  '2023-10': 148.1,
  '2023-11': 148.2,
  '2023-12': 147.6,
  '2024-01': 149.8,
  '2024-02': 150.2,
  '2024-03': 150.4,
  '2024-04': 151.4,
  '2024-05': 151.4,
  '2024-06': 151.0,
  '2024-07': 152.0,
  '2024-08': 152.4,
  '2024-09': 151.8,
  '2024-10': 152.3,
  '2024-11': 152.4,
  '2024-12': 152.0,
  '2025-01': 154.0,
  '2025-02': 154.3,
  '2025-03': 154.4,
  '2025-04': 154.2,
  '2025-05': 155.0,
  '2025-06': 155.4,
  '2025-07': 156.1,
  '2025-08': 156.2,
  '2025-09': 155.3,
  '2025-10': 156.1,
  '2025-11': 155.6,
  '2025-12': 155.2,
  '2026-01': 156.5,
  '2026-02': 156.4,
  '2026-03': 157.3,
  '2026-04': 158.0,
  '2026-05': 158.3,
  '2026-06': 157.8,
}

/** Roční PRŮMĚR cenové hladiny (stejná báze 2015 = 100), dopočtený z míry inflace ČSÚ. */
export const ANNUAL_AVG_CPI: Record<number, number> = {
  1999: 69.8337,
  2000: 71.5097,
  2001: 74.3701,
  2002: 77.2705,
  2003: 77.3478,
  2004: 79.5135,
  2005: 81.0243,
  2006: 83.0499,
  2007: 85.3753,
  2008: 90.7539,
  2009: 91.6615,
  2010: 93.0364,
  2011: 94.8041,
  2012: 97.9326,
  2013: 99.3037,
  2014: 99.7009,
  2015: 100.0,
}

const MONTHS = Object.keys(MONTHLY_CPI).sort()
const FIRST_MONTHLY = MONTHS[0]
const LAST_MONTHLY = MONTHS[MONTHS.length - 1]
const ANNUAL_YEARS = Object.keys(ANNUAL_AVG_CPI).map(Number).sort((a, b) => a - b)

function ym(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

/** Zlomek roku (0–1) daného data – pro interpolaci mezi ročními průměry. */
function yearFraction(d: Date): number {
  const y = d.getUTCFullYear()
  const start = Date.UTC(y, 0, 1)
  const end = Date.UTC(y + 1, 0, 1)
  return (d.getTime() - start) / (end - start)
}

/**
 * Cenová hladina k danému datu (báze 2015 = 100).
 * Vrací null, když datum leží před začátkem řady (1999) – nemáme čím deflovat.
 */
export function cpiLevel(date: string | Date): number | null {
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return null
  const key = ym(d)

  if (key >= FIRST_MONTHLY) {
    // Exaktní měsíční data; za koncem řady držíme poslední známý index.
    return MONTHLY_CPI[key] ?? MONTHLY_CPI[LAST_MONTHLY]
  }

  // Před 2015: interpolace mezi ročními průměry, které kotvíme doprostřed roku (1. 7.).
  const y = d.getUTCFullYear()
  const t = yearFraction(d) - 0.5 // <0 = první pololetí → interpolujeme k předchozímu roku
  const from = t < 0 ? y - 1 : y
  const to = from + 1
  const a = ANNUAL_AVG_CPI[from]
  const b = ANNUAL_AVG_CPI[to] ?? MONTHLY_CPI[`${to}-07`]
  if (a == null || b == null) {
    return ANNUAL_AVG_CPI[y] ?? (y < ANNUAL_YEARS[0] ? null : null)
  }
  const w = t < 0 ? t + 1 : t // 0..1 mezi 1.7. `from` a 1.7. `to`
  // Interpolace v logaritmu = konstantní tempo inflace uvnitř intervalu.
  return a * Math.pow(b / a, w)
}

/**
 * Kolikrát vzrostly ceny mezi dvěma daty (např. 1,85 = ceny +85 %).
 * null = mimo pokrytí dat.
 */
export function inflationFactor(startDate: string | Date, endDate: string | Date): number | null {
  const a = cpiLevel(startDate)
  const b = cpiLevel(endDate)
  if (a == null || b == null || a <= 0) return null
  return b / a
}

/** Poslední měsíc, pro který máme oficiální index (pro popisky „data k…"). */
export const CPI_LAST_MONTH = LAST_MONTHLY
