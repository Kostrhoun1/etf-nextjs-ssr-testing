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
 * Zjednodušení proti backtestu: měsíční vklad „sleduje“ NAV portfolia (jako by se přidal
 * v aktuálním poměru složek), backtest ho rozdělí v cílovém poměru. Rozdíl je malý a je
 * změřený v ověření (scripts/overeni-stroj-casu.mjs, PLAN-OPRAV-2026-10.md – Vlna 6).
 *
 * PRAVIDLO Č. 1: čísla z tohoto modulu se ukazují veřejně (homepage, sdílené karty) – každá
 * změna presetů/metody = znovu nezávislé ověření.
 */
import { cache } from 'react';
import { runBacktest } from '@/lib/backtest/engine';
import { STROJ_PRESETY, type StrojRada } from '@/lib/strojCasuVypocet';

export * from '@/lib/strojCasuVypocet';

/** Hodnota na konci každého měsíce (YYYY-MM → hodnota) z backtestu daného složení. */
async function mesicniNav(slozeni: { indexCode: string; weight: number }[], start: Date, konec: Date) {
  const r = await runBacktest({
    portfolio: slozeni.map((s) => ({ isin: s.indexCode, name: s.indexCode, weight: s.weight, ter: 0, indexCode: s.indexCode })),
    startDate: start,
    endDate: konec,
    initialAmount: 1,
    rebalancingStrategy: 'yearly',
    currency: 'CZK',
  });
  const nav = r.marketNav ?? [];
  const mesicne = new Map<string, number>();
  for (const b of nav) mesicne.set(b.date.toISOString().slice(0, 7), b.value);
  return { mesicne, posledniDen: nav.length ? nav[nav.length - 1].date.toISOString().slice(0, 10) : '' };
}

/**
 * Měsíční řady pro všechny presety. Chyba u jednoho presetu ho vynechá (nikdy neukázat půlku dat).
 * `cache` = v rámci jednoho renderu (generateMetadata + stránka) se počítá jen jednou.
 */
export function nactiStrojCasu(jen?: string[]): Promise<StrojRada[]> {
  return nactiPodleKlice(jen ? [...jen].sort().join(',') : '*');
}

const nactiPodleKlice = cache(async (klic: string): Promise<StrojRada[]> => {
  const jen = klic === '*' ? undefined : klic.split(',');
  const konec = new Date();
  const vysledek: StrojRada[] = [];
  for (const p of STROJ_PRESETY.filter((x) => !jen || jen.includes(x.id))) {
    try {
      // Start = týden před začátkem měsíce `od` → máme konec měsíce PŘED `od` (normalizace na 1).
      const [y, m] = p.od.split('-').map(Number);
      const zaklad = await mesicniNav(p.slozeni, new Date(Date.UTC(y, m - 1, 1) - 7 * 864e5), konec);
      let mesicne = zaklad.mesicne;
      let posledniDen = zaklad.posledniDen;
      if (p.pozdeji) {
        // Napojení: od `pozdeji.od` řetězíme měsíční výnosy nového složení na hodnotu předchozího měsíce.
        const nove = await mesicniNav(p.pozdeji.slozeni, new Date(`${p.pozdeji.start}T00:00:00Z`), konec);
        const kl = [...nove.mesicne.keys()].sort();
        const iNap = kl.indexOf(p.pozdeji.od);
        const predNap = kl[iNap - 1];
        const hodnotaPred = predNap ? zaklad.mesicne.get(predNap) : undefined;
        if (iNap < 1 || hodnotaPred === undefined) throw new Error(`napojení ${p.id}: chybí ${p.pozdeji.od} nebo měsíc před ním`);
        const spojene = new Map<string, number>();
        for (const [k, v] of zaklad.mesicne) if (k < p.pozdeji.od) spojene.set(k, v);
        let h = hodnotaPred;
        for (let i = iNap; i < kl.length; i++) {
          h *= nove.mesicne.get(kl[i])! / nove.mesicne.get(kl[i - 1])!;
          spojene.set(kl[i], h);
        }
        mesicne = spojene;
        // Od napojení jsou všechny hodnoty z nové řady → datum dat je její poslední den.
        posledniDen = nove.posledniDen;
      }
      const klice = [...mesicne.keys()].sort();
      if (klice.length < 24) continue;
      // Řada musí být souvislá – díra v měsících by tiše posunula všechna data.
      for (let i = 1; i < klice.length; i++) {
        const [a, b] = [klice[i - 1], klice[i]].map((k) => { const [yy, mm] = k.split('-').map(Number); return yy * 12 + mm; });
        if (b - a !== 1) throw new Error(`řada ${p.id} má díru mezi ${klice[i - 1]} a ${klice[i]}`);
      }
      const iOd = klice.indexOf(p.od);
      if (iOd < 1) continue; // chybí měsíc před začátkem – nelze poctivě normalizovat
      const z = mesicne.get(klice[iOd - 1])!;
      vysledek.push({
        id: p.id,
        od: p.od,
        nav: klice.slice(iOd).map((k) => Math.round((mesicne.get(k)! / z) * 1e6) / 1e6),
        posledniDen,
      });
    } catch (e) {
      console.error(`[stroj-casu] preset ${p.id} selhal:`, e);
    }
  }
  return vysledek;
});
