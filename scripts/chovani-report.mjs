#!/usr/bin/env node
/* Report chování návštěvníků z vlastního měření bez cookies (tabulka web_events, src/components/Mereni.tsx).
 *
 * SPUŠTĚNÍ:  node scripts/chovani-report.mjs [dny=7] [cesta=/]
 * Klíč: SUPABASE_KEY v prostředí nebo .secrets/supabase.env (tajný klíč – čtení obchází RLS; NIKDY nevypisovat).
 *
 * Co ukáže: zobrazení a zdroje, trychtýř sekcí zvolené stránky (kolik zobrazení dojde ke které sekci),
 * kliky podle sekcí, hledání (vč. dotazů bez výsledku), záložky, FAQ, scroll, aktivní čas.
 * Pozor na malá čísla: při desítkách návštěv denně jsou to směry, ne statistika.
 */
import { readFileSync, existsSync } from 'node:fs';

const DNI = Number(process.argv[2] || 7);
const CESTA = process.argv[3] || '/';
let KEY = process.env.SUPABASE_KEY;
if (!KEY && existsSync('.secrets/supabase.env')) KEY = readFileSync('.secrets/supabase.env', 'utf8').match(/^SUPABASE_KEY=(.+)$/m)?.[1]?.trim();
if (!KEY) { console.error('❌ Chybí SUPABASE_KEY'); process.exit(1); }
const URL_DB = 'https://nbhwnatadyubiuadfakx.supabase.co/rest/v1/web_events';

const od = new Date(Date.now() - DNI * 864e5).toISOString();
const vse = [];
for (let o = 0; ; o += 1000) {
  const r = await fetch(`${URL_DB}?select=created_at,pv,event,path,sekce,target,value,ref,device,meta&created_at=gte.${od}&order=id`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Range: `${o}-${o + 999}` },
  }).then((x) => x.json());
  if (!Array.isArray(r)) { console.error('❌ Čtení selhalo:', JSON.stringify(r).slice(0, 200)); process.exit(1); }
  vse.push(...r);
  if (r.length < 1000) break;
}

const pocitej = (xs, f) => { const m = new Map(); for (const x of xs) { const k = f(x); if (k == null) continue; m.set(k, (m.get(k) || 0) + 1); } return [...m.entries()].sort((a, b) => b[1] - a[1]); };
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)} %` : '—');
const tab = (rows, n = 10) => rows.slice(0, n).map(([k, v]) => `  ${String(v).padStart(5)}  ${k}`).join('\n') || '  (nic)';
const median = (xs) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

const zobr = vse.filter((e) => e.event === 'zobrazeni');
console.log(`# Chování návštěvníků – posledních ${DNI} dní (bez cookies; ${vse.length} událostí)\n`);
console.log(`Zobrazení stránek: ${zobr.length}\n\n## Nejčastější stránky\n${tab(pocitej(zobr, (e) => e.path))}`);
console.log(`\n## Zdroje (doména, odkud přišli)\n${tab(pocitej(zobr, (e) => e.ref || '(přímo / neznámý)'))}`);
console.log(`\n## Zařízení\n${tab(pocitej(zobr, (e) => e.device))}`);

// Detail zvolené stránky (výchozí homepage).
const pvStranky = new Set(zobr.filter((e) => e.path === CESTA).map((e) => e.pv));
const ev = vse.filter((e) => pvStranky.has(e.pv));
const n = pvStranky.size;
console.log(`\n# Stránka ${CESTA} – ${n} zobrazení`);
const sekce = pocitej(ev.filter((e) => e.event === 'sekce'), (e) => e.sekce);
console.log(`\n## Kolik zobrazení dojde ke které sekci\n${sekce.map(([k, v]) => `  ${pct(v, n).padStart(5)}  ${k} (${v})`).join('\n') || '  (nic)'}`);
const scroll = pocitej(ev.filter((e) => e.event === 'scroll'), (e) => e.value);
console.log(`\n## Hloubka scrollu\n${[25, 50, 75, 100].map((p) => `  ${pct((scroll.find(([k]) => Number(k) === p) || [0, 0])[1], n).padStart(5)}  ≥ ${p} %`).join('\n')}`);
const casy = [...pocitej(ev.filter((e) => e.event === 'cas'), (e) => e.pv)].map(([pv]) => Math.max(...ev.filter((e) => e.pv === pv && e.event === 'cas').map((e) => Number(e.value) || 0)));
console.log(`\n## Aktivní čas na stránce\n  medián ${median(casy) ?? '—'} s, pod 10 s: ${pct(casy.filter((c) => c < 10).length, casy.length)}`);
const pvSKlikem = new Set(ev.filter((e) => e.event === 'klik').map((e) => e.pv));
console.log(`\n## Prokliky\n  zobrazení s aspoň jedním klikem: ${pct(pvSKlikem.size, n)}`);
for (const [s] of pocitej(ev.filter((e) => e.event === 'klik'), (e) => e.sekce || '(mimo sekce)')) {
  console.log(`\n  ▸ ${s}\n${tab(pocitej(ev.filter((e) => e.event === 'klik' && (e.sekce || '(mimo sekce)') === s), (e) => e.target), 8)}`);
}
console.log(`\n## Záložky\n${tab(pocitej(ev.filter((e) => e.event === 'zalozka'), (e) => e.target))}`);
console.log(`\n## Otevřené otázky (FAQ)\n${tab(pocitej(ev.filter((e) => e.event === 'faq'), (e) => e.target))}`);

const hled = vse.filter((e) => e.event === 'hledani');
console.log(`\n# Hledání (celý web) – ${hled.length} dotazů`);
console.log(`\n## Nejčastější dotazy\n${tab(pocitej(hled, (e) => e.target), 15)}`);
console.log(`\n## Dotazy BEZ nalezeného fondu (kandidáti na slovník / obsah)\n${tab(pocitej(hled.filter((e) => Number(e.value) === 0), (e) => `${e.target}${e.meta?.kategorie ? ' (nabídnut žebříček/průvodce)' : ' ← SLEPÁ ULIČKA'}`), 15)}`);
console.log(`\n## Vybraný fond z našeptávače\n${tab(pocitej(vse.filter((e) => e.event === 'hledani_vyber'), (e) => `${e.target} ← „${e.meta?.dotaz ?? ''}“`), 10)}`);
