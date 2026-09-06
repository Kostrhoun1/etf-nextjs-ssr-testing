# Backlog: web použitelný pro nezávislé (fee-only) poradce

Vzniklo 6. 9. 2026 ze čtyř paralelních auditů: pracovní postup poradce, benchmark
zahraničních nástrojů, regulatorní povinnosti v ČR, technický audit dat a exportů.

**Vůdčí myšlenka.** Poradce nepotřebuje další graf. Potřebuje **artefakt, který obstojí
v jeho klientské složce** — datovaný, s doloženým zdrojem, reprodukovatelný po letech.
Zároveň platí, že český trh poradců je malý a poradci platí za CRM, ne za analytiku
(Broker Trust, AdvisorOS). Proto stavíme **jen věci, které zlepší web i pro běžného
čtenáře** — ne B2B produkt.

**Střízlivost.** Profesionální nástroje (Kwanti, Nitrogen, Morningstar, Timeline) stojí
2 500–8 000 USD na poradce ročně. Nekonkurujeme jim. Naše jediné obranné území je
**koruna + české zdanění + čeští brokeři + DIP** — to zahraniční nástroje neudělají.

---

## T0 — Opravy důvěryhodnosti (dělat první, jsou levné)

Nejde o funkce. Jde o věci, které aktivně podkopávají důvěru v data.

| # | Co | Kde | Pracnost |
|---|---|---|---|
| 1 | **Datum aktuálnosti per fond.** `getDataDate()` vrací `MAX(updated_at)` přes celou tabulku → všude svítí dnešní datum, ale **306 fondů je starších než 30 dní** (nejstarší z 12/2025). Stejná konstrukce, jakou jsme 6. 9. vyhodili u ceníků brokerů. Zobrazovat `updated_at` konkrétního záznamu a vizuálně označit data starší ~30 dní. | `src/lib/etf-data.ts:372` | malá |
| 2 | **Smazat smetí z DB.** Řádek `US9229087690` s názvem „ETF Screener", prázdný provider i index, TER null — počítá se do headline „5 064 fondů". | Supabase `etf_funds` | triviální |
| 3 | **Skrýt prázdné řádky Beta / Tracking error.** Beta má 0 hodnot z 5 064, korelace 0, tracking error 258. Trvalá pomlčka nevypadá jako chybějící údaj, ale jako nefunkční nástroj. Vynechat řádek, když je `null` u všech porovnávaných. | `src/components/design-preview/PorovnaniTable.tsx:135–136` | malá |
| 4 | **ISIN do hlavičky porovnání.** Dnes se ukazuje `primary_ticker ?? isin` → když fond má ticker, ISIN se nezobrazí vůbec. Poradce zadává pokyn podle ISIN. | `PorovnaniTable.tsx:172`, sekce na `:88–101` | triviální |
| 5 | **Sjednotit dva zdroje pravdy o indexech.** `indexes.ts` v komentáři říká, že je jediná pravda (a proč — incident 15. 7. se smazanými daty `sp500`), přesto `BacktestWidget` drží druhou natvrdo psanou kopii 26 indexů včetně TER. Engine čte manifest, UI kopii. Odvodit `AVAILABLE_INDEXES` přes `/api/backtest/indexes`. | `BacktestWidget.tsx:28–57` vs. `src/lib/backtest/indexes.ts` | střední |

---

## T1 — Odemknout výstupy (největší poměr přínos/pracnost)

Všechny tři audity nezávisle skončily u toho, že **z webu nejde nic dostat ven**.
Grep přes celý `src/`: žádné `window.print`, CSV, `Blob(`, `navigator.share`, `jspdf`.
Jediný nález je `TODO: Implementovat html2canvas`.

| # | Co | Kde | Pracnost |
|---|---|---|---|
| 6 | **Stav screeneru do URL.** Dnes se serializuje jen `?q=` a `?index=`. Poradce nemůže poslat sestavu („IE domicil, TER < 0,20 %, > 1 mld., ACC") ani ji za rok zreprodukovat. | `ScreenerUI.tsx:158–178` | malá |
| 7 | **Stav backtestu do URL.** Čte se jen `?portfolio=<presetId>`. Vlastní složení, období, částky ani měna nikde → nasimulovaný backtest zmizí s refreshem. | `BacktestWidget.tsx:353–356` | malá |
| 8 | **Export CSV.** Klient už má celou filtrovanou sadu v `filtered`; chybí ~30 řádků (`map` → `Blob` → `<a download>`). Totéž v porovnání, kde jsou data v propu `etfs`. | `ScreenerUI.tsx:251–290`, `PorovnaniTable.tsx` | malá |
| 9 | **Tiskové styly.** `@media print`: skrýt sticky hlavičku a `CompareTray`, mobilní karty na tabulku, hlavička s datem a zdrojem dat. Nejlevnější cesta k listu papíru bez PDF knihovny. | `src/app/globals.css` | střední |

> **Pravidlo pro všechny exporty (#8, #9):** každý výstup musí nést zdroj dat,
> `scraping_date` daného záznamu a verzi metodiky. Bez datovaného snímku je podklad
> z webu pro poradce bezcenný — nemůže po letech doložit, co v okamžiku doporučení věděl.

---

## T2 — Data, která máme a zahazujeme

| # | Co | Kde | Pracnost |
|---|---|---|---|
| 10 | **Filtry: domicil, poskytovatel, stáří fondu, replikace.** Všechno v DB na 100 %, `ScreenerETF` to už načítá — zahodí se to při mapování na `ScreenerRow`. Domicil je pro poradce filtr č. 1 (irský vs. lucemburský = daňové rozhodnutí, ne preference). | `etf-data.ts:702, 757, 822–844`; `ScreenerUI.tsx:395` | malá |
| 11 | **Sloupce: 5letý výnos, volatilita.** `SortKey` už `'r5'` obsahuje, ale sloupec neexistuje a data se na klienta neposílají. Posouvá screener z „kdo letos vydělal" na „co držet 10 let". Pozor na velikost payloadu `/api/etf/screener`. | tamtéž | malá |
| 12 | **`inception_date` jako datum.** Uloženo jako text (`"8 April 2011"`) → nejde podle stáří třídit ani kdyby se sloupec přidal. | scraper + DB | střední |
| 13 | **Vážený TER portfolia v Kč/rok.** Logika `weightedTER` existuje, ale počítá z natvrdo psaných TER proxy ETF. `getMetricsByIsins` navíc **vůbec nevybírá `ter_numeric`** → modelová portfolia nikde neukážou, kolik ročně stojí. Výpočet nákladů v Kč je hotový ve `FeeCalculatorWidget`. | `etf-data.ts:466`, `portfolio-strategie/[slug]/page.tsx:63` | malá |
| 14 | **Vystavit volbu rebalancingu.** Engine umí 9 strategií (kalendářní i toleranční pásma), existuje i `/api/backtest/rebalancing` na jejich porovnání — widget natvrdo posílá `'yearly'`. | `BacktestWidget.tsx:287` | malá |
| 15 | **Vystavit `feeOverride`.** Engine to umí (`engine.ts:661–663`), ale `SimulateRequestBody` pole nepřenáší → funkce je nedosažitelná. Umožní modelovat „co kdyby klient koupil fond za 0,07 % místo 0,20 %". | `src/lib/backtest/simulate.ts:13–33` | malá |
| 16 | **Dopočítat čísla modelových portfolií z enginu.** `expectedReturn: '≈ 5–6 % ročně'` a `maxDrawdown: 'do −20 %'` jsou textové konstanty. Čtenář je vidí jako fakta, ale nevyplývají z backtestu, který stojí na stejném webu. Nahradit výstupem enginu + metodickou poznámkou (období, měna, rebalancing, zdroj). | `src/components/design-preview/portfolioData.ts` | střední |

---

## T3 — Diferenciátory (to, co nikdo jiný nemá)

Řazeno podle toho, jak dobře obsluhují povinnost, kterou poradce těžko dokládá.

| # | Co | Proč zrovna tohle | Pracnost |
|---|---|---|---|
| 17 | **Backtest po české dani.** Přepínač „hrubý / po dani", časový test 3 roky, 15 % z dividend u distribučních fondů. Fakta jsou už napsaná na `/dane-z-etf`, jen se nikde nepočítají. Inflace už hotová je (`realCAGR`). | **Nikdo to nemá.** Ani Curvo (EUR), ani Portfolio Visualizer (USD). Největší nevyužitá díra. | velká |
| 18 | **Kalkulátor záměny fondu.** Vstup: stávající + cílový fond + objem. Výstup: rozdíl TER v Kč/rok, transakční náklady, doba návratnosti, daňový časový test. | Přesně obsluhuje čl. 54 odst. 11 nařízení 2017/565 — poradce musí analýzu nákladů a přínosů záměny doložit. Na českém trhu neexistuje. | střední |
| 19 | **Nákladový list portfolia.** Vážený TER + rozpad po fondech, v Kč i %, plus **graf kumulativního účinku nákladů na výnos v čase**. Navazuje na #13. | Čl. 50: agregace, peněžní i procentní vyjádření, ilustrace kumulativního dopadu. Pozor: web dodává jen produktovou složku, honorář a brokera si doplní poradce — musí to být na exportu napsané. | střední |
| 20 | **Doklad o rozsahu posouzeného trhu.** Exportovatelně: „v kategorii X jsme k datu D posuzovali N fondů, filtry byly F". Kategorie to fakticky už dělají, jde o auditovatelný artefakt. | Čl. 53 — u nezávislého poradenství povinnost posoudit reprezentativní spektrum. Jeden z nejhůř doložitelných požadavků vůbec. Navazuje na #6. | střední |
| 21 | **Náklady brokerů jako strukturovaná data.** Dnes volný text (`etfFee: '1 EUR (ETF Selection), 3 EUR (ostatní ETF)'`) → nepočitatelné. Potřeba vrstva: fixní poplatek, %, minimum, FX spread, poplatek za burzu. | Odemkne „kolik tě to reálně stojí u tvého brokera" jako vstup do simulace. Nikdo v ČR nemá. | velká |
| 22 | **KID/prospekt URL per ISIN + SRI 1–7.** Ke každému ISIN uložit odkaz na KID a factsheet + souhrnný ukazatel rizik z KID. | KID musí klient dostat před transakcí (PRIIPs). Nejlevnější věc s nejvyšší vděčností. Vyžaduje rozšíření scraperu. | střední |
| 23 | **Backtest ze skutečných ISIN.** Dnes jen 26 tříd aktiv přes US proxy (SPY, VTI, EFA…). Mapovat fond → index přes tabulku `index_mapping` (existuje, používá ji nepoužívaný `/api/backtest/search-etf`) a otevřeně říct „modelujeme přes index, TER vašeho fondu je X". | Rozdíl mezi „třídou aktiv" a „fondem, který klient koupí", je přesně to, za co klient poradce platí. | velká |

---

## Nestavět

Vědomé rozhodnutí, ne opomenutí.

| Co | Proč ne |
|---|---|
| **Overlap a look-through na holdingy** | `mojefinancnisvoboda.cz` to má zdarma, bez registrace, až pro 50 pozic. Data jsou licencovaná (Morningstar) a nemáme datovou výhodu. |
| **Risk profilace → doporučená alokace** | Regulatorní červená čára (viz „Odloženo"). Navíc Nitrogen má značku i distribuci. |
| **IPS generátor** | V ČR neexistuje zavedený formát ani poptávka; poradce si ho dělá jeho brokerpool. |
| **Klientské reporty, white-label PDF, branding** | Cílovka je poradce, ne náš čtenář. Nemonetizujeme B2B a nemáme k poradcům obchodní kanál. |
| **Cashflow plánování (Timeline, Voyant)** | £1 700–2 100/rok, roky doladění. Mělká bezplatná verze je horší než žádná. |
| **Tracker s napojením na účty, live ceny, alerty** | Rozhodnuto dřív a správně. extraETF €90/rok, justETF €119/rok s 24/7 monitoringem. |
| **Optimalizace / efficient frontier** | In-sample optimalizace je past; vysoké riziko, že dáme špatný signál. PV to má zdarma. |

---

## Odloženo (uživatel 6. 9. 2026: „zatím kašlu na compliance")

Neruším, jen parkuji — je to levné a věcné:

- **`/vyber-etf` + `EtfSelector.tsx`** sbírá čtyři vstupy testu vhodnosti a píše „Naše doporučení
  pro tebe" / „Podle tvých odpovědí ti sedí". To je individualizace podle čl. 9 nařízení 2017/565.
  Zachraňuje nás jen to, že výstupem je kategorie, ne konkrétní ISIN. Přeformulovat na neutrální
  tvar, přidat disclaimer na výsledkovou obrazovku, smazat z kódu komentář `plně compliant`
  (neověřené sebehodnocení).
- **Nedělat:** napojení výstupu dotazníku na předvyplněný backtest konkrétních ETF — vznikl by
  kompletní řetězec individualizace až ke konkrétnímu nástroji.
- **`/zebricky`** (vlastní hodnocení 1–5) pravděpodobně spadá pod investiční doporučení dle MAR →
  vyžadovalo by identitu autora, metodiku, datum a zveřejnění střetů zájmů včetně profesní pozice.
  To koliduje s redakční hranicí. Schůdná cesta: odosobnit skóre na mechanický otevřený vzorec.

---

## Doporučené pořadí

1. **T0 celé** — je to pár hodin a odstraní to věci, které aktivně kazí důvěryhodnost.
2. **#6, #8, #10, #13** — nejlepší poměr přínos/pracnost v celém backlogu.
3. **#7, #9, #11, #14, #15** — dotažení téhož.
4. **#18, #19** — první skutečné diferenciátory, střední pracnost.
5. **#17** — vlajková loď, ale velká práce; nezačínat, dokud neběží T1.
