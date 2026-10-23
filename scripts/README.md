# Kontroly webu: produkce vs. lokální build

Rozhodnutí majitele 23. 10. 2026 (CLAUDE.md): **naše testy a kontroly NESMÍ procházet produkci hromadně** – každý
nový detail fondu `/etf/[isin]` (a nekurátorská dvojice `/srovnani/[pair]`) = ISR zápis na Vercelu, free tier má
200 000 zápisů / 30 dní. Proti produkci jen **pevná malá sada stránek**, široké kontroly proti **lokálnímu buildu**.

Sdílený režim: `scripts/lib/cil.mjs`.

| Režim | Kdy | Dynamické stránky |
|---|---|---|
| produkční | cíl obsahuje `etfpruvodce.cz` (výchozí u denních workflowů), nebo `NUTIT_PRODUKCNI_REZIM=1` | jen `PROD_DETAILY` (15 fondů) + `PROD_DVOJICE` (hlavní kurátorské dvojice + `vwce-vs-eunl` + `vwce-vs-spyi`) = 30 stránek, pevně |
| lokální | localhost, náhled (vercel.app) | plný rozsah – top 50 fondů, fondy vybrané z DB, všechny dvojice ze sitemapy… |

V produkčním režimu:
- kontroly, které si fondy vybírají z DB (top 50 podle velikosti, „fondy bez výnosů“, „nový fond“, 20 největších…),
  použijí fondy z pevné sady, nebo se přeskočí – výpis je uvede v sekci **„Jen lokálně“**;
- kontroly samotných dat v DB (bez stahování stránek) běží vždy;
- Playwright: v každém kontextu se blokuje měření (GA, `/api/ev`) a **prefetch Next.js** na detaily/dvojice mimo
  pevnou sadu (Next.js v produkci sám přednačítá viditelné odkazy – `/srovnani` tak bez kliknutí sáhlo na 11 detailů);
- **pojistky**: požadavek na dynamickou stránku mimo pevnou sadu se neodešle a běh skončí chybou „kontrola by
  zapisovala do ISR“; nad 40 unikátních dynamických stránek za běh skript okamžitě skončí.

Nová kontrola, která potřebuje detail fondu: vezmi reprezentanta z `PROD_DETAILY` (`R.detaily([...], 'popis')`),
nebo ji na produkci přeskoč (`R.jenLokalne('popis')`). Pevná sada se nesmí měnit den ode dne (žádný výběr z DB).

## Plný běh proti lokálnímu buildu – CEO před každým nasazením

1. Build v samostatném worktree / klonu (build za běhu `next dev` ve stejném adresáři rozbije dev server):
   ```bash
   npm ci && npm run build && npx next start -p 3005
   ```
2. V jiném terminálu (klíč z `.secrets/supabase.env`, nevypisovat):
   ```bash
   export SUPABASE_KEY=…                                         # jen čtení DB
   WEB_URL=http://localhost:3005 node scripts/check-fund-data.mjs   # plný rozsah dat + stránek
   node scripts/zlate-kalkulacky.mjs http://localhost:3005          # zlaté případy nástrojů (Chromium + WebKit)
   BASE_URL=http://localhost:3005 node scripts/prod-smoke.mjs
   BASE_URL=http://localhost:3005 node scripts/backtest-validate.mjs
   node scripts/qa-kalkulacky.mjs http://localhost:3005             # mobilní pole kalkulaček
   ```
   Výpis začíná řádkem `Režim: lokální (plný rozsah)`. Poplachy z lokálního běhu se opravují **před** nasazením.
3. Zkouška produkčního režimu bez produkce (stejná pevná sada, jen proti lokálu):
   ```bash
   NUTIT_PRODUKCNI_REZIM=1 WEB_URL=http://localhost:3005 node scripts/check-fund-data.mjs
   ```

## Denní workflowy proti produkci (produkční režim automaticky)

| Workflow | Skript | Kdy |
|---|---|---|
| `fund-data-check.yml` | `check-fund-data.mjs` | denně 15:30 UTC |
| `zlate-pripady.yml` | `zlate-kalkulacky.mjs` | denně 06:30 UTC |
| `prod-smoke.yml` | `prod-smoke.mjs` + `backtest-validate.mjs` | po pushi na main + denně 06:00 UTC |

Měřeno 23. 10. 2026 (fetch + Playwright hook proti lokálnímu `next start`; vykreslované detaily/dvojice za běh,
v závorce mimo předgenerované při buildu): check-fund-data 90 (68) → 30 (13), prod-smoke 11 (8) → 6 (3),
zlate-kalkulacky 15 (12) → 4 (1), qa-kalkulacky 0 → 0. U prohlížečových testů šlo vše o prefetch Next.js.
Pevná sada stojí ISR zápis jen první den po nasazení (a pak jednou za revalidate).
