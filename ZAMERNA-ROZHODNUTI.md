# ⛔ Vypadá to jako chyba, ale je to záměr

Jediný seznam živých rozhodnutí, která zvenčí vypadají jako nedodělek. **Přečti si ho dřív, než něco
„opravíš"** — hlavně když startuješ bez kontextu předchozích konverzací (rutiny, nová session).

Proč to existuje: 15. 7. 2026 smazal noční job 419 řádků `sp500` a produkce půl dne ukazovala čísla
o 15 % vedle. Hlubší příčinou nebyl ten skript, ale že **nikde nebylo zapsáno, jak to má být** —
tickery ve scraperu, měny v `engine.ts`, proxy ETF ve widgetu. Tři pravdy ve dvou repech.
Tenhle soubor je reakce: **jedna pravda, jedno místo.**

Pravidlo pro zapisování: každé takové rozhodnutí sem patří ve stejném tahu, ve kterém padne —
s **důvodem** a **kdy přestane platit**. Co vyprší, ukliď.

---

## Data a backtest

**`etf-astro` → job `backtest` má `if: false`. ODSTAVENÝ ZÁMĚRNĚ.**
Dělal `DELETE` celé řady + `INSERT` po dávkách; když dávkování spadlo, zůstal useknutý ocas.
Jeho práci převzal GitHub Actions **`sync-indexes.yml`** v tomhle repu (upsert, nikdy delete).
**Znovuzapnutí = zopakování incidentu.** Scraping ETF z justETF ve stejném repu běží dál a je v pořádku.
→ `BACKTEST-DATA.md`, paměť `incident-sp500-smazana-data`

**`src/lib/backtest/indexes.ts` = JEDINÁ pravda o indexech** (ticker, měna, původ, zařazení).
`engine.ts` si z něj měny **odvozuje**, nemá vlastní tabulku. Nikdy nepřidávej ticker ani měnu jinam.

**Tři EUR dluhopisové indexy jsou `monthly: true` (jen měsíční data), ne denní.** (`eur_govt_bond_1_3y`,
`_3_7y`, `_15_30y`.) Původ dohledán 24. 7. 2026: čistý total-return (adjclose) z Amsterdam listingů
iShares € Govt Bond (IBGS.AS / IBGX.AS / IBGL.AS). Yahoo má pro plnou historii jen měsíční data →
223 bodů/kód (2008-01-31→dnes), `managed:true` (sync je drží čerstvé). Dřív byly `managed:false` s daty
neznámého původu (3-7y navíc špatná durace) — nahrazeno. **Nesnaž se z nich udělat denní řadu** — čistý
denní zdroj zdarma neexistuje; engine si měsíční řadu forward-fillem nese přes denní dny (viz níže).

**`eur_govt_bond` je od 19. 9. 2026 `XGLE.DE` a `monthly: true` — NEVRACEJ na `IEAG.L`.**
Původní ticker přestal na Yahoo existovat (HTTP 404) a shodil noční sync. Při hledání náhrady se
ukázalo, že `IEAG` je podle pojmenování iShares **„€ Aggregate Bond"** (vládní i firemní), takže řada
označená na webu jako „EUR vládní dluhopisy" byla plněná agregátním fondem. Ověřeno na živých
listingech: `IEGA` = Govt, `IEAC` = Corp, `IEAG` = Aggregate. Nový zdroj `XGLE.DE` = Xtrackers II
Eurozone Government Bond — skutečně vládní a s delší historií (2008-01 místo 2009-03).
**Denní zdroj neexistuje** (prověřeno 23 tickerů; Yahoo dává evropským listingům v plné historii jen
měsíční data), proto `monthly: true` a zápis do `MONTHLY_INDEXES`. Historie byla 19. 9. **záměrně
přehrána** (4 506 denních řádků smazáno, 225 měsíčních zapsáno) — jediná výjimka ze zásady „nikdy
DELETE", protože slepit dva různé fondy do jedné řady by bylo horší. Záloha staré řady je v
`.secrets/`. Dopad ve stejném okně 2009-03→2026-09: CAGR 1,25 % → 1,73 %, vol 4,82 % → 5,07 %,
max. pokles −21,0 % → −21,6 %.

**Poplatek řídí engine z manifestu (`sourceTer`), ne `item.ter` z widgetu.**
Data jsou NAV reálného fondu (poplatek v ceně); engine je vzorcem `[(1−desiredTer)/(1−sourceTer)]^roky`
přepočítá na požadovaný poplatek. Default `desiredTer = sourceTer` → **data beze změny**. `item.ter` ve
widgetu je jen na zobrazení — needituj kvůli němu výpočet. (Dvojitý odečet opraven 16. 7. 2026, čísla
na webu +1,7 %.) → paměť `ter-dvojity-odecet-oprava`

**Výnosy za období platí k `returns_as_of` = poslednímu pracovnímu dni řady zdroje, který je ≥ 2 pracovní dny před dnem
stažení A zároveň není posledním bodem řady (21. 10. 2026, upřesněno odpoledne).** Pouhý „předposlední bod“ nestačí: zdroj
během obchodování přidává PRŮBĚŽNÝ bod dneška, takže 21. 10. po 07:20 UTC byl předposledním bodem předběžný 20. 10.
(741,30 ≈ závěr Xetry). Scrape ve středu tedy ukáže „Data k“ pondělí, v úterý pátku – ZÁMĚR (raději starší, ale konečná). Zdroj (justETF) vede
poslední den nejdřív předběžně (≈ závěr Xetry) a konečnou hodnotou (NAV) ho přepíše až další den; výnosy k němu byly
o 0,2–0,9 p. b. vedle (SXR8 19. 10.: 743,07 → 739,32). Výpočet: etf-astro `scraper/vynosy_z_rady.py` (jedno volání
chart API, RELATIVE_CHANGE – ne MARKET_VALUE, ta má u levných fondů chybu zaokrouhlení až 0,1 p. b.).
- Fondy se zpožděnou řadou u zdroje (ESEA, PSP5, S5USAS, WSPX…) mají VLASTNÍ, starší den – web ho u nich ukazuje
  („výnosy k 16. 10. 2026“). „Data k“ stránky = nejčastější `returns_as_of` (src/lib/datumVynosu.ts).
- Fond pozadu o víc než 3 pracovní dny není v mediánech ani v součtech portfolií (jiné období). Karta „Nejvýkonnější“ a medián
  na žebříčku berou od kola 7 jen fondy PŘESNĚ ke dni „Data k …“ stránky (viz Srovnávač a žebříčky – kolo 7).
- Selže-li chart API, jsou výnosy za období `null` („—“) – NIKDY náhrada z HTML profilu (ten je předběžný). Kalendářní roky
  (2021–2025) dál z profilu: jsou uzavřené a sedí.
- „Od vzniku“ (return_inception) se počítá z téže řady (= profil zdroje). Dřív parser četl „+2,141.66%“ jako 2,141 %.
- Hlídá `scripts/check-fund-data.mjs`, blok `kolo6b rada`. Platí, dokud zdroj nezačne zveřejňovat jen konečné hodnoty.

## Infrastruktura (CI, hosting)

**Kontrola integrity: měsíční indexy (`monthly: true`) mají volnější prahy ocasu i díry.**
`MONTHLY_INDEXES` v `check_index_integrity.py` (3 EUR dluhopisy) → `MONTHLY_STALE_DAYS`/`MONTHLY_GAP_DAYS`
= 40 dní. U měsíčních dat jsou ~30denní rozestupy a měsíc starý ocas NORMÁLNÍ, denní prahy (5/10) by je
vždy shodily. Není to úplná výjimka — když se zdroj zastaví na >~měsíc, i tak to poznáme. **Kontrola
ÚBYTEK řádků platí pro všechny stejně přísně.** (Migrace denní→měsíční 24. 7. znamenala jednorázový
propad 4679→223 řádků → smazal jsem GH cache `index-integrity-*`, aby se baseline založil znovu a
UBYLO nefalš-nezařvalo.) → paměť `eur-govt-bond-data-oprava`

**Engine: `combinePortfolio` dělá forward-fill řad na sjednocené ose.** Měsíční dluhopisová řada se
nese přes denní akciové dny (poslední známá hodnota). Bez toho engine dělal průnik dat a smíšené
portfolio (60/40 akcie+dluhopis) dávalo nesmysl (CAGR −0,5 %). **Nevracej to na „skip if missing".**
Čistě denní portfolia se chovají stejně jako dřív (ověřeno 13/13 invariantů backtest-validate).

**`/etf/[isin]` má `revalidate = 2592000` (30 dní), ne 1 den. Není to překlep.**
~4970 stránek dlouhého ocasu se regeneruje ISR na požádání; při 1denní expiraci je crawleři
(Seznam/Bing) přepisovali tak často, že jsme spotřebovali 75 % free-tier limitu Vercelu
(200k ISR Writes/měsíc → auto-pauza projektu). Nejdřív sníženo na 7 dní, pak (kvůli jistotě, že
projekt nespadne do pauzy do konce účtovacího cyklu) na 30 dní — měsíční interval regeneraci ocasu
prakticky zastaví. Fundamenty fondu se mění pomalu, měsíční cache je OK. Aktivní srovnávač jede přes
`/api/etf/screener`, tenhle interval se ho netýká. Po resetu cyklu lze vrátit na 7 dní. Nezkracuj bez důvodu.
Vedlejší páka: **méně častý deploy** (každý deploy invaliduje ISR cache → nárazová vlna writes).

**`/srovnani/[pair]` má `revalidate = 604800` (7 dní), ne 1 den. Není to překlep.** (25. 10. 2026)
Po vyprázdnění cache detailů se stal hlavním zdrojem ISR zápisů: roboti procházejí stovky dvojic denně (za 12 h 355
různých, 513 zápisů) a 1denní expirace je přepisovala každý den. Stránka ukazuje „Data k …“, takže starší cache je
poctivě označená. Majitel nechce omezovat Bing/Seznam (žádný firewall ani noindex navíc) – proto delší cache, ne blokace.

**Předgenerování detailů a dvojic: VŠECHNY detaily fondů a všechny odkazované dvojice se generují při BUILDU.** (31. 10. 2026)
Build tím trvá déle (lokálně ~4 min místo ~40 s, ~6 800 stránek) a `.next` má ~1,8 GB – **je to záměr, seznam
nezkracuj „kvůli rychlosti buildu“.** Proč: každé nasazení na Vercelu má vlastní prázdnou ISR cache; roboti pak znovu
prošli ~5 000 detailů a tisíce dvojic a každý render na požádání stál ~6–7 ISR zápisů + CPU Fluid → nasazení ≈ 40 000
zápisů (Hobby limit 200 000 / 30 dní) a 15–20 min CPU (limit 4 h). Pokus 31. 10. 2026 na zkušebním projektu: stránky
předgenerované přes `generateStaticParams` = **0 zápisů**, CPU buildu se do Fluid nepočítá. Placený plán, ořezání obsahu
ani noindex/firewall pro Bing/Seznam majitel nechce.
- Seznam počítá `src/lib/prerender.ts` TÝMIŽ funkcemi jako odkazy (`getPodobneFondy` + `odkazDvojiceDetailu`,
  `kanonikaDvojice`, `vyberFondProSymbol` v `src/lib/odkazyDvojic.ts`) – odkaz a seznam se nesmí rozejít. Dvojice, které
  by se přesměrovaly nebo vrátily 404, se nepředgenerovávají. Nový fond po buildu se vyrenderuje na požádání (`dynamicParams`).
- **Build při chybě DB nebo podezřele krátkém seznamu SPADNE** (< 4 000 detailů, < 1 000 dvojic, 3 pokusy). Záměr: tichý
  kratší seznam by vrátil render na požádání (a s ním zápisy a CPU) bez varování. Denní `check-fund-data.mjs` hlásí poplach,
  když fondů s detailem klesne pod 4 000; po buildu `node scripts/check-predgenerovani.mjs` (každý odkazovaný pár předgenerovaný).
- **Při buildu se velké sady načítají jednou za proces** (`jednouZaBuild`, `src/lib/buildMemo.ts`: třídy fondů, fondy trhů,
  kandidáti podobných fondů) – bez toho by build stáhl ~12 GB ze Supabase (naměřeno ~113 MB). Mimo build (runtime) se
  nepoužívá: paměť v teplé lambdě by držela stará data přes ISR přegenerování.
- **Při buildu jdou dotazy na Supabase mimo datovou cache Nextu** (`fetchProSupabase`, `_nextOriginalFetch` jako engine.ts).
  Jinak by build zapsal desítky tisíc položek do datové cache (na Vercelu přežívá nasazení) s nejasným dopadem na limit zápisů.
  ISR interval dává stránkám `revalidate` segmentu, ne fetch – stránky zůstávají ISR (detail 30 dní, dvojice 7 dní).
- Podobné fondy se řadí velikost ↓ a při shodě **ISIN ↑** (dřív náhodné pořadí z DB) – jinak by build a runtime mohly
  při shodné velikosti vybrat jiného „soupeře“. Jediný rozdíl proti dřívějším stránkám (1 z 438 porovnaných, DE000A4AT2X6).

**Riziko (σ, Sharpe, Sortino) se počítá z MĚSÍČNÍCH výnosů, ne denních.** `calculateSummary`
používá `resampleMonthEnd`. Není to nepřesnost — zdrojová denní data mají ojedinělé vadné ticky
na začátku měsíce (splice denního ETF a měsíčního zdroje; např. `ftse_all_world` 2008-10-01 =
23.09 mezi 29.39 a 27.40), které denní σ×√252 nafukovaly (All-World 13 % → 31 %). Month-end sampling
je zahodí. **Nevracet na denní „kvůli přesnosti"** — reintrodukuje to bug. Drawdown už jede stejně.
Od 17. 10. 2026 je engine při čtení vynechával (víkendy a 1. den v měsíci). **Opraveno 22. 10. 2026 (audit nástrojů, S9):**
úklid 18. 10. vadné body z DB odstranil a všech ~2 900 zbylých bodů 1. dne v měsíci sedí s Yahoo – plošné vynechání tak
zahazovalo SKUTEČNÁ data (60/40: dno 1. 3. 2023, max. pokles −20,5 % místo −20,7 %; start 1. v měsíci posunutý o den).
Dřívější tvrzení „vynechání i správného bodu je neškodné“ NEPLATILO. `bezVadnychTicku` teď v denních úsecích vynechává JEN
body v nepracovní dny všech burz zdrojových fondů (so, ne, 1. 1., 25. 12.). Odlehlé body podle velikosti výkyvu NEFILTROVAT:
skutečné dny (1. 4. 2020, 13. 11. 2008 EEM +13 %/−10 %) vypadají stejně. Čistotu DB hlídá check-fund-data (audit backtest).

## Data fondů a žebříčky (audit dat 17. 10. 2026)

**Stáří dat se měří `scraping_date`, nikdy `updated_at`.** `updated_at` přepisoval i upsert starých
dat z checkpointů → ~640 fondů s dubnovými čísly vypadalo čerstvě. Datum „Data k …" na webu, varování
na detailu i denní kontrola (`scripts/check-fund-data.mjs`) jedou ze `scraping_date`. Nepřepínat zpět.

**Žebříčky `/nejlepsi-etf/*` a panely na homepage vynechávají:** pákové/inverzní produkty, fondy bez
názvu a fondy, které scraper 14+ dní neaktualizoval (`CERSTVOST_DNI` v `etf-data.ts`). Srovnávač
vynechává fondy bez názvu a fondy s daty staršími 30 dní (typicky už nejsou v nabídce). Detail fondu
zůstává dostupný – se žlutým varováním „data z …". Když v žebříčku „chybí" známý fond, nejdřív
zkontroluj jeho `scraping_date`, ne filtr.

**Panel „Nejvýkonnější" na homepage = jen akciové fondy, výnos v Kč.** Dřív ho vedly komoditní ETC
(zemní plyn +194 %) hned nad „Kterým ETF začít". Vysoké výnosy akciových fondů (Korea ~+100 % za rok)
jsou skutečné – ověřeno proti justETF.
**Tabulka trhů na homepage (6 širokých trhů): záložka „Nejvyšší výnos“ ZŮSTÁVÁ** (majitel chtěl tři pohledy
TER / velikost / výkon), ale poctivě (revize kola 4, 18. 10. 2026): sloupec „Proti mediánu“ (výnos fondu −
medián trhu, p. b.) + věta, že fondy na stejný index se liší hlavně poplatkem a třídou. Rozdíly jsou 0,3–0,6 p. b.
– to je záměr ukázat, ne chyba. Neodstraňovat záložku ani nevracet název „Nejvýkonnější“ bez kontextu.
**„Nejlevnější fond“ = jedno pravidlo** (`porovnejNejlevnejsi` v src/lib/trhy.ts): čerstvá data, TER > 0,
velikost ≥ 100 mil. €, nejnižší TER → při shodě akumulační → při shodě větší fond. U S&P 500 proto SPYL (Acc)
před SPY5 (Dist), oba 0,03 %. Žebříčky mají převzít totéž.

**Zrušené žebříčky → 301:** `etf-zdarma-degiro` (rozhodnutí majitele: seznam „zdarma" nejde udržet
ověřený; přesměrování na recenzi DEGIRO, ta zůstává), duplicity `globalni`→`celosvetove`,
`clean-energy`→`obnovitelne-zdroje`, `nemovitostni`→`realitni`, `zlate`→`zlato`. Nevytvářet znovu.

**„Celosvětové ETF“ = celý svět VČETNĚ rozvíjejících se trhů, ne MSCI World (18. 10. 2026).** Žebříček
`nejlepsi-celosvetove-etf` bere jen FTSE All-World, MSCI ACWI (i IMI), FTSE Global All Cap a Amundi Prime
All Country World (Solactive GBS). Fondy na MSCI World (EUNL, XDWD…) do něj NEpatří – mají vlastní
`nejlepsi-msci-world-etf`. Dřív sem padalo vše se slovem „World/Global“ a „největším celosvětovým fondem“
byl EUNL. Indexové žebříčky (S&P 500, MSCI World, Nasdaq-100, celý svět) záměrně vynechávají varianty
s jinou metodikou (`INDEX_VARIANTY` v etf-data.ts: ESG/Screened/Leaders/Equal Weight/aktivní „Enhanced“,
Islamic…) – ty jsou v `nejlepsi-esg-etf`. Nasdaq = jen Nasdaq-100; S&P 500 bez Top 20/Capped/Covered Call.
Měnově zajištěné třídy v žebříčcích ZŮSTÁVAJÍ (počítají se do „N fondů“ i do počtu v rozcestníku), ale
tabulka je **ve výchozím stavu SKRÝVÁ** („17 z 24 fondů – bez 7 měnově zajištěných tříd“, přepínač zůstává)
– jinak by se v jednom sloupci míchaly výnosy v Kč s výnosy zajištěnými do jiné měny (revize kola 3, 18. 10.).
Nevyhrávají „Nejvýkonnější“. Hlídá `ZLATA_SADA` v check-fund-data.mjs.

**`filtrKategorie` (src/lib/etf-data.ts) je JEDINÁ definice „fond patří do žebříčku“** (revize 18. 10. 2026).
Používá ji žebříček, počet fondů, rozcestník /zebricky (`getCategorySouhrn` – 2 malé dotazy na žebříček,
po dávkách 8) i srovnávač. Dřív měl rozcestník vlastní JS zrcadlo (`odpovidaKategorii`) – nevracet.
Denní kontrola dál porovnává počet rozcestník × žebříček.

**Žebříček `nejlepsi-etf-2026` řadí podle VELIKOSTI fondu, ne podle `rating`** (18. 10. 2026). `rating` je
naše vlastní skóre ze scraperu (etf-astro/scraper/etf_rating.py) – „podle našeho hodnocení“ šlo proti
„jsme srovnávač, nedáváme doporučení“. Na rozcestníku se jmenuje „Největší fondy“. Titulek (SEO) zůstává.

**„Nejvýkonnější“ na stránce žebříčku = výnos za 3 roky v Kč** (za 1 rok jen když 3leté údaje mají méně
než 3 fondy). Roční momentum u indexových kategorií je šum (revize 18. 10. 2026). Nejnižší poplatek
ignoruje TER 0 % (u akcií/dluhopisů chyba zdroje, u Xetra-Gold apod. náklady mimo TER).
**U indexových žebříčků (S&P 500, MSCI World, Nasdaq-100, celý svět, DAX, STOXX 600, FTSE 100, zlato,
stříbro, bitcoin a od kola 7 i Emerging markets – `INDEXOVE` v nejlepsi-etf/[slug]/page.tsx) karta „Nejvýkonnější“ ZÁMĚRNĚ CHYBÍ** –
fondy mají stejný podklad, rozdíl 1–2 p. b. je šum tříd a poplatků. Místo ní neutrální „Jak vybrat mezi
fondy na stejný index“ (TER, velikost, Acc/Dist, kde koupit). Jinde karta ukazuje pravidlo výběru a medián;
práh velikosti karet je 100 mil. € a karty se počítají z CELÉ kategorie (`getVyberKarty`, kolo 6) – ne z 300 fondů
v tabulce.

**Index fondu na žebříčku („Co v kategorii je“) = `indexFonduLabel`** (stejná funkce jako srovnávač, odvozuje
i z názvu fondu – `index_name` je u ~3 000 fondů prázdný/useknutý). Hlídá check-fund-data: u indexových
žebříčků musí být index poznán u ≥ 80–90 % fondů.

**Detail fondu `/etf/[isin]` ukazuje graf JEN z dat fondu – žádný čárový graf podle indexu/proxy (18. 10. 2026).**
Rozhodnutí majitele: „je divné ukazovat graf indexu, a ne daného ETF“. Dřív měl SXR8 graf „Vývoj 10 000 Kč“
z řady SPY. Teď mají VŠECHNY fondy stejnou kostru: sloupce kalendářních výnosů fondu (Kč/EUR/USD), kumulativní
1R/3R/5R fondu v úvodu a „10 000 Kč před 1/3/5 lety → dnes“ spočtené z `return_*_czk` fondu – vše ke stejnému
dni (datumCen(scraping_date)). Časovou řadu cen fondu zatím nemáme; až bude (denní NAV fondu), lze čáru vrátit
z ní. Delší historie indexu patří do backtestu (odkaz „Delší historie indexu v backtestu“), kde je proxy popsaná.
**Nevracet graf z `index_historical_data` na detail.**

**Krátkodobé výnosy (1M/3M/6M) jsou v EUR** a tak jsou i popsané – data je v jiné měně nemají.

**Investiční kalkulačka úročí měsíčně sazbou (1 + r)^(1/12) − 1, ne r/12.** Zadaný „výnos p.a." je tak
skutečně roční (7 % → 100 000 Kč je po roce 107 000 Kč). Dřív r/12 = 7,23 % ročně a +3 % za 20 let.
U hypoteční a úvěrové kalkulačky je r/12 SPRÁVNĚ (u úvěrů je sazba p.a. nominální) – neměnit.
Totéž (efektivní měsíční sazba) platí pro /kolik-investovat-mesicne a /investovani-pro-deti.

**Backtest rebalancuje kalendářně jen POSLEDNÍ obchodní den období** (příští datum je v jiném měsíci/
čtvrtletí/roce). „Při odchylce nad X %" = váha kterékoli složky se odchýlí od cíle o víc než X
procentních bodů (absolutně). Dřív „měsíčně" rebalancovalo denně – nevracet.

**Kurzový dopad – historické scénáře jsou z kurzů ČNB:** 2017 (posílení koruny) je NEPŘÍZNIVÝ pro
investora v cizí měně, březen 2020 (oslabení koruny) PŘÍZNIVÝ. Dřív to bylo obráceně.

**Čistý plat:** zvýhodnění na děti se vyplácí jako daňový bonus (při mzdě ≥ ½ minimální mzdy);
pracující starobní důchodce platí 0,6 % sociálního (sleva 6,5 %). Sazby a limity aktualizovat k 1. 1.

## Obsah a distribuce

**`/buffettovo-portfolio` neexistuje — je tam 301 na `/backtest`.**
Článek je smazaný záměrně. Z Facebooku a Media míříme rovnou do nástroje s předvyplněným presetem,
ne na kopii nástroje v článku. **Nepsat ho znovu.** → paměť `backtest-nastroj-a-zive-cisla`

**Odkazy na sociální sítě jsou bez UTM.** Rozhodnutí majitele („je to zbytečné"); atribuce jede přes
`fbclid`, ověřeno v datech. Nepřidávej trackovací parametry. → paměť `distribuce-kanaly-lekce`

**Detaily fondů `/etf/` jsou v indexaci záměrně rozdělené** — hlava do Googlu, ocas jen Bing/Seznam.
Je to běžící experiment, ne chyba v sitemap. → paměť `experiment-index-detaily`

## Hranice, které nejsou technické

**Bez kritiky bank, bez témat úvěrů, hypoték a páky na dluh.** Autor je šéf spotřebitelských úvěrů
v České spořitelně. Není to opatrnost, je to jeho práce. → paměť `obsah-redakcni-hranice`

**Čísla ven se nikdy nevalidují jen proti vlastnímu nástroji** — to je kruh. Vždy nezávislý přepočet
+ externí benchmark. → paměť `proces-validace-externich-cisel`

## Článek „Jak dlouho v minusu“: doba v minusu = do POSLEDNÍHO měsíce pod vkladem (17. 10. 2026)

`/jak-dlouho-v-minusu`, `src/lib/clanky/podVodou.ts`. Některá čísla vypadají přehnaně (celý svět od 1/2000
po inflaci 23 let, přestože od 4/2020 byl nad vkladem) – je to ZÁMĚR, neměnit na „měkčí“ pravidlo.
Zkoušeli jsme dvě: „návrat, který vydržel rok“ (S&P 500 v USD od 2000 by se „vrátil“ 2006 a krize
2008–2011 by zmizela) a „krátké poklesy do roka nepočítat“ (celý svět od 2/2020 by po inflaci ukázal
6 měsíců, ačkoli v letech 2022–23 byl pod vkladem dalších 15 měsíců v několika úsecích). Každé měkké
pravidlo skutečný pokles schovalo. Místo toho: u čísel, kde investice byla ≥ 2 roky souvisle nad vkladem
a pak znovu spadla, je číslovaná poznámka (od kdy byla nad vkladem, kolik měsíců a jak hluboko pak spadla).

## „Celý svět“ ve stroji času = fond VT (index FTSE Global All Cap) od 7/2008, dřív aproximace 60/40 (17. 10. 2026)

`src/lib/strojCasuVypocet.ts` (`pozdeji`), `src/lib/strojCasu.ts`. Řada je NAPOJENÁ: do 6/2008 (kdy VT nebyl)
60 % S&P 500 + 40 % VGTSX, od 7/2008 měsíční výnosy skutečného indexu. Dřív byla celá řada 60/40 a „akcie
celého světa“ tím nadsazovala výnos o ~0,9 p. b. ročně (USA mají v indexu méně než 60 % po většinu historie).
Totéž u „Vyvážené 60/40“ (od 7/2008 60 % VT + 40 % AGG). Ověřeno: měsíční výnosy napojené řady od 7/2008 =
přímý backtest VT (rozdíl 1e-15). Starty před 7/2008 jsou aproximace – stránky to uvádějí v metodice.
Odkaz „Podrobně v backtestu“ používá složení platné pro zvolený rok (`slozeniProStart`).

## Články z dat: chybějící data = výjimka, ne prázdná stránka (17. 10. 2026)

`/stroj-casu`, `/sp500-nebo-cely-svet`, `/jak-dlouho-v-minusu`, `/pravidlo-4-procent` při chybě dat VYHODÍ
výjimku. Záměr: Next při ISR ponechá poslední dobrou verzi (jinak by den visela hláška „nepodařilo se
načíst“). Při buildu bez dat build selže – to je správně (raději nenasadit). Homepage blok s číslem se
naopak jen skryje, když jsou data starší 7 dní.

## „Největší český průvodce ETF fondy“ zůstává (rozhodnutí majitele 18. 10. 2026)

Ve strukturovaných datech (src/components/SEO/AuthorSchema.tsx – description a slogan) je tvrzení
„Největší český průvodce ETF fondy“. Expertní posudek ho označil za nedoložitelné; majitel rozhodl,
že **zůstává**. Neodstraňovat. Počet fondů v textu musí odpovídat realitě (dřív „4300+“, pak „více než 5 000“, „přibližně 5 000“; od 20. 10. 2026 dynamicky „více než N“ z getETFCountLabel – stejná funkce jako titulek homepage, /o-nas a /llms.txt, viz getTotalETFCount).

## Homepage = srovnávač, ne investiční web (rozhodnutí majitele 18. 10. 2026)

Na homepage nepatří simulace „kolik by z toho bylo za X let“ (dřív hero box „5 000 Kč měsíčně od 2010
→ 2,9 mil. Kč“) ani dlaždice „Jak si vedou trhy“. **Výkon modelových portfolií (12 měs. v Kč, 3 roky) na homepage
ZŮSTÁVÁ** – majitel 18. 10. 2026: „když jsi u modelových portfolií dal pryč performance, úplně to ztratilo šťávu“. Simulace patří do nástrojů
(/stroj-casu, /backtest). Kontrola čísla stroje času proto hlídá /stroj-casu, ne homepage.

## Ověřené „podivné“ hodnoty (18. 10. 2026) – nejsou to chyby

- **Volatilita korejských ETF ~58 %** (FLXK, LKOR, IQQK, CEBJ, DBX8, H4Z9; výnos 1R +87–94 %): skutečnost.
  Nezávisle z denních cen Yahoo za 1 rok: EWY (USD) 58,1 %, CSKR.L 51,2 %. Neopravovat.
- **Xetra-Gold (4GLD) letos −0,75 % v EUR, ale SGLN/SGLD +1,18 %:** obojí sedí. Xetra 31. 12. neobchoduje,
  takže letošní výnos 4GLD se počítá od 30. 12. 2025. Zlato 31. 12. spadlo o 1,3 % (IGLN.L 84,75 → 83,65 USD).
  Yahoo 4GLD.DE od 30. 12.: −0,78 %. SGLN v USD −3,15 %, přepočteno do EUR (EUR/USD 1,1747 → 1,1242) +1,2 %.
  Rozdíl je jen den, od kterého se letošní výnos počítá. Výnos za 1R je u obou stejný (+1,49 / +1,37 %).

## Detail fondu: sektory, složení, komodity (revize kola 4, 18. 10. 2026)

- **Sektory jsou v klasifikaci zdroje dat (pravděpodobně FactSet RBICS, úroveň Economy) – NE TRBC ani GICS. Čísla sedí,
  jen se nedají srovnávat s GICS.** (Přepsáno v kole 5, 19. 10. 2026 – dřív tu stálo „TRBC“, to neplatí: zdroj má sektory
  „Business Services“, „Non-Energy Materials“, „Consumer Services“, „Finance“, které TRBC nemá – TRBC má Financials,
  Basic Materials.) Profil SXR8 u zdroje („as of 31/08/2026“) uvádí přesně Technology 45,23 %, Finance 13,62 %,
  Healthcare 9,09 %, **Consumer Non-Cyclicals 8,88 %**, Other 23,18 % – shodné s DB i webem. GICS (emitent indexu) má
  u S&P 500 Consumer Staples ~5 % – rozdíl je klasifikací, ne chybou. Proto překlad **„Necyklická spotřeba“ / „Cyklická
  spotřeba“** (src/lib/preklady.ts), ne „Spotřeba (základní)“, které svádělo ke srovnání s GICS Staples. U sekce
  sektorů (detail, porovnání, kategorie) je věta „podle klasifikace zdroje dat, ne GICS“ – zdroj nejmenujeme.
  12 sektorů zdroje: Technology, Finance, Healthcare, Consumer Non-Cyclicals, Industrials, Energy, Consumer Cyclicals,
  Non-Energy Materials, Consumer Services, Utilities, Business Services, Telecommunication(s). Kontrola: check-fund-data
  (název sektoru v DB bez českého překladu = varování).
- **Složení fondu má datum `holdings_as_of`, ne den výnosů ani stažení** (kolo 7, 22. 10. 2026; dřív tu stálo „nemá datum“ –
  sloupec scraper plní od 20. 10. 2026). Detail fondu: „Složení k 31. 8. 2026 – poslední zveřejnění emitenta“; žebříčky
  (infografika složení největšího fondu) a /sp500-nebo-cely-svet totéž. Je to obvykle konec měsíce 1–2 měsíce zpět – ZÁMĚR,
  nepřepisovat na den dat. Chybí-li datum, stránka napíše „Datum složení neznáme“ (nikdy den stažení – /sp500-nebo-cely-svet
  psal „Složení fondů k 22. 10. 2026“, zdroj uvádí 31. 8.). Hlídá check-fund-data (kolo6 data + kolo7 data).
- **Komodity a krypto: „Nevyplácí (komodita)“, i když zdroj píše „Accumulating“** (`src/lib/dividendyFondu.ts`). Jen
  akumulační třídy; distribuční komoditní fondy (Enhanced Commodity – úroky z pokladničních poukázek, Gold+ Yield –
  opce) ukazují, co uvádí zdroj. Fondy těžařů (miners) nejsou komodita. Hlídá `check-fund-data.mjs`.
- **„Sleduje: Spotová cena zlata v USD“ místo indexu** u produktů, kde zdroj index nemá (364 komodit/krypta) – doslovně
  z první věty `description_en` („tracks the spot price of gold in US Dollar“). „LBMA“ v popisu není, proto ho nepíšeme.
  Neznámá formulace = „—“.
- **Cena/NAV fondu se na detailu neukazuje:** `current_price` je vyplněná jen u části fondů a naposledy z 14. 6. 2025
  (`last_price_update`) – zastaralá, raději nic.

## Google signals vypnuté (rozhodnutí majitele 18. 10. 2026)

GA4 má Google signals i reklamní personalizaci vypnuté v administraci i v kódu (GoogleAnalytics.tsx).
Nezapínat – web nesmí používat nástroje vyžadující souhlas. Chování návštěvníků měří vlastní měření bez cookies
(web_events, scripts/chovani-report.mjs).

## Hypoteční a úvěrová kalkulačka zůstávají (rozhodnutí majitele 18. 10. 2026)

/kalkulacky nabízí i hypoteční a úvěrovou kalkulačku a v úvodu zmiňuje mzdy, hypotéky a úvěry. Je to v pořádku,
nemazat. Redakční hranice „bez témat úvěrů“ se týká obsahu (články, doporučení, páka na dluh), ne těchto nástrojů.

## Srovnávač: region, index a kategorie (revize 18. 10. 2026)

**Region = jen `investment_focus`** (`src/utils/regionClassification.ts`), hrubý sloupec `region` se nepoužívá
(Korea v něm byla „Evropa“). Komodity, drahé kovy a krypto **nemají region** (ve filtru jen pod „Všechny regiony“) –
záměr. EUR firemní dluhopisy jsou „Celosvětově“, protože tak je vede justETF („Bonds, EUR, World, Corporate“ =
emitenti z celého světa) – NEpřeřazovat do Evropy. Kontrola: `check-fund-data.mjs` (region vs. název fondu).

**Index fondu se bere z `index_name` jen tehdy, když jím název fondu KONČÍ** (`src/utils/indexNormalization.ts`).
`index_name` je ve zdroji jen začátek indexu („S&P 500“ mají i fondy na VIX futures, Buffer, Top 20…) a bývá
useknutý na „.“/„+“ („Bloomberg 10“ = tři různé „10+ Year“ indexy). Fondy, kde to nejde ověřit, jsou v nabídce
bez indexu – proto „S&P 500“ ukazuje ~75 fondů, ne 119. Nabídka = jen indexy známých poskytovatelů s ≥ 2 fondy.
„Celé trhy“ v nabídce = ruční seznam `src/data/trhyDvojcata.ts` (stejný jako homepage, bez zajištěných tříd).

**Záložka „Peněžní trh“**: fondy s `investment_focus` „Money Market“ má zdroj pod Akcie/Dluhopisy; srovnávač je
přeřazuje (jen ve srovnávači, žebříčky to neovlivňuje).

**Výnosy v Kč/USD bez fallbacku na EUR i v `pickReturn`** (`currency.ts`): chybí-li přepočet, je „—“. Krátká
období 1M/3M/6M jsou na porovnání v samostatné sekci „v EUR“.
- **Ropné ETC +137 % za rok (WisdomTree Brent JE00B78CGV99, 18. 10. 2026):** skutečnost. Burzovní cena BRNT.MI
  (EUR) 16. 10. 2025 → 16. 10. 2026: 39,96 → 94,03 = +135,3 % (Yahoo). Spotová Brent jen +79,9 % v USD – rozdíl
  dělá výnos z rolování futures v backwardaci (ETC sleduje total-return futures index). Neopravovat.
- **Portfolio 60/40 (stroj času a rychlá volba kalkulačky = 60 % VT + 40 % AGG v USD) má největší propad v Kč −18,2 %
  v letech 2015–16, ne v roce 2008 (18. 10. 2026):** skutečnost. Nezávislý přepočet (Yahoo adj. close VT + AGG, denní kurzy
  USD/CZK z ročních lístků ČNB, roční rebalancing od 7/2008): −18,2 %, vrchol 15. 4. 2015 → dno 11. 2. 2016. V letech
  2008–09 propad akcií v Kč tlumilo oslabení koruny (USD/CZK ~14,5 → ~22). Neopravovat. (Modelové portfolio 60/40 a preset
  „60/40“ v backtestu mají od kola 5 dluhopisy eurozóny – viz níže, max. pokles −20,5 % v letech 2021–23.)

## Brokeři: „—“ a „od“ v nákladech jsou záměr (revize 18. 10. 2026)

**Fio – směna „—“, součet „od“:** Fio směnu zvlášť neúčtuje, náklad je v kurzu banky a ceník jeho výši neuvádí.
**IBKR – součet „od“:** k provizi (Tiered, 0,05 %, min. 1,25 EUR) se připočítávají poplatky burzy a vypořádání;
oficiální stránka poplatků Xetry (interactivebrokers.ie/.co.uk, IBIS-StkFees) vrací robotům 403, číslo tedy nemáme
ověřené z primárního zdroje → nezapočítáváme a ukazujeme spodní hranici. **Trading 212 – daň z CZ dividend „—“:**
neověřeno, zda T212 české akcie nabízí. **DEGIRO – roční poplatek za připojení k burze** (nejvýš 0,25 % hodnoty účtu,
max. 2,5 EUR): „za rok“ na /kde-koupit (kolo 5) ukazuje ETF Selection BEZ něj (výjimka ověřená v PDF, viz níže)
a ostatní ETF jako „12 × 3 EUR + až 2,5 EUR za burzu“ – horní mez, ne odhad (přesná výše závisí na hodnotě účtu).
**IBKR – „za rok“ se směnou JEDNOU** (celá roční částka najednou, min. 2 USD), protože text u IBKR říká, že směnu
stačí udělat jednou; „za nákup“ dál počítá směnu při každém nákupu. Nevymýšlet odhady, dokud nejsou ověřené
u oficiálního ceníku. Shodu poplatku a směny mezi /kde-koupit, /srovnani-brokeru
a recenzemi hlídá denní kontrola (`check-fund-data.mjs`).

**Audit nákladů 22. 10. 2026 – co se změnilo (a vypadá to divně):**
- **IBKR směna = levnější ze dvou cest** (commissions-spot-currencies): automatická konverze při nákupu „typically
  0.03%“ v kurzu BEZ minima, nebo ruční 0,002 % s min. 2 USD. Za nákup i za rok se bere levnější (rok: automatická
  u každého nákupu, nebo jedna ruční směna celé roční částky). Proto je u malých částek „za rok“ = 12 × „za nákup“
  (dřív kontrola hlásila chybu) – správně. Za 2 000 Kč „od 32 Kč“ (dřív „od 74 Kč“, nebyla spodní hranice).
- **IBKR vypořádání a regulační poplatek se započítávají** (Xetra (IBIS) Fees je od 22. 10. 2026 dostupná): 0,02 EUR
  + 0,0008 % a 0,01 EUR za obchod. Poplatek burzy Xetra u ETF (0,004 %, min. 0,50 EUR) se NEzapočítává – IBKR ho
  u retailových pokynů směrovaných podle best execution neúčtuje → součet zůstává „od“. Výše nahoře (odstavec o 403) neplatí.
- **DEGIRO ETF Selection = ETF kótovaná na burze Tradegate** (Přehled poplatků, str. 4, pozn. 1), ne nákup na Xetře.
  Na Xetře stojí nákup 3 EUR + připojení k burze. Na stránkách „Nákup ETF (Tradegate)“ u DEGIRO je záměr.
- **DEGIRO „+ až 2,5 EUR ročně za CNX“ u ETF Selection i ostatních ETF** (str. 10, pozn. 2: poplatek „bude rovněž
  účtován za připojení k CNX, burze používané pro směnu měn“). Výjimku pro bezplatnou směnu CZK/EUR ceník neuvádí →
  ukazujeme jako horní mez vedle ročního součtu (data-za-rok ho NEobsahuje). Neodstraňovat, dokud DEGIRO písemně
  nepotvrdí, že se u CZK/EUR neúčtuje (pak opravit + tento bod).
- **„Nejlevnější do 16 176 Kč / od 16 177 Kč“** – hranice na celé koruny půlením na vzorcích (`nejlevnejsiPodleCastky`),
  ne krokem 100 Kč; mění se s kurzem ČNB (1 EUR / 0,15 %).
- **DEGIRO a Fio „jen celé kusy“** bez ceny kusu: cenu kusu v databázi nemáme (`etf_funds.current_price` = 0) → jen
  věta, žádné číslo.
Hlídá blok „audit naklady“ v `check-fund-data.mjs` (nezávislý vzorec z ceníků + XTB: novější tabulka poplatků → poplach).
- **Stejný výnos v Kč na 4 desetinná místa u různých tříd/fondů (SXR8 = IUSA = VUSA 1R 21,7501 %; VWCE = VWRL),
  18. 10. 2026:** není chyba. Zdroj (justETF) dává výnos v EUR na 2 desetinná místa a ty jsou u fondů na stejný
  index se stejným TER shodné (21,70 %); Kč se počítá z EUR stejným kurzem ČNB → shodný výsledek. VUAA (21,59 %) se liší.
- **Velikost fondu 0 (např. IE000C75IMX8):** zdroj uvádí „EUR 0m“ = fond pod 0,5 mil. € (nový/malý). Pravdivé.
- **MSCI World Value +49–50 % za rok (IE00BP3QZB59, IE00BL25JM42; 18. 10. 2026):** skutečnost – burzovní ceny
  IS3S.DE +49,1 %, XDEV.DE +50,0 % (EUR, 16. 10. 2025 → 16. 10. 2026) proti IWDA.AS +20,0 %. Neopravovat.
- **iShares MSCI USA Screened (IE00BFNM3G45) a USA CTB Enhanced ESG (IE00BHZPJ890) mají skoro stejnou velikost
  (16 794 / 16 777 mil. €) a stejně 466 pozic:** tak to uvádí i zdroj (justETF, ověřeno 18. 10. 2026); výnosy se liší
  (20,93 / 19,36 %). Data odpovídají zdroji.

## Backtest, kalkulačka a modelová portfolia – kolo 3 revize (18. 10. 2026)

- **„Celý svět“ = fond VT od 6/2008 ve všech nástrojích.** Preset `global-since-2000` (60 % S&P 500 + 40 % svět mimo USA)
  se jmenuje „USA + zbytek světa“, nový preset `cely-svet` = 100 % `ftse_all_world`. Kalkulačka („A jak by to dopadlo
  doopravdy?“, `src/lib/kalkulackaSkutecnost.ts`) při startu před 7/2008 počítá a pojmenuje „USA + zbytek světa“.
  Rychlá volba „Celý svět“ v kalkulačce je napojená řada stroje času (viz výše) – vysvětleno v tooltipu. Neslučovat.
- **„Vaše vklady se zhodnocovaly X % ročně“ (XIRR) ≠ roční zhodnocení (CAGR).** Obojí je správně: CAGR je časově vážený
  výnos portfolia, XIRR výnos peněžních toků (srovnatelný s kalkulačkou). S&P 500 od 1/2005 + 5 000 Kč měsíčně: CAGR 10,6 %,
  XIRR 12,9 % – ověřeno nezávisle (Yahoo SPY × ČNB: 12,90 %). `src/lib/backtest/zhodnoceniVkladu.ts`.
- **Odkaz z modelového portfolia do backtestu nese `do=` (konec dat předpočtu) a explicitní `slozeni=`.** Ne chyba – jinak
  ISR stránka a živý backtest počítají do jiného dne. Kontrola `check-fund-data.mjs` (data-kontrola-backtest).
- **Start z presetu/odkazu se posouvá tiše („data od 7/2002“), varování jen u data zadaného uživatelem.**
- **Kolísavost na detailu portfolia = ukazatel backtestu (z měsíčních výnosů)**, ne směrodatná odchylka ročních výnosů.
- **Svět + malé firmy: vyspělé trhy mimo USA = `msci_eafe`** (dřív `world_ex_us` včetně EM → EM dvakrát). Dopad 11,99 → 12,01 %.
- **DEGIRO: směna CZK↔EUR zdarma a poplatek za burzu (ověřeno 18. 10. 2026):** oficiální „Přehled poplatků“
  (degiro.cz/data/pdf/cs/Prehled_poplatku.pdf, Rates from 01-01-2026), str. 8: AutoFX 0,25 %, pozn. 2 „Veškeré
  převody mezi EUR a CZK jsou zdarma“. Str. 10: 2,50 € ročně za každou zahraniční burzu (max. 0,25 % hodnoty účtu),
  pozn. 1 „není aplikován na … Pražské burze a ETF Selection“. Webová stránka degiro.cz/poplatky (datum 01-10-2025)
  výjimku CZK/EUR neuvádí – je starší; platí PDF. Neopravovat na 0,25 %.
- **„—“ u kolísavosti/poklesu tříd téhož fondu, které spolu nesedí (19. 10. 2026):** záměr (pravidlo č. 1). Zdroj má
  u některých tříd chybné riziko (SPSA 21,1 % vs SPYI 10,4 %; VGWE 10,8 % vs VHYL 8,1 %) – nezávisle z denních cen
  Yahoo: SPYI.DE i SPSA.DE ~10–12 %, VHYL/VGWE 8–9,5 %. Která třída je špatně, ze zdroje nepoznáme → „—“ (src/lib/tridyFondu.ts,
  srovnávač, porovnání i detail fondu). Kontrola: check-fund-data (VAROVÁNÍ „volatilita tříd téhož fondu se liší“).


## Modelová portfolia: čím se počítá historie (kolo 5, 19. 10. 2026)

Historie (CAGR, max. pokles v Kč) se počítá z řad manifestu `src/lib/backtest/indexes.ts`; kde fond ve složení řadu nemá,
je náhrada **viditelně u čísla** („≈ Historie počítá …“, `nahrada` v `PORTFOLIO_BACKTEST`, portfolioData.ts) – ne jen v tooltipu.
Kde by náhrada byla jiné portfolio, historie **chybí („—“)**. Hlídá `check-fund-data.mjs` (data-kontrola-backtest:
viditelná věta u náhrad, žádný `us_aggregate_bond`, Dividendové bez backtestu).

| Portfolio | Náhrada v historii | Proč |
|---|---|---|
| Permanentní, All Weather | žádná (US státní dluhopisy, zlato, komodity = fondy ve složení jsou také USD) | – |
| 60/40 | **žádná** (od 19. 10. 2026) – dluhopisy ve složení = Xtrackers II Eurozone Government Bond 1C (LU0290355717, XGLE) = přímo zdroj dat `eur_govt_bond` | dřív složení iShares Core Global Aggregate EUR Hedged (IE00BDBRDM35, od 2017) a historie jiný fond; ještě dřív AGG v USD |
| Nobelovo | nemovitosti = `ftse_europe` (evropské akcie); dluhopisy = přímo fond ve složení (LU0290355717) | dlouhá řada nemovitostních fondů v datech není |
| Akciové | nemovitosti = `ftse_europe` | totéž |
| Svět + malé firmy | malé hodnotové firmy = `us_small_cap` (Russell 2000), vyspělé mimo USA = `msci_eafe` | globální small-cap value řada v datech není |
| Dividendové | **bez historie („—“)** | dřív 95 % celý svět = historie celosvětových akcií, ne dividendového portfolia; S&P Global Dividend Aristocrats v manifestu není (`us_dividend` = VYM, jiný index) |

**Start všech = 26. 6. 2008** (první den dat VT, `ftse_all_world`). Stejný start má preset v backtestu („data od 6/2008“),
dřív karty „od 7/2008“ vs. backtest „od 6/2008“ (60/40 8,9 × 8,7 %). Nezávislé ověření 19. 10. 2026 (Yahoo adj. close × denní
kurzy ČNB, roční rebalancing, 26. 6. 2008 → 16. 10. 2026, skript mimo kód webu) proti webu: Permanentní 7,95 × 8,00 %
(max. pokles −20,3 × −20,1 %), All Weather 7,48 × 7,56 % (−21,5 × −21,3), Nobelovo 8,25 × 8,25 % (−22,7 × −22,2),
60/40 7,65 × 7,65 % (−20,7 × −20,5), Akciové 10,19 × 10,19 % (−33,3 × −33,3), Svět + malé firmy 11,79 × 11,78 % (−33,3 × −33,3),
100 % VT 10,82 × 10,81 % (−32,1 × −32,1). Rozdíly = kurzy ČNB vs. ECB a den rebalancingu.
Karty se řadí podle max. poklesu (od nejmělčího), portfolio bez historie na konci.

**Kalkulačka: rychlá volba „60/40“ a „doopravdy“ zůstávají 60 % VT + 40 % AGG** (řada stroje času, `strojCasuVypocet.ts`) –
odkaz do backtestu proto nese explicitní `slozeni=`, ne preset „60/40“ (ten má od kola 5 dluhopisy eurozóny). Neslučovat bez
úpravy stroje času.

**Backtest – „Největší propady“ se dvěma stejnými čísly NEJSOU duplicita.** 70 % celý svět + 30 % EUR dluhopisy od 2008:
−19,93 % (9/2008 → 11/2008) a −19,93 % (11/2021 → 4/2023), resp. bez vkladů −19,93/−19,82 a −18,73/−18,70 (2015–16 × 2020) –
různé epizody (ověřeno z API na plnou přesnost 19. 10. 2026). Tabulka při shodě na 1 desetinné místo ukazuje setiny a pod ní větu.

## Skóre brokerů zrušeno na celém webu (rozhodnutí majitele 19. 10. 2026)

Redakční skóre brokerů (0–100) se nikde neukazuje – stejně jako dřív hodnocení fondů působilo jako doporučení.
Brokeři se řadí **abecedně** (neutrálně; řazení podle nákladů by zvýhodnilo jednu částku), robo-poradce Portu je dál
zvlášť. Kalkulačka na /kde-koupit řadí podle nákladů PRO ZADANOU ČÁSTKU – to je fakt, ne pořadí. Sekce #metodika na
/kde-koupit je „Jak srovnáváme“ (stejné údaje pro všechny, bez bodování); kotvu #metodika zachovat, odkazuje na ni homepage.
Bez JSON-LD Review/aggregateRating s číslem. Pole `rating` z dat brokerů odstraněno. Skóre nevracet. Denní kontrola (scripts/check-fund-data.mjs, blok kolo5 C) hlídá „Skóre“ a „/100“ na
/srovnani-brokeru, /kde-koupit, /recenze/xtb a homepage.

## Zdroj dat fondů se uvádí v patičce detailu fondu a porovnání (rozhodnutí majitele 19. 10. 2026)

„Data fondu: justETF“ se v patičce detailu fondu (/etf/…) a stránek porovnání (/srovnani/…) UVÁDÍ. Nejmenuje se
jen na homepage. Neodstraňovat z detailu ani porovnání, nepřidávat na homepage.

## Brokeři: ověřené údaje, které vypadají divně (19. 10. 2026)

- **XTB – cenné papíry při krachu „Vracejí se vám“, náhrada max. 20 100 EUR jen za chybějící.** Polský systém KDPW:
  100 % do 3 000 EUR, nad to 90 %, chráněná částka do 22 000 EUR → výplata max. 20 100 EUR, společně pro hotovost
  i cenné papíry (XTB PDF „Informácie o systéme ochrany investícií“, čl. 2.2 a 2.4; xtb.com/pl/ochrona-srodkow-klientow-kb).
  Cenné papíry vede XTB odděleně (CZ VOP čl. 4.36). Frakce vlastní právně XTB ve svěřenské správě (VOP čl. 7.70) – zda je
  kryje systém náhrad, dokumenty neuvádějí, proto to netvrdíme. Dřív „Cenné papíry při krachu: 20 100 EUR“ se četlo
  jako „chráněné jen do 20 100 EUR“.
- **Trading 212 – směna 0,15 % BEZ „o víkendu 0,5 %“.** Víkendovou přirážku se nepodařilo doložit oficiálním zdrojem
  (trading212.com blokuje stažení ochranou proti botům), Wise (zdroje ověřeny 15. 7. 2026) uvádí, že se o víkendu nemění;
  0,5 % je sazba CFD účtu. Nevracet bez oficiálního zdroje.
- **DEGIRO – česká podpora „Ne“, i když má český web.** degiro.cz/helpdesk/contact: „our Service Desk is not available
  in Czech“. Na webu proto „web česky, podpora jen anglicky“.
- **DEGIRO u konkrétního fondu (/kde-koupit?isin=…) ukazuje dvě sazby** (ETF Selection 1 EUR / mimo 3 EUR) a nemá
  štítek „nejlevnější“: seznam ETF Selection ověřený nemáme. Neopravovat na jednu sazbu. (22. 10. 2026: ETF Selection =
  ETF kótovaná na Tradegate; naše data burz fondu Tradegate nemají spolehlivě, proto dál dvě sazby.)
- **Trading 212 – ceník ověřen 22. 10. 2026 v centru nápovědy** (helpcentre.trading212.com, články 11471996799517 a
  360018909758: „FX fee: 0.15%, Trading commission: Free“; „spot exchange rate + 0.15% FX fee“). trading212.com/terms
  dál blokuje stažení.

## Backtest, předpočty a kvíz – kolo 5 A (19. 10. 2026)

- **Kurz pro přepočet smí být nejvýš 4 kalendářní dny starý** (`MAX_STARI_KURZU_DNI`, `src/lib/backtest/engine.ts`). Bod indexu
  bez takového kurzu se vynechá – simulace pak poctivě končí posledním dnem s kurzem a stránky ukazují „Data k …“ z posledního
  bodu. 4 dny = nejdelší běžná mezera v celé historii od 2000 (Velikonoční pondělí, 26. 12. po víkendu), ověřeno proti všem
  indexům. **Nezvyšovat „aby to prošlo“** – dřív se poslední týden přepočítával 9 dní starým kurzem. Osa portfolia končí koncem
  NEJKRATŠÍ denní řady (forward-fill nese jen měsíční řady, ne useknutý konec denní).
- **Historie indexů a kurzů se čte mimo datovou cache Nextu** (`fetch._nextOriginalFetch` v engine.ts). Záměr: datová cache
  přežívá nasazení a kurzy s indexy v ní stárly nezávisle (předpočet 18. 10. = kurzy do 9. 10., indexy do 16. 10.). Stránky
  zůstávají ISR (revalidate 1 den) – `no-store` ani kratší revalidate NEPOUŽÍVAT (dynamické stránky / víc ISR zápisů na free
  tieru). Zastaralost hlídá `check-fund-data.mjs` (kolo5 A).
- **Složky s vahou 0 % se do výpočtu neposílají a engine je vynechá** – výsledek = portfolio bez nich (dřív „0 Kč, −100 %“).
- **60/40 a Nobelovo: dluhopisy = Xtrackers II Eurozone Government Bond 1C (LU0290355717)**, ne iShares Core € Govt Bond
  (IE00B4WXJJ64), přestože ho navrhovala revize: LU0290355717 je PŘESNĚ zdroj dat `eur_govt_bond` (XGLE.DE, `sourceIsin`), je
  akumulační, TER 0,07 % (ověřeno v `etf_funds` 19. 10. 2026). IE00B4WXJJ64 je jiný (distribuční) fond na podobný index.
  Backtest u třídy „EUR vládní dluhopisy“ nabízí ke koupi tentýž fond (`proxyEtf` v manifestu). Homepage, detail i backtest
  tak počítají totéž. Akcie zůstávají VWCE ve složení × VT v historii (jako u všech portfolií – „celý svět“ = VT).
- **Kvíz /vyber-etf: max. propad u každého výsledku je z indexu manifestu, ne z ukázkového fondu.** Technologie a ESG řadu
  v datech nemají → propad neuvádíme a viditelně ukazujeme „pro srovnání“ S&P 500 / celý svět. Dividendové = americké
  dividendové akcie (VYM), pojmenované v textu. Příklad fondu se vybírá podle odpovědi Acc/Dist („Nevím“ = Acc).

## Poplach „výnos 12 m mimo svůj trh“ po velkém odpoledním pohybu v USA (19. 10. 2026)

- **Fondy na stejný index se mohou dočasně lišit o 1–2 p. b. za 12 měsíců, i když jsou data správně.** Emitenti oceňují
  fondy v různou denní dobu: iShares/Invesco (SXRV, EQQQ) mají v řadě zdroje hodnotu po zavření USA, Xtrackers/Amundi/UBS
  (XNAS, LYMS, EQQX, BCFP) hodnotu blízko evropského zavření. 16. 10. 2026 Nasdaq odpoledne v USA padl → SXRV −2,9 %
  za den, XNAS −1,75 % (ověřeno: justETF chart API a Xetra závěry z Yahoo 19. 10.). Rozdíl se srovná během dní.
  Čísla na webu NEUPRAVOVAT; poplach je v tomto případě vysvětlený. Jiná situace je předběžný poslední bod u JEDNOHO
  fondu (smíšená řada) – tu hlídá kontrola „Výnosy za období nesedí s burzovními cenami“ (kolo5 C).

## Scraper: spouštění z Supabase pg_cron, jen pracovní dny ráno (20. 10. 2026)

- **Hlavní spouštění = Supabase pg_cron: `scraper-spusteni` út–pá `0 5 * * 2-5` UTC a `scraper-spusteni-pondeli`
  po `0 5 * * 1` UTC (7:00 SELČ / 6:00 SEČ, hotovo ~9:40 UTC)**. Do 31. 10. 2026 út–pá `30 1 * * 2-5` (hotovo před otevřením
  Xetry) – ZMĚNĚNO rozhodnutím majitele 31. 10. 2026: justETF přepisuje bod D na konečný až ~04:00 UTC v D+2, takže fondy
  stažené před 4. hodinou měly výnosy z předběžné ceny (30. 10.: ~2 370 fondů, VWCE YTD 19,03 místo 19,13 %, SPGP −1,4 %).
  Otevření Xetry nevadí – scraper poslední (rozpracovaný) bod řady vždy vynechává. Pojistka i ve scraperu (etf-astro PR #3:
  před 05:00 UTC mez 3 prac. dny, jinak 2) a kontrola „kolo6b (b2)“ v check-fund-data.mjs. Spouštění přes
  GitHub API spustí workflow `scrape.yml` (workflow_dispatch). Token = fine-grained PAT jen pro etf-astro, Actions: write,
  ve Vault jako `github_scraper_dispatch`, **platnost 1 rok (do ~20. 10. 2027) – včas obnovit**. GitHub plán v scrape.yml je
  jen ZÁLOHA (`23 8 * * 1-5`, job `hlidac` ji přeskočí, když ten den už běh proběhl/běží).
- **Proč ne GitHub cron:** plánované běhy zdržuje o 4–7 h (00:37 UTC startovalo ~05:10 UTC). **Proč ne večer (22:00):**
  zdroj má za daný den večer předběžnou cenu – výnosy za období by byly ze smíšené řady. **Proč ne o víkendu:** ceny se
  nemění a víkendový scrape 18. 10. stáhl předběžný bod pátku (SXR8 letos +18,64 % místo +17,69 %). Víkend bez scrapu
  je záměr – data „k pátku“ s datem jsou správně. ⚠️ OPRAVA 21. 10. 2026: předpoklad „hodnota všedního dne se po večeru nemění“
  NEPLATÍ – zdroj přepisuje bod dne D předběžné → konečné během dne D+1 (SXR8 19. 10.: 743,07 do 20. 10. 05:25 UTC,
  pak 739,32). Čas startu to neřeší → scraper počítá výnosy za období z denní řady zdroje a končí posledním JISTĚ
  konečným dnem (≥ 2 pracovní dny před stažením, ne poslední bod řady), per-fund `returns_as_of`.
- Hlídá `check-fund-data.mjs` (v pracovní den po 13:00 UTC musí být ≥ 80 % fondů stažených za 16 h) a kontrola výnosů
  za období proti denním cenám (kolo5 C).

## Žebříčky: „Nejvýkonnější“ na širokých smíšených stránkách a čistá energie (kolo 6, 20. 10. 2026)

- **Na širokých smíšených žebříčcích (Nejlepší ETF 2026, akciové, dluhopisové) karta „Nejvýkonnější“ ZÁMĚRNĚ CHYBÍ.**
  Vyhrávaly úzké sektorové/specializované sázky (polovodiče +228 %, konvertibilní dluhopisy +45 %) – čísla jsou podle
  zdroje skutečná, ale první velké zelené číslo pro začátečníka působilo jako tip (jsme srovnávač, ne poradce). Stejný
  princip jako `INDEXOVE`. Místo karty neutrální výběr podle faktů (největší, nejlevnější). Rozhodnutí CEO z pověření
  majitele („jeď autonomně“).
- **Energetický žebříček = tradiční energetický sektor (ropa, plyn, energetické firmy). Čistá/obnovitelná energie
  (IQQH, Q8Y0, LYM9, NRJC, RENW, S0LR, G1CE, STOR, WDNR …) patří do žebříčku obnovitelných zdrojů**, ne sem – dřív se
  míchaly dva různé světy v mediánu i kartách.

## Složení fondů: součet sektorů/zemí přes 100 % je u zdroje (kolo 6, 20. 10. 2026)

- **iShares USD Treasury Bond 0-1yr (IBC1, IE00BGSF1X88): sektory 87,57 + 9,88 + 4,44 = 101,89 % a „Irsko 9,88 %“
  NEJSOU chyba scraperu.** Přesně tak to uvádí justETF (ověřeno na profilu 20. 10. 2026, „As of 31/08/2026“); Irsko =
  pozice „INSL CASH“ (irský fond peněžního trhu iShares, kam fond parkuje hotovost). Podobně ~50 dalších dluhopisových
  fondů iShares (hotovost/deriváty, až 107 %). Neopravovat ručně; `check-fund-data.mjs` (kolo6) je jen počítá jako varování.
- Platí, dokud zdroj nezačne součty normovat; když scraper začne ukládat víc než top 5, přehodnotit spodní hranici 95 %.

## Detail fondu – kolo 6 (20. 10. 2026)

- **Index na detailu má fallback na `index_name`** (`indexDetailu`, `src/lib/detailFondu.ts`): od 20. 10. je `index_name` čistý z řádku
  „Index“ u zdroje. Fallback se NEpoužije u aktivních fondů (v řádku „Index“ mají název vlastní strategie → „žádný (aktivně řízený fond)“)
  a když název fondu index obsahuje a pokračuje dál („S&P 500 Energy“ s index_name „S&P 500“). Srovnávač a žebříčky dál používají
  přísnější `indexFonduLabel` – rozdíl je záměr (detail ukazuje jeden fond, nabídka indexů musí být čistá).
- **„Další fondy na index X“ = stejný klíč indexu jako nadpis + stejné měnové zajištění** – zajištěná třída nikdy vedle nezajištěné.
  Sektorový/ESG fond se k „obyčejnému“ indexu nepřidá ani při shodném index_name.
- **Dvě třídy akcií jedné firmy v top 10 (EMIM: Samsung kmenové + prioritní) = jeden řádek se součtem „(2 druhy akcií)“** – zdroj nerozlišuje,
  která je prioritní, proto je nepojmenováváme. Text pod tím: „10 největších pozic (9 firem)“.
- **Nový fond (< 1 rok bez výnosu za rok): „od vzniku“ = `return_inception` v EUR.** Ověřeno: u fondů starých ~1 rok se rovná výnosu za 1 rok
  (BPUE, WLSC, SAAI…), u VALL sedí s Xetra VGLA.DE (20. 8. → 16. 10. +2,4 %, zdroj +2,1 % od 18. 8.).
- **W‑8BEN FAQ a věta o irské smlouvě s USA (15 % místo 30 %) jen u akciových fondů s americkými akciemi** (USA ≥ 5 % ve složení).
- Hlídá `scripts/check-fund-data.mjs`, blok `kolo6 detail`.

- **Sektorové žebříčky podle sektoru zdroje, ne jen podle názvu (kolo 6):** finanční = `investment_focus` Financials/Insurance
  („UmweltBank“ má „Bank“ jen ve jménu), energetické = Energy (proto tam není ani uranový NCLR – ten má zaměření jen
  „Equity, World“), zlato = Precious Metals (bez koše Bitcoin+Gold a opčního Gold+ Yield). Dividendové = jen fondy
  vybírající dividendové akcie; opční „Premium/High/Option Income“, multi-asset „Portfolio Income“ a XUKX (FTSE 100,
  „Income“ = třída) sem NEpatří. Peněžní trh (investment_focus „Money Market“) není v akciových ani dluhopisových
  žebříčcích (stejně jako srovnávač). Hlídá check-fund-data.mjs (kolo6 zebricky).
- **Dluhopisové žebříčky ukazují v „Co v kategorii je“ SKUPINY indexů** (státní USA, státní eurozóna, firemní EUR…,
  `RODINY_DLUHOPISU` v indexDescriptions.ts), ne jednotlivé indexy – ty se tříští na desítky variant splatnosti a
  poskytovatele („Euro Government 2 z 259“). „Patří sem X z 300 největších fondů“ je správně.
- **Monogram „21“ u 21Shares** (ne „2“) a ticker s burzou („GOLD (Amsterdam)“ / „GOLD (Stuttgart)“), když stejný
  ticker mají v jednom žebříčku dva různé fondy – záměr.

## Žebříčky: titulky, popisky a „odpověď nahoře“ z dat stránky (SEO audit kola 6, 20. 10. 2026)

- **„TER od X“ v titulku ≠ číslo na kartě „Nejnižší poplatek“ – a je to správně.** Titulek = nejnižší TER > 0 v CELÉ
  kategorii (stejně jako sloupec „TER od“ na /zebricky); karta = pravidlo homepage (`porovnejNejlevnejsi`: fondy nad 100 mil. €
  bez měnového zajištění). U Asie a Pacifiku je tak titulek „TER od 0,09 %“ a karta ETLK 0,10 %. Popisek i odpověď pak píšou
  „Nejnižší TER nad 100 mil. € má …“. Kde „od“ nejde z načtených dat ověřit (velké kategorie s prahem pod 100 mil. € –
  akciové, dluhopisové, korporátní, ESG), titulek TER ZÁMĚRNĚ nemá („1 754 fondů v žebříčku“). Nedoplňovat odhadem.
- **Titulek žebříčku je absolutní; „| ETF průvodce.cz“ jen tam, kde se celý vejde do 65 znaků.** Data (rok, počet, TER)
  mají přednost před značkou webu. Totéž /zebricky, /kde-koupit, /jaky-sp500-etf.
- **Na mobilu žebříčku se pod odpovědí nahoře neukazuje popis kategorie** (zůstává v HTML) – jinak by tabulka začínala
  ještě níž (kolo 6). Desktop ukazuje obojí.
- **Titulky/popisky se počítají ze STEJNÉ React cache jako stránka** (`nactiZebricek` v nejlepsi-etf/[slug]/page.tsx,
  `nactiSouhrnyZebricku` v src/lib/zebricky.ts, `nactiFondy` na /jaky-sp500-etf) – žádný dotaz navíc (free tier). Nevracet
  na samostatný dotaz v generateMetadata.
- **/jaky-sp500-etf = „jaký S&P 500 ETF vybrat“ (průvodce 7 fondy), žebříček = „nejlepší S&P 500 ETF“ (všechny fondy).**
  Titulky se nesmí překrývat (kanibalizace), stránky na sebe odkazují obousměrně; dvojice jen ze `SITEMAP_PAIRS`.
- Hlídá `scripts/check-fund-data.mjs`, blok `kolo6 seo zebricky` (čísla popisků proti surové DB a rozcestníku, /kde-koupit
  proti kurzovnímu lístku ČNB a cenikům na stránce, /dane-z-etf bez platného stropu 40 mil.).

## SEO kolo 6 (nezávislý audit 20. 10. 2026)

- **Dvojice srovnání mají JEDNU kanonickou adresu** (src/lib/pairs.ts): kurátorské dvojice (`KURATORSKE`) jsou kanonické samy
  a nikdy se nepřesměrovávají; kurátorské **aliasy** (sxr8-vs-vuaa, vwce-vs-eunl, iwda-vs-vwra, cspx-vs-eunl, cspx-vs-vwra,
  iwda-vs-swda) zůstávají dostupné, ale mají canonical na hlavní dvojici a NEJSOU v sitemapě – záměr, ne chyba.
  Ostatní tvary (obrácené pořadí, jiné tickery týchž fondů, ISINy) → trvalé přesměrování; dvojice mimo kurátorský seznam mají
  `googlebot: noindex, follow` (Bing/Seznam indexují) – stejný princip jako ocas detailů. Stránky „stejný fond“ (cspx-vs-sxr8…)
  mají canonical na sebe, ne na detail fondu (jiný záměr hledání: „je X totéž co Y?“).
- **Titulek detailu fondu je bez „| ETF průvodce.cz“** (`title.absolute`, ≤ 65 znaků, ticker dopředu) a popisek nese výnos
  za 1 rok v Kč JEN s datem dat („data k 19. 10. 2026“) – detail se cachuje 30 dní. Výnos v popisku chybí u fondů s daty
  staršími 7 dní a s výnosem mimo trh (src/lib/seoDetailu.ts).
- **robots.txt zakazuje /api/, ale povoluje /api/og** (náhledy pro sociální sítě; X/Twitterbot robots respektuje). /api/og má
  `X-Robots-Tag: noindex`, aby se obrázky neindexovaly jako stránky.
- **Datum úpravy redakčních stránek je ze src/lib/redakce.ts** (historie souboru, u stránek z dat pozdější z ní a dne dat),
  ne „dnes“. Při věcné úpravě textu posuňte `upraveno`.
- **/llms.txt je route (src/app/llms.txt/route.ts), ne soubor v public/** – počet fondů a seznamy se generují.
- **next.config.ts nemá vlastní `splitChunks`** – dřív jeden „vendors“ (326 KB gzip i s recharts) na každé stránce. Nevracet.
- Hlídá `scripts/check-fund-data.mjs`, blok `kolo6 seo`.

## Kontrolní revize kola 6b (21. 10. 2026)

- **Výnos mimo svůj trh (> 1,5 p. b. od mediánu, src/lib/trhy.ts) = „—“ VŠUDE**, ne jen na detailu: žebříčky, srovnávač
  (/api/etf/screener, značka `_vynX`), porovnání, stránky dvojic i našeptávač. Jedna funkce `src/lib/vynosNeovereny.ts`
  (výnosy za období + výnos/riziko → null, kalendářní roky zůstávají) nad jedním seznamem `odlehleIsiny()`. Takový fond
  nevyhrává karty, nepočítá se do mediánu ani do odpovědi nahoře. Neukazovat ho „aspoň v tabulce“. Hlídá check-fund-data (kolo6b).
- **Pravidlo tříd (src/lib/tridyFondu.ts) má kotvu trhu**: když se dvě třídy téhož fondu rozcházejí v kolísavosti/poklesu,
  třída, která sedí s mediánem ostatních fondů na stejný široký index (jiní emitenti, `kotvyRizika`), se NEskrývá. P500
  max. pokles 3 roky −22,61 % je vidět, D500 −31,41 % „—“. Bez kotvy (fond mimo ruční seznamy trhů) dál „—“ u obou.
- **Volba měny (Kč/EUR/USD) platí jen v rámci stránky** – na každé další stránce je zase Kč (výnosy v Kč jsou USP).
  Dřív se pamatovala v localStorage napříč webem. Popisky měn jsou kódy („v EUR“, „v USD“), ne „€“/„$“.
- **„Další srovnání“ = jedna komponenta `DalsiSrovnani`**: nejvýš 8 kurátorských dvojic (nejdřív se společným fondem),
  sudý počet, odkaz „Všechna srovnání“ na /srovnani/porovnani (ta má proto `follow`). Detail z hlavy (indexovaný Googlem)
  neodkazuje na nekurátorskou dvojici (googlebot noindex) – místo ní porovnání `?isins=`; ocas detailů dál na dvojici.
- **Nový fond (< 1 rok): datum vzniku a „od vzniku / 1 měsíc“ jen v úvodu** (+ datum v tabulce faktů), přepínač měny
  ve Výkonnosti skrytý (údaje jsou jen v EUR).

## SEO obsah – kontrolní audit 6b (21. 10. 2026)

- **Švýcarské fondy (sídlo CH, `jeSvycarskyFond` v src/lib/nazevFondu.ts) se na karty žebříčků NEVYBÍRAJÍ** (Největší /
  Nejlevnější / Nejvýkonnější) – iShares Swiss Dividend (CH), UBS ETF (CH) Gold, Swisscanto (CH) Gold, Raiffeisen ETF Solid
  Gold… nejsou UCITS a část brokerů je českým investorům nenabízí (chybí KID). V tabulce ZŮSTÁVAJÍ se štítkem „sídlo CH –
  ověřte dostupnost u brokera“. Když je největší fond kategorie švýcarský, karta i odpověď nahoře píšou „největší mimo
  švýcarské fondy“. Výjimka: ETP/ETN švýcarských emitentů (21Shares – bitcoin, Solana…) – dluhové cenné papíry s evropským
  prospektem, ne fondy. Hlídá check-fund-data.mjs (blok kolo6b seo obsah).
- **Franklin FTSE Korea (FLXK, IE00BHZRR030) +101,7 % za rok v Kč je SKUTEČNOST** (ověřeno 21. 10. 2026 nezávisle):
  Xetra FLXK.DE 17. 10. 2025 → 19. 10. 2026: 39,40 → 79,66 € = +102,2 %; justETF graf +100,9 %; o den jindy (16.→16.)
  +93,3 % – volatilita 59 % (jeden den = ~10 p. b.). EWY (MSCI Korea, USD) +71–77 % – rozdíl je jiný index (FTSE Korea 30/18
  Capped, víc Samsung a SK Hynix). Číslo se smí ukazovat jen s datem. Na /infografiky se už neukazuje (panel „Nejvýkonnější“
  zrušen kvůli rozhodnutí „široké seznamy bez Nejvýkonnější“ – nahrazen „Největší podle majetku“ a „Nejlevnější podle TER“
  jednotným pravidlem `porovnejNejlevnejsi`).
- **/kolik-vydelaly-etf počítá VŠECHNA čísla z dat** (src/lib/clanky/kolikVydelaly.ts, start 1. 7. 2008, Kč, stejný engine
  jako /sp500-nebo-cely-svet). Dřív napevno „čtyřnásobek, 8–9 % ročně, propad −50 %“ a roční výnosy v USD (2017 +24 % – v Kč
  +3,4 %); stará equity křivka (equityCurve.ts) běžela bez měny = v dolarech – smazána. Sekce „od roku 1993 v korunách“ zrušena:
  kurzy koruny máme od roku 2000, číslo nešlo ověřit → nahrazeno S&P 500 v Kč od 1/2000. Bez dat stránka vyhodí výjimku (ISR
  ponechá poslední dobrou verzi). Hlídá check-fund-data (VT ročně = /sp500-nebo-cely-svet).
  Nezávislé ověření 21. 10. 2026 (Yahoo adj. close × denní kurzy ČNB, skript mimo kód webu): VT 2. 7. 2008 → 19. 10. 2026
  ≈ 685 500 Kč / 11,09 % ročně (web 684 442 / 11,08 %), roční výnosy 2009–2026 ±0,1 p. b., max. pokles −32,1 % (z denních
  cen; na koncích měsíců −25,0 %), 5 000 Kč měsíčně 8/2008–10/2026 (219 vkladů) 3 563 277 Kč (web 3 560 277), SPY/EFA/EEM
  od 7/2008 ±0,17 p. b. ročně, SPY od 1/2000 6,27 × 6,28 %. Engine začíná 2. 7. 2008 (ne 1. 7.) – stránka proto píše
  skutečný první den řady (`prvniDen`), ne „1. 7.“.
- **„Aktualizováno …“ na statických stránkách = datum úpravy TEXTU (DATA_CLANKU v src/lib/redakce.ts), ne den dat fondů.**
  U tabulek fondů na těchže stránkách je zvlášť „Data k …“. Při věcné úpravě textu posunout `upraveno`.
- **Počet fondů v textech zaokrouhleně („4 900+“)** – homepage, /o-nas, /zebricky, /kalkulacky, titulky, Organization, llms.txt.
  Výjimka: živé počítadlo nad tabulkou srovnávače (počet řádků podle filtru) je přesné záměrně.
- **Kvíz /vyber-etf: všechny výsledky končí společným posledním dnem.** Měsíční dluhopisová řada `eur_govt_bond_1_3y` dostává
  od sync jobu i body s dnešním datem zapsané během obchodního dne (= včerejší závěr) → kvíz psal „– 20. 10.“ a ostatní „– 19. 10.“.
  Delší řady se přepočtou do nejkratšího konce (predpocitejPortfolio s `konecDne`). Hlídá check-fund-data.
- **Titulek > 65 znaků → bez „| ETF průvodce.cz“** (`titulek()` v src/lib/seoTitulek.ts), stejně jako u žebříčků a detailů.
- **Organization schema: „Největší český průvodce ETF fondy“ ZŮSTÁVÁ** (rozhodnutí majitele 18. 10., viz výše) i přes
  doporučení auditu 6b; odstraněna jen „Jedinečná databáze ETF pro české investory“.

## Data a datumy – kontrolní kolo 7 (22. 10. 2026)

- **Žádný návrat ke dnešku.** Když se den dat nenačte (`getDataDatum()` = null), stránka „Data k …“ ani JSON-LD
  `dateModified`/`temporalCoverage` NEUKAZUJE – i když to vypadá jako chybějící údaj. `getDataDate(fallback)` smí jen sitemapa.
  Detail fondu bez výnosů bere den cen podle stažení TOHO fondu, nikdy globální datum. Hlídá check-fund-data (kolo7 data, statická kontrola).
- **„Výnosy k …“ u fondu jen když je jeho den STARŠÍ než „Data k“ stránky** (`jineDatumVynosu`, src/lib/datumVynosu.ts) a fond má
  aspoň jeden výnos za období. Fond s novějším dnem (výjimečně) nese den stránky – text u data říká „zdroj má ceny se zpožděním“,
  což by u novějšího dne lhalo. Fond bez jediného výnosu (BTCW 22. 10.: returns_as_of null) žádný den výnosů nemá – „—“ bez data.
- **ETC/ETN/ETP mají v porovnání „Právní struktura: ETC – dluhový cenný papír, ne fond“**, i když zdroj u nich vede „UCITS“
  (BRNT, BITC, BTCW). Švýcarský fond „švýcarský fond (ne UCITS)“, rozbité hodnoty sloupce (`focus Equity…`, `Contractual`) → „UCITS“
  jen když ho má fond v názvu, jinak „—“ (`pravniStrukturaText`, src/lib/detailFondu.ts). U nich i „stejný produkt“ místo „stejný fond“.
- **Štítek „sídlo CH“ nedostávají ETP, ETC ani ETN** (XXBU – Xtrackers Galaxy Physical Bitcoin ETC Securities, CH1315732250).
- **/sp500-nebo-cely-svet: kolísavost z MĚSÍČNÍCH výnosů stejnou funkcí jako backtest** (calculateSummary) – S&P 500 v Kč od 7/2008
  13,7 % (dřív 21,1 % z denních log-výnosů). Ověřeno 22. 10. 2026: backtest API 13,74 %, Yahoo SPY × kurzy ČNB 13,72 %. „Od 2008“
  = od 1. 7. 2008 jako engine (první den 2. 7.): S&P 500 v Kč 14,7 % ročně všude (dřív hloubkový rozbor od 30. 6. = 14,5 %);
  Yahoo × ČNB 14,66 %. Nejhlubší propad S&P 500 v Kč = celá řada od 2000 (9/2000 → 3/2009, −72 %, zpět na vrcholu 12/2014),
  ne dno okna 2000–2003 (−61 %); Yahoo × denní kurzy ČNB −71,7 %, stejné dny. Hlídá check-fund-data (kolo7 data).
- **„Návrat“ vždy s výchozím bodem.** Backtest, portfolia a faktorové stránky (krize = calculateStressPeriods) počítají dobu
  OD DNA do návratu na předchozí vrchol („návrat za 14 měs. od dna“); tabulka krizí v /sp500-nebo-cely-svet a /kolik-vydelaly-etf
  a „nejhlubší propad“ faktorů (maxDrawdown.lengthMonths) OD VRCHOLU. Oba údaje jsou správně – liší se definicí, proto ji text
  vždy uvádí. Hlídá check-fund-data (kolo7 data: „návrat za …“ bez „od dna/od vrcholu“ = poplach).

## Kontrolní kolo 7 – podezřelá čísla (22. 10. 2026)

- **Výnosy za období „—“ u fondů ze seznamu `NEOVERENE_VYNOSY` (src/lib/vynosNeovereny.ts) jsou ZÁMĚR.** Každá položka je
  nezávisle ověřená chyba ZDROJE dat (důkaz s čísly je přímo v seznamu): skok v denní řadě, který burza nemá (HASH, HAMO
  22. 9. 2026 −96 % – burza bez obchodu od září; pákové VIXL, 3NGL, 3LAA, 3SNV, 3SAA, 3USS, 3BBE, 3LTS, 3SFB s body
  v miliardách €), zašuměná řada bez tržní kotvy (EWG2, TMGD: 1R +1,0 % vs. burza Stuttgart −1,6 %, Xetra-Gold −1,3 %)
  a chybějící dividenda distribuční třídy (I50D, XISP, IUSP, UDHY, IUS7, IS3C – Yahoo ji má, zdroj ne). Nevracet čísla
  „aspoň do tabulky“. Položku smazat, až ji denní kontrola (check-fund-data.mjs, blok kolo7 podezrele) nahlásí jako
  neplatnou; NOVÝ případ hlásí jako poplach (skok, šum) nebo varování (dividenda < 3 týdny – zdroj je doplňuje se
  zpožděním, 22. 10. chyběla u 11 ze 149 největších distribučních fondů).
- **Pravidlo pro zlato/bitcoin NENÍ „odchylka od mediánu skupiny“** – ověřeno na 130 dnech: fondy oceňované v jinou denní
  dobu (LBMA fix vs. závěr Xetry vs. 22:00) se legitimně rozcházejí až o 2,2 p. b. (zlato) a 4 p. b. (bitcoin) ve všech
  obdobích stejným směrem. Rozhoduje vlastní šum řady (≥ 1,1 % a ≥ 2,5× medián skupiny) A výnos 1M i 1R vedle vlastní burzy
  o > 1,5 p. b. stejným směrem. VBTC (šum 0,97 %, burza 1M +1,7 / 1R −0,4) proto chybou NENÍ.
- **Ověřené extrémy – skutečnost, neopravovat (22. 10. 2026, burza v EUR ke stejnému dni):** LSMC 3R +302 % (CHIP.MI
  +302 %), FAMMWS 3R +314 % (+295 %, řídký obchod), 3BAL 3R +1 224 % (3BAL.L +1 222 %), 3ITL 3R +384 % (+382 %), IBEXA
  3R +344 % (+344 %), 5MIB 3R +752 % (+770 %), LCFE 3R +315 % (+306 %), Polygon (POLY/VPOL/CPYG) 3R −81 až −84 % (burza
  −84/−85 %), Solana (SLNC/WSOL) 3R +310/+318 % bez skoku v řadě, 3MRN (3× Moderna) 1R +3 015 % – burza 3MRN.L stejný
  trend (572 → 1 800+ p.). Pákové 3× produkty umí −90 % i +1 000 % reálně.
- **VALL (IE000VAHT5T0) velikost 3,2 mld. € dva měsíce po vzniku = skutečnost (řádově).** Zdroj: EUR 3 238 m (profil
  22. 10. 2026); emitent (Vanguard, stránka produktu): Share Class Assets 2,51 mld. USD, Total 2,57 mld. USD, 507 485 297
  podílů k 30. 9. 2026; tisk (bankeronwheels.com, 4. 9. 2026): 1 mld. USD za 2 týdny od startu. Číslo ukazovat s datem.
- **SNTE (Ossiam Serenity Euro, €STR) 1R +2,45 % nad XEON +2,09 % i přes vyšší TER = skutečnost.** Xetra SNTE.DE
  20. 10. 2025 → 20. 10. 2026: 102,355 → 104,858 € = +2,445 %; XEON.DE +2,07 %. ECB €STR složený za stejné období
  2,09 %, €STR + 8,5 bp 2,18 % → XEON (TER 0,10) sedí přesně; SNTE i Amundi Smart Overnight (CSH2.PA +2,49 %) dávají
  o ~0,4 p. b. víc, než index po poplatku dovolí (podmínky swapu / repo strategie emitenta – příčinu z veřejných dat
  neověříme). Neopravovat; nejde o chybu dat.
- **VHYL × VGWE (tentýž fond, dvě třídy): správně je VHYL, chybná VGWE.** Přepočet z denní řady zdroje dá přesně údaje
  DB (VHYL vol 1R 7,98 %, 3R 10,03 %, pokles 3R −14,79 %; VGWE 10,77 / 16,99 / −19,56 %) – VGWE má v řadě vadné body
  (25. 12. 2024 aj.). Nezávisle Yahoo: VHYL.AS vol 1R 8,72 / 3R 10,72 %, VGWE.DE 8,95 / 10,73 % → riziko obou tříd je
  ~VHYL. Na webu má být „—“ jen u VGWE (úprava src/lib/tridyFondu.ts – viz report kola 7).
- **Distribuční třídy: zdroj vede dividendy se zpožděním a zaokrouhlené na 2 desetinná místa** (I50D 0,03 místo 0,0347 €).
  Rozdíl I50D/XISP proti akumulačním třídám (~0,7 p. b.) NENÍ metodika zdroje (řada „s dividendami“ dividendy
  reinvestuje), je to chybějící poslední dividenda → „—“ (výše). Platí, dokud zdroj nezačne dividendy vést včas.

## SEO/LLM audit kola 7 (22. 10. 2026)

- **„Největší český průvodce ETF fondy“ v Organization ZŮSTÁVÁ i po auditu kola 7** (třetí audit, který ho chce pryč) –
  rozhodnutí majitele 18. 10. platí, dokud ho majitel nezmění. Odstraněn jen DRUHÝ uzel Organization na /o-nas se stejným
  @id a jiným tvrzením („Největší srovnávač ETF pro české investory“) – dva různé popisy jedné entity.
- **Organization a WebSite jsou samostatné uzly** (src/components/SEO/AuthorSchema.tsx); WebSite má SearchAction na
  `/srovnani?q=` (ScreenerUI čte `q` z window.location – stránka zůstává statická, viz komentář v srovnani/page.tsx).
- **Dvojice srovnání – pravidlo pořadí:** kurátorský alias (`vwce-vs-eunl`) = 200 + canonical na hlavní dvojici
  (`vwce-vs-iwda`), jeho obrácené pořadí (`eunl-vs-vwce`) = 301 ROVNOU na hlavní dvojici (ne na alias – žádný řetěz
  přesměrování). Obojí končí na stejné kanonické adrese; že alias sám nepřesměrovává, je záměr kola 6 (viz výše).
- **Popisky pěti žebříčků se záměrně liší podle záměru stránky** (`ZAMER` v src/lib/zebrickySeo.ts): nejlepsi-etf-2026 =
  tři největší fondy, nejlevnejsi = nejnižší TER (počet fondů s minimem + první tři podle pravidla karty), sp500 = index,
  americke = medián výnosu trhu, akumulacni = třída. Dřív měly všechny stejné jádro „Nejnižší TER má SPYL… Největší je SXR8…“.
  Nevracet na společnou šablonu. Hlídá check-fund-data.mjs, blok `kolo7 seo` (žádná věta popisku ve dvou z pěti).
- **„Klíčová čísla k {datum}“ na hlavních žebříčcích** (2026, S&P 500, MSCI World, celý svět; `KLICOVA_CISLA_ZEBRICKY`) –
  stejná data jako popisek a odpověď nahoře, chybějící hodnota = řádek vynechán. Medián výnosu jen u indexových žebříčků
  (fondy na stejný index; u smíšeného „2026“ by medián akcií, dluhopisů a zlata nic neznamenal).
  Nezávisle ověřeno 22. 10. 2026: SXR8 za 12 měsíců v Kč +20,1 % (Xetra SXR8.DE 617,40 → 741,34 € = +20,07 %, ČNB EUR
  24,295 → 24,325 → +20,2 % v Kč; web z NAV +20,13 %), medián S&P 500 za 3 roky v Kč +75,0 % (26 fondů, přepočet z holé DB
  vlastním filtrem 75,03 %), SC0J TER 0,05 % (DB i profil justETF).
- **Sitemap lastmod:** datové stránky = den dat, a když ho nejde načíst, lastmod CHYBÍ (dřív tichý „dnes“); redakční
  stránky = `upraveno` z src/lib/redakce.ts. /srovnani-brokeru má vlastní záznam (ceníky ověřeny 18. 10., text 19. 10.) –
  při změně ceníků posunout `upraveno` i `CENIKY_OVERENY` (kontrola hlídá, že úprava není starší než ověření ceníků).
- Hlídá `scripts/check-fund-data.mjs`, blok `kolo7 seo` (URL v JSON-LD vrací 200, FAQ viditelné, uzly schema, lastmod,
  popisky, klíčová čísla proti DB, prolinkování, pravidlo dvojic).

## Srovnávač a žebříčky – kolo 7 (revize pokročilého testera, 22. 10. 2026)

- **Řazení podle výnosu (srovnávač i žebříčky, desktop i mobil) dává fondy s výnosy k JINÉMU dni než většina na konec pod
  šedý oddělovač „Výnosy k jinému dni – nesrovnatelné pořadí“.** Není to chyba řazení: fondy s posunutou řadou u zdroje (S&P 500:
  WSPX, SPTG, SPTD, PSP5, S5USAS, ESEA k 16.–19. 10.) jinak vedly 1R/3R, přitom ve stejném okně je rozdíl ~1 p. b. Platí i pro
  fondy o den NOVĚJŠÍ (21. 10.). ScreenerUI.tsx (`_dv`), TabulkaFondu.tsx (`vynosyK`).
- **Karta „Nejvýkonnější“ a medián na žebříčku = jen fondy s `returns_as_of` = den „Data k …“ stránky** (dřív stačilo ≤ 3 prac. dny).
- **Štítek dne výnosů: šedý „k 16. 10.“ = 1–3 pracovní dny jinak (běžné, ~19 % fondů), jantarový „výnosy k …“ jen > 3 pracovní dny
  pozadu** (`_dvP`, vynosyPozadu). Nedělat zase všechno jantarově.
- **Emerging markets je indexový žebříček (bez „Nejvýkonnější“, s „Jak vybrat“).** Vyhrávaly jiné trhy a metodiky (84X0 EM ex-China
  +91,6 %, Value faktor, ESG, Islamic); mezi fondy na MSCI EM / EM IMI / FTSE EM je rozdíl jen šum tříd.
- **Varianty „ex-…“ (EM ex-China, Eastern Europe ex Russia…) se nevybírají na žádnou kartu** (Největší/Nejlevnější/Nejvýkonnější) – jiný
  trh než kategorie. Výjimky (`EX_NA_KARTACH`): široké seznamy a Asie a Pacifik (MSCI Pacific ex Japan je tam hlavní index). V tabulce zůstávají.
- **TER 0 % (Xetra-Gold, EUWAX Gold, CoinShares Staked ETH/SOL…) = „0,00 %*“ s poznámkou „náklady mimo TER“ a v řazení podle TER
  NA KONCI** (srovnávač, žebříčky, detail). Číslo je podle zdroje pravdivé, ale „zdarma“ to není (rozpětí cen, podíl ze stakingu).
  U akcií a dluhopisů je TER 0 chyba zdroje → „—“ (beze změny).
- **Srovnávač: při výběru indexu nebo celého trhu jsou měnově zajištěné třídy ve výchozím stavu SKRYTÉ** (stejně jako žebříček;
  vedle počtu „bez N měnově zajištěných tříd · zobrazit“, v nabídce indexů přepínač). Bez výběru indexu (celý seznam, hledání tickeru)
  se ukazují všechny se štítkem „zajištěno do …“ – jinak by hledání IUSE nic nenašlo. Výchozí stav = `zajisteni` 'auto' (není v URL).
- **Hledání ve srovnávači vyžaduje VŠECHNA slova dotazu** (doslova, přes český výraz, nebo jako část víceslovného výrazu); výplňová
  slova („celý“, „ETF“, „trhy“) se nevyžadují. Dřív „iShares USD Treasury“ = 949 fondů (stačilo „iShares“), teď 39. Našeptávač
  (/api/etf/search) má vlastní relevanci – beze změny.
- **Tabulka srovnávače plave (sticky hlavička, bez overflow) až od xl (1 280 px)**; má nejméně ~1 080 px a obsah stránky je 1 120 px.
  Pod xl se posouvá do strany a sloupec „Porovnat“ drží u pravého okraje (sticky, podklad = podklad řádku). Nevracet na lg.
- **Odpověď nahoře na žebříčku = nejvýš 2 věty** (den + počet + největší; nejlevnější), práh karet (100 mil. €) ve vysvětlivce (i),
  ne ve větě. Počet fondů na stránce 2× (odpověď + věta nad tabulkou); čip ukazuje jen práh. Funkce `odpovedNahore` v
  nejlepsi-etf/[slug]/page.tsx – titulek a popisek dál src/lib/zebrickySeo.ts (`odpovedZebricku` se na stránce nepoužívá).
- **Název fondu v tabulce žebříčku nekončí tickerem** (ticker je v řádku pod ním); rozsah „0‑1yr“ s nezlomitelnou pomlčkou.
- Hlídá `scripts/check-fund-data.mjs`, blok `kolo7 srovnavac`.

## Kalkulačky: číselná pole, předpoklady FIRE a další (kolo 8, 22. 10. 2026)

**Prázdné číselné pole = výsledek „—“, ne 0.** Všechny kalkulačky používají sdílené `src/components/CisloInput.tsx`
(`CisloInput`, `CisloPole`, `VysledekChybi`). Pole během psaní dovolí prázdno i mezistavy („1,“), bere čárku
i tečku a mezery v tisících, hodnotu posílá jen platnou a v rozsahu; ořez na min/max až při opuštění pole
s viditelnou hláškou „Upraveno do povoleného rozsahu“. Dokud pole není platné, kalkulačka ukáže „—“ / „Doplňte …“
(nouzová rezerva ani FIRE bez vstupu nevydají žádný verdikt). **Nevracet `type="number"` s `Number(e.target.value)`**
– smazání „2“ dělalo „0“ a další číslice se přilepila („10“ osob, věk „1831“ → 80, sazba „4,9“ → 49 %).
Prázdné = žádný vklad (zástupný text „0“) jen tam, kde to dává smysl: backtest přes vlastnost `prazdne={0}` (`#bt-initial`,
`#bt-contrib`), stroj času bez ní – stav pole je `null` a widget ho počítá jako 0 (`mesicneV ?? 0`), obě částky 0 → „Zadejte
částku“. Kalkulačka nákladů u brokerů `prazdne` NEPOUŽÍVÁ: prázdné / neplatné pole = „Zadejte částku od 100 do 1 000 000 Kč“.
(Opraveno 22. 10. 2026 – dřív tu stálo, že `prazdne={0}` mají všechny tři; ověřeno grepem, používá ho jen BacktestWidget.)
Kontrola: `scripts/qa-kalkulacky.mjs` (WebKit 390 px, vyprázdní pole, napíše hodnotu, ověří výsledek).

**FIRE kalkulačka – předpoklady výnosů jsou REÁLNÉ (po inflaci) historické výnosy v Kč, ne 7,7/8,8/9,8 %.**
`src/lib/firePredpoklady.ts`: konzervativní 30/70 = 2,0 %, vyvážená 60/40 = 4,6 %, agresivní 80/20 = 6,2 % ročně
nad inflaci; kolísání REÁLNÉ 7,6 / 9,2 / 11,0 % (do auditu nástrojů 22. 10. 2026 nominální 6,9 / 8,8 / 10,7 % – viz níže). Složení jako modelové portfolio 60/40 (Vanguard FTSE All-World +
Xtrackers Eurozone Government Bond), roční rebalancování, nejdelší společné období 7/2008–9/2026 (VT existuje
od 6/2008), inflace ČSÚ. Proč: staré nominální sazby bez zdroje dávaly portfoliu s 60 % dluhopisů víc, než web
jinde uvádí pro čisté akcie. Kalkulačka počítá v dnešních korunách: nominální výnos = (1 + reálný) × (1 + zadaná
inflace) − 1. Čísla **vypadají nízko** (konzervativní 2 %), protože období obsahuje roky 2022–2023 s inflací 15 %
a 11 % a dluhopisy eurozóny v nich ztrácely – je to skutečnost, ne chyba. Ověřeno nezávisle (Yahoo adj. close
× kurzy ČNB, inflace Eurostat HICP + ČSÚ): `scripts/overeni-fire-predpoklady.mjs` – reálně 2,00 / 4,55 / 6,14 %.
Přestane platit: při aktualizaci období (pak přepočítat enginem a spustit ověřovací skript).

**Monte Carlo počítá s DOLAROVÝMI výnosy amerických ETF – bez kurzu koruny, a tak to i píše.** Předpoklady od 22. 10. 2026
z historie ETF (sekce „Audit nástrojů – kalkulačky“).
Dřív stránka tvrdila „výsledky v korunách“. Převod do Kč (kurzová vrstva) zatím není ověřený → nepublikujeme.
Výsledky simulace zaokrouhlené na tisíce.

**Kurzový dopad: scénáře jsou ilustrační „co kdyby“ bez pravděpodobností.** Pravděpodobnosti 20/15/20/15/30 %
byly natvrdo bez zdroje → odstraněny. Graf ukazuje odchylku od dnešní hodnoty (0 = beze změny, šedá).

**Čistý plat: strop sociálního pojištění 2 350 416 Kč ročně (48 × 48 967 Kč, ČSSZ 2026).** Nad ~195 868 Kč
měsíčně je sociální pojištění (zaměstnanec i zaměstnavatel) zastropované; měsíční částky jsou pak průměr za rok.
Zdravotní pojištění strop nemá. Přestane platit 1. 1. 2027 (nová průměrná mzda).

**Hypotéka: změna ceny nemovitosti už nepřepisuje výši úvěru na 80 %** – během psaní to mazalo zadaný úvěr.
Úvěr nad cenou = varování.

## Audit nástrojů – kalkulačky (22. 10. 2026)

Nezávislý auditní tým (zlaté případy, Python z holých dat) našel chyby v kalkulačkách. Co vypadá divně, ale je záměr:

- **Tečka/čárka po 3 číslicích = tisíce v polích pro celá čísla** (`rozborCisla` v `src/components/CisloInput.tsx`, V1):
  „15.000“ = 15 000, „1.000.000“ = 1 000 000, „1,000“ = 1 000. Dřív „15.000“ → 15 Kč, „1.000.000“ → prázdné.
  Desetinné číslo v poli pro celá čísla („2,5“ osoby, „5000,5“ Kč) = CHYBA s hláškou „Zadejte celé číslo“ a výsledek „—“,
  žádné tiché zaokrouhlení (dřív „2,5“ → 3). V DESETINNÝCH polích (%, sazba) je „1.000“ nejednoznačné: když pole nepřipouští
  ≥ 1 000 (max < 1 000 – dnes všechna procentní pole), bere se jako 1,000 = 1; jinak hláška „nejednoznačné“. Dvě a víc
  skupin („1.000.000“) = vždy tisíce; „1.000,5“ / „1,000.5“ = poslední znak je desetinný. Výjimka: pole s `prazdne={0}`
  (backtest) neplatný text smaže a počítá s 0 – pole pak ukazuje zástupnou „0“, takže výpočet odpovídá tomu, co je vidět.
  Hlídá `scripts/qa-kalkulacky.mjs` (WebKit i Chromium, 390 px, dotyk).
- **FIRE simulace je GEOMETRICKÁ (log-normální)** (V2): měsíční růst = exp(N(ln(1 + r)/12, σ/√12)), r = historický reálný
  CAGR → medián dráhy roste přesně o r (numpy 100 000 cest: 4,609 % při r = 4,6 %). Dřív se (1 + r)^(1/12) − 1 bral jako
  aritmetický průměr → medián o ~σ²/2 nižší a věk FIRE o 1–3 roky později (výchozí 58/67 → teď 52/57/65). Kolísání je
  REÁLNÉ (měsíční log výnosy po inflaci × √12) 7,6 / 9,2 / 11,0 % – simulace běží v dnešních korunách; nominální 6,9 / 8,7 /
  10,6 % je nižší, protože měsíční inflace kolísání přidává. Ověřuje `scripts/overeni-fire-predpoklady.mjs`.
- **FIRE: „nedosáhnete“ jen když cíle nedosáhne ŽÁDNÁ simulace** (S19). Když ho dosáhne menšina, píšeme „jen v X % simulací“.
  „Obvykle (medián)“ místo „Nejčastěji“ (medián není nejčastější hodnota).
- **Monte Carlo: výnosy, kolísání a korelace z historie ETF 11/2007–9/2026** (V3, `src/lib/monteCarloPredpoklady.ts`):
  SPY 10,8 %, EFA 4,2 %, EEM 3,1 %, AGG 2,7 %, BWX 0,3 %, VNQ 5,4 %, GLD 8,7 %, BIL 1,3 % (CAGR v USD s dividendami).
  **Vypadá to divně** (rozvíjející se trhy 3 %, zlato skoro jako akcie, mezinárodní dluhopisy ~0 %) – je to skutečná historie
  tohoto období, ne chyba. Období je nejdelší společné (BWX od 10/2007). Třídy bez dat a bez váhy v portfoliích (US malé
  firmy, Kanada, high-yield) odebrány. Výsledky na 2 platné číslice (S22: p95 se při 600 scénářích mění o 3–6 %).
  Kontrola: `scripts/monte-carlo-predpoklady.mjs` (Yahoo, týdně v CI). Kotvy: S&P 500 TR 10,90 %, T-bill (FRED TB3MS) 1,43 %.
- **Kurzový dopad: kolísavost z kurzů ČNB 1/1999–9/2026** (V7, `src/lib/kurzovaKolisavost.ts`): USD/CZK 11,35 %, EUR/CZK
  5,14 %, korelace 0,61 (měsíční log změny × √12). Posledních 10 let je koruna klidnější (9,2 / 4,2 %) – bereme nejdelší
  období, je to uvedené u čísla. Kontrola: `scripts/kurzovy-dopad-predpoklady.mjs`. Scénáře jsou okamžitá změna kurzu
  bez horizontu (je to napsané). Věta „pravidelné nákupy kurzové riziko zmírňují“ odstraněna (S27): průměrují jen kurz
  nákupu, na už nakoupenou část působí kurz dál.
- **Čistý plat počítá se zákonným zaokrouhlením** (N14): základ zálohy na stokoruny nahoru, záloha a pojistné na koruny
  nahoru, zdravotní 13,5 % nahoru a zaměstnanec třetinu nahoru – proto se čísla mohou o pár korun lišit od „hladkých“
  kalkulaček. Pod minimální mzdou (22 400 Kč) zaměstnanec doplácí 13,5 % z rozdílu (S24), pokud nezaškrtne výjimku
  (student, rodič na rodičovské, státní pojištěnec, ZTP…); pracující důchodce výjimku má automaticky. Daňový bonus pod
  50 Kč měsíčně se nevyplácí (§ 35d odst. 4 ZDP, N13). „Pojistné + daň, X % z hrubé“ je BEZ bonusu (bonus zvlášť, S23).
  Štítek pracujícího důchodce „0,6 %“ (V11). Přestane platit 1. 1. 2027 (nová průměrná a minimální mzda).
- **Nouzová rezerva = redakční pravidlo, ne vědecký zdroj** (V12, S26 – rozhodnutí vedoucího): zaměstnanec 3 měsíce (nejvýš 6),
  OSVČ / dohody 6 (nejvýš 12), +1 měsíc za faktor (středně stabilní práce, nestabilní +2, doba určitá, pravidelné splátky,
  jediný příjem v domácnosti se 3+ osobami, 50+, základní vzdělání), 2+ osoby a splátky ≥ 6 měsíců. Stejně ve widgetu
  („Jak počítáme“), ve FAQ i v sekci stránky. „Dostatečná rezerva“ jen když nic nechybí (S25). Popisek „Mám pravidelné
  splátky“ (redakční hranice – bez témat úvěrů). Zlatý případ osobni-24 vychází dál 12 měsíců.
- **Investiční kalkulačka: výsledky modelu na 3 platné číslice, pod 100 000 Kč na stovky** (N2, upraveno 23. 10. 2026),
  vklady přesně; „vloženo + výnos“ = zobrazená hodnota (výnos = zobrazená hodnota − vloženo; zaokrouhlení nikdy nepřehodí
  hodnotu na druhou stranu vkladů). „6 200 Kč“ u 6 225 Kč a „2 940 000 Kč“ u 2 938 999 Kč je záměr. Dřív vše na tisíce →
  500 Kč měsíčně / 7 % / 1 rok ukazovalo „Výnos +0 Kč“ (skutečně 225 Kč) a roční výnos v tabulce mohl vyjít záporný.
  „Výnos za rok“ = zaokrouhlený rozdíl NEzaokrouhlených hodnot (součet ročních výnosů se proto může o zaokrouhlení lišit
  od „výnosu celkem“). Zlaté případy investicni-* s tolerancí ± polovina kroku zobrazení; regrese investicni-41/42.
  Prázdný výnos/daň = „—“, ne „0 %“ (S6).
- **Stroj času: částka nad maximum = hláška a žádný výsledek** (S7), po opuštění pole ořez s hláškou.

## Faktorové ETF – kolo 8 (22. 10. 2026)

Všechna čísla sekce /faktorove-etf se počítají z backtest enginu (src/lib/faktory/vypocet.ts), žádné natvrdo. Co vypadá divně:
- **Quality „zhruba jako index“, ne „neporazil“.** U řad prodloužených akademickými daty (momentum, quality) je rozdíl ročního
  výnosu pod 0,3 p. b. (`NEJISTOTA_PRODLOUZENI`) menší než nejistota kalibrace: nezávislý přepočet 22. 10. dal quality
  −0,09 p. b. (kalibrace −1,89 %/rok z DB) i +0,07 p. b. (kalibrace na celý překryv −1,63 %/rok). Do počtu „porazil index“ se nepočítá.
- **Ročenka začíná 2014, i když min. volatilita má data od 2011** – jen celé roky, kdy VŠECH šest faktorů běží na reálném ETF
  (MTUM od 18. 4. 2013, QUAL od 18. 7. 2013). Neprodlužovat dozadu akademickou řadou.
- **Shoda na zobrazenou přesnost = dělené místo** (`SHODA`, 0,05 p. b.): 2022 small cap a quality −18,1 % – obě červeně,
  obě započtené jako nejhorší a stránka to napíše. Dřív by jedna vypadala jako „vítěz“ o setinu.
- **Value a small cap mají S&P 500 od 26. 5. 2000, momentum a quality od 31. 12. 1999** – každý řádek má vlastní okno
  (S&P 500 vždy přesně na oknu faktoru). Proto se „S&P 500 stejné okno“ v řádcích liší. Záměr, ne chyba.
- **Fondy „na stejný index“ = podle `index_name` v DB** (src/lib/faktory/fondy.ts); na americký FTSE High Dividend Yield (VYM)
  UCITS ETF neexistuje → stránka to přizná a ukáže nejbližší s jinou metodikou. Světové MSCI World verze až jako „jiný index“.
- **Klouzavé okno s méně než 12 obdobími se neukazuje** (min. volatilita by měla 15 let = 1 okno, průměr = minimum = maximum).
- Hlídá `scripts/check-fund-data.mjs`, blok `kolo8 faktory` (statická kontrola zdrojů + živá konzistence tvrzení s čísly).

## Obsah a fakta – kolo 8 (22. 10. 2026)

Hlídá `scripts/check-fund-data.mjs` (blok „kolo8 obsah“). Zdroje ověřeny 22. 10. 2026 u primárních dokumentů:

- **Světové indexy = factsheety k 30. 9. 2026** (`DATUM_INDEXU` v /svetove-etf-indexy): MSCI World 1 249 firem / USA 72,94 %,
  MSCI ACWI 2 414 / 64,21 % (msci.com/documents/10199/178e6643-6ae6-47b9-82be-e1fc565ededb a …/a71b65b5-d0ea-4b5c-a709-24b1213bc3c5),
  EM v ACWI 12,0 % = tržní kap. MSCI EM 12,28 bil. / ACWI 102,70 bil. USD; FTSE All-World 4 204 / 62,28 %, EM 10,0 %
  (research.ftserussell.com … issueName=AWORLDS), FTSE Developed 1 904 firem, USA 65,90/95,22 bil. = 69,2 %; FTSE Global All Cap
  10 222 / 62,35 %, malé firmy 8,7 % (issueName=GEISLMS). **Jižní Korea: MSCI = emerging** (seznam EM v factsheetu ACWI),
  **FTSE = developed** (FTSE Country Classification, Annual Announcement 9/2026, publ. 6. 10. 2026). Dřív obráceně.
  **VWCE ≠ Global All Cap** (VWCE = FTSE All-World). UCITS fond na Global All Cap: Vanguard VALL/VGLA, IE000VAHT5T0, od 18. 8. 2026
  (factsheet Vanguard). **S&P 500 „100 %¹“ USA je správně** podle pravidel S&P (US domicil: kotace, většina aktiv/tržeb v USA –
  S&P U.S. Indices Methodology); data fondů (justETF, CSPX) podle země registrace ~97 % (Irsko: Linde, Accenture…) – obojí platí,
  stránka to vysvětluje poznámkou. Při novém factsheetu posunout DATUM_INDEXU a čísla.
- **Trading 212 – regulátor „CySEC, probíhá přesun pod BaFin – ověřte u brokera“ je ZÁMĚR.** Centrum nápovědy (článek
  „What are the supported countries?“, helpcentre.trading212.com/hc/en-us/articles/12933782261917) dál řadí Česko pod Trading 212
  Markets Ltd. (CySEC 398/21), zároveň probíhá „custody migration from Trading 212 Markets Ltd. to Trading 212 EU GmbH“
  (článek 38272842804765). Datum přesunu českých účtů z veřejných zdrojů jednoznačně nejde určit → nepsat jistě ani jedno.
  Ochrana u obou 90 %, max. 20 000 EUR (ICF: „€20,000 or 90% … whichever is lower“, cy/common/Investor-Compensation-Fund_EN.pdf;
  EdW: článek 24338008071581). Převod portfolia k/od T212 i pro Markets Ltd. bez poplatku T212, jen celé kusy (článek 16105401083805).
- **Ochrana cenných papírů = „90 % ztráty, max. 20 000 EUR“ u VŠECH garančních systémů** (dřív u DEGIRO/Fio/Portu jen „max. 20 000“):
  DEGIRO EdB (degiro.de/ueber-degiro/impressum: „90% der Verbindlichkeiten … maximal 20.000 Euro“), Garanční fond OCP pro Fio
  a Portu (gfo.cz; Portu „Informace o garančním fondu“), IBKR ICCL, T212 ICF/EdW. XTB zůstává 100 % do 3 000 + 90 %, max. 20 100 EUR.
- **Brokeři – ceníky ověřené 22. 10. 2026:** XTB Tabulka poplatků ze dne 20. 10. 2026 (xtb.com/cz/ucet-a-poplatky): vedení účtu
  zdarma, 10 EUR/měs. jen při 365 dnech bez otevření/uzavření pozice A 90 dnech bez vkladu; výstupní převod 25 EUR/ISIN.
  DEGIRO Přehled poplatků (od 1. 1. 2026): převod portfolia z DEGIRO 20 EUR za pozici + externí náklady, k DEGIRO zdarma.
  Fio Ceník základních služeb (účinnost 1. 7. 2026): převod IN z Xetry k jinému obchodníkovi 25 EUR/ISIN. IBKR (commissions-spot-currencies):
  ruční směna 0,20 bp = 0,002 %, min. 2 USD; automatická konverze bez provize, +0,03 % v kurzu. Portu Sazebník (od 1. 9. 2026):
  Klasický účet 1,00/0,80/0,60/0,40 % podle úrovně (do 0,5 / 0,5–1 / 1–5 / nad 5 mil. Kč), **sazba na celý majetek**; sleva za
  fixaci 20/25/30/40 % (5/7/10/15 let) → 0,24–1 %. Recenze Portu ukazuje roční náklad při 100 000 a 750 000 Kč z `roboSazby`.
  **Kalkulačka /kde-koupit Portu nepočítá** (jen brokery) – v recenzi Portu proto není „Spočítat pro vaši částku“, ale řádky výše.
- **Příklad „Nákup za 2 000 Kč“ = součet ZAOKROUHLENÝCH částí** (`castiPrikladu`, dřív IBKR „od 74 Kč“ × „30 + 43 Kč“).
- **Převod ETF mezi brokery nepřerušuje časový test** – § 4 odst. 1 písm. **u)** ZDP (zakonyprolidi.cz/cs/1992-586, znění od 1. 8. 2026:
  „doba mezi nabytím a úplatným převodem“; dřívější písm. w) se přečíslovalo). Přesun k jinému custodianovi není nabytí ani úplatný
  převod; prodej + nový nákup test restartuje.
- **35% srážka = dividendy českých akcií na sběrném účtu zahraničního brokera**, ne ETF (dřív u Portu „35 % hrozících u některých ETF“).
- **Modelová portfolia:** Dividendové se srovnává s VWCE (akcie celého světa; VT v datech fondů není), ne se S&P 500 – stejně jako
  ostatní s VT. Štítek „Agresivní“ u Dividendového (95 % akcií) ZŮSTÁVÁ – stejný jako Akciové (80 %). „Za 12 měs. do D. M. v Kč“ =
  nejstarší den výnosů ze složek (vynosyFonduSDatem). **Svět + malé firmy:** náskok proti VT NEDĚLAJÍ malé firmy – nezávisle
  (Yahoo adj. close × kurzy ČNB, 26. 6. 2008 → 21. 10. 2026): celé 11,85 %, jádro bez satelitu (54/22/9 → 100 %) 11,90 %, satelit
  místo S&P (69/22/9) 12,29 %, VT 10,87 % ročně; web 11,84/11,90/10,87. Náskok = pevná vyšší váha USA. Text čísla bere z backtestu
  ({cagr}, {cagrJadro}, {cagrAkcie}; `srovnaniJadro` v PORTFOLIO_BACKTEST). DFSVX od 2. 3. 1993 (ne „44 let“); nečísla bez zdroje
  (~20 bp, QUAL −0,4 %, DFSVX 11,4 %) odstraněna.
- **/fire tabulka míry úspor = funkce** `rokyDoFire` (n = ln(1 + 25(1−s)r/s)/ln(1+r), r = 5 %): 70 % → 8,8 → „~9 let“ (dřív ručně
  „~8,5“). Pravidlo 4 % = Trinity (Cooley, Hubbard, Walz, AAII Journal 2/1998): S&P 500 + americké firemní dluhopisy 1926–1995.
- **/dca-vs-jednorazova:** Vanguard 2012 (Shtekhman, Tasopoulos, Wimmer, str. 4): konečná hodnota 60/40 po 10 letech LSI vs 12měs. DCA
  USA +2,3 %, UK +2,2 %, **Austrálie +1,3 %** (dřív „+1,8 % ročně“ – ani roční, ani 1,8).
- **/etf-vs-akcie:** Bessembinder, Chen, Choi, Wei (FAJ 2023, 1990–2020): 55,2 % amerických a 57,4 % neamerických akcií pod T-bills
  (dřív zkomolené „55 z 57 trhů“).
- **/menove-riziko-etf:** měna se NEvyruší – S&P 500 21. 10. 2016 → 21. 10. 2026 USD 15,5 %/r, CZK 13,9 %/r (kurz 24,82 → 21,59);
  20 let 11,05 × 10,84 %. Yahoo SPY × ČNB = backtest webu (×4,231/×3,681, ×8,143/×7,832).
- **/jak-dlouho-v-minusu:** „s aspoň N lety dat“ = jedna funkce `sAsponLety` (bez posledního rozběhlého měsíce) pro text i tabulky;
  „kleslo pod vklad“ ze stejného vzorku jako „nikdy pod“ (dřív 75 % × 72 %).
- **Mobilní tabulky = `ResponzivniTabulka`** (karty pod 640 px, tabulka nad tím) – /fire, /jak-dlouho-v-minusu, /akumulacni-vs-distribucni-etf,
  /kolik-investovat-mesicne, /dip, /investovani-pro-deti, /svetove-etf-indexy. Nové tabulky v článcích stavět přes ni.
- **/o-nas:** brokery nebodujeme ani neřadíme (abecedně, kalkulačka podle nákladů pro zadanou částku); věta o „prodejcích s tučnými
  provizemi“ přeformulována neutrálně (redakční hranice: bez kritiky bank).

## Kolo 8 – neověřené výnosy, třídy fondů, kategorie žebříčků (22. 10. 2026)

- **Seznam ověřených chyb zdroje (`NEOVERENE_VYNOSY`) platí na CELÉM webu** – `odlehleZTrhu` (src/lib/trhy.ts) vrací
  odlehlé ∪ seznam, takže srovnávač (`_vynX`), žebříčky, porovnání, dvojice, podobné fondy i hledání ukazují „—“; detail
  fondu ukazuje konkrétní důvod (`duvodNeovereni`). Nový druh **'burza'** = výnos nesedí s burzou ani s jinou třídou
  a třídy mají výnosy k různým dnům (pravidlo tříd je nechytí): USAC 1R +5,4 % (burza USAC.PA +18,7 %, Dist LYYB +17,8 %),
  LYSM 3R +274 % (Acc LSMC +302 %, CHIP.MI +302 %), XAD6 5R +108 % (XAD6.MI +142 %).
- **Skok v řadě zdroje skrývá i kolísavost a max. pokles** (druh 'skok', `rizikoSkokem`): HASH ukazoval kolísavost 105,8 %
  a pokles −98 % – burza nic takového nemá. Rizika u těchto fondů „—“ s vysvětlením, ne čísla ze zkažené řady.
- **VHYL × VGWE: kolísavost a pokles ukazuje VHYL, „—“ jen VGWE** (`OVERENA_TRIDA` v src/lib/tridyFondu.ts; ověřeno
  přepočtem z řady i Yahoo VHYL.AS 8,72 / 10,72 %). Nevracet „—“ u obou.
- **Výnosy tříd téhož fondu se musí shodovat** (`vynosTridNesedi`, src/lib/tridyFondu.ts). Výnosy webu jsou S REINVESTICÍ
  dividend, proto rozdíl akumulační a distribuční třídy „≈ vyplacená dividenda“ NENÍ legitimní – je to dividenda, kterou
  zdroj v řadě nemá (ověřeno burzou: QDVV, EYED, 36B1, JGHD, LCVB, LHKG). Zadání kola 8 to chtělo vyloučit jako legitimní;
  nezávislé ověření (Yahoo adjclose) ukázalo opak, platí pravidlo č. 1. Práh = poměr růstu (1+a)/(1+b) − 1: 1R 1,5 %,
  3R 3 %, 5R 5 % (u +300 % by p. b. byly šum); jen třídy ke STEJNÉMU returns_as_of, bez zajištěných a pákových.
  Chybná třída = všechny výnosy za období „—“ (vadná řada v jednom období není důvěryhodná ani v ostatních).
  Spor dvou tříd rozhoduje `OVERENY_VYNOS_TRIDY` (ručně ověřeno burzou), pak kotva indexu (medián ≥ 3 jiných fondů na stejný
  index_name ke stejnému dni), jinak „—“ u obou (QYLU/QYLE 3R obě vedle burzy, HSKD/HBKS, INGB/CEB6, USCBC/USCBD).
  22. 10. 2026 skryto 21 tříd: PRAR, PRAJ, SMIA, SPIA, CHDIVA, CHSRIA, XAD5, QDVV, EYED, 36B1, JGHD, LCVB, LHKG + obě
  třídy u QYLU/QYLE, HSKD/HBKS, INGB/CEB6, USCBC/USCBD (CHSRI ověřená, zůstává).
- **Rozdíl tříd, který má i burza, je skutečnost** (`ROZDIL_TRID_SKUTECNY`): BNP Energy & Metals Enhanced Roll GSDE vs EMEH
  (GSCE.MI +39,3 %, EMEH.PA +31,1 %), UBS CMCI Oil USD vs CHF (CHF třída je zajištěná, název to neříká; poměr burza 1,071 =
  DB 1,073), iShares Europe Min Vol EUN0 vs IS0H (burza +12,5 % vs +9,2 % + div. 0,9 %). Neskrývat.
- **Xtrackers MSCI Pacific ex Japan 1C/1D (DXS6/DXPJ) 1R +9–10 % vs ostatní fondy na MSCI Pacific ex Japan +16 % je
  skutečnost** – burza XPXJ.MI +10,04 %, DXPJ.DE +8,73 %, iShares CSPXJ.MI +15,55 % (20. 10. 2025→2026). Neopravovat.
  Stejně XDEX 3R +83,7 % (burza +83,5 %) proti ostatním EM ex China.
- **Kategorie žebříčků (src/lib/etf-data.ts):** americké = „US“ jen jako celé slovo (`nameMatches` – Postgres `~*`
  `\mUS\M`), vyřazení celých slov (`nameExcludeMatches`: Global – kromě emitenta „Global X“, World, Europe, Latin,
  Emerging, EM, Asia, Japan, UK, Mining…) a zaměření ze zdroje (`focusExcludes`: World, Europe, Emerging…); ilike
  podřetězce chytaly „PLUS “, „Focus “ a „Latin“ v „Accumu-lating“. Vypadlo 27 fondů (S&P Global Mining, Dow Jones Global
  Titans 50, Latin America ×6, S&P Eurozone Climate ×2, S&P Europe ex UK, S&P Select Frontier, HSBC PLUS World ×2, Nordea
  Global ×3, VIX futures, US Medical Devices, kyberbezpečnost ×2…), přibyly 4 fondy na Dow Jones Industrial Average
  (americký index 30 firem – „Industrial“ se tu vyřazuje jen jako sektor „Industrials“). Průmyslové bez DJIA, AI
  a technologické bez „AI Enhanced/Optimized“ (kvantové fondy na celý trh), komoditní bez krypta (Cryptocurrencies).
- **„Nejvýkonnější“ chybí i na nejlevnejsi-etf, akumulačních a distribučních** (BEZ_VYKONU) – výběr podle poplatku/třídy,
  vyhrávaly polovodiče +296 % a Staked Solana +303,8 %.
- **„Co v kategorii je“ = jen indexy, které jsou opravdu mezi 4 nejčastějšími (počítají se i indexy bez popisu) a mají
  aspoň 3 % fondů** – dřív se přeskakovaly indexy bez popisu (americké: Nasdaq CTA Cybersecurity 2 z 275 jako 4. index).
- **Odpověď nahoře na 5 hlavních žebříčcích se liší podle záměru** (`zamerZebricku`, ZAMER v src/lib/zebrickySeo.ts):
  2026 = napříč třídami aktiv, S&P 500 = index + poplatek, americké = medián výnosu, akumulační = reinvestice, nejlevnější
  = od nejnižšího TER. Stále nejvýš 2 věty a jeden práh.
- **Payload žebříčku:** rychlé odkazy jsou prosté `<a>` se stylem na rodiči (dřív `<Link>` s 12 třídami u každého ze
  267 odkazů – v HTML i RSC), výnosy v datech tabulky zaokrouhlené na zobrazenou přesnost (1 desetinné místo, jako
  srovnávač), prázdné příznaky (null/false) se neposílají. Měny se na klientu NEdopočítávají – přepočet kurzem by se lišil
  od výnosu v Kč z DB.
- Hlídá `scripts/check-fund-data.mjs`, blok `kolo8 zebricky` (A kategorie, B třídy, C detail neověřených, D texty a velikost).

## Texty a statické výpočty na stránkách – audit nástrojů (22.–23. 10. 2026)

- **Poplatek fondu se strhává z hodnoty fondu: čistý výnos = (1 + r)(1 − TER) − 1, NE r − TER** – /pruvodce (příklad
  poplatků, `vynosPoPoplatku` v src/lib/prikladPoplatku.ts) i /kalkulacka. 10 000 Kč měsíčně, 20 let, 7 %, TER 0,2 / 1,8 %:
  4 953 725 / 4 091 260 Kč, rozdíl 862 465 Kč (dřív 4 962 000 / 4 149 000 / 813 000). Kontrola v check-fund-data (kolo6 bod 7)
  dřív kopírovala chybu webu (0,068 / 0,052 = kruh) – teď nezávislé konstanty 0,06786 / 0,05074 (1,07 × 0,998 − 1, 1,07 × 0,982 − 1).
- **„7 % ročně“ na /kolik-investovat-mesicne, /dip, /investovani-pro-deti, /pruvodce je MODELOVÝ PŘEDPOKLAD, ne „historický
  průměr“.** Skutečné výnosy v Kč závisí na období (k 21. 10. 2026: celý svět/VT od 2. 7. 2008 11,1 % ročně, S&P 500 od 1/2000
  6,3 % ročně – /kolik-vydelaly-etf, počítá se z dat, nezávisle ověřeno 21. 10.). Stránky na ně odkazují, čísla nepíší natvrdo
  (zastarala by). Neměnit zpět na „dlouhodobý průměr“.
- **/fire „roky do FIRE“ počítá s reálným výnosem FIRE kalkulačky (vyvážené 60/40, 4,6 %) importem `FIRE_PREDPOKLADY`**,
  ne opisem. Dřív „~5 % reálně“ bez zdroje. 50 % úspor → ~17 let, 20 % → ~38 let (víc než dvakrát), 70 % → ~9 let.
- **Dvě různá „60/40“ jsou záměr, ale musí být pojmenovaná:** FIRE kalkulačka, /fire a modelové portfolio 60/40 = VWCE/VT +
  státní dluhopisy eurozóny (Xtrackers XGLE, `eur_govt_bond`); stroj času a /pravidlo-4-procent = VT + americké dluhopisy
  (iShares AGG, `us_aggregate_bond`, data od 10/2003). Texty na /pravidlo-4-procent, /fire-kalkulacka a popis presetu ve
  stroji času (src/lib/strojCasuVypocet.ts) to říkají výslovně. Sjednocení dat = rozhodnutí majitele (otevřené).
- **Časování vkladu ve statických tabulkách = konec měsíce** (/kolik-investovat-mesicne, /investovani-pro-deti, /pruvodce,
  hero /kalkulacka; /dip a /fire na konci roku) a stránky to píší. Investiční kalkulačka a stroj času vkládají na začátku
  měsíce (widgety – sjednocení navrženo, neprovedeno).
- **Pravidlo 4 % na /kolik-investovat-mesicne má výhradu a sloupec 3,5 %**: v Kč by u startů 2000–2002 z čistě akciového
  portfolia peníze došly a u startu 2000 ani 3,5 % a 3 % (S&P 500 3 % došly 9/2017, celý svět 10/2018; /pravidlo-4-procent,
  data k 22. 10. 2026). Sloupec 3,5 % NENÍ „bezpečná“ sazba – text to říká.
- **/investovani-pro-deti: věta o odkladu se generuje z čísel** (`slovniPodil`): 148 291 / 420 918 = 35,2 % → „zhruba třetina
  výsledku (35 %)“, dřív natvrdo „ani ne třetina“. OG obrázek bere částku z výpočtu.
- **Sloupec „5 let celkem (Kč)“ na /dip a /investovani-pro-deti je kumulativní** výnos (return_5y_czk), ne roční průměr – napsáno
  v záhlaví i v poznámce pod tabulkou.
- **Odpočet úroků z hypotéky: 150 000 Kč ročně za domácnost** (§ 15 odst. 4 ZDP, https://www.zakonyprolidi.cz/cs/1992-586,
  znění 1. 8.–31. 12. 2026, ověřeno 22. 10. 2026); **300 000 Kč jen u bydlení pořízeného před 1. 1. 2021** (zákon č. 386/2020 Sb.,
  čl. IV body 3–4, přechodná ustanovení na téže stránce). Úspora při 15 %: 22 500 Kč (u starých případů 45 000 Kč).
- **Daně na /kalkulacka:** časový test 3 roky (§ 4 odst. 1 písm. u) ZDP) platí pro každý nákup zvlášť; hodnotový test = úhrn
  příjmů z prodeje cenných papírů do 100 000 Kč za rok (§ 4 odst. 1 písm. t) ZDP; počítá se tržba, ne zisk). Ověřeno na
  zakonyprolidi.cz 22. 10. 2026.
- **DCA (/dca-vs-jednorazova) – čísla Vanguardu jsou rozdíly KONEČNÉ hodnoty, ne roční výnos** (ověřeno v PDF 22. 10. 2026):
  Vanguard 2023, Finlay & Zorn, „Cost averaging: Invest now or temporarily hold your cash?“
  (https://corporate.vanguard.com/content/dam/corp/research/pdf/cost_averaging_invest_now_or_temporarily_hold_your_cash.pdf):
  str. 5 – 60/40, rozložení do 3 měsíců, po 1 roce LS o 1,8 % víc (109 360 vs 107 453 USD); str. 3 – MSCI World 1976–2022, LS
  poráží CA v 68 %, CA poráží hotovost v 69 %. Vanguard 2012, Shtekhman/Tasopoulos/Wimmer, „Dollar-cost averaging just means
  taking risk later“, červenec 2012 (původní PDF na vanguard.com už PDF nevrací; text ověřen z kopie originálu
  https://indexacapital.files.wordpress.com/2017/07/dollar-cost-averaging-just-means-taking-risk-later-vanguard-2012.pdf):
  str. 3 – USA, LSI poráží 36měsíční DCA v ~90 % desetiletých období; str. 4 – 60/40, 12 měsíců, po 10 letech +2,3 % (UK 2,2 %,
  AU 1,3 %).
- **Monte Carlo neumí výběry z renty** (jen vklady) – /fire ho nenabízí jako „pravděpodobnost úspěchu renty“ a /monte-carlo
  nemá kartu „předčasný důchod / načasování propadů“. Výnosy aktiv v simulátoru se na stránce jmenují „modelové
  (předpokládané)“, ne „historické“ (V3 – čísla nemají doložený zdroj; oprava čísel je ve widgetu).
- **„Aktualizováno 23. října 2026“** u stránek upravených v tomto auditu (redakce.ts) – datum úpravy textu.
- Hlídá `scripts/check-fund-data.mjs`, blok `audit texty` (+ kolo6 bod 7). Před nasazením (produkce bez `data-priklad-vzorec`
  na /pruvodce) jdou nálezy jen do varování.

## Backtest a kvíz – audit nástrojů (22. 10. 2026)

- **Pod 1 rok se výnos NEanualizuje** (V8, zásada GIPS): API pošle `summary.cagr = null`, widget ukáže „Za období +x %“
  (celkový výnos, `celkovyVynos`), XIRR se skryje. Kolísavost, Sharpe, Sortino a VaR jsou „—“ při méně než 12 měsíčních
  výnosech (`MIN_MESICU_RIZIKA`). Reálný výnos pod rok se nepočítá. Nevracet „aby tam bylo číslo“ – 7 týdnů dávalo „40,8 % ročně“.
  **Celý rok JE rok** (oprava hranice 23. 10. 2026, `pokryvaCelyRok` v `src/lib/backtest/simulate.ts`): rok se měří na
  zadaném období (start → konec uživatele), když data krajní dny pokrývají až na neobchodní dny (≤ 5 dní). 1. 1.–31. 12.
  i „posledních 12 měsíců“ (22. 10. 2025 → 21. 10. 2026) tak mají roční výnos = celkový výnos za rok (bez anualizace
  360–364 dní mezi prvním a posledním obchodním dnem). Dřív kalendářní rok vracel null (2024: 2. 1. → 31. 12. = 0,997 roku).
  Kolísavost u kalendářního roku zůstává „—“ (jen 11 měsíčních výnosů konec měsíce → konec měsíce) – záměrně se neměnilo,
  protože přechod na řadu „první den + konce měsíců“ by posunul kolísavost/Sharpe všech ověřených backtestů.
- **Součet vah: odchylka do 0,01 p. b. se normalizuje, větší = 400** (V9). Engine (runBacktest) navíc váhy sám normalizuje
  a při odchylce > 0,01 p. b. hodí výjimku – i serverové předpočty. Dřív prošlo 99–101 % bez normalizace (CAGR 10,14 % místo 10,70 %).
- **Bez počátečního vkladu jde pravidelný vklad i první den** (S8). S počátečním vkladem první den ne – počáteční vklad JE
  investicí prvního měsíce. 0 + 5 000 Kč/měs. od 1/2005 = vloženo 1 310 000 Kč (dřív 1 305 000). Klientská rekonstrukce
  vkladů (zhodnoceniVkladu.ts → XIRR, čára „vloženo“) dělá totéž.
- **Sharpe a Sortino standardně z měsíčních výnosů nad bezrizikovou sazbou MĚNY výpočtu** (S10, N11): CZK = ČNB 2T repo,
  EUR = EONIA (do 9/2019) / €STR, USD = efektivní fed funds; měsíční průměry v `src/lib/backtest/bezrizikovaSazba.ts`
  (generátor `scripts/backtest/generuj-cpi-a-sazby.py`). Sharpe = průměr(r − rf) / výběrová σ(r − rf) × √12, Sortino =
  průměr(r − rf) × 12 / downside odchylka pod rf. Dřív (CAGR − 2 %)/σ s 2 % i pro USD/EUR. Ověřeno nezávisle (Python z holých
  dat): S&P 500 Kč 2005–10/2026 Sharpe 0,648 (web 0,646), USD 0,66, EUR 0,70.
- **VaR 95 % z MĚSÍČNÍCH výnosů** (μ×12 − 1,65σ×√12, stejné výnosy jako kolísavost) + v nápovědě kolik ročních oken v datech
  pod VaR opravdu spadlo (`podilPodVaR`, N10). Dřív z denních výnosů a text „horší jen v 1 roce z 20“ (empiricky 2–9 % oken).
- **API `returns.monthlyReturns`, `horizons` a Monte Carlo jsou z MĚSÍČNÍ řady** (S11; první bod + konce měsíců). Dřív z denní
  („1 rok“ = 12 obchodních dní). Pole se v UI nepoužívají, ale API je veřejné – opraveno, ne smazáno.
- **TER model: historie = poplatek ZDROJOVÉHO fondu, ne fondu k nákupu** (S12). Fond k nákupu (proxyEtf, např. EIMI 0,18 %)
  se do výpočtu nepromítá; u složky se ukazuje „historie z fondu EEM · jeho TER 0,72 % je ve výsledku“ a zvlášť řádek
  „Poplatek v historii“ (vážený sourceTer; „—“, když ho u některé složky nemáme). Přepočet na fond k nákupu = vyhledat konkrétní fond.
- **Inflace: CPI ČSÚ měsíčně od 1/1996** (S18): CEN0101B do 2014, CEN0101E od 2015, báze 2015 = 100. Starý odhad z ročních
  průměrů měl roky 2000–2002 posunuté (2000: 2,4 % místo 3,9 %). Mění reálné výnosy od 2000 a měsíce vyčerpání na
  /pravidlo-4-procent (S&P 500 start 2002: 2/2020 → 1/2021, shodně s nezávislým přepočtem auditu). Měsíce teď platí.
- **Kvíz /vyber-etf: propady všech kategorií ze STEJNÉHO období** (K1) = od nejpozdějšího začátku dat (VT, 26. 6. 2008), stejně
  jako modelová portfolia. Starší krize (dot-com) proto v těchto číslech nejsou – výslovně to píšeme. Delší historie se ukazuje
  zvlášť jen jako fakt o DÉLCE propadu s vlastním obdobím (S&P 500 v Kč od 1/2000: −71,7 %, návrat po 14 letech a 3 měsících),
  kontrolní údaj `data-kontrola-backtest-historie` (mimo srovnávací `data-kontrola-backtest`).
- **Kvíz: riziko → typ výsledku** (V15): „Nechci velké propady“ → konzervativní portfolia, „Zvládnu střední výkyvy“ → umírněná
  (60/40, Nobelovo), „velké výkyvy“ → akciový typ. Horizont 3–10 let → vždy upozornění s fakty o délce propadu (bez doporučení).
  „Chci pravidelný příjem“ + „Reinvestovat“ → upozornění na rozpor (S17). Pravidla = čistá funkce `recommend` ve vyberEtfData.ts;
  check-fund-data testuje všech 162 kombinací.

## UBS MSCI EM: výnos o ~2,5 p. b. pod trhem není chyba – řada zdroje je o 1–2 dny pozadu (31. 10. 2026)

- **Tři akumulační/UK třídy UBS na MSCI EM (LU0950674175, IE00B3Z3FS74, LU1126036976) mají řadu u justETF o 1–2 pracovní
  dny pozadu** – returns_as_of 26./27. 10. 2026, ostatní EM fondy 28. 10. Jejich výnosy jsou ke SVÉMU returns_as_of správně
  (ověřeno nezávisle na řadě justETF a na Xetra IS3N.DE: EM mezi 27. a 28. 10. +2,6 %). Na volatilní dny se proto jejich výnos
  12 m liší od trhu až o ~3 p. b. **Neopravovat** (ani čísla, ani seznam trhů, ani NEOVERENE_VYNOSY).
- **Odlehlé hodnoty se počítají jen mezi fondy se stejným dnem výnosů.** `spocitejTrh` (src/lib/trhy.ts) bere do mediánu,
  testu > 1,5 p. b. i výběru „nejvýkonnější“ jen fondy s returns_as_of = den většiny; ostatní jdou do `pozadu` (na homepage
  s vlastním datem „k 27. 10.“, nevyhrávají, NEJSOU „neověřené“). Dřív se vyřazovaly jen fondy > 3 pracovní dny pozadu
  a tyhle třídy byly skryté jako „odlehlé“ na celém webu. Stejné pravidlo mají obě kopie testu v check-fund-data
  (`sDnemVetsiny`), unit test `scripts/trhy.test.mjs` (`npm test`). Jinde (např. součty výnosů portfolií, getReturnsByIsins)
  platí dál práh > 3 pracovní dny (`vynosyPozadu`, src/lib/datumVynosu.ts) – toho se tohle pravidlo netýká.
