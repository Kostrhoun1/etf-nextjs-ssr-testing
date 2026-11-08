#!/usr/bin/env node
/**
 * Jednotné zaokrouhlení čísel na webu (src/lib/formatyCisel.ts, 8. 11. 2026).
 * Zlatý případ naklady-28: max. pokles −20,45 % ukazoval detail fondu jako −20,4 % a porovnání jako −20,5 %.
 * Půlky se zaokrouhlují od nuly (jako justETF) a binární zápis desetinných čísel to nesmí rozbít.
 * SPUŠTĚNÍ: node --test scripts/formatyCisel.test.mjs   (nebo npm test)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const src = fileURLToPath(new URL('../src', import.meta.url));
const jiti = require('jiti')(fileURLToPath(import.meta.url), { alias: { '@': src }, interopDefault: true });
const { zaokrouhli, procenta, cislo, terFmt } = jiti('../src/lib/formatyCisel.ts');

test('půlky od nuly i u čísel, která double neuloží přesně', () => {
  assert.equal(zaokrouhli(-20.45, 1), -20.5);
  assert.equal(zaokrouhli(20.45, 1), 20.5);
  assert.equal(zaokrouhli(1.005, 2), 1.01);
  assert.equal(zaokrouhli(-0.05, 1), -0.1);
  assert.equal(zaokrouhli(2.5, 0), 3);
  assert.equal(zaokrouhli(-2.5, 0), -3);
});

test('mimo půlky se nic nemění', () => {
  assert.equal(zaokrouhli(-20.44, 1), -20.4);
  assert.equal(zaokrouhli(17.9019, 1), 17.9);
  assert.equal(zaokrouhli(0.07, 2), 0.07);
});

test('zobrazení: minus, žádné „−0,0“, TER', () => {
  assert.equal(procenta(-20.45), '−20,5 %');
  assert.equal(procenta(17.95), '+18,0 %');
  assert.equal(cislo(-0.04, 1), '0,0');
  assert.equal(procenta(-0.04), '0,0 %');
  assert.equal(terFmt(0.07), '0,07 %');
  assert.equal(procenta(null), '—');
});
