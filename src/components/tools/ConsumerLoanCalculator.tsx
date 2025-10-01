'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Calendar, Info, BarChart3, Percent } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface LoanData {
  month: number;
  remainingDebt: number;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
  totalInterest: number;
}

const ConsumerLoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanPeriod, setLoanPeriod] = useState<number>(5);

  const loanData = useMemo(() => {
    if (!loanAmount || !interestRate || !loanPeriod) return [];

    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanPeriod * 12;
    
    // Calculate monthly payment using loan formula
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                          (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const data: LoanData[] = [];
    let remainingDebt = loanAmount;
    let totalInterest = 0;

    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = remainingDebt * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      remainingDebt = remainingDebt - principalPayment;
      // Handle rounding errors in final payment
      if (remainingDebt < 0.01) remainingDebt = 0;
      totalInterest += interestPayment;

      data.push({
        month,
        remainingDebt,
        monthlyPayment,
        principalPayment,
        interestPayment,
        totalInterest
      });
    }

    return data;
  }, [loanAmount, interestRate, loanPeriod]);

  const summary = useMemo(() => {
    if (loanData.length === 0) return null;

    const monthlyPayment = loanData[0].monthlyPayment;
    const totalPayments = monthlyPayment * loanData.length;
    const totalInterest = loanData[loanData.length - 1].totalInterest;

    return {
      monthlyPayment,
      totalPayments,
      totalInterest,
      interestPercentage: (totalInterest / loanAmount) * 100
    };
  }, [loanData, loanAmount]);

  const chartData = useMemo(() => {
    return loanData
      .filter((_, index) => index % 12 === 0 || index === loanData.length - 1)
      .map(item => ({
        year: Math.ceil(item.month / 12),
        'Zbývající dluh': Math.round(item.remainingDebt),
        'Zaplacené úroky': Math.round(item.totalInterest)
      }));
  }, [loanData]);

  const pieData = useMemo(() => {
    if (!summary) return [];
    
    return [
      { name: 'Jistina', value: loanAmount, color: '#3B82F6' },
      { name: 'Úroky', value: summary.totalInterest, color: '#EF4444' }
    ];
  }, [loanAmount, summary]);

  const monthlyBreakdownData = useMemo(() => {
    if (loanData.length === 0) return [];
    
    return loanData
      .filter((_, index) => index % 12 === 0 || index === loanData.length - 1)
      .map(item => ({
        year: Math.ceil(item.month / 12),
        'Úmor jistiny': Math.round(item.principalPayment),
        'Úrok': Math.round(item.interestPayment)
      }));
  }, [loanData]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-2xl">
              Kalkulačka spotřebitelského úvěru
            </CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Spočítejte si měsíční splátky a celkové náklady úvěru
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Input Section */}
            <div className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white rounded-lg p-6 card-hover animate-fade-in [animation-delay:0.2s]">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center rounded-full bg-violet-100 w-10 h-10 group-hover:bg-violet-200 transition-colors hover-scale">
                  <DollarSign className="h-5 w-5 text-violet-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-violet-800 transition-colors">Parametry úvěru</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="loanAmount">Výše úvěru (Kč)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount || ''}
                    onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                    placeholder="500 000"
                    min="50000"
                    max="2000000"
                    step="10000"
                    className="h-10"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Rozsah: 50 000 - 2 000 000 Kč
                  </p>
                </div>

                <div>
                  <Label htmlFor="interestRate">Úroková sazba (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={interestRate || ''}
                    onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                    placeholder="8.5"
                    min="3"
                    max="25"
                    step="0.1"
                    className="h-10"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Typicky 6-15% ročně pro spotřebitelské úvěry
                  </p>
                </div>

                <div>
                  <Label htmlFor="loanPeriod">Doba splatnosti (roky)</Label>
                  <Input
                    id="loanPeriod"
                    type="number"
                    value={loanPeriod || ''}
                    onChange={(e) => setLoanPeriod(Math.min(10, Math.max(1, Number(e.target.value) || 0)))}
                    placeholder="5"
                    min="1"
                    max="10"
                    step="1"
                    className="h-10"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Obvykle 1-7 let pro spotřebitelské úvěry
                  </p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {summary && (
              <div className="border rounded-lg p-4 bg-gray-25">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-violet-600" />
                  <h3 className="font-semibold">Výsledky výpočtu</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-600 font-medium">Měsíční splátka</div>
                    <div className="text-lg font-bold text-blue-900">
                      {Math.round(summary.monthlyPayment).toLocaleString()} Kč
                    </div>
                    <div className="text-xs text-blue-700 mt-1">Konstantní splátka každý měsíc</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">Celkem zaplatíte</div>
                    <div className="text-lg font-bold text-gray-900">
                      {Math.round(summary.totalPayments).toLocaleString()} Kč
                    </div>
                    <div className="text-xs text-gray-700 mt-1">Součet všech měsíčních splátek</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="text-xs text-red-600 font-medium">Přeplatek úvěru</div>
                    <div className="text-lg font-bold text-red-900">
                      {Math.round(summary.totalInterest).toLocaleString()} Kč
                    </div>
                    <div className="text-xs text-red-700 mt-1">Kolik zaplatíte bance navíc</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <div className="text-xs text-orange-600 font-medium">Poměr přeplatku</div>
                    <div className="text-lg font-bold text-orange-900">
                      {summary.interestPercentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-orange-700 mt-1">% z výše úvěru navíc</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button 
            onClick={() => {}} 
            className="w-full hover-scale bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 mb-4 animate-fade-in [animation-delay:0.6s]"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Spočítat úvěr
          </Button>
          
        </CardContent>
      </Card>

      {summary && (
        <>
          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex items-center justify-center rounded-full bg-emerald-100 w-12 h-12 mx-auto group-hover:bg-emerald-200 transition-colors hover-scale">
                  <DollarSign className="h-6 w-6 text-emerald-700" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-800 transition-colors">Měsíční splátka</h4>
                <p className="text-2xl font-bold text-emerald-600">
                  {Math.round(summary.monthlyPayment).toLocaleString()} Kč
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex items-center justify-center rounded-full bg-blue-100 w-12 h-12 mx-auto group-hover:bg-blue-200 transition-colors hover-scale">
                  <Calculator className="h-6 w-6 text-blue-700" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors">Celkem zaplatíte</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(summary.totalPayments).toLocaleString()} Kč
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-transparent shadow-none hover:shadow-md transition-shadow duration-200 group bg-white">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex items-center justify-center rounded-full bg-red-100 w-12 h-12 mx-auto group-hover:bg-red-200 transition-colors hover-scale">
                  <Percent className="h-6 w-6 text-red-700" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-800 transition-colors">Přeplatek úvěru</h4>
                <p className="text-2xl font-bold text-red-600">
                  {Math.round(summary.totalInterest).toLocaleString()} Kč
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Debt Progress Chart */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Průběh splácení
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      label={{ value: 'Rok', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      width={80}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${Math.round(value).toLocaleString()} Kč`]}
                      labelFormatter={(label) => `Rok ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Zbývající dluh" 
                      stroke="#3B82F6" 
                      strokeWidth={3} 
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Zaplacené úroky" 
                      stroke="#EF4444" 
                      strokeWidth={3} 
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Složení celkové částky
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${Math.round(value).toLocaleString()} Kč`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Payment Breakdown */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Struktura měsíčních splátek
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyBreakdownData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="year" 
                    label={{ value: 'Rok', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${Math.round(value).toLocaleString()} Kč`]}
                    labelFormatter={(label) => `Rok ${label}`}
                  />
                  <Bar dataKey="Úmor jistiny" stackId="a" fill="#3B82F6" />
                  <Bar dataKey="Úrok" stackId="a" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Umořovací tabulka */}
          <details className="border border-gray-200 rounded-lg bg-white">
            <summary className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors rounded-lg">
              <span className="font-semibold text-gray-900">📊 Detailní umořovací tabulka (klikněte pro rozbalení)</span>
            </summary>
            <div className="p-3 border-t border-gray-200 max-h-96 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-2 text-left font-semibold text-xs">Měsíc</th>
                      <th className="p-2 text-right font-semibold text-xs">Splátka</th>
                      <th className="p-2 text-right font-semibold text-xs">Úrok</th>
                      <th className="p-2 text-right font-semibold text-xs">Jistina</th>
                      <th className="p-2 text-right font-semibold text-xs">Zůstatek</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanData.map((item, index) => (
                      <tr key={index} className={index % 12 === 0 ? "bg-blue-50" : "hover:bg-gray-50"}>
                        <td className="p-2 font-medium">
                          {index % 12 === 0 && <span className="text-blue-600 font-bold">Rok {Math.floor(index / 12) + 1}</span>}
                          <div className="text-xs text-gray-500">Měsíc {item.month}</div>
                        </td>
                        <td className="p-2 text-right font-medium">
                          {Math.round(item.monthlyPayment).toLocaleString()} Kč
                        </td>
                        <td className="p-2 text-right text-red-600">
                          {Math.round(item.interestPayment).toLocaleString()} Kč
                        </td>
                        <td className="p-2 text-right text-green-600">
                          {Math.round(item.principalPayment).toLocaleString()} Kč
                        </td>
                        <td className="p-2 text-right font-medium">
                          {Math.round(item.remainingDebt).toLocaleString()} Kč
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-xs">
                  <strong>💡 Jak číst tabulku:</strong> Modře označené řádky jsou začátky nových roků. 
                  Vidíte jak se postupně snižuje podíl úroků (červeně) a zvyšuje úmor jistiny (zeleně) při konstantní splátce.
                </p>
              </div>
            </div>
          </details>
        </>
      )}
    </div>
  );
};

export default ConsumerLoanCalculator;