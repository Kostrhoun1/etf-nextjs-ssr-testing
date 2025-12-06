# ETF Backtest Tool - Implementační plán

## Cíl
Vytvořit backtest nástroj identický s Curvo pro TOP 5 indexů jako pilot.

---

## Curvo Output Specifikace (REFERENCE)

### Hlavní navigace/sekce:
1. **Evolution** - hlavní graf vývoje portfolia
2. **Summary** - klíčové metriky
3. **Returns** - roční a měsíční výnosy
4. **Impact of inflation** - reálné vs nominální výnosy
5. **Drawdown** - analýza propadů
6. **Maximum loss in a year** - Value at Risk
7. **Minimum investment horizon** - pravděpodobnost kladného výnosu
8. **Efficient frontier** - risk/return spektrum
9. **Forecasts** - Monte Carlo simulace
10. **Rebalancing strategies** - porovnání strategií
11. **Correlation** - korelační matice

### Detailní specifikace každé sekce:

#### 1. Evolution (Hlavní graf)
- **Typ**: Čárový graf (Linear/Log toggle)
- **X-osa**: Čas (roky)
- **Y-osa**: Hodnota portfolia (€)
- **Export**: CSV, SVG, PNG, Embed
- **Interaktivita**: Hover pro hodnoty
- **Graf**: `<LineChart>` s area fill

#### 2. Summary (Klíčové metriky)
```
Amount invested:              €10,000
Net asset value:              €17,087
Compound annual growth rate:  7.00%
Standard deviation:           17.43%
Sharpe ratio:                 0.43
```

**Vzorce:**
- **CAGR**: `(final_value / invested)^(1/years) - 1`
- **Std Dev**: `monthly_std * sqrt(12)` (anualizovaná)
- **Sharpe**: `(return - risk_free) / std_dev` (Euribor 3M jako risk-free)

#### 3. Returns

**3a. Annual Returns**
- **Graf 1**: Bar chart s roky na X-ose, return na Y-ose
- **Graf 2**: Histogram frekvencí ročních výnosů (buckets: -30% až +30%)
- Best/Worst 3 years highlighted
- Statistika: "positive return during X of Y years (Z%)"

**3b. Monthly Returns**
- **Graf**: Histogram měsíčních výnosů (buckets: -25% až +25%)
- Best/Worst 3 months highlighted
- Statistika: "positive return during X of Y months (Z%)"

#### 4. Impact of Inflation
- **Graf 1**: Line chart - Nominal vs Real hodnota portfolia (dvě čáry)
- **Graf 2**: Line chart - historický CPI index
- **Real CAGR** = Nominal CAGR - Inflation rate
- Použít CPI (Consumer Price Index) pro ČR

#### 5. Drawdown
- **Graf**: Area chart drawdownů v čase (červená oblast pod 0%)
- **Longest drawdown**: délka + hloubka + období
- **Deepest drawdown**: délka + hloubka + období
- Vzorec: `(current - peak) / peak`

#### 6. Maximum Loss in Year (VaR)
- **Graf**: Horizontal bar/gauge vizualizace VaR
- **Value at Risk (95%)**: maximální očekávaná roční ztráta
- Variance-covariance metoda
- Vzorec: `VaR = avg_monthly * 12 - 1.65 * monthly_std * sqrt(12)`

#### 7. Minimum Investment Horizon
- **Graf**: Line chart - X = délka investice (1-10 let), Y = % období s kladným výnosem
- Rolling window analýza pro různé délky držení

#### 8. Efficient Frontier
- **Graf**: Scatter plot - X = Risk (std dev), Y = Return
- Generovat 150 náhodných portfolií se stejnými aktivy
- Zvýraznit pozici aktuálního portfolia
- Ukázat efficient frontier křivku

#### 9. Forecasts (Monte Carlo)
- **Graf**: Fan chart s 5 liniemi (percentily)
- 600 simulací
- Percentily: 2.3% (Very bad), 15.9% (Bad), 50% (Average), 84.1% (Good), 97.7% (Great)
- Generovat z normálního rozdělení N(μ, σ)

#### 10. Rebalancing Strategies
- Tabulka porovnání strategií:
  - None, Monthly, Quarterly, Half-yearly, Yearly, Every 2/3 years
  - Tolerance-based: 5%, 10%, 15%, 20%
- Sloupce: Strategy, CAGR, Difference from max

#### 11. Correlation
- Korelační matice mezi aktivy v portfoliu

---

## Fáze 1: Data Infrastructure

### 1.1 Historická data indexů
```
| Index              | Yahoo Ticker      | ETF Count | AUM    |
|--------------------|-------------------|-----------|--------|
| MSCI World         | ^990100-USD-STRD  | 179       | 343B€  |
| S&P 500 TR         | ^SP500TR          | 131       | 417B€  |
| MSCI Europe        | IEUR (proxy)      | 120       | 90B€   |
| STOXX Europe 600   | ^STOXX            | 56        | 29B€   |
| MSCI EM            | EEM (proxy)       | 46        | 66B€   |
```

### 1.2 Databázové schéma
```sql
-- Historická data indexů
CREATE TABLE index_historical_data (
  id SERIAL PRIMARY KEY,
  index_code VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  close_price DECIMAL(15,6) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(index_code, date)
);

-- Index na rychlé vyhledávání
CREATE INDEX idx_index_date ON index_historical_data(index_code, date);

-- Mapování index_name -> index_code
CREATE TABLE index_mapping (
  id SERIAL PRIMARY KEY,
  index_name VARCHAR(255) NOT NULL,  -- z etf_funds.index_name
  index_code VARCHAR(50) NOT NULL,   -- náš interní kód
  yahoo_ticker VARCHAR(50),
  is_total_return BOOLEAN DEFAULT false,
  UNIQUE(index_name)
);
```

### 1.3 Data Fetcher Script
```python
# scripts/fetch_index_data.py
import yfinance as yf
from supabase import create_client

INDEXES = {
    'msci_world': '^990100-USD-STRD',
    'sp500_tr': '^SP500TR',
    'stoxx600': '^STOXX',
    'msci_em': 'EEM',
    'msci_europe': 'IEUR',
}

def fetch_and_store():
    for code, ticker in INDEXES.items():
        data = yf.Ticker(ticker).history(period='max')
        # Store to Supabase...
```

---

## Fáze 2: Backtest Engine

### 2.1 Základní typy
```typescript
// types/backtest.ts

interface BacktestInput {
  portfolio: PortfolioItem[];
  startDate: Date;
  endDate: Date;
  initialAmount: number;
  rebalancingStrategy?: RebalancingStrategy;
  contributions?: ContributionPlan;
}

interface PortfolioItem {
  isin: string;
  weight: number;  // 0-1
  ter: number;     // z databáze
  indexCode: string;
}

interface BacktestResult {
  // Time series
  evolution: TimeSeriesPoint[];
  drawdowns: DrawdownPeriod[];

  // Summary metrics
  summary: {
    amountInvested: number;
    netAssetValue: number;
    cagr: number;
    standardDeviation: number;
    sharpeRatio: number;
  };

  // Returns
  annualReturns: AnnualReturn[];
  monthlyReturns: MonthlyReturn[];
  bestYears: AnnualReturn[];
  worstYears: AnnualReturn[];
  bestMonths: MonthlyReturn[];
  worstMonths: MonthlyReturn[];

  // Risk metrics
  maxDrawdown: DrawdownPeriod;
  longestDrawdown: DrawdownPeriod;
  valueAtRisk95: number;

  // Horizons
  investmentHorizons: HorizonAnalysis[];
}
```

### 2.2 Kalkulační funkce
```typescript
// lib/backtest/calculations.ts

// CAGR
function calculateCAGR(initialValue: number, finalValue: number, years: number): number {
  return Math.pow(finalValue / initialValue, 1 / years) - 1;
}

// Annualized Standard Deviation
function calculateStdDev(monthlyReturns: number[]): number {
  const mean = monthlyReturns.reduce((a, b) => a + b, 0) / monthlyReturns.length;
  const squaredDiffs = monthlyReturns.map(r => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / monthlyReturns.length;
  return Math.sqrt(variance) * Math.sqrt(12); // Annualize
}

// Sharpe Ratio (Euribor 3M jako risk-free)
function calculateSharpeRatio(returns: number[], riskFreeRate: number, stdDev: number): number {
  const excessReturn = returns.reduce((a, b) => a + b, 0) / returns.length * 12 - riskFreeRate;
  return excessReturn / stdDev;
}

// Max Drawdown
function calculateDrawdowns(values: number[]): DrawdownPeriod[] {
  let peak = values[0];
  let drawdowns: DrawdownPeriod[] = [];
  // ... implementation
}

// Value at Risk (95%)
function calculateVaR95(monthlyReturns: number[]): number {
  const mean = avg(monthlyReturns);
  const std = stdDev(monthlyReturns);
  return mean * 12 - 1.65 * std * Math.sqrt(12);
}

// Monte Carlo
function monteCarlo(mean: number, std: number, months: number, simulations: number = 600) {
  // Generate 600 paths using N(mean, std)
}
```

### 2.3 ETF Simulace
```typescript
// Simulace hodnoty ETF na základě indexu
function simulateETFValue(
  indexPrices: TimeSeriesPoint[],
  ter: number,
  startDate: Date,
  endDate: Date
): TimeSeriesPoint[] {
  const dailyTER = ter / 365;

  return indexPrices
    .filter(p => p.date >= startDate && p.date <= endDate)
    .map((point, i) => ({
      date: point.date,
      value: point.value * Math.pow(1 - dailyTER, i)
    }));
}
```

---

## Fáze 3: API Endpoints

### 3.1 Endpoints
```typescript
// app/api/backtest/simulate/route.ts
POST /api/backtest/simulate
Body: {
  portfolio: [{ isin: string, weight: number }],
  startDate: string,
  endDate: string,
  initialAmount: number,
  rebalancing?: 'none' | 'monthly' | 'quarterly' | 'yearly'
}
Response: BacktestResult

// app/api/backtest/indexes/route.ts
GET /api/backtest/indexes
Response: { indexes: IndexInfo[] }

// app/api/backtest/compare/route.ts
POST /api/backtest/compare
Body: { portfolios: BacktestInput[] }
Response: { results: BacktestResult[] }
```

---

## Fáze 4: Frontend Components

### 4.1 Stránky
```
/backtest                    - hlavní stránka
/backtest/portfolio/[id]     - uložené portfolio
/backtest/compare            - porovnání portfolií
```

### 4.2 Komponenty
```
components/backtest/
├── PortfolioBuilder.tsx      - výběr ETF, váhy
├── BacktestSettings.tsx      - období, částka, strategie
├── EvolutionChart.tsx        - hlavní graf
├── SummaryPanel.tsx          - metriky box
├── AnnualReturnsChart.tsx    - bar chart + histogram
├── MonthlyReturnsHistogram.tsx
├── InflationChart.tsx        - nominal vs real
├── DrawdownChart.tsx
├── VaRGauge.tsx              - vizualizace VaR
├── HorizonChart.tsx          - min investment horizon
├── EfficientFrontier.tsx     - scatter plot
├── MonteCarloChart.tsx       - forecast paths
├── RebalancingTable.tsx      - porovnání strategií
├── CorrelationMatrix.tsx
└── ExportButtons.tsx         - CSV, SVG, PNG
```

### 4.3 Chart Library
- **Recharts** pro většinu grafů (React-native, responsive)
- Custom SVG pro specifické vizualizace

---

## Fáze 5: Implementační kroky

### Sprint 1: Data (3-5 dní)
- [ ] Vytvořit Supabase tabulky
- [ ] Python script pro stažení historických dat
- [ ] Naplnit data pro 5 indexů
- [ ] Vytvořit mapování index_name → index_code
- [ ] Test: ověřit data v databázi

### Sprint 2: Backend Engine (5-7 dní)
- [ ] Implementovat základní kalkulace (CAGR, StdDev, Sharpe)
- [ ] Implementovat drawdown analýzu
- [ ] Implementovat VaR kalkulaci
- [ ] Implementovat horizon analýzu
- [ ] Implementovat Monte Carlo
- [ ] Vytvořit API endpoint /api/backtest/simulate
- [ ] Test: unit testy pro kalkulace

### Sprint 3: Frontend MVP (5-7 dní)
- [ ] Stránka /backtest s PortfolioBuilder
- [ ] EvolutionChart komponenta
- [ ] SummaryPanel komponenta
- [ ] AnnualReturnsChart + histogram
- [ ] DrawdownChart komponenta
- [ ] Integrace s API
- [ ] Test: E2E test celého flow

### Sprint 4: Advanced Features (5-7 dní)
- [ ] MonthlyReturnsHistogram
- [ ] InflationChart (CPI data pro ČR)
- [ ] VaRGauge
- [ ] HorizonChart
- [ ] MonteCarloChart
- [ ] RebalancingTable
- [ ] Compare mode

### Sprint 5: Polish (3-5 dní)
- [ ] EfficientFrontier
- [ ] CorrelationMatrix
- [ ] Export funkce (CSV, SVG, PNG)
- [ ] Responsive design
- [ ] Loading states, error handling
- [ ] SEO meta tags
- [ ] Dokumentace

---

## Technické poznámky

### Přesnost simulace
- Používáme Total Return indexy kde dostupné
- ETF výnos ≈ Index_TR × (1 - TER)^roky
- Tracking difference ignorujeme (~0.1-0.3% ročně)

### Risk-free rate
- Curvo používá Euribor 3M
- Alternativa: ČNB repo sazba pro české uživatele

### Inflace
- Curvo: Belgian CPI
- My: Czech CPI (ČSÚ data)

### Datové limity
- Yahoo Finance: ~1000 req/den (stačí)
- Supabase free: 500 MB (potřebujeme ~0.5 MB)

### Granularita dat
- **MĚSÍČNÍ DATA** (ne denní) - dostatečné pro backtest
- 5 indexů × 50 let × 12 měsíců = ~3,000 řádků
- Curvo také pracuje s měsíčními daty

---

## Rizika a mitigace

| Riziko | Pravděpodobnost | Dopad | Mitigace |
|--------|----------------|-------|----------|
| Yahoo API změna | Střední | Vysoký | Backup: EODHD ($20/měs) |
| Nepřesná simulace | Nízká | Střední | Disclaimer + validace vs reálná data |
| Pomalý výpočet | Střední | Střední | Web Workers pro Monte Carlo |
| Supabase limity | Nízká | Nízký | Upgrade na Pro pokud potřeba |

---

## Success Metrics

- [ ] Backtest pro 5 indexů funguje
- [ ] Výsledky odpovídají Curvo (±1% tolerance)
- [ ] Načtení < 3 sekundy
- [ ] Mobile responsive
- [ ] 532 ETF pokryto (TOP 5 indexů)

---

*Vytvořeno: 5. prosince 2025*
*Poslední update: 5. prosince 2025*
