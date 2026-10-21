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

**Výnosy za období platí k `returns_as_of` = PŘEDPOSLEDNÍMU pracovnímu dni řady zdroje, ne ke dni před stažením (21. 10. 2026).**
Scrape v út 01:30 UTC tedy ukáže „Data k“ pátku/pondělí o den starší, než by čekal člověk – ZÁMĚR. Zdroj (justETF) vede
poslední den nejdřív předběžně (≈ závěr Xetry) a konečnou hodnotou (NAV) ho přepíše až další den; výnosy k němu byly
o 0,2–0,9 p. b. vedle (SXR8 19. 10.: 743,07 → 739,32). Výpočet: etf-astro `scraper/vynosy_z_rady.py` (jedno volání
chart API, RELATIVE_CHANGE – ne MARKET_VALUE, ta má u levných fondů chybu zaokrouhlení až 0,1 p. b.).
- Fondy se zpožděnou řadou u zdroje (ESEA, PSP5, S5USAS, WSPX…) mají VLASTNÍ, starší den – web ho u nich ukazuje
  („výnosy k 16. 10. 2026“). „Data k“ stránky = nejčastější `returns_as_of` (src/lib/datumVynosu.ts).
- Fond pozadu o víc než 3 pracovní dny není v mediánech, kartě „Nejvýkonnější“ ani v součtech portfolií (jiné období).
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

**Riziko (σ, Sharpe, Sortino) se počítá z MĚSÍČNÍCH výnosů, ne denních.** `calculateSummary`
používá `resampleMonthEnd`. Není to nepřesnost — zdrojová denní data mají ojedinělé vadné ticky
na začátku měsíce (splice denního ETF a měsíčního zdroje; např. `ftse_all_world` 2008-10-01 =
23.09 mezi 29.39 a 27.40), které denní σ×√252 nafukovaly (All-World 13 % → 31 %). Month-end sampling
je zahodí. **Nevracet na denní „kvůli přesnosti"** — reintrodukuje to bug. Drawdown už jede stejně.
Od 17. 10. 2026 je engine při čtení vynechává (`bezVadnychTicku` v engine.ts: víkendy a 1. den v měsíci v denních úsecích) – NEodstraňovat, jinak se vrátí chybné výsledky backtestů začínajících 1. dne v měsíci. Zbývá úklid: vyčistit vadné ticky přímo v `index_historical_data` (integrity check je nechytá –
hlídá ocas/díry/počty, ne odlehlé hodnoty).

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
stříbro, bitcoin – `INDEXOVE` v nejlepsi-etf/[slug]/page.tsx) karta „Nejvýkonnější“ ZÁMĚRNĚ CHYBÍ** –
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
- **Složení fondu nemá na webu konkrétní datum** – DB (`etf_funds`) žádný sloupec s datem složení nemá (justETF ho
  uvádí, scraper ho neukládá). Proto popisek „Podle posledního zveřejnění emitenta – obvykle 1–2 měsíce zpětně“. Až
  scraper (etf-astro) datum začne ukládat, nahradit „Složení k …“.
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
  štítek „nejlevnější“: seznam ETF Selection ověřený nemáme. Neopravovat na jednu sazbu.

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

- **Hlavní spouštění = Supabase pg_cron: `scraper-spusteni` út–pá `30 1 * * 2-5` UTC (3:30 SELČ, hotovo ~8:00 před
  otevřením Xetry) a `scraper-spusteni-pondeli` po `0 5 * * 1` UTC (víkendový přepis pátečního bodu u zdroje – v pondělí
  raději později)**, které přes
  GitHub API spustí workflow `scrape.yml` (workflow_dispatch). Token = fine-grained PAT jen pro etf-astro, Actions: write,
  ve Vault jako `github_scraper_dispatch`, **platnost 1 rok (do ~20. 10. 2027) – včas obnovit**. GitHub plán v scrape.yml je
  jen ZÁLOHA (`23 8 * * 1-5`, job `hlidac` ji přeskočí, když ten den už běh proběhl/běží).
- **Proč ne GitHub cron:** plánované běhy zdržuje o 4–7 h (00:37 UTC startovalo ~05:10 UTC). **Proč ne večer (22:00):**
  zdroj má za daný den večer předběžnou cenu – výnosy za období by byly ze smíšené řady. **Proč ne o víkendu:** ceny se
  nemění a víkendový scrape 18. 10. stáhl předběžný bod pátku (SXR8 letos +18,64 % místo +17,69 %). Víkend bez scrapu
  je záměr – data „k pátku“ s datem jsou správně. ⚠️ OPRAVA 21. 10. 2026: předpoklad „hodnota všedního dne se po večeru nemění“
  NEPLATÍ – zdroj přepisuje bod dne D předběžné → konečné během dne D+1 (SXR8 19. 10.: 743,07 do 20. 10. 05:25 UTC,
  pak 739,32). Čas startu to neřeší → scraper počítá výnosy za období z denní řady zdroje a končí posledním JISTĚ
  konečným dnem (předposlední obchodní den řady), per-fund `returns_as_of` (větev vynosy-konecna-rada).
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
