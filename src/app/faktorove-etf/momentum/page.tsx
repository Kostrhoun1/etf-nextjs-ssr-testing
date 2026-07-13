import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import FactorDetail, { FactorConfig } from '@/components/design-preview/FactorDetail';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Momentum faktor: jediný, který porazil index – hloubková analýza',
  description:
    'Momentum je nejsilnější faktor: od roku 2000 vydělal v korunách 8,0 % ročně proti 6,2 % u S&P 500 – jako jediný index jasně porazil. Jak funguje, co říká výzkum, rolling okna, chování ve čtyřech krizích včetně crashe 2009.',
  alternates: { canonical: '/faktorove-etf/momentum' },
  openGraph: {
    title: 'Momentum: jediný faktor, který porazil index',
    description:
      'Hloubková analýza v korunách od roku 2000: 8,0 % ročně vs 6,2 % u indexu, čtyři krize včetně momentum crashe 2009.',
    url: 'https://etfpruvodce.cz/faktorove-etf/momentum',
    images: [ogImage({ title: 'Momentum: jediný faktor, který porazil index', eyebrow: 'Faktorová analýza · v korunách', stat: '+8,0 % ročně', statLabel: 'od 2000 · S&P 500 měl +6,2 %' })],
    type: 'article',
  },
};

const cfg: FactorConfig = {
  slug: 'momentum',
  indexCode: 'us_momentum',
  ter: 0.0025,
  dataStart: '2000-01-01',
  shortName: 'Momentum',
  badge: 'Faktorová analýza 1/6 · momentum',
  h1: 'Momentum: jediný faktor, který porazil index',
  lead: (
    <>
      Kupovat to, co roste, zní jako nejhloupější možná strategie. Data říkají opak:{' '}
      <strong className="text-white">od roku 2000 vydělal momentum v korunách 8,0 % ročně proti 6,2 % u
      S&P 500</strong> – jako jediný faktor index jasně porazil, přes dot-com, rok 2008 i vlastní slavný
      crash v roce 2009. Celý rozbor tady.
    </>
  ),
  dataRange: 'Denní data 2000–2026, v Kč, po TER',
  howTitle: 'Jak momentum funguje',
  howParagraphs: [
    <>
      Momentum index (u ETF nejčastěji metodika MSCI) vybírá akcie s nejlepším výnosem za posledních{' '}
      <strong>6 a 12 měsíců</strong> – s vynecháním posledního měsíce (krátkodobé pohyby se často obracejí)
      a s korekcí na volatilitu (aby nevyhrávaly jen divoké tituly). Přeskládává se dvakrát ročně.
    </>,
    <>
      Proč by to mělo fungovat? Nejpřijímanější vysvětlení je <strong>behaviorální</strong>: trh na nové
      informace reaguje pomalu – dobré zprávy se do ceny promítají týdny a měsíce, ne okamžitě. A jakmile
      trend běží, přitahuje další kupující. Momentum tedy nevydělává na „kvalitě“ firem, ale na
      předvídatelných chybách lidského chování.
    </>,
    <>
      Akademicky je momentum popsané od roku 1993 (Jegadeesh a Titman) a drží se napříč trhy, obdobími
      i třídami aktiv. Eugene Fama – otec teorie efektivních trhů, pro kterou je momentum noční můrou –
      ho označil za <em>hlavní anomálii</em> trhu.
    </>,
  ],
  numbersTitle: 'Momentum v korunách (leden 2000 – červenec 2026)',
  numbersDesc: 'Jednorázových 100 000 Kč, po poplatcích (TER 0,25 %), kurz den po dni. Před 2013 akademická řada napojená na ETF (viz poznámka níže).',
  statCards: [
    { big: '770 000 Kč', text: 'ze 100 000 Kč za 26 let (+8,0 % ročně). S&P 500 dal za stejné období 487 000 Kč (+6,2 %).' },
    { big: '+43,6 %', text: 'nejlepší rok (2024). V ročence faktorů momentum vyhrálo 5× z 12 let.' },
    { big: '−60,7 %', text: 'nejhlubší propad (éra dot-com od září 2000). V éře ETF (od 2013) byl nejhlubší propad −31 %.' },
  ],
  dcaText: (
    <>
      <strong className="text-slate-900">S pravidelnými vklady:</strong> kdo od ledna 2000 vložil 100 000 Kč
      a přidával 5 000 Kč měsíčně, vložil celkem 1 690 000 Kč – a dnes by měl{' '}
      <strong className="text-slate-900">přibližně 11 715 000 Kč</strong>.
    </>
  ),
  rolling: [
    { yrs: '1 rok', avg: '+9,1 %', low: '−32,3 %', high: '+55,8 %', pos: '69 %' },
    { yrs: '5 let', avg: '+9,1 %', low: '−9,8 %', high: '+24,7 %', pos: '74 %' },
    { yrs: '10 let', avg: '+10,3 %', low: '−6,2 %', high: '+20,8 %', pos: '87 %' },
    { yrs: '15 let', avg: '+10,7 %', low: '+2,4 %', high: '+17,7 %', pos: '100 %' },
  ],
  rollingNote: (
    <>
      Jeden rok je loterie (od −32 % do +56 %) a přes dot-com éru umělo být záporné i desetileté okno
      (−6,2 % ročně). <strong className="text-slate-700">Jistotu kladného výsledku daly až horizonty
      15 let</strong> (nejhorší case +2,4 % ročně) – stejná lekce jako u ostatních faktorů.
    </>
  ),
  crises: [
    { name: 'Dot-com krach (2000–02)', drop: '−53 %', note: 'návrat 137 měsíců – nejdelší zkouška; momentum drželo technologie až do konce' },
    { name: 'Finanční krize 2008', drop: '−45 %', note: 'návrat 37 měsíců – a v odrazu 2009 momentum zaostalo o 10 p. b. za indexem (slavný momentum crash)' },
    { name: 'COVID krach (2020)', drop: '−27 %', note: 'zotavení za 4 měsíce – momentum drželo technologie, které z pandemie vyšly jako vítěz' },
    { name: 'Medvědí trh 2022', drop: '−23 %', note: 'zotavení za 19 měsíců – obrat trhu momentum zaskočil, držel růstové tituly z 2021' },
  ],
  riskTitle: 'Momentum crash: největší slabina',
  riskDesc: 'Rok 2009 máme v datech – a je vidět přesně to, co teorie předpovídá.',
  riskBody: (
    <>
      <strong className="text-slate-900">Momentum crash.</strong> Když trh prudce otočí po velkém propadu,
      momentum drží defenzivní akcie, které „vedly“ v klesajícím trhu – a odraz propásne. Přesně to ukazuje
      rok 2009 v našich datech: <strong className="text-slate-900">momentum +10,5 %, zatímco S&P 500
      +20,2 %</strong> – zaostání o 10 procentních bodů v roce největší rally. U koncentrovanějších
      momentum strategií (long-short, úzké decily) byl crash 2009 ještě mnohem hlubší. Momentum tedy
      dlouhodobě vede, ale svá vítězství si vybírá jindy než trh – a po velkých obratech platí daň.
    </>
  ),
  etfs: [
    { name: 'iShares Edge MSCI World Momentum Factor', isin: 'IE00BP3QZ825', ter: '0,25 %' },
  ],
  etfNote: (
    <>
      Pozn. k datům: od dubna 2013 běží řada na americkém momentum ETF; období 2000–2013 je prodloužené
      akademickým denním portfoliem (Kenneth R. French Data Library, velké firmy s nejvyšším momentem) napojeným
      na ETF – v překryvu s ETF má korelace denních výnosů 0,96 a mírně nižší výnos (konzervativní směr).
      Světová UCITS verze má mírně odlišnou metodiku. Kde ETF koupit, srovnáváme v přehledu brokerů.
    </>
  ),
  faqs: [
    {
      q: 'Co přesně momentum faktor kupuje?',
      a: 'Akcie, kterým se v posledních 6–12 měsících dařilo nejvíc (očištěno o poslední měsíc a o volatilitu). Index se přeskládává dvakrát ročně, takže složení se průběžně mění podle toho, co zrovna „jede“ – jednou technologie, jindy energie nebo banky.',
    },
    {
      q: 'Proč by mělo momentum fungovat i do budoucna?',
      a: 'Nejčastější vysvětlení je behaviorální: investoři na nové informace reagují pomalu (trendy „dojíždějí“) a zároveň rádi naskakují na to, co roste. Protože jde o lidské chování, může přetrvávat – ale také se může po rozšíření faktorových ETF oslabit. Záruka neexistuje.',
    },
    {
      q: 'Jaké je největší riziko momenta?',
      a: 'Tzv. momentum crash: prudký obrat trhu po propadu. Momentum drží akcie, které vedly v klesajícím trhu (defenzivní tituly), a při rychlém obratu nahoru zůstane stát – v roce 2009 zaostal náš momentum o 10 p. b. za indexem a koncentrovanější strategie ztratily mnohem víc.',
    },
    {
      q: 'Jak si momentum koupím v Česku?',
      a: 'Nejběžnější je iShares Edge MSCI World Momentum Factor (ISIN IE00BP3QZ825, TER 0,25 %) – celosvětová verze dostupná u brokerů v ČR. Detaily a alternativy najdete v našem srovnávači ETF.',
    },
    {
      q: 'Kolik procent portfolia dává smysl dát do momenta?',
      a: 'Pokud vůbec, tak jako doplněk k širokému indexu – běžně se uvádí 10–20 % akciové složky. Momentum má vyšší obrátkovost a specifická rizika; jako jediná akciová pozice se nehodí.',
    },
    {
      q: 'Proč se vaše čísla liší od amerických zdrojů?',
      a: 'Počítáme v korunách (výsledek zahrnuje pohyb kurzu USD/CZK), po odečtení TER a na reálném ETF (před 2013 na akademické řadě napojené na ETF). Americké tabulky bývají v dolarech a bez poplatků.',
    },
  ],
  related: [
    ['/faktorove-etf', 'Přehled všech šesti faktorů'],
    ['/buffettovo-portfolio', 'Buffettovo portfolio 90/10 v korunách'],
    ['/kolik-vydelaly-etf', 'Kolik vydělaly ETF a akcie'],
  ],
};

export default function Page() {
  return <FactorDetail cfg={cfg} />;
}
