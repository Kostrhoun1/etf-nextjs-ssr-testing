/**
 * Titulek a popisek detailu fondu /etf/[isin] pro vyhledávače (SEO audit 20. 10. 2026, kolo 6).
 *
 * Titulek: zobrazovaný ticker DOPŘEDU, krátký název, třída a TER – do 65 znaků (dřív plný název + 4 tickery,
 * 80–110 znaků, Google ho usekl uprostřed názvu). Druhý ticker (CSPX u SXR8) jen když se vejde.
 * Popisek: 140–160 znaků s TER a výnosem za 1 rok v Kč VČETNĚ dne, ke kterému platí. Detail se cachuje
 * 30 dní (ISR, free tier Vercelu) – číslo bez data by ve výsledcích hledání vypadalo jako dnešní (pravidlo č. 1).
 * Výnos se vynechá, když chybí, když jsou data fondu starší 7 dní, nebo když je výnos mimo svůj trh (stejné
 * pravidlo jako hlavička detailu – tam se pak výnosy neukazují vůbec).
 * Hlídá scripts/check-fund-data.mjs (blok kolo6 seo).
 */
import { kratkyNazevFondu, tridaFondu } from '@/lib/nazevFondu';
import { terFmt, procenta } from '@/lib/formatyCisel';

export const MAX_TITULEK = 65;

export function titulekDetailu(f: {
  name: string; ticker: string | null; dalsiTicker?: string | null; ter: number | null;
  distribution_policy?: string | null; distribution_frequency?: string | null;
}): string {
  const tr = tridaFondu(f.name, f.distribution_policy, f.distribution_frequency);
  const trida = [tr.vyplata, tr.zajisteni ? (tr.zajisteni === 'ano' ? 'zajištěno' : `zajištěno ${tr.zajisteni}`) : null].filter(Boolean).join(', ');
  const nazev = kratkyNazevFondu(f.name) + (trida ? ` (${trida})` : '');
  const terTxt = f.ter != null && Number.isFinite(f.ter) && f.ter > 0 ? `, TER ${terFmt(f.ter)}` : '';
  const varianty: string[] = [];
  const tk = f.ticker;
  const tk2 = f.dalsiTicker && tk && f.dalsiTicker.toUpperCase() !== tk.toUpperCase() ? `${tk} (${f.dalsiTicker})` : null;
  const pred = (t: string | null) => (t ? `${t} – ` : '');
  for (const t of tk2 ? [tk2, tk] : [tk]) {
    varianty.push(`${pred(t)}${nazev}: výnos v Kč${terTxt}`);
  }
  varianty.push(`${pred(tk)}${nazev}: výnos v Kč`, `${pred(tk)}${nazev}`);
  const vejde = varianty.find((v) => v.length <= MAX_TITULEK);
  if (vejde) return vejde;
  // Dlouhý název (sektorové a tematické fondy): useknout na celé slovo + „…“.
  const zbyva = MAX_TITULEK - pred(tk).length - 1;
  const slova = nazev.split(' ');
  let kratky = '';
  for (const w of slova) { if ((kratky ? kratky + ' ' + w : w).length > zbyva) break; kratky = kratky ? kratky + ' ' + w : w; }
  return `${pred(tk)}${kratky || nazev.slice(0, zbyva)}…`;
}

export function popisekDetailu(f: {
  name: string; isin: string; tickery: string[]; ter: number | null;
  vynos1rCzk: number | null; datumDat: Date | null; staleDni: number | null; vynosNeovereny: boolean;
}): string {
  const datum = f.datumDat ? `${f.datumDat.getUTCDate()}. ${f.datumDat.getUTCMonth() + 1}. ${f.datumDat.getUTCFullYear()}` : null;
  const terOk = f.ter != null && Number.isFinite(f.ter) && f.ter > 0;
  const vynosOk = f.vynos1rCzk != null && Number.isFinite(f.vynos1rCzk) && !!datum && f.staleDni != null && f.staleDni <= 7 && !f.vynosNeovereny;
  const kratky = kratkyNazevFondu(f.name);
  const tk = f.tickery[0];
  const casti: string[] = [];
  const hlava = `${kratky}${tk ? ` (${tk})` : ''}`;
  if (terOk && vynosOk) casti.push(`${hlava}: TER ${terFmt(f.ter)}, výnos za 1 rok ${procenta(f.vynos1rCzk)} v Kč (data k ${datum}).`);
  else if (terOk) casti.push(`${hlava}: roční poplatek TER ${terFmt(f.ter)}, výnos přepočtený do korun.`);
  else casti.push(`${hlava}: výnos přepočtený do korun, poplatky a složení fondu.`);
  const doplnky = [
    ` ISIN ${f.isin}.`,
    f.tickery.length > 1 ? ` Tickery: ${f.tickery.slice(0, 4).join(', ')}.` : '',
    ' Složení, rizika a kde fond koupit.',
    ' Pro české investory.',
  ].filter(Boolean);
  let out = casti[0];
  for (const d of doplnky) if ((out + d).length <= 160) out += d;
  return out;
}
