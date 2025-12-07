// Server Component - NO 'use client' directive!
// This ensures children are rendered on the server for SEO

import React from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import BreadcrumbNav from './SEO/BreadcrumbNav';
import ClientProviders from './ClientProviders';

interface LayoutProps {
  children: React.ReactNode;
  lastUpdated?: Date | null;
}

const Layout: React.FC<LayoutProps> = ({ children, lastUpdated }) => {
  return (
    <ClientProviders>
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Header - Client Component for interactivity */}
        <Header />

        {/* Breadcrumb Navigation - temporarily disabled for SEO testing */}
        {/* <BreadcrumbNav /> */}

        {/* Main content - Server rendered for SEO */}
        <main>
          {children}
        </main>

        {/* Footer - Server Component */}
        <Footer lastUpdated={lastUpdated} />
      </div>
    </ClientProviders>
  );
};

export default Layout;
