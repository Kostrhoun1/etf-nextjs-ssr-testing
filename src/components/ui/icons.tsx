/**
 * Lightweight icon components using CSS/unicode instead of inline SVG
 * This significantly reduces HTML size and improves text-to-HTML ratio for SEO
 * Each lucide icon adds ~500 bytes of SVG, these use ~10 bytes
 */

import React from 'react';

interface IconProps {
  className?: string;
}

// Status icons
export const CheckIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={`text-green-500 ${className}`} aria-hidden="true">✓</span>
);

export const XIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={`text-red-500 ${className}`} aria-hidden="true">✕</span>
);

export const AlertIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={`text-yellow-500 ${className}`} aria-hidden="true">⚠</span>
);

export const InfoIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={`text-blue-500 ${className}`} aria-hidden="true">ⓘ</span>
);

// Star ratings
export const StarFilledIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={`text-yellow-400 ${className}`} aria-hidden="true">★</span>
);

export const StarEmptyIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={`text-gray-300 ${className}`} aria-hidden="true">☆</span>
);

// Navigation arrows
export const ArrowRightIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">→</span>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">›</span>
);

export const ExternalLinkIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">↗</span>
);

// Category icons (emoji-based)
export const TrendingUpIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">📈</span>
);

export const TrendingDownIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">📉</span>
);

export const GlobeIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">🌍</span>
);

export const ShieldIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">🛡</span>
);

export const UsersIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">👥</span>
);

export const AwardIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">🏆</span>
);

export const SmartphoneIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">📱</span>
);

export const CalculatorIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">🧮</span>
);

export const BookIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">📖</span>
);

export const BankIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">🏦</span>
);

export const MailIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">✉</span>
);

export const MenuIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">☰</span>
);

export const SearchIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={className} aria-hidden="true">🔍</span>
);

export const LoaderIcon: React.FC<IconProps> = ({ className = '' }) => (
  <span className={`animate-spin ${className}`} aria-hidden="true">⏳</span>
);

// Helper component for star ratings
interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const filledStars = '★'.repeat(Math.min(rating, maxRating));
  const emptyStars = '☆'.repeat(Math.max(0, maxRating - rating));

  return (
    <span className={sizeClasses[size]} aria-label={`Hodnocení ${rating} z ${maxRating}`}>
      <span className="text-yellow-400">{filledStars}</span>
      <span className="text-gray-300">{emptyStars}</span>
    </span>
  );
};
