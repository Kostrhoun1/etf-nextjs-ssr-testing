#!/usr/bin/env node

/**
 * 🤖 CRAWLER TEST pro SSR a SEO readability
 * 
 * Testuje, jestli homepage obsahuje veškerý obsah v HTML bez nutnosti JavaScript
 */

const https = require('https');

class CrawlerTest {
  constructor() {
    this.url = 'https://etfpruvodce.cz';
    this.results = {
      isSSR: false,
      hasETFData: false,
      hasCategories: false,
      hasSearch: false,
      hasStructuredData: false,
      hasMetaTags: false,
      issues: []
    };
  }

  async fetchHomepage() {
    return new Promise((resolve, reject) => {
      https.get(this.url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }

  analyzeHTML(html) {
    console.log('🤖 ANALÝZA HOMEPAGE PRO CRAWLERY');
    console.log('=================================\n');

    // Test 1: Základní SSR check
    console.log('📊 Test 1: Server-Side Rendering');
    console.log('----------------------------------');
    
    if (html.includes('__NEXT_DATA__')) {
      console.log('✅ Next.js SSR detekován');
      this.results.isSSR = true;
    } else {
      console.log('❌ Next.js SSR NOT found');
      this.results.issues.push('Missing Next.js SSR data');
    }

    // Test 2: ETF data v HTML
    console.log('\n📈 Test 2: ETF Data v HTML Source');
    console.log('-----------------------------------');
    
    const etfIndicators = ['IWDA', 'SWDA', 'TER', 'iShares', 'Vanguard', '0,', '%'];
    const foundETFs = etfIndicators.filter(indicator => html.includes(indicator));
    
    if (foundETFs.length >= 5) {
      console.log(`✅ ETF data přítomna (${foundETFs.length}/${etfIndicators.length} indikátorů)`);
      console.log(`   Nalezeno: ${foundETFs.join(', ')}`);
      this.results.hasETFData = true;
    } else {
      console.log(`❌ Nedostatek ETF dat (${foundETFs.length}/${etfIndicators.length})`);
      this.results.issues.push('Insufficient ETF data in HTML');
    }

    // Test 3: Kategorie
    console.log('\n📂 Test 3: ETF Kategorie');
    console.log('--------------------------');
    
    const categories = ['Akciové', 'Dluhopisy', 'Nemovitosti', 'Komodity', 'Krypto'];
    const foundCategories = categories.filter(cat => html.includes(cat));
    
    if (foundCategories.length >= 4) {
      console.log(`✅ Kategorie přítomny (${foundCategories.length}/${categories.length})`);
      console.log(`   Nalezeno: ${foundCategories.join(', ')}`);
      this.results.hasCategories = true;
    } else {
      console.log(`❌ Chybí kategorie (${foundCategories.length}/${categories.length})`);
      this.results.issues.push('Missing categories in HTML');
    }

    // Test 4: Structured Data (JSON-LD)
    console.log('\n🏷️ Test 4: Structured Data (Schema.org)');
    console.log('------------------------------------------');
    
    if (html.includes('application/ld+json') || html.includes('"@type"')) {
      console.log('✅ Structured data přítomna');
      this.results.hasStructuredData = true;
    } else {
      console.log('⚠️  Structured data nenalezena');
      this.results.issues.push('Missing structured data');
    }

    // Test 5: Meta tagy
    console.log('\n🏷️ Test 5: SEO Meta Tags');
    console.log('--------------------------');
    
    const metaChecks = {
      title: html.includes('<title>') && html.includes('ETF'),
      description: html.includes('name="description"'),
      keywords: html.includes('name="keywords"') || html.includes('ETF'),
      canonical: html.includes('rel="canonical"'),
      viewport: html.includes('name="viewport"')
    };
    
    const passedMeta = Object.entries(metaChecks).filter(([key, passed]) => passed);
    
    if (passedMeta.length >= 4) {
      console.log(`✅ Meta tags OK (${passedMeta.length}/5)`);
      console.log(`   Passed: ${passedMeta.map(([key]) => key).join(', ')}`);
      this.results.hasMetaTags = true;
    } else {
      console.log(`⚠️  Meta tags neúplné (${passedMeta.length}/5)`);
      this.results.issues.push('Incomplete meta tags');
    }

    // Test 6: Kritické obsahy pro SEO
    console.log('\n📝 Test 6: SEO-kritický obsah');
    console.log('-------------------------------');
    
    const seoContent = [
      'Nejlepší ETF podle kategorií',
      'ETF fondů',
      'srovnání',
      'investice',
      'Global search' // Mohlo by být problém
    ];
    
    const foundContent = seoContent.filter(content => html.includes(content));
    console.log(`✅ SEO obsah: ${foundContent.length}/${seoContent.length} nalezeno`);
    console.log(`   Obsah: ${foundContent.join(', ')}`);

    // Test 7: Client-only problémy
    console.log('\n⚠️  Test 7: Client-only Content Check');
    console.log('--------------------------------------');
    
    const clientOnlyIndicators = [
      'Loading...',
      'useEffect',
      'useState',
      'Please enable JavaScript',
      'noscript'
    ];
    
    const foundClientOnly = clientOnlyIndicators.filter(indicator => html.includes(indicator));
    
    if (foundClientOnly.length === 0) {
      console.log('✅ Žádné client-only obsahy');
    } else {
      console.log(`⚠️  Možné client-only obsahy: ${foundClientOnly.join(', ')}`);
    }

    // Test 8: HTML velikost a struktura
    console.log('\n📊 Test 8: HTML Struktura');
    console.log('---------------------------');
    
    const htmlSize = html.length;
    const hasProperStructure = html.includes('<html') && html.includes('<head') && html.includes('<body');
    
    console.log(`📦 HTML velikost: ${Math.round(htmlSize / 1024)}KB`);
    console.log(`🏗️  HTML struktura: ${hasProperStructure ? '✅ Správná' : '❌ Chybná'}`);
    
    if (htmlSize < 50000) {
      console.log('⚠️  HTML může být příliš malé (< 50KB)');
    } else if (htmlSize > 500000) {
      console.log('⚠️  HTML může být příliš velké (> 500KB)');
    } else {
      console.log('✅ HTML velikost v pořádku');
    }
  }

  generateReport() {
    console.log('\n🎯 VÝSLEDKY CRAWLER TESTU');
    console.log('==========================\n');

    const score = [
      this.results.isSSR,
      this.results.hasETFData, 
      this.results.hasCategories,
      this.results.hasMetaTags
    ].filter(Boolean).length;

    console.log(`📊 CELKOVÉ HODNOCENÍ: ${score}/4`);
    
    if (score === 4) {
      console.log('🟢 VYNIKAJÍCÍ: Homepage je plně crawler-friendly!');
    } else if (score >= 3) {
      console.log('🟡 DOBRÉ: Většina obsahu je dostupná crawlerům');
    } else {
      console.log('🔴 PROBLÉMY: Homepage má SEO issues');
    }

    console.log('\n📋 Detailní výsledky:');
    console.log(`   SSR: ${this.results.isSSR ? '✅' : '❌'}`);
    console.log(`   ETF Data: ${this.results.hasETFData ? '✅' : '❌'}`);
    console.log(`   Kategorie: ${this.results.hasCategories ? '✅' : '❌'}`);
    console.log(`   Meta Tags: ${this.results.hasMetaTags ? '✅' : '❌'}`);

    if (this.results.issues.length > 0) {
      console.log('\n⚠️  NALEZENÉ PROBLÉMY:');
      this.results.issues.forEach(issue => console.log(`   - ${issue}`));
    }

    console.log('\n✨ CRAWLER DOPORUČENÍ:');
    console.log('----------------------');
    console.log('✅ Používej SSR pro všechen kritický obsah');
    console.log('✅ ETF data musí být v HTML source');
    console.log('✅ Přidej structured data (JSON-LD)');
    console.log('✅ Optimalizuj meta tagy pro každou stránku');
    console.log('✅ Minimalizuj client-only content');
  }

  async run() {
    try {
      console.log(`🌐 Testuji: ${this.url}\n`);
      const html = await this.fetchHomepage();
      this.analyzeHTML(html);
      this.generateReport();
    } catch (error) {
      console.error('❌ Crawler test failed:', error.message);
    }
  }
}

// Spuštění testu
if (require.main === module) {
  const test = new CrawlerTest();
  test.run().catch(console.error);
}

module.exports = CrawlerTest;