#!/usr/bin/env node
/**
 * Předpočet /backtest = odpověď API (úkol 3.1 plánu listopadu 2026, pravidlo č. 1).
 *
 * Stránka /backtest vkládá do HTML výsledek výchozího scénáře a scénářů z odkazů FB/Media spočítaný na serveru
 * (src/lib/backtest/predpocet.ts → predpocitejProWidget) a widget pak API nevolá. Tady se ověřuje, že čísla
 * v HTML jsou PŘESNĚ ta, která by pro stejné vstupy vrátilo POST /api/backtest/simulate (volá se skutečný
 * handler route.ts), a že zkrácení denní řady na měsíční body nemění nic, co widget ukazuje (XIRR, „vloženo“).
 *
 * BEZ SÍTĚ: globální fetch se nahradí odpovědí ve tvaru Supabase REST s umělými (deterministickými) denními
 * řadami indexů a kurzů – engine tak běží celou svou cestou včetně stránkování a převodu měn. Jakýkoli jiný
 * požadavek do sítě test shodí. Umělá data nejsou trh – test hlídá shodu dvou cest, ne hodnoty (ty hlídají
 * zlaté případy a denní kontrola proti nezávislému přepočtu).
 *
 * SPUŠTĚNÍ: node --test scripts/backtestPredpocet.test.mjs   (nebo npm test)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const src = fileURLToPath(new URL('../src', import.meta.url));
const jiti = require('jiti')(fileURLToPath(import.meta.url), { alias: { '@': src }, interopDefault: true });

/* ---------- umělá data ve tvaru Supabase REST ---------- */
const KONEC = '2026-11-10';
function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function pracovniDny(od, doDne) {
  const out = [];
  for (let t = Date.parse(od + 'T00:00:00Z'); t <= Date.parse(doDne + 'T00:00:00Z'); t += 864e5) {
    const d = new Date(t), dow = d.getUTCDay(), m = d.getUTCMonth(), den = d.getUTCDate();
    if (dow === 0 || dow === 6 || (m === 0 && den === 1) || (m === 11 && den === 25)) continue;
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}
function nahodnaProcházka(dny, seed, start, drift, vol) {
  const rnd = mulberry32(seed);
  let p = start;
  return dny.map((date) => {
    const u = Math.max(rnd(), 1e-12), v = rnd();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    p *= 1 + drift + vol * z;
    return { date, close_price: p.toFixed(4) };
  });
}
const DNY = pracovniDny('1999-12-01', KONEC);
const INDEXY = {
  sp500: nahodnaProcházka(DNY, 1, 1400, 0.0004, 0.012),
  us_treasury_1_3y: nahodnaProcházka(DNY, 2, 80, 0.0001, 0.0012),
};
const rndFx = mulberry32(3);
let eurUsd = 1.0, eurCzk = 36;
const KURZY = DNY.map((date) => {
  eurUsd *= 1 + 0.004 * (rndFx() - 0.5); eurCzk *= 1 + 0.003 * (rndFx() - 0.4995);
  return { date, eur_usd: eurUsd.toFixed(4), eur_czk: eurCzk.toFixed(3), usd_czk: (eurCzk / eurUsd).toFixed(4) };
});

let pozadavku = 0;
globalThis.fetch = async (vstup) => {
  const url = new URL(typeof vstup === 'string' ? vstup : vstup.url);
  if (!/\.supabase\.co$/.test(url.hostname)) throw new Error(`test běží bez sítě – požadavek na ${url.href}`);
  pozadavku++;
  const tabulka = url.pathname.split('/').pop();
  let radky;
  if (tabulka === 'index_historical_data') {
    const kod = (url.searchParams.get('index_code') ?? '').replace(/^eq\./, '');
    radky = INDEXY[kod];
    if (!radky) throw new Error(`test nemá data indexu ${kod}`);
  } else if (tabulka === 'exchange_rates_historical') radky = KURZY;
  else throw new Error(`test nezná tabulku ${tabulka}`);
  const od = Number(url.searchParams.get('offset') ?? 0), limit = Number(url.searchParams.get('limit') ?? 1000);
  return new Response(JSON.stringify(radky.slice(od, od + limit)), { status: 200, headers: { 'content-type': 'application/json' } });
};

/* ---------- moduly webu ---------- */
const { predpocitejProWidget } = jiti('../src/lib/backtest/predpocet.ts');
const { klicPredpoctu, TELO_VYCHOZI, TELO_BUFFETT, ODKAZ_BUFFETT, SCENARE_Z_ODKAZU } = jiti('../src/lib/backtest/predpocitaneScenare.ts');
const { pripravPozadavek } = jiti('../src/lib/backtest/simulate.ts');
const { zhodnoceniVkladu, vkladyVCase } = jiti('../src/lib/backtest/zhodnoceniVkladu.ts');
const { POST } = jiti('../src/app/api/backtest/simulate/route.ts');
const { NextRequest } = jiti('next/server');

async function zApi(telo) {
  const res = await POST(new NextRequest('http://localhost/api/backtest/simulate', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...telo, endDate: KONEC }),
  }));
  assert.equal(res.status, 200, `API vrátilo ${res.status}`);
  return res.json();
}
/** Jak předpočet dorazí do prohlížeče, porovnáváme po JSON (API také posílá JSON). */
const jakoJson = (x) => JSON.parse(JSON.stringify(x));

async function porovnej(nazev, telo) {
  const pred = await predpocitejProWidget(telo, KONEC);
  assert.ok(pred, `${nazev}: předpočet selhal`);
  assert.equal(pred.klic, klicPredpoctu(telo));
  const api = await zApi(telo);
  const v = jakoJson(pred.vysledek);

  // Čísla, která widget ukazuje – musí být totožná (deepStrictEqual, žádná tolerance).
  assert.deepEqual(v.summary, api.summary, `${nazev}: summary`);
  assert.deepEqual(v.returns.annualReturns, api.returns.annualReturns, `${nazev}: roční výnosy`);
  assert.deepEqual(v.inflation, api.inflation, `${nazev}: inflace`);
  assert.deepEqual(v.risk.maxDrawdown, api.risk.maxDrawdown, `${nazev}: max. pokles`);
  assert.deepEqual(v.risk.valueAtRisk95, api.risk.valueAtRisk95, `${nazev}: VaR`);
  assert.deepEqual(v.risk.podilPodVaR, api.risk.podilPodVaR, `${nazev}: podíl pod VaR`);
  assert.deepEqual(v.risk.allDrawdowns, [...api.risk.allDrawdowns].sort((a, b) => a.depth - b.depth).slice(0, 5), `${nazev}: 5 největších propadů`);
  assert.deepEqual(v.stressPeriods, api.stressPeriods, `${nazev}: krize`);
  assert.deepEqual(v.drawdownSeries, api.drawdownSeries, `${nazev}: řada propadů`);
  assert.deepEqual(v.rollingReturns, api.rollingReturns, `${nazev}: klouzavé výnosy`);

  // Graf: první bod každého měsíce + poslední bod, hodnoty bit po bitu z denní řady API.
  const podleDne = new Map(api.evolution.map((p) => [p.date, p.value]));
  for (const p of v.evolution) assert.equal(p.value, podleDne.get(p.date), `${nazev}: bod ${p.date}`);
  assert.deepEqual(v.evolution[0], api.evolution[0]);
  assert.deepEqual(v.evolution.at(-1), api.evolution.at(-1));
  const mesice = new Set(api.evolution.map((p) => p.date.slice(0, 7)));
  assert.ok(v.evolution.length >= mesice.size && v.evolution.length <= mesice.size + 1, `${nazev}: ${v.evolution.length} bodů na ${mesice.size} měsíců`);

  // Co widget dopočítává z řady (vklady v čase, XIRR) – z měsíčních bodů stejně jako z denní řady.
  const vklad = telo.contributions?.amount ?? 0, frekvence = telo.contributions?.frequency ?? 'none';
  assert.equal(vkladyVCase(v.evolution, telo.initialAmount, vklad, frekvence).celkem, api.summary.amountInvested, `${nazev}: vloženo`);
  assert.equal(
    zhodnoceniVkladu(v.evolution, telo.initialAmount, vklad, frekvence, v.summary.amountInvested),
    zhodnoceniVkladu(api.evolution, telo.initialAmount, vklad, frekvence, api.summary.amountInvested),
    `${nazev}: XIRR`,
  );

  // Kontrolní údaj pro denní kontrolu (check-fund-data.mjs, kolo5 A): tělo, které z něj kontrola sestaví, má stejné
  // vstupy výpočtu jako předpočet, a nese konečnou hodnotu a konec dat.
  const [odkaz, cagr, nav] = pred.kontrola.split('|');
  const q = new URL(odkaz, 'https://x').searchParams;
  const teloKontroly = {
    portfolio: q.get('slozeni').split(',').map((x) => x.split(':')).map(([c, w]) => ({ isin: c, name: c, indexCode: c, weight: Number(w) / 100, ter: 0 })),
    startDate: q.get('start'), initialAmount: Number(q.get('amount')), currency: q.get('mena') || 'CZK', rebalancingStrategy: q.get('vyvazovani') || 'yearly',
    ...(q.get('freq') !== 'none' && Number(q.get('vklad')) > 0 ? { contributions: { amount: Number(q.get('vklad')), frequency: q.get('freq') } } : {}),
  };
  assert.equal(klicPredpoctu(teloKontroly), pred.klic, `${nazev}: kontrolní odkaz ${odkaz}`);
  assert.equal(Number(nav), api.summary.netAssetValue);
  assert.equal(Number(cagr), api.summary.cagr);
  assert.equal(q.get('do'), api.evolution.at(-1).date.slice(0, 10));

  // Do HTML jen zlomek odpovědi API (cíl úkolu: stránka nenaroste o víc než ~100 kB).
  const velikost = JSON.stringify(pred.vysledek).length;
  assert.ok(velikost < 60_000, `${nazev}: předpočet má ${velikost} B`);
  assert.ok(velikost < JSON.stringify(api).length / 5, `${nazev}: předpočet není menší než API`);
  return { v, api };
}

test('výchozí scénář: předpočet = API (bez sítě)', async () => {
  const { v } = await porovnej('výchozí', TELO_VYCHOZI);
  assert.equal(v.evolution.at(-1).date.slice(0, 10), KONEC, 'data končí posledním dnem dat');
  assert.ok(v.summary.amountInvested > TELO_VYCHOZI.initialAmount, 'výchozí scénář má pravidelné vklady');
  assert.ok(pozadavku > 0, 'engine četl (umělá) data přes fetch');
});

test('odkaz z FB (Buffett 90/10): předpočet = API (bez sítě)', async () => {
  await porovnej('Buffett 90/10', TELO_BUFFETT);
});

test('odkaz z FB vede na scénář, který stránka předpočítá', () => {
  // 301 z /buffettovo-portfolio (next.config.ts) míří přesně na odkaz scénáře.
  const cfg = readFileSync(new URL('../next.config.ts', import.meta.url), 'utf8');
  const cil = cfg.match(/source: '\/buffettovo-portfolio', destination: '([^']+)'/)?.[1];
  assert.equal(cil, ODKAZ_BUFFETT);
  // Tělo scénáře = co widget pošle po načtení odkazu: preset buffett-90-10 (váhy 90 a 10 → /100), start, částka, bez vkladů.
  const q = new URL(ODKAZ_BUFFETT, 'https://x').searchParams;
  const widget = readFileSync(new URL('../src/components/design-preview/BacktestWidget.tsx', import.meta.url), 'utf8');
  const preset = widget.match(/id: 'buffett-90-10'[\s\S]*?etfs: (\[[^\]]*\])/)?.[1];
  assert.ok(preset, 'preset buffett-90-10 ve widgetu');
  const slozky = [...preset.matchAll(/indexCode: '([a-z0-9_]+)', weight: ([\d.]+)/g)].map(([, kod, w]) => [kod, Number(w) / 100]);
  assert.deepEqual(TELO_BUFFETT.portfolio.map((p) => [p.indexCode, p.weight]), slozky);
  assert.equal(q.get('portfolio'), 'buffett-90-10');
  assert.equal(TELO_BUFFETT.startDate, q.get('start'));
  assert.equal(TELO_BUFFETT.initialAmount, Number(q.get('amount')));
  assert.equal(q.get('contrib'), 'none');
  assert.equal(TELO_BUFFETT.contributions, undefined);
  assert.ok(SCENARE_Z_ODKAZU.some((s) => s.telo === TELO_BUFFETT));
});

test('klíč předpočtu: jiné vstupy výpočtu = jiný klíč, popisky klíč nemění', () => {
  const k = klicPredpoctu(TELO_VYCHOZI);
  assert.notEqual(klicPredpoctu({ ...TELO_VYCHOZI, initialAmount: 100001 }), k);
  assert.notEqual(klicPredpoctu({ ...TELO_VYCHOZI, startDate: '2005-01-02' }), k);
  assert.notEqual(klicPredpoctu({ ...TELO_VYCHOZI, currency: 'EUR' }), k);
  assert.notEqual(klicPredpoctu({ ...TELO_VYCHOZI, rebalancingStrategy: 'monthly' }), k);
  assert.notEqual(klicPredpoctu({ ...TELO_VYCHOZI, contributions: undefined }), k);
  assert.notEqual(klicPredpoctu({ ...TELO_VYCHOZI, portfolio: [{ ...TELO_VYCHOZI.portfolio[0], feeOverride: 0.0014 }] }), k);
  // isin, název a ter engine nepoužívá (poplatek řídí manifest) → klíč stejný.
  assert.equal(klicPredpoctu({ ...TELO_VYCHOZI, portfolio: [{ ...TELO_VYCHOZI.portfolio[0], isin: 'x', name: 'y', ter: 0.5 }] }), k);
});

test('validace přesunutá z route.ts do pripravPozadavek se chová stejně', () => {
  const zaklad = { ...TELO_VYCHOZI, endDate: KONEC };
  assert.equal(pripravPozadavek({ ...zaklad, portfolio: [{ ...zaklad.portfolio[0], weight: 0.995 }] }).ok, false);
  assert.equal(pripravPozadavek({ ...zaklad, portfolio: [{ ...zaklad.portfolio[0], indexCode: 'neexistuje' }] }).ok, false);
  assert.equal(pripravPozadavek({ ...zaklad, portfolio: [] }).ok, false);
  assert.equal(pripravPozadavek({ ...zaklad, endDate: '' }).ok, false);
  const ok = pripravPozadavek({ ...zaklad, portfolio: [{ ...zaklad.portfolio[0], weight: 0.99995 }], forecastYears: 1000 });
  assert.equal(ok.ok, true);
  assert.equal(ok.body.portfolio[0].weight, 1, 'váhy v toleranci se normalizují na 1');
  assert.equal(ok.body.forecastYears, 50, 'prognóza max. 50 let');
});
