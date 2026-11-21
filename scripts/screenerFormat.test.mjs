#!/usr/bin/env node
/**
 * TEST SLOUPCOVÉHO TVARU SROVNÁVAČE (src/lib/screenerFormat.ts) – 21. 11. 2026, pravidlo č. 1, bod 4.
 *
 * Proč: /api/etf/screener posílá řádky sloupcově (úspora čtení ISR cache Vercelu). Zápis se nesmí dotknout DAT:
 * po rozbalení musí být každý řádek do posledního klíče a typu stejný jako před zabalením – včetně rozdílu mezi
 * „klíč chybí“ a „klíč je null“ (značky `_dv`, `_vynX`… v řádku buď jsou, nebo nejsou; `_trh` je null).
 *
 * Očekávaný zabalený tvar je tu napsaný RUČNĚ (ne spočítaný kódem webu). SPUŠTĚNÍ: node --test scripts/screenerFormat.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const src = fileURLToPath(new URL('../src', import.meta.url));
const jiti = require('jiti')(fileURLToPath(import.meta.url), { alias: { '@': src }, interopDefault: true });
const { zabalRadky, rozbalRadky } = jiti('../src/lib/screenerFormat.ts');

const RADKY = [
  { isin: 'IE00B5BMR087', name: 'iShares Core S&P 500', ter: 0.07, r5: 64.8, lev: false, tickers: ['sxr8', 'cspx'], _trh: 'sp500' },
  { isin: 'LU0000000001', name: 'Malý fond', ter: null, r5: null, lev: false, tickers: [], _trh: null, _vynX: 1 },
  { isin: 'LU0000000002', name: 'Fond s jiným dnem', ter: 0, r5: -3.5, lev: true, tickers: ['x'], _trh: null, _dv: '2026-11-18' },
  { isin: 'LU0000000003', name: 'Obě značky', ter: 0.2, r5: 1, lev: false, tickers: ['y'], _trh: 'world', _vynX: 1, _dv: '2026-11-17' },
];

test('zabalený tvar odpovídá ručně napsanému očekávání', () => {
  assert.deepEqual(zabalRadky(RADKY), {
    v: 2,
    k: ['isin', 'name', 'ter', 'r5', 'lev', 'tickers', '_trh', '_vynX', '_dv'],
    n: 7,
    r: [
      ['IE00B5BMR087', 'iShares Core S&P 500', 0.07, 64.8, false, ['sxr8', 'cspx'], 'sp500'],
      ['LU0000000001', 'Malý fond', null, null, false, [], null, 1],
      ['LU0000000002', 'Fond s jiným dnem', 0, -3.5, true, ['x'], null, null, '2026-11-18'],
      ['LU0000000003', 'Obě značky', 0.2, 1, false, ['y'], 'world', 1, '2026-11-17'],
    ],
  });
});

test('zabal → JSON → rozbal vrátí stejné řádky (chybějící klíč zůstane chybějící, null zůstane null, 0 a false zůstanou)', () => {
  const zpet = rozbalRadky(JSON.parse(JSON.stringify(zabalRadky(RADKY))));
  assert.deepEqual(zpet, RADKY);
  assert.equal('_vynX' in zpet[0], false);
  assert.equal('_dv' in zpet[1], false);
  assert.equal(zpet[1]._trh, null);
  assert.equal('_trh' in zpet[1], true);
  assert.equal(zpet[2].ter, 0);
  assert.equal(zpet[0].lev, false);
});

test('původní tvar (pole objektů) projde beze změny – prohlížeč se starou i novou odpovědí API', () => {
  assert.deepEqual(rozbalRadky(JSON.parse(JSON.stringify(RADKY))), RADKY);
});

test('nepovinný klíč se skutečným null nejde bezeztrátově zabalit → vrátí se původní pole', () => {
  const sNull = [...RADKY, { isin: 'LU0000000004', name: 'x', ter: 1, r5: 1, lev: false, tickers: [], _trh: null, _dv: null }];
  const z = zabalRadky(sNull);
  assert.equal(Array.isArray(z), true);
  assert.deepEqual(rozbalRadky(JSON.parse(JSON.stringify(z))), sNull);
});

test('undefined se chová jako chybějící klíč (JSON ho stejně nepřenese)', () => {
  const r = [{ a: 1, b: undefined }, { a: 2, b: 'x' }];
  assert.deepEqual(rozbalRadky(JSON.parse(JSON.stringify(zabalRadky(r)))), [{ a: 1 }, { a: 2, b: 'x' }]);
});

test('nesmysl nebo prázdno = null / prázdné pole, žádná výjimka', () => {
  assert.equal(rozbalRadky(null), null);
  assert.equal(rozbalRadky({ v: 1, k: [], r: [] }), null);
  assert.equal(rozbalRadky('chyba'), null);
  assert.deepEqual(zabalRadky([]), []);
  assert.deepEqual(rozbalRadky([]), []);
});
