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

## Vlna 1 – Bezpečnost a zjevné nesmysly  ·  větev `faze1`  ·  stav: otestováno lokálně, nasazuje se

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
| 1.11 | Smoke test: nesmyslný ISIN → 404 bez `x-vercel-cache: HIT`; revalidate bez hesla → 401; backtest S&P 500 – dno grafu = max. pokles | ✅ lokálně (prod build), ☐ produkce |
| 1.12 | Deploy s autorem `tomas.kostrhoun1@gmail.com` → ověřit, že ho Vercel přiřadí účtu Kostrhoun1 → teprve pak doporučit přepnutí repa na soukromé | ☐ |

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

## Vlna 2 – Správnost dat  ·  PRIORITA  ·  stav: čeká na výsledky auditu

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
| 2.x | **Nové nálezy auditu dat** | – | doplní se po dokončení auditu |

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
| 3.1 | **Detail fondu: kontextové odkazy s větou a číslem pro daný fond.** Akumulační/distribuční → článek; měnové riziko (žlutý box) → `/menove-riziko-etf`; výkonnost v Kč → `/kolik-vydelaly-etf` a „Otestovat od roku 2005" → `/backtest?slozeni=<index>:100&run=1` (jen pokud fond spolehlivě mapuje na index) | `src/app/etf/[isin]/page.tsx` ř. ~484, 508, 641, 677+ | referrer `/etf/` → článek: 0 z 1 243 |
| 3.2 | **„Kam dál" podle kategorie fondu** (dnes natvrdo S&P 500 – zlatý fond radí „postavte proti VUAA") + 3–5 podobných fondů (stejný index/kategorie) + odkaz na existující dvojici | tamtéž ř. 687–718 | proklik detail → detail (83); Seznam „v indexu" 1 140 z 2 269 |
| 3.3 | **Srovnání dvojic do sitemapy** (POPULAR_PAIRS) + vlastní canonical; `vwce-vs-cspx` má canonical na adresu s 308 | `src/app/sitemap.ts`, `srovnani/vwce-vs-cspx/page.tsx` | Seznam+Bing na `/srovnani/*`: 26 / 90 dní |
| 3.4 | **Navigace:** přidat „Backtest" a „Co říkají data" (hub `/data`: kolik vydělaly ETF, DCA, měnové riziko, akum. vs. dist., ETF vs. akcie). Hlavičku vytáhnout do jedné sdílené komponenty (dnes je v každé `page.tsx` zvlášť) | `MobileMenu.tsx`, nová `SiteHeader` | prokliky na hub |
| 3.5 | **Backtest ukáže výsledek hned po otevření** – výchozí preset předpočítaný na serveru v ISR, API až po změně. Totéž pro `/portfolio-strategie/[slug]` (dnes 2× `simulate` ≈ 6 s CPU na každé zobrazení!) | `backtest/page.tsx`, `BacktestWidget.tsx`, `PortfolioBacktest.tsx`; mrtvý `heroExample.ts` použít nebo smazat | podíl návštěv backtestu s interakcí |
| 3.6 | **Nástroje → důkazy:** pod výsledkem jedna karta s tvrzením a číslem (pravidelný vklad → „Naráz, nebo postupně?"; USD index → měnové riziko; kalkulačka → „Proč 7 %? Skutečné výnosy v Kč") | `BacktestWidget.tsx`, `InvesticniKalkulackaWidget.tsx` | referrer `/backtest` → článek: 1 / 90 dní |
| 3.7 | `/akumulacni-vs-distribucni-etf` není slepá ulička; `/kategorie` (sirotek) nalinkovat nebo sloučit | články | – |
| 3.8 | Sitemapa: skutečný `lastmod` (dnes čas buildu u všech URL) | `sitemap.ts` | – |
| 3.9 | `llms.txt` aktualizovat (staré www URL, „2000+ fondů", „Best ETF 2025") | `public/llms.txt` | – |
| 3.10 | IndexNow posílat jen změněné URL, ne celou sitemapu po každém deployi | `scripts/indexnow.mjs` | – |
| 3.11 | Canonical pro `/backtest` a kalkulačky (URL s parametry z FB, 301 z Buffetta) | stránky nástrojů | – |

Podmínka pro 3.1 (věta v Kč) a 3.5: Vlna 2 hotová – jinak ukážeme víc lidem špatná čísla.

---

## Vlna 4 – Výkon a náklady  ·  1 deploy (lze spojit s Vlnou 3)

| # | Úkol | Dopad |
|---|---|---|
| 4.1 | **Payload srovnávače:** vyhodit `_blob` (484 KB, duplikuje název/ISIN/tickery) a `_tickers` (dopočítat v prohlížeči), výnosy na 1 desetinné místo → 4,3 MB → ~1,5 MB | `/srovnani` mobil: Perf 67, LCP 6,8 s |
| 4.2 | **Backtest:** data indexů a kurzů cachovat v paměti modulu (TTL ~6 h) – dnes 2,8–4,8 s a ~1 MB JSON na každý výpočet | CPU, rychlost nástroje |
| 4.3 | Grafy (recharts, 95 KB, 47–78 % nevyužito) načítat líně až u výsledku | kalkulačka TBT, backtest LCP |
| 4.4 | Vypnout preview deploye pro ne-main větve (`git.deploymentEnabled`) | úložiště, méně zbytečných buildů |
| 4.5 | Middleware: přesměrování `/etf/ticker/VWCE` je rozbité (legacy klíč) → publishable klíč; nefunkční přepis `Vary` odstranit | `/etf/ticker/*` vrací 404 |
| 4.6 | Supabase URL a klíč na jednom místě (dnes 6 míst); jeden serverový klient s publishable klíčem | méně chyb při výměně klíčů |
| 4.7 | **Mrtvý kód:** 175 z 321 souborů v `src` (27 tis. řádků) je nedosažitelných – smazat najednou podle grafu importů | přehlednost, rychlejší build |
| 4.8 | `tsc` 146 chyb → 0 v živých souborech, pak `ignoreBuildErrors: false` (ať build chytí skutečné bugy jako `distKind`) | prevence chyb |
| 4.9 | Supabase advisor: `is_user_admin(email)` jde volat anonymně → odebrat EXECUTE pro anon; Postgres záplaty (vaše tlačítko v dashboardu) | bezpečnost |

**Nedělat:** přepis na Next 16 / Tailwind 4, ladění CSS a fontů kvůli Lighthouse body,
zkracování `revalidate`, předgenerování všech 5 146 detailů.

---

## Vlna 5 – Mobil a přístupnost  ·  1 deploy

Ověřuje se na 375 px před i po nasazení, screenshoty před/po.

| # | Úkol | Dnes |
|---|---|---|
| 5.1 | **Homepage zkrátit na ~polovinu:** z 20 dlaždic nástrojů nechat 6 (backtest, investiční kalkulačka, srovnávač, portfolia, FIRE, Co říkají data), zbytek na `/kalkulacky`; 3× „Prozkoumat fondy" → 1×; tři trust bloky → jeden | 9 331 px ≈ 11,5 obrazovky |
| 5.2 | **Hero homepage na USP:** „Kolik by vám dnes vydělalo 5 000 Kč měsíčně od roku 2010? **X Kč**" + „Spočítat svůj případ" / „Najít fond". Číslo předpočítané v ISR stejným enginem a ověřené 3 kroky | „Největší srovnávač ETF" – žádná částka v Kč |
| 5.3 | **Srovnávač na mobilu:** hero na 2 řádky; ve výchozím pohledu bez komodit a peněžního trhu (dnes v top 25 zlato ETC a XEON); rychlé volby „Celý svět / S&P 500 / Dluhopisy"; hvězdičky skrýt nebo přeškálovat (5/5 skoro všem) | hero 380 px před filtry |
| 5.4 | **Investiční kalkulačka:** pole jako v backtestu (`inputMode="numeric"`, mezery v tisících); výsledek v pruhu, který zůstane vidět při posouvání | `type="number"`, šipky 16 px, výsledek ~930 px dolů |
| 5.5 | **Klikací plochy ≥ 44 px:** odkazy „vše" (36×16), drobečková navigace (16 px), InfoTip (30×30) | |
| 5.6 | **Kontrast:** `text-slate-400` → 500/600 (447×, 2,6:1); `text-emerald-600` → 700 (83×, 3,8:1); hlavní tlačítko `bg-teal-600` → 700 (3,7:1) | |
| 5.7 | **Čtečky obrazovky:** `aria-pressed` u presetů backtestu, `aria-live` u „Počítám…", odkaz „přeskočit na obsah" | |
| 5.8 | Patička stránek: autor + „12 let praxe" + „Nezávislý" + disclaimer + patička (~1 000 px na mobilu) → jeden kompaktní blok | |
| 5.9 | Modelová portfolia: hlavní číslo 10 let p.a. v Kč + max. propad, ne roční výnos (nesoutěžit v krátkodobém výnosu) | |

---

## Vlna 6 – Pravidelné vracení: „Korunový stroj času"

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
| 7.2 | **Pravidlo 4 % v korunách** | Start 2000 vyčerpal portfolio do 2012, start 2003 přežil | Výběry v enginu; dluhopisy před 2002 | Replika publikovaných výsledků v USD (Pfau / PV), CPI ČSÚ |
| 7.3 | **Naráz, nebo postupně – v korunách** | Jednorázově vyhrálo v USD 70 %, v Kč 57 % | Skript přes všechna okna; ověřit na globálních akciích | Nejdřív trefit ~2/3 Vanguardu v USD |
| 7.4 | **Akumulační vs. distribuční při 15% dani** | Čistě česká daňová úloha; před daní Acc = Dist | Dividendový výnos (Shiller) | Factsheety emitenta; daně jen dle `/dane-z-etf` |
| 7.5 | **Jak dlouho jsi v minusu – v Kč a reálně** | Vklad 2000 reálně pod vodou do 10/2016; 35 z 202 desetiletých oken reálně ve ztrátě | Reálné propady v enginu | SPY oficiálně, −51 % 2008, ČNB |
| 7.6 | Replika Schwabova „načasování" v Kč | nejsdílitelnější karta | malý skript | trefit Schwabova čísla v USD |

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
