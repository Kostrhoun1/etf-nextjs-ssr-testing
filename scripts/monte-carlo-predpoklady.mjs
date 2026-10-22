#!/usr/bin/env node
/**
 * PŘEDPOKLADY MONTE CARLO SIMULÁTORU Z HISTORIE ETF (audit nástrojů 22. 10. 2026, V3).
 *
 * Proč: simulátor měl výnosy aktiv natvrdo bez zdroje a mimo historii (zlato 2,3 %, US akcie 8,6 %,
 * dluhopisy 4,2 %, hotovost 0,4 %), přitom stránka tvrdí „historický roční výnos“. Teď se všechna čísla
 * (výnos, kolísání, korelace) počítají z historie amerických ETF – jako konstanty v
 * src/lib/monteCarloPredpoklady.ts se zdrojem, obdobím a datem. Tenhle skript je spočítá z holých dat a
 * porovná s konstantami (exit 1 = rozdíl → přepočítat a aktualizovat konstanty).
 *
 * DATA: Yahoo Finance adjusted close (dividendy reinvestované, USD), poslední obchodní den v měsíci.
 *   US velké akcie = SPY, rozvinuté zahraniční = EFA, rozvíjející se = EEM, US kvalitní dluhopisy = AGG,
 *   mezinárodní (státní) dluhopisy = BWX, nemovitosti = VNQ, zlato = GLD, hotovost (pokladniční poukázky 1–3 měs.) = BIL.
 * OBDOBÍ: nejdelší společné – BWX existuje od 10/2007 → měsíční výnosy 11/2007 až 9/2026.
 * MODEL (stejný jako simulátor): měsíční LOG výnos aktiva ~ N(ln(1+výnos)/12, kolísání/√12), korelované:
 *   výnos = CAGR (geometrický průměr, medián růstu), kolísání = sm. odchylka měsíčních log výnosů × √12,
 *   korelace = Pearson měsíčních log výnosů.
 *
 * SPUŠTĚNÍ: node scripts/monte-carlo-predpoklady.mjs           (stáhne data z Yahoo a porovná)
 *           node scripts/monte-carlo-predpoklady.mjs --vypis   (navíc vypíše TS konstanty k vložení)
 *           YAHOO_DIR=/cesta node scripts/monte-carlo-predpoklady.mjs   (data z uložených y_TICKER.json)
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const AKTIVA = [
  ['us_large', 'SPY'], ['intl_dev', 'EFA'], ['emerging', 'EEM'], ['us_quality_bond', 'AGG'],
  ['intl_bond', 'BWX'], ['reits', 'VNQ'], ['gold', 'GLD'], ['cash', 'BIL'],
];
const OD = '2007-10'; // základ (konec měsíce), první výnos 11/2007
const DO = '2026-09';
const TOL_VYNOS = 0.002, TOL_VOL = 0.003, TOL_KOREL = 0.03;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function yahoo(ticker) {
  const dir = process.env.YAHOO_DIR;
  let j;
  if (dir && existsSync(path.join(dir, `y_${ticker}.json`))) j = JSON.parse(readFileSync(path.join(dir, `y_${ticker}.json`), 'utf8'));
  else {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=1167609600&period2=${Math.floor(Date.UTC(2026, 9, 3) / 1000)}&interval=1d&events=div,split`;
    j = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } }).then((r) => r.json());
  }
  const r = j.chart.result[0];
  const off = r.meta.gmtoffset ?? 0;
  const adj = r.indicators.adjclose[0].adjclose;
  const konce = new Map(); // YYYY-MM → poslední adj close v měsíci (místní den burzy)
  r.timestamp.forEach((t, i) => { if (adj[i] != null) konce.set(new Date((t + off) * 1000).toISOString().slice(0, 7), adj[i]); });
  return konce;
}

const mesice = [];
for (let [y, m] = OD.split('-').map(Number); `${y}-${String(m).padStart(2, '0')}` <= DO; m === 12 ? (y++, m = 1) : m++) mesice.push(`${y}-${String(m).padStart(2, '0')}`);

const rady = {};
for (const [klic, t] of AKTIVA) {
  const k = await yahoo(t);
  const chybi = mesice.filter((m) => !k.has(m));
  if (chybi.length) { console.error(`❌ ${t}: chybí měsíce ${chybi.slice(0, 5).join(', ')}`); process.exit(1); }
  rady[klic] = mesice.slice(1).map((m, i) => Math.log(k.get(m) / k.get(mesice[i])));
}
const n = mesice.length - 1;
const prumer = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const sd = (a) => { const p = prumer(a); return Math.sqrt(a.reduce((s, x) => s + (x - p) ** 2, 0) / (a.length - 1)); };
const vysl = {};
for (const [klic] of AKTIVA) vysl[klic] = { vynos: Math.exp(prumer(rady[klic]) * 12) - 1, vol: sd(rady[klic]) * Math.sqrt(12) };
const korel = AKTIVA.map(([a]) => AKTIVA.map(([b]) => {
  const pa = prumer(rady[a]), pb = prumer(rady[b]);
  let s = 0; for (let i = 0; i < n; i++) s += (rady[a][i] - pa) * (rady[b][i] - pb);
  return s / (n - 1) / (sd(rady[a]) * sd(rady[b]));
}));

console.log(`Období: měsíční výnosy ${mesice[1]} až ${DO} (${n} měsíců, ${(n / 12).toFixed(2)} let)`);
for (const [klic, t] of AKTIVA) console.log(`  ${klic.padEnd(16)} ${t.padEnd(4)} výnos (CAGR) ${(vysl[klic].vynos * 100).toFixed(2)} %, kolísání ${(vysl[klic].vol * 100).toFixed(2)} %`);

if (process.argv.includes('--vypis')) {
  console.log('\n// výnos, kolísání:');
  for (const [klic, t] of AKTIVA) console.log(`  ${klic}: { etf: '${t}', annualReturn: ${vysl[klic].vynos.toFixed(4)}, volatility: ${vysl[klic].vol.toFixed(4)} },`);
  console.log('// korelace (pořadí ' + AKTIVA.map(([k]) => k).join(', ') + '):');
  for (const r of korel) console.log(`  [${r.map((x) => x.toFixed(2)).join(', ')}],`);
}

// Porovnání s konstantami webu (čte se jen text souboru – ne výpočet webu).
const src = readFileSync(path.join(root, 'src/lib/monteCarloPredpoklady.ts'), 'utf8');
let chyb = 0;
for (const [klic, t] of AKTIVA) {
  const m = src.match(new RegExp(`${klic}:\\s*\\{[^}]*annualReturn:\\s*([\\d.-]+),\\s*volatility:\\s*([\\d.]+)`));
  if (!m) { console.log(`❌ ${klic}: v konstantách nenalezeno`); chyb++; continue; }
  const [r, v] = [Number(m[1]), Number(m[2])];
  const ok = Math.abs(r - vysl[klic].vynos) <= TOL_VYNOS && Math.abs(v - vysl[klic].vol) <= TOL_VOL;
  if (!ok) { chyb++; console.log(`❌ ${klic} (${t}): web ${r} / ${v}, data ${vysl[klic].vynos.toFixed(4)} / ${vysl[klic].vol.toFixed(4)}`); }
}
const blok = src.slice(src.indexOf('KORELACE'));
const radky = [...blok.matchAll(/\[([-\d., ]+)\]/g)].slice(0, AKTIVA.length).map((m) => m[1].split(',').map(Number));
if (radky.length !== AKTIVA.length) { console.log('❌ korelační matice v konstantách nenalezena'); chyb++; }
else korel.forEach((r, i) => r.forEach((x, j) => {
  if (Math.abs(x - radky[i][j]) > TOL_KOREL) { chyb++; console.log(`❌ korelace ${AKTIVA[i][0]}×${AKTIVA[j][0]}: web ${radky[i][j]}, data ${x.toFixed(2)}`); }
}));
console.log(chyb ? `\n❌ ${chyb} rozdílů – přepočítat konstanty (--vypis)` : '\n✅ Konstanty Monte Carla odpovídají historii ETF');
process.exit(chyb ? 1 : 0);
