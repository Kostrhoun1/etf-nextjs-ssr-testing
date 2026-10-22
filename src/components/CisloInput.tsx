'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Číselné pole pro všechny kalkulačky (22. 10. 2026).
 *
 * PROČ: dřív byly kalkulačky postavené na řízeném `<input type="number">` s
 * `onChange={e => set(Number(e.target.value))}` a okamžitým ořezem na min/max. Pole pak nešlo
 * vyprázdnit: smazání „2“ udělalo z pole 0/1/18, další napsaná číslice se přilepila („10“ osob,
 * „022000“ Kč, věk „1831“ → ořez na 80) a kalkulačka ukázala ŠPATNÉ číslo (nouzová rezerva
 * 105 600 Kč místo 66 000 Kč). Nalezeno testerkou na iPhonu.
 *
 * JAK TO FUNGUJE:
 *  - pole drží vlastní TEXT; během psaní dovolí prázdné pole i mezistavy („“, „-“, „1,“),
 *  - přijímá desetinnou čárku i tečku a mezery v tisících („22 000“, „2,5“),
 *  - hodnotu (číslo) pošle ven, jen když je platná a v rozsahu min–max; jinak pošle `null`
 *    → kalkulačka ukáže „—“, nikdy 0 ani starou hodnotu (pravidlo č. 1),
 *  - ořez na min/max a zaokrouhlení až při opuštění pole (blur / Enter) – pak zobrazí opravenou hodnotu,
 *  - type="text" + inputMode pro číselnou klávesnici na iPhonu, výška ≥ 44 px, písmo 16 px
 *    (pod 16 px iOS při kliknutí stránku přiblíží).
 *
 * Automatická kontrola: scripts/qa-kalkulacky.mjs (vyprázdní pole, napíše novou hodnotu, ověří výsledek).
 */

const MEZERY = /[\s  ]/g;

/** Text → číslo. Prázdné nebo nedopsané („-“, „1,2,3“) → null. Čárka i tečka = desetinná. */
export function parseCislo(text: string): number | null {
  const t = text.replace(MEZERY, '').replace(',', '.');
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Číslo → text pole (české formátování: mezera v tisících, desetinná čárka). */
export function formatCislo(v: number | null | undefined, desetinna: boolean, tisice: boolean): string {
  if (v == null || !Number.isFinite(v)) return '';
  return v.toLocaleString('cs-CZ', { useGrouping: tisice, maximumFractionDigits: desetinna ? 4 : 0 });
}

const vRozsahu = (v: number, min?: number, max?: number) =>
  (min == null || v >= min) && (max == null || v <= max);

export interface CisloInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'min' | 'max' | 'step' | 'defaultValue'> {
  value: number | null;
  /** Dostane platné číslo v rozsahu, nebo null (prázdné / nedopsané / mimo rozsah během psaní). */
  onValue: (v: number | null) => void;
  min?: number;
  max?: number;
  /** Povolit desetinná čísla (sazba, inflace, TER). Výchozí false = celá čísla (Kč, roky, osoby). */
  desetinna?: boolean;
  /** Mezera v tisících po opuštění pole. Výchozí true; u věku/let vypnout. */
  tisice?: boolean;
  /** Hlášení stavu pro viditelné varování: 'mimo' = během psaní mimo rozsah, 'orez' = při opuštění
   *  pole upraveno na mez, 'ok' / 'prazdne' jinak. */
  onStav?: (s: CisloStav) => void;
  /** Jen pro pole, kde prázdné VÝSLOVNĚ znamená číslo (např. 0 = „bez vkladu“, se zástupným textem „0“):
   *  prázdné pole pošle tuto hodnotu a ta se zobrazuje jako prázdné pole. Nedopsaný text během psaní
   *  nic neposílá (výpočet se spouští až tlačítkem / po opuštění pole). Jinde nepoužívat – prázdné = null = „—“. */
  prazdne?: number;
}

export type CisloStav = 'ok' | 'prazdne' | 'mimo' | 'orez';

export default function CisloInput({
  value, onValue, min, max, desetinna = false, tisice = true, onStav, prazdne, onBlur, onFocus, onKeyDown, className, ...rest
}: CisloInputProps) {
  const fmt = (v: number | null) => (prazdne != null && v === prazdne ? '' : formatCislo(v, desetinna, tisice));
  const [text, setText] = useState(() => fmt(value));
  // Poslední hodnota, kterou pole poslalo ven (nebo dostalo zvenku). Když se `value` změní na něco
  // jiného (tlačítka +/−, reset, načtení uloženého plánu), přepíšeme text; vlastní ozvěnu ignorujeme.
  const posledni = useRef<number | null>(value);

  useEffect(() => {
    if (value === posledni.current) return;
    posledni.current = value;
    setText(fmt(value));
    onStav?.(value == null ? 'prazdne' : 'ok');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, desetinna, tisice]);

  const posli = (v: number | null) => {
    posledni.current = v;
    if (v !== value) onValue(v);
  };

  const zapornaOk = min != null && min < 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let t = e.target.value.replace(zapornaOk ? /[^0-9\s  ,.\-]/g : /[^0-9\s  ,.]/g, '');
    if (t.length > 20) t = t.slice(0, 20);
    setText(t);
    const n = parseCislo(t);
    const platne = n != null && vRozsahu(n, min, max) && (desetinna || Number.isInteger(n));
    onStav?.(platne ? 'ok' : n != null && !vRozsahu(n, min, max) ? 'mimo' : 'prazdne');
    if (prazdne != null) {
      if (t.replace(MEZERY, '') === '') posli(prazdne);
      else if (platne) posli(n);
      return;
    }
    posli(platne ? n : null);
  };

  const potvrdit = () => {
    const n = parseCislo(text);
    if (n == null) {
      // Prázdné nebo nedopsané pole zůstane prázdné → výsledek „—“. Žádná tichá náhrada nulou.
      if (text !== '') setText('');
      onStav?.('prazdne');
      posli(prazdne ?? null);
      return;
    }
    let v = n;
    if (min != null && v < min) v = min;
    if (max != null && v > max) v = max;
    v = desetinna ? Number(v.toFixed(4)) : Math.round(v);
    if (min != null && v < min) v = min; // zaokrouhlení nesmí vrátit pod minimum
    if (max != null && v > max) v = max;
    setText(fmt(v));
    onStav?.(Math.abs(v - n) > 1e-9 && !vRozsahu(n, min, max) ? 'orez' : 'ok');
    posli(v);
  };

  return (
    <input
      type="text"
      inputMode={desetinna ? 'decimal' : 'numeric'}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      enterKeyHint="done"
      {...rest}
      value={text}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={(e) => { potvrdit(); onBlur?.(e); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { potvrdit(); (e.target as HTMLInputElement).blur(); }
        onKeyDown?.(e);
      }}
      className={className}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Pole se štítkem, jednotkou a tlačítky +/− (jednotný vzhled kalkulaček) */
/* ------------------------------------------------------------------ */

export function CisloPole({
  id, label, value, onChange, step, min, max, suffix, hint, desetinna, tisice, tlacitka = true,
}: {
  id: string;
  label: React.ReactNode;
  value: number | null;
  onChange: (v: number | null) => void;
  step?: string;
  min?: number;
  max?: number;
  suffix?: string;
  hint?: string;
  /** Výchozí: desetinná, když je krok neceločíselný (např. „0.1“). */
  desetinna?: boolean;
  tisice?: boolean;
  /** Tlačítka −/+ vedle pole (dotykový cíl 44 × 44 px). */
  tlacitka?: boolean;
}) {
  const [stav, setStav] = useState<CisloStav>('ok');
  const sN = parseFloat(step ?? '1') || 1;
  const des = desetinna ?? !Number.isInteger(sN);
  const cl = (v: number) => {
    if (min != null && v < min) v = min;
    if (max != null && v > max) v = max;
    return Number(v.toFixed(6));
  };
  const zaklad = value ?? min ?? 0;
  const f = (v: number) => formatCislo(v, des, tisice ?? true);
  const rozsah = min != null && max != null ? `${f(min)}–${f(max)}${suffix ? ` ${suffix}` : ''}`
    : min != null ? `od ${f(min)}${suffix ? ` ${suffix}` : ''}` : max != null ? `do ${f(max)}${suffix ? ` ${suffix}` : ''}` : '';
  const btn = 'flex items-center justify-center w-11 h-11 shrink-0 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40';
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-slate-600 mb-1">{label}</label>
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1 min-w-0">
          <CisloInput
            id={id}
            value={value}
            onValue={onChange}
            onStav={setStav}
            min={min}
            max={max}
            desetinna={des}
            tisice={tisice}
            aria-invalid={stav === 'mimo' || undefined}
            className={`w-full min-h-[44px] rounded-lg border ${stav === 'mimo' ? 'border-amber-400' : 'border-slate-200'} bg-white pl-3 ${suffix ? 'pr-12' : 'pr-3'} py-2.5 text-base text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none`}
          />
          {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{suffix}</span>}
        </div>
        {tlacitka && (
          <>
            <button type="button" aria-label="Snížit" tabIndex={-1} disabled={value != null && min != null && value <= min} onClick={() => onChange(cl(zaklad - sN))} className={btn}><ChevronDown className="w-4 h-4" /></button>
            <button type="button" aria-label="Zvýšit" tabIndex={-1} disabled={value != null && max != null && value >= max} onClick={() => onChange(cl(zaklad + sN))} className={btn}><ChevronUp className="w-4 h-4" /></button>
          </>
        )}
      </div>
      {stav === 'mimo' && rozsah && <p className="mt-1 text-xs text-amber-700 leading-snug" role="status">Mimo rozsah {rozsah} – po opuštění pole upravíme na nejbližší povolenou hodnotu.</p>}
      {stav === 'orez' && rozsah && <p className="mt-1 text-xs text-amber-700 leading-snug" role="status">Upraveno do povoleného rozsahu {rozsah}.</p>}
      {hint && stav !== 'mimo' && stav !== 'orez' && <p className="mt-1 text-xs text-slate-400 leading-snug">{hint}</p>}
    </div>
  );
}

/** Místo výsledku, když chybí platný vstup: „—“ + co doplnit. Žádné číslo z neúplných dat. */
export function VysledekChybi({ co, className = '' }: { co?: string; className?: string }) {
  return (
    <div className={`rounded-2xl border border-dashed border-slate-300 bg-white p-5 md:p-7 text-center ${className}`} data-vysledek-chybi>
      <p className="text-3xl font-bold text-slate-300" aria-hidden>—</p>
      <p className="mt-1 text-sm text-slate-500">
        {co ? <>Doplňte {co} – výsledek se dopočítá hned.</> : <>Doplňte všechna pole – výsledek se dopočítá hned.</>}
      </p>
    </div>
  );
}
