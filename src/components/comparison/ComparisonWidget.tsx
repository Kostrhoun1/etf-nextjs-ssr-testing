'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, BarChart3, Eye } from 'lucide-react';
import { ETF } from '@/types/etf';
import { useRouter } from 'next/navigation';

interface ComparisonWidgetProps {
  selectedETFs: ETF[];
  onRemoveETF: (isin: string) => void;
  onClearAll: () => void;
  className?: string;
}

const ComparisonWidget: React.FC<ComparisonWidgetProps> = ({
  selectedETFs,
  onRemoveETF,
  onClearAll,
  className = ""
}) => {
  const router = useRouter();

  if (selectedETFs.length === 0) {
    return null;
  }

  const handleCompare = () => {
    const isins = selectedETFs.map(etf => etf.isin).join(',');
    router.push(`/srovnani-etf?compare=${isins}`);
  };

  const handleViewETF = (isin: string) => {
    router.push(`/etf/${isin}`);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-sm ${className}`}>
      <Card className="shadow-lg border-violet-200 bg-white/95 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-600" />
              <span className="font-semibold text-gray-900">
                Porovnání ({selectedETFs.length}/3)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Selected ETFs List */}
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {selectedETFs.map((etf) => (
              <div
                key={etf.isin}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md group hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {etf.name || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {etf.isin}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleViewETF(etf.isin)}
                    title="Zobrazit detail"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                    onClick={() => onRemoveETF(etf.isin)}
                    title="Odebrat z porovnání"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Pokrok</span>
              <span>{selectedETFs.length}/3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(selectedETFs.length / 3) * 100}%` }}
              />
            </div>
            {selectedETFs.length < 2 && (
              <p className="text-xs text-gray-500 mt-1">
                Přidejte alespoň 2 ETF pro porovnání
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleCompare}
              disabled={selectedETFs.length < 2}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
              size="sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {selectedETFs.length < 2 ? 'Přidejte další ETF' : 'Porovnat vybrané'}
            </Button>

            {selectedETFs.length > 0 && (
              <Button
                onClick={onClearAll}
                variant="outline"
                size="sm"
                className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                Vymazat vše
              </Button>
            )}
          </div>

          {/* Tips */}
          {selectedETFs.length === 1 && (
            <div className="mt-3 p-2 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-700">
                💡 Přidejte další ETF pro detailní srovnání poplatků, výkonnosti a rizika
              </p>
            </div>
          )}

          {selectedETFs.length === 3 && (
            <div className="mt-3 p-2 bg-amber-50 rounded-md">
              <p className="text-xs text-amber-700">
                ⚠️ Maximum 3 ETF pro porovnání. Odeberte některý pro přidání dalšího.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Overlay */}
      {selectedETFs.length > 1 && (
        <Card className="mt-2 shadow-md bg-white/90 backdrop-blur">
          <CardContent className="p-3">
            <div className="text-xs text-gray-600 mb-2">Rychlý přehled:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Avg. TER:</span>
                <span className="ml-1 font-medium">
                  {(selectedETFs.reduce((acc, etf) => acc + (etf.ter_numeric || 0), 0) / selectedETFs.length).toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">Kategorií:</span>
                <span className="ml-1 font-medium">
                  {new Set(selectedETFs.map(etf => etf.category)).size}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComparisonWidget;