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
  Když ranní běh skončí `cancelled` (půlky narazily na limit 359 min – typicky výpadek zdroje, v logu „Network error
  scraping … Read timed out / 502“) a v DB dnes není nic: ověřit, že zdroj zase odpovídá, a pustit ho znovu
  (`gh workflow run scrape.yml --repo Kostrhoun1/etf-astro --ref main`) – naváže z checkpointů (platí 20 h, stejná verze
  kódu), zbytek trvá ~2 h. Plánovaná záloha by to udělala sama, ale GitHub ji spouští až ~17:40–18:40 UTC (18. 11. 2026).
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

## 3a. Jednou týdně (v pondělí): úklid kopií repa po agentech

- `bash scripts/uklid-worktree.sh --smazat` – odstraní jen čisté kopie, jejichž větev je celá v origin/main (přes
  `git worktree remove`, nikdy rm). Kopii „OBSAHUJE PRÁCI“ nemazat, jen uvést ve shrnutí majiteli (zavedeno 11. 11. 2026,
  disk Macu byl plný). Známá výjimka: `vibrant-carson-dccb3a` (necommitnutý úklid outlierů indexů z 19. 7.) – čeká na prověření.

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
| **ISR Reads** (od 17. 11.; ~/usage/isr-reads) | 1 000 000 | ≤ 25 000 |
| Function Invocations | 1 000 000 | ≤ 20 000 |

**Kontrola všech limitů Hobby 17. 11. 2026** (Pro 7.–17. 11. = 10,5 dne → přepočet na 30 dní; limity z vercel.com/pricing
a /docs/plans/hobby): CDN Requests 140K → ~400K / 1 mil. ✓; Fast Data Transfer 3 GB → ~9 / 100 GB ✓; Provisioned Memory
15,5 → ~44 / 360 GB-h ✓; Active CPU 1 h → ~2 h 55 min / 4 h ✓; Invocations 14,6K → ~42K / 1 mil. ✓; ISR Writes 44K → ~127K /
200K ✓; obrázky 35 / 5K ✓; Web Analytics 100 / 50K ✓; **ISR Reads 379K → ~1,0 mil. / 1 mil. ✗ (klidný den 30–37K)** a
**Fast Origin Transfer ~3,5 GB → ~10 / 10 GB ✗**. Obě jsou TOTÉŽ: stránka, kterou CDN nemá v regionu v cache, se čte z ISR
úložiště (iad1) – čtení se počítá po 8 kB nekomprimované stránky (detail fondu ~190 kB = ~24 jednotek) a stejná data tečou
jako přenos z originu. Za 12 h: `/etf/[isin]` 48 MB (46 %), `/api/etf/screener` 11 MB (4 MB na jedno čtení), `/srovnani/[pair]`
11 MB, `/nejlepsi-etf/[slug]` 6 MB, `/` 4 MB. Roboti na CDN za 12 h: **meta-externalagent 232 (z cache 18 %)**, applebot 114,
bingbot 96, seznambot 27, oai-searchbot 33 (vyhledávače se neomezují). → Majitel 17. 11.: Meta AI bez detailů fondů a srovnání
(`src/app/robots.ts`, odhad −20–25 %). Hobby nemá vlastní limit buildů, které nás omezují (45 min/build, náš build ~14 min na
2 vCPU; 100 nasazení/den), repo je osobní účet GitHubu (Hobby nepodporuje repa organizací) – v pořádku. Nejasné: „Deployment
Storage 10 GB“ u Hobby (Pro ukazuje 8 GB-měsíců za 10 dní); před 7. 11. na Hobby pozastavení nezpůsobilo, mazání starých
nasazení dělá retenční politika.

**Kdyby po přechodu na Hobby web stejně stál** (HTTP 402/503 „DEPLOYMENT_PAUSED“ nebo e-mail Vercelu o limitu): majitel
v Settings → Billing → Upgrade to Pro (1 minuta, platba – jen on); po upgradu web hned běží (ověřeno 7.–8. 11.). Pak zjistit,
která metrika přetekla (Usage, klouzavých 30 dní), a Pro zrušit až po návratu pod limity.

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
| 9. 11. 10 UTC → 10. 11. 11 UTC | ~6 min | ~150 MB | ~3,45K | CPU lehce nad cílem 5 min (1. den) – sledovat 11. 11. Za období Pro celkem 20 min / 1 GB / 15,55K ISR / 4,38K volání; kredit 1,99 / 20 $ |
| 10. 11. 11 UTC → 12. 11. 11 UTC (2 dny) | ~13 min (6,5/den) | ~0,9 GB (9. 11. ~285 MB, 10. 11. ~275 MB, 11. 11. ~470 MB) | ~10,3K (5,1K/den) | **nad cílem 2 dny po sobě** (CPU, přenos i ISR); 11. 11. tři nasazení. Za období Pro celkem **33 min / 1,89 GB / 25,84K ISR / 7,24K volání**; kredit 3,25 / 20 $. Odhad do 7. 12.: CPU ~3 h (limit 4 h), **přenos ~9–10,5 GB (limit 10 GB) – nejtěsnější**. Největší spotřebitel CPU za 3 dny: `/srovnani/porovnani` 646 volání, 4 min, P75 4,3 s (noindex, bez cache, 167 kB na odpověď); dál `/api/backtest/simulate` 1 min, `/api/ev` 38 s |
| 12. 11. (Vercel, den UTC) | 6 min 17 s | 405 MB | 4 701 | 1 419 volání funkcí; nad cílem CPU, přenos i ISR (3. den po sobě). 17:30 UTC nasazena CDN cache pro `/srovnani/porovnani` |
| 13. 11. (do ~08 UTC) | 2 min 52 s | 107 MB | 2 987 | 1 126 volání za 8 h. **CDN cache porovnání technicky funguje (curl: 1. MISS, 2. HIT), ale spotřebu nesnížila**: za 12 h po nasazení (12. 11. ~20 UTC → 13. 11. ~08 UTC) mělo `/srovnani/porovnani` 254 volání funkce, CPU 2 min, P75 3,89 s, z CDN jen 1,2 % (248 z 258 požadavků MISS) – tempo ~500/den proti ~215/den před tím. Příčina: 180 z ~256 požadavků dělá archivační robot Národní knihovny `heritrix/3.7.0 (webarchiv.cz)`, každý na jinou kombinaci ISIN → každá URL je v cache poprvé. V záložce Bot Name není (Vercel ho nezná), je vidět jen v rozpadu User Agent. Druhý spotřebitel: `/srovnani/[pair]` 1K volání, CPU 1 min, z CDN 3,7 % (kdo volá, neověřeno – Chrome ztrácel spojení). Za období Pro celkem **40 min 47 s / ~2,2–2,4 GB (dashboard ukazuje „2 GB“, přesný součet nepřečten) / 32,06K ISR / 9,42K volání**; kredit 3,70 / 20 $. Odhad do 7. 12. (tempo 6,35 dne × 30): CPU ~3 h 15 min (limit 4 h), **přenos ~9,5–11 GB (limit 10 GB) – na hraně až nad**, ISR ~150K (limit 200K), volání ~45K. Návrh dalšího kroku (čeká na majitele): `Disallow: /srovnani/porovnani` v robots.txt pro všechny roboty (stránka je noindex, vyhledávače o nic nepřijdou; heritrix robots.txt respektuje) a prověřit, kdo volá `/srovnani/[pair]` |
| 13. 11. ~08 UTC → 14. 11. ~12 UTC (28 h) | ~5 min (4,5/den) | ~0,3–0,4 GB (~300 MB/den, odhad z účtované částky 0,16 $ ÷ 0,06 $/GB = ~2,67 GB za období) | ~3,2K (2,7K/den) | 1,3K volání. CPU a ISR **v cíli**, přenos dál nad cílem 200 MB/den. Za období Pro celkem **46 min / ~2,7 GB (dashboard „3 GB“) / 35,25K ISR / 10,74K volání**; kredit 4,13 / 20 $. Odhad do 7. 12. (7,5 dne × 4): CPU ~3 h 05 min, ISR ~140K, volání ~43K, **přenos ~10,7 GB (limit 10 GB) – nad limitem**; návrh `Disallow: /srovnani/porovnani` dál čeká na majitele |
| 14. 11. ~12 UTC → 15. 11. ~12 UTC (24 h) | ~4 min | ~0,3 GB (odhad z účtované částky 0,18 $ ÷ 0,06 $/GB = ~3,0 GB za období) | ~1,7K | ~0,8K volání, žádné nasazení. CPU a ISR **v cíli**, přenos dál nad cílem 200 MB/den. Za období Pro celkem **50 min / ~3,0 GB / 36,96K ISR / 11,52K volání**; kredit 4,20 / 20 $. Odhad do 7. 12. (8,5 dne × 3,53): CPU ~2 h 55 min, ISR ~130K, volání ~41K, **přenos ~10,6 GB (limit 10 GB)**; samotné tempo posledních 3 dnů (~300 MB/den) by dalo ~9 GB – na hraně. Návrh `Disallow: /srovnani/porovnani` dál čeká na majitele |
| 15. 11. ~12 UTC → 16. 11. ~10:40 UTC (22,5 h) | ~5,7 min | ~0,2–0,3 GB (odhad z účtované částky 0,19 $ ÷ 0,06 $/GB = ~3,2 GB za období; krok 0,01 $ = 167 MB) | ~4,1K | ~1,2K volání; 1 nasazení 15. 11. 19:30 UTC (robots.txt heritrix) – CPU a ISR lehce nad cílem jen kvůli němu (graf: 15. 11. ~4,8 min a ~3,5K ISR za celý den). Za období Pro celkem **55 min 44 s / ~3,2 GB (dashboard „3 GB“) / 41,06K ISR / 12,69K volání**; kredit 4,72 / 20 $. Odhad do 7. 12. (9,44 dne × 3,18): CPU ~2 h 57 min, ISR ~131K, volání ~40K, **přenos ~10 GB (limit 10 GB) – na hraně**. Zákaz `/srovnani/porovnani` pro heritrix je venku teprve 15 h – účinek vyhodnotit 17.–18. 11. (Observability → `/srovnani/porovnani` volání/den, dřív ~500) |
| 16. 11. ~10:40 UTC → 17. 11. ~10:50 UTC (24 h) | ~5,3 min | ~0,3 GB (odhad z účtované částky 0,21 $ ÷ 0,06 $/GB = ~3,5 GB za období; dashboard „4 GB“) | ~3,2K | ~1,8K volání, žádné nasazení (graf: 16. 11. ~5,8 min CPU za celý den). CPU těsně nad cílem, ISR v cíli, přenos dál ~300 MB/den. Za období Pro celkem **1 h 1 min / ~3,5 GB / 44,3K ISR / 14,47K volání**; kredit 4,91 / 20 $. Odhad do 7. 12. (10,45 dne × 2,87): CPU ~2 h 55 min, ISR ~127K, volání ~42K, **přenos ~10 GB (limit 10 GB) – na hraně**. `/srovnani/porovnani` za 7 dní 1,5K požadavků (~215/den); pokles po zákazu pro heritrix v hodinovém grafu zatím není zřetelný – vyhodnotit 18. 11. (rozpad User Agent) |
| **17. 11. ~16:30 UTC – verdikt k zrušení Pro (klouzavých 30 dní, 18. 10.–17. 11., Usage → „Last 30 Days“)** | **4 h 5 min / 4 h (102 %) ✗** | 8,77 GB / 10 GB (88 %) | 160,3K / 200K (80 %) | **Dnes Pro NERUŠIT** – CPU za 30 dní je nad limitem (v okně jsou ještě dny před 7. 11. po 9–13 min). ISR Reads 846,4K / 1 mil. (85 %), volání funkcí 117,2K / 1 mil. (12 %). Denní hodnoty odečtené z grafů (výška sloupců × součet): ISR Reads 13.–16. 11. 33,1K / 37,0K / 31,4K / 31,1K (průměr 33,1K), přenos 331 / 320 / 295 / 285 MB (308 MB), CPU ~5,5 min, ISR Writes ~3,65K, volání ~1,4K. **Pozor: ISR Reads a přenos v okně do začátku prosince ROSTOU** – vypadávají říjnové dny (reads ~15–20K, přenos ~150–250 MB) a nahrazují je dny po ~33K / ~308 MB. Odhad okna ke dni 2. / 3. / 4. / 5. / 6. 12. při tempu 13.–16. 11. (bez účinku zákazu Meta AI): CPU 2 h 52 / 2 h 46 / 2 h 41 / 2 h 41 / 2 h 35 min ✓; ISR Writes 111K / 111K / 111K / 112K / 105K ✓; volání 47K–38K ✓; **ISR Reads 991K / 983K / 975K / 972K / 949K (95–99 % – pod limitem, ale nad hranicí 90 %)**; **přenos 9,23 / 9,15 / 9,10 / 9,10 / 8,82 GB (88–92 %)**. Se zákazem Meta AI −20 %: ISR Reads 885K / 870K / 855K / 846K / 816K, přenos 8,2 / 8,1 / 8,0 / 7,9 / 7,6 GB – vše pod 90 %. Aby 6. 12. vyšly ISR Reads pod 900K, musí denní čtení klesnout aspoň o ~7,5 % (pod ~30,7K/den); pro přenos pod 9 GB stačí i dnešní tempo. Zákaz Meta AI (`Disallow: /etf/`, `/srovnani/`) je na produkci ověřen (curl robots.txt 17. 11.), účinek zatím nejde změřit – první celý den je 18. 11. **Předběžný verdikt: zrušit 6. 12.** (nejnižší okno u všech metrik; 7. 12. se Pro obnoví), dřívější den jen když denní ISR Reads od 18. 11. klesnou pod ~27K (pak vychází už 2. 12.). Potvrdit 1.–2. 12. ze skutečných čísel. Když ISR Reads zůstanou ≥ 33K/den, vychází 6. 12. na 95 % limitu – bez rezervy; pak buď najít další čtení mimo cache (druhý největší robot, `/api/etf/screener` 4 MB na čtení), nebo nechat Pro ještě měsíc |
| 18. 11. | nepřečteno | nepřečteno | nepřečteno | **Usage dnes nepřečteno**: rozšíření Claude v Chromu nebylo připojené, vestavěný prohlížeč není u Vercelu přihlášený, konektor Vercel vrací 404 (billing „Plan not found“, observability „not found“). Účinek zákazů (heritrix na `/srovnani/porovnani`, Meta AI na detaily) proto vyhodnotit 19. 11. z grafů za 17.–18. 11. Pozor: `vercel api …` ve zdejším CLI 48.1.6 NENÍ příkaz – CLI ho vyloží jako `vercel deploy <cesta>` (skončilo chybou „Can't deploy more than one path“, nic se nenasadilo); nepoužívat |
| **19. 11. ~10 UTC (plán Pro; klouzavých 30 dní 20. 10.–19. 11., Usage → „Last 30 Days“)** | **4 h 1 min / 4 h (100 %) ✗** | **9,17 GB / 10 GB (92 %)** | 144,6K / 200K (72 %) | **ISR Reads 917,0K / 1 mil. (92 %)**; volání funkcí za období Pro 18,17K (hluboko pod limitem). Na Pro = jen záznam, web nic neohrožuje; **pod limity Hobby s rezervou 10 % dnes NEJSME** (CPU, čtení, přenos). Denní hodnoty z grafů (výška sloupců, součet sedí na ±1 %) 17. / 18. 11.: ISR Reads **40,6K / 59,4K**, přenos **375 / 513 MB**, CPU 6,0 / 6,7 min, ISR Writes 2,8K / 2,6K. Špička 18. 11. je první celý den po nasazení 17. 11. 16:03 UTC (85d919d) – po každém nasazení se plní cache CDN z ISR (stejně 8. 11. 56K, 11. 11. 47K) → účinek zákazu Meta AI z těchto dvou dnů změřit nejde. Průměr 13.–18. 11.: čtení 38,7K/den, přenos 353 MB/den, CPU 5,75 min/den, ISR Writes 3,3K/den. **Projekce okna na 26. 11.** (vypadne 20.–26. 10.: čtení 114K, přenos 1,6 GB, CPU 63 min, zápisy 53K): CPU ~3 h 42 min ✓, ISR Writes ~116K ✓, **ISR Reads ~1,05–1,10 mil. ✗ (přes 1 mil. kolem 23.–25. 11.)**, **přenos ~10,0–10,3 GB ✗ (přes 10 GB kolem 26. 11.)**. **Okno 6. 12.** (7.–18. 11. skutečnost = čtení 477K, přenos 4,44 GB, CPU 76 min + 18 dní): CPU ~3 h ✓, zápisy ~110K ✓, ISR Reads 1,07 mil. při 33K/den / 1,17 mil. při 38,7K/den ✗, přenos 9,8 GB při 300 MB/den / 10,8 GB při 353 MB/den ✗. **Oprava odhadu ze 17. 11.** (949K čtení k 6. 12. při 33,1K/den): nevychází – 30 dní po 33K je samo 990K, s dny po nasazení přes 1 mil. Aby 6. 12. vyšlo pod limit, musí průměr 19. 11.–6. 12. být **≤ 29K čtení a ≤ 309 MB/den** (pod 90 %: ≤ 23,5K a ≤ 253 MB/den) – tj. o 25–40 % méně než teď, a **bez dalšího nasazení** (každé stojí ~15–25K čtení a ~150–250 MB navíc; týdenní přestavba v sobotu také). Roboti za 12 h (Observability → Bot Name; čtvrtek, mimo týdenní plán – kvůli špičce): **meta-externalagent 25 (z cache 100 %) – z 232, zákaz funguje**; nově nahoře **amazonbot 325 (37 %), meta-webindexer 225 (3,6 %), claudebot 194 (38 %)**, dál facebookexternalhit 174 (100 %), bingbot 141, applebot 117, perplexitybot 84, oai-searchbot 57, exasearchbot 35. Návrh pro majitele (nic nezměněno): amazonbot a claudebot (sběr dat pro trénink, ne vyhledávání) a meta-webindexer zařadit do `AI_ROBOTI_BEZ_DETAILU` – ale až v balíku s jiným nasazením a nejpozději ~25. 11., ať špička po nasazení vypadne z úvah o 6. 12.; u meta-webindexer nejdřív rozhodnout, zda je to „AI vyhledávání“ (pak nechat). Bez poklesu čtení na ≤ 29K/den zrušení Pro 6. 12. nevychází |
| **20. 11. ~09 UTC (plán Pro, kredit 7,55 / 20 $; klouzavých 30 dní 21. 10.–20. 11., Usage → „Last 30 Days“)** | **3 h 58 min / 4 h (99 %) ✗** | **9,37 GB / 10 GB (94 %)** (odchozí 9,29 GB) | 137,8K / 200K (69 %) | **ISR Reads 949,9K / 1 mil. (95 %)**; volání funkcí 101,4K / 1 mil. (10 %). Na Pro = jen záznam, web nic neohrožuje; **pod limity Hobby s rezervou 10 % NEJSME** (CPU, čtení, přenos) a čtení i přenos proti 19. 11. dál rostou (917K → 950K, 9,17 → 9,37 GB). Denní hodnoty z grafů (výška sloupců × součet) 17. / 18. / 19. 11.: ISR Reads 40,7K / 59,4K / **52,1K**, přenos 376 / 513 / **484 MB**, CPU 6,0 / 6,7 / 6,7 min, ISR Writes 2,8K / 2,6K / 4,1K. 19. 11. zůstalo vysoko, protože se 19. 11. znovu nasazovalo (egress Supabase 1815076, build 8a9cd4f) – druhá špička po nasazení za tři dny; klidný den po zákazu Meta AI proto stále nezměřen (první možný 21.–22. 11.). **Projekce okna** (vypadávají dny 21.–31. 10. po ~15–19K čtení a ~140–290 MB): ISR Reads přes 1 mil. **~22.–23. 11.** (při 33K/den 23. 11. 998K, při 38,7K/den 1,02 mil.), za 7 dní (27. 11.) 1,06–1,10 mil. ✗; přenos přes 10 GB **~26.–28. 11.**, za 7 dní 9,9–10,3 GB ✗; CPU klesá: 27. 11. ~3 h 35–40 min ✓; ISR Writes ~115K ✓. **Zrušení Pro 6. 12.**: v okně 7. 11.–6. 12. je už 7.–19. 11. = 530K čtení a 4,93 GB → zbylých 17 dní smí mít průměr **≤ ~27K čtení a ≤ ~295 MB/den** (pod 90 %: ≤ ~21K a ≤ ~235 MB) – proti dnešním 33–39K / 300–350 MB v klidném dni a bez jediného dalšího nasazení. Sobotní týdenní přestavba 21. 11. se nespustí (poslední nasazení 19. 11. < 6 dní) ✓. Návrh pro majitele beze změny (nic nezměněno): amazonbot, claudebot (sběr pro trénink) a případně meta-webindexer do `AI_ROBOTI_BEZ_DETAILU` – jedním nasazením nejpozději ~25. 11.; jinak počítat s Pro i v prosinci. Roboty (Bot Name) číst v pondělí 23. 11. |
| **21. 11. ~09 UTC (plán Pro, kredit 7,73 / 20 $; klouzavých 30 dní 22. 10.–21. 11., Usage → „Last 30 Days“)** | **3 h 52 min / 4 h (97 %)** | **9,34 GB / 10 GB (93 %)** (odchozí 9,26 GB) | 128,2K / 200K (64 %) | **ISR Reads 961,9K / 1 mil. (96 %)**; volání funkcí 95,4K / 1 mil. (10 %). Na Pro = jen záznam, web nic neohrožuje; **pod limity Hobby s rezervou 10 % NEJSME** (CPU, čtení, přenos). Denní hodnoty z grafů (výška sloupců × součet) 18. / 19. / **20. 11.**: ISR Reads 59,4K / 52,1K / **32,6K**, přenos 512 / 483 / **291 MB**, CPU 6,7 / 6,7 / **3,1 min**, ISR Writes 2,6K / 4,1K / 3,0K. **20. 11. = první klidný den po zákazu Meta AI a bez nasazení**: CPU a zápisy v cíli, čtení a přenos stejné jako klidné dny před zákazem (16. 11. 31,1K / 284 MB) → zákaz Meta AI sám čtení pod cíl 25K nedostal. **Projekce okna** (vypadávají dny 22.–28. 10. po ~15–19K čtení, ~155–240 MB, 7–10 min CPU): ISR Reads přes 1 mil. **~23.–24. 11.** (při 32,6K/den 24. 11. 1,00 mil., za 7 dní 28. 11. 1,07 mil. ✗); přenos za 7 dní 9,86 GB při 291 MB/den (99 %), přes 10 GB až při ≥ ~310 MB/den ✗ na hraně; CPU klesá: 28. 11. ~3 h 15–35 min ✓; ISR Writes ~111–117K ✓. **Zrušení Pro 6. 12.**: okno 7. 11.–6. 12. má za 7.–20. 11. už 563K čtení a 5,21 GB → zbylých 16 dní smí mít průměr **≤ ~27K čtení a ≤ ~297 MB/den** (pod 90 %: ≤ ~21K a ≤ ~235 MB) a žádné nasazení; klidný den dnes dává 32,6K / 291 MB → přenos těsně vychází, **čtení ne (chybí ~17 %)**. Sobotní týdenní přestavba 21. 11. podle grafu neproběhla (21. 11. do ~09 UTC 7,9K čtení, bez špičky; v seznamu nasazení neověřeno). Návrh pro majitele beze změny (nic nezměněno): amazonbot, claudebot (sběr pro trénink) a případně meta-webindexer do `AI_ROBOTI_BEZ_DETAILU` – jedním nasazením nejpozději ~25. 11.; jinak počítat s Pro i v prosinci. Usage dnes překrývá výzva Vercelu „Secure Your Account with 2FA“ (neodkliknuta; čísla jdou číst pod ní přes text stránky a SVG). Roboty (Bot Name) číst v pondělí 23. 11. |
| **22. 11. ~08 UTC (plán Pro, kredit 8,20 / 20 $; klouzavých 30 dní 23. 10.–22. 11., Usage → „Last 30 Days“)** | **3 h 44 min / 4 h (93 %)** | **9,43 GB / 10 GB (94 %)** | 120,7K / 200K (60 %) | **ISR Reads 994,7K / 1 mil. (99,5 %)**; volání funkcí 90,4K / 1 mil. (9 %). Na Pro = jen záznam, web nic neohrožuje; **pod limity Hobby s rezervou 10 % NEJSME** (čtení, přenos, CPU). Denní hodnoty z grafů (výška sloupců × součet) 19. / 20. / **21. 11.**: ISR Reads 52,1K / 32,6K / **55,1K**, přenos 484 / 289 / **496 MB**, CPU 6,7 / 3,1 / **3,9 min**, ISR Writes 4,1K / 3,0K / 3,1K. 21. 11. = den nasazení balíku „návrat na free tier“ (2bcbc83, ~09–10 UTC) → špička po smazání cache CDN, cíle ≤ 20K čtení / ≤ 200 MB **nesplněny, ale den není měřítkem**; první klidný den po balíku je 22.–23. 11. (22. 11. do ~08 UTC 6,6K čtení / 55 MB – včera touhle dobou 7,9K). **Roboti za 24 h po balíku** (Observability → Bot Name, 1d): meta-webindexer **325 (z cache 2,8 %)** – před balíkem ~490 / 1,6 %; amazonbot **249 (47,8 %)** – před ~790 / 53 %; meta-externalagent 49 (63,8 %). Oba klesli (−34 % a −68 %), ale okno ještě obsahuje hodiny před nasazením; verdikt, zda pravidlo dodržují, až 24. 11. (3 dny). Nově v seznamu **amzn-searchbot 96 (z cache 0 %)** – vyhledávací robot Amazonu, neomezuje se; sledovat. Dál bingbot 1,2K (76 %), facebookexternalhit 333 (99 %), oai-searchbot 224 (84 %), applebot 159, seznambot 125, perplexitybot 69. **⚠ Ostrá nasazení za 7 dní (stav Ready): 4** – 15. 11. 78cc7ee (robots.txt heritrix), 17. 11. 85d919d (Meta AI bez detailů), 19. 11. 8a9cd4f (egress Supabase – oprava, která nepočkala; 3 další pokusy skončily Error), 21. 11. 2bcbc83 (balík free tier, rozhodnutí majitele). Každé = špička 50–59K čtení následující den. **⚠ Týdenní přestavba v sobotu 28. 11. 03:00 UTC se podle pravidla spustí** (poslední nasazení 21. 11. bude starší 6 dní, `scripts/vercel-ignore.sh`) a stejně 5. 12. → dvě další špičky (~+20K čtení a ~+200 MB každá) přímo v okně pro zrušení Pro; předgenerované detaily platí 30 dní (do ~21. 12.), takže obě jdou vynechat – rozhodnutí majitele, nic nezměněno. **Projekce okna za 7 dní (29. 11.; vypadnou 23.–29. 10. = 110K čtení, 1,24 GB, 55 min CPU, 31K zápisů)**: ISR Reads 1,02 mil. při 20K/den, 1,05 mil. při 25K, 1,09 mil. při 30K ✗ (přes 1 mil. 22.–23. 11. v každém scénáři – na Pro bez následků); přenos 9,5 GB při 200 MB/den, 9,9 při 250, 10,2 při 290 ✗ na hraně; CPU ~3 h 16 min ✓; ISR Writes ~111K ✓. **Zrušení Pro**: okno 7. 11.–6. 12. má za 7.–21. 11. už 618K čtení a 5,68 GB → zbylých 15 dní smí mít průměr ≤ 25,5K čtení a ≤ 288 MB/den (pod 90 %: **≤ 18,8K a ≤ 221 MB**). **Odhad dne, kdy vše vyjde < 90 %: ~8.–9. 12.** při 20K čtení/den (cíl balíku; bez sobotních přestaveb 8. 12., s nimi 9. 12.), **~12. 12.** při 25K/den, až ~20. 12. při 30K/den → 6. 12. (před obnovením Pro 7. 12.) pod 90 % nevyjde ani při splnění cíle, pod 100 % ano (918K při 20K/den). Usage dál překrývá výzva k 2FA (neodkliknuta) |
| **25. 11. ~17–20 UTC (plán Pro, kredit 8,97 / 20 $; klouzavých 30 dní 26. 10.–25. 11., Usage → „Last 30 Days“)** | **3 h 23 min / 4 h (85 %)** – rezerva 37 min | **nepřečteno** (Chrome se odpojoval; adresa podstránky je `…/usage/networking-fast-origin-transfer`, ne `fast-origin-transfer`) | za období Pro 67K (30 dní nepřečteno) | **ISR Reads 998,8K / 1 mil. (99,9 %)** – na Pro bez následků. **Balík free tier funguje:** denní čtení z grafu (výška sloupců, kalibrace 21. 11. = 55K ✓) 22. / 23. / 24. 11.: **~24,6K / ~13,8K / ~16,2K** (cíl ≤ 20K splněn 2 dny po sobě; před balíkem klidný den 33–39K), 25. 11. do ~13 UTC ~11K. CPU 22. / 23. / 24. 11.: ~3,2 / ~2,9 / ~3,0 min (cíl ≤ 5 ✓). Za období Pro (7.–25. 11.): čtení 671,4K, CPU 1 h 37 min, zápisy 67K, volání 26,8K. Žádné nasazení od 21. 11. (build-time 21. 11. 09:11). **Odhad okna 7. 11.–6. 12.** (7.–24. 11. ≈ 659K čtení + 12 dní po ~16K): ~851K (85 %) bez sobotních přestaveb, ~890K (89 %) se dvěma (28. 11., 5. 12., každá ~+20K) → čtení 6. 12. vychází **pod limit i kolem hranice 90 %**; CPU ~2 h 15 min ✓; zápisy ~110K ✓; přenos dnes nezměřen (do 21. 11. 5,68 GB; při ~170–200 MB/den odhad ~8,2–8,6 GB – OVĚŘIT z grafu). Bot Name a počet nasazení za 7 dní dnes nepřečteny (z GitHubu: od 21. 11. žádný push do src/, žádný deployment_status). Odkaz na 30 dní jde otevřít přímo: `?from=<ms>&range=last-30-days` za adresou podstránky |
| **26. 11. ~10 UTC (plán Pro; klouzavých 30 dní 27. 10.–26. 11., podstránky Usage s `?from=…&range=last-30-days`)** | **3 h 20 min / 4 h (83 %)** | **9,40 GB / 10 GB (94 %)** (odchozí 9,35 GB) | 107,0K / 200K (53 %) | **ISR Reads 1 000,6K / 1 mil. (100 %)** – na Pro bez následků, okno je na vrcholu a od ~30. 11. klesá; volání funkcí nepřečtena (25. 11. za období Pro 26,8K, hluboko pod limitem). **Pod limity Hobby s rezervou 10 % zatím NEJSME** (čtení, přenos). Denní hodnoty z grafů (výška sloupců × součet; kalibrace 21. 11. = 55,1K / 499 MB ✓) 22. / 23. / 24. / **25. 11.**: ISR Reads 24,9K / 13,8K / 16,1K / **19,0K** (cíl ≤ 20K ✓ 3 dny po sobě), přenos 227 / 138 / 150 / **192 MB** (cíl ≤ 200 MB ✓ 3 dny), CPU 3,2 / 2,9 / 3,1 / **3,5 min** ✓, ISR Writes 1,9K / 2,4K / 2,0K / **2,5K** ✓. **Roboti za 24 h** (Observability → Bot Name, 1d): meta-webindexer **62 (z cache 85 %)** – před balíkem ~490 / 1,6 %; amazonbot **mimo prvních 10 (< 46)** – před ~790; meta-externalagent 93 (90 %) → **pravidlo dodržují, není co hlásit**. Dál facebookexternalhit 331 (100 %), bingbot 234 (75 %), googleother 171 (52 %), googlebot 150 (62 %), oai-searchbot 122 (93 %), exasearchbot 88, applebot 78, claudebot 46. **Ostrá nasazení za 7 dní (od 19. 11. ~10 UTC): 2** – 19. 11. 8a9cd4f (egress Supabase, oprava, která nepočkala) a 21. 11. 2bcbc83 (balík free tier); od 21. 11. žádné (zdroj: GitHub deployments, v seznamu Vercelu neověřeno). **Projekce okna** (další dny po průměru 23.–25. 11.: 16,3K čtení / 160 MB / 3,2 min): za 7 dní (3. 12.) čtení 944K, přenos 8,78 GB, CPU 2 h 39 min, zápisy 100K – nic neroste přes limit. **Pod 90 % u všech metrik: 5. 12. bez sobotních přestaveb** (čtení 896K; 6. 12. 872K / 8,18 GB). Každá přestavba (28. 11., 5. 12.) přidá podle 21.–22. 11. ~+45K čtení a ~+370 MB (odhad 25. 11. „+20K“ byl nízký) → se dvěma 6. 12. ~960K čtení (96 %) / ~8,9 GB (89 %) a pod 90 % až **~8.–9. 12.**; s vynecháním přestavby 5. 12. vyjde 6. 12. ~917K (92 %). Rozhodnutí o vynechání je na majiteli (prerender platí do ~21. 12.). Chrome se dnes opakovaně odpojoval a `computer wait` se zasekával – číst jen navigate + javascript_tool bez čekání. |

## Dočasný stav (aktualizovat)

- **19. 11. 2026: Supabase free tier – překročen egress (5 GB / měsíc; e-mail Supabase, odklad do 19. 12. 2026, pak omezení
  databáze = web bez dat).** Příčina z edge logů (Supabase MCP `query_logs`, source `edge_logs`): dotaz tříd fondů
  (`select=isin,name,fund_provider,primary_ticker,returns_as_of,index_name,is_leveraged,return_1y,return_3y,return_5y`)
  ~5 300× / 24 h z funkcí Vercelu = ~4,6 mil. řádků. Oprava 1815076 (`vPametiNaCas`, 1 h v paměti instance) nasazena 19. 11.
  **Každý den do 19. 12. ověřit**: počet těchto dotazů za 24 h (`query_logs`: `count()` where `request.search` like
  `%is_leveraged%return_5y%` **and `request.method` = 'GET'** – bez toho se započítá ~1 040 zápisů scraperu
  `python-httpx` kolem 09:40 UTC, jejichž seznam sloupců vzoru také odpovídá) – cíl < 500 (dřív ~5 300); egress v Supabase dashboardu (Org → Usage → Egress) tempo
  < 150 MB/den. Když neklesne, najít další velký dotaz (`content_range` = počet řádků, viz dotaz v commitu).
- **21. 11. 2026: stav Supabase z dashboardu (Org → Usage, období 2. 11.–2. 12.) a údržba databáze.** Egress 6,09 / 5 GB
  (toto období už je přes limit a zůstane; nové začíná 2. 12.). Denní egress z grafu (výška sloupců × součet období):
  běžné dny před opravou 150–320 MB, 8. 11. ~1,07 GB a 11. 11. ~1,2 GB (dny s několika buildy), 19. 11. ~420 MB (3 buildy),
  **20. 11. ~55 MB** → cíl < 150 MB/den splněn. **Log Ingestion 2,55 / 1 GB (255 %)** – podle Supabase se začne počítat
  „po skončení přechodné lhůty začátkem 2027“. Dvě příčiny: (1) build = ~100 000 dotazů ≈ 0,6 GB logů (řeší balík
  `balik-free-tier`: build z jednoho snímku dat), (2) Postgres při každém připojení psal varování „database "postgres" has
  a collation version mismatch“ (~10 800×/den = přes polovinu klidového objemu; glibc 2.39 → 2.40 po aktualizaci Supabase).
  **Údržba 21. 11. ~08:43 UTC (souhlas majitele):** `REINDEX TABLE CONCURRENTLY` na `public.etf_funds`,
  `index_historical_data`, `web_events`, `app_admins`, `newsletter_subscribers`, `supabase_migrations.schema_migrations`
  (všechny indexy s výchozím řazením textu, bez zamykání), potom `ALTER DATABASE postgres REFRESH COLLATION VERSION`.
  Ověřeno: před i po 5 271 fondů / 5 271 různých ISIN, 220 243 řádků historie indexů, žádný neplatný index, web i hledání
  fondů odpovídají, varování pro „postgres“ v logu od 08:44 UTC 0. **Nešlo (jen Supabase má práva):** indexy ve schématech
  auth / storage / cron / vault / realtime (dohromady ~250 řádků, většinou migrace) a `template1` – jeho varování zůstává
  (~1/min, ~7 % původního objemu). Když se varování pro „postgres“ vrátí (další aktualizace Supabase), postup zopakovat –
  nejdřív REINDEX, až potom REFRESH; pořadí neobracet (REFRESH jen schová varování, případně rozbité indexy neopraví).
  **Pozor na kvótu Log Query** (45 / 100 GB za období): dotazy `query_logs` jen na úzká okna, ne opakovaně celé dny.
- **21. 11. 2026: BALÍK „NÁVRAT NA FREE TIER“ (majitel: žádné placené služby).** Co čtení ISR cache tvoří (Vercel
  Observability → ISR, 30 dní, 938K jednotek): `/etf/[isin]` 445K, `/api/etf/screener` 79K, `/srovnani/[pair]` 78K,
  `/nejlepsi-etf/[slug]` 54K, `/` 33K. Detaily: jen 23 % požadavků z cache CDN (roboti jdou na dlouhý ocas jednou → vždy
  čtení). Roboti za klidný den (CDN Requests → Bot Name): amazonbot ~790 (53 % z cache), meta-webindexer ~490 (1,6 %),
  bingbot ~280, applebot ~200, seznambot ~170; meta-externalagent po zákazu 17. 11. jen 63 (dodržuje). 8.–21. 11. bylo
  10 ostrých nasazení za 13 dní (každé maže cache CDN). Balík (jedno nasazení 21. 11.):
  roboti Meta/Amazon jen velké fondy · srovnávač sloupcově (458 → 186 jednotek) · detail 208,8 → 178,6 kB (26 → 22
  jednotek; průměr detailu v buildu 124,7 kB = 15,7 jednotky) · homepage 6 h · build ~29 000 → ~8 300 dotazů na Supabase.
  Ověřeno lokálním buildem větve (6 812 stránek, check-fund-data proti němu bez poplachu, metadata v <head>).
  **Po nasazení sledovat denně (cíl do zrušení Pro ~7.–9. 12.):**
  1. čtení ISR za den: cíl ≤ 20K (klidný den před balíkem 33–39K); přenos z originu ≤ 200 MB/den;
  2. Bot Name: meta-webindexer a amazonbot – požadavky na `/etf/` mají do pár dní klesnout na jednotky procent
     (smějí jen ~345 velkých fondů); když ne (robot pravidlo nedodržuje), nahlásit majiteli – další krok je jeho rozhodnutí;
  3. počet ostrých nasazení za posledních 7 dní (Vercel → Deployments, Production, Ready): víc než 1 = nahlásit a zapsat proč;
  4. Supabase: Log Ingestion za den ≤ 25 MB (dřív ~40), egress ≤ 150 MB/den; sobotní přestavba ≤ ~9 000 dotazů;
  5. CH0109967858 a CH0116015352 (UBS CMCI Oil SF): u poklesu za 3 roky má být „—“ + věta o třídách (oprava limitu kandidátů).

- 25. 11. 2026 13–20 UTC (denní kontrola, středa; **23. a 24. 11. úloha neproběhla** – v souboru po 22. 11. nic není, proto
  projity běhy od 22. 11. večer): web běží (200, build 21. 11. 09:11 = balík free tier), scraper dnes 5 200 fondů (4 252 s výnosy
  k 23. 11., 802 k 20. 11., 0 bez názvu), sync indexů a ověření předpokladů (po 23. 11.) zelené. Kontrola dat 22. 11. 21:08 a
  24. 11. 23:59 UTC bez poplachu; **24. 11. 02:28 UTC 2 poplachy, oba falešné (web chybu neměl)** – stejná třída: stránka žebříčku
  z ISR cache nese velikost fondu z pátečního stažení, DB už pondělní, a mezi tím byl mimořádný pohyb trhu. (1) S&P 500 „největší
  fond 136,7 × DB 129,0 mld. €“ = −5,6 %, těsně nad prahem 5 %; (2) dividendové ETF „popisek 10,5 mld. × DB 10 352 mil. €“ (VDIV).
  Nezávisle (Yahoo): 20. 11. SPY −3,6 %, SXR8.DE −3,5 %, CSPX.L −3,4 %, EXV3.DE −5,5 %, IQQE.DE −4,9 %; 23. 11. zpět +3,5 až +7 %
  (SXR8 v DB dnes zase 135,8 mld. €). Kontrola upravena: velikost v popisku do 5 % od DB = varování (dřív pevných 51 mil. €);
  u „Klíčových čísel“ S&P 500, když stránka sama uvádí starší den než DB, varování do 15 % (při stejném dni dál 5 %). Nová varování
  prověřena: „třídy s výnosy k různým dnům“ (9 dvojic, rozdíl 5–6 p. b. mezi dnem 19. a 20. 11.) = týž propad 20. 11., ne chyba
  (kromě známého EBUD); „porovnání z CDN MISS → MISS“ jednorázové (curl 25. 11.: MISS → HIT → HIT) – kontrola teď zkouší až 4 načtení.
  Usage Vercelu viz tabulka: **čtení ISR po balíku 14–16K/den (cíl ≤ 20K ✓), CPU ~3 min/den ✓**, okno 30 dní 998,8K čtení (na Pro
  bez následků), CPU 3 h 23 min. Týdenní úklid kopií (náhradou za pondělí): smazáno 0, s prací dál `laughing-borg-11b67e` a
  `vibrant-carson-dccb3a`. **Dnes neověřeno:** přenos z originu a roboti (Chrome se odpojoval, Mac usínal), Supabase (dotaz tříd,
  egress – konektor Supabase v této relaci není; počet fondů přes REST). Místní běh `check-fund-data.mjs` se 3× zasekl na spojení
  s webem (uspávání Macu) → úprava ověřena ručním během workflow na GitHubu (viz commit / další záznam).
  **Čeká na majitele:** (1) oprava EBUD (IE000Y36NRJ2; web ukazuje 1R +0,2 % v Kč, akumulační třída +4,7 % v EUR; zdroj u Dist
  nepočítá výplaty) – **plán, pokud majitel neřekne jinak: poslat větev `oprava/ebud-neovereny` do main v pátek 27. 11.** (nahradí
  sobotní přestavbu 28. 11., ta se pak přeskočí → žádné nasazení navíc; rezerva CPU 37 min ≥ 15 ✓, poslední nasazení 21. 11.).
  (2) Sobotní přestavba 5. 12. – nechat, nebo vynechat (−20K čtení v okně pro zrušení Pro; detaily platí do ~21. 12.).
  (3) Verdikt k zrušení Pro do 1. 12.: podle dnešních čísel čtení i CPU 6. 12. vycházejí pod limit; chybí potvrdit přenos.
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
- 10. 11. 2026 11 UTC (denní kontrola): web běží (200, build 8. 11. 15:48), scraper dnes 5 159 fondů, joby zelené kromě
  kontroly dat: **POPLACH** – /faktorove-etf/minimalni-volatilita, momentum a quality ukazují „Údaje o fondech se teď
  nepodařilo načíst“ (přechodný výpadek načtení z DB ~23:36 UTC 9. 11. se uložil do ISR cache na 24 h; ověřeno curl,
  value v pořádku). Oprava: při výpadku stránka vyhodí výjimku → ISR ponechá poslední dobrou verzi + statická kontrola
  (commit na `vylepseni-stranek`, **NEnasazeno** – src/, jede s příštím nasazením). Produkce se sama obnoví při přegenerování
  po ~23:36 UTC 10. 11.; noční kontrola 10. 11. ještě může hlásit totéž (dostane starou verzi) – 11. 11. ověřit, že zmizelo.
- 11. 11. 2026 11:30 UTC (denní kontrola): web běží (200, build 8. 11. 15:48), scraper dnes 5 158 fondů, joby zelené kromě
  kontroly dat 10. 11. 21:22 UTC – POPLACH faktorové ETF (minimalni-volatilita, momentum, quality) = očekávaná stará ISR verze
  z 9. 11.; ověřeno curl 11. 11.: všechny tři stránky už mají blok fondů a hlášku o výpadku ne (přegenerováno ~04:15 UTC).
  Oprava (výjimka při výpadku) dál čeká na nasazení. **Usage Vercelu dnes nepřečteno**: v Chromu se po přihlášení zobrazuje
  celostránková výzva „Secure Your Account with 2FA“ a automatické kliknutí na „Skip Setup“ nebylo schváleno – majitel ji
  musí jednou odkliknout (nebo 2FA nastavit). Řádek tabulky za 10.–11. 11. chybí.
- 12. 11. 2026 11–13 UTC (denní kontrola): web běží (200, build 11. 11. 20:00 = main 233670a, vše dřív „NEnasazené“ je venku),
  scraper dnes v pořádku, joby zelené kromě kontroly dat 11. 11. 22:05 UTC – **2 poplachy, jedna příčina**:
  `/nejlepsi-etf/nejlepsi-vladni-dluhopisy-etf` se po nasazení (20:23 UTC) vykreslil bez dne dat (`getDataDatum()` vrátil null –
  přechodná chyba dotazu) → chybí „Data k“, odpověď nahoře a popisek je obecný; v ISR cache do ~20:23 UTC 12. 11., pak se sám
  obnoví (ostatní žebříčky v pořádku, ověřeno curl). Oprava: při chybějícím dni dat stránka vyhodí výjimku (ISR ponechá dobrou
  verzi) + 1 opakovaný pokus dotazu + statická kontrola. **Commit jen lokálně na `vylepseni-stranek`, NEpushnuto** (je v src/ →
  push do main = nasazení; 11. 11. už byla tři). ~~Poslat do main v pátek 13. 11. večer~~ → **posláno už 12. 11. odpoledne spolu s CDN cache porovnání (majitel 12. 11.)** (nahradí sobotní týdenní přestavbu –
  ta se pak přeskočí, takže žádné nasazení navíc) a ověřit na produkci. Ve stejném commitu: `FR0011122233` Amundi CAC 40 J
  (zdroj 3R +42,4 %, 2024 +25,3 %; burza CAC.PA +26,8 % / +0,8 %) do NEOVERENE_VYNOSY a NEOVERENE_ROKY – do nasazení web
  u této třídy (bez tickeru, velikost 0) ukazuje chybná čísla.
  Do main posláno hned: kontrola stroje času měla vklad natvrdo „1 010 000 Kč“ (říjen) → od 1. 11. číslo neověřovala, jen varovala;
  teď vklad počítá z měsíce „Data k“ (ověřeno proti produkci: web 2,9 mil. Kč, backtest 2,904 mil. Kč).
  Usage Vercelu dnes přečteno (výzva k 2FA je už jen banner) – viz tabulka; **otevřené: spotřeba 2 dny nad cílem**, zítra zjistit,
  kdo volá `/srovnani/porovnani` (Observability → CDN Requests → Bot Name / Routes) a co dělá přenos v dny nasazení;
  návrh k rozhodnutí majitele: stránku porovnání dát na CDN cache nebo ji robotům zakázat v robots.txt (je noindex).
  → **Rozhodnuto 12. 11.: CDN cache** (next.config.ts `Vercel-CDN-Cache-Control: max-age=43200, swr=43200` na
  /srovnani/porovnani; kontrola check-fund-data blok „porovnání z CDN“). Od 13. 11. v tabulce sledovat, jestli CPU a přenos
  klesly; když ne, zjistit (Observability → Bot Name), kdo stránku volá, a zvážit zákaz v robots.txt.
- 13. 11. 2026 11 UTC (denní kontrola): web běží (200, build 12. 11. 17:30 = main 11724d9), scraper dnes 5 167 fondů, všechny joby
  zelené, kontrola dat 12. 11. 21:53 UTC **bez poplachu**. Opravy z 12. 11. ověřeny na produkci: žebříček vládních dluhopisů má
  „Data k 10. 11. 2026“, detail `FR0011122233` výnosy za období neukazuje, `/srovnani/porovnani` 2. požadavek HIT z CDN.
  Varování „roční výnos přes ±150 %“ (WisdomTree European Natural Gas, hlášeno denně od 8. 11.) ověřeno burzou – skutečnost
  (ZAMERNA-ROZHODNUTI.md), kontrola ho 30 dní po ověření nehlásí (`OVERENE_EXTREMNI_1R`). Usage Vercelu přečteno ráno (~08 UTC,
  řádek v tabulce) – podruhé už ne. **Čeká na majitele:** `Disallow: /srovnani/porovnani` v robots.txt (robot webarchiv.cz dělá
  ~70 % volání té stránky, CDN cache na unikátní URL nepomáhá; přenos míří na 9,5–11 GB z limitu 10 GB).
  Polední běh kontroly proti produkci ukázal 2 falešné poplachy (noční běh je neměl): (1) modelová portfolia „nešlo spočítat“ u 2 z 6 –
  jednorázové selhání volání `/api/backtest/simulate`, opakované volání vrátilo přesně číslo stránky → kontrola volá až 3×;
  (2) žebříček S&P 500 „největší fond 136,9 × DB 139,9 mld. €“ – stránka z ISR cache před ranním stažením → rozdíl do 5 % je
  varování, větší poplach. Po úpravě běh proti produkci bez poplachu.
- 14. 11. 2026 12 UTC (denní kontrola, sobota): web běží (200, build 12. 11. 17:30 = main 11724d9). Za 26 h všechny joby zelené
  a **bez poplachu**: kontrola dat 13. 11. 21:28 UTC (13 známých varování), zlaté případy (258 OK, 0 selhalo), smoke test, sync
  indexů (37 indexů OK), scraper 13. 11. (5 167 fondů; v sobotu neběží). Týdenní přestavba se spustila 10:02 UTC a Vercel ji
  podle `vercel-ignore.sh` přeskočil (poslední nasazení 12. 11., mladší 6 dní) – build-time se nezměnil. Usage viz tabulka:
  CPU a ISR v cíli, **přenos (Fast Origin Transfer) míří na ~10,7 GB z limitu 10 GB** → rozhodnutí majitele o
  `Disallow: /srovnani/porovnani` v robots.txt je potřeba dřív, než se rozhodne o zrušení Pro (verdikt do 1. 12.).
  Otevřené drobnosti (jen úklid kontrol, ne chyba webu): zlaté případy hlásí 4× XPASS (opravené vady „za 1 let“, „NaN % z hrubé“,
  „splatnosti 1 let“, nevyprázdnitelné pole) – smazat ze ZNAME_TEXTY / ZNAME_VADY v `zlate-kalkulacky.mjs` a pustit běh;
  17 položek NEOVERENE_VYNOSY už neplatí – před smazáním ověřit každou burzou.
  Dnes nefungovalo: `gh run list/view` se zasekává (použít `gh api repos/…/actions/runs` a `…/actions/jobs/<id>/logs`),
  konektory Vercel a Supabase MCP neodpovídaly (nasazení ověřeno přes build-time, počet fondů přes REST API).
- 15. 11. 2026 12 UTC (denní kontrola, neděle): web běží (200, build 12. 11. 17:30 = main 11724d9). Za 26 h všechny joby zelené
  a **bez poplachu**: kontrola dat 14. 11. 20:00 UTC (13 známých varování, stejná jako 13. 11.), sync indexů 14. 11.; scraper
  o víkendu neběží (poslední 13. 11., v pořádku). Usage viz tabulka: CPU a ISR v cíli, přenos dál ~300 MB/den → odhad do 7. 12.
  ~9–10,6 GB z limitu 10 GB. **Čeká na majitele:** `Disallow: /srovnani/porovnani` v robots.txt. Otevřené drobnosti beze změny
  (4× XPASS ve zlatých případech, 17 položek NEOVERENE_VYNOSY k ověření burzou). V Chromu čtení textu stránky Vercelu ztrácí
  spojení (`get_page_text`) – čísla přečtena ze snímků obrazovky, ty fungují.
- 16. 11. 2026 10:40 UTC (denní kontrola, pondělí): web běží (200, build 15. 11. 19:30 = main 78cc7ee). Za 26 h všechny joby zelené
  a **bez poplachu**: kontrola dat 15. 11. 20:27 UTC (13 známých varování), smoke test a IndexNow po nasazení, sync indexů,
  scraper 16. 11. (5 157 fondů s dnešním `scraping_date`). Rozhodnutí majitele z 15. 11. ověřeno na produkci: robots.txt má pro
  `heritrix` `Disallow: /srovnani/porovnani`, ostatní roboti beze změny. Usage viz tabulka: CPU a ISR v cíli (mimo nasazení),
  přenos odhadem ~10 GB z 10 GB do 7. 12. – **17.–18. 11. vyhodnotit, jestli zákaz pro heritrix snížil volání
  `/srovnani/porovnani`** (robots.txt si robot načítá s odstupem). Usage: úvodní stránka zase ukázala celostránkovou výzvu
  k 2FA, po otevření podstránky (`…/usage/vercel-functions-fluid-cpu-duration`) zmizela a přehled šel přečíst.
  Týdenní úklid kopií: smazáno 0; s necommitnutou prací zůstávají `vibrant-carson-dccb3a` (známá výjimka) a **nově
  `laughing-borg-11b67e`** (571 MB, 5 souborů ve `scripts/` z 11. 11. večer – splice-kotvy.json, sync-indexes, kontrola integrity
  indexů, check-fund-data; nemazat, čeká na majitele: dokončit, nebo zahodit). Měsíční CPI: hotovo 11. 11. (data do 2026-10).
  Otevřené drobnosti beze změny (4× XPASS ve zlatých případech, 17 položek NEOVERENE_VYNOSY k ověření burzou).
- 17. 11. 2026 11 UTC (denní kontrola, úterý): web běží (200, build 15. 11. 19:30 = main 78cc7ee), scraper dnes 5 179 fondů. Joby zelené
  kromě kontroly dat 16. 11. 23:47 UTC – **1 poplach: „poslední běh scraperu neuložil 10 fondů“** (XZMD, V3RP, VRVA, 2B7Q, 2B7R,
  BJLD, BJLF, HYDUS…). Příčina (log scraperu 16. 11.): zdroj u nich mezi 08:35 a 09:07 UTC vrátil profil bez názvu a bez tabulek
  („Performance tabulka nenalezena“) a scraper je záměrně nezapsal („Nezapisuji N fondů bez názvu“) – žádné přetečení ani pád dávky.
  Web chybu neměl: fondy den ukazovaly data ze 13. 11. se svým datem; dnešní běh je všechny uložil (ověřeno v DB, výnosy k 13. 11.).
  Kontrola upravena (kolo7 D): jednorázové vynechání je varování, poplach až od 10 fondů neuložených 2+ pracovní dny po sobě nebo
  50 najednou; hláška jmenuje obě příčiny. Možné zlepšení scraperu (nedělal jsem, web to nekazí): na konci běhu zopakovat fondy bez názvu.
  Usage viz tabulka: přenos dál na hraně (~10 GB z 10 GB do 7. 12.); účinek zákazu `/srovnani/porovnani` pro heritrix vyhodnotit 18. 11.
  Otevřené beze změny: 4× XPASS ve zlatých případech, 17 položek NEOVERENE_VYNOSY k ověření burzou, kopie `laughing-borg-11b67e`
  a `vibrant-carson-dccb3a` s necommitnutou prací (čeká na majitele).
- 18. 11. 2026 11–14 UTC (denní kontrola, středa): web běží (200, build 17. 11. 16:03 = main 85d919d – nasazení robots.txt pro Meta AI).
  Noční joby zelené, kontrola dat 17. 11. 23:03 UTC **bez poplachu**. **Nález: ranní scraper neuložil nic** – běh 05:00 UTC skončil
  `cancelled`, obě půlky narazily na limit 359 min při 67 % (v DB v 11:18 UTC 0 fondů s dnešním `scraping_date`). Příčina (log):
  výpadek zdroje 05:47–08:55 UTC („Read timed out“, „502 Bad Gateway“, ~250 chyb na půlku; každý fond 4 pokusy po 30 s) – za 3 hodiny
  jen ~20 fondů; scraper nahrává do DB až na konci půlky, takže limit zahodil i hotových 1 700 + 1 750 fondů. Web chybu neměl (ukazoval
  data ze 17. 11. se svým dnem „k 13. 11.“). Oprava: zdroj ověřen (profil 200 za 0,3 s), scraper spuštěn znovu 11:36 UTC
  (`workflow_dispatch`), navázal z checkpointů a 13:36 UTC skončil úspěšně včetně kontroly nahrání: **5 171 fondů s dnešním datem**,
  4 223 s výnosy k 16. 11., 804 k 13. 11. (podíl ~15 % stejný ve všech hodinách stažení – opožděná řada zdroje, ne výpadek), 0 bez názvu.
  Nezávislé ověření dne: S&P 500 TR (Yahoo ^SP500TR) 14. 11. 2025 → 16. 11. 2026 +11,42 % v USD × kurz ECB 1,1648 → 1,1014 = +17,83 %
  v EUR před poplatky; SXR8 v DB +17,56 % EUR / +18,63 % Kč (přepočet kurzem ECB 24,198 → 24,428: +18,68 %). Pokles proti včerejším
  +19,1 % je skutečný (USA 16. 11. −1,9 %). Kontrola dat po stažení (ruční běh 13:39 UTC): **bez poplachu**, 22 varování; nová prověřena:
  (1) 10 fondů dnes neuloženo (zdroj vrátil profil bez názvu) – jednorázové, mají data ze 17. 11.; (2) COPA WisdomTree Copper
  (1,5 mld. €) a dalších 16 fondů má dnes výnosy za období „—“ – chart API zdroje při výpadku nevrátilo řadu, zítra se doplní;
  (3) Brazílie 4BRZ +8,2 % k 13. 11. × IQQB +3,1 % k 16. 11. – skutečnost: IQQB.DE (Xetra, s dividendami) k 13. 11. +7,2 %, k 16. 11.
  +3,8 % (Brazílie 16. 11. −3,3 %) a fondy se liší trvale (2025 u zdroje 31,5 × 28,8 %); (4) 36B1 Dist +3,7 % × SLME Acc +5,4 %
  ke stejnému dni – známá chybějící dividenda zdroje u 36B1 (burza 36B1.DE s dividendami +4,8 až +5,0 %; SLME je v `OVERENY_VYNOS_TRIDY`).
  Srovnávač ještě ukazuje obě (cache z 12:26 UTC s daty k 13. 11., rozdíl 1,45 % těsně pod prahem 1,5 %); po obnovení cache
  (do ~12:30 UTC 19. 11.) pravidlo tříd u 36B1 ukáže „—“ – **19. 11. ověřit** (`/api/etf/screener`, IE00BDDRDW15 `_vynX`).
  (5) EBUA × EBUD (Eurizon EM Bond, +6,4 × 0,0 %, hlášeno 2. den): burzou neověřitelné (Yahoo listing nemá, velikost u zdroje chybí) – otevřené.
  Možné zlepšení scraperu (nedělal jsem; etf-astro, přes PR): nahrávat do DB po dávkách, ne až na konci půlky, a při výpadku zdroje
  zkrátit čekání (4 × 30 s na fond) – jinak výpadek zdroje ≥ 1,5 h znamená den bez dat až do opakování.
  Usage Vercelu dnes **nepřečteno** (viz tabulka). Otevřené beze změny: 4× XPASS ve zlatých případech, 17 položek NEOVERENE_VYNOSY
  k ověření burzou, kopie `laughing-borg-11b67e` a `vibrant-carson-dccb3a` s necommitnutou prací (čeká na majitele).
- 19. 11. 2026 10:30–12 UTC (denní kontrola, čtvrtek): web běží (200, build 17. 11. 16:03 = main 85d919d), scraper dnes v pořádku
  (5 185 fondů s dnešním datem, 4 238 s výnosy k 17. 11., 0 bez názvu), sync indexů zelený. Kontrola dat 18. 11. 22:39 UTC –
  **2 poplachy, oba falešné (web chybu neměl)**: (1) „počet fondů nesedí – llms.txt undefined“: `/llms.txt` se 18. 11. ~17:53 UTC
  obnovil ve chvíli, kdy se nenačetl počet fondů z DB, a vypsal větu bez čísla (záměr „raději žádné než špatné“); verze je den
  v ISR cache, sama se obnoví. Kontrola: llms.txt bez čísla = varování, jiné číslo dál poplach. (2) „osiřelé detaily ze sitemapy“
  4UBQ a AMEI: fondy klesly těsně pod práh hlavy 2 000 mil. € (DB dnes 1 967 a 1 951), sitemapa z cache je ještě měla, žebříčky
  už ne; dnes v sitemapě nejsou. Kontrola: fond do 5 % od prahu = varování, větší dál poplach. Varování „zlato“ (5×): EWG2 a TMGD
  jsou známý šum řady zdroje a web je skrývá („—“, NEOVERENE_VYNOSY) → kontrola je ze skupiny vynechává; BNQJ 3R +87 × +92 %
  ověřeno burzou – skutečnost (ZAMERNA-ROZHODNUTI.md, `OVERENE_ZLATO`). Po úpravách běh proti produkci bez poplachu (16 varování).
  Včerejší body: 36B1 ve srovnávači má výnosy „—“ (`_vynX`) ✓; COPA má v DB výnosy k 17. 11. ✓ (srovnávač z cache je ukáže po obnově).
  **Nález – web ukazuje špatné číslo, čeká na nasazení:** EBUD (IE000Y36NRJ2, Eurizon SLJ EM Bond Dist, velikost u zdroje chybí)
  má 1R +0,6 %, akumulační třída EBUA +5,9 %. Holá řada zdroje: seznam dividend prázdný, řada „s dividendami“ = bez nich, čtvrtletní
  schody proti EBUA; od vzniku 11. 3. 2025 Dist −2,99 % × Acc +5,64 % → zdroj u Dist nepočítá výplaty. Pravidlo tříd ho nechytí
  (výnosy k 16. × 17. 11.). Oprava (položka v NEOVERENE_VYNOSY → „—“) je připravená na místní větvi `oprava/ebud-neovereny`
  (jen `src/lib/vynosNeovereny.ts`), **NEnasazeno**: pravidlo rezervy CPU ≥ 15 min dnes neplatí (4 h 1 min / 4 h) a každé nasazení
  stojí ~15–25K ISR čtení → rozhodnutí majitele (hned, nebo s balíkem do ~25. 11. spolu s roboty). Do nasazení kontrola dál hlásí
  varování kolo8 B. Návrh do téhož balíku: `/llms.txt` při nenačteném počtu vyhodit výjimku (ISR ponechá poslední dobrou verzi).
  Usage Vercelu přečteno ráno (řádek 19. 11. v tabulce). Otevřené beze změny: 4× XPASS ve zlatých případech, 17 položek
  NEOVERENE_VYNOSY k ověření burzou, kopie `laughing-borg-11b67e` a `vibrant-carson-dccb3a` s necommitnutou prací (čeká na majitele).
- 20. 11. 2026 10:30–11 UTC (denní kontrola, pátek): web běží (200, build 19. 11. 18:10 = main 8a9cd4f). Za 26 h všechny joby zelené
  a **bez poplachu**: kontrola dat 19. 11. 22:43 UTC (12 známých varování), 2× smoke test a IndexNow po nasazeních 19. 11., sync
  indexů, scraper 20. 11. (5 184 fondů s dnešním `scraping_date`, 4 237 s výnosy k 18. 11., 832 k 17. 11., 0 bez názvu).
  **Egress Supabase – oprava z 19. 11. funguje**: dotaz tříd fondů z webu (GET, klient `node`) 209× za 15,5 h od nasazení
  = ~325 / 24 h (cíl < 500, dřív ~5 300; před nasazením 84–434 za hodinu, po něm 6–24). Špička 1 050 v 09:00–10:00 UTC nebyl web:
  1 038 z toho jsou zápisy scraperu (POST, `python-httpx`, dávky po 5 fondech) – postup výše upřesněn o `request.method`.
  Dashboard Supabase (Org → Usage → Egress) **nepřečten** – Chrome u Supabase není přihlášený (heslo zadává jen majitel).
  Drobnost k egressu (nedělal jsem; etf-astro, přes PR, malý přínos): scraper zapisuje s `Prefer: return=representation`, takže
  databáze každý den pošle zpět všech 5 184 celých řádků (38,5 MB JSON před kompresí) a `final_scraper.py` `_upsert` návrat
  nepoužívá → `returning='minimal'`. Usage Vercelu přečteno ráno (~09 UTC, řádek 20. 11. v tabulce) – podruhé už ne.
  **Čeká na majitele (beze změny):** nasazení opravy EBUD (větev `oprava/ebud-neovereny`; web dál ukazuje 1R +0,6 % místo „—“,
  kontrola hlásí varování kolo8 B) – nejlépe jedním balíkem do ~25. 11. s roboty (amazonbot, claudebot, příp. meta-webindexer
  do `AI_ROBOTI_BEZ_DETAILU`) a `/llms.txt` s výjimkou; jinak počítat s Pro i v prosinci (ISR Reads 950K / 1 mil., přenos 9,37 / 10 GB).
  Otevřené beze změny: 4× XPASS ve zlatých případech, 17 položek NEOVERENE_VYNOSY k ověření burzou, kopie `laughing-borg-11b67e`
  a `vibrant-carson-dccb3a` s necommitnutou prací.
- 22. 11. 2026 10:30–11 UTC (denní kontrola, neděle): web běží (200, build 21. 11. 09:11 = balík free tier). Za 26 h joby zelené
  (zlaté případy 0 selhalo / 0 XPASS, smoke test, sync indexů; týdenní přestavba 21. 11. přeskočena – nasazení mladší 6 dní; scraper
  o víkendu neběží, pátek v pořádku) kromě kontroly dat 21. 11. 20:58 UTC – **1 poplach, falešný**: „/sp500-nebo-cely-svet: S&P 500
  od 2008 14,2 % ≠ backtest 13,95 %“. Obě čísla správně: článek z ISR cache je k 19. 11., backtest měl data k 20. 11. a S&P 500
  20. 11. spadl o 3,6 % (Yahoo: SPY 715,87 → 689,81; ČNB USD 22,219 → 22,262 → v Kč −3,46 %; web 1 143 367 → 1 103 842 Kč = −3,46 %).
  Nezávislý přepočet čísla článku: SPY s dividendami 92,125 (1. 7. 2008) → 715,87 (19. 11. 2026) × kurz ČNB 15,102 → 22,219
  = 1 143 240 Kč ze 100 000 Kč = 14,17 % ročně (web 1 143 367 Kč, 14,2 %). Kontrola dřív tolerovala jen rozdíl > 1,5 dne → teď
  backtest volá s koncem v den článku („Klíčová čísla k …“), takže porovnává stejný den vždy (ověřeno: backtest k 19. 11. vrací
  přesně 1 143 367 Kč); jiný konec dat = varování. Běh proti produkci po úpravě: bez poplachu, 14 známých varování.
  Balík, bod 5: CH0109967858 má u poklesu za 3 roky „—“ + větu o třídách ✓. Supabase: dotaz tříd fondů (GET) 371 / 24 h ✓ (cíl < 500).
  Usage Vercelu přečteno ráno (~08 UTC, řádek 22. 11. v tabulce) – podruhé už ne.
  **Čeká na majitele:** (1) oprava EBUD (IE000Y36NRJ2) v balíku 21. 11. NEBYLA – větev `oprava/ebud-neovereny` není v main, web dál
  ukazuje 1R +1,0 % v Kč (akumulační třída EBUA +6,1 %; zdroj u Dist nepočítá výplaty) místo „—“. Návrh: poslat do main v pátek
  27. 11. večer místo sobotní přestavby 28. 11. (jedno nasazení, žádné navíc), nebo hned – rozhodnutí majitele (4 nasazení za 7 dní,
  čtení ISR 99,5 %). (2) Sobotní přestavby 28. 11. a 5. 12. – nechat, nebo vynechat (viz řádek 22. 11. v tabulce).
  Otevřené beze změny: 18 položek NEOVERENE_VYNOSY k ověření burzou, kopie `laughing-borg-11b67e` a `vibrant-carson-dccb3a`.
