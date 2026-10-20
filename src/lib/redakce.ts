/**
 * Redakční stránky: datum zveřejnění/úpravy a strukturovaná data Article (SEO audit 20. 10. 2026, E-E-A-T).
 *
 * DATA JSOU SKUTEČNÁ, NE „DNES“: `publikovano` = první commit souboru stránky (git log --follow), `upraveno` =
 * poslední věcná změna obsahu (git log). Stránky počítané denně z dat (stroj času, S&P vs svět…) mají jako
 * datum úpravy navíc den dat, ke kterému čísla platí – vezme se pozdější z obou (`datumUpravy`).
 * Při věcné úpravě textu stránky posuňte `upraveno` (kontrola v check-fund-data.mjs, blok kolo6 seo, hlídá jen
 * formát, pořadí a že datum není v budoucnosti – git historie v CI není).
 */
export const BASE = 'https://etfpruvodce.cz';
export const AUTOR_ID = `${BASE}/o-nas#tomas-kostrhoun`;
export const ORGANIZACE_ID = `${BASE}/#organization`;

export const DATA_CLANKU: Record<string, { publikovano: string; upraveno: string }> = {
  '/kolik-vydelaly-etf': { publikovano: '2026-07-10', upraveno: '2026-10-17' },
  '/stroj-casu': { publikovano: '2026-10-17', upraveno: '2026-10-17' },
  '/sp500-nebo-cely-svet': { publikovano: '2026-10-17', upraveno: '2026-10-19' },
  '/jak-dlouho-v-minusu': { publikovano: '2026-10-17', upraveno: '2026-10-17' },
  '/pravidlo-4-procent': { publikovano: '2026-10-17', upraveno: '2026-10-17' },
  '/co-rikaji-data': { publikovano: '2026-10-17', upraveno: '2026-10-17' },
  '/faktorove-etf': { publikovano: '2026-07-13', upraveno: '2026-10-17' },
  // Detaily faktorů sdílí šablonu FactorDetail (poslední úprava výpočtů 17. 10. 2026).
  '/faktorove-etf/value': { publikovano: '2026-07-13', upraveno: '2026-10-17' },
  '/faktorove-etf/small-cap': { publikovano: '2026-07-13', upraveno: '2026-10-17' },
  '/faktorove-etf/dividendove-akcie': { publikovano: '2026-07-13', upraveno: '2026-10-17' },
  '/faktorove-etf/minimalni-volatilita': { publikovano: '2026-07-13', upraveno: '2026-10-17' },
  '/faktorove-etf/momentum': { publikovano: '2026-07-13', upraveno: '2026-10-17' },
  '/faktorove-etf/quality': { publikovano: '2026-07-13', upraveno: '2026-10-17' },
  // Modelová portfolia: šablona portfolio-strategie/[slug] (první verze 3. 7. 2026, poslední úprava 19. 10. 2026).
  '/portfolio-strategie': { publikovano: '2025-10-01', upraveno: '2026-10-19' },
  '/portfolio-strategie/*': { publikovano: '2026-07-03', upraveno: '2026-10-19' },
  '/kde-koupit': { publikovano: '2026-07-03', upraveno: '2026-10-19' },
  '/metodika': { publikovano: '2026-10-20', upraveno: '2026-10-20' },
};

export function dataClanku(cesta: string) {
  return DATA_CLANKU[cesta] ?? (cesta.startsWith('/portfolio-strategie/') ? DATA_CLANKU['/portfolio-strategie/*'] : null);
}

/** Pozdější ze dvou dnů (ISO „YYYY-MM-DD“ nebo Date) jako ISO den. Den dat nesmí datum úpravy posunout dozadu. */
export function datumUpravy(cesta: string, denDat?: string | Date | null): string {
  const d = dataClanku(cesta);
  const git = d?.upraveno ?? '';
  const data = denDat ? (typeof denDat === 'string' ? denDat.slice(0, 10) : denDat.toISOString().slice(0, 10)) : '';
  return data > git ? data : git;
}

export const autorSchema = { '@type': 'Person', '@id': AUTOR_ID, name: 'Tomáš Kostrhoun', url: `${BASE}/o-nas` };
export const vydavatelSchema = {
  '@type': 'Organization', '@id': ORGANIZACE_ID, name: 'ETF průvodce.cz', url: BASE,
  logo: { '@type': 'ImageObject', url: `${BASE}/logo.png` },
};

/** JSON-LD Article pro redakční stránku. `denDat` = den, ke kterému platí čísla (u stránek počítaných z dat). */
export function clanekSchema(o: { cesta: string; nadpis: string; popis?: string; denDat?: string | Date | null }) {
  const d = dataClanku(o.cesta);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: o.nadpis.slice(0, 110),
    ...(o.popis ? { description: o.popis } : {}),
    url: `${BASE}${o.cesta}`,
    mainEntityOfPage: `${BASE}${o.cesta}`,
    inLanguage: 'cs-CZ',
    author: autorSchema,
    publisher: vydavatelSchema,
    ...(d ? { datePublished: d.publikovano, dateModified: datumUpravy(o.cesta, o.denDat) } : {}),
  };
}

/** „17. 10. 2026“ z ISO dne. */
export const denCesky = (iso: string) => {
  const [y, m, dd] = iso.slice(0, 10).split('-').map(Number);
  return `${dd}. ${m}. ${y}`;
};
