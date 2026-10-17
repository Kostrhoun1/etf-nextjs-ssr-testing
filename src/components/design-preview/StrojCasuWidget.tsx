'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Share2, Check, History } from 'lucide-react';
import { STROJ_PRESETY, spocitejStroj, type StrojRada } from '@/lib/strojCasuVypocet';

/* Korunový stroj času (Vlna 6, 17. 10. 2026). Data = měsíční řady hodnoty portfolia v Kč
   spočítané na serveru STEJNÝM enginem jako backtest (src/lib/strojCasu.ts); tady se jen násobí –
   žádné volání API. Ověřeno proti backtestu (rozdíl 0,1–0,3 %, vklady na začátku měsíce) a proti
   vnějším zdrojům (S&P DJI, kurzy ČNB) – viz PLAN-OPRAV-2026-10.md, Vlna 6. */

const ULOZENO_KLIC = 'stroj-casu:posledni';
const fmtKc = (v: number) => `${Math.round(v).toLocaleString('cs-CZ')} Kč`;
const fmtKcKratce = (v: number) =>
  // Miliony na 1 desetinné místo: stroj se od backtestu liší o 0,1–0,3 % (vklad na začátku měsíce) –
  // na 2 místa by po prokliku do backtestu bylo vidět jiné číslo (3,18 vs. 3,17 mil.).
  v >= 1_000_000 ? `${(v / 1_000_000).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} mil. Kč` : fmtKc(Math.round(v / 1000) * 1000);
const MESICE = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
const mesicText = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `${MESICE[m - 1]} ${y}`; };

interface Ulozeno { co: string; mesicne: number; naraz: number; od: number; hodnota: number; den: string }

function Graf({ prubeh }: { prubeh: { mesic: string; hodnota: number; vlozeno: number }[] }) {
  if (prubeh.length < 2) return null;
  const W = 640, H = 220, pad = 6;
  const max = Math.max(...prubeh.map((p) => Math.max(p.hodnota, p.vlozeno)));
  const x = (i: number) => pad + (i / (prubeh.length - 1)) * (W - 2 * pad);
  const y = (v: number) => H - pad - (v / max) * (H - 2 * pad - 16);
  const cesta = (k: 'hodnota' | 'vlozeno') => prubeh.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[k]).toFixed(1)}`).join(' ');
  const plocha = `${cesta('hodnota')} L${x(prubeh.length - 1)},${H - pad} L${x(0)},${H - pad} Z`;
  const roky = prubeh.map((p, i) => ({ r: p.mesic.slice(0, 4), i, leden: p.mesic.endsWith('-01') })).filter((p) => p.leden);
  const krok = Math.max(1, Math.ceil(roky.length / 6));
  return (
    <svg viewBox={`0 0 ${W} ${H + 14}`} className="w-full h-auto" role="img" aria-label="Vývoj hodnoty investice proti vloženým penězům">
      <path d={plocha} fill="rgb(15 118 110 / 0.10)" />
      <path d={cesta('vlozeno')} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d={cesta('hodnota')} fill="none" stroke="#0f766e" strokeWidth="2.25" />
      {roky.filter((_, k) => k % krok === 0).map((p) => (
        <text key={p.r} x={x(p.i)} y={H + 12} fontSize="11" fill="#64748b" textAnchor="middle">{p.r}</text>
      ))}
    </svg>
  );
}

export default function StrojCasuWidget({ rady }: { rady: StrojRada[] }) {
  const dostupne = STROJ_PRESETY.filter((p) => rady.some((r) => r.id === p.id));
  const [co, setCo] = useState(dostupne[0]?.id ?? 'svet');
  const [mesicne, setMesicne] = useState(5000);
  const [naraz, setNaraz] = useState(0);
  const [od, setOd] = useState(2010);
  const [minule, setMinule] = useState<Ulozeno | null>(null);
  const [zkopirovano, setZkopirovano] = useState(false);

  const rada = rady.find((r) => r.id === co) ?? rady[0];
  const prvniRok = rada ? Number(rada.od.slice(0, 4)) + (rada.od.endsWith('-01') ? 0 : 1) : 2000;
  const posledniRok = rada ? Number(rada.posledniDen.slice(0, 4)) - 1 : 2025;
  const rokStartu = Math.min(Math.max(od, prvniRok), posledniRok);

  // Stav z URL (sdílený odkaz) a z minulé návštěvy – jen v prohlížeči.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('co') && STROJ_PRESETY.some((x) => x.id === p.get('co'))) setCo(p.get('co')!);
    if (/^\d+$/.test(p.get('mesicne') ?? '')) setMesicne(Math.min(1_000_000, Number(p.get('mesicne'))));
    if (/^\d+$/.test(p.get('naraz') ?? '')) setNaraz(Math.min(100_000_000, Number(p.get('naraz'))));
    if (/^\d{4}$/.test(p.get('od') ?? '')) setOd(Number(p.get('od')));
    try { const u = JSON.parse(localStorage.getItem(ULOZENO_KLIC) || 'null'); if (u && typeof u.hodnota === 'number') setMinule(u); } catch { /* bez úložiště */ }
  }, []);

  const vysledek = useMemo(
    () => (rada ? spocitejStroj(rada, `${rokStartu}-01`, mesicne, naraz) : null),
    [rada, rokStartu, mesicne, naraz],
  );

  // URL odpovídá scénáři (sdílení) + uložení pro „od minulé návštěvy".
  useEffect(() => {
    if (!vysledek || !rada) return;
    const p = new URLSearchParams({ co, mesicne: String(mesicne), od: String(rokStartu) });
    if (naraz > 0) p.set('naraz', String(naraz));
    window.history.replaceState(null, '', `${window.location.pathname}?${p}`);
    const t = setTimeout(() => {
      try { localStorage.setItem(ULOZENO_KLIC, JSON.stringify({ co, mesicne, naraz, od: rokStartu, hodnota: vysledek.hodnota, den: rada.posledniDen } satisfies Ulozeno)); } catch { /* bez úložiště */ }
    }, 1500);
    return () => clearTimeout(t);
  }, [co, mesicne, naraz, rokStartu, vysledek, rada]);

  // „Od minulé návštěvy": jen pro TENTÝŽ scénář a jen když jsou mezitím novější data.
  const zmenaOdMinule = minule && vysledek && rada && minule.co === co && minule.mesicne === mesicne
    && minule.naraz === naraz && minule.od === rokStartu && minule.den < rada.posledniDen
    ? { rozdil: vysledek.hodnota - minule.hodnota, den: minule.den } : null;

  const sdilet = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title: 'Korunový stroj času', url }); return; }
      await navigator.clipboard.writeText(url); setZkopirovano(true); setTimeout(() => setZkopirovano(false), 2000);
    } catch { /* zrušeno */ }
  };

  const slozeniBt = STROJ_PRESETY.find((p) => p.id === co)?.slozeni.map((s) => `${s.indexCode}:${Math.round(s.weight * 100)}`).join(',');
  // Backtest dává první měsíční vklad jako počáteční částku (vklady od 2. měsíce) → stejné vloženo.
  const backtestHref = `/backtest?slozeni=${slozeniBt}&start=${rokStartu}-01-01&amount=${naraz + mesicne}&vklad=${mesicne}&run=1`;

  if (!rada || !vysledek) {
    return <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">Data pro stroj času se teď nepodařilo načíst. Zkuste to prosím později.</p>;
  }
  const zisk = vysledek.hodnota - vysledek.vlozeno;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:p-7">
        {/* Vstupy */}
        <div className="space-y-5">
          <fieldset>
            <legend className="text-sm font-medium text-slate-700">Do čeho</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {dostupne.map((p) => (
                <button key={p.id} type="button" aria-pressed={co === p.id} onClick={() => setCo(p.id)}
                  className={`min-h-[40px] rounded-full border px-3.5 text-sm font-medium transition-colors ${co === p.id ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300'}`}>
                  {p.nazev}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">{STROJ_PRESETY.find((p) => p.id === co)?.popis}</p>
          </fieldset>

          <div>
            <label htmlFor="sc-mesicne" className="text-sm font-medium text-slate-700">Měsíčně</label>
            <div className="relative mt-1.5">
              <input id="sc-mesicne" type="text" inputMode="numeric" value={mesicne === 0 ? '' : mesicne.toLocaleString('cs-CZ')} placeholder="0"
                onChange={(e) => setMesicne(Math.min(1_000_000, Number(e.target.value.replace(/[^0-9]/g, '') || 0)))}
                className="w-full min-h-[44px] rounded-lg border border-slate-200 px-3 pr-10 tabular-nums focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100" />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">Kč</span>
            </div>
          </div>

          <div>
            <label htmlFor="sc-naraz" className="text-sm font-medium text-slate-700">Na začátku jednorázově</label>
            <div className="relative mt-1.5">
              <input id="sc-naraz" type="text" inputMode="numeric" value={naraz === 0 ? '' : naraz.toLocaleString('cs-CZ')} placeholder="0"
                onChange={(e) => setNaraz(Math.min(100_000_000, Number(e.target.value.replace(/[^0-9]/g, '') || 0)))}
                className="w-full min-h-[44px] rounded-lg border border-slate-200 px-3 pr-10 tabular-nums focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100" />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">Kč</span>
            </div>
          </div>

          <div>
            <label htmlFor="sc-od" className="flex items-baseline justify-between text-sm font-medium text-slate-700">
              Od roku <span className="text-lg font-bold text-slate-900 tabular-nums">{rokStartu}</span>
            </label>
            <input id="sc-od" type="range" min={prvniRok} max={posledniRok} step={1} value={rokStartu}
              onChange={(e) => setOd(Number(e.target.value))} className="mt-2 w-full accent-teal-700" />
            <div className="flex justify-between text-xs text-slate-500 tabular-nums"><span>{prvniRok}</span><span>{posledniRok}</span></div>
          </div>
        </div>

        {/* Výsledek */}
        <div className="min-w-0" aria-live="polite">
          <p className="text-sm text-slate-600">Dnes byste měli zhruba</p>
          <p className="mt-1 text-4xl md:text-5xl font-bold tracking-tight text-slate-900 tabular-nums">{fmtKcKratce(vysledek.hodnota)}</p>
          <p className="mt-2 text-sm text-slate-600">
            Vloženo <strong className="text-slate-900 tabular-nums">{fmtKcKratce(vysledek.vlozeno)}</strong>
            {' · '}
            {zisk >= 0 ? 'zisk' : 'ztráta'} <strong className={`tabular-nums ${zisk >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{zisk >= 0 ? '+' : '−'}{fmtKcKratce(Math.abs(zisk))}</strong>
          </p>
          {zmenaOdMinule && Math.abs(zmenaOdMinule.rozdil) >= 1 && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-sm text-teal-900">
              <History className="w-4 h-4" aria-hidden="true" />
              Od vaší minulé návštěvy ({new Date(zmenaOdMinule.den).toLocaleDateString('cs-CZ')}): <strong className="tabular-nums">{zmenaOdMinule.rozdil >= 0 ? '+' : '−'}{fmtKc(Math.abs(zmenaOdMinule.rozdil))}</strong>
            </p>
          )}
          <div className="mt-4"><Graf prubeh={vysledek.prubeh} /></div>
          <p className="mt-1 flex flex-wrap gap-x-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 bg-teal-700" /> hodnota</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-0 w-4 border-t border-dashed border-slate-400" /> vloženo</span>
          </p>
          {vysledek.nejhorsiPropad && (
            <p className="mt-3 text-sm text-slate-600">
              Nejhorší chvíle: v {mesicText(vysledek.nejhorsiPropad.mesic)} bylo portfolio{' '}
              <strong className="text-red-700 tabular-nums">{(vysledek.nejhorsiPropad.hloubka * 100).toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} %</strong> pod předchozím vrcholem.
              {zisk > 0 && <> Kdo tehdy neprodal, je dnes v zisku.</>}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={sdilet} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-medium text-white hover:bg-teal-800">
              {zkopirovano ? <><Check className="w-4 h-4" /> Odkaz zkopírován</> : <><Share2 className="w-4 h-4" /> Sdílet výsledek</>}
            </button>
            <Link href={backtestHref} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">
              Podrobně v backtestu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500 leading-relaxed md:px-7">
        Data k {new Date(rada.posledniDen).toLocaleDateString('cs-CZ')}. Vklad vždy na začátku měsíce, portfolio se jednou ročně vyvažuje.
        Výnosy jsou po poplatcích fondů (ETF), před daní a poplatky brokera, přepočtené do korun denním kurzem. Minulost nezaručuje budoucí výnosy.
      </p>
    </div>
  );
}
