'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Logo from '../Logo';
import GlobalETFSearch from '../GlobalETFSearch';

const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Co jsou ETF', href: '/co-jsou-etf', current: pathname === '/co-jsou-etf' },
    { name: 'Kde koupit ETF', href: '/kde-koupit-etf', current: pathname === '/kde-koupit-etf' },
    { name: 'Srovnání ETF', href: '/srovnani-etf', current: pathname === '/srovnani-etf' },
    { name: 'Portfolio', href: '/portfolio-strategie', current: pathname.startsWith('/portfolio-strategie') },
    { name: 'Kalkulačky', href: '/kalkulacky', current: pathname.startsWith('/kalkulacky') },
    { name: 'Nejlepší ETF', href: '/nejlepsi-etf', current: pathname.startsWith('/nejlepsi-etf') },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main header row */}
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <Logo size={180} className="group-hover:opacity-90 transition-opacity" />
            </Link>
          </div>

          {/* Desktop search */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <GlobalETFSearch
              placeholder="Hledat ETF podle ISIN, názvu..."
              className="w-full"
            />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  item.current
                    ? 'text-violet-600 bg-violet-100'
                    : 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Otevřít menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="mt-6 space-y-6">
                  <div className="px-4">
                    <GlobalETFSearch
                      placeholder="Hledat ETF..."
                      className="w-full"
                    />
                  </div>

                  <nav className="flex flex-col space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-md text-base font-medium transition-colors ${
                          item.current
                            ? 'text-violet-600 bg-violet-100'
                            : 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search row */}
        <div className="md:hidden lg:hidden border-t border-gray-100 py-3">
          <GlobalETFSearch
            placeholder="Hledat ETF podle ISIN, názvu..."
            className="w-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
