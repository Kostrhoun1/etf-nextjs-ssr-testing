const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://nbhwnatadyubiuadfakx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo'
);

async function checkBondETFs() {
  // First check columns
  const { data: sample } = await supabase
    .from('etf_funds')
    .select('*')
    .limit(1);
  
  console.log('Available columns:', Object.keys(sample[0] || {}).join(', '));
  console.log('');

  const { data: bondETFs, error } = await supabase
    .from('etf_funds')
    .select('isin, name, index_name, fund_size_numeric')
    .or('name.ilike.%bond%,name.ilike.%treasury%,name.ilike.%government%,index_name.ilike.%bond%')
    .order('fund_size_numeric', { ascending: false, nullsFirst: false })
    .limit(80);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Bond ETFs in database: ' + bondETFs.length);
  console.log('');
  
  const byIndex = {};
  for (const etf of bondETFs) {
    const idx = etf.index_name || 'Unknown';
    if (!byIndex[idx]) byIndex[idx] = [];
    byIndex[idx].push(etf);
  }
  
  const sortedIndexes = Object.entries(byIndex).sort((a, b) => b[1].length - a[1].length);
  
  for (const [index, etfs] of sortedIndexes.slice(0, 20)) {
    console.log('INDEX: ' + index + ' (' + etfs.length + ' ETFs)');
    const largest = etfs[0];
    const size = largest.fund_size_numeric ? (largest.fund_size_numeric / 1000000).toFixed(0) + 'M EUR' : 'N/A';
    console.log('  Largest: ' + largest.name.substring(0, 60));
    console.log('  Size: ' + size + ', ISIN: ' + largest.isin);
    console.log('');
  }
}

checkBondETFs().catch(console.error);
