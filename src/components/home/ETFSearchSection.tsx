'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useETFSearchData } from '@/hooks/useETFSearchData';
import { useETFTableLogic } from '@/hooks/useETFTableLogic';
import { useETFComparison } from '@/hooks/useETFComparison';
import ETFSimpleTable from '@/components/ETFSimpleTable';
import ETFComparisonPanel from '@/components/ETFComparisonPanel';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CurrencyToggle from '@/components/ui/CurrencyToggle';

const ETFSearchSection: React.FC = () => {
  const router = useRouter();
  const { etfs, categories, totalETFCount, isLoading, isLoadingComplete } = useETFSearchData();
  const {
    searchTerm,
    paginatedETFs,
    filteredETFs,
    totalPages,
    currentPage,
    activeCategory,
    sortBy,
    sortOrder,
    advancedFilters,
    ranges,
    handleSearch,
    handleCategoryChange,
    handleSort,
    setCurrentPage,
    handleAdvancedFilterChange,
  } = useETFTableLogic(etfs);

  const {
    selectedETFs,
    addETFToComparison,
    removeETFFromComparison,
    clearComparison,
    isETFSelected,
    canAddMore,
  } = useETFComparison();

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
            <Search className="w-4 h-4" />
            Interaktivní vyhledávání
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Najděte perfektní ETF pro vaše portfolio
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Prohledejte databázi {totalETFCount.toLocaleString()} ETF fondů
          </p>
        </div>

        {/* Vyhledávací pole */}
        <div className="mb-6">
          <div className="max-w-2xl mx-auto">
            <Input
              placeholder="Vyhledejte podle názvu, ISIN nebo poskytovatele..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-12 text-base px-4"
            />
          </div>
        </div>

        {/* Layout s taby/dropdown */}
        <div className="w-full">
          {/* Dropdown pro mobily */}
          <div className="block md:hidden mb-4">
            <Select value={activeCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vyberte kategorii ETF" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Hlavní obsah */}
          <div>
            <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
              {/* Taby pro větší obrazovky */}
              <TabsList className="hidden md:grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-4">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="text-xs md:text-sm px-2 py-1">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Obsah tabů */}
              {categories.map(category => (
                <TabsContent key={category} value={category}>
                  {/* Statistiky */}
                  <div className="mb-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600">
                        <span className="text-gray-700 font-medium">
                          TOP {Math.min(10, filteredETFs.length)}
                        </span>
                        <span className="text-sm sm:text-base">ETF fondů v kategorii <strong>{category}</strong></span>
                        <span className="text-sm text-gray-500">({filteredETFs.length} celkem)</span>
                      </div>
                      <div className="flex justify-start md:justify-end">
                        <CurrencyToggle className="scale-90 md:scale-100" />
                      </div>
                    </div>
                  </div>


                  {/* Tabulka ETF */}
                  <ETFSimpleTable
                    etfs={filteredETFs.slice(0, 10)}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    selectedETFs={selectedETFs}
                    onAddETF={addETFToComparison}
                    onRemoveETF={removeETFFromComparison}
                    isETFSelected={isETFSelected}
                    canAddMore={canAddMore}
                    showPagination={false}
                    isHomepage={true}
                  />

                  {/* Vylepšené CTA */}
                  <div className="mt-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="text-center md:text-left">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {selectedETFs.length > 0 
                            ? `Máte vybráno ${selectedETFs.length} ETF fondů k porovnání` 
                            : `Chcete vidět více než TOP ${Math.min(10, filteredETFs.length)}?`
                          }
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {selectedETFs.length > 0
                            ? "Porovnejte je detailně nebo pokračujte v procházení všech fondů"
                            : `V kategorii ${category} máme celkem ${filteredETFs.length} ETF fondů s pokročilými filtry`
                          }
                        </p>
                      </div>
                      <div className="flex gap-3">
                        {selectedETFs.length > 0 && (
                          <Button
                            onClick={() => {
                              // Navigate to comparison with selected ETFs  
                              const etfIds = selectedETFs.map(etf => etf.isin).join(',');
                              router.push(`/srovnani-etf?compare=${etfIds}`);
                            }}
                            className="bg-violet-600 hover:bg-violet-700 text-white px-6"
                          >
                            Porovnat vybrané ({selectedETFs.length})
                          </Button>
                        )}
                        <Button
                          onClick={() => router.push('/srovnani-etf')}
                          variant={selectedETFs.length > 0 ? "outline" : "default"}
                          className={selectedETFs.length > 0 ? "border-violet-200 text-violet-700 hover:bg-violet-50" : "bg-violet-600 hover:bg-violet-700 text-white px-6"}
                        >
                          {filteredETFs.length > 10 ? `Zobrazit všech ${filteredETFs.length} fondů` : "Pokročilé vyhledávání"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>

      {/* Floating comparison panel */}
      <ETFComparisonPanel
        selectedETFs={selectedETFs}
        onRemoveETF={removeETFFromComparison}
        onClearAll={clearComparison}
        onShowComparison={() => {
          console.log('ETFSearchSection - onShowComparison called, selectedETFs:', selectedETFs);
          const etfIds = selectedETFs.map(etf => etf.isin).join(',');
          console.log('ETFSearchSection - etfIds:', etfIds);
          console.log('ETFSearchSection - navigating to:', `/srovnani-etf?compare=${etfIds}`);
          router.push(`/srovnani-etf?compare=${etfIds}`);
        }}
      />
    </section>
  );
};

export default ETFSearchSection;