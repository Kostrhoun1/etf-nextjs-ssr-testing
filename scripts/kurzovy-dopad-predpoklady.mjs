#!/usr/bin/env node
/**
 * KOLÍSAVOST USD/CZK a EUR/CZK Z KURZŮ ČNB (audit nástrojů 22. 10. 2026, V7).
 *
 * Kalkulačka /kurzovy-dopad bere kolísavost kurzů a jejich korelaci ze src/lib/kurzovaKolisavost.ts.
 * Tenhle skript je spočítá znovu z holých dat ČNB (rok.txt, kurz posledního obchodního dne v měsíci,
 * měsíční log změny × √12) za období v konstantách a porovná: rozdíl kolísavosti > 0,3 p. b. nebo
 * korelace > 0,03 = chyba → exit 1. Měsíčně také ukáže kolísavost posledních 12 a 60 měsíců (jen informace).
 *
 * SPUŠTĚNÍ: node scripts/kurzovy-dopad-predpoklady.mjs
 *           CNB_DIR=/cesta node scripts/kurzovy-dopad-predpoklady.mjs   (soubory cnb_RRRR.txt místo stahování)
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const OD = '1999-01', DO = '2026-09';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function rok(r) {
  const dir = process.env.CNB_DIR;
  if (dir && existsSync(path.join(dir, `cnb_${r}.txt`))) return readFileSync(path.join(dir, `cnb_${r}.txt`), 'utf8');
  const url = `https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/rok.txt?rok=${r}`;
  return fetch(url).then((x) => x.text());
}

const konce = { USD: new Map(), EUR: new Map() }; // YYYY-MM → kurz posledního dne
for (let r = Number(OD.slice(0, 4)); r <= Number(DO.slice(0, 4)); r++) {
  let hlavicka = null;
  const radky = (await rok(r)).split('\n').map((l) => l.trim()).filter(Boolean);
  for (const l of radky) {
    const p = l.split('|');
    if (p[0] === 'Datum') { hlavicka = p; continue; }
    const m = p[0].match(/^(\d\d)\.(\d\d)\.(\d{4})$/);
    if (!m || !hlavicka) continue;
    for (const kod of ['USD', 'EUR']) {
      const i = hlavicka.findIndex((h) => h.split(' ').at(-1) === kod);
      if (i < 0 || !p[i]) continue;
      konce[kod].set(`${m[3]}-${m[2]}`, Number(p[i].replace(',', '.')) / Number(hlavicka[i].split(' ')[0]));
    }
  }
}
const mesice = [...konce.USD.keys()].filter((m) => m >= OD && m <= DO).sort();
const zmeny = (kod, ms) => ms.slice(1).map((m, i) => Math.log(konce[kod].get(m) / konce[kod].get(ms[i])));
const prumer = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const sd = (a) => { const p = prumer(a); return Math.sqrt(a.reduce((s, x) => s + (x - p) ** 2, 0) / (a.length - 1)); };
const korel = (a, b) => { const pa = prumer(a), pb = prumer(b); let s = 0; a.forEach((x, i) => { s += (x - pa) * (b[i] - pb); }); return s / (a.length - 1) / (sd(a) * sd(b)); };

const u = zmeny('USD', mesice), e = zmeny('EUR', mesice);
const vys = { usd: sd(u) * Math.sqrt(12), eur: sd(e) * Math.sqrt(12), korelace: korel(u, e) };
console.log(`ČNB ${mesice[0]} → ${mesice.at(-1)} (${u.length} měsíčních změn): USD/CZK ${(vys.usd * 100).toFixed(2)} %, EUR/CZK ${(vys.eur * 100).toFixed(2)} %, korelace ${vys.korelace.toFixed(2)}`);
for (const n of [12, 60]) {
  const ms = mesice.slice(-n - 1);
  console.log(`  posledních ${n} měsíců: USD/CZK ${(sd(zmeny('USD', ms)) * Math.sqrt(12) * 100).toFixed(1)} %, EUR/CZK ${(sd(zmeny('EUR', ms)) * Math.sqrt(12) * 100).toFixed(1)} %`);
}

const src = readFileSync(path.join(root, 'src/lib/kurzovaKolisavost.ts'), 'utf8');
const cti = (k) => Number((src.match(new RegExp(`\\b${k}:\\s*([\\d.]+)`)) || [])[1]);
const web = { usd: cti('usd'), eur: cti('eur'), korelace: cti('korelace') };
let chyb = 0;
for (const [k, tol] of [['usd', 0.003], ['eur', 0.003], ['korelace', 0.03]]) {
  const ok = Number.isFinite(web[k]) && Math.abs(web[k] - vys[k]) <= tol;
  if (!ok) chyb++;
  console.log(`${ok ? '✅' : '❌'} ${k}: web ${web[k]}, ČNB ${vys[k].toFixed(4)}`);
}
process.exit(chyb ? 1 : 0);
