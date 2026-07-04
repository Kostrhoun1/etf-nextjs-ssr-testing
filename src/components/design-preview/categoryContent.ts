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
};

/** Vrátí redakční obsah kategorie, nebo null (šablona pak použije jen data). */
export function getCategoryContent(slug: string): CategoryContent | null {
  return categoryContent[slug] ?? null;
}
