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

const CYKLUS = /(short duration|short maturity|short[- ]term|ultra[- ]?short)/i;

// Zlatá sada: ISINy, které v žebříčku MUSÍ být (vlajkové fondy), a názvy, které tam být NESMÍ.
const ZLATA_SADA = [
  { slug: 'nejlepsi-sp500-etf', musi: ['IE00B5BMR087'], nesmi: /equal weight|sector|ex[- ]|\bESG\b|screened|scored|leaders|top 20|capped|covered call|low vol/i }, // CSPX/SXR8
  { slug: 'nejlepsi-msci-world-etf', musi: ['IE00B4L5Y983'], nesmi: /all[- ]world|acwi|ex[- ]usa/i },    // IWDA/EUNL
  // Celý svět = vyspělé I rozvíjející se trhy (18. 10. 2026: dřív vedl EUNL = MSCI World, jen vyspělé trhy).
  { slug: 'nejlepsi-celosvetove-etf', musi: ['IE00BK5BQT80', 'IE00B3YLTY66', 'IE00B6R52259'],            // VWCE, SPYI, IUSQ
    nesmi: /\bMSCI World\b|developed|ex[- ]?u\.?s|\bESG\b|\bSRI\b|screened|paris|climate|enhanced|\bactive\b/i },
  { slug: 'nejlepsi-emerging-markets-etf', musi: ['IE00BKM4GZ66'], nesmi: /\bEMU\b/i },                 // EIMI/EMIM
  { slug: 'nejlepsi-japonske-etf', nesmi: /ex[- ]?japan/i },
  { slug: 'nejlepsi-cinske-etf', nesmi: /ex[- .]*china/i },
  { slug: 'nejlepsi-zlato-etf', musi: ['IE00B4ND3602'] },                                               // SGLN
  { slug: 'nejlepsi-ropa-etf' },
  { slug: 'nejlepsi-nasdaq-etf', nesmi: /biotech|cyber|semiconductor|smart grid|covered call|aerospace/i },
];

async function nactiFondy() {
  const cols = 'isin,name,fund_provider,ter_numeric,return_1y,is_leveraged,distribution_policy,updated_at,scraping_date,category,holding_1_name,holding_9_name,holding_10_name';
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
    ];
    const chyby = [];
    for (const o of OCEKAVANI) {
      const r = await fetch(`${WEB_URL}/api/etf/search?q=${encodeURIComponent(o.q)}`).then((x) => x.json());
      if (!Array.isArray(r.results)) { chyby.push(`${o.q}: API neodpovědělo`); continue; }
      if (o.poCeskem && !('kategorie' in r)) continue; // produkce ještě bez sdílené relevance (před nasazením)
      if (o.isin && r.results[0]?.isin !== o.isin) chyby.push(`${o.q}: první výsledek ${r.results[0]?.isin ?? 'nic'} místo ${o.isin}`);
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
    const TRH_RE = [['svet', /(FTSE All-World|MSCI ACWI|MSCI AC World|All Country World|All-Country World|Global All Cap)/i], ['world', /(MSCI World|Developed World)/i], ['sp500', /S&P 500/i],
      ['nasdaq', /Nasdaq[- ]?100/i], ['evropa', /(STOXX Europe 600|MSCI Europe)/i], ['em', /MSCI (Emerging Markets|EM)\b/i]];
    const UZKE = /(esg|sri|screened|climate|paris|\bpab\b|\bctb\b|islamic|shariah|ex[ -]|small|mid ?cap|\bmc\b|value|momentum|quality|dividend|min(imum)? vol|low vol|leaders|select|focus|transition|sustainab|equal|factor|enhanced|universal|socially|buffer|covered|income|daily|sector|growth|information tech|energy|health|financ|consumer|industr|utilit|real estate|communic|material|optimi|catholic|fossil|investable market|top \d|filtered|capped|banks|insurance|oil|basic resources|food|automobile|chemical|travel|personal|telecom|media|construction|retail|technology|asia|latin|china|india|korea|taiwan|buyback|qvm|min te|action|pea|\b2x\b|\b3x\b|short|vix|future)/i;
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
