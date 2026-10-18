/**
 * TŘÍDY TÉHOŽ FONDU – kontrola rizikových ukazatelů zdroje (revize kola 4, 18. 10. 2026, pravidlo č. 1).
 *
 * Zdroj (justETF) má u některých tříd téhož fondu kolísavost/pokles, které nesedí s jinou třídou – např.
 * SPDR MSCI ACWI IMI: SPYI (Acc) kolísavost 10,4 %, pokles −6,9 %; SPSA (Dist) 21,1 % a −13,0 %.
 * Vanguard FTSE All-World High Dividend: VHYL 8,1 % vs VGWE 10,8 % (3 roky 10,0 vs 17,0 %).
 * Třídy drží stejné portfolio, v eurech (v nich se riziko počítá) musí kolísat stejně – liší se jen měnově
 * ZAJIŠTĚNÉ třídy, ty se proto porovnávají jen mezi sebou.
 * Nezávislé ověření z denních cen Yahoo za rok (EUR, 18. 10. 2026): kolísavost SPYI.DE 10–11 %, SPSA.DE 12 %,
 * VHYL.AS 8–9 %, VGWE.DE 9–9,5 %; max. pokles SPYI.DE i SPSA.DE −6,4 % → chybné jsou údaje SPSA a VGWE.
 * Který z dvojice je špatně, ale ze zdroje samotného poznat nejde.
 *
 * Pravidlo: třída téhož fondu = stejný poskytovatel + stejný název před „UCITS ETF“ + stejný zbytek po
 * odečtení označení třídy (měna, Acc/Dist, 1C/1D…) + stejné měnové zajištění. Údaj „nesedí“, když se od
 * ostatních liší o víc než 30 % (relativně) A zároveň aspoň o 1 p. b. (u fondů peněžního trhu s kolísavostí
 * pod 1 % je relativní rozdíl šum). Dvě třídy, které nesedí → „—“ u obou (nevíme, která je správně).
 * Tři a víc → „—“ u těch, které se liší od mediánu. Pokles od založení se NEporovnává (třídy mají různé stáří).
 * Kontrola: scripts/check-fund-data.mjs (VAROVÁNÍ „volatilita tříd téhož fondu se liší“).
 */
import { detectHedging } from '@/utils/hedgingDetection';

export const RIZIKO_POLE = ['volatility_1y', 'volatility_3y', 'volatility_5y', 'max_drawdown_1y', 'max_drawdown_3y'] as const;
export type RizikoPole = (typeof RIZIKO_POLE)[number];

/** Slova, která označují jen třídu fondu (ne jiný fond). Po odečtení musí zbytek názvu sedět. */
const TRIDA = /^(eur|usd|gbp|chf|jpy|sek|sgd|aud|cad|nok|dkk|hkd|pln|czk|mxn|cnh|euro|hedged?|unhedged|hdg|pfhdg|daily|monthly|to|acc|accumulating|accumulation|capitalisation|capitalization|dist|dis|distributing|distribution|inc|income|[a-z]|\d[a-z]|dr|class|inst|institutional|uk|ukdis|ukacc|h(eur|usd|gbp|chf))$/;

/** Klíč „stejný fond, jiná třída“; null = název nejde spolehlivě rozdělit na fond a třídu. */
export function klicTridy(name: string | null | undefined, provider: string | null | undefined): string | null {
  const n = String(name ?? '');
  const m = n.match(/^(.*)\b(?:UCITS\s+)?(?:ETF|ETC|ETP|ETN)\b(.*)$/i);
  if (!m || !m[1].trim()) return null;
  const zbytek = m[2].toLowerCase().split(/[^a-z0-9]+/).filter((w) => w && !TRIDA.test(w)).join(' ');
  return `${provider ?? ''}|${detectHedging(n).hedgingType}|${m[1].toLowerCase().replace(/\s+/g, ' ').trim()}|${zbytek}`;
}

const nesedi = (a: number, b: number) => Math.abs(a - b) >= 1 && Math.max(a, b) / Math.min(a, b) > 1.3;

type Fond = { isin: string; name: string | null; fund_provider: string | null } & Partial<Record<RizikoPole, number | null>>;

/** ISIN → ukazatele, které nesedí s jinou třídou téhož fondu. Jen fondy s problémem. */
export function rizikoNesedi(fondy: Fond[], pole: readonly RizikoPole[] = RIZIKO_POLE): Map<string, RizikoPole[]> {
  const skupiny = new Map<string, Fond[]>();
  for (const f of fondy) {
    const k = klicTridy(f.name, f.fund_provider);
    if (k) skupiny.set(k, [...(skupiny.get(k) ?? []), f]);
  }
  const out = new Map<string, RizikoPole[]>();
  const pridej = (isin: string, o: RizikoPole) => out.set(isin, [...(out.get(isin) ?? []), o]);
  for (const g of skupiny.values()) {
    if (g.length < 2) continue;
    for (const o of pole) {
      // Pokles je záporný – porovnává se velikost.
      const s = g.map((f) => ({ isin: f.isin, v: f[o] == null ? null : Math.abs(Number(f[o])) }))
        .filter((x): x is { isin: string; v: number } => x.v != null && x.v > 0);
      if (s.length < 2) continue;
      if (s.length === 2) {
        if (nesedi(s[0].v, s[1].v)) { pridej(s[0].isin, o); pridej(s[1].isin, o); }
        continue;
      }
      const serazene = s.map((x) => x.v).sort((a, b) => a - b);
      const med = serazene.length % 2 ? serazene[(serazene.length - 1) / 2] : (serazene[serazene.length / 2 - 1] + serazene[serazene.length / 2]) / 2;
      for (const x of s) if (nesedi(x.v, med)) pridej(x.isin, o);
    }
  }
  return out;
}

export const RIZIKO_NESEDI_TEXT = 'Údaj zdroje nesedí s jinou třídou téhož fondu (stejné portfolio musí kolísat stejně), proto ho neuvádíme.';
