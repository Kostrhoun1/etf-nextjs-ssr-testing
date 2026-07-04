# Cutover runbook — přepnutí na ostrou etfpruvodce.cz

*Přesné kroky pro GO. Provádí se ráno po tvé kontrole. Vše je připravené na větvi `cutover/produkce`.*

## Stav připravenosti (co je hotové)
- ✅ **Noindex řízený doménou** (middleware) — indexovat smí jen `www.etfpruvodce.cz`, staging nikdy.
- ✅ **Index policy** — obsahové stránky indexovatelné, detaily/utility noindex.
- ✅ **Parita top stránek** — nový web ≥ starý na nejnavštěvovanějších stránkách.
- ✅ **Obsah** — 53 kategorií, souboje, plné porovnání (9 sekcí), AI průvodce.
- ✅ **Měření** — GSC + GA4 napojené.

## GO kroky (pořadí)

### Krok 1 — Přesun rout na root *(dělám já na tvůj pokyn, ~15 min, build-ověřeně)*
- `git mv` každé routy z `src/app/design-preview/*` na `src/app/*` (nahradí staré root routy).
- Smazat staré duplicitní root routy (stará homepage, `nejlepsi-etf/*` statické, `srovnani-etf`, `co-jsou-etf` App+Pages, 6× `*-recenze`…).
- Přepsat interní odkazy `/design-preview/...` → `/...` (NE import cesty `@/components/design-preview`).
- Přidat **301 přesměrování** starých URL → nových (`srovnani-etf`→`srovnani`, `kde-koupit-etf`→`kde-koupit`, `co-jsou-etf`→`pruvodce`, `degiro-recenze`→`recenze/degiro`, …).
- Přidat dynamickou `src/app/sitemap.ts` (indexovatelné produkční URL).
- `npm run build` musí projít.

### Krok 2 — Přepnutí domény *(děláš ty ve Vercelu, ~5 min)*
1. Ve Vercelu → projekt `etf-nextjs-ssr` → **Settings → Domains** → **Add** → `etfpruvodce.cz` a `www.etfpruvodce.cz`.
2. Vercel ukáže DNS záznam (A/CNAME) — nastav u registrátora domény (nebo pokud je DNS na Vercelu, přiřadí se samo).
3. Nastav `www` jako primární (middleware už na to redirectuje apex).
4. Odeber doménu ze starého (Astro) projektu, ať nekolidují.

### Krok 3 — Po přepnutí *(dělám já)*
1. **Deploy do produkce** (merge `cutover/produkce` → `main`, nebo promote deploymentu).
2. **Sitemapa do Search Console** → Sitemaps → přidat `https://www.etfpruvodce.cz/sitemap.xml`.
3. **GSC „Request indexing"** pro klíčové nové stránky (homepage, top kategorie, srovnávač).
4. **Sledovat GA4 + GSC** náběh indexace (denně první týden).

## Rollback (kdyby cokoli)
- **Vercel → Deployments → předchozí → Instant Rollback** (okamžité).
- Nebo přepnout doménu zpět na starý projekt.
- Riziko ztráty SEO je minimální — starý web stejně indexuje jen homepage.

## Ověření po GO (checklist)
- [ ] `https://www.etfpruvodce.cz/` = nový web (ne starý)
- [ ] klíčové stránky vrací 200, ne 404
- [ ] žádné `/design-preview` v URL ani odkazech
- [ ] staré URL (srovnani-etf, co-jsou-etf…) → 301 na nové
- [ ] sitemapa dostupná + odeslaná v GSC
- [ ] mobil i desktop OK
