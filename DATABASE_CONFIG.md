# Database Configuration

## Supabase Connection Details

**URL:** https://nbhwnatadyubiuadfakx.supabase.co
**Service Role Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo

## Database Stats
- **Total ETF Funds:** 3,618
- **Table:** etf_funds
- **Ticker Fields:** primary_ticker, exchange_1_ticker, exchange_2_ticker, exchange_3_ticker, exchange_4_ticker, exchange_5_ticker

## ETF Mappings Found in Database

### ✅ Successfully Found ETF Mappings
```typescript
{
  'VWCE': 'IE00BK5BQT80', // Vanguard FTSE All-World UCITS ETF (USD) Accumulating
  'SGLN': 'IE00B4ND3602', // iShares Physical Gold ETC
  'EIMI': 'IE00BKM4GZ66', // iShares Core MSCI Emerging Markets IMI UCITS ETF (Acc)
  'IPRP': 'IE00B0M63284', // iShares European Property Yield UCITS ETF
  'IUSN': 'IE00BF4RFH31', // iShares MSCI World Small Cap UCITS ETF
}
```

### ❌ ETF Tickers NOT Found in Database
These tickers are NOT in our database and must use ticker fallback endpoint:
- IGLT 
- IEGA
- CMDY
- ITIP
- IEAG
- AGGH
- EXXY
- IWDA (found via existing pages)

## Usage Example

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nbhwnatadyubiuadfakx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo'
);

// Search for ticker across all exchange fields
const { data, error } = await supabase
  .from('etf_funds')
  .select('isin, name, primary_ticker, exchange_1_ticker, exchange_2_ticker, exchange_3_ticker, exchange_4_ticker, exchange_5_ticker')
  .or(`primary_ticker.eq.${ticker},exchange_1_ticker.eq.${ticker},exchange_2_ticker.eq.${ticker},exchange_3_ticker.eq.${ticker},exchange_4_ticker.eq.${ticker},exchange_5_ticker.eq.${ticker}`)
  .limit(1);
```

## Environment Variables
Located in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://nbhwnatadyubiuadfakx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NDQ3NDQsImV4cCI6MjA2NDQyMDc0NH0.yQgSv0JMi6ebwIu7fQHIXE4VblkQ3pJfy-lXvFgd_CY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo
```