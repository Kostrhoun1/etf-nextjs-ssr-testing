# CUTOVER-READINESS PLÁN — redesign z `/design-preview` na ostré routy

**Cíl majitele:** 10× organická návštěvnost za 6 měsíců.
**Binding constraint:** veškerý nový obsah a redesign žije pod `/design-preview`, což je `noindex` staging. Dokud se nepřepne na indexovatelné ostré routy, Google nový obsah nevidí a návštěvnost neporoste.
**Datum analýzy:** 2026-07-04 · větev `vylepseni/kvalita-obsahu-seo`
**Repo:** `etf-nextjs-ssr` (Next.js App Router). Ostrá produkční doména dle interní paměti běží dnes na Astro verzi (`etf-astro`) — viz sekce Doména.

---

## 1. Executive summary

Redesign je hotový a obsahově silný (37+ kategorií, 6 recenzí brokerů, 5 portfolií, srovnávač, kalkulačky), ale **celý žije pod `/design-preview` s tvrdým `robots: { index: false, follow: false }`** na každé stránce. Google tedy z celého nového webu nevidí prakticky nic — scorecard ~1 indexovatelná stránka to potvrzuje. Cutover (přesun redesignu na ostré, indexovatelné URL) je proto **jediná páka, která odblokuje cíl 10×** — bez něj nezáleží na kvalitě obsahu, protože ho vyhledávač nezaindexuje.

Riziko cutoveru je **střední a řiditelné**: staré ostré routy (`/nejlepsi-etf/*`, `/srovnani-etf`, `/portfolio-strategie/*`, recenze brokerů, kalkulačky) už mají zavedenou indexaci a část SEO signálu — nesmí se ztratit. Nejde tedy o „zapnout index", ale o **řízenou náhradu**: přemapovat obsah pod design-preview na existující ostré URL (kde už parita existuje) a zbytek doplnit s 301 redirecty a čistými canonicaly. Většinu příprav (odstranění `/design-preview` prefixů z odkazů, canonical/robots) zvládne agent autonomně na větvi; **produkční přepnutí, doménu a deploy musí odklepnout majitel**.

---

## 2. Stav indexovatelnosti (co konkrétně brání indexaci)

### 2.1 Noindex je plošný na celém `/design-preview`
Každá stránka pod `src/app/design-preview/**` má explicitní blok:

```ts
robots: { index: false, follow: false }
```

Ověřeno na **všech** page.tsx souborech pod design-preview (statické i dynamické):
- Statické: `page.tsx` (homepage redesignu, ř. 22), `srovnani/page.tsx` (ř. 14), `kalkulacky/page.tsx` (ř. 18), `zebricky/page.tsx`, `srovnani-brokeru/page.tsx` (ř. 22), `kategorie/page.tsx` (ř. 22), `infografiky/page.tsx` (ř. 41), `broker/page.tsx` (ř. 28), `jak-zacit/page.tsx` (ř. 24), `backtest`, `fire-kalkulacka`, `hypotecni-kalkulacka`, `investicni-kalkulacka`, `monte-carlo`, `uverova-kalkulacka`, `cisty-plat`, `kurzovy-dopad`, `nouzova-rezerva`, `kalkulacka`, `srovnani/vwce-vs-cspx`, `srovnani/porovnani` atd.
- Dynamické: `nejlepsi-etf/[slug]/page.tsx` (ř. 34), `portfolio-strategie/[slug]/page.tsx` (ř. 38), `recenze/[broker]/page.tsx` (ř. 30), `srovnani/[pair]/page.tsx` (ř. 41/44/49), `etf/[isin]/page.tsx` (ř. 37).

> `design-preview/layout.tsx` sám noindex nenastavuje (jen přidává CompareTray) — noindex je řešen per-page v metadatech, ne v layoutu. To znamená, že **odstranění noindexu je nutné provést v každé stránce zvlášť** (nebo přesunem obsahu na ostré routy).

### 2.2 Canonicaly ukazují částečně mimo
- Část design-preview stránek už canonicalizuje na **ostré** URL (dobré pro cutover, špatné teď — ukazují na starý obsah):
  - `srovnani/page.tsx` → canonical `/srovnani-etf`
  - `infografiky/page.tsx` → `https://www.etfpruvodce.cz/infografiky`
  - `broker/page.tsx` → `https://www.etfpruvodce.cz/degiro-recenze`
  - `jak-zacit/page.tsx` → `/jak-zacit-investovat-do-etf`
  - `nejlepsi-etf/[slug]` → `/nejlepsi-etf/${slug}` (ř. 35)
  - `recenze/[broker]` → `reviewHref[b.id]`, který ale ukazuje zpět na `/design-preview/recenze/*` (viz `brokerReviewHref.ts`) — **nekonzistentní** s ostatními.
- Část canonicalizuje na **sebe** pod design-preview (`kalkulacky`, `srovnani-brokeru`, `zebricky`, `portfolio-strategie/[slug]`) — po cutoveru je nutné přepsat na ostré cesty.

### 2.3 Sitemap novy obsah neobsahuje
- **Neexistuje** `src/app/sitemap.ts` ani `robots.ts`-generovaná sitemap pro nový obsah. Sitemap je **statická** v `public/`:
  - `public/sitemap.xml` = index odkazující na `sitemap-static.xml` + `sitemap-etf.xml`
  - `public/sitemap-static.xml` (16 kB) — statické stránky
  - `public/sitemap-etf.xml` (812 kB) — detaily ETF
  - `grep design-preview` v sitemapě = **0 výskytů**. Nový obsah v sitemapě není vůbec.
- `src/app/robots.ts` (dynamické) povoluje `/` a blokuje jen `/_next/data/`, `/*?_rsc=*`, `/private/`, `/admin/`. **Nesmí se přidat blokace design-preview do robots.txt** — noindex je řešen meta tagem, ne robots.txt (jinak by Google noindex nikdy nepřečetl).

### 2.4 Middleware a redirecty (dnešní stav)
- `src/middleware.ts`: non-www→www 301 pro apex, `/etf/ticker/*`→`/etf/{isin}` 301, `/srovnani-etf?compare=`→statické srovnání 301, přepis `Vary` hlavičky. **Žádné pravidlo pro design-preview.**
- `next.config.ts` `redirects()`: `_rsc` strip, non-www→www, `2025→2026` slug fixy, `/tipy/*`→`/nejlepsi-etf/*`. **Žádné pravidlo pro cutover.**

### 2.5 Čísla
- Indexovatelných stránek redesignu dnes: **0** (vše noindex).
- Stránek pod design-preview s noindexem: **~32 page.tsx** (viz strom v sekci 3).
- Souborů s natvrdo zadrátovaným prefixem `/design-preview` v odkazech: **61 souborů** (`src/app/design-preview/**` + `src/components/design-preview/**`). To je hlavní mechanická práce cutoveru.

---

## 3. Mapování URL: stará (ostrá) → nová (design-preview) → cílová ostrá po cutoveru

Legenda parity:
- **PARITA** = ostrá routa i redesign existují a míří na totéž → cutover = nahradit obsah ostré routy redesignem, žádný redirect nepotřeba.
- **NOVÁ** = redesign přidává routu, kterou ostrá verze nemá → nový indexovatelný obsah, případně 301 z blízké staré URL.
- **CHYBÍ PARITA** = ostrá routa existuje, redesign ji (zatím) nemá 1:1 → při cutoveru NEMAZAT starou, nebo dodělat redesign.

| Stará ostrá URL | Redesign (dnes noindex) | Cílová ostrá URL po cutoveru | Parita | Poznámka |
|---|---|---|---|---|
| `/` (App Router `src/app/page.tsx`) | `/design-preview` | `/` | **PARITA** | Homepage. Redesign má bohatší obsah + FAQ schema. |
| `/co-jsou-etf` (Pages Router `src/pages/co-jsou-etf.tsx`) + `/co-jsou-etf/jak-zacit-investovat` | `/design-preview/pruvodce`, `/design-preview/jak-zacit` | `/co-jsou-etf` (pruvodce), `/jak-zacit-investovat-do-etf` (jak-zacit) | **NOVÁ/mix** | Pozor: `jak-zacit` canonicalizuje na `/jak-zacit-investovat-do-etf`, což **ostře neexistuje** → nutný nový route + případný 301 z `/co-jsou-etf/jak-zacit-investovat`. |
| `/nejlepsi-etf` (rozcestník) | `/design-preview/zebricky`, `/design-preview/kategorie` | `/nejlepsi-etf` (+ příp. `/zebricky`) | **PARITA/NOVÁ** | Redesign má dva pohledy (zebricky = data, kategorie = navigace). Cílově mapovat na `/nejlepsi-etf`. |
| `/nejlepsi-etf/{37 kategorií}` (americke, sp500, celosvetove, dividendove, technologicke, nejlevnejsi, …) | `/design-preview/nejlepsi-etf/[slug]` (řízeno `categoryConfigs` v `src/lib/etf-data.ts`) | `/nejlepsi-etf/{slug}` | **PARITA** | Kanonická shoda slugů. Canonical redesignu už míří na `/nejlepsi-etf/${slug}`. Nejčistší cutover — jen nahradit obsah. Ověřit, že `categoryConfigs` pokrývá všech 37 starých slugů (viz Rizika). |
| `/srovnani-etf` (screener/listing) | `/design-preview/srovnani` a `/design-preview/etf` (screener) | `/srovnani-etf` | **PARITA** | Redesign má srovnávač + screener. Canonical `srovnani/page.tsx` už = `/srovnani-etf`. |
| `/srovnani-etf/[comparison]` (napr. `cspx-vs-vuaa`, `POPULAR_COMPARISONS`) | `/design-preview/srovnani/[pair]` + `/design-preview/srovnani/vwce-vs-cspx` | `/srovnani-etf/{pair}` | **PARITA** | Formát `X-vs-Y` shodný. Sladit generateStaticParams (POPULAR_COMPARISONS vs redesign páry). |
| `/etf/[isin]` (detail fondu) | `/design-preview/etf/[isin]` | `/etf/{isin}` | **PARITA** | Detail fondu. Nejcitlivější na SEO (812 kB sitemap-etf.xml). |
| `/portfolio-strategie` (rozcestník) | `/design-preview/portfolio-strategie` | `/portfolio-strategie` | **PARITA** | |
| `/portfolio-strategie/{akciove,dividendove,nobel,permanentni,ray-dalio-all-weather}` | `/design-preview/portfolio-strategie/[slug]` (řízeno `portfolioModels`) | `/portfolio-strategie/{slug}` | **PARITA** | Slugy shodné (ověřeno v `portfolioData.ts`). Canonical redesignu ale míří na `/design-preview/...` → přepsat. |
| `/degiro-recenze` | `/design-preview/recenze/degiro` (+ `/design-preview/broker`) | `/degiro-recenze` | **PARITA** | `broker/page.tsx` canonical už = `/degiro-recenze`. |
| `/xtb-recenze` | `/design-preview/recenze/xtb` | `/xtb-recenze` | **PARITA** | |
| `/trading212-recenze` | `/design-preview/recenze/trading212` | `/trading212-recenze` | **PARITA** | |
| `/interactive-brokers-recenze` | `/design-preview/recenze/ibkr` | `/interactive-brokers-recenze` | **PARITA** | Pozor: id `ibkr` ≠ URL `interactive-brokers`. `reviewHref` musí mapovat na ostrou URL, ne na `/design-preview/recenze/ibkr`. |
| `/fio-ebroker-recenze` | `/design-preview/recenze/fio` | `/fio-ebroker-recenze` | **PARITA** | id `fio` ≠ URL `fio-ebroker`. |
| `/portu-recenze` | `/design-preview/recenze/portu` | `/portu-recenze` | **PARITA** | |
| `/srovnani-brokeru` | `/design-preview/srovnani-brokeru` | `/srovnani-brokeru` | **PARITA** | Canonical redesignu míří na `/design-preview/...` → přepsat. |
| `/kde-koupit-etf` | `/design-preview/kde-koupit` | `/kde-koupit-etf` | **NOVÁ** | Slug se liší (`kde-koupit` vs `kde-koupit-etf`) → sladit na ostrou URL. |
| `/kalkulacky` (rozcestník) | `/design-preview/kalkulacky` | `/kalkulacky` | **PARITA** | Canonical redesignu = `/design-preview/kalkulacky` → přepsat. |
| `/kalkulacky/investicni-kalkulacka` | `/design-preview/investicni-kalkulacka` | `/kalkulacky/investicni-kalkulacka` | **PARITA** | Redesign má tool na jiné úrovni (`/design-preview/investicni-kalkulacka`) než ostrá (`/kalkulacky/...`) → mapovat pod `/kalkulacky/`. |
| `/kalkulacky/fire-kalkulacka` | `/design-preview/fire-kalkulacka` | `/kalkulacky/fire-kalkulacka` | **PARITA** | dtto (rozdíl v úrovni cesty) |
| `/kalkulacky/hypotecni-kalkulacka` | `/design-preview/hypotecni-kalkulacka` | `/kalkulacky/hypotecni-kalkulacka` | **PARITA** | |
| `/kalkulacky/monte-carlo-simulator` | `/design-preview/monte-carlo` | `/kalkulacky/monte-carlo-simulator` | **NOVÁ** | slug se liší |
| `/kalkulacky/uverova-kalkulacka` | `/design-preview/uverova-kalkulacka` | `/kalkulacky/uverova-kalkulacka` | **PARITA** | |
| `/kalkulacky/nouzova-rezerva` | `/design-preview/nouzova-rezerva` | `/kalkulacky/nouzova-rezerva` | **PARITA** | |
| `/kalkulacky/kurzovy-dopad-etf` | `/design-preview/kurzovy-dopad` | `/kalkulacky/kurzovy-dopad-etf` | **NOVÁ** | slug se liší |
| `/kalkulacky/kalkulacka-poplatku-etf` | `/design-preview/kalkulacka` | `/kalkulacky/kalkulacka-poplatku-etf` | **NOVÁ** | slug se liší |
| `/kalkulacky/backtest-portfolia` | `/design-preview/backtest` (+ `/backtest-demo` noindex) | `/kalkulacky/backtest-portfolia` | **NOVÁ** | slug se liší |
| `/kalkulacky/cisty-plat-2026` | `/design-preview/cisty-plat` | `/kalkulacky/cisty-plat-2026` | **NOVÁ** | slug se liší (rok) |
| `/infografiky` + 3 podstránky | `/design-preview/infografiky` | `/infografiky` | **PARITA** | Canonical redesignu = `/infografiky`. |
| `/o-nas` | `/design-preview/o-nas` | `/o-nas` | **PARITA** | Trust/E-E-A-T stránka. |
| — (neexistuje ostře) | `/design-preview/prehled` | `/prehled` ? | **NOVÁ** | Rozhodnout, zda vůbec publikovat / kam mapovat. |
| `/co-jsou-etf-app-backup*` | — | (smazat/ignorovat) | — | Backup routa, do sitemapy nepatří. |

**Shrnutí parity:** naprostá většina (homepage, 37 kategorií, srovnání, ETF detaily, portfolia, 6 recenzí, srovnani-brokeru, infografiky, o-nas) je **PARITA** = ideální pro čistý cutover bez redirectů. Rozdíly jsou hlavně u **kalkulaček** (jiná úroveň cesty a několik odlišných slugů) a pár drobností (`kde-koupit` vs `kde-koupit-etf`, `pruvodce`/`jak-zacit`). Tam je potřeba buď sladit slug redesignu na ostrou URL, nebo přidat 301.

---

## 4. Cutover kroky v pořadí

Doporučená strategie: **přesun obsahu na ostré routy, ne odblokování `/design-preview`.** Tj. redesign se stane ostrým webem, `/design-preview` zanikne (nebo 301 na ostré). Důvod: staré ostré URL už mají SEO historii a jsou v sitemapě — chceme na nich *vyměnit obsah*, ne vytvořit duplicitu pod druhým URL.

### FÁZE A — Příprava (autonomně, agent/CEO, na větvi, BEZ produkčního dopadu)

Vše se dělá na `vylepseni/kvalita-obsahu-seo`, nic se nedeployuje na ostro.

1. **Rozhodnutí o mechanice přesunu (architektura).** Dvě varianty — vybrat před psaním kódu:
   - **A) Fyzický přesun složek**: obsah `src/app/design-preview/*` přesunout na ostré cesty (přemapovat kalkulačky pod `/kalkulacky/*`, srovnání pod `/srovnani-etf`, atd.). Nejčistší z pohledu SEO (jedno URL), ale nejvíc práce a kolize se stávajícími ostrými page.tsx.
   - **B) Ponechat kód pod design-preview, přidat rewrites**: v `next.config.ts` `rewrites()` namapovat ostré cesty → design-preview komponenty a odstranit noindex. Rychlejší, ale hrozí duplicitní přístupnost přes obě URL (nutné 301 z `/design-preview/*` na ostré). **Rewrite ≠ redirect**: rewrite drží URL, ale zdroj zůstává dosažitelný → přidat `redirect` z `/design-preview/*`.
   - *Doporučení: A pro čistotu, ale rozhoduje majitel podle apetitu k riziku a času.*

2. **Odstranit `robots: { index: false, follow: false }`** ze všech přesunutých/publikovaných stránek. Konkrétní soubory: viz sekce 2.1 (32 page.tsx). Kořenový `src/app/layout.tsx` už má `index: true` — po přesunu obsahu pod ostré routy budou dědit index automaticky, pokud se per-page noindex smaže.

3. **Přepsat interní odkazy** — odstranit prefix `/design-preview` z **61 souborů**. Nejrychleji hromadným nahrazením `/design-preview/` → `/` a poté ručně opravit místa, kde se ostrý slug liší (kalkulačky, kde-koupit, recenze brokerů). Klíčové soubory:
   - `src/app/design-preview/page.tsx` (homepage — CATEGORIES, TOOLS, FAQ href, nav, populární srovnání — vše natvrdo `/design-preview/*`).
   - `src/components/design-preview/brokerReviewHref.ts` — **přemapovat na ostré URL recenzí** (`degiro`→`/degiro-recenze`, `ibkr`→`/interactive-brokers-recenze`, `fio`→`/fio-ebroker-recenze`, `xtb`→`/xtb-recenze`, `trading212`→`/trading212-recenze`, `portu`→`/portu-recenze`).
   - Nav/menu komponenty: `HeaderSearch`, `MobileMenu`, `CompareTray`, `SrovnaniCompareUI`, `CategoryUI`, `BrokerScoreGrid` atd.

4. **Sladit canonicaly** na cílové ostré URL u stránek, které dnes canonicalizují na `/design-preview/*` nebo na sebe: `kalkulacky`, `srovnani-brokeru`, `zebricky`, `portfolio-strategie/[slug]`, `recenze/[broker]` (přes reviewHref). Ověřit, že `nejlepsi-etf/[slug]`, `srovnani`, `infografiky`, `broker`, `jak-zacit` už míří správně (míří).

5. **Ošetřit slug rozdíly** (kde-koupit vs kde-koupit-etf; monte-carlo vs monte-carlo-simulator; kalkulacka vs kalkulacka-poplatku-etf; kurzovy-dopad vs kurzovy-dopad-etf; backtest vs backtest-portfolia; cisty-plat vs cisty-plat-2026; pruvodce/jak-zacit vs co-jsou-etf/jak-zacit-investovat-do-etf). Buď přejmenovat cílovou routu na ostrý slug, nebo přidat 301 (viz Fáze B).

6. **Připravit sitemapu.** Buď zavést `src/app/sitemap.ts` generovanou z `categoryConfigs` + `portfolioModels` + `brokers` + statického seznamu (preferováno, drží se v kódu), nebo aktualizovat `public/sitemap-static.xml`. Musí obsahovat **jen ostré URL**, nikdy `/design-preview/*`. `sitemap-etf.xml` (ETF detaily) zůstává.

7. **Kontrola interních odkazů po přepisu:** `grep -rn "/design-preview" src/` musí po Fázi A vracet **0** (kromě případných definic redirectů). To je akceptační brána Fáze A.

8. **Build ověření lokálně** (majitel/agent, mimo běžící dev — viz paměť „Next build korumpuje dev"): `next build` musí projít, žádná stránka určená k indexaci nesmí mít noindex, canonicaly ostré.

### FÁZE B — Produkční přepnutí (MUSÍ rozhodnout/provést MAJITEL)

Tyto kroky mění produkci a/nebo doménu. Agent je připraví jako kód/PR, ale spuštění a doména jsou na majiteli.

9. **ROZHODNUTÍ O DOMÉNĚ (blokující).** Dle paměti ostrá produkce dnes běží na **Astro** verzi (`etf-astro`), zatímco tento redesign je **Next.js** (`etf-nextjs-ssr`). Majitel musí rozhodnout:
   - **Přesměrovat doménu `www.etfpruvodce.cz` na Next.js deployment** (Vercel), tj. Next repo se stane ostrým webem. → Pak platí celé mapování výše.
   - Nebo portovat redesign zpět do Astro (mimo rozsah tohoto repa, výrazně víc práce).
   - *Bez tohoto rozhodnutí je cutover zablokovaný — je to hlavní gate.*

10. **301 redirecty** (do `next.config.ts` `redirects()`), pokud se zvolí varianta se slug rozdíly nebo varianta B (rewrites):
    - `/design-preview` a `/design-preview/:path*` → odpovídající ostrá URL (permanent 301), aby indexované/olinkované preview URL nepadaly do 404 a nevznikala duplicita.
    - Slug fixy: `/kde-koupit` → `/kde-koupit-etf`, `/co-jsou-etf/jak-zacit-investovat` → `/jak-zacit-investovat-do-etf` (pokud se zavede), případně staré kalkulačkové slugy.
    - Ověřit, že nové redirecty nekolidují s existujícími (`2025→2026`, `/tipy/*`).

11. **Deploy na ostro** (Vercel) — majitel. Nasadit větev do produkce. Sledovat build log.

12. **Google Search Console** — majitel:
    - Odeslat aktualizovanou sitemapu.
    - „Request indexing" pro klíčové ostré URL (homepage, top kategorie).
    - Sledovat Coverage report (noindex → indexed), Core Web Vitals.

13. **Post-deploy verifikace** (agent může asistovat čtením, přepnutí dělá majitel):
    - `curl` hlaviček klíčových ostrých URL: žádný `X-Robots-Tag: noindex`, meta robots = index.
    - `/design-preview/*` vrací 301 na ostré (pokud varianta B) nebo 404/410 (pokud A a smazáno).
    - Náhodná kontrola 10 URL z mapování na 200 + správný canonical.

---

## 5. Rizika a rollback

| Riziko | Dopad | Mitigace / Rollback |
|---|---|---|
| **`categoryConfigs` nepokrývá všech 37 starých slugů** (redesign má „38 kategorií", stará verze 37) | Stará indexovaná kategorie skončí v 404 → ztráta rankingu | Před cutoverem diffnout `Object.keys(categoryConfigs)` proti seznamu starých `/nejlepsi-etf/*` v sekci 3. Chybějící buď dodělat, nebo 301 na nejbližší. |
| **Duplicita obsahu** (redesign dostupný přes `/design-preview/*` i ostré URL současně) | Google vidí 2 kopie → kanibalizace, oslabení | Varianta A (smazat design-preview) nebo tvrdé 301 z `/design-preview/*`. Nikdy nenechat obě URL indexovatelné. |
| **Ztráta SEO signálu na ETF detailech** (`/etf/[isin]`, 812 kB sitemap) | Největší objem URL | Zachovat identické URL (`/etf/{isin}` je PARITA), jen vyměnit obsah. Nemazat sitemap-etf.xml. |
| **Rozbité canonicaly** (redesign canonicalizuje na `/design-preview/*`) | Google pošle signál na noindex URL → deindexace | Fáze A krok 4 — sladit VŠECHNY canonicaly na ostré, akceptační grep. |
| **`brokerReviewHref.ts` míří na `/design-preview/recenze/*`** | Odkazy na recenze vedou na noindex/404 | Přemapovat na ostré recenzní URL (krok 3). |
| **Build za běhu dev serveru rozbije client JS** (viz paměť) | Falešný dojem bugu | Build vždy s vypnutým dev serverem; ověřit v čistém prostředí. |
| **Doména zůstane na Astro** | Cutover kódu bez efektu — Google dál vidí Astro | Gate v kroku 9 — bez rozhodnutí o doméně necutovat. |
| **Middleware/redirect kolize** (`_rsc`, non-www, 2025→2026 vs nové 301) | Redirect smyčky / 308 chains | Otestovat `curl -I` řetězce před deployem; nové redirecty přidat až za existující. |

**Rollback:** protože jde o Next.js na Vercelu, nejrychlejší rollback = **Vercel instant rollback na předchozí deployment** (majitel, 1 klik). Doménový rollback (přepnout DNS/alias zpět na Astro) je pomalejší (TTL) — proto doménu měnit až po ověření Next deploymentu na preview URL. Kódový rollback = revert PR na větvi.

---

## 6. Doporučení

### Nejbezpečnější cesta: postupný cutover po vlnách (ne big-bang)
Vzhledem k tomu, že většina rout je **PARITA**, jde cutover rozfázovat podle rizika a rychle měřit dopad:

1. **Vlna 1 (nízké riziko, vysoký objem obsahu):** kategorie `/nejlepsi-etf/*` (37 URL, čistá parita, canonical už sedí) + homepage `/`. Největší SEO plocha, nejmenší riziko.
2. **Vlna 2:** srovnání (`/srovnani-etf`, `/srovnani-etf/[comparison]`), portfolia, ETF detaily.
3. **Vlna 3:** recenze brokerů, srovnani-brokeru, kalkulačky (tady jsou slug rozdíly — nejvíc ruční práce), infografiky, o-nas, pruvodce.

Mezi vlnami sledovat GSC Coverage — pokud vlna 1 začne indexovat a růst, potvrzuje to hypotézu „indexace je o obsahu" (paměť) a de-riskuje zbytek. Pokud by big-bang byl preferován kvůli rychlosti, je technicky možný (vše je parita), ale ztrácí se možnost izolovat problém.

### Co udělat HNED, bez rizika (dnes, na větvi, žádný produkční dopad)
1. **Diff `categoryConfigs` vs 37 starých kategorií** — potvrdit 100% pokrytí slugů (odblokuje Vlnu 1). Toto je nejlevnější a nejdůležitější kontrola.
2. **Grep audit `/design-preview` odkazů** (61 souborů) a příprava hromadného přepisu + seznam výjimek se slug rozdíly.
3. **Přepsat `brokerReviewHref.ts`** na ostré URL (izolovaná, bezpečná změna).
4. **Sepsat `src/app/sitemap.ts`** generovanou z konfigurací (kód, nenasazovat).
5. **Připravit blok 301 redirectů** `/design-preview/:path*` → ostré do `next.config.ts` (zakomentovaný, ready).

Žádný z těchto kroků nemění produkci ani doménu — připraví PR do stavu „majitel řekne jeď".

---

## 7. Co přesně potřebuje majitel rozhodnout (gate na 10×)

1. **Doména:** přepnout `www.etfpruvodce.cz` z Astro na tento Next.js deployment (Vercel)? — **hlavní blokující rozhodnutí.**
2. **Mechanika:** fyzický přesun složek (varianta A, čistší SEO) vs rewrites + 301 (varianta B, rychlejší)?
3. **Rychlost:** postupný cutover po vlnách (bezpečnější, měřitelný) vs big-bang (rychlejší)?
4. **Odklep akceptace:** po přípravě (Fáze A) potvrdit „jeď" na produkční deploy + odeslání sitemapy do GSC.

Jakmile padnou tato 4 rozhodnutí (hlavně doména), je cíl 10× technicky odblokovaný a exekuce může jet.
