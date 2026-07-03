'use client';

import React, { useMemo, useState } from 'react';
import {
  Wallet,
  ShieldAlert,
  Target,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PiggyBank,
  TrendingUp,
} from 'lucide-react';

/**
 * Interaktivní jádro kalkulačky nouzové rezervy – PRESKINOVANÁ verze.
 * Výpočetní logika je 1:1 převzata z src/utils/emergencyFundCalculations.ts
 * (calculateEmergencyFund) – měněn je POUZE vizuál (teal/slate, karty design systému).
 * Logiku neměnit.
 */

/* ===== TYPY 1:1 z emergencyFundCalculations.ts ===== */
type JobStability = 'stable' | 'moderate' | 'unstable';
type ContractType = 'permanent' | 'fixed_term' | 'freelance';
type AgeGroup = 'young' | 'middle' | 'senior';
type Education = 'basic' | 'high_school' | 'university';
type RiskLevel = 'low' | 'medium' | 'high';
type PriorityLevel = 'critical' | 'high' | 'moderate' | 'sufficient';

interface EmergencyFundParams {
  monthlyExpenses: number;
  jobStability: JobStability;
  familySize: number;
  hasSecondIncome: boolean;
  hasDebt: boolean;
  currentSavings: number;
  monthlySavingCapacity: number;
  contractType: ContractType;
  ageGroup: AgeGroup;
  education: Education;
}

interface EmergencyFundData {
  recommendedAmount: number;
  recommendedMonths: number;
  currentCoverage: number;
  shortfall: number;
  monthsToTarget: number;
  riskLevel: RiskLevel;
  priorityLevel: PriorityLevel;
  baseAmount: number;
  riskAdjustment: number;
  savingStrategy: {
    phase1: { target: number; timeline: string };
    phase2: { target: number; timeline: string };
    phase3: { target: number; timeline: string };
  };
}

/* ===== VÝPOČET 1:1 z calculateEmergencyFund (řádky 63–217) – NEMĚNIT ===== */
function calculateEmergencyFund(params: EmergencyFundParams): EmergencyFundData {
  const {
    monthlyExpenses,
    jobStability,
    familySize,
    hasSecondIncome,
    hasDebt,
    currentSavings,
    monthlySavingCapacity,
    contractType,
    ageGroup,
    education,
  } = params;

  // Základní výpočet podle stability zaměstnání
  let baseMonths: number;
  switch (jobStability) {
    case 'stable':
      baseMonths = 3;
      break;
    case 'moderate':
      baseMonths = 6;
      break;
    case 'unstable':
      baseMonths = 9;
      break;
  }

  // Bodové hodnocení rizika
  let riskPoints = 0;
  if (jobStability === 'moderate') riskPoints += 1;
  if (jobStability === 'unstable') riskPoints += 2;
  if (contractType === 'fixed_term') riskPoints += 1;
  if (contractType === 'freelance') riskPoints += 2;
  if (ageGroup === 'senior') riskPoints += 1;
  if (ageGroup === 'young') riskPoints -= 1;
  if (education === 'basic') riskPoints += 1;
  if (education === 'university') riskPoints -= 1;
  if (!hasSecondIncome) riskPoints += 1;
  if (hasDebt) riskPoints += 1;
  if (familySize > 2) riskPoints += familySize - 2;

  // Kategorizace celkového rizika
  let riskLevel: RiskLevel;
  if (riskPoints <= 1) riskLevel = 'low';
  else if (riskPoints <= 4) riskLevel = 'medium';
  else riskLevel = 'high';

  // Finální multiplikátor na základě kategorie rizika
  let riskMultiplier: number;
  switch (riskLevel) {
    case 'low':
      riskMultiplier = 1.0;
      break;
    case 'medium':
      riskMultiplier = 1.3;
      break;
    case 'high':
      riskMultiplier = 1.6;
      break;
  }

  const familyMultiplier = 1;

  // Finální výpočet
  const adjustedMonths = baseMonths * riskMultiplier * familyMultiplier;
  const recommendedMonths = Math.max(3, Math.min(12, adjustedMonths)); // Min 3, max 12 měsíců
  const recommendedAmount = monthlyExpenses * recommendedMonths;

  // Současné pokrytí
  const currentCoverage = monthlyExpenses > 0 ? currentSavings / monthlyExpenses : 0;
  const shortfall = Math.max(0, recommendedAmount - currentSavings);
  const monthsToTarget =
    monthlySavingCapacity > 0 && shortfall > 0 ? Math.ceil(shortfall / monthlySavingCapacity) : 0;

  // Strategie spoření
  const phase1Target = monthlyExpenses * 1; // První měsíc
  const phase2Target = monthlyExpenses * Math.min(3, recommendedMonths); // 3 měsíce
  const phase3Target = recommendedAmount; // Celá částka

  const savingStrategy = {
    phase1: {
      target: phase1Target,
      timeline:
        monthlySavingCapacity > 0
          ? `${Math.ceil(phase1Target / monthlySavingCapacity)} měsíců`
          : 'N/A',
    },
    phase2: {
      target: phase2Target,
      timeline:
        monthlySavingCapacity > 0
          ? `${Math.ceil(phase2Target / monthlySavingCapacity)} měsíců`
          : 'N/A',
    },
    phase3: {
      target: phase3Target,
      timeline:
        monthlySavingCapacity > 0
          ? `${Math.ceil(phase3Target / monthlySavingCapacity)} měsíců`
          : 'N/A',
    },
  };

  // Priorita spoření
  let priorityLevel: PriorityLevel;
  if (currentCoverage < 1) priorityLevel = 'critical';
  else if (currentCoverage < 3) priorityLevel = 'high';
  else if (currentCoverage < recommendedMonths * 0.8) priorityLevel = 'moderate';
  else priorityLevel = 'sufficient';

  return {
    recommendedAmount,
    recommendedMonths,
    currentCoverage,
    shortfall,
    monthsToTarget,
    riskLevel,
    priorityLevel,
    baseAmount: monthlyExpenses * baseMonths,
    riskAdjustment: monthlyExpenses * baseMonths * (riskMultiplier - 1),
    savingStrategy,
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

const fmtMonths = (v: number) => v.toLocaleString('cs-CZ', { maximumFractionDigits: 1 });

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
  label: string;
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
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
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

function SelectField<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-slate-600 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleField({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2.5 min-h-[44px] cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

const PRIORITY_META: Record<
  PriorityLevel,
  { text: string; desc: string; tone: 'red' | 'amber' | 'teal' | 'emerald' }
> = {
  critical: { text: 'Kritická priorita', desc: 'Začněte spořit co nejdříve.', tone: 'red' },
  high: { text: 'Vysoká priorita', desc: 'Rezerva by měla být vyšší.', tone: 'amber' },
  moderate: { text: 'Střední priorita', desc: 'Jste na dobré cestě.', tone: 'teal' },
  sufficient: { text: 'Dostatečná rezerva', desc: 'Máte dobře vybudovanou rezervu.', tone: 'emerald' },
};

const RISK_LABEL: Record<RiskLevel, string> = {
  low: 'Nízké',
  medium: 'Střední',
  high: 'Vysoké',
};

export default function NouzovaRezervaWidget() {
  // Vstupy – stejné výchozí hodnoty jako původní EmergencyFundCalculator
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(40000);
  const [currentSavings, setCurrentSavings] = useState<number>(100000);
  const [monthlySavingCapacity, setMonthlySavingCapacity] = useState<number>(5000);
  const [familySize, setFamilySize] = useState<number>(2);

  const [jobStability, setJobStability] = useState<JobStability>('stable');
  const [contractType, setContractType] = useState<ContractType>('permanent');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('middle');
  const [education, setEducation] = useState<Education>('high_school');
  const [hasSecondIncome, setHasSecondIncome] = useState<boolean>(false);
  const [hasDebt, setHasDebt] = useState<boolean>(false);

  const r = useMemo(
    () =>
      calculateEmergencyFund({
        monthlyExpenses: Math.max(0, monthlyExpenses),
        jobStability,
        familySize: Math.max(1, familySize),
        hasSecondIncome,
        hasDebt,
        currentSavings: Math.max(0, currentSavings),
        monthlySavingCapacity: Math.max(0, monthlySavingCapacity),
        contractType,
        ageGroup,
        education,
      }),
    [
      monthlyExpenses,
      currentSavings,
      monthlySavingCapacity,
      familySize,
      jobStability,
      contractType,
      ageGroup,
      education,
      hasSecondIncome,
      hasDebt,
    ]
  );

  const currentAmount = Math.max(0, currentSavings);
  const progressPercentage = Math.min(
    100,
    r.recommendedMonths > 0 ? (r.currentCoverage / r.recommendedMonths) * 100 : 0
  );
  const priority = PRIORITY_META[r.priorityLevel];

  const warnExpenses = monthlyExpenses <= 0;

  return (
    <div className="space-y-4">
      {/* Vstupní parametry */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">
          Vaše situace
        </p>

        {/* Finanční údaje */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NumberField
            id="expenses"
            label="Měsíční výdaje"
            value={monthlyExpenses}
            min={0}
            max={5000000}
            step="1000"
            onChange={(v) => setMonthlyExpenses(Math.max(0, v))}
            suffix="Kč"
          />
          <NumberField
            id="savings"
            label="Současné úspory"
            value={currentSavings}
            min={0}
            max={50000000}
            step="10000"
            onChange={(v) => setCurrentSavings(Math.max(0, v))}
            suffix="Kč"
          />
          <NumberField
            id="capacity"
            label="Měsíční spoření"
            value={monthlySavingCapacity}
            min={0}
            max={1000000}
            step="1000"
            onChange={(v) => setMonthlySavingCapacity(Math.max(0, v))}
            suffix="Kč"
          />
          <NumberField
            id="family"
            label="Počet osob v domácnosti"
            value={familySize}
            min={1}
            max={10}
            onChange={(v) => setFamilySize(Math.max(1, Math.min(10, v)))}
          />
        </div>

        {/* Rizikové faktory */}
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mt-6 mb-3">
          Rizikové faktory
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SelectField
            id="job"
            label="Stabilita zaměstnání"
            value={jobStability}
            onChange={setJobStability}
            options={[
              { value: 'stable', label: 'Stabilní' },
              { value: 'moderate', label: 'Středně stabilní' },
              { value: 'unstable', label: 'Nestabilní' },
            ]}
          />
          <SelectField
            id="contract"
            label="Typ smlouvy"
            value={contractType}
            onChange={setContractType}
            options={[
              { value: 'permanent', label: 'Na dobu neurčitou' },
              { value: 'fixed_term', label: 'Na dobu určitou' },
              { value: 'freelance', label: 'Dohody / OSVČ' },
            ]}
          />
          <SelectField
            id="age"
            label="Věková skupina"
            value={ageGroup}
            onChange={setAgeGroup}
            options={[
              { value: 'young', label: '20–35 let' },
              { value: 'middle', label: '36–50 let' },
              { value: 'senior', label: '50+ let' },
            ]}
          />
          <SelectField
            id="education"
            label="Vzdělání"
            value={education}
            onChange={setEducation}
            options={[
              { value: 'university', label: 'Vysokoškolské' },
              { value: 'high_school', label: 'Středoškolské' },
              { value: 'basic', label: 'Základní' },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <ToggleField
            id="second-income"
            label="V domácnosti je druhý příjem"
            checked={hasSecondIncome}
            onChange={setHasSecondIncome}
          />
          <ToggleField
            id="debt"
            label="Mám dluhy (hypotéka, úvěr)"
            checked={hasDebt}
            onChange={setHasDebt}
          />
        </div>

        {warnExpenses && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-900/80">
                Zadejte své měsíční výdaje – z nich se počítá velikost rezervy.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hlavní výsledkový panel */}
      <div className="rounded-2xl bg-teal-700 text-white p-5 md:p-7">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-100">
          <ShieldAlert className="w-4 h-4" /> Doporučená nouzová rezerva
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-3xl md:text-4xl font-bold tabular-nums mt-1">
              {fmtCZK(r.recommendedAmount)}
            </p>
            <p className="text-sm text-teal-100 mt-1">
              {fmtMonths(r.recommendedMonths)} měsíců nezbytných výdajů
            </p>
          </div>
          <div className="sm:border-l sm:border-white/15 sm:pl-5">
            <p className="text-sm text-teal-100">Aktuálně máte naspořeno</p>
            <p className="text-3xl md:text-4xl font-bold tabular-nums mt-1">{fmtCZK(currentAmount)}</p>
            <p className="text-xs text-teal-200 mt-1">
              pokryje {fmtMonths(r.currentCoverage)} měsíců výdajů
            </p>
          </div>
        </div>
      </div>

      {/* Pokrok k cíli – vizuál (progress bar) */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Pokrok k cíli
          </p>
          <span className="text-sm font-semibold text-slate-900 tabular-nums">
            {progressPercentage.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} %
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-teal-600 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-slate-400 tabular-nums">
          <span>{fmtCZK(currentAmount)}</span>
          <span>cíl {fmtCZK(r.recommendedAmount)}</span>
        </div>
      </div>

      {/* Tři metriky: priorita / chybí / čas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Priorita */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            {priority.tone === 'emerald' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : priority.tone === 'red' ? (
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <Target className="w-4 h-4 text-teal-700 shrink-0" />
            )}
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Priorita</p>
          </div>
          <p
            className={`text-lg font-bold ${
              priority.tone === 'red'
                ? 'text-red-600'
                : priority.tone === 'amber'
                  ? 'text-amber-600'
                  : priority.tone === 'emerald'
                    ? 'text-emerald-600'
                    : 'text-teal-700'
            }`}
          >
            {priority.text}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{priority.desc}</p>
        </div>

        {/* Kolik chybí dospořit */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-teal-700 shrink-0" />
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Zbývá dospořit
            </p>
          </div>
          {r.shortfall > 0 ? (
            <>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{fmtCZK(r.shortfall)}</p>
              <p className="text-xs text-slate-500 mt-0.5">do plné rezervy</p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-emerald-600">Cíl splněn</p>
              <p className="text-xs text-slate-500 mt-0.5">rezervu máte naspořenou</p>
            </>
          )}
        </div>

        {/* Čas do cíle */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-teal-700 shrink-0" />
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Čas do cíle
            </p>
          </div>
          {r.monthsToTarget > 0 ? (
            <>
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                {r.monthsToTarget.toLocaleString('cs-CZ')} měsíců
              </p>
              <p className="text-xs text-slate-500 mt-0.5">při současném tempu spoření</p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-emerald-600">Hotovo</p>
              <p className="text-xs text-slate-500 mt-0.5">cíl je splněn</p>
            </>
          )}
        </div>
      </div>

      {/* Upozornění na dlouhé spoření (1:1 práh > 24 měsíců) */}
      {r.monthsToTarget > 24 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 md:p-5">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-sm text-amber-900/80">
              <p className="font-semibold text-amber-800">Spoření bude trvat přes 2 roky</p>
              <ul className="mt-1 space-y-0.5">
                <li>Zvažte snížení nezbytných výdajů.</li>
                <li>Zkuste zvýšit měsíční částku na spoření.</li>
                <li>Hledejte dodatečný příjem.</li>
                <li>Začněte menším cílem – třeba rezervou na 3 měsíce.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Plán spoření ve třech fázích (1:1 phase1/2/3) */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">
          Plán spoření ve třech krocích
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              n: 1,
              title: 'Nouzová základna',
              desc: 'Pokryje první měsíc bez příjmu.',
              data: r.savingStrategy.phase1,
              Icon: PiggyBank,
            },
            {
              n: 2,
              title: 'Základní rezerva',
              desc: 'Pokryje 3 měsíce běžných výdajů.',
              data: r.savingStrategy.phase2,
              Icon: ShieldAlert,
            },
            {
              n: 3,
              title: 'Plná rezerva',
              desc: 'Optimální pokrytí podle vašeho profilu.',
              data: r.savingStrategy.phase3,
              Icon: Target,
            },
          ].map(({ n, title, desc, data, Icon }) => (
            <div key={n} className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-100 text-teal-700 text-sm font-semibold">
                  {n}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-900 text-sm">
                  <Icon className="w-4 h-4 text-teal-700 shrink-0" /> {title}
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900 tabular-nums">{fmtCZK(data.target)}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
              <p className="text-xs text-slate-400 mt-2">
                Naspoříte za <span className="text-slate-600 font-medium">{data.timeline}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Rizikový profil */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm text-slate-600">
          <TrendingUp className="w-4 h-4 text-teal-700 shrink-0" /> Váš rizikový profil
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium border ${
            r.riskLevel === 'low'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : r.riskLevel === 'medium'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {RISK_LABEL[r.riskLevel]} riziko
        </span>
      </div>
    </div>
  );
}
