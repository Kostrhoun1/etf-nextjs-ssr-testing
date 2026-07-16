# Backlog — priorizované (CEO smyčka bere odshora)

Formát: `[ ]` = čeká, `[~]` = rozpracováno, `[x]` = hotovo (přesuň dolů do Hotovo).
Řazení = priorita (dopad na cíl 10× × jistota). Denní smyčka vezme první `[ ]`/`[~]`,
udělá 1 increment, aktualizuje stav a přidá nově objevené položky.

## Teď (P0–P1)
- [ ] **Reálná koruna – dotáhnout napříč webem**: backtest už reálné zhodnocení má (viz Hotovo).
  Zbývá: (a) reálná KONEČNÁ hodnota („v dnešních penězích") jako druhý řádek u konečné hodnoty,
  (b) reálný výnos v /kalkulacky (investiční, poplatky, Monte Carlo), (c) reálná osa v grafu vývoje
  (deflované řady se zatím neposílají – dopočítat z `evolution` přes `inflationFactor()`).
  Data + metodika hotové v `src/lib/backtest/inflation.ts` (ČSÚ CPI, ověřeno).
- [ ] **CPI před rokem 2015 zpřesnit na měsíční**: `inflation.ts` má měsíční index jen od 2015-01
  (ČSÚ open data CEN0101E), starší roky dopočtené z roční míry inflace + interpolace uvnitř roku.
  Roční kotvy jsou oficiální, uvnitř roku jde o odhad. Dohledat dlouhou měsíční řadu ČSÚ (od 1995)
  a nahradit back-cast. Priorita nízká – na víceletém horizontu je odchylka zanedbatelná.
- [ ] **Drobnosti z tech auditu**: contrast ratio (a11y) na homepage; LCP homepage 2,7s → odblokovat render (250ms) + unused CSS 19KB / legacy JS 14KB.
- ⛔ **REDAKČNÍ HRANICE (obsah):** autor Tomáš Kostrhoun je šéf spotřebitelských úvěrů v České spořitelně → ŽÁDNÁ kritika bank/bankovních produktů, NEPSAT o úvěrech/půjčkách/dluzích (konflikt zájmů). Inflaci/poplatky/nominál-vs-reál piš neutrálně. Platí pro všechny články.
- [ ] **Seznam Medium = kanál dosahu + přímý funnel** — 4 dřívější články měly ~700 čtenářů PŘÍMO NA MEDIUM (ne prokliky k nám!). POZOR: odkazy z medium.seznam.cz jsou nejspíš nofollow → NENÍ to SEO backlink, ranky nezvedne. Jediná měřitelná hodnota k cíli = (a) přímý PROKLIK čtenáře na web + (b) brand/awareness (→ pozdější branded/direct hledání). Proto každý článek stojí a padá na síle prokliku: háček = náš interaktivní nástroj, který Medium neumí (srovnávač/kalkulačka/žebříček). Sledovat referral „medium.seznam.cz" v GA4. Zjistit témata 4 úspěšných článků → podobný duch, neduplikovat.
- [ ] **Dotaz „etf" na dosah 1. strany** (poz. ~9,7, 201 impr., 0 kliků) — posílit cílovou stránku (pilíř „Co jsou ETF" / homepage) obsahem a prolinky přesně k záměru.
- [ ] **Ověřit daňové konstanty 2026** (čistá mzda + strop soc. pojištění) proti oficiálním zdrojům — kritické pro důvěryhodnost.

## Brzy (P2)
- [ ] **Mobilní polish (zbytek z auditu):** portfolio holdings tabulka (min-w-34rem) → mobilní kartová varianta; ETF detail WeightRow w-40→w-28 na mobilu; "Kde se obchoduje" tabulka wrap do overflow-x-auto; sjednotit výšku heru na všech stránkách (py-4 md:py-7). Hlavní mobilní bloky (homepage, srovnání, menu-hledání) HOTOVY.
- [ ] **Vlajkový nástroj „reálná koruna"** — hrubý výnos → −poplatky → −daň (časový test) → −inflace = reálná čistá koruna (jádro USP). Inflační vrstva už existuje (`inflation.ts`), zbývá poplatky+daň v jednom toku.
- [ ] **Kurzový dopad** — aktualizovat výchozí kurzy 2026, odstranit vymyšlené „pravděpodobnosti scénářů".
- [ ] **Backtest — rebalancing do UI**: engine umí `compareRebalancingStrategies`, ale nástroj to neukazuje (nabídnout „kdy se rebalancovat vyplatilo").
- [ ] **Portfolia — dokončit best-practices**: „underwater" graf propadů + reálný (po inflaci) výnos.

## Průběžně
- [ ] **Obsah**: týdenní SEO článek (viz `obsah-tydenni-clanek`) + rozšiřovat tenká místa; jedinečnost kvůli indexaci.
- [ ] **Cutover parita**: zajistit, že nový web má ekvivalent ≥ starý u top stránek (dle `ANALYTIKA-REPORTING.md` baseline) — před GO.

## Hotovo (poslední)
- [x] **Reálné zhodnocení po inflaci v /backtest** (16.7.2026) — `inflation.ts` (ČSÚ CPI, měsíční index
      2015+ z open dat CEN0101E + roční míra inflace zpět k 1999), engine počítá `realCAGR` z deflovaného
      NAV, nástroj ukazuje „X % ročně reálně, po inflaci" u ročního zhodnocení. Buffett 90/10 od 2002:
      8,8 % nominálně → **5,6 % reálně**.
- [x] **Ověřeno (16.7.2026), že tyto položky už byly hotové** – vyřazeny z backlogu, ať smyčka neplýtvá:
      screener /srovnani perf (progresivní načítání, live Perf 92), SEO title/description homepage,
      FIRE hub `/fire`, kolísavost v enginu (anualizace bere skutečnou frekvenci dat – NEbyla vadná)
      a Sharpe/Sortino/VaR/Calmar už v UI backtestu.
- [x] Hledání ETF (10 tickerů + relevance) · živý našeptávač · popisy indexů + oprava počtů
- [x] Modelová portfolia: reálný backtest + krize + roční výnosy + klouzavé výnosy + souhrn
- [x] FIRE metodika (valorizace vkladu, pryč Math.sin) · datum aktualizace = reálné datum dat
- [x] Odstraněny duplicity v hlavičce (Filtrovat, Srovnávač) · logo → ETF průvodce.cz
- [x] Ředitelství dat a růstu: `ceo-analytics.mjs` + `ANALYTIKA-REPORTING.md` + týdenní task
