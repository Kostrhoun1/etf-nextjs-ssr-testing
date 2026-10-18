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

**Zrušené žebříčky → 301:** `etf-zdarma-degiro` (rozhodnutí majitele: seznam „zdarma" nejde udržet
ověřený; přesměrování na recenzi DEGIRO, ta zůstává), duplicity `globalni`→`celosvetove`,
`clean-energy`→`obnovitelne-zdroje`, `nemovitostni`→`realitni`, `zlate`→`zlato`. Nevytvářet znovu.

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
že **zůstává**. Neodstraňovat. Počet fondů v textu musí odpovídat realitě (dřív „4300+“, teď „více než 5 000“).

## Homepage = srovnávač, ne investiční web (rozhodnutí majitele 18. 10. 2026)

Na homepage nepatří simulace „kolik by z toho bylo za X let“ (dřív hero box „5 000 Kč měsíčně od 2010
→ 2,9 mil. Kč“), výnosy modelových portfolií ani dlaždice „Jak si vedou trhy“. Simulace patří do nástrojů
(/stroj-casu, /backtest). Kontrola čísla stroje času proto hlídá /stroj-casu, ne homepage.

## Ověřené „podivné“ hodnoty (18. 10. 2026) – nejsou to chyby

- **Volatilita korejských ETF ~58 %** (FLXK, LKOR, IQQK, CEBJ, DBX8, H4Z9; výnos 1R +87–94 %): skutečnost.
  Nezávisle z denních cen Yahoo za 1 rok: EWY (USD) 58,1 %, CSKR.L 51,2 %. Neopravovat.
- **Xetra-Gold (4GLD) letos −0,75 % v EUR, ale SGLN/SGLD +1,18 %:** obojí sedí. Xetra 31. 12. neobchoduje,
  takže letošní výnos 4GLD se počítá od 30. 12. 2025. Zlato 31. 12. spadlo o 1,3 % (IGLN.L 84,75 → 83,65 USD).
  Yahoo 4GLD.DE od 30. 12.: −0,78 %. SGLN v USD −3,15 %, přepočteno do EUR (EUR/USD 1,1747 → 1,1242) +1,2 %.
  Rozdíl je jen den, od kterého se letošní výnos počítá. Výnos za 1R je u obou stejný (+1,49 / +1,37 %).

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
