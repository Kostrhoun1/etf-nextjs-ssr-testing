# Strategie ETFpruvodce.cz — CEO dokument

_Autor: CEO / zakladatelský vizionář · Datum: 2026-07-04 · Větev: vylepseni/kvalita-obsahu-seo_
_Podklad: audit reálného stavu `/design-preview` (homepage, screener, detail ETF, detail kategorie, průvodce, kde koupit, o nás)._

---

## TL;DR — 5 vět pro majitele

- **Produkt je vizuálně i datově hotový na úroveň, kterou český trh nemá** — detail ETF a detaily kategorií jsou hlubší a lokálnější než cokoliv od konkurence. Problém #1 už není „jak to má vypadat", ale **„proč to Google neindexuje" = kvalita a jedinečnost obsahu ve škále**.
- **Největší nevyužitý příkop = korunový úhel a český daňový kontext** — máme ho v datech, ale ještě z něj neděláme samostatné, vyhledávatelné a sdílitelné stránky (přesně to, co lidé googlí: „daně z ETF 2026", „VWCE vs CSPX v Kč").
- **Největší riziko: obsahová díra ve škále** — 37 kategorií má špičkový redakční text, ale **konfigurace jich definuje 53** → 16 tenkých/generických stránek, které kanibalizují indexační signál celého webu.
- **Priorita NEJDŘÍV:** dokončit obsahovou hloubku napříč VŠEMI indexovanými stránkami (kategorie, srovnávací dvojice, daňový/edukační hub) + zajistit, že ostrý web (ne preview) má `index:true`, sitemapu a interní prolinky. Bez toho je veškerý vizuál k ničemu.
- **Neztrácet čas kosmetikou** hotových stránek. Každé další kolo týmu musí sloužit buď indexaci (obsah/SEO), důvěře (E-E-A-T), nebo konverzi na brokera — nic mezi tím.

---

## 1. Vize & pozicování

**ETFpruvodce.cz je nejdůvěryhodnější a nejhlubší průvodce ETF pro českého investora — jediný, kdo ukazuje výnosy v korunách a řeší investování v českém daňovém a regulatorním kontextu.** Nevyhrajeme velikostí databáze (tu má justETF taky), ale **lokální hloubkou**: korunový výnos, český časový/hodnotový test, W-8BEN, čeští brokeři, česky a srozumitelně pro začátečníka. Konkurence je globální, anglicko-německá a v eurech — my jsme jediní „doma".

---

## 2. Strategická diagnóza

### Na čem stavět (3 silné stránky)

1. **Detail ETF je špičkový produkt.** `/etf/[isin]` je datově hutný (výkonnost v CZK/EUR/USD, kalendářní roky, složení, sektory/země, riziko + max. drawdown, burzy, kde koupit) a má poctivý E-E-A-T blok (autor + zdroje + datum). Tohle je nejlepší detail ETF v češtině, tečka.
2. **Redakční hloubka kategorií je reálný příkop.** `categoryContent.ts` (1 684 řádků, 37 kategorií) není generický balast — např. „AI ETF" nese konkrétní fondy, ISINy, TER, daňový kontext a rizika. Přesně tenhle typ obsahu Google indexuje a lidé sdílí.
3. **Korunový úhel + český daňový rámec jsou konzistentně vetknuté všude** — homepage FAQ, detail fondu, kategorie. USP se neopakuje jako slogan, ale jako reálná datová hodnota (přepočet ČNB). Důvěryhodné a nekopírovatelné konkurencí.

### Strategické mezery a rizika (co brání cíli #1)

1. **Obsahová díra ve škále — 53 žebříčků v configu vs. 37 s redakčním obsahem.** ~16 kategorií (`categoryConfigs` v `src/lib/etf-data.ts`) se vyrenderuje jako **tenká, datově-generická stránka bez introTitle/intro/verdict/rizik**. Každá taková stránka je pro Google signál „nízká kvalita" a **stahuje důvěryhodnost celé domény**. Toto je existenční riziko dle našeho ověřeného insightu.
2. **Srovnávací dvojice fondů nejsou plnohodnotné indexovatelné stránky.** Homepage odkazuje na „VWCE vs CSPX", „IWDA vs CSPX" atd., ale většina vede na `/srovnani?q=…` (parametrická, těžko indexovatelná) — jen `vwce-vs-cspx` má vlastní routu. Přitom **„X vs Y" je nejsilnější vyhledávací záměr v ETF světě** a přesně to konkurence žere. Chybí nám škálovatelná šablona pro desítky/stovky vs-dvojic.
3. **Indexace není ověřitelně vyřešená na ostrém webu.** Celý `/design-preview` je `robots: index:false` (30 souborů) — správně pro staging. Ale strategicky **nemám v ruce důkaz, že ostrá routa má `index:true`, kompletní sitemapu, canonical a že Google reálně stránky bere.** To je věc, kterou musíme měřit v Search Console, ne předpokládat.
4. **Chybí „daňový / regulatorní hub" jako samostatné stránky.** Náš nejsilnější korunový/daňový obsah dnes žije jen jako FAQ útržky uvnitř jiných stránek. „Jak se daní ETF v ČR 2026", „časový test", „W-8BEN", „100k hodnotový test" — to jsou samostatné vyhledávané dotazy, na které dnes nemáme dedikovanou landing page, kterou by šlo indexovat a sdílet.
5. **Konverzní tok na brokera je slabě uzavřený.** Detail ETF má CTA „Kde koupit", ale nevede na konkrétního brokera s konkrétní výhodou pro tento fond. Máme 6 recenzí brokerů a skóre — ale most „vybral jsem fond → kupuji ho tady a proto" není utažený. To je budoucí monetizace i důvěra.

---

## 3. Cesta k #1 — priority podle dopadu

### NEJDŘÍV (teď, blokuje vše ostatní)

**P1 — Uzavřít obsahovou díru: 0 tenkých kategorií.** Doplnit redakční obsah pro všech ~16 kategorií bez `categoryContent`, nebo je z indexace vyřadit (noindex/sloučit), dokud obsah není. 
_Proč:_ tenké stránky sráží indexaci celé domény — to je přímo náš ověřený insight. _Úspěch:_ 100 % indexovaných kategorií má intro/verdict/rizika/FAQ; 0 stránek pod ~1 500 slov unikátního textu.

**P2 — Škálovatelná šablona „ETF X vs Y" s vlastní routou.** Z parametrických odkazů udělat statické, indexovatelné vs-stránky (min. 15–20 nejhledanějších dvojic: VWCE/CSPX, IWDA/VWCE, SWRD/IWDA, VUAA/CSPX…), každá s korunovým srovnáním, daňovým úhlem a verdiktem. 
_Proč:_ „X vs Y" = nejsilnější nákupně-rozhodovací záměr, přímý traffic + konverze. _Úspěch:_ ≥15 vs-stránek indexovaných, měřitelný organický vstup na ně.

**P3 — Ověřit a dotáhnout indexovatelnost ostrého webu.** Search Console: sitemap, `index:true` na ostrých routách, canonical, coverage report. 
_Proč:_ bez měření indexace jedeme naslepo. _Úspěch:_ rostoucí počet „indexovaných" URL v GSC, ne „objevených/neindexovaných".

### POTOM (další 1–2 kola)

**P4 — Daňový a regulatorní hub jako samostatné landing pages.** „Daně z ETF v ČR 2026", „časový a hodnotový test", „W-8BEN pro Čechy", „ICS/SIPC ochrana". 
_Proč:_ unikátní český obsah, který justETF NIKDY mít nebude = čistý příkop + evergreen traffic. _Úspěch:_ hub stránky indexované a rankující na daňové dotazy.

**P5 — Utáhnout konverzní most fond → broker.** Na detailu ETF a kategorii: „tento fond nejlevněji koupíte u X" s konkrétním důvodem (poplatek, měnová konverze, frakce). 
_Proč:_ důvěra + budoucí monetizace, uzavření hlavního uživatelského toku. _Úspěch:_ prokliky detail → recenze brokera / kde koupit.

### POZDĚJI (až základ rankuje)

**P6 — Interaktivní/sdílitelné nástroje jako traffic magnet.** Backtest, FIRE, kurzový dopad už existují — udělat z nich sdílitelné, prolinkované, s výsledkem hodným screenshotu na sociální sítě. 
_Proč:_ zpětné odkazy + brand. _Úspěch:_ přímé návštěvy a sdílení nástrojů.

**P7 — Aktualizační rytmus obsahu (datum + „aktualizováno").** Pravidelný refresh dat a textů → čerstvost jako rankovací signál.

---

## 4. Obsahová & indexační strategie (nejvyšší priorita)

Insight je jasný: **Google neindexuje kvůli obsahu, ne technice.** Proto obsah tvoříme podle vyhledávacího záměru českého investora a podle toho, co konkurence NEMÁ:

- **Kategorie (žebříčky) — dokončit do 100 % hloubky.** Každá kategorie = průvodce, ne tabulka: co index je, pro koho, rizika, český daňový úhel, FAQ. Žádná tenká stránka v indexu. _(Toto je P1.)_
- **„X vs Y" srovnání — nový škálovatelný pilíř.** Nejhledanější ETF dvojice, každá s korunovým srovnáním a verdiktem. _(P2.)_
- **Daňový/regulatorní hub — čistě český evergreen.** Časový test 2026, hodnotový test 100k, W-8BEN, akum vs dist z daňového pohledu, domicil Irsko. Konkurence to nikdy mít nebude.
- **„Kterým ETF začít / nejlepší ETF pro začátečníka" — rozhodovací obsah.** Máme starter sekci na homepage; udělat z ní plnou landing page pro nejčastější vstupní dotaz začátečníků.
- **Korunový úhel jako opakovaný háček ke sdílení.** „Kolik reálně vydělal S&P 500 pro Čecha v Kč" — datový příběh, který se sdílí, protože ho nikdo jiný neukazuje.

Forma vždy: **vizuální edukace (schémata, mini-grafy, ikonové vysvětlivky), ne zdi textu** — v souladu s design systémem.

---

## 5. Direktivy pro tým expertů (další kolo)

- **Obsah:** Dotáhnout ~16 chybějících kategorií na plnou hloubku a připravit texty pro 15+ „X vs Y" dvojic a daňový hub. **Toto je priorita #1 celého týmu** — bez obsahu nemá zbytek smysl.
- **SEO:** Ověřit v Search Console reálnou indexaci ostrého webu (sitemap, canonical, `index:true`), doplnit schema pro vs-stránky (nejlépe `ItemList`/`FAQ`), utáhnout interní prolinkování z kategorií na detaily i vs-stránky.
- **Konverze:** Uzavřít most fond → konkrétní broker s konkrétním důvodem na detailu ETF a kategorii; propojit s 6 existujícími recenzemi.
- **Obsah × vizuál (edukace):** Nahradit textové vysvětlivky schématy (akum vs dist, fyzická vs swap, diverzifikace 500 vs 3 600 firem) — E-E-A-T i srozumitelnost.
- **Mobil:** Ověřit, že nové vs-stránky a daňový hub jsou na 360px bez horizontálního scrollu a s kartovými tabulkami; jinak žádné nové mobilní přepisy hotových stránek.
- **Výkon:** Hlídat, aby nový obsah nezpomalil LCP na klíčových landing pages (kategorie, detail, vs). Žádná optimalizace pro optimalizaci — jen tam, kde je stránka pomalá.
- **A11y:** Zajistit korektní nadpisovou strukturu (jeden H1, logická H2/H3) na nových stránkách — pomáhá i SEO. Ne kosmetické a11y audity hotových stránek.
- **Desktop/vizuál:** Zamrazit vzhled hotových pilířů (homepage, detail ETF). Vizuální práce jen na NOVÝCH typech stránek (vs, daňový hub), aby dodržely design systém. **Neředesignovat, co funguje.**

---

## 6. Čeho se NEDOTÝKAT / rizika exekuce

- **Nepředělávat homepage a detail ETF.** Jsou hotové a silné. Riziko regrese > jakýkoliv kosmetický zisk.
- **Nepustit tenké kategorie do indexu.** Dokud kategorie nemá redakční obsah, musí být `noindex` — jinak stáhne celou doménu. Toto je nejnebezpečnější past.
- **Nesdílet datové hodnoty z `'use client'` modulů do server komponent** (viz DESIGN-SYSTEM.md a paměť) → prerender pád. Každou novou stránku ověřit `next build`, ne jen dev.
- **Nepřepnout preview na index.** `/design-preview` MUSÍ zůstat `noindex`; indexuje se jen ostrá routa. Záměna = duplicitní obsah a kanibalizace.
- **Neředit korunový úhel formulačně** — vždy „výnosy přepočtené do korun", nikdy „ETF v korunách" (svádí k tomu, že fond jede v CZK).
- **Nezaměňovat aktivitu za pokrok.** Každé kolo měřit dopadem na indexaci/traffic/konverzi, ne počtem změněných souborů.

---

## 7. Jak poznáme, že vyhráváme (severka)

1. Roste počet **indexovaných** URL v Google Search Console (ne jen „objevených").
2. Organický traffic na kategorie, vs-stránky a daňový hub měsíc po měsíci roste.
3. 0 tenkých stránek v indexu (každá indexovaná stránka má unikátní hodnotu).
4. Prokliky z detailu/kategorie na brokera (uzavřený konverzní tok).
5. Přímé návštěvy a zpětné odkazy na nástroje/daňový hub (brand a příkop).
