import { Metadata } from 'next';
import { ogImage } from '@/lib/ogImage';
import FactorDetail, { FactorConfig } from '@/components/design-preview/FactorDetail';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Minimální volatilita: klidnější jízda za 4 % ročně – analýza v Kč',
  description:
    'Min volatility ETF slibují menší kolísání za mírně nižší výnos. V korunách od 2011: výnos 12,6 % vs 16,4 % u S&P 500 – a překvapení: kurz koruny výhodu klidnější jízdy z velké části smazal.',
  alternates: { canonical: '/faktorove-etf/minimalni-volatilita' },
  openGraph: {
    title: 'Minimální volatilita: pojistka, ne motor',
    description:
      'Slib klidnější jízdy v korunách tak úplně neplatí – kurz přidává volatilitu všem. Rozbor od 2011: cena pojistky ~4 p. b. ročně.',
    url: 'https://etfpruvodce.cz/faktorove-etf/minimalni-volatilita',
    images: [ogImage({ title: 'Minimální volatilita: pojistka, ne motor', eyebrow: 'Faktorová analýza · v korunách', stat: '−3,8 p. b. ročně', statLabel: 'cena klidnější jízdy vs S&P 500 (od 2011)' })],
    type: 'article',
  },
};

const cfg: FactorConfig = {
  slug: 'minimalni-volatilita',
  indexCode: 'us_min_vol',
  ter: 0.003,
  dataStart: '2011-10-20',
  shortName: 'Min. volatilita',
  badge: 'Faktorová analýza 4/6 · minimální volatilita',
  h1: 'Minimální volatilita: pojistka, ne motor',
  lead: (
    <>
      Akcie s nejmenším kolísáním historicky vydělávaly skoro jako trh – s výrazně klidnější jízdou. Tak zní
      slib. V korunách má ale háček: <strong className="text-white">kurz koruny přidává volatilitu všem
      akciím stejně</strong>, takže výhoda „min vol“ se českému investorovi z velké části rozpouští – a stála
      skoro 4 procentní body výnosu ročně.
    </>
  ),
  dataRange: 'Denní data 2011–2026, v Kč, po TER',
  howTitle: 'Jak minimální volatilita funguje',
  howParagraphs: [
    <>
      Index (MSCI Minimum Volatility) skládá portfolio tak, aby <strong>celkové kolísání bylo co nejmenší</strong> –
      drží stabilní byznysy typu zdravotnictví, spotřební zboží, utility a pojišťovny, a hlídá i vzájemné
      korelace. Výsledkem je „nudná“ verze akciového trhu.
    </>,
    <>
      Proč by to mělo fungovat? Tzv. <strong>low-volatility anomálie</strong>: podle teorie by rizikovější akcie
      měly nést vyšší výnos, ale desítky let dat (Haugen už v 70. letech, později Ang a kol.) ukazují opak –
      nejdivočejší akcie dlouhodobě zaostávají. Vysvětlení je behaviorální: investoři přeplácejí „loterijní“
      tituly s příběhem a nudné stabilní firmy nechávají levné.
    </>,
  ],
  numbersTitle: 'Min. volatilita v korunách (říjen 2011 – červenec 2026)',
  numbersDesc: 'Jednorázových 100 000 Kč, po poplatcích (TER 0,30 %), kurz den po dni.',
  statCards: [
    { big: '572 000 Kč', text: 'ze 100 000 Kč za 15 let (+12,6 % ročně). S&P 500 dal za stejné období 936 000 Kč (+16,4 %) – pojistka stála ~3,8 p. b. ročně.' },
    { big: '−8,7 %', text: 'nejhorší kalendářní rok (2025). Roční kolísavost ±16 % vs ±18 % u indexu – v Kč je rozdíl menší, než slibují dolarové tabulky.' },
    { big: '−25,9 %', text: 'nejhlubší propad (COVID 2020) – jen o kousek mělčí než index (−27 %). Kurz v krizi hýbe vším.' },
  ],
  dcaText: (
    <>
      <strong className="text-slate-900">S pravidelnými vklady:</strong> kdo od října 2011 vložil 100 000 Kč
      a přidával 5 000 Kč měsíčně, vložil celkem 985 000 Kč – a dnes by měl{' '}
      <strong className="text-slate-900">přibližně 2 465 000 Kč</strong>.
    </>
  ),
  rolling: [
    { yrs: '1 rok', avg: '+12,4 %', low: '−11,9 %', high: '+49,6 %', pos: '80 %' },
    { yrs: '5 let', avg: '+11,3 %', low: '+6,3 %', high: '+21,2 %', pos: '100 %' },
    { yrs: '10 let', avg: '+11,2 %', low: '+7,8 %', high: '+16,0 %', pos: '100 %' },
  ],
  rollingNote: (
    <>
      Sliby drží v jednom: <strong className="text-slate-700">žádné pětileté okno neskončilo hůř než +6,3 %
      ročně</strong> – stabilita výnosu je opravdu vyšší. Jen za ni platíte znatelně nižším stropem.
    </>
  ),
  crises: [
    { name: 'COVID krach (2020)', drop: '−26 %', note: 'návrat 15 měsíců – déle než index (defenzivní tituly se zvedaly pomaleji než technologie)' },
    { name: 'Medvědí trh 2022', drop: '−12 %', note: 'návrat 1 měsíc – tady min vol zazářil: nejrychlejší zotavení ze všech faktorů' },
  ],
  riskTitle: 'Hlavní zjištění: v korunách se výhoda rozpouští v kurzu',
  riskDesc: 'Unikátní pohled, který v dolarových materiálech nenajdete.',
  riskBody: (
    <>
      V dolarech měl min vol propad znatelně mělčí než trh. <strong className="text-slate-900">V korunách byl
      rozdíl −25,9 % vs −27 % – skoro žádný.</strong> Důvod: kurz USD/CZK kolísá bez ohledu na to, jak klidné
      akcie držíte, a v krizích hýbe celým portfoliem. Pro českého investora je tedy měnové riziko často větší
      zdroj kolísání než výběr akcií – a „pojistka“ min vol řeší jen menší část problému za plnou cenu
      (~4 p. b. výnosu ročně + vyšší TER). Kdo chce skutečně klidnější jízdu v Kč, řeší ji spíš poměrem
      akcie/dluhopisy než faktorem.
    </>
  ),
  etfs: [
    { name: 'iShares Edge MSCI World Minimum Volatility', isin: 'IE00B8FHGS14', ter: '0,30 %' },
  ],
  etfNote: (
    <>
      Pozn.: backtest výše běží na americké řadě (od 2011); světová UCITS verze drží defenzivní tituly z celého
      vyspělého světa. Existuje i EUR-hedged varianta, která měnové kolísání tlumí – za vyšší poplatek.
    </>
  ),
  faqs: [
    {
      q: 'Pro koho má min vol smysl?',
      a: 'Pro investora, který by jinak v propadu panicky prodal – mělčí a kratší propady (hlavně v roce 2022) se snáší lépe. Matematicky ale bývá efektivnější snížit akciovou složku a doplnit dluhopisy: podobné riziko, nižší poplatky, srozumitelnější chování.',
    },
    {
      q: 'Proč min vol zaostal o tolik (12,6 vs 16,4 %)?',
      a: 'Období 2011–2026 byl výjimečný růstový trh tažený technologiemi – přesně tituly, které min vol z definice drží málo. V průměrnějším či klesajícím období by rozdíl byl menší; low-vol anomálie historicky svítí hlavně v krizích a nudných dekádách.',
    },
    {
      q: 'Chrání min vol v každé krizi?',
      a: 'Ne stejně. V roce 2022 (růst sazeb, pád technologií) fungoval skvěle – propad −12 % s návratem za měsíc. V COVID krachu 2020 padal skoro jako trh, protože panika prodávala všechno. Je to tlumič průměrných špatných období, ne neprůstřelná vesta.',
    },
    {
      q: 'Je lepší min vol, nebo dividendové akcie? Obojí je „defenziva“.',
      a: 'Min vol je čistší defenziva (vybírá podle kolísání, ne podle dividendy) a je daňově efektivnější v akumulační verzi. Dividendové ETF zase v roce 2022 jako jediné vydělaly. Pokud defenzivu, min vol je systematičtější volba – ale viz hlavní zjištění o kurzu.',
    },
    {
      q: 'Proč se vaše čísla liší od dolarových materiálů?',
      a: 'Právě o tom je celá tato stránka: v korunách kurz USD/CZK přidává kolísání všem akciovým ETF podobně, takže relativní výhoda min vol se zmenšuje. Počítáme po TER, kurz den po dni.',
    },
  ],
  related: [
    ['/faktorove-etf', 'Přehled všech šesti faktorů'],
    ['/faktorove-etf/dividendove-akcie', 'Dividendové akcie: psychologie vs. matematika'],
    ['/menove-riziko-etf', 'Měnové riziko u ETF: potřebujete hedged fond?'],
  ],
};

export default function Page() {
  return <FactorDetail cfg={cfg} />;
}
