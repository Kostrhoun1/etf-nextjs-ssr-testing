'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, ArrowLeft, RefreshCw, Sparkles, ShieldCheck, Info, Wallet, Filter, Scale, TrendingDown } from 'lucide-react';
import InvestmentDisclaimer from '@/components/SEO/InvestmentDisclaimer';

/* Průvodce výběrem typu ETF – pravidlový (bez LLM). Z odpovědí odvodí kategorii z naší databáze (srovnávač, ne poradce):
   ukazuje, které typy fondů odpovídají odpovědím, se SKUTEČNÝMI čísly v Kč a datem (revize kola 4, 18. 10. 2026).
   Nízká tolerance propadů → první výsledek jsou modelová portfolia s dluhopisy (historie z backtestu), akciové ETF až
   jako druhá možnost (dřív „celosvětové ETF“ + varování, což testovací uživatelka četla jako rozpor).
   Revize 19. 10. 2026: u KAŽDÉHO výsledku max. propad z backtestu s obdobím, příklad fondu podle volby Acc/Dist,
   volba regionu se promítne i do výsledku „portfolia s dluhopisy“, přesné daňové věty, na mobilu posun na otázku. */

type Answers = { horizon?: string; risk?: string; focus?: string; payout?: string };

const QUESTIONS: { key: keyof Answers; q: string; help?: string; options: { v: string; label: string; desc?: string }[] }[] = [
  {
    key: 'horizon', q: 'Na jak dlouho chcete investovat?',
    options: [
      { v: 'short', label: 'Kratší než 3 roky', desc: 'Peníze budu brzy potřebovat' },
      { v: 'mid', label: '3–10 let', desc: 'Střednědobý cíl' },
      { v: 'long', label: '10 let a víc', desc: 'Dlouhodobé budování majetku' },
    ],
  },
  {
    key: 'risk', q: 'Jak zvládnete výkyvy hodnoty?',
    help: 'Akcie umí během roku spadnout i o desítky procent, než se zase zvednou.',
    options: [
      { v: 'low', label: 'Nechci velké propady', desc: 'Klid je pro mě důležitější než výnos' },
      { v: 'mid', label: 'Zvládnu střední výkyvy', desc: 'Rozumný kompromis' },
      { v: 'high', label: 'Zvládnu velké výkyvy', desc: 'Za vyšší dlouhodobý výnos' },
    ],
  },
  {
    key: 'focus', q: 'Kam chcete investovat?',
    options: [
      { v: 'world', label: 'Celý svět', desc: 'Nejširší rozložení, nemusím hádat region' },
      { v: 'usa', label: 'Hlavně USA (S&P 500)', desc: 'Sázka na americký trh' },
      { v: 'europe', label: 'Evropa', desc: 'Evropské firmy' },
      { v: 'dividends', label: 'Chci pravidelný příjem', desc: 'Dividendy vyplácené na účet' },
      { v: 'tech', label: 'Technologie', desc: 'Tematická sázka na tech' },
      { v: 'esg', label: 'Odpovědně / ESG', desc: 'S ohledem na udržitelnost' },
    ],
  },
  {
    key: 'payout', q: 'Co s dividendami?',
    help: 'Akumulační (Acc) fond je reinvestuje uvnitř fondu – průběžně nic nedaníte. Distribuční (Dist) je vyplácí na účet (daň 15 %).',
    options: [
      { v: 'acc', label: 'Reinvestovat (růst)', desc: 'Akumulační – nechci řešit daně z dividend' },
      { v: 'dist', label: 'Vyplácet na účet', desc: 'Distribuční – chci pravidelný příjem' },
      { v: 'idk', label: 'Nevím', desc: 'Je mi to jedno' },
    ],
  },
];

/** `vVete` = tvar do věty (správná velká písmena: „ETF na S&P 500“, ne „s&p 500 etf“). */
const CATS: Record<string, { slug: string; label: string; vVete: string; why: string }> = {
  world: { slug: 'nejlepsi-celosvetove-etf', label: 'Celosvětové ETF', vVete: 'celosvětové ETF', why: 'jedním nákupem tisíce firem z celého světa – nejširší rozložení rizika' },
  usa: { slug: 'nejlepsi-sp500-etf', label: 'S&P 500 ETF', vVete: 'ETF na S&P 500', why: '500 největších amerických firem, nízké poplatky, jen jedna země' },
  europe: { slug: 'nejlepsi-evropske-etf', label: 'Evropské ETF', vVete: 'evropské ETF', why: 'expozice na evropské firmy' },
  dividends: { slug: 'nejlepsi-dividendove-etf', label: 'Dividendové ETF', vVete: 'dividendové ETF', why: 'fondy zaměřené na pravidelnou výplatu dividend' },
  tech: { slug: 'nejlepsi-technologicke-etf', label: 'Technologické ETF', vVete: 'technologické ETF', why: 'tematická sázka na technologický sektor (vyšší výnos i kolísavost)' },
  esg: { slug: 'nejlepsi-esg-etf', label: 'ESG ETF', vVete: 'ESG ETF', why: 'fondy s ohledem na udržitelnost' },
  bonds: { slug: 'nejlepsi-dluhopisove-etf', label: 'Dluhopisové ETF', vVete: 'dluhopisové ETF', why: 'nižší kolísavost než akcie – kratší horizont a nižší riziko' },
};

/** Ukázkový fond kategorie se skutečným výnosem v Kč a datem (z /vyber-etf/page.tsx, data fondu). */
export interface UkazkaFondu { isin: string; nazev: string; ticker: string | null; r5: number | null; datum: string | null }
/** Modelové portfolio s dluhopisy – historie z backtestu (předpočet, stejné jádro jako /backtest). */
export interface PortfolioKlid {
  slug: string; nazev: string; cagr: number; maxPokles: number; od: string; do: string; nahrada?: string;
  vrchol?: string | null; dno?: string;
}
/** Max. propad kategorie z backtestu (předpočet na serveru). `jenSrovnani` = řada kategorie v datech není, číslo je
 *  pro srovnání s nejbližším širokým trhem (a tak se i ukáže). */
export interface PropadKategorie {
  nazev: string; jenSrovnani?: string; maxPokles: number; vrchol: string | null; dno: string; navrat: string | null; od: string; do: string;
}

const pct = (v: number, d = 1) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d })} %`;
const mesRok = (iso: string) => `${Number(iso.slice(5, 7))}/${iso.slice(0, 4)}`;
const den = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });

function recommend(a: Answers): { key: string; klid: boolean; caution?: string } {
  if (a.horizon === 'short') {
    return { key: 'bonds', klid: false, caution: 'Na horizont kratší než 3 roky jsou akciové ETF riskantní – trh může být zrovna dole, až budete peníze potřebovat. I dluhopisy kolísají (viz propad níže); jistotu dává spíš spořicí účet.' };
  }
  const klid = a.risk === 'low';
  const key = a.focus && CATS[a.focus] ? a.focus : 'world';
  const caution = !klid && key === 'tech' ? 'Technologie jsou volatilnější než celý trh – obvykle doplněk k širokému základu, ne jediný fond.' : undefined;
  return { key, klid, caution };
}

/* Daně (ověřeno 2026, paměť dane-etf-fakta): dividendy z distribučních fondů 15 %; zisk z prodeje osvobozen po 3 letech
   držení (časový test) nebo při příjmech z prodeje cenných papírů do 100 000 Kč za rok (hodnotový test). */
const PRODEJ = 'Daní se až zisk při prodeji, a ten je osvobozený, pokud fond držíte déle než 3 roky, nebo pokud příjmy z prodeje cenných papírů za rok nepřesáhnou 100 000 Kč.';
function payoutNote(payout?: string): string {
  if (payout === 'dist') return `Příklad je distribuční (Dist) fond – dividendy vyplácí na účet a ty se daní 15 %. ${PRODEJ}`;
  if (payout === 'acc') return `Příklad je akumulační (Acc) fond – dividendy reinvestuje uvnitř fondu, průběžně tedy nic nedaníte. ${PRODEJ}`;
  return `Akumulační (Acc) fond dividendy reinvestuje uvnitř fondu – průběžně nic nedaníte. ${PRODEJ} Distribuční (Dist) fond dividendy vyplácí na účet (daň 15 %).`;
}
/** Třída příkladu podle odpovědi: „Vyplácet na účet“ = Dist, jinak Acc. */
const trida = (payout?: string): 'acc' | 'dist' => (payout === 'dist' ? 'dist' : 'acc');

function FondRadek({ f, uvod = 'Například' }: { f?: UkazkaFondu; uvod?: string }) {
  if (!f) return null;
  return (
    <p className="text-sm text-slate-700 leading-relaxed">
      {uvod}{' '}
      <Link href={`/etf/${f.isin}`} className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800">{f.ticker ? `${f.ticker} · ` : ''}{f.nazev}</Link>:{' '}
      za 5 let v Kč{' '}
      <span className={`font-semibold tabular-nums ${f.r5 == null ? 'text-slate-400' : f.r5 >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{f.r5 == null ? '—' : pct(f.r5)}</span>
      <span className="text-slate-500">{f.datum ? ` (celkem, data k ${den(f.datum)})` : ' (aktuální data nemáme)'}</span>.
    </p>
  );
}

/** Max. propad kategorie z backtestu – s obdobím, jako u modelových portfolií. */
function PropadRadek({ p }: { p?: PropadKategorie | null }) {
  if (!p) {
    return <p className="flex items-start gap-2 text-sm text-slate-600"><TrendingDown className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" /> <span>Největší propad: — (historii se teď nepodařilo spočítat).</span></p>;
  }
  const obdobi = `${p.vrchol ? `vrchol ${mesRok(p.vrchol)} → ` : ''}dno ${mesRok(p.dno)}${p.navrat ? `, zpět na vrcholu ${mesRok(p.navrat)}` : ', zatím bez návratu na vrchol'}`;
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50/50 p-3 text-sm text-slate-700 leading-relaxed">
      <TrendingDown className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
      <span>
        {p.jenSrovnani && <>{p.jenSrovnani} Pro srovnání: </>}
        {p.jenSrovnani ? 'největší propad' : 'Největší propad'} – {p.nazev}:{' '}
        <strong className="tabular-nums text-red-700">{pct(p.maxPokles * 100)}</strong> v Kč ({obdobi}).{' '}
        <span className="text-slate-500">Backtest {mesRok(p.od)} – {den(p.do)}, po poplatcích fondu.</span>
      </span>
    </div>
  );
}

export default function EtfSelector({ fondy = {}, portfoliaKlid = [], akcie = null, propady = {} }: {
  fondy?: Record<string, { acc?: UkazkaFondu; dist?: UkazkaFondu }>; portfoliaKlid?: PortfolioKlid[];
  /** 100 % akcie celého světa (VT) ve stejném backtestu – pro srovnání propadu. */
  akcie?: { cagr: number; maxPokles: number } | null;
  propady?: Record<string, PropadKategorie | null>;
}) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});
  const done = step >= QUESTIONS.length;
  const kartaRef = useRef<HTMLDivElement>(null);

  /* MOBIL (revize 19. 10. 2026): úvod stránky zabírá ~720 px a další otázka začínala uprostřed obrazovky.
     Po každé odpovědi (a u výsledku) posunout kartu na začátek obrazovky – jen když tam už není. */
  useEffect(() => {
    if (step === 0) return;
    const el = kartaRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 56 || top > window.innerHeight * 0.25) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const pick = (key: keyof Answers, v: string) => {
    setA((prev) => ({ ...prev, [key]: v }));
    setStep((s) => s + 1);
  };
  const reset = () => { setA({}); setStep(0); };

  if (!done) {
    const cur = QUESTIONS[step];
    // Mřížka podle počtu voleb – 3 volby ve 2 sloupcích nechávaly osamělou třetí (revize kola 4).
    const grid = cur.options.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';
    return (
      <div ref={kartaRef} className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-teal-700"><Compass className="w-4 h-4" /> Otázka {step + 1} ze {QUESTIONS.length}</span>
          {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="inline-flex min-h-11 items-center gap-1 text-sm text-slate-500 hover:text-slate-700"><ArrowLeft className="w-3.5 h-3.5" /> Zpět</button>}
        </div>
        <div className="mb-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
        </div>
        <h2 className="mt-5 text-xl md:text-2xl font-bold tracking-tight text-slate-900">{cur.q}</h2>
        {cur.help && <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{cur.help}</p>}
        <div className={`mt-5 grid gap-2.5 ${grid}`}>
          {cur.options.map((o) => (
            <button key={o.v} onClick={() => pick(cur.key, o.v)} className="group flex flex-col items-start rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-teal-400 hover:shadow-sm min-h-[64px]">
              <span className="font-semibold text-slate-900 group-hover:text-teal-700">{o.label}</span>
              {o.desc && <span className="mt-0.5 text-xs text-slate-500 leading-snug">{o.desc}</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const rec = recommend(a);
  const cat = CATS[rec.key];
  const klid = rec.klid && portfoliaKlid.length > 0;
  const t = trida(a.payout);
  const fond = fondy[rec.key]?.[t];
  // Akciová část modelových portfolií s dluhopisy je světový fond – konkrétní fond „pro začátek“ (ve zvolené třídě).
  const svetovyFond = fondy.world?.[t];
  const focus = a.focus && CATS[a.focus] ? a.focus : 'world';

  return (
    <div ref={kartaRef} className="scroll-mt-20 rounded-2xl border border-teal-200 bg-white overflow-hidden">
      <div className="bg-slate-900 text-white px-6 py-6 md:px-8">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-300"><Sparkles className="w-4 h-4" /> Podle vašich odpovědí</span>
        {klid ? (<>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">Portfolia s dluhopisy</h2>
          <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">Když nechcete velké propady, odpovídají vám spíš <strong className="text-white">portfolia, kde akcie tvoří menšinu</strong> a zbytek hlavně dluhopisy a zlato. Propadům se nevyhnou, ale bývají mělčí.</p>
        </>) : (<>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">{cat.label}</h2>
          <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">Vašim odpovědím odpovídají <strong className="text-white">{cat.vVete}</strong> – {cat.why}.</p>
        </>)}
      </div>
      <div className="p-6 md:p-8 space-y-5">
        {klid && (
          <section className="space-y-3">
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {portfoliaKlid.map((p) => (
                <li key={p.slug} className="rounded-xl border border-slate-200 p-4">
                  <Link href={`/portfolio-strategie/${p.slug}`} className="font-semibold text-slate-900 hover:text-teal-700">{p.nazev}</Link>
                  <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div><dt className="text-xs text-slate-500">Ročně v Kč</dt><dd className="text-lg font-bold tabular-nums text-slate-900">{pct(p.cagr * 100)}</dd></div>
                    <div><dt className="text-xs text-slate-500">Max. pokles v Kč</dt><dd className="text-lg font-bold tabular-nums text-slate-900">{pct(p.maxPokles * 100)}</dd></div>
                  </dl>
                  <p className="mt-1 text-xs text-slate-500">
                    {p.dno ? `Propad ${p.vrchol ? `${mesRok(p.vrchol)} → ` : 'do '}${mesRok(p.dno)}. ` : ''}Backtest {mesRok(p.od)} – {den(p.do)}, po poplatcích fondů{p.nahrada ? ` · ≈ ${p.nahrada}` : ''}
                  </p>
                </li>
              ))}
            </ul>
            {/* Zvolený region se promítne i sem (revize 19. 10. 2026: „Celý svět“ se ve výsledku vůbec neobjevil). */}
            <p className="text-sm text-slate-700 leading-relaxed">
              {focus === 'world'
                ? <>Volbu <strong>Celý svět</strong> tato portfolia splňují: jejich akciovou část tvoří jeden světový fond.</>
                : <>Akciová část těchto portfolií je celosvětová, ne <strong>{CATS[focus].vVete}</strong> – jeden region nebo téma samo o sobě kolísá víc než celý svět. {CATS[focus].label} najdete níže jako druhou možnost.</>}
            </p>
            <FondRadek f={svetovyFond} uvod="Konkrétní fond pro začátek – akciovou část těchto portfolií tvoří světový fond, například" />
            <Link href="/portfolio-strategie?povaha=klid" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800">
              <Scale className="w-4 h-4" /> Modelová portfolia „Chci hlavně klid“ <ArrowRight className="w-4 h-4" />
            </Link>
            {akcie && <p className="text-xs text-slate-500">Pro srovnání: 100&nbsp;% akcie celého světa (fond VT) ve stejném backtestu {pct(akcie.cagr * 100)} ročně, max. pokles {pct(akcie.maxPokles * 100)}.</p>}
          </section>
        )}

        {klid ? (
          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-900">Druhá možnost: {cat.vVete}</p>
            <p className="text-sm text-slate-600 leading-relaxed">Čistě akciové fondy rostly víc, ale propady byly hlubší.</p>
            {focus !== 'world' && <FondRadek f={fond} />}
            <PropadRadek p={propady[rec.key]} />
            <Link href={`/nejlepsi-etf/${cat.slug}`} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800">Fondy v kategorii {cat.label} <ArrowRight className="w-4 h-4" /></Link>
          </section>
        ) : (<>
          <FondRadek f={fond} />
          <PropadRadek p={propady[rec.key]} />
        </>)}

        {rec.caution && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900/90 leading-relaxed">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" /> <span>{rec.caution}</span>
          </div>
        )}
        <div className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
          <Wallet className="w-4 h-4 mt-0.5 shrink-0 text-teal-700" /> <span>{payoutNote(a.payout)}</span>
        </div>
        {!klid && (
          <div className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-teal-700" /> <span>Na stránce kategorie uvidíte konkrétní fondy s <strong>výnosem přepočteným do korun</strong>, poplatky a českým daňovým kontextem.</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          {!klid && (
            <Link href={`/nejlepsi-etf/${cat.slug}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800">
              Zobrazit fondy v kategorii <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link href="/srovnani" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">
            <Filter className="w-4 h-4" /> Profiltrovat všechny fondy
          </Link>
          <button onClick={reset} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-medium text-slate-500 hover:text-slate-700">
            <RefreshCw className="w-4 h-4" /> Znovu
          </button>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <InvestmentDisclaimer variant="inline" />
        </div>
      </div>
    </div>
  );
}
