import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/lib/supabase-config';
import { cerstveOd } from '@/lib/etf-data';
import { detectHedging } from '@/utils/hedgingDetection';
import { zobrazovanyTicker, SLOUPCE_TICKERU } from '@/lib/ticker';
import { datumCen } from '@/lib/datumCen';

/*
 * Rozložení poplatků (TER) pro /infografiky (kolo 7, 22. 10. 2026).
 * Dřív panel „Nejlevnější ETF podle TER“ ukazoval 5 z 13 fondů s TER 0,03 % se stejně dlouhými pruhy – výběr pěti
 * byl náhodný (pořadí podle velikosti) a pruhy nic neříkaly. Teď: kolik fondů je v kterém pásmu poplatku a výčet
 * VŠECH fondů s nejnižším TER.
 * Okruh fondů = stejný jako u „Nejlevnějšího fondu“ na webu (porovnejNejlevnejsi, src/lib/trhy.ts): čerstvá data
 * (scraping_date ≤ 14 dní), TER > 0 (TER 0 % je u akcií/dluhopisů chyba zdroje, u zlata náklady mimo TER),
 * velikost ≥ 100 mil. €, bez měnového zajištění, bez pákových produktů a fondů bez názvu.
 * Chyba dotazu → null a stránka panel vynechá (raději nic než část dat – pravidlo č. 1).
 */

const db = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export const PASMA_TER: { do: number; label: string }[] = [
  { do: 0.05, label: 'do 0,05 %' },
  { do: 0.1, label: '0,06–0,10 %' },
  { do: 0.2, label: '0,11–0,20 %' },
  { do: 0.3, label: '0,21–0,30 %' },
  { do: 0.5, label: '0,31–0,50 %' },
  { do: 0.75, label: '0,51–0,75 %' },
  { do: Infinity, label: 'nad 0,75 %' },
];

export interface RozlozeniTer {
  pocet: number;
  pasma: { label: string; pocet: number }[];
  median: number;
  nejnizsi: number;
  /** Všechny fondy s nejnižším TER, od největšího. */
  nejlevnejsi: { isin: string; ticker: string | null; nazev: string; velikost: number }[];
  /** Den stažení dat (nejnovější scraping_date v okruhu, pražský den). */
  den: Date | null;
}

export const nactiRozlozeniTer = cache(async (): Promise<RozlozeniTer | null> => {
  const sloupce = ['isin', 'name', 'ter_numeric', 'fund_size_numeric', 'scraping_date', ...SLOUPCE_TICKERU].join(',');
  type Radek = { isin: string; name: string | null; ter_numeric: number | null; fund_size_numeric: number | null; scraping_date: string | null } & Record<string, unknown>;
  const radky: Radek[] = [];
  try {
    for (let od = 0; od < 10000; od += 1000) {
      const { data, error } = await db.from('etf_funds').select(sloupce)
        .gt('ter_numeric', 0).gte('fund_size_numeric', 100).gte('scraping_date', cerstveOd())
        .not('is_leveraged', 'is', true).not('name', 'is', null).not('name', 'ilike', '%LevDAX%')
        .order('isin').range(od, od + 999);
      if (error) { console.error('nactiRozlozeniTer:', error); return null; }
      radky.push(...((data ?? []) as unknown as Radek[]));
      if (!data || data.length < 1000) break;
    }
  } catch (e) {
    console.error('nactiRozlozeniTer:', e);
    return null;
  }
  // TER se ve zdroji vede na 2 desetinná místa → setiny procenta jako celé číslo (bez chyb plovoucí čárky).
  const fondy = radky
    .filter((r) => r.name && !detectHedging(r.name).isHedged)
    .map((r) => ({ r, setiny: Math.round(Number(r.ter_numeric) * 100) }))
    .filter((x) => x.setiny > 0);
  if (fondy.length < 50) return null; // podezřele málo – raději nic
  const pasma = PASMA_TER.map((p) => ({ label: p.label, pocet: 0 }));
  for (const f of fondy) {
    const i = PASMA_TER.findIndex((p) => f.setiny <= Math.round(p.do * 100));
    pasma[i === -1 ? PASMA_TER.length - 1 : i].pocet++;
  }
  const serazene = fondy.map((f) => f.setiny).sort((a, b) => a - b);
  const stred = Math.floor(serazene.length / 2);
  const median = (serazene.length % 2 ? serazene[stred] : (serazene[stred - 1] + serazene[stred]) / 2) / 100;
  const min = serazene[0];
  const nejlevnejsi = fondy.filter((f) => f.setiny === min)
    .sort((a, b) => Number(b.r.fund_size_numeric) - Number(a.r.fund_size_numeric))
    .map(({ r }) => ({ isin: r.isin, ticker: zobrazovanyTicker(r), nazev: r.name as string, velikost: Number(r.fund_size_numeric) }));
  const posledni = radky.map((r) => r.scraping_date).filter((s): s is string => !!s).sort().at(-1);
  return { pocet: fondy.length, pasma, median, nejnizsi: min / 100, nejlevnejsi, den: posledni ? datumCen(new Date(posledni)) : null };
});
