#!/usr/bin/env node
/**
 * Produkční smoke-test (browser).
 *
 * Proč browser a ne jen fetch: bug v backtestu (onClick předal event jako měnu →
 * JSON.stringify „cyclic structures") NEšel chytit přes API – server vracel 200,
 * chyba byla čistě v prohlížeči. Tenhle test reálně klikne na tlačítka a ověří,
 * že se nástroj spustí a vykreslí výsledek, ne chybu.
 *
 * Spuštění:
 *   node scripts/prod-smoke.mjs                 # proti produkci (etfpruvodce.cz)
 *   BASE_URL=http://localhost:3000 node scripts/prod-smoke.mjs
 *
 * Předpoklad: nainstalovaný Playwright + chromium (jednorázově):
 *   npm i -D playwright && npx playwright install chromium
 *
 * Exit kód 0 = vše OK, 1 = aspoň jeden problém (vhodné pro cron/alert).
 */
import { chromium } from 'playwright';

const BASE = (process.env.BASE_URL || 'https://etfpruvodce.cz').replace(/\/$/, '');
const ERROR_TEXT = /nepodařilo|cyclic|circular structure|Application error|Something went wrong/i;

const results = [];
const ok = (name) => results.push({ name, ok: true });
const fail = (name, detail) => results.push({ name, ok: false, detail });

async function checkPage(page, path) {
  const errors = [];
  const onErr = (e) => errors.push(String(e));
  page.on('pageerror', onErr);
  const resp = await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1500);
  const status = resp ? resp.status() : 0;
  const body = await page.evaluate(() => document.body.innerText).catch(() => '');
  page.off('pageerror', onErr);
  if (status >= 400) return fail(`GET ${path}`, `HTTP ${status}`);
  if (ERROR_TEXT.test(body)) return fail(`GET ${path}`, 'chybový text na stránce');
  if (errors.length) return fail(`GET ${path}`, 'JS chyba: ' + errors[0].slice(0, 120));
  ok(`GET ${path}`);
}

// Reálná interakce: spustit backtest a ověřit výsledek (chytí klientské bugy).
async function checkBacktest(page) {
  const name = 'BACKTEST interakce';
  try {
    await page.goto(BASE + '/backtest', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);
    // klikni první hotové portfolio (preset), pak hlavní tlačítko
    const preset = page.getByRole('button', { name: /All-Weather|S&P 500|All-World|60\/40/i }).first();
    if (await preset.count()) await preset.click();
    const run = page.getByRole('button', { name: /Otestovat na historii|Spustit backtest|Počítám/i }).first();
    await run.click();
    // počkej na výsledek NEBO chybu
    await page.waitForTimeout(6000);
    const body = await page.evaluate(() => document.body.innerText);
    if (ERROR_TEXT.test(body)) return fail(name, 'zobrazila se chyba místo výsledku');
    const hasResult = /Max\. pokles|Kolísavost|VÝVOJ HODNOTY|Zhodnocení|CAGR\s*[-+0-9]/i.test(body)
      && /[-+]?\d+[,.]\d+\s*%/.test(body);
    if (!hasResult) return fail(name, 'výsledek se nevykreslil');
    ok(name);
  } catch (e) {
    fail(name, String(e).slice(0, 140));
  }
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  for (const p of ['/', '/backtest', '/srovnani', '/fire', '/dane-z-etf', '/zebricky']) {
    await checkPage(page, p);
  }
  await checkBacktest(page);
  await browser.close();

  const failed = results.filter((r) => !r.ok);
  const stamp = new Date().toISOString();
  console.log(`\n[prod-smoke ${stamp}] ${BASE}`);
  for (const r of results) console.log(`  ${r.ok ? 'OK  ' : 'FAIL'} ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
  console.log(`\n${failed.length ? '❌ ' + failed.length + ' problém(ů)' : '✅ vše v pořádku'} (${results.length} kontrol)`);
  process.exit(failed.length ? 1 : 0);
})();
