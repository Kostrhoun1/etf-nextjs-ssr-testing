// Server Component - NO 'use client' directive!
// This ensures children are rendered on the server for SEO

import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import Header from './layout/Header';
import Footer from './layout/Footer';
import BreadcrumbNav from './SEO/BreadcrumbNav';

interface LayoutProps {
  children: React.ReactNode;
  lastUpdated?: Date | null;
}

const Layout: React.FC<LayoutProps> = ({ children, lastUpdated }) => {
  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={100}>
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Header - Client Component for interactivity */}
        <Header />

        {/* Breadcrumb Navigation - Client Component for pathname */}
        <BreadcrumbNav />

        {/* Main content - Server rendered for SEO */}
        <main>
          {children}
        </main>

        {/* Footer - Server Component */}
        <Footer lastUpdated={lastUpdated} />
      </div>
    </TooltipProvider>
  );
};

export default Layout;
