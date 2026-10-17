#!/usr/bin/env node
/**
 * SEZNAM WEBMASTER – co o webu ví vyhledávač Seznam.
 *
 * PROČ: Google tuhle doménu dlouhodobě nepouští výš, Seznam ano – od týdne 5. 10. 2026
 * poslal z ČR ~4× víc návštěv, hlavně na detaily fondů (82 % zapojených). Webové rozhraní
 * Webmasteru ukazuje jen souhrnná čísla a graf; detaily (ukázky URL, historie po dnech) jsou
 * jen v API. Vyhledávací DOTAZY Seznam neposkytuje vůbec – ani v rozhraní, ani v API.
 *
 * KLÍČ: .secrets/seznam.env jako SEZNAM_WMT_KEY (klíč JEN PRO ČTENÍ, ze sekce API → Přístupové
 * klíče ve Webmasteru). Klíč se posílá jako query parametr ?key= – proto se URL NIKDY nevypisuje
 * a každý výstup se čistí.
 *
 * DATA: chodí v dávkách (`/database-info` → release). HTTP 204 = „dotaz OK, data zatím nejsou"
 * – typicky prvních ~24 h po ověření webu. Datový model převzat z popisu API a z open-source
 * projektu PavelUngr/seznam-webmaster-mcp (jen čteno, jejich kód nespouštíme).
 *
 * SPUŠTĚNÍ:
 *   set -a && . ./.secrets/seznam.env && set +a
 *   node scripts/seznam-webmaster.mjs              # vypíše + uloží snapshot do historie
 *   node scripts/seznam-webmaster.mjs --dry        # jen vypíše
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const KEY = process.env.SEZNAM_WMT_KEY;
const BASE = 'https://reporter.seznam.cz/wm-api';
const HIST = '.secrets/seznam-history.json';
const DRY = process.argv.includes('--dry');

if (!KEY) {
  console.error('❌ Chybí SEZNAM_WMT_KEY. Spusť nejdřív: set -a && . ./.secrets/seznam.env && set +a');
  process.exit(1);
}

const cisti = (s) => String(s).split(KEY).join('REDACTED').replace(/([?&])key=[^&\s"'<>]+/g, '$1key=REDACTED');

async function api(path, query = {}) {
  const u = new URL(BASE + path);
  u.searchParams.set('key', KEY);
  for (const [k, v] of Object.entries(query)) if (v != null) u.searchParams.set(k, v);
  let r;
  try { r = await fetch(u, { headers: { Accept: 'application/json' } }); }
  catch (e) { throw new Error(cisti(`${path}: síť – ${e.message}`)); }
  if (r.status === 204) return null; // data zatím nejsou
  const t = await r.text();
  if (r.status === 401) throw new Error('nesprávný API klíč (401)');
  if (!r.ok) throw new Error(cisti(`${path}: HTTP ${r.status} ${t.slice(0, 160)}`));
  return JSON.parse(t);
}

/** Typ stránky podle cesty – ať je vidět, CO má Seznam v indexu. */
function typ(url) {
  let p;
  try { const u = new URL(url); if (u.hostname.startsWith('www.')) return 'www varianta'; p = u.pathname; }
  catch { return 'neplatná URL'; }
  if (p === '/' || p === '') return 'homepage';
  if (p.startsWith('/etf/')) return 'detail fondu';
  if (p.startsWith('/nejlepsi-etf/')) return 'žebříček';
  if (p.startsWith('/srovnani')) return 'srovnávač';
  if (/kalkul|backtest|monte-carlo|fire|cisty-plat|dip/.test(p)) return 'nástroj';
  if (/2025/.test(p)) return 'stará URL (2025)';
  return 'ostatní';
}

const pocetDleTypu = (urls) => {
  const m = {};
  for (const u of urls) m[typ(u)] = (m[typ(u)] || 0) + 1;
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
};

const main = async () => {
  const db = await api('/database-info');
  console.log(`SEZNAM WEBMASTER – etfpruvodce.cz   (dávka dat: ${db?.release ?? '?'})\n${'='.repeat(70)}`);

  const docs = await api('/web/documents');
  if (!docs) {
    console.log('\n⏳ Data webu zatím nejsou dostupná (HTTP 204). Objeví se s další dávkou –');
    console.log('   typicky do 24 h po ověření webu. Zkus to znovu později.');
    return;
  }

  // ── souhrn ────────────────────────────────────────────────────────────────
  const radek = (nazev, x) => console.log(`  ${nazev.padEnd(26)} ${String(x?.count ?? '—').padStart(6)}`);
  console.log('\nAKTUÁLNÍ STAV');
  radek('robot o nich ví', docs.doc_count);
  radek('stažené (zná obsah)', docs.content);
  radek('V INDEXU', docs.index);
  radek('přesměrování', docs.redirect);
  radek('chyba', docs.error);

  // ── co je v indexu (podle ukázky) ─────────────────────────────────────────
  for (const [nazev, x] of [['V INDEXU', docs.index], ['STAŽENÉ', docs.content], ['PŘESMĚROVÁNÍ', docs.redirect], ['CHYBA', docs.error]]) {
    const urls = x?.urls ?? [];
    if (!urls.length) continue;
    console.log(`\n${nazev} – ukázka ${urls.length} z ${x.count} URL podle typu`);
    for (const [t, n] of pocetDleTypu(urls)) console.log(`  ${String(n).padStart(5)}  ${t}`);
    if (nazev === 'PŘESMĚROVÁNÍ' || nazev === 'CHYBA') urls.slice(0, 25).forEach((u) => console.log(`         ${u}`));
  }

  // ── historie – kdy se co pohnulo ──────────────────────────────────────────
  const od = new Date(Date.now() - 120 * 864e5).toISOString().slice(0, 10);
  const hist = (await api('/web/documents-history', { date_from: od })) ?? [];
  if (hist.length) {
    console.log(`\nHISTORIE (${hist.length} záznamů od ${od})   v indexu | staženo | ví o nich | přesměr. | chyba`);
    const max = Math.max(...hist.map((h) => h.counts?.indexed ?? 0), 1);
    for (const h of [...hist].sort((a, b) => a.date.localeCompare(b.date))) {
      const c = h.counts ?? {};
      console.log(`  ${h.date.slice(0, 10)}  ${String(c.indexed ?? '—').padStart(6)} ${String(c.content ?? '—').padStart(8)} ${String(c.doc_count ?? c.downloaded ?? '—').padStart(10)} ${String(c.redirected ?? '—').padStart(9)} ${String(c.error ?? '—').padStart(6)}  ${'█'.repeat(Math.round(((c.indexed ?? 0) / max) * 25))}`);
    }
  }

  // ── uložit snapshot ───────────────────────────────────────────────────────
  if (!DRY) {
    const h = existsSync(HIST) ? JSON.parse(readFileSync(HIST, 'utf8')) : [];
    h.push({
      date: new Date().toISOString().slice(0, 10), release: db?.release,
      counts: Object.fromEntries(Object.entries(docs).map(([k, v]) => [k, v?.count ?? null])),
      indexByType: Object.fromEntries(pocetDleTypu(docs.index?.urls ?? [])),
    });
    writeFileSync(HIST, JSON.stringify(h, null, 1));
    console.log(`\nUloženo do ${HIST} (${h.length} snapshotů).`);
  }
};

main().catch((e) => { console.error('❌', cisti(e.message)); process.exit(1); });
