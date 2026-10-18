/**
 * JEDNA paleta pro fondy ve všech srovnáních (porovnání /srovnani/porovnani, dvojice /srovnani/vwce-vs-cspx
 * a /srovnani/[pair], výběr fondů). Revize 18. 10. 2026: porovnání mělo modrou/oranžovou, dvojice
 * teal/indigo – stejný fond měl na dvou stránkách jinou barvu.
 *
 * Barva = identita fondu (1. fond, 2. fond…), NE kladné/záporné (to je zelená/červená v tabulkách).
 * Kategorická paleta ověřená validátorem (dataviz validate_palette.js): rozlišitelná i při poruchách
 * barvocitu (CVD ΔE ≥ 9,1). Zelená a žlutá mají proti bílé kontrast pod 3 : 1 → hodnoty musí být
 * vždy i v textu (popisek, tabulka), barva je jen doplněk.
 */
export const BARVY_FONDU = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'] as const;

/** Barva i-tého fondu (cyklicky, kdyby jich bylo víc). */
export const barvaFondu = (i: number): string => BARVY_FONDU[i % BARVY_FONDU.length];
