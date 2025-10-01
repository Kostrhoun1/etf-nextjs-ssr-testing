'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, AlertTriangle, Euro } from 'lucide-react';
import { CurrencyImpactData } from '@/utils/currencyImpactCalculations';

interface CurrencyImpactResultsProps {
  results: CurrencyImpactData;
}

const CurrencyImpactResults: React.FC<CurrencyImpactResultsProps> = ({ results }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getImpactColor = (impact: number) => {
    if (impact > 5) return 'text-green-600';
    if (impact > 0) return 'text-green-500';
    if (impact > -5) return 'text-red-500';
    return 'text-red-600';
  };

  const getStrategyColor = (type: string) => {
    switch (type) {
      case 'no_hedge': return 'bg-red-50 border-red-200';
      case 'partial_hedge': return 'bg-yellow-50 border-yellow-200';
      case 'full_hedge': return 'bg-green-50 border-green-200';
      case 'dynamic_hedge': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const totalExposure = results.currentExposure.unhedgedUsd + results.currentExposure.unhedgedEur;
  const totalPortfolio = totalExposure + results.currentExposure.czkAmount;

  return (
    <div className="space-y-6">
      {/* Současná expozice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Současná měnová expozice (podle podkladových aktiv)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-red-50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-red-600" />
                  <h4 className="font-semibold text-red-800">USD expozice</h4>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(results.currentExposure.unhedgedUsd)}
                </p>
                <p className="text-sm text-red-700">
                  {((results.currentExposure.unhedgedUsd / totalPortfolio) * 100).toFixed(1)}% portfolia
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Euro className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">EUR expozice</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(results.currentExposure.unhedgedEur)}
                </p>
                <p className="text-sm text-blue-700">
                  {((results.currentExposure.unhedgedEur / totalPortfolio) * 100).toFixed(1)}% portfolia
                </p>
              </CardContent>
            </Card>


            <Card className="bg-purple-50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-purple-600 font-bold">CZK</span>
                  <h4 className="font-semibold text-purple-800">Domácí měna</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(results.currentExposure.czkAmount)}
                </p>
                <p className="text-sm text-purple-700">
                  {((results.currentExposure.czkAmount / totalPortfolio) * 100).toFixed(1)}% portfolia
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Celková kurzová expozice:</span>
              <span className="text-xl font-bold text-orange-600">
                {((totalExposure / totalPortfolio) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={(totalExposure / totalPortfolio) * 100} 
              className="mt-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Scénáře */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Kurzové scénáře a dopady
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.scenarios.map((scenario, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{scenario.name}</h4>
                    <p className="text-xs text-gray-600">{scenario.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {scenario.probability}% pravděpodobnost
                    </Badge>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">USD/CZK změna</p>
                    <p className={`font-bold text-sm ${scenario.usdCzkChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(scenario.usdCzkChange)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">EUR/CZK změna</p>
                    <p className={`font-bold text-sm ${scenario.eurCzkChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(scenario.eurCzkChange)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Dopad na portfolio</p>
                    <p className={`font-bold text-sm ${getImpactColor(scenario.portfolioImpact)}`}>
                      {formatPercentage(scenario.portfolioImpact)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Nová hodnota</p>
                    <p className="font-bold text-sm">
                      {formatCurrency(scenario.portfolioValueCzk)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stručné shrnutí výsledků */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-blue-800 text-lg">📊 Shrnutí analýzy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 mb-1">
                {((totalExposure / totalPortfolio) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-blue-700">Kurzová expozice</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600 mb-1">
                {results.riskMetrics.portfolioVolatility.toFixed(1)}%
              </div>
              <div className="text-xs text-orange-700">Celková volatilita</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600 mb-1">
                {formatCurrency(results.riskMetrics.valueAtRisk)}
              </div>
              <div className="text-xs text-red-700">Value at Risk (95%)</div>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-white rounded-lg border">
            <p className="text-xs text-gray-700">
              <strong>Obecné doporučení:</strong> {
                totalExposure / totalPortfolio > 0.7 
                  ? "Vysoká kurzová expozice. Pro dlouhodobé investice je nejlepší strategie pravidelné nákupy (DCA), které minimalizují kurzové riziko."
                  : totalExposure / totalPortfolio > 0.3
                  ? "Střední kurzová expozice. Pravidelné investování pomáhá vyrovnat kurzové výkyvy v čase."
                  : "Nízká kurzová expozice. Portfolio má minimální závislost na kurzových změnách."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyImpactResults;