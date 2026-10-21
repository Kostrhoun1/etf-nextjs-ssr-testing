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
  '/srovnani/vwce-vs-cspx': { publikovano: '2026-07-03', upraveno: '2026-10-20' },
  '/metodika': { publikovano: '2026-10-20', upraveno: '2026-10-20' },
  // Statické průvodce a nástroje (SEO audit 6b, 21. 10. 2026): „Aktualizováno“ = datum úpravy TEXTU odsud, ne den dat
  // fondů (ten se posouval denně a tvrdil čerstvou úpravu, která neproběhla). První/poslední commit souboru stránky.
  '/dane-z-etf': { publikovano: '2026-07-06', upraveno: '2026-10-21' },
  '/jak-zacit': { publikovano: '2026-07-03', upraveno: '2026-10-21' },
  '/jaky-sp500-etf': { publikovano: '2026-07-07', upraveno: '2026-10-21' },
  '/dip': { publikovano: '2026-07-18', upraveno: '2026-10-21' },
  '/fire': { publikovano: '2026-07-05', upraveno: '2026-10-17' },
  '/svetove-etf-indexy': { publikovano: '2026-07-06', upraveno: '2026-10-17' },
  '/akumulacni-vs-distribucni-etf': { publikovano: '2026-07-06', upraveno: '2026-10-17' },
  '/menove-riziko-etf': { publikovano: '2026-07-06', upraveno: '2026-10-17' },
  '/etf-vs-akcie': { publikovano: '2026-07-20', upraveno: '2026-10-18' },
  '/dca-vs-jednorazova': { publikovano: '2026-07-08', upraveno: '2026-10-17' },
  '/investovani-pro-deti': { publikovano: '2026-07-14', upraveno: '2026-10-20' },
  '/kolik-investovat-mesicne': { publikovano: '2026-07-06', upraveno: '2026-10-17' },
  '/pruvodce': { publikovano: '2026-07-03', upraveno: '2026-10-21' },
  '/recenze/*': { publikovano: '2026-07-03', upraveno: '2026-10-19' },
  // Kalkulačky: datum úpravy textu a metodiky (výpočet běží v prohlížeči, data fondů nepoužívá).
  '/fire-kalkulacka': { publikovano: '2026-07-03', upraveno: '2026-10-17' },
  '/nouzova-rezerva': { publikovano: '2026-07-03', upraveno: '2026-10-17' },
  '/hypotecni-kalkulacka': { publikovano: '2026-07-03', upraveno: '2026-10-17' },
  '/uverova-kalkulacka': { publikovano: '2026-07-03', upraveno: '2026-10-17' },
  '/kalkulacka': { publikovano: '2026-07-03', upraveno: '2026-10-18' },
  '/kurzovy-dopad': { publikovano: '2026-07-03', upraveno: '2026-10-17' },
  '/monte-carlo': { publikovano: '2026-07-03', upraveno: '2026-10-17' },
};

/** Stránky, které MUSÍ mít Article s datem úpravy textu (hlídá check-fund-data.mjs, blok kolo6b seo obsah). */
export const STATICKE_CLANKY = [
  '/dane-z-etf', '/jak-zacit', '/jaky-sp500-etf', '/dip', '/fire', '/svetove-etf-indexy', '/akumulacni-vs-distribucni-etf',
  '/menove-riziko-etf', '/etf-vs-akcie', '/dca-vs-jednorazova', '/investovani-pro-deti', '/kolik-investovat-mesicne', '/pruvodce',
];

export function dataClanku(cesta: string) {
  return DATA_CLANKU[cesta]
    ?? (cesta.startsWith('/portfolio-strategie/') ? DATA_CLANKU['/portfolio-strategie/*'] : null)
    ?? (cesta.startsWith('/recenze/') ? DATA_CLANKU['/recenze/*'] : null);
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

/** JSON-LD Article pro redakční stránku. `denDat` = den, ke kterému platí čísla (u stránek počítaných z dat).
 *  `obrazek` = OG obrázek stránky (relativní /api/og?… nebo absolutní, viz `ogObrazek`); výchozí = og:image z layoutu. */
export function clanekSchema(o: { cesta: string; nadpis: string; popis?: string; denDat?: string | Date | null; obrazek?: string }) {
  const d = dataClanku(o.cesta);
  const obr = o.obrazek ?? '/og-cover.jpg'; // výchozí og:image z layoutu
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
    image: { '@type': 'ImageObject', url: obr.startsWith('http') ? obr : `${BASE}${obr}`, width: 1200, height: 630 },
    ...(d ? { datePublished: d.publikovano, dateModified: datumUpravy(o.cesta, o.denDat) } : {}),
  };
}

/** URL prvního og:image z metadat stránky (stejný obrázek jako při sdílení); bez vlastního = výchozí z layoutu. */
export function ogObrazek(meta: { openGraph?: { images?: unknown } | null }): string {
  const im = meta.openGraph?.images;
  const prvni = Array.isArray(im) ? im[0] : im;
  if (typeof prvni === 'string') return prvni;
  if (prvni && typeof prvni === 'object' && 'url' in prvni) return String((prvni as { url: unknown }).url);
  return '/og-cover.jpg';
}

/** JSON-LD BreadcrumbList: Domů → (mezikroky) → stránka. `kroky` = [název, cesta]. */
export function drobeckySchema(kroky: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [['Domů', '/'] as [string, string], ...kroky].map(([name, cesta], i) => ({
      '@type': 'ListItem', position: i + 1, name, item: `${BASE}${cesta === '/' ? '/' : cesta}`,
    })),
  };
}

/** „17. října 2026“ – datum úpravy TEXTU stránky (z DATA_CLANKU), pro řádek „Aktualizováno …“. Nikdy den dat fondů. */
export function upravenoDlouze(cesta: string): string {
  const iso = datumUpravy(cesta);
  if (!iso) throw new Error(`Stránka ${cesta} nemá datum úpravy v DATA_CLANKU (src/lib/redakce.ts)`);
  const [y, m, dd] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, dd, 12)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** „17. 10. 2026“ z ISO dne. */
export const denCesky = (iso: string) => {
  const [y, m, dd] = iso.slice(0, 10).split('-').map(Number);
  return `${dd}. ${m}. ${y}`;
};
