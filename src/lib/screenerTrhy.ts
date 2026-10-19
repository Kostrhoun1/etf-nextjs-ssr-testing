/* Celé trhy ve srovnávači – sdílené serverem (etf-data.ts: obsah = výběr žebříčku přes filtrKategorie)
   i klientem (ScreenerUI: staré odkazy ?index=S%26P%20500 → trh). Bez závislostí, ať jde do prohlížeče. */
export interface TrhSrovnavace {
  id: string;
  label: string;
  popis: string;
  /** Žebříček, jehož výběr trh přebírá (categoryConfigs v etf-data.ts). */
  slug: string;
  /** Kanonický index (src/utils/indexNormalization.ts), který je s trhem totožný – v seznamu indexů se neopakuje. */
  index?: string;
}

export const TRHY_SROVNAVACE: TrhSrovnavace[] = [
  { id: 'svet', label: 'Celý svět', popis: 'FTSE All-World, MSCI ACWI, MSCI ACWI IMI, Global All Cap', slug: 'nejlepsi-celosvetove-etf' },
  { id: 'world', label: 'MSCI World', popis: 'vyspělé trhy', slug: 'nejlepsi-msci-world-etf', index: 'MSCI World' },
  { id: 'sp500', label: 'S&P 500', popis: 'USA', slug: 'nejlepsi-sp500-etf', index: 'S&P 500' },
  { id: 'nasdaq', label: 'Nasdaq-100', popis: 'USA, technologie', slug: 'nejlepsi-nasdaq-etf', index: 'Nasdaq 100' },
];

/** Index → id trhu (S&P 500 → sp500…). */
export const INDEXY_TRHU: Record<string, string> = Object.fromEntries(
  TRHY_SROVNAVACE.filter((t) => t.index).map((t) => [t.index!, t.id]),
);
