#!/usr/bin/env node
/* Search Console report pro CEO – měří organický trend vůči cíli 10× návštěvnosti.
 *
 * Bez externích závislostí: JWT (RS256) podepíše Node crypto, token vymění přes
 * OAuth token endpoint, data tahá ze Search Analytics API.
 *
 * SETUP (jednorázově, dělá majitel – viz SETUP-MERENI.md):
 *   1. V Google Cloud vytvoř service account + JSON klíč.
 *   2. Klíč ulož do  .secrets/gsc-service-account.json  (je v .gitignore).
 *   3. V Search Console přidej e-mail service accountu jako uživatele property.
 *   4. Případně nastav property:  export GSC_SITE="sc-domain:etfpruvodce.cz"
 *      (default) nebo "https://www.etfpruvodce.cz/".
 *
 * SPUŠTĚNÍ:  node scripts/gsc-report.mjs [dny]     (default 28 dní)
 * Uloží snapshot do .secrets/gsc-history.json a vypíše trend vs minulý běh.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createSign } from 'node:crypto';

const KEY_PATH = '.secrets/gsc-service-account.json';
const HIST_PATH = '.secrets/gsc-history.json';
const SITE = process.env.GSC_SITE || 'sc-domain:etfpruvodce.cz';
const DAYS = parseInt(process.argv[2] || '28', 10);

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fail(msg) {
  console.error('\n❌ ' + msg + '\n');
  console.error('Nastavení měření: viz SETUP-MERENI.md v kořeni projektu.');
  process.exit(1);
}

if (!existsSync(KEY_PATH)) {
  fail(`Chybí klíč ${KEY_PATH}. Search Console měření zatím není napojené – CEO zatím sleduje leading indikátory (scripts/seo-scorecard.mjs).`);
}

const key = JSON.parse(readFileSync(KEY_PATH, 'utf8'));

async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600, iat: now,
  }));
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claim}`);
  const sig = b64url(signer.sign(key.private_key));
  const assertion = `${header}.${claim}.${sig}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  });
  const j = await res.json();
  if (!j.access_token) fail('Nepodařilo se získat token: ' + JSON.stringify(j));
  return j.access_token;
}

function dateStr(d) { return d.toISOString().slice(0, 10); }

async function query(token, body) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
  );
  const j = await res.json();
  if (j.error) fail(`API chyba (${j.error.code}): ${j.error.message}. Zkontroluj GSC_SITE a přístup service accountu k property.`);
  return j.rows || [];
}

(async () => {
  const token = await getToken();
  const end = new Date(Date.now() - 2 * 86400000); // GSC má ~2denní zpoždění
  const start = new Date(end.getTime() - DAYS * 86400000);
  const range = { startDate: dateStr(start), endDate: dateStr(end) };

  const totalsRows = await query(token, { ...range, dimensions: ['date'], rowLimit: 1000 });
  const totals = totalsRows.reduce((a, r) => ({ clicks: a.clicks + (r.clicks || 0), impressions: a.impressions + (r.impressions || 0) }), { clicks: 0, impressions: 0 });
  const topQueries = await query(token, { ...range, dimensions: ['query'], rowLimit: 10 });
  const topPages = await query(token, { ...range, dimensions: ['page'], rowLimit: 10 });

  // trend vs minulý snapshot
  let prev = null;
  if (existsSync(HIST_PATH)) {
    try { const h = JSON.parse(readFileSync(HIST_PATH, 'utf8')); prev = h[h.length - 1] || null; } catch { /* ignore */ }
  }
  const pctChange = (cur, old) => (old ? `${(((cur - old) / old) * 100).toFixed(0)}%` : 'n/a');

  console.log(`\n📊 Search Console – ${SITE}`);
  console.log(`   Období: ${range.startDate} → ${range.endDate} (${DAYS} dní)`);
  console.log(`   Prokliky:  ${totals.clicks.toLocaleString('cs-CZ')}${prev ? `  (${pctChange(totals.clicks, prev.clicks)} vs minule)` : ''}`);
  console.log(`   Imprese:   ${totals.impressions.toLocaleString('cs-CZ')}${prev ? `  (${pctChange(totals.impressions, prev.impressions)} vs minule)` : ''}`);
  console.log(`   CTR:       ${totals.impressions ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : '0'} %`);
  console.log('\n   🔎 Top dotazy:');
  topQueries.forEach((r) => console.log(`      ${String(r.clicks).padStart(4)} kliků  ${(r.keys[0] || '').slice(0, 50)}`));
  console.log('\n   📄 Top stránky:');
  topPages.forEach((r) => console.log(`      ${String(r.clicks).padStart(4)} kliků  ${(r.keys[0] || '').replace('https://www.etfpruvodce.cz', '')}`));

  // cíl 10×
  if (prev && prev.clicks) {
    console.log(`\n   🎯 Cíl 10× (start ${prev.date}: ${prev.clicks} kliků): potřeba ${prev.clicks * 10} kliků. Aktuálně ${(totals.clicks / prev.clicks).toFixed(1)}× startu.`);
  }

  // ulož snapshot
  if (!existsSync('.secrets')) mkdirSync('.secrets');
  const hist = existsSync(HIST_PATH) ? JSON.parse(readFileSync(HIST_PATH, 'utf8')) : [];
  hist.push({ date: dateStr(new Date()), days: DAYS, clicks: totals.clicks, impressions: totals.impressions });
  writeFileSync(HIST_PATH, JSON.stringify(hist, null, 2));
  console.log(`\n   💾 Snapshot uložen (${HIST_PATH}). Spusť pravidelně pro trend.\n`);
})();
