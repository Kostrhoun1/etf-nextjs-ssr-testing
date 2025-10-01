'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  item?: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items }) => {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on homepage
  if (pathname === '/') {
    return null;
  }

  let breadcrumbItems;
  
  if (items && items.length > 0) {
    // Use provided items
    breadcrumbItems = items.map(item => ({
      name: item.name,
      href: item.item || item.href || '/'
    }));
  } else {
    // Fallback to auto-generated from URL
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    breadcrumbItems = [
      { name: 'Domů', href: '/' },
      ...pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
        return { name, href };
      })
    ];
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-gray-900 font-medium">{item.name}</span>
              ) : (
                <Link 
                  href={item.href} 
                  className="hover:text-violet-600 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default BreadcrumbNav;