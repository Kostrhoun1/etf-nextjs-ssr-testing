import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import FactorDetail, { FactorConfig } from '@/components/design-preview/FactorDetail';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Quality faktor: kvalitní firmy v korunách – hloubková analýza',
  description:
    'Quality ETF drží ziskové firmy s nízkým dluhem. V korunách od 2013 vydělaly 14,0 % ročně (index 14,7 %) a z COVID krachu se vrátily za 6 měsíců. Rozbor: kdy quality svítí, kdy je to jen dražší index – a rolling okna.',
  alternates: { canonical: '/faktorove-etf/quality' },
  openGraph: {
    title: 'Quality: dražší index, nebo lepší spaní?',
    description:
      'Ziskové firmy s nízkým dluhem od 2013 v Kč: 14,0 % ročně, návrat z COVID propadu za 6 měsíců, 10leté okno nikdy pod +10,5 %.',
    url: 'https://etfpruvodce.cz/faktorove-etf/quality',
    images: [ogImage({ title: 'Quality: dražší index, nebo lepší spaní?', eyebrow: 'Faktorová analýza · v korunách', stat: '6 měsíců', statLabel: 'návrat z COVID propadu (nejrychlejší z faktorů)' })],
    type: 'article',
  },
};

const cfg: FactorConfig = {
  slug: 'quality',
  badge: 'Faktorová analýza 5/6 · quality',
  h1: 'Quality: dražší index, nebo lepší spaní?',
  lead: (
    <>
      Ziskové firmy s nízkým dluhem a stabilními maržemi – kdo by je nechtěl? Quality je nejintuitivnější
      faktor, a proto je u něj nejtěžší poznat, co si vlastně kupujete navíc.{' '}
      <strong className="text-white">V korunách od 2013: 14,0 % ročně proti 14,7 % u S&P 500</strong> – skoro
      stejná jízda, o poplatek dražší. Skoro.
    </>
  ),
  dataRange: 'Denní data 2013–2026, v Kč, po TER',
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
  numbersTitle: 'Quality v korunách (červenec 2013 – červenec 2026)',
  numbersDesc: 'Jednorázových 100 000 Kč, po poplatcích (TER 0,25 %), kurz den po dni.',
  statCards: [
    { big: '548 000 Kč', text: 'ze 100 000 Kč za 13 let (+14,0 % ročně). S&P 500 dal za stejné období 592 000 Kč (+14,7 %).' },
    { big: '+34,5 %', text: 'nejlepší rok (2019). V ročence faktorů quality vyhrál 2× z 12 let (2019, 2023).' },
    { big: '6 měsíců', text: 'návrat z COVID propadu (−27 %) – nejrychlejší zotavení ze všech faktorů. Kvalitní rozvahy panika neláme.' },
  ],
  dcaText: (
    <>
      <strong className="text-slate-900">S pravidelnými vklady:</strong> kdo od července 2013 vložil 100 000 Kč
      a přidával 5 000 Kč měsíčně, vložil celkem 880 000 Kč – a dnes by měl{' '}
      <strong className="text-slate-900">přibližně 2 468 000 Kč</strong>.
    </>
  ),
  rolling: [
    { yrs: '1 rok', avg: '+14,3 %', low: '−18,3 %', high: '+46,3 %', pos: '84 %' },
    { yrs: '5 let', avg: '+12,5 %', low: '+6,0 %', high: '+17,3 %', pos: '100 %' },
    { yrs: '10 let', avg: '+12,6 %', low: '+10,5 %', high: '+14,6 %', pos: '100 %' },
  ],
  rollingNote: (
    <>
      Pozoruhodná stabilita: <strong className="text-slate-700">žádné desetileté okno neskončilo hůř než
      +10,5 % ročně</strong> – nejužší rozpětí ze všech faktorů. Quality nedělá extrémy ani nahoru, ani dolů.
    </>
  ),
  crises: [
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
      Pozn.: backtest výše běží na americké řadě (od 2013); světová UCITS verze aplikuje stejnou metodiku na
      vyspělé trhy celého světa.
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
      a: 'Počítáme v korunách (včetně kurzu USD/CZK), po TER a na reálném ETF. Data od 2013 – kratší okno než u value/small cap, protože quality ETF vznikly později.',
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
