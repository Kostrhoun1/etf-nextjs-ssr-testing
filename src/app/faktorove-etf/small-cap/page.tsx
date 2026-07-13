import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import FactorDetail, { FactorConfig } from '@/components/design-preview/FactorDetail';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Small cap faktor: malé firmy v korunách od 2000 – hloubková analýza',
  description:
    'Malé firmy porazily od roku 2000 S&P 500 – o desetiny procenta a za cenu nejdivočejší jízdy. Rolling okna, krize, DCA a proč size prémie od svého objevení slábne.',
  alternates: { canonical: '/faktorove-etf/small-cap' },
  openGraph: {
    title: 'Small cap: nejdivočejší jízda za nejmenší prémii',
    description:
      'Od 2000 jediný faktor nad indexem (+5,9 vs +5,6 % v Kč) – ale s propadem −63 % a rokem +74 % i −40 %. Kompletní rozbor.',
    url: 'https://etfpruvodce.cz/faktorove-etf/small-cap',
    images: [ogImage({ title: 'Small cap: nejdivočejší jízda za nejmenší prémii', eyebrow: 'Faktorová analýza · v korunách', stat: '+5,9 % vs +5,6 %', statLabel: 'malé firmy vs S&P 500 od roku 2000' })],
    type: 'article',
  },
};

const cfg: FactorConfig = {
  slug: 'small-cap',
  indexCode: 'us_small_cap',
  ter: 0.0035,
  dataStart: '2000-05-26',
  shortName: 'Small cap',
  badge: 'Faktorová analýza 3/6 · small cap',
  h1: 'Small cap: nejdivočejší jízda za nejmenší prémii',
  lead: (
    <>
      Malé firmy rostou rychleji než korporace – a jejich akcie by proto měly dlouhodobě vydělávat víc.
      V korunách od roku 2000 to <strong className="text-white">těsně platí: +5,9 % ročně proti +5,6 % u
      S&P 500</strong>. Otázka je, jestli desetiny procenta stojí za rok, kdy portfolio umí udělat +74 %
      i −40 %.
    </>
  ),
  dataRange: 'Denní data 2000–2026, v Kč, po TER',
  howTitle: 'Jak size faktor funguje',
  howParagraphs: [
    <>
      Size faktor drží <strong>menší veřejně obchodované firmy</strong> – v našich datech index Russell 2000
      (americké firmy zhruba od 1. do 8. miliardy dolarů), v UCITS verzi MSCI World Small Cap. Malé firmy mají
      víc prostoru růst, častěji se stávají cílem akvizic a analytici je sledují méně – trh je tedy oceňuje
      s většími chybami.
    </>,
    <>
      Akademicky jde o druhý nejstarší faktor: Rolf Banz popsal size prémii už v roce 1981 a Fama s Frenchem
      z ní udělali součást trojfaktorového modelu (SMB – „small minus big“). Háček: <strong>od svého
      zveřejnění prémie znatelně zeslábla</strong> – část akademiků soudí, že ji trh po objevení z velké části
      vyarbitrážoval, a v posledních letech drží spíš v kombinaci s kvalitou (malé ziskové firmy).
    </>,
  ],
  numbersTitle: 'Small cap v korunách (květen 2000 – červenec 2026)',
  numbersDesc: 'Jednorázových 100 000 Kč, po poplatcích (TER 0,35 %), kurz den po dni.',
  statCards: [
    { big: '444 000 Kč', text: 'ze 100 000 Kč za 26 let (+5,9 % ročně) proti 419 tis. (+5,6 %) u S&P 500 na stejném okně. Kromě momenta jediný faktor nad indexem.' },
    { big: '+44,2 %', text: 'nejlepší rok (2013) – a jednoleté okno umělo i +74 %. Nejvyšší kolísavost ze všech faktorů (±25 %).' },
    { big: '−63,2 %', text: 'nejhlubší propad (od září 2000). Návrat na vrchol trval 152 měsíců – přes 12 let.' },
  ],
  dcaText: (
    <>
      <strong className="text-slate-900">S pravidelnými vklady:</strong> kdo od května 2000 vložil 100 000 Kč
      a přidával 5 000 Kč měsíčně, vložil celkem 1 670 000 Kč – a dnes by měl{' '}
      <strong className="text-slate-900">přibližně 6 190 000 Kč</strong>.
    </>
  ),
  rolling: [
    { yrs: '1 rok', avg: '+7,3 %', low: '−40,4 %', high: '+74,2 %', pos: '62 %' },
    { yrs: '5 let', avg: '+6,8 %', low: '−10,6 %', high: '+23,1 %', pos: '75 %' },
    { yrs: '10 let', avg: '+7,9 %', low: '−4,9 %', high: '+16,3 %', pos: '88 %' },
    { yrs: '15 let', avg: '+8,1 %', low: '+2,5 %', high: '+13,5 %', pos: '100 %' },
  ],
  rollingNote: (
    <>
      Roční rozptyl od −40 % do +74 % je nejširší ze všech faktorů – small cap je čistá esence akciového
      rizika. Jistotu kladného výsledku daly až horizonty 15 let (nejhorší case +2,5 % ročně).
    </>
  ),
  crises: [
    { name: 'Finanční krize 2008', drop: '−53 %', note: 'návrat 35 měsíců – malé firmy padly hluboko, ale zotavily se rychleji než value' },
    { name: 'COVID krach (2020)', drop: '−37 %', note: 'návrat 8 měsíců – nejhlubší covidový propad z faktorů, pak raketové zotavení' },
    { name: 'Medvědí trh 2022', drop: '−21 %', note: 'návrat 20 měsíců – vyšší sazby dopadají na zadlužené malé firmy nejvíc' },
  ],
  riskTitle: 'Hlavní riziko: platíte plnou volatilitu za nejistou prémii',
  riskDesc: 'Size je nejslabší z klasických prémií – a nejdražší na nervy.',
  riskBody: (
    <>
      Od roku 2014 malé firmy <strong className="text-slate-900">nevyhrály v naší ročence ani jednou</strong> a
      za velkými firmami zaostávaly skoro celé desetiletí – éře megakorporací a indexových toků malé firmy
      nesvědčí. Prémie +0,3 procentního bodu z 26 let se snadno ztratí ve vyšším TER (0,35 %) a jednom
      špatně načasovaném prodeji. Pokud small cap, pak s vědomím, že kupujete hlavně vyšší riziko – prémie
      je bonus, ne jistota.
    </>
  ),
  etfs: [
    { name: 'iShares MSCI World Small Cap', isin: 'IE00BF4RFH31', ter: '0,35 %' },
  ],
  etfNote: (
    <>
      Pozn.: backtest výše běží na americkém Russell 2000 (nejdelší řada, od 2000); světová UCITS verze drží
      malé firmy z vyspělých trhů celého světa.
    </>
  ),
  faqs: [
    {
      q: 'Proč by malé firmy měly vydělávat víc?',
      a: 'Tři důvody: víc prostoru pro růst (snáz zdvojnásobíte tržby z 1 miliardy než ze 100), akviziční prémie (malé firmy jsou cíle převzetí) a horší pokrytí analytiky (víc chyb v ocenění = víc příležitostí). Zároveň jsou ale křehčí – hůř snáší recese a drahé financování.',
    },
    {
      q: 'Platí size prémie ještě dnes?',
      a: 'Sporné. Od publikace v roce 1981 znatelně zeslábla a poslední dekáda patřila megakorporacím. Novější výzkum ukazuje, že prémie drží hlavně u malých ZISKOVÝCH firem – čistý size index bez filtru kvality táhnou dolů ztrátové firmy.',
    },
    {
      q: 'Small cap, nebo emerging markets? Obojí je „rizikovější doplněk“.',
      a: 'Jsou to různá rizika: small cap = koncentrace na vyspělé trhy s vyšší citlivostí na ekonomický cyklus; EM = politické riziko a měny rozvojových zemí. Do portfolia se nevylučují, ale součet „kořenících“ pozic držte pod kontrolou.',
    },
    {
      q: 'Kolik small cap do portfolia?',
      a: 'Obvyklá praxe je 10–20 % akciové složky. Zajímavost: světový index s malými firmami (MSCI ACWI IMI) jich drží přirozeně ~11 % – kdo chce malé firmy „podle trhu“, stačí mu široký IMI index bez samostatného ETF.',
    },
    {
      q: 'Proč se vaše čísla liší od amerických studií?',
      a: 'Počítáme v korunách (včetně kurzu USD/CZK), po TER a na reálném ETF. A od roku 2000, což je pro small cap příznivý start (dot-com bublina byla v malých firmách menší než v technologických obrech).',
    },
  ],
  related: [
    ['/faktorove-etf', 'Přehled všech šesti faktorů'],
    ['/faktorove-etf/value', 'Value: faktor, který testuje trpělivost'],
    ['/faktorove-etf/momentum', 'Momentum: jediný faktor, který porazil index'],
  ],
};

export default function Page() {
  return <FactorDetail cfg={cfg} />;
}
