'use client';

import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import InfoTip from '@/components/design-preview/InfoTip';
import { useCurrency, curLabel } from '@/components/design-preview/currencyStore';
import type { RokVynosu } from '@/lib/srovnaniRocni';
import { BARVY_FONDU } from '@/lib/barvyFondu';

/* Roční výnosy dvou fondů vedle sebe (stránky srovnání, 18. 10. 2026). Vodorovné dvojice sloupců
   od nulové osy – na mobilu čitelné i se 6 roky. Data = skutečné výnosy fondů (ne index).
   Barvy: sdílená paleta fondů (src/lib/barvyFondu.ts) – stejná jako porovnání; identitu nese i legenda. */

const BARVY = BARVY_FONDU;
const pct = (v: number | null) => {
  if (v == null) return '—';
  const r = Math.round(v * 10) / 10 || 0;
  return `${r > 0 ? '+' : ''}${r.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
};

export default function SrovnaniRocniVynosy({ fondy }: { fondy: [{ label: string; roky: RokVynosu[] }, { label: string; roky: RokVynosu[] }] }) {
  const [cur] = useCurrency();
  const klice = Array.from(new Set(fondy.flatMap((f) => f.roky.map((r) => `${r.rok}${r.ytd ? 'y' : ''}`))));
  const radky = klice
    .map((k) => {
      const ytd = k.endsWith('y');
      const rok = parseInt(k, 10);
      const hodnoty = fondy.map((f) => f.roky.find((r) => r.rok === rok && !!r.ytd === ytd)?.v[cur] ?? null);
      return { rok, ytd, hodnoty };
    })
    .filter((r) => r.hodnoty.some((v) => v != null))
    .sort((a, b) => a.rok - b.rok || (a.ytd ? 1 : -1));
  if (!radky.length) return null;
  const vse = radky.flatMap((r) => r.hodnoty.filter((v): v is number => v != null));
  const maxKl = Math.max(0, ...vse), maxZap = Math.max(0, ...vse.map((v) => -v));
  const rozsah = maxKl + maxZap || 1;
  const nula = (maxZap / rozsah) * 100; // poloha nulové osy v %

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
          {fondy.map((f, i) => (
            <span key={f.label} className="inline-flex items-center gap-1.5 font-medium text-slate-700">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: BARVY[i] }} aria-hidden="true" /> {f.label}
            </span>
          ))}
          <span className="text-xs text-slate-400">
            <InfoTip label={`Skutečný výnos fondů za kalendářní rok ${cur === 'CZK' ? 'přepočtený do korun – zahrnuje pohyb kurzu' : cur === 'USD' ? 'v dolarech' : 'v eurech'}. Poslední řádek je letošek od 1. ledna.`}>v {curLabel[cur]}</InfoTip>
          </span>
        </div>
        <CurrencyToggle size="sm" />
      </div>

      <div className="space-y-2.5">
        {radky.map((r) => (
          <div key={`${r.rok}${r.ytd}`} className="grid grid-cols-[3.25rem_1fr] items-center gap-3">
            <span className="text-xs font-medium text-slate-500 tabular-nums">{r.ytd ? 'letos' : r.rok}</span>
            <div className="relative space-y-1">
              {/* nulová osa */}
              <span className="absolute inset-y-0 w-px bg-slate-300" style={{ left: `${nula}%` }} aria-hidden="true" />
              {r.hodnoty.map((v, i) => {
                const w = v == null ? 0 : (Math.abs(v) / rozsah) * 100;
                const kl = (v ?? 0) >= 0;
                return (
                  <div key={i} className="relative flex h-5 items-center" title={`${fondy[i].label} ${r.ytd ? 'letos' : r.rok}: ${pct(v)}`}>
                    {v != null && (
                      <span className={`absolute h-4 ${kl ? 'rounded-r' : 'rounded-l'}`}
                        style={{ background: BARVY[i], opacity: r.ytd ? 0.7 : 1, width: `${Math.max(w, 0.6)}%`, left: kl ? `${nula}%` : `${nula - w}%` }} />
                    )}
                    <span className="absolute text-[11px] font-semibold tabular-nums text-slate-700 whitespace-nowrap"
                      style={v == null ? { left: `${nula}%`, paddingLeft: 6 } : kl
                        ? (nula + w > 80 ? { right: `${100 - nula - w}%`, paddingRight: 6, color: '#fff' } : { left: `${nula + w}%`, paddingLeft: 6 })
                        : (nula - w < 20 ? { left: `${nula - w}%`, paddingLeft: 6, color: '#fff' } : { right: `${100 - nula + w}%`, paddingRight: 6 })}>
                      {pct(v)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
