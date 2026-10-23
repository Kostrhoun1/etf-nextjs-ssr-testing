#!/usr/bin/env node
/**
 * QA KALKULAČEK NA MOBILU (pravidlo č. 1 – každá chyba = oprava + automatická kontrola).
 *
 * Proč: 22. 10. 2026 testerka na iPhonu zjistila, že číselná pole kalkulaček nejdou vyprázdnit
 * (řízený <input type="number"> s okamžitým ořezem): smazání „2“ → pole skočí na 0/1/18, další číslice
 * se přilepí („10“ osob, „022000“ Kč, věk „1831“ → 80) a kalkulačka ukáže ŠPATNÉ číslo
 * (nouzová rezerva 105 600 Kč místo 66 000 Kč, FIRE „mezi 111 a lety“). Desetinná čárka „4,9“ dávala 49 %.
 * Oprava: sdílená komponenta src/components/CisloInput.tsx.
 *
 * Audit nástrojů 22. 10. 2026 (SOUHRN v scratchpadu vedoucího) přidal regresní případy:
 *  V1  „15.000“ → 15 000 (ne 15 Kč), „1.000“ → 1 000, „100.000“ → 100 000, „1.000.000“ → 1 000 000; „2,5“ v poli
 *      pro celá čísla → hláška + „—“ (ne tiché 3); „1.000“ v procentním poli = 1,
 *  V2  FIRE: geometrický model, reálné kolísání → výchozí případ 52 / 57 / 65 let (numpy 100 000 cest),
 *  S19 FIRE: „ani za 50 let nedosáhnete“ jen když cíle nedosáhne žádná simulace,
 *  V3  Monte Carlo: předpoklady z historie ETF se zdrojem a datem; percentily proti nezávislému modelu,
 *  S22 2 platné číslice,
 *  V7  kurzový dopad: kolísavost z ČNB (VaR 100 % EUR = 1 mil. × 5,14 % × 1,65), S27 věta o pravidelných nákupech,
 *  V11/S23/S24/N12/N13/N14 čistý plat (štítek důchodce 0,6 %, stejný základ procent, doplatek do minimální mzdy,
 *      bonus < 50 Kč, zákonné zaokrouhlení),
 *  V12/S25 nouzová rezerva (OSVČ 6–12, rodina se splátkami ≥ 6, „Dostatečná“ jen bez chybějící částky),
 *  S6 investiční kalkulačka (prázdný výnos/daň), S7 stroj času (nad max. → hláška, ne tichá 0), N1 „1 let“,
 *  N2 modelové výsledky na 3 platné číslice, pod 100 000 Kč na stovky (upraveno 23. 10. 2026: na tisíce vynulovalo výnos).
 * Očekávané hodnoty jsou spočtené NEZÁVISLE (vzorce zákona / Python z holých dat ČNB a Yahoo), ne replikou kódu webu.
 *
 * SPUŠTĚNÍ:
 *   node scripts/qa-kalkulacky.mjs [base-url]            (výchozí http://localhost:3106; WebKit i Chromium)
 *   PROHLIZEC=webkit|chromium node scripts/qa-kalkulacky.mjs   (jen jeden prohlížeč)
 *   JEN=/fire-kalkulacka,/cisty-plat node scripts/qa-kalkulacky.mjs
 * Oba prohlížeče běží jako telefon 390 × 844 s dotykem (hasTouch).
 * Analytika se v testu VŽDY blokuje (googletagmanager, google-analytics, /api/ev) v KAŽDÉM kontextu – jinak by test
 * kazil měření návštěvnosti. Exit 1 = aspoň jedna chyba.
 */
import { webkit, chromium, devices } from 'playwright';

const BASE = (process.argv[2] || process.env.BASE_URL || 'http://localhost:3106').replace(/\/$/, '');
const PROHLIZECE = process.env.PROHLIZEC === 'chromium' ? [['chromium', chromium]]
  : process.env.PROHLIZEC === 'webkit' ? [['webkit', webkit]]
    : [['webkit', webkit], ['chromium', chromium]];
const ZAKAZANE = [/undefined/, /\bNaN\b/, / a lety/, /\bdo \./, /za ~ let/, /Infinity/, /\b1 let\b/i, /splatnosti 1 let/i, /za [1-4] let\b/i];

const vysledky = [];
let prohlizec = '';
const ok = (n, d = '') => { vysledky.push({ n, ok: true }); console.log(`✅ [${prohlizec}] ${n}${d ? ' – ' + d : ''}`); };
const chyba = (n, d) => { vysledky.push({ n, ok: false }); console.log(`❌ [${prohlizec}] ${n} – ${d}`); };
const over = (podminka, n, d) => (podminka ? ok(n, d) : chyba(n, d));

/** Text bez nezlomitelných mezer (cs-CZ formát „66 000 Kč“ používá U+00A0). */
const norm = (s) => s.replace(/[\u00a0\u202f]/g, ' ');
const cislo = (s) => Number(norm(s).replace(/[^\d,−-]/g, '').replace(',', '.').replace('−', '-'));

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
  await page.waitForTimeout(200);
}
const pole = async (page, sel) => norm(await page.locator(sel).first().inputValue());

async function textStranky(page) {
  return norm(await page.evaluate(() => document.body.innerText));
}
const textQa = async (page, qa) => norm(await page.locator(`[data-qa="${qa}"]`).first().innerText());

async function zakazaneTexty(page, nazev) {
  const t = await textStranky(page);
  const nalez = ZAKAZANE.filter((r) => r.test(t)).map((r) => {
    const m = t.match(r); const i = m.index;
    return `„${t.slice(Math.max(0, i - 40), i + 30).replace(/\n/g, ' ')}“`;
  });
  if (nalez.length) chyba(`${nazev}: rozbitý text`, nalez.join(' | ')); else ok(`${nazev}: bez undefined/NaN/„1 let“/prázdných interpolací`);
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

/** ČISTÝ PLAT 2026 – nezávisle podle zákona (ne kopie kódu webu):
 *  § 38h ZDP: základ zálohy na stokoruny nahoru, 15 % do 146 901 Kč (3× průměrná mzda 48 967), 23 % nad, záloha na koruny nahoru;
 *  § 35d odst. 4 ZDP: bonus ≥ 50 Kč a příjem ≥ ½ min. mzdy; § 7 z. 589/1992: pojistné na koruny nahoru;
 *  zdravotní: 13,5 % nahoru, zaměstnanec ⅓ nahoru (VZP; Práce a mzda 22 880 → 3 089 = 1 030 + 2 059);
 *  pod min. mzdou 22 400 Kč doplatek 13,5 % z rozdílu (§ 3 odst. 7 z. 592/1992, VZP). Strop soc. 48 × 48 967 / 12. */
function cistyPlat(hruba, { deti = [], duchodce = false, vyjimka = false } = {}) {
  const up = (x) => Math.ceil(x - 1e-9);
  const soc = up(Math.min(hruba, (48 * 48967) / 12) * (duchodce ? 0.006 : 0.071));
  const zdrCelkem = up(hruba * 0.135);
  const doplatek = !vyjimka && !duchodce && hruba < 22400 ? up(22400 * 0.135) - zdrCelkem : 0;
  const zdr = up(zdrCelkem / 3) + doplatek;
  const zaklad = Math.ceil(hruba / 100) * 100;
  const dan = up(Math.min(zaklad, 146901) * 0.15 + Math.max(0, zaklad - 146901) * 0.23);
  const poPoplatnikovi = Math.max(0, dan - 2570);
  const zvyh = deti.reduce((s, x) => s + x, 0);
  const zbytek = poPoplatnikovi - zvyh;
  const bonus = zbytek < 0 && hruba >= 11200 && -zbytek >= 50 ? -zbytek : 0;
  return { cista: hruba - soc - zdr - Math.max(0, zbytek) + bonus, soc, zdr, bonus };
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
    const castka = await textQa(page, 'nouzova-castka');
    over(castka.includes('66 000 Kč'), 'nouzová: 22 000 × 3 = 66 000 Kč', castka);
    const t = await textStranky(page);
    if (/3 měsíce nezbytných výdajů/.test(t)) ok('nouzová: „3 měsíce“ (skloňování)'); else chyba('nouzová: skloňování', 'chybí „3 měsíce nezbytných výdajů“');
    if (/\d+,\d měsíců/.test(t)) chyba('nouzová: skloňování desetinných', '„x,y měsíců“ místo „měsíce“');
    // V1: „2,5“ osoby → hláška a „—“, NE tiché zaokrouhlení na 3.
    await prepis(page, '#family', '2,5');
    over(await pole(page, '#family') === '2,5' && (await page.locator('[data-cislo-hlaska="necele"]').count()) > 0 && (await page.locator('[data-vysledek-chybi]').count()) > 0,
      'nouzová: „2,5“ osob → hláška „celé číslo“ + „—“', await pole(page, '#family'));
    await prepis(page, '#family', '2');
    // V12: OSVČ = 6 měsíců (FAQ: OSVČ 6–12), domácnost 2 osoby + pravidelné splátky ≥ 6 měsíců.
    await prepis(page, '#expenses', '40000');
    await page.selectOption('#contract', 'freelance');
    over((await textQa(page, 'nouzova-castka')).includes('240 000 Kč'), 'nouzová: OSVČ → 6 měsíců = 240 000 Kč', await textQa(page, 'nouzova-castka'));
    await page.selectOption('#contract', 'permanent');
    await page.locator('#debt').check();
    over((await textQa(page, 'nouzova-castka')).includes('240 000 Kč'), 'nouzová: 2 osoby + pravidelné splátky → 6 měsíců', await textQa(page, 'nouzova-castka'));
    await page.locator('#debt').uncheck();
    // S25: OSVČ, rezerva 6 měsíců = 240 000, úspory 200 000 → chybí 40 000 → NESMÍ být „Dostatečná rezerva“.
    await page.selectOption('#contract', 'freelance');
    await prepis(page, '#savings', '200000');
    const t1 = await textStranky(page);
    over(!/Dostatečná rezerva/.test(t1) && /Zbývá dospořit\s*40 000 Kč/i.test(t1), 'nouzová: chybí 40 000 → ne „Dostatečná rezerva“');
    over(/Mám pravidelné splátky/.test(t1) && !/hypotéka, úvěr/.test(t1), 'nouzová: neutrální popisek „pravidelné splátky“');
    await page.selectOption('#contract', 'permanent');
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
    // V2: výchozí případ (30 let, 40 000, 500 000, 15 000, 2,5 %, 60/40). Nezávislý numpy model, 100 000 cest,
    // log-normální měsíční výnos s mediánem 4,6 % reálně a kolísáním 9,2 %: 52 / 57 / 65 let (před opravou 58/67).
    const vek = async (qa) => Number((await textQa(page, qa)).replace(/\D/g, ''));
    const [f, m, s] = [await vek('fire-fast'), await vek('fire-med'), await vek('fire-slow')];
    over(Math.abs(f - 52) <= 1 && Math.abs(m - 57) <= 1 && Math.abs(s - 65) <= 2, 'FIRE: výchozí věky ≈ 52 / 57 / 65 (numpy)', `${f} / ${m} / ${s}`);
    // V1: „15.000“ v měsíčním spoření = 15 000 (dřív 15 Kč a „ani za 50 let nedosáhnete“).
    await prepis(page, '#monthly', '15.000');
    over(await pole(page, '#monthly') === '15 000' && await vek('fire-med') === m, 'FIRE: „15.000“ = 15 000 Kč', await pole(page, '#monthly'));
    await prepis(page, '#savings', '1.000.000');
    over(await pole(page, '#savings') === '1 000 000', 'FIRE: „1.000.000“ = 1 000 000 Kč (dřív prázdné)', await pole(page, '#savings'));
    await prepis(page, '#savings', '500000');
    // Věk: smazat „30“ a napsat 31 (dřív „1831“ → ořez 80 a „mezi 111 a lety“).
    await prepis(page, '#age', '31');
    over(await pole(page, '#age') === '31', 'FIRE: věk jde přepsat na 31');
    const t = await textStranky(page);
    if (/mezi \d+ a lety/.test(t) || /mezi \d+ a \d{3} lety/.test(t)) chyba('FIRE: headline', 'rozbitý rozsah věku');
    else ok('FIRE: headline bez „mezi X a lety“');
    over(/Obvykle \(medián\)/.test(t) && !/Nejčastěji/.test(t), 'FIRE: „Obvykle (medián)“ místo „Nejčastěji“');
    await prepis(page, '#age', '30');
    // Desetinná čárka v inflaci: „2,5“ = 2,5 %, ne 25 → 10 %.
    await prepis(page, '#inflation', '2,5');
    over(await pole(page, '#inflation') === '2,5', 'FIRE: inflace „2,5“ zůstane 2,5');
    // Prázdné pole → „—“, ne výsledek z nuly.
    await prepis(page, '#expenses', '');
    over((await page.locator('[data-vysledek-chybi]').count()) > 0, 'FIRE: prázdné výdaje → „—“');
    // S19: 90 000 Kč výdajů, spoření 3 000 → cíle dosáhne jen menšina simulací (numpy: 7,5 %) → NE „v žádné“.
    await prepis(page, '#monthly', '3000');
    await prepis(page, '#expenses', '90000');
    const n1 = await textQa(page, 'fire-nedosazeno');
    over(/jen v \d+ % simulací/.test(n1) && !/v žádné/.test(n1), 'FIRE: menšina simulací → „jen v X % simulací“', n1);
    await zakazaneTexty(page, 'FIRE: horizont mimo 50 let');
    // S19: 18 let, 10 000, nic naspořeno ani spořeno → žádná simulace → „v žádné z 600 simulací“.
    await prepis(page, '#age', '18');
    await prepis(page, '#expenses', '10000');
    await prepis(page, '#savings', '0');
    await prepis(page, '#monthly', '0');
    const n2 = await textQa(page, 'fire-nedosazeno');
    over(/v žádné z 600 simulací/.test(n2), 'FIRE: bez spoření → „v žádné z 600 simulací“', n2);
    // Cíl už mám → „Cíl už máte“, ne „mezi 30 a 30 lety, za ~0 let“.
    await prepis(page, '#age', '30');
    await prepis(page, '#expenses', '20000');
    await prepis(page, '#savings', '7000000');
    const t3 = await textStranky(page);
    over(/Cíl už máte/.test(t3) && !/za ~0 let/.test(t3), 'FIRE: cíl už splněný');
    // Předpoklad výnosu se zdrojem a datem; pořadí konzervativní < vyvážená < agresivní.
    const vynosy = [];
    for (const st of ['conservative', 'moderate', 'aggressive']) {
      await page.selectOption('#strategy', st);
      const p = await textQa(page, 'fire-predpoklad');
      const mm = p.match(/([\d,]+) % ročně nad inflaci/);
      if (!mm || !/data k \d/.test(p)) chyba(`FIRE: předpoklad ${st}`, `bez čísla/data: ${p}`);
      vynosy.push(mm ? Number(mm[1].replace(',', '.')) : NaN);
    }
    over(vynosy[0] < vynosy[1] && vynosy[1] < vynosy[2], 'FIRE: výnosy konzervativní < vyvážená < agresivní', vynosy.join(' / '));
  },
  async '/hypotecni-kalkulacka'(page) {
    // Sazba „4,9“ = 4,9 % (dřív 49 % a splátka 147 001 Kč). Očekávaná splátka spočtená nezávisle anuitním vzorcem.
    await prepis(page, '#loanAmount', '3600000');
    await prepis(page, '#loanPeriod', '25');
    await prepis(page, '#interestRate', '4,9');
    over(await pole(page, '#interestRate') === '4,9', 'hypotéka: sazba „4,9“ zůstane 4,9');
    const ocek = anuita(3_600_000, 4.9, 25);
    const m = (await textStranky(page)).match(/Měsíční splátka\s*([\d ]+) Kč/);
    const spl = m ? Number(m[1].replace(/ /g, '')) : NaN;
    over(Math.abs(spl - ocek) <= 1, 'hypotéka: splátka', `${spl} Kč (anuita ${Math.round(ocek)})`);
    // V1: „1.000“ v procentním poli (max 15 %) = 1 %, ne 1 000.
    await prepis(page, '#interestRate', '1.000');
    over(await pole(page, '#interestRate') === '1', 'hypotéka: „1.000“ v sazbě = 1 %', await pole(page, '#interestRate'));
    // Mimo rozsah → viditelná hláška a ořez při opuštění pole.
    await prepis(page, '#interestRate', '49');
    const v2 = await pole(page, '#interestRate');
    over(v2 === '15' && /Upraveno do povoleného rozsahu/.test(await textStranky(page)), 'hypotéka: sazba 49 → ořez na 15 s hláškou', v2);
    // N1: splatnost 1 rok → „1 rok“, ne „1 let“.
    await prepis(page, '#interestRate', '4,9');
    await prepis(page, '#loanPeriod', '1');
    over(/splatnosti 1 rok\b/.test(await textStranky(page)), 'hypotéka: „splatnosti 1 rok“');
  },
  async '/uverova-kalkulacka'(page) {
    await prepis(page, '#loanAmount', '500000');
    await prepis(page, '#loanPeriod', '5');
    await prepis(page, '#interestRate', '8,5');
    const ocek = anuita(500_000, 8.5, 5);
    const m = (await textStranky(page)).match(/Měsíční splátka\s*([\d ]+) Kč/);
    const spl = m ? Number(m[1].replace(/ /g, '')) : NaN;
    over(Math.abs(spl - ocek) <= 1, 'úvěr: splátka při „8,5“', `${spl} Kč, čekáno ${Math.round(ocek)}`);
    await prepis(page, '#loanAmount', '500.000');
    over(await pole(page, '#loanAmount') === '500 000', 'úvěr: „500.000“ = 500 000 Kč', await pole(page, '#loanAmount'));
    await prepis(page, '#loanAmount', '');
    over((await page.locator('[data-vysledek-chybi]').count()) > 0, 'úvěr: prázdná částka → „—“');
  },
  async '/kalkulacka'(page) {
    await prepis(page, '#return', '6,5');
    over(await pole(page, '#return') === '6,5', 'poplatky: výnos „6,5“ zůstane 6,5');
    const r = await textQa(page, 'poplatky-rozdil');
    over(/000 Kč$/.test(r), 'poplatky: výsledek zaokrouhlen na tisíce', r);
    // V1: „100.000“ počáteční investice = 100 000.
    await prepis(page, '#initial', '100.000');
    over(await pole(page, '#initial') === '100 000', 'poplatky: „100.000“ = 100 000 Kč', await pole(page, '#initial'));
    // N1: doba 1 rok → „za 1 rok“.
    await prepis(page, '#period', '1');
    over(/Výsledek za 1 rok\b/i.test(await textStranky(page)), 'poplatky: „Výsledek za 1 rok“');
    await prepis(page, '#period', '30');
    // Graf: popisky musí mít na mobilu skutečně ≥ 10 px (dřív zmenšené SVG ~5 px).
    const px = await page.evaluate(() => Math.min(...[...document.querySelectorAll('svg[aria-label*="levného ETF"] text')].map((t) => t.getBoundingClientRect().height)));
    over(px >= 10, 'poplatky: popisky grafu čitelné', `${px.toFixed?.(1)} px`);
  },
  async '/cisty-plat'(page) {
    const cista = async () => cislo(await textQa(page, 'cista-mzda'));
    // 45 000 Kč (zlatý případ osobni-00): 35 600 Kč.
    await prepis(page, '#gross', '45000');
    over(await cista() === cistyPlat(45000).cista, 'čistý plat: 45 000 → 35 600 Kč', `${await cista()} (zákon ${cistyPlat(45000).cista})`);
    // Strop sociálního pojištění (ČSSZ 2026: 2 350 416 Kč ročně): 250 000 Kč hrubé.
    await prepis(page, '#gross', '250000');
    over(Math.abs(await cista() - cistyPlat(250000).cista) <= 0, 'čistý plat: strop soc. pojištění + 23 %', `${await cista()} (zákon ${cistyPlat(250000).cista})`);
    over(/15 % \+ 23 % nad 146 901 Kč/.test(await textQa(page, 'sazba')), 'čistý plat: sazba „15 % + 23 % nad 146 901 Kč“ (N12)');
    // N14: zaokrouhlení – 22 450 Kč: základ daně 22 500, soc. 1 594 (1 593,95 nahoru).
    await prepis(page, '#gross', '22450');
    over(await cista() === cistyPlat(22450).cista, 'čistý plat: zákonné zaokrouhlení (22 450)', `${await cista()} (zákon ${cistyPlat(22450).cista})`);
    // V11: pracující důchodce 30 000 → soc. 180 Kč = 0,6 %, štítek „0,6 %“.
    await prepis(page, '#gross', '30000');
    await page.getByText('Pracující', { exact: false }).first().locator('xpath=ancestor::label//input').check();
    const stitek = await textQa(page, 'soc-stitek');
    over(/0,6 %/.test(stitek) && cislo(await textQa(page, 'soc')) === 180 && await cista() === cistyPlat(30000, { duchodce: true }).cista,
      'čistý plat: důchodce – štítek 0,6 %, 180 Kč', `${stitek}, ${await cista()}`);
    await page.getByText('Pracující', { exact: false }).first().locator('xpath=ancestor::label//input').uncheck();
    // S24: 15 000 Kč pod minimální mzdou bez výjimky → doplatek 13,5 % × 7 400 = 999 Kč; s výjimkou bez doplatku.
    await prepis(page, '#gross', '15000');
    over(await cista() === cistyPlat(15000).cista && cislo(await textQa(page, 'doplatek')) === 999, 'čistý plat: 15 000 → doplatek zdravotního 999 Kč', `${await cista()} (zákon ${cistyPlat(15000).cista})`);
    await page.locator('#min-vyjimka').check();
    over(await cista() === cistyPlat(15000, { vyjimka: true }).cista, 'čistý plat: 15 000 s výjimkou → bez doplatku', `${await cista()}`);
    // S23 + bonus: 11 200 Kč, 2 děti, výjimka → bonus 3 127 Kč; procenta odvodů bez bonusu (ne „−16,3 %“).
    await prepis(page, '#gross', '11200');
    await page.getByText('Uplatňuji daňové zvýhodnění na děti').click();
    await prepis(page, '#children', '2');
    const odv = await textQa(page, 'odvody-pct');
    const ocek = cistyPlat(11200, { deti: [1267, 1860], vyjimka: true });
    over(await cista() === ocek.cista && /pojistné \+ daň, \d+,\d % z hrubé/.test(odv) && !/[−-]\d/.test(odv), 'čistý plat: bonus 3 127 Kč, procenta odvodů bez bonusu (S23)', `${await cista()} (zákon ${ocek.cista}); ${odv}`);
    await page.locator('#min-vyjimka').uncheck();
    // N13: 25 400 Kč, 1 dítě → bonus by byl 27 Kč (< 50 Kč) → nevyplácí se.
    await prepis(page, '#children', '1');
    await prepis(page, '#gross', '25400');
    const o13 = cistyPlat(25400, { deti: [1267] });
    over(await cista() === o13.cista && (await page.locator('[data-qa="bonus-pod-50"]').count()) > 0, 'čistý plat: bonus 27 Kč se nevyplácí (§ 35d odst. 4)', `${await cista()} (zákon ${o13.cista})`);
    await prepis(page, '#gross', '');
    over((await page.locator('[data-vysledek-chybi]').count()) > 0, 'čistý plat: prázdná mzda → „—“');
  },
  async '/kurzovy-dopad'(page) {
    await prepis(page, '#usdAlloc', '60,5');
    over(await pole(page, '#usdAlloc') === '60,5', 'kurzový dopad: „60,5“ zůstane 60,5');
    await prepis(page, '#usdAlloc', '60');
    const t = await textStranky(page);
    if (/\d\.\d %/.test(t)) chyba('kurzový dopad: formát', 'desetinná tečka v procentech');
    else if (/(^|\s)-\d/.test(t)) chyba('kurzový dopad: formát', 'spojovník místo minus');
    else ok('kurzový dopad: české formátování čísel');
    if (/pravděpodobn/i.test(t) && /\b(15|20|30) %\s*\n/.test(t)) chyba('kurzový dopad', 'pravděpodobnosti scénářů bez zdroje');
    else ok('kurzový dopad: bez pravděpodobností scénářů');
    // V7: kolísavost z ČNB 1/1999–9/2026 (nezávisle Python: USD 11,35 %, EUR 5,14 %, korelace 0,61).
    const [su, se, k] = [0.1135, 0.0514, 0.61];
    const varOcek = (u, e) => { const wu = u / (u + e), we = e / (u + e); return (u + e) * Math.sqrt((wu * su) ** 2 + (we * se) ** 2 + 2 * wu * we * su * se * k) * 1.65; };
    const v1 = cislo(await textQa(page, 'kurz-var'));
    over(Math.abs(v1 - varOcek(600000, 300000)) <= 1, 'kurzový dopad: VaR 60/30/10 z kurzů ČNB', `${v1} (čekáno ${Math.round(varOcek(600000, 300000))}; dřív 146 038)`);
    await prepis(page, '#usdAlloc', '0');
    await prepis(page, '#eurAlloc', '100');
    await prepis(page, '#czkAlloc', '0');
    const v2 = cislo(await textQa(page, 'kurz-var'));
    over(Math.abs(v2 - 1_000_000 * se * 1.65) <= 1, 'kurzový dopad: VaR 100 % EUR = 84 810 Kč', `${v2} (dřív 132 000)`);
    const t2 = await textStranky(page);
    over(/ČNB/.test(await textQa(page, 'kurz-predpoklad')) && /data k \d/.test(await textQa(page, 'kurz-predpoklad')), 'kurzový dopad: kolísavost se zdrojem a datem');
    over(!/kurzové riziko zmírňují/.test(t2) && !/23,5|25,2/.test(t2), 'kurzový dopad: bez „pravidelné nákupy kurzové riziko zmírňují“ (S27)');
  },
  async '/monte-carlo'(page) {
    const t = await textStranky(page);
    if (/Výsledky v korunách/.test(t) || /v přepočtu na koruny/.test(t)) chyba('Monte Carlo: měna', 'tvrdí „v korunách“, počítá v USD');
    else if (/bez vlivu kurzu/i.test(t)) ok('Monte Carlo: uvádí dolarové výnosy bez kurzu koruny');
    else chyba('Monte Carlo: měna', 'chybí upozornění na USD / kurz');
    const pr = await textQa(page, 'mc-predpoklady');
    over(/z historie 11\/2007–9\/2026, data k 30\. 9\. 2026/.test(pr), 'Monte Carlo: předpoklady s obdobím a datem (V3)', pr.slice(0, 80));
    await prepis(page, '#mc-initial', '100000');
    await page.getByRole('button', { name: /Spustit simulaci/ }).click();
    await page.getByText('Pravděpodobnostní pásma vývoje portfolia').waitFor({ timeout: 30000 }).catch(() => {});
    // Výchozí 60/40, 100 000 + 5 000 měsíčně, 20 let, cíl 3 mil. Nezávislý numpy model (200 000 cest, předpoklady
    // z historie ETF): p5 1,61 / medián 2,71 / p95 4,77 mil., šance 38 %; tolerance = 3 sm. odchylky při 600 scénářích.
    const mil = (s) => { const x = norm(s); return /mil\./.test(x) ? Number(x.replace(/[^\d,]/g, '').replace(',', '.')) * 1e6 : cislo(x); };
    const [p5, p50, p95] = [mil(await textQa(page, 'mc-p5')), mil(await textQa(page, 'mc-p50')), mil(await textQa(page, 'mc-p95'))];
    const sance = cislo(await textQa(page, 'mc-sance'));
    over(Math.abs(p5 - 1_608_685) <= 175_000 && Math.abs(p50 - 2_714_818) <= 180_000 && Math.abs(p95 - 4_768_609) <= 480_000 && Math.abs(sance - 38.2) <= 6,
      'Monte Carlo: percentily proti nezávislému modelu', `${p5} / ${p50} / ${p95}, šance ${sance} %`);
    over(/mil\. Kč$/.test(await textQa(page, 'mc-p50')), 'Monte Carlo: 2 platné číslice (S22)', await textQa(page, 'mc-p50'));
  },
  async '/investicni-kalkulacka'(page) {
    // N2 (upraveno 23. 10. 2026): výchozí 100 000 + 5 000 měsíčně, 7 %, 20 let (zlatý případ investicni-00: 2 938 998,75)
    // → 3 platné číslice 2 940 000.
    over(cislo(await textQa(page, 'invest-vysledek')) === 2_940_000, 'investiční: výsledek modelu na 3 platné číslice', await textQa(page, 'invest-vysledek'));
    // N2 regrese: 500 Kč měsíčně, 7 %, 1 rok = anuita splatná předem 6 225,15 Kč → „6 200 Kč“ a výnos +200 Kč (dřív „6 000“ a „+0“).
    await prepis(page, '#initial', '0');
    await prepis(page, '#recurring', '500');
    await prepis(page, '#period', '1');
    const maly = await textQa(page, 'invest-vysledek');
    const vynosMaly = norm(await page.locator('[data-sekce="kalk-vysledek"]').first().innerText()).match(/Výnos\s+\+([\d ]+) Kč/)?.[1];
    over(cislo(maly) === 6200 && cislo(vynosMaly ?? '') === 200, 'investiční: malá částka nevynuluje výnos (6 200 Kč, +200 Kč)', `${maly}, výnos +${vynosMaly}`);
    await prepis(page, '#recurring', '5000');
    await prepis(page, '#period', '20');
    await prepis(page, '#initial', '');
    over((await page.locator('[data-vysledek-chybi]').count()) > 0, 'investiční: prázdný vklad → „—“');
    await prepis(page, '#initial', '100000');
    await prepis(page, '#return', '7,5');
    over(await pole(page, '#return') === '7,5', 'investiční: výnos „7,5“');
    // S6: prázdný výnos → žádné „100 000 Kč při 0 % ročně“; prázdná daň → „—“, ne „0 %“.
    await prepis(page, '#return', '');
    over(!/při 0 % ročně/.test(await textQa(page, 'slozene-priklad')), 'investiční: prázdný výnos → bez „při 0 % ročně“', await textQa(page, 'slozene-priklad'));
    await prepis(page, '#return', '7');
    const danSouhrn = page.locator('summary', { hasText: 'Daň z výnosů' }).first();
    await danSouhrn.click();
    await prepis(page, '#tax', '');
    await danSouhrn.click();
    const souhrn = norm(await danSouhrn.innerText());
    over(/—/.test(souhrn) && !/0 %/.test(souhrn), 'investiční: prázdná daň → „—“', souhrn);
  },
  async '/stroj-casu'(page) {
    // V1: „5000,5“ v poli pro celé koruny → hláška + „—“ (dřív tiché zaokrouhlení na 5 001).
    await prepis(page, '#sc-mesicne', '5000,5');
    over(await pole(page, '#sc-mesicne') === '5000,5' && (await page.locator('[data-cislo-hlaska="necele"]').count()) > 0 && (await page.locator('[data-vysledek-chybi]').count()) > 0,
      'stroj času: „5000,5“ → hláška a „—“', await pole(page, '#sc-mesicne'));
    // S7: psaní 2 000 000 (nad max. 1 000 000) → hláška „Mimo rozsah“ a žádný výsledek z 0; po Enteru ořez s hláškou.
    await prepis(page, '#sc-mesicne', '2000000', { opustit: false });
    const t1 = await textStranky(page);
    over(/Mimo rozsah 0–1 000 000 Kč/.test(t1) && !/Dnes byste měli/.test(t1), 'stroj času: 2 000 000 při psaní → hláška, bez výsledku');
    await page.locator('#sc-mesicne').press('Enter');
    await page.waitForTimeout(200);
    over(await pole(page, '#sc-mesicne') === '1 000 000' && /Upraveno do povoleného rozsahu/.test(await textStranky(page)), 'stroj času: po Enteru ořez na 1 000 000 s hláškou');
    // V1: „15.000“ = 15 000.
    await prepis(page, '#sc-mesicne', '15.000');
    over(await pole(page, '#sc-mesicne') === '15 000' && /Dnes byste měli/.test(await textStranky(page)), 'stroj času: „15.000“ = 15 000 Kč');
  },
  async '/backtest'(page) {
    // V1: „1.000“ = 1 000 (zlatý případ backtest-43; dřív 1 Kč a vloženo 250 261 Kč).
    await prepis(page, '#bt-contrib', '1.000');
    over(await pole(page, '#bt-contrib') === '1 000', 'backtest: „1.000“ = 1 000', await pole(page, '#bt-contrib'));
    // Pole s „prázdné = 0“: neplatné „5000,5“ se smaže (pole ukáže zástupnou 0 = počítá se s 0), žádné tiché 5 001.
    await prepis(page, '#bt-initial', '5000,5');
    over(await pole(page, '#bt-initial') === '', 'backtest: „5000,5“ → pole prázdné (0), ne 5 001', await pole(page, '#bt-initial'));
  },
  async '/kde-koupit'(page) {
    if (!(await page.locator('#naklady-castka').count())) { ok('kde koupit: pole částky není (bez kurzu ČNB)'); return; }
    // V1: „100.000“ = 100 000 (zlatý případ naklady-17; dřív výpočet pro 100 Kč).
    await prepis(page, '#naklady-castka', '100.000');
    over(await pole(page, '#naklady-castka') === '100 000', 'kde koupit: „100.000“ = 100 000 Kč', await pole(page, '#naklady-castka'));
    await prepis(page, '#naklady-castka', '2000,5');
    over(await pole(page, '#naklady-castka') === '2000,5' && /Zadejte částku od 100/.test(await textStranky(page)), 'kde koupit: „2000,5“ → bez výpočtu, výzva k částce', await pole(page, '#naklady-castka'));
  },
};

const vyber = process.env.JEN ? process.env.JEN.split(',') : Object.keys(TESTY);
for (const [jmeno, typ] of PROHLIZECE) {
  prohlizec = jmeno;
  const browser = await typ.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: typ !== webkit ? true : undefined, locale: 'cs-CZ' });
  // Analytiku NIKDY nepouštět – test by kazil měření návštěvnosti (blokace v KAŽDÉM kontextu).
  await ctx.route(/googletagmanager\.com|google-analytics\.com|\/api\/ev(\?|$)/, (r) => r.abort());
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
}
const spatne = vysledky.filter((v) => !v.ok).length;
console.log(`\n${vysledky.length - spatne}/${vysledky.length} OK`);
process.exit(spatne ? 1 : 0);
