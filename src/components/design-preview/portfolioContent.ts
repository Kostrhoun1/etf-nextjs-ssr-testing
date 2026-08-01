/* Redakční obsah k modelovým portfoliím – úvod, princip, silné/slabé stránky.
 * Popisuje SKUTEČNÉ složení z portfolioData (ne učebnicovou verzi). Klíč = slug.
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
  'globalni-jadro-small-cap-value': {
    intro: [
      'ETF průvodce portfolio je vzorové portfolio, na kterém ukazujeme, jak bychom sami stavěli čistě akciové portfolio, kdyby šlo o vlastní dlouhodobé peníze — s důrazem na dvě věci, které se dají doložit čísly: minimalizovat daně a náklady jádra a přidat jen ty faktory, které po nákladech reálně přežijí. Není to investiční doporučení, ale poctivě odůvodněný příklad.',
      'Jádro (85 %) záměrně nestavíme na jednom „all-world" fondu, ale na třech cap-weight stavebních kamenech vybraných kvůli daním a nákladům: syntetický S&P 500 (vyhýbá se americké srážkové dani z dividend — na 10 letech dat reálně o ~20 bp/rok lepší než fyzická replikace), MSCI World ex USA a rozvíjející se trhy (EM IMI). Dohromady tvoří stejný globální trh jako jeden all-world fond, ale s ověřeným nadvýnosem ~+15–20 bp ročně. Je to málo — ale je to zadarmo a natrvalo.',
      'U faktorů jsme byli tvrdí. Value, quality, momentum i size jsou na papíře reálné prémie, jenže otázka pro českého UCITS investora nezní „existují?", ale „dokážu je po nákladech vytěžit?". A tam většina padá: value po poplatcích ~0, quality taky (QUAL zaostal −0,4 % za trhem), momentum se v UCITS obalu nedá koupit za rozumnou cenu. Jediný faktor, který přežívá i po nákladech a má za sebou 44 let živé historie, je small-cap value — fond DFSVX vydělával ~11,4 % ročně od 1993, ~+1,8 pb/rok nad svým benchmarkem.',
      'Proto je jediný náklon v tomhle portfoliu 15% satelit small-cap value (Avantis). A nedržíme ho kvůli honbě za výnosem — bereme ho jako režimovou pojistku: pomáhá nejvíc ve „ztracené dekádě" cap-weight trhu, jeho očekávaný přínos je skromný (0–15 bp s pravděpodobností úspěchu ~60–65 %). To znamená disciplínu: závazek držet ho i roky, kdy zaostává, protože přesně to je cena za tu prémii.',
    ],
    howItWorks: 'Jednou ročně vyvážíte zpět na 54/22/9/15. Jádro (85 %) dělá hlavní práci a přebírá tržní výnos co nejlevněji a daňově nejčistěji; small-cap value satelit (15 %) je dlouhodobá pojistka, se kterou se neobchoduje podle nálady — nechává se běžet i v letech, kdy zaostává za trhem.',
    strengths: 'Levné, daňově optimalizované světové jádro s ověřeným nadvýnosem nad jedním all-world fondem, plus jediný faktor s doloženým přínosem po nákladech. Poctivost je tu záměrná: nepřidáváme faktory, které po poplatcích mizí, a u satelitu otevřeně přiznáváme, že jde o pojistku se skromným očekáváním, ne o zázračný výnos.',
    weakness: 'Je to 100% akciové portfolio — počítejte s propady i −50 % a lety návratu na vrchol. Small-cap value může zaostávat i celou dekádu a vyžaduje pevné nervy a závazek ho neprodat. A oproti jednomu all-world fondu je náročnější na správu: čtyři fondy, pravidelný rebalancing a víc administrativy — vyplatí se jen tomu, kdo to opravdu udrží dlouhé roky.',
  },
  'permanentni-portfolio': {
    intro: [
      'Permanentní portfolio vychází z myšlenky Harryho Browna z 80. let: rozložit majetek rovným dílem mezi aktiva, z nichž každé se daří v jiné fázi ekonomiky. Když jedna část klesá, jiná zpravidla roste, a celek tak zůstává klidný bez ohledu na to, co dělá trh.',
      'Drží čtyři rovnoměrné čtvrtiny přesně podle Browna: světové akcie (růst v dobách prosperity), dlouhé státní dluhopisy (opora při recesi a deflaci), zlato (ochrana při inflaci a krizích důvěry) a hotovost v podobě krátkých státních dluhopisů (klid a rezerva na nákupy během propadů). Žádná složka nepřesahuje 25 %, takže portfolio nestojí a nepadá s jediným trhem.',
    ],
    howItWorks: 'Jednou ročně portfolio vyvážíte zpět na 25/25/25/25 – prodáte část toho, co vyrostlo, a dokoupíte to, co zaostalo. Tím automaticky prodáváte draho a nakupujete levně a udržujete nízké riziko.',
    strengths: 'Mimořádně klidný průběh a mělké propady. Historicky zvládá inflaci i recesi bez velkých ztrát, takže investor méně podléhá panice a vydrží.',
    weakness: 'Za stabilitu platíte nižším dlouhodobým výnosem než u akciových portfolií. V silných býčích trzích akcií výrazně zaostává, protože v nich má jen čtvrtinu.',
  },
  'nobel-portfolio': {
    intro: [
      'Nobelovo portfolio staví na moderní teorii portfolia Harryho Markowitze, za kterou dostal Nobelovu cenu za ekonomii. Její jádro zní: kombinací aktiv, která se nehýbou stejně, lze při daném výnosu snížit riziko – diverzifikace je „jediný oběd zdarma" na trhu.',
      'V praxi jde o vyváženou střední cestu: většinu tvoří světové akcie kvůli růstu (55 %), zbytek doplňují globální dluhopisy (25 %) a nemovitosti (20 %) pro tlumení výkyvů a stálý příjem. Výsledek míří mezi klid konzervativního a růst agresivního portfolia.',
    ],
    howItWorks: 'Akcie táhnou dlouhodobý výnos, dluhopisy a nemovitosti snižují celkovou kolísavost. Poměr udržujete pravidelným rebalancingem, ideálně jednou ročně.',
    strengths: 'Rozumný kompromis – slušný růst při znatelně menších výkyvech než čistě akciové portfolio. Vhodné jako „univerzální" jádro pro střední horizont.',
    weakness: 'Není extrémní v žádném směru: neroste tak rychle jako akciové portfolio a v krizi neklesá tak málo jako to permanentní. Kdo chce jedno z toho naplno, sáhne jinam.',
  },
  'akciove-portfolio': {
    intro: [
      'Akciové portfolio je sázka na dlouhodobý růst světové ekonomiky. Drží převážně široký akciový index (80 % světové akcie) a menší doplněk nemovitostí (20 %). Cílí na nejvyšší dlouhodobý výnos výměnou za největší výkyvy.',
      'Filozofie je jednoduchá: akcie historicky nabízejí nejvyšší výnos ze všech tříd aktiv, ale za cenu hlubokých propadů. Kdo má dostatečně dlouhý horizont a psychicky ustojí pokles o desítky procent, je za trpělivost historicky odměněn.',
    ],
    howItWorks: 'Pravidelně investujete do širokého akciového ETF (a menší části nemovitostí) a hlavně roky nic neprodáváte. Rozhoduje čas na trhu, ne časování trhu.',
    strengths: 'Nejvyšší očekávaný dlouhodobý výnos. Na horizontu 10+ let historicky poráží konzervativnější strategie díky složenému úročení akcií.',
    weakness: 'Nejhlubší propady – v krizích může spadnout o 40 % i víc a návrat na vrchol trvá roky. Není vhodné pro krátký horizont ani pro nervy, které propady neustojí.',
  },
  'ray-dalio-all-weather': {
    intro: [
      'Portfolio „pro každé počasí" navrhl Ray Dalio, zakladatel největšího hedgeového fondu Bridgewater. Nestaví na předpovědi budoucnosti, ale na tzv. paritě rizika: rozloží riziko tak, aby portfolio obstálo ve všech čtyřech ekonomických „počasích" – růstu, útlumu, inflaci i deflaci.',
      'Proto má oproti běžným portfoliím velkou váhu dluhopisů (40 % dlouhé + 15 % střednědobé státní dluhopisy USA), doplněnou akciemi (30 %) a menšími pojistkami proti inflaci – komoditami (7,5 %) a zlatem (7,5 %). Dluhopisy tu nejsou jen „brzda", ale plnohodnotný zdroj stability.',
    ],
    howItWorks: 'Váhy jsou nastavené tak, aby žádné jediné aktivum neurčovalo celkový výsledek. Dlouhé dluhopisy silně reagují na úrokové sazby a v recesích táhnou portfolio nahoru, zatímco komodity a zlato chrání při inflaci.',
    strengths: 'Odolnost napříč scénáři a nízké propady díky velké váze státních dluhopisů a zlata. Historicky velmi vyrovnaný průběh.',
    weakness: 'Velká citlivost na úrokové sazby – v roce 2022, kdy rychle rostly sazby, klesaly dlouhé dluhopisy i akcie současně a portfolio zažilo netypicky slabý rok. V dlouhých býčích trzích akcií také zaostává.',
  },
  'dividendove-portfolio': {
    intro: [
      'Dividendové portfolio cílí na pravidelný příjem z výplat dividend. Drží převážně fond dividendových „aristokratů" (95 %) – kvalitních firem s dlouhou historií rostoucích dividend – doplněný nemovitostmi (5 %) pro další příjem.',
      'Myšlenka je mít z portfolia hmatatelný cash-flow, aniž byste museli prodávat podíly. Firmy, které desítky let nepřetržitě zvyšují dividendu, bývají stabilní a ziskové, takže portfolio kombinuje příjem s určitou obranností.',
    ],
    howItWorks: 'Fond vyplácí dividendy (typicky čtvrtletně), které buď čerpáte jako příjem, nebo reinvestujete. Pozor: vyplácené dividendy se v ČR daní, na rozdíl od akumulačních fondů.',
    strengths: 'Pravidelný a relativně předvídatelný příjem bez prodeje podílů. Zaměření na kvalitní firmy s tradicí výplat dodává určitou stabilitu.',
    weakness: 'Je to stále z 95 % akciové portfolio – v krizích padá podobně hluboko jako trh, klidně o 45 %. Zaměření na dividendy navíc opomíjí řadu růstových firem, takže dlouhodobý celkový výnos může zaostat za širokým indexem. Dividendy se daní.',
  },
};

export function getPortfolioContent(slug: string): PortfolioContent | null {
  return portfolioContent[slug] ?? null;
}
