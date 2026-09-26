#!/usr/bin/env node
/**
 * INDEXNOW – okamžitě ohlásí vyhledávačům, že se stránky změnily.
 *
 * PROČ: Google tuhle doménu dlouhodobě nepouští výš (28 dní do 26. 9. 2026: impresi dostaly
 * jen 2 URL, rok proti roku beze změny). Reálné vyhledávání webu nese BING – 211 návštěv
 * z 57 různých stránek proti 22 z 5 u Googlu – a na Bingu stojí i Copilot. IndexNow je
 * protokol, kterým Bingu, Seznamu, Yandexu a dalším řekneme o změně hned, místo aby
 * čekaly na další průchod. Google IndexNow NEPODPORUJE – ten tím neovlivníme.
 *
 * KDY SE SPOUŠTÍ: po každém úspěšném PRODUKČNÍM nasazení (.github/workflows/indexnow.yml).
 * Záměrně NE denně: detaily fondů mají ISR revalidate 30 dní, takže se jejich vykreslený
 * obsah mění nanejvýš jednou měsíčně. Denní hlášení by posílalo Bing na nezměněné stránky
 * a učilo ho naše hlášení ignorovat.
 *
 * KLÍČ: public/<klíč>.txt. Není tajný – IndexNow ho ZÁMĚRNĚ čte z webu, tím doménu ověřuje.
 * Proto žije v repu, ne v .secrets/.
 *
 * SPUŠTĚNÍ:
 *   node scripts/indexnow.mjs            # ohlásí všechny URL ze živé sitemapy
 *   node scripts/indexnow.mjs --dry      # jen vypíše, co by ohlásil
 */

import { readdirSync, readFileSync } from 'node:fs';

const HOST = 'etfpruvodce.cz';
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINT = 'https://api.indexnow.org/indexnow'; // sdílený – přepošle Bingu, Seznamu, Yandexu…
const DRY = process.argv.includes('--dry');
const DAVKA = 10000; // strop protokolu na jeden požadavek

// Klíč = jediný 32znakový hex soubor v public/. Když jich je víc nebo žádný, je to chyba
// konfigurace a má to spadnout nahlas, ne ohlásit s náhodným klíčem.
const kandidati = readdirSync('public').filter((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (kandidati.length !== 1) {
  console.error(`❌ V public/ má být právě jeden klíčový soubor <32 hex>.txt, nalezeno: ${kandidati.length}`);
  process.exit(1);
}
const KEY = kandidati[0].replace('.txt', '');
if (readFileSync(`public/${kandidati[0]}`, 'utf8').trim() !== KEY) {
  console.error('❌ Obsah klíčového souboru neodpovídá jeho názvu – IndexNow by ověření odmítl.');
  process.exit(1);
}

const main = async () => {
  const res = await fetch(SITEMAP, { headers: { 'User-Agent': 'etfpruvodce-indexnow' } });
  if (!res.ok) throw new Error(`sitemap HTTP ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

  // Pojistka: IndexNow odmítne (422) celou dávku, když v ní je cizí host.
  const cizi = urls.filter((u) => new URL(u).hostname !== HOST);
  if (cizi.length) throw new Error(`sitemap obsahuje ${cizi.length} URL mimo ${HOST}, např. ${cizi[0]}`);

  console.log(`INDEXNOW – ${urls.length} URL ze sitemapy, klíč ${KEY.slice(0, 6)}…`);
  if (DRY) {
    urls.slice(0, 5).forEach((u) => console.log(`  ${u}`));
    console.log(`  … (režim --dry, nic neodesláno)`);
    return;
  }

  for (let i = 0; i < urls.length; i += DAVKA) {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `https://${HOST}/${KEY}.txt`,
        urlList: urls.slice(i, i + DAVKA),
      }),
    });
    // 200 = přijato, 202 = přijato, klíč se ověřuje (běžné u prvního hlášení).
    // 403 = klíč na webu nenalezen, 422 = URL nepatří hostu, 429 = příliš často.
    const vyznam = { 200: 'přijato', 202: 'přijato, ověřuje se klíč', 400: 'špatný požadavek',
      403: 'klíč na webu nenalezen', 422: 'URL nepatří hostu', 429: 'příliš mnoho požadavků' }[r.status] ?? '?';
    const ok = r.status === 200 || r.status === 202;
    console.log(`  ${ok ? '✅' : '❌'} dávka ${i / DAVKA + 1}: HTTP ${r.status} (${vyznam})`);
    if (!ok) { console.error(`     ${(await r.text()).slice(0, 200)}`); process.exit(1); }
  }
};

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
