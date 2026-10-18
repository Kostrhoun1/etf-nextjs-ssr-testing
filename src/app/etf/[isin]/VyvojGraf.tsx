'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import InfoTip from '@/components/design-preview/InfoTip';
import type { BodVyvoje } from './vyvojIndexu';

/* Graf „Vývoj 10 000 Kč“ na detailu fondu (18. 10. 2026). Řadu dodá server (vyvojIndexu.ts);
   tady se jen přepočítá na start 10 000 Kč ve zvoleném období. Žádná data se nedomýšlejí:
   období delší než řada se nenabízí. */

const VKLAD = 10000;
const OBDOBI = [
  { k: '1r', label: '1R', roky: 1 },
  { k: '3r', label: '3R', roky: 3 },
  { k: '5r', label: '5R', roky: 5 },
  { k: 'max', label: 'Max', roky: 0 },
] as const;
type Obdobi = (typeof OBDOBI)[number]['k'];

const kc = (v: number) => `${Math.round(v).toLocaleString('cs-CZ')} Kč`;
const pct = (v: number) => {
  const r = Math.round(v * 10) / 10 || 0; // bez „−0,0 %“
  return `${r > 0 ? '+' : ''}${r.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
};
const datum = (s: string, dlouhe = true) =>
  new Date(s).toLocaleDateString('cs-CZ', dlouhe ? { day: 'numeric', month: 'numeric', year: 'numeric' } : { month: 'numeric', year: 'numeric' });
const DEN = 864e5;

/** „Hezké“ kroky osy Y (1, 2, 2,5, 5 × 10^n). */
function krokOsy(rozsah: number, cil = 4) {
  const hrubý = rozsah / cil;
  const mag = 10 ** Math.floor(Math.log10(hrubý));
  const n = hrubý / mag;
  return (n < 1.5 ? 1 : n < 2.25 ? 2 : n < 3.5 ? 2.5 : n < 7.5 ? 5 : 10) * mag;
}

export default function VyvojGraf({
  body,
  popis,
  zdroj,
  konec,
  mesicni,
  datumDat,
}: {
  body: BodVyvoje[];
  /** Co graf ukazuje, např. „index S&P 500 (fond SPY)“. */
  popis: string;
  /** Doplněk do tooltipu – odkud jsou data a proč to není přímo fond. */
  zdroj: string;
  konec: string;
  mesicni: boolean;
  /** Datum dat fondu (scraping_date) – když graf končí o víc než 3 dny dřív, řekneme proč. */
  datumDat?: string;
}) {
  const roku = (new Date(body[body.length - 1][0]).getTime() - new Date(body[0][0]).getTime()) / (365.25 * DEN);
  const nabidka = OBDOBI.filter((o) => o.roky === 0 || o.roky <= roku + 0.02);
  const [obd, setObd] = useState<Obdobi>(nabidka.some((o) => o.k === '5r') ? '5r' : nabidka[nabidka.length - 1].k);
  const box = useRef<HTMLDivElement>(null);
  const [sirka, setSirka] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (!box.current) return;
    const ro = new ResizeObserver((e) => setSirka(e[0].contentRect.width));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const rada = useMemo(() => {
    const def = OBDOBI.find((o) => o.k === obd)!;
    const konecT = new Date(body[body.length - 1][0]).getTime();
    let i0 = 0;
    if (def.roky > 0) {
      // stejný kalendářní den před N lety; start = poslední bod nejpozději v ten den
      const k = new Date(konecT);
      const cil = Date.UTC(k.getUTCFullYear() - def.roky, k.getUTCMonth(), k.getUTCDate());
      i0 = body.findIndex((b) => new Date(b[0]).getTime() > cil) - 1;
      if (i0 < 0) i0 = 0;
    }
    const zakl = body[i0][1];
    return body.slice(i0).map(([d, v]) => ({ d, t: new Date(d).getTime(), v: (v / zakl) * VKLAD }));
  }, [body, obd]);

  const posledni = rada[rada.length - 1];
  const zmena = (posledni.v / VKLAD - 1) * 100;
  const letObdobi = (posledni.t - rada[0].t) / (365.25 * DEN);
  const pa = letObdobi > 1.5 ? ((posledni.v / VKLAD) ** (1 / letObdobi) - 1) * 100 : null;

  // Geometrie
  const W = Math.max(sirka, 280);
  const H = W < 500 ? 200 : 260;
  const L = 8, R = 62, T = 12, B = 26;
  const vals = rada.map((p) => p.v);
  const min = Math.min(...vals, VKLAD), max = Math.max(...vals, VKLAD);
  const krok = krokOsy(max - min || 1);
  const y0 = Math.floor(min / krok) * krok, y1 = Math.ceil(max / krok) * krok;
  const x = (t: number) => L + ((t - rada[0].t) / (posledni.t - rada[0].t || 1)) * (W - L - R);
  const y = (v: number) => T + (1 - (v - y0) / (y1 - y0 || 1)) * (H - T - B);
  const cesta = rada.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join('');
  const plocha = `${cesta}L${x(posledni.t).toFixed(1)},${H - B}L${x(rada[0].t).toFixed(1)},${H - B}Z`;
  const mrizka: number[] = [];
  for (let v = y0; v <= y1 + 1e-6; v += krok) mrizka.push(v);

  // Popisky osy X: roky (u 1R měsíce), max ~6 popisků
  const osaX: { t: number; text: string }[] = [];
  if (letObdobi < 1.6) {
    const d = new Date(rada[0].t); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + 1);
    const krokM = W < 500 ? 3 : 2;
    while (d.getTime() < posledni.t) {
      osaX.push({ t: d.getTime(), text: d.toLocaleDateString('cs-CZ', { month: 'numeric', year: '2-digit' }).replace(/\s/g, '') });
      d.setUTCMonth(d.getUTCMonth() + krokM);
    }
  } else {
    const r0 = new Date(rada[0].t).getUTCFullYear() + 1, r1 = new Date(posledni.t).getUTCFullYear();
    const krokR = Math.max(1, Math.ceil((r1 - r0 + 1) / (W < 500 ? 4 : 7)));
    for (let r = r0; r <= r1; r += krokR) osaX.push({ t: Date.UTC(r, 0, 1), text: String(r) });
  }

  const hp = hover != null ? rada[hover] : null;
  const najdi = (px: number) => {
    let best = 0, bd = Infinity;
    for (let i = 0; i < rada.length; i++) { const d = Math.abs(x(rada[i].t) - px); if (d < bd) { bd = d; best = i; } }
    return best;
  };
  const kladny = zmena >= 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            <InfoTip label={<>Simulace: 10 000 Kč vložených na začátku období, bez dalších vkladů. {zdroj} Přepočet do Kč historickými kurzy ECB, bez daní a poplatků brokera.</>}>Vývoj 10 000 Kč</InfoTip>
          </p>
          <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2.5">
            <span className="text-2xl md:text-3xl font-bold tabular-nums text-slate-900">{kc(posledni.v)}</span>
            <span className={`text-sm font-semibold tabular-nums ${kladny ? 'text-emerald-700' : 'text-red-600'}`}>{pct(zmena)}</span>
            {pa != null && <span className="text-xs tabular-nums text-slate-500">{pct(pa)} p.a.</span>}
            <span className="text-xs tabular-nums text-slate-400">{datum(rada[0].d, !mesicni)} – {datum(posledni.d, !mesicni)}</span>
          </p>
        </div>
        <div role="group" aria-label="Období grafu" className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {nabidka.map((o) => (
            <button key={o.k} type="button" aria-pressed={obd === o.k} onClick={() => { setObd(o.k); setHover(null); }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium tabular-nums transition-colors ${obd === o.k ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={box} className="relative mt-3 select-none" style={{ height: H }}>
        {sirka > 0 && (
          <svg width={W} height={H} className="block touch-pan-y" role="img"
            aria-label={`Vývoj 10 000 Kč od ${datum(rada[0].d)} do ${datum(posledni.d)}: ${kc(posledni.v)} (${pct(zmena)})`}
            onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setHover(najdi(e.clientX - r.left)); }}
            onPointerLeave={() => setHover(null)}>
            <defs>
              <linearGradient id="vyvoj-plocha" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
              </linearGradient>
            </defs>
            {mrizka.map((v) => (
              <g key={v}>
                <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={W - R + 8} y={y(v) + 4} fontSize={11} fill="#94a3b8" className="tabular-nums">{Math.round(v).toLocaleString('cs-CZ')}</text>
              </g>
            ))}
            {/* vklad 10 000 Kč */}
            <line x1={L} x2={W - R} y1={y(VKLAD)} y2={y(VKLAD)} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            {osaX.map((o) => (
              <text key={o.t} x={x(o.t)} y={H - 6} fontSize={11} fill="#94a3b8" textAnchor="middle">{o.text}</text>
            ))}
            <path d={plocha} fill="url(#vyvoj-plocha)" />
            <path d={cesta} fill="none" stroke="#0d9488" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {hp && (
              <g>
                <line x1={x(hp.t)} x2={x(hp.t)} y1={T} y2={H - B} stroke="#94a3b8" strokeWidth={1} />
                <circle cx={x(hp.t)} cy={y(hp.v)} r={4.5} fill="#0d9488" stroke="#fff" strokeWidth={2} />
              </g>
            )}
            {!hp && <circle cx={x(posledni.t)} cy={y(posledni.v)} r={4} fill="#0d9488" stroke="#fff" strokeWidth={2} />}
          </svg>
        )}
        {hp && (
          <div className="pointer-events-none absolute top-0 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg tabular-nums"
            style={{ left: Math.min(Math.max(x(hp.t) - 70, 0), W - R - 140), width: 140 }}>
            <span className="block text-slate-300">{datum(hp.d, !mesicni)}</span>
            <span className="block font-semibold">{kc(hp.v)} <span className={hp.v >= VKLAD ? 'text-emerald-300' : 'text-red-300'}>{pct((hp.v / VKLAD - 1) * 100)}</span></span>
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-500 leading-relaxed">
        Vývoj podle: {popis} · v Kč · data k {datum(konec)}
      </p>
      {datumDat && new Date(datumDat).getTime() - new Date(konec).getTime() > 3 * DEN && (
        <p className="mt-1 text-xs text-amber-700 leading-relaxed">
          Graf končí {datum(konec)} – novější kurz koruny zatím nemáme. Proto se může lišit od výnosů fondu k {datum(datumDat)}.
        </p>
      )}
    </div>
  );
}
