import FactorDetail, { faktorMetadata, vyctiRoky, type FactorConfig, type Kontext } from '@/components/design-preview/FactorDetail';
import { poradiVolatility } from '@/lib/faktory/vypocet';
import { pct, pctBez, pb, den, ter } from '@/lib/faktory/format';
import { titulek } from '@/lib/seoTitulek';

// Kolo 8 (22. 10. 2026): žádné číslo natvrdo – vše z dat přes Kontext (src/lib/faktory/vypocet.ts).
// Dřív „malé firmy porazily index“ a „od 2014 nevyhrály ani jednou“ – obojí vyvrátila vlastní data (ročenka: 2016).
export const revalidate = 86400;

const nejdivocejsi = (k: Kontext) => k.vse.kompletni && poradiVolatility(k.vse, 'small-cap') === 1;
const terMin = (k: Kontext) => { const t = (k.fondy?.stejny ?? []).map((f) => f.ter).filter((x): x is number => x != null); return t.length ? Math.min(...t) : null; };
const jedenRok = (k: Kontext) => k.f.klouzave.find((r) => r.roky === 1) ?? null;

const cfg: FactorConfig = {
  slug: 'small-cap',
  badge: 'Faktorová analýza 3/6 · small cap',
  h1: (k) => {
    const jizda = k && nejdivocejsi(k) ? 'nejdivočejší jízda' : 'divoká jízda';
    if (!k) return 'Small cap: malé firmy v korunách';
    return k.f.vysledek === 'porazil' ? `Small cap: ${jizda} za malou prémii` : `Small cap: ${jizda} bez prémie`;
  },
  meta: (k) => {
    const h = cfg.h1(k);
    if (!k) return { title: titulek('Small cap: malé firmy v korunách (analýza)'), description: 'Malé firmy v korunách na denních datech: výnos proti S&P 500 na stejném okně, klouzavá okna, krize a pravidelné vklady – živě z našeho backtestu.', ogTitle: h, ogDescription: 'Malé firmy v korunách na denních datech.' };
    const f = k.f;
    return {
      title: titulek(`Small cap: malé firmy v korunách od ${den(f.od)} (analýza)`),
      description: `Malé firmy (Russell 2000) od ${den(f.od)} v Kč: ${pct(f.cagr)} ročně vs. ${pct(f.spCagr)} u S&P 500 na stejném okně – index ${f.vysledek === 'porazil' ? 'porazily' : 'neporazily'}. Okna, krize, vklady.`,
      ogTitle: h,
      ogDescription: `Od ${den(f.od)} v korunách: ${pct(f.cagr)} ročně vs. ${pct(f.spCagr)} u S&P 500, propad ${pct(f.maxPropad.hloubka)} (data k ${den(f.do)}).`,
      stat: `${pct(f.cagr)} vs ${pct(f.spCagr)}`,
      statLabel: `malé firmy vs S&P 500 od ${den(f.od)}`,
    };
  },
  lead: (k) => {
    const j = jedenRok(k);
    return (
      <>
        Malé firmy rostou rychleji než korporace – a jejich akcie by proto měly dlouhodobě vydělávat víc.
        V korunách od {den(k.f.od)} to <strong className="text-white">{k.f.vysledek === 'porazil' ? 'platí' : 'neplatí'}: {pct(k.f.cagr)} ročně
        proti {pct(k.f.spCagr)} u S&P 500</strong> na stejném okně.
        {j ? <> A to za cenu jízdy, kdy jednoleté období umělo skončit {pct(j.nejhorsi)} i {pct(j.nejlepsi)}.</> : null}
      </>
    );
  },
  howTitle: 'Jak size faktor funguje',
  howParagraphs: [
    <>
      Size faktor drží <strong>menší veřejně obchodované firmy</strong> – v našich datech americký index
      Russell 2000 (zhruba dva tisíce menších amerických firem). Malé firmy mají víc prostoru růst, častěji se
      stávají cílem akvizic a analytici je sledují méně – trh je tedy oceňuje s většími chybami.
    </>,
    <>
      Akademicky jde o druhý nejstarší faktor: Rolf Banz popsal size prémii už v roce 1981 a Fama s Frenchem
      z ní udělali součást trojfaktorového modelu (SMB – „small minus big“). Háček: <strong>od svého
      zveřejnění prémie znatelně zeslábla</strong> – část akademiků soudí, že ji trh po objevení z velké části
      vyarbitrážoval, a v posledních letech drží spíš v kombinaci s kvalitou (malé ziskové firmy).
    </>,
  ],
  krizePoznamky: {
    gfc: 'Malé firmy jsou citlivé na úvěrové podmínky a recesi.',
    covid: 'Po panice přišlo raketové zotavení.',
    bear2022: 'Vyšší sazby dopadají na zadlužené malé firmy nejvíc.',
  },
  riskTitle: 'Hlavní riziko: platíte plnou volatilitu za nejistou prémii',
  riskDesc: 'Size je nejslabší z klasických prémií – a nejdražší na nervy.',
  riskBody: (k) => (
    <>
      {k.rocenka && k.vyhry && k.prohry && (
        <>
          V ročence faktorů {k.rocenka.odRoku}–{k.rocenka.doRoku} byly malé firmy nejlepší ze šesti{' '}
          <strong className="text-slate-900">{k.vyhry.length}× z {k.rocenka.roky.length} let</strong>{k.vyhry.length ? ` (${vyctiRoky(k.vyhry)})` : ''} a nejhorší {k.prohry.length}×{k.prohry.length ? ` (${vyctiRoky(k.prohry)})` : ''} –
          éře megakorporací a indexových toků malé firmy nesvědčí.{' '}
        </>
      )}
      Za celé okno {k.f.vysledek === 'porazil' ? `vedly o ${pb(k.f.cagr - k.f.spCagr)} ročně` : `zaostaly o ${pb(k.f.cagr - k.f.spCagr)} ročně`}
      {nejdivocejsi(k) ? ' při nejvyšší kolísavosti ze všech šesti faktorů' : ''} (kolísavost {pctBez(k.f.volatilita)} vs. {pctBez(k.f.spVolatilita)} u S&P 500).
      {terMin(k) != null && k.terSp && <> UCITS ETF na Russell 2000 stojí od {ter(terMin(k))} ročně, nejlevnější velký S&P 500 ETF {ter(k.terSp.ter)}.</>}
      {' '}Pokud small cap, pak s vědomím, že kupujete hlavně vyšší riziko – prémie je bonus, ne jistota.
    </>
  ),
  faqs: [
    {
      q: 'Proč by malé firmy měly vydělávat víc?',
      a: 'Tři důvody: víc prostoru pro růst (snáz zdvojnásobíte tržby z 1 miliardy než ze 100), akviziční prémie (malé firmy jsou cíle převzetí) a horší pokrytí analytiky (víc chyb v ocenění = víc příležitostí). Zároveň jsou ale křehčí – hůř snáší recese a drahé financování.',
    },
    {
      q: 'Platí size prémie ještě dnes?',
      a: (k) => `Sporné. Od publikace v roce 1981 znatelně zeslábla a poslední dekády patřily megakorporacím – v našich korunových datech od ${den(k.f.od)} malé firmy index ${k.f.vysledek === 'porazil' ? 'porazily jen těsně' : 'neporazily'} (${pct(k.f.cagr)} vs. ${pct(k.f.spCagr)} ročně). Novější výzkum ukazuje, že prémie drží hlavně u malých ZISKOVÝCH firem – čistý size index bez filtru kvality táhnou dolů ztrátové firmy.`,
    },
    {
      q: 'Small cap, nebo emerging markets? Obojí je „rizikovější doplněk“.',
      a: 'Jsou to různá rizika: small cap = koncentrace na vyspělé trhy s vyšší citlivostí na ekonomický cyklus; EM = politické riziko a měny rozvojových zemí. Do portfolia se nevylučují, ale součet „kořenících“ pozic držte pod kontrolou.',
    },
    {
      q: 'Kolik small cap do portfolia?',
      a: 'Obvyklá praxe je 10–20 % akciové složky. Kdo chce malé firmy jen „podle trhu“, nepotřebuje samostatné ETF – široký index typu IMI (velké, střední i malé firmy) je drží přirozeně podle jejich váhy.',
    },
    {
      q: 'Jak small cap koupím v Česku?',
      a: (k) => {
        const h = k.fondy?.stejny[0];
        const s = k.fondy?.svetove[0];
        return `${h ? `Na stejný americký index jako naše data (Russell 2000) je největší ${h.nazev} (ISIN ${h.isin}, TER ${ter(h.ter)}).` : 'UCITS ETF na americký Russell 2000 najdete ve srovnávači.'}${s ? ` Světová verze ${s.nazev} drží malé firmy z vyspělých trhů celého světa – jiný index, jiný výsledek.` : ''}`;
      },
    },
    {
      q: 'Proč se vaše čísla liší od amerických studií?',
      a: 'Počítáme v korunách (včetně kurzu USD/CZK) z kurzů reálného ETF s jeho poplatkem v ceně. Akademické studie bývají v dolarech, bez poplatků a na delší historii.',
    },
  ],
  related: [
    ['/faktorove-etf', 'Přehled všech šesti faktorů'],
    ['/faktorove-etf/value', 'Value: faktor, který testuje trpělivost'],
    ['/faktorove-etf/momentum', 'Momentum: rozbor v korunách'],
  ],
};

export const generateMetadata = () => faktorMetadata(cfg);

export default function Page() {
  return <FactorDetail cfg={cfg} />;
}
