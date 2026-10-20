import { categoryConfigs, getTotalETFCount } from '@/lib/etf-data';
import { HLAVNI_DVOJICE, POPISKY_DVOJIC } from '@/lib/pairs';

/**
 * /llms.txt – přehled webu pro AI vyhledávače (GEO). Dřív statický public/llms.txt s „5,100+“ fondy (jiné číslo
 * než homepage „4 900+“ a /o-nas „4 981“) a bez žebříčků/dvojic (SEO audit 20. 10. 2026). Teď generovaný:
 * počet fondů = getTotalETFCount (stejná definice jako zbytek webu, zaokrouhleno dolů na stovky), žebříčky
 * z categoryConfigs, srovnání z HLAVNI_DVOJICE. Obnova 1× denně (1 ISR zápis/den).
 */
export const revalidate = 86400;

const B = 'https://etfpruvodce.cz';

export async function GET() {
  const n = await getTotalETFCount();
  // Raději bez čísla než se špatným (pravidlo č. 1): při chybě DB věta bez počtu.
  const pocet = n > 0 ? `${(Math.floor(n / 100) * 100).toLocaleString('en-US')}+ ` : '';
  const zebricky = Object.values(categoryConfigs).map((c) => `- ${c.title}: ${B}/nejlepsi-etf/${c.slug}`).join('\n');
  const dvojice = HLAVNI_DVOJICE.map((s) => `- ${s.toUpperCase().replace('-VS-', ' vs ')}${POPISKY_DVOJIC[s] ? ` (${POPISKY_DVOJIC[s]})` : ''}: ${B}/srovnani/${s}`).join('\n');
  const text = `# ETF průvodce.cz

> Czech ETF comparison website for Czech investors. Its focus: how much an investor actually earns in Czech crowns (CZK) – fund returns are converted to CZK with Czech National Bank (CNB) exchange rates. It compares ${pocet}UCITS ETFs and ETCs (funds with data refreshed in the last 30 days, excluding leveraged and inverse products). Fund data are refreshed every business day (Monday–Friday morning); every figure shows the date it refers to ("Data k …" = last trading day). The site is a comparison tool – it does not give investment recommendations.

## Main sections

- Homepage: ${B}/
- ETF screener (filter and compare all funds, returns in CZK): ${B}/srovnani
- ETF rankings by category, index and theme: ${B}/zebricky
- Portfolio backtest on historical data in CZK: ${B}/backtest
- Data-driven answers for investors (returns in CZK, currency risk, lump sum vs. DCA, accumulating vs. distributing): ${B}/co-rikaji-data
- Model portfolios: ${B}/portfolio-strategie
- Calculators: ${B}/kalkulacky
- Where to buy ETFs in the Czech Republic (broker fees for a given amount): ${B}/kde-koupit
- Broker comparison table: ${B}/srovnani-brokeru
- ETF basics guide: ${B}/pruvodce
- How to start investing: ${B}/jak-zacit
- Taxes on ETFs in the Czech Republic (time test, value test, dividends): ${B}/dane-z-etf
- Methodology – data sources, CZK conversion, update frequency, error policy: ${B}/metodika

## Data studies (computed from the same data as the backtest, in CZK)

- How much ETFs and world stocks earned in CZK: ${B}/kolik-vydelaly-etf
- Time machine – what regular investing since 2000/2010/2020 would be worth today in CZK: ${B}/stroj-casu
- S&P 500 vs. the whole world, returns in CZK since 2008 and 2000–2009: ${B}/sp500-nebo-cely-svet
- How long an investment can stay below the amount invested, in CZK and after Czech inflation: ${B}/jak-dlouho-v-minusu
- The 4 % withdrawal rule on Czech data (CZK, Czech inflation): ${B}/pravidlo-4-procent
- Factor ETFs (value, small cap, quality, momentum, minimum volatility, dividends) in CZK: ${B}/faktorove-etf
- World ETF indexes (MSCI World, FTSE All-World, ACWI, S&P 500): ${B}/svetove-etf-indexy
- Which S&P 500 ETF (CSPX/SXR8, VUAA, VUSA, SPYL): ${B}/jaky-sp500-etf

## ETF rankings

Funds in each ranking are compared by objective data (size, fee, return in CZK); stale funds (no data refresh for 14+ days) and leveraged products are excluded.

${zebricky}

## ETF comparisons (two funds side by side)

Pattern: ${B}/srovnani/{ticker1}-vs-{ticker2} – one canonical URL per pair of funds (other orders and ticker aliases redirect).

${dvojice}

## ETF detail pages

Pattern: ${B}/etf/{ISIN} (ISIN in upper case)

- ${B}/etf/IE00B4L5Y983 (iShares Core MSCI World)
- ${B}/etf/IE00B5BMR087 (iShares Core S&P 500)
- ${B}/etf/IE00BK5BQT80 (Vanguard FTSE All-World)

## Data and method

- Fund data (TER, size, returns in EUR, holdings, listings): public fund profiles on justETF, collected by our own scraper every business day.
- Returns in CZK = (1 + return in EUR) × (EUR/CZK at end / EUR/CZK at start) − 1, CNB exchange rates; returns in USD with ECB EUR/USD rates. Short periods (1/3/6 months) only in EUR.
- Returns are after fund fees (TER), before taxes and broker fees. Missing or unverified values are shown as "—", never replaced by another number.
- Backtests use index histories (daily adjusted close of index-tracking funds), converted to CZK day by day with ECB rates; inflation from the Czech Statistical Office (CPI).
- Data are checked daily by automated rules; every error found gets a fix and a new automated check. Full methodology: ${B}/metodika

## About

- About the site and the author (Tomáš Kostrhoun): ${B}/o-nas
- Contact: info@etfpruvodce.cz
- Language: Czech (cs-CZ)
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
