'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, TrendingDown, Clock, AlertTriangle, Calculator, TrendingUp } from 'lucide-react';
import { FireData, calculateFire } from '@/utils/retirementCalculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RetirementResultsSummaryProps {
  results: FireData;
  originalParams?: {
    currentAge: number;
    currentSavings: number;
    monthlySavings: number;
    monthlyExpensesInFire: number;
    inflationRate: number;
    investmentStrategy: 'conservative' | 'moderate' | 'aggressive';
  };
}

const RetirementResultsSummary: React.FC<RetirementResultsSummaryProps> = ({ results, originalParams }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('cs-CZ').format(Math.round(num));
  };


  return (
    <div className="space-y-6">
      {/* Nadpis výsledků */}
      <div className="text-center mb-8 animate-fade-in [animation-delay:0.2s]">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">📊 Výsledky FIRE analýzy</h2>
        <p className="text-gray-600">Pravděpodobnostní scénáře vaší cesty k finanční nezávislosti</p>
      </div>
      
      {/* Detailní scénáře - Card komponenty s animacemi jako na homepage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Optimistický scénář */}
        <Card className="border-transparent shadow-none hover:shadow-xl transition-all duration-300 group bg-white card-hover animate-fade-in [animation-delay:0.2s]">
          <div className="p-6 text-center">
            <div className="mb-4 flex items-center justify-center rounded-full bg-emerald-100 w-12 h-12 mx-auto group-hover:bg-emerald-200 transition-all duration-300 hover-scale">
              <TrendingUp className="h-6 w-6 text-emerald-700 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 transition-colors group-hover:text-emerald-800">Optimistický scénář</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">FIRE věk</p>
                <p className="text-xl font-bold text-emerald-700 transition-all duration-300 group-hover:text-emerald-600 group-hover:scale-105">
                  {results.scenarios.optimistic.fireAge ? `${results.scenarios.optimistic.fireAge} let` : 'Nedosaženo'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Portfolio</p>
                <p className="text-sm text-gray-700">
                  {formatCurrency(results.scenarios.optimistic.fireAmount)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 group-hover:text-emerald-500 transition-colors">20% pravděpodobnost</p>
          </div>
        </Card>
        
        {/* Realistický scénář */}
        <Card className="border-transparent shadow-none hover:shadow-xl transition-all duration-300 group bg-white card-hover animate-fade-in [animation-delay:0.3s]">
          <div className="p-6 text-center">
            <div className="mb-4 flex items-center justify-center rounded-full bg-violet-100 w-12 h-12 mx-auto group-hover:bg-violet-200 transition-all duration-300 hover-scale">
              <Clock className="h-6 w-6 text-violet-700 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 transition-colors group-hover:text-violet-800">Realistický scénář</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">FIRE věk</p>
                <p className="text-xl font-bold text-violet-700 transition-all duration-300 group-hover:text-violet-600 group-hover:scale-105">
                  {results.scenarios.realistic.fireAge ? `${results.scenarios.realistic.fireAge} let` : 'Nedosaženo'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Portfolio</p>
                <p className="text-sm text-gray-700">
                  {formatCurrency(results.scenarios.realistic.fireAmount)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 group-hover:text-violet-500 transition-colors">60% pravděpodobnost</p>
          </div>
        </Card>
        
        {/* Pesimistický scénář */}
        <Card className="border-transparent shadow-none hover:shadow-xl transition-all duration-300 group bg-white card-hover animate-fade-in [animation-delay:0.4s]">
          <div className="p-6 text-center">
            <div className="mb-4 flex items-center justify-center rounded-full bg-red-100 w-12 h-12 mx-auto group-hover:bg-red-200 transition-all duration-300 hover-scale">
              <TrendingDown className="h-6 w-6 text-red-700 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 transition-colors group-hover:text-red-800">Pesimistický scénář</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">FIRE věk</p>
                <p className="text-xl font-bold text-red-700 transition-all duration-300 group-hover:text-red-600 group-hover:scale-105">
                  {results.scenarios.pessimistic.fireAge ? `${results.scenarios.pessimistic.fireAge} let` : 'Nedosaženo'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Portfolio</p>
                <p className="text-sm text-gray-700">
                  {formatCurrency(results.scenarios.pessimistic.fireAmount)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 group-hover:text-red-500 transition-colors">20% pravděpodobnost</p>
          </div>
        </Card>
      </div>


      {/* Simulace zlepšení - konkrétní scénáře */}
      {originalParams && (
        <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 bg-white rounded-2xl p-8 animate-fade-in [animation-delay:0.8s]">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center rounded-full bg-violet-100 w-12 h-12">
              <Calculator className="h-6 w-6 text-violet-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">💡 Jak urychlit FIRE?</h3>
          </div>
          
          {(() => {
            // Graf 1: Vliv měsíčního spoření na FIRE věk
            const savingsData = [];
            for (let multiplier = 0.5; multiplier <= 2.0; multiplier += 0.1) {
              const monthlySavings = Math.round(originalParams.monthlySavings * multiplier);
              const result = calculateFire({
                ...originalParams,
                monthlySavings
              });
              savingsData.push({
                savings: monthlySavings,
                years: result.scenarios.realistic.yearsToFire || 99,
                fireAge: result.scenarios.realistic.fireAge || 99
              });
            }
            
            // Graf 2: Vliv měsíčních výdajů na FIRE věk
            const expensesData = [];
            for (let multiplier = 0.6; multiplier <= 1.4; multiplier += 0.05) {
              const monthlyExpenses = Math.round(originalParams.monthlyExpensesInFire * multiplier);
              const result = calculateFire({
                ...originalParams,
                monthlyExpensesInFire: monthlyExpenses
              });
              expensesData.push({
                expenses: monthlyExpenses,
                years: result.scenarios.realistic.yearsToFire || 99,
                fireAge: result.scenarios.realistic.fireAge || 99
              });
            }
            
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Graf spoření */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    📈 Vliv měsíčního spoření na FIRE věk
                  </h4>
                  <div className="h-80 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={savingsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" strokeOpacity={0.8} />
                        <XAxis 
                          dataKey="savings"
                          tickFormatter={(value) => `${Math.round(value/1000)}k`}
                          label={{ value: 'Měsíční spoření (Kč)', position: 'insideBottom', offset: -10, style: { fontSize: '12px', fontWeight: 'bold', fill: '#059669' } }}
                          tick={{ fontSize: 11, fill: '#047857' }}
                          axisLine={{ stroke: '#10b981', strokeWidth: 2 }}
                          tickLine={{ stroke: '#10b981' }}
                        />
                        <YAxis 
                          dataKey="fireAge"
                          label={{ value: 'FIRE věk', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fontWeight: 'bold', fill: '#059669' } }}
                          tick={{ fontSize: 11, fill: '#047857' }}
                          axisLine={{ stroke: '#10b981', strokeWidth: 2 }}
                          tickLine={{ stroke: '#10b981' }}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            name === 'fireAge' ? `${value} let` : `${value} let`,
                            name === 'fireAge' ? 'FIRE věk' : 'Roky do FIRE'
                          ]}
                          labelFormatter={(value: number) => `Spoření: ${formatCurrency(value)}`}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px',
                            padding: '12px 16px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="fireAge"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
                          activeDot={{ r: 6, fill: '#059669', strokeWidth: 3, stroke: '#ffffff' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-emerald-700 mt-2 text-center">
                    Aktuální spoření: <strong>{formatCurrency(originalParams.monthlySavings)}</strong>
                  </p>
                </div>
                
                {/* Graf výdajů */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    💰 Vliv cílových výdajů na FIRE věk
                  </h4>
                  <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={expensesData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" strokeOpacity={0.8} />
                        <XAxis 
                          dataKey="expenses"
                          tickFormatter={(value) => `${Math.round(value/1000)}k`}
                          label={{ value: 'Cílové měsíční výdaje (Kč)', position: 'insideBottom', offset: -10, style: { fontSize: '12px', fontWeight: 'bold', fill: '#1d4ed8' } }}
                          tick={{ fontSize: 11, fill: '#1e40af' }}
                          axisLine={{ stroke: '#3b82f6', strokeWidth: 2 }}
                          tickLine={{ stroke: '#3b82f6' }}
                        />
                        <YAxis 
                          dataKey="fireAge"
                          label={{ value: 'FIRE věk', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fontWeight: 'bold', fill: '#1d4ed8' } }}
                          tick={{ fontSize: 11, fill: '#1e40af' }}
                          axisLine={{ stroke: '#3b82f6', strokeWidth: 2 }}
                          tickLine={{ stroke: '#3b82f6' }}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            name === 'fireAge' ? `${value} let` : `${value} let`,
                            name === 'fireAge' ? 'FIRE věk' : 'Roky do FIRE'
                          ]}
                          labelFormatter={(value: number) => `Výdaje: ${formatCurrency(value)}`}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px',
                            padding: '12px 16px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="fireAge"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
                          activeDot={{ r: 6, fill: '#1d4ed8', strokeWidth: 3, stroke: '#ffffff' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-blue-700 mt-2 text-center">
                    Aktuální cíl: <strong>{formatCurrency(originalParams.monthlyExpensesInFire)}</strong>
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Úspěšný plán - hero styl */}
      {(results.scenarios.realistic.fireAge && results.scenarios.realistic.yearsToFire && results.scenarios.realistic.yearsToFire <= 20) && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
          <div className="relative z-10 p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
              <h3 className="text-xl font-bold text-white">Váš FIRE plán je na dobré cestě!</h3>
            </div>
            <p className="text-emerald-100 mb-6">
              Při současném spoření dosáhnete finanční nezávislosti za {results.scenarios.realistic.yearsToFire} let.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-2">Další optimalizace:</h4>
                <ul className="text-emerald-100 space-y-1">
                  <li>• Pravidelně rebalancovat portfolio</li>
                  <li>• Sledovat změny v daňové legislativě</li>
                  <li>• Zvažovat dopad inflace</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Váš FIRE úspěch:</h4>
                <ul className="text-emerald-100 space-y-1">
                  <li>• FIRE věk: {results.scenarios.realistic.fireAge} let</li>
                  <li>• Průměrný věk: {Math.round(results.averageFireAge)} let</li>
                  <li>• Flexibilní přístup možný</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetirementResultsSummary;