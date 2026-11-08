/**
 * NEOVĚŘENÝ VÝNOS VŠUDE STEJNĚ (kontrolní revize kola 6b, 21. 10. 2026; rozšířeno v kole 7, 22. 10. 2026).
 *
 * A) ODLEHLÝ VÝNOS (kolo 6b): fond, jehož výnos za 12 měsíců v Kč se liší o víc než 1,5 p. b. od mediánu fondů na
 * stejný trh (src/lib/trhy.ts, `odlehle`; seznam trhů src/data/trhyDvojcata.ts), má nejčastěji opožděnou poslední
 * cenu u zdroje dat. Detail fondu jeho výnosy za období neukazuje („—“) a /metodika to slibuje – dřív je ale
 * ukazovaly žebříčky, srovnávač i porovnání (XSXD +24,9 % v EUR, zdroj +20,05 %, 1. při řazení podle výnosu).
 *
 * B) VÝNOS V ROZPORU S BURZOU / S HOLÝMI DATY (kolo 7): `NEOVERENE_VYNOSY` níže – fondy mimo ruční seznamy trhů, u
 * kterých jsme NEZÁVISLE (burzovní ceny Yahoo, kurzy, vlastní přepočet z řady) ověřili, že výnosy za období od zdroje
 * dat nesedí. Tři druhy chyb zdroje:
 *   - 'skok'      – v denní řadě zdroje je skok, který burza nemá (HASH 22. 9. 2026 49,55 → 1,70 = −96,6 %; burza
 *                   od září bez obchodu na 49,61 €, bitcoin za rok −22 %) → web ukazoval 1R −97,8 %, 3R −92,2 %;
 *   - 'sum'       – řada zdroje je zašuměná cena, ne cena produktu (EUWAX Gold II: denní odchylka od vlastní burzy
 *                   sd 1,3–1,6 %, Xetra-Gold 0–0,4 %) → výnos k jednomu dni o 1–3 p. b. vedle (1R +1,01 % vs. burza −1,64 %);
 *   - 'dividenda' – zdroj nemá poslední vyplacenou dividendu distribuční třídy (I50D ex 15. 10. 2026 0,0398 USD,
 *                   XISP ex 19. 8. 2026 0,19 €: Yahoo ji má, cena v řadě zdroje v ex-den spadla, „s dividendami“
 *                   ne) → výnos s reinvesticí o 0,4–1,4 p. b. nižší, než byl (I50D 19,55 % vs. akumulační I500 20,23 %).
 *   - 'burza'     – (kolo 8) výnos nesedí s cenou na burze a s jinou třídou téhož fondu / se stejným zbožím, a pravidlo
 *                   tříd (src/lib/tridyFondu.ts `vynosTridNesedi`) ho nechytí, protože třídy mají výnosy k různým dnům
 *                   (USAC 1R +5,4 % vs. burza +18,7 % a Dist LYYB +17,8 %).
 * Seznam je RUČNÍ a ověřený; denní kontrola (scripts/check-fund-data.mjs, blok „kolo7 podezrele“) hledá NOVÉ případy
 * (poplach / varování) a hlásí položky, které už neplatí (zdroj chybu opravil, scraper vrací null) – ty se smažou.
 * Scraper (etf-astro, vynosy_z_rady.py, větev oprava/btcw-vynosy) od nasazení sám vrací null u období přes skok/díru.
 *
 * JEDNO pravidlo pro celý web:
 *   - seznam ISINů: `odlehleIsiny()` v src/lib/trhy.ts (odlehlé) ∪ `NEOVERENE_ISINY` (tento soubor) – `sNeoverenymi()`,
 *   - výnosy za období → null: `bezVynosuObdobi` / `bezOdlehlychVynosu` / `bezOdlehlehoVynosu` (tento soubor – čistý, jde
 *     i do klienta; `NEOVERENE_VYNOSY` uplatní VŽDY, i když volající předá jen odlehlé z trhů),
 *   - vysvětlivka u „—“: `VYNOS_NEOVERENY_TEXT` (obecná), u konkrétního fondu `duvodNeovereni(isin)`.
 * Kalendářní roky (return_2021…2025) zůstávají – jsou uzavřené a opožděná dnešní cena je neovlivní (stejně jako detail).
 * Hlídá scripts/check-fund-data.mjs (bloky kolo6b detail a kolo7 podezrele).
 */

/** Výnosy za období, které opožděná poslední cena zkreslí (všechny měny a varianty sloupců v DB: _czk, _usd, _percent),
 *  i „výnos / riziko“ (počítá se z téhož výnosu). Kalendářní roky (return_2021…) a returns_as_of (datum) NE. */
export const VYNOS_OBDOBI = /^(?:return_(?:1m|3m|6m|ytd|1y|3y|5y|10y|inception)(?:_czk|_usd|_percent)?|ytd_return_percent|return_per_risk_(?:1y|3y|5y))$/;
/** Obecná vysvětlivka (srovnávač, porovnání – jeden text pro všechny důvody). */
export const VYNOS_NEOVERENY_TEXT =
  'Výnosy za období neukazujeme: nesedí s ostatními fondy na stejný trh, s jinou třídou téhož fondu nebo s cenou na burze – nejčastěji kvůli opožděné nebo chybné ceně u zdroje dat.';

export type DruhNeovereni = 'skok' | 'sum' | 'dividenda' | 'burza';
export interface NeoverenyVynos {
  /** Ticker jen pro čtení seznamu (zdroj pravdy je ISIN). */
  ticker: string;
  druh: DruhNeovereni;
  /** Den chyby u zdroje: skok / ex-den chybějící dividendy (YYYY-MM-DD). U 'sum' neuveden. */
  den?: string;
  /** Kdy jsme nezávisle ověřili (YYYY-MM-DD). */
  overeno: string;
  /** Důkaz s čísly a zdrojem (pro lidi a pro kontrolu). */
  dukaz: string;
}

/**
 * Ověřené chyby zdroje (kolo 7, 22. 10. 2026). FORMÁT: jeden fond = jeden řádek (čte ho i scripts/check-fund-data.mjs).
 * Přidat jen po nezávislém ověření; smazat, když ho kontrola nahlásí jako neplatný.
 */
export const NEOVERENE_VYNOSY: Readonly<Record<string, NeoverenyVynos>> = {
  'CH1184151731': { ticker: 'HASH', druh: 'skok', den: '2026-09-22', overeno: '2026-10-22', dukaz: 'zdroj 21.→22. 9. 49,55 → 1,70 $ (−96,6 %); Xetra HDX1 bez obchodu od 11. 9. (49,61 €), Paris HASH od 10. 9.; BTC-EUR 1R −22 %' },
  'CH1218734544': { ticker: 'HAMO', druh: 'skok', den: '2026-09-22', overeno: '2026-10-22', dukaz: 'zdroj 21.→22. 9. 56,91 → 1,33 (−97,7 %); Amsterdam HAMO bez obchodu od 1. 9.' },
  'XS2819843736': { ticker: 'VIXL', druh: 'skok', den: '2024-01-05', overeno: '2026-10-22', dukaz: 'zdroj 5. 1. 2024 0,02 → 113,02 (×5 651), 8. 1. zpět, 22. 7. 2024 0,01 → 42,70; 3R +700 % při 1R −88 %' },
  'XS2819843900': { ticker: '3NGL', druh: 'skok', den: '2024-01-05', overeno: '2026-10-22', dukaz: 'zdroj 5. 1. 2024 0,31 → 142,10 (×458), 8. 1. zpět; Milán 3NGL.MI tytéž dny ×1,00' },
  'XS2842095320': { ticker: '3LAA', druh: 'skok', den: '2024-06-28', overeno: '2026-10-22', dukaz: 'zdroj 28. 6. 2024 3,4e8 → 8,4e10 €, 2. 7. → 22,79; Milán 3LAA.MI ×0,98 / ×1,04; 3R −100 %' },
  'XS2842095676': { ticker: '3SNV', druh: 'skok', den: '2024-06-28', overeno: '2026-10-22', dukaz: 'zdroj 28. 6. 2024 4,5e9 → 2,7e12 €, 2. 7. → 23,35; Milán 3SNV.MI ×0,94 / ×1,06; 3R −100 %' },
  'XS2842095759': { ticker: '3SAA', druh: 'skok', den: '2024-06-28', overeno: '2026-10-22', dukaz: 'zdroj 28. 6. 2024 2,9e7 → 3,0e9 €, 2. 7. → 27,75 (ceny v miliardách €); 3R −100 %' },
  'SE0026821282': { ticker: 'VRTN', druh: 'skok', den: '2025-11-18', overeno: '2026-10-31', dukaz: 'zdroj do 17. 11. 2025 7,2–8,2 €, 18. 11. → 1,91 (×0,25); Xetra VRTN.DE od začátku obchodování 7. 11. 2025 2,06–2,22 €, 17.→18. 11. 1,90 → 1,95; web 1R −82,6 %, burza od 11. 11. ≈ −38 %' },
  'XS2427363895': { ticker: '2CAR', druh: 'skok', den: '2025-12-31', overeno: '2026-11-08', dukaz: 'zdroj 30.→31. 12. 2025 16,69 → 22,33 € (+34 %), 2. 1. 2026 zpět 17,40; letos zdroj −47,43 % vs 2CAR.DE −29,9 %, 2CAR.MI −28,1 % (k 4. 11. 2026); 2025 zdroj +17,28 % vs burza −12,0 / −13,5 %' },
  'IE00B8K7KM88': { ticker: '3USS', druh: 'skok', den: '2022-12-19', overeno: '2026-10-22', dukaz: 'zdroj 19. 12. 2022 7 127,38 → 56,48 (×0,008); Milán 3USS.MI 16.→19. 12. ×1,02; zasaženo 5R −99,9 %' },
  'XS2337090851': { ticker: '3BBE', druh: 'skok', den: '2022-01-03', overeno: '2026-10-22', dukaz: 'zdroj 3. 1. 2022 96,41 → 0,52 (×0,005); Xetra 3BBE.DE tehdy bez obchodu; zasaženo 5R −99,7 %' },
  'XS2656472193': { ticker: '3LTS', druh: 'skok', den: '2022-01-03', overeno: '2026-10-22', dukaz: 'zdroj 3. 1. 2022 435,93 → 76 384,85 (×175); Milán 3LTS.MI 30. 12.→4. 1. ×1,09; zasaženo 5R −99,6 %' },
  'XS2671672819': { ticker: '3SFB', druh: 'skok', den: '2022-01-03', overeno: '2026-10-22', dukaz: 'zdroj 3. 1. 2022 436,76 → 0,43 (×0,001); Londýn 3SFE.L 23. 12.→4. 1. ×0,99; zasaženo 5R −100 %' },
  'DE000EWG2LD7': { ticker: 'EWG2', druh: 'sum', overeno: '2026-10-22', dukaz: 'zdroj vs. Stuttgart EWG2: sd denní odchylky 1,3–1,6 % (Xetra-Gold 0–0,4 %); 1R zdroj +1,01 %, burza 20. 10. 2025→2026 122,51 → 120,50 € −1,64 %, 4GLD −1,33 %; 1M zdroj −0,96 %, burza −3,12 %' },
  'DE000TMG0LD6': { ticker: 'TMGD', druh: 'sum', overeno: '2026-10-22', dukaz: 'vlastní šum řady proti skupině fyzického zlata 1,14 % (60 dní; medián skupiny 0,44 %); 1R +1,07 % a 1M −0,89 % vs. medián zlata −0,44 % / −3,08 % ke stejnému dni' },
  'DE000A28M8D0': { ticker: 'VBTC', druh: 'sum', overeno: '2026-11-08', dukaz: 'vlastní šum řady proti skupině bitcoinu 1,26 % (×3,7 mediánu); k 4. 11. 2026 zdroj 1M −9,87 % / 1R −23,50 %, Xetra VBTC.DE 39,88 → 37,68 € −5,53 % / 47,37 → 37,68 € −20,46 %, Paris −5,55 / −20,50 %, BTC-EUR −6,85 / −19,08 %' },
  'IE000D3BWBR2': { ticker: 'I50D', druh: 'dividenda', den: '2026-10-15', overeno: '2026-10-22', dukaz: 'Yahoo I50D.AS i I50D.L dividenda ex 15. 10. 2026 (0,0398 USD ≈ 0,46 %), zdroj ji nemá; 1R 19,55 % vs. akumulační I500 20,23 % při stejném TER' },
  'IE000FO05UG4': { ticker: 'XISP', druh: 'dividenda', den: '2026-08-19', overeno: '2026-10-22', dukaz: 'Yahoo XISP.DE ex 19. 8. 2026 0,1905 € (≈ 0,51 %), zdroj ji nemá – v ex-den cena −0,52 %, řada s dividendami také −0,52 %; 1R 19,52 % vs. X500 20,19 %' },
  'IE00B5M4WH52': { ticker: 'IUSP', druh: 'dividenda', den: '2026-10-15', overeno: '2026-10-22', dukaz: 'Yahoo SEML.MI ex 15. 10. 2026 0,5628 € (≈ 1,41 %), zdroj ji nemá – v ex-den cena i řada s dividendami −1,06 %' },
  'IE00BG0J4957': { ticker: 'UDHY', druh: 'dividenda', den: '2026-10-15', overeno: '2026-10-22', dukaz: 'Yahoo HYUS.L ex 15. 10. 2026 0,0835 USD (≈ 1,87 %), zdroj ji nemá – cena i řada s dividendami −1,48 / −1,45 %' },
  'IE00B2NPKV68': { ticker: 'IUS7', druh: 'dividenda', den: '2026-10-15', overeno: '2026-10-22', dukaz: 'Yahoo IEMB.MI ex 15. 10. 2026 0,3926 € (≈ 0,50 %), zdroj od 7. 10. žádnou dividendu nemá' },
  'IE00B9M6RS56': { ticker: 'IS3C', druh: 'dividenda', den: '2026-10-15', overeno: '2026-10-22', dukaz: 'Yahoo EMBE.MI ex 15. 10. 2026 0,333 € (≈ 0,52 %), zdroj od 7. 10. žádnou dividendu nemá' },
  // Kolo 8 (22. 10. 2026): výnos nesedí s cenou na burze a s jinou třídou téhož fondu, třídy mají výnosy k RŮZNÝM dnům
  // (pravidlo tříd v src/lib/tridyFondu.ts je proto nechytí) nebo fond nemá sourozence se stejným dnem.
  'IE0006IP4XZ8': { ticker: 'USAC', druh: 'burza', overeno: '2026-10-22', dukaz: 'Amundi MSCI USA ESG Broad Transition Acc 3,2 mld. €: zdroj 1R +5,35 % k 16. 10.; burza USAC.PA 16. 10. 2025→2026 +18,71 %; třída Dist LYYB +17,80 % (LUSA.MI +17,95 %); justETF totéž co zdroj' },
  'LU2090063327': { ticker: 'LYSM', druh: 'burza', overeno: '2026-10-22', dukaz: 'Amundi MSCI Semiconductors Dist: zdroj 3R +274,3 % k 16. 10. vs Acc LSMC +302,2 % (CHIP.MI +301,9 %) při 1R 56,6 vs 57,1 % – poměr 3R 7,5 %, 1R 0,3 %; burza Dist v EUR na Yahoo není' },
  'DE000A1E0HS6': { ticker: 'XAD6', druh: 'burza', overeno: '2026-10-22', dukaz: 'Xtrackers Physical Silver ETC (EUR): zdroj 5R +108,3 %, burza XAD6.MI 20. 10. 2021→2026 +142,0 %; medián stříbra (4 fondy) +144,6 %' },
};
export const NEOVERENE_ISINY: ReadonlySet<string> = new Set(Object.keys(NEOVERENE_VYNOSY));

/**
 * C) CHYBNÉ KALENDÁŘNÍ ROKY (8. 11. 2026) – pákové ETP, u kterých má zdroj v denní řadě neupravenou konsolidaci /
 * dělení jednotek, ceny na haléře nebo odskočený bod 31. 12. Kalendářní roky přicházejí z profilu zdroje (ne z denní
 * řady jako výnosy za období), takže je scraper nevynuloval a web ukazoval např. 3USL 2022 „+790 %“ (burza −54,7 %).
 * Skrývá se JEN uvedený rok (výnosy za období a riziko mohou být v pořádku – to řeší seznam B výše).
 * Ověřeno nezávisle: Yahoo adjclose všech likvidních listingů (skok > ×4 neutralizován) × kurzy ČNB, druhá kotva model
 * denní páky nad podkladem. Hlídá scripts/check-fund-data.mjs (blok „kolo9 kalendar“). Jeden fond = jeden řádek.
 */
export interface NeoverenyRok { ticker: string; roky: number[]; den?: string; overeno: string; dukaz: string }
export const NEOVERENE_ROKY: Readonly<Record<string, NeoverenyRok>> = {
  'IE00B7Y34M31': { ticker: '3USL', roky: [2022], den: '2022-12-19', overeno: '2026-11-08', dukaz: 'zdroj 16.→19. 12. 2022 1,99 → 38,69 € (×19,4, neupravená konsolidace) → 2022 +817,7 %; burza 3USL.L −54,7 %, 3LUS.L −54,8 %, 3USL.MI −55,6 %; model 3× S&P 500 TR −51 %' },
  'IE00B8K7KM88': { ticker: '3USS', roky: [2022], den: '2022-12-19', overeno: '2026-11-08', dukaz: 'zdroj 2022 −98,9 %; burza 3USS.L +44,1 %, 3USS.MI +48,2 %, 3ULS.L +43,0 % (skok 19. 12. 2022 neutralizován)' },
  'XS2819843900': { ticker: '3NGL', roky: [2024], overeno: '2026-11-08', dukaz: 'zdroj 2024 +6 879 % (konsolidace 22. 7. 2024 neupravená); burza 3NGL.L −85,0 %, 3LNG.L −84,9 %, 3NGL.MI −83,9 %' },
  'XS2656472193': { ticker: '3LTS', roky: [2022, 2023], overeno: '2026-11-08', dukaz: 'zdroj 2022 +22,6 % / 2023 −97,8 %; burza 3LTP.L −99,1 % / +220,4 %, 3LTE.L −99,1 % / +220,7 %, 3LTS.MI −99,1 % / +233,8 %' },
  'XS2757381400': { ticker: '3TSE', roky: [2023, 2024], overeno: '2026-11-08', dukaz: 'zdroj 2023 −98,7 % / 2024 −100 % (řada v řádu 1e8–1e11 €); burza 2024 3TSL.L +13,8 %, 3TSE.L +8,8 %; model 3× TSLA 2023 +228 %, 2024 +45 %' },
  'XS2820604770': { ticker: 'NVI3', roky: [2024], den: '2024-05-24', overeno: '2026-11-08', dukaz: 'zdroj 24. 5. 2024 788 → 47 (neupravené dělení) → 2024 −65,0 %; burza NVI3.DE +714 %, 3NVD.L +782 %, 3NVD.MI +700 %; model 3× NVDA +843 %' },
  'XS2734938835': { ticker: '3LNV', roky: [2024], den: '2024-06-10', overeno: '2026-11-08', dukaz: 'zdroj 10. 6. 2024 334 → 43 → 2024 −4,0 %; burza 3LNV.L +669 %, 3LVE.L +663 %, 3LNV.MI +721 %' },
  'XS3075487556': { ticker: '3STS', roky: [2023, 2025], overeno: '2026-11-08', dukaz: 'zdroj cena 0,05 → 19,66 → 2023 +788 % / 2025 +843 %; burza 3STS.MI −98,2 % / −94,4 %; model −98 % / −95 %' },
  'XS2399367254': { ticker: 'CON3', roky: [2023], overeno: '2026-11-08', dukaz: 'zdroj 2023 +754,6 %; burza 3CON.L +1 087 %; model 3× COIN +1 155 %' },
  'XS2617255760': { ticker: '3LMI', roky: [2023, 2024], overeno: '2026-11-08', dukaz: 'zdroj 2023 −100 % / 2024 −50,0 %; burza 2023 3LMI.MI +774 %, LMI3.L +2 130 %; 2024 LMI3.L +131 % (÷4 5. 8. 2024 neutralizováno); model +1 771 % / +184 %' },
  'XS2656469561': { ticker: '3LFB', roky: [2023], overeno: '2026-11-08', dukaz: 'zdroj 2023 −99,95 %; burza 3LFB.L +1 447 %, 3LFP.L +1 453 %, 3LFB.MI +1 364 %' },
  'XS2842095676': { ticker: '3SNV', roky: [2024], overeno: '2026-11-08', dukaz: 'zdroj 2024 −100 %; burza 3SNV.L −99,1 %, 3SVE.L −99,1 % (produkt dál obchodovaný)' },
  'XS2944874416': { ticker: 'NVIS', roky: [2024], overeno: '2026-11-08', dukaz: 'zdroj 2024 −100 %; burza NVIS.DE −98,9 %, SNV3.L −99,1 %' },
  'XS3135031279': { ticker: 'TS3S', roky: [2023, 2025], overeno: '2026-11-08', dukaz: 'zdroj 2023 −100 % / 2025 −100 %; burza 2025 TS3S.DE −94,3 %, TSLQ.MI −94,3 %; model 2023 −98,1 %, 2025 −95,4 %' },
  'XS3005160091': { ticker: '3MRN', roky: [2023, 2025], overeno: '2026-11-08', dukaz: 'zdroj 2023 −99,99 % / 2025 −100 %; burza 2025 3MRN.L −93,6 %; model 2023 −91,2 %' },
  'XS2842095320': { ticker: '3LAA', roky: [2024], overeno: '2026-11-08', dukaz: 'zdroj 2024 −100 %; burza 3LAA.MI −18,4 %, LAA3.L −20,2 %' },
  'XS2842095759': { ticker: '3SAA', roky: [2024], overeno: '2026-11-08', dukaz: 'zdroj 2024 −100 %; burza 3SAA.MI −65,8 %, SAA3.L −63,3 %; model −68 %' },
  'XS3037640110': { ticker: 'SBA3', roky: [2025], overeno: '2026-11-08', dukaz: 'zdroj 2025 −100 %; burza SBA3.MI −97,2 %, SBA3.L −97,0 %' },
  'XS2970736307': { ticker: 'MSTS', roky: [2025], overeno: '2026-11-08', dukaz: 'zdroj 2025 −100 %; burza MSTS.DE −70,2 %, SMST.L −68,2 %, MSTS.L −67,9 %' },
  'XS2836637525': { ticker: '3SMI', roky: [2025], overeno: '2026-11-08', dukaz: 'zdroj 2025 −100 % (32 dní cena 0,00); burza SMI3.L −85,6 %; model −85 %' },
  'XS2671672819': { ticker: '3SFB', roky: [2022, 2023], overeno: '2026-11-08', dukaz: 'zdroj 2022 −99,8 % / 2023 +1 423 %; burza 2022 3SFE.L +123 %; model 2023 −98,9 %' },
  'XS2663694680': { ticker: 'PLT3', roky: [2022], overeno: '2026-11-08', dukaz: 'zdroj 2022 −100 % (řada v řádu 3e14 €); burza PLT3.L −99,4 %' },
  'XS2427363895': { ticker: '2CAR', roky: [2025], den: '2025-12-31', overeno: '2026-11-08', dukaz: 'zdroj 31. 12. 2025 22,33 € (30. 12. 16,69, 2. 1. 2026 17,40) → 2025 +17,3 %; burza 2CAR.DE −12,0 %, 2CAR.MI −13,5 %' },
};

/** Extrémní kalendářní roky, které jsou SKUTEČNÉ (ověřeno burzou 8. 11. 2026, Yahoo × ČNB) – kontrola kolo9 je nehlásí.
 *  Rok ≤ −99,95 % web přesto skrývá pojistkou (CON3 2022, 3SMI 2023/24 – reálná téměř úplná ztráta). Jeden fond = jeden řádek. */
export const OVERENE_EXTREMNI_ROKY: Readonly<Record<string, { ticker: string; roky: number[]; dukaz: string }>> = {
  'IE00BK5BZT14': { ticker: 'CRM3', roky: [2023], dukaz: 'zdroj +410 %; burza 3CRM.L +455 %' },
  'IE00BK5C1B80': { ticker: 'FB3', roky: [2023], dukaz: 'zdroj +1 338 %; burza 3FB.MI +1 376 %, 3FB.AS +1 391 %' },
  'IE00BKT66K01': { ticker: 'MU2', roky: [2025], dukaz: 'zdroj +515,9 %; burza 2MUE.DE +515,4 %' },
  'IE00BLS09N40': { ticker: '3BAL', roky: [2025], dukaz: 'zdroj +417,5 %; burza 3BAL.L +406,6 %' },
  'JE00B2NFV803': { ticker: 'LCOC', roky: [2024], dukaz: 'zdroj +1 063 %; burza LCOC.MI +1 016 %' },
  'XS2399367254': { ticker: 'CON3', roky: [2022], dukaz: 'zdroj −100 %; burza 3CON.L −100,0 %; model 3× COIN −99,996 %' },
  'XS2435550947': { ticker: '3LCR', roky: [2023, 2025], dukaz: 'zdroj +339,9 % / +355,3 %; burza 3LCR.MI +330,9 % / +358,8 %' },
  'XS2734938835': { ticker: '3LNV', roky: [2023], dukaz: 'zdroj +1 644 %; burza 3LNV.MI +1 581 %, 3LNV.L +1 723 %' },
  'XS2820604770': { ticker: 'NVI3', roky: [2023], dukaz: 'zdroj +1 682 %; burza 3NVD.AS +1 665 %, NVI3.DE +1 800 %' },
  'XS3069873134': { ticker: '3SMI', roky: [2023, 2024], dukaz: 'zdroj −99,98 % / −100 %; burza 3SMI.MI −100,0 % (oba roky)' },
  'XS3306516876': { ticker: '3SIL', roky: [2025], dukaz: 'zdroj +590,2 %; burza 3SIL.L +601,0 %' },
};

/** Pojistka bez seznamu: rok ≤ −99,95 % je u zdroje téměř vždy rozbitá řada (15 z 19 případů 8. 11. 2026); skutečná
 *  téměř úplná ztráta (CON3 2022) tím přijde jen o „−100,0 %“. Raději „—“ než nesmysl (pravidlo č. 1). */
export const ROK_PODEZRELY_POD = -99.95;

/** Má se kalendářní rok fondu skrýt? (seznam C nebo pojistka) */
export function rokNeovereny(isin: string | null | undefined, rok: number, hodnota?: number | null): boolean {
  if (hodnota != null && hodnota <= ROK_PODEZRELY_POD) return true;
  return !!isin && !!NEOVERENE_ROKY[isin]?.roky.includes(rok);
}

/** Vysvětlivka pod grafem ročních výnosů, když se některý rok skrývá. */
export const ROK_NEOVERENY_TEXT = 'Rok označený „—“ neukazujeme: v cenách u zdroje dat je skok (neupravená konsolidace nebo dělení jednotek), který cena na burze nemá – výnos za ten rok by byl nesmysl.';


const datumCz = (iso: string) => { const [r, m, d] = iso.split('-').map(Number); return `${d}. ${m}. ${r}`; };

/** Vysvětlivka pro konkrétní fond ze seznamu B (detail fondu), jinak null. */
export function duvodNeovereni(isin: string): string | null {
  const z = NEOVERENE_VYNOSY[isin];
  if (!z) return null;
  if (z.druh === 'skok') return `Výnosy za období neukazujeme: v denních cenách u zdroje dat je${z.den ? ` ${datumCz(z.den)}` : ''} skok, který cena na burze nemá – je to chyba dat, ne pohyb trhu.`;
  if (z.druh === 'sum') return 'Výnosy za období neukazujeme: denní ceny tohoto produktu u zdroje dat kolísají kolem ceny na burze o víc než procento denně, takže výnos k jednomu dni může být o 1–3 p. b. vedle.';
  if (z.druh === 'burza') return 'Výnosy za období neukazujeme: výnos od zdroje dat nesedí s cenou fondu na burze ani s jinou třídou téhož fondu (nebo s ostatními fondy na stejné zboží) – je to chyba dat, ne pohyb trhu.';
  return `Výnosy za období neukazujeme: zdroj dat nemá poslední vyplacenou dividendu (ex-den ${z.den ? datumCz(z.den) : '—'}), takže výnos s reinvesticí dividend vychází nižší, než ve skutečnosti byl.`;
}

/** Odlehlé z trhů ∪ ověřené chyby zdroje (seznam B) – jeden seznam pro detail, žebříčky, srovnávač, porovnání i hledání. */
export function sNeoverenymi(odlehle: ReadonlySet<string> | Iterable<string>): Set<string> {
  return new Set([...odlehle, ...NEOVERENE_ISINY]);
}

/** Kolo 8: skok v řadě zdroje zkreslí i kolísavost a max. pokles (HASH: kolísavost 105,8 %, pokles −98 % – burza nic
 *  takového nemá). U druhu 'skok' se proto skrývají i rizikové ukazatele (všechna období a pokles od vzniku). */
export const RIZIKO_ZE_SKOKU = /^(?:volatility_(?:1y|3y|5y)|max_drawdown_(?:1y|3y|5y|inception))$/;
export const rizikoSkokem = (isin: string | null | undefined) => !!isin && NEOVERENE_VYNOSY[isin]?.druh === 'skok';

/** Kopie řádku bez výnosů za období (jen pole, která řádek má) + značka `_vynosNeovereny`. U skoku v řadě i bez rizika. */
export function bezVynosuObdobi<T extends object>(radek: T): T & { _vynosNeovereny: true } {
  const out: Record<string, unknown> = { ...(radek as Record<string, unknown>), _vynosNeovereny: true };
  const skok = rizikoSkokem(out.isin as string | undefined);
  for (const k of Object.keys(out)) if (VYNOS_OBDOBI.test(k) || (skok && RIZIKO_ZE_SKOKU.test(k))) out[k] = null;
  return out as T & { _vynosNeovereny: true };
}

const neovereny = (isin: string, odlehle: ReadonlySet<string>) => odlehle.has(isin) || NEOVERENE_ISINY.has(isin);

/** Řádky fondů: odlehlým a ověřeně chybným (seznam B) výnosy za období vynulovat, ostatní beze změny (stejné pořadí). */
export function bezOdlehlychVynosu<T extends { isin: string }>(radky: T[], odlehle: ReadonlySet<string>): T[] {
  return radky.map((r) => (neovereny(r.isin, odlehle) ? bezVynosuObdobi(r) : r));
}

/** Jeden fond (nebo null). */
export function bezOdlehlehoVynosu<T extends { isin: string }>(radek: T | null | undefined, odlehle: ReadonlySet<string>): T | null {
  if (!radek) return null;
  return neovereny(radek.isin, odlehle) ? bezVynosuObdobi(radek) : radek;
}
