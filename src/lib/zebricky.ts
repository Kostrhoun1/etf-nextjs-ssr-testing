/**
 * Rozcestník žebříčků (/zebricky) – živá čísla ke každému žebříčku.
 *
 * Revize 18. 10. 2026: dřív rozcestník počítal fondy vlastním JS zrcadlem SQL filtru (odpovidaKategorii)
 * – dvě pravdy, které se mohly rozejít. Teď jde každé číslo přes `filtrKategorie` v src/lib/etf-data.ts
 * (getCategorySouhrn) = stejný filtr jako žebříček i srovnávač. Cena: 2 malé dotazy na žebříček
 * (~100 dotazů jednou denně při ISR renderu), pouštěné po dávkách, ať nezahltíme DB.
 */
import { cache as reactCache } from 'react';
import { categoryConfigs, getCategorySouhrn, type SouhrnKategorie } from '@/lib/etf-data';

export type SouhrnZebricku = SouhrnKategorie;

const DAVKA = 8;

/** Souhrny všech žebříčků (slug → souhrn; null = dotaz selhal → na stránce „—“, nikdy vymyšlené číslo). */
async function nactiSouhrny(slugs: string[] = Object.keys(categoryConfigs)): Promise<Map<string, SouhrnZebricku | null>> {
  const out = new Map<string, SouhrnZebricku | null>();
  for (let i = 0; i < slugs.length; i += DAVKA) {
    const cast = slugs.slice(i, i + DAVKA);
    const vysledky = await Promise.all(cast.map((s) => (categoryConfigs[s] ? getCategorySouhrn(categoryConfigs[s]) : Promise.resolve(null))));
    cast.forEach((s, j) => out.set(s, vysledky[j]));
  }
  return out;
}

/** Souhrny všech žebříčků, JEDNOU za render (React cache): generateMetadata i stránka /zebricky sdílí stejné
 *  dotazy – popisek s čísly nepřidá ~100 dotazů navíc (free tier, kolo 6). */
export const nactiSouhrnyZebricku = reactCache((): Promise<Map<string, SouhrnZebricku | null>> => nactiSouhrny());
