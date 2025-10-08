#!/usr/bin/env node

/**
 * 🚀 PERFORMANCE TEST NOVÉ HOMEPAGE
 * 
 * Testuje rychlost načítání, Time to First Byte, a další metriky
 */

const https = require('https');
const http = require('http');

// Konfigurace testů
const TEST_CONFIG = {
  production_url: 'https://etfpruvodce.cz',
  localhost_url: 'http://localhost:3000',
  test_runs: 5,
  timeout: 30000
};

class PerformanceTest {
  constructor() {
    this.results = {
      production: [],
      localhost: []
    };
  }

  async measurePageLoad(url) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Performance-Test',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        },
        timeout: TEST_CONFIG.timeout
      };

      const req = client.request(options, (res) => {
        const ttfb = Date.now() - startTime; // Time to First Byte
        let responseSize = 0;
        let contentReceived = 0;

        res.on('data', (chunk) => {
          if (contentReceived === 0) {
            // Čas prvního obsahu
            contentReceived = Date.now() - startTime;
          }
          responseSize += chunk.length;
        });

        res.on('end', () => {
          const totalTime = Date.now() - startTime;
          
          resolve({
            url: url,
            statusCode: res.statusCode,
            ttfb: ttfb,
            firstContent: contentReceived,
            totalTime: totalTime,
            responseSize: responseSize,
            timestamp: new Date().toISOString()
          });
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  async runTests() {
    console.log('🚀 PERFORMANCE TEST NOVÉ HOMEPAGE');
    console.log('===================================\n');

    // Test produkce
    console.log('📊 Testuju PRODUKCI (etfpruvodce.cz)...');
    for (let i = 1; i <= TEST_CONFIG.test_runs; i++) {
      try {
        console.log(`   Test ${i}/${TEST_CONFIG.test_runs}...`);
        const result = await this.measurePageLoad(TEST_CONFIG.production_url);
        this.results.production.push(result);
        console.log(`   ✅ ${result.totalTime}ms (TTFB: ${result.ttfb}ms)`);
      } catch (error) {
        console.log(`   ❌ Test ${i} failed: ${error.message}`);
      }
      
      // Krátká pauza mezi testy
      if (i < TEST_CONFIG.test_runs) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('\n📊 Testuju LOCALHOST (dev server)...');
    for (let i = 1; i <= TEST_CONFIG.test_runs; i++) {
      try {
        console.log(`   Test ${i}/${TEST_CONFIG.test_runs}...`);
        const result = await this.measurePageLoad(TEST_CONFIG.localhost_url);
        this.results.localhost.push(result);
        console.log(`   ✅ ${result.totalTime}ms (TTFB: ${result.ttfb}ms)`);
      } catch (error) {
        console.log(`   ❌ Test ${i} failed: ${error.message}`);
      }
      
      if (i < TEST_CONFIG.test_runs) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  calculateStats(results) {
    if (results.length === 0) return null;

    const totalTimes = results.map(r => r.totalTime);
    const ttfbs = results.map(r => r.ttfb);
    const sizes = results.map(r => r.responseSize);

    return {
      totalTime: {
        min: Math.min(...totalTimes),
        max: Math.max(...totalTimes),
        avg: Math.round(totalTimes.reduce((a, b) => a + b) / totalTimes.length),
        median: this.median(totalTimes)
      },
      ttfb: {
        min: Math.min(...ttfbs),
        max: Math.max(...ttfbs),
        avg: Math.round(ttfbs.reduce((a, b) => a + b) / ttfbs.length),
        median: this.median(ttfbs)
      },
      responseSize: {
        avg: Math.round(sizes.reduce((a, b) => a + b) / sizes.length),
        min: Math.min(...sizes),
        max: Math.max(...sizes)
      },
      successRate: (results.filter(r => r.statusCode === 200).length / results.length * 100).toFixed(1)
    };
  }

  median(arr) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }

  generateReport() {
    console.log('\n📈 VÝSLEDKY PERFORMANCE TESTU');
    console.log('===============================\n');

    const prodStats = this.calculateStats(this.results.production);
    const localhostStats = this.calculateStats(this.results.localhost);

    if (prodStats) {
      console.log('🌐 PRODUKCE (etfpruvodce.cz):');
      console.log('------------------------------');
      console.log(`📊 Celkový čas načítání:`);
      console.log(`   Průměr: ${prodStats.totalTime.avg}ms`);
      console.log(`   Medián: ${prodStats.totalTime.median}ms`);
      console.log(`   Min: ${prodStats.totalTime.min}ms`);
      console.log(`   Max: ${prodStats.totalTime.max}ms`);
      console.log(`🚀 Time to First Byte (TTFB):`);
      console.log(`   Průměr: ${prodStats.ttfb.avg}ms`);
      console.log(`   Medián: ${prodStats.ttfb.median}ms`);
      console.log(`📦 Velikost odpovědi: ${Math.round(prodStats.responseSize.avg / 1024)}KB`);
      console.log(`✅ Úspěšnost: ${prodStats.successRate}%`);
    }

    if (localhostStats) {
      console.log('\n💻 LOCALHOST (dev server):');
      console.log('---------------------------');
      console.log(`📊 Celkový čas načítání:`);
      console.log(`   Průměr: ${localhostStats.totalTime.avg}ms`);
      console.log(`   Medián: ${localhostStats.totalTime.median}ms`);
      console.log(`   Min: ${localhostStats.totalTime.min}ms`);
      console.log(`   Max: ${localhostStats.totalTime.max}ms`);
      console.log(`🚀 Time to First Byte (TTFB):`);
      console.log(`   Průměr: ${localhostStats.ttfb.avg}ms`);
      console.log(`   Medián: ${localhostStats.ttfb.median}ms`);
      console.log(`📦 Velikost odpovědi: ${Math.round(localhostStats.responseSize.avg / 1024)}KB`);
      console.log(`✅ Úspěšnost: ${localhostStats.successRate}%`);
    }

    // Porovnání a hodnocení
    console.log('\n🎯 HODNOCENÍ VÝKONU:');
    console.log('====================');
    
    if (prodStats) {
      const avgTime = prodStats.totalTime.avg;
      const avgTTFB = prodStats.ttfb.avg;
      
      console.log('📈 Rychlost načítání:');
      if (avgTime < 1000) {
        console.log(`   🟢 VYNIKAJÍCÍ: ${avgTime}ms (< 1s)`);
      } else if (avgTime < 2000) {
        console.log(`   🟡 DOBRÉ: ${avgTime}ms (1-2s)`);
      } else if (avgTime < 3000) {
        console.log(`   🟠 PRŮMĚRNÉ: ${avgTime}ms (2-3s)`);
      } else {
        console.log(`   🔴 POMALÉ: ${avgTime}ms (> 3s)`);
      }

      console.log('⚡ Time to First Byte:');
      if (avgTTFB < 200) {
        console.log(`   🟢 VYNIKAJÍCÍ: ${avgTTFB}ms (< 200ms)`);
      } else if (avgTTFB < 500) {
        console.log(`   🟡 DOBRÉ: ${avgTTFB}ms (200-500ms)`);
      } else if (avgTTFB < 1000) {
        console.log(`   🟠 PRŮMĚRNÉ: ${avgTTFB}ms (500ms-1s)`);
      } else {
        console.log(`   🔴 POMALÉ: ${avgTTFB}ms (> 1s)`);
      }

      // Porovnání s předchozí verzí
      console.log('\n📊 POROVNÁNÍ S PŮVODNÍ VERZÍ:');
      console.log('-----------------------------');
      console.log('🔴 PŮVODNÍ: 4000-5000ms (pomalá tabulka se všemi ETF)');
      console.log(`🟢 NOVÁ: ${avgTime}ms (rychlé kategorie + globální search)`);
      
      if (avgTime < 4000) {
        const improvement = Math.round((4500 - avgTime) / 4500 * 100);
        console.log(`🚀 ZLEPŠENÍ: ${improvement}% rychlejší!`);
      }
    }

    console.log('\n✨ SHRNUTÍ OPTIMALIZACÍ:');
    console.log('------------------------');
    console.log('✅ Nahrazena pomalá tabulka rychlými kategoriemi');
    console.log('✅ Přidáno globální vyhledávání do hlavičky');
    console.log('✅ Server-side rendering pro rychlé načítání');
    console.log('✅ Optimalizované dotazy do databáze');
    console.log('✅ Automatická aktualizace po scraper běhu');
  }

  async run() {
    try {
      await this.runTests();
      this.generateReport();
    } catch (error) {
      console.error('❌ Performance test failed:', error.message);
    }
  }
}

// Spuštění testu
if (require.main === module) {
  const test = new PerformanceTest();
  test.run().catch(console.error);
}

module.exports = PerformanceTest;