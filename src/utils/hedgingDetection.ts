/**
 * Měnové zajištění třídy fondu – JEDINÁ funkce pro celý web (srovnávač, porovnání, žebříčky,
 * přiřazení fondu k indexu v backtestu). Dřív měl žebříček i backtest vlastní kopie a každá znala
 * jiné tvary zápisu → filtr „Nezajištěné“ ve srovnávači vracel zajištěné třídy (revize 18. 10. 2026).
 *
 * Zdroj: jen NÁZEV fondu. Sloupec `currency_risk` je v DB nepoužitelný (obsahuje jen měnu fondu
 * „EUR    Currency risk  Currency“, nikdy „hedged“ – ověřeno nad všemi 5 197 řádky 18. 10. 2026);
 * použije se, jen kdyby někdy obsahoval slovo hedged/unhedged.
 *
 * Tvary zápisu nalezené průchodem VŠECH názvů v DB (18. 10. 2026):
 *   „EUR Hedged“, „EUR-Hedged“, „EUR Hdg“, „(EUR) Hedged“, „EUR Daily Hedged“, „EUR Hedge ETC“ (BNPP)
 *   „EUR PfHdg“ (Invesco, portfolio hedged)               – justETF: Currency hedged (IE0006VDD4K1)
 *   „hEUR“, „ir-hEUR“ (UBS)                                – justETF: Currency hedged (IE00BYM11K57)
 *   „(H-CHF)“ (Allianz), „H-CHF (hedged)“ (Raiffeisen)     – justETF: Currency hedged (IE00001O3JU5)
 *   „H EUR“, „EUR (H)“ (BNP), „GBP-H“ (M&G), „EAH EUR“ (Swisscanto)
 *   „hedged to JPY“, „hedged (CHF)“, „ACC-Euro (hedged)“ (Fidelity), „SEK Hedged“, „JPY Hedged“
 * NEJDE o měnové zajištění (zajištění úrokové sazby nebo akciového trhu opcemi):
 *   „Interest Rate Hedged“ (iShares), „Tail Hedge“ (Global X), „Hedged Equity“ (JPMorgan),
 *   „Dynamically Hedged US Equities“ (Fineco)            – justETF: Currency unhedged (IE000I93LGG9)
 *
 * Kontrola: scripts/check-fund-data.mjs (VAROVÁNÍ: název má vzor zajištění, srovnávač říká „nezajištěno“).
 */

/** 'unhedged' | '<měna>_hedged' (eur_hedged, usd_hedged, jpy_hedged…) | 'other_hedged' (měnu nepoznáme). */
export type HedgingType = 'unhedged' | `${string}_hedged`;

export interface HedgingInfo {
  isHedged: boolean;
  /** Měna, do které třída zajišťuje (EUR, CHF…), null = nezajištěná nebo měnu neznáme. */
  hedgedCurrency: string | null;
  hedgingType: HedgingType;
}

const MENY = 'EUR|USD|GBP|CHF|JPY|SEK|SGD|AUD|CAD|NOK|DKK|HKD|PLN|CZK|MXN|CNH';
const NEZAJISTENO: HedgingInfo = { isHedged: false, hedgedCurrency: null, hedgingType: 'unhedged' };
const zajisteno = (mena: string | null): HedgingInfo => {
  const m = mena ? (/^euro$/i.test(mena) ? 'EUR' : mena.toUpperCase()) : null;
  return { isHedged: true, hedgedCurrency: m, hedgingType: m ? `${m.toLowerCase()}_hedged` : 'other_hedged' };
};

/** Zajištění, které NENÍ měnové (úroková sazba, opce na akciový trh). */
const NE_MENOVE = /\b(interest rate hedged|tail hedge|hedged equity|dynamically hedged)\b/gi;

/** Vzory s měnou. Pořadí = priorita. Case-sensitive tam, kde malé/velké písmeno rozlišuje význam („hEUR“, „H-CHF“). */
const VZORY_S_MENOU: RegExp[] = [
  new RegExp(`(?:^|[\\s-])h(${MENY})\\b`),                                    // UBS hEUR, ir-hEUR
  new RegExp(`\\bEAH (${MENY})\\b`),                                           // Swisscanto EAH CHF
  new RegExp(`\\bH[- ](${MENY})\\b`),                                          // Allianz (H-CHF), Raiffeisen H-CHF, BNP H EUR
  new RegExp(`\\b(${MENY}) \\(H\\)`),                                          // BNP EUR (H)
  new RegExp(`\\b(${MENY})-H\\b`),                                             // M&G GBP-H
  new RegExp(`\\b(${MENY})\\)?[\\s-]*(?:(?:daily|monthly)\\s+)?(?:hedged?|hdg|pfhdg)\\b`, 'i'), // EUR Hedged / (EUR) Hedged / EUR PfHdg / EUR Hedge ETC
  new RegExp(`\\b(?:hedged?|hdg)\\s*\\(?\\s*(?:to\\s+)?(${MENY})\\b`, 'i'),  // hedged to JPY, hedged (CHF)
  new RegExp(`\\b(?:acc|inc|dist)-(euro|${MENY})\\s*\\(hedged\\)`, 'i'),     // Fidelity ACC-Euro (hedged)
];
/** Zajištění bez poznatelné měny. */
const OBECNE = /\b(hedged?|hdg|pfhdg)\b/i;

export function detectHedging(etfName: string | null | undefined, currencyRisk?: string | null): HedgingInfo {
  const risk = (currencyRisk ?? '').toLowerCase();
  if (/\b(unhedged|not hedged)\b/.test(risk)) return NEZAJISTENO;

  const nazev = (etfName ?? '').replace(NE_MENOVE, ' ');
  if (!nazev.trim()) return NEZAJISTENO;
  // „Unhedged“ obsahuje „hedged“ – dřív se 94 výslovně NEzajištěných fondů („… USD Unhedged“) hlásilo jako zajištěné.
  if (/\b(unhedged|not hedged)\b/i.test(nazev)) return NEZAJISTENO;

  for (const re of VZORY_S_MENOU) {
    const m = nazev.match(re);
    if (m) return zajisteno(m[1]);
  }
  if (OBECNE.test(nazev) || /\bhedged\b/.test(risk)) return zajisteno(null);
  return NEZAJISTENO;
}

/** Krátký český štítek: „zajištěno do EUR“ / „zajištěno“ / null (nezajištěná třída). */
export function stitekZajisteni(h: HedgingInfo): string | null {
  if (!h.isHedged) return null;
  return h.hedgedCurrency ? `zajištěno do ${h.hedgedCurrency}` : 'zajištěno';
}
