#!/usr/bin/env node
/**
 * Stroj času „V dnešních korunách“ (src/lib/strojCasuVypocet.ts – spocitejStrojRealne, 3.7, 11. 11. 2026).
 * Ruční přepočet na malé umělé řadě (mimo kód webu) + hlídání pravidla „za posledním měsícem indexu ČSÚ reálná
 * čísla neukazujeme“. Skutečná čísla ověřuje scripts/overeni-realne-kalkulacky.py a zlaté případy investicni-43/44.
 * SPUŠTĚNÍ: node --test scripts/strojRealne.test.mjs   (nebo npm test)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const src = fileURLToPath(new URL('../src', import.meta.url));
const jiti = require('jiti')(fileURLToPath(import.meta.url), { alias: { '@': src }, interopDefault: true });
const { spocitejStrojRealne } = jiti('../src/lib/strojCasuVypocet.ts');
const { cpiMesic, CPI_LAST_MONTH, MONTHLY_CPI } = jiti('../src/lib/backtest/inflation.ts');

// Řada: 1 Kč na konci 12/2019 → 1,1 / 1,21 / 1,331 na konci 1–3/2020. Ceny: 12/2019 a 1/2020 = 100, 2/2020 = 110, 3/2020 = 121.
const rada = { id: 'test', od: '2020-01', nav: [1.1, 1.21, 1.331], posledniDen: '2020-03-31' };
const CPI = { '2019-12': 100, '2020-01': 100, '2020-02': 110, '2020-03': 121 };
const cpi = (ym) => CPI[ym] ?? null;

test('ruční přepočet: 100 Kč měsíčně od 1/2020 v cenách 2/2020', () => {
  const v = spocitejStrojRealne(rada, '2020-01', 100, 0, cpi, '2020-02');
  // 1/2020: 100 podílů, vklad 100 × 110/100 = 110; 2/2020: + 100/1,1 podílu, vklad 100 × 110/110 = 100.
  // Hodnota = (100 + 90,909…) × 1,21 × 110/110 = 231,0; vklady 210; nominálně 200.
  assert.equal(v.cenyMesic, '2020-02');
  assert.equal(v.prubeh.length, 2, 'výpočet končí měsícem cen, ne koncem řady');
  assert.ok(Math.abs(v.hodnota - 231) < 1e-9, `hodnota ${v.hodnota}`);
  assert.ok(Math.abs(v.vlozeno - 210) < 1e-9, `vklady ${v.vlozeno}`);
  assert.equal(v.vlozenoNominalne, 200);
  assert.ok(Math.abs(v.prubeh[0].hodnota - 121) < 1e-9, 'první měsíc: 100 × 1,1 × 110/100');
  assert.equal(v.nejhorsiPropad, null, 'reálná NAV 0,011 → 0,011: žádný propad');
});

test('jednorázový vklad a propad kupní síly', () => {
  // NAV roste o 10 %, ceny o 21 % → reálně −9,1 % proti nákupu.
  const v = spocitejStrojRealne({ ...rada, nav: [1.0, 1.1, 1.1] }, '2020-01', 0, 1000, cpi, '2020-03');
  assert.ok(Math.abs(v.hodnota - 1000 * 1.1) < 1e-9, `1000 podílů × 1,1 × 121/121 = 1100, je ${v.hodnota}`);
  assert.ok(Math.abs(v.vlozeno - 1210) < 1e-9);
  assert.equal(v.nejhorsiPropad.mesic, '2020-03');
  assert.ok(Math.abs(v.nejhorsiPropad.hloubka - (1.1 / 121 / (1 / 100) - 1)) < 1e-12);
});

test('start po měsíci cen nebo chybějící index = null (žádný odhad)', () => {
  assert.equal(spocitejStrojRealne(rada, '2020-03', 100, 0, cpi, '2020-02'), null);
  assert.equal(spocitejStrojRealne(rada, '2020-01', 100, 0, (ym) => (ym === '2020-02' ? null : CPI[ym]), '2020-02'), null);
});

test('cpiMesic nedrží poslední hodnotu za koncem řady ČSÚ', () => {
  assert.equal(cpiMesic(CPI_LAST_MONTH), MONTHLY_CPI[CPI_LAST_MONTH]);
  const [y, m] = CPI_LAST_MONTH.split('-').map(Number);
  const dalsi = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
  assert.equal(cpiMesic(dalsi), null);
  assert.equal(cpiMesic('1995-12'), null);
});
