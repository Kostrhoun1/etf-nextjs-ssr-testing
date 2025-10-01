import React from 'react';
import type { Metadata } from 'next';
import BlogContent from '@/components/blog/BlogContent';

export const metadata: Metadata = {
  title: 'Blog - Tipy pro investory a ETF analýzy | ETF průvodce.cz',
  description: 'Kompletní průvodce ETF investováním: nejlepší fondy 2025, dividendové ETF, americké akcie, portfolio strategie a praktické tipy pro české investory. Začátečníci i pokročilí.',
  alternates: {
    canonical: 'https://www.etfpruvodce.cz/blog'
  }
};

export default function BlogPage() {
  return <BlogContent />;
}