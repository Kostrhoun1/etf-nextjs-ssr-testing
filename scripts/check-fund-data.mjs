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
 * SPUŠTĚNÍ:  SUPABASE_KEY=… node scripts/check-fund-data.mjs
 */

import { appendFileSync, readdirSync, readFileSync, statSync } from 'node:fs';

const KEY = process.env.SUPABASE_KEY;
const WEB_URL = process.env.WEB_URL || 'https://etfpruvodce.cz'; // pro test proti lokálnímu buildu
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
  const cols = 'isin,name,fund_provider,ter_numeric,return_1y,is_leveraged,distribution_policy,updated_at,scraping_date,category,holding_1_name,holding_9_name,holding_10_name,primary_ticker,total_exchanges,index_name,investment_focus,volatility_1y,volatility_3y,volatility_5y,return_1m,return_3y,max_drawdown_1y,max_drawdown_3y,max_drawdown_5y'; // kolo6: výnosy zlata, poklesy tříd
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
  const stare30 = fondy.filter((x) => dni(x) > 30);
  if (stare30.length / n > MAX_STARE_30D)
    poplach.push({ co: `${stare30.length} fondů (${(100 * stare30.length / n).toFixed(1)} %) neaktualizováno přes 30 dní`, ukazka: ukazka(stare30) });
  const cerstve = fondy.filter((x) => dni(x) <= 3).length;
  if (cerstve / n < MIN_CERSTVE_3D)
    poplach.push({ co: `Za poslední 3 dny aktualizováno jen ${cerstve} fondů (${(100 * cerstve / n).toFixed(0)} %) – běží scraper?`, ukazka: [] });
  // Od 20. 10. 2026 scraper spouští Supabase pg_cron („scraper-spusteni“ út–pá 01:30 UTC, „scraper-spusteni-pondeli“
  // po 05:00 UTC; token github_scraper_dispatch z Vault – platnost 1 rok), záloha = GitHub plán 08:23 UTC.
  // Kontrola běží 15:30 UTC: v pracovní den musí být většina fondů stažená za posledních 16 h. Když ne,
  // nefunguje spouštění (vypršel token? pg_cron?) i záloha – víkend se nestahuje záměrně.
  const denTydne = new Date().getUTCDay();
  if (denTydne >= 1 && denTydne <= 5 && new Date().getUTCHours() >= 13) {
    const dnesni = fondy.filter((x) => x.scraping_date && dni(x) <= 16 / 24).length;
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
    const roky = [rokNyni - 2, rokNyni - 1].filter((y) => y >= 2022 && y <= 2025); // sloupce return_2021–2025
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
      if (m[1] === 'ibkr' && rok >= 12 * nakup) chyby.push(`ibkr: za rok ${rok} Kč = 12 × nákup se směnou (směna se má počítat jednou)`);
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
    const r = await fetch(`${URL_DB}?select=isin,name,return_1y_czk,scraping_date,primary_ticker,exchange_1_ticker&isin=in.(${vse.join(',')})`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    }).then((x) => x.json());
    if (!Array.isArray(r)) throw new Error('neplatná odpověď DB');
    const podle = new Map(r.map((x) => [x.isin, x]));
    const odlehle = [], chybi = [];
    for (const t of trhy) {
      const f = t.isins.map((i) => podle.get(i)).filter(Boolean).filter((x) => x.scraping_date && dni(x) <= 14);
      chybi.push(...t.isins.filter((i) => !f.some((x) => x.isin === i)).map((i) => `${t.id}: ${i}`));
      const v = f.filter((x) => x.return_1y_czk != null).map((x) => Number(x.return_1y_czk)).sort((a, b) => a - b);
      if (v.length < 3) { poplach.push({ co: `Trh ${t.id} na homepage má jen ${v.length} fondů s daty`, ukazka: [] }); continue; }
      const med = v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
      for (const x of f) if (x.return_1y_czk != null && Math.abs(Number(x.return_1y_czk) - med) > 1.5)
        odlehle.push(`${t.id}: ${x.isin} ${String(x.name).slice(0, 34)} ${Number(x.return_1y_czk).toFixed(1)} % vs. medián ${med.toFixed(1)} %`);
    }
    if (odlehle.length) poplach.push({ co: `${odlehle.length} fondů má výnos 12 m mimo svůj trh (> 1,5 p. b. od mediánu) – vadná data u zdroje? Ověřit na burzovních cenách`, ukazka: odlehle.slice(0, 8) });
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
  let pocetRozcestnik = new Map();
  try {
    const h = await fetch(`${WEB_URL}/zebricky`).then((r) => (r.ok ? r.text() : ''));
    pocetRozcestnik = new Map([...h.matchAll(/data-pocet="(\d+)" data-slug="([a-z0-9-]+)"/g)].map((m) => [m[2], Number(m[1])]));
    if (!pocetRozcestnik.size) varovani.push({ co: 'Rozcestník /zebricky neukazuje počty fondů (data-pocet) – nenačetl se, nebo DB nedostupná', ukazka: [] });
  } catch { varovani.push({ co: 'Rozcestník /zebricky se nenačetl', ukazka: [] }); }
  const nesouhlasi = [];

  for (const z of ZLATA_SADA) {
    let html = '';
    try { html = await fetch(`${WEB_URL}/nejlepsi-etf/${z.slug}`).then((r) => (r.ok ? r.text() : '')); } catch { /* níže */ }
    if (!html) { poplach.push({ co: `Žebříček /nejlepsi-etf/${z.slug} se nenačetl`, ukazka: [] }); continue; }
    const pocetZebricek = Number(html.match(/data-pocet-fondu="(\d+)"/)?.[1] ?? NaN);
    const pocetHub = pocetRozcestnik.get(z.slug);
    if (pocetHub != null && Number.isFinite(pocetZebricek) && pocetHub !== pocetZebricek) nesouhlasi.push(`${z.slug}: rozcestník ${pocetHub}, žebříček ${pocetZebricek}`);
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
    const m = /Vloženo 1 010 000 Kč/.test(text) ? text.match(/Dnes byste měli zhruba ([0-9]+(?:,[0-9])?) mil\. Kč/) : null;
    // Backtest končí ke dni „Data k …“ ze stránky (je v ISR cache – jinak by denní pohyb trhu
    // mezi renderem a kontrolou dělal falešný poplach).
    const dk = text.match(/[Dd]ata k ([0-9]{1,2})\. ([0-9]{1,2})\. ([0-9]{4})/);
    const konecDat = dk ? `${dk[3]}-${dk[2].padStart(2, '0')}-${dk[1].padStart(2, '0')}` : new Date().toISOString().slice(0, 10);
    if (!m) {
      varovani.push({ co: 'Stroj času neukazuje výchozí scénář (5 000 Kč měsíčně od 2010, vloženo 1 010 000 Kč) – změněný výchozí stav, nebo chyba', ukazka: [] });
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
  try {
    const hlavicky = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };
    const fxPosl = await fetch(`${URL_DB.replace('etf_funds', 'exchange_rates_historical')}?select=date&order=date.desc&limit=20`, hlavicky).then((r) => r.json());
    const fxDny = new Set((fxPosl ?? []).map((x) => x.date));
    const vtPosl = await fetch(`${URL_DB.replace('etf_funds', 'index_historical_data')}?select=date&index_code=eq.ftse_all_world&order=date.desc&limit=1`, hlavicky).then((r) => r.json());
    const dataDo = [fxPosl?.[0]?.date, vtPosl?.[0]?.date].filter(Boolean).sort()[0];
    const den = (a, b) => (Date.parse(a) - Date.parse(b)) / 864e5;
    const stranky = ['/portfolio-strategie', '/vyber-etf'];
    const hub = await fetch(`${WEB_URL}/portfolio-strategie`).then((r) => (r.ok ? r.text() : ''));
    for (const m of hub.matchAll(/href="\/portfolio-strategie\/([a-z0-9-]+)"/g)) if (!stranky.includes(`/portfolio-strategie/${m[1]}`)) stranky.push(`/portfolio-strategie/${m[1]}`);
    const nesedi = [], stare = [], varuj = [];
    let overeno = 0, kvizOvereno = 0;
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
          body: JSON.stringify({ portfolio, startDate: q.get('start'), endDate: doDen, initialAmount: Number(q.get('amount') || 100000), currency: 'CZK', rebalancingStrategy: q.get('vyvazovani') || 'yearly' }),
        }).then((r) => r.json()).catch(() => null);
        const api = bt?.summary?.netAssetValue, web = Number(navStr);
        overeno++; if (cesta === '/vyber-etf') kvizOvereno++;
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
    if (nesedi.length) poplach.push({ co: 'Modelová portfolia / kvíz: konečná hodnota nebo kurz předpočtu nesedí s živým backtestem', ukazka: nesedi.slice(0, 10) });
    if (stare.length) poplach.push({ co: 'Modelová portfolia / kvíz počítají ze zastaralých dat (předpočet o víc než 4 dny za daty v DB)', ukazka: [...new Set(stare)].slice(0, 10) });
    if (varuj.length) varovani.push({ co: 'Předpočet: poslední bod bez kurzu téhož dne', ukazka: [...new Set(varuj)].slice(0, 5) });
    if (!overeno) varovani.push({ co: 'Kontrola konečných hodnot (kolo5 A) nenašla na stránkách nic k ověření', ukazka: [] });
    else if (!kvizOvereno) poplach.push({ co: 'Kvíz /vyber-etf nemá kontrolní údaje data-kontrola-backtest (čísla kvízu nejde ověřit)', ukazka: [] });

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
    if (vlozeno !== 11000) poplach.push({ co: 'Backtest počítá vklady špatně (0 Kč na začátku + 1 000 Kč měsíčně v roce 2024 má dát vloženo 11 000 Kč)', ukazka: [`API vrací vloženo ${vlozeno}`] });
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
      const nesedi = [];
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
        for (const i of chybiVZeb) nesedi.push(`${t.id}: ${i} ${String(podle.get(i)?.name ?? '').slice(0, 40)} je na homepage, v žebříčku ne`);
        for (const i of chybiNaHome) nesedi.push(`${t.id}: ${i} ${String(podle.get(i)?.name ?? '').slice(0, 40)} je v žebříčku, na homepage ne`);
      }
      if (nesedi.length) poplach.push({ co: `Trhy na homepage nesouhlasí s výběrem žebříčku/srovnávače (${nesedi.length}) – src/data/trhyDvojcata.ts`, ukazka: nesedi.slice(0, 8) });
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
        // Prahy („fondy nad 500 mil. €“) nejsou velikost fondu – ty se nehlásí.
        const m = kodBezKomentaru.match(/(?<![\d,.])(?<!(?:nad|od|pod|aspoň|min\.)\s)[~≈]?\d+(?:[,.]\d+)?\s?(?:mld|mil)\.?\s?€|[+−-]\d+(?:[,.]\d+)?\s?%\s?za\s(?:posledních\s)?\d+\s(?:let|roky|rok)/);
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
      for (const par of ['vwce-vs-spyi', 'iusq-vs-spyi', 'vwce-vs-cspx', 'vwce-vs-iwda']) {
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
      const top = rows.filter((r) => !r.is_leveraged).sort((a, b) => (b.fund_size_numeric ?? 0) - (a.fund_size_numeric ?? 0)).slice(0, 50);
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
    const db = await fetch(`${URL_DB}?select=isin,name,primary_ticker,scraping_date,${Object.keys(OBDOBI).map((o) => `return_${o}`).join(',')}&isin=in.(${KOTVY.map((k) => k[0]).join(',')})`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }).then((r) => r.json());
    if (!Array.isArray(db)) throw new Error('neplatná odpověď DB');
    const vysA = [], vysB = [], nejdeA = [], nejdeB = [];
    for (const [isin, xetra] of KOTVY) {
      const f = db.find((x) => x.isin === isin);
      if (!f?.scraping_date) { nejdeA.push(`${isin}: v DB chybí`); continue; }
      const D = datumCenD(new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(f.scraping_date) ? f.scraping_date : `${f.scraping_date}Z`));
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
    const spatne = [];
    for (const s of ['/etf/ZZ000000TEST', '/srovnani/nesmysl']) {
      const r = await fetch(`${WEB_URL}${s}`, { redirect: 'manual' });
      if (r.status !== 404) spatne.push(`${s}: HTTP ${r.status}`);
    }
    if (spatne.length) poplach.push({ co: 'Nesmyslná adresa fondu/dvojice nevrací 404 – middleware neběží? (matcher v src/middleware.ts)', ukazka: spatne });
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
      const OBD = ['1m', '3m', '6m', 'ytd', '1y', '3y', '5y', '2021', '2022', '2023', '2024', '2025'];
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
      const db = await fetch(`${URL_DB}?select=isin,primary_ticker,scraping_date,${OBD.flatMap((o) => [`return_${o}`, `return_${o}_czk`, `return_${o}_usd`]).join(',')}&isin=in.(${KOTVY_FX.join(',')})`, H).then((r) => r.json());
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
        const D = denDat(new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(f.scraping_date) ? f.scraping_date : `${f.scraping_date}Z`));
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
      const T = { EUN5: 'IE00B3F81R35', IBC1: 'IE00BGSF1X88', IBCF: 'IE00B3ZW0K18', XEON: 'LU0290358497', BRNT: 'JE00B78CGV99', BITC: 'GB00BLD4ZL17',
        SGLN: 'IE00B4ND3602', QDVE: 'IE00B3WJKG14', VWRL: 'IE00B3RBWM25', P500: 'IE00B3YCGJ38', VHYL: 'IE00B8GKDB10', EMIM: 'IE00BKM4GZ66', QUEJ: 'LU1753045845' };
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
      for (const f of [...velke, ...db.filter((x) => ['IE00B3ZW0K18', 'IE00BKM4GZ66', 'IE00B8GKDB10'].includes(x.isin))]) {
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
      if (novy) {
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
        const maly = await fetch(`${URL_DB}?select=isin&fund_size_numeric=lt.50&fund_size_numeric=gt.0&is_leveraged=not.is.true&name=not.is.null&order=fund_size_numeric.desc&limit=1`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }).then((x) => x.json()).catch(() => []);
        if (maly[0]) {
          const { html: ocas } = await vem(`/etf/${maly[0].isin}`);
          if (ocas && !/<meta name="googlebot" content="noindex, follow"/.test(ocas)) chyby.push(`detail ${maly[0].isin} (ocas) nemá googlebot noindex, follow`);
        }
      }

      // 2) ISIN malými písmeny → 301 na velká (dřív 404).
      const male = await vem('/etf/ie00b5bmr087', { redirect: 'manual' });
      if (male.status !== 301 || !/\/etf\/IE00B5BMR087$/.test(male.loc)) chyby.push(`/etf/ie00b5bmr087 → ${male.status} ${male.loc} (má být 301 na /etf/IE00B5BMR087)`);

      // 3) Dvojice srovnání: obrácená kurátorská → 301 na hlavní; alias → canonical na hlavní; nekurátorská → googlebot noindex
      //    a obrácená nekurátorská → přesměrování na abecední tvar; kurátorské dvojice ukazují fondy z pairs.ts (KURATORSKE).
      const pairsTs = readFileSync('src/lib/pairs.ts', 'utf8');
      const kur = Object.fromEntries([...pairsTs.slice(pairsTs.indexOf('export const KURATORSKE:'), pairsTs.indexOf('export const KURATORSKE_ALIASY')).matchAll(/'([a-z0-9]+-vs-[a-z0-9]+)': \['([A-Z0-9]{12})', '([A-Z0-9]{12})'\]/g)].map((m) => [m[1], [m[2], m[3]]]));
      const aliasy = Object.fromEntries([...pairsTs.slice(pairsTs.indexOf('export const KURATORSKE_ALIASY'), pairsTs.indexOf('export const HLAVNI_DVOJICE')).matchAll(/'([a-z0-9-]+)': '([a-z0-9-]+)'/g)].map((m) => [m[1], m[2]]));
      if (Object.keys(kur).length < 15) throw new Error(`KURATORSKE v pairs.ts nenalezeny (${Object.keys(kur).length})`);
      const hlavni = Object.keys(kur).filter((s) => !aliasy[s]);
      const obr = await vem('/srovnani/iwda-vs-vwce', { redirect: 'manual' });
      if (obr.status !== 301 || !/\/srovnani\/vwce-vs-iwda$/.test(obr.loc)) chyby.push(`/srovnani/iwda-vs-vwce → ${obr.status} ${obr.loc} (má být 301 na vwce-vs-iwda)`);
      const velka = await vem('/srovnani/VWCE-vs-IWDA', { redirect: 'manual' });
      if (velka.status !== 301 || !/\/srovnani\/vwce-vs-iwda$/.test(velka.loc)) chyby.push(`/srovnani/VWCE-vs-IWDA → ${velka.status} ${velka.loc} (má být 301 na malá písmena)`);
      const odkazyNaDvojice = new Set();
      for (const [slug, [i1, i2]] of Object.entries(kur)) {
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
      if (osirele.length) chyby.push(`Kurátorské dvojice bez interního odkazu z ostatních dvojic: ${osirele.join(', ')}`);
      const mimo = await vem('/srovnani/eunl-vs-spyl');
      if (mimo.status === 200 && !/<meta name="googlebot" content="noindex, follow"/.test(mimo.html)) chyby.push('/srovnani/eunl-vs-spyl (mimo kurátorský seznam) nemá googlebot noindex, follow');
      const mimoObr = await vem('/srovnani/spyl-vs-eunl', { redirect: 'manual' });
      if (!PRESMEROVANI.includes(mimoObr.status) || !/\/srovnani\/eunl-vs-spyl$/.test(mimoObr.loc)) chyby.push(`/srovnani/spyl-vs-eunl → ${mimoObr.status} ${mimoObr.loc} (má být trvalé přesměrování na eunl-vs-spyl)`);

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

  // ── výstup ──
  const souhrn = `${n} fondů · čerstvých za 3 dny ${(100 * cerstve / n).toFixed(0)} % · starších 30 dní ${(100 * stare30.length / n).toFixed(1)} %`;
  const radky = [`# Kontrola dat fondů`, '', souhrn, ''];
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
