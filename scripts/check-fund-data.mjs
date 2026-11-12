#!/usr/bin/env node
/**
 * KONTROLA „NESMYSLŮ" V DATECH FONDŮ (etf_funds).
 *
 * PROČ: chyby v datech jsme dosud nacházeli NÁHODOU, při jiné práci – 313 zastaralých fondů
 * s dnešním datem, smetí „ETF Screener" v databázi, 63 dluhopisových fondů chybně označených
 * za pákové (a tím skrytých ve srovnávači). Tohle z toho dělá proces: běží denně po scraperu.
 *
 * DVĚ ÚROVNĚ (záměrně – falešné e-maily o chybě se přestanou číst):
 *   POPLACH  (exit 1 → e-mail): rozbil se přísun dat – hromadně chybí fondy, scraper přestal
 *            aktualizovat, nemožné hodnoty. Na to se musí reagovat hned.
 *   VAROVÁNÍ (jen v přehledu běhu): známé nedostatky kvality – fondy bez názvu, fondy, které už
 *            nejsou v nabídce, nesedící klasifikace. Sledují se v čase, řeší se plánovaně.
 *
 * Prahy vycházejí z naměřené skutečnosti 17. 10. 2026, ne z odhadu. Co VYPADÁ divně, ale divné
 * NENÍ (nehlásit): TER = 0 u fyzických zlatých ETC (Xetra-Gold, EUWAX Gold – poplatek za správu
 * opravdu nemají), výnos −100 % u 3× pákových produktů (umí reálně o vše přijít).
 *
 * SPUŠTĚNÍ:  SUPABASE_KEY=… node scripts/check-fund-data.mjs                         (produkce, pevná sada stránek)
 *            SUPABASE_KEY=… WEB_URL=http://localhost:3005 node scripts/check-fund-data.mjs   (lokální build, plný rozsah)
 *
 * PRODUKCE vs. LOKÁL (rozhodnutí majitele 23. 10. 2026, scripts/lib/cil.mjs, scripts/README.md): proti produkci jen
 * pevná malá sada dynamických stránek (každý nový detail fondu = ISR zápis). Kontroly, které si fondy vybírají z DB
 * (top 50, fondy bez výnosů…), na produkci použijí pevného reprezentanta, nebo se přeskočí („jen lokálně“ ve výpisu).
 * Kontroly dat v DB běží vždy. Plný běh proti lokálnímu buildu dělá CEO před každým nasazením.
 */

import { appendFileSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { vytvorRezim } from './lib/cil.mjs';

const KEY = process.env.SUPABASE_KEY;
const WEB_URL = process.env.WEB_URL || 'https://etfpruvodce.cz'; // pro test proti lokálnímu buildu
/** Režim cíle: na produkci jen pevná sada dynamických stránek; fetch na dynamickou stránku mimo ni se neodešle. */
const R = vytvorRezim(WEB_URL, 'check-fund-data');
R.hlidejFetch();
const URL_DB = 'https://nbhwnatadyubiuadfakx.supabase.co/rest/v1/etf_funds';
const ISIN_CSV = 'https://raw.githubusercontent.com/Kostrhoun1/etf-astro/main/scraper/ISIN.csv';
if (!KEY) { console.error('❌ Chybí SUPABASE_KEY'); process.exit(1); }

// ── prahy POPLACHU (17. 10. 2026: 5 146 fondů, 6,4 % starších 30 dní, ~94 % čerstvých) ──
const MIN_FONDU = 4500;          // hromadný úbytek = něco smazalo/nenačetlo data
const MAX_STARE_30D = 0.15;      // přes 15 % fondů neaktualizovaných 30 dní = scraper selhává plošně
const MIN_CERSTVE_3D = 0.70;
const MAX_FALESNE_CERSTVE = 20;   // po opravě 51199ba má být 0; pár kusů = fondy, které justETF dočasně nevrátil     // pod 70 % aktualizovaných za 3 dny = scraper přestal běžet
                                 // (tohle se projeví hned druhý den, stáří 30 dní až po měsíci)

// ── prahy VAROVÁNÍ úplnosti (18. 10. 2026 před opravou scraperu: 20 % čerstvých fondů bez tickeru,
//    60 % bez indexu; po opravě větve oprava-tickery-indexy v etf-astro ověřeno na 17 profilech → ~0 %).
//    Pár fondů bez burzy / bez indexu na justETF je pravda, proto práh, ne nula.
const MAX_BEZ_TICKERU = 0.05;    // podíl čerstvých fondů bez tickeru
const MAX_BEZ_INDEXU = 0.05;     // podíl čerstvých fondů bez indexu

const CYKLUS = /(short duration|short maturity|short[- ]term|ultra[- ]?short)/i;

// Zlatá sada: ISINy, které v žebříčku MUSÍ být (vlajkové fondy), a názvy, které tam být NESMÍ.
const ZLATA_SADA = [
  { slug: 'nejlepsi-sp500-etf', musi: ['IE00B5BMR087'], indexy: 0.9, nesmi: /equal weight|sector|ex[- ]|\bESG\b|screened|scored|leaders|top 20|capped|covered call|low vol/i }, // CSPX/SXR8
  { slug: 'nejlepsi-msci-world-etf', musi: ['IE00B4L5Y983'], indexy: 0.8, nesmi: /all[- ]world|acwi|ex[- ]usa/i },    // IWDA/EUNL
  // Celý svět = vyspělé I rozvíjející se trhy (18. 10. 2026: dřív vedl EUNL = MSCI World, jen vyspělé trhy).
  { slug: 'nejlepsi-celosvetove-etf', musi: ['IE00BK5BQT80', 'IE00B3YLTY66', 'IE00B6R52259'], indexy: 0.8,            // VWCE, SPYI, IUSQ
    nesmi: /\bMSCI World\b|developed|ex[- ]?u\.?s|\bESG\b|\bSRI\b|screened|paris|climate|enhanced|\bactive\b/i },
  { slug: 'nejlepsi-emerging-markets-etf', musi: ['IE00BKM4GZ66'], nesmi: /\bEMU\b/i },                 // EIMI/EMIM
  { slug: 'nejlepsi-japonske-etf', nesmi: /ex[- ]?japan/i },
  { slug: 'nejlepsi-cinske-etf', nesmi: /ex[- .]*china/i },
  { slug: 'nejlepsi-zlato-etf', musi: ['IE00B4ND3602'] },                                               // SGLN
  { slug: 'nejlepsi-ropa-etf' },
  { slug: 'nejlepsi-nasdaq-etf', indexy: 0.8, nesmi: /biotech|cyber|semiconductor|smart grid|covered call|aerospace/i },
];

async function nactiFondy() {
  const cols = 'isin,name,fund_provider,ter_numeric,return_1y,is_leveraged,distribution_policy,updated_at,scraping_date,category,holding_1_name,holding_9_name,holding_10_name,primary_ticker,total_exchanges,index_name,investment_focus,volatility_1y,volatility_3y,volatility_5y,return_1m,return_3y,max_drawdown_1y,max_drawdown_3y,max_drawdown_5y,returns_as_of,return_ytd'; // kolo6: výnosy zlata, poklesy tříd; kolo6b: den výnosů
  let all = [];
  for (let off = 0; ; off += 1000) {
    const r = await fetch(`${URL_DB}?select=${cols}&order=isin&limit=1000&offset=${off}`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
    if (!r.ok) throw new Error(`Supabase HTTP ${r.status}`);
    const b = await r.json();
    all = all.concat(b);
    if (b.length < 1000) return all;
  }
}

/** Fondy trhu se STEJNÝM dnem výnosů (returns_as_of) jako většina (při shodě novější den) – 31. 10. 2026.
 *  Výnos 12 m fondu, jehož řada je u zdroje o 1–2 dny pozadu, je ke SVÉMU dni správně, ale na volatilním trhu se od
 *  ostatních liší až o ~3 p. b. (UBS MSCI EM 27. 10. vs. trh 28. 10.: −2,5 p. b., ověřeno na řadě justETF a Xetra IS3N.DE).
 *  Test odlehlé hodnoty (> 1,5 p. b. od mediánu) proto srovnává jen fondy k jednomu dni – stejně jako src/lib/trhy.ts,
 *  ale nezávislá implementace z holých dat (ZAMERNA-ROZHODNUTI.md). */
const sDnemVetsiny = (f) => {
  const den = (x) => (x.returns_as_of ? String(x.returns_as_of).slice(0, 10) : 'bez dne');
  const pocty = new Map();
  for (const x of f) pocty.set(den(x), (pocty.get(den(x)) ?? 0) + 1);
  const vetsina = [...pocty].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? 1 : -1))[0]?.[0];
  return f.filter((x) => den(x) === vetsina);
};

const main = async () => {
  const fondy = await nactiFondy();
  const isinList = await fetch(ISIN_CSV).then((r) => (r.ok ? r.text() : ''))
    .then((t) => new Set(t.split(/\r?\n/).map((l) => l.split(',')[0].trim()).filter((x) => /^[A-Z]{2}[A-Z0-9]{10}$/.test(x))));

  // Stáří = scraping_date (kdy scraper data opravdu stáhl). NE updated_at: ten do 17. 10. 2026
  // přepisoval i upsert starých dat z checkpointů → kontrola hlásila 331 starých fondů místo 665.
  const dni = (x) => (Date.now() - new Date(x.scraping_date || x.updated_at)) / 864e5;
  const dniUpd = (x) => (Date.now() - new Date(x.updated_at)) / 864e5;
  const n = fondy.length;
  const poplach = [], varovani = [];
  const ukazka = (arr, f = (x) => `${x.isin} ${String(x.name || '(bez názvu)').slice(0, 40)}`) => arr.slice(0, 5).map(f);

  // ── POPLACH ──
  if (n < MIN_FONDU) poplach.push({ co: `Ve databázi je jen ${n} fondů (minimum ${MIN_FONDU})`, ukazka: [] });
  // Předgenerování detailů při buildu (31. 10. 2026, src/lib/prerender.ts, ZAMERNA-ROZHODNUTI.md): build SPADNE, když fondů
  // s detailem (neprázdný název + platná kontrolní číslice ISINu) je < MIN_DETAILU. Tady nezávislý přepočet z holých dat,
  // ať se o tom víme dřív než při nasazení (spadlý build = nejde nasadit ani oprava).
  const MIN_DETAILU = 4000; // = MIN_DETAILU v src/lib/prerender.ts
  const luhnIsin = (s) => {
    if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(s)) return false;
    const c = [...s].map((z) => (z >= 'A' ? String(z.charCodeAt(0) - 55) : z)).join('');
    let sum = 0;
    for (let i = c.length - 1, k = 0; i >= 0; i--, k++) { let d = +c[i]; if (k % 2) { d *= 2; if (d > 9) d -= 9; } sum += d; }
    return sum % 10 === 0;
  };
  const sDetailem = fondy.filter((x) => String(x.name ?? '').trim() && luhnIsin(String(x.isin)));
  if (sDetailem.length < MIN_DETAILU)
    poplach.push({ co: `Jen ${sDetailem.length} fondů má detail (minimum ${MIN_DETAILU}) – build webu teď spadne (src/lib/prerender.ts)`, ukazka: [] });
  const neplatnyIsin = fondy.filter((x) => !luhnIsin(String(x.isin)));
  if (neplatnyIsin.length)
    varovani.push({ co: `${neplatnyIsin.length} fondů s neplatným ISINem (kontrolní číslice) – detail nejde otevřít (middleware) ani předgenerovat`, ukazka: ukazka(neplatnyIsin) });
  const stare30 = fondy.filter((x) => dni(x) > 30);
  if (stare30.length / n > MAX_STARE_30D)
    poplach.push({ co: `${stare30.length} fondů (${(100 * stare30.length / n).toFixed(1)} %) neaktualizováno přes 30 dní`, ukazka: ukazka(stare30) });
  const cerstve = fondy.filter((x) => dni(x) <= 3).length;
  if (cerstve / n < MIN_CERSTVE_3D)
    poplach.push({ co: `Za poslední 3 dny aktualizováno jen ${cerstve} fondů (${(100 * cerstve / n).toFixed(0)} %) – běží scraper?`, ukazka: [] });
  // Od 20. 10. 2026 scraper spouští Supabase pg_cron („scraper-spusteni“ út–pá 01:30 UTC, „scraper-spusteni-pondeli“
  // po 05:00 UTC; token github_scraper_dispatch z Vault – platnost 1 rok), záloha = GitHub plán 08:23 UTC.
  // Kontrola běží 15:30 UTC: v pracovní den musí být většina fondů stažená za posledních 20 h. Když ne,
  // nefunguje spouštění (vypršel token? pg_cron?) i záloha – víkend se nestahuje záměrně.
  const denTydne = new Date().getUTCDay();
  if (denTydne >= 1 && denTydne <= 5 && new Date().getUTCHours() >= 13) {
    const dnesni = fondy.filter((x) => x.scraping_date && dni(x) <= 20 / 24).length; // 20 h: ať projde i ruční běh pozdě večer (scrape začíná nejdřív 01:30 UTC)
    if (dnesni / n < 0.8)
      poplach.push({ co: `Dnes (pracovní den) se stáhlo jen ${dnesni} fondů (${(100 * dnesni / n).toFixed(0)} %) – scraper se nespustil? Ověř pg_cron „scraper-spusteni“ (net._http_response) a token github_scraper_dispatch`, ukazka: [] });
  }
  // Symptom chyby z 17. 10. 2026: řádek se „aktualizoval" (updated_at), ale data jsou stará
  // (scraping_date) – scraper nahrává stará data místo nových (např. starý checkpoint z cache).
  const falesneCerstve = fondy.filter((x) => x.scraping_date && dni(x) > 7 && dniUpd(x) <= 3);
  if (falesneCerstve.length > MAX_FALESNE_CERSTVE)
    poplach.push({ co: `${falesneCerstve.length} fondů má dnešní updated_at, ale data starší 7 dní – scraper nahrává stará data`, ukazka: ukazka(falesneCerstve, (x) => `${x.isin} ${String(x.name).slice(0, 30)} data z ${String(x.scraping_date).slice(0, 10)}`) });
  const ter = fondy.filter((x) => x.ter_numeric != null && (Number(x.ter_numeric) < 0 || Number(x.ter_numeric) > 5));
  // TER 0 % u akcií/dluhopisů = chyba v datech (srovnávač ho ukáže jako „—“, ale zdroj je špatně).
  const terNula = fondy.filter((x) => Number(x.ter_numeric) === 0 && ['Akcie', 'Dluhopisy'].includes(x.category));
  if (terNula.length) varovani.push({ co: `${terNula.length} akciových/dluhopisových fondů má TER 0 % (chyba u zdroje, web ukazuje „—“)`, ukazka: ukazka(terNula) });
  if (ter.length) poplach.push({ co: `${ter.length} fondů s nemožným TER (< 0 nebo > 5 %)`, ukazka: ukazka(ter, (x) => `${x.isin} TER ${x.ter_numeric}`) });
  // Největší pozice: tabulka Top 10 na justETF nemá záhlaví a scraper do 18. 10. 2026 zahazoval 1. řádek
  // (NVIDIA chyběla u S&P 500 i světa; všech 2 138 akciových fondů mělo přesně 9 pozic). Symptom: čerstvě
  // stažené akciové fondy mají 9. pozici, ale ne 10. – u plných fondů má top 10 vždy 10 řádků.
  const sPozicemi = fondy.filter((x) => x.category === 'Akcie' && dni(x) <= 1 && String(x.holding_9_name || '').trim());
  const devet = sPozicemi.filter((x) => !String(x.holding_10_name || '').trim());
  if (sPozicemi.length >= 100 && devet.length / sPozicemi.length > 0.5)
    poplach.push({ co: `${devet.length} z ${sPozicemi.length} čerstvých akciových fondů má jen 9 největších pozic – scraper zase zahazuje 1. řádek (největší pozici)`, ukazka: ukazka(devet, (x) => `${x.isin} 1. pozice: ${x.holding_1_name}`) });

  // Backtest ukazuje TER „proxy“ fondu z ručně vedeného manifestu (src/lib/backtest/indexes.ts). 18. 10. 2026
  // tam bylo VWCE 0,22 % (skutečnost 0,14 %) a další 3 zastaralé hodnoty → porovnat s daty fondů.
  try {
    const manifest = readFileSync(new URL('../src/lib/backtest/indexes.ts', import.meta.url), 'utf8');
    const proxy = [...manifest.matchAll(/isin: '([A-Z0-9]{12})', name: '([^']*)', ter: ([0-9.]+)/g)];
    const podleIsin = new Map(fondy.map((x) => [x.isin, x]));
    const zastarale = proxy.filter(([, isin, , t]) => { const f = podleIsin.get(isin); return f?.ter_numeric != null && Number(f.ter_numeric) > 0 && Math.abs(Number(f.ter_numeric) - Number(t) * 100) > 0.005; });
    if (zastarale.length) varovani.push({ co: `${zastarale.length} fondů v backtestu má jiný TER než v datech fondu (src/lib/backtest/indexes.ts → proxyEtf.ter)`, ukazka: zastarale.map(([, isin, jm, t]) => `${isin} ${jm}: manifest ${(Number(t) * 100).toFixed(2)} %, data ${podleIsin.get(isin).ter_numeric} %`) });
  } catch (e) { varovani.push({ co: `Kontrola TER backtestu selhala: ${e.message}`, ukazka: [] }); }

  // ── VAROVÁNÍ ──
  const bezNazvu = fondy.filter((x) => !x.name || !String(x.name).trim());
  if (bezNazvu.length) varovani.push({ co: `${bezNazvu.length} fondů BEZ NÁZVU – jsou vidět ve srovnávači i jako stránka „ETF fond"`, ukazka: ukazka(bezNazvu) });
  if (isinList.size > 4000) {
    const mimo = fondy.filter((x) => !isinList.has(x.isin));
    if (mimo.length) varovani.push({ co: `${mimo.length} fondů už NENÍ v nabídce (chybí v seznamu scraperu), web je dál ukazuje jako aktuální`, ukazka: ukazka(mimo) });
  } else {
    varovani.push({ co: `Seznam ISIN scraperu se nepodařilo načíst (${isinList.size} položek) – kontrola zmizelých fondů vynechána`, ukazka: [] });
  }
  const zaseklé = fondy.filter((x) => dni(x) > 90 && isinList.has(x.isin));
  if (zaseklé.length) varovani.push({ co: `${zaseklé.length} fondů je v nabídce, ale scraper je přes 90 dní neaktualizoval`, ukazka: ukazka(zaseklé, (x) => `${x.isin} ${String(x.name).slice(0, 34)} (data z ${String(x.scraping_date || x.updated_at).slice(0, 10)})`) });
  const paka = fondy.filter((x) => x.is_leveraged && CYKLUS.test(x.name || '') && !/(\d(\.\d+)?x\b|leverag|inverse|daily short)/i.test(x.name || '')); // VIX „Short-Term Futures 2.25x“ je páka opravdu
  if (paka.length) varovani.push({ co: `${paka.length} fondů s krátkou durací označených jako pákové (skryté ve srovnávači)`, ukazka: ukazka(paka) });
  const extrem = fondy.filter((x) => !x.is_leveraged && x.return_1y != null && Math.abs(Number(x.return_1y)) > 150);
  if (extrem.length) varovani.push({ co: `${extrem.length} NEpákových fondů s ročním výnosem přes ±150 % – ověřit, jestli je číslo skutečné`, ukazka: ukazka(extrem, (x) => `${x.isin} ${String(x.name).slice(0, 34)} ${x.return_1y} %`) });
  // ── ÚPLNOST: ticker, index, kategorie peněžního trhu (revize webu 18. 10. 2026) ──
  // Parser burz hledal tabulku podle textu „exchange“ → trefil popis fondu nebo tabulku základních údajů
  // (fondy na Bloomberg indexy): 988 fondů bez tickeru (iShares Nasdaq 100, Core DAX…), 57 s tickerem „-“.
  // Index se odhadoval z názvu („S&P 500“ u VIX futures, useknuté „Bloomberg 10“) a 3 083 fondů ho nemělo.
  // Měří se jen na čerstvých fondech (stažených za 3 dny) – stará data jsou jiná kontrola.
  const prazdne = (v) => v == null || /^[\s\-–—]*$/.test(String(v));
  const cerstveFondy = fondy.filter((x) => x.name && dni(x) <= 3);
  if (cerstveFondy.length >= 1000) {
    const bezTickeru = cerstveFondy.filter((x) => prazdne(x.primary_ticker));
    if (bezTickeru.length / cerstveFondy.length > MAX_BEZ_TICKERU)
      varovani.push({ co: `${bezTickeru.length} čerstvých fondů (${(100 * bezTickeru.length / cerstveFondy.length).toFixed(1)} %) nemá ticker (práh ${MAX_BEZ_TICKERU * 100} %) – parser burz ve scraperu nenašel tabulku burz?`, ukazka: ukazka(bezTickeru, (x) => `${x.isin} ${String(x.name).slice(0, 40)} (burz: ${x.total_exchanges ?? 0})`) });
    const bezIndexu = cerstveFondy.filter((x) => prazdne(x.index_name));
    if (bezIndexu.length / cerstveFondy.length > MAX_BEZ_INDEXU)
      varovani.push({ co: `${bezIndexu.length} čerstvých fondů (${(100 * bezIndexu.length / cerstveFondy.length).toFixed(1)} %) nemá index (práh ${MAX_BEZ_INDEXU * 100} %) – scraper nečte řádek „Index“ z justETF?`, ukazka: ukazka(bezIndexu) });
  }
  // Ticker „-“ je značka justETF pro burzu BEZ tickeru, ne ticker – nesmí se dostat do primary_ticker.
  const tickerPomlcka = fondy.filter((x) => x.primary_ticker != null && String(x.primary_ticker).trim() !== '' && prazdne(x.primary_ticker));
  if (tickerPomlcka.length) varovani.push({ co: `${tickerPomlcka.length} fondů má jako ticker „-“ (burza bez tickeru) – web ho ukazuje jako ticker`, ukazka: ukazka(tickerPomlcka) });
  // Fond peněžního trhu (investment_focus „Money Market…“) nepatří do Akcií/Dluhopisů: žebříčky a SQL dotazy
  // filtrují podle category (srovnávač si ho přeřazuje sám, ostatní stránky ne).
  const mmSpatne = fondy.filter((x) => /^\s*money market\b/i.test(x.investment_focus || '') && x.category !== 'Peněžní trh');
  if (mmSpatne.length) {
    const podle = {};
    for (const x of mmSpatne) podle[x.category ?? '—'] = (podle[x.category ?? '—'] || 0) + 1;
    varovani.push({ co: `${mmSpatne.length} fondů peněžního trhu (investment_focus „Money Market“) nemá kategorii „Peněžní trh“ (${Object.entries(podle).map(([k, v]) => `${k}: ${v}`).join(', ')})`, ukazka: ukazka(mmSpatne, (x) => `${x.isin} ${String(x.name).slice(0, 40)} → ${x.category}`) });
  }

  let tridySkupiny = new Map(); // kolo6: skupiny tříd sdílí kontrola max. poklesu (blok kolo6 data)
  // ── VOLATILITA TŘÍD TÉHOŽ FONDU (revize kola 4, 18. 10. 2026) ──
  // Zdroj měl u tříd téhož fondu volatilitu lišící se až 2× (SPDR MSCI ACWI IMI: SPYI 10,4 % vs SPSA 21,1 %;
  // Vanguard All-World High Dividend: VHYL 8,1 % vs VGWE 10,8 %, 3 roky 10,0 vs 17,0 %). Stejné portfolio musí
  // v eurech kolísat stejně (nezávisle z denních cen Yahoo: SPYI.DE 10–11 %, SPSA.DE 12 %). Web takový údaj
  // ukazuje jako „—“ (src/lib/tridyFondu.ts); tady se počet sleduje. NEZÁVISLÁ implementace (ne kód webu):
  // třída = stejný poskytovatel + název před posledním „ETF/ETC/ETP“ + zbytek bez měny/Acc/Dist/1C… + stejné
  // měnové zajištění (zajištěná třída kolísá jinak – porovnává se jen se zajištěnou do stejné měny).
  // Práh: rozdíl > 30 % relativně a zároveň ≥ 1 p. b. (peněžní trh pod 1 % = šum).
  {
    const MENY = 'EUR|USD|GBP|CHF|JPY|SEK|SGD|AUD|CAD|NOK|DKK|HKD|PLN|CZK|MXN|CNH';
    const zajisteni = (n) => {
      const t = n.replace(/\b(interest rate hedged|tail hedge|hedged equity|dynamically hedged)\b/gi, '');
      if (/unhedged/i.test(t)) return '-';
      const m = t.match(new RegExp(`(?:^|[\\s-])h(${MENY})\\b`)) || t.match(new RegExp(`\\b(${MENY})\\)?[\\s-]*(?:(?:daily|monthly)\\s+)?(?:hedged?|hdg|pfhdg)\\b`, 'i'))
        || t.match(new RegExp(`\\b(?:hedged?|hdg)\\s*\\(?\\s*(?:to\\s+)?(${MENY}|euro)\\b`, 'i')) || t.match(new RegExp(`\\bH[- ](${MENY})\\b`));
      if (m) return m[1].toUpperCase().replace('EURO', 'EUR');
      return /\b(hedged?|hdg|pfhdg)\b|\(H\)/i.test(t) ? '?' : '-';
    };
    const TRIDA_SLOVO = new RegExp(`^(${MENY.toLowerCase()}|euro|hedged?|unhedged|hdg|pfhdg|daily|monthly|to|acc|accumulating|accumulation|capitalisation|capitalization|dist|dis|distributing|distribution|inc|income|[a-z]|\\d[a-z]|dr|class|inst|institutional|uk|ukdis|ukacc|h(eur|usd|gbp|chf))$`);
    const tridaKlic = (x) => {
      const m = String(x.name ?? '').match(/^(.*)\b(?:UCITS\s+)?(?:ETF|ETC|ETP|ETN)\b(.*)$/i);
      if (!m || !m[1].trim()) return null;
      const zbytek = m[2].toLowerCase().split(/[^a-z0-9]+/).filter((w) => w && !TRIDA_SLOVO.test(w)).join(' ');
      return `${x.fund_provider}|${zajisteni(String(x.name))}|${m[1].toLowerCase().replace(/\s+/g, ' ').trim()}|${zbytek}`;
    };
    const skupiny = new Map();
    for (const x of fondy.filter((f) => f.name && dni(f) <= 30)) {
      const k = tridaKlic(x);
      if (k) skupiny.set(k, [...(skupiny.get(k) ?? []), x]);
    }
    tridySkupiny = skupiny;
    const lisi = (a, b) => Math.abs(a - b) >= 1 && Math.max(a, b) / Math.min(a, b) > 1.3;
    const nalezy = [];
    for (const g of skupiny.values()) {
      if (g.length < 2) continue;
      for (const o of ['1y', '3y', '5y']) {
        const h = g.filter((x) => Number(x[`volatility_${o}`]) > 0).map((x) => ({ x, v: Number(x[`volatility_${o}`]) }));
        if (h.length < 2) continue;
        const v = h.map((y) => y.v);
        if (!lisi(Math.min(...v), Math.max(...v))) continue;
        nalezy.push(`${o}: ${h.map((y) => `${y.x.primary_ticker || y.x.isin} ${y.v.toFixed(1)} %`).join(' / ')} – ${String(g[0].name).slice(0, 48)}`);
      }
    }
    if (nalezy.length) varovani.push({ co: `${nalezy.length}× volatilita tříd téhož fondu se liší o víc než 30 % (chyba zdroje; web ji u nich ukazuje jako „—“)`, ukazka: nalezy.slice(0, 6) });
  }

  const bezPolitiky = fondy.filter((x) => !x.distribution_policy).length;
  if (bezPolitiky) varovani.push({ co: `${bezPolitiky} fondů bez typu výplaty (akumulační/distribuční) – filtr je u nich nenajde`, ukazka: [] });

  // ── ROČNÍ VÝNOSY V KČ/USD: nezávislý přepočet z kurzů ČNB a ECB ──
  // Do 17. 10. 2026 scraper převáděl KAŽDÝ kalendářní rok kurzem „před 365 dny → dnes", takže
  // všechny roky dostaly stejný měnový efekt posledních 12 měsíců (SXR8 2025 v USD +0,02 % místo
  // +17,6 %). Kontrola: pro velké fondy přepočítá rok Y z EUR výnosu kurzy k 31. 12. Y−1 a 31. 12. Y.
  const kurzCNB = async (d) => {
    const t = await fetch(`https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt?date=${d.split('-').reverse().join('.')}`).then((r) => r.text());
    const radek = t.split('\n').find((l) => l.split('|')[3] === 'EUR');
    return radek ? Number(radek.split('|')[4].replace(',', '.')) : null;
  };
  const kurzECB = async (d) => (await fetch(`https://api.frankfurter.dev/v1/${d}?base=EUR&symbols=USD`).then((r) => r.json())).rates?.USD ?? null;
  try {
    const rokNyni = new Date().getFullYear();
    const roky = [rokNyni - 2, rokNyni - 1].filter((y) => y >= 2022 && y <= 2027); // sloupce return_2021–2027 (2026/27 od 8. 11. 2026)
    // VŠECHNY fondy, ne vzorek: 17. 10. 2026 nahrál zrušený běh se starým kódem 550 fondů se špatnými
    // ročními výnosy (VUAA, VWCE…) – vzorek 3 fondů by to chytil jen náhodou. Výpočet je levný.
    // VŠECHNY fondy včetně těch mimo nabídku: web je dál ukazuje. 17.–18. 10. 2026 tu bylo okno „jen
    // stažené za 3 dny“ a fondy, které justETF vyřadil (scraper je už nestahuje), jím propadly se špatnými
    // čísly ze starého kódu (63 fondů, 350 hodnot). Ty se 18. 10. vymazaly (raději „—“), takže každá
    // vyplněná hodnota musí sedět.
    const sel = ['isin', 'name', ...roky.flatMap((y) => [`return_${y}`, `return_${y}_czk`, `return_${y}_usd`])].join(',');
    const data = [];
    for (let od = 0; ; od += 1000) {
      const r = await fetch(`${URL_DB}?select=${sel}&return_${roky[roky.length - 1]}=not.is.null&order=isin`, {
        headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Range: `${od}-${od + 999}` },
      }).then((x) => x.json());
      if (!Array.isArray(r)) throw new Error('roční výnosy: neplatná odpověď DB');
      data.push(...r);
      if (r.length < 1000) break;
    }
    const spatne = [];
    const spatneFondy = new Set();
    for (const y of roky) {
      const [c0, c1, u0, u1] = await Promise.all([kurzCNB(`${y - 1}-12-31`), kurzCNB(`${y}-12-31`), kurzECB(`${y - 1}-12-31`), kurzECB(`${y}-12-31`)]);
      if (!c0 || !c1 || !u0 || !u1) continue;
      for (const f of data) {
        const eur = f[`return_${y}`];
        if (eur == null) continue;
        const czk = ((1 + eur / 100) * c1 / c0 - 1) * 100;
        const usd = ((1 + eur / 100) * u1 / u0 - 1) * 100;
        const dbCzk = f[`return_${y}_czk`] == null ? null : Number(f[`return_${y}_czk`]);
        const dbUsd = f[`return_${y}_usd`] == null ? null : Number(f[`return_${y}_usd`]);
        if (dbCzk != null && Math.abs(dbCzk - czk) > 0.5) { spatneFondy.add(f.isin); spatne.push(`${f.isin} ${y} Kč: DB ${dbCzk.toFixed(1)} vs. přepočet ${czk.toFixed(1)}`); }
        if (dbUsd != null && Math.abs(dbUsd - usd) > 0.5) { spatneFondy.add(f.isin); spatne.push(`${f.isin} ${y} USD: DB ${dbUsd.toFixed(1)} vs. přepočet ${usd.toFixed(1)}`); }
      }
    }
    if (spatne.length) poplach.push({ co: `Roční výnosy v Kč/USD nesedí s nezávislým přepočtem z kurzů ČNB/ECB – ${spatneFondy.size} fondů z ${data.length}`, ukazka: spatne.slice(0, 6) });
  } catch (e) {
    varovani.push({ co: `Kontrolu ročních výnosů v Kč/USD se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── KOLO9 KALENDÁŘ: nesmyslné kalendářní roky (8. 11. 2026) ──
  // Pákové ETP: zdroj má v řadě neupravené konsolidace/dělení → roky +790 % (burza −55 %), −100 % u živého produktu.
  // Kalendářní roky jdou z profilu zdroje, ne z denní řady, scraper je nevynuluje. Ruční seznam C: NEOVERENE_ROKY
  // v src/lib/vynosNeovereny.ts; rok ≤ −99,95 % web skrývá i bez seznamu. Tady: (a) čerstvý fond s rokem ≥ +300 % nebo
  // ≤ −99,95 % mimo seznam = VAROVÁNÍ „ověřit burzou (Yahoo × ČNB) a případně přidat do NEOVERENE_ROKY“;
  // (b) položka seznamu, jejíž rok už v DB není = varování „smazat“.
  try {
    const zdrojN = readFileSync('src/lib/vynosNeovereny.ts', 'utf8');
    const usek = (od, po) => zdrojN.slice(zdrojN.indexOf(od), po ? zdrojN.indexOf(po) : undefined);
    const seznamC = new Map([...usek('export const NEOVERENE_ROKY', 'export const OVERENE_EXTREMNI_ROKY').matchAll(/'([A-Z]{2}[A-Z0-9]{10})': \{ ticker: '[^']*', roky: \[([\d, ]+)\]/g)].map((m) => [m[1], m[2].split(',').map((x) => Number(x.trim()))]));
    if (seznamC.size < 10) throw new Error(`v NEOVERENE_ROKY jsem našel jen ${seznamC.size} položek (změnil se formát?)`);
    // Ověřené skutečné extrémy (OVERENE_EXTREMNI_ROKY) se nehlásí – stejný formát řádku jako seznam C.
    const overene = new Map([...usek('export const OVERENE_EXTREMNI_ROKY', 'export const ROK_PODEZRELY_POD').matchAll(/'([A-Z]{2}[A-Z0-9]{10})': \{ ticker: '[^']*', roky: \[([\d, ]+)\]/g)].map((m) => [m[1], m[2].split(',').map((x) => Number(x.trim()))]));
    const ROKY_K = [2021, 2022, 2023, 2024, 2025, 2026, 2027].filter((y) => y < new Date().getUTCFullYear());
    const filtr = ROKY_K.flatMap((y) => [`return_${y}.gte.300`, `return_${y}.lte.-99.95`]).join(',');
    const sel = ['isin', 'name', 'primary_ticker', 'scraping_date', 'is_leveraged', ...ROKY_K.map((y) => `return_${y}`)].join(',');
    const r = await fetch(`${URL_DB}?select=${sel}&or=(${filtr})&order=isin`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }).then((x) => x.json());
    if (!Array.isArray(r)) throw new Error('neplatná odpověď DB');
    const cerstvy = (f) => (Date.now() - Date.parse(String(f.scraping_date).replace(/(\d)$/, '$1Z'))) / 864e5 <= 7;
    const nove = r.filter(cerstvy).flatMap((f) => ROKY_K.filter((y) => {
      const v = f[`return_${y}`] == null ? null : Number(f[`return_${y}`]);
      return v != null && (v >= 300 || v <= -99.95) && !seznamC.get(f.isin)?.includes(y) && !overene.get(f.isin)?.includes(y);
    }).map((y) => `${f.isin} ${f.primary_ticker ?? ''} ${y}: ${Number(f[`return_${y}`]).toFixed(1)} %${Number(f[`return_${y}`]) <= -99.95 ? ' (web skrývá pojistkou)' : ''}`));
    if (nove.length) varovani.push({ co: `Kolo9: ${nove.length} kalendářních roků ≥ +300 % nebo ≤ −99,95 % mimo NEOVERENE_ROKY – ověřit burzou (Yahoo × ČNB); chyba zdroje → přidat do seznamu C`, ukazka: nove.slice(0, 10) });
    const db = await fetch(`${URL_DB}?select=isin,${ROKY_K.map((y) => `return_${y}`).join(',')}&isin=in.(${[...seznamC.keys()].join(',')})`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }).then((x) => x.json());
    const neplati = [...seznamC].flatMap(([isin, roky]) => roky.filter((y) => db.find((f) => f.isin === isin)?.[`return_${y}`] == null).map((y) => `${isin} ${y}`));
    if (neplati.length) varovani.push({ co: `Kolo9: položky NEOVERENE_ROKY, jejichž rok už v DB není (zdroj ho vyřadil) – smazat ze seznamu: ${neplati.length}`, ukazka: neplati.slice(0, 8) });
  } catch (e) {
    varovani.push({ co: `Kontrolu kalendářních roků (kolo9) se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── CHYBĚJÍCÍ PŘEPOČET DO KČ/USD (8. 11. 2026) ──
  // EUR výnos je, ale _czk/_usd chybí → web ukáže „—“ (a rok z grafu ročních výnosů zmizí). Historie: 18. 10. 10 fondů
  // (převod se spouštěl jen s výnosem za období), 21. 9. 4 fondy Janus bez USD (výpadek kurzu se v converteru scraperu
  // uložil do cache jako None pro zbytek běhu). Také obráceně: Kč/USD bez EUR = přepočet ze starých dat.
  try {
    const OBD_P = ['2022', '2023', '2024', '2025', 'ytd', '1y', '3y', '5y'];
    const sel = ['isin', 'name', 'scraping_date', ...OBD_P.flatMap((o) => [`return_${o}`, `return_${o}_czk`, `return_${o}_usd`])].join(',');
    const filtr = OBD_P.flatMap((o) => [
      `and(return_${o}.not.is.null,return_${o}_czk.is.null)`,
      `and(return_${o}.not.is.null,return_${o}_usd.is.null)`,
      `and(return_${o}.is.null,or(return_${o}_czk.not.is.null,return_${o}_usd.not.is.null))`,
    ]).join(',');
    const r = await fetch(`${URL_DB}?select=${sel}&or=(${filtr})&order=isin`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }).then((x) => x.json());
    if (!Array.isArray(r)) throw new Error('neplatná odpověď DB');
    const stari = (f) => (Date.now() - Date.parse(String(f.scraping_date).replace(/(\d)$/, '$1Z'))) / 864e5; // stáří VŽDY ze scraping_date
    const popis = (f) => `${f.isin} ${String(f.name).slice(0, 30)}: ` + OBD_P.flatMap((o) => {
      const e = f[`return_${o}`], c = f[`return_${o}_czk`], u = f[`return_${o}_usd`];
      if (e != null) return [c == null && `${o} Kč`, u == null && `${o} USD`].filter(Boolean);
      return c != null || u != null ? [`${o} Kč/USD bez EUR`] : [];
    }).join(', ');
    const cerstve = r.filter((f) => stari(f) <= 3), stare = r.filter((f) => stari(f) > 3);
    if (cerstve.length) poplach.push({ co: `${cerstve.length} čerstvých fondů má EUR výnos bez přepočtu do Kč/USD (nebo naopak) – výpadek kurzu ve scraperu?`, ukazka: cerstve.slice(0, 6).map(popis) });
    if (stare.length) varovani.push({ co: `${stare.length} fondů se starými daty (> 3 dny) má EUR výnos bez přepočtu do Kč/USD – web ukazuje „—“`, ukazka: stare.slice(0, 6).map(popis) });
  } catch (e) {
    varovani.push({ co: `Kontrolu chybějícího přepočtu Kč/USD se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── KÓD: tichý fallback EUR → Kč/USD ──
  // 18. 10. 2026: detail fondu ukazoval při chybějícím přepočtu výnos v EUR jako výnos v Kč
  // (`return_<rok>_czk ?? return_<rok>`), stejně tak homepage/infografiky u 1R. Pravidlo č. 1: raději „—“.
  try {
    const souboryKodu = (d) => readdirSync(d).flatMap((n) => {
      const p = `${d}/${n}`;
      return statSync(p).isDirectory() ? souboryKodu(p) : /\.(tsx?|mjs)$/.test(n) ? [p] : [];
    });
    const FALLBACK = /return_[\w${}`]*_(czk|usd)\b[^;\n]*\?\?[^;\n]*return_(?![\w${}`]*_(czk|usd)\b)[\w${}`]+/;
    // Druhý tvar (pickReturn do 18. 10. 2026): `raw == null ? obj[\`return_${period}\`] : raw` – výnos bez měnové přípony v náhradní větvi.
    const FALLBACK2 = /null\s*\?[^;\n]*`return_\$\{[^}]+\}`\]/;
    const nalezy = souboryKodu('src').flatMap((p) => readFileSync(p, 'utf8').split('\n')
      .map((l, i) => (FALLBACK.test(l) || FALLBACK2.test(l) ? `${p}:${i + 1}` : null)).filter(Boolean));
    if (nalezy.length) poplach.push({ co: `Kód ukazuje výnos v EUR místo Kč/USD, když přepočet chybí (${nalezy.length} míst)`, ukazka: nalezy.slice(0, 6) });
  } catch (e) {
    varovani.push({ co: `Kontrolu kódu na fallback EUR→Kč se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── CENÍKY BROKERŮ: stáří ověření ──
  // 18. 10. 2026 ověření proti oficiálním ceníkům našlo 6 chyb (IBKR ceník US akcií místo Xetry,
  // XTB „podpora 24/7“, DEGIRO „česká podpora“…). Ceníky se mění (XTB ~měsíčně) → po 90 dnech varování.
  try {
    const m = readFileSync('src/data/brokerData.ts', 'utf8').match(/CENIKY_OVERENY = '(\d{4}-\d{2}-\d{2})'/);
    const stari = m ? (Date.now() - new Date(m[1])) / 864e5 : Infinity;
    if (stari > 90) varovani.push({ co: `Ceníky brokerů naposledy ověřeny ${m ? m[1] : '?'} (před ${Math.round(stari)} dny) – ověřit znovu u oficiálních ceníků a aktualizovat CENIKY_OVERENY v src/data/brokerData.ts`, ukazka: [] });
  } catch (e) {
    varovani.push({ co: `Kontrolu stáří ceníků brokerů se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── CENÍKY BROKERŮ: stejná čísla na všech stránkách ──
  // Revize 18. 10. 2026: /kde-koupit, /srovnani-brokeru a recenze mají ukazovat u každého brokera STEJNÝ
  // poplatek za nákup a směnu (jeden zdroj brokerData → popisPoplatku/popisSmeny). Stránky je vykreslují
  // v atributech data-broker / data-poplatek / data-smena; tady je posbíráme z ostrého webu a porovnáme.
  // Rozdíl = někdo číslo natvrdo přepsal na jedné stránce, nebo běží rozdílné verze (cache).
  try {
    const BROKERI = ['xtb', 'trading212', 'degiro', 'ibkr', 'fio'];
    const stranky = ['/kde-koupit', '/srovnani-brokeru', ...BROKERI.map((id) => `/recenze/${id}`)];
    const norm = (t) => t.replace(/&nbsp;|&#160;|&#xa0;| /gi, ' ').replace(/\s+/g, ' ').trim();
    const nalez = {}; // nalez[broker][pole] = Map(hodnota → [stránky])
    const bezDat = [];
    for (const s of stranky) {
      let html = '';
      try { html = await fetch(`${WEB_URL}${s}`).then((r) => (r.ok ? r.text() : '')); } catch { /* níže */ }
      let broker = null, pocet = 0;
      for (const m of html.matchAll(/data-(broker|poplatek|smena)="([^"]*)"/g)) {
        if (m[1] === 'broker') { broker = m[2]; continue; }
        if (!broker || !BROKERI.includes(broker)) continue;
        const pole = m[1] === 'poplatek' ? 'poplatek za nákup' : 'směna CZK→EUR';
        ((nalez[broker] ??= {})[pole] ??= new Map());
        const v = norm(m[2]);
        nalez[broker][pole].set(v, [...new Set([...(nalez[broker][pole].get(v) ?? []), s])]);
        pocet++;
      }
      if (!pocet) bezDat.push(s);
    }
    const rozdily = [];
    for (const [broker, pole] of Object.entries(nalez)) {
      for (const [co, hodnoty] of Object.entries(pole)) {
        if (hodnoty.size > 1) rozdily.push(`${broker} – ${co}: ${[...hodnoty].map(([v, st]) => `„${v}“ (${st.join(', ')})`).join(' × ')}`);
      }
    }
    if (rozdily.length) varovani.push({ co: `Ceníky brokerů se liší mezi /kde-koupit, /srovnani-brokeru a recenzemi (počet rozdílů: ${rozdily.length}) – sjednotit (zdroj src/data/brokerData.ts)`, ukazka: rozdily });
    if (bezDat.length) varovani.push({ co: `Ceníky brokerů: ${bezDat.length} stránek bez čísel k porovnání (data-poplatek/data-smena) – stránka nenačtena, nebo před nasazením`, ukazka: bezDat });
  } catch (e) {
    varovani.push({ co: `Kontrolu shody ceníků brokerů se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── Stáří nasazení (1. 11. 2026) ──
  // Detaily fondů a dvojice jsou předgenerované při buildu s platností 30 dní (etf/[isin] revalidate 2592000): po nasazení
  // vyprší všechny najednou a roboti by je přepočítali za pár dní ≈ 100 000+ ISR zápisů → auto-pauza free tieru. Každé
  // nasazení je obnoví zdarma (build = 0 ISR zápisů). Proto: produkce starší než 25 dní = poplach (znovu nasadit).
  try {
    const html = await fetch(`${WEB_URL}/`).then((r) => (r.ok ? r.text() : ''));
    const build = html.match(/<meta name="build-time" content="([^"]*)"/)?.[1];
    const dni = build ? (Date.now() - Date.parse(build)) / 864e5 : NaN;
    if (!build) varovani.push({ co: 'Homepage bez <meta name="build-time"> – stáří nasazení nejde ověřit (před nasazením 1. 11. 2026?)', ukazka: [] });
    else if (!(dni >= 0 && dni <= 25)) poplach.push({ co: `Nasazení je staré ${Number.isFinite(dni) ? dni.toFixed(1) : '?'} dní (build ${build}): předgenerované detaily fondů vyprší po 30 dnech všechny najednou → ISR zápisy nad limit free tieru. Znovu nasadit (build je obnoví bez ISR zápisů).`, ukazka: [] });
  } catch (e) {
    varovani.push({ co: `Stáří nasazení se nepodařilo ověřit: ${e.message}`, ukazka: [] });
  }

  // ── /kde-koupit: roční náklad konzistentní s nákupem ──
  // Kolo 5 (18. 10. 2026): IBKR „směnu stačí udělat jednou“, ale „za rok“ počítal směnu 12× (884 Kč místo ~408 Kč).
  // Řádky nesou data-za-nakup / data-za-rok (Kč, výchozí částka). Za rok nesmí být víc než 12 × za nákup a u IBKR
  // (vícměnový účet, směna jednou) musí být méně – jinak se roční součet zase počítá jinak, než říká text.
  try {
    const html = await fetch(`${WEB_URL}/kde-koupit`).then((r) => (r.ok ? r.text() : ''));
    const chyby = [];
    let pocet = 0;
    for (const m of html.matchAll(/<tr[^>]*data-broker="([^"]+)"[^>]*>/g)) {
      const nakup = Number(m[0].match(/data-za-nakup="(\d+)"/)?.[1]);
      const rok = Number(m[0].match(/data-za-rok="(\d+)"/)?.[1]);
      if (!nakup || !rok) continue;
      pocet++;
      if (rok > 12 * (nakup + 0.5)) chyby.push(`${m[1]}: za rok ${rok} Kč > 12 × ${nakup} Kč`);
      // IBKR: od auditu 22. 10. 2026 je u malých částek levnější automatická směna u každého nákupu (0,03 %, bez minima),
      // takže rok = 12 × nákup je správně. Ruční směnu jednou za rok hlídá blok „audit naklady“ nezávislým vzorcem.
    }
    if (!pocet) varovani.push({ co: '/kde-koupit: v HTML chybí data-za-nakup/data-za-rok – kontrolu ročního nákladu nešlo provést', ukazka: [] });
    if (chyby.length) varovani.push({ co: `/kde-koupit: roční náklad nesedí s nákupem (${chyby.length})`, ukazka: chyby });
  } catch (e) {
    varovani.push({ co: `Kontrolu ročního nákladu na /kde-koupit se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── HLEDÁNÍ: české výrazy a tickery (hlavní akce homepage) ──
  // 18. 10. 2026: „svět“, „zlato“, „dluhopisy“, „dividendové“ vracely 0 výsledků (názvy fondů jsou
  // anglicky). Teď src/lib/hledaniCz.ts – dotaz musí vrátit fondy a (u českých slov) i žebříček.
  try {
    const OCEKAVANI = [
      { q: 'VWCE', isin: 'IE00BK5BQT80' }, { q: 'IE00B5BMR087', isin: 'IE00B5BMR087' },
      { q: 'svět', zebricek: 'nejlepsi-celosvetove-etf' }, { q: 'zlato', zebricek: 'nejlepsi-zlato-etf' },
      { q: 'dluhopisy', zebricek: 'nejlepsi-dluhopisove-etf' }, { q: 'dividendové', zebricek: 'nejlepsi-dividendove-etf' },
      { q: 'evropa', zebricek: 'nejlepsi-evropske-etf' },
      // 18. 10. 2026: „sp500“ dávalo nahoru zajištěné UBS třídy (švýcarské tickery SP500S/E/H) místo CSPX/SXR8.
      { q: 'sp500', isin: 'IE00B5BMR087', poCeskem: true },
      // Revize kola 4 (18. 10. 2026): „All-World“ dávalo VWCE až na 43. místo (nahoře UBS ACWI), „gold“ vracel
      // fondy Goldman Sachs. Teď celá slova + přesná shoda indexu + velikost (src/lib/hledaniCz.ts).
      { q: 'All-World', isin: 'IE00BK5BQT80', poCeskem: true }, { q: 'msci world', isin: 'IE00B4L5Y983', poCeskem: true },
      { q: 'nasdaq', isin: 'IE00B53SZB19', poCeskem: true }, { q: 'gold', bezGoldman: true, poCeskem: true },
    ];
    const chyby = [];
    for (const o of OCEKAVANI) {
      const r = await fetch(`${WEB_URL}/api/etf/search?q=${encodeURIComponent(o.q)}`).then((x) => x.json());
      if (!Array.isArray(r.results)) { chyby.push(`${o.q}: API neodpovědělo`); continue; }
      if (o.poCeskem && !('kategorie' in r)) continue; // produkce ještě bez sdílené relevance (před nasazením)
      if (o.isin && r.results[0]?.isin !== o.isin) chyby.push(`${o.q}: první výsledek ${r.results[0]?.isin ?? 'nic'} místo ${o.isin}`);
      if (o.bezGoldman && r.results.some((x) => /goldman/i.test(x.name))) chyby.push(`${o.q}: mezi výsledky je Goldman Sachs (shoda uvnitř slova)`);
      if (o.zebricek) {
        if (!('kategorie' in r)) continue; // produkce ještě bez českého hledání (před nasazením)
        if (!r.kategorie.some((k) => k.href.endsWith(o.zebricek))) chyby.push(`${o.q}: chybí žebříček ${o.zebricek}`);
        if (r.results.length === 0) chyby.push(`${o.q}: 0 fondů`);
      }
    }
    if (chyby.length) poplach.push({ co: 'Hledání na webu nevrací očekávané výsledky', ukazka: chyby.slice(0, 6) });
  } catch (e) {
    varovani.push({ co: `Kontrolu hledání se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── SROVNÁVAČ: region a kategorie fondů (/api/etf/screener) ──
  // 18. 10. 2026: filtr Region ukazoval Koreu jako „Evropa“, zlato a krypto jako „Celosvětově“ (2 420 z 5 124
  // fondů „Celosvětově“). Region se teď bere jen z investment_focus (src/utils/regionClassification.ts).
  // Nezávislá kontrola z NÁZVU fondu: fond s jednou zemí v názvu musí mít tu zemi; komodita/krypto žádný region.
  try {
    const rows = await fetch(`${WEB_URL}/api/etf/screener`).then((r) => r.json());
    if (!Array.isArray(rows) || rows.length < 1000) throw new Error('API srovnávače nevrátilo data');
    if (!rows.some((r) => r._region === 'Jižní Korea')) {
      varovani.push({ co: 'Srovnávač na produkci ještě nemá novou klasifikaci regionu (před nasazením) – kontrola regionu vynechána', ukazka: [] });
    } else {
      const ZEME = [[/\bKorea\b/i, 'Jižní Korea'], [/\bJapan\b/i, 'Japonsko'], [/\bIndia\b/i, 'Indie'], [/\bTaiwan\b/i, 'Tchaj-wan'], [/\bBrazil\b/i, 'Brazílie']];
      const VICE = /(asia|pacific|emerging|\bem\b|world|global|all[- ]country|acwi|ex[- .]|europe|latin|bric|far east|\bAC\b)/i;
      const spatne = [];
      for (const r of rows) {
        if (r.category === 'Akcie' || r.category === 'Dluhopisy') {
          for (const [re, ocek] of ZEME) {
            if (re.test(r.name) && !VICE.test(r.name) && r._region !== ocek) spatne.push(`${r.isin} ${String(r.name).slice(0, 40)}: ${r._region ?? '—'} (čekám ${ocek})`);
          }
        }
        if ((r.category === 'Komodity' || r.category === 'Krypto') && r._region != null && /gold|silver|bitcoin|ethereum|crypto|commodit/i.test(r.name) && !/miner/i.test(r.name)) {
          spatne.push(`${r.isin} ${String(r.name).slice(0, 40)}: komodita/krypto s regionem ${r._region}`);
        }
      }
      if (spatne.length) varovani.push({ co: `${spatne.length} fondů má ve srovnávači region, který nesedí s názvem fondu`, ukazka: spatne.slice(0, 6) });
      const cel = rows.filter((r) => r._region === 'Celosvětově').length / rows.length;
      if (cel > 0.4) varovani.push({ co: `${(cel * 100).toFixed(0)} % fondů ve srovnávači je „Celosvětově“ – region se zase odvozuje špatně`, ukazka: [] });
    }
    // Měnové zajištění: 18. 10. 2026 srovnávač nepoznal „PfHdg“ (Invesco) ani „hEUR/hCHF“ (UBS) → filtr
    // „Nezajištěné“ vracel zajištěné třídy. Nezávislý široký vzor z NÁZVU (ne kód webu) proti tomu, co
    // srovnávač ukazuje (_hedge). Zajištění úroků/opcemi („Interest Rate Hedged“, „Tail Hedge“…) měnové není.
    const VZOR_ZAJ = /hedg|hdg|(^|[\s-])h(EUR|USD|GBP|CHF|JPY|SEK|SGD)\b|\bEAH [A-Z]{3}\b|\bH[- ][A-Z]{3}\b|\b[A-Z]{3} \(H\)|\b[A-Z]{3}-H\b/;
    const NE_MENOVE = /unhedged|not hedged|interest rate hedged|tail hedge|hedged equity|dynamically hedged/i;
    const zajNepoznano = rows.filter((r) => VZOR_ZAJ.test(r.name || '') && !NE_MENOVE.test(r.name || '') && r._hedge === 'unhedged');
    if (zajNepoznano.length) varovani.push({ co: `${zajNepoznano.length} fondů má v názvu vzor měnového zajištění, ale srovnávač je vede jako NEzajištěné (src/utils/hedgingDetection.ts)`, ukazka: ukazka(zajNepoznano, (x) => `${x.isin} ${String(x.name).slice(0, 60)}`) });
    // Peněžní trh: zdroj ho řadí pod „Akcie“ (45 fondů 18. 10. 2026), srovnávač ho přeřazuje do vlastní záložky.
    const mm = rows.filter((r) => r.category === 'Akcie' && /overnight|money market|€str|\bestr\b/i.test(r.name));
    if (mm.length) varovani.push({ co: `${mm.length} fondů peněžního trhu je ve srovnávači pod „Akcie“`, ukazka: ukazka(mm) });
  } catch (e) {
    varovani.push({ co: `Kontrolu regionů srovnávače se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── TRHY NA HOMEPAGE (src/data/trhyDvojcata.ts): čerstvost, odlehlé výnosy ──
  // Fondy na stejný index se za 12 měsíců liší o desetiny p. b. Odchylka > 1,5 p. b. od mediánu trhu =
  // vadná data (18. 10. 2026: tři třídy UBS MSCI EM +30,7 % vs. trh +23,6 % – vadná poslední cena
  // u justETF, ověřeno na burzovních cenách Yahoo). Homepage takový fond vyřadí; tady poplach.
  try {
    const zdroj = readFileSync('src/data/trhyDvojcata.ts', 'utf8');
    const trhy = [...zdroj.matchAll(/id: '([a-z0-9]+)'[\s\S]*?isins: \[([\s\S]*?)\]/g)]
      .map((m) => ({ id: m[1], isins: [...m[2].matchAll(/'([A-Z]{2}[A-Z0-9]{10})'/g)].map((x) => x[1]) }));
    if (trhy.length < 6) throw new Error(`v seznamu trhů jen ${trhy.length} trhů`);
    const vse = trhy.flatMap((t) => t.isins);
    const r = await fetch(`${URL_DB}?select=isin,name,return_1y_czk,scraping_date,returns_as_of,primary_ticker,exchange_1_ticker&isin=in.(${vse.join(',')})`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    }).then((x) => x.json());
    if (!Array.isArray(r)) throw new Error('neplatná odpověď DB');
    const podle = new Map(r.map((x) => [x.isin, x]));
    const odlehle = [], chybi = [];
    for (const t of trhy) {
      const f = t.isins.map((i) => podle.get(i)).filter(Boolean).filter((x) => x.scraping_date && dni(x) <= 14);
      chybi.push(...t.isins.filter((i) => !f.some((x) => x.isin === i)).map((i) => `${t.id}: ${i}`));
      // Jen fondy s výnosem ke dni většiny (31. 10. 2026, sDnemVetsiny) – fond o den pozadu není „mimo trh“.
      const fv = sDnemVetsiny(f.filter((x) => x.return_1y_czk != null));
      const v = fv.map((x) => Number(x.return_1y_czk)).sort((a, b) => a - b);
      if (v.length < 3) { poplach.push({ co: `Trh ${t.id} na homepage má jen ${v.length} fondů s daty (ke dni většiny)`, ukazka: [] }); continue; }
      const med = v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
      for (const x of fv) if (Math.abs(Number(x.return_1y_czk) - med) > 1.5)
        odlehle.push({ o: Math.abs(Number(x.return_1y_czk) - med), t: `${t.id}: ${x.isin} ${String(x.name).slice(0, 34)} ${Number(x.return_1y_czk).toFixed(1)} % vs. medián ${med.toFixed(1)} %` });
    }
    // 5. 11. 2026 (majitel: „každý den nový e-mail“): 1,5–5 p. b. od trhu je u fondů s jiným časem ocenění u zdroje
    // (Invesco, swapové fondy, BNP) běžné po každém prudším dni – web je sám skryje („—“, spocitejTrh) a další den se
    // srovnají. To je VAROVÁNÍ, ne poplach. Poplach jen > 5 p. b. (VRTN −82 %, HASH −97 % – skutečně vadná data).
    const ODLEHLE_POPLACH_PB = 5;
    const velke = odlehle.filter((x) => x.o > ODLEHLE_POPLACH_PB), male = odlehle.filter((x) => x.o <= ODLEHLE_POPLACH_PB);
    if (velke.length) poplach.push({ co: `${velke.length} fondů má výnos 12 m o víc než ${ODLEHLE_POPLACH_PB} p. b. mimo svůj trh – vadná data u zdroje? Ověřit na burzovních cenách`, ukazka: velke.map((x) => x.t).slice(0, 8) });
    if (male.length) varovani.push({ co: `${male.length} fondů má výnos 12 m 1,5–${ODLEHLE_POPLACH_PB} p. b. mimo svůj trh (jiný čas ocenění u zdroje; web je skrývá „—“)`, ukazka: male.map((x) => x.t).slice(0, 8) });
    if (chybi.length) varovani.push({ co: `${chybi.length} fondů ze seznamu trhů chybí nebo nemá čerstvá data`, ukazka: chybi.slice(0, 6) });
    // ÚPLNOST: velký fond na index trhu, který v seznamu chybí (a není ve VYJIMKY) = poplach.
    const vyjimky = new Set([...(zdroj.match(/VYJIMKY[\s\S]*?\};/)?.[0] ?? '').matchAll(/([A-Z]{2}[A-Z0-9]{10}):/g)].map((m) => m[1]));
    const vSeznamu = new Set(vse);
    const TRH_RE = [['svet', /(FTSE All-World|MSCI ACWI|MSCI AC World|All Country World|All-Country World|Global All[- ]Cap)/i], ['world', /(MSCI World|Developed World)/i], ['sp500', /S&P 500/i],
      ['nasdaq', /Nasdaq[- ]?100/i], ['evropa', /(STOXX Europe 600|MSCI Europe)/i], ['em', /MSCI (Emerging Markets|EM)\b/i]];
    const UZKE = /(esg|sri|screened|climate|paris|\bpab\b|\bctb\b|islamic|shariah|ex[ -]|small|mid ?cap|\bmc\b|value|momentum|quality|dividend|min(imum)? vol|low vol|leaders|select|focus|transition|sustainab|equal|factor|enhanced|universal|socially|buffer|covered|income|daily|sector|growth|information tech|energy|health|financ|consumer|industr|utilit|real estate|communic|material|optimi|catholic|fossil|top \d|filtered|capped|banks|insurance|oil|basic resources|food|automobile|chemical|travel|personal|telecom|media|construction|retail|technology|asia|latin|china|india|korea|taiwan|buyback|qvm|min te|action|pea|\b2x\b|\b3x\b|short|vix|future)/i;
    const ZAJ = /(hedged|hdg|\bh(EUR|USD|GBP|CHF|JPY)\b|pfhdg)/i;
    const kandidati = await fetch(`${URL_DB}?select=isin,name,fund_size_numeric,scraping_date&category=eq.Akcie&fund_size_numeric=gte.500&is_leveraged=not.is.true`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    }).then((x) => x.json());
    if (!Array.isArray(kandidati)) throw new Error('úplnost: neplatná odpověď DB');
    const chybiVTrhu = kandidati.filter((x) => x.scraping_date && dni(x) <= 14 && !vSeznamu.has(x.isin) && !vyjimky.has(x.isin)
      && TRH_RE.some(([, re]) => re.test(x.name || '')) && !UZKE.test(x.name || '') && (!ZAJ.test(x.name || '') || /unhedged/i.test(x.name || '')));
    if (chybiVTrhu.length) poplach.push({ co: `${chybiVTrhu.length} velkých fondů na index trhu chybí v seznamu trhů na homepage (src/data/trhyDvojcata.ts) – vítěz může být špatně`, ukazka: ukazka(chybiVTrhu, (x) => `${x.isin} ${String(x.name).slice(0, 50)} (${Math.round(x.fund_size_numeric)} mil €)`) });
    const okT = (t) => t && String(t).trim() && String(t).trim() !== '-';
    const bezTickeru = r.filter((x) => !okT(x.primary_ticker) && !okT(x.exchange_1_ticker));
    if (bezTickeru.length) varovani.push({ co: `${bezTickeru.length} fondů v trzích na homepage nemá ticker (web ukáže jen název) – doplnit ve scraperu`, ukazka: ukazka(bezTickeru) });
  } catch (e) {
    varovani.push({ co: `Kontrolu trhů na homepage se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── ZLATÁ SADA ŽEBŘÍČKŮ (živý web) ──
  // Ověřuje, že v kategorii JSOU fondy, které tam patří, a NEJSOU tam pákové produkty a fondy
  // „ex <region>" (audit 17. 10. 2026: japonské obsahovaly „ex Japan", čínské „ex-China", ropa
  // vedla 2× pákovým WTI). Selhání = POPLACH – žebříčky jsou nejnavštěvovanější stránky z Bingu.
  // Rozcestník /zebricky počítá fondy žebříčků vlastním (JS) filtrem z jednoho dotazu, žebříček SQL dotazem
  // (src/lib/zebricky.ts vs. getTopETFsForCategory). Když se rozejdou, rozcestník slibuje jiný počet fondů.
  // Každá stránka je z ISR cache (1 den) s vlastním „Data k …“: po stažení nových dat se může jedna obnovit dřív než druhá
  // a počty fondů se pak liší oprávněně. Počty porovnáváme jen u stejného dne dat (3. 11. 2026).
  const denDat = (h) => h.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;|\u00a0/g, ' ').match(/Data k\s*(\d{1,2}\.\s?\d{1,2}\.\s?\d{4})/)?.[1]?.replace(/\s/g, '') ?? null;
  let denRozcestniku = null;
  let pocetRozcestnik = new Map();
  try {
    const h = await fetch(`${WEB_URL}/zebricky`).then((r) => (r.ok ? r.text() : ''));
    pocetRozcestnik = new Map([...h.matchAll(/data-pocet="(\d+)" data-slug="([a-z0-9-]+)"/g)].map((m) => [m[2], Number(m[1])]));
    denRozcestniku = denDat(h);
    if (!pocetRozcestnik.size) varovani.push({ co: 'Rozcestník /zebricky neukazuje počty fondů (data-pocet) – nenačetl se, nebo DB nedostupná', ukazka: [] });
  } catch { varovani.push({ co: 'Rozcestník /zebricky se nenačetl', ukazka: [] }); }
  const nesouhlasi = [];

  for (const z of ZLATA_SADA) {
    let html = '';
    try { html = await fetch(`${WEB_URL}/nejlepsi-etf/${z.slug}`).then((r) => (r.ok ? r.text() : '')); } catch { /* níže */ }
    if (!html) { poplach.push({ co: `Žebříček /nejlepsi-etf/${z.slug} se nenačetl`, ukazka: [] }); continue; }
    const pocetZebricek = Number(html.match(/data-pocet-fondu="(\d+)"/)?.[1] ?? NaN);
    const pocetHub = pocetRozcestnik.get(z.slug);
    if (pocetHub != null && Number.isFinite(pocetZebricek) && pocetHub !== pocetZebricek) {
      const denZ = denDat(html);
      if (denZ && denRozcestniku && denZ !== denRozcestniku) varovani.push({ co: `${z.slug}: rozcestník ${pocetHub} fondů (data k ${denRozcestniku}), žebříček ${pocetZebricek} (data k ${denZ}) – jiný den dat, nesrovnávám`, ukazka: [] });
      else nesouhlasi.push(`${z.slug}: rozcestník ${pocetHub}, žebříček ${pocetZebricek}`);
    }
    // Indexové žebříčky: sekce „Co v kategorii je“ musí u většiny fondů poznat sledovaný index (data-index-pocet).
    // 18. 10. 2026 ukazovala „MSCI ACWI 6 z 24“ (ve skutečnosti 14) – index se bral jen z useknutého index_name.
    if (z.indexy) {
      const karty = [...html.matchAll(/data-index-pocet="(\d+)" data-index-celkem="(\d+)"/g)].map((m) => [Number(m[1]), Number(m[2])]);
      const pozn = karty.reduce((a, [n]) => a + n, 0);
      const celk = karty[0]?.[1] ?? 0;
      if (!celk || pozn / celk < z.indexy) poplach.push({ co: `Žebříček ${z.slug}: sledovaný index poznán jen u ${pozn} z ${celk} fondů (min. ${Math.round(z.indexy * 100)} %) – index fondu se odvozuje špatně`, ukazka: [] });
    }
    const isiny = new Set([...html.matchAll(/\/etf\/([A-Z]{2}[A-Z0-9]{10})/g)].map((m) => m[1]));
    const chybi = (z.musi || []).filter((i) => !isiny.has(i));
    const byName = new Map(fondy.map((f) => [f.isin, f]));
    const cizi = [...isiny].map((i) => byName.get(i)).filter((f) => f && (f.is_leveraged || (z.nesmi && z.nesmi.test(f.name || ''))));
    if (chybi.length) poplach.push({ co: `Žebříček ${z.slug}: chybí fondy, které tam patří`, ukazka: chybi });
    if (cizi.length) poplach.push({ co: `Žebříček ${z.slug}: obsahuje fondy, které tam nepatří (páka / jiný region)`, ukazka: ukazka(cizi) });
  }
  if (nesouhlasi.length) poplach.push({ co: 'Rozcestník /zebricky ukazuje jiný počet fondů než žebříček (JS a SQL filtr kategorie se rozešly)', ukazka: nesouhlasi });

  // ── POPLATKY ZDROJOVÝCH FONDŮ BACKTESTU (manifest vs. DB) ──
  // Backtest „konkrétního fondu“ přepočítává data na poplatek vybraného fondu podle sourceTer
  // v src/lib/backtest/indexes.ts. Když správce poplatek změní (17. 10. 2026: IBGS 0,15 → 0,10 %),
  // přepočet by byl o rozdíl vedle. U zdrojových fondů, které máme v DB (sourceIsin), to hlídáme.
  try {
    const { readFileSync } = await import('node:fs');
    const manifest = readFileSync(new URL('../src/lib/backtest/indexes.ts', import.meta.url), 'utf8');
    // Po položkách manifestu (pořadí polí v položce může být různé).
    const pary = manifest.split(/\n\s*\{ code: /).slice(1).flatMap((blok) => {
      const code = blok.match(/^'([a-z0-9_]+)'/)?.[1];
      const isin = blok.match(/sourceIsin: '([A-Z0-9]{12})'/)?.[1];
      const ter = blok.match(/sourceTer: ([0-9.]+)/)?.[1];
      return code && isin && ter ? [{ code, isin, ter: Number(ter) }] : [];
    });
    if (!pary.length) throw new Error('v manifestu jsem nenašel žádné sourceIsin');
    const db = await fetch(`${URL_DB}?select=isin,ter_numeric&isin=in.(${pary.map((p) => p.isin).join(',')})`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }).then((r) => r.json());
    const ruzne = pary.flatMap((p) => {
      const f = db.find((x) => x.isin === p.isin);
      const dbTer = f?.ter_numeric == null ? null : Number(f.ter_numeric) / 100;
      return dbTer != null && Math.abs(dbTer - p.ter) > 0.00005 ? [`${p.code}: manifest ${(p.ter * 100).toFixed(2)} % vs. DB ${(dbTer * 100).toFixed(2)} % (${p.isin})`] : [];
    });
    if (ruzne.length) varovani.push({ co: 'Poplatek zdrojového fondu backtestu se změnil – upravit sourceTer v indexes.ts', ukazka: ruzne });
  } catch (e) {
    varovani.push({ co: `Kontrolu poplatků zdrojových fondů se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── ČÍSLO STROJE ČASU (/stroj-casu, výchozí scénář) ──
  // Do 18. 10. 2026 bylo na homepage; majitel ho odtud vyřadil (jsme srovnávač, ne investiční web).
  // Výchozí scénář /stroj-casu (celý svět, 5 000 Kč měsíčně od 2010) je vykreslený na serveru.
  // „Dnes byste měli zhruba X mil. Kč“ se počítá
  // z měsíčních řad stroje času; tady ho nezávisle přepočítá PLNÁ simulace backtestu (jiná cesta kódu:
  // denní řada, skutečné vklady). Stroj se od backtestu liší o 0,1–0,4 % (vklad na začátku měsíce),
  // hodnota je zaokrouhlená na 0,1 mil. → tolerance 0,06 mil. + 1 %. Pravidlo č. 1, bod 4.
  try {
    const html = await fetch(`${WEB_URL}/stroj-casu`).then((r) => (r.ok ? r.text() : ''));
    const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|\u00a0/g, ' ').replace(/\s+/g, ' ');
    // Backtest končí ke dni „Data k …“ ze stránky (je v ISR cache – jinak by denní pohyb trhu
    // mezi renderem a kontrolou dělal falešný poplach).
    const dk = text.match(/[Dd]ata k ([0-9]{1,2})\. ([0-9]{1,2})\. ([0-9]{4})/);
    const konecDat = dk ? `${dk[3]}-${dk[2].padStart(2, '0')}-${dk[1].padStart(2, '0')}` : new Date().toISOString().slice(0, 10);
    // Vklad výchozího scénáře roste každý měsíc o 5 000 Kč (1/2010 až měsíc „Data k“ včetně). Dřív tu bylo natvrdo
    // „1 010 000 Kč“ (říjen 2026) → od 1. 11. 2026 kontrola jen varovala a číslo neověřovala (opraveno 12. 11. 2026).
    const vlozeno = ((Number(konecDat.slice(0, 4)) - 2010) * 12 + Number(konecDat.slice(5, 7))) * 5000;
    const vlozenoText = vlozeno.toLocaleString('cs-CZ').replace(/\s/g, ' ');
    const m = new RegExp(`vloženo(?: celkem)? ${vlozenoText} Kč`, 'i').test(text) ? text.match(/Dnes byste měli zhruba ([0-9]+(?:,[0-9])?) mil\. Kč/) : null;
    if (!m) {
      varovani.push({ co: `Stroj času neukazuje výchozí scénář (5 000 Kč měsíčně od 2010, vloženo ${vlozenoText} Kč) – změněný výchozí stav, nebo chyba`, ukazka: [] });
    } else {
      const web = Number(m[1].replace(',', '.')) * 1e6;
      const bt = await fetch(`${WEB_URL}/api/backtest/simulate`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          portfolio: [{ isin: 'ftse_all_world', name: 'ftse_all_world', indexCode: 'ftse_all_world', weight: 1, ter: 0 }],
          startDate: '2010-01-01', endDate: konecDat, initialAmount: 5000,
          currency: 'CZK', rebalancingStrategy: 'yearly', contributions: { amount: 5000, frequency: 'monthly' },
        }),
      }).then((r) => r.json());
      const ocek = bt?.summary?.netAssetValue;
      if (!ocek) varovani.push({ co: 'Číslo stroje času nešlo ověřit – backtest API neodpovědělo', ukazka: [] });
      else if (Math.abs(web - ocek) > 0.06e6 + 0.015 * ocek) {
        poplach.push({ co: 'Číslo stroje času (/stroj-casu) nesedí s plnou simulací backtestu', ukazka: [`web ${m[1]} mil. Kč vs. backtest ${(ocek / 1e6).toFixed(2)} mil. Kč`] });
      }
    }
  } catch (e) {
    varovani.push({ co: `Kontrolu čísla stroje času se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── MODELOVÁ PORTFOLIA: číslo na stránce = backtest z jejího vlastního odkazu (18. 10. 2026) ──
  // Revize: stránka strategie ukazovala 617 tis./10,5 %, backtest z jejího odkazu 612 992 Kč/10,4 % (ISR cache vs. jiný
  // konec dat). Teď odkaz nese složení, start i konec dat (`do`) a karta/sekce má data-kontrola-backtest="<odkaz>|<cagr>".
  // Kontrola z odkazu sestaví požadavek na API a porovná CAGR – poplach při rozdílu > 0,1 p. b.
  try {
    const hub = await fetch(`${WEB_URL}/portfolio-strategie`).then((r) => (r.ok ? r.text() : ''));
    const slugy = [...new Set([...hub.matchAll(/href="\/portfolio-strategie\/([a-z0-9-]+)"/g)].map((m) => m[1]))];
    const stranky = [['/portfolio-strategie', hub]];
    for (const s of slugy) stranky.push([`/portfolio-strategie/${s}`, await fetch(`${WEB_URL}/portfolio-strategie/${s}`).then((r) => (r.ok ? r.text() : ''))]);
    const nesedi = [], chybi = [];
    let overeno = 0;
    for (const [cesta, html] of stranky) {
      const kontroly = [...html.matchAll(/data-kontrola-backtest="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
      // Portfolio záměrně bez historie (Dividendové – data-bez-backtestu): nesmí ukazovat cizí historii (kolo 5, 18. 10. 2026).
      // Skutečný atribut v HTML značce – ne výskyt v RSC datech („data-bez-backtestu":"$undefined" je na každé stránce).
      if (/<[a-z]+[^>]*\sdata-bez-backtestu(="")?[\s>]/i.test(html)) {
        if (kontroly.length) nesedi.push(`${cesta}: portfolio bez historie ukazuje backtest (náhradní index = jiné portfolio)`);
        continue;
      }
      if (cesta !== '/portfolio-strategie' && !kontroly.length) { chybi.push(cesta); continue; }
      for (const k of kontroly) {
        const [odkaz, cagrStr] = k.split('|');
        const q = new URL(odkaz, WEB_URL).searchParams;
        const portfolio = (q.get('slozeni') || '').split(',').map((x) => x.split(':')).filter(([c, w]) => c && Number(w) > 0)
          .map(([c, w]) => ({ isin: c, name: c, indexCode: c, weight: Number(w) / 100, ter: 0 }));
        const bt = await fetch(`${WEB_URL}/api/backtest/simulate`, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ portfolio, startDate: q.get('start'), endDate: q.get('do') || new Date().toISOString().slice(0, 10), initialAmount: Number(q.get('amount') || 100000), currency: 'CZK', rebalancingStrategy: q.get('vyvazovani') || 'yearly' }),
        }).then((r) => r.json()).catch(() => null);
        const api = bt?.summary?.cagr, web = Number(cagrStr);
        overeno++;
        // Náhradní index (evropské akcie za nemovitosti, dluhopisy eurozóny za globální agregát, Russell 2000 za small
        // value) musí být u čísla VIDITELNĚ napsaný („Historie počítá …“), ne jen v tooltipu. Americký AGG v USD za fond
        // zajištěný do eur se nesmí vrátit (kolo 5: v Kč se chová úplně jinak).
        const slozeni = q.get('slozeni') || '';
        // kolo5 A (19. 10. 2026): eur_govt_bond už NENÍ náhrada – 60/40 a Nobelovo mají ve složení přímo zdrojový fond dat (XGLE).
        if (cesta !== '/portfolio-strategie' && /ftse_europe|us_small_cap/.test(slozeni) && !html.includes('Historie počítá'))
          nesedi.push(`${cesta}: složení přes náhradní index (${slozeni}) bez viditelné věty „Historie počítá…“`);
        if (/us_aggregate_bond/.test(slozeni)) nesedi.push(`${cesta}: modelové portfolio počítá dluhopisy přes AGG v USD (fond ve složení je zajištěný do eur)`);
        if (!(Number.isFinite(api) && Number.isFinite(web))) nesedi.push(`${cesta}: nešlo spočítat (${q.get('slozeni')})`);
        else if (Math.abs(api - web) > 0.001) nesedi.push(`${cesta} ${q.get('slozeni')}: stránka ${(web * 100).toFixed(2)} % vs. backtest ${(api * 100).toFixed(2)} % (do ${q.get('do')})`);
      }
    }
    if (nesedi.length) poplach.push({ co: 'Modelová portfolia: číslo na stránce nesedí s backtestem z jejího odkazu (> 0,1 p. b. CAGR)', ukazka: nesedi.slice(0, 8) });
    if (chybi.length) varovani.push({ co: 'Detail modelového portfolia bez kontrolního údaje data-kontrola-backtest (backtest se nespočítal?)', ukazka: chybi });
    if (!overeno) varovani.push({ co: 'Kontrola modelových portfolií nenašla žádné číslo k ověření', ukazka: [] });
  } catch (e) {
    varovani.push({ co: `Kontrolu modelových portfolií se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // --- kolo5 A --- (revize 19. 10. 2026; pravidlo č. 1, bod 4)
  // Předpočty modelových portfolií a kvízu se 18. 10. počítaly z datové cache Nextu s kurzy do 9. 10. a indexy do 16. 10.
  // (60/40 ~387 tis./7,7 % × živé API 385 346 Kč/7,6 %) a kontrola výš to nechytla – porovnávala jen CAGR s tolerancí
  // 0,1 p. b. Tady navíc:
  //  a) KONEČNÁ HODNOTA (ze 100 000 Kč) na stránce = živé API se stejnými vstupy (tolerance 0,1 %) – portfolia I kvíz,
  //  b) poslední kurz použitý v předpočtu = konec simulace („Data k …“), má-li DB kurz k tomu dni; jinak nejvýš 4 dny,
  //  c) konec předpočtu nesmí být víc než 4 dny za nejnovějšími daty v DB (kurzy i VT) – zastaralá cache,
  //  d) složka s vahou 0 % = stejný výsledek jako bez ní (dřív null → „0 Kč, ztráta −100 %“).
  // Od 11. 11. 2026 (úkol 3.1) i /backtest: výsledek po otevření a z odkazu FB je předpočet v HTML (prohlížeč API nevolá)
  // → a)–c) platí i pro něj. Jeho kontrolní údaj nese i pravidelné vklady (vklad=, freq=), měnu a vyvažování.
  try {
    const hlavicky = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
    const fxPosl = await fetch(`${URL_DB.replace('etf_funds', 'exchange_rates_historical')}?select=date&order=date.desc&limit=20`, hlavicky).then((r) => r.json());
    const fxDny = new Set((fxPosl ?? []).map((x) => x.date));
    const vtPosl = await fetch(`${URL_DB.replace('etf_funds', 'index_historical_data')}?select=date&index_code=eq.ftse_all_world&order=date.desc&limit=1`, hlavicky).then((r) => r.json());
    const dataDo = [fxPosl?.[0]?.date, vtPosl?.[0]?.date].filter(Boolean).sort()[0];
    const den = (a, b) => (Date.parse(a) - Date.parse(b)) / 864e5;
    const stranky = ['/portfolio-strategie', '/vyber-etf', '/backtest'];
    const hub = await fetch(`${WEB_URL}/portfolio-strategie`).then((r) => (r.ok ? r.text() : ''));
    for (const m of hub.matchAll(/href="\/portfolio-strategie\/([a-z0-9-]+)"/g)) if (!stranky.includes(`/portfolio-strategie/${m[1]}`)) stranky.push(`/portfolio-strategie/${m[1]}`);
    const nesedi = [], stare = [], varuj = [];
    let overeno = 0, kvizOvereno = 0, backtestOvereno = 0;
    for (const cesta of stranky) {
      const html = cesta === '/portfolio-strategie' ? hub : await fetch(`${WEB_URL}${cesta}`).then((r) => (r.ok ? r.text() : ''));
      for (const m of html.matchAll(/data-kontrola-backtest="([^"]+)"/g)) {
        const [odkaz, , navStr, kurzyDo] = m[1].replace(/&amp;/g, '&').split('|');
        if (!navStr) { nesedi.push(`${cesta}: kontrolní údaj bez konečné hodnoty (${odkaz.slice(0, 60)}…)`); continue; }
        const q = new URL(odkaz, WEB_URL).searchParams;
        const doDen = q.get('do');
        const portfolio = (q.get('slozeni') || '').split(',').map((x) => x.split(':')).filter(([c, w]) => c && Number(w) > 0)
          .map(([c, w]) => ({ isin: c, name: c, indexCode: c, weight: Number(w) / 100, ter: 0 }));
        const bt = await fetch(`${WEB_URL}/api/backtest/simulate`, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            portfolio, startDate: q.get('start'), endDate: doDen, initialAmount: Number(q.get('amount') || 100000), currency: q.get('mena') || 'CZK', rebalancingStrategy: q.get('vyvazovani') || 'yearly',
            // Pravidelné vklady jen když je odkaz výslovně uvádí (předpočty /backtest); odkazy portfolií je nemají.
            ...(q.get('freq') && q.get('freq') !== 'none' && Number(q.get('vklad')) > 0 ? { contributions: { amount: Number(q.get('vklad')), frequency: q.get('freq') } } : {}),
          }),
        }).then((r) => r.json()).catch(() => null);
        const api = bt?.summary?.netAssetValue, web = Number(navStr);
        overeno++; if (cesta === '/vyber-etf') kvizOvereno++; if (cesta === '/backtest') backtestOvereno++;
        if (!(Number.isFinite(api) && Number.isFinite(web))) nesedi.push(`${cesta}: konečnou hodnotu nešlo ověřit (${q.get('slozeni')})`);
        else if (Math.abs(api / web - 1) > 0.001) nesedi.push(`${cesta} ${q.get('slozeni')}: stránka ${Math.round(web).toLocaleString('cs-CZ')} Kč vs. backtest ${Math.round(api).toLocaleString('cs-CZ')} Kč (do ${doDen})`);
        // b) kurz posledního bodu
        if (!kurzyDo) nesedi.push(`${cesta} ${q.get('slozeni')}: předpočet neuvádí kurz posledního bodu`);
        // 19. 10. 2026: v pondělí odpoledne končil předpočet pondělím s pátečním kurzem (pondělní ještě nebyl načtený).
        else if (fxPosl?.[0]?.date && doDen > fxPosl[0].date) nesedi.push(`${cesta} ${q.get('slozeni')}: poslední bod ${doDen} je za posledním kurzem v DB (${fxPosl[0].date}) – přepočten starým kurzem`);
        else if (fxDny.has(doDen) && kurzyDo !== doDen) nesedi.push(`${cesta} ${q.get('slozeni')}: poslední bod ${doDen} přepočten kurzem z ${kurzyDo}, ačkoli v DB kurz k ${doDen} je (zastaralá data předpočtu)`);
        else if (den(doDen, kurzyDo) > 4) nesedi.push(`${cesta} ${q.get('slozeni')}: poslední bod ${doDen} přepočten ${den(doDen, kurzyDo)} dní starým kurzem (${kurzyDo})`);
        else if (kurzyDo !== doDen) varuj.push(`${cesta}: poslední bod ${doDen} s kurzem z ${kurzyDo} (svátek ECB?)`);
        // c) zastaralý předpočet
        if (dataDo && doDen && den(dataDo, doDen) > 4) stare.push(`${cesta}: předpočet končí ${doDen}, data v DB jsou do ${dataDo}`);
      }
    }
    if (nesedi.length) poplach.push({ co: 'Modelová portfolia / kvíz / backtest: konečná hodnota nebo kurz předpočtu nesedí s živým backtestem', ukazka: nesedi.slice(0, 10) });
    if (stare.length) poplach.push({ co: 'Modelová portfolia / kvíz / backtest počítají ze zastaralých dat (předpočet o víc než 4 dny za daty v DB)', ukazka: [...new Set(stare)].slice(0, 10) });
    if (varuj.length) varovani.push({ co: 'Předpočet: poslední bod bez kurzu téhož dne', ukazka: [...new Set(varuj)].slice(0, 5) });
    if (!overeno) varovani.push({ co: 'Kontrola konečných hodnot (kolo5 A) nenašla na stránkách nic k ověření', ukazka: [] });
    else if (!kvizOvereno) poplach.push({ co: 'Kvíz /vyber-etf nemá kontrolní údaje data-kontrola-backtest (čísla kvízu nejde ověřit)', ukazka: [] });
    // /backtest bez kontrolních údajů: buď předpočet na serveru selhal (návštěvník čeká na API – výpočetní čas na Vercelu),
    // nebo produkce ještě nemá úkol 3.1 nasazený → jen varování, poplach není potřeba (čísla počítá API, ne předpočet).
    if (overeno && !backtestOvereno) varovani.push({ co: '/backtest nemá kontrolní údaje předpočtu (data-kontrola-backtest) – předpočet selhal, nebo úkol 3.1 ještě není nasazený', ukazka: [] });

    // d) složka s vahou 0 % nesmí změnit výsledek
    const sim = (portfolio) => fetch(`${WEB_URL}/api/backtest/simulate`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ portfolio, startDate: '2010-01-04', endDate: '2020-12-31', initialAmount: 100000, currency: 'CZK', rebalancingStrategy: 'yearly' }),
    }).then((r) => r.json()).catch(() => null);
    const p = (c, w) => ({ isin: c, name: c, indexCode: c, weight: w, ter: 0 });
    const [bez, s0] = await Promise.all([sim([p('ftse_all_world', 1)]), sim([p('ftse_all_world', 1), p('ftse_europe', 0)])]);
    const a0 = bez?.summary?.netAssetValue, b0 = s0?.summary?.netAssetValue;
    if (!(Number.isFinite(a0) && Number.isFinite(b0)) || Math.abs(a0 - b0) > 0.01) {
      poplach.push({ co: 'Backtest: složka s vahou 0 % mění výsledek (má být stejný jako bez ní)', ukazka: [`bez ${a0} · se složkou 0 % ${b0}`] });
    }
  } catch (e) {
    varovani.push({ co: `Kontrolu kolo5 A (konečné hodnoty, kurzy předpočtu) se nepodařilo provést: ${e.message}`, ukazka: [] });
  }
  // --- konec kolo5 A ---

  // ── DVOJICE PODLE TICKERU: stejný ticker má víc fondů (SPYI = SPDR ACWI IMI na XETRA i opční fond HANetf na LSE).
  // 18. 10. 2026 /srovnani/vwce-vs-spyi ukazoval 1milionový opční fond. Stránka musí vybrat ten správný.
  try {
    for (const [cesta, isin] of [['/srovnani/vwce-vs-spyi', 'IE00B3YLTY66'], ['/srovnani/vwce-vs-cspx', 'IE00B5BMR087']]) {
      const html = await fetch(`${WEB_URL}${cesta}`).then((r) => (r.ok ? r.text() : ''));
      if (html && !html.includes(isin)) poplach.push({ co: `Stránka ${cesta} neukazuje správný fond ${isin} – ticker vede na jiný fond`, ukazka: [] });
    }
  } catch (e) {
    varovani.push({ co: `Kontrolu dvojic podle tickeru se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── DETAIL KOMODITY A KRYPTA: žádné „reinvestuje“ (revize kola 4, 18. 10. 2026) ──
  // Fyzické zlato ani bitcoin dividendy nemají, zdroj je přesto vede jako „Accumulating“ → detail psal „Dividendy:
  // Reinvestuje“ a „Fond dividendy reinvestuje – na účet nic nechodí“. Teď „Nevyplácí (komodita)“ (src/lib/dividendyFondu.ts).
  // Značka data-komodita na sekci „O fondu“ = produkce už má opravu; bez ní jde o stav před nasazením.
  try {
    for (const [isin, popis] of [['IE00B4ND3602', 'iShares Physical Gold'], ['GB00BLD4ZL17', 'CoinShares Physical Bitcoin']]) {
      const html = await fetch(`${WEB_URL}/etf/${isin}`).then((r) => (r.ok ? r.text() : ''));
      if (!html) { varovani.push({ co: `Detail ${popis} (${isin}) se nenačetl – kontrola dividend komodity vynechána`, ukazka: [] }); continue; }
      const spatne = /reinvest/i.test(html);
      if (!/data-komodita="/.test(html)) {
        if (spatne) varovani.push({ co: `Detail ${popis} na produkci ještě tvrdí „reinvestuje“ (oprava před nasazením)`, ukazka: [isin] });
      } else if (spatne) {
        poplach.push({ co: `Detail ${popis} (${isin}) tvrdí, že komodita/krypto „reinvestuje dividendy“ – nemá žádné`, ukazka: [`${WEB_URL}/etf/${isin}`] });
      } else if (!/Nevyplácí/.test(html)) {
        poplach.push({ co: `Detail ${popis} (${isin}) neukazuje „Nevyplácí“ u dividend`, ukazka: [`${WEB_URL}/etf/${isin}`] });
      }
    }
  } catch (e) {
    varovani.push({ co: `Kontrolu dividend komodit na detailu se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── KURZY pro backtest/grafy (exchange_rates_historical, pg_cron fx-topup → denně 17:00 UTC) ──
  // Do 18. 10. 2026 se plnily jen v pondělí ráno → poslední týden se přepočítával až 10 dní starým kurzem.
  try {
    const fx = await fetch(`${URL_DB.replace('etf_funds', 'exchange_rates_historical')}?select=date&order=date.desc&limit=1`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }).then((r) => r.json());
    const posledni = fx?.[0]?.date;
    const stari = posledni ? (Date.now() - new Date(posledni)) / 864e5 : Infinity;
    if (stari > 4.5) poplach.push({ co: `Kurzy měn (exchange_rates_historical) jsou staré – poslední ${posledni ?? 'žádný'}; backtest a grafy v Kč počítají se zastaralým kurzem`, ukazka: [] });
  } catch (e) {
    varovani.push({ co: `Kontrolu stáří kurzů se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── BACKTEST: vklady sedí (18. 10. 2026: počáteční vklad 0 Kč API tiše nahradilo 10 000 Kč) ──
  // Rok 2024 s 1 000 Kč měsíčně a nulovým počátečním vkladem: vklad v každém novém měsíci kromě prvního = 11 000 Kč.
  try {
    const bt = await fetch(`${WEB_URL}/api/backtest/simulate`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        portfolio: [{ isin: 'sp500', name: 'sp500', indexCode: 'sp500', weight: 1, ter: 0 }],
        startDate: '2024-01-01', endDate: '2024-12-31', initialAmount: 0,
        currency: 'CZK', rebalancingStrategy: 'yearly', contributions: { amount: 1000, frequency: 'monthly' },
      }),
    }).then((r) => r.json());
    const vlozeno = bt?.summary?.amountInvested;
    // Audit 22. 10. 2026 (S8): bez počátečního vkladu jde pravidelný vklad i první den → 12 × 1 000 = 12 000 Kč.
    // Produkce před nasazením opravy (API bez `metodika`) má ještě 11 000 (první měsíc chyběl).
    const ocekVlozeno = bt?.metodika ? 12000 : 11000;
    if (vlozeno !== ocekVlozeno) poplach.push({ co: `Backtest počítá vklady špatně (0 Kč na začátku + 1 000 Kč měsíčně v roce 2024 má dát vloženo ${ocekVlozeno.toLocaleString('cs-CZ')} Kč)`, ukazka: [`API vrací vloženo ${vlozeno}`] });
    else if (!(bt?.summary?.cagr > 0.15 && bt.summary.cagr < 0.45)) poplach.push({ co: 'Backtest s nulovým počátečním vkladem vrací nesmyslný roční výnos S&P 500 za 2024 v Kč', ukazka: [`cagr ${bt?.summary?.cagr}`] });
  } catch (e) {
    varovani.push({ co: `Kontrolu vkladů backtestu se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // --- kolo5 B --- (revize 19. 10. 2026: homepage/srovnávač/porovnání/detail/žebříčky/hledání)
  // Každá opravená chyba v datech z kola 5 B má tu kontrolu, která by ji příště chytila sama.
  {
    const hlav = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
    // Bez komentářů <!-- --> (React jimi odděluje text a výrazy – „o <!-- -->6<!-- --> méně“).
    const html = async (cesta) => { try { const r = await fetch(`${WEB_URL}${cesta}`); return r.ok ? (await r.text()).replace(/<!-- -->/g, '') : ''; } catch { return ''; } };
    const isinyZPayloadu = (t) => new Set([...t.matchAll(/isin\\":\\"([A-Z]{2}[A-Z0-9]{10})/g)].map((m) => m[1]));
    const ZAJ_NAZEV = /[Hh]edg|[Hh]dg|(^|[\s-])h(EUR|USD|GBP|CHF|JPY|SEK|SGD)\b|\bEAH [A-Z]{3}\b|\bH[- ][A-Z]{3}\b|\b[A-Z]{3} \(H\)|\b[A-Z]{3}-H\b/;
    const NEZAJ = /unhedged|not hedged|interest rate hedged|tail hedge|hedged equity|dynamically hedged/i;
    const zajistena = (n) => ZAJ_NAZEV.test(n || '') && !NEZAJ.test(n || '');

    // 1) HOMEPAGE TRHY = VÝBĚR ŽEBŘÍČKU. „Celý svět“ na homepage vyřazoval SPDR MSCI ACWI IMI (SPYI, SPSA), žebříček
    //    i srovnávač ho měly → homepage a žebříček ukazovaly jiného vítěze/jiné rozpětí. Pro 4 trhy srovnávače
    //    (svet, world, sp500, nasdaq) a EM (od 19. 10. 2026 i MSCI EM IMI) PŘESNÁ shoda: fondy žebříčku = fondy homepage
    //    nad 100 mil. € (čerstvé). Evropa: žebříček je záměrně širší (DAX, CAC, Euro Stoxx…), proto jen „každý fond homepage
    //    nad 100 mil. € je v žebříčku“. V žebříčku bez homepage smí být jen to, co homepage vyřazuje podle svých pravidel
    //    (trhyDvojcata.ts): měnově zajištěné třídy, PEA verze, „Min TE“, ESG/sektorové/regionální varianty (EM Asia,
    //    Latin America, ex China…), aktivní fondy a VYJIMKY (jiný index – FTSE EM bez Koreje, Solactive…).
    try {
      const zdroj = readFileSync('src/data/trhyDvojcata.ts', 'utf8');
      const trhy = [...zdroj.matchAll(/id: '([a-z0-9]+)'[\s\S]*?href: '\/nejlepsi-etf\/([a-z0-9-]+)'[\s\S]*?isins: \[([\s\S]*?)\]/g)]
        .map((m) => ({ id: m[1], slug: m[2], isins: [...m[3].matchAll(/'([A-Z]{2}[A-Z0-9]{10})'/g)].map((x) => x[1]) }));
      if (trhy.length < 6) throw new Error(`v seznamu trhů jen ${trhy.length} trhů`);
      const vyjimky = new Set([...(zdroj.match(/VYJIMKY[\s\S]*?\};/)?.[0] ?? '').matchAll(/([A-Z]{2}[A-Z0-9]{10}):/g)].map((m) => m[1]));
      const PRESNE = new Set(['svet', 'world', 'sp500', 'nasdaq', 'em']);
      const nesedi = [], nesediMale = [];
      for (const t of trhy) {
        const stranka = await html(`/nejlepsi-etf/${t.slug}`);
        const zeb = isinyZPayloadu(stranka);
        if (!zeb.size) { nesedi.push(`${t.id}: žebříček /nejlepsi-etf/${t.slug} se nenačetl`); continue; }
        const vse = [...new Set([...t.isins, ...zeb])];
        const db = await fetch(`${URL_DB}?select=isin,name,fund_size_numeric,scraping_date&isin=in.(${vse.join(',')})`, hlav).then((x) => x.json());
        const podle = new Map(db.map((x) => [x.isin, x]));
        const homeVelke = t.isins.filter((i) => { const f = podle.get(i); return f && f.fund_size_numeric >= 100 && dni(f) <= 14; });
        const chybiVZeb = homeVelke.filter((i) => !zeb.has(i));
        const VARIANTA = /\bPEA\b|Emergent|\bMin TE\b|ex[- ]?China|\bAsia\b|Latin|EMEA|ESG|\bSRI\b|Screened|\bCTB\b|Climate|Paris|\bPAB\b|Islamic|Socially|Responsible|Transition|Selection|Universal|Enhanced|Active|Research|Multi-?Factor|Internet|Quant|\b3D\b|Focus|Equal/i;
        const pravidloHome = (n) => zajistena(n) || VARIANTA.test(n || '');
        const chybiNaHome = PRESNE.has(t.id) ? [...zeb].filter((i) => !t.isins.includes(i) && !vyjimky.has(i) && !pravidloHome(podle.get(i)?.name)) : [];
        // 10. 11. 2026: UBS Nasdaq-100 dis (101 mil. €) překročil práh 100 mil. € – žebříček z ISR cache byl ze dne, kdy byl
        // pod prahem (za 40 min se obnovil a fond měl). Fond u prahu (< 110 mil. €) = časování cache → varování.
        for (const i of chybiVZeb) (Number(podle.get(i)?.fund_size_numeric) < 110 ? nesediMale : nesedi).push(`${t.id}: ${i} ${String(podle.get(i)?.name ?? '').slice(0, 40)} (${Math.round(Number(podle.get(i)?.fund_size_numeric) || 0)} mil. €) je na homepage, v žebříčku ne${Number(podle.get(i)?.fund_size_numeric) < 110 ? ' – velikost u prahu 100 mil. €, žebříček z cache může být z jiného dne' : ''}`);
        // 5. 11. 2026: nový malý fond v žebříčku (comdirect S&P All World, 100 mil. €, TER 0,4 %, bez ročního výnosu) nemůže
        // na homepage vyhrát → varování. Poplach jen u fondu ≥ 500 mil. € (stejný práh jako „velké fondy chybí v trhu“).
        for (const i of chybiNaHome) (Number(podle.get(i)?.fund_size_numeric) >= 500 ? nesedi : nesediMale).push(`${t.id}: ${i} ${String(podle.get(i)?.name ?? '').slice(0, 40)} (${Math.round(Number(podle.get(i)?.fund_size_numeric) || 0)} mil. €) je v žebříčku, na homepage ne`);
      }
      if (nesedi.length) poplach.push({ co: `Trhy na homepage nesouhlasí s výběrem žebříčku/srovnávače (${nesedi.length}) – src/data/trhyDvojcata.ts`, ukazka: nesedi.slice(0, 8) });
      if (nesediMale.length) varovani.push({ co: `Malé fondy v žebříčku, ne na homepage (< 500 mil. €), nebo na homepage, ne v žebříčku (u prahu 100 mil. €) (${nesediMale.length}) – doplnit do src/data/trhyDvojcata.ts nebo VYJIMKY / počkat na obnovu cache`, ukazka: nesediMale.slice(0, 8) });
      // Evropský žebříček: kontrola výše našla mimoevropské (MSCI World ex Europe, STOXX World), peněžní trh, sektory
      // STOXX 600 a 2× pákový LevDAX. Nic z toho tam nepatří (nameExcludes v etf-data.ts).
      const evr = isinyZPayloadu(await html('/nejlepsi-etf/nejlepsi-evropske-etf'));
      if (evr.size) {
        const NESMI = /ex[- ]Europe|\bWorld\b|\bCash\b|Court Terme|Overnight|Money Market|LevDAX|Oil & Gas|Basic Resources|Food|Automobiles|Chemicals|Travel|Personal & Household|Covered Call|Put Write/i;
        const jm = await fetch(`${URL_DB}?select=isin,name&isin=in.(${[...evr].join(',')})`, hlav).then((x) => x.json());
        const cizi = jm.filter((x) => NESMI.test(x.name || '')).map((x) => `${x.isin} ${String(x.name).slice(0, 50)}`);
        if (cizi.length) poplach.push({ co: `Žebříček evropských ETF obsahuje fondy, které tam nepatří (${cizi.length})`, ukazka: cizi.slice(0, 6) });
      }
      // Pákové podle názvu, které zdroj jako pákové nevede (LevDAX 2×) – skryjí se jen díky pojistce v etf-data.ts.
      const lev = await fetch(`${URL_DB}?select=isin,name&is_leveraged=not.is.true&or=(name.ilike.*LevDAX*,name.ilike.*Leveraged*,name.ilike.*%202x%20*,name.ilike.*%203x%20*)`, hlav).then((x) => x.json());
      if (Array.isArray(lev) && lev.length) varovani.push({ co: `${lev.length} fondů má v názvu páku, ale zdroj je nevede jako pákové (opravit příznak ve scraperu; web je skrývá podle názvu jen u LevDAX)`, ukazka: ukazka(lev) });
    } catch (e) {
      varovani.push({ co: `Kontrolu homepage trhy × žebříček se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 2) STRÁNKY S DATEM NESMÍ MÍT NATVRDO VELIKOSTI A VÝNOSY FONDŮ. /jaky-sp500-etf hlásila „Aktualizováno dnes“,
    //    ale měla natvrdo 131 mld. € u CSPX (DB 139,4) a „+78 % za 5 let“. Kód: velikost v mld./mil. € a „+X % za N let“
    //    v page.tsx, které ukazuje „Aktualizováno“/„Data k“. Živě: velikost CSPX na stránce vs. DB (> 10 % = poplach).
    try {
      const strankyKod = [];
      const projdi = (d) => { for (const f of readdirSync(d)) { const p = `${d}/${f}`; if (statSync(p).isDirectory()) projdi(p); else if (f === 'page.tsx') strankyKod.push(p); } };
      projdi('src/app');
      const natvrdo = [];
      for (const p of strankyKod) {
        const kod = readFileSync(p, 'utf8');
        if (!/Aktualizováno|Data k |data k /.test(kod)) continue;
        const kodBezKomentaru = kod.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
        // Prahy („fondy nad 500 mil. €“, výčet „10, 50 nebo 100 mil. €“ na /zebricky) nejsou velikost fondu – ty se nehlásí.
        const m = kodBezKomentaru.match(/(?<![\d,.])(?<!(?:nad|od|pod|aspoň|min\.|nebo)\s)[~≈]?\d+(?:[,.]\d+)?\s?(?:mld|mil)\.?\s?€|[+−-]\d+(?:[,.]\d+)?\s?%\s?za\s(?:posledních\s)?\d+\s(?:let|roky|rok)/);
        if (m) natvrdo.push(`${p}: „${m[0]}“`);
      }
      if (natvrdo.length) poplach.push({ co: `${natvrdo.length} stránek s datem aktualizace má natvrdo velikost/výnos fondu – načítat z DB`, ukazka: natvrdo.slice(0, 6) });
      const sp = await html('/jaky-sp500-etf');
      const m = sp.match(/CSPX \/ SXR8[\s\S]{0,1500}?(\d+(?:,\d)?)\s?mld\.\s?€/);
      const cspx = await fetch(`${URL_DB}?select=fund_size_numeric,ter_numeric&isin=eq.IE00B5BMR087`, hlav).then((x) => x.json());
      if (!m) poplach.push({ co: '/jaky-sp500-etf: velikost CSPX na stránce chybí (nebo se nenačetla)', ukazka: [] });
      else if (cspx[0]?.fund_size_numeric && Math.abs(Number(m[1].replace(',', '.')) * 1000 / cspx[0].fund_size_numeric - 1) > 0.10)
        poplach.push({ co: '/jaky-sp500-etf: velikost CSPX se liší od DB o víc než 10 %', ukazka: [`stránka ${m[1]} mld. €, DB ${(cspx[0].fund_size_numeric / 1000).toFixed(1)} mld. €`] });
      // Poplatky uvedené v textu stránky (SPDR 0,03 %, Invesco 0,05 %, iShares/Vanguard 0,07 %) vs. DB.
      const TER_TEXT = { IE00B5BMR087: 0.07, IE00BFMXXD54: 0.07, IE00B3XXRP09: 0.07, IE0031442068: 0.07, IE000XZSV718: 0.03, IE00B6YX5C33: 0.03, IE00B3YCGJ38: 0.05 };
      const ters = await fetch(`${URL_DB}?select=isin,ter_numeric&isin=in.(${Object.keys(TER_TEXT).join(',')})`, hlav).then((x) => x.json());
      const jinyTer = ters.filter((x) => Number(x.ter_numeric) !== TER_TEXT[x.isin]).map((x) => `${x.isin}: DB ${x.ter_numeric} %, text ${TER_TEXT[x.isin]} %`);
      if (jinyTer.length) varovani.push({ co: '/jaky-sp500-etf: poplatek v textu (FAQ, vodítko) už nesedí s DB – upravit text', ukazka: jinyTer });
    } catch (e) {
      varovani.push({ co: `Kontrolu natvrdo zapsaných čísel se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 3) INDEX NA STRÁNKÁCH DVOJIC: index_name bývá prázdný řetězec (SPYI) → prázdná buňka „Sledovaný index“.
    try {
      const prazdne = [];
      // Na produkci jen dvojice z pevné sady (iusq-vs-spyi se vykresluje na vyžádání → ISR zápis).
      for (const par of R.cesty(['vwce-vs-spyi', 'iusq-vs-spyi', 'vwce-vs-cspx', 'vwce-vs-iwda'].map((x) => `/srovnani/${x}`), 'Index na stránkách dvojic (kolo5 B)').map((c) => c.slice('/srovnani/'.length))) {
        const t = await html(`/srovnani/${par}`);
        if (!t) { prazdne.push(`${par}: stránka se nenačetla`); continue; }
        const m = t.match(/Sledovaný index<\/span><\/td><td[^>]*>([^<]*)<\/td><td[^>]*>([^<]*)<\/td>/) || t.match(/>Index<\/td><td[^>]*>([^<]*)<\/td><td[^>]*>([^<]*)<\/td>/);
        if (m && (!m[1].trim() || !m[2].trim())) prazdne.push(`${par}: „${m[1]}“ / „${m[2]}“`);
      }
      const detail = await html('/etf/IE00B3YLTY66');
      if (detail && !/Sledovaný index[\s\S]{0,400}?MSCI ACWI IMI/.test(detail)) prazdne.push('detail SPYI: index není „MSCI ACWI IMI“');
      if (prazdne.length) poplach.push({ co: 'Prázdný / chybný sledovaný index na stránce dvojice nebo detailu (indexFonduLabel)', ukazka: prazdne });
    } catch (e) {
      varovani.push({ co: `Kontrolu indexu na dvojicích se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 4) HLEDÁNÍ PODLE INDEXU A TŘÍDY: „ACWI“ nenašel IUSQ ani SPYI, „ACWI IMI“ jen sektorový fond; výsledky
    //    nešlo rozlišit (8× „iShares Core S&P 500 UCITS …“) → API vrací třídu (výplata/měna/zajištění).
    try {
      const OCEK = [{ q: 'ACWI', musi: ['IE00B6R52259', 'IE00B3YLTY66'] }, { q: 'ACWI IMI', musi: ['IE00B3YLTY66'] }, { q: 'VWCE', prvni: 'IE00BK5BQT80' }];
      const chyby = [];
      for (const o of OCEK) {
        const r = await fetch(`${WEB_URL}/api/etf/search?q=${encodeURIComponent(o.q)}`).then((x) => x.json());
        const isiny = (r.results ?? []).map((x) => x.isin);
        if (!('kategorie' in r)) continue; // produkce před nasazením
        for (const i of o.musi ?? []) if (!isiny.includes(i)) chyby.push(`${o.q}: chybí ${i}`);
        if (o.prvni && isiny[0] !== o.prvni) chyby.push(`${o.q}: první ${isiny[0] ?? 'nic'} místo ${o.prvni}`);
        if (r.results?.length && !r.results.some((x) => x.trida)) chyby.push(`${o.q}: výsledky nemají třídu (Acc/Dist) – nejdou rozlišit`);
      }
      if (chyby.length) poplach.push({ co: 'Hledání podle indexu (ACWI) nevrací očekávané fondy', ukazka: chyby });
    } catch (e) {
      varovani.push({ co: `Kontrolu hledání podle indexu se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 5) SEKTORY: každý název sektoru v DB musí mít český překlad (src/lib/preklady.ts, SEKTORY). Zdroj má vlastní
    //    klasifikaci (ne GICS, ne TRBC) – nový název = neznámý sektor anglicky na webu.
    try {
      const prekl = readFileSync('src/lib/preklady.ts', 'utf8').match(/export const SEKTORY[\s\S]*?\n\};/)?.[0] ?? '';
      const zname = new Set([...prekl.matchAll(/(?:'([^']+)'|([A-Za-z]+)):\s*'/g)].map((m) => m[1] ?? m[2]));
      const nazvy = new Map();
      for (let off = 0; ; off += 1000) {
        const b = await fetch(`${URL_DB}?select=sector_1_name,sector_2_name,sector_3_name,sector_4_name,sector_5_name&order=isin&limit=1000&offset=${off}`, hlav).then((x) => x.json());
        for (const x of b) for (const v of Object.values(x)) if (v && String(v).trim()) nazvy.set(String(v).trim(), (nazvy.get(String(v).trim()) ?? 0) + 1);
        if (b.length < 1000) break;
      }
      const bez = [...nazvy].filter(([n]) => !zname.has(n));
      if (!zname.size) throw new Error('slovník SEKTORY v preklady.ts nenalezen');
      if (bez.length) varovani.push({ co: `${bez.length} názvů sektorů v DB nemá český překlad (src/lib/preklady.ts) – na webu by byly anglicky`, ukazka: bez.slice(0, 6).map(([n, c]) => `${n} (${c}×)`) });
    } catch (e) {
      varovani.push({ co: `Kontrolu překladu sektorů se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 6) JEDEN TICKER: detail zlata ukazoval PPFB (XETRA), zbytek webu SGLN. Top 50 fondů podle velikosti:
    //    ticker v hlavičce detailu (data-ticker) = ticker ve srovnávači (/api/etf/screener).
    try {
      const rows = await fetch(`${WEB_URL}/api/etf/screener`).then((r) => r.json());
      if (!Array.isArray(rows)) throw new Error('API srovnávače nevrátilo data');
      // Lokálně top 50 podle velikosti (mění se s daty → na produkci by každý den sahalo na nové detaily = ISR zápisy);
      // na produkci pevná sada PROD_DETAILY (scripts/lib/cil.mjs).
      const top = R.produkce
        ? rows.filter((r) => R.PROD_DETAILY.includes(r.isin))
        : rows.filter((r) => !r.is_leveraged).sort((a, b) => (b.fund_size_numeric ?? 0) - (a.fund_size_numeric ?? 0)).slice(0, 50);
      R.jenLokalne(`Jeden ticker detail × srovnávač: top 50 fondů jen lokálně, na produkci ${top.length} fondů z pevné sady`);
      const jine = [];
      let bezAtributu = 0;
      for (let i = 0; i < top.length; i += 5) {
        await Promise.all(top.slice(i, i + 5).map(async (r) => {
          const t = await html(`/etf/${r.isin}`);
          const m = t.match(/data-ticker="true"[^>]*>([^<]+)</);
          if (!m) { bezAtributu++; return; }
          if (r.primary_ticker && m[1].trim().toUpperCase() !== String(r.primary_ticker).trim().toUpperCase()) jine.push(`${r.isin}: detail ${m[1]}, srovnávač ${r.primary_ticker}`);
        }));
      }
      if (bezAtributu === top.length) varovani.push({ co: 'Detail fondu ještě nemá data-ticker (před nasazením) – kontrola jednoho tickeru vynechána', ukazka: [] });
      else if (jine.length) poplach.push({ co: `${jine.length} z top 50 fondů má na detailu jiný ticker než ve srovnávači (src/lib/ticker.ts → zobrazovanyTicker)`, ukazka: jine.slice(0, 6) });
    } catch (e) {
      varovani.push({ co: `Kontrolu jednoho tickeru se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 8) JEDNOTNÉ NÁZVY VÝPLATY A TŘÍD: dřív „reinv.“, „Reinvestuje (ACC)“, „Akumulační (reinvestuje)“ a u akumulačního
    //    fondu v řádku Dividendový výnos „nevyplácí“ (zavádějící). Třídy v žebříčcích syrově („· 1C“, „· USD acc“, „Ukdis“).
    try {
      const SOUBORY = ['src/components/design-preview/ScreenerUI.tsx', 'src/components/design-preview/PorovnaniTable.tsx',
        'src/components/design-preview/SrovnaniCompareUI.tsx', 'src/app/etf/[isin]/page.tsx'];
      const ZAKAZANE = [/>reinv\.</, /Reinvestuje \(ACC\)/, /Vyplácí \(DIST\)/, /' \(reinvestuje\)'/, /kind === 'acc'\) return <span[^>]*>nevyplácí/];
      const kod = SOUBORY.flatMap((p) => { const t = readFileSync(p, 'utf8'); return ZAKAZANE.filter((re) => re.test(t)).map((re) => `${p}: ${re}`); });
      if (kod.length) poplach.push({ co: 'Starý název výplaty dividend v kódu (jednotně: Reinvestuje / Vyplácí, výnos u Acc „— (reinvestuje)“)', ukazka: kod });
      const par = await html('/srovnani/vwce-vs-cspx');
      const radek = par.match(/Dividendový výnos[\s\S]{0,700}?<\/tr>/)?.[0] ?? '';
      if (/>nevyplácí</.test(radek)) poplach.push({ co: 'VWCE vs CSPX: u akumulačního fondu „nevyplácí“ v řádku Dividendový výnos', ukazka: [] });
      const syrove = [];
      for (const slug of ['nejlepsi-celosvetove-etf', 'nejlepsi-sp500-etf', 'nejlepsi-msci-world-etf']) {
        const t = await html(`/nejlepsi-etf/${slug}`);
        const m = t.match(/nazev\\":\\"[^"\\]*· (?:\d[A-Z]|[A-Z]{3} (?:acc|dis|Ukdis|Acc|Dist))\\"/);
        if (m) syrove.push(`${slug}: ${m[0].slice(10, 80)}`);
      }
      if (syrove.length) varovani.push({ co: 'Žebříček ukazuje syrový kód třídy fondu (· 1C, · USD acc) – zobrazovat přes src/lib/nazevFondu.ts', ukazka: syrove });
    } catch (e) {
      varovani.push({ co: `Kontrolu jednotných názvů se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 12) /zebricky: „Největší fondy 2 259“ × „Nejlevnější fondy 2 253“ bez vysvětlení. Rozdíl musí být vysvětlený
    //     (produkty s TER 0 % – fyzické zlato, krypto se stakingem) a sedět s počty.
    try {
      const t = await html('/zebricky');
      const pocet = (slug) => Number(t.match(new RegExp(`data-pocet="(\\d+)" data-slug="${slug}"`))?.[1] ?? NaN);
      const a = pocet('nejlepsi-etf-2026'), b = pocet('nejlevnejsi-etf');
      if (Number.isFinite(a) && Number.isFinite(b) && a !== b) {
        const m = t.match(/Nejlevnějších je o (\d[\d\s ]*) méně/);
        if (!m) varovani.push({ co: `/zebricky: Největší fondy ${a} × Nejlevnější ${b} bez vysvětlení rozdílu`, ukazka: [] });
        else if (Number(m[1].replace(/\D/g, '')) !== a - b) poplach.push({ co: '/zebricky: vysvětlený rozdíl počtů nesedí', ukazka: [`text ${m[1]}, skutečně ${a - b}`] });
        if (a - b > 20) varovani.push({ co: `/zebricky: nejlevnějších je o ${a - b} méně – víc než jen produkty s TER 0 %? Prověřit`, ukazka: [] });
      }
      // 3.4 (11. 11. 2026): „Celý svět“ na rozcestníku ukazuje výnos NEJVĚTŠÍHO fondu žebříčku. Dřív to byl EUNL (MSCI World =
      // jen vyspělé trhy). Název fondu z DB (ne z kódu webu) musí být index celého světu (All-World/ACWI/All Country/Global All Cap).
      const nvSvet = t.match(/data-slug="nejlepsi-celosvetove-etf"[^>]*data-nejvetsi="([A-Z0-9]*)"/)?.[1];
      if (nvSvet) {
        const f = fondy.find((x) => x.isin === nvSvet);
        const jmeno = f?.name ?? '';
        if (!f) varovani.push({ co: `/zebricky: největší fond „Celý svět“ ${nvSvet} není v databázi`, ukazka: [] });
        else if (!/all[- ]world|acwi|all country|ac world|global all[- ]?cap/i.test(jmeno) || /\bMSCI World\b/i.test(jmeno))
          poplach.push({ co: `/zebricky: „Celý svět“ ukazuje jako největší fond ${nvSvet} (${jmeno}) – není to index celého světa (MSCI World = jen vyspělé trhy)`, ukazka: [] });
      }
    } catch (e) {
      varovani.push({ co: `Kontrolu počtů na /zebricky se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 13) HOMEPAGE BROKEŘI: redakční skóre zrušeno (majitel 19. 10. 2026) → žádné „Skóre“ ani „/100“, řazení abecedně.
    try {
      const t = await html('/');
      const sekce = t.match(/data-sekce="brokeri"[\s\S]*?<\/section>/)?.[0] ?? '';
      if (!sekce) varovani.push({ co: 'Homepage: sekce brokerů nenalezena (kontrola skóre vynechána)', ukazka: [] });
      else {
        const chyby = [];
        if (/Skóre|\/100<|skóre/.test(sekce)) chyby.push('v sekci je skóre');
        const jmena = [...sekce.matchAll(/text-sm font-semibold text-slate-900 truncate">([^<]+)</g)].map((m) => m[1]);
        const brokeri = jmena.filter((j) => j !== 'Portu');
        const serazene = [...brokeri].sort((a, b) => a.localeCompare(b, 'cs'));
        if (brokeri.join('|') !== serazene.join('|')) chyby.push(`pořadí ${brokeri.join(', ')} není abecední`);
        if (chyby.length) poplach.push({ co: 'Homepage – brokeři: skóre je zrušené, řazení má být abecední', ukazka: chyby });
      }
    } catch (e) {
      varovani.push({ co: `Kontrolu brokerů na homepage se nepodařilo provést: ${e.message}`, ukazka: [] });
    }
  }
  // --- konec kolo5 B ---

  // ── CHYBY Z PROHLÍŽEČŮ za 24 h (tabulka client_errors, plní /api/client-error) ──
  // Zatím jen VAROVÁNÍ: běžnou úroveň ještě neznáme. Poplach doplnit, až bude pár týdnů dat.
  const od = new Date(Date.now() - 864e5).toISOString();
  const ce = await fetch(`${URL_DB.replace('etf_funds', 'client_errors')}?select=kind,message,page,ua&created_at=gte.${od}&limit=1000`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (ce.ok) {
    const chyby = (await ce.json()).filter((x) => !/^TEST-claude/.test(String(x.message).replace(/^Uncaught (Error: )?/, '')));
    if (chyby.length) {
      const sk = {};
      for (const x of chyby) { const k = `[${x.kind}] ${String(x.message).slice(0, 90)} @ ${x.page}`; sk[k] = (sk[k] || 0) + 1; }
      const top = Object.entries(sk).sort((a, b) => b[1] - a[1]);
      varovani.push({ co: `${chyby.length} chyb z prohlížečů návštěvníků za 24 h (${top.length} různých)`, ukazka: top.slice(0, 5).map(([k, c]) => `${c}× ${k}`) });
    }
  } else {
    varovani.push({ co: `Tabulku client_errors se nepodařilo načíst (HTTP ${ce.status})`, ukazka: [] });
  }

  // --- kolo5 C ---
  // ── VÝNOSY ZA OBDOBÍ (letos, 1 m, 3 m, 6 m, 1 r, 3 r, 5 let) vs. nezávislý přepočet z denních cen ──
  // 19. 10. 2026: scrape z 18. 10. měl výnosy za období posunuté u všech fondů (SXR8 letos +18,64 % místo +17,69 %
  // v EUR, EMIM naopak 21,06 místo 21,58 %): zdroj měl při stahování jako poslední bod předběžnou evropskou cenu
  // (≈ závěr Xetry v 17:30), začátky období ale v pozdní (večerní) kotaci. Chyba = pohyb trhu mezi 17:30 a večerem,
  // u fondů na USA běžně 0,3–1 % – stejná u všech období jednoho fondu. Kalendářní roky (return_2025…) sedí.
  // DVĚ VRSTVY:
  //  A) PŘESNÁ: výnosy přepočítané TÍMTO skriptem z holých denních cen (justETF performance-chart, s dividendami
  //     kvůli distribučním fondům) ke dni dat. Finální data sedí na 0,00 p. b. – ověřeno 19. 10. 2026 proti profilu
  //     justETF (SXR8 17,69 / 4,04 / 3,83 / 14,39 / 20,72 / 69,23 / 87,13 %; EXSA i SGLN beze změny).
  //  B) NEZÁVISLÝ ZDROJ: závěrečné ceny Xetra (Yahoo, adjclose kvůli dividendám). Závěr Xetry (17:30) a večerní
  //     kotace se u fondů na USA liší o 0,25 % (medián) až 0,7 % (p90) denně – stejně jako samotná chyba, takže
  //     jemnou chybu Xetra rozlišit NEUMÍ (simulace na 251 dnech 10/2025–10/2026: práh 0,4 p. b. = falešný poplach
  //     52 % dní, zachytí 17 % chyb). Hlídá hrubé chyby (data o dny pozadu, jiná měna, jiný fond): medián rozdílu
  //     přes období > 2,5 p. b. (simulace: 0 falešných poplachů za rok). Yahoo z GitHub Actions funguje
  //     (sync-indexes.yml stahuje stejné API denně, User-Agent nutný).
  // Den dat = poslední pracovní den před stažením (stejná logika jako src/lib/datumCen.ts), pro každý fond zvlášť.
  // Poplach: rozdíl u ≥ 2 kotevních fondů; u 1 fondu varování. Zdroj neodpoví → varování, nikdy tichý úspěch.
  try {
    const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; etfpruvodce.cz kontrola dat)' };
    const KOTVY = [
      ['IE00B5BMR087', 'SXR8.DE'], ['IE00BK5BQT80', 'VWCE.DE'], ['IE00B4L5Y983', 'EUNL.DE'], ['DE0002635307', 'EXSA.DE'],
      ['IE00BKM4GZ66', 'IS3N.DE'], ['IE00B53SZB19', 'SXRV.DE'], ['IE00B4ND3602', 'PPFB.DE'], // IS3N = EMIM na Xetře, PPFB = SGLN
    ];
    const OBDOBI = { ytd: 'letos', '1m': '1 m', '3m': '3 m', '6m': '6 m', '1y': '1 r', '3y': '3 r', '5y': '5 let' };
    const MESICU = { '1m': 1, '3m': 3, '6m': 6, '1y': 12, '3y': 36, '5y': 60 };
    const PRAH_A = 0.4, PRAH_B = 2.5; // p. b.
    const datumCenD = (stazeno) => { // kopie src/lib/datumCen.ts (stažení před 18:00 Praha → předchozí pracovní den)
      const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false }).formatToParts(stazeno);
      const v = (t) => Number(p.find((x) => x.type === t)?.value);
      const d = new Date(Date.UTC(v('year'), v('month') - 1, v('day'), 12));
      const prac = (x) => x.getUTCDay() !== 0 && x.getUTCDay() !== 6;
      if (v('hour') < 18 || !prac(d)) { do d.setUTCDate(d.getUTCDate() - 1); while (!prac(d)); }
      return d.toISOString().slice(0, 10);
    };
    const zpet = (d, mes) => { // o `mes` měsíců zpět, den oříznutý na konec měsíce (31. 3. − 1 m = 28. 2.)
      const [r, m, den] = d.split('-').map(Number);
      const t = r * 12 + (m - 1) - mes, nr = Math.floor(t / 12), nm = t - nr * 12;
      const posl = new Date(Date.UTC(nr, nm + 1, 0)).getUTCDate();
      return `${nr}-${String(nm + 1).padStart(2, '0')}-${String(Math.min(den, posl)).padStart(2, '0')}`;
    };
    const zacatek = (d, o) => (o === 'ytd' ? `${Number(d.slice(0, 4)) - 1}-12-31` : zpet(d, MESICU[o]));
    const bod = (rada, d) => { let r = null; for (const b of rada) { if (b[0] <= d) r = b; else break; } return r; }; // poslední cena ≤ d
    const dnu = (a, b) => (new Date(b) - new Date(a)) / 864e5;
    const vynos = (rada, d, o, maxStariKonce) => {
      const e = bod(rada, d), s = bod(rada, zacatek(d, o));
      if (!e || !s || dnu(e[0], d) > maxStariKonce || dnu(s[0], zacatek(d, o)) > 7) return null;
      return (e[1] / s[1] - 1) * 100;
    };
    const fmt = (x) => x.toFixed(2).replace('.', ',');
    const db = await fetch(`${URL_DB}?select=isin,name,primary_ticker,scraping_date,returns_as_of,${Object.keys(OBDOBI).map((o) => `return_${o}`).join(',')}&isin=in.(${KOTVY.map((k) => k[0]).join(',')})`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }).then((r) => r.json());
    if (!Array.isArray(db)) throw new Error('neplatná odpověď DB');
    const vysA = [], vysB = [], nejdeA = [], nejdeB = [];
    for (const [isin, xetra] of KOTVY) {
      const f = db.find((x) => x.isin === isin);
      if (!f?.scraping_date) { nejdeA.push(`${isin}: v DB chybí`); continue; }
      // kolo6b (21. 10. 2026): výnosy platí ke dni returns_as_of (poslední jistě konečný den řady fondu), ne ke dni
      // odvozenému z času stažení – jinak by tahle kontrola po nasazení nového scraperu hlásila falešný rozdíl.
      const D = f.returns_as_of ? String(f.returns_as_of).slice(0, 10) : datumCenD(new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(f.scraping_date) ? f.scraping_date : `${f.scraping_date}Z`));
      const jm = `${f.primary_ticker || isin}`;
      // A) justETF holé denní ceny (EUR, s dividendami). Řada má i víkendy → konec musí být přesně den dat.
      try {
        const od = zpet(D, 62);
        const j = await fetch(`https://www.justetf.com/api/etfs/${isin}/performance-chart?locale=en&currency=EUR&valuesType=MARKET_VALUE&reduceData=false&includeDividends=true&features=DIVIDENDS&dateFrom=${od}&dateTo=${D}`, { headers: UA })
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))));
        const rada = (j.series ?? []).map((p) => [p.date, Number(p.value?.raw)]).filter(([, v]) => v > 0);
        const rozdily = Object.keys(OBDOBI).flatMap((o) => {
          const v = vynos(rada, D, o, 0), dbV = f[`return_${o}`];
          return v == null || dbV == null ? [] : [{ o, dbV: Number(dbV), v, r: Number(dbV) - v }];
        });
        if (rozdily.length < 3) nejdeA.push(`${jm}: k ${D} málo dat (${rozdily.length} období)`);
        else {
          const nej = rozdily.reduce((a, b) => (Math.abs(b.r) > Math.abs(a.r) ? b : a));
          if (Math.abs(nej.r) > PRAH_A) vysA.push(`${jm} k ${D}: ${rozdily.filter((x) => Math.abs(x.r) > PRAH_A).map((x) => `${OBDOBI[x.o]} DB ${fmt(x.dbV)} % vs. přepočet ${fmt(x.v)} %`).join('; ')}`);
        }
      } catch (e) { nejdeA.push(`${jm}: justETF neodpověděl (${e.message})`); }
      // B) Yahoo – závěrečné ceny Xetra (adjclose = s dividendami). Konec nejvýš 4 dny před dnem dat (svátek burzy).
      try {
        const y = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${xetra}?interval=1d&range=6y`, { headers: UA })
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))));
        const res = y?.chart?.result?.[0];
        const adj = res?.indicators?.adjclose?.[0]?.adjclose ?? res?.indicators?.quote?.[0]?.close;
        if (!res?.timestamp || !adj) throw new Error('bez dat');
        const rada = res.timestamp.map((t, i) => [new Date(t * 1000).toISOString().slice(0, 10), adj[i]]).filter(([, v]) => v > 0);
        const rozdily = Object.keys(OBDOBI).flatMap((o) => {
          const v = vynos(rada, D, o, 4), dbV = f[`return_${o}`];
          return v == null || dbV == null ? [] : [{ o, dbV: Number(dbV), v, r: Number(dbV) - v }];
        }).sort((a, b) => a.r - b.r);
        if (rozdily.length < 3) nejdeB.push(`${xetra}: k ${D} málo dat (${rozdily.length} období)`);
        else {
          const med = rozdily[Math.floor(rozdily.length / 2)];
          if (Math.abs(med.r) > PRAH_B) vysB.push(`${jm} (${xetra}) k ${D}: medián rozdílu ${fmt(med.r)} p. b. (${rozdily.map((x) => `${OBDOBI[x.o]} ${fmt(x.dbV)} vs. ${fmt(x.v)}`).join(', ')})`);
        }
      } catch (e) { nejdeB.push(`${xetra}: Yahoo neodpověděl (${e.message})`); }
    }
    const TEXT = 'Výnosy za období nesedí s burzovními cenami (scrape stáhl předběžná data?)';
    if (vysA.length >= 2) poplach.push({ co: `${TEXT} – ${vysA.length} z ${KOTVY.length} kotevních fondů se liší o víc než ${fmt(PRAH_A)} p. b. od přepočtu z denních cen (justETF). Znovu stáhnout po zveřejnění finálních cen (scraper etf-astro).`, ukazka: vysA });
    else if (vysA.length === 1) varovani.push({ co: `Výnosy za období: 1 kotevní fond se liší o víc než ${fmt(PRAH_A)} p. b. od přepočtu z denních cen (justETF)`, ukazka: vysA });
    if (vysB.length >= 2) poplach.push({ co: `${TEXT} – ${vysB.length} z ${KOTVY.length} kotevních fondů se liší od závěrečných cen Xetra o víc než ${fmt(PRAH_B)} p. b. (medián přes období)`, ukazka: vysB });
    else if (vysB.length === 1) varovani.push({ co: `Výnosy za období: 1 kotevní fond se liší od závěrečných cen Xetra o víc než ${fmt(PRAH_B)} p. b.`, ukazka: vysB });
    if (nejdeA.length) varovani.push({ co: `Kontrolu výnosů za období proti denním cenám (justETF) nešlo provést u ${nejdeA.length} z ${KOTVY.length} kotevních fondů`, ukazka: nejdeA });
    if (nejdeB.length) varovani.push({ co: `Kontrolu výnosů za období proti cenám Xetra (Yahoo) nešlo provést u ${nejdeB.length} z ${KOTVY.length} kotevních fondů`, ukazka: nejdeB });
  } catch (e) {
    varovani.push({ co: `Kontrolu výnosů za období (letos, 1 m … 5 let) se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // ── SKÓRE BROKERŮ ZRUŠENO (rozhodnutí majitele 19. 10. 2026, ZAMERNA-ROZHODNUTI.md) ──
  // Redakční skóre 0–100 působilo jako doporučení. Viditelný text stránek o brokerech (bez skriptů a JSON-LD) nesmí
  // obsahovat „Skóre“ ani „/100“ a strukturovaná data nesmí mít hodnocení (ratingValue / aggregateRating).
  try {
    const nalezy = [], nenacteno = [];
    for (const s of ['/srovnani-brokeru', '/kde-koupit', '/recenze/xtb', '/']) {
      const html = await fetch(`${WEB_URL}${s}`).then((r) => (r.ok ? r.text() : '')).catch(() => '');
      if (!html) { nenacteno.push(s); continue; }
      const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;|&#160;| /g, ' ').replace(/\s+/g, ' ');
      const m = text.match(/.{0,40}(Skóre|skóre|\d\s*\/\s*100\b).{0,30}/);
      if (m) nalezy.push(`${s}: „${m[0].trim()}“`);
      if (/"(ratingValue|aggregateRating)"/.test(html)) nalezy.push(`${s}: JSON-LD s hodnocením (ratingValue/aggregateRating)`);
    }
    if (nalezy.length) poplach.push({ co: 'Stránky o brokerech ukazují zrušené skóre brokerů (Skóre, /100 nebo hodnocení v JSON-LD)', ukazka: nalezy });
    if (nenacteno.length) varovani.push({ co: 'Kontrolu zrušeného skóre brokerů nešlo provést – stránka se nenačetla', ukazka: nenacteno });
  } catch (e) {
    varovani.push({ co: `Kontrolu zrušeného skóre brokerů se nepodařilo provést: ${e.message}`, ukazka: [] });
  }
  // --- /kolo5 C ---

  // --- kolo6 zebricky --- (revize 20. 10. 2026: žebříčky a články /pruvodce, /jak-zacit, /dane-z-etf; pravidlo č. 1, bod 4)
  {
    const hlav = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
    const html = async (cesta) => { try { const r = await fetch(`${WEB_URL}${cesta}`); return r.ok ? (await r.text()).replace(/<!-- -->/g, '') : ''; } catch { return ''; } };
    const isinyZPayloadu = (t) => new Set([...t.matchAll(/isin\\":\\"([A-Z]{2}[A-Z0-9]{10})/g)].map((m) => m[1]));
    const db = async (isiny, sloupce = 'isin,name,investment_focus,fund_size_numeric,scraping_date') => {
      const out = [];
      for (let i = 0; i < isiny.length; i += 150) {
        const r = await fetch(`${URL_DB}?select=${sloupce}&isin=in.(${isiny.slice(i, i + 150).join(',')})`, hlav);
        if (!r.ok) throw new Error(`Supabase HTTP ${r.status}`);
        out.push(...(await r.json()));
      }
      return out;
    };
    const sekce = (t, jmeno) => t.match(new RegExp(`data-sekce="${jmeno}"[\\s\\S]*?</section>`))?.[0] ?? '';
    const ZAJ = /[Hh]edg|(^|[\s-])h(EUR|USD|GBP|CHF|JPY)\b/;
    const ZEBRICKY = ['nejlepsi-etf-2026', 'nejlepsi-evropske-etf', 'nejlepsi-dividendove-etf', 'nejlepsi-realitni-etf', 'nejlepsi-dluhopisove-etf',
      'nejlepsi-vladni-dluhopisy-etf', 'nejlepsi-akciove-etf', 'nejlepsi-zlato-etf', 'nejlepsi-bitcoin-etf', 'nejlepsi-emerging-markets-etf',
      'nejlepsi-energeticke-etf', 'nejlepsi-financni-etf', 'nejlepsi-sp500-etf', 'nejlepsi-obnovitelne-zdroje-etf'];
    const stranky = new Map();
    for (const slug of ZEBRICKY) stranky.set(slug, await html(`/nejlepsi-etf/${slug}`));

    // 1) CIZÍ FONDY V KATEGORIÍCH. Revize našla: XUKX (obyčejný FTSE 100, „Income“ = třída) a opční „Premium Income“
    //    v dividendových, fondy peněžního trhu v akciových, UmweltBank SDG ve finančních, koš Bitcoin+Gold v zlatě
    //    i bitcoinu, čistou energii v energetických. Pravidla: nameExcludes/focusContains v src/lib/etf-data.ts.
    try {
      const PRAVIDLA = {
        'nejlepsi-dividendove-etf': (f) => /Premium Income|High Income|Option Income|Options|Covered Call|Put Write|Target Income|Enhanced Income|Portfolio Income|FTSE 100 UCITS ETF Income/i.test(f.name) || /Covered Call|Put Write/i.test(f.investment_focus ?? ''),
        'nejlepsi-akciove-etf': (f) => /^Money Market/i.test(f.investment_focus ?? ''),
        'nejlepsi-dluhopisove-etf': (f) => /^Money Market/i.test(f.investment_focus ?? ''),
        'nejlepsi-financni-etf': (f) => !/Financials|Insurance/i.test(f.investment_focus ?? ''),
        'nejlepsi-zlato-etf': (f) => /Bitcoin|Yield/i.test(f.name) || !/Precious Metals/i.test(f.investment_focus ?? ''),
        'nejlepsi-bitcoin-etf': (f) => /Gold|Ethereum|Basket/i.test(f.name),
        'nejlepsi-energeticke-etf': (f) => /Clean Energy|New Energy|Renewable|Solar|Wind|Bioenergy|Energy Storage|Hydrogen/i.test(f.name) || !/Energy/i.test(f.investment_focus ?? ''),
      };
      const cizi = [];
      for (const [slug, nesmi] of Object.entries(PRAVIDLA)) {
        const isiny = [...isinyZPayloadu(stranky.get(slug))];
        if (!isiny.length) { cizi.push(`${slug}: stránka se nenačetla`); continue; }
        for (const f of (await db(isiny)).filter(nesmi)) cizi.push(`${slug}: ${f.isin} ${String(f.name).slice(0, 45)} (${f.investment_focus})`);
      }
      // Čistá energie vyřazená z energetických musí být v obnovitelných (když je čerstvá a nad 50 mil. €).
      const obn = isinyZPayloadu(stranky.get('nejlepsi-obnovitelne-zdroje-etf'));
      const MUSI_OBN = ['IE00B1XNHC34', 'FR0010524777', 'IE00BK5BCH80', 'IE000U58J0M1'];
      for (const f of (await db(MUSI_OBN)).filter((x) => x.fund_size_numeric >= 50 && dni(x) <= 14 && !obn.has(x.isin))) cizi.push(`obnovitelné zdroje: chybí ${f.isin} ${String(f.name).slice(0, 45)}`);
      if (cizi.length) poplach.push({ co: `Žebříčky obsahují fondy, které do kategorie nepatří (${cizi.length}) – etf-data.ts nameExcludes/focusContains`, ukazka: cizi.slice(0, 8) });
    } catch (e) {
      varovani.push({ co: `Kontrolu cizích fondů v žebříčcích (kolo6) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 2) KARTY „VYBRANÉ PODLE DAT“: „Nejvýkonnější“ nesmí být na indexových a širokých smíšených žebříčcích (ZAMERNA),
    //    práh v kartách je vždy 100 mil. € (dřív „mezi fondy nad 2 289 mil. €“ – karty z 300 načtených fondů),
    //    u finančních nesmí zmizet třetí výběr, když nejvýkonnější = největší.
    try {
      const chyby = [];
      const BEZ = ['nejlepsi-etf-2026', 'nejlepsi-akciove-etf', 'nejlepsi-dluhopisove-etf', 'nejlepsi-sp500-etf', 'nejlepsi-zlato-etf', 'nejlepsi-bitcoin-etf', 'nejlevnejsi-etf', 'nejlepsi-akumulacni-etf', 'nejlepsi-distribucni-etf']; // kolo 8: + nejlevnější, akumulační, distribuční
      for (const slug of ZEBRICKY) {
        const v = sekce(stranky.get(slug), 'vybrane');
        if (!v) { chyby.push(`${slug}: chybí sekce Vybrané podle dat`); continue; }
        if (BEZ.includes(slug) && /Nejvýkonnější|nejvýkonnější/.test(v)) chyby.push(`${slug}: karta „Nejvýkonnější“`);
        const prahy = [...v.matchAll(/nad ([\d\s ]+)(?:\s| |&nbsp;)mil/g)].map((m) => Number(m[1].replace(/\D/g, ''))).filter((x) => x !== 100);
        if (prahy.length) chyby.push(`${slug}: práh v kartách ${prahy[0]} mil. € (má být 100)`);
        if (/s nejdelší historií/.test(stranky.get(slug))) chyby.push(`${slug}: slib „s nejdelší historií“`);
      }
      if (!/nejvýkonnější/i.test(sekce(stranky.get('nejlepsi-financni-etf'), 'vybrane'))) chyby.push('nejlepsi-financni-etf: chybí výběr nejvýkonnějšího (i když je to největší fond)');
      if (chyby.length) poplach.push({ co: `Karty „Vybrané podle dat“ na žebříčcích (${chyby.length})`, ukazka: chyby.slice(0, 8) });
    } catch (e) {
      varovani.push({ co: `Kontrolu karet žebříčků (kolo6) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 3) NEJLEVNĚJŠÍ FOND – nezávislý přepočet z DB (pravidlo: TER > 0, ≥ 100 mil. €, čerstvý, bez páky a zajištění,
    //    nejnižší TER → akumulační → větší). Musí sedět karta na nejlepsi-etf-2026 i dlaždice na /pruvodce
    //    (tam dřív XD9D – první řádek dotazu – místo SPYL).
    try {
      const od = new Date(Date.now() - 14 * 864e5).toISOString();
      const r = await fetch(`${URL_DB}?select=isin,name,ter_numeric,fund_size_numeric,distribution_policy,primary_ticker&ter_numeric=gt.0&fund_size_numeric=gte.100&scraping_date=gte.${od}&is_leveraged=not.is.true&name=not.is.null&order=ter_numeric.asc&limit=200`, hlav).then((x) => x.json());
      const zaj = (n) => ZAJ.test(n) && !/unhedged|not hedged/i.test(n); // „USD Unhedged (Acc)“ = nezajištěná (SPYL)
      const bez = r.filter((f) => !zaj(f.name));
      const kand = bez.filter((f) => f.ter_numeric === bez[0]?.ter_numeric);
      kand.sort((a, b) => Number(/^acc/i.test(b.distribution_policy ?? '')) - Number(/^acc/i.test(a.distribution_policy ?? '')) || b.fund_size_numeric - a.fund_size_numeric);
      const vitez = kand[0];
      const chyby = [];
      const v = sekce(stranky.get('nejlepsi-etf-2026'), 'vybrane');
      const karty = v.split(/href="\/etf\//).slice(1).map((k) => ({ isin: k.slice(0, 12), text: k }));
      const levnaKarta = karty.find((k) => /Nejnižší poplatek|Nejlevnější/.test(k.text));
      if (!levnaKarta) chyby.push('nejlepsi-etf-2026: karta Nejnižší poplatek chybí');
      else if (vitez && levnaKarta.isin !== vitez.isin) chyby.push(`nejlepsi-etf-2026: karta ${levnaKarta.isin}, podle pravidla ${vitez.isin} (${vitez.primary_ticker})`);
      const pr = (await html('/pruvodce')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      const dlazdice = pr.match(/Nejnižší TER\s+([\d,]+)\s*%\s+(\S+)/);
      if (!dlazdice) chyby.push('/pruvodce: dlaždice Nejnižší TER nenalezena');
      else if (vitez && dlazdice[2] !== vitez.primary_ticker) chyby.push(`/pruvodce: Nejnižší TER ukazuje ${dlazdice[2]}, podle pravidla ${vitez.primary_ticker}`);
      if (chyby.length) poplach.push({ co: 'Nejlevnější fond nesedí s jednotným pravidlem (porovnejNejlevnejsi)', ukazka: chyby });
    } catch (e) {
      varovani.push({ co: `Kontrolu nejlevnějšího fondu (kolo6) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 4) TICKER V ŽEBŘÍČKU JEDNOZNAČNÝ: „GOLD“ měly Amundi Physical Gold i EUWAX Gold. Stejný ticker u dvou ISIN = ukázat burzu.
    try {
      const dup = [];
      for (const slug of ZEBRICKY) {
        const pary = [...stranky.get(slug).matchAll(/isin\\":\\"([A-Z]{2}[A-Z0-9]{10})\\",\\"nazev\\":\\"(?:[^"\\]|\\.)*?\\",\\"ticker\\":\\"([^"\\]+)\\"/g)];
        const podle = new Map();
        for (const [, isin, tk] of pary) { if (!podle.has(tk)) podle.set(tk, new Set()); podle.get(tk).add(isin); }
        for (const [tk, is] of podle) if (is.size > 1) dup.push(`${slug}: ${tk} = ${[...is].join(', ')}`);
        if (!pary.length && stranky.get(slug)) dup.push(`${slug}: v datech tabulky nenalezen ticker (změnil se tvar dat?)`);
      }
      if (dup.length) poplach.push({ co: 'Stejný ticker u různých fondů v jednom žebříčku (připojit burzu)', ukazka: dup.slice(0, 6) });
    } catch (e) {
      varovani.push({ co: `Kontrolu duplicitních tickerů (kolo6) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 5) AKCIOVÉ: počet žebříčku vs. srovnávač kat=Akcie&minvel=50. Srovnávač bere fondy do 30 dní stáří, žebříček
    //    do 14 → přesná shoda nejde; hlídá se odkaz s prahem a rozdíl nad 2 %. Peněžní trh je mimo obojí (bod 1).
    try {
      const t = stranky.get('nejlepsi-akciove-etf');
      const pocet = Number(t.match(/data-pocet-fondu="(\d+)"/)?.[1] ?? NaN);
      const chyby = [];
      if (!/href="\/srovnani\?kat=Akcie&amp;minvel=50"/.test(t)) chyby.push('odkaz do srovnávače nemá kat=Akcie&minvel=50');
      const od30 = new Date(Date.now() - 30 * 864e5).toISOString();
      const r = await fetch(`${URL_DB}?select=isin&category=eq.Akcie&fund_size_numeric=gte.50&scraping_date=gte.${od30}&is_leveraged=not.is.true&name=not.is.null&or=(investment_focus.is.null,investment_focus.not.ilike.Money%20Market*)`, { headers: { ...hlav.headers, Prefer: 'count=exact', Range: '0-0' } });
      const srov = Number(r.headers.get('content-range')?.split('/')[1] ?? NaN);
      if (Number.isFinite(pocet) && Number.isFinite(srov) && Math.abs(srov - pocet) / srov > 0.02) chyby.push(`žebříček ${pocet}, srovnávač ~${srov}`);
      if (chyby.length) poplach.push({ co: 'Akciové ETF: počet žebříčku nesedí s odkazem do srovnávače', ukazka: chyby });
    } catch (e) {
      varovani.push({ co: `Kontrolu počtu akciových fondů (kolo6) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 6) DLUHOPISY „CO V KATEGORII JE“ po rodinách indexů: dřív „Euro Government 2 z 259“ a chyběly státní dluhopisy USA.
    try {
      const chyby = [];
      for (const [slug, musi] of [['nejlepsi-dluhopisove-etf', ['Státní dluhopisy USA', 'Státní dluhopisy eurozóny']], ['nejlepsi-vladni-dluhopisy-etf', ['Státní dluhopisy USA', 'Státní dluhopisy eurozóny']]]) {
        const s = sekce(stranky.get(slug), 'slozeni');
        for (const m of musi) if (!s.includes(m)) chyby.push(`${slug}: chybí „${m}“`);
        const karty = [...s.matchAll(/data-index-pocet="(\d+)" data-index-celkem="(\d+)"/g)].map((m) => [Number(m[1]), Number(m[2])]);
        const suma = karty.reduce((a, [n]) => a + n, 0);
        if (karty.length && suma / karty[0][1] < 0.4) chyby.push(`${slug}: skupiny pokrývají jen ${suma} z ${karty[0][1]} fondů`);
      }
      if (chyby.length) poplach.push({ co: 'Dluhopisové žebříčky: skupiny indexů nesedí (indexDescriptions.ts, RODINY_DLUHOPISU)', ukazka: chyby });
    } catch (e) {
      varovani.push({ co: `Kontrolu skupin dluhopisových indexů (kolo6) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 7) /pruvodce – MODELOVÝ PŘÍKLAD POPLATKŮ: nezávislý přepočet (vklad na konci měsíce, efektivní měsíční sazba
    //    (1+r)^(1/12)−1, 10 000 Kč, 20 let). Dřív r/12 → 5 085 000 / 4 207 000 Kč.
    //    Audit nástrojů 22. 10. 2026 (V4): kontrola dřív počítala 7 % − TER (0,068 / 0,052) = STEJNÁ chyba jako web (kruh).
    //    Poplatek se strhává z hodnoty fondu → čistý výnos (1 + 7 %)(1 − TER) − 1. Konstanty NEZÁVISLE ručně:
    //    1,07 × 0,998 − 1 = 0,06786; 1,07 × 0,982 − 1 = 0,05074 → 4 953 725 / 4 091 260 Kč (rozdíl 862 465 Kč).
    //    Produkce před nasazením (bez data-priklad-vzorec) → jen varování.
    try {
      const t = await html('/pruvodce');
      const levny = Number(t.match(/data-priklad-levny="(\d+)"/)?.[1] ?? NaN);
      const drahy = Number(t.match(/data-priklad-drahy="(\d+)"/)?.[1] ?? NaN);
      const fv = (r) => { const m = (1 + r) ** (1 / 12) - 1; return 10000 * (((1 + m) ** 240 - 1) / m); };
      const R_LEVNY = 0.06786, R_DRAHY = 0.05074;
      const chyby = [];
      if (!Number.isFinite(levny) || Math.abs(levny - fv(R_LEVNY)) > 2) chyby.push(`levný fond: stránka ${levny}, přepočet ${Math.round(fv(R_LEVNY))}`);
      if (!Number.isFinite(drahy) || Math.abs(drahy - fv(R_DRAHY)) > 2) chyby.push(`drahý fond: stránka ${drahy}, přepočet ${Math.round(fv(R_DRAHY))}`);
      const vzorecNasazen = /data-priklad-vzorec="/.test(t);
      if (chyby.length) (vzorecNasazen ? poplach : varovani).push({ co: `/pruvodce: modelový příklad poplatků nesedí s nezávislým přepočtem (1+r)(1−TER)−1${vzorecNasazen ? '' : ' – produkce ještě bez opravy V4 (před nasazením)'}`, ukazka: chyby });
    } catch (e) {
      varovani.push({ co: `Kontrolu příkladu poplatků (kolo6) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 8) TEXTY V KÓDU: DIP jednotně „nejméně 120 měsíců a výběr nejdříve v 60 letech“ (dřív i „zpravidla do 60 let“),
    //    žádný tichý fallback počtu fondů na /pruvodce, bez „spotřebitelské půjčky“ (redakční hranice).
    try {
      const chyby = [];
      const projdi = (d, out = []) => { for (const f of readdirSync(d)) { const p = `${d}/${f}`; if (statSync(p).isDirectory()) projdi(p, out); else if (/\.(tsx?|mjs)$/.test(f)) out.push(p); } return out; };
      for (const p of projdi('src')) {
        const k = readFileSync(p, 'utf8');
        if (/zpravidla do 60 let|alespoň 10 let a (zpravidla )?do 60|zpravidla alespoň/.test(k)) chyby.push(`${p}: DIP popsaný jinak než „120 měsíců a výběr nejdříve v 60 letech“`);
        if (/spotřebitelsk\w* půjčk/.test(k)) chyby.push(`${p}: zmínka o spotřebitelské půjčce`);
      }
      if (/totalCount\.toLocaleString\('cs-CZ'\) : '\d/.test(readFileSync('src/app/pruvodce/page.tsx', 'utf8'))) chyby.push('src/app/pruvodce/page.tsx: tichý fallback počtu fondů');
      if (chyby.length) poplach.push({ co: 'Texty článků: DIP / tichý fallback / redakční hranice', ukazka: chyby.slice(0, 6) });
    } catch (e) {
      varovani.push({ co: `Kontrolu textů článků (kolo6) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }
  }
  // --- konec kolo6 zebricky ---

  // --- kolo6 seo zebricky --- (SEO audit kola 6, 20. 10. 2026; pravidlo č. 1, bod 4)
  // Titulky, popisky a „odpověď nahoře“ žebříčků se skládají z dat stránky (src/lib/zebrickySeo.ts). Hlídáme, aby
  // nikdy neukázaly „—“/„undefined“/„NaN“, aby nesly datum dat, byly unikátní a aby čísla seděla s NEZÁVISLÝM zdrojem:
  // surová DB (REST, mimo kód webu) a rozcestník /zebricky (jiný dotaz – getCategorySouhrn). Dále /kde-koupit (přepočet
  // z kurzovního lístku ČNB a ceníků na stránce), /dane-z-etf (popisek bez platného stropu 40 mil.) a kanibalizace
  // /jaky-sp500-etf × žebříček S&P 500 (různý záměr titulků, obousměrné odkazy, dvojice jen ze SITEMAP_PAIRS).
  {
    const hlav = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
    const html = async (cesta) => { try { const r = await fetch(`${WEB_URL}${cesta}`); return r.ok ? (await r.text()).replace(/<!-- -->/g, '') : ''; } catch { return ''; } };
    const dec = (t) => t.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&nbsp;|&#160;| /g, ' ');
    const meta = (t) => ({
      titulek: dec(t.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''),
      popisek: dec(t.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ''),
      og: dec(t.match(/<meta property="og:description" content="([^"]*)"/)?.[1] ?? ''),
    });
    const text = (t) => dec(t.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
    const cislo = (s) => Number(String(s).replace(/\s/g, '').replace('−', '-').replace(',', '.'));
    const SPATNE = /—|undefined|NaN|\bnull\b|Infinity/;

    // 1) ŽEBŘÍČKY: všechny z rozcestníku.
    try {
      const rozc = await html('/zebricky');
      const radky = new Map([...rozc.matchAll(/<li data-pocet="(\d*)" data-slug="([a-z0-9-]+)" data-ter-od="([\d.]*)" data-r1="([-\d.]*)"/g)]
        .map((m) => [m[2], { pocet: m[1] ? Number(m[1]) : null, terOd: m[3] ? Number(m[3]) : null, r1: m[4] ? Number(m[4]) : null }]));
      const nasazeno = radky.size > 0; // před nasazením kola 6 rozcestník atributy data-ter-od/data-r1 nemá
      const slugy = nasazeno ? [...radky.keys()] : [...new Set([...rozc.matchAll(/href="\/nejlepsi-etf\/([a-z0-9-]+)"/g)].map((m) => m[1]))];
      const chyby = [], varuj = [], titulky = new Map(), popisky = new Map(), kOvereni = [];
      // Statická kontrola (12. 11. 2026): výpadek načtení dne dat nesmí skončit v ISR cache jako stránka bez „Data k“,
      // bez odpovědi nahoře a s obecným popiskem (11. 11. 2026 žebříček vládních dluhopisů, 24 h) – stránka musí vyhodit výjimku.
      try {
        const zdrojZ = readFileSync('src/app/nejlepsi-etf/[slug]/page.tsx', 'utf8');
        if (!/if \(!dataDatum\) throw new Error/.test(zdrojZ)) chyby.push('src/app/nejlepsi-etf/[slug]/page.tsx: chybí „if (!dataDatum) throw“ – výpadek dne dat by se uložil do ISR cache');
      } catch { /* kontrola běží i bez zdrojáků */ }
      for (const slug of slugy) {
        const t = await html(`/nejlepsi-etf/${slug}`);
        if (!t) { chyby.push(`${slug}: stránka se nenačetla`); continue; }
        const { titulek, popisek } = meta(t);
        if (!/data-odpoved="zebricek"/.test(t)) { if (nasazeno) chyby.push(`${slug}: chybí odpověď nahoře (data-odpoved)`); continue; }
        titulky.set(titulek, [...(titulky.get(titulek) ?? []), slug]);
        popisky.set(popisek, [...(popisky.get(popisek) ?? []), slug]);
        if (SPATNE.test(titulek) || SPATNE.test(popisek)) chyby.push(`${slug}: titulek/popisek „${titulek}“ / „${popisek}“`);
        if (titulek.length > 70) varuj.push(`${slug}: titulek ${titulek.length} znaků`);
        if (popisek.length < 120 || popisek.length > 170) varuj.push(`${slug}: popisek ${popisek.length} znaků`);
        const datStranky = text(t).match(/Data k (\d{1,2}\. \d{1,2}\. \d{4})/)?.[1];
        const datPopisku = popisek.match(/Data k (\d{1,2}\. \d{1,2}\. \d{4})/)?.[1];
        if (!datPopisku) chyby.push(`${slug}: popisek bez „Data k …“`);
        else if (datStranky && datPopisku !== datStranky) chyby.push(`${slug}: popisek „Data k ${datPopisku}“, stránka „Data k ${datStranky}“`);
        if (datPopisku && !titulek.includes(datPopisku.slice(-4))) varuj.push(`${slug}: titulek bez roku dat (${datPopisku.slice(-4)})`);
        const odp = text(t.match(/data-odpoved="zebricek"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '');
        if (SPATNE.test(odp)) chyby.push(`${slug}: odpověď nahoře „${odp.slice(0, 80)}…“`);
        if (datStranky && !odp.startsWith(`K ${datStranky}`)) chyby.push(`${slug}: odpověď nahoře nezačíná datem dat stránky (${datStranky})`);
        const pocetOdp = cislo(odp.match(/v žebříčku ([\d\s]+) fond/)?.[1] ?? NaN);
        const pocetStr = Number(t.match(/data-pocet-fondu="(\d+)"/)?.[1] ?? NaN);
        if (Number.isFinite(pocetStr) && pocetOdp !== pocetStr) chyby.push(`${slug}: odpověď ${pocetOdp} fondů, stránka ${pocetStr}`);
        // „TER od X“ = nejnižší TER > 0 v kategorii: nesmí být vyšší než TER kteréhokoli fondu v tabulce a musí sedět
        // s rozcestníkem (jiný dotaz – getCategorySouhrn).
        const terOd = titulek.match(/TER od ([\d,]+) %/)?.[1];
        const terTabulky = [...t.matchAll(/\\"ter\\":([\d.]+)/g)].map((m) => Number(m[1])).filter((x) => x > 0);
        if (terOd) {
          const x = cislo(terOd);
          if (terTabulky.length && x > Math.min(...terTabulky) + 1e-9) chyby.push(`${slug}: titulek „TER od ${terOd} %“, v tabulce fond s TER ${Math.min(...terTabulky)} %`);
          const r = radky.get(slug);
          if (r?.terOd != null && Math.abs(r.terOd - x) > 0.0051) chyby.push(`${slug}: titulek „TER od ${terOd} %“, rozcestník ${r.terOd} %`);
        }
        // Fondy z karet → nezávislé ověření čísel v popisku proti surové DB.
        const v = t.match(/data-sekce="vybrane"[\s\S]*?<\/section>/)?.[0] ?? '';
        const karty = v.split(/href="\/etf\//).slice(1).map((k) => ({ isin: k.slice(0, 12), text: dec(k) }));
        const velky = karty.find((k) => /Největší/.test(k.text));
        const levny = karty.find((k) => /Nejnižší poplatek|Nejlevnější/.test(k.text));
        kOvereni.push({ slug, popisek, datPopisku, velky: velky?.isin, levny: levny?.isin, r1Rozc: radky.get(slug)?.r1 ?? null });
      }
      const dupT = [...titulky].filter(([, s]) => s.length > 1).map(([k, s]) => `„${k}“: ${s.join(', ')}`);
      const dupP = [...popisky].filter(([, s]) => s.length > 1).map(([k, s]) => `„${k.slice(0, 60)}…“: ${s.join(', ')}`);
      if (dupT.length || dupP.length) chyby.push(...dupT.map((x) => `stejný titulek ${x}`), ...dupP.map((x) => `stejný popisek ${x}`));

      const isiny = [...new Set(kOvereni.flatMap((k) => [k.velky, k.levny]).filter(Boolean))];
      const db = new Map();
      for (let i = 0; i < isiny.length; i += 100) {
        const r = await fetch(`${URL_DB}?select=isin,ter_numeric,fund_size_numeric,return_1y_czk,returns_as_of&isin=in.(${isiny.slice(i, i + 100).join(',')})`, hlav);
        if (!r.ok) throw new Error(`Supabase HTTP ${r.status}`);
        for (const f of await r.json()) db.set(f.isin, f);
      }
      let overeno = 0;
      for (const k of kOvereni) {
        const L = db.get(k.levny), V = db.get(k.velky);
        const ter = k.popisek.match(/Nejnižší TER(?: nad \d+ mil\. €)? má \S+ \(([\d,]+) %\)/)?.[1] ?? k.popisek.match(/nejlevnější(?: nad \d+ mil\. €)? je \S+(?: \([^)]*\))?, TER ([\d,]+) %/)?.[1];
        if (ter && L) { overeno++; if (Math.abs(cislo(ter) - Number(L.ter_numeric)) > 0.0051) chyby.push(`${k.slug}: popisek TER ${ter} %, DB ${L.ter_numeric} % (${k.levny})`); }
        const vel = k.popisek.match(/Největší(?: a nejlevnější(?: nad \d+ mil\. €)?)? je \S+ \(([\d,]+) (mld|mil)\. €\)/);
        const stejnyDen = !k.datPopisku || !V?.returns_as_of || (([y, m, d]) => `${+d}. ${+m}. ${y}`)(V.returns_as_of.split('-')) === k.datPopisku;
        if (vel && V && stejnyDen) {
          overeno++;
          const mil = cislo(vel[1]) * (vel[2] === 'mld' ? 1000 : 1);
          if (Math.abs(mil - Number(V.fund_size_numeric)) > (vel[2] === 'mld' ? 51 : 1)) chyby.push(`${k.slug}: popisek velikost ${vel[1]} ${vel[2]}. €, DB ${V.fund_size_numeric} mil. € (${k.velky})`);
        }
        const r1 = k.popisek.match(/za 12 měsíců v Kč ([+−-][\d,]+) %/)?.[1];
        // Výnos se mění každý den: stránka z ISR cache (žebříčky 1 den) nese „Data k D“ a výnos k D. Porovnávat jen
        // se stejným dnem v DB – jinak planý poplach den po stažení nových dat (22. 10. 2026: 47 falešných nálezů).
        const denDb = V?.returns_as_of ? (([y, m, d]) => `${+d}. ${+m}. ${y}`)(V.returns_as_of.split('-')) : null;
        if (r1 && V && k.datPopisku && denDb !== k.datPopisku) varuj.push(`${k.slug}: popisek výnos k ${k.datPopisku}, DB už k ${denDb ?? '?'} – nesrovnávám`);
        else if (r1 && V) {
          overeno++;
          if (Math.abs(cislo(r1) - Number(V.return_1y_czk)) > 0.051) chyby.push(`${k.slug}: popisek výnos ${r1} %, DB ${V.return_1y_czk} % (${k.velky})`);
          if (k.r1Rozc != null && Math.abs(cislo(r1) - k.r1Rozc) > 0.051) varuj.push(`${k.slug}: popisek výnos ${r1} %, rozcestník ${k.r1Rozc} %`);
        }
      }
      if (nasazeno && kOvereni.length && overeno < kOvereni.length) varuj.push(`čísla v popiscích ověřena jen ${overeno}× u ${kOvereni.length} žebříčků (změnil se tvar popisku?)`);
      if (chyby.length) poplach.push({ co: `Titulky/popisky/odpověď nahoře žebříčků nesedí s daty (${chyby.length}) – src/lib/zebrickySeo.ts`, ukazka: chyby.slice(0, 10) });
      if (varuj.length) varovani.push({ co: `Titulky/popisky žebříčků: délka nebo rozdíl proti rozcestníku (${varuj.length})`, ukazka: varuj.slice(0, 8) });
      if (!nasazeno) varovani.push({ co: 'SEO žebříčků (kolo 6) zatím není nasazené – rozcestník nemá data-ter-od/data-r1', ukazka: [] });
    } catch (e) {
      varovani.push({ co: `Kontrolu titulků a popisků žebříčků (kolo6 seo) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 2) /zebricky: titulek a popisek z dat (rok, datum), odkazy na faktorové analýzy.
    try {
      const t = await html('/zebricky');
      const { titulek, popisek } = meta(t);
      const chyby = [];
      if (SPATNE.test(titulek + popisek)) chyby.push(`„${titulek}“ / „${popisek}“`);
      if (/data-faktory/.test(t)) {
        if (!/Data k \d/.test(popisek)) chyby.push('popisek bez „Data k …“');
        for (const f of ['quality', 'minimalni-volatilita', 'small-cap', 'momentum']) if (!t.includes(`href="/faktorove-etf/${f}"`)) chyby.push(`chybí odkaz /faktorove-etf/${f}`);
      }
      if (chyby.length) poplach.push({ co: '/zebricky: titulek/popisek nebo odkazy na faktory', ukazka: chyby });
    } catch (e) {
      varovani.push({ co: `Kontrolu /zebricky (kolo6 seo) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 3) /kde-koupit: „za 2 000 Kč vychází nejlevněji u …“ – nezávislý přepočet z kurzovního lístku ČNB a ceníků
    //    vykreslených na stránce (data-poplatek / data-smena), ne z kódu webu.
    try {
      const t = await html('/kde-koupit');
      const m = t.match(/data-odpoved="kde-koupit" data-broker-odpoved="([a-z0-9]+)" data-kc-odpoved="([\d.]+)"/);
      const { popisek } = meta(t);
      const chyby = [];
      if (SPATNE.test(popisek)) chyby.push(`popisek „${popisek}“`);
      if (m) {
        const listek = await fetch('https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt').then((r) => r.text());
        const kurz = (kod) => { const r = listek.split('\n').find((x) => x.split('|')[3] === kod); if (!r) return NaN; const p = r.split('|'); return cislo(p[4]) / cislo(p[2]); };
        const eur = kurz('EUR'), usd = kurz('USD'), C = 2000;
        const ceniky = new Map();
        let broker = null;
        for (const x of t.matchAll(/data-(broker|poplatek|smena)="([^"]*)"/g)) {
          if (x[1] === 'broker') { broker = x[2]; continue; }
          if (broker && !(ceniky.get(broker)?.[x[1]])) ceniky.set(broker, { ...(ceniky.get(broker) ?? {}), [x[1]]: dec(x[2]) });
        }
        // Spodní hranice nákladu z ceníku; presne = false, když část neznáme („od“, „—“).
        const naklad = (c) => {
          let presne = true, kc = 0, q;
          const p = c.poplatek ?? '';
          if ((q = p.match(/^od ([\d,]+) EUR/))) { kc += cislo(q[1]) * eur; presne = false; }
          else if ((q = p.match(/^([\d,]+) %, min\. ([\d,]+) EUR/))) kc += Math.max(cislo(q[1]) / 100 * C, cislo(q[2]) * eur);
          else if ((q = p.match(/^([\d,]+) EUR/))) kc += cislo(q[1]) * eur;
          else presne = false;
          const s = c.smena ?? '';
          if ((q = s.match(/^([\d,]+) %, min\. ([\d,]+) USD/))) kc += Math.max(cislo(q[1]) / 100 * C, cislo(q[2]) * usd);
          else if ((q = s.match(/^([\d,]+) %/))) kc += cislo(q[1]) / 100 * C;
          else presne = false;
          return { kc, presne };
        };
        const n = [...ceniky].map(([id, c]) => ({ id, ...naklad(c) }));
        const vitez = n.find((x) => x.id === m[1]);
        if (!Number.isFinite(eur) || !Number.isFinite(usd)) chyby.push('kurzovní lístek ČNB se nepodařilo přečíst');
        else if (!vitez) chyby.push(`broker ${m[1]} nemá na stránce ceník (data-poplatek/data-smena)`);
        else {
          // Kurz stránky (cache 1 den) může být o den starší než dnešní lístek → tolerance 2 %.
          if (Math.abs(vitez.kc - Number(m[2])) > Math.max(0.5, 0.02 * vitez.kc)) chyby.push(`${m[1]}: věta ${m[2]} Kč, přepočet z ceníku a kurzu ČNB ${vitez.kc.toFixed(2)} Kč`);
          const levnejsi = n.filter((x) => x.id !== m[1] && x.kc < vitez.kc - 0.01);
          if (levnejsi.length) chyby.push(`${m[1]} (${vitez.kc.toFixed(2)} Kč) není nejlevnější: ${levnejsi.map((x) => `${x.id} ${x.presne ? '' : 'od '}${x.kc.toFixed(2)} Kč`).join(', ')}`);
        }
      } else if (/data-odpoved="kde-koupit"/.test(t)) chyby.push('odpověď nahoře bez data-broker-odpoved/data-kc-odpoved');
      if (chyby.length) poplach.push({ co: '/kde-koupit: věta „nejlevněji za 2 000 Kč“ nesedí s nezávislým přepočtem (ČNB + ceníky)', ukazka: chyby });
    } catch (e) {
      varovani.push({ co: `Kontrolu odpovědi nahoře na /kde-koupit (kolo6 seo) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 4) /dane-z-etf: popisek ani OG nesmí uvádět strop 40 mil. jako platný; popisek nese ověřená fakta.
    try {
      const t = await html('/dane-z-etf');
      const { popisek, og } = meta(t);
      const chyby = [];
      for (const [co, x] of [['popisek', popisek], ['OG popisek', og]]) {
        if (/40\s*mil/i.test(x) && !/zruš/i.test(x)) chyby.push(`${co} uvádí strop 40 mil. jako platný: „${x}“`);
        if (x.length > 165) chyby.push(`${co} ${x.length} znaků`);
      }
      if (/data-odpoved="dane"/.test(t)) for (const f of [/3 (let|roky|letech)/, /100 000 Kč/, /dividendy 15 %/, /5 mil\. Kč/]) if (!f.test(popisek)) chyby.push(`popisek bez ${f}`);
      if (chyby.length) poplach.push({ co: '/dane-z-etf: popisek/OG neodpovídá ověřeným daňovým faktům', ukazka: chyby });
    } catch (e) {
      varovani.push({ co: `Kontrolu popisku /dane-z-etf (kolo6 seo) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // 5) KANIBALIZACE: /jaky-sp500-etf = „jaký vybrat“ (průvodce), žebříček = „nejlepší“ (všechny fondy). Obousměrné
    //    odkazy, dvojice jen z SITEMAP_PAIRS (src/lib/pairs.ts) a každá odpovídá 200.
    try {
      const jaky = await html('/jaky-sp500-etf');
      const zeb = await html('/nejlepsi-etf/nejlepsi-sp500-etf');
      const chyby = [];
      if (/data-dvojice/.test(jaky)) {
        const tj = meta(jaky).titulek, tz = meta(zeb).titulek;
        if (/Nejlepší/i.test(tj)) chyby.push(`/jaky-sp500-etf: titulek cílí na „nejlepší“: „${tj}“`);
        if (/Jaký|Který/i.test(tz)) chyby.push(`žebříček S&P 500: titulek cílí na „jaký/který“: „${tz}“`);
        if (!jaky.includes('href="/nejlepsi-etf/nejlepsi-sp500-etf"')) chyby.push('/jaky-sp500-etf neodkazuje na žebříček S&P 500');
        if (!zeb.includes('href="/jaky-sp500-etf"')) chyby.push('žebříček S&P 500 neodkazuje na /jaky-sp500-etf');
        const zdroj = readFileSync('src/lib/pairs.ts', 'utf8');
        const povolene = new Set([...zdroj.matchAll(/'([a-z0-9]+-vs-[a-z0-9]+)'/g)].map((m) => m[1]));
        const dvojice = [...new Set([...jaky.matchAll(/href="\/srovnani\/([a-z0-9]+-vs-[a-z0-9]+)"/g)].map((m) => m[1]))];
        if (!dvojice.length) chyby.push('/jaky-sp500-etf: žádný odkaz na kurátorské dvojice');
        for (const p of dvojice) {
          if (!povolene.has(p)) chyby.push(`/jaky-sp500-etf: dvojice ${p} není v SITEMAP_PAIRS`);
          if (!R.povoleno(`/srovnani/${p}`)) { R.jenLokalne(`/jaky-sp500-etf: odkaz na /srovnani/${p} (mimo pevnou sadu) neověřen`); continue; }
          const r = await fetch(`${WEB_URL}/srovnani/${p}`, { redirect: 'manual' });
          if (r.status !== 200) chyby.push(`/srovnani/${p}: HTTP ${r.status}`);
        }
      }
      if (chyby.length) poplach.push({ co: 'Kanibalizace S&P 500: /jaky-sp500-etf × žebříček (titulky, odkazy, dvojice)', ukazka: chyby });
    } catch (e) {
      varovani.push({ co: `Kontrolu /jaky-sp500-etf × žebříček (kolo6 seo) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }
  }
  // --- konec kolo6 seo zebricky ---

  // --- middleware a indexace (20. 10. 2026) ---
  // Middleware běží jen na /etf/*, /srovnani/*, /srovnani-etf (šetří CPU free tieru); noindex pro jiné domény
  // než etfpruvodce.cz je v next.config.ts (headers, missing host). Hlídáme obě strany: ostrá doména NESMÍ mít
  // noindex (vypadla by z vyhledávačů) a nesmyslné adresy fondů/dvojic musí dál končit 404 bez dotazu do DB.
  try {
    const ostra = /^https:\/\/etfpruvodce\.cz\/?$/.test(WEB_URL);
    const noindex = [];
    for (const s of ['/', '/etf/IE00B5BMR087', '/srovnani', '/srovnani/vwce-vs-cspx']) {
      const r = await fetch(`${WEB_URL}${s}`, { redirect: 'manual' });
      const robots = r.headers.get('x-robots-tag') || '';
      if (ostra && /noindex/i.test(robots)) noindex.push(`${s}: ${robots}`);
    }
    if (noindex.length) poplach.push({ co: 'Ostrá doména posílá X-Robots-Tag noindex – stránky vypadnou z vyhledávačů (next.config.ts headers)', ukazka: noindex });
    // robots.txt (8. 11. 2026): blokují se jen komerční SEO roboti a sběr dat pro AI (src/app/robots.ts). Vyhledávače a AI
    // vyhledávání NESMÍ být zablokované – skupina s jejich jménem (nebo „*“) nesmí mít „Disallow: /“.
    const rtxt = await fetch(`${WEB_URL}/robots.txt`).then((r) => (r.ok ? r.text() : ''));
    const skupiny = rtxt.split(/\n\s*\n/).map((g) => ({ ua: [...g.matchAll(/^User-Agent:\s*(\S+)/gim)].map((m) => m[1].toLowerCase()), vse: /^Disallow:\s*\/\s*$/im.test(g) }));
    const CHRANENI = ['*', 'googlebot', 'bingbot', 'seznambot', 'applebot', 'duckduckbot', 'oai-searchbot', 'chatgpt-user', 'perplexitybot', 'claudebot', 'gptbot', 'meta-externalagent'];
    const zablokovani = CHRANENI.filter((b) => skupiny.some((g) => g.vse && g.ua.includes(b)));
    if (!rtxt) varovani.push({ co: 'robots.txt se nenačetl', ukazka: [] });
    else if (zablokovani.length) poplach.push({ co: 'robots.txt blokuje vyhledávače / AI vyhledávání (src/app/robots.ts)', ukazka: zablokovani });
    const spatne = [];
    for (const s of ['/etf/ZZ000000TEST', '/srovnani/nesmysl']) {
      const r = await fetch(`${WEB_URL}${s}`, { redirect: 'manual' });
      if (r.status !== 404) spatne.push(`${s}: HTTP ${r.status}`);
    }
    if (spatne.length) poplach.push({ co: 'Nesmyslná adresa fondu/dvojice nevrací 404 (overAdresu v src/app/etf/[isin]/page.tsx, parsePair v src/app/srovnani/[pair]/page.tsx; middleware zrušen 7. 11. 2026)', ukazka: spatne });
  } catch (e) {
    varovani.push({ co: `Kontrolu indexace a middleware se nepodařilo provést: ${e.message}`, ukazka: [] });
  }

  // --- kolo6 data --- (revize kola 6, 20. 10. 2026; pravidlo č. 1, bod 4)
  {
    const H = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
    const UA6 = { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; etfpruvodce.cz kontrola dat)' } };
    const f2 = (x) => x.toFixed(2).replace('.', ',');

    // ── F1: VÝNOSY V Kč a USD = výnos v EUR × změna kurzu ke STEJNÝM dnům ──
    // Scraper (etf-astro performance_converter.py) do 20. 10. 2026 bral začátek období „dnes − 365×N dní“ a konec
    // „dnešní“ kurz → 5 let v Kč o 0,4–1,0 p. b. vedle (EUN5 −5,40 místo −4,99 %; SXR8 78,78 místo 79,56 %). Tady se
    // to přepočítá NEZÁVISLE na scraperu i webu: z ročních souborů kurzů ČNB (rok.txt) a z ECB (data-api.ecb.europa.eu,
    // ne Frankfurter, který používá scraper). Den dat = poslední pracovní den před stažením (datumCen.ts), začátek =
    // den dat − N kalendářních měsíců (YTD 31. 12., kalendářní rok 31. 12. → 31. 12.), kurz = poslední vyhlášený ≤ den.
    // Ověřeno 20. 10. 2026: opravený přepočet sedí na 0,0000 p. b., starý se lišil až o 0,99 p. b.
    // Poplach: rozdíl > 0,15 p. b. u ≥ 2 kotevních fondů (kurz je společný všem → chyba je vždy hromadná).
    try {
      const KOTVY_FX = ['IE00B5BMR087', 'IE00BK5BQT80', 'IE00B4L5Y983', 'IE00BKM4GZ66', 'IE00B4ND3602', 'IE00B3F81R35',
        'IE00B3ZW0K18', 'LU0290358497', 'IE00B8GKDB10']; // SXR8 VWCE EUNL EMIM SGLN EUN5 IBCF XEON VHYL
      const PRAH_FX = 0.15;
      const OBD = ['1m', '3m', '6m', 'ytd', '1y', '3y', '5y', '2021', '2022', '2023', '2024', '2025', '2026', '2027']; // 2026/27: sloupce od 8. 11. 2026
      const MES = { '1m': 1, '3m': 3, '6m': 6, '1y': 12, '3y': 36, '5y': 60 };
      const denDat = (stazeno) => { // kopie src/lib/datumCen.ts
        const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false }).formatToParts(stazeno);
        const v = (t) => Number(p.find((x) => x.type === t)?.value);
        const d = new Date(Date.UTC(v('year'), v('month') - 1, v('day'), 12));
        const prac = (x) => x.getUTCDay() !== 0 && x.getUTCDay() !== 6;
        if (v('hour') < 18 || !prac(d)) { do d.setUTCDate(d.getUTCDate() - 1); while (!prac(d)); }
        return d.toISOString().slice(0, 10);
      };
      const mesZpet = (d, m) => {
        const [r, mm, dd] = d.split('-').map(Number);
        const t = r * 12 + (mm - 1) - m, nr = Math.floor(t / 12), nm = t - nr * 12;
        return `${nr}-${String(nm + 1).padStart(2, '0')}-${String(Math.min(dd, new Date(Date.UTC(nr, nm + 1, 0)).getUTCDate())).padStart(2, '0')}`;
      };
      const obdobi = (o, D) => {
        if (MES[o]) return [mesZpet(D, MES[o]), D];
        if (o === 'ytd') return [`${Number(D.slice(0, 4)) - 1}-12-31`, D];
        const r = Number(o);
        return r > Number(D.slice(0, 4)) ? null : [`${r - 1}-12-31`, r < Number(D.slice(0, 4)) ? `${r}-12-31` : D];
      };
      const kurz = (rada, d) => { let r = null; for (const [k, v] of rada) { if (k <= d) r = [k, v]; else break; } return r && (new Date(d) - new Date(r[0])) / 864e5 <= 7 ? r[1] : null; };
      const db = await fetch(`${URL_DB}?select=isin,primary_ticker,scraping_date,returns_as_of,${OBD.flatMap((o) => [`return_${o}`, `return_${o}_czk`, `return_${o}_usd`]).join(',')}&isin=in.(${KOTVY_FX.join(',')})`, H).then((r) => r.json());
      if (!Array.isArray(db) || !db.length) throw new Error('DB nevrátila kotevní fondy');
      // ČNB: Kč za 1 EUR po dnech (rok.txt; záhlaví „Datum|1 AUD|…|1 EUR|…“ se může v roce opakovat).
      const roky = [...new Set(db.map((f) => Number(String(f.scraping_date).slice(0, 4))))];
      const odRoku = Math.min(...roky) - 6, doRoku = Math.max(...roky);
      const czk = [];
      for (let r = odRoku; r <= doRoku; r++) {
        const t = await fetch(`https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/rok.txt?rok=${r}`).then((x) => (x.ok ? x.text() : Promise.reject(new Error(`ČNB rok ${r}: HTTP ${x.status}`))));
        let sl = -1, mn = 1;
        for (const radek of t.split(/\r?\n/)) {
          const c = radek.split('|');
          if (c[0] === 'Datum') { sl = c.findIndex((h) => / EUR$/.test(h.trim())); mn = Number(c[sl]?.split(' ')[0]) || 1; continue; }
          const m = c[0].match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
          if (m && sl > 0 && c[sl]) czk.push([`${m[3]}-${m[2]}-${m[1]}`, Number(c[sl].replace(',', '.')) / mn]);
        }
      }
      czk.sort((a, b) => (a[0] < b[0] ? -1 : 1));
      // ECB: USD za 1 EUR (referenční kurz 14:15 SEČ).
      const ecbCsv = await fetch(`https://data-api.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?startPeriod=${odRoku}-01-01&format=csvdata`).then((x) => (x.ok ? x.text() : Promise.reject(new Error(`ECB HTTP ${x.status}`))));
      const [hl, ...ecbRadky] = ecbCsv.trim().split(/\r?\n/);
      const ci = hl.split(','), iT = ci.indexOf('TIME_PERIOD'), iV = ci.indexOf('OBS_VALUE');
      const usd = ecbRadky.map((l) => l.split(',')).filter((c) => c[iV]).map((c) => [c[iT], Number(c[iV])]).sort((a, b) => (a[0] < b[0] ? -1 : 1));
      if (czk.length < 1000 || usd.length < 1000) throw new Error(`málo kurzů (ČNB ${czk.length}, ECB ${usd.length})`);
      const vadne = [], porovnano = [];
      for (const f of db) {
        // kolo6b (21. 10. 2026): scraper převádí kurzy ke dni returns_as_of fondu (poslední jistě konečný den řady).
        const D = f.returns_as_of ? String(f.returns_as_of).slice(0, 10) : denDat(new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(f.scraping_date) ? f.scraping_date : `${f.scraping_date}Z`));
        const chyby = [];
        let n = 0;
        for (const o of OBD) {
          const eur = f[`return_${o}`], dny = obdobi(o, D);
          if (eur == null || !dny) continue;
          for (const [mena, rada] of [['czk', czk], ['usd', usd]]) {
            const v = f[`return_${o}_${mena}`], k0 = kurz(rada, dny[0]), k1 = kurz(rada, dny[1]);
            if (v == null || !k0 || !k1) continue;
            const ocek = ((1 + Number(eur) / 100) * k1 / k0 - 1) * 100;
            n++;
            if (Math.abs(Number(v) - ocek) > PRAH_FX) chyby.push(`${o} ${mena.toUpperCase()} DB ${f2(Number(v))} vs ${f2(ocek)} %`);
          }
        }
        porovnano.push(n);
        if (chyby.length) vadne.push(`${f.primary_ticker || f.isin} k ${D}: ${chyby.slice(0, 5).join('; ')}${chyby.length > 5 ? ` (+${chyby.length - 5})` : ''}`);
      }
      const co = `Výnosy v Kč/USD nesedí s výnosem v EUR přepočteným kurzy ČNB/ECB ke stejným dnům (o víc než ${f2(PRAH_FX)} p. b.) – přepočet měn ve scraperu (etf-astro performance_converter.py)`;
      if (vadne.length >= 2) poplach.push({ co: `${co}: ${vadne.length} z ${db.length} kotevních fondů`, ukazka: vadne.slice(0, 6) });
      else if (vadne.length === 1) varovani.push({ co, ukazka: vadne });
      if (porovnano.reduce((a, b) => a + b, 0) < 20) varovani.push({ co: 'Kontrola přepočtu výnosů do Kč/USD porovnala málo hodnot – chybí výnosy v DB?', ukazka: [] });
    } catch (e) {
      varovani.push({ co: `Kontrolu přepočtu výnosů do Kč/USD (kurzy ČNB/ECB) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // ── F5: MAX. POKLES TŘÍD TÉHOŽ FONDU ──
    // VGWE (Acc) −19,6 % vs VHYL (Dist) −14,8 % za 3 i 5 let: zdroj má u VGWE vadný bod 25. 12. 2024 (79,05 místo ~70,3;
    // burzy zavřené; podobně 25. 12. 2025). Nezávisle Yahoo Xetra: VGWE.DE −16,4 %, VHYL.AS −16,8 %. Web (tridyFondu.ts)
    // takový pokles ukazuje jako „—“ (od kola 6 i 5 let); tady se sleduje rozdíl > 3 p. b. (skupiny tříd z kontroly volatility).
    {
      const nalezy = [];
      for (const g of tridySkupiny.values()) {
        if (g.length < 2) continue;
        for (const o of ['1y', '3y', '5y']) {
          const h = g.filter((x) => x[`max_drawdown_${o}`] != null && Number(x[`max_drawdown_${o}`]) < 0).map((x) => ({ x, v: Math.abs(Number(x[`max_drawdown_${o}`])) }));
          if (h.length < 2) continue;
          const v = h.map((y) => y.v);
          if (Math.max(...v) - Math.min(...v) > 3) nalezy.push(`${o}: ${h.map((y) => `${y.x.primary_ticker || y.x.isin} −${f2(y.v)} %`).join(' / ')} – ${String(g[0].name).slice(0, 48)}`);
        }
      }
      if (nalezy.length) varovani.push({ co: `${nalezy.length}× max. pokles tříd téhož fondu se liší o víc než 3 p. b. (vadný bod zdroje; web ukazuje „—“, když nesedí i relativně o 30 %)`, ukazka: nalezy.slice(0, 8) });
    }

    // ── F6: FYZICKÉ ZLATO – výnosy se nesmí rozcházet ──
    // EUWAX Gold II (EWG2) a boerse.de Gold (TMGD): řada zdroje přeskakuje mezi dvěma cenami ~2,3 % od sebe (19. 10. 2026
    // EWG2 121,62 vs Xetra-Gold 118,89; zlato podle futures ≈ 119,1 €/g) → 1 měsíc −0,4 % místo −2,6 %. Fondy na index
    // „Gold“ (bez zajištění, bez páky) drží totéž zlato; liší se jen poplatkem (≤ 0,4 % ročně) a časem ocenění.
    // Varování: růstový faktor (1 + výnos) se od mediánu skupiny liší o víc než 2 % (1 m, 1 r, 3 r).
    // Švýcarské fondy (ISIN CH…) vynecháváme: zdroj má jejich NAV o dny pozadu (20. 10. 2026 řada CSGOLD končila
    // 16. 10.) → 1 m ≈ −0,8 % proti −2,6 % u ostatních; s nimi by medián ujel a EWG2 by prošel.
    {
      const zlato = fondy.filter((x) => x.index_name === 'Gold' && !x.is_leveraged && dni(x) <= 3 && !x.isin.startsWith('CH'));
      const nalezy = [];
      for (const o of ['1m', '1y', '3y']) {
        const h = zlato.filter((x) => x[`return_${o}`] != null).map((x) => ({ x, f: 1 + Number(x[`return_${o}`]) / 100 }));
        if (h.length < 6) continue;
        const s = h.map((y) => y.f).sort((a, b) => a - b), med = s[Math.floor(s.length / 2)];
        for (const y of h) if (Math.abs(y.f / med - 1) > 0.02) nalezy.push(`${o}: ${y.x.primary_ticker || y.x.isin} ${f2((y.f - 1) * 100)} % vs medián ${f2((med - 1) * 100)} % (${String(y.x.name).slice(0, 30)})`);
      }
      if (nalezy.length) varovani.push({ co: `${nalezy.length}× výnos fyzického zlata se liší od ostatních zlatých ETC o víc než 2 % (vadná cenová řada zdroje?)`, ukazka: nalezy.slice(0, 8) });
    }

    // ── IBC1: SOUČET SEKTORŮ / ZEMÍ ──
    // iShares USD Treasury 0-1yr: sektory 87,57 + 9,88 + 4,44 = 101,89 % – tak to má i zdroj (ověřeno 20. 10. 2026, Irsko
    // 9,88 % = „INSL CASH“, irský fond peněžního trhu iShares; scraper nic nezdvojuje). Podobně iShares dluhopisové fondy
    // s hotovostí/deriváty (až 107 %). Sledujeme jako varování: součet mimo 95–100,5 % (ukládá se top 5 + „Other“).
    try {
      const sl = [1, 2, 3, 4, 5].flatMap((i) => [`sector_${i}_weight`, `country_${i}_weight`]).join(',');
      let rows = [];
      for (let off = 0; ; off += 1000) {
        const b = await fetch(`${URL_DB}?select=isin,name,scraping_date,${sl}&order=isin&limit=1000&offset=${off}`, H).then((r) => r.json());
        rows = rows.concat(b);
        if (b.length < 1000) break;
      }
      for (const [druh, jm] of [['sector', 'sektorů'], ['country', 'zemí']]) {
        const mimo = rows.filter((x) => dni(x) <= 30).map((x) => ({ x, s: [1, 2, 3, 4, 5].reduce((a, i) => a + (Number(x[`${druh}_${i}_weight`]) || 0), 0) }))
          .filter((y) => y.s > 0 && (y.s > 100.5 || y.s < 95)).sort((a, b) => b.s - a.s);
        if (mimo.length) varovani.push({ co: `${mimo.length} fondů má součet ${jm} mimo 95–100,5 % (většinou tak u zdroje – hotovost, deriváty, neúplné údaje)`, ukazka: mimo.slice(0, 5).map((y) => `${y.x.isin} ${f2(y.s)} % ${String(y.x.name).slice(0, 36)}`) });
      }
    } catch (e) {
      varovani.push({ co: `Kontrolu součtu sektorů/zemí se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // ── BURZY: XETRA se musí vejít mezi 10 uložených ──
    // justETF řadí XETRA na konec; do 20. 10. 2026 ji fondy s 11–12 burzami (VWRL, VHYL…) v DB neměly – místa zabíralo
    // 2× Bolsa Mexicana. Vzorek ověřený u zdroje 20. 10. 2026 (XETRA je tam #10–#12) + obecně: fond s > 10 burzami,
    // který má uloženou mimoevropskou burzu, ale ne XETRA. (Pravidlo „velký fond bez XETRA“ je nepoužitelné: 131 fondů
    // nad 1 mld. € XETRA opravdu nemá – švýcarské fondy, část iShares dluhopisů.)
    try {
      const SE_XETROU = ['IE00B3RBWM25', 'IE00B8GKDB10', 'IE00B3XXRP09', 'IE00B6R52259', 'IE00B0M63177', 'IE00B53L3W79',
        'IE00B945VV12', 'IE00BKX55T58', 'IE0005042456', 'LU0274210672', 'IE00B5BMR087'];
      const ex = Array.from({ length: 10 }, (_, i) => `exchange_${i + 1}_name`);
      const rows = await fetch(`${URL_DB}?select=isin,name,primary_ticker,total_exchanges,${ex.join(',')}&or=(total_exchanges.gt.10,isin.in.(${SE_XETROU.join(',')}))`, H).then((r) => r.json());
      if (!Array.isArray(rows)) throw new Error('neplatná odpověď DB');
      const maXetru = (x) => ex.some((k) => String(x[k] || '').trim().toUpperCase() === 'XETRA');
      const mimoEvropu = (x) => ex.some((k) => /mexic|hong kong|singapore|tokyo|toronto|nyse|nasdaq/i.test(String(x[k] || '')));
      const chybi = rows.filter((x) => !maXetru(x) && (SE_XETROU.includes(x.isin) || ((x.total_exchanges ?? 0) > 10 && mimoEvropu(x))));
      if (chybi.length) varovani.push({ co: `${chybi.length} fondů nemá v DB burzu XETRA, ač ji zdroj uvádí / místo ní je uložená mimoevropská burza (scraper burzy_k_ulozeni)`, ukazka: ukazka(chybi, (x) => `${x.isin} ${x.primary_ticker || ''} (${x.total_exchanges} burz) ${String(x.name).slice(0, 34)}`) });
    } catch (e) {
      varovani.push({ co: `Kontrolu burzy XETRA se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // ── PÁKA PODLE INDEXU ──
    // Xtrackers LevDAX Daily Swap (index „LevDAX® (2x)“) neměl is_leveraged. NEZÁVISLÝ vzor (ne kód scraperu); krátkou
    // duraci („Euro Short Treasury“, „Ultrashort“), „Daily Capped“ ani „Inverse Volatility“ nechytá.
    {
      const PAKA = /\blev[a-z]*dax|\(\s*[-–]?\s*\d+(?:[.,]\d+)?\s*x\s*\)|(?<![\w.,])[-–]?(?:[2-9]|1[05])x\b|\bleveraged?\b|\bdaily\s+(?:short|inverse)\b|\b(?:short|inverse)\s+daily\b|\bshortdax\b|\bbear\b/i;
      const lev = fondy.filter((x) => !x.is_leveraged && PAKA.test(String(x.index_name || '')) && dni(x) <= 30);
      if (lev.length) varovani.push({ co: `${lev.length} fondů sleduje pákový/inverzní index, ale nemá příznak páky (is_leveraged) – srovnávač je ukazuje mezi běžnými`, ukazka: ukazka(lev, (x) => `${x.isin} ${String(x.index_name).slice(0, 30)} | ${String(x.name).slice(0, 30)}`) });
    }

    // ── DATUM SLOŽENÍ (holdings_as_of, sloupec od 20. 10. 2026) ──
    try {
      let rows = [];
      for (let off = 0; ; off += 1000) {
        const b = await fetch(`${URL_DB}?select=isin,name,holdings_as_of,scraping_date&holding_1_weight=gt.0&order=isin&limit=1000&offset=${off}`, H).then((r) => r.json());
        if (!Array.isArray(b)) throw new Error('neplatná odpověď DB (chybí sloupec holdings_as_of?)');
        rows = rows.concat(b);
        if (b.length < 1000) break;
      }
      const cerstve = rows.filter((x) => dni(x) <= 3);
      const sDatem = cerstve.filter((x) => x.holdings_as_of);
      const dnes = new Date().toISOString().slice(0, 10);
      const budouci = sDatem.filter((x) => x.holdings_as_of > dnes);
      const stare = sDatem.filter((x) => (Date.now() - new Date(x.holdings_as_of)) / 864e5 > 400);
      if (budouci.length) poplach.push({ co: `${budouci.length} fondů má datum složení v budoucnosti (parsování „As of DD/MM/YYYY“ ve scraperu)`, ukazka: ukazka(budouci, (x) => `${x.isin} ${x.holdings_as_of}`) });
      if (!sDatem.length) varovani.push({ co: 'Žádný čerstvý fond nemá datum složení (holdings_as_of) – scraper z větve oprava-kolo6 ještě neběžel?', ukazka: [] });
      else if (sDatem.length / cerstve.length < 0.8) varovani.push({ co: `Datum složení má jen ${sDatem.length} z ${cerstve.length} čerstvých fondů se složením`, ukazka: ukazka(cerstve.filter((x) => !x.holdings_as_of)) });
      if (stare.length) varovani.push({ co: `${stare.length} fondů má složení starší než 400 dní (zdroj ho neaktualizuje)`, ukazka: ukazka(stare, (x) => `${x.isin} složení k ${x.holdings_as_of} ${String(x.name).slice(0, 30)}`) });
    } catch (e) {
      varovani.push({ co: `Kontrolu data složení se nepodařilo provést: ${e.message}`, ukazka: [] });
    }
  }
  // --- /kolo6 data ---

  // --- kolo6 detail --- (revize kola 6, 20. 10. 2026: detail fondu /etf/[isin]; pravidlo č. 1, bod 4)
  // Každá chyba detailu z kola 6 má tu kontrolu, která by ji příště chytila sama. Značka data-detail="kolo6" = produkce
  // už má opravy; bez ní (před nasazením) se kontroly detailu jen ohlásí jako varování.
  {
    const hlav = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
    const stranka = async (isin) => { try { const r = await fetch(`${WEB_URL}/etf/${isin}`); return r.ok ? (await r.text()).replace(/<!-- -->/g, '') : ''; } catch { return ''; } };
    const text = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ');
    const sekce = (h, nazev) => h.match(new RegExp(`data-sekce="${nazev}"[\\s\\S]*?</section>`))?.[0] ?? '';
    const ZAJ = /[Hh]edg|[Hh]dg|(^|[\s-])h(EUR|USD|GBP|CHF|JPY|SEK|SGD)\b|\bEAH [A-Z]{3}\b|\bH[- ][A-Z]{3}\b|\b[A-Z]{3} \(H\)|\b[A-Z]{3}-H\b/;
    const NEZAJ = /unhedged|not hedged|interest rate hedged|tail hedge|hedged equity|dynamically hedged/i;
    const MZ = '(EUR|USD|GBP|CHF|JPY|SEK|SGD)';
    const VZ = [new RegExp(`(?:^|[\\s-])h${MZ}\\b`), new RegExp(`\\bEAH ${MZ}\\b`), new RegExp(`\\bH[- ]${MZ}\\b`), new RegExp(`\\b${MZ} \\(H\\)`), new RegExp(`\\b${MZ}-H\\b`),
      new RegExp(`\\b${MZ}\\)?[\\s-]*(?:(?:daily|monthly)\\s+)?(?:hedged?|hdg|pfhdg)\\b`, 'i'), new RegExp(`\\b(?:hedged?|hdg)\\s*\\(?\\s*(?:to\\s+)?${MZ}\\b`, 'i')];
    // Měna zajištění z názvu (nezávisle na src/utils/hedgingDetection.ts): null = nezajištěná třída, 'ano' = měnu nepoznáme.
    const zajMena = (n) => { if (!ZAJ.test(n || '') || NEZAJ.test(n || '')) return null; for (const re of VZ) { const m = (n || '').match(re); if (m) return m[1].toUpperCase(); } return 'ano'; };
    const klicIdx = (s) => String(s || '').replace(/[®™]/g, '').replace(/\s*\((EUR|USD|GBP|CHF|JPY) Hedged\)\s*$/i, '').replace(/investable market\s*\(imi\)/i, 'IMI').split(/\s{2,}/)[0].replace(/\s+/g, ' ').trim().toLowerCase();
    try {
      const sxr8 = await stranka('IE00B5BMR087');
      if (!sxr8) throw new Error('detail SXR8 se nenačetl');
      const nasazeno = /data-detail="kolo6"/.test(sxr8);
      const chyby = [];   // → poplach (po nasazení), jinak varování
      // Na produkci jen fondy z pevné sady (EUN5, IBCF, QDVE, VWRL, QUEJ jen lokálně – jejich podkontroly se samy přeskočí).
      const T = R.detailyT({ EUN5: 'IE00B3F81R35', IBC1: 'IE00BGSF1X88', IBCF: 'IE00B3ZW0K18', XEON: 'LU0290358497', BRNT: 'JE00B78CGV99', BITC: 'GB00BLD4ZL17',
        SGLN: 'IE00B4ND3602', QDVE: 'IE00B3WJKG14', VWRL: 'IE00B3RBWM25', P500: 'IE00B3YCGJ38', VHYL: 'IE00B8GKDB10', EMIM: 'IE00BKM4GZ66', QUEJ: 'LU1753045845' }, 'Detail fondu (kolo 6)');
      const html = { SXR8: sxr8 };
      for (const [tk, isin] of Object.entries(T)) html[tk] = await stranka(isin);
      const nenacteno = Object.entries(html).filter(([, h]) => !h).map(([tk]) => tk);
      if (nenacteno.length) varovani.push({ co: 'Kontrola detailu (kolo 6): některé detaily se nenačetly', ukazka: nenacteno });
      const db = await fetch(`${URL_DB}?select=isin,name,index_name,investment_focus,category,${Array.from({ length: 10 }, (_, i) => `exchange_${i + 1}_name,exchange_${i + 1}_ticker,exchange_${i + 1}_currency`).join(',')}&isin=in.(${Object.values(T).join(',')},IE00B5BMR087)`, hlav).then((x) => x.json());
      const dbIsin = new Map(db.map((x) => [x.isin, x]));

      // 1) Hlavička: čísla se nesmí useknout (truncate na <dd> v hlavičce = „Vyplácí 3,4…“, „Lucembursk…“).
      const kod = readFileSync('src/app/etf/[isin]/page.tsx', 'utf8');
      if (/<dd className="[^"]*\btruncate\b[^"]*">\{v\}<\/dd>/.test(kod)) chyby.push('page.tsx: <dd> klíčových faktů v hlavičce má truncate (useknutá čísla na mobilu)');

      // 2) Ticker v hlavičce vs. burzy: fond s XETRA listingem jiného tickeru ukazuje „u českých brokerů XETRA“; hlavní burza
      //    v sekci burz je v EUR, pokud fond nějaký EUR listing má (VWRL/VHYL dřív „LSE VWRD · USD“).
      for (const tk of ['VWRL', 'VHYL', 'EMIM', 'BRNT', 'SGLN', 'IBC1']) {
        const h = html[tk]; const f = dbIsin.get(T[tk]); if (!h || !f) continue;
        const listingy = Array.from({ length: 10 }, (_, i) => ({ n: f[`exchange_${i + 1}_name`], t: f[`exchange_${i + 1}_ticker`], c: f[`exchange_${i + 1}_currency`] })).filter((l) => l.n && l.t && l.t !== '-');
        const xetra = listingy.find((l) => /xetra/i.test(l.n));
        const hlavni = h.match(/data-ticker="true"[^>]*>([^<]+)</)?.[1]?.trim();
        if (xetra && hlavni && xetra.t.toUpperCase() !== hlavni.toUpperCase() && !/data-xetra-ticker/.test(sekce(h, 'hlavicka'))) chyby.push(`${tk}: hlavička neukazuje ticker na XETRA (${xetra.t})`);
        const prvni = h.match(/id="burzy"[\s\S]*?<strong[^>]*>([^<]+)<\/strong>\s*<span[^>]*>·\s*([A-Z]{3})/);
        if (prvni && listingy.some((l) => l.c === 'EUR') && prvni[2] !== 'EUR') chyby.push(`${tk}: hlavní burza v sekci burz je ${prvni[1]} v ${prvni[2]}, přitom fond má listing v EUR`);
        if (/Ticker na gettex/.test(h)) chyby.push(`${tk}: „Ticker na gettex“ bez vysvětlení (má být „německé burze gettex“)`);
      }

      // 3) Index „—“, přestože ho zdroj zná (QDVE, XEON, IBC1 – pravidlo „název končí indexem“). Fallback = index_name.
      for (const tk of ['QDVE', 'XEON', 'IBC1', 'EUN5', 'EMIM', 'QUEJ']) {
        const h = html[tk]; const f = dbIsin.get(T[tk]); if (!h || !f?.index_name) continue;
        const m = text(sekce(h, 'fakta')).match(/Sledovaný index (\S+)/);
        if (!m || m[1] === '—') chyby.push(`${tk}: „Sledovaný index —“, přitom zdroj uvádí „${f.index_name}“`);
      }

      // 4) Měnové zajištění vidět (IBCF): štítek v hlavičce a index „(zajištěno do EUR)“.
      if (html.IBCF && (!/data-zajisteni/.test(html.IBCF) || !/zajištěno do EUR/.test(sekce(html.IBCF, 'hlavicka')))) chyby.push('IBCF: v hlavičce chybí štítek „Zajištěno do EUR“ / index „(zajištěno do EUR)“');

      // 5) Texty podle typu produktu: W‑8BEN jen s americkými akciemi, „ne GICS“ jen u akcií, „dividendy reinvestuje“
      //    ne u dluhopisů/peněžního trhu, irská smlouva s USA ne u Lucemburska, „Co je tento produkt“ u zvláštních typů.
      for (const tk of ['XEON', 'IBC1', 'EUN5', 'SGLN', 'BITC', 'BRNT']) if (html[tk] && /W.8BEN/.test(text(html[tk]))) chyby.push(`${tk}: FAQ o W‑8BEN u fondu bez amerických akcií`);
      if (html.SXR8 && !/W‑8BEN/.test(html.SXR8)) chyby.push('SXR8: chybí FAQ o W‑8BEN (s nedělitelným spojovníkem)');
      for (const tk of ['EUN5', 'IBC1']) if (html[tk] && /ne GICS\./.test(text(html[tk]))) chyby.push(`${tk}: „Podle klasifikace zdroje dat, ne GICS“ u dluhopisového fondu`);
      for (const tk of ['XEON', 'IBC1']) if (html[tk] && /dividendy reinvestuje/i.test(text(html[tk]))) chyby.push(`${tk}: „dividendy reinvestuje“ u fondu bez dividend`);
      for (const tk of ['XEON', 'QUEJ']) if (html[tk] && /Irsko má s USA/.test(html[tk])) chyby.push(`${tk}: vysvětlivka o irské smlouvě s USA u lucemburského fondu`);
      for (const tk of ['XEON', 'IBC1', 'BRNT', 'BITC', 'SGLN', 'P500']) if (html[tk] && !/data-sekce="co-je-produkt"/.test(html[tk])) chyby.push(`${tk}: chybí věta „Co je tento produkt“ nahoře`);
      if (html.XEON && /text-red-600[^"]*">0,0/.test(html.XEON)) chyby.push('XEON: max. pokles 0,0 % červeně');
      if (html.VWRL && !/Kč ročně ze 100/.test(html.VWRL)) chyby.push('VWRL: u distribučního fondu chybí přepočet výplat na Kč ze 100 000 Kč');
      if (html.EMIM && /Co\., Ltd\./.test(sekce(html.EMIM, 'slozeni'))) chyby.push('EMIM: názvy pozic s „Co., Ltd.“ (cistyNazevPozice)');

      // 6) Podobné fondy: pro 20 největších fondů má každý fond v „Další fondy na index X“ stejný index (index_name bez ®
      //    a údaje o zajištění) a stejné zajištění. Dřív holé .eq(index_name) – EMIM (IMI) by ukázal MSCI EM standard.
      const velke = await fetch(`${URL_DB}?select=isin,name,index_name&is_leveraged=not.is.true&fund_size_numeric=not.is.null&order=fund_size_numeric.desc&limit=20`, hlav).then((x) => x.json());
      const spatnePodobne = [];
      // 20 největších se mění s daty → na produkci jen ty z pevné sady.
      const velkeVyber = new Set(R.detaily(velke.map((x) => x.isin), 'Podobné fondy (kolo 6): 20 největších fondů'));
      for (const f of [...velke.filter((x) => velkeVyber.has(x.isin)), ...db.filter((x) => ['IE00B3ZW0K18', 'IE00BKM4GZ66', 'IE00B8GKDB10'].includes(x.isin))]) {
        const h = html[Object.keys(T).find((k) => T[k] === f.isin)] || await stranka(f.isin);
        const isiny = [...sekce(h, 'podobne-fondy').matchAll(/href="\/etf\/([A-Z]{2}[A-Z0-9]{10})"/g)].map((m) => m[1]);
        if (!isiny.length) continue;
        const p = await fetch(`${URL_DB}?select=isin,name,index_name&isin=in.(${isiny.join(',')})`, hlav).then((x) => x.json());
        for (const x of p) {
          if (klicIdx(x.index_name) !== klicIdx(f.index_name)) spatnePodobne.push(`${f.isin} [${f.index_name}] → ${x.isin} [${x.index_name}]`);
          else if (zajMena(x.name) !== zajMena(f.name)) spatnePodobne.push(`${f.isin} (${zajMena(f.name) ?? 'nezajištěný'}) → ${x.isin} (${zajMena(x.name) ?? 'nezajištěný'})`);
        }
      }
      if (spatnePodobne.length) chyby.push(`Podobné fondy s jiným indexem/zajištěním (${spatnePodobne.length}): ${spatnePodobne.slice(0, 4).join('; ')}`);
      if (html.VHYL && !/IE00BK5BR626/.test(sekce(html.VHYL, 'podobne-fondy'))) chyby.push('VHYL: v podobných fondech chybí akumulační třída VGWE (IE00BK5BR626)');

      // 7) Nový fond (< 1 rok, bez výnosu za rok): jedna věta „Fond vznikl …“ místo stěny pomlček.
      const mlade = await fetch(`${URL_DB}?select=isin,name,inception_date,return_1y&return_1y=is.null&fund_size_numeric=gte.500&is_leveraged=not.is.true&scraping_date=gte.${new Date(Date.now() - 5 * 864e5).toISOString().slice(0, 10)}&order=fund_size_numeric.desc&limit=200`, hlav).then((x) => x.json());
      const novy = mlade.find((x) => { const d = Date.parse(x.inception_date); return Number.isFinite(d) && Date.now() - d < 330 * 864e5 && Date.now() - d > 20 * 864e5; });
      if (novy && !R.povoleno(`/etf/${novy.isin}`)) R.jenLokalne(`Nový fond „Fond vznikl …“ (kolo 6): ${novy.isin} vybraný z DB`);
      else if (novy) {
        const h = await stranka(novy.isin);
        if (h && !/data-novy-fond/.test(h)) chyby.push(`${novy.isin} (vznik ${novy.inception_date}): nový fond bez věty „Fond vznikl …“`);
      }

      // 8) Součet sektorů/zemí mimo 95–100,5 % (IBC1 sektory 101,9 %) → na detailu viditelné upozornění.
      const sk = await fetch(`${URL_DB}?select=isin,sector_1_weight,sector_2_weight,sector_3_weight,sector_4_weight,sector_5_weight&isin=eq.IE00BGSF1X88`, hlav).then((x) => x.json());
      const soucet = sk[0] ? [1, 2, 3, 4, 5].reduce((s, i) => s + (Number(sk[0][`sector_${i}_weight`]) || 0), 0) : null;
      if (soucet != null && (soucet > 100.5 || soucet < 95) && html.IBC1 && !/data-soucet-nesedi/.test(html.IBC1)) chyby.push(`IBC1: součet sektorů ${soucet.toFixed(1)} % bez upozornění`);

      if (chyby.length) (nasazeno ? poplach : varovani).push({ co: `Detail fondu (kolo 6)${nasazeno ? '' : ' – produkce ještě bez oprav (před nasazením)'}: ${chyby.length} nálezů`, ukazka: chyby.slice(0, 10) });

      // 9) Zaměření fondu: každá část investment_focus v DB musí mít český překlad (src/lib/preklady.ts – TRIDY, ZEME,
      //    SEKTORY; „X (EUR Hedged)“ podle základu). Detail nepřeložené části vynechává, ale chybějící slovo = chybějící info.
      const prekl = readFileSync('src/lib/preklady.ts', 'utf8');
      const klice = new Set();
      for (const blok of ['const ZEME', 'export const SEKTORY', 'const TRIDY']) {
        const t = prekl.slice(prekl.indexOf(blok)).match(/\{[\s\S]*?\n\};/)?.[0] ?? '';
        for (const m of t.matchAll(/(?:'([^']+)'|([A-Za-z]+)):\s*'/g)) klice.add(m[1] ?? m[2]);
      }
      if (klice.size < 100) throw new Error(`slovníky v preklady.ts nenalezeny (${klice.size} klíčů)`);
      const casti = new Map();
      for (let off = 0; ; off += 1000) {
        const b = await fetch(`${URL_DB}?select=investment_focus&order=isin&limit=1000&offset=${off}`, hlav).then((x) => x.json());
        for (const x of b) for (const c of String(x.investment_focus || '').split(/\s*,\s*/)) if (c) casti.set(c, (casti.get(c) ?? 0) + 1);
        if (b.length < 1000) break;
      }
      const prelozitelne = (c) => /^[A-Z]{3}$/.test(c) || /^\d+(-\d+|\+)$/.test(c) || klice.has(c) || klice.has(c.replace(/\s+\((EUR|USD|GBP|CHF|JPY) Hedged\)$/, ''));
      const bez = [...casti].filter(([c]) => !prelozitelne(c));
      if (bez.length) varovani.push({ co: `${bez.length} částí zaměření fondů (investment_focus) nemá český překlad – na detailu chybí (src/lib/preklady.ts, TRIDY)`, ukazka: bez.sort((a, b) => b[1] - a[1]).slice(0, 8).map(([c, n]) => `${c} (${n}×)`) });
    } catch (e) {
      varovani.push({ co: `Kontrolu detailu fondu (kolo 6) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }
  }
  // --- konec kolo6 detail ---

  // --- kolo6b detail --- (kontrolní revize kola 6b, 21. 10. 2026; pravidlo č. 1, bod 4 – každá oprava má kontrolu)
  // 1) ODLEHLÝ VÝNOS VŠUDE STEJNĚ: fond s výnosem 12 m mimo svůj trh (> 1,5 p. b. od mediánu, spočteno TADY z holých dat,
  //    nezávisle na src/lib/trhy.ts) nesmí mít číslo výnosu za období v žebříčku, v /api/etf/screener, v porovnání ani
  //    v našeptávači (XSXD 20. 10.: detail „—“, ale žebříček +24,9 % EUR a 1. při řazení podle výnosu).
  // 2) Pravidlo tříd s kotvou trhu: P500 max. pokles 3 roky se nesmí skrývat, když sedí s ostatními fondy na S&P 500.
  // 3) Web netvrdí nepravdu o XETRA (FAQ „na XETRA se obchoduje v …“, řádek „Burza XETRA“) a burzy na stránce dvojice
  //    začínají XETRA; detail z hlavy neodkazuje na nekurátorskou dvojici (googlebot noindex); žebříček podle zaměření.
  // Značka data-kolo6b na detailu = produkce už má opravy; bez ní se nálezy hlásí jen jako varování.
  {
    const hlav = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
    const vem = async (cesta) => { try { const r = await fetch(`${WEB_URL}${cesta}`); return r.ok ? (await r.text()).replace(/<!-- -->/g, '') : ''; } catch { return ''; } };
    const rsc = (h) => h.replace(/\\"/g, '"');
    const text = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/ /g, ' ').replace(/\s+/g, ' ');
    const sekce = (h, nazev) => h.match(new RegExp(`data-sekce="${nazev}"[\\s\\S]*?</section>`))?.[0] ?? '';
    const chyby = [];
    try {
      const sxr8 = await vem('/etf/IE00B5BMR087');
      if (!sxr8) throw new Error('detail SXR8 se nenačetl');
      const nasazeno = /data-kolo6b=/.test(sxr8);

      // 1) Odlehlé výnosy – nezávislý přepočet z DB (stejné pravidlo jako blok „TRHY NA HOMEPAGE“ výše).
      const zdroj = readFileSync('src/data/trhyDvojcata.ts', 'utf8');
      const trhy = [...zdroj.matchAll(/id: '([a-z0-9]+)'[\s\S]*?href: '([^']+)',[\s\S]*?isins: \[([\s\S]*?)\]/g)]
        .map((m) => ({ id: m[1], href: m[2], isins: [...m[3].matchAll(/'([A-Z]{2}[A-Z0-9]{10})'/g)].map((x) => x[1]) }));
      if (trhy.length < 6) throw new Error(`v seznamu trhů jen ${trhy.length} trhů`);
      const db = await fetch(`${URL_DB}?select=isin,name,primary_ticker,return_1y_czk,scraping_date,returns_as_of&isin=in.(${trhy.flatMap((t) => t.isins).join(',')})`, hlav).then((x) => x.json());
      const podle = new Map(db.map((x) => [x.isin, x]));
      const odlehle = []; // { isin, ticker, trh, ref }
      for (const t of trhy) {
        // Jen fondy ke dni většiny (31. 10. 2026) – fond s jiným dnem výnosů web ukazuje s jeho datem, ne jako odlehlý.
        const f = sDnemVetsiny(t.isins.map((i) => podle.get(i)).filter(Boolean).filter((x) => x.scraping_date && dni(x) <= 14 && x.return_1y_czk != null));
        const v = f.map((x) => Number(x.return_1y_czk)).sort((a, b) => a - b);
        if (v.length < 3) continue;
        const med = v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
        const ok = f.filter((x) => Math.abs(Number(x.return_1y_czk) - med) <= 1.5);
        for (const x of f) if (Math.abs(Number(x.return_1y_czk) - med) > 1.5) odlehle.push({ isin: x.isin, ticker: x.primary_ticker, trh: t, ref: ok[0]?.isin, o: Math.abs(Number(x.return_1y_czk) - med) });
      }
      const OBDOBI = /^(return_(ytd|1y|3y|5y)(_czk|_usd)?)$/;
      // 5. 11. 2026: fond 1,5–5 p. b. od trhu (jiný čas ocenění u zdroje) se na stránce vykreslené během stahování může
      // ještě ukázat s číslem – varování; chyba (e-mail) jen u > 5 p. b. (skutečně vadná data).
      const mirne = [];
      if (odlehle.length) {
        // a) srovnávač (API pro klienta)
        let api = [];
        try { api = await fetch(`${WEB_URL}/api/etf/screener`).then((x) => x.json()); } catch { /* níže */ }
        if (!Array.isArray(api) || api.length < 1000) chyby.push('/api/etf/screener se nenačetl');
        // Stránky a API jsou z ISR cache (1 den): po novém stažení můžou ukazovat VČEREJŠÍ data, kdy fond odlehlý nebyl
        // (3. 11. 2026: BNP MSCI World odlehlý k 30. 10., srovnávač i žebříček ještě s daty k 29. 10. = 18,1 % v trhu).
        // Porovnává se proto jen stránka se stejnými daty jako DB; jinak varování (s daty k dřívějšímu dni to chyba není).
        const zastarale = [];
        for (const o of odlehle) {
          const r = Array.isArray(api) ? api.find((x) => x.isin === o.isin) : null;
          const dbR1 = Number(podle.get(o.isin)?.return_1y_czk);
          if (r && r.return_1y_czk != null && Math.abs(Number(r.return_1y_czk) - dbR1) > 0.051) { zastarale.push(`srovnávač ${o.isin}: ${r.return_1y_czk} % ≠ DB ${dbR1.toFixed(2)} % (data z cache)`); continue; }
          if (r && Object.entries(r).some(([k, v]) => OBDOBI.test(k) && v != null)) (o.o > 5 ? chyby : mirne).push(`srovnávač: ${o.isin} (výnos mimo trh ${o.trh.id}) ukazuje výnos za období`);
        }
        // b) žebříček trhu (data tabulky v RSC: r1/r3 ve všech měnách null)
        const zebr = new Map();
        for (const o of odlehle) {
          if (!zebr.has(o.trh.href)) zebr.set(o.trh.href, rsc(await vem(o.trh.href)));
          const h = zebr.get(o.trh.href);
          const denZ = (([, d, m, y]) => y && `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`)(h.replace(/<[^>]*>/g, ' ').match(/Data k\s*(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})/) ?? []);
          const denDb = String(podle.get(o.isin)?.returns_as_of ?? '').slice(0, 10);
          if (denZ && denDb && denZ !== denDb) { zastarale.push(`žebříček ${o.trh.href}: data k ${denZ}, DB ${o.isin} k ${denDb}`); continue; }
          const i = h.indexOf(`"isin":"${o.isin}","nazev"`);
          if (i < 0) continue; // fond v tabulce žebříčku není (mimo 300 největších / filtr)
          const radek = h.slice(i, h.indexOf('"zajisteni"', i));
          if (/"r[13]":\{[^}]*-?\d/.test(radek)) (o.o > 5 ? chyby : mirne).push(`žebříček ${o.trh.href}: ${o.isin} má v tabulce číslo výnosu`);
        }
        if (zastarale.length) varovani.push({ co: `Kolo 6b: odlehlý výnos se na ${zastarale.length} místech nekontroloval – stránka z cache má data k dřívějšímu dni`, ukazka: zastarale.slice(0, 6) });
        // c) porovnání (objekt fondu v RSC + vysvětlivka)
        for (const o of odlehle.slice(0, 3)) {
          if (!o.ref) continue;
          const h = rsc(await vem(`/srovnani/porovnani?isins=${o.isin},${o.ref}`));
          if (!h) { chyby.push(`porovnání ${o.isin} se nenačetlo`); continue; }
          const i = h.indexOf(`"isin":"${o.isin}"`);
          // jen objekt tohoto fondu – do dalšího „"isin":"“ (srovnávací fond za ním má výnosy oprávněně)
          const konec = i < 0 ? -1 : h.indexOf('"isin":"', i + 10);
          const obj = i < 0 ? '' : h.slice(i, konec < 0 ? i + 20000 : Math.min(konec, i + 20000));
          const cisla = [...obj.matchAll(/"(return_(?:ytd|1y|3y|5y)(?:_czk|_usd)?)":(-?\d[\d.]*)/g)].map((m) => `${m[1]}=${m[2]}`);
          if (cisla.length) (o.o > 5 ? chyby : mirne).push(`porovnání: ${o.isin} posílá výnos za období (${cisla.slice(0, 3).join(', ')})`);
          if (!/Podtržená „—“ u výnosu/.test(text(h))) chyby.push(`porovnání ${o.isin}: chybí vysvětlivka podtržené „—“ u výnosu`);
        }
        // d) našeptávač
        for (const o of odlehle.slice(0, 3)) {
          if (!o.ticker || o.ticker === '-') continue;
          try {
            const s = await fetch(`${WEB_URL}/api/etf/search?q=${encodeURIComponent(o.ticker)}`).then((x) => x.json());
            const r = (s.results ?? []).find((x) => x.isin === o.isin);
            if (r && r.r1_czk != null) (o.o > 5 ? chyby : mirne).push(`hledání „${o.ticker}“: ${o.isin} ukazuje výnos 12 m ${r.r1_czk} %`);
          } catch { /* hledání nedostupné – hlásí jiné kontroly */ }
        }
        // e) detail fondu (původní pravidlo – pojistka)
        for (const o of odlehle.slice(0, 3).filter((x) => R.detaily([x.isin], 'Kolo 6b (e): detail fondu s odlehlým výnosem').length)) {
          const h = await vem(`/etf/${o.isin}`);
          if (h && !/Výnosy za období neukazujeme/.test(text(h))) (o.o > 5 ? chyby : mirne).push(`detail ${o.isin}: výnos mimo trh bez vysvětlení „Výnosy za období neukazujeme“`);
        }
      }
      if (mirne.length) varovani.push({ co: `Kolo 6b: fond 1,5–5 p. b. mimo trh ještě s číslem výnosu (${mirne.length}) – stránka vykreslená během stahování, další obnova ho skryje`, ukazka: mirne.slice(0, 6) });

      // 2) Kotva tříd: P500 (Invesco S&P 500 Acc) max. pokles 3 roky – když sedí s mediánem ostatních fondů na S&P 500
      //    (bez tříd Invesco S&P 500), nesmí být „—“ (ověřeno nezávisle: −22,61 %, Martin 21. 10. 2026).
      {
        const sp = trhy.find((t) => t.id === 'sp500');
        const r = await fetch(`${URL_DB}?select=isin,name,fund_provider,max_drawdown_3y,scraping_date&isin=in.(${sp.isins.join(',')})`, hlav).then((x) => x.json());
        const p500 = r.find((x) => x.isin === 'IE00B3YCGJ38');
        const ost = r.filter((x) => !/^Invesco S&P 500 UCITS ETF/i.test(x.name ?? '') && x.max_drawdown_3y != null && dni(x) <= 14).map((x) => Math.abs(Number(x.max_drawdown_3y))).sort((a, b) => a - b);
        const med = ost.length >= 5 ? (ost.length % 2 ? ost[(ost.length - 1) / 2] : (ost[ost.length / 2 - 1] + ost[ost.length / 2]) / 2) : null;
        const v = p500?.max_drawdown_3y == null ? null : Math.abs(Number(p500.max_drawdown_3y));
        if (med != null && v != null && !(Math.abs(v - med) >= 1 && Math.max(v, med) / Math.min(v, med) > 1.3)) {
          const h = await vem('/etf/IE00B3YCGJ38');
          const radek = text(sekce(h, 'riziko')).match(/Max\. pokles (\S+ %|—) (\S+ %|—)/);
          if (h && (!radek || radek[2] === '—')) chyby.push(`P500: max. pokles 3 roky „—“, přitom ${(-v).toFixed(2)} % sedí s trhem S&P 500 (medián −${med.toFixed(2)} %)`);
        }
      }

      // 3a) XETRA: FAQ „na XETRA se obchoduje v X“ a řádek „Burza XETRA“ jen když to DB opravdu má.
      const T = R.detailyT({ SXR8: 'IE00B5BMR087', VWRL: 'IE00B3RBWM25', VALL: 'IE000VAHT5T0', IBC1: 'IE00BGSF1X88', EMIM: 'IE00BKM4GZ66', P500: 'IE00B3YCGJ38', QUEJ: 'LU1753045845' }, 'Kolo 6b: XETRA a odkaz na žebříček (VWRL, VALL, QUEJ)');
      const dbx = await fetch(`${URL_DB}?select=isin,fund_currency,${Array.from({ length: 10 }, (_, i) => `exchange_${i + 1}_name,exchange_${i + 1}_ticker,exchange_${i + 1}_currency`).join(',')}&isin=in.(${Object.values(T).join(',')})`, hlav).then((x) => x.json());
      const html = { SXR8: sxr8 };
      for (const [tk, isin] of Object.entries(T)) if (!html[tk]) html[tk] = await vem(`/etf/${isin}`);
      for (const [tk, isin] of Object.entries(T)) {
        const h = html[tk]; const f = dbx.find((x) => x.isin === isin); if (!h || !f) continue;
        const xetra = Array.from({ length: 10 }, (_, i) => ({ n: f[`exchange_${i + 1}_name`], t: f[`exchange_${i + 1}_ticker`], c: f[`exchange_${i + 1}_currency`] })).find((l) => /xetra/i.test(l.n ?? '') && l.t && l.t !== '-');
        const t = text(h);
        const faq = t.match(/na XETRA se obchoduje v ([A-Z]{3})/);
        if (faq && (!xetra || xetra.c !== faq[1])) chyby.push(`${tk}: FAQ tvrdí „na XETRA se obchoduje v ${faq[1]}“, DB ${xetra ? `má XETRA v ${xetra.c}` : 'XETRA listing nemá'}`);
        if (/se obchoduje v cizí měně/.test(t)) chyby.push(`${tk}: FAQ „se obchoduje v cizí měně“ (fond je v ní jen vedený)`);
        if (/Burza XETRA/.test(text(h.match(/id="burzy"[\s\S]{0,1500}/)?.[0] ?? '')) && !xetra) chyby.push(`${tk}: řádek „Burza XETRA“, přitom DB XETRA listing nemá`);
        // 3c) detail z hlavy (bez googlebot noindex) neodkazuje na nekurátorskou dvojici
        if (!/<meta name="googlebot" content="[^"]*noindex/.test(h)) {
          const pairsTs = readFileSync('src/lib/pairs.ts', 'utf8');
          const kur = new Set([...pairsTs.slice(pairsTs.indexOf('export const KURATORSKE:'), pairsTs.indexOf('export const KURATORSKE_ALIASY')).matchAll(/'([a-z0-9]+-vs-[a-z0-9]+)':/g)].map((m) => m[1]));
          const spatne = [...h.matchAll(/href="\/srovnani\/([a-z0-9]+-vs-[a-z0-9]+)"/g)].map((m) => m[1]).filter((s) => !kur.has(s));
          if (spatne.length) chyby.push(`${tk} (hlava, indexovaný): odkaz na nekurátorskou dvojici ${[...new Set(spatne)].join(', ')} (googlebot noindex)`);
        }
      }
      // 3b) Burzy na stránce „stejný fond“: první řádek tabulky = XETRA, když ji fond má.
      {
        const h = text((await vem('/srovnani/cspx-vs-sxr8')).match(/Kde se fond obchoduje[\s\S]*?<\/table>/)?.[0] ?? '');
        const prvni = h.match(/Ticker Burza Měna (\S+) (.+?) (EUR|USD|GBX|GBP|CHF)/);
        if (!prvni) chyby.push('/srovnani/cspx-vs-sxr8: tabulka burz nenalezena');
        else if (!/XETRA/i.test(prvni[2])) chyby.push(`/srovnani/cspx-vs-sxr8: první burza ${prvni[2]}, ne XETRA`);
      }
      // 3d) Odkaz detailu na žebříček podle zaměření (dřív VALL/QUEJ „Nejlepší akciové ETF“).
      for (const [tk, cil] of [['VALL', '/nejlepsi-etf/nejlepsi-celosvetove-etf'], ['QUEJ', '/nejlepsi-etf/nejlepsi-japonske-etf']]) {
        const odkaz = sekce(html[tk] ?? '', 'podobne-fondy').match(/href="(\/nejlepsi-etf\/[^"]+|\/zebricky)"/)?.[1];
        if (html[tk] && odkaz && odkaz !== cil) chyby.push(`${tk}: odkaz na žebříček ${odkaz} (má být ${cil})`);
      }
      // 3e) Porovnání: názvy pozic stejně čisté jako detail (EMIM: „Co., Ltd.“ a dvě třídy Samsungu).
      {
        const h = text(await vem('/srovnani/porovnani?isins=IE00BKM4GZ66,IE00BK5BQT80'));
        if (/Co\., Ltd\./.test(h)) chyby.push('porovnání EMIM: názvy pozic s „Co., Ltd.“ (cistyNazevPozice)');
      }

      if (chyby.length) (nasazeno ? poplach : varovani).push({ co: `Kolo 6b${nasazeno ? '' : ' – produkce ještě bez oprav (před nasazením)'}: ${chyby.length} nálezů`, ukazka: chyby.slice(0, 10) });
    } catch (e) {
      varovani.push({ co: `Kontrolu kola 6b se nepodařilo provést: ${e.message}`, ukazka: chyby.slice(0, 5) });
    }
  }
  // --- konec kolo6b detail ---

  // --- kolo6 seo --- (nezávislý SEO audit 20. 10. 2026; pravidlo č. 1, bod 4 – každá oprava má kontrolu)
  // Před nasazením (WEB_URL ještě nemá /metodika) se nálezy hlásí jen jako varování, po nasazení jako poplach.
  {
    const vem = async (cesta, opt = {}) => { try { const r = await fetch(`${WEB_URL}${cesta}`, opt); return { status: r.status, loc: r.headers.get('location') ?? '', html: opt.redirect === 'manual' ? '' : (await r.text()).replace(/<!-- -->/g, '') }; } catch { return { status: 0, loc: '', html: '' }; } };
    const kanon = (h) => h.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? null;
    const meta = (h, n) => h.match(new RegExp(`<meta name="${n}" content="([^"]*)"`))?.[1] ?? null;
    const titul = (h) => (h.match(/<title>([^<]*)<\/title>/)?.[1] ?? '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
    const ldJson = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch { return { __chyba: m[1].slice(0, 60) }; } }).flatMap((x) => (Array.isArray(x) ? x : [x]));
    const slova = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
    const PRESMEROVANI = [301, 307, 308];
    const chyby = [];
    try {
      const metodika = await vem('/metodika');
      const nasazeno = metodika.status === 200;

      // 1) Detail fondu: canonical na ISIN velkými, titulek ≤ 65 znaků s tickerem dopředu, popisek 120–170 znaků;
      //    výnos v popisku jen S DATEM, které se shoduje s „data k …“ v patičce stránky (detail se cachuje 30 dní).
      const MESICE = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];
      for (const isin of ['IE00B5BMR087', 'IE00BK5BQT80', 'IE00B4L5Y983']) {
        const { html: h } = await vem(`/etf/${isin}`);
        if (!h) { chyby.push(`detail ${isin} se nenačetl`); continue; }
        if (kanon(h) !== `https://etfpruvodce.cz/etf/${isin}`) chyby.push(`detail ${isin}: canonical ${kanon(h)} (má být /etf/${isin})`);
        const t = titul(h);
        if (t.length > 65 || !/^[A-Z0-9]{2,12}( \([A-Z0-9]{2,12}\))? – /.test(t)) chyby.push(`detail ${isin}: titulek „${t}“ (${t.length} zn.) – má být ≤ 65 a začínat tickerem`);
        const d = (meta(h, 'description') ?? '').replace(/&amp;/g, '&');
        if (d.length < 120 || d.length > 170) chyby.push(`detail ${isin}: popisek má ${d.length} znaků (120–170)`);
        if (/výnos za 1 rok/.test(d)) {
          const dd = d.match(/data k (\d{1,2})\. (\d{1,2})\. (\d{4})/);
          const patka = h.replace(/<[^>]+>/g, ' ').replace(/\u00a0/g, ' ').match(/data k (\d{1,2})\. (\S+?)\.? (\d{4})/);
          const mesic = patka ? (/^\d+$/.test(patka[2]) ? Number(patka[2]) : MESICE.indexOf(patka[2]) + 1) : 0;
          if (!dd) chyby.push(`detail ${isin}: výnos v popisku BEZ data („${d.slice(0, 80)}…“)`);
          else if (patka && (Number(patka[1]) !== Number(dd[1]) || mesic !== Number(dd[2]) || patka[3] !== dd[3])) chyby.push(`detail ${isin}: datum v popisku ${dd[0]} ≠ na stránce ${patka[0]}`);
        }
        if (/srovnani-etf/.test(JSON.stringify(ldJson(h)))) chyby.push(`detail ${isin}: BreadcrumbList míří na přesměrovanou /srovnani-etf`);
      }
      // Experiment indexace beze změny: hlava bez googlebot noindex, ocas (malý fond) s googlebot noindex.
      {
        const { html: hlava } = await vem('/etf/IE00B5BMR087');
        if (/<meta name="googlebot" content="[^"]*noindex/.test(hlava)) chyby.push('detail SXR8 (hlava) má googlebot noindex – experiment indexace porušen');
        // Lokálně největší z malých fondů (mění se s daty); na produkci malý fond z pevné sady (stejná podmínka v DB).
        const maly = await fetch(`${URL_DB}?select=isin&fund_size_numeric=lt.50&fund_size_numeric=gt.0&is_leveraged=not.is.true&name=not.is.null${R.produkce ? `&isin=in.(${R.PROD_DETAILY.join(',')})` : ''}&order=fund_size_numeric.desc&limit=1`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }).then((x) => x.json()).catch(() => []);
        if (maly[0]) {
          const { html: ocas } = await vem(`/etf/${maly[0].isin}`);
          if (ocas && !/<meta name="googlebot" content="noindex, follow"/.test(ocas)) chyby.push(`detail ${maly[0].isin} (ocas) nemá googlebot noindex, follow`);
        }
      }

      // 2) ISIN malými písmeny → trvalé přesměrování na velká (dřív 404).
      //    Trvalé = 301 NEBO 308: od zrušení middleware (7. 11. 2026) dělá přesměrování permanentRedirect() v detailu/dvojici,
      //    které vrací 308. Google 308 bere stejně jako 301 (ZAMERNA-ROZHODNUTI.md). Chyba = dočasné (302/307), jiný cíl, 404.
      const trvale = (st) => st === 301 || st === 308;
      // Lokální build na macOS (8. 11. 2026): ISR cache Nextu je na disku, který nerozlišuje velikost písmen – uložené
      // přesměrování /etf/ie00b5bmr087 pak přebije kanonickou /etf/IE00B5BMR087 (308 bez cíle) a kazí i další testy.
      // Na Vercelu (Linux) to nenastane → varianty s jinou velikostí písmen se lokálně na Macu nezkoušejí.
      const bezVelikosti = /localhost|127\.0\.0\.1/.test(WEB_URL) && process.platform === 'darwin';
      if (bezVelikosti) varovani.push({ co: 'Přesměrování ISIN/dvojic s jinou velikostí písmen se lokálně na macOS nezkouší (disk bez rozlišení velikosti písmen) – ověřuje produkční běh', ukazka: [] });
      const male = bezVelikosti ? { status: 308, loc: '/etf/IE00B5BMR087' } : await vem('/etf/ie00b5bmr087', { redirect: 'manual' });
      if (!trvale(male.status) || !/\/etf\/IE00B5BMR087$/.test(male.loc)) chyby.push(`/etf/ie00b5bmr087 → ${male.status} ${male.loc} (má být 301/308 na /etf/IE00B5BMR087)`);

      // 3) Dvojice srovnání: obrácená kurátorská → 301 na hlavní; alias → canonical na hlavní; nekurátorská → googlebot noindex
      //    a obrácená nekurátorská → přesměrování na abecední tvar; kurátorské dvojice ukazují fondy z pairs.ts (KURATORSKE).
      const pairsTs = readFileSync('src/lib/pairs.ts', 'utf8');
      const kur = Object.fromEntries([...pairsTs.slice(pairsTs.indexOf('export const KURATORSKE:'), pairsTs.indexOf('export const KURATORSKE_ALIASY')).matchAll(/'([a-z0-9]+-vs-[a-z0-9]+)': \['([A-Z0-9]{12})', '([A-Z0-9]{12})'\]/g)].map((m) => [m[1], [m[2], m[3]]]));
      const aliasy = Object.fromEntries([...pairsTs.slice(pairsTs.indexOf('export const KURATORSKE_ALIASY'), pairsTs.indexOf('export const HLAVNI_DVOJICE')).matchAll(/'([a-z0-9-]+)': '([a-z0-9-]+)'/g)].map((m) => [m[1], m[2]]));
      if (Object.keys(kur).length < 15) throw new Error(`KURATORSKE v pairs.ts nenalezeny (${Object.keys(kur).length})`);
      const hlavni = Object.keys(kur).filter((s) => !aliasy[s]);
      const obr = await vem('/srovnani/iwda-vs-vwce', { redirect: 'manual' });
      if (!trvale(obr.status) || !/\/srovnani\/vwce-vs-iwda$/.test(obr.loc)) chyby.push(`/srovnani/iwda-vs-vwce → ${obr.status} ${obr.loc} (má být 301/308 na vwce-vs-iwda)`);
      const velka = bezVelikosti ? { status: 308, loc: '/srovnani/vwce-vs-iwda' } : await vem('/srovnani/VWCE-vs-IWDA', { redirect: 'manual' });
      if (!trvale(velka.status) || !/\/srovnani\/vwce-vs-iwda$/.test(velka.loc)) chyby.push(`/srovnani/VWCE-vs-IWDA → ${velka.status} ${velka.loc} (má být 301/308 na malá písmena)`);
      const odkazyNaDvojice = new Set();
      // Na produkci jen kurátorské dvojice z pevné sady (hlavní + vwce-vs-eunl); aliasy a „osiřelé“ jen lokálně.
      const kurVyber = R.cesty(Object.keys(kur).map((x) => `/srovnani/${x}`), 'Kurátorské dvojice (kolo6 seo): aliasy').map((c) => c.slice('/srovnani/'.length));
      for (const [slug, [i1, i2]] of Object.entries(kur).filter(([x]) => kurVyber.includes(x))) {
        const { status, html: h } = await vem(`/srovnani/${slug}`);
        if (status !== 200) { chyby.push(`/srovnani/${slug} → HTTP ${status}`); continue; }
        const cil = aliasy[slug] ?? slug;
        if (kanon(h) !== `https://etfpruvodce.cz/srovnani/${cil}`) chyby.push(`/srovnani/${slug}: canonical ${kanon(h)} (má být /srovnani/${cil})`);
        if (/<meta name="googlebot" content="[^"]*noindex/.test(h)) chyby.push(`/srovnani/${slug}: kurátorská dvojice má googlebot noindex`);
        for (const i of new Set([i1, i2])) if (!h.includes(`/etf/${i}`)) chyby.push(`/srovnani/${slug}: stránka neukazuje fond ${i} z KURATORSKE (ticker vede na jiný fond?)`);
        for (const m of h.matchAll(/href="\/srovnani\/([a-z0-9]+-vs-[a-z0-9]+)"/g)) if (m[1] !== slug) odkazyNaDvojice.add(m[1]);
        if (/srovnani-etf/.test(JSON.stringify(ldJson(h)))) chyby.push(`/srovnani/${slug}: BreadcrumbList míří na /srovnani-etf`);
        if (kur[slug][0] === kur[slug][1] && (!/data-stejny-fond/.test(h) || !/Data k \d/.test(h) || !/BreadcrumbList/.test(h))) chyby.push(`/srovnani/${slug} (stejný fond): chybí datum, drobečky nebo věta o stejném ISINu`);
      }
      const osirele = hlavni.filter((s) => !odkazyNaDvojice.has(s));
      if (kurVyber.length < Object.keys(kur).length) R.jenLokalne('Kurátorské dvojice bez interního odkazu (potřebuje všechny dvojice včetně aliasů)');
      else if (osirele.length) chyby.push(`Kurátorské dvojice bez interního odkazu z ostatních dvojic: ${osirele.join(', ')}`);
      // Nekurátorská dvojice se vykresluje na vyžádání (ISR zápis) a její chování je čistě kód → jen proti lokálnímu buildu.
      if (R.povoleno('/srovnani/eunl-vs-spyl') && R.povoleno('/srovnani/spyl-vs-eunl')) {
        const mimo = await vem('/srovnani/eunl-vs-spyl');
        if (mimo.status === 200 && !/<meta name="googlebot" content="noindex, follow"/.test(mimo.html)) chyby.push('/srovnani/eunl-vs-spyl (mimo kurátorský seznam) nemá googlebot noindex, follow');
        const mimoObr = await vem('/srovnani/spyl-vs-eunl', { redirect: 'manual' });
        if (!PRESMEROVANI.includes(mimoObr.status) || !/\/srovnani\/eunl-vs-spyl$/.test(mimoObr.loc)) chyby.push(`/srovnani/spyl-vs-eunl → ${mimoObr.status} ${mimoObr.loc} (má být trvalé přesměrování na eunl-vs-spyl)`);
      } else R.jenLokalne('Nekurátorská dvojice eunl-vs-spyl: googlebot noindex a přesměrování obráceného pořadí');

      // 4) robots.txt: /api/ zakázané, /api/og povolené (náhledy pro sociální sítě); /api/og s X-Robots-Tag noindex.
      const robots = (await vem('/robots.txt')).html;
      if (!/Disallow: \/api\//.test(robots) || !/Allow: \/api\/og/.test(robots)) chyby.push('robots.txt: chybí „Disallow: /api/“ nebo „Allow: /api/og“');
      try { const og = await fetch(`${WEB_URL}/api/og?title=Test`); if (!og.ok || !/image/.test(og.headers.get('content-type') ?? '') || !/noindex/.test(og.headers.get('x-robots-tag') ?? '')) chyby.push(`/api/og: HTTP ${og.status}, ${og.headers.get('content-type')}, X-Robots-Tag ${og.headers.get('x-robots-tag')}`); } catch (e) { chyby.push(`/api/og: ${e.message}`); }

      // 5) Sitemapa: /metodika ano, aliasy dvojic ne (mají canonical jinam).
      const sm = (await vem('/sitemap.xml')).html;
      if (!/\/metodika</.test(sm)) chyby.push('sitemap.xml bez /metodika');
      const aliasVSitemape = Object.keys(aliasy).filter((a) => sm.includes(`/srovnani/${a}<`));
      if (aliasVSitemape.length) chyby.push(`sitemap.xml obsahuje aliasy dvojic: ${aliasVSitemape.join(', ')}`);

      // 6) Jedno číslo počtu fondů: homepage titulek, Organization schema a /llms.txt ze stejné funkce (getETFCountLabel).
      const home = (await vem('/')).html;
      const nTitul = titul(home).match(/Srovnání ([\d\s\u00a0\u202f]+)\+/)?.[1]?.replace(/\D/g, '');
      const nOrg = JSON.stringify(ldJson(home)).match(/více než ([\d\s\u00a0\u202f]+) ETF fondů/)?.[1]?.replace(/\D/g, '');
      const nLlms = (await vem('/llms.txt')).html.match(/compares ([\d,]+)\+/)?.[1]?.replace(/\D/g, '');
      if (!nTitul || nTitul !== nOrg || nTitul !== nLlms) chyby.push(`Počet fondů nesedí: titulek homepage ${nTitul}, Organization ${nOrg}, llms.txt ${nLlms}`);

      // 7) Redakční stránky: Article s autorem, vydavatelem, datePublished ≤ dateModified ≤ dnes; JSON-LD parsovatelné; bez hodnocení.
      const dnes = new Date().toISOString().slice(0, 10);
      for (const c of ['/stroj-casu', '/sp500-nebo-cely-svet', '/jak-dlouho-v-minusu', '/pravidlo-4-procent', '/kolik-vydelaly-etf', '/co-rikaji-data', '/faktorove-etf', '/faktorove-etf/small-cap', '/portfolio-strategie/nobel-portfolio', '/kde-koupit', '/metodika']) {
        const { status, html: h } = await vem(c);
        if (status !== 200) { chyby.push(`${c}: HTTP ${status}`); continue; }
        const ld = ldJson(h);
        if (ld.some((x) => x.__chyba)) chyby.push(`${c}: neparsovatelné JSON-LD`);
        if (/"(aggregateRating|ratingValue|reviewRating)"/.test(JSON.stringify(ld))) chyby.push(`${c}: JSON-LD s hodnocením (rating)`);
        const a = ld.find((x) => x['@type'] === 'Article');
        if (!a) { chyby.push(`${c}: chybí Article`); continue; }
        if (a.author?.name !== 'Tomáš Kostrhoun' || !a.publisher?.name || !a.datePublished || !a.dateModified) chyby.push(`${c}: Article bez autora/vydavatele/dat`);
        else if (a.datePublished > a.dateModified || a.dateModified > dnes) chyby.push(`${c}: datePublished ${a.datePublished} / dateModified ${a.dateModified} (dnes ${dnes})`);
        if (!/data-sekce="autor"/.test(h)) chyby.push(`${c}: chybí viditelný autor (AutorBox)`);
      }
      if (!/BreadcrumbList/.test((await vem('/portfolio-strategie/nobel-portfolio')).html)) chyby.push('/portfolio-strategie/nobel-portfolio: chybí BreadcrumbList');

      // 8) Čísla s datem a tenké stránky: /infografiky „Data k …“; /vyber-etf má popis průvodce v HTML (dřív 77 slov).
      const info = (await vem('/infografiky')).html;
      if (!/Data k <strong[^>]*>\d/.test(info)) chyby.push('/infografiky: čísla bez „Data k …“');
      const vyber = (await vem('/vyber-etf')).html;
      if (slova(vyber) < 300 || !/data-sekce="jak-pruvodce-funguje"/.test(vyber)) chyby.push(`/vyber-etf: v HTML ${slova(vyber)} slov / chybí popis průvodce`);
      // Dataset na /srovnani: url, dateModified, isAccessibleForFree.
      const ds = ldJson((await vem('/srovnani')).html).find((x) => x['@type'] === 'Dataset');
      if (!ds?.url || !ds?.dateModified || ds?.isAccessibleForFree !== true) chyby.push('/srovnani: Dataset bez url/dateModified/isAccessibleForFree');
      // Datové články a nástroje prolinkované (patička na každé stránce): /kolik-vydelaly-etf, /stroj-casu, /metodika.
      for (const c of ['/kolik-vydelaly-etf', '/stroj-casu', '/metodika']) if (!home.includes(`href="${c}"`)) chyby.push(`homepage (patička) bez odkazu na ${c}`);

      if (chyby.length) (nasazeno ? poplach : varovani).push({ co: `SEO (kolo 6)${nasazeno ? '' : ' – produkce ještě bez oprav (před nasazením)'}: ${chyby.length} nálezů`, ukazka: chyby.slice(0, 12) });
    } catch (e) {
      varovani.push({ co: `Kontrolu SEO (kolo 6) se nepodařilo provést: ${e.message}`, ukazka: chyby.slice(0, 5) });
    }
  }
  // --- konec kolo6 seo ---

  // --- kolo6b rada --- (21. 10. 2026; pravidlo č. 1, bod 4 – oprava výnosů za období má kontrolu)
  // Zdroj (justETF) vede poslední obchodní den nejdřív PŘEDBĚŽNĚ a konečnou hodnotou (NAV) ho přepíše až během dalšího
  // dne; výnosy z HTML profilu se počítaly k tomu předběžnému bodu (SXR8 19. 10.: 743,07 → konečně 739,32, u fondů na
  // USA 0,2–0,9 p. b. u všech období) a některé fondy mají řadu o dny pozadu (ESEA, PSP5 16. 10. vs. většina 19. 10.).
  // Od scraperu etf-astro (větev vynosy-konecna-rada, scraper/vynosy_z_rady.py) se výnosy počítají z denní řady ke dni
  // returns_as_of = předposlední pracovní den řady fondu (poslední jistě konečný). Kontroly:
  //  (a) kotevní fondy: výnosy v DB (EUR i Kč) = NEZÁVISLÝ přepočet tady z ceny (MARKET_VALUE, jiná řada než scraper,
  //      který bere RELATIVE_CHANGE) k returns_as_of a kurzů ČNB; práh 0,05 p. b. + chyba zaokrouhlení ceny zdroje
  //      na 2 des. místa. Chytí i to, že zdroj den returns_as_of po stažení ještě přepsal (nebyl konečný).
  //  (b) returns_as_of není v budoucnosti, u ≤ 5 % čerstvých fondů je starší než 7 dní; po nasazení scraperu
  //      má returns_as_of ≥ 95 % čerstvých fondů a žádný fond nemá výnosy bez returns_as_of (tichá náhrada z profilu).
  //  (b2) fond nebyl stažen dřív, než zdroj den returns_as_of přepsal na konečný (returns_as_of + 2 prac. dny 05:00 UTC).
  //  (c) web: detail fondu s jiným dnem výnosů než většina ukazuje SVŮJ den (data-vynosy-k), srovnávač mu dává _dv.
  try {
    const UA6 = { 'User-Agent': 'Mozilla/5.0 (compatible; etfpruvodce.cz kontrola dat)' };
    const H = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
    const iso = (d) => d.toISOString().slice(0, 10);
    const poledne = (s) => new Date(`${String(s).slice(0, 10)}T12:00:00Z`);
    const fmt6 = (x) => x.toFixed(2).replace('.', ',');
    // Kdy se nový výpočet dostal do main scraperu (GitHub API, bez tokenu) – fondy stažené potom už returns_as_of mají mít.
    const commit = await fetch('https://api.github.com/repos/Kostrhoun1/etf-astro/commits?path=scraper/vynosy_z_rady.py&sha=main&per_page=1', { headers: UA6 })
      .then((r) => (r.ok ? r.json() : null)).catch(() => null);
    const nasazenoOd = Array.isArray(commit) && commit[0]?.commit?.committer?.date ? new Date(commit[0].commit.committer.date) : null;

    // (b) ─────────────────────────────────────────────────────────────────────────────────────────────────
    const cerstve6 = fondy.filter((x) => x.name && x.scraping_date && dni(x) <= 3);
    const sDnem = cerstve6.filter((x) => x.returns_as_of);
    const zitra = iso(new Date(Date.now() + 864e5));
    const budouci = sDnem.filter((x) => String(x.returns_as_of) >= zitra);
    if (budouci.length) poplach.push({ co: `${budouci.length} fondů má den výnosů (returns_as_of) v budoucnosti`, ukazka: ukazka(budouci, (x) => `${x.isin} returns_as_of ${x.returns_as_of}`) });
    const stare7 = sDnem.filter((x) => (Date.now() - poledne(x.returns_as_of)) / 864e5 > 7);
    if (cerstve6.length && stare7.length / cerstve6.length > 0.05)
      poplach.push({ co: `${stare7.length} čerstvě stažených fondů (${(100 * stare7.length / cerstve6.length).toFixed(1)} %) má výnosy k dni staršímu než 7 dní (práh 5 %) – zdroj přestal posílat ceny, nebo scraper bere špatný den?`, ukazka: ukazka(stare7, (x) => `${x.isin} ${String(x.name).slice(0, 30)} k ${x.returns_as_of}`) });
    else if (stare7.length) varovani.push({ co: `${stare7.length} čerstvých fondů má výnosy k dni staršímu než 7 dní (zdroj nemá nové ceny – web u nich ukazuje jejich den)`, ukazka: ukazka(stare7, (x) => `${x.isin} ${String(x.name).slice(0, 30)} k ${x.returns_as_of}`) });
    // (b2) Den výnosů musel být při stažení už KONEČNÝ (31. 10. 2026). Zdroj přepisuje předběžný bod dne D konečnou
    //      hodnotou až kolem 04:00 UTC dne D + 2 pracovní dny; scraper (út–pá od 01:30 UTC) ale bral D = 2 pracovní dny
    //      před stažením bez ohledu na hodinu → fondy stažené před ~04:00 UTC měly výnosy z předběžného bodu (30. 10. 2026:
    //      2 373 fondů). Čistě z DB: čerstvý fond (stažený za posledních 7 dní) nesmí mít scraping_date (UTC) dřív než
    //      returns_as_of + 2 pracovní dny v 05:00 UTC (hodina rezerva). Svátky neznáme – v den po svátku může hlásit navíc.
    //      POZOR (3. 11. 2026): 1. 11. jsem pravidlo chybně uvolnil na „2 prac. dny zpět od dne stažení“ podle sobotního
    //      „důkazu“ (SXR8 29. 10. −0,54 % ≈ S&P v EUR z Yahoo) – ten byl náhoda: zdroj bod 29. 10. po sobotě přepsal
    //      (YTD SXR8 k 29. 10. sobota 19,61 % → 19,94 %, 1R 17,90 → 18,23 %). Platí D + 2 PRACOVNÍ dny; víkendové stažení
    //      (ruční) proto smí vzít nejvýš středu. Neuvolňovat bez porovnání bodu zdroje před a po přepisu.
    {
      const utc = (s) => new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(String(s)) ? String(s) : `${s}Z`);
      const konecnyOd = (d) => { // returns_as_of + 2 pracovní dny (po–pá), 05:00 UTC
        const x = new Date(`${String(d).slice(0, 10)}T05:00:00Z`);
        for (let n = 0; n < 2;) { x.setUTCDate(x.getUTCDate() + 1); if (x.getUTCDay() !== 0 && x.getUTCDay() !== 6) n++; }
        return x;
      };
      const tyden = fondy.filter((x) => x.returns_as_of && x.scraping_date && (Date.now() - utc(x.scraping_date)) / 864e5 <= 7);
      const predbezne = tyden.filter((x) => utc(x.scraping_date) < konecnyOd(x.returns_as_of));
      if (predbezne.length) poplach.push({ co: `${predbezne.length} z ${tyden.length} fondů stažených za posledních 7 dní má výnosy k dni, který zdroj při stažení ještě nemusel mít konečný (stažení dřív než returns_as_of + 2 prac. dny 05:00 UTC) – výnosy z předběžného bodu; scraper nedodržel mez konečnosti (etf-astro scraper/vynosy_z_rady.py, mez_konecnosti)`, ukazka: ukazka(predbezne, (x) => `${x.isin} returns_as_of ${x.returns_as_of}, staženo ${utc(x.scraping_date).toISOString().slice(0, 16).replace('T', ' ')} UTC (konečný až od ${konecnyOd(x.returns_as_of).toISOString().slice(0, 16).replace('T', ' ')})`) });
    }
    const poNasazeni = nasazenoOd ? cerstve6.filter((x) => new Date(x.scraping_date) > new Date(nasazenoOd.getTime() + 3600e3)) : [];
    if (!nasazenoOd) varovani.push({ co: 'Kolo6b: výpočet výnosů z denní řady (etf-astro scraper/vynosy_z_rady.py) ještě není v main scraperu, nebo GitHub API neodpovědělo – kontroly returns_as_of jen částečně', ukazka: [] });
    if (poNasazeni.length >= 500) {
      const bezDne = poNasazeni.filter((x) => !x.returns_as_of);
      const tichaNahrada = bezDne.filter((x) => x.return_1y != null || x.return_ytd != null || x.return_1m != null);
      if (tichaNahrada.length) poplach.push({ co: `${tichaNahrada.length} fondů stažených novým scraperem má výnosy za období BEZ returns_as_of – tichá náhrada z HTML profilu (předběžná data)?`, ukazka: ukazka(tichaNahrada, (x) => `${x.isin} 1 r ${x.return_1y}`) });
      if (bezDne.length / poNasazeni.length > 0.05) poplach.push({ co: `${bezDne.length} z ${poNasazeni.length} fondů stažených novým scraperem (${(100 * bezDne.length / poNasazeni.length).toFixed(1)} %) nemá výnosy za období (returns_as_of = null, práh 5 %) – chart API zdroje selhává? Log scraperu: „VÝNOSY z denní řady“`, ukazka: ukazka(bezDne) });
    }

    // (a) ─────────────────────────────────────────────────────────────────────────────────────────────────
    const KOTVY6 = [['IE00B5BMR087', 'SXR8'], ['IE00BK5BQT80', 'VWCE'], ['IE00B4L5Y983', 'EUNL'], ['DE0002635307', 'EXSA'], ['IE00BKM4GZ66', 'EMIM'],
      ['IE00B53SZB19', 'SXRV'], ['IE00B4ND3602', 'SGLN'], ['FR0011550680', 'ESEA'], ['LU0290358497', 'XEON'], ['DE000A27Z304', 'BTCE']];
    const OBD = ['ytd', '1m', '3m', '6m', '1y', '3y', '5y'];
    const MES = { '1m': 1, '3m': 3, '6m': 6, '1y': 12, '3y': 36, '5y': 60 };
    const minusMes = (d, m) => { // d − m kalendářních měsíců, den oříznutý na konec měsíce (nezávislá implementace)
      const [r, mm, dd] = d.split('-').map(Number);
      const cil = new Date(Date.UTC(r, mm - 1 - m, 1, 12));
      const posl = new Date(Date.UTC(cil.getUTCFullYear(), cil.getUTCMonth() + 1, 0, 12)).getUTCDate();
      cil.setUTCDate(Math.min(dd, posl));
      return iso(cil);
    };
    const zac = (D, o) => (o === 'ytd' ? `${Number(D.slice(0, 4)) - 1}-12-31` : minusMes(D, MES[o]));
    const kurzy = new Map();
    const cnb = async (d) => { // Kč za 1 EUR platný k dni d (ČNB vrací poslední vyhlášený ≤ d; ověř záhlaví)
      if (kurzy.has(d)) return kurzy.get(d);
      const [r, m, dd] = d.split('-');
      const t = await fetch(`https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt?date=${dd}.${m}.${r}`, { headers: UA6 }).then((x) => (x.ok ? x.text() : ''));
      const hl = /^(\d{2})\.(\d{2})\.(\d{4})/.exec(t);
      const den = hl ? `${hl[3]}-${hl[2]}-${hl[1]}` : null;
      const radek = t.split('\n').find((l) => l.split('|')[3] === 'EUR');
      const k = den && den <= d && (poledne(d) - poledne(den)) / 864e5 <= 7 && radek ? Number(radek.split('|')[4].replace(',', '.')) / Number(radek.split('|')[2]) : null;
      kurzy.set(d, k);
      return k;
    };
    const db6 = await fetch(`${URL_DB}?select=isin,returns_as_of,return_inception,${OBD.map((o) => `return_${o},return_${o}_czk`).join(',')}&isin=in.(${KOTVY6.map((k) => k[0]).join(',')})`, H).then((r) => r.json());
    if (!Array.isArray(db6)) throw new Error('neplatná odpověď DB (kotvy kolo6b)');
    const vys6 = [], nejde6 = [], tabulka6 = [];
    for (const [isin, tk] of KOTVY6) {
      const f = db6.find((x) => x.isin === isin);
      if (!f?.returns_as_of) { nejde6.push(`${tk}: returns_as_of v DB chybí${nasazenoOd ? '' : ' (nový scraper ještě neběžel)'}`); continue; }
      const D = String(f.returns_as_of).slice(0, 10);
      try {
        const j = await fetch(`https://www.justetf.com/api/etfs/${isin}/performance-chart?locale=en&currency=EUR&valuesType=MARKET_VALUE&reduceData=false&includeDividends=true&features=DIVIDENDS&dateFrom=1990-01-01&dateTo=${iso(new Date(poledne(D).getTime() + 864e5))}`, { headers: UA6 })
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))));
        const rada = (j.series ?? []).map((p) => [p.date, Number(p.value?.raw)]).filter(([, v]) => v > 0);
        const bodK = (d) => { let r = null; for (const b of rada) { if (b[0] <= d) r = b; else break; } return r; };
        const e = bodK(D);
        if (!e || e[0] !== D) { nejde6.push(`${tk}: řada zdroje nemá bod ${D}`); continue; }
        const chyby = [];
        const porovnej = (o, s, dbV, kurzS, kurzE, mena) => {
          if (dbV == null || !s) return;
          const pomer = e[1] / s[1];
          const v = (pomer * (kurzS && kurzE ? kurzE / kurzS : 1) - 1) * 100;
          const tol = 0.05 + 100 * pomer * (0.005 / e[1] + 0.005 / s[1]);
          tabulka6.push(`${tk} ${o} ${mena}: DB ${fmt6(Number(dbV))} vs ${fmt6(v)}`);
          if (Math.abs(Number(dbV) - v) > tol) chyby.push(`${o} ${mena} DB ${fmt6(Number(dbV))} % vs. přepočet ${fmt6(v)} % (tolerance ${fmt6(tol)})`);
        };
        const kE = await cnb(D);
        for (const o of OBD) {
          const z = zac(D, o), s = bodK(z);
          if (!s || (poledne(z) - poledne(s[0])) / 864e5 > 7) continue; // fond tehdy neexistoval
          porovnej(o, s, f[`return_${o}`], null, null, 'EUR');
          const kS = await cnb(z);
          if (kS && kE) porovnej(o, s, f[`return_${o}_czk`], kS, kE, 'Kč');
          else nejde6.push(`${tk}: kurz ČNB k ${z} nebo ${D} nedostupný`);
        }
        porovnej('od vzniku', rada[0], f.return_inception, null, null, 'EUR');
        if (chyby.length) vys6.push(`${tk} k ${D}: ${chyby.join('; ')}`);
      } catch (e) { nejde6.push(`${tk}: justETF neodpověděl (${e.message})`); }
    }
    const TEXT6 = 'Výnosy za období v DB nesedí s nezávislým přepočtem z denních cen zdroje a kurzů ČNB ke dni returns_as_of';
    if (vys6.length >= 2) poplach.push({ co: `${TEXT6} – ${vys6.length} z ${KOTVY6.length} kotevních fondů (zdroj den po stažení přepsal = nebyl konečný, nebo chyba přepočtu ve scraperu etf-astro)`, ukazka: vys6 });
    else if (vys6.length === 1) varovani.push({ co: `${TEXT6} – 1 kotevní fond`, ukazka: vys6 });
    if (nejde6.length) varovani.push({ co: `Kontrolu kolo6b (a) nešlo u části kotevních fondů provést (${nejde6.length})`, ukazka: nejde6.slice(0, 6) });
    if (process.env.KOLO6B_TABULKA) console.log(tabulka6.join('\n'));

    // (c) ─────────────────────────────────────────────────────────────────────────────────────────────────
    if (sDnem.length >= 100) {
      const pocty = new Map();
      for (const x of sDnem) pocty.set(String(x.returns_as_of).slice(0, 10), (pocty.get(String(x.returns_as_of).slice(0, 10)) ?? 0) + 1);
      const vetsina = [...pocty.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? 1 : -1))[0][0];
      const jine = sDnem.filter((x) => String(x.returns_as_of).slice(0, 10) !== vetsina && (x.return_1y != null || x.return_ytd != null));
      // Nejdřív známé fondy se zpožděnou řadou, pak ostatní – max. 3 detaily (ISR, ať kontrola nezatěžuje web).
      const ZNAME = ['FR0011550680', 'FR0011871128', 'IE00B4JY5R22', 'XS2427355958'];
      // Na produkci jen fondy z pevné sady (ESEA FR0011550680 = známá zpožděná řada); ostatní by byly každý den jiné.
      const vzorekVse = [...jine.filter((x) => ZNAME.includes(x.isin)), ...jine.filter((x) => !ZNAME.includes(x.isin))];
      const vzorekProd = new Set(R.detaily(vzorekVse.map((x) => x.isin), 'Kolo 6b (c): den výnosů na detailu fondu s jiným dnem než většina'));
      const vzorek = vzorekVse.filter((x) => vzorekProd.has(x.isin)).slice(0, 3);
      const spatne = [], nenacteno = [];
      const sxr8 = await fetch(`${WEB_URL}/etf/IE00B5BMR087`).then((r) => (r.ok ? r.text() : '')).catch(() => '');
      const webNasazen = /data-vynosy-k=/.test(sxr8);
      if (webNasazen) {
        for (const x of vzorek) {
          const html = await fetch(`${WEB_URL}/etf/${x.isin}`).then((r) => (r.ok ? r.text() : '')).catch(() => '');
          if (!html) { nenacteno.push(x.isin); continue; }
          const m = /data-vynosy-k="(\d{4}-\d{2}-\d{2})"/.exec(html);
          // Detail se cachuje (ISR) – smí ukazovat starší den než DB (i čísla jsou pak z té doby), novější ne a bez data nikdy.
          // Kolo 7: fond se skrytými výnosy (NEOVERENE_VYNOSY → „—“, data-vynos-neovereny) „data k …“ záměrně nemá.
          if (!m && /data-vynos-neovereny/.test(html)) continue;
          if (!m) spatne.push(`${x.isin}: detail neukazuje den výnosů (DB ${x.returns_as_of}, většina ${vetsina})`);
          else if (m[1] > String(x.returns_as_of).slice(0, 10)) spatne.push(`${x.isin}: detail ukazuje ${m[1]}, DB má výnosy k ${x.returns_as_of}`);
        }
        const rows = await fetch(`${WEB_URL}/api/etf/screener`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
        if (Array.isArray(rows)) {
          const podle = new Map(rows.map((r) => [r.isin, r]));
          // Srovnávač se cachuje 24 h → jen fondy pozadu o víc než 3 pracovní dny (ty byly pozadu i včera).
          const pracDni = (a, b) => { let n = 0; const d = poledne(a); while (iso(d) < b && n < 400) { d.setUTCDate(d.getUTCDate() + 1); if (d.getUTCDay() % 6) n++; } return n; };
          for (const x of jine.filter((y) => pracDni(String(y.returns_as_of).slice(0, 10), vetsina) > 3)) {
            const r = podle.get(x.isin);
            if (r && (r.return_1y != null || r.return_ytd != null) && !r._dv) spatne.push(`${x.isin}: srovnávač nemá u fondu den výnosů (_dv), DB ${x.returns_as_of}, většina ${vetsina}`);
            if (spatne.length > 8) break;
          }
        } else nenacteno.push('/api/etf/screener');
        if (spatne.length) poplach.push({ co: `Web neukazuje u fondu s jiným dnem výnosů než většina (${vetsina}) jeho den – výnosy vypadají jako k „Data k …“ stránky`, ukazka: spatne.slice(0, 6) });
        if (nenacteno.length) varovani.push({ co: 'Kontrolu kolo6b (c) – den výnosů na webu – nešlo u části stránek provést', ukazka: nenacteno });
      } else if (nasazenoOd) {
        varovani.push({ co: 'Kolo6b (c): web ještě nemá značku dne výnosů (data-vynosy-k) – větev rada-web není nasazená', ukazka: [] });
      }
    }
  } catch (e) {
    varovani.push({ co: `Kontrolu kolo6b (výnosy z denní řady, returns_as_of) se nepodařilo provést: ${e.message}`, ukazka: [] });
  }
  // --- konec kolo6b rada ---
  // --- kolo6b seo obsah --- (kontrolní SEO audit 6b, 21. 10. 2026; pravidlo č. 1, bod 4 – každá oprava má kontrolu)
  // Před nasazením (produkce ještě nemá tabulku „Klíčová pravidla“ na /dane-z-etf) se nálezy hlásí jako varování.
  {
    const chyby = [];
    const upozorneni = [];
    try {
      const vem = async (cesta) => { try { const r = await fetch(`${WEB_URL}${cesta}`); return { status: r.status, html: (await r.text()).replace(/<!-- -->/g, '') }; } catch { return { status: 0, html: '' }; } };
      const dek = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      const titul = (h) => dek(h.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
      const popis = (h) => dek(h.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
      const ld = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch { return { __chyba: true }; } }).flatMap((x) => (Array.isArray(x) ? x : [x]));
      const text = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[  ]/g, ' ').replace(/\s+/g, ' ');
      const nasazeno = /data-sekce="klicova-cisla"/.test((await vem('/dane-z-etf')).html);

      // 1) Titulky ≤ 65 znaků, popisky 100–160, unikátní – všechny stránky ze sitemapy mimo detaily fondů.
      //    Dvojice /srovnani/x-vs-y spravuje jiná část kódu (src/app/srovnani/[pair]) → jen varování.
      const sm = (await vem('/sitemap.xml')).html;
      const cesty = [...sm.matchAll(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
      const stranky = R.cesty(cesty.filter((c) => !c.startsWith('/etf/')), 'SEO obsah (kolo 6b): stránky ze sitemapy');
      const headIsiny = cesty.filter((c) => c.startsWith('/etf/')).map((c) => c.slice(5));
      const nacteno = new Map();
      for (let i = 0; i < stranky.length; i += 6) {
        await Promise.all(stranky.slice(i, i + 6).map(async (c) => nacteno.set(c, await vem(c))));
      }
      const titulky = new Map(), popisky = new Map();
      const odkazyNa = new Map(); // cíl → Set(zdroj)
      for (const [c, { status, html }] of nacteno) {
        if (status !== 200) { chyby.push(`${c}: HTTP ${status}`); continue; }
        const t = titul(html), d = popis(html);
        const dvojice = /^\/srovnani\/[a-z0-9]+-vs-[a-z0-9]+$/.test(c) && c !== '/srovnani/vwce-vs-cspx';
        const cil = dvojice ? upozorneni : chyby;
        if (t.length > 65) cil.push(`${c}: titulek ${t.length} znaků („${t.slice(0, 70)}…“)`);
        if (d.length > 160 || d.length < 100) cil.push(`${c}: popisek ${d.length} znaků`);
        titulky.set(t, [...(titulky.get(t) ?? []), c]);
        popisky.set(d, [...(popisky.get(d) ?? []), c]);
        for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
          const k = m[1].replace(/\/$/, '') || '/';
          if (k !== c) odkazyNa.set(k, (odkazyNa.get(k) ?? new Set()).add(c));
        }
      }
      for (const [t, cs] of titulky) if (t && cs.length > 1) chyby.push(`Duplicitní titulek „${t.slice(0, 50)}“: ${cs.join(', ')}`);
      for (const [d, cs] of popisky) if (d && cs.length > 1) chyby.push(`Duplicitní popisek („${d.slice(0, 40)}…“): ${cs.join(', ')}`);

      // 2) Prolinkování: každý žebříček má odkaz z jiného žebříčku; „Největší ETF 2026“ z homepage/patičky;
      //    každý detail z hlavy (sitemapa) má aspoň jeden vnitřní odkaz (dřív 86–95 osiřelých).
      const zebricky = stranky.filter((c) => c.startsWith('/nejlepsi-etf/'));
      for (const z of zebricky) if (![...(odkazyNa.get(z) ?? [])].some((src) => src.startsWith('/nejlepsi-etf/'))) chyby.push(`${z}: žádný odkaz z jiného žebříčku („Související žebříčky“)`);
      if (!nacteno.get('/')?.html.includes('href="/nejlepsi-etf/nejlepsi-etf-2026"')) chyby.push('homepage bez odkazu na /nejlepsi-etf/nejlepsi-etf-2026');
      const osirele = headIsiny.filter((i) => !odkazyNa.has(`/etf/${i}`));
      if (osirele.length) chyby.push(`Osiřelé detaily fondů ze sitemapy (bez vnitřního odkazu): ${osirele.length} – ${osirele.slice(0, 8).join(', ')}`);

      // 3) Statické stránky: „Aktualizováno“ = datum úpravy TEXTU (src/lib/redakce.ts), Article s dateModified = totéž,
      //    image, autor, vydavatel; BreadcrumbList. Dřív „Aktualizováno {den dat fondů}“ – posouvalo se denně.
      const redakce = readFileSync('src/lib/redakce.ts', 'utf8');
      const upravy = Object.fromEntries([...redakce.matchAll(/'(\/[^']*)': \{ publikovano: '(\d{4}-\d{2}-\d{2})', upraveno: '(\d{4}-\d{2}-\d{2})' \}/g)].map((m) => [m[1], { pub: m[2], upr: m[3] }]));
      const staticke = [...(redakce.match(/STATICKE_CLANKY = \[([\s\S]*?)\]/)?.[1] ?? '').matchAll(/'(\/[^']+)'/g)].map((m) => m[1]);
      if (staticke.length < 10) chyby.push(`STATICKE_CLANKY v redakce.ts nenalezeny (${staticke.length})`);
      const MES = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];
      const isoZTextu = (s) => { const m = s.match(/(\d{1,2})\. (\S+) (\d{4})/); if (!m) return null; const mi = MES.indexOf(m[2]) + 1; return mi ? `${m[3]}-${String(mi).padStart(2, '0')}-${m[1].padStart(2, '0')}` : null; };
      for (const c of [...staticke, '/recenze/xtb', '/fire-kalkulacka', '/nouzova-rezerva']) {
        const h = nacteno.get(c)?.html ?? (await vem(c)).html;
        const ocek = upravy[c]?.upr ?? (c.startsWith('/recenze/') ? upravy['/recenze/*']?.upr : null);
        const a = ld(h).find((x) => x['@type'] === 'Article');
        if (!a) { if (staticke.includes(c) || c.startsWith('/recenze/')) chyby.push(`${c}: chybí Article`); }
        else {
          if (a.dateModified !== ocek) chyby.push(`${c}: Article dateModified ${a.dateModified} ≠ redakce.ts ${ocek}`);
          if (!a.image?.url || a.author?.name !== 'Tomáš Kostrhoun' || !a.publisher?.name) chyby.push(`${c}: Article bez image/autora/vydavatele`);
        }
        if (!ld(h).some((x) => x['@type'] === 'BreadcrumbList')) chyby.push(`${c}: chybí BreadcrumbList`);
        for (const m of text(h).matchAll(/Aktualizováno (\d{1,2}\. \S+ \d{4})/g)) {
          if (isoZTextu(m[1]) !== ocek) chyby.push(`${c}: „Aktualizováno ${m[1]}“ ≠ datum úpravy textu ${ocek} (den dat fondů?)`);
        }
      }
      for (const c of ['/co-rikaji-data', '/jak-dlouho-v-minusu', '/pravidlo-4-procent', '/sp500-nebo-cely-svet', '/kolik-vydelaly-etf']) {
        if (!ld(nacteno.get(c)?.html ?? '').some((x) => x['@type'] === 'BreadcrumbList')) chyby.push(`${c}: chybí BreadcrumbList`);
      }

      // 4) Jedno číslo počtu fondů v textech (zaokrouhleně „4 900+“), Organization bez „Jedinečná databáze“,
      //    Dataset s rozsahem dat a Place.
      // /srovnani má v hlavičce živé počítadlo řádků tabulky (mění se s filtrem) – to je přesné záměrně.
      for (const c of ['/', '/o-nas', '/zebricky', '/kalkulacky', '/infografiky', '/pruvodce', '/jak-zacit', '/portfolio-strategie', '/srovnani-brokeru', '/kalkulacka']) {
        const t = text(nacteno.get(c)?.html ?? '');
        const presne = [...t.matchAll(/\b(\d \d{3}) (?:ETF )?fondů/g)].map((m) => m[1]).filter((n) => Number(n.replace(' ', '')) > 3000);
        if (presne.length) chyby.push(`${c}: přesný počet fondů v textu (${[...new Set(presne)].join(', ')}) – má být zaokrouhleně „N+“`);
      }
      if (/Jedinečná databáze/.test(nacteno.get('/')?.html ?? '')) chyby.push('Organization schema: „Jedinečná databáze“ (nepodložený superlativ)');
      const ds = ld(nacteno.get('/srovnani')?.html ?? '').find((x) => x['@type'] === 'Dataset');
      if (!ds || !/^\d{4}-\d{2}-\d{2}\/\d{4}-\d{2}-\d{2}$/.test(ds.temporalCoverage ?? '') || ds.spatialCoverage?.['@type'] !== 'Place' || ds.distribution) chyby.push(`/srovnani: Dataset temporalCoverage „${ds?.temporalCoverage}“ / spatialCoverage / distribution`);

      // 5) GEO: „Klíčová čísla k …“ na pilířích; /kolik-vydelaly-etf počítá ze stejných dat jako /sp500-nebo-cely-svet
      //    (dřív napevno „čtyřnásobek, 8–9 % ročně, −50 %“ a roční výnosy v dolarech).
      for (const c of ['/kolik-vydelaly-etf', '/sp500-nebo-cely-svet', '/dane-z-etf', '/jaky-sp500-etf']) {
        const h = nacteno.get(c)?.html ?? '';
        if (!/data-sekce="klicova-cisla"/.test(h) || !/Klíčov(á čísla|á pravidla) k \d/.test(text(h))) chyby.push(`${c}: chybí „Klíčová čísla k [datum]“`);
      }
      const kv = text(nacteno.get('/kolik-vydelaly-etf')?.html ?? ''), sw = text(nacteno.get('/sp500-nebo-cely-svet')?.html ?? '');
      if (/čtyřnásob|8–9 % ročně/.test(kv)) chyby.push('/kolik-vydelaly-etf: staré napevno zapsané „čtyřnásobek / 8–9 % ročně“');
      const vtSw = sw.match(/Celý svět \(fond VT\) (\d+,\d) %/)?.[1];
      const vtKv = kv.match(/Akcie celého světa \(fond VT\) – roční zhodnocení od \d{1,2}\. 7\. 2008 (\d+,\d) %/)?.[1];
      // Obě stránky jsou z ISR cache (1 den) s „Klíčová čísla k …“: po synchronizaci indexů může mít každá data k jinému
      // dni (6. 11. 2026: 10,7 vs. 11,0 % – druhý den obě 10,7 %). Rozdíl jen u stejného dne = chyba.
      const denK = (x) => x.match(/Klíčová čísla k (\d{1,2}\.\s?\d{1,2}\.\s?\d{4})/)?.[1]?.replace(/\s/g, '');
      if (!vtSw || !vtKv) chyby.push(`/kolik-vydelaly-etf: roční zhodnocení VT ${vtKv} % / /sp500-nebo-cely-svet ${vtSw} % – nenačteno`);
      else if (vtSw !== vtKv && denK(kv) && denK(sw) && denK(kv) !== denK(sw)) varovani.push({ co: `VT ${vtKv} % (/kolik-vydelaly-etf k ${denK(kv)}) vs ${vtSw} % (/sp500-nebo-cely-svet k ${denK(sw)}) – stránky z cache z různých dnů, nesrovnávám`, ukazka: [] });
      else if (vtSw !== vtKv) chyby.push(`/kolik-vydelaly-etf: roční zhodnocení VT ${vtKv} % ≠ /sp500-nebo-cely-svet ${vtSw} %`);

      // 6) Inflace ČSÚ: poslední měsíc řady (src/lib/backtest/inflation.ts) – ČSÚ zveřejňuje kolem 10. dne následujícího měsíce.
      const infl = readFileSync('src/lib/backtest/inflation.ts', 'utf8');
      const posledni = [...infl.matchAll(/'(\d{4}-\d{2})': \d+(?:\.\d+)?,/g)].map((m) => m[1]).sort().at(-1);
      const dnes = new Date();
      const zpet = dnes.getUTCDate() >= 15 ? 1 : 2;
      const ocekavany = new Date(Date.UTC(dnes.getUTCFullYear(), dnes.getUTCMonth() - zpet, 1)).toISOString().slice(0, 7);
      if (!posledni || posledni < ocekavany) varovani.push({ co: `Inflace ČSÚ: poslední měsíc v inflation.ts ${posledni}, ČSÚ už zveřejnil ${ocekavany} – doplňte z CEN0101E („Bazický index (2015 = 100)“)`, ukazka: [] });

      // 7) Infografiky: bez „Nejvýkonnější“ (ZAMERNA), drobečky, bez zeleného tlačítka v hlavičce.
      const info = nacteno.get('/infografiky')?.html ?? '';
      if (/Nejvýkonnější/.test(text(info))) chyby.push('/infografiky: „Nejvýkonnější“ – proti rozhodnutí o širokých seznamech');
      if (!/Drobečková navigace/.test(info)) chyby.push('/infografiky: chybí drobečky');

      // 8) Žebříčky: gramatika, srozumitelný počet řádků, švýcarské fondy mimo karty, štítek typu ve smíšených.
      for (const z of zebricky) {
        const t = text(nacteno.get(z)?.html ?? '');
        if (/má ještě [234] další fondy/.test(t)) chyby.push(`${z}: „má ještě 2–4 další fondy“ (má být „mají“)`);
        if (/Ukazujeme \d[\d ]* největších z \d/.test(t)) chyby.push(`${z}: „Ukazujeme N největších z M … bez zajištěných“ – nesouhlasí s počtem řádků`);
        const karty = (nacteno.get(z)?.html ?? '').match(/data-sekce="vybrane"[\s\S]*?<\/section>/)?.[0] ?? '';
        // ETP švýcarských emitentů (21Shares – bitcoin) nejsou fondy → bitcoinový žebříček se nekontroluje.
        for (const m of karty.matchAll(/href="\/etf\/(CH[A-Z0-9]{10})"[\s\S]{0,600}?<\/a>/g)) if (!/\b(ETP|ETC|ETN)\b/.test(text(m[0]))) chyby.push(`${z}: švýcarský fond ${m[1]} na kartě`); // kolo 7: + ETC (XXBU)
      }
      const z2026 = nacteno.get('/nejlepsi-etf/nejlepsi-etf-2026')?.html ?? '';
      if (/Gold|XEON|Overnight/i.test(z2026) && !/>ETC<|>peněžní trh</.test(z2026)) chyby.push('/nejlepsi-etf/nejlepsi-etf-2026: řádky zlata/peněžního trhu bez štítku typu');
      if (/zajištění tlumí kurz dolaru/.test(nacteno.get('/nejlepsi-etf/nejlepsi-bitcoin-etf')?.html ?? '')) chyby.push('/nejlepsi-etf/nejlepsi-bitcoin-etf: „zajištění tlumí kurz dolaru“ místo krytí a úschovy');

      // 9) Texty článků (SEO audit 6b): fakta a formulace, které byly špatně.
      const T = (c) => text(nacteno.get(c)?.html ?? '');
      if (/VUAA \(Vanguard\) – nižší cena|Bezpečný default|bezpečná výchozí volba|Pozor na spread u malých částek/.test(T('/jaky-sp500-etf'))) chyby.push('/jaky-sp500-etf: stará tvrzení (VUAA nižší cena podílu / bezpečný default / spread u malých částek)');
      if (/zatím vždy zotavily|zlomek jedné akcie/.test(T('/jak-zacit'))) chyby.push('/jak-zacit: „zatím vždy zotavily“ / „zlomek jedné akcie“');
      if (!/pojištění dlouhodobé péče/.test(T('/dip'))) chyby.push('/dip: limit 48 000 Kč bez pojištění dlouhodobé péče (§ 15 odst. 6 ZDP)');
      if (/Akumulační tuto starost/.test(T('/pruvodce'))) chyby.push('/pruvodce: „Akumulační tuto starost odpadá“');
      if (/2010 nebo 2016/.test(T('/co-rikaji-data'))) chyby.push('/co-rikaji-data: stroj času „2000, 2010 nebo 2016“ – nesedí s nabídkou stroje času');
      if (/12 lety praxe ve financích/.test([...nacteno.values()].map((x) => x.html).join(' '))) chyby.push('Autor: „12 lety praxe ve financích“ vs. /metodika „12+ let v českém bankovnictví“');
      const kviz = [...new Set([...T('/vyber-etf').matchAll(/Backtest \S+ \d{4} – (\d{1,2}\. \d{1,2}\. \d{4})/g)].map((m) => m[1]))];
      if (kviz.length > 1) chyby.push(`/vyber-etf: různé konce backtestu v kvízu (${kviz.join(', ')})`);
      for (const c of ['/dane-z-etf', '/jaky-sp500-etf', '/pruvodce', '/sp500-nebo-cely-svet']) if (/lucide-arrow-right[^"]*group-open:rotate-90/.test(nacteno.get(c)?.html ?? '')) chyby.push(`${c}: FAQ s šipkou doprava (má být dolů)`);
      for (const c of stranky) { const m = dek(T(c)).match(/„[^“”"]{1,60}"/); if (m) { chyby.push(`${c}: rovná uvozovka „…" (${m[0].slice(0, 40)})`); break; } }

      if (chyby.length) (nasazeno ? poplach : varovani).push({ co: `SEO obsah (kolo 6b)${nasazeno ? '' : ' – produkce ještě bez oprav (před nasazením)'}: ${chyby.length} nálezů`, ukazka: chyby.slice(0, 15) });
      if (upozorneni.length) varovani.push({ co: `SEO obsah (kolo 6b): dvojice srovnání s titulkem > 65 / popiskem mimo 100–160 znaků: ${upozorneni.length} (src/app/srovnani/[pair])`, ukazka: upozorneni.slice(0, 5) });
    } catch (e) {
      varovani.push({ co: `Kontrolu SEO obsahu (kolo 6b) se nepodařilo provést: ${e.message}`, ukazka: chyby.slice(0, 5) });
    }
  }
  // --- konec kolo6b seo obsah ---
  // --- kolo7 data --- (kontrolní kolo 7, 22. 10. 2026; pravidlo č. 1, bod 4 – každá oprava má kontrolu)
  // Před nasazením (produkce ještě nemá data-slozeni-k na detailu fondu) se živé nálezy hlásí jen jako varování;
  // statické kontroly zdrojáku platí vždy.
  {
    const chyby = [];
    const staticke = [];
    let nasazeno7 = false;
    try {
      const H7 = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
      const vem = async (cesta) => { try { const r = await fetch(`${WEB_URL}${cesta}`); return { status: r.status, html: (await r.text()).replace(/<!-- -->/g, '') }; } catch { return { status: 0, html: '' }; } };
      const text = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
        .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/[  ]/g, ' ').replace(/\s+/g, ' ');
      const souborySrc = (d) => readdirSync(d).flatMap((n) => { const p = `${d}/${n}`; return statSync(p).isDirectory() ? souborySrc(p) : /\.(tsx?|mjs)$/.test(n) ? [p] : []; });
      const zdroje = souborySrc('src').map((p) => [p, readFileSync(p, 'utf8')]);
      const isoZCs = (s) => { const m = /(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})/.exec(s ?? ''); return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null; };
      const denStranky = (h) => isoZCs(h.match(/Data k <strong[^>]*>([^<]+)<\/strong>/)?.[1]);

      // 1) STATICKY: tichý návrat ke dnešku – getDataDate(fallback) jen v sitemapě (tam ho spravuje SEO). Jinde getDataDatum()
      //    a při null datum/dateModified vynechat (dřív 14 stránek tvrdilo „dnes“, když se den dat nenačetl).
      for (const [p, t] of zdroje) {
        if (p.endsWith('src/app/sitemap.ts') || p.endsWith('src/lib/etf-data.ts')) continue;
        t.split('\n').forEach((l, i) => { if (/getDataDate\(\s*[^)\s]/.test(l) && !/^\s*(\/\/|\*)/.test(l)) staticke.push(`${p}:${i + 1}: getDataDate(…) – použijte getDataDatum() a při null datum neukazujte`); });
      }
      // 2) STATICKY: štítek „sídlo CH“ nesmí dostat ETC/ETP/ETN (XXBU = Xtrackers Galaxy Physical Bitcoin ETC Securities).
      const nf = readFileSync('src/lib/nazevFondu.ts', 'utf8').match(/export function jeSvycarskyFond[\s\S]*?!\/(.+?)\/i\.test/)?.[1];
      if (!nf) staticke.push('src/lib/nazevFondu.ts: jeSvycarskyFond – nelze najít výjimku pro ETC/ETP/ETN');
      else for (const n of ['Xtrackers Galaxy Physical Bitcoin ETC Securities', '21shares Bitcoin ETP', 'Hashdex Crypto Momentum Factor ETN'])
        if (!new RegExp(nf, 'i').test(n)) staticke.push(`jeSvycarskyFond: „${n}“ by dostal štítek „sídlo CH“`);
      // 3) STATICKY: „návrat“ vždy s výchozím bodem („od dna“ / „od vrcholu“) – backtest počítá od dna, krize v článku od vrcholu.
      for (const [p, t] of zdroje) t.split('\n').forEach((l, i) => {
        if (/[Nn]ávrat(em)? (za|do měsíce|na vrchol za|\d+ měsíc)|zotavení za \d/.test(l) && !/od (dna|vrcholu)/.test(l) && !/^\s*(\/\/|\*)/.test(l)) staticke.push(`${p}:${i + 1}: „návrat …“ bez „od dna/od vrcholu“`);
      });

      // Fondy pro živé kontroly z DB.
      const db = await fetch(`${URL_DB}?select=isin,name,primary_ticker,legal_structure,description_en,scraping_date,returns_as_of,return_1m,return_3m,return_6m,return_ytd,return_1y,return_3y,return_5y,holdings_as_of&order=fund_size_numeric.desc.nullslast&limit=1000`, H7).then((r) => r.json());
      if (!Array.isArray(db)) throw new Error('neplatná odpověď DB (kolo7)');
      const cerstvy = (x) => (Date.now() - new Date(x.scraping_date)) / 864e5 <= 3;
      const bezVynosu = db.filter((x) => cerstvy(x) && !x.returns_as_of && ['return_1m', 'return_3m', 'return_6m', 'return_ytd', 'return_1y', 'return_3y', 'return_5y'].every((k) => x[k] == null)).slice(0, 3);
      const dluhove = db.filter((x) => cerstvy(x) && !/\bUCITS\b/i.test(x.name ?? '') && (/\b(ETC|ETN|ETP)\b/.test(x.name ?? '') || /\bThe (ETC|ETN|ETP)'s\b/.test(x.description_en ?? '')) && /^UCITS\b/.test(x.legal_structure ?? '')).slice(0, 3);
      const sxr8 = (await fetch(`${URL_DB}?select=isin,holdings_as_of&isin=in.(IE00B5BMR087,IE00BK5BQT80)`, H7).then((r) => r.json()));
      const slozeniDb = new Map((Array.isArray(sxr8) ? sxr8 : []).map((x) => [x.isin, x.holdings_as_of ? String(x.holdings_as_of).slice(0, 10) : '']));

      const detailSxr8 = await vem('/etf/IE00B5BMR087');
      nasazeno7 = /data-slozeni-k=/.test(detailSxr8.html);

      // 4) Fond bez jediného výnosu (BTCW 22. 10. 2026) nemá nad samými „—“ „data k …“ (hero data-vynosy-k).
      for (const f of bezVynosu.filter((x) => R.detaily([x.isin], 'Kolo 7 (4): detail fondu bez jediného výnosu (vybraný z DB)').length)) {
        const h = (await vem(`/etf/${f.isin}`)).html;
        if (/data-vynosy-k=/.test(h)) chyby.push(`/etf/${f.isin} (${f.primary_ticker}): fond bez výnosů má „data k …“ nad „—“`);
      }
      // 5) Porovnání: den výnosů fondu (data-vynosy-k) jen STARŠÍ než „Data k“ stránky; bez výnosů žádné datum.
      //    Právní struktura: ETC/ETN/ETP nejsou UCITS (BRNT, BITC, BTCW měly „UCITS“).
      const porIsiny = [...dluhove.map((x) => x.isin), 'IE00B5BMR087'].slice(0, 4);
      const porBez = [...bezVynosu.map((x) => x.isin).slice(0, 2), 'IE00B5BMR087', 'IE00BK5BQT80'];
      for (const isiny of [porIsiny, porBez]) {
        const h = (await vem(`/srovnani/porovnani?isins=${isiny.join(',')}`)).html;
        const den = denStranky(h);
        for (const m of h.matchAll(/data-vynosy-k="(\d{4}-\d{2}-\d{2})"/g)) if (den && m[1] >= den) chyby.push(`/srovnani/porovnani?isins=${isiny.join(',')}: „výnosy k ${m[1]}“ není starší než Data k ${den} (věta o zpoždění by lhala)`);
        if (isiny === porIsiny && dluhove.length) {
          const t = text(h);
          const radek = t.match(/Právní struktura (.*?) Měna fondu/)?.[1] ?? '';
          const ucits = (radek.match(/\bUCITS\b/g) ?? []).length;
          if (!radek) chyby.push('/srovnani/porovnani: chybí řádek „Právní struktura“');
          else if (ucits > isiny.length - dluhove.length) chyby.push(`/srovnani/porovnani: ETC/ETN/ETP s „UCITS“ v právní struktuře („${radek.slice(0, 120)}“)`);
          if (/stejný fond, jiná burza/.test(t)) chyby.push('/srovnani/porovnani: u ETC/ETN „stejný fond“ (má být „stejný produkt“)');
        }
      }
      // 6) Žebříčky: „výnosy k …“ (vynosyK) jen starší než den stránky; ETC/ETP/ETN švýcarských emitentů bez štítku „sídlo CH“.
      for (const z of ['/nejlepsi-etf/nejlepsi-bitcoin-etf', '/nejlepsi-etf/nejlepsi-krypto-etf', '/nejlepsi-etf/nejlepsi-etf-2026']) {
        const r = await vem(z);
        if (r.status !== 200) continue;
        const h = r.html.replace(/\\"/g, '"');
        const den = denStranky(r.html);
        for (const m of h.matchAll(/"isin":"([A-Z0-9]{12})","nazev":"([^"]*)"[^{}]*?(?:\{[^{}]*\}[^{}]*?)*?"vynosyK":"([^"]+)"/g)) {
          const iso = isoZCs(m[3]);
          if (den && iso && iso >= den) chyby.push(`${z}: ${m[1]} „výnosy k ${m[3]}“ není starší než Data k ${den}`);
        }
        for (const m of h.matchAll(/"isin":"(CH[A-Z0-9]{10})","nazev":"([^"]*\b(?:ETC|ETP|ETN)\b[^"]*)"[^{}]*?(?:\{[^{}]*\}[^{}]*?)*?"svycarsky":true/g)) chyby.push(`${z}: ${m[1]} (${m[2].slice(0, 40)}) má štítek „sídlo CH“, ale je to ETC/ETP/ETN`);
      }
      // 7) Datum složení = holdings_as_of (ne den stažení): detail SXR8, žebříček S&P 500, článek S&P 500 vs. svět.
      const sk = detailSxr8.html.match(/data-slozeni-k="([^"]*)"/)?.[1];
      if (sk === undefined) chyby.push('/etf/IE00B5BMR087: u složení chybí datum (data-slozeni-k)');
      // Detail je předgenerovaný při buildu s platností 30 dní (od 1. 11. 2026): starší datum než DB = stránka z buildu před
      // novějším stažením složení (2. 11.: 31. 8. vs. 30. 9.) – datované, ne chyba. Chyba je NOVĚJŠÍ datum než DB (= den
      // stažení místo holdings_as_of, původní bug) nebo nesmysl.
      else if (sk !== (slozeniDb.get('IE00B5BMR087') ?? '')) {
        const db = slozeniDb.get('IE00B5BMR087') ?? '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(sk) && db && sk < db) varovani.push({ co: `/etf/IE00B5BMR087: složení k „${sk}“, DB už „${db}“ – detail z buildu před stažením nového složení (obnoví ho další nasazení)`, ukazka: [] });
        else chyby.push(`/etf/IE00B5BMR087: složení k „${sk}“ ≠ DB holdings_as_of „${db}“`);
      }
      const zsp = (await vem('/nejlepsi-etf/nejlepsi-sp500-etf')).html;
      if (/Rozložení podle sektorů|Geografické rozložení|Největší pozice ve fondu/.test(zsp) && !/data-slozeni-k=/.test(zsp)) chyby.push('/nejlepsi-etf/nejlepsi-sp500-etf: rozložení složení bez data (data-slozeni-k)');
      const sw = (await vem('/sp500-nebo-cely-svet')).html;
      const swSk = sw.match(/data-slozeni-k="([^"]*)"/)?.[1];
      const swDb = ['IE00B5BMR087', 'IE00BK5BQT80'].map((i) => slozeniDb.get(i) ?? '').join(',');
      if (/Co vlastně porovnáváme/.test(sw) && swSk !== swDb) chyby.push(`/sp500-nebo-cely-svet: složení fondů k „${swSk}“ ≠ DB holdings_as_of „${swDb}“ (dřív den stažení)`);

      // 8) /sp500-nebo-cely-svet: jedno číslo S&P 500 v Kč od 2008, kolísavost z měsíčních výnosů (= backtest),
      //    skutečný max. propad (= /kolik-vydelaly-etf), mezery a formáty.
      const t = text(sw);
      const kcKlic = t.match(/S&P 500 \(fond SPY\) – ročně v Kč od 7\/2008 (\d+,\d) %/)?.[1];
      const kcKoruna = t.match(/vydělal S&P 500 v dolarech -?\d+,\d % ročně, v korunách (\d+,\d) %/)?.[1];
      if (!kcKlic || !kcKoruna || kcKlic !== kcKoruna) chyby.push(`/sp500-nebo-cely-svet: S&P 500 v Kč od 2008 jednou ${kcKlic} %, jinde ${kcKoruna} %`);
      if (/denních (log-)?výnosů/.test(t)) chyby.push('/sp500-nebo-cely-svet: kolísavost z denních výnosů (web jinde z měsíčních)');
      const volClanek = Number((t.match(/kolísal S&P 500 v korunách o (\d+,\d) %/)?.[1] ?? '').replace(',', '.'));
      try {
        const dnes = new Date().toISOString().slice(0, 10);
        const bt = await fetch(`${WEB_URL}/api/backtest/simulate`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ portfolio: [{ isin: 'sp500', name: 'sp500', weight: 1, ter: 0, indexCode: 'sp500' }], startDate: '2008-07-01', endDate: dnes, initialAmount: 100000, rebalancingStrategy: 'yearly', currency: 'CZK' }) }).then((r) => r.json());
        const volBt = 100 * Number(bt?.summary?.standardDeviation);
        if (!Number.isFinite(volClanek) || !Number.isFinite(volBt) || Math.abs(volClanek - volBt) > 0.15) chyby.push(`/sp500-nebo-cely-svet: kolísavost S&P 500 ${volClanek} % ≠ backtest ${volBt.toFixed(2)} %`);
        const cagrBt = 100 * Number(bt?.summary?.cagr);
        // Backtest počítá s daty k dnešku, článek je z ISR cache (1 den) s „Klíčová čísla k …“ (7. 11. 2026: 14,4 vs. 14,19 %
        // s daty o den starší). Konec dat backtestu = začátek + obdobiLet; liší-li se od dne článku o víc než 1 den → varování.
        const konecBt = new Date(Date.parse('2008-07-01') + Number(bt?.summary?.obdobiLet) * 365.25 * 864e5);
        const denCl = (t.match(/Klíčová čísla k (\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})/) ?? []).slice(1);
        const odchylkaDni = denCl.length === 3 ? Math.abs(Date.UTC(+denCl[2], +denCl[1] - 1, +denCl[0]) - konecBt.getTime()) / 864e5 : NaN;
        if (kcKlic && Math.abs(Number(kcKlic.replace(',', '.')) - cagrBt) > 0.06) {
          if (odchylkaDni > 1.5) varovani.push({ co: `/sp500-nebo-cely-svet: S&P 500 od 2008 ${kcKlic} % vs backtest ${cagrBt.toFixed(2)} % – článek k ${denCl.join('. ')}, backtest k ${konecBt.toISOString().slice(0, 10)}, nesrovnávám`, ukazka: [] });
          else chyby.push(`/sp500-nebo-cely-svet: S&P 500 od 2008 ${kcKlic} % ≠ backtest ${cagrBt.toFixed(2)} %`);
        }
      } catch (e) { varovani.push({ co: `kolo7: backtest pro kontrolu kolísavosti nešel zavolat: ${e.message}`, ukazka: [] }); }
      const propadClanek = sw.match(/data-max-propad-sp-kc="(-?[\d.]+)"/)?.[1];
      const propadKv = text((await vem('/kolik-vydelaly-etf')).html).match(/Nejhlubší propad v Kč (−|-)(\d+) %/)?.[2];
      if (!propadClanek) chyby.push('/sp500-nebo-cely-svet: chybí věta o nejhlubším propadu S&P 500 v Kč (data-max-propad-sp-kc)');
      else if (propadKv && String(Math.round(Math.abs(Number(propadClanek)))) !== propadKv) chyby.push(`/sp500-nebo-cely-svet: nejhlubší propad S&P 500 v Kč ${propadClanek} % ≠ /kolik-vydelaly-etf −${propadKv} %`);
      for (const [re, co] of [[/Kč\.(Jenže|A) /, 'chybí mezera „Kč.Jenže“'], [/ročně\.Tohle/, 'chybí mezera „ročně.Tohle“'], [/data k dnešku/, '„data k dnešku“ místo data'],
        [/\d mld €/, '„mld €“ místo „mld. €“'], [/v období (leden|únor|březen|duben|květen|červen|červenec|srpen|září|říjen|listopad|prosinec) \d{4}/, '„v období prosinec 2014“ místo „v prosinci 2014“']])
        if (re.test(t)) chyby.push(`/sp500-nebo-cely-svet: ${co}`);
    } catch (e) {
      varovani.push({ co: `Kontrolu kolo7 data se nepodařilo provést: ${e.message}`, ukazka: chyby.slice(0, 5) });
    }
    if (staticke.length) poplach.push({ co: `Kód (kolo 7): ${staticke.length} nálezů – tichý návrat ke dnešku / štítek CH / „návrat“ bez výchozího bodu`, ukazka: staticke.slice(0, 10) });
    if (chyby.length) {
      (nasazeno7 ? poplach : varovani).push({ co: `Data a datumy (kolo 7)${nasazeno7 ? '' : ' – produkce ještě bez oprav (před nasazením)'}: ${chyby.length} nálezů`, ukazka: chyby.slice(0, 15) });
    }
  }
  // --- konec kolo7 data ---

  // ── GA jen produkce (22. 10. 2026) ──
  // Testy na localhostu a náhledy *.vercel.app se počítaly v GA jako noví uživatelé (19. 10.: 120 ze 146).
  // Komponenta smí načíst GA jen na ostré doméně – statická kontrola zdrojáku.
  {
    const src = readFileSync(new URL('../src/components/GoogleAnalytics.tsx', import.meta.url), 'utf8');
    if (!/GA_HOSTY\.includes\(window\.location\.hostname\)/.test(src) || !/if \(!ostry\) return null/.test(src))
      poplach.push({ co: 'GoogleAnalytics.tsx nehlídá doménu – testy a náhledy by se počítaly do návštěvnosti', ukazka: [] });
  }

  // --- kolo7 podezrele --- (kontrolní kolo 7, 22. 10. 2026; pravidlo č. 1, body 4–5: podezřelé číslo se prověří hned,
  // každá chyba = oprava + kontrola). Čísla, která recenzenti našli a nezávisle jsme ověřili jako chyby ZDROJE dat:
  //  A) skok v denní řadě zdroje, který burza nemá (HASH/HAMO 22. 9. 2026 −96 % → web 1R −97,8 %; pákové VIXL, 3NGL,
  //     3LAA… s body v miliardách €). Kandidáti = extrémní výnosy; skok = ×3 za den (bez páky) / ×10 (páka).
  //  B) produkty bez tržní kotvy (fyzické zlato, bitcoin): zašuměná řada zdroje (EWG2, TMGD: výnos k jednomu dni o 1–3
  //     p. b. vedle). Medián skupiny ani pravidlo „1,5 p. b. od trhu“ to nechytí (rozptyl časování ocenění ve skupině
  //     zlata až 2,2 p. b., u bitcoinu až 4 p. b. – ověřeno na 130 dnech). Rozhoduje VLASTNÍ šum řady proti mediánu
  //     denních změn skupiny (60 prac. dní; EWG2 1,30 %, TMGD 1,14 %, ostatní zlato ≤ 0,78 %, bitcoin ≤ 1,00 %)
  //     A ZÁROVEŇ výnos 1M i 1R proti vlastní burze (EUR) vedle o > 1,5 p. b. stejným směrem (VBTC: +1,7 / −0,4 → ne).
  //  C) chybějící dividenda distribuční třídy u zdroje (I50D ex 15. 10., XISP ex 19. 8. 2026; Yahoo je má) → výnos
  //     s reinvesticí nižší (I50D 19,55 % vs. I500 20,23 %). Zdroj dividendy doplňuje se zpožděním – 22. 10. 2026
  //     chyběla u 11 ze 149 největších distribučních fondů (většinou iShares ex 15. 10.).
  //  D) dávka scraperu neuložená (BTCN 22. 10.: upload po 5 fondech, jedno přetečení numeric(8,4) shodí celou dávku –
  //     od 21. 10. denně 25 fondů z ISIN.csv bez aktualizace).
  //  E) velký čerstvý fond bez returns_as_of (BTCW 1,4 mld. €: díra s cenou 0 u zdroje v roce 2021 → všechny výnosy null).
  // Ověřené chyby jsou v src/lib/vynosNeovereny.ts (NEOVERENE_VYNOSY) a web je ukazuje jako „—“. NOVÝ případ mimo seznam =
  // POPLACH (A, B), u dividend varování (zdroj je doplňuje sám, poplach až když chybí > 21 dní). Položka seznamu, která už
  // neplatí (zdroj chybu opravil / scraper vrací null), = varování „smazat ze seznamu“.
  {
    const hlav = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
    const UA = { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; etfpruvodce.cz kontrola dat)', Accept: 'application/json' } };
    const SUF = { XETRA: '.DE', 'Stuttgart Stock Exchange': '.SG', 'Borsa Italiana': '.MI', 'Euronext Paris': '.PA', 'Euronext Amsterdam': '.AS', 'SIX Swiss Exchange': '.SW', 'London Stock Exchange': '.L' };
    const BURZY = Array.from({ length: 10 }, (_, i) => [`exchange_${i + 1}_name`, `exchange_${i + 1}_ticker`, `exchange_${i + 1}_currency`]).flat();
    const zpet7 = (d, mes) => { const [r, m, den] = d.split('-').map(Number); const t = r * 12 + (m - 1) - mes, nr = Math.floor(t / 12), nm = t - nr * 12; const posl = new Date(Date.UTC(nr, nm + 1, 0)).getUTCDate(); return `${nr}-${String(nm + 1).padStart(2, '0')}-${String(Math.min(den, posl)).padStart(2, '0')}`; };
    const bod7 = (s, d) => { let r = null; for (const b of s) { if (b[0] <= d) r = b; else break; } return r; };
    const med7 = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length ? (s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : null; };
    const dnu7 = (a, b) => Math.abs(new Date(a) - new Date(b)) / 864e5;
    const radaZdroje = async (isin, od, doD, div = false) => {
      const j = await fetch(`https://www.justetf.com/api/etfs/${isin}/performance-chart?locale=en&currency=EUR&valuesType=MARKET_VALUE&reduceData=false&includeDividends=${div}&features=DIVIDENDS&dateFrom=${od}&dateTo=${doD}`, UA)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`justETF HTTP ${r.status}`))));
      return { rada: (j.series ?? []).map((p) => [p.date, Number(p.value?.raw)]).filter((p) => Number.isFinite(p[1])), dividendy: (j.features?.DIVIDENDS ?? []).map((d) => d.date) };
    };
    // Burzovní řada (Yahoo): jen dny se skutečným obchodem (objem > 0) – jinak Yahoo nese poslední cenu dál (HASH).
    const yahoo7 = async (sym, rozsah = '5y', div = false) => {
      const j = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=${rozsah}&interval=1d${div ? '&events=div' : ''}`, UA).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      const res = j?.chart?.result?.[0];
      if (!res?.timestamp) return null;
      const off = res.meta.gmtoffset ?? 0, q = res.indicators.quote[0];
      const adj = res.indicators.adjclose?.[0]?.adjclose ?? q.close;
      const rada = res.timestamp.map((t, i) => [new Date((t + off) * 1000).toISOString().slice(0, 10), q.close[i], adj[i], q.volume?.[i]]).filter((p) => p[1] > 0 && p[3] > 0);
      const dividendy = Object.values(res.events?.dividends ?? {}).map((d) => ({ den: new Date(d.date * 1000).toISOString().slice(0, 10), castka: d.amount }));
      return { mena: res.meta.currency, rada, dividendy };
    };
    const burzyFondu = (f, jenEur) => {
      const out = [];
      for (let i = 1; i <= 10; i++) {
        const n = f[`exchange_${i}_name`], t = f[`exchange_${i}_ticker`];
        if (SUF[n] && t && t !== '-' && (!jenEur || f[`exchange_${i}_currency`] === 'EUR')) out.push(t + SUF[n]);
      }
      return [...new Set(out)];
    };
    const prvniBurza = async (f, jenEur, rozsah, div) => { for (const s of burzyFondu(f, jenEur)) { const y = await yahoo7(s, rozsah, div); if (y && y.rada.length > 40) return { sym: s, ...y }; } return null; };
    const konecVynosu = (f) => (f.returns_as_of ? String(f.returns_as_of).slice(0, 10) : String(f.scraping_date ?? '').slice(0, 10));
    const nalezy = { A: [], B: [], C: [], Cstare: [], D: [], E: [], smazat: [], nejde: [], web: [] };
    try {
      // Seznam ověřených chyb (jeden fond = jeden řádek v src/lib/vynosNeovereny.ts).
      const zdrojSeznamu = readFileSync('src/lib/vynosNeovereny.ts', 'utf8');
      const seznam = new Map([...zdrojSeznamu.matchAll(/'([A-Z]{2}[A-Z0-9]{10})': \{ ticker: '([^']*)', druh: '(skok|sum|dividenda|burza)'(?:, den: '(\d{4}-\d{2}-\d{2})')?/g)]
        .map((m) => [m[1], { ticker: m[2], druh: m[3], den: m[4] }]));
      if (seznam.size < 5) throw new Error(`seznam NEOVERENE_VYNOSY ve vynosNeovereny.ts nenalezen (${seznam.size} položek)`);
      const sloupce = `isin,name,primary_ticker,is_leveraged,fund_size_numeric,investment_focus,index_name,distribution_policy,scraping_date,returns_as_of,return_1m,return_3m,return_6m,return_ytd,return_1y,return_3y,return_5y,${BURZY.join(',')}`;

      // A) Extrémní výnosy × skok v řadě zdroje, který burza nemá.
      const extremy = await fetch(`${URL_DB}?select=${sloupce}&scraping_date=gte.${new Date(Date.now() - 14 * 864e5).toISOString()}&or=(return_1y.lt.-80,return_1y.gt.300,return_3y.lt.-85,return_3y.gt.500,return_1m.lt.-50,return_1m.gt.100)`, hlav).then((r) => r.json());
      if (!Array.isArray(extremy)) throw new Error('DB extrémy');
      const MES7 = { '1m': 1, '3m': 3, '6m': 6, '1y': 12, '3y': 36, '5y': 60 };
      const probrane = new Set();
      for (const f of [...extremy, ...(await fetch(`${URL_DB}?select=${sloupce}&isin=in.(${[...seznam].filter(([, z]) => z.druh === 'skok').map(([i]) => i).join(',')})`, hlav).then((r) => r.json()))]) {
        if (probrane.has(f.isin)) continue;
        probrane.add(f.isin);
        const D = konecVynosu(f);
        const obdobi = Object.keys(MES7).filter((o) => f[`return_${o}`] != null);
        if (f.return_ytd != null) obdobi.push('ytd');
        const vSeznamu = seznam.get(f.isin)?.druh === 'skok';
        if (!obdobi.length) { if (vSeznamu) nalezy.smazat.push(`${f.isin} ${f.primary_ticker ?? ''} (skok): výnosy za období už null – scraper je odfiltroval`); continue; }
        const zac = (o) => (o === 'ytd' ? `${Number(D.slice(0, 4)) - 1}-12-31` : zpet7(D, MES7[o]));
        const nejdal = obdobi.map(zac).sort()[0];
        let r;
        try { r = (await radaZdroje(f.isin, zpet7(nejdal, 0).slice(0, 8) + '01', D)).rada; } catch (e) { nalezy.nejde.push(`${f.isin}: ${e.message}`); continue; }
        const prah = f.is_leveraged ? 10 : 3;
        const skoky = [];
        for (let k = 1; k < r.length; k++) {
          const a = r[k - 1][1], b = r[k][1];
          if (r[k][0] < nejdal) continue;
          if (a <= 0 || b <= 0 ? a !== b : b / a > prah || b / a < 1 / prah) skoky.push({ den: r[k][0], a, b });
        }
        if (!skoky.length) { if (vSeznamu) nalezy.smazat.push(`${f.isin} ${f.primary_ticker ?? ''} (skok): v řadě zdroje za období s výnosem už skok není`); continue; }
        // Burza: když tentýž den (±5 dní) skočila podobně (konsolidace na obou), je skok skutečný. Rozhoduje PRVNÍ
        // skok, který burza nemá a přes který vede aspoň jeden výnos na webu.
        const y = await prvniBurza(f, false, '5y');
        let nalez = null;
        for (const sk of skoky) {
          const zasazena = obdobi.filter((o) => zac(o) < sk.den).map((o) => `${o} ${Number(f[`return_${o}`]).toFixed(1)} %`);
          if (!zasazena.length) continue;
          let burzaText = 'burza nedostupná', realny = false;
          if (y) {
            const pred = y.rada.filter((p) => p[0] < sk.den).at(-1), po = y.rada.find((p) => p[0] >= sk.den);
            if (!pred || !po || dnu7(po[0], sk.den) > 5) burzaText = `${y.sym}: bez obchodu kolem ${sk.den} (poslední ${y.rada.at(-1)?.[0]})`;
            else {
              const xb = po[1] / pred[1], xz = sk.b / sk.a;
              realny = xz > 0 && Number.isFinite(xz) && xb / xz < 1.5 && xb / xz > 1 / 1.5;
              burzaText = `${y.sym} ${pred[0]}→${po[0]} ×${xb.toFixed(2)}`;
            }
          }
          if (!realny) { nalez = `${f.isin} ${f.primary_ticker ?? ''}${f.is_leveraged ? ' (páka)' : ''}: zdroj ${sk.den} ${sk.a} → ${sk.b}, ${burzaText}; na webu ${zasazena.join(', ')}`; break; }
        }
        if (!nalez) { if (vSeznamu) nalezy.smazat.push(`${f.isin} ${f.primary_ticker ?? ''} (skok): skoky v řadě má i burza nebo už neovlivní výnosy na webu`); continue; }
        if (!seznam.has(f.isin)) nalezy.A.push(nalez);
      }

      // B) Bez tržní kotvy: fyzické zlato (EUR, nezajištěné) a fyzický bitcoin – vlastní šum řady × výnos proti burze.
      const kandidati = await fetch(`${URL_DB}?select=${sloupce}&scraping_date=gte.${new Date(Date.now() - 14 * 864e5).toISOString()}&is_leveraged=eq.false&or=(investment_focus.ilike.*Precious*,investment_focus.ilike.*Cryptocurrenc*)`, hlav).then((r) => r.json());
      if (!Array.isArray(kandidati)) throw new Error('DB skupiny zlata/bitcoinu');
      const skupiny = {
        zlato: kandidati.filter((f) => f.investment_focus === 'Precious Metals, Gold' && !/hedg|\bEAH\b|\bH-|future|yield|bitcoin|\bshort\b/i.test(f.name ?? '')),
        bitcoin: kandidati.filter((f) => /^bitcoin$/i.test(String(f.index_name ?? '').trim()) && !/gold|short|basket|macro|cash/i.test(f.name ?? '')),
      };
      const dnes7 = new Date().toISOString().slice(0, 10);
      for (const [jm, clenove] of Object.entries(skupiny)) {
        if (clenove.length < 8) { nalezy.nejde.push(`skupina ${jm}: jen ${clenove.length} fondů`); continue; }
        const rady = new Map();
        for (const f of clenove) { try { rady.set(f.isin, new Map((await radaZdroje(f.isin, zpet7(dnes7, 5), dnes7)).rada.filter((p) => p[1] > 0))); } catch { /* bez řady – vynechat */ } }
        const dny = [...new Set([...rady.values()].flatMap((m) => [...m.keys()]))].filter((d) => new Date(d).getUTCDay() % 6).sort().slice(-61);
        const rezidua = new Map();
        for (let k = 1; k < dny.length; k++) {
          const z = [];
          for (const [i, m] of rady) { const a = m.get(dny[k - 1]), b = m.get(dny[k]); if (a > 0 && b > 0) z.push([i, Math.log(b / a) * 100]); }
          if (z.length < 5) continue;
          const md = med7(z.map((x) => x[1]));
          for (const [i, x] of z) rezidua.set(i, [...(rezidua.get(i) ?? []), x - md]);
        }
        const sum = new Map([...rezidua].filter(([, xs]) => xs.length >= 40).map(([i, xs]) => [i, Math.sqrt(xs.reduce((a, b) => a + b * b, 0) / xs.length)]));
        const medSum = med7([...sum.values()]);
        for (const f of clenove) {
          const s = sum.get(f.isin);
          const zSeznamu = seznam.get(f.isin)?.druh === 'sum';
          if (s == null) { if (zSeznamu) nalezy.nejde.push(`${f.isin} ${f.primary_ticker}: šum řady nejde spočítat`); continue; }
          const sumny = s >= 1.1 && s >= 2.5 * medSum;
          if (zSeznamu && s < 0.7) nalezy.smazat.push(`${f.isin} ${f.primary_ticker} (šum): vlastní šum řady už ${s.toFixed(2)} % (medián skupiny ${medSum.toFixed(2)} %)`);
          if (!sumny || zSeznamu || (f.return_1m == null && f.return_1y == null)) continue;
          // Výnos proti VLASTNÍ burze (EUR listing) ke stejnému dni – stejný směr u 1M i 1R a > 1,5 p. b.
          const D = konecVynosu(f);
          const y = await prvniBurza(f, true, '2y');
          if (!y) { nalezy.B.push(`${f.isin} ${f.primary_ticker} (${jm}): vlastní šum řady ${s.toFixed(2)} % (×${(s / medSum).toFixed(1)} mediánu skupiny), burzu v EUR nejde ověřit – prověřit ručně`); continue; }
          const e = bod7(y.rada, D);
          const rozdil = (o, mes) => { const z = zpet7(D, mes), a = bod7(y.rada, z); return !e || !a || dnu7(a[0], z) > 6 || dnu7(e[0], D) > 4 || f[`return_${o}`] == null ? null : Number(f[`return_${o}`]) - (e[2] / a[2] - 1) * 100; };
          const r1m = rozdil('1m', 1), r1y = rozdil('1y', 12);
          if (r1m != null && r1y != null && Math.sign(r1m) === Math.sign(r1y) && Math.abs(r1m) > 1.5 && Math.abs(r1y) > 1.5)
            nalezy.B.push(`${f.isin} ${f.primary_ticker} (${jm}): šum řady ${s.toFixed(2)} % (×${(s / medSum).toFixed(1)}), výnos proti ${y.sym}: 1M ${r1m > 0 ? '+' : ''}${r1m.toFixed(2)} p. b., 1R ${r1y > 0 ? '+' : ''}${r1y.toFixed(2)} p. b.`);
        }
      }

      // C) Dividendy distribučních tříd: 100 největších + položky seznamu. Yahoo ex-den (> 3 dny starý, ≥ 0,25 % ceny)
      //    bez dividendy u zdroje v ±10 dnech (zdroj u části fondů vede den výplaty, ne ex-den – CHSPI, VECP).
      const dist = await fetch(`${URL_DB}?select=${sloupce}&distribution_policy=eq.Distributing&scraping_date=gte.${new Date(Date.now() - 3 * 864e5).toISOString()}&order=fund_size_numeric.desc.nullslast&limit=100`, hlav).then((r) => r.json());
      const divSeznam = [...seznam].filter(([, z]) => z.druh === 'dividenda').map(([i]) => i);
      const divFondy = [...(Array.isArray(dist) ? dist : []), ...(await fetch(`${URL_DB}?select=${sloupce}&isin=in.(${divSeznam.join(',')})`, hlav).then((r) => r.json()))];
      const hotovo7 = new Set();
      for (const f of divFondy) {
        if (hotovo7.has(f.isin)) continue;
        hotovo7.add(f.isin);
        const y = await prvniBurza(f, false, '2y', true);
        if (!y) continue;
        let src;
        try { src = (await radaZdroje(f.isin, zpet7(dnes7, 14), dnes7, true)).dividendy; } catch { continue; }
        const posl = y.rada.at(-1)?.[1];
        const chybi = y.dividendy.filter((d) => d.den >= zpet7(dnes7, 13) && dnu7(d.den, dnes7) > 3 && posl > 0 && d.castka / posl >= 0.0025 && !src.some((s) => dnu7(s, d.den) <= 10));
        const zSeznamu = seznam.get(f.isin);
        if (zSeznamu && !chybi.some((d) => dnu7(d.den, zSeznamu.den ?? d.den) <= 3)) nalezy.smazat.push(`${f.isin} ${f.primary_ticker} (dividenda ${zSeznamu.den}): zdroj ji už má`);
        if (zSeznamu) continue;
        for (const d of chybi) (dnu7(d.den, dnes7) > 21 ? nalezy.Cstare : nalezy.C).push(`${f.isin} ${f.primary_ticker} (${y.sym}): ex ${d.den} ${d.castka} ${y.mena} ≈ ${(100 * d.castka / posl).toFixed(2)} % ceny – zdroj ji nemá`);
      }

      // D) Fondy z ISIN.csv, které poslední běh scraperu neuložil (dávka 5 fondů padá na jednom přetečení).
      if (isinList.size > 4000) {
        const posledni = fondy.map((x) => String(x.scraping_date ?? '')).sort().at(-1);
        const hranice = new Date(new Date(`${posledni}Z`).getTime() - 12 * 3600e3).toISOString().slice(0, 19);
        nalezy.D = fondy.filter((x) => isinList.has(x.isin) && x.scraping_date && String(x.scraping_date) < hranice && dni(x) <= 30)
          .map((x) => `${x.isin} ${x.primary_ticker ?? ''} ${String(x.name ?? '').slice(0, 30)} – data z ${String(x.scraping_date).slice(0, 16)}`);
      }

      // E) Velký čerstvý fond bez dne výnosů (všechny výnosy za období null) – BTCW.
      const bezDne = await fetch(`${URL_DB}?select=isin,name,primary_ticker,fund_size_numeric&scraping_date=gte.${new Date(Date.now() - 2 * 864e5).toISOString()}&returns_as_of=is.null&fund_size_numeric=gte.100`, hlav).then((r) => r.json());
      nalezy.E = (Array.isArray(bezDne) ? bezDne : []).map((x) => `${x.isin} ${x.primary_ticker ?? ''} ${String(x.name ?? '').slice(0, 35)} (${x.fund_size_numeric} mil. €)`);

      // F) Web: fond ze seznamu nesmí mít ve srovnávači výnos za období. Zapojení seznamu do src/lib/trhy.ts (odlehleZTrhu)
      //    pozná kontrola podle značky _vynX u fondů seznamu; dokud žádný značku nemá, je to jen varování (před nasazením).
      let api = [];
      try { api = await fetch(`${WEB_URL}/api/etf/screener`).then((x) => x.json()); } catch { /* níže */ }
      if (Array.isArray(api) && api.length > 1000) {
        const OBD7 = /^(return_(1m|3m|6m|ytd|1y|3y|5y)(_czk|_usd)?)$/;
        const radky = api.filter((x) => seznam.has(x.isin));
        const zapojeno = radky.some((x) => x._vynX);
        for (const x of radky) if (Object.entries(x).some(([k, v]) => OBD7.test(k) && v != null)) nalezy.web.push(`${x.isin} ${seznam.get(x.isin).ticker}: srovnávač ukazuje výnos za období`);
        if (nalezy.web.length) (zapojeno ? poplach : varovani).push({ co: `Ověřeně chybné výnosy (src/lib/vynosNeovereny.ts) jsou na webu vidět${zapojeno ? '' : ' – seznam ještě není zapojený v src/lib/trhy.ts (odlehleZTrhu → sNeoverenymi) a na detailu'}: ${nalezy.web.length}`, ukazka: nalezy.web.slice(0, 8) });
      } else varovani.push({ co: 'Kontrola kolo7 (F): /api/etf/screener se nenačetl – zobrazení seznamu neověřeno', ukazka: [] });

      if (nalezy.A.length) poplach.push({ co: `Výnos přes skok v řadě zdroje, který burza nemá (kolo7 A) – ověřit a přidat do NEOVERENE_VYNOSY (src/lib/vynosNeovereny.ts): ${nalezy.A.length}`, ukazka: nalezy.A.slice(0, 10) });
      if (nalezy.B.length) poplach.push({ co: `Produkt bez tržní kotvy se zašuměnou řadou zdroje (kolo7 B) – výnos k jednomu dni nesedí s burzou; ověřit a přidat do NEOVERENE_VYNOSY: ${nalezy.B.length}`, ukazka: nalezy.B.slice(0, 10) });
      if (nalezy.Cstare.length) poplach.push({ co: `Zdroj dat přes 3 týdny nemá vyplacenou dividendu distribuční třídy (kolo7 C) – výnos s dividendami je nižší; přidat do NEOVERENE_VYNOSY: ${nalezy.Cstare.length}`, ukazka: nalezy.Cstare.slice(0, 10) });
      if (nalezy.C.length) varovani.push({ co: `Zdroj dat zatím nemá nedávnou dividendu distribuční třídy (kolo7 C; obvykle ji doplní do 3 týdnů) – výnos s dividendami je do té doby nižší: ${nalezy.C.length}`, ukazka: nalezy.C.slice(0, 12) });
      if (nalezy.D.length >= 10) poplach.push({ co: `Poslední běh scraperu neuložil ${nalezy.D.length} fondů ze seznamu ISIN (kolo7 D) – v logu „Chunk N: Failed to upload“ (numeric field overflow shodí celou dávku 5 fondů); oprava: etf-astro vynosy_z_rady.py MAX_VYNOS_PCT + upload po jednom při chybě dávky`, ukazka: nalezy.D.slice(0, 8) });
      else if (nalezy.D.length) varovani.push({ co: `Poslední běh scraperu neuložil ${nalezy.D.length} fondů ze seznamu ISIN (kolo7 D)`, ukazka: nalezy.D });
      if (nalezy.E.length) varovani.push({ co: `Velké čerstvé fondy bez dne výnosů – všechny výnosy za období „—“ (kolo7 E; BTCW: díra s cenou 0 u zdroje, oprava etf-astro oprava/btcw-vynosy)`, ukazka: nalezy.E.slice(0, 8) });
      if (nalezy.smazat.length) varovani.push({ co: `NEOVERENE_VYNOSY (src/lib/vynosNeovereny.ts): položky, které už neplatí – smazat ze seznamu: ${nalezy.smazat.length}`, ukazka: nalezy.smazat });
      if (nalezy.nejde.length) varovani.push({ co: `Kontrolu kolo7 nešlo u části fondů provést: ${nalezy.nejde.length}`, ukazka: nalezy.nejde.slice(0, 6) });
    } catch (e) {
      varovani.push({ co: `Kontrolu podezřelých čísel (kolo7) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }
  }
  // --- konec kolo7 podezrele ---

  // --- kolo7 seo --- (SEO/LLM audit kola 7, 22. 10. 2026; pravidlo č. 1, bod 4 – každá oprava má kontrolu)
  // Před nasazením (produkce má ještě Organization a WebSite v jednom uzlu) se nálezy hlásí jako varování.
  {
    const chyby = [];
    try {
      const vem = async (cesta, pokus = 0) => {
        try {
          const r = await fetch(`${WEB_URL}${cesta}`, { redirect: 'manual' });
          const html = r.status === 200 ? (await r.text()).replace(/<!-- -->/g, '') : (await r.body?.cancel(), '');
          return { status: r.status, loc: r.headers.get('location'), html };
        } catch { return pokus < 1 ? vem(cesta, pokus + 1) : { status: 0, loc: null, html: '' }; } // 1 opakování (síť)
      };
      const dek = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      const norm = (s) => s.replace(/[  ]/g, ' ').replace(/\s+/g, ' ').trim();
      const ld = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch { return { __chyba: true }; } }).flatMap((x) => (Array.isArray(x) ? x : [x]));
      const text = (h) => norm(dek(h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')));
      const typy = (x) => [].concat(x?.['@type'] ?? []);
      const ORG = 'https://etfpruvodce.cz/#organization';
      const AUTOR = 'https://etfpruvodce.cz/o-nas#tomas-kostrhoun';
      // Všechny URL našeho webu v JSON-LD (bez kotvy #…, bez šablon {…}).
      const urlVLd = (o, out = new Set()) => {
        if (typeof o === 'string') { if (/^https:\/\/etfpruvodce\.cz(\/|$)/.test(o) && !o.includes('{')) out.add(o.replace(/^https:\/\/etfpruvodce\.cz/, '').replace(/#.*$/, '') || '/'); }
        else if (o && typeof o === 'object') for (const v of Object.values(o)) urlVLd(v, out);
        return out;
      };

      // Stránky ze sitemapy (mimo detaily fondů) + 3 detaily z hlavy.
      const sm = (await vem('/sitemap.xml')).html;
      const polozky = [...sm.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
        cesta: m[1].match(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/)?.[1] || '/',
        lastmod: m[1].match(/<lastmod>([^<]*)<\/lastmod>/)?.[1] ?? null,
      }));
      if (polozky.length < 100) throw new Error(`sitemapa má jen ${polozky.length} URL`);
      const stranky = R.cesty([...polozky.filter((p) => !p.cesta.startsWith('/etf/')).map((p) => p.cesta), ...polozky.filter((p) => p.cesta.startsWith('/etf/')).slice(0, 3).map((p) => p.cesta)], 'SEO (kolo 7): stránky ze sitemapy + 3 detaily z hlavy');
      const nacteno = new Map();
      for (let i = 0; i < stranky.length; i += 6) await Promise.all(stranky.slice(i, i + 6).map(async (c) => nacteno.set(c, await vem(c))));
      const H = (c) => nacteno.get(c)?.html ?? '';
      const nasazeno = ld(H('/')).some((x) => x['@type'] === 'WebSite');

      // 1) URL v JSON-LD musí vracet 200 (dřív /jak-zacit-investovat-do-etf 404, /kalkulacky/kurzovy-dopad 404, 308 na
      //    /co-jsou-etf a /kalkulacky/*). Detaily fondů se neověřují dotazem na web (ISR zápisy ocasu) – stačí, že fond je v DB.
      //    Stránky ze sitemapy samy nesmí přesměrovávat.
      const cile = new Map();
      for (const [c, { status, loc, html }] of nacteno) {
        if (status !== 200) { chyby.push(`${c}: sitemapa → HTTP ${status}${loc ? ` → ${loc}` : ''}`); continue; }
        const L = ld(html);
        if (L.some((x) => x.__chyba)) chyby.push(`${c}: nevalidní JSON v JSON-LD`);
        for (const u of urlVLd(L)) cile.set(u, [...(cile.get(u) ?? []), c]);
      }
      const isiny = new Set(fondy.map((f) => f.isin));
      const overit = [];
      for (const [u, z] of cile) {
        const m = u.match(/^\/etf\/([A-Z0-9]{12})$/);
        if (m) { if (!isiny.has(m[1])) chyby.push(`JSON-LD: ${u} – fond není v DB (z ${z.slice(0, 2).join(', ')})`); continue; }
        if (!u.startsWith('/api/og')) overit.push(u); // OG obrázky se generují – neověřujeme (CPU)
      }
      const overitVyber = R.cesty(overit, 'SEO (kolo 7): odkazy z JSON-LD');
      for (let i = 0; i < overitVyber.length; i += 6) {
        await Promise.all(overitVyber.slice(i, i + 6).map(async (u) => {
          const r = nacteno.get(u) ?? await vem(u);
          if (r.status !== 200) chyby.push(`JSON-LD: ${u} → HTTP ${r.status}${r.loc ? ` → ${r.loc}` : ''} (z ${cile.get(u).slice(0, 2).join(', ')})`);
        }));
      }

      // 2) FAQPage jen s otázkami, které jsou na stránce vidět (dřív /vyber-etf: FAQ jen v JSON-LD).
      for (const [c] of nacteno) {
        const t = text(H(c));
        for (const x of ld(H(c))) if (x['@type'] === 'FAQPage') for (const q of x.mainEntity ?? []) {
          if (!t.includes(norm(q.name ?? ''))) chyby.push(`${c}: otázka z FAQPage není na stránce vidět („${q.name}“)`);
        }
      }

      // 3) Organization a WebSite jako samostatné uzly; WebSite se SearchAction na srovnávač; Organization s @id
      //    …/#organization právě jednou na stránce (/o-nas dřív měla druhý uzel s jiným popisem).
      const home = ld(H('/'));
      if (home.some((x) => typy(x).includes('Organization') && typy(x).includes('WebSite'))) chyby.push('/: Organization a WebSite v jednom uzlu (@type pole) – mají být samostatné');
      const ws = home.find((x) => x['@type'] === 'WebSite');
      if (!ws || ws.publisher?.['@id'] !== ORG || !/^https:\/\/etfpruvodce\.cz\/srovnani\?q=\{search_term_string\}$/.test(ws.potentialAction?.target?.urlTemplate ?? '')) chyby.push('/: WebSite bez publisher …/#organization nebo SearchAction na /srovnani?q={search_term_string}');
      for (const c of ['/', '/o-nas']) {
        const n = ld(H(c)).filter((x) => typy(x).includes('Organization') && x['@id'] === ORG).length;
        if (n !== 1) chyby.push(`${c}: ${n}× uzel Organization s @id …/#organization (má být 1)`);
      }

      // 4) /o-nas: AboutPage + ProfilePage, hlavní entita = autor (Person @id, LinkedIn).
      const onas = ld(H('/o-nas')).find((x) => typy(x).includes('ProfilePage'));
      if (!onas || !typy(onas).includes('AboutPage') || onas.mainEntity?.['@id'] !== AUTOR || !(onas.mainEntity?.sameAs ?? []).includes('https://www.linkedin.com/in/tomas-kostrhoun-b34a6831')) chyby.push('/o-nas: chybí AboutPage + ProfilePage s autorem (Person @id, LinkedIn)');

      // 5) Article: datum úpravy z redakce.ts (ne den dat fondů), obrázek, autor a vydavatel přes @id.
      const redakce = readFileSync('src/lib/redakce.ts', 'utf8');
      const upravy = Object.fromEntries([...redakce.matchAll(/'(\/[^']*)': \{ publikovano: '(\d{4}-\d{2}-\d{2})', upraveno: '(\d{4}-\d{2}-\d{2})' \}/g)].map((m) => [m[1], { pub: m[2], upr: m[3] }]));
      const ceniky = readFileSync('src/data/brokerData.ts', 'utf8').match(/CENIKY_OVERENY = '(\d{4}-\d{2}-\d{2})'/)?.[1];
      const sb = ld(H('/srovnani-brokeru')).find((x) => x['@type'] === 'Article');
      if (!sb || sb.dateModified !== upravy['/srovnani-brokeru']?.upr) chyby.push(`/srovnani-brokeru: Article dateModified ${sb?.dateModified} ≠ redakce.ts ${upravy['/srovnani-brokeru']?.upr}`);
      if (sb && ceniky && sb.dateModified < ceniky) chyby.push(`/srovnani-brokeru: dateModified ${sb.dateModified} je starší než ověření ceníků ${ceniky} – posuňte upraveno v redakce.ts`);
      for (const c of ['/srovnani-brokeru', '/srovnani/vwce-vs-cspx']) {
        const a = ld(H(c)).find((x) => x['@type'] === 'Article');
        if (!a?.image?.url || a.author?.['@id'] !== AUTOR || a.publisher?.['@id'] !== ORG) chyby.push(`${c}: Article bez image / author @id / publisher @id`);
      }

      // 6) Sitemapa: lastmod redakčních stránek = datum úpravy z redakce.ts; nikdy v budoucnosti; bez tichého „dnes“
      //    (dřív getDataDate(today) – při výpadku DB měly datové stránky lastmod = den generování).
      const zitra = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
      const DATOVE = /^(\/|\/srovnani|\/zebricky|\/nejlepsi-etf\/.*|\/srovnani\/[a-z0-9]+-vs-[a-z0-9]+)$/;
      for (const p of polozky) {
        if (p.lastmod && p.lastmod.slice(0, 10) >= zitra) chyby.push(`sitemap: ${p.cesta} lastmod v budoucnosti (${p.lastmod})`);
        const u = upravy[p.cesta] ?? (p.cesta.startsWith('/portfolio-strategie/') ? upravy['/portfolio-strategie/*'] : p.cesta.startsWith('/recenze/') ? upravy['/recenze/*'] : null);
        if (!u) continue;
        if (!p.lastmod) chyby.push(`sitemap: ${p.cesta} bez lastmod (datum úpravy je v redakce.ts)`);
        else if (DATOVE.test(p.cesta) ? p.lastmod.slice(0, 10) < u.upr : p.lastmod.slice(0, 10) !== u.upr) chyby.push(`sitemap: ${p.cesta} lastmod ${p.lastmod.slice(0, 10)} ≠ redakce.ts ${u.upr}`);
      }

      // 7) Žebříčky s dřív stejným jádrem popisku – žádná věta popisku (mimo „Data k …“) se nesmí opakovat ve dvou z nich.
      //    Každý popisek nese datum dat. „Nejlepší zlato ETF“ → „Nejlepší ETF na zlato“.
      const PET = ['nejlepsi-etf-2026', 'nejlepsi-sp500-etf', 'nejlepsi-americke-etf', 'nejlepsi-akumulacni-etf', 'nejlevnejsi-etf'].map((s) => `/nejlepsi-etf/${s}`);
      const vety = new Map();
      for (const c of PET) {
        const d = norm(dek(H(c).match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ''));
        if (!/Data k \d{1,2}\. \d{1,2}\. \d{4}\./.test(d)) chyby.push(`${c}: popisek bez „Data k …“ („${d.slice(0, 60)}…“)`);
        for (const v of d.replace(/Data k \d{1,2}\. \d{1,2}\. \d{4}\./, '').split(/(?<=\.)\s+(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ])/)) if (v.trim()) vety.set(v.trim(), [...(vety.get(v.trim()) ?? []), c]);
      }
      for (const [v, cs] of vety) if (cs.length > 1) chyby.push(`Stejná věta v popisku ${cs.length} žebříčků („${v.slice(0, 60)}“): ${cs.join(', ')}`);
      if (!/<h1[^>]*>\s*Nejlepší ETF na zlato\s*<\/h1>/.test(H('/nejlepsi-etf/nejlepsi-zlato-etf'))) chyby.push('/nejlepsi-etf/nejlepsi-zlato-etf: H1 není „Nejlepší ETF na zlato“');

      // 8) GEO: „Klíčová čísla k {datum}“ na hlavních žebříčcích; největší fond S&P 500 = surová DB (CSPX/SXR8).
      for (const s of ['nejlepsi-etf-2026', 'nejlepsi-sp500-etf', 'nejlepsi-msci-world-etf', 'nejlepsi-celosvetove-etf']) {
        const h = H(`/nejlepsi-etf/${s}`);
        if (!/data-sekce="klicova-cisla"/.test(h) || !/Klíčová čísla k \d{1,2}\. \d{1,2}\. \d{4}/.test(text(h))) chyby.push(`/nejlepsi-etf/${s}: chybí „Klíčová čísla k [datum]“`);
      }
      const kcSp = text(H('/nejlepsi-etf/nejlepsi-sp500-etf').match(/<section data-sekce="klicova-cisla"[\s\S]*?<\/section>/)?.[0] ?? '');
      const velWeb = kcSp.match(/Největší fond (\d+,\d) mld\. €/)?.[1];
      const cspx = await fetch(`${URL_DB}?select=fund_size_numeric&isin=eq.IE00B5BMR087`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }).then((r) => r.json());
      const velDb = cspx?.[0]?.fund_size_numeric != null ? (cspx[0].fund_size_numeric / 1000).toFixed(1).replace('.', ',') : null;
      if (kcSp && (!velWeb || velWeb !== velDb)) chyby.push(`/nejlepsi-etf/nejlepsi-sp500-etf: Klíčová čísla – největší fond ${velWeb} mld. € ≠ DB ${velDb} mld. €`);

      // 9) Prolinkování slabě odkazovaných stránek (dřív 1–4 příchozí odkazy): počet různých stránek ze sitemapy s odkazem.
      const odkazyNa = new Map();
      for (const [c] of nacteno) for (const m of H(c).matchAll(/href="(\/[^"#?]*)/g)) {
        const k = m[1].replace(/\/$/, '') || '/';
        if (k !== c) odkazyNa.set(k, (odkazyNa.get(k) ?? new Set()).add(c));
      }
      const MIN_ODKAZU = { '/infografiky': 4, '/etf-vs-akcie': 4, '/cisty-plat': 3, '/sp500-nebo-cely-svet': 5, '/pravidlo-4-procent': 5 };
      for (const p of polozky) if (/^\/portfolio-strategie\/[^/]+$/.test(p.cesta)) MIN_ODKAZU[p.cesta] = 5;
      for (const [k, min] of Object.entries(MIN_ODKAZU)) {
        const n = odkazyNa.get(k)?.size ?? 0;
        if (n < min) chyby.push(`${k}: jen ${n} stránek ze sitemapy na ni odkazuje (min. ${min})`);
      }

      // 10) Dvojice srovnání – jedno pravidlo pořadí (src/lib/pairs.ts, middleware): kurátorský alias (vwce-vs-eunl) = 200
      //     s canonical na hlavní dvojici; obrácené pořadí (eunl-vs-vwce) = 301 rovnou na TUTÉŽ hlavní dvojici.
      const alias = await vem('/srovnani/vwce-vs-eunl');
      const obraceny = await vem('/srovnani/eunl-vs-vwce');
      const kanon = alias.html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
      if (alias.status !== 200 || !kanon.endsWith('/srovnani/vwce-vs-iwda') || ![301, 308].includes(obraceny.status) || !(obraceny.loc ?? '').endsWith('/srovnani/vwce-vs-iwda')) {
        chyby.push(`Dvojice: vwce-vs-eunl ${alias.status} canonical ${kanon || '—'}, eunl-vs-vwce ${obraceny.status} → ${obraceny.loc ?? '—'} (obojí má končit na /srovnani/vwce-vs-iwda)`);
      }

      if (chyby.length) (nasazeno ? poplach : varovani).push({ co: `SEO kolo 7${nasazeno ? '' : ' – produkce ještě bez oprav (před nasazením)'}: ${chyby.length} nálezů`, ukazka: chyby.slice(0, 20) });
    } catch (e) {
      varovani.push({ co: `Kontrolu SEO kola 7 se nepodařilo provést: ${e.message}`, ukazka: chyby.slice(0, 5) });
    }
  }
  // --- konec kolo7 seo ---

  // --- kolo7 srovnavac --- (revize pokročilého testera 22. 10. 2026: srovnávač, žebříčky, „Další fondy na index“; pravidlo č. 1, bod 4)
  // Co hlídá (nezávisle na kódu webu – surová DB přes REST a hotové HTML/API):
  //  (a) D1: karta „Nejvýkonnější“ na žebříčku jen z fondů s výnosy ke dni „Data k …“ stránky (dřív vedly fondy se starším
  //      dnem – S&P 500 WSPX/SPTG/ESEA k 16.–19. 10.); varianty „ex-…“ (EM ex-China +91,6 %) na kartách nejsou;
  //      Emerging markets bez „Nejvýkonnějšího“ (indexová kategorie).
  //  (b) srovnávač (/api/etf/screener): fond s jiným dnem výnosů než většina má `_dv`; jantarový štítek (`_dvP`) jen
  //      u fondů pozadu o víc než 3 pracovní dny (dřív jantarová u 19 % řádků, 807 fondů jen 2 dny pozadu);
  //      TER 0 jen u komodit a krypta (u akcií/dluhopisů je to chyba zdroje → null).
  //  (c) detail: „Další fondy na index“ – číslo fondu s jiným dnem nese „k 19. 10.“ (BITC −22,5 % k 20. 10. vedle
  //      BTCN −19,0 % k 19. 10.); TER 0 má poznámku „náklady mimo TER“; VHYL bez dvou protichůdných vět o riziku.
  //  (d) žebříček: odpověď nahoře nejvýš se 2 větami a jedním prahem velikosti, počet fondů v čipu jen jednou navíc,
  //      název bez tickeru (ten je v řádku pod ním), „Rychlé odkazy na velké fondy“.
  //  (e) kód: pravidla, která jsou jen v prohlížeči (řazení podle výnosu s oddělovačem, TER 0 na konec, zajištěné třídy
  //      skryté při výběru indexu, hledání všech slov, tabulka bez overflow až od xl) – kontrola, že je nikdo nevrátil.
  {
    const chyby = [], upozorneni = [];
    try {
      const hlav = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
      const vem = async (cesta) => { try { const r = await fetch(`${WEB_URL}${cesta}`); return r.ok ? (await r.text()).replace(/<!-- -->/g, '') : ''; } catch { return ''; } };
      const dek = (t) => t.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&nbsp;|&#160;| /g, ' ');
      const text = (t) => dek(t.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
      const iso7 = (d) => d.toISOString().slice(0, 10);
      const poledne7 = (s) => new Date(`${String(s).slice(0, 10)}T12:00:00Z`);
      const pracDni7 = (a, b) => { let n = 0; const d = poledne7(a); while (iso7(d) < b && n < 400) { d.setUTCDate(d.getUTCDate() + 1); if (d.getUTCDay() % 6) n++; } return n; };
      const isoZCz = (s) => { const m = String(s).match(/(\d{1,2})\. (\d{1,2})\. (\d{4})/); return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null; };
      const dbIsiny = async (isiny, sloupce) => {
        const out = new Map();
        for (let i = 0; i < isiny.length; i += 100) {
          const r = await fetch(`${URL_DB}?select=${sloupce}&isin=in.(${isiny.slice(i, i + 100).join(',')})`, hlav);
          if (!r.ok) throw new Error(`Supabase HTTP ${r.status}`);
          for (const f of await r.json()) out.set(f.isin, f);
        }
        return out;
      };
      // Nasazeno? (před nasazením kola 7 produkce nálezy má → jen varování)
      const sp = await vem('/nejlepsi-etf/nejlepsi-sp500-etf');
      const nasazeno = /Rychlé odkazy na velké fondy/.test(sp);

      // (a) + (d) ŽEBŘÍČKY ────────────────────────────────────────────────────────────────────────────────
      const rozc = await vem('/zebricky');
      const slugy = [...new Set([...rozc.matchAll(/href="\/nejlepsi-etf\/([a-z0-9-]+)"/g)].map((m) => m[1]))];
      const EX_SMI = new Set(['nejlepsi-etf-2026', 'nejlepsi-akciove-etf', 'nejlepsi-dluhopisove-etf', 'nejlevnejsi-etf', 'nejlepsi-akumulacni-etf',
        'nejlepsi-distribucni-etf', 'nejlepsi-esg-etf', 'nejlepsi-asijsko-pacificke-etf']);
      const vykonne = []; // { slug, isin, den }
      const kartyEx = [];
      for (const slug of slugy) {
        const h = slug === 'nejlepsi-sp500-etf' ? sp : await vem(`/nejlepsi-etf/${slug}`);
        if (!h) { upozorneni.push(`${slug}: stránka se nenačetla`); continue; }
        const den = isoZCz(text(h).match(/Data k (\d{1,2}\. \d{1,2}\. \d{4})/)?.[1] ?? '');
        const v = h.match(/data-sekce="vybrane"[\s\S]*?<\/section>/)?.[0] ?? '';
        for (const m of v.matchAll(/href="\/etf\/([A-Z0-9]{12})"([\s\S]*?)<\/a>/g)) {
          const t = text(m[2]);
          if (/Nejvýkonnější|nejvýkonnější/.test(t)) vykonne.push({ slug, isin: m[1], den });
          if (!EX_SMI.has(slug)) kartyEx.push({ slug, isin: m[1] });
        }
        if (slug === 'nejlepsi-emerging-markets-etf' && /Nejvýkonnější/.test(text(v))) chyby.push('nejlepsi-emerging-markets-etf: karta „Nejvýkonnější“ (indexová kategorie – vyhrávaly jiné trhy/metodiky)');
        // (d) odpověď nahoře: nejvýš 2 věty (věta = končí „.“ za slovem/číslem s %, € nebo závorkou, ne za datem) a jeden práh
        const odp = text(h.match(/data-odpoved="zebricek"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '');
        if (odp) {
          const vety = odp.replace(/\d{1,2}\. \d{1,2}\. \d{4}/g, 'DATUM').replace(/mil\. €|mld\. €/g, 'MIL').replace(/\b([A-Z])\.(?=\s?[A-Z])/g, '$1').split(/\.(?:\s|$)/).filter((x) => x.trim().length > 3);
          if (vety.length > 2) chyby.push(`${slug}: odpověď nahoře má ${vety.length} věty (max. 2): „${odp.slice(0, 90)}…“`);
          const prahy = new Set([...odp.matchAll(/nad (\d[\d ]*) mil\. €/g)].map((m) => m[1]));
          if (prahy.size > 1) chyby.push(`${slug}: odpověď nahoře míchá prahy ${[...prahy].join(' a ')} mil. € (práh karet patří do poznámky)`);
          const cip = text(h.match(/data-pocet-fondu[^>]*>([\s\S]*?)<\/span>\s*<span/)?.[1] ?? '');
          const pocetStr = h.match(/data-pocet-fondu="(\d+)"/)?.[1];
          if (pocetStr && new RegExp(`(^|\\D)${Number(pocetStr).toLocaleString('cs-CZ').replace(/\s/g, '\\s?')}\\s*fond`).test(cip)) chyby.push(`${slug}: počet fondů v čipu i v odpovědi nahoře (max. 2× na stránce)`);
        }
        // (d) název v tabulce nesmí končit tickerem, který je hned pod ním („… · Acc (IS0F)“ + „IS0F“)
        for (const m of h.matchAll(/isin\\":\\"([A-Z]{2}[A-Z0-9]{10})\\",\\"nazev\\":\\"((?:[^"\\]|\\.)*?)\\",\\"ticker\\":\\"([^"\\]+)\\"/g)) {
          if (m[2].endsWith(`(${m[3]})`)) { chyby.push(`${slug}: ${m[1]} název „${m[2].slice(0, 60)}“ končí tickerem (ticker je i v řádku pod ním)`); break; }
        }
        if (/Další velké fondy v žebříčku/.test(h)) chyby.push(`${slug}: starý nadpis „Další velké fondy v žebříčku (N) – nad 2 mld. €…“ (má být „Rychlé odkazy na velké fondy“)`);
      }
      const isinyKaret = [...new Set([...vykonne.map((x) => x.isin), ...kartyEx.map((x) => x.isin)])];
      const db7 = await dbIsiny(isinyKaret, 'isin,name,returns_as_of,scraping_date');
      for (const v of vykonne) {
        const f = db7.get(v.isin);
        const den = f?.returns_as_of ? String(f.returns_as_of).slice(0, 10) : null;
        // Stránka se cachuje (ISR, 1 den): DB smí mít NOVĚJŠÍ den (fond se mezitím stáhl znovu), starší ne.
        if (v.den && den && den < v.den) chyby.push(`${v.slug}: „Nejvýkonnější“ ${v.isin} má výnosy k ${den}, stránka „Data k“ ${v.den} – jiné období`);
      }
      for (const k of kartyEx) {
        const f = db7.get(k.isin);
        if (f && /\bex[- ][a-z]/i.test(f.name ?? '')) chyby.push(`${k.slug}: na kartě varianta „ex-…“ ${k.isin} ${String(f.name).slice(0, 50)} (jiný trh)`);
      }

      // (b) SROVNÁVAČ ─────────────────────────────────────────────────────────────────────────────────────
      const rows = await fetch(`${WEB_URL}/api/etf/screener`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      if (!Array.isArray(rows)) upozorneni.push('/api/etf/screener se nenačetl');
      else {
        const vNabidce = fondy.filter((x) => x.name && x.returns_as_of && dni(x) <= 30);
        const pocty7 = new Map();
        for (const x of vNabidce) { const d = String(x.returns_as_of).slice(0, 10); pocty7.set(d, (pocty7.get(d) ?? 0) + 1); }
        const vetsina7 = [...pocty7.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? 1 : -1))[0]?.[0];
        const sDv = rows.filter((r) => r._dv);
        const jantar = rows.filter((r) => r._dvP);
        if (vetsina7) {
          // Srovnávač se cachuje (až 24 h) → hrubé chyby: jantarový u fondu ≤ 2 dny pozadu, šedý u fondu ≥ 5 dní pozadu.
          const spatneJ = jantar.filter((r) => { const d = isoZCz(r._dv); return d && d <= vetsina7 && pracDni7(d, vetsina7) <= 2; });
          const spatneS = sDv.filter((r) => !r._dvP).filter((r) => { const d = isoZCz(r._dv); return d && d < vetsina7 && pracDni7(d, vetsina7) >= 5; });
          if (spatneJ.length) chyby.push(`Srovnávač: jantarový štítek „výnosy k …“ u ${spatneJ.length} fondů jen ≤ 2 pracovní dny pozadu (má být šedý „k …“) – ${spatneJ.slice(0, 3).map((r) => `${r.primary_ticker ?? r.isin} k ${r._dv}`).join(', ')}`);
          if (spatneS.length) chyby.push(`Srovnávač: fondy ≥ 5 pracovních dní pozadu bez jantarového štítku (_dvP): ${spatneS.slice(0, 3).map((r) => `${r.primary_ticker ?? r.isin} k ${r._dv}`).join(', ')}`);
          // Fond s jiným dnem než většina a s výnosem musí mít _dv (jinak by se v řazení srovnával s ostatními) – jen > 1 prac. den (cache).
          const podle7 = new Map(rows.map((r) => [r.isin, r]));
          const bezDv = vNabidce.filter((x) => { const d = String(x.returns_as_of).slice(0, 10); return d < vetsina7 && pracDni7(d, vetsina7) > 1; })
            .map((x) => podle7.get(x.isin)).filter((r) => r && (r.return_1y != null || r.return_3y != null) && !r._dv);
          if (bezDv.length > 5) chyby.push(`Srovnávač: ${bezDv.length} fondů s výnosy k jinému dni než většina (${vetsina7}) nemá _dv – v řazení podle výnosu by se mísily dny: ${bezDv.slice(0, 4).map((r) => r.primary_ticker ?? r.isin).join(', ')}`);
        }
        if (rows.length && jantar.length / rows.length > 0.05) chyby.push(`Srovnávač: jantarový štítek u ${jantar.length} fondů (${(100 * jantar.length / rows.length).toFixed(1)} %) – má být jen u výrazně pozadu`);
        const ter0 = rows.filter((r) => r.ter_numeric === 0 && !['Komodity', 'Krypto'].includes(r.category));
        if (ter0.length) chyby.push(`Srovnávač: TER 0 % u ${ter0.length} fondů mimo komodity/krypto (chyba zdroje se má ukázat jako „—“): ${ter0.slice(0, 3).map((r) => r.isin).join(', ')}`);
      }

      // (c) DETAIL FONDU ──────────────────────────────────────────────────────────────────────────────────
      // „Další fondy na index“: číslo fondu s jiným dnem výnosů než fond stránky → data-podobny-vynosy-k.
      for (const isin of R.detaily(['GB00BLD4ZL17', 'XS2940466316', 'FR0011550680', 'IE00B5BMR087'], 'Kolo 7 (c): „Další fondy na index“ s jiným dnem výnosů')) {
        const h = await vem(`/etf/${isin}`);
        if (!h) { upozorneni.push(`/etf/${isin} se nenačetl`); continue; }
        const denStranky = h.match(/data-vynosy-k="(\d{4}-\d{2}-\d{2})"/)?.[1];
        const sekce = h.match(/data-sekce="podobne-fondy"[\s\S]*?<\/section>/)?.[0] ?? '';
        const polozky = [...sekce.matchAll(/<li>[\s\S]*?href="\/etf\/([A-Z0-9]{12})"([\s\S]*?)<\/li>/g)].map((m) => ({ isin: m[1], html: m[2] }));
        if (!denStranky || !polozky.length) continue;
        const db = await dbIsiny(polozky.map((p) => p.isin), 'isin,returns_as_of,return_1y_czk');
        for (const p of polozky) {
          const f = db.get(p.isin);
          const d = f?.returns_as_of ? String(f.returns_as_of).slice(0, 10) : null;
          const cislo = /[+−-]\d+,\d %/.test(text(p.html));
          // Detail se cachuje až 30 dní → jen zjevný případ: fond v boxu má STARŠÍ den než fond stránky a číslo bez dne.
          if (d && cislo && d < denStranky && !/data-podobny-vynosy-k/.test(p.html)) chyby.push(`/etf/${isin}: „Další fondy na index“ – ${p.isin} má výnos k ${d}, stránka k ${denStranky}, u čísla chybí „k …“`);
        }
      }
      // TER 0: Xetra-Gold (DE000A0S9GB0) – poznámka „náklady mimo TER“, když DB má TER 0.
      const g = (await dbIsiny(['DE000A0S9GB0'], 'isin,ter_numeric')).get('DE000A0S9GB0');
      if (g && Number(g.ter_numeric) === 0 && !/data-ter-nula-poznamka/.test(await vem('/etf/DE000A0S9GB0'))) chyby.push('/etf/DE000A0S9GB0 (Xetra-Gold): TER 0 % bez poznámky o nákladech mimo TER');
      // VHYL: když pravidlo tříd skryje kolísavost, nesmí pod tabulkou zůstat i „Data o kolísavosti nejsou k dispozici.“
      const vhyl = text(await vem('/etf/IE00B8GKDB10'));
      if (/Údaj zdroje nesedí s jinou třídou|neuvádíme \(„—“\)/.test(vhyl) && /Data o kolísavosti nejsou k dispozici/.test(vhyl)) chyby.push('/etf/IE00B8GKDB10 (VHYL): dvě protichůdné věty o riziku (skryto pravidlem tříd + „nejsou k dispozici“)');

      // (e) KÓD – pravidla, která běží jen v prohlížeči ──────────────────────────────────────────────────
      const scr = readFileSync('src/components/design-preview/ScreenerUI.tsx', 'utf8');
      const tab = readFileSync('src/components/zebricky/TabulkaFondu.tsx', 'utf8');
      const KOD = [
        [scr, /if \(jinyDen && !!A\.r\.e\._dv !== !!B\.r\.e\._dv\)/, 'ScreenerUI: řazení podle výnosu nedává fondy s jiným dnem (_dv) na konec'],
        [scr, /data-jiny-den-oddel/, 'ScreenerUI: chybí oddělovač „Výnosy k jinému dni“'],
        [tab, /if \(jinyDen && !!a\.vynosyK !== !!b\.vynosyK\)/, 'TabulkaFondu: řazení podle výnosu nedává fondy s jiným dnem (vynosyK) na konec'],
        [tab, /data-jiny-den-oddel/, 'TabulkaFondu: chybí oddělovač „Výnosy k jinému dni“'],
        [scr, /case 'ter': return terRazeni\(/, 'ScreenerUI: TER 0 % se v řazení podle TER nedává na konec'],
        [scr, /useState\('auto'\)/, 'ScreenerUI: měnově zajištěné třídy nejsou při výběru indexu ve výchozím stavu skryté'],
        [scr, /slova\.every\(/, 'ScreenerUI: hledání nevyžaduje všechna slova („iShares USD Treasury“ = 949 fondů)'],
        [scr, /overflow-x-auto xl:overflow-visible/, 'ScreenerUI: tabulka bez overflow dřív než od xl (1 024–1 279 px se usekne)'],
        [scr, /flex flex-wrap items-center gap-x-1\.5/, 'ScreenerUI: štítky u názvu fondu se nezalamují (roztáhnou tabulku)'],
        [scr, /1 rok v \{curLabel\[cur\]\}/, 'ScreenerUI: mobilní karta „1 rok“ bez měny'],
      ];
      for (const [k, re, co] of KOD) if (!re.test(k)) chyby.push(co);
      if (/lg:overflow-visible/.test(scr)) chyby.push('ScreenerUI: lg:overflow-visible – tabulka (≥ 1 080 px) se do lg nevejde');

      if (chyby.length) (nasazeno ? poplach : varovani).push({ co: `Srovnávač a žebříčky (kolo 7)${nasazeno ? '' : ' – produkce ještě bez oprav (před nasazením)'}: ${chyby.length} nálezů`, ukazka: chyby.slice(0, 12) });
      if (upozorneni.length) varovani.push({ co: `Kontrola kolo 7 (srovnávač): část stránek se nenačetla`, ukazka: upozorneni.slice(0, 5) });
    } catch (e) {
      varovani.push({ co: `Kontrolu srovnávače a žebříčků (kolo 7) se nepodařilo provést: ${e.message}`, ukazka: chyby.slice(0, 5) });
    }
  }
  // --- konec kolo7 srovnavac ---
  await kontrolaKolo7Mobil(poplach, varovani); // blok „kolo7 mobil“ – definice na konci souboru
  await kontrolaKolo8Faktory(poplach, varovani); // blok „kolo8 faktory“ – definice na konci souboru
  await kontrolaKolo8Obsah(poplach, varovani); // blok „kolo8 obsah“ – definice na konci souboru
  await kontrolaGrafIndexu(poplach, varovani); // blok „graf indexu“ (3.3, 11. 11. 2026) – definice na konci souboru
  await kontrolaPorovnaniCdn(poplach, varovani); // blok „porovnání z CDN“ (12. 11. 2026) – definice na konci souboru

  // --- kolo8 zebricky --- (kolo 8, 22. 10. 2026; pravidlo č. 1, bod 4 – každá oprava má kontrolu)
  //  A) KATEGORIE ŽEBŘÍČKŮ: filtry názvem chytaly cizí fondy („US “ v „PLUS “/„Focus “, „Latin“ v „Accumulating“, S&P Global
  //     Mining WMIN na kartě „Nejvýkonnější“ amerických, Pictet „AI Enhanced“ v AI, Invesco Physical Bitcoin v komoditách,
  //     Dow Jones Industrial Average v průmyslových). Nezávislá heuristika z názvu + indexu + zaměření (investment_focus):
  //     fond na KARTĚ mimo kategorii = poplach, víc než 5 % tabulky = varování.
  //  B) VÝNOSY TŘÍD TÉHOŽ FONDU (src/lib/tridyFondu.ts `vynosTridNesedi`): nezávislý klíč tříd; ke stejnému dni nesmí
  //     srovnávač ukazovat u dvou tříd výnosy, které se liší nad práh (1,5 / 3 / 5 % poměru růstu) – poplach; k různým
  //     dnům a rozdíl > 3× práh = varování (prověřit burzou → NEOVERENE_VYNOSY druh 'burza').
  //  C) DETAIL: fondy z NEOVERENE_VYNOSY ukazují důvod „Výnosy za období neukazujeme“ (vzorek).
  //  D) ŽEBŘÍČKY: nejlevnejsi-etf mluví o „nejlevnějších“ (ne „největších“) fondech, odpověď nahoře se na 5 hlavních
  //     žebříčcích neopakuje doslova, HTML nejlepsi-etf-2026 do 600 KB (bylo 523 KB, z toho ~70 KB rychlé odkazy).
  // Před nasazením (produkce bez „nejlevnějších fondů“ na nejlevnejsi-etf) jdou nálezy A, C a D jen do varování.
  {
    const hlav8 = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
    const html8 = async (cesta) => { try { const r = await fetch(`${WEB_URL}${cesta}`); return r.ok ? (await r.text()).replace(/<!-- -->/g, '') : ''; } catch { return ''; } };
    const text8 = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;| /g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
    const levne8 = await html8('/nejlepsi-etf/nejlevnejsi-etf');
    const nasazeno8 = /nejlevnějších fondů/.test(text8(levne8));
    const nalez8 = (co, ukazka) => (nasazeno8 ? poplach : varovani).push({ co: `${co}${nasazeno8 ? '' : ' (produkce ještě bez oprav kola 8)'}`, ukazka });

    // A) kategorie žebříčků
    try {
      const KAT8 = {
        // slug: (fond, t = název + index, fo = investment_focus) => patří do kategorie?
        'nejlepsi-americke-etf': (f, t, fo) => (/United States|North America/.test(fo) || /\b(USA|US|U\.S\.|S&P 500|Nasdaq|Dow Jones)\b/.test(f.name)) && !/World|Europe|Emerging|Latin|Asia|Pacific|Japan|China/.test(fo),
        'nejlepsi-evropske-etf': (f, t, fo) => /Europe|Germany|France|Italy|Spain|Netherlands|Switzerland|United Kingdom|Sweden|Norway|Denmark|Finland|Austria|Belgium|Portugal|Ireland|Poland|Nordic/.test(fo) || /\b(Europe|European|Euro|EMU|Eurozone|STOXX|DAX|CAC|FTSE MIB|IBEX|AEX|SMI)\b/i.test(t),
        'nejlepsi-japonske-etf': (f, t, fo) => /Japan/.test(fo) || /Japan|Nikkei|TOPIX/i.test(t),
        'nejlepsi-cinske-etf': (f, t, fo) => /China|Hong Kong/.test(fo) || /China|Chinese|\bCSI\b|Hang Seng|Hong Kong/i.test(t),
        'nejlepsi-indicke-etf': (f, t, fo) => /India/.test(fo) || /India|Nifty|Sensex/i.test(t),
        'nejlepsi-emerging-markets-etf': (f, t, fo) => /Emerging/.test(fo) || /Emerging|\bEM\b/i.test(t),
        'nejlepsi-asijsko-pacificke-etf': (f, t, fo) => /Asia|Pacific/.test(fo) || /Asia|Pacific/i.test(t),
        'nejlepsi-technologicke-etf': (f, t, fo) => /Technology|Semiconductor/.test(fo) || /Tech|Semiconductor|Nasdaq|Digital|Software|Information|Cloud|\bAI\b|Artificial Intelligence/i.test(t),
        'nejlepsi-healthcare-etf': (f, t, fo) => /Health/.test(fo) || /Health|Biotech|Pharma|Medical/i.test(t),
        'nejlepsi-financni-etf': (f, t, fo) => /Financials|Insurance/.test(fo),
        'nejlepsi-energeticke-etf': (f, t, fo) => /Energy/.test(fo),
        'nejlepsi-prumyslove-etf': (f, t, fo) => (/Industrials/.test(fo) || /Industrial|Industry|Manufacturing/i.test(f.name)) && !/Industrial Average/i.test(t),
        'nejlepsi-spotrebitelske-etf': (f, t, fo) => /Consumer/.test(fo) || /Consumer/i.test(t),
        'nejlepsi-infrastrukturni-etf': (f, t, fo) => /Infrastructure|Utilities/.test(fo) || /Infrastructure|Utilities/i.test(t),
        'nejlepsi-obnovitelne-zdroje-etf': (f, t, fo) => /Renewable|Clean|Alternative Energy/i.test(fo) || /Renewable|Clean Energy|New Energy|Green Energy|Solar|Wind|Hydrogen|Bioenergy|Energy Storage|Energy Transition/i.test(t),
        'nejlepsi-biotechnologie-etf': (f, t, fo) => /Biotech/i.test(fo) || /Biotech/i.test(t),
        'nejlepsi-cloud-etf': (f, t) => /Cloud/i.test(t),
        'nejlepsi-defense-etf': (f, t, fo) => /Defen[cs]e|Aerospace/i.test(fo) || /Defen[cs]e|Aerospace/i.test(t),
        'nejlepsi-kyberbezpecnost-etf': (f, t) => /Cyber|Security/i.test(t),
        'nejlepsi-robotika-etf': (f, t) => /Robot|Automation/i.test(t),
        'nejlepsi-ai-etf': (f) => /Artificial Intelligence|\bAI\b|Machine Learning|Big Data/i.test(f.name) && !/AI Enhanced|AI Optimized/i.test(f.name),
        'nejlepsi-komoditni-etf': (f, t, fo) => !/Cryptocurrenc/.test(fo) && !/Bitcoin|Ethereum|Solana|Crypto/i.test(f.name),
        'nejlepsi-zlato-etf': (f, t, fo) => /Gold/.test(fo),
        'nejlepsi-stribro-etf': (f, t, fo) => /Silver/.test(fo),
        'nejlepsi-ropa-etf': (f, t, fo) => /Oil|Energy/.test(fo) || /Oil|Brent|WTI/i.test(t),
        'nejlepsi-bitcoin-etf': (f, t) => /Bitcoin/i.test(t),
        'nejlepsi-realitni-etf': (f, t, fo) => /Real Estate/.test(fo) || /Real Estate|REIT|Property/i.test(t),
        'nejlepsi-nasdaq-etf': (f, t) => /Nasdaq/i.test(t),
        'nejlepsi-dax-etf': (f, t) => /\bDAX\b/i.test(t),
        'nejlepsi-ftse100-etf': (f, t) => /FTSE 100/i.test(t),
        'nejlepsi-stoxx600-etf': (f, t) => /STOXX Europe 600|STOXX 600/i.test(t),
        'nejlepsi-sp500-etf': (f, t) => /S&P 500/i.test(t),
      };
      const n8 = { karty: [], tabulka: [], nejde: [] };
      for (const [slug, patri] of Object.entries(KAT8)) {
        const h = await html8(`/nejlepsi-etf/${slug}`);
        if (!h) { n8.nejde.push(`${slug}: stránka se nenačetla`); continue; }
        const tab = [...new Set([...h.matchAll(/isin\\":\\"([A-Z]{2}[A-Z0-9]{10})\\",\\"nazev/g)].map((m) => m[1]))];
        const v = h.match(/data-sekce="vybrane"[\s\S]*?<\/section>/)?.[0] ?? '';
        const karty = [...new Set([...v.matchAll(/href="\/etf\/([A-Z0-9]{12})"/g)].map((m) => m[1]))];
        const isiny = [...new Set([...tab, ...karty])];
        if (!isiny.length) { n8.nejde.push(`${slug}: bez fondů v datech stránky`); continue; }
        const db = [];
        for (let i = 0; i < isiny.length; i += 150) {
          const r = await fetch(`${URL_DB}?select=isin,name,index_name,investment_focus&isin=in.(${isiny.slice(i, i + 150).join(',')})`, hlav8).then((x) => x.json());
          if (Array.isArray(r)) db.push(...r);
        }
        const podle = new Map(db.map((f) => [f.isin, f]));
        const ok = (i) => { const f = podle.get(i); return !f || patri(f, `${f.name ?? ''} ${f.index_name ?? ''}`, String(f.investment_focus ?? '')); };
        const popis = (i) => { const f = podle.get(i); return `${i} ${String(f?.name ?? '').slice(0, 55)} (${f?.investment_focus ?? '—'})`; };
        for (const i of karty.filter((x) => !ok(x))) n8.karty.push(`${slug}: karta ${popis(i)}`);
        const mimo = tab.filter((x) => !ok(x));
        if (tab.length && mimo.length / tab.length > 0.05) n8.tabulka.push(`${slug}: ${mimo.length} z ${tab.length} mimo kategorii, např. ${mimo.slice(0, 3).map(popis).join('; ')}`);
      }
      if (n8.karty.length) nalez8(`Karta žebříčku s fondem mimo kategorii (kolo8 A) – filtr v src/lib/etf-data.ts (categoryConfigs): ${n8.karty.length}`, n8.karty.slice(0, 10));
      if (n8.tabulka.length) varovani.push({ co: `Tabulka žebříčku: víc než 5 % fondů neodpovídá kategorii podle názvu/indexu/zaměření (kolo8 A) – prověřit filtr: ${n8.tabulka.length}`, ukazka: n8.tabulka.slice(0, 12) });
      if (n8.nejde.length) varovani.push({ co: `Kontrolu kategorií žebříčků (kolo8 A) nešlo u části stránek provést: ${n8.nejde.length}`, ukazka: n8.nejde.slice(0, 6) });
    } catch (e) {
      varovani.push({ co: `Kontrolu kategorií žebříčků (kolo8 A) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // B) výnosy tříd téhož fondu
    try {
      const PRAH8 = { '1y': 1.5, '3y': 3, '5y': 5 }; // % poměru růstu (1+a)/(1+b) − 1, stejně jako src/lib/tridyFondu.ts
      const skutecne = [...readFileSync('src/lib/tridyFondu.ts', 'utf8').matchAll(/\['([A-Z]{2}[A-Z0-9]{10})', '([A-Z]{2}[A-Z0-9]{10})'\]/g)].map((m) => [m[1], m[2]]);
      if (skutecne.length < 2) throw new Error('ROZDIL_TRID_SKUTECNY v src/lib/tridyFondu.ts nenalezen');
      const neov = new Set([...readFileSync('src/lib/vynosNeovereny.ts', 'utf8').matchAll(/'([A-Z]{2}[A-Z0-9]{10})': \{ ticker:/g)].map((m) => m[1]));
      const fondy8 = [];
      for (let od = 0; od < 20000; od += 1000) {
        const r = await fetch(`${URL_DB}?select=isin,name,fund_provider,primary_ticker,returns_as_of,return_1y,return_3y,return_5y,is_leveraged&scraping_date=gte.${new Date(Date.now() - 30 * 864e5).toISOString()}&name=not.is.null&order=isin&offset=${od}&limit=1000`, hlav8).then((x) => x.json());
        if (!Array.isArray(r)) throw new Error('DB (kolo8 B)');
        fondy8.push(...r);
        if (r.length < 1000) break;
      }
      // Nezávislý klíč „stejný fond, jiná třída“ (záměrně jinak než klicTridy): emitent + název před ETF/ETC + zbytek bez
      // závorek a slov třídy; měnově zajištěné třídy (Hedged, PfHdg, EAH, hEUR, H-CHF, (H)) a páka mimo.
      const TRIDA8 = /\b(acc|accumulating|accumulation|dist|dis|distributing|distribution|inc|income|capitalisation|[0-9]?[a-z]|usd|eur|gbp|chf|jpy|dr|class)\b/gi;
      const klic8 = (f) => {
        const n = String(f.name ?? '');
        if (f.is_leveraged || /hedg|hdg|\bEAH\b|\bh(eur|usd|gbp|chf)\b|\bH-[A-Z]{3}\b|\(H\)/i.test(n)) return null;
        const m = n.match(/^(.*?)\b(?:UCITS\s+)?(?:ETF|ETC|ETP|ETN)\b(.*)$/i);
        if (!m) return null;
        const zbytek = m[2].replace(/\(.*?\)/g, ' ').replace(TRIDA8, ' ').replace(/[^a-z0-9]+/gi, ' ').trim().toLowerCase();
        return `${f.fund_provider}|${m[1].toLowerCase().replace(/\s+/g, ' ').trim()}|${zbytek}`;
      };
      const api8 = await fetch(`${WEB_URL}/api/etf/screener`).then((x) => x.json()).catch(() => null);
      const radky8 = Array.isArray(api8) ? api8 : api8?.rows;
      if (!Array.isArray(radky8) || radky8.length < 1000) throw new Error('/api/etf/screener se nenačetl');
      const web8 = new Map(radky8.map((r) => [r.isin, r]));
      const skupiny8 = new Map();
      for (const f of fondy8) { const k = klic8(f); if (k && f.returns_as_of) skupiny8.set(k, [...(skupiny8.get(k) ?? []), f]); }
      const pomer = (a, b) => Math.abs((1 + a / 100) / (1 + b / 100) - 1) * 100;
      const vidi = [], jinyDen = [];
      for (const g of skupiny8.values()) {
        if (g.length < 2 || skutecne.some((par) => g.some((f) => par.includes(f.isin)))) continue;
        for (const o of Object.keys(PRAH8)) {
          const s = g.filter((f) => f[`return_${o}`] != null && web8.has(f.isin));
          for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length; j++) {
            const a = s[i], b = s[j], va = Number(a[`return_${o}`]), vb = Number(b[`return_${o}`]);
            if (pomer(va, vb) <= PRAH8[o]) continue;
            const wa = web8.get(a.isin)[`return_${o}`], wb = web8.get(b.isin)[`return_${o}`];
            if (wa == null || wb == null) continue; // aspoň jedna třída už má „—“
            const popis = `${a.primary_ticker ?? a.isin} ${va.toFixed(1)} % vs ${b.primary_ticker ?? b.isin} ${vb.toFixed(1)} % (${o}; ${String(a.name).slice(0, 45)})`;
            if (String(a.returns_as_of).slice(0, 10) === String(b.returns_as_of).slice(0, 10)) vidi.push(`${popis} – srovnávač ukazuje obě`);
            else if (pomer(va, vb) > 3 * PRAH8[o] && !neov.has(a.isin) && !neov.has(b.isin)) jinyDen.push(`${popis}, výnosy k ${String(a.returns_as_of).slice(0, 10)} a ${String(b.returns_as_of).slice(0, 10)}`);
          }
        }
      }
      // Bez vlastní značky nasazení: srovnávač (API) se počítá při každém nasazení znovu a pravidlo tříd je v něm od kola 8.
      const tridyNasazeny = radky8.some((r) => r.isin === 'LU2089238898' && r._vynX);
      if (vidi.length) (tridyNasazeny ? poplach : varovani).push({ co: `Třídy téhož fondu ukazují výnosy ke stejnému dni, které se liší nad práh (kolo8 B; pravidlo vynosTridNesedi v src/lib/tridyFondu.ts je nechytilo) – ověřit burzou a doplnit OVERENY_VYNOS_TRIDY / ROZDIL_TRID_SKUTECNY${tridyNasazeny ? '' : ' (produkce ještě bez pravidla)'}: ${vidi.length}`, ukazka: vidi.slice(0, 10) });
      if (jinyDen.length) varovani.push({ co: `Třídy téhož fondu s výnosy k různým dnům se liší víc, než pohyb trhu za pár dní vysvětlí (kolo8 B) – ověřit burzou, chybnou přidat do NEOVERENE_VYNOSY (druh 'burza'): ${jinyDen.length}`, ukazka: jinyDen.slice(0, 10) });
    } catch (e) {
      varovani.push({ co: `Kontrolu výnosů tříd téhož fondu (kolo8 B) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // C) detail fondů z NEOVERENE_VYNOSY: důvod „Výnosy za období neukazujeme“ (vzorek 6 – každý druh + USAC)
    try {
      const seznam8 = [...readFileSync('src/lib/vynosNeovereny.ts', 'utf8').matchAll(/'([A-Z]{2}[A-Z0-9]{10})': \{ ticker: '([^']*)', druh: '(\w+)'/g)].map((m) => ({ isin: m[1], ticker: m[2], druh: m[3] }));
      // Lokálně vzorek každého druhu + USAC; na produkci jen fondy z pevné sady (HASH, druh skok).
      const vzorekVse = [...new Map(seznam8.map((z) => [z.druh, z])).values(), ...seznam8.filter((z) => z.ticker === 'USAC')];
      const vzorek = R.produkce ? seznam8.filter((z) => R.PROD_DETAILY.includes(z.isin)) : vzorekVse;
      if (R.produkce) R.jenLokalne(`Kolo 8 C: detail neověřených výnosů – vzorek každého druhu jen lokálně, na produkci ${vzorek.map((z) => z.ticker).join(', ') || 'nic'}`);
      const chybi = [];
      for (const z of vzorek) {
        const t = text8(await html8(`/etf/${z.isin}`));
        if (!t) { chybi.push(`${z.ticker}: detail se nenačetl`); continue; }
        if (!/Výnosy za období neukazujeme/.test(t)) chybi.push(`${z.isin} ${z.ticker} (${z.druh}): detail bez důvodu „Výnosy za období neukazujeme“`);
        if (z.druh === 'skok' && /Max\. pokles\s+−9\d,\d/.test(t)) chybi.push(`${z.isin} ${z.ticker}: detail ukazuje max. pokles ze skoku v řadě zdroje`);
      }
      if (chybi.length) nalez8(`Detail fondu s ověřeně chybným výnosem zdroje (NEOVERENE_VYNOSY) bez „—“ a důvodu (kolo8 C): ${chybi.length}`, chybi);
    } catch (e) {
      varovani.push({ co: `Kontrolu detailu neověřených výnosů (kolo8 C) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }

    // D) žebříčky – texty, odpověď nahoře, velikost stránky
    try {
      const chyby = [];
      if (levne8 && /\d+ největších fondů/.test(text8(levne8))) chyby.push('nejlevnejsi-etf: „… největších fondů“ – tabulka je 300 NEJLEVNĚJŠÍCH');
      const PET = ['nejlepsi-etf-2026', 'nejlepsi-sp500-etf', 'nejlepsi-americke-etf', 'nejlepsi-akumulacni-etf', 'nejlevnejsi-etf'];
      const vety = new Map();
      let velikost2026 = null;
      for (const slug of PET) {
        const h = slug === 'nejlevnejsi-etf' ? levne8 : await html8(`/nejlepsi-etf/${slug}`);
        if (slug === 'nejlepsi-etf-2026' && h) velikost2026 = Buffer.byteLength(h);
        const odp = text8(h.match(/data-odpoved="zebricek"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '');
        for (const v of odp.split(/(?<=\.)\s+(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ])/).filter((x) => x.length > 20)) {
          const k = v.replace(/\d[\d\s,.]*/g, '#');
          vety.set(k, [...(vety.get(k) ?? []), slug]);
        }
      }
      for (const [v, sl] of vety) if (sl.length > 1) chyby.push(`odpověď nahoře se opakuje na ${sl.join(', ')}: „${v.slice(0, 80)}…“`);
      if (velikost2026 != null && velikost2026 > 600_000) chyby.push(`/nejlepsi-etf/nejlepsi-etf-2026 má ${Math.round(velikost2026 / 1000)} KB HTML (limit 600 KB; rychlé odkazy a řádky tabulky – kolo 8)`);
      if (chyby.length) nalez8(`Žebříčky – texty a velikost (kolo8 D): ${chyby.length}`, chyby);
    } catch (e) {
      varovani.push({ co: `Kontrolu textů žebříčků (kolo8 D) se nepodařilo provést: ${e.message}`, ukazka: [] });
    }
  }
  // --- konec kolo8 zebricky ---

  // --- audit texty --- (audit nástrojů 22. 10. 2026; pravidlo č. 1, bod 4 – každá oprava má kontrolu)
  //  Statické texty a výpočty na stránkách (src/app/**/page.tsx): V4 /pruvodce (vzorec v kódu; čísla hlídá kolo6 bod 7),
  //  V5 /investovani-pro-deti „ani ne třetina“ (35,2 %), N5 OG obrázek natvrdo, N4 kumulativní „5 let“, V6 odpočet úroků
  //  300 000 Kč jen u bydlení pořízeného do 2020, V10 Vanguard („~1–2 % ročně“ → konečná hodnota se stranou studie),
  //  S1 „7 % = historický průměr“ / „~5 % reálně“, S2 výhrada k pravidlu 4 %, S4 neexistující přepínač, S5/N2/N3 /kalkulacka,
  //  S20 dvě různá 60/40, S21 Monte Carlo „úspěch renty“, zakázané texty (undefined/NaN/Infinity).
  //  Konstanty a vzorce jsou NEZÁVISLÉ na kódu webu (ruční přepočet, primární zdroje) – ne import z webu (kruh).
  //  Značka nasazení: data-priklad-vzorec na /pruvodce; bez ní (produkce před nasazením) jen varování.
  {
    const chyby = [];
    let nasazenoA = false;
    try {
      const vemA = async (cesta) => { try { const r = await fetch(`${WEB_URL}${cesta}`); return { status: r.status, html: (await r.text()).replace(/<!-- -->/g, '') }; } catch { return { status: 0, html: '' }; } };
      const textA = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;| |⁠/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/\s+/g, ' ');
      const cestyA = ['/pruvodce', '/investovani-pro-deti', '/dip', '/hypotecni-kalkulacka', '/dca-vs-jednorazova', '/kolik-investovat-mesicne',
        '/kalkulacka', '/fire', '/fire-kalkulacka', '/monte-carlo', '/pravidlo-4-procent'];
      const SA = new Map(await Promise.all(cestyA.map(async (c) => [c, await vemA(c)])));
      const HA = (c) => SA.get(c)?.html ?? '';
      const TA = (c) => textA(HA(c));
      nasazenoA = /data-priklad-vzorec="/.test(HA('/pruvodce'));
      for (const [c, { status }] of SA) if (status !== 200) chyby.push(`${c}: HTTP ${status}`);
      // Nezávislá anuita: vklad na konci měsíce, efektivní měsíční sazba (1 + r)^(1/12) − 1.
      const fvA = (pmt, r, roky) => { const m = (1 + r) ** (1 / 12) - 1; return pmt * (((1 + m) ** (roky * 12) - 1) / m); };

      // Zakázané texty na všech stránkách bloku (4A.6 souhrnu auditu).
      for (const c of cestyA) { const z = TA(c).match(/.{0,30}\b(undefined|NaN|Infinity)\b.{0,20}/); if (z) chyby.push(`${c}: „${z[0].trim()}“`); }

      // V4 – zdroj: příklad poplatků nesmí počítat r − TER (stránka i knihovna).
      const pruvodceSrc = readFileSync('src/app/pruvodce/page.tsx', 'utf8') + readFileSync('src/lib/prikladPoplatku.ts', 'utf8');
      if (/hrubyVynos\s*-\s*P\.ter|rocne\s*-\s*ter\b/.test(pruvodceSrc)) chyby.push('/pruvodce: poplatek počítaný jako r − TER (má být (1 + r)(1 − TER) − 1)');

      // V5 – /investovani-pro-deti: podíl „start v 9 letech / od narození“ z dat stránky, nezávisle přepočtený (7 %, 1 000 Kč).
      const deti = HA('/investovani-pro-deti'), detiT = TA('/investovani-pro-deti');
      const pozde = Number(deti.match(/data-pozde="(\d+)"/)?.[1] ?? NaN), vcas = Number(deti.match(/data-vcas="(\d+)"/)?.[1] ?? NaN);
      const ocek18 = fvA(1000, 0.07, 18), ocek9 = fvA(1000, 0.07, 9); // 420 918 / 148 291 → 35,2 %
      if (nasazenoA && (Math.abs(pozde - ocek9) > 2 || Math.abs(vcas - ocek18) > 2)) chyby.push(`/investovani-pro-deti: 9 let ${pozde} / 18 let ${vcas}, přepočet ${Math.round(ocek9)} / ${Math.round(ocek18)}`);
      const podil = ocek9 / ocek18;
      if (podil > 1 / 3 && /ani ne třetin/.test(detiT)) chyby.push(`/investovani-pro-deti: „ani ne třetina výsledku“, ale podíl je ${(podil * 100).toFixed(1)} %`);
      if (nasazenoA && !detiT.includes(`(${Math.round(podil * 100)} %)`)) chyby.push(`/investovani-pro-deti: věta o odkladu neuvádí podíl ${Math.round(podil * 100)} %`);
      // N5 – OG obrázek: číslo z výpočtu, ne natvrdo v kódu.
      if (/stat:\s*'\d/.test(readFileSync('src/app/investovani-pro-deti/page.tsx', 'utf8'))) chyby.push('src/app/investovani-pro-deti/page.tsx: číslo v OG obrázku natvrdo');
      const og = decodeURIComponent((deti.match(/property="og:image" content="([^"]+)"/)?.[1] ?? '').replace(/&amp;/g, '&').replace(/\+/g, ' '));
      const ogStat = og.match(/stat=([^&]+)/)?.[1]?.replace(/\s/g, '');
      if (ogStat && ogStat !== `${Math.round(ocek18).toLocaleString('cs-CZ')}Kč`.replace(/\s/g, '')) chyby.push(`/investovani-pro-deti: OG obrázek „${ogStat}“ ≠ přepočet ${Math.round(ocek18)} Kč`);
      // N4 – sloupec výnosu za 5 let je kumulativní → musí to být napsané.
      for (const c of ['/dip', '/investovani-pro-deti']) if (nasazenoA && /Výnos za 5 let|5 let \(Kč\)/.test(TA(c)) && !/5 let celkem|kumulativní/.test(TA(c))) chyby.push(`${c}: sloupec „5 let (Kč)“ bez označení, že je kumulativní`);

      // V6 – odpočet úroků z hypotéky (§ 15 odst. 4 ZDP: 150 000 Kč; 300 000 Kč jen u bydlení pořízeného před 1. 1. 2021,
      //      čl. IV body 3–4 zákona č. 386/2020 Sb.). Hlídá text i JSON-LD (FAQ).
      const hypo = HA('/hypotecni-kalkulacka').replace(/&nbsp;| |\\u00a0/g, ' ');
      for (const m of hypo.matchAll(/(300 000|45 000) Kč/g)) {
        const okoli = hypo.slice(Math.max(0, m.index - 250), m.index + 250);
        if (!/2020|2021/.test(okoli)) { chyby.push(`/hypotecni-kalkulacka: „${m[0]}“ bez výhrady „bydlení pořízené do konce 2020“`); break; }
      }
      if (!/150 000 Kč/.test(hypo)) chyby.push('/hypotecni-kalkulacka: chybí strop odpočtu úroků 150 000 Kč (§ 15 odst. 4 ZDP)');

      // V10 – DCA: rozdíl je v konečné hodnotě (Vanguard 2023 str. 5: +1,8 % po 1 roce; 2012 str. 4: +2,3 % po 10 letech).
      const dca = HA('/dca-vs-jednorazova');
      if (/1–2 % ročně|1-2 % ročně/.test(dca)) chyby.push('/dca-vs-jednorazova: „~1–2 % ročně“ (studie uvádějí rozdíl konečné hodnoty, ne roční výnos)');
      if (nasazenoA && !/Vanguard 2023[^"]{0,120}str\. 5/.test(dca)) chyby.push('/dca-vs-jednorazova: FAQ bez citace Vanguard 2023, str. 5');

      // S1 – modelový výnos ≠ „historický průměr“; /fire = předpoklad FIRE kalkulačky.
      for (const c of ['/kolik-investovat-mesicne', '/dip', '/investovani-pro-deti']) {
        const t = TA(c);
        if (/historický průměr|historicky vynášel|dlouhodobý průměr/.test(t)) chyby.push(`${c}: 7 % vydávané za historický průměr (je to modelový předpoklad)`);
        if (nasazenoA && !HA(c).includes('href="/kolik-vydelaly-etf"')) chyby.push(`${c}: chybí odkaz na skutečné výnosy v Kč (/kolik-vydelaly-etf)`);
      }
      const fireT = TA('/fire');
      if (/reálný výnos ~5 %/.test(fireT)) chyby.push('/fire: „reálný výnos ~5 %“ (FIRE kalkulačka počítá vyvážené 60/40 s 4,6 %)');
      const fireSrc = readFileSync('src/lib/firePredpoklady.ts', 'utf8');
      const predpoklad = Number(fireSrc.match(/moderate:\s*\{\s*realnyVynos:\s*([\d.]+)/)?.[1] ?? NaN) / 100;
      const naFire = Number(HA('/fire').match(/data-fire-realny-vynos="([\d.]+)"/)?.[1] ?? NaN);
      if (nasazenoA && Math.abs(naFire - predpoklad) > 1e-9) chyby.push(`/fire: reálný výnos v tabulce ${naFire} ≠ FIRE kalkulačka ${predpoklad}`);
      // Tabulka „roky do FIRE“: nezávislý vzorec n = ln(1 + 25(1 − s)r/s) / ln(1 + r) pro 50 % úspor.
      if (nasazenoA && Number.isFinite(predpoklad)) {
        const n50 = Math.log(1 + (25 * 0.5 * predpoklad) / 0.5) / Math.log(1 + predpoklad);
        const zobr = fireT.match(/50 % ~(\d+(?:,\d)?) (?:let|roku)/)?.[1];
        const ocek = n50 < 15 ? Math.round(n50 * 2) / 2 : Math.round(n50);
        if (zobr && Number(zobr.replace(',', '.')) !== ocek) chyby.push(`/fire: 50 % úspor „~${zobr}“, přepočet ${ocek} (${n50.toFixed(2)})`);
      }

      // S2 + S4 – /kolik-investovat-mesicne.
      const kim = HA('/kolik-investovat-mesicne'), kimT = TA('/kolik-investovat-mesicne');
      if (nasazenoA && (!/data-vyhrada-4-procenta/.test(kim) || !kim.includes('href="/pravidlo-4-procent"'))) chyby.push('/kolik-investovat-mesicne: renta „300× výdaje“ bez výhrady a odkazu na /pravidlo-4-procent');
      if (/přepnete|si přepnete/.test(kimT)) chyby.push('/kolik-investovat-mesicne: „reálnou hodnotu si přepnete“ – přepínač neexistuje');

      // S5, N2, N3 – /kalkulacka.
      const kal = HA('/kalkulacka'), kalT = TA('/kalkulacka');
      if (/Výnosy přepočtené do Kč/.test(kalT)) chyby.push('/kalkulacka: „Výnosy přepočtené do Kč“ (je to model se zadaným výnosem)');
      const rozdil = Number(kal.match(/data-model-rozdil="(\d+)"/)?.[1] ?? NaN);
      if (nasazenoA) {
        // Nezávisle: 250 000 Kč + 12 500 Kč na konci měsíce, 30 let, 7 % hrubě, TER z hodnoty fondu (1,07 × (1 − TER)).
        const beh = (ter) => { const m = (1.07 * (1 - ter)) ** (1 / 12) - 1; let v = 250000; for (let i = 0; i < 360; i++) v = v * (1 + m) + 12500; return v; };
        const ocekRozdil = beh(0.002) - beh(0.018); // ≈ 4 416 696 Kč
        if (Math.abs(rozdil - ocekRozdil) > 2) chyby.push(`/kalkulacka: modelový rozdíl ${rozdil}, přepočet ${Math.round(ocekRozdil)}`);
        const heroText = textA(kal.match(/data-model-rozdil="\d+"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '').trim();
        if (!/ 000 Kč$/.test(heroText)) chyby.push(`/kalkulacka: hero rozdíl „${heroText}“ není na tisíce jako widget`);
        if (!/100 000 Kč/.test(kalT) || !/každý nákup zvlášť/.test(kalT)) chyby.push('/kalkulacka: daně bez hodnotového testu 100 000 Kč nebo bez „časový test pro každý nákup zvlášť“');
      }

      // S20 – dvě různá 60/40 musí být pojmenovaná; S21 – Monte Carlo neumí výběry z renty.
      if (nasazenoA && !/40 % americké dluhopisy \(fond iShares Core US Aggregate Bond – AGG/.test(TA('/pravidlo-4-procent'))) chyby.push('/pravidlo-4-procent: 60/40 bez pojmenování dluhopisů (AGG, jiné než FIRE/modelové portfolio s XGLE)');
      if (nasazenoA && !/dluhopisy americké \(fond AGG\)/.test(TA('/fire-kalkulacka'))) chyby.push('/fire-kalkulacka: chybí rozlišení 60/40 (XGLE) od 60/40 v /pravidlo-4-procent (AGG)');
      if (/úspěchu renty/.test(fireT)) chyby.push('/fire: Monte Carlo „pravděpodobnost úspěchu renty“ – simulátor výběry neumí');
      if (/načasování propadů/.test(TA('/monte-carlo'))) chyby.push('/monte-carlo: „riziko nepříznivého načasování propadů“ v důchodu – simulátor výběry neumí');
      if (/historickým ročním výnosem|historický roční výnos|historickými dolarovými výnosy/.test(TA('/monte-carlo'))) chyby.push('/monte-carlo: výnosy aktiv vydávané za historické (V3 – nejsou doložené)');
    } catch (e) {
      varovani.push({ co: `Kontrolu audit texty se nepodařilo provést: ${e.message}`, ukazka: chyby.slice(0, 5) });
    }
    if (chyby.length) (nasazenoA ? poplach : varovani).push({ co: `Texty a statické výpočty (audit nástrojů 22. 10.)${nasazenoA ? '' : ' – produkce ještě bez oprav (před nasazením)'}: ${chyby.length} nálezů`, ukazka: chyby.slice(0, 25) });
  }
  // --- konec audit texty ---

  // --- audit naklady --- (22. 10. 2026; pravidlo č. 1, bod 4 – každá oprava má kontrolu)
  // Nezávislý audit nákladů brokerů našel: V13 IBKR „od 74 Kč“ za 2 000 Kč nebyla spodní hranice (automatická směna
  // 0,03 % bez minima), V14 XTB „platba kartou 0,77 % / 0,70 %“ podle staré tabulky (od 20. 10. 2026 kartou zdarma),
  // S14 hero „nejlevnější nad 16 100 Kč DEGIRO“ (skutečně od 16 177 Kč), S15 DEGIRO ETF Selection = Tradegate, ne Xetra.
  // Ceníkové konstanty jsou tu ZÁMĚRNĚ opsané z oficiálních ceníků (ověřeno 22. 10. 2026), ne z src/data/brokerData.ts –
  // kontrola nesmí kopírovat kód webu (kruh). Při změně ceníku je nutné změnit obojí; rozdíl = poplach = správně.
  //   A) XTB: nejnovější „tabulkapoplatkuaprovizi<DDMMRRRR>.pdf“ na xtb.com/cz/obchodni-podminky novější než
  //      CENIKY_OVERENY → POPLACH (XTB vydává tabulku ~měsíčně; 90denní varování nestačí).
  //   B) /kde-koupit (kurz ČNB dnes): IBKR za 2 000 Kč ≤ 32 Kč a ±2 % od nezávislého vzorce; řádky T212/XTB/DEGIRO
  //      shodně se vzorcem; hranice T212/DEGIRO v hero (data-hranice) = 1 EUR / 0,15 % na celé koruny.
  //   C) Recenze: součet IBKR příkladu ≤ 32 Kč a = součet částí; /recenze/xtb bez „kartou … 0,77“; DEGIRO „Tradegate“.
  //   D) Zdroj: brokerData.ts má IBKR autoProcento, DEGIRO burzaNakupu Tradegate a cnxRocneMaxEur.
  // Značka nasazení: data-hranice na /kde-koupit; bez ní B–C jen varování (produkce ještě bez oprav).
  {
    const chybyN = [];
    const varN = [];
    try {
      const bd = readFileSync('src/data/brokerData.ts', 'utf8');
      const overeno = bd.match(/CENIKY_OVERENY = '(\d{4}-\d{2}-\d{2})'/)?.[1];
      // D) zdroj
      if (!/autoProcento:\s*0\.03/.test(bd)) chybyN.push('brokerData.ts: IBKR bez automatické směny 0,03 % (autoProcento) – „od“ by nebyla spodní hranice (V13)');
      if (!/burzaNakupu:\s*'Tradegate'/.test(bd)) chybyN.push('brokerData.ts: DEGIRO ETF Selection bez burzy Tradegate (S15)');
      if (!/cnxRocneMaxEur/.test(bd)) chybyN.push('brokerData.ts: DEGIRO bez poplatku za CNX (Přehled poplatků str. 10, pozn. 2)');
      const bc = readFileSync('src/components/design-preview/brokerContent.ts', 'utf8');
      // Zakázané: placený vklad kartou („platba kartou ale stojí 0,77 %“); povolené: „kartou je zdarma, přes PayU 0,77 %“.
      const KARTA_PLACENA = /kartou (ale )?stojí|kartou[^.;"<]{0,12}\d+,\d+[\s ]?%/;
      if (KARTA_PLACENA.test(bc)) chybyN.push('brokerContent.ts: XTB „kartou 0,77 %“ – od tabulky z 20. 10. 2026 je vklad kartou zdarma (V14)');

      // A) XTB – novější tabulka poplatků než ověření
      try {
        const xtb = await fetch('https://www.xtb.com/cz/obchodni-podminky', { headers: { 'User-Agent': 'Mozilla/5.0 (etfpruvodce.cz kontrola ceniku)' } }).then((r) => (r.ok ? r.text() : ''));
        const data = [...xtb.matchAll(/tabulkapoplatkuaprovizi(\d{2})(\d{2})(\d{4})\.pdf/g)].map((m) => `${m[3]}-${m[2]}-${m[1]}`).sort();
        if (!data.length) varN.push('XTB: na xtb.com/cz/obchodni-podminky jsem nenašel žádnou „tabulkapoplatkuaprovizi…pdf“ – stránka se změnila, ověřit ručně');
        else if (overeno && data[data.length - 1] > overeno) poplach.push({ co: `XTB vydala novou tabulku poplatků (${data[data.length - 1]}), ceníky brokerů ověřeny ${overeno} – projít změny (vklady, směna, provize) a aktualizovat src/data/brokerData.ts + CENIKY_OVERENY`, ukazka: [`https://www.xtb.com/cz/soubory/tabulkapoplatkuaprovizi${data[data.length - 1].split('-').reverse().join('')}.pdf`] });
      } catch (e) { varN.push(`XTB seznam tabulek poplatků se nepodařilo stáhnout: ${e.message}`); }

      // B) a C) živý web
      const vem = async (c) => { try { const r = await fetch(`${WEB_URL}${c}`); return r.ok ? await r.text() : ''; } catch { return ''; } };
      const [kde, recIbkr, recXtb, recDegiro] = await Promise.all(['/kde-koupit', '/recenze/ibkr', '/recenze/xtb', '/recenze/degiro'].map(vem));
      const nasazeno = /data-hranice="/.test(kde);
      const listek = await fetch('https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt').then((r) => r.text());
      const kurzN = (kod) => { const r = listek.split('\n').find((x) => x.split('|')[3] === kod); if (!r) return NaN; const p = r.split('|'); return Number(p[4].replace(',', '.')) / Number(p[2]); };
      const EUR = kurzN('EUR'), USD = kurzN('USD');
      if (!Number.isFinite(EUR) || !Number.isFinite(USD)) throw new Error('kurzovní lístek ČNB se nepodařilo přečíst');
      // Nezávislý vzorec z ceníků (22. 10. 2026). IBKR Tiered Německo 0,05 % (min. 1,25, max. 29 EUR) + Xetra vypořádání
      // 0,02 EUR + 0,0008 % + regulační 0,01 EUR; směna min(automatická 0,03 %, ruční max(0,002 %, 2 USD)).
      const model = {
        trading212: (kc) => 0.0015 * kc,
        xtb: (kc) => 0.005 * kc,
        degiro: () => 1 * EUR,
        ibkr: (kc) => { const e = kc / EUR; return (Math.min(Math.max(0.0005 * e, 1.25), 29) + 0.03 + 0.000008 * e) * EUR + Math.min(0.0003 * kc, Math.max(0.00002 * kc, 2 * USD)); },
      };
      const tol = (v) => Math.max(1, 0.02 * v); // kurz stránky (ISR 1 den) může být o den starší než dnešní lístek
      const cil = nasazeno ? chybyN : varN;
      // B) /kde-koupit – výchozí částka kalkulačky 2 000 Kč
      for (const m of kde.matchAll(/<tr[^>]*data-broker="([^"]+)"[^>]*>/g)) {
        const id = m[1];
        const nakup = Number(m[0].match(/data-za-nakup="(\d+)"/)?.[1]);
        if (!model[id] || !Number.isFinite(nakup)) continue;
        const ocek = model[id](2000);
        if (Math.abs(nakup - ocek) > tol(ocek)) cil.push(`/kde-koupit ${id}: za 2 000 Kč ${nakup} Kč, nezávislý vzorec ${ocek.toFixed(2)} Kč`);
        if (id === 'ibkr' && nakup > 32) cil.push(`/kde-koupit ibkr: za 2 000 Kč ${nakup} Kč > 32 Kč – automatická směna 0,03 % se nepočítá (V13)`);
        if (id === 'ibkr') {
          // Rok: 12 × poplatek + levnější z (automatická směna u každého nákupu, jedna ruční směna celé roční částky).
          const e = 2000 / EUR, prov = (Math.min(Math.max(0.0005 * e, 1.25), 29) + 0.03 + 0.000008 * e) * EUR;
          const rokOcek = 12 * prov + Math.min(12 * Math.min(0.0003 * 2000, Math.max(0.00002 * 2000, 2 * USD)), Math.max(0.00002 * 24000, 2 * USD));
          const rok = Number(m[0].match(/data-za-rok="(\d+)"/)?.[1]);
          if (Number.isFinite(rok) && Math.abs(rok - rokOcek) > tol(rokOcek)) cil.push(`/kde-koupit ibkr: za rok ${rok} Kč, nezávislý vzorec ${rokOcek.toFixed(2)} Kč`);
        }
      }
      const hranice = [...kde.matchAll(/data-nejlevnejsi-broker="([a-z0-9]+)" data-hranice="(\d+)"/g)].map((m) => ({ id: m[1], kc: Number(m[2]) }));
      const hDeg = hranice.find((h) => h.id === 'degiro');
      const hOcek = Math.ceil(EUR / 0.0015);
      if (nasazeno && !hDeg) chybyN.push('/kde-koupit: hero bez hranice „Nejlevnější od … DEGIRO“ (data-hranice)');
      if (hDeg && Math.abs(hDeg.kc - hOcek) > Math.max(1, 0.02 * hOcek)) cil.push(`/kde-koupit hero: hranice T212/DEGIRO ${hDeg.kc} Kč, ze vzorce 1 EUR / 0,15 % = ${hOcek} Kč (S14)`);
      if (hDeg && !new RegExp(`od ${hDeg.kc.toLocaleString('cs-CZ').replace(/\s/g, '[\\s\\u00a0]')}[\\s\\u00a0]Kč`).test(kde.replace(/&nbsp;|&#160;/g, ' '))) cil.push(`/kde-koupit hero: zobrazená hranice ≠ data-hranice ${hDeg.kc}`);
      if (/nad 16[\s ]100[\s ]Kč/.test(kde)) cil.push('/kde-koupit: „nad 16 100 Kč“ (krok 100 Kč místo spočítané hranice)');
      if (nasazeno && !/Tradegate/.test(kde)) chybyN.push('/kde-koupit: chybí „Tradegate“ u DEGIRO ETF Selection (S15)');
      // C) recenze
      const pr = recIbkr.match(/data-priklad="([^"]*)"/)?.[1];
      if (pr) {
        const [celkem, provize, smena] = pr.split('|').map((x) => (x === '' ? null : Number(x)));
        if (celkem != null && celkem > 32) cil.push(`/recenze/ibkr: příklad za 2 000 Kč „od ${celkem} Kč“ > 32 Kč (V13)`);
        if (celkem != null && smena != null && Math.abs(celkem - (provize + smena)) > 0.051) cil.push(`/recenze/ibkr: ${celkem} ≠ ${provize} + ${smena}`);
      }
      // B2) /srovnani-brokeru – spočítaný řádek „Nákup za 5 000 Kč celkem“ (3.6, 11. 11. 2026) proti nezávislému vzorci.
      //     Fio: směnu ceník neuvádí → jen „od“ poplatek 3,95 EUR (do 1 400 EUR objemu). Celkem = součet zaokrouhlených částí.
      {
        const sb = await vem('/srovnani-brokeru');
        const radky5 = [...sb.matchAll(/data-broker="([a-z0-9]+)"[^>]*>\s*<span[^>]*data-priklad="([^"]*)" data-priklad-castka="(\d+)"/g)];
        for (const [, id, hodnota, castka] of radky5) {
          const kc = Number(castka);
          const [celkem, provize, smena] = hodnota.split('|').map((x) => (x === '' ? null : Number(x)));
          if (celkem != null && smena != null && Math.abs(celkem - (provize + smena)) > 0.051) cil.push(`/srovnani-brokeru ${id}: nákup za ${kc} Kč ${celkem} ≠ ${provize} + ${smena}`);
          if (id === 'fio') {
            const ocek = (kc / EUR <= 1400 ? 3.95 : kc / EUR <= 3000 ? 4.95 : Math.max(0.0015 * kc / EUR, 6.95)) * EUR;
            if (celkem != null || smena != null) cil.push(`/srovnani-brokeru fio: směna má být neznámá („od“), stránka ${hodnota}`);
            if (Math.abs(provize - ocek) > tol(ocek)) cil.push(`/srovnani-brokeru fio: poplatek za ${kc} Kč ${provize} Kč, nezávislý vzorec ${ocek.toFixed(2)} Kč`);
            continue;
          }
          if (!model[id]) continue;
          const ocek = model[id](kc);
          if (celkem == null || Math.abs(celkem - ocek) > tol(ocek)) cil.push(`/srovnani-brokeru ${id}: nákup za ${kc} Kč ${celkem} Kč, nezávislý vzorec ${ocek.toFixed(2)} Kč`);
        }
        // Před nasazením řádek na produkci není → tiché přeskočení; po nasazení musí mít všech 5 brokerů.
        if (radky5.length && radky5.length !== 5) cil.push(`/srovnani-brokeru: řádek „Nákup za 5 000 Kč“ má ${radky5.length} brokerů místo 5`);
      }
      if (KARTA_PLACENA.test(recXtb.replace(/&nbsp;|&#160;/g, ' '))) cil.push('/recenze/xtb: „platba kartou 0,77 %“ – vklad kartou je od 20. 10. 2026 zdarma (V14)');
      if (nasazeno && !/Tradegate/.test(recDegiro)) chybyN.push('/recenze/degiro: chybí „Tradegate“ (ETF Selection, S15)');
      if (!nasazeno) varN.push('Audit nákladů: produkce ještě nemá opravy (bez data-hranice na /kde-koupit) – živé kontroly jen jako varování');
    } catch (e) {
      varN.push(`Kontrolu „audit naklady“ se nepodařilo provést: ${e.message}`);
    }
    if (chybyN.length) poplach.push({ co: `Náklady brokerů (audit 22. 10. 2026): ${chybyN.length} nálezů`, ukazka: chybyN.slice(0, 12) });
    if (varN.length) varovani.push({ co: `Náklady brokerů (audit 22. 10. 2026) – varování: ${varN.length}`, ukazka: varN.slice(0, 12) });
  }
  // --- konec audit naklady ---

  // --- audit backtest --- (audit nástrojů 22. 10. 2026: K1, V8, V9, V15, S8–S12, S17, S18, N9–N11)
  // Zlaté případy s PEVNÝM koncem 2026-10-21. Očekávané hodnoty = NEZÁVISLÝ přepočet (Yahoo adj. close × kurzy ČNB,
  // bezriziková sazba z holých dat ČNB/ECB/FRED, CPI z holého CSV ČSÚ; skript auditora sim.py + overeni.py) – ne replika
  // enginu. Tolerance: konečná hodnota ±0,6 % (kurzy ČNB vs. ECB v DB), CAGR ±0,07 p. b., kolísavost ±0,1 p. b., max. pokles
  // ±0,25 p. b. (60/40 ±0,05 – S9), Sharpe ±0,03, Sortino ±0,05, VaR ±0,3 p. b. API se volá nejvýš ~18× (rate limit).
  // Před nasazením (API bez `metodika`) jdou neshody jen do varování – produkce ještě počítá postaru.
  {
    const chyby = [], upoz = [];
    // Neshody v REPU a v DATECH (pravidla kvízu, CPI, sazby, texty, DB) = poplach hned; neshody živého API/stránky jen po nasazení.
    const chybyRepo = [];
    const sim = (telo) => fetch(`${WEB_URL}/api/backtest/simulate`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(telo) })
      .then(async (r) => ({ status: r.status, j: await r.json().catch(() => null) })).catch(() => ({ status: 0, j: null }));
    const slozky = (o) => Object.entries(o).map(([c, w]) => ({ isin: c, name: c, indexCode: c, weight: w, ter: 0 }));
    const DO = '2026-10-21';
    const pct = (x) => (x == null ? null : x * 100);
    const blizko = (id, klic, web, ocek, tol) => {
      if (web == null || !Number.isFinite(web)) chyby.push(`${id}: ${klic} chybí (${web})`);
      else if (Math.abs(web - ocek) > tol) chyby.push(`${id}: ${klic} ${+web.toFixed(4)} ≠ ${ocek} (±${tol})`);
    };
    const blizkoRel = (id, klic, web, ocek, tol = 0.006) => {
      if (!(web > 0)) chyby.push(`${id}: ${klic} chybí (${web})`);
      else if (Math.abs(web / ocek - 1) > tol) chyby.push(`${id}: ${klic} ${Math.round(web).toLocaleString('cs-CZ')} ≠ ${ocek.toLocaleString('cs-CZ')} (±${tol * 100} %)`);
    };
    let nasazeno = false;
    try {
      // 1) S&P 500 v Kč 2005 → 2026-10-21, 100 000 Kč (backtest-01): výnos, riziko, Sharpe/Sortino/VaR (S10, N10, N11),
      //    měsíční výnosy a horizonty z MĚSÍČNÍ řady (S11), inflace (S18).
      const b1 = await sim({ portfolio: slozky({ sp500: 1 }), startDate: '2005-01-01', endDate: DO, initialAmount: 100000, currency: 'CZK', rebalancingStrategy: 'yearly' });
      nasazeno = b1.j?.metodika === '2026-10-22';
      const s1 = b1.j?.summary ?? {};
      blizkoRel('S&P Kč 2005', 'konečná hodnota', s1.netAssetValue, 916909);
      blizko('S&P Kč 2005', 'CAGR %', pct(s1.cagr), 10.701, 0.07);
      blizko('S&P Kč 2005', 'kolísavost %', pct(s1.standardDeviation), 14.13, 0.1);
      blizko('S&P Kč 2005', 'max. pokles %', pct(b1.j?.risk?.maxDrawdown?.depth), -52.84, 0.25);
      blizko('S&P Kč 2005', 'Sharpe (rf ČNB 2T repo)', s1.sharpeRatio, 0.648, 0.03);
      blizko('S&P Kč 2005', 'Sortino', s1.sortinoRatio, 1.002, 0.05);
      blizko('S&P Kč 2005', 'VaR 95 % (měsíční)', pct(b1.j?.risk?.valueAtRisk95), -12.15, 0.3);
      if (b1.j?.evolution?.[0]?.date?.slice(0, 10) !== '2005-01-03') chyby.push(`S&P Kč 2005: první den ${b1.j?.evolution?.[0]?.date?.slice(0, 10)} ≠ 2005-01-03`);
      const tm = b1.j?.returns?.totalMonths;
      if (!(tm >= 260 && tm <= 264)) chyby.push(`S11: měsíčních výnosů ${tm} (má být ~262 = měsíce, ne obchodní dny)`);
      blizko('S11 horizont 1 rok', 'podíl kladných %', pct(b1.j?.horizons?.[0]?.percentagePositive), 79.3, 2);
      blizko('S18 inflace 2005', 'reálný CAGR %', pct(b1.j?.inflation?.realCAGR), 7.275, 0.05);

      // 2) USD a EUR: Sharpe s bezrizikovou sazbou MĚNY (fed funds, EONIA/€STR), ne 2 % (S10).
      const b2 = await sim({ portfolio: slozky({ sp500: 1 }), startDate: '2005-01-01', endDate: DO, initialAmount: 100000, currency: 'USD', rebalancingStrategy: 'yearly' });
      blizkoRel('S&P USD 2005', 'konečná hodnota', b2.j?.summary?.netAssetValue, 954744, 0.002);
      blizko('S&P USD 2005', 'CAGR %', pct(b2.j?.summary?.cagr), 10.907, 0.05);
      blizko('S&P USD 2005', 'Sharpe (rf fed funds)', b2.j?.summary?.sharpeRatio, 0.66, 0.02);
      const b9 = await sim({ portfolio: slozky({ sp500: 0.9, us_treasury_1_3y: 0.1 }), startDate: '2002-07-30', endDate: DO, initialAmount: 10000, currency: 'EUR', rebalancingStrategy: 'yearly' });
      blizkoRel('90/10 EUR 2002', 'konečná hodnota', b9.j?.summary?.netAssetValue, 97328);
      blizko('90/10 EUR 2002', 'Sharpe (rf EONIA/€STR)', b9.j?.summary?.sharpeRatio, 0.701, 0.03);
      if (b1.j?.summary && b2.j?.summary && Math.abs(b1.j.summary.cagr - b2.j.summary.cagr) < 1e-6) chyby.push('CAGR v Kč = CAGR v USD (přepočet měny chybí)');

      // 3) S9: 60/40 – dno 1. 3. 2023 se nesmí vynechat (max. pokles −20,72 %, ne −20,5 %).
      const b4 = await sim({ portfolio: slozky({ ftse_all_world: 0.6, eur_govt_bond: 0.4 }), startDate: '2008-06-26', endDate: DO, initialAmount: 100000, currency: 'CZK', rebalancingStrategy: 'yearly' });
      blizko('60/40 2008', 'max. pokles %', pct(b4.j?.risk?.maxDrawdown?.depth), -20.72, 0.05);
      if (b4.j?.risk?.maxDrawdown?.troughDate?.slice(0, 10) !== '2023-03-01') chyby.push(`60/40: dno ${b4.j?.risk?.maxDrawdown?.troughDate?.slice(0, 10)} ≠ 2023-03-01 (vynechaný 1. den v měsíci?)`);
      blizkoRel('60/40 2008', 'konečná hodnota', b4.j?.summary?.netAssetValue, 386832);
      blizko('60/40 2008', 'CAGR %', pct(b4.j?.summary?.cagr), 7.664, 0.07);

      // 4) S8: 0 Kč + 2 000 Kč měsíčně od 1/2010 – vklad i první den (404 000 Kč, ne 402 000).
      const b11 = await sim({ portfolio: slozky({ sp500: 1 }), startDate: '2010-01-01', endDate: DO, initialAmount: 0, currency: 'CZK', rebalancingStrategy: 'yearly', contributions: { amount: 2000, frequency: 'monthly' } });
      if (b11.j?.summary?.amountInvested !== 404000) chyby.push(`S8: 0 + 2 000 Kč/měs. od 1/2010 vloženo ${b11.j?.summary?.amountInvested} ≠ 404 000`);
      blizkoRel('S8 0 + 2 000 Kč', 'konečná hodnota', b11.j?.summary?.netAssetValue, 1652910);

      // 5) V8: období kratší než rok – žádné „% ročně“, kolísavost/Sharpe/Sortino/VaR „—“ (null), celkový výnos ≈ +5,4 %.
      const b42 = await sim({ portfolio: slozky({ sp500: 1 }), startDate: '2026-09-01', endDate: DO, initialAmount: 100000, currency: 'CZK', rebalancingStrategy: 'yearly', contributions: { amount: 5000, frequency: 'monthly' } });
      const s42 = b42.j?.summary ?? {};
      if (s42.cagr != null) chyby.push(`V8: start 1. 9. 2026 vrací roční zhodnocení ${(s42.cagr * 100).toFixed(1)} % (pod rok se neanualizuje)`);
      for (const k of ['standardDeviation', 'sharpeRatio', 'sortinoRatio']) if (s42[k] != null) chyby.push(`V8: start 1. 9. 2026 vrací ${k} = ${s42[k]} (z méně než 12 měsíců má být null)`);
      if (b42.j?.risk?.valueAtRisk95 != null) chyby.push(`V8: start 1. 9. 2026 vrací VaR ${b42.j.risk.valueAtRisk95}`);
      blizko('V8 krátké období', 'celkový výnos %', pct(s42.celkovyVynos), 5.39, 0.3);
      if (s42.amountInvested !== 105000) chyby.push(`V8: vloženo ${s42.amountInvested} ≠ 105 000`);

      // 6) V9: součet vah 99,5 % → 400; 100,005 % (zaokrouhlení) → normalizace = stejný výsledek jako 100 %.
      const b44 = await sim({ portfolio: slozky({ sp500: 0.995 }), startDate: '2005-01-01', endDate: DO, initialAmount: 100000, currency: 'CZK' });
      if (b44.status !== 400 && !(Math.abs(pct(b44.j?.summary?.cagr) - 10.701) < 0.07)) chyby.push(`V9: váha 0,995 → status ${b44.status}, CAGR ${pct(b44.j?.summary?.cagr)?.toFixed(2)} % (má být 400 nebo 10,70 %)`);
      const bn = await sim({ portfolio: slozky({ sp500: 1.00005 }), startDate: '2005-01-01', endDate: DO, initialAmount: 100000, currency: 'CZK', rebalancingStrategy: 'yearly' });
      if (bn.status !== 200 || Math.abs((bn.j?.summary?.netAssetValue ?? 0) - (s1.netAssetValue ?? -1)) > 0.01) chyby.push(`V9: váha 1,00005 (zaokrouhlení) se nenormalizuje (status ${bn.status}, ${bn.j?.summary?.netAssetValue} vs ${s1.netAssetValue})`);

      // 7) Vklady, vyvažování, poplatek, EUR (regrese zlatých případů backtest-07/12/14/17/18/20).
      const b7 = await sim({ portfolio: slozky({ sp500: 0.6, msci_eafe: 0.4 }), startDate: '2002-01-01', endDate: DO, initialAmount: 50000, currency: 'CZK', rebalancingStrategy: 'yearly', contributions: { amount: 3000, frequency: 'monthly' } });
      if (b7.j?.summary?.amountInvested !== 941000) chyby.push(`backtest-07: vloženo ${b7.j?.summary?.amountInvested} ≠ 941 000`);
      blizkoRel('backtest-07', 'konečná hodnota', b7.j?.summary?.netAssetValue, 3989775);
      const b12 = await sim({ portfolio: slozky({ ftse_all_world: 1 }), startDate: '2010-03-15', endDate: DO, initialAmount: 20000, currency: 'CZK', rebalancingStrategy: 'yearly', contributions: { amount: 6000, frequency: 'quarterly' } });
      if (b12.j?.summary?.amountInvested !== 422000) chyby.push(`backtest-12: vloženo ${b12.j?.summary?.amountInvested} ≠ 422 000`);
      blizkoRel('backtest-12', 'konečná hodnota', b12.j?.summary?.netAssetValue, 1281298);
      const b14 = await sim({ portfolio: slozky({ sp500: 0.6, us_aggregate_bond: 0.4 }), startDate: '2005-01-01', endDate: DO, initialAmount: 100000, currency: 'CZK', rebalancingStrategy: 'monthly' });
      blizkoRel('backtest-14', 'konečná hodnota', b14.j?.summary?.netAssetValue, 504667);
      blizko('backtest-14', 'max. pokles %', pct(b14.j?.risk?.maxDrawdown?.depth), -37.98, 0.25);
      const b17 = await sim({ portfolio: [{ isin: 'x', name: 'x', indexCode: 'ftse_all_world', weight: 1, ter: 0, feeOverride: 0.0014 }], startDate: '2008-06-26', endDate: DO, initialAmount: 100000, currency: 'CZK', rebalancingStrategy: 'yearly' });
      blizkoRel('backtest-17 poplatek 0,14 %', 'konečná hodnota', b17.j?.summary?.netAssetValue, 652317);
      const b20 = await sim({ portfolio: slozky({ sp500: 1 }), startDate: '2005-01-01', endDate: DO, initialAmount: 4000, currency: 'EUR', rebalancingStrategy: 'yearly', contributions: { amount: 200, frequency: 'monthly' } });
      if (b20.j?.summary?.amountInvested !== 56200) chyby.push(`backtest-20: vloženo ${b20.j?.summary?.amountInvested} ≠ 56 200`);
      blizkoRel('backtest-20 EUR', 'konečná hodnota', b20.j?.summary?.netAssetValue, 349745);

      // 8) S18: inflace od 2000 z MĚSÍČNÍHO CPI ČSÚ (faktor 1/2000 → 9/2026 = 159,2 / 71,6 = 2,2235).
      const b8 = await sim({ portfolio: slozky({ sp500: 1 }), startDate: '2000-01-03', endDate: DO, initialAmount: 100000, currency: 'CZK', rebalancingStrategy: 'yearly' });
      blizko('S&P Kč 2000', 'max. pokles %', pct(b8.j?.risk?.maxDrawdown?.depth), -71.71, 0.25);
      blizkoRel('S&P Kč 2000', 'konečná hodnota', b8.j?.summary?.netAssetValue, 512620);
      const roky8 = b8.j?.summary?.obdobiLet;
      if (roky8 > 0) blizko('S18 inflace 2000', 'inflace % ročně', pct(b8.j?.inflation?.inflationRate), (Math.pow(2.2235, 1 / roky8) - 1) * 100, 0.02);
    } catch (e) {
      chyby.push(`API backtestu nešlo ověřit: ${e.message}`);
    }

    // 9) K1: kvíz porovnává propady ze STEJNÉHO období – všechny data-kontrola-backtest mají stejné start=.
    //    Fakt o délce propadu na delší historii (data-kontrola-backtest-historie) = API se stejnými vstupy.
    try {
      const html = await fetch(`${WEB_URL}/vyber-etf`).then((r) => (r.ok ? r.text() : ''));
      const starty = [...new Set([...html.matchAll(/data-kontrola-backtest="([^"]+)"/g)].map((m) => new URL(m[1].replace(/&amp;/g, '&').split('|')[0], WEB_URL).searchParams.get('start')))];
      const kvizNasazen = /data-kontrola-backtest-historie=/.test(html);
      if (starty.length > 1) (kvizNasazen ? chyby : upoz).push(`K1 /vyber-etf: propady z různých období (start ${starty.join(', ')})`);
      const hist = html.match(/data-kontrola-backtest-historie="([^"]+)"/)?.[1]?.replace(/&amp;/g, '&');
      if (hist) {
        const [odkaz, , navStr] = hist.split('|');
        const q = new URL(odkaz, WEB_URL).searchParams;
        const r = await sim({ portfolio: slozky({ sp500: 1 }), startDate: q.get('start'), endDate: q.get('do'), initialAmount: 100000, currency: 'CZK', rebalancingStrategy: 'yearly' });
        if (!(Math.abs((r.j?.summary?.netAssetValue ?? 0) / Number(navStr) - 1) <= 0.001)) chyby.push(`/vyber-etf fakt S&P 500 od 2000: stránka ${Math.round(Number(navStr))} vs. backtest ${Math.round(r.j?.summary?.netAssetValue ?? 0)}`);
      } else if (kvizNasazen) chyby.push('/vyber-etf: chybí kontrolní údaj faktu o délce propadu');
    } catch (e) {
      upoz.push(`Kvíz /vyber-etf nešlo ověřit: ${e.message}`);
    }

    // 10) V15 + S17: pravidla kvízu pro VŠECH 162 kombinací odpovědí (čistá funkce, Node ≥ 22.18 načte .ts sám).
    try {
      const { recommend, CATS } = await import(new URL('../src/components/design-preview/vyberEtfData.ts', import.meta.url).href);
      let n = 0;
      for (const horizon of ['short', 'mid', 'long']) for (const risk of ['low', 'mid', 'high'])
        for (const focus of ['world', 'usa', 'europe', 'dividends', 'tech', 'esg']) for (const payout of ['acc', 'dist', 'idk']) {
          n++;
          const o = recommend({ horizon, risk, focus, payout }), id = `${horizon}/${risk}/${focus}/${payout}`;
          if (!CATS[o.key]) chybyRepo.push(`kvíz ${id}: neznámá kategorie ${o.key}`);
          if (horizon === 'short' && (o.key !== 'bonds' || !o.upozorneni.includes('kratky'))) chybyRepo.push(`kvíz ${id}: krátký horizont bez dluhopisů/upozornění`);
          if (horizon === 'mid' && !o.upozorneni.includes('stredni-horizont')) chybyRepo.push(`kvíz ${id}: 3–10 let bez upozornění na délku propadu (V15)`);
          if (horizon !== 'short' && risk === 'mid' && o.portfolia !== 'umirnena') chybyRepo.push(`kvíz ${id}: „střední výkyvy“ bez portfolií s dluhopisy (V15)`);
          if (horizon !== 'short' && risk === 'low' && o.portfolia !== 'konzervativni') chybyRepo.push(`kvíz ${id}: „nechci velké propady“ bez konzervativních portfolií`);
          if (o.portfolia == null && o.key !== 'bonds' && !(risk === 'high' && horizon === 'long') && !o.upozorneni.includes('stredni-horizont')) chybyRepo.push(`kvíz ${id}: 100 % akcie bez varování`);
          if (focus === 'dividends' && payout === 'acc' && !o.upozorneni.includes('prijem-reinvestice')) chybyRepo.push(`kvíz ${id}: příjem + reinvestice bez upozornění na rozpor (S17)`);
        }
      if (n !== 162) chybyRepo.push(`kvíz: otestováno ${n} kombinací místo 162`);
    } catch (e) {
      upoz.push(`Pravidla kvízu nešlo načíst (Node bez type stripping?): ${e.message}`);
    }

    // 11) S18: CPI v inflation.ts měsíčně od 1/1996 bez děr a roční průměry = publikovaná míra inflace ČSÚ (nezávislá kotva).
    try {
      const infl = readFileSync('src/lib/backtest/inflation.ts', 'utf8');
      const cpi = Object.fromEntries([...infl.matchAll(/'(\d{4}-\d{2})': (\d+(?:\.\d+)?),/g)].map((m) => [m[1], Number(m[2])]));
      const MIRA = { 1997: 8.5, 1998: 10.7, 1999: 2.1, 2000: 3.9, 2001: 4.7, 2002: 1.8, 2003: 0.1, 2004: 2.8, 2005: 1.9, 2006: 2.5, 2007: 2.8, 2008: 6.3, 2009: 1.0, 2010: 1.5, 2011: 1.9, 2012: 3.3, 2013: 1.4, 2014: 0.4, 2015: 0.3, 2016: 0.7, 2017: 2.5, 2018: 2.1, 2019: 2.8, 2020: 3.2, 2021: 3.8, 2022: 15.1, 2023: 10.7, 2024: 2.4, 2025: 2.5 };
      const prum = (y) => { const v = Array.from({ length: 12 }, (_, i) => cpi[`${y}-${String(i + 1).padStart(2, '0')}`]); return v.every((x) => x > 0) ? v.reduce((a, b) => a + b, 0) / 12 : null; };
      if (!cpi['1996-01']) chybyRepo.push('S18: inflation.ts nemá měsíční CPI od 1/1996 (CEN0101B)');
      for (const [y, m] of Object.entries(MIRA)) {
        const a = prum(Number(y)), p = prum(Number(y) - 1);
        if (a == null || p == null) { chybyRepo.push(`S18: CPI za ${y} nebo ${Number(y) - 1} neúplné`); continue; }
        if (Math.abs((a / p - 1) * 100 - m) > 0.15) chybyRepo.push(`S18: inflace ${y} z inflation.ts ${((a / p - 1) * 100).toFixed(2)} % ≠ ČSÚ ${m} %`);
      }
      // Texty, které po přechodu na měsíční CPI neplatí (stránky mimo backtest – opraví jejich vlastník).
      for (const [soubor, vzor] of [['src/app/metodika/page.tsx', /starší roky z průměrné roční míry inflace/], ['src/app/jak-dlouho-v-minusu/page.tsx', /dříve z ročních průměrů/]]) {
        try { if (vzor.test(readFileSync(soubor, 'utf8'))) chybyRepo.push(`${soubor}: text tvrdí, že CPI před 2015 je z ročních průměrů – od 22. 10. 2026 je měsíční (ČSÚ CEN0101B)`); } catch { /* soubor nemusí existovat */ }
      }
      // S8: bez počátečního vkladu jde první měsíční vklad už první den dat (1. 7. 2008), ne v srpnu.
      try {
        if (/od srpna 2008/.test(readFileSync('src/app/kolik-vydelaly-etf/page.tsx', 'utf8'))) chybyRepo.push('src/app/kolik-vydelaly-etf/page.tsx: „od srpna 2008“ – od opravy S8 (22. 10. 2026) je první z měsíčních vkladů 1. 7. 2008 („od července 2008“)');
      } catch { /* soubor nemusí existovat */ }
      // Bezriziková sazba: řady aktuální (měsíc nejvýš 3 měsíce starý) a kotva ČNB 2T repo 6/2023 = 7,00 %.
      const rf = readFileSync('src/lib/backtest/bezrizikovaSazba.ts', 'utf8');
      const czk = rf.match(/CZK: \{([\s\S]*?)\n  \}/)?.[1] ?? '';
      if (!/'2023-06': 7(\.0)?,/.test(czk)) chybyRepo.push('S10: bezriziková sazba CZK 6/2023 ≠ 7,00 % (2T repo ČNB)');
      const posledni = [...czk.matchAll(/'(\d{4}-\d{2})':/g)].map((m) => m[1]).sort().at(-1);
      const hranice = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 3, 1)).toISOString().slice(0, 7);
      if (!posledni || posledni < hranice) upoz.push(`Bezriziková sazba (Sharpe) končí ${posledni} – spusťte scripts/backtest/generuj-cpi-a-sazby.py`);
      // CPI (8. 11. 2026, režim bez údržby): ČSÚ zveřejní měsíc zhruba do 15. dne následujícího → víc než 3 měsíce pozadu
      // = nikdo nedoplnil; reálné výnosy by končily dřív než data (engine za posledním CPI reálná čísla neukáže).
      const posledniCpi = Object.keys(cpi).sort().at(-1);
      if (!posledniCpi || posledniCpi < hranice) upoz.push(`CPI (reálné výnosy) končí ${posledniCpi} – spusťte scripts/backtest/generuj-cpi-a-sazby.py`);
    } catch (e) {
      upoz.push(`Statickou kontrolu CPI/sazeb nešlo provést: ${e.message}`);
    }

    // 12) S9: v denních řadách nejsou body o víkendu / 1. 1. / 25. 12. (úklid 18. 10. 2026; engine je od 22. 10. jen vynechává).
    try {
      const hl = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
      for (const kod of ['sp500', 'ftse_all_world']) {
        const dny = [];
        for (let od = 0; ; od += 1000) {
          const b = await fetch(`${URL_DB.replace('etf_funds', 'index_historical_data')}?select=date&index_code=eq.${kod}&date=gte.2000-01-01&order=date&limit=1000&offset=${od}`, hl).then((r) => r.json());
          if (!Array.isArray(b)) throw new Error(`DB ${kod}`);
          dny.push(...b.map((x) => x.date)); if (b.length < 1000) break;
        }
        const spatne = dny.filter((d) => { const t = new Date(`${d}T00:00:00Z`); return [0, 6].includes(t.getUTCDay()) || d.endsWith('-01-01') || d.endsWith('-12-25'); });
        if (spatne.length) chybyRepo.push(`S9: ${kod} má ${spatne.length} bodů v nepracovní den (${spatne.slice(0, 3).join(', ')}) – vadný zdroj v DB`);
      }
    } catch (e) {
      upoz.push(`Kontrolu nepracovních dnů v DB nešlo provést: ${e.message}`);
    }

    if (chyby.length) (nasazeno ? poplach : varovani).push({ co: `Audit backtestu (zlaté případy, do ${DO})${nasazeno ? '' : ' – produkce ještě bez oprav z 22. 10. 2026 (před nasazením)'}: ${chyby.length} neshod`, ukazka: chyby.slice(0, 20) });
    if (chybyRepo.length) poplach.push({ co: `Audit backtestu – pravidla kvízu, CPI, sazby a data v DB: ${chybyRepo.length} neshod`, ukazka: chybyRepo.slice(0, 20) });
    if (upoz.length) varovani.push({ co: 'Audit backtestu: upozornění', ukazka: upoz.slice(0, 10) });
  }
  // --- konec audit backtest ---

  // ── výstup ──
  const souhrn = `${n} fondů · čerstvých za 3 dny ${(100 * cerstve / n).toFixed(0)} % · starších 30 dní ${(100 * stare30.length / n).toFixed(1)} %`;
  // Pojistka ISR (scripts/lib/cil.mjs): pokus o dynamickou stránku mimo pevnou sadu = poplach (požadavek neodešel).
  if (R.poruseni.length) poplach.push({ co: `Kontrola by na produkci zapisovala do ISR: ${R.poruseni.length} požadavků na detail fondu / dvojici mimo pevnou sadu (neodeslány) – použij reprezentanta z PROD_DETAILY nebo R.jenLokalne() (scripts/lib/cil.mjs)`, ukazka: [...new Set(R.poruseni)].slice(0, 10) });
  const radky = [`# Kontrola dat fondů`, '', souhrn, '', ...R.souhrn().map((r) => (r.startsWith('  - ') ? r : `_${r}_`)), ''];
  radky.push(poplach.length ? `## 🚨 POPLACH (${poplach.length})` : '## ✅ Žádný poplach – přísun dat funguje');
  for (const p of poplach) radky.push(`- **${p.co}**`, ...p.ukazka.map((u) => `  - \`${u}\``));
  radky.push('', `## ⚠️ Varování (${varovani.length}) – známé nedostatky kvality`);
  for (const v of varovani) radky.push(`- ${v.co}`, ...v.ukazka.map((u) => `  - \`${u}\``));
  const text = radky.join('\n');
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
  if (poplach.length) process.exit(1);
};

main().catch((e) => { console.error('❌', e.message); process.exit(1); });

// --- kolo7 mobil --- (22. 10. 2026; pravidlo č. 1, bod 4 – každá oprava má kontrolu)
// Mobilní layout a drobnosti v článcích. Vlastní funkční test mobilního hledání (našeptávač + Enter, Chromium i WebKit)
// je v prohlížeči: scripts/prod-smoke.mjs („MOBIL hledání“) – tady jen to, co jde poznat z HTML a zdrojů.
// Značka nasazení: panel poplatků na /infografiky (data-infografika="ter"); bez ní jen varování.
async function kontrolaKolo7Mobil(poplach, varovani) {
  const chyby = [];
  try {
    const vem = async (cesta) => { try { const r = await fetch(`${WEB_URL}${cesta}`); return { status: r.status, html: (await r.text()).replace(/<!-- -->/g, '') }; } catch { return { status: 0, html: '' }; } };
    const text = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|\u00a0|\u2060/g, ' ').replace(/\s+/g, ' ');
    const cesty = ['/infografiky', '/pruvodce', '/kolik-vydelaly-etf', '/jak-zacit', '/kalkulacky', '/metodika', '/srovnani/vwce-vs-cspx',
      '/srovnani/porovnani?isins=IE00B5BMR087,IE00BK5BQT80'];
    const S = new Map(await Promise.all(cesty.map(async (c) => [c, await vem(c)])));
    const H = (c) => S.get(c)?.html ?? '';
    const T = (c) => text(H(c));
    const nasazeno = /data-infografika="ter"/.test(H('/infografiky'));
    for (const [c, { status }] of S) if (status !== 200) chyby.push(`${c}: HTTP ${status}`);

    // a) Zbloudilé JSX proměnné v textu („…riziko ztráty. 2026“ na /pruvodce) a literál „{year}“.
    for (const c of cesty) if (/\{\s*year\s*\}/.test(T(c))) chyby.push(`${c}: v textu je „{year}“`);
    if (/riziko ztráty\.\s*\d{4}/.test(T('/pruvodce'))) chyby.push('/pruvodce: za upozorněním „riziko ztráty.“ visí letopočet');

    // b) /kolik-vydelaly-etf: grafy bez pevné min. šířky (na mobilu useknuté), gramatika, začátek dat.
    const kv = H('/kolik-vydelaly-etf'), kvt = T('/kolik-vydelaly-etf');
    if (/min-w-\[5[26]0px\]/.test(kv)) chyby.push('/kolik-vydelaly-etf: graf s min-w 520/560 px (na mobilu se nevejde)');
    if (/\b[234] ztrátových|\b1 ztrátových|\b[234] kladných/.test(kvt)) chyby.push('/kolik-vydelaly-etf: „3 ztrátových“ (má být „3 ztrátové“)');
    if (/pod vkladem (leden|únor|březen|duben|květen|červen|červenec|srpen|září|říjen|listopad|prosinec) \d{4}/.test(kvt)) chyby.push('/kolik-vydelaly-etf: „pod vkladem červenec 2014“ (má být „v červenci 2014“)');
    if (/Na 10 letech/.test(kvt)) chyby.push('/kolik-vydelaly-etf: „Na 10 letech“');
    if (/od 1\. 7\., /.test(kvt)) chyby.push('/kolik-vydelaly-etf: neúplný rok „od 1. 7.“ – data začínají jindy (start z dat)');
    if (/\d+ měs\.(?! od vrcholu)/.test(kvt.replace(/\(počítáno od vrcholu\)/g, ''))) chyby.push('/kolik-vydelaly-etf: doba návratu bez „od vrcholu“');
    if (/rounded-2xl bg-slate-900 text-white/.test(kv)) chyby.push('/kolik-vydelaly-etf: tmavé hero – rodina „Co říkají data“ má světlé');

    // c) Drobnosti v textech a rozcestníku.
    if (/podhoubí/.test(T('/jak-zacit'))) chyby.push('/jak-zacit: „podhoubí“');
    for (const h of ['/stroj-casu', '/kolik-investovat-mesicne']) if (!H('/kalkulacky').includes(`href="${h}"`)) chyby.push(`/kalkulacky: chybí odkaz na ${h}`);
    // Datum úpravy textu /metodika (věcná změna 21. 10. 2026) – AutorBox „aktualizováno <time dateTime=…>“.
    const metUpr = H('/metodika').match(/aktualizováno <time dateTime="(\d{4}-\d{2}-\d{2})"/)?.[1];
    if (!metUpr || metUpr < '2026-10-21') chyby.push(`/metodika: datum úpravy ${metUpr ?? 'chybí'} – text se věcně změnil 21. 10. 2026 (src/lib/redakce.ts)`);

    // d) Porovnání a dvojice: patička zdroje, skloňování stáří, sjednocené názvy metrik.
    const por = T('/srovnani/porovnani?isins=IE00B5BMR087,IE00BK5BQT80');
    if (!/Data fondů: justETF · kurzy ČNB · data k \d/.test(por)) chyby.push('/srovnani/porovnani: chybí patička „Data fondů: justETF · kurzy ČNB · data k …“');
    for (const c of ['/srovnani/porovnani?isins=IE00B5BMR087,IE00BK5BQT80', '/srovnani/vwce-vs-cspx']) {
      const t = T(c);
      if (/(?<![Dd]o )\b[234] let\b/.test(t)) chyby.push(`${c}: „2–4 let“ (má být „roky“)`);
      if (/let na trhu|Domicil \(sídlo fondu\)|Kolísavost \(1 rok, v EUR\)/.test(t)) chyby.push(`${c}: starý název metriky (sjednoceno s porovnáním)`);
    }
    if (/>Replikace</.test(H('/srovnani/porovnani?isins=IE00B5BMR087,IE00BK5BQT80'))) chyby.push('/srovnani/porovnani: „Replikace“ místo „Způsob replikace“');
    // Pořadí (a tím barvy) kurátorské dvojice: SXR8,VWCE → VWCE první jako na /srovnani/vwce-vs-cspx.
    const iV = por.indexOf('VWCE'), iS = por.indexOf('SXR8');
    if (iV < 0 || iS < 0 || iV > iS) chyby.push('/srovnani/porovnani?isins=SXR8,VWCE: pořadí fondů neodpovídá stránce dvojice (jiné barvy)');

    // e) Infografiky: panel poplatků konzistentní, heatmapa s tickery, bez zrušených bloků.
    const inf = H('/infografiky'), inft = T('/infografiky');
    const infMain = text(inf.match(/<main[\s\S]*?<\/main>/)?.[0] ?? ''); // bez patičky (ta má vlastní „Kde koupit ETF“)
    if (/Co která infografika ukazuje/.test(inft)) chyby.push('/infografiky: blok „Co která infografika ukazuje“ (odstraněn)');
    if ((infMain.match(/Kde koupit ETF/g) ?? []).length > 1) chyby.push('/infografiky: duplicitní „Kde koupit ETF“');
    if (/>Nemovitosti</.test(inf)) chyby.push('/infografiky: „Nemovitosti“ – žebříček se jmenuje „Realitní“');
    if (nasazeno) {
      const pocet = Number(inf.match(/data-ter-pocet="(\d+)"/)?.[1] ?? 0);
      const blok = inf.match(/data-ter-pocet="\d+"[\s\S]*?<\/ul>/)?.[0] ?? '';
      const chipy = (blok.match(/href="\/etf\//g) ?? []).length;
      if (!pocet || pocet !== chipy) chyby.push(`/infografiky: „nejnižší TER má ${pocet} fondů“, vypsáno ${chipy}`);
      const dlazdice = (inf.match(/class="group rounded-lg border px-3 py-3[^"]*" href="\/nejlepsi-etf\//g) ?? []).length;
      if (dlazdice < 12) chyby.push(`/infografiky: heatmapa má jen ${dlazdice} dlaždic (čekáme 16)`);
      if (!/výnos největšího fondu žebříčku \(ticker pod číslem\) za 12 měsíců v Kč, k \d/.test(inft)) chyby.push('/infografiky: heatmapa bez data výnosů');
    }

    // f) Zdroj: osa grafu porovnání s levým okrajem podle popisku (dřív 40 px uřízlo „−“ u „−100 %“).
    const graf = readFileSync('src/components/design-preview/PorovnaniGraf.tsx', 'utf8');
    if (/const m = \{ l: 40,/.test(graf)) chyby.push('PorovnaniGraf.tsx: pevný levý okraj 40 px (uřízne znaménko)');
    // Mobilní hledání: MobileMenu musí používat sdílený HeaderSearch (ne vlastní <form action>, který se odpojoval z DOM).
    const mm = readFileSync('src/components/design-preview/MobileMenu.tsx', 'utf8');
    if (/<form[^>]*action=/.test(mm) || !/HeaderSearch varianta="mobil"/.test(mm)) chyby.push('MobileMenu.tsx: mobilní hledání bez HeaderSearch (varianta mobil) – vrací se nefunkční formulář');

    if (chyby.length) (nasazeno ? poplach : varovani).push({ co: `Mobil a texty (kolo 7)${nasazeno ? '' : ' – produkce ještě bez oprav (před nasazením)'}: ${chyby.length} nálezů`, ukazka: chyby.slice(0, 15) });
  } catch (e) {
    varovani.push({ co: `Kontrolu kolo7 mobil se nepodařilo provést: ${e.message}`, ukazka: chyby.slice(0, 5) });
  }
}
// --- konec kolo7 mobil ---

// --- kolo8 faktory --- (22. 10. 2026; pravidlo č. 1, bod 4 – každá oprava má kontrolu)
// Sekce /faktorove-etf měla čísla natvrdo z 13. 7. 2026 (před opravou dvojího TER), „S&P 500 stejné období“ na jiném okně
// než faktor (value „419 tis.“) a tvrzení, která vyvracela vlastní ročenka („2 ze 6 porazily index“, „každý faktor byl
// aspoň jednou nejlepší“, quality „2× z 12“, small cap „od 2014 ani jednou“). Teď vše z enginu (src/lib/faktory/vypocet.ts).
// 1) STATICKY: ve zdrojích sekce nesmí být natvrdo procenta, částky ani počty výher (výsledky patří do dat).
// 2) ŽIVĚ: „porazil / neporazil index“ sedí s čísly na stránce, S&P 500 má stejné okno jako faktor, přehled = detail,
//    tvrzení ročenky (kolikrát kdo vyhrál, kdo nikdy) sedí s tabulkou, typografie (minus, ne „case“), bez pevné šířky tabulek.
// Značka nasazení: data-sekce="faktory-tabulka" na /faktorove-etf; bez ní se živé nálezy hlásí jen jako varování.
async function kontrolaKolo8Faktory(poplach, varovani) {
  const chyby = [];
  const staticke = [];
  try {
    // 1) Statická kontrola zdrojů (bez komentářů a odkazů).
    const soubory = [];
    const projdi = (d) => { for (const n of readdirSync(d)) { const p = `${d}/${n}`; if (statSync(p).isDirectory()) projdi(p); else if (/\.tsx?$/.test(n)) soubory.push(p); } };
    projdi('src/app/faktorove-etf');
    soubory.push('src/components/design-preview/FactorDetail.tsx');
    const ZAKAZANE = [
      [/[+−-]\s?\d+(?:,\d+)?\s?%/, 'procento se znaménkem'],
      [/\d+,\d+\s?%/, 'desetinné procento'],
      [/\d+\s?tis\./, '„tis.“'],
      [/\d{1,3}(?:[\s ]\d{3})+\s?Kč/, 'částka v Kč'],
      [/\d+\s?×\s?z\s?\d+/, 'počet výher „N× z M“'],
      [/\d+(?:,\d+)?\s?p\.\s?b\./, 'procentní body'],
      [/\b\d+\s+ze?\s+\d+\s+(?:let|faktorů)/, '„N z M let/faktorů“'],
      [/\b(?:dva|dvě|tři)\s+ze\s+šesti\b/i, 'počet faktorů napevno'],
      [/Nejhorší case|Nejlepší case/, 'anglicismus „case“'],
    ];
    for (const s of soubory) {
      const zdroj = readFileSync(s, 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/^\s*\/\/.*$/gm, ' ')
        .replace(/\s\/\/ .*$/gm, ' ')
        .replace(/href=\{?['"`][^'"`]*['"`]\}?/g, ' ')
        .replace(/\['\/[^']*',/g, ' ');
      zdroj.split('\n').forEach((r, i) => { for (const [re, co] of ZAKAZANE) { const m = r.match(re); if (m) staticke.push(`${s}:${i + 1} ${co}: „${m[0]}“`); } });
      // Výpadek načtení fondů nesmí skončit v ISR cache jako hláška (9. 11. 2026: 3 detaily den bez fondů) –
      // nactiFondyFaktoru se nepolyká přes .catch(() => null), při null stránka vyhodí výjimku.
      if (/nactiFondyFaktoru\(\)\s*\.catch/.test(zdroj)) staticke.push(`${s}: nactiFondyFaktoru().catch(…) – výpadek DB by se uložil do ISR cache; při chybě vyhodit výjimku`);
    }

    // 2) Živá kontrola.
    const vem = async (cesta) => { try { const r = await fetch(`${WEB_URL}${cesta}`); return { status: r.status, html: (await r.text()).replace(/<!-- -->/g, '') }; } catch { return { status: 0, html: '' }; } };
    const text = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;| |⁠/g, ' ').replace(/\s+/g, ' ');
    const attr = (tag, a) => tag.match(new RegExp(`${a}="([^"]*)"`))?.[1] ?? null;
    const hub = await vem('/faktorove-etf');
    if (hub.status !== 200) throw new Error(`/faktorove-etf HTTP ${hub.status}`);
    const nasazeno = /data-sekce="faktory-tabulka"/.test(hub.html);
    if (nasazeno) {
      const ht = text(hub.html);
      const radky = [...hub.html.matchAll(/<tr[^>]*data-faktor="([a-z-]+)"[^>]*>([\s\S]*?)<\/tr>/g)].map((m) => ({
        slug: m[1], tag: m[0].slice(0, m[0].indexOf('>') + 1), obsah: text(m[2]),
      })).map((r) => ({ ...r, od: attr(r.tag, 'data-od'), do: attr(r.tag, 'data-do'), k: Number(attr(r.tag, 'data-konecna')), s: Number(attr(r.tag, 'data-sp-konecna')), v: attr(r.tag, 'data-vysledek') }));
      if (radky.length !== 6) chyby.push(`/faktorove-etf: v tabulce ${radky.length} faktorů (čekáno 6)`);
      for (const r of radky) {
        if (!r.v) { chyby.push(`/faktorove-etf ${r.slug}: čísla se nespočítala („—“)`); continue; }
        if (r.v === 'porazil' && !(r.k > r.s)) chyby.push(`/faktorove-etf ${r.slug}: „porazil index“, ale ${r.k} ≤ S&P 500 ${r.s}`);
        if (r.v === 'neporazil' && r.k > r.s) chyby.push(`/faktorove-etf ${r.slug}: „neporazil index“, ale ${r.k} > S&P 500 ${r.s}`);
        const stitek = r.v === 'porazil' ? 'porazil index' : r.v === 'nerozhodne' ? 'zhruba jako index' : 'neporazil index';
        if (!r.obsah.includes(stitek)) chyby.push(`/faktorove-etf ${r.slug}: štítek nesedí s výsledkem (${r.v})`);
      }
      // Stejné okno = stejný S&P 500 (value a small cap mají stejný start – musí mít i stejný S&P 500).
      const podleOkna = new Map();
      for (const r of radky.filter((x) => x.od)) {
        const kl = `${r.od}|${r.do}`;
        if (podleOkna.has(kl) && podleOkna.get(kl) !== r.s) chyby.push(`/faktorove-etf: stejné okno ${kl}, ale různý S&P 500 (${podleOkna.get(kl)} vs ${r.s})`);
        podleOkna.set(kl, r.s);
      }
      if (new Set(radky.map((r) => r.do)).size > 1) chyby.push(`/faktorove-etf: faktory končí různými dny (${[...new Set(radky.map((r) => r.do))].join(', ')})`);
      // Hero a OG obrázek: kdo porazil index = řádky s „porazil“.
      const porazily = radky.filter((r) => r.v === 'porazil').map((r) => r.slug).sort();
      const hero = hub.html.match(/data-porazily="([^"]*)"/)?.[1];
      if (hero != null && hero.split(',').filter(Boolean).sort().join(',') !== porazily.join(',')) chyby.push(`/faktorove-etf: hero „porazil index“ (${hero}) ≠ tabulka (${porazily.join(',')})`);
      const og = decodeURIComponent((hub.html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] ?? '').replace(/&amp;/g, '&').replace(/\+/g, ' '));
      const ogN = og.match(/stat=(\d+) ze 6/)?.[1];
      if (ogN != null && Number(ogN) !== porazily.length) chyby.push(`/faktorove-etf: OG obrázek „${ogN} ze 6“, tabulka ${porazily.length}`);
      // Ročenka: přepočet vítězů z tabulky (shoda na zobrazenou přesnost = dělené místo).
      const rocSek = hub.html.match(/data-sekce="faktory-rocenka"[\s\S]*?<\/section>/)?.[0] ?? '';
      const hlav = [...(rocSek.match(/<thead[\s\S]*?<\/thead>/)?.[0] ?? '').matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => text(m[1]).trim());
      const roky = [...(rocSek.match(/<tbody[\s\S]*?<\/tbody>/)?.[0] ?? '').matchAll(/<tr[\s\S]*?<\/tr>/g)].map((m) => [...m[0].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((x) => text(x[1]).trim()));
      const cis = (s) => Number(s.replace('−', '-').replace('+', '').replace(',', '.').replace(/\s?%/, ''));
      if (roky.length >= 3 && hlav.length === 8) {
        const vyhry = new Map(hlav.slice(1, 7).map((h) => [h, 0]));
        for (const r of roky) {
          const v = r.slice(1, 7).map(cis);
          const max = Math.max(...v);
          v.forEach((x, i) => { if (x === max) vyhry.set(hlav[i + 1], vyhry.get(hlav[i + 1]) + 1); });
        }
        const rt = text(rocSek);
        const m = rt.match(/(\d+)× z (\d+) let vyhrálo (\S+(?: \S+)?) –/);
        if (m) {
          const kdo = [...vyhry.keys()].find((h) => h.toLowerCase() === m[3].toLowerCase());
          if (Number(m[2]) !== roky.length) chyby.push(`/faktorove-etf ročenka: „z ${m[2]} let“, tabulka má ${roky.length} let`);
          if (!kdo || vyhry.get(kdo) !== Number(m[1])) chyby.push(`/faktorove-etf ročenka: „${m[1]}× vyhrálo ${m[3]}“, z tabulky ${kdo ? vyhry.get(kdo) : '?'}×`);
          if (kdo && Math.max(...vyhry.values()) > vyhry.get(kdo)) chyby.push(`/faktorove-etf ročenka: „${m[3]} nejčastější vítěz“, ale z tabulky víc vyhrál jiný faktor`);
        } else chyby.push('/faktorove-etf ročenka: chybí věta „N× z M let vyhrálo …“');
        const nikdy = [...vyhry].filter(([, n]) => n === 0).map(([h]) => h);
        if (/Každý faktor byl aspoň jednou nejlepší/.test(rt) && nikdy.length) chyby.push(`/faktorove-etf ročenka: „každý faktor byl aspoň jednou nejlepší“, ale ${nikdy.join(', ')} nikdy`);
        for (const h of nikdy) if (!new RegExp(`${h}[^.]*nebyl[a-z]? nejlepší ani jednou`).test(rt)) chyby.push(`/faktorove-etf ročenka: ${h} nikdy nevyhrál, text to neříká`);
      } else chyby.push(`/faktorove-etf: ročenku nejde přečíst (${roky.length} let, ${hlav.length} sloupců)`);
      if (/[\s(]-\d+,\d\s?%/.test(ht)) chyby.push('/faktorove-etf: záporné číslo se spojovníkem místo minus');

      // Detaily: stejné okno a čísla jako v přehledu, slovo „porazil/neporazil“ sedí s čísly.
      for (const r of radky) {
        const d = await vem(`/faktorove-etf/${r.slug}`);
        if (d.status !== 200) { chyby.push(`/faktorove-etf/${r.slug}: HTTP ${d.status}`); continue; }
        const tag = d.html.match(/<section[^>]*data-sekce="faktor-cisla"[^>]*>/)?.[0];
        if (!tag) { chyby.push(`/faktorove-etf/${r.slug}: chybí blok čísel (data-sekce="faktor-cisla")`); continue; }
        const k = Number(attr(tag, 'data-konecna')), s = Number(attr(tag, 'data-sp-konecna')), v = attr(tag, 'data-vysledek');
        // Jiný KONEC okna = stránky z ISR cache (1 den) obnovené před/po denní synchronizaci indexů (3. 11. 2026: detail
        // momentum do 2. 11., přehled do 30. 10.) → čísla se oprávněně liší; varování. Jiný ZAČÁTEK = chyba výpočtu.
        if (attr(tag, 'data-od') === r.od && attr(tag, 'data-do') !== r.do) { varovani.push({ co: `/faktorove-etf/${r.slug}: data do ${attr(tag, 'data-do')}, přehled do ${r.do} – stránky z cache z různých dnů, čísla nesrovnávám`, ukazka: [] }); continue; }
        if (attr(tag, 'data-od') !== r.od || attr(tag, 'data-do') !== r.do) chyby.push(`/faktorove-etf/${r.slug}: jiné okno než v přehledu (${attr(tag, 'data-od')}–${attr(tag, 'data-do')} vs ${r.od}–${r.do})`);
        if (Math.abs(k / r.k - 1) > 0.005 || Math.abs(s / r.s - 1) > 0.005) chyby.push(`/faktorove-etf/${r.slug}: jiná čísla než v přehledu (${k}/${s} vs ${r.k}/${r.s})`);
        if (v !== r.v) chyby.push(`/faktorove-etf/${r.slug}: výsledek „${v}“ vs přehled „${r.v}“`);
        const dt = text(d.html);
        const veta = dt.match(/index (porazil|neporazil)\b/)?.[1];
        if (v === 'porazil' && veta === 'neporazil') chyby.push(`/faktorove-etf/${r.slug}: text „neporazil“, čísla ${k} > ${s}`);
        if (v === 'neporazil' && veta === 'porazil') chyby.push(`/faktorove-etf/${r.slug}: text „porazil“, čísla ${k} ≤ ${s}`);
        if (/Nejhorší case|Nejlepší case/.test(dt)) chyby.push(`/faktorove-etf/${r.slug}: „Nejhorší/Nejlepší case“`);
        if (/[\s(]-\d+,\d\s?%/.test(dt)) chyby.push(`/faktorove-etf/${r.slug}: záporné číslo se spojovníkem místo minus`);
        if (/min-w-\[(?:5[2-9]|[6-9]\d)\dpx\]/.test(d.html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? '')) chyby.push(`/faktorove-etf/${r.slug}: tabulka s pevnou min. šířkou (na mobilu skryté sloupce)`);
        if (!/data-sekce="faktor-fondy"/.test(d.html)) chyby.push(`/faktorove-etf/${r.slug}: chybí blok fondů na stejný index`);
        if (!/Data k \d/.test(dt)) chyby.push(`/faktorove-etf/${r.slug}: chybí „Data k …“`);
      }
    }
    if (staticke.length) poplach.push({ co: `Faktorové ETF (kolo 8): natvrdo zapsaná čísla/tvrzení ve zdrojích sekce: ${staticke.length}`, ukazka: staticke.slice(0, 10) });
    if (chyby.length) (nasazeno ? poplach : varovani).push({ co: `Faktorové ETF (kolo 8)${nasazeno ? '' : ' – produkce ještě bez oprav'}: ${chyby.length} nálezů`, ukazka: chyby.slice(0, 12) });
    if (!nasazeno) varovani.push({ co: 'Faktorové ETF (kolo 8): produkce ještě nemá stránky počítané z dat – živá kontrola přeskočena', ukazka: [] });
  } catch (e) {
    varovani.push({ co: `Kontrolu kolo8 faktory se nepodařilo provést: ${e.message}`, ukazka: [...staticke, ...chyby].slice(0, 5) });
  }
}
// --- konec kolo8 faktory ---
// --- kolo8 obsah --- (22. 10. 2026; pravidlo č. 1, bod 4 – každá oprava má kontrolu)
// Věcné chyby a protimluvy v obsahu nalezené testery v kole 8. Z HTML a zdrojů:
//   a) chybějící mezera za tečkou mezi JSX řádky („posilovala.U S&P 500“, „pořadí.O autorovi“),
//   b) dvojí zápor „spadlo až o −33,3 %“ / „ztratilo −17,7 %“,
//   c) tykání v nadpisech (h1–h3),
//   d) součet nákladů brokerů: „Nákup za 2 000 Kč celkem“ = poplatek + směna (zaokrouhlené části; data-priklad),
//   e) konkrétní opravené fakty (Korea MSCI/FTSE, VWCE ≠ Global All Cap, Trinity, Vanguard 2012, Bessembinder 2023,
//      FIRE 70 % = 9 let, „Z N měsíců“ = tabulka, ochrana 90 % u garančních fondů, Trading 212 přesun, Portu…).
// Značka nasazení: data-priklad na /recenze/xtb; bez ní jen varování (produkce ještě bez oprav).
async function kontrolaKolo8Obsah(poplach, varovani) {
  const chyby = [];
  try {
    const vem = async (cesta) => { try { const r = await fetch(`${WEB_URL}${cesta}`); return { status: r.status, html: await r.text() }; } catch { return { status: 0, html: '' }; } };
    // Text jako v prohlížeči: inline prvky (a, span, strong…) bez mezery, blokové a sousední boxy (</span><span>) s mezerou.
    const INLINE = /<\/?(a|span|strong|em|b|i|sup|sub|abbr|time|code|small|mark|u|s)\b[^>]*>/g;
    const text = (h) => h.replace(/<!-- -->/g, '').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<(span|a)\b[^>]*class="[^"]*\b(block|flex|inline-flex|grid)\b[^"]*"[^>]*>/g, ' ').replace(/<\/(span|a)>\s*<(span|a)\b/g, ' <$2')
      .replace(INLINE, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;| |⁠/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/\s+/g, ' ');
    const brokeri = ['xtb', 'trading212', 'portu', 'ibkr', 'degiro', 'fio'];
    const cesty = ['/svetove-etf-indexy', '/fire', '/dca-vs-jednorazova', '/jak-dlouho-v-minusu', '/menove-riziko-etf', '/akumulacni-vs-distribucni-etf',
      '/etf-vs-akcie', '/kolik-investovat-mesicne', '/dip', '/investovani-pro-deti', '/o-nas', '/srovnani-brokeru', '/dane-z-etf', '/backtest',
      '/portfolio-strategie', '/portfolio-strategie/globalni-jadro-small-cap-value', '/portfolio-strategie/dividendove-portfolio',
      '/portfolio-strategie/permanentni-portfolio', '/portfolio-strategie/nobel-portfolio', '/portfolio-strategie/akciove-portfolio',
      '/portfolio-strategie/portfolio-60-40', ...brokeri.map((b) => `/recenze/${b}`)];
    const S = new Map(await Promise.all(cesty.map(async (c) => [c, await vem(c)])));
    const H = (c) => S.get(c)?.html ?? '';
    const T = (c) => text(H(c));
    const nasazeno = /data-priklad="/.test(H('/recenze/xtb'));
    for (const [c, { status }] of S) if (status !== 200) chyby.push(`${c}: HTTP ${status}`);

    for (const c of cesty) {
      const t = T(c);
      // a) mezera za tečkou (zkratky typu „a.s.“ a domény jsou malým písmenem → regex je nechytá)
      const tecka = t.match(/.{0,25}[a-zá-žů]\.[A-ZÁ-ŽŮ].{0,15}/);
      if (tecka) chyby.push(`${c}: chybí mezera za tečkou – „${tecka[0].trim()}“`);
      // b) dvojí zápor
      const zapor = t.match(/.{0,25}\b(o|ztratil[aoy]?|ztráta|klesl[aoy]?) [−-] ?\d.{0,8}/);
      if (zapor) chyby.push(`${c}: dvojí zápor – „${zapor[0].trim()}“`);
      // c) tykání v nadpisech
      for (const [, n] of H(c).matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/g)) {
        const nt = text(n);
        if (/(^|[^\p{L}])(tvůj|tvoje|tvá|tvého|tvém|tvým|tobě|tebe|máš|chceš|můžeš|spočítej|investuj|začni|zjisti)(?![\p{L}])/iu.test(nt)) chyby.push(`${c}: tykání v nadpisu „${nt.trim()}“`);
      }
    }

    // d) součet nákladů v příkladu brokera = součet zobrazených částí
    for (const b of brokeri.filter((x) => x !== 'portu')) {
      const m = H(`/recenze/${b}`).match(/data-priklad="([^"]*)"/);
      if (!m) { if (nasazeno) chyby.push(`/recenze/${b}: chybí data-priklad u „Nákup za 2 000 Kč“`); continue; }
      const [celkem, provize, smena] = m[1].split('|').map((x) => (x === '' ? null : Number(x)));
      if (celkem != null && smena != null && Math.abs(celkem - (provize + smena)) > 0.051) chyby.push(`/recenze/${b}: příklad nákupu ${celkem} Kč ≠ poplatek ${provize} + směna ${smena}`);
    }
    // statický test: recenze počítá součet z castiPrikladu (zaokrouhlené části), ne z nezaokrouhleného n.celkemKc
    // 3.6 (11. 11. 2026): text příkladu je sdílený prikladNakupu v brokerData.ts (recenze 2 000 Kč i tabulka /srovnani-brokeru 5 000 Kč).
    const rec = readFileSync('src/app/recenze/[broker]/page.tsx', 'utf8');
    const bd = readFileSync('src/data/brokerData.ts', 'utf8');
    const fnPriklad = bd.match(/export function prikladNakupu[\s\S]*?\n}\n/)?.[0] ?? '';
    if (!/prikladNakupu\(/.test(rec) || !/castiPrikladu\(n\)/.test(fnPriklad) || /celkemKc\)/.test(fnPriklad)) chyby.push('příklad nákupu (recenze / prikladNakupu v brokerData.ts): součet se nepočítá ze zaokrouhlených částí (castiPrikladu)');
    if (/Zahrnut v poplatku/.test(bd)) chyby.push('brokerData.ts: „Zahrnut v poplatku“ (má být „Zahrnuta“ – směna)');
    for (const re of [/cennePapiry: 'max\. 20 000 EUR \(Garanční fond OCP\)'/, /cennePapiry: 'max\. 20 000 EUR \(německý/, /kyperský fond ICF\)'/])
      if (re.test(bd)) chyby.push(`brokerData.ts: ochrana bez „90 %“ (${re.source.slice(0, 40)}…) – garanční fondy vyplácí 90 %, max. 20 000 EUR`);

    // e) opravené fakty
    const ind = T('/svetove-etf-indexy');
    if (/prakticky VWCE/.test(ind)) chyby.push('/svetove-etf-indexy: „FTSE Global All Cap – prakticky VWCE“ (VWCE = FTSE All-World)');
    if (/zařazuje Jižní Koreu do emerging/.test(ind) || !/Koreu řadí FTSE mezi rozvinuté/.test(ind)) chyby.push('/svetove-etf-indexy: Jižní Korea – MSCI ji řadí mezi rozvíjející se, FTSE mezi rozvinuté (factsheet MSCI ACWI, FTSE Country Classification 9/2026)');
    if (!/k 30\. 9\. 2026/.test(ind)) chyby.push('/svetove-etf-indexy: počty firem a podíly USA bez data factsheetu');
    const fire = T('/fire');
    if (/globálních akcií a dluhopisů \(tzv\. Trinity/.test(fire)) chyby.push('/fire: Trinity Study = americké akcie a firemní dluhopisy, ne globální');
    if (/70 % ~8,5 roku/.test(fire)) chyby.push('/fire: 70 % míra úspor „~8,5 roku“ (metodou stránky 8,8 → ~9 let)');
    if (/tvůj plán|marketingových keců/.test(fire)) chyby.push('/fire: tykání / hovorový výraz');
    if (/\+1,8 % ročně/.test(T('/dca-vs-jednorazova'))) chyby.push('/dca-vs-jednorazova: „+1,8 % ročně“ – Vanguard 2012 uvádí rozdíl konečných hodnot (USA 2,3 %), ne roční');
    const jd = T('/jak-dlouho-v-minusu');
    const zN = jd.match(/Z (\d+) měsíců nákupu, po kterých máme aspoň pět let dat/)?.[1];
    const tab5 = jd.match(/5 letech \((\d+) nákupů\)/)?.[1];
    if (zN && tab5 && zN !== tab5) chyby.push(`/jak-dlouho-v-minusu: text „Z ${zN} měsíců“ × tabulka po 5 letech „${tab5}“`);
    if (/do velké míry vyruší|přes roky do velké míry vyrovnávají/.test(T('/menove-riziko-etf'))) chyby.push('/menove-riziko-etf: „měnové výkyvy se v čase vyruší“ – data to nepotvrzují');
    if (/55 z 57 světových trhů/.test(T('/etf-vs-akcie'))) chyby.push('/etf-vs-akcie: „55 z 57 trhů“ – Bessembinder a kol. 2023: 55,2 % amerických a 57,4 % neamerických akcií');
    const on = T('/o-nas');
    if (/tučnými provizemi|Brokery i fondy řadíme výhradně/.test(on)) chyby.push('/o-nas: kritika prodejců / „brokery řadíme podle parametrů“ (brokeři jsou abecedně)');
    if (/to je peníze/.test(T('/dip'))) chyby.push('/dip: „to je peníze navíc“');
    const t212 = T('/recenze/trading212');
    if (nasazeno && !/přesun/.test(t212)) chyby.push('/recenze/trading212: chybí upozornění na přesun pod Trading 212 EU GmbH (BaFin)');
    const portu = T('/recenze/portu');
    if (/35 % hrozících u některých ETF|u některých ETF hrozit 35/.test(portu)) chyby.push('/recenze/portu: 35% srážka se týká českých dividend, ne ETF');
    if (/Trading 212 nebo Portu/.test(T('/recenze/fio'))) chyby.push('/recenze/fio: Portu jako broker (je robo-poradce)');
    if (/neaktivitu se neúčtuje po dobu 12 měsíců/.test(T('/recenze/xtb'))) chyby.push('/recenze/xtb: poplatek za neaktivitu nejasně (10 EUR/měs. po 365 dnech bez obchodu a 90 dnech bez vkladu)');
    const pf = T('/portfolio-strategie');
    if (/Max\. pokles od —/.test(pf)) chyby.push('/portfolio-strategie: „Max. pokles od —“ u portfolia bez historie');
    if (/Za 12 měs\. v Kč [+−]/.test(pf)) chyby.push('/portfolio-strategie: výnos 12 měsíců bez data');
    if (/od roku 2008 vidíte přímo na kartě\./.test(pf)) chyby.push('/portfolio-strategie: FAQ tvrdí pokles od 2008 u každého portfolia (Dividendové historii nemá)');
    if (/S&P 500/.test(T('/portfolio-strategie/dividendove-portfolio').match(/Portfolio vs[^.]{0,80}/)?.[0] ?? '')) chyby.push('/portfolio-strategie/dividendove-portfolio: srovnání se S&P 500 (ostatní portfolia s celým světem)');
    const jadro = T('/portfolio-strategie/globalni-jadro-small-cap-value');
    if (/kdyby šlo o vlastní/.test(jadro)) chyby.push('/portfolio-strategie/globalni-jadro…: „jak bychom sami stavěli … vlastní peníze“ (blízko doporučení)');
    if (/44 let živé historie|front-runn|\bbp\b|cap-weight/.test(jadro)) chyby.push('/portfolio-strategie/globalni-jadro…: žargon nebo „44 let“ × DFSVX od 1993');
    if (nasazeno && !/jádro bez satelitu by vydělalo [+−]?\d/.test(jadro)) chyby.push('/portfolio-strategie/globalni-jadro…: chybí srovnání s jádrem bez satelitu (náskok proti VT dělá váha USA)');
    if (/globální dluhopisy \(25 %\)/.test(T('/portfolio-strategie/nobel-portfolio'))) chyby.push('/portfolio-strategie/nobel-portfolio: „globální dluhopisy“ – fond = státní dluhopisy eurozóny');

    if (chyby.length) (nasazeno ? poplach : varovani).push({ co: `Obsah a fakta (kolo 8)${nasazeno ? '' : ' – produkce ještě bez oprav (před nasazením)'}: ${chyby.length} nálezů`, ukazka: chyby.slice(0, 20) });
  } catch (e) {
    varovani.push({ co: `Kontrolu kolo8 obsah se nepodařilo provést: ${e.message}`, ukazka: chyby.slice(0, 5) });
  }
}
// --- konec kolo8 obsah ---
// --- graf indexu --- (3.3, 11. 11. 2026; pravidlo č. 1, bod 4 – každá novinka má kontrolu)
// Detail fondu ukazuje graf „Vývoj indexu … v Kč“ JEN při přesné shodě indexu (prirazeniFondu → 'stejny',
// src/lib/vyvojIndexu.ts). Hlídá se:
//  a) SXR8 (S&P 500) a SGLN (zlato) graf MAJÍ, je označený jako index / zdrojový fond (data-oznaceni="index", text
//     „ne cena tohoto fondu“), nadpis „Vývoj …“ a v grafu není žádné procento (nesmí se plést s výnosem fondu),
//  b) VWCE ('blizky' – FTSE All-World × data VT) a EUNL (MSCI World, bez přiřazení) graf NEMAJÍ,
//  c) poslední bod grafu (data-do) není o moc starší než data v DB (min. z posledního dne indexu a kurzů):
//     > 14 dní = POPLACH (vynechaná týdenní přestavba – detaily jsou předgenerované při buildu), > 8 dní = varování.
//     Proč ne 7: přestavba je 1× týdně (sobota) a staví z dat do čtvrtka/pátku; před další přestavbou je rozdíl běžně
//     7–8 dní, po přeskočené přestavbě (scripts/vercel-ignore.sh – nasazení mladší 6 dní) až ~11 dní.
// Značka nasazení: data-graf-indexu-verze na sekci Výkonnost; bez ní (produkce před nasazením) jen varování.
async function kontrolaGrafIndexu(poplach, varovani) {
  const chyby = [];
  try {
    const hl = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
    const posledni = async (tabulka, filtr = '') => (await fetch(`${URL_DB.replace('etf_funds', tabulka)}?select=date${filtr}&order=date.desc&limit=1`, hl).then((r) => r.json()))?.[0]?.date ?? null;
    const fxDo = await posledni('exchange_rates_historical');
    const dnu = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / 864e5);
    const MA = { IE00B5BMR087: ['SXR8', 'sp500'], IE00B4ND3602: ['SGLN', 'gold'] };
    const NEMA = { IE00BK5BQT80: 'VWCE (FTSE All-World – jen podobný index)', IE00B4L5Y983: 'EUNL (MSCI World – bez historie indexu)' };
    let nasazeno = null;
    for (const isin of R.detaily([...Object.keys(MA), ...Object.keys(NEMA)], 'Graf indexu (3.3)')) {
      const html = (await fetch(`${WEB_URL}/etf/${isin}`).then((r) => (r.ok ? r.text() : ''))).replace(/<!-- -->/g, '');
      if (!html) { chyby.push(`/etf/${isin}: stránka se nenačetla`); continue; }
      const znacka = /data-graf-indexu-verze="1"/.test(html);
      nasazeno = nasazeno === null ? znacka : nasazeno && znacka;
      const fig = html.match(/<figure[^>]*data-graf-indexu="[^"]*"[\s\S]*?<\/figure>/)?.[0] ?? null;
      if (NEMA[isin]) { if (fig) chyby.push(`/etf/${isin} ${NEMA[isin]}: graf indexu se NEMÁ ukazovat`); continue; }
      const [tk, kod] = MA[isin];
      if (!fig) { chyby.push(`/etf/${isin} ${tk}: chybí graf vývoje indexu v Kč`); continue; }
      const atr = (n) => fig.match(new RegExp(`data-${n}="([^"]*)"`))?.[1] ?? null;
      if (atr('graf-indexu') !== kod) chyby.push(`/etf/${isin} ${tk}: graf je z indexu „${atr('graf-indexu')}“, čekáno ${kod}`);
      const txt = fig.replace(/<[^>]+>/g, ' ').replace(/&nbsp;| /g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
      if (atr('oznaceni') !== 'index' || !/ne cena tohoto fondu/.test(txt)) chyby.push(`/etf/${isin} ${tk}: graf není jednoznačně označený jako index (data-oznaceni / „ne cena tohoto fondu“)`);
      if (!/<h3[^>]*>\s*Vývoj (indexu|ceny) /.test(fig)) chyby.push(`/etf/${isin} ${tk}: nadpis grafu není „Vývoj indexu/ceny … v Kč“`);
      if (/%/.test(txt)) chyby.push(`/etf/${isin} ${tk}: v grafu indexu je procento – nesmí se plést s výnosem fondu`);
      const doDne = atr('do');
      if (!doDne || !/Data k \d/.test(txt)) { chyby.push(`/etf/${isin} ${tk}: graf bez data posledního bodu`); continue; }
      const kontrola = (atr('kontrola') ?? '').split('|');
      if (kontrola.length !== 3 || kontrola.some((k) => !/^\d{4}-\d{2}-\d{2}:\d+(\.\d+)?$/.test(k)) || !kontrola[2].startsWith(doDne)) chyby.push(`/etf/${isin} ${tk}: data-kontrola „${atr('kontrola')}“ nesedí s posledním bodem ${doDne}`);
      const indexDo = await posledni('index_historical_data', `&index_code=eq.${kod}`);
      const dbDo = [indexDo, fxDo].filter(Boolean).sort()[0];
      if (!dbDo) { varovani.push({ co: `Graf indexu (3.3): poslední den dat ${kod} v DB nezjištěn`, ukazka: [] }); continue; }
      const stari = dnu(dbDo, doDne);
      if (stari > 14) chyby.push(`/etf/${isin} ${tk}: graf končí ${doDne}, data v DB jsou do ${dbDo} (${stari} dní) – neproběhla týdenní přestavba?`);
      else if (stari > 8) varovani.push({ co: `Graf indexu (3.3) na /etf/${isin} končí ${doDne}, DB má data do ${dbDo} (${stari} dní; přestavba 1× týdně)`, ukazka: [] });
      else if (stari < 0) chyby.push(`/etf/${isin} ${tk}: graf končí ${doDne} – POZDĚJI než data v DB (${dbDo})?`);
    }
    if (chyby.length) (nasazeno ? poplach : varovani).push({ co: `Graf vývoje indexu v Kč na detailu (3.3)${nasazeno ? '' : ' – produkce ještě bez grafu (před nasazením)'}: ${chyby.length} nálezů`, ukazka: chyby.slice(0, 10) });
  } catch (e) {
    varovani.push({ co: `Kontrolu grafu indexu (3.3) se nepodařilo provést: ${e.message}`, ukazka: chyby.slice(0, 5) });
  }
}
// --- konec graf indexu ---
// --- porovnání z CDN --- (12. 11. 2026; majitel: dát /srovnani/porovnani na CDN cache)
// /srovnani/porovnani?isins=… je dynamická (searchParams) a byla největším spotřebitelem CPU a přenosu z originu
// (návrat na free tier Vercelu, limit 10 GB přenosu / 30 dní). next.config.ts posílá Vercel-CDN-Cache-Control.
//  a) statika: pravidlo v next.config.ts existuje (smazání = POPLACH – bez něj hrozí překročení limitu a pozastavení webu),
//  b) lokální build: odpověď hlavičku nese (next start přidává hlavičky z next.config),
//  c) produkce: druhé načtení téže pevné URL (VWCE × SXR8 – z pevné sady, stránka není ISR, nic nezapisuje) musí přijít
//     z CDN (x-vercel-cache HIT/STALE); MISS dvakrát = varování (cache nefunguje, spotřeba poroste) a stránka musí mít „Data k“.
async function kontrolaPorovnaniCdn(poplach, varovani) {
  const chyby = [];
  try {
    const { readFileSync } = await import('node:fs');
    const cfg = readFileSync(new URL('../next.config.ts', import.meta.url), 'utf8');
    if (!/source:\s*'\/srovnani\/porovnani'[\s\S]{0,200}Vercel-CDN-Cache-Control/.test(cfg)) {
      poplach.push({ co: 'Porovnání z CDN: v next.config.ts chybí pravidlo Vercel-CDN-Cache-Control pro /srovnani/porovnani (bez cache hrozí překročení limitu přenosu free tieru)', ukazka: [] });
    }
    const url = `${WEB_URL}/srovnani/porovnani?isins=IE00BK5BQT80,IE00B5BMR087`;
    const r1 = await fetch(url);
    const html = await r1.text();
    if (!r1.ok) chyby.push(`HTTP ${r1.status} ${url}`);
    if (!/Data k/.test(html)) chyby.push('stránka porovnání bez „Data k“ (pravidlo č. 1 – verze z cache musí nést den dat)');
    if (R.produkce) {
      const r2 = await fetch(url);
      await r2.text();
      const c1 = r1.headers.get('x-vercel-cache'), c2 = r2.headers.get('x-vercel-cache');
      if (!/HIT|STALE/i.test(c2 || '')) chyby.push(`druhé načtení nepřišlo z CDN (x-vercel-cache: ${c1} → ${c2})`);
    } else if (!r1.headers.get('vercel-cdn-cache-control')) {
      chyby.push('lokální odpověď nemá hlavičku Vercel-CDN-Cache-Control (next.config.ts headers)');
    }
    if (chyby.length) varovani.push({ co: `Porovnání z CDN (/srovnani/porovnani): ${chyby.length} nálezů`, ukazka: chyby });
  } catch (e) {
    varovani.push({ co: `Kontrolu porovnání z CDN se nepodařilo provést: ${e.message}`, ukazka: chyby.slice(0, 5) });
  }
}
// --- konec porovnání z CDN ---
