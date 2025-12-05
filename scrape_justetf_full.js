const https = require('https');
const fs = require('fs');

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

function extractETFs(html) {
  const regex = /var\s+(id\d+Etfs)\s*=\s*(\[[\s\S]*?\]);/g;
  let etfs = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[2]);
      etfs = etfs.concat(parsed);
    } catch (e) {}
  }

  return etfs;
}

async function scrapeAllCategories() {
  const pages = [
    { name: 'Equity', url: 'https://www.justetf.com/en/etf-list-overview.html' },
    { name: 'Bonds', url: 'https://www.justetf.com/en/etf-list-overview.html?assetClass=class-bonds' },
    { name: 'Commodities', url: 'https://www.justetf.com/en/etf-list-overview.html?assetClass=class-commodities' },
    { name: 'Real Estate', url: 'https://www.justetf.com/en/etf-list-overview.html?assetClass=class-realestate' },
    { name: 'Money Market', url: 'https://www.justetf.com/en/etf-list-overview.html?assetClass=class-moneymarket' },
    { name: 'Crypto', url: 'https://www.justetf.com/en/etf-list-overview.html?assetClass=class-cryptocurrencies' },
  ];

  let allETFs = [];
  let summary = {};

  for (const page of pages) {
    console.log(`\nFetching ${page.name}...`);
    try {
      const html = await fetchPage(page.url);
      const etfs = extractETFs(html);
      console.log(`  Found: ${etfs.length} ETFs`);
      summary[page.name] = etfs.length;
      allETFs = allETFs.concat(etfs.map(e => ({ ...e, category: page.name })));
    } catch (e) {
      console.error(`  Error: ${e.message}`);
    }
  }

  // Deduplicate by ISIN
  const uniqueMap = new Map();
  allETFs.forEach(etf => {
    if (!uniqueMap.has(etf.isin)) {
      uniqueMap.set(etf.isin, etf);
    }
  });

  const uniqueETFs = Array.from(uniqueMap.values());

  console.log('\n========================================');
  console.log('JUSTETF COMPLETE SUMMARY');
  console.log('========================================');

  Object.entries(summary).forEach(([cat, count]) => {
    console.log(`${cat.padEnd(15)}: ${count}`);
  });

  console.log('----------------------------------------');
  console.log(`TOTAL (raw)     : ${allETFs.length}`);
  console.log(`UNIQUE ISINs    : ${uniqueETFs.length}`);
  console.log('========================================');

  // Save data
  fs.writeFileSync('justetf_all_isins.json', JSON.stringify(
    uniqueETFs.map(e => e.isin), null, 2
  ));

  fs.writeFileSync('justetf_all_data.json', JSON.stringify(uniqueETFs, null, 2));

  console.log('\nSaved to justetf_all_isins.json and justetf_all_data.json');

  // Compare with our database
  console.log('\n========================================');
  console.log('COMPARISON WITH OUR DATABASE (3618 ETFs)');
  console.log('========================================');
  console.log(`justETF unique : ${uniqueETFs.length}`);
  console.log(`Our database   : 3618`);
  console.log(`Difference     : ${3618 - uniqueETFs.length}`);

  return uniqueETFs;
}

scrapeAllCategories().catch(console.error);
