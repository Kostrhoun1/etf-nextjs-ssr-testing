/**
 * TŘÍDY TÉHOŽ FONDU – kontrola volatility (revize kola 4, 18. 10. 2026, pravidlo č. 1).
 *
 * Zdroj (justETF) má u některých tříd téhož fondu volatilitu, která nesedí s jinou třídou – např.
 * SPDR MSCI ACWI IMI: SPYI (Acc) 10,4 %, SPSA (Dist) 21,1 %; Vanguard FTSE All-World High Dividend:
 * VHYL 8,1 % vs VGWE 10,8 % (3 roky 10,0 vs 17,0 %). Třídy drží stejné portfolio, v eurech (v nich se riziko
 * počítá) musí kolísat stejně – liší se jen měnově ZAJIŠTĚNÉ třídy, ty se proto porovnávají jen mezi sebou.
 * Nezávislé ověření z denních cen Yahoo za rok (EUR): SPYI.DE 10–11 %, SPSA.DE 12 %, VHYL.AS 8–9 %,
 * VGWE.DE 9–9,5 % → chybné jsou vyšší údaje zdroje. Který z dvojice je špatně, ale ze zdroje poznat nejde.
 *
 * Pravidlo: třída téhož fondu = stejný poskytovatel + stejný název před „UCITS ETF“ + stejný zbytek po
 * odečtení označení třídy (měna, Acc/Dist, 1C/1D…) + stejné měnové zajištění. Údaj „nesedí“, když se od
 * ostatních liší o víc než 30 % (relativně) A zároveň aspoň o 1 p. b. (u fondů peněžního trhu s kolísavostí
 * pod 1 % je relativní rozdíl šum). Dvě třídy, které nesedí → „—“ u obou (nevíme, která je správně).
 * Tři a víc → „—“ u těch, které se liší od mediánu.
 * Kontrola: scripts/check-fund-data.mjs (VAROVÁNÍ „volatilita tříd téhož fondu nesedí“).
 */
import { detectHedging } from '@/utils/hedgingDetection';

export type ObdobiVol = '1y' | '3y' | '5y';

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

type Fond = { isin: string; name: string | null; fund_provider: string | null; volatility_1y?: number | null; volatility_3y?: number | null; volatility_5y?: number | null };

/** ISIN → období, kde volatilita nesedí s jinou třídou téhož fondu. Jen fondy s problémem. */
export function volatilitaNesedi(fondy: Fond[], obdobi: ObdobiVol[] = ['1y', '3y', '5y']): Map<string, ObdobiVol[]> {
  const skupiny = new Map<string, Fond[]>();
  for (const f of fondy) {
    const k = klicTridy(f.name, f.fund_provider);
    if (k) skupiny.set(k, [...(skupiny.get(k) ?? []), f]);
  }
  const out = new Map<string, ObdobiVol[]>();
  const pridej = (isin: string, o: ObdobiVol) => out.set(isin, [...(out.get(isin) ?? []), o]);
  for (const g of skupiny.values()) {
    if (g.length < 2) continue;
    for (const o of obdobi) {
      const s = g.map((f) => ({ isin: f.isin, v: f[`volatility_${o}`] })).filter((x): x is { isin: string; v: number } => x.v != null && Number(x.v) > 0)
        .map((x) => ({ isin: x.isin, v: Number(x.v) }));
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

export const VOL_NESEDI_TEXT = 'Údaj zdroje nesedí s jinou třídou téhož fondu (stejné portfolio musí kolísat stejně), proto ho neuvádíme.';
