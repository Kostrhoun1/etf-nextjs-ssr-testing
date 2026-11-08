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
