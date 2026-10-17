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

import { appendFileSync } from 'node:fs';

const KEY = process.env.SUPABASE_KEY;
const URL_DB = 'https://nbhwnatadyubiuadfakx.supabase.co/rest/v1/etf_funds';
const ISIN_CSV = 'https://raw.githubusercontent.com/Kostrhoun1/etf-astro/main/scraper/ISIN.csv';
if (!KEY) { console.error('❌ Chybí SUPABASE_KEY'); process.exit(1); }

// ── prahy POPLACHU (17. 10. 2026: 5 146 fondů, 6,4 % starších 30 dní, ~94 % čerstvých) ──
const MIN_FONDU = 4500;          // hromadný úbytek = něco smazalo/nenačetlo data
const MAX_STARE_30D = 0.15;      // přes 15 % fondů neaktualizovaných 30 dní = scraper selhává plošně
const MIN_CERSTVE_3D = 0.70;     // pod 70 % aktualizovaných za 3 dny = scraper přestal běžet
                                 // (tohle se projeví hned druhý den, stáří 30 dní až po měsíci)

const CYKLUS = /(short duration|short maturity|short[- ]term|ultrashort|ultra short)/i;

async function nactiFondy() {
  const cols = 'isin,name,fund_provider,ter_numeric,return_1y,is_leveraged,distribution_policy,updated_at';
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

  const dni = (x) => (Date.now() - new Date(x.updated_at)) / 864e5;
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
  if (zaseklé.length) varovani.push({ co: `${zaseklé.length} fondů je v nabídce, ale scraper je přes 90 dní neaktualizoval`, ukazka: ukazka(zaseklé, (x) => `${x.isin} ${String(x.name).slice(0, 34)} (${String(x.updated_at).slice(0, 10)})`) });
  const paka = fondy.filter((x) => x.is_leveraged && CYKLUS.test(x.name || ''));
  if (paka.length) varovani.push({ co: `${paka.length} fondů s krátkou durací označených jako pákové (skryté ve srovnávači)`, ukazka: ukazka(paka) });
  const extrem = fondy.filter((x) => !x.is_leveraged && x.return_1y != null && Math.abs(Number(x.return_1y)) > 150);
  if (extrem.length) varovani.push({ co: `${extrem.length} NEpákových fondů s ročním výnosem přes ±150 % – ověřit, jestli je číslo skutečné`, ukazka: ukazka(extrem, (x) => `${x.isin} ${String(x.name).slice(0, 34)} ${x.return_1y} %`) });
  const bezPolitiky = fondy.filter((x) => !x.distribution_policy).length;
  if (bezPolitiky) varovani.push({ co: `${bezPolitiky} fondů bez typu výplaty (akumulační/distribuční) – filtr je u nich nenajde`, ukazka: [] });

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
