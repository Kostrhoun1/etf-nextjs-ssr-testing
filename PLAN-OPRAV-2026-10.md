# Plán oprav a růstu – říjen 2026

Zdroj: deep dive 17. 10. 2026 (technika, vyhledávače + distribuce, UX/UI, obsah z dat, FKI)
+ nezávislý audit čistoty dat (běží, výsledky se doplní do Vlny 2).
Realizuje Claude. Tento soubor je zároveň pracovní checklist – stav se odškrtává tady.

**Cíl:** víc návštěv (hlavně Seznam + Bing teď, Google až s důvěrou) a pravidelné vracení.
**Podmínka všeho:** data na webu musí být správná. Špatné číslo na datovém webu je horší
než žádné číslo.

---

## 0. Pravidla, podle kterých se postupuje

1. **Správnost dat má přednost.** Dokud neprojde Vlna 2 (data), nepřidává se nic, co data
   víc zviditelní (věta v Kč na detailu, stroj času, nové žebříčky). Jinak bychom chyby
   jen ukázali víc lidem.
2. **Čísla, která jdou ven (články, karty, hero), projdou 3 kroky:** nezávislý přepočet mimo
   engine → externí kotva (ČNB, ČSÚ, emitent, publikovaná studie) → kontrola smyslu
   (CAGR = (konec/začátek)^(1/roky) − 1; stejné CAGR v různých měnách = červená vlajka).
   Nikdy jen proti vlastnímu nástroji (incident s HN kartou).
3. **Jedna vlna = jeden produkční deploy.** Každý deploy maže ISR cache (vlna až ~5 000
   zápisů, limit free tieru 200 tis./měs.). Max. 1 produkční deploy denně, commity slučovat.
4. **Každá vlna má ověření:** build → lokální smoke test (dev server vypnout před buildem)
   → deploy → smoke test produkce (prohlížeč, mobil 375 px i desktop) → kontrola
   `client_errors` a denní kontroly dat druhý den.
5. **Tvrdé hranice:** žádná cookie lišta ani nástroje vyžadující souhlas; žádná témata úvěrů,
   hypoték a páky; žádná kritika bank; autor bez veřejné tváře; FB odkazy bez UTM.
6. **Měří se jen ČR bez botů** (Singapur scraper, „Kadan" z chatgpt.com).

---

## Vlna 1 – Bezpečnost a zjevné nesmysly  ·  ✅ NASAZENO 17. 10. 2026 (7664fc8), smoke test produkce prošel

| # | Úkol | Stav |
|---|---|---|
| 1.1 | `/api/revalidate`: pryč výchozí heslo, bez env → 401, porovnání v konstantním čase, max 200 ISINů a kontrola formátu | ✅ hotovo lokálně |
| 1.2 | Smazat 12 kořenových skriptů s legacy service_role klíčem | ✅ |
| 1.3 | `next` 15.5.7 → 15.5.28 (30 CVE), odebrat nepoužité `jspdf`, `xmldom` | ✅ |
| 1.4 | `simulate`: max 15 složek, prognóza 1–50 let, neznámý index → 400, české chybové hlášky | ✅ |
| 1.5 | Smazat 5 osiřelých backtest API (monte-carlo, correlation, rebalancing, indexes, search-etf) | ✅ |
| 1.6 | Middleware: neplatný ISIN (formát + kontrolní číslice) → statická 404 bez DB a bez ISR zápisu; `/srovnani/<pár>` jen `[a-z0-9]-vs-[a-z0-9]`; pojistka i v `parsePair` (filter injection do `.or()`) | ✅ (ověřeno: 5 146/5 146 ISINů a 11 320 tickerů z DB projde) |
| 1.7 | Graf propadů v backtestu = nejhlubší denní bod v měsíci (dřív −47 % vs. „Max. pokles" −52,8 %) | ✅ ověřeno: S&P 500 od 2002 tabulka −59,8 % = graf; 60/40 −18,2 % = graf (dřív −13 %) |
| 1.8 | Natvrdo zapsané počty: „4 300+" → skutečný počet; „5 strategií" → `portfolioModels.length` (7) | ✅ |
| 1.9 | Zdvojená značka v titulcích (14 míst, 66 stránek „… \| ETF průvodce \| ETF průvodce.cz") | ✅ |
| 1.10 | Odkaz na neexistující `/rss.xml` pryč; `/etf` 307 na jeden fond → 308 na `/srovnani` | ✅ |
| 1.10b | Česká stránka 404 (dřív výchozí anglická Next.js – i u všech dosavadních 404) | ✅ |
| 1.10c | Počet fondů v titulku homepage, na `/dip` a `/investovani-pro-deti` („4 800+" napevno) → zaokrouhleno dolů na stovky („5 100+") | ✅ |
| 1.11 | Smoke test: nesmyslný ISIN → 404 bez `x-vercel-cache: HIT`; revalidate bez hesla → 401; backtest S&P 500 – dno grafu = max. pokles | ✅ lokálně i produkce |
| 1.12 | Deploy s autorem `tomas.kostrhoun1@gmail.com` → GitHub ho přiřadil účtu Kostrhoun1, Vercel nasadil → repo lze přepnout na soukromé | ✅ |

**Vaše rozhodnutí k Vlně 1** (nic z toho neudělám sám – jde o přístupy a nastavení účtů):
- **Repo na soukromé** – až po bodě 1.12. Dřív bylo veřejné, protože Vercel Hobby neumí
  nasadit commit soukromého repa od autora, kterého nezná (commity byly z
  `@Tomas--MacBook-Air-3.local`). Opraveno nastavením gitu v obou repech.
- **`REVALIDATE_SECRET` na Vercelu** (jako Sensitive) + stejná hodnota jako secret v etf-astro.
  Scraper dnes posílá jiné heslo a revalidace mu už teď nefunguje – nic se tím nerozbije.
  Úpravu scraperu (čtení hesla z env) udělám já.
- **`SUPABASE_SERVICE_ROLE_KEY` z Vercelu odstranit** (ne vyměnit za `sb_secret_`). Web ho ke
  čtení nepotřebuje.
- **Zneplatnit starý JWT secret v Supabase** (přechod na JWT signing keys) – legacy klíč z
  veřejné historie gitu pak definitivně nic neotevře.
- **`/uverova-kalkulacka` a `/hypotecni-kalkulacka`** – porušují redakční hranici, jsou v
  sitemapě. Návrh: 410/přesměrování na `/kalkulacky` a vyřadit ze sitemapy.

---

## Vlna 2 – Správnost dat  ·  PRIORITA  ·  stav: scraper opraven a na main (51199ba, 9dbaf2d); web hotov na větvi `faze2`, nasazení 18. 10. po nočním scrapu

Cíl: každé číslo, kategorie a filtr na webu sedí. A když se data rozbijí, víme to do druhého
dne – ne náhodou za měsíc.

### 2A. Známé chyby v datech (opravy ve scraperu `etf-astro` a v DB)

| # | Problém | Rozsah | Oprava |
|---|---|---|---|
| 2.1 | Fondy bez názvu (scraper je zapisuje denně) | 12 | Scraper: nezapisovat řádek bez názvu; web: `notFound()` na detailu + vyřadit ze screeneru a sitemapy |
| 2.2 | Fondy, které už nejsou v nabídce (např. splatný iBonds Dec 2025), web je ukazuje jako aktuální | 78 | Sloupec/odvození „neobchoduje se" → vyřadit ze žebříčků, screeneru a sitemapy; detail 410 nebo noindex s vysvětlením |
| 2.3 | Fondy v nabídce, ale 90+ dní neaktualizované (hlavně CH…) | 236 | Zjistit, proč je scraper přeskakuje; web: u dat starších 30 dní ukázat datum a nedávat je do žebříčků podle výnosu |
| 2.4 | Krátkodobé dluhopisové fondy chybně `is_leveraged` (skryté ve srovnávači) | 13 | Oprava klasifikace ve scraperu + jednorázový update |
| 2.5 | Bez typu výplaty (`distribution_policy`) | 316 | Doplnit ze zdroje; kde chybí, odvodit z názvu (Acc/Dist) s kontrolou |
| 2.6 | Typ výplaty počítaný dvakrát (`distKind` v detailu i `ScreenerUI`), screener nedostává `distribution_frequency` → 106 fondů „distribuční" na detailu, „neznámé" ve srovnávači | 106 | Jedna funkce v `src/utils`, výsledek předpočítaný na serveru jako `_dist` |
| 2.7 | „O fondu" anglicky, protože `description_cs` obsahuje angličtinu | ? (audit) | Detekce jazyka; anglický text nezobrazovat jako český – dočasně skrýt, dlouhodobě přeložit |
| 2.8 | Nekonzistence Acc vs. Dist stejného fondu (Vanguard S&P 500: 5 let 86,79 % vs. 89,80 %) | ? (audit) | Ověřit u emitenta; pokud chyba scrapu, kontrola „sourozenecké třídy se liší o > 2 p. b." |
| 2.9 | Homepage panel „Nejvýkonnější (1R)": výnos v měně fondu (ne v Kč), vedou komoditní ETC (zemní plyn +194 %), na mobilu přetéká | 1 panel, všechny návštěvy homepage | `return_1y_czk`, jen akciové ETF, `min-w-0`; zvážit nahrazení panelem „Nejlevnější světové ETF" |
| 2.10 | Duplicitní žebříčky `nejlepsi-zlate-etf` vs `nejlepsi-zlato-etf` (+ nemovitostní) – obě v sitemapě s vlastním canonical | 2–4 stránky | 301 na jednu, vyřadit ze sitemapy |
| 2.11 | **ZAMRZLÁ DATA: ~640 fondů má výnosy/AUM/složení z dubna–července, web píše „aktualizováno dnes"** (VUAA YTD +5 % vs. skutečných +18,5 %; EUWAX Gold 1R +37,7 % vs. +3,7 %; zamrzlý fond vede „Nejvyšší výnos" ve 22 z 53 kategorií). Příčina: CI každou noc obnovil checkpointy ze zrušeného běhu 26. 4., scraper dávky přeskočil a nahrál dubnová data; upsert přepsal `updated_at`. Totéž: 41 nových fondů se do DB nikdy nedostalo, 170 fondů s rozbitým složením (součet zemí > 101 %) | 640 + 41 | ✅ scraper opraven (51199ba: checkpoint jen < 20 h a jen ISINy dávky), cache smazány – projeví se nočním během 18. 10.; ☐ web a monitoring měřit `scraping_date`, ne `updated_at`; ☐ zamrzlé (> 7 dní) nedávat do žebříčků výnosů a ukázat datum |
| 2.12 | **Roční výnosy po letech v Kč a USD o 2–4 p. b. vedle** (SXR8 2025: web +4,2 %, správně +0,1 %) – scraper bere kurz „před 365 dny → dnes" místo 31. 12. Y−1 → 31. 12. Y | všechny detaily | `etf-astro/scraper/performance_converter.py:58,72,94,104` |
| 2.13 | **3× pákový ETF doporučen „jako praktická volba pro dlouhodobé investory"**, žádné varování | 175 pákových | detail: varovný box + jiný text; `etf/[isin]/page.tsx:728` |
| 2.14 | **Pákové produkty vyhrávají „Nejvyšší výnos" v kategoriích** (ropa WTI 2x +272 %, banky 3x, Nasdaq 3x) | 3 kategorie, 17 fondů v 7 | `getTopETFsForCategory` bez filtru `is_leveraged` |
| 2.15 | **Kategorie obsahují cizí fondy** (prostá shoda podřetězce): japonské ← „ex Japan"; čínské ← „ex-China" (všech top 5); emerging ← „MSCI EMU"; americké ← „World ex USA"; tech ← „AI" v Taiwan/Sustainable/Daily; DAX ← MDAX/TecDAX; STOXX 600 ← sektory; nasdaq ← Biotech; MSCI World ← FTSE All-World/ACWI; cloud ← Quantum; bitcoin ← altcoiny | 13 kategorií | vylučovací pravidla v `etf-data.ts` + zlatá sada |
| 2.16 | **Filtr „nezajištěné" vyřadí 94 nezajištěných fondů** („Unhedged" obsahuje „hedged"); „Hdg" kód nezná (17 zajištěných vede jako nezajištěné) | 111 | `utils/hedgingDetection.ts:94` |
| 2.17 | **Krátkodobé výnosy (1M/3M/6M) popsané jako „USD", ale jsou v EUR** | ~3 180 detailů | `EtfReturns.tsx:104` |
| 2.18 | **Energetické akciové ETF zařazené jako komodity** (chybí v „energetické", jsou v „komoditních") | 29 | scraper `final_scraper.py:2479` – testovat equity první |
| 2.19 | Chybí index u 59 % fondů a ticker u 20 % – parser selže a prázdno přepíše starou hodnotu; FAQ pak píše „fond sledující index  s fyzická replikací", „Je — vhodný" | 3 017 / 1 049 | scraper: při neúspěchu nepřepisovat; web: nevypisovat věty s prázdnou hodnotou + skloňování |
| 2.20 | Index „S&P 500"/„MSCI World" přiřazen i sektorovým a faktorovým fondům (90 ze 186 / 138 z 256) | 228 | scraper záloha podle názvu |
| 2.21 | „ETF zdarma na DEGIRO" = jen 50 největších fondů (vč. Xetra-Gold); sloupec `degiro_free` se nepoužívá | 1 stránka | filtrovat podle `degiro_free`, nebo přejmenovat |
| 2.22 | Další duplicitní kategorie: celosvetove = globalni; obnovitelne-zdroje = clean-energy; realitni = nemovitostni | 3 páry | 301 |
| 2.23 | YTD „v Kč" u 172 fondů mladších 1 roku je ve skutečnosti EUR | 172 | scraper + web bez tichého fallbacku |

**Audit potvrdil jako správné:** přepočet 1R/3R/5R/YTD do Kč a USD (12 fondů vs. kurz ČNB, odchylka 0,1–0,3 p. b.); EUR výnosy, AUM a TER proti justETF; regiony; řazení a min. velikost v kategoriích; vlajkové fondy ve svých kategoriích; stejný čerstvý fond ukazuje stejné číslo napříč webem; srovnávač = všech 5 146 fondů.

### 2B. Pojistky, aby se chyby nevracely (automaticky, každý den)

- **Zlatá sada kategorií** – test, který nad živými daty ověří, že v kategorii JSOU fondy, které
  tam patří (VWCE, IWDA/SWDA, CSPX, VUAA, EUNL, SXR8, EIMI, zlaté ETC…) a NEJSOU tam
  pákové, short, peněžní trh v akciové kategorii, fondy mimo nabídku a fondy bez dat.
  Běží v denní kontrole dat; selhání = POPLACH (e-mail).
- **Rozšíření `scripts/check-fund-data.mjs`:** sourozenecké třídy (Acc/Dist, hedged/unhedged
  se stejným indexem) s rozdílem výnosu > 2 p. b.; výnos v Kč vs. výnos v měně fondu a kurz
  (nezávislý přepočet u vzorku); výnos za 5 let u fondu mladšího 5 let; datum založení v
  budoucnu; anglický `description_cs`.
- **Smoke test produkce** rozšířit: detail hlavy i ocasu (správný robots meta, titulek ≠ „ETF
  fond"), `/api/etf/screener` ≥ 5 000 řádků, investiční kalkulačka, sitemapa (počet URL),
  robots.txt, nesmyslný ISIN → 404, revalidate bez hesla → 401, `/api/etf/search?q=vwce`,
  www → apex 301, bezpečnostní hlavičky, `x-vercel-cache: HIT` na hlavních stránkách.
- **Na detailu fondu u každého čísla datum dat** („data k 16. 10. 2026") – čtenář vidí
  čerstvost a nám to odhalí zaseknuté fondy.

**Hotovo, když:** denní kontrola má 0 poplachů a varování jen s vysvětlením v
`ZAMERNA-ROZHODNUTI.md`; zlatá sada prochází; audit dat nemá otevřený nález s dopadem na
návštěvníka.

---

## Vlna 3 – Cesty k obsahu (návštěvnost)  ·  1 deploy

Diagnóza: lidé klikají jen tam, kam vede odkaz. Z detailu fondu (nejnavštěvovanější typ
stránky) vedlo za 90 dní 1 243 dalších zobrazení, **0 na články**. Na srovnání dvojic, které
vyhrávají na Seznamu, nevede sitemapa.

| # | Úkol | Kde | Měření (výchozí stav) |
|---|---|---|---|
| 3.1 | ✅ **Detail fondu: kontextové odkazy s větou a číslem pro daný fond.** Akumulační/distribuční → článek; měnové riziko (žlutý box) → `/menove-riziko-etf`; výkonnost v Kč → `/kolik-vydelaly-etf` a „Otestovat od roku 2005" → `/backtest?slozeni=<index>:100&run=1` (jen pokud fond spolehlivě mapuje na index) | `src/app/etf/[isin]/page.tsx` ř. ~484, 508, 641, 677+ | referrer `/etf/` → článek: 0 z 1 243 |
| 3.2 | ✅ **„Kam dál" podle kategorie fondu** (dnes natvrdo S&P 500 – zlatý fond radí „postavte proti VUAA") + 3–5 podobných fondů (stejný index/kategorie) + odkaz na existující dvojici | tamtéž ř. 687–718 | proklik detail → detail (83); Seznam „v indexu" 1 140 z 2 269 |
| 3.3 | ✅ **Srovnání dvojic do sitemapy** (POPULAR_PAIRS) + vlastní canonical; `vwce-vs-cspx` má canonical na adresu s 308 | `src/app/sitemap.ts`, `srovnani/vwce-vs-cspx/page.tsx` | Seznam+Bing na `/srovnani/*`: 26 / 90 dní |
| 3.4 | ✅ **Navigace:** přidat „Backtest" a „Co říkají data" (hub `/data`: kolik vydělaly ETF, DCA, měnové riziko, akum. vs. dist., ETF vs. akcie). Hlavičku vytáhnout do jedné sdílené komponenty (dnes je v každé `page.tsx` zvlášť) | `MobileMenu.tsx`, nová `SiteHeader` | prokliky na hub |
| 3.5 | ◐ (portfolia hotová: 0 výpočtů při načtení místo 2, dřív ~6 s CPU na zobrazení; `/backtest` zatím ne – výsledek má ~1 MB, chce zmenšit) **Backtest ukáže výsledek hned po otevření** – výchozí preset předpočítaný na serveru v ISR, API až po změně. Totéž pro `/portfolio-strategie/[slug]` (dnes 2× `simulate` ≈ 6 s CPU na každé zobrazení!) | `backtest/page.tsx`, `BacktestWidget.tsx`, `PortfolioBacktest.tsx`; mrtvý `heroExample.ts` použít nebo smazat | podíl návštěv backtestu s interakcí |
| 3.6 | ✅ **Nástroje → důkazy:** pod výsledkem jedna karta s tvrzením a číslem (pravidelný vklad → „Naráz, nebo postupně?"; USD index → měnové riziko; kalkulačka → „Proč 7 %? Skutečné výnosy v Kč") | `BacktestWidget.tsx`, `InvesticniKalkulackaWidget.tsx` | referrer `/backtest` → článek: 1 / 90 dní |
| 3.7 | ✅ `/akumulacni-vs-distribucni-etf` není slepá ulička; `/kategorie` (sirotek) nalinkovat nebo sloučit | články | – |
| 3.8 | ✅ Sitemapa: skutečný `lastmod` (dnes čas buildu u všech URL) | `sitemap.ts` | – |
| 3.9 | ✅ `llms.txt` aktualizovat (staré www URL, „2000+ fondů", „Best ETF 2025") | `public/llms.txt` | – |
| 3.10 | ⏸ odloženo (většina deployů mění sdílené části → stejně by se hlásilo vše; přínos neprokázaný) – IndexNow posílat jen změněné URL, ne celou sitemapu po každém deployi | `scripts/indexnow.mjs` | – |
| 3.11 | ✅ Canonical pro `/backtest` a kalkulačky (URL s parametry z FB, 301 z Buffetta) | stránky nástrojů | – |

| 3.12 | ✅ **Srovnání podle ISINu:** lidé píšou i „ie00b5bmr087 vs ie00bfmxxd54" (Google našeptává desítky kombinací). ISINy do popisu a na stránku dvojice; URL s ISINy → 301 na tickerovou | `[pair]/page.tsx`, `etf-data.ts` (getComparisonETFData) | – |
| 3.13 | ✅ **„Stejný fond, jiný ticker"** (CSPX vs SXR8, IWDA vs SWDA vs EUNL, VUAA vs VUAG) – častý dotaz, dnes 404/noindex. Místo toho stránka „jde o stejný fond (ISIN …), liší se burzou a měnou obchodování" + tabulka burz | `[pair]/page.tsx` | – |
| 3.14 | ✅ **POPULAR_PAIRS podle našeptávače** (17. 10. 2026): vwce-vs-cspx, cspx-vs-vuaa, vwce-vs-iwda, iwda-vs-cspx, vwce-vs-vwrl, vuaa-vs-vusa, sxr8-vs-vuaa, cspx-vs-spyl, eunl-vs-vwce, iwda-vs-vwra, cspx-vs-sxr8, iwda-vs-swda, vuaa-vs-vuag; u sourozeneckých tříd (Acc/Dist) věta „stejný index, liší se výplatou" + odkaz na akum. vs. dist. | `src/lib/pairs.ts` | – |

**Jak lidé srovnání hledají (našeptávač Google a Seznam, 17. 10. 2026):** fond proti fondu skoro výhradně TICKERY s „vs" (vwce vs cspx); časté je i ISIN vs ISIN a dotazy na tickery téhož fondu (iwda swda eunl). Česky s „nebo" hlavně na úrovni indexů a typů: „msci world nebo s&p 500", „nasdaq 100 nebo s&p 500", „etf akumulační nebo distribuční", „etf v eur nebo usd", „etf nebo podílové fondy", „dip nebo etf". Seznam srovnávací dotazy prakticky nenašeptává – lidé tam hledají název fondu a ISIN (→ detail fondu). Našeptávač ukazuje, co se píše často, ne objemy; Google mísí i zahraniční uživatele.

Podmínka pro 3.1 (věta v Kč) a 3.5: Vlna 2 hotová – jinak ukážeme víc lidem špatná čísla.

---

## Vlna 4 – Výkon a náklady  ·  1 deploy (lze spojit s Vlnou 3)

| # | Úkol | Dopad |
|---|---|---|
| 4.1 | ✅ (gzip 718 → 398 kB, −36 % na fond) **Payload srovnávače:** vyhodit `_blob` (484 KB, duplikuje název/ISIN/tickery) a `_tickers` (dopočítat v prohlížeči), výnosy na 1 desetinné místo → 4,3 MB → ~1,5 MB | `/srovnani` mobil: Perf 67, LCP 6,8 s |
| 4.2 | ✅ **Backtest:** data indexů a kurzů cachovat v paměti modulu (TTL ~6 h) – dnes 2,8–4,8 s a ~1 MB JSON na každý výpočet | CPU, rychlost nástroje |
| 4.3 | Grafy (recharts, 95 KB, 47–78 % nevyužito) načítat líně až u výsledku | kalkulačka TBT, backtest LCP |
| 4.4 | ⏸ na rozhodnutí majitele (náhledy větví používá; Vercel neumí „vše kromě main") Vypnout preview deploye pro ne-main větve (`git.deploymentEnabled`) | úložiště, méně zbytečných buildů |
| 4.5 | ✅ Middleware: přesměrování `/etf/ticker/VWCE` je rozbité (legacy klíč) → publishable klíč; nefunkční přepis `Vary` odstranit | `/etf/ticker/*` vrací 404 |
| 4.6 | ✅ Supabase URL a klíč na jednom místě (dnes 6 míst); jeden serverový klient s publishable klíčem | méně chyb při výměně klíčů |
| 4.7 | ✅ (178 souborů; ověřeno grafem importů a buildem) **Mrtvý kód:** 175 z 321 souborů v `src` (27 tis. řádků) je nedosažitelných – smazat najednou podle grafu importů | přehlednost, rychlejší build |
| 4.8 | ✅ (146 → 0; build zase hlídá typy) `tsc` 146 chyb → 0 v živých souborech, pak `ignoreBuildErrors: false` (ať build chytí skutečné bugy jako `distKind`) | prevence chyb |
| 4.9 | ✅ is_user_admin: EXECUTE odebráno (17. 10., nic ji nepoužívalo; anonymní volání teď 401). Zbývá na majiteli: upgrade Postgresu, Auth OTP/leaked passwords v dashboardu. Supabase advisor: `is_user_admin(email)` jde volat anonymně → odebrat EXECUTE pro anon; Postgres záplaty (vaše tlačítko v dashboardu) | bezpečnost |

**Nedělat:** přepis na Next 16 / Tailwind 4, ladění CSS a fontů kvůli Lighthouse body,
zkracování `revalidate`, předgenerování všech 5 146 detailů.

---

## Vlna 5 – Mobil a přístupnost  ·  1 deploy

Ověřuje se na 375 px před i po nasazení, screenshoty před/po.

| # | Úkol | Dnes |
|---|---|---|
| 5.1 | ◐ (mobil 9 331 → 6 957 px: 6 dlaždic místo 18, na mobilu 3 položky v panelech/portfoliích/brokerech, pryč duplicitní trust karty; zbývá patička 978 px – bod 5.8) **Homepage zkrátit na ~polovinu:** z 20 dlaždic nástrojů nechat 6 (backtest, investiční kalkulačka, srovnávač, portfolia, FIRE, Co říkají data), zbytek na `/kalkulacky`; 3× „Prozkoumat fondy" → 1×; tři trust bloky → jeden | 9 331 px ≈ 11,5 obrazovky |
| 5.2 | **Hero homepage na USP:** „Kolik by vám dnes vydělalo 5 000 Kč měsíčně od roku 2010? **X Kč**" + „Spočítat svůj případ" / „Najít fond". Číslo předpočítané v ISR stejným enginem a ověřené 3 kroky | „Největší srovnávač ETF" – žádná částka v Kč |
| 5.3 | ◐ (hero na mobilu 2 řádky + štítek data; hvězdičky = metodika → rozhodnutí majitele: 5★/4★ má 80 % fondů nad 1 mld €, velikost+správce = 35 bodů ze 100) **Srovnávač na mobilu:** hero na 2 řádky; ve výchozím pohledu bez komodit a peněžního trhu (dnes v top 25 zlato ETC a XEON); rychlé volby „Celý svět / S&P 500 / Dluhopisy"; hvězdičky skrýt nebo přeškálovat (5/5 skoro všem) | hero 380 px před filtry |
| 5.4 | ✅ (+ OPRAVENA CHYBA VÝPOČTU: 7 % p.a. úročilo 7,23 % – výsledek o 3 % nadsazený; ověřeno nezávisle 2 938 999 Kč) **Investiční kalkulačka:** pole jako v backtestu (`inputMode="numeric"`, mezery v tisících); výsledek v pruhu, který zůstane vidět při posouvání | `type="number"`, šipky 16 px, výsledek ~930 px dolů |
| 5.5 | ✅ (drobečky a „vše" ≥ 24 px; InfoTip 30 px vyhovuje) **Klikací plochy ≥ 44 px:** odkazy „vše" (36×16), drobečková navigace (16 px), InfoTip (30×30) | |
| 5.6 | ✅ (CSS: slate-400→500 a emerald-600→700 mimo tmavé plochy; 37 tlačítek teal-600→700) **Kontrast:** `text-slate-400` → 500/600 (447×, 2,6:1); `text-emerald-600` → 700 (83×, 3,8:1); hlavní tlačítko `bg-teal-600` → 700 (3,7:1) | |
| 5.7 | ✅ (skip link, aria-pressed, aria-live, popisky drobečků) **Čtečky obrazovky:** `aria-pressed` u presetů backtestu, `aria-live` u „Počítám…", odkaz „přeskočit na obsah" | |
| 5.8 | ✅ (patička na mobilu ve 2 sloupcích, odkazy Backtest + Co říkají data) Patička stránek: autor + „12 let praxe" + „Nezávislý" + disclaimer + patička (~1 000 px na mobilu) → jeden kompaktní blok | |
| 5.9 | Modelová portfolia: hlavní číslo 10 let p.a. v Kč + max. propad, ne roční výnos (nesoutěžit v krátkodobém výnosu) | |

---

## Audit výpočtů nástrojů (17. 10. 2026) – ✅ opraveno a ověřeno nezávisle

| Nástroj | Chyba | Oprava ověřena |
|---|---|---|
| Kurzový dopad | historické scénáře OBRÁCENĚ (březen 2020 „−17,7 %" místo +7,3 %; 2017 „+14,4 %" místo −12,2 %); VaR z celého portfolia; „celková kolísavost" mix; nefunkční pole kurzů | −12,17 % / +7,32 % z kurzů ČNB; VaR 146 038 Kč |
| Backtest – rebalancování | „měsíčně" = denně, „ročně" = každý den v prosinci; „při odchylce" nedělalo nic | měsíčně 510 597, čtvrtletně 525 564, ročně 531 121 = nezávislá simulace na korunu |
| Investiční kalkulačka, Kolik investovat měsíčně, Investování pro děti | r/12 → 7 % p.a. úročilo 7,23 % (+2–8 %) | 2 938 999; 855/1 970/5 846 Kč; 420 918 Kč |
| Čistý plat | chyběl daňový bonus na děti; důchodce 0 % místo 0,6 % | 23 000 + 2 děti → bonus 2 247 (Money.cz); 25 000 → 24 047; důchodce 38 525 |
| Nouzová rezerva | plán ignoroval současné úspory | kroky „splněno / 4 měsíce" = Čas do cíle |
| Monte Carlo | „Všepočasní" součet 92 % → nešlo spustit; dolarové výnosy neoznačené | spustitelné; metodika uvádí USD bez kurzu |
| FIRE kalkulačka | výsledek se měnil při každém načtení | pevné semínko: 19/24/32 let (nezávisle 19,2/24,8/32,4) |
| Kalkulačka poplatků | r − TER místo (1+r)(1−TER)−1 (−5 %); popisek plochy | 4 416 696 Kč = přesný výpočet |

**Vadné body v historii indexů (17. 10. 2026)** – body datované o víkendu a 1. dne v měsíci (starý měsíční zdroj, jiná úroveň ceny; odchylka od sousedů 3,6–4,1 % vs. 0,9 %). Backtest od 1. 1. 2010 dával 720 748 USD – víc než samotný index S&P 500 TR (702 720). ✅ Engine je při čtení vynechává (jen v denních úsecích) → 681 279 USD; roční výnosy 2011–2024 sedí s S&P DJI na 0,01–0,27 p. b. (poplatek ETF). ⏸ Úklid v DB (smazat ~1 800 bodů) a hlídání v check_index_integrity.py = rozhodnutí majitele.

**Otevřené:** předpoklady výnosů FIRE strategií (7,7/8,8/9,8 % nominálně v USD před TER) ověřit z dat v Kč (Vlna 7).

## Vlna 6 – Pravidelné vracení: „Korunový stroj času"  ·  ◐ v1 hotová na větvi `faze4` (17. 10.)

Jeden widget, který odpoví: *„Kdybych od [rok] posílal [částka] Kč měsíčně do [svět / S&P 500
/ 60/40 / konkrétní fond], kolik bych měl dnes – a jaké byly nejhorší chvíle?"*

- **Bez zátěže serveru:** hodnota portfolia je lineární vůči vkladu → jednou denně v ISR
  předpočítat pro ~6 presetů a každý počáteční měsíc 2000–2026 hodnotu za 1 Kč (≈ 6 × 320
  čísel, desítky kB). Prohlížeč jen násobí. Žádné API volání při zobrazení.
- **Důvod se vrátit:** scénář uložený v prohlížeči (localStorage, bez cookies a bez souhlasu) →
  při další návštěvě „Váš scénář: od minulé návštěvy +12 400 Kč".
- **Sdílení:** URL se scénářem + OG karta „5 000 Kč měsíčně od 2010 → 2,1 mil. Kč" (cachovaná
  na URL).
- **Napojení:** homepage hero (5.2), detail fondu (předvyplněný indexem fondu), články místo
  statických čísel Vanguardu, FIRE.
- **Investiční kalkulačka napojená na data:** místo holého „7 %" volby „Jako S&P 500 v Kč
  (2005–26)", „Celý svět", „60/40" + přepínač „v dnešních korunách" (`inflation.ts`).
- Podle firemního procesu UX expert od začátku (agent s prohlížečem, test na mobilu).
- **Podmínka:** Vlna 2 + nezávislé ověření předpočtu (vzorek scénářů přepočítat mimo engine,
  kotva SPDR/ČNB).

**Stav v1 (17. 10. 2026, větev `faze4`):** /stroj-casu (4 presety: Celý svět, S&P 500, Vyvážené 60/40, Zlato; měsíčně + jednorázově; rok startu; graf; nejhorší chvíle; sdílený odkaz s parametry; „od minulé návštěvy" v localStorage), blok s ověřeným číslem v úvodu homepage (H1 bez neověřitelného „Největší"). **Ověření:** `scripts/overeni-stroj-casu.mjs` – stroj vs. plný backtest 0,13–0,33 % (vklad na začátku měsíce); S&P 500 TR (S&P DJI) ±0,27 p. b./rok; převod Kč přes ČNB ±0,06 %. UX review zapracováno (pruh s výsledkem na mobilu, obnova uloženého scénáře, OG s vlastní URL a číslem, české pády, rychlé volby roku, větší ovládání, prázdný stav, aria). Investiční kalkulačka: volby se skutečným průměrným výnosem v Kč 2004–dnes (Celý svět 8,6 %, S&P 500 10,0 %, 60/40 6,7 %; stejné období pro všechny; ověřeno vs. backtest ±0,05 p. b. a S&P DJI + ČNB). Zbývá: napojení na detail fondu a články, přepínač „v dnešních korunách“.

**K rozhodnutí:** e-mailový „korunový report" jednou měsíčně (vaše dřívější ANO pro e-mail
list). Potřebuje službu pro rozesílání a formulář se souhlasem – žádné cookies. Navrhuju až
po stroji času, aby bylo co posílat.

---

## Vlna 7 – Obsah z dat (evidence v Kč)  ·  po tématech, každé = článek/důkaz + FB karta

Pořadí podle unikátnosti a toho, jak moc koruna mění závěr zahraničních studií. **Všechna
čísla ze sond jsou předběžná** – ven až po 3 krocích ověření (viz 0.2).

| # | Téma | Unikát (předběžně) | Chybí | Externí kotva |
|---|---|---|---|---|
| 7.1 | **Zajišťovat měnu? Koruna to obrací** | Koruna tlumí krize (2008 −47 % v Kč vs. −51 % v USD), ale 2000–03 propad prohloubila; CZK-hedged ETF v DB nejsou | Řada sazeb ČNB/Fed (náklad zajištění) | Kurzy z cnb.cz, SPY ze SPDR, reálná hEUR třída |
| 7.2 | ✅ **Pravidlo 4 % v korunách** (faze4, `/pravidlo-4-procent`, 17. 10.) | S&P 500: start 2000 → došlo 1/2012, 2001 → 7/2013, 2002 → 2/2020; od 2003 vydrželo. I 3 % u startů 2000–2001 nevydrželo | – | Nezávislý roční přepočet (S&P DJI TR, ČNB k 31. 12., míra inflace ČSÚ): roky vyčerpání 2012 / 2013 / 2020 sedí |
| 7.3 | **Naráz, nebo postupně – v korunách** | Jednorázově vyhrálo v USD 70 %, v Kč 57 % | Skript přes všechna okna; ověřit na globálních akciích | Nejdřív trefit ~2/3 Vanguardu v USD |
| 7.4 | **Akumulační vs. distribuční při 15% dani** | Čistě česká daňová úloha; před daní Acc = Dist | Dividendový výnos (Shiller) | Factsheety emitenta; daně jen dle `/dane-z-etf` |
| 7.5 | ✅ **Jak dlouho jsi v minusu – v Kč a reálně** (faze4, `/jak-dlouho-v-minusu`, 17. 10.) | S&P 500 od 1/2000: v Kč pod vkladem do 7/2014 (USD do 8/2011), reálně do 3/2018; po 10 letech pod vkladem jen nákupy 1/2000–6/2002. Starý odhad „reálně do 10/2016“ byl z dat před opravou vadných ticků – neplatí | – | Ověřeno: řada celý svět 60/40 vs. nezávislý přepočet z ročních výnosů S&P DJI + VGTSX a kurzů ČNB: 2021 2,345/2,339, 2022 1,997/1,995, 2023 2,407/2,402; S&P 2014-07 a 2018-03 trefeno z ročních dat |
| 7.6 | Replika Schwabova „načasování" v Kč | nejsdílitelnější karta | malý skript | trefit Schwabova čísla v USD |
| 7.7 | **„MSCI World nebo S&P 500?" a „Nasdaq 100 nebo S&P 500?" – v korunách** | česky hledané dotazy (našeptávač); backtest v Kč umí odpovědět | nic – data indexů máme | publikované výnosy indexů (MSCI, S&P), kurzy ČNB |

Distribuce každého tématu: FB karta (obrázek, čísla v Kč, odkaz v komentáři – ověřený
nejlepší kanál), zkrácená verze na Seznam Médium (ne kopie) podpořená z FB v prvních 24–48 h.
Titulky s vlastním korunovým úhlem, ne generické „X vs Y".

**Nedělat:** další obecné články „X vs Y" (Seznam plný zavedených webů, ~50 hledání/měs.),
„10 nejlepších dní", DALBAR, „dividendy = pasivní příjem", SPIVA s rámováním proti bankám,
cokoli o hypotékách a páce. FKI: produktový přehled nedělat (ČS je depozitář a distributor
FKI – střet zájmů).

---

## Pořadí a odhad (moje práce, ne týdny)

| Krok | Obsah | Odhad | Deploy |
|---|---|---|---|
| 1 | Vlna 1 dokončit + smoke test | dnes | #1 |
| 2 | Vlna 2 – opravy dat (web + scraper) + pojistky | 1–2 dny podle auditu | #2 |
| 3 | Vlna 3 + 4 (cesty k obsahu, výkon) | 2 dny | #3 |
| 4 | Vlna 5 (mobil, přístupnost) | 1 den | #4 |
| 5 | Vlna 6 (stroj času + kalkulačka na datech) | 2–3 dny vč. ověření | #5 |
| 6 | Vlna 7 – po jednom tématu | ~1 den na téma, z toho většina je ověření čísel | 1 deploy / téma |

Co může zdržet: vaše rozhodnutí u přístupů a účtů (Vlna 1), externí ověřování čísel (Vlny 6
a 7 – tam se nespěchá), limit 1 deploy denně.

## Měření (týdně, jen ČR bez botů)

| Metrika | Výchozí stav | Cíl |
|---|---|---|
| Organické návštěvy celkem (GA4) | baseline z `ceo-analytics.mjs` | 10× do 30. 6. 2027 |
| Detail fondu → článek | 0 z 1 243 / 90 dní | > 5 % prokliků z detailu |
| Seznam + Bing na `/srovnani/*` | 26 / 90 dní | růst po 3.3 |
| Seznam: v indexu / uloženo | 1 140 / 2 269 | podíl roste |
| Vracející se uživatelé | změřit před Vlnou 6 | růst po stroji času |
| Chyby v datech (denní kontrola) | 12 + 78 + 236 + 13 + 316 + 106 | 0 nevysvětlených |
| Chyby z prohlížečů (`client_errors`) | sbírá se od 17. 10. | bez opakujících se |

## Revize faze4 nezávislým agentem (17. 10. 2026) – opraveno před nasazením

| Nález | Oprava |
|---|---|
| Stroj času „Nejhorší chvíle“ ignoroval propad v 1. měsíci (S&P 500 od 2008: −30 % místo −36 %) | vrchol začíná nákupní cenou |
| „Celý svět“ = celé 60 % USA / 40 % svět → nadsazeno ~0,9 p. b./rok (hero 3,2 → 3,0 mil. Kč, kalkulačka 8,6 → 8,0 %) | od 7/2008 skutečný FTSE All-World (VT), dřív přiznaná aproximace; ZAMERNA-ROZHODNUTI.md |
| Zaokrouhlení na tisíce → „zisk +0 Kč“ u malých částek | 3 platné číslice |
| Neplatný preset v URL ukázal čísla jiného presetu | validace proti načteným presetům, bez fallbacku |
| Napevno zapsaná tvrzení v článcích („o polovinu kratší“, „vyhrál S&P 500“, „nejhorší případ“) | věty podmíněné daty |
| Chyba dat při ISR → stránka „nepodařilo se načíst“ na celý den | výjimka → Next drží poslední dobrou verzi |
| Číslo na homepage bez data a bez hlídání stáří | datum + skrytí při datech > 7 dní + denní kontrola proti plné simulaci (`check-fund-data.mjs`) |
| FAQ kalkulačky popisovalo „roční výnos / 12“ | popis efektivní měsíční sazby |


## Stav 17. 10. 2026 večer

- ✅ **faze3 nasazena na produkci** (6c8315c) po opravném scrapu; produkce ověřena: stránky/přesměrování OK,
  zlatá sada žebříčků bez chyb, roční výnosy v Kč/USD sedí u všech dnes stažených fondů, žádné chyby z prohlížečů.
- ✅ Scraper: checkpoint platí jen pro stejnou verzi kódu (zrušený běh se starým kódem nahrál 550 fondů se špatnými
  ročními výnosy) – opraveno v etf-astro 1c75cf9, data přehrána opravným scrapem.
- ⏳ **faze4 – nasadit 18. 10.**, pak HNED: `gh workflow run sync-indexes.yml -f full=true` (opravený loader přepíše
  posunuté měsíční řady EUR státních dluhopisů) a ověřit: `eur_govt_bond_15_30y` k 2023-12-31 ≈ denní adjclose IBGL
  k 29. 12. 2023 (ne hodnota z konce ledna). Dokud to neproběhne, backtest EUR státních dluhopisů je posunutý o měsíc.
- ⏳ Na rozhodnutí: úklid vadných bodů v `eur_corp_bond` (10 všedních konců měsíců mimo řadu) – do té doby
  vyřazeno z „konkrétního fondu“ v backtestu.
- Backtest konkrétního fondu (faze4): 213 fondů, ověřeno proti skutečným ročním výnosům 2022–2025; MSCI World chybí
  (data indexu nemáme – kandidát: URTH od 2012 přes manifest + loader).
- ✅ Tři datové články prohloubené (přání majitele „mnohem větší detail“): S&P vs svět (složení, období, měna,
  7 krizí, klouzavá okna + graf, kolísavost/korelace, nejlevnější fondy), Jak dlouho v minusu (pravděpodobnost
  po 1–15 letech naráz/pravidelně/reálně, hloubka, rozložení doby), Pravidlo 4 % (úspěšnost 3–5 % přes měsíční
  starty, max. udržitelný výběr podle roku, pružná varianta, koruny). Každé číslo ověřeno nezávislým skriptem.
- ⏳ Úklid eur_corp_bond (schválen majitelem 17. 10.) + všech 37 indexů: běží s nasazením faze4
  (`gh workflow run sync-indexes.yml -f full=true -f uklid=true`), dry-run prošel.

## Stav 18. 10. 2026 (nasazení faze4 + úklid indexů)

- ✅ **faze4 nasazena na produkci** (main = 3409753, fast-forward z 6c8315c) po úspěšném nočním scrapu
  (etf-astro run 39099339189); tsc + build lokálně prošly.
- ✅ **Úklid indexů** (sync-indexes run 39114549627, `full=true uklid=true`, success): smazáno **3 591 řádků**
  ze všech 37 indexů (41–144 na index; sp500 144, eur_govt_bond_15_30y 67). Integrita OK, plné počty
  (sp500 8 487, eur_govt_bond_15_30y 4 806 – EUR dluhopisy jsou nově denní). Tabulka 204 561 → 219 355 řádků.
- ✅ **Ověření úklidu:** `eur_govt_bond_15_30y` k 2023-12-29 = 171,076431 = denní adjclose IBGL.AS z Yahoo
  (shoda na 6 míst); řádek 2023-12-31 s hodnotou z konce ledna zmizel. Víkendové řádky 2 871 → 0,
  řádky na 1. den v měsíci 9 373 → 6 661. Spike test (výkyv > 5 % tam a zpět): 2 010 → 216 bodů, z toho 211
  v krizích (2000–02, 2008–09, 2011, 2020) a 5 mimo – vše skutečné tržní dny (27. 10. 1997, 12. 11. 2007 EEM,
  18. 3. 2008, 8. 7. 2008 XLF, 9. 4. 2025 XLE). eur_corp_bond bez skoků.
- ✅ **Produkce:** 12 klíčových stránek 200, `/api/backtest/fondy?q=VWCE` ok:true, stroj času vs. backtest
  8/8 ✅ (rozdíl 0,12–0,33 %), backtest VWCE od 2010 (100 000 Kč) → 599 726 Kč, CAGR 11,27 % (kontrola smyslu
  sedí), homepage číslo a žebříčky v kontrole bez hlášení, client_errors za 24 h: 0.
- 🚨 **Nová kontrola hlásí 1 fond v nabídce: IE000WARATZ3** (HSBC Europe Screened Equity, EUR 2m) – roční výnosy
  v Kč/USD 2024–2025 špatně (2025 USD: DB +14,4 % vs. přepočet +34,4 %). Příčina: `scraping_date` 15. 10. =
  starý kód scraperu před opravou 1c75cf9 a od té doby se fond nestáhl znovu (log scrapu ISINy nevypisuje).
  Oprava = znovu stáhnout fond (cílený scrape) + zjistit, proč ho noční běh vynechává. Kontrola ho chytá.
- ⏳ Zvážit zrušení filtru `bezVadnychTicku` v engine (po úklidu zbytečný) a vrácení eur_corp_bond do
  „konkrétního fondu“ v backtestu (data jsou po úklidu čistá).
