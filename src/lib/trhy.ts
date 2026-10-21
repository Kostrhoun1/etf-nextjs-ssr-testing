import { cache } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { zobrazovanyTicker, SLOUPCE_TICKERU } from '@/lib/ticker';
import { CERSTVOST_DNI } from '@/lib/etf-data';
import { nejcastejsiDatumVynosu, vynosyPozadu } from '@/lib/datumVynosu';
import { TRHY, ODLEHLA_PB, MIN_VELIKOST_VITEZE, MIN_FONDU, type Trh } from '@/data/trhyDvojcata';

/* Výpočet pro homepage sekci „Nejlevnější, největší a nejvýkonnější ETF podle trhu“.
   Jeden dotaz (~130 fondů) při ISR renderu, nic na návštěvníka. Pravidlo č. 1:
   - jen čerstvá data (scraping_date ≤ CERSTVOST_DNI), null hodnoty se vynechají,
   - odlehlá hodnota (> ODLEHLA_PB od mediánu trhu) nevyhraje a nepočítá se do rozpětí,
   - méně než MIN_FONDU platných fondů → řádek bez čísla („—“). */

export interface FondTrhu {
  isin: string;
  nazev: string;
  ticker: string | null;
  /** Emitent (fund_provider) – zobrazí se místo tickeru, když fond ticker nemá. */
  emitent: string | null;
  ter: number | null;
  velikost: number | null;
  r1: number | null;
  scrapingDate: string | null;
  /** Den, ke kterému platí výnosy fondu (returns_as_of, src/lib/datumVynosu.ts). */
  returnsAsOf?: string | null;
  /** Akumulační třída – při shodě TER má přednost (začátečníkům radíme akumulační). */
  acc: boolean;
}

export interface RadekTrhu {
  trh: Pick<Trh, 'id' | 'label' | 'index' | 'href'>;
  pocet: number;
  nejlevnejsi: FondTrhu | null;
  stejnyTer: number; // kolik dalších fondů má stejné TER jako vítěz
  nejvetsi: FondTrhu | null;
  /** Medián výnosu 12 měs. v Kč přes platné fondy trhu (bez odlehlých). */
  median: number | null;
  min: number | null;
  max: number | null;
  nejvykonnejsi: FondTrhu | null;
  odlehle: FondTrhu[];
  /** Fondy s výnosy o víc než 3 pracovní dny staršími než většina (zpožděná řada u zdroje) – mimo medián
   *  a „nejvýkonnější“ (srovnávala by se různá období); jejich výnos platí k jejich vlastnímu dni. */
  pozadu: FondTrhu[];
  nejstarsi: string | null;
}

/**
 * PRAVIDLO „NEJLEVNĚJŠÍ FOND“ – jedno pro homepage i žebříčky (revize kola 4, 18. 10. 2026).
 * Dřív homepage u S&P 500 ukazovala SPYL (Acc) a žebříček SPY5 (Dist) – oba TER 0,03 %.
 *   1. kandidáti: čerstvá data (scraping_date ≤ CERSTVOST_DNI), TER > 0 (TER 0 = chyba zdroje),
 *      velikost ≥ MIN_VELIKOST_VITEZE (100 mil. €),
 *   2. nejnižší TER,
 *   3. při shodě TER akumulační třída (distribution_policy obsahuje „accum“) před distribuční,
 *   4. při shodě i v tom větší fond (fund_size_numeric).
 * Žebříčky mají převzít `porovnejNejlevnejsi` + `jeAkumulacni` (stejné pořadí kritérií).
 */
export const jeAkumulacni = (distributionPolicy: unknown) => /accum/i.test(String(distributionPolicy ?? ''));
export function porovnejNejlevnejsi(
  a: { ter: number | null; acc: boolean; velikost: number | null },
  b: { ter: number | null; acc: boolean; velikost: number | null },
) {
  return (a.ter ?? Infinity) - (b.ter ?? Infinity) || Number(b.acc) - Number(a.acc) || (b.velikost ?? 0) - (a.velikost ?? 0);
}

const kratky = (n: string) => n.replace(/\s+UCITS\b.*$/i, '').replace(/\s+\(.*?\)\s*$/, '').trim();
export const median = (xs: number[]) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Čistý výpočet nad načtenými fondy (exportovaný kvůli testu odlehlé hodnoty). */
export function spocitejTrh(trh: Trh, fondy: FondTrhu[], ted = Date.now()): RadekTrhu {
  const cerstve = fondy.filter((f) => f.scrapingDate && ted - new Date(f.scrapingDate).getTime() < CERSTVOST_DNI * 864e5);
  const vetsina = nejcastejsiDatumVynosu(cerstve.map((f) => ({ returns_as_of: f.returnsAsOf, scraping_date: f.scrapingDate })));
  const pozadu = cerstve.filter((f) => f.r1 != null && vynosyPozadu({ returns_as_of: f.returnsAsOf, scraping_date: f.scrapingDate }, vetsina));
  const sVynosem = cerstve.filter((f) => f.r1 != null && !pozadu.includes(f));
  const med0 = median(sVynosem.map((f) => f.r1!));
  const odlehle = med0 == null ? [] : sVynosem.filter((f) => Math.abs(f.r1! - med0) > ODLEHLA_PB);
  const platneVynosy = sVynosem.filter((f) => !odlehle.includes(f));
  const velke = (xs: FondTrhu[]) => xs.filter((f) => (f.velikost ?? 0) >= MIN_VELIKOST_VITEZE);

  const sTer = velke(cerstve.filter((f) => f.ter != null && f.ter > 0))
    .sort(porovnejNejlevnejsi);
  const nejlevnejsi = sTer[0] ?? null;
  const stejnyTer = nejlevnejsi ? sTer.filter((f) => f !== nejlevnejsi && f.ter === nejlevnejsi.ter).length : 0;
  const nejvetsi = [...cerstve].filter((f) => f.velikost != null).sort((a, b) => b.velikost! - a.velikost!)[0] ?? null;
  const dost = platneVynosy.length >= MIN_FONDU;
  const vyn = platneVynosy.map((f) => f.r1!);
  const nejvykonnejsi = dost ? velke(platneVynosy).sort((a, b) => b.r1! - a.r1!)[0] ?? null : null;
  const nejstarsi = cerstve.map((f) => f.scrapingDate!).sort()[0] ?? null;

  return {
    trh: { id: trh.id, label: trh.label, index: trh.index, href: trh.href },
    pocet: cerstve.length,
    nejlevnejsi: cerstve.length >= MIN_FONDU ? nejlevnejsi : null,
    stejnyTer,
    nejvetsi: cerstve.length >= MIN_FONDU ? nejvetsi : null,
    median: dost ? median(vyn) : null,
    min: dost ? Math.min(...vyn) : null,
    max: dost ? Math.max(...vyn) : null,
    nejvykonnejsi,
    odlehle,
    pozadu,
    nejstarsi,
  };
}

export const nactiTrhy = cache(async (): Promise<RadekTrhu[] | null> => {
  const isiny = TRHY.flatMap((t) => t.isins);
  const { data, error } = await supabaseAdmin
    .from('etf_funds')
    .select(`isin, name, fund_provider, ter_numeric, fund_size_numeric, return_1y_czk, scraping_date, returns_as_of, distribution_policy, ${SLOUPCE_TICKERU.join(', ')}`)
    .in('isin', isiny);
  if (error || !data) return null; // raději sekci neukázat než ukázat nesmysl
  const podleIsin = new Map<string, FondTrhu>(
    (data as unknown as Record<string, unknown>[]).map((r) => [String(r.isin), {
      isin: String(r.isin),
      nazev: kratky(String(r.name ?? r.isin)),
      ticker: zobrazovanyTicker(r), // jeden ticker webu (src/lib/ticker.ts)
      emitent: r.fund_provider == null ? null : String(r.fund_provider),
      ter: r.ter_numeric == null ? null : Number(r.ter_numeric),
      velikost: r.fund_size_numeric == null ? null : Number(r.fund_size_numeric),
      r1: r.return_1y_czk == null ? null : Number(r.return_1y_czk),
      scrapingDate: r.scraping_date == null ? null : String(r.scraping_date),
      returnsAsOf: r.returns_as_of == null ? null : String(r.returns_as_of),
      acc: jeAkumulacni(r.distribution_policy),
    }]),
  );
  return TRHY.map((t) => spocitejTrh(t, t.isins.map((i) => podleIsin.get(i)).filter((f): f is FondTrhu => Boolean(f))));
});
