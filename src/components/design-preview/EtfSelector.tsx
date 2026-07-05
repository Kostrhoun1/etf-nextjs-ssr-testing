'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, ArrowLeft, RefreshCw, Sparkles, ShieldCheck, Info, Wallet, Filter } from 'lucide-react';

/* AI ETF průvodce – Fáze 0: pravidlový průvodce výběrem (bez nákladů na LLM,
   plně compliant). Z odpovědí odvodí vhodnou kategorii z naší databáze a pošle
   uživatele na její detail s konkrétními fondy. NENÍ investiční doporučení. */

type Answers = { horizon?: string; risk?: string; focus?: string; payout?: string };

const QUESTIONS: { key: keyof Answers; q: string; help?: string; options: { v: string; label: string; desc?: string }[] }[] = [
  {
    key: 'horizon', q: 'Na jak dlouho chceš investovat?',
    options: [
      { v: 'short', label: 'Kratší než 3 roky', desc: 'Peníze budu brzy potřebovat' },
      { v: 'mid', label: '3–10 let', desc: 'Střednědobý cíl' },
      { v: 'long', label: '10 let a víc', desc: 'Dlouhodobé budování majetku' },
    ],
  },
  {
    key: 'risk', q: 'Jak zvládneš výkyvy hodnoty?',
    help: 'Akcie umí během roku spadnout i o desítky procent, než se zase zvednou.',
    options: [
      { v: 'low', label: 'Nechci velké propady', desc: 'Klid je pro mě důležitější než výnos' },
      { v: 'mid', label: 'Zvládnu střední výkyvy', desc: 'Rozumný kompromis' },
      { v: 'high', label: 'Zvládnu velké výkyvy', desc: 'Za vyšší dlouhodobý výnos' },
    ],
  },
  {
    key: 'focus', q: 'Kam chceš investovat?',
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
    help: 'Akumulační (Acc) je reinvestuje uvnitř fondu – v ČR jednodušší na daně. Distribuční (Dist) je vyplácí na účet.',
    options: [
      { v: 'acc', label: 'Reinvestovat (růst)', desc: 'Akumulační – nechci řešit daně z dividend' },
      { v: 'dist', label: 'Vyplácet na účet', desc: 'Distribuční – chci pravidelný příjem' },
      { v: 'idk', label: 'Nevím / je mi to jedno', desc: 'Poradíš mi' },
    ],
  },
];

const CATS: Record<string, { slug: string; label: string; why: string }> = {
  world: { slug: 'nejlepsi-celosvetove-etf', label: 'Celosvětové ETF', why: 'jedním nákupem tisíce firem z celého světa – nejširší rozložení rizika' },
  usa: { slug: 'nejlepsi-sp500-etf', label: 'S&P 500 ETF', why: '500 největších amerických firem, nízké poplatky, historicky silný výnos' },
  europe: { slug: 'nejlepsi-evropske-etf', label: 'Evropské ETF', why: 'expozice na evropské firmy' },
  dividends: { slug: 'nejlepsi-dividendove-etf', label: 'Dividendové ETF', why: 'fondy zaměřené na pravidelnou výplatu dividend' },
  tech: { slug: 'nejlepsi-technologicke-etf', label: 'Technologické ETF', why: 'tematická sázka na technologický sektor (vyšší výnos i kolísavost)' },
  esg: { slug: 'nejlepsi-esg-etf', label: 'ESG ETF', why: 'fondy s ohledem na udržitelnost' },
  bonds: { slug: 'nejlepsi-dluhopisove-etf', label: 'Dluhopisové ETF', why: 'nižší kolísavost než akcie – vhodnější na krátký horizont a nízké riziko' },
};

function recommend(a: Answers): { key: string; caution?: string } {
  // Krátký horizont nebo nízká tolerance rizika → varování + spíš dluhopisy.
  const conservative = a.horizon === 'short' || a.risk === 'low';
  if (a.horizon === 'short') {
    return { key: 'bonds', caution: 'Na horizont kratší než 3 roky jsou akciové ETF riskantní – trh může být zrovna dole, až budeš peníze potřebovat. Zvaž spíš dluhopisové ETF, spořicí účet nebo delší horizont.' };
  }
  // Tématické/regionální volby respektujeme.
  if (a.focus && a.focus !== 'world' && CATS[a.focus]) {
    const caution = conservative && ['tech'].includes(a.focus) ? 'Zvolené téma je volatilnější – vzhledem k nižší toleranci rizika ho ber jen jako doplněk k širokému základu.' : undefined;
    return { key: a.focus, caution };
  }
  // Default: celý svět (nejlepší základ pro většinu).
  return { key: 'world', caution: conservative ? 'Vzhledem k nižší toleranci rizika zvaž kombinaci se dluhopisy pro klidnější průběh.' : undefined };
}

function payoutNote(payout?: string): string {
  if (payout === 'dist') return 'Hledej distribuční (Dist) variantu – dividendy ti chodí na účet (v ČR je daníš 15 %).';
  if (payout === 'acc') return 'Hledej akumulační (Acc) variantu – dividendy se reinvestují uvnitř fondu a v ČR je řešit nemusíš.';
  return 'Pro dlouhodobý růst dává smysl akumulační (Acc) varianta – dividendy se reinvestují a nemusíš je danit.';
}

export default function EtfSelector() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});
  const done = step >= QUESTIONS.length;

  const pick = (key: keyof Answers, v: string) => {
    setA((prev) => ({ ...prev, [key]: v }));
    setStep((s) => s + 1);
  };
  const reset = () => { setA({}); setStep(0); };

  if (!done) {
    const cur = QUESTIONS[step];
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-teal-700"><Compass className="w-4 h-4" /> Otázka {step + 1} ze {QUESTIONS.length}</span>
          {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"><ArrowLeft className="w-3.5 h-3.5" /> Zpět</button>}
        </div>
        <div className="mb-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
        </div>
        <h2 className="mt-5 text-xl md:text-2xl font-bold tracking-tight text-slate-900">{cur.q}</h2>
        {cur.help && <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{cur.help}</p>}
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
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

  return (
    <div className="rounded-2xl border border-teal-200 bg-white overflow-hidden">
      <div className="bg-slate-900 text-white px-6 py-6 md:px-8">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-300"><Sparkles className="w-4 h-4" /> Naše doporučení pro tebe</span>
        <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">{cat.label}</h2>
        <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">Podle tvých odpovědí ti sedí <strong className="text-white">{cat.label.toLowerCase()}</strong> – {cat.why}.</p>
      </div>
      <div className="p-6 md:p-8 space-y-4">
        {rec.caution && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900/90 leading-relaxed">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" /> {rec.caution}
          </div>
        )}
        <div className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
          <Wallet className="w-4 h-4 mt-0.5 shrink-0 text-teal-700" /> {payoutNote(a.payout)}
        </div>
        <div className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-teal-700" /> Na detailu kategorie uvidíš konkrétní fondy s <strong>výnosem přepočteným do korun</strong>, poplatky a českým daňovým kontextem (časový test 3 roky, atd.).
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <Link href={`/nejlepsi-etf/${cat.slug}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800">
            Zobrazit doporučené fondy <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/srovnani" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">
            <Filter className="w-4 h-4" /> Profiltrovat všechny fondy
          </Link>
          <button onClick={reset} className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-600">
            <RefreshCw className="w-4 h-4" /> Znovu
          </button>
        </div>

        <p className="border-t border-slate-100 pt-4 text-xs text-slate-400 leading-relaxed">
          Tento průvodce je <strong>vzdělávací pomůcka</strong>, která tě zorientuje mezi typy ETF – <strong>není to investiční doporučení</strong> ani analýza vašich osobních poměrů. ETFpruvodce.cz není investiční poradce. Konečné rozhodnutí a jeho důsledky jsou na tobě; investování do ETF nese riziko ztráty.
        </p>
      </div>
    </div>
  );
}
