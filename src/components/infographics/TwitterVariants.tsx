'use client';

import React, { useRef, useState } from 'react';
import { TrendingUp, Star, Trophy, Medal, Crown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Twitter/X Format (1200x675) - Různé grafické varianty
interface TwitterVariantProps {
  title: string;
  subtitle?: string;
  data?: any[];
  children?: React.ReactNode;
}

// Varianta 1: Minimalistická s velkými fonty
const TwitterVariant1: React.FC<TwitterVariantProps> = ({ title, subtitle, children }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={cardRef}
      className="relative w-[1200px] h-[675px] bg-white shadow-xl overflow-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Jednoduchý header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black leading-tight">{title}</h1>
            {subtitle && <p className="text-white/90 text-xl mt-2">{subtitle}</p>}
          </div>
          <div className="text-right">
            <div className="text-lg font-medium">www.etfpruvodce.cz</div>
          </div>
        </div>
      </div>

      {/* Content s větším prostorem */}
      <div className="h-[579px] p-6 bg-gray-50">
        {children}
      </div>
    </div>
  );
};

// Varianta 2: Moderní s ikonami a gradientem
const TwitterVariant2: React.FC<TwitterVariantProps> = ({ title, subtitle, children }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={cardRef}
      className="relative w-[1200px] h-[675px] bg-gradient-to-br from-violet-50 to-purple-100 shadow-xl overflow-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Moderní header s ikonou */}
      <div className="bg-white/90 backdrop-blur-sm border-b-4 border-violet-600 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-violet-600 p-4 rounded-2xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 leading-tight">{title}</h1>
              {subtitle && <p className="text-gray-600 text-xl mt-1">{subtitle}</p>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium text-violet-600">www.etfpruvodce.cz</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="h-[547px] p-6">
        {children}
      </div>
    </div>
  );
};

// Varianta 3: Tmavá s kontrastními barvami
const TwitterVariant3: React.FC<TwitterVariantProps> = ({ title, subtitle, children }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={cardRef}
      className="relative w-[1200px] h-[675px] bg-gray-900 shadow-xl overflow-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Tmavý header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Crown className="w-10 h-10" />
            <div>
              <h1 className="text-4xl font-black">{title}</h1>
              {subtitle && <p className="text-white/90 text-xl mt-1">{subtitle}</p>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium">www.etfpruvodce.cz</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="h-[579px] p-6 bg-gray-800">
        {children}
      </div>
    </div>
  );
};

// Varianta 4: Čistá bílá s barevnými akcenty
const TwitterVariant4: React.FC<TwitterVariantProps> = ({ title, subtitle, children }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={cardRef}
      className="relative w-[1200px] h-[675px] bg-white shadow-xl border-4 border-violet-200 overflow-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Čistý header */}
      <div className="bg-white border-b-2 border-violet-600 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-600 text-xl mt-1">{subtitle}</p>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium text-violet-600">www.etfpruvodce.cz</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="h-[543px] p-6">
        {children}
      </div>
    </div>
  );
};

// Varianta 5: ETF průvodce styl (emerald gradientu jako na co-jsou-etf)
const TwitterVariant5: React.FC<TwitterVariantProps> = ({ title, subtitle, children }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={cardRef}
      className="relative w-[1200px] h-[675px] bg-gradient-to-br from-gray-50 to-white shadow-xl overflow-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Animované pozadí s blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-blue-50/50"></div>
      <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
      <div className="absolute top-20 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
      <div className="absolute bottom-10 left-1/3 w-32 h-32 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
      
      {/* Moderní header s emerald gradientem */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-emerald-200/50">
              <TrendingUp className="w-4 h-4 mr-2" />
              ETF analýza 2025
            </div>
            <div>
              <h1 className="text-3xl font-black leading-tight">{title}</h1>
              {subtitle && <p className="text-white/90 text-lg mt-1">{subtitle}</p>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium">www.etfpruvodce.cz</div>
          </div>
        </div>
      </div>

      {/* Content s moderním designem */}
      <div className="relative h-[579px] p-6">
        {children}
      </div>
    </div>
  );
};

// Obsah optimalizovaný pro čitelnost na X
const TwitterOptimizedContent: React.FC<{ data: any[], mode: 'performance' | 'ter' }> = ({ data, mode }) => {
  if (mode === 'performance') {
    return (
      <div className="w-full space-y-2">
        {data.slice(0, 5).map((etf, index) => (
          <div key={etf.isin} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-black text-2xl text-gray-900 leading-tight mb-1">{etf.name}</div>
                <div className="text-base text-gray-600 font-medium">{etf.primary_ticker} • TER: {etf.ter_numeric}%</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-green-600">
                +{etf.performance}%
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (mode === 'ter') {
    return (
      <div className="w-full space-y-2">
        {data.slice(0, 5).map((etf, index) => (
          <div key={etf.isin} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-black text-2xl text-gray-900 leading-tight mb-1">{etf.name}</div>
                <div className="text-base text-gray-600 font-medium">{etf.primary_ticker} • TER: {etf.ter_numeric}%</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-emerald-600">
                {etf.ter_numeric}%
              </div>
              <div className="text-sm text-gray-500 font-medium">TER ročně</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

// Hlavní komponenta s výběrem variant
const TwitterVariants: React.FC<{
  title: string;
  subtitle?: string;
  data?: any[];
  mode: 'performance' | 'ter';
}> = ({ title, subtitle, data = [], mode }) => {
  const [selectedVariant, setSelectedVariant] = useState<1 | 2 | 3 | 4 | 5>(1);

  const downloadImage = (format: string) => {
    // Implementace pro stáhnutí obrázku - zatím jen placeholder
    console.log(`Stahování ${format} formátu pro variantu ${selectedVariant}`);
    // TODO: Implementovat html2canvas nebo podobné řešení pro export
  };

  const getVariantComponent = () => {
    const content = <TwitterOptimizedContent data={data} mode={mode} />;
    
    switch (selectedVariant) {
      case 1:
        return <TwitterVariant1 title={title} subtitle={subtitle}>{content}</TwitterVariant1>;
      case 2:
        return <TwitterVariant2 title={title} subtitle={subtitle}>{content}</TwitterVariant2>;
      case 3:
        return <TwitterVariant3 title={title} subtitle={subtitle}>{content}</TwitterVariant3>;
      case 4:
        return <TwitterVariant4 title={title} subtitle={subtitle}>{content}</TwitterVariant4>;
      case 5:
        return <TwitterVariant5 title={title} subtitle={subtitle}>{content}</TwitterVariant5>;
      default:
        return <TwitterVariant1 title={title} subtitle={subtitle}>{content}</TwitterVariant1>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Výběr variant */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant={selectedVariant === 1 ? 'default' : 'outline'}
          onClick={() => setSelectedVariant(1)}
          className="gap-2"
        >
          🎯 Minimalistická
        </Button>
        <Button
          variant={selectedVariant === 2 ? 'default' : 'outline'}
          onClick={() => setSelectedVariant(2)}
          className="gap-2"
        >
          🏆 Moderní s ikonami
        </Button>
        <Button
          variant={selectedVariant === 3 ? 'default' : 'outline'}
          onClick={() => setSelectedVariant(3)}
          className="gap-2"
        >
          🌙 Tmavá verze
        </Button>
        <Button
          variant={selectedVariant === 4 ? 'default' : 'outline'}
          onClick={() => setSelectedVariant(4)}
          className="gap-2"
        >
          ⭐ Čistá bílá
        </Button>
        <Button
          variant={selectedVariant === 5 ? 'default' : 'outline'}
          onClick={() => setSelectedVariant(5)}
          className="gap-2"
        >
          🌿 ETF průvodce
        </Button>
      </div>


      {/* Preview */}
      <div className="flex justify-center overflow-auto">
        <div className="transform scale-75 origin-top">
          {getVariantComponent()}
        </div>
      </div>
    </div>
  );
};

export default TwitterVariants;