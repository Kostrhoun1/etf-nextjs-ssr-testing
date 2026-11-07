# Denní kontrola webu (naplánovaná úloha Claude)

Rozhodnutí majitele 7. 11. 2026: **majitel nechce dostávat e-maily s chybou a přeposílat je do chatu.** Automatické
kontroly (GitHub Actions) proto selhání nehlásí e-mailem (joby mají `continue-on-error: true`, běh skončí zeleně).
Každý den je vyhodnotí tahle úloha: sama najde problém, zjistí příčinu, opraví ji, ověří a majiteli pošle krátké
shrnutí. Majitele se ptá jen na to, co je jeho rozhodnutí (peníze, placený plán, nasazení mimo pravidla, obsah).

Pravidla: `CLAUDE.md` (PRAVIDLO Č. 1 – data musí být správně; nasazování; testy proti produkci jen na pevné sadě),
`ZAMERNA-ROZHODNUTI.md` (co vypadá jako chyba, ale je záměr – přečíst dřív, než se cokoli „opraví“).

## 1. Sběr (posledních 26 hodin)

```bash
# Běhy a joby (job-level continue-on-error: běh je zelený, neúspěch je vidět na jobu)
gh run list --repo Kostrhoun1/etf-nextjs-ssr-testing --limit 20 --json databaseId,name,createdAt,headSha
gh run view <id> --repo Kostrhoun1/etf-nextjs-ssr-testing --json jobs --jq '.jobs[] | .name+" "+.conclusion'
gh run view <id> --repo Kostrhoun1/etf-nextjs-ssr-testing --log | cut -f3 | sed -n '/POPLACH/,/Varování (/p'
gh run list --repo Kostrhoun1/etf-astro --workflow scrape.yml --limit 3     # scraper (pg_cron út–pá 05:00, po 05:00 UTC)
```

- **Kontrola dat fondů** (`check-fund-data.mjs`): sekce „🚨 POPLACH“ = řešit; „Varování“ = jen projít, jestli
  nepřibylo nic nového a vážného.
- **Zlaté případy** (`zlate-kalkulacky.mjs`): „SELHALO“ = řešit; XFAIL/VAROVÁNÍ ne.
- **Prod smoke test**, **Sync indexů**, **Ověření předpokladů** (pondělí), **IndexNow**: neúspěšný job = řešit.
- **Scraper** (etf-astro): neúspěšný job nebo méně než ~5 000 fondů se `scraping_date` dnes (v pracovní den po
  ~10:00 UTC) = řešit. Dotaz přes Supabase MCP (projekt `nbhwnatadyubiuadfakx`).
- **Vercel free tier** (Claude v Chromu, jen čtení): `https://vercel.com/tomas-projects-43fd2658/~/usage` – ISR Writes
  a Fluid Active CPU za klouzavých 30 dní (limit 200 000 / 4 h; nad limit = pozastavení webu). Denní spotřebu CPU
  přečíst z grafu `…/usage/vercel-functions-fluid-cpu-duration?period=daily`. Rezerva CPU < 30 min = řešit (co ji
  bere: `…/~/usage/vercel-functions-fluid-cpu-duration?view=Type`, projekt → Observability → Functions).
- Web běží: `curl -s -o /dev/null -w "%{http_code}" https://etfpruvodce.cz/` (200), build-time v `<meta name="build-time">`
  není starší než 25 dní.

## 2. Ke každému nálezu: příčina, ne příznak

1. Ukazuje web něco špatně? Ověřit **nezávisle** (burza přes Yahoo, kurz ČNB, zdroj justETF, holá data v DB) –
   nikdy jen proti vlastnímu kódu. Na produkci jen pevná malá sada stránek (každý nový detail = ISR zápis).
2. Když web chybu nemá (časování ISR cache, předběžná data zdroje, nový fond…), je chyba v kontrole: upravit ji tak,
   aby celou TŘÍDU takových případů hlásila jako varování – ne jen dnešní případ. Projít i historii poplachů.
3. Když web chybu má: opravit kód/data + přidat automatickou kontrolu, která by ji chytila (pravidlo č. 1, bod 4).
   Extrémní, ale skutečná hodnota → zapsat do `ZAMERNA-ROZHODNUTI.md`.
4. Ověřit opravu: kontroly lokálně (`npx next build` + `npx next start -p 3005`, pak
   `WEB_URL=http://localhost:3005 node scripts/check-fund-data.mjs`), změnu kontroly proti produkci v produkčním
   režimu (`node scripts/check-fund-data.mjs` bez WEB_URL – pevná sada stránek).

## 3. Nasazení

- Commity na větev `vylepseni-stranek`; před commitem `git branch --show-current` (sdílený worktree).
- Změna jen `scripts/`, `.github/`, `*.md` → rovnou `git push origin vylepseni-stranek:main` (Vercel build přeskočí –
  `vercel.json` ignoreCommand). Push větve spustí zbytečný náhled → zrušit (Vercel MCP `cancel_deployment`).
- Změna webu (`src/` …) → nasadit podle `CLAUDE.md` (usage zkontrolovat, rezerva CPU ≥ 15 min a ISR ≥ 15 000,
  nejvýš 1–2× týdně) a ověřit na produkci (pevná sada stránek). Mimo pravidla → zeptat se majitele.
- Nikdy: placený plán, mazání dat, force push, zásah do pracovního adresáře `etf-astro` (jen worktree + PR).

## 4. Shrnutí pro majitele

Krátce česky (vykat): co se našlo, co je opravené a ověřené, co čeká na jeho rozhodnutí. Když je vše v pořádku,
jedna věta. Žádné e-maily, žádné dlouhé výpisy.

## Dočasný stav (aktualizovat)

- 7. 11. 2026: Fluid CPU 4 h 4 min / 4 h → Vercel ohlásil pozastavení účtu (majitel zvolil čekat, ne platit). Middleware
  zrušen (37 % CPU). **Vypnuté workflow** `zlate-pripady.yml` a `prod-smoke.yml` (šetří CPU) – znovu zapnout
  (`gh workflow enable … --repo Kostrhoun1/etf-nextjs-ssr-testing`), až bude rezerva CPU ≥ 30 min. Je-li web
  pozastavený (HTTP 503 DEPLOYMENT_PAUSED) a CPU za 30 dní < 3 h 50 min, obnovit (Vercel MCP `unpause_project`,
  projekt `prj_W5TD9N7mjshpeusA4WOrgAeQtAFl`, tým `team_TNG9C04p1rIA9ArFY7oOKnU1`) a majiteli to napsat.
- etf-astro PR #5 (scraper bez e-mailů) čeká na sloučení majitelem.
