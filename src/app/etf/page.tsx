import { redirect } from 'next/navigation';

/* Bare /design-preview/etf ukazuje příkladový fond (iShares Core S&P 500). */
export default function ETFDetailIndex() {
  redirect('/etf/IE00B5BMR087');
}
