/* Redakční obsah k modelovým portfoliím – úvod, princip, silné/slabé stránky.
 * Popisuje SKUTEČNÉ složení z portfolioData (ne učebnicovou verzi). Klíč = slug.
 *
 * ČÍSLA JEN Z DAT (pravidlo č. 1, revize 19. 10. 2026): místo čísel bez zdroje („klidně o 45 %“, „−40 % i víc“)
 * zástupné značky, které detail doplní z backtestu stránky (stejná data a období jako tabulka historie):
 *   {maxPokles} největší propad portfolia, {obdobiPropadu} „vrchol 10/2007 → dno 3/2009“, {navrat} „návrat na vrchol za ~4 roky od dna“,
 *   {od} začátek dat („6/2008“), {maxPoklesAkcie} propad 100 % akcií světa (VT) ve stejném období, {rok2022} výnos 2022,
 *   {maxPoklesAbs} propad bez znaménka (do „spadlo až o …“ – kolo 8: dřív dvojí zápor „o −33,3 %“),
 *   {cagr} roční zhodnocení portfolia, {cagrAkcie} VT, {cagrJadro} portfolio bez satelitu (srovnaniJadro v PORTFOLIO_BACKTEST).
 * Chybí-li data, doplní se „—“ (raději žádné číslo než špatné).
 */

export interface PortfolioContent {
  /** Úvod – co to je, odkud myšlenka pochází, hlavní princip (1–2 odstavce). */
  intro: string[];
  /** Jak funguje – mechanika strategie. */
  howItWorks: string;
  /** Kdy strategie září. */
  strengths: string;
  /** Slabina / kdy zaostává. */
  weakness: string;
}

export const portfolioContent: Record<string, PortfolioContent> = {
  'portfolio-60-40': {
    intro: [
      'Portfolio 60/40 je nejznámější vyvážené portfolio: 60 % peněz v akciích, 40 % v dluhopisech. Desítky let slouží jako měřítko pro smíšené a penzijní fondy – když se mluví o „vyváženém portfoliu“, obvykle se myslí právě tento poměr.',
      'Tady ho skládáte ze dvou fondů: akcie celého světa (Vanguard FTSE All-World) a státní dluhopisy zemí eurozóny v eurech (Xtrackers II Eurozone Government Bond). Historie níže je počítaná z dat právě tohoto dluhopisového fondu.',
    ],
    howItWorks: 'Akcie nesou dlouhodobý růst, dluhopisy tlumí výkyvy. Jednou ročně vrátíte poměr na 60/40 (vyvážení) – prodáte část toho, co narostlo, a dokoupíte to, co zaostalo. Po propadu akcií tak dokupujete akcie levněji.',
    strengths: 'Jednoduchost: dva fondy a jedno vyvážení ročně. A mírnější propady než u čistých akcií: největší propad v datech od {od} byl {maxPokles} ({obdobiPropadu}), u 100 % akcií celého světa ve stejném období {maxPoklesAkcie}.',
    weakness: 'Když akcie i dluhopisy padají současně – jako v roce 2022, kdy rychle rostly úrokové sazby – dluhopisy propad netlumí: portfolio skončilo rok 2022 na {rok2022} (v Kč). Za klidnější průběh navíc platíte nižším dlouhodobým výnosem než u čistě akciového portfolia.',
  },
  'globalni-jadro-small-cap-value': {
    /* Kolo 8 (22. 10. 2026): přepsáno. Dřív „jak bychom sami stavěli … kdyby šlo o vlastní peníze“ (blízko doporučení),
       čísla bez zdroje (~20 bp, QUAL −0,4 %, DFSVX ~11,4 %, „44 let živé historie“ × DFSVX od 1993) a náskok proti VT
       mlčky připsaný malým firmám. Nezávislý přepočet (Yahoo adj. close × kurzy ČNB, 26. 6. 2008 → 21. 10. 2026):
       celé portfolio 11,85 %, jádro bez satelitu 11,90 %, VT 10,87 % ročně – náskok dělá váha USA, ne malé firmy.
       Čísla v textu doplňuje stránka z backtestu ({cagr}, {cagrJadro}, {cagrAkcie}). */
    intro: [
      'Svět + malé firmy je vzorové čistě akciové portfolio pro pokročilé. Ukazuje jeden konkrétní přístup: levné světové jádro a k němu jediný doplněk – malé hodnotové firmy. Není to investiční doporučení, ale odůvodněný příklad; zda se vám hodí, posuďte sami.',
      'Jádro (85 %) netvoří jeden celosvětový fond, ale tři běžné indexové fondy vážené tržní hodnotou firem: S&P 500 se syntetickou replikací (fond drží na index swap, takže ho nezatěžuje americká srážková daň z dividend – úspora je malá, řádově desetiny procenta ročně), vyspělé trhy mimo USA (MSCI World ex USA) a rozvíjející se trhy (MSCI EM IMI). Poměr 54/22/9 zhruba odpovídá dnešním vahám celosvětového indexu (ve FTSE All-World k 30. 9. 2026 USA 62,3 %, rozvíjející se trhy 10,0 %), je ale pevný – když se váhy trhu změní, portfolio je samo nesleduje.',
      'Proč jen jeden faktor: hodnota (value), kvalita (quality), momentum i velikost (size) mají v akademických datech prémii, po poplatcích fondů je ale skutečný přínos menší a v čase kolísá. Fondy na tyto faktory pro evropské investory existují (přehled je v sekci faktorových ETF). Tohle portfolio sází jen na malé hodnotové firmy, kde mají fondy se stejným zaměřením dlouhou živou historii – například americký DFA U.S. Small Cap Value (DFSVX) od března 1993.',
      'Satelit (15 %) je Avantis Global Small Cap Value. Není to čistý indexový fond: vybírá malé firmy, které jsou levné vůči účetní hodnotě a zároveň ziskové, a vyřazuje malé neziskové firmy s agresivními investicemi. Obchoduje průběžně, ne jen při pololetní změně indexu, kdy ostatní obchodníci ceny předem posouvají. Za to má vyšší poplatek než běžný indexový fond. Malé hodnotové firmy mohou za trhem zaostávat i deset let – satelit dává smysl jen tomu, kdo ho vydrží držet.',
      'Co ukazuje historie: od {od} vydělalo celé portfolio v korunách {cagr} ročně, celosvětový fond VT {cagrAkcie}. Náskok ale nedělají malé firmy – samotné jádro bez satelitu by vydělalo {cagrJadro}. Rozdíl proti VT jde hlavně na vrub pevné vyšší váhy USA (S&P 500 tvoří 64 % jádra) v období, kdy americké akcie vedly. Satelit navíc historie počítá přes americké malé firmy (Russell 2000), ne přes globální malé hodnotové firmy.',
    ],
    howItWorks: 'Jednou ročně vyvážíte zpět na 54/22/9/15. Jádro (85 %) přebírá tržní výnos co nejlevněji; satelit malých hodnotových firem (15 %) se drží dlouhodobě a neprodává se podle nálady – ani v letech, kdy za trhem zaostává.',
    strengths: 'Levné světové jádro s menší daňovou ztrátou z amerických dividend a jediný doplněk, u kterého otevřeně říkáme, že jde o dlouhodobou sázku se skromným očekáváním, ne o zaručený vyšší výnos.',
    weakness: 'Je to 100% akciové portfolio – v datech od {od} spadlo až o {maxPoklesAbs} ({obdobiPropadu}, {navrat}). Malé hodnotové firmy mohou zaostávat i celou dekádu a vyžadují pevné nervy. A oproti jednomu celosvětovému fondu je portfolio náročnější na správu: čtyři fondy a pravidelné vyvažování na cílové podíly.',
  },
  'permanentni-portfolio': {
    intro: [
      'Permanentní portfolio vychází z myšlenky Harryho Browna z 80. let: rozložit majetek rovným dílem mezi aktiva, z nichž každé se daří v jiné fázi ekonomiky. Když jedna část klesá, jiná zpravidla roste, a celek tak zůstává klidný bez ohledu na to, co dělá trh.',
      'Drží čtyři rovnoměrné čtvrtiny přesně podle Browna: světové akcie (růst v dobách prosperity), dlouhé státní dluhopisy (opora při recesi a deflaci), zlato (ochrana při inflaci a krizích důvěry) a hotovost v podobě krátkých státních dluhopisů (klid a rezerva na nákupy během propadů). Žádná složka nepřesahuje 25 %, takže portfolio nestojí a nepadá s jediným trhem.',
      'Pozor na měnu: „hotovost“ i dlouhé dluhopisy jsou tu americké státní dluhopisy v dolarech. Pro českého investora proto hotovost není korunová jistota – v korunách kolísá s kurzem USD/CZK a polovina portfolia (dluhopisy) nese měnové riziko dolaru.',
    ],
    howItWorks: 'Jednou ročně portfolio vyvážíte zpět na 25/25/25/25 – prodáte část toho, co vyrostlo, a dokoupíte to, co zaostalo. Tím automaticky prodáváte draho a nakupujete levně a udržujete nízké riziko.',
    strengths: 'Mimořádně klidný průběh a mělké propady. Historicky zvládá inflaci i recesi bez velkých ztrát, takže investor méně podléhá panice a vydrží.',
    weakness: 'Za stabilitu platíte nižším dlouhodobým výnosem než u akciových portfolií. V silných býčích trzích akcií výrazně zaostává, protože v nich má jen čtvrtinu.',
  },
  'nobel-portfolio': {
    intro: [
      'Nobelovo portfolio staví na moderní teorii portfolia Harryho Markowitze, za kterou dostal Nobelovu cenu za ekonomii. Její jádro zní: kombinací aktiv, která se nehýbou stejně, lze při daném výnosu snížit riziko – diverzifikace je „jediný oběd zdarma“ na trhu.',
      'V praxi jde o vyváženou střední cestu: většinu tvoří světové akcie kvůli růstu (55 %), zbytek doplňují státní dluhopisy zemí eurozóny v eurech (25 %) a nemovitosti (20 %) pro tlumení výkyvů a stálý příjem. Výsledek míří mezi klid konzervativního a růst agresivního portfolia.',
    ],
    howItWorks: 'Akcie táhnou dlouhodobý výnos, dluhopisy a nemovitosti snižují celkovou kolísavost. Poměr udržujete pravidelným vyvažováním – jednou ročně vrátíte složky na cílové podíly.',
    strengths: 'Rozumný kompromis – slušný růst při znatelně menších výkyvech než čistě akciové portfolio. Vhodné jako „univerzální“ jádro pro střední horizont.',
    weakness: 'Není extrémní v žádném směru: neroste tak rychle jako akciové portfolio a v krizi neklesá tak málo jako to permanentní. Kdo chce jedno z toho naplno, sáhne jinam.',
  },
  'akciove-portfolio': {
    intro: [
      'Akciové portfolio je sázka na dlouhodobý růst světové ekonomiky. Drží převážně široký akciový index (80 % světové akcie) a menší doplněk nemovitostí (20 %). Cílí na nejvyšší dlouhodobý výnos výměnou za největší výkyvy.',
      'Filozofie je jednoduchá: akcie historicky nabízejí nejvyšší výnos ze všech tříd aktiv, ale za cenu hlubokých propadů. Kdo má dostatečně dlouhý horizont a psychicky ustojí pokles o desítky procent, je za trpělivost historicky odměněn.',
    ],
    howItWorks: 'Pravidelně investujete do širokého akciového ETF (a menší části nemovitostí) a hlavně roky nic neprodáváte. Rozhoduje čas na trhu, ne časování trhu.',
    strengths: 'Nejvyšší očekávaný dlouhodobý výnos. Na horizontu 10+ let historicky poráží konzervativnější strategie díky složenému úročení akcií.',
    weakness: 'Hluboké propady – v datech od {od} spadlo až o {maxPoklesAbs} ({obdobiPropadu}, {navrat}). Na krátký horizont a pro nervy, které propady neustojí, se nehodí.',
  },
  'ray-dalio-all-weather': {
    intro: [
      'Portfolio „pro každé počasí“ navrhl Ray Dalio, zakladatel největšího hedgeového fondu Bridgewater. Nestaví na předpovědi budoucnosti, ale na tzv. paritě rizika: rozloží riziko tak, aby portfolio obstálo ve všech čtyřech ekonomických „počasích“ – růstu, útlumu, inflaci i deflaci.',
      'Proto má oproti běžným portfoliím velkou váhu dluhopisů (40 % dlouhé + 15 % střednědobé státní dluhopisy USA), doplněnou akciemi (30 %) a menšími pojistkami proti inflaci – komoditami (7,5 %) a zlatem (7,5 %). Dluhopisy tu nejsou jen „brzda“, ale plnohodnotný zdroj stability.',
    ],
    howItWorks: 'Váhy jsou nastavené tak, aby žádné jediné aktivum neurčovalo celkový výsledek. Dlouhé dluhopisy silně reagují na úrokové sazby a v recesích táhnou portfolio nahoru, zatímco komodity a zlato chrání při inflaci.',
    strengths: 'Odolnost napříč scénáři a nízké propady díky velké váze státních dluhopisů a zlata. Historicky velmi vyrovnaný průběh.',
    weakness: 'Velká citlivost na úrokové sazby – v roce 2022, kdy rychle rostly sazby, klesaly dlouhé dluhopisy i akcie současně a portfolio zažilo netypicky slabý rok. V dlouhých býčích trzích akcií také zaostává.',
  },
  'dividendove-portfolio': {
    intro: [
      'Dividendové portfolio cílí na pravidelný příjem z výplat dividend. Drží převážně fond dividendových „aristokratů“ (95 %) – kvalitních firem s dlouhou historií rostoucích dividend – doplněný nemovitostmi (5 %) pro další příjem.',
      'Myšlenka je mít z portfolia hmatatelný cash-flow, aniž byste museli prodávat podíly. Firmy, které desítky let nepřetržitě zvyšují dividendu, bývají stabilní a ziskové, takže portfolio kombinuje příjem s určitou obranností.',
    ],
    howItWorks: 'Fond vyplácí dividendy (typicky čtvrtletně), které buď čerpáte jako příjem, nebo reinvestujete. Pozor: vyplácené dividendy se v ČR daní, na rozdíl od akumulačních fondů.',
    strengths: 'Pravidelný a relativně předvídatelný příjem bez prodeje podílů. Zaměření na kvalitní firmy s tradicí výplat dodává určitou stabilitu.',
    weakness: 'Je to stále z 95 % akciové portfolio – v krizích padá podobně hluboko jako akciový trh. Zaměření na dividendy navíc opomíjí řadu růstových firem, takže dlouhodobý celkový výnos může zaostat za širokým indexem. Dividendy se daní.',
  },
};

export function getPortfolioContent(slug: string): PortfolioContent | null {
  return portfolioContent[slug] ?? null;
}
