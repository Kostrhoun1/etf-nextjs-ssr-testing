/**
 * Rozcestník žebříčků (/zebricky) – živá čísla ke každému žebříčku.
 *
 * Revize 18. 10. 2026: dřív rozcestník počítal fondy vlastním JS zrcadlem SQL filtru (odpovidaKategorii)
 * – dvě pravdy, které se mohly rozejít. Teď jde každé číslo přes `filtrKategorie` v src/lib/etf-data.ts
 * (getCategorySouhrn) = stejný filtr jako žebříček i srovnávač. Cena: 2 malé dotazy na žebříček
 * (~100 dotazů jednou denně při ISR renderu), pouštěné po dávkách, ať nezahltíme DB.
 */
import { categoryConfigs, getCategorySouhrn, type SouhrnKategorie } from '@/lib/etf-data';

export type SouhrnZebricku = SouhrnKategorie;

const DAVKA = 8;

/** Souhrny všech žebříčků (slug → souhrn; null = dotaz selhal → na stránce „—“, nikdy vymyšlené číslo). */
export async function nactiSouhrnyZebricku(slugs: string[] = Object.keys(categoryConfigs)): Promise<Map<string, SouhrnZebricku | null>> {
  const out = new Map<string, SouhrnZebricku | null>();
  for (let i = 0; i < slugs.length; i += DAVKA) {
    const cast = slugs.slice(i, i + DAVKA);
    const vysledky = await Promise.all(cast.map((s) => (categoryConfigs[s] ? getCategorySouhrn(categoryConfigs[s]) : Promise.resolve(null))));
    cast.forEach((s, j) => out.set(s, vysledky[j]));
  }
  return out;
}
