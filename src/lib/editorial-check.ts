/* Datum poslední ruční kontroly editorských (napevno zadaných) dat.
   ETF ceny/výnosy/TER se aktualizují denně scraperem – ty pokrývá getDataDate().
   Tohle je jiná věc: daňové konstanty a ceníky brokerů se nemění samy, takže je
   jednou měsíčně ověřuje rutina podle MAINTENANCE-mesicni-kontrola.md.

   PŘI MĚSÍČNÍ KONTROLE: po ověření bumpni datum níže (jediné místo v repu). */
const EDITORIAL_CHECK_DATE = new Date('2026-09-01T00:00:00Z');

/** „1. září 2026" – datum poslední ruční kontroly editorských dat. */
export const editorialCheckDateStr = EDITORIAL_CHECK_DATE.toLocaleDateString('cs-CZ', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** ISO datum pro <time dateTime> a strukturovaná data. */
export const editorialCheckDateIso = EDITORIAL_CHECK_DATE.toISOString().slice(0, 10);
