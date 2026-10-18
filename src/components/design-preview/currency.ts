/* Čisté (server i client) pomůcky pro měnu výnosů. Bez 'use client' – aby šly
   volat i v serverových komponentách (např. buildParamRows). Stav/hook je
   v currencyStore.ts. Báze dat justETF je EUR → EUR = sloupec bez přípony. */

export type Currency = 'CZK' | 'EUR' | 'USD';

export const CURRENCIES: Currency[] = ['CZK', 'EUR', 'USD'];

/** Přípona sloupce výnosu pro danou měnu: CZK→_czk, USD→_usd, EUR→'' (báze). */
export function curSuffix(cur: Currency): '' | '_czk' | '_usd' {
  return cur === 'CZK' ? '_czk' : cur === 'USD' ? '_usd' : '';
}

/** Symbol/label měny pro popisky. */
export const curLabel: Record<Currency, string> = { CZK: 'Kč', EUR: '€', USD: '$' };

/**
 * Vybere hodnotu výnosu za období v dané měně z objektu s poli
 * return_<period>(_czk|_usd). EUR = pole bez přípony.
 * Když přepočet do Kč/USD chybí, vrací null („—“) – NIKDY výnos v EUR vydávaný za Kč
 * (pravidlo č. 1; do 18. 10. 2026 tu byl tichý fallback na EUR – postihoval srovnávač,
 * porovnání i žebříčky u fondů bez přepočtu a krátká období 1M/3M/6M, která jsou jen v EUR).
 */
export function pickReturn(
  obj: Record<string, unknown> | null | undefined,
  period: string,
  cur: Currency,
): number | null {
  if (!obj) return null;
  const v = obj[`return_${period}${curSuffix(cur)}`];
  return v == null || Number.isNaN(Number(v)) ? null : Number(v);
}
