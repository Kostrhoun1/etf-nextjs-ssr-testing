'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PercentIcon } from '@/components/ui/icons';
import FeeCalculatorForm from './FeeCalculatorForm';
import FeeScenarioManager from './FeeScenarioManager';
import FeeCalculatorResults from './FeeCalculatorResults';
import FeeComparisonChart from './FeeComparisonChart';
import FeeComparisonTable from './FeeComparisonTable';
import { calculateFeeImpact } from '@/utils/feeCalculations';

interface FeeScenario {
  name: string;
  totalExpenseRatio: number;
  entryFee: number;
  color: string;
}

interface FeeCalculationResult {
  scenario: FeeScenario;
  year: number;
  grossValue: number;
  netValue: number;
  totalFees: number;
  feeImpact: number;
}

const FeeCalculator: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState<number>(100000);
  const [recurringInvestment, setRecurringInvestment] = useState<number>(5000);
  const [recurringFrequency, setRecurringFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [averageReturn, setAverageReturn] = useState<number>(7);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(20);
  const [scenarios, setScenarios] = useState<FeeScenario[]>([
    { name: 'Levný ETF', totalExpenseRatio: 0.15, entryFee: 0, color: '#22c55e' },
    { name: 'Aktivní fond s poplatky', totalExpenseRatio: 1.2, entryFee: 2.0, color: '#ef4444' },
    { name: 'Bankovní fond', totalExpenseRatio: 2.0, entryFee: 3.0, color: '#f59e0b' }
  ]);
  const [results, setResults] = useState<FeeCalculationResult[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const updateScenario = (index: number, field: keyof FeeScenario, value: string | number) => {
    const newScenarios = [...scenarios];
    if (field === 'totalExpenseRatio' || field === 'entryFee') {
      newScenarios[index][field] = Number(value);
    } else {
      newScenarios[index][field] = value as string;
    }
    setScenarios(newScenarios);
  };

  const handleCalculate = () => {
    const calculationResults = calculateFeeImpact({
      scenarios,
      initialInvestment,
      recurringInvestment,
      recurringFrequency,
      averageReturn,
      investmentPeriod
    });
    
    setResults(calculationResults);
    setShowResults(true);
  };

  const finalResults = results.filter(r => r.year === investmentPeriod);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <PercentIcon className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl">Kalkulačka poplatků</CardTitle>
              <CardDescription>
                Porovnejte vliv různých poplatků na dlouhodobý výnos vašich investic
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <FeeCalculatorForm
            initialInvestment={initialInvestment}
            setInitialInvestment={setInitialInvestment}
            recurringInvestment={recurringInvestment}
            setRecurringInvestment={setRecurringInvestment}
            recurringFrequency={recurringFrequency}
            setRecurringFrequency={setRecurringFrequency}
            averageReturn={averageReturn}
            setAverageReturn={setAverageReturn}
            investmentPeriod={investmentPeriod}
            setInvestmentPeriod={setInvestmentPeriod}
          />

          <FeeScenarioManager
            scenarios={scenarios}
            updateScenario={updateScenario}
          />

          <Button onClick={handleCalculate} className="w-full hover-scale bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3">
            <PercentIcon className="mr-2 h-5 w-5" />
            Vypočítat dopad poplatků
          </Button>

          {showResults && finalResults.length > 0 && (
            <div className="pt-6 border-t">
              <FeeCalculatorResults finalResults={finalResults} />
            </div>
          )}

          {/* Rozbalovací předpoklady */}
          <details className="mt-6 border border-orange-200 rounded-lg">
            <summary className="p-4 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors rounded-lg">
              <span className="font-semibold text-orange-900">📋 Předpoklady kalkulačky poplatků (klikněte pro rozbalení)</span>
            </summary>
            <div className="p-4 border-t border-orange-200">
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• <strong>Vstupní poplatky:</strong> Účtují se při každé investici (měsíční nebo roční)</li>
                <li>• <strong>TER (Total Expense Ratio):</strong> Roční poplatek fondu, odečítá se průběžně z hodnoty investice</li>
                <li>• <strong>Výpočet TER:</strong> Aplikuje se na hodnotu po zisku, čímž lépe odráží skutečný dopad</li>
                <li>• <strong>Složené úročení:</strong> TER poplatky ovlivňují i budoucí růst investice</li>
                <li>• <strong>Porovnání:</strong> Hrubá hodnota = investice bez jakýchkoliv poplatků</li>
                <li>• <strong>Poplatky se nesčítają:</strong> V realitě se jednotlivé poplatky kombinují komplexněji</li>
              </ul>
            </div>
          </details>
        </CardContent>
      </Card>

      {showResults && results.length > 0 && (
        <>
          <FeeComparisonChart data={results} />
          <FeeComparisonTable data={results} investmentPeriod={investmentPeriod} />
        </>
      )}
    </div>
  );
};

export default FeeCalculator;