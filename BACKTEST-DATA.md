# Data pro backtest — jak to funguje

**Autoritativní popis datové vrstvy backtestu.** Když si nevíš rady s indexy, začni tady.
Historie vzniku: [incident 15. 7. 2026](#incident-1572026--proč-tenhle-dokument-vznikl).

---

## 1. Jediná pravda: `src/lib/backtest/indexes.ts`

Manifest. **Každá informace o indexu je jen tady** — ticker, měna, název, zařazení, proxy ETF, TER,
poznámky. Nikde jinde se needituje.

```ts
{ code: 'sp500', ticker: 'SPY', currency: 'USD', name: 'S&P 500 (USA)',
  group: 'region', since: '1993-01-29', managed: true, dataIsNetOfFees: true,
  proxyEtf: { isin: 'IE00B5BMR087', name: 'iShares Core S&P 500', ter: 0.0007 } }
```

Odsud se **odvozuje** (nikdy nekopíruje):

| Kdo | Co si bere | Jak |
|---|---|---|
| `engine.ts` | `INDEX_SOURCE_CURRENCY` | `export { INDEX_SOURCE_CURRENCY } from './indexes'` |
| `sync-indexes.mjs` | tickery, měny, `managed`, `splicedFrom` | přeloží manifest projektovým `tsc` |
| Přehled trhů | `DASHBOARD_GROUPS`, `indexesInGroup()` | záložky Regiony / Sektory / Faktory / Dluhopisy / Komodity |

### Klíčová pole
- **`currency`** — *nativní měna listingu*, ve které data v DB leží. **V DB se nikdy nekonvertuje.**
  Převod na CZK/EUR dělá až engine. US ETF = USD, evropské UCITS dluhopisy = EUR.
- **`managed`** — smí do něj loader zapisovat? `false` = původ dat neověřen → **nikdo na něj nesahá**.
- **`splicedFrom`** — u `us_momentum` / `us_quality`: odkdy jsou data z ETF. Starší část je dopočtená
  z Ken French (viz níže) a **nesmí se přepsat**.
- **`dataIsNetOfFees: true`** — data jsou NAV reálného ETF, tj. **poplatek je už v ceně**. Engine na to
  navíc aplikuje TER proxy ETF → **poplatek se počítá 2×**. Známá chyba, viz [§5](#5-známé-problémy).

---

## 2. Tabulka `index_historical_data`

`index_code · date · close_price` + `UNIQUE(index_code, date)`.
Denní adjusted-close (tj. včetně reinvestovaných dividend) v nativní měně. **37 indexů.**

Původ každé řady byl **empiricky změřen** 15. 7. 2026 (shoda s tickerem na 0,00 %). Tři perličky,
které nikde nebyly zapsané a musely se dohledat podle data startu:

- `world_ex_us` = **VGTSX** — podílový *fond*, ne ETF. Proto historie od 1996 (ETF tehdy neexistovalo).
- `us_value` = **IWD**, `us_growth` = **IWF** — Russell 1000 od iShares, obojí start 2000-05-26.

---

## 3. Loader: `scripts/backtest/sync-indexes.mjs`

```bash
set -a && . ./.secrets/supabase.env && set +a
node scripts/backtest/sync-indexes.mjs            # přírůstkově (denně) – ~20 řádků/index
node scripts/backtest/sync-indexes.mjs --full     # plný resync (týdně) – srovná dividendový drift
node scripts/backtest/sync-indexes.mjs --dry-run  # nic nezapíše
```

**Sedm zásad — každá je reakcí na konkrétní chybu toho starého:**

1. **Nikdy `DELETE`.** Jen upsert. Spadlý běh nesmí ubrat data.
2. **Žádná konverze měn.** Ukládá se nativní měna.
3. **Pojistka na měnu.** Když Yahoo vrátí jinou měnu, než čeká manifest → index se přeskočí, běh spadne.
4. **Jen `managed: true`.**
5. **Splice se nepřepisuje** (data před `splicedFrom` zůstávají).
6. **Přírůstkově.** Denně stačí ~30 dnů. Ale **samotný append nestačí** — Yahoo `adj-close` se po výplatě
   dividendy mění **zpětně** (přeškáluje celou historii). Bez občasného `--full` by vznikl zlom uprostřed řady.
7. **Spadne nahlas** (exit 1).

### Kontrola integrity: `scripts/backtest/check_index_integrity.py`
Hlídá stáří posledního dne, díry uvnitř řady a **úbytek řádků oproti minulému běhu**
(historie v `.secrets/index-integrity-history.json`). Exit 1 při problému → patří na cron.

### Ken French rozšíření: `scripts/backtest/build_factor_extensions.py`
Dopočítává `us_momentum` / `us_quality` pro 1999–2013 (Yahoo tam data nemá, MTUM/QUAL vznikly 2013).
Metodika v `scripts/backtest/data/README.md`. **Loader se téhle části nedotkne** — upsert ji nepřepíše,
protože Yahoo pro ta data nic nevrací.

---

## 4. Co je odstavené a proč na to nesahat

| Kde | Stav |
|---|---|
| `etf-astro` → job `backtest` ve `scrape.yml` | 🚫 **`if: false`** od 15. 7. 2026 |
| `etf-astro/scraper/fetch_index_data_yahoo.py` | 🚫 **Zastaralý, rozbitý ve třech vrstvách** (viz níže) |
| `scripts/backtest/fetch_index_data.py` | ❌ **Smazán** — lhal (`sp500 = ^SP500TR`, měsíční data, neexistující kódy) |
| `scripts/backtest/fetch_sector_data.py` | ❌ **Smazán** — nahrazen `sync-indexes.mjs` |
| Seed `index_mapping` v `001_create_tables.sql` | ⚠️ **Neplatný** (`msci_world`, `stoxx600`, `^SP500TR`). Tabulka sama se používá, seed ne. |

**Scraping ETF z justETF (`refresh_isins`, `scrape`, `trigger_rebuild`) běží dál a je v pořádku** —
odstaven je *jen* ten yfinance job na indexy.

---

## 5. Známé problémy

| Problém | Dopad | Stav |
|---|---|---|
| **TER se počítá 2×** — data jsou NAV ETF (poplatek uvnitř) a engine odečte TER znovu | Podceňujeme výnosy o **~1,7 %** za 24 let (konzervativní směr) | Odloženo na ~19. 7. 2026 (14. 7. vyšel článek s čísly) |
| **3 eurové dluhopisy s neověřeným původem** — `eur_govt_bond_1_3y`, `_3_7y`, `_15_30y` | Data se nedají obnovit ani aktualizovat | `managed: false`, loader se jich nedotkne |
| **Momentum míchá US a World** (Ken French US do 2013, MSCI World po) | Dlouhá okna nejsou čistá | Na krátká okna (1–10 let) OK; jinak s upozorněním |

---

## Incident 15.7.2026 — proč tenhle dokument vznikl

Noční job smazal **419 řádků `sp500`** (celý ocas od 2024-11-06). Produkce půl dne ukazovala
**611 812 Kč místo 738 487 Kč** — živě lidem přicházejícím z Facebookového postu, který sliboval
724 262 Kč. **Odhalil to náhodou dotaz čtenáře v komentářích**, ne my.

**Mechanismus:** `upload_to_supabase()` dělal `DELETE` celé řady + `INSERT` po dávkách po 500.
Dávkování spadlo → zůstalo **8 000 = přesně 16 × 500** řádků.

**Hlubší příčina nebyla ta chyba, ale to, že nikde nebylo zapsáno, odkud která řada pochází.**
Tickery byly ve scraperu (`etf-astro`), měny v `engine.ts`, proxy ETF ve widgetu — **tři pravdy ve dvou
repech, které si odporovaly**. Proto nikdo nepoznal, že skript má zastaralé GBP tickery a konvertuje
všechno do EUR. Data byla správná jen proto, že job **opakovaně padal**; kdyby jednou doběhl, zkorumpoval
by všech 21 dolarových indexů.

Tenhle dokument + manifest jsou odpovědí: **jedna pravda, ověřená měřením, s hlídačem integrity.**
Detaily: `memory/incident-sp500-smazana-data.md`.
