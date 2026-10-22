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
 *  - přijímá desetinnou čárku i tečku a mezery v tisících („22 000“, „2,5“); tečka/čárka po 3 číslicích
 *    v celočíselném poli = tisíce („15.000“ = 15 000, ne 15) – pravidla u `rozborCisla`,
 *  - neplatný text („2,5“ osoby) = null + hláška (stav 'necele' / 'nejasne' / 'neplatne'), nikdy tiché zaokrouhlení,
 *  - hodnotu (číslo) pošle ven, jen když je platná a v rozsahu min–max; jinak pošle `null`
 *    → kalkulačka ukáže „—“, nikdy 0 ani starou hodnotu (pravidlo č. 1),
 *  - ořez na min/max a zaokrouhlení až při opuštění pole (blur / Enter) – pak zobrazí opravenou hodnotu,
 *  - type="text" + inputMode pro číselnou klávesnici na iPhonu, výška ≥ 44 px, písmo 16 px
 *    (pod 16 px iOS při kliknutí stránku přiblíží).
 *
 * Automatická kontrola: scripts/qa-kalkulacky.mjs (vyprázdní pole, napíše novou hodnotu, ověří výsledek).
 */

const MEZERY = /[\s  ]/g;

/** Proč text není číslo: necele = desetinné číslo v poli pro celá čísla („2,5“ osoby),
 *  nejasne = „1.000“ v desetinném poli, kde může jít o 1 i o 1 000, neplatne = nesmysl („1,2,3“). */
export type CisloChyba = 'necele' | 'nejasne' | 'neplatne';

/**
 * Text → číslo (audit nástrojů 22. 10. 2026, V1: „15.000“ se četlo jako 15 Kč, „1.000.000“ jako prázdné).
 *
 * PRAVIDLA (ZAMERNA-ROZHODNUTI.md, „Audit nástrojů – kalkulačky“):
 *  - mezery se ignorují („22 000“),
 *  - tečka/čárka mezi skupinami po 3 číslicích („1.000“, „100.000“, „1.000.000“, „1,000“) = ODDĚLOVAČ TISÍCŮ:
 *      · v poli pro celá čísla (Kč, roky, osoby) vždy,
 *      · v desetinném poli (%, sazba) jen při ≥ 2 oddělovačích („1.000.000“); jeden oddělovač („1.000“)
 *        je tam nejednoznačný → když pole nepřipouští hodnoty ≥ 1 000 (max < 1 000, všechna procentní pole),
 *        bereme ho jako desetinnou tečku (1,000 = 1); jinak NEČÍSLO s hláškou „nejednoznačné“,
 *  - obě znaménka zároveň („1.000,5“, „1,000.5“): poslední = desetinné, první = tisíce (musí sedět po 3),
 *  - jinak tečka i čárka = desetinná („2,5“, „4.9“),
 *  - v poli pro celá čísla je desetinné číslo („2,5“) CHYBA s hláškou – žádné tiché zaokrouhlení na 3.
 * Raději žádné číslo než špatné (pravidlo č. 1). Nezávislé případy: scripts/qa-kalkulacky.mjs.
 */
export function rozborCisla(text: string, desetinna = true, max?: number): { n: number | null; chyba?: CisloChyba } {
  const t = text.replace(MEZERY, '');
  if (t === '' || t === '-') return { n: null };
  const m = /^(-?)([\d.,]+)$/.exec(t);
  if (!m) return { n: null, chyba: 'neplatne' };
  const [, znamenko, telo] = m;
  const tisice = (s: string, sep: string) => new RegExp(`^[1-9]\\d{0,2}(\\${sep}\\d{3})+$`).test(s);
  let cislo: string;
  const tecek = (telo.match(/\./g) || []).length;
  const carek = (telo.match(/,/g) || []).length;
  if (tecek === 0 && carek === 0) {
    cislo = telo;
  } else if (tecek > 0 && carek > 0) {
    const des = telo.lastIndexOf('.') > telo.lastIndexOf(',') ? '.' : ',';
    const tis = des === '.' ? ',' : '.';
    const i = telo.lastIndexOf(des);
    const cela = telo.slice(0, i), zlomek = telo.slice(i + 1);
    if ((des === '.' ? tecek : carek) !== 1 || !tisice(cela, tis) || !/^\d*$/.test(zlomek)) return { n: null, chyba: 'neplatne' };
    cislo = `${cela.split(tis).join('')}.${zlomek || '0'}`;
  } else {
    const sep = tecek ? '.' : ',';
    if ((tecek || carek) >= 2) {
      if (!tisice(telo, sep)) return { n: null, chyba: 'neplatne' };
      cislo = telo.split(sep).join('');
    } else {
      const [a, b] = telo.split(sep);
      if (b === '') cislo = a || '0'; // nedopsané „15.“ / „15,“
      else if (b.length === 3 && /^[1-9]\d{0,2}$/.test(a)) {
        if (!desetinna) cislo = a + b; // celé číslo: „15.000“ = 15 000
        else if (max != null && max < 1000) cislo = `${a}.${b}`; // procenta: „1.000“ = 1
        else return { n: null, chyba: 'nejasne' };
      } else cislo = `${a || '0'}.${b}`;
    }
  }
  const n = Number(znamenko + cislo);
  if (!Number.isFinite(n)) return { n: null, chyba: 'neplatne' };
  if (!desetinna && !Number.isInteger(n)) return { n: null, chyba: 'necele' };
  return { n };
}

/** Text → číslo, nebo null (prázdné / nedopsané / neplatné). Pravidla viz `rozborCisla`. */
export function parseCislo(text: string, desetinna = true, max?: number): number | null {
  return rozborCisla(text, desetinna, max).n;
}

/** Může jít o nedopsaný oddělovač tisíců v celočíselném poli („2,5“ → „2,500“)? Pak během psaní chybu nehlásíme. */
const moznaNedopsaneTisice = (text: string) => /^-?[1-9]\d{0,2}([.,]\d{3})*[.,]\d{0,2}$/.test(text.replace(MEZERY, ''));

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
   *  pole upraveno na mez, 'necele' / 'nejasne' / 'neplatne' = text není platné číslo (viz `rozborCisla`),
   *  'ok' / 'prazdne' jinak. Hlášku umí `CisloPole` a `CisloHlaska`. */
  onStav?: (s: CisloStav) => void;
  /** Jen pro pole, kde prázdné VÝSLOVNĚ znamená číslo (např. 0 = „bez vkladu“, se zástupným textem „0“):
   *  prázdné pole pošle tuto hodnotu a ta se zobrazuje jako prázdné pole. Nedopsaný text během psaní
   *  nic neposílá (výpočet se spouští až tlačítkem / po opuštění pole). Jinde nepoužívat – prázdné = null = „—“. */
  prazdne?: number;
}

export type CisloStav = 'ok' | 'prazdne' | 'mimo' | 'orez' | CisloChyba;

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
    const { n, chyba } = rozborCisla(t, desetinna, max);
    const platne = n != null && vRozsahu(n, min, max);
    // Chybu hlásíme už během psaní, jen když text nemůže být rozepsaným číslem s tisíci („2,5“ → „2,500“).
    const stavPsani: CisloStav = chyba && !(chyba === 'necele' && moznaNedopsaneTisice(t)) ? chyba : 'prazdne';
    onStav?.(platne ? 'ok' : n != null ? 'mimo' : stavPsani);
    if (prazdne != null) {
      if (t.replace(MEZERY, '') === '') posli(prazdne);
      else if (platne) posli(n);
      return;
    }
    posli(platne ? n : null);
  };

  const potvrdit = () => {
    const { n, chyba } = rozborCisla(text, desetinna, max);
    if (n == null) {
      if (chyba && prazdne == null) {
        // Neplatné číslo („2,5“ osoby, „1,2,3“): text NECHÁME, ať uživatel vidí, co napsal, výsledek „—“ + hláška.
        onStav?.(chyba);
        posli(null);
        return;
      }
      // Prázdné pole zůstane prázdné → výsledek „—“. U polí s `prazdne` (prázdné = 0 vkladu) se neplatný text
      // smaže, pole ukáže zástupnou „0“ a výpočet počítá s 0 – shodně s tím, co je vidět; stav nese hlášku.
      if (text !== '') setText('');
      onStav?.(chyba ?? 'prazdne');
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
            aria-invalid={(stav !== 'ok' && stav !== 'prazdne' && stav !== 'orez') || undefined}
            className={`w-full min-h-[44px] rounded-lg border ${stav !== 'ok' && stav !== 'prazdne' && stav !== 'orez' ? 'border-amber-400' : 'border-slate-200'} bg-white pl-3 ${suffix ? 'pr-12' : 'pr-3'} py-2.5 text-base text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none`}
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
      <CisloHlaska stav={stav} rozsah={rozsah} />
      {hint && (stav === 'ok' || stav === 'prazdne') && <p className="mt-1 text-xs text-slate-400 leading-snug">{hint}</p>}
    </div>
  );
}

/** Viditelná hláška ke stavu pole (rozsah, neplatné číslo). Pro pole bez `CisloPole` (stroj času, události FIRE). */
export function CisloHlaska({ stav, rozsah, className = '' }: { stav: CisloStav; rozsah?: string; className?: string }) {
  const text =
    stav === 'mimo' && rozsah ? `Mimo rozsah ${rozsah} – po opuštění pole upravíme na nejbližší povolenou hodnotu.`
      : stav === 'orez' && rozsah ? `Upraveno do povoleného rozsahu ${rozsah}.`
        : stav === 'necele' ? 'Zadejte celé číslo, např. 15 000 (tečka nebo čárka jen mezi tisíci).'
          : stav === 'nejasne' ? 'Nejednoznačné číslo – napište ho bez teček (1000), nebo s desetinnou čárkou (1,5).'
            : stav === 'neplatne' ? 'Tohle není číslo – zkontrolujte tečky a čárky.'
              : null;
  if (!text) return null;
  return <p className={`mt-1 text-xs text-amber-700 leading-snug ${className}`} role="status" data-cislo-hlaska={stav}>{text}</p>;
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
