import FactorDetail, { faktorMetadata, type FactorConfig, type Kontext } from '@/components/design-preview/FactorDetail';
import { porazily } from '@/lib/faktory/vypocet';
import { pct, pb, den, ter } from '@/lib/faktory/format';
import { titulek } from '@/lib/seoTitulek';

// Kolo 8 (22. 10. 2026): žádné číslo natvrdo – vše z dat přes Kontext (src/lib/faktory/vypocet.ts).
export const revalidate = 86400;

/** „jediný faktor, který porazil index“ jen když to data opravdu říkají. */
const jediny = (k: Kontext) => k.vse.kompletni && porazily(k.vse).length === 1 && k.f.vysledek === 'porazil';
const rok2009 = (k: Kontext) => k.f.rocni.find((r) => r.rok === 2009 && r.cely && r.s != null) ?? null;

const cfg: FactorConfig = {
  slug: 'momentum',
  badge: 'Faktorová analýza 1/6 · momentum',
  h1: (k) => (k && jediny(k) ? 'Momentum: jediný faktor, který porazil index'
    : k?.f.vysledek === 'porazil' ? 'Momentum: faktor, který porazil index'
      : 'Momentum: kupovat to, co roste'),
  meta: (k) => {
    const h = cfg.h1(k);
    if (!k) return { title: titulek('Momentum faktor: analýza v korunách'), description: 'Momentum faktor v korunách na denních datech: jak funguje, co říká výzkum, krize a klouzavá okna – živě z našeho backtestu.', ogTitle: h, ogDescription: 'Momentum faktor v korunách na denních datech.' };
    const f = k.f;
    const veta = `Momentum od ${den(f.od)} vydělal v korunách ${pct(f.cagr)} ročně proti ${pct(f.spCagr)} u S&P 500 na stejném okně`;
    return {
      title: titulek(`${h} (analýza v Kč)`),
      description: `${veta}. Jak funguje, co říká výzkum a krize včetně roku 2009.`,
      ogTitle: h,
      ogDescription: `${veta} (data k ${den(f.do)}).`,
      stat: `${pct(f.cagr)} ročně`,
      statLabel: `od ${den(f.od)} · S&P 500 ${pct(f.spCagr)}`,
    };
  },
  lead: (k) => (
    <>
      Kupovat to, co roste, zní jako nejhloupější možná strategie. Data říkají:{' '}
      <strong className="text-white">od {den(k.f.od)} vydělal momentum v korunách {pct(k.f.cagr)} ročně proti {pct(k.f.spCagr)} u
      S&P 500</strong> na stejném okně –{' '}
      {jediny(k) ? 'jako jediný ze šesti faktorů index porazil' : k.f.vysledek === 'porazil' ? 'index porazil' : k.f.vysledek === 'nerozhodne' ? 'prakticky stejně jako index' : 'index neporazil'}
      {k.f.vysledek === 'porazil' ? ', a to přes dot-com, rok 2008 i vlastní slavný crash v roce 2009' : ''}. Celý rozbor tady.
    </>
  ),
  howTitle: 'Jak momentum funguje',
  howParagraphs: [
    <>
      Momentum index (u ETF metodika MSCI) vybírá akcie s nejlepším výnosem za posledních{' '}
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
  numbersNote: 'Před vznikem ETF je řada akademická (viz poznámka u fondů).',
  krizePoznamky: {
    dotcom: 'Momentum drželo technologie až do konce bubliny.',
    gfc: 'V odrazu na jaře 2009 momentum zaostalo – slavný momentum crash (viz níže).',
    covid: 'Momentum drželo technologie, které z pandemie vyšly jako vítěz.',
    bear2022: 'Obrat trhu momentum zaskočil – drželo růstové tituly z roku 2021.',
  },
  riskTitle: 'Momentum crash: největší slabina',
  riskDesc: 'Rok 2009 máme v datech – a je vidět, co teorie předpovídá.',
  riskBody: (k) => {
    const r = rok2009(k);
    return (
      <>
        <strong className="text-slate-900">Momentum crash.</strong> Když trh prudce otočí po velkém propadu,
        momentum drží akcie, které „vedly“ v klesajícím trhu – a odraz propásne.
        {r && r.s != null && (
          r.f < r.s
            ? <> Rok 2009 v našich datech (ještě akademická řada): <strong className="text-slate-900">momentum {pct(r.f)}, S&P 500 {pct(r.s)}</strong> – zaostání o {pb(r.f - r.s)} v roce velké rally.</>
            : <> V našich datech byl rok 2009 výjimkou (momentum {pct(r.f)}, S&P 500 {pct(r.s)}).</>
        )}{' '}
        U koncentrovanějších momentum strategií (long-short, úzké decily) byl crash 2009 ještě mnohem hlubší.
        Momentum si svá vítězství vybírá jindy než trh – a po velkých obratech platí daň.
      </>
    );
  },
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
      a: (k) => {
        const r = rok2009(k);
        return `Tzv. momentum crash: prudký obrat trhu po propadu. Momentum drží akcie, které vedly v klesajícím trhu, a při rychlém obratu nahoru zůstane stát${r && r.s != null && r.f < r.s ? ` – v roce 2009 zaostal náš momentum o ${pb(r.f - r.s)} za indexem` : ''}. Koncentrovanější strategie ztratily mnohem víc.`;
      },
    },
    {
      q: 'Jak si momentum koupím v Česku?',
      a: (k) => {
        const h = k.fondy?.stejny[0];
        const s = k.fondy?.svetove[0];
        return `${h ? `Na stejný americký index jako naše data (MSCI USA Momentum) je největší ${h.nazev} (ISIN ${h.isin}, TER ${ter(h.ter)}).` : 'UCITS ETF na americký index MSCI USA Momentum najdete ve srovnávači.'}${s ? ` Světová verze ${s.nazev} (${s.isin}) je jiný index – čísla z této stránky pro ni neplatí.` : ''}`;
      },
    },
    {
      q: 'Kolik procent portfolia dává smysl dát do momenta?',
      a: 'Pokud vůbec, tak jako doplněk k širokému indexu – běžně se uvádí 10–20 % akciové složky. Momentum má vyšší obrátkovost a specifická rizika; jako jediná akciová pozice se nehodí.',
    },
    {
      q: 'Proč se vaše čísla liší od amerických zdrojů?',
      a: 'Počítáme v korunách (výsledek zahrnuje pohyb kurzu USD/CZK), z kurzů reálného ETF s jeho poplatkem v ceně (před rokem 2013 z akademické řady napojené na ETF). Americké tabulky bývají v dolarech a často bez poplatků.',
    },
  ],
  related: [
    ['/faktorove-etf', 'Přehled všech šesti faktorů'],
    ['/backtest?portfolio=buffett-90-10&start=2002-07-01&amount=100000&contrib=none&run=1', 'Buffettovo 90/10 v backtestu: kolik vydělalo'],
    ['/kolik-vydelaly-etf', 'Kolik vydělaly ETF a akcie'],
  ],
};

export const generateMetadata = () => faktorMetadata(cfg);

export default function Page() {
  return <FactorDetail cfg={cfg} />;
}
