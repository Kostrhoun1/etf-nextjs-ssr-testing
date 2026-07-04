# Měření návštěvnosti pro CEO (cíl 10× za 6 měsíců)

CEO agent řídí web autonomně a vyhodnocuje se vůči cíli 10× organiky. Aby si mohl
tahat **reálná čísla**, potřebuje read-přístup k Search Console. Do té doby jede
na leading indikátorech (`node scripts/seo-scorecard.mjs`, funguje hned).

## Co web už měří
- **Google Analytics 4** – `G-JYJPWHLMZX`
- **Vercel Analytics** – `@vercel/analytics`
- **Search Console** – property ověřená (`google-site-verification` v layout.tsx)

Data se sbírají; jen k nim zatím není programový přístup.

## Napojení Search Console (jednorázově, ~10 min) — dělá majitel

1. **Google Cloud** → nový projekt (nebo existující) → povol **Google Search Console API**.
2. **Service account** → vytvoř → u něj **Keys → Add key → JSON** → stáhne se klíč.
3. Ulož klíč do:  `.secrets/gsc-service-account.json`  (složka `.secrets/` je v `.gitignore`, klíč se nikdy necommitne, **nedávej ho do chatu**).
4. **Search Console** → property etfpruvodce.cz → *Nastavení → Uživatelé a oprávnění* → **přidej e-mail service accountu** (`...@...iam.gserviceaccount.com`) jako *Omezený* uživatel (na čtení stačí).
5. Pokud je property doménová, nech default. Jinak nastav:
   `export GSC_SITE="https://www.etfpruvodce.cz/"`

Hotovo. Test: `node scripts/gsc-report.mjs` → vypíše prokliky, imprese, top dotazy/stránky a trend vs minulý běh (snapshoty v `.secrets/gsc-history.json`).

## Jak to CEO používá
- `node scripts/gsc-report.mjs` — reálná organika (po napojení klíče)
- `node scripts/seo-scorecard.mjs` — leading indikátory (kdykoli, bez klíče)

## ⚠️ Zásadní podmínka cíle 10×
Veškerý obsah teď žije pod `/design-preview` = **noindex staging**. Dokud redesign
nepřejde na **indexovatelnou ostrou routu** (cutover + doména), Google z toho
nevidí nic a návštěvnost neporoste. Cutover je jediný krok, který potřebuje
**rozhodnutí majitele** (produkční změna) — CEO ho nemůže udělat autonomně.
