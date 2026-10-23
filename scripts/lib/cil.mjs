/**
 * CÍL KONTROLY: produkce, nebo lokální build? (rozhodnutí majitele 23. 10. 2026, CLAUDE.md)
 *
 * „Naše testy a kontroly NESMÍ procházet produkci hromadně (každý nový detail fondu = ISR zápis): proti produkci jen
 *  pevná malá sada stránek, široké kontroly proti lokálnímu buildu.“
 *
 * PROČ: Vercel free tier = 200 000 ISR zápisů / klouzavých 30 dní (23. 10. 2026 jsme byli na 181 451). Detail fondu
 * /etf/[isin] (revalidate 30 dní) a dvojice /srovnani/[pair] (1 den) se vykreslí a ZAPÍŠOU při první návštěvě po
 * nasazení. Kontrola, která si každý den vybírá jiné fondy z DB (top 50, „fondy bez výnosů“…), tak každý den platí
 * desítky nových zápisů – 23. 10. 2026 check-fund-data sama sáhla na 69 detailů a 26 dvojic. Pevná sada stojí
 * zápis jen první den po nasazení (a pak jednou za revalidate), proměnná sada pořád.
 * Zápis navíc NEstojí: statické routy (i s ?parametry), API, stránky předgenerované při buildu (generateStaticParams),
 * adresy, které vyřídí middleware bez vykreslení (neplatný ISIN → 404, malá písmena / obrácená dvojice → 301).
 * Pozor i na prohlížeč: Next.js v produkci sám PŘEDNAČÍTÁ (prefetch) odkazy viditelné na obrazovce – /srovnani
 * s 50 fondy tak bez jediného kliknutí sáhne na ~11 detailů. hlidejKontext() je v produkčním režimu zablokuje.
 *
 * REŽIMY:
 *   produkční (cíl obsahuje etfpruvodce.cz, nebo NUTIT_PRODUKCNI_REZIM=1 pro test proti lokálu) – dynamické stránky
 *     jen z PROD_DETAILY / PROD_DVOJICE; kontroly, které vybírají fondy z DB, použijí pevného reprezentanta nebo se
 *     přeskočí s hláškou „jen lokálně“. Kontroly samotných dat v DB (bez stahování stránek) běží dál vždy.
 *   lokální (localhost, náhled) – plný rozsah, beze změny.
 *
 * POJISTKY (ať se to nevrátí):
 *   1. Požadavek na dynamickou stránku mimo pevnou sadu se v produkčním režimu NEODEŠLE a běh skončí chybou
 *      „kontrola by zapisovala do ISR“ (nová kontrola musí použít reprezentanta z PROD_DETAILY, nebo R.jenLokalne()).
 *   2. Počítadlo unikátních dynamických cest: nad LIMIT_DYNAMICKYCH skript okamžitě skončí (exit 1).
 *
 * Pevná sada se NESMÍ měnit den ode dne (žádný výběr z DB) – po prvním dni po nasazení už nic nového nezapisuje.
 * Mění se jen úpravou tohoto souboru (nebo kurátorských dvojic v src/lib/pairs.ts) – tedy s nasazením.
 */
import { readFileSync } from 'node:fs';

/** Detaily fondů, které smí kontroly navštívit na produkci. Každý zastupuje typ, na kterém kontroly něco hlídají. */
export const PROD_DETAILY = Object.freeze([
  'IE00B5BMR087', // SXR8/CSPX – S&P 500, akumulační (předgenerovaný při buildu)
  'IE00BK5BQT80', // VWCE – celý svět (předgenerovaný)
  'IE00B4L5Y983', // EUNL/IWDA – MSCI World (předgenerovaný)
  'JE00B78CGV99', // BRNT – ETC na ropu
  'GB00BLD4ZL17', // BITC – bitcoin ETP
  'LU0290358497', // XEON – peněžní trh, Lucembursko
  'IE00BGSF1X88', // IBC1 – dluhopisy (součet sektorů mimo 100 %)
  'IE00B8GKDB10', // VHYL – distribuční
  'DE000A0S9GB0', // 4GLD Xetra-Gold – zlato, TER 0
  'IE00B4ND3602', // SGLN – fyzické zlato ETC (komodita „nevyplácí“)
  'CH1184151731', // HASH – v NEOVERENE_VYNOSY (src/lib/vynosNeovereny.ts, druh skok)
  'FR0011550680', // ESEA – známá zpožděná řada (starší den výnosů než většina)
  'IE00B3YLTY66', // SPYI – MSCI ACWI IMI, ticker sdílený s jiným fondem
  'IE00BKM4GZ66', // EMIM – rozvíjející se trhy IMI (podobné fondy, názvy pozic)
  'IE00B3YCGJ38', // P500 – syntetický (swap), kotva tříd
]);

/** Detaily předgenerované při buildu (src/app/etf/[isin]/page.tsx → generateStaticParams). */
export const PREDGENEROVANE_DETAILY = Object.freeze(['IE00B5BMR087', 'IE00BK5BQT80', 'IE00B4L5Y983']);

/** Dvojice navíc k hlavním kurátorským (pevné, mimo src/lib/pairs.ts). */
const DVOJICE_NAVIC = ['vwce-vs-spyi']; // ticker SPYI má dva fondy – stránka musí vybrat SPDR ACWI IMI
/** Kurátorské aliasy, které kontroly potřebují i na produkci (canonical aliasu na hlavní dvojici). */
const ALIASY_NA_PRODUKCI = ['vwce-vs-eunl'];

/** Strop unikátních dynamických cest za jeden běh (pevná sada má 30; rezerva na drobné rozšíření, ne na výběr z DB). */
export const LIMIT_DYNAMICKYCH = 40;

/** Kontrolní číslice ISIN (stejně jako src/middleware.ts) – neplatný ISIN vyřídí middleware 404 bez vykreslení. */
function isinPlatny(s) {
  if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(s)) return false;
  const cifry = s.split('').map((c) => (c >= 'A' ? String(c.charCodeAt(0) - 55) : c)).join('');
  let sum = 0;
  let dvakrat = false;
  for (let i = cifry.length - 1; i >= 0; i--) {
    let d = cifry.charCodeAt(i) - 48;
    if (dvakrat) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    dvakrat = !dvakrat;
  }
  return sum % 10 === 0;
}

let dvojiceCache = null;
/** Kurátorské dvojice ze src/lib/pairs.ts (jediný zdroj; mění se jen s nasazením). */
export function nactiDvojice() {
  if (dvojiceCache) return dvojiceCache;
  const ts = readFileSync(new URL('../../src/lib/pairs.ts', import.meta.url), 'utf8');
  const blok = (od, do_) => ts.slice(ts.indexOf(od), ts.indexOf(do_, ts.indexOf(od) + 1));
  const popular = [...blok('export const POPULAR_PAIRS', '];').matchAll(/'([a-z0-9]+-vs-[a-z0-9]+)'/g)].map((m) => m[1]);
  const kuratorske = [...blok('export const KURATORSKE:', 'export const KURATORSKE_ALIASY').matchAll(/'([a-z0-9]+-vs-[a-z0-9]+)':/g)].map((m) => m[1]);
  const aliasy = Object.fromEntries([...blok('export const KURATORSKE_ALIASY', 'export const HLAVNI_DVOJICE').matchAll(/'([a-z0-9-]+)': '([a-z0-9-]+)'/g)].map((m) => [m[1], m[2]]));
  if (popular.length < 10 || kuratorske.length < 10) throw new Error(`src/lib/pairs.ts: POPULAR_PAIRS/KURATORSKE nenalezeny (${popular.length}/${kuratorske.length})`);
  // vwce-vs-cspx je statická routa (src/app/srovnani/vwce-vs-cspx) – žádná dynamická stránka.
  const hlavni = kuratorske.filter((s) => !aliasy[s] && s !== 'vwce-vs-cspx');
  dvojiceCache = { popular, kuratorske, aliasy, hlavni };
  return dvojiceCache;
}

/** Statické podstránky /srovnani/*, které vypadají jako dvojice. */
const STATICKE_SROVNANI = new Set(['porovnani', 'vwce-vs-cspx']);

/**
 * Druh cesty z hlediska ISR: 'detail' | 'dvojice' = dynamická stránka, která se na serveru vykreslí (a zapíše),
 * null = statická routa, API, nebo adresa, kterou middleware vyřídí bez vykreslení.
 */
export function druhCesty(cesta) {
  let p = cesta;
  try { p = new URL(cesta, 'http://x').pathname; } catch { /* nech */ }
  let m = p.match(/^\/etf\/([^/]+)\/?$/);
  if (m) {
    let isin = m[1];
    try { isin = decodeURIComponent(isin); } catch { /* nech */ }
    return isinPlatny(isin) ? 'detail' : null; // malá písmena → 301, neplatný → 404 (middleware)
  }
  m = p.match(/^\/srovnani\/([^/]+)\/?$/);
  if (m) {
    const slug = m[1];
    if (STATICKE_SROVNANI.has(slug) || !/^[a-z0-9]{1,12}-vs-[a-z0-9]{1,12}$/.test(slug)) return null; // velká písmena → 301, nesmysl → 404
    const [a, b] = slug.split('-vs-');
    const { kuratorske } = nactiDvojice();
    if (!kuratorske.includes(slug) && kuratorske.includes(`${b}-vs-${a}`)) return null; // obrácená kurátorská → 301 v middleware
    return 'dvojice';
  }
  return null;
}

/** Produkční režim? Regex ze zadání majitele + vynucení pro test proti lokálu. */
export function jeProdukce(cil) {
  return /etfpruvodce\.cz/.test(String(cil)) || process.env.NUTIT_PRODUKCNI_REZIM === '1';
}

/**
 * Režim pro jeden běh skriptu. Použití:
 *   const R = vytvorRezim(WEB_URL, 'check-fund-data'); R.hlidejFetch();
 *   for (const isin of R.detaily(isiny, 'top 50 fondů – jeden ticker')) …
 *   … na konci: R.souhrn() (řádky do výpisu) a R.poruseni (neprázdné = chyba).
 */
export function vytvorRezim(cil, skript = 'kontrola') {
  const base = String(cil).replace(/\/$/, '');
  const host = (() => { try { return new URL(base).host; } catch { return ''; } })();
  const produkce = jeProdukce(base);
  const { hlavni, popular } = nactiDvojice();
  const PROD_DVOJICE = Object.freeze([...new Set([...hlavni, ...ALIASY_NA_PRODUKCI, ...DVOJICE_NAVIC])]);
  const povoleneCesty = new Set([...PROD_DETAILY.map((i) => `/etf/${i}`), ...PROD_DVOJICE.map((s) => `/srovnani/${s}`)]);
  const predgenerovane = new Set([...PREDGENEROVANE_DETAILY.map((i) => `/etf/${i}`), ...popular.map((s) => `/srovnani/${s}`)]);

  const navstivene = new Set();      // unikátní dynamické cesty, na které šel požadavek
  const poruseni = [];               // pokusy o dynamickou stránku mimo pevnou sadu (produkční režim)
  const blokovanePrefetche = new Set();
  const jenLokalneSeznam = [];       // vědomě přeskočené kontroly / části kontrol

  const cestaZ = (u) => { try { const x = new URL(u, base); return x.host === host ? x.pathname.replace(/\/$/, '') || '/' : null; } catch { return null; } };
  const povoleno = (u) => {
    const p = cestaZ(u);
    if (!p || !produkce || !druhCesty(p)) return true;
    return povoleneCesty.has(p);
  };
  const zaznamenej = (p) => {
    if (navstivene.has(p)) return;
    navstivene.add(p);
    // Lokální build smí být široký (to je jeho účel); strop platí jen pro produkční režim.
    if (produkce && navstivene.size > LIMIT_DYNAMICKYCH) {
      console.error(`\n❌ [${skript}] kontrola by zapisovala do ISR: ${navstivene.size} unikátních dynamických stránek (detail fondu / dvojice) za jeden běh, limit ${LIMIT_DYNAMICKYCH} (scripts/lib/cil.mjs).`);
      console.error(`   Cíl ${base}. Poslední: ${[...navstivene].slice(-8).join(', ')}`);
      process.exit(1);
    }
  };
  const odmitni = (p, kde) => {
    poruseni.push(`${p}${kde ? ` (${kde})` : ''}`);
    return new Error(`ISR pojistka: ${p} není v pevné sadě pro produkci (scripts/lib/cil.mjs) – kontrola by zapisovala do ISR`);
  };

  const R = {
    cil: base, produkce, PROD_DETAILY, PROD_DVOJICE, LIMIT: LIMIT_DYNAMICKYCH,
    navstivene, poruseni, blokovanePrefetche, jenLokalneSeznam,
    povoleno,
    /** Zaznamená kontrolu (nebo její část), která na produkci neběží. */
    jenLokalne(popis) { if (produkce) jenLokalneSeznam.push(popis); },
    /** ISINy pro kontrolu detailu: v produkčním režimu jen z PROD_DETAILY (vypadlé se ohlásí „jen lokálně“). */
    detaily(isiny, popis) {
      const vse = [...isiny];
      if (!produkce) return vse;
      const ok = vse.filter((i) => PROD_DETAILY.includes(i));
      if (ok.length < vse.length) jenLokalneSeznam.push(`${popis}: ${ok.length ? `${ok.length} z ${vse.length} detailů (pevná sada)` : 'přeskočeno'}${ok.length < vse.length && vse.length - ok.length <= 4 ? ` – bez ${vse.filter((i) => !ok.includes(i)).join(', ')}` : ''}`);
      return ok;
    },
    /** Totéž pro objekt { TICKER: ISIN }. */
    detailyT(T, popis) {
      const ok = new Set(R.detaily(Object.values(T), popis));
      return Object.fromEntries(Object.entries(T).filter(([, i]) => ok.has(i)));
    },
    /** Cesty (libovolné stránky, např. ze sitemapy): v produkčním režimu bez dynamických mimo pevnou sadu. */
    cesty(cesty, popis) {
      const vse = [...cesty];
      if (!produkce) return vse;
      const ok = vse.filter((c) => povoleno(c));
      if (ok.length < vse.length) jenLokalneSeznam.push(`${popis}: bez ${vse.length - ok.length} dynamických stránek mimo pevnou sadu`);
      return ok;
    },
    /** Obalí globální fetch: počítá dynamické cesty na cíli, v produkčním režimu nepustí nic mimo pevnou sadu. */
    hlidejFetch() {
      const puvodni = globalThis.fetch;
      if (puvodni.__cil) return;
      const obal = async (input, init) => {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input?.url ?? String(input);
        const p = cestaZ(url);
        if (p && druhCesty(p)) {
          if (!povoleno(p)) throw odmitni(p, 'fetch');
          zaznamenej(p);
        }
        return puvodni(input, init);
      };
      obal.__cil = true;
      globalThis.fetch = obal;
    },
    /**
     * Playwright: hlídá každý kontext (volat hned po newContext, vedle blokace měření).
     * Produkční režim: prefetch dynamické stránky mimo sadu se tiše zablokuje (Next.js ho sám spouští u viditelných
     * odkazů); navigace na ni se zablokuje a je to porušení (chyba běhu).
     */
    async hlidejKontext(ctx) {
      await ctx.route((u) => { const p = cestaZ(u.href); return !!(p && druhCesty(p)); }, async (route) => {
        const req = route.request();
        const p = cestaZ(req.url());
        const h = req.headers();
        if (povoleno(p)) { zaznamenej(p); return route.fallback(); }
        if (h['next-router-prefetch'] || h['next-router-segment-prefetch']) { blokovanePrefetche.add(p); return route.abort(); }
        odmitni(p, req.resourceType() === 'document' ? 'navigace' : `${req.resourceType()}${h.rsc ? ' RSC' : ''}`);
        return route.abort();
      });
    },
    /** Řádky do výpisu na konci běhu. */
    souhrn() {
      const dyn = [...navstivene];
      const nove = dyn.filter((p) => !predgenerovane.has(p));
      const r = [`Režim: ${produkce ? `PRODUKČNÍ (pevná sada stránek${process.env.NUTIT_PRODUKCNI_REZIM === '1' && !/etfpruvodce\.cz/.test(base) ? ', vynuceno NUTIT_PRODUKCNI_REZIM=1' : ''})` : 'lokální (plný rozsah)'} · cíl ${base}`,
        `Dynamické stránky (detail fondu / dvojice): ${dyn.length} unikátních, z toho ${nove.length} mimo předgenerované při buildu · ${produkce ? `limit ${LIMIT_DYNAMICKYCH}` : 'bez limitu (lokální build)'}`];
      if (blokovanePrefetche.size) r.push(`Zablokované prefetche Next.js mimo pevnou sadu: ${blokovanePrefetche.size}`);
      if (jenLokalneSeznam.length) r.push(`Jen lokálně (na produkci přeskočeno – plný běh proti lokálnímu buildu, scripts/README.md): ${jenLokalneSeznam.length}`, ...jenLokalneSeznam.map((x) => `  - ${x}`));
      if (poruseni.length) r.push(`❌ KONTROLA BY ZAPISOVALA DO ISR – požadavky mimo pevnou sadu (neodeslány): ${poruseni.length}`, ...[...new Set(poruseni)].slice(0, 15).map((x) => `  - ${x}`));
      return r;
    },
  };
  return R;
}
