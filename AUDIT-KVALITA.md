# Audit kvality webu etfpruvodce.cz + plán zvýšení úrovně

_Noční audit (7 expertních agentů + syntéza) a první dávka implementace. Stav: dnes._

---

## TL;DR

**Proč Google indexuje jen homepage:** není to technika (potvrzeno – ty sám 20×, i tento audit: SSR, 200, canonical, robots, žádný Vary jsou OK). Je to **kvalita a „zajímavost" obsahu** + **slabé interní prolinkování** + **chybějící důvěryhodnostní (YMYL) signály**. Přesně tvoje intuice.

**Co jsem už v noci naprogramoval a ověřil** (větev `vylepseni/kvalita-obsahu-seo`, commit `3b784ba`, **nepushnuto**):
1. **Srovnávací stránky** (`/srovnani-etf/x-vs-y`) – z ~1 400 znaků boilerplate na **~15 000 znaků unikátního, datově řízeného obsahu** (tabulka metrik, „kdy zvolit který", FAQ, JSON-LD). Tohle byla příčina indexace č. 1.
2. **Homepage rozcestník** – 30 odkazů na kategorie + 18 na srovnání + kalkulačky (dřív 2 kategorie, 0 srovnání). Příčina č. 2.
3. **Investiční disclaimer** (YMYL trust) v patičce + na srovnáních.
4. **Oprava datové vrstvy** – zakázaný Supabase klíč → funkční (jinak se renderovaly prázdné = thin stránky).
5. **Oprava bugu** – JSON-LD `dateModified` hlásil Googlu **rok 1905** (12 kategorií).
6. Stale odkazy 2025 → evergreen, dynamický rok v patičce.

Build prošel, datová vrstva ověřena, DB nedotčena, na live nic nešlo.

---

## Diagnóza indexace (podloženo daty)

Google stránky **crawluje, ale neindexuje** („Crawled – currently not indexed") ze tří souběžných důvodů:

1. **Tenký / duplicitní obsah.** Srovnávací stránky měly jen ~1 300–1 400 znaků viditelného textu, ~60 % byla sdílená nav+patička, 38 % 10-gramů sdílely mezi sebou, 0 strukturovaných dat. Kategorie mají sice ~8 000 znaků, ale dvě různé (americké vs evropské) měly **identickou délku 18 168 znaků** → silně šablonovité, generická próza bez metodiky a citací = „unhelpful content".
2. **Slabé interní prolinkování.** Homepage (nejsilnější stránka) odkazovala jen na 2 z 38 kategorií, 0 z 11 srovnání, a plýtvala silou na 10 odkazů na `/etf/[ISIN]`, které jsou samy noindex.
3. **Slabé YMYL trust signály.** Nula investičních disclaimerů na celém webu, žádná affiliate disclosure u „nezávislých" recenzí.

---

## Co je hotové (implementováno + ověřeno)

| # | Změna | Dopad | Stav |
|---|---|---|---|
| 1 | Obohacení 11 srovnávacích stránek (text, tabulka, FAQ, JSON-LD) | 🔴 vysoký | ✅ build ověřen, 15k znaků |
| 2 | Homepage rozcestník (husté prolinkování) | 🔴 vysoký | ✅ 30+18 odkazů |
| 3 | InvestmentDisclaimer (patička + srovnání) | 🟠 střední | ✅ |
| 4 | Oprava Supabase klíče (datová vrstva) | 🔴 vysoký | ✅ build bez prázdných dat |
| 5 | Oprava `dateModified` 1905 (12 kategorií) | 🟠 střední | ✅ 0 výskytů 1905 |
| 6 | Stale 2025 odkazy → evergreen, rok v patičce | 🟡 nízký | ✅ |

---

## Roadmap – co dál (prioritizováno)

### A) Rychlé výhry (S/M, vysoký dopad)
- **Affiliate disclosure** na 6 brokerských recenzí + „Jak hodnotíme brokery" (dnes 0× – právní i trust riziko).
- **Sjednotit hodnocení brokerů** – teď 3 nekonzistentní sady (DEGIRO 79/100 vs 4.6/5 vs 4.5 ve schématu) → riziko penalizace za zavádějící structured data.
- **Autor v JSON-LD jako Person „Tomáš Kostrhoun"** (dnes Organization) – u YMYL Google silně váží jmenovaného experta.
- **Logo 1,7 MB → ~18 KB** (LCP prvek na každé stránce).
- **ItemList JSON-LD** na kategorie; **`<lastmod>`** do sitemapy (dynamická `sitemap.ts`).
- **A11y:** opravit přeskoky nadpisů (h1→h3), `scope`+`caption` u tabulek, kontrast `text-gray-400`.

### B) Strategické sázky (L, vysoký dopad)
- **Obohatit 38 kategorií** o sekci „Jak hodnotíme / metodika", 1–2 odstavce **originálního autorského komentáře** specifického pro kategorii a **citace zdrojů** (MSCI/justETF/ECB) místo generické šablony. _Tohle je jádro „zajímavosti pro Google"._
- **Refaktor 38 hardcoded kategorií** (~652 ř./kus) na jednu dynamickou `[slug]` routu – míň duplicit, snazší přidávat obsah plošně.
- **Mobile UX:** Top 10 tabulka na 38 kategoriích je na mobilu nečitelná (9 sloupců, `w-full` bez min-width) → kartový vzor (už existuje na homepage `TopETFTabs`).
- **Broker CTA s trackingem** (UTM/ref) + více CTA pozic – dnes vedou na holé homepage brokerů s `nofollow`, **nemonetizují ani neměří**.

### C) ⚠️ Migrační blokery (řešit PŘED nasazením Next.js na ostro)
- **Doména:** celý Next.js kód hardcoduje `www.etfpruvodce.cz` (545×), ale produkce je **non-www**. Po nasazení by canonicaly mířily na 308-přesměrované URL = riziko deindexace. → sjednotit na jednu konstantu `SITE_URL`.
- **Supabase klíče** ve Vercel ENV (anon i service jsou legacy/zakázané) → doplnit nové `sb_publishable_` + `sb_secret_`.

---

## Rozhodnutí, která potřebuju od tebe

1. **Pushnout tuhle dávku** na test (větev → PR / merge → Vercel test deploy)? Nebo nejdřív projít kód?
2. **Kanonická doména** Next.js verze: zůstat na **non-www** (jako dnes produkce) a sjednotit kód na to? (doporučuju ano)
3. **Kategorie:** chceš, abych se pustil do **obohacení obsahu kategorií** (metodika + autorský komentář)? To je největší obsahová páka, ale je to hodně textu – ideálně tvoje finální redakční ruka.
4. **Affiliate** – máš partnerské/affiliate odkazy na brokery, které mám zapojit do CTA? (kvůli monetizaci i disclosure)

---

## Jak měřit úspěch
- Search Console → Indexing → „Pages": sledovat přesun z „Crawled – not indexed" do „Indexed".
- Po nasazení dávky ručně požádat o reindexaci 5–10 top srovnání a kategorií (URL Inspection → Request indexing).
- Sledovat, jestli obohacená srovnání začnou rankovat na „X vs Y" dotazy.

_Plný audit (7 dimenzí, ~20 zjištění s důkazy) je k dispozici – můžu rozbalit kteroukoli sekci._
