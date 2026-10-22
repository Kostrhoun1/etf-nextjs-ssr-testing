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
  await el.press('ControlOrMeta+a');
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

/** Anuitní měsíční splátka – nezávislý přepočet mimo kód webu. */
const anuita = (jistina, sazbaPct, roky) => { const r = sazbaPct / 100 / 12, n = roky * 12; return (jistina * r) / (1 - (1 + r) ** -n); };

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
  async '/hypotecni-kalkulacka'(page) {
    // Sazba „4,9“ = 4,9 % (dřív 49 % a splátka 147 001 Kč). Očekávaná splátka spočtená nezávisle anuitním vzorcem.
    await prepis(page, '#loanAmount', '3600000');
    await prepis(page, '#loanPeriod', '25');
    await prepis(page, '#interestRate', '4,9');
    const v = await page.locator('#interestRate').inputValue();
    if (v === '4,9') ok('hypotéka: sazba „4,9“ zůstane 4,9'); else chyba('hypotéka: desetinná čárka', `pole ukazuje „${v}“`);
    const ocek = anuita(3_600_000, 4.9, 25);
    const m = (await textStranky(page)).match(/Měsíční splátka\s*([\d ]+) Kč/);
    const spl = m ? Number(m[1].replace(/ /g, '')) : NaN;
    if (Math.abs(spl - ocek) <= 1) ok('hypotéka: splátka', `${spl} Kč (anuita ${Math.round(ocek)})`); else chyba('hypotéka: splátka', `${spl} Kč, čekáno ${Math.round(ocek)}`);
    // Mimo rozsah → viditelná hláška a ořez při opuštění pole.
    await prepis(page, '#interestRate', '49');
    const v2 = await page.locator('#interestRate').inputValue();
    const t = await textStranky(page);
    if (v2 === '15' && /Upraveno do povoleného rozsahu/.test(t)) ok('hypotéka: sazba 49 → ořez na 15 s hláškou'); else chyba('hypotéka: horní mez sazby', `pole „${v2}“`);
  },
  async '/uverova-kalkulacka'(page) {
    await prepis(page, '#loanAmount', '500000');
    await prepis(page, '#loanPeriod', '5');
    await prepis(page, '#interestRate', '8,5');
    const ocek = anuita(500_000, 8.5, 5);
    const m = (await textStranky(page)).match(/Měsíční splátka\s*([\d ]+) Kč/);
    const spl = m ? Number(m[1].replace(/ /g, '')) : NaN;
    if (Math.abs(spl - ocek) <= 1) ok('úvěr: splátka při „8,5“', `${spl} Kč`); else chyba('úvěr: splátka', `${spl} Kč, čekáno ${Math.round(ocek)}`);
    await prepis(page, '#loanAmount', '');
    if (await page.locator('[data-vysledek-chybi]').count()) ok('úvěr: prázdná částka → „—“'); else chyba('úvěr: prázdná částka', 'ukazuje výsledek');
  },
  async '/kalkulacka'(page) {
    await prepis(page, '#return', '6,5');
    const v = await page.locator('#return').inputValue();
    if (v === '6,5') ok('poplatky: výnos „6,5“ zůstane 6,5'); else chyba('poplatky: desetinná čárka', `pole „${v}“`);
    const r = norm(await page.locator('[data-qa="poplatky-rozdil"]').innerText());
    if (/000 Kč$/.test(r)) ok('poplatky: výsledek zaokrouhlen na tisíce', r); else chyba('poplatky: zaokrouhlení', r);
    // Graf: popisky musí mít na mobilu skutečně ≥ 10 px (dřív zmenšené SVG ~5 px).
    const px = await page.evaluate(() => Math.min(...[...document.querySelectorAll('svg[aria-label*="levného ETF"] text')].map((t) => t.getBoundingClientRect().height)));
    if (px >= 10) ok('poplatky: popisky grafu čitelné', `${px.toFixed(1)} px`); else chyba('poplatky: popisky grafu', `${px} px`);
  },
  async '/cisty-plat'(page) {
    // Nezávisle: 45 000 Kč hrubé 2026 → soc. 7,1 % + zdr. 4,5 % + daň 15 % − sleva 2 570 = 35 600 Kč.
    await prepis(page, '#gross', '45000');
    const c1 = Number(norm(await page.locator('[data-qa="cista-mzda"]').innerText()).replace(/\D/g, ''));
    if (c1 === 35600) ok('čistý plat: 45 000 → 35 600 Kč'); else chyba('čistý plat: 45 000', `${c1} Kč`);
    // Strop sociálního pojištění (ČSSZ 2026: 2 350 416 Kč ročně): 250 000 Kč hrubé.
    const soc = 0.071 * (2_350_416 / 12), zdr = 0.045 * 250_000;
    const dan = ((2_350_416 * 0.75) * 0.15 + (3_000_000 - 2_350_416 * 0.75) * 0.23) / 12 - 2570; // 36× průměrná mzda = 0,75 × strop
    const ocek = Math.round(250_000 - soc - zdr - dan);
    await prepis(page, '#gross', '250000');
    const c2 = Number(norm(await page.locator('[data-qa="cista-mzda"]').innerText()).replace(/\D/g, ''));
    if (Math.abs(c2 - ocek) <= 1) ok('čistý plat: strop soc. pojištění', `250 000 → ${c2} Kč`); else chyba('čistý plat: strop', `${c2} Kč, čekáno ${ocek}`);
    await prepis(page, '#gross', '');
    if (await page.locator('[data-vysledek-chybi]').count()) ok('čistý plat: prázdná mzda → „—“'); else chyba('čistý plat: prázdná mzda', 'ukazuje výsledek');
  },
  async '/kurzovy-dopad'(page) {
    await prepis(page, '#usdAlloc', '60,5');
    const v = await page.locator('#usdAlloc').inputValue();
    if (v === '60,5') ok('kurzový dopad: „60,5“ zůstane 60,5'); else chyba('kurzový dopad: čárka', `pole „${v}“`);
    await prepis(page, '#usdAlloc', '60');
    const t = await textStranky(page);
    if (/\d\.\d %/.test(t)) chyba('kurzový dopad: formát', 'desetinná tečka v procentech');
    else if (/(^|\s)-\d/.test(t)) chyba('kurzový dopad: formát', 'spojovník místo minus');
    else ok('kurzový dopad: české formátování čísel');
    if (/pravděpodobn/i.test(t) && /\b(15|20|30) %\s*\n/.test(t)) chyba('kurzový dopad', 'pravděpodobnosti scénářů bez zdroje');
    else ok('kurzový dopad: bez pravděpodobností scénářů');
  },
  async '/monte-carlo'(page) {
    const t = await textStranky(page);
    if (/Výsledky v korunách/.test(t) || /v přepočtu na koruny/.test(t)) chyba('Monte Carlo: měna', 'tvrdí „v korunách“, počítá v USD');
    else if (/bez vlivu kurzu/i.test(t)) ok('Monte Carlo: uvádí dolarové výnosy bez kurzu koruny');
    else chyba('Monte Carlo: měna', 'chybí upozornění na USD / kurz');
    await prepis(page, '#mc-initial', '100000');
    await page.getByRole('button', { name: /Spustit simulaci/ }).click();
    await page.getByText('Pravděpodobnostní pásma vývoje portfolia').waitFor({ timeout: 20000 }).catch(() => {});
    const t2 = await textStranky(page);
    const m = t2.match(/Medián \(50 %\)\s*([\d ]+) Kč/);
    if (m && / 000$/.test(m[1].trim())) ok('Monte Carlo: výsledky zaokrouhlené na tisíce', m[1]); else chyba('Monte Carlo: zaokrouhlení', m ? m[1] : 'medián nenalezen');
  },
  async '/investicni-kalkulacka'(page) {
    await prepis(page, '#initial', '');
    if (await page.locator('[data-vysledek-chybi]').count()) ok('investiční: prázdný vklad → „—“'); else chyba('investiční: prázdný vklad', 'ukazuje výsledek');
    await prepis(page, '#initial', '100000');
    await prepis(page, '#return', '7,5');
    const v = await page.locator('#return').inputValue();
    if (v === '7,5') ok('investiční: výnos „7,5“'); else chyba('investiční: čárka', `pole „${v}“`);
  },
  async '/stroj-casu'(page) {
    await prepis(page, '#sc-mesicne', '5000,5');
    const v = await page.locator('#sc-mesicne').inputValue();
    if (norm(v) === '5 001') ok('stroj času: „5000,5“ → 5 001 (ne 50 005)'); else chyba('stroj času: čárka', `pole „${v}“`);
  },
  async '/backtest'(page) {
    await prepis(page, '#bt-initial', '5000,5');
    const v = await page.locator('#bt-initial').inputValue();
    if (norm(v) === '5 001') ok('backtest: „5000,5“ → 5 001'); else chyba('backtest: čárka', `pole „${v}“`);
  },
  async '/kde-koupit'(page) {
    if (!(await page.locator('#naklady-castka').count())) { ok('kde koupit: pole částky není (bez kurzu ČNB)'); return; }
    await prepis(page, '#naklady-castka', '2000,5');
    const v = await page.locator('#naklady-castka').inputValue();
    if (norm(v) === '2 001') ok('kde koupit: „2000,5“ → 2 001'); else chyba('kde koupit: čárka', `pole „${v}“`);
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
    const male = await page.evaluate(() => [...document.querySelectorAll('main input[inputmode], main select, main input[type=range], main button[aria-label="Zvýšit"], main button[aria-label="Snížit"]')]
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
