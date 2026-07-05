# Backlog — priorizované (CEO smyčka bere odshora)

Formát: `[ ]` = čeká, `[~]` = rozpracováno, `[x]` = hotovo (přesuň dolů do Hotovo).
Řazení = priorita (dopad na cíl 10× × jistota). Denní smyčka vezme první `[ ]`/`[~]`,
udělá 1 increment, aktualizuje stav a přidá nově objevené položky.

## Teď (P0–P1)
- ⛔ **REDAKČNÍ HRANICE (obsah):** autor Tomáš Kostrhoun je šéf spotřebitelských úvěrů v České spořitelně → ŽÁDNÁ kritika bank/bankovních produktů, NEPSAT o úvěrech/půjčkách/dluzích (konflikt zájmů). Inflaci/poplatky/nominál-vs-reál piš neutrálně. Platí pro všechny články.
- [ ] **Seznam Medium = kanál dosahu + přímý funnel** — 4 dřívější články měly ~700 čtenářů PŘÍMO NA MEDIUM (ne prokliky k nám!). POZOR: odkazy z medium.seznam.cz jsou nejspíš nofollow → NENÍ to SEO backlink, ranky nezvedne. Jediná měřitelná hodnota k cíli = (a) přímý PROKLIK čtenáře na web + (b) brand/awareness (→ pozdější branded/direct hledání). Proto každý článek stojí a padá na síle prokliku: háček = náš interaktivní nástroj, který Medium neumí (srovnávač/kalkulačka/žebříček). Sledovat referral „medium.seznam.cz" v GA4. Zjistit témata 4 úspěšných článků → podobný duch, neduplikovat.
- [~] **FIRE hub** `/design-preview/financni-nezavislost` — vlajková „míra úspor → roky do FIRE" (MMM), pak FIRE číslo, Coast FIRE, renta/bezpečný výběr, Barista. Diferenciátor = česká daňová specifika (časový test 2026, akumulační vs distribuční, proč Čech nemá US-domiciled ETF, DIP two-bucket). Podklad: rešerše v transcriptu + [[redesign-novy-web-stav]].
- [ ] **SEO CTR homepage** — homepage má ~270 impresí a ~0 % CTR; přepsat `title`/`description` (číslo, rok, „v Kč", benefit), ať láká proklik.
- [ ] **Dotaz „etf" na dosah 1. strany** (poz. ~9,7, 201 impr., 0 kliků) — posílit cílovou stránku (pilíř „Co jsou ETF" / homepage) obsahem a prolinky přesně k záměru.
- [ ] **Ověřit daňové konstanty 2026** (čistá mzda + strop soc. pojištění) proti oficiálním zdrojům — kritické pro důvěryhodnost.

## Brzy (P2)
- [ ] **Reálné (inflačně očištěné) hodnoty** do investiční / poplatků / Monte Carla (do FIRE už přidáno).
- [ ] **Vlajkový nástroj „reálná koruna"** — hrubý výnos → −poplatky → −daň (časový test) → −inflace = reálná čistá koruna (jádro USP).
- [ ] **Kurzový dopad** — aktualizovat výchozí kurzy 2026, odstranit vymyšlené „pravděpodobnosti scénářů".
- [ ] **Backtest engine — kolísavost**: ověřit `standardDeviation` (jeví se podhodnoceně), pak vytáhnout do UI Sharpe/VaR/reálný CAGR + rebalancing (engine je má).
- [ ] **Portfolia — dokončit best-practices**: „underwater" graf propadů + reálný (po inflaci) výnos.

## Průběžně
- [ ] **Obsah**: týdenní SEO článek (viz `obsah-tydenni-clanek`) + rozšiřovat tenká místa; jedinečnost kvůli indexaci.
- [ ] **Cutover parita**: zajistit, že nový web má ekvivalent ≥ starý u top stránek (dle `ANALYTIKA-REPORTING.md` baseline) — před GO.

## Hotovo (poslední)
- [x] Hledání ETF (10 tickerů + relevance) · živý našeptávač · popisy indexů + oprava počtů
- [x] Modelová portfolia: reálný backtest + krize + roční výnosy + klouzavé výnosy + souhrn
- [x] FIRE metodika (valorizace vkladu, pryč Math.sin) · datum aktualizace = reálné datum dat
- [x] Odstraněny duplicity v hlavičce (Filtrovat, Srovnávač) · logo → ETF průvodce.cz
- [x] Ředitelství dat a růstu: `ceo-analytics.mjs` + `ANALYTIKA-REPORTING.md` + týdenní task
