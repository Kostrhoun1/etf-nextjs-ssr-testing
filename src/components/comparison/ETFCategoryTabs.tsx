'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ETFCategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const ETFCategoryTabs: React.FC<ETFCategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="mb-6">
      {/* Dropdown pro mobily */}
      <div className="block md:hidden">
        <Select value={activeCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Vyberte kategorii ETF" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Taby pro větší obrazovky */}
      <div className="hidden md:block">
        <Tabs value={activeCategory} onValueChange={onCategoryChange}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="text-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default ETFCategoryTabs;