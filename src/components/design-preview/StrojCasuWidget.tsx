'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Share2, Check, History, Minus, Plus } from 'lucide-react';
import { STROJ_PRESETY, spocitejStroj, vlozenoVDnesnichCenach, slozeniProStart, type StrojRada } from '@/lib/strojCasuVypocet';
import { CPI_LAST_MONTH } from '@/lib/backtest/inflation';

/* Korunový stroj času (Vlna 6, 17. 10. 2026). Data = měsíční řady hodnoty portfolia v Kč
   spočítané na serveru STEJNÝM enginem jako backtest (src/lib/strojCasu.ts); tady se jen násobí –
   žádné volání API. Ověřeno proti backtestu (0,13–0,33 %, vklady na začátku měsíce) a proti
   vnějším zdrojům (S&P DJI, kurzy ČNB) – scripts/overeni-stroj-casu.mjs.
   UX review 17. 10. 2026: výsledek na mobilu v pruhu, obnova uloženého scénáře, české pády,
   čtečky jen se stručným shrnutím, větší posuvník, prázdný stav, přesné „vloženo". */

const ULOZENO_KLIC = 'stroj-casu:posledni';
const fmtKc = (v: number) => `${Math.round(v).toLocaleString('cs-CZ')} Kč`;
// Hodnotu zaokrouhlujeme (stroj se od backtestu liší o 0,1–0,3 %): miliony na 1 desetinné místo,
// jinak na 3 platné číslice (revize 17. 10.: pevné tisíce dělaly u malých částek „zisk +0 Kč“).
// VLOŽENO je přesné – tam žádná nejistota není.
const fmtHodnota = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} mil. Kč`;
  if (Math.abs(v) < 1000) return fmtKc(v);
  const krok = 10 ** (Math.floor(Math.log10(Math.abs(v))) - 2);
  return fmtKc(Math.round(v / krok) * krok);
};
const MESICE_6P = ['lednu', 'únoru', 'březnu', 'dubnu', 'květnu', 'červnu', 'červenci', 'srpnu', 'září', 'říjnu', 'listopadu', 'prosinci'];
const vMesici = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `${MESICE_6P[m - 1]} ${y}`; };
const MESICE_1P = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
const mesic1p = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `${MESICE_1P[m - 1]} ${y}`; };
const datum = (iso: string) => new Date(iso).toLocaleDateString('cs-CZ', { timeZone: 'UTC' }).replace(/ /g, ' ');

/* Rychlé volby roku – jedním klepnutím příběh krize a návratu. */
const ROKY_PRIBEH: { rok: number; popis: string }[] = [
  { rok: 2000, popis: 'před krachem dot-com' },
  { rok: 2008, popis: 'před finanční krizí' },
  { rok: 2010, popis: '' },
  { rok: 2020, popis: 'před covidem' },
];

interface Ulozeno { co: string; mesicne: number; naraz: number; od: number; hodnota: number; den: string }

function Graf({ prubeh }: { prubeh: { mesic: string; hodnota: number; vlozeno: number }[] }) {
  if (prubeh.length < 2) return null;
  const W = 640, H = 220, pad = 6, padR = 4;
  const max = Math.max(...prubeh.map((p) => Math.max(p.hodnota, p.vlozeno)));
  const x = (i: number) => pad + (i / (prubeh.length - 1)) * (W - pad - padR);
  const y = (v: number) => H - pad - (v / max) * (H - 2 * pad - 8);
  const cesta = (k: 'hodnota' | 'vlozeno') => prubeh.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[k]).toFixed(1)}`).join(' ');
  const plocha = `${cesta('hodnota')} L${x(prubeh.length - 1)},${H - pad} L${x(0)},${H - pad} Z`;
  const prvni = prubeh[0], posledni = prubeh[prubeh.length - 1];
  const stred = prubeh[Math.floor(prubeh.length / 2)];
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label={`Hodnota investice se změnila z ${fmtKc(prvni.hodnota)} v roce ${prvni.mesic.slice(0, 4)} na ${fmtHodnota(posledni.hodnota)} dnes; vloženo celkem ${fmtKc(posledni.vlozeno)}.`}>
        <path d={plocha} fill="rgb(15 118 110 / 0.10)" />
        <path d={cesta('vlozeno')} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d={cesta('hodnota')} fill="none" stroke="#0f766e" strokeWidth="2.25" />
        <circle cx={x(prubeh.length - 1)} cy={y(posledni.hodnota)} r="4" fill="#0f766e" />
      </svg>
      {/* Roky jako HTML – v SVG by na mobilu měly ~5 px a první by se ořízl */}
      <div className="mt-1 flex justify-between text-xs text-slate-500 tabular-nums" aria-hidden="true">
        <span>{prvni.mesic.slice(0, 4)}</span><span>{stred.mesic.slice(0, 4)}</span><span>dnes</span>
      </div>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 bg-teal-700" /> hodnota {fmtHodnota(posledni.hodnota)}</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 border-t border-dashed border-slate-400" /> vloženo {fmtKc(posledni.vlozeno)}</span>
      </figcaption>
    </figure>
  );
}

export default function StrojCasuWidget({ rady }: { rady: StrojRada[] }) {
  const dostupne = STROJ_PRESETY.filter((p) => rady.some((r) => r.id === p.id));
  const [co, setCo] = useState(dostupne[0]?.id ?? 'svet');
  const [mesicne, setMesicne] = useState(5000);
  const [naraz, setNaraz] = useState(0);
  const [od, setOd] = useState(2010);
  const [minule, setMinule] = useState<Ulozeno | null>(null);
  const [pripraveno, setPripraveno] = useState(false); // až po přečtení URL/uloženého scénáře
  const [zkopirovano, setZkopirovano] = useState(false);
  const [vysledekVidet, setVysledekVidet] = useState(true);
  const [hlaseni, setHlaseni] = useState('');
  const cisloRef = useRef<HTMLParagraphElement>(null);

  // Bez záložního rady[0]: jinak by se pod jménem nenačteného presetu ukázala čísla jiného.
  const rada = rady.find((r) => r.id === co);
  const prvniRok = rada ? Number(rada.od.slice(0, 4)) + (rada.od.endsWith('-01') ? 0 : 1) : 2000;
  const posledniRok = rada ? Number(rada.posledniDen.slice(0, 4)) - 1 : 2025;
  const rokStartu = Math.min(Math.max(od, prvniRok), posledniRok);

  // 1) Scénář z URL (sdílený odkaz); bez parametrů se obnoví uložený scénář z minulé návštěvy –
  //    jinak by návrat přes menu/homepage uložený scénář přepsal výchozím (UX review).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    let u: Ulozeno | null = null;
    try { u = JSON.parse(localStorage.getItem(ULOZENO_KLIC) || 'null'); } catch { /* bez úložiště */ }
    if (u && typeof u.hodnota === 'number') setMinule(u);
    if (p.get('co') || p.get('mesicne')) {
      if (dostupne.some((x) => x.id === p.get('co'))) setCo(p.get('co')!);
      if (/^\d+$/.test(p.get('mesicne') ?? '')) setMesicne(Math.min(1_000_000, Number(p.get('mesicne'))));
      if (/^\d+$/.test(p.get('naraz') ?? '')) setNaraz(Math.min(100_000_000, Number(p.get('naraz'))));
      if (/^\d{4}$/.test(p.get('od') ?? '')) setOd(Number(p.get('od')));
    } else if (u && dostupne.some((x) => x.id === u!.co)) {
      setCo(u.co); setMesicne(u.mesicne); setNaraz(u.naraz); setOd(u.od);
    }
    setPripraveno(true);
    // Jen jednou při načtení: `dostupne` plyne z dat stránky, během návštěvy se nemění.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prazdne = mesicne === 0 && naraz === 0;
  const vysledek = useMemo(
    () => (rada && !prazdne ? spocitejStroj(rada, `${rokStartu}-01`, mesicne, naraz) : null),
    [rada, rokStartu, mesicne, naraz, prazdne],
  );

  const vlozenoReal = useMemo(
    () => (rada && !prazdne ? vlozenoVDnesnichCenach(rada, `${rokStartu}-01`, mesicne, naraz) : null),
    [rada, rokStartu, mesicne, naraz, prazdne],
  );

  // 2) URL odpovídá scénáři (sdílení) + uložení pro „od minulé návštěvy" – až po obnovení.
  useEffect(() => {
    if (!pripraveno || !vysledek || !rada) return;
    const p = new URLSearchParams({ co, mesicne: String(mesicne), od: String(rokStartu) });
    if (naraz > 0) p.set('naraz', String(naraz));
    window.history.replaceState(null, '', `${window.location.pathname}?${p}`);
    const t = setTimeout(() => {
      try { localStorage.setItem(ULOZENO_KLIC, JSON.stringify({ co, mesicne, naraz, od: rokStartu, hodnota: vysledek.hodnota, den: rada.posledniDen } satisfies Ulozeno)); } catch { /* bez úložiště */ }
      // Čtečky: jedno stručné shrnutí, ne celý blok výsledku při každém stisku klávesy.
      setHlaseni(`Dnes zhruba ${fmtHodnota(vysledek.hodnota)}, vloženo ${fmtKc(vysledek.vlozeno)}.`);
    }, 600);
    return () => clearTimeout(t);
  }, [pripraveno, co, mesicne, naraz, rokStartu, vysledek, rada]);

  // 3) Mobil: pruh s výsledkem, když hlavní číslo není vidět (úpravy vstupů nad ním).
  useEffect(() => {
    const el = cisloRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setVysledekVidet(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [vysledek]);

  // „Od minulé návštěvy": jen TENTÝŽ scénář a jen když jsou mezitím novější data.
  const zmena = minule && vysledek && rada && minule.co === co && minule.mesicne === mesicne
    && minule.naraz === naraz && minule.od === rokStartu && minule.den < rada.posledniDen
    ? { rozdil: vysledek.hodnota - minule.hodnota, pct: (vysledek.hodnota / minule.hodnota - 1) * 100, den: minule.den } : null;

  const preset = STROJ_PRESETY.find((p) => p.id === co);
  const sdilet = async () => {
    const url = window.location.href;
    const castky = [naraz ? `${fmtKc(naraz)} na začátku` : '', mesicne ? `${fmtKc(mesicne)} měsíčně` : ''].filter(Boolean).join(' a ');
    const text = vysledek && preset
      ? `${castky} do ${preset.nazev2p} od ${rokStartu} → dnes zhruba ${fmtHodnota(vysledek.hodnota)}. Kolik byste měli vy?`
      : 'Korunový stroj času';
    try {
      if (navigator.share) { await navigator.share({ title: 'Korunový stroj času', text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`); setZkopirovano(true); setTimeout(() => setZkopirovano(false), 2000);
    } catch { /* zrušeno */ }
  };

  // Složení platné pro zvolený start (u „celého světa“ od 2009 skutečný index → backtest dá totéž číslo).
  const slozeniBt = preset && slozeniProStart(preset, `${rokStartu}-01`).map((s) => `${s.indexCode}:${Math.round(s.weight * 100)}`).join(',');
  // Backtest dává první měsíční vklad jako počáteční částku (vklady od 2. měsíce) → stejné vloženo.
  const backtestHref = `/backtest?slozeni=${slozeniBt}&start=${rokStartu}-01-01&amount=${naraz + mesicne}&vklad=${mesicne}&run=1`;

  if (!rada) {
    return <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">Data pro stroj času se teď nepodařilo načíst. Zkuste to prosím později.</p>;
  }
  const zisk = vysledek ? vysledek.hodnota - vysledek.vlozeno : 0;
  const pole = 'w-full min-h-[44px] rounded-lg border border-slate-200 px-3 pr-10 tabular-nums focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <p className="sr-only" aria-live="polite" aria-atomic="true">{hlaseni}</p>
      <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:p-7">
        {/* Vstupy */}
        <div className="space-y-5">
          <fieldset>
            <legend className="text-sm font-medium text-slate-700">Do čeho</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {dostupne.map((p) => (
                <button key={p.id} type="button" aria-pressed={co === p.id} onClick={() => setCo(p.id)}
                  className={`min-h-[44px] rounded-full border px-3.5 text-sm font-medium transition-colors ${co === p.id ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300'}`}>
                  {p.nazev}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">{preset?.popis}</p>
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sc-mesicne" className="text-sm font-medium text-slate-700">Měsíčně</label>
              <div className="relative mt-1.5">
                <input id="sc-mesicne" type="text" inputMode="numeric" value={mesicne === 0 ? '' : mesicne.toLocaleString('cs-CZ')} placeholder="0"
                  onChange={(e) => setMesicne(Math.min(1_000_000, Number(e.target.value.replace(/[^0-9]/g, '') || 0)))} className={pole} />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">Kč</span>
              </div>
            </div>
            <div>
              <label htmlFor="sc-naraz" className="text-sm font-medium text-slate-700">Na začátku</label>
              <div className="relative mt-1.5">
                <input id="sc-naraz" type="text" inputMode="numeric" value={naraz === 0 ? '' : naraz.toLocaleString('cs-CZ')} placeholder="0"
                  onChange={(e) => setNaraz(Math.min(100_000_000, Number(e.target.value.replace(/[^0-9]/g, '') || 0)))} className={pole} />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">Kč</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="sc-od" className="text-sm font-medium text-slate-700">Od roku</label>
              <div className="flex items-center gap-1.5">
                <button type="button" aria-label="O rok dříve" onClick={() => setOd(Math.max(prvniRok, rokStartu - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-teal-300"><Minus className="w-4 h-4" /></button>
                <span className="w-14 text-center text-xl font-bold text-slate-900 tabular-nums">{rokStartu}</span>
                <button type="button" aria-label="O rok později" onClick={() => setOd(Math.min(posledniRok, rokStartu + 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-teal-300"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
            <input id="sc-od" type="range" min={prvniRok} max={posledniRok} step={1} value={rokStartu}
              onChange={(e) => setOd(Number(e.target.value))}
              className="mt-2 h-11 w-full cursor-pointer accent-teal-700 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7" />
            <div className="mt-1 flex flex-wrap gap-1.5">
              {ROKY_PRIBEH.filter((r) => r.rok >= prvniRok && r.rok <= posledniRok).map((r) => (
                <button key={r.rok} type="button" aria-pressed={rokStartu === r.rok} onClick={() => setOd(r.rok)}
                  className={`min-h-[44px] rounded-lg border px-2.5 text-xs transition-colors ${rokStartu === r.rok ? 'border-teal-700 bg-teal-50 text-teal-900' : 'border-slate-200 text-slate-600 hover:border-teal-300'}`}>
                  <span className="font-semibold tabular-nums">{r.rok}</span>{r.popis && <span className="ml-1 text-slate-500">{r.popis}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Výsledek – skrytý, dokud se nepřečte URL (jinak by příjemce sdíleného odkazu na chvíli
            viděl výchozí číslo místo poslaného) */}
        <div className={`min-w-0 ${pripraveno ? '' : 'invisible'}`}>
          {prazdne || !vysledek ? (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">Zadejte měsíční nebo jednorázovou částku.</p>
          ) : (
            <>
              <p className="text-sm text-slate-600">Dnes byste měli zhruba</p>
              <p ref={cisloRef} className="mt-1 text-4xl md:text-5xl font-bold tracking-tight text-slate-900 tabular-nums">{fmtHodnota(vysledek.hodnota)}</p>
              <p className="mt-2 text-sm text-slate-600">
                Vloženo <strong className="text-slate-900 tabular-nums">{fmtKc(vysledek.vlozeno)}</strong>
                {' · '}
                {zisk >= 0 ? 'zisk' : 'ztráta'} <strong className={`tabular-nums ${zisk >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{zisk >= 0 ? '+' : '−'}{fmtHodnota(Math.abs(zisk))}</strong>
              </p>
              {vlozenoReal !== null && (() => {
                const realne = vysledek.hodnota - vlozenoReal;
                return (
                  <p className="mt-1.5 text-sm text-slate-600">
                    Po inflaci: vklady odpovídají v dnešních cenách <span className="tabular-nums">{fmtHodnota(vlozenoReal)}</span>
                    {' · '}reálně {realne >= 0 ? 'navíc' : 'méně'}{' '}
                    <strong className={`tabular-nums ${realne >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{realne >= 0 ? '+' : '−'}{fmtHodnota(Math.abs(realne))}</strong>
                  </p>
                );
              })()}
              {zmena && Math.abs(zmena.rozdil) >= 1 && (
                <p className="mt-3 flex flex-wrap items-center gap-x-1.5 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-900">
                  <History className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    Od {datum(zmena.den)} se váš scénář {zmena.rozdil >= 0 ? 'zhodnotil o' : 'snížil o'}{' '}
                    <strong className="tabular-nums whitespace-nowrap">{fmtKc(Math.abs(zmena.rozdil))} ({zmena.pct >= 0 ? '+' : '−'}{Math.abs(zmena.pct).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })}&nbsp;%)</strong>
                    {zmena.rozdil < 0 && ' – kolísání je u akcií běžné.'}
                  </span>
                </p>
              )}
              <div className="mt-4"><Graf prubeh={vysledek.prubeh} /></div>
              {vysledek.nejhorsiPropad && (
                <p className="mt-3 text-sm text-slate-600">
                  Nejhorší chvíle: v {vMesici(vysledek.nejhorsiPropad.mesic)} mělo portfolio o{' '}
                  <strong className="text-red-700 tabular-nums">{Math.abs(vysledek.nejhorsiPropad.hloubka * 100).toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} %</strong> méně než na předchozím vrcholu.
                  {zisk > 0 && ' Kdo tehdy neprodal, je dnes v zisku.'}
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={sdilet} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-medium text-white hover:bg-teal-800">
                  {zkopirovano ? <><Check className="w-4 h-4" /> Zkopírováno</> : <><Share2 className="w-4 h-4" /> Sdílet výsledek</>}
                </button>
                <Link href={backtestHref} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700">
                  Podrobně v backtestu <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="mt-3 text-xs text-slate-500">Scénář si pamatujeme ve vašem prohlížeči – při příští návštěvě uvidíte, o kolik se změnil.</p>
            </>
          )}
        </div>
      </div>
      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500 leading-relaxed md:px-7">
        Data k {datum(rada.posledniDen)}. Vklad vždy na začátku měsíce, portfolio se jednou ročně vyvažuje.
        Výnosy jsou po poplatcích fondů (ETF), před daní a poplatky brokera, přepočtené do korun denním kurzem. Inflace podle ČSÚ (poslední zveřejněný měsíc: {mesic1p(CPI_LAST_MONTH)}). Minulost nezaručuje budoucí výnosy.
      </p>

      {/* Mobil: výsledek stále na očích, když je hlavní číslo mimo obrazovku */}
      {pripraveno && vysledek && !prazdne && !vysledekVidet && (
        <button type="button" onClick={() => cisloRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          className="md:hidden fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] text-left backdrop-blur shadow-[0_-4px_12px_rgba(15,23,42,0.06)]">
          <span className="text-xs text-slate-500">Dnes ≈ <span className="block text-base font-bold text-slate-900 tabular-nums">{fmtHodnota(vysledek.hodnota)}</span></span>
          <span className="text-xs text-slate-500 text-right">vloženo<span className="block text-sm font-semibold text-slate-700 tabular-nums">{fmtKc(vysledek.vlozeno)}</span></span>
        </button>
      )}
    </div>
  );
}
