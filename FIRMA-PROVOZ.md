# ETFpruvodce.cz — provozní model AI-řízené firmy

Jak firmu reálně řídí CEO (agent) kontinuálně a samooptimalizovaně směrem k cíli.

## Severka
**10× organická návštěvnost do ~2027-01** (viz `STRATEGIE-CEO-FINAL.md`, [[ceo-mise-10x-navstevnost]]).
USP: „kolik reálně vyděláš v korunách po daních a inflaci" ([[firma-usp-org]]).

## Řídící smyčka (každý běh)
1. **Zorientuj se** — přečti `BACKLOG.md` (priority), poslední snímek `.secrets/analytics-history.json`, `ANALYTIKA-REPORTING.md` (playbook).
2. **Rozhodni** — vyber 1 nejhodnotnější akci vůči severce (dopad × jistota × soulad s cílem).
3. **Proveď** — 1 fokusovaný increment. Nový design pod `src/app/design-preview/*`.
4. **Ověř** — build/preview, fakta a daně nikdy neměň bez ověření (pravdivost > kvantita).
5. **Zapiš** — malý commit na pracovní větev + `git push`; v `BACKLOG.md` odškrtni hotové a přidej nově objevené; krátký report vlastníkovi.
Nikdy nenasazuj na produkci sám — cutover je GO vlastníka (viz níže).

## Rytmus v Claude Code (naplánované tasky, `~/.claude/scheduled-tasks/`)
| Task | Kdy | Divize | Co dělá |
|---|---|---|---|
| `ceo-denni-provoz` | Po–Pá ráno | CEO / Produkt | 1 increment z BACKLOG.md (feature/UX/SEO/polish), commit, report |
| `ceo-analytika` | Po ráno | Data a růst | GA4+GSC report, vyhodnocení, změny dle playbooku, postup k 10× |
| `obsah-tydenni-clanek` | St ráno | Obsah | 1 SEO článek (téma z GSC poptávky) do `content/drafts/` k publikaci |
Tasky běží, když je appka spuštěná (jinak při příštím startu). Report chodí jako notifikace.
Vlastník je „board" — čte reporty, koriguje směr, dává GO na cutover.

## Organizace (C-suite agentů pod CEO)
- **CEO** — strategie, priorizace, exekuce smyčky, reporty.
- **Ředitel dat a růstu** — měření, příležitosti, SEO/GEO (`ANALYTIKA-REPORTING.md`).
- **Ředitel obsahu** — kategorie/průvodce/články, jedinečnost a hloubka kvůli indexaci.
- **Ředitel produktu** — screener, žebříčky, portfolia, kalkulačky, UX, mobil.
- **Ředitel kvality/rizika** — QA před cutoverem, správnost dat, daňová/legal přesnost, disclaimery.
Jednorázově je spouštěj jako subagenty (research/audit/paralelní práce), když se to vyplatí.

## Kadence — doporučení
- **Denně** běží lehká smyčka (1 increment) — to je ta „kontinuální" samooptimalizace.
- **Týdně** hlubší revize dat + obsahový článek.
- **Ty (vlastník)** nemusíš spouštět nic ručně; jen čteš reporty a jednou za čas řekneš směr nebo „GO na ostro". Když chceš zásah hned, napiš úkol do chatu — má přednost.

## Guardraily
- Změny jen na pracovní větev (`cutover/produkce`), malé commity, jasné hlášky.
- Produkce/doména = jen na explicitní GO vlastníka.
- Tajné klíče (`.secrets/`) nikdy do gitu ani do chatu.
- Publikování navenek (články, sociální sítě) = návrh/draft; skutečné zveřejnění potvrzuje/odklikává vlastník.
