// Plain (non-'use client') module so it can be imported by both server and
// client components. Exporting this from a 'use client' file turns it into a
// client-reference stub on the server (href becomes undefined → Link crash).
export const reviewHref: Record<string, string> = {
  degiro: '/recenze/degiro',
  xtb: '/recenze/xtb',
  trading212: '/recenze/trading212',
  ibkr: '/recenze/ibkr',
  fio: '/recenze/fio',
  portu: '/recenze/portu',
};

// Produkční absolutní URL recenzí na ostrém webu. Slugy jsou nepravidelné
// (ibkr → interactive-brokers, fio → fio-ebroker), proto explicitní mapa
// místo šablony `${id}-recenze`. Canonical preview recenzí musí mířit sem,
// aby se indexační signály konsolidovaly na ostré URL (ne do /design-preview).
export const reviewCanonical: Record<string, string> = {
  degiro: 'https://etfpruvodce.cz/degiro-recenze',
  xtb: 'https://etfpruvodce.cz/xtb-recenze',
  trading212: 'https://etfpruvodce.cz/trading212-recenze',
  ibkr: 'https://etfpruvodce.cz/interactive-brokers-recenze',
  fio: 'https://etfpruvodce.cz/fio-ebroker-recenze',
  portu: 'https://etfpruvodce.cz/portu-recenze',
};
