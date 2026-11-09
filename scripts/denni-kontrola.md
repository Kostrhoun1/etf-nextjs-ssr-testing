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

## 3b. Jednou měsíčně (po 15. dni, kdy ČSÚ zveřejní inflaci)

- `python3 scripts/backtest/generuj-cpi-a-sazby.py` – doplní měsíční CPI (src/lib/backtest/inflation.ts) a bezrizikové
  sazby (src/lib/backtest/bezrizikovaSazba.ts). Kontrola dat hlásí varování, když jsou o víc než 3 měsíce pozadu.
  Ověřit: kontrola S18 (roční průměry CPI = míra inflace ČSÚ) projde. Změna je v src/ → nasadí se s týdenní přestavbou
  nebo commitem do main.

## 4. Shrnutí pro majitele

Krátce česky (vykat): co se našlo, co je opravené a ověřené, co čeká na jeho rozhodnutí. Když je vše v pořádku,
jedna věta. Žádné e-maily, žádné dlouhé výpisy.

## Návrat na free tier (Hobby) – hlavní cíl do 7. 12. 2026

Majitel 8. 11. 2026: Vercel web 7. 11. v noci pozastavil (vyčerpaný free tier), majitel musel koupit Pro a **chce ho od
příštího měsíce zrušit** (Pro období 7. 11.–7. 12. 2026). Po návratu na Hobby se limity počítají za klouzavých 30 dní,
takže spotřeba za 7. 11.–7. 12. musí být POD limity s rezervou. Denní cíle (= ~60 % limitu za 30 dní):

| Metrika (Vercel → Usage, Pro: „Consumption Breakdown“ Daily) | Limit Hobby / 30 dní | Cíl za den |
|---|---|---|
| Fluid Active CPU | 4 h | ≤ 5 min |
| Fast Origin Transfer | 10 GB | ≤ 200 MB |
| ISR Writes | 200 000 | ≤ 4 000 |
| Function Invocations | 1 000 000 | ≤ 20 000 |

- Každý den zapsat do tabulky níže včerejší hodnoty a podíl robotů (projekt → Observability → CDN Requests →
  Bot Name). Nad cílem 2 dny po sobě = najít příčinu (Observability → Functions / CDN Requests: Routes, Bot Name)
  a snížit ji – bez placeného plánu a bez ořezávání obsahu.
- **Do 1. 12. 2026 napsat majiteli verdikt**: součet za 7. 11.–dosud a odhad do 7. 12. pod limity → „Pro můžete zrušit“
  (v nastavení týmu → Billing → Downgrade to Hobby; majitel sám, je to platba). Jinak co ještě chybí.
- Opatření hotová: middleware zrušen (7. 11., −37 % CPU), detaily a dvojice předgenerované při buildu (1. 11.),
  robots.txt blokuje komerční SEO roboty a sběr dat pro AI (8. 11., SE Ranking + Ahrefs + Meta = ~70 % požadavků).
- Další možnosti, kdyby to nestačilo: `/srovnani/[pair]` `dynamicParams = false` (nepředgenerované dvojice = 404 místo
  funkce), `/srovnani/porovnani` cache na CDN, firewall pravidlo na roboty, kteří robots.txt nerespektují (jen ty –
  nikdy vyhledávače).

| Den | CPU | Fast Origin Transfer | ISR Writes | Pozn. |
|---|---|---|---|---|
| 7.–8. 11. (~14 h provozu) | 3 min 22 s | 276 MB | 1 190 | před blokací robotů; SE Ranking 529 / Ahrefs 101 / Meta 62 požadavků za 12 h |
| 7. 11. (Vercel, den UTC) | 3 min | 268 MB | 1 120 | 571 volání funkcí |
| 8. 11. (do 10:30 UTC) | 3 min | 144 MB | 6 100 | 5 produkčních nasazení ráno (Build CPU 5 h = 1,09 $ z kreditu Pro); ISR nad cílem kvůli nasazením – sledovat 9. 11. |
| 8. 11. (celý den UTC) | 11 min | 561 MB | 10 830 | 2 210 volání funkcí; nad cílem jen kvůli 6 nasazením (po každém se plní nová cache) – jednorázové |
| 9. 11. (do ~10 UTC) | 21 s | 28 MB | 187 | 167 volání; tempo hluboko pod cílem. Za období Pro (od 7. 11.) celkem 14 min / 857 MB / 12,1K ISR |

## Dočasný stav (aktualizovat)

- 7. 11. 2026: Fluid CPU 4 h 4 min / 4 h → Vercel ohlásil pozastavení účtu (majitel zvolil čekat, ne platit). Middleware
  zrušen (37 % CPU). **Vypnuté workflow** `zlate-pripady.yml` a `prod-smoke.yml` (šetří CPU) – znovu zapnout
  (`gh workflow enable … --repo Kostrhoun1/etf-nextjs-ssr-testing`), až bude rezerva CPU ≥ 30 min. Je-li web
  pozastavený (HTTP 503 DEPLOYMENT_PAUSED) a CPU za 30 dní < 3 h 50 min, obnovit (Vercel MCP `unpause_project`,
  projekt `prj_W5TD9N7mjshpeusA4WOrgAeQtAFl`, tým `team_TNG9C04p1rIA9ArFY7oOKnU1`) a majiteli to napsat.
- etf-astro PR #5 (scraper bez e-mailů) – sloučen 7. 11. 2026.
- 7. 11. 2026 13:30 (denní kontrola): web běží (200, build 7. 11. 07:31 – bez middleware). Za 30 dní: CPU **4 h 5 min / 4 h**
  (denně ~9–12 min, první dny okna ~3–6 min → nad limitem ještě několik dní; efekt zrušení middleware vidět od 8. 11.),
  ISR 171K / 200K, **Fast Origin Transfer 6,9 / 10 GB** (další limit – sledovat). Workflow zlaté případy a smoke test
  dál vypnuté. Commity 900ff8c a 0ad3240 (ráno nepushnuté) poslány do main.
- 8. 11. 2026: majitel koupil Pro (web byl v noci pozastaven) – viz „Návrat na free tier“. robots.txt blokuje SEO roboty
  (34adb54). etf-astro PR #5 sloučen (scraper bez e-mailů).
- 8. 11. 2026 10:30 UTC (denní kontrola): web běží (200, build 8. 11. 10:14). Workflow zlaté případy a smoke test jsou zase
  zapnuté (1× týdně). Poplachy kontroly dat 7. 11. večer (20×) = web pozastavený (HTTP 402), ne chyba dat. Dnes 2 poplachy:
  (1) přesměrování 308 místo 301 – správně, kontrola přijímá 301/308 (ZAMERNA); (2) VBTC – zašuměná řada zdroje, ověřeno
  Xetra/Paris/BTC-EUR → přidán do NEOVERENE_VYNOSY (commit na `vylepseni-stranek`, **NEnasazeno** – dnes už 5 nasazení;
  jede s příštím nasazením, do té doby kontrola hlásí „VBTC: srovnávač ukazuje výnos za období“). Otevřené (varování):
  16 položek NEOVERENE_VYNOSY už neplatí – před smazáním ověřit každou burzou.
- 9. 11. 2026 10:30 UTC (denní kontrola): web běží (200, build 8. 11. 15:48), scraper dnes 5 154 fondů, všechny joby zelené,
  kontrola dat bez poplachu. Varování kolo9 (11 extrémních kalendářních roků: Solana ETP 2023, LSIL, COCO, AMD3, UBR3,
  QQQ5, PLT3 2024) ověřeno burzou (Yahoo) – všechny skutečné → přidány do OVERENE_EXTREMNI_ROKY (`src/lib/vynosNeovereny.ts`,
  commit na `vylepseni-stranek`, **NEnasazeno** – je to v src/, jede s příštím nasazením; do té doby kontrola dál hlásí
  varování kolo9). Dál otevřené (varování): 17 položek NEOVERENE_VYNOSY už neplatí – před smazáním ověřit burzou.
