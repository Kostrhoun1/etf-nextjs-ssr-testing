/**
 * Časová řada pro graf „Vývoj 10 000 Kč“ na detailu fondu (18. 10. 2026).
 *
 * PRAVIDLO Č. 1: graf se ukáže JEN u fondu, který přesně sedí na index z manifestu
 * (prirazeniFondu → shoda 'stejny'). Data jsou NAV zdrojového fondu (SPY, GLD, IEF…) z
 * `index_historical_data`, převedená do Kč historickými kurzy (exchange_rates_historical, ECB)
 * stejnou funkcí jako backtest. Řada fondu samotného neexistuje – UI to MUSÍ říct.
 * Při chybě nebo zastaralých datech vrací null → graf se nevykreslí (místo něj roční sloupce).
 */
import { loadIndexData, loadExchangeRates, convertIndexSeriesToCurrency } from '@/lib/backtest/engine';
import { INDEX_BY_CODE } from '@/lib/backtest/indexes';

/** [ 'YYYY-MM-DD', cena v Kč ] – kompaktní tvar do HTML stránky. */
export type BodVyvoje = [string, number];

export interface VyvojIndexu {
  body: BodVyvoje[];
  /** Datum posledního bodu (data k …). */
  konec: string;
  /** Datum prvního bodu v Kč (kurzy začínají 30. 12. 1999 → dřív v Kč nic není). */
  zacatek: string;
  mesicni: boolean;
}

const DEN = 864e5;
const iso = (d: Date) => d.toISOString().slice(0, 10);

export async function nactiVyvojIndexu(indexCode: string): Promise<VyvojIndexu | null> {
  const def = INDEX_BY_CODE[indexCode];
  if (!def) return null;
  try {
    const [idx, kurzy] = await Promise.all([loadIndexData(indexCode), loadExchangeRates()]);
    if (!kurzy.length) return null;
    // Kurzy se do DB nahrávají jednou týdně → body indexu po posledním kurzu by se přepočetly až týden
    // starým kurzem (ověřeno 18. 10. 2026: SPY 16. 10. kurzem z 9. 10. = 1R o 0,7 p. b. vedle proti ČNB).
    // Pravidlo č. 1: graf končí posledním dnem, pro který kurz opravdu máme.
    const posledniKurz = kurzy[kurzy.length - 1].date.getTime();
    const kc = convertIndexSeriesToCurrency(idx.data.filter((b) => b.date.getTime() <= posledniKurz), def.currency, 'CZK', kurzy)
      .filter((b) => Number.isFinite(b.closePrice) && b.closePrice > 0);
    if (kc.length < 24) return null;
    const posl = kc[kc.length - 1];
    // Zastaralá řada = žádný graf (denní: 10 dní, měsíční: 45 dní).
    const stari = (Date.now() - posl.date.getTime()) / DEN;
    if (stari > (def.monthly ? 45 : 10)) return null;

    // Podvzorkování: posledních ~13 měsíců denně (1R začíná přesně o rok dřív), do ~6 let po týdnech
    // (poslední obchodní den týdne), dřív po měsících.
    const hraniceDny = posl.date.getTime() - 400 * DEN;
    const hranice = posl.date.getTime() - 6.2 * 365.25 * DEN;
    const tyden = (d: Date) => Math.floor((d.getTime() / DEN + 3) / 7); // týdny od čtvrtka 1. 1. 1970 → po–ne
    const klic = (d: Date) => (d.getTime() >= hraniceDny ? `d${iso(d)}` : d.getTime() >= hranice ? `t${tyden(d)}` : `m${d.toISOString().slice(0, 7)}`);
    // Přesné začátky období 1–5 let (stejný kalendářní den, poslední obchodní den nejpozději v něj) –
    // jinak by 3R/5R začínaly na týdenním bodu o pár dní dřív a výnos by se lišil (ověřeno: 3R o 2 p. b.).
    const vyrocni = new Set<number>();
    for (let n = 1; n <= 5; n++) {
      const cil = Date.UTC(posl.date.getUTCFullYear() - n, posl.date.getUTCMonth(), posl.date.getUTCDate());
      let j = -1;
      for (let i = 0; i < kc.length && kc[i].date.getTime() <= cil; i++) j = i;
      if (j >= 0) vyrocni.add(j);
    }
    const body: BodVyvoje[] = [];
    for (let i = 0; i < kc.length; i++) {
      const b = kc[i];
      const dalsi = kc[i + 1];
      // Poslední bod každého týdne/měsíce, výroční body a vždy úplně poslední bod.
      if (!dalsi || klic(dalsi.date) !== klic(b.date) || vyrocni.has(i)) body.push([iso(b.date), Math.round(b.closePrice * 100) / 100]);
    }
    // „Měsíční“ podle skutečných dat na konci řady (EUR dluhopisy mají starou historii měsíční, novou denní).
    const konecRady = kc.slice(-10);
    const mesicni = (konecRady[konecRady.length - 1].date.getTime() - konecRady[0].date.getTime()) / DEN > 120;
    return { body, konec: iso(posl.date), zacatek: iso(kc[0].date), mesicni };
  } catch (e) {
    console.error('[detail fondu] vývoj indexu se nenačetl:', e);
    return null;
  }
}
