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
Zbývá úklid: vyčistit vadné ticky přímo v `index_historical_data` (integrity check je nechytá –
hlídá ocas/díry/počty, ne odlehlé hodnoty).

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
