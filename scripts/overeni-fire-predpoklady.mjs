#!/usr/bin/env node
/**
 * NEZÁVISLÉ OVĚŘENÍ PŘEDPOKLADŮ FIRE KALKULAČKY (pravidlo č. 1, krok 3 – přepočet mimo vlastní kód).
 *
 * FIRE kalkulačka (src/lib/firePredpoklady.ts → FireKalkulackaWidget.tsx) bere
 * reálný (po inflaci) roční výnos a kolísání tří mixů akcie/dluhopisy z vlastního backtestu
 * (engine, /api/backtest/simulate): akcie = Vanguard FTSE All-World (VT), dluhopisy = Xtrackers
 * Eurozone Government Bond (XGLE.DE), v Kč, roční rebalancování, 7/2008–9/2026.
 *
 * Tenhle skript to spočítá ZNOVU z holých dat, bez kódu webu:
 *  - ceny: Yahoo Finance adjusted close (VT v USD, XGLE.DE v EUR), denně,
 *  - kurzy: ČNB (denní fixing USD/CZK a EUR/CZK, kurz platný v den obchodu = poslední fixing ≤ den),
 *  - inflace: Eurostat HICP CZ (2015 = 100) pro 6/2008 → 6/2015, ČSÚ CPI CEN0101E (2015 = 100) pro 6/2015 → 9/2026.
 *    (ČSÚ má měsíční index v open datech až od 2015; HICP je jiný, ale blízký index – proto tolerance.)
 * Porovná s hodnotami v FIRE_PREDPOKLADY; rozdíl reálného CAGR > 0,3 p. b. nebo REÁLNÉHO kolísání > 0,5 p. b. = chyba → exit 1.
 * Kolísání je REÁLNÉ (simulace FIRE běží v dnešních korunách): sm. odchylka měsíčních log. výnosů po inflaci × √12.
 * Výsledek 22. 10. 2026: reálně 2,00 / 4,55 / 6,14 % (web 2,0 / 4,6 / 6,2 %), reálné kolísání 7,6 / 9,2 / 11,0 %
 * (nominální 6,9 / 8,7 / 10,6 % – to měl web do auditu nástrojů 22. 10. 2026, V2), inflace 3,11 % ročně.
 *
 * SPUŠTĚNÍ: node scripts/overeni-fire-predpoklady.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const OD = '2008-07-01';
const DO = '2026-09-30';
const TOLERANCE_PB = 0.3;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const widget = readFileSync(path.join(root, 'src/lib/firePredpoklady.ts'), 'utf8');
const naWebu = {};
for (const [klic, mix] of [['conservative', 0.3], ['moderate', 0.6], ['aggressive', 0.8]]) {
  const m = widget.match(new RegExp(`${klic}:\\s*\\{\\s*realnyVynos:\\s*([\\d.]+),\\s*volatilita:\\s*([\\d.]+)`));
  if (!m) { console.error(`❌ Ve widgetu nenalezen předpoklad ${klic}`); process.exit(1); }
  naWebu[mix] = { real: Number(m[1]), vol: Number(m[2]) };
}

const ts = (d) => Math.floor(new Date(d + 'T00:00:00Z').getTime() / 1000);
async function yahoo(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?period1=${ts('2008-06-20')}&period2=${ts('2026-10-02')}&interval=1d&events=div,split`;
  const j = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } }).then((r) => r.json());
  const r = j.chart.result[0];
  const adj = r.indicators.adjclose[0].adjclose;
  const out = new Map();
  r.timestamp.forEach((t, i) => { if (adj[i] != null) out.set(new Date(t * 1000).toISOString().slice(0, 10), adj[i]); });
  return out;
}
async function cnb(mena) {
  const url = `https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/vybrane.txt?mena=${mena}&od=01.06.2008&do=01.10.2026`;
  const txt = await fetch(url).then((r) => r.text());
  const body = [];
  for (const l of txt.split('\n')) {
    const m = l.match(/^(\d\d)\.(\d\d)\.(\d{4})\|([\d,]+)/);
    if (m) body.push([`${m[3]}-${m[2]}-${m[1]}`, Number(m[4].replace(',', '.'))]);
  }
  body.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  return body;
}
const kurzK = (rada) => {
  let i = 0;
  return (den) => { while (i + 1 < rada.length && rada[i + 1][0] <= den) i++; return rada[i][1]; };
};

async function cpi() {
  const hicp = await fetch('https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_midx?format=JSON&lang=EN&geo=CZ&coicop=CP00&unit=I15&sinceTimePeriod=2008-01')
    .then((r) => r.json());
  const idx = hicp.dimension.time.category.index;
  const hv = (m) => hicp.value[String(idx[m])];
  const csv = await fetch('https://data.csu.gov.cz/opendata/sady/CEN0101E/distribuce/csv').then((r) => r.text());
  const cz = {};
  for (const l of csv.split('\n')) {
    if (!l.includes('"Bazický index (2015 = 100)"') || !l.includes('"Úhrn","0","","","Domácnosti celkem","0","Česko"')) continue;
    const f = l.split('","');
    cz[f[13]] = Number(f[14]);
  }
  // Měsíční CPI: HICP do 5/2015 (přeškálovaný na ČSÚ v 6/2015), od 6/2015 ČSÚ – pro reálné měsíční výnosy.
  const mesicni = (m) => (m >= '2015-06' ? cz[m] : (hv(m) * cz['2015-06']) / hv('2015-06'));
  // CPI(9/2026) / CPI(6/2008) = HICP(6/2015)/HICP(6/2008) × ČSÚ(9/2026)/ČSÚ(6/2015)
  return { mesicni, pomer: (hv('2015-06') / hv('2008-06')) * (cz['2026-09'] / cz['2015-06']), hicp0806: hv('2008-06'), hicp1506: hv('2015-06'), cz1506: cz['2015-06'], cz2609: cz['2026-09'] };
}

const [vt, xg, usd, eur, infl] = await Promise.all([yahoo('VT'), yahoo('XGLE.DE'), cnb('USD'), cnb('EUR'), cpi()]);
const usdK = kurzK(usd), eurK = kurzK(eur);
// Společné obchodní dny (bez dne bez ceny jednoho z fondů – poslední známá cena se drží).
const dny = [...new Set([...vt.keys(), ...xg.keys()])].filter((d) => d >= OD && d <= DO).sort();
let lastV = null, lastX = null;
const rada = [];
for (const d of [...new Set([...vt.keys(), ...xg.keys()])].sort()) {
  if (vt.has(d)) lastV = vt.get(d);
  if (xg.has(d)) lastX = xg.get(d);
  if (d < OD || d > DO || lastV == null || lastX == null) continue;
  rada.push({ d, a: lastV * usdK(d), b: lastX * eurK(d) });
}
const roky = (new Date(rada.at(-1).d) - new Date(rada[0].d)) / (365.25 * 864e5);
console.log(`Období ${rada[0].d} → ${rada.at(-1).d} (${roky.toFixed(2)} let, ${dny.length} dní). Inflace CZ za období: ${((infl.pomer ** (1 / roky) - 1) * 100).toFixed(2)} % ročně`);

let chyb = 0;
for (const mix of [0, 0.3, 0.6, 0.8, 1]) {
  // Roční rebalancování k prvnímu obchodnímu dni nového roku.
  let ua = mix / rada[0].a, ub = (1 - mix) / rada[0].b;
  // Kolísání z výnosů mezi konci měsíců (stejná konvence jako měsíční řada backtestu).
  const konceMesicu = new Map();
  let rok = rada[0].d.slice(0, 4);
  for (const p of rada) {
    const h = ua * p.a + ub * p.b;
    if (p.d.slice(0, 4) !== rok) { ua = (mix * h) / p.a; ub = ((1 - mix) * h) / p.b; rok = p.d.slice(0, 4); }
    konceMesicu.set(p.d.slice(0, 7), h);
  }
  const konec = ua * rada.at(-1).a + ub * rada.at(-1).b;
  const nom = konec ** (1 / roky) - 1;
  const real = (konec / infl.pomer) ** (1 / roky) - 1;
  // Reálné měsíční log. výnosy: konec měsíce / konec předchozího ÷ poměr CPI. Start = konec 6/2008 (CPI 6/2008).
  const mesice = [...konceMesicu.keys()];
  const me = [...konceMesicu.values()];
  const lr = me.slice(1).map((v, i) => Math.log(v / me[i] / (infl.mesicni(mesice[i + 1]) / infl.mesicni(mesice[i]))));
  const prumer = lr.reduce((s, x) => s + x, 0) / lr.length;
  const vol = Math.sqrt(lr.reduce((s, x) => s + (x - prumer) ** 2, 0) / (lr.length - 1)) * Math.sqrt(12);
  const web = naWebu[mix] ?? { real: NaN, vol: NaN };
  const rozdil = real * 100 - web.real;
  const ok = !naWebu[mix] || (Math.abs(rozdil) <= TOLERANCE_PB && Math.abs(vol - web.vol) * 100 <= 0.5);
  if (!ok) chyb++;
  console.log(`${ok ? '✅' : '❌'} ${Math.round(mix * 100)}/${Math.round((1 - mix) * 100)}: nominálně ${(nom * 100).toFixed(2)} %, reálně ${(real * 100).toFixed(2)} % ${naWebu[mix] ? `(web ${web.real} %, rozdíl ${rozdil.toFixed(2)} p. b.)` : '(jen pro kontext)'}, reálné kolísání (měsíční log. výnosy po inflaci) ${(vol * 100).toFixed(1)} % ${naWebu[mix] ? `(web ${(web.vol * 100).toFixed(1)} %)` : ''}`);
}
const r = Object.values(naWebu).map((x) => x.real);
if (!(r[0] < r[1] && r[1] < r[2])) { console.log('❌ Pořadí výnosů musí být konzervativní < vyvážená < agresivní'); chyb++; }
process.exit(chyb ? 1 : 0);
