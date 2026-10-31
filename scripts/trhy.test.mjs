#!/usr/bin/env node
/**
 * TEST VÝPOČTU TRHŮ (src/lib/trhy.ts `spocitejTrh`) – 31. 10. 2026, pravidlo č. 1, bod 4 (oprava = i automatická kontrola).
 *
 * Proč: tři třídy UBS MSCI EM (LU0950674175, IE00B3Z3FS74, LU1126036976) mají u zdroje řadu o 1–2 dny pozadu
 * (returns_as_of 26./27. 10., ostatní EM fondy 28. 10.; EM mezitím +2,6 %). Jejich výnos 12 m byl ke SVÉMU dni správně
 * (ověřeno na řadě justETF a Xetra IS3N.DE), o ~2,5 p. b. nižší než trh – a spocitejTrh je označil za „odlehlé“
 * (neověřený výnos skrytý na celém webu), protože vyřazoval jen fondy > 3 pracovní dny pozadu.
 * Teď: medián, test odlehlé hodnoty i vítěz jen z fondů se stejným dnem výnosů jako většina, ostatní → `pozadu`.
 *
 * Očekávání tu nejsou počítaná kódem webu: data jsou ručně vymyšlená tak, aby výsledek byl zřejmý.
 * SPUŠTĚNÍ: node --test scripts/trhy.test.mjs   (nebo npm test)
 * TS se načítá přes jiti (je v node_modules přes eslint/tailwind) s aliasem @ → src, bez sítě (Supabase klient
 * se jen vytvoří, žádný dotaz).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const src = fileURLToPath(new URL('../src', import.meta.url));
const jiti = require('jiti')(fileURLToPath(import.meta.url), { alias: { '@': src }, interopDefault: true });
const { spocitejTrh } = jiti('../src/lib/trhy.ts');

const TED = Date.parse('2026-10-30T15:00:00Z');
const TRH = { id: 'em', label: 'Rozvíjející se trhy', index: 'MSCI EM', href: '/nejlepsi-etf/nejlepsi-emerging-markets-etf', isins: [] };
const fond = (isin, r1, returnsAsOf, extra = {}) => ({
  isin, nazev: isin, ticker: null, emitent: null, ter: 0.18, velikost: 1000, r1,
  scrapingDate: '2026-10-30T05:00:00', returnsAsOf, acc: true, ...extra,
});
// Pět fondů k 28. 10. kolem 20,8 %, jeden k 27. 10. o 2,5 p. b. níž (řada zdroje o den pozadu – data správná).
const TRZNI = [
  fond('IE00BKM4GZ66', 20.77, '2026-10-28'),
  fond('IE00B4L5YC18', 20.70, '2026-10-28'),
  fond('IE00BTJRMP35', 20.85, '2026-10-28'),
  fond('LU2573966905', 20.90, '2026-10-28'),
  fond('LU1681045370', 20.60, '2026-10-28'),
];

test('fond o 1 den pozadu s −2,5 p. b. jde do `pozadu`, ne do `odlehle`', () => {
  const ubs = fond('LU0950674175', 18.27, '2026-10-27', { velikost: 5000 });
  const r = spocitejTrh(TRH, [...TRZNI, ubs], TED);
  assert.deepEqual(r.pozadu.map((f) => f.isin), ['LU0950674175']);
  assert.equal(r.odlehle.length, 0, 'fond s jiným dnem výnosů nesmí být „odlehlý“ (neověřený)');
  assert.equal(r.median, 20.77, 'medián jen z fondů ke dni většiny');
  assert.equal(r.min, 20.6);
  assert.equal(r.nejvykonnejsi?.isin, 'LU2573966905');
  assert.equal(r.pocet, 6, 'fond pozadu se dál počítá mezi fondy trhu (TER, velikost)');
  assert.equal(r.nejvetsi?.isin, 'LU0950674175', 'největší fond se vybírá i z fondů pozadu (velikost na dni výnosů nezávisí)');
});

test('fond o 1 den pozadu s nejvyšším výnosem nevyhraje „nejvýkonnější“', () => {
  const r = spocitejTrh(TRH, [...TRZNI, fond('IE00B3Z3FS74', 21.5, '2026-10-27')], TED);
  assert.deepEqual(r.pozadu.map((f) => f.isin), ['IE00B3Z3FS74']);
  assert.notEqual(r.nejvykonnejsi?.isin, 'IE00B3Z3FS74');
  assert.equal(r.max, 20.9);
});

test('fond se stejným dnem a výnosem o 2,5 p. b. jinde je pořád odlehlý (vadná data)', () => {
  const r = spocitejTrh(TRH, [...TRZNI, fond('IE00B3Z3FS74', 18.27, '2026-10-28')], TED);
  assert.deepEqual(r.odlehle.map((f) => f.isin), ['IE00B3Z3FS74']);
  assert.equal(r.pozadu.length, 0);
});

test('fondy bez returns_as_of (starý scraper) se porovnávají podle dne cen ze stažení', () => {
  const stare = TRZNI.map((f) => ({ ...f, returnsAsOf: null }));
  const r = spocitejTrh(TRH, stare, TED);
  assert.equal(r.pozadu.length, 0);
  assert.equal(r.odlehle.length, 0);
  assert.equal(r.median, 20.77);
});
