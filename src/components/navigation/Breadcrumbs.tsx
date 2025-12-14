'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@/components/ui/icons';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav 
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
    >
      {/* Home */}
      <Link 
        href="/"
        className="flex items-center hover:text-violet-600 transition-colors"
        aria-label="Domů"
      >
        <HomeIcon />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRightIcon className="text-gray-400" />
          {item.href && index < items.length - 1 ? (
            <Link 
              href={item.href}
              className="hover:text-violet-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
      
      {/* JSON-LD Structured Data for Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Domů",
                "item": "https://www.etfpruvodce.cz/"
              },
              ...items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 2,
                "name": item.label,
                "item": item.href ? `https://www.etfpruvodce.cz${item.href}` : undefined
              }))
            ]
          })
        }}
      />
    </nav>
  );
};

export default Breadcrumbs;