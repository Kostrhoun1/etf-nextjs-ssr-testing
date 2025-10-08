
'use client';

import { useState, useEffect } from 'react';
import { useETFData } from './useETFData';
import { ETFListItem } from '@/types/etf';

// Helper function to filter out 'Ostatní' category and sort remaining
const sortCategories = (categories: string[]): string[] => {
  return categories
    .filter(category => category !== 'Ostatní') // Filter out 'Ostatní' as it only contains 1 ETF
    .sort((a, b) => a.localeCompare(b)); // Regular alphabetical sort
};

export const useETFSearchData = () => {
  console.log('🎪 useETFSearchData hook initialized');
  const [etfs, setETFs] = useState<ETFListItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [maxTerFromData, setMaxTerFromData] = useState<number>(2);
  const [totalETFCount, setTotalETFCount] = useState<number>(0);
  const { fetchETFs, isLoading, lastUpdated, getETFCount } = useETFData();
  
  console.log('🎪 useETFSearchData - fetchETFs type:', typeof fetchETFs);

  useEffect(() => {
    console.log('🎯 useETFSearchData useEffect triggered');
    const loadData = async () => {
      try {
        console.log('🚀 Starting FAST ETF data loading process...');
        
        // Načti všechny ETF najednou
        const allETFs = await fetchETFs(); // bez limitu = všechny
        
        // Přidej ticker alias pro kompatibilitu
        const allETFsWithTicker = allETFs.map(etf => ({
          ...etf,
          ticker: etf.primary_ticker || etf.exchange_1_ticker || 'N/A'
        }));
        setETFs(allETFsWithTicker);
        
        // Spočítej celkový počet ETF
        const totalCount = await getETFCount();
        setTotalETFCount(totalCount);
        
        // Extract všechny kategorie
        const allCategories = Array.from(new Set(allETFsWithTicker.map(etf => etf.category).filter(Boolean)));
        setCategories(sortCategories(allCategories));
        
        // Calculate max TER ze všech dat
        const allTerValues = allETFsWithTicker.map(etf => etf.ter_numeric).filter(ter => ter && ter > 0);
        if (allTerValues.length > 0) {
          const maxTer = Math.max(...allTerValues);
          setMaxTerFromData(Math.ceil(maxTer * 100) / 100);
        }
        
        console.log(`✅ Loading complete: ${allETFs.length} ETFs loaded`);
        
      } catch (error) {
        console.error('Error loading ETF data:', error);
      }
    };

    loadData();
  }, []); // Empty dependency array to run only on mount

  return {
    etfs,
    categories,
    maxTerFromData,
    totalETFCount, // Pro zobrazení celkového počtu
    isLoading,
    isLoadingComplete: !isLoading,
    lastUpdated
  };
};
