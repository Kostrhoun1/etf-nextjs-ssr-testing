#!/usr/bin/env node

const https = require('https');
const { DOMParser } = require('xmldom');

async function fetchSitemap() {
  return new Promise((resolve, reject) => {
    https.get('https://etfpruvodce.cz/sitemap.xml', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function testUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'HEAD',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      resolve({
        url,
        status: res.statusCode,
        ok: res.statusCode >= 200 && res.statusCode < 400
      });
    });

    req.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        ok: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        ok: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function main() {
  console.log('📡 Fetching sitemap...');
  
  try {
    const sitemapXml = await fetchSitemap();
    const parser = new DOMParser();
    const doc = parser.parseFromString(sitemapXml, 'text/xml');
    
    const urlElements = doc.getElementsByTagName('loc');
    const urls = [];
    
    for (let i = 0; i < urlElements.length; i++) {
      urls.push(urlElements[i].textContent);
    }
    
    console.log(`🔍 Found ${urls.length} URLs in sitemap`);
    console.log('🚀 Testing all URLs...\n');
    
    const results = {
      total: urls.length,
      ok: 0,
      errors: 0,
      failed: []
    };
    
    // Test URLs in batches to avoid overwhelming server
    const batchSize = 10;
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(testUrl));
      
      batchResults.forEach(result => {
        if (result.ok) {
          results.ok++;
          process.stdout.write('✅');
        } else {
          results.errors++;
          results.failed.push(result);
          process.stdout.write('❌');
        }
      });
      
      // Progress indicator
      if ((i + batchSize) % 50 === 0) {
        console.log(` (${Math.min(i + batchSize, urls.length)}/${urls.length})`);
      }
    }
    
    console.log(`\n\n📊 RESULTS:`);
    console.log(`✅ Working: ${results.ok}/${results.total} (${(results.ok/results.total*100).toFixed(1)}%)`);
    console.log(`❌ Failed: ${results.errors}/${results.total} (${(results.errors/results.total*100).toFixed(1)}%)`);
    
    if (results.failed.length > 0) {
      console.log('\n🚨 FAILED URLs:');
      results.failed.forEach(result => {
        console.log(`${result.status} - ${result.url}`);
        if (result.error) console.log(`   Error: ${result.error}`);
      });
    }
    
    if (results.errors === 0) {
      console.log('\n🎉 All URLs in sitemap are working correctly!');
    } else {
      console.log(`\n⚠️  ${results.errors} URLs need attention.`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();