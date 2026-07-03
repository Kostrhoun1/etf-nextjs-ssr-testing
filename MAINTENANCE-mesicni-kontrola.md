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
3. Pokud se nic nezměnilo, není třeba nic dělat – datum „Aktualizováno" zůstává pravdivé.
