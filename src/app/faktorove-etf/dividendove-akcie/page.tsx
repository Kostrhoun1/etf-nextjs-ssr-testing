import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import FactorDetail, { FactorConfig } from '@/components/design-preview/FactorDetail';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Dividendové ETF: psychologie vs. matematika – analýza v korunách',
  description:
    'Dividendové akcie jsou nejoblíbenější „faktor“ českých investorů – a matematicky nejslabší. Od 2006 v Kč: 8,9 % ročně vs 10,7 % u S&P 500. Ale v roce 2022 jako jediné vydělaly. Včetně českého daňového pohledu na dividendy.',
  alternates: { canonical: '/faktorove-etf/dividendove-akcie' },
  openGraph: {
    title: 'Dividendové akcie: psychologie vs. matematika',
    description:
      'Od 2006 zaostaly za indexem o 1,8 p. b. ročně – ale v roce 2022 jako jediné vydělaly. A české daně z dividend ten rozdíl ještě prohlubují.',
    url: 'https://etfpruvodce.cz/faktorove-etf/dividendove-akcie',
    images: [ogImage({ title: 'Dividendové akcie: psychologie vs. matematika', eyebrow: 'Faktorová analýza · v korunách', stat: '+2,3 %', statLabel: 'jediný kladný faktor v roce 2022' })],
    type: 'article',
  },
};

const cfg: FactorConfig = {
  slug: 'dividendove-akcie',
  indexCode: 'us_dividend',
  ter: 0.0029,
  dataStart: '2006-11-16',
  shortName: 'Dividendy',
  badge: 'Faktorová analýza 6/6 · dividendy',
  h1: 'Dividendové akcie: psychologie vs. matematika',
  lead: (
    <>
      Pravidelný příjem z dividend je psychologicky nejpřitažlivější investiční myšlenka – a matematicky
      jedna z nejslabších. <strong className="text-white">V korunách od 2006: 8,9 % ročně proti 10,7 % u
      S&P 500.</strong> Jenže pak přišel rok 2022, kdy dividendové akcie jako jediné vydělaly. A pro českého
      investora je tu ještě daňový háček, o kterém se nemluví.
    </>
  ),
  dataRange: 'Denní data 2006–2026, v Kč, po TER',
  howTitle: 'Jak dividendový „faktor“ funguje',
  howParagraphs: [
    <>
      Dividendové indexy (u nás nejběžněji FTSE All-World High Dividend Yield) drží firmy s{' '}
      <strong>nadprůměrným dividendovým výnosem</strong> – typicky banky, energetiku, telekomunikace, spotřební
      zboží. Ze světového indexu tak vypadne většina technologií, které dividendy neplatí.
    </>,
    <>
      Tady je důležitá poctivost: <strong>dividenda sama o sobě není výnos navíc</strong>. V den výplaty klesne
      cena akcie přesně o vyplacenou částku – peníze se jen přesunou z ceny do hotovosti. Rozhoduje celkový
      výnos (růst ceny + dividendy). Akademicky dividendový výnos není samostatný prémiový faktor; funguje spíš
      jako nedokonalá kombinace value (levné firmy) a nižší volatility.
    </>,
    <>
      Proč je tedy tak populární? Psychologie: pravidelný příjem se snáz drží v propadu („aspoň mi chodí
      dividendy“) a připomíná rentu. To není málo – strategie, kterou udržíte, porazí strategii, kterou
      opustíte.
    </>,
  ],
  numbersTitle: 'Dividendové akcie v korunách (listopad 2006 – červenec 2026)',
  numbersDesc: 'Jednorázových 100 000 Kč, po poplatcích (TER 0,29 %), kurz den po dni, dividendy reinvestované.',
  statCards: [
    { big: '532 000 Kč', text: 'ze 100 000 Kč za 20 let (+8,9 % ročně). S&P 500 dal za stejné období 739 000 Kč (+10,7 %) – rozdíl 1,8 p. b. ročně.' },
    { big: '+2,3 %', text: 'rok 2022 – jediný kladný faktor v roce, kdy vše ostatní padalo. Návrat z propadu za 2 měsíce.' },
    { big: '−55,3 %', text: 'nejhlubší propad (finanční krize 2008 – dividendové indexy byly plné bank). Návrat trval 62 měsíců.' },
  ],
  dcaText: (
    <>
      <strong className="text-slate-900">S pravidelnými vklady:</strong> kdo od listopadu 2006 vložil 100 000 Kč
      a přidával 5 000 Kč měsíčně, vložil celkem 1 280 000 Kč – a dnes by měl{' '}
      <strong className="text-slate-900">přibližně 4 866 000 Kč</strong>.
    </>
  ),
  rolling: [
    { yrs: '1 rok', avg: '+10,2 %', low: '−41,8 %', high: '+43,0 %', pos: '75 %' },
    { yrs: '5 let', avg: '+12,1 %', low: '−2,3 %', high: '+23,5 %', pos: '95 %' },
    { yrs: '10 let', avg: '+11,9 %', low: '+7,6 %', high: '+16,5 %', pos: '100 %' },
    { yrs: '15 let', avg: '+11,8 %', low: '+8,2 %', high: '+14,5 %', pos: '100 %' },
  ],
  rollingNote: (
    <>
      Dlouhodobá stabilita je slušná: desetiletá okna nikdy pod +7,6 % ročně. Rozdíl proti indexu dělá hlavně
      složení – bez technologií se v posledních dekádách vyhrát nedalo.
    </>
  ),
  crises: [
    { name: 'Finanční krize 2008', drop: '−52 %', note: 'návrat 38 měsíců – „bezpečné dividendovky“ byly plné bank, epicentra krize' },
    { name: 'COVID krach (2020)', drop: '−28 %', note: 'návrat 12 měsíců – řada firem dividendy seškrtala přesně ve chvíli, kdy je investoři čekali' },
    { name: 'Medvědí trh 2022', drop: '−11 %', note: 'návrat 2 měsíce – hvězdný rok: energetika a banky vydělávaly, zatímco technologie padaly' },
  ],
  riskTitle: 'Český daňový háček: dividendy se daní hned',
  riskDesc: 'Unikátní pohled pro investora v ČR – tohle v zahraničních srovnáních nenajdete.',
  riskBody: (
    <>
      Dividendy z irských ETF se v Česku <strong className="text-slate-900">daní 15 % v roce výplaty</strong> –
      bez ohledu na tříletý časový test, který jinak dělá ETF daňově výhodné. U distribuční verze (VHYL) tak
      každý rok odevzdáte část výnosu státu, zatímco akumulační světový index nezdaníte vůbec (do prodeje,
      a po 3 letech často vůbec). Náš backtest daně nepočítá – reálný rozdíl proti indexu je pro českého
      investora <strong className="text-slate-900">ještě větší než uvedených 1,8 p. b.</strong> Pokud dividendové
      ETF, zvažte akumulační variantu – psychologický efekt „chodí mi příjem“ tím ale ztratíte, což byl často
      hlavní důvod nákupu.
    </>
  ),
  etfs: [
    { name: 'Vanguard FTSE All-World High Dividend Yield (Dist)', isin: 'IE00B8GKDB10', ter: '0,29 %' },
    { name: 'Vanguard FTSE All-World High Dividend Yield (Acc)', isin: 'IE00BK5BR626', ter: '0,29 %' },
  ],
  etfNote: (
    <>
      Pozn.: backtest výše běží na americké dividendové řadě (od 2006, dividendy reinvestované); VHYL drží
      vysokodividendové firmy celého světa. Acc verze dividendy reinvestuje uvnitř fondu – daňově výhodnější
      pro ČR.
    </>
  ),
  faqs: [
    {
      q: 'Chci žít z dividend. Není to celý smysl investování?',
      a: 'Renta z portfolia je skvělý cíl – ale matematicky je jedno, jestli ji tvoří dividendy, nebo prodej části akumulačního ETF (po 3 letech navíc bez daně, zatímco dividendy zdaníte 15 % vždy). „Dividendová renta“ je pohodlnější pocitově, „prodejová renta“ je v ČR efektivnější daňově.',
    },
    {
      q: 'Nejsou dividendové firmy bezpečnější?',
      a: 'Ne automaticky. V roce 2008 spadly dividendové indexy hlouběji než trh (−52 %), protože byly plné bank. Vysoký dividendový výnos je někdy varování – „dividendová past“, kdy cena spadla, protože byznys upadá, a škrt dividendy teprve přijde.',
    },
    {
      q: 'Proč tedy dividendovky v roce 2022 vydělaly?',
      a: 'Rostoucí sazby přecenily růstové akcie (vzdálené zisky ztratily hodnotu), zatímco energetika a banky – páteř dividendových indexů – z vyšších sazeb a cen energií profitovaly. Je to ilustrace, k čemu dividendový faktor reálně je: diverzifikace stylu, ne vyšší výnos.',
    },
    {
      q: 'Distribuční, nebo akumulační verze?',
      a: 'Pro fázi budování majetku v ČR jednoznačně akumulační (žádná průběžná daň, automatická reinvestice). Distribuční dává smysl až v rentě – a i tam zvažte, zda není efektivnější prodávat akumulační po časovém testu.',
    },
    {
      q: 'Jak vysoký dividendový výnos je podezřelý?',
      a: 'Orientačně: 2–4 % je zdravé pásmo, nad 6–7 % často signál problému (trh čeká škrt dividendy nebo úpadek byznysu). Indexové dividendové ETF tohle riziko rozkládají, ale nezruší.',
    },
  ],
  related: [
    ['/faktorove-etf', 'Přehled všech šesti faktorů'],
    ['/dane-z-etf', 'Daně z ETF v Česku: kdy platíte a kdy ne'],
    ['/akumulacni-vs-distribucni-etf', 'Akumulační vs. distribuční ETF'],
  ],
};

export default function Page() {
  return <FactorDetail cfg={cfg} />;
}
