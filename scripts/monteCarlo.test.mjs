#!/usr/bin/env node
/**
 * Monte Carlo jádro (src/lib/monteCarloJadro.ts, 8. 11. 2026). Zlatý případ fire-14 („Všepočasní“, 500 000 Kč
 * + 2 000 Kč měsíčně, 50 let, 600 scénářů): pevné semínko webu dřív dalo medián 15,33 mil. místo ~16,8 mil.
 * (−3,5σ). Referenční hodnoty z NEZÁVISLÉHO numpy modelu (200 000 cest, mimo kód webu): p5 7 834 221,
 * medián 16 777 584, p95 37 211 462; zlatý případ 7 822 488 / 16 787 388 / 37 172 610.
 * S antitetickými cestami má medián mezi semínky sm. odchylku ~72 tis. → pásmo ±250 tis. (≈ 3,5σ).
 * SPUŠTĚNÍ: node --test scripts/monteCarlo.test.mjs   (nebo npm test)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const src = fileURLToPath(new URL('../src', import.meta.url));
const jiti = require('jiti')(fileURLToPath(import.meta.url), { alias: { '@': src }, interopDefault: true });
const { runMonteCarloSimulation, seminko, sanceText } = jiti('../src/lib/monteCarloJadro.ts');

// Preset „Všepočasní“ (MonteCarloWidget PRESETS, id allweather).
const VSEPOCASNI = { us_large: 30, emerging: 0, intl_dev: 0, reits: 0, us_quality_bond: 40, intl_bond: 15, gold: 15, cash: 0 };

test('fire-14: semínko webu dává medián u skutečného mediánu modelu', () => {
  const seed = seminko(500000, 2000, 50, 600, 100);
  assert.equal(seed, 15542250);
  const { results, konecne } = runMonteCarloSimulation({ allocation: VSEPOCASNI, initialInvestment: 500000, monthlyContribution: 2000, years: 50, simulations: 600, seed });
  const posledni = results.at(-1);
  assert.ok(Math.abs(posledni.percentile50 - 16787388) <= 250000, `medián ${Math.round(posledni.percentile50)} mimo 16 787 388 ± 250 000`);
  assert.ok(Math.abs(posledni.percentile5 - 7822488) <= 912000, `p5 ${Math.round(posledni.percentile5)}`);
  assert.ok(Math.abs(posledni.percentile95 - 37172610) <= 4620000, `p95 ${Math.round(posledni.percentile95)}`);
  assert.equal(konecne.length, 600);
  // Šance se počítá z těchže cest jako percentily.
  const sance = (konecne.filter((v) => v >= 5000000).length / 600) * 100;
  assert.ok(Math.abs(sance - 99.6) <= 2, `šance ${sance}`);
});

test('antitetické páry: medián stabilní mezi semínky (sm. odchylka < 150 tis.)', () => {
  const mediany = [];
  for (let s = 1; s <= 20; s++) {
    const { results } = runMonteCarloSimulation({ allocation: VSEPOCASNI, initialInvestment: 500000, monthlyContribution: 2000, years: 50, simulations: 600, seed: 1000 + s });
    mediany.push(results.at(-1).percentile50);
  }
  const prumer = mediany.reduce((a, b) => a + b, 0) / mediany.length;
  const sd = Math.sqrt(mediany.reduce((a, b) => a + (b - prumer) ** 2, 0) / (mediany.length - 1));
  assert.ok(Math.abs(prumer - 16787388) <= 200000, `průměr mediánů ${Math.round(prumer)}`);
  assert.ok(sd < 150000, `sm. odchylka mediánu ${Math.round(sd)}`);
});

test('lichý počet scénářů funguje (poslední cesta bez dvojčete)', () => {
  const { results, konecne } = runMonteCarloSimulation({ allocation: VSEPOCASNI, initialInvestment: 100000, monthlyContribution: 0, years: 5, simulations: 101, seed: 7 });
  assert.equal(konecne.length, 101);
  assert.equal(results.length, 6);
});

test('šance: „> 99“ a „< 1“ místo falešné jistoty', () => {
  assert.equal(sanceText(99.83), '> 99');
  assert.equal(sanceText(100), '100');
  assert.equal(sanceText(0.17), '< 1');
  assert.equal(sanceText(0), '0');
  assert.equal(sanceText(38.2), '38');
});
