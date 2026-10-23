#!/usr/bin/env node
/**
 * ZLATÉ PŘÍPADY NÁSTROJŮ – denní test na produkci (pravidlo č. 1, bod 4: každá chyba = oprava + automatická kontrola).
 *
 * Proč: audit 22. 10. 2026 (nezávislý tým) našel v kalkulačkách chyby, které roky vypadaly „věrohodně“
 * (FIRE střed simulace, /pruvodce r − TER, tečka v číselném poli = desetinná čárka, faktorové ETF s dvojím TER…).
 * Majitel nařídil, aby se nástroje ověřovaly denně automaticky. Tenhle skript projde VŠECHNY zlaté případy
 * ze scripts/data/zlate-pripady.json (vstupy → očekávaná hodnota → tolerance → zdroj nezávislého ověření)
 * na živém webu v prohlížeči (Chromium 1440 px i WebKit iPhone 13) a přes API backtestu.
 *
 * Očekávané hodnoty NIKDY nepočítáme kódem webu (to je kruh) – jsou z nezávislého přepočtu auditorů
 * (Python, Yahoo × ČNB, ceníky brokerů, ČSÚ…). Jedinou výjimkou je kalkulačka nákladů: když se změní kurz ČNB,
 * očekávání se přepočítá ze vzorců v poli `vzorce` (ceníky brokerů) a kurzem stáhnutým PŘÍMO z ČNB.
 *
 * VYHODNOCENÍ (stav případu):
 *   OK        – všechny kontroly v bráně sedí.
 *   SELHALO   – neshoda v bráně → POPLACH (exit 1 → e-mail z GitHub Actions).
 *   VAROVÁNÍ  – neshoda jen u klíčů `jen_varovani_klice`, u regresní (seedové) shody Monte Carla nebo u hodnoty
 *               závislé na datu, když stránka už ukazuje novější data než zlatý případ (pak branou je konzistence).
 *   XFAIL     – případ má `dnes_selze` (chyba je potvrzená, oprava zatím není venku) a dnes selhal = očekávané.
 *   XPASS     – případ má `dnes_selze`, ale prošel → upozornění „chyba opravena? po ověření na produkci odeber příznak“.
 *   `dnes_selze.opraveno` (oprava je v repu, hodnota nezávisle ověřená, čeká na nasazení): proti PRODUKCI dál XFAIL/XPASS
 *               (stará produkce nesmí dělat poplach), proti lokálu/náhledu (jiný host než etfpruvodce.cz) se případ
 *               vyhodnotí PŘÍSNĚ jako normální (selhání = SELHALO) – lokální build tak opravu opravdu hlídá.
 *               Po nasazení produkce hlásí XPASS „oprava v repu … po nasazení odeber dnes_selze“; pak příznak smaž celý.
 *   NEOVĚŘENO – případ se nedal vyhodnotit (např. vyčerpaný limit volání API) → varování.
 * Kromě toho se na každé navštívené stránce nástroje hledají zakázané texty (undefined, NaN, „ a lety“, „za 2 let“…).
 *
 * SPUŠTĚNÍ:
 *   node scripts/zlate-kalkulacky.mjs [base-url]          (výchozí https://etfpruvodce.cz)
 *   PROHLIZECE=chromium node scripts/zlate-kalkulacky.mjs http://localhost:3005
 *   JEN=fire-,osobni-1 node scripts/zlate-kalkulacky.mjs  (jen případy, jejichž id začíná některou předponou)
 *   VYSTUP_JSON=vysledky.json …                           (uloží podrobné výsledky)
 * Měření (GA, Vercel Analytics/Speed Insights, /api/ev) se VŽDY blokuje – test nesmí kazit statistiky návštěvnosti.
 * POST /api/backtest/simulate nejvýš MAX_API (25) přímých volání za běh (free tier Vercelu: CPU).
 * ISR (rozhodnutí majitele 23. 10. 2026, scripts/lib/cil.mjs): případy otevírají jen statické stránky a předgenerované
 * detaily (3 ISINy). Next.js v produkci ale sám přednačítá viditelné odkazy na detaily fondů (kvíz, náklady…) – každý
 * nový = ISR zápis. V produkčním režimu se prefetch detailů/dvojic mimo pevnou sadu v každém kontextu blokuje
 * a navigace mimo ni je poplach („kontrola by zapisovala do ISR“).
 */
import { chromium, webkit, devices } from 'playwright';
import { vytvorRezim } from './lib/cil.mjs';
import { readFileSync, appendFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ADRESAR = path.dirname(fileURLToPath(import.meta.url));
const BASE = (process.argv[2] || process.env.BASE_URL || 'https://etfpruvodce.cz').replace(/\/$/, '');
/** Běží test proti ostrému webu? (dnes_selze.opraveno: produkce = XFAIL/XPASS, jinde přísně) */
const PRODUKCE = /(^|\.)etfpruvodce\.cz$/.test(new URL(BASE).hostname);
/** ISR režim (scripts/lib/cil.mjs): na produkci jen pevná sada dynamických stránek (NUTIT_PRODUKCNI_REZIM=1 = zkouška proti lokálu). */
const REZIM = vytvorRezim(BASE, 'zlate-kalkulacky');
REZIM.hlidejFetch();
const JEN = process.env.JEN ? process.env.JEN.split(',').map((s) => s.trim()).filter(Boolean) : null;
const PROHLIZECE = (process.env.PROHLIZECE || 'chromium,webkit').split(',').map((s) => s.trim());
const MAX_API = Number(process.env.MAX_API || 25);
const DATA = JSON.parse(readFileSync(path.join(ADRESAR, 'data', 'zlate-pripady.json'), 'utf8'));

/** Měření se blokuje VŽDY (regex ze zadání + Vercel Analytics a Speed Insights, ať test nekazí ani jejich čísla). */
const MERENI = /googletagmanager\.com|google-analytics\.com|\/api\/ev(\?|$)|\/_vercel\/(insights|speed-insights)\//;
/** Zakázané texty na stránkách nástrojů (rozbitá interpolace, špatné skloňování „1 let“ / „za 2 let“). */
const ZAKAZANE = /undefined|NaN|Infinity| a lety|\bza [1-4] let\b|splatnosti 1 let/;
/** Známé chyby textu (potvrzené auditem, oprava zatím není venku) – hlásí se jako XFAIL, ne poplach.
 *  Po opravě a ověření na produkci položku SMAŽ (běh bez nálezu to sám ohlásí jako „odeber“). */
const ZNAME_TEXTY = [
  { vzor: /^za 1 let$/, stranka: '/kalkulacka', chyba: 'N1 skloňování „za 1 let“ – kalkulačka poplatků (FeeCalculatorWidget), SOUHRN auditu 22. 10. 2026' },
  { vzor: /^NaN$/, stranka: '/cisty-plat', chyba: 'prázdná hrubá mzda → „NaN % z hrubé“ (oprava „—“ / VysledekChybi, kolo 8, 22. 10. 2026, čeká na nasazení)' },
  { vzor: /^splatnosti 1 let$/, stranka: '/hypotecni-kalkulacka', chyba: 'N1 skloňování „splatnosti 1 let“ – hypoteční kalkulačka (HypotecniKalkulackaWidget), SOUHRN auditu 22. 10. 2026' },
];
/** Známé vady chování polí, které na produkci zůstávají do nasazení opravy (XFAIL místo poplachu).
 *  Po nasazení a ověření na produkci položku SMAŽ – běh bez nálezu to ohlásí jako „odeber“. */
const ZNAME_VADY = {
  nevyprazdnitelnePole: 'číselné pole nejde vyprázdnit (starý <input type="number">; oprava sdílené komponenty CisloInput 22. 10. 2026 čeká na nasazení)',
};
/** Kotva ČNB pro přepočet nákladů brokerů při jiném kurzu, než měl zlatý případ. */
const CNB_URL = 'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt';

// ───────────────────────────── pomocné funkce: text a čísla ─────────────────────────────

const norm = (s) => String(s ?? '').replace(/[    ]/g, ' ');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const zaokr = (v, d = 4) => (typeof v === 'number' ? Math.round(v * 10 ** d) / 10 ** d : v);

/** Přečte první číslo z textu („2 938 999 Kč“, „−52,8 %“, „4,1 mil. Kč“, „398 tis.“). half = polovina kroku zobrazení. */
function precti(s) {
  if (s == null) return null;
  const t = norm(s);
  const m = t.match(/([+\-−]?)\s?(\d{1,3}(?: \d{3})+|\d+)(?:,(\d+))?(?:\s?(mil\.|mld\.|tis\.))?/);
  if (!m) return null;
  const des = m[3] ? m[3].length : 0;
  const nas = { 'mil.': 1e6, 'mld.': 1e9, 'tis.': 1e3 }[m[4]] || 1;
  let v = Number(m[2].replace(/ /g, '') + (m[3] ? '.' + m[3] : '')) * nas;
  if (m[1] === '-' || m[1] === '−') v = -v;
  return { v, half: 0.5 * 10 ** -des * nas, raw: t.trim().slice(0, 80) };
}
const cislo = (v) => (v == null || Number.isNaN(v) ? null : { v, half: 0, raw: v });

const MESICE = { ledna: 1, února: 2, března: 3, dubna: 4, května: 5, června: 6, července: 7, srpna: 8, září: 9, října: 10, listopadu: 11, prosince: 12 };
const iso = (r, m, d) => `${r}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
/** První datum v textu („21. 10. 2026“ i „21. října 2026“) → ISO. */
function datum(s) {
  if (!s) return null;
  const t = norm(s);
  let m = t.match(/(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})/);
  if (m) return iso(m[3], m[2], m[1]);
  m = t.match(/(\d{1,2})\.\s(ledna|února|března|dubna|května|června|července|srpna|září|října|listopadu|prosince)\s(\d{4})/);
  if (m) return iso(m[3], MESICE[m[2]], m[1]);
  return null;
}
/** Počet pracovních dnů od data do dneška (UTC). */
function pracovnichDnuOd(isoDatum) {
  const d = new Date(`${isoDatum}T00:00:00Z`);
  const dnes = new Date(); dnes.setUTCHours(0, 0, 0, 0);
  let n = 0;
  for (const x = new Date(d); x < dnes; x.setUTCDate(x.getUTCDate() + 1)) {
    const den = x.getUTCDay();
    if (den !== 0 && den !== 6) n++;
  }
  return n;
}
/** Doba „14 let a 7 měsíců“ / „6 měs.“ / „2 roky“ → měsíce. */
function mesicu(s) {
  const t = norm(s);
  const r = t.match(/(\d+)\s*(let|roky|rok)/);
  const m = t.match(/(\d+)\s*(měsíců|měsíce|měsíc|měs\.)/);
  if (!r && !m) return null;
  return (r ? Number(r[1]) * 12 : 0) + (m ? Number(m[1]) : 0);
}

/** Řádek, který ZAČÍNÁ částkou v Kč / procentem (ne vysvětlivka „graf + hodnoty v Kč“). */
const KC = /^(od |≈ ?|~)?[+\-−]?\s?\d[\d ]*(,\d+)?\s?(mil\.|tis\.)?\s?Kč/;
const PCT = /^[+\-−]?\s?\d[\d ]*(,\d+)?\s?%/;
/** Řádky textu bez prázdných. */
const radkyTextu = (text) => norm(text).split('\n').map((l) => l.trim()).filter(Boolean);
/** Hodnota na prvním řádku po štítku (štítek = regex na celý řádek), která odpovídá vzoru hodnoty. */
function poStitku(radky, stitek, vzor = /\d/, { max = 6, od = 0 } = {}) {
  for (let i = od; i < radky.length; i++) {
    if (!stitek.test(radky[i])) continue;
    for (let j = i + 1; j <= i + max && j < radky.length; j++) if (vzor.test(radky[j])) return radky[j];
  }
  return null;
}
const indexRadku = (radky, re, od = 0) => { for (let i = od; i < radky.length; i++) if (re.test(radky[i])) return i; return -1; };

/** Tabulka, jejíž hlavička (první řádek) odpovídá regexu. */
const tabulka = (tabulky, re) => tabulky.find((t) => t.length && re.test(norm(t[0].join(' | '))));
/** Řádek tabulky podle první buňky. */
const radekTab = (tab, re) => tab?.find((r) => r.length && re.test(norm(r[0])));

// ───────────────────────────── kontroly ─────────────────────────────

/** Číselná kontrola. druh: hodnota (zlatá hodnota) | konzistence (vždy brána) | varovani | neovereno. */
function cNum(klic, ocek, skut, tol = 0, { rel = 0, half = true, druh = 'hodnota', pozn } = {}) {
  if (skut == null || skut.v == null || Number.isNaN(skut.v)) return { klic, ocek, skut: null, ok: false, druh, pozn: pozn || 'na stránce nenalezeno' };
  const t = tol + rel * Math.abs(ocek) + (half ? skut.half || 0 : 0);
  return { klic, ocek, skut: zaokr(skut.raw ?? skut.v), ok: Math.abs(skut.v - ocek) <= t + 1e-9, druh, tol: zaokr(t), pozn };
}
function cText(klic, ocek, skut, { druh = 'hodnota', pozn } = {}) {
  if (skut == null) return { klic, ocek, skut: null, ok: false, druh, pozn: pozn || 'na stránce nenalezeno' };
  return { klic, ocek, skut, ok: norm(skut).trim() === norm(ocek).trim(), druh, pozn };
}
const cBool = (klic, ok, popis, { druh = 'hodnota', skut } = {}) => ({ klic, ocek: popis, skut: skut ?? (ok ? 'ano' : 'ne'), ok: !!ok, druh });
const neovereno = (klic, ocek, proc) => ({ klic, ocek, skut: null, ok: true, druh: 'neovereno', pozn: proc });

// ───────────────────────────── prohlížeč ─────────────────────────────

const jsChybyStranky = new WeakMap();

async function otevri(ctx, url) {
  const page = await ctx.newPage();
  const chyby = [];
  page.on('pageerror', (e) => chyby.push(String(e).slice(0, 200)));
  jsChybyStranky.set(page, chyby);
  page.setDefaultTimeout(20000);
  await page.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {}); // WebKit občas „load“ nedokončí (zablokované měření)
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(400);
  return page;
}

/** Snímek stránky: text (main), řádky, tabulky (DOM, i skryté mobilní/desktopové varianty), data-* atributy. */
async function snimek(page) {
  const s = await page.evaluate(() => {
    const root = document.querySelector('main') || document.body;
    const bunka = (td) => (td.innerText || td.textContent || '').replace(/\s+/g, ' ').trim();
    const tabulky = [...root.querySelectorAll('table')].map((t) => [...t.querySelectorAll('tr')].map((tr) => [...tr.children].map(bunka)));
    const atributy = [...root.querySelectorAll('*')].flatMap((e) => {
      const a = [...e.attributes].filter((x) => x.name.startsWith('data-') && !/^data-(sekce|track|state|radix|orientation|slot|side|align)/.test(x.name));
      return a.length ? [{ tag: e.tagName, a: Object.fromEntries(a.map((x) => [x.name, x.value])), text: (e.innerText || '').slice(0, 300) }] : [];
    });
    return { text: root.innerText, telo: document.body.innerText, tabulky, atributy };
  });
  s.text = norm(s.text);
  s.telo = norm(s.telo);
  s.radky = radkyTextu(s.text);
  s.tabulky = s.tabulky.map((t) => t.map((r) => r.map(norm)));
  return s;
}
const atribut = (s, jmeno, filtr = () => true) => s.atributy.find((x) => x.a[jmeno] !== undefined && filtr(x))?.a[jmeno];
/** Text prvku s data-qa (stabilní háček widgetů; null, když ho build ještě nemá). */
const qa = (s, jmeno) => s.atributy.find((x) => x.a['data-qa'] === jmeno)?.text ?? null;

/** Zakázané texty v aktuálním stavu stránky (celé tělo) → [{ ukazka, znama }]. */
async function zakazaneTexty(page, url) {
  const t = norm(await page.evaluate(() => document.body.innerText));
  const nalezy = [];
  for (const m of t.matchAll(new RegExp(ZAKAZANE.source, 'g'))) {
    const ukazka = `„${t.slice(Math.max(0, m.index - 50), m.index + 40).replace(/\s+/g, ' ')}“`;
    const znama = ZNAME_TEXTY.find((z) => url.startsWith(z.stranka) && z.vzor.test(m[0]));
    nalezy.push({ ukazka, znama });
  }
  return nalezy;
}

/** Vyprázdní pole jako uživatel (dotyk/klik, označit vše, smazat) a napíše hodnotu po znacích (jako prepis() v qa-kalkulacky.mjs). */
async function prepis(page, sel, hodnota, { opustit = true } = {}) {
  const el = typeof sel === 'string' ? page.locator(sel).first() : sel;
  // Pole ve sbaleném <details> (např. daň v investiční kalkulačce) – rozbalit jako uživatel.
  if (!(await el.isVisible())) {
    const souhrn = el.locator('xpath=ancestor::details[1]/summary');
    if (await souhrn.count()) await klikni(page, souhrn.first());
  }
  await el.scrollIntoViewIfNeeded();
  if (page.dotyk) await el.tap(); else await el.click();
  await el.press('ControlOrMeta+a');
  await el.press('Backspace');
  const prazdne = await el.inputValue();
  if (prazdne !== '') {
    // Pole nejde vyprázdnit (starý řízený <input type="number"> – oprava CisloInput 22. 10. 2026). Když je to známá
    // nenasazená vada (ZNAME_VADY), zapíše se jako XFAIL a hodnota se napíše přes označený obsah, jinak chyba = poplach.
    const jmeno = typeof sel === 'string' ? sel : 'pole';
    if (!ZNAME_VADY.nevyprazdnitelnePole || String(hodnota) === '') throw new Error(`pole ${jmeno} nejde vyprázdnit (zůstalo „${prazdne}“)`);
    page.vady?.push(`pole ${jmeno} nejde vyprázdnit (zůstalo „${prazdne}“)`);
    await el.press('ControlOrMeta+a');
  }
  if (String(hodnota) !== '') await el.pressSequentially(String(hodnota), { delay: 15 });
  if (opustit) await el.press('Enter');
  await page.waitForTimeout(150);
}
/** Posuvník (input type=range) – React poslouchá událost input, nativní setter. */
async function posuvnik(page, sel, hodnota) {
  await page.locator(sel).first().evaluate((el, v) => {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    set.call(el, String(v));
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, hodnota);
  await page.waitForTimeout(150);
}
async function klikni(page, loc) {
  await loc.scrollIntoViewIfNeeded();
  if (page.dotyk) await loc.tap(); else await loc.click();
}
const tlacitko = (page, nazev) => page.getByRole('button', { name: new RegExp('^' + esc(nazev)) }).first();
async function cekejNaText(page, re, timeout = 30000) {
  const zdroj = re.source, flags = re.flags;
  await page.waitForFunction(([z, f]) => new RegExp(z, f).test((document.querySelector('main') || document.body).innerText.replace(/[  ]/g, ' ')), [zdroj, flags], { timeout });
}

// ───────────────────────────── API backtestu ─────────────────────────────

let apiVolani = 0;
const apiCache = new Map();
async function apiBacktest(telo) {
  const klic = JSON.stringify(telo);
  if (apiCache.has(klic)) return apiCache.get(klic);
  if (apiVolani >= MAX_API) return { limit: true };
  apiVolani++;
  const p = (async () => {
    const r = await fetch(BASE + '/api/backtest/simulate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: klic });
    const json = await r.json().catch(() => null);
    return { status: r.status, json };
  })();
  apiCache.set(klic, p);
  return p;
}
/** Tolerance z textu případu backtestu: „±0,6 % (…)“ → 0.006 relativně u NAV, „±0,07 p. b.“ → 0.07, „přesně“ → 0. */
function tolBacktest(pripad, klic) {
  const t = pripad.tolerance?.[klic];
  if (t == null) return null;
  if (/přesně/.test(t)) return 0;
  const m = norm(t).match(/±\s?([\d,]+)/);
  return m ? Number(m[1].replace(',', '.')) : null;
}

// ───────────────────────────── kurz ČNB a model nákladů brokerů ─────────────────────────────

const kurzyCnb = new Map();
async function kurzCnb(isoDatum) {
  if (kurzyCnb.has(isoDatum)) return kurzyCnb.get(isoDatum);
  const [r, m, d] = isoDatum.split('-');
  const p = fetch(`${CNB_URL}?date=${d}.${m}.${r}`).then((x) => x.text()).then((t) => {
    const kurz = (kod) => { const l = t.split('\n').find((x) => x.split('|')[3] === kod); if (!l) return null; const c = l.split('|'); return Number(c[4].replace(',', '.')) / Number(c[2]); };
    const eur = kurz('EUR'), usd = kurz('USD');
    return eur && usd ? { eur, usd, datum: isoDatum, hlavicka: t.split('\n')[0] } : null;
  }).catch(() => null);
  kurzyCnb.set(isoDatum, p);
  return p;
}
/** Nezávislý model nákladů z ceníků (vzorce zlatých případů, NE kód webu). [za nákup, za rok] v Kč. */
function modelNakladu(kc, eur, usd) {
  const t212 = 0.0015 * kc, xtb = 0.005 * kc, degiro = 1 * eur;
  const ibkrProv = Math.max((0.0005 * kc) / eur, 1.25) * eur;
  const kcEur = kc / eur;
  const fioEur = kcEur <= 1400 ? 3.95 : kcEur <= 3000 ? 4.95 : Math.max(0.0015 * kcEur, 6.95);
  return {
    trading212: [t212, 12 * t212], xtb: [xtb, 12 * xtb], degiro: [degiro, 12 * degiro],
    ibkr: [ibkrProv + Math.max(0.00002 * kc, 2 * usd), 12 * ibkrProv + Math.max(0.00002 * 12 * kc, 2 * usd)],
    fio: [fioEur * eur, 12 * fioEur * eur],
  };
}
const nejlevnejsi = (model) => Object.entries(model).sort((a, b) => a[1][0] - b[1][0])[0][0];

/** Kurz, se kterým stránka počítá (datum z textu „kurzu ČNB k …“), stažený přímo z ČNB. */
async function kurzStranky(text, pripad) {
  const d = datum(text.match(/kurz\S* ČNB k (\d{1,2}\. ?\d{1,2}\. ?\d{4})/)?.[1] || '');
  const zlaty = pripad.vstupy?.kurz_CNB;
  if (zlaty && d === zlaty.datum) return { eur: zlaty.eurCzk, usd: zlaty.usdCzk, datum: d, shoda: true };
  if (!d) return zlaty ? { eur: zlaty.eurCzk, usd: zlaty.usdCzk, datum: null, shoda: false, pozn: 'datum kurzu na stránce nenalezeno' } : null;
  const k = await kurzCnb(d);
  if (!k) return zlaty ? { eur: zlaty.eurCzk, usd: zlaty.usdCzk, datum: d, shoda: false, pozn: 'kurz ČNB se nepodařilo stáhnout' } : null;
  return { ...k, shoda: true, prepocet: true };
}

// ───────────────────────────── řidiče případů ─────────────────────────────
// Každý řidič vrací { kontroly: [...], datum: ISO|null (k jakému dni platí data na stránce), stranky: [page] }.

const R = {};

/** Krok zobrazení výsledku modelu investiční kalkulačky (specifikace opravy N2 z 23. 10. 2026, nezávisle na kódu webu):
 *  3 platné číslice, pod 100 000 Kč na stovky. Tolerance = polovina kroku (+1 Kč na zaokrouhlení vstupu). */
const krokModelu = (v) => (Math.abs(v) < 100000 ? 100 : 10 ** (String(Math.floor(Math.abs(v))).length - 3));
const tolModelu = (v) => krokModelu(v) / 2 + 1;

/* Investiční kalkulačka – vstupy */
async function investicniVstupy(page, v) {
  await page.selectOption('select[aria-label="Frekvence pravidelného vkladu"]', v.frekvence);
  await prepis(page, '#initial', v['#initial']);
  await prepis(page, '#recurring', v['#recurring']);
  await prepis(page, '#return', v['#return (psát jako text)']);
  await prepis(page, '#period', v['#period']);
  await prepis(page, '#tax', v['#tax']);
  await page.waitForTimeout(300);
}
/* Regrese N2 (investicni-41/42): malé částky – výnos se nesmí vynulovat, roční výnos nesmí být záporný,
   „vloženo + výnos = zobrazená hodnota“ ve velkém čísle i v každém řádku tabulky. */
R.investicniMale = async (p, env) => {
  const page = await env.nova(p.url);
  await investicniVstupy(page, p.vstupy);
  const s = await snimek(page);
  const o = p.ocekavano, k = [];
  const hodnota = precti(qa(s, 'invest-vysledek'));
  const vlozeno = precti(poStitku(s.radky, /^Vloženo$/, KC));
  const vynos = precti(poStitku(s.radky, /^Výnos( po dani)?$/, /^[+−-]?\s?\d/, { max: 1 }));
  k.push(cNum('Za N let byste měli (Kč)', o['Za N let byste měli (Kč)'], hodnota, tolModelu(o['Za N let byste měli (Kč)'])));
  k.push(cNum('Vloženo (Kč)', o['Vloženo (Kč)'], vlozeno, 0));
  k.push(cNum('Výnos (Kč)', o['Výnos (Kč)'], vynos, tolModelu(o['Za N let byste měli (Kč)'])));
  if (o['Výnos (Kč)'] > 0) k.push(cBool('výnos > 0', vynos?.v > 0, 'kladný výnos (skutečně ' + o['Výnos (Kč)'] + ' Kč)', { skut: vynos?.raw }));
  k.push(cBool('vloženo + výnos = výsledek', hodnota && vlozeno && vynos && vlozeno.v + vynos.v === hodnota.v, 'součet sedí', { druh: 'konzistence', skut: `${vlozeno?.v} + ${vynos?.v} vs ${hodnota?.v}` }));
  const veta = s.text.match(/z toho bude ([\d ]+) Kč/);
  k.push(cBool('věta „z toho bude“ = výsledek', veta && precti(veta[1])?.v === hodnota?.v, 'stejné číslo jako velký výsledek', { druh: 'konzistence', skut: veta?.[1] }));
  if (o['podíl výnosu (%)'] !== undefined) k.push(cNum('podíl výnosu (%)', o['podíl výnosu (%)'], precti(s.text.match(/(\d+) % konečné částky tvoří výnos/)?.[1]), 0.5, { half: false }));
  if (o['V dnešních cenách při 2 % (Kč)'] !== undefined) k.push(cNum('V dnešních cenách při 2 % (Kč)', o['V dnešních cenách při 2 % (Kč)'], precti(s.text.match(/V dnešních cenách[^\n]*?zhruba ([\d ]+) Kč/)?.[1]), tolModelu(o['V dnešních cenách při 2 % (Kč)']), { half: false }));
  const tab = tabulka(s.tabulky, /^Rok \| Vloženo/);
  for (const r of o.tabulka || []) {
    const row = tab?.find((x) => x[0] === `${r.rok}.`);
    const [vl, zaRok, celkem, hod] = (row || []).slice(1).map(precti);
    k.push(cNum(`rok ${r.rok}: výnos za rok`, r.vynos_za_rok, zaRok, tolModelu(r.vynos_za_rok), { half: false }));
    k.push(cBool(`rok ${r.rok}: výnos za rok ≥ 0`, zaRok && zaRok.v >= 0, '≥ 0 Kč', { skut: zaRok?.raw }));
    k.push(cNum(`rok ${r.rok}: hodnota`, r.hodnota, hod, tolModelu(r.hodnota), { half: false }));
    k.push(cBool(`rok ${r.rok}: vloženo + výnos celkem = hodnota`, vl && celkem && hod && vl.v + celkem.v === hod.v, 'součet sedí', { druh: 'konzistence', skut: `${vl?.v} + ${celkem?.v} vs ${hod?.v}` }));
  }
  return { stranky: [page], kontroly: k };
};
R.investicniKalk = async (p, env) => {
  const page = await env.nova(p.url);
  await investicniVstupy(page, p.vstupy);
  const s = await snimek(page);
  const o = p.ocekavano, t = p.tolerance;
  const dnes = s.text.match(/V dnešních cenách[^\n]*?zhruba ([\d ]+) Kč/);
  const oDnes = o['V dnešních cenách při 2 % (Kč)'] ?? o['V dnešních cenách při 2 % (Kč, na tisíce)'];
  // „56 % konečné částky tvoří výnos“; při nulovém výnosu věta chybí → podíl z „Výnos +0 Kč“ / výsledku
  const podilVeta = s.text.match(/(\d+) % konečné částky tvoří výnos/);
  const vynosKc = precti(poStitku(s.radky, /^Výnos( po dani)?$/, /^[+−-]?\s?\d/, { max: 1 }));
  const vysledekKc = precti(qa(s, 'invest-vysledek')) || precti(poStitku(s.radky, /^Za .+ byste měl/, KC));
  const podil = podilVeta || (vynosKc && vysledekKc?.v ? [null, String(Math.round((vynosKc.v / vysledekKc.v) * 100))] : null);
  return {
    stranky: [page],
    kontroly: [
      // Výsledky modelu: 3 platné číslice, pod 100 000 Kč na stovky (N2 upraveno 23. 10. 2026) → ± polovina kroku.
      cNum('Za N let byste měli (Kč)', o['Za N let byste měli (Kč)'], precti(qa(s, 'invest-vysledek')) || precti(poStitku(s.radky, /^Za .+ byste měl/, KC)), tolModelu(o['Za N let byste měli (Kč)'])),
      cNum('Vloženo (Kč)', o['Vloženo (Kč)'], precti(poStitku(s.radky, /^Vloženo$/, KC)), 0),
      cNum('V dnešních cenách při 2 % (Kč)', oDnes, precti(dnes?.[1]), tolModelu(oDnes), { half: false }),
      // Podíl dopočtený z „Výnos“ / „Za N let“ (věta chybí, když zobrazený výnos je 0) nese chybu zaokrouhlení
      // → tolerance v p. b. = 100 × polovina kroku / výsledek.
      cNum('podíl výnosu (%)', o['podíl výnosu (%)'], precti(podil?.[1]), !podilVeta && vysledekKc?.v ? Math.max(t['%'], Math.ceil((100 * tolModelu(o['Za N let byste měli (Kč)'])) / vysledekKc.v)) : t['%'], { half: false }),
    ],
  };
};

/* Investiční kalkulačka – rychlé volby (historický výnos trhu v Kč) */
R.rychleVolby = async (p, env) => {
  const s = await env.staticka('/investicni-kalkulacka');
  const stitek = { 'investicni-37': /^S&P 500$/, 'investicni-38': /^Celý svět$/, 'investicni-39': /^60\/40$/ }[p.id];
  const dm = s.text.match(/Průměrný roční výnos trhu v Kč, [^\n]*?– ([^\n(]*\d{4})/);
  return {
    datum: datum(dm?.[1]),
    kontroly: [cNum('CAGR %', p.ocekavano['CAGR %'], precti(poStitku(s.radky, stitek, /%$/, { max: 2 })), p.tolerance['p.b.'])],
  };
};

/* Investiční kalkulačka – karta „A jak by to dopadlo doopravdy?“ */
R.doopravdy = async (p, env) => {
  const s = await env.staticka('/investicni-kalkulacka');
  const i = s.text.indexOf('doopravdy?');
  const t = i >= 0 ? s.text.slice(i) : '';
  const o = p.ocekavano, rel = p.tolerance['relativně'], pb = p.tolerance['%'];
  const hodnota = t.match(/\n\s*([\d ]+ Kč)\s*\n/);
  const vlozeno = t.match(/Vloženo ([\d ]+) Kč/);
  const xirr = t.match(/zhodnocovaly ([\d,]+) % ročně/);
  const propad = t.match(/Největší propad ([−-][\d,]+) % \((\d+\/\d{4}) → (\d+\/\d{4})\)/);
  const navrat = t.match(/vrátila v (\d+\/\d{4})/);
  return {
    datum: datum(t.match(/Data k ([^\n,]*\d{4})/)?.[1]),
    kontroly: [
      cNum('hodnota', o.hodnota, precti(hodnota?.[1]), 0, { rel }),
      cNum('vloženo', o['vloženo'], precti(vlozeno?.[1]), 0),
      cNum('XIRR %', o['XIRR %'], precti(xirr?.[1]), pb),
      cNum('max. propad %', o['max. propad %'], precti(propad?.[1]), pb),
      cText('vrchol→dno', o['vrchol→dno'], propad ? `${propad[2]} → ${propad[3]}` : null),
      cText('návrat', o['návrat'], navrat?.[1] ?? null),
    ],
  };
};

/* Kalkulačka poplatků */
R.poplatkyKalk = async (p, env) => {
  const page = await env.nova('/kalkulacka');
  for (const pole of ['#initial', '#monthly', '#period', '#return', '#etf-ter', '#active-ter']) await prepis(page, pole, p.vstupy[pole]);
  await page.waitForTimeout(300);
  const s = await snimek(page);
  const od = indexRadku(s.radky, /^PARAMETRY SROVNÁNÍ$/i);
  const levny = poStitku(s.radky, /^Konečná hodnota$/, KC, { od });
  const iDrahy = indexRadku(s.radky, /^Bankovní \/ podílový fond$/, od);
  const drahy = poStitku(s.radky, /^Konečná hodnota$/, KC, { od: Math.max(iDrahy, 0) });
  const navic = atribut(s, 'data-qa', (x) => x.a['data-qa'] === 'poplatky-rozdil') ? s.atributy.find((x) => x.a['data-qa'] === 'poplatky-rozdil').text : null;
  const o = p.ocekavano, tol = p.tolerance['Kč'];
  return {
    stranky: [page],
    kontroly: [
      cNum('Levný ETF – konečná hodnota', o['Levný ETF – konečná hodnota'], precti(levny), tol),
      cNum('Drahý fond – konečná hodnota', o['Drahý fond – konečná hodnota'], iDrahy >= 0 ? precti(drahy) : null, tol),
      cNum('S levným ETF budete mít navíc', o['S levným ETF budete mít navíc'], precti(navic), tol),
    ],
  };
};
R.poplatkyHero = async (p, env) => {
  const s = await env.staticka('/kalkulacka');
  return { kontroly: [cNum('Modelový rozdíl / 30 let', p.ocekavano['Modelový rozdíl / 30 let'], precti(poStitku(s.radky, /^Modelový rozdíl/, KC)), p.tolerance['Kč'])] };
};

/* /kolik-investovat-mesicne – statické tabulky */
R.kolikInvestovat = async (p, env) => {
  const s = await env.staticka('/kolik-investovat-mesicne');
  const o = p.ocekavano, k = [];
  const tolMil = (bunka) => (/mil\./.test(bunka || '') ? 5000 : p.tolerance['Kč']);
  if (p.vstupy.mesicne && !p.vstupy.let) {
    const tab = tabulka(s.tabulky, /MĚSÍČNĚ.*ZA 10 LET/i);
    const r = tab?.find((row) => precti(row[0])?.v === p.vstupy.mesicne);
    ['za 10 let', 'za 20 let', 'za 30 let'].forEach((kl, i) => k.push(cNum(kl, o[kl], precti(r?.[i + 1]), tolMil(r?.[i + 1]), { half: false })));
  } else if (p.vstupy.cil) {
    // Hledat až v sekci „na milion“: na mobilu (< 640 px) má tabulka nad ní karty se stejnými popisky „Za 10 let“
    // (ResponzivniTabulka) → test ve WebKitu četl 171 052 Kč (1 000 Kč měsíčně za 10 let) místo 5 846 Kč.
    const od = indexRadku(s.radky, /^Kolik měsíčně na první milion$/i);
    for (const [kl, re] of [['za 10 let', /^za 10 let$/i], ['za 20 let', /^za 20 let$/i], ['za 30 let', /^za 30 let$/i]]) k.push(cNum(kl, o[kl], od >= 0 ? precti(poStitku(s.radky, re, KC, { max: 2, od })) : null, p.tolerance['Kč']));
    k.push(cNum('násobek 10 vs 30 let (zaokr.)', o['násobek 10 vs 30 let (zaokr.)'], precti(s.text.match(/tedy (\d+)× víc/)?.[1]), 0));
  } else {
    for (const kl of ['5 %', '7 %', '9 %']) k.push(cNum(kl, o[kl], precti(poStitku(s.radky, new RegExp(`^${esc(kl)} ročně$`, 'i'), KC, { max: 2 })), p.tolerance['Kč'], { half: false }));
  }
  return { kontroly: k };
};

/* /investovani-pro-deti */
R.deti = async (p, env) => {
  const s = await env.staticka('/investovani-pro-deti');
  const o = p.ocekavano;
  if (p.typ === 'text') {
    const m9 = s.text.match(/začne až v devíti letech, má jen ([\d ]+) Kč/);
    const podil = o['od 9 let'] / o['od narození'];
    return {
      kontroly: [
        cNum('od 9 let', o['od 9 let'], precti(m9?.[1]), p.tolerance['Kč']),
        cNum('od narození', o['od narození'], precti(s.text.match(/od narození do osmnáctin vyjde[^\n]*?zhruba na ([\d ]+) Kč/)?.[1]), p.tolerance['Kč']),
        cNum('podíl', o['podíl'], cislo(podil), 0.0005),
        cBool('text NESMÍ tvrdit', !s.text.includes(o['text NESMÍ tvrdit']), `bez „${o['text NESMÍ tvrdit']}“ (podíl ${(podil * 100).toFixed(1)} %)`, { skut: s.text.includes(o['text NESMÍ tvrdit']) ? `tvrdí „${o['text NESMÍ tvrdit']}“` : 'netvrdí' }),
      ],
    };
  }
  const tab = tabulka(s.tabulky, /MĚSÍČNĚ.*OD NAROZENÍ/i);
  const r = tab?.find((row) => precti(row[0])?.v === p.vstupy.mesicne);
  const tol = (b) => (/mil\./.test(b || '') ? p.tolerance['nad 1 mil.'] : p.tolerance['Kč']);
  return { kontroly: ['od narození (18 let)', 'od 6 let (12 let)', 'od 12 let (6 let)', 'vloženo od narození'].map((kl, i) => cNum(kl, o[kl], precti(r?.[i + 1]), tol(r?.[i + 1]), { half: false })) };
};

/* /dip */
R.dip = async (p, env) => {
  const s = await env.staticka('/dip');
  const o = p.ocekavano, tol = p.tolerance['Kč'];
  const pred = (re) => { const i = indexRadku(s.radky, re); return i > 0 ? s.radky[i - 1] : null; };
  // první sloupec je „48 000 Kč ročně“ (dřív „48 000 Kč“); řádek „60 000 Kč ročně“ (strop) se nebere
  const vrat = radekTab(tabulka(s.tabulky, /JDE NA ODPOČET/i), /^48 000 Kč( ročně)?$/);
  return {
    kontroly: [
      cNum('10 let', o['10 let'], precti(pred(/^po 10 letech reinvestování/)), tol),
      cNum('20 let', o['20 let'], precti(pred(/^po 20 letech reinvestování/)), tol),
      cNum('30 let', o['30 let'], precti(pred(/^po 30 letech reinvestování/)), tol),
      cNum('vratka 15 % z 48 000', o['vratka 15 % z 48 000'], precti(vrat?.[2]), tol),
      cNum('vratka 23 % z 48 000', o['vratka 23 % z 48 000'], precti(vrat?.[3]), tol),
    ],
  };
};

/* /pruvodce – příklad poplatků (data-priklad-*) */
R.pruvodce = async (p, env) => {
  const s = await env.staticka('/pruvodce');
  const l = Number(atribut(s, 'data-priklad-levny')), d = Number(atribut(s, 'data-priklad-drahy'));
  const o = p.ocekavano, tol = p.tolerance['Kč'];
  return {
    kontroly: [
      cNum('levný', o['levný'], Number.isFinite(l) && l ? cislo(l) : null, tol),
      cNum('drahý', o['drahý'], Number.isFinite(d) && d ? cislo(d) : null, tol),
      cNum('rozdíl', o['rozdíl'], Number.isFinite(l) && Number.isFinite(d) && l && d ? cislo(l - d) : null, tol),
    ],
  };
};

/* Korunový stroj času (data k poslednímu dni → hodnota jen při shodě data; vloženo vždy konzistence) */
R.strojCasu = async (p, env) => {
  const page = await env.nova(p.url);
  await cekejNaText(page, /Dnes byste měli zhruba/).catch(() => {});
  const s = await snimek(page);
  const v = p.vstupy, o = p.ocekavano;
  const dn = datum(s.text.match(/Data k (\d{1,2}\. ?\d{1,2}\. ?\d{4})/)?.[1]);
  const hodnota = precti(poStitku(s.radky, /^Dnes byste měli zhruba$/, KC));
  const vlozeno = precti(s.text.match(/Vloženo ([\d ]+) Kč/)?.[1]);
  const k = [];
  // web zaokrouhluje na 0,1 mil. (nad milion) nebo na 3 platné číslice – polovina kroku zobrazení se přičte k toleranci
  if (hodnota) hodnota.half = /mil\./.test(hodnota.raw) ? 50000 : 0.5 * 10 ** (Math.floor(Math.log10(Math.abs(hodnota.v))) - 2);
  k.push(cNum('hodnota (Kč)', o['hodnota (Kč)'], hodnota, 0, { rel: p.tolerance['relativně'] }));
  k.push(cNum('vloženo (Kč)', o['vloženo (Kč)'], vlozeno, 0, { half: false }));
  if (dn) {
    const [r, m] = dn.split('-').map(Number);
    const pocet = (r - v.od) * 12 + m; // měsíční vklady od ledna roku „od“ do měsíce dat včetně
    k.push(cNum('konzistence: vloženo = naráz + měsíčně × počet měsíců', v.naraz + v.mesicne * pocet, vlozeno, 0, { half: false, druh: 'konzistence' }));
  }
  return { stranky: [page], datum: dn, kontroly: k };
};

/* FIRE kalkulačka */
R.fire = async (p, env) => {
  const page = await env.nova('/fire-kalkulacka');
  const v = p.vstupy, o = p.ocekavano;
  const k = [];
  if (p.id === 'fire-10') {
    const strategie = v.strategie;
    for (let i = 0; i < strategie.length; i++) {
      await page.selectOption('#strategy', strategie[i]);
      await page.waitForTimeout(250);
      const t = norm(await page.locator('[data-qa="fire-predpoklad"]').first().innerText().catch(() => ''));
      k.push(cNum(`realny_vynos_pct.${strategie[i]}`, o.realny_vynos_pct[i], precti(t.match(/výnosem ([\d,]+) % ročně/)?.[1]), p.tolerance.realny_vynos_pct));
    }
    k.push(neovereno('kolisani_pct', o.kolisani_pct, 'stránka kolísání strategií nezobrazuje (doporučený atribut data-kolisani)'));
    k.push(neovereno('inflace_pct_rocne', o.inflace_pct_rocne, 'stránka historickou inflaci období nezobrazuje'));
    return { stranky: [page], kontroly: k };
  }
  await prepis(page, '#age', v.vek);
  await prepis(page, '#expenses', v.vydaje_mesicne);
  await prepis(page, '#savings', v.uspory);
  await prepis(page, '#monthly', v.sporeni_mesicne);
  await prepis(page, '#inflation', v.inflace);
  await page.selectOption('#strategy', v.strategie);
  if (v.valorizace !== undefined) await page.locator('main input[type=checkbox]').first().setChecked(!!v.valorizace);
  if (v.udalost) {
    const [typ, castka, rok] = v.udalost;
    await klikni(page, page.locator('summary', { hasText: 'Životní události' }).first());
    await klikni(page, page.getByRole('button', { name: /Přidat událost/ }).first());
    await page.locator('select[aria-label="Typ události"]').first().selectOption({ label: typ });
    await prepis(page, page.locator('input[aria-label="Částka události"]').first(), castka);
    await prepis(page, page.locator('input[aria-label="Za kolik let"]').first(), rok);
  }
  await page.waitForTimeout(600);
  const s = await snimek(page);
  const od = Math.max(0, indexRadku(s.radky, /^VÁŠ VÝSLEDEK$/i), indexRadku(s.radky, /^Životní události/));
  const tolVek = typeof p.tolerance === 'object' ? (p.tolerance.vek ?? p.tolerance.vek_presne ?? 0) : p.tolerance;
  const vek = (re, klic) => {
    const i = indexRadku(s.radky, re, od);
    if (i < 0) return null;
    const hodnota = norm(qa(s, { kdyz_se_darilo: 'fire-fast', nejcasteji: 'fire-med', kdyz_se_nedarilo: 'fire-slow' }[klic]) ?? s.radky[i + 1]).trim();
    if (/^—/.test(hodnota)) return { raw: `— (${s.radky[i + 2]})`, pomlcka: true };
    return precti(hodnota);
  };
  for (const [klic, re] of [['kdyz_se_darilo', /^Když se trhu dařilo$/], ['nejcasteji', /^(Nejčastěji|Obvykle \(medián\))$/], ['kdyz_se_nedarilo', /^Když se nedařilo$/]]) {
    if (o[klic] === undefined) continue;
    const x = vek(re, klic);
    // Tolerance může být i po klíči (rozptyl 600 simulací webu se liší podle percentilu – fire-05 medián).
    const tolKlic = typeof p.tolerance?.[klic] === 'number' ? p.tolerance[klic] : tolVek;
    if (typeof o[klic] === 'string') k.push(cText(klic, o[klic], x ? norm(x.raw) : null));
    else k.push(x?.pomlcka ? { klic, ocek: o[klic], skut: x.raw, ok: false, druh: 'hodnota' } : cNum(klic, o[klic], x, tolKlic, { half: false }));
  }
  // Karta výsledku, nebo (cíl už splněn / nedosažitelný) věta „Cílová částka podle pravidla 4 % je … Kč; … dává … Kč měsíčně“.
  const cilova = precti(poStitku(s.radky, /^Cílová částka( \(|$)/, KC, { od, max: 4 })) || precti(s.text.match(/Cílová částka podle pravidla 4 % je ([\d ]+) Kč/)?.[1]) || precti(s.text.match(/Cílová částka \(\s*pravidlo 4 %\s*\) vychází na ([\d ]+) Kč/)?.[1]);
  const prijem = precti(poStitku(s.radky, /^Měsíční příjem z portfolia$/, KC, { od, max: 1 })) || precti(s.text.match(/dává ([\d ]+) Kč měsíčně/)?.[1]);
  if (o.cilova_castka_kc !== undefined) k.push(cNum('cilova_castka_kc', o.cilova_castka_kc, cilova, p.tolerance?.cilova_castka_kc ?? 0, { half: false }));
  if (o.mesicni_prijem_kc !== undefined) k.push(cNum('mesicni_prijem_kc', o.mesicni_prijem_kc, prijem, p.tolerance?.mesicni_prijem_kc ?? 0, { half: false }));
  if (o.text !== undefined) k.push(cBool('text', s.text.includes(o.text), `obsahuje „${o.text}“`));
  if (o.prvni_rok !== undefined) k.push(cNum('prvni_rok', o.prvni_rok, precti(s.text.match(/Kolem věku (\d+) už portfolio pokryje/)?.[1]), tolVek, { half: false }));
  if (o.polovina_cesty !== undefined) k.push(cNum('polovina_cesty', o.polovina_cesty, precti(s.text.match(/Kolem věku (\d+) máte 50 % cíle/)?.[1]), tolVek, { half: false }));
  if (o.pole_inflace !== undefined) k.push(cText('pole_inflace', o.pole_inflace, await page.locator('#inflation').inputValue()));
  return { stranky: [page], kontroly: k };
};

/* Monte Carlo (statistická tolerance = brána, přesná seedová shoda = jen regresní varování) */
R.monteCarlo = async (p, env) => {
  const page = await env.nova('/monte-carlo');
  const v = p.vstupy, o = p.ocekavano;
  await klikni(page, tlacitko(page, v.portfolio));
  await prepis(page, '#mc-initial', v.pocatecni);
  await prepis(page, '#mc-monthly', v.mesicne);
  await prepis(page, '#mc-period', v.roky);
  await prepis(page, '#mc-goal', v.cil);
  await posuvnik(page, '#mc-sims', v.scenaru);
  await klikni(page, page.getByRole('button', { name: /Spustit simulaci/ }).first());
  await cekejNaText(page, /Medián \(50 %\)\s*\n+\s*\d[\d ,]*(mil\. )?Kč/, 30000).catch(() => {});
  const s = await snimek(page);
  // data-qa (nový build) má přednost, text jako záloha. Výsledky jsou zaokrouhlené (2 platné číslice) → polovina kroku k toleranci.
  const hodnoty = {
    sance_pct: precti(qa(s, 'mc-sance')) || precti(s.text.match(/Šance dosáhnout[^\n]*\n+\s*(\d+) %/)?.[1]),
    p5: precti(qa(s, 'mc-p5')) || precti(poStitku(s.radky, /^Pesimistický \(5 %\)$/, KC, { max: 2 })),
    median: precti(qa(s, 'mc-p50')) || precti(poStitku(s.radky, /^Medián \(50 %\)$/, KC, { max: 2 })),
    p95: precti(qa(s, 'mc-p95')) || precti(poStitku(s.radky, /^Optimistický \(95 %\)$/, KC, { max: 2 })),
    vlozeno: precti(s.text.match(/[Vv]loženo[^\n]*?([\d ]+) Kč/)?.[1]),
  };
  const k = [];
  const stat = typeof p.tolerance === 'object' ? p.tolerance.statisticky || {} : {};
  for (const [klic, ocek] of Object.entries(o)) {
    if (klic === 'sance') { k.push(cBool('sance', !/Šance dosáhnout/.test(s.text), 'šance se nezobrazuje (cíl 0)')); continue; }
    if (klic === 'vlozeno') { k.push(hodnoty.vlozeno ? cNum(klic, ocek, hodnoty.vlozeno, 0, { half: false }) : neovereno(klic, ocek, 'stránka vloženou částku nezobrazuje')); continue; }
    if (p.tolerance === 0) { k.push(cNum(klic, ocek, hodnoty[klic], 0, { half: false })); continue; }
    // Branou je statistická tolerance (3σ nezávislého modelu); bez ní hodnotu nelze rozhodnout → jen varování.
    if (stat[klic] !== undefined) k.push(cNum(klic, ocek, hodnoty[klic], stat[klic]));
    else k.push(cNum(klic, ocek, hodnoty[klic], 0, { druh: 'varovani', pozn: 'bez statistické tolerance' }));
  }
  return { stranky: [page], kontroly: k };
};

/* /pravidlo-4-procent */
R.pravidlo4 = async (p, env) => {
  const s = await env.staticka('/pravidlo-4-procent');
  const o = p.ocekavano, k = [];
  const dn = datum(s.text.match(/Data k ([^\n]*\d{4})/)?.[1]);
  if (p.id === 'fire-17') {
    const tab = s.tabulky.find((t) => /^START.*S&P 500.*CELÝ SVĚT.*VYVÁŽENÉ/i.test(norm(t[0].join(' | '))) && /došl/.test(radekTab(t, /^2000$/)?.[1] || ''));
    for (const [klic, ocek] of Object.entries(o)) {
      const [index, rok] = klic.split('_');
      const r = radekTab(tab, new RegExp(`^${rok}$`));
      const bunka = r?.[index === 'sp500' ? 1 : 2];
      if (klic.endsWith('nasobek')) k.push(cNum(klic, ocek, precti(bunka), p.tolerance.nasobek, { half: false }));
      else k.push(cNum(klic, Number(ocek), precti(bunka?.match(/došly (?:v \S+ |\d{1,2}\/)(\d{4})/)?.[1]), p.tolerance.rok, { half: false })); // desktop „v lednu 2012“, mobil „1/2012“
    }
  } else if (p.id === 'fire-18') {
    const tab = tabulka(s.tabulky, /^VÝBĚR ROČNĚ.*S&P 500/i);
    const doslo = (b) => (b == null ? null : /vydrželo vše/.test(b) ? cislo(0) : precti(b.match(/došlo u (\d+) %/)?.[1]));
    const r4 = radekTab(tab, /^4 %$/);
    k.push(cNum('sp500_4pct_doslo_pct', o.sp500_4pct_doslo_pct, doslo(r4?.[1]), p.tolerance.pct, { half: false }));
    k.push(cNum('svet_4pct_doslo_pct', o.svet_4pct_doslo_pct, doslo(r4?.[2]), p.tolerance.pct, { half: false }));
    const vyv = ['3 %', '3,5 %', '4 %', '4,5 %'].map((x) => doslo(radekTab(tab, new RegExp(`^${esc(x)}$`))?.[3]));
    k.push(cNum('vyvazene_3az4_5pct_doslo_pct', o.vyvazene_3az4_5pct_doslo_pct, vyv.every(Boolean) ? cislo(Math.max(...vyv.map((x) => x.v))) : null, p.tolerance.pct, { half: false }));
    k.push(cNum('pocet_startu_akcie', o.pocet_startu_akcie, precti(r4?.[1]?.match(/(\d+) startů/)?.[1]), 0, { half: false }));
    k.push(cNum('pocet_startu_vyvazene', o.pocet_startu_vyvazene, precti(r4?.[3]?.match(/(\d+) startů/)?.[1]), 0, { half: false }));
  } else if (p.id === 'fire-19') {
    const tab = tabulka(s.tabulky, /Z 10 MIL/i);
    for (const [sazba, [kc, mil]] of Object.entries(o)) {
      const r = radekTab(tab, new RegExp(`^${esc(sazba)} %$`));
      k.push(cNum(`${sazba} % – z 10 mil. měsíčně`, kc, precti(r?.[1]), p.tolerance.kc, { half: false }));
      const x = precti(r?.[2]);
      k.push(cNum(`${sazba} % – potřeba na 40 000 Kč (mil.)`, mil, x ? { ...x, v: x.v / 1e6, half: x.half / 1e6 } : null, p.tolerance.mil, { half: false }));
    }
  } else if (p.id === 'fire-20') {
    k.push(cNum('vyvazene_mensi_nez_akciove_startu', o.vyvazene_mensi_nez_akciove_startu, precti(s.text.match(/menší než akciové u všech (\d+) startů/)?.[1]), 0, { half: false }));
    // „kleslo vyvážené portfolio … nejníž na 0,6×–0,8× …, čistě akciové na 0,5×–0,6×“ → porovnat čísla rozsahů
    const m = s.text.match(/nejníž na ([\d,]+)×?–([\d,]+)×[^\n]*?čistě akciové na ([\d,]+)×?–([\d,]+)×/);
    const rozsah = (x) => (norm(x).match(/\d+(?:,\d+)?/g) || []).map((c) => c.replace(',', '.')).join('–');
    k.push(cText('nejnize_vyvazene', rozsah(o.nejnize_vyvazene), m ? rozsah(`${m[1]}–${m[2]}`) : null));
    k.push(cText('nejnize_akciove', rozsah(o.nejnize_akciove), m ? rozsah(`${m[3]}–${m[4]}`) : null));
    k.push(neovereno('realne_pod_1', o.realne_pod_1.join(', '), 'seznam let se na stránce nevypisuje (tabulka končí rokem 2012)'));
  }
  return { datum: dn, kontroly: k };
};

/* /fire – tabulky */
R.fireStranka = async (p, env) => {
  const s = await env.staticka('/fire');
  const o = p.ocekavano, k = [];
  const cil = tabulka(s.tabulky, /CÍLOVÁ ČÁSTKA/i), mira = tabulka(s.tabulky, /MÍRA ÚSPOR/i);
  const r0 = (tab, klic) => radekTab(tab, new RegExp(`^${klic.match(/(\d+)pct/)[1]} %$`));
  for (const [klic, ocek] of Object.entries(o)) {
    if (klic.startsWith('cil_')) {
      const r = cil?.find((row) => precti(row[0])?.v === Number(klic.slice(4)));
      const x = precti(r?.[2]);
      k.push(cNum(klic, ocek, x ? { ...x, v: x.v / 1e6 } : null, p.tolerance.mil, { half: false }));
    } else {
      // Tolerance „roky ±0,5“ je krok zobrazení celých let („~51 let“). U čísla s desetinou („~8,5 roku“) by
      // propustila právě chybu K3 (správně 8,8) → tolerance = polovina kroku zobrazení + 0,1 (zaokrouhlení modelu), nejvýš 0,5.
      const x = precti(r0(mira, klic)?.[1]);
      k.push(cNum(klic, ocek, x, x ? Math.min(p.tolerance.roky, x.half + 0.1) : p.tolerance.roky, { half: false }));
    }
  }
  return { kontroly: k };
};

/* Backtest – stránka (UI) */
async function ctiBacktestUI(page) {
  await cekejNaText(page, /Z vložených [^\n]+ bylo\s*\n+\s*[\d ]+/, 45000).catch(() => {});
  await page.waitForTimeout(500);
  const s = await snimek(page);
  return {
    s,
    netAssetValue: precti(poStitku(s.radky, /^Z vložených .+ bylo$/, /\d/, { max: 2 })),
    amountInvested: precti(poStitku(s.radky, /^Vloženo$/, /\d/, { max: 2 })),
    cagr_pct: precti(poStitku(s.radky, /^(Roční zhodnocení|Ročně)$/, PCT, { max: 3 })), // mobil: „Ročně“
    maxDrawdown_pct: precti(poStitku(s.radky, /^Max\. pokles$/, PCT, { max: 3 })),
    standardDeviation_pct: precti(poStitku(s.radky, /^Kolísavost$/, PCT, { max: 3 })),
    xirr_pct: precti(s.text.match(/zhodnocovaly\s*([\d,−-]+) % ročně/)?.[1]),
    datum: datum(s.text.match(/Z vložených [^\n]* k ([^\n]*\d{4})/)?.[1]),
    prvniDen: await page.locator('#bt-start').inputValue().catch(() => null),
  };
}
R.backtestUI = async (p, env) => {
  const page = await env.nova(p.url);
  const x = await ctiBacktestUI(page);
  const o = p.ocekavano, k = [];
  for (const [klic, ocek] of Object.entries(o)) {
    const tol = tolBacktest(p, klic);
    if (klic === 'prvniDen') k.push(cText(klic, ocek, x.prvniDen));
    else if (klic === 'netAssetValue') k.push(cNum(klic, ocek, x[klic], 0, { rel: tol / 100 }));
    else k.push(cNum(klic, ocek, x[klic], tol ?? 0));
  }
  return { stranky: [page], kontroly: k };
};

/* Backtest – API */
R.api = async (p) => {
  const { vstupy: telo, ocekavano: o } = p;
  const r = await apiBacktest(telo);
  if (r.limit) return { neovereno: `vyčerpán limit ${MAX_API} volání API za běh` };
  if (p.typ === 'chovani') { // backtest-44: váhy 0,995 → 400 nebo normalizace (CAGR jako 100 %)
    const cagr = r.json?.summary?.cagr;
    const ok = r.status === 400 || (cagr != null && Math.abs(cagr * 100 - 10.70) <= p.tolerance.cagr_pct);
    return { kontroly: [cBool('chovani', ok, o.chovani, { skut: r.status === 400 ? 'HTTP 400' : `HTTP ${r.status}, CAGR ${cagr != null ? (cagr * 100).toFixed(2) : '?'} %` })] };
  }
  if (r.status !== 200 || !r.json?.summary) return { kontroly: [cBool('HTTP 200', false, 'odpověď API', { skut: `HTTP ${r.status} ${JSON.stringify(r.json)?.slice(0, 120)}` })] };
  const j = r.json;
  const skut = {
    prvniDen: j.evolution?.[0]?.date?.slice(0, 10),
    amountInvested: j.summary.amountInvested,
    netAssetValue: j.summary.netAssetValue,
    cagr_pct: j.summary.cagr * 100,
    standardDeviation_pct: j.summary.standardDeviation * 100,
    maxDrawdown_pct: j.risk?.maxDrawdown?.depth * 100,
  };
  const k = [];
  for (const [klic, ocek] of Object.entries(o)) {
    const tol = tolBacktest(p, klic);
    if (klic === 'prvniDen') k.push(cText(klic, ocek, skut.prvniDen));
    else if (klic === 'xirr_pct') k.push(neovereno(klic, ocek, 'API XIRR nevrací (kontroluje se na stránce backtestu)'));
    else if (klic === 'netAssetValue') k.push(cNum(klic, ocek, cislo(skut[klic]), 0, { rel: tol / 100 }));
    else k.push(cNum(klic, ocek, cislo(skut[klic]), tol ?? 0));
  }
  return { kontroly: k };
};

/* Backtest – očištění o inflaci (stejné tělo jako backtest-01 → z cache API) */
R.inflace = async (p) => {
  const telo = DATA.pripady.find((x) => x.id === 'backtest-01').vstupy;
  const r = await apiBacktest(telo);
  if (r.limit) return { neovereno: `vyčerpán limit ${MAX_API} volání API za běh` };
  const inf = r.json?.inflation;
  const ev = r.json?.evolution;
  const roky = ev?.length ? (new Date(ev[ev.length - 1].date) - new Date(ev[0].date)) / (365.25 * 864e5) : null;
  return {
    kontroly: [
      cNum('realny_cagr_pct', p.ocekavano.realny_cagr_pct, cislo(inf?.realCAGR * 100), 0.02),
      cNum('inflace_pa_pct', p.ocekavano.inflace_pa_pct, cislo(inf?.inflationRate * 100), 0.02),
      cNum('cpi_faktor', p.ocekavano.cpi_faktor, inf && roky ? cislo((1 + inf.inflationRate) ** roky) : null, 0.01),
    ],
  };
};

/* Backtest – chování: kratší než rok, tečka v poli */
R.backtestKratky = async (p, env) => {
  const page = await env.nova(p.url);
  const x = await ctiBacktestUI(page);
  const o = p.ocekavano;
  const rocne = poStitku(x.s.radky, /^(Roční zhodnocení|Ročně)$/, /%|—/, { max: 3 });
  const kolis = poStitku(x.s.radky, /^Kolísavost$/, /%|—/, { max: 3 });
  return {
    stranky: [page],
    kontroly: [
      cNum('vloženo', 105000, x.amountInvested, 0, { half: false }),
      cNum('konecna', 109671, x.netAssetValue, 0, { rel: 0.008 }),
      cBool('rocni_zhodnoceni', !rocne || /—/.test(rocne) || /celkem|za období/.test(x.s.text.slice(x.s.text.indexOf('Roční zhodnocení'), x.s.text.indexOf('Roční zhodnocení') + 120)), o.rocni_zhodnoceni, { skut: rocne }),
      cBool('kolisavost', !kolis || /—/.test(kolis), o.kolisavost, { skut: kolis }),
      cBool('xirr', !/zhodnocovaly\s*[\d,]+ % ročně/.test(x.s.text), o.xirr, { skut: x.s.text.match(/zhodnocovaly\s*[\d,]+ % ročně/)?.[0] || 'bez „% ročně“' }),
    ],
  };
};
R.backtestTecka = async (p, env) => {
  const page = await env.nova('/backtest');
  await ctiBacktestUI(page);
  await prepis(page, '#bt-contrib', p.vstupy.napsat);
  await page.locator('#bt-initial').first().click().catch(() => {}); // opustit pole
  await page.waitForTimeout(3000);
  const hodnota = await page.locator('#bt-contrib').inputValue();
  const x = await ctiBacktestUI(page);
  const varovani = /Upraveno|neplatn|tisíc/i.test(x.s.text);
  return {
    stranky: [page],
    kontroly: [
      cBool('pole_po_opusteni', norm(hodnota) === '1 000' || varovani, p.ocekavano.pole_po_opusteni, { skut: `„${hodnota}“` }),
      cBool('vlozeno', x.amountInvested && x.amountInvested.v !== 250261, p.ocekavano.vlozeno, { skut: x.amountInvested?.raw }),
    ],
  };
};

/* Modelová portfolia (data-kontrola-backtest + tabulka historie) */
R.strategie = async (p, env) => {
  const s = await env.staticka(p.url);
  const o = p.ocekavano, t = p.tolerance;
  const kb = (atribut(s, 'data-kontrola-backtest', (x) => x.a['data-sekce'] === 'historie' || x.tag === 'SECTION') || '').split('|');
  const tolNum = (x) => Number(norm(x).match(/±\s?([\d,]+)/)[1].replace(',', '.'));
  const tab = s.tabulky.find((tt) => radekTab(tt, /^Kolísavost/));
  const bunka = (re) => radekTab(tab, re)?.[1];
  const rokVynos = (b) => precti(b);
  const rokRok = (b) => b?.match(/(\d{4})/)?.[1] ?? null;
  return {
    datum: kb[3] || datum(s.text.match(/Data k ([^\n]*\d{4})/)?.[1]),
    kontroly: [
      cNum('rocne_pct', o.rocne_pct, kb[1] ? cislo(Number(kb[1]) * 100) : precti(bunka(/^Roční zhodnocení/)), tolNum(t.rocne_pct)),
      cNum('konecna_hodnota', o.konecna_hodnota, kb[2] ? cislo(Number(kb[2])) : null, 0, { rel: tolNum(t.konecna_hodnota) / 100 }),
      cNum('max_pokles_pct', o.max_pokles_pct, precti(bunka(/^Největší propad/)), tolNum(t.max_pokles_pct)),
      cNum('kolisavost_pct', o.kolisavost_pct, precti(bunka(/^Kolísavost/)), tolNum(t.kolisavost_pct)),
      // tolerance pro nejlepší/nejhorší rok v zlatém případu chybí → jako roční výnos (±0,1 p. b. + zaokrouhlení zobrazení)
      cNum('nejlepsi_cely_rok – výnos', o.nejlepsi_cely_rok[0], rokVynos(bunka(/^Nejlepší celý rok/)), tolNum(t.rocne_pct)),
      cText('nejlepsi_cely_rok – rok', String(o.nejlepsi_cely_rok[1]), rokRok(bunka(/^Nejlepší celý rok/))),
      cNum('nejhorsi_cely_rok – výnos', o.nejhorsi_cely_rok[0], rokVynos(bunka(/^Nejhorší celý rok/)), tolNum(t.rocne_pct)),
      cText('nejhorsi_cely_rok – rok', String(o.nejhorsi_cely_rok[1]), rokRok(bunka(/^Nejhorší celý rok/))),
      cText('roky_v_plusu', o.roky_v_plusu, bunka(/^Roky v plusu/)?.match(/\d+ z \d+/)?.[0] ?? null),
    ],
  };
};

/* Faktorové ETF – tabulka na /faktorove-etf (data-faktor řádky, jinak text) */
const FAKTOR = { us_value: ['value', /^Value/], us_small_cap: ['small-cap', /^Small cap/], us_dividend: ['dividendove-akcie', /^Dividendové akcie/], us_min_vol: ['minimalni-volatilita', /^Minimální volatilita/] };
R.faktor = async (p, env) => {
  const s = await env.staticka('/faktorove-etf');
  const [slug, jmeno] = FAKTOR[p.vstupy.index];
  const a = s.atributy.find((x) => x.tag === 'TR' && x.a['data-faktor'] === slug)?.a;
  const tab = s.tabulky.find((t) => /FAKTOR/i.test(t[0]?.[0] || '') && t.some((r) => /^Value/.test(r[0])));
  const r = radekTab(tab, jmeno);
  const o = p.ocekavano, t = p.tolerance;
  const rel = Number(norm(t.konecna).match(/±\s?([\d,]+)/)[1].replace(',', '.')) / 100;
  const tolCagr = Number(norm(t.cagr_pct).match(/±\s?([\d,]+)/)[1].replace(',', '.'));
  const n = r ? r.length : 0; // [název, od, konečná, ročně, propad, S&P]
  const sp = r?.[n - 1];
  const porazil = a ? a['data-vysledek'] === 'porazil' : r ? /porazil index/.test(r[0]) : null;
  return {
    datum: a?.['data-do'] || null,
    kontroly: [
      cNum('faktor_konecna', o.faktor_konecna, a ? cislo(Number(a['data-konecna'])) : precti(r?.[n - 4]), 0, { rel, half: !a }),
      cNum('faktor_cagr_pct', o.faktor_cagr_pct, precti(r?.[n - 3]), tolCagr),
      cNum('faktor_max_pokles_pct', o.faktor_max_pokles_pct, precti(r?.[n - 2]), tolCagr),
      cNum('sp500_konecna', o.sp500_konecna, a ? cislo(Number(a['data-sp-konecna'])) : precti(sp), 0, { rel, half: !a }),
      cNum('sp500_cagr_pct', o.sp500_cagr_pct, precti(sp?.match(/\(([^)]*)\)/)?.[1]), tolCagr),
      cText('porazil_index', String(o.porazil_index), porazil == null ? null : String(porazil)),
    ],
  };
};
R.rocenka = async (p, env) => {
  const s = await env.staticka('/faktorove-etf');
  const tab = tabulka(s.tabulky, /^ROK.*VALUE/i);
  const k = [];
  if (!tab) return { kontroly: [cBool('ročenka', false, 'tabulka ročenky na stránce')] };
  const hlavicka = tab[0].map((h) => norm(h).toUpperCase());
  const sloupec = { value: /^VALUE/, 'small-cap': /^SMALL/, dividendy: /^DIVIDEND/, 'min-vol': /^MIN/, momentum: /^MOMENTUM/, quality: /^QUALITY/, sp500: /^S&P/ };
  const tol = Number(norm(p.tolerance.rocni_vynosy_pct).match(/±\s?([\d,]+)/)[1].replace(',', '.'));
  const roky = {};
  for (const [f, rady] of Object.entries(p.ocekavano.rocni_vynosy_pct)) {
    const c = hlavicka.findIndex((h) => sloupec[f].test(h));
    for (const [rok, ocek] of Object.entries(rady)) {
      const x = precti(radekTab(tab, new RegExp(`^${rok}`))?.[c]);
      k.push(cNum(`${f} ${rok}`, ocek, c >= 0 ? x : null, tol));
      if (f !== 'sp500' && x) (roky[rok] ||= []).push([f, x.v]);
    }
  }
  // Vítězové roků přepočtené z čísel na stránce (shoda na zobrazenou přesnost = dělené místo, ZAMERNA kolo 8).
  const vitez = {};
  for (const hodnoty of Object.values(roky)) {
    const max = Math.max(...hodnoty.map((x) => x[1]));
    for (const [f, v] of hodnoty) if (max - v < 0.05 + 1e-9) vitez[f] = (vitez[f] || 0) + 1;
  }
  for (const [f, ocek] of Object.entries(p.ocekavano.vitezove)) k.push(cNum(`vitezove.${f}`, ocek, cislo(vitez[f] || 0), 0));
  const m = s.text.match(/2022: (\S+) ([+−-][\d,]+ %)/);
  const [of, ov] = p.ocekavano['2022_jediny_kladny'].match(/^(\S+) \(([^)]*)\)/).slice(1);
  k.push(cText('2022_jediny_kladny – faktor', of, m?.[1] ?? null));
  k.push(cNum('2022_jediny_kladny – výnos', precti(ov).v, precti(m?.[2]), tol));
  if (p.ocekavano.vitezove.value === 0) k.push(cBool('tvrzení „každý faktor byl aspoň jednou nejlepší“', !/Každý faktor\s*byl aspoň jednou nejlepší/.test(s.text), 'nesmí tvrdit (value nevyhrálo žádný rok)'));
  return { datum: datum(s.text.match(/Data k ([^\n]*\d{4})/)?.[1]) || atribut(s, 'data-faktor-data-k') || null, kontroly: k };
};

/* /kolik-vydelaly-etf a /sp500-nebo-cely-svet */
R.vydelaly = async (p, env) => {
  const o = p.ocekavano, t = p.tolerance, k = [];
  const tolC = Number(norm(t.cagr_pct ?? '±0,1').match(/±?\s?([\d,]+)/)[1].replace(',', '.'));
  const tolP = Number(norm(t.max_pokles_pct ?? '±0,2').match(/±?\s?([\d,]+)/)[1].replace(',', '.'));
  const rel = Number(norm(t.konecna).match(/±\s?([\d,]+)/)[1].replace(',', '.')) / 100;
  let dn = null;
  const radky = {
    '/kolik-vydelaly-etf': [/TRH.*ZE 100 000/i, { VT: /^Celý svět/, SPY: /^S&P 500/, EFA: /EAFE/, EEM: /\(EM\)/ }],
    '/sp500-nebo-cely-svet': [/^CO .*ZE 100 000/i, { VT: /^Celý svět/, SPY: /^S&P 500/, VGTSX: /mimo USA/ }],
  };
  for (const [url, [hl, mapa]] of Object.entries(radky)) {
    if (!mapa[p.vstupy.fond]) continue;
    const s = await env.staticka(url);
    dn ||= datum(s.text.match(/(?:Data|data) k ([^\n]*?\d{4})/)?.[1]) || datum(s.text.match(/k (\d{1,2}\. \d{1,2}\. \d{4})/)?.[1]);
    const r = radekTab(tabulka(s.tabulky, hl), mapa[p.vstupy.fond]);
    k.push(cNum(`${url}: cagr_pct`, o.cagr_pct, precti(r?.[1]), tolC));
    k.push(cNum(`${url}: konecna`, o.konecna, precti(r?.[2]), 0, { rel }));
    k.push(cNum(`${url}: max_pokles_pct`, o.max_pokles_pct, precti(r?.[3]), tolP));
  }
  return { datum: dn, kontroly: k };
};
R.vydelalyMesicne = async (p, env) => {
  const s = await env.staticka('/kolik-vydelaly-etf');
  // Třetí sloupec („vloženo …“) je na mobilu skrytý → vloženo jen když se zobrazuje.
  const m = s.text.match(/([\d ]+) Kč měsíčně \((\d+) vkladů[^)]*\)\s*([\d ]+) Kč(?:\s*vloženo ([\d ]+) Kč)?/);
  const o = p.ocekavano;
  const k = [
    m && !m[4] ? neovereno('vlozeno', o.vlozeno, 'sloupec „vloženo“ se v tomto rozložení nezobrazuje') : cNum('vlozeno', o.vlozeno, precti(m?.[4]), 0, { half: false }),
    cNum('pocet_vkladu', o.pocet_vkladu, precti(m?.[2]), 0, { half: false }),
    cNum('konecna', o.konecna, precti(m?.[3]), 0, { rel: 0.005 }),
  ];
  if (m?.[4]) k.push(cNum('konzistence: vloženo = vklad × počet vkladů', precti(m[1]).v * Number(m[2]), precti(m[4]), 0, { half: false, druh: 'konzistence' }));
  return { datum: datum(s.text.match(/Data k ([^\n]*\d{4})/)?.[1]), kontroly: k };
};
R.klouzava = async (p, env) => {
  const s = await env.staticka('/kolik-vydelaly-etf');
  const tab = tabulka(s.tabulky, /DRŽEL JSEM/i);
  const k = [];
  for (const [okno, o] of Object.entries(p.ocekavano)) {
    const roky = okno.replace('r', '');
    const r = radekTab(tab, new RegExp(`^${roky} (rok|roky|let) \\(`));
    k.push(cNum(`${okno}.n`, o.n, precti(r?.[0]?.match(/\((\d+) období\)/)?.[1]), 1, { half: false }));
    k.push(cNum(`${okno}.low`, o.low, precti(r?.[1]), 0.15));
    k.push(cNum(`${okno}.high`, o.high, precti(r?.[2]), 0.15));
    k.push(cNum(`${okno}.avg`, o.avg, precti(r?.[3]), 0.15));
    k.push(cNum(`${okno}.pos`, o.pos, precti(r?.[4]), 0.15));
  }
  return { datum: datum(s.text.match(/Data k ([^\n]*\d{4})/)?.[1]), kontroly: k };
};
R.sp500Text = async (p, env) => {
  const s = await env.staticka('/sp500-nebo-cely-svet');
  const o = p.ocekavano;
  // Tabulka „Klíčová čísla“ (3. sloupec na mobilu skrytý), záloha: věta „(−7,3 % vs. −4,2 % ročně za 2000–2009)“.
  const veta = s.text.match(/\(([−-][\d,]+) % vs\. ([−-][\d,]+) % ročně za 2000–2009\)/);
  const dek = [null, s.text.match(/S&P 500 v dekádě 2000–2009 \(v Kč\)\s*([−-][\d,]+) % ročně/)?.[1] ?? veta?.[1], s.text.match(/svět mimo USA ([−-][\d,]+) % ročně/)?.[1] ?? veta?.[2]];
  const vt = s.text.match(/lepší ve všech (\d+) desetiletých obdobích, o ([\d,]+) p\. b\. až ([\d,]+) p\. b\./);
  const vg = s.text.match(/lepší v (\d+) z \d+ období \(\d+ %\)\. Rozdíl ale kolísal od ([−-][\d,]+) p\. b\. do \+?([\d,]+) p\. b\./);
  const usd = s.text.match(/Nejhlubší propad S&P 500 od 2008 \(v Kč \/ v USD\)\s*[−-][\d,]+ % \/ ([−-][\d,]+) %/) || s.text.match(/od roku 2008 v dolarech ([−-][\d,]+) %/);
  const cisla = (x) => (norm(x).match(/[−-]?\d+(?:,\d+)?/g) || []).map((c) => Number(c.replace('−', '-').replace(',', '.')));
  const [vtN, vtLo, vtHi] = cisla(o.SPY_vs_VT_od_2008).filter((_, i) => i !== 1);
  const [vgN, vgLo, vgHi] = cisla(o.SPY_vs_VGTSX_od_2000);
  return {
    datum: datum(s.text.match(/k (\d{1,2}\. \d{1,2}\. \d{4})/)?.[1]),
    kontroly: [
      cNum('SPY_2000_2009_cagr_pct', o.SPY_2000_2009_cagr_pct, precti(dek?.[1]), 0.1),
      cNum('VGTSX_2000_2009_cagr_pct', o.VGTSX_2000_2009_cagr_pct, precti(dek?.[2]), 0.1),
      cNum('SPY_vs_VT_od_2008 – období', vtN, precti(vt?.[1]), 1, { half: false }),
      cNum('SPY_vs_VT_od_2008 – od p. b.', vtLo, precti(vt?.[2]), 0.1),
      cNum('SPY_vs_VT_od_2008 – do p. b.', vtHi, precti(vt?.[3]), 0.1),
      cNum('SPY_vs_VGTSX_od_2000 – oken', vgN, precti(vg?.[1]), 1, { half: false }),
      cNum('SPY_vs_VGTSX_od_2000 – od p. b.', vgLo, precti(vg?.[2]), 0.1),
      cNum('SPY_vs_VGTSX_od_2000 – do p. b.', vgHi, precti(vg?.[3]), 0.1),
      cNum('SPY_max_pokles_USD_od_2008_pct', o.SPY_max_pokles_USD_od_2008_pct, precti(usd?.[1]), 0.1),
    ],
  };
};
R.jakDlouho = async (p, env) => {
  const s = await env.staticka('/jak-dlouho-v-minusu');
  const o = p.ocekavano, k = [];
  const nakup = {}; // „leden 2000“ → { 'S&P 500': [nominálně, po inflaci], … }
  let aktualni = null;
  for (const l of norm(s.text).split('\n')) {
    const h = l.trim().match(/^Nákup (\S+) (\d{4})/);
    if (h) { aktualni = `${h[1]} ${h[2]}`; nakup[aktualni] = {}; continue; }
    const r = l.split('\t').map((x) => x.trim());
    // poznámka pod čarou se lepí k číslu („9 let a 2 měsíce1“) → koncovou číslici za písmenem uříznout
    if (aktualni && r.length === 3 && /^(S&P 500|Celý svět|Vyvážené 60\/40)$/.test(r[0])) nakup[aktualni][r[0].replace('Vyvážené ', '')] = [r[1].replace(/(\D)\d+$/, '$1'), r[2].replace(/(\D)\d+$/, '$1')];
  }
  const NAZVY_MESICU = { '01': 'leden', '02': 'únor', '03': 'březen', '04': 'duben', '05': 'květen', '06': 'červen', '07': 'červenec', '08': 'srpen', '09': 'září', 10: 'říjen', 11: 'listopad', 12: 'prosinec' };
  for (const [start, rady] of Object.entries(o)) {
    if (!/^\d{4}-\d{2}$/.test(start)) continue;
    const zaznam = nakup[`${NAZVY_MESICU[start.slice(5)]} ${start.slice(0, 4)}`];
    for (const [rada, [nom, real]] of Object.entries(rady)) {
      const x = zaznam?.[rada];
      k.push(cNum(`${start} ${rada} nominálně (měs.)`, mesicu(nom), x ? cislo(mesicu(x[0])) : null, 0));
      k.push(cNum(`${start} ${rada} po inflaci (měs.)`, mesicu(real), x ? cislo(mesicu(x[1])) : null, 1));
    }
  }
  const nikdy = s.text.match(/Z (\d+) měsíců nákupu[^.]*?nebyla u (\d+) \((\d+) %\)/);
  const [oN, oZ, oP] = o.sp500_nikdy_pod_vkladem.match(/(\d+) z (\d+) \((\d+) %\)/).slice(1).map(Number);
  k.push(cNum('sp500_nikdy_pod_vkladem – počet', oN, precti(nikdy?.[2]), 0, { half: false }));
  k.push(cNum('sp500_nikdy_pod_vkladem – z kolika', oZ, precti(nikdy?.[1]), 0, { half: false }));
  k.push(cNum('sp500_nikdy_pod_vkladem – %', oP, precti(nikdy?.[3]), 0, { half: false }));
  const od04 = s.text.match(/kdo nakoupil od roku 2004, byl v korunách v minusu nejvýš ([^.]+?)\./);
  k.push(cNum('sp500_od_2004_nejdele (měs.)', mesicu(o.sp500_od_2004_nejdele), od04 ? cislo(mesicu(od04[1])) : null, 0));
  return { datum: datum(s.text.match(/Data k ([^\n]*\d{4})/)?.[1]), kontroly: k };
};

/* Čistý plat */
R.cistyPlat = async (p, env) => {
  const page = await env.nova('/cisty-plat');
  const v = p.vstupy, o = p.ocekavano;
  const zaskrtni = async (text, stav) => { const cb = page.locator('label', { hasText: text }).locator('input[type=checkbox]').first(); if ((await cb.isChecked()) !== stav) await klikni(page, cb); };
  if (v.duchodce !== undefined) await zaskrtni('Pracující', !!v.duchodce);
  if (v.invalidita_1_2 !== undefined) await zaskrtni('Sleva na invaliditu', !!v.invalidita_1_2);
  if (v.deti !== undefined) {
    await zaskrtni('daňové zvýhodnění na děti', v.deti > 0);
    if (v.deti > 0) await prepis(page, '#children', v.deti);
  }
  await prepis(page, '#gross', v.hruba_mzda);
  await page.waitForTimeout(300);
  const s = await snimek(page);
  if (p.typ === 'chovani') {
    const chybi = s.atributy.some((x) => x.a['data-vysledek-chybi'] !== undefined) || /Doplňte hrubou mzdu/.test(s.text);
    return { stranky: [page], kontroly: [cBool('vysledek', chybi && !s.atributy.some((x) => x.a['data-qa'] === 'cista-mzda'), o.vysledek)] };
  }
  const k = [];
  const tol = p.tolerance_kc ?? 1;
  // Zdravotní = 4,5 % + případný doplatek do minimálního vyměřovacího základu (S24, data-qa="doplatek").
  const zdr = precti(qa(s, 'zdr')) || precti(poStitku(s.radky, /^Zdravotní pojištění \(4,5 %\)$/, KC, { max: 1 }));
  const doplatek = precti(qa(s, 'doplatek'));
  const mapa = {
    cista_mzda_mesicne: precti(qa(s, 'cista-mzda')) || precti(poStitku(s.radky, /^Čistá mzda měsíčně/, KC, { max: 1 })),
    socialni_pojisteni: precti(qa(s, 'soc')) || precti(poStitku(s.radky, /^Sociální pojištění \(/, KC, { max: 1 })),
    zdravotni_pojisteni: zdr && doplatek ? { ...zdr, v: zdr.v + doplatek.v, raw: `${zdr.raw} + doplatek ${doplatek.raw}` } : zdr,
    dan_po_slevach: precti(poStitku(s.radky, /^Daň po slevách$/, KC, { max: 1 })),
    naklady_zamestnavatele: precti(poStitku(s.radky, /^Celkové náklady zaměstnavatele$/, KC, { max: 1 })),
    bonus: precti(qa(s, 'bonus')) || precti(poStitku(s.radky, /^Daňový bonus na děti$/, KC, { max: 1 })),
  };
  for (const [klic, ocek] of Object.entries(o)) {
    if (klic === 'socialni_pojisteni_stitek') k.push(cText(klic, ocek, (qa(s, 'soc-stitek') ?? s.text).match(/Sociální pojištění \(([\d,]+ %)\)/)?.[1] ?? null));
    else k.push(cNum(klic, ocek, mapa[klic], tol, { half: false }));
  }
  return { stranky: [page], kontroly: k };
};

/* Hypoteční a úvěrová kalkulačka */
R.splatka = async (p, env) => {
  const hypo = p.url === '/hypotecni-kalkulacka';
  const page = await env.nova(p.url);
  const v = p.vstupy, o = p.ocekavano;
  const sazba = norm(v.sazba_text).match(/^[\d.,]+/)[0];
  const neopustit = /NEopuštěno/.test(v.sazba_text);
  if (hypo) await prepis(page, '#propertyValue', v.cena);
  await prepis(page, '#loanAmount', v.uver);
  await prepis(page, '#loanPeriod', v.roky);
  await prepis(page, '#interestRate', sazba, { opustit: !neopustit });
  await page.waitForTimeout(400);
  const s = await snimek(page);
  const hodnoty = {
    mesicni_splatka: precti(poStitku(s.radky, /^Měsíční splátka$/, KC, { max: 1 })),
    celkem_zaplatite: precti(poStitku(s.radky, /^Celkem zaplatíte$/, KC, { max: 1 })),
    preplatite_na_urocich: precti(poStitku(s.radky, /^Přeplatíte na úrocích$/, KC, { max: 1 })),
    preplatek: precti(poStitku(s.radky, /^Přeplatek$/, KC, { max: 1 })),
    ltv_pct: precti(poStitku(s.radky, /^Poměr úvěru k ceně$/, PCT, { max: 1 })),
    pomer_preplatku: precti(poStitku(s.radky, /^Poměr přeplatku$/, PCT, { max: 1 })),
  };
  const k = [];
  for (const [klic, ocek] of Object.entries(o)) {
    if (klic === 'ltv_pct') k.push(cNum(klic, ocek, hodnoty[klic], 0.1));
    else if (klic === 'pomer_preplatku') k.push(cNum(klic, precti(ocek).v, hodnoty[klic], 0.05, { half: false }));
    else k.push(cNum(klic, ocek, hodnoty[klic], 1, { half: false }));
  }
  if (neopustit) k.push(cText('pole sazby během psaní', sazba, await page.locator('#interestRate').inputValue(), { druh: 'konzistence' }));
  return { stranky: [page], kontroly: k };
};

/* Nouzová rezerva */
R.nouzova = async (p, env) => {
  const page = await env.nova('/nouzova-rezerva');
  const v = p.vstupy, o = p.ocekavano;
  await prepis(page, '#expenses', v.vydaje);
  await prepis(page, '#savings', v.uspory);
  await prepis(page, '#capacity', v.sporeni);
  await prepis(page, '#family', v.osoby);
  // Volba, která v <select> není (osobni-23 „young“ po V12), dřív čekala 20 s na timeout → hned srozumitelná chyba.
  const vyber = async (sel, hodnota) => {
    const volby = await page.locator(`${sel} option`).evaluateAll((os) => os.map((o) => o.value));
    if (!volby.includes(hodnota)) throw new Error(`v ${sel} není volba „${hodnota}“ (jsou: ${volby.join(', ')})`);
    await page.selectOption(sel, hodnota);
  };
  if (v.job) await vyber('#job', v.job);
  if (v.smlouva) await vyber('#contract', v.smlouva);
  if (v.vek) await vyber('#age', v.vek);
  if (v.vzdel) await vyber('#education', v.vzdel);
  await page.locator('#second-income').setChecked(!!v.druhy);
  await page.locator('#debt').setChecked(!!v.dluh);
  await page.waitForTimeout(400);
  const s = await snimek(page);
  const k = [];
  const castka = precti(s.atributy.find((x) => x.a['data-qa'] === 'nouzova-castka')?.text);
  const mesicuText = s.text.match(/(\d+(?:,\d+)?) měsíc\S* nezbytných výdajů/)?.[1];
  const zbyva = poStitku(s.radky, /^ZBÝVÁ DOSPOŘIT$/i, /./, { max: 1 });
  const cas = poStitku(s.radky, /^ČAS DO CÍLE$/i, /./, { max: 1 });
  const pokryti = s.text.match(/pokryje (\d+(?:,\d+)?) měsíc/)?.[1];
  k.push(cNum('doporucena_castka', o.doporucena_castka, castka, 0, { half: false }));
  k.push(cNum('mesicu', o.mesicu, precti(mesicuText), 0.1, { half: false }));
  if (typeof o.zbyva_dosporit === 'number') k.push(cNum('zbyva_dosporit', o.zbyva_dosporit, precti(zbyva), 0, { half: false }));
  else k.push(cBool('zbyva_dosporit', zbyva && (zbyva.includes(o.zbyva_dosporit) || /splněn/i.test(zbyva) || precti(zbyva)?.v === 0), `„${o.zbyva_dosporit}“ (nebo 0 Kč)`, { skut: zbyva }));
  if (typeof o.cas_do_cile_mesicu === 'number') {
    if (o.cas_do_cile_mesicu === 0) k.push(cBool('cas_do_cile_mesicu', cas && (/splněn|hotovo|0 měs/i.test(cas) || precti(cas)?.v === 0 || !/\d/.test(cas)), '0 / cíl splněn', { skut: cas }));
    else k.push(cNum('cas_do_cile_mesicu', o.cas_do_cile_mesicu, precti(cas), 0, { half: false }));
  } else k.push(cText('cas_do_cile_mesicu', o.cas_do_cile_mesicu, cas));
  if (o.pokryti_mesicu !== undefined) k.push(cNum('pokryti_mesicu', o.pokryti_mesicu, precti(pokryti) ?? (o.pokryti_mesicu === 0 ? null : null), 0.1, { half: false }));
  return { stranky: [page], kontroly: k };
};

/* Kurzový dopad */
R.kurzovy = async (p, env) => {
  const page = await env.nova('/kurzovy-dopad');
  const v = p.vstupy, o = p.ocekavano;
  await prepis(page, '#portfolio', v.hodnota);
  await prepis(page, '#usdAlloc', v.usd_pct);
  await prepis(page, '#eurAlloc', v.eur_pct);
  await prepis(page, '#czkAlloc', v.czk_pct);
  await page.waitForTimeout(400);
  const s = await snimek(page);
  const od = indexRadku(s.radky, /^KURZOVÉ SCÉNÁŘE/i);
  const k = [];
  for (const [klic, ocek] of Object.entries(o)) {
    if (klic.startsWith('hodnota_')) {
      const nazev = klic.slice(8).replace(/_/g, ' ');
      const i = indexRadku(s.radky, new RegExp(`^${esc(nazev)}$`), Math.max(od, 0));
      k.push(cNum(klic, ocek, i >= 0 ? precti(poStitku(s.radky, /^Hodnota v Kč$/, KC, { od: i, max: 1 })) : null, 1, { half: false }));
    } else if (klic === 'kurzova_expozice_pct') k.push(cNum(klic, ocek, precti(poStitku(s.radky, /^Kurzová expozice$/, PCT, { max: 1 })), 0.1, { half: false }));
    else if (klic === 'historie_2017_pct') k.push(cNum(klic, ocek, precti(poStitku(s.radky, /^Posílení koruny 2017/, PCT, { max: 1 })), 0.1, { half: false }));
    else if (klic === 'historie_III_2020_pct') k.push(cNum(klic, ocek, precti(poStitku(s.radky, /^Oslabení koruny v březnu 2020/, PCT, { max: 1 })), 0.1, { half: false }));
  }
  return { stranky: [page], kontroly: k };
};

/* Kalkulačka nákladů /kde-koupit (data-za-nakup / data-za-rok) */
async function nakladyStranka(env, url, castka) {
  const page = await env.nova(url);
  await prepis(page, '#naklady-castka', castka);
  await page.waitForTimeout(400);
  return { page, s: await snimek(page) };
}
const radkyBrokeru = (s) => Object.fromEntries(s.atributy.filter((x) => x.tag === 'TR' && x.a['data-broker']).map((x) => [x.a['data-broker'], x]));
/** Štítek „nejlevnější pro X Kč“ v řádku tabulky (data-broker-odpoved v úvodu platí jen pro výchozích 2 000 Kč). */
const stitekNejlevnejsi = (s) => s.atributy.find((x) => x.tag === 'TR' && x.a['data-broker'] && /nejlevnější pro/.test(norm(x.text)))?.a['data-broker'] ?? null;
R.naklady = async (p, env) => {
  const { page, s } = await nakladyStranka(env, p.url, p.vstupy['#naklady-castka']);
  const kurz = await kurzStranky(s.text, p);
  const kc = Number(p.vstupy['#naklady-castka']);
  const model = kurz ? modelNakladu(kc, kurz.eur, kurz.usd) : null;
  const rows = radkyBrokeru(s);
  const k = [];
  const zlaty = kurz && kurz.datum === p.vstupy.kurz_CNB?.datum;
  for (const [klic, ocek] of Object.entries(p.ocekavano)) {
    if (klic === 'stitek_nejlevnejsi') {
      const ocekStitek = zlaty || !model ? ocek : nejlevnejsi(model);
      k.push(cText(klic, ocekStitek, stitekNejlevnejsi(s)));
      continue;
    }
    const [broker, pole] = klic.split('.');
    if (pole === 'celkem_Kc') continue; // naklady-13: jen podklad pro štítek
    const idx = pole === 'data-za-nakup' ? 0 : 1;
    const ocekKc = zlaty || !model ? ocek : Math.round(model[broker][idx]);
    k.push(cNum(klic, ocekKc, rows[broker] ? precti(rows[broker].a[pole]) : null, 1, { half: false }));
  }
  if (p.id === 'naklady-13' && kurz) { // S14: hranice T212/DEGIRO v hero
    const hranice = kurz.eur / 0.0015;
    const hero = precti(s.text.match(/Nejlevnější do ([\d ]+) Kč/)?.[1]);
    k.push(hero ? cNum('hero: hranice T212 → DEGIRO (Kč)', Math.round(hranice), hero, 1, { half: false }) : { ...neovereno('hero: hranice T212 → DEGIRO (Kč)', Math.round(hranice), 'věta „Nejlevnější do … Kč“ se v tomto rozložení nezobrazuje'), blokujeXpass: true });
  }
  return { stranky: [page], datum: kurz?.datum, kurzZlaty: zlaty, kurzPozn: kurz?.pozn, kontroly: k };
};
R.nakladyChovani = async (p, env) => {
  const { page, s } = await nakladyStranka(env, p.url, p.vstupy['#naklady-castka']);
  const rows = Object.values(radkyBrokeru(s));
  const hlaska = 'Zadejte částku od 100 do 1 000 000 Kč.';
  const pomlcky = rows.length > 0 && rows.every((r) => /^(—|-)?$/.test(norm(r.a['data-za-nakup'] ?? '').trim()));
  const k = [];
  if (p.ocekavano.pole_po_opusteni != null) {
    // naklady-15/16: mimo rozsah → po opuštění pole ořez na mez s hláškou „Upraveno do povoleného rozsahu…“
    // (sdílené CisloInput, ZAMERNA-ROZHODNUTI „ořez na min/max až při opuštění pole“). Řádky pak platí
    // pro zobrazenou (ořezanou) částku – ověřeno nezávisle na T212 (0,15 %) a XTB (0,5 %), bez kurzu.
    const o = p.ocekavano;
    k.push(cBool('hlaska', s.text.includes(o.hlaska), o.hlaska));
    k.push(cText('pole_po_opusteni', o.pole_po_opusteni, await page.locator('#naklady-castka').inputValue()));
    for (const klic of ['trading212.data-za-nakup', 'xtb.data-za-nakup']) {
      const [broker, pole] = klic.split('.');
      k.push(cNum(klic, Math.round(o[klic]), rows.find((r) => r.a['data-broker'] === broker) ? precti(rows.find((r) => r.a['data-broker'] === broker).a[pole]) : null, 0, { half: false }));
    }
  } else if (p.ocekavano.hlaska) {
    k.push(cBool('hlaska', s.text.includes(hlaska), hlaska));
    k.push(cBool('vsechny_radky', pomlcky, '— u všech brokerů', { skut: rows.map((r) => `${r.a['data-broker']}=${r.a['data-za-nakup']}`).join(', ') }));
  } else { // naklady-17 „100.000“
    const t212 = rows.find((r) => r.a['data-broker'] === 'trading212');
    const ok = Number(t212?.a['data-za-nakup']) === 150 || (s.text.includes(hlaska) && pomlcky) || /neplatn/i.test(s.text);
    k.push(cBool('castka_Kc', ok, p.ocekavano.castka_Kc, { skut: `pole „${await page.locator('#naklady-castka').inputValue()}“, T212 za nákup ${t212?.a['data-za-nakup']} Kč` }));
  }
  return { stranky: [page], kontroly: k };
};
R.nakladyIsin = async (p, env) => {
  const { page, s } = await nakladyStranka(env, p.url, p.vstupy['#naklady-castka']);
  const kurz = await kurzStranky(s.text, p);
  const zlaty = kurz && kurz.datum === p.vstupy.kurz_CNB?.datum;
  const eur = kurz?.eur;
  const o = p.ocekavano;
  const ocek = (klic, vzorec) => (zlaty || !eur ? o[klic] : Math.round(vzorec));
  const deg = s.tabulky.flatMap((t) => t).find((r) => /^DEGIRO/.test(r[0] || ''));
  const dvojice = (b) => (b?.match(/([\d ]+) Kč \/ ([\d ]+) Kč/) || []).slice(1).map(precti);
  const [ve, mimo] = dvojice(deg?.[1]);
  const [rVe, rMimo] = dvojice(deg?.[4]);
  return {
    stranky: [page], datum: kurz?.datum, kurzZlaty: zlaty,
    kontroly: [
      cNum('degiro.ve_vyberu_Kc', ocek('degiro.ve_vyberu_Kc', eur), ve, 1, { half: false }),
      cNum('degiro.mimo_Kc', ocek('degiro.mimo_Kc', 3 * eur), mimo, 1, { half: false }),
      cNum('degiro.rocne_ve_vyberu_Kc', ocek('degiro.rocne_ve_vyberu_Kc', 12 * eur), rVe, 1, { half: false }),
      cNum('degiro.rocne_mimo_Kc', ocek('degiro.rocne_mimo_Kc', 36 * eur), rMimo, 1, { half: false }),
      cNum('degiro.burza_max_Kc', ocek('degiro.burza_max_Kc', 2.5 * eur), precti(deg?.[4]?.match(/až ([\d ]+) Kč ročně za burzu/)?.[1]), 1, { half: false }),
      cText('stitek_nejlevnejsi', zlaty || !kurz ? o.stitek_nejlevnejsi : nejlevnejsi(modelNakladu(2000, kurz.eur, kurz.usd)), stitekNejlevnejsi(s)),
    ],
  };
};
R.recenze = async (p, env) => {
  const s = await env.staticka(p.url);
  const kde = await env.staticka('/kde-koupit');
  const kurz = await kurzStranky(kde.text, p);
  const zlaty = kurz && kurz.datum === p.vstupy.kurz_CNB?.datum;
  const eur = kurz?.eur ?? p.vstupy.kurz_CNB.eurCzk;
  const i = indexRadku(s.radky, /^Nákup za 2 000 Kč/);
  const priklad = i >= 0 ? s.radky.slice(i + 1, i + 3).find((l) => /Kč/.test(l)) : null;
  const rozpis = i >= 0 ? s.radky.slice(i + 1, i + 5).find((l) => /^poplatek/.test(l)) : null;
  const o = p.ocekavano, k = [];
  const broker = p.url.split('/').pop();
  if (o.celkem_Kc_nejvys !== undefined) { // naklady-22 (IBKR, V13)
    const x = precti(priklad);
    k.push({ klic: 'celkem_Kc_nejvys', ocek: `≤ ${o.celkem_Kc_nejvys}`, skut: priklad, ok: !!x && x.v <= o.celkem_Kc_nejvys, druh: 'hodnota' });
    return { datum: kurz?.datum, kontroly: k };
  }
  const model = { degiro: [eur, 0], xtb: [0, 0.005 * 2000], trading212: [0, 0.0015 * 2000], fio: [3.95 * eur, null] }[broker];
  const ocekPoplatek = zlaty ? o.poplatek_Kc : Math.round(model[0]);
  k.push(cNum('poplatek_Kc', ocekPoplatek, precti(rozpis?.match(/poplatek ([\d ]+) Kč/)?.[1]), 1, { half: false }));
  if (o.smena_Kc !== undefined) k.push(cNum('smena_Kc', zlaty ? o.smena_Kc : Math.round(model[1]), precti(rozpis?.match(/směna ([\d ]+) Kč/)?.[1]), 1, { half: false }));
  if (o.smena !== undefined) k.push(cBool('smena', !!rozpis && rozpis.includes(o.smena), `„${o.smena}“`, { skut: rozpis }));
  const pc = (x) => (norm(x).match(/\d+(?:,\d+)?/g) || []).map((c) => Number(c.replace(',', '.')));
  const [oKc, oPct] = pc(o.priklad);
  const [sKc, sPct] = pc(priklad || '');
  k.push(cNum('priklad – Kč', zlaty ? oKc : ocekPoplatek + Math.round(model[1] || 0), cislo(sKc), 1, { half: false }));
  if (oPct !== undefined) k.push(cNum('priklad – %', oPct, cislo(sPct), 0.05, { half: false }));
  if (/^od /.test(o.priklad)) k.push(cBool('priklad – „od“', /^od /.test(priklad || ''), '„od …“ (část nákladu neznáme)', { skut: priklad }));
  return { datum: kurz?.datum, kurzZlaty: zlaty, kontroly: k };
};

/* Detail fondu: CZK / EUR / USD */
async function vynosyDetailu(page) {
  const s = await snimek(page);
  const roky = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('main button[aria-label]')].map((b) => b.getAttribute('aria-label').replace(/[  ]/g, ' ').match(/^(?:Letos \()?(\d{4})\)?: ([+−-]?[\d,]+) % v (\S+)/)).filter(Boolean).map((m) => [m[1], { v: m[2], mena: m[3] }])));
  return { s, roky };
}
R.detail = async (p, env) => {
  const page = await env.nova(p.url);
  const o = p.ocekavano, k = [];
  const czk = await vynosyDetailu(page);
  const dn = atribut(czk.s, 'data-vynosy-k') || null;
  const letos = String(new Date(`${dn || p.datum_dat}T00:00:00Z`).getUTCFullYear());
  const tolPct = 0.1, tolUsd = 0.2;
  const hl = (s, re) => precti(poStitku(s.radky, re, PCT, { max: 1 }));
  const r1 = hl(czk.s, /^1 rok$/), r3 = hl(czk.s, /^3 roky celkem$/), r5 = hl(czk.s, /^5 let celkem$/);
  const k10 = (re) => precti(poStitku(czk.s.radky, re, KC, { max: 1 }));
  k.push(cNum('10000Kc_pred_1_lety', o['10000Kc_pred_1_lety'], k10(/^před rokem$/), 2));
  k.push(cNum('10000Kc_pred_3_lety', o['10000Kc_pred_3_lety'], k10(/^před 3 lety$/), 2));
  k.push(cNum('10000Kc_pred_5_lety', o['10000Kc_pred_5_lety'], k10(/^před 5 lety$/), 2));
  k.push(cNum('vynos_1R_CZK_%', o['vynos_1R_CZK_%'], r1, tolPct));
  k.push(cNum('vynos_3R_CZK_%', o['vynos_3R_CZK_%'], r3, tolPct));
  k.push(cNum('vynos_5R_CZK_%', o['vynos_5R_CZK_%'], r5, tolPct));
  const rokKlic = (rok) => (rok === letos ? 'letos' : rok);
  for (const [rok, x] of Object.entries(czk.roky)) if (o[`rok_${rokKlic(rok)}_CZK_%`] !== undefined) k.push(cNum(`rok_${rokKlic(rok)}_CZK_%`, o[`rok_${rokKlic(rok)}_CZK_%`], precti(x.v), tolPct));
  // Konzistence (platí každý den bez ohledu na datum dat): 10 000 Kč × (1 + výnos) a stáří dat.
  const k1 = k10(/^před rokem$/);
  if (k1 && r1) k.push(cNum('konzistence: 10 000 Kč před rokem = 10 000 × (1 + výnos 1 rok)', 10000 * (1 + r1.v / 100), k1, 2 + 10000 * r1.half / 100, { druh: 'konzistence', half: false }));
  if (dn) k.push(cBool('konzistence: stáří dat výnosů ≤ 5 pracovních dnů', pracovnichDnuOd(dn) <= 5, `data k ${dn}`, { druh: 'konzistence', skut: `${pracovnichDnuOd(dn)} prac. dnů` }));
  // EUR
  await klikni(page, page.getByRole('button', { name: 'EUR', exact: true }).first());
  await page.waitForTimeout(600);
  const eur = await vynosyDetailu(page);
  for (const [klic, re] of [['vynos_1R_EUR_%', /^1 rok$/], ['vynos_3R_EUR_%', /^3 roky celkem$/], ['vynos_5R_EUR_%', /^5 let celkem$/]]) {
    const iVynos = indexRadku(eur.s.radky, /^Výnos v EUR$/);
    k.push(iVynos >= 0 ? cNum(klic, o[klic], precti(poStitku(eur.s.radky, re, PCT, { max: 1, od: iVynos })), tolPct) : neovereno(klic, o[klic], 'blok „Výnos v EUR“ se po přepnutí měny nezobrazil'));
  }
  for (const [rok, x] of Object.entries(eur.roky)) if (x.mena === 'EUR' && o[`rok_${rokKlic(rok)}_EUR_%`] !== undefined) k.push(cNum(`rok_${rokKlic(rok)}_EUR_%`, o[`rok_${rokKlic(rok)}_EUR_%`], precti(x.v), tolPct));
  // USD
  await klikni(page, page.getByRole('button', { name: 'USD', exact: true }).first());
  await page.waitForTimeout(600);
  const usd = await vynosyDetailu(page);
  for (const [rok, x] of Object.entries(usd.roky)) if (x.mena === 'USD' && o[`rok_${rokKlic(rok)}_USD_%_krizovy_CNB`] !== undefined) k.push(cNum(`rok_${rokKlic(rok)}_USD_%`, o[`rok_${rokKlic(rok)}_USD_%_krizovy_CNB`], precti(x.v), tolUsd));
  // Stejný výnos v různých měnách = chyba (audit 17. 10.: SXR8 2025 v USD +0,02 % místo +17,6 %).
  const c25 = precti(czk.roky['2025']?.v), u25 = usd.roky['2025']?.mena === 'USD' ? precti(usd.roky['2025'].v) : null;
  if (c25 && u25) k.push(cBool('konzistence: výnos 2025 v Kč ≠ v USD', Math.abs(c25.v - u25.v) > 0.5, 'liší se (kurz USD/CZK 2025 −14 %)', { druh: 'konzistence', skut: `Kč ${c25.raw} / USD ${u25.raw}` }));
  return { stranky: [page], datum: dn, kontroly: k };
};
R.porovnaniUsd = async (p, env) => {
  const page = await env.nova(p.url);
  await klikni(page, page.getByRole('button', { name: 'USD', exact: true }).first());
  await page.waitForTimeout(700);
  const s = await snimek(page);
  const tab = s.tabulky.find((t) => radekTab(t, /^3 roky celkem$/));
  const k = [];
  for (const [klic, re] of [['SXR8.1R_USD_%', /^1 rok$/], ['SXR8.3R_USD_%', /^3 roky celkem$/], ['SXR8.5R_USD_%', /^5 let celkem$/]]) k.push(cNum(klic, p.ocekavano[klic], precti(radekTab(tab, re)?.[1]), 0.1));
  return { stranky: [page], datum: datum(s.text.match(/Data k ([^\n]*\d{4})/)?.[1]), kontroly: k };
};
R.zaokrouhleni = async (p, env) => {
  const det = await env.staticka('/etf/IE00B4L5Y983');
  const por = await env.staticka('/srovnani/porovnani?isins=IE00B5BMR087,IE00BK5BQT80,IE00B4L5Y983');
  const tD = det.tabulky.find((t) => radekTab(t, /^Max\. pokles$/));
  const c3 = tD ? tD[0].findIndex((h) => /^3 roky$/.test(h)) : -1;
  const vDet = radekTab(tD, /^Max\. pokles$/)?.[c3] ?? null;
  const tP = por.tabulky.find((t) => radekTab(t, /^Max\. pokles 3 roky$/));
  const cE = tP ? tP[0].findIndex((h) => /EUNL/.test(h)) : -1;
  const vPor = radekTab(tP, /^Max\. pokles 3 roky$/)?.[cE >= 0 ? cE : 3] ?? null;
  return {
    datum: atribut(det, 'data-vynosy-k') || null,
    kontroly: [cText('detail', p.ocekavano.detail, vDet), cText('porovnani', p.ocekavano.porovnani, vPor), cBool('stejné číslo na obou stránkách', vDet && vDet === vPor, 'detail = porovnání', { druh: 'konzistence', skut: `${vDet} / ${vPor}` })],
  };
};

/* Kvíz /vyber-etf */
async function kviz(page, odpovedi) {
  for (const o of odpovedi) {
    const b = tlacitko(page, o);
    await b.waitFor({ timeout: 10000 });
    await klikni(page, b);
    await page.waitForTimeout(120);
  }
  await cekejNaText(page, /PODLE VAŠICH ODPOVĚDÍ/i, 10000).catch(() => {});
}
R.kviz = async (p, env) => {
  const page = await env.nova('/vyber-etf');
  await kviz(page, p.vstupy.odpovedi);
  const s = await snimek(page);
  const o = p.ocekavano, k = [];
  const fond = s.text.match(/za 5 let v Kč ([+−-]?[\d,]+) % \(celkem, data k ([^)]+)\)/);
  const dn = datum(fond?.[2]) || datum(s.text.match(/Backtest [^–\n]*– ([^,\n]*\d{4})/)?.[1]);
  if (o.odkaz) {
    const odkazy = await page.evaluate(() => [...document.querySelectorAll('main a[href^="/etf/"]')].map((a) => a.getAttribute('href')));
    k.push(cBool('odkaz', odkazy.includes(o.odkaz), o.odkaz, { skut: odkazy.join(', ') || '—' }));
  }
  if (o.r5_CZK_ !== undefined || o['r5_CZK_%'] !== undefined) k.push(cNum('r5_CZK_%', o['r5_CZK_%'], precti(fond?.[1]), 0.1));
  if (o['max_propad_CZK_%'] !== undefined) {
    const m = s.text.match(/[Nn]ejvětší propad – [^:]+: ([−-][\d,]+) % v Kč/);
    k.push(cNum('max_propad_CZK_%', o['max_propad_CZK_%'], precti(m?.[1]), 0.3));
  }
  const datumBacktestu = datum(s.text.match(/Backtest [^–\n]*– ([^,\n]*\d{4})/)?.[1]);
  return { stranky: [page], datum: o['max_propad_CZK_%'] !== undefined ? (datumBacktestu === p.vstupy.do ? p.datum_dat : datumBacktestu) : dn, kontroly: k };
};
R.kvizVse = async (p, env) => {
  const page = await env.nova('/vyber-etf');
  const H = ['Kratší než 3 roky', '3–10 let', '10 let a víc'], RI = ['Nechci velké propady', 'Zvládnu střední výkyvy', 'Zvládnu velké výkyvy'];
  const F = { 'Celý svět': 'Celosvětové ETF', 'Hlavně USA (S&P 500)': 'S&P 500 ETF', Evropa: 'Evropské ETF', 'Chci pravidelný příjem': 'Dividendové ETF', Technologie: 'Technologické ETF', 'Odpovědně / ESG': 'ESG ETF' };
  const D = ['Reinvestovat (růst)', 'Vyplácet na účet', 'Nevím'];
  const CATS_VVETE = { 'Celý svět': 'celosvětové ETF', 'Hlavně USA (S&P 500)': 'ETF na S&P 500', Evropa: 'evropské ETF', 'Chci pravidelný příjem': 'dividendové ETF', Technologie: 'technologické ETF', 'Odpovědně / ESG': 'ESG ETF' };
  let cesty = [];
  for (const h of H) for (const r of RI) for (const f of Object.keys(F)) for (const d of D) cesty.push([h, r, f, d]);
  if (env.mobil) cesty = cesty.filter((_, i) => i % 7 === 0); // WebKit: vzorek 24 cest (jako audit)
  const chyby = [];
  for (const c of cesty) {
    await kviz(page, c);
    const t = norm(await page.evaluate(() => (document.querySelector('main') || document.body).innerText));
    const vysledek = t.slice(t.search(/PODLE VAŠICH ODPOVĚDÍ/i), t.search(/Jak průvodce funguje/));
    const nadpis = vysledek.split('\n').map((x) => x.trim()).filter(Boolean)[1] || '';
    // Pravidla (recommend ve vyberEtfData.ts po V15, audit 22. 10. 2026): <3 roky → dluhopisové ETF; jinak „Nechci velké
    // propady“ → konzervativní portfolia s dluhopisy, „Zvládnu střední výkyvy“ → umírněná portfolia (akcie s částí
    // dluhopisů), obojí s druhou možností = kategorie zaměření; „Zvládnu velké výkyvy“ → rovnou kategorie zaměření.
    const sPortfolii = c[0] !== H[0] && (c[1] === RI[0] || c[1] === RI[1]);
    const ocekNadpis = c[0] === H[0] ? 'Dluhopisové ETF' : c[1] === RI[0] ? 'Portfolia s dluhopisy' : c[1] === RI[1] ? 'Akcie s částí dluhopisů' : F[c[2]];
    const vady = [];
    if (nadpis !== ocekNadpis) vady.push(`nadpis „${nadpis}“ ≠ „${ocekNadpis}“`);
    if (/undefined|NaN|Infinity|\bnull\b/.test(vysledek)) vady.push('zakázaný text');
    if (sPortfolii && !vysledek.includes(`Druhá možnost: ${CATS_VVETE[c[2]]}`)) vady.push(`chybí druhá možnost „${CATS_VVETE[c[2]]}“`);
    if (!sPortfolii && vysledek.includes('Druhá možnost:')) vady.push('druhá možnost navíc');
    if (c[3] === D[1] && !/Příklad je distribuční \(Dist\)/.test(vysledek)) vady.push('příklad není distribuční');
    if (c[3] === D[0] && !/Příklad je akumulační \(Acc\)/.test(vysledek)) vady.push('příklad není akumulační');
    if (c[0] !== H[0] && c[2] === 'Technologie' && !/Technologie jsou volatilnější/.test(vysledek)) vady.push('chybí varování u technologií');
    // V15: horizont 3–10 let = varování o délce propadu (fakt z delší historie S&P 500), jinde ne.
    if ((c[0] === H[1]) !== /Horizont 3–10 let je na akcie krátký/.test(vysledek)) vady.push(c[0] === H[1] ? 'chybí varování 3–10 let' : 'varování 3–10 let navíc');
    // S17: pravidelný příjem + reinvestovat si odporují → upozornění.
    if ((c[2] === 'Chci pravidelný příjem' && c[3] === D[0]) !== /to si odporuje/.test(vysledek)) vady.push('upozornění příjem × reinvestice nesedí');
    if (vady.length) chyby.push(`${c.join(' / ')}: ${vady.join('; ')}`);
    await klikni(page, page.getByRole('button', { name: /Znovu/ }).first());
    await page.waitForTimeout(150);
  }
  return { stranky: [page], kontroly: [cBool(`všechny cesty (${cesty.length})`, chyby.length === 0, 'nadpis, třída příkladu, varování a bez zakázaných textů podle pravidel', { skut: chyby.length ? `${chyby.length} vadných: ${chyby.slice(0, 5).join(' | ')}` : 'vše OK' })] };
};

/** Přiřazení případu k řidiči. */
function ridic(p) {
  const id = p.id, u = p.url;
  if (u === 'POST /api/backtest/simulate') return R.api;
  if (id === 'backtest-41') return R.inflace;
  if (['investicni-37', 'investicni-38', 'investicni-39'].includes(id)) return R.rychleVolby;
  if (id === 'investicni-40') return R.doopravdy;
  if (['investicni-41', 'investicni-42'].includes(id)) return R.investicniMale;
  if (u === '/investicni-kalkulacka') return R.investicniKalk;
  if (id === 'investicni-14') return R.poplatkyHero;
  if (u === '/kalkulacka') return R.poplatkyKalk;
  if (u === '/kolik-investovat-mesicne') return R.kolikInvestovat;
  if (u === '/investovani-pro-deti') return R.deti;
  if (u === '/dip') return R.dip;
  if (u === '/pruvodce') return R.pruvodce;
  if (u.startsWith('/stroj-casu')) return R.strojCasu;
  if (u === '/fire-kalkulacka') return R.fire;
  if (u === '/monte-carlo') return R.monteCarlo;
  if (u === '/pravidlo-4-procent') return R.pravidlo4;
  if (u === '/fire') return R.fireStranka;
  if (id === 'backtest-42') return R.backtestKratky;
  if (id === 'backtest-43') return R.backtestTecka;
  if (u.startsWith('/backtest?')) return R.backtestUI;
  if (u.startsWith('/portfolio-strategie/')) return R.strategie;
  if (u === '/faktorove-etf (+ podstránka)') return R.faktor;
  if (id === 'backtest-31') return R.rocenka;
  if (id === 'backtest-37') return R.vydelalyMesicne;
  if (id === 'backtest-38') return R.klouzava;
  if (id === 'backtest-39') return R.sp500Text;
  if (id === 'backtest-40') return R.jakDlouho;
  if (/kolik-vydelaly-etf/.test(u)) return R.vydelaly;
  if (u === '/cisty-plat') return R.cistyPlat;
  if (u === '/hypotecni-kalkulacka' || u === '/uverova-kalkulacka') return R.splatka;
  if (u === '/nouzova-rezerva') return R.nouzova;
  if (u === '/kurzovy-dopad') return R.kurzovy;
  if (u === '/kde-koupit' && p.typ === 'chovani') return R.nakladyChovani;
  if (u === '/kde-koupit') return R.naklady;
  if (u.startsWith('/kde-koupit?isin=')) return R.nakladyIsin;
  if (u.startsWith('/recenze/')) return R.recenze;
  if (id === 'naklady-28') return R.zaokrouhleni;
  if (u.startsWith('/etf/')) return R.detail;
  if (u.startsWith('/srovnani/porovnani')) return R.porovnaniUsd;
  if (u === '/vyber-etf' && p.typ === 'chovani') return R.kvizVse;
  if (u === '/vyber-etf') return R.kviz;
  return null;
}
/** Případ běží jen jednou (ne v každém prohlížeči): API a čistě serverová čísla. */
const jenJednou = (p) => p.url === 'POST /api/backtest/simulate' || p.id === 'backtest-41';

// ───────────────────────────── vyhodnocení ─────────────────────────────

function vyhodnot(p, prohlizec, vysledek) {
  const varovaniKlice = new Set(p.jen_varovani_klice?.klice || []);
  const datumStranky = vysledek.datum || null;
  const datumSedi = !p.zavisi_na_datu || p.zavisi_na_datu === 'kurz ČNB'
    ? vysledek.kurzZlaty !== false || !vysledek.kurzPozn // kurz: model se přepočítal z ČNB → brána; bez kurzu → varování
    : !datumStranky || !p.datum_dat || datumStranky === p.datum_dat;
  const kontroly = (vysledek.kontroly || []).map((k) => {
    let uroven = 'brana';
    if (k.druh === 'neovereno') uroven = 'info';
    else if (k.druh === 'varovani') uroven = 'varovani';
    else if (k.druh === 'konzistence') uroven = 'brana';
    else if ([...varovaniKlice].some((v) => k.klic === v || k.klic.startsWith(`${v} `))) uroven = 'varovani';
    else if (!datumSedi) uroven = 'varovani';
    return { ...k, uroven };
  });
  const brana = kontroly.filter((k) => k.uroven === 'brana');
  const selhaneBrany = brana.filter((k) => !k.ok);
  const varovani = kontroly.filter((k) => k.uroven === 'varovani' && !k.ok);
  let stav;
  const pozn = [];
  if (vysledek.chyba) pozn.push(`chyba průběhu: ${vysledek.chyba}`);
  if (!datumSedi && datumStranky) pozn.push(`stránka má data k ${datumStranky}, zlatý případ k ${p.datum_dat} → hodnoty jen jako varování, brána = konzistence`);
  if (vysledek.kurzPozn) pozn.push(vysledek.kurzPozn);
  if (vysledek.neovereno) { stav = 'NEOVĚŘENO'; pozn.push(vysledek.neovereno); }
  // XPASS jen když se kontrola, kvůli které případ selhával, opravdu ověřila (blokujeXpass = klíč chyby se nedal přečíst)
  else if (p.dnes_selze && !(p.dnes_selze.opraveno && !PRODUKCE)) stav = selhaneBrany.length || vysledek.chyba ? 'XFAIL' : brana.length && !kontroly.some((k) => k.blokujeXpass) ? 'XPASS' : 'NEOVĚŘENO';
  else if (vysledek.chyba || selhaneBrany.length) stav = 'SELHALO';
  else if (!brana.length && !varovani.length) stav = kontroly.some((k) => k.uroven === 'varovani') ? 'OK' : 'NEOVĚŘENO'; // data k jinému dni, hodnoty v toleranci
  else stav = varovani.length ? 'VAROVÁNÍ' : 'OK';
  if (p.zmeni_se_po_oprave && stav === 'SELHALO') pozn.push(`pozor: ${p.zmeni_se_po_oprave} – pokud byla oprava nasazena, přepočítej zlatý případ`);
  if (p.dnes_selze?.opraveno && !PRODUKCE) pozn.push(`oprava ${p.dnes_selze.opraveno.commit || ''} čeká na nasazení – mimo produkci se hodnotí přísně`);
  const chyba = p.dnes_selze ? `${p.dnes_selze.chyba}${p.dnes_selze.opraveno && PRODUKCE ? ` – oprava v repu (${p.dnes_selze.opraveno.commit || p.dnes_selze.opraveno.datum}), po nasazení odeber dnes_selze` : ''}` : undefined;
  return { id: p.id, nastroj: p.nastroj, url: p.url, prohlizec, stav, kontroly, selhaneBrany, varovani, pozn, chyba };
}

// ───────────────────────────── běh ─────────────────────────────

const vysledky = [];
const zakazaneNalezy = [];
const znameNalezy = [];
const znameVadyNalezy = [];
const videneZname = new Set();

async function behProhlizece(nazev) {
  const typ = nazev === 'webkit' ? webkit : chromium;
  let browser;
  const spust = async () => { browser = await typ.launch(); };
  try { await spust(); } catch (e) {
    console.log(`⚠️  ${nazev} není nainstalovaný – přeskakuji (${String(e).split('\n')[0].slice(0, 120)})`);
    return { preskoceno: true };
  }
  const mobil = nazev === 'webkit';
  const nastaveni = mobil
    ? { ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, hasTouch: true, locale: 'cs-CZ' }
    : { viewport: { width: 1440, height: 900 }, locale: 'cs-CZ' };
  let kontextyPripadu = [];
  let vadyPripadu = []; // kontexty aktuálního případu – zavírají se VŽDY (i po chybě), jinak se WebKit zahltí
  const novyKontext = async () => {
    const ctx = await browser.newContext(nastaveni);
    await ctx.route(MERENI, (r) => r.abort()); // NIKDY neměřit (GA, Vercel Analytics, /api/ev)
    await REZIM.hlidejKontext(ctx); // ISR: na produkci žádný prefetch/navigace na detail fondu / dvojici mimo pevnou sadu
    await ctx.addInitScript(() => { try { localStorage.clear(); sessionStorage.clear(); } catch { /* bez úložiště */ } });
    return ctx;
  };
  let statickyCtx = await novyKontext();
  /** Prohlížeč spadl nebo zamrzl (goto timeout) → zavřít a spustit znovu, statický kontext i mezipaměť nanovo. */
  const restart = async (proc) => {
    console.log(`↻ ${nazev}: restart prohlížeče (${proc})`);
    await browser.close().catch(() => {});
    await spust();
    statickyCtx = await novyKontext();
    cache.clear();
  };
  const cache = new Map();
  const zkontrolovaneUrl = new Set();
  const zakazaneNaStrance = async (page, url, kontext) => {
    for (const n of (await zakazaneTexty(page, url).catch(() => [])) || []) {
      if (n.znama) { znameNalezy.push({ prohlizec: nazev, url, kontext, nalez: n.ukazka, chyba: n.znama.chyba }); videneZname.add(n.znama); }
      else zakazaneNalezy.push({ prohlizec: nazev, url, kontext, nalez: n.ukazka });
    }
    const js = jsChybyStranky.get(page) || [];
    if (js.length) zakazaneNalezy.push({ prohlizec: nazev, url, kontext, nalez: `JS chyba: ${js[0]}` });
  };
  const env = {
    mobil,
    async nova(url) {
      const ctx = await novyKontext();
      kontextyPripadu.push(ctx);
      const page = await otevri(ctx, url);
      page.dotyk = mobil;
      page.vady = vadyPripadu;
      return page;
    },
    async staticka(url) {
      if (!cache.has(url)) cache.set(url, (async () => {
        const page = await otevri(statickyCtx, url);
        page.dotyk = mobil;
        const s = await snimek(page);
        if (!zkontrolovaneUrl.has(url)) { zkontrolovaneUrl.add(url); await zakazaneNaStrance(page, url, 'po načtení'); }
        await page.close();
        return s;
      })());
      cache.get(url).catch(() => cache.delete(url)); // neúspěšné načtení necachovat
      return cache.get(url);
    },
  };

  const pripady = DATA.pripady.filter((p) => !JEN || JEN.some((j) => p.id.startsWith(j)));
  for (const p of pripady) {
    if (jenJednou(p) && nazev !== PROHLIZECE.find((x) => x)) continue;
    const fn = ridic(p);
    let vysledek;
    const start = Date.now();
    if (!fn) vysledek = { neovereno: 'pro případ není řidič testu' };
    else {
      for (let pokus = 1; pokus <= 2; pokus++) {
        try {
          if (!browser.isConnected()) await restart('prohlížeč se odpojil');
          vysledek = await fn(p, env);
          for (const page of vysledek.stranky || []) await zakazaneNaStrance(page, p.url, `po zadání vstupů případu ${p.id}`);
        } catch (e) {
          vysledek = { kontroly: [], chyba: String(e.message || e).split('\n')[0].slice(0, 220) };
        } finally {
          for (const c of kontextyPripadu) await c.close().catch(() => {});
          kontextyPripadu = [];
          if (vadyPripadu.length) { znameVadyNalezy.push({ prohlizec: nazev, id: p.id, url: p.url, vady: [...new Set(vadyPripadu)] }); vadyPripadu.length = 0; }
        }
        // Zamrzlý / spadlý prohlížeč (ne chyba webu) → restart a jeden opakovaný pokus.
        if (pokus === 1 && vysledek.chyba && /page\.goto: Timeout|has been closed|crashed|disconnected/.test(vysledek.chyba)) { await restart(vysledek.chyba.slice(0, 60)); continue; }
        break;
      }
    }
    const v = vyhodnot(p, jenJednou(p) ? 'api' : nazev, vysledek);
    v.ms = Date.now() - start;
    vysledky.push(v);
    const ikona = { OK: '✅', SELHALO: '❌', XFAIL: '🟡', XPASS: '🔔', 'VAROVÁNÍ': '⚠️ ', 'NEOVĚŘENO': '❔' }[v.stav];
    const detail = v.stav === 'SELHALO' || v.stav === 'XFAIL'
      ? (v.selhaneBrany.slice(0, 3).map((k) => `${k.klic}: čekáno ${k.ocek}, je ${k.skut}${k.pozn ? ` (${k.pozn})` : ''}`).join('; ') || v.pozn.join('; '))
      : v.stav === 'VAROVÁNÍ' ? v.varovani.slice(0, 2).map((k) => `${k.klic}: čekáno ${k.ocek}, je ${k.skut}`).join('; ') : v.pozn.join('; ');
    console.log(`${ikona} [${v.prohlizec}] ${p.id} ${v.stav}${detail ? ' – ' + detail : ''}`);
  }
  await browser.close().catch(() => {});
  return { preskoceno: false };
}

const zacatek = new Date();
console.log(`Zlaté případy: ${DATA.pripady.length} (${DATA.meta.data_k}) → ${BASE}, prohlížeče ${PROHLIZECE.join(' + ')}`);
const preskoceneProhlizece = [];
for (const nazev of PROHLIZECE) {
  const r = await behProhlizece(nazev);
  if (r.preskoceno) preskoceneProhlizece.push(nazev);
}

// ───────────────────────────── přehled ─────────────────────────────

const pocty = {};
for (const v of vysledky) pocty[v.stav] = (pocty[v.stav] || 0) + 1;
const selhalo = vysledky.filter((v) => v.stav === 'SELHALO');
const xpass = vysledky.filter((v) => v.stav === 'XPASS');
const poplach = selhalo.length > 0 || zakazaneNalezy.length > 0 || REZIM.poruseni.length > 0;
const bunkaMd = (s) => String(s ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 160);

const md = [];
md.push(`## Zlaté případy nástrojů – ${poplach ? '❌ POPLACH' : '✅ bez poplachu'}`);
md.push(`${BASE} · ${zacatek.toISOString().slice(0, 16).replace('T', ' ')} UTC · zlaté případy k ${DATA.meta.data_k} · přímých volání API backtestu ${apiVolani}/${MAX_API}${preskoceneProhlizece.length ? ` · ⚠️ nespuštěno: ${preskoceneProhlizece.join(', ')}` : ''}`);
md.push('', ...REZIM.souhrn().map((r) => (r.startsWith('  - ') ? r : `_${r}_`)), '');
md.push(`| Stav | Počet |\n|---|---|\n${['OK', 'SELHALO', 'XFAIL', 'XPASS', 'VAROVÁNÍ', 'NEOVĚŘENO'].map((s) => `| ${s} | ${pocty[s] || 0} |`).join('\n')}\n| zakázané texty / JS chyby (poplach) | ${zakazaneNalezy.length} |\n| známé zakázané texty (XFAIL) | ${znameNalezy.length} |`);
if (selhalo.length) {
  md.push('\n### ❌ Selhalo (poplach)\n| Případ | Prohlížeč | Klíč | Čekáno | Na webu | Tolerance |\n|---|---|---|---|---|---|');
  for (const v of selhalo) {
    if (!v.selhaneBrany.length) md.push(`| ${v.id} ${bunkaMd(v.nastroj)} | ${v.prohlizec} | — | — | ${bunkaMd(v.pozn.join('; '))} | — |`);
    for (const k of v.selhaneBrany.slice(0, 6)) md.push(`| ${v.id} ${bunkaMd(v.nastroj)} | ${v.prohlizec} | ${bunkaMd(k.klic)} | ${bunkaMd(k.ocek)} | ${bunkaMd(k.skut)}${k.pozn ? ` (${bunkaMd(k.pozn)})` : ''} | ${k.tol ?? '—'} |`);
  }
}
if (zakazaneNalezy.length) {
  md.push('\n### ❌ Zakázané texty a JS chyby na stránkách nástrojů\n| Stránka | Prohlížeč | Kdy | Nález |\n|---|---|---|---|');
  for (const z of zakazaneNalezy) md.push(`| ${bunkaMd(z.url)} | ${z.prohlizec} | ${bunkaMd(z.kontext)} | ${bunkaMd(z.nalez)} |`);
}
// Známá chyba textu se v celém běhu neobjevila → nejspíš opravena (jen při běhu všech případů).
const znameNevidene = !JEN ? ZNAME_TEXTY.filter((z) => !videneZname.has(z)) : [];
if (xpass.length || znameNevidene.length || (!JEN && ZNAME_VADY.nevyprazdnitelnePole && !znameVadyNalezy.length)) {
  md.push('\n### 🔔 Nečekaně prošlo (XPASS) – chyba opravena? Po ověření na produkci odeber příznak `dnes_selze`');
  for (const v of xpass) md.push(`- **${v.id}** [${v.prohlizec}] ${v.chyba}`);
  for (const z of znameNevidene) md.push(`- **zakázaný text** ${z.chyba} – už se neobjevil, smaž položku ze ZNAME_TEXTY ve skriptu`);
  if (!JEN && ZNAME_VADY.nevyprazdnitelnePole && !znameVadyNalezy.length) md.push(`- **vada polí** ${ZNAME_VADY.nevyprazdnitelnePole} – už se neobjevila, smaž ZNAME_VADY.nevyprazdnitelnePole ve skriptu`);
}
const xfail = vysledky.filter((v) => v.stav === 'XFAIL');
if (xfail.length || znameNalezy.length || znameVadyNalezy.length) {
  md.push('\n<details><summary>🟡 Očekávaná selhání (XFAIL) – známé chyby čekající na opravu</summary>\n');
  for (const v of xfail) md.push(`- **${v.id}** [${v.prohlizec}] ${v.chyba}${v.selhaneBrany[0] ? ` – ${bunkaMd(v.selhaneBrany[0].klic)}: čekáno ${bunkaMd(v.selhaneBrany[0].ocek)}, je ${bunkaMd(v.selhaneBrany[0].skut)}` : v.pozn.length ? ` – ${bunkaMd(v.pozn.join('; '))}` : ''}`);
  for (const z of znameNalezy) md.push(`- **zakázaný text** [${z.prohlizec}] ${z.chyba} – ${bunkaMd(z.nalez)} (${bunkaMd(z.kontext)})`);
  if (znameVadyNalezy.length) md.push(`- **vada polí** ${ZNAME_VADY.nevyprazdnitelnePole}: ${znameVadyNalezy.length}× (${[...new Set(znameVadyNalezy.map((z) => z.url))].join(', ')})`);
  md.push('\n</details>');
}
const varov = vysledky.filter((v) => v.stav === 'VAROVÁNÍ' || v.stav === 'NEOVĚŘENO');
if (varov.length) {
  md.push('\n<details><summary>⚠️ Varování a neověřené</summary>\n');
  for (const v of varov) md.push(`- **${v.id}** [${v.prohlizec}] ${v.stav}: ${bunkaMd([...v.varovani.slice(0, 3).map((k) => `${k.klic}: čekáno ${k.ocek}, je ${k.skut}`), ...v.pozn].join('; '))}`);
  md.push('\n</details>');
}
const neoverKlice = vysledky.flatMap((v) => v.kontroly.filter((k) => k.uroven === 'info').map((k) => `${v.id}.${k.klic} (${k.pozn})`));
if (neoverKlice.length) md.push(`\n<details><summary>ℹ️ Klíče, které stránka/API nezobrazuje (${neoverKlice.length})</summary>\n\n${[...new Set(neoverKlice)].map((x) => `- ${x}`).join('\n')}\n\n</details>`);

const souhrn = md.join('\n');
console.log('\n' + souhrn.replace(/<\/?details>|<\/?summary>/g, ''));
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, souhrn + '\n');
if (process.env.VYSTUP_JSON) writeFileSync(process.env.VYSTUP_JSON, JSON.stringify({ base: BASE, cas: zacatek.toISOString(), pocty, apiVolani, zakazaneNalezy, vysledky }, null, 1));
if (xpass.length && process.env.GITHUB_ACTIONS) console.log(`::warning::${xpass.length} případů s dnes_selze nečekaně prošlo – po ověření na produkci odeber příznak.`);
if (poplach) {
  if (process.env.GITHUB_ACTIONS) console.log(`::error::Zlaté případy: ${selhalo.length} selhalo, ${zakazaneNalezy.length} zakázaných textů/JS chyb${REZIM.poruseni.length ? `, ${REZIM.poruseni.length} požadavků mimo pevnou sadu (ISR)` : ''}.`);
  process.exit(1);
}
