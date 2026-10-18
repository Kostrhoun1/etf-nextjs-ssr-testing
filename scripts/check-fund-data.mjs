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

const CYKLUS = /(short duration|short maturity|short[- ]term|ultrashort|ultra short)/i;

// Zlatá sada: ISINy, které v žebříčku MUSÍ být (vlajkové fondy), a názvy, které tam být NESMÍ.
const ZLATA_SADA = [
  { slug: 'nejlepsi-sp500-etf', musi: ['IE00B5BMR087'], nesmi: /equal weight|sector|ex[- ]/i },          // CSPX/SXR8
  { slug: 'nejlepsi-msci-world-etf', musi: ['IE00B4L5Y983'], nesmi: /all[- ]world|acwi|ex[- ]usa/i },    // IWDA/EUNL
  { slug: 'nejlepsi-celosvetove-etf', musi: ['IE00BK5BQT80'] },                                          // VWCE
  { slug: 'nejlepsi-emerging-markets-etf', musi: ['IE00BKM4GZ66'], nesmi: /\bEMU\b/i },                 // EIMI/EMIM
  { slug: 'nejlepsi-japonske-etf', nesmi: /ex[- ]?japan/i },
  { slug: 'nejlepsi-cinske-etf', nesmi: /ex[- .]*china/i },
  { slug: 'nejlepsi-zlato-etf', musi: ['IE00B4ND3602'] },                                               // SGLN
  { slug: 'nejlepsi-ropa-etf' },
  { slug: 'nejlepsi-nasdaq-etf', nesmi: /biotech/i },
];

async function nactiFondy() {
  const cols = 'isin,name,fund_provider,ter_numeric,return_1y,is_leveraged,distribution_policy,updated_at,scraping_date';
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
  if (ter.length) poplach.push({ co: `${ter.length} fondů s nemožným TER (< 0 nebo > 5 %)`, ukazka: ukazka(ter, (x) => `${x.isin} TER ${x.ter_numeric}`) });

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
  const paka = fondy.filter((x) => x.is_leveraged && CYKLUS.test(x.name || ''));
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
    const nalezy = souboryKodu('src').flatMap((p) => readFileSync(p, 'utf8').split('\n')
      .map((l, i) => (FALLBACK.test(l) ? `${p}:${i + 1}` : null)).filter(Boolean));
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

  // ── ZLATÁ SADA ŽEBŘÍČKŮ (živý web) ──
  // Ověřuje, že v kategorii JSOU fondy, které tam patří, a NEJSOU tam pákové produkty a fondy
  // „ex <region>" (audit 17. 10. 2026: japonské obsahovaly „ex Japan", čínské „ex-China", ropa
  // vedla 2× pákovým WTI). Selhání = POPLACH – žebříčky jsou nejnavštěvovanější stránky z Bingu.
  for (const z of ZLATA_SADA) {
    let html = '';
    try { html = await fetch(`${WEB_URL}/nejlepsi-etf/${z.slug}`).then((r) => (r.ok ? r.text() : '')); } catch { /* níže */ }
    if (!html) { poplach.push({ co: `Žebříček /nejlepsi-etf/${z.slug} se nenačetl`, ukazka: [] }); continue; }
    const isiny = new Set([...html.matchAll(/\/etf\/([A-Z]{2}[A-Z0-9]{10})/g)].map((m) => m[1]));
    const chybi = (z.musi || []).filter((i) => !isiny.has(i));
    const byName = new Map(fondy.map((f) => [f.isin, f]));
    const cizi = [...isiny].map((i) => byName.get(i)).filter((f) => f && (f.is_leveraged || (z.nesmi && z.nesmi.test(f.name || ''))));
    if (chybi.length) poplach.push({ co: `Žebříček ${z.slug}: chybí fondy, které tam patří`, ukazka: chybi });
    if (cizi.length) poplach.push({ co: `Žebříček ${z.slug}: obsahuje fondy, které tam nepatří (páka / jiný region)`, ukazka: ukazka(cizi) });
  }

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

  // ── ČÍSLO NA HOMEPAGE (Korunový stroj času) ──
  // „5 000 Kč měsíčně do akcií celého světa od roku 2010 by dnes bylo zhruba X mil. Kč“ se počítá
  // z měsíčních řad stroje času; tady ho nezávisle přepočítá PLNÁ simulace backtestu (jiná cesta kódu:
  // denní řada, skutečné vklady). Stroj se od backtestu liší o 0,1–0,4 % (vklad na začátku měsíce),
  // hodnota je zaokrouhlená na 0,1 mil. → tolerance 0,06 mil. + 1 %. Pravidlo č. 1, bod 4.
  try {
    const html = await fetch(`${WEB_URL}/`).then((r) => (r.ok ? r.text() : ''));
    const text = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|\u00a0/g, ' ').replace(/\s+/g, ' ');
    const m = text.match(/od roku 2010 by dnes bylo zhruba ([0-9]+(?:,[0-9])?) mil\. Kč/);
    // Backtest končí ke dni „data k …“ z homepage (stránka je v ISR cache – jinak by denní pohyb trhu
    // mezi renderem a kontrolou dělal falešný poplach).
    const dk = text.match(/data k ([0-9]{1,2})\. ([0-9]{1,2})\. ([0-9]{4})/);
    const konecDat = dk ? `${dk[3]}-${dk[2].padStart(2, '0')}-${dk[1].padStart(2, '0')}` : new Date().toISOString().slice(0, 10);
    if (!m) {
      varovani.push({ co: 'Homepage neukazuje číslo ze stroje času (5 000 Kč měsíčně od 2010) – data starší 7 dní, nebo chyba', ukazka: [] });
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
      if (!ocek) varovani.push({ co: 'Číslo na homepage nešlo ověřit – backtest API neodpovědělo', ukazka: [] });
      else if (Math.abs(web - ocek) > 0.06e6 + 0.015 * ocek) {
        poplach.push({ co: 'Číslo na homepage nesedí s plnou simulací backtestu', ukazka: [`web ${m[1]} mil. Kč vs. backtest ${(ocek / 1e6).toFixed(2)} mil. Kč`] });
      }
    }
  } catch (e) {
    varovani.push({ co: `Kontrolu čísla na homepage se nepodařilo provést: ${e.message}`, ukazka: [] });
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
