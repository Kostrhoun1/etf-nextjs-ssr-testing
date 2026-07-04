'use client';

import type { ComparisonETF } from '@/lib/etf-data';
import { SrovnaniParamTabulka, SrovnaniParamKarty, buildParamRows } from '@/components/design-preview/SrovnaniCompareUI';
import CurrencyToggle from '@/components/design-preview/CurrencyToggle';
import { useCurrency } from '@/components/design-preview/currencyStore';

/* Klientský obal srovnání parametrů dvou fondů s přepínačem měny výnosů
   (default CZK). Řádky výnosů se přepočítají do zvolené měny. */
export default function SrovnaniParams({
  etf1, etf2, ticker1, ticker2,
}: {
  etf1: ComparisonETF; etf2: ComparisonETF; ticker1: string; ticker2: string;
}) {
  const [cur] = useCurrency();
  const rows = buildParamRows(etf1, etf2, cur);
  return (
    <>
      <div className="mb-3 flex justify-end"><CurrencyToggle size="sm" /></div>
      <SrovnaniParamTabulka ticker1={ticker1} ticker2={ticker2} rows={rows} />
      <SrovnaniParamKarty ticker1={ticker1} ticker2={ticker2} rows={rows} />
    </>
  );
}
