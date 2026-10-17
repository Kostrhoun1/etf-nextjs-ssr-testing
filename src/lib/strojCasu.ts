/**
 * KORUNOVÝ STROJ ČASU – data (Vlna 6, 17. 10. 2026).
 *
 * Otázka návštěvníka: „Kdybych od roku X posílal Y Kč měsíčně do Z, kolik bych měl dnes?"
 *
 * Jak: pro každý preset jednou spočítáme měsíční řadu hodnoty portfolia v Kč (NAV, 1 Kč na
 * začátku, roční vyvažování, BEZ vkladů) STEJNÝM enginem jako backtest (runBacktest →
 * marketNav). Prohlížeč pak pro libovolný začátek a částku jen násobí:
 *   jednorázově:  hodnota = vklad × NAV[konec] / NAV[začátek]
 *   měsíčně:      hodnota = Σ_m  vklad × NAV[konec] / NAV[m]   (vklad na začátku měsíce m)
 * Žádné volání API při zobrazení, data jsou desítky kB a cachují se s ISR stránkou.
 *
 * Zjednodušení proti backtestu: měsíční vklad „sleduje" NAV portfolia (jako by se přidal
 * v aktuálním poměru složek), backtest ho rozdělí v cílovém poměru. Rozdíl je malý a je
 * změřený v ověření (scripts/overeni-stroj-casu.mjs, PLAN-OPRAV-2026-10.md – Vlna 6).
 *
 * PRAVIDLO Č. 1: čísla z tohoto modulu se ukazují veřejně (homepage, sdílené karty) – každá
 * změna presetů/metody = znovu nezávislé ověření.
 */
import { runBacktest } from '@/lib/backtest/engine';
import { STROJ_PRESETY, type StrojRada } from '@/lib/strojCasuVypocet';

export * from '@/lib/strojCasuVypocet';

/** Měsíční řady pro všechny presety. Chyba u jednoho presetu ho vynechá (nikdy neukázat půlku dat). */
export async function nactiStrojCasu(): Promise<StrojRada[]> {
  const konec = new Date();
  const vysledek: StrojRada[] = [];
  for (const p of STROJ_PRESETY) {
    try {
      // Start = poslední obchodní den měsíce PŘED `od` → NAV[0] = konec prvního měsíce.
      const [y, m] = p.od.split('-').map(Number);
      const start = new Date(Date.UTC(y, m - 1, 1) - 7 * 864e5); // týden před začátkem měsíce `od`
      const r = await runBacktest({
        portfolio: p.slozeni.map((s) => ({ isin: s.indexCode, name: s.indexCode, weight: s.weight, ter: 0, indexCode: s.indexCode })),
        startDate: start,
        endDate: konec,
        initialAmount: 1,
        rebalancingStrategy: 'yearly',
        currency: 'CZK',
      });
      const nav = r.marketNav ?? [];
      if (nav.length < 24) continue;
      // Poslední bod každého měsíce; normalizace na hodnotu na konci měsíce před `od`.
      const mesicne = new Map<string, number>();
      for (const b of nav) mesicne.set(b.date.toISOString().slice(0, 7), b.value);
      const klice = [...mesicne.keys()].sort();
      const iOd = klice.indexOf(p.od);
      if (iOd < 1) continue; // chybí měsíc před začátkem – nelze poctivě normalizovat
      const zaklad = mesicne.get(klice[iOd - 1])!;
      vysledek.push({
        id: p.id,
        od: p.od,
        nav: klice.slice(iOd).map((k) => Math.round((mesicne.get(k)! / zaklad) * 1e6) / 1e6),
        posledniDen: nav[nav.length - 1].date.toISOString().slice(0, 10),
      });
    } catch (e) {
      console.error(`[stroj-casu] preset ${p.id} selhal:`, e);
    }
  }
  return vysledek;
}

