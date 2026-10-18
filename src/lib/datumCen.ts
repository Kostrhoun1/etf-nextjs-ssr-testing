/**
 * K jakému dni platí ceny fondu, když známe čas stažení (scraping_date).
 *
 * Scraper běží v noci/ráno (start 02:37 CEST) → stáhne ceny z PŘEDCHOZÍHO obchodního dne. Na webu dřív
 * stálo „Data k 18. 10. 2026“ (neděle = den stažení), ale ceny i kurzy byly z pátku 16. 10. (test s pokročilým
 * uživatelem 18. 10. 2026). Pravidlo č. 1: návštěvník vidí, k jakému dni data platí.
 * Stažení před 18:00 pražského času → předchozí pracovní den; později → týž den (je-li pracovní).
 * Svátky burz neznáme – nejhůř ukážeme o den novější datum, než je skutečná poslední cena.
 */
export function datumCen(stazeno: Date): Date {
  const praha = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false }).formatToParts(stazeno);
  const v = (t: string) => Number(praha.find((p) => p.type === t)?.value);
  const d = new Date(Date.UTC(v('year'), v('month') - 1, v('day'), 12));
  const pracovni = (x: Date) => x.getUTCDay() !== 0 && x.getUTCDay() !== 6;
  if (v('hour') < 18 || !pracovni(d)) {
    do d.setUTCDate(d.getUTCDate() - 1); while (!pracovni(d));
  }
  return d;
}
