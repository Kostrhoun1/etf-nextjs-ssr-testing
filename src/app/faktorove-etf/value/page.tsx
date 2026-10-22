import FactorDetail, { faktorMetadata, type FactorConfig, type Kontext } from '@/components/design-preview/FactorDetail';
import { pct, den, mesicu, mesic, let_, ter } from '@/lib/faktory/format';
import { titulek } from '@/lib/seoTitulek';

// Kolo 8 (22. 10. 2026): žádné číslo natvrdo – vše z dat přes Kontext (src/lib/faktory/vypocet.ts).
export const revalidate = 86400;

/** Úvodní souvislá řada let, kdy value porážel S&P 500 (první rok okna je neúplný). */
const uvodniSerie = (k: Kontext) => {
  const r: number[] = [];
  for (const a of k.f.rocni) { if (a.s != null && a.f > a.s) r.push(a.rok); else break; }
  return r;
};
const rok2022 = (k: Kontext) => k.f.rocni.find((r) => r.rok === 2022 && r.s != null) ?? null;
const cekaniLet = (k: Kontext) => Math.floor(k.f.maxPropad.mesicuOdVrcholu / 12);

const cfg: FactorConfig = {
  slug: 'value',
  badge: 'Faktorová analýza 2/6 · value',
  h1: () => 'Value: faktor, který testuje trpělivost',
  meta: (k) => {
    if (!k) return { title: titulek('Value faktor: trpělivost v korunách (analýza)'), description: 'Hodnotové akcie mají nejsilnější akademickou evidenci – a nejdelší čekání. Analýza v korunách na denních datech, živě z našeho backtestu.', ogTitle: 'Value: faktor, který testuje trpělivost', ogDescription: 'Value faktor v korunách na denních datech.' };
    const f = k.f;
    return {
      title: titulek(`Value faktor: ${let_(cekaniLet(k))} čekání na nový vrchol (analýza v Kč)`),
      description: `Hodnotové akcie v korunách od ${den(f.od)}: ${pct(f.cagr)} ročně vs. ${pct(f.spCagr)} u S&P 500, propad ${pct(f.maxPropad.hloubka)}, klouzavá okna, krize a trpělivost.`,
      ogTitle: 'Value: faktor, který testuje trpělivost',
      ogDescription: `Od ${den(f.od)} v korunách: ${pct(f.cagr)} ročně vs. ${pct(f.spCagr)} u S&P 500 a ${mesicu(f.maxPropad.mesicuOdVrcholu)} čekání na nový vrchol (data k ${den(f.do)}).`,
      stat: let_(cekaniLet(k)),
      statLabel: 'od vrcholu zpět na vrchol (value, v Kč)',
    };
  },
  lead: (k) => {
    const s = uvodniSerie(k);
    return (
      <>
        Kupovat levné, nemilované akcie je nejstarší recept na trhu – od Grahama přes Buffetta po akademiky.
        Data v korunách ukazují i druhou stranu: <strong className="text-white">od {den(k.f.od)} value vydělal {pct(k.f.cagr)} ročně
        proti {pct(k.f.spCagr)} u S&P 500</strong>
        {s.length >= 2 ? <>; po dot-com krachu porážel index {s.length} let po sobě ({s[0]}–{s[s.length - 1]}), pak se karta obrátila</> : ''}
        {' '}– a od vrcholu {mesic(k.f.maxPropad.vrchol)} zpět na vrchol se čekalo {mesicu(k.f.maxPropad.mesicuOdVrcholu)}.
      </>
    );
  },
  howTitle: 'Jak value funguje',
  howParagraphs: [
    <>
      Value index vybírá akcie, které jsou <strong>levné vůči svým fundamentům</strong>. Naše data běží na
      americkém Russell 1000 Value – velké a střední firmy s nízkou cenou vůči účetní hodnotě a s nižším
      očekávaným růstem. Kupujete tedy firmy, kterým trh zrovna nevěří: banky
      po krizi, energetiku v éře technologií, průmysl v recesi.
    </>,
    <>
      Akademicky je value prémie popsaná nejdéle ze všech – Fama a French z ní v roce 1992 udělali pilíř svého
      slavného trojfaktorového modelu. Vysvětlení jsou dvě a nevylučují se: <strong>riziková</strong> (levné firmy
      jsou levné právem – jsou křehčí, a vyšší výnos je odměna za riziko) a <strong>behaviorální</strong>{' '}
      (investoři přehánějí pesimismus u nudných firem a přeplácejí růstové příběhy).
    </>,
    <>
      Prakticky to znamená: value se daří, když se trh vrací k rozumu po přehnaném optimismu, a zaostává,
      když vede úzká skupina růstových hvězd.
    </>,
  ],
  numbersNote: 'Pozor: start v květnu 2000 = krátce po vrcholu dot-com bubliny.',
  krizePoznamky: {
    gfc: 'Banky, páteř value indexů, byly epicentrem krize.',
    covid: 'Padala hlavně „stará ekonomika“ – průmysl, energie, banky.',
    bear2022: 'Levné akcie neměly z čeho padat, drahé technologie ano.',
  },
  riskTitle: 'Hlavní riziko: čekání, které málokdo vydrží',
  riskDesc: 'Value neumírá potichu – umírá dlouho a veřejně.',
  riskBody: (k) => {
    const vg = k.vse.valueGrowth;
    const r = rok2022(k);
    return (
      <>
        <strong className="text-slate-900">{mesicu(k.f.maxPropad.mesicuOdVrcholu)} od vrcholu zpět na vrchol</strong> ({mesic(k.f.maxPropad.vrchol)} – {k.f.maxPropad.navrat ? mesic(k.f.maxPropad.navrat) : 'dosud'})
        {vg ? <> a v letech 2010–2019 zaostal za S&P 500 v {vg.value2010s.zaostal} z {vg.value2010s.let} let</> : null}.
        Kdo value koupil kvůli akademickým grafům, v roce 2019 ho prodával s pocitem, že „faktor je mrtvý“
        {r && r.s != null ? <> – a pak přišel rok 2022: value {pct(r.f)}, S&P 500 {pct(r.s)}</> : null}.
        Přesně takhle se prémie „vyplácí“: přechází od netrpělivých k trpělivým. Pokud nesnesete roky podprůměru,
        value vám vydělá jen nervy a poplatky.
      </>
    );
  },
  faqs: [
    {
      q: 'Není value po dvou slabých dekádách mrtvý?',
      a: (k) => {
        const s = uvodniSerie(k);
        return `To se tvrdilo i koncem 90. let${s.length >= 2 ? ` – těsně před tím, než value v našich datech porážel index ${s.length} let po sobě (${s[0]}–${s[s.length - 1]})` : ''}. Prémie historicky přichází ve vlnách po přehnaně optimistických obdobích. Nikdo ale neví kdy; sázka na value je sázka na návrat trhu k fundamentům v neznámém termínu.`;
      },
    },
    {
      q: 'Proč value zaostával v letech 2010–2021?',
      a: (k) => {
        const r = rok2022(k);
        return `Éra nulových sazeb přála růstovým firmám (budoucí zisky měly „zadarmo“ vysokou současnou hodnotu) a technologickým platformám, které value indexy z definice drží málo.${r && r.s != null ? ` Když v roce 2022 sazby vzrostly, value v korunách ztratil ${pct(r.f)}, zatímco S&P 500 ${pct(r.s)}.` : ''}`;
      },
    },
    {
      q: 'Je Buffett value investor? Mám místo ETF kupovat jeho akcie?',
      a: 'Buffett vyrostl z value tradice, ale dnes kombinuje value s kvalitou („skvělá firma za rozumnou cenu“). Pro běžného investora je systematické value ETF levnější a diverzifikovanější způsob, jak na stejný princip vsadit – bez rizika jedné osoby.',
    },
    {
      q: 'Jak value koupím v Česku – a proč ne světovou verzi?',
      a: (k) => {
        const h = k.fondy?.stejny[0];
        const s = k.fondy?.svetove[0];
        return `${h ? `Na americký index Russell 1000 Value (stejný jako naše data) je největší ${h.nazev} (ISIN ${h.isin}, TER ${ter(h.ter)}).` : 'UCITS ETF na americký Russell 1000 Value najdete ve srovnávači.'}${s ? ` Světová verze ${s.nazev} sleduje jiný index (MSCI World Enhanced Value) – jiné firmy, jiné země, jiný výsledek.` : ''}`;
      },
    },
    {
      q: 'Kolik value do portfolia?',
      a: 'Pokud vůbec, tak jako doplněk širokého indexu – běžně 10–20 % akciové složky. A jen pokud jste ochotni ho držet i dekádu podprůměru; jinak je poctivější zůstat u indexu.',
    },
    {
      q: 'Proč se vaše čísla liší od amerických studií?',
      a: 'Počítáme v korunách (včetně pohybu kurzu USD/CZK) z kurzů reálného ETF s jeho poplatkem v ceně. Akademické studie měří teoretická portfolia bez poplatků, obvykle v dolarech – a často zahrnují i malé value firmy, kde byla prémie historicky nejsilnější.',
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
