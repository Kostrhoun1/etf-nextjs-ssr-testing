/* Kurátorský obsah pro konkrétní „X vs Y" souboje (nový design).
 *
 * Šablona /design-preview/srovnani/[pair] funguje pro LIBOVOLNOU dvojici čistě
 * z dat (výnosy, TER, velikost, index) – každá stránka je tak unikátní. Tady
 * navíc přidáváme REDAKČNÍ úhel pro nejžádanější dvojice (proč zrovna tenhle
 * souboj, komu co sedí), aby top stránky nebyly jen datové.
 *
 * Klíč = pair slug „ticker1-vs-ticker2" (malými písmeny), musí sedět s tím, jak
 * je stránka volaná. Vše je volitelné – co chybí, dožene datová šablona.
 */

export interface PairFaq {
  q: string;
  a: string;
}

export interface PairContent {
  /** 1–3 odstavce: proč tenhle souboj lidi řeší a co je jádro rozdílu. */
  intro?: string[];
  /** Redakční verdikt po fondech (kdy zvolit který). */
  pick1?: string;
  pick2?: string;
  /** Doplňkové FAQ specifické pro tuhle dvojici (nad rámec datových). */
  faqs?: PairFaq[];
}

export const pairContent: Record<string, PairContent> = {
  "iwda-vs-cspx": {
    intro: [
      "IWDA a CSPX jsou obě od iShares, obě akumulační (dividendy se reinvestují uvnitř fondu, takže je jako český investor nemusíš danit) a obě z irského domicilu. Kdyby šlo o tohle, nebylo by co řešit. Jenže tady se dva stejně vypadající fondy liší v tom nejdůležitějším: co je uvnitř. IWDA drží akcie z celého vyspělého světa (zhruba 23 zemí, přes 1 200 firem), zatímco CSPX je čistě 500 největších amerických firem. To není kosmetika, to jsou dvě různé sázky.",
      "Jádro rozhodnutí je tedy koncentrace do USA versus globální rozložení. Háček je, že rozdíl je menší, než se zdá: MSCI World má dnes zhruba 70 % váhy stejně v amerických akciích, protože se sestavuje podle tržní kapitalizace a USA prostě dominují. Kupuješ-li IWDA, kupuješ z velké části tytéž firmy jako v CSPX (Apple, Microsoft, Nvidia) — jen k nim přidáváš Evropu, Japonsko, Kanadu, Austrálii a další. CSPX je tak zhuštěná verze toho, co už v IWDA z velké části máš. Nekupuješ dva odlišné světy, ale stejný základ s různou mírou naředění mimo USA.",
      "Pro Čecha jsou praktické parametry v podstatě totožné: obě akumulační (žádné papírování s dividendami), obě denominované v USD, takže vůči koruně neseš měnové riziko tak jako tak — na tom se nákupem jednoho či druhého nic nezmění. Rozdíl v poplatku existuje, ale je to otázka desetin procenta ročně a šablona ho zobrazuje. Skutečná otázka, na kterou si musíš odpovědět sám, zní: chceš mít pod jednou položkou celý vyspělý svět, nebo vědomě vsázíš na to, že americký trh bude i nadále tahoun?",
    ],
    pick1:
      "IWDA sedí tomu, kdo chce globální diverzifikaci a klid — jeden fond pokrývající vyspělý svět, kde tě nebolí, když zrovna Amerika zaostává za Evropou nebo Japonskem. Je to typická volba pro dlouhodobé jádro portfolia, u kterého nechceš dělat žádné aktivní rozhodnutí o tom, který region poletí.",
    pick2:
      "CSPX sedí tomu, kdo vědomě věří americkému trhu a je smířený s vyšší koncentrací do jedné země. Dává smysl také jako doplněk, když už máš globální nebo evropskou složku jinde a chceš cíleně přidat expozici na USA. Ber ale na vědomí, že tím stavíš celou pozici na jediném trhu.",
    faqs: [
      {
        q: "Když má MSCI World stejně ~70 % v USA, není IWDA skoro to samé co CSPX?",
        a: "Ne tak úplně. Ano, IWDA je dnes americkými akciemi silně tažen, ale ta zbylá zhruba třetina (Evropa, Japonsko, Kanada, Austrálie a další) je přesně to, co CSPX vůbec nemá. Když americký trh dlouhodobě zaostane — jak se v historii opakovaně stalo — právě tahle část IWDA rozdíl vyrovnává. Váhy se navíc přepočítávají samy podle tržní kapitalizace, takže se poměr USA v čase mění.",
      },
      {
        q: "Můžu později přejít z CSPX na IWDA (nebo naopak) bez daně?",
        a: "Přechod znamená prodej jednoho fondu a nákup druhého, a prodej je daňová událost. Pokud jsi držel déle než 3 roky, zisk je od roku 2026 osvobozen časovým testem bez ohledu na částku. Pod 3 roky rozhoduje hodnotový test 100 000 Kč hrubých příjmů z prodeje za rok. Neber tedy volbu jako nezvratnou, ale ani se nepřehazuj zbytečně — každý prodej v prvních letech může spustit daň.",
      },
      {
        q: "Obě jsou v USD — koupí IWDA místo CSPX omezím měnové riziko?",
        a: "Ne. Denominace fondu v USD je jen účetní měna, ve které se počítá cena. Rozhodující je, v jakých měnách firmy uvnitř reálně vydělávají. CSPX je čistě americký, takže neseš prakticky plné dolarové riziko. IWDA je globálnější (i evropské a asijské firmy), takže je měnové riziko rozloženější — ale jako český investor, který nakonec utrácí koruny, neseš kurzové riziko vůči CZK u obou fondů vždy.",
      },
      {
        q: "Dává smysl držet IWDA i CSPX zároveň?",
        a: "Většinou ne. CSPX je z velké části podmnožina toho, co už v IWDA máš, takže kombinací obou jen zvyšuješ váhu USA, aniž bys přidal něco nového. Pokud chceš víc Ameriky, stačí to a jeden fond. Držet oba zároveň má smysl spíš omylem než záměrně — leda že bys CSPX používal jako cílené 'dokoupení USA' k jinému, neamerickému jádru.",
      },
    ],
  },
  "vwce-vs-iwda": {
    intro: [
      "Tohle je nejčastější \"který jeden ETF na celý svět\" souboj, jaký český investor řeší. A nejde v něm o poplatek ani o výplatu dividend jako u jiných dvojic. Oba fondy jsou totiž akumulační (IWDA = iShares Core MSCI World USD Acc, listovaný jako IWDA na londýnské burze, v naší databázi vedený i pod tickerem SWDA) – dividendy se u obou reinvestují uvnitř fondu, takže je jako Čech danit nemusíš. Jádro rozdílu je čistě ve složení: co vlastně \"celý svět\" znamená.",
      "VWCE od Vanguardu sleduje index FTSE All-World a drží kolem 3 700 firem včetně rozvíjejících se trhů – Čína, Indie, Tchaj-wan, Korea, Brazílie. IWDA sleduje MSCI World a drží zhruba 1 300 firem jen z rozvinutých zemí – rozvíjející se trhy v něm nejsou vůbec. To je ta jediná podstatná otázka: chceš opravdu úplně celý svět v jednom nákupu, nebo ti stačí vyspělé trhy (kterým dnes dominují americké megakapky) a EM si buď nechceš vzít, nebo si je plánuješ přikoupit zvlášť?",
      "Pro českého drobného investora to má dva praktické dopady. Za prvé měnové riziko neseš u obou vždy vůči koruně – oba jsou v základní třídě v dolarech a ani jeden nehedguje do CZK, takže tenhle rozdíl mezi nimi neřeš. Za druhé: IWDA má za sebou obřího sourozence SWDA a delší, hlouběji zavedenou historii, VWCE je zase \"jeden fond a mám hotovo\" bez potřeby cokoli dokupovat. Pozor jen na to, že IWDA existuje i v distribuční variantě (IWRD/IWDD) – při nákupu si u brokera ověř, že bereš právě akumulační třídu, jinak bys dividendy danil 15 %.",
    ],
    pick1:
      "VWCE dává smysl, když chceš doopravdy jeden jediný ETF na celý svět – včetně rozvíjejících se trhů – a nechceš už nikdy nic dokupovat ani dorovnávat váhy. Ideální pro investora, který chce maximální diverzifikaci a klid \"kup a zapomeň\".",
    pick2:
      "IWDA sedí tomu, kdo chce jádro jen z vyspělých trhů – buď protože rozvíjejícím trhům nevěří, nebo protože si EM plánuje přikoupit zvlášť (např. přes EIMI) a chce si sám řídit jejich váhu ve stavebnici. Láká i toho, kdo preferuje delší historii a obří likviditu iShares.",
    faqs: [
      {
        q: "Je IWDA akumulační, nebo distribuční? Budu z něj danit dividendy?",
        a: "IWDA (iShares Core MSCI World USD Acc) je akumulační – dividendy reinvestuje uvnitř fondu a jako investor je nedaníš. Pozor ale: iShares nabízí i distribuční verzi téhož indexu pod jinými tickery (IWRD/IWDD). Když ti záleží na tom nedanit dividendy, ověř si při nákupu, že máš skutečně akumulační třídu.",
      },
      {
        q: "Jak velký je v IWDA podíl USA a chybí mi v něm rozvíjející se trhy?",
        a: "IWDA sleduje MSCI World, což jsou jen rozvinuté trhy a dnes v nich americké firmy tvoří zhruba 70 %. Rozvíjející se trhy (Čína, Indie, Tchaj-wan...) v něm nejsou vůbec. VWCE je přidává navrch – to je hlavní důvod, proč mezi nimi vůbec vybíráš.",
      },
      {
        q: "Můžu později přejít z IWDA na VWCE, když si to rozmyslím?",
        a: "Můžeš, ale prodej IWDA je zdanitelná událost. Pokud nesplníš časový test (držení nad 3 roky, od 2026 bez limitu) ani hodnotový test (do 100 000 Kč prodejů ročně), zisk z prodeje daníš. Proto se vyplatí vybrat filozofii (celý svět vs jen vyspělý) hned na začátku, ne to řešit přehazováním po pár letech.",
      },
      {
        q: "Když k IWDA přikoupím EM fond, dostanu totéž co VWCE?",
        a: "Zhruba ano – kombinace IWDA (vyspělé trhy) + EM fondu (např. EIMI) se blíží složení FTSE All-World, které drží VWCE. Rozdíl je v tom, že u stavebnice si sám hlídáš poměr a rebalancuješ, kdežto VWCE váhy řídí za tebe. Stavebnice dává větší kontrolu, VWCE větší pohodlí.",
      },
    ],
  },
  "swrd-vs-iwda": {
    intro: [
      "SWRD (SPDR) a IWDA (v české burzovní realitě obchodovaný spíš pod tickerem SWDA) sledují úplně stejný index MSCI World, tedy zhruba 1 300 velkých a středních firem z vyspělých trhů. Jsou to oba akumulační fondy v irském domicilu, oba v dolarech. Jinými slovy: expozice je prakticky totožná. Kdo řeší tenhle souboj, nerozhoduje se mezi dvěma různými strategiemi, ale mezi dvěma provedeními jedné a téže věci.",
      "Jádro rozdílu je krátké a nedramatické: SWRD je levnější novější varianta, IWDA je zavedený obr s dlouhou historií a mnohonásobně větším objemem. Rozdíl v ročním poplatku je v řádu desetin procenta. Pro českého investora, který každý měsíc posílá pár tisíc korun, to v absolutních číslech nedělá zázraky, přesto právě 'levnější dvojče' bývá důvod, proč lidé o přesunu z IWDA na SWRD vůbec uvažují.",
      "Praktická pointa pro Čecha: protože jsou oba akumulační, dividendy se uvnitř fondu automaticky reinvestují a vy je nikde nedaníte ani nepřiznáváte. Daň řešíte až při prodeji, a tam platí u obou stejná pravidla (časový test nad 3 roky, nebo hodnotový test do 100 000 Kč ročního objemu prodejů). Měnové riziko vůči koruně nesete u obou identicky, protože oba drží stejná světová aktiva. Rozdíl mezi nimi tedy nikdy nebude o daních ani o měně, jen o nákladech, velikosti a tom, co u svého brokera reálně koupíte.",
    ],
    pick1:
      "SWRD dává smysl, pokud začínáte na zelené louce a chcete co nejnižší nákladovost u akumulačního MSCI World, u kterého nemusíte řešit žádné dividendy. Je to čistá volba pro nákladově citlivého investora, kterému nevadí kratší historie a menší (byť pořád mnohamiliardový) objem fondu.",
    pick2:
      "IWDA/SWDA zvolte, pokud chcete největší a nejlikvidnější MSCI World s nejdelší historií a širokou dostupností u všech českých i evropských brokerů. Sedí i tomu, kdo IWDA už roky drží: mírně vyšší poplatek nestojí za to, aby kvůli němu spustil prodej a riskoval nesplnění časového nebo hodnotového testu.",
    faqs: [
      {
        q: "SWRD nebo IWDA (SWDA) je to samé, nebo ne?",
        a: "Expozičně prakticky ano, oba sledují index MSCI World (zhruba 1 300 firem z vyspělých trhů), oba jsou akumulační, dolarové a irské. Liší se jen poskytovatelem (SPDR vs iShares), nákladovostí a velikostí fondu, ne tím, co reálně vlastníte.",
      },
      {
        q: "Vyplatí se kvůli nižšímu poplatku přejít z IWDA na SWRD?",
        a: "Rozdíl v ročním poplatku je v řádu desetin procenta, takže úspora je malá. Hlavně ale pozor: prodej stávajícího IWDA je zdanitelná událost. Pokud nesplníte časový test (držení nad 3 roky) ani hodnotový test (souhrn prodejů do 100 000 Kč za rok), můžete zaplatit daň ze zisku, která snadno převýší roky ušetřené na poplatku. U dlouhodobě drženého IWDA se přesun většinou nevyplatí; nižší poplatek dává smysl spíš u nových nákupů.",
      },
      {
        q: "Musím u těchto fondů danit dividendy?",
        a: "Ne. Oba jsou akumulační, takže dividendy z akcií se automaticky reinvestují uvnitř fondu. Nedostáváte je na účet, nedaníte je ani nepřiznáváte v českém přiznání. Daň řešíte až případně při prodeji podílů, a tam platí u obou stejná pravidla.",
      },
      {
        q: "Který z nich je dostupnější u českých brokerů?",
        a: "IWDA/SWDA je jeden z nejrozšířenějších ETF v Evropě a najdete ho prakticky u každého brokera obsluhujícího Čechy (včetně DEGIRO, XTB, Interactive Brokers). SWRD je také běžně dostupný, ale u konkrétního brokera či v konkrétní měně/na konkrétní burze si vždy ověřte, že jde koupit tak, jak potřebujete, právě dostupnost a burza/měna bývají v praxi větší rozdíl než samotný poplatek.",
      },
    ],
  },
  "cspx-vs-vuaa": {
    intro: [
      "CSPX (iShares Core S&P 500 UCITS ETF) a VUAA (Vanguard S&P 500 UCITS ETF Accumulating) jsou prakticky dvojčata. Sledují stejný index (S&P 500 – 500 největších amerických firem), oba jsou akumulační (dividendy se reinvestují uvnitř fondu, takže je jako český investor v průběhu držení vůbec neřešíš), oba mají irský domicil a v době psaní i shodný TER. Kdo hledá zásadní rozdíl v obsahu portfolia, žádný nenajde – výnosy se liší jen v řádu drobných odchylek v tom, jak přesně fond kopíruje index a jak se počítá kurz k datu.",
      "Proto tuhle dvojici lidé neřeší kvůli 'který je lepší' – řeší ji kvůli tie-breakeru. Když jsi rozhodnutý koupit akumulační S&P 500 v Irsku, zbývá vybrat mezi dvěma největšími hráči na trhu a rozhoduje pár praktických maličkostí, ne velký investiční příběh. Nenech se zmást marketingem ani dlouhými srovnávacími tabulkami: u těchto dvou fondů jde o dostupnost u tvého brokera, o to na jaké burze a v jaké měně nakupuješ, a případně o velikost a stáří fondu.",
      "Pro Čecha je klíčové vědět, že u obou platí totéž daňově i měnově. Akumulace znamená, že se dividendovou 15% daní vůbec nezabýváš – reinvestice probíhá uvnitř fondu. Při prodeji rozhoduje časový test (držení nad 3 roky = zisk osvobozen, od 2026 bez hodnotového stropu) nebo hodnotový test do 100 000 Kč ročního objemu prodejů. A protože je oba fondy denominovány v USD a drží americké akcie, neseš vůči koruně měnové riziko tak jako tak – volba mezi CSPX a VUAA na tom nic nemění.",
    ],
    pick1:
      "CSPX (iShares) zvol, pokud chceš úplně největší a nejstarší akumulační S&P 500 fond na trhu s nejdelší historií a maximální likviditou, nebo když ho máš u svého brokera dostupný pod tickerem SXR8 (Xetra, v EUR) či CSPX (Londýn, v USD) – tedy typicky přes DEGIRO nebo XTB, kde bývá bez problémů obchodovatelný.",
    pick2:
      "VUAA (Vanguard) zvol, pokud preferuješ značku Vanguard (typicky kvůli konzistenci celého portfolia, když už držíš třeba VWCE), nebo když ho máš snáz dostupný a levněji obchodovatelný u svého brokera – u řady českých investorů rozhodne prostě to, kterou burzu a měnu daný broker nabízí bez zbytečných poplatků za konverzi.",
    faqs: [
      {
        q: "Je mezi CSPX a VUAA vůbec nějaký rozdíl, který by mě měl zajímat?",
        a: "Prakticky ne z hlediska toho, co držíš – stejný index, stejná akumulace, stejný irský domicil, shodný poplatek. Rozdíl je jen v poskytovateli, velikosti fondu (CSPX je výrazně větší a starší) a hlavně v tom, na jaké burze a v jaké měně je u tvého brokera dostupný. Vybírej podle dostupnosti a nákladů na obchod, ne podle 'výkonu'.",
      },
      {
        q: "CSPX na burze vidím i jako SXR8. Je to jiný fond?",
        a: "Ne, je to tentýž iShares Core S&P 500 (Acc), jen listovaný na více burzách pod různými tickery: CSPX v Londýně (v USD), SXR8 na německé Xetře (v EUR). Držíš úplně stejný fond, liší se jen měna a burza obchodování – což ale ovlivní tvé poplatky za měnovou konverzi u brokera.",
      },
      {
        q: "Který z nich koupím na DEGIRO nebo XTB?",
        a: "Oba bývají u českých brokerů běžně dostupné. Konkrétní dostupnost, burzu a měnu si ale vždy ověř přímo v aplikaci svého brokera – právě to je u téhle dvojice rozhodující faktor. Sleduj, jestli broker účtuje poplatek za obchod a jestli tě nedostane měnová konverze CZK→USD nebo CZK→EUR.",
      },
      {
        q: "Musím u těchto akumulačních fondů danit dividendy?",
        a: "Ne. U akumulačních fondů se dividendy reinvestují uvnitř fondu, takže žádnou dividendu na účet nedostáváš a 15% daň z dividend jako český investor neřešíš. Daň může přijít až při prodeji, a i tomu se vyhneš, pokud splníš časový test (držení nad 3 roky) nebo hodnotový test (prodeje do 100 000 Kč za rok).",
      },
    ],
  },
  "vusa-vs-vuaa": {
    intro: [
      "VUSA a VUAA jsou dvojčata z jedné dílny: obojí je Vanguard S&P 500 UCITS ETF, stejný index (500 největších amerických firem), stejný irský domicil i stejný nákladový poměr. Neliší se tím, do čeho investují, ale tím, co dělají s dividendami, které americké firmy vyplácejí. VUSA je distribuční, takže vám dividendy posílá na účet. VUAA je akumulační, dividendy nechává uvnitř fondu a automaticky je reinvestuje zpět do akcií. To je celý souboj a zároveň rozhodnutí, které ovlivní, jak se s fondem daňově a papírově žije.",
      "Pro českého investora je jádrem rozdílu daň z dividend. U distribučního VUSA vám každý rok přijde výplata, kterou musíte v daňovém přiznání zdanit 15 % (dividendy z fondu s irským domicilem se v ČR běžně řeší jako příjem z kapitálového majetku). U akumulačního VUAA se dividenda reinvestuje uvnitř fondu, žádná výplata na váš účet nepřijde, a tím pádem ročně nic nedaníte ani nevyplňujete. Právě proto je VUAA pro fázi budování majetku pohodlnější: menší papírování a peníze pracují dál bez třecích ztrát.",
      "Pozor ale na častý omyl: akumulace neznamená, že prodej fondu nikdy nedaníte. Zisk z prodeje řeší úplně jiné pravidlo, časový a hodnotový test (od 2026 osvobození po 3 letech držení bez limitu, nebo do 100 000 Kč tržeb za rok), a ten platí pro VUSA i VUAA stejně. Akumulace vám odpouští jen roční daň z dividend, ne daň při samotném prodeji. A ještě jedno, co platí pro obě třídy stejně: fond je v dolarech a drží americké akcie, takže jako český investor nesete kurzové riziko vůči koruně bez ohledu na to, kterou třídu zvolíte.",
    ],
    pick1:
      "VUSA (distribuční) zvolte, pokud chcete z portfolia pravidelný hotovostní tok, například v rentiérské fázi nebo když chcete dividendy reálně utrácet či přesouvat jinam. Počítejte s tím, že výplatu každý rok zdaníte 15 % a zahrnete do přiznání.",
    pick2:
      "VUAA (akumulační) zvolte, pokud teprve budujete majetek a chcete klid: dividendy se reinvestují samy, roční daň z dividend neřešíte a nevyplňujete kvůli nim přiznání. To je pro dlouhý horizont a spořicí fázi jednodušší cesta.",
    faqs: [
      {
        q: "Je VUAA díky akumulaci automaticky daňově výhodnější než VUSA?",
        a: "Ne automaticky, ale pro fázi spoření obvykle pohodlnější. VUAA vám odpustí roční daň 15 % z vyplácených dividend a související papírování, protože se dividendy reinvestují uvnitř fondu. Nejde ale o daňové kouzlo na prodej: zisk z prodeje řeší u obou tříd stejný časový a hodnotový test. Pokud dividendy stejně nechcete utrácet, akumulace jen ušetří tření navíc.",
      },
      {
        q: "Můžu později přejít z VUSA na VUAA (nebo naopak)?",
        a: "Fyzicky to znamená prodat jednu třídu a koupit druhou, nejde o bezplatný přesun uvnitř fondu. A právě prodej může spustit daň ze zisku, pokud nesplníte časový test (3 roky držení) ani hodnotový test (do 100 000 Kč tržeb za rok). Proto se vyplatí vybrat třídu hned na začátku podle toho, jestli chcete výplatu, nebo reinvestici, a nepřeskakovat mezi nimi zbytečně.",
      },
      {
        q: "Proč má VUSA výrazně větší objem než VUAA, když je to stejný fond?",
        a: "Distribuční VUSA je na trhu déle a je historicky populárnější u investorů, kteří chtějí výplatu, proto v něm je víc peněz. Akumulační VUAA je mladší třída, ale u obou jde o stejný podkladový index i správce Vanguard. Pro drobného investora není rozdíl ve velikosti prakticky podstatný, obě třídy jsou dostatečně velké a likvidní na běžné pravidelné nákupy.",
      },
      {
        q: "Nesu u VUAA menší měnové riziko, protože se dividendy nevyplácejí?",
        a: "Ne, měnové riziko je u obou tříd stejné. Fond drží americké akcie a je veden v dolarech, takže hodnota vaší investice v korunách kolísá s kurzem USD/CZK bez ohledu na to, jestli se dividendy vyplácejí, nebo reinvestují. Volba akumulace versus distribuce mění jen tok dividend a daně, ne to, v jaké měně reálně máte majetek.",
      },
    ],
  },
  "cspx-vs-spy5": {
    intro: [
      "Tenhle souboj lidé řeší, protože oba fondy sledují úplně stejný index S&P 500 (500 největších amerických firem) a v grafu výkonnosti je mezi nimi prakticky nula. Rozdíl v ceně i skladbě je tak malý, že se to na první pohled zdá jako hod mincí. Jenže právě u téhle dvojice je jeden rozdíl, který se v grafu neukáže, ale pro českého investora je zásadní.",
      "Jádro rozdílu totiž není poplatek, ale způsob výplaty. iShares CSPX je akumulační: dividendy amerických firem se automaticky reinvestují uvnitř fondu, takže je vůbec neřešíš a nedaníš. SPDR SPY5 je naopak distribuční, dividendy ti fond několikrát ročně posílá na účet v hotovosti a z každé takové výplaty musíš v ČR odvést 15% daň z dividend. To je papírování a daňová ztráta, která se ve fázi budování majetku každý rok načítá. Levnější TER u SPY5 tuhle nevýhodu ve fázi růstu majetku většinou nevyváží.",
      "Praktická rovina: CSPX je jeden z největších evropských ETF vůbec, takže ho najdeš prakticky u každého brokera včetně DEGIRO, XTB nebo Trading212, a spread bývá minimální. SPY5 je menší a u některých českých brokerů ho nemusíš najít v nabídce nebo jen na méně likvidní burze. Než začneš tuhle dvojici řešit do detailu, zkontroluj, jestli SPY5 tvůj broker vůbec nabízí.",
    ],
    pick1:
      "iShares CSPX zvol, pokud buduješ majetek na dlouhý horizont a nechceš řešit dividendy ani daňové přiznání: akumulace reinvestuje uvnitř fondu, dostupnost u českých brokerů je bezproblémová a obří velikost fondu znamená klid a těsný spread.",
    pick2:
      "SPDR SPY5 dává smysl hlavně tehdy, když vyloženě chceš dividendu vyplácet v hotovosti (cash flow, rentiérská fáze) a nevadí ti danit 15 % z každé výplaty, nebo pokud řešíš čistě nejnižší nákladovost a máš SPY5 dobře dostupný u svého brokera.",
    faqs: [
      {
        q: "Je SPY5 akumulační, nebo distribuční?",
        a: "SPY5 (State Street SPDR S&P 500) je distribuční, tedy dividendy vyplácí v hotovosti na tvůj účet, ne reinvestuje uvnitř. To je hlavní rozdíl proti akumulačnímu iShares CSPX. Pro českého investora to znamená, že z každé výplaty odvádíš 15% daň z dividend, zatímco u CSPX se dividendy reinvestují automaticky a danit je nemusíš.",
      },
      {
        q: "Proč má SPY5 nižší poplatek, ale lidi stejně častěji berou CSPX?",
        a: "SPY5 má sice o něco nižší TER, ale je distribuční, takže roční 15% daň z vyplácených dividend ve fázi růstu majetku tu úsporu na poplatku obvykle přebije. CSPX navíc řeší reinvestici sám a je řádově větší a dostupnější, takže pro dlouhodobé spoření ho mnoho lidí volí i přes o kousek vyšší poplatek.",
      },
      {
        q: "Musím u CSPX řešit časový nebo hodnotový test kvůli akumulaci?",
        a: "Ne, to jsou dvě různé věci. Akumulace jen znamená, že se dividendy reinvestují uvnitř fondu (nedaníš je). Časový test nad 3 roky a hodnotový test 100 000 Kč se týkají až zisku z prodeje podílů, tedy okamžiku, kdy fond prodáváš. Platí stejně pro CSPX i SPY5.",
      },
      {
        q: "Nesu u obou fondů měnové riziko, když jsou v dolarech?",
        a: "Ano, oba fondy drží americké akcie a jsou vedené v USD, takže jako český investor utrácející koruny neseš kurzové riziko vůči CZK u obou stejně. To, že si CSPX koupíš na evropské burze třeba v eurech, na tom nic nemění, pod kapotou jsou pořád dolarová americká aktiva.",
      },
    ],
  },
  "vwce-vs-vwrl": {
    intro: [
      "VWCE a VWRL jsou dva pohledy na jeden a ten samý fond. Oba od Vanguardu, oba sledují index FTSE All-World, oba drží stejných zhruba 3 700 firem z celého světa včetně rozvíjejících se trhů. Portfolio je do posledního titulu totožné, TER je stejné. Jediné, co je odlišuje, je co fond dělá s dividendami, které mu firmy vyplácejí: VWCE je automaticky reinvestuje uvnitř fondu (akumulační), VWRL vám je pošle na účet (distribuční). Tohle není souboj o kvalitu ani o poplatky, je to rozhodnutí o tom, jestli chcete peníze zpět do portfolia, nebo do peněženky.",
      "Pro českého investora má ten rozdíl velmi praktický daňový rozměr, a to je jádro celé volby. U VWRL dostáváte reálnou dividendu, a ta se v Česku daní 15 % v roce, kdy přijde, ať s ní uděláte cokoli. I když ji ručně reinvestujete zpět, daň už jste odvedli. U VWCE se dividendy reinvestují uvnitř fondu a vy na úrovni své daně nic neřešíte, dokud podíly neprodáte. Efekt složeného úročení tak u akumulační třídy pracuje bez ročního daňového tření. Proto je VWCE v Česku výrazně populárnější a taky mnohem větší, což je vidět i na velikosti fondu.",
      "Zbytek je stejný pro obě třídy. Fond je vedený v USD a firmy v něm jsou z celého světa, takže jako český investor nesete měnové riziko vůči koruně bez ohledu na to, kterou třídu zvolíte, výplata dividend na to nemá vliv. A pozor na časté zaměňování dvou věcí: akumulace vs. distribuce (co fond dělá s dividendou) je něco úplně jiného než český časový test u prodeje. Časový test po 3 letech držby řeší osvobození zisku z prodeje podílů a platí pro obě třídy stejně, s akumulací nesouvisí.",
    ],
    pick1:
      "VWCE zvolte, pokud dlouhodobě budujete majetek a nechcete řešit dividendy ani daňové papírování každý rok. Reinvestice běží uvnitř fondu, složené úročení pracuje bez ročního zdanění a je to defaultní volba pro fázi růstu portfolia s dlouhým horizontem.",
    pick2:
      "VWRL dává smysl, když chcete z portfolia pravidelný hotovostní tok, například v rentiérské fázi nebo když si výplatu chcete fyzicky vybírat. Počítejte s tím, že každou dividendu v ČR zdaníte 15 % v roce jejího připsání, i kdybyste ji reinvestovali ručně zpět.",
    faqs: [
      {
        q: "Když u VWRL dividendu ručně reinvestuju zpět, vyjde to stejně jako VWCE?",
        a: "Ne úplně. U VWRL dividendu nejdřív dostanete, zdaníte ji v ČR 15 % a teprve zbytek můžete reinvestovat, navíc obvykle zaplatíte poplatek za dokupní obchod. U VWCE se reinvestuje celá částka uvnitř fondu bez vaší daně a bez transakce. Na dlouhém horizontu je akumulační třída na daních a tření efektivnější.",
      },
      {
        q: "Musím u VWCE danit reinvestované dividendy?",
        a: "Na úrovni vaší osobní daně ne. Reinvestice probíhá uvnitř fondu, vy nedostáváte žádný příjem k danění. Zdanitelná událost nastává až při prodeji podílů, a i ten může být osvobozen, pokud splníte časový test (držba nad 3 roky) nebo hodnotový test (roční objem prodejů do 100 000 Kč).",
      },
      {
        q: "Liší se VWCE a VWRL měnovým rizikem?",
        a: "Ne. Obě třídy drží stejné celosvětové portfolio a jsou vedené v USD, takže jako český investor nesete měnové riziko vůči koruně u obou identicky. To, jestli fond dividendu vyplácí, nebo reinvestuje, na měnovou expozici nemá žádný vliv.",
      },
      {
        q: "Proč je VWCE výrazně větší než VWRL?",
        a: "Akumulační třída je mezi evropskými a hlavně českými dlouhodobými investory populárnější právě kvůli daňové jednoduchosti, proto do ní teče víc peněz. Větší velikost fondu ale sama o sobě neznamená lepší výkonnost, portfolio i výnos jsou u obou tříd prakticky stejné.",
      },
    ],
  },
  "cspx-vs-vusa": {
    intro: [
      "Tahle dvojice mate lidi hlavne proto, ze mixuje dve odlisne veci najednou. CSPX (iShares Core S&P 500) a VUSA (Vanguard S&P 500) sledují úplně stejný index amerických 500 firem, oba mají irský domicil a de facto stejný poplatek. Kdyby se lišily jen značkou poskytovatele, byl by to nudný souboj \"iShares vs Vanguard\" o nic. Jenže tady se do toho plete druhá osa, která je pro Čecha mnohem důležitější: CSPX je akumulační, VUSA distribuční.",
      "A právě acc vs dist je jádro celého rozhodnutí, i když to podle tickerů není na první pohled vidět. CSPX dividendy z amerických firem reinvestuje uvnitř fondu, takže je vůbec nevidíte a neřešíte je v daňovém přiznání. VUSA vám je jednou za čtvrtletí posílá na účet jako hotovost, což je hezké, ale každá taková výplata je pro vás v ČR zdanitelný dividendový příjem se srážkou 15 %. Rozdíl v poskytovateli (iShares vs Vanguard) je proti tomuhle skoro kosmetický.",
      "Pokud tuhle dvojici srovnáváte, vyplatí se nejdřív poctivě říct, co vlastně řešíte. Chcete se rozhodnout mezi akumulací a distribucí u S&P 500? Pak je značka fondu vedlejší a klidně můžete zvažovat i acc verzi Vanguardu (VUAA) nebo dist verzi iShares. Chcete konkrétně porovnat dva různé poskytovatele? Pak srovnávejte stejné třídy (obě akumulační, nebo obě distribuční), ne jablka s hruškami jako tady.",
    ],
    pick1:
      "CSPX zvolte, pokud budujete majetek a nechcete kolem dividend žádné papírování — reinvestice běží automaticky uvnitř fondu, do přiznání nic nezadáváte a při prodeji vám stačí splnit časový (nad 3 roky) nebo hodnotový test. Je to obří, velmi likvidní akumulační třída od iShares.",
    pick2:
      "VUSA zvolte, pokud chcete od S&P 500 pravidelnou hotovost na účet (typicky v rentiérské nebo výplatní fázi) a jste smíření s tím, že každou čtvrtletní dividendu musíte v ČR danit 15 %. Za cash flow tady platíte trochu administrativy navíc.",
    faqs: [
      {
        q: "Je CSPX lepší než VUSA, když mají stejný poplatek i index?",
        a: "Ani jeden není objektivně lepší — sledují totožný index se stejným TER. Reálný rozdíl je v tom, co dělají s dividendou: CSPX ji reinvestuje uvnitř (nic nedaníte, ideální pro růst majetku), VUSA ji vyplácí (máte hotovost, ale platíte 15% daň z každé výplaty). Značka iShares vs Vanguard je tu vedlejší.",
      },
      {
        q: "Musím u CSPX řešit daň z dividend?",
        a: "Ne. U akumulačního CSPX se dividendy reinvestují uvnitř fondu a vy je nedostáváte na účet, takže je v českém přiznání neuvádíte a neplatíte z nich 15% daň. Danit řešíte až případný zisk z prodeje podílů — a ten je při splnění časového testu (držení nad 3 roky) osvobozený.",
      },
      {
        q: "Když chci porovnat jen Vanguard vs iShares, srovnávám správně CSPX a VUSA?",
        a: "Ne úplně — mísíte dvě osy. CSPX je akumulační, VUSA distribuční, takže srovnáváte i poskytovatele i způsob výplaty naráz. Pro čisté srovnání poskytovatelů dejte proti sobě stejné třídy: akumulační CSPX vs akumulační VUAA, nebo distribuční IUSA vs distribuční VUSA.",
      },
      {
        q: "Nesu u obou stejné měnové riziko vůči koruně?",
        a: "Ano. Oba fondy drží americké akcie v dolarech, takže jako český investor utrácející koruny nesete kurzové riziko USD/CZK u obou stejně. Že je VUSA kotovaná i v jiných měnách nebo že CSPX je akumulační na tom nic nemění — rozhodující je měna podkladových aktiv, a ta je u obou dolarová.",
      },
    ],
  },
};

export function getPairContent(slug: string): PairContent | null {
  return pairContent[slug.toLowerCase()] ?? null;
}
