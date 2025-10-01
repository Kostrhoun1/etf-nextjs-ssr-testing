'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Target, LucideIcon } from 'lucide-react';

interface PortfolioStrategyHeroProps {
  badge: {
    icon: LucideIcon;
    text: string;
    colors: string;
  };
  title: {
    main: string;
    gradient: string;
    gradientColors: string;
  };
  description: string;
  stats: {
    expectedReturn: string;
    composition: string;
    risk: string;
    rebalancing: string;
  };
  colors: {
    gradientOverlay: string;
    blobs: string[];
    cardBackground: string;
    primaryButton: string;
    secondaryButton: string;
    accentText: string;
  };
  scrollTarget?: string;
  calculatorLink?: string;
}

export default function PortfolioStrategyHero({
  badge,
  title,
  description,
  stats,
  colors,
  scrollTarget = 'allocation',
  calculatorLink = '/kalkulacky/investicni-kalkulacka'
}: PortfolioStrategyHeroProps) {
  const IconComponent = badge.icon;

  return (
    <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className={`absolute inset-0 ${colors.gradientOverlay}`}></div>
      <div className={`absolute top-20 left-1/4 w-72 h-72 ${colors.blobs[0]} rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob`}></div>
      <div className={`absolute top-40 right-1/4 w-72 h-72 ${colors.blobs[1]} rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000`}></div>
      <div className={`absolute bottom-20 left-1/3 w-72 h-72 ${colors.blobs[2]} rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000`}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className={`inline-flex items-center ${badge.colors} px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-opacity-50`}>
              <IconComponent className="w-4 h-4 mr-2" />
              {badge.text}
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              {title.main}{' '}
              <span className={`${title.gradientColors} bg-clip-text text-transparent`}>
                {title.gradient}
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth' })}
                className={`${colors.primaryButton} text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 h-12`}
              >
                <BarChart3 className="w-5 h-5" />
                Zobrazit složení
              </button>
              <Link 
                href={calculatorLink}
                className={`${colors.secondaryButton} px-8 py-3 text-lg font-semibold rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2 h-12`}
              >
                <Target className="w-5 h-5" />
                Spočítat výnos
              </Link>
            </div>
          </div>
          
          {/* Right Content - Visual Element */}
          <div className="relative">
            <div className={`absolute inset-0 ${colors.cardBackground} rounded-3xl transform rotate-3`}></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Klíčové údaje</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Očekávaný výnos</span>
                  <span className={`text-2xl font-bold ${colors.accentText}`}>{stats.expectedReturn}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Složení</span>
                  <span className="font-semibold text-gray-900">{stats.composition}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Riziko</span>
                  <span className={`font-semibold ${colors.accentText}`}>{stats.risk}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rebalancing</span>
                  <span className="font-semibold text-gray-900">{stats.rebalancing}</span>
                </div>
              </div>
              <div className={`mt-6 p-4 ${badge.colors} rounded-lg border border-opacity-50`}>
                <p className="text-sm font-semibold">
                  🛡️ Strategie pro všechny ekonomické podmínky
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}