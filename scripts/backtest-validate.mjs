#!/usr/bin/env node
/**
 * Validace SPRÁVNOSTI backtest enginu (ne jen „nespadlo to").
 *
 * Chytá třídu bugů typu „DCA vklady se počítají jako výnos" – proto testuje, že
 * risk/return metriky jsou time-weighted (nezávislé na vkladech), jak to má být.
 *
 *   node scripts/backtest-validate.mjs                 # proti lokálu (localhost:3000)
 *   BASE_URL=https://etfpruvodce.cz node scripts/backtest-validate.mjs
 *
 * Exit 0 = OK, 1 = některý invariant selhal.
 */
const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const END = new Date().toISOString().split('T')[0];

const checks = [];
const check = (name, ok, detail) => { checks.push({ name, ok, detail }); };

async function sim({ portfolio, contributions, start = '2008-07-01', initial = 100000 }) {
  const body = { portfolio, startDate: start, endDate: END, initialAmount: initial,
    rebalancingStrategy: 'yearly', currency: 'CZK', contributions };
  const r = await fetch(BASE + '/api/backtest/simulate', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

const AW = [{ isin: 'ftse_all_world', name: 'All-World', weight: 1, ter: 0.0022, indexCode: 'ftse_all_world' }];

(async () => {
  try {
    // 1) INVARIANCE VŮČI VKLADŮM: u jednoho indexu musí být risk/return metriky
    //    (CAGR, roční výnosy, max. propad) stejné s DCA i bez DCA – vklady nejsou výnos.
    const noDca = await sim({ portfolio: AW });
    const withDca = await sim({ portfolio: AW, contributions: { amount: 5000, frequency: 'monthly' } });

    const cagrDiff = Math.abs(noDca.summary.cagr - withDca.summary.cagr) * 100;
    check('CAGR nezávislý na vkladech (rozdíl < 0,5 pb)', cagrDiff < 0.5, `rozdíl ${cagrDiff.toFixed(2)} pb`);

    const ddDiff = Math.abs(noDca.risk.maxDrawdown.depth - withDca.risk.maxDrawdown.depth) * 100;
    check('Max. propad nezávislý na vkladech (rozdíl < 1 pb)', ddDiff < 1, `rozdíl ${ddDiff.toFixed(2)} pb`);

    const byYear = Object.fromEntries(withDca.returns.annualReturns.map((r) => [r.year, r.return]));
    let worstYearDiff = 0, worstYear = null;
    for (const r of noDca.returns.annualReturns) {
      const d = Math.abs(r.return - (byYear[r.year] ?? r.return)) * 100;
      if (d > worstYearDiff) { worstYearDiff = d; worstYear = r.year; }
    }
    check('Roční výnosy nezávislé na vkladech (max rozdíl < 1 pb)', worstYearDiff < 1,
      `nejhorší rok ${worstYear}: ${worstYearDiff.toFixed(2)} pb`);

    // 2) DRAWDOWN JE REÁLNÝ: 100% světové akcie od 2008 musely projít hlubokým propadem 2008 (< −35 %).
    check('Reálný hluboký propad akcií 2008 (< −35 %)', noDca.risk.maxDrawdown.depth < -0.35,
      `max. propad ${(noDca.risk.maxDrawdown.depth * 100).toFixed(1)} %`);

    // 3) SANITY CAGR: světové akcie v Kč 2008–dnes dávají rozumný výnos (2–15 % p.a.).
    const cagrPct = noDca.summary.cagr * 100;
    check('CAGR akcií v rozumném pásmu (2–15 % p.a.)', cagrPct > 2 && cagrPct < 15, `${cagrPct.toFixed(1)} % p.a.`);

    // 3a) VOLATILITA A SHARPE JSOU REÁLNÉ (guard na bug „denní σ × √12 místo × √252").
    //     Světové akcie mají roční volatilitu ~15–18 %; pod 10 % = špatná anualizace.
    const volPct = noDca.summary.standardDeviation * 100;
    check('Volatilita akcií je reálná (10–30 % p.a.)', volPct > 10 && volPct < 30, `${volPct.toFixed(1)} %`);
    //     Dlouhodobý akciový Sharpe bývá ~0,3–0,7; nad 1,5 = nafouknuté (podhodnocená σ).
    check('Sharpe není nafouknutý (< 1,5)', noDca.summary.sharpeRatio < 1.5, noDca.summary.sharpeRatio.toFixed(2));

    // 3b) Nejlepší rok je reálný i s DCA (guard přímo na bug „vklad = +58 % výnos").
    const bestWithDca = Math.max(...withDca.returns.annualReturns.map((r) => r.return)) * 100;
    check('Nejlepší rok s DCA je reálný (< 40 %)', bestWithDca < 40, `${bestWithDca.toFixed(1)} %`);

    // 4) Vložené peníze s DCA > jednorázový vklad (kontribuce se sčítají do amountInvested).
    check('DCA navyšuje vložené peníze', withDca.summary.amountInvested > noDca.summary.amountInvested,
      `${Math.round(withDca.summary.amountInvested).toLocaleString('cs-CZ')} vs ${Math.round(noDca.summary.amountInvested).toLocaleString('cs-CZ')}`);
  } catch (e) {
    check('Backtest API dostupné', false, String(e).slice(0, 120));
  }

  const failed = checks.filter((c) => !c.ok);
  console.log(`\n[backtest-validate] ${BASE}`);
  for (const c of checks) console.log(`  ${c.ok ? 'OK  ' : 'FAIL'} ${c.name}${c.detail ? ' — ' + c.detail : ''}`);
  console.log(`\n${failed.length ? '❌ ' + failed.length + ' invariant(ů) selhalo' : '✅ všechny invarianty platí'} (${checks.length} kontrol)`);
  process.exit(failed.length ? 1 : 0);
})();
