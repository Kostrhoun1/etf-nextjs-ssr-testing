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

**Tři EUR dluhopisové indexy mají `managed: false`** (`eur_govt_bond_1_3y`, `_3_7y`, `_15_30y`).
Není to opomenutí — jejich původ se nepodařilo ověřit (odchylka 2,1 / 11,6 / 2,4 %), tak je loader
schválně nechává být. Zapnout až po dohledání zdroje.

**Poplatek řídí engine z manifestu (`sourceTer`), ne `item.ter` z widgetu.**
Data jsou NAV reálného fondu (poplatek v ceně); engine je vzorcem `[(1−desiredTer)/(1−sourceTer)]^roky`
přepočítá na požadovaný poplatek. Default `desiredTer = sourceTer` → **data beze změny**. `item.ter` ve
widgetu je jen na zobrazení — needituj kvůli němu výpočet. (Dvojitý odečet opraven 16. 7. 2026, čísla
na webu +1,7 %.) → paměť `ter-dvojity-odecet-oprava`

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
