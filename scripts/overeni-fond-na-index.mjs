#!/usr/bin/env node
/**
 * OVĚŘENÍ přiřazení fond → index pro backtest (src/lib/backtest/fondNaIndex.ts).
 * Projde všechny fondy v DB, vypíše počty po indexech a vzorky + podezřelé případy, které je
 * potřeba projít okem (pravidlo č. 1: raději žádné přiřazení než špatné).
 * SPUŠTĚNÍ: SUPABASE_KEY=<publishable> node --experimental-strip-types scripts/overeni-fond-na-index.mjs
 */
import { prirazeniFondu } from '../src/lib/backtest/fondNaIndex.ts';
const KEY = process.env.SUPABASE_KEY;
const URL_DB = 'https://nbhwnatadyubiuadfakx.supabase.co/rest/v1/etf_funds';
const fondy = [];
for (let od = 0; ; od += 1000) {
  const r = await fetch(`${URL_DB}?select=isin,primary_ticker,name,index_name,is_leveraged,currency_risk,ter_numeric,category&order=isin`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Range: `${od}-${od + 999}` } }).then((x) => x.json());
  fondy.push(...r); if (r.length < 1000) break;
}
const po = {};
for (const f of fondy) { const p = prirazeniFondu(f); if (!p) continue; (po[p.indexCode] ??= []).push({ ...f, shoda: p.shoda }); }
console.log(`fondů ${fondy.length}, přiřazeno ${Object.values(po).flat().length}`);
for (const [k, xs] of Object.entries(po).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n## ${k} – ${xs.length} (${xs.filter((x) => x.shoda === 'stejny').length} stejný index)`);
  for (const x of xs) console.log(`   ${x.shoda === 'stejny' ? '=' : '≈'} ${x.isin} ${String(x.primary_ticker || '').padEnd(6)} ${x.name}  [${x.index_name || ''}] ${x.category || ''}`);
}
