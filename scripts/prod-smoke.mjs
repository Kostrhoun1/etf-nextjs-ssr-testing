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
import { chromium, webkit } from 'playwright';

const BASE = (process.env.BASE_URL || 'https://etfpruvodce.cz').replace(/\/$/, '');
const ERROR_TEXT = /nepodařilo|cyclic|circular structure|Application error|Something went wrong/i;

// Smoke test nesmí kazit měření návštěvnosti: každý kontext Playwrightu by byl v GA nový uživatel (22. 10. 2026).
const BEZ_MERENI = /googletagmanager\.com|google-analytics\.com|\/api\/ev(\?|$)/;

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
    // Od revize 18. 10. 2026 se preset spouští sám a tlačítko „Otestovat na historii“ je jen, když je co počítat
    // → klikat jen když existuje (dřív tu test 30 s čekal na neexistující tlačítko a běh se rušil na timeoutu).
    await page.waitForTimeout(1000);
    const run = page.getByRole('button', { name: /Otestovat na historii|Spustit backtest/i }).first();
    if (await run.count()) await run.click();
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

// Mobilní hledání v hlavičce (kolo 7, 22. 10. 2026): na mobilu lupa otevřela pole, ale našeptávač se neukázal
// a Enter/„Hledat“ nikam nevedly („Form submission canceled because the form is not connected“). Desktop fungoval,
// takže to nikdo neviděl. Test: telefon 390×844 s dotykem → lupa → „VWCE“ → návrh s ISIN → Enter → /srovnani?q=VWCE.
async function checkMobilniHledani(browserType, engine) {
  const name = `MOBIL hledání (${engine})`;
  let b;
  try {
    b = await browserType.launch();
  } catch (e) {
    if (engine === 'webkit') return ok(`${name} – přeskočeno, WebKit není nainstalovaný`);
    return fail(name, String(e).slice(0, 140));
  }
  try {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: engine === 'chromium' });
    await ctx.route(BEZ_MERENI, (r) => r.abort());
    const page = await ctx.newPage();
    page.setDefaultTimeout(30000);
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Hledat ETF' }).tap();
    const input = page.getByPlaceholder('Název, ISIN nebo ticker…');
    await input.fill('VWCE');
    const navrh = page.locator('[data-testid="mobil-naseptavac"]').getByText('IE00BK5BQT80');
    try { await navrh.first().waitFor({ timeout: 10000 }); } catch { await ctx.close(); return fail(name, 'našeptávač neukázal VWCE (IE00BK5BQT80)'); }
    await input.press('Enter');
    try { await page.waitForURL(/\/srovnani\?q=VWCE/, { timeout: 30000 }); } catch { await ctx.close(); return fail(name, 'Enter nevede na /srovnani?q=VWCE'); }
    await ctx.close();
    ok(name);
  } catch (e) {
    fail(name, String(e).slice(0, 140));
  } finally {
    await b.close();
  }
}

(async () => {
  const browser = await chromium.launch();
  const kontext = await browser.newContext();
  await kontext.route(BEZ_MERENI, (r) => r.abort());
  const page = await kontext.newPage();
  page.setDefaultTimeout(30000);
  for (const p of ['/', '/backtest', '/srovnani', '/fire', '/dane-z-etf', '/zebricky']) {
    await checkPage(page, p);
  }
  await checkBacktest(page);
  await browser.close();
  await checkMobilniHledani(chromium, 'chromium');
  await checkMobilniHledani(webkit, 'webkit');

  const failed = results.filter((r) => !r.ok);
  const stamp = new Date().toISOString();
  console.log(`\n[prod-smoke ${stamp}] ${BASE}`);
  for (const r of results) console.log(`  ${r.ok ? 'OK  ' : 'FAIL'} ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
  console.log(`\n${failed.length ? '❌ ' + failed.length + ' problém(ů)' : '✅ vše v pořádku'} (${results.length} kontrol)`);
  process.exit(failed.length ? 1 : 0);
})();
