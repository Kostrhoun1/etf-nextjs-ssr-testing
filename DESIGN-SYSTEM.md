# ETF průvodce – design systém + redesign playbook

Tento dokument je **smlouva** pro celý redesign. Každý „pod" (stratég → stavitel → kritik)
ho dodržuje u každé stránky. Cíl: důvěryhodný, datově hutný **fintech/finweb** pro české
retailové investory (žánr justETF / Curvo), mobile-first.

---

## 0. Positioning / USP (promítat do KAŽDÉ stránky)

**„Největší srovnávač ETF pro české investory."**

Příkop = lokalizace pro českého investora (čeština, české daně, čeští brokeři, **výnosy přepočtené do korun**), ne pouhá velikost. „Největší" je kvalifikované („…pro české investory") = obhajitelný autoritní signál; 4 300+ fondů, nezávislost a expert (Tomáš Kostrhoun) jsou podpora.

**Pravidla formulace:**
- CZK vždy jako **„výnosy přepočtené do korun" / „v přepočtu na Kč"** — NIKDY „ETF v korunách" (svádí k tomu, že fond jede v CZK).
- Každá stránka má nést český úhel: výnosy v Kč, daňový dopad v ČR, kde fond koupit v ČR.
- Tím vzniká unikátní hodnota, kterou justETF/Curvo nemají → důvod k indexaci.

## 0b. Navigace a klíčové sekce (NEVYNECHÁVAT)

Hlavní navigace (konzistentní na všech stránkách): **Co jsou ETF · Žebříčky · Srovnání · Portfolia · Kalkulačky · Kde koupit** + CTA „Srovnávač". Na mobilu hamburger menu se stejnými položkami.

**Modelová portfolia jsou klíčová část webu** – NESMÍ chybět v navigaci ani na homepage. Homepage má nést sekci „Hotová modelová portfolia" (Ray Dalio All-Weather, Permanentní, Nobelovo, Dividendové, Akciové → `/portfolio-strategie/*`).

## 1. Vizuální jazyk (tokeny)

### Barvy
| Role | Tailwind | Hex | Použití |
|---|---|---|---|
| Primární (brand) | `teal-700` | `#0F766E` | CTA, odkazy, aktivní stav, ikony brand |
| Primární hover | `teal-800` | `#115E59` | |
| Primární tlumený | `teal-50` | `#E1F5EE` | pozadí ikon, jemné zvýraznění |
| Text hlavní | `slate-900` | `#0F172A` | nadpisy, hlavní text |
| Text body | `slate-600` | `#475569` | běžný text, popisky |
| Text tlumený | `slate-400/500` | | meta, sekundární |
| Border | `slate-200` | `#E2E8F0` | rámečky karet/tabulek |
| Pozadí plochy | `slate-50` | `#F8FAFC` | pozadí sekcí, zebra |
| Pozitivní | `emerald-600` | `#059669` | růst, kladné výnosy, ✓ |
| Negativní | `red-600` | `#DC2626` | pokles, záporné výnosy, ✕ |

### Typografie (Inter, už globálně)
- Display/H1: `text-3xl md:text-4xl font-bold tracking-tight` (NE 5xl/6xl)
- H2: `text-2xl font-bold tracking-tight`
- H3: `text-lg font-semibold`
- Body: `text-base text-slate-600 leading-relaxed`
- Meta: `text-sm text-slate-500`
- **Sentence case** (NE Title Case), **žádné emoji v nadpisech**.
- Čísla v tabulkách/datech: `tabular-nums`, výnosy barevně (emerald/red).

### Tvar
- Radius: `rounded-lg` (karty, default), `rounded-md` (drobné), `rounded-xl`/`rounded-2xl` (velké panely/hero – viz schválená homepage), `rounded-full` (pilulky). **Nepoužívat `rounded-3xl`.**
- Stíny: `shadow-sm` (klid), `shadow-md` (hover). **Žádné tvrdé tmavé stíny.**
- Mezery: sekce `py-8 md:py-12`, karty `p-4`/`p-5`, gridy `gap-3`/`gap-4`.

### Ikony
- **Výhradně `lucide-react`** (linkové SVG). `w-4/5/6 h-…`, `strokeWidth={2}`, barva přes `text-*`.
- **ŽÁDNÉ emoji jako UI ikony.** Ikona ve „feature" kruhu = monochrom (`bg-teal-50 text-teal-700`), ne gradient.

### Zakázáno
- ❌ Gradienty (text ani pozadí), „bloby" (`animate-blob`, blur kruhy)
- ❌ Emoji v UI/nadpisech
- ❌ Fialová (`violet-*`) jako brand
- ❌ Nekonzistentní radius/stíny

---

## 2. Sdílené vzory (komponenty)

- **Datová tabulka**: `thead` na `bg-slate-50`, `text-slate-600`; řádky `border-slate-100`, hover `bg-slate-50`; čísla `text-right tabular-nums`; výnosy emerald/red. Na mobilu → **kartový vzor** (`hidden md:table` + `md:hidden space-y-2` karty), nikdy 9 sloupců na 360px.
- **Karta**: `bg-white border border-slate-200 rounded-lg`; hover `border-teal-300 shadow-sm`.
- **CTA**: primární `bg-teal-700 text-white hover:bg-teal-800 rounded-lg`; sekundární `border border-slate-200`/ghost.
- **Výkonnostní pruh**: tenký bar (emerald/red) vedle čísla pro vizuální čtení.
- **Breadcrumb**: dodává Layout (nedělat duplicitní v obsahu).
- **Disclaimer**: `InvestmentDisclaimer` na KONEC obsahu / patičku, ne nahoru.

### Žádné duplicitní výsledkové bloky (POVINNÉ)
- **Každá výsledná hodnota se na stránce zobrazuje JEN JEDNOU jako „karta/číslo".** Častá chyba u kalkulaček: builder dá výsledek do bílých karet NAD graf a PAK ho zopakuje ještě jako velká čísla v teal/slate boxu POD grafem → tatáž čísla 2× pod sebou. NEDĚLAT. Vzor: bílé karty s čísly (primární) → graf → teal box jen jako **interpretační věta** „Co si z toho odnést" (smí zmínit jednu hodnotu v textu jako kontext, ne celý grid čísel). Stejně tak nedávat „mini-přehled" s čísly, která už jsou výš.
- Výjimky (legitimní opakování, NE duplicita): hodnota jako popisek osy grafu / koncový bod progress baru; tatáž metrika pro DVA různé scénáře (např. levný vs drahý fond); měsíční vs roční varianta téhož; hodnota v hover tooltipu.
- **Kontrola:** po dokončení projít stránku očima (screenshot) i grepem na opakující se výsledkové popisky – žádný blok obsahu se nesmí na stránce vyskytnout dvakrát.

### Technické pasti (POVINNÉ ohlídat – jinak spadne build)
- **Nesdílet datové hodnoty z `'use client'` souboru do server komponenty.** Když server stránka importuje `export const`/objekt/mapu z `'use client'` modulu, server dostane jen *client-reference stub* (ne reálnou hodnotu) → `mapa[klíč]` je `undefined`. Typický projev: `<Link href={undefined}>` → prerender pád `Cannot destructure property 'auth' of 'a'` (to je `url.format`, NE Supabase). Řešení: sdílené konstanty/mapy/typy dát do **samostatného neklientského modulu** (`*.ts` bez `'use client'`) a importovat z obou stran. Příklad: `brokerReviewHref.ts`.
- Každou novou stránku po dokončení **ověřit `next build`** (ne jen dev) – prerender odhalí to, co dev schová.

### Mobile-first (povinné)
- Vše navrhovat od ~360px. Žádný horizontální scroll (kromě záměrných tickerů, a ty na mobilu spíš skrýt).
- Tap-targety ≥ 44px. Nadpisy menší na mobilu. Tabulky → karty.
- Hlavička: hamburger menu na mobilu.

---

## 3. Redesign playbook – co pod promyslí u KAŽDÉ stránky

Pro každou stránku vznikne **spec** pokrývající těchto 6 dimenzí:

1. **Účel & uživatel** — proč stránka existuje, koho obsluhuje, co má splnit (1 hlavní cíl).
2. **Informační architektura / rozložení** — jaké bloky, v jakém pořadí (nad ohybem to nejdůležitější; rychle k obsahu, ne balast).
3. **UX** — flow, interakce, prázdné/chybové stavy, mobile-first chování, jasná primární akce.
4. **Obsah** — jaká **unikátní hodnota** (proč to nenajdu jinde), hloubka, E-E-A-T (autor/metodika/zdroje), co přidat/ubrat. _Pozn.: indexace stojí na kvalitě obsahu, ne na technice._
5. **SEO** — search intent, nadpisová struktura, schema (Article/FAQ/Breadcrumb/ItemList), interní prolinkování (proč by to Google měl indexovat), title/description z reálných dat.
6. **Konverze** (kde dává smysl) — CTA na brokery/nástroje, trust signály.

**Výstup specu** = stručný, konkrétní, podložený reálnými daty stránky a konkurencí (justETF apod.).

### 7a. Jazyk a tón – ČEŠTINA (POVINNÉ)
Web je pro **české retailové investory**. Píše se přirozenou češtinou, **bez zbytečných anglicismů**.
- **Zakázané anglicismy → český překlad**: `tracker` → indexový fond / fond sledující index; `screener` → vyhledávač/filtr fondů; `cluster`, `impostor`, `TL;DR`, `performance` (→ výkonnost), `low-cost` (→ levný/nízkonákladový) atd. Pokud existuje běžné české slovo, použij ho.
- **Povolené odborné termíny** (zavedené, nepřekládají se): ETF, TER, ISIN, swap, akumulační/distribuční, UCITS. Ale i ty **vysvětli při prvním použití**.
- Tón: srozumitelný začátečníkovi, ne bankovní žargon. Sentence case, žádné emoji.

### 7b. Edukační rozměr (POVINNÉ – web je PRŮVODCE, ne jen databáze)
Každá stránka **vysvětluje své klíčové pojmy** pro českého začátečníka, přiměřeně tématu:
- Kategorie „S&P 500" → krátké „Co je S&P 500" (500 největších firem USA…), co znamená TER, akum vs dist, replikace.
- Srovnání → co se vlastně porovnává a proč na tom záleží.
- Vzdělávání není přílepek na konci – je vetkané do stránky (krátké vysvětlivky u pojmů, „proč na tom záleží").
- **FORMA = VIZUÁL, NE TEXT.** Edukaci podávej **jednoduchými schématy a grafickými prvky**, ne dlouhými odstavci. Preferuj:
  - **diagramy / schémata** (boxy + šipky: „Vy → 1 ETF → 500 firem"; akumulační = dividenda zpět do fondu vs distribuční = na účet; fyzická vs swap replikace),
  - **ikonové vysvětlivky** (pojem + ikona + 1 věta),
  - **mini-grafy / vizuální srovnání** (dopad TER, diverzifikace 500 vs 3600 firem jako pruhy/kruhy),
  - max 1–2 věty textu na pojem; zbytek řekne obrázek.
  Žádné „dlouhatánské texty". Když to jde ukázat schématem, ukaž to schématem.

  Příklad schématu (boxy + šipky, Tailwind, žádná knihovna):
  ```tsx
  <div className="flex items-center gap-2 text-center text-sm">
    <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">Vy<br/><span className="text-xs text-slate-500">1 nákup</span></div>
    <ArrowRight className="w-4 h-4 text-teal-600 shrink-0" />
    <div className="rounded-lg bg-teal-50 border border-teal-200 px-3 py-2 text-teal-800">1 ETF fond</div>
    <ArrowRight className="w-4 h-4 text-teal-600 shrink-0" />
    <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">500 firem<br/><span className="text-xs text-slate-500">Apple, MSFT…</span></div>
  </div>
  ```
  Příklad ⓘ tooltipu: `<InfoTip label="Roční poplatek za správu fondu, strhává se automaticky z hodnoty.">TER</InfoTip>`
- **Známé/technické pojmy → ⓘ vysvětlivka v tooltipu**, ne výklad v textu. U pojmu jako TER, ISIN, akumulační/distribuční, replikace, swap, domicil… dej malé ⓘ; po najetí myší (a po tapu/fokusu na mobilu) se ukáže 1–2větné vysvětlení. Použij sdílenou komponentu `InfoTip` (`src/components/design-preview/InfoTip.tsx`). Text tím zůstane čistý a čtivý; kdo pojem zná, čte plynule, kdo ne, najede myší.
- Cíl: člověk, který přijde a netuší, odejde poučený a s rozhodnutím. To je zároveň ta unikátní hodnota pro indexaci.
- **Homepage = dvojí publikum**: „vím, co chci" (data hned – tržní přehled, vyhledávač, žebříčky) I **začátečník**. Homepage nese kompaktní **onboarding cestu** „Začínáte s ETF?" = jednovětné intro + 4 odkazy (Co jsou ETF → Jak vybrat → Kde koupit → První nákup). **NA HOMEPAGE NEPATŘÍ edukační schémata/diagramy** – jen odkazy a krátký text. Schémata patří na vzdělávací/obsahové stránky (průvodce, „co je X" na kategorii/srovnání), NE na data-first homepage.
- **KDE schémata smí být**: jen na stránkách, kde se reálně vzdělává (průvodce „Co jsou ETF", kategorie blok „Co je index", srovnání „diverzifikace vs koncentrace"). Drž je JEDNODUCHÉ a hezké. POZOR: schéma musí dobře vypadat – pokud si nejsi jistý vizuální kvalitou, použij raději jen ikonové vysvětlivky + InfoTip než neúhledný „box+šipka" diagram. (Komplexní/pěkná schémata staví člověk, ne agent.)

### 7. Obsahová a logická konzistence (POVINNÉ – kritik bez výjimky ověřuje)
Stránka nesmí jen „vypadat dobře" – musí **dávat smysl**. Každý blok projde těmito kontrolami:
- **Nadpis ↔ obsah**: nadpis odpovídá tomu, co je pod ním. („Velká pětka" = přesně 5 položek; „nejlevnější" = reálně seřazené dle TER; tabulka ukazuje to, co nadpis slibuje.)
- **Žádné vnitřní rozpory / redundance**: doporučení a varianty musí být **vzájemně odlišné osy**. Když je hlavní tip akumulační, NEnabízej „akumulační variantu" (duplicita) – alternativy musí řešit JINÉ potřeby (nejlevnější / distribuční / swap / jiný profil).
- **Sloupce a hodnoty tabulek**: každý sloupec má smysl pro daný kontext; čísla jsou ve správné jednotce/měně a odpovídají popisku; žádné „0 %" tam, kde chybí data („—").
- **Narativ celé stránky**: bloky na sebe logicky navazují (verdikt → proč → jak vybrat → jak koupit), neopakují se, neprotiřečí si.
- **Tvrzení vs. data**: každé číslo/nárok je podložené reálnými daty nebo zdrojem (YMYL).
- **Jazyk (7a)**: žádné zbytečné anglicismy (grep „tracker/screener/performance/…"); čeština přirozená.
- **Edukace (7b)**: klíčové pojmy stránky jsou vysvětlené pro začátečníka.

Kritik tyto body kontroluje stejně přísně jako design a build. **Blokující chyba** = nesoulad nadpis↔obsah, nelogické/redundantní doporučení, anglicismus tam, kde je české slovo, nebo chybějící vysvětlení klíčového pojmu.

---

## 4. Pravidla práce týmu
- **Fáze 0 (základ)** je hotová → na ni se staví. Neměnit tokeny ad-hoc.
- Každý pod pracuje na **oddělených souborech** (vlastní stránka/komponenty) → bez konfliktů.
- Nové stránky stavět nejdřív na **preview URL** (`/design-preview/...`), ať jdou bez rizika revidovat.
- Data tahat z reálné DB (čistá pole: výnosy, TER, velikost, region, index – ne rozbité country/sector 2-5).
- Po stavbě: build musí projít, mobil ověřen, žádný gradient/emoji/fialová.
