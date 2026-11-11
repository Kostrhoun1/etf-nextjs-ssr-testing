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
import { CisloPole, VysledekChybi } from '@/components/CisloInput';
import MobilniVysledek from '@/components/design-preview/MobilniVysledek';

/**
 * Interaktivní jádro kalkulačky nouzové rezervy.
 *
 * POČET MĚSÍCŮ = REDAKČNÍ PRAVIDLO (audit nástrojů 22. 10. 2026, V12 + S26; rozhodnutí vedoucího):
 * dřív body rizika × násobek 1,0/1,3/1,6 bez zdroje → OSVČ i rodina se splátkami dostaly 3,9 měsíce,
 * zatímco FAQ stránky slibovalo 9–12 měsíců, resp. „spíš 6“. Teď jedno pravidlo, stejné ve widgetu, ve FAQ
 * i v rozbalovacím „Jak počítáme“ (REZERVA_PRAVIDLO níže) – rozumný odhad, ne vědecký zdroj:
 *   zaměstnanec 3 měsíce (nejvýš 6), OSVČ / dohody 6 měsíců (nejvýš 12),
 *   +1 měsíc za každý rizikový faktor (středně stabilní práce +1, nestabilní +2, smlouva na dobu určitou,
 *   pravidelné splátky, jediný příjem v domácnosti se 3+ osobami, věk 50+, základní vzdělání),
 *   domácnost se 2+ osobami a pravidelnými splátkami nejméně 6 měsíců.
 * Původní logika z emergencyFundCalculations.ts (soubor už v repu není). Hlídá scripts/qa-kalkulacky.mjs.
 */

/* ===== TYPY 1:1 z emergencyFundCalculations.ts ===== */
type JobStability = 'stable' | 'moderate' | 'unstable';
type ContractType = 'permanent' | 'fixed_term' | 'freelance';
type AgeGroup = 'middle' | 'senior';
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
/** „1 měsíc“, „2–4 měsíce“, „5+ měsíců“ (dřív vždy „měsíců“ – „4 měsíců“). */
/** Desetinná čísla mají v češtině 2. pád jednotného čísla: „4,8 měsíce“ (dřív „4,8 měsíců“). Rozhoduje
 *  zobrazená (zaokrouhlená na 1 desetinné místo) hodnota: 3,0 → „3 měsíce“. */
const mesiceSlovo = (n: number) => {
  const z = Math.round(n * 10) / 10;
  if (!Number.isInteger(z)) return 'měsíce';
  return z === 1 ? 'měsíc' : z >= 2 && z <= 4 ? 'měsíce' : 'měsíců';
};
const mesice = (n: number) => `${(Math.round(n * 10) / 10).toLocaleString('cs-CZ')} ${mesiceSlovo(n)}`;

/** Redakční pravidlo počtu měsíců (zveřejněné ve widgetu „Jak počítáme“ a ve FAQ stránky). */
const REZERVA_PRAVIDLO = {
  zamestnanec: { zaklad: 3, max: 6 },
  osvc: { zaklad: 6, max: 12 },
  rodinaSeSplatkamiMin: 6,
} as const;

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

  const typ = contractType === 'freelance' ? REZERVA_PRAVIDLO.osvc : REZERVA_PRAVIDLO.zamestnanec;
  const baseMonths = typ.zaklad;

  // +1 měsíc za každý rizikový faktor (nestabilní práce +2).
  let pridano = 0;
  if (jobStability === 'moderate') pridano += 1;
  if (jobStability === 'unstable') pridano += 2;
  if (contractType === 'fixed_term') pridano += 1;
  if (hasDebt) pridano += 1;
  if (!hasSecondIncome && familySize >= 3) pridano += 1;
  if (ageGroup === 'senior') pridano += 1;
  if (education === 'basic') pridano += 1;

  let recommendedMonths = Math.min(typ.max, baseMonths + pridano);
  if (hasDebt && familySize >= 2) recommendedMonths = Math.max(recommendedMonths, REZERVA_PRAVIDLO.rodinaSeSplatkamiMin);

  const riskLevel: RiskLevel = pridano === 0 ? 'low' : pridano <= 2 ? 'medium' : 'high';
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

  // Kolik měsíců spoření ZBÝVÁ do cíle – počítá se s tím, co už člověk má. Dřív se ignorovaly
  // současné úspory: „Čas do cíle 4 měsíce“ a vedle „plná rezerva – naspoříte za 24 měsíců“
  // (audit výpočtů 17. 10. 2026). Splněný krok = „splněno“.
  const zbyva = (cil: number) => {
    const chybi = Math.max(0, cil - currentSavings);
    if (chybi === 0) return 'splněno';
    if (monthlySavingCapacity <= 0) return 'N/A';
    return mesice(Math.ceil(chybi / monthlySavingCapacity));
  };
  const savingStrategy = {
    phase1: { target: phase1Target, timeline: zbyva(phase1Target) },
    phase2: { target: phase2Target, timeline: zbyva(phase2Target) },
    phase3: { target: phase3Target, timeline: zbyva(phase3Target) },
  };

  // Priorita spoření. „Dostatečná“ JEN když nic nechybí (S25: dřív „Dostatečná rezerva“ vedle
  // „Zbývá dospořit 52 000 Kč“ – stačilo 80 % cíle).
  let priorityLevel: PriorityLevel;
  if (shortfall === 0) priorityLevel = 'sufficient';
  else if (currentCoverage < 1) priorityLevel = 'critical';
  else if (currentCoverage < 3) priorityLevel = 'high';
  else priorityLevel = 'moderate';

  return {
    recommendedAmount,
    recommendedMonths,
    currentCoverage,
    shortfall,
    monthsToTarget,
    riskLevel,
    priorityLevel,
    baseAmount: monthlyExpenses * baseMonths,
    riskAdjustment: monthlyExpenses * (recommendedMonths - baseMonths),
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
        className="vyber w-full min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none"
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
  moderate: { text: 'Střední priorita', desc: 'Jste na dobré cestě, ještě kus chybí.', tone: 'teal' },
  sufficient: { text: 'Dostatečná rezerva', desc: 'Máte dobře vybudovanou rezervu.', tone: 'emerald' },
};

const RISK_LABEL: Record<RiskLevel, string> = {
  low: 'Nízké',
  medium: 'Střední',
  high: 'Vysoké',
};

export default function NouzovaRezervaWidget() {
  // Vstupy – stejné výchozí hodnoty jako původní EmergencyFundCalculator
  // null = pole je prázdné / nedopsané → žádný výsledek ani verdikt („—“), nikdy tichá 0.
  const [monthlyExpenses, setMonthlyExpenses] = useState<number | null>(40000);
  const [currentSavings, setCurrentSavings] = useState<number | null>(100000);
  const [monthlySavingCapacity, setMonthlySavingCapacity] = useState<number | null>(5000);
  const [familySize, setFamilySize] = useState<number | null>(2);

  const [jobStability, setJobStability] = useState<JobStability>('stable');
  const [contractType, setContractType] = useState<ContractType>('permanent');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('middle');
  const [education, setEducation] = useState<Education>('high_school');
  const [hasSecondIncome, setHasSecondIncome] = useState<boolean>(false);
  const [hasDebt, setHasDebt] = useState<boolean>(false);

  // Výsledek jen z úplných a smysluplných vstupů. Při prázdných/nulových výdajích dřív vyšlo
  // „0 Kč“ a zároveň „Kritická priorita“ i „Cíl splněn“ (protimluv, test 22. 10. 2026).
  const vstupyOk =
    monthlyExpenses != null && monthlyExpenses > 0 &&
    currentSavings != null && monthlySavingCapacity != null && familySize != null;
  const r = useMemo(
    () =>
      !vstupyOk ? null : calculateEmergencyFund({
        monthlyExpenses: Math.max(0, monthlyExpenses ?? 0),
        jobStability,
        familySize: Math.max(1, familySize ?? 1),
        hasSecondIncome,
        hasDebt,
        currentSavings: Math.max(0, currentSavings ?? 0),
        monthlySavingCapacity: Math.max(0, monthlySavingCapacity ?? 0),
        contractType,
        ageGroup,
        education,
      }),
    [
      vstupyOk,
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

  const currentAmount = Math.max(0, currentSavings ?? 0);
  const progressPercentage = r
    ? Math.min(100, r.recommendedMonths > 0 ? (r.currentCoverage / r.recommendedMonths) * 100 : 0)
    : 0;
  const priority = r ? PRIORITY_META[r.priorityLevel] : null;
  // Spoří 0 Kč a rezerva chybí → k cíli se nedostane. Dřív „Čas do cíle: Hotovo – cíl je splněn“.
  const nikdy = r != null && r.shortfall > 0 && (monthlySavingCapacity ?? 0) <= 0;

  const warnExpenses = monthlyExpenses == null || monthlyExpenses <= 0;
  const chybi = [
    (monthlyExpenses == null || monthlyExpenses <= 0) && 'měsíční výdaje',
    currentSavings == null && 'současné úspory (i 0)',
    monthlySavingCapacity == null && 'měsíční spoření (i 0)',
    familySize == null && 'počet osob',
  ].filter(Boolean).join(', ');

  return (
    <div className="space-y-4">
      {/* 3.2: výsledek nahoře na mobilu */}
      {r && priority && (
        <MobilniVysledek cil="nouzova-vysledek-cil" stitek="Doporučená rezerva" hodnota={fmtCZK(r.recommendedAmount)}
          doplnek={`${mesice(r.recommendedMonths)} nezbytných výdajů`} />
      )}
      {/* Vstupní parametry */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">
          Vaše situace
        </p>

        {/* Finanční údaje */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CisloPole
            id="expenses"
            label="Měsíční výdaje"
            value={monthlyExpenses}
            min={0}
            max={5000000}
            step="1000"
            onChange={setMonthlyExpenses}
            suffix="Kč"
          />
          <CisloPole
            id="savings"
            label="Současné úspory"
            value={currentSavings}
            min={0}
            max={50000000}
            step="10000"
            onChange={setCurrentSavings}
            suffix="Kč"
          />
          <CisloPole
            id="capacity"
            label="Měsíční spoření"
            value={monthlySavingCapacity}
            min={0}
            max={1000000}
            step="1000"
            onChange={setMonthlySavingCapacity}
            suffix="Kč"
          />
          <CisloPole
            id="family"
            label="Počet osob v domácnosti"
            value={familySize}
            min={1}
            max={10}
            onChange={setFamilySize}
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
              { value: 'middle', label: 'Do 49 let' },
              { value: 'senior', label: '50 let a více' },
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
            label="Mám pravidelné splátky"
            checked={hasDebt}
            onChange={setHasDebt}
          />
        </div>

        {/* S26: pravidlo počtu měsíců veřejně – redakční odhad, ne vědecký zdroj. */}
        <details className="mt-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600" data-qa="nouzova-pravidlo">
          <summary className="cursor-pointer list-none px-3 py-2.5 min-h-[44px] flex items-center text-slate-700">
            Jak počítáme počet měsíců (naše redakční pravidlo)
          </summary>
          <div className="px-3 pb-3 space-y-1.5 leading-relaxed">
            <p>
              Základ: zaměstnanec {REZERVA_PRAVIDLO.zamestnanec.zaklad} měsíce výdajů (nejvýš {REZERVA_PRAVIDLO.zamestnanec.max}),
              OSVČ a práce na dohody {REZERVA_PRAVIDLO.osvc.zaklad} měsíců (nejvýš {REZERVA_PRAVIDLO.osvc.max}) – příjem kolísá a bez nemocenské.
            </p>
            <p>
              +1 měsíc za každý faktor: středně stabilní práce (nestabilní +2), smlouva na dobu určitou, pravidelné splátky,
              jediný příjem v domácnosti se 3 a více osobami, věk 50+ a základní vzdělání (hledání nové práce obvykle trvá déle).
            </p>
            <p>
              Domácnost se 2 a více osobami a pravidelnými splátkami: nejméně {REZERVA_PRAVIDLO.rodinaSeSplatkamiMin} měsíců.
            </p>
            <p className="text-xs text-slate-500">
              Je to rozumný odhad podle běžných doporučení (3–6 měsíců u zaměstnanců, víc u OSVČ), ne výsledek studie.
              Upravte ho podle sebe.
            </p>
          </div>
        </details>

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

      {/* Výsledky – jen z úplných vstupů. Bez nich žádné číslo ani verdikt. */}
      {!r || !priority ? (
        <VysledekChybi co={chybi || undefined} />
      ) : (<>
      {/* Hlavní výsledkový panel */}
      <div id="nouzova-vysledek-cil" className="scroll-mt-20" />
      <div className="rounded-2xl bg-teal-700 text-white p-5 md:p-7" data-qa="nouzova-vysledek">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-100">
          <ShieldAlert className="w-4 h-4" /> Doporučená nouzová rezerva
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-3xl md:text-4xl font-bold tabular-nums mt-1" data-qa="nouzova-castka">
              {fmtCZK(r.recommendedAmount)}
            </p>
            <p className="text-sm text-teal-100 mt-1">
              {mesice(r.recommendedMonths)} nezbytných výdajů
            </p>
            {/* Riziko výpadku příjmu určuje, na kolik měsíců rezerva má být (3–12). Dřív samostatná
                karta „rizikový profil“ vedle „priority“ – působilo to jako dva protichůdné verdikty. */}
            <p className="mt-2 inline-flex flex-wrap items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs text-teal-50">
              <TrendingUp className="w-3.5 h-3.5" />
              Riziko výpadku příjmu: <strong className="font-semibold">{RISK_LABEL[r.riskLevel].toLowerCase()}</strong>
              <span className="text-teal-200">(určuje počet měsíců)</span>
            </p>
          </div>
          <div className="sm:border-l sm:border-white/15 sm:pl-5">
            <p className="text-sm text-teal-100">Aktuálně máte naspořeno</p>
            <p className="text-3xl md:text-4xl font-bold tabular-nums mt-1">{fmtCZK(currentAmount)}</p>
            <p className="text-xs text-teal-200 mt-1">
              pokryje {mesice(r.currentCoverage)} výdajů
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

      {/* Tři metriky: naléhavost / chybí / čas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Naléhavost spoření (podle toho, kolik měsíců výdajů už máte) */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            {priority.tone === 'emerald' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : priority.tone === 'red' ? (
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <Target className="w-4 h-4 text-teal-700 shrink-0" />
            )}
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Jak naléhavě spořit</p>
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
          <p className="text-xs text-slate-500 mt-0.5">{priority.desc} Teď máte na {mesice(r.currentCoverage)}.</p>
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
          {nikdy ? (
            <>
              <p className="text-lg font-bold text-slate-400">—</p>
              <p className="text-xs text-slate-500 mt-0.5">bez měsíčního spoření se k cíli nedostanete</p>
            </>
          ) : r.monthsToTarget > 0 ? (
            <>
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                {mesice(r.monthsToTarget)}
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
                {data.timeline === 'splněno'
                  ? <span className="text-emerald-700 font-medium">Splněno – tolik už máte</span>
                  : data.timeline === 'N/A'
                    ? <>Bez měsíčního spoření se sem nedostanete</>
                    : <>Naspoříte za <span className="text-slate-600 font-medium">{data.timeline}</span></>}
              </p>
            </div>
          ))}
        </div>
      </div>
      </>)}
    </div>
  );
}
