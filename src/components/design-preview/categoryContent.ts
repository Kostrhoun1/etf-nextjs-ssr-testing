/* Per-kategorii REDAKČNÍ obsah pro detaily žebříčků (nový design).
 *
 * Cíl: každá kategorie má vlastní hodnotu (intro, verdikt, pro koho, rizika, FAQ),
 * aby stránky NEBYLY generické – to je klíč k indexaci v Google.
 * Datově řízené části (tabulky, žebříčky) rendruje šablona sama.
 * Obsah 36 kategorií vygenerován redakčními agenty z původních stránek; S&P 500 ručně.
 *
 * Klíč = slug kategorie (shodný s categoryConfigs v src/lib/etf-data.ts).
 */

export interface CategoryFaq {
  q: string;
  a: string;
}

export interface CategoryContent {
  introTitle: string;
  intro: string[];
  verdict: string[];
  forWhom: string;
  risks: string[];
  faqs: CategoryFaq[];
}

export const categoryContent: Record<string, CategoryContent> = {
  "nejlepsi-sp500-etf": {
    "introTitle": "Co je index S&P 500?",
    "intro": [
      "S&P 500 sdružuje zhruba 500 největších veřejně obchodovaných firem v USA a pokrývá kolem 80 % hodnoty amerického akciového trhu. Je vážený podle tržní kapitalizace, takže největší firmy (Apple, Microsoft, Nvidia a další) mají největší váhu.",
      "Pro českého investora je S&P 500 nejjednodušší způsob, jak vlastnit americkou ekonomiku jedním fondem. ETF na tento index patří k nejlevnějším a nejlikvidnějším na světě – poplatky (TER) začínají už na 0,03 % ročně."
    ],
    "verdict": [
      "Pro dlouhodobé investory dává největší smysl akumulační, fyzicky replikovaný fond s irským domicilem a nízkým TER – daně a reinvestice dividend pak řeší fond za vás. Konkrétní pořadí najdete v tabulce a žebříčcích níže; rozdíly v nákladech jsou mezi hlavními fondy malé, rozhoduje spíš likvidita u vašeho brokera a měna obchodování."
    ],
    "forWhom": "S&P 500 se hodí pro dlouhodobého investora, který chce jednoduše a levně růst americké ekonomiky a snese výkyvy čistě akciového portfolia. Kdo chce širší diverzifikaci, může kombinovat s celosvětovým ETF nebo rozvíjejícími se trhy.",
    "risks": [
      "Koncentrace do USA a do několika technologických gigantů – při jejich propadu klesá celý index.",
      "Měnové riziko: fond kotuje v USD, český investor nese pohyb USD/CZK vždy (i u „EUR hedged\" tříd je zajištění jen do EUR, ne do koruny).",
      "Čistě akciové riziko – v krizích historicky poklesy o 30–55 %."
    ],
    "faqs": [
      {
        "q": "Který S&P 500 ETF je nejlevnější?",
        "a": "Nejnižší TER u S&P 500 ETF se pohybuje kolem 0,03 % ročně. Aktuální pořadí podle nákladovosti najdete v žebříčku „Nejlevnější (TER)\" na této stránce."
      },
      {
        "q": "Je lepší akumulační, nebo distribuční S&P 500 ETF?",
        "a": "Pro dlouhodobé zhodnocení bývá jednodušší akumulační fond – dividendy reinvestuje sám a nemusíte je danit ani ručně reinvestovat. Distribuční se hodí, pokud chcete pravidelný příjem."
      },
      {
        "q": "Jak se v ČR daní zisk z S&P 500 ETF?",
        "a": "Zisk z prodeje je po splnění tříletého časového testu osvobozen od daně (od roku 2026 bez horního limitu). U dividend z distribučních fondů se uplatní srážková daň podle domicilu fondu."
      },
      {
        "q": "Proč volit irský domicil fondu?",
        "a": "Irské UCITS ETF mají s USA daňovou smlouvu, díky které se z amerických dividend uvnitř fondu strhává 15 % místo 30 %. Nemusíte navíc řešit formulář W-8BEN."
      }
    ]
  },
  "nejlepsi-ai-etf": {
    "introTitle": "AI ETF: jak investovat do umělé inteligence přes jeden fond",
    "intro": [
      "AI ETF jsou tematické akciové fondy, které sdružují firmy vydělávající na umělé inteligenci, strojovém učení, zpracování velkých dat, robotice a automatizaci. Nejde o samostatnou třídu aktiv, ale o zúžený výřez z technologického a průmyslového sektoru. Podle konkrétního indexu tak v portfoliu najdete výrobce čipů a AI hardwaru (NVIDIA, AMD, TSMC, Broadcom), softwarové a cloudové giganty (Microsoft, Alphabet, Meta, ServiceNow, Palantir) i firmy z oblasti průmyslové automatizace a robotiky (ABB, Keyence, Fanuc). Řada z nich se zároveň objevuje i v běžných světových a technologických ETF, takže AI ETF v praxi znamená hlavně vyšší koncentraci a vyšší poplatek za tematické zaměření.",
      "Nabídka na evropském trhu je poměrně malá a ovládá ji několik fondů. Největším je Xtrackers Artificial Intelligence & Big Data UCITS ETF (ISIN IE00BGV5VN51, ticker XAIX) se jměním přes 5 miliard eur a TER 0,35 %. Následuje iShares Automation & Robotics UCITS ETF (IE00BYZK4552, RBOT) s TER 0,40 %, orientovaný spíš na automatizaci a robotiku napříč sektory, a čistě AI zaměřený L&G Artificial Intelligence UCITS ETF (IE00BK5BCD43, AIAI) s TER 0,49 %. Všechny jsou v UCITS obalu s irským domicilem, obchodují se na evropských burzách (Xetra, Euronext, LSE) a jsou běžně dostupné u brokerů jako DEGIRO, XTB, Trading 212 nebo Interactive Brokers.",
      "Pro českého investora je klíčové, že tyto fondy jsou denominované a zpravidla podkladově v amerických akciích, takže i při nákupu v eurech nesete kurzové riziko dolaru vůči koruně. Samotné AI ETF v korunách nekoupíte; broker vám nákup přepočítá z CZK do EUR nebo USD a účtuje si na tom měnovou konverzi. To je náklad navíc k TER, se kterým je potřeba u tematických fondů počítat."
    ],
    "verdict": [
      "U AI ETF dává pro dlouhodobého investora smysl akumulační (accumulating) třída s irským domicilem. Akumulace znamená, že fond dividendy sám reinvestuje, takže nemusíte řešit každoroční zdanění drobných výplat a využijete efekt složeného úročení; u růstově laděného tématu, kde je dividendový výnos stejně nízký, je to prakticky vždy lepší volba. Irský domicil pak snižuje srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 %, což u portfolia plného amerických akcií reálně zvyšuje výnos. Zmíněný Xtrackers XAIX i L&G AIAI jsou akumulační, právě proto je většina investorů preferuje.",
      "Při výběru sledujte hlavně velikost fondu, TER a to, jak čistě index odpovídá tomu, co od AI čekáte. Větší fond (nad 1 miliardu eur) je likvidnější, má užší rozpětí nákup/prodej a nižší riziko zrušení. TER se u AI ETF pohybuje zhruba 0,35 až 0,50 % ročně, tedy násobně výš než u širokého světového indexu kolem 0,20 %; za tematické zaměření tak platíte prémii. Zásadní je i konstrukce indexu: iShares RBOT je vážený spíš na automatizaci a robotiku a má menší podíl amerických megacapů, zatímco XAIX a AIAI jsou blíž klasickému AI a softwarovému příběhu. Než fond koupíte, projděte si prvních deset pozic; často zjistíte, že se z velké části překrývají s tím, co už máte ve světovém nebo technologickém ETF."
    ],
    "forWhom": "AI ETF se hodí pro investory s delším horizontem (ideálně 10 a více let), vyšší tolerancí k výkyvům a jádrem portfolia už postaveným na širokém indexu, ke kterému chtějí přidat tematickou sázku na umělou inteligenci. Rozumná pozice je 5 až 10 % portfolia jako doplněk, ne základ. Nehodí se pro začátečníky, kteří teprve budují první portfolio, pro konzervativní investory s krátkým horizontem a pro každého, kdo by po prudkém propadu AI akcií panicky prodával; tematické fondy umí klesnout o desítky procent rychleji než široký trh.",
    "risks": [
      "Vysoká koncentrace a překryv. AI ETF drží relativně malý počet firem a jejich horní pozice (NVIDIA, Microsoft, Alphabet) často tvoří velkou část fondu. Tytéž akcie už navíc obvykle máte ve světovém i technologickém ETF, takže si nákupem AI ETF nevědomky zdvojujete stejnou sázku.",
      "Riziko nafouknuté valuace a tematické bubliny. Ceny AI akcií rostly po roce 2023 velmi rychle a nesou v sobě vysoká očekávání budoucího růstu. Pokud realita zaostane, mohou tematické fondy padat prudčeji a hlouběji než široký trh a zotavovat se roky.",
      "Vyšší náklady a měnové riziko. TER kolem 0,35 až 0,50 % ukrajuje z výnosu víc než u širokých ETF. K tomu se přidává kurzové riziko dolaru vůči koruně a poplatek za měnovou konverzi CZK do EUR/USD při každém nákupu.",
      "Riziko definice indexu a přeskupení. Neexistuje jednotná definice, co je AI firma. Poskytovatelé indexů pravidla mění a fondy periodicky přeskupují složení, takže dva AI ETF se stejným jménem mohou obsahovat výrazně odlišné firmy a chovat se jinak."
    ],
    "faqs": [
      {
        "q": "Jaké jsou největší AI ETF dostupné pro českého investora?",
        "a": "Největším je Xtrackers Artificial Intelligence & Big Data UCITS ETF (ISIN IE00BGV5VN51, ticker XAIX) se jměním přes 5 miliard eur a TER 0,35 %. Následuje iShares Automation & Robotics (IE00BYZK4552) s TER 0,40 % a čistě AI zaměřený L&G Artificial Intelligence (IE00BK5BCD43) s TER 0,49 %. Všechny se obchodují na evropských burzách a jsou dostupné u běžných brokerů."
      },
      {
        "q": "Nemám AI akcie už ve svém světovém ETF?",
        "a": "Nejspíš ano. NVIDIA, Microsoft, Alphabet, Meta i Broadcom patří k největším pozicím v indexech jako MSCI World nebo S&P 500, takže velkou část AI příběhu už držíte i bez tematického fondu. AI ETF vám dodá jen vyšší koncentraci na tyto firmy a přidá menší specializované hráče. Právě proto ho berte jako doplněk, ne náhradu jádra portfolia."
      },
      {
        "q": "Mám vybrat akumulační, nebo distribuční AI ETF?",
        "a": "Pro dlouhodobé budování majetku je vhodnější akumulační třída, která dividendy sama reinvestuje a nemusíte je každý rok danit. U AI ETF je to o to jednodušší, že dividendový výnos je stejně nízký a hlavní roli hraje růst ceny. Distribuční verzi volte jen tehdy, pokud aktivně chcete pravidelnou výplatu."
      },
      {
        "q": "Jak se AI ETF daní v Česku?",
        "a": "Zisk z prodeje podílů je v Česku osvobozen, pokud fond držíte déle než 3 roky (časový test), nebo pokud roční objem prodejů nepřesáhne 100 000 Kč. U kratšího držení nad tento limit se zisk daní jako ostatní příjem. Případné vyplacené dividendy (u distribučních tříd) se zdaňují vždy; akumulační fond tuto starost odpadá, protože nic nevyplácí."
      },
      {
        "q": "Kolik portfolia je rozumné dát do AI ETF?",
        "a": "Jako tematická sázka by AI ETF neměl tvořit víc než zhruba 5 až 10 % portfolia. Zbytek je vhodné mít v širokém světovém indexu, který nese menší riziko a nižší poplatky. Vyšší alokace znamená, že celkový výsledek vašeho portfolia bude silně záviset na jednom úzkém tématu."
      },
      {
        "q": "Proč mají AI ETF vyšší poplatky než světové ETF?",
        "a": "TER u AI ETF se pohybuje zhruba 0,35 až 0,50 % ročně, zatímco u širokého světového indexu bývá kolem 0,20 %. Za tematickými fondy stojí specializovaná konstrukce indexu, častější přeskupování a menší objem spravovaných peněz, což zvyšuje náklady. Tuto prémii platíte za zúžené zaměření, ne za lepší výkonnost."
      }
    ]
  },
  "nejlepsi-americke-etf": {
    "introTitle": "Americké ETF: expozice k největší ekonomice světa",
    "intro": [
      "Americké ETF sledují akciový trh Spojených států, který představuje zhruba 60 až 70 % celosvětové tržní kapitalizace. V praxi znamená investice do amerického ETF podíl na firmách jako Apple, Microsoft, Nvidia, Amazon nebo Alphabet, tedy na společnostech, které stojí za většinou globálních technologických inovací. Nejčastějším benchmarkem v této kategorii jsou index MSCI USA (zhruba 600 až 630 firem large-cap a mid-cap) a index S&P 500 (500 největších firem). MSCI USA je o něco širší, protože zahrnuje i střední firmy; S&P 500 je klasika zaměřená na největší blue-chip tituly.",
      "Pro českého investora je klíčové, že prakticky všechny relevantní americké ETF jsou dostupné v UCITS podobě s domicilem v Irsku (kód ISIN začínající na IE). To řeší srážkovou daň z amerických dividend na úrovni fondu (irsko-americká smlouva snižuje srážku z 30 % na 15 %) a zbavuje vás povinnosti řešit americký formulář W-8BEN nebo dědickou daň, která hrozí u přímo držených US-domicilovaných fondů. UCITS americká ETF běžně koupíte u brokerů jako DEGIRO, XTB, Trading 212 nebo Interactive Brokers, často i s frakčním nákupem.",
      "Konkrétně na MSCI USA najdete tři hlavní hráče: iShares MSCI USA Screened (ISIN IE00BFNM3G45), Xtrackers MSCI USA (IE00BJ0KDR00) a Invesco MSCI USA (IE00B60SX170). Poplatky se pohybují mezi 0,05 a 0,07 % ročně, což je řádově levnější než aktivně řízené americké akciové fondy."
    ],
    "verdict": [
      "Pro dlouhodobé budování majetku dává v této kategorii nejlepší smysl akumulační (reinvestiční) fond s irským domicilem a nízkým TER. Akumulační varianta automaticky reinvestuje dividendy uvnitř fondu, takže se nemusíte starat o zdaňování průběžných dividend a využijete efekt složeného úročení; u českého investora navíc odpadá administrativa s ročním daňovým přiznáním k dividendám. Distribuční verzi volte jen tehdy, pokud cíleně chcete pravidelnou výplatu (například v rentiérské fázi).",
      "Z hlediska nákladů a likvidity je rozumné držet se velkých fondů (ideálně nad 1 mld. EUR) s TER do 0,15 %. Invesco MSCI USA má nejnižší poplatek 0,05 %, iShares a Xtrackers nabízejí 0,07 % a obvykle vyšší objem a likviditu na evropských burzách. Pokud vám záleží na vyloučení kontroverzních sektorů (zbraně, tabák), vybírejte verze s přívlastkem Screened nebo ESG; počítejte ale s tím, že mírně mění složení oproti čistému MSCI USA. Rozdíl mezi MSCI USA a S&P 500 je pro většinu investorů druhořadý, protože oba indexy se z 90 % překrývají a dlouhodobě dávají velmi podobný výnos."
    ],
    "forWhom": "Americké ETF se hodí investorovi, který chce jádrovou expozici k nejsilnější a nejinovativnější ekonomice světa a je ochoten držet ho roky až desítky let. Je vhodné jako významná složka portfolia i jako samostatná sázka na USA pro toho, kdo věří americkému trhu více než zbytku světa. Méně vhodné je pro úplného začátečníka, který hledá jediný maximálně diverzifikovaný fond (tomu obvykle lépe poslouží celosvětové ETF typu MSCI World nebo All-World), a pro investory s krátkým horizontem nebo nízkou tolerancí ke kolísání kurzu dolaru.",
    "risks": [
      "Koncentrace do několika technologických gigantů: největší tituly (Apple, Microsoft, Nvidia a spol.) tvoří v MSCI USA i S&P 500 velmi vysoký podíl. Není to tedy tak rozložené, jak by se u indexu se stovkami firem mohlo zdát, a případný pokles tech sektoru se propíše výrazně.",
      "Měnové riziko USD/CZK: fondy jsou denominované v dolarech. Posílení koruny vůči dolaru vám sníží výnos v korunách i tehdy, když index roste. Zajištěné (CZK-hedged) varianty amerických ETF prakticky nejsou dostupné a hedging by navíc zvýšil náklady.",
      "Sázka na jeden region: čistě americké ETF neobsahuje Evropu ani rozvíjející se trhy. V období, kdy USA zaostávají za zbytkem světa (jak se dělo v některých dekádách), ponesete plné náklady této koncentrace.",
      "Vysoké ocenění trhu: americké akcie se dlouhodobě obchodují za vyšší násobky zisků než jiné regiony, což může znamenat nižší budoucí očekávané výnosy a vyšší citlivost na zklamání z výsledků."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi ETF na MSCI USA a na S&P 500?",
        "a": "S&P 500 sleduje 500 největších amerických firem, MSCI USA jich pokrývá zhruba 600 až 630, protože zahrnuje i střední společnosti (mid-cap). V praxi se oba indexy z velké části překrývají a jejich dlouhodobé výnosy jsou velmi podobné. MSCI USA je o něco širší, S&P 500 je nejznámější a nejlikvidnější benchmark."
      },
      {
        "q": "Které americké ETF má nejnižší poplatky?",
        "a": "Z hlavních fondů na MSCI USA má nejnižší TER Invesco MSCI USA (IE00B60SX170) s 0,05 % ročně. iShares MSCI USA Screened (IE00BFNM3G45) a Xtrackers MSCI USA (IE00BJ0KDR00) mají 0,07 %. Všechny tři jsou řádově levnější než aktivně řízené americké akciové fondy."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční variantu?",
        "a": "Pro dlouhodobé spoření je praktičtější akumulační fond, který dividendy reinvestuje uvnitř a nevyžaduje jejich průběžné danění v přiznání. Distribuční variantu zvolte, pokud chcete pravidelnou výplatu peněz, například v rentiérské fázi. U dividend z distribučních fondů počítejte s tím, že je v ČR musíte zdanit."
      },
      {
        "q": "Jak se americké ETF daní pro českého investora?",
        "a": "U kapitálového zisku z prodeje ETF platí v ČR časový test: pokud cenný papír držíte déle než 3 roky, je zisk osvobozen od daně z příjmů. Díky irskému domicilu fondů řešíte srážkovou daň z amerických dividend na úrovni fondu a nemusíte podávat americké formuláře. U akumulačních fondů navíc odpadá průběžné danění dividend."
      },
      {
        "q": "Je lepší americké ETF, nebo rovnou celosvětové?",
        "a": "Záleží na tom, jak moc chcete sázet na jeden region. Celosvětové ETF (MSCI World nebo FTSE All-World) je diverzifikovanější a už dnes obsahuje kolem 60 až 70 % USA. Čistě americké ETF dává smysl, když chcete USA vědomě zvýraznit, nebo si stavíte portfolio z více regionálních cihel. Pro jednoduchost a jediný fond bývá vhodnější celosvětové řešení."
      },
      {
        "q": "Co znamená Screened verze amerického ETF?",
        "a": "Screened (nebo ESG) verze vylučují ze složení firmy z kontroverzních oblastí, typicky výrobce zbraní, tabáku či fondy porušující určité normy. Výsledné složení se tak mírně liší od čistého indexu MSCI USA. Pokud vám na těchto kritériích záleží, vybírejte verzi s přívlastkem Screened; jinak stačí standardní varianta indexu."
      }
    ]
  },
  "nejlepsi-asijsko-pacificke-etf": {
    "introTitle": "Asijsko-pacifické ETF: rozvinutá Asie a Pacifik mimo Japonsko",
    "intro": [
      "Asijsko-pacifická ETF pokrývají rozvinuté trhy regionu Asie a Pacifiku, ovšem téměř vždy s výjimkou Japonska (v názvu fondu poznáte podle přípony ex Japan). Japonsko je totiž samo o sobě tak velké, že ho indexoví poskytovatelé oddělují do vlastní kategorie. Co tedy v takovém fondu zůstane? Dominuje Austrálie, která tvoří zpravidla polovinu až šedesát procent portfolia, dále následuje Hongkong, Singapur a v širších indexech i Tchaj-wan a Jižní Korea. Sektorově je to svět velkých bank (Commonwealth Bank, DBS), těžařů surovin (BHP, Rio Tinto) a v Hongkongu a na Tchaj-wanu i technologií (Tencent, TSMC).",
      "Dvě rodiny indexů se v této kategorii potkávají nejčastěji. MSCI Pacific ex Japan drží kolem 130 firem a je užší, více zaměřený na Austrálii a Hongkong. FTSE Developed Asia Pacific ex Japan je širší, obsahuje řádově stovky titulů a přidává i Tchaj-wan a Koreu. Pro českého investora jsou obě varianty dostupné jako evropské UCITS ETF (irský domicil, ISIN začínající na IE) přes běžné brokery jako DEGIRO, XTB, Trading 212 nebo Interactive Brokers.",
      "Praktická poznámka pro korunového investora: fondy jsou vedené v USD nebo EUR a podkladová aktiva jsou v australských dolarech, hongkongských dolarech a dalších měnách. Kurzové riziko vůči koruně tu tedy hraje výraznou roli a je vícevrstevné (koruna vs. USD/EUR i vs. lokální asijské měny). Tato kategorie není náhrada za globální fond, ale doplněk pro toho, kdo chce cíleně přiklonit portfolio k Pacifiku."
    ],
    "verdict": [
      "Pro naprostou většinu lidí dává v této kategorii smysl akumulační (Acc) fond s irským domicilem a co nejnižším TER. Irský domicil je klíčový kvůli lepší daňové smlouvě s USA, ale hlavně proto, že jde o standard pro UCITS fondy dostupné v Evropě; akumulační třída zase automaticky reinvestuje dividendy, takže se nemusíte starat o zdaňování průběžných výplat. Australské a singapurské banky přitom vyplácejí nadprůměrné dividendy, takže u distribučních tříd byste jinak řešili daň z relativně vysokého dividendového výnosu každý rok.",
      "Konkrétně se v kategorii dlouhodobě drží iShares Core MSCI Pacific ex Japan (ISIN IE00B52MJY50, TER 0,20 %) jako největší a nejlikvidnější volba a Vanguard FTSE Developed Asia Pacific ex Japan (ISIN IE00B9F5YL18, TER 0,15 %) jako širší a nejlevnější varianta. Preferujte fond s dostatečnou velikostí (řádově miliardy EUR) a čistým, plně replikujícím indexem bez pákových, sektorových nebo faktorových přívlastků v názvu. ESG/SRI varianty (např. UBS MSCI Pacific SRI) jsou legitimní volba, ale mění složení a bývají dražší, proto je berte jako vědomé rozhodnutí, ne jako výchozí bod."
    ],
    "forWhom": "Hodí se pro investory, kteří už mají jádro portfolia v globálním nebo americkém ETF a chtějí ho cíleně doplnit o rozvinutý Pacifik, případně kompenzovat samostatnou pozici v Japonsku (ex Japan fond se s japonským fondem nepřekrývá). Sedne také těm, kdo hledají vyšší dividendový výnos z australských a singapurských bank a vyšší expozici k surovinám. Nehodí se jako jediná nebo hlavní pozice v portfoliu, kvůli malému počtu zemí a silné koncentraci do Austrálie a financí a těžby. Vhodné není ani pro investora, který nechce řešit vícevrstevné kurzové riziko nebo hledá růstové technologie (na ty cílí spíš čistě asijské nebo emerging markets fondy).",
    "risks": [
      "Koncentrace do Austrálie: jedna země běžně tvoří 50 až 60 % fondu, takže výkonnost je silně navázaná na australskou ekonomiku, tamní banky a ceny surovin. Nejde o skutečně širokou diverzifikaci napříč Asií.",
      "Vícevrstevné měnové riziko: fond je v USD/EUR, ale podklad je v AUD, HKD, SGD a dalších měnách. Pro korunového investora to znamená více vrstev kurzového kolísání, které může výnos zvýšit i výrazně srazit nezávisle na pohybu akcií.",
      "Sektorové vychýlení k financím a těžbě: velká váha bank a surovinových firem znamená citlivost na úrokové sazby, ceny komodit a poptávku z Číny. Region tak reaguje jinak než technologicky orientované indexy.",
      "Bez Japonska a bez pevninské Číny: řada investorů čeká pod pojmem Asie růstové čínské a japonské tituly, ty tu ale prakticky nejsou. Expozice k Číně je jen nepřímá přes Hongkong. Vždy si ověřte, co přesně index obsahuje."
    ],
    "faqs": [
      {
        "q": "Proč asijsko-pacifická ETF skoro vždy vynechávají Japonsko?",
        "a": "Japonsko je největší rozvinutý trh regionu a indexoví poskytovatelé (MSCI, FTSE) ho oddělují do samostatné kategorie. Díky tomu si můžete Japonsko dokoupit zvlášť a přesně řídit jeho váhu. Pokud chcete Pacifik i s Japonskem v jednom fondu, hledejte variantu bez přípony ex Japan, těch je ale výrazně méně."
      },
      {
        "q": "Jaký je rozdíl mezi MSCI Pacific ex Japan a FTSE Developed Asia Pacific ex Japan?",
        "a": "MSCI Pacific ex Japan je užší (kolem 130 firem) a více koncentrovaný do Austrálie a Hongkongu. FTSE Developed Asia Pacific ex Japan je širší, obsahuje stovky titulů a přidává i Tchaj-wan a Jižní Koreu. FTSE tak nabízí o něco pestřejší regionální i sektorové složení, MSCI je čistší sázka na rozvinutou část regionu."
      },
      {
        "q": "Kolik je v těchto fondech vlastně Číny?",
        "a": "Přímo pevninská Čína (akcie A-shares) v rozvinutých asijsko-pacifických indexech prakticky není, protože Čína je klasifikovaná jako rozvíjející se trh. Nepřímou expozici získáte přes Hongkong, kde jsou kotované firmy jako Tencent nebo AIA. Kdo chce cílenou čínskou expozici, potřebuje samostatný čínský nebo emerging markets fond."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční variantu?",
        "a": "Pro dlouhodobé budování majetku je obvykle výhodnější akumulační (Acc) třída, protože dividendy reinvestuje automaticky a nemusíte je každý rok danit. To je v této kategorii relevantní, protože australské a singapurské banky vyplácejí nadprůměrné dividendy. Distribuční třídu volte, jen pokud aktivně chcete průběžný příjem."
      },
      {
        "q": "Jak se asijsko-pacifická ETF daní v Česku?",
        "a": "U evropských UCITS ETF platí český daňový režim. Zisk z prodeje je osvobozen od daně, pokud podíly držíte déle než 3 roky (časový test), případně při ročním objemu prodejů do 100 000 Kč. U distribučních fondů se přijaté dividendy daní sazbou 15 %. U akumulačních fondů se dividendy nevyplácejí, takže tuto starost odpadá."
      },
      {
        "q": "Jak velké je u těchto fondů kurzové riziko vůči koruně?",
        "a": "Poměrně velké a vícevrstevné. Fond bývá veden v USD nebo EUR, ale podkladové akcie jsou v australských dolarech, hongkongských dolarech, singapurských dolarech a dalších měnách. Pohyb koruny i pohyby těchto asijských měn tak ovlivní váš výnos v korunách nezávisle na tom, jak si vedou samotné akcie. U regionálního fondu je toto riziko obvykle vyšší než u globálního."
      }
    ]
  },
  "nejlepsi-biotechnologie-etf": {
    "introTitle": "Biotechnologie ETF: sázka na budoucnost medicíny s vysokou volatilitou",
    "intro": [
      "Biotechnologie ETF sdružují firmy, které vyvíjejí léky a léčebné postupy na biologickém základě: genové terapie, imunoterapie, mRNA vakcíny, CRISPR editace genů nebo personalizovanou medicínu. Na rozdíl od širších zdravotnických (healthcare) fondů, kde velkou váhu tvoří stabilní farmaceutické giganty, pojišťovny a výrobci zdravotnických přístrojů, míří čisté biotech fondy na inovativní a růstové společnosti. To znamená vyšší potenciální výnos, ale také mnohem větší kolísání hodnoty.",
      "V rámci UCITS fondů dostupných českému investorovi jsou tři hlavní přístupy. Prvním je široký healthcare innovation fond typu iShares Healthcare Innovation UCITS ETF (ISIN IE00BYZK4776, ticker HEAL), který kombinuje biotech s dalšími inovacemi ve zdravotnictví a je nejméně volatilní z této kategorie. Druhým je čistý americký biotech přes NASDAQ Biotechnology Index, který sledují iShares Nasdaq US Biotechnology (IE00BYXG2H39) a Invesco Nasdaq Biotech (IE00BQ70R696). Třetím jsou úzce zaměřené tematické fondy na genomiku a genové editace, které jsou nejrizikovější.",
      "Pro Čecha jsou tyto fondy prakticky vždy denominované v USD nebo obchodované v EUR, takže kromě sektorového rizika nesete i měnové riziko koruny vůči dolaru. Nejlikvidnější kusy koupíte u XTB, Degiro, Trading 212 nebo Interactive Brokers na německé Xetře či amsterdamské burze. Velikost těchto fondů je řádově v stovkách milionů EUR, tedy výrazně menší než u velkých indexových ETF, což se občas projeví na širším rozpětí nákup/prodej."
    ],
    "verdict": [
      "Pro většinu investorů dává v této kategorii největší smysl akumulační (accumulating) varianta s domicilem v Irsku. Akumulace odloží zdanění dividend a u růstového sektoru, kde stejně nečekáte pravidelný příjem, je to daňově i prakticky výhodnější než distribuční třída. Irský domicil navíc díky smlouvě s USA snižuje srážkovou daň z amerických dividend na 15 %, což je u biotech fondů plných amerických firem podstatné. Sledujte skutečnou čistotu indexu: rozdíl mezi pure-play biotech (NASDAQ Biotechnology) a širším healthcare innovation je zásadní pro to, jak moc bude fond kolísat.",
      "TER se v kategorii pohybuje zhruba mezi 0,35 % a 0,40 % ročně, což je pro tematický sektorový fond přijatelné, byť dráž než globální indexové ETF. Přednost dejte fondům s vyšším objemem majetku (řádově stovky milionů EUR a výše) a slušným denním obratem, protože u malých biotech fondů hrozí širší spread a v krajním případě i zrušení fondu. Jednorázově se dá za nejlevnější a největší považovat iShares Nasdaq US Biotechnology s TER 0,35 %; kdo chce méně divokou jízdu, sáhne po širším healthcare innovation fondu."
    ],
    "forWhom": "Hodí se pro zkušenější investory s dlouhým horizontem (ideálně 10 a více let), kteří rozumí tomu, že sektor umí propadnout o desítky procent a roky se z toho vzpamatovávat. Vhodné jako doplňková, satelitní pozice do maximálně 5 až 10 % portfolia nad rámec široce diverzifikovaného jádra. Rozhodně se nehodí pro začátečníky hledající první ETF, pro investory s krátkým horizontem, pro ty, kdo potřebují pravidelný dividendový příjem, ani pro nikoho, kdo by nervózně prodával při 30 až 50% poklesu.",
    "risks": [
      "Extrémní volatilita a citlivost na klinické studie: neúspěch léku ve fázi III klinického testování dokáže srazit akcie jedné firmy o 50 až 80 % během jediného dne a promítne se i do hodnoty fondu.",
      "Koncentrace a sektorové riziko: fondy jsou zaměřené na jediný obor a často jen na několik desítek firem, kde pár největších titulů (například Gilead, Amgen, Vertex, Regeneron) tvoří velkou část váhy. Chybí odvětvová diverzifikace, kterou má široký index.",
      "Regulační a politické riziko: rozhodnutí amerického úřadu FDA o schválení či zamítnutí léku, tlak na ceny léčiv nebo změny v proplácení zdravotní péče mohou celým sektorem prudce pohnout.",
      "Měnové riziko: fondy drží převážně americké firmy v dolarech. Posílení koruny vůči USD sníží váš výnos v korunách i tehdy, když fond v dolaru vydělá."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi biotechnologie ETF a healthcare ETF?",
        "a": "Healthcare ETF pokrývá celý zdravotnický sektor včetně velkých farma firem, pojišťoven a výrobců přístrojů, je proto stabilnější a méně kolísavý. Biotechnologie ETF míří úžeji na inovativní firmy vyvíjející nové léky a terapie, takže nabízí vyšší růstový potenciál, ale i podstatně větší volatilitu."
      },
      {
        "q": "Které biotech ETF jsou dostupné pro českého investora?",
        "a": "V UCITS formě jsou dostupné hlavně iShares Healthcare Innovation (IE00BYZK4776), iShares Nasdaq US Biotechnology (IE00BYXG2H39) a Invesco Nasdaq Biotech (IE00BQ70R696). Koupíte je na německé Xetře nebo amsterdamské burze přes brokery jako XTB, Degiro, Trading 212 či Interactive Brokers."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční variantu?",
        "a": "U růstového sektoru bez potřeby příjmu dává většinou smysl akumulační (accumulating) třída, protože reinvestuje dividendy automaticky a odkládá jejich zdanění. Distribuční varianta se hodí spíš tomu, kdo cíleně chce pravidelnou výplatu, což ale u biotech fondů není typický důvod investice."
      },
      {
        "q": "Kolik biotech ETF zařadit do portfolia?",
        "a": "Kvůli vysoké volatilitě a sektorové koncentraci se doporučuje držet biotech jako satelitní pozici, zpravidla do 5 až 10 % portfolia. Jádro by mělo tvořit široce diverzifikované celosvětové nebo americké akciové ETF a biotech k němu jen jako doplněk s vyšším rizikem i potenciálem."
      },
      {
        "q": "Jak se v Česku daní zisk z biotech ETF?",
        "a": "Platí stejná pravidla jako u jiných akciových ETF: zisk z prodeje je osvobozen od daně, pokud cenné papíry držíte déle než 3 roky (časový test), nebo pokud roční úhrn příjmů z prodeje nepřekročí zákonný limit. Dividendy z distribučních fondů se v ČR běžně dodaňují; u akumulačních fondů se dividendy reinvestují uvnitř fondu a tuto starost nemáte."
      },
      {
        "q": "Proč jsou biotech fondy menší a méně likvidní než běžná ETF?",
        "a": "Jde o tematický sektor s omezeným počtem firem a menším zájmem než třeba S&P 500, takže objem majetku bývá v stovkách milionů EUR, ne v desítkách miliard. To se může projevit širším rozpětím mezi nákupní a prodejní cenou, proto je vhodné obchodovat v hlavních obchodních hodinách a hlídat spread."
      }
    ]
  },
  "nejlepsi-celosvetove-etf": {
    "introTitle": "Celosvětové ETF: jedním fondem vlastníte kus globální ekonomiky",
    "intro": [
      "Celosvětové (globální) ETF sledují indexy, které v jednom fondu obsahují tisíce firem napříč vyspělými, případně i rozvíjejícími se trhy. Dvě nejrozšířenější řešení mezi českými investory jsou MSCI World (kolem 1 400–1 600 akcií z 23 vyspělých zemí) a FTSE All-World, respektive MSCI ACWI (kolem 3 700–4 300 akcií včetně rozvíjejících se trhů jako Čína, Indie nebo Tchaj-wan). Rozdíl je zásadní hlavně v tom, zda máte v portfoliu i emerging markets: čisté World produkty (IWDA, XMWO, SWDA) je vynechávají, kdežto VWCE nebo EUNL doplněný o emerging markets pokrývá prakticky celý investovatelný svět.",
      "Společným jmenovatelem všech těchto indexů je vysoký podíl USA. Americké firmy dnes tvoří zhruba 60–70 % váhy, následuje Japonsko, Velká Británie a další vyspělé ekonomiky. To znamená, že i \"celosvětový\" fond je z velké části sázka na americký akciový trh a na velké technologické firmy (Apple, Microsoft, Nvidia a spol.). Pro drtivou většinu dlouhodobých investorů je právě jeden široký globální ETF nejrozumnějším jádrem portfolia – řeší diverzifikaci, měnovou i sektorovou pestrost a automatické rebalancování vah podle tržní kapitalizace.",
      "Pro českého investora je dobrá zpráva, že tyto fondy jsou naprosto běžně dostupné u brokerů jako DEGIRO, XTB, Trading 212 nebo Interactive Brokers, často i bez poplatku za nákup. Fondy jsou vedené v EUR nebo USD, ale to neznamená měnové riziko navíc – rozhodující je měnové složení podkladových akcií, ne měna, ve které ETF obchodujete. Do korun se pak výnos přepočítává podle vývoje kurzu, což může výsledek v CZK zvýšit i snížit."
    ],
    "verdict": [
      "Jako jádro dlouhodobého portfolia dává největší smysl akumulační (ACC) varianta s domicilem v Irsku. Akumulace znamená, že se dividendy automaticky reinvestují uvnitř fondu – nemusíte je danit průběžně ani ručně reinvestovat a využíváte plný efekt složeného úročení. Irský domicil je klíčový kvůli daňové smlouvě s USA: fond platí z amerických dividend 15 % srážkové daně místo 30 %, což u globálních fondů s vysokým podílem USA reálně zvyšuje čistý výnos. Poznáte ho podle ISIN začínajícího na IE.",
      "Při konkrétním výběru sledujte hlavně TER (u velkých World/All-World fondů se pohybuje zhruba 0,12–0,22 % ročně), velikost fondu (ideálně jednotky až desítky miliard EUR kvůli likviditě a stabilitě) a tracking difference, tedy jak přesně fond kopíruje index. Nejlevnější bývají čisté MSCI World produkty typu Xtrackers (XMWO) nebo SPDR; komplexnější All-World řešení (VWCE) je o něco dražší, protože obsahuje i rozvíjející se trhy. Rozdíl v TER pár setin procenta je z dlouhodobého hlediska méně důležitý než to, zda vůbec chcete v portfoliu emerging markets, a zda jste schopni fond držet desítky let bez panického prodeje."
    ],
    "forWhom": "Celosvětové ETF jsou ideální pro dlouhodobé investory, kteří chtějí jednoduché, maximálně diverzifikované jádro portfolia a nechtějí spekulovat na jednotlivé regiony či sektory – typicky pro pravidelné měsíční investování a horizont 10 let a více. Skvěle poslouží začátečníkům (jeden fond vyřeší většinu potřeb) i pasivním investorům, kteří ocení nízké poplatky a bezúdržbovost. Méně se hodí pro investory s krátkým horizontem, pro ty, kdo chtějí aktivně sázet na konkrétní region nebo téma, a pro každého, kdo by výrazný pokles trhu neustál a prodával by ve ztrátě.",
    "risks": [
      "Vysoká koncentrace do USA a technologií: 60–70 % váhy v amerických firmách znamená, že propad amerického trhu nebo velkých tech firem stáhne celý \"celosvětový\" fond, i když se jinde daří. Skutečná diverzifikace napříč regiony je nižší, než název napovídá.",
      "Absence rozvíjejících se trhů u čistých World fondů: MSCI World (IWDA, XMWO, SWDA) vynechává Čínu, Indii a další emerging markets. Pokud chcete opravdu celý svět, potřebujete All-World / ACWI řešení (VWCE) nebo doplňkový emerging markets ETF.",
      "Měnové riziko vůči koruně: podkladová aktiva jsou převážně v dolarech a dalších cizích měnách. Posílení koruny může snížit výnos přepočtený do CZK, i když index v původní měně roste.",
      "Riziko chování investora: globální fondy během krizí (2008, 2020) dočasně padaly o desítky procent. Největší reálné riziko není samotný index, ale prodej ve ztrátě v panice a nedodržení dlouhého horizontu."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi MSCI World a FTSE All-World?",
        "a": "MSCI World obsahuje jen vyspělé trhy – zhruba 1 400–1 600 akcií z 23 zemí. FTSE All-World (a podobně MSCI ACWI) přidává i rozvíjející se trhy jako Čínu nebo Indii a čítá kolem 3 700–4 300 akcií. All-World je tedy širší a bližší \"celému světu\", MSCI World je jednodušší a o něco levnější."
      },
      {
        "q": "Stačí mi jeden celosvětový ETF, nebo mám kombinovat víc fondů?",
        "a": "Pro naprostou většinu investorů stačí jeden široký globální fond jako kompletní jádro portfolia – řeší diverzifikaci i rebalancování automaticky. Kombinace regionálních ETF dává smysl jen pokud chcete cíleně upravovat váhy (například posílit emerging markets nad tržní podíl) a jste ochotni to sami hlídat a dorovnávat."
      },
      {
        "q": "Který celosvětový ETF má nejnižší poplatky?",
        "a": "Nejlevnější bývají čisté MSCI World fondy – TER se u nich pohybuje kolem 0,12–0,20 % ročně (například Xtrackers nebo SPDR MSCI World). All-World řešení typu VWCE mají TER kolem 0,22 %, protože obsahují i rozvíjející se trhy. Aktuální čísla najdete v žebříčku podle TER na této stránce."
      },
      {
        "q": "Mám zvolit akumulační, nebo distribuční variantu?",
        "a": "Pro dlouhodobé budování majetku je vhodnější akumulační (ACC) verze – dividendy se reinvestují uvnitř fondu a naplno pracuje složené úročení. Distribuční (DIST) variantu volte, jen pokud chcete pravidelný hotovostní příjem; vyplacené dividendy je pak ale potřeba řešit v daňovém přiznání."
      },
      {
        "q": "Musím platit daně z celosvětového ETF v Česku?",
        "a": "Zisk z prodeje je v ČR osvobozen, pokud ETF držíte déle než 3 roky (časový test), nebo pokud je váš roční objem prodejů pod zákonným limitem. U akumulačních fondů neřešíte průběžné dividendy. Přesné posouzení vždy zvažte podle své situace, případně s daňovým poradcem."
      },
      {
        "q": "Proč je i v celosvětovém ETF tolik amerických akcií?",
        "a": "Indexy váží firmy podle tržní kapitalizace a americké firmy jsou zdaleka největší, proto tvoří 60–70 % váhy. Není to chyba, ale odraz reálné velikosti trhů. Pokud vám vadí taková koncentrace do USA, můžete portfolio doplnit o evropský nebo emerging markets ETF."
      }
    ]
  },
  "nejlepsi-cinske-etf": {
    "introTitle": "Čínské ETF: expozice ke druhé největší ekonomice světa",
    "intro": [
      "Čínské ETF sledují akcie firem z druhé největší ekonomiky světa. Klíčové je pochopit, že čínský trh je rozdělený na dvě části, které se skládají různě. Offshore trh (H-akcie obchodované v Hong Kongu, red chips, P-chips a americké ADR) pokrývají indexy jako MSCI China nebo FTSE China. Onshore trh (A-akcie obchodované přímo v Šanghaji a Šen-čenu) reprezentuje index CSI 300, tedy 300 největších domácích firem. Rozdíl není akademický: MSCI China je silně vážené technologickými giganty typu Alibaba, Tencent nebo PDD, zatímco CSI 300 má daleko větší podíl bank, spotřebního zboží (Kweichow Moutai) a průmyslu. Existují i širší indexy MSCI China All Shares, které kombinují obojí.",
      "Pro českého investora jsou zajímavé hlavně UCITS fondy s evropským domicilem (nejčastěji Irsko), které se obchodují na německých či nizozemských burzách v eurech. Typickými zástupci jsou iShares MSCI China (ISIN IE00BJ5JPG56, TER kolem 0,28 %), Franklin FTSE China (IE00BHZRR147, TER kolem 0,19 %) pro offshore expozici a iShares MSCI China A (IE00BQT3WG13, TER kolem 0,40 %) pro čisté A-akcie. Většina z nich je dostupná u brokerů jako DEGIRO, XTB, Trading 212 nebo Interactive Brokers, u některých i bez poplatku za nákup.",
      "Motivace pro čínské ETF bývá dvojí: nízké valuace oproti americkému trhu a přesvědčení o dlouhodobém růstu domácí spotřeby a technologií (elektromobilita BYD, baterie CATL, e-commerce). Protikladem je téměř dekáda podprůměrné výkonnosti po roce 2021, kdy regulační zásahy státu srazily ceny technologických akcií. Čínské ETF proto berte jako cílenou satelitní sázku, ne jako jádro portfolia."
    ],
    "verdict": [
      "U čínských ETF řešte v první řadě, jakou expozici vlastně chcete. Pokud jde o obecnou sázku na Čínu, širší index typu MSCI China nebo FTSE China dá největší diverzifikaci a nejnižší náklady (Franklin FTSE China s TER kolem 0,19 % patří k nejlevnějším). Pokud cíleně chcete domácí A-akcie mimo technologické giganty z Hong Kongu, sáhněte po CSI 300 nebo MSCI China A fondu, ale počítejte s vyšším TER (typicky 0,40 % i více) kvůli nákladnějšímu přístupu na onshore burzy přes Stock Connect.",
      "Prakticky preferujte akumulační variantu (Acc) s irským domicilem: dividendy se reinvestují automaticky, odpadá řešení daně z výplat a irský domicil neřeší americkou srážkovou daň (pro čínské akcie stejně nerelevantní). Sledujte velikost fondu (ideálně stovky milionů EUR a výše kvůli likviditě a riziku zrušení) a reálný spread na burze, který u méně obchodovaných čínských ETF bývá vyšší než u globálních fondů. Metoda replikace je většinou fyzická, u A-akcií občas s omezeným samplingem."
    ],
    "forWhom": "Čínské ETF se hodí pro zkušenějšího investora s delším horizontem (7 a více let), který chce vědomě přidat cílenou expozici k Číně nad rámec toho, co už drží v globálním či rozvíjejícím se trhu, a je smířen s vysokou volatilitou i politickým rizikem. Rozumná je satelitní pozice v řádu jednotek procent portfolia. Nevhodné jsou pro začátečníky, pro konzervativní investory a pro každého, kdo by čínský fond bral jako náhradu širokého základu portfolia nebo kdo by neunesl několikaletý pokles bez panického prodeje. Kdo chce Čínu jen v malé míře a bez rozhodování, dostane ji automaticky přes ETF na rozvíjející se trhy nebo na celý svět.",
    "risks": [
      "Politické a regulační riziko: čínská vláda může ze dne na den zasáhnout do celých odvětví (jako v letech 2020-2021 u techu a soukromého vzdělávání), což u vyspělých trhů nemá obdobu a špatně se předvídá.",
      "Geopolitika a riziko delistingu: napětí mezi USA a Čínou, cla a hrozba vyřazení čínských ADR z amerických burz mohou zasáhnout ocenění firem i složení indexů.",
      "Měnové riziko na druhou: fond je zpravidla v USD nebo EUR, ale podkladem je jüan (CNY/CNH). Pro Čecha se sčítá pohyb jüanu i měny fondu vůči koruně, což zvyšuje kolísání hodnoty v CZK.",
      "Koncentrace a likvidita: širší čínské indexy jsou silně vážené několika technologickými giganty a menší ETF mívají tenčí obchodování a širší spread než globální fondy."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi MSCI China a CSI 300?",
        "a": "MSCI China (a podobně FTSE China) sleduje hlavně offshore akcie čínských firem obchodované v Hong Kongu a jako ADR v USA, s velkou vahou techu typu Alibaba a Tencent. CSI 300 sleduje 300 největších firem obchodovaných přímo na pevninských burzách v Šanghaji a Šen-čenu (A-akcie), kde mají větší podíl banky, spotřeba a průmysl. Jde tedy o dvě odlišné části téhož trhu."
      },
      {
        "q": "Nekryje mi Čínu už ETF na rozvíjející se trhy?",
        "a": "Ano, částečně. Čína je největší složkou indexů typu MSCI Emerging Markets a tvoří v nich zhruba čtvrtinu až třetinu. Pokud tedy držíte ETF na rozvíjející se trhy nebo na celý svět, určitou expozici k Číně už máte. Samostatné čínské ETF má smysl jen tehdy, když chcete tuto váhu vědomě navýšit nad tržní standard."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční variantu?",
        "a": "Pro dlouhodobé budování majetku je praktičtější akumulační (Acc): dividendy se automaticky reinvestují uvnitř fondu a nemusíte řešit zdanění průběžných výplat. Distribuční (Dist) dává smysl, jen když chcete pravidelný příjem. Vyplacené dividendy z ETF se v ČR daní jako příjem z kapitálového majetku bez ohledu na časový test."
      },
      {
        "q": "Musím z čínského ETF platit v Česku daně?",
        "a": "Zisk z prodeje ETF je v ČR osvobozen od daně, pokud jste podíl drželi déle než 3 roky (časový test), případně při ročním objemu prodejů do 100 000 Kč. Reinvestice uvnitř akumulačního fondu se nedaní. Konkrétní situaci a povinnost přiznat příjmy si ale ověřte u daňového poradce, tohle není daňové poradenství."
      },
      {
        "q": "Proč čínské akcie roky zaostávaly za americkými?",
        "a": "Po vrcholu v roce 2021 srazily čínský trh regulační zásahy státu do technologických firem, krize v realitním sektoru, slabší poptávka a geopolitické napětí. To vysvětluje nízké valuace, které dnes část investorů láká, ale zároveň připomíná, že jde o vysoce rizikovou a nepředvídatelnou sázku, ne o levný a bezpečný nákup."
      },
      {
        "q": "Kolik čínských ETF dát do portfolia?",
        "a": "U cílené sázky na jednu zemi se obvykle drží v satelitní roli, tedy řádově jednotky procent portfolia, aby případný několikaletý propad neohrozil celek. Pokud už máte Čínu přes globální nebo emerging markets fond, počítejte tuto expozici dohromady, ať se váha na jednu zemi nesečte do nezdravě velkého podílu."
      }
    ]
  },
  "nejlepsi-clean-energy-etf": {
    "introTitle": "Clean energy ETF: sázka na energetickou transformaci",
    "intro": [
      "Clean energy ETF sdružují akcie firem, které vydělávají na přechodu od fosilních paliv k obnovitelným zdrojům – výrobce solárních panelů a měničů, provozovatele větrných a vodních elektráren, dodavatele bateriových úložišť i síťové infrastruktury. Nejde tedy o klasické velké energetiky (ropa, plyn), ale o tematický, růstově orientovaný segment. Nejznámějším zástupcem je iShares Global Clean Energy (ticker ICLN, ISIN IE00B1XNHC34), který sleduje index S&P Global Clean Energy a s objemem kolem 2 mld. EUR je největším evropským fondem této kategorie. Na pomezí tématu stojí i vodohospodářské fondy typu iShares Global Water (IE00B1TXK627) nebo L&G Clean Water (IE00BK5BC891), které bývají méně volatilní než čistě obnovitelné zdroje.",
      "Zásadní je pochopit, že tohle je koncentrovaná tematická sázka, ne náhrada širokého indexu. Portfolio má typicky jen desítky titulů a velkou váhu jednotlivých jmen (např. NextEra Energy). Sektor je extrémně citlivý na úrokové sazby – obnovitelné projekty jsou kapitálově náročné a financované na dluh, takže při vysokých sazbách jejich hodnota klesá. Proto clean energy fondy po boomu v roce 2020–2021 zažily hluboký několikaletý propad. Investice sem dává smysl jako doplněk s dlouhým horizontem, ne jako jádro portfolia.",
      "Pro českého investora je většina relevantních fondů dostupná v UCITS podobě přes běžné brokery (DEGIRO, XTB, Trading 212, Interactive Brokers, Portu). Fondy jsou zpravidla vedené v USD nebo EUR, takže vůči koruně nesete měnové riziko – oslabení dolaru vám sníží výnos v CZK bez ohledu na to, jak si fond vede. TER se obvykle pohybuje kolem 0,49–0,65 % ročně, tedy výš než u širokých indexových ETF."
    ],
    "verdict": [
      "V této kategorii preferujte fond s irským domicilem (ISIN začínající IE) a akumulační třídou, pokud ji seženete – akumulace vám ušetří starost s daněním dividend a reinvestuje je automaticky. Pozor ale: nejlikvidnější zástupce ICLN existuje hlavně v distribuční variantě, takže dividendy budete muset danit sami (v ČR 15 %, u USA výnosů řešte formulář W-8BEN u brokera). Irský domicil je klíčový kvůli nižší srážkové dani na americké dividendy uvnitř fondu.",
      "Sázejte na velikost a likviditu – u tematických fondů hrozí, že malý fond poskytovatel po propadu zájmu zavře. Fond nad 1 mld. EUR (jako ICLN) je bezpečnější volba než exotický specializovaný produkt s pár desítkami milionů. TER kolem 0,5–0,65 % je pro tematické ETF standard; nehoňte se za nejnižším poplatkem na úkor likvidity. A ověřte si, co index skutečně obsahuje – některé fondy míchají čistou energii s tradičními utilitami, jiné jsou úzce zaměřené jen na solár nebo vodu, což výrazně mění rizikový profil."
    ],
    "forWhom": "Hodí se pro investora s dlouhým horizontem (7+ let), který věří v dekarbonizaci a je ochoten snést vysokou volatilitu i dlouhé roky pod nákupní cenou. Ideální jako tematický satelit v rozsahu 5–15 % portfolia vedle širokého základu (např. celosvětový akciový ETF). Nehodí se pro začátečníky, kteří teprve staví jádro portfolia, pro investory s krátkým horizontem, ani pro ty, kdo nesnesou pohled na dvojcifernou ztrátu. Není to defenzivní ani dividendová investice.",
    "risks": [
      "Extrémní citlivost na úrokové sazby: obnovitelné projekty jsou financované na dluh, takže růst sazeb sráží ocenění celého sektoru – to byl hlavní důvod propadu clean energy fondů o desítky procent v letech 2022–2023.",
      "Vysoká koncentrace a tematické riziko: index má často jen 30–100 titulů s velkou váhou jednotlivých jmen. Neúspěch pár klíčových firem nebo změna technologie (obsolescence) zasáhne fond mnohem víc než široký trh.",
      "Závislost na politice a dotacích: hodnota fondů reaguje na Green Deal, americký IRA, dotační programy a regulaci. Změna vlády nebo osekání podpory může sektorem otřást ze dne na den.",
      "Měnové riziko vůči koruně: fondy jsou vedené v USD/EUR. Oslabení dolaru proti CZK sníží váš výnos, i když fond v původní měně roste."
    ],
    "faqs": [
      {
        "q": "Proč clean energy ETF v posledních letech tolik klesaly?",
        "a": "Sektor je kapitálově náročný a silně zadlužený, takže prudký růst úrokových sazeb v letech 2022–2023 srazil ocenění projektů i akcií. Po euforii roku 2020–2021 tak přišel několikaletý propad, kdy řada fondů ztratila 50 i více procent. Je to připomínka, že jde o volatilní tematickou sázku, ne o stabilní investici."
      },
      {
        "q": "Jaký je rozdíl mezi clean energy a klasickým energetickým ETF?",
        "a": "Klasické energetické ETF drží hlavně těžaře ropy a plynu (ExxonMobil, Shell) a bývají dividendové a hodnotové. Clean energy fondy naopak sázejí na obnovitelné zdroje, technologie a růst – jsou dražší na ocenění a volatilnější. Jsou to prakticky protipóly, které se v cyklu často pohybují opačně."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční variantu?",
        "a": "Pro dlouhodobé budování majetku je pohodlnější akumulační třída – dividendy se reinvestují automaticky a nemusíte je danit ročně. Nejlikvidnější fond ICLN je ale primárně distribuční, takže dividendy (v ČR daněné 15 %) si budete muset přiznat sami. Zkontrolujte konkrétní třídu fondu podle ISIN před nákupem."
      },
      {
        "q": "Kolik z portfolia dát do clean energy ETF?",
        "a": "Vzhledem ke koncentraci a volatilitě se doporučuje držet tematické sektory jako satelit, typicky 5–15 % portfolia. Jádro by měl tvořit široký celosvětový akciový ETF. Vyšší alokace znamená, že se váš výsledek začne řídit náladou jednoho úzkého sektoru."
      },
      {
        "q": "Jsou clean energy ETF dostupné českým investorům a v jaké měně?",
        "a": "Ano, hlavní UCITS fondy (ICLN a další) koupíte přes DEGIRO, XTB, Trading 212, Interactive Brokers i Portu. Obchodují se obvykle v USD nebo EUR, takže vůči koruně nesete měnové riziko. U amerických dividend uvnitř fondu je výhodný irský domicil (ISIN IE), který snižuje srážkovou daň."
      },
      {
        "q": "Řeší clean energy ETF automaticky ESG požadavky?",
        "a": "Do jisté míry ano – z principu drží firmy z obnovitelné energetiky, takže dobře zapadají do udržitelného portfolia. Nejsou ale plnohodnotnou ESG diverzifikací; jsou úzce sektorové. Pokud chcete širší udržitelný základ, zkombinujte je s celotržním ESG ETF."
      }
    ]
  },
  "nejlepsi-cloud-etf": {
    "introTitle": "Cloud ETF: sázka na software a datová centra, ne na celý technologický sektor",
    "intro": [
      "Cloud ETF jsou tematické fondy zaměřené na firmy, které stojí za přechodem podnikového IT do cloudu: poskytovatele infrastruktury (Amazon AWS, Microsoft Azure, Google Cloud), platformy a hlavně software na předplatné (SaaS) jako Salesforce, ServiceNow, Snowflake, CrowdStrike nebo Datadog. Na rozdíl od širokých technologických fondů tu nenajdete výrobce hardwaru ani polovodičů - jde o užší výsek, jehož společným jmenovatelem jsou opakované příjmy z předplatného a vysoké náklady zákazníka na přechod ke konkurenci.",
      "Na evropském trhu (UCITS) najdete tři hlavní stavební kameny. iShares Digitalisation UCITS ETF (ISIN IE00BYZK4883, ticker DGTL) je s objemem kolem 835 mil. EUR největší a nejširší - kryje celou digitalizaci včetně cloudu, e-commerce i fintechu, TER 0,40 %. First Trust Cloud Computing UCITS ETF (IE00BFD2H405, SKYY, cca 418 mil. EUR, TER 0,60 %) je čistší pure-play na cloud. WisdomTree Cloud Computing UCITS ETF (IE00BJGWQN72, WCLD, cca 239 mil. EUR, TER 0,40 %) sleduje index BVP Nasdaq Emerging Cloud a míří výrazně na menší, rychleji rostoucí SaaS firmy.",
      "Pro českého investora jsou všechny tři akumulační (Acc) a v irském domicilu, obchodují se ale v USD, takže i při nákupu v korunách nesete plné měnové riziko dolaru. Dostupné jsou u XTB, Interactive Brokers, Trading 212 i Degiro; žádný z nich obvykle nepatří mezi ETF zdarma, takže počítejte s poplatkem za nákup podle brokera. Cloud berte jako doplněk k jádru portfolia, ne jako jeho náhradu."
    ],
    "verdict": [
      "Klíčové rozhodnutí není akumulace vs. distribuce - dividendy jsou u těchto fondů okrajové a všechny tři hlavní UCITS varianty jsou stejně akumulační, což je pro dlouhodobé držení v korunách daňově i prakticky nejjednodušší. Skutečná volba je mezi šíří a čistotou: iShares Digitalisation (DGTL) je díky velikosti a širšímu záběru nejrobustnější a nejvíce se překrývá s běžnými tech fondy, kdežto First Trust (SKYY) a zejména WisdomTree (WCLD) jsou koncentrovanější sázky na samotný cloud a menší SaaS firmy s vyšší volatilitou.",
      "Preferujte irský domicil (všechny tři ho mají) kvůli 15% srážkové dani na americké dividendy místo 30 %, dostatečnou velikost fondu (nad 100 mil. EUR pro rozumnou likviditu) a rozumný TER - 0,40 % u DGTL a WCLD je na tematický fond přijatelných, 0,60 % u SKYY je horní hranice, kterou ospravedlní jen ryze cloudové zaměření. Vzhledem k velkému překryvu s technologickými a AI fondy nedrží více cloud ETF současně; vyberte jeden podle toho, zda chcete širší digitalizaci (DGTL), nebo čistý cloud (SKYY/WCLD)."
    ],
    "forWhom": "Hodí se pro investory, kteří už mají vybudované jádro portfolia (globální akciový ETF typu MSCI World nebo All-World) a chtějí vědomě přisadit na jedno technologické téma s dlouhým investičním horizontem 10+ let a tolerancí k prudkým výkyvům. Nehodí se pro začátečníky jako první nebo hlavní ETF, pro investory s krátkým horizontem, pro ty, kdo špatně snášejí propady 40-50 % (což SaaS fondy v letech 2022-2023 zažily), ani pro nikoho, kdo už drží velký podíl v amerických technologiích - reálně by si tím jen zdvojil stejné firmy jako Microsoft a Amazon.",
    "risks": [
      "Sektorová a měnová koncentrace: fondy jsou z 70-90 % americké a obchodují v USD, takže kombinujete riziko jednoho sektoru s rizikem posilování koruny vůči dolaru - i při dobré výkonnosti akcií můžete v korunách prodělat na kurzu.",
      "Citlivost na úrokové sazby: růstové SaaS firmy s vysokým oceněním a zisky až v budoucnu prudce padají, když sazby rostou. Cloud ETF (hlavně WCLD a SKYY) v roce 2022 ztratily kolem poloviny hodnoty, přestože samotný cloud dál rostl.",
      "Vysoký překryv a skrytá koncentrace: napříč cloud, AI a technologickými ETF se stále dokola opakují Microsoft, Amazon, Google, Nvidia. Držením více témat si neúmyslně nekupujete diverzifikaci, ale několikanásobnou expozici stejným firmám.",
      "Tematické riziko a menší fondy: u pure-play fondů (WCLD, SKYY) hrozí regulační tlak na Big Tech, změna metodiky indexu i menší likvidita a širší spread než u širokých ETF, což zvyšuje reálné náklady na obchodování."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi cloud ETF a běžným technologickým nebo AI ETF?",
        "a": "Technologické ETF pokrývají celý sektor včetně hardwaru, polovodičů a čipů, kdežto cloud ETF míří úžeji na software na předplatné a poskytovatele cloudové infrastruktury. S AI ETF se hodně překrývají (Microsoft, Nvidia, Amazon), liší se ale důrazem - cloud sází na opakované příjmy ze SaaS, AI na výpočetní kapacitu a modely. V praxi si nekupujte oba naráz, obsahují do velké míry stejné firmy."
      },
      {
        "q": "Který cloud ETF je pro začátek nejlepší - DGTL, SKYY, nebo WCLD?",
        "a": "Pro širší a stabilnější expozici je nejrozumnější iShares Digitalisation (DGTL, IE00BYZK4883) - největší fond, TER 0,40 % a menší volatilita díky širšímu záběru. WCLD (WisdomTree) a SKYY (First Trust) jsou čistší cloud, ale koncentrovanější a kolísavější, vhodné spíš pro zkušenější investory, kteří chtějí cílenou sázku."
      },
      {
        "q": "Musím z akumulačního cloud ETF něco danit každý rok?",
        "a": "Ne. U akumulačního (Acc) fondu se dividendy reinvestují uvnitř fondu a daň z příjmu v ČR řešíte až při prodeji. Pokud podíly držíte déle než 3 roky, splníte časový test a zisk je od daně z příjmu osvobozen. Od roku 2026 je časový test bez horního limitu."
      },
      {
        "q": "Proč cloud ETF v roce 2022 tolik spadly, když cloud dál rostl?",
        "a": "Cloudové firmy mají vysoké ocenění postavené na budoucích ziscích. Když centrální banky zvedly úrokové sazby, tržní hodnota těchto vzdálených zisků prudce klesla a fondy jako WCLD ztratily kolem 50 %, přestože tržby firem dál rostly. Je to typické riziko růstových témat - reagují hlavně na sazby a náladu, ne jen na výsledky firem."
      },
      {
        "q": "Nesu měnové riziko, když nakupuju v korunách u XTB nebo Degiro?",
        "a": "Ano. To, že zadáte pokyn v korunách, nic nemění na tom, že podkladová aktiva fondu jsou v dolarech. Fondy nejsou měnově zajištěné, takže pohyb kurzu USD/CZK přímo ovlivní vaši korunovou výkonnost - posílení koruny vám sníží zisk, oslabení ho zvýší."
      },
      {
        "q": "Jak velkou část portfolia dát do cloud ETF?",
        "a": "Jako tematická a rizikovější sázka by cloud (případně dohromady s dalšími tech tématy) neměl tvořit víc než 5-15 % portfolia. Základ by měl zůstat v širokém globálním ETF; cloud přidávejte jen jako doplněk, u kterého vědomě přijímáte vyšší kolísavost výměnou za potenciálně vyšší růst."
      }
    ]
  },
  "nejlepsi-dax-etf": {
    "introTitle": "DAX ETF: sázka na 40 německých blue chipů",
    "intro": [
      "DAX je hlavní index frankfurtské burzy a sleduje 40 největších a nejlikvidnějších německých akciových společností. Najdete v něm globální jména jako SAP, Siemens, Allianz, Deutsche Telekom, Airbus, BMW, Mercedes-Benz nebo Munich Re. Do roku 2021 měl index jen 30 titulů (proto starší označení DAX 30), od září 2021 byl rozšířen na dnešních 40 firem, aby lépe pokryl technologie a průmysl střední velikosti.",
      "Jedno specifikum, které DAX odlišuje od většiny světových indexů: existuje jako performance index (TR), tedy verze, která do své hodnoty započítává i reinvestované dividendy. Většina DAX ETF proto akumuluje dividendy interně a přesně kopíruje tuto výnosovou variantu indexu. Německá ekonomika je silně exportní a cyklická, s velkou vahou automobilek, strojírenství a chemie. To znamená vysokou citlivost na světový obchod, ceny energií a poptávku z Číny.",
      "Pro českého investora je DAX ETF snadno dostupný. Fondy se běžně obchodují na německé burze Xetra i na frankfurtské burze v eurech a najdete je prakticky u všech brokerů zaměřených na evropský trh (DEGIRO, XTB, Trading 212, Interactive Brokers, Portu). Obchoduje se v eurech, takže výnos ovlivňuje i kurz EUR/CZK. Vzhledem k blízkosti a předvídatelnosti eurozóny je ale kurzové riziko pro Čecha zpravidla mírnější než u dolarových fondů."
    ],
    "verdict": [
      "U DAX ETF preferujte fond, který věrně kopíruje standardní DAX index (performance/TR verzi), má nízký TER a dostatečnou velikost. Nejlevnější fondy se dnes pohybují kolem 0,08-0,09 % ročně (například Xtrackers DAX 1C nebo Amundi Core DAX), zatímco starší a největší iShares Core DAX (EXS1) má vyšší TER kolem 0,16-0,20 %, ale za to nabízí bezkonkurenční likviditu a objem přes 10 miliard eur. Pro dlouhodobého investora dává smysl akumulační třída (1C, Acc), která reinvestuje dividendy automaticky a odloží daňovou i administrativní zátěž.",
      "Řešte i domicil a replikaci. Klasické německé fondy (ISIN začínající DE) mají domicil v Německu, novější konkurence často v Lucembursku (LU) nebo Irsku (IE). Pro čistou expozici na německé akcie preferujte fyzickou (přímou) replikaci před syntetickou. Pokud vám nezáleží na značce, rozhoduje kombinace nejnižšího TER, nízké tracking difference a spreadu. U menšího jednorázového nákupu klidně vezměte nejlevnější fond, u velké pozice zvažte i EXS1 kvůli likviditě."
    ],
    "forWhom": "DAX ETF se hodí investorovi, který chce cílenou expozici na německý průmysl a evropské blue chipy jako doplněk k širšímu evropskému nebo globálnímu portfoliu. Sedne také tomu, kdo věří v oživení německé ekonomiky nebo chce podíl na konkrétních značkách (auta, strojírenství, chemie). Nehodí se jako jediné jádro portfolia. DAX je koncentrovaný (jen 40 firem, silná váha pár sektorů) a nediverzifikovaný napříč regiony. Kdo chce jeden fond a klid, sáhne spíš po globálním indexu (MSCI World, FTSE All-World). DAX je satelit, ne základ.",
    "risks": [
      "Vysoká sektorová koncentrace: automobilky, strojírenství, chemie a finance tvoří v DAX neúměrně velkou váhu. Krize jednoho sektoru (například útlum evropského autoprůmyslu nebo drahé energie) zasáhne index nadprůměrně.",
      "Silná exportní závislost na Číně a světovém obchodu. Německé firmy generují velkou část tržeb v zahraničí, takže DAX citlivě reaguje na cla, zpomalení čínské poptávky a geopolitické napětí.",
      "Malá diverzifikace: pouhých 40 titulů z jedné země. Oproti globálním nebo evropským indexům chybí rozložení mezi regiony i mnoho sektorů (například velké technologie amerického typu).",
      "Měnové riziko EUR/CZK. Fond je v eurech, takže i při růstu německých akcií může posílení koruny část výnosu v korunách ukrojit."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi DAX 30 a DAX 40?",
        "a": "Do září 2021 měl DAX jen 30 společností, poté byl rozšířen na 40, aby lépe zachytil technologie a firmy střední velikosti. Dnešní ETF sledují DAX 40, i když se v běžné řeči stále mluví o DAXu bez čísla. Jde o tentýž index, jen s širší základnou titulů."
      },
      {
        "q": "Proč většina DAX ETF nevyplácí dividendy?",
        "a": "DAX existuje primárně jako takzvaný performance index (TR), který do své hodnoty už započítává reinvestované dividendy. Akumulační DAX ETF tuto verzi přesně kopíruje a dividendy reinvestuje interně, takže je nevyplácí na účet. Existují ale i distribuční třídy (Dist), pokud chcete pravidelný příjem."
      },
      {
        "q": "Který DAX ETF má nejnižší poplatky?",
        "a": "Nejlevnější fondy dnes stojí kolem 0,08-0,09 % ročně (TER), typicky Xtrackers DAX 1C a Amundi Core DAX. Naopak největší a nejlikvidnější iShares Core DAX (EXS1) má TER vyšší, kolem 0,16 %. Aktuální žebříček podle nejnižších poplatků najdete v tabulce výše na této stránce."
      },
      {
        "q": "Musím danit zisk z DAX ETF v Česku?",
        "a": "Ano, zisk z prodeje ETF podléhá v Česku dani z příjmů, pokud nesplníte časový test. Ten činí 3 roky držení, po jejichž uplynutí je zisk z prodeje osvobozen. U akumulačních fondů se dividendy reinvestují uvnitř fondu, takže je nemusíte průběžně danit sami. Konkrétní situaci vždy ověřte podle aktuálních pravidel."
      },
      {
        "q": "Je lepší DAX ETF s domicilem v Německu (DE), nebo v Lucembursku (LU)?",
        "a": "Pro dlouhodobou akumulaci není domicil zásadní. Německé fondy (ISIN DE) jsou tradiční a extrémně likvidní, lucemburské a irské často levnější. Rozhodující je spíš nízký TER, věrné sledování indexu a fyzická replikace než samotná země domicilu."
      },
      {
        "q": "Stačí mi DAX ETF jako jediná investice?",
        "a": "Ne, jako jediné jádro portfolia je DAX příliš koncentrovaný. Obsahuje jen 40 německých firem a velkou váhu pár sektorů. Používejte jej jako doplněk (satelit) k širšímu evropskému nebo globálnímu ETF, ne jako náhradu za diverzifikované jádro."
      }
    ]
  },
  "nejlepsi-defense-etf": {
    "introTitle": "Defense ETF: jak investovat do obranného a zbrojního průmyslu",
    "intro": [
      "Defense ETF (obranné ETF) sdružují akcie firem, které vyrábějí zbraně, munici, vojenskou techniku, radary, obranné systémy a technologie pro armády a bezpečnostní složky. Typicky jde o kombinaci klasických zbrojařů (Lockheed Martin, Northrop Grumman, RTX, General Dynamics), evropských hráčů (Rheinmetall, BAE Systems, Leonardo, Thales, Saab) a firem z oblasti aerospace. Kategorie zažila po roce 2022 prudký nástup: geopolitické napětí, válka na Ukrajině a tlak NATO na výdaje ve výši 2 % (a nově diskutovaná 3-5 %) HDP poslaly ceny těchto akcií i objemy nových fondů výrazně nahoru.",
      "Na evropském trhu (UCITS) je dnes k dispozici několik konkurenčních fondů. Největší je VanEck Defense UCITS ETF (ticker DFEN, ISIN IE000YYE6WK5) s globálním záběrem a majetkem přes 6 mld. EUR, TER 0,55 %. Následuje WisdomTree Europe Defence (DEFN, IE0002Y8CX98) zaměřený čistě na evropské zbrojaře s TER 0,40 % a HANetf Future of Defence (NATO, IE000OJ5TQP4) s TER 0,49 %. Nejnižší poplatek v kategorii má obvykle širší iShares Aerospace & Defence (TER kolem 0,35 %), který ale míchá obranu s civilním letectvím.",
      "Pro českého investora je podstatné, že tyto fondy jsou dostupné u běžných brokerů (DEGIRO, XTB, Trading 212, Interactive Brokers) a část z nich figuruje i v bezplatném seznamu DEGIRO. Fondy jsou obvykle vedené v EUR nebo USD, takže vůči koruně nesete kurzové riziko bez ohledu na to, v jaké měně ETF nakoupíte - rozhodující je měna podkladových akcií, nikoli měna kotace."
    ],
    "verdict": [
      "U defense ETF preferujte fond s dostatečnou velikostí (ideálně nad 500 mil. EUR), rozumným počtem titulů a jasně definovaným indexem - tato kategorie je mladá a některé menší fondy vznikly teprve v posledních dvou letech. Pro dlouhodobé držení dává smysl akumulační (accumulating) varianta s domicilem v Irsku: irský domicil díky daňové smlouvě s USA snižuje srážkovou daň z amerických dividend na 15 % a akumulace vám ušetří starost s reinvestováním i s ročním zdaňováním dividend v přiznání.",
      "Zvažte také, zda chcete globální expozici (VanEck DFEN, HANetf NATO) s velkou vahou amerických zbrojařů, nebo čistě evropskou sázku (WisdomTree DEFN, případně evropský Amundi/iShares fond), která nejvíce těží z evropského přezbrojování. TER v této kategorii je vyšší než u širokých indexů (0,35-0,55 %), což je daň za tematické zaměření - proto sledujte i reálnou likviditu a rozpětí spreadu, ne jen tabulkovou nákladovost."
    ],
    "forWhom": "Hodí se investorovi, který vědomě chce tematickou, sektorovou sázku na růst obranných výdajů a je ochoten přijmout vyšší kolísání i koncentraci do několika málo firem. Předpokládá delší horizont (5+ let) a toleranci k tomu, že cena už část geopolitické prémie zahrnuje. Nehodí se pro někoho, kdo hledá jádro portfolia (od toho jsou široké indexy typu MSCI World nebo S&P 500), pro velmi konzervativní profily, ani pro investory, kterým vadí investice do zbrojního průmyslu z etických či ESG důvodů.",
    "risks": [
      "Silná koncentrace a sektorové riziko: fondy drží jen několik desítek firem a velká váha připadá na pár největších zbrojařů - propad jednoho titulu nebo ztráta klíčové zakázky se v ceně projeví výrazně.",
      "Politická a rozpočtová závislost: tržby zbrojařů stojí a padají na vládních rozpočtech a objednávkách. Změna politické priority, mírové urovnání konfliktu nebo škrty v obraně mohou růst zastavit.",
      "Prémie už je v ceně: po strmém růstu 2022-2025 mohou být valuace napjaté. Kupujete-li po velkém růstu, riskujete korekci, pokud napětí poleví nebo trh přehodnotí očekávání.",
      "Kurzové a daňové riziko pro Čecha: podkladová aktiva jsou v USD a EUR, takže posílení koruny sníží výnos v CZK. Zisk z prodeje je v ČR osvobozen až po splnění 3letého časového testu."
    ],
    "faqs": [
      {
        "q": "Který defense ETF je největší a nejlikvidnější?",
        "a": "Největším evropským obranným fondem je VanEck Defense UCITS ETF (DFEN, IE000YYE6WK5) s majetkem přes 6 mld. EUR a globálním záběrem. Díky velikosti má obvykle nejlepší likviditu a úzké spready. Alternativou pro čistě evropskou expozici je WisdomTree Europe Defence (DEFN) s nižším TER 0,40 %."
      },
      {
        "q": "Jaký je rozdíl mezi defense a aerospace ETF?",
        "a": "Čistě obranné (defense) fondy se soustředí na výrobce zbraní a vojenské techniky. Aerospace & defence fondy k tomu přidávají civilní letectví - výrobce dopravních letadel a jejich dodavatele (Boeing, Airbus). Aerospace fondy jsou tak trochu diverzifikovanější a bývají levnější (TER kolem 0,35 %), ale nejsou čistou sázkou na zbrojení."
      },
      {
        "q": "Kolik stojí defense ETF na poplatcích?",
        "a": "Roční nákladovost (TER) se v této kategorii pohybuje zhruba mezi 0,35 % a 0,55 %. Nejlevnější bývají širší aerospace & defence fondy (kolem 0,35 %), specializované obranné ETF jako VanEck Defense mají TER 0,55 %. Je to více než u širokých indexů, protože jde o úzce zaměřené tematické fondy."
      },
      {
        "q": "Kde koupím defense ETF jako český investor?",
        "a": "Tyto fondy najdete u většiny brokerů dostupných v ČR - DEGIRO, XTB, Trading 212 i Interactive Brokers. VanEck Defense (DFEN) a WisdomTree Europe Defence (DEFN) bývají na DEGIRO v bezplatném seznamu, HANetf Future of Defence (NATO) koupíte u IBKR, XTB nebo Trading 212. Vždy si ověřte aktuální nabídku podle ISIN."
      },
      {
        "q": "Jak se v ČR daní zisk z defense ETF?",
        "a": "Zisk z prodeje ETF je v Česku osvobozen od daně z příjmu, pokud jste podíl drželi déle než 3 roky (časový test), případně při ročním objemu prodejů do 100 000 Kč. U akumulačních fondů řešíte pouze zisk při prodeji, dividendy se nereinvestují ručně ani nedaní průběžně."
      },
      {
        "q": "Je vhodné dát defense ETF jako jádro portfolia?",
        "a": "Ne. Obranné ETF jsou tematická, sektorová sázka s vyšší koncentrací a kolísáním, takže patří spíše do satelitní části portfolia (typicky do 5-10 % celku). Jádro by měl tvořit široce diverzifikovaný fond typu MSCI World nebo S&P 500, který obranné firmy stejně z části obsahuje."
      }
    ]
  },
  "nejlepsi-dividendove-etf": {
    "introTitle": "Dividendové ETF: pravidelný příjem z akcií v jednom fondu",
    "intro": [
      "Dividendové ETF jsou fondy, které cíleně vybírají akcie firem s nadprůměrným nebo stabilně rostoucím dividendovým výnosem a jejich dividendy pak dál vyplácejí investorům, typicky čtvrtletně. Nejde o jednu homogenní kategorii: dělí se zhruba na dvě filozofie. High-yield fondy jako Vanguard FTSE All-World High Dividend Yield (ISIN IE00B8GKDB10, ticker VHYL) nebo VanEck Morningstar Developed Markets Dividend Leaders (NL0011683594, TDIV) jdou po co nejvyšším aktuálním výnosu okolo 3–3,5 %. Naproti tomu strategie Dividend Aristocrats, například SPDR S&P US Dividend Aristocrats (IE00B6YX5D40), upřednostňují firmy zvyšující dividendu 25+ let v řadě, mají nižší počáteční výnos (kolem 2 %), ale kladou důraz na kvalitu a růst výplaty.",
      "Pro českého investora je klíčové, že tyto fondy jsou v UCITS podobě běžně dostupné na burzách v Amsterdamu, Frankfurtu (Xetra) i Londýně a koupíte je u DEGIRO, Interactive Brokers, XTB, Trading 212, Fio e-Brokeru i u Portu. Většina se obchoduje v EUR nebo USD, takže i když firmy vyplácejí dividendy v cizí měně, na váš účet dorazí v měně fondu a do koruny je přepočítáváte až při případném převodu. To znamená kurzové riziko CZK/EUR i CZK/USD, které u distribučních fondů cítíte přímo na výši reálně přijaté dividendy.",
      "Dividendové ETF dávají smysl, když chcete z portfolia čerpat hmatatelný pravidelný příjem, ať už jako doplněk k platu, v důchodové fázi, nebo jednoduše proto, že vás motivuje vidět peníze reálně přicházet. Nejsou to ale nástroje pro maximalizaci dlouhodobého zhodnocení, tam širší akciové indexy dlouhodobě vedou."
    ],
    "verdict": [
      "V této kategorii se z podstaty věci vyplácí distribuční třída (Distributing), protože právě výplata dividendy je smyslem investice, u dividendového ETF v akumulační podobě si vlastně protiřečíte, tam raději sáhněte po běžném akciovém indexu. Preferujte irský domicil (ISIN začínající IE), protože Irsko má s USA daňovou smlouvu snižující srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 %, což u fondů s vysokou vahou USA reálně zvyšuje čistý výnos. Nizozemský domicil (NL, např. VanEck TDIV) je také běžný a funkční, jen s trochu jinou daňovou mechanikou.",
      "Z pohledu nákladů je kategorie příznivá: TER se u kvalitních fondů drží mezi 0,29 % (VHYL) a 0,38 % (TDIV), přičemž velikost fondu je dobrým vodítkem likvidity a stability, VHYL patří s objemem v řádu miliard EUR k nejlikvidnějším. Vyhýbejte se malým a exotickým high-yield fondům s výnosy přes 6–9 % (typu Global X SuperDividend), kde extrémní výnos často signalizuje riziko krácení dividend a horší dlouhodobou výkonnost. Pro Čecha bez potřeby okamžitého cash flow bývá daňově i výnosově efektivnější akumulační světový index; dividendový fond volte vědomě kvůli příjmu, ne kvůli honbě za nejvyšším číslem."
    ],
    "forWhom": "Hodí se pro investory, kteří chtějí z portfolia pravidelný pasivní příjem, například v předdůchodové nebo důchodové fázi, nebo pro ty, které psychologicky motivuje vidět reálně přicházející výplaty. Dobře poslouží i jako příjmová složka většího portfolia. Nehodí se pro mladší investory ve fázi budování majetku s dlouhým horizontem, ti obvykle vytěží víc z akumulačního světového indexu, který dividendy reinvestuje automaticky bez okamžitého zdanění a plně využívá složené úročení. Nevhodné je i pro někoho, kdo nechce řešit každoroční danění přijatých dividend v daňovém přiznání.",
    "risks": [
      "Krácení nebo zrušení dividend v recesi: dividenda není zaručená, v krizích ji firmy plošně snižují (viz banky a energetika v roce 2020), takže očekávaný příjem může výrazně klesnout právě když ho potřebujete nejvíc.",
      "Sektorová a hodnotová koncentrace: high-yield indexy se přirozeně naklánějí k zralým odvětvím (finance, energetika, utility, telekomunikace) a podvažují technologie, což může znamenat zaostávání za širokým trhem v obdobích růstu.",
      "Daňové zatížení a administrativa v ČR: přijaté dividendy z distribučního ETF si musíte sami dodanit v daňovém přiznání (sazba 15 %, u vyšších příjmů může zasáhnout i vyšší pásmo), na rozdíl od akumulačního fondu, kde k této každoroční dani nedochází.",
      "Kurzové riziko: fondy jsou vedené v EUR či USD a dividendy z nich přepočítáváte do koruny, posilující koruna proto ukrojí z reálné výše příjmu bez ohledu na to, jak si vede samotné portfolio."
    ],
    "faqs": [
      {
        "q": "Kolik reálně vydělám na dividendách z těchto ETF?",
        "a": "U kvalitních světových high-yield fondů jako VHYL nebo TDIV se hrubý dividendový výnos pohybuje kolem 3–3,5 % ročně z investované částky, u Dividend Aristocrats spíš okolo 2 %. Z toho si v ČR ještě odečtěte 15% daň a počítejte s kurzovým přepočtem do koruny, takže čistý příjem je o něco nižší než uváděný hrubý výnos."
      },
      {
        "q": "Musím dividendy z ETF danit a jak?",
        "a": "Ano. Dividendy z distribučního ETF jsou zdanitelný příjem z kapitálového majetku a uvádíte je v daňovém přiznání se sazbou 15 %. Pokud fond srazil zahraniční srážkovou daň, lze ji díky smlouvám o zamezení dvojího zdanění zpravidla započíst, doporučujeme uschovat výpisy od brokera a případně konzultovat s daňovým poradcem."
      },
      {
        "q": "Je lepší dividendové ETF, nebo akumulační světový index?",
        "a": "Záleží na cíli. Pokud chcete pravidelný příjem hned, dává smysl distribuční dividendové ETF. Pokud budujete majetek na 10+ let a příjem teď nepotřebujete, akumulační světový index (např. na MSCI World nebo FTSE All-World) je obvykle daňově i výnosově efektivnější, protože dividendy reinvestuje bez každoročního zdanění."
      },
      {
        "q": "Jaký je rozdíl mezi Dividend Aristocrats a high-yield ETF?",
        "a": "High-yield fondy (VHYL, TDIV) maximalizují aktuální výnos a vybírají akcie s nejvyššími dividendami, což může zahrnovat i rizikovější firmy. Dividend Aristocrats (SPDR IE00B6YX5D40) naopak sázejí na firmy zvyšující dividendu 25+ let v řadě, mají nižší počáteční výnos (kolem 2 %), ale stabilnější a rostoucí výplatu s důrazem na kvalitu."
      },
      {
        "q": "Jak často se dividendy vyplácejí?",
        "a": "Nejběžnější je čtvrtletní výplata (4x ročně), kterou používá třeba VHYL. Některé fondy vyplácejí pololetně (2x ročně) a existují i fondy s měsíční výplatou. Frekvenci vždy najdete v popisu konkrétního fondu, na složené úročení nemá zásadní vliv, jde spíš o pohodlí příjmu."
      },
      {
        "q": "U kterých brokerů dividendové ETF koupím?",
        "a": "Vanguard VHYL (IE00B8GKDB10), VanEck TDIV (NL0011683594) i SPDR Dividend Aristocrats (IE00B6YX5D40) jsou dostupné u většiny českých i evropských brokerů, tedy DEGIRO, Interactive Brokers, XTB, Trading 212, Fio e-Brokeru i u Portu. Před nákupem porovnejte transakční poplatky a případné měnové konverze, u distribučních fondů řešte i to, jak broker nakládá s výplatou dividend."
      }
    ]
  },
  "nejlepsi-dluhopisove-etf": {
    "introTitle": "Dluhopisové ETF: stabilizátor portfolia, ne motor výnosu",
    "intro": [
      "Dluhopisové ETF nakupují do jednoho fondu stovky až tisíce dluhopisů, což jsou v podstatě půjčky státům (např. Německu, USA, Francii) a velkým firmám (investičního stupně). Fond za vás vybírá kupóny, reinvestuje splatné dluhopisy a rozkládá riziko napříč emitenty a splatnostmi. Nejrozšířenější kategorií jsou tzv. Global Aggregate fondy, které kombinují státní i korporátní dluhopisy vyspělých zemí do jednoho indexu (Bloomberg Global Aggregate). Typickými zástupci dostupnými u českých brokerů jsou iShares Core Global Aggregate Bond (IE00BDBRDM35), Xtrackers Global Government Bond a Vanguard Global Aggregate Bond (IE00BG47KH54) s velmi nízkým TER kolem 0,10 %.",
      "Pro Čecha je u dluhopisů zásadní jedna věc: měna. Zahraniční dluhopis vynáší třeba 3 %, ale pokud dolar nebo euro oslabí vůči koruně o 5 %, je výnos rázem záporný. Proto u dluhopisové složky portfolia dává smysl volit verze zajištěné do EUR (EUR Hedged) nebo do CZK, kde je kurzové riziko systematicky odstíněno. U akcií se hedging obvykle nevyplácí, u dluhopisů naopak dává velký smysl, protože kolísání kurzu bývá větší než samotný úrokový výnos.",
      "Do dluhopisových ETF se investuje především kvůli stabilitě a diverzifikaci, nikoli kvůli růstu. Historicky se dluhopisy chovaly opačně než akcie (při propadu akciových trhů investoři utíkají do bezpečí státních dluhopisů), takže ve smíšeném portfoliu tlumí výkyvy. Rok 2022 ale ukázal i výjimku: když centrální banky prudce zvedaly sazby, klesly ceny akcií i dluhopisů zároveň. Aktuálně, po návratu sazeb na vyšší úrovně, nabízejí kvalitní dluhopisové ETF slušný běžný výnos (yield to maturity) v pásmu zhruba 3-4 %, což je nejlepší výchozí pozice za poslední dekádu."
    ],
    "verdict": [
      "Pro drtivou většinu českých investorů je nejrozumnější volbou široce diverzifikovaný Global Aggregate fond zajištěný do EUR nebo CZK, s nízkým TER (ideálně do 0,15 %) a velkým objemem majetku pro dostatečnou likviditu. Akumulační (accumulating) verze se hodí do fáze budování majetku, protože kupóny automaticky reinvestuje a nemusíte je danit ani ručně přeinvestovávat. Distribuční (distributing) verze naopak ocení ten, kdo chce z dluhopisů pravidelný příjem na účet, typicky v rentierské fázi.",
      "Klíčové je nehnat se za výnosem. High yield (podřadné) dluhopisy nebo dlouhá durace lákají vyšším číslem, ale nesou riziko, kvůli kterému do dluhopisové části portfolia vůbec nepatří. Držte se investičního stupně (rating BBB a výše), globální diverzifikace a EUR/CZK zajištění. Pokud vás trápí citlivost na sazby, sáhněte po fondech s kratší durací; pokud čekáte pokles sazeb a chcete na něm vydělat, delší durace nabídne větší cenový růst, ale i větší propad při opačném scénáři."
    ],
    "forWhom": "Hodí se konzervativnějším investorům, lidem blížícím se k cíli (za pár let potřebují peníze) a všem, kdo chtějí ztlumit výkyvy akciového portfolia či mít stabilní protiváhu. Dobře poslouží i v rentierské fázi jako zdroj pravidelného příjmu. Nehodí se mladým investorům s dlouhým horizontem, kteří hledají maximální růst (tam dominují akcie), ani jako náhrada spořicího účtu na krátkodobou rezervu, protože cena dluhopisového ETF může krátkodobě klesnout.",
    "risks": [
      "Úrokové riziko: když centrální banky zvedají sazby, ceny existujících dluhopisů klesají. Čím delší durace fondu, tím větší propad, což naplno ukázal rok 2022, kdy globální dluhopisové ETF ztratily i přes 10 %.",
      "Měnové riziko u nezajištěných verzí: posílení koruny vůči dolaru či euru může snadno smazat celý úrokový výnos. Proto pro české investory preferujte verze zajištěné do EUR nebo CZK.",
      "Kreditní riziko: u korporátních a zejména high yield dluhopisů hrozí, že emitent nesplatí. U kvalitních Global Aggregate fondů investičního stupně je toto riziko nízké, ale ne nulové.",
      "Inflační riziko: pevný kupón ztrácí reálnou hodnotu, pokud inflace překvapivě vzroste. Klasické dluhopisové ETF proti inflaci nechrání, na to slouží samostatná kategorie inflačně vázaných (linkers) fondů."
    ],
    "faqs": [
      {
        "q": "Je lepší dluhopisové ETF, nebo spořicí účet a termínovaný vklad?",
        "a": "Pro krátkodobou rezervu (do 1-2 let) je spořicí účet bezpečnější, protože nekolísá a je pojištěný. Dluhopisové ETF má smysl na střednědobý až dlouhodobý horizont, kde nabízí lepší diverzifikaci a potenciál kapitálového zhodnocení, když sazby klesají. Cena ETF ale může krátkodobě klesnout, což u spořicího účtu nehrozí."
      },
      {
        "q": "Proč mi dluhopisové ETF v roce 2022 spadlo, když jsou dluhopisy 'bezpečné'?",
        "a": "Bezpečnost dluhopisu znamená vysokou pravděpodobnost splacení, ne stabilní cenu na burze. Když centrální banky prudce zvýšily sazby, tržní cena starších dluhopisů s nižším kupónem klesla, a to se propsalo i do ceny ETF. Při držení do splatnosti se ale vyšší sazby postupně promítnou do vyššího budoucího výnosu fondu."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční verzi?",
        "a": "Akumulační verze reinvestuje kupóny automaticky a hodí se pro budování majetku bez starostí. Distribuční verze vyplácí kupóny na účet a ocení ji ten, kdo chce pravidelný příjem. V ČR podléhají vyplacené kupóny dani z příjmu, u akumulační verze řešíte pouze zisk při prodeji."
      },
      {
        "q": "Musím zisk z dluhopisového ETF danit?",
        "a": "Ano, ale platí stejný časový test jako u akciových ETF: pokud cenný papír držíte déle než 3 roky, je zisk z prodeje od daně z příjmu osvobozen. U distribučních verzí se ovšem vyplacené kupóny (dividendy) daní vždy, bez ohledu na dobu držení. Pravidla se mohou měnit, proto si aktuální stav ověřte."
      },
      {
        "q": "Co znamená durace a proč je důležitá?",
        "a": "Durace vyjadřuje citlivost fondu na změnu úrokových sazeb. Zjednodušeně: durace 7 znamená, že při růstu sazeb o 1 procentní bod cena fondu klesne zhruba o 7 %, a naopak. Kratší durace = klidnější průběh, delší durace = větší zisk při poklesu sazeb, ale i větší propad při jejich růstu."
      },
      {
        "q": "Kde dluhopisové ETF koupím a na co si dát pozor?",
        "a": "Global Aggregate fondy najdete u většiny českých i zahraničních brokerů, například DEGIRO, XTB, Interactive Brokers, Trading 212, Portu nebo Fio e-Broker. Ověřte si, že jde o verzi zajištěnou do EUR nebo CZK (v názvu 'EUR Hedged') a porovnejte transakční poplatky, u pravidelných menších nákupů se hodí broker bez poplatku za obchod."
      }
    ]
  },
  "nejlepsi-emerging-markets-etf": {
    "introTitle": "Emerging markets ETF: jak jedním fondem podchytit Čínu, Indii i Taiwan",
    "intro": [
      "Emerging markets ETF (ETF na rozvíjející se trhy) sledují akcie firem ze zemí, které ještě nepatří mezi plně vyspělé ekonomiky, ale rychle rostou. Naprostá většina evropských fondů kopíruje index MSCI Emerging Markets, který obsahuje zhruba 1 400 firem z 24 zemí. Největší váhy tradičně drží Čína (kolem 25-30 %), Taiwan (silně tažený polovodičovým gigantem TSMC), Indie a Jižní Korea. Kdo chce ještě širší záběr včetně menších firem, sáhne po variantě IMI (Investable Market Index), která přidává i small-cap segment a čítá přes 3 000 titulů.",
      "Pro českého investora je tahle kategorie zajímavá hlavně jako doplněk k celosvětovému nebo americkému portfoliu. Klasický index MSCI World rozvíjející se trhy vůbec neobsahuje, takže bez samostatného EM fondu (nebo bez ACWI/IMI verze) vám v portfoliu chybí zhruba desetina světové tržní kapitalizace a velká část budoucího ekonomického růstu. Prakticky všechny relevantní fondy jsou v UCITS obálce s domicilem v Irsku a obchodují se v eurech nebo dolarech na burzách Xetra a v Amsterdamu, takže je bez problémů koupíte přes DEGIRO, XTB, Trading 212 i Interactive Brokers.",
      "Na trhu dominují tři jména: iShares Core MSCI EM IMI (ticker EIMI, ISIN IE00BKM4GZ66) jako největší a nejlikvidnější volba, Amundi Core MSCI EM (C9EM, LU2573966905) s jedním z nejnižších poplatků a HSBC MSCI EM (HMEF, IE00B5SSQT16) jako levná a slušně velká alternativa. Rozdíly v ročním TER se pohybují jen v desetinách procenta, takže o výsledku často rozhodne spíš skladba indexu a to, jak fond replikuje (fyzicky vs. swapem)."
    ],
    "verdict": [
      "Pro drtivou většinu dlouhodobých investorů dává v této kategorii smysl akumulační (reinvestující) fond s irským domicilem, širokým indexem MSCI EM nebo MSCI EM IMI a TER do zhruba 0,20 %. Akumulace znamená, že se dividendy automaticky reinvestují uvnitř fondu a vy neřešíte každoroční danění drobných výplat. Irský domicil je důležitý kvůli výhodnější srážkové dani z amerických i dalších dividend, byť u emerging markets je tento efekt menší než u USA. Hlídejte i velikost fondu, ideálně nad 1 mld. EUR, aby byl fond likvidní a nehrozilo jeho zrušení.",
      "Konkrétně: EIMI je nejbezpečnější defaultní volba díky obří velikosti a IMI záběru (velké i menší firmy), C9EM láká nejnižším poplatkem, ale replikuje swapem, což někomu nemusí vyhovovat, a HMEF je rozumný kompromis levné plně fyzické replikace. Pokud vám vadí vysoká váha Číny, existují varianty MSCI EM ex China, kterými si čínskou expozici můžete řídit samostatně. Nemíchejte ale zbytečně tři EM fondy najednou, jeden dobře vybraný fond kategorii plně pokryje."
    ],
    "forWhom": "Hodí se pro dlouhodobého investora (horizont ideálně 10+ let), který už má jádro portfolia ve světových nebo amerických akciích a chce přidat růstový, hůře korelovaný doplněk s vyšším potenciálem. Typická alokace bývá 5-15 % portfolia. Nehodí se pro konzervativní investory citlivé na výkyvy, pro krátký horizont ani pro toho, kdo hledá stabilní pravidelný příjem, EM trhy umí roky stagnovat a jejich dividendový výnos je nepředvídatelný. Kdo už drží ETF na celý svět ve verzi ACWI nebo FTSE All-World, má rozvíjející se trhy částečně pokryté a samostatný EM fond nutně nepotřebuje.",
    "risks": [
      "Koncentrace do Číny a Taiwanu: standardní MSCI EM má kolem 25-30 % v Číně a významnou váhu v Taiwanu (hlavně přes TSMC). Regulatorní zásah Pekingu nebo geopolitické napětí kolem Taiwanu proto může s fondem pořádně zahýbat bez ohledu na zbytek světa.",
      "Měnové riziko: fond držíte v EUR nebo USD, ale podkladové akcie jsou v desítkách místních měn (jüan, rupie, won, real). Posilující dolar historicky emerging markets tlačí dolů a k tomu se přidává pohyb koruny vůči euru či dolaru, který vám výnos v CZK dále zkresluje.",
      "Politické a institucionální riziko: rozvíjející se trhy mají slabší ochranu menšinových akcionářů, riziko kapitálových kontrol a horší účetní transparentnost. Rusko v roce 2022 ukázalo, že celá jedna země může být z indexu odepsána prakticky na nulu.",
      "Vyšší volatilita a dlouhé cyklické výkyvy: EM se dokážou několik let výkonnostně táhnout za světem a pak to naopak rychle doženou. Bez trpělivosti a pravidelného investování (DCA) hrozí, že fond prodáte ve špatný okamžik."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi verzí MSCI EM a MSCI EM IMI?",
        "a": "Základní MSCI Emerging Markets pokrývá velké a střední firmy (large a mid cap), zhruba 1 400 titulů. Verze IMI (Investable Market Index) navíc přidává i menší firmy (small cap) a dostane se tak přes 3 000 akcií. IMI je o něco lépe diverzifikovaná, výkonnostní rozdíl je ale dlouhodobě malý. Fond EIMI je právě IMI varianta."
      },
      {
        "q": "Potřebuji EM fond, když už mám ETF na celý svět?",
        "a": "Záleží na tom, jaký světový index držíte. Populární MSCI World a S&P 500 rozvíjející se trhy vůbec neobsahují, takže vám EM chybí a samostatný fond dává smysl. Naopak ETF typu FTSE All-World nebo MSCI ACWI už emerging markets zhruba z 10 % obsahují, a pak samostatný EM fond není nutný, leda byste chtěli váhu záměrně zvýšit."
      },
      {
        "q": "Vadí, že je v indexu tak velká váha Číny?",
        "a": "Pro někoho ano. Standardní MSCI EM drží v Číně kolem 25-30 %, což je jedno riziko soustředěné do jedné země s vysokým politickým a regulatorním rizikem. Pokud vám to vadí, existují varianty MSCI EM ex China, díky kterým čínskou expozici oddělíte a řídíte si ji samostatně, případně ji vynecháte úplně."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční EM fond?",
        "a": "Pro dlouhodobé budování majetku je pohodlnější akumulační (Acc) fond, protože dividendy reinvestuje uvnitř a vy neřešíte jejich každoroční danění. Distribuční (Dist) fond dává smysl, jen když od portfolia potřebujete pravidelný hotovostní příjem. U EM je ale dividendový výnos kolísavý, takže na rentiérský příjem to není ideální kategorie."
      },
      {
        "q": "Jak se v Česku daní zisky z emerging markets ETF?",
        "a": "Platí stejná pravidla jako pro ostatní akciové ETF. Zisk z prodeje je osvobozen od daně z příjmu, pokud mezi nákupem a prodejem uplynou více než 3 roky (časový test), případně při splnění limitu osvobozeného ročního příjmu. U akumulačních fondů navíc neřešíte průběžné danění dividend. Konkrétní situaci ale vždy ověřte podle aktuálních pravidel nebo s daňovým poradcem."
      },
      {
        "q": "Kde tyto ETF v Česku koupím a v jaké měně?",
        "a": "Nejběžnější fondy (EIMI, C9EM, HMEF) jsou dostupné u DEGIRO, XTB, Trading 212 i Interactive Brokers a obchodují se hlavně na německé Xetře a v Amsterdamu v eurech nebo dolarech. Nakupujete tedy za EUR či USD, ne za koruny, takže počítejte s konverzí měny a jejími poplatky u daného brokera."
      }
    ]
  },
  "nejlepsi-energeticke-etf": {
    "introTitle": "Energetické ETF: ropa, plyn a čistá energie v jednom sektoru",
    "intro": [
      "Energetické ETF investují do firem z energetického sektoru. Pod jednu kategorii přitom spadají dva světy, které se často pohybují proti sobě. Na jedné straně jsou tradiční ropní a plynárenští giganti jako Shell, ExxonMobil, Chevron, TotalEnergies nebo ConocoPhillips, kteří vydělávají na těžbě a zpracování fosilních paliv. Na druhé straně stojí čistá energie (clean energy) – výrobci solárních panelů, větrných turbín, technologií pro vodíkovou a bateriovou infrastrukturu. Než začnete vybírat konkrétní fond, ujasněte si, na kterou z těchto dvou stran vlastně sázíte, protože jejich chování i valuace se zásadně liší.",
      "Klasický sektorový přístup reprezentují fondy jako Xtrackers MSCI World Energy (ISIN IE00BM67HM91, TER 0,25 %) nebo evropský SPDR MSCI Europe Energy (IE00BKWQ0F09, TER 0,18 %). Ty drží úzký koš velkých energetických firem a v podstatě kopírují cenu ropy a plynu s dividendovým polštářem navíc. Čistou energii pokrývá především iShares Global Clean Energy Transition (IE00B1XNHC34), historicky největší fond svého druhu, s objemem kolem 2 mld. EUR, ale výrazně vyšším TER 0,65 %. Rozdíl v poplatku i chování je tu obrovský a není náhodný – jde o dva různé investiční příběhy.",
      "Pro českého investora je podstatné, že jde o silně sektorovou, nikoli diverzifikovanou sázku. Energie tvoří jen pár procent globálního akciového trhu, takže energetické ETF patří mezi doplňkové (satelitní) pozice, ne mezi jádro portfolia. Fondy jsou vedené v USD nebo EUR a obchodují se na evropských burzách (Xetra, Euronext), takže je pořídíte u DEGIRO, XTB, Trading 212 i Interactive Brokers. Vůči koruně nesete měnové riziko dolaru či eura – to se u ropných firem částečně kryje tím, že ropa se globálně obchoduje v dolarech."
    ],
    "verdict": [
      "Nejdřív se rozhodněte, kterou stranu sektoru chcete. Pokud sázíte na tradiční energetiku a dividendový příjem, dává smysl široký, likvidní fond s nízkým TER a rozumným počtem firem – typicky Xtrackers MSCI World Energy (TER 0,25 %) pro globální záběr nebo SPDR MSCI Europe Energy (TER 0,18 %) pro evropskou expozici. U dlouhodobého držení preferujte akumulační (accumulating) variantu, která dividendy automaticky reinvestuje a v Česku odkládá zdanění; pokud ale chcete z energie pravidelný cash-flow, sáhněte po distribuční třídě a počítejte s tím, že dividendy z ETF v ČR daníte v přiznání.",
      "Napříč celou kategorií upřednostněte irský domicil (ISIN začínající na IE). Snižuje srážkovou daň z amerických dividend na úrovni fondu a je to standard pro evropské UCITS ETF. Sledujte také velikost fondu a likviditu – u úzkých sektorových a zvlášť clean-energy fondů se objevují menší produkty, u kterých hrozí širší spread i riziko zrušení. U čisté energie navíc počítejte s tím, že za tématický příběh zaplatíte vyšší TER (0,6–0,7 %) a koupíte si výrazně vyšší volatilitu. Držení nad 3 roky splňuje český časový test pro osvobození zisků z prodeje, což z těchto cyklických fondů dělá spíš dlouhodobou satelitní pozici než krátkodobou spekulaci."
    ],
    "forWhom": "Energetické ETF se hodí pro investory, kteří už mají vybudované diverzifikované jádro portfolia (typicky celosvětový akciový fond) a chtějí přidat cílenou satelitní sázku na energii – ať už na ropný a dividendový příběh, nebo na energetickou transformaci. Sedne investorům s vyšší tolerancí k volatilitě a delším horizontem, kteří rozumí cyklickému charakteru sektoru a nenechají se vyplašit poklesem o desítky procent. Nehodí se jako jádro portfolia ani pro začátečníky hledající klidný pasivní produkt, pro konzervativní investory před penzí a pro ty, kdo neunesou, že sektor může několik let výrazně zaostávat za širokým trhem. Investorům s hodnotovým (ESG) filtrem nemusí sednout tradiční ropné fondy; ty by měly zvážit spíš čistě clean-energy variantu.",
    "risks": [
      "Vysoká volatilita a cykličnost – energetický sektor patří k nejkolísavějším, roční výkyvy běžně dosahují 25–35 %. Sektor umí několik let výrazně zaostávat za trhem a pak naopak prudce vystřelit.",
      "Přímá závislost na cenách komodit a geopolitice – hodnota tradičních energetických ETF stojí a padá s cenou ropy a zemního plynu, kterou hýbou rozhodnutí OPEC+, války, sankce a globální poptávka. Jde o faktory, které nelze predikovat.",
      "Regulační a transformační riziko – tradiční energetiku ohrožuje dekarbonizace, emisní povolenky a odklon od fosilních paliv. U čisté energie je to naopak: firmy silně závisí na dotacích, úrokových sazbách a politické podpoře, a při jejich změně padají obzvlášť tvrdě (viz propad clean-energy fondů po roce 2021).",
      "Nízká diverzifikace a koncentrace – úzké sektorové indexy drží desítky firem a bývají silně navázané na několik největších titulů, takže problém jedné či dvou společností zamává celým fondem. Měnové riziko USD/EUR vůči koruně přidává další vrstvu kolísání."
    ],
    "faqs": [
      {
        "q": "Jaká jsou nejlepší energetická ETF?",
        "a": "Mezi nejsledovanější patří Xtrackers MSCI World Energy (IE00BM67HM91, TER 0,25 %) pro globální tradiční energetiku, SPDR MSCI Europe Energy (IE00BKWQ0F09, TER 0,18 %) pro Evropu a iShares Global Clean Energy Transition (IE00B1XNHC34, TER 0,65 %) jako největší fond na čistou energii. Volba závisí na tom, zda chcete sázet na ropu a dividendy, nebo na energetickou transformaci."
      },
      {
        "q": "Jaký je rozdíl mezi tradičním a clean energy ETF?",
        "a": "Tradiční energetická ETF drží ropné a plynárenské firmy jako Shell, Exxon nebo TotalEnergies a v podstatě kopírují cenu ropy s dividendovým výnosem navíc. Clean-energy fondy sázejí na obnovitelné zdroje – solár, vítr, vodík a baterie. Mají vyšší růstový potenciál, ale i vyšší poplatky a citelně vyšší volatilitu. Obě skupiny se často pohybují proti sobě."
      },
      {
        "q": "Kolik stojí energetická ETF na poplatcích?",
        "a": "Roční TER se u této kategorie pohybuje zhruba od 0,15 % do 0,65 %. Nejlevnější jsou tradiční sektorové fondy (SPDR MSCI Europe Energy 0,18 %, Xtrackers MSCI World Energy 0,25 %), zatímco tematické clean-energy fondy jako iShares Global Clean Energy vyjdou dráž (0,65 %). K TER připočtěte transakční poplatky a spread u vašeho brokera."
      },
      {
        "q": "Mám vybrat akumulační, nebo distribuční variantu?",
        "a": "Pro dlouhodobé budování majetku je obvykle výhodnější akumulační (acc) třída – dividendy se automaticky reinvestují a v Česku tím odkládáte zdanění. Distribuční (dist) variantu volte, jen pokud chcete z energetiky pravidelný příjem; vyplacené dividendy pak musíte uvést v daňovém přiznání a zdanit."
      },
      {
        "q": "Jak se energetická ETF daní v Česku?",
        "a": "Zisk z prodeje ETF je v ČR osvobozen, pokud fond držíte déle než 3 roky (časový test), případně při ročním objemu prodejů do 100 000 Kč. Vyplácené dividendy z distribučních fondů se daní vždy. Irský domicil (ISIN začínající na IE) navíc snižuje srážkovou daň z dividend přímo uvnitř fondu, proto je u evropských investorů standardem."
      },
      {
        "q": "Jsou energetická ETF vhodná jako jádro portfolia?",
        "a": "Ne. Energie tvoří jen malý zlomek globálního akciového trhu, takže energetické ETF jsou sektorová, koncentrovaná sázka a patří mezi satelitní (doplňkové) pozice. Jádro portfolia by měl tvořit široce diverzifikovaný celosvětový fond; energii přidávejte jen jako menší cílený podíl, jehož vyšší kolísání unesete."
      }
    ]
  },
  "nejlepsi-esg-etf": {
    "introTitle": "ESG ETF: udržitelné investování s nižší uhlíkovou stopou",
    "intro": [
      "ESG ETF jsou fondy, které kromě finančních ukazatelů zohledňují i faktory z oblasti životního prostředí (Environmental), sociální odpovědnosti (Social) a správy společností (Governance). V praxi to znamená, že poskytovatel indexu odfiltruje kontroverzní obory (typicky výroba zbraní, tabák, uhlí a další fosilní paliva, hazard) a naopak nadváží firmy s lepším ESG hodnocením. U evropských fondů většina populárních variant sleduje indexy MSCI ESG (Screened, Enhanced Focus, CTB či SRI) nebo obdobné rodiny od jiných poskytovatelů. Zkratky jako SRI, CTB (Climate Transition Benchmark), PAB (Paris-Aligned Benchmark), Sustainable, Green nebo Climate označují jen různě přísný stupeň screeningu.",
      "Je důležité rozumět tomu, že ESG neznamená automaticky jiný trh. Nejběžnější ESG fondy jsou stále široce diverzifikované akciové fondy navázané na velké benchmarky (USA, celý svět) a jejich složení se od klasického indexu liší spíše v detailu než zásadně. Například iShares MSCI USA ESG Enhanced CTB patří k největším ESG ETF v Evropě s objemem kolem 11 mld. EUR a mimořádně nízkým TER okolo 0,07 %, zatímco JPMorgan US Research Enhanced Index Equity (ESG) přidává navíc aktivní výběr titulů a jeho TER je vyšší (kolem 0,20 %).",
      "Pro českého investora jsou tyto fondy dobře dostupné: obchodují se na evropských burzách (Xetra, Euronext, Borsa Italiana) a najdete je u brokerů jako DEGIRO, XTB, Trading 212 nebo Interactive Brokers. Většina velkých ESG ETF má irský domicil (ISIN začíná na IE), což je z pohledu zdanění amerických dividend výhodné. Fondy se obchodují nejčastěji v EUR nebo USD, takže počítejte s kurzovým rizikem koruny vůči těmto měnám."
    ],
    "verdict": [
      "Pro dlouhodobé pasivní investování dává v této kategorii smysl volit široce diverzifikovaný ESG fond navázaný na velký benchmark (USA nebo celý svět), s irským domicilem (ISIN IE...), akumulační třídou (ACC) pro odklad daně z dividend a co nejnižším TER. Nejlevnější zástupci jako iShares MSCI USA ESG Enhanced CTB (IE00BHZPJ890) se dostávají na TER kolem 0,07 %, tedy prakticky na úroveň běžných indexových fondů, což je klíčové, protože poplatek si berete jistě, kdežto přínos ESG screeningu na výnos je nejistý.",
      "Pozor na to, jak přísný screening fond používá. Volnější varianty (ESG Screened, Enhanced) se od klasického indexu liší jen mírně a hodí se těm, kdo chtějí zachovat široké tržní pokrytí. Přísnější SRI a Paris-Aligned fondy vyloučí mnohem víc firem, jsou koncentrovanější a mohou se výkonností od trhu odchýlit oběma směry. Preferujte velké fondy (nad 500 mil. EUR) s dobrou likviditou a úzkým rozpětím nákup/prodej a vždy si ověřte metodiku indexu, ne jen marketingový název."
    ],
    "forWhom": "Hodí se pro dlouhodobé investory, kteří chtějí sladit portfolio se svými hodnotami (klima, vyloučení kontroverzních oborů) a přitom si udržet široce diverzifikované, levné a likvidní řešení. Sedne i těm, kdo chtějí snížit expozici vůči fosilním palivům. Nevhodné je pro investory, kteří očekávají vyšší výnos jen kvůli nálepce ESG, chtějí přesně kopírovat celý trh bez odchylek, nebo jim vadí riziko greenwashingu a to, že definice ESG se u jednotlivých poskytovatelů výrazně liší.",
    "risks": [
      "Nejednotnost a greenwashing: neexistuje jedna závazná definice ESG. Dva fondy se stejnou nálepkou mohou mít odlišné složení i skóre a marketingový název (Green, Sustainable) nemusí odpovídat reálné přísnosti screeningu. Vždy je nutné číst metodiku indexu.",
      "Sektorová a faktorová odchylka: screening vyřazuje energetiku a další obory, takže se výkonnost může od širokého trhu lišit. V letech s růstem cen ropy může ESG fond zaostávat, jindy naopak předběhnout.",
      "Koncentrace u přísných variant: SRI a Paris-Aligned fondy drží mnohem méně firem a nadvažují technologie a growth tituly, což zvyšuje citlivost na propady těchto sektorů.",
      "Měnové riziko: fondy se obchodují v EUR či USD, výnos v korunách proto ovlivňuje pohyb kurzu CZK. Zajištění do koruny u ESG ETF prakticky není dostupné."
    ],
    "faqs": [
      {
        "q": "Které ESG ETF patří mezi největší a nejlevnější?",
        "a": "Mezi největší v Evropě patří iShares MSCI USA ESG Enhanced CTB (IE00BHZPJ890) s objemem kolem 11 mld. EUR a TER okolo 0,07 %, dále JPMorgan US Research Enhanced Index Equity ESG (IE00BF4G7076) a Xtrackers MSCI USA ESG (IE00BFMNPS42) s TER kolem 0,15 %. Nejlevnější screened varianty se dnes poplatkově blíží běžným indexovým fondům."
      },
      {
        "q": "Znamená ESG automaticky nižší výnos?",
        "a": "Ne nutně. Historicky se výnosy širokých ESG fondů od klasických indexů liší jen mírně, protože jejich složení je podobné. V konkrétních obdobích ale mohou zaostat (například při růstu cen ropy, protože nedrží energetiku) nebo naopak předběhnout. Rozhodující je spíš přísnost screeningu než samotná ESG nálepka."
      },
      {
        "q": "Jaký je rozdíl mezi ESG Screened, Enhanced a SRI?",
        "a": "Screened a Enhanced varianty jen vyloučí nejhorší firmy a mírně upraví váhy, takže zůstávají blízko širokému trhu. SRI a Paris-Aligned (PAB) fondy jsou výrazně přísnější, drží podstatně méně titulů a od trhu se odchylují víc. Pro pasivní jádro portfolia bývá vhodnější volnější screened varianta, přísnější fondy jsou koncentrovanější."
      },
      {
        "q": "Mají ESG ETF akumulační i distribuční verzi?",
        "a": "Ano, u větších fondů obvykle existují obě třídy. Pro dlouhodobé budování majetku je praktičtější akumulační (ACC) verze, která dividendy automaticky reinvestuje a odkládá tak okamžik zdanění. Distribuční (DIST) verze se hodí, pokud chcete pravidelný příjem."
      },
      {
        "q": "Jak se ESG ETF daní v Česku?",
        "a": "Platí stejná pravidla jako u ostatních ETF. Zisk z prodeje je osvobozen po splnění tříletého časového testu držby, případně lze využít hodnotový limit pro příjmy z prodeje cenných papírů. Dividendy z distribučních tříd se daní. Konkrétní situaci je vhodné konzultovat s daňovým poradcem."
      },
      {
        "q": "Jak poznám greenwashing u ESG fondu?",
        "a": "Nespoléhejte na název, ale otevřete si dokument o metodice indexu (index factsheet) a podívejte se, jaká odvětví fond skutečně vylučuje a jak počítá ESG skóre. Porovnejte i reálné složení: pokud se od klasického indexu liší jen minimálně, jde spíš o kosmetickou úpravu než o zásadní udržitelný přístup."
      }
    ]
  },
  "nejlepsi-evropske-etf": {
    "introTitle": "Evropské ETF: expozice k vyspělým trhům starého kontinentu",
    "intro": [
      "Evropské ETF sledují akciové indexy vyspělých evropských trhů. Nejčastěji jde o tři velké indexy: STOXX Europe 600 (přibližně 600 firem ze 17 zemí včetně Británie), MSCI Europe (zhruba 430 velkých a středních firem z 15 zemí, bez Británie) a FTSE Developed Europe. Skladbou dominují německé, francouzské, švýcarské, britské a nizozemské koncerny jako Novo Nordisk, ASML, Nestlé, LVMH nebo SAP. Oproti americkým indexům je zde nižší váha technologických gigantů a naopak vyšší podíl zdravotnictví, průmyslu, financí a spotřebního zboží.",
      "Pro Čecha jsou evropské ETF zajímavé hlavně jako protiváha k americké dominanci v celosvětových fondech. Standardní světový index (MSCI ACWI, FTSE All-World) má dnes v USA přes 60 procent, kdežto samostatný evropský ETF přidá do portfolia region, který je geograficky i měnově blíž. Většina fondů je denominovaná v eurech, takže Čech nese kurzové riziko EUR/CZK místo dolarového. Klíčové tituly jako Amundi Stoxx Europe 600 (LYP6), iShares Core MSCI Europe (SMEA) nebo Vanguard FTSE Developed Europe (VERX) jsou běžně dostupné u DEGIRO, XTB, Trading 212 i Interactive Brokers, řada z nich i bez poplatku za nákup."
    ],
    "verdict": [
      "Pro dlouhodobé budování majetku doporučujeme akumulační (ACC) variantu s irským domicilem (ISIN začínající na IE) nebo lucemburským (LU). Akumulace reinvestuje dividendy automaticky, což je u evropských firem podstatné, protože evropské akcie tradičně vyplácejí vyšší dividendy než americké, a v distribuční verzi byste je museli v Česku danit. U TER se v této kategorii pohybujeme velmi nízko: Amundi Stoxx Europe 600 nabízí zhruba 0,07 procenta, Vanguard FTSE Developed Europe okolo 0,10 procenta a iShares Core MSCI Europe kolem 0,12 procenta. Rozdíly jsou tak malé, že by neměly být jediným kritériem.",
      "Pokud chcete co nejširší záběr včetně britských akcií a menších firem, sáhněte po STOXX Europe 600. Kdo naopak Británii po brexitu vynechat chce a stačí mu velké a střední firmy eurozóny a okolí, zvolí MSCI Europe. Preferujte fondy s objemem alespoň jednotky miliard eur kvůli likviditě a nízkému rozdílu mezi nákupní a prodejní cenou; u zmíněné trojice to není problém, každý má přes 10 miliard eur."
    ],
    "forWhom": "Hodí se investorovi, který už má jádro portfolia ve světovém nebo americkém ETF a chce cíleně posílit expozici k Evropě, snížit koncentraci v USA a přiblížit měnové riziko blíž koruně (EUR místo USD). Sedne také tomu, kdo věří v hodnotové a dividendové evropské tituly. Naopak jako jediná a hlavní investice evropský ETF nestačí, protože vynechává USA, Asii i rozvíjející se trhy. Nevhodný je i pro investora, který nechce řešit rozdíl mezi indexy a domicily a preferuje jeden celosvětový fond typu All-World.",
    "risks": [
      "Nižší dlouhodobý růst než USA: Evropa za poslední dekádu výrazně zaostávala za americkými akciemi kvůli menšímu podílu technologií a pomalejšímu růstu firem. Regionální sázka na Evropu tak může dlouhodobě podvýkonávat globální trh.",
      "Kurzové riziko EUR/CZK: fondy jsou zpravidelně v eurech. Posílení koruny vůči euru sníží korunový výnos i u rostoucího fondu; naopak oslabení koruny výnos nafoukne.",
      "Rozdíly ve složení indexů: STOXX 600 obsahuje britské akcie (kolem 20 procent), MSCI Europe a část FTSE fondů je vynechávají. Dva fondy 'na Evropu' tak mohou mít znatelně odlišnou skladbu i výkon; před nákupem ověřte složení.",
      "Vyšší sektorová koncentrace do zdravotnictví, financí a spotřebního zboží a závislost na několika megafirmách (Novo Nordisk, ASML, Nestlé, LVMH) znamená, že problémy jednoho titulu mohou index znatelně stáhnout."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi STOXX Europe 600 a MSCI Europe?",
        "a": "STOXX Europe 600 pokrývá zhruba 600 firem ze 17 zemí včetně Británie, která tvoří kolem 20 procent. MSCI Europe má přibližně 430 velkých a středních firem z 15 zemí a Británii zpravidla nezahrnuje. STOXX je tedy širší a obsahuje více menších firem."
      },
      {
        "q": "Zahrnují evropské ETF britské akcie?",
        "a": "Záleží na indexu. STOXX Europe 600 britské akcie obsahuje (přibližně pětinu fondu). MSCI Europe a některé FTSE varianty je po brexitu naopak vynechávají. Před nákupem si vždy ověřte složení konkrétního fondu podle jeho indexu."
      },
      {
        "q": "Který evropský ETF má nejnižší poplatek?",
        "a": "Z hlavní trojice má nejnižší TER Amundi Stoxx Europe 600 (LYP6) kolem 0,07 procenta ročně. Následuje Vanguard FTSE Developed Europe (VERX) okolo 0,10 procenta a iShares Core MSCI Europe (SMEA) kolem 0,12 procenta. Rozdíly jsou minimální a neměly by být jediným kritériem."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční verzi jako Čech?",
        "a": "Pro dlouhodobé spoření je praktičtější akumulační (ACC) verze, protože dividendy reinvestuje uvnitř fondu a nemusíte je průběžně danit. Evropské firmy vyplácejí relativně vysoké dividendy, takže u distribuční verze počítejte s daňovou administrativou. Distribuční (DIST) verze dává smysl, pokud chcete pravidelný hotovostní příjem."
      },
      {
        "q": "Potřebuji evropský ETF, když už mám celosvětový fond?",
        "a": "Ne nutně. Světové ETF (například na MSCI ACWI nebo FTSE All-World) už Evropu obsahují, typicky kolem 12 až 15 procent. Samostatný evropský ETF má smysl jen tehdy, když chcete váhu Evropy cíleně zvýšit nad tržní úroveň a snížit dominanci USA."
      },
      {
        "q": "V jaké měně evropské ETF nakupuji a jaké to má daňové dopady?",
        "a": "Fondy jsou zpravidla denominovány v eurech, u brokera je ale často koupíte i za koruny s automatickou konverzí. Pro osvobození od daně z výnosu v ČR platí časový test 3 roky držení; kurzové zisky i ztráty EUR/CZK jsou součástí celkového výsledku a je vhodné vést si evidenci nákupů."
      }
    ]
  },
  "nejlepsi-financni-etf": {
    "introTitle": "Finanční ETF: banky, pojišťovny a finanční služby v jednom fondu",
    "intro": [
      "Finanční ETF investují do sektoru bank, pojišťoven, správců aktiv a burz. Jedním nákupem tak získáte podíl v desítkách firem od amerických gigantů jako JPMorgan Chase, Bank of America a Wells Fargo přes evropské banky ING, Santander a BNP Paribas až po pojišťovny a poskytovatele plateb typu Visa a Mastercard. Podle zvoleného indexu jde buď o čistě bankovní expozici (STOXX Europe 600 Banks, Euro Stoxx Banks), nebo o širší finanční sektor včetně pojišťoven a plateb (S&P 500 Financials).",
      "Klíčová vlastnost tohoto sektoru je citlivost na úrokové sazby a hospodářský cyklus. Banky vydělávají na rozdílu mezi úrokem z úvěrů a úrokem z vkladů (čistá úroková marže), takže období vyšších sazeb jim obvykle prospívá. Naopak v recesi rostou nesplácené úvěry a zisky bank klesají. Proto se finanční ETF chovají jinak než široký index typu S&P 500 nebo MSCI World a hodí se spíš jako sektorová sázka než jako jádro portfolia.",
      "Pro českého investora je dobrá zpráva dostupnost. Zmíněné fondy jsou evropské UCITS ETF obchodované v EUR na burzách jako Xetra a jsou běžně k mání u brokerů dostupných v Česku (DEGIRO, XTB, Trading 212, Interactive Brokers či Portu). Investujete v korunách, ale fondy drží akcie v dolarech i eurech, takže výsledný výnos ovlivňuje i pohyb kurzu CZK vůči USD a EUR."
    ],
    "verdict": [
      "U finančních ETF sledujte hlavně tři věci: šíři indexu, domicil a poplatek. Nejlevnější z běžně dostupných je iShares S&P 500 Financials Sector UCITS ETF (IUFS, ISIN IE00B4JNQZ49) s TER pouhých 0,15 % a velikostí kolem 2,1 mld. EUR. Pokrývá celý americký finanční sektor, tedy nejen banky, ale i pojišťovny, platební firmy a burzy, a je díky tomu vyváženější než čistě bankovní fondy. Kdo chce sázet konkrétně na evropské banky, sáhne po iShares STOXX Europe 600 Banks (EXS1, DE000A0F5UJ7, TER 0,47 %) nebo levnějším Amundi Euro Stoxx Banks (CB7, LU1829219390, TER 0,30 %) — oba patří k největším bankovním ETF v Evropě s objemem kolem 2,9 mld. EUR.",
      "Preferujte domicil Irsko nebo Lucembursko (ISIN začínající IE nebo LU) kvůli výhodnějšímu zdanění dividend uvnitř fondu u amerických akcií. U volby akumulační vs. distribuční varianty rozhoduje účel: pro dlouhodobé zhodnocení bez starostí s reinvesticí je praktičtější akumulační třída (např. Amundi Euro Stoxx Banks Acc), pro pravidelný příjem distribuční (iShares řady EXS1 a IUFS vyplácejí dividendy). Dostatečná velikost fondu (nad 1 mld. EUR) i solidní likvidita jsou u všech tří zmíněných splněny."
    ],
    "forWhom": "Finanční ETF se hodí investorovi, který už má vybudované široce diverzifikované jádro portfolia (např. celosvětový akciový ETF) a chce k němu přidat sektorovou sázku — typicky s názorem, že prostředí vyšších úrokových sazeb bude bankám prospívat, nebo že jsou evropské banky podhodnocené. Vyžaduje toleranci k vyšší volatilitě a delší investiční horizont (ideálně 7+ let), aby přečkal cyklické propady. Nehodí se pro konzervativní investory hledající stabilitu, pro začátečníky jako první a jediná investice, ani pro každého, kdo nechce aktivně sledovat vývoj úrokových sazeb a kondice bankovního sektoru.",
    "risks": [
      "Vysoká koncentrace do jednoho sektoru. Na rozdíl od širokého indexu tu chybí diverzifikace napříč odvětvími — když padají banky, padá celý fond. Čistě bankovní ETF (Euro Stoxx Banks) jsou koncentrované navíc do několika málo velkých bank.",
      "Silná citlivost na úrokové sazby a hospodářský cyklus. Obrat v politice centrálních bank směrem k nižším sazbám, zpomalení ekonomiky nebo vlna nesplácených úvěrů dokážou zisky bank rychle srazit. Sektor patří v recesích k nejhůře zasaženým.",
      "Regulatorní a systémové riziko. Bankovní sektor je přísně regulován a citlivý na krize důvěry — připomínkou je kolaps několika amerických bank a záchrana Credit Suisse v roce 2023, kdy bankovní ETF prudce klesla během několika dní.",
      "Měnové riziko pro korunového investora. Fondy drží akcie v USD a EUR, takže posílení koruny snižuje váš výnos v CZK nezávisle na tom, jak si vedou samotné akcie bank."
    ],
    "faqs": [
      {
        "q": "Jaké jsou nejlepší finanční ETF pro rok 2026?",
        "a": "K nejzajímavějším patří iShares S&P 500 Financials Sector (IUFS, IE00B4JNQZ49) s nejnižším TER 0,15 % pokrývající celý americký finanční sektor, dále iShares STOXX Europe 600 Banks (EXS1, DE000A0F5UJ7) jako největší evropský bankovní ETF a levnější Amundi Euro Stoxx Banks (CB7, LU1829219390) s TER 0,30 %. Volba závisí na tom, zda chcete americký, nebo evropský finanční sektor."
      },
      {
        "q": "Jaký je rozdíl mezi bankovním ETF a širším finančním ETF?",
        "a": "Čistě bankovní ETF jako STOXX Europe 600 Banks nebo Euro Stoxx Banks drží jen akcie bank, jsou tedy koncentrovanější a citlivější na úrokové sazby. Širší finanční ETF typu S&P 500 Financials zahrnuje kromě bank i pojišťovny, správce aktiv, burzy a platební firmy (Visa, Mastercard), takže je o něco vyváženější a méně závislý na jedné skupině firem."
      },
      {
        "q": "Vyplácejí finanční ETF dividendy a jak se daní?",
        "a": "Ano, banky mají tradici výplaty dividend a řada finančních ETF je distribuuje (např. iShares EXS1 a IUFS), zatímco akumulační varianty (Amundi Euro Stoxx Banks Acc) je reinvestují. Přijaté dividendy z distribučních ETF podléhají v ČR 15% dani, kterou si investor vypořádá v daňovém přiznání; akumulační fondy tuto průběžnou daňovou povinnost odkládají."
      },
      {
        "q": "Platí u finančních ETF časový test pro osvobození od daně?",
        "a": "Ano, na kapitálový zisk z prodeje ETF se v ČR vztahuje časový test — držíte-li podíly déle než 3 roky, je zisk z prodeje osvobozen od daně z příjmů. To platí i pro finanční ETF a je to jeden z důvodů, proč sektorové sázky dělat spíš dlouhodobě. Časový test se týká zisku z prodeje, ne průběžně vyplácených dividend."
      },
      {
        "q": "Hodí se finanční ETF jako jádro portfolia?",
        "a": "Ne. Kvůli koncentraci do jednoho cyklického sektoru se finanční ETF hodí jako doplněk (satelit) k široce diverzifikovanému jádru, například celosvětovému akciovému ETF. Jako jediná investice by neúměrně zvyšovaly riziko a závislost na kondici bank a úrokových sazbách."
      },
      {
        "q": "Proč záleží na domicilu fondu (Irsko vs. Německo)?",
        "a": "Domicil ovlivňuje zdanění dividend uvnitř fondu. Irské fondy (ISIN začíná IE, např. iShares S&P 500 Financials) mají díky daňové smlouvě s USA sníženou srážkovou daň z amerických dividend na 15 %, což u fondů s americkými akciemi zvyšuje čistý výnos. U čistě evropských bankovních ETF (domicil DE nebo LU) je tento rozdíl méně podstatný, protože nedrží americké akcie."
      }
    ]
  },
  "nejlepsi-ftse100-etf": {
    "introTitle": "FTSE 100 ETF: sázka na britské blue chips a dividendy",
    "intro": [
      "FTSE 100 je hlavní index londýnské burzy, který sdružuje 100 největších společností kotovaných v Británii. Nejde ale o čistou sázku na britskou ekonomiku – většina firem v indexu má silně globální tržby. Najdete tu energetické giganty Shell a BP, farmaceutické AstraZeneca a GSK, těžařskou Rio Tinto a Glencore, banku HSBC, spotřební zboží Unilever i tabákovou British American Tobacco. Index se tak chová spíš jako koncentrovaný koš globálních 'starých' odvětví (energie, těžba, banky, léčiva) než jako zrcadlo dění na britských ostrovech.",
      "Pro Čecha jsou dvě věci klíčové. Za prvé měna: FTSE 100 se obchoduje a počítá v britských librách (GBP), takže i když ETF koupíte za koruny nebo eura, jste vystaveni pohybu GBP. Za druhé profil výnosu – FTSE 100 je historicky jeden z nejštědřejších velkých indexů na dividendy, dividendový výnos se dlouhodobě pohybuje kolem 3,5–4 % ročně, což je výrazně více než u globálních nebo amerických indexů. Celkový výnos indexu byl přitom dlouhodobě spíše skromný, řádově kolem 6 % ročně za posledních 20 let, protože v indexu chybí velké technologické firmy tahnoucí americké trhy.",
      "Nabídka UCITS ETF na FTSE 100 je u brokerů dostupných v Česku (DEGIRO, XTB, Trading 212, Interactive Brokers) dobrá. Nejznámější jsou iShares Core FTSE 100 (ISF, distribuční v GBP), Vanguard FTSE 100 (VUKE/VUKG) a varianty se zajištěním do eura. Vedle FTSE 100 existuje i FTSE 250 (iShares MIDD) pro střední firmy a FTSE All-Share pro širší pokrytí celého britského trhu."
    ],
    "verdict": [
      "Pro většinu českých investorů dává největší smysl velký, likvidní FTSE 100 ETF od zavedeného poskytovatele – typicky iShares Core FTSE 100 nebo Vanguard FTSE 100. TER se u těchto fondů pohybuje velmi nízko (kolem 0,07–0,10 %), takže poplatky nejsou rozhodujícím kritériem; důležitější je velikost fondu a úzký spread při nákupu. Doménu volte irskou (ISIN začínající IE), která má výhodnější srážkovou daň z dividend uvnitř fondu; některé starší tituly ale mají britský domicil (ISIN GB), což je u britského indexu specifikum a v praxi funguje také dobře.",
      "Volba mezi akumulační (Acc) a distribuční (Dist) verzí závisí na účelu. Protože FTSE 100 je hlavně dividendový příběh, jsou distribuční třídy (např. ISF) oblíbené u lidí, kteří chtějí reálnou hotovost. Pro dlouhodobé budování majetku a jednodušší české zdanění je ale praktičtější akumulační verze – reinvestuje dividendy automaticky a odpadá starost s danění vyplacených dividend každý rok. Pokud nechcete nést měnové riziko libry, existují i EUR-hedged varianty (např. iShares Core FTSE 100 EUR Hedged), za zajištění ale platíte mírně vyšším TER a dlouhodobě i nákladem na zajištění."
    ],
    "forWhom": "FTSE 100 ETF se hodí investorům, kteří chtějí doplnit globální nebo americké portfolio o hodnotově laděnou, dividendově štědrou složku a záměrně vyhledávají expozici na energie, těžbu, banky a léčiva. Sedne také těm, kdo chtějí pravidelný dividendový příjem (distribuční verze). Naopak jako jediná nebo hlavní pozice se nehodí – index je sektorově koncentrovaný, postrádá technologie a dlouhodobě zaostával za globálním trhem. Pro začátečníka hledajícího jeden hlavní fond dává větší smysl široký světový ETF (např. na MSCI World nebo FTSE All-World) a FTSE 100 přidat až jako vědomý doplněk.",
    "risks": [
      "Měnové riziko libry: index je v GBP a posílení koruny vůči libře vám ukrojí z výnosu i u fondu koupeného za CZK. EUR-hedged varianty riziko tlumí jen vůči euru, ne vůči koruně.",
      "Sektorová koncentrace: FTSE 100 je silně vážený na energie, těžbu, banky a léčiva a téměř postrádá technologie. Několik gigantů (Shell, BP, AstraZeneca, HSBC, Unilever) tvoří velkou část indexu, což zvyšuje závislost na jejich osudu i na cenách komodit.",
      "Dlouhodobé zaostávání: za poslední dekádu FTSE 100 výnosově zaostal za globálními i americkými indexy. Vysoká dividenda může zakrývat pomalejší růst kapitálové hodnoty.",
      "Nezaměňte indexy: FTSE 100 (velké firmy), FTSE 250 (střední firmy, více navázané na domácí britskou ekonomiku) a FTSE All-Share se chovají odlišně. Nákup 'FTSE' ETF bez ověření, který index sleduje, může vést k jinému riziku, než čekáte."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi FTSE 100, FTSE 250 a FTSE All-Share?",
        "a": "FTSE 100 sdružuje 100 největších firem na londýnské burze, převážně s globálními tržbami. FTSE 250 zahrnuje dalších 250 středně velkých společností, které jsou více navázané na domácí britskou ekonomiku. FTSE All-Share kombinuje obojí a pokrývá prakticky celý britský trh, takže nabízí nejširší diverzifikaci."
      },
      {
        "q": "Je FTSE 100 sázka na britskou ekonomiku?",
        "a": "Jen částečně. Velká část firem v indexu (Shell, BP, AstraZeneca, HSBC, Rio Tinto, Unilever) generuje většinu tržeb mimo Británii, často v dolarech. FTSE 100 proto reaguje spíš na světovou poptávku, ceny komodit a kurz libry než na britský HDP. Kdo chce čistě domácí britskou expozici, sáhne spíš po FTSE 250."
      },
      {
        "q": "Mám vybrat akumulační, nebo distribuční verzi?",
        "a": "Distribuční verze (např. ISF) vyplácí dividendy v hotovosti a hodí se pro pravidelný příjem – FTSE 100 patří k dividendově nejštědřejším indexům. Akumulační verze dividendy automaticky reinvestuje, což je pohodlnější pro dlouhodobý růst a jednodušší z hlediska českého danění, protože neřešíte každoroční příjem z vyplacených dividend."
      },
      {
        "q": "Jak funguje měnové riziko a pomůže zajištění do eura?",
        "a": "Index je v librách, takže nesete riziko pohybu GBP i při nákupu za koruny. EUR-hedged varianty (např. iShares Core FTSE 100 EUR Hedged) odstraňují kolísání vůči euru, ale ne vůči koruně, a za zajištění platíte o něco vyšším TER. Pro dlouhodobého investora bývá jednodušší měnové riziko nezajišťovat a brát ho jako součást diverzifikace."
      },
      {
        "q": "Kde FTSE 100 ETF koupím a v jaké měně?",
        "a": "Fondy jako iShares Core FTSE 100 (ISF) nebo Vanguard FTSE 100 (VUKE/VUKG) najdete u brokerů dostupných v Česku – DEGIRO, XTB, Trading 212 i Interactive Brokers. Obchodují se nejčastěji v GBP nebo EUR; broker vám nákup přepočítá z korun, počítejte proto s poplatkem za konverzi měny."
      },
      {
        "q": "Jak se v Česku daní zisk z FTSE 100 ETF?",
        "a": "Platí standardní česká pravidla: zisk z prodeje je osvobozen po splnění tříletého časového testu, případně do limitu příjmů z prodeje cenných papírů daného zákonem. Vyplacené dividendy z distribuční verze se daní v roce, kdy je obdržíte, u akumulační verze tato starost odpadá. U konkrétní situace se vyplatí ověřit aktuální limity nebo se poradit s daňovým poradcem."
      }
    ]
  },
  "nejlepsi-growth-etf": {
    "introTitle": "Growth ETF: sázka na rychle rostoucí firmy",
    "intro": [
      "Growth (růstové) ETF investují do firem, které rostou rychleji než trh jako celek - typicky mají nadprůměrný růst tržeb a zisků a peníze místo dividend reinvestují zpět do expanze. Index proto vybírá akcie podle růstových metrik (růst tržeb a zisku, marže, momentum), ne podle levného ocenění. V praxi to znamená velkou váhu technologických a spotřebitelských gigantů typu Apple, Microsoft, Nvidia, Amazon nebo Meta a naopak minimum bank, energetiky či utilit.",
      "Nejrozšířenější benchmark v UCITS světě je Russell 1000 Growth - růstová polovina tisícovky největších amerických firem. Konkrétně to pokrývá Amundi Russell 1000 Growth (ticker RS1G, ISIN IE0005E8B9S4, TER 0,19 %, přes 560 mil. EUR) jako největší pure growth factor fond, iShares Russell 1000 Growth (IUSG, IE000NITTFF2) a aktivně řízený JPMorgan Active US Growth (JGRO, IE0005CH3U28). Vedle Russellu do kategorie spadají i faktorové fondy typu iShares MSCI World Momentum a růstově laděné indexy MSCI USA Growth.",
      "Pro českého investora jsou tyto fondy dostupné běžně u DEGIRO, XTB, Trading 212 nebo Fio e-Broker. Prakticky všechny mají irský domicil (ISIN začíná na IE), obchodují se v EUR nebo USD, takže reálné zhodnocení v korunách ovlivňuje i pohyb kurzu CZK/USD. Vzhledem k drtivé americké váze jde o dost koncentrovanou sázku na dolarový trh - to je potřeba brát v úvahu při skládání celého portfolia."
    ],
    "verdict": [
      "Pro dlouhodobé držení jednoznačně preferujte akumulační (accumulating) variantu s irským domicilem - growth firmy stejně skoro nevyplácejí dividendy, takže distribuční třída nedává smysl a akumulace navíc automaticky reinvestuje to málo, co přijde, bez zdanění na úrovni fondu. Irský domicil zajišťuje výhodnější 15% srážkovou daň z amerických dividend díky smlouvě mezi Irskem a USA.",
      "U poplatků platí, že širokému Russell 1000 Growth stačí TER kolem 0,19 % (Amundi RS1G je zde nejlevnější) - za pasivní faktorový fond víc platit nemusíte. Aktivní JPMorgan Active US Growth má vyšší nákladovost, kterou musí ospravedlnit výběrem akcií. Hlídejte i velikost fondu a likviditu: fondy pod zhruba 100 mil. EUR nesou vyšší riziko sloučení nebo zrušení a mívají širší rozpětí nákup/prodej. Pozor také na to, co 'growth' u konkrétního fondu vlastně znamená - Russell Growth, MSCI Growth a momentum indexy mají odlišné složení i chování."
    ],
    "forWhom": "Hodí se pro investory s dlouhým horizontem (ideálně 10+ let), kteří chtějí v rámci akciové části portfolia zvýšit sázku na inovace a technologie a unesou výrazně vyšší kolísání i hlubší propady než u širokého trhu. Dává smysl spíš jako doplněk (typicky 10-30 % akciové složky) k jádru z celosvětového nebo S&P 500 ETF, ne jako jediná pozice. Nevhodné je pro začátečníky, kteří teprve budují základ portfolia, pro konzervativní investory, pro lidi s horizontem do pár let a pro ty, kdo chtějí pravidelný dividendový příjem - growth firmy dividendy prakticky nevyplácejí.",
    "risks": [
      "Koncentrace do několika technologických titulů: prvních deset firem tvoří u Russell Growth často 50 % a více fondu, takže výkon do velké míry určuje pár akcií (Apple, Microsoft, Nvidia). Diverzifikace je tu jen zdánlivá.",
      "Citlivost na úrokové sazby a ocenění: growth akcie se obchodují za vysoké P/E (kolem 28x i více), a když rostou sazby nebo klesnou očekávání zisků, dopadají tvrději než levnější value akcie - propady bývají hlubší a delší.",
      "Riziko rotace ze stylu growth do value: growth a value se v cyklech střídají a mohou několik let výrazně zaostávat (jako v letech 2000-2006 nebo 2022). Kdo nakoupí na vrcholu růstového cyklu, může dlouho čekat na návrat.",
      "Měnové a geografické riziko: fondy jsou drtivě americké a v USD, takže výnos v korunách ovlivňuje kurz CZK/USD a jste závislí na jediném trhu."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi Growth a Value ETF?",
        "a": "Growth ETF sázejí na rychle rostoucí firmy s vysokým oceněním, které reinvestují zisk místo dividend - typicky technologie. Value ETF naopak hledají levné, podhodnocené akcie s nižším P/E a často vyšší dividendou. Growth má historicky vyšší potenciál i vyšší kolísání, value bývá defenzivnější v poklesech."
      },
      {
        "q": "Vyplácejí Growth ETF dividendy?",
        "a": "Prakticky ne, nebo jen minimálně. Růstové firmy zisky reinvestují do expanze, takže dividendový výnos bývá pod 1 %. Proto u této kategorie volte akumulační variantu - cílem je růst hodnoty, ne pravidelný příjem."
      },
      {
        "q": "Který Growth ETF má nejnižší poplatky?",
        "a": "Z hlavních fondů má nejnižší TER Amundi Russell 1000 Growth (RS1G, IE0005E8B9S4) na úrovni 0,19 %. iShares Russell 1000 Growth (IUSG) je srovnatelný, aktivně řízený JPMorgan Active US Growth (JGRO) je dražší, protože jde o aktivní správu."
      },
      {
        "q": "Jsou Growth ETF vhodné pro začátečníky?",
        "a": "Jako jediná pozice spíš ne - kolísají víc než široký trh a v nevhodné fázi cyklu mohou roky zaostávat. Rozumnější je nejdřív postavit jádro z celosvětového nebo S&P 500 ETF a growth přidat jako doplněk v řádu desítek procent akciové složky."
      },
      {
        "q": "Jak se v Česku daní zisk z Growth ETF?",
        "a": "Platí standardní pravidla pro akciové ETF: zisk z prodeje je osvobozen od daně z příjmu, pokud fond držíte déle než 3 roky (časový test), případně při ročním objemu prodejů do 100 000 Kč. Akumulační varianta je administrativně jednodušší, protože neřešíte průběžné dividendy."
      },
      {
        "q": "Není lepší koupit rovnou technologický nebo Nasdaq ETF?",
        "a": "Záleží na záměru. Growth ETF (Russell 1000 Growth) je širší než čistě technologický fond - obsahuje i spotřebitelské a zdravotnické růstové firmy, takže je o něco méně koncentrovaný než tech nebo Nasdaq 100. Přesto se složení hodně překrývá kvůli velké váze technologických gigantů v obou případech."
      }
    ]
  },
  "nejlepsi-healthcare-etf": {
    "introTitle": "Healthcare ETF: defenzivní sektor tažený stárnutím populace a inovacemi",
    "intro": [
      "Healthcare ETF sdružují akcie zdravotnických firem do jednoho fondu - od farmaceutických gigantů (Johnson & Johnson, Eli Lilly, Novo Nordisk, Roche, Novartis, Pfizer) přes výrobce zdravotnických přístrojů (Abbott, Medtronic, Thermo Fisher) až po pojišťovny a poskytovatele péče (UnitedHealth). Sektor bývá historicky považován za defenzivní: poptávka po lécích a péči roste bez ohledu na hospodářský cyklus, protože lidé neodkládají léčbu podle stavu ekonomiky. To se projevuje relativně stabilními tržbami a nadprůměrnými maržemi u zavedených firem.",
      "Dlouhodobým tahounem je demografie. Populace v USA, Evropě i Japonsku stárne a se stárnutím prudce roste spotřeba léků, operací a chronické péče. K tomu se přidává inovační vlna - obezitní a diabetická léčiva na bázi GLP-1, imunoonkologie, genové terapie. To ovšem znamená, že výkonnost sektoru je v posledních letech silně koncentrovaná do několika inovativních firem, ne rovnoměrně rozprostřená.",
      "Pro českého investora jde zpravidla o eurové, v Irsku domicilované UCITS ETF (kupované přes Degiro, XTB, Trading 212, Fio e-Broker či Interactive Brokers). Podkladové akcie jsou převážně americké a švýcarské, takže hlavní měnovou expozicí je dolar, nikoli euro fondu - koruna proti dolaru tak ovlivní vaši reálnou korunovou výkonnost víc než měna, v níž ETF nakupujete. Sektorové ETF berte jako doplněk k široce diverzifikovanému jádru portfolia, ne jako jeho náhradu."
    ],
    "verdict": [
      "Pro většinu lidí dává největší smysl široký globální healthcare fond typu MSCI World Health Care (např. Xtrackers XDWH, IE00BM67HK77, TER 0,25 %), který drží 100+ firem napříč USA, Evropou i Japonskem a nespoléhá jen na americký trh. Kdo chce nejnižší náklady a nevadí mu čistě americká expozice, sáhne po iShares S&P 500 Health Care Sector (IUHC, IE00B43HR379) s TER kolem 0,15 %. Regionální evropskou variantou je iShares MSCI Europe Health Care (IE00BMW42181). U sektorových fondů dbejte na velikost nad zhruba 100 mil. EUR a slušnou likviditu - menší tematické fondy hrozí uzavřením.",
      "U dlouhodobé investice bez potřeby průběžného příjmu preferujte akumulační (Acc) třídu s irským domicilem: dividendy se reinvestují uvnitř fondu, odpadá administrativa a díky irské daňové smlouvě s USA je srážková daň z amerických dividend nižší (15 % místo 30 %). Distribuční (Dist) třídu volte jen tehdy, pokud chcete reálně vyplácené dividendy - u zdravotnictví jde ale spíš o růstový než výnosový sektor, takže dividendový motiv zde není hlavní."
    ],
    "forWhom": "Hodí se investorovi, který už má vybudované široké jádro portfolia (např. celosvětový akciový ETF) a chce cíleně navýšit váhu defenzivního, demograficky taženého sektoru s investičním horizontem alespoň 7-10 let. Sedne i tomu, kdo věří v dlouhodobý růst spotřeby zdravotní péče a snese sektorové výkyvy. Nevhodné je pro úplného začátečníka, který zatím nemá diverzifikované jádro, pro investory s krátkým horizontem a pro ty, kdo nechtějí sledovat regulatorní a politická rizika kolem cen léků.",
    "risks": [
      "Sektorová koncentrace: vyřazením ostatních odvětví přicházíte o diverzifikaci širokého trhu. Zdravotnictví může roky zaostávat za indexem (např. při technologických rallye), takže musíte unést dlouhá období podvýkonnosti.",
      "Regulační a politické riziko: ceny léků, reformy zdravotního pojištění v USA (Medicare, IRA) i evropské cenové regulace přímo dopadají na marže a mohou sektorem prudce zahýbat na základě volebních výsledků.",
      "Riziko klinických studií a patentových útesů: neúspěch klíčové studie nebo vypršení patentu na blockbuster lék dokáže srazit akcii jednotlivé firmy o desítky procent - u koncentrovanějších fondů to táhne dolů celý fond.",
      "Měnové riziko: většina podkladu je v dolarech, takže posílení koruny vůči USD sníží korunovou výkonnost bez ohledu na to, že ETF obchodujete v eurech."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi globálním a americkým healthcare ETF?",
        "a": "Globální fond (MSCI World Health Care, např. XDWH) drží firmy z USA, Evropy i Japonska - tedy i Roche, Novartis nebo Novo Nordisk vedle amerických gigantů. Americký fond (S&P 500 Health Care, IUHC) je čistě z USA a bývá levnější na TER. Pro první sektorovou pozici je globální varianta bezpečnější díky širšímu geografickému rozložení."
      },
      {
        "q": "Je healthcare ETF opravdu defenzivní i dnes?",
        "a": "Historicky ano - poptávka po péči je stabilní a firmy mají silné cash flow. V posledních letech je ale výkonnost hodně tažená úzkou skupinou inovativních firem (např. výrobci obezitních léčiv), takže sektor už není tak nudně stabilní jako dřív. Defenzivní charakter platí spíš v horizontu celého cyklu než rok od roku."
      },
      {
        "q": "Akumulační, nebo distribuční třída?",
        "a": "Pro dlouhodobé budování majetku volte akumulační (Acc) - dividendy se reinvestují automaticky uvnitř fondu, nemusíte je danit průběžně ani ručně reinvestovat. Distribuční (Dist) má smysl jen tehdy, když chcete reálně vyplácený příjem. U růstového zdravotnictví je akumulace obvyklá volba."
      },
      {
        "q": "Musím dividendy z healthcare ETF danit v Česku?",
        "a": "U akumulačního fondu se dividendy nevyplácejí, takže průběžně neřešíte nic. U distribučního zdaňujete přijaté dividendy v přiznání sazbou 15 %. Při prodeji ETF platí v ČR časový test - po více než 3 letech držení je zisk z prodeje osvobozen od daně z příjmu (u velkých objemů sledujte i limit osvobození)."
      },
      {
        "q": "Kolik z portfolia dát do healthcare ETF?",
        "a": "Jde o doplněk, ne o jádro. Rozumné bývá držet sektorovou sázku v řádu jednotek až maximálně 10-15 % portfolia, aby jedna sázka nerozhodovala o celkovém výsledku. Základ portfolia by měl tvořit široce diverzifikovaný celosvětový akciový fond."
      },
      {
        "q": "Kde healthcare ETF koupím a v jaké měně?",
        "a": "Běžně jsou dostupné u brokerů jako Degiro, XTB, Trading 212, Fio e-Broker nebo Interactive Brokers. Většina se obchoduje v eurech na evropských burzách, ale podkladové akcie jsou hlavně v dolarech - hlavní měnové riziko tedy nese kurz koruny vůči dolaru, ne vůči euru."
      }
    ]
  },
  "nejlepsi-japonske-etf": {
    "introTitle": "Japonské ETF: expozice na třetí největší akciový trh světa",
    "intro": [
      "Japonské ETF vám jedním nákupem otevřou dveře k akciím Toyoty, Sony, Nintenda, Keyence, SoftBanku či Mitsubishi. Japonsko je i po desetiletích stagnace jednou z největších ekonomik světa a jeho burza v Tokiu patří k nejlikvidnějším na planetě. Pro evropského investora je klíčové, že tuto expozici lze levně a daňově čistě získat přes evropské UCITS ETF s domicilem v Irsku nebo Lucembursku, aniž byste museli řešit japonské brokery či srážkovou daň napřímo.",
      "Naprostá většina fondů v této kategorii sleduje index MSCI Japan, který pokrývá zhruba 85 % japonského trhu velkých a středních firem (přibližně 230 titulů). Varianta MSCI Japan IMI jde ještě dál a přidává i malé firmy, takže obsahuje přes 1000 společností. Alternativou je slavný Nikkei 225, který je ale cenově vážený (o váze rozhoduje nominální cena akcie, ne velikost firmy), a proto se pro pasivní investování používá méně. Mezi likvidní a dostupné fondy patří iShares Core MSCI Japan IMI (JPNA, IE00B4L5YX21) s TER 0,12 %, Amundi Core MSCI Japan (LU1781541252) rovněž s TER 0,12 % a ESG varianta UBS MSCI Japan Climate Paris Aligned (IE000JHYO4T6) s TER 0,15 %.",
      "Japonské ETF dávají smysl jako doplněk globálního portfolia. Ve světovém indexu (MSCI World, FTSE All-World) tvoří Japonsko zpravidla jen 5–6 % váhy, takže samostatný japonský fond je způsob, jak tuto váhu cíleně navýšit. Pro Čecha jde o investici obchodovanou nejčastěji v eurech nebo dolarech, přičemž podkladová aktiva jsou v jenech. Prakticky všechny zmíněné fondy najdete u brokerů jako DEGIRO, XTB, Trading 212 nebo Interactive Brokers."
    ],
    "verdict": [
      "Pro dlouhodobého investora obvykle vítězí široký, akumulační fond s nízkým TER a irským domicilem. iShares Core MSCI Japan IMI (JPNA) je typický kandidát: kombinuje nejširší záběr trhu (velké, střední i malé firmy), TER 0,12 %, velký objem fondu v řádu miliard eur a dobrou likviditu. Akumulační třída (reinvestuje dividendy) je pro fázi budování majetku praktičtější než distribuční, protože se nemusíte starat o zdanění průběžně vyplácených dividend a využijete složené úročení.",
      "Distribuční variantu volte, jen pokud cíleně chcete pravidelný příjem. Irský domicil (ISIN začínající IE) je u japonských akciových ETF výhodný kvůli efektivnějšímu zdanění dividend na úrovni fondu. U výběru sledujte hlavně: čistotu a šíři indexu (MSCI Japan IMI vs. standard vs. Nikkei 225), TER, velikost fondu (ideálně stovky milionů eur a výše kvůli stabilitě a nízkému rozpětí) a to, zda jde o fyzickou replikaci. ESG/klima variantu jako UBS MSCI Japan Climate berte jen tehdy, pokud vám na tomto filtru záleží, protože se mírně odchyluje od celého trhu."
    ],
    "forWhom": "Japonské ETF se hodí investorovi, který už má postavené globální jádro portfolia (např. přes ETF na celý svět) a chce vědomě zvýšit váhu Japonska, případně vsadit na oživení japonské ekonomiky, corporate governance reformy a slabý jen podporující exportéry. Sedne i tomu, kdo chce diverzifikovat mimo dominantní americký trh. Naopak se nehodí úplnému začátečníkovi, který teprve začíná a měl by stavět na jednom globálním fondu, ani investorovi s krátkým horizontem nebo nízkou tolerancí ke kolísání kurzu jenu. Kdo nechce řešit jednotlivé regiony, je lépe obsloužen širokým světovým ETF, kde je Japonsko už zastoupeno.",
    "risks": [
      "Měnové riziko jenu: fondy drží japonská aktiva v JPY, ale vy investujete v EUR/USD/CZK. Oslabení jenu, které v posledních letech podporovalo japonské akcie, může zároveň ukrojit z výnosu přepočteného do koruny. Nezajištěné (unhedged) fondy toto riziko nesou plně.",
      "Sektorová a exportní koncentrace: index je silně navázaný na automobilky, průmysl a technologie (Toyota, Sony, Keyence). Japonské firmy jsou citlivé na globální poptávku a sílu jenu, takže při zpomalení světové ekonomiky nebo posílení jenu trpí exportéři.",
      "Demografie a strukturální stagnace: stárnoucí a klesající populace a desetiletí slabého domácího růstu jsou dlouhodobým brzdícím faktorem, který odlišuje Japonsko od trhů s růstovou demografií.",
      "Riziko jednoho regionu: samostatný japonský fond je koncentrovanější sázka než globální index. Bez dostatečného zbytku portfolia zvyšuje kolísavost a závislost na jediné ekonomice."
    ],
    "faqs": [
      {
        "q": "Je lepší MSCI Japan, nebo Nikkei 225?",
        "a": "Pro pasivní investování je obvykle vhodnější MSCI Japan, protože váží firmy podle tržní kapitalizace a pokrývá kolem 85 % trhu. Nikkei 225 je cenově vážený, takže o jeho složení nepřiměřeně rozhodují akcie s vysokou nominální cenou. Většina dostupných UCITS ETF proto sleduje MSCI Japan nebo jeho širší variantu IMI."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční japonské ETF?",
        "a": "Pro dlouhodobé budování majetku je praktičtější akumulační třída, která dividendy automaticky reinvestuje a podporuje složené úročení. Distribuční variantu zvolte jen tehdy, pokud chcete pravidelně vyplácený příjem. U akumulačního fondu navíc v ČR neřešíte zdanění průběžných dividend."
      },
      {
        "q": "Jak se japonské ETF daní v Česku?",
        "a": "Platí standardní česká pravidla pro cenné papíry. Zisk z prodeje ETF je osvobozen, pokud mezi nákupem a prodejem uplynou alespoň 3 roky (časový test), případně se uplatní roční hodnotový limit pro osvobození. U distribučních fondů se vyplácené dividendy daní. Konkrétní situaci si ověřte podle aktuálních pravidel nebo s daňovým poradcem."
      },
      {
        "q": "Potřebuji fond zajištěný proti pohybu jenu (hedged)?",
        "a": "Záleží na vašem názoru na jen. Nezajištěný fond nese měnové riziko: pokud jen oslabí vůči euru, sníží to váš výnos v přepočtu, i když japonské akcie porostou. Měnově zajištěná (EUR-hedged) třída toto riziko tlumí, ale za cenu vyšších nákladů. Pro dlouhodobý horizont volí mnoho investorů nezajištěnou variantu kvůli jednoduchosti a nižšímu TER."
      },
      {
        "q": "Kolik Japonska mám mít v portfoliu?",
        "a": "Ve světovém indexu má Japonsko zhruba 5–6 % váhy, což je rozumný orientační bod. Pokud chcete Japonsko cíleně nadvážit, obvykle stačí menší doplňková pozice; agresivnější sázky nad 10–15 % už výrazně zvyšují závislost na jediném regionu. Základ portfolia je vhodnější stavět na globálním fondu."
      },
      {
        "q": "Kde japonské ETF koupím a v jaké měně se obchodují?",
        "a": "Zmíněné fondy jako iShares Core MSCI Japan IMI (JPNA) najdete u běžných brokerů dostupných v ČR, například DEGIRO, XTB, Trading 212 nebo Interactive Brokers. Na burze se obvykle obchodují v eurech nebo dolarech, zatímco podkladové akcie jsou v jenech, takže měnové riziko jenu nesete bez ohledu na měnu obchodování."
      }
    ]
  },
  "nejlepsi-komoditni-etf": {
    "introTitle": "Komoditní ETF: jak investovat do surovin přes jeden fond",
    "intro": [
      "Komoditní ETF sledují koš fyzických surovin, nejčastěji přes futures kontrakty, ne přes fyzické sklady. Široce diverzifikovaný fond typicky pokrývá 14 až 24 komodit ve čtyřech hlavních skupinách: energie (ropa Brent a WTI, zemní plyn), zemědělské plodiny (kukuřice, sója, pšenice, káva, cukr), průmyslové kovy (měď, hliník, zinek) a drahé kovy (zlato, stříbro). Energetická složka bývá největší, kolem třetiny koše. Tím se komodity chovají jinak než akcie: reagují na inflaci, geopolitiku a nabídkové šoky, ne na zisky firem.",
      "Hlavním důvodem, proč Češi tuto třídu aktiv zvažují, je ochrana před inflací a diverzifikace. Komodity mají historicky nízkou až zápornou korelaci s akciemi a dluhopisy, takže v obdobích, kdy klesají klasická portfolia (typicky při nabídkové inflaci jako v letech 2021 až 2022), mohou komodity růst. Nejde ale o nástroj na dlouhodobé zhodnocování jako akciové indexy, spíše o pojistku a stabilizátor portfolia.",
      "Pro českého investora je klíčové, že tyto fondy jsou denominované a obchodované v USD (koš komodit se cení v dolarech), takže do výnosu vstupuje pohyb kurzu CZK/USD. Nejběžnější diverzifikované komoditní ETF v UCITS podobě jsou dostupné u brokerů jako DEGIRO, XTB nebo Trading 212. Mezi nejobchodovanější patří iShares Diversified Commodity Swap (ICOM, IE00BDQZRK82) s objemem kolem 2,8 mld. EUR, Xtrackers DBLCI Optimum Yield (XCOM, LU0292106167) a WisdomTree Broad Commodities (GCOM, IE00B8CRQX21)."
    ],
    "verdict": [
      "Pro většinu investorů dává největší smysl široce diverzifikovaný komoditní ETF v UCITS obalu s irským nebo lucemburským domicilem, akumulační variantou (Acc) a nízkým TER. U diverzifikovaných swapových fondů se náklady pohybují zhruba od 0,19 % (iShares ICOM) po 0,49 až 0,65 % (GCOM, XCOM). Sledujte i velikost fondu: pro rozumnou likviditu a úzké spready volte fond nad 1 mld. EUR. Akumulační třída je praktická, protože komoditní futures ETF stejně negenerují klasické dividendy a nemusíte řešit reinvestici drobných výplat.",
      "Zásadní je pochopit strukturu. Většina diverzifikovaných komoditních ETF je swapová nebo futures-based, tedy nedrží fyzické suroviny, ale replikuje index přes deriváty. To přináší nižší náklady, ale i riziko protistrany a takzvaný contango efekt, kdy rolování futures kontraktů ukrajuje z výnosu. Fondy jako Xtrackers DBLCI (Optimum Yield) proto používají chytřejší metodiku volby splatnosti kontraktů, aby ztrátu z rolování zmírnily. Pokud chcete jen zlato nebo jen jednu surovinu, sáhněte spíš po specializovaném (často fyzicky krytém) produktu, ne po diverzifikovaném koši."
    ],
    "forWhom": "Hodí se pro investory, kteří už mají hotové jádro portfolia z akciových a dluhopisových ETF a chtějí přidat 5 až 10 % do komodit jako pojistku proti inflaci a nástroj diverzifikace. Sedí těm, kdo počítají s vyšší volatilitou a berou komodity jako doplněk, ne motor růstu. Nehodí se pro začátečníky hledající jednoduchý dlouhodobý růst, pro investory s krátkým horizontem ani pro nikoho, kdo nesnese, že aktivum může roky stagnovat nebo klesat bez výplaty dividend.",
    "risks": [
      "Contango a náklady na rolování futures: diverzifikované komoditní ETF většinou nedrží fyzické suroviny, ale rolují futures kontrakty. Pokud jsou vzdálenější kontrakty dražší (contango), fond při každém rolování ztrácí a jeho výnos může dlouhodobě zaostávat za spotovou cenou komodit.",
      "Měnové riziko CZK/USD: koš komodit se cení v dolarech a fondy jsou v USD. Posílení koruny vůči dolaru vám sníží výnos i tehdy, když ceny komodit v dolarech vzrostou. Většina těchto ETF navíc není měnově zajištěná.",
      "Vysoká volatilita a cykličnost: komodity prosperují hlavně v pozdní fázi hospodářského cyklu a při inflaci, ale během recese a deflace mohou prudce padat. Nejde o aktivum, které roste rovnoměrně, dvouciferné propady v jednotlivých letech jsou běžné.",
      "Riziko protistrany u swapových fondů: swapová replikace znamená závislost na finanční protistraně derivátu. Renomovaní emitenti riziko omezují kolaterálem, přesto jde o rozdíl oproti fyzicky krytým fondům."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi diverzifikovaným komoditním ETF a zlatým ETF?",
        "a": "Diverzifikovaný komoditní ETF drží koš 14 až 24 surovin napříč energiemi, zemědělstvím a kovy, obvykle přes futures. Zlaté ETF sledují jen jednu komoditu a bývají fyzicky kryté (drží skutečné zlato v trezoru). Pokud chcete jen zlato, sáhněte po specializovaném produktu, diverzifikovaný koš je vhodnější jako širší inflační pojistka."
      },
      {
        "q": "Vyplácejí komoditní ETF dividendy a jak se daní v Česku?",
        "a": "Komoditní futures ETF prakticky negenerují dividendy, výnos plyne z pohybu cen a rolování kontraktů, proto jsou obvykle akumulační. Zisk z prodeje řešíte v ČR daní z kapitálového výnosu, pokud neuplatníte časový test držby delší než 3 roky. Konkrétní situaci konzultujte s daňovým poradcem, toto není daňové doporučení."
      },
      {
        "q": "Co je contango a proč mi ukrajuje z výnosu?",
        "a": "Contango je stav, kdy jsou futures kontrakty s pozdější splatností dražší než ty blízké. Fond musí při expiraci levnější kontrakt prodat a dražší koupit, čímž při každém rolování ztrácí. Proto výnos komoditního ETF může dlouhodobě zaostávat za samotnou spotovou cenou surovin. Fondy s optimalizací splatnosti (Optimum Yield) tuto ztrátu zmírňují."
      },
      {
        "q": "Kolik procent portfolia mám do komodit dát?",
        "a": "Komodity se obvykle berou jako doplňková třída aktiv, běžně se uvádí 5 až 10 % portfolia. Slouží k diverzifikaci a ochraně před inflací, ne jako hlavní motor růstu. Vyšší podíl zvyšuje volatilitu a při dlouhé stagnaci komodit může brzdit celkový výnos."
      },
      {
        "q": "Chrání komoditní ETF opravdu před inflací?",
        "a": "Historicky ano, hlavně při nabídkové inflaci taženej růstem cen energií a surovin, jako v letech 2021 až 2022. Není to ale záruka: v obdobích slabé poptávky nebo deflace komodity klesají. Jde o pravděpodobnostní pojistku, ne o jistou ochranu v každém scénáři."
      },
      {
        "q": "Které komoditní ETF jsou nejlevnější a největší?",
        "a": "Nákladově nejnižší z diverzifikovaných je iShares Diversified Commodity Swap (ICOM, IE00BDQZRK82) s TER kolem 0,19 % a zároveň největší s objemem přes 2,8 mld. EUR, což znamená dobrou likviditu a úzké spready. Alternativy jsou WisdomTree Broad Commodities (GCOM) kolem 0,49 % a Xtrackers DBLCI (XCOM) kolem 0,65 %."
      }
    ]
  },
  "nejlepsi-kyberbezpecnost-etf": {
    "introTitle": "Kyberbezpečnostní ETF: sázka na obor, který nemá pauzu",
    "intro": [
      "Kyberbezpečnostní ETF jsou tematické akciové fondy, které soustředí investice do firem vydělávajících na ochraně dat, sítí a koncových zařízení. V portfoliu najdete jména jako CrowdStrike, Palo Alto Networks, Fortinet, Zscaler, izraelský Check Point nebo firmy specializované na správu identit. Na rozdíl od širokého technologického ETF nekupujete Apple ani Microsoft, ale úzkou skupinu firem, jejichž byznys stojí na jediném principu: útoků přibývá a nikdo si nemůže dovolit být bez obrany.",
      "Logika oboru je defenzivní v tom smyslu, že výdaje na bezpečnost patří mezi poslední položky, které firma při šetření škrtá. Většina tržeb navíc plyne z předplatného (SaaS), takže příjmy jsou opakované a předvídatelné. To ale neznamená malou volatilitu, naopak: jde o růstové technologické akcie s vysokým oceněním, které umí spadnout o desítky procent, když trh přehodnotí očekávaný růst. Sektor pohání strukturální poptávka, cloudová migrace, umělá inteligence na obou stranách útoku i regulace typu GDPR a NIS2.",
      "Pro českého investora je klíčové, že prakticky všechny dostupné fondy jsou v UCITS obalu s irským domicilem a obchodují se v EUR nebo USD. Koruna zde není měna fondu, takže podstupujete kurzové riziko EUR/CZK i USD/CZK, byť podkladová aktiva jsou převážně americká. Tři nejznámější fondy, ISPY od Legal & General, iShares Digital Security (SECT) a First Trust Nasdaq Cybersecurity (CIBR), seženete u DEGIRO, XTB i Trading 212, ovšem žádný z nich obvykle nebývá v programu nákupů zdarma."
    ],
    "verdict": [
      "Pro dlouhodobého Čecha dává největší smysl akumulační (Acc) verze s irským domicilem. Akumulace řeší reinvestici dividend automaticky bez zbytečné administrativy a irský domicil zajišťuje sníženou 15% srážkovou daň z amerických dividend díky smlouvě mezi Irskem a USA. Distribuční variantu volte jen tehdy, pokud cíleně chcete průběžný příjem, u tematického růstového fondu to ale postrádá smysl, protože dividendový výnos je zde minimální.",
      "U výběru konkrétního fondu sledujte tři věci: čistotu tématu, velikost a náklady. ISPY je největší a nejčistší pure-play sázka pouze na kyberbezpečnost, zatímco iShares Digital Security (SECT) má širší záběr přes digitální bezpečnost a nejnižší TER kolem 0,40 %. Preferujte fondy nad 1 mld. EUR kvůli likviditě a užším spreadům. TER v této kategorii je vyšší (zhruba 0,40 až 0,75 %) než u širokých indexů, což je daň za specializaci, počítejte s tím jako s trvalým nákladem, ne detailem."
    ],
    "forWhom": "Hodí se pro investora, který už má vybudované jádro portfolia ze širokých indexů (například MSCI World nebo S&P 500) a chce menší doplňkovou satelitní pozici s vyšším růstovým potenciálem a delším horizontem 7 a více let. Předpokladem je tolerance k prudkým výkyvům a přesvědčení o dlouhodobém růstu oboru. Nehodí se pro konzervativní investory, pro toho, kdo hledá jediný fond na celé portfolio, ani pro krátkodobý horizont. Kdo nechce řešit sektorové sázky a kolísání, je lépe obsloužen širokým technologickým nebo globálním ETF.",
    "risks": [
      "Vysoká koncentrace do jednoho úzkého tématu. Pár velkých holdingů (CrowdStrike, Palo Alto, Fortinet) může tvořit značnou část fondu, takže problém jediné firmy, například výpadek nebo bezpečnostní selhání u samotného poskytovatele ochrany, se propíše do celého ETF.",
      "Prémiové ocenění a růstová volatilita. Kyberbezpečnostní akcie se obchodují za vysoké násobky tržeb. Když se zpomalí růst nebo vzrostou úrokové sazby, sektor umí korigovat mnohem prudčeji než široký trh.",
      "Měnové riziko vůči koruně. Fondy jsou v EUR nebo USD s převážně americkými aktivy, posílení koruny vůči dolaru sníží vaše výnosy v CZK bez ohledu na výkonnost samotných firem.",
      "Vyšší náklady a riziko tématu jako módy. TER 0,40 až 0,75 % dlouhodobě ukusuje z výnosu a tematické fondy mohou při odlivu zájmu investorů ztratit velikost i likviditu."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi ISPY, SECT a CIBR?",
        "a": "ISPY (L&G Cyber Security) je největší a nejčistší pure-play fond zaměřený výhradně na kyberbezpečnost. SECT (iShares Digital Security) má širší záběr přes digitální bezpečnost a bývá nejlevnější s TER kolem 0,40 %. CIBR (First Trust) sleduje Nasdaq CTA Cybersecurity Index a nabízí americkou sektorovou expozici. Všechny tři jsou v UCITS obalu s irským domicilem."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční verzi?",
        "a": "Pro dlouhodobé budování majetku je vhodnější akumulační (Acc) verze, která dividendy automaticky reinvestuje bez potřeby řešit daně z průběžných výplat. Dividendový výnos je u tohoto růstového tématu tak jako tak nízký, takže distribuční varianta zde nemá praktický přínos."
      },
      {
        "q": "Jak se kyberbezpečnostní ETF zdaňují v Česku?",
        "a": "Zisk z prodeje je v ČR osvobozen po splnění tříletého časového testu, případně při ročním objemu prodejů do 100 000 Kč. Akumulační fond nevyplácí dividendy, takže během držení neřešíte průběžné zdanění výnosů. U irského domicilu je navíc srážková daň z amerických dividend uvnitř fondu snížena na 15 %."
      },
      {
        "q": "Není lepší koupit rovnou širší technologické ETF?",
        "a": "Záleží na záměru. Široké technologické ETF je diverzifikovanější a levnější, ale kyberbezpečnost v něm tvoří jen malou část. Pokud věříte v nadprůměrný růst právě tohoto oboru a chcete cílenou sázku, dává tematický fond smysl jako menší satelitní pozice. Jako jediný stavební kámen portfolia se ale nehodí."
      },
      {
        "q": "Kde tyto ETF koupím a nesou obchod zdarma?",
        "a": "ISPY, SECT i CIBR jsou dostupné u běžných brokerů jako DEGIRO, XTB nebo Trading 212. Tematické kyberbezpečnostní fondy ale obvykle nebývají v programech nákupů bez poplatku, počítejte proto s běžným poplatkem za obchod a případně měnovou konverzí do EUR nebo USD."
      },
      {
        "q": "Proč mají kyberbezpečnostní ETF vyšší poplatky?",
        "a": "TER 0,40 až 0,75 % je vyšší než u širokých indexových fondů, protože jde o aktivně sestavené tematické indexy s užší množinou firem a menším objemem spravovaných aktiv. Specializace a nižší úspory z rozsahu se promítají do ceny, berte poplatek jako trvalý náklad, který dlouhodobě snižuje čistý výnos."
      }
    ]
  },
  "nejlepsi-msci-world-etf": {
    "introTitle": "MSCI World ETF: globální akciová páteř portfolia jedním nákupem",
    "intro": [
      "MSCI World je akciový index, který v jednom balíku drží zhruba 1 500 velkých a středních firem z 23 rozvinutých zemí. Pokrývá tak kolem 85 % tržní kapitalizace vyspělého světa - od amerických technologických gigantů přes evropské průmyslové značky až po japonské a australské společnosti. Klíčové ale je, co v něm NENÍ: index obsahuje pouze rozvinuté trhy, takže tam nenajdete Čínu, Indii, Tchaj-wan ani jiné rozvíjející se ekonomiky. Pro širší záběr existuje MSCI ACWI, který k developed trhům přidává i emerging markets.",
      "Index je vážený podle tržní kapitalizace, což v praxi znamená velmi vysokou váhu USA - typicky 68 až 72 %. To není chyba, ale přirozený důsledek toho, že americké firmy tvoří většinu hodnoty světových burz. Přesto je dobré to vědět: MSCI World není rovnoměrně rozprostřený po světě, jde spíš o 'převážně USA plus zbytek vyspělého světa'. Za posledních dvacet let index vynášel řádově kolem 8-9 % ročně v korunovém i eurovém přepočtu, ovšem s výraznými výkyvy včetně propadů přes 30 % v krizových letech.",
      "Pro českého investora je MSCI World nejsnáze dostupnou volbou 'první ETF do portfolia'. Fondy sledující tento index nabízí prakticky každý broker používaný v Česku - DEGIRO, XTB, Trading 212, Interactive Brokers i Portu. Většina fondů se obchoduje v EUR nebo USD, takže do hry vstupuje kurz koruny: oslabení CZK vám zhodnocení zvyšuje, posílení naopak ukrajuje. To je běžná vlastnost všech zahraničních akciových ETF, ne specifikum MSCI World."
    ],
    "verdict": [
      "Pro drtivou většinu investorů dává smysl akumulační (accumulating) fond s irským domicilem (ISIN začínající na IE). Irský domicil díky daňové smlouvě s USA snižuje srážkovou daň z amerických dividend z 30 % na 15 %, což je u fondu, kde USA tvoří přes dvě třetiny, citelný rozdíl v dlouhodobém výnosu. Akumulační varianta navíc dividendy automaticky reinvestuje uvnitř fondu - nemusíte je danit ani ručně reinvestovat a naplno využijete efekt složeného úročení. Distribuční (vyplácející) verzi volte jen tehdy, pokud opravdu chcete pravidelný příjem na účet.",
      "Při výběru konkrétního fondu se dívejte na TER, velikost fondu a způsob replikace. Nejlevnější fondy dnes mají TER kolem 0,12-0,15 % ročně, největší a nejlikvidnější kolem 0,20 %. Vzhledem k tomu, že index má přes 1 500 titulů, je důležitá i kvalita sledování: fyzická plná replikace (fond drží všechny akcie) obvykle znamená menší tracking difference než sampling. U velkých zavedených fondů to řešit nemusíte, u malých ano. Pro dlouhodobého držitele je nakonec skutečná zaostávající odchylka od indexu důležitější než samotné TER na papíře."
    ],
    "forWhom": "Hodí se pro dlouhodobé investory s horizontem alespoň 7-10 let, kteří chtějí jedním fondem pokrýt vyspělé akciové trhy a nechtějí řešit výběr regionů ani jednotlivých akcií. Je to ideální 'základní kámen' pravidelného investování (DCA) a jádro portfolia pro začátečníky i pasivní investory. Méně vhodný je pro toho, kdo chce cíleně vyšší expozici k rozvíjejícím se trhům (Čína, Indie) - ty v indexu chybí a je nutné je doplnit zvlášť, nebo rovnou zvolit MSCI ACWI. Nevhodný je také pro krátkodobý horizont a pro investory, kteří neustojí dočasné propady o desítky procent bez panického prodeje.",
    "risks": [
      "Vysoká koncentrace do USA (kolem 70 %) a do několika technologických megafirem - MSCI World zdaleka není tak 'rozložený', jak by název 'World' napovídal, a osud portfolia z velké části závisí na americkém trhu.",
      "Nulová expozice k rozvíjejícím se trhům - Čína, Indie, Tchaj-wan ani střední Evropa v indexu nejsou, takže při jejich růstu MSCI World zaostane a diverzifikace není skutečně celosvětová.",
      "Měnové riziko vůči koruně - fondy jsou vedeny v EUR/USD a pohyb kurzu CZK může výnos v korunách výrazně posílit i oslabit; měnově zajištěné (hedged) varianty toto riziko snižují, ale zvyšují náklady a ruší přirozenou měnovou diverzifikaci.",
      "U menších a levných fondů může být vyšší tracking difference nebo horší likvidita - nízké TER nemusí znamenat nejnižší reálné náklady, pokud fond index sleduje nepřesně."
    ],
    "faqs": [
      {
        "q": "Je lepší MSCI World, nebo S&P 500?",
        "a": "S&P 500 je čistě americký index 500 velkých firem, MSCI World přidává i Evropu, Japonsko a další vyspělé trhy - byť s dominancí USA kolem 70 %. MSCI World nabízí širší geografickou diverzifikaci a menší závislost na jediné zemi, historicky za to platí mírně nižším výnosem. Pro investora, který nechce sázet vše na USA, je MSCI World rozumnější volba jako jádro portfolia."
      },
      {
        "q": "Proč má MSCI World tak velkou váhu USA?",
        "a": "Index váží firmy podle jejich tržní kapitalizace a americké společnosti prostě tvoří většinu hodnoty světových burz. Váha USA proto přirozeně kolísá zhruba mezi 65 a 72 % podle toho, jak si americký trh vede vůči zbytku světa. Není to chyba indexu, ale je dobré s tím počítat - MSCI World je z velké části americký."
      },
      {
        "q": "Akumulační, nebo distribuční MSCI World ETF?",
        "a": "Pro dlouhodobé budování majetku volte akumulační (accumulating) - dividendy se automaticky reinvestují uvnitř fondu, nemusíte je řešit a naplno těžíte ze složeného úročení. Distribuční variantu má smysl kupovat jen tehdy, když chcete z portfolia pravidelný příjem vyplácený na účet. V ČR platí u akcií i ETF osvobození od daně z prodeje po 3 letech držení (časový test)."
      },
      {
        "q": "Musím k MSCI World dokupovat i emerging markets?",
        "a": "Nemusíte, ale mnozí investoři to dělají. MSCI World neobsahuje žádné rozvíjející se trhy, takže pokud chcete skutečně celosvětové portfolio, přidává se obvykle 10-20 % do MSCI Emerging Markets ETF. Alternativou je jeden fond na MSCI ACWI, který developed i emerging trhy spojuje dohromady a odpadá tak rebalancování dvou pozic."
      },
      {
        "q": "Kolik stojí nejlevnější MSCI World ETF a jak vybírat podle TER?",
        "a": "Nejlevnější fondy mají dnes TER kolem 0,12-0,15 % ročně, největší a nejlikvidnější kolem 0,20 %. TER ale není jediné kritérium - u indexu s více než 1 500 tituly rozhoduje i to, jak přesně fond index sleduje (tracking difference). Levný fond s horším sledováním může být v konečném důsledku dražší než o pár setin procenta dražší, ale precizně vedený fond."
      },
      {
        "q": "Vyplatí se měnově zajištěná (hedged) verze pro Čecha?",
        "a": "Ve většině případů ne. Měnové zajištění stojí navíc a odstraní přirozenou měnovou diverzifikaci, kterou fond obsahuje díky expozici v mnoha měnách. Pro dlouhý horizont se kurzové výkyvy zpravidla vyrovnají a nezajištěná varianta bývá levnější i výnosnější. Hedged verzi zvažte jen pro kratší horizont nebo pokud vyloženě nechcete nést kurzové riziko."
      }
    ]
  },
  "nejlepsi-nasdaq-etf": {
    "introTitle": "NASDAQ 100 ETF: sázka na americké technologické giganty",
    "intro": [
      "NASDAQ 100 je index sta největších nefinančních společností obchodovaných na americké burze NASDAQ. Na rozdíl od S&P 500 do něj z principu nepatří banky, pojišťovny ani investiční firmy, což z něj dělá výrazně technologicky zaměřený index. Zhruba polovinu váhy tvoří několik firem, kterým se přezdívá Magnificent 7 (Apple, Microsoft, Nvidia, Amazon, Alphabet, Meta, Tesla), a technologický sektor jako celek zabírá kolem poloviny indexu.",
      "NASDAQ 100 se pro evropské investory nekupuje přímo, ale přes evropské (UCITS) ETF fondy zapsané do amerického indexu. Nejznámější jsou iShares Nasdaq 100 (CNDX, ISIN IE00B53SZB19), Amundi Nasdaq-100 (ANX, LU1681038243) a Xtrackers Nasdaq 100 (XNAS, IE00BMFKG444). Všechny se obchodují na evropských burzách jako Xetra, Borsa Italiana nebo londýnská LSE a jsou běžně dostupné u brokerů, které Češi používají (DEGIRO, XTB, Trading 212, Interactive Brokers, Fio).",
      "Pro Čecha je podstatné, že tyto fondy jsou denominované převážně v USD nebo EUR a podkladová aktiva jsou americké akcie. I když ETF koupíte za koruny, nesete plné měnové riziko dolaru vůči koruně. Index historicky dosahoval vyššího dlouhodobého výnosu než S&P 500 (řádově kolem 13 % ročně za posledních 20 let), ovšem za cenu výrazně vyšší volatility a hlubších propadů."
    ],
    "verdict": [
      "U NASDAQ 100 ETF preferujte fondy s co nejnižším TER a dostatečnou velikostí. Rozdíly ve výkonnosti mezi CNDX, ANX a XNAS jsou dlouhodobě malé, protože všechny sledují stejný index; rozhoduje tak nákladovost, likvidita a domicil. Nejlevnější varianty (často Amundi/Invesco) se pohybují kolem 0,20-0,30 % ročně, zatímco nejstarší a největší CNDX bývá o něco dražší, ale nabízí nejvyšší objem a nejužší spread. Pro drtivou většinu dlouhodobých investorů dává smysl akumulační (reinvestující) třída, protože si nemusíte řešit reinvestici dividend a u ETF domicilovaných v Irsku je díky daňové smlouvě nižší srážková daň z amerických dividend uvnitř fondu.",
      "Doporučujeme irský domicil (ISIN začínající IE) právě kvůli výhodnějšímu zdanění amerických dividend na úrovni fondu (15 % místo 30 %). U replikace není nutné se dogmaticky vyhýbat swapu: fyzická replikace (CNDX, XNAS) drží akcie napřímo a je transparentnější, swapová (část Amundi/Invesco fondů) občas dosahuje o něco přesnějšího sledování indexu a nižších nákladů. Pro začátečníka je bezpečnou volbou velký fyzický fond, pro nákladově citlivého investora nejlevnější akumulační ETF s irským domicilem."
    ],
    "forWhom": "Hodí se pro dlouhodobé investory (ideálně horizont 10+ let), kteří věří v pokračující růst technologií a snesou hluboké výkyvy hodnoty. Dobře funguje jako doplňkový, růstový satelit vedle širšího jádra portfolia (S&P 500 nebo MSCI World). Nehodí se pro konzervativní investory, lidi s krátkým horizontem, ty, kdo potřebují pravidelný dividendový příjem, ani jako jediná složka portfolia, protože NASDAQ 100 je sektorově i firemně silně koncentrovaný a chybí mu celé odvětví financí.",
    "risks": [
      "Extrémní koncentrace: Magnificent 7 tvoří zhruba 45-50 % indexu, tedy skoro dvojnásobek oproti S&P 500. Propad jedné nebo dvou největších firem stáhne celý fond výrazně dolů.",
      "Sektorové riziko: index záměrně vynechává finanční sektor a je z poloviny technologický. Když trpí technologie (růst sazeb, regulace, prasknutí AI/tech nadšení), NASDAQ 100 padá hlouběji než široký trh.",
      "Vyšší volatilita a hlubší propady: beta vůči S&P 500 je přibližně 1,2-1,3. V roce 2022 klesl NASDAQ 100 o zhruba 33 % (S&P 500 o 18 %) a při dot-com krachu 2000-2002 ztratil kolem 78 %.",
      "Měnové riziko: podkladem jsou americké akcie v dolarech. Posílení koruny vůči dolaru sníží váš výnos v korunách i tehdy, když index v USD roste."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi NASDAQ 100 a S&P 500?",
        "a": "NASDAQ 100 obsahuje 100 největších nefinančních firem z burzy NASDAQ a je zhruba z poloviny technologický, přičemž zcela vynechává banky a pojišťovny. S&P 500 je širší (500 firem napříč sektory) a diverzifikovanější. NASDAQ 100 historicky rostl rychleji, ale s vyšší volatilitou a hlubšími propady."
      },
      {
        "q": "Který NASDAQ ETF je nejlepší pro českého investora?",
        "a": "Nejčastější volbou jsou akumulační fondy s irským domicilem a nízkým TER, například iShares CNDX (IE00B53SZB19) pro maximální likviditu nebo levnější Amundi ANX. Irský domicil znamená nižší srážkovou daň z amerických dividend uvnitř fondu (15 % místo 30 %), akumulační třída vám ušetří starost s reinvesticí."
      },
      {
        "q": "Vyplácejí NASDAQ 100 ETF dividendy?",
        "a": "Většina populárních NASDAQ 100 ETF je akumulační, takže dividendy automaticky reinvestují a nic vám nechodí na účet. Technologické firmy navíc obecně vyplácejí nízké dividendy (dividendový výnos indexu je pod 1 %), protože zisk raději investují do růstu. Kdo chce hotovost, musí hledat konkrétní distribuční třídu (například CNDX má i distribuční variantu)."
      },
      {
        "q": "Jak se daní zisk z NASDAQ ETF v Česku?",
        "a": "Na zisk z prodeje ETF se v ČR vztahuje časový (dříve tříletý) test: pokud podíly držíte dostatečně dlouho, je zisk z prodeje osvobozen od daně z příjmů. U akumulačního fondu navíc řešíte daň jen při prodeji, protože se dividendy nevyplácejí. Konkrétní podmínky a limity si vždy ověřte podle aktuální legislativy nebo s daňovým poradcem."
      },
      {
        "q": "Je swapová replikace u NASDAQ ETF bezpečná?",
        "a": "Ano, swapová (syntetická) replikace je u velkých poskytovatelů běžná a regulovaná pravidly UCITS, která omezují riziko protistrany. Fyzická replikace (CNDX, XNAS) drží akcie napřímo a je transparentnější, swapová (část Amundi/Invesco) občas dosahuje o něco přesnějšího sledování indexu. Pro klidnějšího investora je fyzická volba psychologicky pohodlnější."
      },
      {
        "q": "Kolik mě NASDAQ ETF stojí ročně na poplatcích?",
        "a": "Roční nákladovost (TER) nejlevnějších NASDAQ 100 ETF se pohybuje kolem 0,20-0,30 %, u nejstaršího a největšího iShares CNDX o něco výše. K tomu připočtěte poplatky svého brokera za nákup a případný poplatek za konverzi měny. U dlouhodobého držení má nejnižší TER v kombinaci s dobrou likviditou největší význam."
      }
    ]
  },
  "nejlepsi-nemovitostni-etf": {
    "introTitle": "Nemovitostní ETF: jak investovat do realitního trhu přes REITs",
    "intro": [
      "Nemovitostní ETF nekupují domy ani kanceláře napřímo, ale akcie takzvaných REITs (Real Estate Investment Trusts) a realitních firem obchodovaných na burze. REIT je společnost, která vlastní a pronajímá nemovitosti (nájemní byty, obchodní centra, kanceláře, logistické haly, datacentra) a ze zákona musí drtivou většinu svého zisku z nájmů rozdělit akcionářům formou dividend. Fond tak sdružuje desítky až stovky takových firem po celém světě a vy získáte podíl na příjmech z pronájmu nemovitostí za cenu jedné akcie ETF u běžného brokera.",
      "Nejrozšířenější řešení pro evropského investora jsou globální fondy nad rozvinutými trhy. Vlajkovou lodí je iShares Developed Markets Property Yield UCITS ETF (ticker IWDP, ISIN IE00B1FZS350), největší globální REIT ETF v UCITS obalu, který sleduje výběr realitních firem s vyšším dividendovým výnosem. Alternativami jsou HSBC FTSE EPRA/NAREIT Developed UCITS ETF (index EPRA/NAREIT je oborový standard pro kotované nemovitosti) a SPDR Dow Jones Global Real Estate UCITS ETF. Ve všech těchto fondech tvoří americké REITs zdaleka největší část, doplňuje je Japonsko, Austrálie, Velká Británie a kontinentální Evropa.",
      "Pro Čecha jsou tyto fondy běžně dostupné na XETRA i na burze v Amsterdamu přes brokery jako DEGIRO, Trading 212, XTB nebo Interactive Brokers. Podkladová aktiva jsou převážně v amerických dolarech, takže i když ETF nakoupíte za eura nebo koruny, nesete kurzové riziko USD/CZK. Nemovitostní ETF se hodí jako doplněk širokého akciového portfolia (typicky jednotky procent), ne jako jeho náhrada."
    ],
    "verdict": [
      "Pro většinu dlouhodobých investorů dává smysl globální fond nad rozvinutými trhy s dostatečnou velikostí (řádově stovky milionů až miliardy EUR), aby byl likvidní a měl úzký spread. Klíčové je rozhodnout se mezi distribuční a akumulační variantou. Nemovitostní ETF jsou typicky distribuční a vyplácejí dividendy čtvrtletně, což je logické pro toho, kdo chce z portfolia rentu. Kdo naopak jen dlouhodobě spoří a nechce řešit zdanění průběžných dividend, měl by hledat akumulační třídu, pokud ji poskytovatel nabízí, nebo počítat s tím, že vyplacené dividendy musí sám danit a reinvestovat.",
      "U domicilu preferujte irské fondy (ISIN začíná IE), které mají díky daňové smlouvě s USA nižší srážkovou daň z amerických dividend než například lucemburské. TER se v této kategorii pohybuje zhruba mezi 0,4 a 0,6 % ročně, tedy výš než u širokých indexů typu S&P 500, což je u sektorového fondu normální. U indexu upřednostněte zavedené standardy (EPRA/NAREIT, Dow Jones Global Real Estate) před úzce vyprofilovanými nebo pákovými produkty."
    ],
    "forWhom": "Hodí se pro investora, který už má postavené jádro portfolia z širokých akciových ETF a chce ho doplnit o reálná aktiva a pravidelný dividendový příjem, případně pro rentiéra, jemuž vyhovují čtvrtletní výplaty z nájmů. Dává smysl i jako nástroj diverzifikace a částečné obrany proti inflaci. Nehodí se jako jediná či hlavní investice, pro odpůrce kolísání ani pro toho, kdo chce jednoduché zdanění bez řešení průběžných dividend. Vyloženě nevhodné je to pro krátký horizont, protože sektor nemovitostí bývá cyklický a citlivý na úroky.",
    "risks": [
      "Úrokové riziko je pro REITs klíčové: když centrální banky zvedají sazby, rostou náklady na financování nemovitostí a fixní dividendový výnos REITs se stává méně atraktivním vůči dluhopisům, což tlačí ceny dolů. Roky 2022 a 2023 to názorně ukázaly.",
      "Kurzové riziko USD/CZK: podkladem jsou převážně americké REITs v dolarech, takže posílení koruny vůči dolaru vám sníží výnos v korunách i tehdy, když ceny nemovitostí nikam nespadnou. Většina těchto ETF není měnově zajištěná.",
      "Sektorová a cyklická koncentrace: jde o jediné odvětví závislé na kondici realitního trhu a ekonomiky. Segmenty jako kancelářské a maloobchodní nemovitosti navíc čelí strukturálnímu tlaku (práce z domova, e-commerce), zatímco logistika a datacentra rostou.",
      "Zdanění dividend: distribuční fondy vyplácejí zdanitelný příjem průběžně. Časový test na osvobození se váže k prodeji podílu ETF, netýká se přijatých dividend, které je nutné danit vždy."
    ],
    "faqs": [
      {
        "q": "Co je REIT a proč REITs vyplácejí tak vysoké dividendy?",
        "a": "REIT (Real Estate Investment Trust) je burzovně obchodovaná společnost vlastnící a pronajímající nemovitosti. Aby si udržela daňově zvýhodněný status, musí ze zákona vyplácet naprostou většinu svého zisku z nájmů akcionářům. Proto mají REITs a fondy z nich složené výrazně vyšší dividendový výnos než běžné akcie, obvykle v pásmu jednotek procent ročně."
      },
      {
        "q": "Jaký je rozdíl mezi nemovitostním ETF a koupí bytu na investici?",
        "a": "Nemovitostní ETF koupíte a prodáte během vteřiny za pár set korun, rozloží riziko přes stovky budov v desítkách zemí a nevyžaduje starost o nájemníky ani údržbu. Nemá ale páku z hypotéky, kterou při koupi bytu využívá řada investorů, a jeho cena kolísá denně na burze. Jde spíš o likvidní doplněk portfolia než o náhradu vlastní nemovitosti."
      },
      {
        "q": "Které nemovitostní ETF jsou největší a nejlikvidnější?",
        "a": "Mezi nejrozšířenější v UCITS obalu patří iShares Developed Markets Property Yield (IWDP, IE00B1FZS350), HSBC FTSE EPRA/NAREIT Developed a SPDR Dow Jones Global Real Estate. Všechny sledují globální rozvinuté trhy s dominancí amerických REITs a jsou dostupné u brokerů běžných v Česku. Konkrétní velikost fondu a poplatky si vždy ověřte v aktuální srovnávací tabulce."
      },
      {
        "q": "Vyplácejí nemovitostní ETF dividendy a jak se v Česku daní?",
        "a": "Většina nemovitostních ETF je distribuční a vyplácí dividendy zpravidla čtvrtletně. Přijaté dividendy jsou v Česku zdanitelný příjem, který je třeba přiznat, a to i po případném zápočtu zahraniční srážkové daně. Časový test na osvobození od daně se týká zisku z prodeje samotného podílu ETF po jeho držení, nikoli průběžně vyplácených dividend."
      },
      {
        "q": "Proč nemovitostní ETF v posledních letech klesaly, když nemovitosti zdražovaly?",
        "a": "REITs reagují hlavně na úrokové sazby, ne přímo na ceny bytů. Když centrální banky prudce zvedly sazby v letech 2022 a 2023, podražilo financování nemovitostí a investoři přeceňovali REITs směrem dolů, protože jejich dividendový výnos přestal být tak atraktivní vůči dluhopisům. Ceny fondů proto klesaly navzdory relativně vysokým nájmům."
      },
      {
        "q": "Kolik nemovitostních ETF zařadit do portfolia?",
        "a": "Jde o sektorovou sázku, takže obvyklá váha je řádově jednotky procent portfolia jako doplněk k jádru ze širokých světových akcií. Pokud už máte globální akciový ETF typu MSCI World nebo All-World, malou expozici k nemovitostem v něm mimochodem částečně máte, takže nemovitostní ETF přidávejte spíš cíleně kvůli dividendovému příjmu než pro samotnou diverzifikaci."
      }
    ]
  },
  "nejlepsi-robotika-etf": {
    "introTitle": "Robotika ETF: sázka na automatizaci, průmyslové roboty a Industry 4.0",
    "intro": [
      "Robotika ETF jsou tematické akciové fondy, které sdružují firmy podnikající v průmyslové automatizaci, výrobě robotů, senzorice a autonomních systémech. Nejde o širokou expozici k celému trhu, ale o cílenou sázku na jeden megatrend: nahrazování a doplňování lidské práce stroji. Typická portfolia míchají evropské a japonské průmyslové giganty jako ABB, Fanuc, Keyence nebo dřívější KUKA s americkými automatizačními firmami (Rockwell Automation, Emerson) a technologickými dodavateli komponent a softwaru. Řada fondů dnes robotiku prolíná s umělou inteligencí, takže obsahová hranice mezi robotika ETF a AI ETF se stírá.",
      "Pro české investory je klíčové, že prakticky všechny relevantní fondy jsou v provedení UCITS s domicilem v Irsku (ISIN začíná IE) nebo Lucembursku (LU) a obchodují se v eurech, případně na Xetře. Mezi nejznámější patří iShares Automation & Robotics UCITS ETF (ticker RBOT, ISIN IE00BYZK4552), který je s objemem kolem 2,9 mld. EUR největší, dále Amundi MSCI Robotics & AI UCITS ETF (ROAI, LU1861132840) a specializovanější L&G ROBO Global Robotics and Automation UCITS ETF (ROBO, IE00BMW3QX54). Tyto fondy najdete u brokerů jako DEGIRO, XTB nebo Trading 212, byť obvykle nikoli v programech ETF bez poplatku.",
      "Fondy jsou denominované primárně v eurech nebo dolarech, takže i pro korunového investora vzniká měnové riziko vůči CZK. Zdanění je standardní: na akumulační i distribuční variantě platí v ČR 15% daň z realizovaného zisku a z dividend, s možností využít časový test (osvobození po 3 letech držby při splnění podmínek). Robotika patří mezi dražší a volatilnější tematické kategorie, proto ji většina poradců doporučuje jen jako doplněk k jádru portfolia, nikoli jako jeho základ."
    ],
    "verdict": [
      "V této kategorii dává smysl upřednostnit velký a likvidní fond s co nejnižším nákladem: TER se pohybuje zhruba mezi 0,40 % (iShares Automation & Robotics, Amundi MSCI Robotics & AI) a 0,80 % (L&G ROBO), což je u tematických ETF rozdíl, který se za desetiletí drží znatelně nasčítá. Objem fondu nad zhruba 500 mil. EUR je rozumná hranice pro dobrou likviditu a nižší riziko zrušení fondu. Z pohledu čistoty tématu je vhodné vědomě rozlišovat mezi širší automatizací (iShares) a užší robotikou (L&G ROBO), případně kombinací robotiky a AI (Amundi) - metodika indexu určuje, jak koncentrované a jak volatilní portfolio dostanete.",
      "Pro dlouhodobé budování majetku bez potřeby průběžného příjmu preferujte akumulační (Acc) třídu s irským domicilem - dividendy se reinvestují automaticky a irský domicil zajišťuje výhodnější srážkovou daň z amerických dividend uvnitř fondu. Distribuční variantu volte jen tehdy, pokud cíleně chcete vyplácený příjem; u robotiky je ale dividendový výnos nízký, takže akumulace je pro většinu Čechů logičtější volbou."
    ],
    "forWhom": "Robotika ETF se hodí pro pokročilejšího investora s dlouhým horizontem (ideálně 7 a více let), který už má vybudované diverzifikované jádro portfolia (například celosvětový akciový index) a chce cíleně přisadit na trend automatizace jako menší satelitní pozici, typicky v rozsahu 5-10 % portfolia. Vyžaduje toleranci k vyšší volatilitě a k tomu, že tematický fond může roky zaostávat za širokým trhem. Nevhodná je tato kategorie pro úplné začátečníky, pro konzervativní investory, pro krátký horizont a pro každého, kdo by chtěl robotiku jako hlavní stavební kámen portfolia - koncentrace do jednoho sektoru je na to příliš riziková.",
    "risks": [
      "Sektorová a tematická koncentrace: portfolio je vázané na úzkou skupinu firem z průmyslové automatizace a technologií, takže silně koreluje s tech sektorem a v korekcích padá víc než široký trh.",
      "Vyšší náklady a nižší likvidita: TER 0,40-0,80 % je nad úrovní běžných indexových ETF a menší tematické fondy mají širší rozpětí nákup/prodej, což dlouhodobě ukrajuje z výnosu.",
      "Měnové riziko vůči koruně: fondy jsou v EUR/USD a významná část tržeb firem plyne z USA a Japonska, takže posílení koruny může snížit korunový výnos nezávisle na výkonu akcií.",
      "Cykličnost a konkurence: poptávka po průmyslových robotech je citlivá na hospodářský cyklus a investiční aktivitu firem; navíc roste tlak asijské (zejména čínské) konkurence na marže tradičních evropských a japonských výrobců."
    ],
    "faqs": [
      {
        "q": "Jaké jsou v roce 2026 největší a nejlevnější robotika ETF?",
        "a": "Objemově vede iShares Automation & Robotics UCITS ETF (RBOT, IE00BYZK4552) s aktivy kolem 2,9 mld. EUR a TER 0,40 %. Podobně nízký poplatek 0,40 % má Amundi MSCI Robotics & AI (ROAI, LU1861132840). Specializovaný L&G ROBO (ROBO, IE00BMW3QX54) je dražší s TER 0,80 %. Konkrétní čísla si vždy ověřte v aktuální srovnávací tabulce, protože objemy fondů se v čase mění."
      },
      {
        "q": "Jaký je rozdíl mezi robotika ETF a AI ETF?",
        "a": "Robotika ETF se historicky zaměřují na fyzickou automatizaci - výrobce průmyslových robotů, senzoriku, autonomní systémy a coboty. AI ETF cílí spíš na software, čipy a datové zpracování. Hranice se ale stírá, protože indexy jako MSCI Robotics & AI dnes obě témata spojují. Pokud už držíte AI nebo technologický fond, zkontrolujte překryv holdingů, ať zbytečně nezdvojujete stejné firmy."
      },
      {
        "q": "Které firmy robotika ETF obvykle obsahují?",
        "a": "Typická jádra tvoří evropští a japonští průmysloví lídři jako ABB, Fanuc a Keyence, dále americká automatizace typu Rockwell Automation či Emerson a řada dodavatelů komponent, softwaru a čipů. Váhy jednotlivých firem se liší podle metodiky indexu - některé fondy jsou rovnoměrně vážené, jiné dávají větší prostor největším hráčům."
      },
      {
        "q": "Mám zvolit akumulační, nebo distribuční variantu?",
        "a": "Pro dlouhodobé zhodnocení bez potřeby průběžného příjmu je vhodnější akumulační (Acc) třída, která dividendy automaticky reinvestuje a zjednodušuje daňovou administrativu. Distribuční variantu volte jen tehdy, pokud cíleně chcete vyplácený příjem. U robotiky je dividendový výnos nízký, takže rozdíl je hlavně v pohodlí a reinvestici."
      },
      {
        "q": "Jak se robotika ETF daní v Česku?",
        "a": "Realizovaný zisk z prodeje i případné vyplacené dividendy podléhají v ČR 15% dani z příjmu fyzických osob. Při držbě delší než 3 roky lze u prodeje využít časový test a zisk osvobodit (při splnění zákonných podmínek). U akumulačních fondů se dividendy reinvestují uvnitř fondu, takže je průběžně v daňovém přiznání neřešíte - zdaňujete až zisk z prodeje."
      },
      {
        "q": "Kolik portfolia je rozumné dát do robotiky?",
        "a": "Robotika je tematická, koncentrovaná a volatilní kategorie, proto ji většina investorů drží jen jako satelitní pozici, obvykle v rozmezí 5-10 % portfolia. Jádro by měl tvořit široce diverzifikovaný celosvětový akciový fond. Vyšší alokace zvyšuje riziko, že vás dlouhé období slabšího výkonu tématu odradí od plánu."
      }
    ]
  },
  "nejlepsi-small-cap-etf": {
    "introTitle": "Small cap ETF: sázka na malé firmy s velkým potenciálem",
    "intro": [
      "Small cap ETF investují do menších burzovně obchodovaných společností, typicky s tržní kapitalizací zhruba 300 milionů až 2 miliardy USD. Jde o firmy, které jsou příliš velké na to, aby zkrachovaly ze dne na den, ale zároveň dost malé, aby měly před sebou reálný prostor pro několikanásobný růst. Právě tento růstový potenciál je hlavní důvod, proč investoři small cap fondy přidávají do portfolia jako doplněk k velkým firmám z indexů typu S&P 500 nebo MSCI World.",
      "Nejrozšířenějším americkým měřítkem je index Russell 2000, který sdružuje 2000 nejmenších firem z indexu Russell 3000 a je nejsledovanějším barometrem amerických malých společností. Globálnější pohled nabízí MSCI World Small Cap, který pokrývá tisíce menších firem napříč vyspělými trhy, a evropskou variantu reprezentuje MSCI Europe Small Cap. Čím širší index, tím lepší diverzifikace, protože jednotlivé malé firmy mají výrazně vyšší riziko selhání než zavedené korporace.",
      "Pro českého investora jsou nejrozumnější volbou irské (UCITS) ETF obchodované na evropských burzách. Fondy jako iShares MSCI World Small Cap (IE00BF4RFH31), SPDR Russell 2000 US Small Cap (IE00BJ38QD84) nebo Xtrackers MSCI Europe Small Cap (LU0322253906) běžně najdete u brokerů typu DEGIRO, XTB, Trading 212 nebo Interactive Brokers. Většina těchto ETF je denominována v USD nebo EUR, takže jako Čech nesete i kurzové riziko koruny vůči těmto měnám."
    ],
    "verdict": [
      "Pro dlouhodobé držení dává v této kategorii smysl akumulační (accumulating) ETF s irským domicilem. Akumulační varianta reinvestuje dividendy automaticky uvnitř fondu, takže se vyhnete každoročnímu danění drobných dividend a necháte pracovat složené úročení. Irský domicil navíc díky daňové smlouvě s USA snižuje srážkovou daň z amerických dividend na 15 %, což je u fondů zaměřených na Russell 2000 citelný rozdíl oproti jiným domicilům.",
      "Vsaďte na velké, likvidní fondy s co nejširším a nejčistším indexem. U small cap je diverzifikace klíčová, proto preferujte fondy s tisíci pozicemi (MSCI World Small Cap či Russell 2000) před úzkými výběry. TER se v této kategorii pohybuje zhruba mezi 0,30 % a 0,40 % ročně, což je oproti čistě large cap fondům o něco dráž kvůli nákladnějšímu obchodování méně likvidních malých akcií. Velikost fondu nad zhruba 1 mld. EUR a slušný denní objem obchodů vám zajistí úzký rozdíl mezi nákupní a prodejní cenou."
    ],
    "forWhom": "Small cap ETF se hodí pro investora s dlouhým investičním horizontem (ideálně 10 a více let), který už má vybudované jádro portfolia z globálních nebo large cap ETF a chce ho doplnit o růstovou složku s vyšším potenciálem. Vyhovuje tomu, kdo psychicky unese hlubší propady a nebude panikařit, když small cap zaostane za velkými firmami i několik let v řadě. Naopak se nehodí jako jediná nebo hlavní pozice v portfoliu, pro investory s krátkým horizontem, pro ty, kdo potřebují pravidelný příjem z dividend, ani pro začátečníky, kteří ještě nemají zvládnutou volatilitu běžného širokého indexu.",
    "risks": [
      "Vyšší volatilita a hlubší propady: malé firmy během krizí klesají výrazně prudčeji než velké korporace a zotavení může trvat déle. Historicky bývá kolísavost small cap znatelně vyšší než u S&P 500.",
      "Small cap prémie není zaručená: teorie o dlouhodobě vyšších výnosech malých firem (tzv. size premium) se v některých obdobích, například v uplynulé dekádě dominance velkých technologických firem, nepotvrdila a small cap velké indexy dlouhodobě zaostával.",
      "Kurzové riziko: většina fondů je denominována v USD nebo EUR. Posílení koruny vám sníží korunový výnos i v případě, že samotný index roste; u nezajištěných fondů jde o plnou měnovou expozici.",
      "Vyšší náklady a nižší likvidita podkladových akcií: malé firmy se hůř obchodují, což zvyšuje TER i transakční náklady fondu a u méně likvidních ETF může vést k širšímu spreadu při nákupu a prodeji."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi Russell 2000 a MSCI World Small Cap?",
        "a": "Russell 2000 pokrývá 2000 nejmenších firem z amerického trhu, takže jde o čistě americkou expozici. MSCI World Small Cap je globální a zahrnuje tisíce malých firem napříč vyspělými trhy včetně USA, Evropy a Japonska. Pokud chcete širokou diverzifikaci, je globální index vhodnější; pokud cíleně sázíte na oživení americké ekonomiky, dává smysl Russell 2000."
      },
      {
        "q": "Vyplatí se dnes vůbec do small cap investovat, když roky zaostávaly?",
        "a": "V uplynulé dekádě táhly trhy hlavně velké technologické firmy a small cap za nimi zaostával, což vedlo k historicky nízkému relativnímu ocenění malých firem. Nikdo neumí načasovat obrat, ale právě proto někteří investoři small cap přidávají jako protiváhu k drahým velkým firmám. Ber to jako dlouhodobý doplněk portfolia, ne jako krátkodobou spekulaci."
      },
      {
        "q": "Jakou část portfolia dát do small cap ETF?",
        "a": "Small cap je doplňková, nikoliv jádrová složka. Běžně se volí orientačně 5 až 15 % akciové části portfolia, podle toho, jak velkou volatilitu snesete. Zbytek by měl tvořit široký globální nebo large cap základ, aby vám jedna riziková sázka nerozhodovala o celém výsledku."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční small cap ETF?",
        "a": "Pro dlouhodobé budování majetku je pro Čecha praktičtější akumulační varianta, která dividendy automaticky reinvestuje uvnitř fondu. Ušetříte si tím administrativu s daněním drobných dividend a využijete složené úročení. Distribuční fond volte jen tehdy, pokud vyloženě chcete pravidelný příjem."
      },
      {
        "q": "Jak se v Česku daní zisk z prodeje small cap ETF?",
        "a": "Na zisk z prodeje se vztahuje časový test: pokud ETF držíte déle než 3 roky, je zisk z prodeje osvobozen od daně z příjmů. Od roku 2026 je toto osvobození bez horního limitu. Konkrétní situaci si vždy ověřte podle aktuálních pravidel nebo s daňovým poradcem."
      },
      {
        "q": "Proč mají small cap ETF vyšší TER než velké indexové fondy?",
        "a": "Malé firmy se obchodují méně likvidně a fond je musí nakupovat a prodávat s vyššími náklady, což se promítá do celkové nákladovosti. Zatímco levné large cap ETF mají TER klidně pod 0,10 %, u small cap se běžně pohybuje kolem 0,30 až 0,40 % ročně. I tak jde o výrazně levnější řešení než aktivně řízené fondy na malé firmy."
      }
    ]
  },
  "nejlepsi-spotrebni-etf": {
    "introTitle": "Spotřební ETF: sázka na to, za co lidé utrácejí každý den",
    "intro": [
      "Spotřební (consumer) ETF investují do firem, které vyrábějí a prodávají zboží a služby koncovým spotřebitelům. Sektor se dělí na dvě odlišné poloviny. Consumer Staples (základní spotřeba) zahrnuje výrobce potravin, nápojů, hygieny a domácích potřeb, jako jsou Nestlé, Procter & Gamble, Coca-Cola nebo Unilever. Poptávka po jejich produktech je stabilní i v recesi, protože zubní pastu a mléko kupují lidé bez ohledu na hospodářský cyklus. Consumer Discretionary (zbytná či neesenciální spotřeba) naopak pokrývá věci, které si lidé dopřávají, když mají peníze navíc: automobily, cestování, restaurace, luxusní zboží, online nákupy. Tady najdete Amazon, Tesla, LVMH, McDonald's nebo Nike.",
      "Rozdělení na tyto dva podsektory je pro pochopení kategorie klíčové, protože se chovají téměř opačně. Staples jsou defenzivní a nudné, drží hodnotu, když trhy padají, ale v růstových letech zaostávají. Discretionary jsou cyklické a citlivé na ekonomiku, sílu spotřebitele a úrokové sazby, dokážou růst rychle, ale v recesi padají první. Řada zveřejněných produktů proto míří buď čistě na staples, nebo čistě na discretionary, méně často na celý spotřební sektor dohromady.",
      "Pro českého investora jsou tyto fondy dostupné v UCITS podobě na evropských burzách (XETRA, Amsterdam, Milán) a najdete je u DEGIRO, XTB, Trading 212 i Interactive Brokers. Obchodují se nejčastěji v eurech nebo dolarech, takže kromě sektorového rizika nesete i kurzové riziko koruny vůči EUR/USD. Objemy těchto sektorových fondů jsou spíše střední (stovky milionů EUR), což je řádově méně než u širokých indexů typu S&P 500."
    ],
    "verdict": [
      "U spotřebních ETF platí, že sektor je jen doplněk portfolia, ne jeho základ, proto dává smysl volit efektivní a čistý nástroj. Preferujte akumulační (accumulating) variantu s domicilem v Irsku (ISIN začínající IE); Irsko má výhodnou daňovou smlouvu s USA, díky které fond platí jen 15% srážkovou daň z amerických dividend, a akumulace vám ušetří práci s danou úrovní přeinvestování i administrativu s dividendami v českém přiznání. TER se u těchto sektorových fondů pohybuje typicky mezi 0,15 % a 0,30 %, což je dráž než široký index, ale v rámci sektorových ETF přijatelné; nejlevnější americké consumer fondy jdou i pod 0,15 %.",
      "Zásadní je rozhodnout se, kam vlastně mířite. Pokud chcete defenzivní stabilizátor a ochranu proti poklesům, sáhněte po Consumer Staples fondu (např. globální World Consumer Staples nebo evropský/americký staples). Pokud sázíte na sílu spotřebitele a růst e-commerce, patří vám Consumer Discretionary. Míchat obojí do jednoho sektorového klipu nedává smysl, protože se navzájem ředí. Sledujte likviditu: menší tematické varianty mají širší rozpětí nákup/prodej, takže pro pravidelné menší nákupy volte fond s objemem alespoň několik set milionů EUR."
    ],
    "forWhom": "Hodí se pro pokročilejšího investora, který už má jádro portfolia (široký index typu MSCI World nebo S&P 500) a chce vědomě přiklonit malou část, orientačně 5 až 10 %, k určitému názoru na spotřební sektor. Consumer Staples ocení konzervativnější investor hledající defenzivní protiváhu v období nejistoty; Consumer Discretionary spíše ten, kdo věří v růst spotřeby a snese vyšší kolísání. Nehodí se pro začátečníka jako první a jediná investice, protože sektorová koncentrace zvyšuje riziko oproti širokému trhu, ani pro toho, kdo nechce aktivně sledovat, na co vlastně sází.",
    "risks": [
      "Sektorová koncentrace: na rozdíl od širokého indexu stojíte a padáte s jedním odvětvím a jeho pár desítkami firem, takže potíže několika velkých hráčů (např. tlak na marže výrobců potravin) zasáhnou celý fond.",
      "Rozdílné chování staples vs. discretionary: pokud koupíte discretionary fond a přijde recese nebo růst úrokových sazeb, cyklická spotřeba padá mezi prvními; naopak staples v silné býčí fázi výrazně zaostávají za trhem. Musíte vědět, kterou polovinu držíte.",
      "Měnové riziko: fondy jsou vedené v EUR nebo USD, výnos v korunách proto kolísá i podle kurzu; posílení koruny může sníst část zisku i u fondu, který v cizí měně roste.",
      "Koncentrace do mála značek a strukturální hrozby: velkou váhu často nesou giganti jako Amazon nebo Tesla (discretionary) či pár potravinových koncernů (staples); k tomu sektor čelí trendům jako privátní značky obchodních řetězců, GLP-1 léky na hubnutí tlačící na výrobce potravin a nápojů, nebo měnící se spotřebitelské preference."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi Consumer Staples a Consumer Discretionary ETF?",
        "a": "Consumer Staples investují do základní, každodenní spotřeby (potraviny, nápoje, hygiena) a jsou defenzivní, poptávka je stabilní i v krizi. Consumer Discretionary míří na zbytnou spotřebu (auta, luxus, cestování, e-commerce) a jsou cyklické, rostou rychle v dobrých časech a padají první v recesi. Zjednodušeně: staples jsou obrana, discretionary jsou útok."
      },
      {
        "q": "Vyplatí se kupovat samostatný spotřební ETF, když už mám S&P 500 nebo MSCI World?",
        "a": "V širokém indexu už spotřební firmy máte, jen v menší váze (řádově 10 až 15 % dohromady). Samostatný sektorový fond má smysl jen tehdy, když chcete mít této expozice cíleně víc a máte pro to konkrétní důvod, například víru v defenzivu staples nebo v růst online spotřeby. Jako náhrada širokého jádra se nehodí kvůli koncentraci."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční variantu?",
        "a": "Pro dlouhodobé budování majetku je pro Čecha praktičtější akumulační (accumulating) fond s domicilem v Irsku. Dividendy se automaticky reinvestují, nemusíte je danit v průběhu držení ani zdlouhavě řešit v přiznání. Distribuční varianta se hodí spíš tomu, kdo chce pravidelný hotovostní příjem; vyplacené dividendy pak ale musí zdanit."
      },
      {
        "q": "Jak jsou spotřební ETF zdaněné v Česku?",
        "a": "Zisk z prodeje ETF je v ČR osvobozen od daně, pokud fond držíte déle než 3 roky (časový test), případně pokud roční objem prodejů nepřesáhne 100 000 Kč. U akumulačního fondu se dividendy uvnitř nedaní na vaší straně. U distribučního fondu vyplacené dividendy podléhají 15% dani z příjmů. Nejde o daňové poradenství, konkrétní situaci ověřte s odborníkem."
      },
      {
        "q": "Nesu kurzové riziko, když fond kupuji v eurech?",
        "a": "Ano. Většina UCITS spotřebních ETF se obchoduje v EUR nebo USD, takže hodnota v korunách závisí i na kurzu. Pokud koruna posílí, sníží to váš výnos přepočtený do CZK, a naopak. Měna obchodování přitom nemění samotné podkladové riziko, to určují měny tržeb firem ve fondu."
      },
      {
        "q": "Ohrožují sektor GLP-1 léky na hubnutí a privátní značky?",
        "a": "Jsou to reálná témata, hlavně pro Consumer Staples. Léky typu Ozempic mohou dlouhodobě tlumit poptávku po slazených nápojích a nezdravém jídle, privátní značky řetězců zase ukrajují podíl značkovým výrobcům. Neznamená to konec sektoru, ale je dobré vědět, že defenzivní pověst staples neznamená absenci strukturálních hrozeb."
      }
    ]
  },
  "nejlepsi-stoxx600-etf": {
    "introTitle": "STOXX Europe 600: nejširší jedno-indexová sázka na evropské akcie",
    "intro": [
      "STOXX Europe 600 je vlajkový index evropského akciového trhu. Zahrnuje 600 velkých, středních i menších firem ze 17 zemí západní a severní Evropy a pokrývá zhruba 90 % tržní kapitalizace regionu. Na rozdíl od eurozónového indexu (jako Euro Stoxx 50 nebo MSCI EMU) sahá STOXX 600 i mimo eurozónu: velkou váhu v něm mají britské, švýcarské a skandinávské firmy. Najdete v něm jména jako Nestlé, Novo Nordisk, ASML, SAP, LVMH, Roche nebo Shell. Jedním ETF tak koupíte reprezentativní vzorek celé evropské ekonomiky napříč sektory od zdravotnictví a průmyslu přes banky a spotřební zboží až po energetiku.",
      "Pro českého investora je to zajímavý doplněk k americkému S&P 500 nebo globálnímu MSCI World. Evropské akcie mají tradičně vyšší dividendový výnos a nižší valuace než americké, a index bývá cyklický (silné zastoupení bank, průmyslu a luxusu). Fondy jsou obchodované v eurech (i když samotné firmy inkasují i libry, franky a koruny), takže pro korunového investora jde hlavně o kurzové riziko EUR/CZK plus dílčí měny podkladu. STOXX 600 ETF jsou u nás bez problémů dostupné přes DEGIRO, XTB, Trading 212 i Interactive Brokers a patří k nejlevnějším regionálním fondům vůbec.",
      "Tato kategorie sleduje fondy sledující tento index. Klíčové jsou tři parametry: nákladovost (TER), velikost fondu a to, jak fond zachází s dividendami (akumulace vs. výplata). Náklady u této třídy klesly extrémně nízko, špička se pohybuje kolem 0,07 % ročně."
    ],
    "verdict": [
      "Pro dlouhodobé investory je nejlepší volbou akumulační (Acc) fond s co nejnižším TER a irským nebo lucemburským domicilem. Akumulace automaticky reinvestuje dividendy uvnitř fondu, takže nemusíte řešit reinvestování ručně ani zbytečné zdanění průběžně vyplácených dividend. Nákladově je STOXX 600 dnes velmi levná třída: nejlevnější fondy (např. Amundi Core STOXX Europe 600, ticker LYP6, TER 0,07 %) stojí zlomek toho, co dřív. U tak širokého a likvidního indexu je fyzická replikace standardem a tracking error bývá malý, takže rozhodovat by měl hlavně poplatek a velikost fondu.",
      "Pokud řešíte bezpečí velké investice a maximální likviditu na burze, dává smysl sáhnout po největších fondech s dlouhým track record, jako je iShares STOXX Europe 600 (EXSA) nebo Xtrackers STOXX Europe 600 (XESC) od DWS. Distribuční verze (vyplácející dividendy) volte jen tehdy, když cíleně chcete pravidelný příjem, počítejte ale s tím, že přijaté dividendy je v ČR nutné danit v daňovém přiznání."
    ],
    "forWhom": "Hodí se investorovi, který chce jednou levnou pozicí pokrýt celou vyspělou Evropu (nejen eurozónu) a doplnit tak americkou nebo globální část portfolia. Sedne dlouhodobému investorovi budujícímu diverzifikované portfolio, který ocení nižší valuace a vyšší dividendový výnos Evropy oproti USA. Méně se hodí tomu, kdo už drží globální fond typu MSCI World nebo FTSE All-World, kde je Evropa obsažená a přidání STOXX 600 by jen zvýšilo její váhu (koncentrační sázka na region). Nevhodné je i pro investory hledající růstové technologie, těch má Evropa výrazně méně než USA.",
    "risks": [
      "Regionální koncentrace: jde o sázku na jeden region. Evropa dlouhodobě zaostávala za americkými akciemi, a to zejména kvůli menšímu zastoupení technologických gigantů a pomalejšímu růstu. Sektorově dominují banky, průmysl, zdravotnictví a luxusní zboží, což index činí citlivým na hospodářský cyklus.",
      "Měnové riziko na více úrovních: fond je obvykle denominovaný v EUR, ale podkladové firmy inkasují i britské libry, švýcarské franky a skandinávské koruny. Pro korunového investora se tak výnos přepočítává přes několik měnových vrstev, nejvíc přes kurz EUR/CZK.",
      "Skrytá koncentrace v jednotlivých titulech: přestože index nese 600 firem, několik gigantů (Novo Nordisk, ASML, Nestlé, SAP) tvoří nezanedbatelnou část váhy. Kolísání jednoho velkého titulu, jako byl propad Novo Nordisku, se projeví ve výkonnosti celého fondu.",
      "Nezaměňovat s eurozónovým indexem: STOXX 600 zahrnuje i Velkou Británii a Švýcarsko. Kdo chce čistě eurozónu, hledá jiný index (MSCI EMU, Euro Stoxx). Rozdíl ve složení a měnovém profilu je podstatný."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi STOXX 600 a Euro Stoxx 50?",
        "a": "Euro Stoxx 50 obsahuje jen 50 největších firem z eurozóny, je tedy úzký a koncentrovaný. STOXX Europe 600 pokrývá 600 firem ze 17 zemí včetně Velké Británie, Švýcarska a Skandinávie, tedy i mimo eurozónu. STOXX 600 je proto výrazně diverzifikovanější a reprezentativnější pro celou vyspělou Evropu."
      },
      {
        "q": "Který STOXX 600 ETF má nejnižší poplatky?",
        "a": "Nákladová špička této kategorie se pohybuje kolem TER 0,07 % ročně, což patří k nejlevnějším regionálním fondům vůbec (typicky Amundi Core STOXX Europe 600, ticker LYP6). Aktuální živý žebříček podle nejnižšího TER najdete v tabulce na této stránce, poplatky se v čase mění."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční verzi?",
        "a": "Pro dlouhodobé zhodnocení je praktičtější akumulační (Acc) verze, protože dividendy reinvestuje automaticky uvnitř fondu a nemusíte je řešit. Distribuční verzi volte jen tehdy, když cíleně chcete pravidelný příjem, přijaté dividendy je ale v ČR nutné danit v daňovém přiznání."
      },
      {
        "q": "Jak se v Česku daní zisk ze STOXX 600 ETF?",
        "a": "Na zisk z prodeje se vztahuje časový test: pokud podíly držíte déle než 3 roky, je zisk z prodeje osvobozen od daně z příjmů. Do limitu 100 000 Kč ročního objemu prodejů jste od daně osvobozeni také. U distribučních fondů se navíc daní vyplacené dividendy bez ohledu na dobu držení."
      },
      {
        "q": "Je STOXX 600 dobrá náhrada za americké akcie?",
        "a": "Není náhrada, spíš doplněk. Evropa má nižší valuace a vyšší dividendový výnos, ale dlouhodobě rostla pomaleji než USA kvůli menšímu podílu technologií. Rozumné je držet obojí, nebo rovnou sáhnout po globálním fondu (MSCI World, FTSE All-World), který obsahuje jak USA, tak Evropu."
      },
      {
        "q": "Jsou tyto ETF dostupné u českých brokerů?",
        "a": "Ano, STOXX 600 ETF jsou UCITS fondy běžně dostupné přes DEGIRO, XTB, Trading 212 i Interactive Brokers. Obchodují se hlavně na německých burzách (Xetra) v eurech a patří k nejlikvidnějším evropským fondům, největší mají objem v řádu miliard eur."
      }
    ]
  },
  "nejlepsi-technologicke-etf": {
    "introTitle": "Technologické ETF: sázka na NASDAQ 100 a IT sektor",
    "intro": [
      "Technologické ETF jsou fondy, které koncentrují peníze do firem z oblasti hardwaru, softwaru, polovodičů, cloudu a internetových služeb. V praxi jde o dvě odlišné rodiny indexů. NASDAQ 100 sdružuje 100 největších nefinančních firem obchodovaných na burze NASDAQ. Není to čistě technologický index, ale technologie v něm dominují, a k tomu se přidávají firmy jako Amazon, Alphabet nebo Tesla, které se formálně řadí do jiných sektorů. Druhou rodinou jsou čisté sektorové indexy typu S&P 500 Information Technology, kde najdete jen firmy zařazené do IT sektoru podle klasifikace GICS, tedy především Apple, Microsoft, NVIDIA, Broadcom a další.",
      "Klíčovým rysem této kategorie je extrémní koncentrace. Několik největších firem tvoří i přes polovinu celého fondu, takže výkon indexu z velké části určuje hrstka jmen. To dlouhá léta fungovalo výborně a technologie táhly americké trhy nahoru, zároveň to ale znamená, že jde o mnohem koncentrovanější a rizikovější sázku než široký index typu S&P 500 nebo MSCI World.",
      "Pro českého investora je dobrá zpráva dostupnost. Populární fondy jako iShares NASDAQ 100 (ISIN IE00B53SZB19), Invesco EQQQ NASDAQ-100 (IE0032077012) nebo iShares S&P 500 Information Technology Sector (IE00B3WJKG14) mají evropský domicil, jsou v UCITS podobě a běžně se s nimi obchoduje u brokerů jako DEGIRO, XTB, Trading 212 nebo Interactive Brokers. Většina se obchoduje v EUR nebo USD, koruna tu nehraje roli žádného měnového zajištění, takže vždycky nesete i kurzové riziko koruny vůči dolaru."
    ],
    "verdict": [
      "Pro drtivou většinu českých investorů dává v této kategorii smysl akumulační (Acc) fond s irským domicilem. Akumulace znamená, že se dividendy automaticky reinvestují uvnitř fondu, což zjednodušuje daně a nemusíte řešit každoroční příjem z dividend v daňovém přiznání. Irský domicil zase díky daňové smlouvě s USA snižuje srážkovou daň z amerických dividend na úrovni fondu, a protože jde téměř výhradně o americké firmy, tohle je u technologických ETF zásadní.",
      "Z hlediska nákladů jsou rozdíly citelné. Čisté sektorové IT fondy bývají levnější, iShares S&P 500 Information Technology má TER 0,15 %, zatímco NASDAQ 100 fondy stojí kolem 0,30 % ročně. Za tu nižší cenu ale platíte ještě vyšší koncentrací do několika málo firem. NASDAQ 100 je o něco pestřejší a likvidnější, největší fond iShares NASDAQ 100 spravuje přes 17 mld. EUR, takže má úzké spready a snadné obchodování. Preferujte velké fondy s dostatečnou likviditou, transparentní replikací indexu a rozumným TER, u této kategorie je stabilita a velikost fondu důležitější než honba za posledními setinami procenta na poplatcích."
    ],
    "forWhom": "Technologická ETF se hodí pro investory s dlouhým horizontem (ideálně 10 a více let), kteří rozumí tomu, že jde o koncentrovanou sektorovou sázku a ustojí i hluboké propady. Dávají smysl jako doplněk k jádru portfolia, například k širokému MSCI World nebo S&P 500, nikoli jako jediná pozice. Nehodí se pro konzervativní investory, pro ty, kdo budou peníze potřebovat v horizontu několika let, ani pro začátečníky, kteří ještě nemají vybudované široce diverzifikované jádro. Pozor také na duplicitu: kdo už drží S&P 500 nebo MSCI World, má technologické giganty ve svém portfoliu znovu a přikoupením tech ETF sázku na stejné firmy jen zesiluje.",
    "risks": [
      "Sektorová koncentrace. Celý fond stojí a padá s technologiemi, a navíc s hrstkou největších firem (Apple, Microsoft, NVIDIA), které mohou tvořit i přes polovinu portfolia. Problém jediné firmy nebo regulační zásah do big tech se propíše do výkonu mnohem silněji než u širokého indexu.",
      "Vyšší volatilita a hlubší propady. Technologický sektor v minulosti opakovaně zažil poklesy o desítky procent (splasknutí dot-com bubliny v letech 2000 až 2002, propad v roce 2022). Kdo neustojí pokles o 40 a více procent, snadno prodá ve ztrátě.",
      "Riziko drahého ocenění. Po letech růstu se technologie často obchodují za vysoké násobky zisku. Vysoké valuace samy o sobě nejsou katastrofa, ale zvyšují citlivost na zklamání z výsledků, růst úrokových sazeb i změny nálady trhu.",
      "Měnové a dolarové riziko. Fondy drží převážně americké akcie v dolarech. Posílení koruny vůči dolaru vám sníží výnos v korunách bez ohledu na to, jak si vede samotný index."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi NASDAQ 100 ETF a čistě technologickým (IT) ETF?",
        "a": "NASDAQ 100 obsahuje 100 největších nefinančních firem z burzy NASDAQ, takže vedle technologií zahrnuje i Amazon, Alphabet nebo Tesla, které formálně patří do jiných sektorů. Čistě technologický fond typu S&P 500 Information Technology drží jen firmy zařazené do IT sektoru podle klasifikace GICS. NASDAQ 100 je o něco pestřejší, IT sektorový fond je koncentrovanější, ale zase levnější."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční technologické ETF?",
        "a": "Pro dlouhodobé investory je obvykle výhodnější akumulační (Acc) verze. Dividendy se reinvestují automaticky uvnitř fondu, takže se o ně nemusíte starat v daňovém přiznání a snáz využijete efekt složeného úročení. Distribuční verze má smysl hlavně pro toho, kdo chce pravidelný hotovostní příjem."
      },
      {
        "q": "Nekupuji technologie dvakrát, když už mám S&P 500 nebo MSCI World?",
        "a": "Do jisté míry ano. Technologičtí giganti tvoří velkou část i širokých indexů, takže přikoupením tech ETF svou sázku na stejné firmy jen zesilujete. To není nutně chyba, pokud tomu rozumíte a chcete technologiím dát vyšší váhu, ale je dobré to vzít v úvahu při stanovení velikosti pozice."
      },
      {
        "q": "Jak se v Česku daní zisky z technologických ETF?",
        "a": "Platí stejná pravidla jako u ostatních akciových ETF. Zisk z prodeje je osvobozen od daně, pokud cenný papír držíte déle než 3 roky (časový test), případně při ročním objemu prodejů do 100 000 Kč. U akumulačních fondů navíc řešíte dividendy uvnitř fondu, což daňové přiznání zjednodušuje. Konkrétní situaci si ověřte u daňového poradce."
      },
      {
        "q": "Proč většina technologických ETF má irský domicil?",
        "a": "Irsko má výhodnou daňovou smlouvu s USA, která snižuje srážkovou daň z amerických dividend na úrovni fondu z 30 % na 15 %. Protože technologická ETF drží téměř výhradně americké firmy, irský domicil (ISIN začínající IE) tu znamená znatelně nižší daňovou ztrátu na dividendách než například lucemburský fond."
      },
      {
        "q": "Je teď dobrá doba na nákup technologických ETF?",
        "a": "Časovat vstup do koncentrovaného sektoru je obtížné a technologie často bývají draze oceněné. Pro dlouhodobého investora bývá rozumnější pravidelné investování (DCA) po menších částkách než snaha trefit dno. Berte tech ETF jako dlouhodobý doplněk k širokému jádru portfolia, ne jako krátkodobou spekulaci."
      }
    ]
  },
  "nejlepsi-value-etf": {
    "introTitle": "Value ETF: hodnotové akcie jako protiváha technologickým gigantům",
    "intro": [
      "Value ETF jsou fondy, které cíleně vybírají akcie obchodované levně vůči svým fundamentům, tedy s nízkým poměrem ceny k zisku (P/E), ceny k účetní hodnotě (P/B) nebo ceny k tržbám (P/S). Myšlenka navazuje na tradici Benjamina Grahama a Warrena Buffetta: kupovat kvalitní firmy, o kterých trh dočasně pochybuje, a počkat, až se ocenění vrátí k normálu. Na rozdíl od aktivního value investora ale ETF nevybírá jednotlivé tituly ručně, nýbrž podle jasně daného indexového pravidla, nejčastěji rodiny MSCI Value nebo MSCI Enhanced Value.",
      "V praxi mezi nejrozšířenější patří iShares Edge MSCI World Value Factor UCITS ETF (ISIN IE00BP3QZB59), největší globální value fond s objemem kolem 3,4 miliardy EUR a TER 0,25 %, a Xtrackers MSCI World Value UCITS ETF (IE00BL25JM42) s objemem přibližně 2,3 miliardy EUR. Pro čistší evropskou expozici existuje iShares Edge MSCI Europe Value Factor UCITS ETF (IE00BQN1K901). Value indexy dnes obvykle zahrnují velký podíl bank, energetiky, těžby, farmacie a průmyslu, tedy sektorů, které v éře dominance technologických gigantů zůstávaly stranou.",
      "Pro českého investora jsou tyto fondy dostupné na burzách v Amsterdamu, Frankfurtu (Xetra) i Miláně a běžně je najdete u DEGIRO, XTB, Trading 212, Portu i Interactive Brokers. Většina se obchoduje v eurech, takže vedle akciového rizika nesete i pohyb kurzu EUR/CZK. Value ETF nejsou samostatnou strategií na celé portfolio, ale spíše doplňkem k širokému indexu, kterým vědomě nakláníte portfolio směrem k hodnotovému faktoru."
    ],
    "verdict": [
      "V této kategorii dává smysl preferovat fondy s irským domicilem (ISIN začínající IE), které díky daňové smlouvě mezi Irskem a USA odvádějí z amerických dividend jen 15 % srážkové daně místo 30 %. To je u value fondů podstatné, protože hodnotové akcie typicky vyplácejí nadprůměrné dividendy a daňová efektivita se přímo promítá do výnosu. Sledujte také, zda index nese označení Enhanced Value nebo jen Value, protože enhanced varianta lépe kontroluje sektorové vychýlení a nepřeváží portfolio jen do bank a energetiky.",
      "Z hlediska formy: akumulační třída (Acc) se hodí investorům, kteří chtějí složené úročení a nechtějí ročně danit vyplacené dividendy, zatímco distribuční (Dist) ocení ten, kdo chce pravidelný příjem, byť za cenu ročního daňového přiznání dividend. TER se u zavedených value ETF pohybuje kolem 0,25 %, nejlevnější širší faktorové fondy klesají i k 0,10 %. Preferujte fondy s objemem alespoň v řádu stovek milionů EUR kvůli likviditě a nižšímu riziku zrušení, a při dlouhém horizontu nezapomeňte na test 3letého daňového osvobození v ČR."
    ],
    "forWhom": "Value ETF se hodí investorovi, který už má jádro portfolia v širokém indexu (například MSCI World nebo S&P 500) a chce vědomě přidat hodnotový náklon jako protiváhu k převaze technologických firem. Sedí i tomu, kdo věří v návrat k oceňovací disciplíně a snese, že jeho portfolio se bude po delší období chovat jinak než hlavní index. Naopak se nehodí začátečníkovi, který hledá jediný fond na všechno, ani investorovi bez trpělivosti: value faktor umí zaostávat i řadu let a odměna přichází nepravidelně. Pokud chcete jednoduchost a maximální diverzifikaci bez sázky na faktor, zůstaňte u širokého indexu.",
    "risks": [
      "Value faktor může zaostávat velmi dlouho. V letech 2010 až 2020 hodnotové akcie výrazně zaostávaly za růstovými a řada investorů faktor předčasně opustila těsně před jeho obratem. Musíte počítat s obdobími, kdy budete za širokým indexem viditelně pozadu.",
      "Sektorová koncentrace. Value indexy bývají nadváženy v bankách, energetice a těžbě, které jsou citlivé na ekonomický cyklus, úrokové sazby a ceny komodit. To je jiný rizikový profil než u širokého indexu a v recesi mohou tyto sektory padat prudčeji.",
      "Riziko hodnotové pasti. Akcie je levná často z dobrého důvodu, protože firma strukturálně upadá. Index sice diverzifikuje, ale mechanický výběr podle nízkých poměrů může nabrat i tituly, jejichž nízké ocenění je oprávněné a nikdy se nevrátí.",
      "Měnové riziko. Fondy se obchodují převážně v EUR, takže výnos v korunách ovlivňuje kurz EUR/CZK. Posílení koruny může část akciového zisku umazat bez ohledu na to, jak se dařilo samotnému indexu."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi Value a Growth ETF?",
        "a": "Value ETF cílí na levně oceněné akcie s nízkým P/E a P/B a často vyššími dividendami, typicky banky, energetika či průmysl. Growth ETF naopak sázejí na rychle rostoucí firmy s vysokým oceněním, zejména technologie. Oba přístupy se ve výkonnosti střídají a mnozí investoři je kombinují právě proto, aby nebyli závislí jen na jednom stylu."
      },
      {
        "q": "Vyplatí se dnes vůbec do value investovat, když technologie stále rostou?",
        "a": "Value a growth se historicky střídají v cyklech a dlouhodobě žádný z nich trvale nevítězí. Value ETF dává smysl jako protiváha k portfoliu přetíženému technologickými giganty, ne jako sázka na to, že value teď musí okamžitě vystřelit. Jde o diverzifikaci stylu, ne o časování trhu."
      },
      {
        "q": "Který value ETF je největší a nejlikvidnější?",
        "a": "Největším globálním fondem je iShares Edge MSCI World Value Factor UCITS ETF (IE00BP3QZB59) s objemem kolem 3,4 miliardy EUR a TER 0,25 %. Následuje Xtrackers MSCI World Value UCITS ETF (IE00BL25JM42) s objemem přibližně 2,3 miliardy EUR. Oba patří k dostatečně velkým a likvidním fondům pro běžného investora."
      },
      {
        "q": "Platím z value ETF v Česku daně a co dividendy?",
        "a": "Pokud akcie fondu držíte déle než 3 roky, je zisk z prodeje v ČR osvobozen od daně z příjmu. U distribučních tříd ale vyplacené dividendy daníte každý rok bez ohledu na časový test. Proto řada dlouhodobých investorů volí akumulační (Acc) variantu, kde se dividendy reinvestují uvnitř fondu."
      },
      {
        "q": "Mám raději globální, nebo evropský value ETF?",
        "a": "Globální fond typu MSCI World Value je diverzifikovanější a méně závislý na jedné ekonomice, což je pro většinu investorů rozumnější základ. Evropský value ETF (například IE00BQN1K901) má nižší ocenění a vyšší dividendový výnos, ale i vyšší koncentraci do bank a cyklických sektorů. Evropskou variantu volte spíše jako doplněk, ne jako jediný value fond."
      },
      {
        "q": "Proč value ETF často drží tolik bank a energetiky?",
        "a": "Protože právě tyto sektory se dlouhodobě obchodují za nízké násobky zisku a účetní hodnoty, takže je value index přirozeně vybírá. To zvyšuje citlivost fondu na úrokové sazby a ekonomický cyklus. Pokud vám vadí, hledejte varianty s označením Enhanced Value, které sektorové vychýlení lépe kontrolují."
      }
    ]
  },
  "nejlepsi-zlate-etf": {
    "introTitle": "Zlaté ETF (ETC): jak investovat do fyzického zlata přes burzu",
    "intro": [
      "Zlaté ETF jsou v drtivé většině ve skutečnosti ETC (Exchange Traded Commodities) - burzovně obchodované cenné papíry, které jsou 100 % kryté fyzickým zlatem uloženým v pojištěných trezorech (typicky LBMA depozitáře v Londýně nebo Curychu). Kupujete tedy nárok na skutečné slitky, ale obchodujete je stejně snadno jako akcii přes svého brokera. Na rozdíl od nákupu fyzických mincí a slitků odpadá řešení úschovy, pojištění i vysokého rozpětí mezi nákupní a prodejní cenou.",
      "Pro českého investora je zásadní, že se cena zlata kotuje v amerických dolarech. I když ETC koupíte v eurech nebo korunách, výnos vždy ovlivňuje pohyb kurzu USD/CZK - slabší dolar může část růstu ceny zlata sníst, silnější naopak výnos zvýší. Existují proto i verze s měnovým zajištěním do eura (například Xtrackers Physical Gold EUR Hedged, DE000A1E0HR8), které kurzové výkyvy USD tlumí, ovšem za vyšší náklady a bez zajištění vůči koruně.",
      "Nejznámější a největší fondy v této kategorii jsou iShares Physical Gold ETC (IE00B4ND3602, ticker SGLD) s objemem kolem 15 mld. EUR, WisdomTree Physical Gold (JE00B1VS3333) a Xtrackers Physical Gold (ticker 4GLD). Všechny jsou běžně dostupné u brokerů oblíbených v Česku - DEGIRO, Trading 212, XTB nebo Interactive Brokers - často i s možností spořicího plánu."
    ],
    "verdict": [
      "V této kategorii jednoznačně preferujte fyzicky kryté ETC před syntetickými produkty, které používají deriváty a nesou riziko protistrany. Klíčovým kritériem je velikost fondu (větší znamená užší rozpětí nákup/prodej a lepší likviditu) a nákladovost TER, která se u zlata pohybuje zhruba mezi 0,12 % a 0,40 % ročně. Nejlepší poměr velikost/náklady dlouhodobě nabízí iShares Physical Gold (SGLD) s TER 0,12 %, což z něj dělá rozumnou výchozí volbu pro většinu investorů.",
      "Otázka akumulace versus distribuce zde na rozdíl od akciových ETF prakticky odpadá - zlato nevyplácí dividendy ani úroky, takže všechny výnosy plynou jen z pohybu ceny kovu. Řešte především domicil (Irsko či Německo jsou pro Čecha standardní a bezproblémové), zda chcete měnově zajištěnou verzi do eura, a zda vám vyhovuje daňový režim ETC. Pro jednorázovou pozici i pravidelné dokupování bez měnového zajištění je SGLD nebo WisdomTree Physical Gold spolehlivá volba; zajištěnou variantu (4GLD EUR Hedged) volte jen tehdy, když opravdu chcete tlumit pohyb dolaru."
    ],
    "forWhom": "Zlaté ETC se hodí investorům, kteří chtějí doplnit jinak akciové a dluhopisové portfolio o složku s nízkou až zápornou korelací a ochranu proti inflaci a systémovým krizím - obvykle jako menší část portfolia v řádu jednotek až nižších desítek procent. Sedí konzervativnějším investorům hledajícím bezpečné útočiště i těm, kdo chtějí snížit celkovou kolísavost portfolia. Naopak se nehodí pro investory, kteří očekávají pravidelný pasivní příjem (zlato nic nevyplácí), pro čistě růstové portfolio zaměřené na dlouhodobé zhodnocení akciemi, ani pro krátkodobé spekulanty, protože cena zlata umí roky stagnovat i klesat.",
    "risks": [
      "Měnové riziko: zlato se kotuje v USD, takže i při růstu ceny kovu můžete v korunách vydělat méně (nebo prodělat), pokud dolar oslabí. Verze zajištěné do eura řeší jen riziko USD/EUR, nikoli pohyb koruny.",
      "Zlato nenese žádný výnos - žádné dividendy ani úroky. Jediným zdrojem zisku je růst ceny kovu, přičemž cena umí i řadu let stagnovat nebo klesat (například po roce 2011).",
      "Vysoká kolísavost a citlivost na reálné úrokové sazby: při růstu sazeb bez růstu inflace bývá zlato pod tlakem, protože roste atraktivita úročených aktiv.",
      "Právní a daňový charakter ETC se liší od klasického fondového ETF (jde o dluhový cenný papír krytý kovem). Zdanění zisků i uplatnění časového testu proto konzultujte s daňovým poradcem podle své situace."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi zlatým ETF a ETC?",
        "a": "Většina produktů na zlato jsou technicky ETC (Exchange Traded Commodities), nikoli klasické ETF fondy. ETC je dluhový cenný papír krytý fyzickým zlatem uloženým v trezoru, zatímco ETF je podílový fond. Pro investora se obchodují stejně přes burzu, liší se ale právní strukturou a v některých případech i daňovým režimem."
      },
      {
        "q": "Je lepší koupit zlaté ETC, nebo fyzické slitky a mince?",
        "a": "ETC je pohodlnější a levnější na držení - odpadá úschova, pojištění i vysoké rozpětí ceny u dealerů, a prodáte je během vteřin přes brokera. Fyzické slitky a mince zase držíte fyzicky bez rizika protistrany a v ČR bývá investiční zlato osvobozeno od DPH. ETC se hodí pro portfoliovou pozici, fyzické zlato spíš pro toho, kdo chce kov skutečně vlastnit."
      },
      {
        "q": "Mám volit verzi zlatého ETC zajištěnou do eura?",
        "a": "Měnově zajištěná verze (například Xtrackers 4GLD EUR Hedged) tlumí pohyb kurzu USD/EUR, ale za vyšší náklady a nezajišťuje vás vůči koruně. Pro dlouhodobého investora je zlato samo o sobě do jisté míry protiváhou k oslabení měny, takže mnozí volí nezajištěnou verzi. Zajištění dává smysl hlavně tehdy, když chcete cíleně omezit vliv dolaru."
      },
      {
        "q": "Jaké zlaté ETC jsou v Česku dostupné a od kterého brokera?",
        "a": "Nejběžnější jsou iShares Physical Gold (SGLD, IE00B4ND3602), WisdomTree Physical Gold (JE00B1VS3333) a Xtrackers Physical Gold (4GLD). Najdete je u brokerů populárních v ČR jako DEGIRO, Trading 212, XTB nebo Interactive Brokers, často i s možností pravidelného spořicího plánu."
      },
      {
        "q": "Kolik zlata by mělo být v portfoliu?",
        "a": "Neexistuje jedno správné číslo, ale řada portfoliových přístupů drží zlato jako menšinovou složku - obvykle v řádu jednotek až nižších desítek procent (například permanentní portfolio pracuje s 25 %). Cílem je snížit celkovou kolísavost a přidat aktivum s nízkou korelací k akciím, ne maximalizovat výnos."
      },
      {
        "q": "Jak se daní zisk ze zlatého ETC v Česku?",
        "a": "Zdanění závisí na právní struktuře produktu a délce držení - u cenných papírů se v ČR uplatňuje časový test pro osvobození, ale u ETC coby dluhového nástroje může být situace odlišná než u běžného ETF. Protože se pravidla mění a záleží na konkrétním produktu, doporučujeme ověřit aktuální režim s daňovým poradcem."
      }
    ]
  },
  "etf-zdarma-degiro": {
    "introTitle": "ETF zdarma na DEGIRO: jak funguje bezplatný nákup a pro koho se vyplatí",
    "intro": [
      "DEGIRO je nizozemský broker, který se v Česku proslavil možností nakupovat vybrané ETF prakticky bez komisí. Nejde ale o plošné „všechno zdarma“ – broker provozuje takzvanou Fair Use politiku (dříve tzv. Kernselectie, jádrový seznam). U fondů z tohoto seznamu je první nákup nebo prodej každého konkrétního ETF v daném kalendářním měsíci zdarma (do objemu zhruba 1 000 € na transakci). Druhý a každý další obchod se stejným fondem ve stejném měsíci pak stojí administrativní poplatek okolo 1 € plus vždy zahrnutý spread a případný měnový přirážkový poplatek.",
      "Seznam bezplatných fondů čítá řádově desítky ETF a pokrývá páteřní stavební kameny portfolia: iShares Core S&P 500 (CSPX, ISIN IE00B5BMR087), iShares Core MSCI World (IWDA, IE00B4L5Y983), iShares Core MSCI Emerging Markets IMI (EMIM, IE00BKM4GZ66) i dluhopisové a evropské akciové fondy. Jde tedy o výběr, se kterým se dá postavit kompletní globálně diverzifikované portfolio, aniž byste za obchodování platili běžné komise 5–20 €, které si účtují jiní brokeři.",
      "Pro českého investora je klíčové, že drtivá většina těchto ETF je vedena v eurech nebo dolarech a obchoduje se na burzách jako Xetra nebo Euronext. To znamená, že při vkladu v korunách a nákupu v cizí měně vstupuje do hry kurzové riziko a u DEGIRO buď automatická konverze (AutoFX) s přirážkou, nebo ruční směna. Tato kategorie proto není o jednom indexu, ale o tom, které konkrétní fondy lze u DEGIRO pořídit levně a jak jejich nákup naplánovat, aby zůstal skutečně bezplatný."
    ],
    "verdict": [
      "Ze seznamu bezplatných ETF vybírejte přesně to, co byste kupovali i jinde – bezplatnost je bonus, ne důvod ke kompromisu v kvalitě fondu. Preferujte akumulační (Acc) verze s domicilem v Irsku (ISIN začíná na IE): akumulace automaticky reinvestuje dividendy, takže nemusíte kvůli výplatě podávat další obchod, a irský domicil díky smlouvě se USA snižuje srážkovou daň z amerických dividend uvnitř fondu na 15 % místo 30 %. Sledujte nízký TER (u páteřních fondů typicky 0,07–0,20 % ročně), dostatečnou velikost fondu kvůli likviditě a úzkému spreadu a čistotu indexu (širokou tržní expozici bez pákových či syntetických konstrukcí).",
      "Praktický recept je jednoduchý: postavte portfolio z jednoho až tří širokých fondů (např. IWDA + EMIM, nebo jen CSPX pro USA jádro) a kupujte je vždy jednou měsíčně, ideálně ke stejnému datu. Takto zůstane každý měsíční nákup zdarma a strategie pravidelného investování (DCA) funguje s nulovými komisemi po celý rok. Distribučním verzím se u DEGIRO spíše vyhněte – nejenže vytvářejí daňovou administrativu s dividendami, ale reinvestice výplaty by znamenala další, už zpoplatněný obchod."
    ],
    "forWhom": "Hodí se pro začínající i pokročilé investory, kteří investují pravidelně a dlouhodobě metodou DCA a chtějí minimalizovat náklady na obchodování – zejména pro menší měsíční částky, kde by běžná komise 5–20 € ukrojila citelnou část vkladu. Naopak se méně hodí pro aktivní tradery, kteří obchodují stejný fond víckrát za měsíc (druhý obchod už je zpoplatněn), pro investory požadující automatizované trvalé pokyny a zlomkové akcie (DEGIRO je standardně nenabízí) a pro ty, kdo chtějí širokou paletu fondů mimo bezplatný seznam nebo aktivní CZK účet bez měnových přirážek.",
    "risks": [
      "Fair Use politika není trvale zaručená – DEGIRO seznam bezplatných ETF a jeho podmínky v minulosti měnil (dříve Kernselectie, nyní Fair Use s poplatkem 1 € za druhý obchod). Fond, který je dnes zdarma, může být příště zpoplatněn nebo ze seznamu vyřazen.",
      "I u „bezplatného“ obchodu platíte spread a u nákupu v cizí měně měnovou přirážku. Při automatické konverzi (AutoFX) DEGIRO účtuje kurzový příplatek řádově kolem 0,25 %, takže investování z korun není zcela zdarma.",
      "Většina fondů je v EUR nebo USD, zatímco výdaje máte v korunách – nesete kurzové riziko mezi korunou a cizí měnou, které může krátkodobě převážit i samotný pohyb trhu.",
      "Omezení na jeden bezplatný obchod měsíčně komplikuje rebalancování a jednorázové větší nákupy: prodej při rebalancování i opakovaný nákup téhož fondu ve stejném měsíci už spadá pod zpoplatněný druhý obchod."
    ],
    "faqs": [
      {
        "q": "Je nákup ETF na DEGIRO opravdu úplně zdarma?",
        "a": "Bez běžné komise ano, ale jen pro první obchod s daným fondem v kalendářním měsíci a do objemu zhruba 1 000 € na transakci. Vždy ale platíte tržní spread a u nákupu v cizí měně měnovou přirážku, takže „zdarma“ znamená bez komise, nikoli bez jakýchkoli nákladů."
      },
      {
        "q": "Co se stane, když ve stejném měsíci koupím stejný ETF podruhé?",
        "a": "Druhý a každý další obchod se stejným ETF ve stejném kalendářním měsíci je zpoplatněn administrativním poplatkem okolo 1 € plus spread. U jiného fondu ze seznamu ale běží nový bezplatný obchod nezávisle. Proto se doporučuje nakupovat každý fond jednou měsíčně."
      },
      {
        "q": "Které ETF ze seznamu zdarma jsou nejlepší pro dlouhodobé portfolio?",
        "a": "Pro jádro portfolia se nejčastěji volí iShares Core MSCI World (IWDA) pro vyspělé trhy, iShares Core MSCI Emerging Markets IMI (EMIM) pro rozvíjející se trhy a iShares Core S&P 500 (CSPX) pro americké akcie. Všechny jsou akumulační, s irským domicilem a nízkým TER, takže tvoří levný a diverzifikovaný základ."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční verzi?",
        "a": "Pro DEGIRO dává větší smysl akumulační (Acc) verze. Reinvestuje dividendy automaticky uvnitř fondu, takže se vyhnete jak daňové administrativě s vyplacenými dividendami, tak dalšímu – už zpoplatněnému – nákupu, kterým byste jinak výplatu reinvestovali."
      },
      {
        "q": "Jak se daní tyto ETF pro českého investora?",
        "a": "U akumulačních ETF z irského domicilu neřešíte průběžné zdanění dividend. Zisk z prodeje je v ČR osvobozen od daně z příjmů po splnění tříletého časového testu držby; při dřívějším prodeji se zisk daní. Pro konkrétní situaci a aktuální limity je vhodné ověřit si podmínky u daňového poradce."
      },
      {
        "q": "Musím kvůli měně investovat přímo v eurech?",
        "a": "Ne nutně – vklad lze poslat v korunách a DEGIRO při nákupu v cizí měně provede automatickou konverzi (AutoFX) s kurzovou přirážkou řádově kolem 0,25 %. Kdo chce přirážku minimalizovat, řeší směnu měny ručně, ale ani tak se kurzovému riziku mezi korunou a EUR/USD nevyhne."
      }
    ]
  },
  "nejlevnejsi-etf": {
    "introTitle": "Nejlevnější ETF podle TER: kde končí poplatky a začíná výnos",
    "intro": [
      "Kategorie nejlevnějších ETF sdružuje fondy s nejnižším ukazatelem celkové nákladovosti (TER, Total Expense Ratio). TER je roční poplatek za správu, který se nestrhává fakturou, ale plynule ukusuje z hodnoty fondu. U nejlevnějších širokých akciových ETF se dnes pohybuje kolem 0,03 až 0,07 %, u dluhopisových ETF od zhruba 0,04 % a u nákladnějších tříd, jako jsou nemovitostní (REIT) fondy, obvykle od 0,24 % výše. Konkrétně sem patří třeba iShares Core S&P 500 (CSPX, ISIN IE00B5BMR087) s TER 0,07 %, iShares Core FTSE 100 (ISF, IE00B53HP851) s TER 0,07 % nebo levné varianty MSCI World a FTSE All-World od Amundi, Vanguardu a SPDR.",
      "Proč to řešit? Poplatek je jediná složka výnosu, kterou máte plně pod kontrolou. Výkonnost trhu neovlivníte, ale rozdíl mezi ETF s TER 0,07 % a 0,50 % je jistý a předvídatelný. Při investici 100 000 EUR a horizontu 20 až 30 let se kvůli složenému úročení může jednat o desetitisíce eur navíc nebo méně na konci. U dlouhodobého pasivního investora je proto nízké TER jedním z mála skutečně spolehlivých zdrojů převahy.",
      "Pro českého investora je podstatné, že drtivá většina nejlevnějších ETF má irský domicil (ISIN začíná na IE) a obchoduje se v EUR, USD nebo GBP. Prakticky všechny najdete u brokerů dostupných z Česka (DEGIRO, XTB, Trading 212, Interactive Brokers, Portu), řadu z nich lze u DEGIRO nakoupit i bez poplatku za obchod. Fondy jsou vedené v cizí měně, takže mezi vámi a výnosem vždy stojí kurz koruny vůči EUR či USD."
    ],
    "verdict": [
      "V této kategorii nejde honit úplně nejnižší číslo za každou cenu, ale najít nejlevnější fond na kvalitním, širokém indexu. U dlouhodobého portfolia preferujte akumulační třídu (Acc) s irským domicilem: akumulace automaticky reinvestuje dividendy a odpadá papírování, irský domicil díky daňové smlouvě mezi Irskem a USA snižuje srážkovou daň z amerických dividend uvnitř fondu na 15 %, což u S&P 500 a MSCI World reálně zvedá čistý výnos oproti fondům z jiných domicilů.",
      "Vedle samotného TER sledujte velikost fondu a likviditu. Fond nad 500 mil. EUR je stabilnější, má užší rozpětí nákup/prodej (spread) a nižší riziko zrušení. Občas platí, že o pár setin levnější, ale drobný a málo obchodovaný fond vás na spreadu připraví o víc, než ušetříte na TER. Ideál je tedy kombinace: nízké TER, velký a likvidní fond a čistý, dobře diverzifikovaný index (S&P 500, MSCI World, FTSE All-World) bez zbytečných pákových nebo tematických příměsí."
    ],
    "forWhom": "Hodí se pro dlouhodobé pasivní investory, kteří stavějí jádro portfolia metodou kup a drž a chtějí maximalizovat čistý výnos tím, že minimalizují náklady, typicky pravidelné měsíční investice do širokého indexu na horizontu 10 a více let. Nehodí se pro krátkodobé spekulanty ani pro investory, kteří hledají konkrétní sektorovou, tematickou nebo aktivně řízenou strategii, tam je nejnižší TER druhořadé kritérium a nemá smysl kvůli němu obětovat vhodnost fondu.",
    "risks": [
      "Honba za nejnižším TER může svést k nákupu drobného nebo nově vzniklého fondu, který má sice skvělé číslo, ale nízké aktiva pod správou. Hrozí širší spread, horší plnění příkazů a v krajním případě zrušení (likvidace) fondu s nuceným prodejem v nevhodnou dobu.",
      "TER není jediný náklad. Reálné zaostávání za indexem (tracking difference) ovlivňují i způsob replikace, efektivita zdanění dividend a příjmy z půjčování cenných papírů. Dva fondy se stejným TER se proto v čistém výsledku mohou lišit, číslo TER samo o sobě nestačí.",
      "Levné ETF v této kategorii jsou vedené v EUR, USD nebo GBP. Výnos i hodnota portfolia v korunách kolísají s kurzem, posílení koruny může výnos umazat bez ohledu na to, jak nízký poplatek fond má.",
      "Nejlevnější bývají fondy na velké, koncentrované indexy typu S&P 500 nebo MSCI World s vysokou vahou amerických technologických firem. Nízký poplatek nezmenšuje riziko koncentrace, jen levně kupujete expozici, která nemusí být tak diverzifikovaná, jak se zdá."
    ],
    "faqs": [
      {
        "q": "Co přesně znamená TER a jak se strhává?",
        "a": "TER (Total Expense Ratio) je celkový roční poplatek za správu ETF vyjádřený v procentech z hodnoty investice. Nestrhává se fakturou, ale průběžně se odečítá z majetku fondu, takže se projeví jako mírně nižší kurz. Při TER 0,07 % a investici 10 000 EUR jde zhruba o 7 EUR ročně."
      },
      {
        "q": "Je nejnižší TER vždy nejlepší volba?",
        "a": "Ne nutně. Kromě TER rozhoduje velikost a likvidita fondu, kvalita indexu a reálné zaostávání za indexem (tracking difference). Někdy o pár setin dražší, ale velký a likvidní fond přinese v čistém lepší výsledek než nejlevnější drobný fond s širokým spreadem."
      },
      {
        "q": "Kolik reálně ušetřím oproti drahému fondu?",
        "a": "Záleží na rozdílu v TER a horizontu. Rozdíl 0,5 % ročně může na 30letém investování snížit konečnou částku o zhruba 15 až 20 % kvůli složenému úročení. U velkých částek a dlouhých horizontů jde o desetitisíce eur, proto jsou náklady u pasivních investorů zásadní."
      },
      {
        "q": "Mají levné ETF akumulační, nebo distribuční variantu?",
        "a": "Existují obě. Pro dlouhodobé budování majetku je obvykle praktičtější akumulační třída (Acc), která dividendy automaticky reinvestuje uvnitř fondu. Distribuční (Dist) třídu volí ten, kdo chce pravidelnou hotovost, počítejte ale s tím, že vyplacené dividendy je v ČR nutné danit."
      },
      {
        "q": "Proč mají levné ETF nejčastěji irský domicil?",
        "a": "Irský domicil (ISIN začínající IE) je u nejlevnějších fondů běžný kvůli daňové smlouvě mezi Irskem a USA, která snižuje srážkovou daň z amerických dividend uvnitř fondu na 15 %. To u fondů na americké akcie zvyšuje čistý výnos, proto sem míří většina levných S&P 500 a World ETF."
      },
      {
        "q": "Musím z levného ETF platit v Česku daň?",
        "a": "Ano, zisk z prodeje ETF podléhá dani z příjmů, pokud nesplníte časový (tzv. časový test) nebo hodnotový limit pro osvobození. U akumulačních fondů řešíte daň typicky až při prodeji, u distribučních daníte i průběžně vyplácené dividendy. Konkrétní situaci si ověřte podle aktuálních pravidel nebo s daňovým poradcem."
      }
    ]
  },
  "nejlepsi-etf-2026": {
    "introTitle": "Nejlepší ETF pro rok 2026: čím začít a proč",
    "intro": [
      "Když se řekne \"nejlepší ETF\", většina začínajících investorů si představí jeden konkrétní fond, který porazí ostatní. Realita je jiná. V praxi jde o hrstku širokých, levných a velkých akciových ETF, které tvoří páteř drtivé většiny českých portfolií. Opakovaně se v nich objevují tři jména: iShares Core S&P 500 (CSPX, ISIN IE00B5BMR087), iShares Core MSCI World (IWDA, IE00B4L5Y983) a Vanguard FTSE All-World (VWCE, IE00BK5BQT80). Nejde o tipy na jeden rok, ale o stavební kameny, které dávají smysl držet deset a více let.",
      "Rozdíl mezi nimi je hlavně v šíři záběru. CSPX pokrývá 500 největších amerických firem, IWDA rozšiřuje záběr na zhruba 1 500 firem z vyspělých trhů celého světa a VWCE jde nejdál: přes 3 800 firem z vyspělých i rozvíjejících se trhů v jednom fondu. Poplatky (TER) se pohybují řádově od 0,07 % u CSPX po 0,20-0,22 % u IWDA a VWCE ročně, takže náklady jsou u všech nízké a v praxi nejsou hlavním rozhodovacím faktorem.",
      "Pro českého investora je podstatné, že všechny tři fondy jsou irské (domicil Irsko), obchodují se v eurech na evropských burzách a jsou běžně dostupné u brokerů jako DEGIRO, XTB, Trading 212 nebo Interactive Brokers. Kupujete je tedy za koruny přepočtené na euro nebo dolar, měnové riziko koruny nesete napřímo. To není chyba, jen fakt, se kterým je dobré počítat: krátkodobě může posílení koruny výnos v korunách ubrat, dlouhodobě však o výsledku rozhoduje výkonnost akcií, ne pár procent kurzu."
    ],
    "verdict": [
      "Pro naprostou většinu lidí je nejlepší volbou jeden široký, akumulační ETF s irským domicilem. Akumulační varianta (v názvu \"Acc\") automaticky reinvestuje dividendy uvnitř fondu, takže se nemusíte starat o reinvestování ručně a odkládáte zdanění výnosu až na prodej. Irský domicil je klíčový kvůli zdanění dividend uvnitř fondu: díky smlouvě mezi Irskem a USA platí fond z amerických dividend jen 15 % srážkovou daň místo 30 %, což u fondů zaměřených na USA (CSPX, IWDA i VWCE) dlouhodobě šetří nezanedbatelnou část výnosu.",
      "Konkrétně: začátečník, který chce jeden fond a klid, sáhne po VWCE, protože v jednom nákupu drží celý svět včetně rozvíjejících se trhů. Kdo chce nejnižší náklady a je smířený s tím, že sází hlavně na USA, zvolí CSPX. IWDA je rozumný kompromis mezi oběma. U všech tří platí, že jde o obří fondy s vysokou likviditou a nízkým rozpětím (spreadem), takže se dobře nakupují i pravidelně po menších částkách. Naopak se vyhýbejte úzkým, drahým nebo malým \"módním\" fondům jen proto, že loni vydělaly nejvíc, výběr podle žebříčku posledního roku je nejčastější chyba."
    ],
    "forWhom": "Tato kategorie sedí dlouhodobému investorovi s horizontem alespoň 8-10 let, který chce jednoduché, levné a globálně diverzifikované jádro portfolia a je ochoten přečkat propady bez panického prodeje. Ideální je pro pravidelné měsíční investování. Nehodí se pro toho, kdo bude peníze potřebovat do 3-5 let, kdo hledá pravidelný pasivní příjem z dividend (pak dávají smysl spíš distribuční nebo dividendové ETF) nebo kdo nesnese pokles hodnoty o desítky procent v horším roce.",
    "risks": [
      "Koncentrace do USA a velkých technologických firem. CSPX je čistě americký a i ve \"světových\" fondech IWDA a VWCE tvoří USA kolem 60-70 % a několik technologických gigantů výraznou část indexu. Diverzifikace je proto menší, než se na první pohled zdá.",
      "Měnové riziko vůči koruně. Fondy jsou vedeny v eurech či dolarech a jejich aktiva jsou převážně v dolaru. Posílení koruny vůči těmto měnám sníží váš výnos přepočtený do korun, i když samotné akcie porostou.",
      "Riziko výběru podle minulé výkonnosti. \"Nejlepší ETF roku\" podle žebříčku často znamená fond, který má nejlepší roky za sebou. Honba za loňským vítězem vede k nákupu draho a zbytečnému přeskakování mezi fondy.",
      "Sekvenční riziko a psychologie. Široké akciové ETF mohou v krizi ztratit 30-50 % hodnoty a několik let se zotavovat. Kdo prodá v panice nebo potřebuje peníze v nevhodnou dobu, realizuje ztrátu, kterou by jinak přečkal."
    ],
    "faqs": [
      {
        "q": "Jaké ETF jsou pro rok 2026 nejlepší volbou?",
        "a": "Pro většinu českých investorů to jsou tři osvědčené fondy: VWCE (celý svět v jednom fondu), CSPX (500 největších amerických firem s nejnižším TER) a IWDA (vyspělé trhy světa). Nejde o krátkodobé tipy, ale o levná a široká jádra portfolia vhodná k držení na mnoho let."
      },
      {
        "q": "Je lepší jeden ETF, nebo jich kombinovat víc?",
        "a": "Pro začátek úplně stačí jeden globální fond, typicky VWCE, který v sobě má vyspělé i rozvíjející se trhy. Kombinace jako CSPX plus IWDA nebo přidání samostatných rozvíjejících se trhů dává smysl až pokročilejším investorům, kteří chtějí sami řídit váhy regionů. Více fondů znamená víc práce s rebalancováním, ne automaticky lepší výsledek."
      },
      {
        "q": "Proč se doporučují právě irské (Acc) fondy?",
        "a": "Irský domicil snižuje srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 %, což dlouhodobě zvyšuje výnos. Akumulační varianta (Acc) navíc dividendy sama reinvestuje a odkládá zdanění až na okamžik prodeje, takže se o nic nemusíte starat a peníze pracují dál."
      },
      {
        "q": "Jak se nejlepší ETF daní v Česku?",
        "a": "Pokud podíly držíte déle než 3 roky, zisk z prodeje je díky časovému testu osvobozen od daně z příjmů. U akumulačních fondů navíc během držení neřešíte žádné dividendy. Při prodeji dříve než po 3 letech se zisk daní jako ostatní příjem, proto se tyto fondy hodí hlavně pro dlouhý horizont. Daňová pravidla se mohou měnit, ověřte si aktuální stav."
      },
      {
        "q": "Kolik peněz potřebuji na začátek?",
        "a": "Klidně pár set až tisíc korun měsíčně. VWCE, CSPX i IWDA se dají u brokerů jako DEGIRO, XTB nebo Trading 212 nakupovat pravidelně a někde i ve zlomcích podílu. Důležitější než jednorázová velká částka je pravidelnost a vytrvalost po řadu let."
      },
      {
        "q": "Vyplatí se čekat na propad trhu, než začnu investovat?",
        "a": "Většinou ne. Časování trhu se dlouhodobě nedaří ani profesionálům a čekání na \"ten správný okamžik\" nejčastěji znamená propásnout roky růstu. Rozumnější je začít pravidelně investovat hned a nižší ceny během propadů brát jako příležitost nakoupit levněji, ne jako důvod k panice."
      }
    ]
  },
  "nejlepsi-akciove-etf": {
    "introTitle": "Akciové ETF: jak si mezi tisíci fondů vybrat ten svůj",
    "intro": [
      "\"Akciové ETF\" je nejširší dotaz, jaký může český investor zadat, a zároveň ten nejméně konkrétní. Akcie jsou třída aktiv, ne fond. Než se rozhodnete pro nějaký ticker, musíte odpovědět na dvě otázky: kolik akcií vs. dalších tříd aktiv (dluhopisy, komodity) chcete držet a jaký kus akciového světa chcete vlastnit. Tahle stránka je rozcestník, ne konkurent stránce o S&P 500 nebo o celosvětových fondech. Cílem je pomoct vám zvolit správnou vrstvu, ne vnutit jeden konkrétní produkt.",
      "Akcie jsou motor dlouhodobého výnosu portfolia. Historicky nabízejí nejvyšší reálný výnos ze všech běžných tříd aktiv, ale za cenu největšího kolísání: široký akciový trh umí během medvědího trhu ztratit 30 až 50 % a několik let se z toho vzpamatovávat. Proto se akciové ETF hodí především na dlouhý horizont (ideálně 10 a více let), kde má čas vyhladit propady. Dluhopisové ETF slouží jako tlumič výkyvů, komodity jako pojistka proti inflaci, ale růst obstarávají akcie.",
      "Jakmile víte, že chcete akcie, přichází druhá volba: šířka expozice. Nejvýše stojí celosvětové fondy jedním nákupem (FTSE All-World, MSCI ACWI) přes rozvinutý svět (MSCI World, S&P 500) až po regionální (Evropa, USA, rozvíjející se trhy) a sektorové sázky (technologie, energetika). Čím užší fond, tím vyšší koncentrace a riziko. Naprostá většina drobných investorů udělá nejlíp, když jádro postaví na jednom širokém globálním fondu a případné regionální nebo sektorové ETF přidá jen jako menšinový satelit.",
      "Pro Čecha platí jedno navíc: skoro všechny tyhle fondy jsou vedené v USD nebo EUR a vy je nakupujete za koruny. Výnosy si vždycky přepočítáváte zpět do CZK, takže nesete měnové riziko vůči koruně vždycky. To není důvod se akciím vyhýbat, jen důvod nedívat se na výnos v dolarech jako na výnos ve vaší peněžence."
    ],
    "verdict": [
      "Pro drtivou většinu lidí je nejlepší \"akciové ETF\" jeden široký globální fond jako celé jádro. Nejlevnější celosvětovou variantou je Vanguard FTSE All-World (VWCE, ISIN IE00BK5BQT80, TER 0,19 %, přes 43 mld. EUR) nebo iShares MSCI ACWI (SSAC, IE00B6R52259, TER 0,20 %, přes 29 mld. EUR) — oba drží tisíce firem z rozvinutých i rozvíjejících se trhů v jednom nákupu. Kdo chce jen rozvinutý svět bez emerging markets, sáhne po iShares Core MSCI World (SWDA, IE00B4L5Y983, TER 0,20 %, přes 123 mld. EUR) nebo levnějším Xtrackers MSCI World (XDWD, IE00BJ0KDQ92, TER 0,12 %). Detailní srovnání těchhle úhlů najdete na stránkách o celosvětových fondech a MSCI World — tady je zmiňujeme jen jako výchozí bod.",
      "Pokud věříte hlavně americkému trhu, jádrem bývá S&P 500. Nejlevnější jsou dnes State Street SPDR S&P 500 (SPYL, IE000XZSV718, TER 0,03 %) a Invesco S&P 500 (SPXP, IE00B3YCGJ38, TER 0,05 %), z osvědčených pak iShares Core S&P 500 (CSP1, IE00B5BMR087, TER 0,07 %, přes 131 mld. EUR). Regionální nebo růstový doplněk můžete přidat jako satelit: iShares Core MSCI Europe (SMEA, IE00B4K48X80, TER 0,12 %) pro Evropu, iShares Core MSCI Emerging Markets IMI (EMIM, IE00BKM4GZ66, TER 0,18 %) pro rozvíjející se trhy nebo iShares Nasdaq 100 (IE00B53SZB19, TER 0,30 %) pro americké technologie. Tyhle fondy ale nepatří do jádra — jsou to vědomé sázky navrch.",
      "Poplatky u širokých akciových fondů dnes klesly tak nízko, že rozdíl mezi TER 0,03 % a 0,20 % je pár korun ročně z každých investovaných deseti tisíc. Důležitější než honba za nejnižším TER je vybrat správnou šířku expozice, zvolit akumulační nebo distribuční třídu podle toho, jestli chcete růst nebo příjem, a pak fond roky držet. Kdo přeskakuje mezi fondy podle loňské výkonnosti, obvykle prodělá víc na daních a spreadech než ušetří na poplatku."
    ],
    "forWhom": "Široké akciové ETF se hodí každému, kdo staví dlouhodobé portfolio na horizont 10 a více let a chce, aby růst obstaraly akcie — od úplného začátečníka (jeden globální fond) po zkušenějšího investora, který k jádru přidává regionální nebo sektorové satelity. Sedne pravidelnému měsíčnímu investorovi i tomu, kdo jednorázově ukládá větší částku a má klid ji nechat pracovat. Nehodí se pro peníze, které budete potřebovat za pár let (na ty patří spíš dluhopisy nebo spořicí účet), pro člověka, který by při 30 až 40% propadu panicky prodával, a pro toho, kdo hledá jistotu nominální hodnoty. Kdo chce jen tlumit výkyvy nebo pravidelný příjem, měl by akciové jádro doplnit dluhopisovou nebo dividendovou složkou, ne ho jimi nahradit.",
    "risks": [
      "Tržní riziko a volatilita: čistě akciové portfolio umí během medvědího trhu spadnout o 30 až 50 % a roky se z toho zotavovat. Bez dostatečně dlouhého horizontu a klidné hlavy vás propad donutí prodat na dně.",
      "Měnové riziko vůči koruně: fondy jsou v USD nebo EUR a vy investujete koruny. I když firma vyroste, posílení koruny vůči dolaru vám část výnosu v přepočtu do CZK ubere. Měnově zajištěné (hedged) třídy zajišťují maximálně do EUR nebo USD, riziko vůči CZK vám neodstraní a zajištění navíc stojí na úrokovém diferenciálu.",
      "Falešný pocit diverzifikace: mnoho lidí si myslí, že drží \"celý svět\", ale ve skutečnosti mají jen S&P 500 nebo dokonce Nasdaq 100. I globální fondy mají dnes přes 60 % v USA a velkou váhu hrstky technologických gigantů. Kombinovat tři americké fondy neznamená být diverzifikovaný.",
      "Překrývání a přeplácání satelitů: kdo k celosvětovému jádru přidá americký, technologický i Nasdaq fond, si jen zdvojuje stejné firmy (Apple, Microsoft, Nvidia) a zvyšuje koncentraci místo diverzifikace. Každý přidaný fond by měl přinášet něco, co jádro nemá."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi akciovým ETF a konkrétním fondem jako S&P 500?",
        "a": "\"Akciové ETF\" je zastřešující pojem pro všechny fondy investující do akcií — patří sem globální (VWCE, SWDA), americké (S&P 500 přes CSP1 nebo SPYL), regionální (evropský SMEA) i sektorové. S&P 500 je jen jedna konkrétní volba uvnitř téhle kategorie: 500 největších amerických firem. Tahle stránka je rozcestník, který vám pomůže zvolit správnou vrstvu; detaily ke konkrétním indexům najdete na jejich vlastních stránkách."
      },
      {
        "q": "Kolik akciových ETF bych měl mít v portfoliu?",
        "a": "Pro naprostou většinu lidí stačí jeden široký globální fond (například VWCE nebo SSAC), který sám drží tisíce firem. Kdo chce vědomě posílit nějaký region nebo sektor, přidá jeden až dva satelity (třeba EMIM na rozvíjející se trhy), ale ty by měly tvořit menšinu. Deset různých akciových ETF obvykle znamená hlavně vyšší náklady a překrývání, ne lepší diverzifikaci."
      },
      {
        "q": "Mám vybírat akumulační, nebo distribuční třídu?",
        "a": "Záleží na cíli. Akumulační třída (například VWCE, SWDA) dividendy automaticky reinvestuje uvnitř fondu — vy je neřešíte v daňovém přiznání a naplno využijete složené úročení, což se hodí ve fázi budování majetku. Distribuční třída (VWRL, IUSA) vám dividendy vyplácí na účet; ty se v ČR daní 15 %, hodí se ale pro pravidelný příjem v rentierské fázi. Podrobnosti řeší stránky o akumulačních a distribučních fondech a daňový hub."
      },
      {
        "q": "Jak se v ČR v roce 2026 daní zisk z akciových ETF?",
        "a": "U klasických akciových ETF (jsou to cenné papíry-fondy) platí dva testy pro osvobození. Časový test: pokud fond držíte déle než 3 roky, je zisk z prodeje osvobozen — od roku 2026 bez horního limitu. Hodnotový test: pokud úhrn vašich prodejů cenných papírů nepřesáhne 100 000 Kč za rok, je zisk osvobozen bez ohledu na dobu držby. Vyplacené dividendy z distribučních tříd se daní 15 %. U akumulačních fondů se reinvestice uvnitř fondu neřeší. Konkrétní situaci si ověřte na daňovém hubu nebo s daňovým poradcem."
      },
      {
        "q": "Proč je většina těchhle fondů domicilovaná v Irsku (ISIN začínající IE)?",
        "a": "Irský domicil (ISIN začíná IE00) je pro Čecha daňově výhodný u fondů s americkými akciemi: Irsko má s USA smlouvu, která snižuje srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 %. Proto najdete většinu velkých ETF (CSP1, SWDA, VWCE) domicilovaných tam. Lucemburský domicil (LU) je běžný také a pro akciové fondy funguje obdobně."
      },
      {
        "q": "Nesu měnové riziko, i když kupuji přes českého brokera v korunách?",
        "a": "Ano. To, že u brokera zadáte příkaz v korunách, neznamená, že je fond v korunách. Podkladová aktiva jsou v dolarech, eurech a dalších měnách a jejich hodnotu si vždycky přepočítáváte zpět do CZK. Když koruna posílí, část výnosu v přepočtu ztratíte, i kdyby akcie samy vyrostly. Měnově zajištěné třídy zajišťují maximálně do EUR nebo USD, riziko vůči koruně vám neodstraní a zajištění stojí peníze."
      }
    ]
  },
  "nejlepsi-akumulacni-etf": {
    "introTitle": "Akumulační ETF: reinvestice dividend uvnitř fondu a proč to Čecha zajímá",
    "intro": [
      "Akumulační ETF (v názvech značené jako „Acc\", „Accumulating\" nebo „C\") je fond, který dividendy z držených akcií nebo kupony z dluhopisů nevyplácí na váš účet, ale automaticky je reinvestuje zpět dovnitř fondu. Vy dostanete stejný počet podílů jako předtím, jen jejich hodnota postupně roste i o zadržený a znovu investovaný příjem. Opakem je distribuční třída, která tytéž dividendy pravidelně posílá na váš brokerský účet – rozdíl není v indexu ani ve složení portfolia, ale výhradně ve způsobu nakládání s příjmem. Většina velkých ETF existuje v obou variantách současně: iShares Core S&P 500 nebo Vanguard FTSE All-World mají akumulační i distribuční verzi se shodným podkladem.",
      "Pro českého drobného investora je akumulace zajímavá hlavně ze dvou důvodů. Za prvé kvůli efektu složeného úročení bez tření: fond reinvestuje dividendu okamžitě a bez transakčního poplatku, zatímco kdybyste stejnou dividendu dostali na účet distribučně, museli byste ji ručně doinvestovat, často za poplatek a s prodlevou. Za druhé kvůli daňové administrativě – a to je pro Čecha ten hlavní hák. U akumulačního fondu se totiž reinvestice dividend odehrává uvnitř fondu a vám žádný zdanitelný dividendový příjem na účet nepřiteče, takže v daňovém přiznání za rok nemusíte řešit patnáctiprocentní daň z dividend. Danit budete až případný zisk z prodeje podílů, na který se ovšem vztahuje časový a hodnotový test (viz níže).",
      "Tato stránka není o konkrétním regionu ani indexu – akumulační ETF najdete na S&P 500, MSCI World, FTSE All-World i na dluhopisy nebo zlato. Jde čistě o rozhodnutí, jakou třídu podílů zvolit. Pokud řešíte, do čeho vlastně investovat, zamiřte na kategorie podle regionu či strategie; tady vám vysvětlíme, kdy akumulace dává smysl a kdy sáhnout po distribuci.",
      "Zásadní upozornění na měnu, které platí bez ohledu na typ výplaty: akumulační ETF nekoupíte „v korunách\". Fondy jsou denominované v USD nebo EUR a broker vám nákup přepočítá z CZK. Výnosy, které vidíte přepočtené do korun, tedy vždy nesou kurzové riziko dolaru či eura vůči koruně – to akumulace neodstraní, jen v ní není vidět formou výplat."
    ],
    "verdict": [
      "Pro naprostou většinu dlouhodobých investorů, kteří ještě nečerpají rentu, je akumulační třída výchozí volbou – a je jedno, jestli stavíte portfolio na jednom globálním fondu, nebo na kombinaci. Jako jádro se nabízí Vanguard FTSE All-World UCITS ETF Accumulating (ISIN IE00BK5BQT80, ticker VWCE, TER 0,19 %, jmění přes 43 mld. EUR), který jedním nákupem pokryje rozvinuté i rozvíjející se trhy a dividendy z tisíců firem řeší za vás. Kdo chce jen rozvinutý svět, sáhne po iShares Core MSCI World UCITS ETF Acc (IE00B4L5Y983, SWDA, TER 0,20 %, přes 123 mld. EUR) nebo levnějším Amundi Core MSCI World UCITS ETF Acc (IE000BI8OT95, MWRE, TER 0,12 %). Pro čistě americkou expozici je nejlevnější akumulační cestou State Street SPDR S&P 500 UCITS ETF Acc (IE000XZSV718, SPYL, TER pouhých 0,03 %), za ním iShares Core S&P 500 Acc (IE00B5BMR087, CSP1, TER 0,07 %) a Vanguard S&P 500 Acc (IE00BFMXXD54, VUAA, TER 0,07 %).",
      "Klíčové je, že všechny jmenované fondy mají irský domicil (ISIN začíná IE), což u portfolia plného amerických akcií reálně zvyšuje výnos – Irsko má s USA daňovou smlouvu, takže srážková daň z amerických dividend uvnitř fondu je 15 % místo 30 %. U akumulační třídy se tento efekt projeví tiše zvýšeným růstem hodnoty podílu, aniž byste cokoli řešili. Mezi hlavními S&P 500 a World fondy jsou rozdíly v TER malé (0,03 až 0,20 %); u nákladově citlivého jádra rozhoduje spíš likvidita a měna obchodování u vašeho brokera než setiny procenta.",
      "Naopak akumulaci nevolte automaticky, pokud jste ve fázi čerpání a chcete z portfolia žít – tam bývá čistší distribuční fond, který vám příjem posílá sám (viz kategorie distribučních ETF). A pozor na jeden detail: existují i akumulační ne-akciové produkty jako Amundi Physical Gold ETC (C) (FR0013416716, TER 0,12 %). To ovšem není fond-cenný papír jako akciové ETF, ale ETC krytý zlatem, a jeho daňový režim se od klasického akciového ETF liší – nespoléhejte u něj automaticky na stejný časový test."
    ],
    "forWhom": "Akumulační ETF se hodí pro každého, kdo dlouhodobě spoří a majetek buduje – tedy investory v akumulační fázi s horizontem mnoha let, kteří příjem z portfolia teď nepotřebují a chtějí maximum výnosu nechat pracovat dál bez ročního papírování s daní z dividend. Ideální jsou pro pravidelné měsíční investování do širokého indexu. Nehodí se naopak pro toho, kdo z portfolia chce žít a potřebuje pravidelný hotovostní příjem (renta, FIRE fáze) – pro něj je přirozenější distribuční třída. A pro tuzemské portfolio zaměřené na komodity či zlato pozor na to, že akumulační ETC není totéž co akumulační akciové ETF a daňově se chová jinak.",
    "risks": [
      "Iluze, že akumulace řeší daně navždy. Reinvestice dividend uvnitř fondu skutečně odpadá z přiznání, ale zisk z prodeje podílů daníte. Osvobodí ho až časový test (drženo déle než 3 roky, od roku 2026 bez horního limitu) nebo hodnotový test (úhrn všech prodejů cenných papírů do 100 000 Kč za rok). Kdo prodá dřív a nad limit, zdaní zisk běžnou sazbou.",
      "Měnové riziko zůstává skryté, ne zrušené. Fondy jako VWCE nebo SWDA drží aktiva v USD; výnos přepočtený do korun kolísá s kurzem USD/CZK i EUR/CZK. Ani měnově zajištěná (hedged) akumulační třída Čechovi CZK riziko neodstraní – zajištění jde nanejvýš do EUR nebo USD, stojí na úrokovém diferenciálu a vůči koruně vás nechrání.",
      "Záměna produktů. Do akumulačního filtru spadají i ETC krytá zlatem (Amundi Physical Gold ETC C) nebo jiné ne-akciové produkty. Nejsou to fondy-cenné papíry jako klasické ETF a jejich daňový režim v ČR se může lišit – neaplikujte na ně bez ověření tříletý časový test.",
      "Horší přehled o skutečném dividendovém výnosu. Protože žádná výplata nechodí na účet, snáze ztratíte přehled o tom, kolik vám portfolio reálně vydělává na dividendách a jak roste. Pro sledování výnosu se musíte spolehnout na výpisy a hodnotu podílu, ne na příjem v hotovosti."
    ],
    "faqs": [
      {
        "q": "Jak poznám akumulační ETF podle názvu?",
        "a": "Hledejte v názvu nebo třídě zkratky „Acc\", „Accumulating\" nebo někdy „C\" (capitalising). Například Vanguard FTSE All-World UCITS ETF (USD) Accumulating (VWCE) nebo iShares Core MSCI World UCITS ETF USD (Acc) (SWDA). Distribuční třída téhož fondu bývá značená „Dist\", „Distributing\" nebo „D\" a má často jiný ISIN. Vždy si ISIN ověřte, ať nekoupíte omylem opačnou variantu."
      },
      {
        "q": "Musím u akumulačního ETF danit reinvestované dividendy?",
        "a": "Ne. U akumulačního fondu se dividendy reinvestují uvnitř fondu a na váš účet žádný dividendový příjem nepřiteče, takže v přiznání 15% daň z dividend neřešíte. Danit budete až případný zisk z prodeje podílů – ten je ale osvobozený po splnění časového testu (držení déle než 3 roky, od roku 2026 bez horního limitu) nebo hodnotového testu (úhrn prodejů cenných papírů do 100 000 Kč ročně). Konkrétní situaci si ověřte v daňovém přehledu."
      },
      {
        "q": "Je akumulační, nebo distribuční ETF pro Čecha lepší?",
        "a": "Pro fázi budování majetku je obvykle jednodušší akumulační – reinvestuje sám, bez tření a bez ročního danění dividend, a naplno využije složené úročení. Distribuční dává smysl, když chcete z portfolia pravidelný příjem (renta, FIRE), byť vyplacené dividendy podléhají 15% dani. Podrobné srovnání obou přístupů najdete v kategorii distribučních ETF a v daňovém přehledu."
      },
      {
        "q": "Odstraní akumulační ETF měnové riziko vůči koruně?",
        "a": "Ne. Akumulace řeší jen nakládání s dividendami, ne měnu. Fondy jako VWCE nebo SWDA drží aktiva v dolarech a výnos přepočtený do korun kolísá s kurzem USD/CZK i EUR/CZK. Ani měnově zajištěná (hedged) akumulační třída vás vůči koruně neochrání – zajištění jde maximálně do EUR nebo USD."
      },
      {
        "q": "Které akumulační ETF je nejlevnější?",
        "a": "Mezi širokými akumulačními fondy patří k nejlevnějším State Street SPDR S&P 500 UCITS ETF Acc (SPYL) s TER 0,03 % a Amundi Core S&P 500 Swap Acc (LU1135865084) či iShares S&P 500 Swap Acc (I500) kolem 0,05 %. U globálních je levný Amundi Core MSCI World Acc (MWRE) s TER 0,12 %. Aktuální pořadí podle nákladovosti najdete v žebříčku na této stránce."
      },
      {
        "q": "Je akumulační zlaté ETC (třeba Amundi Physical Gold C) totéž co akumulační akciové ETF?",
        "a": "Není. Amundi Physical Gold ETC (C) sice v názvu nese kapitalizační třídu, ale jde o ETC krytý fyzickým zlatem, ne o klasický fond-cenný papír jako akciové ETF. Jeho daňový režim se v ČR může lišit a nemusí se na něj vztahovat stejný časový test jako u akciových fondů. Před nákupem si daňové zacházení ověřte v daňovém přehledu a neaplikujte pravidla akciových ETF automaticky."
      }
    ]
  },
  "nejlepsi-bitcoin-etf": {
    "introTitle": "Bitcoin ETF v Evropě neexistuje – co si tedy Čech reálně koupí",
    "intro": [
      "Začněme rovnou tím nejdůležitějším, co většina článků zamlčuje: klasický „Bitcoin ETF\", jaký od roku 2024 znají Američané (spot bitcoin ETF typu iShares Bitcoin Trust), v Evropě koupit nejde. Evropská regulace UCITS totiž fondu zakazuje držet jediné podkladové aktivum bez diverzifikace – a jeden bitcoin diverzifikaci nesplní. Evropský investor si proto nekupuje ETF, ale ETP (Exchange Traded Product), nejčastěji v podobě ETN nebo ETC. Je to burzovně obchodovaný dluhový cenný papír fyzicky krytý reálnými bitcoiny uloženými v regulované custody. Cenově se chová skoro stejně jako spotový bitcoin, ale právně je to něco jiného – a ten rozdíl má pro Čecha praktické dopady v riziku i v daních.",
      "Nabídka je dnes široká a poplatkově velmi levná. Největší produkty na evropských burzách (Xetra, SIX, Euronext) drží řádově miliardu eur: CoinShares Physical Bitcoin (ticker BITC, ISIN GB00BLD4ZL17, TER 0,15 %), WisdomTree Physical Bitcoin (BTCW, GB00BJYDH287, 0,15 %) a iShares Bitcoin ETP od BlackRocku (BTCN, XS2940466316, 0,15 %). Poplatkově nejlevnější jsou 21shares Bitcoin Core (CBTC, CH1199067674) s TER 0,10 %, Invesco Physical Bitcoin (BTIC, XS2376095068) také 0,10 % a Bitwise Core Bitcoin (BTC2, DE000A4AER62) s pouhými 0,05 %. Pro srovnání – americká spot ETF berou 0,15–0,25 %, český investor tu tedy nic nepřeplácí.",
      "Proč vůbec ETP a ne přímý nákup bitcoinu na burze typu Coinbase nebo Kraken? Kvůli jednoduchosti a úschově. ETP koupíte přes běžného brokera (DEGIRO, XTB, Trading 212, Interactive Brokers) stejně jako akcii, drží ho váš standardní obchodní účet, neřešíte privátní klíče ani hardwarovou peněženku a nehrozí, že o vše přijdete zapomenutým seedem. Platíte za to TER a nesete riziko emitenta (viz rizika níže). Tahle stránka je čistě o produktech na samotný bitcoin (a okrajově ether); pokud vás zajímají akcie firem kolem kryptoměn a blockchainu, to je jiná kategorie – k tomu slouží akciové UCITS ETF jako VanEck Crypto and Blockchain Innovators (DAVV, IE00BMDKNW35, TER 0,65 %), které drží těžaře a burzy, ne přímo minci."
    ],
    "verdict": [
      "Pokud chcete čistou, levnou a fyzicky krytou expozici na samotný bitcoin, dávají dnes největší smysl tři jména. Bitwise Core Bitcoin ETP (BTC2, DE000A4AER62) má vůbec nejnižší TER 0,05 % a je fyzicky krytý – u dlouhodobého držení je nákladově těžko porazitelný. 21shares Bitcoin Core (CBTC, CH1199067674) a Invesco Physical Bitcoin (BTIC, XS2376095068) drží TER 0,10 % a stojí za nimi zavedení emitenti s dostatečnou likviditou. Kdo upřednostní co největší fond a jméno správce, sáhne po iShares Bitcoin ETP od BlackRocku (BTCN, XS2940466316) nebo CoinShares Physical Bitcoin (BITC, GB00BLD4ZL17); oba mají TER 0,15 % a patří k největším na trhu, což znamená užší spread při nákupu.",
      "Pozor na starší, drahé produkty. Bitwise Physical Bitcoin ETP (BTCE, DE000A27Z304) byl historicky nejznámější evropský bitcoin produkt, ale nese TER 2,0 % ročně – to je při dlouhém držení obrovský rozdíl oproti verzi Core za 0,05 %. Podobně 21shares Bitcoin ETP (ABTC, CH0454664001) s 1,49 % nebo Virtune Bitcoin ETP s 1,49 % jsou dnes zbytečně drahé, když stejné podkladové aktivum koupíte desetkrát levněji. Jméno „Bitcoin ETP\" samo o sobě nic negarantuje; vždy srovnejte TER a velikost fondu v tabulce níže.",
      "Chcete-li mírně diverzifikovat i mimo samotný bitcoin, existují košové produkty – 21shares Crypto Basket Index ETP (HODL, CH0445689208, TER 0,99 %) drží více největších kryptoměn, nebo 21shares Bitcoin Gold ETP (BOLD, CH1146882308), který kombinuje bitcoin se zlatem. To už je ale spekulativnější a dražší; pro naprostou většinu investorů je rozumnější držet levný čistý bitcoin ETP jako malou satelitní pozici a případnou expozici do zlata řešit samostatně."
    ],
    "forWhom": "Bitcoin ETP se hodí pro investora, který už má postavené jádro portfolia (široký akciový a dluhopisový základ), rozumí tomu, že jde o vysoce volatilní a spekulativní aktivum, a chce mu vyhradit malou satelitní pozici – rozumně v řádu jednotek procent portfolia, o které nepřijde spánek, kdyby spadla o 70 %. Oceníte ho, když nechcete řešit kryptoburzu, privátní klíče ani hardwarovou peněženku a preferujete držení u jednoho brokera s ostatními ETF. Nehodí se pro konzervativní investory, pro každého s krátkým horizontem, pro toho, kdo by po prudkém propadu panicky prodával, ani jako náhrada jádra portfolia. Kdo chce naopak plnou kontrolu nad mincemi a samostatnou úschovu, je lépe obsloužen přímým nákupem na burze než ETP.",
    "risks": [
      "Extrémní volatilita. Bitcoin běžně kolísá o desítky procent za měsíce; propady o 70–80 % od vrcholu se v jeho historii opakovaly. Ročním výnosům nevěřte jako trendu – produkty na této stránce mají za poslední rok podle přepočtu do korun rozpětí zhruba od −40 % po +25 % podle toho, kam do období spadl vrchol a dno cyklu.",
      "Riziko emitenta a protistrany. ETP/ETN je dluhový cenný papír, ne fond s odděleným majetkem jako klasické UCITS ETF. I u fyzicky krytých produktů (kde reálné bitcoiny leží v custody) nesete riziko emitenta a custodiana. Sledujte, zda je produkt fyzicky krytý a kdo drží podklad; nekryté syntetické konstrukce mají riziko vyšší.",
      "Měnové riziko vůči koruně. Bitcoin se kotuje a oceňuje v dolarech, produkty obchodujete v EUR nebo USD. Výnos přepočtený do korun tak nese pohyb USD/CZK vždy – žádný z těchto ETP není a nemůže být zajištěný do koruny. Broker vám navíc při nákupu z korun účtuje měnovou konverzi.",
      "Daňová nejistota. Bitcoin ETP nejsou cenné papíry-fondy jako akciová ETF, takže na ně tříletý časový test ani limit 100 000 Kč/rok nemusí dopadat stejně jako na klasické ETF. Pravidla pro zdanění krypto ETP nejsou tak ustálená a mohou se lišit podle typu produktu (ETC vs. ETN) i výkladu. Před prodejem konzultujte aktuální stav a náš daňový hub, nespoléhejte na analogii s akciovými ETF."
    ],
    "faqs": [
      {
        "q": "Existuje v Evropě opravdový spot Bitcoin ETF jako v USA?",
        "a": "Ne. Americké spot bitcoin ETF (např. iShares Bitcoin Trust) v Evropě nekoupíte a evropská regulace UCITS ani neumožňuje vytvořit ETF na jediné aktivum bez diverzifikace. Evropský investor kupuje fyzicky krytý ETP (ETN/ETC), který se cenově chová jako bitcoin, ale právně je to burzovně obchodovaný dluhový cenný papír, ne fond."
      },
      {
        "q": "Který bitcoin ETP je nejlevnější?",
        "a": "Aktuálně má nejnižší TER Bitwise Core Bitcoin ETP (ticker BTC2, ISIN DE000A4AER62) s pouhými 0,05 % ročně. Následují 21shares Bitcoin Core (CBTC, CH1199067674) a Invesco Physical Bitcoin (BTIC, XS2376095068) s TER 0,10 %. Pozor na starší produkty jako Bitwise Physical Bitcoin (BTCE) s TER 2,0 % nebo 21shares Bitcoin ETP (ABTC) s 1,49 % – za stejný podklad zbytečně přeplatíte."
      },
      {
        "q": "Jaký je rozdíl mezi ETF a ETP/ETN u bitcoinu?",
        "a": "Klasické ETF je fond s odděleným majetkem investorů. ETP (a jeho podoby ETN a ETC) je burzovně obchodovaný dluhový cenný papír vydaný emitentem, obvykle fyzicky krytý reálným aktivem v custody. Rozdíl je hlavně v právní struktuře a rizikovém profilu: u ETP nesete riziko emitenta a custodiana, byť u fyzicky krytých produktů leží skutečné bitcoiny v úschově."
      },
      {
        "q": "Jak se v ČR daní zisk z bitcoin ETP?",
        "a": "Opatrně – bitcoin ETP nejsou cenné papíry-fondy jako akciová ETF, takže tříletý časový test ani hodnotový limit 100 000 Kč/rok se na ně nemusí vztahovat stejně a výklad se může lišit podle typu produktu. Nespoléhejte na analogii s akciovými ETF; před prodejem si ověřte aktuální pravidla a projděte náš daňový hub, případně konzultujte daňového poradce."
      },
      {
        "q": "Mám raději koupit bitcoin ETP, nebo bitcoin přímo na burze?",
        "a": "ETP je jednodušší a bezpečnější na úschovu – držíte ho u běžného brokera vedle ostatních ETF, neřešíte privátní klíče ani hardwarovou peněženku a platíte za to jen TER. Přímý nákup na kryptoburze (Coinbase, Kraken) vám dá plnou kontrolu nad mincemi a možnost vlastní custody, ale nesete odpovědnost za bezpečnost klíčů. Pro pasivního investora, který nechce spravovat peněženku, bývá ETP pohodlnější volba."
      },
      {
        "q": "Nese bitcoin ETP měnové riziko vůči koruně?",
        "a": "Ano, vždy. Bitcoin se oceňuje v dolarech a ETP obchodujete v EUR nebo USD, takže výnos přepočtený do korun ovlivňuje i pohyb kurzu USD/CZK. Žádný z těchto produktů není zajištěný do koruny (měnové zajištění u ETP obecně chybí) a broker vám navíc při nákupu z korun účtuje měnovou konverzi. To je náklad a riziko navíc k volatilitě samotného bitcoinu."
      }
    ]
  },
  "nejlepsi-distribucni-etf": {
    "introTitle": "Distribuční ETF: fondy, které vám dividendy posílají na účet",
    "intro": [
      "Distribuční ETF je ta samá věc jako kterýkoli jiný burzovně obchodovaný fond – jen s jedním rozdílem v „třídě\": dividendy, které firmy nebo dluhopisy v portfoliu vyplatí, fond nechává protéct k vám a několikrát ročně je pošle jako hotovost na váš brokerský účet. Nejde tedy o samostatný typ indexu ani o dividendovou strategii, ale o způsob, jak s výnosem naložit. Naprostá většina velkých indexů (S&P 500, FTSE All-World, MSCI World, evropské akcie i dluhopisy) existuje ve dvou verzích: distribuční (Dist / Distributing) a akumulační (Acc). Poznáte je podle přípony v názvu a podle jiného ISINu, i když sledují úplně stejný podklad.",
      "Pozor na časté zmatení: distribuční ETF není totéž co „dividendové ETF\". Dividendové fondy jako Vanguard FTSE All-World High Dividend Yield (VHYL) cíleně vybírají firmy s vysokým výnosem – to je investiční strategie a řešíme ji zvlášť na stránce dividendových ETF. Naproti tomu distribuční verze běžného světového indexu drží stejné firmy jako akumulační, jen vám hotovost posílá ven místo aby ji reinvestovala uvnitř. Tahle stránka je o třídě výplaty, ne o výběru firem.",
      "Pro českého investora, který utrácí koruny, má distribuční verze jedno velké „ale\": vyplacené dividendy se v Česku daní 15 %, a to bez ohledu na to, jak dlouho fond držíte. Časový test (osvobození po třech letech) se totiž vztahuje na zisk z prodeje podílů, ne na průběžně vyplácené dividendy. Právě tady se distribuční třída rozchází s akumulační, kde reinvestice probíhá uvnitř fondu a v přiznání ji neřešíte vůbec. Protože fondy kotují v USD, EUR nebo GBP, každá výplata k vám navíc přichází v cizí měně a nesete kurzové riziko vůči koruně – i samotná dividenda se do korun teprve přepočítává."
    ],
    "verdict": [
      "Pokud jde o čistě široké jádro portfolia s výplatou, sáhněte po zavedených distribučních verzích velkých indexů. Nejlikvidnější volbou na celý svět je Vanguard FTSE All-World UCITS ETF (USD) Distributing (ISIN IE00B3RBWM25, ticker VWRL, TER 0,19 %, jmění přes 22 mld. EUR) – jeden fond, přes 3 600 firem z rozvinutých i rozvíjejících se trhů a čtvrtletní výplata. Kdo chce jen USA, má levné a obří VUSA (Vanguard S&P 500 Dist, IE00B3XXRP09, TER 0,07 %, přes 45 mld. EUR) nebo prakticky identické iShares Core S&P 500 (Dist) IUSA (IE0031442068, TER 0,07 %). Evropu pokryje iShares Core MSCI Europe (Dist) IMEU (IE00B1YZSC51, TER 0,12 %). Tyhle fondy nevybírají „vysokodividendové\" firmy, jen vyplácejí to, co běžný trh přirozeně přinese – dividendový výnos u nich bývá zhruba 1,5–2,5 % ročně.",
      "Chcete-li z výplat postavit stabilnější příjem, přidejte dluhopisovou nohu, kde jsou kupóny hlavním smyslem: iShares Core EUR Corporate Bond UCITS ETF (Dist) (IE00B3F81R35, TER 0,09 %) pro podnikové dluhopisy nebo iShares Core Euro Government Bond UCITS ETF (Dist) (IE00B4WXJJ64, TER 0,07 %) pro státní. Dluhopisové ETF vyplácejí častěji a rovnoměrněji než akciové, ovšem jejich kurz kolísá s úrokovými sazbami – v roce 2026 to není zanedbatelné (roční výnosy v Kč se u nich pohybovaly kolem nuly, protože pohyb sazeb ukrojil z kupónů).",
      "Rovnou dodejme protipól: pro dlouhodobé budování majetku, kde příjem teď nepotřebujete, je většinou lepší akumulační verze téhož fondu – ušetří vám 15% daň z každé dividendy a zapne složené úročení uvnitř fondu. Distribuční třída dává smysl hlavně tehdy, když peníze reálně chcete vidět na účtu (fáze renty / FIRE, doplněk příjmu). Srovnání obou přístupů řešíme na stránce akumulačních ETF a v daňovém rozcestníku."
    ],
    "forWhom": "Distribuční ETF se hodí investorům, kteří chtějí z portfolia reálný peněžní tok: lidé v penzijní nebo FIRE fázi žijící z majetku, ti kdo si přivydělávají pravidelnou rentou, nebo prostě každý, komu psychologicky pomáhá vidět hotovost přicházet na účet. Naopak se nehodí pro mladší investory ve fázi budování majetku – ti platí 15% daň z každé dividendy zbytečně a přicházejí o efekt reinvestice; pro ně je lepší akumulační třída stejného indexu. Nevýhodná je distribuční verze i pro každého, kdo dividendy stejně obratem ručně reinvestuje – daní je a znovu platí poplatek za nákup.",
    "risks": [
      "Zdanění dividend 15 % každý rok. Vyplacené dividendy z distribučních tříd se v Česku daní vždy a časový test je neosvobozuje – ten platí jen pro zisk z prodeje podílů. U akumulačního fondu tuhle starost nemáte. U zahraničních fondů navíc někdy řešíte srážkovou daň v domicilu a zápočet v přiznání.",
      "Měnové riziko i u samotné výplaty. Fondy jako VWRL nebo VUSA kotují a vyplácejí v USD, evropské a dluhopisové v EUR či GBP. Každá dividenda k vám přijde v cizí měně a přepočítává se do korun; broker si k tomu účtuje měnovou konverzi. I „hedged\" třídy zajišťují maximálně do EUR/USD, korunové riziko za vás nikdo neodstraní.",
      "Nižší dlouhodobé zhodnocení než u akumulace. Tím, že fond hotovost posílá ven místo aby ji reinvestoval, a vy z ní ještě odvedete daň, roste distribuční verze na dlouhém horizontu pomaleji než akumulační dvojče se stejným podkladem. Rozdíl je o to větší, čím delší je horizont.",
      "U dluhopisových distribučních ETF úrokové riziko. Fondy jako iShares Core EUR Corporate Bond (Dist) nebo Euro Government Bond (Dist) vyplácejí stabilní kupóny, ale jejich kurz klesá při růstu sazeb – v roce 2026 se roční výnosy v korunách u některých držely kolem nuly či v mírném mínusu. Pravidelná výplata neznamená, že hodnota jistiny neklesá."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi distribučním a dividendovým ETF?",
        "a": "Distribuční ETF je způsob výplaty – fond vám posílá dividendy na účet místo aby je reinvestoval. Dividendové ETF je naopak strategie výběru firem s vysokým výnosem (např. Vanguard FTSE All-World High Dividend Yield, VHYL). Distribuční verze běžného světového indexu drží ty samé firmy jako akumulační, jen s výplatou navenek. Dividendovým strategiím se věnujeme na samostatné stránce."
      },
      {
        "q": "Které distribuční ETF jsou pro Čecha nejrozumnější jádro?",
        "a": "Na celý svět Vanguard FTSE All-World UCITS ETF (USD) Distributing (VWRL, IE00B3RBWM25, TER 0,19 %) s více než 3 600 firmami a čtvrtletní výplatou. Jen na USA levné VUSA (Vanguard S&P 500 Dist, IE00B3XXRP09, TER 0,07 %) nebo iShares Core S&P 500 (Dist) IUSA (IE0031442068). Pro stabilnější výplatu se přidává dluhopisová noha, třeba iShares Core EUR Corporate Bond (Dist) (IE00B3F81R35)."
      },
      {
        "q": "Jak se v Česku daní dividendy z distribučního ETF?",
        "a": "Vyplacené dividendy se daní sazbou 15 %, a to každý rok bez ohledu na to, jak dlouho fond držíte – tříletý časový test se na dividendy nevztahuje, jen na zisk z prodeje podílů. U zahraničních fondů může být část daně sražena už v domicilu; podrobnosti a příklady najdete v daňovém rozcestníku. Konkrétní situaci raději ověřte s daňovým poradcem."
      },
      {
        "q": "Je lepší distribuční, nebo akumulační verze?",
        "a": "Pro fázi budování majetku bývá lepší akumulační – reinvestuje dividendy uvnitř fondu, ušetří vám 15% daň z každé výplaty a zapne složené úročení. Distribuční dává smysl, když příjem reálně chcete čerpat (renta, FIRE, doplněk příjmu). Přímé srovnání obou tříd řešíme na stránce akumulačních ETF."
      },
      {
        "q": "Jak často distribuční ETF vyplácejí dividendy?",
        "a": "Nejčastěji čtvrtletně (VWRL, VUSA i IUSA vyplácejí zpravidla 4× ročně), některé pololetně nebo ročně. Dluhopisové fondy jako iShares Core Euro Government Bond (Dist) vyplácejí obvykle rovnoměrněji. Přesnou frekvenci a historii výplat najdete na detailu konkrétního fondu."
      },
      {
        "q": "Přijdou mi dividendy v korunách?",
        "a": "Ne. Fondy kotují a vyplácejí v měně třídy – VWRL a VUSA v USD, evropské a dluhopisové většinou v EUR nebo GBP. Dividenda k vám přijde v cizí měně a teprve se přepočítává do korun, přičemž broker si účtuje měnovou konverzi. Korunové riziko nesete i u samotných výplat, žádné ETF ho nezajistí."
      }
    ]
  },
  "nejlepsi-globalni-etf": {
    "introTitle": "Jeden fond na celý svět: co znamená „globální ETF“ a proč je to nejčastější první krok",
    "intro": [
      "Globální (celosvětové) akciové ETF je fond, který jedním nákupem koupí akcie z celého vyspělého a zpravidla i rozvíjejícího se světa. Není to sázka na jeden region ani sektor, ale co nejširší záběr trhu v jediném řádku portfolia. Právě proto je „nejlepší globální ETF“ nejčastější první dotaz českého začátečníka: hledá jeden fond, který koupí měsíčně, nechá běžet a nemusí ho každý rok přeskládávat.",
      "Klíčové je rozlišit dvě skupiny, protože se pod jménem „globální“ míchají. První je typu all-world (celý svět) – indexy FTSE All-World a MSCI ACWI, které drží zhruba 3 600 až 3 700 firem z vyspělých i rozvíjejících se trhů (USA, Evropa, Japonsko, ale i Čína, Indie, Tchaj-wan). Druhá je jen vyspělý svět (developed) – index MSCI World s asi 1 400 firmami, který rozvíjející se trhy vynechává úplně. Rozdíl v počtu firem tedy není mezi 500 a 3 600 (to je S&P 500 vs. all-world), ale hlavně v tom, zda máte v portfoliu i emerging markets, nebo ne. Ty dnes tvoří zhruba 10 % all-world indexu.",
      "Pro Čecha je podstatné, že drtivá většina relevantních fondů je v UCITS obalu s irským domicilem (ISIN začíná IE). To řeší srážkovou daň z amerických dividend uvnitř fondu na 15 % místo 30 % a odpadá formulář W-8BEN i riziko americké dědické daně. Fondy běžně koupíte u DEGIRO, XTB, Trading 212 nebo Interactive Brokers, často i frakčně za pár set korun.",
      "Tato stránka řeší úhel „jeden fond na celý svět“. Pokud vás zajímá čistě developed varianta MSCI World, nebo srovnání celého vesmíru celosvětových řešení včetně kombinací World + emerging, projděte i naše kategorie nejlepší MSCI World ETF a nejlepší celosvětové ETF, kam z této stránky prolinkujeme."
    ],
    "verdict": [
      "Pro naprostou většinu českých investorů, kteří chtějí jeden fond na celý svět, je nejjednodušší volbou all-world řešení v akumulační třídě s irským domicilem. Etalonem je Vanguard FTSE All-World UCITS ETF Acc (ticker VWCE, ISIN IE00BK5BQT80), zdaleka největší all-world fond na evropském trhu se jměním přes 43 mld. EUR a TER 0,22 % ročně. Drží kolem 3 600 firem z vyspělých i rozvíjejících se trhů a reinvestuje dividendy uvnitř fondu, takže o nich nic neřešíte v přiznání. Kdo chce pravidelnou výplatu, sáhne po sesterské distribuční verzi VWRL (IE00B3RBWM25).",
      "Levnější alternativou se stejným záběrem (vyspělý svět plus emerging) je Amundi Prime All Country World Acc (WEBG, IE0009HF1MK9) s TER jen 0,07 %, respektive SPDR MSCI ACWI IMI Acc (SPYY, IE00B44Z5B48) s TER 0,12 %. Zavedenou klasikou na indexu MSCI ACWI je iShares MSCI ACWI Acc (SSAC, IE00B6R52259, TER 0,20 %, přes 29 mld. EUR) – dražší než Amundi, ale s dlouhou historií a vysokou likviditou. U menších, ale plnohodnotných fondů (WEBG, Invesco FWIA) sledujte spíš rozpětí nákup/prodej u vašeho brokera, kde se pár setin TER v úspoře snadno ztratí.",
      "Pokud vám nevadí vynechat rozvíjející se trhy a chcete jen vyspělý svět, je referencí největší evropský akciový ETF vůbec: iShares Core MSCI World Acc (SWDA, IE00B4L5Y983, TER 0,20 %, přes 123 mld. EUR). Rozdíl proti all-world je hlavně chybějící Čína, Indie a další EM – historicky to výnos spíš mírně nadlepšovalo, do budoucna to ale nikdo nezaručí. Zjednodušeně: chcete-li opravdu celý svět jedním klikem, berte VWCE nebo WEBG; chcete-li nejlevnější a nejlikvidnější „skoro všechno“ bez EM, berte SWDA."
    ],
    "forWhom": "Globální ETF se hodí pro každého, kdo chce jeden fond, který nemusí řešit – pravidelně kupovat, držet roky až desítky let a nepřeskládávat. Je to ideální jádro (klidně 100 %) portfolia začátečníka i zkušeného pasivního investora, který nechce sázet na konkrétní region. Méně se hodí pro toho, kdo chce vědomě zvýraznit USA (tomu lépe poslouží S&P 500 nebo americké ETF), pro fanouška rozvíjejících se trhů, který by chtěl výrazně vyšší podíl EM než přirozených ~10 %, a pro konzervativního investora s krátkým horizontem – i celý svět umí v krizi klesnout o 30 až 50 % a plně nesete kurzové riziko dolaru vůči koruně.",
    "risks": [
      "Skrytá koncentrace do USA a technologických gigantů. „Celý svět“ zní jako maximální rozložení, ale USA dnes tvoří kolem 60–65 % all-world indexu a firmy jako Apple, Microsoft a Nvidia patří mezi největší pozice. Reálná diverzifikace je tedy nižší, než by počet 3 600 firem napovídal – při propadu amerického tech sektoru klesá i globální fond.",
      "Měnové riziko vůči koruně nesete vždy. Fondy jsou denominované v USD a podkladově drží hlavně dolarová aktiva. Posílení koruny vám sníží výnos přepočtený do korun, i když index roste. Měnově zajištěné (hedged) verze míří jen do EUR/USD, ne do CZK, a navíc zvyšují náklady – korunové riziko vám neodstraní.",
      "Čistě akciové riziko a délka propadů. Globální akciový fond nemá dluhopisový polštář. Historicky přicházely poklesy o 30 až 55 % a návrat na předchozí vrchol mohl trvat i několik let. To musíte psychicky i finančně ustát bez panického prodeje.",
      "Rozdíly mezi „globálními“ fondy nejsou kosmetické. World (bez EM) versus all-world (s EM), fyzická versus swapová replikace, akumulace versus distribuce – to všechno mění chování i daňové dopady. Nekupujte podle jména „World/Global“ naslepo; ověřte si, co index skutečně obsahuje a jak je fond konstruován."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi globálním ETF na MSCI World a na FTSE All-World / MSCI ACWI?",
        "a": "MSCI World drží jen vyspělé trhy – asi 1 400 firem, bez Číny, Indie a dalších rozvíjejících se zemí. FTSE All-World a MSCI ACWI přidávají i rozvíjející se trhy, takže mají kolem 3 600 firem a rozvíjející se trhy v nich tvoří zhruba 10 %. Chcete-li opravdu celý svět, sáhněte po all-world (VWCE, WEBG, SSAC). Chcete-li nejlevnější a nejlikvidnější „skoro všechno“ bez emerging, stačí MSCI World (SWDA)."
      },
      {
        "q": "Který globální ETF je největší a který nejlevnější?",
        "a": "Největší all-world fond je Vanguard FTSE All-World Acc (VWCE, IE00BK5BQT80) s jměním přes 43 mld. EUR a TER 0,22 %. Nejlevnější all-world je Amundi Prime All Country World (WEBG, IE0009HF1MK9) s TER jen 0,07 %. Ještě větší, ale bez emerging trhů, je iShares Core MSCI World (SWDA, IE00B4L5Y983, přes 123 mld. EUR, TER 0,20 %). Aktuální pořadí podle velikosti i nákladů najdete v žebříčcích na této stránce."
      },
      {
        "q": "Stačí jako celé portfolio jediné globální ETF?",
        "a": "Pro drtivou většinu dlouhodobých investorů ano. Jeden all-world fond jako VWCE nebo WEBG pokryje tisíce firem napříč regiony a sektory a odpadá potřeba cokoli přeskládávat. Přidávat další ETF má smysl, jen když chcete vědomě něco zvýraznit (víc USA, víc emerging, malé firmy). Pozor ale, že „celý svět“ je pořád ze  100 % v akciích – kdo potřebuje nižší kolísání, kombinuje ho s dluhopisy nebo hotovostí."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční globální ETF?",
        "a": "Pro dlouhodobé budování majetku je praktičtější akumulační třída (VWCE, SSAC, WEBG Acc): dividendy reinvestuje sám fond, nemusíte je danit ani ručně reinvestovat a naplno běží složené úročení. Distribuční verzi (VWRL) volte, pokud cíleně chcete pravidelnou výplatu – typicky v rentiérské fázi. U distribučních tříd počítejte s 15% daní z vyplacených dividend. Podrobně to rozebíráme v kategoriích akumulační vs. distribuční ETF a v daňovém hubu."
      },
      {
        "q": "Jak se globální ETF daní v Česku v roce 2026?",
        "a": "Klasické akciové ETF jsou cenné papíry, takže platí časový a hodnotový test. Držíte-li fond déle než 3 roky, je zisk z prodeje osvobozen – od roku 2026 už bez horního limitu. Alternativně je osvobozen, pokud úhrn vašich prodejů cenných papírů nepřesáhne 100 000 Kč za rok. U akumulačních fondů se reinvestované dividendy uvnitř fondu neřeší; u distribučních se vyplacené dividendy daní 15 %. Nejde o individuální daňovou radu – detaily a příklady najdete v našem daňovém hubu."
      },
      {
        "q": "Proč mají globální ETF s americkými akciemi domicil v Irsku?",
        "a": "Irské UCITS fondy mají s USA daňovou smlouvu, díky které se z amerických dividend uvnitř fondu strhává 15 % místo 30 %. U all-world i World ETF, kde USA tvoří 60 a více procent, to reálně zvedá čistý výnos. Irský domicil (ISIN začíná IE) navíc řeší, že nemusíte podávat americký formulář W-8BEN, a odpadá riziko americké dědické daně, které hrozí u přímo držených fondů domicilovaných v USA."
      }
    ]
  },
  "nejlepsi-high-yield-etf": {
    "introTitle": "High yield ETF: vyšší kupón výměnou za kreditní riziko, ne za bezpečí",
    "intro": [
      "Nejdřív si ujasněme pojem, protože „high yield“ v češtině svádí ke zmatku. Tato kategorie NENÍ o vysokodividendových akciích (na ty míří samostatná kategorie dividendových ETF). High yield ETF drží dluhopisy firem s ratingem POD investičním stupněm, tedy BB, B, CCC a níže, kterým se lidově říká „junk bonds“ neboli podřadné dluhopisy. Jsou to půjčky firmám, u nichž trh vidí vyšší pravděpodobnost, že peníze nesplatí, a proto za to chtějí investoři vyšší úrok. High yield fond tedy nabízí vyšší běžný výnos (yield to maturity) než státní nebo investment-grade korporátní dluhopisy, ale ten navíc není odměnou za trpělivost, nýbrž za převzaté kreditní riziko.",
      "Fond nakupuje do jednoho koše stovky takových dluhopisů napříč emitenty a odvětvími, aby individuální bankrot jedné firmy portfolio nepoložil. Na evropském trhu (UCITS) dominují dva světy: eurové HY (dluhopisy evropských firem znějící na euro) a dolarové HY (americké firmy, USD). Největším eurovým fondem je iShares EUR High Yield Corporate Bond (ticker EUNW, ISIN IE00B66F4759, TER 0,50 %) s objemem přes 5 miliard EUR, levnější alternativou je Xtrackers EUR High Yield Corporate Bond (XHYA, LU1109943388, TER pouhých 0,20 %). Na dolarové straně stojí iShares USD High Yield Corporate Bond (distribuční IS0R, IE00B4PY7Y77; akumulační IS00, IE00BYXYYL56; TER 0,50 %) a cenově agresivní iShares Broad USD High Yield (UDHY, IE00BG0J4957, TER 0,20 %).",
      "Proč to Čecha zajímá? V prostředí roku 2026, kdy sazby zůstávají relativně vysoko, nabízí high yield lákavý výnos do splatnosti klidně kolem 6–7 % u dolarových fondů. To ale není spořicí účet s prémií. High yield se chová napůl jako dluhopis a napůl jako akcie: v dobrých časech vydělává na kupónech i zúžení kreditních spreadů, ale při recesi nebo panice na trzích padá spolu s akciemi, protože investoři se bojí vln bankrotů. Není to tedy stabilizátor portfolia jako státní dluhopisy, nýbrž samostatná, výnosově i rizikově agresivnější třída aktiv."
    ],
    "verdict": [
      "Pokud chcete high yield do portfolia zařadit vědomě a s rozvahou, nejde ani tak o „nejlepší fond“, jako o volbu měny a durace. Pro eurového investora je nejpřímočařejší velký a likvidní iShares EUR High Yield Corporate Bond (EUNW, IE00B66F4759) v distribuční verzi, nebo jeho akumulační sourozenec SXRI (IE00BF3N7094). Kdo hlídá náklady, sáhne po Xtrackers EUR High Yield (XHYA/XHYG, LU1109943388/LU1109942653) s TER jen 0,20 %, tedy o 30 bazických bodů levněji než iShares. Na dolarové straně dává u širokého trhu smysl nejlevnější iShares Broad USD High Yield (UDHY, IE00BG0J4957, TER 0,20 %), zatímco tradiční iShares USD High Yield (IS0R / IS00, TER 0,50 %) je největší a nejlikvidnější, ale dražší.",
      "Kdo chce vyšší kupón, ale bojí se úrokového rizika a hlubokých propadů, měl by se podívat na verze s krátkou durací: iShares USD Short Duration High Yield (IS3K, IE00BCRY6003; akumulační OM3J, IE00BZ17CN18, TER 0,45 %) drží dluhopisy blízko splatnosti, takže mnohem méně reaguje na pohyby sazeb. Konzervativnější podkategorií jsou pak takzvaní „fallen angels“, tedy dluhopisy firem, které nedávno spadly z investičního stupně do junk pásma a bývají v průměru kvalitnější než rodilý high yield. Tuto strategii nabízí iShares Fallen Angels High Yield Corporate Bond (IE00BYM31M36 dist / IE00BDFJYP58 acc, TER 0,50 %).",
      "Pro Čecha je klíčové rozhodnutí o měně. Dolarový HY láká výnosem kolem 6–7 %, ale nese plné USD/CZK riziko. Pokud chcete kreditní expozici bez amerického dolaru, existují eurově zajištěné verze amerického HY, například iShares USD High Yield EUR Hedged (IBC2, IE00BF3N7102, TER 0,55 %). Pozor ale: hedge do EUR odstíní pohyb dolaru vůči euru, nikoli euru vůči koruně, takže Čech měnové riziko úplně neodstraní, jen ho přesune z páru USD/CZK na EUR/CZK. Ať zvolíte cokoli, high yield by měl být jen malým, vědomě dávkovaným kořením portfolia, ne jeho dluhopisovou páteří."
    ],
    "forWhom": "Hodí se investorům, kteří už mají vybudované jádro (globální akcie plus kvalitní state/investment-grade dluhopisy) a vědomě chtějí přidat malou, výnosově agresivnější složku za vyšší kupón, případně těm, kdo v rentierské fázi hledají vyšší běžný příjem a jsou smíření s tím, že cena fondu může výrazně kolísat. Nehodí se začátečníkům jako první dluhopisová investice ani konzervativním investorům, kteří od dluhopisů čekají klid a protiváhu k akciím, protože high yield padá právě tehdy, kdy padají akcie. Rozhodně to není náhrada spořicího účtu ani krátkodobé rezervy, i když vyšší výnosové číslo tak může na první pohled vypadat.",
    "risks": [
      "Kreditní a default riziko: emitenti v pásmu BB až CCC bankrotují mnohem častěji než firmy investičního stupně. Fond riziko rozkládá napříč stovkami dluhopisů, ale v recesi roste míra defaultů plošně a hodnota fondu klesá. Právě za tohle riziko dostáváte ten vyšší kupón, není to výnos zadarmo.",
      "Korelace s akciemi místo protiváhy: high yield se v krizích chová jako riziková aktiva. V roce 2008 i během covidového propadu 2020 padal současně s akciovým trhem, takže neplní funkci stabilizátoru, kterou od klasických státních dluhopisů čekáte. Kdo ho drží jako „bezpečnou“ složku, se přepočítá.",
      "Měnové riziko vůči koruně: dolarové HY fondy (UDHY, IS0R) nesou plné USD/CZK riziko, které při posílení koruny snadno smaže i tučný kupón. Eurově zajištěné verze (IBC2) odstíní pohyb USD vůči EUR, ale ne EUR vůči CZK, takže Čech kurzové riziko nikdy neodstraní zcela.",
      "Likviditní a úrokové riziko: trh podřadných dluhopisů v panice rychle vysychá a spready se rozšiřují, což prohlubuje propad ceny. Dlouhá durace navíc přidává citlivost na sazby, proto verze s krátkou durací (IS3K) v turbulencích kolísají méně."
    ],
    "faqs": [
      {
        "q": "Je high yield ETF totéž co dividendové ETF?",
        "a": "Ne, a je to častá záměna kvůli slovu „yield“. High yield ETF drží podřadné (junk) firemní DLUHOPISY s ratingem pod investičním stupněm a jejich výnos plyne z kupónů. Dividendové ETF drží AKCIE firem, které vyplácejí vysoké dividendy. Jde o dvě úplně jiné třídy aktiv s jiným rizikem: u high yield řešíte kreditní a default riziko dlužníků, u dividendových akcií kolísání akciového trhu. Pokud hledáte akciovou výplatu, patříte do kategorie dividendových ETF."
      },
      {
        "q": "Kolik high yield ETF vynáší a je to bezpečné?",
        "a": "Dolarové HY fondy (např. iShares USD High Yield IS0R) nabízejí výnos do splatnosti řádově kolem 6–7 %, eurové (EUNW, XHYA) méně, zhruba 4–5 %, podle prostředí sazeb. Vyšší číslo ale odráží vyšší riziko, ne lepší kvalitu. V recesi rostou bankroty a fond může ztratit dvouciferná procenta, jako v roce 2008. Není to bezpečné uložení peněz, je to riziková investice s dluhopisovým kabátem."
      },
      {
        "q": "Musím zisk z high yield ETF v ČR danit?",
        "a": "U high yield ETF jde o klasické dluhopisové fondy (cenné papíry), takže platí stejná pravidla jako u jiných ETF. Časový test: pokud podíl držíte déle než 3 roky, je zisk z prodeje osvobozen (od roku 2026 bez horního limitu). Hodnotový test: pokud úhrn vašich prodejů cenných papírů za rok nepřesáhne 100 000 Kč, je zisk osvobozen i bez splnění časového testu. U distribučních verzí (EUNW, IS0R) se ovšem vyplacené kupóny daní srážkou 15 % vždy. Detaily řeší náš daňový hub, pravidla si vždy ověřte."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční verzi?",
        "a": "Akumulační verze (např. SXRI IE00BF3N7094 nebo IS00 IE00BYXYYL56) reinvestuje kupóny automaticky uvnitř fondu, takže v přiznání neřešíte pravidelné výplaty a využijete složené úročení, ideální ve fázi budování majetku. Distribuční verze (EUNW, IS0R) vyplácí kupóny na účet, což ocení rentier hledající příjem, ale vyplacené kupóny podléhají 15% dani. U high yield s vysokým kupónem je tento daňový rozdíl citelnější než u nízkovýnosových dluhopisů."
      },
      {
        "q": "Mám volit eurový, nebo dolarový high yield fond?",
        "a": "Dolarový HY (UDHY, IS0R) má vyšší výnos, ale nese plné USD/CZK riziko: posílení koruny vůči dolaru může kupón snadno smazat. Eurový HY (EUNW, XHYA) má nižší výnos a riziko EUR/CZK, které bývá klidnější. Existují i verze amerického HY zajištěné do eura (IBC2 IE00BF3N7102), ty ale zajišťují jen pár USD/EUR, nikoli vůči koruně, takže jako Čech kurzové riziko nikdy neodstraníte úplně, jen ho přesunete."
      },
      {
        "q": "Čím se high yield liší od běžných korporátních dluhopisů?",
        "a": "Je to otázka ratingu. Kategorie korporátních dluhopisů investičního stupně drží dluhopisy kvalitních firem (rating BBB a výše) s nízkým rizikem bankrotu a nižším výnosem. High yield jde o stupeň níž (BB a hůře), kde je vyšší kupón vykoupen výrazně vyšším rizikem defaultu. Mezistupněm jsou „fallen angels“ (iShares Fallen Angels, IE00BYM31M36), tedy dluhopisy firem čerstvě vyřazených z investičního stupně, které bývají v průměru kvalitnější než rodilý junk."
      }
    ]
  },
  "nejlepsi-indicke-etf": {
    "introTitle": "Indické ETF: jak Čech koupí nejrychleji rostoucí velkou ekonomiku světa",
    "intro": [
      "Indie je dnes nejlidnatější země světa a několik let po sobě jedna z nejrychleji rostoucích velkých ekonomik. Pro drobného investora je ale prakticky nemožné nakupovat jednotlivé indické akcie napřímo – domácí burzy (NSE a BSE) jsou pro zahraniční retail obtížně dostupné a plné regulatorních překážek. Řešením je evropský UCITS ETF, který indický trh zabalí do jednoho fondu obchodovaného na Xetře nebo Euronextu. V praxi vybíráte mezi dvěma indexovými rodinami: MSCI India (zhruba 130 největších firem, kolem 85 % trhu) a Nifty 50 (padesát blue chipů z burzy NSE). Sensex ani širší indexy v evropském UCITS obalu prakticky nenajdete.",
      "Zásadní specifikum Indie je, jak se k jejím akciím vůbec dá dostat. Kvůli indickým daňovým a regulatorním pravidlům řada fondů nedrží akcie fyzicky, ale replikuje index synteticky přes swap – to je u ostatních regionů dnes spíš výjimka, u Indie je to běžné. Fyzickou replikaci nabízí hlavně iShares MSCI India (ticker QDV5) a Franklin FTSE India (FLXI); velká část fondů Amundi a Xtrackers jsou naopak swapy. Není to samo o sobě chyba, ale mění to profil rizika (viz níže).",
      "Pro českého investora je Indie čistá sázka na jeden rozvíjející se trh. Nejde o náhradu globálního ani širšího EM portfolia – v běžném ETF na rozvíjející se trhy (MSCI Emerging Markets) už Indii z velké části máte, dnes tvoří jednu z největších vah indexu hned vedle Číny a Tchaj-wanu. Samostatné indické ETF má smysl jen jako vědomá nadváha: sázíte na to, že Indie poroste rychleji než zbytek EM. Pokud chcete širší expozici, projděte si nejdřív kategorie ETF na rozvíjející se trhy a ETF na Čínu, ať víte, co už držíte.",
      "Poslední rok byl přitom pro indické akcie slabý – většina fondů je v korunovém přepočtu za posledních 12 měsíců v mínusu (řádově -9 až -14 %), protože po silných letech přišla korekce a k tomu oslabení rupie. To je dobrá připomínka, že vstupní bod a měna hrají u jednoho rozvíjejícího se trhu velkou roli a že historicky vysoké výnosy Indie nejsou zaručené do budoucna."
    ],
    "verdict": [
      "Pro většinu českých investorů je nejrozumnější volbou akumulační, fyzicky replikovaný fond s irským domicilem. Tomu nejlépe odpovídá iShares MSCI India UCITS ETF USD Acc (ISIN IE00BZCQB185, ticker QDV5) – s majetkem přes 4,5 miliardy EUR je zdaleka největší a nejlikvidnější indický ETF na evropském trhu, drží akcie fyzicky a je akumulační, takže dividendy reinvestuje sám. Nevýhodou je vyšší TER 0,65 % ročně; za největší a fyzický fond na dražším trhu si ale připlácíte. Levnější fyzickou alternativou je Franklin FTSE India UCITS ETF (IE00BHZRQZ17, FLXI) s TER pouhých 0,19 % a jměním přes 1,7 miliardy EUR – sleduje index FTSE India, ne MSCI, ale ve výsledku pokrývá velmi podobný koš velkých indických firem za třetinový poplatek.",
      "Kdo hledá nejnižší náklady a nevadí mu syntetická replikace, může sáhnout po UBS MSCI India SF UCITS ETF USD Acc (IE000N70F6V6, ticker INDA) s TER 0,15 %, nebo po Xtrackers MSCI India Swap UCITS ETF 1C (LU0514695187, XCS5) s TER 0,19 %. Oba používají swap, tedy nedrží indické akcie napřímo, ale výkonnost indexu dodává protistrana. To přináší malé riziko protistrany výměnou za nižší náklady a hladší sledování indexu na trhu, kde je fyzická replikace drahá.",
      "Pokud chcete cíleně index Nifty 50 (padesát největších firem NSE) místo širšího MSCI India, je na evropském trhu prakticky jediná volba: Xtrackers Nifty 50 Swap UCITS ETF 1C (LU0292109690, ticker DBX7). Je to synteticky replikovaný fond s TER 0,85 % a menším jměním kolem 158 milionů EUR. Pro naprostou většinu investorů je ale MSCI India (širší, s nižšími náklady u konkurence) lepší jádro než dražší úzký Nifty 50 – rozdíl ve složení je v praxi malý, rozdíl v poplatku a likviditě velký."
    ],
    "forWhom": "Indické ETF se hodí pro investory s dlouhým horizontem (ideálně 10 a více let), kteří už mají jádro portfolia v širokém světovém indexu a chtějí k němu přidat cílenou sázku na růst Indie. Rozumná pozice je jednotky procent portfolia jako doplněk, ne základ. Nehodí se pro začátečníky budující první portfolio (těm stačí globální ETF, kde je Indie zastoupena automaticky), pro konzervativní investory s krátkým horizontem a pro každého, kdo už drží ETF na rozvíjející se trhy a nechce vědomě zvyšovat koncentraci do jediné země. Kdo indickou váhu jen \"nechce podvážit\", vystačí si s běžným EM fondem a samostatné indické ETF nepotřebuje.",
    "risks": [
      "Koncentrace do jediné země a jednoho trhu. Držíte akcie jedné rozvíjející se ekonomiky bez sektorové ani geografické záchranné sítě. Indický trh navíc bývá dražší (vyšší ocenění P/E) než jiné EM, což zvyšuje citlivost na zklamání z růstu – poslední rok se silnou korekcí je toho ukázkou.",
      "Měnové riziko rupie i dolaru vůči koruně. Podkladem jsou akcie v indických rupiích (INR), fond obvykle kotuje v USD nebo EUR. Český investor tak nese hned dvojí měnový pohyb do CZK a hedgované třídy do koruny neexistují – i případné zajištění by bylo maximálně do EUR/USD, ne do CZK. Oslabení rupie umí samo o sobě smazat část akciového výnosu.",
      "Syntetická (swapová) replikace u velké části fondů. Amundi, Xtrackers i UBS řada indických tříd nedrží akcie fyzicky, ale replikují index přes swap. To přináší riziko protistrany a menší transparentnost. Kdo tomu chce předejít, musí cíleně volit fyzický iShares QDV5 nebo Franklin FLXI.",
      "Vyšší náklady a nižší likvidita než u širokých indexů. TER se u indických ETF pohybuje od 0,15 % (UBS INDA) až po 0,85 % (Xtrackers Nifty 50 DBX7, Amundi swapy), tedy výrazně výš než u globálního ETF kolem 0,20 %. K tomu se přidává poplatek za měnovou konverzi z korun do EUR/USD při každém nákupu."
    ],
    "faqs": [
      {
        "q": "Jaké je největší a nejznámější indické ETF pro českého investora?",
        "a": "Největší je iShares MSCI India UCITS ETF USD Acc (ISIN IE00BZCQB185, ticker QDV5) s majetkem přes 4,5 miliardy EUR. Drží akcie fyzicky, je akumulační a má irský domicil; nevýhodou je vyšší TER 0,65 %. Obchoduje se na evropských burzách a je dostupné u brokerů jako DEGIRO, XTB, Trading 212 nebo Interactive Brokers."
      },
      {
        "q": "Které indické ETF má nejnižší poplatek (TER)?",
        "a": "Nejlevnější je UBS MSCI India SF UCITS ETF (IE000N70F6V6, INDA) s TER 0,15 %, těsně následované Franklin FTSE India (IE00BHZRQZ17, FLXI) a Xtrackers MSCI India Swap (LU0514695187, XCS5), oba s TER 0,19 %. Pozor ale, že nejlevnější fondy (UBS, Xtrackers) jsou synteticky replikované – fyzickou replikaci za nízký poplatek nabízí právě Franklin FLXI."
      },
      {
        "q": "Je lepší MSCI India, nebo Nifty 50?",
        "a": "MSCI India obsahuje zhruba 130 firem a kolem 85 % trhu, Nifty 50 jen padesát největších blue chipů z burzy NSE. V praxi se výkonnost obou indexů liší jen mírně, protože největší firmy dominují oběma. Rozhodující je nabídka fondů: MSCI India má více a levnějších ETF, kdežto Nifty 50 zastupuje na evropském trhu prakticky jen Xtrackers Nifty 50 Swap (DBX7) s vyšším TER 0,85 %. Pro většinu investorů je proto MSCI India praktičtější volba."
      },
      {
        "q": "Proč jsou indické ETF často synteticky replikované (swap)?",
        "a": "Indická daňová a regulatorní pravidla dělají přímé (fyzické) držení akcií pro zahraniční fondy nákladné a administrativně náročné. Řada poskytovatelů (Amundi, Xtrackers, UBS) proto místo nákupu akcií replikuje index přes swap, kde výnos dodává finanční protistrana. Přináší to nižší náklady a přesnější sledování indexu výměnou za riziko protistrany. Kdo se swapu chce vyhnout, volí fyzický iShares QDV5 nebo Franklin FLXI."
      },
      {
        "q": "Nemám Indii už ve svém ETF na rozvíjející se trhy?",
        "a": "Skoro jistě ano. Indie je dnes jednou z největších vah indexu MSCI Emerging Markets, hned vedle Číny a Tchaj-wanu. Pokud držíte běžné EM ETF nebo globální all-world fond, část indické expozice už máte automaticky. Samostatné indické ETF má proto smysl jen jako vědomá nadváha, když chcete na Indii vsadit víc než odpovídá jejímu podílu ve světě."
      },
      {
        "q": "Jak se v Česku daní zisk z indického ETF?",
        "a": "U akciových ETF (cenné papíry-fondy) platí standardní pravidla: zisk z prodeje je osvobozen po splnění tříletého časového testu (od roku 2026 bez horního limitu), případně pokud úhrn vašich prodejů za rok nepřesáhne 100 000 Kč (hodnotový test). U akumulačních fondů jako iShares QDV5 se reinvestice dividend uvnitř fondu neřeší; u distribučních tříd se vyplacené dividendy daní 15 %. Domicil ani syntetická replikace na tato pravidla pro českého investora nic nemění."
      }
    ]
  },
  "nejlepsi-infrastrukturni-etf": {
    "introTitle": "Infrastrukturní ETF: reálná aktiva, cash flow a ochrana proti inflaci",
    "intro": [
      "Infrastrukturní ETF sdružují firmy, které vlastní a provozují fyzickou infrastrukturu, na níž stojí ekonomika: přenosové a distribuční sítě, plynovody a produktovody, dálnice a mýtné silnice, letiště, přístavy, železnice, vodárny, telekomunikační věže a datová centra. Nejde o samostatnou třídu aktiv, ale o výřez z akciového trhu s velmi specifickým profilem. Tyto firmy typicky mají regulovaný nebo dlouhodobě smluvně zajištěný příjem, vysoké vstupní bariéry (konkurent nepostaví druhé letiště vedle stávajícího) a příjmy často navázané na inflaci. Právě proto se infrastruktura řadí mezi takzvaná reálná aktiva a bere se jako částečná ochrana proti inflaci a doplněk k běžnému akciovému jádru.",
      "Klasickým benchmarkem kategorie je index S&P Global Infrastructure, který drží zhruba 75 firem rozdělených napříč třemi bloky: energetika a sítě (utilities), doprava (transportation) a energetická infrastruktura (pipelines). V portfoliu tak najdete jména jako NextEra Energy, Enbridge, Transurban, Aena nebo American Tower. Pozor ale na to, že tato kategorie se v praxi rozpadá na dvě dost odlišné školy: klasickou defenzivní infrastrukturu (sítě, mýtné, letiště) a novou vlnu tematických fondů kolem AI, datacenter a elektrifikace, které jsou mnohem růstovější a volatilnější. To, co koupíte, se liší podle indexu často víc než u jiných kategorií.",
      "Pro českého investora je zásadní, že žádný z těchto fondů nekoupíte v korunách. Většina je denominovaná v dolarech (fund_currency USD), část v eurech, ale podkladová aktiva jsou globální. Výnos, který uvidíte, je vždy potřeba chápat jako výnos přepočtený do korun. I když index roste, může posílení koruny vůči dolaru výnos v CZK smazat. Všechny níže uvedené fondy jsou UCITS s irským nebo lucemburským domicilem a běžně se obchodují na evropských burzách (Xetra, Euronext, LSE) u brokerů jako DEGIRO, XTB, Trading 212 nebo Interactive Brokers.",
      "Od průmyslových (industrials) ETF se infrastruktura liší tím, že nejde o výrobce strojů a cyklické firmy, ale o provozovatele aktiv se stabilním cash flow; podrobný industrials úhel řešíme v samostatné kategorii nejlepší průmyslové ETF. Od sektorových utility fondů se zase liší přidanou dopravou a energetickou infrastrukturou."
    ],
    "verdict": [
      "Pokud hledáte klasickou defenzivní globální infrastrukturu, jádrem kategorie jsou dva fondy na index S&P Global Infrastructure. iShares Global Infrastructure UCITS ETF v distribuční třídě (ISIN IE00B1FZS467, ticker INFR, TER 0,65 %, přes 2,1 mld. USD) je největší a nejlikvidnější fyzicky replikovaný fond; existuje i jeho akumulační sesterská třída CBUX (IE000CK5G8J7, TER 0,65 %, menší objem kolem 146 mil. USD). Levnější alternativou na velmi podobný index je Xtrackers S&P Global Infrastructure Swap UCITS ETF 1C (LU0322253229, DX2E, TER 0,60 %, přes 600 mil. USD), ten ale používá swapovou (syntetickou) replikaci, což je pro citlivější investory argument proti. Pro rentu je logickou volbou distribuční INFR, pro dlouhodobé spoření akumulační CBUX nebo swapový Xtrackers.",
      "Kdo chce širší záběr než čistý S&P index, může sáhnout po State Street SPDR Morningstar Multi-Asset Global Infrastructure UCITS ETF (IE00BQWJFQ70, ZPRI, TER 0,40 %, kolem 967 mil. USD), který kombinuje akcie infrastrukturních firem a přidává i realitní a další prvky za nižší poplatek. Nejlevnějším čistě akciovým řešením v kategorii je BNP Paribas Easy ECPI Global ESG Infrastructure (IE000FF2EBQ8, TER 0,31 %), pokud vám nevadí ESG filtr. Naopak Amundi Global Infrastructure (LU1589350310) je malý (kolem 17 mil. EUR) a jeho výnos v korunách za poslední rok zaostával, což ukazuje, jak moc složení a měna rozhodují.",
      "Zvlášť je nutné oddělit tematickou větev. Fondy jako First Trust Nasdaq Clean Edge Smart Grid Infrastructure (IE000J80JTL1, GRID, TER 0,63 %, přes 2,3 mld. USD, výnos v CZK za rok přes 36 %) nebo iShares AI Infrastructure (IE000X59ZHE2, AINF, TER 0,35 %), který vytáhl přepočtený roční výnos přes 90 %, nejsou defenzivní infrastruktura. Jde o sázku na elektrifikaci, datacentra a AI hardware. Nabízejí vyšší růst, ale i mnohem vyšší kolísání a překryv s technologickým sektorem. Neberte je jako náhradu klasické infrastruktury pro stabilitu, ale jako samostatné tematické doplňky. Konkrétní pořadí podle TER a velikosti najdete v žebříčcích a tabulce níže."
    ],
    "forWhom": "Infrastrukturní ETF se hodí investorovi, který už má postavené široké akciové jádro (světový index) a chce k němu přidat cihlu s odlišným profilem: nižší korelací k technologiím, stabilnějším cash flow a částečnou ochranou proti inflaci. Rozumná pozice bývá 5 až 10 % portfolia jako doplněk, ne základ. Dobře poslouží i těm, kdo v rentiérské fázi hledají pravidelnou dividendu z reálných aktiv (distribuční INFR). Nehodí se jako první a jediný fond začátečníka, protože je to úzký sektor s vyšším TER (0,3 až 0,7 %) než široký index. Nehodí se ani pro toho, kdo od infrastruktury čeká klid a přitom by omylem koupil tematický AI/smart-grid fond, jenž kolísá jako technologické akcie. A nehodí se pro investory, kteří by nesnesli, že po přepočtu do korun může i rostoucí index skončit v mínusu kvůli pohybu měny.",
    "risks": [
      "Záměna defenzivní a tematické infrastruktury. Pod jedním názvem kategorie se skrývají fondy s naprosto odlišným rizikovým profilem. Klasický iShares INFR (S&P Global Infrastructure) je defenzivní, zatímco First Trust GRID nebo iShares AI Infrastructure (AINF) jsou růstové tematické sázky s kolísáním jako u tech akcií. Před nákupem si projděte index a prvních deset pozic, ať víte, co skutečně kupujete.",
      "Měnové riziko vůči koruně. Většina fondů je v USD, část v EUR, ale český investor nese riziko vůči CZK vždy. Žádný z těchto fondů není zajištěný do koruny (existují jen třídy hedgované do GBP, EUR nebo USD, například INGH do libry). I když globální infrastruktura roste, posílení koruny vůči dolaru může výnos v korunách smazat.",
      "Citlivost na úrokové sazby a vyšší poplatky. Infrastrukturní a utility firmy jsou silně zadlužené a jejich stabilní dividendy konkurují dluhopisům; při růstu sazeb bývají pod tlakem. K tomu je TER v kategorii vyšší (0,31 až 0,74 %) než u širokého světového indexu kolem 0,20 %, takže za sektorové zaměření platíte prémii.",
      "Koncentrace a regulatorní riziko. Indexy drží relativně málo firem (kolem 75 u S&P Global Infrastructure) a jsou navázané na regulaci, koncese a mýtné sazby. Zásah regulátora, změna koncesních podmínek nebo výpadek dopravy (jak ukázala pandemie u letišť) dopadá na výnos přímo a soustředěně."
    ],
    "faqs": [
      {
        "q": "Jaký je nejlepší klasický globální infrastrukturní ETF pro Čecha?",
        "a": "Pro defenzivní globální infrastrukturu je nejrozšířenější iShares Global Infrastructure UCITS ETF na index S&P Global Infrastructure. Distribuční třída (ISIN IE00B1FZS467, ticker INFR, TER 0,65 %) je největší a nejlikvidnější, akumulační sesterská třída má ISIN IE000CK5G8J7 (CBUX). Levnější, ale swapově replikovanou alternativou je Xtrackers S&P Global Infrastructure (LU0322253229, DX2E, TER 0,60 %). Aktuální pořadí podle nákladovosti a velikosti najdete v žebříčcích na této stránce."
      },
      {
        "q": "Jaký je rozdíl mezi infrastrukturním a průmyslovým (industrials) ETF?",
        "a": "Infrastrukturní ETF drží provozovatele fyzických aktiv se stabilním, často regulovaným cash flow: sítě, mýtné silnice, letiště, plynovody, věže. Průmyslové (industrials) ETF drží cyklické výrobce strojů, letecký a obranný průmysl a logistiku, jejichž zisky silně kolísají s hospodářským cyklem. Infrastruktura je defenzivnější a víc navázaná na inflaci, industrials je cykličtější. Detailní industrials úhel řešíme v kategorii nejlepší průmyslové ETF."
      },
      {
        "q": "Chrání infrastrukturní ETF proti inflaci?",
        "a": "Částečně ano. Řada infrastrukturních firem (mýtné silnice, vodárny, regulované sítě) má příjmy smluvně nebo regulatorně navázané na inflaci, takže při růstu cen rostou i jejich tržby. Nejde ale o dokonalou ochranu: proti inflaci působí i protivítr v podobě citlivosti na úrokové sazby, protože jde o zadlužené firmy s dividendovým profilem. Berte to jako reálné aktivum s inflačním prvkem, ne jako záruku."
      },
      {
        "q": "Je AI Infrastructure nebo Smart Grid ETF to samé jako klasická infrastruktura?",
        "a": "Ne. Fondy jako iShares AI Infrastructure (IE000X59ZHE2, AINF) nebo First Trust Nasdaq Clean Edge Smart Grid Infrastructure (IE000J80JTL1, GRID) jsou tematické růstové sázky na datacentra, elektrifikaci a AI hardware. Jejich přepočtené roční výnosy byly řádově vyšší (u AINF přes 90 %), ale i kolísání je mnohem větší a překrývají se s technologickým sektorem. Neberte je jako defenzivní náhradu klasické infrastruktury, ale jako samostatný tematický doplněk."
      },
      {
        "q": "Jak se infrastrukturní ETF daní v Česku v roce 2026?",
        "a": "Jde o klasické akciové UCITS fondy (cenné papíry), takže platí standardní pravidla. Zisk z prodeje je osvobozen po splnění časového testu (držení déle než 3 roky; od roku 2026 bez horního limitu), nebo pokud úhrn vašich prodejů za rok nepřesáhne 100 000 Kč (hodnotový test). Dividendy z distribučních tříd (například INFR) se daní 15 %. U akumulačních tříd se reinvestice uvnitř fondu v přiznání neřeší. Detaily najdete v našem daňovém hubu."
      },
      {
        "q": "Mám volit distribuční, nebo akumulační infrastrukturní ETF?",
        "a": "Pro dlouhodobé budování majetku je jednodušší akumulační třída (například CBUX u iShares nebo swapový Xtrackers DX2E), která dividendy sama reinvestuje a nemusíte je danit. Distribuční variantu (INFR) volte, pokud chcete pravidelný příjem z reálných aktiv, typicky v rentiérské fázi. Infrastruktura patří mezi vyšší dividendové sektory, takže distribuční třída zde má pro rentu smysl víc než u růstových témat."
      }
    ]
  },
  "nejlepsi-korporatni-dluhopisy-etf": {
    "introTitle": "Korporátní dluhopisové ETF: výnos nad státními bondy za cenu kreditního rizika",
    "intro": [
      "Korporátní (investment-grade) dluhopisové ETF sdružují dluhopisy vydané finančně zdravými firmami s ratingem v pásmu AAA až BBB- – tedy takovými, u nichž ratingové agentury považují splacení za pravděpodobné. Od vládních dluhopisů se liší jednou zásadní věcí: firma může zkrachovat nebo jí může spadnout rating, zatímco stát typicky ne. Za tuto nejistotu investor dostává kreditní přirážku (spread) – výnos navíc nad státním dluhopisem stejné splatnosti. To je jádro celé kategorie a hlavní důvod, proč ji do portfolia zařadit. Pokud hledáte čistě bezpečnostní pilíř bez kreditního rizika, patříte spíš do kategorie vládních dluhopisových ETF; pokud naopak toužíte po vysokém výnosu za cenu skutečného rizika defaultu, hledejte high-yield (junk) ETF – ty do investment-grade nepatří.",
      "Pro českého investora je klíčové, že drtivá většina těchto fondů je denominovaná v euru nebo dolaru a drží evropské, respektive americké firemní bondy. Největší evropský fond iShares Core EUR Corporate Bond (ISIN IE00B3F81R35) drží stovky emisí od Nestlé, Volkswagenu, bank i utilit napříč eurozónou; americký protějšek Vanguard USD Corporate Bond (IE00BGYWFK87) sází na dolarové emise od Apple, JPMorgan a dalších. Ani jeden z nich ale nekoupíte v korunách – broker vám nákup přepočítá z CZK do EUR/USD a výnos, který uvidíte, je vždy výnos přepočtený do korun, ovlivněný pohybem kurzu.",
      "Právě proto se u této kategorie roční výnosy přepočtené do korun tak liší podle měny fondu. Zatímco eurové korporátní fondy měly za poslední rok výnos blízko nule (iShares Core EUR Corporate Bond Acc kolem -0,2 %), dolarové fondy jako iShares USD Corporate Bond (IE00BYXYYJ35) vykázaly přes 5 % – velkou část toho ovšem tvořil pohyb dolaru vůči koruně, ne samotný dluhopisový výnos. To je pro Čecha zásadní připomínka: měnu tu neřešíte jako detail, ale jako hlavní zdroj kolísání."
    ],
    "verdict": [
      "Pro jádro korporátní pozice v eurech je nejlogičtější volbou levný, široký a velký fond. Vede iShares Core EUR Corporate Bond – v distribuční verzi (IE00B3F81R35, TER 0,09 %, přes 9,7 mld. EUR) i akumulační (IE00BF11F565, TER 0,09 %). Ještě levnější je Vanguard EUR Corporate Bond (IE00BGYWT403 Acc / IE00BZ163G84 Dist, TER 0,07 %) a cenově srovnatelný Xtrackers II EUR Corporate Bond (LU0478205379, TER 0,09 %). Všechny drží stovky investment-grade emisí napříč eurozónou, takže default jedné firmy portfoliem sotva hne – to je hlavní výhoda ETF oproti nákupu jednotlivého firemního bondu.",
      "Kdo chce dolarovou expozici a vyšší nominální výnos, sáhne po Vanguard USD Corporate Bond (IE00BGYWFK87, TER 0,07 %) nebo iShares USD Corporate Bond (IE00BYXYYJ35 Acc / IE0032895942 LQDS Dist, TER 0,20 %). Musí ale počítat s tím, že rozhodující díl výsledku určí kurz USD/CZK, ne kredit. Konzervativní investor, který se bojí úrokového rizika, by měl zvážit short-duration varianty: iShares USD Short Duration Corporate Bond (IE00BYXYYP94, TER 0,20 %) nebo Amundi EUR Corporate Bond 1-5Y (LU1525418643). Kratší durace znamená menší kolísání ceny při pohybu sazeb, ale i nižší výnos.",
      "Volba mezi akumulační a distribuční třídou je čistě daňová a příjmová. Dlouhodobý investor, který jen skládá majetek, ať volí akumulační třídu – kupóny se reinvestují uvnitř fondu a nemusí je řešit v přiznání. Kdo z dluhopisů chce pravidelný příjem (renta, FIRE fáze), zvolí distribuční verzi a počítá s 15% daní z vyplácených kupónů. Pořadí podle nákladovosti a velikosti najdete v žebříčcích níže; rozdíly v TER jsou mezi hlavními fondy setiny procenta, rozhoduje spíš měna, durace a dostupnost u vašeho brokera."
    ],
    "forWhom": "Korporátní investment-grade ETF se hodí investorovi, který chce z dluhopisové části portfolia o něco vyšší výnos než ze státních bondů a je ochoten za to nést mírné kreditní riziko a citlivost na úrokové sazby. Sedí jako doplněk či náhrada vládní části dluhopisového bloku, pro konzervativnější profily nebo pro fázi života, kdy investor snižuje akciové riziko. Nehodí se jako bezpečnostní polštář nebo rezerva na horší časy – v akciové krizi mohou kreditní spready roztáhnout a fond klesnout spolu s trhem (na to jsou lepší krátké vládní bondy). Nehodí se ani pro toho, kdo honí maximální výnos – tam patří high-yield, ovšem s reálným rizikem defaultů. A rozhodně to není nástroj pro někoho, kdo nechce řešit měnu: výnos vždy nesete přepočtený do korun.",
    "risks": [
      "Kreditní (spread) riziko. Byť jde o investment-grade firmy, ratingy se mohou zhoršit a v recesi se kreditní přirážky rozšiřují – cena fondu pak klesá i bez jediného skutečného defaultu. Právě tento spread je zdrojem výnosu i rizika, kterým se kategorie liší od vládních dluhopisů.",
      "Úrokové (durační) riziko. Když centrální banky zvednou sazby, ceny dříve vydaných dluhopisů klesají. Fondy s dlouhou durací (např. široké EUR/USD Corporate Bond) reagují prudčeji než short-duration varianty (1-5Y, 0-3Y). Před nákupem si zkontrolujte průměrnou duraci fondu.",
      "Měnové riziko vůči koruně. Dolarové fondy jako iShares USD Corporate Bond mohou vykázat výnos přepočtený do korun přes 5 %, ale velký díl je pohyb USD/CZK, ne dluhopisový výnos. I 'EUR hedged' třídy zajišťují jen do eura, ne do koruny – korunové riziko Čechovi neodstraní žádný z těchto fondů.",
      "Nižší likvidita podkladu než u akcií. Firemní dluhopisy se obchodují méně než akcie a v tržním stresu se rozpětí nákup/prodej roztahuje. U velkých fondů (nad 2-3 mld. EUR) je to menší problém než u malých; velikost fondu proto sledujte."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi korporátním a vládním dluhopisovým ETF?",
        "a": "Vládní ETF drží dluhopisy států (nízké kreditní riziko, výnos hlavně z durace a sazeb). Korporátní investment-grade ETF drží dluhopisy finančně zdravých firem s ratingem AAA až BBB- a nabízí kreditní přirážku (spread) navíc nad státním výnosem. Za vyšší výnos ale nesete riziko zhoršení ratingu i defaultu firmy. Pokud chcete čistou bezpečnost, sáhněte po vládní kategorii; korporátní je kompromis mezi výnosem a rizikem."
      },
      {
        "q": "Jaký je rozdíl oproti high-yield (junk) ETF?",
        "a": "Investment-grade znamená rating AAA až BBB- – emitenti, u kterých je splacení pravděpodobné. High-yield (junk) ETF drží dluhopisy pod tímto pásmem (BB a níže), s výrazně vyšším výnosem, ale i vyšší pravděpodobností defaultu. Fondy z této kategorie junk bondy záměrně nedrží. Kdo cílí na vyšší výnos a snese riziko, hledá samostatnou high-yield kategorii; kdo chce firemní bondy s rozumným rizikem, zůstává u investment-grade."
      },
      {
        "q": "Proč měl dolarový korporátní fond výnos přes 5 % a eurový skoro nula?",
        "a": "Velký díl rozdílu tvoří kurz. iShares USD Corporate Bond (IE00BYXYYJ35) i Vanguard USD Corporate Bond (IE00BGYWFK87) vykázaly za poslední rok výnos přepočtený do korun přes 5 %, ale podstatnou část tvořil pohyb dolaru vůči koruně, ne samotný dluhopisový výnos. Eurové fondy jako iShares Core EUR Corporate Bond byly blízko nule. Jako Čech nesete měnové riziko vůči koruně vždy – u dolarových fondů je proto výsledek mnohem víc o kurzu než o kreditu."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční variantu?",
        "a": "Pro dlouhodobé skládání majetku je jednodušší akumulační třída (např. iShares Core EUR Corporate Bond IE00BF11F565 nebo Vanguard EUR Corporate Bond IE00BGYWT403) – kupóny se reinvestují uvnitř fondu a nemusíte je danit ani ručně reinvestovat. Distribuční verzi (IE00B3F81R35, IE0032895942) volte, pokud chcete z dluhopisů pravidelný příjem; vyplácené kupóny se pak v ČR daní 15 %."
      },
      {
        "q": "Jak se korporátní dluhopisové ETF daní v Česku?",
        "a": "Jde o klasické cenné papíry-fondy. Zisk z prodeje podílů je osvobozen po splnění tříletého časového testu (od roku 2026 bez horního limitu), případně pokud úhrn všech prodejů nepřesáhne 100 000 Kč za rok (hodnotový test). U distribučních tříd se vyplácené kupóny daní 15 %; u akumulačních fondů se reinvestice uvnitř fondu v přiznání neřeší. Detaily najdete v našem daňovém hubu."
      },
      {
        "q": "Co když centrální banka zvedne sazby – přijdu o peníze?",
        "a": "Cena dluhopisů klesá, když rostou sazby, a fondy s dlouhou durací reagují prudčeji. Pokud se úrokového rizika obáváte, zvolte short-duration variantu – např. iShares USD Short Duration Corporate Bond (IE00BYXYYP94) nebo Amundi EUR Corporate Bond 1-5Y (LU1525418643). Kratší splatnosti kolísají méně, výměnou za nižší výnos. Před nákupem si u konkrétního fondu ověřte průměrnou duraci."
      }
    ]
  },
  "nejlepsi-obnovitelne-zdroje-etf": {
    "introTitle": "Obnovitelné zdroje jako celý ekosystém: nejen solár, ale i voda, sítě a úložiště",
    "intro": [
      "Zatímco úzké \"clean energy\" fondy sázejí hlavně na výrobce solárních panelů a provozovatele větrných a vodních elektráren, kategorie obnovitelných zdrojů se dá pojmout šířeji – jako celý řetězec energetické transformace. Patří sem výroba (solár, vítr, vodík), ale i infrastruktura, která tu energii vůbec umožní: rozvodné a chytré sítě (smart grid), elektrifikace, bateriová úložiště a vodohospodářství. Právě tahle šíře je důvod, proč se stránka nepřekrývá jedna k jedné s naším přehledem clean energy ETF – tam řešíme čistou výrobu energie a její extrémní citlivost na úroky, tady bereme obnovitelné zdroje jako ekosystém \"krumpáčů a lopat\", který energetiku obsluhuje.",
      "Nejlikvidnějším zástupcem čisté energie zůstává iShares Global Clean Energy Transition (ticker INRG, ISIN IE00B1XNHC34), objem kolem 3,2 mld. EUR, TER 0,65 %, distribuční třída. Vedle něj ale stojí fondy, které míří na jiné části řetězce: First Trust Nasdaq Clean Edge Smart Grid Infrastructure (GRID, IE000J80JTL1, TER 0,63 %, akumulační, přes 2,3 mld. EUR) sází na modernizaci rozvodných sítí, iShares Global Water (IH2O, IE00B1TXK627, TER 0,65 %) na vodohospodářství a Xtrackers Electrification Technologies & Smart Grid (WIRE, IE000O7Q2E56, TER jen 0,35 %) na elektrifikaci. To jsou byznysy s daleko klidnějším profilem než čistý solár.",
      "Rozdíl v chování je zásadní. Čistá energie (INRG) i tematické segmenty typu baterie – třeba L&G Battery Value-Chain (BATE, IE00BF0M2Z96) nebo Global X Lithium & Battery Tech (LI7U, IE00BLCHJN13) – dokáží za rok vyskočit o desítky procent, ale i o desítky procent spadnout. Naproti tomu vodohospodářské fondy (IH2O) se chovají spíš jako defenzivní utility a jejich roční pohyby jsou mírné. Šíře kategorie tak není jen marketing – reálně rozhoduje o tom, jak moc s vámi portfolio bude houpat.",
      "Pro českého investora utrácejícího koruny jsou skoro všechny relevantní fondy dostupné jako UCITS přes běžné brokery (DEGIRO, XTB, Trading 212, Interactive Brokers, Portu). Vedou se v USD nebo EUR, takže výnos přepočtený do korun ovlivní i pohyb měny – oslabení dolaru proti koruně vám sníží výsledek v CZK, i kdyby fond ve své měně rostl. TER se drží v pásmu zhruba 0,35–0,69 %, tedy citelně výš než u širokého světového indexu."
    ],
    "verdict": [
      "Pokud chcete jednu širokou sázku na obnovitelnou energetiku, začněte u iShares Global Clean Energy Transition (INRG, IE00B1XNHC34) – největší a nejlikvidnější fond kategorie, který ale existuje hlavně v distribuční podobě (dividendy si v ČR daníte sami 15 %). Kdo preferuje akumulaci, sáhne po jeho třídě IE000U58J0M1, případně po Invesco Global Clean Energy Acc (G1CE, IE00BLRB0242). Tady se vědomě smiřte s tím, že jde o volatilní, na úrocích závislý segment; hlubší rozbor téhle citlivosti najdete na naší stránce clean energy ETF, kam z téhle kategorie prolinkujeme, ať neopakujeme totéž dvakrát.",
      "Chcete-li klidnější profil a přitom zůstat u tématu transformace, jsou zajímavější infrastrukturní hráči. First Trust Smart Grid Infrastructure (GRID, IE000J80JTL1) a Xtrackers Electrification Technologies & Smart Grid (WIRE, IE000O7Q2E56, TER jen 0,35 %) sázejí na modernizaci a rozšiřování sítí – trend, který poroste bez ohledu na to, kdo zrovna vyhraje dotační bitvu o panely. Doplňkem k vodní a defenzivní části může být iShares Global Water (IH2O, IE00B1TXK627) nebo levnější L&G Clean Water (XMLC, IE00BK5BC891, TER 0,49 %). Naopak čisté sázky na jeden podsegment – solár (Invesco Solar S0LR, IE00BM8QRZ79), vítr, baterie (BATE) nebo vodík (L&G Hydrogen HTMW, IE00BMYDM794) – berte jen jako malý satelit; jsou to úzké, mimořádně kolísavé produkty.",
      "Napříč kategorií preferujte irský domicil (ISIN začínající IE), který snižuje srážkovou daň z amerických dividend uvnitř fondu, a hlídejte velikost. Řada tematických fondů má jen desítky milionů EUR (Global X Solar RA7Z, Invesco Wind WDEY, Global X Wind WNDY) – u těch hrozí širší spread i riziko zrušení fondu. Poznámka na okraj: kategorie obnovitelné zdroje a clean energy se z velké části překrývají; z pohledu SEO i uživatele dává smysl je do budoucna sloučit pod jeden kanonický přehled a odlišit jen úhlem, ať se stránky vzájemně nekanibalizují."
    ],
    "forWhom": "Kategorie se hodí investorovi s dlouhým horizontem (ideálně 7+ let), který už má vybudované široké jádro portfolia (celosvětový akciový ETF) a chce k němu vědomě přidat satelit na energetickou transformaci v rozsahu zhruba 5–15 %. Kdo snese vyšší volatilitu, může jít do čisté výroby (INRG, solár, baterie, vodík); kdo chce klidnější variantu téhož tématu, zvolí spíš sítě a vodu (GRID, WIRE, IH2O). Nehodí se pro začátečníky stavějící první portfolio, pro investory s krátkým horizontem, pro ty, kdo potřebují pravidelný stabilní příjem, ani pro nikoho, kdo by při dvojcifderné ztrátě panicky prodával – čistě obnovitelné fondy prošly po roce 2021 několikaletým hlubokým propadem. Není to jádro portfolia, ale tematický doplněk.",
    "risks": [
      "Citlivost na úrokové sazby u výrobní části: solární, větrné a vodíkové projekty jsou kapitálově náročné a financované na dluh, takže růst sazeb sráží ocenění – to byl hlavní důvod, proč čistě obnovitelné fondy jako INRG po roce 2021 ztratily desítky procent a roky se z toho vzpamatovávaly.",
      "Vysoká koncentrace a tematické riziko: úzké fondy (solár S0LR, vítr WDEY, vodík HTMW, baterie BATE) mají jen desítky titulů s velkou vahou jednotlivých jmen; neúspěch pár firem nebo nástup jiné technologie zasáhne fond mnohem víc než široký trh.",
      "Malá velikost a likvidita: mnoho fondů v kategorii má jen jednotky až desítky milionů EUR (Global X Solar, Global X Wind, Invesco Hydrogen). Hrozí širší spread při nákupu i prodeji a riziko, že poskytovatel malý fond po opadnutí zájmu zruší.",
      "Měnové riziko vůči koruně: fondy se vedou v USD/EUR. Výnos přepočtený do korun ovlivní i pohyb měny – i kdyby fond ve své měně rostl, oslabení dolaru proti CZK vám výsledek sníží. Žádný z těchto fondů není zajištěný do koruny."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi ETF na obnovitelné zdroje a clean energy ETF?",
        "a": "V praxi se z velké části překrývají, ale úhel je jiný. Clean energy fondy (typicky INRG) míří na čistou výrobu energie – solár, vítr, vodní elektrárny – a jsou extrémně citlivé na úroky. Obnovitelné zdroje pojímáme šířeji jako celý ekosystém transformace: k výrobě přidáváme sítě a elektrifikaci (GRID, WIRE), vodu (IH2O) i úložiště a baterie (BATE). Detailní rozbor čisté výroby najdete na naší stránce clean energy ETF, kam odtud prolinkujeme."
      },
      {
        "q": "Který fond je pro tuhle kategorii nejlikvidnější a nejbezpečnější volbou?",
        "a": "Objemem vede iShares Global Clean Energy Transition (INRG, IE00B1XNHC34) s cca 3,2 mld. EUR a First Trust Smart Grid Infrastructure (GRID, IE000J80JTL1) přes 2,3 mld. EUR. Velký fond je bezpečnější v tom, že u něj méně hrozí zrušení a mívá užší spread. Naopak fondy s objemem v jednotkách až desítkách milionů EUR (Global X Solar, Global X Wind, Invesco Hydrogen) berte s rezervou právě kvůli likviditě."
      },
      {
        "q": "Musím řešit daně, když fond drží zahraniční akcie a vyplácí dividendy?",
        "a": "U klasických akciových ETF (a to obnovitelné fondy jsou) platí český časový test: pokud podíl držíte déle než 3 roky, je zisk z prodeje od roku 2026 osvobozen bez horního limitu. Alternativně hodnotový test osvobozuje prodeje do úhrnu 100 000 Kč za rok. U distribučních tříd (např. INRG Dist) si přijaté dividendy daníte sazbou 15 %; u akumulačních tříd (GRID, WIRE, Invesco G1CE) se reinvestice uvnitř fondu v přiznání neřeší. Konkrétní postup rozebíráme v našem daňovém hubu."
      },
      {
        "q": "Proč čistě obnovitelné fondy tolik kolísají a sítě nebo voda méně?",
        "a": "Výroba čisté energie je kapitálově náročná a financovaná na dluh, takže reaguje prudce na úrokové sazby a dotační politiku – odtud propad INRG o desítky procent po roce 2021. Sítě a elektrifikace (GRID, WIRE) i vodohospodářství (IH2O) stojí na regulovaných utilitách a infrastruktuře s předvídatelnějšími cash flow, takže se chovají klidněji. Proto šíře kategorie reálně mění rizikový profil."
      },
      {
        "q": "Nesu jako Čech měnové riziko, i když je fond v EUR?",
        "a": "Ano. Tyto fondy se vedou v USD nebo EUR a žádný z nich není zajištěný do koruny (hedgované třídy existují maximálně do EUR/USD, ne do CZK). Výnos vždy počítejte jako přepočtený do korun – pokud dolar nebo euro oslabí proti koruně, sníží vám to výsledek v CZK, i kdyby fond ve své měně rostl. Měnové riziko vůči koruně nesete u zahraničních ETF prakticky vždy."
      },
      {
        "q": "Kolik z portfolia dává smysl do obnovitelných zdrojů dát?",
        "a": "Vzhledem ke koncentraci a volatilitě jde o satelit, ne o jádro. Rozumné je držení zhruba 5–15 % portfolia vedle širokého celosvětového akciového ETF, přičemž nejvolatilnější úzké sázky (solár, vítr, baterie, vodík) by měly být jen malou částí i uvnitř tohoto satelitu. Vyšší alokace znamená, že se výsledek celého portfolia začne řídit náladou jednoho úzkého tématu."
      }
    ]
  },
  "nejlepsi-prumyslove-etf": {
    "introTitle": "Průmyslové ETF: sázka na letecký, obranný a strojírenský motor ekonomiky",
    "intro": [
      "Průmyslový (industrials) sektor je jeden z jedenácti standardních sektorů podle klasifikace GICS a patří mezi nejcykličtější části akciového trhu. Nejde o \"těžkou fabriku\" v lidové představě, ale o širokou skupinu firem: letecký a obranný průmysl (Boeing, RTX, GE Aerospace, Safran, Airbus), strojírenství a automatizaci (Siemens, Caterpillar, Schneider Electric, ABB), dopravu a logistiku (Union Pacific, UPS, Deutsche Post), stavební a inženýrské služby i letiště. Průmyslové ETF tyhle firmy sbalí do jednoho koše, obvykle vážené tržní kapitalizací.",
      "Pro českého investora je klíč pochopit, že tohle je vyloženě cyklická sázka. Průmysl vydělává, když ekonomika zrychluje, firmy investují do strojů, staví se a létá. Když přijde recese, kapitálové výdaje se škrtají první a průmyslové akcie padají hlouběji než široký trh. Poslední roky sektoru přály: reshoring (návrat výroby do USA a Evropy), rekordní zbrojní rozpočty v Evropě po roce 2022 a boom automatizace kvůli AI a datovým centrům. To vysvětluje, proč většina fondů níže vykázala roční výnos přepočtený do korun kolem 20 až 28 %.",
      "Pozor na jednu terminologickou past, která u tohohle hesla mate nejvíc lidí. \"Industrial Metals\" (třeba WisdomTree Industrial Metals, ISIN GB00B15KYG56) NENÍ průmyslové akciové ETF. Jsou to komoditní ETC na měď, hliník, zinek a nikl, tedy úplně jiný produkt s jiným daňovým i rizikovým profilem. V téhle kategorii se bavíme o akciích průmyslových firem. Pokud hledáte kovy, patříte do komoditních ETF, ne sem.",
      "Průmysl je také třeba odlišit od dvou sousedních témat, se kterými se často plete: infrastrukturní ETF (mýtné silnice, přenosové sítě, energetická infrastruktura, cíl je stabilní cash flow a inflační ochrana) a energetické ETF (těžba ropy a plynu). Industrials je něco jiného, cyklický výrobní a dopravní motor ekonomiky. Na obě sousední kategorie máme samostatné průvodce."
    ],
    "verdict": [
      "Pokud chcete globálně diverzifikovaný průmysl v jednom fondu, nejlogičtější volbou je Xtrackers MSCI World Industrials UCITS ETF 1C (ISIN IE00BM67HV82, TER 0,25 %, velikost kolem 920 mil. EUR, akumulační). Drží průmyslové firmy z celého rozvinutého světa, takže nesázíte jen na jeden region. Levnější a čistě americkou alternativou je Xtrackers MSCI USA Industrials UCITS ETF (ISIN IE00BCHWNV48, TER jen 0,12 %, distribuční) nebo iShares S&P 500 Industrials Sector (ISIN IE00B4LN9N13, TER 0,15 %, kolem 685 mil. EUR). USA industrials byly historicky nejsilnější, což potvrzuje i roční výnos přes 26 % přepočtený do korun, ale koncentrujete se do jedné ekonomiky.",
      "Kdo chce vsadit na evropskou reindustrializaci a zbrojní boom, sáhne po iShares MSCI Europe Industrials Sector (ISIN IE00BMW42520, TER 0,18 %, kolem 1,3 mld. EUR) nebo State Street SPDR MSCI Europe Industrials (ISIN IE00BKWQ0J47, TER 0,18 %). Evropský průmysl (Siemens, Airbus, Schneider, ABB, Safran) profituje z obranných rozpočtů a energetické transformace a tyhle dva fondy patří v kategorii k největším a nejlevnějším.",
      "Populární, ale pozor: iShares Dow Jones Industrial Average UCITS ETF (ISIN IE00B53L4350, TER 0,33 %) navzdory názvu NENÍ sektorové průmyslové ETF. Dow Jones Industrial Average je 30 velkých amerických blue chips napříč sektory (banky, technologie, farmacie), historický název \"Industrial\" je matoucí. Kdo chce opravdu industrials sektor, ať se drží fondů se slovem \"Industrials\" a jasným sektorovým indexem (MSCI/S&P Industrials), ne \"Industrial Average\"."
    ],
    "forWhom": "Průmyslové ETF se hodí jako satelitní, doplňková pozice (rozumně 5 až 10 % portfolia) pro investora, který už má vybudované široké jádro (celosvětové nebo americké ETF) a chce cíleně přisadit na cyklický růst, reshoring a zbrojení. Sedne tomu, kdo věří, že fáze investic do výroby, automatizace a obrany bude pokračovat, a snese, že v recesi sektor spadne hlouběji než trh. Nehodí se pro začátečníka stavějícího první portfolio (industrials už máte automaticky v každém globálním fondu, typicky 10 až 12 % váhy), pro konzervativní investory s krátkým horizontem, ani pro nikoho, kdo hledá pravidelný dividendový příjem nebo defenzivní stabilitu. Kdo si termín plete s kovy, patří do komoditních ETF, ne sem.",
    "risks": [
      "Cykličnost: průmysl je jeden z nejcykličtějších sektorů vůbec. V recesi firmy škrtají kapitálové výdaje jako první a průmyslové akcie padají hlouběji a rychleji než široký trh. Vysoké výnosy posledních let (20 až 28 % v korunách) jsou z pozdní fáze cyklu, ne norma; nekupujte podle zpětného zrcátka.",
      "Sektorová koncentrace a překryv: industrials už tvoří zhruba 10 až 12 % každého globálního ETF (MSCI World, S&P 500). Přidáním sektorového fondu tu expozici jen zdvojnásobíte, nediverzifikujete. U USA fondů navíc často dominuje pár velkých jmen (letecký a obranný průmysl, železnice), takže sázíte na užší téma, než se zdá.",
      "Měnové riziko vůči koruně: fondy jsou v USD nebo EUR a jejich hodnota v korunách kolísá s kurzem. Ani u tříd označených jako EUR nejde o zajištění do CZK, český investor nese kurzové riziko vůči koruně vždy. Posílení koruny sníží výnos přepočtený do korun bez ohledu na to, jak si akcie vedly.",
      "Záměna produktů: \"Industrial Metals\" jsou komoditní ETC (jiné riziko emitenta i daně), \"Dow Jones Industrial Average\" je 30 blue chips napříč sektory, ne industrials. Kupujte podle indexu (MSCI/S&P Industrials Sector), ne podle slova v názvu."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi průmyslovým a infrastrukturním ETF?",
        "a": "Průmyslové (industrials) ETF drží akcie výrobních, strojírenských, leteckých, obranných a dopravních firem (Siemens, Caterpillar, Boeing, Union Pacific). Je to cyklická sázka na růst ekonomiky. Infrastrukturní ETF cílí na provozovatele mýtných silnic, letišť, přenosových a energetických sítí, kde jde o stabilní, často inflačně vázané cash flow, tedy defenzivnější profil. Na infrastrukturu máme samostatný průvodce."
      },
      {
        "q": "Není 'Dow Jones Industrial Average' ETF vlastně průmyslové ETF?",
        "a": "Ne, navzdory názvu. Fondy jako iShares Dow Jones Industrial Average (IE00B53L4350) nebo Amundi DJ Industrial Average sledují 30 amerických blue chips napříč všemi sektory (Apple, Goldman Sachs, UnitedHealth, Coca-Cola). Slovo 'Industrial' je jen historický název indexu z 19. století. Pokud chcete skutečně průmyslový sektor, hledejte v názvu 'Industrials' a index MSCI/S&P Industrials Sector."
      },
      {
        "q": "Jsou 'Industrial Metals' fondy totéž co průmyslové ETF?",
        "a": "Nejsou. WisdomTree Industrial Metals (GB00B15KYG56) a podobné produkty jsou komoditní ETC na průmyslové kovy (měď, hliník, zinek, nikl). Jde o jiný typ produktu, právně to nejsou akciové fondy, mají riziko emitenta a odlišné daňové zacházení. Průmyslové akciové ETF drží akcie firem, ne kovy."
      },
      {
        "q": "Jak se v Česku daní zisk z průmyslového ETF v roce 2026?",
        "a": "U klasického akciového ETF (což industrials fondy jsou) platí časový test: pokud podíl držíte déle než 3 roky, je zisk z prodeje od daně osvobozen, od roku 2026 bez horního limitu. Alternativně hodnotový test osvobozuje prodeje do úhrnu 100 000 Kč za rok. Dividendy z distribučních tříd (např. XUIN nebo iShares S&P 500 Industrials) se daní 15 %. U akumulačních tříd (např. Xtrackers World Industrials 1C) se reinvestice uvnitř fondu v přiznání neřeší. Detaily řešíme v daňovém průvodci."
      },
      {
        "q": "Akumulační, nebo distribuční třída u průmyslového ETF?",
        "a": "Pro dlouhodobé budování majetku je obvykle praktičtější akumulační (např. Xtrackers MSCI World Industrials 1C, IE00BM67HV82 nebo iShares MSCI Europe Industrials Acc, IE00BMW42520): fond dividendy reinvestuje sám a vy je neřešíte v přiznání. Distribuční třídy (Xtrackers USA Industrials 1D, iShares MSCI World Industrials Dist) vyplácejí dividendu, kterou pak daníte 15 %. Sektorové industrials fondy mají spíš nižší dividendový výnos, takže tady rozhoduje hlavně pohodlí a daňová administrativa."
      },
      {
        "q": "Kolik procent portfolia dát do průmyslového ETF?",
        "a": "Jako satelitní, tematickou sázku dává smysl 5 až 10 % portfolia nad rámec širokého jádra. Nezapomeňte, že industrials už tvoří zhruba 10 až 12 % každého globálního ETF (MSCI World, S&P 500), takže sektorovým fondem tuhle expozici jen zvyšujete. Nemá smysl z něj dělat základ portfolia, protože v recesi patří mezi nejhůře postižené sektory."
      }
    ]
  },
  "nejlepsi-realitni-etf": {
    "introTitle": "Realitní ETF (REITs): renta z nájmů celého světa v jedné akcii",
    "intro": [
      "Realitní ETF je akciový fond, který místo cihel kupuje akcie kotovaných realitních společností, takzvaných REITs (Real Estate Investment Trusts). REIT je burzovně obchodovaná firma, která vlastní a pronajímá reálné nemovitosti a výměnou za daňové zvýhodnění musí ze zákona rozdělit drtivou většinu zisku z nájmů akcionářům. Když si koupíte realitní ETF, nekupujete tedy budovu, ale kus nájemního cash flow ze stovek nemovitostí najednou. To je zásadní rozdíl oproti koupi investičního bytu: žádná hypotéka, žádní nájemníci, žádná údržba, zato denní kotace na burze a možnost prodat pozici během vteřiny.",
      "Klíč k pochopení realitního ETF je jeho vnitřní struktura podle typu nemovitostí. Standardní index v této kategorii, FTSE EPRA/NAREIT Developed, míchá rezidenční REITs (nájemní byty), logistiku a průmyslové haly, datacentra a telekomunikační věže, nákupní centra, kanceláře, zdravotnická zařízení i pronajímatele samoobslužných skladů. Tyto podsektory se dnes chovají velmi rozdílně: logistika a datacentra profitují z e-commerce a AI, zatímco kanceláře a klasický retail čelí strukturálnímu tlaku (práce z domova, online nákupy). Realitní ETF proto není homogenní sázka na 'nemovitosti' obecně, ale mix odvětví s protichůdnou dynamikou.",
      "Nabídku pro českého investora tvoří převážně globální fondy nad rozvinutými trhy. Objemově vede HSBC FTSE EPRA/NAREIT Developed UCITS ETF (ticker HPRO, ISIN IE00B5L01S80) s aktivy kolem 1,8 mld. USD a TER 0,24 %, doplněný širokým VanEck Global Real Estate UCITS ETF (TRET, NL0009690239, TER 0,25 %) a akumulačním Amundi FTSE EPRA NAREIT Global UCITS ETF (ISIN LU1437018838, TER 0,24 %). Ve všech těchto fondech tvoří americké REITs zpravidla 60 a více procent, doplňuje je Japonsko, Austrálie, Velká Británie a kontinentální Evropa.",
      "Pozor na terminologii: 'realitní' a 'nemovitostní' ETF jsou v češtině dvě jména pro totéž. Sledují stejné indexy (EPRA/NAREIT, Dow Jones Global Real Estate), obsahují stejné REITs a filtrují se přes stejnou kategorii Nemovitosti. Tato stránka klade důraz na strukturu REITs podle podsektorů a mechaniku 'renty z nájmů'; širší kontext a srovnání s koupí bytu najdete na sesterské stránce nemovitostních ETF, na kterou prolinkujeme, ať se obsah zbytečně nekanibalizuje."
    ],
    "verdict": [
      "Pro dlouhodobého investora, který chce reálná aktiva a dividendový příjem z nájmů, dává v této kategorii největší smysl velký globální fond nad rozvinutými trhy s nízkým TER a dostatečnou likviditou. Nejlevnějším a zároveň největším řešením je HSBC FTSE EPRA/NAREIT Developed (HPRO, IE00B5L01S80) s TER 0,24 %; kdo chce ještě širší globální záběr včetně části menších firem, sáhne po VanEck Global Real Estate (TRET, NL0009690239) s TER 0,25 %. Oba jsou distribuční a hodí se pro toho, kdo z portfolia chce čtvrtletní rentu z nájmů. Kdo naopak jen spoří a nechce průběžně danit dividendy, zvolí akumulační třídu, typicky Amundi FTSE EPRA NAREIT Global Acc (LU1437018838) nebo akumulační verzi HSBC (H4Z7, IE000G6GSP88); reinvestice pak proběhne uvnitř fondu.",
      "Chcete-li se vyhnout dolarové dominanci a vsadit spíš na evropský nájemní trh, existuje užší iShares European Property Yield (IPRP, IE00B0M63284, TER 0,40 %) nebo Xtrackers FTSE EPRA/NAREIT Developed Europe (D5BK, LU0489337690, TER 0,33 %). Počítejte ale s tím, že evropské realitní fondy byly v posledních letech tažené dolů úrokovým šokem výrazněji než globální mix a jejich roční výnos přepočtený do korun se pohyboval kolem nuly, zatímco globální fondy s americkou převahou vydělaly v korunách řádově 12 až 18 %. U indexu se držte zavedených standardů EPRA/NAREIT nebo Dow Jones Global Real Estate a vyhněte se pákovým či úzce profilovaným produktům.",
      "Redakční doporučení: protože 'realitní' a 'nemovitostní' ETF popisují identickou skupinu fondů, dává smysl obě stránky provozovat s jedním kanonickým URL (canonical na nemovitostní verzi jako obsáhlejší) nebo je sloučit s přesměrováním. Dvě téměř totožné stránky by se ve vyhledávání jen kanibalizovaly a srážely celou doménu. Konkrétní aktuální velikosti fondů a poplatky si vždy ověřte ve srovnávací tabulce níže, protože se v čase mění."
    ],
    "forWhom": "Realitní ETF se hodí pro investora, který už má jádro portfolia postavené ze širokých akciových ETF (MSCI World, S&P 500 nebo All-World) a chce ho doplnit o reálná aktiva a pravidelný dividendový příjem z nájmů, typicky v rozsahu jednotek procent portfolia. Sedne rentiérovi ve výplatní fázi, jemuž vyhovují čtvrtletní distribuce, i tomu, kdo hledá částečnou obranu proti inflaci a diverzifikaci mimo čistě technologický trh. Nehodí se jako jediná nebo hlavní investice, pro odpůrce kolísání, pro krátký horizont (sektor je cyklický a citlivý na úroky) ani pro investora, který chce jednoduché zdanění bez řešení průběžně vyplácených dividend. Zbytečné je realitní ETF přidávat i tomu, kdo si myslí, že tím kupuje 'protiklad akcií' - REITs jsou plnohodnotné akcie a v krizích padají spolu s trhem.",
    "risks": [
      "Úrokové riziko je pro REITs zásadní. Nemovitosti se financují dluhem a jejich dividendový výnos konkuruje dluhopisům, takže když centrální banky zvedají sazby, ceny REITs klesají. Roky 2022 a 2023 to ukázaly naplno: globální realitní ETF ztrácely dvouciferně navzdory relativně vysokým nájmům.",
      "Kurzové riziko vůči koruně. Index EPRA/NAREIT Developed je z 60 a více procent v amerických REITs a podklad je v dolarech, takže posílení koruny vůči dolaru vám sníží výnos v korunách i tehdy, když ceny nemovitostí nikam nespadnou. Tyto fondy zpravidla nejsou měnově zajištěné a i případný hedge by byl jen do EUR nebo USD, riziko vůči CZK neodstraní.",
      "Sektorová a podsektorová koncentrace. Jde o jediné odvětví, jehož části se navíc rozcházejí: kanceláře a klasický retail čelí strukturálnímu úpadku (home office, e-commerce), zatímco logistika a datacentra rostou. Váhu jednotlivých podsektorů v konkrétním fondu je proto dobré si prohlédnout před nákupem.",
      "Zdanění dividend. Distribuční realitní ETF vyplácejí zdanitelný příjem průběžně a REITs mají nadprůměrně vysoké dividendy, takže daňová zátěž je citelnější než u růstových fondů. Časový test na osvobození se váže výhradně k prodeji podílu ETF, na přijaté dividendy se nevztahuje - ty se v ČR daní vždy."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi realitním a nemovitostním ETF?",
        "a": "Žádný věcný. Jsou to dvě česká synonyma pro fondy investující do kotovaných REITs a realitních firem. Sledují stejné indexy (nejčastěji FTSE EPRA/NAREIT Developed nebo Dow Jones Global Real Estate) a obsahují stejné společnosti. Na této stránce zdůrazňujeme strukturu REITs podle podsektorů a mechaniku renty z nájmů; širší srovnání s koupí investičního bytu najdete na stránce nemovitostních ETF, na kterou odkazujeme."
      },
      {
        "q": "Které realitní ETF jsou největší a nejlevnější pro českého investora?",
        "a": "Objemově i nákladově vede HSBC FTSE EPRA/NAREIT Developed (HPRO, IE00B5L01S80) s aktivy kolem 1,8 mld. USD a TER 0,24 %. Podobně levné jsou VanEck Global Real Estate (TRET, NL0009690239, 0,25 %) a akumulační Amundi FTSE EPRA NAREIT Global (LU1437018838, 0,24 %). Všechny se obchodují na evropských burzách a jsou dostupné u brokerů běžných v Česku jako DEGIRO, XTB, Trading 212 nebo Interactive Brokers. Aktuální velikost a poplatky si ověřte ve srovnávací tabulce."
      },
      {
        "q": "Proč REITs vyplácejí tak vysoké dividendy?",
        "a": "REIT si daňově zvýhodněný status udrží jen tehdy, když akcionářům rozdělí drtivou většinu zisku z nájmů. Proto mají REITs a fondy z nich složené výrazně vyšší dividendový výnos než běžné akcie, obvykle v pásmu jednotek procent ročně. To je hlavní důvod, proč realitní ETF láká rentiéry - ale zároveň to znamená vyšší průběžnou daňovou zátěž z vyplácených dividend."
      },
      {
        "q": "Mám zvolit akumulační, nebo distribuční realitní ETF?",
        "a": "Pro dlouhodobé spoření bez potřeby příjmu je jednodušší akumulační třída, například Amundi FTSE EPRA NAREIT Global Acc (LU1437018838) nebo akumulační HSBC (H4Z7, IE000G6GSP88): dividendy se reinvestují uvnitř fondu a nemusíte je každoročně danit ani ručně reinvestovat. Distribuční verzi jako HSBC HPRO nebo VanEck TRET volte, pokud cíleně chcete čtvrtletní rentu z nájmů, typicky ve výplatní fázi portfolia."
      },
      {
        "q": "Jak se realitní ETF daní v Česku v roce 2026?",
        "a": "U zisku z prodeje podílu platí časový test: pokud fond držíte déle než 3 roky, je zisk osvobozen (od roku 2026 bez horního limitu), případně se uplatní hodnotový test do 100 000 Kč ročního úhrnu prodejů. Vyplacené dividendy z distribučních tříd jsou ale zdanitelný příjem vždy, i po zápočtu zahraniční srážkové daně - časový test se na ně nevztahuje. U akumulačních fondů se reinvestice uvnitř fondu v přiznání neřeší. Detaily najdete v našem daňovém rozcestníku."
      },
      {
        "q": "Proč realitní ETF klesaly, když nemovitosti v Česku i ve světě zdražovaly?",
        "a": "REITs reagují především na úrokové sazby, ne přímo na ceny bytů. Když centrální banky v letech 2022 a 2023 prudce zvedly sazby, podražilo financování nemovitostí a investoři přeceňovali REITs dolů, protože jejich dividendový výnos přestal být atraktivní vůči nově vysokému úroku z dluhopisů. Ceny fondů proto klesaly navzdory rostoucím nájmům. Je to připomínka, že kotované REITs jsou akcie citlivé na sazby, nikoli přímý ekvivalent fyzické nemovitosti."
      }
    ]
  },
  "nejlepsi-ropa-etf": {
    "introTitle": "Ropa přes ETF a ETC: proč barel v portfoliu funguje jinak než akcie ropných firem",
    "intro": [
      "Pod „ropa ETF“ se skrývají dvě úplně odlišné věci a záměna jedné za druhou je nejčastější chyba drobného investora. První skupinou jsou ETC (Exchange Traded Commodities) navázané přímo na cenu barelu ropy WTI nebo Brent – ty ale ropu fyzicky neskladují (nikdo vám nepošle sud do sklepa), místo toho drží futures kontrakty na ropu a průběžně je rolují. Druhou skupinou jsou klasické akciové ETF, které kupují akcie ropných a plynárenských firem (ExxonMobil, Shell, TotalEnergies, Chevron). Chovají se úplně jinak: firma vyplácí dividendy, roste s celým trhem a její cena nekopíruje barel jedna k jedné.",
      "Rozdíl je zásadní i právně a daňově. Akciové energetické ETF jsou standardní UCITS fondy (cenné papíry), zatímco ropné ETC jsou dluhové cenné papíry navázané na komoditní index – jiná struktura, jiný možný daňový režim. Pokud hledáte spíš sektorovou sázku na ropné firmy s dividendou, patříte do kategorie energetických ETF a tam vás prolinkujeme; tato stránka je o expozici na samotnou cenu ropy a o tom, proč je to jedna z nejtěžších komodit k dlouhodobému držení.",
      "Pro českého investora utrácejícího koruny přidejte měnovou vrstvu: ropa se globálně kotuje v amerických dolarech. I když WisdomTree WTI Crude Oil koupíte v eurech nebo librách na německé Xetře, výnos přepočtený do korun vždy ovlivní pohyb USD/CZK. Slabší dolar umí ukrojit část růstu barelu, silnější naopak výnos v korunách nafoukne. Existují EUR-hedgované varianty (třeba WisdomTree WTI Crude Oil – EUR Daily Hedged, JE00B44F1611), ale ty zajišťují maximálně vůči euru, nikoli vůči koruně – kurzové riziko CZK nesete tak jako tak."
    ],
    "verdict": [
      "Pokud opravdu chcete sázet na cenu barelu, sáhněte po největších a nejlikvidnějších ETC: WisdomTree WTI Crude Oil (ISIN GB00B15KXV33, TER 0,49 %, objem kolem 790 mil.) pro americkou ropu WTI, nebo WisdomTree Brent Crude Oil (JE00B78CGV99, TER 0,49 %, ~710 mil.) pro globální benchmark Brent. Levnější alternativou s odlišnou konstrukcí je UBS CMCI Oil (CH0109967858, TER 0,26 %), který přes index CMCI rozkládá futures do více splatností a částečně tlumí ztráty z rolování. Všechny ale řeší stejný problém – contango – takže je berte jako taktickou, ne dlouhodobou pozici.",
      "Pro většinu investorů, kteří chtějí „vydělat na ropě“ a přitom držet roky, dává mnohem větší smysl jít přes akcie ropných firem. Tam patří iShares STOXX Europe 600 Oil & Gas (EXH1, DE000A0H08M3, TER 0,47 %) s evropskými gigantami Shell a TotalEnergies, iShares S&P 500 Energy Sector (IESU, IE00B42NKQ00, TER jen 0,15 %, akumulační) pro americkou energetiku v čele s ExxonMobil a Chevron, nebo úžeji zaměřené iShares Oil & Gas Exploration & Production (SPOG, IE00B6R51Z18, TER 0,55 %) a VanEck Oil Services (V0IH, IE000NXF88S1, TER 0,35 %) na těžaře a naftové servisní firmy. Tyto fondy nesou dividendu, nemají contango a jsou to standardní UCITS ETF – detailní úhel k nim najdete v naší kategorii energetických ETF, na kterou tato stránka navazuje.",
      "Čeho se držte dál: prstům pryč od pákových a short ETC. Reálný příklad z databáze – WisdomTree WTI Crude Oil 3x Daily Short (XS2819844387) odepsal za rok přes 90 % hodnoty. Denní páka a rolování futures se skládají v neprospěch dlouhodobého držitele; jde o čistě spekulativní nástroje na dny, ne na portfolio."
    ],
    "forWhom": "Ropné ETC se hodí zkušenějšímu investorovi, který cíleně chce taktickou expozici na cenu barelu – například jako krátkodobou sázku na geopolitické napětí, inflační skok nebo omezení těžby OPEC – a rozumí tomu, že drží futures, nikoli fyzickou komoditu. Pro dlouhodobé jádro portfolia se ropný ETC nehodí: kvůli contangu a nulovému výnosu (ropa nevyplácí dividendy ani úroky) umí i při stagnující ceně barelu pomalu ztrácet hodnotu. Investorům, kteří chtějí těžit z ropy dlouhodobě a s dividendou, sedí spíš akciové energetické ETF (Oil & Gas, Energy Sector). Úplným začátečníkům, kterým jde o jeden globálně diverzifikovaný fond, do téhle niky nepatří vůbec – jednotlivé komoditní sektory jsou volatilní a koncentrované.",
    "risks": [
      "Contango a roll riziko: ropné ETC drží futures a při jejich rolování na další měsíc často nakupují dráž, než prodávají – tento „roll yield“ může být dlouhodobě záporný, takže i při stejné ceně barelu ETC pomalu ztrácí. To je hlavní důvod, proč se ropa špatně drží roky.",
      "Měnové riziko vůči koruně: ropa se kotuje v USD, výnos přepočtený do korun tedy stojí a padá i s kurzem USD/CZK. EUR-hedgované varianty (např. JE00B44F1611) zajišťují jen vůči euru, korunové riziko českému investorovi neodstraní.",
      "Extrémní volatilita a specifická rizika pákových produktů: cena ropy umí během týdnů kolísat o desítky procent (v roce 2020 se futures dokonce propadly do záporu). U pákových a short ETC (např. WisdomTree WTI Crude Oil 3x Daily Short, XS2819844387, který za rok ztratil přes 90 %) se ztráty z denní páky násobí – nejsou vhodné k držení déle než pár dní.",
      "Odlišná právní a daňová struktura: ropný ETC je dluhový cenný papír navázaný na komoditu, ne klasický fondový ETF. Uplatnění časového a hodnotového testu se u komoditních ETC nemusí posuzovat stejně jako u akciových ETF; konkrétní režim si ověřte v našem daňovém přehledu nebo u poradce, neberte osvobození automaticky."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi ropným ETF a ETF na akcie ropných firem?",
        "a": "Ropné ETC (třeba WisdomTree WTI Crude Oil, GB00B15KXV33) sledují cenu barelu přes futures kontrakty – nevyplácejí dividendy a trpí contangem při rolování. Akciové energetické ETF (třeba iShares STOXX Europe 600 Oil & Gas, EXH1) kupují akcie firem jako Shell nebo ExxonMobil – vyplácejí dividendu, rostou s trhem a cenu barelu nekopírují jedna k jedné. Pro dlouhodobé držení jsou vhodnější akciové ETF; detaily rozebíráme v kategorii energetických ETF."
      },
      {
        "q": "Co znamená contango a proč u ropy záleží?",
        "a": "Contango je situace, kdy jsou futures s pozdější splatností dražší než ta blízká. Protože ropné ETC musí kontrakty pravidelně rolovat na další měsíc, v contangu nakupují dráž, než prodávají, a tento záporný roll yield ukrajuje z výnosu i tehdy, když cena barelu stojí na místě. Právě proto může ropný ETC dlouhodobě ztrácet, i když se ropa nehne."
      },
      {
        "q": "Které ropné ETF a ETC jsou pro Čecha dostupné a od kterého brokera?",
        "a": "Nejlikvidnější čistě ropné ETC jsou WisdomTree WTI Crude Oil (GB00B15KXV33) a WisdomTree Brent Crude Oil (JE00B78CGV99), levnější je UBS CMCI Oil (CH0109967858). Z akciové větve iShares STOXX Europe 600 Oil & Gas (EXH1) nebo iShares S&P 500 Energy Sector (IESU, IE00B42NKQ00). Najdete je běžně u brokerů populárních v ČR jako DEGIRO, XTB, Trading 212 nebo Interactive Brokers, typicky na burze Xetra."
      },
      {
        "q": "Jak se v Česku daní zisk z ropného ETC?",
        "a": "Záleží na právní struktuře produktu. Ropné ETC jsou dluhové cenné papíry navázané na komoditu, ne klasické fondové ETF, takže se na ně časový test (držba nad 3 roky) ani hodnotový test (úhrn prodejů do 100 000 Kč ročně) nemusí vztahovat stejně jako u akciových ETF. Neberte osvobození automaticky – konkrétní režim si ověřte v našem daňovém přehledu nebo u daňového poradce podle své situace."
      },
      {
        "q": "Vyplatí se pákové nebo short ropné ETC?",
        "a": "Pro drobného investora zásadně ne k držení. Produkty jako WisdomTree WTI Crude Oil 3x Daily Short (XS2819844387) používají denní páku, jejíž efekt se při rolování a kolísání ceny skládá v neprospěch dlouhodobého držitele – zmíněný fond odepsal za rok přes 90 %. Jsou to čistě spekulativní nástroje na jednotky dní, ne na portfolio."
      },
      {
        "q": "Chrání ropa v portfoliu proti inflaci?",
        "a": "Ropa historicky bývá citlivá na inflaci a geopolitiku, takže krátkodobě může fungovat jako inflační sázka. Kvůli contangu, nulovému výnosu a extrémní volatilitě je ale jako dlouhodobá inflační ochrana méně spolehlivá než třeba široký komoditní koš nebo akcie. Pokud chcete stabilnější složku, zvažte diverzifikovaný komoditní ETF nebo akcie energetického sektoru s dividendou místo čisté sázky na barel."
      }
    ]
  },
  "nejlepsi-spotrebitelske-etf": {
    "introTitle": "Spotřebitelské ETF: dvě protikladné sázky pod jedním názvem",
    "intro": [
      "Pod hlavičkou „spotřebitelské ETF“ se skrývají dva sektory, které se chovají skoro opačně. Consumer Staples (základní spotřeba) jsou firmy jako Procter & Gamble, Nestlé, Coca-Cola nebo Walmart – tedy zubní pasta, jídlo, pití a drogerie, které lidé kupují i v krizi. Consumer Discretionary (cyklická spotřeba) jsou naopak firmy, na jejichž zboží se šetří jako první: Amazon, LVMH, McDonald's, Nike, Tesla. Když si vybíráte fond, musíte nejdřív vědět, do které z těchto dvou skupin vlastně sázíte – protože defenzivní staples a cyklický discretionary reagují na ekonomický cyklus zrcadlově.",
      "Klíčový rozdíl je v tom, kdy který sektor „funguje“. Základní spotřeba je klasická defenzivní pozice – v recesi klesá méně než trh, protože poptávka po jídle a hygieně je stabilní. Cyklická spotřeba je pravý opak: v expanzi a při rostoucích reálných mzdách roste rychleji než trh, protože lidé utrácejí za luxus, auta a dovolené, ale v recesi padá jako první. Nejde tedy o „jeden spotřebitelský sektor“, ale o dvě různé stavební kostky pro portfolio.",
      "V nabídce evropských UCITS fondů najdete obě varianty ve třech regionálních řezech – globální (MSCI World), americký (S&P 500 / MSCI USA) a evropský (MSCI Europe / STOXX Europe 600). Discretionary fondy jsou navíc silně koncentrované: v globálních indexech dominuje Amazon, Tesla a několik málo firem, takže sektorový fond je fakticky sázka na hrstku obřích jmen. Pro českého investora, který utrácí koruny, platí, že veškeré výnosy sledujeme přepočtené do korun a měnové riziko vůči CZK neseme vždy – většina těchto fondů je vedena v USD nebo EUR.",
      "Pozn.: tato kategorie se tematicky překrývá s naší kategorií „spotřební ETF“. Do budoucna dává smysl obě stránky sloučit do jedné a druhou přesměrovat (canonical/redirect), aby se v Googlu nekanibalizovaly – obsahově pokrývají stejný sektorový úhel."
    ],
    "verdict": [
      "Pokud chcete defenzivní jádro spotřeby, sáhněte po globální základní spotřebě. Největší a nejpřehlednější je Xtrackers MSCI World Consumer Staples 1C (ISIN IE00BM67HN09, ticker XDWS, TER 0,25 %, přes 779 mil. EUR, akumulační) – jeden fond pokrývá Procter & Gamble, Nestlé, Coca-Colu, Walmart i Costco napříč rozvinutým světem. Kdo chce čistě americkou staples expozici levněji, má iShares S&P 500 Consumer Staples (IE00B40B8R38, ICSU, TER 0,15 %, 415 mil. EUR) nebo State Street SPDR S&P U.S. Consumer Staples Select Sector (IE00BWBXM385, ZPDS, TER 0,15 %). Pro evropskou defenzivu (Nestlé, L'Oréal, Unilever) je tu iShares MSCI Europe Consumer Staples (IE00BMW42074, ESIS, TER 0,18 %, akumulační, 465 mil. EUR).",
      "Pokud naopak chcete cyklickou sázku na spotřebitelské utrácení, je referenčním fondem iShares S&P 500 Consumer Discretionary (IE00B4MCHD36, ICDU, TER 0,15 %, 741 mil. EUR, akumulační) – nejlevnější a největší v kategorii, těžce vážený na Amazon a Teslu. Globálnější řez nabízí Xtrackers MSCI World Consumer Discretionary 1C (IE00BM67HP23, XDWC, TER 0,25 %). Kdo chce pravidelnou výplatu, najde distribuční varianty jako Xtrackers MSCI USA Consumer Discretionary 1D (IE00BGQYRR35, XUCD, TER 0,12 % – nejnižší v přehledu) nebo State Street SPDR S&P U.S. Consumer Discretionary Select Sector (IE00BWBXM278, ZPDD, TER 0,15 %).",
      "Doporučení pro drtivou většinu čtenářů: spotřebitelský sektor je satelit, ne jádro. Rozumná velikost je jednotky až max. 10 % portfolia nad širokým základem (celosvětové ETF). Staples použijte, když chcete tlumit výkyvy a máte delší defenzivní záměr; discretionary jen tehdy, když vědomě sázíte na sílu spotřebitele a snesete jeho koncentraci a cykličnost. Kdo tohle rozlišovat nechce, dostane oba sektory automaticky a v tržní váze uvnitř běžného celosvětového nebo S&P 500 fondu – bez nutnosti cokoli časovat."
    ],
    "forWhom": "Spotřebitelská sektorová ETF se hodí pro pokročilejšího investora, který už má postavené široké jádro portfolia a chce ho cíleně doladit – staples pro defenzivu a nižší volatilitu, discretionary jako sázku na růst spotřeby v expanzi. Sedne také tomu, kdo má konkrétní makro názor (např. „přichází recese, chci defenzivu“ nebo „reálné mzdy rostou, vsadím na utrácení“). Nehodí se pro začátečníka, který teprve staví první portfolio – tomu lépe poslouží jeden celosvětový fond, kde jsou oba sektory zastoupeny automaticky v tržní váze. Nevhodné je i pro investora s krátkým horizontem, protože zejména discretionary umí v recesi propadnout o desítky procent, a pro každého, kdo by sektorovou koncentraci (u discretionary často přes 40 % v pár největších firmách) neustál.",
    "risks": [
      "Záměna sektorů: „spotřebitelské ETF“ pokrývá defenzivní staples i cyklický discretionary, které se chovají opačně. Koupit discretionary v očekávání „stabilní defenzivy“ je klasický omyl – před nákupem si vždy ověřte, který z obou indexů fond sleduje.",
      "Koncentrace do několika firem: discretionary indexy jsou extrémně top-heavy – v globálních variantách dominuje Amazon a Tesla, které mohou tvořit desítky procent fondu. Není to diverzifikovaná pozice, ale sázka na hrstku megacapů; propad jednoho jména stáhne celý fond.",
      "Měnové riziko vůči koruně: fondy jsou vedeny hlavně v USD (americké a globální) nebo EUR (evropské). Výnosy přepočtené do korun proto kolísají s kurzem – posílení koruny umazává zisk i u firem, které samy rostou. CZK-hedged třídy prakticky neexistují; i případné zajištění by bylo do EUR/USD, ne do CZK.",
      "Zúžení diverzifikace a sektorové cykly: jde o jeden sektor bez zajištění napříč ekonomikou. Staples zaostávají v silných býčích trzích, discretionary tvrdě padají v recesích a při slabém spotřebiteli. Bez širokého jádra je to nevyvážená pozice."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi Consumer Staples a Consumer Discretionary ETF?",
        "a": "Staples (základní spotřeba) jsou defenzivní firmy prodávající jídlo, pití a drogerii – Procter & Gamble, Nestlé, Coca-Cola, Walmart. Poptávka je stabilní i v krizi, takže fond kolísá méně než trh. Discretionary (cyklická spotřeba) jsou firmy jako Amazon, Tesla, LVMH, McDonald's nebo Nike, na jejichž zboží lidé šetří jako první – v expanzi rostou rychleji, v recesi padají nejvíc. Jsou to prakticky opačné sázky, přestože se obě řadí pod „spotřebitelské ETF“."
      },
      {
        "q": "Který konkrétní fond je pro defenzivní a který pro cyklickou sázku?",
        "a": "Pro defenzivu (staples) je referenční Xtrackers MSCI World Consumer Staples 1C (IE00BM67HN09, XDWS, TER 0,25 %) nebo levnější americký iShares S&P 500 Consumer Staples (IE00B40B8R38, ICSU, TER 0,15 %). Pro cyklickou sázku (discretionary) je největší a nejlevnější iShares S&P 500 Consumer Discretionary (IE00B4MCHD36, ICDU, TER 0,15 %), globálněji pak Xtrackers MSCI World Consumer Discretionary 1C (IE00BM67HP23, XDWC, TER 0,25 %)."
      },
      {
        "q": "Jak se tyto ETF daní v roce 2026 pro českého investora?",
        "a": "Jde o klasické akciové fondy (cenné papíry), takže platí standardní pravidla. Když podíly držíte déle než 3 roky, je zisk z prodeje díky časovému testu osvobozen – od roku 2026 bez horního limitu. Alternativně hodnotový test osvobozuje zisk, pokud úhrn vašich prodejů cenných papírů nepřekročí 100 000 Kč za rok. Dividendy z distribučních tříd (např. XUCD, ZPDD) se daní 15 %; u akumulačních fondů (XDWS, ICDU, ESIS) se reinvestice uvnitř fondu v přiznání neřeší. Nejde o daňovou radu – detaily najdete v našem daňovém hubu."
      },
      {
        "q": "Mám raději akumulační, nebo distribuční variantu?",
        "a": "U spotřebitelských fondů máte obě možnosti. Akumulační (XDWS, ICDU, ESIS) reinvestují dividendy uvnitř fondu – hodí se pro dlouhodobé budování majetku, protože se v přiznání neřeší a těží ze složeného úročení. Distribuční (XDWC, XUCD, ZPDD) vyplácejí dividendu na účet, což ocení investor v rentové fázi; počítejte ale s 15% daní z vyplacené dividendy. Pro fázi spoření je obvykle praktičtější akumulace."
      },
      {
        "q": "Proč je discretionary ETF tak koncentrované do pár firem?",
        "a": "Cyklické spotřebitelské indexy jsou vážené tržní kapitalizací a v tomto sektoru dominuje několik obřích firem. V globálních a amerických discretionary fondech tvoří Amazon a Tesla dohromady často 30–40 % portfolia. Sektorový fond je tak fakticky koncentrovaná sázka na hrstku megacapů, ne diverzifikovaná expozice – to je zásadní rozdíl oproti širokému indexu jako S&P 500 nebo MSCI World."
      },
      {
        "q": "Nese český investor u těchto fondů měnové riziko?",
        "a": "Ano, vždy. Globální a americké fondy jsou vedeny v USD, evropské v EUR, ale vy utrácíte koruny – veškeré výnosy proto sledujeme přepočtené do korun a jejich hodnota se pohybuje s kurzem. Pokud koruna posílí, umaže vám to část zisku, i když firmy ve fondu rostou. Měnově zajištěné (CZK-hedged) třídy pro tyto sektorové fondy prakticky neexistují a i běžné hedgované třídy zajišťují maximálně do EUR/USD, nikdy do CZK."
      }
    ]
  },
  "nejlepsi-stribro-etf": {
    "introTitle": "Stříbro ETC (fyzicky kryté): jak koupit „divočejšího bratra zlata\" přes burzu",
    "intro": [
      "Podobně jako u zlata platí, že „stříbrné ETF\" ve skutečnosti téměř vždy nejsou fondy, ale ETC (Exchange Traded Commodities) - burzovně obchodované cenné papíry kryté fyzickým kovem uloženým v pojištěných trezorech (typicky LBMA depozitáře v Londýně nebo Curychu). Kupujete tedy nárok na skutečné stříbrné slitky, ale obchodujete je stejně snadno jako akcii přes svého brokera. Odpadá řešení úschovy, pojištění a hlavně vysokého rozpětí u dealerů. U fyzického stříbra je navíc v ČR na rozdíl od investičního zlata běžně DPH, což ETC obchází - to je jeden z hlavních důvodů, proč drobní investoři sahají právě po něm.",
      "Zásadní odlišnost od zlata není v mechanice, ale v povaze kovu. Stříbro je z velké části průmyslová komodita - poptávku táhne fotovoltaika, elektronika a elektromobilita, ne jen investiční a šperkařská poptávka. To dělá jeho cenu výrazně volatilnější: v dobrých letech roste rychleji než zlato, v korekcích ale padá hlouběji. Tomu odpovídá i takzvaný Gold/Silver Ratio, poměr ceny zlata a stříbra, který kolísá v širokém pásmu a používá se jako orientační vodítko, zda je stříbro vůči zlatu relativně levné, či drahé. Pokud hledáte spíš klidnou pojistku portfolia, patříte pravděpodobně ke zlatu (viz naše kategorie zlaté ETF); stříbro je jeho dynamičtější, rizikovější varianta.",
      "Pro českého investora je klíčové, že se stříbro kotuje v amerických dolarech. I když ETC koupíte v eurech nebo přes korunový účet, výnos vždy ovlivní pohyb kurzu USD/CZK - slabší dolar může část růstu ceny kovu sníst, silnější naopak výnos zvýší. Existují i verze měnově zajištěné do eura (například Xtrackers Physical Silver EUR Hedged, DE000A1EK0J7), které tlumí pohyb dolaru, ovšem za vyšší náklady a bez jakéhokoli zajištění vůči koruně.",
      "Největší a nejlikvidnější fyzicky kryté produkty na stříbro dostupné z Česka jsou iShares Physical Silver ETC (SSLN, IE00B4NCWG09) s objemem kolem 2,4 mld., WisdomTree Physical Silver (PHAG, JE00B1VS3333) a nákladově velmi levné Invesco Physical Silver (SSLV, IE00B43VDT70) a WisdomTree Core Physical Silver (WSLV, JE00BQRFDY49). Všechny běžně najdete u brokerů oblíbených v ČR - DEGIRO, Trading 212, XTB nebo Interactive Brokers."
    ],
    "verdict": [
      "V kategorii fyzicky krytého stříbra jednoznačně preferujte plně alokovaná fyzická ETC (kov přiřazený k slitkům v trezoru) před syntetickými nebo pákovými produkty. Rozhoduje kombinace nákladovosti TER, velikosti fondu a domicilu. Nejnižší TER 0,19 % nabízejí Invesco Physical Silver (SSLV, IE00B43VDT70) a WisdomTree Core Physical Silver (WSLV, JE00BQRFDY49) - obojí s irským či jerseyským domicilem a slušnou velikostí kolem 720-790 mil. Pokud vám jde primárně o likviditu a co nejužší rozpětí nákup/prodej, sáhněte po největším iShares Physical Silver ETC (SSLN, IE00B4NCWG09), který má TER 0,20 % a je zdaleka nejobjemnější. Naopak dražší produkty jako WisdomTree Physical Silver (PHAG) s TER 0,49 % dnes nedávají u nové pozice velký smysl, ledaže je máte dostupné výhodně u konkrétního brokera.",
      "Otázka akumulace versus distribuce zde odpadá - stříbro nevyplácí dividendy ani úroky, veškerý výnos plyne z pohybu ceny kovu. Řešte tedy hlavně náklady, likviditu a případně měnové zajištění. Xtrackers Physical Silver EUR Hedged (XAD2, DE000A1EK0J7) tlumí pohyb dolaru vůči euru, ale má vyšší TER 0,75 % a Čechovi kurzové riziko vůči koruně stejně neodstraní; hedged verzi volte jen tehdy, když opravdu cíleně nechcete nést pohyb USD. Důrazně varujeme před pákovými produkty typu WisdomTree Silver 3x Daily Leveraged (3SIL) - jejich denní přepočet vede k dlouhodobému rozpadu hodnoty a poslední roční výnos kolem -64 % ukazuje, že to nejsou nástroje pro drž-a-zapomeň investora.",
      "Praktický výběr pro většinu: SSLV nebo WSLV jako nákladově nejlevnější fyzická volba, případně SSLN pro maximální likviditu. Stříbro přitom držte jako menšinovou, satelitní pozici - jeho volatilita se do jádra portfolia nehodí."
    ],
    "forWhom": "Fyzicky kryté stříbro se hodí investorům, kteří už mají postavené jádro portfolia z akciových a dluhopisových ETF a chtějí přidat malou satelitní pozici do reálných aktiv s vyšším potenciálem růstu než zlato - typicky v řádu jednotek procent portfolia. Sedí těm, kdo věří v průmyslovou poptávku (fotovoltaika, elektromobilita) a snesou vyšší kolísavost, případně těm, kdo sázejí na návrat Gold/Silver Ratio k historickému průměru. Naopak se nehodí pro konzervativní investory hledající klidnou pojistku (na to je vhodnější zlato), pro investory očekávající pravidelný příjem (stříbro nic nevyplácí), pro celé jádro portfolia ani pro krátkodobé spekulanty bez tolerance k tomu, že cena umí i řadu let stagnovat či prudce klesnout.",
    "risks": [
      "Vysoká volatilita: stříbro je díky velké průmyslové složce poptávky výrazně kolísavější než zlato. V korekcích padá hlouběji a rychleji - proto se hodí jen jako malá satelitní pozice, ne jako stabilizátor portfolia.",
      "Měnové riziko: stříbro se kotuje v USD, takže i při růstu ceny kovu můžete v korunách vydělat méně nebo prodělat, pokud dolar oslabí. Verze zajištěné do eura (XAD2) řeší jen riziko USD/EUR, nikoli pohyb koruny vůči euru.",
      "Riziko produktu a struktury: ETC je právně dluhový cenný papír krytý kovem, nikoli fondový ETF - u plně alokovaných fyzických produktů je krytí reálnými slitky, přesto jde o odlišnou strukturu než klasické UCITS ETF. Zcela se vyhněte pákovým (3SIL, LSIL) a short (SSIL, 3SSI) variantám - kvůli dennímu přepočtu se pro dlouhodobé držení nehodí.",
      "Odlišný daňový charakter: protože ETC je dluhový nástroj krytý komoditou, nemusí se na něj časový a hodnotový test pro osvobození zisku uplatnit stejně jako u klasických cenných papírů-fondů. Režim ověřte podle konkrétního produktu s daňovým poradcem, nespoléhejte automaticky na tříletý test."
    ],
    "faqs": [
      {
        "q": "Je stříbrné ETF vlastně ETF, nebo ETC?",
        "a": "Téměř vždy jde technicky o ETC (Exchange Traded Commodity), nikoli o klasický fondový ETF. ETC je dluhový cenný papír krytý fyzickým stříbrem v trezoru. Pro investora se obchoduje stejně snadno jako akcie či ETF přes burzu, liší se ale právní strukturou a v některých případech i daňovým režimem."
      },
      {
        "q": "Proč zvolit stříbro místo zlata, nebo vedle něj?",
        "a": "Stříbro má vyšší růstový potenciál díky průmyslové poptávce (fotovoltaika, elektronika, elektromobilita), ale platíte za to výrazně vyšší kolísavostí - v korekcích padá hlouběji než zlato. Mnozí investoři drží obojí: zlato jako klidnou pojistku a stříbro jako menší, dynamičtější sázku. Orientačně sledují Gold/Silver Ratio, poměr cen obou kovů. Podrobněji viz naše kategorie zlaté ETF."
      },
      {
        "q": "Které stříbrné ETC jsou nejlevnější a nejdostupnější v Česku?",
        "a": "Nákladově nejlevnější jsou Invesco Physical Silver (SSLV, IE00B43VDT70) a WisdomTree Core Physical Silver (WSLV, JE00BQRFDY49) s TER 0,19 %. Největší a nejlikvidnější je iShares Physical Silver ETC (SSLN, IE00B4NCWG09) s TER 0,20 %. Všechny najdete u brokerů populárních v ČR jako DEGIRO, Trading 212, XTB nebo Interactive Brokers."
      },
      {
        "q": "Mám volit stříbrné ETC zajištěné do eura?",
        "a": "Měnově zajištěná verze (například Xtrackers Physical Silver EUR Hedged, XAD2, DE000A1EK0J7) tlumí pohyb kurzu USD/EUR, ale za vyšší náklady (TER 0,75 %) a nezajistí vás vůči koruně. Zajištění stojí na úrokovém diferenciálu mezi měnami a Čechovi CZK riziko neodstraní. Pro dlouhodobou pozici řada investorů volí nezajištěnou, levnější variantu."
      },
      {
        "q": "Jsou pákové stříbrné produkty jako WisdomTree 3x vhodné k držení?",
        "a": "Ne pro dlouhodobé investování. Pákové (3SIL, LSIL) a short (SSIL, 3SSI) produkty se přepočítávají denně, takže při kolísavém trhu se jejich hodnota v čase rozpadá bez ohledu na směr kovu. Ukázkově to dokládá roční výkonnost WisdomTree Silver 3x Daily Leveraged kolem -64 %. Jsou to nástroje pro krátkodobou spekulaci, ne pro portfolio."
      },
      {
        "q": "Jak se v Česku daní zisk ze stříbrného ETC?",
        "a": "Protože ETC je dluhový cenný papír krytý komoditou, nikoli klasický fondový ETF, nemusí se na něj časový test (držení nad 3 roky) a hodnotový test (úhrn prodejů do 100 000 Kč ročně) vztahovat stejně jako u běžných akciových či dluhopisových ETF. Situace se navíc může lišit podle konkrétního produktu. Doporučujeme ověřit aktuální režim v našem daňovém přehledu a s daňovým poradcem podle vaší situace."
      }
    ]
  },
  "nejlepsi-vladni-dluhopisy-etf": {
    "introTitle": "Vládní dluhopisové ETF: nejbezpečnější část portfolia a jak jí rozumět v roce 2026",
    "intro": [
      "Vládní (státní) dluhopisové ETF drží dluhopisy vydané státy – typicky americkým Treasury, německým Bundem nebo košem států eurozóny. Kupujete tím pohledávku za vládou, ne za firmou, takže kreditní riziko je minimální (u USA a Německa prakticky nulové). Přesně tím se tato kategorie liší od korporátních dluhopisových ETF, kde nesete riziko bankrotu emitenta, i od high-yield fondů s junk dluhopisy. Tady je hlavní téma jiné: úrokové (durační) riziko a měna.",
      "Klíč k pochopení státních bondů je durace – citlivost ceny na změnu úrokových sazeb. Když sazby rostou, cena starších dluhopisů klesá, a čím delší splatnost, tím prudší pohyb. To krásně ukázala data za poslední rok: krátký americký Treasury fond iShares USD Treasury Bond 0-1yr (ISIN IE00BGSF1X88) přinesl v korunách zhruba +5 %, zatímco dlouhý iShares USD Treasury Bond 20+yr (ISIN IE00BFM6TC58) skončil kolem -2,5 %. Stejný typ aktiva, stejný dlužník (USA), diametrálně jiný výsledek – rozdíl dělala durace a pohyb dolaru.",
      "V prostředí roku 2026, kdy centrální banky po letech zvyšování drží sazby relativně vysoko a trh spekuluje o jejich snižování, jsou státní dluhopisy zpět ve hře. Krátké splatnosti nabízejí slušný výnos při nízké volatilitě (fungují skoro jako lepší spořák v cizí měně), dlouhé jsou sázka na pokles sazeb – když k němu dojde, ceny dlouhých bondů vyletí, když ne, bolí to. Nejde tedy o jednu homogenní kategorii, ale o škálu od 'skoro hotovost' po 'agresivní úroková sázka'.",
      "Pro českého investora je navíc zásadní měnová vrstva. Většina velkých státních fondů je denominovaná v USD (Treasury) nebo EUR (eurozóna) a vy je nakupujete za koruny. Výnosy si tak vždy přepočítáváte do korun a nesete kurzové riziko vůči CZK – i u fondů, které nesou v názvu 'Hedged'. To zajištění totiž funguje maximálně do EUR nebo USD, ne do koruny."
    ],
    "verdict": [
      "Pro konzervativní parkování peněz nebo defenzivní složku portfolia v USD dávají smysl krátké americké Treasury fondy: iShares USD Treasury Bond 0-1yr (IE00BGSF1X88, TER 0,07 %, přes 16 mld. EUR, akumulační) a iShares USD Treasury Bond 1-3yr (IE00BYXPSP02, TER 0,07 %). Za rok přidaly v korunách zhruba 4–5 % při minimální kolísavosti ceny dluhopisů – jejich hlavní riziko je pohyb dolaru vůči koruně, ne úroková citlivost. Ještě levnější variantou na americký krátký konec je Vanguard U.S. Treasury 0-1 Year Bond (IE00BLRPPV00, TER 0,05 %).",
      "Kdo chce klasickou eurozónovou expozici bez dolaru, sáhne po Vanguard EUR Eurozone Government Bond (akumulační IE00BH04GL39, TER 0,07 %) nebo iShares Core Euro Government Bond (distribuční IE00B4WXJJ64, TER 0,07 %) – oba drží mix států eurozóny napříč splatnostmi. Za poslední rok byly kolem -1 % v korunách, protože delší durace a stabilnější euro nedaly prostor pro růst, ale jde o levné, robustní jádro dluhopisové části. Kdo chce cíleně krátkou euro duraci, má Xtrackers Eurozone Government Bond 1-3 (LU0290356871, TER 0,10 %) nebo Amundi Euro Government Bond 1-3Y (LU1650487413).",
      "Pro odvážnější sázku na pokles sazeb je tu dlouhý konec: iShares USD Treasury Bond 20+yr (IE00BFM6TC58, TER 0,07 %) nebo středně dlouhý iShares USD Treasury Bond 3-7yr (IE00B3VWN393). Tyto fondy mohou při snížení sazeb vydělat dvojciferně, ale stejně tak spadnout – nejsou to 'bezpečné' fondy v intuitivním smyslu, jsou to nástroje na úrokovou spekulaci. Kdo chce dolarový výnos bez dolarového rizika, může zvážit EUR hedged třídy jako iShares $ Treasury Bond 7-10yr EUR Hedged (IE00BGPP6697) – ale i tak zůstává vystaven riziku EUR/CZK. Detaily každého fondu (durace, geografie, měna) si vždy ověřte na jeho stránce a porovnejte přes srovnávač."
    ],
    "forWhom": "Vládní dluhopisové ETF se hodí pro investora, který chce ke svému akciovému jádru přidat stabilizační, méně volatilní složku, nebo pro konzervativnějšího spořitele hledajícího vyšší výnos než na běžném účtu (typicky přes krátké Treasury fondy). Sedne také člověku v předdůchodové či rentové fázi, kdo snižuje podíl akcií. Krátké splatnosti jsou pro každého, kdo chce nízkou kolísavost; dlouhé splatnosti jen pro toho, kdo vědomě spekuluje na pokles sazeb a snese, že hodnota fondu může na roky spadnout. Nehodí se jako jediná pozice pro mladého investora s dlouhým horizontem, který chce hlavně růst (tomu lépe poslouží akciové ETF), ani pro nikoho, kdo mylně čeká, že 'dluhopisy nemohou klesat' – rok 2022 i dlouhé fondy v roce 2025 ukázaly opak. Kdo nechce řešit měnu, musí počítat s tím, že bez CZK-hedge tu čisté zajištění koruny prakticky neexistuje.",
    "risks": [
      "Úrokové (durační) riziko: při růstu sazeb cena dluhopisů klesá, a to tím víc, čím delší je splatnost. Dlouhé fondy jako iShares USD Treasury 20+yr (IE00BFM6TC58) mohou během roku spadnout o desetiny procent i o dvojcifernou hodnotu – nejsou to bezpečné fondy v intuitivním smyslu, ale sázka na směr sazeb.",
      "Měnové riziko vůči koruně: většina fondů je v USD nebo EUR. Posílení koruny sníží výnos přepočítaný do CZK, i když dluhopisy samotné rostou. U dolarových Treasury fondů bývá pohyb EUR/USD i USD/CZK často větším faktorem než samotný úrokový výnos.",
      "Zavádějící 'Hedged' třídy: fond označený EUR Hedged či USD Hedged zajišťuje jen do eura nebo dolaru, ne do koruny. Český investor tak dál nese CZK riziko a navíc platí za zajištění, které stojí na úrokovém diferenciálu mezi měnami.",
      "Nesprávné očekávání růstu: státní dluhopisy dlouhodobě vynášejí méně než akcie a v období růstu sazeb i nominalně prodělaly (2022). Slouží ke stabilitě a diverzifikaci, ne k dlouhodobému bohatnutí – kdo čeká akciový výnos, bude zklamaný."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi vládními a korporátními dluhopisovými ETF?",
        "a": "Vládní fondy drží dluhopisy států (USA, Německo, eurozóna) s minimálním rizikem nesplácení – hlavní riziko je úrokové a měnové. Korporátní fondy drží firemní dluhopisy, kde navíc nesete kreditní (kreditní spread) riziko, ale za to dostáváte vyšší výnos. Nejrizikovější jsou high-yield (junk) fondy. Pro nejbezpečnější defenzivní složku volíte státní, ideálně krátké splatnosti."
      },
      {
        "q": "Mám koupit krátké, nebo dlouhé státní dluhopisy?",
        "a": "Záleží na cíli. Krátké (0–3 roky, např. iShares USD Treasury 0-1yr IE00BGSF1X88) mají nízkou kolísavost a chovají se jako lepší spořák v cizí měně – vhodné na parkování peněz a stabilitu. Dlouhé (10+ let, např. iShares USD Treasury 20+yr IE00BFM6TC58) jsou sázka na pokles sazeb: při snižování mohou vydělat dvojciferně, ale i prudě spadnout. Začátečníkům a konzervativním investorům obvykle lépe slouží krátký konec."
      },
      {
        "q": "Zbaví mě hedgovaný (zajištěný) fond měnového rizika vůči koruně?",
        "a": "Ne. Třídy označené EUR Hedged nebo USD Hedged zajišťují pouze do eura nebo dolaru, ne do koruny. Jako český investor nakupující za CZK nesete kurzové riziko vůči koruně vždy. Hedgované třídy navíc stále nesou náklady zajištění odvíjející se od úrokového diferenciálu mezi měnami. Fond zajištěný přímo do CZK v této nabídce prakticky nenajdete."
      },
      {
        "q": "Jak se daní zisk z vládních dluhopisových ETF v Česku (2026)?",
        "a": "Státní dluhopisové ETF jsou cenné papíry-fondy, platí pro ně standardní pravidla. Časový test: při držení nad 3 roky je zisk z prodeje osvobozen (od 2026 bez horního limitu). Hodnotový test: úhrn prodejů do 100 000 Kč ročně je osvobozen. U distribučních tříd (např. iShares Core Euro Government Bond IE00B4WXJJ64) se vyplácené kupony daní jako příjem sazbou 15 %; u akumulačních tříd se reinvestice uvnitř fondu v přiznání neřeší. Podrobnosti vždy ověřte v daňovém hubu."
      },
      {
        "q": "Akumulační, nebo distribuční varianta státního dluhopisového ETF?",
        "a": "Akumulační (např. Vanguard EUR Eurozone Government Bond IE00BH04GL39) reinvestuje kupony uvnitř fondu – jednodušší na správu a bez každoročního danění dividend. Distribuční (iShares Core Euro Government Bond IE00B4WXJJ64) vyplácí kupony na účet, což ocení někdo v rentové fázi, ale vyplácené výnosy pak daníte 15 %. Pro dlouhodobé budování bývá daňově i administrativně jednodušší akumulační třída."
      },
      {
        "q": "Proč byly některé státní dluhopisové fondy za poslední rok v mínusu, když jde o 'bezpečné' aktivum?",
        "a": "Bezpečnost státních dluhopisů se týká kreditního rizika (stát skoro jistě zaplatí), ne kolísavosti ceny. Eurozónové fondy jako Vanguard EUR Eurozone Government Bond (IE00BH04GL39) skončily kolem -1 % v korunách kvůli kombinaci úrokového pohybu a kurzu EUR/CZK. Naopak krátké dolarové Treasury fondy přidaly kolem 4–5 %. Rozdíl dělala durace a měna, ne bonita dlužníka."
      }
    ]
  },
};

/** Vrátí redakční obsah kategorie, nebo null (šablona pak použije jen data). */
export function getCategoryContent(slug: string): CategoryContent | null {
  return categoryContent[slug] ?? null;
}
