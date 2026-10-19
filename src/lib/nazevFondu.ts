/**
 * ZOBRAZENÍ TŘÍDY FONDU – jedna funkce pro žebříčky, hledání a srovnávač (kolo 5, 19. 10. 2026).
 *
 * Názvy tříd jsou ve zdroji syrové a každý emitent je píše jinak: „· 1C“, „· 4C“ (Xtrackers), „USD acc“
 * vs. „USD Acc“, „USD Ukdis“ (UBS), „(USD) Accumulating“ (Vanguard). Revize: 8× „iShares Core S&P 500
 * UCITS …“ ve výsledcích hledání, které nešly rozlišit. Proto zobrazujeme normalizovaně:
 *   výplata  = Acc / Dist (z `distribution_policy`, jen když chybí, z názvu),
 *   měna     = měna třídy, jen když je v názvu výslovně (jinak null – nehádáme),
 *   zajištění = měna zajištění (detectHedging – jediná funkce webu).
 * Kód třídy (1C, 4C, A-acc…) se nezobrazuje. Název fondu v DB se NEMĚNÍ – jen zobrazení.
 */
import { detectHedging } from '@/utils/hedgingDetection';
import { distKind } from '@/utils/distribution';

export interface TridaFondu {
  vyplata: 'Acc' | 'Dist' | null;
  /** Měna třídy (USD, EUR…), když ji název uvádí a třída není zajištěná. */
  mena: string | null;
  /** Měna, do které je třída měnově zajištěná; „ano“ = zajištěná, měnu nepoznáme; null = nezajištěná. */
  zajisteni: string | null;
}

const MENY = /^(USD|EUR|GBP|CHF|JPY|SEK|SGD|AUD|CAD|NOK|DKK|HKD|PLN|CZK|MXN|CNH)$/i;

/** Krátký název fondu: bez „UCITS ETF…“ a koncové závorky („iShares Core S&P 500“). */
export function kratkyNazevFondu(n: string): string {
  return n.replace(/\s+UCITS\b.*$/i, '').replace(/\s+\([^()]*\)\s*$/, '').trim() || n;
}

/** Část názvu za „UCITS ETF“ (třída): „USD (Acc)“, „hEUR acc“, „1C“… */
function castTridy(n: string): string {
  const m = n.match(/\b(?:UCITS\s+)?(?:ETF|ETC|ETP|ETN)\b(.*)$/i);
  return (m?.[1] ?? '').replace(/[()]/g, ' ').trim();
}

export function tridaFondu(name: string | null | undefined, distributionPolicy?: string | null, distributionFrequency?: string | null): TridaFondu {
  const n = String(name ?? '');
  const h = detectHedging(n);
  const slova = castTridy(n).split(/[^A-Za-z0-9]+/).filter(Boolean);
  let vyplata: TridaFondu['vyplata'] = null;
  const k = distKind(distributionPolicy, distributionFrequency);
  if (k === 'acc') vyplata = 'Acc';
  else if (k === 'dist') vyplata = 'Dist';
  else if (slova.some((w) => /^(acc|accumulating|accumulation|capitalisation|1c|2c|c)$/i.test(w))) vyplata = 'Acc';
  else if (slova.some((w) => /^(dist|dis|distributing|distribution|inc|income|ukdis|1d|d)$/i.test(w))) vyplata = 'Dist';
  const mena = h.isHedged ? null : (slova.find((w) => MENY.test(w))?.toUpperCase() ?? null);
  return { vyplata, mena, zajisteni: h.isHedged ? h.hedgedCurrency ?? 'ano' : null };
}

/** Text třídy pro jeden řádek: „Acc · USD“, „Dist · zajištěno do EUR“, „“ když nic nevíme. */
export function tridaText(t: TridaFondu): string {
  return [t.vyplata, t.mena, t.zajisteni ? (t.zajisteni === 'ano' ? 'zajištěno' : `zajištěno do ${t.zajisteni}`) : null]
    .filter(Boolean).join(' · ');
}
