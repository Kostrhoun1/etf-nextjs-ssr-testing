/**
 * Srovnání dvojic ETF (/srovnani/<a>-vs-<b>).
 * POPULAR_PAIRS se předgenerují při buildu; SITEMAP_PAIRS jdou do sitemapy (předgenerované
 * + dvojice nalinkované z webu). Ostatní dvojice vznikají on-demand a do sitemapy NEpatří
 * (nekonečný prostor URL by jen pálil ISR zápisy).
 * Proč v sitemapě: dvojice vyhrávají na Seznamu (např. „VWCE výnos" 1. místo), ale v sitemapě
 * nebyly (deep dive 17. 10. 2026).
 */
export const POPULAR_PAIRS = [
  'vwce-vs-iwda', 'iwda-vs-cspx', 'swrd-vs-iwda', 'cspx-vs-vuaa', 'vusa-vs-vuaa',
  'cspx-vs-spy5', 'vwce-vs-vwrl', 'cspx-vs-eunl', 'vwce-vs-eunl',
  // Podle našeptávače Googlu (17. 10. 2026) – takhle lidé srovnání opravdu píšou:
  'sxr8-vs-vuaa', 'cspx-vs-spyl', 'iwda-vs-vwra', 'cspx-vs-vwra', 'cspx-vs-vusa',
  // „Stejný fond, jiný ticker" – odpověď „ano, je to stejný fond" (dřív 404):
  'iwda-vs-eunl', 'iwda-vs-swda', 'cspx-vs-sxr8', 'vuaa-vs-vuag', 'vwce-vs-vwra',
];

// vwce-vs-cspx má vlastní kurátorskou stránku (statická routa), do sitemapy ale patří.
export const SITEMAP_PAIRS = [...new Set([...POPULAR_PAIRS, 'vwce-vs-cspx'])];
