import React from 'react';
import { ETF, ETFListItem } from '@/types/etf';
import { calculateETFRating, getRatingDescription, getRatingColor } from '@/utils/etfRating';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ETFRatingProps {
  etf: ETF | ETFListItem;
  showDescription?: boolean;
  showBreakdown?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ETFRating: React.FC<ETFRatingProps> = ({
  etf,
  showDescription = false,
  showBreakdown = false,
  size = 'md'
}) => {
  // Define size classes first (before any early returns)
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // CSS-based star sizes (unicode stars instead of SVG)
  const starSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const rating = calculateETFRating(etf);

  if (!rating) {
    return (
      <div className="flex items-center gap-2">
        <div className={`flex items-center ${starSizeClasses[size]}`} aria-label="Nehodnoceno">
          <span className="text-gray-300">☆☆☆☆☆</span>
        </div>
        <span className="text-sm text-gray-500">
          Nehodnoceno (fond mladší 3 let)
        </span>
      </div>
    );
  }

  // Generate star string using unicode characters (saves ~3KB per rating vs SVG)
  const renderStars = (ratingValue: number) => {
    const filledStars = '★'.repeat(ratingValue);
    const emptyStars = '☆'.repeat(5 - ratingValue);
    return (
      <div className={`flex items-center ${starSizeClasses[size]}`} aria-label={`Hodnocení ${ratingValue} z 5`}>
        <span className="text-yellow-400">{filledStars}</span>
        <span className="text-gray-300">{emptyStars}</span>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {renderStars(rating.rating)}
        <Badge 
          variant="outline" 
          className={`${getRatingColor(rating.rating)} border-current`}
        >
          {rating.rating}/5
        </Badge>
        <Tooltip>
          <TooltipTrigger>
            <span className="text-gray-400 hover:text-gray-600 cursor-help text-sm" aria-label="Více informací">ⓘ</span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2 text-sm">
              <div className="font-semibold mb-2">Rozklad hodnocení:</div>
              <div className="flex justify-between">
                <span>TER (poplatek):</span>
                <span className="font-mono">{rating.breakdown.ter}/30</span>
              </div>
              <div className="flex justify-between">
                <span>Velikost fondu:</span>
                <span className="font-mono">{rating.breakdown.fundSize}/25</span>
              </div>
              <div className="flex justify-between">
                <span>Historie fondu:</span>
                <span className="font-mono">{rating.breakdown.trackRecord}/15</span>
              </div>
              <div className="flex justify-between">
                <span>Poskytovatel:</span>
                <span className="font-mono">{rating.breakdown.provider}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Výkonnost:</span>
                <span className="font-mono">{rating.breakdown.performance}/20</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Celkem:</span>
                <span className="font-mono">{rating.score}/100</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
        {showDescription && (
          <span className={`${sizeClasses[size]} text-gray-600 italic ml-2`}>
            {getRatingDescription(rating.rating)}
          </span>
        )}
      </div>

      {showBreakdown && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Rozklad hodnocení:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>TER (poplatek):</span>
                <span className="font-mono">{rating.breakdown.ter}/30</span>
              </div>
              <div className="flex justify-between">
                <span>Velikost fondu:</span>
                <span className="font-mono">{rating.breakdown.fundSize}/25</span>
              </div>
              <div className="flex justify-between">
                <span>Historie fondu:</span>
                <span className="font-mono">{rating.breakdown.trackRecord}/15</span>
              </div>
              <div className="flex justify-between">
                <span>Poskytovatel:</span>
                <span className="font-mono">{rating.breakdown.provider}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Výkonnost:</span>
                <span className="font-mono">{rating.breakdown.performance}/20</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Celkem:</span>
                <span className="font-mono">{rating.score}/100</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ETFRating;