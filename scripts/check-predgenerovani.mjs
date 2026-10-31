#!/usr/bin/env node
/**
 * KONTROLA PŘEDGENEROVÁNÍ PO BUILDU (31. 10. 2026) – detaily fondů a dvojice musí být předgenerované při buildu.
 *
 * PROČ: každé nasazení na Vercelu má prázdnou ISR cache; co není předgenerované, vyrenderují roboti na požádání
 * (~6–7 ISR zápisů + CPU free tieru na stránku → ~40 000 zápisů na nasazení). Proto src/lib/prerender.ts předgeneruje
 * všechny detaily a všechny dvojice, na které web odkazuje (ZAMERNA-ROZHODNUTI.md „Předgenerování detailů a dvojic“).
 * Tahle kontrola hlídá výsledek buildu, NE kód, který ho počítá (nezávisle):
 *   1. počet předgenerovaných detailů ≥ 4 000 a dvojic ≥ 1 000,
 *   2. každá dvojice, na kterou odkazuje předgenerovaný detail nebo dvojice, je sama předgenerovaná (jinak se odkaz a
 *      seznam rozešly → render na požádání),
 *   3. žádná předgenerovaná dvojice není přesměrování (kanonické adresy, src/lib/pairs.ts).
 * Bez sítě, bez produkce – čte jen .next z lokálního buildu (`npm run build`). Spouští CEO před nasazením (scripts/README.md).
 *
 * SPUŠTĚNÍ:  npm run build && node scripts/check-predgenerovani.mjs        (exit 1 = nenasazovat)
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const APP = fileURLToPath(new URL('../.next/server/app', import.meta.url));
const MIN_DETAILU = 4000; // = src/lib/prerender.ts
const MIN_DVOJIC = 1000;  // = src/lib/prerender.ts
/** Statické stránky pod /srovnani (vlastní routa, ne [pair]). */
const VLASTNI = new Set(['porovnani', 'vwce-vs-cspx']);

if (!existsSync(`${APP}/etf`)) {
  console.error('❌ Chybí .next/server/app/etf – nejdřív npm run build');
  process.exit(1);
}
const html = (dir) => readdirSync(`${APP}/${dir}`).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5));
const detaily = html('etf');
const dvojice = html('srovnani').filter((s) => !VLASTNI.has(s));
const predgenerovane = new Set(dvojice);
const chyby = [];

if (detaily.length < MIN_DETAILU) chyby.push(`předgenerovaných detailů jen ${detaily.length} (< ${MIN_DETAILU})`);
if (dvojice.length < MIN_DVOJIC) chyby.push(`předgenerovaných dvojic jen ${dvojice.length} (< ${MIN_DVOJIC})`);

// 2. odkazy na dvojice z předgenerovaných stránek
const chybejici = new Map(); // slug → první stránka, která na něj odkazuje
let odkazu = 0;
for (const [dir, stranky] of [['etf', detaily], ['srovnani', dvojice]]) {
  for (const s of stranky) {
    const h = readFileSync(`${APP}/${dir}/${s}.html`, 'utf8');
    for (const m of h.matchAll(/href="\/srovnani\/([a-z0-9]+-vs-[a-z0-9]+)"/g)) {
      odkazu++;
      if (!predgenerovane.has(m[1]) && !VLASTNI.has(m[1]) && !chybejici.has(m[1])) chybejici.set(m[1], `/${dir}/${s}`);
    }
  }
}
if (chybejici.size) chyby.push(`${chybejici.size} odkazovaných dvojic NENÍ předgenerovaných: ${[...chybejici].slice(0, 8).map(([d, z]) => `${d} (z ${z})`).join(', ')}`);

// 3. předgenerovaná dvojice nesmí být přesměrování
const presmerovani = dvojice.filter((s) => {
  const meta = existsSync(`${APP}/srovnani/${s}.meta`) ? JSON.parse(readFileSync(`${APP}/srovnani/${s}.meta`, 'utf8')) : {};
  return (meta.status && meta.status >= 300 && meta.status < 400) || /NEXT_REDIRECT/.test(readFileSync(`${APP}/srovnani/${s}.html`, 'utf8'));
});
if (presmerovani.length) chyby.push(`${presmerovani.length} předgenerovaných dvojic je přesměrování: ${presmerovani.slice(0, 8).join(', ')}`);

console.log(`Předgenerováno: ${detaily.length} detailů, ${dvojice.length} dvojic; odkazů na dvojice ze stránek: ${odkazu}`);
if (chyby.length) {
  for (const c of chyby) console.error(`❌ ${c}`);
  process.exit(1);
}
console.log('✅ Všechny odkazované dvojice jsou předgenerované, žádná není přesměrování.');
