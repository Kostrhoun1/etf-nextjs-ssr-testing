'use client';

import type { ComparisonETF } from '@/lib/etf-data';
import { SrovnaniParamTabulka, SrovnaniParamKarty, buildParamRows } from '@/components/design-preview/SrovnaniCompareUI';
import { useCurrency } from '@/components/design-preview/currencyStore';

/* Tabulka parametrů dvojice BEZ vlastního přepínače měny – na stránce srovnání je přepínač jen jeden
   (u grafu výnosů po letech), sdílený stav ho drží v souladu (kolo 3, 18. 10. 2026). */
export default function ParametryDvojice({ etf1, etf2, ticker1, ticker2 }: { etf1: ComparisonETF; etf2: ComparisonETF; ticker1: string; ticker2: string }) {
  const [cur] = useCurrency();
  const rows = buildParamRows(etf1, etf2, cur);
  return (
    <>
      <SrovnaniParamTabulka ticker1={ticker1} ticker2={ticker2} rows={rows} />
      <SrovnaniParamKarty ticker1={ticker1} ticker2={ticker2} rows={rows} />
    </>
  );
}
