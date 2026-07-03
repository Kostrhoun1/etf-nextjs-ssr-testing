// Plain (non-'use client') module so it can be imported by both server and
// client components. Exporting this from a 'use client' file turns it into a
// client-reference stub on the server (href becomes undefined → Link crash).
export const reviewHref: Record<string, string> = {
  degiro: '/design-preview/recenze/degiro',
  xtb: '/design-preview/recenze/xtb',
  trading212: '/design-preview/recenze/trading212',
  ibkr: '/design-preview/recenze/ibkr',
  fio: '/design-preview/recenze/fio',
  portu: '/design-preview/recenze/portu',
};
