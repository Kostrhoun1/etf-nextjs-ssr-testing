#!/usr/bin/env node

/**
 * 🧪 TEST SCRIPT pro webhook funkčnost
 * 
 * Testuje, že scraper dokáže aktualizovat homepage přes webhook API
 */

const https = require('https');
const http = require('http');

// Konfigurace
const TEST_CONFIG = {
  // Pro development - localhost
  webhookUrl: 'http://localhost:3000/api/revalidate',
  secret: 'etf_refresh_2025',
  timeout: 30000
};

async function testWebhook() {
  console.log('🧪 SPOUŠTÍM TEST WEBHOOK FUNKCIONALITY');
  console.log('=====================================\n');
  
  console.log('📋 Konfigurace testu:');
  console.log(`   URL: ${TEST_CONFIG.webhookUrl}`);
  console.log(`   Secret: ${TEST_CONFIG.secret}`);
  console.log(`   Timeout: ${TEST_CONFIG.timeout}ms\n`);
  
  try {
    // Simulace webhook volání ze scraperu
    const result = await sendWebhookRequest();
    
    console.log('✅ TEST ÚSPĚŠNÝ!');
    console.log('================');
    console.log('Response:', JSON.stringify(result, null, 2));
    console.log('\n🎉 Webhook funguje správně - homepage se aktualizuje po skončení scraperu!\n');
    
  } catch (error) {
    console.log('❌ TEST NEÚSPĚŠNÝ!');
    console.log('==================');
    console.error('Error:', error.message);
    console.log('\n🚨 Webhook nefunguje - potřeba opravit!\n');
    process.exit(1);
  }
}

function sendWebhookRequest() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      secret: TEST_CONFIG.secret,
      timestamp: new Date().toISOString(),
      source: 'test-script'
    });
    
    const url = new URL(TEST_CONFIG.webhookUrl);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'ETF-Scraper-Test/1.0'
      },
      timeout: TEST_CONFIG.timeout
    };
    
    console.log('🔄 Posílám webhook request...');
    console.log(`   → POST ${TEST_CONFIG.webhookUrl}`);
    console.log(`   → Payload: ${postData}\n`);
    
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      console.log(`📨 Response Status: ${res.statusCode}`);
      console.log(`📨 Response Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(data);
          
          if (res.statusCode === 200) {
            resolve(jsonResponse);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${jsonResponse.error || data}`));
          }
        } catch (e) {
          if (res.statusCode === 200) {
            resolve({ rawResponse: data });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Network error: ${error.message}`));
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// Spuštění testu
if (require.main === module) {
  testWebhook().catch(console.error);
}

module.exports = { testWebhook, sendWebhookRequest };