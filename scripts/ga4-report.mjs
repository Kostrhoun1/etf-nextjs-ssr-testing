#!/usr/bin/env node
/* Google Analytics 4 report pro CEO – chování uživatelů NA webu (doplněk k GSC,
 * které měří vyhledávání PŘED klikem). Reuse stejného service-account klíče.
 *
 * SETUP (jednorázově, viz SETUP-MERENI.md):
 *   1. V Google Cloud (stejný projekt) povol "Google Analytics Data API".
 *   2. V GA4 → Admin → Property Access Management → přidej e-mail service accountu
 *      (etf-gsc-reader@…iam.gserviceaccount.com) jako "Viewer".
 *   3. Zjisti GA4 Property ID (Admin → Property Settings → Property ID, číslo)
 *      a nastav:  export GA4_PROPERTY_ID="123456789"
 *
 * SPUŠTĚNÍ:  node scripts/ga4-report.mjs [dny]   (default 28)
 */

import { readFileSync, existsSync } from 'node:fs';
import { createSign } from 'node:crypto';

const KEY_PATH = '.secrets/gsc-service-account.json';
let PROPERTY = process.env.GA4_PROPERTY_ID;
const DAYS = parseInt(process.argv[2] || '28', 10);

const b64url = (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fail = (m) => { console.error('\n❌ ' + m + '\nNastavení: viz SETUP-MERENI.md.'); process.exit(1); };

if (!existsSync(KEY_PATH)) fail(`Chybí klíč ${KEY_PATH}.`);
const key = JSON.parse(readFileSync(KEY_PATH, 'utf8'));

/** Když není GA4_PROPERTY_ID, zkus ho zjistit z Admin API (co SA vidí). */
async function discoverProperty(token) {
  const res = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', { headers: { Authorization: `Bearer ${token}` } });
  const j = await res.json();
  if (j.error) fail(`Admin API (${j.error.code}): ${j.error.message}. Buď povol "Google Analytics Admin API" v Cloudu, nebo nastav GA4_PROPERTY_ID ručně.`);
  const props = [];
  for (const acc of j.accountSummaries || []) for (const p of acc.propertySummaries || []) props.push({ id: (p.property || '').replace('properties/', ''), name: p.displayName });
  if (!props.length) fail('Service account nevidí žádnou GA4 property. Přidej ho jako Viewer v GA4 → Admin → Property Access Management.');
  console.log('   Dostupné property:', props.map((p) => `${p.name} (${p.id})`).join(', '));
  const match = props.find((p) => /etf|pruvodce/i.test(p.name)) || props[0];
  return match.id;
}

async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly', aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now }));
  const s = createSign('RSA-SHA256'); s.update(`${header}.${claim}`);
  const assertion = `${header}.${claim}.${b64url(s.sign(key.private_key))}`;
  const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }) });
  const j = await res.json(); if (!j.access_token) fail('Token: ' + JSON.stringify(j)); return j.access_token;
}

async function runReport(token, body) {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY}:runReport`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await res.json(); if (j.error) fail(`API (${j.error.code}): ${j.error.message}`); return j;
}

const range = [{ startDate: `${DAYS}daysAgo`, endDate: 'today' }];
const rows = (r) => r.rows || [];
const mv = (row, i) => row.metricValues?.[i]?.value ?? '0';
const dv = (row, i) => row.dimensionValues?.[i]?.value ?? '';

(async () => {
  const token = await getToken();
  if (!PROPERTY) PROPERTY = await discoverProperty(token);
  const totals = await runReport(token, { dateRanges: range, metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'averageSessionDuration' }, { name: 'engagementRate' }] });
  const t = rows(totals)[0];
  const pages = await runReport(token, { dateRanges: range, dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 10 });
  const src = await runReport(token, { dateRanges: range, dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'sessions' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 8 });
  const dev = await runReport(token, { dateRanges: range, dimensions: [{ name: 'deviceCategory' }], metrics: [{ name: 'sessions' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] });

  console.log(`\n📈 Google Analytics 4 – posledních ${DAYS} dní`);
  if (t) {
    console.log(`   Uživatelé:          ${Number(mv(t, 0)).toLocaleString('cs-CZ')}`);
    console.log(`   Návštěvy (sessions):${Number(mv(t, 1)).toLocaleString('cs-CZ')}`);
    console.log(`   Zobrazení stránek:  ${Number(mv(t, 2)).toLocaleString('cs-CZ')}`);
    console.log(`   Prům. délka návštěvy: ${Math.round(Number(mv(t, 3)))} s`);
    console.log(`   Míra zapojení:      ${(Number(mv(t, 4)) * 100).toFixed(1)} %`);
  }
  console.log('\n   📄 Nejnavštěvovanější stránky:');
  rows(pages).forEach((r) => console.log(`      ${String(mv(r, 0)).padStart(6)}  ${dv(r, 0).slice(0, 55)}`));
  console.log('\n   🚪 Odkud přišli (kanály):');
  rows(src).forEach((r) => console.log(`      ${String(mv(r, 0)).padStart(6)}  ${dv(r, 0)}`));
  console.log('\n   📱 Zařízení:');
  rows(dev).forEach((r) => console.log(`      ${String(mv(r, 0)).padStart(6)}  ${dv(r, 0)}`));
  console.log('');
})();
