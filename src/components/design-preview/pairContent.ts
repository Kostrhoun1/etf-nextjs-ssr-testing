/* Kurátorský obsah pro konkrétní „X vs Y“ dvojice (/srovnani/[pair]).
 *
 * Šablona funguje pro LIBOVOLNOU dvojici čistě z dat (výnosy, TER, velikost, index). Tady jen REDAKČNÍ
 * úhel pro nejžádanější dvojice: proč se porovnávají a v čem se liší.
 *
 * Pravidla textů (revize kola 4, 18. 10. 2026): vykání, fakta, max. 3 věty na odstavec, žádná čísla
 * napsaná rukou – poplatky, velikosti, počty firem a podíl USA jsou v tabulkách na stránce (z dat, s datem).
 * Ověřená fakta, o která se texty opírají (DB 18. 10. 2026 + daně dle paměti dane-etf-fakta-2026):
 *   - CSPX/SXR8, VUAA, EUNL/IWDA, VWCE, SWRD = akumulační; VUSA, VWRL, SPY5 = distribuční (čtvrtletně),
 *   - VUSA (2012) je starší a větší než VUAA (2019); VWCE je větší než VWRL; EUNL/IWDA (2009) je větší než SWRD (2019),
 *   - SPY5 má nižší TER než CSPX (0,03 vs 0,07 % – v textu jen „nižší“, číslo je v tabulce),
 *   - dividendy se v ČR daní 15 %; zisk z prodeje je osvobozený po 3 letech držení (od 2026 bez horního limitu)
 *     nebo při příjmech z prodeje do 100 000 Kč za rok.
 * Pozor: stránka přejmenuje tickery z URL na ticker z XETRA (CSPX → SXR8, IWDA → EUNL) – proto texty nikdy
 * nezmiňují oba tickery téhož fondu (dřív vznikalo „SXR8 na burze vidím i jako SXR8“).
 *
 * Klíč = slug „ticker1-vs-ticker2“ (malými písmeny). Vše je volitelné – co chybí, doplní datová šablona.
 */

export interface PairFaq {
  q: string;
  a: string;
}

export interface PairContent {
  /** 1–3 krátké odstavce: proč se dvojice porovnává a v čem je jádro rozdílu. */
  intro?: string[];
  /** Komu který fond sedí (fakta, ne doporučení). */
  pick1?: string;
  pick2?: string;
  /** Doplňkové FAQ specifické pro tuhle dvojici (nad rámec datových). */
  faqs?: PairFaq[];
}

const DANE_PRODEJ = 'Zisk z prodeje je osvobozený, pokud fond držíte déle než 3 roky (od roku 2026 bez horního limitu), nebo když příjmy z prodejů za rok nepřesáhnou 100 000 Kč.';

export const pairContent: Record<string, PairContent> = {
  'iwda-vs-cspx': {
    intro: [
      'Oba fondy jsou od iShares, oba akumulační a oba s domicilem v Irsku. Liší se tím hlavním – co drží.',
      'IWDA sleduje MSCI World, tedy velké a střední firmy z vyspělých zemí. CSPX sleduje S&P 500, tedy jen 500 největších firem z USA.',
      'Americké firmy mají v MSCI World velkou váhu, takže se oba fondy z velké části překrývají. Kolik tvoří USA v každém z nich, ukazuje část „Do čeho fondy investují“.',
    ],
    pick1: 'Jeden fond na celý vyspělý svět – vedle USA i Evropa, Japonsko, Kanada nebo Austrálie.',
    pick2: 'Jen americký trh. Celá investice tak závisí na jedné zemi a jednom kurzu (USD/CZK).',
    faqs: [
      {
        q: 'Není IWDA skoro totéž co CSPX, když má většinu v USA?',
        a: 'Ne úplně. Část IWDA mimo USA (Evropa, Japonsko a další) v CSPX vůbec není. Podíl USA se v indexu v čase mění podle tržní hodnoty firem.',
      },
      {
        q: 'Dává smysl držet oba fondy zároveň?',
        a: 'Kombinace zvyšuje váhu USA nad úroveň světového indexu – firmy z CSPX už v IWDA jsou. Jde tedy o rozhodnutí o poměru regionů, ne o širší rozložení.',
      },
      {
        q: 'Můžu později přejít z jednoho fondu na druhý bez daně?',
        a: `Přechod znamená prodej a nákup, a prodej je daňová událost. ${DANE_PRODEJ}`,
      },
    ],
  },
  'vwce-vs-iwda': {
    intro: [
      'Oba fondy jsou akumulační, liší se složením. VWCE sleduje FTSE All-World – vyspělé i rozvíjející se trhy (Čína, Indie, Tchaj-wan…).',
      'IWDA sleduje MSCI World – jen vyspělé trhy, rozvíjející se v něm nejsou. Počet firem v obou fondech je v tabulce parametrů.',
    ],
    pick1: 'Celý svět včetně rozvíjejících se trhů v jednom fondu, váhy regionů řídí index.',
    pick2: 'Jen vyspělé trhy. Rozvíjející se trhy lze přikoupit zvlášť a jejich váhu si řídit sami.',
    faqs: [
      {
        q: 'Když k IWDA přikoupím fond na rozvíjející se trhy, dostanu totéž co VWCE?',
        a: 'Přibližně ano – složení se blíží celosvětovému indexu. Poměr obou fondů si ale hlídáte a vyvažujete sami.',
      },
      {
        q: 'Můžu později přejít z IWDA na VWCE?',
        a: `Ano, ale prodej IWDA je daňová událost. ${DANE_PRODEJ}`,
      },
    ],
  },
  'swrd-vs-iwda': {
    intro: [
      'Oba fondy sledují stejný index MSCI World, oba jsou akumulační a s domicilem v Irsku. Liší se správcem (SPDR a iShares), poplatkem a velikostí.',
      'IWDA je starší (od roku 2009) a výrazně větší, SWRD vznikl v roce 2019. Poplatek a velikost obou jsou v tabulce parametrů.',
    ],
    pick1: 'Stejný index s jiným poplatkem – rozdíl ukazuje tabulka parametrů.',
    pick2: 'Větší fond s delší historií.',
    faqs: [
      {
        q: 'Vyplatí se kvůli nižšímu poplatku prodat IWDA a koupit SWRD?',
        a: `Prodej je daňová událost a daň ze zisku může převýšit úsporu na poplatku. ${DANE_PRODEJ}`,
      },
    ],
  },
  'cspx-vs-vuaa': {
    intro: [
      'Oba fondy sledují S&P 500, oba jsou akumulační a s domicilem v Irsku. Liší se správcem (iShares a Vanguard), velikostí a stářím.',
      'Výnosy se liší jen nepatrně – jak přesně fond kopíruje index. Rozdíly v poplatku a velikosti ukazuje tabulka parametrů.',
    ],
    pick1: 'Největší a nejstarší z obou fondů (od roku 2010).',
    pick2: 'Stejný index od Vanguardu (od roku 2019).',
    faqs: [
      {
        q: 'Který z nich koupím u DEGIRO nebo XTB?',
        a: 'Oba bývají u českých brokerů v nabídce. Burzu a měnu ověřte přímo v aplikaci brokera – podle nich se liší poplatek za obchod a směnu.',
      },
      {
        q: 'Musím u akumulačních fondů danit dividendy?',
        a: `Ne. Dividendy fond reinvestuje uvnitř, na účet nic nechodí. ${DANE_PRODEJ}`,
      },
    ],
  },
  'vusa-vs-vuaa': {
    intro: [
      'Jde o dvě třídy téhož fondu Vanguard S&P 500 – stejný index i poplatek. Liší se jen výplatou dividend.',
      'VUSA je distribuční a dividendy čtvrtletně vyplácí na účet. VUAA je akumulační a dividendy reinvestuje uvnitř fondu.',
      'Vyplacené dividendy se v Česku daní 15 % a uvádějí v daňovém přiznání. U akumulační třídy daň z dividend neřešíte.',
    ],
    pick1: 'Pravidelná výplata dividend na účet (zdaněná 15 %).',
    pick2: 'Dividendy se reinvestují, roční daň z dividend odpadá.',
    faqs: [
      {
        q: 'Znamená akumulace, že prodej nebudu danit?',
        a: `Ne. Akumulace odpouští jen daň z dividend, zisk z prodeje se posuzuje u obou tříd stejně. ${DANE_PRODEJ}`,
      },
      {
        q: 'Proč je VUSA větší než VUAA, když jde o stejný fond?',
        a: 'VUSA je na trhu déle (od roku 2012, VUAA od roku 2019). Velikost obou tříd je v tabulce parametrů.',
      },
      {
        q: 'Liší se třídy měnovým rizikem?',
        a: 'Ne. Obě drží stejné americké akcie, hodnota v korunách se mění s kurzem USD/CZK stejně.',
      },
    ],
  },
  'cspx-vs-spy5': {
    intro: [
      'Oba fondy sledují S&P 500. Liší se výplatou dividend: CSPX je akumulační, SPY5 distribuční (vyplácí čtvrtletně).',
      'SPY5 má nižší poplatek, ale vyplacené dividendy se v Česku daní 15 %. Poplatek i velikost obou jsou v tabulce parametrů.',
    ],
    pick1: 'Dividendy se reinvestují uvnitř fondu, daň z dividend neřešíte.',
    pick2: 'Nižší poplatek a dividendy na účet (zdaněné 15 %).',
    faqs: [
      {
        q: 'Je SPY5 akumulační, nebo distribuční?',
        a: 'Distribuční – dividendy vyplácí na účet. Každou výplatu v Česku zdaníte 15 %.',
      },
      {
        q: 'Souvisí akumulace s časovým testem?',
        a: `Ne. Akumulace se týká dividend, časový a hodnotový test zisku z prodeje. ${DANE_PRODEJ}`,
      },
    ],
  },
  'vwce-vs-vwrl': {
    intro: [
      'Jde o dvě třídy téhož fondu Vanguard FTSE All-World – stejné složení i poplatek. Liší se jen výplatou dividend.',
      'VWCE je akumulační a dividendy reinvestuje uvnitř fondu. VWRL je distribuční a vyplácí je čtvrtletně na účet.',
      'Vyplacené dividendy se v Česku daní 15 %, i když je pak sami reinvestujete. U VWCE daň z dividend neřešíte.',
    ],
    pick1: 'Dividendy se reinvestují uvnitř fondu, daň z dividend odpadá.',
    pick2: 'Pravidelná výplata dividend na účet (zdaněná 15 %).',
    faqs: [
      {
        q: 'Když dividendu z VWRL sám reinvestuji, vyjde to stejně jako VWCE?',
        a: 'Ne úplně. Dividendu nejdřív zdaníte 15 % a za dokoupení obvykle zaplatíte poplatek brokerovi.',
      },
      {
        q: 'Liší se VWCE a VWRL měnovým rizikem?',
        a: 'Ne. Obě třídy drží stejné celosvětové portfolio, měnové riziko vůči koruně je stejné.',
      },
    ],
  },
  'cspx-vs-vusa': {
    intro: [
      'Oba fondy sledují S&P 500 a mají stejný poplatek. Liší se správcem (iShares a Vanguard) a hlavně výplatou dividend.',
      'CSPX je akumulační a dividendy reinvestuje. VUSA je distribuční a vyplácí je čtvrtletně na účet, kde je v Česku zdaníte 15 %.',
      'Pro srovnání jen správců porovnejte stejné třídy – akumulační CSPX a VUAA.',
    ],
    pick1: 'Dividendy se reinvestují uvnitř fondu, daň z dividend neřešíte.',
    pick2: 'Pravidelná výplata dividend na účet (zdaněná 15 %).',
    faqs: [
      {
        q: 'Musím u CSPX řešit daň z dividend?',
        a: `Ne. Dividendy fond reinvestuje uvnitř, do přiznání je neuvádíte. ${DANE_PRODEJ}`,
      },
    ],
  },
};

export function getPairContent(slug: string): PairContent | null {
  return pairContent[slug.toLowerCase()] ?? null;
}
