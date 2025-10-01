'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  );
};

export default ETFCategoryTabs;