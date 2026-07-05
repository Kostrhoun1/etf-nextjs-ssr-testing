#!/usr/bin/env node
/* CEO analytický report – Ředitelství dat a růstu.
 *
 * Jeden týdenní přehled: GA4 (chování NA webu) + Search Console (výkon VE vyhledávání),
 * uloží dated snapshot do .secrets/analytics-history.json, spočítá trend vs minule
 * a AUTOMATICKY vypíše příležitosti („striking distance" dotazy, stránky s vysokou
 * impresí a nízkým CTR, stránky s krátkým časem). Slouží jako podklad pro pravidelné
 * úpravy webu (viz ANALYTIKA-REPORTING.md).
 *
 * SPUŠTĚNÍ:  node scripts/ceo-analytics.mjs [dny]     (default 28)
 * Klíč: .secrets/gsc-service-account.json (stejný jako gsc/ga4 report).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createSign } from 'node:crypto';

const KEY_PATH = '.secrets/gsc-service-account.json';
const HIST_PATH = '.secrets/analytics-history.json';
const GA4 = process.env.GA4_PROPERTY_ID || '493400123';
const SITE = process.env.GSC_SITE || 'sc-domain:etfpruvodce.cz';
const DAYS = parseInt(process.argv[2] || '28', 10);

const fail = (m) => { console.error('\n❌ ' + m); process.exit(1); };
if (!existsSync(KEY_PATH)) fail(`Chybí klíč ${KEY_PATH} (viz SETUP-MERENI.md).`);
const key = JSON.parse(readFileSync(KEY_PATH, 'utf8'));
const b64url = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  const h = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const c = b64url(JSON.stringify({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now,
  }));
  const s = createSign('RSA-SHA256'); s.update(`${h}.${c}`);
  const a = `${h}.${c}.${b64url(s.sign(key.private_key))}`;
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: a }) });
  const j = await r.json(); if (!j.access_token) fail('Token: ' + JSON.stringify(j)); return j.access_token;
}

const ga4 = (tok, body) => fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${GA4}:runReport`, { method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then((r) => r.json());
const gsc = (tok, body) => fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, { method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then((r) => r.json());

const dstr = (d) => d.toISOString().slice(0, 10);
const fmtT = (s) => { s = Math.round(s); const m = Math.floor(s / 60); return m > 0 ? `${m}m ${s % 60}s` : `${s}s`; };
const pct = (cur, old) => (old ? `${cur >= old ? '+' : ''}${(((cur - old) / old) * 100).toFixed(0)} %` : 'n/a');

(async () => {
  const tok = await getToken();
  const dr = [{ startDate: `${DAYS}daysAgo`, endDate: 'today' }];

  // Počítáme JEN produkční host (etfpruvodce.cz / www) – vyloučí localhost,
  // vercel.app preview a jakékoli interní/QA návštěvy (např. testování Claude Code),
  // aby čísla nebyla znehodnocená.
  const PROD = { filter: { fieldName: 'hostName', inListFilter: { values: ['etfpruvodce.cz', 'www.etfpruvodce.cz'] } } };

  // ---- GA4 ----
  const overview = await ga4(tok, { dateRanges: dr, dimensionFilter: PROD, metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'averageSessionDuration' }, { name: 'engagementRate' }] });
  const o = overview.rows?.[0]?.metricValues?.map((m) => +m.value) || [0, 0, 0, 0, 0];
  const pagesR = await ga4(tok, { dateRanges: dr, dimensionFilter: PROD, dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }, { name: 'userEngagementDuration' }, { name: 'engagementRate' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 15 });
  const chR = await ga4(tok, { dateRanges: dr, dimensionFilter: PROD, dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'sessions' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 6 });

  // ---- GSC (má ~2denní zpoždění) ----
  const end = new Date(Date.now() - 2 * 86400000);
  const start = new Date(end.getTime() - DAYS * 86400000);
  const grange = { startDate: dstr(start), endDate: dstr(end) };
  const gTot = (await gsc(tok, { ...grange, dimensions: ['date'], rowLimit: 1000 })).rows || [];
  const clicks = gTot.reduce((a, r) => a + (r.clicks || 0), 0);
  const impr = gTot.reduce((a, r) => a + (r.impressions || 0), 0);
  const gQ = (await gsc(tok, { ...grange, dimensions: ['query'], rowLimit: 25 })).rows || [];
  const gP = (await gsc(tok, { ...grange, dimensions: ['page'], rowLimit: 25 })).rows || [];

  // ---- trend vs minulý snapshot ----
  const hist = existsSync(HIST_PATH) ? JSON.parse(readFileSync(HIST_PATH, 'utf8')) : [];
  const prev = hist[hist.length - 1] || null;

  console.log(`\n════════ CEO ANALYTIKA – posledních ${DAYS} dní ════════`);
  console.log(`\n📈 GA4 (chování na webu)`);
  console.log(`   Uživatelé: ${o[0].toLocaleString('cs-CZ')}${prev ? ` (${pct(o[0], prev.users)} vs minule)` : ''}  ·  Návštěvy: ${o[1].toLocaleString('cs-CZ')}  ·  Zobrazení: ${o[2].toLocaleString('cs-CZ')}`);
  console.log(`   Prům. návštěva: ${fmtT(o[3])}  ·  Zapojení: ${(o[4] * 100).toFixed(1)} %`);
  console.log(`\n   📄 Kam chodí a jak dlouho:`);
  for (const r of pagesR.rows || []) {
    const v = +r.metricValues[0].value, eng = +r.metricValues[1].value, er = +r.metricValues[2].value;
    console.log(`      ${String(v).padStart(5)} zobr. · ${fmtT(v ? eng / v : 0).padStart(7)}/zobr. · ${(er * 100).toFixed(0).padStart(3)}% zap. · ${r.dimensionValues[0].value.slice(0, 44)}`);
  }
  console.log(`\n   🚪 Kanály: ${(chR.rows || []).map((r) => `${r.dimensionValues[0].value} ${(+r.metricValues[0].value)}`).join(' · ')}`);

  console.log(`\n🔎 Search Console (${grange.startDate} → ${grange.endDate})`);
  console.log(`   Prokliky: ${clicks.toLocaleString('cs-CZ')}${prev ? ` (${pct(clicks, prev.clicks)} vs minule)` : ''}  ·  Imprese: ${impr.toLocaleString('cs-CZ')}${prev ? ` (${pct(impr, prev.impressions)})` : ''}  ·  CTR: ${impr ? ((clicks / impr) * 100).toFixed(2) : 0} %`);
  console.log(`   Top dotazy: ${gQ.slice(0, 8).map((r) => `${r.keys[0]} (${r.clicks})`).join(' · ')}`);

  // ---- AUTOMATICKÉ PŘÍLEŽITOSTI ----
  console.log(`\n💡 Příležitosti (podklad pro úpravy):`);
  // 1) striking distance: dotazy na pozici 5–20 s dostatečnou impresí → dotlačit na 1. stranu
  const striking = gQ.filter((r) => r.position >= 4.5 && r.position <= 20 && r.impressions >= 20)
    .sort((a, b) => b.impressions - a.impressions).slice(0, 6);
  if (striking.length) {
    console.log(`   • Na dosah 1. strany (posílit obsah/proklik):`);
    striking.forEach((r) => console.log(`       „${r.keys[0]}" – poz. ${r.position.toFixed(1)}, ${r.impressions} impr., ${r.clicks} kliků, CTR ${(r.ctr * 100).toFixed(1)} %`));
  }
  // 2) vysoká imprese + nízké CTR → zlepšit title/description
  const lowCtr = gP.filter((r) => r.impressions >= 50 && r.ctr < 0.02)
    .sort((a, b) => b.impressions - a.impressions).slice(0, 5);
  if (lowCtr.length) {
    console.log(`   • Vysoká imprese, nízké CTR (vylepšit title/description):`);
    lowCtr.forEach((r) => console.log(`       ${r.keys[0].replace('https://www.etfpruvodce.cz', '')} – ${r.impressions} impr., CTR ${(r.ctr * 100).toFixed(2)} %`));
  }
  // 3) hodně návštěv, krátký čas → zlepšit obsah/engagement stránky
  const shortDwell = (pagesR.rows || []).filter((r) => +r.metricValues[0].value >= 80 && (+r.metricValues[1].value / Math.max(1, +r.metricValues[0].value)) < 20)
    .slice(0, 5);
  if (shortDwell.length) {
    console.log(`   • Hodně návštěv, krátký čas (obohatit stránku):`);
    shortDwell.forEach((r) => console.log(`       ${r.dimensionValues[0].value} – ${+r.metricValues[0].value} zobr., jen ${fmtT(+r.metricValues[1].value / Math.max(1, +r.metricValues[0].value))}/zobr.`));
  }

  // ---- cíl 10× ----
  const baseline = hist[0];
  if (baseline && baseline.clicks) {
    console.log(`\n🎯 Cíl 10× organiky: start ${baseline.date} = ${baseline.clicks} kliků → cíl ${baseline.clicks * 10}. Nyní ${(clicks / baseline.clicks).toFixed(1)}× startu.`);
  }

  // ---- ulož snapshot ----
  if (!existsSync('.secrets')) mkdirSync('.secrets');
  hist.push({
    date: dstr(new Date()), days: DAYS,
    users: o[0], sessions: o[1], pageviews: o[2], avgSessionSec: Math.round(o[3]), engagementRate: +(o[4]).toFixed(3),
    clicks, impressions: impr, ctr: impr ? +((clicks / impr) * 100).toFixed(2) : 0,
    topPages: (pagesR.rows || []).slice(0, 10).map((r) => ({ path: r.dimensionValues[0].value, views: +r.metricValues[0].value, secPerView: Math.round(+r.metricValues[1].value / Math.max(1, +r.metricValues[0].value)) })),
  });
  writeFileSync(HIST_PATH, JSON.stringify(hist, null, 2));
  console.log(`\n💾 Snapshot uložen (${HIST_PATH}, celkem ${hist.length} záznamů).\n`);
})();
