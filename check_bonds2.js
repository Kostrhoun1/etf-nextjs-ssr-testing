const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://nbhwnatadyubiuadfakx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo'
);

async function checkBondETFs() {
  const { data: bondETFs, error } = await supabase
    .from('etf_funds')
    .select('isin, name, index_name, fund_size_numeric, parsed_asset_class')
    .or('name.ilike.%bond%,name.ilike.%treasury%,name.ilike.%government%,index_name.ilike.%bond%,parsed_asset_class.ilike.%bond%')
    .order('fund_size_numeric', { ascending: false, nullsFirst: false })
    .limit(100);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Bond ETFs in database (top by size):\n');
  
  for (const etf of bondETFs.slice(0, 30)) {
    const size = etf.fund_size_numeric ? (etf.fund_size_numeric / 1000000000).toFixed(1) + 'B' : 'N/A';
    console.log(etf.isin + ' | ' + size.padStart(6) + ' | ' + (etf.parsed_asset_class || 'N/A').substring(0, 15).padEnd(15) + ' | ' + etf.name.substring(0, 55));
  }
}

checkBondETFs().catch(console.error);
