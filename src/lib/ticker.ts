/** Ticker z dat, nebo null. V datech je u ~1 000 fondů prázdný řetězec nebo „-“ (fondy bez listingu
 *  v naší sadě burz) – `??` je nepropustí a na webu pak vzniká „· USA“, prázdné štítky apod. */
export const platnyTicker = (t: unknown): string | null =>
  typeof t === 'string' && t.trim() && t.trim() !== '-' ? t.trim() : null;

/**
 * ZOBRAZOVANÝ TICKER FONDU – jeden pro celý web (kolo 5, 19. 10. 2026).
 * Revize: zlato IE00B4ND3602 mělo na detailu PPFB (XETRA listing), ve srovnávači, na homepage, v žebříčku,
 * v našeptávači i v <title> SGLN (primary_ticker). Pořadí: platný `primary_ticker` → ticker na XETRA →
 * první platný listing. Burzy a jejich tickery dál vypisuje sekce burz na detailu.
 * Kontrola: scripts/check-fund-data.mjs (blok kolo5 B) – detail a srovnávač mají pro top 50 fondů stejný ticker.
 */
export function zobrazovanyTicker(row: Record<string, unknown> | null | undefined): string | null {
  if (!row) return null;
  const p = platnyTicker(row.primary_ticker);
  if (p) return p;
  for (let i = 1; i <= 10; i++) {
    if (/xetra/i.test(String(row[`exchange_${i}_name`] ?? ''))) {
      const t = platnyTicker(row[`exchange_${i}_ticker`]);
      if (t) return t;
    }
  }
  for (let i = 1; i <= 10; i++) {
    const t = platnyTicker(row[`exchange_${i}_ticker`]);
    if (t) return t;
  }
  return null;
}

/** Sloupce, které `zobrazovanyTicker` potřebuje (do selectu). */
export const SLOUPCE_TICKERU = ['primary_ticker', ...Array.from({ length: 10 }, (_, i) => [`exchange_${i + 1}_ticker`, `exchange_${i + 1}_name`]).flat()];
