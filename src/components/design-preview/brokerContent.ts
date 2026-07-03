/* Per-broker REDAKČNÍ obsah pro recenze (nový design).
 * Non-generický obsah kvůli indexaci; tvrdá data (poplatky…) jsou v src/data/brokerData.ts.
 * Klíč = id brokera. Vygenerováno redakčními agenty z původních recenzí + brokerData.
 */

export interface BrokerFaq {
  q: string;
  a: string;
}

export interface BrokerContent {
  tagline: string;
  intro: string[];
  forWhom: string;
  feesText: string[];
  verdict: string[];
  pros: string[];
  cons: string[];
  faqs: BrokerFaq[];
}

export const brokerContent: Record<string, BrokerContent> = {
  "degiro": {
    "tagline": "Nízkonákladový evropský broker jako součást regulované banky flatexDEGIRO – ideální pro dlouhodobé ETF investory hledající levné nákupy a bezpečí, ale s daňovou pastí u dividend.",
    "intro": [
      "DEGIRO je nizozemský broker založený v roce 2008, který od roku 2013 cílí i na drobné investory. Dnes je součástí burzovně kotované flatexDEGIRO Bank AG a s více než 3 miliony klientů patří mezi největší evropské brokery. Na rozdíl od většiny konkurentů tak nejde o samostatnou brokerskou firmu, ale o entitu napojenou na plnohodnotnou banku regulovanou německým BaFinem a nizozemskými DNB/AFM.",
      "Na českém trhu si DEGIRO vybudoval pozici mezi nákladově uvědomělými investory. Láká na tzv. Core Selection – seznam 200+ vybraných UCITS ETF, které lze nakupovat prakticky bez transakčního poplatku (pouze 1 EUR manipulační poplatek za nákup). Celková nabídka přesahuje 3000 ETF a desetitisíce akcií na 31 světových burzách.",
      "Odlišuje se právě kombinací velmi nízkých nákladů na ETF a bankovního zázemí. Zároveň ale nejde o brokera bez kompromisů: chybí frakční investování, demo účet i pokročilé nástroje a české dividendy jsou zdaněny 35% sazbou."
    ],
    "forWhom": "DEGIRO se hodí pro dlouhodobého českého ETF investora, který pravidelně nakupuje větší jednorázové částky do fondů z Core Selection a chce minimalizovat poplatky – zvlášť když využívá bezplatnou konverzi CZK/EUR a vklady v korunách. Vhodný je pro buy-and-hold strategii s akumulačními (reinvestujícími) ETF, kde se problém s dividendami neřeší. Nehodí se pro investory s malými pravidelnými částkami (chybí frakční akcie, takže drahé ETF nekoupíte po zlomcích), pro milovníky českých dividendových akcií (35% srážka) ani pro aktivní tradery, kteří potřebují demo účet, pokročilé grafy nebo CFD.",
    "feesText": [
      "Pro českého investora do ETF jsou reálné náklady u DEGIRO nízké, pokud se drží Core Selection. Zde platíte 0 EUR provize plus 1 EUR manipulační poplatek za jeden nákup – tedy jednotky korun za obchod. U ostatních ETF mimo Core Selection počítejte s cca 3 EUR plus manipulační poplatek. K tomu se přičítá roční poplatek za připojení na jednotlivé zahraniční burzy (tzv. exchange connectivity fee, cca 2,5 EUR ročně za každou burzu, kde v daném roce obchodujete).",
      "Klíčovou výhodou pro Čecha je bezplatná konverze CZK/EUR – vklady i výběry i samotný převod korun na eura DEGIRO nezpoplatňuje. U ostatních měnových konverzí (např. na USD při nákupu US-listed instrumentů) je poplatek 0,25 %, což je nízké. Pozor ale na daně z dividend: u českých akcií a dividendových titulů drží DEGIRO srážkovou daň 35 % místo standardních 15 %. Část (rozdíl oproti 15 %) lze za určitých podmínek řešit vratkou přes daňové přiznání, ale je to administrativa navíc. Nejjednodušší obranou je volit akumulační ETF, kde se dividendy reinvestují uvnitř fondu a tento problém prakticky odpadá."
    ],
    "verdict": [
      "DEGIRO je solidní a levná volba pro dlouhodobého ETF investora, který si vystačí s Core Selection a nakupuje akumulační fondy. Bankovní zázemí flatexDEGIRO Bank AG, evropská regulace (BaFin, DNB/AFM) a bezplatná konverze CZK/EUR z něj dělají důvěryhodného a nákladově efektivního brokera pro pasivní investování. S hodnocením 79/100 patří ke špičce mezi zahraničními brokery na českém trhu, i když ho v posledních letech předběhli konkurenti s nulovými poplatky a frakčním investováním.",
      "Slabinou je 35% zdanění českých dividend, absence frakčních akcií (menší investoři nekoupí drahé ETF po částech), chybějící demo účet a jen základní platforma WebTrader bez pokročilých nástrojů. Kdo chce nakupovat malé částky, aktivně obchodovat nebo se soustředit na české dividendové akcie, bude spokojenější jinde. Pro klasického dlouhodobého investora do světových ETF ale DEGIRO zůstává rozumnou a prověřenou volbou."
    ],
    "pros": [
      "Core Selection: 200+ vybraných UCITS ETF za 0 EUR provize + pouze 1 EUR manipulační poplatek za nákup",
      "Bezplatná konverze a vklady/výběry v CZK/EUR – ideální pro českého investora bez měnových ztrát",
      "Bankovní zázemí flatexDEGIRO Bank AG s evropskou regulací (BaFin, DNB/AFM) a segregací klientských prostředků",
      "Široká nabídka přes 3000 ETF a přístup na 31 světových burz",
      "Nulový minimální vklad a částečně česká podpora i lokalizace platformy"
    ],
    "cons": [
      "České dividendy zdaněny 35 % (místo 15 %) – rozdíl lze řešit jen komplikovanou vratkou přes daňové přiznání",
      "Nepodporuje frakční investování – drahé ETF nelze koupit po zlomcích, což znevýhodňuje malé pravidelné částky",
      "Žádný demo účet pro vyzkoušení platformy nanečisto",
      "ETF mimo Core Selection stojí cca 3 EUR + manipulační poplatek a přibývá roční poplatek za burzy (~2,5 EUR/burza)",
      "Základní platforma WebTrader bez pokročilých analytických nástrojů, CFD a s omezeným short prodejem"
    ],
    "faqs": [
      {
        "q": "Kolik reálně zaplatím za nákup ETF u DEGIRO?",
        "a": "U fondů z Core Selection (200+ vybraných ETF) je provize 0 EUR a platíte pouze 1 EUR manipulační poplatek za nákup, tedy jednotky korun. U ostatních ETF je poplatek přibližně 3 EUR plus manipulační poplatek. K tomu se jednou ročně přičítá poplatek za připojení na burzu (cca 2,5 EUR za každou burzu, kde v daném roce obchodujete)."
      },
      {
        "q": "Jak DEGIRO zdaňuje dividendy pro české investory?",
        "a": "U českých akcií a dividendových titulů sráží DEGIRO 35 % místo standardních 15 %. Rozdíl je za určitých podmínek možné získat zpět vratkou přes daňové přiznání, je to ale administrativa navíc. Nejjednodušším řešením je volit akumulační (reinvestující) ETF, u nichž se dividendy reinvestují uvnitř fondu a srážka se prakticky neřeší."
      },
      {
        "q": "Musím u DEGIRO směňovat koruny na eura a kolik to stojí?",
        "a": "Konverze CZK/EUR i vklady a výběry v korunách jsou u DEGIRO zdarma. Pokud nakupujete instrumenty v jiné měně (např. USD), platí se poplatek za konverzi 0,25 %, což je nízká sazba."
      },
      {
        "q": "Je u DEGIRO nějaký minimální vklad?",
        "a": "Ne, DEGIRO nemá žádný povinný minimální vklad (0 EUR). Můžete tedy začít s libovolně malou částkou, i když kvůli absenci frakčních akcií si na jeden nákup drahého ETF musíte našetřit alespoň na jeden celý podíl."
      },
      {
        "q": "Podporuje DEGIRO frakční (zlomkové) investování?",
        "a": "Ne, DEGIRO nepodporuje nákup zlomků akcií ani ETF. Vždy musíte koupit celý podíl, takže u dražších fondů potřebujete na jeden nákup vyšší částku. Pro pravidelné malé investice je to nevýhoda oproti brokerům s frakčním investováním."
      },
      {
        "q": "Je DEGIRO bezpečný a v češtině?",
        "a": "DEGIRO je součástí flatexDEGIRO Bank AG regulované německým BaFinem a nizozemskými DNB/AFM, klientské prostředky jsou segregované a chráněné evropskými garančními schématy. Platforma i zákaznická podpora jsou částečně v češtině, podpora je dostupná v pracovní dny (zhruba 9–17 h)."
      }
    ]
  },
  "xtb": {
    "tagline": "Polský broker s licencí ČNB, českou podporou 24/7 a nákupem ETF bez poplatku do 100 000 EUR měsíčně.",
    "intro": [
      "XTB (X-Trade Brokers) je burzovně obchodovaný broker založený v roce 2002 v Polsku, kótovaný na varšavské burze. Pro české investory je klíčové, že působí pod licencí České národní banky a nabízí plnou českou lokalizaci platformy i podporu, což ho řadí mezi nejdostupnější zahraniční brokery pro Čechy.",
      "Od konkurence se odlišuje kombinací nulových poplatků za nákup akcií a ETF (do měsíčního objemu 100 000 EUR), vlastní platformy xStation 5 a české telefonické podpory dostupné 24/7. Nabízí přes 1 600 ETF a více než 7 000 akcií s reálným vlastnictvím (ne CFD), frakční investování a investiční plány pro pravidelné spoření.",
      "XTB tak cílí na běžného retailového investora, který chce jednoduše a bez provizí nakupovat ETF v češtině, spíše než na profesionály hledající opce, futures nebo nejnižší možné náklady na velkých objemech."
    ],
    "forWhom": "XTB se hodí pro začínajícího až středně pokročilého českého ETF investora, který ocení češtinu, podporu 24/7, nulový poplatek za nákup ETF a možnost frakčních podílů i pravidelných investičních plánů. Nevhodný je pro toho, kdo obchoduje opce či futures (XTB je nenabízí), pro investory s velkými měsíčními objemy nad 100 000 EUR (nad limit platí 0,2 %), a pro dividendové investory zaměřené na české akcie kvůli 35% srážkové dani.",
    "feesText": [
      "Samotný nákup ETF je u XTB bez provize do souhrnného objemu 100 000 EUR měsíčně, nad tento limit se účtuje 0,2 %. Většina retailových investorů se tak fakticky pohybuje v režimu 0 Kč za obchod. Reálné náklady českého investora ale tvoří hlavně měna: XTB vede účet nejčastěji v EUR nebo CZK a při obchodování ETF denominovaného v jiné měně provádí konverzi se spreadem 0,5 % nad tržním kurzem. Kdo posílá koruny a kupuje ETF v eurech nebo dolarech, zaplatí tuto konverzi na každém nákupu i při případném prodeji. Vklad bankovním (SEPA) převodem je zdarma, platba kartou ale stojí 0,77 % (CZK) nebo 0,70 % (EUR) — proto se vždy vyplatí posílat peníze převodem, ne kartou. Minimální vklad není žádný a poplatek za neaktivitu se neúčtuje po dobu 12 měsíců.",
      "U zdanění dividend je situace dvojí. U ETF a akcií z USA lze díky vyplněnému formuláři W-8BEN dosáhnout snížené srážky 15 % místo 30 %. Naopak u dividend z českých akcií drží XTB jako zahraniční broker srážku 35 % (nesnížených 15 %), což je citelná nevýhoda pro dividendové investory do českých titulů. Pro typického investora do širokých akumulačních ETF (např. celosvětové indexy) je ale zdanění dividend uvnitř fondu řešeno na úrovni fondu a tento problém se ho prakticky netýká."
    ],
    "verdict": [
      "XTB patří mezi nejsilnější volby pro běžného českého ETF investora. Nabízí nákup ETF bez provize do 100 000 EUR měsíčně, licenci ČNB, plnou češtinu a telefonickou podporu 24/7 — kombinaci, kterou většina zahraničních brokerů nemá. Platforma xStation 5 je moderní a přehledná, frakční podíly a investiční plány usnadňují pravidelné spoření i s malým kapitálem.",
      "Slabší stránkou jsou konverzní náklady 0,5 % pro investory obchodující v cizí měně, chybějící opce a futures a zejména 35% srážková daň z dividend českých akcií. Ochrana prostředků přes polský garanční fond KDPW dosahuje jen zhruba 22 000 EUR, což je méně než 100 000 EUR u bankovních brokerů typu Fio nebo DEGIRO. Pro dlouhodobého investora do širokých ETF jsou to však vesměs okrajové výhrady a XTB lze doporučit."
    ],
    "pros": [
      "Nákup akcií a ETF bez provize do objemu 100 000 EUR měsíčně (nad limit 0,2 %)",
      "Licence České národní banky a plná česká lokalizace platformy i dokumentů",
      "Česká zákaznická podpora dostupná telefonicky 24/7",
      "Frakční ETF a investiční plány pro automatické pravidelné investování (DCA)",
      "Žádný minimální vklad a bez poplatku za neaktivitu po dobu 12 měsíců",
      "Reálné vlastnictví akcií a ETF (ne CFD) včetně nároku na dividendy"
    ],
    "cons": [
      "Konverze měn se spreadem 0,5 % zatíží každý nákup i prodej ETF v cizí měně",
      "Dividendy z českých akcií daněny sráženou sazbou 35 % místo 15 %",
      "Nižší ochrana prostředků (~22 000 EUR přes polský fond KDPW) oproti 100 000 EUR u bankovních brokerů",
      "Nenabízí obchodování opcí ani futures kontraktů",
      "Nad objem 100 000 EUR měsíčně se u nákupu ETF účtuje 0,2 %"
    ],
    "faqs": [
      {
        "q": "Je nákup ETF u XTB opravdu zdarma?",
        "a": "Ano, nákup i prodej ETF a akcií je bez provize do souhrnného objemu 100 000 EUR za kalendářní měsíc. Nad tento limit se účtuje 0,2 % (minimálně 10 EUR) z části přesahující limit. Většina retailových investorů se do limitu pohodlně vejde. Počítejte ale s konverzí měn 0,5 %, pokud nakupujete ETF v jiné měně, než ve které máte účet."
      },
      {
        "q": "Jak XTB zdaňuje dividendy pro české investory?",
        "a": "U amerických titulů lze po vyplnění formuláře W-8BEN dosáhnout snížené srážky 15 %. U dividend z českých akcií XTB jako zahraniční broker sráží 35 %. U dalších zemí se sazba liší podle smluv o zamezení dvojího zdanění. Pro investory do širokých akumulačních ETF řeší zdanění dividend samotný fond a tento problém je pro ně okrajový."
      },
      {
        "q": "Nabízí XTB češtinu a českou podporu?",
        "a": "Ano. Platforma xStation 5, mobilní aplikace i dokumenty jsou plně v češtině a zákaznická podpora je dostupná telefonicky, přes chat i e-mail v češtině, telefonicky dokonce 24/7. Patří to mezi hlavní výhody XTB oproti brokerům jako Trading 212 nebo Interactive Brokers, kteří češtinu nemají."
      },
      {
        "q": "Jaký je minimální vklad u XTB?",
        "a": "XTB nemá žádný povinný minimální vklad — účet lze založit a začít investovat i s malou částkou. Díky frakčním podílům můžete koupit i zlomek dražší akcie nebo ETF. Peníze doporučujeme posílat bankovním (SEPA) převodem, který je zdarma; platba kartou stojí 0,77 % (CZK) nebo 0,70 % (EUR)."
      },
      {
        "q": "Jsou peníze a ETF u XTB v bezpečí?",
        "a": "XTB je burzovně obchodovaná společnost kótovaná na varšavské burze s licencí ČNB a prostředky klientů drží na oddělených (segregovaných) účtech. Ochrana investorů je zajištěna přes polský garanční systém KDPW zhruba do 22 000 EUR, což je méně než 100 000 EUR u bankovních brokerů (Fio, DEGIRO). Samotné držené ETF jsou ale vaším majetkem odděleným od majetku brokera."
      },
      {
        "q": "Lze u XTB pravidelně investovat do ETF (DCA)?",
        "a": "Ano, XTB nabízí investiční plány, které umožňují automaticky a pravidelně nakupovat vybraná ETF, včetně frakčních podílů. To je vhodné pro strategii pravidelného investování (DCA) i s menšími částkami. Alternativně můžete nakupovat ručně, protože nákup ETF je do limitu 100 000 EUR měsíčně bez provize."
      }
    ]
  },
  "fio": {
    "tagline": "Jediná plnohodnotně česká volba pro ETF: domácí regulace ČNB, čeština a férové 15% zdanění dividend výměnou za vyšší poplatky.",
    "intro": [
      "Fio e-Broker je obchodní platforma Fio banky, ryze české instituce založené v roce 1993 a regulované Českou národní bankou. Na rozdíl od většiny zahraničních brokerů, kteří pro Čechy fungují přes irské nebo kyperské pobočky, tu jednáte s domácí bankou: peníze i cenné papíry spadají pod český dohled, komunikace probíhá kompletně v češtině a účet propojíte přímo s běžným účtem u Fio banky.",
      "Fio dnes zprostředkovává přístup nejen na pražskou burzu (BCPP), ale i na evropské trhy a americké burzy, a nabízí přes 200 ETF. Není to tedy čistě lokální hráč jako dřív, ale poplatková struktura a zaměření pořád míří spíš na konzervativního českého investora než na někoho, kdo chce levně a masově nakupovat zahraniční ETF.",
      "Hlavní odlišnost Fia je kombinace bankovní důvěryhodnosti a daňového komfortu pro české papíry. Za tuto jistotu ale platíte výrazně vyššími poplatky za nákup než u DEGIRO, XTB nebo Trading 212."
    ],
    "forWhom": "Fio e-Broker se hodí pro konzervativního českého investora, který chce mít brokera pod dohledem ČNB, komunikovat výhradně česky a mít vše propojené s domácím bankovním účtem. Sedne i tomu, kdo vedle ETF drží české akcie a dluhopisy na pražské burze a oceňuje férové 15% zdanění českých dividend a jednoduché daňové přiznání. Nevhodný je naopak pro nákladově citlivého ETF investora, který pravidelně posílá menší částky (procentní poplatek s minimem 7,95 EUR za evropský nákup malé investice zdecimuje), pro fanoušky frakčních podílů (Fio je neumí) a pro aktivní tradery, kterým bude vadit starší platforma a chudší analytické nástroje.",
    "feesText": [
      "Reálný náklad na nákup ETF je u Fia jeho slabina. Evropské ETF (typicky irské UCITS fondy, které Češi kupují nejčastěji) stojí 0,79 % z objemu s minimem 7,95 EUR za pokyn. Při nákupu za 5 000 Kč tak zaplatíte spíš to minimum, tedy kolem 8 EUR, což je přes 3 % vstupní náklad. Za české ETF na BCPP je to 0,29-0,35 % s minimem řádově v desítkách korun. Pro srovnání, u XTB nebo Trading 212 kupujete ETF bez poplatku za nákup. Fio proto dává smysl hlavně při větších, méně častých nákupech, ne při pravidelném měsíčním spoření drobných částek.",
      "Měnovou konverzi CZK/EUR nebo CZK/USD provádí Fio zdarma, resp. kurzem banky (deviza střed), což je poctivější než skryté 0,5% přirážky u některých konkurentů. Vedení účtu je bez měsíčního poplatku. Klíčová daňová výhoda: dividendy z českých akcií a fondů Fio zdaňuje standardní 15% sazbou. U zahraničních (zejména amerických) ETF pozor na to, že bez platného potvrzení o daňovém domicilu může u dividend hrozit srážka 30-35 %; irské akumulační ETF tuto komplikaci elegantně obcházejí, protože dividendy nevyplácejí. KID dokumentaci a daňové podklady dostanete v češtině, což daňové přiznání citelně zjednodušuje."
    ],
    "verdict": [
      "Fio e-Broker je nejsilnější tam, kde zahraniční brokeři pokulhávají: domácí regulace ČNB, pojištění do 100 000 EUR, kompletní čeština, bankovní zázemí a bezstarostné 15% zdanění českých dividend. Pro investora, který chce jistotu a jednoduchost a nevadí mu za ně zaplatit, je to rozumná a důvěryhodná volba.",
      "Cenou za tento komfort jsou výrazně vyšší poplatky za nákup ETF (0,79 % s minimem 7,95 EUR u evropských fondů), absence frakčního investování a starší platforma. Pro pravidelné nízkonákladové spoření do zahraničních ETF proto Fio nedoporučujeme, tam vyjde levněji XTB, Trading 212 nebo DEGIRO. Ideální je Fio jako doplněk: české akcie a dluhopisy plus daňový klid u Fia, levné ETF u zahraničního brokera."
    ],
    "pros": [
      "Ryze český broker pod dohledem ČNB s pojištěním vkladů do 100 000 EUR a zázemím banky založené v roce 1993",
      "Kompletní čeština včetně platformy, podpory a KID dokumentace, ideální pro jednoduché daňové přiznání",
      "Standardní 15% zdanění dividend z českých akcií a fondů bez komplikací",
      "Měnová konverze zdarma kurzem banky bez skryté přirážky",
      "Bez měsíčního poplatku za vedení účtu a bez minimálního vkladu (0 Kč)",
      "Přímé propojení s běžným účtem u Fio banky a přístup na pražskou burzu (BCPP)"
    ],
    "cons": [
      "Vysoký poplatek za nákup evropských ETF: 0,79 % s minimem 7,95 EUR za pokyn, u malých částek přes 3 % vstupní náklad",
      "Nepodporuje frakční (částečné) ETF, nelze investovat přesnou částku",
      "Starší obchodní platforma a slabší analytické nástroje než u moderní konkurence",
      "Nabídka přes 200 ETF je proti tisícům u DEGIRO či Trading 212 omezená a uživatelé hlásí občasné technické problémy platformy"
    ],
    "faqs": [
      {
        "q": "Kolik reálně zaplatím za nákup evropského ETF u Fia?",
        "a": "Za evropské ETF platíte 0,79 % z objemu obchodu, minimálně však 7,95 EUR za pokyn. Při nákupu za pár tisíc korun tedy narazíte na minimum, což u malých částek znamená i přes 3 % vstupní náklad. Za české ETF na pražské burze je to 0,29-0,35 % s výrazně nižším minimem."
      },
      {
        "q": "Jak Fio daní dividendy z ETF?",
        "a": "Dividendy z českých akcií a fondů zdaňuje Fio standardní 15% sazbou. U zahraničních (hlavně amerických) papírů může bez potvrzení o daňovém domicilu hrozit vyšší srážka až 30-35 %. Řešením jsou irské akumulační ETF, které dividendy nevyplácejí a tuto komplikaci obcházejí."
      },
      {
        "q": "Je platforma a podpora v češtině?",
        "a": "Ano. Fio e-Broker je ryze český broker, celá platforma, zákaznická podpora i KID dokumentace jsou v češtině. Podpora je dostupná v pracovní dny zhruba od 8 do 18 hodin."
      },
      {
        "q": "Jaký je minimální vklad a platí se poplatek za vedení účtu?",
        "a": "Minimální vklad je 0 Kč, účet si můžete otevřít bez počáteční investice. Vedení investičního účtu je bez měsíčního poplatku."
      },
      {
        "q": "Umožňuje Fio frakční (částečné) ETF?",
        "a": "Ne. Fio nepodporuje frakční investování, vždy nakupujete celé kusy ETF. Pokud chcete investovat přesnou částku bez zbytku, sáhněte po brokerovi jako Trading 212 nebo Portu."
      },
      {
        "q": "Kolik stojí měnová konverze při nákupu ETF v EUR nebo USD?",
        "a": "Měnovou konverzi provádí Fio zdarma, kurzem banky (deviza střed) bez skryté přirážky. To je poctivější než u brokerů účtujících například 0,5 % za převod měny."
      }
    ]
  },
  "trading212": {
    "tagline": "Bezpoplatkový mobilní broker s frakčními ETF a automatickým investováním, ideální pro začátečníky a pravidelné spoření.",
    "intro": [
      "Trading 212 je britsko-kyperský broker založený v roce 2004, který se v Evropě proslavil modelem 0% poplatků za nákup akcií a ETF. Pro české klienty vystupuje entita Trading 212 Markets Ltd. regulovaná kyperskou CySEC, na pozadí je i britská FCA. Platforma dnes eviduje miliony uživatelů a patří k nejrychleji rostoucím retailovým brokerům na kontinentu.",
      "Od klasických brokerů typu DEGIRO nebo Fio se odlišuje důrazem na mobilní aplikaci, frakční investování (koupíte ETF už od cca 1 EUR / 25 Kč) a funkce AutoInvest a Pies pro automatizované DCA spoření s automatickým rebalancováním. Nejde o platformu pro aktivní tradery s pokročilou analytikou, ale o nástroj pro dlouhodobé pasivní investory, kteří chtějí jednoduchost a nulové transakční poplatky."
    ],
    "forWhom": "Hodí se pro začátečníky a dlouhodobé pasivní investory, kteří investují menší pravidelné částky do ETF, ocení frakční nákupy od 25 Kč a chtějí automatizovat DCA přes AutoInvest bez transakčních poplatků. Nevhodný je pro investory, kteří vyžadují českou telefonickou podporu, pokročilé obchodní příkazy a analytiku, chtějí obchodovat české akcie na BCPP nebo jim vadí automatické zapojení pozic do lending programu (půjčování akcií).",
    "feesText": [
      "Reálné náklady českého ETF investora u Trading 212 jsou velmi nízké. Za nákup i prodej akcií a ETF neplatíte žádnou provizi (0 %, bez limitu objemu), vklady i výběry jsou zdarma. Hlavním nákladem je měnová konverze: účet vedete typicky v EUR, takže při vkladu korun z české banky proběhne konverze CZK/EUR s přirážkou 0,15 % (o víkendu 0,5 %). Této konverzi se lze částečně vyhnout posíláním eur, případně vedením účtu přímo v EUR a nákupem ETF v původní měně.",
      "Z daňového hlediska je zásadní volba správného ETF. U akumulačních (accumulating) ETF s domicilem v Irsku se dividenda reinvestuje uvnitř fondu a řeší se pouze zdanění při prodeji (v ČR lze využít časový nebo hodnotový test na osvobození). U distribučních ETF Trading 212 dividendy nezdaňuje sám a nesráží žádný vlastní poplatek za výplatu, ale u fondů s americkou expozicí bez správně vyplněného formuláře W-8BEN hrozí srážka 30 %. Proto českým investorům obvykle dává největší smysl irský akumulační ETF (např. na index S&P 500 nebo celý svět), kde odpadá řešení 15 vs. 35% srážkové daně z dividend a náklady se blíží nule."
    ],
    "verdict": [
      "Trading 212 patří k nejlevnějším způsobům, jak z Česka pravidelně investovat do ETF. Kombinace nulových provizí, frakčních nákupů od 25 Kč, bezplatných vkladů/výběrů a propracovaného AutoInvestu z něj dělá jednu z nejlepších voleb pro začátečníky a spořicí strategii DCA. Ochrana prostředků je solidní: hotovost je držena u bank s pojištěním do 100 000 EUR, investice kryje kyperský fond ICF do 20 000 EUR.",
      "Slabinami jsou absence české a telefonické podpory (komunikace probíhá anglicky), chybějící pokročilé nástroje a příkazy, žádné české akcie na BCPP a měnová konverze 0,15 %. Pozornost si zaslouží i automatické zapojení akcií do lending programu, který lze naštěstí vypnout. Aktivní tradeři a investoři vyžadující detailní analytiku či česky mluvící podporu budou spokojenější u XTB nebo DEGIRO; pro levné dlouhodobé budování ETF portfolia je však Trading 212 těžko překonatelný."
    ],
    "pros": [
      "0 % poplatek za nákup i prodej akcií a ETF bez omezení objemu",
      "Frakční ETF už od cca 1 EUR (25 Kč) – ideální pro malé částky",
      "AutoInvest a Pies: automatické DCA spoření s rebalancováním zdarma",
      "Bezplatné vklady i výběry, nízká měnová konverze 0,15 %",
      "Solidní ochrana: hotovost do 100 000 EUR u bank, investice do 20 000 EUR (ICF)"
    ],
    "cons": [
      "Žádná česká ani telefonická podpora – komunikace pouze anglicky",
      "Konverze CZK/EUR s přirážkou 0,15 % (o víkendu 0,5 %) při vkladu korun",
      "Chybí pokročilé příkazy, analytika a české akcie na BCPP",
      "Akcie jsou automaticky zapojeny do lending programu (nutno ručně vypnout), poplatek 10 EUR/rok za neaktivitu po 12 měsících"
    ],
    "faqs": [
      {
        "q": "Má Trading 212 češtinu a českou podporu?",
        "a": "Ne. Aplikace ani zákaznická podpora nejsou v češtině – komunikace probíhá anglicky a chybí telefonická linka. Podpora funguje přes chat a e-mail. Pokud potřebujete česky mluvící podporu, zvažte XTB nebo Fio."
      },
      {
        "q": "Jaký je minimální vklad u Trading 212?",
        "a": "Prakticky žádný – účet lze otevřít bez minimálního vkladu a díky frakčním akciím koupíte ETF už od zhruba 1 EUR (asi 25 Kč). To je ideální pro začátečníky s malým kapitálem."
      },
      {
        "q": "Jak se u Trading 212 daní dividendy z ETF?",
        "a": "Trading 212 sám nesráží žádný poplatek za výplatu dividend, ale u fondů s americkou expozicí bez vyplněného formuláře W-8BEN hrozí srážka až 30 %. Nejjednodušší je zvolit irský akumulační ETF, kde se dividendy reinvestují uvnitř fondu a řešíte jen případnou daň při prodeji podle českého časového/hodnotového testu."
      },
      {
        "q": "Kolik platím za měnovou konverzi z korun?",
        "a": "Vkládáte-li koruny na EUR účet, Trading 212 účtuje konverzní přirážku 0,15 % (o víkendu 0,5 %). Nákup a prodej samotného ETF je bez provize. Konverzi lze minimalizovat posíláním eur nebo držením zůstatku v měně, ve které ETF nakupujete."
      },
      {
        "q": "Co je lending program a je bezpečný?",
        "a": "Trading 212 může vaše akcie automaticky půjčovat třetím stranám (securities lending). V krizích to teoreticky zvyšuje protistranové riziko dostupnosti akcií. Program lze v nastavení účtu vypnout – doporučujeme to zkontrolovat, protože nové pozice se mohou zapojovat automaticky."
      },
      {
        "q": "Lze převést ETF od jiného brokera na Trading 212?",
        "a": "Trading 212 dlouhodobě nenabízí standardní příchozí převod cenných papírů (transfer in) jako DEGIRO nebo Interactive Brokers. V praxi se pozice u starého brokera prodají a prostředky se převedou jako hotovost, což může mít daňové důsledky. Před přechodem si tuto možnost ověřte přímo v podpoře."
      }
    ]
  },
  "ibkr": {
    "tagline": "Globální broker s nejširší nabídkou trhů a férovým 15% zdaněním US dividend, ale bez češtiny a s technicky náročnou platformou.",
    "intro": [
      "Interactive Brokers (IBKR) je americký broker založený v roce 1978, kótovaný na Nasdaq, se správou přes 400 miliard USD aktiv a více než 1,5 milionem účtů. Patří k největším a nejrespektovanějším brokerům na světě a je oblíbenou volbou zkušených investorů po celém světě.",
      "Pro české klienty smlouvu uzavírá evropská entita Interactive Brokers Ireland Ltd. regulovaná irskou centrální bankou (CBI), zatímco mateřská firma podléhá americkému SEC/FINRA. IBKR nabízí přístup na 150+ burz ve 33 zemích a přes 150 milionů obchodovatelných instrumentů - akcie, ETF, opce, futures, dluhopisy, forex i komodity.",
      "Od konkurence se odlišuje především šíří nabídky, nízkými transakčními náklady u velkých objemů a velmi levnou měnovou konverzí (0,2 %). Naopak neinvestuje do jednoduchosti - platforma TWS je profesionální nástroj, který začátečníka spíše odradí, a broker nenabízí českou lokalizaci ani českou podporu."
    ],
    "forWhom": "IBKR se hodí pro pokročilého a zkušeného ETF investora, který se neztratí v anglickém rozhraní, chce jeden účet pro globální trhy (US, Evropa, Asie) a ocení levnou konverzi měn a férové 15% zdanění amerických dividend. Ideální je při vyšším kapitálu a pravidelných nákupech větších objemů. Nevhodný je pro úplného začátečníka, pro investora, který chce vše česky a jednoduše, a pro toho, kdo hledá jen bezpoplatkový nákup pár evropských ETF - tam bývají XTB, Trading 212 nebo DEGIRO praktičtější.",
    "feesText": [
      "Reálné náklady českého investora: nákup amerických ETF stojí 0,005 USD za akcii s minimem 1 USD za pokyn (a stropem 1 % hodnoty obchodu), evropské ETF pak 0,05 % hodnoty s minimem 1,25 EUR a maximem 29 EUR. Při běžných nákupech to znamená typicky kolem 1 USD za obchod, což je u větších objemů velmi levné, ale u malých pravidelných nákupů (např. 100 EUR měsíčně) se minimální poplatek 1 USD projeví citelněji než u brokerů s nulovým poplatkem. Minimální vklad je 0 USD (zrušen v roce 2021) a IBKR neúčtuje poplatky za neaktivitu.",
      "Klíčová výhoda pro Čecha je měnová konverze: IBKR převádí CZK na USD či EUR za pouhých 0,2 % (min. 2 EUR za konverzi), tedy výrazně levněji než většina konkurence - lze si držet vícem měnovou hotovost a konvertovat cíleně. U zdanění dividend je IBKR příznivý: díky správně vyplněnému formuláři W-8BEN se srážková daň z amerických dividend drží na 15 % místo sankčních 35 %, což IBKR staví na roveň Fio, Portu nebo XTB v tomto ohledu (XTB a DEGIRO naopak často srážejí 35 %). Pozor na tržní data - přístup k některým datovým zdrojům je zpoplatněn 1-45 USD měsíčně podle typu."
    ],
    "verdict": [
      "Interactive Brokers je jeden z technicky nejlepších brokerů na trhu: bezkonkurenční nabídka trhů a instrumentů, nízké transakční náklady u větších objemů, levná měnová konverze 0,2 % a férové 15% zdanění amerických dividend. Důvěryhodnost je špičková - regulace CBI i SEC/FINRA a kótování na Nasdaq. Pro zkušeného investora s globálními ambicemi je to prakticky referenční volba.",
      "Slabinou zůstává absence češtiny a české podpory, složitější registrace a hlavně platforma TWS, která je pro začátečníka zbytečně komplexní. Kdo chce jen jednoduše a česky kupovat pár ETF, bude spokojenější u XTB, Trading 212 nebo DEGIRO. K IBKR má smysl přejít, jakmile investor získá zkušenosti, vyšší kapitál nebo potřebuje přístup na trhy, které jinde nenajde."
    ],
    "pros": [
      "Férové 15% zdanění amerických dividend (s formulářem W-8BEN) místo sankčních 35 %",
      "Nejlevnější měnová konverze mezi brokery: 0,2 % (min. 2 EUR) - výhodné pro nákup v USD i EUR z korunového účtu",
      "Nejširší nabídka na trhu: 150+ burz ve 33 zemích a přes 150 milionů instrumentů",
      "Špičková důvěryhodnost - regulace CBI (Irsko) i SEC/FINRA, kótování na Nasdaq, přes 400 mld. USD aktiv",
      "Žádný minimální vklad (0 USD) ani poplatky za neaktivitu, podpora frakčních ETF"
    ],
    "cons": [
      "Žádná česká lokalizace ani česká podpora - komunikace probíhá pouze anglicky",
      "Platforma TWS je pro začátečníky složitá až zastrašující a i registrace je náročnější",
      "Ochrana prostředků evropské entity jen do 20 000 EUR (ICF); SIPC do 500 000 USD kryje pouze americkou entitu, ne českého klienta",
      "Minimální poplatek 1 USD za pokyn činí malé pravidelné nákupy relativně dražšími než u brokerů s nulovým poplatkem",
      "Placený přístup k některým tržním datům (1-45 USD měsíčně) a jen omezené možnosti automatického investování/DCA"
    ],
    "faqs": [
      {
        "q": "Sráží Interactive Brokers z amerických dividend 15 %, nebo 35 %?",
        "a": "Při správně vyplněném formuláři W-8BEN (IBKR ho vyžaduje při zakládání účtu) se srážková daň z amerických dividend drží na smluvních 15 %. To je výhoda oproti některým brokerům jako XTB nebo DEGIRO, kde se často sráží sankčních 35 %."
      },
      {
        "q": "Jaká je ochrana mých peněz u IBKR pro českého klienta?",
        "a": "Český klient má smlouvu s evropskou entitou Interactive Brokers Ireland Ltd., na kterou se vztahuje irský kompenzační fond (ICF) do 20 000 EUR. Slavné SIPC pojištění do 500 000 USD kryje pouze americkou entitu, nikoliv evropské klienty. Aktiva jsou navíc vedena odděleně (segregovaně)."
      },
      {
        "q": "Kolik stojí konverze korun na dolary nebo eura?",
        "a": "IBKR konvertuje měny za velmi nízkých 0,2 % s minimem 2 EUR za konverzi. To je jedna z nejnižších sazeb mezi brokery. Můžete si držet vícem měnovou hotovost a konvertovat cíleně, což u pravidelných nákupů šetří náklady."
      },
      {
        "q": "Je Interactive Brokers dostupný v češtině?",
        "a": "Ne. IBKR nenabízí českou lokalizaci platformy ani českou zákaznickou podporu - vše probíhá v angličtině. Pokud potřebujete komunikovat a investovat česky, vhodnější jsou XTB, Fio nebo Portu."
      },
      {
        "q": "Je nutný minimální vklad?",
        "a": "Ne, minimální vklad byl zrušen v roce 2021 a je 0 USD. IBKR také neúčtuje žádné poplatky za neaktivitu, takže účet můžete mít i s malým zůstatkem."
      },
      {
        "q": "Kolik zaplatím za nákup ETF?",
        "a": "U amerických ETF je to 0,005 USD za akcii s minimem 1 USD za pokyn (max. 1 % hodnoty obchodu). U evropských ETF 0,05 % hodnoty s minimem 1,25 EUR a maximem 29 EUR. U větších objemů jsou náklady velmi nízké, u malých pravidelných nákupů se ale minimální poplatek projeví."
      }
    ]
  },
  "portu": {
    "tagline": "Česká robo-advisor platforma, která za roční poplatek 0,24-1 % investuje za vás do hotových ETF portfolií - pohodlí místo kontroly.",
    "intro": [
      "Portu je česká automatizovaná investiční platforma (robo-advisor), kterou v roce 2017 spustila skupina WOOD & Company. Je regulována ČNB a spravuje desítky miliard korun pro stovky tisíc klientů. Na rozdíl od klasických brokerů jako DEGIRO, XTB nebo Interactive Brokers si u Portu nekupujete konkrétní ETF sami - vyplníte investiční dotazník, zvolíte rizikový profil a Portu za vás sestaví a průběžně rebalancuje hotové portfolio složené z ETF fondů.",
      "Právě v tom spočívá zásadní odlišnost: Portu není nástroj pro výběr ETF, ale služba, která rozhodování přebírá za vás. To je jeho největší přednost i největší omezení zároveň. Kdo chce sám vybrat konkrétní fond (třeba VWCE nebo iShares Core MSCI World) a koupit ho na burze za pár korun, je u brokera lépe. Kdo se ale rozhodování a údržbě portfolia chce úplně vyhnout, dostane u Portu vše v češtině, s minimem vkladu 500 Kč a bez starostí o daně z prodejů uvnitř portfolia."
    ],
    "forWhom": "Portu se hodí pro úplného začátečníka nebo pasivního investora, který nechce sám vybírat ETF, řešit rebalancing ani měnové konverze a je ochoten za pohodlí a českou podporu zaplatit roční poplatek. Ideální je pro pravidelné menší vklady, investování pro děti nebo jako první krok do světa investic. Nevhodné je naopak pro každého, kdo chce sám držet konkrétní akumulační ETF a minimalizovat náklady - u brokera zaplatíte za nákup jednotky procent nebo nula, kdežto u Portu platíte procentní poplatek každý rok znovu. Rovněž se nehodí pro aktivní obchodníky, tradery a investory, kteří chtějí plnou kontrolu nad složením portfolia a pokročilé analytické nástroje.",
    "feesText": [
      "Klíčové je pochopit, že Portu má zcela jinou nákladovou logiku než broker. Neplatíte poplatek za jednotlivý nákup ETF, ale roční správcovský poplatek z celého objemu portfolia - maximálně 1 % ročně, s klesající sazbou podle výše investice až na zhruba 0,24 % u vysokých částek (efektivně tedy 0,47-1 % u běžných portfolií). Tento poplatek je all-inclusive: pokrývá automatický rebalancing i měnové konverze mezi CZK a měnou fondů, takže žádný samostatný FX poplatek (na rozdíl od XTB s 0,5 % nebo IBKR s 0,2 %) neřešíte. Vstupní ani výstupní poplatky Portu neúčtuje.",
      "V praxi to znamená, že u malých a začínajících portfolií je Portu nákladově velmi přívětivé, ale s rostoucím a hlavně dlouhodobě drženým majetkem se roční procento nasčítá do výrazně vyšších nákladů než u přímého nákupu jednoho akumulačního ETF u brokera. Na straně daní má Portu praktickou výhodu: dividendy z podkladových fondů podléhají srážkové dani jen 15 % (Portu je řeší přes český daňový režim), zatímco u DEGIRO nebo XTB může u některých ETF hrozit 35 % srážka. Pro dlouhodobého českého investora navíc platí, že zisk z prodeje po splnění tříletého časového testu (nebo do ročního limitu 100 000 Kč) je od daně z příjmů osvobozen."
    ],
    "verdict": [
      "Portu je jedním z nejpohodlnějších způsobů, jak jako Čech začít investovat do ETF, aniž byste čemukoli museli rozumět. Kompletní čeština, česká podpora, ČNB regulace, oddělení aktiv a garanční fond do 20 000 EUR, minimální vklad 500 Kč a plná automatizace včetně rebalancingu a měnových konverzí dělají z Portu bezkonkurenční volbu pro začátečníky a pasivní spořitele. Výhodné 15% zdanění dividend je oproti některým brokerům další plus.",
      "Slabinou je cena za toto pohodlí. Roční procentní poplatek 0,47-1 % je řádově dražší než jednorázový nákup akumulačního ETF u brokera, kde po nákupu už neplatíte nic. Kdo umí sám vybrat jeden globální ETF a držet ho, ušetří u Portu za deset let nezanedbatelnou částku. Portu proto doporučujeme jako startovací a bezstarostné řešení - ne jako dlouhodobě nejlevnější. Komu jde primárně o kontrolu a minimální náklady, ať zamíří k XTB, Trading 212 nebo Interactive Brokers."
    ],
    "pros": [
      "Vše v češtině včetně aplikace, smluv i podpory (pracovní dny 9-17)",
      "All-inclusive poplatek - v ročním procentu je zahrnut rebalancing i měnová konverze CZK/EUR, žádné skryté FX poplatky",
      "Nízký vstup: minimální vklad 500 Kč, další vklady od 100 Kč, bez vstupních a výstupních poplatků",
      "Plná automatizace - portfolio se samo sestaví, doplňuje a rebalancuje, ideální pro pravidelné DCA vklady",
      "Česká regulace ČNB, oddělení klientských aktiv a garanční fond do 20 000 EUR; za projektem stojí WOOD & Company",
      "Výhodné 15% zdanění dividend a speciální produkty (dětské účty, DIP s daňovými výhodami, Portu <26 se slevou)"
    ],
    "cons": [
      "Roční procentní poplatek (0,47-1 %) je při dlouhodobém držení výrazně dražší než jednorázový nákup ETF u brokera, kde po nákupu neplatíte nic",
      "Nevyberete si konkrétní ETF - dostanete hotové portfolio dle rizikového profilu, bez možnosti koupit vlastní fond",
      "Není to broker: chybí aktivní obchodování, pokročilé analytické nástroje a plná kontrola nad složením portfolia",
      "Poplatek se platí z celého objemu každý rok, takže s rostoucím majetkem náklady rychle rostou v absolutních číslech"
    ],
    "faqs": [
      {
        "q": "Vybírám si u Portu konkrétní ETF sám?",
        "a": "Ne. Portu je robo-advisor - podle vyplněného dotazníku a zvoleného rizikového profilu za vás sestaví hotové portfolio složené z ETF fondů a samo ho rebalancuje. Konkrétní fond (např. VWCE) si sami nekoupíte; pokud to chcete, potřebujete klasického brokera."
      },
      {
        "q": "Kolik u Portu reálně zaplatím na poplatcích?",
        "a": "Platíte roční správcovský poplatek maximálně 1 % z objemu portfolia, který podle výše investice klesá až k cca 0,24 % (běžně 0,47-1 %). V poplatku je zahrnut rebalancing i měnová konverze. Vstupní ani výstupní poplatky nejsou. Pozor: procento se platí každý rok znovu z celé částky."
      },
      {
        "q": "Jak jsou u Portu zdaněny dividendy a zisky?",
        "a": "Dividendy z podkladových fondů podléhají srážkové dani 15 % (výhodnější než 35 % hrozících u některých ETF u zahraničních brokerů). Zisk z prodeje je pro fyzické osoby osvobozen po splnění tříletého časového testu nebo do ročního limitu příjmů z prodeje 100 000 Kč."
      },
      {
        "q": "Jaký je minimální vklad?",
        "a": "Počáteční minimální vklad je 500 Kč, další vklady lze posílat už od 100 Kč. Výběr peněz je zdarma a kdykoli."
      },
      {
        "q": "Je Portu bezpečné a kdo za ním stojí?",
        "a": "Portu provozuje česká společnost regulovaná ČNB, kterou v roce 2017 založila skupina WOOD & Company. Klientská aktiva jsou oddělena od majetku společnosti a kryta garančním fondem obchodníků s cennými papíry do 20 000 EUR."
      },
      {
        "q": "Můžu si portfolio z Portu převést k jinému brokerovi?",
        "a": "Protože Portu drží hotová portfolia v rámci vlastní struktury, standardní cestou je portfolio prodat a peníze si vybrat, nikoli převádět konkrétní ETF jednotky jako u klasického brokera. Před prodejem zvažte dopad na daňový časový test."
      }
    ]
  },
};

export function getBrokerContent(id: string): BrokerContent | null {
  return brokerContent[id] ?? null;
}
