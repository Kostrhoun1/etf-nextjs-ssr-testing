# Ředitelství dat a růstu — pravidelný analytický rytmus

Stálá funkce „firmy" ETFpruvodce.cz: **měřit → vyhodnotit → upravit web → měřit.** Cílem je
**10× organická návštěvnost za 6 měsíců** (viz `STRATEGIE-CEO-FINAL.md`).

## Vlastník a rytmus
- **Vlastník:** Ředitelství dat a růstu (agent/divize pod CEO).
- **Rytmus:** týdně (pondělí ráno) automaticky přes naplánovaný task `ceo-analytika`
  (`~/.claude/scheduled-tasks/`). Měsíčně hlubší revize.
- **Jeden příkaz:** `node scripts/ceo-analytics.mjs 28` — GA4 + Search Console + trend
  vs. minulý snímek + automaticky vypsané příležitosti. Snímky se ukládají do
  `.secrets/analytics-history.json` (gitignored) → drží trend v čase.

## KPI, které sledujeme
1. **Organické prokliky** (GSC) — hlavní metrika cíle 10×; trend vs. baseline.
2. **Imprese + CTR** — poptávka a jak dobře ji chytáme.
3. **Prům. délka návštěvy + zapojení** (GA4) — kvalita obsahu.
4. **Čas na klíčových stránkách** — screener, žebříčky, detaily, kalkulačky.
5. **Návštěvy z AI asistentů** (kanál „AI Assistant") — GEO trakce.
6. **Zařízení** — hlídat mobilní zážitek.

## Playbook — co dělat s příležitostmi
Report vypisuje 3 typy příležitostí. Ke každé je jasná akce:

| Signál | Akce |
|---|---|
| **Dotaz na dosah 1. strany** (pozice 5–20, dost impresí, málo kliků) | Najdi cílovou stránku pro dotaz, posil obsah přesně k záměru dotazu, doplň H2/FAQ s tou frází, přidej vnitřní prolinkování. Pokud stránka pro dotaz chybí, založ ji. |
| **Vysoká imprese + nízké CTR** stránky | Přepiš `title` a meta `description` tak, aby lákaly na proklik (číslo, rok, „v Kč", benefit). |
| **Hodně návštěv + krátký čas** na stránce | Obohatit: infografika, hlubší (ale odlehčený) text, konkrétní data, prolinky na související nástroje, jasný další krok. |
| **Rostoucí dotaz/téma** (trend nahoru) | Rozšířit nebo založit dedikovaný obsah; propojit s existujícími pilíři. |
| **Silná stránka na starém webu** (dle GA4) | Zajistit, že nový web má ekvivalent ≥ starý (parita při cutoveru). |

## Zásady
- Změny jdou na aktuální pracovní větev (nyní `cutover/produkce`) malými commity s jasnou hláškou.
- Nikdy neměň fakta/daně bez ověření; obsah musí zůstat pravdivý (viz [[indexace-je-o-obsahu]]).
- Klíč `.secrets/gsc-service-account.json` NIKDY do gitu ani do chatu.
- Po každé revizi: 1 řádek do `.secrets/analytics-history.json` (dělá skript) + krátký souhrn
  vlastníkovi (co se změnilo a proč).

## Historie top stránek starého webu (baseline pro paritu, 90 dní k 2026-07-05)
`/` (brána, 30 s) · **`/srovnani-etf` (490, 2 m 1 s — flagship)** · `/nejlepsi-etf` (339, 24 s) ·
`/portfolio-strategie` (169, 40 s) · `/co-jsou-etf` (127, 1 m 22 s) · detaily ETF (CSPX/SWDA/VWCE,
~1 min) · `/kalkulacky/backtest-portfolia` (106, 46 s). Kanály: 67 % organic, 25 % direct,
AI asistenti ~12/měs. Zařízení: 76 % desktop / 22 % mobil.
