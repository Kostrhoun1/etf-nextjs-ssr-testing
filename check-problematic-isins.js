const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nbhwnatadyubiuadfakx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo'
);

(async () => {
  console.log('Getting TOP 200 ETFs by fund size for ticker sitemap...\n');

  const { data: top200, error } = await supabase
    .from('etf_funds')
    .select('isin, primary_ticker, name, fund_size_numeric')
    .order('fund_size_numeric', { ascending: false })
    .limit(210);

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Filter valid tickers (as per sitemap logic)
  const validTickers = top200.filter(etf => {
    const ticker = etf.primary_ticker;
    return ticker && ticker.trim() !== '' && ticker.trim() !== '-' && ticker.length >= 2;
  }).slice(0, 200);

  console.log(`Total ETFs queried: ${top200.length}`);
  console.log(`Valid tickers in TOP 200: ${validTickers.length}`);
  if (validTickers.length > 0) {
    console.log(`TOP 1: ${validTickers[0].fund_size_numeric}M EUR - ${validTickers[0].primary_ticker} - ${validTickers[0].isin}`);
  }
  if (validTickers.length >= 200) {
    console.log(`TOP 200: ${validTickers[199].fund_size_numeric}M EUR - ${validTickers[199].primary_ticker} - ${validTickers[199].isin}`);
  } else if (validTickers.length > 0) {
    const last = validTickers[validTickers.length - 1];
    console.log(`TOP ${validTickers.length}: ${last.fund_size_numeric}M EUR - ${last.primary_ticker} - ${last.isin}`);
  }

  // Check sample problematic ISINs
  const sampleISINs = ['LU2059756754', 'IE00BKWD3966', 'IE000V6BYU61', 'IE000XIMFW40', 'LU1865138329'];

  console.log('\n--- Checking if problematic ISINs are in TOP 200 ticker sitemap ---');
  const top200ISINs = validTickers.map(e => e.isin);

  for (const isin of sampleISINs) {
    const etf = top200.find(e => e.isin === isin);
    const isInTop200 = top200ISINs.includes(isin);

    if (etf) {
      console.log(`\n${isin}:`);
      console.log(`  Name: ${etf.name}`);
      console.log(`  Ticker: ${etf.primary_ticker || '(none)'}`);
      console.log(`  Size: ${etf.fund_size_numeric}M EUR`);
      console.log(`  In TOP 200 ticker sitemap: ${isInTop200 ? '✅ YES' : '❌ NO'}`);

      if (etf.primary_ticker && etf.primary_ticker !== '-' && etf.primary_ticker.length >= 2) {
        console.log(`  Has ticker page: YES -> /etf/ticker/${etf.primary_ticker}`);
        console.log(`  Also has ISIN page: YES -> /etf/${isin}`);
        console.log(`  ⚠️  POTENTIAL DUPLICATE: Both URLs exist for same ETF!`);
      } else {
        console.log(`  Has ticker page: NO`);
        console.log(`  Only ISIN page exists: /etf/${isin}`);
      }
    } else {
      console.log(`\n${isin}: ❌ Not in TOP 210 ETFs by size`);
    }
  }

  console.log('\n\n=== CONCLUSION ===');
  console.log('If problematic ISINs are NOT in TOP 200:');
  console.log('  → They have ISIN pages (/etf/ISIN) but NO ticker pages in sitemap');
  console.log('  → Google should NOT see them as duplicates');
  console.log('  → The "alternative page" issue must have a different cause!');
})();
