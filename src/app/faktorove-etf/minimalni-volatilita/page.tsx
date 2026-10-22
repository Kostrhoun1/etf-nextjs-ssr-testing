import FactorDetail, { faktorMetadata, type FactorConfig, type Kontext } from '@/components/design-preview/FactorDetail';
import { pct, pctBez, pb, den, ter } from '@/lib/faktory/format';
import { titulek } from '@/lib/seoTitulek';

// Kolo 8 (22. 10. 2026): žádné číslo natvrdo – vše z dat přes Kontext (src/lib/faktory/vypocet.ts).
// Dřív tvrzení „v dolarech měl min vol propad znatelně mělčí než trh, v korunách skoro žádný rozdíl“ – nezávislý
// přepočet (USMV/SPY, Yahoo × ČNB) ukázal, že covidový propad byl skoro stejný v USD i v Kč. V Kč se zmenšuje
// hlavně rozdíl v KOLÍSAVOSTI – to stránka teď ukazuje z dat (běh enginu v USD i v Kč).
export const revalidate = 86400;

const covid = (k: Kontext) => k.f.krize.find((c) => c.key === 'covid') ?? null;
const b2022 = (k: Kontext) => k.f.krize.find((c) => c.key === 'bear2022') ?? null;

const cfg: FactorConfig = {
  slug: 'minimalni-volatilita',
  badge: 'Faktorová analýza 4/6 · minimální volatilita',
  h1: () => 'Minimální volatilita: pojistka, ne motor',
  meta: (k) => {
    const h = 'Minimální volatilita: pojistka, ne motor';
    if (!k) return { title: titulek('Minimální volatilita: klidnější jízda v korunách (analýza)'), description: 'ETF s minimální volatilitou slibují menší kolísání za nižší výnos. Analýza v korunách na denních datech – živě z našeho backtestu.', ogTitle: h, ogDescription: 'Minimální volatilita v korunách na denních datech.' };
    const f = k.f;
    const rozdil = f.cagr - f.spCagr;
    return {
      title: titulek(`Minimální volatilita: cena klidu ${pb(rozdil)} ročně (analýza v Kč)`),
      description: `ETF s minimální volatilitou v Kč od ${den(f.od)}: ${pct(f.cagr)} ročně proti ${pct(f.spCagr)} u S&P 500, kolísavost ${pctBez(f.volatilita)} vs. ${pctBez(f.spVolatilita)}.`,
      ogTitle: h,
      ogDescription: `Od ${den(f.od)} v korunách: o ${pb(rozdil)} ročně ${rozdil < 0 ? 'méně' : 'více'} než S&P 500 za kolísavost ${pctBez(f.volatilita)} místo ${pctBez(f.spVolatilita)} (data k ${den(f.do)}).`,
      stat: `${rozdil < 0 ? '−' : '+'}${pb(rozdil)} ročně`,
      statLabel: `min. volatilita vs S&P 500 od ${den(f.od)}`,
    };
  },
  lead: (k) => (
    <>
      Akcie s nejmenším kolísáním historicky vydělávaly skoro jako trh – s klidnější jízdou. Tak zní slib.
      V korunách od {den(k.f.od)}: <strong className="text-white">{pct(k.f.cagr)} ročně proti {pct(k.f.spCagr)} u S&P 500</strong>,
      kolísavost {pctBez(k.f.volatilita)} proti {pctBez(k.f.spVolatilita)}.
      {k.f.usd && <> V dolarech byl rozdíl v kolísavosti {pctBez(k.f.usd.volatilita)} vs. {pctBez(k.f.usd.spVolatilita)} – kurz koruny přidává kolísání všem akciím, takže část výhody se českému investorovi rozpouští.</>}
    </>
  ),
  howTitle: 'Jak minimální volatilita funguje',
  howParagraphs: [
    <>
      Index (MSCI USA Minimum Volatility) skládá portfolio tak, aby <strong>celkové kolísání bylo co nejmenší</strong> –
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
  krizePoznamky: {
    covid: 'Panika prodávala všechno – defenzivní tituly se pak zvedaly pomaleji než technologie.',
    bear2022: 'Růst sazeb srazil hlavně drahé technologie, které min vol skoro nedrží.',
  },
  riskTitle: 'Hlavní zjištění: v korunách se část výhody rozpouští v kurzu',
  riskDesc: 'Pohled, který v dolarových materiálech nenajdete.',
  riskBody: (k) => {
    const c = covid(k);
    return (
      <>
        {k.f.usd && (
          <>
            V dolarech měl min vol kolísavost <strong className="text-slate-900">{pctBez(k.f.usd.volatilita)} proti {pctBez(k.f.usd.spVolatilita)}</strong> u S&P 500,
            v korunách {pctBez(k.f.volatilita)} proti {pctBez(k.f.spVolatilita)}.{' '}
          </>
        )}
        Kurz USD/CZK kolísá bez ohledu na to, jak klidné akcie držíte, a v krizích hýbe celým portfoliem.
        {c && c.sp && <> Ani v covidovém krachu min vol mnoho neušetřil: {pct(c.pokles)} proti {pct(c.sp.pokles)} u S&P 500.</>}
        {' '}Pojistka tak řeší jen část kolísání a stojí výnos: {pb(k.f.cagr - k.f.spCagr)} ročně {k.f.cagr < k.f.spCagr ? 'méně' : 'více'} než index
        {k.terFondu != null && k.terSp ? <>, plus poplatek {ter(k.terFondu)} místo {ter(k.terSp.ter)}</> : null}.
        Kdo chce v Kč skutečně klidnější jízdu, řeší ji spíš poměrem akcie/dluhopisy než faktorem.
      </>
    );
  },
  faqs: [
    {
      q: 'Pro koho má min vol smysl?',
      a: 'Pro investora, který by jinak v propadu panicky prodal – mělčí propady v některých krizích se snáší lépe. Matematicky ale bývá efektivnější snížit akciovou složku a doplnit dluhopisy: podobné riziko, nižší poplatky, srozumitelnější chování.',
    },
    {
      q: 'Proč min vol zaostal za indexem?',
      a: (k) => `Od ${den(k.f.od)} ${pct(k.f.cagr)} ročně proti ${pct(k.f.spCagr)} u S&P 500. Tohle období byl výjimečný růstový trh tažený technologiemi – přesně tituly, které min vol z definice drží málo. V průměrnějším či klesajícím období by rozdíl byl menší; low-vol anomálie historicky svítí hlavně v krizích a nudných dekádách.`,
    },
    {
      q: 'Chrání min vol v každé krizi?',
      a: (k) => {
        const b = b2022(k), c = covid(k);
        return `Ne stejně.${b && b.sp ? ` V roce 2022 (růst sazeb, pád technologií) ztratil ${pct(b.pokles)} proti ${pct(b.sp.pokles)} u S&P 500${b.navratMesicu != null ? ` a od dna se vrátil za ${b.navratMesicu} měs.` : ''}.` : ''}${c && c.sp ? ` V covidovém krachu 2020 padal skoro jako trh (${pct(c.pokles)} vs. ${pct(c.sp.pokles)}), protože panika prodávala všechno.` : ''} Je to tlumič průměrných špatných období, ne neprůstřelná vesta.`;
      },
    },
    {
      q: 'Je lepší min vol, nebo dividendové akcie? Obojí je „defenziva“.',
      a: 'Min vol je čistší defenziva (vybírá podle kolísání, ne podle dividendy) a v akumulační verzi daňově efektivnější. Dividendové akcie zase drží víc bank a energetiky, takže se v jednotlivých letech chovají jinak. Pokud defenzivu, min vol je systematičtější volba – ale viz zjištění o kurzu.',
    },
    {
      q: 'Jak min vol koupím v Česku?',
      a: (k) => {
        const h = k.fondy?.stejny[0];
        const s = k.fondy?.svetove[0];
        return `${h ? `Na stejný americký index jako naše data (MSCI USA Minimum Volatility) je největší ${h.nazev} (ISIN ${h.isin}, TER ${ter(h.ter)}) – fondy na tento index jsou ale malé, ověřte si likviditu.` : 'UCITS ETF na americký MSCI USA Minimum Volatility najdete ve srovnávači.'}${s ? ` Světová verze ${s.nazev} drží defenzivní tituly z celého vyspělého světa – jiný index, jiný výsledek.` : ''}`;
      },
    },
    {
      q: 'Proč se vaše čísla liší od dolarových materiálů?',
      a: 'Právě o tom je celá tato stránka: v korunách kurz USD/CZK přidává kolísání všem akciovým ETF, takže relativní výhoda min vol v kolísavosti se zmenšuje. Počítáme z kurzů reálného ETF s jeho poplatkem v ceně, kurz den po dni.',
    },
  ],
  related: [
    ['/faktorove-etf', 'Přehled všech šesti faktorů'],
    ['/faktorove-etf/dividendove-akcie', 'Dividendové akcie: psychologie vs. matematika'],
    ['/menove-riziko-etf', 'Měnové riziko u ETF: potřebujete hedged fond?'],
  ],
};

export const generateMetadata = () => faktorMetadata(cfg);

export default function Page() {
  return <FactorDetail cfg={cfg} />;
}
