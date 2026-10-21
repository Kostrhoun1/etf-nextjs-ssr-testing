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
      "S&P 500 sdružuje zhruba 500 velkých veřejně obchodovaných firem z USA a pokrývá přibližně 80 % investovatelné tržní kapitalizace amerického akciového trhu. Je vážený podle tržní kapitalizace, takže největší firmy mají v indexu největší váhu.",
      "ETF na tento index patří k největším a nejlikvidnějším fondům v Evropě. Fondy se stejným indexem se liší hlavně poplatkem, velikostí, nakládáním s dividendami a domicilem; aktuální hodnoty jsou v tabulce výše."
    ],
    "verdict": [
      "Fondy na S&P 500 drží stejné firmy, liší se hlavně poplatkem (TER), velikostí, tím, zda dividendy reinvestují (akumulační), nebo vyplácejí (distribuční), domicilem a způsobem replikace (fyzická, nebo swap). Irský domicil snižuje srážkovou daň z amerických dividend uvnitř fondu na 15 %. Rozdíly v nákladech mezi největšími fondy jsou malé; v praxi rozhoduje i to, které fondy nabízí váš broker a v jaké měně se obchodují."
    ],
    "forWhom": "S&P 500 ETF drží jen americké velké firmy. Investoři je používají hlavně k dlouhodobé investici do akcií USA; kdo chce i Evropu, Japonsko nebo rozvíjející se trhy, kombinuje je s dalšími fondy, nebo volí celosvětový index. Jde o čistě akciové riziko – na krátký horizont se kvůli propadům 30–55 % v krizích nehodí.",
    "risks": [
      "Koncentrace do USA a největších firem: pohyb několika největších titulů se výrazně promítá do celého indexu.",
      "Měnové riziko USD/CZK: podkladové akcie jsou v dolarech, výnos v korunách proto ovlivňuje kurz USD/CZK. Třídy „EUR Hedged“ zajišťují jen do eura, ne do koruny.",
      "Akciové riziko: v letech 2007–2009 index klesl o více než polovinu; propady o desítky procent se v historii opakovaly."
    ],
    "faqs": [
      {
        "q": "Který S&P 500 ETF je nejlevnější?",
        "a": "Nejnižší TER u S&P 500 ETF se pohybuje kolem 0,03 % ročně. Aktuální pořadí podle nákladovosti najdete v žebříčku „Nejlevnější (TER)\“ na této stránce."
      },
      {
        "q": "Je lepší akumulační, nebo distribuční S&P 500 ETF?",
        "a": "Akumulační fond dividendy reinvestuje uvnitř fondu, takže se v průběhu držení nedaní ani ručně nereinvestují. Distribuční fond je vyplácí na účet; vyplacené dividendy se v ČR daní 15 %."
      },
      {
        "q": "Jak se v ČR daní zisk z S&P 500 ETF?",
        "a": "Zisk z prodeje je po splnění tříletého časového testu osvobozen od daně (od roku 2026 bez horního limitu). Dividendy z distribučních fondů se v ČR daní 15 % a časový test se na ně nevztahuje."
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
      "AI ETF jsou tematické akciové fondy zaměřené na firmy, které vydělávají na umělé inteligenci, zpracování velkých dat, robotice a automatizaci. Nejde o samostatnou třídu aktiv, ale o výřez z technologického a průmyslového sektoru. Podle indexu v nich bývají výrobci čipů a AI hardwaru (např. NVIDIA, AMD, TSMC, Broadcom), softwarové a cloudové firmy (Microsoft, Alphabet, Meta) a u některých fondů i průmyslová automatizace (ABB, Keyence, Fanuc). Řada těchto firem patří i k největším pozicím širokých světových a technologických ETF.",
      "Fondy v kategorii se liší hlavně tím, jak index „AI firmu“ definuje. Xtrackers Artificial Intelligence & Big Data (IE00BGV5VN51) a L&G Artificial Intelligence (IE00BK5BCD43) míří na AI, software a data, iShares Automation & Robotics (IE00BYZK4552) víc na automatizaci a robotiku napříč sektory. Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "Fondy jsou vedené v USD nebo EUR a drží převážně zahraniční, hlavně americké akcie, takže výnos v korunách ovlivňuje i kurz koruny. V korunách se AI ETF neobchodují; nákup za koruny znamená měnovou konverzi u brokera."
    ],
    "verdict": [
      "Index a definice tématu: dva AI ETF mohou mít výrazně odlišné složení. Z prvních deseti pozic je vidět, jak úzce fond téma pokrývá a jak moc se překrývá se světovým nebo technologickým ETF.",
      "Poplatek a velikost: TER tematických AI fondů je vyšší než u širokých indexových ETF. Větší fond mívá užší rozpětí nákup/prodej a nižší riziko zrušení. Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "Třída a domicil: akumulační třída dividendy reinvestuje, distribuční je vyplácí. Irský domicil (ISIN začíná IE) snižuje díky smlouvě s USA srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 %."
    ],
    "forWhom": "Investoři AI ETF obvykle používají jako menší tematický doplněk k širokému akciovému fondu, kterým zvyšují váhu firem spojených s umělou inteligencí. Velká část těchto firem je přitom už v indexech MSCI World a S&P 500. Tematické fondy kolísají výrazně víc než široký trh.",
    "risks": [
      "Koncentrace a překryv s jinými fondy: AI ETF drží menší počet firem a horní pozice tvoří velkou část fondu. Tytéž akcie (NVIDIA, Microsoft, Alphabet) bývají i mezi největšími pozicemi světových a technologických ETF, takže se expozice na ně sčítá.",
      "Vysoká očekávání v cenách: ceny AI akcií v posledních letech rychle rostly a zahrnují očekávání budoucího růstu. Pokud se nenaplní, tematické fondy mohou klesat prudčeji než široký trh a zotavovat se dlouho.",
      "Vyšší poplatky a měnové riziko: TER AI fondů je vyšší než u širokých indexových ETF. Výnos v korunách navíc ovlivňuje kurz dolaru vůči koruně.",
      "Různé definice tématu: jednotná definice „AI firmy“ neexistuje. Poskytovatelé indexů pravidla mění a fondy se periodicky přeskupují, takže dva AI ETF s podobným názvem mohou mít velmi odlišné složení."
    ],
    "faqs": [
      {
        "q": "Jaké jsou největší AI ETF dostupné pro českého investora?",
        "a": "Pořadí podle velikosti se mění, proto ho v textu neuvádíme – aktuální velikosti a poplatky jsou v tabulce výše (řazení „Největší“, „Nejlevnější“). K zavedeným fondům kategorie patří Xtrackers Artificial Intelligence & Big Data (IE00BGV5VN51), iShares Automation & Robotics (IE00BYZK4552) a L&G Artificial Intelligence (IE00BK5BCD43). Obchodují se na evropských burzách."
      },
      {
        "q": "Nemám AI akcie už ve svém světovém ETF?",
        "a": "Nejspíš ano. NVIDIA, Microsoft, Alphabet, Meta i Broadcom patří k největším pozicím indexů MSCI World i S&P 500, takže velkou část AI firem drží i široké fondy. AI ETF jejich váhu zvyšuje a přidává menší specializované firmy."
      },
      {
        "q": "Mám vybrat akumulační, nebo distribuční AI ETF?",
        "a": "Akumulační třída dividendy reinvestuje uvnitř fondu, takže se průběžně nic nedaní. Distribuční třída je vyplácí na účet a vyplacené dividendy se v ČR daní 15 %. U AI fondů je dividendový výnos obvykle nízký a hlavní roli hraje změna ceny akcií."
      },
      {
        "q": "Jak se AI ETF daní v Česku?",
        "a": "Zisk z prodeje je v ČR osvobozen, pokud fond držíte déle než 3 roky (časový test), nebo pokud úhrn příjmů z prodeje cenných papírů za rok nepřesáhne 100 000 Kč (hodnotový test); od roku 2026 bez horního limitu. Jinak se zisk daní jako ostatní příjem. Vyplacené dividendy distribučních tříd se daní 15 %; akumulační třída nic nevyplácí. Text není daňové poradenství."
      },
      {
        "q": "Kolik portfolia je rozumné dát do AI ETF?",
        "a": "Univerzální podíl neexistuje a srovnávač ho neurčuje. Čím větší podíl jednoho úzkého tématu, tím víc výsledek celého portfolia závisí na několika firmách a jednom odvětví. AI ETF navíc z velké části drží firmy, které už jsou v širokých světových indexech."
      },
      {
        "q": "Proč mají AI ETF vyšší poplatky než světové ETF?",
        "a": "TER AI fondů je vyšší než u širokých indexových ETF (aktuální hodnoty jsou v tabulce výše). Tematické fondy mají specializovanou konstrukci indexu, častěji se přeskupují a spravují menší objem peněz, což zvyšuje náklady. Vyšší poplatek neznamená vyšší výnos."
      }
    ]
  },
  "nejlepsi-americke-etf": {
    "introTitle": "Americké ETF: expozice k největší ekonomice světa",
    "intro": [
      "Americké ETF sledují akciový trh Spojených států, který tvoří většinu celosvětových akciových indexů. Největší váhu v nich mají technologické firmy jako Apple, Microsoft, Nvidia, Amazon nebo Alphabet. Nejčastějšími indexy jsou S&P 500 (500 velkých amerických firem) a MSCI USA, který zahrnuje velké a střední firmy a pokrývá zhruba 85 % volně obchodovatelné tržní kapitalizace USA.",
      "V tabulce jsou fondy v evropské podobě UCITS, většinou s domicilem v Irsku (ISIN začíná na IE). Smlouva o zamezení dvojího zdanění mezi Irskem a USA snižuje srážkovou daň z amerických dividend na úrovni fondu z 30 % na 15 %.",
      "Na index MSCI USA a jeho varianty jsou v tabulce mimo jiné iShares MSCI USA Screened (IE00BFNM3G45), Xtrackers MSCI USA (IE00BJ0KDR00) a Invesco MSCI USA (IE00B60SX170, syntetická replikace). Aktuální poplatky a velikosti fondů jsou v tabulce výše."
    ],
    "verdict": [
      "Index: S&P 500 a MSCI USA se z velké části překrývají, MSCI USA navíc zahrnuje část středních firem. Varianty Screened a ESG vylučují vybrané obory (například zbraně nebo tabák), takže se jejich složení od základního indexu mírně liší.",
      "Třída podílů a konstrukce: akumulační třída dividendy reinvestuje uvnitř fondu, distribuční je vyplácí a vyplacené dividendy se v ČR daní 15 %. Fondy se dále liší poplatkem (TER), velikostí a replikací – fyzickou, nebo syntetickou přes swap. Aktuální hodnoty jsou v tabulce výše."
    ],
    "forWhom": "Investoři americká ETF používají jako hlavní akciovou složku portfolia, nebo jako regionální část vedle fondů na Evropu a rozvíjející se trhy. Celosvětové fondy (MSCI World, FTSE All-World) obsahují USA také, spolu s ostatními trhy.",
    "risks": [
      "Koncentrace do několika technologických firem: největší tituly mají v S&P 500 i MSCI USA vysoký podíl, takže pokles technologického sektoru se do výsledku fondu výrazně promítne.",
      "Měnové riziko USD/CZK: fondy drží aktiva v dolarech. Posílení koruny vůči dolaru snižuje výnos v korunách i tehdy, když index roste. Třídy zajištěné do koruny v přehledu nejsou.",
      "Jeden region: čistě americký fond neobsahuje Evropu, Japonsko ani rozvíjející se trhy. V obdobích, kdy USA zaostávají za zbytkem světa, se to projeví na výsledku celého fondu.",
      "Vyšší ocenění trhu: americké akcie se obchodují za vyšší násobky zisků než většina ostatních regionů, což zvyšuje citlivost na zklamání z hospodářských výsledků."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi ETF na MSCI USA a na S&P 500?",
        "a": "S&P 500 sleduje 500 velkých amerických firem. MSCI USA pokrývá velké a střední firmy, zhruba 85 % volně obchodovatelné tržní kapitalizace USA. Oba indexy se z velké části překrývají a jejich výkonnost bývá podobná; S&P 500 je nejznámější americký benchmark."
      },
      {
        "q": "Které americké ETF má nejnižší poplatky?",
        "a": "Poplatky největších fondů na S&P 500 a MSCI USA jsou v řádu setin procenta ročně a patří k nejnižším na trhu. Pořadí se mění se snižováním poplatků jednotlivými emitenty, aktuální TER všech fondů je proto v tabulce výše."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční variantu?",
        "a": "Akumulační fond dividendy reinvestuje uvnitř fondu, takže investorovi nevzniká dividendový příjem, který by musel uvádět v přiznání. Distribuční fond dividendy pravidelně vyplácí a v ČR se daní 15 %. Rozdíl je tedy v tom, zda investor chce průběžný příjem, index i složení jsou u obou tříd stejné."
      },
      {
        "q": "Jak se americké ETF daní pro českého investora?",
        "a": "Zisk z prodeje je osvobozen po splnění časového testu (držba déle než 3 roky, od roku 2026 bez horního limitu) nebo hodnotového testu (příjmy z prodeje cenných papírů do 100 000 Kč za rok). Srážkovou daň z amerických dividend řeší irský fond na své úrovni. Dividendy vyplacené distribuční třídou se daní 15 %. Nejde o daňové poradenství."
      },
      {
        "q": "Je lepší americké ETF, nebo rovnou celosvětové?",
        "a": "Celosvětové ETF (MSCI World nebo FTSE All-World) obsahuje vedle USA i další vyspělé, případně rozvíjející se trhy, USA v něm ale tvoří většinu. Čistě americké ETF obsahuje jen USA. Investoři americké fondy používají, když chtějí váhu USA zvýšit, nebo když skládají portfolio z regionálních fondů."
      },
      {
        "q": "Co znamená Screened verze amerického ETF?",
        "a": "Screened (nebo ESG) verze vylučují ze složení firmy z kontroverzních oblastí, typicky výrobce zbraní nebo tabáku, a firmy porušující určité normy. Složení se proto mírně liší od základního indexu MSCI USA. Přesná pravidla vyloučení popisuje metodika indexu."
      }
    ]
  },
  "nejlepsi-asijsko-pacificke-etf": {
    "introTitle": "Asijsko-pacifické ETF: rozvinutá Asie a Pacifik mimo Japonsko",
    "intro": [
      "Asijsko-pacifická ETF pokrývají rozvinuté trhy Asie a Pacifiku, téměř vždy bez Japonska (v názvu „ex Japan“), které indexoví poskytovatelé vedou jako samostatný trh. Pevninská Čína, Tchaj-wan ani Indie v nich nejsou – MSCI i FTSE je řadí mezi rozvíjející se trhy.",
      "V kategorii se potkávají dvě rodiny indexů s velmi odlišným složením. MSCI Pacific ex Japan drží 88 firem ze čtyř zemí; podle factsheetu MSCI k 30. 9. 2026 připadalo 62 % indexu na Austrálii, zbytek na Singapur, Hongkong a Nový Zéland a 46 % na finanční sektor. FTSE Developed Asia Pacific ex Japan je širší (kolem 350 titulů) a zahrnuje i Jižní Koreu, kterou FTSE na rozdíl od MSCI řadí mezi vyspělé trhy. Podle factsheetu Vanguardu k 30. 9. 2026 tvořila Korea zhruba polovinu tohoto indexu a největší pozice Samsung Electronics a SK hynix dohromady zhruba třetinu.",
      "Fondy jsou vedené v USD nebo EUR, podkladové akcie se ale obchodují v australských, hongkongských a singapurských dolarech či korejských wonech. Výnos v korunách proto ovlivňuje několik měnových kurzů najednou."
    ],
    "verdict": [
      "Rozhodující je index. MSCI Pacific ex Japan je hlavně Austrálie, banky a těžaři surovin; FTSE Developed Asia Pacific ex Japan má díky Koreji velkou váhu polovodičů. Dva fondy „na Pacifik“ tak mohou mít velmi odlišný výnos i riziko.",
      "Dále se fondy liší poplatkem (TER), velikostí a zacházením s dividendami: akumulační třída je reinvestuje, distribuční je vyplácí. Varianty s ESG filtrem mají jiné složení než mateřský index. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají hlavně k doplnění globálního nebo amerického fondu o rozvinutý Pacifik, případně vedle samostatného japonského fondu, se kterým se fond ex Japan nepřekrývá. Kvůli malému počtu zemí a velké váze jedné až dvou z nich jde o regionální doplněk, ne o široce rozložené portfolio.",
    "risks": [
      "Koncentrace do jedné či dvou zemí: v indexu MSCI Pacific ex Japan tvořila Austrálie k 30. 9. 2026 zhruba 62 %, v indexu FTSE Developed Asia Pacific ex Japan Korea zhruba polovinu. Výnos fondu tak silně závisí na jedné ekonomice.",
      "Sektorové vychýlení: MSCI varianta je ze 46 % finanční sektor a další velkou část tvoří těžba surovin, takže reaguje na úrokové sazby a ceny komodit. FTSE varianta je výrazně navázaná na polovodiče (Samsung Electronics, SK hynix).",
      "Vícevrstevné měnové riziko: fond je v USD nebo EUR, akcie v AUD, HKD, SGD či KRW. Pohyb každé z těchto měn vůči koruně mění výnos v Kč nezávisle na cenách akcií.",
      "Bez Japonska a pevninské Číny: pod pojmem Asie tu nejsou japonské ani čínské firmy. Čínské společnosti kotované v Hongkongu (např. Tencent) indexy počítají do Číny, tedy do rozvíjejících se trhů."
    ],
    "faqs": [
      {
        "q": "Proč asijsko-pacifická ETF skoro vždy vynechávají Japonsko?",
        "a": "Japonsko je největší rozvinutý trh regionu a MSCI i FTSE ho vedou jako samostatný celek. Fondy ex Japan se proto často kombinují se samostatným japonským fondem, u kterého lze váhu Japonska nastavit zvlášť. Fondy na celý Pacifik včetně Japonska existují také."
      },
      {
        "q": "Jaký je rozdíl mezi MSCI Pacific ex Japan a FTSE Developed Asia Pacific ex Japan?",
        "a": "MSCI Pacific ex Japan obsahuje 88 firem ze čtyř zemí (Austrálie, Singapur, Hongkong, Nový Zéland); Austrálie měla k 30. 9. 2026 váhu 62 %. FTSE Developed Asia Pacific ex Japan má kolem 350 titulů a navíc Jižní Koreu, kterou MSCI řadí mezi rozvíjející se trhy. Korea tvořila k 30. 9. 2026 zhruba polovinu indexu FTSE, takže v něm mají velkou váhu polovodičové firmy Samsung Electronics a SK hynix."
      },
      {
        "q": "Kolik je v těchto fondech vlastně Číny?",
        "a": "Přímo pevninská Čína v rozvinutých asijsko-pacifických indexech není, protože ji MSCI i FTSE řadí mezi rozvíjející se trhy. Do Číny indexy počítají i čínské firmy kotované v Hongkongu, jako je Tencent nebo Alibaba. Nepřímá vazba na Čínu vede přes hongkongské firmy s tržbami v Číně a přes australské těžaře, pro které je Čína velkým odběratelem surovin. Cílenou čínskou expozici nabízejí čínské a emerging markets fondy."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční variantu?",
        "a": "Akumulační (Acc) třída dividendy reinvestuje uvnitř fondu a průběžně se nedaní. Distribuční třída je vyplácí na účet a v ČR se vyplacené dividendy daní 15 %. V tomto regionu to hraje roli, protože australské a singapurské banky vyplácejí relativně vysoké dividendy."
      },
      {
        "q": "Jak se asijsko-pacifická ETF daní v Česku?",
        "a": "U evropských UCITS ETF platí český daňový režim. Zisk z prodeje je osvobozen od daně, pokud podíly držíte déle než 3 roky (časový test, od roku 2026 bez horního limitu), případně pokud příjem z prodejů cenných papírů za rok nepřesáhne 100 000 Kč. U distribučních fondů se přijaté dividendy daní sazbou 15 %. U akumulačních fondů se dividendy nevyplácejí, takže je průběžně nedaníte."
      },
      {
        "q": "Jak velké je u těchto fondů kurzové riziko vůči koruně?",
        "a": "Vícevrstevné. Fond bývá veden v USD nebo EUR, ale podkladové akcie jsou v australských, hongkongských a singapurských dolarech nebo korejských wonech. Pohyb koruny vůči těmto měnám ovlivní výnos v korunách nezávisle na tom, jak si vedou samotné akcie."
      }
    ]
  },
  "nejlepsi-biotechnologie-etf": {
    "introTitle": "Co jsou biotechnologické ETF?",
    "intro": [
      "Biotechnologické ETF drží firmy, které vyvíjejí léky a léčebné postupy na biologickém základě – například genové terapie, imunoterapie nebo mRNA technologie. Na rozdíl od širších zdravotnických (healthcare) fondů v nich nemají velkou váhu farmaceutické koncerny, pojišťovny ani výrobci zdravotnických přístrojů, a jejich hodnota proto výrazně víc kolísá.",
      "Fondy v kategorii se liší šíří záběru. Healthcare innovation fondy (např. iShares Healthcare Innovation, IE00BYZK4776) kombinují biotechnologie s dalšími inovacemi ve zdravotnictví. Fondy na NASDAQ Biotechnology Index (např. iShares Nasdaq US Biotechnology, IE00BYXG2H39, nebo Invesco Nasdaq Biotech, IE00BQ70R696) drží čistě americké biotechnologické firmy. Úzce zaměřené tematické fondy (genomika, editace genů) jsou koncentrovanější.",
      "Podkladové akcie jsou převážně americké, výnos v korunách proto ovlivňuje kurz USD/CZK. Biotechnologické fondy bývají menší než velké indexové ETF, což se může projevit širším rozpětím mezi nákupní a prodejní cenou."
    ],
    "verdict": [
      "Fondy se liší hlavně indexem: čistý biotechnologický index (NASDAQ Biotechnology) kolísá víc než širší healthcare innovation. Dále poplatkem (TER), velikostí fondu, replikací (fyzická, nebo swap – např. Invesco Nasdaq Biotech replikuje swapem) a třídou: akumulační dividendy reinvestuje, distribuční je vyplácí. Irský domicil snižuje srážkovou daň z amerických dividend uvnitř fondu na 15 %.",
      "Malé fondy mívají širší spread a vyšší riziko, že je emitent zruší. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají jako sektorový doplněk k široce diverzifikovanému portfoliu, obvykle s dlouhým horizontem. Sektor umí propadnout o desítky procent a zotavovat se roky; pravidelný dividendový příjem tyto fondy typicky nepřinášejí.",
    "risks": [
      "Vysoká volatilita a závislost na klinických studiích: neúspěch léku v klinické studii může akcii jedné firmy srazit o desítky procent během dne a projeví se i na hodnotě fondu.",
      "Sektorová koncentrace: fondy drží jediný obor a často jen několik desítek až stovek firem, z nichž několik největších tvoří velkou část váhy.",
      "Regulační a politické riziko: rozhodnutí amerického úřadu FDA, tlak na ceny léčiv nebo změny v proplácení péče mohou pohnout celým sektorem.",
      "Měnové riziko USD/CZK: fondy drží převážně americké firmy. Posílení koruny vůči dolaru snižuje výnos v korunách i tehdy, když fond v dolarech roste."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi biotechnologie ETF a healthcare ETF?",
        "a": "Healthcare ETF pokrývá celý zdravotnický sektor včetně velkých farmaceutických firem, pojišťoven a výrobců přístrojů a historicky kolísá méně. Biotechnologické ETF drží úžeji firmy vyvíjející nové léky a terapie; jejich hodnota kolísá výrazně víc."
      },
      {
        "q": "Které biotech ETF jsou dostupné pro českého investora?",
        "a": "V UCITS formě jsou to například iShares Healthcare Innovation (IE00BYZK4776), iShares Nasdaq US Biotechnology (IE00BYXG2H39) a Invesco Nasdaq Biotech (IE00BQ70R696). Obchodují se na evropských burzách (např. Xetra); dostupnost se liší podle brokera. Úplný přehled je v tabulce výše."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční variantu?",
        "a": "Akumulační třída dividendy reinvestuje uvnitř fondu a v průběhu držení se nedaní. Distribuční třída je vyplácí na účet a vyplacené dividendy se v ČR daní 15 %. Biotechnologické firmy obvykle vyplácejí nízké dividendy."
      },
      {
        "q": "Kolik biotech ETF zařadit do portfolia?",
        "a": "Kvůli vysoké volatilitě a sektorové koncentraci investoři biotechnologii obvykle drží jako menší doplňkovou (satelitní) pozici vedle široce diverzifikovaného jádra. Vhodný podíl závisí na situaci konkrétního investora."
      },
      {
        "q": "Jak se v Česku daní zisk z biotech ETF?",
        "a": "Platí stejná pravidla jako u jiných akciových ETF: zisk z prodeje je osvobozen při držení déle než 3 roky (časový test) nebo když roční úhrn příjmů z prodeje cenných papírů nepřesáhne 100 000 Kč (hodnotový test). Dividendy z distribučních fondů se daní 15 %; u akumulačních fondů se dividendy reinvestují uvnitř fondu."
      },
      {
        "q": "Proč jsou biotech fondy menší a méně likvidní než běžná ETF?",
        "a": "Jde o tematický sektor s omezeným počtem firem a menším zájmem investorů než třeba o S&P 500, takže objem majetku fondů je výrazně menší. To se může projevit širším rozpětím mezi nákupní a prodejní cenou; nejužší bývá v hlavních obchodních hodinách."
      }
    ]
  },
  "nejlepsi-celosvetove-etf": {
    "introTitle": "Celosvětové ETF: jedním fondem vlastníte kus globální ekonomiky",
    "intro": [
      "Celosvětové ETF v tomto žebříčku sledují indexy celého světa – vyspělé i rozvíjející se trhy (Čína, Indie, Tchaj-wan) v jednom fondu. Nejrozšířenější jsou FTSE All-World (např. VWCE, VWRL) a MSCI ACWI (např. IUSQ, SPYY); širší varianty s malými firmami jsou MSCI ACWI IMI (SPYI) a FTSE Global All Cap (VALL). Index MSCI World, který mnoho lidí považuje za „celý svět“, obsahuje jen vyspělé trhy – proto má vlastní žebříček MSCI World ETF.",
      "Společným rysem těchto indexů je vysoký podíl USA. V indexu MSCI ACWI tvořily k 30. 9. 2026 americké firmy 64 % váhy, Japonsko 5 % a Velká Británie 3 % (factsheet MSCI); největšími pozicemi jsou NVIDIA, Apple a Microsoft. I „celosvětový“ fond tak z velké části závisí na americkém akciovém trhu a velkých technologických firmách. Váhy regionů a sektorů se v jednom globálním fondu mění samy podle tržní kapitalizace, bez ručního vyvažování.",
      "Fondy jsou běžně dostupné u brokerů působících v ČR. Obchodují se v EUR nebo USD, ale měna, ve které se ETF na burze obchoduje, měnové riziko nemění – rozhoduje měnové složení podkladových akcií. Výnos v korunách pak ovlivňuje vývoj kurzu, a to oběma směry."
    ],
    "verdict": [
      "Fondy na stejný index (např. VWCE a VWRL na FTSE All-World) drží stejné firmy a liší se hlavně poplatkem (TER), velikostí, akumulací/distribucí dividend a domicilem. Akumulační třída dividendy reinvestuje uvnitř fondu, distribuční je vyplácí na účet. Irský domicil (ISIN začíná IE) snižuje díky daňové smlouvě s USA srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 %.",
      "Mezi indexy je rozdíl hlavně v šíři: FTSE All-World a MSCI ACWI drží velké a střední firmy, MSCI ACWI IMI a FTSE Global All Cap přidávají i malé firmy. Aktuální poplatky a velikosti všech fondů jsou v tabulce výše (řazení „Nejlevnější“, „Největší“)."
    ],
    "forWhom": "Celosvětový fond pokrývá jedním nákupem vyspělé i rozvíjející se trhy – investoři ho proto často používají jako hlavní (jádrovou) část dlouhodobého akciového portfolia, typicky při pravidelném měsíčním investování. Jde o čistě akciové riziko: v krizích padaly tyto fondy o desítky procent, takže na krátký horizont se nehodí.",
    "risks": [
      "Vysoká váha USA a technologií: v MSCI ACWI tvořily k 30. 9. 2026 americké firmy 64 % váhy. Propad amerického trhu nebo velkých technologických firem proto stáhne celý „celosvětový“ fond, i když se jinde daří.",
      "Záměna s MSCI World: fondy na MSCI World (např. EUNL, XDWD) nedrží Čínu, Indii ani další rozvíjející se trhy. Celý svět pokrývají indexy All-World, ACWI a Global All Cap; index je uvedený v názvu fondu i v tabulce.",
      "Měnové riziko vůči koruně: podkladové akcie jsou převážně v dolarech a dalších cizích měnách. Posílení koruny snižuje výnos v Kč, i když index v původní měně roste.",
      "Hluboké dočasné propady: MSCI ACWI v letech 2007–2009 ztratil v USD 58 % (factsheet MSCI) a v roce 2020 globální akcie dočasně klesly o desítky procent. Kdo v propadu prodá, ztrátu realizuje."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi MSCI World a FTSE All-World?",
        "a": "MSCI World pokrývá jen 23 vyspělých zemí a v roce 2026 měl přibližně 1 250–1 300 firem. MSCI ACWI přidává 24 rozvíjejících se trhů, např. Čínu a Indii, a k 30. 9. 2026 měl 2 414 firem; FTSE All-World měl v srpnu 2026 přibližně 4 260 firem (údaje MSCI a FTSE Russell / emitentů). All-World a ACWI jsou tedy širší a blíž „celému světu“. Poplatky konkrétních fondů jsou v tabulce výše."
      },
      {
        "q": "Stačí mi jeden celosvětový ETF, nebo mám kombinovat víc fondů?",
        "a": "Jeden široký globální fond drží vyspělé i rozvíjející se trhy ve vahách podle tržní kapitalizace a váhy se mění samy. Kombinace regionálních ETF umožňuje nastavit váhy jinak (např. víc rozvíjejících se trhů), poměr se ale pak musí hlídat a dorovnávat ručně."
      },
      {
        "q": "Který celosvětový ETF má nejnižší poplatky?",
        "a": "Poplatky se mění, proto je neuvádíme v textu: aktuální TER všech fondů najdete v tabulce na této stránce (řazení „Nejlevnější“), s datem, ke kterému platí. Kromě TER sledujte i velikost fondu a to, zda je měnově zajištěný – zajištěné třídy bývají dražší."
      },
      {
        "q": "Mám zvolit akumulační, nebo distribuční variantu?",
        "a": "Akumulační třída dividendy reinvestuje uvnitř fondu, takže se průběžně nic nedaní. Distribuční třída je vyplácí na účet a vyplacené dividendy se v ČR daní 15 %. Fondy na stejný index se jinak neliší složením."
      },
      {
        "q": "Musím platit daně z celosvětového ETF v Česku?",
        "a": "Zisk z prodeje je v ČR osvobozen, pokud fond držíte déle než 3 roky (časový test), nebo pokud úhrn příjmů z prodeje cenných papírů za rok nepřesáhne 100 000 Kč (hodnotový test); od roku 2026 bez horního limitu. Jinak se zisk daní jako ostatní příjem. U akumulačních fondů se průběžně nic nedaní, vyplacené dividendy distribučních tříd se daní 15 %. Text není daňové poradenství."
      },
      {
        "q": "Proč je i v celosvětovém ETF tolik amerických akcií?",
        "a": "Indexy váží firmy podle tržní kapitalizace a americké firmy jsou zdaleka největší – v MSCI ACWI tvořily k 30. 9. 2026 64 % váhy. Není to chyba, ale odraz velikosti trhů. Nižší váhu USA, než odpovídá tržní velikosti, lze dosáhnout jen kombinací s regionálními fondy (Evropa, rozvíjející se trhy)."
      }
    ]
  },
  "nejlepsi-cinske-etf": {
    "introTitle": "Čínské ETF: expozice ke druhé největší ekonomice světa",
    "intro": [
      "Čínské ETF sledují akcie firem z druhé největší ekonomiky světa. Čínský trh má dvě hlavní části. Offshore akcie (H-akcie v Hongkongu, red chips, P-chips a americké ADR) pokrývají hlavně indexy MSCI China a FTSE China, ve kterých mají velkou váhu technologické firmy typu Alibaba nebo Tencent. Pevninské A-akcie obchodované v Šanghaji a Šen-čenu sledují například index CSI 300 (300 velkých domácích firem) nebo MSCI China A, kde mají větší podíl banky, spotřební zboží a průmysl. Index MSCI China All Shares kombinuje obě části.",
      "V tabulce jsou UCITS fondy s evropským domicilem, většinou irským, například iShares MSCI China (IE00BJ5JPG56), Franklin FTSE China (IE00BHZRR147) a pro A-akcie iShares MSCI China A (IE00BQT3WG13). Aktuální poplatky a velikosti jsou v tabulce výše.",
      "Výkonnost čínských akcií ovlivnily mimo jiné regulační zásahy státu do technologických firem a soukromého vzdělávání v letech 2020–2021, problémy realitního sektoru a geopolitické napětí. Čína je zároveň obsažena v ETF na rozvíjející se trhy a v celosvětových fondech."
    ],
    "verdict": [
      "Část trhu: MSCI China a FTSE China pokrývají hlavně offshore akcie s velkou vahou technologických firem, CSI 300 a MSCI China A pevninské A-akcie s větším podílem bank, spotřeby a průmyslu. Jde o dvě odlišné expozice, ne o zaměnitelné fondy.",
      "Třída, náklady a obchodování: akumulační třída dividendy reinvestuje, distribuční je vyplácí. Fondy se dále liší poplatkem, velikostí a replikací. U méně obchodovaných fondů bývá na burze širší rozpětí mezi nákupní a prodejní cenou. Aktuální hodnoty jsou v tabulce výše."
    ],
    "forWhom": "Investoři čínská ETF používají ke zvýšení váhy Číny nad úroveň, kterou už mají v ETF na rozvíjející se trhy nebo v celosvětovém fondu. Jde o fondy na jednu zemi s vyšší kolísavostí a politickým rizikem.",
    "risks": [
      "Politické a regulační riziko: stát může rychle zasáhnout do celých odvětví, jako v letech 2020–2021 u technologických firem a soukromého vzdělávání.",
      "Geopolitika a riziko delistingu: napětí mezi USA a Čínou, cla a hrozba vyřazení čínských ADR z amerických burz mohou ovlivnit ocenění firem i složení indexů.",
      "Dvojí měnové riziko: fond je obvykle vedený v USD nebo EUR, podkladové akcie se obchodují v jüanech nebo hongkongských dolarech. Do výnosu v korunách se promítá pohyb obou měn vůči koruně.",
      "Koncentrace a likvidita: širší čínské indexy mají velkou váhu několika technologických firem a menší fondy mívají na burze širší rozpětí nákup/prodej."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi MSCI China a CSI 300?",
        "a": "MSCI China (a podobně FTSE China) sleduje hlavně offshore akcie čínských firem obchodované v Hongkongu a jako ADR v USA, s velkou vahou technologických firem typu Alibaba a Tencent. CSI 300 sleduje 300 velkých firem obchodovaných přímo na pevninských burzách v Šanghaji a Šen-čenu (A-akcie), kde mají větší podíl banky, spotřeba a průmysl. Jde tedy o dvě odlišné části téhož trhu."
      },
      {
        "q": "Nekryje mi Čínu už ETF na rozvíjející se trhy?",
        "a": "Částečně ano. Čína patří k největším zemím indexu MSCI Emerging Markets a je obsažena i v celosvětových fondech typu FTSE All-World. Kdo tyto fondy drží, má určitou expozici k Číně už v nich; samostatné čínské ETF tuto váhu zvyšuje nad tržní podíl."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční variantu?",
        "a": "Akumulační třída (Acc) dividendy reinvestuje uvnitř fondu, takže investorovi nevzniká dividendový příjem k přiznání. Distribuční třída (Dist) dividendy vyplácí a ty se v ČR daní 15 % bez ohledu na časový test."
      },
      {
        "q": "Musím z čínského ETF platit v Česku daně?",
        "a": "Zisk z prodeje je osvobozen po splnění časového testu (držba déle než 3 roky, od roku 2026 bez horního limitu) nebo hodnotového testu (příjmy z prodeje cenných papírů do 100 000 Kč za rok). Reinvestice uvnitř akumulačního fondu se u investora nedaní, dividendy z distribuční třídy se daní 15 %. Nejde o daňové poradenství."
      },
      {
        "q": "Proč čínské akcie roky zaostávaly za americkými?",
        "a": "Po vrcholu v roce 2021 ovlivnily čínský trh regulační zásahy státu do technologických firem, krize realitního sektoru, slabší domácí poptávka a geopolitické napětí. Tyto faktory se promítly do nižšího ocenění čínských akcií a zůstávají zdrojem rizika."
      },
      {
        "q": "Kolik čínských ETF dát do portfolia?",
        "a": "Podíl je individuální rozhodnutí podle cílů a tolerance k riziku, srovnávač ho neurčuje. Pro přehled o celkové váze Číny se sčítá podíl samostatného čínského fondu i Čína obsažená v ETF na rozvíjející se trhy a v celosvětových fondech."
      }
    ]
  },
  "nejlepsi-cloud-etf": {
    "introTitle": "Cloud ETF: software na předplatné a cloudová infrastruktura",
    "intro": [
      "Cloud ETF jsou tematické fondy zaměřené na firmy spojené s cloudovými službami: poskytovatele infrastruktury (Amazon AWS, Microsoft Azure, Google Cloud), platformy a software na předplatné (SaaS), jako jsou Salesforce, ServiceNow, Snowflake, CrowdStrike nebo Datadog. Na rozdíl od širokých technologických fondů v nich obvykle nejsou výrobci hardwaru a polovodičů; společným jmenovatelem jsou opakované příjmy z předplatného.",
      "Fondy v kategorii sledují různé indexy. iShares Digitalisation (IE00BYZK4883) sleduje širší index iSTOXX FactSet Digitalisation, který pokrývá digitalizaci obecně, nejen cloud. First Trust Cloud Computing (IE00BFD2H405) sleduje index ISE Cloud Computing a WisdomTree Cloud Computing (IE00BJGWQN72) index BVP Nasdaq Emerging Cloud, zaměřený na rostoucí cloudové softwarové firmy.",
      "Podkladové akcie jsou převážně americké a v dolarech, takže výnos v korunách ovlivňuje kurz USD/CZK, i když fond koupíte v eurech nebo za koruny. Aktuální poplatky a velikosti fondů jsou v tabulce výše."
    ],
    "verdict": [
      "Fondy se liší hlavně šíří záběru. Širší fondy na digitalizaci drží více firem a víc se překrývají s běžnými technologickými fondy; užší cloudové indexy jsou koncentrovanější a kolísavější. V roce 2022 ztratily fondy na indexy ISE Cloud Computing a BVP Nasdaq Emerging Cloud 45 až 52 % (v USD).",
      "Dividendy jsou u těchto fondů okrajové a hlavní UCITS fondy kategorie jsou akumulační. Dále se liší poplatkem (TER) a velikostí; aktuální hodnoty jsou v tabulce výše. Cloudové, AI a technologické fondy často drží stejné velké firmy (Microsoft, Amazon, Alphabet), takže více takových fondů vedle sebe znamená vícenásobnou expozici k týmž titulům."
    ],
    "forWhom": "Investoři je používají jako tematický doplněk k širokému akciovému jádru, kterým zvyšují váhu softwarových a cloudových firem. Jde o koncentrované fondy s velkými výkyvy – v roce 2022 ztratily 45 až 52 % (v USD). Kdo už drží velký podíl amerických technologií, má s nimi značný překryv.",
    "risks": [
      "Koncentrace do USA a dolaru: fondy jsou převážně americké a podklad je v USD. Posílení koruny vůči dolaru snižuje výnos v Kč i tehdy, když akcie rostou.",
      "Citlivost na úrokové sazby: růstové SaaS firmy s vysokým oceněním prudce reagují na růst sazeb. V roce 2022 ztratily cloudové fondy 45 až 52 % (v USD), přestože tržby firem dál rostly.",
      "Překryv s technologickými a AI fondy: napříč cloudovými, AI a technologickými ETF se opakují Microsoft, Amazon, Alphabet a Nvidia. Více tematických fondů tak nemusí znamenat větší diverzifikaci.",
      "Tematické a produktové riziko: změna metodiky indexu, regulace velkých technologických firem a u menších fondů širší rozpětí nákup/prodej zvyšují reálné náklady i nejistotu."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi cloud ETF a běžným technologickým nebo AI ETF?",
        "a": "Technologické ETF pokrývají celý sektor včetně hardwaru a polovodičů, cloud ETF míří úžeji na software na předplatné a poskytovatele cloudové infrastruktury. S AI ETF se hodně překrývají (Microsoft, Nvidia, Amazon), liší se ale důrazem – cloud na opakované příjmy ze SaaS, AI na výpočetní kapacitu a modely. Fondy z těchto kategorií obsahují do velké míry stejné firmy."
      },
      {
        "q": "Který cloud ETF je pro začátek nejlepší - DGTL, SKYY, nebo WCLD?",
        "a": "Liší se šíří záběru. iShares Digitalisation (DGTL, IE00BYZK4883) sleduje širší index digitalizace a drží řádově stovky firem, takže je méně koncentrovaný. First Trust (SKYY, index ISE Cloud Computing) a WisdomTree (WCLD, index BVP Nasdaq Emerging Cloud) jsou užší cloudové fondy; v roce 2022 ztratily 45 %, resp. 52 % (v USD). Aktuální poplatky a velikosti jsou v tabulce výše."
      },
      {
        "q": "Musím z akumulačního cloud ETF něco danit každý rok?",
        "a": "Ne. U akumulačního (Acc) fondu se dividendy reinvestují uvnitř fondu a daň z příjmu v ČR řešíte až při prodeji. Pokud podíly držíte déle než 3 roky, splníte časový test a zisk je od daně z příjmu osvobozen. Od roku 2026 je časový test bez horního limitu."
      },
      {
        "q": "Proč cloud ETF v roce 2022 tolik spadly, když cloud dál rostl?",
        "a": "Cloudové firmy mají vysoké ocenění postavené na budoucích ziscích. Když centrální banky zvedly úrokové sazby, současná hodnota těchto vzdálených zisků prudce klesla a fondy na index BVP Nasdaq Emerging Cloud ztratily v roce 2022 zhruba 52 % (v USD), přestože tržby firem dál rostly. Růstová témata reagují hlavně na sazby a náladu na trhu, ne jen na výsledky firem."
      },
      {
        "q": "Nesu měnové riziko, když nakupuju v korunách u XTB nebo Degiro?",
        "a": "Ano. To, že zadáte pokyn v korunách, nic nemění na tom, že podkladová aktiva fondu jsou v dolarech. Fondy nejsou měnově zajištěné, takže pohyb kurzu USD/CZK přímo ovlivní vaši korunovou výkonnost – posílení koruny vám sníží zisk, oslabení ho zvýší."
      },
      {
        "q": "Jak velkou část portfolia dát do cloud ETF?",
        "a": "Univerzální pravidlo neexistuje. Cloudové fondy jsou tematické a kolísavější než široký trh – v roce 2022 ztratily 45 až 52 % (v USD). Jak velký podíl takový propad v portfoliu představuje, záleží na zbytku portfolia a investičním horizontu."
      }
    ]
  },
  "nejlepsi-dax-etf": {
    "introTitle": "Co je index DAX?",
    "intro": [
      "DAX je hlavní index frankfurtské burzy a sleduje 40 velkých německých akciových společností, mezi nimi SAP, Siemens, Allianz, Deutsche Telekom nebo Airbus. Do září 2021 měl 30 titulů (proto starší označení DAX 30); od 20. září 2021 jich má 40.",
      "DAX se standardně počítá jako performance index, tedy včetně reinvestovaných dividend. Většina DAX ETF je proto akumulační. Index má velkou váhu průmyslu, automobilek a chemie a je citlivý na světový obchod a ceny energií.",
      "Fondy se obchodují v eurech, výnos v korunách proto ovlivňuje kurz EUR/CZK."
    ],
    "verdict": [
      "Fondy na DAX drží stejné firmy a liší se hlavně poplatkem (TER), velikostí, likviditou na burze, domicilem (Německo, Lucembursko, Irsko, Francie) a třídou: akumulační dividendy reinvestuje, distribuční je vyplácí. Nejstarší a největší fondy nemusí být nejlevnější. Aktuální poplatky a velikosti jsou v tabulce výše.",
      "Fyzická replikace drží akcie indexu přímo, syntetická (swap) kopíruje výnos indexu přes derivát. Rozdíl mezi výnosem fondu a indexu ukazuje tracking difference."
    ],
    "forWhom": "Investoři je používají k cílené expozici na velké německé firmy, obvykle jako doplněk k širšímu evropskému nebo globálnímu portfoliu. DAX obsahuje jen 40 firem z jedné země s velkou váhou několika sektorů.",
    "risks": [
      "Sektorová koncentrace: průmysl, automobilky, chemie a finance mají v indexu velkou váhu, krize jednoho z nich se v DAXu projeví nadprůměrně.",
      "Exportní závislost: německé firmy mají velkou část tržeb v zahraničí, takže index citlivě reaguje na cla, poptávku z Číny a geopolitické napětí.",
      "Nízká diverzifikace: 40 titulů z jedné země, bez rozložení mezi regiony a s malou váhou některých sektorů (např. velkých technologických firem).",
      "Měnové riziko EUR/CZK: fondy jsou v eurech, posílení koruny snižuje výnos v korunách."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi DAX 30 a DAX 40?",
        "a": "Do září 2021 měl DAX 30 společností, od 20. září 2021 jich má 40. Dnešní ETF sledují DAX se 40 tituly; jde o tentýž index s širší základnou."
      },
      {
        "q": "Proč většina DAX ETF nevyplácí dividendy?",
        "a": "DAX se standardně počítá jako performance index, který do své hodnoty započítává reinvestované dividendy. Akumulační DAX ETF dividendy reinvestují uvnitř fondu. Existují i distribuční třídy, které dividendy vyplácejí."
      },
      {
        "q": "Který DAX ETF má nejnižší poplatky?",
        "a": "Nejnižší poplatky jsou v žebříčku „Nejlevnější (TER)“ v tabulce výše. Poplatky se v čase mění; největší a nejstarší fondy nemusí být nejlevnější."
      },
      {
        "q": "Musím danit zisk z DAX ETF v Česku?",
        "a": "Zisk z prodeje ETF je osvobozen při držení déle než 3 roky (časový test) nebo když roční úhrn příjmů z prodeje cenných papírů nepřesáhne 100 000 Kč (hodnotový test); jinak se daní. U akumulačních fondů se dividendy reinvestují uvnitř fondu, u distribučních se vyplacené dividendy daní 15 %. Pravidla se mohou měnit."
      },
      {
        "q": "Je lepší DAX ETF s domicilem v Německu (DE), nebo v Lucembursku (LU)?",
        "a": "Podkladem jsou německé akcie, takže výhoda irského domicilu u amerických dividend se zde neuplatní. DAX ETF se liší spíš poplatkem, velikostí, přesností sledování indexu (tracking difference) a způsobem replikace."
      },
      {
        "q": "Stačí mi DAX ETF jako jediná investice?",
        "a": "DAX obsahuje 40 německých firem s velkou váhou několika sektorů, takže samostatně nepředstavuje diverzifikaci mezi regiony ani sektory. Investoři ho obvykle kombinují s širším evropským nebo globálním fondem."
      }
    ]
  },
  "nejlepsi-defense-etf": {
    "introTitle": "Defense ETF: jak investovat do obranného a zbrojního průmyslu",
    "intro": [
      "Defense ETF (obranné ETF) drží akcie firem, které vyrábějí zbraně, munici, vojenskou techniku, radary a obranné systémy. Typicky kombinují americké zbrojaře (Lockheed Martin, Northrop Grumman, RTX, General Dynamics), evropské firmy (Rheinmetall, BAE Systems, Leonardo, Thales, Saab) a část leteckého průmyslu. Po roce 2022 – s válkou na Ukrajině a tlakem členů NATO na vyšší obranné výdaje – akcie těchto firem výrazně zdražily a vzniklo mnoho nových fondů.",
      "Fondy se liší hlavně záběrem. Globální fondy (např. VanEck Defense, IE000YYE6WK5, nebo HANetf Future of Defence, IE000OJ5TQP4) drží americké i evropské firmy, WisdomTree Europe Defence (IE0002Y8CX98) jen evropské a fondy typu aerospace & defence (např. iShares Global Aerospace & Defence) přidávají civilní letectví. Řada fondů vznikla teprve v posledních letech. Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "Fondy jsou vedené v EUR nebo USD a podkladové akcie jsou hlavně v dolarech, eurech a librách. Výnos v korunách proto ovlivňuje kurz koruny – bez ohledu na to, v jaké měně se ETF na burze obchoduje."
    ],
    "verdict": [
      "Záběr indexu: globální, nebo čistě evropské zbrojařské firmy, případně širší aerospace & defence s civilním letectvím. Záběr určuje, na čí obranné rozpočty (USA, Evropa) je fond navázaný.",
      "Velikost a stáří fondu: kategorie je mladá a část fondů je malá. Větší fond mívá užší rozpětí nákup/prodej a nižší riziko zrušení. TER obranných fondů je vyšší než u širokých indexových ETF – aktuální hodnoty jsou v tabulce výše.",
      "Třída a domicil: akumulační třída dividendy reinvestuje, distribuční je vyplácí. Irský domicil (ISIN začíná IE) snižuje díky smlouvě s USA srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 %."
    ],
    "forWhom": "Investoři je používají jako tematickou sázku na růst obranných výdajů, obvykle jako menší doplněk k širokému akciovému fondu. Fondy drží relativně málo firem z jednoho odvětví, takže kolísají víc než široký trh. Část investorů je naopak z etických nebo ESG důvodů vylučuje.",
    "risks": [
      "Koncentrace do několika firem: fondy drží relativně málo titulů a velká váha připadá na pár největších zbrojařů. Problém jedné firmy nebo ztráta velké zakázky se v ceně fondu projeví výrazně.",
      "Závislost na vládních rozpočtech: tržby zbrojařů stojí na státních objednávkách. Změna politických priorit, příměří nebo škrty v obraně mohou růst zastavit.",
      "Vysoká očekávání v cenách: po silném růstu od roku 2022 ceny zahrnují očekávání dalšího zbrojení. Pokud napětí poleví nebo trh očekávání přehodnotí, hrozí korekce.",
      "Měnové riziko vůči koruně: podkladové akcie jsou hlavně v USD a EUR, takže posílení koruny snižuje výnos v Kč."
    ],
    "faqs": [
      {
        "q": "Který defense ETF je největší a nejlikvidnější?",
        "a": "Pořadí podle velikosti se mění, aktuální velikosti jsou v tabulce výše (řazení „Největší“). K velkým fondům kategorie patří VanEck Defense (IE000YYE6WK5) s globálním záběrem, WisdomTree Europe Defence (IE0002Y8CX98) s evropskými firmami a HANetf Future of Defence (IE000OJ5TQP4). Větší fond mívá užší rozpětí nákup/prodej."
      },
      {
        "q": "Jaký je rozdíl mezi defense a aerospace ETF?",
        "a": "Čistě obranné (defense) fondy se soustředí na výrobce zbraní a vojenské techniky. Aerospace & defence fondy k tomu přidávají civilní letectví – výrobce dopravních letadel a jejich dodavatele (např. Airbus, Boeing). Jsou tak o něco širší, ale nejsou čistou sázkou na zbrojení."
      },
      {
        "q": "Kolik stojí defense ETF na poplatcích?",
        "a": "TER obranných fondů je vyšší než u širokých indexových ETF, protože jde o úzce zaměřené tematické fondy. Aktuální TER všech fondů jsou v tabulce výše (řazení „Nejlevnější“) s datem, ke kterému platí. K TER se přidávají transakční náklady a rozpětí nákup/prodej."
      },
      {
        "q": "Kde koupím defense ETF jako český investor?",
        "a": "Fondy se obchodují na evropských burzách a nabízí je většina brokerů dostupných v ČR. Nabídka se u brokerů liší a mění; fond se dá spolehlivě dohledat podle ISIN."
      },
      {
        "q": "Jak se v ČR daní zisk z defense ETF?",
        "a": "Zisk z prodeje je v ČR osvobozen, pokud fond držíte déle než 3 roky (časový test), nebo pokud úhrn příjmů z prodeje cenných papírů za rok nepřesáhne 100 000 Kč (hodnotový test); od roku 2026 bez horního limitu. Jinak se zisk daní jako ostatní příjem. Akumulační fond dividendy nevyplácí, takže se průběžně nedaní; vyplacené dividendy distribučních tříd se daní 15 %."
      },
      {
        "q": "Je vhodné dát defense ETF jako jádro portfolia?",
        "a": "Obranné ETF jsou úzká sektorová sázka s vyšší koncentrací a kolísáním. Jádro portfolia investoři obvykle staví na široce diverzifikovaných fondech (celý svět, MSCI World, S&P 500), které obranné firmy obsahují také, jen v malé váze."
      }
    ]
  },
  "nejlepsi-dividendove-etf": {
    "introTitle": "Dividendové ETF: vyplácené dividendy z akcií v jednom fondu (bez záruky výše)",
    "intro": [
      "Dividendové ETF vybírají akcie firem s nadprůměrnou nebo dlouhodobě rostoucí dividendou a dividendy vyplácejí investorům, často čtvrtletně. Fondy se dělí zhruba na dvě skupiny. High-yield fondy, například Vanguard FTSE All-World High Dividend Yield (IE00B8GKDB10) nebo VanEck Morningstar Developed Markets Dividend Leaders (NL0011683594), vybírají akcie s vysokým aktuálním dividendovým výnosem. Strategie Dividend Aristocrats, například SPDR S&P US Dividend Aristocrats (IE00B6YX5D40), vybírají firmy, které dividendu zvyšují mnoho let po sobě – u tohoto fondu nejméně 20 let v řadě.",
      "Fondy se obchodují na evropských burzách, většinou v EUR nebo USD. Dividendy přicházejí v měně fondu, takže jejich hodnota přepočtená do korun kolísá s kurzem.",
      "Investoři dividendová ETF používají hlavně k pravidelnému příjmu z portfolia. Celkový výnos fondu tvoří dividendy i změna ceny podílu; vysoká dividenda sama o sobě neznamená vyšší celkový výnos."
    ],
    "verdict": [
      "Strategie: high-yield fondy cílí na vysoký aktuální dividendový výnos, Dividend Aristocrats na dlouhou historii zvyšování dividendy. Indexy se liší i regionem (svět, USA, Evropa) a sektorovým složením.",
      "Třída a domicil: dividendová ETF jsou většinou distribuční a vyplacené dividendy se v ČR daní 15 %. Irský domicil (ISIN začíná IE) díky smlouvě s USA snižuje srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 %; nizozemský domicil (NL) má jinou daňovou mechaniku.",
      "Náklady a výše výnosu: aktuální TER a velikost fondů jsou v tabulce výše. Mimořádně vysoký dividendový výnos u specializovaných fondů může signalizovat riziko krácení dividend."
    ],
    "forWhom": "Investoři dividendová ETF používají k pravidelnému příjmu z portfolia, například v době čerpání úspor, nebo jako příjmovou složku většího portfolia. Vyplacené dividendy se v ČR daní 15 % a uvádějí se v daňovém přiznání.",
    "risks": [
      "Dividenda není zaručená: v krizích ji firmy snižují nebo ruší (například banky a energetické firmy v roce 2020), takže příjem z fondu může klesnout.",
      "Sektorová koncentrace: high-yield indexy mají větší váhu financí, energetiky, utilit a telekomunikací a menší váhu technologií, takže se jejich výkonnost může od širokého trhu výrazně lišit.",
      "Daň z dividend: vyplacené dividendy z distribučního ETF se v ČR daní 15 % a uvádějí se v přiznání; u akumulačního fondu tato povinnost nevzniká.",
      "Kurzové riziko: dividendy přicházejí v EUR nebo USD, posílení koruny proto snižuje jejich hodnotu v korunách bez ohledu na výkonnost portfolia."
    ],
    "faqs": [
      {
        "q": "Kolik reálně vydělám na dividendách z těchto ETF?",
        "a": "Dividendový výnos se mění s cenou akcií i s výší vyplácených dividend, proto ho zde neuvádíme jako pevné číslo. Z hrubé dividendy se v ČR odvádí 15% daň a výsledek v korunách ovlivňuje i kurz. Výnosy fondů v korunách jsou v tabulce výše."
      },
      {
        "q": "Musím dividendy z ETF danit a jak?",
        "a": "Ano. Dividendy z distribučního ETF jsou příjmem z kapitálového majetku, uvádějí se v daňovém přiznání a daní se 15 %. Srážková daň z amerických dividend se u irských fondů platí už uvnitř fondu, ne u investora. Nejde o daňové poradenství."
      },
      {
        "q": "Je lepší dividendové ETF, nebo akumulační světový index?",
        "a": "Oba typy fondů slouží jinému účelu. Distribuční dividendové ETF vyplácí příjem průběžně a dividendy se daní 15 %. Akumulační světový index (například na MSCI World nebo FTSE All-World) dividendy reinvestuje uvnitř fondu bez průběžného zdanění u investora a zahrnuje širší trh včetně firem s nízkou nebo žádnou dividendou."
      },
      {
        "q": "Jaký je rozdíl mezi Dividend Aristocrats a high-yield ETF?",
        "a": "High-yield fondy (například Vanguard FTSE All-World High Dividend Yield nebo VanEck Developed Markets Dividend Leaders) vybírají akcie s vysokým aktuálním dividendovým výnosem, což může zahrnovat i firmy s rizikem snížení dividendy. Dividend Aristocrats (například SPDR IE00B6YX5D40) vybírají firmy, které dividendu zvyšují nejméně 20 let v řadě; důraz je na stabilitu výplaty."
      },
      {
        "q": "Jak často se dividendy vyplácejí?",
        "a": "Častá je čtvrtletní výplata – takto vyplácejí například Vanguard FTSE All-World High Dividend Yield, VanEck Developed Markets Dividend Leaders i SPDR S&P US Dividend Aristocrats. Některé fondy vyplácejí pololetně, jiné měsíčně. Frekvenci uvádí detail fondu."
      },
      {
        "q": "U kterých brokerů dividendové ETF koupím?",
        "a": "Fondy se obchodují na evropských burzách (například Xetra, Euronext Amsterdam nebo London Stock Exchange) a nabízejí je brokeři s přístupem na tyto burzy. Dostupnost konkrétního fondu, poplatky za obchod a měnovou konverzi i způsob připisování dividend se liší podle brokera."
      }
    ]
  },
  "nejlepsi-dluhopisove-etf": {
    "introTitle": "Dluhopisové ETF: státní a firemní dluhopisy v jednom fondu",
    "intro": [
      "Dluhopisové ETF drží v jednom fondu stovky až tisíce dluhopisů států (např. Německa, USA, Francie) a velkých firem. Fond inkasuje kupóny, reinvestuje splatné dluhopisy a rozkládá riziko napříč emitenty a splatnostmi. Nejrozšířenější jsou tzv. Global Aggregate fondy, které kombinují státní i korporátní dluhopisy investičního stupně do jednoho indexu (Bloomberg Global Aggregate). Patří sem například iShares Core Global Aggregate Bond EUR Hedged (IE00BDBRDM35) nebo Vanguard Global Aggregate Bond EUR Hedged (IE00BG47KH54); aktuální poplatky jsou v tabulce výše.",
      "U dluhopisů hraje velkou roli měna. Zahraniční dluhopis vynáší třeba 3 %, ale pokud dolar nebo euro oslabí vůči koruně o 5 %, je výnos v korunách záporný. Měnově zajištěné třídy (EUR Hedged, CZK Hedged) kurzové riziko tlumí – vůči koruně ale jen třídy zajištěné výslovně do CZK. U dluhopisů bývá kolísání kurzu větší než samotný úrokový výnos.",
      "Dluhopisy se v portfoliu používají hlavně kvůli stabilitě a diverzifikaci, ne kvůli růstu. Při propadech akciových trhů se státní dluhopisy často chovaly opačně než akcie, takže ve smíšeném portfoliu tlumily výkyvy. Rok 2022 ale ukázal výjimku: když centrální banky prudce zvedaly sazby, klesly ceny akcií i dluhopisů zároveň."
    ],
    "verdict": [
      "Dluhopisové fondy se liší typem emitenta (státy, nebo firmy), ratingem (investiční stupeň, nebo high yield), splatností (durací) a měnou. Delší durace znamená větší citlivost ceny na změnu úrokových sazeb oběma směry. Měnově zajištěné třídy tlumí kurz do EUR, USD nebo jiné měny fondu – do koruny jen třídy výslovně zajištěné do CZK.",
      "Akumulační třídy kupóny reinvestují, distribuční je vyplácejí na účet. Poplatky (TER) jsou u širokých dluhopisových fondů nízké; aktuální hodnoty a velikosti fondů jsou v tabulce výše."
    ],
    "forWhom": "Dluhopisové fondy investoři používají hlavně ke ztlumení výkyvů akciového portfolia nebo jako zdroj pravidelného příjmu (distribuční třídy). Cena dluhopisového ETF ale také kolísá – v roce 2022 klesly globální dluhopisové fondy i o víc než 10 % – takže nejsou náhradou spořicího účtu.",
    "risks": [
      "Úrokové riziko: když sazby rostou, ceny existujících dluhopisů klesají. Čím delší durace fondu, tím větší propad – v roce 2022 ztratily globální dluhopisové ETF i přes 10 %.",
      "Měnové riziko u nezajištěných tříd: posílení koruny vůči dolaru či euru může smazat celý úrokový výnos. Třídy zajištěné do EUR riziko vůči koruně neodstraňují, to dělají jen třídy zajištěné do CZK.",
      "Kreditní riziko: u korporátních a zejména high yield dluhopisů hrozí, že emitent nesplatí. U fondů investičního stupně je toto riziko nízké, ale ne nulové.",
      "Inflační riziko: pevný kupón ztrácí reálnou hodnotu, pokud inflace nečekaně vzroste. Klasické dluhopisové ETF proti inflaci nechrání; na inflaci jsou navázané samostatné fondy inflačně vázaných dluhopisů (linkers)."
    ],
    "faqs": [
      {
        "q": "Je lepší dluhopisové ETF, nebo spořicí účet a termínovaný vklad?",
        "a": "Jde o odlišné nástroje. Zůstatek na spořicím účtu nekolísá a vklady jsou ze zákona pojištěné do stanoveného limitu. Cena dluhopisového ETF kolísá s úrokovými sazbami – může krátkodobě klesnout, při poklesu sazeb naopak roste. Dluhopisové ETF navíc rozkládá peníze mezi mnoho emitentů a splatností."
      },
      {
        "q": "Proč mi dluhopisové ETF v roce 2022 spadlo, když jsou dluhopisy 'bezpečné'?",
        "a": "Bezpečnost dluhopisu znamená vysokou pravděpodobnost splacení, ne stabilní cenu na burze. Když centrální banky prudce zvýšily sazby, tržní cena starších dluhopisů s nižším kupónem klesla, a to se propsalo i do ceny ETF. Vyšší sazby se ale postupně promítají do vyššího budoucího výnosu fondu, protože ten nakupuje nové dluhopisy s vyšším kupónem."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční verzi?",
        "a": "Akumulační verze kupóny automaticky reinvestuje uvnitř fondu, distribuční je vyplácí na účet jako pravidelný příjem. V ČR podléhají vyplacené výnosy dani z příjmu; u akumulační verze se daň řeší až při prodeji, pokud není splněn časový test."
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
        "a": "Global Aggregate fondy nabízí většina brokerů dostupných v Česku. Podstatné je, v jaké měně je třída zajištěná: „EUR Hedged“ tlumí kurz vůči euru, ne vůči koruně. Fondy se dále liší typem dluhopisů, durací, poplatkem (TER) a velikostí – aktuální hodnoty jsou v tabulce výše."
      }
    ]
  },
  "nejlepsi-emerging-markets-etf": {
    "introTitle": "Co jsou ETF na rozvíjející se trhy?",
    "intro": [
      "Emerging markets ETF sledují akcie firem z rozvíjejících se ekonomik. Většina evropských fondů kopíruje index MSCI Emerging Markets, který pokrývá velké a střední firmy z 24 zemí (zhruba 85 % volně obchodovatelné tržní kapitalizace v každé z nich). Největší váhu mají Čína, Tchaj-wan, Indie a Jižní Korea. Varianta MSCI EM IMI přidává i malé firmy.",
      "Index MSCI World rozvíjející se trhy neobsahuje; FTSE All-World a MSCI ACWI je obsahují. Fondy v kategorii jsou UCITS ETF obchodované v eurech nebo dolarech, podkladové akcie jsou v řadě místních měn.",
      "Mezi velké fondy patří iShares Core MSCI EM IMI (IE00BKM4GZ66, fyzická replikace), Amundi Core MSCI Emerging Markets Swap (LU2573966905, swap) a HSBC MSCI Emerging Markets (IE00B5SSQT16, fyzická replikace). Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "verdict": [
      "Fondy se liší indexem (MSCI EM, nebo širší MSCI EM IMI s malými firmami), poplatkem (TER), velikostí, replikací (fyzická, nebo swap) a třídou: akumulační dividendy reinvestuje, distribuční je vyplácí. Existují i varianty bez Číny (MSCI EM ex China), které čínskou část vyčleňují.",
      "Fondy na stejný index mají téměř stejné složení, takže více EM fondů vedle sebe diverzifikaci prakticky nezvyšuje. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají k doplnění rozvíjejících se trhů k fondům, které je neobsahují (MSCI World, S&P 500); FTSE All-World a MSCI ACWI je už obsahují. Rozvíjející se trhy mohou roky zaostávat a kolísají víc než vyspělé.",
    "risks": [
      "Koncentrace do Číny a Tchaj-wanu: regulatorní zásahy Pekingu nebo napětí kolem Tchaj-wanu mohou fondem výrazně pohnout.",
      "Měnové riziko: podkladové akcie jsou v desítkách místních měn (jüan, rupie, won, real…) a k tomu se přidává pohyb koruny vůči euru či dolaru.",
      "Politické a institucionální riziko: slabší ochrana akcionářů, kapitálové kontroly a menší transparentnost. V roce 2022 MSCI vyřadilo z indexu Rusko za prakticky nulovou cenu.",
      "Vyšší volatilita a dlouhé cykly: rozvíjející se trhy dokážou za vyspělými zaostávat několik let v řadě."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi verzí MSCI EM a MSCI EM IMI?",
        "a": "MSCI Emerging Markets pokrývá velké a střední firmy (large a mid cap). Verze IMI (Investable Market Index) přidává i malé firmy (small cap), a proto obsahuje výrazně víc titulů. Fond iShares Core MSCI EM IMI (IE00BKM4GZ66) sleduje právě IMI variantu."
      },
      {
        "q": "Potřebuji EM fond, když už mám ETF na celý svět?",
        "a": "Záleží na tom, jaký světový index držíte. MSCI World a S&P 500 rozvíjející se trhy neobsahují. FTSE All-World a MSCI ACWI je obsahují, takže samostatný EM fond u nich jen zvyšuje váhu rozvíjejících se trhů nad tržní poměr."
      },
      {
        "q": "Vadí, že je v indexu tak velká váha Číny?",
        "a": "Čína má ve standardním MSCI EM největší váhu ze všech zemí, což znamená soustředění rizika do jedné země s vysokým politickým a regulatorním rizikem. Varianty MSCI EM ex China čínskou část vyčleňují; čínskou expozici pak lze držet zvlášť, nebo vůbec."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční EM fond?",
        "a": "Akumulační (Acc) fond dividendy reinvestuje uvnitř fondu a v průběhu držení se nedaní. Distribuční (Dist) fond je vyplácí na účet a vyplacené dividendy se v ČR daní 15 %. Dividendy z rozvíjejících se trhů v čase výrazně kolísají."
      },
      {
        "q": "Jak se v Česku daní zisky z emerging markets ETF?",
        "a": "Platí stejná pravidla jako pro ostatní akciové ETF. Zisk z prodeje je osvobozen při držení déle než 3 roky (časový test) nebo když roční úhrn příjmů z prodeje cenných papírů nepřesáhne 100 000 Kč (hodnotový test). U distribučních fondů se dividendy daní 15 %. Pravidla se mohou měnit."
      },
      {
        "q": "Kde tyto ETF v Česku koupím a v jaké měně?",
        "a": "Fondy jako iShares Core MSCI EM IMI, Amundi Core MSCI Emerging Markets nebo HSBC MSCI Emerging Markets se obchodují hlavně na evropských burzách (např. Xetra) v eurech nebo dolarech; dostupnost se liší podle brokera. Nákup za koruny znamená konverzi měny."
      }
    ]
  },
  "nejlepsi-energeticke-etf": {
    "introTitle": "Energetické ETF: ropa, plyn a čistá energie v jednom sektoru",
    "intro": [
      "Energetické ETF investují do firem z energetického sektoru. Pod jednu kategorii spadají dva odlišné světy. Na jedné straně jsou tradiční ropné a plynárenské firmy jako Shell, ExxonMobil, Chevron, TotalEnergies nebo ConocoPhillips, které vydělávají na těžbě a zpracování fosilních paliv. Na druhé straně stojí čistá energie (clean energy) – výrobci solárních panelů, větrných turbín a technologií pro vodík a baterie. Obě skupiny se chovají a oceňují velmi odlišně.",
      "Tradiční energetiku pokrývají sektorové fondy jako Xtrackers MSCI World Energy (IE00BM67HM91) pro vyspělý svět nebo SPDR MSCI Europe Energy (IE00BKWQ0F09) pro Evropu. Drží úzký koš velkých ropných a plynárenských firem, takže jejich výsledek silně závisí na cenách ropy a plynu. Čistou energii pokrývají tematické fondy, např. iShares Global Clean Energy Transition (IE00B1XNHC34), s vyšším TER a výrazně vyšším kolísáním. Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "Energie tvoří jen malou část světového akciového trhu – v indexu MSCI ACWI k 30. 9. 2026 necelá 4 % (factsheet MSCI). Energetické ETF jsou proto úzká sektorová pozice. Fondy jsou vedené v USD nebo EUR, takže výnos v korunách ovlivňuje i kurz koruny."
    ],
    "verdict": [
      "Tradiční, nebo čistá energie: ropné a plynárenské fondy a clean-energy fondy sledují odlišné indexy a chovají se jinak. Rozdíl je vidět z názvu indexu i z největších pozic fondu.",
      "Region a šíře: fondy na MSCI World Energy pokrývají celý vyspělý svět, evropské fondy jen evropské firmy. Úzké sektorové indexy drží desítky firem, často s velkou vahou několika největších.",
      "Poplatek a velikost: tradiční sektorové fondy bývají levnější než tematické clean-energy fondy. Menší fondy mívají širší rozpětí nákup/prodej a vyšší riziko zrušení. Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "Třída a domicil: akumulační třída dividendy reinvestuje, distribuční je vyplácí (vyplacené dividendy se v ČR daní 15 %). Irský domicil (ISIN začíná IE) snižuje srážkovou daň z amerických dividend uvnitř fondu."
    ],
    "forWhom": "Investoři je používají jako cílený doplněk k širokému akciovému fondu – buď jako sázku na ropu, plyn a dividendy, nebo na energetickou transformaci. Sektor je cyklický: několik let může zaostávat za širokým trhem a pak prudce růst. Investoři s ESG filtrem tradiční ropné fondy často vylučují.",
    "risks": [
      "Vysoké kolísání a cykličnost: energetika patří k nejkolísavějším sektorům. Několik let může zaostávat za trhem a pak prudce vyrůst.",
      "Závislost na cenách ropy a plynu: hodnota tradičních fondů se odvíjí od cen komodit, které ovlivňují rozhodnutí OPEC+, války, sankce a globální poptávka.",
      "Regulace a politika: tradiční energetiku ohrožuje dekarbonizace a emisní povolenky. Čistá energie naopak závisí na dotacích, úrokových sazbách a politické podpoře; clean-energy fondy po roce 2021 výrazně ztratily.",
      "Koncentrace a měnové riziko: úzké sektorové indexy jsou navázané na několik největších firem. Kurz USD a EUR vůči koruně přidává další kolísání."
    ],
    "faqs": [
      {
        "q": "Jaká jsou nejlepší energetická ETF?",
        "a": "Srovnávač „nejlepší“ fond neurčuje – aktuální poplatky, velikosti a výnosy jsou v tabulce výše. Příklady fondů: Xtrackers MSCI World Energy (IE00BM67HM91) pro globální tradiční energetiku, SPDR MSCI Europe Energy (IE00BKWQ0F09) pro Evropu a iShares Global Clean Energy Transition (IE00B1XNHC34) pro čistou energii. Liší se tím, zda drží ropné a plynárenské firmy, nebo firmy energetické transformace."
      },
      {
        "q": "Jaký je rozdíl mezi tradičním a clean energy ETF?",
        "a": "Tradiční energetická ETF drží ropné a plynárenské firmy jako Shell, ExxonMobil nebo TotalEnergies a jejich výsledek silně závisí na ceně ropy a plynu. Clean-energy fondy drží firmy z oblasti obnovitelných zdrojů – solár, vítr, vodík a baterie. Mají vyšší poplatky a citelně vyšší kolísání. Obě skupiny se často vyvíjejí odlišně."
      },
      {
        "q": "Kolik stojí energetická ETF na poplatcích?",
        "a": "Tradiční sektorové fondy bývají levnější než tematické clean-energy fondy. Aktuální TER všech fondů jsou v tabulce výše s datem, ke kterému platí. K TER se přidávají transakční náklady a rozpětí nákup/prodej u brokera."
      },
      {
        "q": "Mám vybrat akumulační, nebo distribuční variantu?",
        "a": "Akumulační třída dividendy reinvestuje uvnitř fondu, takže se průběžně nic nedaní. Distribuční třída je vyplácí na účet a vyplacené dividendy se v ČR daní 15 %."
      },
      {
        "q": "Jak se energetická ETF daní v Česku?",
        "a": "Zisk z prodeje je v ČR osvobozen, pokud fond držíte déle než 3 roky (časový test), nebo pokud úhrn příjmů z prodeje cenných papírů za rok nepřesáhne 100 000 Kč (hodnotový test); od roku 2026 bez horního limitu. Jinak se zisk daní jako ostatní příjem. Vyplácené dividendy z distribučních fondů se daní 15 %. Irský domicil (ISIN začínající na IE) snižuje srážkovou daň z amerických dividend uvnitř fondu."
      },
      {
        "q": "Jsou energetická ETF vhodná jako jádro portfolia?",
        "a": "Energie tvoří jen malou část světového akciového trhu (v MSCI ACWI k 30. 9. 2026 necelá 4 %), takže energetické ETF jsou sektorová, koncentrovaná pozice. Jádro portfolia investoři obvykle staví na široce diverzifikovaném fondu, ve kterém je energie zastoupená v tržní váze."
      }
    ]
  },
  "nejlepsi-esg-etf": {
    "introTitle": "ESG ETF: akciové fondy s ESG screeningem",
    "intro": [
      "ESG ETF jsou fondy, které kromě finančních ukazatelů zohledňují i faktory z oblasti životního prostředí (Environmental), sociální odpovědnosti (Social) a správy společností (Governance). Poskytovatel indexu vyřadí kontroverzní obory (typicky výrobu zbraní, tabák, uhlí a další fosilní paliva, hazard) a firmám s lepším ESG hodnocením dá vyšší váhu. Zkratky jako Screened, Enhanced, CTB (Climate Transition Benchmark), PAB (Paris-Aligned Benchmark) nebo SRI označují různě přísný stupeň screeningu.",
      "ESG neznamená jiný trh. Nejběžnější ESG fondy jsou široce diverzifikované akciové fondy navázané na velké benchmarky (USA, celý svět) a od klasického indexu se liší spíše v detailu. Patří mezi ně například iShares MSCI USA CTB Enhanced ESG (IE00BHZPJ890 a další třídy) nebo Xtrackers MSCI USA ESG (IE00BFMNPS42). Aktuální poplatky a velikosti jsou v tabulce výše.",
      "Fondy se obchodují na evropských burzách (Xetra, Euronext, Borsa Italiana). Většina velkých ESG ETF má irský domicil (ISIN začíná na IE) a obchoduje se v EUR nebo USD, takže výnos v korunách ovlivňuje kurz."
    ],
    "verdict": [
      "Přísnost screeningu: varianty Screened a Enhanced se od klasického indexu liší jen mírně. SRI a Paris-Aligned fondy vylučují mnohem víc firem, jsou koncentrovanější a jejich výkonnost se od trhu může odchýlit oběma směry. Rozhodující je metodika indexu, ne marketingový název.",
      "Trh, třída a náklady: fondy se liší podkladovým trhem (USA, svět, Evropa) a třídou – akumulační dividendy reinvestuje, distribuční je vyplácí. TER největších ESG fondů na americké akcie je na úrovni běžných indexových fondů; aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři ESG ETF používají, když chtějí z portfolia vyloučit vybrané obory (zbraně, tabák, uhlí a další fosilní paliva) a přitom zachovat široce diverzifikovaný indexový fond. Samotná nálepka ESG vyšší výnos nezaručuje a definice ESG se mezi poskytovateli liší.",
    "risks": [
      "Nejednotná definice a greenwashing: dva fondy se stejnou nálepkou mohou mít odlišné složení i přísnost screeningu a název (Green, Sustainable) o přísnosti mnoho neříká. Rozhodující je metodika indexu.",
      "Sektorová odchylka od trhu: screening vyřazuje energetiku a další obory, takže se výkonnost od širokého trhu liší. V letech růstu cen ropy může ESG fond zaostávat, jindy naopak předběhnout.",
      "Koncentrace u přísných variant: SRI a Paris-Aligned fondy drží méně firem a mívají větší váhu technologií, což zvyšuje citlivost na propady těchto sektorů.",
      "Měnové riziko: fondy se obchodují v EUR či USD, výnos v korunách ovlivňuje kurz. Třídy zajištěné do koruny v přehledu nejsou."
    ],
    "faqs": [
      {
        "q": "Které ESG ETF patří mezi největší a nejlevnější?",
        "a": "Mezi největší ESG ETF v Evropě patří fondy na americké akcie, například iShares MSCI USA CTB Enhanced ESG (distribuční IE00BHZPJ890 a akumulační IE00BHZPJ908) nebo Xtrackers MSCI USA ESG (IE00BFMNPS42). Poplatky největších ESG fondů jsou na úrovni běžných indexových fondů. Aktuální velikosti a TER jsou v tabulce výše."
      },
      {
        "q": "Znamená ESG automaticky nižší výnos?",
        "a": "Ne nutně. Široké ESG fondy mají složení podobné klasickému indexu, takže se jejich výkonnost liší spíše mírně. V konkrétních obdobích mohou zaostat (například při růstu cen ropy, protože nedrží energetiku), nebo předběhnout. Velikost odchylky závisí hlavně na přísnosti screeningu."
      },
      {
        "q": "Jaký je rozdíl mezi ESG Screened, Enhanced a SRI?",
        "a": "Screened a Enhanced varianty vyloučí nejhorší firmy a mírně upraví váhy, takže zůstávají blízko širokému trhu. SRI a Paris-Aligned (PAB) fondy jsou výrazně přísnější, drží podstatně méně titulů a od trhu se odchylují víc."
      },
      {
        "q": "Mají ESG ETF akumulační i distribuční verzi?",
        "a": "Ano, u větších fondů obvykle existují obě třídy. Akumulační (ACC) verze dividendy reinvestuje uvnitř fondu, distribuční (DIST) je vyplácí a vyplacené dividendy se v ČR daní 15 %."
      },
      {
        "q": "Jak se ESG ETF daní v Česku?",
        "a": "Platí stejná pravidla jako u ostatních ETF. Zisk z prodeje je osvobozen po splnění časového testu (držba déle než 3 roky, od roku 2026 bez horního limitu) nebo hodnotového testu (příjmy z prodeje cenných papírů do 100 000 Kč za rok). Dividendy z distribučních tříd se daní 15 %. Nejde o daňové poradenství."
      },
      {
        "q": "Jak poznám greenwashing u ESG fondu?",
        "a": "Vodítkem je metodika indexu: jaká odvětví fond skutečně vylučuje a jak počítá ESG skóre. Užitečné je i srovnání reálného složení s klasickým indexem – pokud se liší jen minimálně, jde spíš o kosmetickou úpravu než o zásadně odlišný přístup."
      }
    ]
  },
  "nejlepsi-evropske-etf": {
    "introTitle": "Evropské ETF: akcie vyspělých evropských trhů",
    "intro": [
      "Evropské ETF sledují akciové indexy vyspělých evropských trhů. Nejčastěji jde o tři indexy: STOXX Europe 600 (600 velkých, středních i malých firem ze 17 zemí včetně Velké Británie a Polska), MSCI Europe (velké a střední firmy z 15 vyspělých evropských zemí včetně Velké Británie) a FTSE Developed Europe. Mezi největší firmy patří ASML, SAP, Nestlé, Roche, Novartis, AstraZeneca nebo Shell. Oproti americkým indexům mají evropské menší váhu technologických firem a větší podíl zdravotnictví, průmyslu, financí a spotřebního zboží.",
      "Ve světových indexech dominují USA – v MSCI ACWI měly podle factsheetu MSCI k 30. 4. 2026 váhu 63 %. Samostatný evropský fond tak zvyšuje v portfoliu váhu Evropy. Většina evropských fondů je vedená v eurech, takže měnové riziko je EUR/CZK místo USD/CZK."
    ],
    "verdict": [
      "Fondy se liší hlavně indexem. STOXX Europe 600 zahrnuje i menší firmy, MSCI Europe a FTSE Developed Europe jen velké a střední. Všechny tři obsahují Velkou Británii; Evropu bez Británie sledují samostatné indexy s označením „ex UK“.",
      "Akumulační třída dividendy reinvestuje, distribuční je vyplácí na účet; vyplacené dividendy se v ČR daní 15 %. Poplatky (TER) jsou u velkých evropských fondů v řádu setin procenta a rozdíly mezi nimi malé. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají hlavně ke zvýšení váhy Evropy nad úroveň, kterou má ve světovém indexu, a tím ke snížení podílu USA. Fondy jsou většinou v eurech, takže měnové riziko je EUR/CZK místo USD/CZK. Samotný evropský fond nepokrývá USA, Asii ani rozvíjející se trhy.",
    "risks": [
      "Regionální sázka: výkon Evropy se může roky odchylovat od světového trhu, mimo jiné kvůli menšímu podílu technologických firem.",
      "Kurzové riziko EUR/CZK: fondy jsou zpravidla v eurech. Posílení koruny vůči euru sníží korunový výnos i u rostoucího fondu, oslabení koruny ho naopak zvýší.",
      "Rozdíly ve složení indexů: STOXX Europe 600 obsahuje i malé firmy a Polsko, MSCI Europe a FTSE Developed Europe jen velké a střední firmy a varianty „ex UK“ vynechávají Británii. Dva fondy „na Evropu“ tak mohou mít odlišnou skladbu i výkon.",
      "Váha několika velkých firem: velké koncerny jako ASML, Nestlé, Roche nebo Novartis mají v indexech znatelnou váhu, takže problémy jednoho titulu se projeví na celém fondu."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi STOXX Europe 600 a MSCI Europe?",
        "a": "STOXX Europe 600 má pevně 600 firem ze 17 zemí a zahrnuje velké, střední i malé společnosti. MSCI Europe obsahuje jen velké a střední firmy z 15 vyspělých evropských zemí. Oba indexy zahrnují Velkou Británii; STOXX navíc i Polsko a Lucembursko."
      },
      {
        "q": "Zahrnují evropské ETF britské akcie?",
        "a": "Fondy na STOXX Europe 600, MSCI Europe i FTSE Developed Europe britské akcie obsahují. Bez Británie jsou jen fondy na indexy s označením „ex UK“ (např. MSCI Europe ex UK). Složení konkrétního fondu je dané jeho indexem."
      },
      {
        "q": "Který evropský ETF má nejnižší poplatek?",
        "a": "Velké evropské fondy na STOXX Europe 600, MSCI Europe a FTSE Developed Europe mají TER v řádu setin procenta a rozdíly mezi nimi jsou malé. Poplatky se mění; aktuální TER jednotlivých fondů jsou v tabulce výše. Vedle TER se fondy liší indexem, velikostí a přesností sledování indexu."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční verzi jako Čech?",
        "a": "Akumulační (Acc) verze dividendy reinvestuje uvnitř fondu a průběžně se nedaní. Distribuční (Dist) verze je vyplácí na účet a vyplacené dividendy se v ČR daní 15 %. Evropské firmy vyplácejí relativně vysoké dividendy, takže rozdíl mezi třídami je tu znatelnější."
      },
      {
        "q": "Potřebuji evropský ETF, když už mám celosvětový fond?",
        "a": "Ne nutně. Světové ETF (například na MSCI ACWI nebo FTSE All-World) Evropu obsahují v její tržní váze. Samostatný evropský fond tuto váhu zvyšuje nad tržní úroveň a snižuje podíl USA."
      },
      {
        "q": "V jaké měně evropské ETF nakupuji a jaké to má daňové dopady?",
        "a": "Fondy jsou zpravidla vedené v eurech, u brokera je ale často lze koupit i za koruny s automatickou konverzí. Zisk z prodeje je v ČR osvobozen po 3 letech držení (časový test). Kurzové zisky i ztráty EUR/CZK jsou součástí celkového výsledku, proto se hodí evidence nákupů v korunách."
      }
    ]
  },
  "nejlepsi-financni-etf": {
    "introTitle": "Co jsou finanční ETF?",
    "intro": [
      "Finanční ETF investují do bank, pojišťoven, správců aktiv, burz a platebních firem. Podle indexu jde buď o čistě bankovní expozici (STOXX Europe 600 Banks, Euro Stoxx Banks), nebo o širší finanční sektor včetně pojišťoven a plateb (S&P 500 Financials).",
      "Sektor je citlivý na úrokové sazby a hospodářský cyklus. Banky vydělávají mimo jiné na rozdílu mezi úroky, které inkasují a které platí (čistá úroková marže); v recesi jim rostou ztráty ze špatných pohledávek. Finanční ETF se proto chovají jinak než široké indexy typu S&P 500 nebo MSCI World.",
      "Fondy drží akcie v dolarech nebo eurech, výnos v korunách proto ovlivňuje i kurz CZK vůči USD a EUR."
    ],
    "verdict": [
      "Fondy se liší hlavně šíří indexu: americký finanční sektor (např. iShares S&P 500 Financials Sector, IE00B4JNQZ49, akumulační) zahrnuje i pojišťovny, platební firmy a burzy; evropské bankovní fondy (např. iShares STOXX Europe 600 Banks, DE000A0F5UJ7, distribuční, nebo Amundi Euro Stoxx Banks, LU1829219390, akumulační) drží jen banky a jsou koncentrovanější.",
      "Dále se fondy liší poplatkem (TER), velikostí, domicilem a třídou: akumulační dividendy reinvestuje, distribuční je vyplácí. U fondů s americkými akciemi irský domicil snižuje srážkovou daň z dividend uvnitř fondu na 15 %. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají jako sektorovou pozici vedle široce diverzifikovaného jádra portfolia, často s názorem na vývoj úrokových sazeb nebo bankovního sektoru. Sektor je cyklický a v recesích patří k nejvíce zasaženým.",
    "risks": [
      "Koncentrace do jednoho sektoru: chybí diverzifikace napříč odvětvími; čistě bankovní ETF drží navíc jen omezený počet bank.",
      "Citlivost na sazby a hospodářský cyklus: pokles sazeb, zpomalení ekonomiky nebo nárůst nesplácených pohledávek mohou zisky sektoru rychle snížit.",
      "Regulatorní a systémové riziko: krize důvěry se šíří rychle – v roce 2023 padlo několik amerických regionálních bank a Credit Suisse převzala UBS.",
      "Měnové riziko: fondy drží akcie v USD a EUR, posílení koruny snižuje výnos v korunách."
    ],
    "faqs": [
      {
        "q": "Jaké jsou nejlepší finanční ETF pro rok 2026?",
        "a": "K velkým fondům kategorie patří iShares S&P 500 Financials Sector (IE00B4JNQZ49) pro americký finanční sektor, iShares STOXX Europe 600 Banks (DE000A0F5UJ7) a Amundi Euro Stoxx Banks (LU1829219390) pro evropské banky. Liší se hlavně regionem a šíří sektoru. Pořadí podle poplatků a velikosti je v tabulce výše; žebříček řadí fondy podle dat."
      },
      {
        "q": "Jaký je rozdíl mezi bankovním ETF a širším finančním ETF?",
        "a": "Čistě bankovní ETF jako STOXX Europe 600 Banks nebo Euro Stoxx Banks drží jen akcie bank, jsou tedy koncentrovanější a citlivější na úrokové sazby. Širší finanční ETF typu S&P 500 Financials zahrnuje kromě bank i pojišťovny, správce aktiv, burzy a platební firmy (Visa, Mastercard), takže je o něco vyváženější a méně závislý na jedné skupině firem."
      },
      {
        "q": "Vyplácejí finanční ETF dividendy a jak se daní?",
        "a": "Banky dividendy tradičně vyplácejí. Distribuční fondy (např. iShares STOXX Europe 600 Banks) je posílají na účet, akumulační (např. iShares S&P 500 Financials Sector nebo Amundi Euro Stoxx Banks Acc) je reinvestují uvnitř fondu. Vyplacené dividendy se v ČR daní 15 % v daňovém přiznání."
      },
      {
        "q": "Platí u finančních ETF časový test pro osvobození od daně?",
        "a": "Ano, při držení déle než 3 roky je zisk z prodeje ETF osvobozen od daně z příjmů; osvobozen je i zisk, pokud roční úhrn příjmů z prodeje cenných papírů nepřesáhne 100 000 Kč. Časový test se týká zisku z prodeje, ne vyplácených dividend."
      },
      {
        "q": "Hodí se finanční ETF jako jádro portfolia?",
        "a": "Finanční ETF drží jediný cyklický sektor, takže jejich výsledek závisí na kondici bank a úrokových sazbách. Investoři je obvykle používají jako doplněk (satelit) k široce diverzifikovanému jádru, například celosvětovému akciovému ETF."
      },
      {
        "q": "Proč záleží na domicilu fondu (Irsko vs. Německo)?",
        "a": "Domicil ovlivňuje zdanění dividend uvnitř fondu. Irské fondy (ISIN začíná IE) mají díky daňové smlouvě s USA srážkovou daň z amerických dividend 15 % místo 30 %. U evropských bankovních ETF (domicil DE nebo LU) tento rozdíl nehraje roli, protože americké akcie nedrží."
      }
    ]
  },
  "nejlepsi-ftse100-etf": {
    "introTitle": "FTSE 100 ETF: sázka na britské blue chips a dividendy",
    "intro": [
      "FTSE 100 sdružuje 100 největších firem kotovaných na londýnské burze. Většina z nich má převážně globální tržby: patří sem např. Shell a BP (energie), AstraZeneca a GSK (léčiva), Rio Tinto a Glencore (těžba), HSBC (banky), Unilever (spotřební zboží) nebo British American Tobacco. Index se tak chová spíš jako koš globálních tradičních odvětví než jako zrcadlo britské ekonomiky.",
      "Index se počítá v britských librách (GBP), takže i u fondu koupeného za koruny nebo eura nesete pohyb libry vůči koruně. FTSE 100 má vyšší dividendový výnos než americké nebo globální indexy a malou váhu technologických firem.",
      "V kategorii jsou fondy více emitentů, např. iShares Core FTSE 100 (distribuční IE0005042456, akumulační IE00B53HP851) nebo Vanguard FTSE 100 (distribuční VUKE, akumulační VUKG), a také třídy měnově zajištěné do EUR nebo USD. Vedle FTSE 100 existuje FTSE 250 (středně velké britské firmy) a FTSE All-Share (celý britský trh). Aktuální poplatky a velikosti fondů jsou v tabulce výše."
    ],
    "verdict": [
      "Fondy na FTSE 100 drží stejné firmy a liší se hlavně velikostí, poplatkem, třídou a měnovým zajištěním. TER velkých FTSE 100 fondů je nízký a rozdíly mezi nimi jsou malé – aktuální hodnoty jsou v tabulce výše.",
      "Akumulační třída dividendy reinvestuje, distribuční je vyplácí (vyplacené dividendy se v ČR daní 15 %). Třídy zajištěné do EUR tlumí pohyb libry vůči euru, ne vůči koruně, a mívají vyšší TER než nezajištěné."
    ],
    "forWhom": "Investoři FTSE 100 ETF používají hlavně jako doplněk ke globálnímu nebo americkému portfoliu, kterým zvyšují váhu tradičních odvětví (energie, těžba, banky, léčiva) a dividendových firem. Distribuční třídy využívají ti, kdo chtějí pravidelnou výplatu dividend. Index je sektorově koncentrovaný a technologie v něm mají malou váhu.",
    "risks": [
      "Měnové riziko libry: index je v GBP a posílení koruny vůči libře snižuje výnos v Kč. Třídy zajištěné do EUR tlumí jen pohyb vůči euru, ne vůči koruně.",
      "Sektorová koncentrace: index má velkou váhu energie, těžby, bank a léčiv a malou váhu technologií. Několik největších firem tvoří značnou část indexu, což zvyšuje závislost na jejich výsledcích i na cenách komodit.",
      "Pomalejší růst než globální trh: FTSE 100 dlouhodobě celkovým výnosem zaostával za americkými a globálními indexy. Vyšší dividenda neznamená vyšší celkový výnos.",
      "Záměna indexů: FTSE 100, FTSE 250 a FTSE All-Share se chovají odlišně; FTSE 250 je víc navázaný na domácí britskou ekonomiku. Index je uvedený v názvu fondu i v tabulce."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi FTSE 100, FTSE 250 a FTSE All-Share?",
        "a": "FTSE 100 sdružuje 100 největších firem na londýnské burze, převážně s globálními tržbami. FTSE 250 zahrnuje dalších 250 středně velkých společností, které jsou více navázané na domácí britskou ekonomiku. FTSE All-Share kombinuje obojí a pokrývá prakticky celý britský trh, takže nabízí nejširší diverzifikaci."
      },
      {
        "q": "Je FTSE 100 sázka na britskou ekonomiku?",
        "a": "Jen částečně. Velká část firem v indexu (Shell, BP, AstraZeneca, HSBC, Rio Tinto, Unilever) má většinu tržeb mimo Británii, často v dolarech. FTSE 100 proto reaguje spíš na světovou poptávku, ceny komodit a kurz libry než na britský HDP. Domácí britskou ekonomiku víc odráží FTSE 250."
      },
      {
        "q": "Mám vybrat akumulační, nebo distribuční verzi?",
        "a": "Distribuční třída (např. iShares Core FTSE 100 Dist, IE0005042456) vyplácí dividendy na účet; v ČR se daní 15 %. Akumulační třída (např. IE00B53HP851) dividendy reinvestuje uvnitř fondu, takže se průběžně nic nedaní. FTSE 100 patří k velkým indexům s vyšším dividendovým výnosem, takže rozdíl mezi třídami je tu citelnější."
      },
      {
        "q": "Jak funguje měnové riziko a pomůže zajištění do eura?",
        "a": "Index je v librách, takže nesete riziko pohybu GBP i při nákupu za koruny. Třídy zajištěné do eura (např. iShares Core FTSE 100 EUR Hedged) odstraňují kolísání libry vůči euru, ne eura vůči koruně, a mívají vyšší TER než nezajištěné třídy."
      },
      {
        "q": "Kde FTSE 100 ETF koupím a v jaké měně?",
        "a": "Fondy jako iShares Core FTSE 100 nebo Vanguard FTSE 100 (VUKE/VUKG) nabízí většina brokerů dostupných v ČR. Obchodují se nejčastěji v GBP nebo EUR; nákup za koruny znamená měnovou konverzi u brokera."
      },
      {
        "q": "Jak se v Česku daní zisk z FTSE 100 ETF?",
        "a": "Zisk z prodeje je v ČR osvobozen, pokud fond držíte déle než 3 roky (časový test), nebo pokud úhrn příjmů z prodeje cenných papírů za rok nepřesáhne 100 000 Kč (hodnotový test); od roku 2026 bez horního limitu. Jinak se zisk daní jako ostatní příjem. Vyplacené dividendy z distribuční třídy se daní 15 % v roce, kdy je obdržíte; akumulační třída nic nevyplácí. Text není daňové poradenství."
      }
    ]
  },
  "nejlepsi-growth-etf": {
    "introTitle": "Growth ETF: akcie firem s rychlým růstem tržeb a zisků",
    "intro": [
      "Growth (růstové) ETF investují do firem s nadprůměrným růstem tržeb a zisků, které zisk často reinvestují do expanze místo vyplácení dividend. Index vybírá akcie podle růstových ukazatelů, ne podle nízkého ocenění. V praxi to znamená velkou váhu technologických a spotřebitelských firem typu Apple, Microsoft, Nvidia, Amazon nebo Meta a malou váhu bank, energetiky či utilit.",
      "Nejrozšířenějším benchmarkem je Russell 1000 Growth – růstová část indexu tisíce největších amerických firem. Sledují ho například iShares Russell 1000 Growth (IE000NITTFF2) a Amundi Russell 1000 Growth (IE0005E8B9S4). Vedle nich existují aktivně řízené fondy, například JPMorgan US Growth Equity Active (IE0005CH3U28), a růstové či momentum indexy MSCI. Aktuální poplatky a velikosti jsou v tabulce výše.",
      "Fondy mají většinou irský domicil a obchodují se v EUR nebo USD. Kvůli převaze amerických akcií ovlivňuje výnos v korunách hlavně kurz USD/CZK."
    ],
    "verdict": [
      "Definice „growth“: Russell 1000 Growth, MSCI Growth a momentum indexy vybírají akcie odlišně, a mají proto různé složení i chování.",
      "Správa a náklady: pasivní fondy na Russell 1000 Growth mají nižší TER než aktivně řízené růstové fondy. U fondů s malým objemem je vyšší riziko sloučení nebo zrušení a širší rozpětí nákup/prodej. Akumulační třída dividendy reinvestuje; růstové firmy jich ale vyplácejí málo."
    ],
    "forWhom": "Investoři growth ETF používají ke zvýšení váhy rychle rostoucích, převážně technologických firem v akciové části portfolia, například vedle širšího indexu. Fondy kolísají výrazněji než široký trh a dividendy vyplácejí jen minimálně.",
    "risks": [
      "Koncentrace do několika technologických firem: největší tituly tvoří velkou část Russell 1000 Growth, takže výsledek fondu do velké míry určuje pár akcií.",
      "Citlivost na sazby a ocenění: growth akcie se obchodují za vysoké násobky zisků. Při růstu sazeb nebo zklamání z výsledků mohou klesat výrazněji než value akcie, jako v roce 2022.",
      "Střídání stylů: growth a value se ve vedení střídají a každý z nich může roky zaostávat. Po silných letech růstových akcií může následovat dlouhé období slabších výsledků.",
      "Měnové a geografické riziko: fondy jsou převážně americké a v USD, výnos v korunách ovlivňuje kurz USD/CZK a výsledek závisí na jediném trhu."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi Growth a Value ETF?",
        "a": "Growth ETF vybírají rychle rostoucí firmy s vysokým oceněním, které zisk reinvestují místo vyplácení dividend – typicky technologie. Value ETF vybírají akcie levné vůči ziskům nebo účetní hodnotě, často s vyšší dividendou. Oba styly se ve výkonnosti střídají; growth obvykle kolísá víc."
      },
      {
        "q": "Vyplácejí Growth ETF dividendy?",
        "a": "Jen minimálně. Růstové firmy zisk většinou reinvestují do expanze, takže dividendový výnos těchto fondů bývá nízký. Fondy na Russell 1000 Growth v přehledu jsou akumulační."
      },
      {
        "q": "Který Growth ETF má nejnižší poplatky?",
        "a": "Pasivní fondy na Russell 1000 Growth od iShares a Amundi mají poplatky podobné, aktivně řízené růstové fondy (například JPMorgan US Growth Equity Active) mají TER vyšší. Aktuální poplatky jsou v tabulce výše."
      },
      {
        "q": "Jsou Growth ETF vhodné pro začátečníky?",
        "a": "Srovnávač vhodnost pro konkrétního investora nehodnotí. Growth ETF kolísají víc než široký trh, jsou koncentrované do technologických firem a v některých fázích cyklu mohou roky zaostávat. Široké indexy (svět, S&P 500) růstové firmy obsahují také, jen v menší váze."
      },
      {
        "q": "Jak se v Česku daní zisk z Growth ETF?",
        "a": "Platí standardní pravidla pro akciové ETF: zisk z prodeje je osvobozen po splnění časového testu (držba déle než 3 roky, od roku 2026 bez horního limitu) nebo hodnotového testu (příjmy z prodeje cenných papírů do 100 000 Kč za rok). U akumulační třídy investor neřeší průběžné dividendy. Nejde o daňové poradenství."
      },
      {
        "q": "Není lepší koupit rovnou technologický nebo Nasdaq ETF?",
        "a": "Jde o odlišné expozice. Growth ETF (Russell 1000 Growth) je širší než čistě technologický fond – obsahuje i spotřebitelské a zdravotnické růstové firmy, takže je o něco méně koncentrovaný než technologické fondy nebo Nasdaq 100. Složení se ale hodně překrývá kvůli velké váze technologických firem v obou případech."
      }
    ]
  },
  "nejlepsi-healthcare-etf": {
    "introTitle": "Healthcare ETF: farmacie, zdravotnická technika a péče v jednom fondu",
    "intro": [
      "Healthcare ETF sdružují akcie zdravotnických firem – farmaceutických koncernů (Johnson & Johnson, Eli Lilly, Novo Nordisk, Roche, Novartis, Pfizer), výrobců zdravotnických přístrojů a laboratorní techniky (Abbott, Medtronic, Thermo Fisher) i pojišťoven a poskytovatelů péče (UnitedHealth). Sektor se historicky řadí mezi defenzivní: poptávka po lécích a péči závisí na hospodářském cyklu méně než u většiny odvětví.",
      "Dlouhodobými faktory jsou stárnutí populace v USA, Evropě i Japonsku a nové léčebné postupy, například léky na obezitu a cukrovku na bázi GLP-1, imunoonkologie nebo genové terapie. Výkonnost sektoru je proto v posledních letech výrazně tažená několika inovativními firmami.",
      "Fondy jsou převážně UCITS s irským domicilem a obchodují se v EUR nebo USD. Podkladové akcie jsou hlavně americké a švýcarské, takže pro výnos v korunách je důležitější kurz koruny vůči dolaru než měna, v níž se ETF obchoduje."
    ],
    "verdict": [
      "Fondy se dělí podle indexu: globální (MSCI World Health Care – USA, Evropa, Japonsko, přes sto firem), americké (S&P 500 Health Care) a evropské (MSCI Europe Health Care). Globální index zahrnuje vedle amerických firem i Roche, Novartis nebo Novo Nordisk; americký je čistě z USA.",
      "Irský domicil díky smlouvě s USA snižuje srážkovou daň z amerických dividend uvnitř fondu z 30 na 15 %. Akumulační třída dividendy reinvestuje, distribuční je vyplácí (v ČR se daní 15 %). Fondy se dále liší poplatkem (TER) a velikostí; aktuální hodnoty jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají k navýšení váhy zdravotnictví nad tržní úroveň v širokém akciovém portfoliu. Sektor bývá méně citlivý na hospodářský cyklus, ale může roky zaostávat za trhem a reaguje na regulaci cen léků.",
    "risks": [
      "Sektorová koncentrace: fond stojí na jediném odvětví. Zdravotnictví může roky zaostávat za širokým trhem, například v obdobích, kdy trh táhnou technologie.",
      "Regulační a politické riziko: ceny léků, reformy zdravotního pojištění v USA (Medicare) i evropská cenová regulace přímo ovlivňují marže firem a sektor citlivě reaguje na politické změny.",
      "Klinické studie a vypršení patentů: neúspěch klíčové studie nebo konec patentu na hlavní lék dokáže srazit akcii firmy o desítky procent; u koncentrovanějších fondů to táhne dolů celý fond.",
      "Měnové riziko: většina podkladu je v dolarech, takže posílení koruny vůči USD snižuje výnos v Kč, i když se ETF obchoduje v eurech."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi globálním a americkým healthcare ETF?",
        "a": "Globální fond (MSCI World Health Care) drží firmy z USA, Evropy i Japonska – tedy i Roche, Novartis nebo Novo Nordisk vedle amerických koncernů. Americký fond (S&P 500 Health Care) obsahuje jen firmy z USA. Globální varianta je geograficky širší, americká je koncentrovaná do jedné země; poplatky obou typů jsou v tabulce výše."
      },
      {
        "q": "Je healthcare ETF opravdu defenzivní i dnes?",
        "a": "Historicky ano – poptávka po péči je stabilní a velké firmy mají silné cash flow. V posledních letech je ale výkonnost hodně tažená úzkou skupinou inovativních firem (např. výrobci léků na obezitu), takže sektor kolísá víc než dřív. Defenzivní charakter platí spíš v horizontu celého cyklu než rok od roku."
      },
      {
        "q": "Akumulační, nebo distribuční třída?",
        "a": "Akumulační (Acc) třída dividendy reinvestuje uvnitř fondu, takže je průběžně nedaníte ani ručně nereinvestujete. Distribuční (Dist) třída je vyplácí na účet a v ČR se daní 15 %. Zdravotnictví nepatří mezi sektory s nejvyššími dividendami, rozdíl mezi třídami je tu proto menší než např. u realit."
      },
      {
        "q": "Musím dividendy z healthcare ETF danit v Česku?",
        "a": "U akumulačního fondu se dividendy nevyplácejí, takže průběžně nedaníte nic. U distribučního zdaňujete přijaté dividendy sazbou 15 %. Zisk z prodeje je v ČR osvobozen po více než 3 letech držení (časový test); od roku 2026 bez horního limitu."
      },
      {
        "q": "Kolik z portfolia dát do healthcare ETF?",
        "a": "Univerzální pravidlo neexistuje. Zdravotnictví je obsažené už v širokých akciových indexech v tržní váze; sektorový fond jeho váhu zvyšuje. Čím větší podíl sektorového fondu, tím víc výsledek celého portfolia závisí na jednom odvětví."
      },
      {
        "q": "Kde healthcare ETF koupím a v jaké měně?",
        "a": "Nabízí je většina brokerů dostupných v Česku. Většina se obchoduje v eurech nebo dolarech na evropských burzách, podkladové akcie jsou ale hlavně v dolarech – hlavní měnové riziko tedy představuje kurz koruny vůči dolaru, ne vůči euru."
      }
    ]
  },
  "nejlepsi-japonske-etf": {
    "introTitle": "Co jsou japonské ETF?",
    "intro": [
      "Japonské ETF drží akcie japonských firem, například Toyoty, Sony, Nintenda nebo Keyence. Většina fondů sleduje index MSCI Japan, který pokrývá velké a střední firmy (zhruba 85 % volně obchodovatelné tržní kapitalizace). MSCI Japan IMI přidává i malé firmy.",
      "Alternativou je Nikkei 225, který je vážený cenou akcií (o váze rozhoduje nominální cena akcie, ne velikost firmy). Mezi velké fondy patří iShares Core MSCI Japan IMI (IE00B4L5YX21) a Amundi Core MSCI Japan (LU1781541252).",
      "V indexu MSCI World tvořilo Japonsko v roce 2026 kolem 6 % váhy. Fondy se obchodují v eurech nebo dolarech, podkladové akcie jsou v jenech; nezajištěné třídy proto nesou kurzové riziko jenu."
    ],
    "verdict": [
      "Fondy se liší hlavně indexem (MSCI Japan, širší MSCI Japan IMI, nebo cenově vážený Nikkei 225), poplatkem (TER), velikostí, replikací a třídou: akumulační dividendy reinvestuje, distribuční je vyplácí. Některé třídy jsou měnově zajištěné (hedged) do EUR nebo USD.",
      "ESG a klimatické varianty indexu vylučují část firem, a proto se od celého trhu odchylují. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají ke zvýšení váhy Japonska nad podíl, který má ve světovém indexu, nebo k regionální diverzifikaci mimo USA. Kdo drží globální ETF, má Japonsko v portfoliu už zastoupené.",
    "risks": [
      "Měnové riziko jenu: nezajištěné fondy nesou pohyb jenu vůči euru, dolaru i koruně; i při růstu japonských akcií může slabší jen snížit výnos v korunách.",
      "Exportní a sektorová citlivost: velkou váhu mají automobilky, průmysl a technologie, citlivé na globální poptávku a kurz jenu.",
      "Demografie a strukturální faktory: stárnoucí a klesající populace a dlouhé období slabého domácího růstu.",
      "Riziko jednoho regionu: samostatný japonský fond je koncentrovanější než globální index."
    ],
    "faqs": [
      {
        "q": "Je lepší MSCI Japan, nebo Nikkei 225?",
        "a": "MSCI Japan váží firmy podle tržní kapitalizace a pokrývá zhruba 85 % volně obchodovatelné tržní kapitalizace japonského trhu. Nikkei 225 je vážený cenou akcií, takže větší váhu mají akcie s vysokou nominální cenou bez ohledu na velikost firmy. Většina UCITS ETF sleduje MSCI Japan nebo MSCI Japan IMI."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční japonské ETF?",
        "a": "Akumulační třída dividendy reinvestuje uvnitř fondu a v průběhu držení se nedaní. Distribuční třída je vyplácí na účet a vyplacené dividendy se v ČR daní 15 %."
      },
      {
        "q": "Jak se japonské ETF daní v Česku?",
        "a": "Platí standardní česká pravidla pro cenné papíry. Zisk z prodeje ETF je osvobozen při držení alespoň 3 roky (časový test) nebo když roční úhrn příjmů z prodeje cenných papírů nepřesáhne 100 000 Kč (hodnotový test). Vyplacené dividendy distribučních fondů se daní 15 %. Pravidla se mohou měnit."
      },
      {
        "q": "Potřebuji fond zajištěný proti pohybu jenu (hedged)?",
        "a": "Nezajištěný fond nese měnové riziko jenu: když jen oslabí, výnos v přepočtu klesá, i když japonské akcie rostou. Zajištěná (EUR-hedged) třída tento pohyb vůči euru tlumí, za zajištění ale platí náklady a riziko EUR/CZK zůstává."
      },
      {
        "q": "Kolik Japonska mám mít v portfoliu?",
        "a": "Ve světovém indexu MSCI World mělo Japonsko v roce 2026 kolem 6 % váhy, což je orientační tržní poměr. Vyšší podíl znamená větší závislost na jediném regionu."
      },
      {
        "q": "Kde japonské ETF koupím a v jaké měně se obchodují?",
        "a": "Fondy jako iShares Core MSCI Japan IMI (IE00B4L5YX21) se obchodují na evropských burzách obvykle v eurech nebo dolarech; dostupnost se liší podle brokera. Podkladové akcie jsou v jenech, takže měnové riziko jenu nesete bez ohledu na měnu obchodování."
      }
    ]
  },
  "nejlepsi-komoditni-etf": {
    "introTitle": "Komoditní ETF: jak investovat do surovin přes jeden fond",
    "intro": [
      "Diverzifikované komoditní ETF sledují koš surovin, obvykle přes futures kontrakty, ne přes fyzické zásoby. Koš typicky pokrývá energie (ropa, zemní plyn), zemědělské plodiny (kukuřice, sója, pšenice, káva, cukr), průmyslové kovy (měď, hliník, zinek) a drahé kovy (zlato, stříbro). Komodity reagují na inflaci, geopolitiku a nabídkové šoky, ne na zisky firem.",
      "Investoři je používají hlavně k diverzifikaci a jako částečnou ochranu před inflací. Komodity se historicky vyvíjely odlišně od akcií a dluhopisů – např. v letech 2021–2022 při nabídkové inflaci rostly. Na rozdíl od akcií ale nevyplácejí dividendy ani nevytvářejí zisk; výnos plyne jen ze změny cen a z mechaniky futures.",
      "Koš komodit se oceňuje v dolarech a fondy jsou většinou vedené v USD, takže do výnosu v korunách vstupuje kurz CZK/USD. Příkladem diverzifikovaných fondů jsou iShares Diversified Commodity Swap (IE00BDFL4P12) nebo WisdomTree Broad Commodities (IE00BKY4W127). Aktuální poplatky a velikosti fondů jsou v tabulce výše."
    ],
    "verdict": [
      "Struktura fondu: většina diverzifikovaných komoditních ETF je swapová nebo drží futures, ne fyzické suroviny. Výnos pak ovlivňuje rolování kontraktů (contango) a u swapů i riziko protistrany. Některé indexy volí splatnosti kontraktů tak, aby ztrátu z rolování zmírnily.",
      "Složení koše: indexy se liší váhou energií, kovů a zemědělství. Fond na jednu komoditu (např. zlato, často fyzicky krytý) je jiný produkt než diverzifikovaný koš.",
      "Poplatek, velikost a třída: větší fond mívá užší rozpětí nákup/prodej. Futures fondy dividendy nevyplácejí, proto bývají akumulační. Aktuální poplatky a velikosti fondů jsou v tabulce výše."
    ],
    "forWhom": "Investoři komoditní ETF používají jako menší doplněk k akciím a dluhopisům, hlavně kvůli diverzifikaci a jako částečnou ochranu před inflací. Komodity nevyplácejí dividendy a jejich ceny mohou roky stagnovat nebo klesat. Výnos silně kolísá podle hospodářského cyklu.",
    "risks": [
      "Contango a náklady na rolování: fondy rolují futures kontrakty. Když jsou vzdálenější kontrakty dražší (contango), fond při rolování ztrácí a jeho výnos může dlouhodobě zaostávat za spotovými cenami komodit.",
      "Měnové riziko CZK/USD: komodity se oceňují v dolarech. Posílení koruny vůči dolaru snižuje výnos v Kč, i když ceny komodit v dolarech rostou.",
      "Vysoké kolísání a cykličnost: komoditám se dařilo hlavně při inflaci a v pozdní fázi hospodářského cyklu, v recesi a při deflaci mohou prudce klesat. Dvouciferné propady v jednotlivých letech se vyskytují.",
      "Riziko protistrany u swapových fondů: swapová replikace znamená závislost na protistraně derivátu. Emitenti riziko omezují kolaterálem, jde ale o rozdíl oproti fyzicky krytým produktům."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi diverzifikovaným komoditním ETF a zlatým ETF?",
        "a": "Diverzifikovaný komoditní ETF drží koš surovin napříč energiemi, zemědělstvím a kovy, obvykle přes futures. Zlaté ETF (ETC) sledují jen jednu komoditu a bývají fyzicky kryté – drží skutečné zlato v trezoru. Jde o dva odlišné produkty: zlato je jedna komodita, koš je širší expozice na suroviny."
      },
      {
        "q": "Vyplácejí komoditní ETF dividendy a jak se daní v Česku?",
        "a": "Komoditní futures ETF prakticky nevyplácejí dividendy; výnos plyne z pohybu cen a z rolování kontraktů, proto bývají akumulační. Zisk z prodeje je v ČR osvobozen, pokud fond držíte déle než 3 roky (časový test), nebo pokud úhrn příjmů z prodeje cenných papírů za rok nepřesáhne 100 000 Kč (hodnotový test); od roku 2026 bez horního limitu. Jinak se zisk daní jako ostatní příjem. Text není daňové poradenství."
      },
      {
        "q": "Co je contango a proč mi ukrajuje z výnosu?",
        "a": "Contango je stav, kdy jsou futures kontrakty s pozdější splatností dražší než ty blízké. Fond musí při expiraci levnější kontrakt prodat a dražší koupit, čímž při každém rolování ztrácí. Výnos komoditního ETF proto může dlouhodobě zaostávat za spotovou cenou surovin. Indexy s optimalizací splatnosti tuto ztrátu zmírňují."
      },
      {
        "q": "Kolik procent portfolia mám do komodit dát?",
        "a": "Konkrétní podíl srovnávač neurčuje. Komodity se v portfoliích obvykle objevují jako menšinová, doplňková složka kvůli diverzifikaci a ochraně před inflací. Vyšší podíl zvyšuje kolísání portfolia a při dlouhé stagnaci komodit brzdí celkový výnos."
      },
      {
        "q": "Chrání komoditní ETF opravdu před inflací?",
        "a": "Historicky hlavně při nabídkové inflaci tažené růstem cen energií a surovin, jako v letech 2021–2022. Záruka to není: v obdobích slabé poptávky nebo deflace komodity klesají."
      },
      {
        "q": "Které komoditní ETF jsou nejlevnější a největší?",
        "a": "Poplatky a velikosti se mění, proto je v textu neuvádíme. Aktuální TER a velikosti všech fondů jsou v tabulce výše (řazení „Nejlevnější“, „Největší“) s datem, ke kterému platí. Větší fond mívá užší rozpětí nákup/prodej."
      }
    ]
  },
  "nejlepsi-kyberbezpecnost-etf": {
    "introTitle": "Kyberbezpečnostní ETF: tematické fondy na ochranu dat a sítí",
    "intro": [
      "Kyberbezpečnostní ETF jsou tematické akciové fondy zaměřené na firmy z oblasti ochrany dat, sítí, koncových zařízení a správy identit, například CrowdStrike, Palo Alto Networks, Fortinet, Zscaler nebo Check Point. Na rozdíl od širokého technologického ETF obsahují úzkou skupinu firem jednoho oboru.",
      "Velká část tržeb oboru plyne z předplatného (SaaS), takže příjmy firem jsou opakované. Akcie ale patří k růstovým technologickým titulům s vysokým oceněním a při přehodnocení očekávaného růstu mohou klesat o desítky procent. Poptávku po oboru ovlivňuje přesun do cloudu, umělá inteligence i regulace typu GDPR a NIS2.",
      "Fondy v tabulce mají irský domicil a obchodují se v EUR nebo USD; podkladové akcie jsou převážně americké. Mezi největší patří L&G Cyber Security (IE00BYPLS672), iShares Digital Security (IE00BG0J4C88) a First Trust Nasdaq Cybersecurity (IE00BF16M727). Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "verdict": [
      "Čistota tématu: L&G Cyber Security a First Trust Nasdaq Cybersecurity se zaměřují přímo na kyberbezpečnost, iShares Digital Security má širší záběr přes digitální bezpečnost a drží výrazně více titulů. Složení fondů se proto liší.",
      "Náklady a velikost: TER tematických kyberbezpečnostních fondů je vyšší než u širokých indexových fondů a trvale snižuje čistý výnos. Větší fondy mívají užší rozpětí nákup/prodej. Akumulační třída dividendy reinvestuje, distribuční je vyplácí; dividendový výnos je u tohoto tématu nízký."
    ],
    "forWhom": "Investoři kyberbezpečnostní ETF používají jako menší tematickou pozici vedle širokých indexů, když chtějí cílenou expozici k jednomu oboru. Fondy jsou koncentrované a kolísají výrazně víc než široký trh.",
    "risks": [
      "Koncentrace do úzkého tématu: několik velkých firem tvoří značnou část fondu, takže problém jediné firmy (například výpadek nebo selhání jejího produktu) se promítne do celého ETF.",
      "Vysoké ocenění a kolísavost: akcie se obchodují za vysoké násobky tržeb. Při zpomalení růstu nebo růstu úrokových sazeb sektor klesá prudčeji než široký trh.",
      "Měnové riziko: fondy jsou v EUR nebo USD s převážně americkými aktivy, takže posílení koruny vůči dolaru snižuje výnos v korunách.",
      "Vyšší náklady a riziko odlivu zájmu: TER je vyšší než u širokých indexů a tematické fondy mohou při odlivu investorů ztratit velikost i likviditu."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi ISPY, SECT a CIBR?",
        "a": "ISPY (L&G Cyber Security) se zaměřuje výhradně na kyberbezpečnost a patří k největším fondům tématu. SECT (iShares Digital Security) má širší záběr přes digitální bezpečnost a drží víc titulů. CIBR (First Trust) sleduje index Nasdaq CTA Cybersecurity. Všechny tři jsou UCITS fondy s irským domicilem; aktuální poplatky jsou v tabulce výše."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční verzi?",
        "a": "Akumulační (Acc) třída dividendy reinvestuje uvnitř fondu, distribuční je vyplácí a vyplacené dividendy se v ČR daní 15 %. Dividendový výnos je u tohoto tématu nízký a většina fondů v přehledu je akumulačních."
      },
      {
        "q": "Jak se kyberbezpečnostní ETF zdaňují v Česku?",
        "a": "Zisk z prodeje je osvobozen po splnění časového testu (držba déle než 3 roky, od roku 2026 bez horního limitu) nebo hodnotového testu (příjmy z prodeje cenných papírů do 100 000 Kč za rok). Akumulační fond nevyplácí dividendy, takže během držení investor neřeší průběžné zdanění. U irského domicilu je srážková daň z amerických dividend uvnitř fondu snížena na 15 %. Nejde o daňové poradenství."
      },
      {
        "q": "Není lepší koupit rovnou širší technologické ETF?",
        "a": "Jde o odlišné expozice. Široké technologické ETF je diverzifikovanější a mívá nižší TER, kyberbezpečnost v něm ale tvoří jen malou část. Tematický fond nabízí cílenou expozici k jednomu oboru za cenu vyšší koncentrace a vyššího poplatku."
      },
      {
        "q": "Kde tyto ETF koupím a nesou obchod zdarma?",
        "a": "ISPY, SECT i CIBR se obchodují na evropských burzách a nabízejí je brokeři s přístupem na tyto burzy. Poplatky za obchod a za měnovou konverzi do EUR nebo USD se liší podle brokera a jeho ceníku."
      },
      {
        "q": "Proč mají kyberbezpečnostní ETF vyšší poplatky?",
        "a": "Tematické indexy s užší množinou firem a menším objemem spravovaných aktiv mívají vyšší náklady než široké indexové fondy. TER se strhává průběžně z majetku fondu, takže dlouhodobě snižuje čistý výnos."
      }
    ]
  },
  "nejlepsi-msci-world-etf": {
    "introTitle": "MSCI World ETF: akcie vyspělých zemí v jednom fondu",
    "intro": [
      "MSCI World je akciový index, který drží zhruba 1 300 velkých a středních firem z 23 rozvinutých zemí a pokrývá kolem 85 % tržní kapitalizace volně obchodovaných akcií v každé z nich – od amerických technologických firem přes evropské průmyslové koncerny až po japonské a australské společnosti. Index obsahuje pouze rozvinuté trhy: Čína, Indie, Tchaj-wan ani jiné rozvíjející se ekonomiky v něm nejsou. Ty přidává širší index MSCI ACWI.",
      "Index je vážený podle tržní kapitalizace, a proto v něm mají velkou váhu USA – podle factsheetu MSCI k 30. 6. 2026 72 %. MSCI World tak není rovnoměrně rozprostřený po světě; jde převážně o USA doplněné zbytkem vyspělého světa. V krizi 2007–2009 index od vrcholu ztratil 57 % (v USD).",
      "Fondy na tento index se obchodují nejčastěji v EUR nebo USD, takže výnos v korunách ovlivňuje kurz: oslabení koruny zhodnocení zvyšuje, posílení ho snižuje. To platí pro všechny zahraniční akciové ETF, nejen pro MSCI World."
    ],
    "verdict": [
      "Fondy na MSCI World drží stejné firmy a liší se hlavně poplatkem (TER), velikostí, akumulací/distribucí dividend, domicilem a replikací. Irský domicil (ISIN začíná IE) snižuje díky daňové smlouvě s USA srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 %. Akumulační třída dividendy reinvestuje, distribuční je vyplácí na účet.",
      "Fyzická replikace znamená, že fond drží akcie z indexu (často jen výběr – sampling), swapová, že výnos indexu dodává protistrana derivátu. Jak přesně fond index kopíruje, ukazuje tracking difference; u velkých fondů bývá rozdíl malý. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "MSCI World pokrývá jedním fondem akcie vyspělých zemí; rozvíjející se trhy (Čína, Indie, Tchaj-wan) v něm nejsou – kdo je chce mít, přidává samostatný fond nebo volí MSCI ACWI. Jde o čistě akciové riziko s dočasnými propady o desítky procent, proto se fondy používají hlavně k dlouhodobému investování.",
    "risks": [
      "Vysoká koncentrace do USA: americké firmy tvořily k 30. 6. 2026 72 % indexu a velkou váhu má několik technologických megafirem. Výsledek fondu tak z velké části závisí na americkém trhu.",
      "Bez rozvíjejících se trhů: Čína, Indie, Tchaj-wan ani střední Evropa v indexu nejsou, takže při jejich růstu MSCI World zaostane a diverzifikace není celosvětová.",
      "Měnové riziko vůči koruně: fondy jsou vedené v EUR nebo USD a pohyb kurzu koruny může výnos v Kč výrazně zvýšit i snížit. Měnově zajištěné (hedged) třídy toto riziko tlumí, ale mají vyšší náklady a ruší měnovou diverzifikaci.",
      "Tracking difference: u menších fondů může být rozdíl oproti indexu větší a likvidita horší – nízké TER nemusí znamenat nejnižší reálné náklady."
    ],
    "faqs": [
      {
        "q": "Je lepší MSCI World, nebo S&P 500?",
        "a": "S&P 500 je čistě americký index zhruba 500 velkých firem, MSCI World přidává Evropu, Japonsko a další vyspělé trhy – s váhou USA kolem 72 % (k 30. 6. 2026). MSCI World je tedy geograficky širší a méně závislý na jediné zemi. Který index vynese víc, se v různých obdobích střídá."
      },
      {
        "q": "Proč má MSCI World tak velkou váhu USA?",
        "a": "Index váží firmy podle tržní kapitalizace a americké společnosti tvoří většinu hodnoty burz vyspělého světa. Váha USA proto kolísá podle toho, jak si americký trh vede vůči zbytku světa; podle factsheetů MSCI se v roce 2026 pohybovala kolem 72–74 %. Není to chyba indexu, ale MSCI World je z velké části americký."
      },
      {
        "q": "Akumulační, nebo distribuční MSCI World ETF?",
        "a": "Akumulační třída dividendy automaticky reinvestuje uvnitř fondu a průběžně se nedaní. Distribuční třída je vyplácí na účet jako pravidelný příjem a v ČR se vyplacené dividendy daní 15 %. Zisk z prodeje je u obou osvobozen po 3 letech držení (časový test)."
      },
      {
        "q": "Musím k MSCI World dokupovat i emerging markets?",
        "a": "Nemusíte. MSCI World žádné rozvíjející se trhy neobsahuje, takže kdo chce celosvětové portfolio, přidává fond na MSCI Emerging Markets. Alternativou je jeden fond na MSCI ACWI, který rozvinuté i rozvíjející se trhy spojuje v tržních vahách."
      },
      {
        "q": "Kolik stojí nejlevnější MSCI World ETF a jak vybírat podle TER?",
        "a": "TER fondů na MSCI World se pohybuje v desetinách procenta ročně; aktuální hodnoty jednotlivých fondů jsou v tabulce výše. TER ale není jediný náklad – u indexu s téměř 1 300 tituly hraje roli i to, jak přesně fond index sleduje (tracking difference). Levnější fond s horším sledováním může v čistém výsledku vyjít hůř než o setiny procenta dražší, přesněji vedený fond."
      },
      {
        "q": "Vyplatí se měnově zajištěná (hedged) verze pro Čecha?",
        "a": "Zajištěná třída tlumí kurzové výkyvy vůči měně, do které je zajištěná – u EUR Hedged vůči euru, ne vůči koruně. Zajištění má vlastní náklady a odstraňuje měnovou diverzifikaci, kterou nezajištěný fond díky expozici v mnoha měnách má. Výnos v korunách u nezajištěné třídy více kolísá s kurzem."
      }
    ]
  },
  "nejlepsi-nasdaq-etf": {
    "introTitle": "Co je index Nasdaq-100?",
    "intro": [
      "Nasdaq-100 sdružuje sto největších nefinančních společností obchodovaných na americké burze Nasdaq. Banky, pojišťovny ani investiční firmy do něj z principu nepatří, a index má proto velkou váhu technologií. Několik největších firem tvoří velkou část jeho hodnoty.",
      "Evropští investoři k němu mají přístup přes UCITS ETF, například iShares Nasdaq 100 (IE00B53SZB19), Xtrackers Nasdaq 100 (IE00BMFKG444) nebo Amundi Nasdaq-100 Swap (LU1681038243). Podkladem jsou americké akcie v dolarech, výnos v korunách proto ovlivňuje kurz USD/CZK.",
      "Index v minulosti kolísal víc než S&P 500 a měl hlubší propady."
    ],
    "verdict": [
      "Fondy na Nasdaq-100 drží stejný index a liší se hlavně poplatkem (TER), velikostí, likviditou, replikací (fyzická, nebo swap) a třídou: akumulační dividendy reinvestuje, distribuční je vyplácí. Nejstarší a největší fond nemusí být nejlevnější.",
      "Irský domicil (ISIN začínající IE) snižuje srážkovou daň z amerických dividend uvnitř fondu na 15 % místo 30 %. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají jako růstovou, technologicky zaměřenou pozici, obvykle vedle širšího jádra portfolia (S&P 500 nebo MSCI World). Index je sektorově i firemně koncentrovaný, chybí mu finanční sektor a v minulosti měl hlubší propady než široký trh.",
    "risks": [
      "Koncentrace do největších firem: několik technologických gigantů tvoří velkou část indexu, jejich propad stáhne celý fond.",
      "Sektorové riziko: index nemá finanční sektor a je silně technologický, při slabosti technologií klesá víc než široký trh.",
      "Hlubší propady: v roce 2022 Nasdaq-100 klesl zhruba o třetinu (S&P 500 asi o 18 %), v letech 2000–2002 ztratil přes tři čtvrtiny hodnoty.",
      "Měnové riziko USD/CZK: posílení koruny vůči dolaru snižuje výnos v korunách i tehdy, když index v dolarech roste."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi NASDAQ 100 a S&P 500?",
        "a": "Nasdaq-100 obsahuje 100 největších nefinančních firem z burzy Nasdaq a má velkou váhu technologií; banky a pojišťovny nezahrnuje. S&P 500 obsahuje zhruba 500 firem napříč všemi sektory. Nasdaq-100 v minulosti víc kolísal a měl hlubší propady."
      },
      {
        "q": "Který NASDAQ ETF je nejlepší pro českého investora?",
        "a": "Fondy na Nasdaq-100 sledují stejný index a liší se poplatkem, velikostí, replikací, domicilem a třídou. Irský domicil snižuje srážkovou daň z amerických dividend uvnitř fondu (15 % místo 30 %), akumulační třída dividendy reinvestuje. Pořadí podle poplatků a velikosti je v tabulce výše; žebříček řadí fondy podle dat."
      },
      {
        "q": "Vyplácejí NASDAQ 100 ETF dividendy?",
        "a": "Velká část fondů na Nasdaq-100 je akumulačních, dividendy tedy reinvestují. Firmy v indexu vyplácejí relativně nízké dividendy. Distribuční třídy existují, například iShares Nasdaq 100 UCITS ETF (DE), DE000A0F5UF5; vyplacené dividendy se v ČR daní 15 %."
      },
      {
        "q": "Jak se daní zisk z NASDAQ ETF v Česku?",
        "a": "Zisk z prodeje ETF je osvobozen při držení déle než 3 roky (časový test) nebo když roční úhrn příjmů z prodeje cenných papírů nepřesáhne 100 000 Kč (hodnotový test). U akumulačního fondu se během držení nevyplácejí dividendy, které by se danily. Pravidla se mohou měnit."
      },
      {
        "q": "Je swapová replikace u NASDAQ ETF bezpečná?",
        "a": "Swapová (syntetická) replikace je u UCITS fondů regulovaná a pravidla UCITS omezují expozici vůči protistraně. Fyzická replikace drží akcie indexu napřímo a její složení je přímo vidět; swapová kopíruje výnos indexu přes derivát. Způsob replikace každého fondu je uveden v tabulce."
      },
      {
        "q": "Kolik mě NASDAQ ETF stojí ročně na poplatcích?",
        "a": "Roční nákladovost (TER) fondů na Nasdaq-100 se liší podle emitenta a nejstarší fondy nemusí být nejlevnější; aktuální hodnoty jsou v žebříčku „Nejlevnější (TER)“ výše. K TER se připočítávají poplatky brokera a případná konverze měny."
      }
    ]
  },
  "nejlepsi-robotika-etf": {
    "introTitle": "Robotika ETF: sázka na automatizaci, průmyslové roboty a Industry 4.0",
    "intro": [
      "Robotika ETF jsou tematické akciové fondy zaměřené na průmyslovou automatizaci, výrobu robotů, senzoriku a autonomní systémy. Typická portfolia kombinují evropské a japonské průmyslové firmy jako ABB, Fanuc nebo Keyence s americkými automatizačními firmami (Rockwell Automation, Emerson) a dodavateli komponent, čipů a softwaru. Řada fondů dnes robotiku spojuje s umělou inteligencí, takže hranice mezi robotika ETF a AI ETF se stírá.",
      "Fondy jsou v provedení UCITS s domicilem v Irsku (ISIN začíná IE) nebo Lucembursku (LU). Liší se hlavně indexem: iShares Automation & Robotics (IE00BYZK4552) pokrývá širší automatizaci, L&G ROBO Global Robotics and Automation (IE00BMW3QX54) užší robotiku a Amundi MSCI Robotics & AI (LU1861132840) kombinuje robotiku s umělou inteligencí. Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "Fondy jsou vedené v EUR nebo USD, takže výnos v korunách ovlivňuje kurz koruny. Robotika patří k dražším a kolísavějším tematickým kategoriím."
    ],
    "verdict": [
      "Index a vymezení tématu: širší automatizace, užší robotika, nebo kombinace robotiky a AI. Metodika indexu (rovnoměrné, nebo tržní váhy) určuje, jak koncentrované a kolísavé portfolio fond drží.",
      "Poplatek a velikost: TER robotických fondů se mezi sebou výrazně liší a rozdíl se za roky sčítá. Větší fond mívá lepší likviditu a nižší riziko zrušení. Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "Třída a domicil: akumulační třída dividendy reinvestuje, distribuční je vyplácí; dividendový výnos robotických firem bývá nízký. Irský domicil snižuje srážkovou daň z amerických dividend uvnitř fondu."
    ],
    "forWhom": "Investoři je používají jako menší tematickou pozici na trend automatizace vedle širokého akciového fondu. Tematický fond může roky zaostávat za širokým trhem a kolísá víc. Část firem se překrývá s AI a technologickými ETF.",
    "risks": [
      "Sektorová a tematická koncentrace: portfolio je vázané na úzkou skupinu firem z automatizace a technologií, silně koreluje s technologickým sektorem a v korekcích může padat víc než široký trh.",
      "Vyšší náklady a nižší likvidita: TER je vyšší než u širokých indexových ETF a menší tematické fondy mají širší rozpětí nákup/prodej, což dlouhodobě snižuje výnos.",
      "Měnové riziko vůči koruně: fondy jsou v EUR/USD a významná část firem je z USA a Japonska, takže posílení koruny může snížit výnos v Kč nezávisle na výsledcích akcií.",
      "Cykličnost a konkurence: poptávka po průmyslových robotech závisí na hospodářském cyklu a investicích firem; na marže evropských a japonských výrobců tlačí i asijská, zejména čínská konkurence."
    ],
    "faqs": [
      {
        "q": "Jaké jsou v roce 2026 největší a nejlevnější robotika ETF?",
        "a": "Velikosti i poplatky se mění, proto je v textu neuvádíme – aktuální pořadí je v tabulce výše (řazení „Největší“, „Nejlevnější“) s datem, ke kterému údaje platí. K hlavním fondům kategorie patří iShares Automation & Robotics (IE00BYZK4552), Amundi MSCI Robotics & AI (LU1861132840) a L&G ROBO Global Robotics and Automation (IE00BMW3QX54), přičemž poslední zmíněný má výrazně vyšší TER než první dva."
      },
      {
        "q": "Jaký je rozdíl mezi robotika ETF a AI ETF?",
        "a": "Robotika ETF se historicky zaměřují na fyzickou automatizaci – výrobce průmyslových robotů, senzoriku, autonomní systémy a koboty. AI ETF cílí spíš na software, čipy a zpracování dat. Hranice se ale stírá, protože indexy jako MSCI Robotics & AI obě témata spojují. Při současném držení AI nebo technologického fondu se část firem překrývá."
      },
      {
        "q": "Které firmy robotika ETF obvykle obsahují?",
        "a": "Typická jádra tvoří evropští a japonští průmysloví lídři jako ABB, Fanuc a Keyence, dále americká automatizace typu Rockwell Automation či Emerson a řada dodavatelů komponent, softwaru a čipů. Váhy jednotlivých firem se liší podle metodiky indexu - některé fondy jsou rovnoměrně vážené, jiné dávají větší prostor největším hráčům."
      },
      {
        "q": "Mám zvolit akumulační, nebo distribuční variantu?",
        "a": "Akumulační třída dividendy reinvestuje uvnitř fondu, takže se průběžně nic nedaní. Distribuční třída je vyplácí na účet a vyplacené dividendy se v ČR daní 15 %. U robotiky je dividendový výnos nízký, takže rozdíl je hlavně v tom, zda se dividendy vyplácejí, nebo reinvestují."
      },
      {
        "q": "Jak se robotika ETF daní v Česku?",
        "a": "Zisk z prodeje je v ČR osvobozen, pokud fond držíte déle než 3 roky (časový test), nebo pokud úhrn příjmů z prodeje cenných papírů za rok nepřesáhne 100 000 Kč (hodnotový test); od roku 2026 bez horního limitu. Jinak se zisk daní jako ostatní příjem. Vyplacené dividendy distribučních tříd se daní 15 %; u akumulačních fondů se dividendy reinvestují uvnitř fondu a v přiznání se průběžně neřeší. Text není daňové poradenství."
      },
      {
        "q": "Kolik portfolia je rozumné dát do robotiky?",
        "a": "Konkrétní podíl srovnávač neurčuje. Robotika je tematická, koncentrovaná a kolísavá kategorie, kterou investoři obvykle drží jako menší doplněk vedle široce diverzifikovaného akciového fondu. Čím vyšší podíl, tím víc výsledek portfolia závisí na jednom tématu."
      }
    ]
  },
  "nejlepsi-small-cap-etf": {
    "introTitle": "Small cap ETF: akcie menších firem",
    "intro": [
      "Small cap ETF investují do akcií menších burzovně obchodovaných firem. Hranice „malé firmy“ se liší podle poskytovatele indexu. Indexy na velké firmy, jako S&P 500 nebo MSCI World, malé firmy neobsahují; small cap fondy tuto část trhu doplňují.",
      "Nejsledovanějším americkým indexem malých firem je Russell 2000 – 2000 nejmenších firem z indexu Russell 3000. Globální pohled nabízí MSCI World Small Cap s tisíci malých firem z vyspělých trhů, evropskou variantu MSCI Europe Small Cap. Širší index rozkládá riziko jednotlivých firem do více titulů.",
      "Na tyto indexy jsou v tabulce například iShares MSCI World Small Cap (IE00BF4RFH31), SPDR Russell 2000 US Small Cap (IE00BJ38QD84) a Xtrackers MSCI Europe Small Cap (LU0322253906). Fondy jsou vedené v USD nebo EUR, takže výnos v korunách ovlivňuje kurz. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "verdict": [
      "Šíře a region indexu: u malých firem je riziko selhání jednotlivé firmy vyšší, proto se fondy liší hlavně počtem titulů a regionem – Russell 2000 je čistě americký, MSCI World Small Cap globální (vyspělé trhy), MSCI Europe Small Cap evropský.",
      "Náklady, likvidita a třída: TER small cap fondů bývá vyšší než u fondů na velké firmy, protože obchodování s méně likvidními akciemi je nákladnější. Větší fondy s vyšším objemem obchodů mívají užší rozpětí nákup/prodej. Akumulační třída dividendy reinvestuje, distribuční je vyplácí; irský domicil snižuje srážkovou daň z amerických dividend uvnitř fondu na 15 %."
    ],
    "forWhom": "Investoři small cap ETF přidávají k fondům na velké firmy, které malé firmy neobsahují, a rozšiřují tak akciovou část portfolia. Malé firmy kolísají víc než velké a mohou za nimi i několik let zaostávat.",
    "risks": [
      "Vyšší kolísavost a hlubší propady: malé firmy v krizích obvykle klesají prudčeji než velké a zotavení může trvat déle.",
      "Prémie za velikost není zaručená: teorie o vyšších dlouhodobých výnosech malých firem se v některých obdobích nepotvrdila a malé firmy za velkými dlouho zaostávaly.",
      "Kurzové riziko: fondy jsou vedené v USD nebo EUR. Posílení koruny snižuje výnos v korunách i tehdy, když index roste.",
      "Nižší likvidita podkladových akcií: malé firmy se hůř obchodují, což zvyšuje náklady fondu a u menších ETF může vést k širšímu rozpětí nákup/prodej."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi Russell 2000 a MSCI World Small Cap?",
        "a": "Russell 2000 pokrývá 2000 nejmenších firem z indexu Russell 3000, jde tedy o čistě americkou expozici. MSCI World Small Cap je globální a zahrnuje tisíce malých firem z vyspělých trhů včetně USA, Evropy a Japonska, takže rozkládá riziko do více zemí."
      },
      {
        "q": "Vyplatí se dnes vůbec do small cap investovat, když roky zaostávaly?",
        "a": "Výkonnost malých firem vůči velkým se v čase mění a obrat nelze spolehlivě načasovat. Srovnávač nedává investiční rady; výnosy jednotlivých fondů v korunách jsou v tabulce výše."
      },
      {
        "q": "Jakou část portfolia dát do small cap ETF?",
        "a": "Podíl je individuální rozhodnutí podle cílů a tolerance k riziku, srovnávač ho neurčuje. Užitečné je vědět, že indexy na velké a střední firmy (S&P 500, MSCI World) malé firmy neobsahují, takže small cap fond přidává do portfolia novou část trhu."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční small cap ETF?",
        "a": "Akumulační třída dividendy reinvestuje uvnitř fondu, takže investorovi nevzniká dividendový příjem k přiznání. Distribuční třída dividendy vyplácí a v ČR se daní 15 %. Index i složení jsou u obou tříd stejné."
      },
      {
        "q": "Jak se v Česku daní zisk z prodeje small cap ETF?",
        "a": "Na zisk z prodeje se vztahuje časový test: při držbě déle než 3 roky je zisk osvobozen od daně z příjmů, od roku 2026 bez horního limitu. Osvobozené jsou také příjmy z prodeje cenných papírů do 100 000 Kč za rok (hodnotový test). Nejde o daňové poradenství."
      },
      {
        "q": "Proč mají small cap ETF vyšší TER než velké indexové fondy?",
        "a": "Malé firmy se obchodují méně likvidně a nákupy i prodeje akcií jsou pro fond dražší, což se promítá do nákladovosti. TER small cap fondů je proto obvykle vyšší než u velkých indexových fondů na large cap; aktuální hodnoty jsou v tabulce výše."
      }
    ]
  },
  "nejlepsi-spotrebni-etf": {
    "introTitle": "Spotřební ETF: základní a zbytná spotřeba",
    "intro": [
      "Spotřební (consumer) ETF investují do firem, které prodávají zboží a služby koncovým spotřebitelům. Sektor se dělí na dvě odlišné poloviny. Consumer Staples (základní spotřeba) zahrnuje výrobce potravin, nápojů, drogerie a domácích potřeb, například Nestlé, Procter & Gamble, Coca-Cola nebo Unilever; poptávka po jejich produktech je stabilní i v recesi. Consumer Discretionary (zbytná spotřeba) pokrývá automobily, cestování, restaurace, luxusní zboží a online nákupy – Amazon, Tesla, LVMH, McDonald's nebo Nike.",
      "Oba podsektory se chovají téměř opačně. Staples jsou defenzivní: v propadech drží hodnotu lépe, v růstových letech zaostávají. Discretionary jsou cyklické a citlivé na sílu spotřebitele a úrokové sazby: v dobrých časech rostou rychle, v recesi padají mezi prvními. Většina fondů proto míří buď na staples, nebo na discretionary, méně často na celý spotřební sektor.",
      "Fondy jsou UCITS obchodované na evropských burzách, nejčastěji v eurech nebo dolarech, takže vedle sektorového rizika nesete i kurzové riziko koruny. Aktuální poplatky a velikosti fondů jsou v tabulce výše."
    ],
    "verdict": [
      "Zásadní je, na kterou polovinu sektoru fond míří: Consumer Staples jsou defenzivní, Consumer Discretionary cyklické a víc závislé na ekonomice. Fondy se dále liší regionem (svět, USA, Evropa) a indexem.",
      "Akumulační třída dividendy reinvestuje, distribuční je vyplácí (v ČR se daní 15 %). Irský domicil díky smlouvě s USA snižuje srážkovou daň z amerických dividend uvnitř fondu na 15 %. Sektorové fondy bývají menší a dražší než široké indexové fondy a mívají širší rozpětí nákup/prodej; aktuální TER a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají k přiklonění části portfolia k jednomu sektoru vedle širokého indexu. Consumer Staples slouží jako defenzivní prvek, Consumer Discretionary jako sázka na růst spotřeby s vyšším kolísáním. Sektorová koncentrace zvyšuje riziko oproti širokému trhu.",
    "risks": [
      "Sektorová koncentrace: fond stojí na jednom odvětví a desítkách firem, takže potíže několika velkých hráčů (např. tlak na marže výrobců potravin) zasáhnou celý fond.",
      "Odlišné chování staples a discretionary: při recesi nebo růstu sazeb padá cyklická spotřeba mezi prvními; staples naopak v silných růstových letech zaostávají za trhem.",
      "Měnové riziko: fondy jsou v EUR nebo USD a výnos v korunách kolísá i s kurzem; posílení koruny může snížit zisk i u fondu, který v cizí měně roste.",
      "Koncentrace do několika značek a strukturální změny: velkou váhu mívají Amazon a Tesla (discretionary) nebo několik potravinářských koncernů (staples). Sektor ovlivňují i privátní značky obchodních řetězců, léky na hubnutí typu GLP-1 a měnící se spotřebitelské preference."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi Consumer Staples a Consumer Discretionary ETF?",
        "a": "Consumer Staples investují do základní, každodenní spotřeby (potraviny, nápoje, drogerie) a jsou defenzivní, poptávka je stabilní i v krizi. Consumer Discretionary míří na zbytnou spotřebu (auta, luxus, cestování, e-commerce) a jsou cyklické – rostou rychle v dobrých časech a padají první v recesi."
      },
      {
        "q": "Vyplatí se kupovat samostatný spotřební ETF, když už mám S&P 500 nebo MSCI World?",
        "a": "Široké indexy spotřební firmy už obsahují, a to v jejich tržní váze. Samostatný sektorový fond tuto váhu zvyšuje nad tržní úroveň. Kvůli koncentraci do jednoho odvětví nenahrazuje široký index."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční variantu?",
        "a": "Akumulační (accumulating) třída dividendy automaticky reinvestuje uvnitř fondu a průběžně se nedaní. Distribuční třída je vyplácí jako pravidelný hotovostní příjem; vyplacené dividendy se v ČR daní 15 %."
      },
      {
        "q": "Jak jsou spotřební ETF zdaněné v Česku?",
        "a": "Zisk z prodeje ETF je v ČR osvobozen od daně, pokud fond držíte déle než 3 roky (časový test, od roku 2026 bez horního limitu), případně pokud příjem z prodejů cenných papírů za rok nepřesáhne 100 000 Kč. U akumulačního fondu se dividendy průběžně nedaní. U distribučního fondu vyplacené dividendy podléhají 15% dani z příjmů. Nejde o daňové poradenství, konkrétní situaci ověřte s odborníkem."
      },
      {
        "q": "Nesu kurzové riziko, když fond kupuji v eurech?",
        "a": "Ano. Většina UCITS spotřebních ETF se obchoduje v EUR nebo USD, takže hodnota v korunách závisí i na kurzu. Pokud koruna posílí, sníží to váš výnos přepočtený do CZK, a naopak. Měna obchodování přitom nemění samotné podkladové riziko, to určují měny tržeb firem ve fondu."
      },
      {
        "q": "Ohrožují sektor GLP-1 léky na hubnutí a privátní značky?",
        "a": "Jsou to reálná témata, hlavně pro Consumer Staples. Léky typu Ozempic mohou dlouhodobě tlumit poptávku po slazených nápojích a nezdravém jídle, privátní značky řetězců zase ukrajují podíl značkovým výrobcům. Defenzivní pověst staples tedy neznamená, že sektor nečelí strukturálním změnám."
      }
    ]
  },
  "nejlepsi-stoxx600-etf": {
    "introTitle": "Co je index STOXX Europe 600?",
    "intro": [
      "STOXX Europe 600 zahrnuje 600 velkých, středních i menších firem ze 17 evropských zemí. Na rozdíl od eurozónových indexů (Euro Stoxx 50, MSCI EMU) obsahuje i firmy z Velké Británie, Švýcarska a Skandinávie, například Nestlé, Novo Nordisk, ASML, SAP, Shell nebo Roche.",
      "Fondy se obchodují v eurech, podkladové firmy jsou ale kotované i v librách, francích a skandinávských korunách. Výnos v korunách tak ovlivňuje hlavně kurz EUR/CZK a dílčí měny podkladu.",
      "Fondy na tento index se liší hlavně poplatkem (TER), velikostí a nakládáním s dividendami. Aktuální hodnoty jsou v tabulce výše."
    ],
    "verdict": [
      "Fondy na STOXX Europe 600 drží stejný index; liší se poplatkem (TER), velikostí, likviditou, domicilem a třídou: akumulační (Acc) dividendy reinvestuje, distribuční je vyplácí. Nejstarší a největší fondy nemusí být nejlevnější.",
      "U širokého a likvidního indexu je běžná fyzická replikace. Vyplacené dividendy z distribučních tříd se v ČR daní 15 %. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají k pokrytí vyspělé Evropy včetně zemí mimo eurozónu, obvykle vedle americké nebo globální části portfolia. Kdo drží MSCI World nebo FTSE All-World, má Evropu v portfoliu už zastoupenou a STOXX 600 její váhu zvyšuje.",
    "risks": [
      "Regionální a sektorový profil: index pokrývá jediný region s menší váhou technologií a větší váhou bank, průmyslu, zdravotnictví a spotřebního zboží.",
      "Měnové riziko: fondy jsou v EUR, podkladové firmy i v GBP, CHF a skandinávských měnách; pro korunového investora rozhoduje hlavně kurz EUR/CZK.",
      "Koncentrace v největších titulech: několik největších firem tvoří nezanedbatelnou část váhy, jejich výkyvy se projeví v celém fondu.",
      "Nezaměňovat s eurozónou: STOXX 600 zahrnuje i Británii a Švýcarsko; čistě eurozónu sledují jiné indexy (MSCI EMU, Euro Stoxx)."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi STOXX 600 a Euro Stoxx 50?",
        "a": "Euro Stoxx 50 obsahuje 50 velkých firem z eurozóny. STOXX Europe 600 pokrývá 600 firem ze 17 evropských zemí včetně Velké Británie, Švýcarska a Skandinávie. STOXX 600 je proto širší a obsahuje i firmy mimo eurozónu."
      },
      {
        "q": "Který STOXX 600 ETF má nejnižší poplatky?",
        "a": "Fondy na STOXX Europe 600 patří k levnějším regionálním ETF. Aktuální pořadí podle poplatků je v žebříčku „Nejlevnější (TER)“ v tabulce výše; u nejlevnějších fondů stojí za pohled i jejich velikost, protože některé nové fondy jsou velmi malé."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční verzi?",
        "a": "Akumulační (Acc) verze dividendy reinvestuje uvnitř fondu a v průběhu držení se nedaní. Distribuční verze je vyplácí na účet a vyplacené dividendy se v ČR daní 15 % v daňovém přiznání."
      },
      {
        "q": "Jak se v Česku daní zisk ze STOXX 600 ETF?",
        "a": "Na zisk z prodeje se vztahuje časový test: při držení déle než 3 roky je zisk osvobozen od daně z příjmů. Osvobozen je i zisk, pokud roční úhrn příjmů z prodeje cenných papírů nepřesáhne 100 000 Kč (hodnotový test). Vyplacené dividendy distribučních fondů se daní bez ohledu na dobu držení."
      },
      {
        "q": "Je STOXX 600 dobrá náhrada za americké akcie?",
        "a": "STOXX 600 a americké akcie mají odlišné složení: Evropa má menší váhu technologií a v posledních desetiletích rostla pomaleji než USA. Globální fondy (MSCI World, FTSE All-World) obsahují USA i Evropu v tržním poměru."
      },
      {
        "q": "Jsou tyto ETF dostupné u českých brokerů?",
        "a": "STOXX 600 ETF jsou UCITS fondy obchodované hlavně na evropských burzách (např. Xetra) v eurech; dostupnost se liší podle brokera. Velikosti fondů jsou v tabulce výše."
      }
    ]
  },
  "nejlepsi-technologicke-etf": {
    "introTitle": "Technologické ETF: sázka na NASDAQ 100 a IT sektor",
    "intro": [
      "Technologické ETF jsou fondy, které koncentrují peníze do firem z oblasti hardwaru, softwaru, polovodičů, cloudu a internetových služeb. V praxi jde o dvě odlišné rodiny indexů. NASDAQ 100 sdružuje 100 největších nefinančních firem obchodovaných na burze NASDAQ. Není to čistě technologický index, ale technologie v něm dominují, a k tomu se přidávají firmy jako Amazon, Alphabet nebo Tesla, které se formálně řadí do jiných sektorů. Druhou rodinou jsou čisté sektorové indexy typu S&P 500 Information Technology, kde najdete jen firmy zařazené do IT sektoru podle klasifikace GICS, tedy především Apple, Microsoft, NVIDIA, Broadcom a další.",
      "Kategorie je velmi koncentrovaná: několik největších firem tvoří velkou část fondu, takže výsledek z velké části určuje hrstka jmen. Technologie v minulých letech táhly americké trhy nahoru, zároveň jde o koncentrovanější a kolísavější expozici než široký index typu S&P 500 nebo MSCI World.",
      "Fondy jako iShares Nasdaq 100 (IE00B53SZB19), Invesco EQQQ Nasdaq-100 (IE0032077012) nebo iShares S&P 500 Information Technology Sector (IE00B3WJKG14) mají irský domicil a UCITS podobu a obchodují se na evropských burzách. Jsou vedené v USD nebo EUR a drží převážně americké akcie, takže výnos v korunách ovlivňuje kurz dolaru vůči koruně."
    ],
    "verdict": [
      "Index: Nasdaq-100 zahrnuje i firmy mimo IT sektor (Amazon, Alphabet, Tesla), sektorový S&P 500 Information Technology drží jen IT firmy podle klasifikace GICS a je ještě koncentrovanější.",
      "Poplatek a velikost: sektorové IT fondy bývají levnější než fondy na Nasdaq-100. Velké fondy mají úzké rozpětí nákup/prodej. Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "Třída a domicil: akumulační třída dividendy reinvestuje, distribuční je vyplácí. Irský domicil (ISIN začíná IE) snižuje díky smlouvě s USA srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 % – u fondů s převážně americkými firmami je to podstatné."
    ],
    "forWhom": "Investoři je používají k navýšení váhy technologických firem nad rámec širokého indexu, obvykle jako doplněk k MSCI World nebo S&P 500. Tytéž firmy jsou ale i mezi největšími pozicemi těchto širokých indexů, takže se expozice sčítá. Sektor v minulosti opakovaně procházel propady o desítky procent.",
    "risks": [
      "Sektorová koncentrace: fond závisí na technologiích a na hrstce největších firem (Apple, Microsoft, NVIDIA). Problém jedné firmy nebo regulační zásah se projeví silněji než u širokého indexu.",
      "Hluboké propady: technologický sektor opakovaně ztratil desítky procent – po splasknutí dot-com bubliny v letech 2000–2002 i v roce 2022. Kdo v propadu prodá, ztrátu realizuje.",
      "Vysoké ocenění: technologie se často obchodují za vysoké násobky zisku, což zvyšuje citlivost na zklamání z výsledků, růst úrokových sazeb i změny nálady trhu.",
      "Měnové riziko: fondy drží převážně americké akcie v dolarech, takže posílení koruny vůči dolaru snižuje výnos v Kč bez ohledu na vývoj indexu."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi NASDAQ 100 ETF a čistě technologickým (IT) ETF?",
        "a": "Nasdaq-100 obsahuje 100 největších nefinančních firem z burzy Nasdaq, takže vedle technologií zahrnuje i Amazon, Alphabet nebo Teslu, které formálně patří do jiných sektorů. Čistě technologický fond typu S&P 500 Information Technology drží jen firmy zařazené do IT sektoru podle klasifikace GICS. Nasdaq-100 je o něco pestřejší, IT sektorový fond koncentrovanější a bývá levnější."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční technologické ETF?",
        "a": "Akumulační třída dividendy reinvestuje uvnitř fondu, takže se průběžně nic nedaní. Distribuční třída je vyplácí na účet a vyplacené dividendy se v ČR daní 15 %."
      },
      {
        "q": "Nekupuji technologie dvakrát, když už mám S&P 500 nebo MSCI World?",
        "a": "Do jisté míry ano. Technologičtí giganti tvoří velkou část i širokých indexů, takže technologický ETF jejich váhu v portfoliu dál zvyšuje. Zda je to záměr, je dobré vědět při určování velikosti pozice."
      },
      {
        "q": "Jak se v Česku daní zisky z technologických ETF?",
        "a": "Zisk z prodeje je v ČR osvobozen, pokud fond držíte déle než 3 roky (časový test), nebo pokud úhrn příjmů z prodeje cenných papírů za rok nepřesáhne 100 000 Kč (hodnotový test); od roku 2026 bez horního limitu. Jinak se zisk daní jako ostatní příjem. U akumulačních fondů se dividendy reinvestují uvnitř fondu, vyplacené dividendy distribučních tříd se daní 15 %. Text není daňové poradenství."
      },
      {
        "q": "Proč většina technologických ETF má irský domicil?",
        "a": "Irsko má výhodnou daňovou smlouvu s USA, která snižuje srážkovou daň z amerických dividend na úrovni fondu z 30 % na 15 %. Protože technologická ETF drží téměř výhradně americké firmy, irský domicil (ISIN začínající IE) tu znamená znatelně nižší daňovou ztrátu na dividendách než například lucemburský fond."
      },
      {
        "q": "Je teď dobrá doba na nákup technologických ETF?",
        "a": "Srovnávač vývoj trhu nepředpovídá. Technologie bývají oceněné vysoko vůči ziskům a časovat vstup do koncentrovaného sektoru je obtížné. Část investorů proto investuje pravidelně po menších částkách (DCA), čímž rozkládá nákupní cenu v čase."
      }
    ]
  },
  "nejlepsi-value-etf": {
    "introTitle": "Value ETF: akcie s nízkým oceněním vůči fundamentům",
    "intro": [
      "Value ETF vybírají akcie obchodované levně vůči svým fundamentům, tedy s nízkým poměrem ceny k zisku (P/E), k účetní hodnotě (P/B) nebo k tržbám (P/S). Přístup navazuje na tradici Benjamina Grahama. ETF ale nevybírá tituly ručně, nýbrž podle pravidel indexu, nejčastěji z rodiny MSCI Value nebo MSCI Enhanced Value.",
      "Patří sem například iShares Edge MSCI World Value Factor (IE00BP3QZB59) a Xtrackers MSCI World Value (IE00BL25JM42); evropskou expozici nabízí iShares Edge MSCI Europe Value Factor (IE00BQN1K901). Value indexy mívají větší podíl bank, energetiky, těžby, farmacie a průmyslu než široký trh. Aktuální poplatky a velikosti jsou v tabulce výše.",
      "Fondy se obchodují na evropských burzách v EUR nebo USD, takže výnos v korunách ovlivňuje kurz. Investoři je používají spíše jako doplněk k širokému indexu, kterým portfolio naklánějí k hodnotovému faktoru."
    ],
    "verdict": [
      "Typ indexu: varianty Enhanced Value posuzují ocenění v rámci jednotlivých sektorů, a omezují tak sektorové vychýlení; jednodušší value indexy mohou mít výrazně větší váhu bank a energetiky. Fondy se liší i regionem (svět, Evropa, USA).",
      "Třída a domicil: hodnotové akcie mívají vyšší dividendy, takže rozdíl mezi akumulační třídou (dividendy reinvestuje) a distribuční (vyplácí je, v ČR daň 15 %) je tu výraznější. Irský domicil snižuje srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 %. Velikost a TER fondů jsou v tabulce výše."
    ],
    "forWhom": "Investoři value ETF používají k vědomému naklonění akciové části portfolia k levněji oceněným akciím, často jako protiváhu k velké váze technologických firem v širokých indexech. Value faktor se může od hlavního indexu odchylovat i řadu let.",
    "risks": [
      "Value může zaostávat velmi dlouho: zhruba v letech 2008–2021 vedly na trhu převážně růstové akcie a hodnotový styl za nimi zaostával.",
      "Sektorová koncentrace: value indexy mívají větší váhu bank, energetiky a těžby, které jsou citlivé na hospodářský cyklus, úrokové sazby a ceny komodit.",
      "Hodnotová past: akcie bývá levná často kvůli strukturálním problémům firmy a mechanický výběr podle nízkých poměrů může zahrnout i tituly, jejichž ocenění se nevrátí.",
      "Měnové riziko: výnos v korunách ovlivňuje kurz EUR/CZK a USD/CZK. Posílení koruny může část akciového zisku umazat."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi Value a Growth ETF?",
        "a": "Value ETF cílí na levně oceněné akcie s nízkým P/E a P/B a často vyššími dividendami, typicky banky, energetiku či průmysl. Growth ETF vybírají rychle rostoucí firmy s vysokým oceněním, zejména technologie. Oba přístupy se ve výkonnosti střídají."
      },
      {
        "q": "Vyplatí se dnes vůbec do value investovat, když technologie stále rostou?",
        "a": "Value a growth se historicky střídají v cyklech a žádný z nich trvale nevítězí. Investoři value ETF používají jako diverzifikaci stylu, ne jako nástroj k časování trhu. Srovnávač nedává investiční rady; výnosy fondů v korunách jsou v tabulce výše."
      },
      {
        "q": "Který value ETF je největší a nejlikvidnější?",
        "a": "Mezi největší globální value fondy patří iShares Edge MSCI World Value Factor (IE00BP3QZB59) a Xtrackers MSCI World Value (IE00BL25JM42). Aktuální velikosti a poplatky jsou v tabulce výše."
      },
      {
        "q": "Platím z value ETF v Česku daně a co dividendy?",
        "a": "Zisk z prodeje je osvobozen po splnění časového testu (držba déle než 3 roky, od roku 2026 bez horního limitu) nebo hodnotového testu (příjmy z prodeje cenných papírů do 100 000 Kč za rok). Dividendy vyplacené distribuční třídou se daní 15 % každý rok bez ohledu na časový test; u akumulační třídy se dividendy reinvestují uvnitř fondu. Nejde o daňové poradenství."
      },
      {
        "q": "Mám raději globální, nebo evropský value ETF?",
        "a": "Globální fond typu MSCI World Value rozkládá riziko do více zemí a je méně závislý na jedné ekonomice. Evropský value ETF (například IE00BQN1K901) je koncentrovanější do evropských bank a cyklických sektorů."
      },
      {
        "q": "Proč value ETF často drží tolik bank a energetiky?",
        "a": "Tyto sektory se dlouhodobě obchodují za nízké násobky zisku a účetní hodnoty, takže je value index přirozeně vybírá. To zvyšuje citlivost fondu na úrokové sazby a hospodářský cyklus. Varianty Enhanced Value posuzují ocenění v rámci sektorů, a sektorové vychýlení tak omezují."
      }
    ]
  },
  "nejlevnejsi-etf": {
    "introTitle": "Nejlevnější ETF podle TER: co poplatek zahrnuje a co ne",
    "intro": [
      "Kategorie nejlevnějších ETF řadí fondy podle ukazatele celkové nákladovosti (TER, Total Expense Ratio). TER je roční poplatek za správu, který se nestrhává fakturou, ale průběžně se odečítá z majetku fondu. U nejlevnějších širokých akciových ETF jsou to setiny procenta ročně – například iShares Core S&P 500 (IE00B5BMR087) má TER 0,07 % (k 18. 10. 2026). Aktuální hodnoty všech fondů jsou v tabulce výše.",
      "Poplatek je složka výsledku, která je předem známá. Rozdíl TER 0,5 procentního bodu ročně sníží konečnou hodnotu investice za 30 let zhruba o 14 % (0,995^30 ≈ 0,86), ať trh vynese cokoli. Při TER 0,07 % a investici 10 000 EUR činí poplatek zhruba 7 EUR ročně.",
      "Většina nejlevnějších ETF má irský domicil (ISIN začíná na IE) a obchoduje se v EUR, USD nebo GBP. Výnos v korunách proto vždy ovlivňuje i kurz koruny vůči těmto měnám."
    ],
    "verdict": [
      "Vedle samotného TER se fondy liší indexem, velikostí a likviditou. Větší fondy mívají užší rozpětí nákup/prodej (spread) a menší riziko zrušení; u malého fondu může vyšší spread převážit úsporu na TER. Nízký poplatek sám o sobě neříká nic o tom, jak široký nebo koncentrovaný je index.",
      "Akumulační třída dividendy reinvestuje, distribuční je vyplácí (v ČR se daní 15 %). Irský domicil díky smlouvě mezi Irskem a USA snižuje srážkovou daň z amerických dividend uvnitř fondu na 15 %, což u fondů na americké akcie zvyšuje čistý výnos oproti fondům z domicilů bez takové smlouvy."
    ],
    "forWhom": "Pasivní investoři sledují TER hlavně u fondů na široké indexy, které drží dlouhodobě – při delším horizontu se rozdíl v poplatcích kumuluje. U sektorových, tematických nebo aktivně řízených fondů bývá TER jen jedním z kritérií vedle obsahu fondu.",
    "risks": [
      "Malé a nové fondy: nízké TER může mít i fond s malým majetkem. U takového fondu hrozí širší spread, horší plnění pokynů a v krajním případě zrušení fondu s vyplacením v nevhodnou dobu.",
      "TER není jediný náklad: skutečné zaostávání za indexem (tracking difference) ovlivňuje i způsob replikace, zdanění dividend uvnitř fondu a příjmy z půjčování cenných papírů. Dva fondy se stejným TER se proto v čistém výsledku mohou lišit.",
      "Měnové riziko: levné ETF jsou vedené v EUR, USD nebo GBP. Hodnota v korunách kolísá s kurzem a posílení koruny může výnos snížit bez ohledu na výši poplatku.",
      "Koncentrace indexu: nejlevnější bývají fondy na velké indexy typu S&P 500 nebo MSCI World s vysokou váhou amerických technologických firem. Nízký poplatek riziko koncentrace nezmenšuje."
    ],
    "faqs": [
      {
        "q": "Co přesně znamená TER a jak se strhává?",
        "a": "TER (Total Expense Ratio) je celkový roční poplatek za správu ETF vyjádřený v procentech z hodnoty investice. Nestrhává se fakturou, ale průběžně se odečítá z majetku fondu, takže se projeví jako mírně nižší kurz. Při TER 0,07 % a investici 10 000 EUR jde zhruba o 7 EUR ročně."
      },
      {
        "q": "Je nejnižší TER vždy nejlepší volba?",
        "a": "Ne nutně. Kromě TER hraje roli velikost a likvidita fondu, index a skutečné zaostávání za indexem (tracking difference). O setiny procenta dražší, ale velký a likvidní fond může v čistém výsledku vyjít lépe než nejlevnější malý fond se širokým spreadem."
      },
      {
        "q": "Kolik reálně ušetřím oproti drahému fondu?",
        "a": "Záleží na rozdílu v TER a délce investice. Rozdíl 0,5 procentního bodu ročně sníží konečnou částku za 30 let zhruba o 14 % (0,995^30 ≈ 0,86), za 10 let zhruba o 5 %. U velkých částek a dlouhých horizontů jde o velké absolutní rozdíly."
      },
      {
        "q": "Mají levné ETF akumulační, nebo distribuční variantu?",
        "a": "Existují obě. Akumulační třída (Acc) dividendy automaticky reinvestuje uvnitř fondu. Distribuční (Dist) třída je vyplácí jako pravidelnou hotovost a vyplacené dividendy se v ČR daní 15 %."
      },
      {
        "q": "Proč mají levné ETF nejčastěji irský domicil?",
        "a": "Irský domicil (ISIN začínající IE) je u nejlevnějších fondů běžný kvůli daňové smlouvě mezi Irskem a USA, která snižuje srážkovou daň z amerických dividend uvnitř fondu na 15 %. To u fondů na americké akcie zvyšuje čistý výnos, proto je v Irsku domicilována většina levných S&P 500 a World ETF."
      },
      {
        "q": "Musím z levného ETF platit v Česku daň?",
        "a": "Zisk z prodeje ETF je osvobozen, pokud fond držíte déle než 3 roky (časový test, od roku 2026 bez horního limitu) nebo pokud příjem z prodejů cenných papírů za rok nepřesáhne 100 000 Kč. Jinak zisk podléhá dani z příjmů. U distribučních fondů se navíc daní vyplácené dividendy (15 %). Konkrétní situaci si ověřte podle aktuálních pravidel nebo s daňovým poradcem."
      }
    ]
  },
  "nejlepsi-etf-2026": {
    "introTitle": "Co ukazuje žebříček ETF pro rok 2026",
    "intro": [
      "Žebříček neukazuje jeden fond, který „porazí ostatní“. Řadí fondy podle dat a na předních místech jsou typicky velké, široké akciové ETF, například iShares Core S&P 500 (IE00B5BMR087), iShares Core MSCI World (IE00B4L5Y983) a Vanguard FTSE All-World (IE00BK5BQT80).",
      "Liší se hlavně šíří záběru: S&P 500 pokrývá zhruba 500 velkých amerických firem, MSCI World zhruba 1 300 firem z vyspělých trhů a FTSE All-World přidává i rozvíjející se trhy. Aktuální poplatky a velikosti jsou v tabulce výše.",
      "Všechny tři fondy mají domicil v Irsku a obchodují se na evropských burzách v eurech či dolarech. Podkladová aktiva jsou převážně v dolarech, takže výnos v korunách ovlivňuje kurz koruny."
    ],
    "verdict": [
      "Široké akciové ETF se liší hlavně indexem (jen USA, vyspělý svět, nebo celý svět včetně rozvíjejících se trhů), poplatkem (TER), velikostí a třídou: akumulační (Acc) dividendy reinvestuje uvnitř fondu, distribuční je vyplácí. Irský domicil snižuje srážkovou daň z amerických dividend uvnitř fondu na 15 % místo 30 %.",
      "Velké fondy mívají vysokou likviditu a úzký spread. Výkonnost za poslední rok neříká nic o výkonnosti v dalších letech; úzké fondy s nejvyšším loňským výnosem bývají koncentrované a kolísavé."
    ],
    "forWhom": "Investoři používají široké akciové ETF hlavně jako dlouhodobé jádro portfolia, často s pravidelnými měsíčními nákupy. Hodnota může v horším roce klesnout o desítky procent, proto se obvykle používají pro peníze, které investor dlouho nepotřebuje.",
    "risks": [
      "Koncentrace do USA: i ve „světových“ indexech tvoří USA většinu (v MSCI World přes 70 % v roce 2026) a několik technologických firem velkou část váhy.",
      "Měnové riziko: aktiva jsou převážně v dolarech, posílení koruny snižuje výnos v korunách i při růstu akcií.",
      "Výběr podle minulé výkonnosti: fond s nejlepším loňským výnosem nemusí vést i v dalších letech.",
      "Hluboké propady: široké akciové indexy v letech 2007–2009 ztratily přes polovinu hodnoty a zotavení trvalo roky; prodej v propadu ztrátu realizuje."
    ],
    "faqs": [
      {
        "q": "Které ETF jsou mezi českými investory nejrozšířenější?",
        "a": "Nejčastěji jde o široké indexové fondy: VWCE (celý svět v jednom fondu), CSPX/SXR8 (500 největších amerických firem) a IWDA/EUNL (vyspělé trhy světa). Rozšířenost ani pořadí v žebříčku neříkají, co je vhodné pro vás – žebříček jen řadí fondy podle dat."
      },
      {
        "q": "Je lepší jeden ETF, nebo jich kombinovat víc?",
        "a": "Jeden globální fond (např. na FTSE All-World nebo MSCI ACWI) obsahuje vyspělé i rozvíjející se trhy v tržním poměru. Kombinace více fondů (např. S&P 500 a samostatné rozvíjející se trhy) umožňuje řídit váhy regionů, ale vyžaduje rebalancování. Více fondů neznamená automaticky vyšší diverzifikaci, pokud se jejich složení překrývá."
      },
      {
        "q": "Proč jsou mezi českými investory rozšířené irské (Acc) fondy?",
        "a": "Irský domicil snižuje srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 %. Akumulační varianta (Acc) dividendy reinvestuje uvnitř fondu, takže se v průběhu držení nevyplácejí ani nedaní. Proto jsou irské akumulační třídy mezi českými investory rozšířené."
      },
      {
        "q": "Jak se nejlepší ETF daní v Česku?",
        "a": "Při držení déle než 3 roky je zisk z prodeje osvobozen od daně z příjmů (časový test); osvobozen je i zisk, pokud roční úhrn příjmů z prodeje cenných papírů nepřesáhne 100 000 Kč (hodnotový test). U akumulačních fondů se během držení nedaní žádné dividendy. Daňová pravidla se mohou měnit."
      },
      {
        "q": "Kolik peněz potřebuji na začátek?",
        "a": "U brokerů, kteří prodávají i zlomky podílu (Trading 212 od 1 €, XTB, Interactive Brokers), se dá začít i s několika stovkami korun; robo-poradce Portu má minimální vklad 500 Kč. Kde se kupují jen celé podíly, potřebujete aspoň cenu jednoho podílu – u velkých akciových ETF od desítek po stovky eur. Důležitější než velikost první částky je pravidelnost a dlouhý horizont. Investujte jen peníze, které několik let nebudete potřebovat."
      },
      {
        "q": "Vyplatí se čekat na propad trhu, než začnu investovat?",
        "a": "Časování trhu je obtížné a vývoj cen nikdo spolehlivě nepředpovídá. Při čekání na propad investor může přijít o růst, který propadu předchází; při okamžitém nákupu riskuje propad krátce po něm. Pravidelné investování rozkládá nákupy v čase."
      }
    ]
  },
  "nejlepsi-akciove-etf": {
    "introTitle": "Akciové ETF: rozcestník podle šířky trhu",
    "intro": [
      "„Akciové ETF“ je nejširší kategorie: akcie jsou třída aktiv, ne konkrétní fond. Tahle stránka slouží jako rozcestník – konkrétní indexy (S&P 500, MSCI World, celý svět) mají vlastní žebříčky s podrobným srovnáním fondů.",
      "Akcie dlouhodobě přinášely vyšší výnos než dluhopisy nebo hotovost, ale s největším kolísáním: světový akciový index MSCI ACWI v letech 2007–2009 ztratil v USD 58 % (factsheet MSCI) a zotavení trvalo roky. Dluhopisové ETF portfolio obvykle stabilizují, komodity slouží jako částečná ochrana před inflací.",
      "Fondy se liší šířkou: od celosvětových (FTSE All-World, MSCI ACWI) přes vyspělý svět (MSCI World) a USA (S&P 500) po regionální (Evropa, rozvíjející se trhy) a sektorové (technologie, energetika). Čím užší fond, tím vyšší koncentrace. Fondy jsou vedené v USD nebo EUR, takže výnos v korunách ovlivňuje i kurz koruny."
    ],
    "verdict": [
      "Šířka expozice: celosvětový fond (FTSE All-World, MSCI ACWI) drží vyspělé i rozvíjející se trhy, MSCI World jen vyspělé, S&P 500 jen USA. Regionální a sektorové fondy jsou užší a koncentrovanější. Podrobné srovnání fondů na tyto indexy je v jejich vlastních žebříčcích.",
      "Poplatky: u širokých indexových fondů jsou TER nízké a rozdíly malé – rozdíl 0,15 procentního bodu dělá 15 Kč ročně z každých 10 000 Kč. Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "Třída a domicil: akumulační třída dividendy reinvestuje, distribuční je vyplácí (v ČR se daní 15 %). Irský domicil (ISIN začíná IE) snižuje díky smlouvě s USA srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 %.",
      "Překryv: kombinace fondů na podobné trhy (např. celý svět + S&P 500 + Nasdaq-100) zvyšuje váhu stejných velkých firem, ne diverzifikaci."
    ],
    "forWhom": "Investoři akciové ETF používají jako hlavní zdroj dlouhodobého růstu portfolia, typicky s horizontem mnoha let a často formou pravidelného měsíčního investování. Široký fond obvykle tvoří jádro, užší regionální nebo sektorové fondy doplňky. Na peníze potřebné v horizontu několika let se kvůli propadům o desítky procent obvykle nepoužívají.",
    "risks": [
      "Tržní riziko a propady: akciové portfolio může během medvědího trhu ztratit desítky procent (MSCI ACWI v letech 2007–2009 v USD 58 %) a zotavení může trvat roky.",
      "Měnové riziko vůči koruně: fondy jsou v USD nebo EUR a výnos v Kč ovlivňuje kurz. Měnově zajištěné třídy zajišťují do EUR nebo USD, ne do koruny, a zajištění má vlastní náklady.",
      "Diverzifikace bývá menší, než se zdá: S&P 500 ani Nasdaq-100 nejsou „celý svět“ a i v MSCI ACWI tvořily k 30. 9. 2026 americké firmy 64 % váhy.",
      "Překrývání fondů: celosvětový, americký a technologický fond drží z velké části stejné firmy (Apple, Microsoft, NVIDIA), takže jejich kombinace zvyšuje koncentraci."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi akciovým ETF a konkrétním fondem jako S&P 500?",
        "a": "„Akciové ETF“ je zastřešující pojem pro všechny fondy investující do akcií – patří sem globální (např. VWCE, IUSQ), americké (S&P 500, např. CSP1 nebo SPYL), regionální (např. evropský SMEA) i sektorové. S&P 500 je jedna konkrétní možnost uvnitř kategorie: 500 velkých amerických firem. Detaily ke konkrétním indexům jsou na jejich vlastních žebříčcích."
      },
      {
        "q": "Kolik akciových ETF bych měl mít v portfoliu?",
        "a": "Jeden široký globální fond (např. VWCE nebo IUSQ) sám drží tisíce firem z vyspělých i rozvíjejících se trhů. Další fondy na podobné trhy přidávají hlavně překryv a náklady; regionální nebo sektorový fond mění váhy (např. víc rozvíjejících se trhů). Kolik fondů držet, srovnávač neurčuje."
      },
      {
        "q": "Mám vybírat akumulační, nebo distribuční třídu?",
        "a": "Akumulační třída (např. VWCE) dividendy reinvestuje uvnitř fondu, takže se průběžně nic nedaní. Distribuční třída (např. VWRL) dividendy vyplácí na účet a v ČR se daní 15 %. Investoři ve fázi budování majetku častěji drží akumulační třídy, ve fázi čerpání distribuční."
      },
      {
        "q": "Jak se v ČR v roce 2026 daní zisk z akciových ETF?",
        "a": "U akciových ETF (cenných papírů) platí dva testy pro osvobození. Časový test: pokud fond držíte déle než 3 roky, je zisk z prodeje osvobozen – od roku 2026 bez horního limitu. Hodnotový test: pokud úhrn vašich příjmů z prodeje cenných papírů nepřesáhne 100 000 Kč za rok, je zisk osvobozen bez ohledu na dobu držby. Vyplacené dividendy z distribučních tříd se daní 15 %. Text není daňové poradenství."
      },
      {
        "q": "Proč je většina těchhle fondů domicilovaná v Irsku (ISIN začínající IE)?",
        "a": "Irský domicil (ISIN začíná IE) má u fondů s americkými akciemi daňovou výhodu: Irsko má s USA smlouvu, která snižuje srážkovou daň z amerických dividend uvnitř fondu z 30 % na 15 %. Proto je tam domicilována většina velkých ETF (např. CSP1, SWDA, VWCE)."
      },
      {
        "q": "Nesu měnové riziko, i když kupuji přes českého brokera v korunách?",
        "a": "Ano. To, že u brokera zadáte příkaz v korunách, neznamená, že je fond v korunách. Podkladová aktiva jsou v dolarech, eurech a dalších měnách a jejich hodnota se přepočítává do Kč. Když koruna posílí, část výnosu v přepočtu ztratíte, i když akcie samy vyrostou. Měnově zajištěné třídy zajišťují do EUR nebo USD, riziko vůči koruně neodstraní a zajištění má vlastní náklady."
      }
    ]
  },
  "nejlepsi-akumulacni-etf": {
    "introTitle": "Akumulační ETF: reinvestice dividend uvnitř fondu",
    "intro": [
      "Akumulační ETF (v názvech značené „Acc“, „Accumulating“ nebo „C“) je fond, který dividendy z akcií nebo kupony z dluhopisů nevyplácí na účet investora, ale automaticky je reinvestuje uvnitř fondu. Počet podílů zůstává stejný, jejich hodnota roste i o znovu investovaný příjem. Opakem je distribuční třída, která dividendy pravidelně vyplácí – rozdíl není v indexu ani ve složení portfolia, ale jen v nakládání s příjmem. Řada velkých ETF existuje v obou variantách se shodným podkladem, například iShares Core S&P 500 nebo Vanguard FTSE All-World.",
      "Pro českého investora má akumulace dva praktické důsledky. Reinvestice probíhá uvnitř fondu bez transakčního poplatku a bez prodlevy, zatímco vyplacenou dividendu by investor musel doinvestovat sám. A protože investorovi nepřiteče dividendový příjem, neřeší v přiznání 15% daň z dividend. Zdaňuje se až případný zisk z prodeje podílů, na který se vztahuje časový a hodnotový test (viz níže).",
      "Akumulační třídu mají fondy na akcie, dluhopisy i další aktiva – tato kategorie se proto netýká konkrétního regionu ani indexu, ale typu třídy podílů. Fondy podle regionu nebo strategie jsou v dalších kategoriích.",
      "Měna: akumulační ETF jsou vedené v USD nebo EUR a broker nákup přepočítá z korun. Výnos v korunách proto vždy nese kurzové riziko dolaru či eura vůči koruně – akumulace ho neodstraňuje."
    ],
    "verdict": [
      "Třída a ISIN: velké ETF často existují v akumulační i distribuční variantě se shodným indexem, ale různým ISIN. Třídu určuje označení v názvu (Acc, Accumulating, C, 1C) a jednoznačně ISIN.",
      "Domicil: většina velkých akumulačních fondů na akcie má irský domicil (ISIN začíná IE). U amerických akcií snižuje smlouva mezi Irskem a USA srážkovou daň z dividend uvnitř fondu z 30 % na 15 %; u akumulační třídy se to projeví v hodnotě podílu.",
      "Náklady a velikost: TER největších fondů na S&P 500 a MSCI World se pohybuje v setinách až nízkých desetinách procenta ročně. Aktuální poplatky a velikosti jsou v tabulce výše.",
      "Typ produktu: do akumulačního filtru spadají i ETC krytá zlatem, například Amundi Physical Gold ETC (C). Nejde o fond, ale o dluhový cenný papír emitenta – podrobnosti jsou v kategorii zlatých ETC."
    ],
    "forWhom": "Investoři akumulační třídu používají hlavně ve fázi spoření, kdy příjem z portfolia nepotřebují a dividendy chtějí reinvestovat bez daňové administrativy, například při pravidelném investování do širokého indexu. Kdo z portfolia čerpá pravidelný příjem, používá spíše distribuční třídu.",
    "risks": [
      "Akumulace daň neruší, jen ji přesouvá na prodej: zisk z prodeje podílů osvobodí časový test (držba déle než 3 roky, od roku 2026 bez horního limitu) nebo hodnotový test (příjmy z prodeje cenných papírů do 100 000 Kč za rok). Jinak se zisk daní.",
      "Měnové riziko zůstává: fondy drží aktiva v USD či jiných měnách a výnos v korunách kolísá s kurzem. Zajištěné (hedged) třídy zajišťují obvykle do EUR, USD nebo GBP, třídy zajištěné do koruny v přehledu nejsou.",
      "Záměna produktů: akumulační filtr zahrnuje i ETC krytá zlatem a jiné ne-akciové produkty. Nejsou to fondy, ale dluhové cenné papíry emitenta s jiným rizikovým profilem.",
      "Méně viditelný dividendový výnos: výplaty nechodí na účet, takže příjem z dividend je vidět jen v hodnotě podílu, ne jako hotovost."
    ],
    "faqs": [
      {
        "q": "Jak poznám akumulační ETF podle názvu?",
        "a": "V názvu nebo třídě jsou zkratky „Acc“, „Accumulating“ nebo někdy „C“ (capitalising), například Vanguard FTSE All-World UCITS ETF (USD) Accumulating nebo iShares Core MSCI World UCITS ETF USD (Acc). Distribuční třída téhož fondu bývá značená „Dist“, „Distributing“ nebo „D“ a má jiný ISIN. Třídu jednoznačně určuje ISIN."
      },
      {
        "q": "Musím u akumulačního ETF danit reinvestované dividendy?",
        "a": "Ne. U akumulačního fondu se dividendy reinvestují uvnitř fondu a investorovi žádný dividendový příjem nepřiteče, takže v přiznání 15% daň z dividend neřeší. Danit se může až zisk z prodeje podílů – ten je ale osvobozený po splnění časového testu (držba déle než 3 roky, od roku 2026 bez horního limitu) nebo hodnotového testu (příjmy z prodeje cenných papírů do 100 000 Kč ročně). Nejde o daňové poradenství."
      },
      {
        "q": "Je akumulační, nebo distribuční ETF pro Čecha lepší?",
        "a": "Třídy se liší jen nakládáním s dividendami. Akumulační třída je reinvestuje uvnitř fondu bez transakčních nákladů a bez průběžného zdanění u investora. Distribuční je vyplácí a vyplacené dividendy se daní 15 %. Index i složení jsou u obou tříd stejné; rozdíl je v tom, zda investor chce průběžný příjem."
      },
      {
        "q": "Odstraní akumulační ETF měnové riziko vůči koruně?",
        "a": "Ne. Akumulace řeší jen nakládání s dividendami, ne měnu. Fondy jako Vanguard FTSE All-World nebo iShares Core MSCI World drží aktiva převážně v dolarech a výnos v korunách kolísá s kurzem. Zajištěné (hedged) třídy zajišťují obvykle do EUR, USD nebo GBP, ne do koruny."
      },
      {
        "q": "Které akumulační ETF je nejlevnější?",
        "a": "Nejnižší TER mívají velké fondy na S&P 500 a MSCI World – u nejlevnějších jde o několik setin procenta ročně. Poplatky se ale mění, aktuální pořadí podle nákladovosti je proto v tabulce na této stránce."
      },
      {
        "q": "Je akumulační zlaté ETC (třeba Amundi Physical Gold C) totéž co akumulační akciové ETF?",
        "a": "Není. Amundi Physical Gold ETC (C) sice v názvu nese kapitalizační třídu, ale jde o ETC – dluhový cenný papír emitenta krytý fyzickým zlatem, ne o fond. Zlato nic nevyplácí, takže označení třídy tu nemá praktický význam. Daňové zacházení se zlatými ETC popisuje kategorie zlatých ETC; nejde o daňové poradenství."
      }
    ]
  },
  "nejlepsi-bitcoin-etf": {
    "introTitle": "Bitcoin ETF v Evropě: ve skutečnosti ETP kryté bitcoinem",
    "intro": [
      "Spot bitcoin ETF, jaké se v USA obchodují od roku 2024 (např. iShares Bitcoin Trust), v Evropě nejsou. Evropská regulace UCITS vyžaduje diverzifikaci a fond nemůže držet jen jedno aktivum. Evropské produkty na bitcoin jsou proto ETP (Exchange Traded Products), nejčastěji v podobě ETN nebo ETC: burzovně obchodované dluhové cenné papíry, obvykle fyzicky kryté bitcoiny v úschově. Cena se vyvíjí téměř stejně jako bitcoin, právně jde ale o jiný nástroj než fond – s dopady na riziko i daně.",
      "Nabídka zahrnuje desítky produktů různých emitentů (např. CoinShares, WisdomTree, iShares, 21shares, Invesco, Bitwise). Poplatky se mezi nimi výrazně liší: starší produkty mají TER v jednotkách procent, novější v desetinách či setinách procenta. Aktuální poplatky a velikosti jsou v tabulce výše.",
      "ETP se kupuje přes běžného brokera stejně jako akcie a drží se na obchodním účtu, bez vlastní peněženky a privátních klíčů. Investor přitom nese riziko emitenta (viz rizika). Tato kategorie je o produktech na samotný bitcoin; akcie firem kolem kryptoměn (těžaři, burzy) drží akciové UCITS ETF, například VanEck Crypto and Blockchain Innovators (IE00BMDKNW35)."
    ],
    "verdict": [
      "Produkty na stejný podklad se liší hlavně poplatkem (TER), velikostí a emitentem. Rozdíl v TER mezi nejlevnějšími a nejdražšími bitcoinovými ETP je mnohonásobný a při dlouhém držení se kumuluje. Větší produkty mívají užší rozpětí nákup/prodej.",
      "Důležitá je struktura: fyzicky krytý produkt drží skutečné bitcoiny u custodiana, syntetický jen derivátovou expozici. Košové produkty (více kryptoměn) nebo kombinace bitcoinu se zlatem mají jiné riziko než čistý bitcoin. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají k získání expozice na cenu bitcoinu přes běžný makléřský účet, bez kryptoburzy a vlastní úschovy. Jde o vysoce volatilní aktivum, které v minulosti opakovaně ztratilo přes 70 % hodnoty. Přímý nákup bitcoinu naopak dává plnou kontrolu nad mincemi, ale i odpovědnost za jejich úschovu.",
    "risks": [
      "Extrémní volatilita: bitcoin běžně kolísá o desítky procent během měsíců a propady o více než 70 % od vrcholu se opakovaly (např. 2018 a 2022). Výnos za jeden rok o dalším vývoji mnoho neříká.",
      "Riziko emitenta a custodiana: ETP je dluhový cenný papír, ne fond s odděleným majetkem jako UCITS ETF. I u fyzicky krytých produktů nesete riziko emitenta a správce úschovy; syntetické konstrukce mají riziko vyšší.",
      "Měnové riziko vůči koruně: bitcoin se oceňuje v dolarech a produkty se obchodují v EUR nebo USD. Výnos v korunách proto vždy ovlivňuje i kurz koruny.",
      "Daňový režim: bitcoin ETP je dluhový cenný papír, ne přímo držený bitcoin. Osvobození pro cenné papíry (časový a hodnotový test) se na něj podle běžného výkladu vztahuje stejně jako u zlatých ETC; přímo držené kryptoměny se posuzují podle jiných ustanovení. U konkrétního produktu ověřte u daňového poradce."
    ],
    "faqs": [
      {
        "q": "Existuje v Evropě opravdový spot Bitcoin ETF jako v USA?",
        "a": "Ne. Americké spot bitcoin ETF (např. iShares Bitcoin Trust) v Evropě nejsou dostupné a evropská regulace UCITS neumožňuje fond na jediné aktivum bez diverzifikace. Evropský investor kupuje ETP (ETN/ETC), obvykle fyzicky kryté, které cenově kopíruje bitcoin, ale právně je to burzovně obchodovaný dluhový cenný papír, ne fond."
      },
      {
        "q": "Který bitcoin ETP je nejlevnější?",
        "a": "Poplatky se mezi produkty liší mnohonásobně: novější „core“ produkty mají TER v desetinách či setinách procenta, starší produkty v jednotkách procent – za stejný podklad. Poplatky se mění; aktuální TER všech produktů a pořadí podle nákladovosti jsou v tabulce výše."
      },
      {
        "q": "Jaký je rozdíl mezi ETF a ETP/ETN u bitcoinu?",
        "a": "Klasické ETF je fond s odděleným majetkem investorů. ETP (a jeho podoby ETN a ETC) je burzovně obchodovaný dluhový cenný papír vydaný emitentem, obvykle fyzicky krytý reálným aktivem v úschově. Rozdíl je hlavně v právní struktuře a rizikovém profilu: u ETP nesete riziko emitenta a custodiana, byť u fyzicky krytých produktů leží skutečné bitcoiny v úschově."
      },
      {
        "q": "Jak se v ČR daní zisk z bitcoin ETP?",
        "a": "Bitcoin ETP je dluhový cenný papír (ne podíl ve fondu a ne přímo držený bitcoin). Zákon o daních z příjmů osvobozuje příjem z prodeje cenného papíru po více než 3 letech držby (časový test) a příjmy z prodeje cenných papírů do 100 000 Kč za rok (hodnotový test) – podle běžného výkladu tedy i u ETC a ETP. Nejde o daňové poradenství; u konkrétního produktu si to ověřte u daňového poradce. Přímo držené kryptoměny se posuzují podle jiných ustanovení."
      },
      {
        "q": "Mám raději koupit bitcoin ETP, nebo bitcoin přímo na burze?",
        "a": "Liší se úschovou a rizikem. ETP se drží u běžného brokera vedle ostatních cenných papírů, bez privátních klíčů a peněženky; platí se TER a nese se riziko emitenta. Přímý nákup na kryptoburze dává plnou kontrolu nad mincemi a možnost vlastní úschovy, odpovědnost za bezpečnost klíčů ale nese investor sám."
      },
      {
        "q": "Nese bitcoin ETP měnové riziko vůči koruně?",
        "a": "Ano. Bitcoin se oceňuje v dolarech a ETP se obchodují v EUR nebo USD, takže výnos přepočtený do korun ovlivňuje i pohyb kurzu USD/CZK. Při nákupu z korun navíc probíhá měnová konverze. Toto riziko se přičítá k volatilitě samotného bitcoinu."
      }
    ]
  },
  "nejlepsi-distribucni-etf": {
    "introTitle": "Distribuční ETF: fondy, které vám dividendy posílají na účet",
    "intro": [
      "Distribuční ETF vyplácí dividendy nebo kupóny z portfolia na účet investora, obvykle několikrát ročně. Nejde o samostatný typ indexu ani strategii, ale o třídu fondu. Většina velkých indexů (S&P 500, FTSE All-World, MSCI World, evropské akcie i dluhopisy) existuje v distribuční (Dist) i akumulační (Acc) verzi se stejným podkladem a jiným ISINem.",
      "Distribuční ETF není totéž co dividendové ETF. Dividendové fondy (např. Vanguard FTSE All-World High Dividend Yield) vybírají firmy s vysokým dividendovým výnosem – to je strategie výběru firem. Distribuční verze běžného indexu drží stejné firmy jako akumulační, jen dividendy vyplácí.",
      "Vyplacené dividendy se v ČR daní 15 % bez ohledu na dobu držení; časový test (osvobození po třech letech) se vztahuje jen na zisk z prodeje. Výplaty přicházejí v měně fondu (USD, EUR, GBP), takže i dividenda nese kurzové riziko vůči koruně."
    ],
    "verdict": [
      "Distribuční třídy existují u velkých širokých indexů, například Vanguard FTSE All-World Distributing (IE00B3RBWM25) na celý svět, Vanguard S&P 500 Distributing (IE00B3XXRP09) a iShares Core S&P 500 (Dist) (IE0031442068) na USA nebo iShares Core MSCI Europe (Dist) (IE00B1YZSC51) na Evropu. Tyto fondy nevybírají firmy podle dividendy, jen vyplácejí dividendy, které index přirozeně přináší.",
      "Distribuční jsou i dluhopisové fondy, například iShares Core EUR Corporate Bond (Dist) (IE00B3F81R35) a iShares Core Euro Government Bond (Dist) (IE00B4WXJJ64), které vyplácejí kupóny pololetně. Cena dluhopisových fondů kolísá s úrokovými sazbami.",
      "Fondy se liší frekvencí výplat (čtvrtletně, pololetně, ročně), poplatkem, velikostí a měnou výplaty. Rozdíl oproti akumulační třídě: akumulační fond dividendy reinvestuje uvnitř a v průběhu držení se nedaní. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají, když chtějí z portfolia pravidelný peněžní tok – například ve fázi čerpání majetku (renta, FIRE). Každá výplata se v ČR daní 15 %, a kdo dividendy znovu investuje, platí navíc nákupní poplatky.",
    "risks": [
      "Daň z dividend každý rok: vyplacené dividendy se v ČR daní 15 % a časový test se na ně nevztahuje. U některých domicilů může být část daně sražena už v zahraničí.",
      "Měnové riziko i u výplat: dividendy přicházejí v USD, EUR či GBP a přepočítávají se do korun. Třídy „hedged“ zajišťují nejvýš do EUR/USD, ne do koruny.",
      "Pomalejší růst než akumulační dvojče: vyplacená a zdaněná hotovost se uvnitř fondu nezhodnocuje, rozdíl se s délkou horizontu zvětšuje.",
      "Úrokové riziko u dluhopisových fondů: pravidelná výplata kupónů neznamená, že hodnota jistiny nekolísá; při růstu sazeb kurz klesá."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi distribučním a dividendovým ETF?",
        "a": "Distribuční ETF je způsob výplaty – fond posílá dividendy na účet místo reinvestice. Dividendové ETF je strategie výběru firem s vysokým dividendovým výnosem (např. Vanguard FTSE All-World High Dividend Yield). Distribuční verze běžného indexu drží stejné firmy jako akumulační."
      },
      {
        "q": "Které distribuční ETF jsou pro Čecha nejrozumnější jádro?",
        "a": "K velkým distribučním fondům na široké indexy patří Vanguard FTSE All-World Distributing (IE00B3RBWM25) na celý svět, Vanguard S&P 500 Distributing (IE00B3XXRP09) a iShares Core S&P 500 (Dist) (IE0031442068) na USA. Z dluhopisových například iShares Core EUR Corporate Bond (Dist) (IE00B3F81R35). Pořadí podle poplatků a velikosti je v tabulce výše; žebříček řadí fondy podle dat."
      },
      {
        "q": "Jak se v Česku daní dividendy z distribučního ETF?",
        "a": "Vyplacené dividendy se daní sazbou 15 %, každý rok bez ohledu na dobu držení – časový test se na dividendy nevztahuje, jen na zisk z prodeje. U některých domicilů může být část daně sražena už v zahraničí; podrobnosti jsou v daňovém rozcestníku. Nejde o daňové poradenství."
      },
      {
        "q": "Je lepší distribuční, nebo akumulační verze?",
        "a": "Akumulační třída dividendy reinvestuje uvnitř fondu, takže se během držení nedaní a dál se zhodnocují. Distribuční třída je vyplácí na účet a každá výplata se daní 15 %. Rozdíl je tedy hlavně v tom, zda investor chce výnos čerpat, nebo nechat ve fondu."
      },
      {
        "q": "Jak často distribuční ETF vyplácejí dividendy?",
        "a": "Vanguard FTSE All-World Distributing, Vanguard S&P 500 Distributing i iShares Core S&P 500 (Dist) vyplácejí čtvrtletně. iShares Core EUR Corporate Bond (Dist) a iShares Core Euro Government Bond (Dist) vyplácejí pololetně, některé fondy ročně. Frekvence výplat je uvedena na detailu každého fondu."
      },
      {
        "q": "Přijdou mi dividendy v korunách?",
        "a": "Ne. Fondy vyplácejí v měně třídy – například Vanguard FTSE All-World Distributing a Vanguard S&P 500 Distributing v USD, evropské a dluhopisové fondy většinou v EUR nebo GBP. Dividenda se do korun přepočítává až u brokera. Mezi fondy v našem srovnání nejsou třídy zajištěné do koruny."
      }
    ]
  },
  "nejlepsi-high-yield-etf": {
    "introTitle": "High yield ETF: vyšší kupón výměnou za kreditní riziko, ne za bezpečí",
    "intro": [
      "„High yield“ zde neznamená vysokodividendové akcie (ty mají vlastní kategorii dividendových ETF). High yield ETF drží dluhopisy firem s ratingem pod investičním stupněm (BB, B, CCC a níže), tzv. junk bonds. Trh u nich počítá s vyšší pravděpodobností nesplacení, a proto nesou vyšší výnos než státní nebo investment-grade dluhopisy – vyšší výnos je odměnou za převzaté kreditní riziko.",
      "Fondy rozkládají riziko do stovek dluhopisů různých emitentů a odvětví. Na evropském trhu jsou dvě hlavní skupiny: eurové HY (dluhopisy evropských firem v EUR, např. iShares EUR High Yield Corporate Bond, IE00B66F4759, nebo Xtrackers EUR High Yield Corporate Bond, LU1109943388) a dolarové HY (americké firmy v USD, např. iShares USD High Yield Corporate Bond, IE00B4PY7Y77, nebo iShares Broad USD High Yield Corporate Bond, IE00BG0J4957). Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "High yield se chová napůl jako dluhopis a napůl jako akcie: v klidných časech vydělává na kupónech, při recesi nebo panice ale klesá spolu s akciemi, protože roste obava z bankrotů. Na rozdíl od kvalitních státních dluhopisů proto portfolio v krizích obvykle nestabilizuje."
    ],
    "verdict": [
      "Měna: eurové fondy nesou riziko EUR/CZK, dolarové USD/CZK. Třídy amerického HY zajištěné do eura (např. IE00BF3N7102) odstraňují pohyb USD vůči EUR, ne EUR vůči koruně.",
      "Durace a typ dluhopisů: fondy s krátkou durací (např. iShares USD Short Duration High Yield, IE00BCRY6003 distribuční / IE00BZ17CN18 akumulační) drží dluhopisy blízko splatnosti a méně reagují na změny sazeb. Fondy „fallen angels“ (iShares Fallen Angels High Yield, IE00BYM31M36 / IE00BDFJYP58) drží dluhopisy firem, které nedávno ztratily investiční rating.",
      "Poplatek a velikost: TER se mezi fondy liší – některé eurové a „broad“ fondy jsou výrazně levnější než tradiční fondy na stejný trh. Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "Třída: akumulační třída kupóny reinvestuje, distribuční je vyplácí (v ČR se daní 15 %)."
    ],
    "forWhom": "Investoři high yield ETF používají jako menšinovou, výnosově agresivnější složku dluhopisové části portfolia, případně jako zdroj vyššího průběžného příjmu (distribuční třídy). Cena fondů může výrazně kolísat a v krizích obvykle klesá spolu s akciemi. Nejde o obdobu spořicího účtu ani krátkodobé rezervy.",
    "risks": [
      "Kreditní riziko a bankroty: emitenti v pásmu BB až CCC bankrotují častěji než firmy investičního stupně. V recesi míra bankrotů roste plošně a hodnota fondu klesá.",
      "Pokles spolu s akciemi: v roce 2008 i při covidovém propadu 2020 high yield klesal současně s akciovým trhem, takže neplní roli stabilizátoru jako kvalitní státní dluhopisy.",
      "Měnové riziko vůči koruně: dolarové fondy nesou riziko USD/CZK, eurové EUR/CZK. Zajištění do eura neodstraní pohyb eura vůči koruně.",
      "Likvidita a úrokové riziko: v panice trh podřadných dluhopisů vysychá a rozpětí se rozšiřují, což prohlubuje propad ceny. Delší durace přidává citlivost na sazby; fondy s krátkou durací jí mají méně."
    ],
    "faqs": [
      {
        "q": "Je high yield ETF totéž co dividendové ETF?",
        "a": "Ne, je to častá záměna kvůli slovu „yield“. High yield ETF drží podřadné (junk) firemní dluhopisy s ratingem pod investičním stupněm a výnos plyne z kupónů. Dividendové ETF drží akcie firem s vysokými dividendami. Jde o dvě různé třídy aktiv s jiným rizikem: u high yield kreditní riziko dlužníků, u dividendových akcií kolísání akciového trhu. Akciovým výplatám se věnuje kategorie dividendových ETF."
      },
      {
        "q": "Kolik high yield ETF vynáší a je to bezpečné?",
        "a": "Výnos do splatnosti se mění se sazbami a kreditními spready, proto ho v textu neuvádíme. Dolarové HY fondy mívají vyšší výnos než eurové. Vyšší výnos odráží vyšší riziko: v recesi rostou bankroty a fondy mohou ztratit dvouciferná procenta, jako v roce 2008. Nejde o bezpečné uložení peněz."
      },
      {
        "q": "Musím zisk z high yield ETF v ČR danit?",
        "a": "High yield ETF jsou dluhopisové fondy (cenné papíry), takže platí stejná pravidla jako u jiných ETF. Zisk z prodeje je v ČR osvobozen, pokud fond držíte déle než 3 roky (časový test), nebo pokud úhrn příjmů z prodeje cenných papírů za rok nepřesáhne 100 000 Kč (hodnotový test); od roku 2026 bez horního limitu. Jinak se zisk daní jako ostatní příjem. U distribučních tříd se vyplacené kupóny daní 15 %. Text není daňové poradenství."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční verzi?",
        "a": "Akumulační třída (např. IE00BF3N7094 nebo IE00BYXYYL56) reinvestuje kupóny uvnitř fondu, takže se průběžně nic nedaní. Distribuční třída (např. IE00B66F4759 nebo IE00B4PY7Y77) vyplácí kupóny na účet a ty se v ČR daní 15 %. U high yield s vyšším kupónem je tento rozdíl citelnější než u dluhopisů s nízkým výnosem."
      },
      {
        "q": "Mám volit eurový, nebo dolarový high yield fond?",
        "a": "Dolarové HY mívají vyšší výnos, ale nesou riziko USD/CZK: posílení koruny vůči dolaru může kupón smazat. Eurové HY mají nižší výnos a riziko EUR/CZK. Třídy amerického HY zajištěné do eura (např. IE00BF3N7102) zajišťují jen pár USD/EUR, ne vůči koruně, takže kurzové riziko vůči koruně zůstává."
      },
      {
        "q": "Čím se high yield liší od běžných korporátních dluhopisů?",
        "a": "Rozdíl je v ratingu. Korporátní dluhopisy investičního stupně (BBB a výše) mají nižší riziko bankrotu a nižší výnos. High yield je o stupeň níž (BB a hůře), kde je vyšší kupón vykoupen výrazně vyšším rizikem nesplacení. Zvláštní skupinou jsou „fallen angels“ (např. iShares Fallen Angels, IE00BYM31M36) – dluhopisy firem, které nedávno ztratily investiční rating."
      }
    ]
  },
  "nejlepsi-indicke-etf": {
    "introTitle": "Indické ETF: indické akcie v evropských fondech",
    "intro": [
      "Indické ETF sledují akcie indického trhu. Přímý nákup akcií na indických burzách (NSE, BSE) je pro zahraniční drobné investory složitý, proto jsou v tabulce evropské UCITS fondy obchodované na evropských burzách. Hlavní indexy jsou MSCI India (velké a střední firmy), FTSE India a Nifty 50 (50 velkých firem z burzy NSE).",
      "Řada indických fondů replikuje index synteticky přes swap, místo aby akcie držela fyzicky. Fyzicky drží akcie například iShares MSCI India (IE00BZCQB185) a Franklin FTSE India (IE00BHZRQZ17); fondy Amundi na MSCI India, Xtrackers MSCI India Swap a UBS MSCI India SF používají swap. Způsob replikace mění profil rizika (viz rizika).",
      "Indie je obsažena i v ETF na rozvíjející se trhy (MSCI Emerging Markets) a v celosvětových fondech. Samostatné indické ETF tak zvyšuje váhu Indie v portfoliu nad její podíl v těchto indexech."
    ],
    "verdict": [
      "Replikace: fyzická (fond drží akcie), nebo syntetická (výnos indexu dodává protistrana swapu). Swap přináší riziko protistrany; fyzické držení indických akcií je pro zahraniční fondy kvůli indickým daňovým a regulatorním pravidlům nákladnější.",
      "Index: MSCI India, FTSE India a Nifty 50 se liší počtem firem, největší firmy ale mají vysokou váhu ve všech. Na Nifty 50 je nabídka UCITS fondů úzká (Xtrackers Nifty 50 Swap, syntetická replikace).",
      "Náklady a velikost: TER indických fondů se mezi poskytovateli výrazně liší – od úrovně běžných indexových fondů po výrazně vyšší hodnoty. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři indická ETF používají ke zvýšení váhy Indie nad úroveň, kterou mají v ETF na rozvíjející se trhy nebo v celosvětovém fondu. Jde o fondy na jednu zemi s vyšší kolísavostí a měnovým rizikem rupie.",
    "risks": [
      "Koncentrace do jedné země: fond drží akcie jediného rozvíjejícího se trhu bez geografické diverzifikace. Indický trh se navíc obvykle obchoduje za vyšší ocenění než řada jiných rozvíjejících se trhů.",
      "Dvojí měnové riziko: akcie jsou v indických rupiích (INR), fond je vedený v USD nebo EUR. Do výnosu v korunách se promítá pohyb obou měn; třídy zajištěné do koruny v přehledu nejsou.",
      "Syntetická replikace u části fondů: fondy na swap nedrží indické akcie přímo, přinášejí riziko protistrany a menší transparentnost. Fyzicky replikují například iShares MSCI India a Franklin FTSE India.",
      "Vyšší náklady u části fondů: TER řady indických ETF je výrazně vyšší než u širokých indexových fondů; aktuální hodnoty jsou v tabulce výše."
    ],
    "faqs": [
      {
        "q": "Jaké je největší a nejznámější indické ETF pro českého investora?",
        "a": "Největší je iShares MSCI India UCITS ETF USD (Acc) (IE00BZCQB185). Drží akcie fyzicky, je akumulační a má irský domicil; jeho TER patří mezi indickými fondy k vyšším. Aktuální velikost a poplatek jsou v tabulce výše."
      },
      {
        "q": "Které indické ETF má nejnižší poplatek (TER)?",
        "a": "Mezi akciovými indickými fondy mají nejnižší TER UBS MSCI India SF (IE000N70F6V6), Franklin FTSE India (IE00BHZRQZ17) a Xtrackers MSCI India Swap (LU0514695187). Fondy UBS a Xtrackers replikují synteticky, Franklin fyzicky. Aktuální hodnoty a pořadí jsou v tabulce výše."
      },
      {
        "q": "Je lepší MSCI India, nebo Nifty 50?",
        "a": "MSCI India zahrnuje velké a střední indické firmy, Nifty 50 jen padesát velkých firem z burzy NSE. Největší firmy mají vysokou váhu v obou indexech, takže se výkonnost liší spíše mírně. Na MSCI India je v nabídce víc fondů s různými poplatky, Nifty 50 zastupuje v přehledu jediný fond (Xtrackers Nifty 50 Swap)."
      },
      {
        "q": "Proč jsou indické ETF často synteticky replikované (swap)?",
        "a": "Indická daňová a regulatorní pravidla dělají přímé (fyzické) držení akcií pro zahraniční fondy nákladné a administrativně náročné. Řada poskytovatelů (Amundi, Xtrackers, UBS) proto index replikuje přes swap, kde výnos dodává finanční protistrana. Výsledkem bývají nižší náklady a přesnější sledování indexu výměnou za riziko protistrany. Fyzicky replikují například iShares MSCI India a Franklin FTSE India."
      },
      {
        "q": "Nemám Indii už ve svém ETF na rozvíjející se trhy?",
        "a": "Ano, částečně. Indie patří k větším zemím indexu MSCI Emerging Markets a je obsažena i v celosvětových all-world fondech. Kdo tyto fondy drží, má část indické expozice automaticky; samostatné indické ETF tuto váhu zvyšuje."
      },
      {
        "q": "Jak se v Česku daní zisk z indického ETF?",
        "a": "U akciových ETF platí standardní pravidla: zisk z prodeje je osvobozen po splnění časového testu (držba déle než 3 roky, od roku 2026 bez horního limitu) nebo hodnotového testu (příjmy z prodeje cenných papírů do 100 000 Kč za rok). U akumulačních fondů se reinvestice dividend uvnitř fondu u investora nedaní, u distribučních tříd se vyplacené dividendy daní 15 %. Domicil ani syntetická replikace na tato pravidla pro českého investora nic nemění. Nejde o daňové poradenství."
      }
    ]
  },
  "nejlepsi-infrastrukturni-etf": {
    "introTitle": "Infrastrukturní ETF: sítě, doprava a energetická infrastruktura",
    "intro": [
      "Infrastrukturní ETF sdružují firmy, které vlastní a provozují fyzickou infrastrukturu: přenosové a distribuční sítě, plynovody, dálnice a mýtné silnice, letiště, přístavy, železnice, vodárny, telekomunikační věže a datová centra. Jde o výsek akciového trhu se specifickým profilem – firmy mají často regulovaný nebo dlouhodobě smluvně zajištěný příjem, vysoké vstupní bariéry a tržby částečně navázané na inflaci.",
      "Klasickým benchmarkem je index S&P Global Infrastructure se 75 firmami ve třech blocích: energetika a sítě (utilities), doprava a energetická infrastruktura. Další fondy sledují například FTSE Global Core Infrastructure. Kategorie se ale dělí na dvě odlišné skupiny: klasickou defenzivní infrastrukturu (sítě, mýtné, letiště) a tematické fondy kolem AI, datových center a elektrifikace, které jsou růstovější a výrazně kolísavější. Složení se proto podle indexu liší víc než u jiných kategorií.",
      "Fondy jsou UCITS s irským nebo lucemburským domicilem a obchodují se v dolarech nebo eurech; podkladové akcie jsou globální. Výnos v korunách proto ovlivňuje kurz koruny – i při růstu indexu může posílení koruny výnos v Kč smazat. Od průmyslových (industrials) ETF se infrastruktura liší tím, že nejde o výrobce strojů a cyklické firmy, ale o provozovatele aktiv se stabilnějším cash flow."
    ],
    "verdict": [
      "Rozhodující je index. Klasická infrastruktura (S&P Global Infrastructure, FTSE Global Core Infrastructure) se chová defenzivně; tematické fondy na chytré sítě, elektrifikaci nebo AI infrastrukturu kolísají spíš jako technologické akcie a překrývají se s technologickým sektorem. Některé fondy přidávají ESG filtr nebo kombinují akcie s dalšími třídami aktiv.",
      "Fondy se dále liší replikací (fyzická, nebo swapová), třídou (akumulační dividendy reinvestuje, distribuční vyplácí), poplatkem a velikostí. Poplatky jsou u infrastrukturních fondů obvykle vyšší než u širokých indexových fondů. Aktuální TER a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají jako doplněk k širokému akciovému jádru: sektor s jiným profilem než technologie, stabilnějším cash flow a částečnou vazbou na inflaci; distribuční třídy i jako zdroj dividend. Tematické fondy na AI a chytré sítě mají výrazně vyšší kolísání než klasická infrastruktura.",
    "risks": [
      "Záměna defenzivní a tematické infrastruktury: pod jednou kategorií jsou fondy s odlišným rizikem. Klasické indexy jsou defenzivní, tematické fondy na AI infrastrukturu nebo chytré sítě kolísají jako technologické akcie. Rozdíl ukazuje index a největší pozice fondu.",
      "Měnové riziko vůči koruně: fondy jsou v USD nebo EUR a podklad je globální. I když infrastruktura roste, posílení koruny může výnos v korunách smazat.",
      "Citlivost na úrokové sazby a vyšší poplatky: infrastrukturní firmy bývají silně zadlužené a jejich dividendy konkurují dluhopisům, takže při růstu sazeb bývají pod tlakem. TER je obvykle vyšší než u širokých indexových fondů.",
      "Koncentrace a regulace: indexy drží relativně málo firem (S&P Global Infrastructure 75) a výnosy závisejí na regulaci, koncesích a mýtných sazbách. Zásah regulátora nebo výpadek dopravy (jako u letišť během pandemie) dopadá na výnos přímo."
    ],
    "faqs": [
      {
        "q": "Jaký je nejlepší klasický globální infrastrukturní ETF pro Čecha?",
        "a": "Klasickou globální infrastrukturu sledují fondy na indexy S&P Global Infrastructure (např. Xtrackers S&P Global Infrastructure Swap, LU0322253229) a FTSE Global Core Infrastructure (např. iShares Global Infrastructure, distribuční IE00B1FZS467, akumulační IE000CK5G8J7). Liší se indexem, replikací (fyzická, nebo swapová), třídou a poplatkem. Aktuální pořadí podle nákladovosti a velikosti je v žebříčcích na této stránce."
      },
      {
        "q": "Jaký je rozdíl mezi infrastrukturním a průmyslovým (industrials) ETF?",
        "a": "Infrastrukturní ETF drží provozovatele fyzických aktiv se stabilním, často regulovaným cash flow: sítě, mýtné silnice, letiště, plynovody, věže. Průmyslové (industrials) ETF drží cyklické výrobce strojů, letecký a obranný průmysl a logistiku, jejichž zisky silně kolísají s hospodářským cyklem. Infrastruktura je defenzivnější a víc navázaná na inflaci, industrials je cykličtější."
      },
      {
        "q": "Chrání infrastrukturní ETF proti inflaci?",
        "a": "Částečně. Řada infrastrukturních firem (mýtné silnice, vodárny, regulované sítě) má příjmy smluvně nebo regulatorně navázané na inflaci, takže při růstu cen rostou i jejich tržby. Proti tomu působí citlivost na úrokové sazby, protože jde o zadlužené firmy s dividendovým profilem. Ochrana proti inflaci tedy není zaručená."
      },
      {
        "q": "Je AI Infrastructure nebo Smart Grid ETF to samé jako klasická infrastruktura?",
        "a": "Ne. Fondy jako iShares AI Infrastructure (IE000X59ZHE2) nebo First Trust Nasdaq Clean Edge Smart Grid Infrastructure (IE000J80JTL1) jsou tematické růstové fondy zaměřené na datová centra, elektrifikaci a AI hardware. Kolísají mnohem víc než klasická infrastruktura a překrývají se s technologickým sektorem."
      },
      {
        "q": "Jak se infrastrukturní ETF daní v Česku v roce 2026?",
        "a": "Jde o akciové UCITS fondy (cenné papíry), takže platí standardní pravidla. Zisk z prodeje je osvobozen po splnění časového testu (držení déle než 3 roky; od roku 2026 bez horního limitu), nebo pokud úhrn vašich prodejů za rok nepřesáhne 100 000 Kč (hodnotový test). Dividendy z distribučních tříd se daní 15 %. U akumulačních tříd se reinvestice uvnitř fondu v přiznání neřeší. Detaily najdete v našem daňovém přehledu."
      },
      {
        "q": "Mám volit distribuční, nebo akumulační infrastrukturní ETF?",
        "a": "Akumulační třída dividendy reinvestuje uvnitř fondu a průběžně se nedaní. Distribuční třída je vyplácí jako pravidelný příjem a v ČR se daní 15 %. Infrastruktura patří k sektorům s vyššími dividendami, takže rozdíl mezi třídami je tu znatelnější než u růstových témat."
      }
    ]
  },
  "nejlepsi-korporatni-dluhopisy-etf": {
    "introTitle": "Korporátní dluhopisové ETF: kreditní přirážka a kreditní riziko",
    "intro": [
      "Korporátní investment-grade dluhopisové ETF drží dluhopisy firem s ratingem v pásmu AAA až BBB-. Od vládních dluhopisů se liší kreditním rizikem: firma může zkrachovat nebo jí může klesnout rating. Za toto riziko investor dostává kreditní přirážku (spread) – výnos navíc nad státním dluhopisem stejné splatnosti. Dluhopisy pod tímto pásmem (BB a níže) patří do kategorie high-yield.",
      "Většina fondů je v eurech nebo dolarech a drží evropské, respektive americké firemní dluhopisy – například iShares Core EUR Corporate Bond (IE00B3F81R35) nebo Vanguard USD Corporate Bond (IE00BGYWFK87). Výnos v korunách proto ovlivňuje i kurz EUR/CZK nebo USD/CZK.",
      "U dolarových fondů může pohyb kurzu USD/CZK tvořit větší část výsledku v korunách než samotný dluhopisový výnos. Výnosy fondů v Kč jsou v tabulce výše."
    ],
    "verdict": [
      "Fondy se liší hlavně měnou a regionem emitentů (EUR, nebo USD), durací (široké indexy vs. krátké splatnosti 0–3 nebo 1–5 let), poplatkem (TER), velikostí a třídou: akumulační kupóny reinvestuje, distribuční je vyplácí. Široké fondy drží stovky emisí, takže úpadek jedné firmy má na fond malý vliv.",
      "Kratší durace znamená menší kolísání ceny při pohybu sazeb a obvykle i nižší výnos. Vyplacené kupóny z distribučních tříd se v ČR daní 15 %. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají v dluhopisové části portfolia, když chtějí vyšší výnos než ze státních dluhopisů a přijímají za to kreditní riziko. V akciových krizích se kreditní přirážky mohou rozšířit a fondy pak klesají spolu s trhem.",
    "risks": [
      "Kreditní riziko: ratingy se mohou zhoršit a v recesi se kreditní přirážky rozšiřují – cena fondu pak klesá i bez skutečného úpadku emitenta.",
      "Úrokové (durační) riziko: při růstu sazeb ceny dluhopisů klesají, u fondů s dlouhou durací víc než u krátkých (0–3, 1–5 let).",
      "Měnové riziko vůči koruně: u dolarových fondů výsledek v korunách silně ovlivňuje kurz USD/CZK. Třídy „EUR Hedged“ zajišťují jen do eura, ne do koruny.",
      "Nižší likvidita podkladu: firemní dluhopisy se obchodují méně než akcie a v tržním stresu se rozpětí nákup/prodej rozšiřuje, u malých fondů víc."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi korporátním a vládním dluhopisovým ETF?",
        "a": "Vládní ETF drží dluhopisy států; hlavní riziko je úrokové a měnové. Korporátní investment-grade ETF drží dluhopisy firem s ratingem AAA až BBB- a nabízejí kreditní přirážku (spread) nad státním výnosem. Za ni nesou riziko zhoršení ratingu nebo úpadku emitenta."
      },
      {
        "q": "Jaký je rozdíl oproti high-yield (junk) ETF?",
        "a": "Investment-grade znamená rating AAA až BBB-. High-yield ETF drží dluhopisy s nižším ratingem (BB a níže), s vyšším výnosem i vyšší pravděpodobností úpadku. Fondy v této kategorii high-yield dluhopisy nedrží; ty jsou v samostatné kategorii."
      },
      {
        "q": "Proč měl dolarový korporátní fond výnos přes 5 % a eurový skoro nula?",
        "a": "Velkou část rozdílu mezi dolarovými a eurovými fondy v korunách tvoří kurz. Výnos přepočtený do korun u dolarových fondů (např. iShares USD Corporate Bond, Vanguard USD Corporate Bond) silně ovlivňuje pohyb USD/CZK, u eurových pohyb EUR/CZK. Aktuální výnosy v Kč jsou v tabulce výše."
      },
      {
        "q": "Mám volit akumulační, nebo distribuční variantu?",
        "a": "Akumulační třída (např. iShares Core EUR Corporate Bond Acc, IE00BF11F565, nebo Vanguard EUR Corporate Bond Acc, IE00BGYWT403) kupóny reinvestuje uvnitř fondu a během držení se nedaní. Distribuční třída (např. IE00B3F81R35, IE0032895942) kupóny vyplácí a vyplacené kupóny se v ČR daní 15 %."
      },
      {
        "q": "Jak se korporátní dluhopisové ETF daní v Česku?",
        "a": "Jde o klasické cenné papíry-fondy. Zisk z prodeje podílů je osvobozen po splnění tříletého časového testu (od roku 2026 bez horního limitu), případně pokud úhrn všech prodejů nepřesáhne 100 000 Kč za rok (hodnotový test). U distribučních tříd se vyplácené kupóny daní 15 %; u akumulačních fondů se reinvestice uvnitř fondu v přiznání neřeší. Detaily najdete v našem daňovém hubu."
      },
      {
        "q": "Co když centrální banka zvedne sazby – přijdu o peníze?",
        "a": "Při růstu sazeb ceny dluhopisů klesají, u fondů s dlouhou durací víc. Fondy s krátkými splatnostmi (např. iShares USD Short Duration Corporate Bond, IE00BYXYYP94, nebo Amundi EUR Corporate Bond 1-5Y ESG, LU1525418643) kolísají méně, obvykle za cenu nižšího výnosu. Průměrná durace je uvedena v dokumentech každého fondu."
      }
    ]
  },
  "nejlepsi-obnovitelne-zdroje-etf": {
    "introTitle": "Obnovitelné zdroje jako celý ekosystém: nejen solár, ale i voda, sítě a úložiště",
    "intro": [
      "Kategorie zahrnuje celý řetězec energetické transformace: výrobu energie (solár, vítr, vodík), ale i infrastrukturu – rozvodné a chytré sítě, elektrifikaci, bateriová úložiště a vodohospodářství. Patří sem tedy úzké clean-energy fondy i fondy na firmy, které transformaci obsluhují.",
      "Příklady fondů podle části řetězce: čistá energie – iShares Global Clean Energy Transition (distribuční IE00B1XNHC34, akumulační IE000U58J0M1); sítě a elektrifikace – First Trust Nasdaq Clean Edge Smart Grid Infrastructure (IE000J80JTL1) a Xtrackers Electrification Technologies & Smart Grid (IE000O7Q2E56); voda – iShares Global Water (IE00B1TXK627) a L&G Clean Water (IE00BK5BC891); baterie – L&G Battery Value-Chain (IE00BF0M2Z96). Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "Části kategorie se chovají různě: čistá energie a úzká témata (baterie, solár, vodík) umí za rok vzrůst i klesnout o desítky procent, vodohospodářské fondy kolísají méně. TER je citelně vyšší než u širokého světového indexu. Fondy jsou vedené v USD nebo EUR, takže výnos v korunách ovlivňuje i kurz koruny."
    ],
    "verdict": [
      "Část řetězce: výroba čisté energie je citlivá na úrokové sazby a dotace, sítě, elektrifikace a voda stojí víc na infrastruktuře a regulovaných byznysech. Tato volba nejvíc určuje, jak moc fond kolísá.",
      "Šíře fondu: široký clean-energy fond drží víc firem, úzká témata (solár, vítr, baterie, vodík) mají méně titulů a vyšší koncentraci.",
      "Velikost: řada tematických fondů je malá; u malých fondů je širší rozpětí nákup/prodej a vyšší riziko zrušení. Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "Třída a domicil: akumulační třída dividendy reinvestuje, distribuční je vyplácí (v ČR se daní 15 %). Irský domicil (ISIN začíná IE) snižuje srážkovou daň z amerických dividend uvnitř fondu."
    ],
    "forWhom": "Investoři je používají jako tematický doplněk k širokému akciovému fondu, zaměřený na energetickou transformaci. Čistá výroba energie a úzká témata kolísají výrazně víc než sítě a voda – čistě obnovitelné fondy prošly po roce 2021 několikaletým hlubokým propadem. Kategorie není diverzifikovanou náhradou širokého indexu.",
    "risks": [
      "Citlivost výroby na úrokové sazby: projekty jsou kapitálově náročné a financované dluhem, takže růst sazeb sráží ocenění. Proto čistě obnovitelné fondy po roce 2021 ztratily desítky procent a zotavovaly se roky.",
      "Koncentrace úzkých témat: fondy na solár, vítr, vodík nebo baterie mají méně titulů s velkou vahou jednotlivých firem; neúspěch několika firem nebo nástup jiné technologie je zasáhne víc než široký trh.",
      "Malé fondy a likvidita: řada fondů v kategorii je malá. Hrozí širší rozpětí nákup/prodej a riziko, že emitent fond po opadnutí zájmu zruší.",
      "Měnové riziko vůči koruně: fondy jsou vedené v USD nebo EUR. I když fond ve své měně roste, oslabení dolaru nebo eura vůči koruně snižuje výnos v Kč."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi ETF na obnovitelné zdroje a clean energy ETF?",
        "a": "Pojmy se z velké části překrývají. Clean-energy fondy (např. iShares Global Clean Energy Transition) míří na výrobu čisté energie – solár, vítr, vodní elektrárny – a jsou citlivé na úrokové sazby. Kategorie obnovitelných zdrojů na tomto webu zahrnuje navíc sítě a elektrifikaci, vodu a úložiště, které se chovají klidněji."
      },
      {
        "q": "Který fond je pro tuhle kategorii nejlikvidnější a nejbezpečnější volbou?",
        "a": "Aktuální velikosti fondů jsou v tabulce výše (řazení „Největší“). K velkým fondům kategorie patří iShares Global Clean Energy Transition (IE00B1XNHC34) a First Trust Smart Grid Infrastructure (IE000J80JTL1). Velký fond má obvykle užší rozpětí nákup/prodej a menší riziko zrušení – to je ale jiné riziko než kolísání ceny, které je u celé kategorie vysoké."
      },
      {
        "q": "Musím řešit daně, když fond drží zahraniční akcie a vyplácí dividendy?",
        "a": "U akciových ETF platí běžná pravidla. Zisk z prodeje je v ČR osvobozen, pokud fond držíte déle než 3 roky (časový test), nebo pokud úhrn příjmů z prodeje cenných papírů za rok nepřesáhne 100 000 Kč (hodnotový test); od roku 2026 bez horního limitu. Jinak se zisk daní jako ostatní příjem. U distribučních tříd (např. iShares Global Clean Energy Transition Dist) se přijaté dividendy daní 15 %; u akumulačních tříd (např. First Trust Smart Grid, Xtrackers Electrification) se reinvestice uvnitř fondu v přiznání neřeší. Text není daňové poradenství."
      },
      {
        "q": "Proč čistě obnovitelné fondy tolik kolísají a sítě nebo voda méně?",
        "a": "Výroba čisté energie je kapitálově náročná a financovaná dluhem, takže prudce reaguje na úrokové sazby a dotační politiku – odtud propad čistě obnovitelných fondů o desítky procent po roce 2021. Sítě, elektrifikace a vodohospodářství stojí víc na infrastruktuře a regulovaných byznysech s předvídatelnějšími tržbami, takže se chovají klidněji."
      },
      {
        "q": "Nesu jako Čech měnové riziko, i když je fond v EUR?",
        "a": "Ano. Fondy jsou vedené v USD nebo EUR a měnově zajištěné třídy, pokud existují, zajišťují do EUR nebo USD, ne do koruny. Výnos v korunách proto ovlivňuje kurz: když dolar nebo euro vůči koruně oslabí, výsledek v Kč se sníží, i když fond ve své měně roste."
      },
      {
        "q": "Kolik z portfolia dává smysl do obnovitelných zdrojů dát?",
        "a": "Konkrétní podíl srovnávač neurčuje. Kategorie je koncentrovaná a kolísavá a investoři ji obvykle drží jako doplněk vedle širokého akciového fondu; nejkolísavější jsou úzká témata (solár, vítr, baterie, vodík). Čím vyšší podíl, tím víc výsledek portfolia závisí na jednom tématu."
      }
    ]
  },
  "nejlepsi-prumyslove-etf": {
    "introTitle": "Průmyslové ETF: akcie firem ze sektoru industrials",
    "intro": [
      "Průmyslový (industrials) sektor je jeden z jedenácti sektorů klasifikace GICS a patří k nejcykličtějším částem akciového trhu. Zahrnuje letecký a obranný průmysl (Boeing, RTX, GE Aerospace, Safran, Airbus), strojírenství a automatizaci (Siemens, Caterpillar, Schneider Electric, ABB), dopravu a logistiku (Union Pacific, UPS, Deutsche Post), stavební a inženýrské služby i letiště. Průmyslové ETF tyto firmy spojují do jednoho koše, obvykle váženého tržní kapitalizací.",
      "Průmysl je cyklický sektor: firmám se daří, když ekonomika zrychluje a firmy investují do strojů, staveb a dopravy. V recesi se kapitálové výdaje škrtají mezi prvními a průmyslové akcie mohou klesat hlouběji než široký trh. V posledních letech sektor ovlivňoval návrat výroby do USA a Evropy, vyšší obranné rozpočty v Evropě po roce 2022 a investice do automatizace a datových center.",
      "„Industrial Metals“ (například WisdomTree Industrial Metals, ISIN GB00B15KYG56) nejsou průmyslové akciové ETF, ale komoditní ETC na měď, hliník, zinek a nikl – jiný produkt s jiným daňovým i rizikovým profilem. Tato kategorie se týká akcií průmyslových firem; komoditní produkty mají vlastní kategorii.",
      "Průmysl se liší i od dvou sousedních témat: infrastrukturní ETF (mýtné silnice, přenosové sítě, energetická infrastruktura se stabilním cash flow) a energetické ETF (těžba ropy a plynu). Na obě sousední kategorie máme samostatné průvodce."
    ],
    "verdict": [
      "Region: v tabulce jsou fondy na globální průmysl (například Xtrackers MSCI World Industrials, IE00BM67HV82), americký (například iShares S&P 500 Industrials Sector, IE00B4LN9N13, nebo Xtrackers MSCI USA Industrials, IE00BCHWNV48) i evropský (například iShares MSCI Europe Industrials Sector, IE00BMW42520, nebo SPDR MSCI Europe Industrials, IE00BKWQ0J47). Globální fond rozkládá expozici do více zemí, regionální se soustředí na jednu ekonomiku.",
      "Index a název: sektorový fond se pozná podle slova „Industrials“ a indexu typu MSCI nebo S&P Industrials. iShares Dow Jones Industrial Average (IE00B53L4350) navzdory názvu sektorový není – index Dow Jones Industrial Average tvoří 30 velkých amerických firem z různých sektorů.",
      "Třída a náklady: akumulační třída dividendy reinvestuje, distribuční (například Xtrackers MSCI USA Industrials 1D) je vyplácí. Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "forWhom": "Investoři průmyslová ETF používají jako doplňkovou sektorovou pozici vedle širokého jádra, když chtějí zvýšit váhu cyklického průmyslu, automatizace či obrany. Průmysl je obsažen i v každém širokém akciovém indexu, takže sektorový fond jeho váhu navyšuje.",
    "risks": [
      "Cykličnost: v recesi firmy škrtají kapitálové výdaje mezi prvními a průmyslové akcie mohou klesat hlouběji a rychleji než široký trh. Výnosy minulých let nejsou zárukou budoucích.",
      "Překryv se širokými indexy: průmysl tvoří zhruba desetinu globálních indexů typu MSCI World nebo FTSE All-World, takže sektorový fond tuto váhu zvyšuje. U amerických fondů mají velkou váhu jednotlivé obory, například letecký a obranný průmysl.",
      "Měnové riziko: fondy jsou v USD nebo EUR a jejich hodnota v korunách kolísá s kurzem. Ani třídy vedené v EUR nejsou zajištěné do koruny.",
      "Záměna produktů: „Industrial Metals“ jsou komoditní ETC a „Dow Jones Industrial Average“ je 30 firem napříč sektory. Sektorový fond se pozná podle indexu, ne podle slova v názvu."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi průmyslovým a infrastrukturním ETF?",
        "a": "Průmyslové (industrials) ETF drží akcie výrobních, strojírenských, leteckých, obranných a dopravních firem (Siemens, Caterpillar, Boeing, Union Pacific) a jeho výsledky závisí na hospodářském cyklu. Infrastrukturní ETF cílí na provozovatele mýtných silnic, letišť, přenosových a energetických sítí, kde jde o stabilní, často inflačně vázané cash flow, tedy defenzivnější profil. Na infrastrukturu máme samostatný průvodce."
      },
      {
        "q": "Není 'Dow Jones Industrial Average' ETF vlastně průmyslové ETF?",
        "a": "Ne, navzdory názvu. Fondy jako iShares Dow Jones Industrial Average (IE00B53L4350) sledují 30 velkých amerických firem napříč sektory (například Apple, Goldman Sachs nebo Coca-Cola). Slovo „Industrial“ je historický název indexu z 19. století. Sektorové průmyslové fondy mají v názvu „Industrials“ a sledují index typu MSCI nebo S&P Industrials."
      },
      {
        "q": "Jsou 'Industrial Metals' fondy totéž co průmyslové ETF?",
        "a": "Nejsou. WisdomTree Industrial Metals (GB00B15KYG56) a podobné produkty jsou komoditní ETC na průmyslové kovy (měď, hliník, zinek, nikl). Právně to nejsou akciové fondy, nesou riziko emitenta a mají odlišné daňové zacházení. Průmyslové akciové ETF drží akcie firem, ne kovy."
      },
      {
        "q": "Jak se v Česku daní zisk z průmyslového ETF v roce 2026?",
        "a": "U akciového ETF platí časový test: při držbě déle než 3 roky je zisk z prodeje od daně osvobozen, od roku 2026 bez horního limitu. Hodnotový test osvobozuje příjmy z prodeje cenných papírů do 100 000 Kč za rok. Dividendy z distribučních tříd (například Xtrackers MSCI USA Industrials 1D) se daní 15 %, u akumulačních tříd (například Xtrackers MSCI World Industrials 1C) se reinvestice uvnitř fondu v přiznání neřeší. Nejde o daňové poradenství; detaily jsou v daňovém průvodci."
      },
      {
        "q": "Akumulační, nebo distribuční třída u průmyslového ETF?",
        "a": "Akumulační třída (například Xtrackers MSCI World Industrials 1C, IE00BM67HV82, nebo iShares MSCI Europe Industrials Sector Acc, IE00BMW42520) dividendy reinvestuje uvnitř fondu a investor je neřeší v přiznání. Distribuční třídy (například Xtrackers MSCI USA Industrials 1D nebo iShares MSCI World Industrials Sector Advanced Dist) dividendy vyplácejí a ty se daní 15 %."
      },
      {
        "q": "Kolik procent portfolia dát do průmyslového ETF?",
        "a": "Podíl je individuální rozhodnutí podle cílů a tolerance k riziku, srovnávač ho neurčuje. Průmysl tvoří zhruba desetinu globálních indexů typu MSCI World, takže sektorový fond tuto váhu navyšuje. V recesi patří průmysl k sektorům s výraznějšími poklesy."
      }
    ]
  },
  "nejlepsi-realitni-etf": {
    "introTitle": "Realitní ETF (REITs): kotované realitní firmy v jednom fondu",
    "intro": [
      "Realitní ETF je akciový fond, který kupuje akcie kotovaných realitních společností, především REITs (Real Estate Investment Trusts). REIT vlastní a pronajímá nemovitosti a výměnou za daňové zvýhodnění musí rozdělit většinu zisku akcionářům. Realitní ETF tak drží podíl na nájemním cash flow stovek nemovitostí najednou – s denní kotací na burze, bez správy konkrétní nemovitosti.",
      "Standardní index kategorie, FTSE EPRA Nareit Developed, kombinuje rezidenční REITs, logistiku a průmyslové haly, datová centra a telekomunikační věže, nákupní centra, kanceláře, zdravotnická zařízení i samoobslužné sklady. Tyto podsektory se vyvíjejí různě: logistika a datová centra těží z e-commerce a AI, kanceláře a klasický retail čelí strukturálnímu tlaku (práce z domova, online nákupy).",
      "Nabídku tvoří převážně globální fondy na rozvinuté trhy, například HSBC FTSE EPRA NAREIT Developed (distribuční IE00B5L01S80, akumulační IE000G6GSP88), VanEck Global Real Estate (NL0009690239) nebo Amundi FTSE EPRA NAREIT Global (LU1437018838). Největší váhu v nich mají americké REITs, dále Japonsko, Austrálie, Velká Británie a kontinentální Evropa. „Realitní“ a „nemovitostní“ ETF jsou v češtině synonyma pro tytéž fondy."
    ],
    "verdict": [
      "Fondy se liší hlavně regionem (globální, nebo evropské), indexem (FTSE EPRA Nareit, Dow Jones Global Real Estate apod.) a třídou: distribuční vyplácí dividendy z nájmů, akumulační je reinvestuje. Evropské realitní fondy nemají dolarovou převahu, ale jsou koncentrovanější.",
      "Dále se liší poplatkem (TER) a velikostí; aktuální hodnoty jsou v tabulce výše, protože se v čase mění. Kromě klasických indexových fondů existují i pákové nebo úzce profilované produkty s výrazně vyšším rizikem."
    ],
    "forWhom": "Investoři je používají k doplnění akciového portfolia o realitní sektor a distribuční třídy i jako zdroj pravidelných dividend z nájmů. REITs jsou ale akcie: v krizích obvykle padají spolu s trhem a jsou citlivé na úrokové sazby.",
    "risks": [
      "Úrokové riziko: nemovitosti se financují dluhem a dividendy REITs konkurují dluhopisům, takže při růstu sazeb ceny REITs klesají. V roce 2022 ztratily globální realitní ETF přes 20 % (v USD) navzdory rostoucím nájmům.",
      "Kurzové riziko vůči koruně: globální indexy mají největší váhu v amerických REITs a podklad je hlavně v dolarech. Posílení koruny snižuje výnos v Kč; zajištění do EUR nebo USD riziko vůči koruně neodstraní.",
      "Podsektorová koncentrace: jde o jediné odvětví, jehož části se rozcházejí – kanceláře a klasický retail čelí strukturálnímu tlaku, logistika a datová centra rostou. Váhy podsektorů se mezi fondy liší.",
      "Zdanění dividend: REITs vyplácejí nadprůměrně vysoké dividendy. U distribučních tříd se v ČR daní vždy, časový test se týká jen zisku z prodeje podílu."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi realitním a nemovitostním ETF?",
        "a": "Žádný věcný. Jsou to dvě česká synonyma pro fondy investující do kotovaných REITs a realitních firem. Sledují stejné indexy (nejčastěji FTSE EPRA Nareit Developed nebo Dow Jones Global Real Estate) a obsahují stejné společnosti. Tato stránka se zaměřuje na strukturu REITs podle podsektorů; srovnání s koupí investičního bytu je na stránce nemovitostních ETF."
      },
      {
        "q": "Které realitní ETF jsou největší a nejlevnější pro českého investora?",
        "a": "Mezi velké globální fondy patří HSBC FTSE EPRA NAREIT Developed (IE00B5L01S80), VanEck Global Real Estate (NL0009690239) a Amundi FTSE EPRA NAREIT Global (LU1437018838). Velikosti fondů i poplatky se mění; aktuální hodnoty a pořadí jsou ve srovnávací tabulce výše."
      },
      {
        "q": "Proč REITs vyplácejí tak vysoké dividendy?",
        "a": "REIT si daňově zvýhodněný status udrží jen tehdy, když akcionářům rozdělí většinu zisku. Proto mají REITs a fondy z nich složené vyšší dividendový výnos než běžné akcie. U distribučních tříd to zároveň znamená vyšší průběžnou daňovou zátěž z vyplácených dividend."
      },
      {
        "q": "Mám zvolit akumulační, nebo distribuční realitní ETF?",
        "a": "Akumulační třída (např. Amundi FTSE EPRA NAREIT Global Acc, LU1437018838, nebo HSBC FTSE EPRA NAREIT Developed Acc, IE000G6GSP88) dividendy reinvestuje uvnitř fondu, takže je průběžně nedaníte. Distribuční třída (např. HSBC IE00B5L01S80 nebo VanEck NL0009690239) je vyplácí jako pravidelný příjem z nájmů a v ČR se daní 15 %."
      },
      {
        "q": "Jak se realitní ETF daní v Česku v roce 2026?",
        "a": "U zisku z prodeje podílu platí časový test: pokud fond držíte déle než 3 roky, je zisk osvobozen (od roku 2026 bez horního limitu), případně se uplatní hodnotový test do 100 000 Kč ročního úhrnu prodejů. Vyplacené dividendy z distribučních tříd jsou zdanitelný příjem vždy (15 %, se zápočtem zahraniční srážkové daně podle pravidel) – časový test se na ně nevztahuje. U akumulačních fondů se reinvestice uvnitř fondu v přiznání neřeší. Detaily najdete v našem daňovém rozcestníku."
      },
      {
        "q": "Proč realitní ETF klesaly, když nemovitosti v Česku i ve světě zdražovaly?",
        "a": "REITs reagují především na úrokové sazby, ne přímo na ceny bytů. Když centrální banky v roce 2022 prudce zvedly sazby, podražilo financování nemovitostí a dividendový výnos REITs přestal být atraktivní vůči vyšším výnosům dluhopisů. Globální realitní ETF tak v roce 2022 ztratily přes 20 % (v USD), přestože nájmy rostly. Kotované REITs jsou akcie citlivé na sazby, ne přímý ekvivalent fyzické nemovitosti."
      }
    ]
  },
  "nejlepsi-ropa-etf": {
    "introTitle": "Ropa přes ETC a ETF: cena barelu vs. akcie ropných firem",
    "intro": [
      "Pod „ropa ETF“ se skrývají dvě odlišné věci. ETC (Exchange Traded Commodities) sledují cenu ropy WTI nebo Brent: ropu fyzicky nedrží, ale drží futures kontrakty a pravidelně je rolují. Akciové ETF drží akcie ropných a plynárenských firem (ExxonMobil, Shell, TotalEnergies, Chevron); vyplácejí dividendy a cenu barelu nekopírují jedna k jedné.",
      "Liší se i právně: akciové energetické ETF jsou standardní UCITS fondy, ropné ETC jsou dluhové cenné papíry navázané na komoditní index, s odlišným daňovým režimem. Tato stránka se týká expozice na cenu ropy; akcie ropných firem jsou podrobněji v kategorii energetických ETF.",
      "Ropa se kotuje v dolarech, výnos v korunách proto ovlivňuje kurz USD/CZK, i když se ETC obchoduje v eurech. EUR-hedgované třídy (např. WisdomTree WTI Crude Oil – EUR Daily Hedged, JE00B44F1611) zajišťují jen vůči euru, ne vůči koruně."
    ],
    "verdict": [
      "Ropné ETC se liší hlavně benchmarkem (WTI, nebo Brent – např. WisdomTree WTI Crude Oil, GB00B15KXV33, a WisdomTree Brent Crude Oil, JE00B78CGV99) a konstrukcí: indexy typu CMCI (např. UBS CMCI Oil, CH0109967858) rozkládají futures do více splatností, což mění dopad rolování. Dále se liší poplatkem, velikostí a měnovým zajištěním. Všechny ETC na futures nesou vliv contanga.",
      "Akciová větev zahrnuje například iShares STOXX Europe 600 Oil & Gas (DE000A0H08M3), iShares S&P 500 Energy Sector (IE00B42NKQ00), iShares Oil & Gas Exploration & Production (IE00B6R51Z18) nebo VanEck Oil Services (IE000NXF88S1). Tyto fondy drží akcie firem, nemají roll riziko a podrobněji jsou v kategorii energetických ETF.",
      "Pákové a short ETC (např. WisdomTree WTI Crude Oil 3x Daily Short, XS2819844387) používají denní páku; při kolísání ceny se její efekt skládá a za delší dobu mohou ztratit většinu hodnoty. Aktuální poplatky, velikosti a výnosy jsou v tabulce výše."
    ],
    "forWhom": "Ropné ETC investoři používají k taktické, obvykle krátkodobější expozici na cenu barelu; drží futures, ne fyzickou ropu, a kvůli contangu mohou ztrácet hodnotu i při stagnující ceně. Pro dlouhodobou expozici na ropný sektor s dividendou se používají akciové energetické ETF.",
    "risks": [
      "Contango a roll riziko: při rolování futures ETC v contangu nakupuje dráž, než prodává, a může ztrácet i při stejné ceně barelu.",
      "Měnové riziko USD/CZK: ropa se kotuje v dolarech; EUR-hedgované třídy zajišťují jen vůči euru, ne vůči koruně.",
      "Extrémní volatilita a pákové produkty: cena ropy umí kolísat o desítky procent během týdnů (v dubnu 2020 se futures WTI dostaly do záporu); u pákových a short ETC se ztráty z denní páky násobí.",
      "Odlišná právní a daňová struktura: ropný ETC je dluhový cenný papír, ne fond; uplatnění časového a hodnotového testu se může posuzovat jinak než u akciových ETF."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi ropným ETF a ETF na akcie ropných firem?",
        "a": "Ropné ETC (např. WisdomTree WTI Crude Oil, GB00B15KXV33) sledují cenu barelu přes futures – nevyplácejí dividendy a ovlivňuje je contango při rolování. Akciové energetické ETF (např. iShares STOXX Europe 600 Oil & Gas, DE000A0H08M3) drží akcie firem jako Shell nebo ExxonMobil – vyplácejí dividendy a cenu barelu nekopírují jedna k jedné. Podrobnosti jsou v kategorii energetických ETF."
      },
      {
        "q": "Co znamená contango a proč u ropy záleží?",
        "a": "Contango je situace, kdy jsou futures s pozdější splatností dražší než ta blízká. Protože ropné ETC musí kontrakty pravidelně rolovat na další měsíc, v contangu nakupují dráž, než prodávají, a tento záporný roll yield ukrajuje z výnosu i tehdy, když cena barelu stojí na místě. Právě proto může ropný ETC dlouhodobě ztrácet, i když se ropa nehne."
      },
      {
        "q": "Které ropné ETF a ETC jsou pro Čecha dostupné a od kterého brokera?",
        "a": "Čistě ropná ETC jsou například WisdomTree WTI Crude Oil (GB00B15KXV33), WisdomTree Brent Crude Oil (JE00B78CGV99) a UBS CMCI Oil (CH0109967858). Z akciové větve iShares STOXX Europe 600 Oil & Gas (DE000A0H08M3) nebo iShares S&P 500 Energy Sector (IE00B42NKQ00). Obchodují se na evropských burzách, typicky na Xetře; dostupnost se liší podle brokera."
      },
      {
        "q": "Jak se v Česku daní zisk z ropného ETC?",
        "a": "Záleží na právní struktuře produktu. Ropné ETC jsou dluhové cenné papíry navázané na komoditu, ne fondy, takže časový test (držba nad 3 roky) ani hodnotový test (úhrn příjmů z prodeje do 100 000 Kč ročně) se na ně nemusí vztahovat stejně jako u akciových ETF. Konkrétní režim je třeba ověřit v daňovém přehledu nebo u daňového poradce."
      },
      {
        "q": "Vyplatí se pákové nebo short ropné ETC?",
        "a": "Pákové a short ETC (např. WisdomTree WTI Crude Oil 3x Daily Short, XS2819844387) používají denní páku. Při kolísání ceny se její efekt skládá, takže výsledek za delší období se může výrazně lišit od trojnásobku pohybu ropy a produkt může ztratit většinu hodnoty. Emitenti je konstruují pro krátkodobé obchodování."
      },
      {
        "q": "Chrání ropa v portfoliu proti inflaci?",
        "a": "Cena ropy bývá citlivá na inflaci a geopolitiku, takže krátkodobě se s inflací může pohybovat. Kvůli contangu, absenci výnosu (ropa nevyplácí dividendy ani úroky) a vysoké volatilitě je její vztah k inflaci v delším horizontu méně stabilní. Alternativami s jiným profilem jsou široké komoditní koše nebo akcie energetického sektoru."
      }
    ]
  },
  "nejlepsi-spotrebitelske-etf": {
    "introTitle": "Spotřebitelské ETF: dvě protikladné sázky pod jedním názvem",
    "intro": [
      "Pod hlavičkou „spotřebitelské ETF“ jsou dva sektory, které se chovají skoro opačně. Consumer Staples (základní spotřeba) jsou firmy jako Procter & Gamble, Nestlé, Coca-Cola nebo Walmart – jídlo, pití a drogerie, které lidé kupují i v krizi. Consumer Discretionary (cyklická spotřeba) jsou firmy, na jejichž zboží se šetří jako první: Amazon, LVMH, McDonald’s, Nike, Tesla. Fond vždy sleduje jeden z těchto dvou sektorů.",
      "Základní spotřeba je defenzivní sektor – v recesi obvykle klesá méně než trh, protože poptávka po jídle a hygieně je stabilní. Cyklická spotřeba je opak: v hospodářské expanzi bývá rychlejší než trh, v recesi klesá mezi prvními.",
      "Fondy existují v několika regionálních řezech – globální (MSCI World), americký (S&P 500, MSCI USA) a evropský (MSCI Europe). Discretionary indexy jsou silně koncentrované: velkou váhu v nich mají Amazon a Tesla. Fondy jsou vedené v USD nebo EUR, takže výnos v korunách ovlivňuje i kurz koruny."
    ],
    "verdict": [
      "Sektor: staples (základní spotřeba) a discretionary (cyklická spotřeba) se chovají velmi odlišně – sektor je uvedený v názvu fondu i indexu.",
      "Region: globální, americké a evropské fondy se liší složením – evropská základní spotřeba stojí hlavně na firmách jako Nestlé, L’Oréal a Unilever, americká na firmách jako Procter & Gamble, Walmart nebo Coca-Cola.",
      "Poplatek a velikost: americké sektorové fondy bývají levnější než globální. Menší fondy mívají širší rozpětí nákup/prodej. Aktuální poplatky a velikosti fondů jsou v tabulce výše.",
      "Třída: akumulační třída dividendy reinvestuje, distribuční je vyplácí (v ČR se daní 15 %)."
    ],
    "forWhom": "Investoři je používají k úpravě sektorových vah nad širokým fondem – staples kvůli nižšímu kolísání, discretionary jako sázku na růst spotřeby v expanzi. Oba sektory jsou v tržní váze obsažené i v běžném celosvětovém nebo S&P 500 fondu. Cyklická spotřeba umí v recesi klesnout o desítky procent.",
    "risks": [
      "Záměna sektorů: staples a discretionary se chovají opačně. Discretionary fond není defenzivní pozice; sektor je uvedený v názvu fondu.",
      "Koncentrace do několika firem: v discretionary indexech mají velkou váhu Amazon a Tesla, takže propad jedné z nich stáhne celý fond.",
      "Měnové riziko vůči koruně: fondy jsou v USD nebo EUR. Posílení koruny snižuje výnos v Kč i u firem, které samy rostou; zajištěné třídy, pokud existují, zajišťují do EUR nebo USD, ne do koruny.",
      "Jeden sektor a jeho cyklus: staples zaostávají v silných býčích trzích, discretionary tvrdě padají v recesích a při slabé spotřebě."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi Consumer Staples a Consumer Discretionary ETF?",
        "a": "Staples (základní spotřeba) jsou defenzivní firmy prodávající jídlo, pití a drogerii – Procter & Gamble, Nestlé, Coca-Cola, Walmart. Poptávka je stabilní i v krizi, takže fond kolísá méně než trh. Discretionary (cyklická spotřeba) jsou firmy jako Amazon, Tesla, LVMH, McDonald's nebo Nike, na jejichž zboží lidé šetří jako první – v expanzi rostou rychleji, v recesi padají nejvíc. Jsou to prakticky opačné sázky, přestože se obě řadí pod „spotřebitelské ETF“."
      },
      {
        "q": "Který konkrétní fond je pro defenzivní a který pro cyklickou sázku?",
        "a": "Příklady podle sektoru – základní spotřeba: Xtrackers MSCI World Consumer Staples (IE00BM67HN09), iShares S&P 500 Consumer Staples Sector (IE00B40B8R38), iShares MSCI Europe Consumer Staples Sector (IE00BMW42074); cyklická spotřeba: iShares S&P 500 Consumer Discretionary Sector (IE00B4MCHD36), Xtrackers MSCI World Consumer Discretionary (IE00BM67HP23). Aktuální poplatky a velikosti fondů jsou v tabulce výše."
      },
      {
        "q": "Jak se tyto ETF daní v roce 2026 pro českého investora?",
        "a": "Jde o akciové fondy (cenné papíry), takže platí standardní pravidla. Zisk z prodeje je v ČR osvobozen, pokud fond držíte déle než 3 roky (časový test), nebo pokud úhrn příjmů z prodeje cenných papírů za rok nepřesáhne 100 000 Kč (hodnotový test); od roku 2026 bez horního limitu. Jinak se zisk daní jako ostatní příjem. Dividendy z distribučních tříd (např. Xtrackers MSCI USA Consumer Discretionary 1D) se daní 15 %; u akumulačních fondů (např. XDWS, ESIS) se reinvestice uvnitř fondu v přiznání neřeší. Text není daňové poradenství."
      },
      {
        "q": "Mám raději akumulační, nebo distribuční variantu?",
        "a": "U spotřebitelských fondů existují obě třídy. Akumulační (např. XDWS, XDWC, ESIS) dividendy reinvestují uvnitř fondu, takže se průběžně nic nedaní. Distribuční (např. XUCD) vyplácejí dividendu na účet a ta se v ČR daní 15 %."
      },
      {
        "q": "Proč je discretionary ETF tak koncentrované do pár firem?",
        "a": "Cyklické spotřebitelské indexy jsou vážené tržní kapitalizací a v sektoru dominuje několik obřích firem – v globálních a amerických fondech hlavně Amazon a Tesla s velkou částí váhy. Sektorový fond je tak koncentrovaná pozice na hrstku velkých firem, na rozdíl od širokého indexu typu S&P 500 nebo MSCI World. Aktuální složení uvádí emitent fondu."
      },
      {
        "q": "Nese český investor u těchto fondů měnové riziko?",
        "a": "Ano. Globální a americké fondy jsou vedené v USD, evropské v EUR, a výnos v korunách se pohybuje s kurzem. Pokud koruna posílí, část zisku v přepočtu zmizí, i když firmy ve fondu rostou. Měnově zajištěné třídy, pokud existují, zajišťují do EUR nebo USD, ne do koruny."
      }
    ]
  },
  "nejlepsi-zlato-etf": {
    "introTitle": "Zlato přes burzu: jak fungují zlaté ETC",
    "intro": [
      "„Zlaté ETF“ jsou ve skutečnosti téměř vždy ETC (Exchange Traded Commodities) – burzovně obchodované cenné papíry kryté fyzickým zlatem uloženým v trezorech. Nejde o klasický UCITS fond, ale o dluhový cenný papír emitenta, jehož hodnota sleduje cenu zlata. Zlato nevyplácí dividendy ani úroky, veškerý výnos plyne jen z pohybu ceny kovu.",
      "Cena zlata se stanovuje v amerických dolarech. I když se ETC kupuje v eurech, výnos v korunách ovlivní i kurz dolaru vůči koruně. Měnově zajištěné třídy (v tabulce označené „zajištěno“) tlumí pohyb dolaru vůči euru, libře nebo franku – ne vůči koruně.",
      "Produkty se stejným podkladem (fyzické zlato) se liší hlavně poplatkem, velikostí, emitentem a místem uložení kovu. Rozdíly ve výnosu mezi nezajištěnými třídami jsou proto malé – tabulka výše ukazuje, jak velké doopravdy jsou."
    ],
    "verdict": [
      "Poplatek, velikost a měna třídy: u některých produktů (např. Xetra-Gold, EUWAX Gold) se náklady neúčtují jako klasický TER – údaj 0 % proto nemusí znamenat, že držení nic nestojí; podrobnosti uvádí emitent v dokumentech produktu.",
      "Typ výplaty: zlato nemá akumulační ani distribuční variantu v pravém smyslu, protože nic nevyplácí. Typ výplaty v tabulce je jen formální údaj o produktu."
    ],
    "forWhom": "Investoři zlato používají jako doplněk portfolia – aktivum, které se často chová jinak než akcie a dluhopisy. Nepřináší průběžný příjem a jeho cena umí roky stagnovat nebo klesat, proto ho investoři obvykle drží jako menšinovou část vedle akciového jádra.",
    "risks": [
      "Kolísání ceny bez průběžného výnosu: cena zlata může dlouhá období stagnovat nebo klesat a zlato nevyplácí dividendy ani úroky.",
      "Měnové riziko: zlato se obchoduje v USD, výnos v korunách ovlivní kurz USD/CZK. Zajištěné třídy zajišťují do EUR, GBP nebo CHF, ne do koruny.",
      "Struktura ETC: jde o dluhový cenný papír emitenta krytý kovem, který se liší od UCITS fondu (například ochranou majetku fondu). Podrobnosti uvádí prospekt emitenta."
    ],
    "faqs": [
      {
        "q": "Je zlaté ETC totéž co ETF?",
        "a": "Ne úplně. ETC je dluhový cenný papír krytý fyzickým zlatem, obchoduje se na burze stejně jako ETF. Na rozdíl od UCITS fondu nesleduje koš cenných papírů, ale cenu jedné komodity."
      },
      {
        "q": "Jak se v Česku daní zisk ze zlatého ETC?",
        "a": "Zlaté ETC je dluhový cenný papír (ne podíl ve fondu). Zákon o daních z příjmů osvobozuje příjem z prodeje cenného papíru po více než 3 letech držby (časový test) a příjmy z prodeje cenných papírů do 100 000 Kč za rok (hodnotový test) – podle běžného výkladu tedy i u ETC a ETP. Nejde o daňové poradenství; u konkrétního produktu si to ověřte u daňového poradce."
      },
      {
        "q": "Proč se výnosy různých zlatých ETC liší?",
        "a": "U nezajištěných tříd hlavně kvůli poplatku a drobným rozdílům v ocenění. Velké rozdíly mají měnově zajištěné třídy – jejich výnos v korunách závisí na tom, do které měny jsou zajištěné."
      },
      {
        "q": "Proč je u některých produktů poplatek 0 %?",
        "a": "Některé produkty (např. Xetra-Gold) nemají klasický TER a náklady účtují jinak. Údaj 0 % v tabulce neznamená, že držení nic nestojí – co přesně držení stojí, uvádí emitent."
      }
    ]
  },
  "nejlepsi-stribro-etf": {
    "introTitle": "Stříbro ETC: fyzicky kryté stříbro obchodované na burze",
    "intro": [
      "Podobně jako u zlata nejsou „stříbrné ETF“ téměř nikdy fondy, ale ETC (Exchange Traded Commodities) – burzovně obchodované cenné papíry kryté fyzickým kovem v trezorech depozitářů. Investor tak drží nárok na stříbro, ale obchoduje ho přes brokera jako akcii, bez vlastní úschovy a pojištění.",
      "Stříbro je z velké části průmyslová komodita – poptávku táhne fotovoltaika, elektronika a elektromobilita, nejen investice a šperky. Jeho cena je proto výrazně kolísavější než cena zlata: v dobrých letech roste rychleji, v korekcích padá hlouběji. Poměr cen zlata a stříbra (Gold/Silver Ratio) kolísá v širokém pásmu a slouží jako orientační srovnání obou kovů.",
      "Stříbro se kotuje v amerických dolarech, takže výnos v korunách vždy ovlivňuje kurz USD/CZK, i když se ETC obchoduje v eurech. Existují i třídy zajištěné do eura (např. Xtrackers Physical Silver EUR Hedged, DE000A1EK0J7), které tlumí pohyb dolaru vůči euru, ne vůči koruně.",
      "Mezi velké fyzicky kryté produkty patří iShares Physical Silver ETC (IE00B4NCWG09), WisdomTree Physical Silver (JE00B1VS3333), Invesco Physical Silver (IE00B43VDT70) a WisdomTree Core Physical Silver (JE00BQRFDY49). Aktuální poplatky a velikosti jsou v tabulce výše."
    ],
    "verdict": [
      "Produkty se liší strukturou: plně alokovaná fyzická ETC drží kov přiřazený ke konkrétním slitkům, syntetické produkty jen derivátovou expozici a pákové či short produkty denně násobí pohyb ceny. Mezi fyzicky krytými ETC rozhoduje hlavně poplatek (TER), velikost a likvidita; aktuální hodnoty jsou v tabulce výše.",
      "Stříbro nevyplácí dividendy ani úroky, výnos plyne jen z pohybu ceny, takže rozlišení akumulační/distribuční tu odpadá. Třídy zajištěné do eura mají vyšší náklady a riziko vůči koruně neodstraňují. Pákové produkty se přepočítávají denně, a při kolísavém trhu se proto jejich hodnota v čase rozpadá nezávisle na směru ceny kovu."
    ],
    "forWhom": "Investoři je používají k doplnění portfolia o drahý kov s průmyslovou poptávkou, obvykle jako menší pozici vedle zlata nebo akcií. Stříbro nic nevyplácí, je výrazně kolísavější než zlato a jeho cena může i řadu let stagnovat nebo prudce klesat.",
    "risks": [
      "Vysoká volatilita: kvůli velké průmyslové složce poptávky je stříbro kolísavější než zlato a v korekcích padá hlouběji a rychleji.",
      "Měnové riziko: stříbro se kotuje v USD, takže i při růstu ceny kovu můžete v korunách vydělat méně nebo prodělat. Třídy zajištěné do eura řeší jen kurz USD/EUR, ne pohyb koruny.",
      "Struktura produktu: ETC je dluhový cenný papír krytý kovem, ne fond UCITS. Pákové (např. 3SIL, LSIL) a short produkty (SSIL, 3SSI) se kvůli dennímu přepočtu chovají při delším držení jinak než cena stříbra.",
      "Daňový režim: ETC je dluhový cenný papír krytý komoditou, ne podíl ve fondu. Osvobození pro cenné papíry (časový a hodnotový test) se na něj podle běžného výkladu vztahuje stejně jako u zlatých ETC a bitcoinových ETP; u konkrétního produktu ověřte u daňového poradce."
    ],
    "faqs": [
      {
        "q": "Je stříbrné ETF vlastně ETF, nebo ETC?",
        "a": "Téměř vždy jde technicky o ETC (Exchange Traded Commodity), nikoli o klasický fondový ETF. ETC je dluhový cenný papír krytý fyzickým stříbrem v trezoru. Obchoduje se stejně snadno jako akcie či ETF přes burzu, liší se ale právní strukturou (riziko emitenta)."
      },
      {
        "q": "Proč zvolit stříbro místo zlata, nebo vedle něj?",
        "a": "Stříbro má velkou průmyslovou poptávku (fotovoltaika, elektronika, elektromobilita), a proto výrazně vyšší kolísavost – v dobrých letech roste rychleji, v korekcích padá hlouběji než zlato. Část investorů drží oba kovy: zlato jako klidnější složku, stříbro jako menší a dynamičtější pozici. Vzájemné ocenění obou kovů ukazuje Gold/Silver Ratio. Podrobněji viz kategorie zlaté ETF."
      },
      {
        "q": "Které stříbrné ETC jsou nejlevnější a nejdostupnější v Česku?",
        "a": "Mezi velké fyzicky kryté produkty patří Invesco Physical Silver (IE00B43VDT70), WisdomTree Core Physical Silver (JE00BQRFDY49), iShares Physical Silver ETC (IE00B4NCWG09) a WisdomTree Physical Silver (JE00B1VS3333). Poplatky a velikosti se mění; aktuální pořadí je v tabulce výše."
      },
      {
        "q": "Mám volit stříbrné ETC zajištěné do eura?",
        "a": "Měnově zajištěná třída (například Xtrackers Physical Silver EUR Hedged, DE000A1EK0J7) tlumí pohyb kurzu USD/EUR, má ale vyšší náklady a vůči koruně nezajišťuje. Cena zajištění závisí na rozdílu úrokových sazeb mezi měnami. Nezajištěné třídy jsou levnější, ale výnos v korunách u nich víc kolísá s dolarem."
      },
      {
        "q": "Jsou pákové stříbrné produkty jako WisdomTree 3x vhodné k držení?",
        "a": "Pákové (3SIL, LSIL) a short (SSIL, 3SSI) produkty se přepočítávají denně, takže při kolísavém trhu se jejich hodnota v čase rozpadá bez ohledu na směr ceny kovu. Při delším držení se proto jejich výsledek může výrazně lišit od trojnásobku pohybu stříbra. Jsou konstruované pro krátkodobé obchodování."
      },
      {
        "q": "Jak se v Česku daní zisk ze stříbrného ETC?",
        "a": "Stříbrné ETC je dluhový cenný papír krytý kovem (ne podíl ve fondu). Zákon o daních z příjmů osvobozuje příjem z prodeje cenného papíru po více než 3 letech držby (časový test) a příjmy z prodeje cenných papírů do 100 000 Kč za rok (hodnotový test) – podle běžného výkladu tedy i u ETC a ETP. Nejde o daňové poradenství; u konkrétního produktu si to ověřte u daňového poradce."
      }
    ]
  },
  "nejlepsi-vladni-dluhopisy-etf": {
    "introTitle": "Vládní dluhopisové ETF: durace, měna a kreditní riziko",
    "intro": [
      "Vládní dluhopisové ETF drží dluhopisy vydané státy – například americké Treasuries, německé Bundy nebo koš států eurozóny. Kreditní riziko je u velkých vyspělých států nízké. Hlavními riziky jsou úroková citlivost (durace) a měna.",
      "Durace vyjadřuje citlivost ceny na změnu úrokových sazeb. Když sazby rostou, cena dříve vydaných dluhopisů klesá, a čím delší splatnost, tím víc. Fondy s krátkými splatnostmi (např. iShares USD Treasury Bond 0-1yr, IE00BGSF1X88) proto kolísají málo, fondy s dlouhými (např. iShares USD Treasury Bond 20+yr, IE00BFM6TC58) výrazně víc.",
      "Kategorie tak sahá od fondů blízkých hotovosti po fondy citlivé na sazby. Většina velkých fondů je v USD nebo EUR; výnos v korunách ovlivňuje kurz koruny. Třídy „Hedged“ zajišťují nejvýš do EUR nebo USD, ne do koruny."
    ],
    "verdict": [
      "Fondy se liší hlavně splatností (durací), měnou a emitentem (USA, eurozóna, jednotlivé státy), poplatkem (TER), velikostí a třídou: akumulační kupóny reinvestuje, distribuční je vyplácí. U krátkých dolarových fondů výsledek v korunách určuje hlavně kurz USD/CZK, u dlouhých i pohyb sazeb.",
      "Příklady podle splatnosti: krátké americké (iShares USD Treasury Bond 0-1yr, IE00BGSF1X88; iShares USD Treasury Bond 1-3yr, IE00BYXPSP02; Vanguard U.S. Treasury 0-1 Year Bond, IE00BLRPPV00), eurozóna napříč splatnostmi (Vanguard EUR Eurozone Government Bond, IE00BH04GL39; iShares Core Euro Government Bond, IE00B4WXJJ64), krátká eurozóna (Xtrackers Eurozone Government Bond 1-3, LU0290356871; Amundi Euro Government Bond 1-3Y, LU1650487413) a delší americké (iShares USD Treasury Bond 3-7yr, IE00B3VWN393; 20+yr, IE00BFM6TC58).",
      "Měnově zajištěné třídy (např. iShares $ Treasury Bond 7-10yr EUR Hedged, IE00BGPP6697) odstraňují riziko USD/EUR, ne EUR/CZK. Aktuální poplatky, velikosti a výnosy jsou v tabulce výše."
    ],
    "forWhom": "Investoři je používají jako stabilizační, méně kolísavou složku vedle akcií, k parkování peněz v cizí měně (krátké splatnosti) nebo při snižování podílu akcií. Dlouhé splatnosti mohou při růstu sazeb klesat i roky, jak ukázal rok 2022.",
    "risks": [
      "Úrokové (durační) riziko: při růstu sazeb ceny dluhopisů klesají, u dlouhých splatností (např. 20+ let) i o desítky procent.",
      "Měnové riziko vůči koruně: většina fondů je v USD nebo EUR; u krátkých dolarových fondů bývá kurz hlavním zdrojem kolísání v korunách.",
      "Třídy „Hedged“ nezajišťují korunu: EUR či USD Hedged zajišťuje jen do eura nebo dolaru a náklady zajištění závisí na úrokovém rozdílu mezi měnami.",
      "Nižší dlouhodobý výnos než akcie: státní dluhopisy historicky vynášely méně než akcie a v období růstu sazeb (2022) i nominálně ztrácely."
    ],
    "faqs": [
      {
        "q": "Jaký je rozdíl mezi vládními a korporátními dluhopisovými ETF?",
        "a": "Vládní fondy drží dluhopisy států s nízkým rizikem nesplácení – hlavní riziko je úrokové a měnové. Korporátní fondy drží firemní dluhopisy, kde navíc nesete kreditní riziko, za které dostáváte kreditní přirážku (spread). High-yield fondy drží dluhopisy s nejnižším ratingem a nejvyšším kreditním rizikem."
      },
      {
        "q": "Mám koupit krátké, nebo dlouhé státní dluhopisy?",
        "a": "Krátké splatnosti (0–3 roky, např. iShares USD Treasury Bond 0-1yr, IE00BGSF1X88) mají nízkou úrokovou citlivost a cena jim kolísá málo. Dlouhé (10+ let, např. iShares USD Treasury Bond 20+yr, IE00BFM6TC58) reagují na změny sazeb silně: při poklesu sazeb rostou, při růstu klesají. Rozdíl mezi nimi je hlavně v míře úrokového rizika."
      },
      {
        "q": "Zbaví mě hedgovaný (zajištěný) fond měnového rizika vůči koruně?",
        "a": "Ne. Třídy EUR Hedged nebo USD Hedged zajišťují jen do eura nebo dolaru, ne do koruny. Při nákupu za koruny nesete kurzové riziko vůči koruně vždy a zajištěné třídy navíc nesou náklady zajištění podle úrokového rozdílu mezi měnami. Mezi fondy v našem srovnání nejsou třídy zajištěné do koruny."
      },
      {
        "q": "Jak se daní zisk z vládních dluhopisových ETF v Česku (2026)?",
        "a": "Státní dluhopisové ETF jsou cenné papíry-fondy, platí pro ně standardní pravidla. Časový test: při držení nad 3 roky je zisk z prodeje osvobozen (od 2026 bez horního limitu). Hodnotový test: úhrn prodejů do 100 000 Kč ročně je osvobozen. U distribučních tříd (např. iShares Core Euro Government Bond IE00B4WXJJ64) se vyplácené kupony daní jako příjem sazbou 15 %; u akumulačních tříd se reinvestice uvnitř fondu v přiznání neřeší. Podrobnosti vždy ověřte v daňovém hubu."
      },
      {
        "q": "Akumulační, nebo distribuční varianta státního dluhopisového ETF?",
        "a": "Akumulační třída (např. Vanguard EUR Eurozone Government Bond, IE00BH04GL39) kupóny reinvestuje uvnitř fondu a během držení se nedaní. Distribuční třída (např. iShares Core Euro Government Bond, IE00B4WXJJ64) kupóny vyplácí na účet a vyplacené výnosy se v ČR daní 15 %."
      },
      {
        "q": "Proč byly některé státní dluhopisové fondy za poslední rok v mínusu, když jde o 'bezpečné' aktivum?",
        "a": "Bezpečnost státních dluhopisů se týká kreditního rizika (stát dluh s vysokou pravděpodobností splatí), ne kolísání ceny. Cena fondu se mění s úrokovými sazbami a výnos v korunách navíc s kurzem měny. Fondy s delší durací a v jiné měně proto mohou být za rok v minusu, i když dlužník splácí. Aktuální výnosy v Kč jsou v tabulce výše."
      }
    ]
  }
};

/* Jedna věta pod nadpis žebříčku: CO kategorie je (revize kola 2: „Co je S&P 500“ bylo hluboko dole
   ve sbaleném bloku). Jen fakta; počty složek indexů ověřené proti factsheetům poskytovatelů. */
export const categoryLead: Record<string, string> = {
  'nejlepsi-sp500-etf': 'Index zhruba 500 největších firem v USA, vážených tržní hodnotou – pokrývá kolem 80 % hodnoty amerického akciového trhu.',
  'nejlepsi-celosvetove-etf': 'Akcie vyspělých i rozvíjejících se trhů v jednom fondu – indexy FTSE All-World, MSCI ACWI a jejich širší varianty s malými firmami.',
  'nejlepsi-msci-world-etf': 'Velké a střední firmy z 23 vyspělých zemí (asi 85 % jejich tržní hodnoty). Rozvíjející se trhy jako Čína nebo Indie v indexu nejsou.',
  'nejlepsi-nasdaq-etf': '100 největších nefinančních firem z americké burzy Nasdaq, s velkou vahou technologií.',
  'nejlepsi-dluhopisove-etf': 'Fondy, které drží stovky až tisíce dluhopisů států a firem. Výnos tvoří hlavně úroky, cena kolísá se sazbami.',
  'nejlepsi-zlato-etf': 'Zlaté „ETF“ jsou téměř vždy ETC – cenné papíry kryté fyzickým zlatem v trezoru, jejichž hodnota sleduje cenu zlata.',
  'nejlepsi-stribro-etf': 'Stříbrné „ETF“ jsou téměř vždy ETC – cenné papíry kryté fyzickým stříbrem v trezoru, jejichž hodnota sleduje cenu stříbra.',
  'nejlepsi-emerging-markets-etf': 'Akcie z rozvíjejících se zemí – největší váhu mají Čína, Tchaj-wan, Indie a Jižní Korea.',
  'nejlepsi-evropske-etf': 'Akcie evropských firem – široké indexy (MSCI Europe, STOXX Europe 600), eurozóna (EURO STOXX 50) i jednotlivé země.',
  'nejlepsi-dax-etf': '40 největších německých firem z frankfurtské burzy.',
  'nejlepsi-stoxx600-etf': '600 velkých, středních i malých firem ze 17 evropských zemí včetně Británie a Švýcarska.',
  'nejlepsi-ftse100-etf': '100 největších firem z londýnské burzy.',
  'nejlepsi-americke-etf': 'Akcie amerických firem – S&P 500, MSCI USA a další americké indexy.',
  'nejlepsi-bitcoin-etf': 'Burzovně obchodované produkty (ETP/ETN) sledující cenu bitcoinu – v Evropě nejde o klasické UCITS fondy.',
  // Kolo 6 (20. 10. 2026): obecné „Top … ETF fondy“ nahrazeny konkrétním popisem. Jen fakta, bez doporučení.
  'nejlepsi-dividendove-etf': 'Akciové fondy, které vybírají firmy s vyšší dividendou a vyplácejí ji (distribuční třídy). Výše výplat se mění – dividenda není zaručená. Opční strategie („Premium Income“) sem nepočítáme.',
  'nejlepsi-realitni-etf': 'Akcie realitních firem a REITs (nájemní byty, kanceláře, sklady) – ne přímo nemovitosti. Ceny kolísají jako akcie a citlivě reagují na sazby.',
  'nejlepsi-vladni-dluhopisy-etf': 'Dluhopisy států – USA, eurozóny, Británie, Japonska i rozvíjejících se zemí. Čím delší splatnost, tím víc cena reaguje na změnu sazeb.',
  'nejlepsi-energeticke-etf': 'Tradiční energetický sektor – firmy kolem ropy a zemního plynu. Čistá energie má vlastní žebříček obnovitelných zdrojů.',
  'nejlepsi-financni-etf': 'Akcie bank, pojišťoven a dalších finančních firem – celý sektor v USA, Evropě nebo ve světě, případně jen banky či jen pojišťovny.',
  // SEO audit 6b (21. 10. 2026): úvody pro nejnavštěvovanější žebříčky bez vlastního popisu (GA4/Bing). Jen fakta, bez doporučení.
  'nejlepsi-etf-2026': 'Největší ETF fondy dostupné z Česka napříč akciemi, dluhopisy, komoditami i peněžním trhem, seřazené podle spravovaného majetku. Velikost říká, kolik peněz fond spravuje – ne jak si povede.',
  'nejlevnejsi-etf': 'Fondy s nejnižším ročním poplatkem za správu (TER) napříč všemi kategoriemi. Fondy s TER 0 % vynecháváme – u akcií a dluhopisů jde o chybu zdroje, u fyzického zlata se náklady platí jinak.',
  'nejlepsi-akciove-etf': 'Všechny akciové fondy nad prahem velikosti: široké světové a regionální indexy, jednotlivé země, sektory i tematické fondy. Pákové a inverzní produkty nezahrnujeme.',
  'nejlepsi-komoditni-etf': 'Produkty na zlato, stříbro, ropu, zemědělské komodity a koše komodit. Většinou jde o ETC/ETN (dluhopisové cenné papíry) – výnos nevyplácejí a ceny kolísají víc než u akcií.',
  'nejlepsi-technologicke-etf': 'Akcie technologických firem – software, polovodiče, internetové služby a hardware – v USA i ve světě. Několik největších firem v nich mívá velkou váhu.',
  'nejlepsi-obnovitelne-zdroje-etf': 'Firmy z čisté energie: výrobci solárních a větrných zařízení, provozovatelé obnovitelných zdrojů, baterie a vodík. Tradiční ropné a plynárenské firmy mají vlastní žebříček energetiky.',
  'nejlepsi-esg-etf': 'Fondy s výběrem firem podle kritérií ESG (životní prostředí, společnost, řízení firmy) – vyřazují vybraná odvětví nebo upřednostňují firmy s lepším hodnocením. Každý index má vlastní pravidla.',
  'nejlepsi-akumulacni-etf': 'Fondy, které dividendy a úroky nevyplácejí, ale znovu investují uvnitř fondu. Výnos se projeví v ceně podílu – na účet nic nepřichází.',
  'nejlepsi-distribucni-etf': 'Fondy, které dividendy nebo úroky pravidelně vyplácejí na účet (čtvrtletně, pololetně nebo ročně). Vyplacené dividendy se v Česku daní.',
  'nejlepsi-korporatni-dluhopisy-etf': 'Dluhopisy firem s investičním ratingem v eurech, dolarech i dalších měnách. Proti státním dluhopisům nesou vyšší úrok za vyšší kreditní riziko.',
  'nejlepsi-high-yield-etf': 'Dluhopisy firem s ratingem pod investičním stupněm. Platí vyšší úrok, ale riziko nesplacení je vyšší a ceny v krizích padají víc než u kvalitních dluhopisů.',
  'nejlepsi-japonske-etf': 'Akcie japonských firem – indexy MSCI Japan, TOPIX nebo Nikkei 225, v jenové i měnově zajištěné variantě.',
  'nejlepsi-cinske-etf': 'Akcie čínských firem obchodované v Hongkongu, v USA i na pevninských burzách (A-akcie). Indexy se liší tím, které z nich obsahují.',
  'nejlepsi-indicke-etf': 'Akcie indických firem – indexy MSCI India a Nifty 50. Výnos v korunách ovlivňuje i kurz indické rupie.',
  'nejlepsi-asijsko-pacificke-etf': 'Akcie z Asie a Pacifiku – vyspělé trhy (Austrálie, Hongkong, Singapur, často bez Japonska) i rozvíjející se asijské země, podle indexu.',
  'nejlepsi-small-cap-etf': 'Akcie menších firem (small cap) z USA, Evropy nebo celého světa. Kolísají víc než velké firmy a v indexech mají tisíce titulů.',
  'nejlepsi-value-etf': 'Akcie firem, které jsou levné vzhledem ke svým ziskům a majetku (hodnotové, value). Výběr dělá index podle ukazatelů jako P/E nebo P/B.',
  'nejlepsi-growth-etf': 'Akcie firem s rychlým růstem tržeb a zisků (růstové, growth), často technologických. Bývají dražší vzhledem k ziskům než trh.',
  'nejlepsi-healthcare-etf': 'Akcie firem ze zdravotnictví – farmacie, zdravotnické prostředky, pojišťovny a služby – v USA, Evropě i ve světě.',
  'nejlepsi-ai-etf': 'Tematické fondy na umělou inteligenci – firmy vyvíjející software, čipy a datová centra. Každý fond si téma vymezuje jinak, složení se proto liší.',
  'nejlepsi-defense-etf': 'Akcie zbrojních a leteckých firem z USA a Evropy. Tematické fondy se liší tím, zda zahrnují i civilní letectví a kybernetickou bezpečnost.',
  'nejlepsi-ropa-etf': 'ETC sledující cenu ropy přes futures kontrakty (Brent, WTI). Výnos se liší od spotové ceny ropy kvůli přechodu mezi kontrakty (rolování).',
};

export function getCategoryContent(slug: string): CategoryContent | null {
  return categoryContent[slug] ?? null;
}
