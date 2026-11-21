/**
 * Úsporný přenos řádků srovnávače (/api/etf/screener) – 21. 11. 2026, návrat na free tier Vercelu.
 *
 * Proč: odpověď API byla pole ~5 200 objektů s 36 klíči = 3,7 MB, z toho asi 60 % jen opakované názvy klíčů
 * (`"current_dividend_yield_numeric":null` u 72 % fondů). Vercel počítá čtení ISR cache po 8 kB nezabalené velikosti:
 * 458 jednotek na jedno čtení, 79 000 jednotek / 30 dní (8 % limitu 1 mil.). Sloupcově = klíče jednou + pole hodnot:
 * ~1,5 MB, ~190 jednotek. Data i jejich typy jsou STEJNÁ (kontrola: scripts/screenerFormat.test.mjs – zabal → rozbal
 * dává totéž do posledního klíče), mění se jen zápis.
 *
 * Tvar: { v: 2, k: [klíče], n: počet povinných klíčů, r: [[hodnoty v pořadí k], …] }
 *  - povinné klíče (má je každý řádek; hodnota smí být null) jsou první,
 *  - nepovinné (v některých řádcích chybí – značky `_dv`, `_volX`, `_vynX`, `_dvP`) jsou na konci; chybějící hodnota se
 *    zapíše jako null a null na konci řádku se ořízne. Při rozbalení se nepovinný klíč s null do objektu NEVLOŽÍ
 *    (kód srovnávače rozlišuje „chybí“ a „null“).
 *  - Kdyby nepovinný klíč měl někde skutečné null (nešlo by ho odlišit od „chybí“), `zabalRadky` vrátí původní pole –
 *    `rozbalRadky` umí obojí, takže se nic nerozbije, jen bez úspory. Hlídá test a check-fund-data (blok „srovnávač tvar“).
 *
 * Čistý modul bez závislostí – používá ho API (server), ScreenerUI (prohlížeč) i test.
 */
export type ZabaleneRadky = { v: 2; k: string[]; n: number; r: unknown[][] };

export function zabalRadky<T extends Record<string, unknown>>(rows: T[]): ZabaleneRadky | T[] {
  if (rows.length === 0) return rows;
  const pocet = new Map<string, number>();
  for (const row of rows) for (const k of Object.keys(row)) if (row[k] !== undefined) pocet.set(k, (pocet.get(k) ?? 0) + 1);
  const vse = [...pocet.keys()];
  const povinne = vse.filter((k) => pocet.get(k) === rows.length);
  const nepovinne = vse.filter((k) => pocet.get(k) !== rows.length);
  // Nepovinný klíč se skutečným null by se po rozbalení ztratil → raději původní tvar.
  for (const row of rows) for (const k of nepovinne) if (row[k] === null) return rows;
  const k = [...povinne, ...nepovinne];
  const n = povinne.length;
  const r = rows.map((row) => {
    const radek: unknown[] = k.map((klic) => (row[klic] === undefined ? null : row[klic]));
    let konec = radek.length;
    while (konec > n && radek[konec - 1] === null) konec--;
    return konec === radek.length ? radek : radek.slice(0, konec);
  });
  return { v: 2, k, n, r };
}

/** Přijme nový sloupcový tvar i původní pole objektů; cokoli jiného = null (volající nechá ukázkové řádky). */
export function rozbalRadky<T = Record<string, unknown>>(data: unknown): T[] | null {
  if (Array.isArray(data)) return data as T[];
  const z = data as Partial<ZabaleneRadky> | null;
  if (!z || z.v !== 2 || !Array.isArray(z.k) || !Array.isArray(z.r) || typeof z.n !== 'number') return null;
  const { k, n, r } = z as ZabaleneRadky;
  return r.map((radek) => {
    const o: Record<string, unknown> = {};
    for (let i = 0; i < k.length; i++) {
      const h = i < radek.length ? radek[i] : null;
      if (i >= n && h === null) continue; // nepovinný klíč v řádku chybí
      o[k[i]] = h;
    }
    return o as T;
  });
}
