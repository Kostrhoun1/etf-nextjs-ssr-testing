import { datumCen } from '@/lib/datumCen';

/**
 * K JAKÉMU DNI PLATÍ VÝNOSY FONDU (pravidlo č. 1: každé číslo má datum) – 21. 10. 2026.
 *
 * Scraper (etf-astro scraper/vynosy_z_rady.py) počítá výnosy za období z denní řady zdroje ke dni
 * `returns_as_of` = poslední JISTĚ KONEČNÝ obchodní den TOHOTO fondu. Zdroj totiž poslední den vede nejdřív
 * předběžně a přepíše ho až další den; a některé fondy mají řadu o dny pozadu (ESEA, PSP5, S5USAS, WSPX
 * 16. 10., když většina měla 19. 10.). Dřív web značil všechny fondy jedním globálním datem ze scraping_date.
 *
 * Řádky stažené před nasazením scraperu returns_as_of nemají → den cen podle času stažení (datumCen),
 * tj. dosavadní chování. U řádků z nového scraperu je returns_as_of null jen tehdy, když jsou null i výnosy.
 */
export type SDatemVynosu = { returns_as_of?: string | null; scraping_date?: string | null; updated_at?: string | null };

/** Max. zpoždění výnosů fondu za většinou (pracovní dny), aby šel do mediánů a karet „nejvýkonnější“. */
export const MAX_ZPOZDENI_PRAC_DNI = 3;

const poledne = (iso: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12));
  return Number.isNaN(d.getTime()) ? null : d;
};

/** Den, ke kterému platí výnosy fondu (Date v 12:00 UTC, stejně jako datumCen), nebo null. */
export function datumVynosu(r: SDatemVynosu | null | undefined): Date | null {
  if (!r) return null;
  if (r.returns_as_of) {
    const d = poledne(String(r.returns_as_of));
    if (d) return d;
  }
  const iso = r.scraping_date ?? r.updated_at;
  const s = iso ? new Date(String(iso)) : null;
  return s && !Number.isNaN(s.getTime()) ? datumCen(s) : null;
}

/** YYYY-MM-DD dne výnosů, nebo null. */
export function datumVynosuIso(r: SDatemVynosu | null | undefined): string | null {
  return datumVynosu(r)?.toISOString().slice(0, 10) ?? null;
}

/** Počet pracovních dnů (po–pá) v intervalu (starsi, novejsi]; 0, když starsi ≥ novejsi. Svátky neznáme. */
export function pracovnichDniMezi(starsi: Date, novejsi: Date): number {
  let n = 0;
  const d = new Date(Date.UTC(starsi.getUTCFullYear(), starsi.getUTCMonth(), starsi.getUTCDate(), 12));
  const k = Date.UTC(novejsi.getUTCFullYear(), novejsi.getUTCMonth(), novejsi.getUTCDate(), 12);
  while (d.getTime() < k && n < 400) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) n++;
  }
  return n;
}

/** Nejčastější den výnosů v seznamu (při shodě novější) – „Data k …“ celé stránky. null = žádný. */
export function nejcastejsiDatumVynosu(radky: SDatemVynosu[]): Date | null {
  const pocty = new Map<string, number>();
  for (const r of radky) {
    const iso = datumVynosuIso(r);
    if (iso) pocty.set(iso, (pocty.get(iso) ?? 0) + 1);
  }
  let best: string | null = null;
  for (const [iso, c] of pocty) if (best == null || c > pocty.get(best)! || (c === pocty.get(best)! && iso > best)) best = iso;
  return best ? poledne(best) : null;
}

/** Výnosy fondu jsou o víc než MAX_ZPOZDENI_PRAC_DNI pracovních dnů starší než u většiny (`vetsina`)
 *  → nepatří do mediánů ani karet výnosu (srovnávaly by se různá období); u fondu se ukáže jeho datum. */
export function vynosyPozadu(r: SDatemVynosu | null | undefined, vetsina: Date | null | undefined): boolean {
  const d = datumVynosu(r);
  if (!d || !vetsina) return false;
  return pracovnichDniMezi(d, vetsina) > MAX_ZPOZDENI_PRAC_DNI;
}

/** Datum výnosů fondu jako text, ale jen když se liší od dne celé stránky (jinak null – nic navíc neukazovat). */
export function jineDatumVynosu(r: SDatemVynosu | null | undefined, stranka: Date | null | undefined): string | null {
  const d = datumVynosu(r);
  if (!d || !stranka || d.toISOString().slice(0, 10) === stranka.toISOString().slice(0, 10)) return null;
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
