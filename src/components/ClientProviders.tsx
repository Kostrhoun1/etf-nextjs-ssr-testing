'use client';

import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';

interface ClientProvidersProps {
  children: React.ReactNode;
}

// This is a thin Client Component wrapper that only provides
// interactive contexts. Children are still SSR'd properly.
const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={100}>
      {children}
    </TooltipProvider>
  );
};

export default ClientProviders;
