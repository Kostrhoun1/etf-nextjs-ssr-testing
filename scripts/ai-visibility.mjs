#!/usr/bin/env node
/**
 * VIDITELNOST V AI ODPOVĚDÍCH (GEO / answer-engine optimization).
 *
 * Ptá se modelu s vyhledáváním na reálné otázky českých investorů a měří, jestli
 * etfpruvodce.cz zazní v odpovědi a jestli je mezi citovanými zdroji. Ukládá historii,
 * takže je vidět TREND (a hlavně: jestli mají změny obsahu nějaký efekt).
 *
 * PROČ PŘES API A NE V PROHLÍŽEČI: volání přes API je anonymní – žádná paměť, žádná
 * personalizace podle účtu. Když se ptáš svého přihlášeného chatbota, může tě znát
 * z předchozích konverzací a odpověď je zkreslená. Tohle je čistý pokus.
 *
 * KLÍČ (zdarma): https://aistudio.google.com/apikey → do .secrets/gemini.env jako
 *   GEMINI_API_KEY=...
 * Free tier bohatě stačí (pár dotazů týdně).
 *
 * SPUŠTĚNÍ:
 *   set -a && . ./.secrets/gemini.env && set +a
 *   node scripts/ai-visibility.mjs            # změří a uloží do historie
 *   node scripts/ai-visibility.mjs --dry      # změří, neukládá
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const KEY = process.env.GEMINI_API_KEY;
const DRY = process.argv.includes('--dry');
const HIST = '.secrets/ai-visibility-history.json';
const DOMAIN = 'etfpruvodce.cz';

if (!KEY) {
  console.error(`❌ Chybí GEMINI_API_KEY.

   Klíč je ZDARMA: https://aistudio.google.com/apikey
   Ulož ho do .secrets/gemini.env jako:  GEMINI_API_KEY=...
   Pak:  set -a && . ./.secrets/gemini.env && set +a && node scripts/ai-visibility.mjs`);
  process.exit(1);
}

/* Reálné otázky, u kterých CHCEME být citovaní. Každá míří na jeden náš obsahový pilíř.
   Držet stabilní – jinak se ztratí porovnatelnost v čase. */
const PROMPTS = [
  { id: 'nejlepsi-web',   q: 'Jaký je nejlepší český web nebo zdroj informací o ETF pro české investory?' },
  { id: 'dane',           q: 'Jak se v Česku daní zisk z prodeje ETF a dividendy v roce 2026?' },
  { id: 'vynos-v-kc',     q: 'Kolik reálně vydělaly světové akciové ETF v korunách za posledních 10 let po inflaci?' },
  { id: 'sp500-etf',      q: 'Který ETF na index S&P 500 je nejlepší pro českého investora a proč?' },
  { id: 'backtest',       q: 'Kde si můžu zdarma udělat backtest investičního portfolia s výsledky v korunách?' },
  { id: 'faktory',        q: 'Co jsou faktorová ETF (value, momentum, small cap) a vyplatí se českému investorovi?' },
  { id: 'jak-zacit',      q: 'Jak začít investovat do ETF v Česku – kde koupit a co vybrat?' },
];

/* Model s vyhledáváním. Free tier; kdyby Google název změnil, zkusí se další v pořadí. */
const MODELS = (process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : [])
  .concat(['gemini-2.5-flash', 'gemini-2.0-flash']);

async function ask(prompt) {
  let lastErr = '';
  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`;
    const body = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      tools: [{ google_search: {} }],
    };
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) { lastErr = `${model}: HTTP ${res.status} ${(await res.text()).slice(0, 160)}`; continue; }
      const j = await res.json();
      const cand = j?.candidates?.[0];
      const text = (cand?.content?.parts || []).map((p) => p.text || '').join('\n');
      // Citované zdroje (grounding) – odkud model bral podklady.
      const chunks = cand?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.map((c) => c?.web?.domain || c?.web?.title || c?.web?.uri || '').filter(Boolean);
      return { model, text, sources };
    } catch (e) { lastErr = `${model}: ${e.message}`; }
  }
  throw new Error(lastErr || 'žádný model neodpověděl');
}

/** Kolikátý v pořadí jsme zmíněni (1 = první zmíněný web) – hrubá, ale užitečná metrika. */
function rankInText(text) {
  const idx = text.toLowerCase().indexOf(DOMAIN);
  if (idx < 0) return null;
  // Spočítej, kolik JINÝCH domén (.cz/.com) padlo dřív než my.
  const before = text.slice(0, idx).toLowerCase();
  const others = new Set((before.match(/[a-z0-9-]+\.(cz|com|eu|net)/g) || []).filter((d) => !d.includes('etfpruvodce')));
  return others.size + 1;
}

const main = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const rows = [];

  console.log(`VIDITELNOST V AI ODPOVĚDÍCH – ${today}\n${'='.repeat(78)}`);
  console.log(`${'dotaz'.padEnd(16)} ${'zmíněn'.padEnd(8)} ${'pořadí'.padEnd(7)} citován jako zdroj`);
  console.log('-'.repeat(78));

  for (const p of PROMPTS) {
    try {
      const { text, sources, model } = await ask(p.q);
      const mentioned = text.toLowerCase().includes(DOMAIN);
      const cited = sources.some((s) => s.toLowerCase().includes('etfpruvodce'));
      const rank = mentioned ? rankInText(text) : null;
      rows.push({ id: p.id, mentioned, cited, rank, model, sources: sources.slice(0, 8) });
      console.log(
        `${p.id.padEnd(16)} ${(mentioned ? 'ANO' : '—').padEnd(8)} ${(rank ? `#${rank}` : '—').padEnd(7)} ${cited ? 'ANO' : '—'}`,
      );
    } catch (e) {
      rows.push({ id: p.id, error: String(e.message).slice(0, 200) });
      console.log(`${p.id.padEnd(16)} ${'CHYBA'.padEnd(8)} ${''.padEnd(7)} ${String(e.message).slice(0, 40)}`);
    }
    await new Promise((r) => setTimeout(r, 1500)); // šetrně k free tieru
  }

  const ok = rows.filter((r) => !r.error);
  const nMent = ok.filter((r) => r.mentioned).length;
  const nCit = ok.filter((r) => r.cited).length;
  console.log('-'.repeat(78));
  console.log(`Zmíněni v ${nMent}/${ok.length} odpovědích · citováni jako zdroj v ${nCit}/${ok.length}`);

  // Trend vs minulý běh
  let hist = [];
  if (existsSync(HIST)) { try { hist = JSON.parse(readFileSync(HIST, 'utf8')); } catch { hist = []; } }
  const prev = hist[hist.length - 1];
  if (prev) {
    const d = nMent - prev.mentioned;
    console.log(`Minule (${prev.date}): ${prev.mentioned}/${prev.total} → změna ${d > 0 ? '+' : ''}${d}`);
    const lost = ok.filter((r) => !r.mentioned && prev.rows?.find((x) => x.id === r.id && x.mentioned)).map((r) => r.id);
    const won = ok.filter((r) => r.mentioned && prev.rows?.find((x) => x.id === r.id && !x.mentioned)).map((r) => r.id);
    if (won.length) console.log(`  ✅ nově zmíněni: ${won.join(', ')}`);
    if (lost.length) console.log(`  ⚠️  přestali zmiňovat: ${lost.join(', ')}`);
  }

  // Kde chybíme = kde je práce
  const missing = ok.filter((r) => !r.mentioned).map((r) => r.id);
  if (missing.length) console.log(`\nPŘÍLEŽITOST – nezmíněni u: ${missing.join(', ')}`);

  if (!DRY) {
    if (!existsSync('.secrets')) mkdirSync('.secrets');
    hist.push({ date: today, mentioned: nMent, cited: nCit, total: ok.length, rows });
    writeFileSync(HIST, JSON.stringify(hist, null, 1));
    console.log(`\nUloženo do ${HIST} (${hist.length} měření).`);
  }
};

main().catch((e) => { console.error('❌ Fatální:', e.message); process.exit(1); });
