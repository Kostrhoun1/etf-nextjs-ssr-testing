import FactorDetail, { faktorMetadata, type FactorConfig, type Kontext } from '@/components/design-preview/FactorDetail';
import { pct, pb, den, ter } from '@/lib/faktory/format';
import { titulek } from '@/lib/seoTitulek';

// Kolo 8 (22. 10. 2026): žádné číslo natvrdo – vše z dat přes Kontext (src/lib/faktory/vypocet.ts).
// Pozn.: UCITS ETF na americký FTSE High Dividend Yield (index dat, VYM) neexistuje – stránka to přizná a ukáže nejbližší.
export const revalidate = 86400;

/** Roky ročenky, kdy byly dividendy jediný kladný faktor. */
const jedine = (k: Kontext) => (k.rocenka?.jedinyKladny ?? []).filter((x) => x.slug === 'dividendove-akcie');
const gfc = (k: Kontext) => k.f.krize.find((c) => c.key === 'gfc') ?? null;

const cfg: FactorConfig = {
  slug: 'dividendove-akcie',
  badge: 'Faktorová analýza 6/6 · dividendy',
  h1: () => 'Dividendové akcie: psychologie vs. matematika',
  meta: (k) => {
    const h = 'Dividendové akcie: psychologie vs. matematika';
    if (!k) return { title: titulek('Dividendové ETF: psychologie vs. matematika (analýza v Kč)'), description: 'Dividendové akcie jsou nejoblíbenější „faktor“. Analýza v korunách na denních datech: výnos proti S&P 500, krize a daně – živě z backtestu.', ogTitle: h, ogDescription: 'Dividendové akcie v korunách na denních datech.' };
    const f = k.f;
    const j = jedine(k)[0];
    return {
      title: titulek('Dividendové ETF: psychologie vs. matematika (analýza v Kč)'),
      description: `Dividendové akcie v Kč od ${den(f.od)}: ${pct(f.cagr)} ročně proti ${pct(f.spCagr)} u S&P 500.${j ? ` V roce ${j.rok} ale jako jediný faktor vydělaly.` : ''} Krize, daně a klouzavá okna.`,
      ogTitle: h,
      ogDescription: `Od ${den(f.od)} ${f.cagr < f.spCagr ? 'zaostaly' : 'vedly'} o ${pb(f.cagr - f.spCagr)} ročně za S&P 500${j ? ` – v roce ${j.rok} ale jako jediné vydělaly (${pct(j.vynos)})` : ''}. Data k ${den(f.do)}.`,
      ...(j ? { stat: pct(j.vynos), statLabel: `jediný kladný faktor v roce ${j.rok}` } : { stat: `${pct(f.cagr)} vs ${pct(f.spCagr)}`, statLabel: `dividendy vs S&P 500 od ${den(f.od)}` }),
    };
  },
  lead: (k) => {
    const j = jedine(k)[0];
    return (
      <>
        Pravidelný příjem z dividend je psychologicky nejpřitažlivější investiční myšlenka – a matematicky
        jedna z nejslabších. <strong className="text-white">V korunách od {den(k.f.od)}: {pct(k.f.cagr)} ročně proti {pct(k.f.spCagr)} u
        S&P 500.</strong>
        {j ? <> Jenže pak přišel rok {j.rok}, kdy dividendové akcie jako jediný ze šesti faktorů vydělaly ({pct(j.vynos)}).</> : null}
        {' '}A pro českého investora je tu ještě daňový háček, o kterém se nemluví.
      </>
    );
  },
  howTitle: 'Jak dividendový „faktor“ funguje',
  howParagraphs: [
    <>
      Dividendové indexy drží firmy s <strong>nadprůměrným dividendovým výnosem</strong> – typicky banky,
      energetiku, telekomunikace, spotřební zboží. Naše data běží na americkém FTSE High Dividend Yield (ETF VYM);
      z indexu tak vypadne většina technologií, které dividendy neplatí.
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
  numbersNote: 'Dividendy jsou reinvestované (daň z nich backtest nepočítá).',
  krizePoznamky: {
    gfc: '„Bezpečné dividendovky“ byly plné bank, epicentra krize.',
    covid: 'Řada firem dividendy seškrtala přesně ve chvíli, kdy je investoři čekali.',
    bear2022: 'Energetika a banky vydělávaly, zatímco technologie padaly.',
  },
  riskTitle: 'Český daňový háček: dividendy se daní hned',
  riskDesc: 'Pohled pro investora v ČR – tohle v zahraničních srovnáních nenajdete.',
  riskBody: (k) => (
    <>
      Dividendy z irských ETF se v Česku <strong className="text-slate-900">daní 15 % v roce výplaty</strong> –
      bez ohledu na tříletý časový test, který jinak dělá ETF daňově výhodné. U distribuční verze tak
      každý rok odevzdáte část výnosu státu, zatímco akumulační fond do prodeje nezdaníte (a po 3 letech
      držení často vůbec). Náš backtest daně nepočítá – reálný rozdíl proti indexu je pro českého
      investora <strong className="text-slate-900">ještě větší než {pb(k.f.cagr - k.f.spCagr)} ročně</strong>. Pokud dividendové
      ETF, zvažte akumulační variantu – psychologický efekt „chodí mi příjem“ tím ale ztratíte, což byl často
      hlavní důvod nákupu.
    </>
  ),
  dataNote: 'UCITS ETF na přesně tento americký index neexistuje; nejbližší americké fondy mají jiná pravidla výběru (kvalita, ESG filtry).',
  faqs: [
    {
      q: 'Chci žít z dividend. Není to celý smysl investování?',
      a: 'Renta z portfolia je skvělý cíl – ale matematicky je jedno, jestli ji tvoří dividendy, nebo prodej části akumulačního ETF (po 3 letech navíc bez daně, zatímco dividendy zdaníte 15 % vždy). „Dividendová renta“ je pohodlnější pocitově, „prodejová renta“ je v ČR efektivnější daňově.',
    },
    {
      q: 'Nejsou dividendové firmy bezpečnější?',
      a: (k) => {
        const g = gfc(k);
        return `Ne automaticky.${g && g.sp ? ` Ve finanční krizi 2008 spadly v našich datech o ${pct(g.pokles)} (S&P 500 ${pct(g.sp.pokles)}), protože byly plné bank.` : ''} Vysoký dividendový výnos je někdy varování – „dividendová past“, kdy cena spadla, protože byznys upadá, a škrt dividendy teprve přijde.`;
      },
    },
    {
      q: 'Jak dopadly dividendovky v roce 2022 – a proč?',
      a: (k) => `${(() => { const r = k.f.rocni.find((x) => x.rok === 2022 && x.s != null); return r ? `V korunách ${pct(r.f)}, S&P 500 ${pct(r.s)}. ` : ''; })()}Rostoucí sazby přecenily růstové akcie (vzdálené zisky ztratily hodnotu), zatímco energetika a banky – páteř dividendových indexů – z vyšších sazeb a cen energií profitovaly. Je to ilustrace, k čemu dividendový faktor reálně je: diverzifikace stylu, ne vyšší výnos.`,
    },
    {
      q: 'Distribuční, nebo akumulační verze?',
      a: 'Pro fázi budování majetku v ČR jednoznačně akumulační (žádná průběžná daň, automatická reinvestice). Distribuční dává smysl až v rentě – a i tam zvažte, zda není efektivnější prodávat akumulační po časovém testu.',
    },
    {
      q: 'Jak dividendové akcie koupím v Česku?',
      a: (k) => {
        const n = k.fondy?.nejblizsi[0];
        const s = k.fondy?.svetove;
        return `UCITS ETF na americký index FTSE High Dividend Yield (naše data) neexistuje.${n ? ` Nejbližší americký je ${n.nazev} (ISIN ${n.isin}, TER ${ter(n.ter)}) – s jinými pravidly výběru.` : ''}${s && s.length ? ` Nejrozšířenější je světová verze ${s[0].nazev} (${s.map((x) => x.isin).join(', ')}) – jiný index, jiný výsledek.` : ''}`;
      },
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

export const generateMetadata = () => faktorMetadata(cfg);

export default function Page() {
  return <FactorDetail cfg={cfg} />;
}
