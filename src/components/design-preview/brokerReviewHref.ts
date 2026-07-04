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

// Produkční absolutní URL recenzí na ostrém webu. Slugy jsou nepravidelné
// (ibkr → interactive-brokers, fio → fio-ebroker), proto explicitní mapa
// místo šablony `${id}-recenze`. Canonical preview recenzí musí mířit sem,
// aby se indexační signály konsolidovaly na ostré URL (ne do /design-preview).
export const reviewCanonical: Record<string, string> = {
  degiro: 'https://www.etfpruvodce.cz/degiro-recenze',
  xtb: 'https://www.etfpruvodce.cz/xtb-recenze',
  trading212: 'https://www.etfpruvodce.cz/trading212-recenze',
  ibkr: 'https://www.etfpruvodce.cz/interactive-brokers-recenze',
  fio: 'https://www.etfpruvodce.cz/fio-ebroker-recenze',
  portu: 'https://www.etfpruvodce.cz/portu-recenze',
};
