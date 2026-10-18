'use client';

import { useEffect, useRef, useState } from 'react';
import { useCurrency, pickReturn, curLabel } from '@/components/design-preview/currencyStore';

/* ─────────────────────────────────────────────────────────────────────────
   VÝNOS PO KALENDÁŘNÍCH LETECH – sloupcový graf pro porovnání fondů (revize 18. 10. 2026:
   „porovnání nemá graf“). Data = return_<rok>(_czk/_usd) z DB, stejné sloupce jako tabulka pod
   grafem a detail fondu; v Kč/USD je denní kontrola přepočítává z kurzů ČNB/ECB
   (scripts/check-fund-data.mjs). Čárový graf vývoje ceny ZÁMĚRNĚ není – časovou řadu cen
   fondů nemáme a nevymýšlíme ji.
   Chybějící hodnota = žádný sloupec a „—“ v popisku (nikdy EUR místo Kč – pickReturn je striktní).
   Barvy = kategorická paleta (identita fondu, ne kladné/záporné), ověřená skriptem
   validate_palette.js (CVD ΔE ≥ 9,1); aqua/žlutá mají kontrast pod 3:1 → hodnoty jsou vždy
   dostupné i v popisku a v tabulce pod grafem.
   ───────────────────────────────────────────────────────────────────────── */

export const BARVY_FONDU = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'];

export interface FondGrafu { isin: string; label: string; data: Record<string, unknown> }

const pct = (v: number | null) => (v == null ? '—' : `${v > 0 ? '+' : ''}${v.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`);

/** „Hezký“ krok osy (5, 10, 20, 25, 50…) tak, aby čar bylo nejvýš ~5. */
function krokOsy(rozsah: number): number {
  for (const k of [5, 10, 20, 25, 50, 100, 200, 250, 500]) if (rozsah / k <= 5) return k;
  return 1000;
}

/** Sloupec se zaobleným koncem dat (4 px) a rovnou stranou u nulové osy. */
function sloupec(x: number, w: number, y0: number, y1: number, nenulova = false): string {
  // Nenulová hodnota blízko nuly (SXR8 2025: +0,1 %) musí být vidět aspoň jako 2px proužek – jinak vypadá jako „chybí“.
  if (nenulova && Math.abs(y1 - y0) < 2) y1 = y1 <= y0 ? y0 - 2 : y0 + 2;
  const h = Math.abs(y1 - y0);
  const r = Math.min(4, w / 2, h);
  if (h < 0.5) return '';
  if (y1 < y0) { // kladný – roste nahoru
    return `M${x},${y0} V${y1 + r} Q${x},${y1} ${x + r},${y1} H${x + w - r} Q${x + w},${y1} ${x + w},${y1 + r} V${y0} Z`;
  }
  return `M${x},${y0} V${y1 - r} Q${x},${y1} ${x + r},${y1} H${x + w - r} Q${x + w},${y1} ${x + w},${y1 - r} V${y0} Z`;
}

export default function PorovnaniGraf({ fondy, rokDat }: { fondy: FondGrafu[]; rokDat: number }) {
  const [cur] = useCurrency();
  const boxRef = useRef<HTMLDivElement>(null);
  const [sirka, setSirka] = useState(720);
  const [aktivni, setAktivni] = useState<number | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSirka(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Období: dokončené roky (posledních 5) + letošek do data dat (YTD).
  const obdobi = [rokDat - 5, rokDat - 4, rokDat - 3, rokDat - 2, rokDat - 1].map((y) => ({ key: String(y), label: String(y), ytd: false }))
    .concat([{ key: 'ytd', label: `${rokDat}*`, ytd: true }]);
  const hodnoty = obdobi.map((o) => fondy.map((f) => pickReturn(f.data, o.key, cur)));
  const radky = obdobi.map((o, i) => ({ ...o, v: hodnoty[i] })).filter((r) => r.v.filter((x) => x != null).length >= 1);
  if (radky.length === 0 || fondy.length === 0) return null;

  const vse = radky.flatMap((r) => r.v.filter((x): x is number => x != null));
  const krok = krokOsy(Math.max(...vse, 0) - Math.min(...vse, 0));
  const maxY = Math.max(krok, Math.ceil(Math.max(...vse, 0) / krok) * krok);
  const minY = Math.min(0, Math.floor(Math.min(...vse, 0) / krok) * krok);

  const H = sirka < 500 ? 220 : 260;
  const m = { l: 40, r: 6, t: 10, b: 26 };
  const pw = sirka - m.l - m.r, ph = H - m.t - m.b;
  const y = (v: number) => m.t + ((maxY - v) / (maxY - minY)) * ph;
  const skupina = pw / radky.length;
  const k = fondy.length;
  const bw = Math.max(4, Math.min(24, (skupina * 0.72 - (k - 1) * 2) / k));
  const sirkaSkupiny = k * bw + (k - 1) * 2;
  const ticks: number[] = [];
  for (let t = minY; t <= maxY + 1e-9; t += krok) ticks.push(t);

  const nejstarsiChybi = fondy.filter((f, fi) => radky.some((r) => r.v[fi] == null)).map((f) => f.label);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-base font-semibold text-slate-900">Výnos po kalendářních letech ({curLabel[cur]})</h2>
        <p className="text-xs text-slate-500">{cur === 'CZK' ? 'Přepočteno kurzem ČNB' : cur === 'USD' ? 'Přepočteno do dolarů' : 'V eurech'} · *{rokDat} = od 1. ledna do data dat</p>
      </div>
      {/* Legenda – vždy (≥ 2 fondy), tvar = obdélník jako sloupec */}
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {fondy.map((f, i) => (
          <li key={f.isin} className="inline-flex items-center gap-1.5 text-sm text-slate-700">
            <span aria-hidden="true" className="inline-block w-3 h-3 rounded-[3px]" style={{ background: BARVY_FONDU[i] }} />
            <span className="font-medium">{f.label}</span>
          </li>
        ))}
      </ul>

      <div ref={boxRef} className="relative mt-3" onMouseLeave={() => setAktivni(null)}>
        <svg width={sirka} height={H} role="img" aria-label={`Sloupcový graf výnosu po letech v ${curLabel[cur]}; hodnoty jsou i v tabulce níže`} className="block max-w-full">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.l} x2={sirka - m.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? '#94a3b8' : '#e2e8f0'} strokeWidth={1} />
              <text x={m.l - 6} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="#64748b" className="tabular-nums">{t > 0 ? '+' : ''}{t} %</text>
            </g>
          ))}
          {radky.map((r, ri) => {
            const x0 = m.l + ri * skupina + (skupina - sirkaSkupiny) / 2;
            return (
              <g key={r.key}>
                {aktivni === ri && <rect x={m.l + ri * skupina + 2} y={m.t} width={skupina - 4} height={ph} rx={6} fill="#f1f5f9" />}
                {r.v.map((v, fi) => v == null ? null : (
                  <path key={fi} d={sloupec(x0 + fi * (bw + 2), bw, y(0), y(v), v !== 0)} fill={BARVY_FONDU[fi]} opacity={aktivni == null || aktivni === ri ? 1 : 0.55} />
                ))}
                <text x={m.l + ri * skupina + skupina / 2} y={H - 8} textAnchor="middle" fontSize={12} fill={r.ytd ? '#0f766e' : '#475569'} fontWeight={r.ytd ? 600 : 400}>{r.label}</text>
                {/* Zásahová plocha = celý sloupec roku (větší než značky), funguje na myš, dotyk i klávesnici */}
                <rect
                  x={m.l + ri * skupina} y={m.t} width={skupina} height={ph + m.b - 4} fill="transparent"
                  tabIndex={0} role="button" aria-label={`Rok ${r.label}: ${fondy.map((f, fi) => `${f.label} ${pct(r.v[fi])}`).join(', ')}`}
                  onMouseEnter={() => setAktivni(ri)} onFocus={() => setAktivni(ri)} onBlur={() => setAktivni(null)}
                  onClick={() => setAktivni((a) => (a === ri ? null : ri))}
                  style={{ cursor: 'pointer', outline: 'none' }}
                />
              </g>
            );
          })}
        </svg>
        {aktivni != null && radky[aktivni] && (() => {
          const cx = m.l + aktivni * skupina + skupina / 2;
          const w = 176;
          const left = Math.max(0, Math.min(cx - w / 2, sirka - w));
          return (
            <div role="status" className="pointer-events-none absolute top-0 z-10 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-lg" style={{ left, width: w }}>
              <p className="text-xs font-medium text-slate-500">{radky[aktivni].ytd ? `${rokDat} (od 1. 1.)` : `Rok ${radky[aktivni].label}`}</p>
              <ul className="mt-1 space-y-0.5">
                {fondy.map((f, fi) => (
                  <li key={f.isin} className="flex items-center justify-between gap-2 text-sm">
                    <span className="inline-flex items-center gap-1.5 text-slate-600"><span aria-hidden="true" className="inline-block w-2.5 h-[3px] rounded" style={{ background: BARVY_FONDU[fi] }} />{f.label}</span>
                    <span className="tabular-nums font-semibold text-slate-900">{pct(radky[aktivni].v[fi])}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
      </div>
      {nejstarsiChybi.length > 0 && (
        <p className="mt-2 text-xs text-slate-500">Chybějící sloupec = fond v tom roce ještě neexistoval nebo pro něj nemáme přepočet ({nejstarsiChybi.join(', ')}).</p>
      )}
      <p className="mt-1 text-xs text-slate-400 md:hidden">Klepnutím na rok zobrazíte přesná čísla.</p>
    </div>
  );
}
