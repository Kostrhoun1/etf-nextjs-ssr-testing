/**
 * Konkrétní fond → historická data indexu v backtestu (17. 10. 2026).
 *
 * Lidé hledají fondy podle tickeru (VWCE, CSPX…), backtest ale počítá s historií indexů
 * (src/lib/backtest/indexes.ts). Tady je JEDINÉ místo, které rozhoduje, jestli a čím fond
 * v backtestu nahradit. Pravidlo č. 1: raději žádné přiřazení než špatné.
 *
 *  - 'stejny'  = fond sleduje stejný index, ze kterého jsou data (S&P 500 ↔ SPY, Russell 2000 ↔ IWM…)
 *  - 'blizky'  = velmi podobný index (FTSE All-World ↔ VT = FTSE Global All Cap, MSCI EM IMI ↔ EEM…);
 *                UI to MUSÍ říct
 *  - null      = nemáme věrohodnou historii (MSCI World, Nasdaq 100, sektory, páka, měnově zajištěné…)
 *
 * Poplatek: výpočet se přepočítá na TER fondu (feeOverride) – data jsou NAV zdrojového fondu,
 * engine nahradí jeho poplatek (sourceTer v manifestu) poplatkem vybraného fondu.
 * Ověření přiřazení: scripts/overeni-fond-na-index.mjs (projde všechny fondy v DB).
 */

export type Shoda = 'stejny' | 'blizky';

export interface FondProPrirazeni {
  isin: string;
  name: string | null;
  index_name?: string | null;
  is_leveraged?: boolean | null;
  currency_risk?: string | null;
}

export interface Prirazeni {
  indexCode: string;
  shoda: Shoda;
  /** Krátké vysvětlení pro UI: z čeho je historie. */
  zdroj: string;
}

/** Měnově zajištěné třídy – stejná logika jako src/utils/hedgingDetection.ts (tam je i historie
 *  chyb: „Unhedged“ obsahuje „hedged“, zkratka „Hdg“) + UBS „hEUR/hCHF…“ a Invesco „PfHdg“. */
function jeZajisteny(jmeno: string, menoveRiziko?: string | null): boolean {
  const r = (menoveRiziko ?? '').toLowerCase();
  if (r) {
    if (r.includes('unhedged') || r.includes('not hedged')) return false;
    if (r.includes('hedged')) return true;
  }
  const n = jmeno.toLowerCase();
  if (/\b(unhedged|not hedged)\b/.test(n)) return false;
  return /\b(hedged|hdg)\b|pfhdg/.test(n) || /\bh(EUR|USD|GBP|CHF|JPY|SGD)\b/.test(jmeno);
}
/** Dluhopisové varianty s jiným výnosem/rizikem než široký index. */
const DLUHOPISY_JINE =
  /active|advantage|climate|carbon|paris|\bpab\b|\bsri\b|\besg\b|screened|fossil|green|transition|sustainab|target duration|\d+\+\s*y|1m\b|yield plus|large cap|bbb|portfolio|short duration|inflation|linked|floating|bulletshares|ibonds|\b20\d\d\b|0-1\b|ultrashort|interest rate hedged|enhanced|highest rated|macro/i;
/**
 * Akcie: přiřadit jen když za názvem indexu HNED následuje „UCITS“ (dovolené jsou jen technické
 * přívlastky Swap/II/SF/PEA/IMI). Sektory, faktory, ESG, buffer/opční strategie tím vypadnou –
 * pole index_name je v datech nespolehlivé (sektorové fondy tam mají celý STOXX 600).
 */
const presne = (index: string) =>
  new RegExp(`(^|\\s)(Core |PEA |ETF |Prime )?${index}( (II|Swap|Swap II|Swap PEA|SF|PEA|Investable Market))? UCITS\\b`, 'i');

export function prirazeniFondu(f: FondProPrirazeni): Prirazeni | null {
  if (!f.name) return null;
  if (f.is_leveraged) return null;
  const jmeno = f.name;
  if (jeZajisteny(jmeno, f.currency_risk)) return null; // zajištěné = jiný výnos než nezajištěná data

  // ── ZLATO (fyzické; ne těžaři) ──
  if (/\b(physical gold|gold bullion|xetra-gold|gold etc|euwax gold|physical swiss gold)\b/i.test(jmeno)
      && !/miner|mining|silver|platinum|palladium|precious metals basket/i.test(jmeno)) {
    return { indexCode: 'gold', shoda: 'stejny', zdroj: 'cena zlata (fond GLD)' };
  }

  // ── DLUHOPISY ──
  if (/bond/i.test(jmeno) && DLUHOPISY_JINE.test(jmeno)) return null;
  const ish = /^iShares\b/i.test(jmeno);
  if (/treasury/i.test(jmeno) && /\b(usd|us|u\.s\.)\b/i.test(jmeno)) {
    if (/\b1-3\s*(yr|y\b|year)/i.test(jmeno)) return { indexCode: 'us_treasury_1_3y', shoda: ish ? 'stejny' : 'blizky', zdroj: 'US státní dluhopisy 1–3 roky (fond SHY)' };
    if (/\b7-10\s*(yr|y\b|year)/i.test(jmeno)) return { indexCode: 'us_treasury_7_10y', shoda: ish ? 'stejny' : 'blizky', zdroj: 'US státní dluhopisy 7–10 let (fond IEF)' };
    if (/\b20\+\s*(yr|y\b|year)/i.test(jmeno)) return { indexCode: 'us_treasury_20y', shoda: ish ? 'stejny' : 'blizky', zdroj: 'US státní dluhopisy 20+ let (fond TLT)' };
    return null;
  }
  if (/\b(us|u\.s\.|usd) aggregate bond/i.test(jmeno) && !/global/i.test(jmeno)) {
    return { indexCode: 'us_aggregate_bond', shoda: 'blizky', zdroj: 'americké dluhopisy celkově (fond AGG)' };
  }
  if (/\busd corporate bond\b/i.test(jmeno) && !/high yield|0-3|1-5|0-5|broad/i.test(jmeno)) {
    return { indexCode: 'us_corp_bond_ig', shoda: ish ? 'stejny' : 'blizky', zdroj: 'americké firemní dluhopisy (fond LQD)' };
  }
  if (/(euro|eur|eurozone) gov(ernmen)?t bond/i.test(jmeno)) {
    if (/\b1-3\s*(yr|y\b|year)/i.test(jmeno)) return { indexCode: 'eur_govt_bond_1_3y', shoda: ish ? 'stejny' : 'blizky', zdroj: 'eurové státní dluhopisy 1–3 roky (fond IBGS)' };
    if (/\b3-5\s*(yr|y\b|year)/i.test(jmeno)) return { indexCode: 'eur_govt_bond_3_7y', shoda: ish ? 'stejny' : 'blizky', zdroj: 'eurové státní dluhopisy 3–5 let (fond IBGX)' };
    if (/\b15-30\s*(yr|y\b|year)/i.test(jmeno)) return { indexCode: 'eur_govt_bond_15_30y', shoda: ish ? 'stejny' : 'blizky', zdroj: 'eurové státní dluhopisy 15–30 let (fond IBGL)' };
    if (!/\d/.test(jmeno.replace(/UCITS.*$/i, ''))) return { indexCode: 'eur_govt_bond', shoda: 'blizky', zdroj: 'eurové státní dluhopisy celkově (fond XGLE)' };
    return null;
  }
  if (/(euro|eur) corp(orate)? bond/i.test(jmeno) && !/0-3|1-5|0-5|financials|high yield/i.test(jmeno)) {
    return { indexCode: 'eur_corp_bond', shoda: 'blizky', zdroj: 'eurové firemní dluhopisy (fond IEAC)' };
  }
  if (/bond|treasury|gilt|t-bill|money market/i.test(jmeno)) return null;

  // ── AKCIE (přísný tvar názvu) ──
  if (/china|india|japan|korea|taiwan/i.test(jmeno)) return null;
  if (presne('Russell 1000 (U\\.S\\. |US )?Value').test(jmeno)) return { indexCode: 'us_value', shoda: 'stejny', zdroj: 'Russell 1000 Value (fond IWD)' };
  if (presne('Russell 1000 (U\\.S\\. |US )?Growth').test(jmeno)) return { indexCode: 'us_growth', shoda: 'stejny', zdroj: 'Russell 1000 Growth (fond IWF)' };
  if (presne('Russell 2000( U\\.S\\. Small-Cap| US Small-Cap)?').test(jmeno)) return { indexCode: 'us_small_cap', shoda: 'stejny', zdroj: 'Russell 2000 (fond IWM)' };
  if (presne('S&P 500').test(jmeno)) return { indexCode: 'sp500', shoda: 'stejny', zdroj: 'index S&P 500 (fond SPY)' };
  if (presne('FTSE Global All Cap').test(jmeno)) return { indexCode: 'ftse_all_world', shoda: 'stejny', zdroj: 'FTSE Global All Cap (fond VT, od 2008)' };
  if (presne('FTSE All-World').test(jmeno) || presne('MSCI (ACWI|All Country World)( IMI)?').test(jmeno)) {
    return { indexCode: 'ftse_all_world', shoda: 'blizky', zdroj: 'celý svět – fond VT (FTSE Global All Cap, od 2008)' };
  }
  if (presne('MSCI Emerging Markets').test(jmeno)) return { indexCode: 'msci_em', shoda: 'stejny', zdroj: 'MSCI Emerging Markets (fond EEM)' };
  if (presne('MSCI Emerging Markets IMI').test(jmeno) || presne('FTSE Emerging Markets').test(jmeno)) {
    return { indexCode: 'msci_em', shoda: 'blizky', zdroj: 'rozvíjející se trhy – MSCI Emerging Markets (fond EEM)' };
  }
  if (presne('FTSE Developed Europe').test(jmeno)) return { indexCode: 'ftse_europe', shoda: 'blizky', zdroj: 'FTSE Developed Europe All Cap (fond VGK)' };
  if (presne('(MSCI Europe|STOXX Europe 600)').test(jmeno)) return { indexCode: 'ftse_europe', shoda: 'blizky', zdroj: 'evropské akcie – FTSE Developed Europe (fond VGK)' };
  return null;
}
