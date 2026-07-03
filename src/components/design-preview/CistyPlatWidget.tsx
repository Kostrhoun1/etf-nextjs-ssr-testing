'use client';

import React, { useState, useMemo } from 'react';
import { Wallet, TrendingDown, Receipt, BadgePercent, Building2, AlertTriangle } from 'lucide-react';
import InfoTip from './InfoTip';

/**
 * Interaktivní jádro kalkulačky čisté mzdy 2026 – PRESKINOVANÁ verze (design systém teal/slate).
 *
 * VÝPOČETNÍ LOGIKA A DAŇOVÉ KONSTANTY JSOU 1:1 PŘEVZATY ze zdroje:
 *   src/utils/netSalaryCalculations.ts  (calculateNetSalary, řádky 32–160)
 * Měněn je POUZE vizuál. Sazby, slevy ani vzorce neměnit – chybná daň = kritická chyba.
 */

/* ===== KONSTANTY 2026 – ZKOPÍROVÁNO 1:1 z src/utils/netSalaryCalculations.ts ===== */
const SOCIAL_INSURANCE_RATE = 0.071; // 7,1 % (6,5 % důchodové + 0,6 % nemocenské)
const HEALTH_INSURANCE_RATE = 0.045; // 4,5 %
const PENSIONER_HEALTH_INSURANCE_RATE = 0.045; // 4,5 % pro důchodce (zůstává)

const INCOME_TAX_RATE_BASIC = 0.15; // 15 %
const INCOME_TAX_RATE_HIGH = 0.23; // 23 %
const AVERAGE_SALARY_2026 = 48967; // Kč (průměrná mzda pro daňové účely 2026)
const HIGH_TAX_THRESHOLD_MONTHLY = AVERAGE_SALARY_2026 * 36 / 12; // 146 901 Kč měsíčně

const MONTHLY_TAX_CREDIT = 2570; // Kč
const CHILD_TAX_CREDIT_FIRST = 1267; // Kč za 1. dítě
const CHILD_TAX_CREDIT_SECOND = 1860; // Kč za 2. dítě
const CHILD_TAX_CREDIT_THIRD_PLUS = 2320; // Kč za 3. a další dítě
const DISABILITY_TAX_CREDIT_1_2_MONTHLY = 210; // Kč pro invaliditu 1./2. stupeň

const EMPLOYER_SOCIAL_INSURANCE_RATE = 0.248; // 24,8 %
const EMPLOYER_HEALTH_INSURANCE_RATE = 0.09; // 9 %

interface NetSalaryParams {
  grossSalary: number;
  isPensioner: boolean;
  hasChildren: boolean;
  numberOfChildren: number;
  hasDisability: boolean;
}

interface NetSalaryData {
  grossSalary: number;
  socialInsurance: number;
  healthInsurance: number;
  totalInsurance: number;
  incomeTax: number;
  taxRate: number;
  taxDeductions: number;
  netTax: number;
  netSalary: number;
  employerCosts: number;
  taxEffectiveRate: number;
  breakdown: {
    monthlyTaxCredit: number;
    childTaxCredit: number;
    disabilityTaxCredit: number;
    totalTaxCredits: number;
  };
}

/* calculateNetSalary – 1:1 z netSalaryCalculations.ts (jen bez student. slevy, která je tam vždy 0). */
function calculateNetSalary(params: NetSalaryParams): NetSalaryData {
  const { grossSalary, isPensioner, hasChildren, numberOfChildren, hasDisability } = params;

  // Výpočet pojistného
  let socialInsurance: number;
  let healthInsurance: number;

  if (isPensioner) {
    // Pracující důchodci – 0 % sociální, 4,5 % zdravotní
    socialInsurance = 0;
    healthInsurance = grossSalary * PENSIONER_HEALTH_INSURANCE_RATE;
  } else {
    socialInsurance = grossSalary * SOCIAL_INSURANCE_RATE;
    healthInsurance = grossSalary * HEALTH_INSURANCE_RATE;
  }

  const totalInsurance = socialInsurance + healthInsurance;

  // Určení daňové sazby
  const annualGross = grossSalary * 12;
  const annualThreshold = HIGH_TAX_THRESHOLD_MONTHLY * 12; // Převod na roční limit
  const taxRate = annualGross > annualThreshold ? INCOME_TAX_RATE_HIGH : INCOME_TAX_RATE_BASIC;

  // Výpočet daně z příjmu (počítá se z hrubé mzdy)
  let incomeTax = 0;
  if (annualGross > annualThreshold) {
    const basicTaxBase = annualThreshold;
    const highTaxBase = annualGross - annualThreshold;
    const annualTax = basicTaxBase * INCOME_TAX_RATE_BASIC + highTaxBase * INCOME_TAX_RATE_HIGH;
    incomeTax = annualTax / 12; // Převod na měsíční daň
  } else {
    incomeTax = grossSalary * INCOME_TAX_RATE_BASIC;
  }

  // Slevy na dani
  const monthlyTaxCredit = MONTHLY_TAX_CREDIT;

  // Výpočet slevy na děti (progresivní)
  let childTaxCredit = 0;
  if (hasChildren && numberOfChildren > 0) {
    for (let i = 1; i <= numberOfChildren; i++) {
      if (i === 1) childTaxCredit += CHILD_TAX_CREDIT_FIRST;
      else if (i === 2) childTaxCredit += CHILD_TAX_CREDIT_SECOND;
      else childTaxCredit += CHILD_TAX_CREDIT_THIRD_PLUS;
    }
  }

  const disabilityTaxCredit = hasDisability ? DISABILITY_TAX_CREDIT_1_2_MONTHLY : 0;

  const totalTaxCredits = monthlyTaxCredit + childTaxCredit + disabilityTaxCredit;

  // Čistá daň (nemůže být záporná)
  const netTax = Math.max(0, incomeTax - totalTaxCredits);

  // Čistá mzda
  const netSalary = grossSalary - totalInsurance - netTax;

  // Náklady zaměstnavatele
  const employerSocialInsurance = grossSalary * EMPLOYER_SOCIAL_INSURANCE_RATE;
  const employerHealthInsurance = grossSalary * EMPLOYER_HEALTH_INSURANCE_RATE;
  const employerCosts = grossSalary + employerSocialInsurance + employerHealthInsurance;

  // Efektivní daňová sazba
  const taxEffectiveRate = (totalInsurance + netTax) / grossSalary;

  return {
    grossSalary,
    socialInsurance,
    healthInsurance,
    totalInsurance,
    incomeTax,
    taxRate,
    taxDeductions: totalTaxCredits,
    netTax,
    netSalary,
    employerCosts,
    taxEffectiveRate,
    breakdown: { monthlyTaxCredit, childTaxCredit, disabilityTaxCredit, totalTaxCredits },
  };
}
/* ===== KONEC převzaté logiky ===== */

const fmtCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const fmtPct = (rate: number) => `${(rate * 100).toFixed(1).replace('.', ',')} %`;

function NumberField({
  id,
  label,
  value,
  onChange,
  step,
  min,
  max,
  suffix,
}: {
  id: string;
  label: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  step?: string;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-slate-600 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          step={step}
          min={min}
          max={max}
          value={value === 0 ? '' : value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 tabular-nums focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/** Vodorovný skládaný pruh: rozpad hrubé mzdy na čistou + odvody + daň. */
function Breakdown({ data }: { data: NetSalaryData }) {
  const { grossSalary, totalInsurance, netTax, netSalary } = data;
  const total = Math.max(grossSalary, 1);
  const seg = [
    { label: 'Čistá mzda', value: netSalary, color: 'bg-teal-600', text: 'text-teal-700' },
    { label: 'Pojistné', value: totalInsurance, color: 'bg-amber-400', text: 'text-amber-600' },
    { label: 'Daň po slevách', value: netTax, color: 'bg-red-400', text: 'text-red-600' },
  ].filter((s) => s.value > 0.5);

  return (
    <div>
      <div className="flex h-7 w-full overflow-hidden rounded-lg border border-slate-200" role="img" aria-label="Rozpad hrubé mzdy na čistou mzdu, pojistné a daň">
        {seg.map((s) => (
          <div
            key={s.label}
            className={`${s.color} h-full`}
            style={{ width: `${(s.value / total) * 100}%` }}
            title={`${s.label}: ${fmtCZK(s.value)}`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs">
        {seg.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-slate-600">
            <span className={`inline-block w-3 h-3 rounded-sm ${s.color}`} />
            {s.label}
            <span className={`font-semibold tabular-nums ${s.text}`}>{fmtCZK(s.value)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CistyPlatWidget() {
  const [grossSalary, setGrossSalary] = useState<number>(45000);
  const [isPensioner, setIsPensioner] = useState<boolean>(false);
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  const [numberOfChildren, setNumberOfChildren] = useState<number>(1);
  const [hasDisability, setHasDisability] = useState<boolean>(false);

  const data = useMemo(
    () =>
      calculateNetSalary({
        grossSalary,
        isPensioner,
        hasChildren,
        numberOfChildren: hasChildren ? numberOfChildren : 0,
        hasDisability,
      }),
    [grossSalary, isPensioner, hasChildren, numberOfChildren, hasDisability],
  );

  const netShare = grossSalary > 0 ? (data.netSalary / grossSalary) * 100 : 0;
  const belowMinWage = grossSalary > 0 && grossSalary < 22400;

  return (
    <div className="space-y-4">
      {/* Vstupy */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">
          Vaše údaje
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberField
            id="gross"
            label="Hrubá mzda (měsíčně)"
            value={grossSalary}
            min={0}
            max={5000000}
            step="1000"
            onChange={(v) => setGrossSalary(Math.max(0, v))}
            suffix="Kč"
          />
          <div className="space-y-2.5 sm:pt-7">
            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isPensioner}
                onChange={(e) => setIsPensioner(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-200"
              />
              <span className="inline-flex items-center gap-0.5">
                Pracující
                <InfoTip label="Pracující starobní důchodci mají slevu na důchodovém pojištění – z 6,5 % platí 0 %, zůstává jen 0,6 % nemocenské. V kalkulačce počítáme sociální pojištění 0 %, zdravotní 4,5 %.">
                  důchodce
                </InfoTip>
              </span>
            </label>
            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasChildren}
                onChange={(e) => setHasChildren(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-200"
              />
              Uplatňuji daňové zvýhodnění na děti
            </label>
            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDisability}
                onChange={(e) => setHasDisability(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-200"
              />
              Sleva na invaliditu (1./2. stupeň)
            </label>
          </div>
        </div>

        {hasChildren && (
          <div className="mt-4 max-w-[12rem]">
            <NumberField
              id="children"
              label="Počet dětí"
              value={numberOfChildren}
              min={0}
              max={10}
              onChange={(v) => setNumberOfChildren(Math.max(0, Math.min(10, Math.round(v))))}
            />
          </div>
        )}

        {belowMinWage && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-900/80">
                Zadaná hrubá mzda je pod minimální mzdou pro rok 2026 (22 400 Kč). Výpočet
                je orientační – u příjmu pod minimální mzdou platí zvláštní pravidla.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hlavní výsledek */}
      <div className="rounded-2xl bg-teal-700 text-white p-5 md:p-7">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-100">
          <Wallet className="w-4 h-4" /> Vaše čistá mzda
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <p className="text-sm text-teal-100">Čistá mzda měsíčně</p>
            <p className="text-3xl md:text-4xl font-bold tabular-nums mt-1">{fmtCZK(data.netSalary)}</p>
            <p className="text-xs text-teal-200 mt-1">
              {netShare.toFixed(1).replace('.', ',')} % z hrubé mzdy
            </p>
          </div>
          <div className="sm:border-l sm:border-white/15 sm:pl-5">
            <p className="text-sm text-teal-100">Celkové odvody</p>
            <p className="text-2xl md:text-3xl font-bold tabular-nums mt-1">
              {fmtCZK(data.totalInsurance + data.netTax)}
            </p>
            <p className="text-xs text-teal-200 mt-1">
              pojistné + daň, {fmtPct(data.taxEffectiveRate)} z hrubé
            </p>
          </div>
          <div className="sm:border-l sm:border-white/15 sm:pl-5">
            <p className="text-sm text-teal-100">Čistá mzda ročně</p>
            <p className="text-2xl md:text-3xl font-bold tabular-nums mt-1">{fmtCZK(data.netSalary * 12)}</p>
            <p className="text-xs text-teal-200 mt-1">za 12 měsíců</p>
          </div>
        </div>
      </div>

      {/* Vizuální rozpad hrubá → čistá */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">
          Z čeho se skládá vaše hrubá mzda {fmtCZK(data.grossSalary)}
        </p>
        <Breakdown data={data} />
        <p className="mt-3 text-xs text-slate-500 leading-relaxed">
          Z hrubé mzdy se nejdřív strhne pojistné a daň po slevách. Co zbude, je vaše čistá mzda na účet.
        </p>
      </div>

      {/* Detailní rozpad – pojistné + daň */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Odvody zaměstnance */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-amber-100 text-amber-700">
              <TrendingDown className="w-4 h-4" />
            </span>
            <h3 className="font-semibold text-slate-900">
              <InfoTip label="Povinné platby z hrubé mzdy: sociální (důchodové + nemocenské) a zdravotní pojištění. Strhává je zaměstnavatel a odvádí za vás.">
                Odvody
              </InfoTip>{' '}
              zaměstnance
            </h3>
          </div>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Sociální pojištění ({isPensioner ? '0' : '7,1'} %)</dt>
              <dd className="font-semibold text-slate-900 tabular-nums">{fmtCZK(data.socialInsurance)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Zdravotní pojištění (4,5 %)</dt>
              <dd className="font-semibold text-slate-900 tabular-nums">{fmtCZK(data.healthInsurance)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-slate-100 pt-2.5">
              <dt className="font-medium text-slate-900">Celkem pojistné</dt>
              <dd className="font-bold text-amber-600 tabular-nums">{fmtCZK(data.totalInsurance)}</dd>
            </div>
          </dl>
        </div>

        {/* Daň z příjmů */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-red-100 text-red-700">
              <Receipt className="w-4 h-4" />
            </span>
            <h3 className="font-semibold text-slate-900">Daň z příjmů</h3>
          </div>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Daňová sazba</dt>
              <dd className="font-semibold text-slate-900 tabular-nums">{fmtPct(data.taxRate)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Daň před slevami</dt>
              <dd className="font-semibold text-slate-900 tabular-nums">{fmtCZK(data.incomeTax)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">
                <InfoTip label="Sleva na poplatníka 2 570 Kč/měsíc náleží každému zaměstnanci. Odečítá se přímo z vypočtené daně. Připočítávají se slevy na děti a na invaliditu.">
                  Slevy na dani
                </InfoTip>
              </dt>
              <dd className="font-semibold text-emerald-600 tabular-nums">−{fmtCZK(data.taxDeductions)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-slate-100 pt-2.5">
              <dt className="font-medium text-slate-900">Daň po slevách</dt>
              <dd className="font-bold text-red-600 tabular-nums">{fmtCZK(data.netTax)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Slevy na dani – jen pokud nějaké jsou navíc k poplatníkovi */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-md bg-emerald-100 text-emerald-700">
            <BadgePercent className="w-4 h-4" />
          </span>
          <h3 className="font-semibold text-slate-900">Uplatněné slevy na dani</h3>
        </div>
        <dl className="space-y-2.5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">
              <InfoTip label="Základní sleva, kterou má každý zaměstnanec: 2 570 Kč měsíčně (30 840 Kč ročně). Odečítá se přímo z daně.">
                Sleva na poplatníka
              </InfoTip>
            </dt>
            <dd className="font-semibold text-emerald-600 tabular-nums">{fmtCZK(data.breakdown.monthlyTaxCredit)}</dd>
          </div>
          {data.breakdown.childTaxCredit > 0 && (
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Daňové zvýhodnění na děti</dt>
              <dd className="font-semibold text-emerald-600 tabular-nums">{fmtCZK(data.breakdown.childTaxCredit)}</dd>
            </div>
          )}
          {data.breakdown.disabilityTaxCredit > 0 && (
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Sleva na invaliditu (1./2. stupeň)</dt>
              <dd className="font-semibold text-emerald-600 tabular-nums">{fmtCZK(data.breakdown.disabilityTaxCredit)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-3 border-t border-slate-100 pt-2.5">
            <dt className="font-medium text-slate-900">Celkem slevy měsíčně</dt>
            <dd className="font-bold text-emerald-600 tabular-nums">{fmtCZK(data.breakdown.totalTaxCredits)}</dd>
          </div>
        </dl>
      </div>

      {/* Náklady zaměstnavatele */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-200 text-slate-600">
            <Building2 className="w-4 h-4" />
          </span>
          <h3 className="font-semibold text-slate-900">
            Kolik vaše místo stojí{' '}
            <InfoTip label="Tzv. superhrubá mzda byla zrušena v roce 2021, ale zaměstnavatel za vás stále platí pojistné navíc nad rámec hrubé mzdy: 24,8 % na sociální a 9 % na zdravotní pojištění.">
              zaměstnavatele
            </InfoTip>
          </h3>
        </div>
        <dl className="space-y-2.5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">Vaše hrubá mzda</dt>
            <dd className="font-semibold text-slate-900 tabular-nums">{fmtCZK(data.grossSalary)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">Sociální pojištění zaměstnavatele (24,8 %)</dt>
            <dd className="font-semibold text-slate-900 tabular-nums">{fmtCZK(data.grossSalary * EMPLOYER_SOCIAL_INSURANCE_RATE)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">Zdravotní pojištění zaměstnavatele (9 %)</dt>
            <dd className="font-semibold text-slate-900 tabular-nums">{fmtCZK(data.grossSalary * EMPLOYER_HEALTH_INSURANCE_RATE)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-slate-200 pt-2.5">
            <dt className="font-medium text-slate-900">Celkové náklady zaměstnavatele</dt>
            <dd className="font-bold text-slate-900 tabular-nums">{fmtCZK(data.employerCosts)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
