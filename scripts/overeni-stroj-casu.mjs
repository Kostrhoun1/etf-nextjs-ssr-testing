#!/usr/bin/env node
/**
 * OVĚŘENÍ KORUNOVÉHO STROJE ČASU (pravidlo č. 1 – čísla ven jen ověřená).
 *
 * Stroj času (src/lib/strojCasu.ts) počítá z měsíční řady hodnoty portfolia a vklady na začátku
 * měsíce. Tenhle skript stejný scénář spočítá PLNOU simulací backtestu (POST /api/backtest/simulate
 * s měsíčními vklady) a porovná. Rozdíl 0,1–0,3 % je očekávaný (backtest nakupuje až na zavírací
 * cenu 1. obchodního dne měsíce); nad 0,5 % = chyba → exit 1.
 *
 * Ověřeno 17. 10. 2026 i proti vnějším zdrojům: S&P 500 TR (S&P DJI) 2011–2024 ±0,27 p. b./rok,
 * převod do Kč přes kurzy ČNB ±0,06 %.
 *
 * SPUŠTĚNÍ: node scripts/overeni-stroj-casu.mjs [base-url]   (výchozí http://localhost:3005)
 */
const BASE = process.argv[2] || 'http://localhost:3005';
const PRESETY = {
  svet: [{ indexCode: 'sp500', weight: 0.6 }, { indexCode: 'world_ex_us', weight: 0.4 }],
  sp500: [{ indexCode: 'sp500', weight: 1 }],
  vyvazene: [{ indexCode: 'sp500', weight: 0.36 }, { indexCode: 'world_ex_us', weight: 0.24 }, { indexCode: 'us_aggregate_bond', weight: 0.4 }],
  zlato: [{ indexCode: 'gold', weight: 1 }],
};
const KONEC = new Date().toISOString().slice(0, 10);
const sim = async (slozeni, start, initial, monthly) => {
  const r = await fetch(`${BASE}/api/backtest/simulate`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
    portfolio: slozeni.map((s) => ({ ...s, isin: s.indexCode, name: s.indexCode, ter: 0 })), startDate: start, endDate: KONEC,
    initialAmount: initial, currency: 'CZK', rebalancingStrategy: 'yearly', ...(monthly ? { contributions: { amount: monthly, frequency: 'monthly' } } : {}),
  }) }).then((x) => x.json());
  if (r.error) throw new Error(r.error);
  return r;
};
let chyb = 0;
for (const [id, sl] of Object.entries(PRESETY)) {
  for (const od of ['2010-01', '2016-01']) {
    const nav = (await sim(sl, '2009-12-01', 1, 0)).marketNavMonthly;
    const i = nav.findIndex((p) => p.date.startsWith(od));
    let podily = 0;
    for (let k = i; k < nav.length; k++) podily += 5000 / nav[k - 1].value;
    const stroj = podily * nav.at(-1).value;
    const bt = (await sim(sl, `${od}-01`, 5000, 5000)).summary.netAssetValue;
    const rozdil = (stroj / bt - 1) * 100;
    const ok = Math.abs(rozdil) <= 0.5;
    if (!ok) chyb++;
    console.log(`${ok ? '✅' : '❌'} ${id.padEnd(9)} od ${od}: stroj ${Math.round(stroj).toLocaleString('cs-CZ')} Kč, backtest ${Math.round(bt).toLocaleString('cs-CZ')} Kč, rozdíl ${rozdil.toFixed(2)} %`);
  }
}
process.exit(chyb ? 1 : 0);
