# Plán na listopad 2026 – dodělat vše odložené, pak web „zmrazit“

Majitel 8. 11. 2026: Vercel Pro (koupený po pozastavení webu 7. 11.) platí do **7. 12. 2026** a od prosince se ruší.
Do té doby dodělat všechna odložená vylepšení, pak už na web skoro nesahat. Web musí potom běžet sám na free tieru
(Hobby) – bez zásahů majitele, s automatickou kontrolou a opravami (scripts/denni-kontrola.md).

Pravidla platí dál: PRAVIDLO Č. 1 (data správně, nezávislé ověření, každá oprava = i automatická kontrola), žádné
téma úvěrů/hypoték, vykání, žádná cookie lišta. **Nic nového nesmí přidat výpočetní čas za běhu** – co jde, počítat
při buildu (build se do limitů nepočítá).

## Týden 1 (9.–15. 11.): Provoz bez údržby

| # | Úkol | Proč |
|---|---|---|
| 1.1 | Změřit dopad blokace SEO robotů (robots.txt 8. 11.) na CPU a přenos z originu; dotáhnout pod denní cíle (5 min CPU, 200 MB) – porovnání `/srovnani/porovnani` cachovat na CDN, nepředgenerované dvojice | návrat na Hobby |
| 1.2 | **Automatický týdenní rebuild** (Vercel deploy hook z GitHub Actions, neděle v noci) – předgenerované detaily nikdy nevyprší (30 dní) a data v nich nejsou starší než týden | web bez zásahů |
| 1.3 | Zapnout zpět smoke test a zlaté případy, ale **jednou týdně** místo denně (šetří CPU); denní kontrola dat zůstává | monitoring |
| 1.4 | Úklid zlatých případů: ~25 „čeká na nasazení“ je už nasazeno → přeznačit; skutečné chyby opravit: zaokrouhlení záporných čísel detail × porovnání (−20,4 vs −20,5 %), hranice DEGIRO 16 100 vs 16 177 Kč, Monte Carlo 50 let, /fire „~8,5 roku“ | správnost |
| 1.5 | Region fondů (Korea „Evropa“, zlato a EUR dluhopisy „Celosvětově“) – opravit mapování + kontrola | správnost |

## Týden 2 (16.–22. 11.): Data a scraper

| # | Úkol |
|---|---|
| 2.1 | Pákové ETP – ověřit podezřelé roční výnosy na burze + kontrola |
| 2.2 | 10 fondů bez přepočtu ročních výnosů do Kč/USD (scraper etf-astro) |
| 2.3 | LevDAX `is_leveraged = false`; index a peněžní trh (zbytek větve `oprava-tickery-indexy`); komentář v scrape.yml |
| 2.4 | Backtest: skutečné TER zdrojových indexů v popiscích (`sourceTer`); inflace ČSÚ měsíčně od 1996 (reálné výnosy) |
| 2.5 | Indexy: rozhodnout filtr `bezVadnychTicku` (po úklidu dat zbytečný) a vrátit `eur_corp_bond` |

## Týden 3 (23.–29. 11.): Vylepšení stránek (z revizí, odložené)

| # | Úkol |
|---|---|
| 3.1 | **Backtest ukáže výsledek hned po otevření** – výchozí preset spočítaný při buildu (0 CPU za běhu), zmenšit odpověď ~1 MB; z FB odkazu rovnou na výsledek |
| 3.2 | Kalkulačky: výsledek nahoře, srozumitelné úvody s reálným číslem v Kč (jako backtest) |
| 3.3 | Detail fondu: graf vývoje v Kč (z dat při buildu); porovnání: graf; fondy bez indexu |
| 3.4 | Žebříčky: živá čísla na kartách `/zebricky`, plná tabulka kategorie; celosvětový žebříček – největší fond |
| 3.5 | Srovnávač: drobnosti z revize (hero, filtry v řádku, řazení na mobilu, počty v záložkách, nabídka indexů) |
| 3.6 | Brokeři: sjednotit `/kde-koupit` a `/srovnani-brokeru`, řádek „nákup za 5 000 Kč stojí…“, mobilní hlavička |
| 3.7 | Stroj času: napojení na detail fondu a články, přepínač „v dnešních korunách“ |
| 3.8 | Homepage: zkrátit patičku na mobilu |

## Týden 4 (30. 11.–7. 12.): Revize, zmrazení, návrat na Hobby

| # | Úkol |
|---|---|
| 4.1 | Nezávislá revize celého webu (2 art directoři, začátečník na mobilu, pokročilý ověřující čísla na justETF) + opravy |
| 4.2 | Poslední velké nasazení a ověření na produkci (pevná sada stránek) |
| 4.3 | **1. 12.: verdikt** – spotřeba 7. 11.–1. 12. a odhad do 7. 12. pod limity Hobby → „Pro můžete zrušit“ |
| 4.4 | Režim údržby: scraper (pg_cron), denní kontrola + oprava (úloha Claude), týdenní rebuild, týdenní zlaté případy a smoke test. Majitel nic dělat nemusí |

## Na rozhodnutí majitele

- ✅ `/kalkulacky` s hypoteční a úvěrovou kalkulačkou zůstávají (majitel 8. 11.: nejsou v rozporu s jeho prací).
- Bing Webmaster Tools – ověřit web (jen majitel, přihlášení).
- Supabase: upgrade Postgresu, Auth OTP/uniklá hesla (tlačítka v dashboardu, jen majitel).

## Průběh

| Datum | Hotovo |
|---|---|
| 8. 11. | robots.txt blokuje SEO roboty (Meta AI povolena); opakování načtení dat při buildu; ignoreCommand odolný; plán sepsán |
| 8. 11. | Postgres 15.8 → 17.11 (7 min výpadek, data a pg_cron ověřeny); Bing Webmaster Tools ověřen + sitemap |
| 8. 11. | 1.2 ✅ týdenní přestavba (deploy hook, sobota 03:00 UTC; ověřeno: hook → build → `scripts/vercel-ignore.sh`); 1.3 ✅ smoke + zlaté případy 1× týdně, znovu zapnuté; 1.4 ◐ 20 zlatých případů odznačeno (XPASS), naklady-28 zaokrouhlení opraveno (zaokrouhli, test), fire-21 = chyba testu (4,6 % reálně, nezávisle přepočteno), fire-14 Monte Carlo – prověřuje nezávislý agent; 1.5 ✅ regiony opravené už 18. 10. (zobrazení v řádku → týden 3) |
| 8. 11. | 1.4 ✅ fire-14 Monte Carlo: pevné semínko dávalo −3,5σ vzorek → antitetické cesty (src/lib/monteCarloJadro.ts, test), „> 99 %“; nasazeno 10:14 UTC, na produkci ověřeny fire-14, fire-21, naklady-28. Zbývá jen 1.1 (měření po blokaci robotů – 9. 11.) |
| 8. 11. | Týden 2: ✅ pg_cron yfinance-etf-update vypnuta (401, nepoužívaná); ✅ load_yahoo_daily search_path; ✅ 2.5 eur_corp_bond zpět do backtestu fondu (10 fondů; řada = IEAC.L, roky ±0,3 p. b. proti Xetře/Amsterdamu); ✅ 2.4 CPI 1996+ už od 21. 10. + kontrola stáří; sourceTer u všech 28 indexů (prospekty emitentů); ✅ 2.2 přepočet Kč/USD: dnes 0 čerstvých chyb, nová kontrola, graf ročních výnosů „—“; ✅ 2.3 indexy/peněžní trh v main od 20. 10., scrape.yml komentář (etf-astro #6); ⏳ scraper: výpadek kurzu v cache + roky 2026/2027 (PR připravuje agent); ⏳ sloupce return_2026/2027 v DB – čeká na souhlas majitele; ⏳ 2.1 pákové ETP (agent) |
| 8. 11. | Týden 2 nasazen 11:25 UTC a ověřen na produkci (kontrola dat bez poplachu): ✅ 2.1 pákové ETP – 31 chybných kalendářních let u 23 produktů (zdroj: neupravené konsolidace/dělení, ceny na haléře, bod 31. 12.) skryto `NEOVERENE_ROKY` + pojistka ≤ −99,95 % + kontrola kolo9 (ověřené extrémy `OVERENE_EXTREMNI_ROKY`); ✅ scraper etf-astro #7 sloučen (výpadek kurzu se nešíří a je vidět, roky 2026/2027 připravené, uzavřené roky se nepřepíšou na null) – první běh po 9. 11. 05:00 UTC ověřit; ⏳ sloupce return_2026/2027 v DB – souhlas majitele; zbývá: 11 extrémních roků k ověření (Solana 2023, AMD3, UBR3, QQQ5, LSIL, COCO), UCT2/STPH páka (x7) bez příznaku, UINE posunuté roky |
| 11. 11. | Týden 3 nasazen 18:57 UTC a ověřen na produkci (kontrola dat bez poplachu; zlaté případy lokálně 135 OK / 0 SELHALO, na produkci investicni-43/44, backtest-41, naklady-47 OK): ✅ 3.1 backtest – výsledek výchozí strategie i odkazu z FB předpočítaný (0 volání API, +10 kB gzip, test předpočet = API); ✅ 3.2 kalkulačky – výsledek nahoře na mobilu (FIRE 2 341 → 750 px …), úvod investiční kalkulačky s ověřeným číslem (majitel schválil); ✅ 3.4 žebříčky – plná tabulka do 500 fondů, popisy indexů Celého světa; ✅ 3.5 srovnávač – nabídka indexů 760 → 106 viditelných, aktivní fondy bez „indexu“; ✅ 3.6 brokeři – řádek „Nákup za 5 000 Kč“, kompaktní mobilní hlavička; ✅ 3.7 stroj času „v dnešních korunách“; ✅ 3.8 patička mobil 842 → 502 px; CPI ČSÚ 10/2026. ⏸ 3.3 graf v Kč na detailu – nemáme denní ceny fondů, k rozhodnutí |
| 8. 11. | Nové do týdne 2: pg_cron `yfinance-etf-update` volá edge funkci se zakázaným legacy klíčem (HTTP 401 každých 15 min) – opravit nebo zrušit |
| 11. 11. | 3.4–3.6 (větev worktree, NEnasazeno): 3.4 rozcestník /zebricky už měl živá čísla (kolo 6) – přidán `data-nejvetsi` + poplach, když „Celý svět“ není index celého světa (EUNL opraven 18. 10.); tabulka žebříčku plná do 500 fondů (ESG 403 dřív useknuté na 300), nad 500 300 řádků + odkaz do srovnávače se stejným prahem/řazením. 3.5 hero, filtry v řádku, řazení na mobilu, počty záložek a limit 4 už hotové z kol 3–7; nabídka indexů sbalená (8 na skupinu + „další“), ICE a J.P. Morgan vlastní skupiny, aktivní fondy bez „indexu“. 3.6 řádek „Nákup za 5 000 Kč celkem“ v tabulce /srovnani-brokeru (sdílený prikladNakupu s recenzemi), kurz ČNB s datem v hlavičce, kompaktní mobilní hero /kde-koupit; kontrola audit naklady B2 + zlatý případ naklady-47 |
| 11. 11. | ✅ 3.3 NASAZENO 20:00 UTC a ověřeno na produkci (kontrola dat 0 POPLACHŮ, blok „graf indexu“ bez nálezu; overeni-graf-indexu.py proti etfpruvodce.cz vše ≤ 0,12 %; VWCE bez grafu). Varianta A schválená majitelem: graf „Vývoj indexu … v Kč“ na detailu jen u fondů se shodou indexu 'stejny' (109 fondů: S&P 500 42, zlato 20, MSCI EM 18, Russell 14, dluhopisy 15); 'blizky' (VWCE) a bez přiřazení bez grafu. Data cestou backtestu při buildu (jednou za proces), serverové SVG bez JS; HTML detailu +11,6 kB (+2,7 kB gzip), build 238 → 250–260 s. Nezávisle ověřeno Yahoo × ČNB (SXR8, IEF 7-10y, IBGS, SGLN – vše ≤ 0,12 %, scripts/overeni-graf-indexu.py); kontrola check-fund-data blok „graf indexu“; test scripts/vyvojIndexu.test.mjs |
