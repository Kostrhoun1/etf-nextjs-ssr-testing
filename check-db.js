const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nbhwnatadyubiuadfakx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo'
);

async function checkData() {
  try {
    const { data, error } = await supabase
      .from('etf_funds')
      .select('isin, name, return_1y, return_1y_czk, return_1y_usd, return_5y, return_5y_czk, return_5y_usd, currency_performance_updated_at')
      .eq('isin', 'IE00B4L5Y983')
      .single();
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Database data for IE00B4L5Y983:');
    console.log('ISIN:', data.isin);
    console.log('Name:', data.name);
    console.log('1y EUR:', data.return_1y);
    console.log('1y CZK:', data.return_1y_czk);
    console.log('1y USD:', data.return_1y_usd);
    console.log('5y EUR:', data.return_5y);
    console.log('5y CZK:', data.return_5y_czk);
    console.log('5y USD:', data.return_5y_usd);
    console.log('Currency updated:', data.currency_performance_updated_at);
  } catch (err) {
    console.error('Script error:', err);
  }
}

checkData();