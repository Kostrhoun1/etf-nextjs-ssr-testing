const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://nbhwnatadyubiuadfakx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo'
);

async function analyzeMainIndexes() {
  const mainIndexes = [
    'MSCI World',
    'S&P 500',
    'MSCI Europe',
    'STOXX Europe 600',
    'MSCI Emerging Markets',
    'EURO STOXX 50',
    'Nasdaq-100',
    'FTSE 100',
    'MSCI USA',
    'MSCI Japan',
  ];

  const { data: etfs } = await supabase
    .from('etf_funds')
    .select('isin, name, index_name, ter_numeric, fund_size_numeric')
    .in('index_name', mainIndexes);

  console.log('=== HLAVNÍ INDEXY ===\n');

  const byIndex = {};
  etfs.forEach(e => {
    if (!byIndex[e.index_name]) {
      byIndex[e.index_name] = { count: 0, totalAUM: 0, avgTER: [] };
    }
    byIndex[e.index_name].count++;
    byIndex[e.index_name].totalAUM += e.fund_size_numeric || 0;
    if (e.ter_numeric) byIndex[e.index_name].avgTER.push(e.ter_numeric);
  });

  console.log('Index                     ETFs   AUM(mld)  AvgTER');
  console.log('-'.repeat(55));

  let totalETFs = 0;
  let totalAUM = 0;

  Object.entries(byIndex)
    .sort((a, b) => b[1].totalAUM - a[1].totalAUM)
    .forEach(([idx, data]) => {
      const avgTER = data.avgTER.length > 0
        ? (data.avgTER.reduce((a,b) => a+b, 0) / data.avgTER.length).toFixed(2) + '%'
        : 'N/A';
      console.log(
        idx.padEnd(25),
        String(data.count).padStart(4),
        (data.totalAUM / 1000).toFixed(1).padStart(9),
        avgTER.padStart(8)
      );
      totalETFs += data.count;
      totalAUM += data.totalAUM;
    });

  console.log('-'.repeat(55));
  console.log('CELKEM'.padEnd(25), String(totalETFs).padStart(4), (totalAUM / 1000).toFixed(1).padStart(9));
  console.log('\nPokrytí:', totalETFs, 'ETF z 3618 (' + Math.round(totalETFs/3618*100) + '%)');
}
analyzeMainIndexes();
