#!/usr/bin/env node
/* CEO měření: experiment diferencované indexace detailů fondů /etf/[isin].
 *
 * Od 2026-07-07: hlava (fondy ≥ 2 mld. EUR) indexována i Googlem; dlouhý ocas
 * googlebot-noindex; Bing/Seznam/ostatní indexují vše. Cíl: podchytit a růst
 * traffic z detailů (GA4 baseline: 688 zobrazení, 96 uživatelů, 54 organic /28 dní),
 * který jsme si dřív blanket-noindexem podřezávali.
 *
 * Tento skript sleduje, JESTLI a ODKUD traffic na /etf/ roste (rozpad podle
 * vyhledávače) a jestli Google začíná hlavu indexovat (GSC imprese).
 *
 * SPUŠTĚNÍ: node scripts/etf-index-watch.mjs [dny]   (default 28)
 * Ukládá dated snapshoty do .secrets/etf-index-history.json (trend vs minule).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createSign } from 'node:crypto';

const KEY_PATH = '.secrets/gsc-service-account.json';
const HIST = '.secrets/etf-index-history.json';
const GA4 = process.env.GA4_PROPERTY_ID || '493400123';
const SITE = process.env.GSC_SITE || 'sc-domain:etfpruvodce.cz';
const DAYS = parseInt(process.argv[2] || '28', 10);

if (!existsSync(KEY_PATH)) { console.error('❌ Chybí ' + KEY_PATH); process.exit(1); }
const key = JSON.parse(readFileSync(KEY_PATH, 'utf8'));
const b64 = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function tok() {
  const n = Math.floor(Date.now() / 1e3);
  const h = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const c = b64(JSON.stringify({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', exp: n + 3600, iat: n }));
  const s = createSign('RSA-SHA256'); s.update(`${h}.${c}`);
  const a = `${h}.${c}.${b64(s.sign(key.private_key))}`;
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: a }) });
  return (await r.json()).access_token;
}
const ga = (t, b) => fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${GA4}:runReport`, { method: 'POST', headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then((r) => r.json());
const gsc = (t, b) => fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, { method: 'POST', headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then((r) => r.json());

const PROD = { fieldName: 'hostName', inListFilter: { values: ['etfpruvodce.cz', 'www.etfpruvodce.cz'] } };
const etfFilter = (f) => ({ andGroup: { expressions: [{ filter: PROD }, { filter: { fieldName: f, stringFilter: { matchType: 'BEGINS_WITH', value: '/etf/' } } }] } });
const dstr = (d) => d.toISOString().slice(0, 10);

(async () => {
  const t = await tok();
  const dr = [{ startDate: `${DAYS}daysAgo`, endDate: 'today' }];

  // 1) celkové zobrazení/uživatelé detailů
  const pv = await ga(t, { dateRanges: dr, dimensionFilter: etfFilter('pagePath'), metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }] });
  const pageViews = +(pv.rows?.[0]?.metricValues?.[0]?.value || 0);
  const users = +(pv.rows?.[0]?.metricValues?.[1]?.value || 0);

  // 2) vstupy (landing) na /etf/ podle KONKRÉTNÍHO zdroje (google/bing/seznam/…)
  const land = await ga(t, { dateRanges: dr, dimensionFilter: etfFilter('landingPagePlusQueryString'), dimensions: [{ name: 'sessionSource' }], metrics: [{ name: 'sessions' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 15 });
  const sources = (land.rows || []).map((r) => ({ src: r.dimensionValues[0].value, sessions: +r.metricValues[0].value }));

  // 3) GSC (jen Google): imprese/kliky pro /etf/ – ukazatel, že Google začal indexovat hlavu
  const end = new Date(); end.setDate(end.getDate() - 3);
  const start = new Date(end); start.setDate(start.getDate() - DAYS);
  const gp = (await gsc(t, { startDate: dstr(start), endDate: dstr(end), dimensions: ['page'], rowLimit: 1000 }).catch(() => ({}))).rows || [];
  const etf = gp.filter((r) => r.keys[0].includes('/etf/'));
  const gImpr = etf.reduce((s, r) => s + r.impressions, 0);
  const gClicks = etf.reduce((s, r) => s + r.clicks, 0);

  const snap = { date: dstr(new Date()), days: DAYS, pageViews, users, sources, googleEtfUrls: etf.length, googleImpr: gImpr, googleClicks: gClicks };

  // historie + trend
  const hist = existsSync(HIST) ? JSON.parse(readFileSync(HIST, 'utf8')) : [];
  const prev = hist[hist.length - 1];
  hist.push(snap); writeFileSync(HIST, JSON.stringify(hist, null, 2));

  const arrow = (c, p) => (p == null ? '' : c > p ? `  ▲ +${c - p}` : c < p ? `  ▼ ${c - p}` : '  =');
  console.log(`\n📊 /etf/ detaily fondů – experiment indexace (${DAYS} dní, jen produkce)`);
  console.log(`   Datum: ${snap.date}${prev ? `   (vs ${prev.date})` : '   (BASELINE)'}`);
  console.log(`   Zobrazení: ${pageViews}${arrow(pageViews, prev?.pageViews)}`);
  console.log(`   Uživatelé: ${users}${arrow(users, prev?.users)}`);
  console.log(`\n   Vstupy (landing) na /etf/ podle zdroje:`);
  if (!sources.length) console.log('     (žádné)');
  for (const s of sources) console.log(`     ${String(s.sessions).padStart(4)}  ${s.src}`);
  console.log(`\n   Google (GSC): ${etf.length} /etf/ URL s impresí, ${gImpr} impresí, ${gClicks} kliků${arrow(gImpr, prev?.googleImpr)}`);
  console.log(`     ↳ růst tady = Google začal indexovat „hlavu" (cíl experimentu).`);
  console.log(`\n   💾 Snapshot uložen do ${HIST} (${hist.length} záznamů).`);
})().catch((e) => { console.error('❌ ' + e.message); process.exit(1); });
