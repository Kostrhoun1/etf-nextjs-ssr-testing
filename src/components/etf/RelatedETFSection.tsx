import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPercentage } from '@/utils/csvParser';
import { ETF } from '@/types/etf';
import { ArrowRight, TrendingUp, Star } from 'lucide-react';

interface RelatedETFSectionProps {
  etfs: ETF[];
  title?: string;
  description?: string;
}

export default function RelatedETFSection({ etfs, title = "Podobné ETF fondy", description = "Další zajímavé ETF fondy, které by vás mohly zajímat" }: RelatedETFSectionProps) {
  if (!etfs || etfs.length === 0) return null;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {etfs.map((etf) => {
            const ticker = etf.primary_ticker || etf.exchange_1_ticker || '';
            const return1y = etf.return_1y || 0;
            const returnColor = return1y > 0 ? 'text-green-600' : return1y < 0 ? 'text-red-600' : 'text-gray-600';

            return (
              <Link
                key={etf.isin}
                href={`/etf/${etf.isin}`}
                className="group block p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {ticker && (
                        <Badge variant="outline" className="font-mono text-xs">
                          {ticker}
                        </Badge>
                      )}
                      {etf.rating && etf.rating >= 4 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{etf.rating}/5</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {etf.name}
                    </h3>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                </div>

                <div className="text-xs text-gray-500 mb-2">{etf.fund_provider}</div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-500">TER:</span>{' '}
                    <span className="font-medium">{formatPercentage(etf.ter_numeric)}</span>
                  </div>
                  {etf.return_1y !== null && (
                    <div>
                      <span className="text-gray-500">1Y:</span>{' '}
                      <span className={`font-medium ${returnColor}`}>
                        {formatPercentage(etf.return_1y)}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/srovnani-etf"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Zobrazit všechny ETF fondy
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
