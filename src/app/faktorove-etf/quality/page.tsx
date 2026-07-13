import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import FactorDetail, { FactorConfig } from '@/components/design-preview/FactorDetail';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Quality faktor: kvalitní firmy v korunách – hloubková analýza',
  description:
    'Quality ETF drží ziskové firmy s nízkým dluhem. V korunách od roku 2000 vydělaly 5,8 % ročně (index 6,2 %) – teze „dražší index“ na dlouhém okně platí. Rozbor: kdy quality svítí, čtyři krize a rolling okna.',
  alternates: { canonical: '/faktorove-etf/quality' },
  openGraph: {
    title: 'Quality: dražší index, nebo lepší spaní?',
    description:
      'Ziskové firmy s nízkým dluhem od roku 2000 v Kč: 5,8 % ročně vs 6,2 % u indexu. Nejrychlejší návrat z COVID propadu, ale dlouhodobě index neporazil.',
    url: 'https://etfpruvodce.cz/faktorove-etf/quality',
    images: [ogImage({ title: 'Quality: dražší index, nebo lepší spaní?', eyebrow: 'Faktorová analýza · v korunách', stat: '5,8 % vs 6,2 %', statLabel: 'quality vs S&P 500 od roku 2000 (v Kč)' })],
    type: 'article',
  },
};

const cfg: FactorConfig = {
  slug: 'quality',
  indexCode: 'us_quality',
  ter: 0.0025,
  dataStart: '2000-01-01',
  shortName: 'Quality',
  badge: 'Faktorová analýza 5/6 · quality',
  h1: 'Quality: dražší index, nebo lepší spaní?',
  lead: (
    <>
      Ziskové firmy s nízkým dluhem a stabilními maržemi – kdo by je nechtěl? Quality je nejintuitivnější
      faktor, a proto je u něj nejtěžší poznat, co si vlastně kupujete navíc.{' '}
      <strong className="text-white">V korunách od roku 2000: 5,8 % ročně proti 6,2 % u S&P 500</strong> – skoro
      stejná jízda, o poplatek dražší. Na dlouhém okně to platí doslova.
    </>
  ),
  dataRange: 'Denní data 2000–2026, v Kč, po TER',
  howTitle: 'Jak quality funguje',
  howParagraphs: [
    <>
      Quality index (MSCI Sector Neutral Quality) vybírá firmy podle tří kritérií: <strong>vysoká návratnost
      kapitálu (ROE), nízké zadlužení a stabilita zisků</strong>. Sektorová neutralita zajišťuje, že nejde jen
      o sázku na technologie – index hledá „nejkvalitnější firmu v každém odvětví“.
    </>,
    <>
      Akademický základ je novější než u value a size: profitabilitu jako prémiový faktor popsal Robert
      Novy-Marx (2013) a stala se součástí pětifaktorového modelu Famy a Frenche. Intuice: trh systematicky
      podceňuje, jak dlouho si výjimečně ziskové firmy své marže udrží – kvalita „vydrží déle, než se čeká“.
    </>,
    <>
      V praxi quality září v nejistotě: v naší ročence vyhrál roky <strong>2019 a 2023</strong> – oba po
      turbulentních obdobích, kdy trh odměňoval rozvahy bez dluhů.
    </>,
  ],
  numbersTitle: 'Quality v korunách (leden 2000 – červenec 2026)',
  numbersDesc: 'Jednorázových 100 000 Kč, po poplatcích (TER 0,25 %), kurz den po dni. Před 2013 akademická řada napojená na ETF (viz poznámka níže).',
  statCards: [
    { big: '448 000 Kč', text: 'ze 100 000 Kč za 26 let (+5,8 % ročně). S&P 500 dal za stejné období 487 000 Kč (+6,2 %).' },
    { big: '+37,6 %', text: 'nejlepší rok (2013). V ročence faktorů quality vyhrál 2× z 12 let (2019, 2023).' },
    { big: '−67,9 %', text: 'nejhlubší propad (éra dot-com). I kvalitní firmy byly v roce 2000 součástí bubliny – „quality“ nechrání před drahým nákupem.' },
  ],
  dcaText: (
    <>
      <strong className="text-slate-900">S pravidelnými vklady:</strong> kdo od ledna 2000 vložil 100 000 Kč
      a přidával 5 000 Kč měsíčně, vložil celkem 1 690 000 Kč – a dnes by měl{' '}
      <strong className="text-slate-900">přibližně 8 300 000 Kč</strong>.
    </>
  ),
  rolling: [
    { yrs: '1 rok', avg: '+7,0 %', low: '−38,2 %', high: '+46,3 %', pos: '69 %' },
    { yrs: '5 let', avg: '+7,6 %', low: '−12,5 %', high: '+21,9 %', pos: '71 %' },
    { yrs: '10 let', avg: '+8,7 %', low: '−7,8 %', high: '+18,3 %', pos: '85 %' },
    { yrs: '15 let', avg: '+9,0 %', low: '+0,6 %', high: '+15,8 %', pos: '100 %' },
  ],
  rollingNote: (
    <>
      V éře ETF (od 2013) quality vykazoval nejstabilnější výnosy ze všech faktorů. Plné okno od 2000 ale
      připomíná, že <strong className="text-slate-700">ani kvalita nechrání před drahým nákupem</strong> –
      desetiletí po dot-com bublině umělo skončit −7,8 % ročně. Jistota přišla až na 15 letech.
    </>
  ),
  crises: [
    { name: 'Dot-com krach (2000–02)', drop: '−55 %', note: 'návrat 148 měsíců – „kvalitní“ tituly roku 2000 byly zároveň nejdražší; nejdelší čekání' },
    { name: 'Finanční krize 2008', drop: '−42 %', note: 'návrat 37 měsíců – mělčí propad než index (−50 %); tady se kvalita rozvah ukázala' },
    { name: 'COVID krach (2020)', drop: '−27 %', note: 'návrat 6 měsíců – nejrychlejší z faktorů; kvalita byla první, co trh po panice koupil zpět' },
    { name: 'Medvědí trh 2022', drop: '−19 %', note: 'návrat 15 měsíců – kvalitní firmy byly v roce 2021 drahé a růst sazeb je přecenil skoro jako celý trh' },
  ],
  riskTitle: 'Hlavní riziko: platíte faktor, dostáváte skoro index',
  riskDesc: 'Nejsubtilnější past ze všech faktorů.',
  riskBody: (
    <>
      Dnešní megakorporace <strong className="text-slate-900">jsou z velké části „quality“ samy o sobě</strong> –
      vysoké marže, málo dluhu, stabilní zisky. Quality index se s běžným indexem překrývá víc než ostatní
      faktory, takže rozdíl v jízdě je malý (v roce 2022 padal prakticky stejně: −19 vs −16 %). Platíte
      0,25 % TER místo 0,07 % za portfolio, které se od indexu liší jen mírně. Quality dává největší smysl
      jako <strong className="text-slate-900">stabilizátor kombinovaný s divočejším faktorem</strong> (momentum,
      small cap), ne jako samostatná náhrada indexu.
    </>
  ),
  etfs: [
    { name: 'iShares Edge MSCI World Quality Factor', isin: 'IE00BP3QZ601', ter: '0,25 %' },
  ],
  etfNote: (
    <>
      Pozn. k datům: od července 2013 běží řada na americkém quality ETF; období 2000–2013 je prodloužené
      akademickým denním portfoliem (Kenneth R. French Data Library, top 30 % provozní ziskovosti) napojeným na ETF
      a kalibrovaným na jeho chování v překryvu (korelace 0,98). Světová UCITS verze aplikuje metodiku na vyspělé
      trhy celého světa.
    </>
  ),
  faqs: [
    {
      q: 'Co přesně znamená „kvalitní firma“ v číslech?',
      a: 'Tři kritéria MSCI: vysoká návratnost vlastního kapitálu (ROE), nízký poměr dluhu k vlastnímu kapitálu a nízká variabilita růstu zisků za posledních 5 let. Žádné subjektivní hodnocení značky či managementu – jen tvrdá čísla z výkazů.',
    },
    {
      q: 'Není quality totéž co Buffettův přístup?',
      a: 'Blízko. Buffett hledá „skvělé firmy za rozumnou cenu“ – quality faktor je systematická polovina té věty (skvělé firmy). Chybí valuační filtr; proto se quality občas kombinuje s value do „quality at reasonable price“ strategií.',
    },
    {
      q: 'Kdy quality porazí index?',
      a: 'Historicky v nejistotě a po šoku: 2019 (po sazbovém škobrtnutí), 2023 (po roce 2022). Naopak zaostává v euforických fázích, kdy trh táhnou spekulativnější tituly. Je to faktor „pomalu, ale jistě“.',
    },
    {
      q: 'Kolik quality do portfolia?',
      a: 'Kvůli velkému překryvu s indexem dává smysl buď vůbec (index stačí), nebo jako větší stabilní jádro (20–30 % akciové složky) doplněné menším podílem divočejšího faktoru. Malý 5% podíl nic nezmění – jen přidá poplatek.',
    },
    {
      q: 'Proč se vaše čísla liší od amerických materiálů?',
      a: 'Počítáme v korunách (včetně kurzu USD/CZK), po TER a na reálném ETF; před rokem 2013 na akademické řadě napojené na ETF. Americké materiály bývají v dolarech a bez poplatků.',
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
