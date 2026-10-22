import FactorDetail, { faktorMetadata, vyctiRoky, type FactorConfig, type Kontext } from '@/components/design-preview/FactorDetail';
import { pct, den, ter } from '@/lib/faktory/format';
import { titulek } from '@/lib/seoTitulek';

// Kolo 8 (22. 10. 2026): žádné číslo natvrdo – vše z dat přes Kontext (src/lib/faktory/vypocet.ts).
// Dřív „v ročence vyhrál 2× (2019, 2023)“ – ve skutečnosti 3× (i 2021); teď se roky berou z ročenky.
export const revalidate = 86400;

const vysledekSlovy = (k: Kontext) =>
  k.f.vysledek === 'porazil' ? 'index porazil' : k.f.vysledek === 'neporazil' ? 'index neporazil' : 'prakticky stejně jako index';
const rok2022 = (k: Kontext) => k.f.rocni.find((r) => r.rok === 2022 && r.s != null) ?? null;

const cfg: FactorConfig = {
  slug: 'quality',
  badge: 'Faktorová analýza 5/6 · quality',
  h1: () => 'Quality: dražší index, nebo lepší spaní?',
  meta: (k) => {
    const h = 'Quality: dražší index, nebo lepší spaní?';
    if (!k) return { title: titulek('Quality faktor: kvalitní firmy v korunách (analýza)'), description: 'Quality ETF drží ziskové firmy s nízkým dluhem. Analýza v korunách na denních datech: výnos proti S&P 500, krize a klouzavá okna – živě z backtestu.', ogTitle: h, ogDescription: 'Quality faktor v korunách na denních datech.' };
    const f = k.f;
    return {
      title: titulek(`Quality faktor: kvalitní firmy v korunách od ${den(f.od)}`),
      description: `Quality ETF drží ziskové firmy s nízkým dluhem. V korunách od ${den(f.od)} ${pct(f.cagr)} ročně, S&P 500 na stejném okně ${pct(f.spCagr)}. Krize a klouzavá okna.`,
      ogTitle: h,
      ogDescription: `Ziskové firmy s nízkým dluhem od ${den(f.od)} v Kč: ${pct(f.cagr)} ročně vs. ${pct(f.spCagr)} u S&P 500 (data k ${den(f.do)}).`,
      stat: `${pct(f.cagr)} vs ${pct(f.spCagr)}`,
      statLabel: `quality vs S&P 500 od ${den(f.od)} (v Kč)`,
    };
  },
  lead: (k) => (
    <>
      Ziskové firmy s nízkým dluhem a stabilními maržemi – kdo by je nechtěl? Quality je nejintuitivnější
      faktor, a proto je u něj nejtěžší poznat, co si vlastně kupujete navíc.{' '}
      <strong className="text-white">V korunách od {den(k.f.od)}: {pct(k.f.cagr)} ročně proti {pct(k.f.spCagr)} u S&P 500</strong> – {vysledekSlovy(k)}.
      {k.f.jenEtf && <> Jen v éře reálného ETF (od {den(k.f.jenEtf.od)}): {pct(k.f.jenEtf.cagr)} vs. {pct(k.f.jenEtf.spCagr)} ročně.</>}
    </>
  ),
  howTitle: 'Jak quality funguje',
  howParagraphs: (k) => [
    <>
      Quality index (MSCI USA Sector Neutral Quality) vybírá firmy podle tří kritérií: <strong>vysoká návratnost
      kapitálu (ROE), nízké zadlužení a stabilita zisků</strong>. Sektorová neutralita zajišťuje, že nejde jen
      o sázku na technologie – index hledá „nejkvalitnější firmu v každém odvětví“.
    </>,
    <>
      Akademický základ je novější než u value a size: profitabilitu jako prémiový faktor popsal Robert
      Novy-Marx (2013) a stala se součástí pětifaktorového modelu Famy a Frenche. Intuice: trh systematicky
      podceňuje, jak dlouho si výjimečně ziskové firmy své marže udrží – kvalita „vydrží déle, než se čeká“.
    </>,
    ...(k?.rocenka && k.vyhry && k.vyhry.length ? [
      <>
        V naší ročence faktorů {k.rocenka.odRoku}–{k.rocenka.doRoku} byl quality nejlepší ze šesti v letech{' '}
        <strong>{vyctiRoky(k.vyhry)}</strong> ({k.vyhry.length}× z {k.rocenka.roky.length})
        {k.prohry && k.prohry.length ? <> a nejhorší v letech {vyctiRoky(k.prohry)}</> : null}.
      </>,
    ] : []),
  ],
  numbersNote: 'Před vznikem ETF je řada akademická (viz poznámka u fondů).',
  krizePoznamky: {
    dotcom: '„Kvalitní“ tituly roku 2000 byly zároveň nejdražší.',
    gfc: 'Pevné rozvahy tu měly být výhodou – porovnejte se S&P 500.',
    covid: 'Panika prodávala všechno, kvalitu nevyjímaje.',
    bear2022: 'Kvalitní firmy byly v roce 2021 drahé a růst sazeb je přecenil.',
  },
  riskTitle: 'Hlavní riziko: platíte faktor, dostáváte skoro index',
  riskDesc: 'Nejsubtilnější past ze všech faktorů.',
  riskBody: (k) => {
    const r = rok2022(k);
    return (
      <>
        Dnešní megakorporace <strong className="text-slate-900">jsou z velké části „quality“ samy o sobě</strong> –
        vysoké marže, málo dluhu, stabilní zisky. Quality index se s běžným indexem hodně překrývá, takže rozdíl
        v jízdě bývá malý{r && r.s != null ? <> (v roce 2022: quality {pct(r.f)}, S&P 500 {pct(r.s)})</> : null}.
        {k.terFondu != null && k.terSp && <> Platíte {ter(k.terFondu)} ročně místo {ter(k.terSp.ter)} u nejlevnějšího velkého S&P 500 ETF – za portfolio, které se od indexu liší jen mírně.</>}
        {' '}Quality dává největší smysl jako <strong className="text-slate-900">stabilizátor kombinovaný s divočejším faktorem</strong>,
        ne jako samostatná náhrada indexu.
      </>
    );
  },
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
      a: (k) => {
        const lepsi = k.f.rocni.filter((r) => r.cely && r.s != null && r.f > r.s && k.rocenka && r.rok >= k.rocenka.odRoku).map((r) => r.rok);
        return `Spíš v nejistotě a po šoku, méně v euforii tažené spekulativními tituly. ${lepsi.length ? `V éře ETF porazil S&P 500 v letech ${vyctiRoky(lepsi)}.` : ''} Je to faktor „pomalu, ale jistě“ – žádná záruka.`;
      },
    },
    {
      q: 'Kolik quality do portfolia?',
      a: 'Kvůli velkému překryvu s indexem dává smysl buď vůbec (index stačí), nebo jako větší stabilní jádro (20–30 % akciové složky) doplněné menším podílem divočejšího faktoru. Malý 5% podíl nic nezmění – jen přidá poplatek.',
    },
    {
      q: 'Jak quality koupím v Česku?',
      a: (k) => {
        const h = k.fondy?.stejny[0];
        const s = k.fondy?.svetove[0];
        return `${h ? `Na stejný americký index jako naše data (MSCI USA Sector Neutral Quality) je největší ${h.nazev} (ISIN ${h.isin}, TER ${ter(h.ter)}).` : 'UCITS ETF na americký MSCI USA Sector Neutral Quality najdete ve srovnávači.'}${s ? ` Světová verze ${s.nazev} aplikuje metodiku na celý vyspělý svět – jiný index, jiný výsledek.` : ''}`;
      },
    },
    {
      q: 'Proč se vaše čísla liší od amerických materiálů?',
      a: 'Počítáme v korunách (včetně kurzu USD/CZK) z kurzů reálného ETF s jeho poplatkem v ceně; před rokem 2013 na akademické řadě napojené na ETF. Americké materiály bývají v dolarech a bez poplatků.',
    },
  ],
  related: [
    ['/faktorove-etf', 'Přehled všech šesti faktorů'],
    ['/faktorove-etf/momentum', 'Momentum: rozbor v korunách'],
    ['/backtest?portfolio=buffett-90-10&start=2002-07-01&amount=100000&contrib=none&run=1', 'Buffettovo 90/10 v backtestu: kolik vydělalo'],
  ],
};

export const generateMetadata = () => faktorMetadata(cfg);

export default function Page() {
  return <FactorDetail cfg={cfg} />;
}
