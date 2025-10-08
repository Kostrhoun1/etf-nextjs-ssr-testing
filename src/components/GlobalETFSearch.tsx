'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ETFSearchResult {
  isin: string;
  name: string;
  primary_ticker?: string;
  fund_provider?: string;
}

interface GlobalETFSearchProps {
  className?: string;
  placeholder?: string;
}

const GlobalETFSearch: React.FC<GlobalETFSearchProps> = ({ 
  className = "",
  placeholder = "Hledat ETF podle ISIN, názvu nebo tickeru..."
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ETFSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Zavři dropdown při kliknutí mimo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Vyhledání ETF
  const searchETFs = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/etf/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(data.results?.length > 0);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchETFs(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Navigace na ETF detail
  const handleSelectETF = (etf: ETFSearchResult) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/etf/${etf.isin}`);
    inputRef.current?.blur();
  };

  // Enter key handling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleSelectETF(results[0]);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          className="pl-10 pr-10 bg-white/90 border-gray-200 focus:border-violet-300 focus:ring-violet-200"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Dropdown s výsledky - širší než search pole */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto min-w-full w-max max-w-2xl">
          {results.map((etf) => (
            <button
              key={etf.isin}
              onClick={() => handleSelectETF(etf)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="font-medium text-gray-900 line-clamp-2 leading-5 mb-1">
                    {etf.name}
                  </div>
                  <div className="text-sm text-gray-500 flex flex-wrap items-center gap-2">
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {etf.isin}
                    </span>
                    {etf.primary_ticker && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                        {etf.primary_ticker}
                      </span>
                    )}
                    {etf.fund_provider && (
                      <span className="text-gray-600 text-xs">
                        {etf.fund_provider}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          {/* Footer pro větší výsledky */}
          {results.length >= 10 && (
            <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50 border-t">
              Zobrazeno {results.length} výsledků. Pro více použijte pokročilé vyhledávání.
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  router.push(`/srovnani-etf?search=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                }}
                className="ml-2 p-0 h-auto text-violet-600"
              >
                Pokročilé vyhledávání →
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalETFSearch;