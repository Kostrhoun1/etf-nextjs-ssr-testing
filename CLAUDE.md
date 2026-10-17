# etfpruvodce.cz – instrukce pro práci na projektu

## PRAVIDLO Č. 1: DATA MUSÍ BÝT SPRÁVNĚ

Rozhodnutí majitele (17. 10. 2026). Má přednost před vším ostatním – rychlostí, novými funkcemi,
SEO, designem i termíny. Když se cokoli z toho dostane do sporu se správností dat, vyhrává správnost.

Jsme datový web: jedno špatné číslo podkope důvěru ve všechna ostatní. Proto:

1. **Raději žádné číslo než špatné.** Když hodnota chybí, je zastaralá nebo nejistá, ukaž „—" nebo
   varování. Nikdy tichý fallback (např. EUR vydávané za Kč, stará data vydávaná za dnešní).
2. **Každé číslo má datum.** Návštěvník vidí, k jakému dni data platí. Stáří dat fondu se měří
   `scraping_date`, nikdy `updated_at`.
3. **Nic nového ven bez nezávislého ověření** – tři kroky:
   - přepočet mimo vlastní kód (z holých dat),
   - externí kotva (kurzy ČNB/ECB, ČSÚ, emitent fondu, justETF, publikovaná studie),
   - kontrola smyslu (CAGR = (konec/začátek)^(1/roky) − 1; stejné CAGR v různých měnách = chyba).
   Nikdy neověřovat jen proti vlastnímu nástroji – to je kruh.
4. **Každá nalezená chyba v datech = oprava + automatická kontrola**, která by ji příště chytila sama
   (`scripts/check-fund-data.mjs`, běží denně; poplach jde e-mailem). Oprava bez kontroly není hotová.
5. **Podezřelé číslo se prověří hned**, ne „někdy". Extrémní hodnota je buď chyba, nebo ověřená
   skutečnost (a pak to zapiš do `ZAMERNA-ROZHODNUTI.md`, ať to nikdo neopravuje).
6. **Opravy dat se ověřují po nasazení na produkci**, ne jen lokálně.

Proč: audit 17. 10. 2026 našel ~640 fondů s půl roku starými daty vydávanými za dnešní a roční výnosy
v Kč/USD špatně na každém detailu fondu (SXR8 2025 v USD +0,02 % místo +17,6 %). Obě chyby byly
roky „věrohodné" – nikdo je nezávisle nekontroloval. Podrobnosti: `PLAN-OPRAV-2026-10.md`.

## Další stálá pravidla

- Záměrná rozhodnutí (co vypadá jako chyba, ale je záměr): `ZAMERNA-ROZHODNUTI.md`. Přečti před
  „opravou" čehokoli podivného.
- Plán oprav a růstu s aktuálním stavem: `PLAN-OPRAV-2026-10.md`.
- Scraper a noční joby jsou v repu `etf-astro` (`/Users/tomaskostrhoun/Documents/etf-astro`).
- Bez cookie lišty a bez nástrojů vyžadujících souhlas. Bez témat úvěrů, hypoték a páky na dluh,
  bez kritiky bank.
- Max. jeden produkční deploy denně (každý deploy maže ISR cache, free tier Vercelu má limit zápisů).
