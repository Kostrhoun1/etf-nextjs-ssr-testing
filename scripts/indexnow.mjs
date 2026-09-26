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

const spi = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Počkat, až je klíč na webu OPRAVDU vidět.
 * Workflow se spouští ve chvíli, kdy Vercel ohlásí nasazení jako „success" – ale nový soubor
 * se na hranu sítě dostává ještě několik minut. 26. 9. 2026 tak první hlášení dostalo 403
 * a klíč vracel 404 ještě ~5 minut po „success". Bez čekání by to padalo při každé změně
 * klíče a posílalo falešný e-mail o chybě.
 */
async function pockejNaKlic() {
  const url = `https://${HOST}/${KEY}.txt`;
  for (let i = 1; i <= 12; i++) {
    try {
      const r = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
      if (r.ok && (await r.text()).trim() === KEY) return;
    } catch { /* síť – zkusíme znovu */ }
    console.log(`  ⏳ klíč zatím na webu není (pokus ${i}/12), čekám 30 s…`);
    await spi(30_000);
  }
  throw new Error(`klíč ${url} se ani po 6 minutách neobjevil – nasazení ho nejspíš neobsahuje`);
}

const main = async () => {
  if (!DRY) await pockejNaKlic();
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

  // 200 = přijato, 202 = přijato, klíč se ověřuje. 400 = špatný požadavek, 422 = URL
  // nepatří hostu → skutečná chyba konfigurace, padá hned. 429, 5xx a 403 s kódem
  // SiteVerificationNotCompleted jsou PŘECHODNÉ (ověření nového klíče běží asynchronně,
  // viz 26. 9. 2026) → opakujeme s rostoucím odstupem, ať nechodí falešné e-maily o chybě.
  const vyznam = { 200: 'přijato', 202: 'přijato, ověřuje se klíč', 400: 'špatný požadavek',
    403: 'klíč neověřen', 422: 'URL nepatří hostu', 429: 'příliš mnoho požadavků' };
  for (let i = 0; i < urls.length; i += DAVKA) {
    const davka = i / DAVKA + 1;
    for (let pokus = 1; ; pokus++) {
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
      if (r.status === 200 || r.status === 202) {
        console.log(`  ✅ dávka ${davka}: HTTP ${r.status} (${vyznam[r.status]})`);
        break;
      }
      const telo = (await r.text()).slice(0, 200);
      const prechodna = r.status === 429 || r.status >= 500 ||
        (r.status === 403 && telo.includes('SiteVerificationNotCompleted'));
      if (!prechodna || pokus === 5) {
        console.error(`  ❌ dávka ${davka}: HTTP ${r.status} (${vyznam[r.status] ?? '?'})\n     ${telo}`);
        process.exit(1);
      }
      const cekat = 30 * 2 ** (pokus - 1); // 30, 60, 120, 240 s
      console.log(`  ⏳ dávka ${davka}: HTTP ${r.status} – přechodné, zkouším znovu za ${cekat} s (pokus ${pokus}/5)`);
      await spi(cekat * 1000);
    }
  }
};

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
