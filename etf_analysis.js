const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nbhwnatadyubiuadfakx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaHduYXRhZHl1Yml1YWRmYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0NDc0NCwiZXhwIjoyMDY0NDIwNzQ0fQ.SI_s72FBMs2qSqhKBsm7ZJSnPOnCEfWn1zQ6nxMtgyo'
);

async function analyze() {
  // Fetch all ETFs in batches (Supabase has 1000 row limit per query)
  let allETFs = [];
  let offset = 0;
  const batchSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('etf_funds')
      .select('isin, name, ter_numeric, fund_size_numeric, return_ytd, return_1y, return_3y, return_5y, category, fund_provider, replication, distribution_policy, inception_date, rating, volatility_1y, fund_currency, country_1_name, sector_1_name, parsed_region, parsed_asset_class, return_2024, return_2023, return_2022, return_2021, primary_ticker, index_name')
      .range(offset, offset + batchSize - 1);

    if (error) {
      console.error('Error:', error);
      return;
    }

    allETFs = allETFs.concat(data);

    if (data.length < batchSize) break;
    offset += batchSize;
  }

  console.log('=== ZÁKLADNÍ STATISTIKY ===');
  console.log('Celkem ETF v databázi: ' + allETFs.length);

  const withYTD = allETFs.filter(e => e.return_ytd !== null);
  console.log('ETF s YTD daty: ' + withYTD.length);

  // Kategorie
  const categories = {};
  allETFs.forEach(e => {
    const cat = e.category || 'Neznámá';
    categories[cat] = (categories[cat] || 0) + 1;
  });
  console.log('\n=== ROZLOŽENÍ KATEGORIÍ ===');
  Object.entries(categories).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => console.log(k + ': ' + v));

  // Poskytovatelé
  const providers = {};
  allETFs.forEach(e => {
    const prov = e.fund_provider || 'Neznámý';
    providers[prov] = (providers[prov] || 0) + 1;
  });
  console.log('\n=== TOP 15 POSKYTOVATELŮ ===');
  Object.entries(providers).sort((a,b) => b[1] - a[1]).slice(0,15).forEach(([k,v]) => console.log(k + ': ' + v));

  // TER statistiky
  const withTER = allETFs.filter(e => e.ter_numeric !== null && e.ter_numeric > 0);
  const avgTER = withTER.reduce((sum, e) => sum + e.ter_numeric, 0) / withTER.length;
  const minTER = Math.min(...withTER.map(e => e.ter_numeric));
  const maxTER = Math.max(...withTER.map(e => e.ter_numeric));
  console.log('\n=== TER STATISTIKY ===');
  console.log('Průměrné TER: ' + (avgTER * 100).toFixed(3) + '%');
  console.log('Min TER: ' + (minTER * 100).toFixed(3) + '%');
  console.log('Max TER: ' + (maxTER * 100).toFixed(3) + '%');

  // Nejlevnější ETF
  console.log('\n=== TOP 10 NEJLEVNĚJŠÍ ETF ===');
  withTER.sort((a,b) => a.ter_numeric - b.ter_numeric).slice(0,10).forEach((e, i) => {
    console.log((i+1) + '. ' + e.name + ' (' + e.isin + ') - TER: ' + (e.ter_numeric * 100).toFixed(2) + '%');
  });

  // Nejdražší ETF
  console.log('\n=== TOP 10 NEJDRAŽŠÍ ETF ===');
  withTER.sort((a,b) => b.ter_numeric - a.ter_numeric).slice(0,10).forEach((e, i) => {
    console.log((i+1) + '. ' + e.name + ' (' + e.isin + ') - TER: ' + (e.ter_numeric * 100).toFixed(2) + '%');
  });

  // YTD Performance
  console.log('\n=== TOP 20 VÝKONNOST YTD 2025 ===');
  withYTD.sort((a,b) => b.return_ytd - a.return_ytd).slice(0,20).forEach((e, i) => {
    console.log((i+1) + '. ' + e.name.substring(0,55) + ' - YTD: ' + (e.return_ytd ? e.return_ytd.toFixed(2) : 'N/A') + '%');
  });

  console.log('\n=== NEJHORŠÍ 20 VÝKONNOST YTD 2025 ===');
  withYTD.sort((a,b) => a.return_ytd - b.return_ytd).slice(0,20).forEach((e, i) => {
    console.log((i+1) + '. ' + e.name.substring(0,55) + ' - YTD: ' + (e.return_ytd ? e.return_ytd.toFixed(2) : 'N/A') + '%');
  });

  // Průměrná YTD výkonnost podle kategorie
  console.log('\n=== PRŮMĚRNÁ YTD VÝKONNOST PODLE KATEGORIE ===');
  const catPerf = {};
  withYTD.forEach(e => {
    const cat = e.category || 'Neznámá';
    if (!catPerf[cat]) catPerf[cat] = [];
    catPerf[cat].push(e.return_ytd);
  });
  Object.entries(catPerf).map(([k, v]) => ({
    cat: k,
    avg: v.reduce((a,b) => a+b, 0) / v.length,
    count: v.length
  })).sort((a,b) => b.avg - a.avg).forEach(({cat, avg, count}) => {
    console.log(cat + ': ' + avg.toFixed(2) + '% (' + count + ' ETF)');
  });

  // Regiony
  console.log('\n=== PRŮMĚRNÁ YTD VÝKONNOST PODLE REGIONU ===');
  const regionPerf = {};
  withYTD.forEach(e => {
    const region = e.parsed_region || 'Neznámý';
    if (!regionPerf[region]) regionPerf[region] = [];
    regionPerf[region].push(e.return_ytd);
  });
  Object.entries(regionPerf).map(([k, v]) => ({
    region: k,
    avg: v.reduce((a,b) => a+b, 0) / v.length,
    count: v.length
  })).filter(r => r.count >= 5).sort((a,b) => b.avg - a.avg).forEach(({region, avg, count}) => {
    console.log(region + ': ' + avg.toFixed(2) + '% (' + count + ' ETF)');
  });

  // Největší ETF podle velikosti
  const withSize = allETFs.filter(e => e.fund_size_numeric !== null && e.fund_size_numeric > 0);
  console.log('\n=== TOP 15 NEJVĚTŠÍ ETF (podle AUM) ===');
  withSize.sort((a,b) => b.fund_size_numeric - a.fund_size_numeric).slice(0,15).forEach((e, i) => {
    const sizeB = (e.fund_size_numeric / 1000000000).toFixed(2);
    console.log((i+1) + '. ' + e.name.substring(0,45) + ' - ' + sizeB + ' mld EUR - YTD: ' + (e.return_ytd ? e.return_ytd.toFixed(2) : 'N/A') + '%');
  });

  // Rating distribuce
  console.log('\n=== DISTRIBUCE RATINGU ===');
  const ratings = {};
  allETFs.forEach(e => {
    const r = e.rating || 'Bez ratingu';
    ratings[r] = (ratings[r] || 0) + 1;
  });
  Object.entries(ratings).sort((a,b) => b[0] - a[0]).forEach(([k,v]) => console.log(k + ' hvězd: ' + v));

  // Roční výkonnosti 2021-2024
  console.log('\n=== PRŮMĚRNÁ ROČNÍ VÝKONNOST 2021-2024 ===');
  const years = ['return_2021', 'return_2022', 'return_2023', 'return_2024'];
  years.forEach(year => {
    const withYear = allETFs.filter(e => e[year] !== null);
    if (withYear.length > 0) {
      const avg = withYear.reduce((sum, e) => sum + e[year], 0) / withYear.length;
      console.log(year.replace('return_', '') + ': ' + avg.toFixed(2) + '% (' + withYear.length + ' ETF)');
    }
  });

  // Akciová ETF - YTD performance
  console.log('\n=== TOP 15 AKCIOVÁ ETF - YTD 2025 ===');
  withYTD.filter(e => e.category === 'Akcie').sort((a,b) => b.return_ytd - a.return_ytd).slice(0,15).forEach((e, i) => {
    console.log((i+1) + '. ' + e.name.substring(0,55) + ' - YTD: ' + (e.return_ytd ? e.return_ytd.toFixed(2) : 'N/A') + '%');
  });

  // Nejhorší akciová ETF
  console.log('\n=== NEJHORŠÍ 10 AKCIOVÁ ETF - YTD 2025 ===');
  withYTD.filter(e => e.category === 'Akcie').sort((a,b) => a.return_ytd - b.return_ytd).slice(0,10).forEach((e, i) => {
    console.log((i+1) + '. ' + e.name.substring(0,55) + ' - YTD: ' + (e.return_ytd ? e.return_ytd.toFixed(2) : 'N/A') + '%');
  });

  // Dluhopisová ETF - YTD performance
  console.log('\n=== TOP 10 DLUHOPISOVÁ ETF - YTD 2025 ===');
  withYTD.filter(e => e.category === 'Dluhopisy').sort((a,b) => b.return_ytd - a.return_ytd).slice(0,10).forEach((e, i) => {
    console.log((i+1) + '. ' + e.name.substring(0,55) + ' - YTD: ' + (e.return_ytd ? e.return_ytd.toFixed(2) : 'N/A') + '%');
  });

  // Sektory - nejlepší
  console.log('\n=== PRŮMĚRNÁ YTD VÝKONNOST PODLE HLAVNÍHO SEKTORU ===');
  const sectorPerf = {};
  withYTD.forEach(e => {
    const sector = e.sector_1_name;
    if (sector && sector !== 'null') {
      if (!sectorPerf[sector]) sectorPerf[sector] = [];
      sectorPerf[sector].push(e.return_ytd);
    }
  });
  Object.entries(sectorPerf).map(([k, v]) => ({
    sector: k,
    avg: v.reduce((a,b) => a+b, 0) / v.length,
    count: v.length
  })).filter(s => s.count >= 3).sort((a,b) => b.avg - a.avg).forEach(({sector, avg, count}) => {
    console.log(sector + ': ' + avg.toFixed(2) + '% (' + count + ' ETF)');
  });

  // Nová ETF v 2024/2025
  console.log('\n=== NOVÁ ETF (inception 2024-2025) ===');
  const newETFs = allETFs.filter(e => {
    if (!e.inception_date) return false;
    const year = parseInt(e.inception_date.substring(0,4));
    return year >= 2024;
  });
  console.log('Počet nových ETF od 2024: ' + newETFs.length);
  newETFs.sort((a,b) => new Date(b.inception_date) - new Date(a.inception_date)).slice(0,15).forEach(e => {
    console.log('- ' + e.name.substring(0,50) + ' (' + e.inception_date + ') - ' + e.category);
  });

  // 5-star ETF performance
  console.log('\n=== 5-STAR ETF VÝKONNOST YTD ===');
  withYTD.filter(e => e.rating === 5).sort((a,b) => b.return_ytd - a.return_ytd).slice(0,15).forEach((e, i) => {
    console.log((i+1) + '. ' + e.name.substring(0,50) + ' - YTD: ' + (e.return_ytd ? e.return_ytd.toFixed(2) : 'N/A') + '%');
  });

  // Volatilita vs výnos
  console.log('\n=== NEJLEPŠÍ SHARPE (výnos/volatilita) - YTD ===');
  const withVolatility = withYTD.filter(e => e.volatility_1y && e.volatility_1y > 0);
  withVolatility.map(e => ({
    ...e,
    sharpe: e.return_ytd / e.volatility_1y
  })).sort((a,b) => b.sharpe - a.sharpe).slice(0,15).forEach((e, i) => {
    console.log((i+1) + '. ' + e.name.substring(0,45) + ' - YTD: ' + e.return_ytd.toFixed(2) + '%, Vol: ' + e.volatility_1y.toFixed(2) + '%, Sharpe: ' + e.sharpe.toFixed(2));
  });

  // Distribuce replikace
  console.log('\n=== DISTRIBUCE REPLIKACE ===');
  const replic = {};
  allETFs.forEach(e => {
    const r = e.replication || 'Neznámá';
    replic[r] = (replic[r] || 0) + 1;
  });
  Object.entries(replic).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => console.log(k + ': ' + v));

  // Distribuce vs Accumulating
  console.log('\n=== DISTRIBUCE VS AKUMULUJÍCÍ ===');
  const distPol = {};
  allETFs.forEach(e => {
    const d = e.distribution_policy || 'Neznámá';
    distPol[d] = (distPol[d] || 0) + 1;
  });
  Object.entries(distPol).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => console.log(k + ': ' + v));

  // Komodity
  console.log('\n=== KOMODITNÍ ETF - YTD 2025 ===');
  withYTD.filter(e => e.category === 'Komodity').sort((a,b) => b.return_ytd - a.return_ytd).slice(0,10).forEach((e, i) => {
    console.log((i+1) + '. ' + e.name.substring(0,55) + ' - YTD: ' + (e.return_ytd ? e.return_ytd.toFixed(2) : 'N/A') + '%');
  });

  // Krypto
  console.log('\n=== KRYPTO ETF - YTD 2025 ===');
  withYTD.filter(e => e.category === 'Krypto').sort((a,b) => b.return_ytd - a.return_ytd).forEach((e, i) => {
    console.log((i+1) + '. ' + e.name.substring(0,55) + ' - YTD: ' + (e.return_ytd ? e.return_ytd.toFixed(2) : 'N/A') + '%');
  });

  // Nemovitosti
  console.log('\n=== NEMOVITOSTNÍ ETF - YTD 2025 ===');
  withYTD.filter(e => e.category === 'Nemovitosti').sort((a,b) => b.return_ytd - a.return_ytd).slice(0,10).forEach((e, i) => {
    console.log((i+1) + '. ' + e.name.substring(0,55) + ' - YTD: ' + (e.return_ytd ? e.return_ytd.toFixed(2) : 'N/A') + '%');
  });

  // Populární ETF (největší) - jejich YTD
  console.log('\n=== POPULÁRNÍ ETF (>10 mld EUR) - YTD 2025 ===');
  withSize.filter(e => e.fund_size_numeric > 10000000000).sort((a,b) => b.fund_size_numeric - a.fund_size_numeric).forEach((e, i) => {
    const sizeB = (e.fund_size_numeric / 1000000000).toFixed(1);
    console.log((i+1) + '. ' + (e.primary_ticker || e.isin) + ' - ' + e.name.substring(0,40) + ' - ' + sizeB + 'B - YTD: ' + (e.return_ytd ? e.return_ytd.toFixed(2) : 'N/A') + '%');
  });
}

analyze();
