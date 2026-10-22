/* ===== PŘEDPOKLADY MONTE CARLO SIMULÁTORU (audit nástrojů 22. 10. 2026, V3) =====
   Dřív natvrdo bez zdroje a mimo historii (zlato 2,3 %, US velké akcie 8,6 %, dluhopisy 4,2 %, hotovost 0,4 %),
   přitom stránka /monte-carlo píše „historický roční výnos“. Teď VŠECHNO z historie amerických ETF v USD:
   Yahoo Finance adjusted close (dividendy reinvestované), poslední obchodní den v měsíci, nejdelší společné
   období 11/2007–9/2026 (mezinárodní dluhopisy BWX existují od 10/2007), data k 30. 9. 2026.
   - výnos = CAGR (geometrický průměr) – v simulaci medián růstu aktiva (měsíční log výnos ~ N(ln(1+výnos)/12, σ/√12)),
   - kolísání = směrodatná odchylka měsíčních log výnosů × √12,
   - korelace = Pearson měsíčních log výnosů (stejné období).
   Výpočet a denní kontrola: scripts/monte-carlo-predpoklady.mjs (exit 1, když konstanty neodpovídají datům).
   Nezávisle ověřeno 22. 10. 2026: Python z odděleně stažených dat (CAGR z koncové/počáteční ceny, numpy) – shoda
   na 0,01 p. b.; kotvy: index S&P 500 Total Return 10,90 % (SPY po poplatku 10,82 %), 3měsíční pokladniční
   poukázky USA (FRED TB3MS) 1,43 % (BIL po poplatku 1,32 %).
   Minulost nezaručuje budoucnost; období obsahuje krizi 2008, roky 2022 i silný růst amerických akcií po 2009 –
   proto US akcie 10,8 % a rozvíjející se trhy jen 3,1 %. Rozhodnutí: ZAMERNA-ROZHODNUTI.md („Audit nástrojů – kalkulačky“). */

export type McAktivum = 'us_large' | 'intl_dev' | 'emerging' | 'us_quality_bond' | 'intl_bond' | 'reits' | 'gold' | 'cash';

export const MC_PREDPOKLADY = {
  obdobi: '11/2007–9/2026',
  dataK: '30. 9. 2026',
  zdroj: 'Yahoo Finance (adjusted close, USD)',
  aktiva: {
    us_large: { label: 'US velké akcie', etf: 'SPY', annualReturn: 0.1082, volatility: 0.1570 },
    intl_dev: { label: 'Rozvinuté zahraniční akcie', etf: 'EFA', annualReturn: 0.0415, volatility: 0.1771 },
    emerging: { label: 'Akcie rozvíjejících se trhů', etf: 'EEM', annualReturn: 0.0313, volatility: 0.2115 },
    us_quality_bond: { label: 'US kvalitní dluhopisy', etf: 'AGG', annualReturn: 0.0271, volatility: 0.0466 },
    intl_bond: { label: 'Mezinárodní státní dluhopisy', etf: 'BWX', annualReturn: 0.0025, volatility: 0.0900 },
    reits: { label: 'REITs (nemovitosti)', etf: 'VNQ', annualReturn: 0.0541, volatility: 0.2285 },
    gold: { label: 'Zlato', etf: 'GLD', annualReturn: 0.0870, volatility: 0.1754 },
    cash: { label: 'Hotovost (pokladniční poukázky USA)', etf: 'BIL', annualReturn: 0.0132, volatility: 0.0054 },
  } as Record<McAktivum, { label: string; etf: string; annualReturn: number; volatility: number }>,
  /** Pořadí řádků a sloupců korelační matice. */
  poradi: ['us_large', 'intl_dev', 'emerging', 'us_quality_bond', 'intl_bond', 'reits', 'gold', 'cash'] as McAktivum[],
  /* KORELACE měsíčních log výnosů 11/2007–9/2026 (pořadí viz `poradi`); matice je kladně definitní (min. vlastní číslo 0,08). */
  korelace: [
    [1.00, 0.87, 0.77, 0.26, 0.45, 0.75, 0.09, -0.04],
    [0.87, 1.00, 0.87, 0.33, 0.62, 0.74, 0.20, -0.02],
    [0.77, 0.87, 1.00, 0.29, 0.59, 0.64, 0.31, -0.02],
    [0.26, 0.33, 0.29, 1.00, 0.72, 0.42, 0.37, 0.02],
    [0.45, 0.62, 0.59, 0.72, 1.00, 0.48, 0.49, 0.02],
    [0.75, 0.74, 0.64, 0.42, 0.48, 1.00, 0.14, -0.03],
    [0.09, 0.20, 0.31, 0.37, 0.49, 0.14, 1.00, 0.17],
    [-0.04, -0.02, -0.02, 0.02, 0.02, -0.03, 0.17, 1.00],
  ],
};
