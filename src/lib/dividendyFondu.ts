/**
 * Komoditní a kryptoměnové produkty (fyzické zlato, ETC, kryptoměnové ETP) dividendy NEMAJÍ – není z čeho.
 * Zdroj je přesto vede jako „Accumulating“, a detail fondu proto psal u zlata „Reinvestuje“ a „Fond dividendy
 * reinvestuje – na účet nic nechodí“ (revize kola 4, 18. 10. 2026). Srovnávač to řešil už dřív (ScreenerUI,
 * „nevyplácí“). Hlídá to `scripts/check-fund-data.mjs` (detail zlata a bitcoinu nesmí obsahovat „reinvest“).
 *
 * Distribuční komoditní fondy (37 k 18. 10. 2026: „Enhanced Commodity“ vyplácí úroky z pokladničních
 * poukázek, IncomeShares Gold+ Yield výnos z opcí) dál ukazují, co uvádí zdroj. Fondy těžařů (miners)
 * drží akcie a dividendy mají – nejsou „komodita“.
 */
export type Komodita = 'komodita' | 'kryptoměna';

export function druhKomodity(category: string | null | undefined, name: string | null | undefined): Komodita | null {
  if (/miner/i.test(name ?? '')) return null;
  if (category === 'Komodity') return 'komodita';
  if (category === 'Krypto') return 'kryptoměna';
  return null;
}

/** „Nevyplácí (komodita)“ – jen u akumulačních tříd komodit/krypta (distribuční ukazují data zdroje). */
export function nevyplaciKomodita(category: string | null | undefined, name: string | null | undefined, kind: 'acc' | 'dist' | 'unknown'): Komodita | null {
  return kind === 'acc' ? druhKomodity(category, name) : null;
}
