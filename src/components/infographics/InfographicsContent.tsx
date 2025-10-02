'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, PieChart, Image as ImageIcon, Download, TrendingUp, Globe } from 'lucide-react';
import Layout from '@/components/Layout';

const InfographicsContent: React.FC = () => {
  const [language, setLanguage] = useState<'cs' | 'en'>('cs');

  const tools = [
    {
      title: 'Portfolio Analyzer',
      titleCs: 'Portfolio Analyzátor',
      description: 'Interactive portfolio analysis with risk metrics and allocation charts',
      descriptionCs: 'Interaktivní analýza portfolia s rizikovými metrikami a grafy alokace',
      icon: PieChart,
      category: 'Analysis',
      categoryCs: 'Analýzy',
      comingSoon: false
    },
    {
      title: 'ETF Performance Charts',
      titleCs: 'Grafy výkonnosti ETF',
      description: 'Generate performance comparison charts for multiple ETFs',
      descriptionCs: 'Generování grafů pro porovnání výkonnosti více ETF fondů',
      icon: BarChart3,
      category: 'Charts',
      categoryCs: 'Grafy',
      comingSoon: false
    },
    {
      title: 'Social Media Templates',
      titleCs: 'Šablony pro sociální sítě',
      description: 'Ready-to-use templates for sharing investment insights',
      descriptionCs: 'Připravené šablony pro sdílení investičních poznatků',
      icon: ImageIcon,
      category: 'Social',
      categoryCs: 'Sociální sítě',
      comingSoon: false
    },
    {
      title: 'Market Heatmap',
      titleCs: 'Mapa trhů',
      description: 'Visual representation of market sectors and performance',
      descriptionCs: 'Vizuální reprezentace tržních sektorů a výkonnosti',
      icon: TrendingUp,
      category: 'Markets',
      categoryCs: 'Trhy',
      comingSoon: true
    }
  ];

  const isCs = language === 'cs';

  return (
    <Layout>
      <div className="w-full min-h-screen bg-gray-50">
        {/* Hero sekce */}
        <section className="relative flex flex-col items-center justify-center px-4 py-12 md:py-20 mb-6 bg-gradient-to-br from-violet-600 to-violet-800">
          <div className="relative z-10 max-w-2xl text-center">
            <span className="uppercase text-xs font-bold text-violet-200 tracking-widest">
              {isCs ? 'VIZUÁLNÍ NÁSTROJE' : 'VISUAL TOOLS'}
            </span>
            <h1 className="font-extrabold text-4xl md:text-5xl text-white mt-3 mb-4">
              {isCs ? 'ETF Infografiky' : 'ETF Infographics'}
            </h1>
            <p className="text-violet-100 text-lg md:text-xl mb-6">
              {isCs 
                ? 'Interaktivní nástroje pro vytváření infografik, analýzu portfolia a vizualizaci investičních dat.'
                : 'Interactive tools for creating infographics, portfolio analysis and investment data visualization.'
              }
            </p>
            <div className="flex justify-center gap-2 mb-6">
              <Button
                variant={language === 'cs' ? 'default' : 'outline'}
                onClick={() => setLanguage('cs')}
                className={language === 'cs' ? 'bg-white text-violet-800' : 'text-white border-white'}
              >
                🇨🇿 Čeština
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-white text-violet-800' : 'text-white border-white'}
              >
                🇬🇧 English
              </Button>
            </div>
          </div>
        </section>

        {/* Nástroje */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool, idx) => {
              const IconComponent = tool.icon;
              const title = isCs ? tool.titleCs : tool.title;
              const description = isCs ? tool.descriptionCs : tool.description;
              const category = isCs ? tool.categoryCs : tool.category;

              return (
                <Card
                  key={idx}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-200 animate-fade-in flex flex-col h-full relative"
                >
                  {tool.comingSoon && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {isCs ? 'Připravuje se' : 'Coming Soon'}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-100 text-violet-600 group-hover:bg-violet-200 transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <Badge className="bg-gray-100 text-gray-600">
                        {category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-violet-700 transition-colors">
                      {title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                      {description}
                    </p>
                    
                    <div className="flex gap-2">
                      {idx === 0 && ( // Portfolio Analyzer
                        <Link href="/portfolio-strategie" className="flex-1">
                          <Button className="w-full bg-violet-600 hover:bg-violet-700">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            {isCs ? 'Vytvořit' : 'Create'}
                          </Button>
                        </Link>
                      )}
                      {idx === 1 && ( // ETF Performance Charts
                        <Link href="/srovnani-etf" className="flex-1">
                          <Button className="w-full bg-violet-600 hover:bg-violet-700">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            {isCs ? 'Vytvořit' : 'Create'}
                          </Button>
                        </Link>
                      )}
                      {idx === 2 && ( // Social Media Templates
                        <Link href="/srovnani-etf?view=infographic" className="flex-1">
                          <Button className="w-full bg-violet-600 hover:bg-violet-700">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            {isCs ? 'Vytvořit' : 'Create'}
                          </Button>
                        </Link>
                      )}
                      {idx === 3 && ( // Market Heatmap
                        <Button 
                          className="flex-1 bg-violet-600 hover:bg-violet-700" 
                          disabled={tool.comingSoon}
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          {isCs ? 'Vytvořit' : 'Create'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Funkce */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isCs ? 'Co můžete vytvořit' : 'What You Can Create'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isCs 
                ? 'Profesionální vizualizace pro sociální sítě, prezentace a osobní potřebu.'
                : 'Professional visualizations for social media, presentations and personal use.'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 text-violet-600 mx-auto mb-4">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {isCs ? 'Investiční grafy' : 'Investment Charts'}
              </h3>
              <p className="text-gray-600">
                {isCs 
                  ? 'Porovnání výkonnosti, alokace portfolia a trendové analýzy'
                  : 'Performance comparisons, portfolio allocation and trend analysis'
                }
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto mb-4">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {isCs ? 'Sociální sítě' : 'Social Media'}
              </h3>
              <p className="text-gray-600">
                {isCs 
                  ? 'Optimalizované formáty pro Instagram, Twitter a LinkedIn'
                  : 'Optimized formats for Instagram, Twitter and LinkedIn'
                }
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                <Download className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {isCs ? 'Export formáty' : 'Export Formats'}
              </h3>
              <p className="text-gray-600">
                {isCs 
                  ? 'PNG, SVG a PDF ve vysoké kvalitě pro tisk i web'
                  : 'High-quality PNG, SVG and PDF for print and web'
                }
              </p>
            </div>
          </div>
        </section>

        {/* CTA sekce */}
        <section className="bg-violet-600 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              {isCs ? 'Začněte vytvářet dnes' : 'Start Creating Today'}
            </h2>
            <p className="text-violet-100 text-xl mb-8">
              {isCs 
                ? 'Všechny nástroje jsou zdarma a nevyžadují registraci.'
                : 'All tools are free and require no registration.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/srovnani-etf">
                <Button size="lg" className="bg-white text-violet-600 hover:bg-gray-100">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  {isCs ? 'Vytvořit první infografiku' : 'Create First Infographic'}
                </Button>
              </Link>
              <Link href="/portfolio-strategie">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-violet-700">
                  <Globe className="w-5 h-5 mr-2" />
                  {isCs ? 'Procházet příklady' : 'Browse Examples'}
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default InfographicsContent;