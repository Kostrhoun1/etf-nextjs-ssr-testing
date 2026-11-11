'use client';

import React, { useState, useMemo } from 'react';
import { Wallet, TrendingDown, Receipt, BadgePercent, Building2, AlertTriangle } from 'lucide-react';
import InfoTip from './InfoTip';
import { CisloPole, VysledekChybi } from '@/components/CisloInput';
import MobilniVysledek from '@/components/design-preview/MobilniVysledek';

/**
 * Interaktivní jádro kalkulačky čisté mzdy 2026 (design systém teal/slate).
 *
 * Logika původně z netSalaryCalculations.ts (soubor už v repu není – N17). Audit nástrojů 22. 10. 2026
 * doplnil zákonné zaokrouhlení (N14), minimální vyměřovací základ zdravotního pojištění (S24), hranici
 * vyplacení daňového bonusu 50 Kč (N13), přesné štítky (V11, N12) a stejný základ procent (S23).
 * Chybná daň = kritická chyba – každá změna sazeb jen se zdrojem a regresním případem v scripts/qa-kalkulacky.mjs.
 *
 * ZÁKONNÁ PRAVIDLA (ověřeno 22. 10. 2026):
 *  - základ zálohy na daň: do 100 Kč na celé koruny nahoru, nad 100 Kč na celé STOKORUNY nahoru;
 *    záloha = 15 % do 3× průměrné mzdy (146 901 Kč měsíčně) + 23 % z části nad; záloha na celé koruny nahoru
 *    (§ 38h odst. 1–3 zákona 586/1992 Sb., ZDP),
 *  - měsíční daňový bonus se vyplácí, jen když činí alespoň 50 Kč, a jen při příjmu ≥ ½ minimální mzdy (§ 35d odst. 4 ZDP),
 *  - sociální pojištění zaměstnance 7,1 % (6,5 % důchodové + 0,6 % nemocenské), pracující starobní důchodce
 *    sleva 6,5 p. b. → 0,6 %; pojistné na celé koruny nahoru (§ 7 zákona 589/1992 Sb.),
 *  - zdravotní: 13,5 % z vyměřovacího základu na celé koruny nahoru, zaměstnanec třetinu (zaokrouhleno nahoru),
 *    zaměstnavatel zbytek (VZP „Výpočet pojistného“; Práce a mzda: základ 22 880 → 3 089 = 1 030 + 2 059),
 *  - minimální vyměřovací základ zdravotního = minimální mzda (2026: 22 400 Kč); při nižší mzdě zaměstnanec
 *    doplácí 13,5 % z rozdílu (§ 3 odst. 7 a § 4 zákona 592/1992 Sb.; VZP „Kdy se provádí doplatek“), pokud
 *    nespadá do výjimky (např. státní pojištěnec – student, poživatel důchodu, rodič na rodičovské; osoba ZTP/P).
 */

/* ===== KONSTANTY 2026 ===== */
const SOCIAL_INSURANCE_RATE = 0.071; // 7,1 % (6,5 % důchodové + 0,6 % nemocenské)
// Pracující starobní důchodce: sleva na pojistném 6,5 % (důchodová část) → platí jen 0,6 % nemocenské.
// Dřív 0 % (audit výpočtů 17. 10. 2026; ověřeno MPSV/ČSSZ: 7,1 % = 6,5 % důchodové + 0,6 % nemocenské).
const PENSIONER_SOCIAL_DISCOUNT = 0.065;
// Daňový bonus na děti: jen při měsíčním příjmu ≥ ½ minimální mzdy (2026: 22 400 / 2 = 11 200 Kč).
const CHILD_BONUS_MIN_INCOME = 11200;

const INCOME_TAX_RATE_BASIC = 0.15; // 15 %
const INCOME_TAX_RATE_HIGH = 0.23; // 23 %
const AVERAGE_SALARY_2026 = 48967; // Kč (průměrná mzda pro daňové účely 2026)
const HIGH_TAX_THRESHOLD_MONTHLY = AVERAGE_SALARY_2026 * 36 / 12; // 146 901 Kč měsíčně

const MONTHLY_TAX_CREDIT = 2570; // Kč
const MIN_WAGE_2026 = 22400; // Kč – minimální mzda 2026 = minimální vyměřovací základ zdravotního pojištění
const HEALTH_TOTAL_RATE = 0.135; // 13,5 % zdravotní celkem (zaměstnanec ⅓, zaměstnavatel ⅔)
const MIN_TAX_BONUS = 50; // Kč – měsíční daňový bonus pod 50 Kč se nevyplácí (§ 35d odst. 4 ZDP)
/** Zaokrouhlení na celé koruny nahoru (s tolerancí plovoucí čárky: 0,135 × 20 000 = 2 700,0000000000005). */
const nahoru = (x: number) => Math.ceil(x - 1e-9);
const CHILD_TAX_CREDIT_FIRST = 1267; // Kč za 1. dítě
const CHILD_TAX_CREDIT_SECOND = 1860; // Kč za 2. dítě
const CHILD_TAX_CREDIT_THIRD_PLUS = 2320; // Kč za 3. a další dítě
const DISABILITY_TAX_CREDIT_1_2_MONTHLY = 210; // Kč pro invaliditu 1./2. stupeň

const EMPLOYER_SOCIAL_INSURANCE_RATE = 0.248; // 24,8 %
// STROP sociálního pojištění (zaměstnanec i zaměstnavatel): maximální vyměřovací základ = 48× průměrná mzda
// = 48 × 48 967 = 2 350 416 Kč ročně (ČSSZ, Přehled nejdůležitějších údajů pro sociální zabezpečení v roce 2026).
// Nad strop se sociální pojištění neplatí; zdravotní pojištění strop od 2013 nemá. Dřív chyběl → nad
// ~195 868 Kč měsíčně byla čistá mzda podhodnocená (revize 22. 10. 2026). Měsíčně počítáme PRŮMĚR za rok
// (ve skutečnosti se platí plně, dokud roční úhrn nedosáhne stropu, pak nic).
const MAX_SOCIAL_BASE_ANNUAL_2026 = 48 * AVERAGE_SALARY_2026; // 2 350 416 Kč
const MAX_SOCIAL_BASE_MONTHLY = MAX_SOCIAL_BASE_ANNUAL_2026 / 12; // 195 868 Kč

interface NetSalaryParams {
  grossSalary: number;
  isPensioner: boolean;
  hasChildren: boolean;
  numberOfChildren: number;
  hasDisability: boolean;
  /** Na minimální vyměřovací základ zdravotního pojištění se vztahuje výjimka (student, důchodce, ZTP/P…). */
  minZakladVyjimka: boolean;
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
  /** Daňový bonus na děti (vyplácí se, když zvýhodnění na děti převýší daň). */
  taxBonus: number;
  netSalary: number;
  employerCosts: number;
  employerSocialInsurance: number;
  employerHealthInsurance: number;
  /** Hrubá nad stropem sociálního pojištění → měsíční částky jsou průměr za rok. */
  socialCapped: boolean;
  /** Doplatek zdravotního pojištění do minimálního vyměřovacího základu (hradí zaměstnanec). */
  doplatekZdravotni: number;
  /** Zaokrouhlený základ pro výpočet zálohy (celé stokoruny nahoru). */
  zakladZalohy: number;
  /** Bonus vyšel kladný, ale pod 50 Kč → nevyplácí se. */
  bonusPodMinimem: number;
  taxEffectiveRate: number;
  breakdown: {
    monthlyTaxCredit: number;
    childTaxCredit: number;
    disabilityTaxCredit: number;
    totalTaxCredits: number;
  };
}

function calculateNetSalary(params: NetSalaryParams): NetSalaryData {
  const { grossSalary, isPensioner, hasChildren, numberOfChildren, hasDisability, minZakladVyjimka } = params;

  // Sociální pojištění – jen do stropu (maximální vyměřovací základ, měsíčně průměr za rok), na koruny nahoru.
  const socialBase = Math.min(grossSalary, MAX_SOCIAL_BASE_MONTHLY);
  const socialRate = isPensioner ? SOCIAL_INSURANCE_RATE - PENSIONER_SOCIAL_DISCOUNT : SOCIAL_INSURANCE_RATE;
  const socialInsurance = nahoru(socialBase * socialRate);

  // Zdravotní – 13,5 % celkem na koruny nahoru, zaměstnanec třetinu (nahoru), zaměstnavatel zbytek. Bez stropu.
  const zdravotniCelkem = nahoru(grossSalary * HEALTH_TOTAL_RATE);
  const zdravotniZamestnanec = nahoru(zdravotniCelkem / 3);
  const employerHealthInsurance = zdravotniCelkem - zdravotniZamestnanec;
  // Pod minimální mzdou: zaměstnanec doplácí 13,5 % z rozdílu do minimálního základu (pokud nemá výjimku;
  // poživatel důchodu je státní pojištěnec → výjimka automaticky).
  const doplatekZdravotni = !minZakladVyjimka && !isPensioner && grossSalary < MIN_WAGE_2026
    ? nahoru(MIN_WAGE_2026 * HEALTH_TOTAL_RATE) - zdravotniCelkem
    : 0;
  const healthInsurance = zdravotniZamestnanec + doplatekZdravotni;

  const totalInsurance = socialInsurance + healthInsurance;

  // Záloha na daň (§ 38h ZDP): základ na stokoruny nahoru, 15 % / 23 % nad 3× průměrnou mzdu, na koruny nahoru.
  const zakladZalohy = grossSalary <= 100 ? nahoru(grossSalary) : Math.ceil(grossSalary / 100 - 1e-9) * 100;
  const incomeTax = nahoru(
    Math.min(zakladZalohy, HIGH_TAX_THRESHOLD_MONTHLY) * INCOME_TAX_RATE_BASIC +
    Math.max(0, zakladZalohy - HIGH_TAX_THRESHOLD_MONTHLY) * INCOME_TAX_RATE_HIGH,
  );
  const taxRate = zakladZalohy > HIGH_TAX_THRESHOLD_MONTHLY ? INCOME_TAX_RATE_HIGH : INCOME_TAX_RATE_BASIC;

  // Slevy na dani
  const monthlyTaxCredit = MONTHLY_TAX_CREDIT;
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

  // Pořadí podle zákona: sleva na poplatníka a invaliditu sníží daň nejvýš na nulu; zvýhodnění na děti
  // se odečte potom a co přebývá, je DAŇOVÝ BONUS – vyplatí se při příjmu ≥ ½ minimální mzdy a jen
  // když činí aspoň 50 Kč (§ 35d odst. 4 ZDP; dřív se vyplácelo i 12 Kč – N13).
  const danPoSlevach = Math.max(0, incomeTax - monthlyTaxCredit - disabilityTaxCredit);
  const poDetech = danPoSlevach - childTaxCredit;
  const netTax = Math.max(0, poDetech);
  const naBonus = poDetech < 0 && grossSalary >= CHILD_BONUS_MIN_INCOME ? -poDetech : 0;
  const taxBonus = naBonus >= MIN_TAX_BONUS ? naBonus : 0;
  const bonusPodMinimem = naBonus > 0 && naBonus < MIN_TAX_BONUS ? naBonus : 0;

  const netSalary = grossSalary - totalInsurance - netTax + taxBonus;

  // Náklady zaměstnavatele
  const employerSocialInsurance = nahoru(socialBase * EMPLOYER_SOCIAL_INSURANCE_RATE);
  const employerCosts = grossSalary + employerSocialInsurance + employerHealthInsurance;

  // Podíl pojistného a daně na hrubé mzdě – BEZ bonusu (stejný základ jako částka „pojistné + daň“, S23).
  const taxEffectiveRate = (totalInsurance + netTax) / grossSalary;

  return {
    grossSalary, socialInsurance, healthInsurance, totalInsurance, incomeTax, taxRate,
    taxDeductions: totalTaxCredits, netTax, taxBonus, netSalary, employerCosts,
    employerSocialInsurance, employerHealthInsurance,
    socialCapped: grossSalary > MAX_SOCIAL_BASE_MONTHLY,
    doplatekZdravotni, zakladZalohy, bonusPodMinimem,
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

/** Vodorovný skládaný pruh: rozpad hrubé mzdy na čistou + odvody + daň. */
function Breakdown({ data }: { data: NetSalaryData }) {
  const { grossSalary, totalInsurance, netTax, netSalary } = data;
  const total = Math.max(grossSalary + data.taxBonus, 1); // s bonusem je čistá + odvody > hrubá
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
  const [grossSalary, setGrossSalary] = useState<number | null>(45000);
  const [isPensioner, setIsPensioner] = useState<boolean>(false);
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  const [numberOfChildren, setNumberOfChildren] = useState<number | null>(1);
  const [hasDisability, setHasDisability] = useState<boolean>(false);
  const [minZakladVyjimka, setMinZakladVyjimka] = useState<boolean>(false);

  // Výsledek jen z vyplněných polí – prázdná hrubá mzda = „—“, ne čistá mzda 0 Kč.
  const vstupyOk = grossSalary != null && grossSalary > 0 && (!hasChildren || numberOfChildren != null);
  const data = useMemo(
    () =>
      !vstupyOk ? null : calculateNetSalary({
        grossSalary: grossSalary ?? 0,
        isPensioner,
        hasChildren,
        numberOfChildren: hasChildren ? numberOfChildren ?? 0 : 0,
        hasDisability,
        minZakladVyjimka,
      }),
    [vstupyOk, grossSalary, isPensioner, hasChildren, numberOfChildren, hasDisability, minZakladVyjimka],
  );

  const netShare = data && data.grossSalary > 0 ? (data.netSalary / data.grossSalary) * 100 : 0;
  const belowMinWage = grossSalary != null && grossSalary > 0 && grossSalary < MIN_WAGE_2026;

  return (
    <div className="space-y-4">
      {/* 3.2: výsledek nahoře na mobilu */}
      {data && (
        <MobilniVysledek cil="cisty-plat-vysledek" stitek={`Na účet měsíčně${data.socialCapped ? ' (průměr za rok)' : ''}`} hodnota={fmtCZK(data.netSalary)}
          doplnek={`${netShare.toFixed(1).replace('.', ',')} % z hrubé mzdy${data.taxBonus > 0 ? ' (včetně daňového bonusu)' : ''}`} />
      )}
      {/* Vstupy */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">
          Vaše údaje
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CisloPole
            id="gross"
            label="Hrubá mzda (měsíčně)"
            value={grossSalary}
            min={0}
            max={5000000}
            step="1000"
            tlacitka={false}
            onChange={setGrossSalary}
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
                <InfoTip label="Pracující starobní důchodci mají slevu na pojistném 6,5 % (důchodová část) – ze 7,1 % tak platí jen 0,6 % nemocenské. V kalkulačce počítáme sociální pojištění 0,6 %, zdravotní 4,5 %. Jako poživatelé důchodu nemusí dorovnávat zdravotní pojištění do minimální mzdy.">
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
            <CisloPole
              id="children"
              label="Počet dětí"
              value={numberOfChildren}
              min={0}
              max={10}
              tisice={false}
              tlacitka={false}
              onChange={setNumberOfChildren}
            />
          </div>
        )}

        {belowMinWage && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-900/80">
                <p>
                  Hrubá mzda je pod minimální mzdou 2026 (22 400 Kč). Zdravotní pojištění se pak platí aspoň z minimální
                  mzdy: rozdíl 13,5 % z (22 400 Kč − hrubá mzda) doplácí zaměstnanec, pokud nespadá do výjimky.
                  {isPensioner && ' Pracující důchodce výjimku má (je státní pojištěnec).'}
                </p>
                {!isPensioner && (
                  <label className="mt-2 flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      id="min-vyjimka"
                      checked={minZakladVyjimka}
                      onChange={(e) => setMinZakladVyjimka(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-200"
                    />
                    <span>
                      Mám výjimku z minimálního základu (např. student, rodič na rodičovské, státní pojištěnec, osoba se
                      zdravotním postižením, další zaměstnání nebo podnikání do součtu nad minimum)
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {!data ? (
        <VysledekChybi co={grossSalary == null || grossSalary <= 0 ? 'hrubou mzdu' : 'počet dětí'} />
      ) : (<>
      {/* Hlavní výsledek */}
      <div id="cisty-plat-vysledek" className="scroll-mt-20" />
      <div className="rounded-2xl bg-teal-700 text-white p-5 md:p-7">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-teal-100">
          <Wallet className="w-4 h-4" /> Vaše čistá mzda
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <p className="text-sm text-teal-100">Čistá mzda měsíčně{data.socialCapped ? ' (průměr za rok)' : ''}</p>
            <p className="text-3xl md:text-4xl font-bold tabular-nums mt-1" data-qa="cista-mzda">{fmtCZK(data.netSalary)}</p>
            <p className="text-xs text-teal-200 mt-1">
              {netShare.toFixed(1).replace('.', ',')} % z hrubé mzdy{data.taxBonus > 0 ? ' (včetně daňového bonusu)' : ''}
            </p>
          </div>
          <div className="sm:border-l sm:border-white/15 sm:pl-5">
            <p className="text-sm text-teal-100">Celkové odvody</p>
            <p className="text-2xl md:text-3xl font-bold tabular-nums mt-1" data-qa="odvody">
              {fmtCZK(data.totalInsurance + data.netTax)}
            </p>
            <p className="text-xs text-teal-200 mt-1" data-qa="odvody-pct">
              pojistné + daň, {fmtPct(data.taxEffectiveRate)} z hrubé{data.taxBonus > 0 ? `; daňový bonus +${fmtCZK(data.taxBonus)} navíc` : ''}
            </p>
          </div>
          <div className="sm:border-l sm:border-white/15 sm:pl-5">
            <p className="text-sm text-teal-100">Čistá mzda ročně</p>
            <p className="text-2xl md:text-3xl font-bold tabular-nums mt-1">{fmtCZK(data.netSalary * 12)}</p>
            <p className="text-xs text-teal-200 mt-1">za 12 měsíců</p>
          </div>
        </div>
        {data.socialCapped && (
          <p className="mt-4 text-xs text-teal-100 leading-relaxed border-t border-white/15 pt-3">
            Hrubá mzda je nad stropem sociálního pojištění (maximální vyměřovací základ 2 350 416 Kč ročně = 48× průměrná mzda,
            ČSSZ 2026). Sociální pojištění se platí, dokud roční příjem strop nepřekročí, pak už ne – měsíční částky proto ukazujeme jako průměr za rok.
          </p>
        )}
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
              <dt className="text-slate-600" data-qa="soc-stitek">Sociální pojištění ({isPensioner ? '0,6' : '7,1'} %)</dt>
              <dd className="font-semibold text-slate-900 tabular-nums" data-qa="soc">{fmtCZK(data.socialInsurance)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Zdravotní pojištění (4,5 %)</dt>
              <dd className="font-semibold text-slate-900 tabular-nums" data-qa="zdr">{fmtCZK(data.healthInsurance - data.doplatekZdravotni)}</dd>
            </div>
            {data.doplatekZdravotni > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="text-slate-600">Doplatek zdravotního do minimální mzdy (13,5 % z rozdílu)</dt>
                <dd className="font-semibold text-slate-900 tabular-nums" data-qa="doplatek">{fmtCZK(data.doplatekZdravotni)}</dd>
              </div>
            )}
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
              <dt className="text-slate-600">
                <InfoTip label="Záloha na daň: 15 % ze základu do 3násobku průměrné mzdy (146 901 Kč měsíčně v roce 2026), 23 % z části nad ním. Základ se zaokrouhluje na celé stokoruny nahoru, záloha na celé koruny nahoru (§ 38h zákona o daních z příjmů).">
                  Sazba daně
                </InfoTip>
              </dt>
              <dd className="font-semibold text-slate-900 tabular-nums text-right" data-qa="sazba">
                {data.taxRate > INCOME_TAX_RATE_BASIC ? '15 % + 23 % nad 146 901 Kč' : '15 %'}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Základ daně (na stokoruny nahoru)</dt>
              <dd className="font-semibold text-slate-900 tabular-nums">{fmtCZK(data.zakladZalohy)}</dd>
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
            {data.taxBonus > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="font-medium text-slate-900">Daňový bonus na děti</dt>
                <dd className="font-bold text-emerald-700 tabular-nums" data-qa="bonus">+{fmtCZK(data.taxBonus)}</dd>
              </div>
            )}
            {data.bonusPodMinimem > 0 && (
              <p className="text-xs text-slate-500 leading-snug" data-qa="bonus-pod-50">
                Daňový bonus by činil {fmtCZK(data.bonusPodMinimem)} – měsíční bonus pod 50 Kč se nevyplácí
                (§ 35d odst. 4 zákona o daních z příjmů).
              </p>
            )}
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
            <InfoTip label="Tzv. superhrubá mzda byla zrušena v roce 2021, ale zaměstnavatel za vás stále platí pojistné navíc nad rámec hrubé mzdy: 24,8 % na sociální a 9 % na zdravotní pojištění (přesně dvě třetiny z 13,5 %, zaokrouhleno).">
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
            <dd className="font-semibold text-slate-900 tabular-nums">{fmtCZK(data.employerSocialInsurance)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">Zdravotní pojištění zaměstnavatele (9 %)</dt>
            <dd className="font-semibold text-slate-900 tabular-nums">{fmtCZK(data.employerHealthInsurance)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-slate-200 pt-2.5">
            <dt className="font-medium text-slate-900">Celkové náklady zaměstnavatele</dt>
            <dd className="font-bold text-slate-900 tabular-nums">{fmtCZK(data.employerCosts)}</dd>
          </div>
        </dl>
      </div>
      </>)}
    </div>
  );
}
