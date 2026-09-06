# Měsíční kontrola dat (1. v měsíci)

Stránky zobrazují „Aktualizováno {1. dne aktuálního měsíce}" – datum se generuje automaticky.
Aby nešlo o klamavé tvrzení, je nutné **jednou měsíčně ověřit** editorská (napevno zadaná) data níže.
ETF data (ceny, výnosy, TER) se aktualizují automaticky denně přes scraper – ta kontrolovat netřeba.

## Co ověřit (napevno v kódu, nemění se automaticky)

### Daňové parametry – čistá mzda (mění se ročně)
Soubory: `src/utils/netSalaryCalculations.ts`, `src/components/design-preview/CistyPlatWidget.tsx`
- **Průměrná mzda pro daňové účely** – dnes `48967` Kč (2026). Zdroj: MPSV / finanční správa.
- **Hranice 23 % sazby** = 36× průměrné mzdy / 12 = dnes `146 901` Kč/měs. (odvozeno automaticky z konstanty výše).
- **Sleva na poplatníka** – `2570` Kč/měs (30 840 Kč/rok). Zdroj: zákon o daních z příjmů.
- **Slevy na děti** – `1267 / 1860 / 2320` Kč/měs.
- **Minimální mzda** – `22400` Kč (2026, jen zobrazení). Zdroj: MPSV.
- Sazby pojistného: sociální 7,1 % (6,5 + 0,6), zdravotní 4,5 %; zaměstnavatel 24,8 % + 9 %.

### Poplatky a ochrana brokerů (mění se dle ceníků)
Soubor: `src/data/brokerData.ts`
- Poplatky za nákup ETF, konverze měn, min. vklady u všech 6 brokerů.
- Ochrana prostředků (banky 100 000 EUR vs nebankovní ~20 000 EUR; IBKR = irský ICS, ne SIPC).
- XTB: 0 % do 100 000 EUR/měs. obratu, nad limit 0,2 %.
- Zdanění CZ dividend (15 % Fio/IBKR/Portu vs 35 % XTB/DEGIRO).

### Rok v popiscích/SEO (jednou ročně, sjednoceno s ostrým webem)
- Slug + label `nejlepsi-etf-2026`, `cisty-plat-2026`, kategorie „ETF 2026" apod. Viz [[rok-2026-migrace]] v paměti.
- Při přechodu na 2027: přejmenovat slug + přidat 301 redirect (stejný postup jako 2025→2026).

## Postup
1. Projít zdroje výše, porovnat s hodnotami v kódu.
2. Kde se něco změnilo, upravit konstantu/text (u daní POZOR – chybná daň = kritická chyba, ověřit dvěma zdroji).
3. **Vždy na konci bumpnout `EDITORIAL_CHECK_DATE` v `src/lib/editorial-check.ts`** – i když se nic nezměnilo.
   To je jediné místo v repu; datum se propíše na `/cisty-plat`, `/srovnani-brokeru`,
   `/kde-koupit`, `/broker` a `/recenze/[broker]` jako „ověřeno k …".
   (Pozor: `getDataDate()` v `src/lib/etf-data.ts` je něco jiného – to je datum posledního
   scrapu ETF dat a posouvá se samo denně. Na editorská data se použít nesmí.)

## Otevřené nálezy (čeká na rozhodnutí)

*Žádné.* (Poslední tři uzavřeny 6. 9. 2026 – viz níže.)

## Vyřešené nálezy

### 6. 9. 2026 – opraveno (nálezy z kontrol 1. 8. a 1. 9.)
- **DEGIRO „Core Selection" → „ETF Selection" dokončeno.** Přejmenování bylo rozpracované napůl;
  doděláno všech 25 zbylých výskytů v `broker/page.tsx`, `kde-koupit/page.tsx`, `page.tsx`,
  `BrokerScore.ts`, `brokerContent.ts` a `BrokerFeeTable.tsx`. Jedna historická zmínka
  („dříve Core Selection") ponechána záměrně v hlavním vysvětlení na `/broker`, ať staršího
  čtenáře nezmate. Formulace „ETF z ETF Selection" uhlazeny na „ETF ze seznamu ETF Selection"
  / „ETF mimo tento seznam". Názvy proměnných (`coreMonthlyCzk`) ponechány – nejsou vidět.
- **XTB počty vyřešeny přes primární zdroj.** „1 800+ ETF" se doložit nedalo (a `brokerContent.ts`
  ř. 84 navíc tvrdil „1 600 ETF" – web si odporoval sám se sebou). XTB samostatný počet ETF na
  svých stránkách nepublikuje; uvádí jen souhrn **„9 600+ cenných papírů z EU a USA"**. Číslo
  nahrazeno tímto tvarem (`brokerData.ts` ř. 55 + 61, `brokerContent.ts` ř. 84) – stejný
  kombinovaný formát, jaký už měl IBKR („14 000+ akcií a ETF celkem"). Zdroj: https://www.xtb.com/cz
- **Fio – ochrana prostředků rozlišena.** `'100 000 EUR (CZ)'` → `'100 000 EUR (hotovost, FPV),
  20 000 EUR (cenné papíry, GFOCP)'` (`brokerData.ts` ř. 83) a přeformulován verdict + pros
  v `brokerContent.ts` (ř. 151, 155). Pojištění vkladů se na ETF nevztahuje – ty kryje Garanční
  fond obchodníků s CP. Stejný vzor už používal Trading 212 (ř. 215).
- **Fio, poplatek za evropské ETF.** `0,79 % s minimem 7,95 EUR` byla zastaralá sazba; ceník
  účinný od 1. 7. 2026 má na XETRA pevné částky (3,95 EUR do 1 400 EUR, 4,95 EUR do 3 000 EUR,
  nad to 0,15 % min. 6,95 EUR). Opraveno v `brokerData.ts` ř. 84 + 215 a v 5 pasážích
  `brokerContent.ts` (forWhom, feesText, verdict, cons, FAQ) – včetně modelového příkladu,
  který nově uvádí necelá 2 % z nákupu za 5 000 Kč místo původních „přes 3 %".
  Zdroj: https://www.fio.cz/docs/cz/C_zaklad.pdf
- **Portu, ochrana prostředků.** `protection: '100 000 EUR (CZ)'` → `'20 000 EUR (Garanční fond
  OCP)'` (`brokerData.ts` ř. 182). Portu není banka, pojištění vkladů se na něj nevztahuje.
- **Portu, správcovský poplatek.** `0,47-1 %` byl ze starého sazebníku → nově pásma 1 / 0,8 /
  0,6 / 0,4 % podle objemu se slevou za fixaci až 40 % (minimum 0,24 %, běžné portfolio do
  půl milionu 0,6–1 %). `brokerData.ts` ř. 184 + 4 pasáže `brokerContent.ts`.
- **IBKR, konverze měn.** `0,2 % (min. 2 EUR)` nadsazovalo poplatek 100× → `0,002 % (min. 2 USD)`
  (0,20 bazického bodu). `brokerData.ts` ř. 216 + 3 pasáže `brokerContent.ts`. Oprava mimochodem
  potvrzuje tvrzení „nejlevnější konverze mezi brokery", které při 0,2 % neplatilo
  (Trading 212 má 0,15 %). Zdroj: https://www.interactivebrokers.ie/en/pricing/commissions-spot-currencies.php
- **IBKR, zdanění českých dividend.** `comparisonData` ř. 219 `'15%'` → `'35% (vratka možná)'`,
  v souladu s `czDividends: '35%'` v profilu brokera. Zároveň přepsána pasáž ve `feesText`, která
  slévala dva různé mechanismy: W-8BEN snižuje srážku z **amerických** dividend z 30 % na 15 %
  (to umí i XTB), kdežto **české** dividendy drží IBKR na sběrném účtu, kde depozitář nezná
  konečného vlastníka a sráží plošných 35 %. Doplněn con a upravena FAQ.
  Zdroj (mechanismus popsaný brokerem): https://www.xtb.com/cz/help-center/danove-priznani/srazkova-dan-z-akcii
- Ověřeno, že `kde-koupit/page.tsx` ř. 82 už IBKR mezi 35% brokery řadil správně – nekonzistentní
  byla jen srovnávací tabulka v `brokerData.ts`.
