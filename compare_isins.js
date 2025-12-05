const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://nbhwnatadyubiuadfakx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo'
);

async function compare() {
  // Load justETF ISINs from sitemap
  const justETFISINs = fs.readFileSync('justetf_sitemap_isins.txt', 'utf-8')
    .split('\n')
    .filter(line => line.trim().length === 12);

  console.log('justETF ISINs from sitemap:', justETFISINs.length);

  // Get our database ISINs
  let ourISINs = [];
  let offset = 0;
  const batchSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('etf_funds')
      .select('isin')
      .range(offset, offset + batchSize - 1);

    if (error) {
      console.error('Error:', error);
      break;
    }

    ourISINs = ourISINs.concat(data.map(e => e.isin));
    if (data.length < batchSize) break;
    offset += batchSize;
  }

  console.log('Our database ISINs:', ourISINs.length);

  // Compare
  const justETFSet = new Set(justETFISINs);
  const ourSet = new Set(ourISINs);

  const inBothCount = ourISINs.filter(isin => justETFSet.has(isin)).length;
  const onlyInOurs = ourISINs.filter(isin => !justETFSet.has(isin));
  const onlyInJustETF = justETFISINs.filter(isin => !ourSet.has(isin));

  console.log('\n========================================');
  console.log('COMPARISON RESULTS');
  console.log('========================================');
  console.log('justETF total:        ' + justETFISINs.length);
  console.log('Our database total:   ' + ourISINs.length);
  console.log('----------------------------------------');
  console.log('In BOTH:              ' + inBothCount);
  console.log('Only in OUR DB:       ' + onlyInOurs.length);
  console.log('Only in justETF:      ' + onlyInJustETF.length + ' (MISSING!)');
  console.log('========================================');

  // Save missing ISINs
  if (onlyInJustETF.length > 0) {
    fs.writeFileSync('missing_isins.txt', onlyInJustETF.join('\n'));
    console.log('\nMissing ISINs saved to missing_isins.txt');
    console.log('Sample of missing ISINs:');
    onlyInJustETF.slice(0, 20).forEach(isin => console.log('  ' + isin));
  }

  // Save ISINs only in our DB (might be delisted or different source)
  if (onlyInOurs.length > 0) {
    fs.writeFileSync('extra_isins.txt', onlyInOurs.join('\n'));
    console.log('\nISINs only in our DB saved to extra_isins.txt');
    console.log('Sample (might be delisted/from other source):');
    onlyInOurs.slice(0, 10).forEach(isin => console.log('  ' + isin));
  }
}

compare().catch(console.error);
