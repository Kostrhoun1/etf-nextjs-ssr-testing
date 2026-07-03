// Plain (non-'use client') module so it can be imported by both server and
// client components. Exporting this from a 'use client' file turns it into a
// client-reference stub on the server (href becomes undefined → Link crash).
export const reviewHref: Record<string, string> = {
  degiro: '/degiro-recenze',
  xtb: '/xtb-recenze',
  trading212: '/trading212-recenze',
  ibkr: '/interactive-brokers-recenze',
  fio: '/fio-ebroker-recenze',
  portu: '/portu-recenze',
};
