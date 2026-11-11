#!/usr/bin/env node
/**
 * Graf vývoje indexu v Kč na detailu fondu (src/lib/vyvojIndexuGraf.ts, úkol 3.3, 11. 11. 2026).
 * Očekávání jsou ručně spočtená na malé umělé řadě (ne kódem webu), bez sítě. Skutečná čísla ověřuje
 * scripts/overeni-graf-indexu.py (Yahoo × ČNB) a denně check-fund-data.mjs (blok „graf indexu“).
 * SPUŠTĚNÍ: node --test scripts/vyvojIndexu.test.mjs   (nebo npm test)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const src = fileURLToPath(new URL('../src', import.meta.url));
const jiti = require('jiti')(fileURLToPath(import.meta.url), { alias: { '@': src }, interopDefault: true });
const { mesicniBody, osaY, rokyOsyX, cestaCary, kontrolniBody, poziceX } = jiti('../src/lib/vyvojIndexuGraf.ts');
const { convertIndexSeriesToCurrency } = jiti('../src/lib/backtest/engine.ts');
const { prirazeniFondu } = jiti('../src/lib/backtest/fondNaIndex.ts');
const { NADPIS_GRAFU, vyvojIndexuProFond } = jiti('../src/lib/vyvojIndexu.ts');

const D = (s) => new Date(`${s}T00:00:00Z`);

test('konce měsíců: poslední bod každého měsíce, poslední bod řady vždy', () => {
  const rada = [
    ['2020-01-30', 10], ['2020-01-31', 11], ['2020-02-03', 12], ['2020-02-28', 13], ['2020-03-02', 14], ['2020-03-10', 15],
  ].map(([d, c]) => ({ date: D(d), closePrice: c }));
  assert.deepEqual(mesicniBody(rada), [{ d: '2020-01-31', v: 11 }, { d: '2020-02-28', v: 13 }, { d: '2020-03-10', v: 15 }]);
});

test('neplatné hodnoty se vynechají, nenahradí (pravidlo č. 1)', () => {
  const rada = [['2020-01-31', 11], ['2020-02-27', 12], ['2020-02-28', NaN], ['2020-03-31', 0]].map(([d, c]) => ({ date: D(d), closePrice: c }));
  assert.deepEqual(mesicniBody(rada), [{ d: '2020-01-31', v: 11 }, { d: '2020-02-27', v: 12 }]);
});

test('převod do Kč stejnou funkcí jako backtest: USD × USD/CZK, bod bez kurzu vypadne', () => {
  const kurzy = [
    { date: D('2020-01-31'), eurUsd: 1.1, eurCzk: 25, usdCzk: 22.5 },
    { date: D('2020-02-28'), eurUsd: 1.1, eurCzk: 25, usdCzk: 23 },
  ];
  const rada = [{ date: D('2020-01-31'), closePrice: 100 }, { date: D('2020-02-28'), closePrice: 110 }, { date: D('2020-03-31'), closePrice: 120 }];
  const vKc = convertIndexSeriesToCurrency(rada, 'USD', 'CZK', kurzy);
  // 31. 3. je za posledním kurzem v datech → bez kurzu, bez bodu (ne převod únorovým kurzem)
  assert.deepEqual(mesicniBody(vKc), [{ d: '2020-01-31', v: 2250 }, { d: '2020-02-28', v: 2530 }]);
});

test('osa Y: hezké dílky pokrývají min a max', () => {
  const o = osaY(1234, 14876); // krok (14876 − 1234)/4 = 3410 → 5 000
  assert.deepEqual(o, { od: 0, do: 15000, dilky: [0, 5000, 10000, 15000] });
  const b = osaY(2610, 3020); // (3020 − 2610)/4 = 102,5 → nejbližší vyšší z 100/200/250/500 je 200
  assert.deepEqual(b, { od: 2600, do: 3200, dilky: [2600, 2800, 3000, 3200] });
});

test('osa X: roky po 5 letech u 26 let, po 2 letech u 10 let', () => {
  assert.deepEqual(rokyOsyX('2000-01-31', '2026-11-10'), [2005, 2010, 2015, 2020, 2025]);
  assert.deepEqual(rokyOsyX('2016-01-29', '2026-11-10'), [2018, 2020, 2022, 2024, 2026]);
});

test('čára: x podle času, y podle osy, celá čísla relativně (ruční přepočet)', () => {
  const body = [{ d: '2020-01-01', v: 0 }, { d: '2020-01-11', v: 50 }, { d: '2020-01-21', v: 100 }];
  // šířka 1000, výška 300: x = 0 / 500 / 1000; y = 300 / 150 / 0
  assert.equal(cestaCary(body, { od: 0, do: 100 }, 1000, 300), 'M0 300l500-150l500-150');
  // relativní úseky mezi zaokrouhlenými body: 0,4 + 0,4 + 0,4 se nesčítá do chyby (konec přesně na 1000 / 0)
  const tri = [{ d: '2020-01-01', v: 0 }, { d: '2020-01-02', v: 33.4 }, { d: '2020-01-03', v: 66.8 }, { d: '2020-01-04', v: 100 }];
  const d = cestaCary(tri, { od: 0, do: 100 }, 1000, 300);
  assert.equal(d, 'M0 300l333-100l334-100l333-100');
  assert.equal(poziceX('2020-01-06', '2020-01-01', '2020-01-21'), 0.25);
});

test('kontrolní body: začátek, střed, konec na 2 desetinná místa', () => {
  const body = [{ d: '2020-01-31', v: 1 }, { d: '2020-02-28', v: 2.345 }, { d: '2020-03-31', v: 3 }, { d: '2020-04-07', v: 4.5 }];
  assert.equal(kontrolniBody(body), '2020-01-31:1.00|2020-02-28:2.35|2020-04-07:4.50');
});

test('graf jen při shodě „stejny“ a jen pro indexy s nadpisem', async () => {
  const sxr8 = prirazeniFondu({ isin: 'IE00B5BMR087', name: 'iShares Core S&P 500 UCITS ETF USD (Acc)' });
  assert.equal(sxr8?.shoda, 'stejny');
  const vwce = prirazeniFondu({ isin: 'IE00BK5BQT80', name: 'Vanguard FTSE All-World UCITS ETF (USD) Accumulating' });
  assert.equal(vwce?.shoda, 'blizky');
  assert.equal(await vyvojIndexuProFond('IE00BK5BQT80', vwce), null, "'blizky' = bez grafu (bez dotazu do DB)");
  assert.equal(await vyvojIndexuProFond('IE00B4L5Y983', null), null, 'bez přiřazení = bez grafu');
  // každý index, který prirazeniFondu vrací se shodou 'stejny', má nadpis (jinak by graf tiše chyběl)
  const fondNaIndex = (await import('node:fs')).readFileSync(fileURLToPath(new URL('../src/lib/backtest/fondNaIndex.ts', import.meta.url)), 'utf8');
  const stejne = new Set([...fondNaIndex.matchAll(/indexCode: '([a-z0-9_]+)', shoda: (?:'stejny'|ish|ish && )/g)].map((m) => m[1]));
  for (const k of stejne) assert.ok(NADPIS_GRAFU[k], `chybí nadpis grafu pro ${k}`);
  assert.ok(stejne.size >= 10, `nalezeno jen ${stejne.size} indexů se shodou 'stejny'`);
});
