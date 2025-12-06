-- =====================================================
-- BACKTEST TABLES - Run in Supabase SQL Editor
-- =====================================================

-- 1. Historická data indexů (měsíční)
CREATE TABLE IF NOT EXISTS index_historical_data (
  id SERIAL PRIMARY KEY,
  index_code VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  close_price DECIMAL(15,6) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(index_code, date)
);

-- Index pro rychlé vyhledávání
CREATE INDEX IF NOT EXISTS idx_index_historical_date
ON index_historical_data(index_code, date);

-- 2. Mapování index_name z ETF tabulky -> náš index_code
CREATE TABLE IF NOT EXISTS index_mapping (
  id SERIAL PRIMARY KEY,
  index_name VARCHAR(255) NOT NULL,      -- z etf_funds.index_name
  index_code VARCHAR(50) NOT NULL,       -- náš interní kód (msci_world, sp500, etc.)
  yahoo_ticker VARCHAR(50),              -- ticker pro Yahoo Finance
  is_total_return BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(index_name)
);

-- 3. Vložit mapování pro TOP 5 indexů
INSERT INTO index_mapping (index_name, index_code, yahoo_ticker, is_total_return) VALUES
  -- MSCI World varianty
  ('MSCI World', 'msci_world', '^990100-USD-STRD', false),

  -- S&P 500 varianty
  ('S&P 500', 'sp500', '^SP500TR', true),

  -- MSCI Europe varianty
  ('MSCI Europe', 'msci_europe', 'IEUR', false),

  -- STOXX Europe 600 varianty
  ('STOXX Europe 600', 'stoxx600', '^STOXX', false),
  ('Stoxx Europe 600', 'stoxx600', '^STOXX', false),

  -- MSCI Emerging Markets varianty
  ('MSCI Emerging Markets', 'msci_em', 'EEM', false)
ON CONFLICT (index_name) DO NOTHING;

-- 4. Ověření
SELECT 'Tables created successfully!' as status;
SELECT * FROM index_mapping;
