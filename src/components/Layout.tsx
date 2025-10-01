'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Menu, Mail, Settings } from 'lucide-react';
import Logo from './Logo';
import BreadcrumbNav from './SEO/BreadcrumbNav';
import LastUpdatedInfo from './LastUpdatedInfo';

interface LayoutProps {
  children: React.ReactNode;
  lastUpdated?: Date | null;
}

const getBrokerReviewBreadcrumbs = (pathname: string) => {
  // Broker review pages need custom breadcrumb paths
  const brokerReviews: { [key: string]: string } = {
    '/portu-recenze': 'Portu recenze 2025',
    '/degiro-recenze': 'DEGIRO recenze 2025',
    '/xtb-recenze': 'XTB recenze 2025',
    '/trading212-recenze': 'Trading 212 recenze 2025',
    '/interactive-brokers-recenze': 'Interactive Brokers recenze 2025',
    '/fio-ebroker-recenze': 'Fio eBroker recenze 2025'
  };

  if (brokerReviews[pathname]) {
    return [
      { name: 'Domů', item: '/' },
      { name: 'Kde koupit ETF', item: '/kde-koupit-etf' },
      { name: brokerReviews[pathname], item: pathname }
    ];
  }
  
  // Return undefined for other pages to use auto-generated breadcrumbs
  return undefined;
};

const Layout: React.FC<LayoutProps> = ({ children, lastUpdated }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Zjednodušené hlavní menu - logické pořadí od základů k pokročilým nástrojům
  const navigation = [
    { name: 'Co jsou ETF', href: '/co-jsou-etf', current: pathname === '/co-jsou-etf' },
    { name: 'Kde koupit ETF', href: '/kde-koupit-etf', current: pathname === '/kde-koupit-etf' },
    { name: 'Srovnání ETF', href: '/srovnani-etf', current: pathname === '/srovnani-etf' },
    { name: 'Portfolio', href: '/portfolio-strategie', current: pathname.startsWith('/portfolio-strategie') },
    { name: 'Kalkulačky', href: '/kalkulacky', current: pathname.startsWith('/kalkulacky') },
    { name: 'Nejlepší ETF', href: '/nejlepsi-etf', current: pathname.startsWith('/nejlepsi-etf') },
  ];

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={100}>
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <Logo size={180} className="group-hover:opacity-90 transition-opacity" />
              </Link>
            </div>
            
            {/* Desktop navigation - centered */}
            <nav className="hidden md:flex space-x-1 absolute left-1/2 transform -translate-x-1/2">
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
                  <div className="mt-6">
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
        </div>
      </header>
      
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav items={getBrokerReviewBreadcrumbs(pathname)} />
      
      {/* Main content */}
      <main>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center">
                <Logo size={180} />
              </div>
              <p className="text-slate-400 leading-relaxed max-w-sm">
                Váš moderní a komplexní průvodce světem ETF fondů pro české investory. 
                Srovnání, analýzy a vzdělávací obsah pro vaše investiční rozhodnutí.
              </p>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@etfpruvodce.cz" className="hover:text-white transition-colors">
                  info@etfpruvodce.cz
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold text-slate-200 mb-4 uppercase tracking-wider">Nástroje</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/srovnani-etf" className="hover:text-white transition-colors">🔍 Srovnání ETF</Link></li>
                <li><Link href="/portfolio-strategie" className="hover:text-white transition-colors">📊 Portfolio Strategie</Link></li>
                <li><Link href="/kalkulacky" className="hover:text-white transition-colors">🧮 Kalkulačky</Link></li>
                <li><Link href="/nejlepsi-etf/nejlevnejsi-etf" className="hover:text-white transition-colors">💰 Nejlevnější ETF</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-slate-200 mb-4 uppercase tracking-wider">Vzdělání</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/co-jsou-etf" className="hover:text-white transition-colors">Co jsou ETF</Link></li>
                <li><Link href="/kde-koupit-etf" className="hover:text-white transition-colors">Kde koupit ETF</Link></li>
                <li><Link href="/co-jsou-etf/jak-zacit-investovat" className="hover:text-white transition-colors">Jak začít investovat</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-slate-200 mb-4 uppercase tracking-wider">Brokeři</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/portu-recenze" className="hover:text-white transition-colors">Portu - recenze</Link></li>
                <li><Link href="/xtb-recenze" className="hover:text-white transition-colors">XTB - recenze</Link></li>
                <li><Link href="/degiro-recenze" className="hover:text-white transition-colors">DEGIRO - recenze</Link></li>
                <li><Link href="/interactive-brokers-recenze" className="hover:text-white transition-colors">Interactive Brokers - recenze</Link></li>
                <li><Link href="/trading212-recenze" className="hover:text-white transition-colors">Trading 212 - recenze</Link></li>
                <li><Link href="/fio-ebroker-recenze" className="hover:text-white transition-colors">Fio e-Broker - recenze</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-slate-500">&copy; 2025 ETF průvodce.cz. Všechna práva vyhrazena.</p>
{lastUpdated && (
                <LastUpdatedInfo lastUpdated={lastUpdated} className="text-slate-500" />
              )}
            </div>
          </div>
        </div>
      </footer>
      </div>
    </TooltipProvider>
  );
};

export default Layout;