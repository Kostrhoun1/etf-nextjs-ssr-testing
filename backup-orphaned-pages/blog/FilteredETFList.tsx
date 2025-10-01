'use client';

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ETFListItem } from "@/types/etf";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ETFSimpleTable from "../ETFSimpleTable";

interface FilteredETFListProps {
  filter: {
    category?: string;
    top?: number;
    sortBy?: keyof ETFListItem;
    sortOrder?: "asc" | "desc";
    indexNameKeywords?: string[];
    regionKeywords?: string[];
    nameKeywords?: string[];
    excludeNameKeywords?: string[]; // Nový parametr pro vyloučení
    fundProviderKeywords?: string[];
    hasDividendYield?: boolean;
    minDividendYield?: number;
    minFundSize?: number;
    excludeLeveraged?: boolean; // Vyloučí pákové ETF
  };
  showDividendYield?: boolean;
}

const FilteredETFList: React.FC<FilteredETFListProps> = ({ filter, showDividendYield = false }) => {
  const [data, setData] = useState<ETFListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>(filter.sortBy as string || 'fund_size_numeric');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(filter.sortOrder || 'desc');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`=== LOADING ${filter.sortBy} (${filter.sortOrder}) ===`);
        
        let query = supabase
          .from('etf_funds')
          .select(`
            isin,
            name,
            fund_provider,
            category,
            ter_numeric,
            return_1y,
            return_3y,
            return_5y,
            return_ytd,
            fund_size_numeric,
            degiro_free,
            primary_ticker,
            distribution_policy,
            index_name,
            fund_currency,
            replication,
            region,
            current_dividend_yield_numeric,
            exchange_1_ticker,
            exchange_2_ticker,
            exchange_3_ticker,
            exchange_4_ticker,
            exchange_5_ticker,
            is_leveraged,
            rating,
            rating_score
          `);
        
        console.log('=== FILTER DEBUG ===');
        console.log('Filter object:', filter);
        
        if (filter.category) {
          console.log(`SQL filtering by category: ${filter.category}`);
          query = query.eq('category', filter.category);
        }
        
        if (filter.indexNameKeywords && filter.indexNameKeywords.length > 0) {
          console.log(`SQL filtering by index keywords: ${filter.indexNameKeywords.join(', ')}`);
          const keywordConditions = filter.indexNameKeywords.map(keyword => 
            `index_name.ilike.%${keyword}%`
          ).join(',');
          query = query.or(keywordConditions);
        }
        
        if (filter.regionKeywords && filter.regionKeywords.length > 0) {
          console.log(`SQL filtering by region keywords: ${filter.regionKeywords.join(', ')}`);
          const regionConditions = filter.regionKeywords.map(keyword => 
            `region.ilike.%${keyword}%`
          ).join(',');
          query = query.or(regionConditions);
        }
        
        if (filter.nameKeywords && filter.nameKeywords.length > 0) {
          console.log(`SQL filtering by name keywords: ${filter.nameKeywords.join(', ')}`);
          const nameConditions = filter.nameKeywords.map(keyword => 
            `name.ilike.%${keyword}%`
          ).join(',');
          query = query.or(nameConditions);
        }
        
        if (filter.excludeNameKeywords && filter.excludeNameKeywords.length > 0) {
          console.log(`SQL excluding name keywords: ${filter.excludeNameKeywords.join(', ')}`);
          filter.excludeNameKeywords.forEach(keyword => {
            query = query.not('name', 'ilike', `%${keyword}%`);
          });
        }
        
        if (filter.fundProviderKeywords && filter.fundProviderKeywords.length > 0) {
          console.log(`SQL filtering by fund provider keywords: ${filter.fundProviderKeywords.join(', ')}`);
          const providerConditions = filter.fundProviderKeywords.map(keyword => 
            `fund_provider.ilike.%${keyword}%`
          ).join(',');
          query = query.or(providerConditions);
        }
        
        if (filter.hasDividendYield) {
          console.log('SQL filtering for funds with dividend yield > 0');
          query = query.gt('current_dividend_yield_numeric', 0);
        }
        
        if (filter.minDividendYield) {
          console.log(`SQL filtering by min dividend yield: ${filter.minDividendYield}`);
          query = query.gte('current_dividend_yield_numeric', filter.minDividendYield);
        }
        
        if (filter.minFundSize) {
          console.log(`SQL filtering by min fund size: ${filter.minFundSize}M EUR`);
          query = query.gte('fund_size_numeric', filter.minFundSize);
        }
        
        // Filtrování pro platné TER hodnoty (pokud řadíme podle TER)
        if (filter.sortBy === 'ter_numeric') {
          console.log('SQL filtering out NULL/empty TER values');
          query = query.not('ter_numeric', 'is', null).gt('ter_numeric', 0);
        }
        
        // Filtrování pro platné return_1y hodnoty (pokud řadíme podle return_1y)
        if (filter.sortBy === 'return_1y') {
          console.log('SQL filtering out NULL/empty return_1y values');
          query = query.not('return_1y', 'is', null);
        }
        
        // Vyloučí pákové ETF
        if (filter.excludeLeveraged) {
          console.log('SQL filtering out leveraged ETFs');
          query = query.eq('is_leveraged', false);
        }
        
        // Přidání sortování
        if (filter.sortBy) {
          const sortField = filter.sortBy as string;
          const order = filter.sortOrder || 'desc';
          console.log(`SQL sorting by ${sortField} ${order}`);
          query = query.order(sortField, { ascending: order === 'asc' });
        }
        
        // Omezení počtu výsledků
        if (filter.top) {
          console.log(`SQL limiting to top ${filter.top} results`);
          query = query.limit(filter.top);
        }
        
        const { data: result, error } = await query;
        
        if (error) {
          console.error('Supabase query error:', error);
          setError(`Chyba při načítání dat: ${error.message}`);
          return;
        }
        
        if (!result || result.length === 0) {
          console.warn('No data returned from query');
          setData([]);
          return;
        }
        
        console.log(`=== LOADED ${result.length} ETFs ===`);
        setData(result as ETFListItem[]);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError(`Neočekávaná chyba: ${err instanceof Error ? err.message : 'Neznámá chyba'}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filter]);

  const handleSort = (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(field);
    setSortOrder(newSortOrder);
    
    // Sort the existing data
    const sortedData = [...data].sort((a, b) => {
      const aVal = a[field as keyof ETFListItem];
      const bVal = b[field as keyof ETFListItem];
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return newSortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (newSortOrder === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
    
    setData(sortedData);
  };

  if (error) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-red-600">
            <p className="font-semibold">Chyba při načítání dat</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <ETFSimpleTable
          etfs={data}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          showPagination={false}
          isHomepage={false}
        />
      </CardContent>
    </Card>
  );
};

export default FilteredETFList;