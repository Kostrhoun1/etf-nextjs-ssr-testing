import { permanentRedirect } from 'next/navigation';

/* Holé /etf nemá vlastní obsah – přehled všech fondů je srovnávač. Trvalé přesměrování
   (dřív dočasné 307 na jeden příkladový fond, což Google bral jako nejasný signál). */
export default function ETFDetailIndex() {
  permanentRedirect('/srovnani');
}
