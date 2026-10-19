/* Per-broker REDAKČNÍ obsah pro recenze (nový design).
 * Non-generický obsah kvůli indexaci; tvrdá data (poplatky…) jsou v src/data/brokerData.ts.
 * Klíč = id brokera. Vygenerováno redakčními agenty z původních recenzí + brokerData.
 */

export interface BrokerFaq {
  q: string;
  a: string;
}

export interface BrokerContent {
  /** Jedna věta pod nadpisem – kdo broker je, BEZ čísel (ta jsou jen v tabulce „Kolik vás stojí“). */
  tagline: string;
  /** Rychlé rozhodnutí: 3 + 3 fakta (revize kola 2: dlouhé odstavce „verdiktu“ pryč). */
  proKoho: string[];
  proKohoNe: string[];
  /** Jak založit účet ve 3 krocích – fakta z oficiálních stránek brokera (URL v zalozeniZdroj, ověřeno 18. 10. 2026). */
  zalozeni: { t: string; d: string }[];
  zalozeniZdroj: string;
  intro: string[];
  feesText: string[];
  faqs: BrokerFaq[];
}

export const brokerContent: Record<string, BrokerContent> = {
  "degiro": {
    "tagline": "Nizozemský broker v rámci německé flatexDEGIRO Bank. Levný nákup vybraných ETF a směna korun na eura bez poplatku, bez nákupu části podílu a bez české podpory.",
    "proKoho": [
      "Nakupujete větší částky najednou – ETF z výběru ETF Selection za 1 EUR",
      "Posíláte koruny – směna CZK/EUR je zdarma",
      "Chcete hotovost u banky – pojištění vkladů do 100 000 EUR"
    ],
    "proKohoNe": [
      "Chcete koupit část podílu za přesnou částku – DEGIRO frakce nenabízí",
      "Potřebujete podporu v češtině – jen anglicky",
      "Kupujete ETF mimo výběr – 3 EUR za nákup, k tomu až 2,5 EUR ročně za každou burzu"
    ],
    "zalozeni": [
      {
        "t": "Registrace v aplikaci DEGIRO",
        "d": "Registrace probíhá v mobilní aplikaci, potřebujete chytrý telefon. Je vám aspoň 18 let."
      },
      {
        "t": "Ověření totožnosti",
        "d": "Naskenujete pas nebo občanský průkaz EU a pořídíte selfie. Zadáte daňové identifikační číslo."
      },
      {
        "t": "Vklad a nákup ETF",
        "d": "Peníze posíláte jen z bankovního účtu na vaše jméno (referenční účet). Pak najdete fond podle ISIN a zadáte pokyn."
      }
    ],
    "zalozeniZdroj": "https://www.degiro.cz/helpdesk/become-client/registering-degiro-account/how-do-i-open-degiro-account",
    "intro": [
      "DEGIRO je nizozemský broker založený v roce 2008, který od roku 2013 cílí i na drobné investory. Dnes je součástí burzovně kotované flatexDEGIRO Bank AG a patří mezi velké evropské brokery. Na rozdíl od většiny konkurentů tak nejde o samostatnou brokerskou firmu, ale o entitu napojenou na plnohodnotnou banku regulovanou německým BaFinem a nizozemskými DNB/AFM.",
      "Na českém trhu si DEGIRO vybudoval pozici mezi nákladově uvědomělými investory. Láká na tzv. ETF Selection – seznam 200+ vybraných UCITS ETF, které lze nakupovat prakticky bez transakčního poplatku (pouze 1 EUR manipulační poplatek za nákup). Celková nabídka přesahuje 3000 ETF a desetitisíce akcií na 31 světových burzách.",
      "Odlišuje se právě kombinací velmi nízkých nákladů na ETF a bankovního zázemí. Zároveň ale nejde o brokera bez kompromisů: chybí frakční investování, demo účet i pokročilé nástroje a české dividendy jsou zdaněny 35 % sazbou."
    ],
    "feesText": [
      "Pro českého investora do ETF jsou reálné náklady u DEGIRO nízké, pokud se drží ETF Selection. Zde platíte 0 EUR provize plus 1 EUR manipulační poplatek za jeden nákup (kolem 24 Kč). U ostatních ETF mimo tento seznam zaplatíte 3 EUR za pokyn (včetně manipulačního poplatku). K tomu se přičítá roční poplatek za připojení na jednotlivé zahraniční burzy (nejvýš 0,25 % hodnoty účtu, max. 2,5 EUR ročně za každou burzu, kde v daném roce obchodujete; pražská burza je výjimkou).",
      "Klíčovou výhodou pro Čecha je bezplatná konverze CZK/EUR – vklady i výběry i samotný převod korun na eura DEGIRO nezpoplatňuje. U ostatních měnových konverzí (např. na USD při nákupu US-listed instrumentů) je poplatek 0,25 %, což je nízké. Pozor ale na daně z dividend: u českých akcií a dividendových titulů drží DEGIRO srážkovou daň 35 % místo standardních 15 %. Část (rozdíl oproti 15 %) lze za určitých podmínek řešit vratkou přes daňové přiznání, ale je to administrativa navíc. Nejjednodušší obranou je volit akumulační ETF, kde se dividendy reinvestují uvnitř fondu a tento problém prakticky odpadá."
    ],
    "faqs": [
      {
        "q": "Kolik reálně zaplatím za nákup ETF u DEGIRO?",
        "a": "U fondů ze seznamu ETF Selection (200+ vybraných ETF) je provize 0 EUR a platíte pouze 1 EUR manipulační poplatek za nákup (kolem 24 Kč). U ostatních ETF je to 3 EUR za pokyn. K tomu se jednou ročně přičítá poplatek za připojení na burzu (nejvýš 0,25 % hodnoty účtu, max. 2,5 EUR za každou burzu, kde v daném roce obchodujete)."
      },
      {
        "q": "Jak DEGIRO zdaňuje dividendy pro české investory?",
        "a": "U českých akcií a dividendových titulů sráží DEGIRO 35 % místo standardních 15 %. Rozdíl je za určitých podmínek možné získat zpět vratkou přes daňové přiznání, je to ale administrativa navíc. Nejjednodušším řešením je volit akumulační (reinvestující) ETF, u nichž se dividendy reinvestují uvnitř fondu a srážka se prakticky neřeší."
      },
      {
        "q": "Musím u DEGIRO směňovat koruny na eura a kolik to stojí?",
        "a": "Konverze CZK/EUR i vklady a výběry v korunách jsou u DEGIRO zdarma. Pokud nakupujete instrumenty v jiné měně (např. USD), platí se poplatek za konverzi 0,25 %, což je nízká sazba."
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
        "a": "DEGIRO je součástí flatexDEGIRO Bank AG regulované německým BaFinem a nizozemskými DNB/AFM, klientské prostředky jsou segregované a chráněné evropskými garančními schématy. Web a platforma jsou v češtině, zákaznická podpora ale komunikuje jen anglicky (telefon v pracovní dny 8–22 h, e-mail)."
      }
    ]
  },
  "xtb": {
    "tagline": "Polský broker kótovaný na varšavské burze, v Česku organizační složka pod dohledem ČNB. Nákup ETF bez provize, část podílu a podpora v češtině.",
    "proKoho": [
      "Chcete vše česky – podpora v pracovní dny 8–18",
      "Investujete přesnou částku – koupíte i část podílu",
      "Nakupujete do 100 000 EUR měsíčně – bez provize"
    ],
    "proKohoNe": [
      "Posíláte koruny a kupujete ETF v eurech – směna 0,5 % při každém nákupu",
      "Držíte české dividendové akcie – srážka 35 %",
      "Chcete hotovost pojištěnou jako vklad v bance – kryje ji garanční systém (společný limit max. 20 100 EUR)"
    ],
    "zalozeni": [
      {
        "t": "Online formulář",
        "d": "Na xtb.com/cz kliknete na „Otevřít účet“ a vyplníte formulář."
      },
      {
        "t": "Ověření totožnosti",
        "d": "Nahrajete sken dokladu a projdete video ověřením. Ověřit se lze i osobně v pražské pobočce."
      },
      {
        "t": "Vklad a nákup ETF",
        "d": "Po aktivaci účtu pošlete peníze (převod z banky je zdarma) a zadáte pokyn k nákupu."
      }
    ],
    "zalozeniZdroj": "https://www.xtb.com/cz/help-center/obchodni-ucet-2/jak-otevrit-obchodni-ucet",
    "intro": [
      "XTB (X-Trade Brokers) je burzovně obchodovaný broker založený v roce 2002 v Polsku, kótovaný na varšavské burze. Působí pod licencí polského regulátora KNF, v Česku přes organizační složku pod dohledem ČNB, a nabízí plnou českou lokalizaci platformy i podporu, což ho řadí mezi nejdostupnější zahraniční brokery pro Čechy.",
      "Od konkurence se odlišuje kombinací nulových poplatků za nákup akcií a ETF (do měsíčního objemu 100 000 EUR), vlastní platformy xStation 5 a české telefonické podpory v pracovní dny. Nabízí přes 9 600 akcií a ETF z evropských a amerických burz s reálným vlastnictvím (ne CFD), frakční investování a investiční plány pro pravidelné spoření.",
      "XTB tak cílí na běžného retailového investora, který chce jednoduše a bez provizí nakupovat ETF v češtině, spíše než na profesionály hledající opce, futures nebo nejnižší možné náklady na velkých objemech."
    ],
    "feesText": [
      "Samotný nákup ETF je u XTB bez provize do souhrnného objemu 100 000 EUR měsíčně, nad tento limit se účtuje 0,2 %. Většina retailových investorů se tak fakticky pohybuje v režimu 0 Kč za obchod. Reálné náklady českého investora ale tvoří hlavně měna: XTB vede účet nejčastěji v EUR nebo CZK a při obchodování ETF denominovaného v jiné měně provádí konverzi se spreadem 0,5 % nad tržním kurzem. Kdo posílá koruny a kupuje ETF v eurech nebo dolarech, zaplatí tuto konverzi na každém nákupu i při případném prodeji. Vklad bankovním (SEPA) převodem je zdarma, platba kartou ale stojí 0,77 % (CZK) nebo 0,70 % (EUR) — proto se vždy vyplatí posílat peníze převodem, ne kartou. Minimální vklad není žádný a poplatek za neaktivitu se neúčtuje po dobu 12 měsíců.",
      "U zdanění dividend je situace dvojí. U ETF a akcií z USA lze díky vyplněnému formuláři W-8BEN dosáhnout snížené srážky 15 % místo 30 %. Naopak u dividend z českých akcií drží XTB jako zahraniční broker srážku 35 % (nesnížených 15 %), což je citelná nevýhoda pro dividendové investory do českých titulů. Pro typického investora do širokých akumulačních ETF (např. celosvětové indexy) je ale zdanění dividend uvnitř fondu řešeno na úrovni fondu a tento problém se ho prakticky netýká."
    ],
    "faqs": [
      {
        "q": "Je nákup ETF u XTB opravdu zdarma?",
        "a": "Ano, nákup i prodej ETF a akcií je bez provize do souhrnného objemu 100 000 EUR za kalendářní měsíc. Nad tento limit se účtuje 0,2 % (minimálně 10 EUR) z části přesahující limit. Většina retailových investorů se do limitu pohodlně vejde. Počítejte ale s konverzí měn 0,5 %, pokud nakupujete ETF v jiné měně, než ve které máte účet."
      },
      {
        "q": "Jak XTB zdaňuje dividendy pro české investory?",
        "a": "U amerických titulů lze po vyplnění formuláře W-8BEN dosáhnout snížené srážky 15 %. U dividend z českých akcií XTB jako zahraniční broker sráží 35 %. U dalších zemí se sazba liší podle smluv o zamezení dvojího zdanění. Pro investory do širokých akumulačních ETF řeší zdanění dividend samotný fond a tento problém je pro ně okrajový."
      },
      {
        "q": "Nabízí XTB češtinu a českou podporu?",
        "a": "Ano. Platforma xStation 5, mobilní aplikace i dokumenty jsou plně v češtině a zákaznická podpora je dostupná telefonicky, přes chat i e-mail v češtině, v pracovní dny 8–18 h. Patří to mezi hlavní výhody XTB oproti brokerům jako Trading 212 nebo Interactive Brokers, kteří češtinu nemají."
      },
      {
        "q": "Jaký je minimální vklad u XTB?",
        "a": "XTB nemá žádný povinný minimální vklad — účet lze založit a začít investovat i s malou částkou. Díky frakčním podílům můžete koupit i zlomek dražší akcie nebo ETF. Bankovní (SEPA) převod je zdarma; platba kartou stojí 0,77 % (CZK) nebo 0,70 % (EUR)."
      },
      {
        "q": "Jsou peníze a ETF u XTB v bezpečí?",
        "a": "XTB je burzovně obchodovaná společnost kótovaná na varšavské burze (licence polského KNF, česká pobočka pod dohledem ČNB) a peníze klientů drží na oddělených bankovních účtech. ETF a akcie vede odděleně od vlastního majetku, takže se vám při krachu brokera vracejí. Polský systém náhrad (KDPW) nastupuje, jen kdyby něco chybělo: peníze i cenné papíry dohromady nahradí ze 100 % do 3 000 EUR a z částky nad to 90 %, nejvýš 20 100 EUR. Části podílů (frakce) právně vlastní XTB a drží je pro vás ve svěřenské správě. U bankovních brokerů (Fio, DEGIRO) je hotovost navíc pojištěná jako vklad do 100 000 EUR."
      },
      {
        "q": "Lze u XTB pravidelně investovat do ETF (DCA)?",
        "a": "Ano, XTB nabízí investiční plány, které umožňují automaticky a pravidelně nakupovat vybraná ETF, včetně frakčních podílů. To je vhodné pro strategii pravidelného investování (DCA) i s menšími částkami. Alternativně můžete nakupovat ručně, protože nákup ETF je do limitu 100 000 EUR měsíčně bez provize."
      }
    ]
  },
  "fio": {
    "tagline": "Česká banka s platformou e-Broker: vše česky, pobočky a z českých dividend 15 %. Nákup zahraničních ETF je dražší než u zahraničních brokerů.",
    "proKoho": [
      "Chcete vše česky a banku s pobočkami",
      "Držíte české akcie – z dividend 15 %",
      "Chcete hotovost u banky – pojištění vkladů do 100 000 EUR"
    ],
    "proKohoNe": [
      "Posíláte malé měsíční částky – 3,95 EUR za nákup na Xetře do 1 400 EUR",
      "Chcete koupit část podílu – Fio frakce nenabízí",
      "Chcete znát náklad směny předem – je v kurzu banky, ceník ho neuvádí"
    ],
    "zalozeni": [
      {
        "t": "Osobní účet u Fio",
        "d": "Kdo u Fio účet nemá, založí si nejdřív Osobní účet – online v aplikaci Smartbanking přes Bank iD, nebo se dvěma doklady a ověřovací platbou."
      },
      {
        "t": "Obchodní účet pro e-Broker",
        "d": "V Internetbankingu nebo Smartbankingu zvolíte „+ Nový produkt“ a založíte obchodní účet."
      },
      {
        "t": "Převod peněz a nákup ETF",
        "d": "Pošlete peníze na obchodní účet a v e-Brokeru zadáte pokyn k nákupu."
      }
    ],
    "zalozeniZdroj": "https://www.fio.cz/o-nas/jak-se-stat-klientem/chci-investovat",
    "intro": [
      "Fio e-Broker je obchodní platforma Fio banky, ryze české instituce založené v roce 1993 a regulované Českou národní bankou. Na rozdíl od většiny zahraničních brokerů, kteří pro Čechy fungují přes irské nebo kyperské pobočky, tu jednáte s domácí bankou: peníze i cenné papíry spadají pod český dohled, komunikace probíhá kompletně v češtině a účet propojíte přímo s běžným účtem u Fio banky.",
      "Fio dnes zprostředkovává přístup nejen na pražskou burzu (BCPP), ale i na evropské trhy a americké burzy, a nabízí přes 200 ETF. Není to tedy čistě lokální hráč jako dřív, ale poplatková struktura a zaměření pořád míří spíš na konzervativního českého investora než na někoho, kdo chce levně a masově nakupovat zahraniční ETF.",
      "Hlavní odlišnost Fia je kombinace bankovní důvěryhodnosti a daňového komfortu pro české papíry. Poplatky za nákup zahraničních ETF jsou ale vyšší než u DEGIRO, XTB nebo Trading 212."
    ],
    "feesText": [
      "Ceník účinný od 1. 7. 2026 přešel u evropských trhů z procenta na pevné částky. Evropské ETF (typicky irské UCITS fondy, které Češi kupují nejčastěji) na burze XETRA stojí 3,95 EUR za pokyn do objemu 1 400 EUR, 4,95 EUR do 3 000 EUR a nad tuto hranici 0,15 % s minimem 6,95 EUR. Při nákupu za 5 000 Kč tak zaplatíte necelá 2 % vstupního nákladu, při nákupu za 35 000 Kč už jen kolem 0,3 %. Za české ETF na BCPP je to 0,29–0,35 % s minimem 40 Kč. Pro srovnání, u XTB nebo Trading 212 kupujete ETF bez poplatku za nákup. Fio proto dává smysl hlavně při větších, méně častých nákupech, ne při pravidelném měsíčním spoření drobných částek.",
      "Měnovou konverzi CZK/EUR nebo CZK/USD provádí Fio bez samostatného poplatku, náklad je ale v kurzu banky (rozdíl nákup/prodej) – u menších částek může být vyšší než 0,5 % přirážka některých konkurentů. Vedení účtu je bez měsíčního poplatku. Klíčová daňová výhoda: dividendy z českých akcií a fondů Fio zdaňuje standardní 15 % sazbou. U zahraničních (zejména amerických) ETF pozor na to, že bez platného potvrzení o daňovém domicilu může u dividend hrozit srážka 30–35 %; irské akumulační ETF dividendy nevyplácejí, takže se vás to netýká. KID dokumentaci a daňové podklady dostanete v češtině, což daňové přiznání citelně zjednodušuje."
    ],
    "faqs": [
      {
        "q": "Kolik reálně zaplatím za nákup evropského ETF u Fia?",
        "a": "Za evropské ETF na burze XETRA platíte pevných 3,95 EUR za pokyn do objemu 1 400 EUR, 4,95 EUR do 3 000 EUR a nad tuto hranici 0,15 % s minimem 6,95 EUR. Protože jde o pevnou částku, u malých nákupů je poplatek relativně nejdražší: z 5 000 Kč ukrojí necelá 2 %, z 35 000 Kč už jen kolem 0,3 %. Za české ETF na pražské burze je to 0,29–0,35 % s minimem 40 Kč."
      },
      {
        "q": "Jak Fio daní dividendy z ETF?",
        "a": "Dividendy z českých akcií a fondů zdaňuje Fio standardní 15 % sazbou. U zahraničních (hlavně amerických) papírů může bez potvrzení o daňovém domicilu hrozit vyšší srážka až 30–35 %. Řešením jsou irské akumulační ETF, které dividendy nevyplácejí a tuto komplikaci obcházejí."
      },
      {
        "q": "Je platforma a podpora v češtině?",
        "a": "Ano. Fio e-Broker je ryze český broker, celá platforma, zákaznická podpora i KID dokumentace jsou v češtině. Infolinka funguje v pracovní dny 9–17 h, k dispozici jsou i pobočky."
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
        "a": "Fio si za směnu neúčtuje samostatný poplatek, náklad je ale v kurzu banky (rozdíl mezi nákupním a prodejním kurzem). Jeho výši ceník neuvádí, proto ho v našich výpočtech ukazujeme jako „—“."
      }
    ]
  },
  "trading212": {
    "tagline": "Broker s mobilní aplikací, nákupem ETF bez provize, částí podílu a automatickým investováním (Pies). Klienty z Česka obsluhuje kyperská entita, podpora jen anglicky.",
    "proKoho": [
      "Posíláte malé pravidelné částky – nákup bez provize, směna 0,15 %",
      "Investujete přesnou částku – část podílu od 1 EUR",
      "Chcete automatické investování – AutoInvest a Pies"
    ],
    "proKohoNe": [
      "Potřebujete podporu v češtině nebo po telefonu – jen anglický chat",
      "Chcete hotovost pojištěnou jako vklad v bance – kryje ji kyperský fond ICF (společný limit max. 20 000 EUR)"
    ],
    "zalozeni": [
      {
        "t": "Registrace a e-mail",
        "d": "Účet založíte na webu nebo v aplikaci a potvrdíte e-mailovou adresu. Je vám aspoň 18 let."
      },
      {
        "t": "Ověření totožnosti v mobilu",
        "d": "Vyfotíte doklad s fotografií a pořídíte selfie. Potvrdíte daňovou rezidenci a daňové identifikační číslo."
      },
      {
        "t": "Vklad a nákup ETF",
        "d": "Pošlete peníze a koupíte ETF – i část podílu, nebo nastavíte automatické investování."
      }
    ],
    "zalozeniZdroj": "https://helpcentre.trading212.com/hc/en-us/articles/35746373810205-Confirming-your-identity-and-tax-details-during-account-setup",
    "intro": [
      "Trading 212 je britsko-kyperský broker založený v roce 2004, který se v Evropě proslavil modelem 0 % poplatků za nákup akcií a ETF. Pro české klienty vystupuje entita Trading 212 Markets Ltd. regulovaná kyperskou CySEC, na pozadí je i britská FCA.",
      "Od klasických brokerů typu DEGIRO nebo Fio se odlišuje důrazem na mobilní aplikaci, frakční investování (část podílu od 1 EUR) a funkce AutoInvest a Pies pro automatizované DCA spoření s automatickým rebalancováním. Pokročilou analytiku pro aktivní obchodování nemá."
    ],
    "feesText": [
      "Reálné náklady českého ETF investora u Trading 212 jsou velmi nízké. Za nákup i prodej akcií a ETF neplatíte žádnou provizi (0 %, bez limitu objemu), vklady i výběry jsou zdarma. Hlavním nákladem je měnová konverze: účet vedete typicky v EUR, takže při vkladu korun z české banky proběhne konverze CZK/EUR s přirážkou 0,15 %. Této konverzi se lze částečně vyhnout posíláním eur, případně vedením účtu přímo v EUR a nákupem ETF v původní měně.",
      "Z daňového hlediska je zásadní volba správného ETF. U akumulačních (accumulating) ETF s domicilem v Irsku se dividenda reinvestuje uvnitř fondu a řeší se pouze zdanění při prodeji (v ČR lze využít časový nebo hodnotový test na osvobození). U distribučních ETF Trading 212 dividendy nezdaňuje sám a nesráží žádný vlastní poplatek za výplatu, ale u amerických akcií bez vyplněného formuláře W-8BEN hrozí srážka 30 % místo 15 %. Proto českým investorům obvykle dává největší smysl irský akumulační ETF (např. na index S&P 500 nebo celý svět), kde odpadá řešení 15 vs. 35 % srážkové daně z dividend a náklady se blíží nule."
    ],
    "faqs": [
      {
        "q": "Má Trading 212 češtinu a českou podporu?",
        "a": "Ne. Aplikace ani zákaznická podpora nejsou v češtině – komunikace probíhá anglicky a chybí telefonická linka. Podpora funguje přes chat a e-mail. Pokud potřebujete česky mluvící podporu, zvažte XTB nebo Fio."
      },
      {
        "q": "Jaký je minimální vklad u Trading 212?",
        "a": "Vklad začíná od 1 EUR. Díky nákupu části podílu koupíte ETF i za malou částku."
      },
      {
        "q": "Jak se u Trading 212 daní dividendy z ETF?",
        "a": "Trading 212 sám nesráží žádný poplatek za výplatu dividend, ale u amerických akcií bez vyplněného formuláře W-8BEN hrozí srážka 30 % místo 15 %. Nejjednodušší je zvolit irský akumulační ETF, kde se dividendy reinvestují uvnitř fondu a řešíte jen případnou daň při prodeji podle českého časového/hodnotového testu."
      },
      {
        "q": "Kolik platím za měnovou konverzi z korun?",
        "a": "Vkládáte-li koruny na EUR účet, Trading 212 účtuje konverzní přirážku 0,15 %. Nákup a prodej samotného ETF je bez provize. Konverzi lze minimalizovat posíláním eur nebo držením zůstatku v měně, ve které ETF nakupujete."
      },
      {
        "q": "Co je lending program a je bezpečný?",
        "a": "Trading 212 může vaše akcie automaticky půjčovat třetím stranám (securities lending). V krizích to teoreticky zvyšuje protistranové riziko dostupnosti akcií. Program lze v nastavení účtu vypnout – nastavení si zkontrolujte, nové pozice se mohou zapojovat automaticky."
      },
      {
        "q": "Lze převést ETF od jiného brokera na Trading 212?",
        "a": "Trading 212 dlouhodobě nenabízí standardní příchozí převod cenných papírů (transfer in) jako DEGIRO nebo Interactive Brokers. V praxi se pozice u starého brokera prodají a prostředky se převedou jako hotovost, což může mít daňové důsledky. Před přechodem si tuto možnost ověřte přímo v podpoře."
      }
    ]
  },
  "ibkr": {
    "tagline": "Americký broker kótovaný na Nasdaq, české klienty obsluhuje irská entita. Akcie a ETF na 175+ trzích a levná směna u větších částek, bez češtiny a s rozhraním pro pokročilé.",
    "proKoho": [
      "Chcete trhy celého světa – akcie a ETF na 175+ trzích",
      "Nakupujete větší částky – 0,05 % z objemu, min. 1,25 EUR",
      "Směňujete koruny najednou za větší částku – 0,002 %, min. 2 USD za směnu"
    ],
    "proKohoNe": [
      "Posíláte malé částky – minimum 1,25 EUR za nákup a 2 USD za směnu",
      "Potřebujete podporu v češtině – jen anglicky",
      "Začínáte a chcete jednoduchou aplikaci – rozhraní je pro pokročilé"
    ],
    "zalozeni": [
      {
        "t": "Online žádost",
        "d": "Na interactivebrokers.ie vyplníte e-mail, uživatelské jméno a osobní údaje, finanční profil a investiční zkušenosti."
      },
      {
        "t": "Ověření totožnosti",
        "d": "Doložíte doklad s fotografií a daňové identifikační číslo; ověření probíhá v Client Portalu."
      },
      {
        "t": "Vklad a nákup ETF",
        "d": "Pošlete peníze převodem z banky. Obchodovat můžete po jejich připsání."
      }
    ],
    "zalozeniZdroj": "https://www.ibkrguides.com/appguide/individual-application.htm",
    "intro": [
      "Interactive Brokers (IBKR) je americký broker kótovaný na Nasdaq. Míří hlavně na zkušenější investory.",
      "Pro české klienty smlouvu uzavírá evropská entita Interactive Brokers Ireland Ltd. regulovaná irskou centrální bankou (CBI), zatímco mateřská firma podléhá americkému SEC/FINRA. IBKR nabízí přístup na 175+ trhů po celém světě – akcie, ETF, opce, futures, dluhopisy, forex i komodity.",
      "Od konkurence se odlišuje především šíří nabídky, nízkými transakčními náklady u velkých objemů a velmi levnou měnovou konverzí (0,002 %). Naopak platforma TWS je nástroj pro pokročilé a broker nenabízí českou lokalizaci ani českou podporu."
    ],
    "feesText": [
      "Reálné náklady českého investora: evropské (UCITS) ETF stojí v cenovém plánu Tiered 0,05 % hodnoty s minimem 1,25 EUR plus poplatky burzy, v plánu Fixed minimálně 3 EUR. Americké ETF retailoví investoři z EU nekoupí (chybí jim dokument KID). U větších objemů je to velmi levné, ale u malých pravidelných nákupů (např. 100 EUR měsíčně) je minimum 1,25 EUR znát (1,25 %). Konverze měn stojí 0,002 %, ale nejméně 2 USD – u vkladu 5 000 Kč tedy kolem 0,9 %. Minimální vklad je 0 USD (zrušen v roce 2021) a IBKR neúčtuje poplatky za neaktivitu.",
      "Měnová konverze stojí 0,002 % objemu s minimem 2 USD za jednu směnu. Koruny nemusíte směňovat při každém nákupu: na účtu můžete držet hotovost ve více měnách, směnit jednou větší částku a z ní nakupovat postupně – minimum 2 USD pak zaplatíte jen jednou. U malých jednorázových směn minimum převáží (DEGIRO má směnu CZK/EUR zdarma). Dividendy z českých akcií IBKR drží na sběrném (omnibus) účtu, proto se z nich sráží 35 %; vratku lze žádat jen individuálně u finančního úřadu. U irských UCITS ETF se srážka z amerických dividend řeší uvnitř fondu a formulář W-8BEN se vás netýká – ten je pro přímo držené americké akcie. Přístup k některým tržním datům je zpoplatněn (1–45 USD měsíčně podle typu)."
    ],
    "faqs": [
      {
        "q": "Řeší se u IBKR srážka z amerických dividend (W-8BEN)?",
        "a": "U irských UCITS ETF ne – srážku z amerických dividend řeší fond uvnitř a formulář W-8BEN se vás netýká. Ten je potřeba jen pro přímo držené americké akcie. Jinak je to u dividend z českých akcií: IBKR je drží na sběrném účtu a sráží z nich 35 %."
      },
      {
        "q": "Jaká je ochrana mých peněz u IBKR pro českého klienta?",
        "a": "Český klient má smlouvu s evropskou entitou Interactive Brokers Ireland Ltd., na kterou se vztahuje irský kompenzační systém ICCL – 90 % ztráty, nejvýš 20 000 EUR. Slavné SIPC pojištění do 500 000 USD kryje pouze americkou entitu, nikoliv evropské klienty. Aktiva jsou navíc vedena odděleně (segregovaně)."
      },
      {
        "q": "Kolik stojí konverze korun na dolary nebo eura?",
        "a": "Směna stojí 0,002 % objemu, nejméně 2 USD za jednu směnu. Na účtu můžete držet hotovost ve více měnách – stačí směnit jednou větší částku a z ní nakupovat postupně, minimum 2 USD pak platíte jen jednou."
      },
      {
        "q": "Je Interactive Brokers dostupný v češtině?",
        "a": "Ne. IBKR nenabízí českou lokalizaci platformy ani českou zákaznickou podporu – vše probíhá v angličtině. Pokud potřebujete komunikovat a investovat česky, vhodnější jsou XTB, Fio nebo Portu."
      },
      {
        "q": "Je nutný minimální vklad?",
        "a": "Ne, minimální vklad byl zrušen v roce 2021 a je 0 USD. IBKR také neúčtuje žádné poplatky za neaktivitu, takže účet můžete mít i s malým zůstatkem."
      },
      {
        "q": "Kolik zaplatím za nákup ETF?",
        "a": "U evropských (UCITS) ETF v plánu Tiered 0,05 % hodnoty s minimem 1,25 EUR plus poplatky burzy, v plánu Fixed minimálně 3 EUR. Americké ETF retailoví investoři z EU nekoupí (chybí KID). U větších objemů jsou náklady velmi nízké, u malých pravidelných nákupů se ale minimální poplatek projeví."
      }
    ]
  },
  "portu": {
    "tagline": "Český robo-poradce pod dohledem ČNB: portfolio z ETF sestaví a spravuje za vás za roční poplatek z celé hodnoty.",
    "proKoho": [
      "Nechcete fondy vybírat ani hlídat – portfolio sestaví a rebalancuje Portu",
      "Začínáte s malou částkou – minimální vklad 500 Kč",
      "Chcete vše česky – aplikace i podpora"
    ],
    "proKohoNe": [
      "Chcete koupit konkrétní ETF – dostanete hotové portfolio podle profilu",
      "Hlídáte náklady – roční poplatek 0,24–1 % z celé hodnoty každý rok",
      "Chcete aktivně obchodovat – Portu není broker"
    ],
    "zalozeni": [
      {
        "t": "Registrace a dotazník",
        "d": "Vyplníte investiční dotazník: znalosti, zkušenosti a rizikový profil."
      },
      {
        "t": "Ověření totožnosti",
        "d": "Doplníte osobní údaje a nahrajete nebo vyfotíte dva doklady totožnosti."
      },
      {
        "t": "První vklad",
        "d": "Pošlete první vklad, nebo rovnou nastavíte trvalý příkaz."
      }
    ],
    "zalozeniZdroj": "https://o.portu.cz/jak-to-funguje/",
    "intro": [
      "Portu je česká automatizovaná investiční platforma (robo-advisor), kterou v roce 2017 spustila skupina WOOD & Company. Je regulována ČNB. Na rozdíl od klasických brokerů jako DEGIRO, XTB nebo Interactive Brokers si u Portu nekupujete konkrétní ETF sami – vyplníte investiční dotazník, zvolíte rizikový profil a Portu za vás sestaví a průběžně rebalancuje hotové portfolio složené z ETF fondů.",
      "Právě v tom spočívá zásadní odlišnost: Portu není nástroj pro výběr ETF, ale služba, která rozhodování přebírá za vás. To je jeho největší přednost i největší omezení zároveň. Kdo chce sám vybrat konkrétní fond (třeba VWCE nebo iShares Core MSCI World) a koupit ho na burze za pár korun, je u brokera lépe. Kdo se ale rozhodování a údržbě portfolia chce úplně vyhnout, dostane u Portu vše v češtině, s minimem vkladu 500 Kč a bez starostí o daně z prodejů uvnitř portfolia."
    ],
    "feesText": [
      "Klíčové je pochopit, že Portu má zcela jinou nákladovou logiku než broker. Neplatíte poplatek za jednotlivý nákup ETF, ale roční správcovský poplatek z celého objemu portfolia – maximálně 1 % ročně, s klesající sazbou podle výše investice: 1 % do 500 000 Kč, 0,8 % do 1 milionu, 0,6 % do 5 milionů a 0,4 % nad 5 milionů. K tomu lze získat slevu za fixaci (závazek nevybírat) až 40 %, takže úplné minimum je 0,24 % ročně; běžné portfolio do půl milionu vyjde na 0,6–1 % podle délky fixace. Tento poplatek je all-inclusive: pokrývá automatický rebalancing i měnové konverze mezi CZK a měnou fondů, takže žádný samostatný FX poplatek (na rozdíl od XTB s 0,5 % nebo IBKR s 0,002 %) neřešíte. Vstupní ani výstupní poplatky Portu neúčtuje.",
      "S rostoucím a hlavně dlouhodobě drženým majetkem se roční procento nasčítá do výrazně vyšších nákladů než u přímého nákupu jednoho akumulačního ETF u brokera. Na straně daní má Portu praktickou výhodu: dividendy z podkladových fondů podléhají srážkové dani jen 15 % (Portu je řeší přes český daňový režim), zatímco u DEGIRO nebo XTB může u některých ETF hrozit 35 % srážka. Pro dlouhodobého českého investora navíc platí, že zisk z prodeje po splnění tříletého časového testu (nebo do ročního limitu 100 000 Kč) je od daně z příjmů osvobozen."
    ],
    "faqs": [
      {
        "q": "Vybírám si u Portu konkrétní ETF sám?",
        "a": "Ne. Portu je robo-advisor – podle vyplněného dotazníku a zvoleného rizikového profilu za vás sestaví hotové portfolio složené z ETF fondů a samo ho rebalancuje. Konkrétní fond (např. VWCE) si sami nekoupíte; pokud to chcete, potřebujete klasického brokera."
      },
      {
        "q": "Kolik u Portu reálně zaplatím na poplatcích?",
        "a": "Platíte roční správcovský poplatek z objemu portfolia: 1 % do 500 000 Kč, 0,8 % do 1 milionu, 0,6 % do 5 milionů a 0,4 % nad 5 milionů. Sleva za fixaci (závazek nevybírat) sazbu sníží až o 40 %, takže absolutní minimum je 0,24 % a běžné portfolio do půl milionu vyjde na 0,6–1 %. V poplatku je zahrnut rebalancing i měnová konverze. Vstupní ani výstupní poplatky nejsou. Pozor: procento se platí každý rok znovu z celé částky."
      },
      {
        "q": "Jak jsou u Portu zdaněny dividendy a zisky?",
        "a": "Dividendy z podkladových fondů podléhají srážkové dani 15 % (výhodnější než 35 % hrozících u některých ETF u zahraničních brokerů). Zisk z prodeje je pro fyzické osoby osvobozen po splnění tříletého časového testu nebo do ročního limitu příjmů z prodeje 100 000 Kč."
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
  }
};

export function getBrokerContent(id: string): BrokerContent | null {
  return brokerContent[id] ?? null;
}
