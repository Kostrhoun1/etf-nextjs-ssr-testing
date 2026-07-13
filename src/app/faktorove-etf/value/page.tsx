import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import FactorDetail, { FactorConfig } from '@/components/design-preview/FactorDetail';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Value faktor: 13 let čekání na nové maximum – hloubková analýza',
  description:
    'Hodnotové akcie jsou nejstarší faktor s nejsilnější akademickou evidencí – a nejdelším čekáním. V korunách od roku 2000: výnos, propad −64 %, rolling okna, krize a proč value vyžaduje trpělivost, kterou většina investorů nemá.',
  alternates: { canonical: '/faktorove-etf/value' },
  openGraph: {
    title: 'Value: faktor, který testuje trpělivost',
    description:
      'Po dot-com bublině value drtil trh, pak 15 let zaostával. V korunách od 2000 kompletní rozbor – včetně 13 let čekání na nové maximum.',
    url: 'https://etfpruvodce.cz/faktorove-etf/value',
    images: [ogImage({ title: 'Value: faktor, který testuje trpělivost', eyebrow: 'Faktorová analýza · v korunách', stat: '13 let', statLabel: 'trvalo čekání na nové maximum' })],
    type: 'article',
  },
};

const cfg: FactorConfig = {
  slug: 'value',
  indexCode: 'us_value',
  ter: 0.0025,
  dataStart: '2000-05-26',
  shortName: 'Value',
  badge: 'Faktorová analýza 2/6 · value',
  h1: 'Value: faktor, který testuje trpělivost',
  lead: (
    <>
      Kupovat levné, nemilované akcie je nejstarší recept na trhu – od Grahama přes Buffetta po akademiky.
      Jenže data v korunách ukazují i druhou stranu: <strong className="text-white">po dot-com krachu value
      drtil trh, pak 15 let zaostával</strong> – a na nové maximum se čekalo přes 13 let. Tady je celý příběh.
    </>
  ),
  dataRange: 'Denní data 2000–2026, v Kč, po TER',
  howTitle: 'Jak value funguje',
  howParagraphs: [
    <>
      Value index vybírá akcie, které jsou <strong>levné vůči svým fundamentům</strong> – účetní hodnotě,
      ziskům a cash flow (metodika MSCI kombinuje ukazatele P/B, forward P/E a EV/CFO). Kupujete tedy firmy,
      kterým trh zrovna nevěří: banky po krizi, energetiku v éře technologií, průmysl v recesi.
    </>,
    <>
      Akademicky je value prémie popsaná nejdéle ze všech – Fama a French z ní v roce 1992 udělali pilíř svého
      slavného trojfaktorového modelu. Vysvětlení jsou dvě a nevylučují se: <strong>riziková</strong> (levné firmy
      jsou levné právem – jsou křehčí, a vyšší výnos je odměna za riziko) a <strong>behaviorální</strong>
      (investoři přehánějí pesimismus u nudných firem a přeplácejí růstové příběhy).
    </>,
    <>
      Prakticky to znamená: value se daří, když se trh vrací k rozumu po přehnaném optimismu (2000–2007),
      a zaostává, když vede úzká skupina růstových hvězd (2010–2021).
    </>,
  ],
  numbersTitle: 'Value v korunách (květen 2000 – červenec 2026)',
  numbersDesc: 'Jednorázových 100 000 Kč, po poplatcích (TER 0,25 %), kurz den po dni. Pozor: start = vrchol dot-com bubliny.',
  statCards: [
    { big: '398 000 Kč', text: 'ze 100 000 Kč za 26 let (+5,4 % ročně). S&P 500 dal za stejné období 419 000 Kč (+5,6 %) – rozdíl se za čtvrt století prakticky smazal.' },
    { big: '+37,5 %', text: 'nejlepší rok (2013). V letech 2000–2007 value porážel růstové akcie rok za rokem.' },
    { big: '−64,1 %', text: 'nejhlubší propad (od října 2000 přes finanční krizi). Návrat na vrchol trval 158 měsíců – přes 13 let.' },
  ],
  dcaText: (
    <>
      <strong className="text-slate-900">S pravidelnými vklady:</strong> kdo od května 2000 vložil 100 000 Kč
      a přidával 5 000 Kč měsíčně, vložil celkem 1 670 000 Kč – a dnes by měl{' '}
      <strong className="text-slate-900">přibližně 6 290 000 Kč</strong>. Pravidelné nákupy v levných letech
      udělaly z průměrného faktoru slušný výsledek.
    </>
  ),
  rolling: [
    { yrs: '1 rok', avg: '+6,6 %', low: '−42,3 %', high: '+40,2 %', pos: '69 %' },
    { yrs: '5 let', avg: '+6,5 %', low: '−10,2 %', high: '+22,7 %', pos: '71 %' },
    { yrs: '10 let', avg: '+7,3 %', low: '−6,0 %', high: '+15,5 %', pos: '87 %' },
    { yrs: '15 let', avg: '+7,6 %', low: '+1,8 %', high: '+13,6 %', pos: '100 %' },
  ],
  rollingNote: (
    <>
      Čtěte pozorně: <strong className="text-slate-700">i desetileté okno umělo skončit v mínusu</strong> (−6,0 %
      ročně – dekáda po roce 2000). Jistotu kladného výsledku daly až horizonty 15 let. To je reálná cena value
      prémie: funguje, ale měří se v dekádách.
    </>
  ),
  crises: [
    { name: 'Finanční krize 2008', drop: '−55 %', note: 'návrat 47 měsíců – banky, páteř value indexů, byly epicentrem krize' },
    { name: 'COVID krach (2020)', drop: '−32 %', note: 'návrat 11 měsíců – „stará ekonomika“ padala hlouběji než technologie' },
    { name: 'Medvědí trh 2022', drop: '−12 %', note: 'návrat 2 měsíce – nejmělčí propad ze všech akciových faktorů; levné akcie neměly z čeho padat' },
  ],
  riskTitle: 'Hlavní riziko: čekání, které málokdo vydrží',
  riskDesc: 'Value neumírá potichu – umírá dlouho a veřejně.',
  riskBody: (
    <>
      <strong className="text-slate-900">13 let bez nového maxima</strong> (2000–2013) a poté další dekáda
      zaostávání za růstovými akciemi. Kdo value koupil kvůli akademickým grafům, prodal ho v roce 2019
      s pocitem, že „faktor je mrtvý“ – těsně před nejlepšími value roky 2021–2022. Přesně takhle se prémie
      „vyplácí“: přechází od netrpělivých k trpělivým. Pokud nesnesete roky podprůměru, value vám vydělá
      jen nervy a poplatky.
    </>
  ),
  etfs: [
    { name: 'iShares Edge MSCI World Value Factor', isin: 'IE00BP3QZB59', ter: '0,25 %' },
  ],
  etfNote: (
    <>
      Pozn.: backtest výše běží na nejdelší dostupné řadě (americký value od 2000); světová UCITS verze má
      mírně odlišnou metodiku a kratší historii.
    </>
  ),
  faqs: [
    {
      q: 'Není value po dvou slabých dekádách mrtvý?',
      a: 'To se tvrdilo i v roce 1999 – těsně před sedmi lety, kdy value drtil trh. Prémie historicky přichází ve vlnách po přehnaně optimistických obdobích. Nikdo ale neví kdy; sázka na value je sázka na návrat trhu k fundamentům v neznámém termínu.',
    },
    {
      q: 'Proč value zaostával právě v letech 2010–2021?',
      a: 'Éra nulových sazeb přála růstovým firmám (budoucí zisky měly „zadarmo“ vysokou současnou hodnotu) a technologickým platformám, které value indexy z definice nedrží. Jakmile v roce 2022 sazby vzrostly, value měl nejmělčí propad ze všech faktorů.',
    },
    {
      q: 'Je Buffett value investor? Mám místo ETF kupovat jeho akcie?',
      a: 'Buffett vyrostl z value tradice, ale dnes kombinuje value s kvalitou („skvělá firma za rozumnou cenu“). Pro běžného investora je systematické value ETF levnější a diverzifikovanější způsob, jak na stejný princip vsadit – bez rizika jedné osoby.',
    },
    {
      q: 'Kolik value do portfolia?',
      a: 'Pokud vůbec, tak jako doplněk širokého indexu – běžně 10–20 % akciové složky. A jen pokud jste ochotni ho držet i dekádu podprůměru; jinak je poctivější zůstat u indexu.',
    },
    {
      q: 'Proč se vaše čísla liší od amerických studií?',
      a: 'Počítáme v korunách (včetně pohybu kurzu USD/CZK), po TER a na reálném ETF. Akademické studie měří teoretická portfolia bez poplatků, obvykle v dolarech – a často zahrnují i malé value firmy, kde byla prémie historicky nejsilnější.',
    },
  ],
  related: [
    ['/faktorove-etf', 'Přehled všech šesti faktorů'],
    ['/faktorove-etf/momentum', 'Momentum: jediný faktor, který porazil index'],
    ['/buffettovo-portfolio', 'Buffettovo portfolio 90/10 v korunách'],
  ],
};

export default function Page() {
  return <FactorDetail cfg={cfg} />;
}
