const https = require('https');
const fs = require('fs');

// Fetch the justETF page
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function scrapeJustETF() {
  console.log('Fetching justETF page...');

  const html = await fetchPage('https://www.justetf.com/en/etf-list-overview.html');

  // Find all JavaScript variable definitions with ETF data
  // Pattern: var id##Etfs = [...]
  const regex = /var\s+(id\d+Etfs)\s*=\s*(\[[\s\S]*?\]);/g;

  let allETFs = [];
  let match;
  let arrayCount = 0;

  while ((match = regex.exec(html)) !== null) {
    const varName = match[1];
    const arrayStr = match[2];

    try {
      // Parse the JSON array
      const etfs = JSON.parse(arrayStr);
      console.log(`Found ${varName}: ${etfs.length} ETFs`);
      allETFs = allETFs.concat(etfs);
      arrayCount++;
    } catch (e) {
      console.error(`Error parsing ${varName}:`, e.message);
    }
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Total arrays found: ${arrayCount}`);
  console.log(`Total ETFs found: ${allETFs.length}`);

  // Extract unique ISINs
  const uniqueISINs = [...new Set(allETFs.map(e => e.isin))];
  console.log(`Unique ISINs: ${uniqueISINs.length}`);

  // Count by category (based on savingsPlanUrl patterns)
  const categories = {};
  allETFs.forEach(etf => {
    // Extract category from URL
    const urlMatch = etf.savingsPlanUrl?.match(/etf-sparplan-vergleich\/([^/]+)-etf/);
    if (urlMatch) {
      const cat = urlMatch[1];
      categories[cat] = (categories[cat] || 0) + 1;
    }
  });

  // Show top categories
  console.log('\n=== TOP 20 CATEGORIES ===');
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([cat, count]) => console.log(`${cat}: ${count}`));

  // Save all ISINs to file
  fs.writeFileSync('justetf_isins.json', JSON.stringify(uniqueISINs, null, 2));
  console.log('\nSaved ISINs to justetf_isins.json');

  // Save full data
  fs.writeFileSync('justetf_full.json', JSON.stringify(allETFs, null, 2));
  console.log('Saved full data to justetf_full.json');

  // Sample of data
  console.log('\n=== SAMPLE ETF DATA ===');
  console.log(JSON.stringify(allETFs[0], null, 2));

  return allETFs;
}

scrapeJustETF().catch(console.error);
