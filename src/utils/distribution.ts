/**
 * Typ výplaty fondu – JEDNO místo pro celý web (detail fondu i srovnávač).
 *
 * Dřív byla funkce zkopírovaná v detailu i ve srovnávači a srovnávač navíc nedostával
 * `distribution_frequency` → fondy bez `distribution_policy` byly na detailu „distribuční“
 * a ve srovnávači „neznámé“ a filtr „distribuční“ je vynechal (audit 17. 10. 2026).
 *
 * Prázdná politika se NEdomýšlí na akumulační; distribuci prozradí výplatní frekvence.
 */
export type DistKind = 'acc' | 'dist' | 'unknown';

const PAYOUT_FREQ = /(quarter|month|annual|semi|dividend|income)/i;

export function distKind(policy: string | null | undefined, freq?: string | null): DistKind {
  const p = policy || '';
  if (/accumulat|thesaur|capitalis/i.test(p)) return 'acc';
  if (/distribut/i.test(p)) return 'dist';
  if (freq && PAYOUT_FREQ.test(freq)) return 'dist';
  return 'unknown';
}
