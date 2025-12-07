'use client';

import React from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

interface KalkulackyHeroProps {
  currentYear: number;
}

const KalkulackyHero: React.FC<KalkulackyHeroProps> = ({ currentYear }) => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-violet-50/30 to-blue-50/50"></div>
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-200 to-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-[60vh]">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-purple-200/50">
              <Calculator className="w-4 h-4 mr-2" />
              Aktualizováno pro rok {currentYear}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Finanční{' '}
              <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                kalkulačky
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              Kompletní sada bezplatných finančních nástrojů s nejnovějšími daty.
              Od hypotéky až po pokročilé investiční analýzy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('kalkulacky')}
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Zobrazit kalkulačky
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="bg-white/80 backdrop-blur-sm border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Jak fungují?
              </button>
            </div>
          </div>

          {/* Right Content - Visual Element */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-3xl transform rotate-3"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Proč naše kalkulačky?</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Aktuální data {currentYear}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                  <span className="text-gray-700">Přesné výpočty jako banky</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Zdarma navždy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-gray-700">Žádná registrace</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                <p className="text-sm font-semibold text-purple-800">
                  📊 10+ specializovaných nástrojů včetně backtestů
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KalkulackyHero;
