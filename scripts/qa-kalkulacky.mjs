#!/usr/bin/env node
/**
 * QA KALKULAČEK NA MOBILU (pravidlo č. 1 – každá chyba = oprava + automatická kontrola).
 *
 * Proč: 22. 10. 2026 testerka na iPhonu zjistila, že číselná pole kalkulaček nejdou vyprázdnit
 * (řízený <input type="number"> s okamžitým ořezem): smazání „2“ → pole skočí na 0/1/18, další číslice
 * se přilepí („10“ osob, „022000“ Kč, věk „1831“ → 80) a kalkulačka ukáže ŠPATNÉ číslo
 * (nouzová rezerva 105 600 Kč místo 66 000 Kč, FIRE „mezi 111 a lety“). Desetinná čárka „4,9“ dávala 49 %.
 * Oprava: sdílená komponenta src/components/CisloInput.tsx. Tenhle test na každé kalkulačce na mobilu
 * (WebKit = Safari, 390 px, dotyk) pole VYPRÁZDNÍ, napíše novou hodnotu a ověří výsledek proti
 * očekávané (nezávisle spočtené) hodnotě + že na stránce není „undefined“, „NaN“, „ a lety“, „do .“.
 *
 * SPUŠTĚNÍ:
 *   node scripts/qa-kalkulacky.mjs [base-url]        (výchozí http://localhost:3106)
 *   PROHLIZEC=chromium node scripts/qa-kalkulacky.mjs  (výchozí webkit)
 * Analytika se v testu VŽDY blokuje (googletagmanager, google-analytics, /api/ev) – jinak by test
 * kazil měření návštěvnosti. Exit 1 = aspoň jedna chyba.
 */
import { webkit, chromium, devices } from 'playwright';

const BASE = (process.argv[2] || process.env.BASE_URL || 'http://localhost:3106').replace(/\/$/, '');
const PROHLIZEC = process.env.PROHLIZEC === 'chromium' ? chromium : webkit;
const ZAKAZANE = [/undefined/, /\bNaN\b/, / a lety/, /\bdo \./, /za ~ let/, /Infinity/];

const vysledky = [];
const ok = (n, d = '') => { vysledky.push({ n, ok: true }); console.log(`✅ ${n}${d ? ' – ' + d : ''}`); };
const chyba = (n, d) => { vysledky.push({ n, ok: false }); console.log(`❌ ${n} – ${d}`); };

/** Text bez nezlomitelných mezer (cs-CZ formát „66 000 Kč“ používá U+00A0). */
const norm = (s) => s.replace(/[  ]/g, ' ');

/** Vyprázdní pole (jako uživatel: označit vše + smazat) a napíše novou hodnotu po znacích. */
async function prepis(page, sel, hodnota, { opustit = true } = {}) {
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await el.tap();
  await el.press(process.platform === 'darwin' && PROHLIZEC === webkit ? 'Meta+a' : 'Control+a');
  await el.press('Backspace');
  // Kontrola: pole jde opravdu vyprázdnit (dřív skočilo na 0/1/18).
  const prazdne = await el.inputValue();
  if (prazdne !== '') throw new Error(`pole ${sel} nejde vyprázdnit (zůstalo „${prazdne}“)`);
  await el.type(String(hodnota), { delay: 20 });
  if (opustit) await el.press('Enter');
  await page.waitForTimeout(150);
}

async function textStranky(page) {
  return norm(await page.evaluate(() => document.body.innerText));
}

async function zakazaneTexty(page, nazev) {
  const t = await textStranky(page);
  const nalez = ZAKAZANE.filter((r) => r.test(t)).map((r) => {
    const m = t.match(r); const i = m.index;
    return `„${t.slice(Math.max(0, i - 40), i + 30).replace(/\n/g, ' ')}“`;
  });
  if (nalez.length) chyba(`${nazev}: rozbitý text`, nalez.join(' | ')); else ok(`${nazev}: bez undefined/NaN/prázdných interpolací`);
}

async function otevri(ctx, cesta) {
  const page = await ctx.newPage();
  const jsChyby = [];
  page.on('pageerror', (e) => jsChyby.push(String(e)));
  await page.goto(BASE + cesta, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(500);
  page.jsChyby = jsChyby;
  return page;
}

const TESTY = {
  async '/nouzova-rezerva'(page) {
    // Testerka: smazat výdaje a napsat 22 000, osoby 2 → 3 měsíce × 22 000 = 66 000 Kč (nízké riziko).
    await prepis(page, '#expenses', '');
    const t0 = await textStranky(page);
    if (/Kritická priorita/.test(t0) || /Cíl splněn/.test(t0)) chyba('nouzová: prázdné výdaje', 'ukazuje verdikt bez vstupu');
    else ok('nouzová: prázdné výdaje → žádný verdikt');
    await prepis(page, '#expenses', '22000');
    await prepis(page, '#family', '2');
    const castka = norm(await page.locator('[data-qa="nouzova-castka"]').innerText());
    if (castka.includes('66 000 Kč')) ok('nouzová: 22 000 × 3 = 66 000 Kč'); else chyba('nouzová: 22 000 × 3', `ukazuje ${castka}`);
    const t = await textStranky(page);
    if (/3 měsíce nezbytných výdajů/.test(t)) ok('nouzová: „3 měsíce“ (skloňování)'); else chyba('nouzová: skloňování', 'chybí „3 měsíce nezbytných výdajů“');
    if (/\d+,\d měsíců/.test(t)) chyba('nouzová: skloňování desetinných', '„x,y měsíců“ místo „měsíce“');
    // Spoření 0 a rezerva chybí → nesmí ukázat „Hotovo – cíl je splněn“.
    await prepis(page, '#savings', '0');
    await prepis(page, '#capacity', '0');
    const t2 = await textStranky(page);
    if (/Hotovo/.test(t2) || /Cíl splněn/.test(t2)) chyba('nouzová: spoření 0', 'ukazuje „Hotovo/Cíl splněn“, i když rezerva chybí');
    else ok('nouzová: spoření 0 → bez „Hotovo“');
  },
  async '/fire-kalkulacka'(page) {
    await page.evaluate(() => { try { localStorage.removeItem('etf-fire-plan-v1'); } catch {} });
    await page.reload({ waitUntil: 'networkidle' });
    // Věk: smazat „30“ a napsat 31 (dřív „1831“ → ořez 80 a „mezi 111 a lety“).
    await prepis(page, '#age', '31');
    const vek = await page.locator('#age').inputValue();
    if (vek === '31') ok('FIRE: věk jde přepsat na 31'); else chyba('FIRE: věk', `pole ukazuje „${vek}“`);
    const t = await textStranky(page);
    if (/mezi \d+ a lety/.test(t) || /mezi \d+ a \d{3} lety/.test(t)) chyba('FIRE: headline', 'rozbitý rozsah věku');
    else ok('FIRE: headline bez „mezi X a lety“');
    // Desetinná čárka v inflaci: „2,5“ = 2,5 %, ne 25 → 10 %.
    await prepis(page, '#inflation', '2,5');
    const infl = await page.locator('#inflation').inputValue();
    if (infl === '2,5') ok('FIRE: inflace „2,5“ zůstane 2,5'); else chyba('FIRE: desetinná čárka', `inflace ukazuje „${infl}“`);
    // Prázdné pole → „—“, ne výsledek z nuly.
    await prepis(page, '#expenses', '');
    if (await page.locator('[data-vysledek-chybi]').count()) ok('FIRE: prázdné výdaje → „—“'); else chyba('FIRE: prázdné výdaje', 'ukazuje výsledek');
    await prepis(page, '#expenses', '40000');
    // Pesimistická cesta nedojde (vysoké výdaje, malé spoření) → žádné „mezi 62 a lety“.
    await prepis(page, '#monthly', '3000');
    await prepis(page, '#expenses', '90000');
    await zakazaneTexty(page, 'FIRE: horizont mimo 50 let');
    // Cíl už mám → „Cíl už máte“, ne „mezi 30 a 30 lety, za ~0 let“.
    await prepis(page, '#expenses', '20000');
    await prepis(page, '#savings', '7000000');
    const t3 = await textStranky(page);
    if (/Cíl už máte/.test(t3) && !/za ~0 let/.test(t3)) ok('FIRE: cíl už splněný'); else chyba('FIRE: cíl už splněný', 'chybí „Cíl už máte“ nebo „za ~0 let“');
    // Předpoklad výnosu se zdrojem a datem; pořadí konzervativní < vyvážená < agresivní.
    const vynosy = [];
    for (const s of ['conservative', 'moderate', 'aggressive']) {
      await page.selectOption('#strategy', s);
      const p = norm(await page.locator('[data-qa="fire-predpoklad"]').innerText());
      const m = p.match(/([\d,]+) % ročně nad inflaci/);
      if (!m || !/data k \d/.test(p)) chyba(`FIRE: předpoklad ${s}`, `bez čísla/data: ${p}`);
      vynosy.push(m ? Number(m[1].replace(',', '.')) : NaN);
    }
    if (vynosy[0] < vynosy[1] && vynosy[1] < vynosy[2]) ok('FIRE: výnosy konzervativní < vyvážená < agresivní', vynosy.join(' / '));
    else chyba('FIRE: pořadí výnosů', vynosy.join(' / '));
  },
};

const browser = await PROHLIZEC.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: PROHLIZEC !== webkit ? true : undefined, locale: 'cs-CZ' });
// Analytiku NIKDY nepouštět – test by kazil měření návštěvnosti.
await ctx.route(/googletagmanager\.com|google-analytics\.com|\/api\/ev/, (r) => r.abort());

const vyber = process.env.JEN ? process.env.JEN.split(',') : Object.keys(TESTY);
for (const cesta of vyber) {
  let page;
  try {
    page = await otevri(ctx, cesta);
    await zakazaneTexty(page, `${cesta} po načtení`);
    await TESTY[cesta](page);
    await zakazaneTexty(page, `${cesta} po úpravách`);
    // Dotykové cíle: číselná pole a rozbalovací seznamy ≥ 44 px vysoké.
    const male = await page.evaluate(() => [...document.querySelectorAll('main input[inputmode], main select, main input[type=range]')]
      .filter((e) => e.offsetParent !== null && e.getBoundingClientRect().height < 43.5)
      .map((e) => `${e.id || e.getAttribute('aria-label') || e.tagName} ${Math.round(e.getBoundingClientRect().height)} px`));
    if (male.length) chyba(`${cesta}: dotykové cíle`, male.join(', ')); else ok(`${cesta}: pole a seznamy ≥ 44 px`);
    if (page.jsChyby.length) chyba(`${cesta}: JS chyba`, page.jsChyby[0].slice(0, 160));
  } catch (e) {
    chyba(cesta, String(e).slice(0, 300));
  } finally {
    await page?.close();
  }
}
await browser.close();
const spatne = vysledky.filter((v) => !v.ok).length;
console.log(`\n${vysledky.length - spatne}/${vysledky.length} OK`);
process.exit(spatne ? 1 : 0);
