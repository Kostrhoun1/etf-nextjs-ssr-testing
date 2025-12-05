const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nbhwnatadyubiuadfakx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo'
);

async function debug() {
  // Check fund_size fields
  const { data: sizeCheck } = await supabase
    .from('etf_funds')
    .select('isin, name, fund_size, fund_size_numeric, fund_size_currency')
    .limit(20);

  console.log('=== FUND SIZE CHECK ===');
  sizeCheck.forEach(e => {
    console.log(e.name.substring(0,40) + ' | size: ' + e.fund_size + ' | numeric: ' + e.fund_size_numeric + ' | currency: ' + e.fund_size_currency);
  });

  // Check parsed_region
  const { data: regionCheck } = await supabase
    .from('etf_funds')
    .select('isin, name, parsed_region, parsed_asset_class, country_1_name, investment_focus')
    .limit(20);

  console.log('\n=== PARSED REGION CHECK ===');
  regionCheck.forEach(e => {
    console.log(e.name.substring(0,35) + ' | region: ' + e.parsed_region + ' | asset: ' + e.parsed_asset_class + ' | country1: ' + e.country_1_name);
  });

  // Check inception dates
  const { data: inceptionCheck } = await supabase
    .from('etf_funds')
    .select('isin, name, inception_date')
    .not('inception_date', 'is', null)
    .order('inception_date', { ascending: false })
    .limit(30);

  console.log('\n=== NEWEST ETF BY INCEPTION ===');
  inceptionCheck.forEach(e => {
    console.log(e.inception_date + ' | ' + e.name.substring(0,50));
  });

  // Check what columns actually have data for region/geography
  const { data: geoCheck } = await supabase
    .from('etf_funds')
    .select('name, investment_focus, index_name, country_1_name, country_2_name')
    .limit(30);

  console.log('\n=== GEOGRAPHY DATA CHECK ===');
  geoCheck.forEach(e => {
    console.log(e.name.substring(0,30) + ' | focus: ' + (e.investment_focus || '').substring(0,20) + ' | index: ' + (e.index_name || '').substring(0,25) + ' | c1: ' + e.country_1_name);
  });

  // Count ETFs with fund_size_numeric > 0
  const { data: sizeStats, count } = await supabase
    .from('etf_funds')
    .select('isin', { count: 'exact' })
    .gt('fund_size_numeric', 0);

  console.log('\n=== SIZE STATS ===');
  console.log('ETF with fund_size_numeric > 0: ' + count);

  // Check raw fund_size values
  const { data: rawSize } = await supabase
    .from('etf_funds')
    .select('fund_size')
    .not('fund_size', 'is', null)
    .limit(30);

  console.log('\n=== RAW FUND_SIZE VALUES ===');
  rawSize.forEach(e => console.log(e.fund_size));

  // Top ETF by actual size string (try to find pattern)
  const { data: bigETFs } = await supabase
    .from('etf_funds')
    .select('name, fund_size, fund_size_numeric, isin')
    .ilike('name', '%S&P 500%')
    .limit(10);

  console.log('\n=== S&P 500 ETFs SIZE CHECK ===');
  bigETFs.forEach(e => {
    console.log(e.name.substring(0,45) + ' | ' + e.fund_size + ' | numeric: ' + e.fund_size_numeric);
  });
}

debug();
