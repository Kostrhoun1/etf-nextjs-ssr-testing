const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nbhwnatadyubiuadfakx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo'
);

async function generateReport() {
  // Fetch all ETFs
  let allETFs = [];
  let offset = 0;
  const batchSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('etf_funds')
      .select('isin, name, ter_numeric, fund_size_numeric, fund_size, return_ytd, return_1y, return_3y, return_5y, category, fund_provider, replication, distribution_policy, inception_date, rating, volatility_1y, country_1_name, investment_focus, index_name, return_2024, return_2023, return_2022, return_2021, primary_ticker, current_dividend_yield_numeric')
      .range(offset, offset + batchSize - 1);

    if (error) {
      console.error('Error:', error);
      return;
    }
    allETFs = allETFs.concat(data);
    if (data.length < batchSize) break;
    offset += batchSize;
  }

  // Helper: Extract region from investment_focus
  function getRegion(etf) {
    const focus = etf.investment_focus || '';
    if (focus.includes('United States') || focus.includes('USA') || focus.includes('North America')) return 'USA';
    if (focus.includes('Europe') && !focus.includes('ex Europe')) return 'Evropa';
    if (focus.includes('World') || focus.includes('Global')) return 'Svět';
    if (focus.includes('Emerging') || focus.includes('EM')) return 'Emerging Markets';
    if (focus.includes('Asia') || focus.includes('Pacific')) return 'Asie/Pacifik';
    if (focus.includes('Japan')) return 'Japonsko';
    if (focus.includes('China')) return 'Čína';
    if (focus.includes('India')) return 'Indie';
    if (focus.includes('United Kingdom') || focus.includes('UK')) return 'UK';
    if (focus.includes('Germany')) return 'Německo';
    if (focus.includes('Switzerland')) return 'Švýcarsko';
    return 'Ostatní';
  }

  // Helper: Parse inception date
  function parseInception(dateStr) {
    if (!dateStr) return null;
    const months = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    const parts = dateStr.split(' ');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return null;
  }

  const withYTD = allETFs.filter(e => e.return_ytd !== null);
  const withSize = allETFs.filter(e => e.fund_size_numeric && e.fund_size_numeric > 0);
  const withTER = allETFs.filter(e => e.ter_numeric !== null && e.ter_numeric > 0 && e.ter_numeric < 1); // Filter out 2.5% TER krypto

  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║               ETF REPORT 2025 - KOMPLETNÍ ANALÝZA               ║');
  console.log('║                    www.etfpruvodce.cz                            ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  // ===========================================
  // SECTION 1: EXECUTIVE SUMMARY
  // ===========================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 EXECUTIVE SUMMARY - ROK 2025 V ČÍSLECH');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Celkem ETF v databázi:     ' + allETFs.length);
  console.log('ETF s YTD daty:            ' + withYTD.length);

  const avgYTD = withYTD.reduce((sum, e) => sum + e.return_ytd, 0) / withYTD.length;
  console.log('Průměrná YTD výkonnost:    ' + avgYTD.toFixed(2) + '%');

  // Category breakdown
  const categories = {};
  withYTD.forEach(e => {
    const cat = e.category || 'Ostatní';
    if (!categories[cat]) categories[cat] = { count: 0, sum: 0 };
    categories[cat].count++;
    categories[cat].sum += e.return_ytd;
  });

  console.log('\nVýkonnost podle kategorie:');
  Object.entries(categories)
    .map(([k, v]) => ({ cat: k, avg: v.sum / v.count, count: v.count }))
    .sort((a, b) => b.avg - a.avg)
    .forEach(({ cat, avg, count }) => {
      const bar = avg > 0 ? '█'.repeat(Math.min(Math.floor(avg / 2), 20)) : '░'.repeat(Math.min(Math.floor(Math.abs(avg) / 2), 20));
      console.log('  ' + cat.padEnd(15) + (avg >= 0 ? '+' : '') + avg.toFixed(2).padStart(7) + '% (' + count + ' ETF) ' + bar);
    });

  // ===========================================
  // SECTION 2: TOP PERFORMERS (bez leveraged)
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏆 TOP 25 VÍTĚZOVÉ ROKU 2025 (bez leveraged produktů)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const nonLeveraged = withYTD.filter(e => {
    const name = e.name.toLowerCase();
    return !name.includes('leveraged') && !name.includes('2x') && !name.includes('3x') &&
           !name.includes('5x') && !name.includes('daily short') && !name.includes('daily long') &&
           !name.includes('inverse') && !name.includes('graniteshares');
  });

  nonLeveraged.sort((a, b) => b.return_ytd - a.return_ytd).slice(0, 25).forEach((e, i) => {
    const region = getRegion(e);
    const size = e.fund_size_numeric ? (e.fund_size_numeric >= 1000 ? (e.fund_size_numeric / 1000).toFixed(1) + 'B' : e.fund_size_numeric + 'M') : 'N/A';
    console.log((i + 1).toString().padStart(2) + '. ' + e.name.substring(0, 50).padEnd(52) +
                ' YTD: +' + e.return_ytd.toFixed(2).padStart(6) + '% | ' +
                region.padEnd(8) + ' | ' + size.padStart(6));
  });

  // ===========================================
  // SECTION 3: WORST PERFORMERS (bez leveraged)
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📉 TOP 25 PORAŽENÍ ROKU 2025 (bez leveraged produktů)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  nonLeveraged.sort((a, b) => a.return_ytd - b.return_ytd).slice(0, 25).forEach((e, i) => {
    const region = getRegion(e);
    console.log((i + 1).toString().padStart(2) + '. ' + e.name.substring(0, 55).padEnd(57) +
                ' YTD: ' + e.return_ytd.toFixed(2).padStart(7) + '% | ' + region);
  });

  // ===========================================
  // SECTION 4: REGIONAL ANALYSIS
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌍 REGIONÁLNÍ ANALÝZA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const regionPerf = {};
  nonLeveraged.filter(e => e.category === 'Akcie').forEach(e => {
    const region = getRegion(e);
    if (!regionPerf[region]) regionPerf[region] = [];
    regionPerf[region].push(e.return_ytd);
  });

  Object.entries(regionPerf)
    .map(([k, v]) => ({ region: k, avg: v.reduce((a, b) => a + b, 0) / v.length, count: v.length }))
    .filter(r => r.count >= 5)
    .sort((a, b) => b.avg - a.avg)
    .forEach(({ region, avg, count }) => {
      const bar = avg > 0 ? '🟢'.repeat(Math.min(Math.floor(avg / 3), 10)) : '🔴'.repeat(Math.min(Math.floor(Math.abs(avg) / 3), 10));
      console.log('  ' + region.padEnd(20) + (avg >= 0 ? '+' : '') + avg.toFixed(2).padStart(7) + '% (' + count.toString().padStart(3) + ' ETF) ' + bar);
    });

  // ===========================================
  // SECTION 5: NEJVĚTŠÍ ETF
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💰 TOP 30 NEJVĚTŠÍCH ETF (podle AUM) - JAK SI VEDLA V 2025?');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  withSize.sort((a, b) => b.fund_size_numeric - a.fund_size_numeric).slice(0, 30).forEach((e, i) => {
    const sizeStr = e.fund_size_numeric >= 1000 ? (e.fund_size_numeric / 1000).toFixed(1) + ' mld EUR' : e.fund_size_numeric + ' mil EUR';
    const ytdStr = e.return_ytd !== null ? ((e.return_ytd >= 0 ? '+' : '') + e.return_ytd.toFixed(2) + '%') : 'N/A';
    console.log((i + 1).toString().padStart(2) + '. ' + (e.primary_ticker || e.isin.substring(0,6)).padEnd(8) + ' ' +
                e.name.substring(0, 40).padEnd(42) + sizeStr.padStart(14) + ' | YTD: ' + ytdStr.padStart(8));
  });

  // ===========================================
  // SECTION 6: NEJLEVNĚJŠÍ ETF
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💸 TOP 20 NEJLEVNĚJŠÍCH ETF (TER) - CENOVÁ VÁLKA 2025');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  withTER.sort((a, b) => a.ter_numeric - b.ter_numeric).slice(0, 20).forEach((e, i) => {
    const size = e.fund_size_numeric ? (e.fund_size_numeric >= 1000 ? (e.fund_size_numeric / 1000).toFixed(1) + 'B' : e.fund_size_numeric + 'M') : 'N/A';
    console.log((i + 1).toString().padStart(2) + '. TER ' + (e.ter_numeric * 100).toFixed(2).padStart(5) + '% | ' +
                e.name.substring(0, 55).padEnd(57) + ' | ' + size.padStart(6));
  });

  // Avg TER by category
  console.log('\nPrůměrné TER podle kategorie:');
  const catTER = {};
  withTER.forEach(e => {
    const cat = e.category || 'Ostatní';
    if (!catTER[cat]) catTER[cat] = [];
    catTER[cat].push(e.ter_numeric);
  });
  Object.entries(catTER)
    .map(([k, v]) => ({ cat: k, avg: v.reduce((a, b) => a + b, 0) / v.length, count: v.length }))
    .sort((a, b) => a.avg - b.avg)
    .forEach(({ cat, avg, count }) => {
      console.log('  ' + cat.padEnd(15) + (avg * 100).toFixed(2).padStart(6) + '% (' + count + ' ETF)');
    });

  // ===========================================
  // SECTION 7: AKCIOVÁ ETF DEEP DIVE
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📈 AKCIOVÁ ETF - DEEP DIVE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const akcieETF = nonLeveraged.filter(e => e.category === 'Akcie');
  const avgAkcie = akcieETF.reduce((sum, e) => sum + e.return_ytd, 0) / akcieETF.length;
  console.log('Celkem akciových ETF:      ' + akcieETF.length);
  console.log('Průměrná YTD výkonnost:    +' + avgAkcie.toFixed(2) + '%\n');

  console.log('🥇 TOP 15 Akciová ETF:');
  akcieETF.sort((a, b) => b.return_ytd - a.return_ytd).slice(0, 15).forEach((e, i) => {
    console.log((i + 1).toString().padStart(2) + '. ' + e.name.substring(0, 55).padEnd(57) + ' +' + e.return_ytd.toFixed(2) + '%');
  });

  console.log('\n💀 Nejhorší akciová ETF:');
  akcieETF.sort((a, b) => a.return_ytd - b.return_ytd).slice(0, 10).forEach((e, i) => {
    console.log((i + 1).toString().padStart(2) + '. ' + e.name.substring(0, 55).padEnd(57) + ' ' + e.return_ytd.toFixed(2) + '%');
  });

  // ===========================================
  // SECTION 8: DLUHOPISOVÁ ETF
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💵 DLUHOPISOVÁ ETF - NÁVRAT BONDŮ?');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const bondETF = nonLeveraged.filter(e => e.category === 'Dluhopisy');
  const avgBond = bondETF.reduce((sum, e) => sum + e.return_ytd, 0) / bondETF.length;
  console.log('Celkem dluhopisových ETF:  ' + bondETF.length);
  console.log('Průměrná YTD výkonnost:    ' + (avgBond >= 0 ? '+' : '') + avgBond.toFixed(2) + '%\n');

  console.log('🥇 TOP 15 Dluhopisová ETF:');
  bondETF.sort((a, b) => b.return_ytd - a.return_ytd).slice(0, 15).forEach((e, i) => {
    console.log((i + 1).toString().padStart(2) + '. ' + e.name.substring(0, 55).padEnd(57) + ' +' + e.return_ytd.toFixed(2) + '%');
  });

  // ===========================================
  // SECTION 9: KOMODITY
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🥇 KOMODITY - ZLATO A STŘÍBRO KRALUJÍ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const komodityETF = nonLeveraged.filter(e => e.category === 'Komodity');
  console.log('🥇 TOP 20 Komoditní ETF:');
  komodityETF.sort((a, b) => b.return_ytd - a.return_ytd).slice(0, 20).forEach((e, i) => {
    console.log((i + 1).toString().padStart(2) + '. ' + e.name.substring(0, 55).padEnd(57) + ' +' + e.return_ytd.toFixed(2) + '%');
  });

  // ===========================================
  // SECTION 10: KRYPTO
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🪙 KRYPTO ETF/ETP - ALTCOIN MASAKR 2025');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const kryptoETF = withYTD.filter(e => e.category === 'Krypto');
  const avgKrypto = kryptoETF.reduce((sum, e) => sum + e.return_ytd, 0) / kryptoETF.length;
  console.log('Celkem krypto ETP:         ' + kryptoETF.length);
  console.log('Průměrná YTD výkonnost:    ' + avgKrypto.toFixed(2) + '%\n');

  // Group by underlying
  console.log('Bitcoin ETP:');
  kryptoETF.filter(e => e.name.toLowerCase().includes('bitcoin') && !e.name.toLowerCase().includes('ethereum')).slice(0, 5).forEach(e => {
    console.log('  ' + e.name.substring(0, 45).padEnd(47) + ' ' + e.return_ytd.toFixed(2) + '%');
  });

  console.log('\nEthereum ETP:');
  kryptoETF.filter(e => e.name.toLowerCase().includes('ethereum')).slice(0, 5).forEach(e => {
    console.log('  ' + e.name.substring(0, 45).padEnd(47) + ' ' + e.return_ytd.toFixed(2) + '%');
  });

  console.log('\n💀 Nejhorší altcoiny:');
  kryptoETF.sort((a, b) => a.return_ytd - b.return_ytd).slice(0, 10).forEach((e, i) => {
    console.log((i + 1).toString().padStart(2) + '. ' + e.name.substring(0, 45).padEnd(47) + ' ' + e.return_ytd.toFixed(2) + '%');
  });

  // ===========================================
  // SECTION 11: 5-STAR ETF
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⭐ 5-HVĚZDIČKOVÁ ETF - NEJLEPŠÍ Z NEJLEPŠÍCH');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const fiveStarETF = withYTD.filter(e => e.rating === 5);
  console.log('Celkem 5⭐ ETF: ' + fiveStarETF.length + '\n');

  console.log('TOP 20 výkonnost 5⭐ ETF v roce 2025:');
  fiveStarETF.sort((a, b) => b.return_ytd - a.return_ytd).slice(0, 20).forEach((e, i) => {
    const ter = e.ter_numeric ? (e.ter_numeric * 100).toFixed(2) + '%' : 'N/A';
    console.log((i + 1).toString().padStart(2) + '. ' + e.name.substring(0, 50).padEnd(52) +
                ' YTD: ' + (e.return_ytd >= 0 ? '+' : '') + e.return_ytd.toFixed(2).padStart(6) + '% | TER: ' + ter);
  });

  // ===========================================
  // SECTION 12: POSKYTOVATELÉ
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏢 POSKYTOVATELÉ ETF - KDO VLÁDNE TRHU?');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const providers = {};
  allETFs.forEach(e => {
    const prov = e.fund_provider || 'Ostatní';
    if (!providers[prov]) providers[prov] = { count: 0, ytdSum: 0, ytdCount: 0 };
    providers[prov].count++;
    if (e.return_ytd !== null) {
      providers[prov].ytdSum += e.return_ytd;
      providers[prov].ytdCount++;
    }
  });

  console.log('Provider'.padEnd(25) + 'Počet ETF'.padStart(10) + 'Průměr YTD'.padStart(12));
  console.log('-'.repeat(47));
  Object.entries(providers)
    .map(([k, v]) => ({ name: k, count: v.count, avgYtd: v.ytdCount > 0 ? v.ytdSum / v.ytdCount : null }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)
    .forEach(({ name, count, avgYtd }) => {
      const ytdStr = avgYtd !== null ? ((avgYtd >= 0 ? '+' : '') + avgYtd.toFixed(2) + '%') : 'N/A';
      console.log(name.substring(0, 24).padEnd(25) + count.toString().padStart(10) + ytdStr.padStart(12));
    });

  // ===========================================
  // SECTION 13: HISTORICKÉ SROVNÁNÍ
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📅 HISTORICKÉ SROVNÁNÍ 2021-2025');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const years = [
    { field: 'return_2021', label: '2021' },
    { field: 'return_2022', label: '2022' },
    { field: 'return_2023', label: '2023' },
    { field: 'return_2024', label: '2024' },
    { field: 'return_ytd', label: '2025 YTD' }
  ];

  console.log('Rok'.padEnd(12) + 'Průměr'.padStart(10) + 'Počet ETF'.padStart(12) + '  Vizualizace');
  console.log('-'.repeat(60));
  years.forEach(({ field, label }) => {
    const withData = allETFs.filter(e => e[field] !== null);
    if (withData.length > 0) {
      const avg = withData.reduce((sum, e) => sum + e[field], 0) / withData.length;
      const bar = avg > 0 ? '🟢'.repeat(Math.min(Math.floor(avg / 2), 15)) : '🔴'.repeat(Math.min(Math.floor(Math.abs(avg) / 2), 15));
      console.log(label.padEnd(12) + ((avg >= 0 ? '+' : '') + avg.toFixed(2) + '%').padStart(10) + withData.length.toString().padStart(12) + '  ' + bar);
    }
  });

  // ===========================================
  // SECTION 14: DIVIDENDOVÁ ETF
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💰 DIVIDENDOVÁ ETF - PASIVNÍ PŘÍJEM');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const dividendETF = withYTD.filter(e => e.distribution_policy === 'Distributing' && e.category === 'Akcie');
  console.log('Distribuující akciová ETF: ' + dividendETF.length + '\n');

  console.log('TOP 15 podle YTD výkonnosti:');
  dividendETF.sort((a, b) => b.return_ytd - a.return_ytd).slice(0, 15).forEach((e, i) => {
    const divYield = e.current_dividend_yield_numeric ? e.current_dividend_yield_numeric.toFixed(2) + '%' : 'N/A';
    console.log((i + 1).toString().padStart(2) + '. ' + e.name.substring(0, 45).padEnd(47) +
                ' YTD: +' + e.return_ytd.toFixed(2).padStart(6) + '% | Div: ' + divYield);
  });

  // ===========================================
  // SECTION 15: NOVÁ ETF 2024-2025
  // ===========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🆕 NOVÁ ETF UVEDENÁ V 2024-2025');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const newETFs = allETFs.filter(e => {
    const date = parseInception(e.inception_date);
    return date && date.getFullYear() >= 2024;
  }).map(e => ({
    ...e,
    parsedDate: parseInception(e.inception_date)
  })).sort((a, b) => b.parsedDate - a.parsedDate);

  console.log('Počet nových ETF od 2024: ' + newETFs.length + '\n');

  if (newETFs.length > 0) {
    newETFs.slice(0, 20).forEach(e => {
      const ytdStr = e.return_ytd !== null ? ((e.return_ytd >= 0 ? '+' : '') + e.return_ytd.toFixed(2) + '%') : 'N/A';
      console.log(e.inception_date.padEnd(18) + e.name.substring(0, 50).padEnd(52) + ' YTD: ' + ytdStr);
    });
  }

  // ===========================================
  // FINAL SUMMARY
  // ===========================================
  console.log('\n╔══════════════════════════════════════════════════════════════════╗');
  console.log('║                    SHRNUTÍ ROKU 2025                             ║');
  console.log('╠══════════════════════════════════════════════════════════════════╣');
  console.log('║  🥇 Vítěz:      Zlato & těžaři (+100%+)                          ║');
  console.log('║  🥈 2. místo:   Stříbro (+77%)                                   ║');
  console.log('║  🥉 3. místo:   Evropské banky (+78%)                            ║');
  console.log('║  💀 Poražený:   Altcoiny (-70%)                                  ║');
  console.log('║  📊 Průměr:     +' + avgYTD.toFixed(2) + '%                                            ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');
}

generateReport();
