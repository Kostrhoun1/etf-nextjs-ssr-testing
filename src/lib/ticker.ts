/** Ticker z dat, nebo null. V datech je u ~1 000 fondů prázdný řetězec nebo „-“ (fondy bez listingu
 *  v naší sadě burz) – `??` je nepropustí a na webu pak vzniká „· USA“, prázdné štítky apod. */
export const platnyTicker = (t: unknown): string | null =>
  typeof t === 'string' && t.trim() && t.trim() !== '-' ? t.trim() : null;
