#!/usr/bin/env node
/* SEO scorecard – leading indikátory návštěvnosti, které CEO měří i BEZ napojení
 * na Search Console. Předstihové ukazatele budoucí organiky (cíl 10×).
 *
 * SPUŠTĚNÍ:  node scripts/seo-scorecard.mjs
 */

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const sh = (cmd) => { try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return ''; } };
const count = (cmd) => { const o = sh(cmd); return o ? parseInt(o, 10) || 0 : 0; };

const pages = count("find src/app/design-preview -name page.tsx | wc -l");
const cats = existsSync('src/components/design-preview/categoryContent.ts')
  ? (readFileSync('src/components/design-preview/categoryContent.ts', 'utf8').match(/"introTitle":/g) || []).length : 0;
const configs = count("grep -cE \"^\\s*'[a-z0-9-]+':\\s*\\{\" src/lib/etf-data.ts");
const pairs = existsSync('src/components/design-preview/pairContent.ts')
  ? (readFileSync('src/components/design-preview/pairContent.ts', 'utf8').match(/^\s{2}"[a-z0-9-]+-vs-[a-z0-9-]+":/gm) || []).length : 0;
const jsonld = count("grep -rl 'application/ld+json' src/app/design-preview | wc -l");
const faqSchema = count("grep -rl 'FAQPage' src/app/design-preview | wc -l");
// indexovatelnost: kolik design-preview stránek NENÍ noindex
const noindexFiles = count("grep -rl 'index: false' src/app/design-preview | wc -l");
const indexable = Math.max(0, pages - noindexFiles);
const thinCats = Math.max(0, configs - cats);

const line = (label, val, note = '') => console.log(`   ${String(val).padStart(5)}  ${label}${note ? '  — ' + note : ''}`);

console.log('\n📈 SEO scorecard (leading indikátory) — cíl 10× organiky\n');
line('stránek v redesignu (/design-preview)', pages);
line('kategorií s redakčním obsahem', cats, `z ${configs} žebříčků`);
line('tenkých kategorií (bez obsahu)', thinCats, thinCats === 0 ? 'OK – žádná díra' : 'DOPLNIT/noindex');
line('kurátorských „X vs Y" soubojů', pairs);
line('stránek s JSON-LD', jsonld);
line('stránek s FAQPage schématem', faqSchema);
console.log('');
line('INDEXOVATELNÝCH stránek redesignu', indexable, indexable === 0 ? '⚠️ VŠE noindex (staging) – nic z toho Google nevidí, dokud nebude ostrá routa' : '');
console.log('\n   🎯 Poznámka CEO: obsah je předpoklad, ale skutečná návštěvnost přijde až');
console.log('      po nasazení na indexovatelnou ostrou routu (cutover z /design-preview).');
console.log('      To je jediný krok, který potřebuje souhlas majitele (produkční změna).\n');
